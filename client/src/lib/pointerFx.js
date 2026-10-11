// Pointer effects for mouse and trackpad users (DESIGN-v2 3.6: transform only, content visible at rest,
// nothing under reduced motion, nothing on touch screens).
// - Magnetic pull: primary CTAs (primary buttons that are not small, large brand buttons, anything marked
//   [data-magnetic]) lean at most 5px toward the pointer.
// - Card spotlight + tilt (v2b interaction layer): linked cards and brand tiles publish the pointer position as
//   --mx / --my (a glow border and a soft surface light follow it, styles/interactions.css) and tilt at most 3deg
//   toward it. Media cards tilt at most 2deg. The tilt is an inline transform; the hover lift is the CSS `translate` property, so the two
//   never fight. Leaving the card (or the window) eases it back to rest.
// Everything is driven by one passive pointermove listener and one rAF; nothing runs while the pointer is still.

const MAGNETIC = '.button--primary:not(.button--sm), .button--brand.button--lg, [data-magnetic]';
const TILT = '.card--link, .brand-tile';
const MAX = 5;
const MAX_TILT = 3;
const MAX_TILT_MEDIA = 2;

let active = false;
let cleanup = null;

function reducedMotion() {
  const pref = document.documentElement.dataset.motion;
  if (pref === 'reduced') return true;
  if (pref === 'full') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
const finePointer = () => window.matchMedia('(hover: hover) and (pointer: fine)').matches;

function start() {
  if (active) return;
  active = true;
  const html = document.documentElement;
  html.classList.add('has-pointer-fx');

  let magnet = null;
  let card = null;
  let raf = 0;
  let last = null;
  const releaseMagnet = () => {
    if (magnet) magnet.style.translate = '';
    magnet = null;
  };
  const releaseCard = () => {
    if (card) {
      card.style.transform = '';
      card.removeAttribute('data-fx-hover');
    }
    card = null;
  };

  const apply = () => {
    raf = 0;
    const e = last;
    if (!e) return;
    const t = e.target instanceof Element ? e.target : null;

    const m = t && t.closest(MAGNETIC);
    if (m !== magnet) releaseMagnet();
    if (m && !m.matches('[aria-disabled="true"], :disabled')) {
      magnet = m;
      const r = m.getBoundingClientRect();
      const dx = Math.max(-MAX, Math.min(MAX, (e.clientX - (r.left + r.width / 2)) * 0.12));
      const dy = Math.max(-MAX, Math.min(MAX, (e.clientY - (r.top + r.height / 2)) * 0.2));
      m.style.translate = `${dx.toFixed(1)}px ${dy.toFixed(1)}px`;
    }

    // A card being dragged in a scroller rail keeps still (the rail is moving under the pointer).
    const c = t && !t.closest('.is-dragging') ? t.closest(TILT) : null;
    if (c !== card) releaseCard();
    if (c) {
      card = c;
      const r = c.getBoundingClientRect();
      if (r.width < 1 || r.height < 1) return;
      const px = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width));
      const py = Math.min(1, Math.max(0, (e.clientY - r.top) / r.height));
      const max = c.classList.contains('card--framed') ? MAX_TILT : MAX_TILT_MEDIA;
      c.style.setProperty('--mx', `${(px * 100).toFixed(1)}%`);
      c.style.setProperty('--my', `${(py * 100).toFixed(1)}%`);
      c.style.transform = `perspective(1100px) rotateX(${((0.5 - py) * 2 * max).toFixed(2)}deg) rotateY(${((px - 0.5) * 2 * max).toFixed(2)}deg)`;
      c.setAttribute('data-fx-hover', '');
    }
  };

  const onMove = (e) => {
    if (e.pointerType && e.pointerType !== 'mouse' && e.pointerType !== 'pen') return;
    last = e;
    if (!raf) raf = requestAnimationFrame(apply);
  };

  const onLeave = (e) => {
    if (!e.relatedTarget) {
      releaseMagnet();
      releaseCard();
    }
  };
  // Scrolling moves cards under a still pointer: drop the tilt rather than leave a stale angle.
  const onScroll = () => { if (card) releaseCard(); };

  window.addEventListener('pointermove', onMove, { passive: true });
  document.addEventListener('pointerout', onLeave, { passive: true });
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('blur', onScroll);

  cleanup = () => {
    cancelAnimationFrame(raf);
    window.removeEventListener('pointermove', onMove);
    document.removeEventListener('pointerout', onLeave);
    window.removeEventListener('scroll', onScroll);
    window.removeEventListener('blur', onScroll);
    releaseMagnet();
    releaseCard();
    html.classList.remove('has-pointer-fx');
  };
}

function stop() {
  if (!active) return;
  active = false;
  cleanup?.();
  cleanup = null;
}

const sync = () => (reducedMotion() || !finePointer() ? stop() : start());

export function initPointerFx() {
  if (typeof window === 'undefined') return;
  sync();
  window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener?.('change', sync);
  window.matchMedia('(hover: hover) and (pointer: fine)').addEventListener?.('change', sync);
  new MutationObserver(sync).observe(document.documentElement, { attributes: true, attributeFilter: ['data-motion'] });
}
