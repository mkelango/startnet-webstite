import { useEffect, useLayoutEffect } from 'react';
import './_indicator.css';

const useIsoLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;

/**
 * Sliding indicator (DESIGN-v2 3.12). Measures the active element inside `containerRef` (matched by
 * `activeSelector`) on mount, on resize (ResizeObserver) and whenever `deps` change, and writes
 *   --ind-x / --ind-y (px), --ind-w / --ind-h (unitless px numbers, for scaleX(calc(var(--ind-w) / 100)))
 *   --ind-r (px: distance from the right edge, for clip-path insets)
 * on the container, plus `data-ind-ready` once measured. CSS draws the indicator (underline: translateX + scaleX on
 * a 100px base; pill: clip-path inset, which keeps the round ends). Before measuring (SSR, prerender, no JS) the
 * indicator stays hidden and the active item carries its own static style, so the state is visible without JS.
 * With no active element the indicator fades out (data-ind-ready removed).
 * Only a change of the active item glides. The first measure, and re-measures after the layout changed under the
 * indicator (fonts, scrollbar, the header compacting), jump straight into place, so the indicator is never caught
 * sliding in from a stale position.
 */
export function useSlidingIndicator(containerRef, activeSelector, deps = []) {
  useIsoLayoutEffect(() => {
    const box = containerRef.current;
    if (!box) return undefined;
    let raf = 0;
    const measure = (snap) => {
      raf = 0;
      const el = activeSelector ? box.querySelector(activeSelector) : null;
      if (!el) {
        box.removeAttribute('data-ind-ready');
        return;
      }
      place(box, el, snap || !box.hasAttribute('data-ind-ready'));
    };
    measure(false);
    if (typeof ResizeObserver === 'undefined') return undefined;
    const ro = new ResizeObserver(() => {
      if (!raf) raf = requestAnimationFrame(() => measure(true));
    });
    ro.observe(box);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

/** Writes the geometry of `el` on `box`; `snap` moves the indicator without its transition. */
function place(box, el, snap) {
  if (snap) box.setAttribute('data-ind-snap', '');
  const x = el.offsetLeft;
  const w = el.offsetWidth;
  box.style.setProperty('--ind-x', `${x}px`);
  box.style.setProperty('--ind-y', `${el.offsetTop}px`);
  box.style.setProperty('--ind-w', String(w));
  box.style.setProperty('--ind-h', String(el.offsetHeight));
  box.style.setProperty('--ind-r', `${Math.max(0, box.clientWidth - x - w)}px`);
  box.style.setProperty('--ind-b', `${Math.max(0, box.clientHeight - el.offsetTop - el.offsetHeight)}px`);
  box.setAttribute('data-ind-ready', '');
  if (snap) {
    // Flush styles while the transition is off; removing the flag afterwards then starts no transition.
    void box.offsetWidth;
    box.removeAttribute('data-ind-snap');
  }
}

/** Move a sliding indicator to any element on demand (hover glides): returns a function el → void. */
export function glideTo(box, el) {
  if (!box) return;
  if (!el) {
    box.removeAttribute('data-ind-ready');
    return;
  }
  place(box, el, !box.hasAttribute('data-ind-ready'));
}

export default useSlidingIndicator;
