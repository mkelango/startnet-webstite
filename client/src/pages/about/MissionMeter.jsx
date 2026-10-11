// C16 / IX-14 Mission 1 Lakh meter — ring form (mission page). Fills to the verified count toward 1,00,000 by Mar 2031;
// the red full stop lands at the value; yearly plan ticks are buttons that show plan vs actual and the tag.
// Reduced motion: filled to value, static dot. Only A/B-tagged counts are drawn (C is never summed into A or B).
import { useState } from 'react';
import { m as motion } from 'framer-motion'; // light m inside the shell's LazyMotion
import { Stat, TagChip } from '../../components';
import { isPlaceholderText } from '../../components/_placeholders.js';
import { useReducedMotion } from '../../hooks/useReducedMotion.js';
import { formatNumber } from '../../lib/format.js';
import { useLang } from '../../lib/i18n.jsx';
import './MissionMeter.css';

const TARGET = 100000;
const R = 88;
const C = 2 * Math.PI * R;

export default function MissionMeter({ current, ticks }) {
  const reduced = useReducedMotion();
  const { lang, t } = useLang();
  const [sel, setSel] = useState(ticks[0]?.id);
  const verified = current && typeof current.value === 'number' && (current.tag === 'A' || current.tag === 'B') ? current : null;
  const frac = verified ? Math.min(1, Math.max(0, verified.value / TARGET)) : 0;
  const angle = frac * 360;
  const selected = ticks.find((tk) => tk.id === sel) || ticks[0];

  const text = verified
    ? t(
      `${formatNumber(verified.value, lang)} of 1,00,000 nurtured, as at ${verified.asAt}, tag ${verified.tag}; target March 2031, planning assumption.`,
      `1,00,000-இல் ${formatNumber(verified.value, lang)} பேர் வளர்க்கப்பட்டுள்ளனர், ${verified.asAt} நிலவரப்படி, குறி ${verified.tag}; இலக்கு மார்ச் 2031, திட்டமிடல் அனுமானம்.`
    )
    : t(
      'Current count to be supplied by StartNet. Target: 1,00,000 nurtured by March 2031, planning assumption.',
      'தற்போதைய எண்ணிக்கையை StartNet வழங்கும். இலக்கு: மார்ச் 2031-க்குள் 1,00,000 பேர் வளர்க்கப்படுதல், திட்டமிடல் அனுமானம்.'
    );

  const meterProps = verified
    ? { role: 'meter', 'aria-valuemin': 0, 'aria-valuemax': TARGET, 'aria-valuenow': verified.value, 'aria-valuetext': text, 'aria-label': t('Mission 1 Lakh progress', 'Mission 1 Lakh முன்னேற்றம்') }
    : { role: 'img', 'aria-label': text };

  const ease = [0.4, 0.14, 0.3, 1];

  return (
    <div className="mission-meter">
      <div className="mission-meter__dial" {...meterProps}>
        <svg viewBox="0 0 200 200" className="mission-meter__svg" aria-hidden="true" focusable="false">
          <circle className="mission-meter__track" cx="100" cy="100" r={R} />
          {/* year plan ticks */}
          {ticks.filter((tk) => typeof tk.value === 'number' && tk.value <= TARGET).map((tk) => {
            const a = (Math.min(1, tk.value / TARGET) * 360 - 90) * (Math.PI / 180);
            const x1 = 100 + (R - 10) * Math.cos(a); const y1 = 100 + (R - 10) * Math.sin(a);
            const x2 = 100 + (R + 10) * Math.cos(a); const y2 = 100 + (R + 10) * Math.sin(a);
            return <line key={tk.id} x1={x1} y1={y1} x2={x2} y2={y2} className={`mission-meter__tick${tk.id === sel ? ' is-selected' : ''}`} />;
          })}
          {reduced ? (
            <circle className="mission-meter__fill" cx="100" cy="100" r={R} strokeDasharray={`${C * frac} ${C}`} transform="rotate(-90 100 100)" />
          ) : (
            <motion.circle
              className="mission-meter__fill" cx="100" cy="100" r={R} transform="rotate(-90 100 100)"
              initial={{ strokeDasharray: `0 ${C}` }}
              whileInView={{ strokeDasharray: `${C * frac} ${C}` }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 0.8, ease }}
            />
          )}
          {reduced ? (
            <g transform={`rotate(${angle} 100 100)`}><circle className="mission-meter__dot" cx="100" cy={100 - R} r="7" /></g>
          ) : (
            <motion.g
              style={{ transformBox: 'view-box', transformOrigin: '50% 50%' }}
              initial={{ rotate: 0, opacity: 0 }}
              whileInView={{ rotate: angle, opacity: 1 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ rotate: { duration: 0.8, ease }, opacity: { duration: 0.48, delay: 0.8, ease: [0.34, 1.56, 0.64, 1] } }}
            >
              <circle className="mission-meter__dot" cx="100" cy={100 - R} r="7" />
            </motion.g>
          )}
        </svg>
        <div className="mission-meter__center">
          {verified ? (
            <Stat variant="hero" metric={verified} />
          ) : (
            // No verified (A/B) count yet: show the target only; the count and its as-at date appear once supplied.
            <p className="mission-meter__of tnum">{t('Target: 1,00,000 nurtured (L2+) by March 2031', 'இலக்கு: மார்ச் 2031-க்குள் 1,00,000 பேர் வளர்ப்பு (L2+)')}</p>
          )}
        </div>
      </div>

      <div className="mission-meter__side">
        <p className="mission-meter__legend">
          <TagChip tag="C" /> {t('Target · planning assumption', 'இலக்கு · திட்டமிடல் அனுமானம்')}
        </p>
        <div className="mission-meter__ticks" role="group" aria-label={t('Plan ticks', 'திட்டக் குறிப்புப் புள்ளிகள்')}>
          {ticks.map((tk) => (
            <button
              key={tk.id}
              type="button"
              className="mission-meter__tickbtn"
              aria-pressed={tk.id === sel}
              onClick={() => setSel(tk.id)}
            >
              <span className="mission-meter__tickyear tnum">{tk.when}</span>
              <span className="mission-meter__ticklabel">{tk.short}</span>
            </button>
          ))}
        </div>
        {selected && (
          <div className="mission-meter__detail" aria-live="polite">
            <div className="mission-meter__plan">
              <p className="mission-meter__k">{t('Plan', 'திட்டம்')}</p>
              {typeof selected.value === 'number' ? (
                <Stat variant="compact" value={selected.value} label={selected.label} tag="C" asAt={selected.asAt} source={selected.source} countUp={false} />
              ) : (
                <p className="mission-meter__v">{selected.label}</p>
              )}
            </div>
            <div className="mission-meter__actual">
              <p className="mission-meter__k">{t('Actual', 'உண்மை நிலை')}</p>
              {selected.actual ? (
                <Stat variant="compact" metric={selected.actual} />
              ) : (
                <p className="mission-meter__v">
                  {(!isPlaceholderText(selected.pending) && selected.pending) || t('Not yet reached', 'இன்னும் எட்டப்படவில்லை')}
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
