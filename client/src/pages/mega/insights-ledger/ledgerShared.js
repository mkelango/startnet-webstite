// Shared, page-local data for the insights-ledger group (Methodology, LedgerPeriod, Newsletter).
// Every string is bilingual [English, Tamil]; brand and programme names stay in Latin script (Book 2 §14).
// Sources: Book 2 §2.2 (ladder table, attribution rule), §2.4, §6.2; Book 1 Part A §8.6, Part B §2.2, §7.1 rule 4,
// §8 Metric model (sourceType values), §9.5 (corrections flow); Book 3 Part A §3.7 (A/B/C tag spec).

/** Founder ladder L1–L7 — definitions verbatim from Book 2 §2.2. `counted`: counts as "nurtured" (L2+). */
export const LEVELS = [
  {
    code: 'L1',
    name: ['Aware', 'அறிமுகம்'],
    rule: [
      'Attended an event or joined the community. Tracked, not counted as nurtured.',
      'ஒரு நிகழ்வில் கலந்துகொண்டவர் அல்லது சமூகத்தில் இணைந்தவர். பதிவு செய்யப்படும், ஆனால் "வளர்க்கப்பட்டவர்" எனக் கணக்கிடப்படாது.',
    ],
    counted: false,
  },
  {
    code: 'L2',
    name: ['Nurtured', 'வளர்க்கப்பட்டவர்'],
    rule: [
      'A StartNet X profile plus at least two meaningful touchpoints.',
      'ஒரு StartNet X சுயவிவரமும், குறைந்தது இரண்டு அர்த்தமுள்ள தொடர்புகளும்.',
    ],
    counted: true,
  },
  {
    code: 'L3',
    name: ['Skilled', 'திறன் பெற்றவர்'],
    rule: ['Completed a structured programme.', 'கட்டமைக்கப்பட்ட ஒரு திட்டத்தை நிறைவு செய்தவர்.'],
    counted: true,
  },
  {
    code: 'L4',
    name: ['Building', 'உருவாக்குபவர்'],
    rule: ['A team with a prototype or MVP in progress.', 'முன்மாதிரி அல்லது MVP உருவாக்கத்தில் உள்ள ஒரு குழு.'],
    counted: true,
  },
  {
    code: 'L5',
    name: ['Launched', 'தொடங்கியவர்'],
    rule: ['A registered company.', 'பதிவு செய்யப்பட்ட ஒரு நிறுவனம்.'],
    counted: true,
  },
  {
    code: 'L6',
    name: ['Funded', 'நிதி பெற்றவர்'],
    rule: ['First external capital, or ₹10 L+ revenue.', 'முதல் வெளி முதலீடு, அல்லது ₹10 L+ வருவாய்.'],
    counted: true,
  },
  {
    code: 'L7',
    name: ['Scaling', 'விரிவடைபவர்'],
    rule: ['₹1 Cr+ revenue, Series A, or 25+ jobs.', '₹1 Cr+ வருவாய், Series A, அல்லது 25+ வேலைவாய்ப்புகள்.'],
    counted: true,
  },
];

/** A/B/C confidence tags — Book 3 Part A §3.7 (word + style) and Book 2 §2.4 (meaning). */
export const TAGS = [
  {
    tag: 'A',
    word: ['Verified', 'சரிபார்க்கப்பட்டது'],
    meaning: ['Verified against a primary source.', 'முதன்மை ஆதாரத்துடன் சரிபார்க்கப்பட்டது.'],
    style: ['Solid chip', 'நிரம்பிய குறி'],
  },
  {
    tag: 'B',
    word: ['Claimed', 'கூறப்பட்டது'],
    meaning: ['Reported by the founder or organisation.', 'நிறுவனர் அல்லது அமைப்பு தெரிவித்தது.'],
    style: ['Outlined chip', 'கோட்டுக் குறி'],
  },
  {
    tag: 'C',
    word: ['Estimate', 'மதிப்பீடு'],
    meaning: ['An estimate or planning assumption.', 'ஒரு மதிப்பீடு அல்லது திட்டமிடல் அனுமானம்.'],
    style: ['Dashed chip', 'புள்ளிக்கோட்டுக் குறி'],
  },
];

