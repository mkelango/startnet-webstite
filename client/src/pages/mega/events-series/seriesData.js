// Event series content map for /events/<series> (Book 1 Part B §2.2 "Event series", T04; §3.2 ④ Events menu).
// English copy is Book 2 verbatim where it exists (§3.1.2, §3.2, §3.3, §3.4, §5.1); Tamil is a draft for the
// native copywriter (Book 2 §14 note). Brand and programme names stay in Latin script.
// Series keys match the `series` field of /api/events records; editions are the events in that series.

export const SERIES = {
  vibathon: {
    name: 'Vibathon',
    brand: 'vibe',
    kind: 'flagship',
    status: 'running',
    phase: 1,
    endorsement: ['a StartNet Vibe programme', 'StartNet Vibe வழங்கும் திட்டம்'],
    evergreen: '/vibe/vibathon',
    lede: [
      'The state-level AI and vibe-coding hackathon. District qualifiers, themed tracks, an industry jury and a business-plan track. Winners go straight into Vibe Launchpad.',
      'மாநில அளவிலான AI மற்றும் vibe-coding ஹேக்கத்தான். மாவட்டத் தகுதிச் சுற்றுகள், கருப்பொருள் பிரிவுகள், தொழில்துறை நடுவர் குழு, வணிகத் திட்டப் பிரிவு. வெற்றியாளர்கள் நேரடியாக Vibe Launchpad-க்குச் செல்கிறார்கள்.',
    ],
    about: [
      [
        'Vibathon starts in your district and finishes at a state finale. Each edition has its own page here, with its dates, tracks, agenda and, once it has run, what happened next.',
        'Vibathon உங்கள் மாவட்டத்தில் தொடங்கி மாநில இறுதிப் போட்டியில் முடிகிறது. ஒவ்வொரு பதிப்புக்கும் இங்கே தனிப் பக்கம் உண்டு: தேதிகள், பிரிவுகள், நிகழ்ச்சி நிரல், நடந்து முடிந்த பின் அதன் விளைவுகள்.',
      ],
    ],
    pillars: [
      { title: ['Build', 'உருவாக்குங்கள்'], body: ['A build sprint with AI tools. Judged on what works, not on slides.', 'AI கருவிகளுடன் ஒரு build sprint. ஸ்லைடுகளை வைத்து அல்ல, செயல்படுவதை வைத்தே மதிப்பீடு.'] },
      { title: ['Compete', 'போட்டியிடுங்கள்'], body: ['District qualifiers, then a state finale.', 'முதலில் மாவட்டத் தகுதிச் சுற்றுகள், பிறகு மாநில இறுதிப் போட்டி.'] },
      { title: ['Continue', 'தொடருங்கள்'], body: ["Winners get a guaranteed interview for Vibe Launchpad's 12-week pre-incubation.", 'வெற்றியாளர்களுக்கு Vibe Launchpad-இன் 12 வார முன்-இன்குபேஷன் திட்டத்தில் உறுதியான நேர்காணல்.'] },
    ],
    figures: ['vibathon-2025-tier-3-4-colleges', 'vibathon-2025-prize-pool', 'vibathon-2027-participants-target', 'vibathon-2027-host-colleges-target'],
    hostable: true,
  },
  'vibe-campus': {
    name: 'Vibe Campus',
    brand: 'vibe',
    kind: 'campus',
    status: 'running',
    phase: 1,
    evergreen: '/vibe/campus',
    lede: [
      "A series of events in your college: build nights, talks, founder fireside chats and idea pitches, hosted with your Institution's Innovation Council. One Vibe Summit each year is the state finale.",
      'உங்கள் கல்லூரியில் நடக்கும் நிகழ்வுத் தொடர்: build nights, உரைகள், நிறுவனர்களுடன் நேரடி உரையாடல்கள், யோசனை முன்வைப்புகள். உங்கள் கல்வி நிறுவனத்தின் Innovation Council உடன் இணைந்து நடத்தப்படுகிறது. ஒவ்வோர் ஆண்டும் ஒரு Vibe Summit மாநில இறுதி நிகழ்வாக நடக்கிறது.',
    ],
    about: [
      [
        'Vibe Campus is Spark, the first step on the Vibe journey: Spark, Learn, Build, Launch, Fund. Build nights at host colleges are also the warm-ups for Vibathon.',
        'Vibe பயணத்தின் முதல் படியான Spark, Vibe Campus-தான்: Spark, Learn, Build, Launch, Fund. நடத்தும் கல்லூரிகளில் நடக்கும் build nights, Vibathon-க்கான முன்பயிற்சியாகவும் அமைகின்றன.',
      ],
    ],
    pillars: [
      { title: ['Build nights', 'Build nights'], body: ['Build together, on campus, with AI tools.', 'கல்லூரி வளாகத்திலேயே, AI கருவிகளுடன் சேர்ந்து உருவாக்குங்கள்.'] },
      { title: ['Talks and fireside chats', 'உரைகளும் உரையாடல்களும்'], body: ['Talks and founder fireside chats, in your college.', 'உங்கள் கல்லூரியிலேயே உரைகளும் நிறுவனர்களுடன் நேரடி உரையாடல்களும்.'] },
      { title: ['Idea pitches', 'யோசனை முன்வைப்புகள்'], body: ['Pitch an idea and get feedback in the room.', 'உங்கள் யோசனையை முன்வைத்து, அங்கேயே கருத்துகளைப் பெறுங்கள்.'] },
    ],
    figures: null,
    hostable: true,
  },
  'vibe-summit': {
    name: 'Vibe Summit',
    brand: 'vibe',
    kind: 'flagship',
    status: 'running',
    phase: 2,
    evergreen: '/vibe/summit',
    lede: [
      'One Vibe Summit each year is the state finale of Vibe Campus.',
      'ஒவ்வோர் ஆண்டும் நடக்கும் Vibe Summit, Vibe Campus-இன் மாநில இறுதி நிகழ்வு.',
    ],
    about: [
      [
        'The state finale of Vibe Campus. Dates, venue and format for each edition: [placeholder — to be supplied by StartNet].',
        'Vibe Campus-இன் மாநில இறுதி நிகழ்வு. ஒவ்வொரு பதிப்பின் தேதி, இடம், வடிவம்: [placeholder — to be supplied by StartNet].',
      ],
    ],
    pillars: null,
    figures: null,
    hostable: false,
  },
  'genai-connect': {
    name: 'GenAI Connect',
    brand: 'connect',
    kind: 'connect',
    status: 'running',
    phase: 1,
    evergreen: '/connect/genai',
    // First edition: GenAI Connect Summit & Expo, 27 April 2024, Salem (server/data/events.json, genai-connect-2024).
    since: '2024',
    lede: [
      'For builders shipping generative and agentic AI into real products, including for GCCs.',
      'உருவாக்கும் (generative) மற்றும் agentic AI-ஐ உண்மையான தயாரிப்புகளில் கொண்டு சேர்க்கும் உருவாக்குநர்களுக்கு, GCC-களுக்கானவை உட்பட.',
    ],
    about: 'connect',
    pillars: 'connect',
    figures: ['connect-events-run', 'connect-attendees', 'connect-circle-members'],
    hostable: true,
  },
  'saas-connect': {
    name: 'SaaS Connect',
    brand: 'connect',
    kind: 'connect',
    status: 'running',
    phase: 1,
    evergreen: '/connect/saas',
    // First edition: SaaS Connect Summit & Expo, 22–23 February 2025, Coimbatore (events.json, saas-connect-2025).
    since: '2025',
    lede: [
      'For early-stage and Tier 2 SaaS founders finding their first 100 customers.',
      'முதல் 100 வாடிக்கையாளர்களைத் தேடும் தொடக்கநிலை மற்றும் Tier 2 SaaS நிறுவனர்களுக்கு.',
    ],
    about: 'connect',
    pillars: 'connect',
    figures: ['connect-events-run', 'connect-attendees', 'connect-circle-members'],
    hostable: true,
  },
  'd2c-connect': {
    name: 'D2C Connect',
    brand: 'connect',
    kind: 'connect',
    status: 'running',
    phase: 1,
    evergreen: '/connect/d2c',
    // First edition: D2C Connect Summit & Expo, 30 November 2024, Coimbatore (events.json, d2c-connect-2024).
    since: '2024',
    lede: [
      'For consumer brands selling direct, from Tamil Nadu to the world.',
      'தமிழ்நாட்டிலிருந்து உலகம் வரை நேரடியாக விற்பனை செய்யும் நுகர்வோர் பிராண்டுகளுக்கு.',
    ],
    about: 'connect',
    pillars: 'connect',
    figures: ['connect-events-run', 'connect-attendees', 'connect-circle-members'],
    hostable: true,
  },
  'lab-to-market-summit': {
    name: 'Lab-to-Market Summit',
    brand: 'research',
    kind: 'flagship',
    status: 'running',
    phase: 1,
    evergreen: '/research/lab-to-market-summit',
    lede: [
      "The annual day where lab teams demo to GCCs, investors and government, and next year's problem statements are set.",
      'ஆய்வகக் குழுக்கள் GCC-கள், முதலீட்டாளர்கள், அரசு ஆகியோர் முன் தங்கள் வேலையைச் செயல்விளக்கம் செய்யும், அடுத்த ஆண்டுக்கான problem statements அமைக்கப்படும் வருடாந்திர நாள்.',
    ],
    about: [
      [
        'Where lab teams meet their first customers. Date, venue and co-host: [placeholder].',
        'ஆய்வகக் குழுக்கள் தங்கள் முதல் வாடிக்கையாளர்களைச் சந்திக்கும் இடம். தேதி, இடம், இணை நடத்துநர்: [placeholder].',
      ],
    ],
    pillars: [
      { title: ['Demo', 'செயல்விளக்கம்'], body: ['Lab teams demo to GCCs, investors and government.', 'ஆய்வகக் குழுக்கள் GCC-கள், முதலீட்டாளர்கள், அரசு ஆகியோர் முன் செயல்விளக்கம் செய்கின்றன.'] },
      { title: ['Problem statements', 'Problem statements'], body: ["Sponsors post next year's problem statements.", 'ஸ்பான்சர்கள் அடுத்த ஆண்டுக்கான problem statements-ஐ வெளியிடுகிறார்கள்.'] },
      { title: ['The Index', 'குறியீடு'], body: ['We launch the TN Research Commercialisation Index.', 'TN Research Commercialisation Index-ஐ நாங்கள் வெளியிடுகிறோம்.'] },
    ],
    figures: ['lab-problem-statements-target'],
    hostable: false,
  },
  'women-founders-summit': {
    name: 'Women Founders Summit & Awards',
    brand: 'women',
    kind: 'flagship',
    status: 'running',
    phase: 1,
    evergreen: '/women/summit',
    nominate: '/women/summit#nominate',
    lede: [
      'The annual StartNet Women flagship, where the TN Women Founders Report is launched and women founders are recognised.',
      'StartNet Women-இன் வருடாந்திர முதன்மை நிகழ்வு: TN Women Founders Report வெளியிடப்படுகிறது, பெண் நிறுவனர்கள் அங்கீகரிக்கப்படுகிறார்கள்.',
    ],
    about: [
      [
        'A day for the founders, and the numbers behind them. Date and venue: [placeholder].',
        'நிறுவனர்களுக்கும், அவர்களுக்குப் பின்னால் உள்ள எண்களுக்குமான ஒரு நாள். தேதியும் இடமும்: [placeholder].',
      ],
    ],
    pillars: [
      { title: ['Founders on stage', 'மேடையில் நிறுவனர்கள்'], body: ['Women founders on stage.', 'மேடையில் பெண் நிறுவனர்கள்.'] },
      { title: ['Awards', 'விருதுகள்'], body: ['Awards decided by an independent jury [placeholder — jury].', 'சுயாதீன நடுவர் குழு முடிவு செய்யும் விருதுகள் [placeholder — jury].'] },
      { title: ['The report', 'அறிக்கை'], body: ['The launch of the TN Women Founders Report.', 'TN Women Founders Report வெளியீடு.'] },
    ],
    figures: ['tn-women-led-startups', 'women-floor-target'],
    hostable: false,
  },
  'research-days': {
    name: 'Research Days',
    brand: 'research',
    kind: 'research',
    // Status not given in the books: no status badge until StartNet confirms it.
    status: null,
    phase: 1,
    evergreen: '/research/labs',
    evergreenLabel: ['StartNet Labs', 'StartNet Labs'],
    lede: [
      'A StartNet Research event series. [placeholder — series description to be supplied by StartNet]',
      'StartNet Research நிகழ்வுத் தொடர். [placeholder — series description to be supplied by StartNet]',
    ],
    about: null,
    pillars: null,
    figures: null,
    hostable: true,
  },
  'investors-summit': {
    name: 'Investors Summit',
    brand: null,
    kind: 'archive',
    status: 'archive',
    phase: 1,
    evergreen: null,
    // Public record starts in 2023 (launch post June 2023; incorporated July 2023). SEO-TA: pending native review
    lede: [
      'One of the rooms StartNet has run since 2023. The entry will list the date, co-hosts, attendance and what happened next once they are confirmed.',
      '2023 முதல் StartNet நடத்தி வரும் நிகழ்வுகளில் ஒன்று. தேதி, இணை நடத்துநர்கள், வருகை, அதன் பின் நடந்தவை உறுதியானதும் இந்தப் பதிவில் இடம்பெறும்.',
    ],
    about: null,
    pillars: null,
    figures: null,
    hostable: false,
  },
  'founders-day': {
    name: 'StartNet Founders Day',
    brand: null,
    kind: 'flagship',
    status: 'proposed',
    phase: 3,
    evergreen: null,
    lede: [
      'The all-brand annual show [proposed].',
      'அனைத்து பிராண்டுகளும் இணையும் வருடாந்திர நிகழ்வு [proposed].',
    ],
    about: null,
    pillars: null,
    figures: null,
    hostable: false,
  },
};

