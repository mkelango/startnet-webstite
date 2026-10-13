// Vocabularies and predicates for /events (Book 1 Part B §10: when · district · format · brand · series · language · price).
import { daysUntil, eventDateRange } from './eventTime.js';
import { labelize } from '../../programmes/parts/facets.js';

// Every vocabulary entry carries `label` (English master) and `ta` (Tamil draft, Book 2 §14 —
// native review pending). Pages read them through loc(t, entry) so English stays the fallback.
export const loc = (t, o) => (o ? t(o.label, o.ta) : '');

export const WHEN = [
  { value: 'week', label: 'This week', ta: 'இந்த வாரம்', days: 7 },
  { value: 'month', label: 'This month', ta: 'இந்த மாதம்', days: 31 },
  { value: 'quarter', label: 'Next 3 months', ta: 'அடுத்த 3 மாதங்கள்', days: 92 },
];

export const EVENT_FORMATS = [
  { value: 'in-person', label: 'In person', ta: 'நேரில்' },
  { value: 'online', label: 'Online', ta: 'ஆன்லைன்' },
  { value: 'hybrid', label: 'Hybrid', ta: 'நேரிலும் ஆன்லைனிலும்' },
];
/** { 'in-person': 'In person', … } — English map kept for existing importers. */
export const FORMAT_LABELS = Object.fromEntries(EVENT_FORMATS.map((f) => [f.value, f]));
export const formatLabel = (t, v) => (FORMAT_LABELS[v] ? loc(t, FORMAT_LABELS[v]) : labelize(v) || '');

export const EVENT_LANGS = { en: 'English', ta: 'தமிழ் (Tamil)', bilingual: 'English & தமிழ்' };
const EVENT_LANGS_TA = { en: 'ஆங்கிலம்', ta: 'தமிழ்', bilingual: 'ஆங்கிலம் & தமிழ்' };
export const langLabel = (t, v) => t(EVENT_LANGS[v] || v, EVENT_LANGS_TA[v]);
export const EVENT_PRICES = [
  { value: 'free', label: 'Free', ta: 'இலவசம்' },
  { value: 'paid', label: 'Paid', ta: 'கட்டணம் உண்டு' },
];
export const SEATS = { available: 'Open', few: 'Few seats left', full: 'Waitlist' };
const SEATS_TA = { available: 'இடங்கள் உள்ளன', few: 'சில இடங்களே உள்ளன', full: 'காத்திருப்புப் பட்டியல்' };
export const seatsLabel = (t, v) => t(SEATS[v] || v, SEATS_TA[v]);
export const BRAND_NAMES = { research: 'Research', vibe: 'Vibe', connect: 'Connect', women: 'Women', x: 'StartNet X', startnet: 'All-brand' };
/** Brand names stay Latin; only the generic "All-brand" is translated. */
export const brandLabel = (t, b) => (b === 'startnet' ? t('All-brand', 'அனைத்து பிராண்டுகளும்') : BRAND_NAMES[b] || b);

/** Field in the page language: e.titleTa / e.summaryTa / e.dateLabelTa / e.cityTa when the API supplies them. */
export const pickLang = (e, key, lang) => (lang === 'ta' && e && e[`${key}Ta`]) || (e ? e[key] : undefined);

/** Join "a · b · c" with a no-break space before each dot, so a wrapped line never starts with "·". */
const NBSP = String.fromCharCode(0xa0);
export const nbDots = (s) => (typeof s === 'string' ? s.replace(/ ·/g, `${NBSP}·`) : s);

export const EVENT_PREDS = {
  when: (e, v) => {
    const w = WHEN.find((x) => x.value === v);
    if (!w) return true;
    const d = daysUntil(e.date);
    return d > -1 && d <= w.days;
  },
  // Case-insensitive: /districts links pass display names ("Chennai"), the feed stores slugs or names.
  district: (e, v) => {
    const want = String(v || '').trim().toLowerCase();
    if (e.format === 'online') return want === 'online';
    const norm = (s) => String(s || '').trim().toLowerCase().replace(/\s+/g, '-');
    return !!e.district && (norm(e.district) === norm(want) || norm(e.city) === norm(want));
  },
  format: (e, v) => e.format === v,
  brand: (e, v) => e.brand === v,
  series: (e, v) => e.series === v,
  language: (e, v) => e.language === v || (v !== 'bilingual' && e.language === 'bilingual'),
  price: (e, v) => e.price === v,
};
export const EVENT_KEYS = Object.keys(EVENT_PREDS);

const ts = (e) => {
  const t = Date.parse(e?.date);
  return Number.isNaN(t) ? Infinity : t;
};
/** Soonest first; undated last. */
export const byDate = (a, b) => {
  const x = ts(a);
  const y = ts(b);
  return x === y ? 0 : x - y;
};

/** Flagships strip (Book 2 §5.1). `series` finds the current edition in the events feed. */
export const FLAGSHIPS = [
  { key: 'vibathon', name: 'Vibathon', brand: 'vibe', to: '/vibe/vibathon', series: 'vibathon' },
  { key: 'l2m', name: 'Lab-to-Market Summit', brand: 'research', to: '/research/lab-to-market-summit', series: 'lab-to-market-summit' },
  { key: 'wfs', name: 'Women Founders Summit & Awards', brand: 'women', to: '/women/summit', series: 'women-founders-summit' },
  { key: 'fday', name: 'StartNet Founders Day', brand: null, proposed: true, note: 'All-brand annual show', noteTa: 'அனைத்து பிராண்டுகளின் ஆண்டு நிகழ்வு', series: 'founders-day' },
];

/** The flagship edition in the feed: prefer the main edition (slug = series-edition) over qualifiers. */
export function flagshipEdition(events, series) {
  const list = events.filter((e) => e.series === series && e.status !== 'past');
  return list.find((e) => e.edition && e.slug === `${series}-${e.edition}`) || list[0] || null;
}

export const SERIES_LABELS = {
  vibathon: 'Vibathon', 'vibe-campus': 'Vibe Campus', 'vibe-summit': 'Vibe Summit', 'genai-connect': 'GenAI Connect',
  'saas-connect': 'SaaS Connect', 'd2c-connect': 'D2C Connect', 'lab-to-market-summit': 'Lab-to-Market Summit',
  'women-founders-summit': 'Women Founders Summit', 'investors-summit': 'Investors Summit', 'founders-day': 'StartNet Founders Day',
  // Oct 2026 archive and Connect line-up (docs/research/*.md)
  'agentic-ai-connect': 'Agentic AI Connect', 'physical-ai-connect': 'Physical AI Connect', 'vibe-coding-summit': 'Vibe Coding Summit',
  'nirf-higher-ed-summit': 'NIRF Higher Ed Summit', 'network-meetings': 'StartNet network meetings', 'research-days': 'Research Days',
};
export const seriesLabel = (s) => SERIES_LABELS[s] || labelize(s);

/** Seeded dates may be provisional: show the CMS date label until a date is confirmed. */
export const isConfirmed = (e) => e.dateConfirmed !== false && !!e.date;
export const dateText = (e) => (isConfirmed(e) ? eventDateRange(e.date, e.endDate) : e.dateLabel || 'Dates soon');
/** dateText in the page language (Tamil month names with Latin digits; dateLabelTa when supplied), dots kept on one line. */
export const dateTextFor = (e, t, lang) =>
  nbDots(isConfirmed(e) ? eventDateRange(e.date, e.endDate, lang) : pickLang(e, 'dateLabel', lang) || t('Dates soon', 'தேதிகள் விரைவில்'));
