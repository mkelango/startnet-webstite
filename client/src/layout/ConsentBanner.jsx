// C43 · Consent banner (Book 2 §13.1 copy, Book 3 C43). DPDP: non-essential off by default,
// "Reject non-essential" and "Accept all" have equal size and weight, never blocks reading (non-modal region,
// early in tab order), reopened from the footer "Cookie settings". Choice stored in localStorage (6 months, versioned).
// While shown, its height is published as --consent-h so pages can keep focused controls clear of it (WCAG 2.4.11).
// Reopened from "Cookie settings": Esc closes it, and closing returns focus to the control that opened it.
// Phones (< 768 px): a compact first view (one key sentence + privacy link, the three actions in one row in English
// or 2 + 1 in Tamil); the full explanation and the per-category switches sit behind "Choose".
// Tamil strings: Book 2 §14.3 for the two buttons; the rest are drafts pending native review.
import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, m } from 'framer-motion';
import { X } from 'lucide-react';
import { useLang } from '../lib/i18n.jsx';
import { useReducedMotion } from '../hooks/useReducedMotion.js';
import { useMediaQuery, useShell } from './shell.jsx';
import './ConsentBanner.css';

export const CONSENT_KEY = 'sn-consent';
export const CONSENT_VERSION = '2026-10';
const MAX_AGE_MS = 182 * 24 * 60 * 60 * 1000; // ~6 months

export function readConsent() {
  try {
    const v = JSON.parse(localStorage.getItem(CONSENT_KEY) || 'null');
    if (!v || v.version !== CONSENT_VERSION || Date.now() - (v.ts || 0) > MAX_AGE_MS) return null;
    return v;
  } catch { return null; }
}

function saveConsent(choice) {
  const record = { version: CONSENT_VERSION, essential: true, analytics: !!choice.analytics, marketing: !!choice.marketing, ts: Date.now() };
  try { localStorage.setItem(CONSENT_KEY, JSON.stringify(record)); } catch { /* storage blocked: banner shows again next visit */ }
  window.dispatchEvent(new CustomEvent('sn:consent', { detail: record }));
  return record;
}

const CATEGORIES = [
  {
    id: 'essential',
    label: 'Essential',
    labelTa: 'அவசியமானவை',
    locked: true,
    body: 'Keep the site secure, remember your language and your cookie choice.',
    bodyTa: 'தளத்தைப் பாதுகாப்பாக வைத்திருக்கின்றன; உங்கள் மொழியையும் குக்கீ தேர்வையும் நினைவில் கொள்கின்றன.',
  },
  {
    id: 'analytics',
    label: 'Analytics',
    labelTa: 'பகுப்பாய்வு',
    body: 'Help us see which pages work, using pseudonymous data. No personal details are sent.',
    bodyTa: 'புனைபெயர்த் தரவைக் கொண்டு எந்தப் பக்கங்கள் பயனுள்ளவை என்று அறிய உதவுகின்றன. தனிப்பட்ட விவரங்கள் எதுவும் அனுப்பப்படாது.',
  },
  {
    id: 'marketing',
    label: 'Marketing',
    labelTa: 'சந்தைப்படுத்தல்',
    body: 'Measure whether our ads and campaigns reach people.',
    bodyTa: 'எங்கள் விளம்பரங்களும் பிரச்சாரங்களும் மக்களைச் சென்றடைகின்றனவா என்பதை அளவிடுகின்றன.',
  },
];