/** Shared Connect copy (Book 2 §3.3 "Connect Series landing" and sector page template). */
export const CONNECT_ABOUT = [
  [
    'Each Connect is a community, not a single date: a flagship event, monthly meet-ups, a sector report and a Circle. We co-host with sector bodies wherever we can, rather than duplicate them.',
    'ஒவ்வொரு Connect-உம் ஒரு நாள் நிகழ்வு அல்ல, ஒரு சமூகம்: ஒரு முதன்மை நிகழ்வு, மாதாந்திரச் சந்திப்புகள், ஒரு துறை அறிக்கை, ஒரு Circle. ஏற்கெனவே இருப்பதை மீண்டும் செய்யாமல், முடிந்த இடங்களில் துறை அமைப்புகளுடன் இணைந்து நடத்துகிறோம்.',
  ],
];
export const CONNECT_PILLARS = [
  { title: ['Flagship', 'முதன்மை நிகழ்வு'], body: ['A flagship event for the whole sector.', 'முழுத் துறைக்குமான ஒரு முதன்மை நிகழ்வு.'] },
  { title: ['Monthly meet-up', 'மாதாந்திரச் சந்திப்பு'], body: ['Monthly meet-ups between flagship events.', 'முதன்மை நிகழ்வுகளுக்கு இடையே மாதாந்திரச் சந்திப்புகள்.'] },
  { title: ['Sector Circle', 'துறை Circle'], body: ['A closed chapter of founders, one seat per sector.', 'நிறுவனர்களின் மூடிய குழு; ஒரு துறைக்கு ஒரு இடம்.'] },
  { title: ['Sector report', 'துறை அறிக்கை'], body: ['A report on the sector, published once it is ready.', 'அந்தத் துறை பற்றிய அறிக்கை; தயாரானதும் வெளியிடப்படும்.'] },
];

