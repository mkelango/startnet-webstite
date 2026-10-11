// C07 · Brand sub-nav (Book 1 Part B §4): 48 px sticky bar docked under the global header.
// Lock-up left → brand home · 5–7 local links centre · one brand CTA right · 3 px accent rule.
// Mobile: horizontally scrolling chip row with edge fades and the CTA pinned right; when two or more items would sit
// beyond the sixth chip, a "More" chip opens a sheet. >= 1024: when the links overflow the bar, a "More" menu lists the
// clipped ones, and the current link is always scrolled into view.
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Link, useLocation } from 'react-router-dom';
import { AnimatePresence, m } from 'framer-motion';
import { ChevronDown, MoreHorizontal, X } from 'lucide-react';
import { useLang } from '../lib/i18n.jsx';
import { useReducedMotion } from '../hooks/useReducedMotion.js';
import { BRANDS, brandCtaFor } from '../data/brands.js';
import { BrandLockup, Button } from '../components';
import { useSlidingIndicator } from '../components/_indicator.js';
import { brandCtaHref, pathOf, useMediaQuery, useModal, useShell } from './shell.jsx';
import './BrandSubNav.css';

const MAX_CHIPS = 6;
const MORE_RESERVE = 96; // ≥ 1024 "More" control width (label + chevron + padding)

const under = (basePath, p) => basePath === p || basePath.startsWith(`${p}/`);

function isActive(link, brand, basePath, search) {
  if (link.match?.some((m) => under(basePath, m))) return true;
  const target = pathOf(link.to);
  if (target === brand.base) return basePath === brand.base;
  if (link.to.includes('?')) return basePath === target && search === link.to.slice(link.to.indexOf('?'));
  return under(basePath, target);
}

function useEdgeFades(ref) {
  const [edges, setEdges] = useState({ start: false, end: false });
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const update = () => setEdges({ start: el.scrollLeft > 4, end: el.scrollLeft + el.clientWidth < el.scrollWidth - 4 });
    update();
    el.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => { el.removeEventListener('scroll', update); window.removeEventListener('resize', update); };
  }, [ref]);
  return edges;
}

function MoreSheet({ open, onClose, links, brand, current }) {
  const { t, localePath } = useLang();
  const reduced = useReducedMotion();
  const ref = useRef(null);
  useModal(ref, open, { onClose });
  // Portalled outside [data-shell-page] so the page can go inert while the sheet is open.
  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="brand-subnav-sheet" key="sheet">
          <m.div
            className="brand-subnav-sheet__backdrop"
            aria-hidden="true"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <m.div
            ref={ref}
            className="brand-subnav-sheet__panel"
            role="dialog"
            aria-modal="true"
            aria-label={t(`More from ${brand.name}`, `${brand.name}: மேலும்`)}
            data-brand={brand.key}
            initial={reduced ? { opacity: 0 } : { y: '100%' }}
            animate={reduced ? { opacity: 1 } : { y: 0, transition: { duration: 0.32, ease: [0, 0, 0.3, 1] } }}
            exit={reduced ? { opacity: 0 } : { y: '100%', transition: { duration: 0.24, ease: [0.2, 0, 1, 0.9] } }}
          >
            <div className="brand-subnav-sheet__head">
              <p className="brand-subnav-sheet__title">{brand.name}</p>
              <button type="button" className="brand-subnav-sheet__close" onClick={onClose} aria-label={t('Close', 'மூடு')}>
                <X size={20} aria-hidden="true" />
              </button>
            </div>
            <ul className="brand-subnav-sheet__list">
              {links.map((l) => (
                <li key={l.to}>
                  <Link
                    to={localePath(l.to)}
                    className="brand-subnav-sheet__link"
                    aria-current={current(l) ? 'page' : undefined}
                    onClick={onClose}
                  >
                    {t(l.label, l.labelTa)}
                  </Link>
                </li>
              ))}
            </ul>
          </m.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}

