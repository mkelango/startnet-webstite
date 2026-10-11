// T07 chapter nav + reading progress (Book 3 Part B §4: "8/4 with chapter nav + reading progress"; sticky on desktop).
// Mobile: a disclosure button ("On this page") that opens the list; desktop: always open, sticky in the 4-col aside.
import { useEffect, useId, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { useLang } from '../../../lib/i18n.jsx';
import './ChapterNav.css';

/**
 * items: [{ id, label }] — ids of in-page sections (each must exist in the DOM).
 * targetRef: ref to the element whose scroll progress drives the bar (the report body).
 */
export default function ChapterNav({ items, targetRef, title, children }) {
  const { t } = useLang();
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, '');
  const listId = `chapter-nav-${uid}`;
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(items[0]?.id || null);
  const barRef = useRef(null);
  const listRef = useRef(null);
  const ids = items.map((i) => i.id).join('|');

  // Scroll-spy: the section crossing the upper third of the viewport is current.
  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return undefined;
    const els = ids.split('|').map((id) => document.getElementById(id)).filter(Boolean);
    if (!els.length) return undefined;
    // While the first section has not yet reached the band (top 25% line), it is current —
    // otherwise scrolling back to the top leaves whichever section last crossed the band marked.
    const firstAbove = () => els[0].getBoundingClientRect().top > (window.innerHeight || 0) * 0.25;
    // At the very bottom of the page a short last section may never reach the band: mark it current once the page
    // cannot scroll further and that section is on screen.
    const last = els[els.length - 1];
    const atBottom = () => {
      const doc = document.documentElement;
      return window.scrollY > 0 && window.scrollY + window.innerHeight >= doc.scrollHeight - 2 &&
        last.getBoundingClientRect().top < window.innerHeight;
    };
    const edge = () => {
      if (firstAbove()) { setActive(els[0].id); return true; }
      if (atBottom()) { setActive(last.id); return true; }
      return false;
    };
    const io = new IntersectionObserver(
      (entries) => {
        if (edge()) return;
        const hit = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (hit) setActive(hit.target.id);
      },
      { rootMargin: '-25% 0px -65% 0px', threshold: 0 },
    );
    els.forEach((el) => io.observe(el));
    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        if (edge()) return;
        // Otherwise the last section whose top has passed the band's lower edge (35%) is current.
        const line = (window.innerHeight || 0) * 0.35;
        let cur = els[0];
        for (const el of els) if (el.getBoundingClientRect().top <= line) cur = el;
        setActive(cur.id);
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      io.disconnect();
      window.removeEventListener('scroll', onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [ids]);

  // Reading progress: transform-only (scaleX), written straight to the DOM, no re-render per frame.
  useEffect(() => {
    const el = targetRef?.current;
    const bar = barRef.current;
    if (!el || !bar) return undefined;
    let frame = 0;
    const update = () => {
      frame = 0;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      const total = Math.max(rect.height - vh * 0.5, 1);
      const done = Math.min(Math.max((vh * 0.25 - rect.top) / total, 0), 1);
      bar.style.transform = `scaleX(${done.toFixed(3)})`;
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [targetRef]);

  // Sliding indicator (DESIGN-v2 3.12): a 2px Ink marker glides along the rail to the current chapter
  // (translateY + scaleY on a 100px base; transform only). Hidden until measured: the current link keeps its own
  // static rule, so SSR / no-JS still show it.
  useEffect(() => {
    const list = listRef.current;
    if (!list) return undefined;
    let raf = 0;
    const measure = () => {
      raf = 0;
      const link = list.querySelector('[aria-current]');
      if (!link || !link.offsetHeight) { list.removeAttribute('data-ind-ready'); return; }
      const li = link.parentElement;
      list.style.setProperty('--ind-y', `${li.offsetTop}px`);
      list.style.setProperty('--ind-h', String(li.offsetHeight));
      list.setAttribute('data-ind-ready', '');
    };
    measure();
    let ro;
    if (typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(() => { if (!raf) raf = requestAnimationFrame(measure); });
      ro.observe(list);
    }
    return () => { cancelAnimationFrame(raf); ro?.disconnect(); };
  }, [active, open]);

  const heading = title || t('On this page', 'இந்தப் பக்கத்தில்');

  return (
    <div className="chapter-nav">
      <nav className="chapter-nav__nav" aria-label={heading}>
        <div className="chapter-nav__progress" aria-hidden="true">
          <span ref={barRef} className="chapter-nav__bar" />
        </div>
        <button
          type="button"
          className="chapter-nav__toggle"
          aria-expanded={open}
          aria-controls={listId}
          onClick={() => setOpen((v) => !v)}
        >
          <span>{heading}</span>
          <ChevronDown size={18} aria-hidden="true" className="chapter-nav__chev" />
        </button>
        <p className="chapter-nav__title" aria-hidden="true">{heading}</p>
        <ol id={listId} className="chapter-nav__list" data-open={open ? 'true' : 'false'} ref={listRef}>
          {items.map((it, i) => (
            <li key={it.id}>
              <a
                href={`#${it.id}`}
                className="chapter-nav__link"
                aria-current={active === it.id ? 'location' : undefined}
                onClick={() => setOpen(false)}
              >
                <span className="chapter-nav__num">{String(i + 1).padStart(2, '0')}</span>
                <span>{it.label}</span>
              </a>
            </li>
          ))}
          <li className="chapter-nav__ind" aria-hidden="true" />
        </ol>
      </nav>
      {/* Extra aside content (key facts) sits outside the <nav> landmark. */}
      {children && <div className="chapter-nav__extra">{children}</div>}
    </div>
  );
}
