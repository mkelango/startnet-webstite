// C01 · Utility bar (Book 1 Part B §3.3): Media · Careers (count) · Contact · EN | தமிழ் · Sign in · Join StartNet.
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useLang } from '../lib/i18n.jsx';
import { useApi } from '../hooks/useApi.js';
import { UTILITY_LINKS, SIGN_IN, JOIN } from '../data/nav.js';
import LanguageSwitch from './LanguageSwitch.jsx';
import { signInHref } from './shell.jsx';
import './UtilityBar.css';

export function useOpenRoles() {
  const { data } = useApi('/api/careers');
  return Array.isArray(data) ? data.length : 0;
}

export default function UtilityBar() {
  const { t, lang, localePath, basePath } = useLang();
  const roles = useOpenRoles();
  return (
    <div className="utilitybar" data-surface="night">
      <div className="container utilitybar__inner">
        <nav aria-label={t('Utility', 'பயன்பாட்டு இணைப்புகள்')} className="utilitybar__nav">
          <ul className="utilitybar__list">
            {UTILITY_LINKS.map((l) => (
              <li key={l.id}>
                <Link
                  to={localePath(l.to)}
                  className="utilitybar__link"
                  aria-current={basePath === l.to ? 'page' : undefined}
                  aria-label={l.id === 'careers' && roles > 0 ? t(`${l.label}, ${roles} open roles`, `${l.labelTa}, ${roles} திறந்த பணியிடங்கள்`) : undefined}
                >
                  {t(l.label, l.labelTa)}
                  {l.id === 'careers' && roles > 0 && <span className="utilitybar__count" aria-hidden="true">{roles}</span>}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="utilitybar__actions">
          <LanguageSwitch night />
          <a href={signInHref(lang, 'utility')} className="utilitybar__link utilitybar__signin" title={t(SIGN_IN.tooltip, SIGN_IN.tooltipTa)}>
            {t(SIGN_IN.label, SIGN_IN.labelTa)}
            <span className="visually-hidden">{t(' (opens StartNet X)', ' (StartNet X-இல் திறக்கும்)')}</span>
          </a>
          <Link to={localePath(JOIN.to)} className="utilitybar__join">
            {t(JOIN.label, JOIN.labelTa)}
            <ArrowRight size={14} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </div>
  );
}
