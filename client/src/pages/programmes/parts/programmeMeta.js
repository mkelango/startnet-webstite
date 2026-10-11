import { joinTamilSuffix } from '../../../lib/i18n.jsx';

// Vocabularies for the programmes finder. Labels: Book 2 §4 (finder copy) and Book 1 Part B §10 (facets).
// Every entry carries `label` (English master) and `labelTa` (Tamil draft, Book 2 §14 register; native review pending,
// Book 2 Appendix A #14). Brand and programme names stay in Latin script. Read labels with `labelIn(item, lang)`.

export const LEVEL_NAMES = { 1: 'Aware', 2: 'Nurtured', 3: 'Skilled', 4: 'Building', 5: 'Launched', 6: 'Funded', 7: 'Scaling' };
// Same Tamil level names as the Founder Ledger (pages/mega/insights-ledger/ledgerShared.js).
export const LEVEL_NAMES_TA = {
  1: 'அறிமுகம்', 2: 'வளர்க்கப்பட்டவர்', 3: 'திறன் பெற்றவர்', 4: 'உருவாக்குபவர்', 5: 'தொடங்கியவர்', 6: 'நிதி பெற்றவர்', 7: 'விரிவடைபவர்',
};
export const levelName = (n, lang = 'en') => (lang === 'ta' ? LEVEL_NAMES_TA[n] : LEVEL_NAMES[n]) || LEVEL_NAMES[n] || '';
export const levelIndex = (l) => {
  const n = parseInt(String(l || '').replace(/[^0-9]/g, ''), 10);
  return Number.isFinite(n) ? n : 0;
};
export const levelCode = (l) => (l ? `L${levelIndex(l)}` : '');

/** The Tamil label of a vocabulary entry on /ta pages, the English label otherwise. */
export const labelIn = (item, lang = 'en') => (item ? (lang === 'ta' && item.labelTa ? item.labelTa : item.label) : '');

/**
 * A bilingual field from API data: `pickLang(p, 'summary', 'ta')` returns `p.summaryTa` when present,
 * otherwise `p.summary` (English fallback until the native Tamil copy is supplied).
 */
export function pickLang(obj, key, lang = 'en') {
  if (!obj) return undefined;
  if (lang === 'ta') {
    const ta = obj[`${key}Ta`];
    if (ta != null && ta !== '' && !(Array.isArray(ta) && !ta.length)) return ta;
  }
  return obj[key];
}

const TALENT = ['research', 'vibe', 'connect', 'women'];

/** Finder step 1: "I am…" (Book 2 §4). Maps a talent pool to the brands that serve it. */
export const PERSONAS = [
  { value: 'student', label: 'A college student', labelTa: 'கல்லூரி மாணவர்', brands: ['vibe'] },
  {
    value: 'scholar',
    label: 'A PhD scholar, post-doc or faculty member',
    labelTa: 'முனைவர் பட்ட ஆய்வாளர், முதுமுனைவர் ஆய்வாளர் அல்லது பேராசிரியர்',
    brands: ['research'],
  },
  { value: 'professional', label: 'A working professional', labelTa: 'பணியில் உள்ள தொழில்முறையாளர்', brands: ['connect'] },
  { value: 'woman', label: 'A woman building or planning a business', labelTa: 'தொழில் தொடங்கும் அல்லது திட்டமிடும் பெண்', brands: ['women'] },
  { value: 'startup', label: 'A founder with a startup', labelTa: 'ஸ்டார்ட்அப் வைத்திருக்கும் நிறுவனர்', minExit: 5 },
];

export function personaMatch(p, value) {
  const persona = PERSONAS.find((x) => x.value === value);
  if (!persona) return true;
  // Seeded programmes carry explicit talent pools (Book 1 Part B §10 `pool`); fall back to brand mapping.
  if (Array.isArray(p.pools) && p.pools.length) return p.pools.includes(value);
  if (persona.minExit) return levelIndex(p.stageExit) >= persona.minExit;
  // All-brand programmes (StartNet, StartNet X) fit every talent pool
  return persona.brands.includes(p.brand) || !TALENT.includes(p.brand);
}

