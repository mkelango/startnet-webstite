import { useEffect, useId, useRef, useState } from 'react';
import { AlertCircle } from 'lucide-react';
import { useLang } from '../lib/i18n.jsx';
import { postForm } from '../hooks/useApi.js';
import { Field } from './Field.jsx';
import { ConsentCheckbox } from './ConsentCheckbox.jsx';
import { Button } from './Button.jsx';
import { FormSuccess } from './FormSuccess.jsx';
import { WhatsAppButton } from './WhatsAppButton.jsx';
import {
  CONSENT_VERSION,
  clearDraft,
  messageForCode,
  messagesFor,
  normalisePhone,
  readDraft,
  readServerFieldError,
  validateField,
  writeDraft,
} from './formUtils.js';
import { hasTamil } from '../lib/i18n.jsx';
import { cx, safeId } from './_utils.js';
import './SmartForm.css';

const isEmpty = (o) => !o || Object.keys(o).length === 0;

/**
 * Full form (Book 3 C39, Book 4 IX-31): validation on blur, an error summary that takes focus,
 * aria-invalid fields, a three-dot loading state, a success state where the check draws and the
 * full stop lands. Consent is collected per purpose, unticked. Posts via postForm(type, payload).
 *
 * fields: [{ name, label, type?, required?, hint?, options?, autoComplete?, placeholder?, width?: 'half', validate?(value, values), defaultValue? }]
 * consents: [{ purpose, label, required? }]
 * Extra optional props: note (node under the button), onSuccess(result, payload), headingLevel (success title),
 * brand (brand key: the submit button uses the brand fill; when omitted, a surrounding [data-brand] scope is detected).
 * A field's `id` is used for its input when given; otherwise one is generated from `name`.
 * Payload: { ...values, ...hidden, lang, consents: { [purpose]: boolean }, consentVersion, page }.
 */
