// C06 · Language switch (Book 1 Part B §3.5, Book 3 C06, Book 4 IX-04).
// Each label is set in its own script and carries `lang`; links carry `hreflang`; the active one has aria-current.
import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { X } from 'lucide-react';
import { useLang } from '../lib/i18n.jsx';
import './LanguageSwitch.css';

function useTargets() {
  const { lang, basePath } = useLang();
  const { search, hash } = useLocation();
  const tail = `${search}${hash}`;
  const en = `${basePath}${tail}`;
  const ta = `${basePath === '/' ? '/ta' : `/ta${basePath}`}${tail}`;
  return { lang, en, ta };
}

/**
 * variant 'full' → "EN | தமிழ்" (utility bar, drawer footer). The current language is plain text with
 * aria-current (not a link to the page you are on).
 * variant 'compact' → "EN/த" (mobile header): a single link to the other language. Its accessible name starts
 * with the visible text (WCAG 2.5.3 label in name), followed by visually hidden words saying where it goes.
 */
export default function LanguageSwitch({ variant = 'full', night = false, className = '' }) {
  const { lang, en, ta } = useTargets();
  const { t } = useLang();

  if (variant === 'compact') {
    const toTa = lang !== 'ta';
    return (
      <Link
        to={toTa ? ta : en}
        hrefLang={toTa ? 'ta' : 'en'}
        className={`lang-switch lang-switch--compact ${className}`}
      >
        <span lang="en" className={lang === 'en' ? 'is-active' : ''}>EN</span>
        <span aria-hidden="true" className="lang-switch__sep">/</span>
        <span lang="ta" className={lang === 'ta' ? 'is-active' : ''}>த</span>
        <span className="visually-hidden">
          {toTa ? <span lang="ta">: தமிழில் படிக்க (Read in Tamil)</span> : <span lang="en">: Read in English (ஆங்கிலத்தில் படிக்க)</span>}
        </span>
      </Link>
    );
  }

  const opt = (code, to, text) => {
    if (lang === code) {
      return (
        <span lang={code} aria-current="true" className="lang-switch__opt lang-switch__opt--current">
          {text}
        </span>
      );
    }
    return (
      <Link to={to} hrefLang={code} lang={code} className="lang-switch__opt">
        {text}
      </Link>
    );
  };

  return (
    <div
      role="group"
      aria-label={t('Language. Current language: English.', 'மொழி. தற்போதைய மொழி: தமிழ்.')}
      className={`lang-switch ${night ? 'lang-switch--night' : ''} ${className}`}
    >
      {opt('en', en, 'EN')}
      <span aria-hidden="true" className="lang-switch__sep">|</span>
      {opt('ta', ta, 'தமிழ்')}
    </div>
  );
}

const SUGGEST_KEY = 'sn-ta-suggest-dismissed';

/** One-time, dismissible offer of the Tamil version when the browser prefers Tamil (§3.5). Never redirects. */
export function TamilSuggestBanner() {
  const { lang, ta } = useTargets();
  const [show, setShow] = useState(false);
  useEffect(() => {
    if (lang === 'ta') { setShow(false); return; }
    let dismissed = false;
    try { dismissed = localStorage.getItem(SUGGEST_KEY) === '1'; } catch { /* storage blocked */ }
    const prefersTa = (navigator.languages || [navigator.language]).some((l) => /^ta\b/i.test(l || ''));
    setShow(prefersTa && !dismissed);
  }, [lang]);
  const dismiss = () => {
    setShow(false);
    try { localStorage.setItem(SUGGEST_KEY, '1'); } catch { /* storage blocked */ }
  };
  if (!show) return null;
  return (
    <div className="lang-suggest" role="region" aria-label="Tamil version available">
      <div className="container lang-suggest__inner">
        <p>
          This site is also available in Tamil. <span lang="ta">இந்தத் தளம் தமிழிலும் உள்ளது.</span>
        </p>
        <Link to={ta} hrefLang="ta" lang="ta" onClick={dismiss} className="lang-suggest__link">தமிழ்</Link>
        <button type="button" className="lang-suggest__close" onClick={dismiss} aria-label="Dismiss">
          <X size={18} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