export const SERIES_SLUGS = Object.keys(SERIES);
export const isKnownSeries = (s) => typeof s === 'string' && Object.prototype.hasOwnProperty.call(SERIES, s);

/** Config for a series; unknown series (present only in /api/events) get a minimal generic config. */
export function seriesConfig(key, events = []) {
  if (isKnownSeries(key)) return { key, ...SERIES[key] };
  const first = events.find((e) => e.series === key);
  const brand = first && ['research', 'vibe', 'connect', 'women'].includes(first.brand) ? first.brand : null;
  const name = String(key || '')
    .split('-')
    .map((w) => (w ? w[0].toUpperCase() + w.slice(1) : w))
    .join(' ');
  return {
    key,
    name,
    brand,
    kind: 'series',
    status: null,
    phase: 1,
    evergreen: first?.brandUrl && first.brandUrl !== '/events/past' ? first.brandUrl : null,
    lede: ['[placeholder — series description to be supplied by StartNet]', '[placeholder — series description to be supplied by StartNet]'],
    about: null,
    pillars: null,
    figures: null,
    hostable: false,
  };
}

/**
 * Edition key inside a series URL: the event slug minus the "<series>-" prefix
 * (vibathon-2027 → "2027", vibathon-2027-district-qualifiers → "2027-district-qualifiers",
 * genai-connect-2024 → "2024"). Falls back to `edition`, then the slug.
 */
