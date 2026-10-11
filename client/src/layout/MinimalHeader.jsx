// C02 `minimal` header variant (Book 3 C02, Book 1 Part B §3.7): logo and language switch only, no mega menus,
// no utility bar, no search. Used on campaign landings (/go/:slug) and the SNX hand-offs (/signin, /signup);
// SiteLayout picks it with isMinimalPath(). Not sticky-hiding: the bar is short and the page has one CTA.
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLang } from '../lib/i18n.jsx';
import { Logo } from '../components';
import LanguageSwitch from './LanguageSwitch.jsx';
import './Header.css';
import './MinimalHeader.css';

export default function MinimalHeader() {
  const { t, localePath } = useLang();

  // Sticky page elements sit under the header (top: var(--shell-offset)); the full header updates this as it
  // compacts or hides, so set the fixed minimal height here and leave it for the full header to take over.
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--shell-offset', 'var(--header-h)');
    return () => root.style.removeProperty('--shell-offset');
  }, []);

  return (
    <header className="site-header site-header--minimal">
      <div className="site-header__bar">
        <div className="container site-header__inner site-header__inner--minimal">
          <Link to={localePath('/')} className="site-header__logo" aria-label={t('StartNet home', 'StartNet முகப்பு')}>
            <Logo />
          </Link>
          <LanguageSwitch variant="compact" className="site-header__lang site-header__lang--minimal" />
        </div>
      </div>
    </header>
  );
}
