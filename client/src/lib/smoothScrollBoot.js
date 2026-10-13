// Smooth wheel scrolling (Lenis) for mouse and trackpad users. Loaded lazily from motionBoot.js.
// - Off under reduced motion (the OS setting or the footer "Reduce motion" switch) and on touch screens,
//   which keep their native momentum scrolling.
// - Lenis scrolls the window natively, so position: sticky, the GSAP ScrollTrigger stories, the header's
//   hide-on-scroll and ScrollManager all keep working from ordinary scroll events.
// - Scrollable overlays (dialogs, the mega menu, the drawer, the search overlay, filter sheets) scroll natively,
//   and so do horizontal swipes over tracks marked data-lenis-prevent-horizontal (Scroller; Lenis handles that attribute natively).
// - A scroll the browser makes itself (focus moving to an off-screen element, a native #hash jump) is adopted at
//   once instead of being pulled back to the wheel animation's stale target (WCAG 2.4.11).
import Lenis from 'lenis';
import { reducedMotion, registerSmoothScroll, pauseSmoothScroll, setHashGlide } from './smoothScroll.js';

let lenis = null;

const PREVENT =
  '[data-lenis-prevent], [data-lenis-prevent-wheel], [role="dialog"], [aria-modal="true"], .mega-menu, .mega-panel, .mobile-drawer, .search-overlay, .filter-sheet, .brand-subnav-sheet, .cookie-banner, textarea, select';

const SCROLL_KEYS = new Set(['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' ']);

const finePointer =() => window.matchMedia('(hover: hover) and (pointer: fine)').matches;

function start() {
  if (lenis || reducedMotion() || !finePointer()) return;
  lenis = new Lenis({
    autoRaf: true,
    lerp: 0.1,
    smoothWheel: true,
    wheelMultiplier: 1,
    syncTouch: false, // touch keeps the browser's own momentum scrolling
    anchors: false, // ScrollManager handles #targets
    allowNestedScroll: true, // inner panels that scroll (menus, tables, lists) scroll themselves
    prevent: (node) => !!(node && node.closest && node.closest(PREVENT)),
  });
  lenis.on('scroll', syncScrollTrigger);
  registerSmoothScroll(lenis);
  document.documentElement.classList.add('has-smooth-scroll');
  if (document.documentElement.dataset.modalOpen) lenis.stop();
}

// GSAP ScrollTrigger (pinned / scrubbed stories, loaded by the pages that use it) listens to native scroll events,
// which fire one frame after Lenis moved the window: a pin would visibly drift for a frame as it engages. Update it in
// the same frame instead. gsap registers itself in window.gsapVersions; only then is the (already loaded, shared)
// ScrollTrigger chunk resolved, so pages without GSAP never download it.
let scrollTrigger = null;
let stLoading = false;
function syncScrollTrigger() {
  if (scrollTrigger) {
    if (scrollTrigger.getAll().length) scrollTrigger.update();
    return;
  }
  if (stLoading || !window.gsapVersions) return;
  stLoading = true;
  import('gsap/ScrollTrigger')
    .then((m) => { scrollTrigger = m.ScrollTrigger || m.default || null; })
    .catch(() => { stLoading = false; });
}

function stop() {
  if (!lenis) return;
  setHashGlide(null);
  lenis.destroy();
  lenis = null;
  registerSmoothScroll(null);
  document.documentElement.classList.remove('has-smooth-scroll');
}

const sync = () => (reducedMotion() || !finePointer() ? stop() : start());

// The browser is about to move the page itself (focus moving to an off-screen element) or just did (#hash): end the
// in-flight wheel glide where it is, so Lenis follows the native scroll instead of gliding back to its old target.
const adoptNativeScroll = () => {
  if (lenis && lenis.isScrolling) lenis.scrollTo(window.scrollY, { immediate: true, force: true });
};

/** Start smooth scrolling and follow later changes to the motion setting or input device. */
export function initSmoothScroll() {
  if (typeof window === 'undefined') return;
  sync();
  window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener?.('change', sync);
  window.matchMedia('(hover: hover) and (pointer: fine)').addEventListener?.('change', sync);
  new MutationObserver(sync).observe(document.documentElement, { attributes: true, attributeFilter: ['data-motion'] });
  // useModal (layout/shell.jsx) marks <html data-modal-open> while a dialog locks the page.
  new MutationObserver(() => pauseSmoothScroll(!!document.documentElement.dataset.modalOpen)).observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-modal-open'],
  });
  document.addEventListener('focusin', adoptNativeScroll, true);
  window.addEventListener('hashchange', adoptNativeScroll);
  // Keyboard scrolling stays native: a key pressed mid-glide must not be pulled back to the wheel's old target.
  document.addEventListener('keydown', (e) => {
    if (SCROLL_KEYS.has(e.key) && !(e.target instanceof Element && e.target.closest('input, textarea, select, [contenteditable]'))) adoptNativeScroll();
  });
  // Same-page #links: a mouse click glides to the target (Lenis); otherwise (keyboard, modified clicks, a target not
  // mounted yet) the wheel glide stops before the browser / ScrollManager jumps, so the jump is not undone.
  document.addEventListener(
    'click',
    (e) => {
      if (!lenis || e.defaultPrevented || e.button !== 0) return;
      const a = e.target instanceof Element ? e.target.closest('a[href*="#"]') : null;
      if (!a || a.origin !== window.location.origin || a.pathname !== window.location.pathname) return;
      if (a.search !== window.location.search || !glideToHash(e, a)) lenis.scrollTo(window.scrollY, { immediate: true, force: true });
    },
    true
  );
}

