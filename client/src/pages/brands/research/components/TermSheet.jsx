import { useId, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, PieChart, Table2 } from 'lucide-react';
import { Badge, Stat, TagChip } from '../../../../components';
import { useReducedMotion } from '../../../../hooks/useReducedMotion';
import { useLang } from '../../../../lib/i18n.jsx';
import { TERMS, tr } from '../researchContent';
import { useSlidingIndicator } from '../../../../components/_indicator.js';
import './TermSheet.css';

const VIEWS = [
  { id: 'bar', label: 'Bar', labelTa: 'பட்டை', icon: BarChart3 },
  { id: 'donut', label: 'Donut', labelTa: 'வட்டம்', icon: PieChart },
  { id: 'table', label: 'Table', labelTa: 'அட்டவணை', icon: Table2 },
];

const R = 80;
const CIRC = 2 * Math.PI * R;

/** Standard term sheet visual: stacked bar / donut / accessible table, with a linked detail panel. Tag C, draft. */
export default function TermSheet({ compact = false }) {
  const { t } = useLang();
  const reduced = useReducedMotion();
  const uid = useId();
  const [view, setView] = useState('bar');
  const [active, setActive] = useState('founders');
  const viewsRef = useRef(null);
  useSlidingIndicator(viewsRef, '[aria-pressed="true"]', [view, t]);
  const split = TERMS.split.map((s) => ({ ...s, label: tr(t, s, 'label'), role: tr(t, s, 'role') }));
  const current = split.find((s) => s.id === active) || split[0];
  const parts = split.map((s) => `${s.label} ${s.share}%`).join(', ');
  const summary = t(
    `Illustrative split at formation, draft subject to legal review: ${parts}.`,
    `தொடக்கத்தில் விளக்கப் பங்கீடு, சட்ட ஆய்வுக்கு உட்பட்ட வரைவு: ${parts}.`
  );

  let acc = 0;
  const arcs = split.map((s) => {
    const len = (s.share / 100) * CIRC;
    const arc = { ...s, len, offset: acc };
    acc += len;
    return arc;
  });

  const segProps = (s) => ({
    onMouseEnter: () => setActive(s.id),
    onFocus: () => setActive(s.id),
  });

  return (
    <figure className={`termsheet${compact ? ' termsheet--compact' : ''}`} aria-labelledby={`${uid}-cap`}>
      <div className="termsheet__top">
        <div className="cluster termsheet__badges">
          <Badge kind="status" status="upcoming">{tr(t, TERMS, 'status')}</Badge>
          <TagChip tag="C" />
        </div>
        <div ref={viewsRef} className="segmented termsheet__views" role="group" aria-label={t('Chart view', 'வரைபடக் காட்சி')}>
          <span className="ind ind--pill" aria-hidden="true" />
          {VIEWS.map((v) => {
            const Icon = v.icon;
            return (
              <button
                key={v.id}
                type="button"
                className="segmented__item termsheet__view"
                aria-pressed={view === v.id}
                onClick={() => setView(v.id)}
              >
                <Icon size={16} aria-hidden="true" />
                <span>{tr(t, v, 'label')}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="termsheet__body">
        <div className="termsheet__chart">
          {view === 'bar' && (
            <div className="termsheet__bar-wrap">
              <div className="termsheet__bar" role="img" aria-label={summary}>
                {split.map((s, i) => (
                  <motion.span
                    key={s.id}
                    className={`termsheet__seg${active === s.id ? ' is-active' : ''}`}
                    style={{ flex: `${s.share} 1 0%`, '--seg': s.color }}
                    initial={reduced ? false : { scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true, amount: 0.6 }}
                    transition={{ duration: 0.8, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                    onMouseEnter={() => setActive(s.id)}
                  />
                ))}
              </div>
              <ol className="termsheet__scale" aria-hidden="true">
                {split.map((s) => (
                  <li key={s.id} style={{ flex: `${s.share} 1 0%` }} className={active === s.id ? 'is-active' : ''}>
                    <span className="termsheet__scale-val tnum">{s.share}%</span>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {view === 'donut' && (
            <div className="termsheet__donut-wrap">
              <motion.svg
                className="termsheet__donut"
                viewBox="0 0 200 200"
                role="img"
                aria-label={summary}
                initial={reduced ? false : { opacity: 0, rotate: -40 }}
                animate={{ opacity: 1, rotate: 0 }}
                transition={{ duration: 0.8, ease: [0.4, 0.14, 0.3, 1] }}
              >
                <g transform="rotate(-90 100 100)">
                  {arcs.map((a) => (
                    <circle
                      key={a.id}
                      cx="100"
                      cy="100"
                      r={R}
                      fill="none"
                      stroke={a.color}
                      strokeWidth="30"
                      strokeDasharray={`${Math.max(a.len - 2, 0)} ${CIRC}`}
                      strokeDashoffset={-a.offset}
                      className={`termsheet__arc${active === a.id ? ' is-active' : ''}`}
                      onMouseEnter={() => setActive(a.id)}
                    />
                  ))}
                </g>
                <text x="100" y="98" textAnchor="middle" className="termsheet__donut-val">{current.share}%</text>
                <text x="100" y="120" textAnchor="middle" className="termsheet__donut-lbl">{current.label}</text>
              </motion.svg>
            </div>
          )}

          {view === 'table' && (
            <div className="termsheet__table-scroll" tabIndex={0} role="region" aria-label={t('Term sheet table', 'விதிமுறை அட்டவணை')}>
              <table className="termsheet__table">
                <caption className="visually-hidden">{summary}</caption>
                <thead>
                  <tr>
                    <th scope="col">{t('Party', 'தரப்பு')}</th>
                    <th scope="col" className="tnum">
                      {t(<><span className="termsheet__wide-only">Illustrative </span>share</>, <><span className="termsheet__wide-only">விளக்கப் </span>பங்கு</>)}
                    </th>
                    <th scope="col" className="termsheet__col-range">{t('Range', 'வரம்பு')}</th>
                    <th scope="col">{t('Tag', 'குறி')}</th>
                  </tr>
                </thead>
                <tbody>
                  {split.map((s) => (
                    <tr key={s.id}>
                      <th scope="row">
                        <span className="termsheet__party">
                          <span className="termsheet__swatch" style={{ '--seg': s.color }} aria-hidden="true" />
                          {s.label}
                        </span>
                      </th>
                      <td className="tnum">{s.share}%</td>
                      <td className="tnum termsheet__col-range">{s.range || '—'}</td>
                      <td>
                        <TagChip tag="C" className="termsheet__tag--full" />
                        <TagChip tag="C" short className="termsheet__tag--short" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {view !== 'table' && (
            <ul className="termsheet__legend" aria-label={t('Parties', 'தரப்பினர்')}>
              {split.map((s) => (
                <li key={s.id}>
                  <button
                    type="button"
                    className="termsheet__key"
                    aria-pressed={active === s.id}
                    {...segProps(s)}
                    onClick={() => setActive(s.id)}
                  >
                    <span className="termsheet__swatch" style={{ '--seg': s.color }} aria-hidden="true" />
                    <span className="termsheet__key-label">{s.label}</span>
                    <span className="termsheet__key-val tnum">{s.share}%</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="termsheet__detail" aria-live="polite">
          <span className="termsheet__detail-rule" style={{ '--seg': current.color }} aria-hidden="true" />
          <Stat
            value={current.share}
            unit="%"
            label={current.label}
            tag="C"
            asAt={t('Draft, before legal review', 'வரைவு, சட்ட ஆய்வுக்கு முன்')}
            source={t('StartNet Research standard terms (draft)', 'StartNet Research நிலையான விதிமுறைகள் (வரைவு)')}
            note={current.range ? `${t('Range', 'வரம்பு')}: ${current.range}` : undefined}
            variant="compact"
            countUp={false}
          />
          <p className="termsheet__role">{current.role}</p>
          {current.range && <p className="termsheet__range small muted">{t('Range at formation:', 'தொடக்கத்தில் வரம்பு:')} <strong className="tnum">{current.range}</strong></p>}
        </div>
      </div>

      <figcaption id={`${uid}-cap`} className="termsheet__cap small muted">
        {tr(t, TERMS, 'note')} {tr(t, TERMS, 'ranges')} <TagChip tag="C" />
      </figcaption>
    </figure>
  );
}
