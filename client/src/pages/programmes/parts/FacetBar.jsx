// Filters & chips (Book 3 C35, Book 4 IX-19). Desktop: dropdown chips with counts, active chips, "Clear all".
// Mobile: "Filter (3)" → bottom sheet → "Show 24 results". Zero-count values are disabled, never hidden; they stay
// focusable (aria-disabled), so focus never drops to <body> when a count reaches zero under the pointer.
import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, SlidersHorizontal, X, Check } from 'lucide-react';
import { useReducedMotion } from '../../../hooks/useReducedMotion.js';
import { useModal } from '../../../layout/shell.jsx';
import { useLang } from '../../../lib/i18n.jsx';
import { labelize } from './facets.js';
import './FacetBar.css';

// Tamil accusative forms for "Show N <noun>" (singular, plural). Draft; native review pending.
const NOUN_TA = {
  results: ['முடிவை', 'முடிவுகளை'],
  events: ['நிகழ்வை', 'நிகழ்வுகளை'],
  programmes: ['திட்டத்தை', 'திட்டங்களை'],
};

function OptionList({ facet, values, count, onToggle, idBase }) {
  const { t } = useLang();
  const selected = values[facet.key] || [];
  return (
    <fieldset className="facetbar__fieldset">
      <legend className="facetbar__legend">{facet.label}</legend>
      <ul className="facetbar__options" role="list">
        {facet.options.map((opt) => {
          const checked = selected.includes(opt.value);
          const n = count(facet.key, opt.value);
          const disabled = !checked && n === 0;
          const id = `${idBase}-${facet.key}-${opt.value}`;
          return (
            <li key={opt.value}>
              <label className={`facetbar__option${disabled ? ' is-disabled' : ''}${checked ? ' is-checked' : ''}`} htmlFor={id}>
                <input
                  id={id}
                  type={facet.single ? 'radio' : 'checkbox'}
                  name={`${idBase}-${facet.key}`}
                  className="facetbar__input"
                  checked={checked}
                  aria-disabled={disabled || undefined}
                  onChange={() => {
                    if (disabled) return;
                    onToggle(facet.key, opt.value, facet.single);
                  }}
                  onClick={(e) => {
                    if (disabled) { e.preventDefault(); return; }
                    // radios can't normally be unticked; let a second click clear a single-select facet
                    if (facet.single && checked) { e.preventDefault(); onToggle(facet.key, opt.value, true); }
                  }}
                />
                <span className={`facetbar__box${facet.single ? ' facetbar__box--radio' : ''}`} aria-hidden="true">
                  {facet.single ? <span className="facetbar__dot" /> : <Check size={14} strokeWidth={3} />}
                </span>
                <span className="facetbar__opt-label">{opt.label}</span>
                <span className="facetbar__opt-count tnum">
                  {n}
                  <span className="visually-hidden">{t(' results', ' முடிவுகள்')}</span>
                </span>
              </label>
            </li>
          );
        })}
      </ul>
    </fieldset>
  );
}

function readGutter() {
  const raw = getComputedStyle(document.documentElement).getPropertyValue('--gutter').trim();
  return (parseFloat(raw) || 1) * (raw.endsWith('px') ? 1 : 16);
}

