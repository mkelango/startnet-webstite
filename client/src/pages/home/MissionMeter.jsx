import { m as motion } from 'framer-motion'; // F-19/F-31: light m inside the shell's LazyMotion
import { Stat } from '../../components';
import { useReducedMotion } from '../../hooks/useReducedMotion.js';
import { useLang } from '../../lib/i18n.jsx';
import { localizeMetric } from './homeI18n.js';
import { formatNumber, formatDate } from '../../lib/format.js';
import './MissionMeter.css';

const TARGET = 100000;

/**
 * Mission 1 Lakh bar (Book 4 IX-14, home form; DESIGN-v2 6.1): a 2px hairline track, an Ink fill that draws in,
 * and the current value as the page's red point (a 12px dot at the fill end, brand 04.4 "Meter"). Unknown count → empty bar, dot at the start, no readout.
 * Props: metric (the nurtured count Metric, value may be null)
 */
export default function MissionMeter({ metric }) {
  const reduced = useReducedMotion();
  const { lang, t } = useLang();
  const value = typeof metric?.value === 'number' ? metric.value : null;
  const pct = value == null ? 0 : Math.min(100, Math.max(0, (value / TARGET) * 100));
  // keep a sliver visible for small real counts so the bar reads as "started"
  const shown = value == null ? 0 : Math.max(pct, 0.6);
  const asAt = metric?.asAt ? formatDate(metric.asAt, lang) : null;
  const text = value == null
    ? t('Verified count to be published. Target: 1,00,000 nurtured by March 2031, a planning assumption.',
      'சரிபார்க்கப்பட்ட எண்ணிக்கை வெளியிடப்பட உள்ளது. இலக்கு: மார்ச் 2031-க்குள் 1,00,000 பேரை வளர்த்தெடுப்பது; இது ஒரு திட்டமிடல் அனுமானம்.')
    : t(
      `${formatNumber(value)} of 1,00,000 nurtured${asAt ? `, as at ${asAt}` : ''}, tag ${metric.tag}; target March 2031, planning assumption.`,
      `1,00,000-இல் ${formatNumber(value, lang)} பேர் வளர்த்தெடுக்கப்பட்டுள்ளனர்${asAt ? `, ${asAt} நிலவரப்படி` : ''}, குறிச்சொல் ${metric.tag}; இலக்கு மார்ச் 2031, திட்டமிடல் அனுமானம்.`
    );

  const meterProps = value == null
    ? { role: 'img', 'aria-label': text }
    : { role: 'meter', 'aria-valuemin': 0, 'aria-valuemax': TARGET, 'aria-valuenow': value, 'aria-valuetext': text, 'aria-label': t('Mission 1 Lakh progress', 'Mission 1 Lakh முன்னேற்றம்') };

  // Draw-in (DESIGN-v2 4 "Line / ring draw-in"): the Ink fill scales in over 800ms on view, then the current value
  // lands as the red point. Transform-only; the final state is the SSR / reduced-motion state.
  const view = { once: true, amount: 0.6 };
  const EASE_REVEAL = [0.22, 1, 0.36, 1];
  return (
    <div className="home-meter">
      <div className="home-meter__track" {...meterProps}>
        <motion.span
          className="home-meter__fill"
          style={{ width: `${shown}%` }}
          initial={reduced ? false : { scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={view}
          transition={{ duration: 0.8, ease: EASE_REVEAL }}
        />
        <motion.span
          className="home-meter__dot"
          style={{ left: `${shown}%` }}
          aria-hidden="true"
          initial={reduced ? false : { scale: 0, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={view}
          transition={{ duration: 0.48, delay: reduced ? 0 : 0.8, ease: [0.34, 1.56, 0.64, 1] }}
        />
      </div>
      <div className="home-meter__scale tnum" aria-hidden="true">
        <span>0</span>
        <span>{t('1,00,000 · Mar 2031', '1,00,000 · மார்ச் 2031')}</span>
      </div>
      {/* No verified count yet: no readout (the bar's label already says the count is to be published). */}
      {value != null && (
        <div className="home-meter__readout">
          <Stat metric={localizeMetric(metric, lang)} variant="compact" />
        </div>
      )}
    </div>
  );
}
