import { useState } from 'react';
import { GraduationCap, Landmark, Factory } from 'lucide-react';
import { useLang } from '../../../../lib/i18n.jsx';
import { PARTIES, tr } from '../researchContent';
import './FourParty.css';

const ICONS = { founders: GraduationCap, institution: Landmark, industry: Factory };

/**
 * The four-party model: one panel split into four quadrants by a hairline cross, with the company on the crossing.
 * Each quadrant: icon and number, the party, its role (Book 2 §3.1 verbatim) and, at the foot, what it holds.
 * Hovering a quadrant lights it and names that party in the centre. Below 1024px the company sits above the panel.
 */
export default function FourParty() {
  const { t } = useLang();
  const [active, setActive] = useState(null);
  const current = PARTIES.find((p) => p.id === active);
  return (
    <div className={`fourparty${active ? ` is-${active}` : ''}`}>
      <div className="fourparty__core" aria-hidden="true">
        <span className="fourparty__core-dot" />
        <span className="fourparty__core-label">{t('The company', 'நிறுவனம்')}</span>
        <span className="fourparty__core-sub">
          {current ? tr(t, current, 'short') : t('four parties, clear roles', 'நான்கு தரப்பினர், தெளிவான பங்குகள்')}
        </span>
      </div>
      <ul className="fourparty__grid" aria-label={t('The four parties', 'நான்கு தரப்பினர்')}>
        {PARTIES.map((p, i) => {
          const Icon = ICONS[p.id];
          return (
            <li
              key={p.id}
              className={`fourparty__party fourparty__party--${i + 1}${active === p.id ? ' is-active' : ''}`}
              onMouseEnter={() => setActive(p.id)}
              onMouseLeave={() => setActive(null)}
            >
              <div className="fourparty__head" aria-hidden="true">
                <span className="fourparty__icon">
                  {Icon ? <Icon size={20} strokeWidth={1.6} /> : <span className="fourparty__icon-dot" />}
                </span>
                <span className="fourparty__num tnum">{String(i + 1).padStart(2, '0')}</span>
              </div>
              <h3 className="fourparty__name">{tr(t, p, 'name')}</h3>
              <p className="fourparty__body">{tr(t, p, 'body')}</p>
              {p.holds && (
                <p className="fourparty__holds">
                  <span className="fourparty__holds-label">{t('Holds', 'வைத்திருப்பது')}</span>
                  <span className="fourparty__holds-value">{tr(t, p, 'holds')}</span>
                </p>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
