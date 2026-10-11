// StartNet Research copy. Source: Book 2 §3.1 (verbatim where it exists), Book 1 Part A §3.1 (scholar persona),
// Book 1 Part B §2.2 / §4 / §10 (pages, sub-nav, filters). Nothing here is invented: unknown facts stay as placeholders.
// Tamil: every user-visible string carries a `…Ta` sibling. Book 2 §14 covers only the main CTAs; the rest are
// drafts written for this site and are PENDING NATIVE TAMIL REVIEW (Book 2 Appendix A item 14).
// Brand, programme and Lab names (StartNet Research, StartNet Labs, Scholar Founders Fellowship, Agentic AI Lab…) stay Latin.

/** Read a bilingual field: tr(t, obj, 'title') → t(obj.title, obj.titleTa). */
export const tr = (t, obj, key) => (obj ? t(obj[key], obj[`${key}Ta`]) : undefined);

export const PH = '[placeholder — to be supplied by StartNet]';
export const PH_TA = '[StartNet வழங்க உள்ளது]';
export const PH_SHORT_TA = '[விவரம் வர உள்ளது]';
export const PH_DATE_TA = '[தேதி அறிவிக்கப்பட உள்ளது]';

// SEO: primary "university spinout / faculty startup" (Book 1 §9.2 Research theme), secondary "lab to market".
// SEO-TA: pending native review (Tamil keyword "ஆராய்ச்சியிலிருந்து நிறுவனம்", Book 1 §9.2)
export const RESEARCH_HOME = {
  seoTitle: 'StartNet Research: spinouts for PhD scholars and faculty',
  seoTitleTa: 'StartNet Research: ஆராய்ச்சியிலிருந்து நிறுவனம்',
  meta: 'For PhD scholars and faculty in Tamil Nadu: turn your research into a company you co-own, with thematic labs, a 7-week founder sprint and spinout terms.',
  metaTa: 'தமிழ்நாட்டின் முனைவர் பட்ட ஆய்வாளர்கள், பேராசிரியர்களுக்கு: ஆராய்ச்சியிலிருந்து நிறுவனம். கருப்பொருள் ஆய்வகங்கள், 7 வார நிறுவனர் பயிற்சி, விதிமுறைகள்.',
  h1: 'Your research, a company you co-own.',
  h1Ta: 'உங்கள் ஆய்வு, நீங்களும் உரிமையாளராக இருக்கும் ஒரு நிறுவனம்.',
  sub: 'StartNet Research helps PhD scholars, post-docs and faculty turn research into products and companies, with their institution and an industry partner on the same side of the table.',
  subTa: 'முனைவர் பட்ட ஆய்வாளர்கள், முனைவர் பட்டத்துக்குப் பிந்தைய ஆய்வாளர்கள், பேராசிரியர்கள் தங்கள் ஆய்வைத் தயாரிப்புகளாகவும் நிறுவனங்களாகவும் மாற்ற StartNet Research உதவுகிறது. அவர்களின் கல்வி நிறுவனமும் ஒரு தொழில்துறைக் கூட்டாளரும் அவர்களுடன் ஒரே பக்கத்தில் இருப்பார்கள்.',
  ctaPrimary: 'Register interest in a Lab',
  ctaPrimaryTa: 'ஆய்வகத்தில் சேர ஆர்வத்தைப் பதிவு செய்யுங்கள்',
  ctaSecondary: 'For institutions',
  ctaSecondaryTa: 'கல்வி நிறுவனங்களுக்கு',
  closingTitle: "Have research that could solve someone's problem? Tell us about it.",
  closingTitleTa: 'உங்கள் ஆய்வு யாரோ ஒருவரின் சிக்கலைத் தீர்க்குமா? எங்களிடம் சொல்லுங்கள்.',
};

// Proof band (Book 2 §3.1). Placeholders never animate.
export const PROOF = [
  { id: 'research-institutions', label: 'Partner institutions', labelTa: 'கூட்டாளர் கல்வி நிறுவனங்கள்', value: null, tag: 'B' },
  { id: 'research-fellows', label: 'Scholar Founders Fellows', labelTa: 'Scholar Founders Fellowship உறுப்பினர்கள்', value: null, tag: 'A' },
  { id: 'research-companies', label: 'Companies formed', labelTa: 'உருவான நிறுவனங்கள்', value: null, tag: 'A' },
  {
    id: 'tn-phd-enrolments',
    label: 'PhD enrolments in Tamil Nadu institutions (context)',
    labelTa: 'தமிழ்நாட்டுக் கல்வி நிறுவனங்களில் முனைவர் பட்டச் சேர்க்கைகள் (பின்னணி)',
    value: 30000,
    unit: '+',
    tag: 'A',
    asAt: 'AISHE 2020-21',
    source: 'AISHE 2020-21, latest state figure',
  },
];

