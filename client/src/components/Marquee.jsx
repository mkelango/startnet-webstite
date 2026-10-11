import { useEffect, useRef, useState } from 'react';
import { Pause, Play } from 'lucide-react';
import { useLang } from '../lib/i18n.jsx';
import { useReducedMotion } from '../hooks/useReducedMotion.js';
import { cx } from './_utils.js';
import './Marquee.css';

/**
 * Slow continuous row (DESIGN-v2 3.13: 32 px/s), driven by one requestAnimationFrame loop (v2b interaction layer):
 * - glides to a stop on hover / focus and with the visible Pause button (existing "Pause"/"Play" labels, WCAG 2.2.2),
 *   and eases back up to speed after;
 * - drag (mouse, pen or a horizontal swipe) moves the row by hand; letting go carries it on with the release
 *   velocity (inertia) before it settles back to the slow drift;
 * - keyboard: the row is one tab stop; Left / Right arrows step it one item;
 * - no work while it is off screen (IntersectionObserver) or the tab is hidden;
 * - duplicates are aria-hidden and inert; the server markup is the row at rest; reduced motion gets a static grid.
 */
export function Marquee({ items, speed = 32, label, className }) {
  const { t } = useLang();
  const reduced = useReducedMotion();
  const [paused, setPaused] = useState(false);
  const pausedRef = useRef(paused);
  pausedRef.current = paused;
  const kickRef = useRef(null);
  const rootRef = useRef(null);
  const viewportRef = useRef(null);
  const trackRef = useRef(null);
  const list = (Array.isArray(items) ? items : []).filter(Boolean);
  const n = list.length;

  useEffect(() => { kickRef.current?.(); }, [paused]);

  useEffect(() => {
    const root = rootRef.current;
    const vp = viewportRef.current;
    const track = trackRef.current;
    if (reduced || !root || !vp || !track || !n || typeof window === 'undefined') return undefined;
    const rate = Math.max(Number(speed) || 32, 5);
    let x = 0; // how far the row has moved left, wrapped to [0, period)
    let v = 0; // current velocity, px/s (eases toward the target)
    let period = 0; // distance from the first item to its duplicate
    let raf = 0;
    let last = 0;
    let visible = false;
    let hover = false;
    let focus = false;
    let drag = null;
    let nudge = 0;
    let suppressClick = false;

    const measure = () => {
      const a = track.children[0];
      const b = track.children[n];
      period = a && b ? b.offsetLeft - a.offsetLeft : track.scrollWidth / 2;
    };
    const wrap = () => { if (period > 0) x = ((x % period) + period) % period; };
    const paint = () => { track.style.transform = `translate3d(${(-x).toFixed(2)}px, 0, 0)`; };
    const target = () => (pausedRef.current || hover || focus ? 0 : rate);
    const shouldRun = () => visible && !document.hidden && !drag && (Math.abs(v - target()) > 0.05 || target() > 0 || nudge !== 0);

    const frame = (now) => {
      raf = 0;
      const dt = Math.min(0.05, Math.max(0, (now - last) / 1000));
      last = now;
      // Faster blend toward the drift speed, slower when coming out of a fling (inertia)
      const k = Math.abs(v) > rate * 1.5 ? 2.6 : 4;
      v += (target() - v) * (1 - Math.exp(-dt * k));
      if (Math.abs(v) < 0.05 && target() === 0) v = 0;
      x += v * dt;
      if (nudge) {
        const step = nudge * (1 - Math.exp(-dt * 9));
        x += step;
        nudge -= step;
        if (Math.abs(nudge) < 0.5) { x += nudge; nudge = 0; }
      }
      wrap();
      paint();
      if (shouldRun()) raf = requestAnimationFrame(frame);
    };
    const kick = () => {
      if (raf || !shouldRun()) return;
      last = performance.now();
      raf = requestAnimationFrame(frame);
    };
    kickRef.current = kick;

    const io = typeof IntersectionObserver !== 'undefined'
      ? new IntersectionObserver(([e]) => { visible = e.isIntersecting; kick(); }, { rootMargin: '80px 0px' })
      : null;
    if (io) io.observe(root); else visible = true;
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(() => { measure(); wrap(); paint(); }) : null;
    ro?.observe(track);
    measure();

    const onVis = () => kick();
    const onEnter = (e) => { if (e.pointerType === 'mouse') { hover = true; kick(); } };
    const onLeave = (e) => { if (e.pointerType === 'mouse') { hover = false; kick(); } };
    // Pointer capture during a drag can swallow the pointerleave: also catch the pointer leaving via pointerout.
    const onOut = (e) => { if (e.pointerType === 'mouse' && !drag && !root.contains(e.relatedTarget)) { hover = false; kick(); } };
    // Keyboard focus pauses the row; a mouse press (which also focuses the row) does not.
    const onFocusIn = () => { focus = !!root.querySelector(':focus-visible'); kick(); };
    const onFocusOut = (e) => { if (!root.contains(e.relatedTarget)) { focus = false; kick(); } };

    const onDown = (e) => {
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      drag = { id: e.pointerId, cx: e.clientX, cy: e.clientY, x0: x, moved: false, vx: 0, lx: e.clientX, lt: performance.now() };
      cancelAnimationFrame(raf);
      raf = 0;
    };
    const onMove = (e) => {
      if (!drag || e.pointerId !== drag.id) return;
      const dx = e.clientX - drag.cx;
      if (!drag.moved) {
        // A mostly vertical touch move is the page scrolling: let it go
        if (e.pointerType === 'touch' && Math.abs(e.clientY - drag.cy) > Math.abs(dx)) { drag = null; v = 0; kick(); return; }
        if (Math.abs(dx) < 5) return;
        drag.moved = true;
        root.classList.add('is-dragging');
        vp.setPointerCapture?.(e.pointerId);
      }
      x = drag.x0 - dx;
      wrap();
      paint();
      const now = performance.now();
      const dt = Math.max(1, now - drag.lt);
      drag.vx = drag.vx * 0.6 + ((e.clientX - drag.lx) / dt) * 0.4; // px/ms, smoothed
      drag.lx = e.clientX;
      drag.lt = now;
    };
    const onUp = (e) => {
      if (!drag || (e.pointerId != null && e.pointerId !== drag.id)) return;
      if (drag.moved) {
        suppressClick = true;
        setTimeout(() => { suppressClick = false; }, 0);
        // Release velocity carries on (a pause before letting go cancels the fling)
        const fresh = performance.now() - drag.lt < 80;
        v = fresh ? Math.max(-2400, Math.min(2400, -drag.vx * 1000)) : 0;
      } else v = 0;
      root.classList.remove('is-dragging');
      drag = null;
      if (e.pointerType === 'mouse') hover = root.matches(':hover');
      kick();
    };
    const onClick = (e) => { if (suppressClick) { e.preventDefault(); e.stopPropagation(); } };
    const onKey = (e) => {
      if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
      if (e.altKey || e.ctrlKey || e.metaKey) return;
      e.preventDefault();
      const step = period > 0 ? period / n : 160;
      nudge += (e.key === 'ArrowRight' ? 1 : -1) * step;
      kick();
    };
    const noNativeDrag = (e) => e.preventDefault();

    document.addEventListener('visibilitychange', onVis);
    root.addEventListener('pointerenter', onEnter);
    root.addEventListener('pointerleave', onLeave);
    root.addEventListener('pointerout', onOut);
    root.addEventListener('focusin', onFocusIn);
    root.addEventListener('focusout', onFocusOut);
    vp.addEventListener('pointerdown', onDown);
    vp.addEventListener('pointermove', onMove);
    vp.addEventListener('pointerup', onUp);
    vp.addEventListener('pointercancel', onUp);
    vp.addEventListener('click', onClick, true);
    vp.addEventListener('keydown', onKey);
    vp.addEventListener('dragstart', noNativeDrag);
    kick();
    return () => {
      kickRef.current = null;
      cancelAnimationFrame(raf);
      io?.disconnect();
      ro?.disconnect();
      document.removeEventListener('visibilitychange', onVis);
      root.removeEventListener('pointerenter', onEnter);
      root.removeEventListener('pointerleave', onLeave);
      root.removeEventListener('pointerout', onOut);
      root.removeEventListener('focusin', onFocusIn);
      root.removeEventListener('focusout', onFocusOut);
      vp.removeEventListener('pointerdown', onDown);
      vp.removeEventListener('pointermove', onMove);
      vp.removeEventListener('pointerup', onUp);
      vp.removeEventListener('pointercancel', onUp);
      vp.removeEventListener('click', onClick, true);
      vp.removeEventListener('keydown', onKey);
      vp.removeEventListener('dragstart', noNativeDrag);
      root.classList.remove('is-dragging');
      track.style.transform = '';
    };
  }, [reduced, speed, n]);

  if (!n) return null;

  if (reduced) {
    return (
      <ul className={cx('marquee', 'marquee--static', className)} aria-label={label}>
        {list.map((item, i) => (
          <li className="marquee__item" key={i}>
            {item}
          </li>
        ))}
      </ul>
    );
  }

  return (
    <div ref={rootRef} className={cx('marquee', paused && 'marquee--paused', className)} role="region" aria-label={label}>
      <div
        ref={viewportRef}
        className="marquee__viewport"
        tabIndex={0}
        aria-label={t(`${label || 'Items'}: scrollable list`, `${label || 'உருப்படிகள்'}: உருட்டக்கூடிய பட்டியல்`)}
      >
        <ul ref={trackRef} className="marquee__track">
          {list.map((item, i) => (
            <li className="marquee__item" key={`a${i}`}>
              {item}
            </li>
          ))}
          {list.map((item, i) => (
            <li className="marquee__item" key={`b${i}`} aria-hidden="true" inert="">
              {item}
            </li>
          ))}
        </ul>
      </div>
      <button type="button" className="marquee__toggle" aria-pressed={paused} onClick={() => setPaused((p) => !p)}>
        {paused ? <Play size={14} aria-hidden="true" /> : <Pause size={14} aria-hidden="true" />}
        <span>{paused ? t('Play', 'இயக்கு') : t('Pause', 'நிறுத்து')}</span>
      </button>
    </div>
  );
}

export default Marquee;