export default function ConsentBanner() {
  const { t, lang, localePath } = useLang();
  const { consentRequest, setConsentVisible } = useShell();
  const reduced = useReducedMotion();
  const narrow = useMediaQuery('(max-width: 359px)');
  const ids = useId();
  const regionRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [manage, setManage] = useState(false);
  const [prefs, setPrefs] = useState({ analytics: false, marketing: false });
  const [toast, setToast] = useState(false);
  const reopened = useRef(false);
  const returnTo = useRef(null); // the control that reopened the banner (footer "Cookie settings")
  const reopenedMode = useRef(false); // true while the banner is open because the user asked for it

  // First visit (or expired / new version): show.
  useEffect(() => { if (!readConsent()) setOpen(true); }, []);

  // Footer "Cookie settings" reopens with the preferences panel and current choices.
  useEffect(() => {
    if (!consentRequest) return;
    const current = readConsent();
    setPrefs({ analytics: !!current?.analytics, marketing: !!current?.marketing });
    const active = document.activeElement;
    returnTo.current = active && active !== document.body ? active : null;
    setToast(false); // a lingering "Saved" toast must never sit over the reopened banner's buttons (F-24)
    setManage(true);
    setOpen(true);
    reopened.current = true;
    reopenedMode.current = true;
  }, [consentRequest]);

  useEffect(() => { setConsentVisible(open); }, [open, setConsentVisible]);

  // Publish the banner's height while it is visible (consumed for scroll-padding-bottom).
  useLayoutEffect(() => {
    const root = document.documentElement;
    const el = regionRef.current;
    if (!open || !el) { root.style.removeProperty('--consent-h'); root.removeAttribute('data-consent-open'); return undefined; }
    root.setAttribute('data-consent-open', '');
    const set = () => {
      // Layout height + bottom offset (the desktop card floats 24 px up); ignores the entry transform.
      const bottom = parseFloat(getComputedStyle(el).bottom) || 0;
      root.style.setProperty('--consent-h', `${Math.ceil(el.offsetHeight + bottom)}px`);
    };
    set();
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(set) : null;
    ro?.observe(el);
    window.addEventListener('resize', set);
    return () => { ro?.disconnect(); window.removeEventListener('resize', set); root.style.removeProperty('--consent-h'); root.removeAttribute('data-consent-open'); };
  }, [open, manage]);

  // "Choose" unmounts itself: move focus to the first preference switch it revealed (WCAG 2.4.3).
  const focusPrefs = useRef(false);
  useEffect(() => {
    if (!manage || !focusPrefs.current) return;
    focusPrefs.current = false;
    regionRef.current?.querySelector('.cookie-banner__switch')?.focus({ preventScroll: true });
  }, [manage]);

  const restoreFocus = useCallback(() => {
    const target = returnTo.current;
    returnTo.current = null;
    reopenedMode.current = false;
    if (target && document.contains(target)) {
      requestAnimationFrame(() => target.focus?.({ preventScroll: true }));
      return;
    }
    // First visit: there is no earlier control. If focus was in the banner (it is about to unmount), continue at
    // the start of the main content instead of dropping to <body>.
    const region = regionRef.current;
    const active = document.activeElement;
    if (region && active && region.contains(active)) {
      requestAnimationFrame(() => {
        const now = document.activeElement;
        if (now && now !== document.body && !region.contains(now)) return;
        document.getElementById('main')?.focus({ preventScroll: true });
      });
    }
  }, []);

  const dismiss = useCallback(() => {
    setOpen(false);
    setManage(false);
    restoreFocus();
  }, [restoreFocus]);

  // Esc closes the banner when the user reopened it (first-visit banner needs an explicit choice).
  useEffect(() => {
    if (!open || !reopenedMode.current || !readConsent()) return undefined;
    const onKey = (e) => {
      if (e.key !== 'Escape' || e.defaultPrevented) return;
      if (document.querySelector('[aria-modal="true"]')) return; // a modal owns Esc
      e.preventDefault();
      dismiss();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, consentRequest, dismiss]);

  useEffect(() => {
    if (open && reopened.current) {
      reopened.current = false;
      requestAnimationFrame(() => regionRef.current?.focus({ preventScroll: true }));
    }
  }, [open]);

  useEffect(() => {
    if (!toast) return undefined;
    const timer = window.setTimeout(() => setToast(false), 6000);
    return () => clearTimeout(timer);
  }, [toast]);

  const finish = (choice) => {
    saveConsent(choice);
    setOpen(false);
    setManage(false);
    restoreFocus();
    setToast(true);
  };

  // U+2011 (non-breaking hyphen): "non‑essential" never splits at its hyphen. Below 360 px the Tamil label is the
  // shorter "Essential only" (தேவையானவை மட்டும்), so the two equal buttons fit side by side without splitting a word.
  const rejectLabel = t('Reject non‑essential', narrow ? 'தேவையானவை மட்டும்' : 'அவசியமற்றவற்றை நிராகரி');
  const acceptLabel = t('Accept all', 'அனைத்தையும் ஏற்கிறேன்');
  const privacy = (
    <Link to={localePath('/legal/privacy')} className="cookie-banner__privacy">{t('Privacy notice', 'தனியுரிமை அறிவிப்பு')}</Link>
  );

  const motionProps = reduced
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0, transition: { duration: 0.1 } } }
    : {
        // DESIGN-v2 3.17: y 16 → 0 + opacity, 320ms --ease-reveal, 600ms after load (first view); exit opacity 160ms
        initial: { opacity: 0, y: 16 },
        animate: { opacity: 1, y: 0, transition: { duration: 0.32, ease: [0.22, 1, 0.36, 1], delay: reopened.current ? 0 : 0.6 } },
        exit: { opacity: 0, transition: { duration: 0.16 } },
      };

  return (
    <>
      <AnimatePresence>
        {open && (
          <m.section
            key="consent"
            ref={regionRef}
            tabIndex={-1}
            className="cookie-banner"
            data-manage={manage || undefined}
            role="region"
            aria-labelledby={`${ids}-title`}
            {...motionProps}
          >
            <div className="cookie-banner__inner">
              <div className="cookie-banner__text">
                <h2 id={`${ids}-title`} className="cookie-banner__title">{t('Your choice, your data', 'உங்கள் தேர்வு, உங்கள் தரவு')}</h2>
                <p className="cookie-banner__body">
                  <span className="cookie-banner__lead">
                    {t('We use essential cookies to run this site.', 'இந்தத் தளத்தை இயக்க அவசியமான குக்கீகளைப் பயன்படுத்துகிறோம்.')}{' '}
                  </span>
                  <span className="cookie-banner__more">
                    {t(
                      'With your permission, we’d also use analytics to learn which pages help people, and marketing cookies to measure our campaigns.',
                      'உங்கள் அனுமதியுடன், எந்தப் பக்கங்கள் மக்களுக்கு உதவுகின்றன என்பதை அறிய பகுப்பாய்வுக் குக்கீகளையும், எங்கள் பிரச்சாரங்களை அளவிட சந்தைப்படுத்தல் குக்கீகளையும் பயன்படுத்துவோம்.'
                    )}{' '}
                  </span>
                  <span className="cookie-banner__key">
                    {t('Non-essential cookies stay off unless you turn them on.', 'நீங்கள் இயக்காதவரை அவசியமற்ற குக்கீகள் அணைந்தே இருக்கும்.')}
                  </span>{' '}
                  {privacy}
                </p>
              </div>

              {manage && (
                <fieldset className="cookie-banner__prefs">
                  <legend className="visually-hidden">{t('Cookie preferences', 'குக்கீ விருப்பங்கள்')}</legend>
                  {CATEGORIES.map((c) => (
                    <div key={c.id} className="cookie-banner__pref">
                      <div className="cookie-banner__pref-text">
                        {c.locked
                          ? <span className="cookie-banner__pref-label">{t(c.label, c.labelTa)}</span>
                          : <label htmlFor={`${ids}-${c.id}`} className="cookie-banner__pref-label">{t(c.label, c.labelTa)}</label>}
                        <p id={`${ids}-${c.id}-d`} className="cookie-banner__pref-body">{t(c.body, c.bodyTa)}</p>
                      </div>
                      {c.locked ? (
                        <span className="cookie-banner__always">{t('Always on', 'எப்போதும் இயக்கத்தில்')}</span>
                      ) : (
                        <input
                          id={`${ids}-${c.id}`}
                          type="checkbox"
                          role="switch"
                          className="cookie-banner__switch"
                          aria-describedby={`${ids}-${c.id}-d`}
                          checked={prefs[c.id]}
                          onChange={(e) => setPrefs((p) => ({ ...p, [c.id]: e.target.checked }))}
                        />
                      )}
                    </div>
                  ))}
                  <p className="cookie-banner__notice">
                    {lang === 'ta' ? (
                      <>
                        இந்த அறிவிப்பு ஆங்கிலத்திலும் தமிழிலும் கிடைக்கிறது. கேள்விகளா? எங்கள்{' '}
                        <Link to={localePath('/legal/grievance')}>குறைதீர்ப்பு அலுவலரைத்</Link> தொடர்புகொள்ளுங்கள்.
                      </>
                    ) : (
                      <>
                        This notice is available in English and Tamil. Questions? Contact our{' '}
                        <Link to={localePath('/legal/grievance')}>Grievance officer</Link>.
                      </>
                    )}
                  </p>
                </fieldset>
              )}

              <div className="cookie-banner__actions" data-count={manage ? 2 : 3}>
                {manage ? (
                  <>
                    <button type="button" className="cookie-banner__btn" onClick={() => finish(prefs)}>{t('Save my choices', 'என் தேர்வுகளைச் சேமி')}</button>
                    <button type="button" className="cookie-banner__btn" onClick={() => finish({ analytics: false, marketing: false })}>
                      {rejectLabel}
                    </button>
                  </>
                ) : (
                  <>
                    <button type="button" className="cookie-banner__btn" onClick={() => finish({ analytics: false, marketing: false })}>
                      {rejectLabel}
                    </button>
                    <button type="button" className="cookie-banner__btn" onClick={() => finish({ analytics: true, marketing: true })}>
                      {acceptLabel}
                    </button>
                    <button type="button" className="cookie-banner__text-btn" onClick={() => { focusPrefs.current = true; setManage(true); }}>
                      {t('Choose', 'தேர்வு செய்யுங்கள்')}
                    </button>
                  </>
                )}
              </div>
              {manage && readConsent() && (
                <button
                  type="button"
                  className="cookie-banner__dismiss"
                  aria-label={t('Close cookie settings without changes', 'மாற்றமின்றி குக்கீ அமைப்புகளை மூடு')}
                  onClick={dismiss}
                >
                  <X size={20} aria-hidden="true" />
                </button>
              )}
            </div>
          </m.section>
        )}
      </AnimatePresence>
      <div className="cookie-toast" role="status" aria-live="polite">
        {toast && !open && (
          <p className="cookie-toast__msg">
            {t(
              'Saved. You can change this any time from Cookie settings at the bottom of every page.',
              'சேமிக்கப்பட்டது. ஒவ்வொரு பக்கத்தின் கீழுள்ள ‘குக்கீ அமைப்புகள்’ மூலம் எப்போது வேண்டுமானாலும் மாற்றலாம்.'
            )}
          </p>
        )}
      </div>
    </>
  );
}
