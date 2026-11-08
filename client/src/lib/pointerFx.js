// Pointer effects for mouse and trackpad users (transform only, content visible at rest, nothing under reduced
// motion, nothing on touch screens).
// - Magnetic pull: the one red CTA per section (Button variant="point", .button--point) leans at most 5px toward the
//   pointer. Nothing else moves: cards no longer tilt, lift or carry a spotlight (docs/redesign/SPEC.md §4, "no lift,
//   no shadow, no tilt"); their hover is the CSS media zoom + title underline.
// Everything is driven by one passive pointermove listener and one rAF; nothing runs while the pointer is still.

const MAGNETIC = '.button--point';
const MAX = 5;

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
  let raf = 0;
  let last = null;
  const releaseMagnet = () => {
    if (magnet) magnet.style.translate = '';
    magnet = null;
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
  };

  const onMove = (e) => {
    if (e.pointerType && e.pointerType !== 'mouse' && e.pointerType !== 'pen') return;
    last = e;
    if (!raf) raf = requestAnimationFrame(apply);
  };

  const onLeave = (e) => {
    if (!e.relatedTarget) releaseMagnet();
  };
  // Scrolling moves the button under a still pointer: drop the pull rather than leave a stale offset.
  const onScroll = () => { if (magnet) releaseMagnet(); };

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