/** Metric.sourceType values — Book 1 Part B §8 content model. */
export const SOURCE_TYPES = [
  {
    key: 'snx',
    label: ['StartNet X record', 'StartNet X பதிவு'],
    body: [
      'Attendance, touchpoints and programme completion logged on a founder’s StartNet X profile, with their consent.',
      'நிறுவனரின் ஒப்புதலுடன், அவரது StartNet X சுயவிவரத்தில் பதிவாகும் வருகை, தொடர்புகள் மற்றும் திட்ட நிறைவு.',
    ],
  },
  {
    key: 'registry',
    label: ['Registry', 'அரசுப் பதிவேடு'],
    body: [
      'A public register, for example the record that a company has been incorporated.',
      'பொதுப் பதிவேடு; உதாரணமாக, ஒரு நிறுவனம் பதிவு செய்யப்பட்டதற்கான பதிவு.',
    ],
  },
  {
    key: 'document',
    label: ['Document', 'ஆவணம்'],
    body: [
      'A signed document we have seen, such as a pilot agreement or a grant letter.',
      'நாங்கள் பார்த்த கையொப்பமிட்ட ஆவணம்; உதாரணமாக, ஒரு பைலட் ஒப்பந்தம் அல்லது மானியக் கடிதம்.',
    ],
  },
  {
    key: 'self-reported',
    label: ['Self-reported', 'சுயமாகத் தெரிவித்தது'],
    body: [
      'What a founder or organisation tells us. Until it is checked against a primary source it cannot carry an A tag.',
      'நிறுவனர் அல்லது அமைப்பு எங்களிடம் தெரிவிப்பது. முதன்மை ஆதாரத்துடன் சரிபார்க்கப்படும் வரை அதற்கு A குறி கிடையாது.',
    ],
  },
  {
    key: 'third-party',
    label: ['Third party', 'மூன்றாம் தரப்பு'],
    body: [
      'Published statistics from another body. We name the publisher and the date, for example “DPIIT via DT Next, July 2026”.',
      'மற்றொரு அமைப்பு வெளியிட்ட புள்ளிவிவரங்கள். வெளியீட்டாளர் பெயரையும் தேதியையும் குறிப்பிடுவோம்; உதாரணமாக “DPIIT via DT Next, July 2026”.',
    ],
  },
];

/** Correction severities — Book 1 Part A §8.6 rule 4. */
export const SEVERITIES = [
  { key: 'minor', label: ['Minor', 'சிறியது'] },
  { key: 'material', label: ['Material', 'முக்கியமானது'] },
  { key: 'critical', label: ['Critical', 'மிக முக்கியமானது'] },
];

/** Book 2 §6.2, fixed copy. */
export const REALITY_CHECK = [
  'Mission 1 Lakh is ambitious. If our 2028 review shows it is out of reach, we will reset the goal in public rather than change what ‘nurtured’ means.',
  'Mission 1 Lakh ஒரு பெரிய இலக்கு. 2028 மதிப்பாய்வில் அது எட்ட முடியாதது எனத் தெரிந்தால், ‘வளர்க்கப்பட்டவர்’ என்பதன் பொருளை மாற்றாமல், இலக்கையே பொதுவெளியில் மாற்றி அமைப்போம்.',
];

export const PLACEHOLDER = '[placeholder — to be supplied by StartNet]';

/** Ledger period slugs use <yyyy>-q<n> (Book 1 Part B §7.1 rule 4). Accepts "2026-Q4", "2026-q4", {id}. */
export function periodSlug(p) {
  const raw = typeof p === 'string' ? p : p?.id || p?.slug || '';
  const m = /^(\d{4})-q([1-4])$/i.exec(String(raw).trim());
  return m ? `${m[1]}-q${m[2]}` : null;
}

/** "2026-q4" → "2026 Q4" */
export function periodLabel(slug) {
  const m = /^(\d{4})-q([1-4])$/i.exec(slug || '');
  return m ? `${m[1]} Q${m[2]}` : slug || '';
}

/** Every valid period slug the /api/ledger response knows about (current period + optional periods[]). */
export function knownPeriods(data) {
  const out = [];
  const add = (p) => {
    const s = periodSlug(p);
    if (s && !out.includes(s)) out.push(s);
  };
  add(data?.period);
  (Array.isArray(data?.periods) ? data.periods : []).forEach(add);
  return out.sort().reverse();
}

/** Ledger outcome evidence types (server/data/ledger.json → outcomes[].evidence), keyed by Metric.sourceType. */
export const EVIDENCE_LABEL = Object.fromEntries(SOURCE_TYPES.map((s) => [s.key, s.label]));

/** Outcome labels from /api/ledger → Tamil (Book 2 §6.2). Unknown labels fall back to English. */
export const OUTCOME_TA = {
  'companies registered': 'பதிவு செய்யப்பட்ட நிறுவனங்கள்',
  'capital raised': 'திரட்டிய முதலீடு',
  'pilots signed': 'கையெழுத்தான பைலட்கள்',
  'jobs created': 'உருவான வேலைவாய்ப்புகள்',
};
