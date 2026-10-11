// The signature coin of the home page, modelled entirely in code after the 200 CFA franc coin of
// West Africa (BCEAO, 2003-2018): bimetal, a brass centre in a cupronickel ring, 24.5 mm across,
// 2.1 mm thick, struck in coin alignment.
//
// Parts, in units of the coin's radius (R = 1, so the diameter is 2):
//   flan            thickness 4.2/24.5 (2.1 mm on 24.5 mm)
//   ring            cupronickel, 0.722 -> 1
//     rim (listel)  0.962 -> 0.99, raised 0.016 above the field, 0.012 chamfer to the edge
//     reeded edge   120 reeds, 0.026 wide x 0.018 proud
//     legend band   0.736 -> 0.948, raised letters 0.11 tall centred on 0.85
//     inner lip     a raised line 0.012 wide at 0.728, where the ring grips the centre
//   centre          brass, radius 0.722, matte and grained
//     chain         40 oval links (0.062 x 0.034) at 0.635, on each face
//     obverse       "AN" 0.48 tall and "DEV" 0.16 tall, slanted 11 degrees, raised 0.02 with a bevel
//     reverse       four stacked lozenges, 0.56 wide, raised 0.014
//   alignment       coin alignment: the reverse is upside down, so the coin turns over top to bottom
//
// Lathe for the turned bodies, extrusion for the devices, instancing for reeds and links.
import {
  ACESFilmicToneMapping,
  BoxGeometry,
  CanvasTexture,
  Color,
  DirectionalLight,
  ExtrudeGeometry,
  Group,
  InstancedMesh,
  LatheGeometry,
  Matrix4,
  Mesh,
  MeshStandardMaterial,
  Path,
  PerspectiveCamera,
  PMREMGenerator,
  Quaternion,
  RepeatWrapping,
  RingGeometry,
  Scene,
  Shape,
  SRGBColorSpace,
  TorusGeometry,
  Vector2,
  Vector3,
  WebGLRenderer,
} from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { gsap } from 'gsap';

export interface CoinSceneOptions {
  canvas: HTMLCanvasElement;
  obverseLegend: string;
  reverseLegend: string;
}

export interface CoinScene {
  /** Fixed pose for checks: rotation about the vertical and horizontal axes, in radians */
  pose: (ry: number, rx: number) => void;
  info: () => { triangles: number; calls: number };
  /** Held in the middle of the screen: the idle balance stops and the coin follows the hand */
  setFocus: (focused: boolean) => void;
  /** Turn the coin over, top to bottom */
  flip: () => void;
  /** Turn by hand, in radians (keyboard) */
  nudge: (ry: number, rx: number) => void;
  /** True when the last press on the coin moved it: that press was a drag, not a click */
  dragged: () => boolean;
  /** Match the drawing buffer to the canvas after its box changed */
  resize: () => void;
  dispose: () => void;
}

const T = 4.2 / 24.5;
const HALF = T / 2;
const FIELD = HALF - 0.016;
const CIRCLE = 0.728;
const RING_IN = 0.736;
const RING_OUT = 0.962;
const RAISED = 0.008;
const REEDS = 120;
const LINKS = 40;
const SLANT = Math.tan((11 * Math.PI) / 180);
const MAX_PIXEL_RATIO = 2;

const v = (r: number, y: number) => new Vector2(r, y);

const SEAM = CIRCLE - 0.006;
/** Half cross-sections, bottom to top, turned about the coin's axis. */
const mirrored = (face: [number, number][]) => [...face.map(([r, y]) => v(r, -y)), ...[...face].reverse().map(([r, y]) => v(r, y))];
/** The ring, from the seam out: inner lip, legend band, rim, edge. */
const ringProfile = () =>
  mirrored([
    [SEAM, FIELD - 0.02],
    [SEAM, FIELD],
    [CIRCLE - 0.002, FIELD + RAISED],
    [CIRCLE + 0.004, FIELD + RAISED],
    [RING_IN, FIELD],
    [RING_OUT - 0.012, FIELD],
    [RING_OUT, HALF],
    [0.99, HALF],
    [1, HALF - 0.012],
  ]);
/** The centre: a plain disc that the ring grips. */
const centreProfile = () =>
  mirrored([
    [0, FIELD],
    [SEAM, FIELD],
  ]);