// The journey (Book 2 §3.1) — tap-to-expand stepper (Book 4 E2 F5).
export const JOURNEY = [
  { id: 'discover', title: 'Discover', titleTa: 'கண்டறிதல்', body: 'Lab audits and technology scouting', bodyTa: 'ஆய்வகத் தணிக்கைகளும் தொழில்நுட்பத் தேடலும்', link: { label: 'StartNet Labs', to: '/research/labs' } },
  { id: 'validate', title: 'Validate', titleTa: 'சரிபார்த்தல்', body: '7-week sprint, 100 customer interviews', bodyTa: '7 வாரப் பயிற்சி, 100 வாடிக்கையாளர் நேர்காணல்கள்', link: { label: 'Scholar Founders Fellowship', to: '/research/fellowship' } },
  { id: 'build', title: 'Build', titleTa: 'உருவாக்குதல்', body: 'Proof of concept with a Global Capability Centre (GCC) or industry partner', bodyTa: 'உலகளாவிய திறன் மையம் (GCC) அல்லது தொழில்துறைக் கூட்டாளருடன் கருத்துச் சான்று (proof of concept)', link: { label: 'Problem statements', labelTa: 'சிக்கல் அறிக்கைகள்', to: '/research/problem-statements' } },
  { id: 'form', title: 'Form', titleTa: 'நிறுவுதல்', body: 'Company, IP licence, standard terms', bodyTa: 'நிறுவனம், அறிவுசார் சொத்து (IP) உரிமம், நிலையான விதிமுறைகள்', link: { label: 'Standard terms', labelTa: 'நிலையான விதிமுறைகள்', to: '/research/terms' } },
  { id: 'fund', title: 'Fund', titleTa: 'நிதி திரட்டுதல்', body: 'Grants, angels, research funds', bodyTa: 'மானியங்கள், ஏஞ்சல் முதலீட்டாளர்கள், ஆய்வு நிதிகள்', link: { label: 'Lab-to-Market Summit', to: '/research/lab-to-market-summit' } },
  { id: 'scale', title: 'Scale', titleTa: 'விரிவாக்குதல்', body: 'Pilots and first contracts', bodyTa: 'முன்னோட்டத் திட்டங்களும் முதல் ஒப்பந்தங்களும்', link: { label: 'Scale Connect', to: '/connect/scale' } },
];

// The four-party model (Book 2 §3.1, verbatim).
export const PARTIES = [
  {
    id: 'founders',
    name: 'Scholar or faculty founders',
    nameTa: 'ஆய்வாளர் அல்லது பேராசிரியர் நிறுவனர்கள்',
    short: 'Founders',
    shortTa: 'நிறுவனர்கள்',
    body: "Lead the company and hold a clear majority. Faculty can use leave or sabbatical provisions under AICTE's National Innovation and Startup Policy, where their institution has adopted it.",
    bodyTa: 'நிறுவனத்தை வழிநடத்தி, தெளிவான பெரும்பான்மைப் பங்கை வைத்திருப்பார்கள். தங்கள் கல்வி நிறுவனம் AICTE-இன் தேசியப் புத்தாக்க மற்றும் ஸ்டார்ட்அப் கொள்கையை ஏற்றிருந்தால், பேராசிரியர்கள் அதன் கீழ் உள்ள விடுப்பு அல்லது சிறப்பு விடுப்பு (sabbatical) வசதிகளைப் பயன்படுத்தலாம்.',
  },
  {
    id: 'institution',
    name: 'The institution',
    nameTa: 'கல்வி நிறுவனம்',
    short: 'Institution',
    shortTa: 'கல்வி நிறுவனம்',
    body: 'Provides IP, lab access and a host incubator, and takes a small stake and/or royalty.',
    bodyTa: 'அறிவுசார் சொத்து, ஆய்வக அணுகல், இன்குபேட்டர் ஆகியவற்றை வழங்கி, சிறிய பங்கு மற்றும்/அல்லது ராயல்டியைப் பெறுகிறது.',
  },
  {
    id: 'industry',
    name: 'The GCC or industry partner',
    nameTa: 'GCC அல்லது தொழில்துறைக் கூட்டாளர்',
    short: 'GCC / industry',
    shortTa: 'GCC / தொழில்துறை',
    body: 'Brings the problem, funds the proof of concept and can become the first customer. It takes equity only if it invests cash.',
    bodyTa: 'சிக்கலைக் கொண்டு வருகிறது, கருத்துச் சான்றுக்கு நிதியளிக்கிறது, முதல் வாடிக்கையாளராகவும் ஆகலாம். பணமாக முதலீடு செய்தால் மட்டுமே பங்கு பெறும்.',
  },
  {
    id: 'startnet',
    name: 'StartNet',
    short: 'StartNet',
    body: 'Runs the programme, venture building, capital and market access, and takes a small founding stake.',
    bodyTa: 'திட்டத்தை நடத்துதல், நிறுவனக் கட்டமைப்பு, முதலீடு, சந்தை அணுகல் ஆகியவற்றைக் கவனித்து, சிறிய நிறுவனர் பங்கைப் பெறுகிறது.',
  },
];