export function editionKeyOf(e) {
  if (!e) return '';
  const prefix = `${e.series}-`;
  if (e.series && e.slug && e.slug.startsWith(prefix) && e.slug.length > prefix.length) return e.slug.slice(prefix.length);
  return e.edition || e.slug || '';
}

export const editionPath = (e) => `/events/${e.series}/${editionKeyOf(e)}`;

export function findEdition(events, series, edition) {
  return (Array.isArray(events) ? events : []).find((e) => e.series === series && editionKeyOf(e) === edition) || null;
}

/** Breadcrumb label for an edition: the year when the key is a year, else the event title. */
export const editionCrumb = (e) => {
  const k = editionKeyOf(e);
  return /^\d{4}$/.test(k) ? k : e.title;
};

/** Next edition: the main edition (slug = series-edition) first, then the soonest upcoming. */
export function nextEdition(upcoming, series) {
  const list = Array.isArray(upcoming) ? upcoming : [];
  return list.find((e) => e.edition && e.slug === `${series}-${e.edition}`) || list[0] || null;
}

export const BRAND_KEYS = ['research', 'vibe', 'connect', 'women', 'x'];
export const brandOf = (b) => (BRAND_KEYS.includes(b) ? b : null);
export const ART_FOR = { research: 'grid', vibe: 'network', connect: 'network', women: 'kolam', x: 'dot' };
export const seedOf = (s = '') => [...String(s)].reduce((n, c) => (n * 31 + c.charCodeAt(0)) % 997, 7);
export const isPlaceholderText = (s) => typeof s === 'string' && (/\[[^\]]*\]/.test(s) || /to be confirmed/i.test(s));

