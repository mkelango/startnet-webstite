// Page-local chart kit for the Founder Ledger (Book 3 C16 Mission meter, C19 chart wrapper, §7.7 data-viz style).
// SVG charts measured to their container, drawn in once on view, with a "View as table" twin and CSV export.
import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import { m as motion, useInView } from 'framer-motion'; // light m inside the shell's LazyMotion
import { Table, BarChart3, Download } from 'lucide-react';
import { TagChip } from '../../components';
import { useReducedMotion } from '../../hooks/useReducedMotion.js';
import { useLang } from '../../lib/i18n.jsx';
import { formatNumber } from '../../lib/format.js';
import { niceScale, toCSV, downloadText, PLACEHOLDER, PLACEHOLDER_TA, fmtDate } from './ledgerUtils.js';
import './LedgerCharts.css';

const useIso = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

function useWidth(fallback = 560) {
  const ref = useRef(null);
  const [w, setW] = useState(fallback);
  useIso(() => {
    const el = ref.current;
    if (!el) return undefined;
    const set = () => setW(Math.max(240, Math.round(el.getBoundingClientRect().width)));
    set();
    if (typeof ResizeObserver === 'undefined') return undefined;
    const ro = new ResizeObserver(set);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return [ref, w];
}

const fmt = (v) => (v == null ? '–' : formatNumber(v));

/* ------------------------------------------------------------------ */
/* C19 chart wrapper                                                   */
/* ------------------------------------------------------------------ */
export function ChartFigure({ id, title, subtitle, source, tag, asAt, table, csvName, empty, children, className = '' }) {
  const { t, lang } = useLang();
  const [asTable, setAsTable] = useState(false);
  const tableId = useId();
  const tableShown = !!table && (asTable || !!empty);
  const hasRows = !!table && Array.isArray(table.rows) && table.rows.length > 0;
  const onCsv = () => downloadText(csvName || `${id || 'ledger-chart'}.csv`, toCSV([table.columns, ...table.rows]));
  // No figures for this view yet: the chart is hidden (rather than a placeholder frame); it appears with the data.
  if (empty) return null;
  return (
    <figure className={`ledger-chart ${className}`} id={id} aria-labelledby={`${tableId}-t`}>
      <header className="ledger-chart__head">
        <h3 className="ledger-chart__title h5" id={`${tableId}-t`}>{title}</h3>
        {subtitle && <p className="ledger-chart__subtitle">{subtitle}</p>}
      </header>

      <div className="ledger-chart__body">
        {empty ? (
          <div className="ledger-chart__empty">
            <span className="ledger-chart__empty-grid" aria-hidden="true" />
            <p>
              {t('Figures for this view:', 'இந்தப் பார்வைக்கான எண்கள்:')} <span className="placeholder">{t(PLACEHOLDER, PLACEHOLDER_TA)}</span>
            </p>
          </div>
        ) : (
          <div className={asTable ? 'visually-hidden' : undefined}>{children}</div>
        )}
        {table && (
          <div
            className={tableShown ? 'ledger-chart__table-wrap' : 'visually-hidden'}
            id={tableId}
            // Visible tables can be wider than the card: make the scroll box reachable by keyboard and named.
            {...(tableShown ? { tabIndex: 0, role: 'region', 'aria-label': t(`${title} table`, `${title}: அட்டவணை`) } : {})}
          >
            <table className="ledger-chart__table">
              <caption className="visually-hidden">{title}</caption>
              <thead>
                <tr>{table.columns.map((c) => <th key={c} scope="col">{c}</th>)}</tr>
              </thead>
              <tbody>
                {!hasRows && (
                  <tr className="ledger-chart__table-empty">
                    <td colSpan={table.columns.length}>
                      <span className="placeholder">{t('Figures to be published', 'புள்ளிவிவரங்கள் வெளியிடப்படும்')}</span>
                    </td>
                  </tr>
                )}
                {table.rows.map((r, i) => (
                  <tr key={i}>
                    {r.map((cell, j) =>
                      j === 0 ? <th key={j} scope="row">{cell}</th> : <td key={j}>{cell === '' || cell == null ? '–' : cell}</td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <figcaption className="ledger-chart__foot">
        <span className="ledger-chart__source">
          {t('Source:', 'ஆதாரம்:')} <span lang={lang === 'ta' && !/[஀-௿]/.test(source || '') ? 'en' : undefined}>{source || 'StartNet Founder Ledger'}</span>
          {tag && <> · <TagChip tag={tag} /></>}
          {asAt && <> · {t('As at', 'நிலவரம்')} {fmtDate(asAt, lang)}</>}
        </span>
        {table && (
          <span className="ledger-chart__tools">
            {!empty && (
              <button type="button" className="ledger-chart__tool" aria-pressed={asTable} aria-controls={tableId} onClick={() => setAsTable((v) => !v)}>
                {asTable ? <BarChart3 size={16} aria-hidden="true" /> : <Table size={16} aria-hidden="true" />}
                {asTable ? t('View as chart', 'வரைபடமாகப் பாருங்கள்') : t('View as table', 'அட்டவணையாகப் பாருங்கள்')}
              </button>
            )}
            {/* No rows yet (e.g. districts before the first edition): nothing to download, so no CSV button. */}
            {hasRows && (
              <button
                type="button"
                className="ledger-chart__tool"
                onClick={onCsv}
                aria-label={t(`Download CSV: ${title}`, `CSV பதிவிறக்கம்: ${title}`)}
              >
                <Download size={16} aria-hidden="true" /> CSV
              </button>
            )}
          </span>
        )}
      </figcaption>
    </figure>
  );
}

/* ------------------------------------------------------------------ */
/* Tooltip (shared)                                                    */
/* ------------------------------------------------------------------ */
function Tip({ tip }) {
  if (!tip) return null;
  return (
    <div className="ledger-chart__tip" style={{ left: tip.x, top: tip.y }} role="presentation">
      <strong className="tnum">{tip.value}</strong>
      <span>{tip.label}</span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Column chart (ladder L1–L7): one series, context + focus tones      */
/* ------------------------------------------------------------------ */
export function ColumnChart({ data, height = 280, label }) {
  const { t, lang } = useLang();
  const [ref, width] = useWidth();
  const reduced = useReducedMotion();
  const inView = useInView(ref, { once: true, margin: '0px 0px -15% 0px' });
  const [tip, setTip] = useState(null);
  const m = { top: 28, right: 8, bottom: 48, left: 52 };
  const iw = width - m.left - m.right;
  const ih = height - m.top - m.bottom;
  const { max, ticks } = niceScale(Math.max(0, ...data.map((d) => d.value || 0)));
  const slot = iw / data.length;
  const bw = Math.min(28, slot * 0.6);
  const y = (v) => ih - (v / max) * ih;
  const show = reduced || inView;

  return (
    <div className="ledger-chart__canvas" ref={ref} onMouseLeave={() => setTip(null)}>
      <svg width={width} height={height} role="group" aria-label={label}>
        <g transform={`translate(${m.left},${m.top})`}>
          {ticks.map((tk) => (
            <g key={tk} transform={`translate(0,${y(tk)})`}>
              <line x2={iw} className={tk === 0 ? 'ledger-chart__baseline' : 'ledger-chart__grid'} />
              <text x={-10} dy="0.32em" textAnchor="end" className="ledger-chart__tick">{fmt(tk)}</text>
            </g>
          ))}
          {data.map((d, i) => {
            const cx = slot * i + slot / 2;
            const h = d.value == null ? 0 : ih - y(d.value);
            const desc = `${d.label}${d.sublabel ? ` ${d.sublabel}` : ''}: ${fmt(d.value)}${d.tag ? t(`, confidence ${d.tag}`, `, நம்பகத்தன்மை ${d.tag}`) : ''}`;
            return (
              <g key={d.key}>
                {d.value != null && (
                  <motion.path
                    d={roundTopRect(cx - bw / 2, y(d.value), bw, h, Math.min(4, h))}
                    className={`ledger-chart__mark ledger-chart__mark--${d.tone || 'focus'}`}
                    style={{ transformBox: 'fill-box', transformOrigin: '50% 100%' }}
                    initial={reduced ? false : { scaleY: 0 }}
                    animate={show ? { scaleY: 1 } : { scaleY: 0 }}
                    transition={{ duration: 0.8, delay: i * 0.04, ease: [0, 0, 0.3, 1] }}
                  />
                )}
                {d.value == null && <line x1={cx - bw / 2} x2={cx + bw / 2} y1={ih} y2={ih} className="ledger-chart__nodata" />}
                <motion.text
                  x={cx}
                  y={d.value == null ? ih - 8 : y(d.value) - 8}
                  textAnchor="middle"
                  className="ledger-chart__value"
                  initial={reduced ? false : { opacity: 0 }}
                  animate={show ? { opacity: 1 } : { opacity: 0 }}
                  transition={{ duration: 0.24, delay: 0.6 + i * 0.04 }}
                >
                  {fmt(d.value)}
                </motion.text>
                <text x={cx} y={ih + 20} textAnchor="middle" className="ledger-chart__cat">{d.label}</text>
                {d.sublabel && String(d.sublabel).length * (lang === 'ta' ? 7.5 : 6.5) < slot - 4 && (
                  <text x={cx} y={ih + 36} textAnchor="middle" className="ledger-chart__cat ledger-chart__cat--sub">{d.sublabel}</text>
                )}
                <rect
                  x={cx - slot / 2}
                  y={0}
                  width={slot}
                  height={ih}
                  className="ledger-chart__hit"
                  tabIndex={0}
                  aria-label={desc}
                  onMouseMove={() => setTip({ x: m.left + cx, y: m.top + (d.value == null ? ih : y(d.value)), value: fmt(d.value), label: `${d.label} ${d.sublabel || ''}` })}
                  onFocus={() => setTip({ x: m.left + cx, y: m.top + (d.value == null ? ih : y(d.value)), value: fmt(d.value), label: `${d.label} ${d.sublabel || ''}` })}
                  onBlur={() => setTip(null)}
                />
              </g>
            );
          })}
        </g>
      </svg>
      <Tip tip={tip} />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Horizontal bar chart (brands, districts): category label above bar  */
/* ------------------------------------------------------------------ */
export function BarChart({ data, label, unit = '' }) {
  const { t } = useLang();
  const [ref, width] = useWidth();
  const reduced = useReducedMotion();
  const inView = useInView(ref, { once: true, margin: '0px 0px -15% 0px' });
  const [tip, setTip] = useState(null);
  const row = 52;
  const bar = 18;
  const valueRoom = 72;
  const iw = width - valueRoom;
  const { max } = niceScale(Math.max(0, ...data.map((d) => d.value || 0)));
  const height = data.length * row + 4;
  const show = reduced || inView;

  return (
    <div className="ledger-chart__canvas" ref={ref} onMouseLeave={() => setTip(null)}>
      <svg width={width} height={height} role="group" aria-label={label}>
        <line x1={0.5} x2={0.5} y1={0} y2={height} className="ledger-chart__baseline" />
        {data.map((d, i) => {
          const top = i * row;
          const w = d.value == null ? 0 : Math.max(2, (d.value / max) * iw);
          const desc = `${d.label}: ${fmt(d.value)}${unit}${d.tag ? t(`, confidence ${d.tag}`, `, நம்பகத்தன்மை ${d.tag}`) : ''}`;
          const tipAt = { x: Math.min(w + 8, iw), y: top + 22, value: `${fmt(d.value)}${unit}`, label: d.label };
          return (
            <g key={d.key}>
              <text x={8} y={top + 15} className="ledger-chart__cat ledger-chart__cat--left">{d.label}</text>
              {d.value != null ? (
                <motion.path
                  d={roundRightRect(1, top + 22, w, bar, Math.min(4, w / 2))}
                  className={`ledger-chart__mark ledger-chart__mark--${d.tone || 'focus'}`}
                  style={{ transformBox: 'fill-box', transformOrigin: '0% 50%' }}
                  initial={reduced ? false : { scaleX: 0 }}
                  animate={show ? { scaleX: 1 } : { scaleX: 0 }}
                  transition={{ duration: 0.8, delay: Math.min(i, 6) * 0.04, ease: [0, 0, 0.3, 1] }}
                />
              ) : (
                <line x1={1} x2={24} y1={top + 31} y2={top + 31} className="ledger-chart__nodata" />
              )}
              <motion.text
                x={(d.value == null ? 24 : w) + 8}
                y={top + 22 + bar / 2}
                dy="0.34em"
                className="ledger-chart__value"
                initial={reduced ? false : { opacity: 0 }}
                animate={show ? { opacity: 1 } : { opacity: 0 }}
                transition={{ duration: 0.24, delay: 0.6 }}
              >
                {fmt(d.value)}{d.value != null ? unit : ''}
              </motion.text>
              <rect
                x={0}
                y={top}
                width={width}
                height={row}
                className="ledger-chart__hit"
                tabIndex={0}
                aria-label={desc}
                onMouseMove={() => setTip(tipAt)}
                onFocus={() => setTip(tipAt)}
                onBlur={() => setTip(null)}
              />
            </g>
          );
        })}
      </svg>
      <Tip tip={tip} />
    </div>
  );
}

/** Legend (always shown when a chart uses two tones). */
export function ChartLegend({ items }) {
  return (
    <ul className="ledger-chart__legend">
      {items.map((it) => (
        <li key={it.tone}>
          <span className={`ledger-chart__swatch ledger-chart__mark--${it.tone}`} aria-hidden="true" />
          {it.label}
        </li>
      ))}
    </ul>
  );
}

/* ------------------------------------------------------------------ */
/* C16 Mission meter: ring toward 1,00,000 with the red full stop     */
/* ------------------------------------------------------------------ */
export function MissionDial({ value, target = 100000, label }) {
  const { t } = useLang();
  const reduced = useReducedMotion();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '0px 0px -15% 0px' });
  const r = 92;
  const c = 2 * Math.PI * r;
  const frac = value == null ? 0 : Math.max(0, Math.min(1, value / target));
  const angle = frac * 2 * Math.PI - Math.PI / 2;
  const dot = { x: 120 + r * Math.cos(angle), y: 120 + r * Math.sin(angle) };
  const show = reduced || inView;
  return (
    <div className="ledger-dial" ref={ref}>
      <svg viewBox="0 0 240 240" role="img" aria-label={label}>
        <circle cx="120" cy="120" r={r} className="ledger-dial__track" />
        {[0.25, 0.5, 0.75].map((f) => {
          const a = f * 2 * Math.PI - Math.PI / 2;
          return (
            <line key={f} x1={120 + (r - 12) * Math.cos(a)} y1={120 + (r - 12) * Math.sin(a)} x2={120 + (r + 12) * Math.cos(a)} y2={120 + (r + 12) * Math.sin(a)} className="ledger-dial__tick" />
          );
        })}
        {value != null && (
          <>
            <motion.circle
              cx="120"
              cy="120"
              r={r}
              className="ledger-dial__fill"
              transform="rotate(-90 120 120)"
              strokeDasharray={c}
              initial={reduced ? false : { strokeDashoffset: c }}
              animate={{ strokeDashoffset: show ? c * (1 - frac) : c }}
              transition={{ duration: 0.8, ease: [0, 0, 0.3, 1] }}
            />
            <motion.circle
              cx={dot.x}
              cy={dot.y}
              r="9"
              className="ledger-dial__dot"
              initial={reduced ? false : { scale: 0 }}
              animate={{ scale: show ? 1 : 0 }}
              transition={{ duration: 0.32, delay: 0.8, ease: [0.34, 1.56, 0.64, 1] }}
              style={{ transformBox: 'fill-box', transformOrigin: '50% 50%' }}
            />
          </>
        )}
        <text x="120" y="112" textAnchor="middle" className="ledger-dial__of">{t('of', 'இலக்கு')}</text>
        <text x="120" y="140" textAnchor="middle" className="ledger-dial__target">{formatNumber(target)}</text>
      </svg>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Share meter: women share against a 40% floor                         */
/* ------------------------------------------------------------------ */
export function ShareMeter({ value, floor = 40, label }) {
  const { t } = useLang();
  const reduced = useReducedMotion();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const show = reduced || inView;
  return (
    <div className="ledger-share" ref={ref} role="img" aria-label={label}>
      <div className="ledger-share__track">
        {value != null && (
          <motion.span
            className="ledger-share__fill"
            style={{ width: `${Math.min(100, value)}%`, transformOrigin: '0% 50%' }}
            initial={reduced ? false : { scaleX: 0 }}
            animate={{ scaleX: show ? 1 : 0 }}
            transition={{ duration: 0.8, ease: [0, 0, 0.3, 1] }}
          />
        )}
        <span className="ledger-share__floor" style={{ left: `${floor}%` }}>
          <span className="ledger-share__floor-label">{t(`${floor}% floor`, `${floor}% குறைந்தபட்சம்`)}</span>
        </span>
      </div>
      <div className="ledger-share__scale" aria-hidden="true">
        <span>0%</span>
        <span>100%</span>
      </div>
    </div>
  );
}

/* Paths: bars square at the baseline, 4px rounded data-end. */
function roundTopRect(x, y, w, h, r) {
  if (h <= 0) return '';
  return `M${x},${y + h}V${y + r}Q${x},${y} ${x + r},${y}H${x + w - r}Q${x + w},${y} ${x + w},${y + r}V${y + h}Z`;
}
function roundRightRect(x, y, w, h, r) {
  if (w <= 0) return '';
  return `M${x},${y}H${x + w - r}Q${x + w},${y} ${x + w},${y + r}V${y + h - r}Q${x + w},${y + h} ${x + w - r},${y + h}H${x}Z`;
}
