// Smooth-scroll controls used by the app shell (ScrollManager, BackToTop). This module does not import Lenis, so it
// adds nothing to the entry bundle: the Lenis instance is created by lib/smoothScrollBoot.js (loaded lazily with
// motionBoot after first paint, only for mouse / trackpad users without reduced motion) and registered here.

let lenis = null;

/** Called by smoothScrollBoot.js when it starts (instance) or stops (null) Lenis. */
export function registerSmoothScroll(instance) {
  lenis = instance;
}

export function reducedMotion() {
  const pref = document.documentElement.dataset.motion;
  if (pref === 'reduced') return true;
  if (pref === 'full') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Cancel any wheel animation in flight before the app jumps the page itself (route change, back/forward
 * restore, #hash targets), so the jump is not pulled back toward the old target.
 */
export function stopSmoothScroll() {
  if (lenis) lenis.scrollTo(window.scrollY, { immediate: true, force: true });
}

/** Lenis stops while a modal locks the page and resumes after. */
export function pauseSmoothScroll(paused) {
  if (!lenis) return;
  if (paused) lenis.stop();
  else lenis.start();
}

/**
 * Smoothly scroll the window to `y` (Lenis' eased glide when it is running, the browser's smooth scroll otherwise;
 * instant under reduced motion). Used by the back-to-top button.
 */
export function scrollToY(y = 0, { onDone } = {}) {
  if (typeof window === 'undefined') return;
  if (reducedMotion()) {
    window.scrollTo(0, y);
    onDone?.();
    return;
  }
  if (lenis) {
    lenis.scrollTo(y, { duration: 1.1, easing: (t) => 1 - Math.pow(1 - t, 4), force: true, onComplete: onDone });
    return;
  }
  window.scrollTo({ top: y, behavior: 'smooth' });
  if (onDone) {
    let timer = 0;
    const finish = () => { clearTimeout(timer); window.removeEventListener('scrollend', finish); onDone(); };
    window.addEventListener('scrollend', finish, { once: true });
    timer = setTimeout(finish, 1500);
  }
}
