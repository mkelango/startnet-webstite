import { useState } from 'react';
import { useLang } from '../../../../lib/i18n.jsx';
import { PARTIES, tr } from '../researchContent';
import './FourParty.css';

/** The four-party model: founders, institution, GCC/industry partner and StartNet around one company. */
export default function FourParty() {
  const { t } = useLang();
  const [active, setActive] = useState(null);
  return (
    <div className={`fourparty${active ? ` is-${active}` : ''}`}>
      <svg className="fourparty__lines" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        {PARTIES.map((p, i) => {
          const x = i % 2 === 0 ? 18 : 82;
          const y = i < 2 ? 22 : 78;
          return <line key={p.id} x1="50" y1="50" x2={x} y2={y} className={`fourparty__line${active === p.id ? ' is-active' : ''}`} vectorEffect="non-scaling-stroke" />;
        })}
      </svg>
      <div className="fourparty__core" aria-hidden="true">
        <span className="fourparty__core-label">{t('The company', 'நிறுவனம்')}</span>
        <span className="fourparty__core-sub">{t('four parties, clear roles', 'நான்கு தரப்பினர், தெளிவான பங்குகள்')}</span>
      </div>
      <ul className="fourparty__list" aria-label={t('The four parties', 'நான்கு தரப்பினர்')}>
        {PARTIES.map((p, i) => (
          <li
            key={p.id}
            className={`fourparty__party fourparty__party--${i + 1}`}
            onMouseEnter={() => setActive(p.id)}
            onMouseLeave={() => setActive(null)}
          >
            <span className="fourparty__num tnum" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
            <h3 className="fourparty__name h5">{tr(t, p, 'name')}</h3>
            <p className="fourparty__body">{tr(t, p, 'body')}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