// Standard terms (Book 2 §3.1; Book 1 Part A §3.1). Illustrative split at formation [C], subject to legal review.
// Colours validated with the dataviz palette validator (light surface): all six checks pass.
export const TERMS = {
  intro: 'We publish one set of terms and agree them once per institution, not company by company.',
  introTa: 'நாங்கள் ஒரே தொகுப்பு விதிமுறைகளை வெளியிடுகிறோம்; ஒவ்வொரு நிறுவனத்துக்கும் தனித்தனியாக அல்ல, ஒவ்வொரு கல்வி நிறுவனத்துடனும் ஒரு முறை மட்டும் ஒப்புக்கொள்கிறோம்.',
  note: 'Illustrative split at formation. Final terms follow each institution’s IP policy.',
  noteTa: 'நிறுவனம் தொடங்கும்போது உள்ள விளக்கப் பங்கீடு. இறுதி விதிமுறைகள் ஒவ்வொரு கல்வி நிறுவனத்தின் அறிவுசார் சொத்துக் கொள்கையைப் பின்பற்றும்.',
  ranges: 'Ranges: institution 5–10%, StartNet 3–7%.',
  rangesTa: 'வரம்புகள்: கல்வி நிறுவனம் 5–10%, StartNet 3–7%.',
  status: 'Draft — subject to legal review',
  statusTa: 'வரைவு — சட்ட ஆய்வுக்கு உட்பட்டது',
  split: [
    { id: 'founders', label: 'Founders', labelTa: 'நிறுவனர்கள்', share: 78, range: null, color: 'var(--sn-research-600)', role: 'Scholar or faculty founders lead the company and hold a clear majority.', roleTa: 'ஆய்வாளர் அல்லது பேராசிரியர் நிறுவனர்கள் நிறுவனத்தை வழிநடத்தி, தெளிவான பெரும்பான்மைப் பங்கை வைத்திருப்பார்கள்.' },
    { id: 'esop', label: 'ESOP pool', labelTa: 'ESOP தொகுப்பு', share: 10, range: null, color: 'var(--dv-2)', role: 'Employee stock option pool, set aside at formation.', roleTa: 'நிறுவனம் தொடங்கும்போதே ஒதுக்கப்படும் பணியாளர் பங்கு விருப்பத் தொகுப்பு.' },
    { id: 'institution', label: 'Institution', labelTa: 'கல்வி நிறுவனம்', share: 7, range: '5–10%', color: 'var(--sn-connect-500)', role: 'Provides IP, lab access and a host incubator; takes a small stake and/or royalty.', roleTa: 'அறிவுசார் சொத்து, ஆய்வக அணுகல், இன்குபேட்டர் ஆகியவற்றை வழங்குகிறது; சிறிய பங்கு மற்றும்/அல்லது ராயல்டியைப் பெறுகிறது.' },
    { id: 'startnet', label: 'StartNet', share: 5, range: '3–7%', color: 'var(--dv-4)', role: 'Runs the programme, venture building, capital and market access; takes a small founding stake.', roleTa: 'திட்டம், நிறுவனக் கட்டமைப்பு, முதலீடு, சந்தை அணுகல் ஆகியவற்றை நடத்துகிறது; சிறிய நிறுவனர் பங்கைப் பெறுகிறது.' },
  ],
};

// Labs (Book 2 §3.1.1).
export const LABS_PAGE = {
  // SEO: primary "research labs Tamil Nadu". SEO-TA: pending native review
  seoTitle: 'StartNet Labs: problem-first research labs in Tamil Nadu',
  seoTitleTa: 'StartNet Labs: சிக்கலிலிருந்து தொடங்கும் ஆய்வகங்கள்',
  meta: 'Hub-and-spoke labs that point research at real customers: Agentic AI, Ontology & Knowledge, Physical AI and Drug Discovery. Wave 1 launches 2027.',
  metaTa: 'ஆய்வை உண்மையான வாடிக்கையாளர்களை நோக்கித் திருப்பும் ஆய்வகங்கள்: Agentic AI, Ontology & Knowledge, Physical AI, Drug Discovery. முதல் அலை 2027-இல்.', // SEO-TA: pending native review
  h1: 'Research pointed at a customer before it becomes a company.',
  h1Ta: 'நிறுவனமாக மாறும் முன்பே வாடிக்கையாளரை நோக்கித் திருப்பப்படும் ஆய்வு.',
  sub: 'A StartNet Lab is a network, not a building. Each has a host institution, three to five partner institutions, one or two industry sponsors, a faculty Lab Director and a StartNet venture lead.',
  subTa: 'StartNet ஆய்வகம் ஒரு கட்டடம் அல்ல, ஒரு வலையமைப்பு. ஒவ்வொன்றிலும் ஒரு தலைமைக் கல்வி நிறுவனம், மூன்று முதல் ஐந்து கூட்டாளர் கல்வி நிறுவனங்கள், ஒன்று அல்லது இரண்டு தொழில்துறை ஸ்பான்சர்கள், ஒரு பேராசிரியர் ஆய்வக இயக்குநர், ஒரு StartNet வென்ச்சர் பொறுப்பாளர் இருப்பார்கள்.',
};

export const LAB_COMMITMENTS = [
  { id: 'lab-ps', value: 10, label: 'Problem statements (minimum), each co-signed by an industry, GCC or government sponsor', labelTa: 'சிக்கல் அறிக்கைகள் (குறைந்தபட்சம்), ஒவ்வொன்றும் தொழில்துறை, GCC அல்லது அரசு ஸ்பான்சரின் இணைக் கையொப்பத்துடன்' },
  { id: 'lab-fellows', value: 20, label: 'Scholar Founders Fellows through the 7-week sprint', labelTa: '7 வாரப் பயிற்சியை முடிக்கும் Scholar Founders Fellowship உறுப்பினர்கள்' },
  { id: 'lab-poc', value: 6, label: 'Teams with a funded proof of concept', labelTa: 'நிதியளிக்கப்பட்ட கருத்துச் சான்றுடன் கூடிய குழுக்கள்' },
  { id: 'lab-companies', value: '2–3', label: 'Companies formed on standard terms', labelTa: 'நிலையான விதிமுறைகளில் உருவாகும் நிறுவனங்கள்' },
];

export const LAB_STOPPING_RULE = 'No company formed in 24 months means the Lab closes or pivots, and we publish the decision.';
export const LAB_STOPPING_RULE_TA = '24 மாதங்களில் ஒரு நிறுவனமும் உருவாகவில்லை என்றால், ஆய்வகம் மூடப்படும் அல்லது திசை மாற்றப்படும்; அந்த முடிவை நாங்கள் வெளியிடுவோம்.';