/** >= 1024: which links are clipped by the scroller (either edge). Recomputed on resize, scroll and font load. */
function useClipped(scrollerRef, enabled, deps) {
  const [clipped, setClipped] = useState([]);
  const measure = useCallback(() => {
    const el = scrollerRef.current;
    if (!el || !enabled) { setClipped((c) => (c.length ? [] : c)); return; }
    const next = [];
    if (el.scrollWidth > el.clientWidth + 1) {
      const box = el.getBoundingClientRect();
      // Before the "More" control exists, reserve its width: links it would cover count as clipped too, so no
      // link is ever left half visible beside it (F-27).
      const hasMore = !!el.parentElement?.querySelector('.brand-subnav__morewrap');
      const right = box.right - (hasMore ? 0 : MORE_RESERVE);
      el.querySelectorAll('[data-subnav-index]').forEach((li) => {
        const r = li.getBoundingClientRect();
        if (r.right > right + 1 || r.left < box.left - 1) next.push(Number(li.dataset.subnavIndex));
      });
    }
    setClipped((c) => (c.length === next.length && c.every((v, i) => v === next[i]) ? c : next));
  }, [scrollerRef, enabled]);
  useLayoutEffect(() => {
    const el = scrollerRef.current;
    measure();
    if (!el || !enabled) return undefined;
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(measure) : null;
    ro?.observe(el);
    if (el.firstElementChild) ro?.observe(el.firstElementChild);
    el.addEventListener('scroll', measure, { passive: true });
    document.fonts?.ready?.then(measure).catch(() => {});
    return () => { ro?.disconnect(); el.removeEventListener('scroll', measure); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [measure, enabled, ...deps]);
  return clipped;
}

/** >= 1024 "More" disclosure listing the links the bar cannot fit. */
function MoreMenu({ links, current, active }) {
  const { localePath, t } = useLang();
  const [open, setOpen] = useState(false);
  const wrap = useRef(null);
  const button = useRef(null);
  const { pathname } = useLocation();
  useEffect(() => { setOpen(false); }, [pathname]);
  useEffect(() => {
    if (!open) return undefined;
    const onDown = (e) => { if (!wrap.current?.contains(e.target)) setOpen(false); };
    const onKey = (e) => { if (e.key === 'Escape') { e.stopPropagation(); setOpen(false); button.current?.focus(); } };
    document.addEventListener('pointerdown', onDown);
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('pointerdown', onDown); document.removeEventListener('keydown', onKey); };
  }, [open]);
  // A press on a non-focusable part of the menu moves focus to an ancestor (<main tabIndex=-1>): not "leaving".
  const onBlur = (e) => {
    const next = e.relatedTarget;
    if (open && next && !wrap.current?.contains(next) && !next.contains(wrap.current)) setOpen(false);
  };
  return (
    <div className="brand-subnav__morewrap" ref={wrap} onBlur={onBlur}>
      <button
        ref={button}
        type="button"
        className="brand-subnav__link brand-subnav__more brand-subnav__more--menu"
        aria-expanded={open}
        aria-controls={open ? 'brand-subnav-more-list' : undefined}
        data-active={active || undefined}
        onClick={() => setOpen((o) => !o)}
      >
        {t('More', 'மேலும்')}
        {active && <span className="visually-hidden">{t(' (includes the current page)', ' (தற்போதைய பக்கம் உட்பட)')}</span>}
        <ChevronDown size={16} aria-hidden="true" className="brand-subnav__more-chev" />
      </button>
      {open && (
        <ul id="brand-subnav-more-list" className="brand-subnav__menu">
          {links.map((l) => (
            <li key={l.to}>
              <Link
                to={localePath(l.to)}
                className="brand-subnav__menu-link"
                aria-current={current(l) ? 'page' : undefined}
                onClick={() => setOpen(false)}
              >
                {t(l.label, l.labelTa)}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function BrandSubNav({ brand: brandKey }) {
  const brand = BRANDS[brandKey];
  const { t, lang, localePath, basePath } = useLang();
  const { pageCta } = useShell() || {};
  const { search, pathname } = useLocation();
  const isMobile = useMediaQuery('(max-width: 1023px)');
  const scroller = useRef(null);
  const listRef = useRef(null);
  const edges = useEdgeFades(scroller);
  const [moreOpen, setMoreOpen] = useState(false);

  useEffect(() => { setMoreOpen(false); }, [pathname]);

  const clipped = useClipped(scroller, !!brand && !isMobile, [brandKey, pathname]);
  // DESIGN-v2 3.4: the accent 2px rule under the current item glides between items (transform only).
  useSlidingIndicator(listRef, '.brand-subnav__link[aria-current="page"]', [brandKey, pathname, search, isMobile, clipped.length, lang]);

  // Keep the active link in view at every width (scrolls the row only, never the page). Re-runs when web fonts
  // load or the row resizes (widths change), and after the ≥ 1024 "More" control appears and narrows the row.
  useEffect(() => {
    const box = scroller.current;
    if (!box) return undefined;
    const reveal = () => {
      const el = box.querySelector('.brand-subnav__list [aria-current="page"]');
      if (!el) return;
      const b = box.getBoundingClientRect();
      const r = el.getBoundingClientRect();
      if (r.left >= b.left + 8 && r.right <= b.right - 8) return;
      const target = box.scrollLeft + (r.left - b.left) - (b.width - r.width) / 2;
      box.scrollTo({ left: Math.max(0, target), behavior: 'auto' });
    };
    reveal();
    let cancelled = false;
    document.fonts?.ready?.then(() => { if (!cancelled) reveal(); }).catch(() => {});
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(() => reveal()) : null;
    ro?.observe(box);
    if (box.firstElementChild) ro?.observe(box.firstElementChild);
    // Stop following size changes once the user scrolls the row themselves.
    const stop = () => ro?.disconnect();
    box.addEventListener('pointerdown', stop, { once: true });
    box.addEventListener('wheel', stop, { once: true, passive: true });
    return () => { cancelled = true; ro?.disconnect(); box.removeEventListener('pointerdown', stop); box.removeEventListener('wheel', stop); };
  }, [pathname, search, isMobile, clipped.length]);

  if (!brand) return null;
  const current = (l) => isActive(l, brand, basePath, search);
  const links = brand.subNav;
  // Phones: only fold into "More" when at least two items would be hidden (a one-item sheet is pointless).
  const overflow = isMobile && links.length > MAX_CHIPS + 1;
  const visible = overflow ? links.slice(0, MAX_CHIPS) : links;
  const hidden = overflow ? links.slice(MAX_CHIPS) : [];
  const desktopHidden = isMobile ? [] : clipped.map((i) => links[i]).filter(Boolean);
  // ≥ 1024: links listed under "More" are hidden in the bar (no half-visible link beside the control).
  const desktopClipped = new Set(isMobile ? [] : clipped);
  const ctaVariant = brandKey === 'x' ? 'primary' : 'brand';
  // Brand CTA for this page (per-path override), never a link to the page you are on: on a brand's own
  // conversion page (e.g. /vibe/vibathon) use the page's published CTA instead, or show none (F-27).
  let cta = brandCtaFor(brandKey, basePath);
  if (cta?.to && pathOf(cta.to) === basePath) {
    cta = pageCta && (pageCta.href || pageCta.snx || (pageCta.to && pathOf(pageCta.to) !== basePath)) ? pageCta : null;
  }
  const ctaHref = cta ? brandCtaHref(cta, brandKey, lang) : undefined;

  return (
    <nav className="brand-subnav" aria-label={brand.name} data-brand={brandKey} data-surface="night">
      <div className="container brand-subnav__inner">
        <Link to={localePath(brand.base)} className="brand-subnav__lockup" aria-label={t(`${brand.name} home`, `${brand.name} முகப்பு`)}>
          <BrandLockup brand={brandKey} size="sm" />
        </Link>
        <div
          className="brand-subnav__scroller"
          ref={scroller}
          onFocus={(e) => {
            // Keyboard focus on a link under an edge fade (15% of the scroller): scroll it fully clear (WCAG 2.4.11).
            const sc = scroller.current;
            const el = e.target;
            if (!sc || !(el instanceof HTMLElement) || sc.scrollWidth <= sc.clientWidth) return;
            const fade = sc.clientWidth * 0.15;
            const sr = sc.getBoundingClientRect();
            const er = el.getBoundingClientRect();
            let dx = 0;
            if (er.right > sr.right - fade) dx = er.right - (sr.right - fade);
            else if (er.left < sr.left + fade) dx = er.left - (sr.left + fade);
            if (dx) sc.scrollLeft += dx;
          }}
          data-fade-start={edges.start || undefined}
          data-fade-end={edges.end || undefined}
        >
          <ul className="brand-subnav__list" ref={listRef}>
            <li className="brand-subnav__glide-wrap" aria-hidden="true">
              <span className="ind ind--line brand-subnav__glide" />
            </li>
            {visible.map((l, i) => (
              <li key={l.to} data-subnav-index={i} data-clipped={desktopClipped.has(i) || undefined}>
                <Link
                  to={localePath(l.to)}
                  className="brand-subnav__link"
                  aria-current={current(l) ? 'page' : undefined}
                  tabIndex={desktopClipped.has(i) ? -1 : undefined}
                  aria-hidden={desktopClipped.has(i) || undefined}
                >
                  {t(l.label, l.labelTa)}
                </Link>
              </li>
            ))}
            {overflow && (
              <li>
                <button
                  type="button"
                  className="brand-subnav__link brand-subnav__more"
                  aria-haspopup="dialog"
                  aria-expanded={moreOpen}
                  data-active={hidden.some(current) || undefined}
                  onClick={() => setMoreOpen(true)}
                >
                  {t('More', 'மேலும்')} <MoreHorizontal size={16} aria-hidden="true" />
                </button>
              </li>
            )}
          </ul>
        </div>
        {desktopHidden.length > 0 && (
          <MoreMenu links={desktopHidden} current={current} active={desktopHidden.some(current)} />
        )}
        {cta && (
          <div className="brand-subnav__cta">
            <Button to={ctaHref ? undefined : cta.to} href={ctaHref} variant={ctaVariant} size="sm">
              {/* Tamil runs 30–60% longer: the short Tamil label keeps the links visible beside the CTA */}
              {t(cta.label, cta.shortLabelTa || cta.labelTa)}
            </Button>
          </div>
        )}
      </div>
      <span className="brand-subnav__rule" aria-hidden="true" />
      <MoreSheet open={moreOpen} onClose={() => setMoreOpen(false)} links={hidden} brand={brand} current={current} />
    </nav>
  );
}
