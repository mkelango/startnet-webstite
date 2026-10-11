// Page-local helpers for the "Who we are" pages (owned by the about/ agent).
// Tamil copy in this folder is a draft pending native review (Book 2 §14, Appendix A #14).
import { useEffect, useRef, useState } from 'react';
import { TagChip } from '../../components';
import { isPlaceholderMetric, isPlaceholderNode } from '../../components/_placeholders.js';
import { useLang } from '../../lib/i18n.jsx';
import './shared.css';

export const PH = '[placeholder — to be supplied by StartNet]';
export const PH_TA = '[placeholder — StartNet வழங்கும்]';

/** Localised default placeholder text. */
export function usePH() {
  const { t } = useLang();
  return t(PH, PH_TA);
}

/** Breadcrumb items for PageHero (Home is prepended and paths are localised by <Breadcrumbs>). */
export function aboutCrumbs(t, current) {
  const root = t('Who we are', 'நாங்கள் யார்');
  return current ? [{ label: root, to: '/about' }, { label: current }] : [{ label: root }];
}

/** The reading line: a section is "current" once its top has passed 35% of the viewport height. */
const READ_LINE = 0.35;

/**
 * Tracks which section id is currently in the reading zone. The current section is always computed from
 * every observed element (the last one whose top is at or above the reading line), never only from the
 * entries an IntersectionObserver callback happens to report.
 */
export function useActiveSection(ids) {
  const [active, setActive] = useState(ids[0]);
  const key = ids.join('|');
  useEffect(() => {
    const els = ids.map((id) => document.getElementById(id)).filter(Boolean);
    if (!els.length) return undefined;
    const compute = () => {
      const line = window.innerHeight * READ_LINE;
      let current = els[0].id;
      for (const el of els) {
        if (el.getBoundingClientRect().top <= line) current = el.id;
      }
      // At the very bottom of the page a short last section may never reach the line: it is current
      // once the reader cannot scroll any further and it is on screen.
      const doc = document.documentElement;
      const last = els[els.length - 1];
      if (window.innerHeight + window.scrollY >= doc.scrollHeight - 2 && last.getBoundingClientRect().top < window.innerHeight) {
        current = last.id;
      }
      setActive((prev) => (prev === current ? prev : current));
    };
    let io;
    if (typeof IntersectionObserver !== 'undefined') {
      io = new IntersectionObserver(compute, { rootMargin: `-${READ_LINE * 100}% 0px -${(1 - READ_LINE) * 100 - 1}% 0px`, threshold: 0 });
      els.forEach((el) => io.observe(el));
    }
    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => { frame = 0; compute(); });
    };
    compute();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      io?.disconnect();
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
  return active;
}

/**
 * Sliding Ink pill for a (possibly sideways-scrolling) pill segmented control (DESIGN-v2 3.12). Measures the item
 * matching `selector` inside `listRef` against the list itself (offsetLeft / scrollWidth), so the pill scrolls with
 * the items on phones. Writes --ind-x/-y/-w/-h/-sw and data-ind-ready on the list; draw it with a child
 * `.about-pill__ind` (an aria-hidden <li> or <span>). Hidden until measured: the active item paints its own pill
 * (Tabs.css `.segmented:not([data-ind-ready])`), so SSR, prerender and no-JS still show the state.
 */
