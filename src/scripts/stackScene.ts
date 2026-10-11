// The interactive 3D stack of the home page: four slabs (interface, server, data, production)
// that open as the section scrolls in, tilt with the pointer and light up one at a time.
//
// Loaded on demand by StackSection.astro, so Three.js never weighs on the first paint.
// It renders only while something is moving, and stops when the section leaves the screen.
import {
  BoxGeometry,
  BufferGeometry as Geometry,
  Color,
  CylinderGeometry,
  DirectionalLight,
  EdgesGeometry,
  Group,
  HemisphereLight,
  LineBasicMaterial,
  LineLoop,
  LineSegments,
  Mesh,
  MeshLambertMaterial,
  OrthographicCamera,
  Raycaster,
  Scene,
  SphereGeometry,
  Vector2,
  Vector3,
  WebGLRenderer,
  WireframeGeometry,
  type BufferGeometry,
  type Object3D,
} from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';

export interface StackSceneOptions {
  canvas: HTMLCanvasElement;
  /** Element whose box the canvas fills and whose scroll position opens the stack */
  host: HTMLElement;
  layers: number;
  reducedMotion: boolean;
  /**
   * The pointer picked a layer on the canvas (null when it left every layer).
   * `held` is true for a tap or a click: the choice should outlive the pointer.
   */
  onPick: (index: number | null, held: boolean) => void;
}

export interface StackScene {
  setActive: (index: number | null) => void;
  dispose: () => void;
}

const SLAB = { width: 3.2, height: 0.42, radius: 0.16 };
const GAP_CLOSED = 0.1;
const GAP_OPEN = 1.25;
const VIEW_HEIGHT = 7.7;
const MAX_PIXEL_RATIO = 1.75;
// Phones have dense screens and small batteries: fewer pixels there
const MAX_PIXEL_RATIO_TOUCH = 1.5;

interface Palette {
  slab: Color;
  detail: Color;
  edge: Color;
  accent: Color;
  dim: Color;
}

const readPalette = (): Palette => {
  const styles = getComputedStyle(document.documentElement);
  const read = (name: string, fallback: string) => new Color(styles.getPropertyValue(name).trim() || fallback);
  return {
    slab: read('--color-bg-tertiary', '#252932'),
    detail: read('--color-border-light', '#374151'),
    edge: read('--color-text-tertiary', '#8B93A1'),
    accent: read('--color-accent-light', '#60A5FA'),
    dim: read('--color-border-default', '#1F2937'),
  };
};

interface Layer {
  group: Group;
  slab: Mesh<BufferGeometry, MeshLambertMaterial>;
  edges: LineLoop<BufferGeometry, LineBasicMaterial>;
  /** Everything standing on the slab: it grows out of it as the stack opens */
  parts: Group;
  details: Mesh<BufferGeometry, MeshLambertMaterial>[];
  lines: (LineSegments<BufferGeometry, LineBasicMaterial> | LineLoop<BufferGeometry, LineBasicMaterial>)[];
  /** 0 = at rest, 1 = picked */
  glow: number;
}

/** Small parts standing on a slab, so each layer reads as what it is. */
const buildDetails = (index: number, top: number) => {
  const boxes: [number, number, number, number, number, number][] = [];
  const cylinders: [number, number, number, number, number][] = [];
  let globe = false;

  if (index === 0) {
    // Interface: a header, a sidebar and three cards
    boxes.push([2.5, 0.07, 0.34, 0, 0, -1.02], [0.6, 0.07, 1.9, -0.95, 0, 0.22]);
    boxes.push([0.82, 0.1, 0.86, -0.02, 0, -0.3], [0.82, 0.1, 0.86, 0.9, 0, -0.3], [1.74, 0.1, 0.86, 0.44, 0, 0.74]);
  } else if (index === 1) {
    // Server: six modules in two rows
    for (let row = 0; row < 2; row++) {
      for (let column = 0; column < 3; column++) boxes.push([0.74, 0.2, 0.98, -0.92 + column * 0.92, 0, -0.6 + row * 1.2]);
    }
  } else if (index === 2) {
    // Data: three stores of stacked discs
    for (const x of [-0.95, 0, 0.95]) {
      for (let disc = 0; disc < 3; disc++) cylinders.push([0.36, 0.11, x, disc * 0.14, x === 0 ? 0.3 : -0.25]);
    }
  } else {
    // Production: a small globe on a pad
    cylinders.push([0.95, 0.06, 0, 0, 0]);
    globe = true;
  }

  const meshes: { geometry: BufferGeometry; x: number; y: number; z: number }[] = [];
  for (const [w, h, d, x, y, z] of boxes) meshes.push({ geometry: new BoxGeometry(w, h, d), x, y: top + y + h / 2, z });
  for (const [r, h, x, y, z] of cylinders) meshes.push({ geometry: new CylinderGeometry(r, r, h, 28), x, y: top + y + h / 2, z });
  return { meshes, globe };
};