// Final verifier r3: flat /events/<series>-<edition> URLs now redirect here, so this page must carry the Tamil event
// fields EventDetail used (round 2, F-99): every <field>Ta in the data replaces <field> on /ta, nested lists included.
const pickTa = (o, k) => (o && typeof o[`${k}Ta`] === 'string' && o[`${k}Ta`].trim() ? o[`${k}Ta`] : o?.[k]);
const TA_FIELDS = ['title', 'summary', 'microcopy', 'endorsement', 'jury', 'venue', 'city', 'district', 'tracksNote', 'coHost', 'registrationClosesLabel', 'dateLabel', 'priceNote', 'sponsorTiersNote'];
export function localizeEvent(e, lang) {
  if (!e || lang !== 'ta') return e;
  const out = { ...e };
  for (const k of TA_FIELDS) out[k] = pickTa(e, k);
  if (Array.isArray(e.prizesTa) && e.prizesTa.length) out.prizes = e.prizesTa;
  const mapList = (list, keys) => (Array.isArray(list) ? list.map((it) => { const o = { ...it }; for (const k of keys) o[k] = pickTa(it, k); return o; }) : list);
  out.faq = mapList(e.faq, ['question', 'answer']);
  out.timeline = mapList(e.timeline, ['stage', 'when', 'what']);
  out.whatItIs = mapList(e.whatItIs, ['title', 'body']);
  out.tracks = mapList(e.tracks, ['title', 'brief']);
  out.agenda = mapList(e.agenda, ['title']);
  out.sponsorTiers = mapList(e.sponsorTiers, ['tier', 'gets']);
  return out;
}
/** lang="en" for a value on /ta that has no Tamil letters (an English fallback); undefined otherwise. */
const TAMIL = /[஀-௿]/;
function textOf(v) { return typeof v === 'string' ? v : Array.isArray(v) ? v.map(textOf).join(' ') : v && typeof v === 'object' ? Object.values(v).map(textOf).join(' ') : ''; }
export const enIf = (lang, v) => (lang === 'ta' && !TAMIL.test(textOf(v)) ? 'en' : undefined);

