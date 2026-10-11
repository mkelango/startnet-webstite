// Smooth wheel scrolling (Lenis) for mouse and trackpad users. Loaded lazily from motionBoot.js.
// - Off under reduced motion (the OS setting or the footer "Reduce motion" switch) and on touch screens,
//   which keep their native momentum scrolling.
// - Lenis scrolls the window natively, so position: sticky, the GSAP ScrollTrigger stories, the header's
//   hide-on-scroll and ScrollManager all keep working from ordinary scroll events.
// - Scrollable overlays (dialogs, the mega menu, the drawer, the search overlay, filter sheets) scroll natively,
//   and so do horizontal tracks marked data-lenis-prevent-wheel (Scroller).
// - A scroll the browser makes itself (focus moving to an off-screen element, a native #hash jump) is adopted at
//   once instead of being pulled back to the wheel animation's stale target (WCAG 2.4.11).
import Lenis from 'lenis';
import { reducedMotion, registerSmoothScroll, pauseSmoothScroll } from './smoothScroll.js';

let lenis = null;

const PREVENT =
  '[data-lenis-prevent], [data-lenis-prevent-wheel], [role="dialog"], [aria-modal="true"], .mega-menu, .mega-panel, .mobile-drawer, .search-overlay, .filter-sheet, .brand-subnav-sheet, textarea, select';

const finePointer = () => window.matchMedia('(hover: hover) and (pointer: fine)').matches;

function start() {
  if (lenis || reducedMotion() || !finePointer()) return;
  lenis = new Lenis({
    autoRaf: true,
    lerp: 0.1,
    smoothWheel: true,
    wheelMultiplier: 1,
    anchors: false, // ScrollManager handles #targets
    allowNestedScroll: true, // inner panels that scroll (menus, tables, lists) scroll themselves
    prevent: (node) => !!(node && node.closest && node.closest(PREVENT)),
  });
  registerSmoothScroll(lenis);
  document.documentElement.classList.add('has-smooth-scroll');
  if (document.documentElement.dataset.modalOpen) lenis.stop();
}

function stop() {
  if (!lenis) return;
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
  // Same-page #links: stop the wheel glide before the browser jumps, so the jump is not undone.
  document.addEventListener(
    'click',
    (e) => {
      if (!lenis || e.defaultPrevented || e.button !== 0) return;
      const a = e.target instanceof Element ? e.target.closest('a[href*="#"]') : null;
      if (!a || a.origin !== window.location.origin || a.pathname !== window.location.pathname) return;
      lenis.scrollTo(window.scrollY, { immediate: true, force: true });
    },
    true
  );
}
