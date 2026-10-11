import { Children, isValidElement, useCallback, useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useLang } from '../lib/i18n.jsx';
import { useReducedMotion } from '../hooks/useReducedMotion.js';
import { cx } from './_utils.js';
import './Scroller.css';

/**
 * Horizontal card rail (DESIGN-v2 3.11): the track starts on the container edge and bleeds to the viewport edges,
 * snaps, hides its scrollbar, and shows a tabular "01 / 08" counter (AIWO P5; screen readers hear "1 of 8"), two 48px
 * round ring buttons and a progress hairline.
 * - Scroll-linked nudge: while the rail crosses the viewport, scrolling the page down slides it a little
 *   right-to-left (about one card, and back when scrolling up), a hint that there is more to see. The visitor drags
 *   or swipes the rest of the way. It only moves when the visitor scrolls, so it never auto-plays (WCAG 2.2.2).
 * - Grab to slide: mouse users drag the rail (grab / grabbing cursor); touch users swipe it natively. After a
 *   manual move the rail keeps that offset and carries on from there.
 * - Inertia: letting go mid-drag carries the rail on with the release velocity and eases out.
 * - Keyboard: Left / Right arrows inside the rail move one card (focus follows to the next card).
 * - Edge fade: the side with more cards fades out over 48px (styles/interactions.css).
 * - Reduced motion: no scroll link; the rail snaps and the prev/next buttons are shown (the 2.5.7 dragging
 *   alternative). Keyboard users can always Tab through the cards, which scrolls the rail.
 * - Touch-only devices (phones, tablets): no scroll link either. The nudge would park the rail part-way into the
 *   first card (about 70px cut off at 375px) and switches snapping off; phones swipe natively with card snap instead,
 *   and the next card peeking at the screen edge (plus the edge fade) is the "more this way" hint.
 * Extra optional props: `ordered` (renders <ol>), `className`.
 */
const pad2 = (n) => String(n).padStart(2, '0');

const TOUCH_ONLY = '(hover: none) and (pointer: coarse)';
/** True on touch-only devices (no hover, coarse pointer). Read from the live window: the app renders with createRoot. */
function useTouchOnly() {
  const get = () => typeof window !== 'undefined' && !!window.matchMedia?.(TOUCH_ONLY).matches;
  const [touch, setTouch] = useState(get);
  useEffect(() => {
    const mq = window.matchMedia?.(TOUCH_ONLY);
    if (!mq) return undefined;
    const update = () => setTouch(mq.matches);
    update();
    mq.addEventListener?.('change', update);
    return () => mq.removeEventListener?.('change', update);
  }, []);
  return touch;
}