export const LABS = [
  {
    slug: 'agentic-ai',
    name: 'Agentic AI Lab',
    sector: 'agentic-ai',
    sub: 'Enterprise agents that work in production: evaluation, safety and Tamil- and Indic-language agents, built against real GCC problems.',
    subTa: 'நடைமுறைப் பயன்பாட்டில் உண்மையாக இயங்கும் நிறுவன AI முகவர்கள்: மதிப்பீடு, பாதுகாப்பு, தமிழ் மற்றும் இந்திய மொழி முகவர்கள்; உண்மையான GCC சிக்கல்களை வைத்து உருவாக்கப்படுகின்றன.',
    art: { variant: 'network', seed: 11 },
  },
  {
    slug: 'ontology-knowledge',
    name: 'Ontology & Knowledge Lab',
    sector: 'ontology-knowledge',
    sub: 'Knowledge graphs and domain models that make health, legal, manufacturing and government data usable.',
    subTa: 'சுகாதாரம், சட்டம், உற்பத்தி, அரசுத் தரவுகளைப் பயன்படுத்தக்கூடியதாக மாற்றும் அறிவு வரைபடங்களும் துறை மாதிரிகளும்.',
    art: { variant: 'kolam', seed: 23 },
  },
  {
    slug: 'physical-ai',
    name: 'Physical AI Lab',
    sector: 'physical-ai',
    sub: "Robots, autonomy, vision and edge AI, tested with the manufacturers in Tamil Nadu's automotive and electronics base.",
    subTa: 'ரோபோக்கள், தன்னியக்கம், கணினிப் பார்வை, எட்ஜ் AI; தமிழ்நாட்டின் வாகன மற்றும் மின்னணு உற்பத்தியாளர்களுடன் சோதிக்கப்படுகின்றன.',
    art: { variant: 'grid', seed: 37 },
  },
  {
    slug: 'drug-discovery',
    name: 'Drug Discovery Lab',
    sector: 'drug-discovery',
    sub: 'AI-assisted molecule design and biologics. Long timelines, computation first, with bio-incubators and pharma partners.',
    subTa: 'AI உதவியுடன் மூலக்கூறு வடிவமைப்பும் உயிரியல் மருந்துகளும். நீண்ட காலக்கெடு, கணினி முதன்மை; உயிரியல் இன்குபேட்டர்கள், மருந்து நிறுவனக் கூட்டாளர்களுடன்.',
    art: { variant: 'dot', seed: 41 },
  },
];

export const LABS_WAVE2 = ['Climate & EV Materials', 'MedTech', 'Agri & Food', 'Semiconductor Design'];
export const LABS_WAVE2_NOTE = 'Proposed. Not yet committed. Tell us if your institution wants to host one.';
export const LABS_WAVE2_NOTE_TA = 'முன்மொழியப்பட்டவை. இன்னும் உறுதி செய்யப்படவில்லை. உங்கள் கல்வி நிறுவனம் இவற்றில் ஒன்றை நடத்த விரும்பினால் எங்களிடம் சொல்லுங்கள்.';

export const LAB_WHO = "PhD scholars, post-docs and faculty in the field; final-year master's students by invitation";
export const LAB_WHO_TA = 'அந்தத் துறையில் உள்ள முனைவர் பட்ட ஆய்வாளர்கள், முனைவர் பட்டத்துக்குப் பிந்தைய ஆய்வாளர்கள், பேராசிரியர்கள்; இறுதியாண்டு முதுநிலை மாணவர்கள் அழைப்பின் பேரில்';
export const LAB_GET = 'A place in the Scholar Founders Fellowship, mentors from industry, a funded proof of concept if selected, help with grants, and standard terms if you form a company';
export const LAB_GET_TA = 'Scholar Founders Fellowship-இல் ஓர் இடம், தொழில்துறை வழிகாட்டிகள், தேர்வானால் நிதியளிக்கப்பட்ட கருத்துச் சான்று, மானியங்களுக்கான உதவி, நிறுவனம் தொடங்கினால் நிலையான விதிமுறைகள்';

// Problem statements (Book 1 Part B §2.2 T15, §10 facets: sector · status · institution).
// Sponsor-signed statements are not yet published; the list shows each Lab's stated focus areas
// (taken from the Lab sub-heads above), each waiting on a sponsor and a date.
export const SECTORS = [
  { value: 'agentic-ai', label: 'Agentic AI' },
  { value: 'ontology-knowledge', label: 'Ontology & Knowledge' },
  { value: 'physical-ai', label: 'Physical AI' },
  { value: 'drug-discovery', label: 'Drug Discovery' },
];
export const PS_STATUSES = [
  { value: 'open', label: 'Open', labelTa: 'திறந்துள்ளது' },
  { value: 'closing-soon', label: 'Closing soon', labelTa: 'விரைவில் முடிகிறது' },
  { value: 'upcoming', label: 'Opening soon', labelTa: 'விரைவில் திறக்கிறது' },
  { value: 'closed', label: 'Closed', labelTa: 'முடிந்தது' },
];
export const PS_INSTITUTIONS = [{ value: 'tbc', label: 'Host institution to be confirmed', labelTa: 'தலைமைக் கல்வி நிறுவனம் உறுதி செய்யப்பட உள்ளது' }];

