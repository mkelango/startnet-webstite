import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import { AnimatePresence, m as motionM } from 'framer-motion';
import { MotionFeatures } from '../lib/motionFeatures.js';
import { X } from 'lucide-react';
import { useLang, pickLang } from '../lib/i18n.jsx';
import { formatDate, formatNumber } from '../lib/format.js';
import { useReducedMotion } from '../hooks/useReducedMotion.js';
import { TagChip } from './TagChip.jsx';
import { Placeholder } from './Placeholder.jsx';
import { TAG_META, cx, dateLike, isHttp, isoLike, safeId } from './_utils.js';
import { cleanMarks, isPlaceholderText } from './_placeholders.js';
import './Stat.css';

const FIELDS = ['value', 'unit', 'prefix', 'label', 'tag', 'asAt', 'source', 'sourceType', 'note'];
const TIGHT_UNITS = /^(%|\+|x|×|k|K|L|Cr|cr|M|B)$/;
const EASE_ENTER = [0, 0, 0.3, 1];
const COUNT_MS = 1000; // --dur-count (DESIGN-v2 3.9)
/** easeOutCubic */
const easeOut = (p) => 1 - (1 - p) ** 3;
const useLayoutEffectSafe = typeof window === 'undefined' ? useEffect : useLayoutEffect;

