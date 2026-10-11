// StartNet Connect — page-local data. Copy is Book 2 §3.3 verbatim where it exists.
import { snxLink } from '../../../lib/links.js';
import { formatDateShort } from '../../../lib/format.js';
import { dateTextFor, isConfirmed, pickLang } from '../../events/parts/eventMeta.js';

/* ---------- Event display helpers: seeded dates are provisional, places may be placeholders ---------- */
const isPlaceholder = (v) => typeof v === 'string' && /placeholder|to be confirmed|^\[.*\]$/i.test(v.trim());
/** "15 May" only for confirmed dates; otherwise the CMS date label ("May–June 2027 · date to be confirmed",
 *  dateLabelTa on /ta), else `dates`. Pass `lang` so Tamil pages get Tamil month names and labels. */
export function eventWhen(e, { short = false, dates = 'Dates soon', lang = 'en' } = {}) {
  if (!e) return '';
  if (isConfirmed(e)) return short ? formatDateShort(e.date, lang) : dateTextFor(e, () => dates, lang);
  // Tamil pages never fall back to the English CMS label: without dateLabelTa they show `dates` ("தேதிகள் விரைவில்").
  const label = lang === 'ta' ? e.dateLabelTa : e.dateLabel;
  return label && !/placeholder|^\[/i.test(label.trim()) ? label : dates;
}
/** City (or district) with placeholder values dropped, in the page language (cityTa / districtTa); '' when nothing real is known. */
export function eventPlace(e, lang = 'en') {
  if (!e) return '';
  return [pickLang(e, 'city', lang), pickLang(e, 'district', lang)].find((v) => v && !isPlaceholder(v)) || '';
}

/* ---------- Connect Series: nine sector communities (Book 2 §3.3 table) ---------- */
// `since`: year of the first edition on record (server/data/events.json; mega/events-series/seriesData.js).
// *Ta fields are drafts (Book 2 §14 status: native Tamil review pending). Brand and programme names stay Latin.
export const SECTORS = [
  { slug: 'genai', short: 'GenAI', name: 'GenAI Connect', status: 'running', since: '2024', summary: 'For builders shipping generative and agentic AI into real products, including for GCCs.', summaryTa: 'GCC-கள் உட்பட, உண்மையான தயாரிப்புகளில் ஜெனரேட்டிவ் மற்றும் ஏஜென்டிக் AI-ஐக் கொண்டுவரும் உருவாக்குநர்களுக்கு.' },
  { slug: 'saas', short: 'SaaS', name: 'SaaS Connect', status: 'running', since: '2025', summary: 'For early-stage and Tier 2 SaaS founders finding their first 100 customers.', summaryTa: 'தங்கள் முதல் 100 வாடிக்கையாளர்களைத் தேடும் தொடக்கநிலை மற்றும் இரண்டாம் நிலை நகர SaaS நிறுவனர்களுக்கு.' },
  { slug: 'd2c', short: 'D2C', name: 'D2C Connect', status: 'running', since: '2024', summary: 'For consumer brands selling direct, from Tamil Nadu to the world.', summaryTa: 'தமிழ்நாட்டிலிருந்து உலகம் முழுவதும் நேரடியாக விற்கும் நுகர்வோர் பிராண்டுகளுக்கு.' },
  { slug: 'deeptech', short: 'DeepTech', name: 'DeepTech Connect', status: 'new-2027', summary: 'For founders building on hard science and engineering IP.', summaryTa: 'அடிப்படை அறிவியல் மற்றும் பொறியியல் அறிவுசார் சொத்தின் மீது நிறுவனம் கட்டும் நிறுவனர்களுக்கு.' },
  { slug: 'fintech', short: 'FinTech', name: 'FinTech Connect', status: 'new-2027', summary: 'For founders building payments, lending, insurance and compliance products.', summaryTa: 'பணப்பரிமாற்றம், கடன், காப்பீடு மற்றும் இணக்கத் தயாரிப்புகளை உருவாக்கும் நிறுவனர்களுக்கு.' },
  { slug: 'industry-4-0', short: 'Industry 4.0', name: 'Industry 4.0 Connect', status: 'new-2027', summary: "For founders selling into Tamil Nadu's manufacturing base: automation, IoT and quality.", summaryTa: 'தமிழ்நாட்டின் உற்பத்தித் துறைக்கு விற்கும் நிறுவனர்களுக்கு: தானியக்கம், IoT மற்றும் தரம்.' },
  { slug: 'healthtech', short: 'HealthTech', name: 'HealthTech Connect', status: 'proposed', summary: 'For founders in diagnostics, care delivery and health data.', summaryTa: 'நோய் கண்டறிதல், சிகிச்சை வழங்கல் மற்றும் சுகாதாரத் தரவுத் துறை நிறுவனர்களுக்கு.' },
  { slug: 'agrifood', short: 'AgriFood', name: 'AgriFood Connect', status: 'proposed', summary: 'For founders in farm technology, food processing and supply chains.', summaryTa: 'வேளாண் தொழில்நுட்பம், உணவு பதப்படுத்துதல் மற்றும் விநியோகச் சங்கிலித் துறை நிறுவனர்களுக்கு.' },
  { slug: 'climate', short: 'Climate', name: 'Climate Connect', status: 'proposed', summary: 'For founders in energy, EV, materials and circular economy.', summaryTa: 'ஆற்றல், மின்வாகனம், பொருட்கள் மற்றும் சுழற்சிப் பொருளாதாரத் துறை நிறுவனர்களுக்கு.' },
];

/** Every sector slug (/connect/<slug>), for the server's known-route list (F-97). */
export const SECTOR_SLUGS = SECTORS.map((s) => s.slug);
/** Connect sub-pages built in ConnectSub.jsx (sector pages are SECTOR_SLUGS). */
export const CONNECT_PAGE_SLUGS = ['series', 'circles', 'founder-switch', 'scale', 'angels'];
/** /connect/<slug> paths that redirect to a filtered list elsewhere. */
export const CONNECT_REDIRECTS = { events: '/events?brand=connect', stories: '/insights/stories?brand=connect' };

/** Own-property lookup: never resolves an inherited member such as "constructor" or "__proto__" (F-60). */
export const own = (obj, key) => (typeof key === 'string' && Object.prototype.hasOwnProperty.call(obj, key) ? obj[key] : undefined);

export const SECTOR_FILTERS = [
  { id: 'all', label: 'All sectors', labelTa: 'அனைத்துத் துறைகள்' },
  { id: 'running', label: 'Running now', labelTa: 'இப்போது நடப்பவை' },
  { id: 'new-2027', label: 'New in 2027', labelTa: '2027-இல் புதியவை' },
  { id: 'proposed', label: 'Proposed', labelTa: 'முன்மொழியப்பட்டவை' },
];

export const sectorBySlug = (slug) => (typeof slug === 'string' ? SECTORS.find((s) => s.slug === slug) : undefined);

const norm = (s) => (s || '').toLowerCase().replace(/[^a-z0-9]/g, '');

/** Upcoming events (already sorted by date) that belong to a sector's series. */
export function eventsForSector(events, sector) {
  if (!Array.isArray(events) || !sector) return [];
  const key = norm(sector.short);
  const name = norm(sector.name);
  return events.filter((e) => {
    const series = norm(e.series);
    return (series && (series === key || series.startsWith(key + 'connect') || series === name)) || norm(e.title).includes(name);
  });
}

/* ---------- Professional-to-founder path (Book 2 §3.3) ---------- */
export const PATH_STEPS = [
  { title: 'Attend', titleTa: 'பங்கேற்கவும்', body: 'A sector Connect.', bodyTa: 'ஒரு துறை Connect.' },
  { title: 'Explore', titleTa: 'ஆராயவும்', body: 'Founder Switch.', bodyTa: 'Founder Switch.' },
  { title: 'Team', titleTa: 'குழு', body: 'Co-founder matching.', bodyTa: 'இணை நிறுவனர் பொருத்தம்.' },
  { title: 'Leap', titleTa: 'பாய்ச்சல்', body: 'Angels, a first pilot.', bodyTa: 'Angels, முதல் பைலட்.' },
  { title: 'Grow', titleTa: 'வளரவும்', body: 'Circles, Scale Connect.', bodyTa: 'Circles, Scale Connect.' },
];

/* ---------- Founder Switch: the four things the 12 weeks are for (Book 2 §3.3 body) ---------- */
// U+2011 (non-breaking hyphen) keeps "Co‑founder" on one line in the narrow stage buttons.
export const SWITCH_STEPS = [
  {
    id: 'validate', label: 'Validate', labelTa: 'சரிபார்', title: 'Validate the idea with customers.', titleTa: 'வாடிக்கையாளர்களுடன் யோசனையைச் சரிபாருங்கள்.',
    check: 'I have validated the idea with customers', checkTa: 'வாடிக்கையாளர்களுடன் யோசனையைச் சரிபார்த்துவிட்டேன்',
    body: 'Evenings and weekends, alongside your day job. Talk to the people who would pay before you build too much.',
    bodyTa: 'உங்கள் வேலையுடன் சேர்த்து, மாலை நேரங்களிலும் வார இறுதிகளிலும். அதிகம் உருவாக்கும் முன், பணம் செலுத்தக்கூடியவர்களிடம் பேசுங்கள்.',
  },
  {
    id: 'cofounder', label: 'Co‑founder', labelTa: 'இணை நிறுவனர்', title: 'Find or test a co-founder.', titleTa: 'இணை நிறுவனரைக் கண்டறியுங்கள் அல்லது சோதியுங்கள்.',
    check: 'I have found or tested a co-founder', checkTa: 'இணை நிறுவனரைக் கண்டறிந்துவிட்டேன் அல்லது சோதித்துவிட்டேன்',
    body: 'Founder Switch includes co-founder matching, so you can test working together before either of you leaves a job.',
    bodyTa: 'Founder Switch-இல் இணை நிறுவனர் பொருத்தமும் உண்டு; உங்களில் யாரும் வேலையை விடும் முன்பே சேர்ந்து பணியாற்றிச் சோதிக்கலாம்.',
  },
  {
    id: 'runway', label: 'Runway', labelTa: 'நிதி இருப்பு', title: 'Plan your financial runway.', titleTa: 'உங்கள் நிதி இருப்புக் காலத்தைத் திட்டமிடுங்கள்.',
    check: 'I have planned my financial runway', checkTa: 'என் நிதி இருப்புக் காலத்தைத் திட்டமிட்டுவிட்டேன்',
    body: 'Work out how long you can go without a salary, and what the company needs to earn before you jump.',
    bodyTa: 'சம்பளம் இல்லாமல் எவ்வளவு காலம் இருக்க முடியும், நீங்கள் முழுநேரமாக இறங்கும் முன் நிறுவனம் எவ்வளவு ஈட்ட வேண்டும் என்பதைக் கணக்கிடுங்கள்.',
  },
  { id: 'decide', label: 'Decide', labelTa: 'முடிவு', title: 'Finish with a decision you can defend.', titleTa: 'நீங்கள் நியாயப்படுத்தக்கூடிய ஒரு முடிவுடன் நிறைவு செய்யுங்கள்.' },
];

/* ---------- Scale Connect offers (Book 2 §3.3 body; anchors from Book 1 mega menu) ---------- */
export const SCALE_OFFERS = [
  { id: 'investor-days', title: 'Investor days', titleTa: 'முதலீட்டாளர் நாட்கள்', body: 'Curated investor days for startups past first revenue.', bodyTa: 'முதல் வருவாயைக் கடந்த ஸ்டார்ட்அப்களுக்குத் தேர்ந்தெடுக்கப்பட்ட முதலீட்டாளர் நாட்கள்.' },
  { id: 'pilot-days', title: 'Pilot days', titleTa: 'பைலட் நாட்கள்', body: 'Pilot matchmaking with GCCs and corporates.', bodyTa: 'GCC-கள் மற்றும் பெருநிறுவனங்களுடன் பைலட் பொருத்தம்.' },
  { id: 'procurement', title: 'Government procurement', titleTa: 'அரசுக் கொள்முதல்', body: 'Readiness for government procurement.', bodyTa: 'அரசுக் கொள்முதலுக்கான தயார்நிலை.' },
  { id: 'export', title: 'Export desks', titleTa: 'ஏற்றுமதி மையங்கள்', body: 'Export desks connected to Tamil diaspora networks.', bodyTa: 'உலகத் தமிழர் வலையமைப்புகளுடன் இணைந்த ஏற்றுமதி மையங்கள்.' },
];

/* ---------- Network graph: who meets whom through Connect ---------- */
export const NETWORK_GROUPS = [
  {
    id: 'professionals', label: 'Professionals', labelTa: 'தொழில் வல்லுநர்கள்', at: [150, 150], links: ['founders', 'mentors', 'gccs'],
    how: 'Professionals test an idea in Founder Switch, meet co-founders and, when the decision is go, become founders.',
    howTa: 'தொழில் வல்லுநர்கள் Founder Switch-இல் ஒரு யோசனையைச் சோதித்து, இணை நிறுவனர்களைச் சந்தித்து, முடிவு "தொடங்கலாம்" என்றால் நிறுவனர்கள் ஆகிறார்கள்.',
  },
  {
    id: 'founders', label: 'Founders', labelTa: 'நிறுவனர்கள்', at: [170, 390], links: ['professionals', 'mentors', 'gccs', 'investors'],
    how: 'Founders meet their sector in a Connect, refer business in a Circle and find customers and capital through Scale Connect.',
    howTa: 'நிறுவனர்கள் Connect-இல் தங்கள் துறையைச் சந்தித்து, Circle-இல் ஒருவருக்கொருவர் வணிகத்தைப் பரிந்துரைத்து, Scale Connect மூலம் வாடிக்கையாளர்களையும் முதலீட்டையும் கண்டறிகிறார்கள்.',
  },
  {
    id: 'mentors', label: 'Mentors', labelTa: 'வழிகாட்டிகள்', at: [420, 110], links: ['professionals', 'founders'],
    how: 'Mentors and experienced founders meet the next founders at sector Connects and in Circles.',
    howTa: 'வழிகாட்டிகளும் அனுபவமிக்க நிறுவனர்களும் துறை Connect-களிலும் Circles-இலும் அடுத்த நிறுவனர்களைச் சந்திக்கிறார்கள்.',
  },
  {
    id: 'gccs', label: 'GCCs & corporates', labelTa: 'GCC-கள் & பெருநிறுவனங்கள்', at: [660, 180], links: ['founders', 'professionals'],
    how: 'GCCs and corporates find pilots through Scale Connect, and some sponsor Founder Switch seats for their employees.',
    howTa: 'GCC-களும் பெருநிறுவனங்களும் Scale Connect மூலம் பைலட்களைக் கண்டறிகின்றன; சில நிறுவனங்கள் தங்கள் ஊழியர்களுக்கான Founder Switch இடங்களுக்கு நிதியுதவி செய்கின்றன.',
  },
  {
    id: 'investors', label: 'Investors', labelTa: 'முதலீட்டாளர்கள்', at: [640, 400], links: ['founders'],
    how: 'Investors meet startups past first revenue at Scale Connect investor days, and StartNet Angels when it opens.',
    howTa: 'முதலீட்டாளர்கள் முதல் வருவாயைக் கடந்த ஸ்டார்ட்அப்களை Scale Connect முதலீட்டாளர் நாட்களில் சந்திக்கிறார்கள்; StartNet Angels தொடங்கியதும் அங்கும் சந்திப்பார்கள்.',
  },
];

/* ---------- Deep links ---------- */
export const connectLinks = (lang = 'en') => {
  const o = (src) => ({ src, brand: 'connect', lang });
  return {
    applySwitch: snxLink('/apply/founder-switch', o('connect-founder-switch')),
    applyCircle: snxLink('/circles/apply', o('connect-circles')),
    findCircle: snxLink('/circles', o('connect-circles')),
    applyScale: snxLink('/apply/scale-connect', o('connect-scale')),
    angelsInterest: snxLink('/interest/angels', o('connect-angels')),
    // 'all' (the Connect Series page) has no series of its own: list every Connect event (F-61).
    sectorRegister: (slug) => (slug === 'all' || !slug
      ? snxLink('/events', o('connect-series'))
      : snxLink('/events', { ...o(`connect-${slug}`), series: `${slug}-connect` })),
  };
};

/* Pre-written email for "Ask your employer to sponsor a seat" (Book 2 §3.3) */
export const SPONSOR_EMAIL = (() => {
  const subject = 'Request: sponsor my seat on StartNet Founder Switch';
  const body = [
    'Hello,',
    '',
    'I would like to join Founder Switch, a 12-week evening and weekend programme run by StartNet Connect. It helps professionals validate an idea with customers, find or test a co-founder, plan a financial runway and finish with a clear go or no-go decision.',
    '',
    'Some GCCs sponsor seats for their employees. Would we consider sponsoring mine? Programme details: https://startnet.in/connect/founder-switch',
    '',
    'Thank you,',
  ].join('\n');
  return `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
})();

export const ANGELS_LEGAL =
  'StartNet Angels is not yet open for investment. Nothing on this page is an offer of securities or investment advice. Investing in early-stage companies carries a high risk of loss. Participation will be limited to eligible investors through a registered structure.';
export const ANGELS_LEGAL_TA =
  'StartNet Angels இன்னும் முதலீட்டுக்குத் திறக்கப்படவில்லை. இந்தப் பக்கத்தில் உள்ள எதுவும் பங்குப் பத்திர வழங்கலோ முதலீட்டு ஆலோசனையோ அல்ல. தொடக்கநிலை நிறுவனங்களில் முதலீடு செய்வதில் இழப்புக்கான அதிக அபாயம் உள்ளது. பதிவுசெய்யப்பட்ட கட்டமைப்பின் மூலம் தகுதியுள்ள முதலீட்டாளர்கள் மட்டுமே பங்கேற்க முடியும்.';