export const PROBLEM_AREAS = [
  { id: 'ps-agents-production', sector: 'agentic-ai', lab: 'Agentic AI Lab', title: 'Enterprise agents that work in production', titleTa: 'நடைமுறைப் பயன்பாட்டில் இயங்கும் நிறுவன AI முகவர்கள்', status: 'upcoming', institution: 'tbc' },
  { id: 'ps-agents-eval', sector: 'agentic-ai', lab: 'Agentic AI Lab', title: 'Evaluation and safety of agents', titleTa: 'AI முகவர்களின் மதிப்பீடும் பாதுகாப்பும்', status: 'upcoming', institution: 'tbc' },
  { id: 'ps-agents-indic', sector: 'agentic-ai', lab: 'Agentic AI Lab', title: 'Tamil- and Indic-language agents', titleTa: 'தமிழ் மற்றும் இந்திய மொழி AI முகவர்கள்', status: 'upcoming', institution: 'tbc' },
  { id: 'ps-kg-health', sector: 'ontology-knowledge', lab: 'Ontology & Knowledge Lab', title: 'Knowledge graphs and domain models for health data', titleTa: 'சுகாதாரத் தரவுக்கான அறிவு வரைபடங்களும் துறை மாதிரிகளும்', status: 'upcoming', institution: 'tbc' },
  { id: 'ps-kg-legal', sector: 'ontology-knowledge', lab: 'Ontology & Knowledge Lab', title: 'Knowledge graphs and domain models for legal data', titleTa: 'சட்டத் தரவுக்கான அறிவு வரைபடங்களும் துறை மாதிரிகளும்', status: 'upcoming', institution: 'tbc' },
  { id: 'ps-kg-mfg', sector: 'ontology-knowledge', lab: 'Ontology & Knowledge Lab', title: 'Knowledge graphs and domain models for manufacturing data', titleTa: 'உற்பத்தித் தரவுக்கான அறிவு வரைபடங்களும் துறை மாதிரிகளும்', status: 'upcoming', institution: 'tbc' },
  { id: 'ps-kg-gov', sector: 'ontology-knowledge', lab: 'Ontology & Knowledge Lab', title: 'Knowledge graphs and domain models for government data', titleTa: 'அரசுத் தரவுக்கான அறிவு வரைபடங்களும் துறை மாதிரிகளும்', status: 'upcoming', institution: 'tbc' },
  { id: 'ps-phys-robots', sector: 'physical-ai', lab: 'Physical AI Lab', title: 'Robots and autonomy for automotive and electronics manufacturers', titleTa: 'வாகன மற்றும் மின்னணு உற்பத்தியாளர்களுக்கான ரோபோக்களும் தன்னியக்கமும்', status: 'upcoming', institution: 'tbc' },
  { id: 'ps-phys-vision', sector: 'physical-ai', lab: 'Physical AI Lab', title: 'Vision and edge AI for automotive and electronics manufacturers', titleTa: 'வாகன மற்றும் மின்னணு உற்பத்தியாளர்களுக்கான கணினிப் பார்வையும் எட்ஜ் AI-யும்', status: 'upcoming', institution: 'tbc' },
  { id: 'ps-drug-molecule', sector: 'drug-discovery', lab: 'Drug Discovery Lab', title: 'AI-assisted molecule design', titleTa: 'AI உதவியுடன் மூலக்கூறு வடிவமைப்பு', status: 'upcoming', institution: 'tbc' },
  { id: 'ps-drug-bio', sector: 'drug-discovery', lab: 'Drug Discovery Lab', title: 'Biologics, computation first', titleTa: 'உயிரியல் மருந்துகள், கணினி முதன்மை', status: 'upcoming', institution: 'tbc' },
];

// Fellowship, Summit, IPP (Book 2 §3.1.2, verbatim).
// SEO: primary "fellowship for PhD scholars", secondary "customer discovery". SEO-TA: pending native review
export const FELLOWSHIP = {
  seoTitle: 'Scholar Founders Fellowship for PhD scholars',
  seoTitleTa: 'Scholar Founders Fellowship: ஆய்வாளர்களுக்கு',
  meta: 'A 7-week customer-discovery sprint for PhD scholars and faculty in Tamil Nadu: 100 customer interviews before money, then a go/no-go decision. Apply now.',
  metaTa: 'முனைவர் பட்ட ஆய்வாளர்கள், பேராசிரியர்களுக்கான 7 வார வாடிக்கையாளர் கண்டறிதல் பயிற்சி: பணத்துக்கு முன் 100 நேர்காணல்கள், பிறகு தொடர்வதா என்ற முடிவு.',
  h1: '100 conversations before a single rupee.',
  h1Ta: 'ஒரு ரூபாய் செலவழிக்கும் முன் 100 உரையாடல்கள்.',
  body: "Seven weeks of structured customer discovery. You'll talk to at least 100 potential customers, test whether your research solves a problem someone will pay for, and finish with evidence and a go/no-go decision.",
  bodyTa: 'ஏழு வாரக் கட்டமைக்கப்பட்ட வாடிக்கையாளர் கண்டறிதல். குறைந்தது 100 சாத்தியமான வாடிக்கையாளர்களிடம் பேசுவீர்கள்; யாரோ பணம் கொடுத்துத் தீர்க்க விரும்பும் சிக்கலை உங்கள் ஆய்வு தீர்க்கிறதா என்று சோதிப்பீர்கள்; சான்றுகளுடனும் தொடரலாமா வேண்டாமா என்ற முடிவுடனும் நிறைவு செய்வீர்கள்.',
  fee: '[placeholder — mostly sponsor- or grant-funded seats]',
  feeTa: '[விவரம் வர உள்ளது — பெரும்பாலும் ஸ்பான்சர் அல்லது மானிய நிதியிலான இடங்கள்]',
  cta: 'Apply for the next cohort',
  ctaTa: 'அடுத்த குழுவுக்கு விண்ணப்பியுங்கள்',
  micro: 'Next cohort opens [date placeholder]. Get notified.',
  microTa: 'அடுத்த குழு [தேதி அறிவிக்கப்பட உள்ளது] தொடங்குகிறது. அறிவிப்பைப் பெறுங்கள்.',
};

