// Validation copy: Book 2 §13.6 (errors appear under the field, never clear what was typed).

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** "98765 43210", "+91 98765-43210", "098765..." → "9876543210" */
export function normalisePhone(v = '') {
  let d = String(v).replace(/\D/g, '');
  if (d.length === 12 && d.startsWith('91')) d = d.slice(2);
  if (d.length === 11 && d.startsWith('0')) d = d.slice(1);
  return d;
}
export const isIndianMobile = (v) => /^[6-9]\d{9}$/.test(normalisePhone(v));

const fieldName = (label = '') => {
  const s = String(label || '')
    .replace(/\s*\((optional|required)\)\s*/gi, '')
    .replace(/[.…:?]+\s*$/, '')
    .trim();
  // Question-style labels ("I'm writing about…", "Are you under 18?") don't fit "Please add your …"
  if (!s || /^(i|i'm|i am|are|is|do|what|which|how|when)(\s|$)/i.test(s) || /[?…]/.test(String(label))) return '';
  const rest = s.replace(/^your\s+/i, '');
  // Lower-case ordinary words only; keep names like "WhatsApp" or "PAN" as written.
  return rest.replace(/[A-Za-z][\w'-]*/g, (w) => (/^[A-Z][a-z'-]*$/.test(w) ? w.toLowerCase() : w));
};

/**
 * The noun phrase used in generated messages: "your company", but "her company" (already
 * possessive) and "what you are interested in" (not a noun phrase). '' when no phrase fits.
 */
const fieldPhrase = (label = '') => {
  const name = fieldName(label);
  if (!name) return '';
  if (/^interested(\s+in)?$/i.test(name)) return 'what you are interested in';
  if (/^(her|his|their|our|its|my)(\s|$)/i.test(name)) return name;
  if (/^(interested|in|at|for|about|to|from|with|on)(\s|$)/i.test(name)) return name;
  return `your ${name}`;
};

const EN = {
  required: (label) => (fieldPhrase(label) ? `Please add ${fieldPhrase(label)}.` : 'Please answer this question.'),
  choose: (label) => (fieldPhrase(label) ? `Please choose ${fieldPhrase(label)}.` : 'Please choose an option.'),
  email: "That email doesn't look right. Check for a missing @ or a typo.",
  tel: 'Enter a 10-digit Indian mobile number, without +91 or 0.',
  consent: 'Please tick the box to agree before we continue.',
  tooLong: 'This is a little long. Please shorten it.',
  invalid: 'Please check this answer.',
  server: 'Something went wrong on our side, not yours. Your details are saved. Please try again in a minute.',
  rateLimited: "You've sent this a few times in a row. Please wait a few minutes and try again.",
  offline: "You're offline. We've kept what you typed and will send it when you're back online.",
};

// Tamil never wraps the (Tamil) field label in an English sentence: each message stands alone.
// Draft Tamil, pending native review (Book 2 §14 status).
const TA = {
  required: () => 'இந்தத் தகவலைச் சேர்க்கவும்.',
  choose: () => 'ஒன்றைத் தேர்ந்தெடுக்கவும்.',
  email: 'சரியான மின்னஞ்சல் முகவரியை உள்ளிடவும்.',
  tel: '+91 அல்லது 0 இல்லாமல், 10 இலக்க இந்திய மொபைல் எண்ணை உள்ளிடவும்.',
  consent: 'தொடர ஒப்புதல் பெட்டியைத் தேர்ந்தெடுக்கவும்.',
  tooLong: 'இது சற்று நீளமாக உள்ளது. சுருக்கவும்.',
  invalid: 'இந்தப் பதிலைச் சரிபார்க்கவும்.',
  server: 'எங்கள் பக்கத்தில் ஒரு சிக்கல் ஏற்பட்டது, உங்களுடையதில் அல்ல. உங்கள் விவரங்கள் சேமிக்கப்பட்டுள்ளன. ஒரு நிமிடம் கழித்து மீண்டும் முயலவும்.',
  rateLimited: 'இதைத் தொடர்ந்து பலமுறை அனுப்பியுள்ளீர்கள். சில நிமிடங்கள் காத்திருந்து மீண்டும் முயலவும்.',
  offline: 'நீங்கள் இணைய இணைப்பில் இல்லை. நீங்கள் தட்டச்சு செய்ததை வைத்துள்ளோம்; இணைப்பு திரும்பியதும் அனுப்புவோம்.',
};

/** Validation and form-status copy for a language ('en' default). */
export const messagesFor = (lang = 'en') => (lang === 'ta' ? TA : EN);

/** English messages (kept for existing imports). Prefer messagesFor(lang). */
export const MESSAGES = EN;

/**
 * Map a server error code (F-101: fieldErrors carry a code) to the localised client message.
 * Accepts 'required' | 'choose' | 'email' | 'tel' | 'phone' | 'consent' | 'tooLong' | 'invalid' …
 */
export function messageForCode(code, label, lang = 'en') {
  const M = messagesFor(lang);
  const c = String(code || '').replace(/[^a-zA-Z]/g, '').toLowerCase();
  switch (c) {
    case 'required':
    case 'missing':
      return M.required(label);
    case 'choose':
    case 'select':
      return M.choose(label);
    case 'email':
    case 'invalidemail':
      return M.email;
    case 'tel':
    case 'phone':
    case 'invalidphone':
    case 'whatsappneedsphone':
      return c === 'whatsappneedsphone' ? M.required(label) : M.tel;
    case 'consent':
    case 'consentrequired':
      return M.consent;
    case 'toolong':
    case 'maxlength':
      return M.tooLong;
    case 'invalid':
      return M.invalid;
    default:
      return '';
  }
}

/**
 * Read one server fieldErrors entry, which may be a string, an array of strings, or an object
 * { code, message }. Codes may also arrive in a parallel map (body.fieldErrorCodes / body.codes).
 * Returns { code, message }.
 */
export function readServerFieldError(entry, codeMapValue) {
  const v = Array.isArray(entry) ? entry[0] : entry;
  if (v && typeof v === 'object') return { code: v.code || codeMapValue || '', message: v.message || '' };
  return { code: codeMapValue || '', message: v == null ? '' : String(v) };
}

/** Validate one field definition against its value. Returns a message or ''. */
export function validateField(f, value, values, lang = 'en') {
  if (!f) return '';
  const M = messagesFor(lang);
  const empty = value === undefined || value === null || (typeof value === 'string' && value.trim() === '') || value === false;
  if (f.required && empty) {
    if (f.requiredMessage) return f.requiredMessage;
    if (f.type === 'checkbox') return M.consent;
    if (f.type === 'select') return M.choose(f.label);
    return M.required(f.label);
  }
  if (!empty) {
    if (f.type === 'email' && !EMAIL_RE.test(String(value).trim())) return M.email;
    if (f.type === 'tel' && !isIndianMobile(value)) return M.tel;
  }
  if (typeof f.validate === 'function') return f.validate(value, values) || '';
  return '';
}

export const CONSENT_VERSION = '2026-10';

export function readDraft(key) {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}
export function writeDraft(key, data) {
  try {
    window.localStorage.setItem(key, JSON.stringify(data));
  } catch {
    /* storage unavailable: nothing to keep */
  }
}
export function clearDraft(key) {
  try {
    window.localStorage.removeItem(key);
  } catch {
    /* ignore */
  }
}
