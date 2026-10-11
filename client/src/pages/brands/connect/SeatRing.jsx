import { motion } from 'framer-motion';
import { useReducedMotion } from '../../../hooks/useReducedMotion.js';
import { useLang } from '../../../lib/i18n.jsx';
import './SeatRing.css';

/** A Connect Circle: 25 to 40 seats around one table, one seat per sector (Book 2 §3.3). */
export default function SeatRing() {
  const reduced = useReducedMotion();
  const { t } = useLang();
  const seats = 40, min = 25, R = 120, C = 150;
  const v = { hidden: { scale: 0 }, show: (i) => ({ scale: 1, transition: { duration: 0.24, delay: i * 0.014, ease: [0, 0, 0.3, 1] } }) };
  // Draw-in (DESIGN-v2 4: 800ms, once on view): a hairline ring, and the accent arc over the seats every Circle fills.
  const ring = { hidden: { pathLength: 0 }, show: { pathLength: 1, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } } };
  const RO = R + 18; // the outer ring: clear of the seats, so the accent arc reads as its own line
  const pt = (i) => {
    const a = (i / seats) * Math.PI * 2 - Math.PI / 2;
    return [C + Math.cos(a) * RO, C + Math.sin(a) * RO];
  };
  const [x0, y0] = pt(0);
  const [x1, y1] = pt(min - 1);
  const arc = `M${x0} ${y0} A${RO} ${RO} 0 1 1 ${x1.toFixed(2)} ${y1.toFixed(2)}`;
  return (
    <figure className="connect-seats">
      <motion.svg
        className="connect-seats__svg"
        viewBox="0 0 300 300"
        aria-hidden="true"
        focusable="false"
        initial={reduced ? false : 'hidden'}
        whileInView="show"
        viewport={{ once: true, amount: 0.4 }}
      >
        <circle className="connect-seats__table" cx={C} cy={C} r={R - 26} />
        <motion.circle className="connect-seats__track" cx={C} cy={C} r={RO} variants={ring} transform={`rotate(-90 ${C} ${C})`} />
        <motion.path className="connect-seats__arc" d={arc} variants={ring} />
        {Array.from({ length: seats }, (_, i) => {
          const a = (i / seats) * Math.PI * 2 - Math.PI / 2;
          return (
            <motion.circle
              key={i}
              className={i < min ? 'connect-seats__seat' : 'connect-seats__seat connect-seats__seat--open'}
              cx={C + Math.cos(a) * R}
              cy={C + Math.sin(a) * R}
              r="7"
              variants={v}
              custom={i}
            />
          );
        })}
      </motion.svg>
      <div className="connect-seats__centre">
        <span className="connect-seats__range tnum">25–40</span>
        <span className="connect-seats__unit small">{t('founders', 'நிறுவனர்கள்')}</span>
      </div>
      <figcaption className="connect-seats__caption caption">
        <span className="connect-seats__key"><span className="connect-seats__swatch" aria-hidden="true" />{t('Every Circle seats at least 25', 'ஒவ்வொரு Circle-இலும் குறைந்தது 25 இடங்கள்')}</span>
        <span className="connect-seats__key"><span className="connect-seats__swatch connect-seats__swatch--open" aria-hidden="true" />{t('and grows to 40, one seat per sector', '40 வரை வளரும், ஒரு துறைக்கு ஓர் இடம்')}</span>
      </figcaption>
    </figure>
  );
}