// ---------------------------------------------------------------------------------------------------------------
// SEO (Oct 2026 brief): what each series is, as a short search phrase for titles (Book 1 §9.2 Events / Student
// building themes). Every phrase restates Book 2 copy (§3.2–3.4, §5.1). [English, Tamil draft] — SEO-TA: pending
// native review.
export const SERIES_SEO = {
  vibathon: ['AI hackathon', 'AI ஹேக்கத்தான்'],
  'vibe-campus': ['campus build nights', 'கல்லூரி உருவாக்க இரவுகள்'],
  'vibe-summit': ['student builders finale', 'மாணவர் உருவாக்குநர் இறுதி நிகழ்வு'],
  'genai-connect': ['GenAI founder event', 'GenAI நிறுவனர் நிகழ்வு'],
  'saas-connect': ['SaaS founder event', 'SaaS நிறுவனர் நிகழ்வு'],
  'd2c-connect': ['D2C brand event', 'D2C பிராண்ட் நிகழ்வு'],
  'lab-to-market-summit': ['research summit', 'ஆராய்ச்சி உச்சி மாநாடு'],
  'women-founders-summit': ['women entrepreneurs event', 'பெண் தொழில்முனைவோர் நிகழ்வு'],
  'research-days': ['research founder events', 'ஆராய்ச்சி நிறுவனர் நிகழ்வுகள்'],
  'investors-summit': ['startup investor summit', 'ஸ்டார்ட்அப் முதலீட்டாளர் மாநாடு'],
  'founders-day': ['all-brand founders show', 'அனைத்து பிராண்ட் நிறுவனர் நிகழ்வு'],
};

const UNCONFIRMED = /\[|to be confirmed|tbc|உறுதிசெய்ய|உறுதியாக|இடநிரப்பி|placeholder/i;

/**
 * One factual "when" sentence for a meta description, never a guessed date: the confirmed date when there is one
 * (`dateText` is passed in to avoid a circular import), else the month/year from the edition's own date label
 * ("State finale · February 2027 · date to be confirmed" → "Planned for February 2027; exact date to be confirmed.").
 */
export function editionWhenSentence(e, lang, dateText) {
  if (!e) return undefined;
  const ta = lang === 'ta';
  if (e.dateConfirmed && e.date && typeof dateText === 'function') {
    const d = dateText(e);
    if (typeof d === 'string' && d) return ta ? `நாள்: ${d}.` : `${d}.`;
  }
  const label = (ta && e.dateLabelTa) || e.dateLabel;
  if (typeof label !== 'string') return undefined;
  const seg = label.split(/\s*·\s*/).find((s) => /\d{4}/.test(s) && !UNCONFIRMED.test(s));
  if (!seg) return undefined;
  if (e.status === 'past') return ta ? `${seg}-இல் நடைபெற்றது.` : `Held in ${seg}.`;
  return ta ? `${seg}-இல் திட்டமிடப்பட்டுள்ளது; சரியான தேதி உறுதிசெய்யப்பட வேண்டும்.` : `Planned for ${seg}; exact date to be confirmed.`;
}