function Dropdown({ facet, values, count, onToggle, idBase }) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);
  const btnRef = useRef(null);
  const popRef = useRef(null);
  const popId = `${idBase}-${facet.key}-pop`;
  const n = values[facet.key]?.length || 0;

  // The popover is position: fixed and placed from the trigger's rect, so a horizontally scrolling chip row
  // (1024–1279px) never clips it. It stays inside the viewport and follows the trigger on scroll and resize.
  const place = useCallback(() => {
    const btn = btnRef.current;
    const pop = popRef.current;
    if (!btn || !pop) return;
    const gutter = readGutter();
    const vw = document.documentElement.clientWidth;
    const vh = window.innerHeight;
    const r = btn.getBoundingClientRect();
    const w = pop.offsetWidth;
    let left = r.left;
    if (left + w > vw - gutter) left = Math.max(gutter, r.right - w);
    const top = r.bottom + 8;
    pop.style.left = `${left}px`;
    pop.style.top = `${top}px`;
    if (pop.firstElementChild) pop.firstElementChild.style.maxHeight = `${Math.max(160, Math.min(352, vh - top - gutter))}px`;
    // Correct for any ancestor that becomes the containing block of a fixed element. (The entrance animation
    // runs on the inner panel, so this outer box's rect carries no animation transform.)
    const got = pop.getBoundingClientRect();
    const dx = got.left - left;
    const dy = got.top - top;
    if (Math.abs(dx) > 0.5 || Math.abs(dy) > 0.5) {
      pop.style.left = `${left - dx}px`;
      pop.style.top = `${top - dy}px`;
    }
  }, []);

  useLayoutEffect(() => {
    if (!open) return undefined;
    place();
    window.addEventListener('scroll', place, true);
    window.addEventListener('resize', place);
    return () => {
      window.removeEventListener('scroll', place, true);
      window.removeEventListener('resize', place);
    };
  }, [open, place]);

  useEffect(() => {
    if (!open) return undefined;
    const onDoc = (e) => { if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false); };
    const onKey = (e) => { if (e.key === 'Escape') { setOpen(false); btnRef.current?.focus(); } };
    document.addEventListener('pointerdown', onDoc);
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('pointerdown', onDoc); document.removeEventListener('keydown', onKey); };
  }, [open]);

  // Close when keyboard focus leaves the trigger + popover (Tab past the last option, Shift+Tab before the trigger).
  const onBlur = (e) => {
    const next = e.relatedTarget;
    // A mouse press on a non-focusable part of the popover (an option label) moves focus to the nearest
    // focusable ancestor (<main tabIndex=-1>). That is not "leaving" — ignore ancestors; the document
    // pointerdown handler already closes the popover on real outside clicks.
    if (next && wrapRef.current && !wrapRef.current.contains(next) && !next.contains(wrapRef.current)) setOpen(false);
  };

  return (
    <div className="facetbar__dd" ref={wrapRef} onBlur={onBlur}>
      <button
        ref={btnRef}
        type="button"
        className={`facetbar__chip${n ? ' is-active' : ''}`}
        aria-expanded={open}
        aria-controls={open ? popId : undefined}
        onClick={() => setOpen((o) => !o)}
      >
        <span>{facet.label}</span>
        {n > 0 && <span className="facetbar__chip-count tnum">{n}</span>}
        <ChevronDown size={16} aria-hidden="true" className="facetbar__chev" />
      </button>
      {open && (
        <div ref={popRef} className="facetbar__pop" id={popId}>
          <div className="facetbar__pop-panel">
            <OptionList facet={facet} values={values} count={count} onToggle={onToggle} idBase={`${idBase}-dd`} />
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * @param facets   [{ key, label, options: [{ value, label }], single? }]
 * @param values   { key: string[] }  every facet param the page reads (from useFacetParams)
 * @param count    (key, value) => number   faceted count
 * @param onToggle (key, value, single) => void
 * @param onClear  () => void
 * @param total    number of results with current filters
 * @param quick    [{ key, value, label }] one-tap shortcut chips (Book 2 §4 optional filters)
 * @param extra    node rendered at the end of the row (e.g. view toggle)
 * @param chipFacets optional [{ key, label, options, single? }] — params set outside the bar (e.g. the finder) that
 *                 still get a labelled, removable active chip. Any other non-empty key falls back to labelize().
 * @param noun     'results' | 'events' | 'programmes' — used in "Show N <noun>" (Tamil forms built in)
 * @param className extra class for the bar itself (pages use it to make the bar sticky). The bar, the
 *                 active-filter row and the sheet render as siblings (fragment), so only the compact bar
 *                 sticks and "Clear all" scrolls away with the content.
 */
export default function FacetBar({
  facets, values, count, onToggle, onClear, total, quick = [], extra, label, noun = 'results', clearable, className = '', chipFacets = [],
}) {
  const { t, lang } = useLang();
  const idBase = useId().replace(/:/g, '');
  const reduced = useReducedMotion();
  const [sheet, setSheet] = useState(false);
  const sheetBtn = useRef(null);
  const sheetTitle = useRef(null);
  const sheetRef = useRef(null);
  const regionLabel = label || t('Filters', 'வடிகட்டிகள்');

  // Active chips and the count come from every non-empty URL facet, not only the rendered dropdowns (F-67),
  // so e.g. ?district=Chennai shows "District: Chennai" and "Filter (1)" even before the district has a facet.
  const known = [...facets, ...chipFacets];
  const active = [];
  Object.keys(values || {}).forEach((key) => {
    const list = values[key] || [];
    if (!list.length) return;
    const f = known.find((x) => x.key === key);
    list.forEach((v) => {
      const opt = f?.options?.find((o) => o.value === v);
      const keyLabel = f ? f.label : labelize(key);
      active.push({ key, value: v, single: f?.single, label: `${keyLabel}: ${opt ? opt.label : labelize(v)}` });
    });
  });
  const activeCount = active.length;

  // Modal sheet: traps Tab, closes on Esc, makes the page inert, locks scroll and returns focus to the trigger.
  useModal(sheetRef, sheet, { onClose: () => setSheet(false), initialFocus: sheetTitle, returnTo: sheetBtn });

  // The sheet is a < 1024px affordance; close it if the viewport grows past that while it is open.
  useEffect(() => {
    if (!sheet || typeof window === 'undefined' || !window.matchMedia) return undefined;
    const mq = window.matchMedia('(min-width: 1024px)');
    const onChange = () => { if (mq.matches) setSheet(false); };
    mq.addEventListener?.('change', onChange);
    return () => mq.removeEventListener?.('change', onChange);
  }, [sheet]);

  // "Clear all" shows whenever any filter is active, including ones set outside the bar (e.g. the finder).
  const canClear = clearable ?? active.length > 0;
  const one = total === 1;
  const nounTa = NOUN_TA[noun] || NOUN_TA.results;
  const showLabel = t(
    `Show ${total} ${one ? noun.replace(/s$/, '') : noun}`,
    `${total} ${one ? nounTa[0] : nounTa[1]}ப் பாருங்கள்`
  );
  const clearLabel = t('Clear all', 'அனைத்தையும் நீக்குங்கள்');

  const sheetNode = (
    <AnimatePresence>
      {sheet && (
        <motion.div key="sheet" className="facetbar__sheet-root" lang={lang} initial={false} exit={{ opacity: 1 }} transition={{ duration: reduced ? 0 : 0.24 }}>
          <motion.div
            className="facetbar__scrim"
            aria-hidden="true"
            onClick={() => setSheet(false)}
            initial={reduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduced ? 0 : 0.24 }}
          />
          <motion.div
            ref={sheetRef}
            className="facetbar__sheet"
            role="dialog"
            aria-modal="true"
            aria-labelledby={`${idBase}-sheet-title`}
            initial={reduced ? false : { y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ duration: reduced ? 0 : 0.24, ease: [0, 0, 0.3, 1] }}
          >
            <div className="facetbar__sheet-head">
              <h2 id={`${idBase}-sheet-title`} className="h5" tabIndex={-1} ref={sheetTitle}>
                {t('Filters', 'வடிகட்டிகள்')}
              </h2>
              <button type="button" className="facetbar__sheet-close" onClick={() => setSheet(false)} aria-label={t('Close filters', 'வடிகட்டிகளை மூடுங்கள்')}>
                <X size={22} aria-hidden="true" />
              </button>
            </div>
            <div className="facetbar__sheet-body">
              {facets.map((f) => (
                <OptionList key={f.key} facet={f} values={values} count={count} onToggle={onToggle} idBase={`${idBase}-sh`} />
              ))}
            </div>
            <div className="facetbar__sheet-foot">
              <button type="button" className="facetbar__clear" onClick={onClear} disabled={!canClear}>
                {clearLabel}
              </button>
              <button type="button" className="facetbar__show" onClick={() => setSheet(false)}>
                {showLabel}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <>
      <div className={`facetbar${className ? ` ${className}` : ''}`} role="region" aria-label={regionLabel}>
        <div className="facetbar__row">
          {/* < 1024px: one "Filter (n)" trigger opens the sheet */}
          <button
            ref={sheetBtn}
            type="button"
            className={`facetbar__sheet-btn${activeCount ? ' is-active' : ''}`}
            onClick={() => setSheet(true)}
            aria-haspopup="dialog"
            aria-expanded={sheet}
          >
            <SlidersHorizontal size={18} aria-hidden="true" />
            <span>
              {t('Filter', 'வடிகட்டி')}
              {activeCount ? ` (${activeCount})` : ''}
            </span>
          </button>

          {quick.length > 0 && (
            <div className="facetbar__quick" role="group" aria-label={t('Quick filters', 'விரைவு வடிகட்டிகள்')}>
              {quick.map((q) => {
                const on = (values[q.key] || []).includes(q.value);
                const n = count(q.key, q.value);
                const off = !on && n === 0;
                return (
                  <button
                    key={`${q.key}-${q.value}`}
                    type="button"
                    className={`facetbar__chip facetbar__chip--quick${on ? ' is-active' : ''}`}
                    aria-pressed={on}
                    aria-disabled={off || undefined}
                    onClick={() => { if (!off) onToggle(q.key, q.value, false); }}
                  >
                    {on && <Check size={14} strokeWidth={3} aria-hidden="true" />}
                    {q.label}
                  </button>
                );
              })}
            </div>
          )}

          <div className="facetbar__dds">
            {facets.map((f) => (
              <Dropdown key={f.key} facet={f} values={values} count={count} onToggle={onToggle} idBase={idBase} />
            ))}
          </div>

          {extra && <div className="facetbar__extra">{extra}</div>}
        </div>
      </div>

      {(active.length > 0 || canClear) && (
        <div className="facetbar__active">
          {active.length > 0 && (
            <ul className="facetbar__active-list" role="list" aria-label={t('Active filters', 'பயன்பாட்டில் உள்ள வடிகட்டிகள்')}>
              {active.map((a) => (
                <li key={`${a.key}-${a.value}`}>
                  <button type="button" className="facetbar__active-chip" onClick={() => onToggle(a.key, a.value, a.single)}>
                    <span>{a.label}</span>
                    <X size={14} aria-hidden="true" />
                    <span className="visually-hidden">{t('Remove filter', 'வடிகட்டியை நீக்குங்கள்')}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
          <button type="button" className="facetbar__clear" onClick={onClear} disabled={!canClear}>
            {clearLabel}
          </button>
        </div>
      )}

      {/* Portalled to <body>: escapes the sticky bar's stacking context (so it sits above the bottom CTA bar)
          and lives outside [data-shell-page], which useModal makes inert while the sheet is open. */}
      {typeof document !== 'undefined' ? createPortal(sheetNode, document.body) : null}
    </>
  );
}
