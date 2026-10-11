import { useId, useRef, useState } from 'react';
import { AnimatePresence, m } from 'framer-motion';
import { MotionFeatures } from '../lib/motionFeatures.js';
import { AlertCircle } from 'lucide-react';
import { useLang, hasTamil } from '../lib/i18n.jsx';
import { postForm } from '../hooks/useApi.js';
import { useReducedMotion } from '../hooks/useReducedMotion.js';
import { Field, CheckboxControl } from './Field.jsx';
import { ConsentCheckbox } from './ConsentCheckbox.jsx';
import { Button } from './Button.jsx';
import { FormSuccess } from './FormSuccess.jsx';
import { CONSENT_VERSION, EMAIL_RE, isIndianMobile, messageForCode, messagesFor, normalisePhone, readServerFieldError } from './formUtils.js';
import { cx, safeId } from './_utils.js';
import './NewsletterForm.css';

const TOPICS = [
  { value: 'ledger', label: 'Founder Ledger' },
  { value: 'vibe', label: 'Vibe' },
  { value: 'connect', label: 'Connect' },
  { value: 'women', label: 'Women' },
  { value: 'research', label: 'Research' },
];

/**
 * Newsletter + separate, unticked WhatsApp opt-in (Book 2 §13.2–13.3, Book 3 C41).
 * Posts to /api/forms/newsletter with consent per purpose (newsletter, whatsapp_updates).
 */