const MONTH_YEAR = /^(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\.?\s+(\d{4})$/i;
const MONTHS = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
/** ISO dates are formatted; on /ta a written "July 2026" becomes the Tamil month too. */
const asAtText = (asAt, lang) => {
  if (isoLike(asAt)) return formatDate(asAt, undefined, lang);
  const my = lang === 'ta' && typeof asAt === 'string' ? MONTH_YEAR.exec(asAt.trim()) : null;
  if (my) {
    const mi = MONTHS.indexOf(my[1].slice(0, 3).toLowerCase());
    return formatDate(`${my[2]}-${String(mi + 1).padStart(2, '0')}-15`, { month: 'long', year: 'numeric' }, lang);
  }
  return asAt;
};
// Tamil pages write the Indian units out (Book 3 §4.4 rule 5).
const TA_UNITS = { Cr: 'கோடி', cr: 'கோடி', crore: 'கோடி', L: 'லட்சம்', lakh: 'லட்சம்', lakhs: 'லட்சம்' };

const POP_GUTTER = 16;
const POP_GAP = 8;
const POP_BOTTOM_ALLOWANCE = 72; // room for the fixed mobile bottom bar
const TABBABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

const tabbablesIn = (root) =>
  Array.from(root.querySelectorAll(TABBABLE)).filter((el) => el.getClientRects().length > 0 && !el.closest('[inert]'));

/**
 * The A/B/C tag button + non-modal source popover (Book 3 C15, Book 4 IX-13).
 * The panel is portalled to <body> with position:fixed so no section, scroller or sibling chip
 * can clip or overpaint it; it is clamped to the viewport and flips above the tag when needed.
 */
export function TagPopover({ tag = 'C', source, sourceType, asAt, note, label, corrected, short = false }) {
  const { t, lang, localePath } = useLang();
  const reduced = useReducedMotion();
  const key = String(tag || 'C').toUpperCase();
  const meta = TAG_META[key] || TAG_META.C;
  const [open, setOpen] = useState(false);
  const [ctx, setCtx] = useState({});
  const wrapRef = useRef(null);
  const btnRef = useRef(null);
  const panelRef = useRef(null);
  const timer = useRef(null);
  const openedBy = useRef(null);
  const pointerInside = useRef(false);
  const uid = safeId(useId());
  const popId = `tagpop-${uid}`;
  const headId = `tagpop-h-${uid}`;

  const inside = (node) =>
    !!node && !!((wrapRef.current && wrapRef.current.contains(node)) || (panelRef.current && panelRef.current.contains(node)));

  /** Position the panel next to the button, clamped to the viewport, flipped above when needed. */
  const place = useCallback(() => {
    const btn = btnRef.current;
    const panel = panelRef.current;
    if (!btn || !panel || typeof window === 'undefined') return;
    const r = btn.getBoundingClientRect();
    const vw = document.documentElement.clientWidth || window.innerWidth;
    const vh = window.innerHeight;
    panel.style.maxHeight = '';
    panel.style.overflowY = '';
    const pw = panel.offsetWidth;
    const ph = panel.offsetHeight;
    const left = Math.max(POP_GUTTER, Math.min(r.left - 4, vw - POP_GUTTER - pw));
    let top = r.bottom + POP_GAP;
    if (top + ph > vh - POP_BOTTOM_ALLOWANCE) {
      const above = r.top - ph - POP_GAP;
      if (above >= POP_GUTTER) {
        top = above;
      } else {
        // Neither side fits: use the roomier side and scroll inside the panel, keeping the tag visible.
        const spaceBelow = vh - POP_BOTTOM_ALLOWANCE - (r.bottom + POP_GAP);
        const spaceAbove = r.top - POP_GAP - POP_GUTTER;
        const best = Math.max(spaceBelow, spaceAbove);
        if (best >= 200) {
          panel.style.maxHeight = `${Math.floor(best)}px`;
          top = spaceBelow >= spaceAbove ? r.bottom + POP_GAP : POP_GUTTER;
        } else {
          top = POP_GUTTER;
          panel.style.maxHeight = `${Math.max(120, vh - 2 * POP_GUTTER)}px`;
        }
        panel.style.overflowY = 'auto';
      }
    }
    panel.style.left = `${Math.round(left)}px`;
    panel.style.top = `${Math.round(top)}px`;
  }, []);

  const close = useCallback((refocus) => {
    clearTimeout(timer.current);
    openedBy.current = null;
    setOpen(false);
    if (refocus) btnRef.current?.focus();
  }, []);

  const doOpen = (by) => {
    const b = btnRef.current;
    if (b) {
      // The portalled panel no longer inherits these from its ancestors, so carry them over.
      const surfaceEl = b.closest('[data-surface]');
      const brandEl = b.closest('[data-brand]');
      const langEl = b.closest('[lang]');
      setCtx({
        surface: surfaceEl?.getAttribute('data-surface') || undefined,
        brand: brandEl?.getAttribute('data-brand') || undefined,
        lang: langEl && langEl !== document.documentElement ? langEl.getAttribute('lang') || undefined : undefined,
      });
    }
    openedBy.current = by;
    setOpen(true);
  };

  useLayoutEffect(() => {
    if (!open) return undefined;
    place();
    const onScroll = (e) => {
      if (panelRef.current && e.target instanceof Node && panelRef.current.contains(e.target)) return;
      place();
    };
    const onResize = () => place();
    window.addEventListener('scroll', onScroll, { passive: true, capture: true });
    window.addEventListener('resize', onResize);
    const ro = typeof ResizeObserver !== 'undefined' && panelRef.current ? new ResizeObserver(onResize) : null;
    if (ro) ro.observe(panelRef.current);
    return () => {
      window.removeEventListener('scroll', onScroll, { capture: true });
      window.removeEventListener('resize', onResize);
      ro?.disconnect();
    };
  }, [open, place]);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') close(true);
    };
    const onDown = (e) => {
      if (!inside(e.target)) close(false);
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onDown);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, close]);

  useEffect(() => () => clearTimeout(timer.current), []);

  /** Close when focus leaves both the button and the panel. */
  const onFocusOut = (e) => {
    if (!open) return;
    const next = e.relatedTarget;
    if (next) {
      if (!inside(next)) close(false);
      return;
    }
    // relatedTarget is null when a click lands on non-focusable text: a pointerdown inside keeps it open.
    if (pointerInside.current) return;
    setTimeout(() => {
      if (!pointerInside.current && !inside(document.activeElement)) close(false);
    }, 0);
  };
  const markPointerInside = () => {
    pointerInside.current = true;
    setTimeout(() => {
      pointerInside.current = false;
    }, 0);
  };

  /** The panel lives at the end of <body>, so bridge the Tab order between button and panel by hand. */
  const onButtonKeyDown = (e) => {
    if (!open || e.key !== 'Tab' || e.shiftKey || !panelRef.current) return;
    const items = tabbablesIn(panelRef.current);
    if (!items.length) return;
    e.preventDefault();
    items[0].focus();
  };
  const onPanelKeyDown = (e) => {
    if (e.key !== 'Tab' || !panelRef.current) return;
    const items = tabbablesIn(panelRef.current);
    if (!items.length) return;
    const first = items[0];
    const last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      btnRef.current?.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      // Continue with whatever follows the button in the page, and close.
      const panelEl = panelRef.current;
      const all = tabbablesIn(document.body).filter((el) => !panelEl.contains(el));
      const idx = all.indexOf(btnRef.current);
      const nextEl = idx >= 0 ? all[idx + 1] : null;
      e.preventDefault();
      close(false);
      (nextEl || btnRef.current)?.focus();
    }
  };

  const fineHover = (e) =>
    e.pointerType === 'mouse' && typeof window !== 'undefined' && window.matchMedia?.('(hover: hover)').matches;

  const onEnter = (e) => {
    if (!fineHover(e)) return;
    clearTimeout(timer.current);
    if (open) return;
    timer.current = setTimeout(() => doOpen('hover'), 300);
  };
  const onLeave = (e) => {
    if (!fineHover(e)) return;
    clearTimeout(timer.current);
    if (openedBy.current === 'hover') timer.current = setTimeout(() => close(false), 400);
  };
  const onClick = () => {
    clearTimeout(timer.current);
    if (open && openedBy.current === 'hover') {
      openedBy.current = 'click';
      return;
    }
    if (open) close(false);
    else doOpen('click');
  };

  // No source supplied yet: the Source row is left out (never a placeholder inside the popover).
  const sourceNode = source && !isPlaceholderText(source) ? (
    isHttp(source) ? (
      <a href={source} rel="noopener noreferrer">
        {source.replace(/^https?:\/\//, '')}
      </a>
    ) : (
      source
    )
  ) : null;

  const panel = (
    <MotionFeatures>
    <AnimatePresence>
      {open && (
        <motionM.span
          ref={panelRef}
          id={popId}
          role="dialog"
          aria-modal="false"
          aria-labelledby={headId}
          className="tag-pop__panel"
          data-surface={ctx.surface}
          data-brand={ctx.brand}
          lang={ctx.lang}
          onPointerEnter={onEnter}
          onPointerLeave={onLeave}
          onPointerDown={markPointerInside}
          onBlur={onFocusOut}
          onKeyDown={onPanelKeyDown}
          initial={reduced ? false : { opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0, transition: { duration: reduced ? 0 : 0.24, ease: EASE_ENTER } }}
          exit={{ opacity: 0, y: reduced ? 0 : 2, transition: { duration: reduced ? 0 : 0.16 } }}
        >
          <span className="tag-pop__head">
            <TagChip tag={key} />
            <strong id={headId} className="tag-pop__title">
              {t('Confidence', 'நம்பகத்தன்மை')} {key}
            </strong>
            <button
              type="button"
              className="tag-pop__close"
              aria-label={t('Close source details', 'மூல விவரங்களை மூடு')}
              onClick={() => close(true)}
            >
              <X size={16} aria-hidden="true" />
            </button>
          </span>
          <span className="tag-pop__meaning">{t(meta.meaning, meta.meaningTa)}</span>
          {label && <span className="tag-pop__label">{label}</span>}
          <span className="tag-pop__rows">
            {sourceNode && (
              <span className="tag-pop__row">
                <span className="tag-pop__k">{t('Source', 'மூலம்')}</span>
                <span className="tag-pop__v">{sourceNode}</span>
              </span>
            )}
            {sourceType && (
              <span className="tag-pop__row">
                <span className="tag-pop__k">{t('Source type', 'மூல வகை')}</span>
                <span className="tag-pop__v">{sourceType}</span>
              </span>
            )}
            {asAt && (
              <span className="tag-pop__row">
                <span className="tag-pop__k">{dateLike(asAt) ? t('As at', 'நிலவரம்') : t('Basis', 'அடிப்படை')}</span>
                <span className="tag-pop__v">{asAtText(asAt, lang)}</span>
              </span>
            )}
            {note && (
              <span className="tag-pop__row">
                <span className="tag-pop__k">{t('Method', 'முறை')}</span>
                <span className="tag-pop__v">{note}</span>
              </span>
            )}
            {corrected && (
              <span className="tag-pop__row">
                <span className="tag-pop__k">{t('Status', 'நிலை')}</span>
                <span className="tag-pop__v">{t('Corrected. See the corrections log.', 'திருத்தப்பட்டது. திருத்தப் பதிவைப் பாருங்கள்.')}</span>
              </span>
            )}
          </span>
          <span className="tag-pop__links">
            <Link to={localePath('/about/evidence-standard')} onClick={() => close(false)}>
              {t('How we tag figures', 'எண்களை எப்படிக் குறிக்கிறோம்')}
            </Link>
            <Link to={localePath('/contact')} onClick={() => close(false)}>
              {t('Report a correction', 'திருத்தத்தைத் தெரிவிக்க')}
            </Link>
          </span>
        </motionM.span>
      )}
    </AnimatePresence>
    </MotionFeatures>
  );

  return (
    <span className="tag-pop" ref={wrapRef} onPointerEnter={onEnter} onPointerLeave={onLeave} onPointerDown={markPointerInside}>
      <button
        ref={btnRef}
        type="button"
        className="tag-pop__button"
        aria-expanded={open}
        aria-controls={open ? popId : undefined}
        aria-label={
          short
            ? t(`${key}: confidence, ${meta.name}. Source details`, `${key}: நம்பகத்தன்மை, ${meta.nameTa}. மூல விவரங்கள்`)
            : t(`${key} ${meta.word}: confidence, ${meta.name}. Source details`, `${key} ${meta.wordTa}: நம்பகத்தன்மை, ${meta.nameTa}. மூல விவரங்கள்`)
        }
        onClick={onClick}
        onBlur={onFocusOut}
        onKeyDown={onButtonKeyDown}
      >
        <TagChip tag={key} short={short} />
      </button>
      {typeof document !== 'undefined' ? createPortal(panel, document.body) : null}
    </span>
  );
}

/**
 * Every number goes through Stat. Tabular figures, Indian grouping, count-up 0 → value once 40% in view
 * (DESIGN-v2 3.9: 1000ms easeOutCubic, width reserved). Screen readers get the final value only; the markup and
 * reduced motion show the final value.
 */
export function Stat(props) {
  const { metric, variant = 'default', countUp, dl = false, className, align } = props;
  const m = { ...(metric || {}) };
  const { lang, t } = useLang();
  // Data from the API may carry Tamil variants (labelTa, noteTa, sourceTa, asAtTa).
  ['label', 'note', 'source'].forEach((k) => {
    if (m[k] !== undefined || m[`${k}Ta`] !== undefined) m[k] = pickLang(m, k, lang);
  });
  FIELDS.forEach((k) => {
    if (props[k] !== undefined) m[k] = props[k];
  });
  // Register marks the text reads correctly without ("A target, not a reported outcome. [confirm]") are left out.
  ['label', 'note', 'source'].forEach((k) => {
    if (typeof m[k] === 'string') m[k] = cleanMarks(m[k]);
  });
  const reduced = useReducedMotion();
  const ref = useRef(null);
  // 'in' once 40% is in view; 'past' when it was first reached while already above the viewport (a fling or an
  // #anchor jump carried the page past it): that one shows its final value at once rather than counting unseen.
  const [inView, setInView] = useState(false);

  const isNum = typeof m.value === 'number' && Number.isFinite(m.value);
  const decimals = isNum ? Math.min((String(m.value).split('.')[1] || '').length, 2) : 0;
  const doCount = isNum && countUp !== false && !reduced && m.value !== 0;
  // The markup (SSR, prerender, first client render) always carries the final value. Before the first paint the
  // client resets a stat that is still out of view to 0, so it can count up when it arrives. A stat already in
  // view while the prerendered snapshot is on screen keeps its final value (no 0 flash when the app takes over).
  const [shown, setShown] = useState(m.value);
  const armed = useRef(false);

  useLayoutEffectSafe(() => {
    if (!doCount || armed.current) return;
    armed.current = true;
    const el = ref.current;
    const r = el ? el.getBoundingClientRect() : null;
    const visible = r && r.top < window.innerHeight * 0.9 && r.bottom > 0;
    const snapshot = document.getElementById('root')?.classList.contains('is-prerender-pending');
    if (visible && snapshot) armed.current = 'skip';
    else setShown(0);
  }, [doCount]);

  useEffect(() => {
    const el = ref.current;
    if (!doCount || inView || !el) return undefined;
    if (typeof IntersectionObserver === 'undefined') { setInView('past'); return undefined; }
    // The root reaches far above the viewport, so a stat that was skipped over still reports (as 'past').
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        setInView(e.boundingClientRect.bottom <= 0 ? 'past' : 'in');
      },
      { rootMargin: '100000px 0px 0px 0px', threshold: 0.4 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [doCount, inView]);

  useEffect(() => {
    if (!isNum) return undefined;
    if (!doCount || armed.current === 'skip' || inView === 'past') {
      setShown(m.value);
      return undefined;
    }
    if (!inView) return undefined;
    // A small requestAnimationFrame count-up (F-33): framer-motion's animate() pulled ~15 KB br into the entry.
    // Runs once, from 0, when 40% of the stat is visible. The final value is always in the DOM (visually hidden).
    const from = 0;
    const to = m.value;
    const start = performance.now();
    let raf = 0;
    const tick = (now) => {
      const p = Math.min(1, Math.max(0, (now - start) / COUNT_MS)); // rAF time can precede `start`
      setShown(from + (to - from) * easeOut(p));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, doCount, isNum, m.value]);

  // Fixed fraction digits, so the live count never drops its ".0" ("34" vs "34.0") and its width does not jitter.
  const fmt = (v) => {
    const f = 10 ** decimals;
    return formatNumber(Math.round(v * f) / f, lang, decimals ? { minimumFractionDigits: decimals, maximumFractionDigits: decimals } : undefined);
  };

  const rawUnit = m.unit ? String(m.unit) : '';
  const unit = lang === 'ta' && TA_UNITS[rawUnit] ? TA_UNITS[rawUnit] : rawUnit;
  const tightUnit = TIGHT_UNITS.test(unit);
  const LabelTag = dl ? 'dt' : 'p';
  const ValueTag = dl ? 'dd' : 'p';
  const MetaTag = dl ? 'dd' : 'div';

  let valueInner;
  if (m.value === null || m.value === undefined || m.value === '') {
    valueInner = <Placeholder />;
  } else if (!isNum) {
    valueInner = (
      <>
        {m.prefix && <span className="stat__prefix">{m.prefix}</span>}
        <span className="stat__num">{m.value}</span>
        {unit && <span className={cx('stat__unit', tightUnit && 'stat__unit--tight')}>{unit}</span>}
      </>
    );
  } else {
    const finalStr = fmt(m.value);
    valueInner = (
      <>
        {m.prefix && <span className="stat__prefix">{m.prefix}</span>}
        {doCount ? (
          <span className="stat__num stat__num--count">
            {/* Width reserved by the final value itself (an invisible twin in the same grid cell), so there is no
                layout shift while counting and no gap before the unit (a `ch` estimate over-reserved for "." and ","). */}
            <span className="stat__count" aria-hidden="true">
              <span className="stat__count-final">{finalStr}</span>
              <span className="stat__count-live">{fmt(shown ?? m.value)}</span>
            </span>
            <span className="visually-hidden">{finalStr}</span>
          </span>
        ) : (
          <span className="stat__num">{finalStr}</span>
        )}
        {unit && <span className={cx('stat__unit', tightUnit && 'stat__unit--tight')}>{unit}</span>}
      </>
    );
  }

  const hasPlaceholderValue = m.value === null || m.value === undefined || m.value === '';

  return (
    <div
      ref={ref}
      className={cx('stat', `stat--${variant}`, hasPlaceholderValue && 'stat--empty', align === 'center' && 'stat--center', className)}
    >
      {m.label && <LabelTag className="stat__label">{m.label}</LabelTag>}
      <ValueTag className="stat__value">{valueInner}</ValueTag>
      {(m.tag || m.asAt) && (
        <MetaTag className="stat__meta">
          {m.tag && (
            <TagPopover
              tag={m.tag}
              source={m.source}
              sourceType={m.sourceType}
              asAt={m.asAt}
              note={m.note}
              label={m.label}
              corrected={m.corrected}
              short={variant === 'compact'}
            />
          )}
          {m.asAt &&
            (dateLike(m.asAt) ? (
              <span className="stat__asat">
                {t('as at', 'நிலவரம்:')}{' '}
                {isoLike(m.asAt) ? <time dateTime={m.asAt}>{asAtText(m.asAt, lang)}</time> : <span>{asAtText(m.asAt, lang)}</span>}
              </span>
            ) : (
              // A qualifier such as "Planning assumption" or "As published": no "as at", no <time>.
              <span className="stat__asat stat__asat--qualifier">{m.asAt}</span>
            ))}
          {m.corrected && <span className="stat__corrected">{t('Corrected', 'திருத்தப்பட்டது')}</span>}
        </MetaTag>
      )}
      {m.note && variant !== 'compact' && (dl ? <dd className="stat__note">{m.note}</dd> : <p className="stat__note">{m.note}</p>)}
    </div>
  );
}

export default Stat;