export function SmartForm({
  type,
  fields,
  consents,
  submitLabel,
  successTitle,
  successBody,
  hidden,
  className,
  note,
  onSuccess,
  headingLevel = 3,
  brand,
}) {
  const { t, lang } = useLang();
  const M = messagesFor(lang);
  const formRef = useRef(null);
  const [scopeBrand, setScopeBrand] = useState(null);
  const uid = safeId(useId());
  const formId = `sf-${safeId(type || 'form')}-${uid}`;
  const draftKey = `sn-draft-${type || 'form'}`;
  const fieldList = (Array.isArray(fields) ? fields : []).filter((f) => f && f.name);
  const consentList = (Array.isArray(consents) ? consents : []).filter((c) => c && c.purpose);

  const [values, setValues] = useState(() => {
    const v = {};
    fieldList.forEach((f) => {
      v[f.name] = f.type === 'checkbox' ? Boolean(f.defaultValue) : f.defaultValue ?? '';
    });
    return v;
  });
  const [consentState, setConsentState] = useState(() => Object.fromEntries(consentList.map((c) => [c.purpose, false])));
  const [errors, setErrors] = useState({});
  const [summary, setSummary] = useState([]);
  const [status, setStatus] = useState('idle'); // idle | submitting | success | error | offline
  const [alertMsg, setAlertMsg] = useState('');
  const [restored, setRestored] = useState(false);
  const summaryRef = useRef(null);
  const alertRef = useRef(null);
  const submitRef = useRef(null);
  const inFlightRef = useRef(false);
  const [hp, setHp] = useState(''); // honeypot: humans never see or fill it
  const valuesRef = useRef(values);
  valuesRef.current = values;

  const idFor = (name) => {
    const def = fieldList.find((x) => x.name === name);
    return def && def.id ? String(def.id) : `${formId}-${safeId(name)}`;
  };

  // Inside a brand page (BrandLayout sets data-brand), the submit button follows the brand fill.
  useEffect(() => {
    if (brand || !formRef.current) return;
    const scope = formRef.current.closest('[data-brand]');
    const key = scope && scope.getAttribute('data-brand');
    setScopeBrand(key && key !== 'x' ? key : null);
  }, [brand]);
  const consentIdFor = (purpose) => `${formId}-consent-${safeId(purpose)}`;

  // Restore a draft kept after a dropped connection (never consents).
  useEffect(() => {
    const d = readDraft(draftKey);
    if (d && typeof d === 'object') {
      const names = new Set(fieldList.map((f) => f.name));
      const picked = Object.fromEntries(Object.entries(d).filter(([k]) => names.has(k)));
      if (!isEmpty(picked)) {
        setValues((v) => ({ ...v, ...picked }));
        setRestored(true);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // While offline, one 'online' listener resends the saved form once; it is removed on reconnect,
  // on any status change and on unmount (the draft stays saved on this device).
  useEffect(() => {
    if (status !== 'offline' || typeof window === 'undefined') return undefined;
    const onOnline = () => submitRef.current && submitRef.current();
    window.addEventListener('online', onOnline, { once: true });
    return () => window.removeEventListener('online', onOnline);
  }, [status]);

  const consentError = (c, checked) =>
    c.required && !checked ? (lang === 'ta' ? (hasTamil(c.error) ? c.error : M.consent) : c.error || M.consent) : '';

  const setField = (name, val) => {
    const next = { ...valuesRef.current, [name]: val };
    valuesRef.current = next;
    setValues(next);
    if (errors[name]) {
      const f = fieldList.find((x) => x.name === name);
      setErrors((e) => ({ ...e, [name]: validateField(f, val, next, lang) }));
    }
  };

  const blurField = (f) => {
    const val = valuesRef.current[f.name];
    const hasValue = !(val === '' || val === false || val == null);
    if (!hasValue && !errors[f.name]) return; // empty required fields are flagged on submit, not on first pass
    setErrors((e) => ({ ...e, [f.name]: validateField(f, val, valuesRef.current, lang) }));
  };

  const setConsent = (c, checked) => {
    setConsentState((s) => ({ ...s, [c.purpose]: checked }));
    const key = `consent:${c.purpose}`;
    if (errors[key]) setErrors((e) => ({ ...e, [key]: consentError(c, checked) }));
  };

  const validateAll = () => {
    const errs = {};
    const list = [];
    fieldList.forEach((f) => {
      const msg = validateField(f, values[f.name], values, lang);
      if (msg) {
        errs[f.name] = msg;
        list.push({ id: idFor(f.name), msg: summaryText(f.label, msg), key: f.name });
      }
    });
    consentList.forEach((c) => {
      const msg = consentError(c, consentState[c.purpose]);
      if (msg) {
        errs[`consent:${c.purpose}`] = msg;
        list.push({ id: consentIdFor(c.purpose), msg, key: `consent:${c.purpose}` });
      }
    });
    return { errs, list };
  };

  // Tamil messages stand alone (no label inside an English template), so the summary names the field.
  const summaryText = (label, msg) => {
    if (lang !== 'ta' || typeof label !== 'string' || !label.trim()) return msg;
    return `${label.trim().replace(/[\s.:…?]+$/, '')}: ${msg}`;
  };

  const focusLater = (ref) => {
    if (typeof window === 'undefined') return;
    window.setTimeout(() => ref.current?.focus(), 0);
  };

  const buildPayload = () => {
    const out = {};
    fieldList.forEach((f) => {
      const v = values[f.name];
      out[f.name] = f.type === 'tel' && v ? normalisePhone(v) : typeof v === 'string' ? v.trim() : v;
    });
    return {
      ...out,
      ...(hidden && typeof hidden === 'object' ? hidden : {}),
      website: hp,
      lang,
      consents: { ...consentState },
      consentVersion: CONSENT_VERSION,
      page: typeof window !== 'undefined' ? window.location.pathname : undefined,
    };
  };

  const doSubmit = async () => {
    if (inFlightRef.current) return;
    const { errs, list } = validateAll();
    if (list.length) {
      setErrors(errs);
      setSummary(list);
      setStatus('idle');
      focusLater(summaryRef);
      return;
    }
    setErrors({});
    setSummary([]);
    setAlertMsg('');
    if (typeof navigator !== 'undefined' && navigator.onLine === false) {
      writeDraft(draftKey, values);
      setAlertMsg(M.offline);
      setStatus('offline');
      focusLater(alertRef);
      return;
    }
    inFlightRef.current = true;
    setStatus('submitting');
    const payload = buildPayload();
    try {
      const res = await postForm(type, payload);
      clearDraft(draftKey);
      setStatus('success');
      if (onSuccess) onSuccess(res, payload);
    } catch (err) {
      if (err && err.status === 429) {
        writeDraft(draftKey, values);
        const serverMsg = (err.body && err.body.message) || err.message;
        setAlertMsg(lang === 'ta' ? (hasTamil(serverMsg) ? serverMsg : M.rateLimited) : serverMsg || M.rateLimited);
        setStatus('error');
        focusLater(alertRef);
        return;
      }
      const fe = err && err.fieldErrors;
      if (fe && !isEmpty(fe)) {
        const next = {};
        const sum = [];
        const codeMap = (err.body && (err.body.fieldErrorCodes || err.body.codes)) || {};
        // Prefer the localised client text for a known code; on /ta, never show an English server sentence.
        const localise = (key, raw, def) => {
          const { code, message } = readServerFieldError(raw, codeMap[key]);
          const byCode = code ? messageForCode(code, def && def.label, lang) : '';
          if (byCode) return byCode;
          if (lang !== 'ta' || hasTamil(message)) return message || M.invalid;
          if (def && def.purpose) return M.consent;
          const local = def && def.name ? validateField({ ...def, required: true }, valuesRef.current[def.name], valuesRef.current, lang) : '';
          return local || M.invalid;
        };
        Object.entries(fe).forEach(([key, raw]) => {
          // Server keys are canonical (e.g. `phone`, `consent`); match aliases to this form's fields.
          const f =
            fieldList.find((x) => x.name === key) ||
            (key === 'phone' ? fieldList.find((x) => x.type === 'tel') : null) ||
            (key === 'email' ? fieldList.find((x) => x.type === 'email') : null);
          const c =
            consentList.find((x) => key === x.purpose || key === `consent:${x.purpose}` || key === `consents.${x.purpose}`) ||
            (key === 'consent' || key === 'consents' ? consentList.find((x) => x.required) || consentList[0] : null);
          const msg = localise(key, raw, f || c);
          if (f) {
            next[f.name] = msg;
            sum.push({ id: idFor(f.name), msg: summaryText(f.label, msg), key: f.name });
          } else if (c) {
            next[`consent:${c.purpose}`] = msg;
            sum.push({ id: consentIdFor(c.purpose), msg, key: `consent:${c.purpose}` });
          } else {
            sum.push({ id: `${formId}-submit`, msg });
          }
        });
        setErrors(next);
        setSummary(sum);
        setStatus('idle');
        focusLater(summaryRef);
        return;
      }
      writeDraft(draftKey, values);
      setAlertMsg(typeof navigator !== 'undefined' && navigator.onLine === false ? M.offline : M.server);
      setStatus('error');
      focusLater(alertRef);
    } finally {
      inFlightRef.current = false;
    }
  };
  submitRef.current = doSubmit;

  const onSubmit = (e) => {
    e.preventDefault();
    if (status === 'submitting' || inFlightRef.current) return;
    doSubmit();
  };

  const firstName = String(values.name || values.fullName || '').trim().split(/\s+/)[0] || '';
  const personalise = (s) => (typeof s === 'string' && firstName ? s.replace(/\[Name\]/g, firstName) : s);

  if (status === 'success') {
    return (
      <FormSuccess
        title={personalise(successTitle) || t("You're in.", 'நீங்கள் இணைந்துவிட்டீர்கள்.')}
        body={personalise(successBody)}
        headingLevel={headingLevel}
        className={className}
      />
    );
  }

  const submitting = status === 'submitting';
  // The summary shrinks as fields are fixed; general (non-field) messages stay until the next submit.
  const openSummary = summary.filter((s) => !s.key || errors[s.key]);

  return (
    <form ref={formRef} id={formId} className={cx('smart-form', className)} noValidate onSubmit={onSubmit} aria-busy={submitting || undefined}>
      {restored && <p className="smart-form__restored">{t('We kept what you typed on this device.', 'நீங்கள் தட்டச்சு செய்ததை இந்தச் சாதனத்தில் வைத்துள்ளோம்.')}</p>}

      {openSummary.length > 0 && (
        <div ref={summaryRef} tabIndex={-1} className="smart-form__summary" role="alert" aria-labelledby={`${formId}-summary`}>
          <p id={`${formId}-summary`} className="smart-form__summary-title">
            <AlertCircle size={18} aria-hidden="true" />
            {openSummary.length === 1
              ? t('Please check one thing before sending.', 'அனுப்பும் முன் ஒன்றைச் சரிபாருங்கள்.')
              : t(`Please check ${openSummary.length} things before sending.`, `அனுப்பும் முன் ${openSummary.length} விவரங்களைச் சரிபாருங்கள்.`)}
          </p>
          <ul className="smart-form__summary-list">
            {openSummary.map((s, i) => (
              <li key={`${s.id}-${i}`}>
                <a
                  href={`#${s.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    const el = document.getElementById(s.id);
                    if (el) {
                      el.focus();
                      el.scrollIntoView?.({ block: 'center' });
                    }
                  }}
                >
                  {s.msg}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {(status === 'error' || status === 'offline') && alertMsg && (
        <div ref={alertRef} tabIndex={-1} className="smart-form__alert" role="alert">
          <AlertCircle size={20} aria-hidden="true" className="smart-form__alert-icon" />
          <div className="smart-form__alert-body">
            <p>{alertMsg}</p>
            <WhatsAppButton text={t("Hi StartNet, I couldn't send a form on the website.", 'வணக்கம் StartNet, இணையதளத்தில் ஒரு படிவத்தை அனுப்ப முடியவில்லை.')} refCode={`form-${type}`} size="sm" />
          </div>
        </div>
      )}

      {/* Honeypot (server checks `website`): off-screen, out of the tab order, hidden from assistive tech */}
      <div aria-hidden="true" style={{ position: 'absolute', left: '-10000px', top: 'auto', width: '1px', height: '1px', overflow: 'hidden' }}>
        <label>
          Website
          <input type="text" name="website" tabIndex={-1} autoComplete="off" value={hp} onChange={(e) => setHp(e.target.value)} />
        </label>
      </div>

      {fieldList.length > 0 && (
        <div className="smart-form__fields">
          {fieldList.map((f) => (
            <Field
              key={f.name}
              id={idFor(f.name)}
              name={f.name}
              label={f.label}
              hint={f.hint}
              type={f.type || 'text'}
              options={f.options}
              required={f.required}
              autoComplete={f.autoComplete}
              placeholder={f.placeholder}
              inputMode={f.inputMode}
              rows={f.rows}
              maxLength={f.maxLength}
              value={values[f.name]}
              error={errors[f.name]}
              onChange={(val) => setField(f.name, val)}
              onBlur={() => blurField(f)}
              className={cx(f.width === 'half' && 'smart-form__half')}
            />
          ))}
        </div>
      )}

      {consentList.length > 0 && (
        <fieldset className="smart-form__consents">
          <legend className="smart-form__legend">{t('Your consent', 'உங்கள் ஒப்புதல்')}</legend>
          {consentList.map((c) => (
            <ConsentCheckbox
              key={c.purpose}
              id={consentIdFor(c.purpose)}
              purpose={c.purpose}
              checked={consentState[c.purpose]}
              onChange={(v) => setConsent(c, v)}
              required={c.required}
              error={errors[`consent:${c.purpose}`]}
            >
              {c.label}
            </ConsentCheckbox>
          ))}
        </fieldset>
      )}

      <div className="smart-form__submit" id={`${formId}-submit`}>
        <Button type="submit" size="lg" loading={submitting} variant={brand || scopeBrand ? 'brand' : 'primary'}>
          {submitLabel || t('Send', 'அனுப்பு')}
        </Button>
        {note && <div className="smart-form__note">{note}</div>}
      </div>
      <p className="visually-hidden" aria-live="polite">
        {submitting ? t('Submitting…', 'அனுப்புகிறது…') : ''}
      </p>
    </form>
  );
}

export default SmartForm;