// SEO: primary "lab to market". SEO-TA: pending native review
export const SUMMIT = {
  seoTitle: 'Lab-to-Market Summit: research demos for GCCs',
  seoTitleTa: 'Lab-to-Market Summit: ஆய்வகச் செயல்விளக்கம்',
  meta: 'The annual StartNet Research day where lab teams demo to GCCs, investors and government, and next year’s problem statements are set. Register interest.',
  metaTa: 'ஆய்வகக் குழுக்கள் GCC-கள், முதலீட்டாளர்கள், அரசு முன் செயல்விளக்கம் அளித்து, அடுத்த ஆண்டின் சிக்கல் அறிக்கைகள் அமைக்கப்படும் ஆண்டு நிகழ்வு.',
  h1: 'Where lab teams meet their first customers.',
  h1Ta: 'ஆய்வகக் குழுக்கள் தங்கள் முதல் வாடிக்கையாளர்களைச் சந்திக்கும் இடம்.',
  body: 'Lab teams demo to GCCs, investors and government; sponsors post next year’s problem statements; we launch the TN Research Commercialisation Index.',
  bodyTa: 'ஆய்வகக் குழுக்கள் GCC-கள், முதலீட்டாளர்கள், அரசு முன் செயல்விளக்கம் அளிக்கின்றன; ஸ்பான்சர்கள் அடுத்த ஆண்டின் சிக்கல் அறிக்கைகளை வெளியிடுகின்றனர்; TN Research Commercialisation Index-ஐ நாங்கள் வெளியிடுகிறோம்.',
  facts: 'Date, venue and co-host:',
  factsTa: 'தேதி, இடம், இணை நடத்துநர்:',
};

// SEO: primary "university innovation / startup policy" (NISP). SEO-TA: pending native review
export const IPP = {
  seoTitle: 'Institution Partner Programme for universities',
  seoTitleTa: 'Institution Partner Programme: கல்லூரிகளுக்கு',
  meta: 'An annual StartNet package for universities and colleges in Tamil Nadu: Lab membership, innovation policy set-up, faculty development and founder outcomes.',
  metaTa: 'பல்கலைக்கழகங்கள், கல்லூரிகளுக்கான ஆண்டுத் தொகுப்பு: ஆய்வக உறுப்பினர், புத்தாக்கக் கொள்கை அமைப்பு, பேராசிரியர் மேம்பாடு, நிறுவனர் விளைவுகள்.',
  h1: 'Measure your institution by the founders it produces.',
  h1Ta: 'உங்கள் கல்வி நிறுவனத்தை அது உருவாக்கும் நிறுவனர்களைக் கொண்டு அளவிடுங்கள்.',
  body: "One annual package: membership of a StartNet Lab, a policy kit and IP committee set-up aligned with AICTE's innovation and startup policy, faculty development, AI-readiness services, and a Campus Innovation Index score.",
  bodyTa: 'ஒரே ஆண்டுத் தொகுப்பு: ஒரு StartNet ஆய்வகத்தில் உறுப்பினர், AICTE-இன் புத்தாக்க மற்றும் ஸ்டார்ட்அப் கொள்கைக்கு ஏற்ற கொள்கைத் தொகுப்பும் IP குழு அமைப்பும், பேராசிரியர் மேம்பாடு, AI-தயார்நிலைச் சேவைகள், Campus Innovation Index மதிப்பெண்.',
  includes: [
    'Membership of a StartNet Lab',
    "A policy kit and IP committee set-up aligned with AICTE's innovation and startup policy",
    'Faculty development',
    'AI-readiness services',
    'A Campus Innovation Index score',
  ],
  includesTa: [
    'ஒரு StartNet ஆய்வகத்தில் உறுப்பினர்',
    'AICTE-இன் புத்தாக்க மற்றும் ஸ்டார்ட்அப் கொள்கைக்கு ஏற்ற கொள்கைத் தொகுப்பும் IP குழு அமைப்பும்',
    'பேராசிரியர் மேம்பாடு',
    'AI-தயார்நிலைச் சேவைகள்',
    'Campus Innovation Index மதிப்பெண்',
  ],
  cta: 'Book a consultation',
  ctaTa: 'ஆலோசனைக்கு நேரம் பதிவு செய்யுங்கள்',
};

// Who it's for / who pays (Book 2 §3.1, verbatim, split into its four sentences).
export const WHO = [
  { id: 'scholars', who: 'Scholars and faculty', whoTa: 'ஆய்வாளர்களும் பேராசிரியர்களும்', gets: 'A founder path, a fellowship and grant support.', getsTa: 'நிறுவனர் பாதை, ஒரு ஃபெல்லோஷிப், மானிய உதவி.' },
  { id: 'institutions', who: 'Institutions', whoTa: 'கல்வி நிறுவனங்கள்', gets: 'Spinouts, patents and innovation metrics.', getsTa: 'ஆய்விலிருந்து பிறக்கும் நிறுவனங்கள், காப்புரிமைகள், புத்தாக்க அளவீடுகள்.' },
  { id: 'gccs', who: 'GCCs', whoTa: 'GCC-கள்', gets: 'Problem-solving research and access to IP and talent.', getsTa: 'சிக்கல்களைத் தீர்க்கும் ஆய்வு, அறிவுசார் சொத்து மற்றும் திறமையாளர்களுக்கான அணுகல்.' },
  { id: 'government', who: 'Government', whoTa: 'அரசு', gets: 'A deep-tech pipeline.', getsTa: 'ஆழ்-தொழில்நுட்ப நிறுவனங்களின் தொடர் வரத்து.' },
];