const safeDecode = (raw) => { try { return decodeURIComponent(raw); } catch { return raw; } };
const px = (v) => { const n = parseFloat(v); return Number.isFinite(n) ? n : 0; };
let glideTimer = 0;

/**
 * Glide to a same-page #target with Lenis, then update the URL the way React Router would (a history entry it reads
 * through popstate, so Back returns to where the click happened) and move focus to the target. Returns false to fall
 * back to the browser's jump.
 */
function glideToHash(e, a) {
  // Keyboard activation (detail 0), modified clicks, target=_blank and the skip link keep the native behaviour.
  if (e.detail === 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || a.target === '_blank' || a.hasAttribute('download')) return false;
  if (a.classList.contains('skip-link') || reducedMotion() || document.documentElement.dataset.modalOpen) return false;
  const hash = a.hash;
  const id = safeDecode(hash.slice(1));
  const el = id && document.getElementById(id);
  if (!el || el.getClientRects().length === 0) return false;
  e.preventDefault();
  // Where scrollIntoView({ block: 'start' }) docks it: the root's scroll-padding-top plus the target's scroll-margin-top.
  const dock = px(getComputedStyle(document.documentElement).scrollPaddingTop) + px(getComputedStyle(el).scrollMarginTop);
  const y = Math.max(0, el.getBoundingClientRect().top + window.scrollY - dock);
  const done = () => {
    clearTimeout(glideTimer);
    setHashGlide(null);
    if (!el.isConnected) return;
    if (!el.hasAttribute('tabindex') && !/^(A|BUTTON|INPUT|SELECT|TEXTAREA|SUMMARY)$/.test(el.tagName)) el.setAttribute('tabindex', '-1');
    el.focus({ preventScroll: true });
  };
  if (hash !== window.location.hash) {
    setHashGlide(hash, window.scrollY);
    const idx = (window.history.state && window.history.state.idx) || 0;
    const state = { usr: null, key: Math.random().toString(36).slice(2, 10), idx: idx + 1 };
    window.history.pushState(state, '', hash);
    window.dispatchEvent(new PopStateEvent('popstate', { state }));
  }
  lenis.scrollTo(y, { duration: 1.1, easing: (t) => 1 - Math.pow(1 - t, 4), force: true, onComplete: done });
  // The visitor wheeling mid-glide replaces Lenis' target and onComplete never fires: release the hash anyway.
  clearTimeout(glideTimer);
  glideTimer = window.setTimeout(() => setHashGlide(null), 1600);
  return true;
}
