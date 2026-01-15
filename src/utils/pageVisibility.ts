/**
 * Page Visibility Manager
 * Manages pausing/resuming animations when the page is not visible
 */

let isPageVisible = true;
let animationFrameId: number | null = null;
let gsapPaused = false;

/**
 * Check if page is currently visible
 */
export const isVisible = (): boolean => {
  return isPageVisible;
};

/**
 * Pause all GSAP animations
 */
export const pauseGSAP = () => {
  if (typeof window !== 'undefined' && (window as any).gsap) {
    const gsap = (window as any).gsap;
    gsap.globalTimeline.pause();
    gsapPaused = true;
  }
};

/**
 * Resume all GSAP animations
 */
export const resumeGSAP = () => {
  if (typeof window !== 'undefined' && (window as any).gsap) {
    const gsap = (window as any).gsap;
    gsap.globalTimeline.resume();
    gsapPaused = false;
  }
};

/**
 * Stop an animation frame loop
 */
export const stopAnimationFrame = (id: number | null) => {
  if (id !== null && typeof window !== 'undefined') {
    cancelAnimationFrame(id);
  }
};

/**
 * Register a callback to be called when visibility changes
 */
export const onVisibilityChange = (callback: (visible: boolean) => void) => {
  if (typeof document === 'undefined') return;

  const handleVisibilityChange = () => {
    const visible = !document.hidden;
    isPageVisible = visible;
    callback(visible);
  };

  document.addEventListener('visibilitychange', handleVisibilityChange);

  // Return cleanup function
  return () => {
    document.removeEventListener('visibilitychange', handleVisibilityChange);
  };
};

/**
 * Initialize page visibility management
 */
export const initPageVisibility = () => {
  if (typeof document === 'undefined') return;

  // Set initial state
  isPageVisible = !document.hidden;

  // Handle visibility changes
  onVisibilityChange((visible) => {
    if (visible) {
      // Page became visible - resume animations
      resumeGSAP();
    } else {
      // Page became hidden - pause animations
      pauseGSAP();
    }
  });
};