/** Finder step 2: "Right now I…" (Book 2 §4), coded to ladder ranges (Book 1 Part B §10 stage labels). */
export const STAGES = [
  { value: 'l1-l2', label: 'Want to explore ideas', labelTa: 'யோசனைகளை ஆராய விரும்புகிறேன்', hint: 'L1–L2', range: [1, 2] },
  { value: 'l2-l3', label: 'Have an idea and want to test it', labelTa: 'ஒரு யோசனை உள்ளது, அதைச் சோதிக்க விரும்புகிறேன்', hint: 'L2–L3', range: [2, 3] },
  { value: 'l4', label: 'Have a prototype or a team', labelTa: 'முன்மாதிரி அல்லது குழு உள்ளது', hint: 'L4', range: [4, 4] },
  { value: 'l5', label: 'Have a registered company', labelTa: 'பதிவு செய்த நிறுவனம் உள்ளது', hint: 'L5', range: [5, 5] },
  {
    value: 'l6-l7',
    label: 'Am raising money or looking for customers',
    labelTa: 'முதலீடு திரட்டுகிறேன் அல்லது வாடிக்கையாளர்களைத் தேடுகிறேன்',
    hint: 'L6–L7',
    range: [6, 7],
  },
];

export function stageMatch(p, value) {
  const s = STAGES.find((x) => x.value === value);
  if (!s) return true;
  const a = levelIndex(p.stageEntry) || 1;
  const b = levelIndex(p.stageExit) || a;
  return a <= s.range[1] && b >= s.range[0];
}

/** "What do you need next?" — the four needs, mapped to the ladder (Book 1 line 990 and the mega menu). */
export const NEEDS = [
  { value: 'learn', label: 'Learn to build', labelTa: 'உருவாக்கக் கற்றுக்கொள்ள', from: 1, to: 3 },
  { value: 'start', label: 'Start a company', labelTa: 'நிறுவனம் தொடங்க', from: 3, to: 5 },
  { value: 'raise', label: 'Raise money', labelTa: 'முதலீடு திரட்ட', from: 5, to: 6 },
  { value: 'customers', label: 'Find customers and peers', labelTa: 'வாடிக்கையாளர்களையும் சக நிறுவனர்களையும் கண்டறிய', from: 4, to: 7 },
];

export const STATUS = [
  { value: 'open', label: 'Open now', labelTa: 'இப்போது திறந்துள்ளது' },
  { value: 'closing', label: 'Closing soon', labelTa: 'விரைவில் முடிகிறது' },
  { value: 'rolling', label: 'Rolling', labelTa: 'தொடர்ச்சியானது' },
  { value: 'upcoming', label: 'Opening soon', labelTa: 'விரைவில் திறக்கிறது' },
  { value: 'closed', label: 'Closed', labelTa: 'முடிந்தது' },
];
export const STATUS_ORDER = { open: 0, closing: 1, rolling: 2, upcoming: 3, closed: 4 };

/**
 * One definition of "accepting applications" for Home (F-40), Search (F-90), OpenCalls (F-95) and /programmes:
 * a call is accepting while it is closing soon, open, or rolling.
 */
export const ACCEPTING = ['closing', 'open', 'rolling'];
export const isAccepting = (p) => !!p && ACCEPTING.includes(p.status);
const CALL_ORDER = { closing: 0, open: 1, rolling: 2 };
/** Open-calls order: closing > open > rolling, then soonest apply-by date (undated last), then title. */
export function sortCalls(a, b) {
  const oa = CALL_ORDER[a.status] ?? 3;
  const ob = CALL_ORDER[b.status] ?? 3;
  if (oa !== ob) return oa - ob;
  const da = a.applyBy ? Date.parse(a.applyBy) : NaN;
  const db = b.applyBy ? Date.parse(b.applyBy) : NaN;
  const va = Number.isFinite(da) ? da : Infinity;
  const vb = Number.isFinite(db) ? db : Infinity;
  if (va !== vb) return va - vb;
  return String(a.title || '').localeCompare(String(b.title || ''));
}

