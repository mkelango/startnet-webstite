import { createElement, isValidElement } from 'react';
import { joinTamilSuffix } from '../lib/i18n.jsx';

// Small helpers shared by the UI kit (internal; not part of the public contract).

export const cx = (...a) => a.filter(Boolean).join(' ');

/** FNV-1a string hash: deterministic seeds from slugs. */
export function hashString(s = '') {
  let h = 2166136261;
  const str = String(s);
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** mulberry32 PRNG: same seed, same composition. */
export function rng(seed = 1) {
  let a = (Number(seed) >>> 0) || 1;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const isHttp = (href = '') => /^https?:\/\//i.test(href);
export const isOwnSite = (href = '') => /^https?:\/\/(www\.)?startnet\.in(\/|$|\?|#)/i.test(href);
export const isSnx = (href = '') => /^https?:\/\/x\.startnet\.in/i.test(href);
export const isExternal = (href = '') => isHttp(href) && !isOwnSite(href);

/**
 * On-site URL of an event. An event in a series is an edition, canonical at /events/<series>/<edition> (Book 1 §7.4);
 * the edition key follows seriesData.js editionKeyOf (slug minus "<series>-", else `edition`, else the slug).
 */
export function eventPath(e) {
  if (!e?.slug) return undefined;
  if (typeof e.series === 'string' && e.series) {
    const prefix = `${e.series}-`;
    const key = e.slug.startsWith(prefix) && e.slug.length > prefix.length ? e.slug.slice(prefix.length) : e.edition || e.slug;
    return `/events/${e.series}/${key}`;
  }
  return `/events/${e.slug}`;
}

export const isoLike = (s) => typeof s === 'string' && /^\d{4}-\d{2}(-\d{2})?/.test(s);

/** Render a lucide component, a React element, or nothing. */
export function renderIcon(icon, props) {
  if (!icon) return null;
  if (isValidElement(icon)) return icon;
  if (typeof icon === 'function' || (typeof icon === 'object' && icon.$$typeof)) return createElement(icon, props);
  return null;
}

export function initialsOf(name = '') {
  const parts = String(name).replace(/[[\]]/g, '').trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return '';
  const first = parts[0][0] || '';
  const last = parts.length > 1 ? parts[parts.length - 1][0] : '';
  return (first + last).toUpperCase();
}

export const safeId = (id = '') => String(id).replace(/[^a-zA-Z0-9_-]/g, '');

/** Confidence tags (Book 2 §0 legend, Book 3 Part A §3.7, Part B C15). */
export const TAG_META = {
  A: {
    word: 'Verified',
    wordTa: 'சரிபார்க்கப்பட்டது',
    name: 'system record',
    nameTa: 'அமைப்புப் பதிவு',
    meaning: 'Verified against a primary source, such as a system record.',
    meaningTa: 'அமைப்புப் பதிவு போன்ற முதன்மை மூலத்துடன் சரிபார்க்கப்பட்டது.',
  },
  B: {
    word: 'Claimed',
    wordTa: 'கூறப்பட்டது',
    name: "organisation's own claim",
    nameTa: 'அமைப்பின் சொந்தக் கூற்று',
    meaning: "An organisation's own claim, checked but not independently verified.",
    meaningTa: 'ஒரு அமைப்பின் சொந்தக் கூற்று. சரிபார்க்கப்பட்டது, ஆனால் சுயாதீனமாக உறுதிசெய்யப்படவில்லை.',
  },
  C: {
    word: 'Estimate',
    wordTa: 'மதிப்பீடு',
    name: 'estimate or planning assumption',
    nameTa: 'மதிப்பீடு அல்லது திட்ட அனுமானம்',
    meaning: 'An estimate, target or planning assumption. Never summed with A or B figures.',
    meaningTa: 'மதிப்பீடு, இலக்கு அல்லது திட்ட அனுமானம். A அல்லது B எண்களுடன் ஒருபோதும் கூட்டப்படுவதில்லை.',
  },
};

/** Founder ladder (Book 2 §2, "The founder ladder"). */
export const LADDER_LEVELS = [
  { code: 'L1', name: 'Aware', nameTa: 'அறிமுகம்', definition: 'Attended an event or joined the community. Tracked, not counted as nurtured.', definitionTa: 'ஒரு நிகழ்வில் பங்கேற்றவர் அல்லது சமூகத்தில் இணைந்தவர். கண்காணிக்கப்படுகிறது; வளர்க்கப்பட்டவராகக் கணக்கிடப்படுவதில்லை.' },
  { code: 'L2', name: 'Nurtured', nameTa: 'வளர்க்கப்பட்டவர்', definition: 'A StartNet X profile plus at least two meaningful touchpoints.', definitionTa: 'StartNet X சுயவிவரமும் குறைந்தது இரண்டு அர்த்தமுள்ள தொடர்புகளும்.' },
  { code: 'L3', name: 'Skilled', nameTa: 'திறன் பெற்றவர்', definition: 'Completed a structured programme.', definitionTa: 'ஒரு கட்டமைக்கப்பட்ட திட்டத்தை நிறைவு செய்தவர்.' },
  { code: 'L4', name: 'Building', nameTa: 'உருவாக்குபவர்', definition: 'A team with a prototype or MVP in progress.', definitionTa: 'முன்மாதிரி அல்லது MVP உருவாக்கத்தில் உள்ள குழு.' },
  { code: 'L5', name: 'Launched', nameTa: 'தொடங்கியவர்', definition: 'A registered company.', definitionTa: 'பதிவு செய்யப்பட்ட நிறுவனம்.' },
  { code: 'L6', name: 'Funded', nameTa: 'நிதி பெற்றவர்', definition: 'First external capital, or ₹10 L+ revenue.', definitionTa: 'முதல் வெளி மூலதனம், அல்லது ₹10 லட்சம்+ வருவாய்.' },
  { code: 'L7', name: 'Scaling', nameTa: 'விரிவடைபவர்', definition: '₹1 Cr+ revenue, Series A, or 25+ jobs.', definitionTa: '₹1 கோடி+ வருவாய், Series A, அல்லது 25+ வேலைகள்.' },
];

export const STATUS_LABEL = {
  open: ['Open', 'திறந்துள்ளது'],
  closing: ['Closing soon', 'விரைவில் முடிகிறது'],
  upcoming: ['Upcoming', 'வரவிருக்கிறது'],
  closed: ['Closed', 'முடிந்தது'],
  rolling: ['Rolling', 'தொடர்ச்சியானது'],
  past: ['Past', 'முடிந்தது'],
};

export const FORMAT_LABEL = { online: 'Online', 'in-person': 'In person', hybrid: 'Hybrid' };
export const FORMAT_LABEL_TA = { online: 'இணையவழி', 'in-person': 'நேரில்', hybrid: 'இணையவழி + நேரில்' };
export const PRICE_LABEL = { free: 'Free', paid: 'Paid', sponsored: 'Sponsored' };
export const PRICE_LABEL_TA = { free: 'இலவசம்', paid: 'கட்டணம் உண்டு', sponsored: 'நிதியுதவி பெற்றது' };
export const LANG_LABEL = { en: 'English', ta: 'தமிழ்', both: 'English · தமிழ்', bilingual: 'English · தமிழ்' };
export const LANG_LABEL_TA = { en: 'ஆங்கிலம்', ta: 'தமிழ்', both: 'ஆங்கிலம் · தமிழ்', bilingual: 'ஆங்கிலம் · தமிழ்' };

/** Label lookups by page language: labelFor(FORMAT_LABEL, FORMAT_LABEL_TA, 'online', lang). */
export const labelFor = (en, ta, key, lang) => (lang === 'ta' && ta && ta[key]) || (en && en[key]) || key;
export const formatLabel = (key, lang) => labelFor(FORMAT_LABEL, FORMAT_LABEL_TA, key, lang);
export const priceLabel = (key, lang) => labelFor(PRICE_LABEL, PRICE_LABEL_TA, key, lang);

export const langList = (langs, lang = 'en') => {
  if (!langs) return '';
  const arr = Array.isArray(langs) ? langs : [langs];
  return arr.map((l) => labelFor(LANG_LABEL, LANG_LABEL_TA, l, lang)).join(' · ');
};

export const PLACEHOLDER_TEXT = '[placeholder — to be supplied by StartNet]';
export const PLACEHOLDER_TEXT_TA = '[இடநிரப்பி — StartNet வழங்க வேண்டும்]';

/** "Planning assumption", "As published" are qualifiers, not dates: only these read as dates. */
const DATE_LIKE =
  /^(?:(?:\d{1,2}\s+)?(?:jan|feb|mar|apr|may|jun|jul|aug|sep|sept|oct|nov|dec)[a-z]*\.?,?\s+\d{4}|\d{4}(?:\s*[–-]\s*\d{2,4})?|q[1-4]\s+(?:fy\s*)?\d{2,4}(?:[–-]\d{2,4})?|fy\s*\d{2,4}(?:\s*[–-]\s*\d{2,4})?|h[12]\s+\d{4})$/i;
export const dateLike = (s) => isoLike(s) || (typeof s === 'string' && DATE_LIKE.test(s.trim()));

/** Tamil for the CTA labels the API sends (Book 2 §14.3 where it exists). Draft, pending native review. */
export const CTA_TA = {
  'Join StartNet': 'StartNet-இல் இணையுங்கள்',
  'Find your programme': 'உங்கள் திட்டத்தைக் கண்டறியுங்கள்',
  'See upcoming events': 'வரவிருக்கும் நிகழ்வுகளைப் பாருங்கள்',
  Register: 'பதிவு செய்யுங்கள்',
  'Register your team': 'உங்கள் குழுவைப் பதிவு செய்யுங்கள்',
  'Apply now': 'இப்போதே விண்ணப்பியுங்கள்',
  'Chat on WhatsApp': 'WhatsApp-இல் பேசுங்கள்',
  'Get updates on WhatsApp': 'WhatsApp-இல் தகவல்களைப் பெறுங்கள்',
  Subscribe: 'செய்திமடலைப் பெறுங்கள்',
  'Read the Founder Ledger': 'Founder Ledger-ஐப் படியுங்கள்',
  'Partner with us': 'எங்களுடன் கூட்டு சேருங்கள்',
  'Talk to us': 'எங்களிடம் பேசுங்கள்',
  'Create your free profile': 'உங்கள் இலவச சுயவிவரத்தை உருவாக்குங்கள்',
  'Apply for the next cohort': 'அடுத்த தொகுப்பிற்கு விண்ணப்பியுங்கள்',
  'Apply to Launchpad': 'Launchpad-க்கு விண்ணப்பியுங்கள்',
  'Apply to Scale Connect': 'Scale Connect-க்கு விண்ணப்பியுங்கள்',
  'Apply to a Circle': 'ஒரு Circle-க்கு விண்ணப்பியுங்கள்',
  'Book a consultation': 'ஆலோசனைக்கு முன்பதிவு செய்யுங்கள்',
  'Book a readiness review': 'தயார்நிலை மதிப்பாய்வுக்கு முன்பதிவு செய்யுங்கள்',
  'Browse courses': 'பாடநெறிகளைப் பாருங்கள்',
  'Check eligibility': 'தகுதியைச் சரிபாருங்கள்',
  'Host Vibe Campus': 'Vibe Campus-ஐ நடத்துங்கள்',
  'Join a Circle': 'ஒரு Circle-இல் இணையுங்கள்',
  'Register for the next event': 'அடுத்த நிகழ்வுக்குப் பதிவு செய்யுங்கள்',
  'Register interest as an angel': 'ஏஞ்சல் முதலீட்டாளராக ஆர்வத்தைப் பதிவு செய்யுங்கள்',
  'Register interest': 'ஆர்வத்தைப் பதிவு செய்யுங்கள்',
  'See campus events': 'வளாக நிகழ்வுகளைப் பாருங்கள்',
  'Start Rise Academy': 'Rise Academy-ஐத் தொடங்குங்கள்',
  'Start a Vibe Club': 'ஒரு Vibe Club-ஐத் தொடங்குங்கள்',
};

/** CTA label for the page language: explicit Tamil, then the dictionary, then the fallback pair. */
export const ctaLabelFor = (label, labelTa, lang, fallback) => {
  if (lang === 'ta') return joinTamilSuffix(labelTa || (label && CTA_TA[String(label).trim()]) || fallback);
  return label || fallback;
};