// FAQs grouped by scholar / faculty / institution (Book 4 E2 F8). Questions come from the scholar
// persona's objections and top tasks (Book 1 Part A §3.1); answers use Book 2 copy only.
export const FAQ_GROUPS = [
  {
    id: 'scholars',
    title: 'For scholars',
    titleTa: 'ஆய்வாளர்களுக்கு',
    items: [
      // AEO FAQ: drafted from Book 2 §3.1 sub-head — StartNet review. SEO-TA: pending native review
      { id: 'faq-what', question: 'What is StartNet Research?', questionTa: 'StartNet Research என்றால் என்ன?', answer: 'StartNet Research helps PhD scholars, post-docs and faculty in Tamil Nadu turn research into products and companies, with their institution and an industry partner on the same side of the table.', answerTa: 'தமிழ்நாட்டின் முனைவர் பட்ட ஆய்வாளர்கள், முனைவர் பட்டத்துக்குப் பிந்தைய ஆய்வாளர்கள், பேராசிரியர்கள் தங்கள் ஆய்வைத் தயாரிப்புகளாகவும் நிறுவனங்களாகவும் மாற்ற StartNet Research உதவுகிறது; அவர்களின் கல்வி நிறுவனமும் ஒரு தொழில்துறைக் கூட்டாளரும் அவர்களுடன் ஒரே பக்கத்தில் இருப்பார்கள்.' },
      { id: 'faq-who', question: 'Who can apply?', questionTa: 'யார் விண்ணப்பிக்கலாம்?', answer: "PhD scholars, post-docs and faculty in the field. Final-year master's students can join by invitation.", answerTa: 'அந்தத் துறையில் உள்ள முனைவர் பட்ட ஆய்வாளர்கள், முனைவர் பட்டத்துக்குப் பிந்தைய ஆய்வாளர்கள், பேராசிரியர்கள். இறுதியாண்டு முதுநிலை மாணவர்கள் அழைப்பின் பேரில் சேரலாம்.' },
      { id: 'faq-sprint', question: 'What happens in the Fellowship?', questionTa: 'Fellowship-இல் என்ன நடக்கும்?', answer: "Seven weeks of structured customer discovery. You'll talk to at least 100 potential customers, test whether your research solves a problem someone will pay for, and finish with evidence and a go/no-go decision.", answerTa: 'ஏழு வாரக் கட்டமைக்கப்பட்ட வாடிக்கையாளர் கண்டறிதல். குறைந்தது 100 சாத்தியமான வாடிக்கையாளர்களிடம் பேசுவீர்கள்; யாரோ பணம் கொடுத்துத் தீர்க்க விரும்பும் சிக்கலை உங்கள் ஆய்வு தீர்க்கிறதா என்று சோதிப்பீர்கள்; சான்றுகளுடனும் தொடரலாமா வேண்டாமா என்ற முடிவுடனும் நிறைவு செய்வீர்கள்.' },
      { id: 'faq-fee', question: 'What does it cost?', questionTa: 'கட்டணம் எவ்வளவு?', answer: 'Fee: [placeholder — mostly sponsor- or grant-funded seats].', answerTa: 'கட்டணம்: [விவரம் வர உள்ளது — பெரும்பாலும் ஸ்பான்சர் அல்லது மானிய நிதியிலான இடங்கள்].' },
      { id: 'faq-get', question: 'What do I get?', questionTa: 'எனக்கு என்ன கிடைக்கும்?', answer: 'A place in the Scholar Founders Fellowship, mentors from industry, a funded proof of concept if selected, help with grants, and standard terms if you form a company.', answerTa: 'Scholar Founders Fellowship-இல் ஓர் இடம், தொழில்துறை வழிகாட்டிகள், தேர்வானால் நிதியளிக்கப்பட்ட கருத்துச் சான்று, மானியங்களுக்கான உதவி, நிறுவனம் தொடங்கினால் நிலையான விதிமுறைகள்.' },
    ],
  },
  {
    id: 'faculty',
    title: 'For faculty',
    titleTa: 'பேராசிரியர்களுக்கு',
    items: [
      { id: 'faq-allow', question: 'Will my university allow it?', questionTa: 'என் பல்கலைக்கழகம் இதை அனுமதிக்குமா?', answer: "Faculty can use leave or sabbatical provisions under AICTE's National Innovation and Startup Policy, where their institution has adopted it. We agree one set of terms once per institution, not company by company.", answerTa: 'தங்கள் கல்வி நிறுவனம் AICTE-இன் தேசியப் புத்தாக்க மற்றும் ஸ்டார்ட்அப் கொள்கையை ஏற்றிருந்தால், பேராசிரியர்கள் அதன் கீழ் உள்ள விடுப்பு அல்லது சிறப்பு விடுப்பு வசதிகளைப் பயன்படுத்தலாம். ஒவ்வொரு நிறுவனத்துக்கும் தனித்தனியாக அல்ல, ஒவ்வொரு கல்வி நிறுவனத்துடனும் ஒரு முறை மட்டும் ஒரே தொகுப்பு விதிமுறைகளை ஒப்புக்கொள்கிறோம்.' },
      { id: 'faq-ip', question: 'Who owns the IP?', questionTa: 'அறிவுசார் சொத்து யாருக்குச் சொந்தம்?', answer: 'The institution provides IP, lab access and a host incubator, and the company is formed with an IP licence on standard terms. Final terms follow each institution’s IP policy.', answerTa: 'கல்வி நிறுவனம் அறிவுசார் சொத்து, ஆய்வக அணுகல், இன்குபேட்டர் ஆகியவற்றை வழங்குகிறது; நிலையான விதிமுறைகளின்படி IP உரிமத்துடன் நிறுவனம் உருவாகிறது. இறுதி விதிமுறைகள் ஒவ்வொரு கல்வி நிறுவனத்தின் IP கொள்கையைப் பின்பற்றும்.' },
      { id: 'faq-share', question: 'How much of the company do founders hold?', questionTa: 'நிறுவனத்தில் நிறுவனர்களின் பங்கு எவ்வளவு?', answer: 'Scholar or faculty founders lead the company and hold a clear majority. Illustrative split at formation: founders 78%, ESOP pool 10%, institution 7%, StartNet 5% [C]. This is a draft, subject to legal review.', answerTa: 'ஆய்வாளர் அல்லது பேராசிரியர் நிறுவனர்கள் நிறுவனத்தை வழிநடத்தி, தெளிவான பெரும்பான்மைப் பங்கை வைத்திருப்பார்கள். தொடக்கத்தில் விளக்கப் பங்கீடு: நிறுவனர்கள் 78%, ESOP தொகுப்பு 10%, கல்வி நிறுவனம் 7%, StartNet 5% [C]. இது சட்ட ஆய்வுக்கு உட்பட்ட வரைவு.' },
      { id: 'faq-industry', question: 'Does the industry partner take equity?', questionTa: 'தொழில்துறைக் கூட்டாளர் பங்கு பெறுமா?', answer: 'Only if it invests cash. The GCC or industry partner brings the problem, funds the proof of concept and can become the first customer.', answerTa: 'பணமாக முதலீடு செய்தால் மட்டுமே. GCC அல்லது தொழில்துறைக் கூட்டாளர் சிக்கலைக் கொண்டு வருகிறது, கருத்துச் சான்றுக்கு நிதியளிக்கிறது, முதல் வாடிக்கையாளராகவும் ஆகலாம்.' },
    ],
  },
  {
    id: 'institutions',
    title: 'For institutions',
    titleTa: 'கல்வி நிறுவனங்களுக்கு',
    items: [
      { id: 'faq-inst-get', question: 'What does the institution get?', questionTa: 'கல்வி நிறுவனத்துக்கு என்ன கிடைக்கும்?', answer: 'Spinouts, patents and innovation metrics. The institution takes a small stake and/or royalty in each company formed.', answerTa: 'ஆய்விலிருந்து பிறக்கும் நிறுவனங்கள், காப்புரிமைகள், புத்தாக்க அளவீடுகள். உருவாகும் ஒவ்வொரு நிறுவனத்திலும் கல்வி நிறுவனம் சிறிய பங்கு மற்றும்/அல்லது ராயல்டியைப் பெறுகிறது.' },
      { id: 'faq-ipp', question: 'What is the Institution Partner Programme?', questionTa: 'Institution Partner Programme என்றால் என்ன?', answer: "One annual package: membership of a StartNet Lab, a policy kit and IP committee set-up aligned with AICTE's innovation and startup policy, faculty development, AI-readiness services, and a Campus Innovation Index score. Indicative price: from ₹5 L a year by size [C].", answerTa: 'ஒரே ஆண்டுத் தொகுப்பு: ஒரு StartNet ஆய்வகத்தில் உறுப்பினர், AICTE-இன் புத்தாக்க மற்றும் ஸ்டார்ட்அப் கொள்கைக்கு ஏற்ற கொள்கைத் தொகுப்பும் IP குழு அமைப்பும், பேராசிரியர் மேம்பாடு, AI-தயார்நிலைச் சேவைகள், Campus Innovation Index மதிப்பெண். தோராயக் கட்டணம்: அளவைப் பொறுத்து ஆண்டுக்கு ₹5 லட்சம் முதல் [C].' },
      { id: 'faq-host', question: 'Can our institution host a Lab?', questionTa: 'எங்கள் கல்வி நிறுவனம் ஓர் ஆய்வகத்தை நடத்த முடியுமா?', answer: 'Wave 2 Labs (Climate & EV Materials, MedTech, Agri & Food, Semiconductor Design) are proposed, not yet committed. Tell us if your institution wants to host one.', answerTa: 'இரண்டாம் அலை ஆய்வகங்கள் (Climate & EV Materials, MedTech, Agri & Food, Semiconductor Design) முன்மொழியப்பட்டவை, இன்னும் உறுதி செய்யப்படவில்லை. உங்கள் கல்வி நிறுவனம் ஒன்றை நடத்த விரும்பினால் எங்களிடம் சொல்லுங்கள்.' },
      { id: 'faq-stop', question: 'What if a Lab does not produce companies?', questionTa: 'ஓர் ஆய்வகம் நிறுவனங்களை உருவாக்கவில்லை என்றால்?', answer: 'No company formed in 24 months means the Lab closes or pivots, and we publish the decision.', answerTa: LAB_STOPPING_RULE_TA },
    ],
  },
];