export const FORMATS = [
  { value: 'in-person', label: 'In person', labelTa: 'நேரில்' },
  { value: 'online', label: 'Online', labelTa: 'ஆன்லைன்' },
  { value: 'hybrid', label: 'Hybrid', labelTa: 'நேரிலும் ஆன்லைனிலும்' },
];

export const LANGUAGES = [
  { value: 'en', label: 'English', labelTa: 'ஆங்கிலம்' },
  { value: 'ta', label: 'தமிழ் (Tamil)', labelTa: 'தமிழ்' },
];

export const PRICES = [
  { value: 'free', label: 'Free', labelTa: 'இலவசம்' },
  { value: 'sponsored', label: 'Sponsored seats', labelTa: 'நிதியுதவி இடங்கள்' },
  { value: 'paid', label: 'Paid', labelTa: 'கட்டணம் உண்டு' },
];
const PRICE_ORDER = { free: 0, sponsored: 1, paid: 2 };

export const BRAND_LABELS = { research: 'Research', vibe: 'Vibe', connect: 'Connect', women: 'Women', x: 'StartNet X', startnet: 'All-brand' };
export const BRAND_LABELS_TA = { startnet: 'அனைத்து பிராண்டுகளும்' };
export const brandLabel = (b, lang = 'en') => (lang === 'ta' && BRAND_LABELS_TA[b]) || BRAND_LABELS[b] || b;

/** Label for a value in a vocabulary list; unknown values come back unchanged. */
export const labelOf = (list, v, lang = 'en') => {
  const item = list.find((x) => x.value === v);
  return item ? labelIn(item, lang) : v;
};

/** Free ones first (Book 2 §4), closed calls last, then soonest deadline. */
export function sortProgrammes(a, b) {
  const ca = a.status === 'closed' ? 1 : 0;
  const cb = b.status === 'closed' ? 1 : 0;
  if (ca !== cb) return ca - cb;
  const pa = PRICE_ORDER[a.price] ?? 3;
  const pb = PRICE_ORDER[b.price] ?? 3;
  if (pa !== pb) return pa - pb;
  const sa = STATUS_ORDER[a.status] ?? 5;
  const sb = STATUS_ORDER[b.status] ?? 5;
  if (sa !== sb) return sa - sb;
  const da = a.applyBy ? Date.parse(a.applyBy) : Infinity;
  const db = b.applyBy ? Date.parse(b.applyBy) : Infinity;
  if (da !== db) return da - db;
  return String(a.title).localeCompare(String(b.title));
}

/** Predicates for every URL facet on /programmes. */
export const PROGRAMME_PREDS = {
  pool: personaMatch,
  stage: stageMatch,
  need: (p, v) => p.need === v,
  brand: (p, v) => p.brand === v,
  status: (p, v) => p.status === v,
  format: (p, v) => p.format === v,
  language: (p, v) => (Array.isArray(p.languages) ? p.languages.includes(v) : p.languages === v),
  price: (p, v) => p.price === v,
};
export const PROGRAMME_KEYS = Object.keys(PROGRAMME_PREDS);

/** Allowed URL values per /programmes facet (useFacetParams drops anything else, F-68). */
export const PROGRAMME_VOCAB = {
  pool: PERSONAS.map((x) => x.value),
  stage: STAGES.map((x) => x.value),
  need: NEEDS.map((x) => x.value),
  brand: Object.keys(BRAND_LABELS),
  status: STATUS.map((x) => x.value),
  format: FORMATS.map((x) => x.value),
  language: LANGUAGES.map((x) => x.value),
  price: PRICES.map((x) => x.value),
};