export function createStackScene({ canvas, host, layers: layerCount, reducedMotion, onPick }: StackSceneOptions): StackScene {
  const coarse = window.matchMedia('(pointer: coarse)').matches;
  const renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'low-power' });
  renderer.setClearAlpha(0);

  const scene = new Scene();
  const camera = new OrthographicCamera(-1, 1, 1, -1, 0.1, 50);
  camera.position.set(6, 3.5, 6);
  camera.lookAt(0, 0, 0);

  const sky = new HemisphereLight(0xffffff, 0x6b7385, 2.3);
  const sun = new DirectionalLight(0xffffff, 1.9);
  sun.position.set(-3, 6, 4);
  scene.add(sky, sun);

  const stack = new Group();
  scene.add(stack);

  let palette = readPalette();
  const slabGeometry = new RoundedBoxGeometry(SLAB.width, SLAB.height, SLAB.width, 4, SLAB.radius);
  // A rounded box has no hard edge for EdgesGeometry to find: its rims are drawn as two outlines
  const rim = (y: number) => {
    const half = SLAB.width / 2;
    const inner = half - SLAB.radius;
    const points: Vector3[] = [];
    const corners: [number, number, number][] = [[inner, inner, 0], [-inner, inner, 90], [-inner, -inner, 180], [inner, -inner, 270]];
    for (const [cx, cz, from] of corners) {
      for (let stepIndex = 0; stepIndex <= 8; stepIndex++) {
        const angle = ((from + (stepIndex / 8) * 90) * Math.PI) / 180;
        points.push(new Vector3(cx + Math.cos(angle) * SLAB.radius, y, cz + Math.sin(angle) * SLAB.radius));
      }
    }
    return new Geometry().setFromPoints(points);
  };
  const topRim = rim(SLAB.height / 2 - SLAB.radius * 0.3);
  const bottomRim = rim(-SLAB.height / 2 + SLAB.radius * 0.3);
  const disposables: { dispose: () => void }[] = [slabGeometry, topRim, bottomRim];

  const layers: Layer[] = Array.from({ length: layerCount }, (_, index) => {
    const group = new Group();
    const slab = new Mesh(slabGeometry, new MeshLambertMaterial({ color: palette.slab }));
    slab.userData.layer = index;
    const edges = new LineLoop(topRim, new LineBasicMaterial({ color: palette.edge }));
    const under = new LineLoop(bottomRim, edges.material);
    const parts = new Group();
    parts.position.y = SLAB.height / 2;
    group.add(slab, edges, under, parts);

    const layer: Layer = { group, slab, edges, parts, details: [], lines: [], glow: 0 };
    const { meshes, globe } = buildDetails(index, 0);
    for (const { geometry, x, y, z } of meshes) {
      const mesh = new Mesh(geometry, new MeshLambertMaterial({ color: palette.detail }));
      mesh.position.set(x, y, z);
      const outline = new EdgesGeometry(geometry, 30);
      const line = new LineSegments(outline, new LineBasicMaterial({ color: palette.edge }));
      line.position.copy(mesh.position);
      parts.add(mesh, line);
      layer.details.push(mesh);
      layer.lines.push(line);
      disposables.push(geometry, outline, mesh.material, line.material);
    }
    if (globe) {
      const sphere = new SphereGeometry(0.4, 12, 8);
      const wire = new WireframeGeometry(sphere);
      const line = new LineSegments(wire, new LineBasicMaterial({ color: palette.edge }));
      line.position.set(0, 0.5, 0);
      parts.add(line);
      layer.lines.push(line);
      disposables.push(sphere, wire, line.material);
    }
    disposables.push(slab.material, edges.material);
    stack.add(group);
    return layer;
  });

  // ---------- state: every value eases toward a target, and a frame is drawn only while one moves ----------
  let open = 0;
  let openTarget = 0;
  let tiltX = 0;
  let tiltY = 0;
  let tiltTargetX = 0;
  let tiltTargetY = 0;
  let active: number | null = null;
  let frame = 0;
  let previous = 0;
  let onScreen = false;
  let disposed = false;

  const applyColors = () => {
    layers.forEach((layer, index) => {
      const dimmed = active !== null && active !== index ? 1 - layer.glow : 0;
      layer.slab.material.color.copy(palette.slab).lerp(palette.accent, layer.glow * 0.1);
      layer.edges.material.color.copy(palette.edge).lerp(palette.accent, layer.glow).lerp(palette.dim, dimmed * 0.5);
      for (const mesh of layer.details) mesh.material.color.copy(palette.detail).lerp(palette.accent, layer.glow * 0.3);
      for (const line of layer.lines) line.material.color.copy(palette.edge).lerp(palette.accent, layer.glow).lerp(palette.dim, dimmed * 0.5);
    });
  };

  const place = () => {
    const gap = GAP_CLOSED + (GAP_OPEN - GAP_CLOSED) * open;
    const step = SLAB.height + gap;
    const total = step * (layerCount - 1);
    layers.forEach((layer, index) => {
      // Layer 0 (interface) is on top
      layer.group.position.y = total / 2 - index * step;
      // The picked layer slides toward the viewer
      layer.group.position.x = layer.glow * 0.34;
      layer.group.position.z = layer.glow * 0.34;
      layer.parts.scale.y = Math.max(0.001, open);
    });
    stack.rotation.y = tiltX * 0.42;
    stack.rotation.x = tiltY * 0.14;
  };

  const resize = () => {
    const { width, height } = host.getBoundingClientRect();
    if (!width || !height) return;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, coarse ? MAX_PIXEL_RATIO_TOUCH : MAX_PIXEL_RATIO));
    renderer.setSize(width, height, false);
    const aspect = width / height;
    // Fit the open stack in both directions: a narrow column must not crop the slabs' corners
    const viewHeight = Math.max(VIEW_HEIGHT, (SLAB.width * 1.75) / aspect);
    camera.top = viewHeight / 2;
    camera.bottom = -viewHeight / 2;
    camera.right = (viewHeight * aspect) / 2;
    camera.left = -camera.right;
    camera.updateProjectionMatrix();
    request();
  };

  const ease = (value: number, target: number, dt: number, seconds: number) => {
    if (reducedMotion) return target;
    const next = value + (target - value) * (1 - Math.exp(-dt / seconds));
    return Math.abs(target - next) < 1e-3 ? target : next;
  };

  const tick = (now: number) => {
    frame = 0;
    if (disposed) return;
    const dt = previous ? Math.min((now - previous) / 1000, 1 / 30) : 1 / 60;
    previous = now;

    open = ease(open, openTarget, dt, 0.32);
    tiltX = ease(tiltX, tiltTargetX, dt, 0.22);
    tiltY = ease(tiltY, tiltTargetY, dt, 0.22);
    let moving = open !== openTarget || tiltX !== tiltTargetX || tiltY !== tiltTargetY;
    layers.forEach((layer, index) => {
      const target = active === index ? 1 : 0;
      layer.glow = ease(layer.glow, target, dt, 0.16);
      if (layer.glow !== target) moving = true;
    });

    place();
    applyColors();
    renderer.render(scene, camera);
    if (moving && onScreen) frame = requestAnimationFrame(tick);
    else previous = 0;
  };
  function request() {
    if (!frame && !disposed) frame = requestAnimationFrame(tick);
  }

  // ---------- inputs ----------
  const measureScroll = () => {
    const rect = host.getBoundingClientRect();
    const viewport = window.innerHeight || 1;
    // Closed while the block is entering from the bottom, fully open once its middle reaches mid-screen
    const progress = (viewport - rect.top) / (viewport * 0.5 + rect.height * 0.5);
    openTarget = Math.min(1, Math.max(0, progress));
    request();
  };

  const raycaster = new Raycaster();
  const pointer = new Vector2();
  const slabs: Object3D[] = layers.map((layer) => layer.slab);
  let picked: number | null = null;
  const pickAt = (event: PointerEvent) => {
    const rect = canvas.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;
    tiltTargetX = (x - 0.5) * 2;
    tiltTargetY = (y - 0.5) * 2;
    pointer.set(x * 2 - 1, -(y * 2 - 1));
    raycaster.setFromCamera(pointer, camera);
    const hit = raycaster.intersectObjects(slabs, false)[0];
    const next = hit ? (hit.object.userData.layer as number) : null;
    const held = event.type === 'pointerdown';
    if (next !== picked || held) {
      picked = next;
      canvas.style.cursor = next === null ? '' : 'pointer';
      onPick(next, held);
    }
    request();
  };
  const leave = () => {
    tiltTargetX = 0;
    tiltTargetY = 0;
    if (picked !== null) {
      picked = null;
      canvas.style.cursor = '';
      onPick(null, false);
    }
    request();
  };

  const controller = new AbortController();
  const { signal } = controller;
  canvas.addEventListener('pointermove', pickAt, { signal });
  canvas.addEventListener('pointerdown', pickAt, { signal });
  canvas.addEventListener('pointerleave', leave, { signal });
  window.addEventListener('scroll', measureScroll, { signal, passive: true });
  window.addEventListener('resize', resize, { signal, passive: true });

  const visibility = new IntersectionObserver((entries) => {
    onScreen = entries[entries.length - 1].isIntersecting;
    if (onScreen) {
      measureScroll();
      request();
    }
  });
  visibility.observe(host);

  // The site's theme toggle rewrites data-theme: repaint with the new tokens
  const themeObserver = new MutationObserver(() => {
    palette = readPalette();
    request();
  });
  themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

  canvas.addEventListener(
    'webglcontextlost',
    (event) => {
      event.preventDefault();
      cancelAnimationFrame(frame);
      frame = 0;
    },
    { signal },
  );
  canvas.addEventListener('webglcontextrestored', () => request(), { signal });

  resize();
  measureScroll();

  return {
    setActive(index) {
      active = index;
      request();
    },
    dispose() {
      disposed = true;
      cancelAnimationFrame(frame);
      controller.abort();
      visibility.disconnect();
      themeObserver.disconnect();
      for (const item of disposables) item.dispose();
      renderer.dispose();
    },
  };
}