type Outline = [number, number][];
/** A glyph outline, slanted like the numerals of the coin it is modelled on. */
const slanted = (points: Outline): Outline => points.map(([x, y]) => [x + y * SLANT, y]);
const trace = <Target extends Path>(target: Target, points: Outline) => {
  slanted(points).forEach(([x, y], index) => (index ? target.lineTo(x, y) : target.moveTo(x, y)));
  target.closePath();
  return target;
};
const glyph = (outline: Outline, hole?: Outline) => {
  const shape = trace(new Shape(), outline);
  if (hole) shape.holes.push(trace(new Path(), hole));
  return shape;
};
/** The right half of an ellipse, top to bottom: the bowl of a D. */
const bowl = (x: number, rx: number, y0: number, y1: number): Outline =>
  Array.from({ length: 13 }, (_, index) => {
    const angle = Math.PI / 2 - (index / 12) * Math.PI;
    return [x + Math.cos(angle) * rx, (y0 + y1) / 2 + (Math.sin(angle) * (y1 - y0)) / 2];
  });

// Glyphs drawn in a box 1 unit tall; `advance` is the width each one takes on its line
const GLYPHS: Record<string, { shape: () => Shape; advance: number }> = {
  A: {
    advance: 0.92,
    shape: () =>
      glyph(
        [[0, 0], [0.2, 0], [0.275, 0.25], [0.545, 0.25], [0.62, 0], [0.82, 0], [0.51, 1], [0.31, 1]],
        [[0.328, 0.41], [0.41, 0.72], [0.492, 0.41]],
      ),
  },
  N: {
    advance: 0.82,
    shape: () => glyph([[0, 0], [0.19, 0], [0.19, 0.65], [0.53, 0], [0.72, 0], [0.72, 1], [0.53, 1], [0.53, 0.35], [0.19, 1], [0, 1]]),
  },
  D: {
    advance: 0.86,
    shape: () => glyph([[0, 0], [0, 1], ...bowl(0.34, 0.38, 0, 1)], [[0.2, 0.2], [0.2, 0.8], ...bowl(0.34, 0.19, 0.2, 0.8)]),
  },
  E: {
    advance: 0.74,
    shape: () =>
      glyph([[0, 0], [0.6, 0], [0.6, 0.2], [0.2, 0.2], [0.2, 0.4], [0.52, 0.4], [0.52, 0.6], [0.2, 0.6], [0.2, 0.8], [0.6, 0.8], [0.6, 1], [0, 1]]),
  },
  V: {
    advance: 0.8,
    shape: () => glyph([[0, 1], [0.21, 1], [0.4, 0.3], [0.59, 1], [0.8, 1], [0.5, 0], [0.3, 0]]),
  },
};

/** Raised circular legend: brighter, higher letters on a mid-grey ground (used as colour and as bump). */
const legendTexture = (text: string, font: string) => {
  const size = 1024;
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  const context = canvas.getContext('2d');
  if (!context) return null;
  context.fillStyle = '#8a8a8a';
  context.fillRect(0, 0, size, size);
  context.fillStyle = '#fff';
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  // The ring's UVs map the unit square to [-RING_OUT, RING_OUT]: the legend is centred on 0.85
  const radius = (0.85 / RING_OUT) * (size / 2);
  context.font = `700 ${Math.round(size * 0.058)}px ${font}`;
  const letters = [...text];
  const stepAngle = (Math.PI * 2) / letters.length;
  letters.forEach((letter, index) => {
    context.save();
    context.translate(size / 2, size / 2);
    context.rotate(index * stepAngle);
    context.fillText(letter, 0, -radius);
    context.restore();
  });
  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  texture.anisotropy = 8;
  return texture;
};

/** Fine grain for the fields: struck metal is matte, not mirror-polished. */
const grainTexture = () => {
  const size = 128;
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  const context = canvas.getContext('2d');
  if (!context) return null;
  const image = context.createImageData(size, size);
  // A fixed seed: the coin looks the same on every visit
  let seed = 7;
  for (let index = 0; index < image.data.length; index += 4) {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    const value = 150 + (seed >>> 25);
    image.data[index] = image.data[index + 1] = image.data[index + 2] = value;
    image.data[index + 3] = 255;
  }
  context.putImageData(image, 0, 0);
  const texture = new CanvasTexture(canvas);
  texture.wrapS = texture.wrapT = RepeatWrapping;
  texture.repeat.set(5, 5);
  return texture;
};