/**
 * Programme index (Book 2 §4, crawlable table under the finder). `cost.tag` renders a TagChip.
 * `*Ta` fields are Tamil drafts (native review pending); names stay in Latin script.
 */
export const PROGRAMME_INDEX = [
  { name: 'Vibe Campus', brand: 'vibe', for: 'Students', forTa: 'மாணவர்கள்', length: 'Single events', lengthTa: 'ஒற்றை நிகழ்வுகள்', cost: { text: 'Free', textTa: 'இலவசம்' }, fallback: '/vibe/campus' },
  { name: 'Vibe Clubs', brand: 'vibe', for: 'Students', forTa: 'மாணவர்கள்', length: 'Ongoing', lengthTa: 'தொடர்ச்சியாக', cost: { text: 'Free', textTa: 'இலவசம்' }, fallback: '/vibe/clubs' },
  {
    name: 'Vibathon', brand: 'vibe', for: 'Student teams', forTa: 'மாணவர் குழுக்கள்',
    length: 'Qualifiers + state finale', lengthTa: 'தகுதிச் சுற்றுகள் + மாநில இறுதிப் போட்டி',
    cost: { text: 'Free to ₹499 per team', textTa: 'இலவசம் முதல் ஒரு குழுவுக்கு ₹499 வரை', tag: 'C' }, fallback: '/vibe/vibathon',
  },
  {
    name: 'Vibe Academy', brand: 'vibe', for: 'Students, early builders', forTa: 'மாணவர்கள், தொடக்க நிலை உருவாக்குநர்கள்',
    length: 'Self-paced or cohort', lengthTa: 'சுய வேகத்தில் அல்லது குழுவாக',
    cost: { text: 'Free starter; paid from ₹999', textTa: 'தொடக்கம் இலவசம்; கட்டணத் திட்டம் ₹999 முதல்', tag: 'C' }, fallback: '/vibe/academy',
  },
  {
    name: 'Vibe Launchpad', brand: 'vibe', for: 'Student teams with a prototype', forTa: 'முன்மாதிரி உள்ள மாணவர் குழுக்கள்',
    length: '12 weeks', lengthTa: '12 வாரங்கள்',
    cost: { text: 'Sponsored seats', textTa: 'நிதியுதவி இடங்கள்', placeholder: '[placeholder]' }, fallback: '/vibe/launchpad',
  },
  {
    name: 'Scholar Founders Fellowship', brand: 'research', for: 'Scholars, faculty', forTa: 'ஆய்வாளர்கள், பேராசிரியர்கள்',
    length: '7 weeks', lengthTa: '7 வாரங்கள்',
    cost: { text: 'Sponsored seats', textTa: 'நிதியுதவி இடங்கள்', placeholder: '[placeholder]' }, fallback: '/research/fellowship',
  },
  {
    name: 'StartNet Labs', brand: 'research', for: 'Scholars, faculty', forTa: 'ஆய்வாளர்கள், பேராசிரியர்கள்',
    length: 'Ongoing', lengthTa: 'தொடர்ச்சியாக', cost: { text: 'By selection', textTa: 'தேர்வின் அடிப்படையில்' }, fallback: '/research/labs',
  },
  {
    name: 'Founder Switch', brand: 'connect', for: 'Professionals', forTa: 'தொழில்முறையாளர்கள்', length: '12 weeks', lengthTa: '12 வாரங்கள்',
    cost: { placeholder: '[placeholder — rate card]', placeholderTa: '[placeholder — கட்டண அட்டவணை]' }, fallback: '/connect/founder-switch',
  },
  {
    name: 'Connect Circles', brand: 'connect', for: 'Founders', forTa: 'நிறுவனர்கள்', length: 'Annual', lengthTa: 'ஆண்டுதோறும்',
    cost: { text: 'From ₹30,000/yr', textTa: 'ஆண்டுக்கு ₹30,000 முதல்', tag: 'C' }, fallback: '/connect/circles',
  },
  {
    name: 'Scale Connect', brand: 'connect', for: 'Startups past first revenue', forTa: 'முதல் வருவாயைத் தாண்டிய ஸ்டார்ட்அப்கள்',
    length: 'Ongoing', lengthTa: 'தொடர்ச்சியாக', cost: { text: 'With StartNet X Scale', textTa: 'StartNet X Scale உடன்' }, fallback: '/connect/scale',
  },
  {
    name: 'Women Circles', brand: 'women', for: 'Women founders', forTa: 'பெண் நிறுவனர்கள்', length: 'Annual', lengthTa: 'ஆண்டுதோறும்',
    cost: { text: 'From ₹10,000/yr', textTa: 'ஆண்டுக்கு ₹10,000 முதல்', tag: 'C' }, fallback: '/women/circles',
  },
  {
    name: 'Rise Academy', brand: 'women', for: 'Women founders and owners', forTa: 'பெண் நிறுவனர்கள், தொழில் உரிமையாளர்கள்',
    length: 'App-led + mentor', lengthTa: 'செயலி வழி + வழிகாட்டி',
    cost: { text: 'Subsidised', textTa: 'மானிய விலையில்', placeholder: '[placeholder]' }, fallback: '/women/rise-academy',
  },
  {
    name: 'HerCapital', brand: 'women', for: 'Women founders raising', forTa: 'முதலீடு திரட்டும் பெண் நிறுவனர்கள்',
    length: 'Review + support', lengthTa: 'மதிப்பாய்வு + ஆதரவு',
    cost: { placeholder: '[placeholder — rate card]', placeholderTa: '[placeholder — கட்டண அட்டவணை]' }, fallback: '/women/hercapital',
  },
];