export function NewsletterForm({ compact = false, night = false, defaultTopics, className }) {
  const { t, lang } = useLang();
  const M = messagesFor(lang);
  const reduced = useReducedMotion();
  const uid = safeId(useId());
  const id = (k) => `nl-${uid}-${k}`;
  const [email, setEmail] = useState('');
  const [topics, setTopics] = useState(() => new Set(Array.isArray(defaultTopics) ? defaultTopics : []));
  const [language, setLanguage] = useState(lang === 'ta' ? 'ta' : 'en');
  const [consent, setConsent] = useState(false);
  const [wa, setWa] = useState(false);
  const [phone, setPhone] = useState('');
  const [waConsent, setWaConsent] = useState(false);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle');
  const [alertMsg, setAlertMsg] = useState('');
  const alertRef = useRef(null);

  const toggleTopic = (v) =>
    setTopics((prev) => {
      const next = new Set(prev);
      if (next.has(v)) next.delete(v);
      else next.add(v);
      return next;
    });

  const validate = () => {
    const e = {};
    if (!email.trim()) e.email = M.required(t('Email address', 'மின்னஞ்சல் முகவரி'));
    else if (!EMAIL_RE.test(email.trim())) e.email = M.email;
    if (!consent) e.consent = t('Please tick the box to agree before we send you emails.', 'மின்னஞ்சல் அனுப்ப ஒப்புதல் பெட்டியைத் தேர்ந்தெடுக்கவும்.');
    if (wa) {
      if (!phone.trim()) e.phone = M.required(t('WhatsApp number', 'WhatsApp எண்'));
      else if (!isIndianMobile(phone)) e.phone = M.tel;
      if (!waConsent) e.waConsent = t('Please tick the box to agree to WhatsApp messages.', 'WhatsApp செய்திகளுக்கு ஒப்புதல் பெட்டியைத் தேர்ந்தெடுக்கவும்.');
    }
    return e;
  };

  const focusFirst = (e) => {
    const order = ['email', 'consent', 'phone', 'waConsent'];
    const first = order.find((k) => e[k]);
    if (first && typeof window !== 'undefined') window.setTimeout(() => document.getElementById(id(first))?.focus(), 0);
  };

  const onSubmit = async (ev) => {
    ev.preventDefault();
    if (status === 'submitting') return;
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) {
      focusFirst(e);
      return;
    }
    setStatus('submitting');
    setAlertMsg('');
    const payload = {
      email: email.trim(),
      topics: topics.size ? [...topics] : TOPICS.map((x) => x.value),
      language,
      whatsappOptIn: wa,
      phone: wa ? normalisePhone(phone) : undefined,
      lang,
      consents: { newsletter: consent, whatsapp_updates: wa && waConsent },
      consentVersion: CONSENT_VERSION,
      page: typeof window !== 'undefined' ? window.location.pathname : undefined,
    };
    try {
      await postForm('newsletter', payload);
      setStatus('success');
    } catch (err) {
      const showAlert = (msg) => {
        setAlertMsg(msg);
        if (typeof window !== 'undefined') window.setTimeout(() => alertRef.current?.focus(), 0);
      };
      if (err && err.status === 429) {
        setStatus('error');
        const serverMsg = (err.body && err.body.message) || err.message;
        showAlert(lang === 'ta' ? (hasTamil(serverMsg) ? serverMsg : M.rateLimited) : serverMsg || M.rateLimited);
        return;
      }
      const fe = err && err.fieldErrors;
      if (fe && Object.keys(fe).length) {
        const codeMap = (err.body && (err.body.fieldErrorCodes || err.body.codes)) || {};
        // Localised client text for a known code; on /ta, never an English server sentence.
        const FALLBACK = { email: M.email, phone: M.tel, newsletter: M.consent, consent: M.consent, whatsapp_updates: M.consent };
        const pickFor = (key) => {
          const { code, message } = readServerFieldError(fe[key], codeMap[key]);
          const byCode = code ? messageForCode(code, key === 'email' ? t('Email address', 'மின்னஞ்சல் முகவரி') : '', lang) : '';
          if (byCode) return byCode;
          if (lang !== 'ta' || hasTamil(message)) return message;
          const base = String(key).replace(/^consents\./, '');
          return FALLBACK[base] || M.invalid;
        };
        const mapped = {};
        if (fe.email) mapped.email = pickFor('email');
        // The phone field is only rendered when the WhatsApp box is ticked.
        if (fe.phone && wa) mapped.phone = pickFor('phone');
        const nlKey = ['newsletter', 'consent', 'consents.newsletter'].find((k) => fe[k]);
        if (nlKey) mapped.consent = pickFor(nlKey);
        const wcKey = ['whatsapp_updates', 'consents.whatsapp_updates'].find((k) => fe[k]);
        if (wcKey && wa) mapped.waConsent = pickFor(wcKey);
        // Any server message for a field that is not on screen goes into the alert, so a failure is never silent.
        const shownKeys = new Set(['email', 'newsletter', 'consent', 'consents.newsletter', ...(wa ? ['phone', 'whatsapp_updates', 'consents.whatsapp_updates'] : [])]);
        const hidden = Object.keys(fe).filter((k) => !shownKeys.has(k) && pickFor(k));
        setErrors(mapped);
        setStatus('idle');
        if (hidden.length) {
          showAlert(String(pickFor(hidden[0])));
        } else if (Object.keys(mapped).length) {
          setAlertMsg('');
          focusFirst(mapped);
        } else {
          showAlert(lang === 'ta' && !hasTamil(err.message) ? M.server : err.message || M.server);
        }
        return;
      }
      setStatus('error');
      const clientMsg = err && err.status && err.status < 500 && err.message;
      showAlert(
        typeof navigator !== 'undefined' && navigator.onLine === false
          ? M.offline
          : (lang === 'ta' ? hasTamil(clientMsg) && clientMsg : clientMsg) || M.server
      );
    }
  };

  const surface = night ? { 'data-surface': 'night' } : {};

  if (status === 'success') {
    return (
      <div className={cx('newsletter', compact && 'newsletter--compact', night && 'newsletter--night', className)} {...surface}>
        <FormSuccess
          title={t("You're in.", 'நீங்கள் இணைந்துவிட்டீர்கள்.')}
          body={
            <>
              <p>
                {t(
                  "Check your inbox to confirm. If it's not there in five minutes, look in Promotions or Spam.",
                  'உறுதிப்படுத்த உங்கள் மின்னஞ்சலைப் பாருங்கள். ஐந்து நிமிடங்களில் வரவில்லை என்றால் Promotions அல்லது Spam-இல் பாருங்கள்.'
                )}
              </p>
              {wa && <p>{t("Done. You're on the list for WhatsApp updates too.", 'முடிந்தது. WhatsApp தகவல்களுக்கான பட்டியலிலும் நீங்கள் சேர்க்கப்பட்டுள்ளீர்கள்.')}</p>}
            </>
          }
        />
      </div>
    );
  }

  const submitting = status === 'submitting';

  return (
    <form
      className={cx('newsletter', compact && 'newsletter--compact', night && 'newsletter--night', className)}
      noValidate
      onSubmit={onSubmit}
      aria-busy={submitting || undefined}
      aria-labelledby={!compact ? id('title') : undefined}
      aria-label={compact ? t('The StartNet newsletter', 'StartNet செய்திமடல்') : undefined}
      {...surface}
    >
      {!compact && (
        <h2 id={id('title')} className="newsletter__title">
          {t('The StartNet newsletter', 'StartNet செய்திமடல்')}
        </h2>
      )}

      {alertMsg && (
        <div ref={alertRef} tabIndex={-1} role="alert" className="newsletter__alert">
          <AlertCircle size={18} aria-hidden="true" />
          <span>{alertMsg}</span>
        </div>
      )}

      <div className="newsletter__row">
        <Field
          id={id('email')}
          name="email"
          type="email"
          label={t('Email address', 'மின்னஞ்சல் முகவரி')}
          placeholder="you@example.com"
          autoComplete="email"
          required
          value={email}
          onChange={(v) => {
            setEmail(v);
            if (errors.email) setErrors((e) => ({ ...e, email: v.trim() && EMAIL_RE.test(v.trim()) ? '' : e.email }));
          }}
          onBlur={() => {
            if (email.trim() && !EMAIL_RE.test(email.trim())) setErrors((e) => ({ ...e, email: M.email }));
          }}
          error={errors.email}
          className="newsletter__email"
        />
        {compact && (
          <Button type="submit" loading={submitting} className="newsletter__submit" variant={night ? 'inverse' : 'primary'}>
            {t('Subscribe', 'செய்திமடலைப் பெறுங்கள்')}
          </Button>
        )}
      </div>

      {!compact && (
        <fieldset className="newsletter__group">
          <legend className="newsletter__legend">{t('Topics', 'தலைப்புகள்')}</legend>
          <div className="newsletter__chips">
            {TOPICS.map((tp) => {
              const on = topics.has(tp.value);
              return (
                <button
                  type="button"
                  key={tp.value}
                  className={cx('newsletter__chip', on && 'newsletter__chip--on')}
                  aria-pressed={on}
                  onClick={() => toggleTopic(tp.value)}
                >
                  {tp.label}
                </button>
              );
            })}
          </div>
        </fieldset>
      )}

      {!compact && (
        <fieldset className="newsletter__group">
          <legend className="newsletter__legend">{t('Email language', 'மின்னஞ்சல் மொழி')}</legend>
          <div className="newsletter__langs">
            {[
              { v: 'en', l: 'English', lang: 'en' },
              { v: 'ta', l: 'தமிழ்', lang: 'ta' },
            ].map((o) => (
              <label key={o.v} className={cx('newsletter__lang', language === o.v && 'newsletter__lang--on')} lang={o.lang}>
                <input type="radio" name={id('language')} value={o.v} checked={language === o.v} onChange={() => setLanguage(o.v)} />
                <span>{o.l}</span>
              </label>
            ))}
          </div>
        </fieldset>
      )}

      <ConsentCheckbox
        id={id('consent')}
        purpose="newsletter"
        required
        checked={consent}
        onChange={(v) => {
          setConsent(v);
          if (v && errors.consent) setErrors((e) => ({ ...e, consent: '' }));
        }}
        error={errors.consent}
      >
        {t(
          'Send me programme calls, event dates and Founder Ledger updates. I can unsubscribe at any time.',
          'திட்ட அழைப்புகள், நிகழ்வு தேதிகள் மற்றும் Founder Ledger தகவல்களை எனக்கு அனுப்புங்கள். எப்போது வேண்டுமானாலும் விலகலாம்.'
        )}
      </ConsentCheckbox>

      <div className="newsletter__wa">
        <label className="newsletter__wa-toggle" htmlFor={id('wa')}>
          <CheckboxControl id={id('wa')} checked={wa} onChange={(e) => setWa(e.target.checked)} aria-controls={wa ? id('wa-panel') : undefined} aria-expanded={wa} />
          <span className="newsletter__wa-text">{t('Also send me WhatsApp updates', 'WhatsApp-இலும் தகவல்களை அனுப்புங்கள்')}</span>
        </label>
        <MotionFeatures>
        <AnimatePresence initial={false}>
          {wa && (
            <m.div
              id={id('wa-panel')}
              className="newsletter__wa-panel"
              initial={reduced ? false : { height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1, transition: { duration: reduced ? 0 : 0.24 } }}
              exit={{ height: 0, opacity: 0, transition: { duration: reduced ? 0 : 0.16 } }}
            >
              <div className="newsletter__wa-inner">
                <Field
                  id={id('phone')}
                  name="phone"
                  type="tel"
                  label={t('WhatsApp number', 'WhatsApp எண்')}
                  hint={t('10-digit mobile number', '10 இலக்க மொபைல் எண்')}
                  required
                  value={phone}
                  onChange={(v) => {
                    setPhone(v);
                    if (errors.phone && isIndianMobile(v)) setErrors((e) => ({ ...e, phone: '' }));
                  }}
                  onBlur={() => {
                    if (phone.trim() && !isIndianMobile(phone)) setErrors((e) => ({ ...e, phone: M.tel }));
                  }}
                  error={errors.phone}
                />
                <ConsentCheckbox
                  id={id('waConsent')}
                  purpose="whatsapp_updates"
                  required
                  checked={waConsent}
                  onChange={(v) => {
                    setWaConsent(v);
                    if (v && errors.waConsent) setErrors((e) => ({ ...e, waConsent: '' }));
                  }}
                  error={errors.waConsent}
                >
                  {t(
                    "I agree to receive messages from StartNet on WhatsApp about the topics I've chosen. No messages between 9 p.m. and 8 a.m. Reply STOP any time to opt out.",
                    'நான் தேர்ந்தெடுத்த தலைப்புகள் குறித்து StartNet-இடமிருந்து WhatsApp செய்திகளைப் பெற ஒப்புக்கொள்கிறேன். இரவு 9 முதல் காலை 8 வரை செய்திகள் இல்லை. விலக எப்போது வேண்டுமானாலும் STOP என்று பதிலளியுங்கள்.'
                  )}
                </ConsentCheckbox>
              </div>
            </m.div>
          )}
        </AnimatePresence>
        </MotionFeatures>
      </div>

      {!compact && (
        <div className="newsletter__actions">
          <Button type="submit" size="lg" loading={submitting} variant={night ? 'inverse' : 'primary'}>
            {t('Subscribe', 'செய்திமடலைப் பெறுங்கள்')}
          </Button>
        </div>
      )}
      <p className="visually-hidden" aria-live="polite">
        {submitting ? t('Submitting…', 'அனுப்புகிறது…') : ''}
      </p>
    </form>
  );
}

export default NewsletterForm;
