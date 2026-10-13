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

/**
 * Jump the page to `y` at once and make Lenis adopt it. A plain window.scrollTo is not enough while Lenis runs: Lenis
 * keeps its own target (the old page's position), so the next wheel tick glided the new page back down to it (after a
 * footer link, one small wheel scroll ran the page to its end).
 */
export function jumpTo(y = 0) {
  if (typeof window === 'undefined') return;
  if (lenis) {
    lenis.resize(); // the new page has a different height: let Lenis re-measure its limit first
    lenis.scrollTo(y, { immediate: true, force: true });
  }
  if (Math.abs(window.scrollY - y) > 1) window.scrollTo(0, y);
}

/** After the browser moved the page itself (scrollIntoView, a native jump): make Lenis follow the new position. */
export function syncSmoothScroll() {
  if (lenis) lenis.scrollTo(window.scrollY, { immediate: true, force: true });
}

// Same-page #anchor clicks glide with Lenis (smoothScrollBoot.js) instead of jumping; while one is in flight,
// ScrollManager must not jump to the same #hash itself (it would cut the glide short).
let glideHash = null;
let glideFrom = 0;
export function setHashGlide(hash, fromY = 0) {
  glideHash = hash || null;
  glideFrom = fromY;
}
export function hashGlideActive(hash) {
  return !!glideHash && glideHash === hash;
}
/** Where the in-flight #glide started: the position Back should return to. */
export function hashGlideOrigin() {
  return glideFrom;
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