/**
 * Tamil drafts for short seeded programme fields, used only when the API has no `<field>Ta` value yet
 * (exact-match lookup; anything not listed renders in English with lang="en"). Native review pending.
 */
export const DATA_TA = {
  // CTA labels (Book 2 §14.3 where listed)
  'Apply now': 'இப்போதே விண்ணப்பியுங்கள்',
  'Register your team': 'உங்கள் குழுவைப் பதிவு செய்யுங்கள்',
  'Register interest': 'ஆர்வத்தைப் பதிவு செய்யுங்கள்',
  'Browse courses': 'பாடநெறிகளைப் பாருங்கள்',
  'Host Vibe Campus': 'Vibe Campus நடத்துங்கள்',
  'Apply to Launchpad': 'Launchpad-க்கு விண்ணப்பியுங்கள்',
  'Start a Vibe Club': 'Vibe Club தொடங்குங்கள்',
  'Apply for the next cohort': 'அடுத்த குழுவுக்கு விண்ணப்பியுங்கள்',
  'Book a consultation': 'ஆலோசனைக்கு நேரம் பதிவு செய்யுங்கள்',
  'Register for the next event': 'அடுத்த நிகழ்வுக்குப் பதிவு செய்யுங்கள்',
  'Apply to a Circle': 'ஒரு Circle-க்கு விண்ணப்பியுங்கள்',
  'Apply to Scale Connect': 'Scale Connect-க்கு விண்ணப்பியுங்கள்',
  'Register interest as an angel': 'ஏஞ்சல் முதலீட்டாளராக ஆர்வத்தைப் பதிவு செய்யுங்கள்',
  'Join a Circle': 'ஒரு Circle-இல் சேருங்கள்',
  'Start Rise Academy': 'Rise Academy-ஐத் தொடங்குங்கள்',
  'Book a readiness review': 'தயார்நிலை மதிப்பாய்வுக்கு நேரம் பதிவு செய்யுங்கள்',
  'Check eligibility': 'தகுதியைச் சரிபாருங்கள்',
  // Durations
  'District qualifiers + state finale': 'மாவட்டத் தகுதிச் சுற்றுகள் + மாநில இறுதிப் போட்டி',
  'Self-paced or cohort': 'சுய வேகத்தில் அல்லது குழுவாக',
  'Single events': 'ஒற்றை நிகழ்வுகள்',
  '12 weeks': '12 வாரங்கள்',
  '7 weeks': '7 வாரங்கள்',
  Ongoing: 'தொடர்ச்சியாக',
  'Annual event': 'ஆண்டு நிகழ்வு',
  'Annual flagship': 'ஆண்டு முதன்மை நிகழ்வு',
  Annual: 'ஆண்டுதோறும்',
  'Year-round': 'ஆண்டு முழுவதும்',
  '12 weeks, evenings and weekends': '12 வாரங்கள், மாலை நேரங்களும் வார இறுதிகளும்',
  'App-led + mentor': 'செயலி வழி + வழிகாட்டி',
  'Review + support': 'மதிப்பாய்வு + ஆதரவு',
  // Audiences
  'Student teams': 'மாணவர் குழுக்கள்',
  'Students, early builders': 'மாணவர்கள், தொடக்க நிலை உருவாக்குநர்கள்',
  Students: 'மாணவர்கள்',
  'Student teams with a prototype': 'முன்மாதிரி உள்ள மாணவர் குழுக்கள்',
  'Scholars, faculty': 'ஆய்வாளர்கள், பேராசிரியர்கள்',
  'Lab teams, GCCs, investors, government': 'ஆய்வகக் குழுக்கள், GCC-கள், முதலீட்டாளர்கள், அரசு',
  'Universities and colleges': 'பல்கலைக்கழகங்கள், கல்லூரிகள்',
  'Professionals, founders': 'தொழில்முறையாளர்கள், நிறுவனர்கள்',
  Professionals: 'தொழில்முறையாளர்கள்',
  Founders: 'நிறுவனர்கள்',
  'Startups past first revenue': 'முதல் வருவாயைத் தாண்டிய ஸ்டார்ட்அப்கள்',
  'Eligible investors': 'தகுதியுள்ள முதலீட்டாளர்கள்',
  'Women founders': 'பெண் நிறுவனர்கள்',
  'Women founders and owners': 'பெண் நிறுவனர்கள், தொழில் உரிமையாளர்கள்',
  'Women founders raising': 'முதலீடு திரட்டும் பெண் நிறுவனர்கள்',
  'L4–L5 founders': 'L4–L5 நிறுவனர்கள்',
  // Endorsement, short status and price notes
  'a StartNet Vibe programme': 'ஒரு StartNet Vibe திட்டம்',
  'By selection': 'தேர்வின் அடிப்படையில்',
  'Launching 2027.': '2027-இல் தொடங்குகிறது.',
  'Planned (Phase 3).': 'திட்டமிடப்பட்டுள்ளது (கட்டம் 3).',
  'StartNet Angels is not yet open for investment.': 'StartNet Angels இன்னும் முதலீட்டுக்குத் திறக்கப்படவில்லை.',
  '[placeholder — rate card]': '[placeholder — கட்டண அட்டவணை]',
  '[placeholder — to be supplied by StartNet]': '[placeholder — StartNet வழங்கும்]',
};

/**
 * A programme field for the current language: `<field>Ta` from the API, then a DATA_TA draft for short
 * seeded strings, then English. Returns { text, en } where `en` is true when the English fallback is used.
 */
export function programmeField(p, key, lang = 'en') {
  const en = p ? p[key] : undefined;
  if (lang !== 'ta' || en == null || en === '') return { text: en, en: false };
  const ta = p[`${key}Ta`];
  // Keep "Circle-இல்" together (U+2011), as t() and pickLang() do for all other Tamil copy.
  const j = (v) => (Array.isArray(v) ? v.map(joinTamilSuffix) : joinTamilSuffix(v));
  if (ta != null && ta !== '' && !(Array.isArray(ta) && !ta.length)) return { text: j(ta), en: false };
  if (typeof en === 'string' && DATA_TA[en]) return { text: j(DATA_TA[en]), en: false };
  return { text: en, en: true };
}