export function usePillIndicator(listRef, selector, deps = [], enabled = true) {
  useEffect(() => {
    const list = listRef.current;
    if (!enabled || !list) return undefined;
    let raf = 0;
    const measure = () => {
      raf = 0;
      const el = list.querySelector(selector);
      if (!el) { list.removeAttribute('data-ind-ready'); return; }
      list.style.setProperty('--ind-x', `${el.offsetLeft}px`);
      list.style.setProperty('--ind-y', `${el.offsetTop}px`);
      list.style.setProperty('--ind-w', `${el.offsetWidth}px`);
      list.style.setProperty('--ind-h', `${el.offsetHeight}px`);
      list.style.setProperty('--ind-sw', `${list.scrollWidth}px`);
      list.setAttribute('data-ind-ready', '');
    };
    measure();
    document.fonts?.ready?.then(() => { if (!raf) raf = requestAnimationFrame(measure); }).catch(() => {});
    let ro;
    if (typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(() => { if (!raf) raf = requestAnimationFrame(measure); });
      ro.observe(list);
    }
    return () => { cancelAnimationFrame(raf); ro?.disconnect(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, enabled]);
}

/** Which edges of a sideways-scrolling row have hidden content (drives the mask-image edge fades). */
function useEdgeFades(ref, enabled) {
  const [edges, setEdges] = useState({ start: false, end: false });
  useEffect(() => {
    const el = ref.current;
    if (!enabled || !el) return undefined;
    const update = () => {
      const start = el.scrollLeft > 4;
      const end = el.scrollLeft + el.clientWidth < el.scrollWidth - 4;
      setEdges((prev) => (prev.start === start && prev.end === end ? prev : { start, end }));
    };
    update();
    el.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    let ro;
    if (typeof ResizeObserver !== 'undefined') { ro = new ResizeObserver(update); ro.observe(el); }
    document.fonts?.ready?.then(update).catch(() => {});
    return () => {
      el.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
      ro?.disconnect();
    };
  }, [ref, enabled]);
  return edges;
}

/**
 * In-page navigation (T19 "sections with in-page nav").
 * variant 'bar'   → sticky horizontal chip bar under the header (scrolls sideways on phones, with edge fades).
 * variant 'aside' → sticky table of contents in a side column (desktop), list on mobile.
 */
export function InPageNav({ items, label, variant = 'bar' }) {
  const { t } = useLang();
  const navLabel = label || t('On this page', 'இந்தப் பக்கத்தில்');
  const active = useActiveSection(items.map((i) => i.id));
  const listRef = useRef(null);
  const edges = useEdgeFades(listRef, variant === 'bar');

  // Bar variant: keep the active chip visible in the sideways-scrolling row. Scrolls only the chip row
  // (never the page, so it cannot interrupt an in-progress anchor scroll).
  useEffect(() => {
    if (variant !== 'bar') return;
    const list = listRef.current;
    const link = list?.querySelector('[aria-current]');
    if (!list || !link || list.scrollWidth <= list.clientWidth) return;
    const lr = list.getBoundingClientRect();
    const r = link.getBoundingClientRect();
    const left = list.scrollLeft + (r.left - lr.left) - (lr.width - r.width) / 2;
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
      || document.documentElement.dataset.motion === 'reduced';
    list.scrollTo({ left: Math.max(0, left), behavior: reduced ? 'auto' : 'smooth' });
  }, [active, variant]);

  // Bar variant: the sliding Ink pill (DESIGN-v2 3.12 pill segmented).
  usePillIndicator(listRef, '[aria-current]', [active], variant === 'bar');

  return (
    <nav className={`about-toc about-toc--${variant}`} aria-label={navLabel}>
      {variant === 'aside' && <p className="about-toc__title">{navLabel}</p>}
      <ol
        className={variant === 'bar' ? 'about-toc__list segmented' : 'about-toc__list'}
        ref={listRef}
        data-fade-start={variant === 'bar' && edges.start ? '' : undefined}
        data-fade-end={variant === 'bar' && edges.end ? '' : undefined}
      >
        {items.map((item, i) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              className={variant === 'bar' ? 'about-toc__link segmented__item' : 'about-toc__link'}
              aria-current={active === item.id ? 'location' : undefined}
            >
              {variant === 'aside' && <span className="about-toc__num tnum">{String(i + 1).padStart(2, '0')}</span>}
              {item.label}
            </a>
          </li>
        ))}
        {variant === 'bar' && <li className="about-pill__ind" aria-hidden="true" />}
      </ol>
    </nav>
  );
}

/**
 * Wraps an InPageNav 'bar' so it sticks below the header across the page body.
 * .about-bar is the sticky element (a direct child of <main>); .about-bar__sheet carries the surface, so the
 * rounded sheet top can square off once the bar is stuck (CSS scroll-state query, where supported).
 */
export function InPageBar({ items, label }) {
  return (
    <div className="about-bar">
      <div className="about-bar__sheet">
        <div className="container">
          <InPageNav items={items} label={label} variant="bar" />
        </div>
      </div>
    </div>
  );
}

/** Find a metric by key or label pattern in a Metric[] (from /api/metrics or /api/ledger). */
export function findMetric(list, re) {
  if (!Array.isArray(list)) return null;
  return list.find((m) => m && (re.test(m.key || '') || re.test(m.id || '') || re.test(m.label || ''))) || null;
}

/** True when a metric has a publishable value (not missing, not only a register mark such as "[placeholder]"). */
export const hasValue = (m) => !isPlaceholderMetric(m);

/**
 * A figure that is not yet supplied: label + a real status note (e.g. "Not yet reported") + the tag field still to
 * be set. With no note, or a note that is only a register mark ("[placeholder — …]"), it renders nothing: the figure
 * stays hidden until StartNet supplies it.
 */
export function PendingFigure({ label, note, tags = 'A/B/C' }) {
  const { t } = useLang();
  if (isPlaceholderNode(note)) return null;
  return (
    <div className="about-pending">
      <dt className="about-pending__label">{label}</dt>
      <dd className="about-pending__value">
        {note}
        <span className="about-pending__tag caption">{t('Tag', 'குறி')} [{tags}]</span>
      </dd>
    </div>
  );
}

/** Inline legend row: three tag chips with one-line meanings (Book 2 §2.4 section 2). */
export function TagLegend({ compact = false }) {
  const { t } = useLang();
  const rows = [
    { tag: 'A', text: t('verified against a primary source.', 'முதன்மை மூலத்துடன் சரிபார்க்கப்பட்டது.') },
    { tag: 'B', text: t('reported by the founder or organisation.', 'நிறுவனர் அல்லது நிறுவனம் தெரிவித்தது.') },
    { tag: 'C', text: t('an estimate or planning assumption.', 'ஒரு மதிப்பீடு அல்லது திட்டமிடல் அனுமானம்.') },
  ];
  return (
    <ul className={`about-legend${compact ? ' about-legend--compact' : ''}`}>
      {rows.map((r) => (
        <li key={r.tag} className="about-legend__row">
          <TagChip tag={r.tag} />
          <span>
            <strong>{r.tag}:</strong> {r.text}
          </span>
        </li>
      ))}
    </ul>
  );
}

/** Numbered marker used in statement sections ("01", "02"…). */
export function Num({ n }) {
  return <span className="about-num tnum" aria-hidden="true">{String(n).padStart(2, '0')}</span>;
}