export function Scroller({ label, children, itemWidth, ordered = false, className }) {
  const { t } = useLang();
  const reduced = useReducedMotion();
  const touchOnly = useTouchOnly();
  const trackRef = useRef(null);
  const rootRef = useRef(null);
  const [bleed, setBleed] = useState(null);
  const items = Children.toArray(children).filter((c) => c !== null && c !== false);
  const count = items.length;
  const [state, setState] = useState({ atStart: true, atEnd: false, index: 1, overflow: true });
  const progressRef = useRef(null);
  const manualRef = useRef(null);
  // A track with no focusable item must itself be keyboard-scrollable (axe scrollable-region-focusable).
  const [trackFocusable, setTrackFocusable] = useState(false);

  const update = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    const x = Math.abs(el.scrollLeft);
    const first = el.firstElementChild;
    const second = first && first.nextElementSibling;
    const step = first && second ? second.offsetLeft - first.offsetLeft : el.clientWidth;
    const index = Math.min(count, Math.max(1, Math.round(x / Math.max(step, 1)) + 1));
    if (progressRef.current) progressRef.current.style.transform = `scaleX(${max > 4 ? Math.min(1, x / max).toFixed(4) : 1})`;
    setState({ atStart: x <= 4, atEnd: x >= max - 4, index: x >= max - 4 ? count : index, overflow: max > 4 });
  }, [count]);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return undefined;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };
    // ResizeObserver reports once after the first layout, so mounting never forces a synchronous layout.
    if (typeof ResizeObserver === 'undefined') update();
    el.addEventListener('scroll', onScroll, { passive: true });
    let ro;
    if (typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(onScroll);
      ro.observe(el);
    }
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener('scroll', onScroll);
      ro?.disconnect();
    };
  }, [update]);

  // Let the track bleed to the viewport's right edge (not the container's) when the scroller spans
  // its container, so the next card peeks at the screen edge on wide screens. Measured against
  // documentElement.clientWidth (no scrollbar), so it never causes horizontal page scroll.
  useEffect(() => {
    const root = rootRef.current;
    if (!root || typeof window === 'undefined') return undefined;
    let raf = 0;
    const measure = () => {
      const container = root.parentElement && root.parentElement.closest('.container');
      if (!container) {
        setBleed(null);
        return;
      }
      const r = root.getBoundingClientRect();
      const cr = container.getBoundingClientRect();
      const cs = getComputedStyle(container);
      const padR = parseFloat(cs.paddingRight) || 0;
      const padL = parseFloat(cs.paddingLeft) || 0;
      const spansContainer = Math.abs(cr.right - padR - r.right) < 2 && Math.abs(cr.left + padL - r.left) < 2;
      const end = Math.floor(document.documentElement.clientWidth - r.right);
      const start = Math.floor(r.left);
      // On the page container both sides equal --page-margin, which CSS works out per viewport: the rail then
      // carries a class only, no pixel values, so a prerender snapshot taken at desktop width cannot make phones
      // scroll sideways. Other containers fall back to the measured pixels.
      const rootCs = getComputedStyle(document.documentElement);
      const cmax = parseFloat(rootCs.getPropertyValue('--container-max')) * (parseFloat(rootCs.fontSize) || 16);
      const pageMargin = Math.max(padL, (document.documentElement.clientWidth - cmax) / 2);
      const onPage = Number.isFinite(pageMargin) && Math.abs(start - pageMargin) < 2 && Math.abs(end - pageMargin) < 2;
      setBleed(spansContainer && end > 0 ? (onPage ? { page: true } : { start, end }) : null);
    };
    const onResize = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(measure);
    };
    if (typeof ResizeObserver === 'undefined') measure();
    window.addEventListener('resize', onResize);
    let ro;
    if (typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(onResize);
      ro.observe(root);
    }
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
      ro?.disconnect();
    };
  }, [count]);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    setTrackFocusable(!el.querySelector('a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])'));
  });

  // ---------- Scroll-linked sliding + drag to slide ----------
  const linked = !reduced && !touchOnly && state.overflow;
  useEffect(() => {
    const el = trackRef.current;
    const root = rootRef.current;
    if (!linked || !el || !root || typeof window === 'undefined') return undefined;
    let offset = 0; // the visitor's own adjustment, kept after a drag / swipe / keyboard move
    let manualUntil = 0;
    let raf = 0;
    let running = false;
    let drag = null;
    let suppressClick = false;
    let glide = 0; // inertial glide after a drag release
    let visible = false; // the rail is on (or near) the screen

    // How far the page scroll slides the rail on its own: about one card, at most 40% of the visible width.
    const nudge = () => {
      const max = el.scrollWidth - el.clientWidth;
      const first = el.firstElementChild;
      const second = first && first.nextElementSibling;
      const step = first && second ? second.offsetLeft - first.offsetLeft : el.clientWidth * 0.35;
      return Math.min(max, step * 0.85, el.clientWidth * 0.4);
    };
    // Geometry is measured once at the start of each run, not on every frame: the per-frame work is then
    // only window.scrollY and one scrollLeft write, with no forced layout.
    let geo = null;
    const measure = () => {
      const r = root.getBoundingClientRect();
      geo = { top: r.top + window.scrollY, h: r.height, vh: window.innerHeight || 1, max: Math.max(0, el.scrollWidth - el.clientWidth), nudge: nudge() };
    };
    const progress = () => {
      // 0 as the rail enters at the bottom, 1 as it leaves at the top; slide across the middle 70%.
      const top = geo.top - window.scrollY;
      const p = Math.min(1, Math.max(0, (geo.vh - top) / (geo.vh + geo.h)));
      return Math.min(1, Math.max(0, (p - 0.15) / 0.7));
    };
    const target = () => Math.min(geo.max, Math.max(0, progress() * geo.nudge + offset));
    const tick = () => {
      raf = 0;
      // Stops when the rail is off screen, while the visitor drives it, and once it has arrived.
      if (!visible || drag || glide || performance.now() < manualUntil) {
        running = false;
        return;
      }
      if (!geo) measure();
      const t = target();
      const x = el.scrollLeft;
      const d = t - x;
      if (Math.abs(d) < 1) {
        running = false;
        return;
      }
      el.scrollLeft = x + d * 0.14;
      // scrollLeft is quantised to device pixels: a step too small to register would loop forever. Land and stop.
      if (el.scrollLeft === x) {
        el.scrollLeft = t;
        running = false;
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    const kick = () => {
      if (!running) {
        running = true;
        geo = null; // re-measure at the start of each run (content above may have moved the rail)
        raf = requestAnimationFrame(tick);
      }
    };
    // After the visitor moves the rail themselves, keep where they put it.
    const settleManual = () => {
      measure();
      offset = el.scrollLeft - progress() * geo.nudge;
    };
    const manual = () => {
      manualUntil = performance.now() + 900;
      clearTimeout(manual.t);
      manual.t = setTimeout(settleManual, 950);
    };
    manualRef.current = manual;

    const io = new IntersectionObserver(([en]) => {
      visible = en.isIntersecting;
      if (visible) kick();
    }, { rootMargin: '120px 0px' });
    io.observe(root);
    const onWinScroll = () => {
      if (visible) kick();
    };
    const onWheel = (e) => {
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) manual();
    };
    const onTouch = () => manual();
    const onFocus = () => manual();

    // Mouse drag
    const onDown = (e) => {
      if (e.pointerType !== 'mouse' || e.button !== 0) return;
      cancelAnimationFrame(glide);
      glide = 0;
      drag = { x: e.clientX, left: el.scrollLeft, moved: false, id: e.pointerId, vx: 0, lx: e.clientX, lt: performance.now() };
    };
    const onMoveDrag = (e) => {
      if (!drag || e.pointerId !== drag.id) return;
      const dx = e.clientX - drag.x;
      if (!drag.moved && Math.abs(dx) > 5) {
        drag.moved = true;
        root.classList.add('is-dragging');
        el.setPointerCapture?.(e.pointerId);
      }
      if (drag.moved) el.scrollLeft = drag.left - dx;
      // Pointer velocity (px/ms), smoothed, for the inertial glide on release
      const now = performance.now();
      const dt = Math.max(1, now - drag.lt);
      drag.vx = drag.vx * 0.6 + ((e.clientX - drag.lx) / dt) * 0.4;
      drag.lx = e.clientX;
      drag.lt = now;
    };
    // Inertia: keep sliding with the release velocity and ease out (friction per 16ms frame), then keep the spot.
    const startGlide = (vx) => {
      let v = -vx * 16; // px per frame, opposite to the pointer
      let prev = performance.now();
      const step = (now) => {
        const f = Math.min(3, (now - prev) / 16);
        prev = now;
        const before = el.scrollLeft;
        el.scrollLeft = before + v * f;
        v *= Math.pow(0.93, f);
        if (Math.abs(v) < 0.4 || el.scrollLeft === before) {
          glide = 0;
          settleManual();
          return;
        }
        glide = requestAnimationFrame(step);
      };
      glide = requestAnimationFrame(step);
    };
    const onUp = (e) => {
      if (!drag || (e.pointerId != null && e.pointerId !== drag.id)) return;
      if (drag.moved) {
        suppressClick = true;
        setTimeout(() => { suppressClick = false; }, 0);
        // A pause before letting go cancels the fling
        const fresh = performance.now() - drag.lt < 80;
        if (fresh && Math.abs(drag.vx) > 0.15) startGlide(drag.vx);
        else settleManual();
      }
      root.classList.remove('is-dragging');
      drag = null;
    };
    const onClick = (e) => {
      if (suppressClick) {
        e.preventDefault();
        e.stopPropagation();
      }
    };
    const noNativeDrag = (e) => e.preventDefault();

    window.addEventListener('scroll', onWinScroll, { passive: true });
    window.addEventListener('resize', onWinScroll, { passive: true });
    el.addEventListener('wheel', onWheel, { passive: true });
    el.addEventListener('touchstart', onTouch, { passive: true });
    el.addEventListener('focusin', onFocus);
    el.addEventListener('pointerdown', onDown);
    el.addEventListener('pointermove', onMoveDrag);
    el.addEventListener('pointerup', onUp);
    el.addEventListener('pointercancel', onUp);
    el.addEventListener('click', onClick, true);
    el.addEventListener('dragstart', noNativeDrag);
    kick();
    return () => {
      manualRef.current = null;
      cancelAnimationFrame(raf);
      cancelAnimationFrame(glide);
      clearTimeout(manual.t);
      io.disconnect();
      window.removeEventListener('scroll', onWinScroll);
      window.removeEventListener('resize', onWinScroll);
      el.removeEventListener('wheel', onWheel);
      el.removeEventListener('touchstart', onTouch);
      el.removeEventListener('focusin', onFocus);
      el.removeEventListener('pointerdown', onDown);
      el.removeEventListener('pointermove', onMoveDrag);
      el.removeEventListener('pointerup', onUp);
      el.removeEventListener('pointercancel', onUp);
      el.removeEventListener('click', onClick, true);
      el.removeEventListener('dragstart', noNativeDrag);
      root.classList.remove('is-dragging');
    };
  }, [linked, count]);

  // Keyboard: Left / Right arrows move one card while focus is inside the rail (or on its controls).
  const goRef = useRef(null);
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;
    const onKey = (e) => {
      if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
      if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey || e.defaultPrevented) return;
      if (e.target.closest?.('input, textarea, select, [contenteditable], [role="tablist"], [role="slider"]')) return;
      const dir = e.key === 'ArrowRight' ? 1 : -1;
      e.preventDefault();
      const el = trackRef.current;
      goRef.current?.(document.documentElement.dir === 'rtl' ? -dir : dir);
      // Keep focus with the card that comes into view, so arrowing on and Tabbing stay in step.
      const focused = el && el.contains(document.activeElement) ? document.activeElement.closest('.scroller__item') : null;
      const next = focused && (dir > 0 ? focused.nextElementSibling : focused.previousElementSibling);
      const target = next && next.querySelector('a[href], button:not([disabled])');
      if (target) target.focus({ preventScroll: true });
    };
    root.addEventListener('keydown', onKey);
    return () => root.removeEventListener('keydown', onKey);
  }, []);

  const go = (dir) => {
    const el = trackRef.current;
    if (!el) return;
    // aria-disabled (not disabled) keeps focus on the button at either end; the click is ignored there.
    if ((dir < 0 && state.atStart) || (dir > 0 && state.atEnd)) return;
    // One card (+ gap) per press
    const first = el.firstElementChild;
    const second = first && first.nextElementSibling;
    const step = first && second ? second.offsetLeft - first.offsetLeft : Math.max(el.clientWidth * 0.85, 200);
    manualRef.current?.();
    el.scrollBy({ left: dir * step, behavior: reduced ? 'auto' : 'smooth' });
  };
  goRef.current = go;

  if (!count) return null;
  const List = ordered ? 'ol' : 'ul';

  return (
    <section
      ref={rootRef}
      className={cx('scroller', !state.overflow && 'scroller--fits', linked && 'scroller--linked', bleed != null && (bleed.page ? 'scroller--bleed-page' : 'scroller--bleed'), className)}
      style={bleed != null && !bleed.page ? { '--scroller-bleed-start': `${bleed.start}px`, '--scroller-bleed-end': `${bleed.end}px` } : undefined}
      aria-label={label}
      aria-roledescription="carousel"
      data-at-start={state.overflow && state.atStart ? '' : undefined}
      data-at-end={state.overflow && state.atEnd ? '' : undefined}
    >
      <div className="scroller__controls">
        <p className="scroller__status" aria-hidden={!state.overflow}>
          <span className="scroller__count" aria-hidden="true">
            <span className="scroller__count-now">{pad2(state.index)}</span>
            <span className="scroller__count-sep"> / </span>
            {pad2(count)}
          </span>
          <span className="visually-hidden">{t(`${state.index} of ${count}`, `${state.index} / ${count}`)}</span>
        </p>
        <button
          type="button"
          className="scroller__btn"
          onClick={() => go(-1)}
          aria-disabled={state.atStart || undefined}
          aria-label={t('Previous', 'முந்தையவை')}
        >
          <ChevronLeft size={20} strokeWidth={1.75} aria-hidden="true" />
        </button>
        <button
          type="button"
          className="scroller__btn"
          onClick={() => go(1)}
          aria-disabled={state.atEnd || undefined}
          aria-label={t('Next', 'அடுத்தவை')}
        >
          <ChevronRight size={20} strokeWidth={1.75} aria-hidden="true" />
        </button>
      </div>
      <List
        ref={trackRef}
        className="scroller__track"
        data-lenis-prevent-wheel=""
        style={itemWidth ? { '--scroller-item': itemWidth } : undefined}
        tabIndex={trackFocusable && state.overflow ? 0 : undefined}
        aria-label={trackFocusable && state.overflow ? t(`${label || 'Items'}: scrollable list`, `${label || 'உருப்படிகள்'}: உருட்டக்கூடிய பட்டியல்`) : undefined}
      >
        {items.map((child, i) => (
          <li className="scroller__item" key={isValidElement(child) && child.key != null ? child.key : i}>
            {child}
          </li>
        ))}
      </List>
      <div className="scroller__progress" aria-hidden="true">
        <span ref={progressRef} className="scroller__progress-fill" />
      </div>
    </section>
  );
}

export default Scroller;