export function createCoinScene({ canvas, obverseLegend, reverseLegend }: CoinSceneOptions): CoinScene {
  const renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'low-power' });
  renderer.setClearAlpha(0);
  // Metal seen head-on reflects the whole room: tone mapping keeps it from burning out
  renderer.toneMapping = ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.78;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, MAX_PIXEL_RATIO));

  const scene = new Scene();
  const camera = new PerspectiveCamera(30, 1, 0.1, 30);
  camera.position.set(0, 0, 5.6);

  // Metal needs something to reflect: a small procedural room, baked once
  const pmrem = new PMREMGenerator(renderer);
  const room = new RoomEnvironment();
  const environment = pmrem.fromScene(room, 0.04);
  scene.environment = environment.texture;
  scene.environmentIntensity = 0.55;
  room.dispose();
  pmrem.dispose();

  // A low light from the upper left, so every raised part casts a readable highlight
  const key = new DirectionalLight(0xffffff, 2.2);
  key.position.set(-3, 3.2, 2.2);
  scene.add(key);

  const disposables: { dispose: () => void }[] = [environment];
  const keep = <Item extends { dispose: () => void }>(item: Item) => {
    disposables.push(item);
    return item;
  };

  const grain = grainTexture();
  if (grain) keep(grain);
  // Cupronickel for the ring, brass for the centre: matte, grained fields and brighter struck relief
  const cupronickel = keep(new MeshStandardMaterial({ color: new Color('#a6a8aa'), metalness: 1, roughness: 0.5, bumpMap: grain, bumpScale: 0.5 }));
  const brass = keep(new MeshStandardMaterial({ color: new Color('#b8933c'), metalness: 1, roughness: 0.5, bumpMap: grain, bumpScale: 0.5 }));
  const struck = keep(new MeshStandardMaterial({ color: new Color('#e6c97a'), metalness: 1, roughness: 0.28 }));

  // The coin turns about Z here, so its faces look at the camera; the lathe turns about Y
  const coin = new Group();
  const turned = new Group();
  turned.rotation.x = Math.PI / 2;
  coin.add(turned);
  scene.add(coin);

  turned.add(new Mesh(keep(new LatheGeometry(ringProfile(), 96)), cupronickel));
  turned.add(new Mesh(keep(new LatheGeometry(centreProfile(), 72)), brass));

  const matrix = new Matrix4();
  const turn = new Quaternion();
  const axisZ = new Vector3(0, 0, 1);
  const one = new Vector3(1, 1, 1);

  // Reeded edge
  const reeds = new InstancedMesh(keep(new BoxGeometry(0.018, 0.026, T - 0.034)), cupronickel, REEDS);
  for (let index = 0; index < REEDS; index++) {
    const angle = (index / REEDS) * Math.PI * 2;
    turn.setFromAxisAngle(axisZ, angle);
    matrix.compose(new Vector3(Math.cos(angle), Math.sin(angle), 0), turn, one);
    reeds.setMatrixAt(index, matrix);
  }
  coin.add(reeds);

  // Chain of oval links round the core, both faces in one draw call
  const links = new InstancedMesh(keep(new TorusGeometry(0.017, 0.0055, 6, 16)), struck, LINKS * 2);
  const oval = new Vector3(1, 1.85, 1);
  for (let index = 0; index < LINKS; index++) {
    const angle = (index / LINKS) * Math.PI * 2;
    const [x, y] = [Math.cos(angle) * 0.635, Math.sin(angle) * 0.635];
    // Long axis along the circle
    turn.setFromAxisAngle(axisZ, angle);
    matrix.compose(new Vector3(x, y, FIELD), turn, oval);
    links.setMatrixAt(index, matrix);
    matrix.compose(new Vector3(x, y, -FIELD), turn, oval);
    links.setMatrixAt(LINKS + index, matrix);
  }
  coin.add(links);

  // Legends, raised on the band between the rim and the inner circle
  const font = getComputedStyle(document.documentElement).getPropertyValue('--font-heading').trim() || 'sans-serif';
  const legendGeometry = keep(new RingGeometry(RING_IN + 0.004, RING_OUT - 0.014, 128, 1));
  const addLegend = (text: string, back: boolean) => {
    const texture = legendTexture(text, font);
    if (!texture) return;
    keep(texture);
    const material = keep(new MeshStandardMaterial({ color: new Color('#c4c8cd'), metalness: 1, roughness: 0.42, map: texture, bumpMap: texture, bumpScale: 1.1 }));
    const mesh = new Mesh(legendGeometry, material);
    mesh.position.z = (back ? -1 : 1) * (FIELD + 0.0015);
    // Coin alignment: the reverse is turned over top to bottom
    if (back) mesh.rotation.x = Math.PI;
    coin.add(mesh);
  };
  addLegend(obverseLegend, false);
  addLegend(reverseLegend, true);

  // Obverse: two lines of raised, slanted lettering
  const geometries = new Map<string, ExtrudeGeometry>();
  const line = (text: string, height: number, y: number, depth: number) => {
    const letters = [...text];
    const width = letters.reduce((sum, letter) => sum + GLYPHS[letter].advance, 0) - 0.1;
    // Centre the slanted line on the coin's axis
    let x = -(width * height) / 2 - (SLANT * height) / 2;
    for (const letter of letters) {
      let geometry = geometries.get(letter);
      if (!geometry) {
        geometry = keep(new ExtrudeGeometry(GLYPHS[letter].shape(), { depth: depth / height, bevelEnabled: true, bevelThickness: 0.02, bevelSize: 0.018, bevelSegments: 2, curveSegments: 4 }));
        geometries.set(letter, geometry);
      }
      const mesh = new Mesh(geometry, struck);
      mesh.scale.setScalar(height);
      mesh.position.set(x, y, FIELD);
      coin.add(mesh);
      x += GLYPHS[letter].advance * height;
    }
  };
  line('AN', 0.48, -0.1, 0.02);
  line('DEV', 0.16, -0.36, 0.02);

  // Reverse: four stacked lozenges, the stack of the home page
  const lozenge = new Shape();
  ([[-0.28, 0], [0, 0.082], [0.28, 0], [0, -0.082]] as Outline).forEach(([x, y], index) => (index ? lozenge.lineTo(x, y) : lozenge.moveTo(x, y)));
  lozenge.closePath();
  const lozengeGeometry = keep(new ExtrudeGeometry(lozenge, { depth: 0.014, bevelEnabled: true, bevelThickness: 0.004, bevelSize: 0.004, bevelSegments: 1 }));
  const back = new Group();
  back.rotation.x = Math.PI;
  back.position.z = -FIELD;
  [0.255, 0.085, -0.085, -0.255].forEach((y) => {
    const mesh = new Mesh(lozengeGeometry, struck);
    mesh.position.y = y;
    back.add(mesh);
  });
  coin.add(back);

  // ---------- motion (GSAP) ----------
  // `base` is where the coin rests (0 or π about the horizontal axis: which face is up),
  // `sway` the idle balance, `lean` the pointer.
  const state = { base: 0, swayY: 0, swayX: 0, leanY: 0, leanX: 0, lift: 1, idle: 1 };
  // Rotation given by the hand while the coin is held, and its leftover speed once released
  const hand = { x: 0, y: 0, vx: 0, vy: 0 };
  let focused = false;
  let dragging = false;
  let moved = false;
  let posed = false;
  let last = 0;
  const render = (time: number) => {
    const dt = last ? Math.min(time - last, 1 / 30) : 1 / 60;
    last = time;
    if (focused && !dragging) {
      // Released: the coin keeps turning and slows down, like a coin spun on a table
      hand.y += hand.vy * dt;
      hand.x += hand.vx * dt;
      const drag = Math.exp(-dt * 1.9);
      hand.vy *= drag;
      hand.vx *= drag;
    }
    if (!posed) {
      coin.rotation.y = (state.swayY + state.leanY) * state.idle + hand.y;
      coin.rotation.x = state.base + (state.swayX + state.leanX) * state.idle + hand.x;
    }
    coin.scale.setScalar(state.lift);
    renderer.render(scene, camera);
  };

  const sway = gsap
    .timeline({ repeat: -1, yoyo: true, defaults: { ease: 'sine.inOut' } })
    .fromTo(state, { swayY: -0.42 }, { swayY: 0.42, duration: 3.4 }, 0)
    .fromTo(state, { swayX: 0.1 }, { swayX: -0.08, duration: 2.3 }, 0);

  const leanY = gsap.quickTo(state, 'leanY', { duration: 0.6, ease: 'power3.out' });
  const leanX = gsap.quickTo(state, 'leanX', { duration: 0.6, ease: 'power3.out' });
  let face = 0;
  const flip = () => {
    // Counted apart from the tween, so quick hovers still land on a face
    face += 1;
    gsap.to(state, { base: face * Math.PI, duration: 1.1, ease: 'power3.inOut', overwrite: 'auto' });
    gsap.fromTo(state, { lift: 1 }, { lift: 1.08, duration: 0.55, ease: 'power2.out', yoyo: true, repeat: 1, overwrite: 'auto' });
  };

  const controller = new AbortController();
  const { signal } = controller;
  window.addEventListener(
    'pointermove',
    (event) => {
      leanY(((event.clientX / window.innerWidth) * 2 - 1) * 0.35);
      leanX(((event.clientY / window.innerHeight) * 2 - 1) * 0.22);
    },
    { signal, passive: true },
  );
  // In its corner the coin turns over when the pointer arrives; held, it answers to the hand only
  canvas.addEventListener('pointerenter', () => !focused && flip(), { signal });

  let pressX = 0;
  let pressY = 0;
  let stamp = 0;
  canvas.addEventListener(
    'pointerdown',
    (event) => {
      moved = false;
      if (!focused) return;
      dragging = true;
      pressX = event.clientX;
      pressY = event.clientY;
      stamp = performance.now();
      hand.vx = hand.vy = 0;
      canvas.setPointerCapture(event.pointerId);
    },
    { signal },
  );
  canvas.addEventListener(
    'pointermove',
    (event) => {
      if (!dragging) return;
      const now = performance.now();
      const dt = Math.max((now - stamp) / 1000, 1 / 240);
      // A drag across the coin's width is about one full turn
      const turnBy = (Math.PI * 2) / Math.max(canvas.clientWidth * 0.6, 1);
      const dy = (event.clientX - pressX) * turnBy;
      const dx = (event.clientY - pressY) * turnBy;
      if (Math.abs(event.clientX - pressX) + Math.abs(event.clientY - pressY) > 3) moved = true;
      hand.y += dy;
      hand.x += dx;
      // Smoothed speed, capped so a wild flick stays readable
      hand.vy = Math.max(-14, Math.min(14, hand.vy * 0.4 + (dy / dt) * 0.6));
      hand.vx = Math.max(-14, Math.min(14, hand.vx * 0.4 + (dx / dt) * 0.6));
      pressX = event.clientX;
      pressY = event.clientY;
      stamp = now;
    },
    { signal },
  );
  const release = () => {
    dragging = false;
    // A pause before letting go means "leave it there", not a throw
    if (performance.now() - stamp > 90) hand.vx = hand.vy = 0;
  };
  canvas.addEventListener('pointerup', release, { signal });
  canvas.addEventListener('pointercancel', release, { signal });

  const resize = () => {
    const { width: w, height: h } = canvas.getBoundingClientRect();
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  };
  window.addEventListener('resize', resize, { signal, passive: true });
  resize();

  // One loop for everything: GSAP's ticker stops with the tab, and so does the coin
  gsap.ticker.add(render);

  return {
    pose(ry, rx) {
      posed = true;
      sway.pause();
      coin.rotation.set(rx, ry, 0);
    },
    info: () => ({ triangles: renderer.info.render.triangles, calls: renderer.info.render.calls }),
    setFocus(next) {
      focused = next;
      dragging = false;
      gsap.to(state, { idle: next ? 0 : 1, duration: 0.6, ease: 'power2.out', overwrite: 'auto' });
      if (next && face % 2) {
        // The pointer that clicked also turned the coin over on its way in: present the obverse
        face += 1;
        gsap.to(state, { base: face * Math.PI, duration: 0.8, ease: 'power3.inOut', overwrite: 'auto' });
      }
      if (!next) {
        // Back to rest by the shortest way round, whatever the number of turns it was given
        hand.vx = hand.vy = 0;
        const nearest = (angle: number) => angle - Math.round(angle / (Math.PI * 2)) * Math.PI * 2;
        hand.x = nearest(hand.x);
        hand.y = nearest(hand.y);
        gsap.to(hand, { x: 0, y: 0, duration: 0.8, ease: 'power3.inOut', overwrite: 'auto' });
      }
    },
    flip,
    nudge(ry, rx) {
      gsap.to(hand, { y: hand.y + ry, x: hand.x + rx, duration: 0.35, ease: 'power2.out', overwrite: 'auto' });
    },
    dragged: () => moved,
    resize,
    dispose() {
      gsap.ticker.remove(render);
      sway.kill();
      gsap.killTweensOf(state);
      gsap.killTweensOf(hand);
      controller.abort();
      for (const item of disposables) item.dispose();
      renderer.dispose();
    },
  };
}
