// StartNet Vibe content. Copy is Book 2 §3.2 (Vibe + child pages) and §5.2 (Vibathon 2027), verbatim where it exists.
// Figures: Book 2 §3.2 / §5.2 and Book 1 Part A §2.1 (objective B4).
// Tamil: CTAs from Book 2 §14.3 (TA below); every other `…Ta` field is a draft written for this site and is
// PENDING NATIVE TAMIL REVIEW (Book 2 Appendix A item 14). Brand and programme names (StartNet Vibe, Vibathon,
// Vibe Academy, Vibe Campus, Vibe Launchpad, Vibe Clubs, Vibe Summit, StartNet X) stay in Latin script.

import { snxLink } from '../../../lib/links.js';

/** Tamil drafts from Book 2 §14.3. Look up with `tx(t, 'English')`; strings without a Tamil draft stay English. */
export const TA = {
  'Join StartNet': 'StartNet-இல் இணையுங்கள்',
  'Find your programme': 'உங்கள் திட்டத்தைக் கண்டறியுங்கள்',
  'See upcoming events': 'வரவிருக்கும் நிகழ்வுகளைப் பாருங்கள்',
  Register: 'பதிவு செய்யுங்கள்',
  'Register your team': 'உங்கள் குழுவைப் பதிவு செய்யுங்கள்',
  'Apply now': 'இப்போதே விண்ணப்பியுங்கள்',
  'Chat on WhatsApp': 'WhatsApp-இல் பேசுங்கள்',
  'Get updates on WhatsApp': 'WhatsApp-இல் தகவல்களைப் பெறுங்கள்',
  'Partner with us': 'எங்களுடன் கூட்டு சேருங்கள்',
  'Talk to us': 'எங்களிடம் பேசுங்கள்',
  'Create your free profile': 'உங்கள் இலவச சுயவிவரத்தை உருவாக்குங்கள்',
  Events: 'நிகழ்வுகள்',
  Programmes: 'திட்டங்கள்',
  'Student → Founder': 'மாணவர் → நிறுவனர்',
};
export const tx = (t, en) => t(en, TA[en]);

/** Read a bilingual field: tr(t, obj, 'title') → t(obj.title, obj.titleTa). */
export const tr = (t, obj, key) => (obj ? t(obj[key], obj[`${key}Ta`]) : undefined);

export const PH = '[placeholder — to be supplied by StartNet]';
export const PH_TA = '[StartNet வழங்க உள்ளது]';

/** Vibathon 2027 registration on StartNet X — the same path the event page and programme record use. */
export const vibathonRegisterLink = (lang, extra = {}) =>
  snxLink('/events/vibathon-2027/register', { brand: 'vibe', src: 'vibe-vibathon', lang, ...extra });

/* ------------------------------------------------------------------ Vibe home */

// SEO: primary "AI hackathon for college students Tamil Nadu", secondary "vibe coding course" (Book 1 §9.2).
// SEO-TA: pending native review (Tamil keyword "கல்லூரி மாணவர்களுக்கான ஹேக்கத்தான்", Book 1 §9.2)
export const VIBE_HOME = {
  seoTitle: 'StartNet Vibe: AI hackathon and startups for students',
  seoTitleTa: 'StartNet Vibe: கல்லூரி மாணவர்களுக்கான ஹேக்கத்தான்',
  seoDescription:
    'For college students across Tamil Nadu: the Vibathon AI hackathon, Vibe Academy in Tamil and English, campus build nights, pre-incubation and Vibe Clubs.',
  seoDescriptionTa:
    'தமிழ்நாட்டுக் கல்லூரி மாணவர்களுக்கு: Vibathon AI ஹேக்கத்தான், தமிழிலும் ஆங்கிலத்திலும் Vibe Academy, கல்லூரி உருவாக்க இரவுகள், முன்-இன்குபேஷன், Vibe Clubs.',
  h1: 'Build something real before you graduate.',
  h1Ta: 'பட்டம் பெறும் முன்பே உண்மையான ஒன்றை உருவாக்குங்கள்.',
  lede:
    'StartNet Vibe takes students from first idea to first company: hackathons, an academy for building in the AI era, campus events and pre-incubation. In Tamil and English, in every district.',
  ledeTa:
    'முதல் யோசனையிலிருந்து முதல் நிறுவனம் வரை மாணவர்களை StartNet Vibe அழைத்துச் செல்கிறது: ஹேக்கத்தான்கள், AI காலத்தில் உருவாக்கக் கற்றுத்தரும் அகாடமி, கல்லூரி நிகழ்வுகள், முன்-இன்குபேஷன். தமிழிலும் ஆங்கிலத்திலும், ஒவ்வொரு மாவட்டத்திலும்.',
  closing: 'Your first step is free.',
  closingTa: 'உங்கள் முதல் அடி இலவசம்.',
};

/** Book 2 §3.2 "The journey". */
export const VIBE_JOURNEY = [
  { id: 'spark', verb: 'Spark', verbTa: 'தூண்டல்', via: 'Vibe Campus', to: '/vibe/campus' },
  { id: 'learn', verb: 'Learn', verbTa: 'கற்றல்', via: 'Vibe Academy', to: '/vibe/academy' },
  { id: 'build', verb: 'Build', verbTa: 'உருவாக்கம்', via: 'Vibathon', to: '/vibe/vibathon' },
  { id: 'launch', verb: 'Launch', verbTa: 'தொடக்கம்', via: 'Vibe Launchpad', to: '/vibe/launchpad' },
  { id: 'fund', verb: 'Fund', verbTa: 'நிதி', via: 'prizes, CSR grants, state seed schemes', viaTa: 'பரிசுகள், CSR மானியங்கள், மாநில விதை நிதித் திட்டங்கள்', to: null },
];

/** The four ways in (Book 2 §3.2 sub-brand cards). */
export const VIBE_WAYS_IN = [
  {
    id: 'vibathon',
    eyebrow: 'a StartNet Vibe programme',
    eyebrowTa: 'StartNet Vibe திட்டம்',
    title: 'Vibathon',
    body: 'The state-level AI and vibe-coding hackathon. District qualifiers, themed tracks, an industry jury and a business-plan track. Winners go straight into Vibe Launchpad.',
    bodyTa: 'மாநில அளவிலான AI மற்றும் vibe-coding ஹேக்கத்தான். மாவட்டத் தகுதிச் சுற்றுகள், கருப்பொருள் பிரிவுகள், தொழில்துறை நடுவர் குழு, வணிகத் திட்டப் பிரிவு. வெற்றியாளர்கள் நேரடியாக Vibe Launchpad-க்குச் செல்வார்கள்.',
    cta: 'See Vibathon 2027',
    ctaTa: 'Vibathon 2027-ஐப் பாருங்கள்',
    to: '/vibe/vibathon',
    art: { variant: 'network', seed: 11 },
  },
  {
    id: 'academy',
    eyebrow: 'Learn · Tamil & English',
    eyebrowTa: 'கற்றல் · தமிழ் & ஆங்கிலம்',
    title: 'Vibe Academy',
    body: 'Learn AI-assisted coding, product, design and go-to-market in cohorts or at your own pace, in Tamil or English.',
    bodyTa: 'AI உதவியுடன் கோடிங், தயாரிப்பு, வடிவமைப்பு, சந்தைக்குக் கொண்டு செல்லுதல் ஆகியவற்றைக் குழுக்களாகவோ உங்கள் வேகத்திலோ, தமிழிலோ ஆங்கிலத்திலோ கற்றுக்கொள்ளுங்கள்.',
    cta: 'Browse courses',
    ctaTa: 'பாடநெறிகளைப் பாருங்கள்',
    to: '/vibe/academy',
    art: { variant: 'grid', seed: 23 },
  },
  {
    id: 'campus',
    eyebrow: 'Spark · at your college',
    eyebrowTa: 'தூண்டல் · உங்கள் கல்லூரியில்',
    title: 'Vibe Campus',
    body: "A series of events in your college: build nights, talks, founder fireside chats and idea pitches, hosted with your Institution's Innovation Council.",
    bodyTa: 'உங்கள் கல்லூரியில் தொடர் நிகழ்வுகள்: உருவாக்க இரவுகள், உரைகள், நிறுவனர்களுடன் கலந்துரையாடல்கள், யோசனை முன்வைப்புகள்; உங்கள் கல்லூரியின் புத்தாக்கக் குழு (IIC) உடன் இணைந்து.',
    cta: 'See campus events',
    ctaTa: 'கல்லூரி நிகழ்வுகளைப் பாருங்கள்',
    to: '/vibe/campus',
    art: { variant: 'kolam', seed: 37 },
  },
  {
    id: 'clubs',
    eyebrow: 'Student-run · free',
    eyebrowTa: 'மாணவர்கள் நடத்துவது · இலவசம்',
    title: 'Vibe Clubs',
    body: 'Student-run chapters led by Vibe Captains. Meet monthly, build together, run a Vibe Campus night each term and get first access to Vibathon. Free.',
    bodyTa: 'Vibe Captains வழிநடத்தும், மாணவர்கள் நடத்தும் கிளைகள். மாதந்தோறும் சந்தியுங்கள், சேர்ந்து உருவாக்குங்கள், ஒவ்வொரு பருவத்திலும் ஒரு Vibe Campus இரவை நடத்துங்கள், Vibathon-இல் முதல் வாய்ப்பைப் பெறுங்கள். இலவசம்.',
    cta: 'Start a Vibe Club',
    ctaTa: 'Vibe Club-ஐத் தொடங்குங்கள்',
    to: '/vibe/clubs',
    art: { variant: 'dot', seed: 41 },
  },
];

/** Book 2 §3.2 proof band (fallback when /api/metrics?brand=vibe returns nothing). */
export const VIBE_PROOF = {
  metric: {
    id: 'vibe-tier34',
    key: 'vibathon-2025-tier34',
    value: 80,
    unit: '%',
    label: 'of Vibathon 2025 colleges were Tier 3 or 4',
    labelTa: 'Vibathon 2025 கல்லூரிகளில் Tier 3 அல்லது 4 கல்லூரிகள்',
    tag: 'B',
    asAt: 'Vibathon 2025',
    source: 'Vibathon 2025 brochure',
  },
  placeholders: [
    { id: 'colleges', label: 'Colleges active', labelTa: 'செயல்படும் கல்லூரிகள்' },
    { id: 'participants', label: 'Vibathon 2025 participants', labelTa: 'Vibathon 2025 பங்கேற்பாளர்கள்', note: '[placeholder — final attendance, as at date]', noteTa: '[விவரம் வர உள்ளது — இறுதி வருகை, தேதியுடன்]' },
    { id: 'launchpad', label: 'Launchpad teams', labelTa: 'Launchpad குழுக்கள்' },
  ],
};

/* ------------------------------------------------------------------ Vibathon 2027 */

/** Set when StartNet confirms. ISO with IST offset, e.g. '2027-01-12T23:59:00+05:30'. Null renders the placeholder. */
export const VIBATHON_REGISTRATION = { opens: null, closes: null };

export const VIBATHON = {
  // SEO title from Book 2 §5.2 ("avoids 'largest' or 'first'. Keep it that way."). SEO-TA: pending native review
  seoTitle: "Vibathon 2027: Tamil Nadu's AI build hackathon",
  seoTitleTa: 'Vibathon 2027: தமிழ்நாட்டின் AI ஹேக்கத்தான்',
  seoDescription:
    'Build with AI, from your district to the state finale. Free to ₹499 per team. Five tracks, an industry jury and a direct route into Vibe Launchpad.',
  seoDescriptionTa:
    'கல்லூரி மாணவர்களுக்கான AI ஹேக்கத்தான்: மாவட்டத்திலிருந்து மாநில இறுதிப் போட்டி வரை. ஒரு குழுவுக்கு இலவசம் முதல் ₹499. ஐந்து பிரிவுகள், Vibe Launchpad வழி.',
  h1: 'Vibathon 2027',
  endorsement: 'a StartNet Vibe programme',
  lede:
    'Build something people use, with AI, in a weekend. Start in your district, finish at the state finale, and leave with a route into Vibe Launchpad.',
  ledeTa:
    'மக்கள் பயன்படுத்தும் ஒன்றை AI கொண்டு ஒரு வார இறுதியில் உருவாக்குங்கள். உங்கள் மாவட்டத்தில் தொடங்கி, மாநில இறுதிப் போட்டியில் முடித்து, Vibe Launchpad-க்கான வழியுடன் வெளியேறுங்கள்.',
  microcopy: 'Teams of 2–4 [confirm]. Any college in Tamil Nadu. Registration: free to ₹499 per team [placeholder — final fee].',
  microcopyTa: '2–4 பேர் கொண்ட குழுக்கள் [உறுதி செய்யப்பட உள்ளது]. தமிழ்நாட்டின் எந்தக் கல்லூரியும். பதிவு: ஒரு குழுவுக்கு இலவசம் முதல் ₹499 வரை [விவரம் வர உள்ளது — இறுதிக் கட்டணம்].',
  whatItIs: [
    { id: 'build', title: 'Build', titleTa: 'உருவாக்குங்கள்', body: 'a [12-hour, confirm 2027 format] build sprint with AI tools. Judged on what works, not on slides.', bodyTa: 'AI கருவிகளுடன் [12 மணி நேரம், 2027 வடிவம் உறுதி செய்யப்பட உள்ளது] உருவாக்கப் போட்டி. ஸ்லைடுகளை அல்ல, செயல்படுவதை வைத்து மதிப்பிடப்படும்.' },
    { id: 'compete', title: 'Compete', titleTa: 'போட்டியிடுங்கள்', body: 'district qualifiers, then a state finale.', bodyTa: 'மாவட்டத் தகுதிச் சுற்றுகள், பின்னர் மாநில இறுதிப் போட்டி.' },
    { id: 'continue', title: 'Continue', titleTa: 'தொடருங்கள்', body: "winners get a guaranteed interview for Vibe Launchpad's 12-week pre-incubation.", bodyTa: 'வெற்றியாளர்களுக்கு Vibe Launchpad-இன் 12 வார முன்-இன்குபேஷனுக்கு உறுதியான நேர்காணல்.' },
  ],
};

/** Book 2 §5.2 timeline. `date` stays null until StartNet supplies it. */
export const VIBATHON_TIMELINE = [
  { id: 'call', stage: 'Call opens', stageTa: 'அழைப்பு தொடங்குகிறது', when: '[date]', whenTa: '[தேதி]', date: null, what: 'Registration opens on StartNet X and WhatsApp', whatTa: 'StartNet X மற்றும் WhatsApp-இல் பதிவு தொடங்குகிறது' },
  { id: 'warmups', stage: 'Vibe Campus warm-ups', stageTa: 'Vibe Campus ஆயத்த நிகழ்வுகள்', when: '[date range]', whenTa: '[தேதி வரம்பு]', date: null, what: 'Build nights at host colleges; free starter course on Vibe Academy', whatTa: 'நடத்தும் கல்லூரிகளில் உருவாக்க இரவுகள்; Vibe Academy-இல் இலவசத் தொடக்கப் பாடநெறி' },
  { id: 'closes', stage: 'Registration closes', stageTa: 'பதிவு முடிகிறது', when: '[date]', whenTa: '[தேதி]', date: null, what: 'Team details and track choice locked', whatTa: 'குழு விவரங்களும் பிரிவுத் தேர்வும் இறுதி செய்யப்படும்' },
  { id: 'qualifiers', stage: 'District qualifiers', stageTa: 'மாவட்டத் தகுதிச் சுற்றுகள்', when: '[date range]', whenTa: '[தேதி வரம்பு]', date: null, what: 'Qualifiers in [number] districts [placeholder]', whatTa: '[எண்ணிக்கை] மாவட்டங்களில் தகுதிச் சுற்றுகள் [விவரம் வர உள்ளது]' },
  { id: 'finale', stage: 'State finale', stageTa: 'மாநில இறுதிப் போட்டி', when: '[date]', whenTa: '[தேதி]', date: null, what: 'Finalists build and demo to the industry jury, at [venue placeholder]', whatTa: 'இறுதிப் போட்டியாளர்கள் [இடம் — விவரம் வர உள்ளது]-இல் உருவாக்கி, தொழில்துறை நடுவர் குழு முன் செயல்விளக்கம் அளிப்பார்கள்' },
  { id: 'interviews', stage: 'Launchpad interviews', stageTa: 'Launchpad நேர்காணல்கள்', when: '[date]', whenTa: '[தேதி]', date: null, what: 'Winners and jury picks interview for Vibe Launchpad', whatTa: 'வெற்றியாளர்களும் நடுவர் குழு தேர்ந்தெடுத்தவர்களும் Vibe Launchpad-க்கு நேர்காணல் செய்யப்படுவார்கள்' },
];

/** Book 2 §5.2 tracks [proposed — confirm the 2027 track list and track partners]. */
export const VIBATHON_TRACKS = [
  { id: 'ai-for-tamil-nadu', name: 'AI for Tamil Nadu', nameTa: 'தமிழ்நாட்டுக்கான AI', brief: 'Tools in Tamil and other Indian languages for real local users', briefTa: 'உண்மையான உள்ளூர்ப் பயனர்களுக்காகத் தமிழ் மற்றும் பிற இந்திய மொழிகளில் கருவிகள்', icon: 'Languages' },
  { id: 'health', name: 'Health', nameTa: 'சுகாதாரம்', brief: 'Products for patients, clinics and community health workers', briefTa: 'நோயாளிகள், மருத்துவமனைகள், சமூக சுகாதாரப் பணியாளர்களுக்கான தயாரிப்புகள்', icon: 'HeartPulse' },
  { id: 'climate', name: 'Climate', nameTa: 'காலநிலை', brief: 'Energy, water, waste and climate resilience', briefTa: 'ஆற்றல், நீர், கழிவு, காலநிலைத் தாங்குதிறன்', icon: 'Leaf' },
  { id: 'gcc', name: 'GCC problem statements', nameTa: 'GCC சிக்கல் அறிக்கைகள்', brief: 'Real problems set by Global Capability Centres [placeholder — sponsors]', briefTa: 'உலகளாவிய திறன் மையங்கள் (GCC) அமைக்கும் உண்மையான சிக்கல்கள் [விவரம் வர உள்ளது — ஸ்பான்சர்கள்]', icon: 'Building2' },
  { id: 'business-plan', name: 'Business-plan track', nameTa: 'வணிகத் திட்டப் பிரிவு', brief: 'For teams with a strong idea and a customer plan, judged on validation evidence', briefTa: 'வலுவான யோசனையும் வாடிக்கையாளர் திட்டமும் உள்ள குழுக்களுக்கு; சரிபார்ப்புச் சான்றுகளின் அடிப்படையில் மதிப்பிடப்படும்', icon: 'LineChart' },
];

export const VIBATHON_PRIZES = [
  { id: 'pool', title: 'Prize pool', titleTa: 'பரிசுத் தொகை', body: PH, bodyTa: PH_TA, metric: { value: 2.5, prefix: '₹', unit: ' L', label: 'Vibathon 2025 prize pool', labelTa: 'Vibathon 2025 பரிசுத் தொகை', tag: 'B', asAt: 'Vibathon 2025', source: 'Vibathon 2025 brochure' } },
  { id: 'seed', title: 'Seed support', titleTa: 'விதை நிதி ஆதரவு', body: '[placeholder — terms and provider to be confirmed]', bodyTa: '[விவரம் வர உள்ளது — விதிமுறைகளும் வழங்குநரும் உறுதி செய்யப்பட உள்ளன]' },
  { id: 'launchpad', title: 'Vibe Launchpad', body: 'Guaranteed interview for winning teams', bodyTa: 'வெற்றி பெறும் குழுக்களுக்கு உறுதியான நேர்காணல்' },
  { id: 'certs', title: 'Certificates', titleTa: 'சான்றிதழ்கள்', body: '"Shipped" certificates on StartNet X for every team that demos a working product', bodyTa: 'செயல்படும் தயாரிப்பைச் செயல்விளக்கம் செய்யும் ஒவ்வொரு குழுவுக்கும் StartNet X-இல் "Shipped" சான்றிதழ்' },
];

/** Indicative, from the planning rate card [C]. */
export const VIBATHON_SPONSOR_TIERS = [
  { id: 'title', tier: 'State title partner', tierTa: 'மாநில முதன்மைக் கூட்டாளர்', gets: 'Naming as "Vibathon 2027, presented by [Partner]", finale stage, all-district visibility, talent access report', getsTa: '"[கூட்டாளர்] வழங்கும் Vibathon 2027" எனப் பெயரிடல், இறுதிப் போட்டி மேடை, அனைத்து மாவட்டங்களிலும் காட்சிப்படுத்தல், திறமையாளர் அணுகல் அறிக்கை', price: '₹10–15 L' },
  { id: 'track', tier: 'Track partner', tierTa: 'பிரிவுக் கூட்டாளர்', gets: "One track, your problem statement, your judges, track winners' showcase", getsTa: 'ஒரு பிரிவு, உங்கள் சிக்கல் அறிக்கை, உங்கள் நடுவர்கள், பிரிவு வெற்றியாளர்களின் காட்சிப்படுத்தல்', price: '₹3–5 L per track', priceTa: '₹3–5 L / பிரிவு' },
  { id: 'district', tier: 'District edition partner', tierTa: 'மாவட்டப் பதிப்புக் கூட்டாளர்', gets: 'One district qualifier, local branding, campus outreach', getsTa: 'ஒரு மாவட்டத் தகுதிச் சுற்று, உள்ளூர் பிராண்டிங், கல்லூரிகளை அணுகுதல்', price: '₹1–2 L' },
  { id: 'talent', tier: 'Recruiter / GCC talent pass', tierTa: 'பணியமர்த்துவோர் / GCC திறமையாளர் அனுமதி', gets: 'Opted-in access to finalist profiles, a hiring session at the finale', getsTa: 'ஒப்புதல் அளித்த இறுதிப் போட்டியாளர்களின் சுயவிவர அணுகல், இறுதிப் போட்டியில் ஒரு பணியமர்த்தல் அமர்வு', price: '₹50,000–1 L' },
  { id: 'host', tier: 'College host', tierTa: 'நடத்தும் கல்லூரி', gets: 'Host a qualifier plus a year of Vibe Campus events', getsTa: 'ஒரு தகுதிச் சுற்றும் ஓராண்டு Vibe Campus நிகழ்வுகளும்', price: '₹1–3 L a year', priceTa: '₹1–3 L / ஆண்டு' },
];

export const VIBATHON_FAQ = [
  { id: 'who', question: 'Who can take part?', questionTa: 'யார் பங்கேற்கலாம்?', answer: 'Students enrolled in any college or university in Tamil Nadu. [confirm whether recent graduates are eligible]', answerTa: 'தமிழ்நாட்டில் உள்ள எந்தக் கல்லூரி அல்லது பல்கலைக்கழகத்திலும் பயிலும் மாணவர்கள். [சமீபத்தில் பட்டம் பெற்றவர்கள் தகுதியானவர்களா என்பது உறுதி செய்யப்பட உள்ளது]' },
  { id: 'code', question: 'Do I need to know how to code?', questionTa: 'கோடிங் தெரிந்திருக்க வேண்டுமா?', answer: 'No. You need to build something that works. AI tools help, and the free starter course on Vibe Academy shows you how.', answerTa: 'இல்லை. செயல்படும் ஒன்றை உருவாக்கினால் போதும். AI கருவிகள் உதவும்; Vibe Academy-இல் உள்ள இலவசத் தொடக்கப் பாடநெறி எப்படி என்று காட்டும்.' },
  { id: 'cost', question: 'How much does it cost?', questionTa: 'கட்டணம் எவ்வளவு?', answer: 'Free to ₹499 per team [placeholder — final fee]. Fee waivers are available on request. [confirm]', answerTa: 'ஒரு குழுவுக்கு இலவசம் முதல் ₹499 வரை [விவரம் வர உள்ளது — இறுதிக் கட்டணம்]. கோரிக்கையின் பேரில் கட்டண விலக்கு உண்டு. [உறுதி செய்யப்பட உள்ளது]' },
  { id: 'tamil', question: 'Can I take part in Tamil?', questionTa: 'தமிழில் பங்கேற்கலாமா?', answer: 'Yes. You can present in Tamil or English.', answerTa: 'ஆம். தமிழிலோ ஆங்கிலத்திலோ முன்வைக்கலாம்.' },
  { id: 'team', question: 'Do I need a full team?', questionTa: 'முழுக் குழு தேவையா?', answer: "No. Register on your own and we'll help you find teammates through StartNet X.", answerTa: 'இல்லை. தனியாகப் பதிவு செய்யுங்கள்; StartNet X மூலம் குழு உறுப்பினர்களைக் கண்டறிய உதவுவோம்.' },
  { id: 'ip', question: 'Who owns what we build?', questionTa: 'நாங்கள் உருவாக்குவது யாருக்குச் சொந்தம்?', answer: 'Your team does. Sponsors receive no rights to your work unless you agree separately in writing.', answerTa: 'உங்கள் குழுவுக்கே. நீங்கள் தனியாக எழுத்துப்பூர்வமாக ஒப்புக்கொண்டால் தவிர, உங்கள் படைப்பின் மீது ஸ்பான்சர்களுக்கு எந்த உரிமையும் இல்லை.' },
  { id: 'u18', question: "I'm under 18. Can I join?", questionTa: 'எனக்கு 18 வயதுக்குக் குறைவு. சேரலாமா?', answer: "You can, with verifiable consent from a parent or guardian. We'll send them a link when you register.", answerTa: 'சேரலாம், பெற்றோர் அல்லது பாதுகாவலரின் சரிபார்க்கக்கூடிய ஒப்புதலுடன். நீங்கள் பதிவு செய்யும்போது அவர்களுக்கு ஓர் இணைப்பை அனுப்புவோம்.' },
  { id: 'after', question: 'What happens after?', questionTa: 'அதன் பிறகு என்ன நடக்கும்?', answer: 'Every team gets a StartNet X profile with its project. Winners interview for Vibe Launchpad.', answerTa: 'ஒவ்வொரு குழுவுக்கும் அதன் திட்டத்துடன் ஒரு StartNet X சுயவிவரம் கிடைக்கும். வெற்றியாளர்கள் Vibe Launchpad-க்கு நேர்காணல் செய்யப்படுவார்கள்.' },
  { id: 'updates', question: 'How do I get updates?', questionTa: 'தகவல்களை எப்படிப் பெறுவது?', answer: 'Join the Vibathon WhatsApp channel or turn on email alerts.', answerTa: 'Vibathon WhatsApp சேனலில் இணையுங்கள் அல்லது மின்னஞ்சல் அறிவிப்புகளை இயக்குங்கள்.' },
];

/** Book 1 Part A §2.1 objective B4 (blueprint) and Book 2 §3.2 / §5.2. Planning targets carry their basis in `note`, not `asAt`. */
const TARGET_NOTE = 'Blueprint plan. A target, not a result.';
const TARGET_NOTE_TA = 'வரைவுத் திட்டம். இது இலக்கு, முடிவு அல்ல.';
export const VIBATHON_FACTS = [
  { id: 'v-tier34', key: 'vibathon-2025-tier34', value: 80, unit: '%', label: 'of Vibathon 2025 colleges were Tier 3 or 4', labelTa: 'Vibathon 2025 கல்லூரிகளில் Tier 3 அல்லது 4 கல்லூரிகள்', tag: 'B', asAt: 'Vibathon 2025', source: 'Vibathon 2025 brochure' },
  { id: 'v-participants', key: 'vibathon-2027-participants-target', value: 3000, label: 'participants planned for Vibathon 2027', labelTa: 'Vibathon 2027-க்குத் திட்டமிடப்பட்ட பங்கேற்பாளர்கள்', tag: 'C', source: 'StartNet blueprint, objective B4 (planning target)', note: TARGET_NOTE, noteTa: TARGET_NOTE_TA },
  { id: 'v-hosts', key: 'vibathon-2027-hosts-target', value: 20, label: 'host colleges planned', labelTa: 'திட்டமிடப்பட்ட நடத்தும் கல்லூரிகள்', tag: 'C', source: 'StartNet blueprint, objective B4 (planning target)', note: TARGET_NOTE, noteTa: TARGET_NOTE_TA },
  { id: 'v-pool25', key: 'vibathon-2025-prize-pool', value: 2.5, prefix: '₹', unit: ' L', label: 'Vibathon 2025 prize pool', labelTa: 'Vibathon 2025 பரிசுத் தொகை', tag: 'B', asAt: 'Vibathon 2025', source: 'Vibathon 2025 brochure' },
];

/** Resolve a metric's label/note for the current language (for FactBand / Stat metric objects). */
export const localiseMetric = (t, m) => ({ ...m, label: tr(t, m, 'label'), note: m.note ? tr(t, m, 'note') : m.note });

/* ------------------------------------------------------------------ Sub-pages */

export const VIBE_SUB = {
  academy: {
    // SEO: primary "vibe coding course", secondary "AI course in Tamil" (Book 1 §9.2). SEO-TA: pending native review
    seoTitle: 'Vibe Academy: vibe coding course for students',
    seoTitleTa: 'Vibe Academy: தமிழிலும் ஆங்கிலத்திலும் AI பயிற்சி',
    seoDescription:
      'Learn AI-assisted vibe coding, product, design and go-to-market in Tamil or English, in cohorts or self-paced. Certified when you ship something people use.',
    seoDescriptionTa:
      'AI உதவியுடன் கோடிங், தயாரிப்பு, வடிவமைப்பு, சந்தைப்படுத்தல்: தமிழிலோ ஆங்கிலத்திலோ கற்றுக்கொள்ளுங்கள். மக்கள் பயன்படுத்தும் ஒன்றை வெளியிட்டால் சான்றிதழ்.',
    crumb: 'Academy',
    crumbTa: 'அகாடமி',
    h1: 'Ship it, then get the certificate.',
    h1Ta: 'முதலில் வெளியிடுங்கள், பிறகு சான்றிதழ்.',
    lede: 'Learn AI-assisted coding, product, design and go-to-market in cohorts or at your own pace, in Tamil or English.',
    ledeTa: 'AI உதவியுடன் கோடிங், தயாரிப்பு, வடிவமைப்பு, சந்தைக்குக் கொண்டு செல்லுதல் ஆகியவற்றைக் குழுக்களாகவோ உங்கள் வேகத்திலோ, தமிழிலோ ஆங்கிலத்திலோ கற்றுக்கொள்ளுங்கள்.',
    art: { variant: 'grid', seed: 23 },
  },
  campus: {
    // SEO: primary "college build nights / startup events for students". SEO-TA: pending native review
    seoTitle: 'Campus build nights and startup talks · StartNet Vibe',
    seoTitleTa: 'Vibe Campus: உங்கள் கல்லூரியில் உருவாக்க இரவுகள்',
    seoDescription:
      "Build nights, talks, founder fireside chats and idea pitches at your college in Tamil Nadu, hosted with your Institution's Innovation Council.",
    seoDescriptionTa:
      'உங்கள் கல்லூரியில் உரைகள், உருவாக்க இரவுகள், நிறுவனர்களுடன் கலந்துரையாடல்கள், யோசனை முன்வைப்புகள்; உங்கள் கல்லூரியின் புத்தாக்கக் குழு (IIC) உடன் இணைந்து.',
    crumb: 'Campus',
    crumbTa: 'கல்லூரி',
    h1: 'Bring builders to your campus.',
    h1Ta: 'உங்கள் கல்லூரிக்கு உருவாக்குநர்களைக் கொண்டு வாருங்கள்.',
    lede: "A series of events in your college: build nights, talks, founder fireside chats and idea pitches, hosted with your Institution's Innovation Council.",
    ledeTa: 'உங்கள் கல்லூரியில் தொடர் நிகழ்வுகள்: உருவாக்க இரவுகள், உரைகள், நிறுவனர்களுடன் கலந்துரையாடல்கள், யோசனை முன்வைப்புகள்; உங்கள் கல்லூரியின் புத்தாக்கக் குழு (IIC) உடன் இணைந்து.',
    art: { variant: 'kolam', seed: 37 },
  },
  launchpad: {
    // SEO: primary "pre-incubation programme for students". SEO-TA: pending native review
    seoTitle: 'Vibe Launchpad: 12-week student pre-incubation',
    seoTitleTa: 'Vibe Launchpad: மாணவர் முன்-இன்குபேஷன்',
    seoDescription:
      'A 12-week pre-incubation programme for student teams with a working prototype: weekly mentors, customer validation and help applying to incubators and TANSEED.',
    seoDescriptionTa:
      'செயல்படும் முன்மாதிரி உள்ள மாணவர் குழுக்களுக்கான 12 வார முன்-இன்குபேஷன்: வாராந்திர வழிகாட்டிகள், வாடிக்கையாளர் சரிபார்ப்பு, இன்குபேட்டர், TANSEED விண்ணப்ப உதவி.',
    crumb: 'Launchpad',
    h1: 'Twelve weeks from team to company.',
    h1Ta: 'குழுவிலிருந்து நிறுவனம் வரை பன்னிரண்டு வாரங்கள்.',
    lede: 'For student teams with a working prototype.',
    ledeTa: 'செயல்படும் முன்மாதிரி உள்ள மாணவர் குழுக்களுக்கு.',
    art: { variant: 'ladder', seed: 53 },
  },
  clubs: {
    // SEO: primary "student startup club". SEO-TA: pending native review
    seoTitle: 'Vibe Clubs: start a student startup club',
    seoTitleTa: 'Vibe Clubs: கல்லூரியில் மாணவர் ஸ்டார்ட்அப் கிளப்',
    seoDescription:
      'Start or join a free, student-run Vibe Club at your college in Tamil Nadu. Vibe Captains run monthly builds and a Vibe Campus night each term.',
    seoDescriptionTa:
      'உங்கள் கல்லூரியில் மாணவர்கள் நடத்தும் இலவச Vibe Club-ஐத் தொடங்குங்கள் அல்லது சேருங்கள். Vibe Captains மாதாந்திர உருவாக்க அமர்வுகளை நடத்துகிறார்கள்.',
    crumb: 'Clubs',
    crumbTa: 'கிளப்புகள்',
    h1: 'Start the club your campus is missing.',
    h1Ta: 'உங்கள் கல்லூரியில் இல்லாத கிளப்பைத் தொடங்குங்கள்.',
    lede: 'Student-run chapters led by Vibe Captains. Meet monthly, build together, run a Vibe Campus night each term and get first access to Vibathon. Free.',
    ledeTa: 'Vibe Captains வழிநடத்தும், மாணவர்கள் நடத்தும் கிளைகள். மாதந்தோறும் சந்தியுங்கள், சேர்ந்து உருவாக்குங்கள், ஒவ்வொரு பருவத்திலும் ஒரு Vibe Campus இரவை நடத்துங்கள், Vibathon-இல் முதல் வாய்ப்பைப் பெறுங்கள். இலவசம்.',
    art: { variant: 'dot', seed: 41 },
  },
  summit: {
    // SEO-TA: pending native review
    seoTitle: 'Vibe Summit: state finale for student builders',
    seoTitleTa: 'Vibe Summit: மாணவர்களின் மாநில இறுதி நிகழ்வு',
    seoDescription:
      'The Vibe Summit is the yearly state finale of Vibe Campus build nights for college students across Tamil Nadu. Dates to be announced; get updates.',
    seoDescriptionTa:
      'தமிழ்நாடு முழுவதும் உள்ள கல்லூரி மாணவர்களுக்கான Vibe Campus உருவாக்க இரவுகளின் ஆண்டு மாநில இறுதி நிகழ்வு Vibe Summit. தேதிகள் அறிவிக்கப்படும்.',
    // Noindex: date, venue, agenda and price are all still placeholders, so the page is one sentence of real
    // content. Remove once StartNet confirms the 2027 Summit details.
    noindex: true,
    crumb: 'Summit',
    h1: 'Vibe Summit',
    lede: 'One Vibe Summit each year is the state finale.',
    ledeTa: 'ஒவ்வோர் ஆண்டும் ஒரு Vibe Summit மாநில இறுதி நிகழ்வாக நடக்கிறது.',
    art: { variant: 'network', seed: 67 },
  },
  'for-colleges': {
    seoTitle: 'StartNet Vibe for colleges: become a host college',
    seoTitleTa: 'கல்லூரிகளுக்கான StartNet Vibe: நடத்தும் கல்லூரியாகுங்கள்',
    seoDescription:
      'Turn students into founders and report it: Vibe Campus nights, Vibathon qualifiers, the Institution Partner Programme and your own StartNet X space.',
    seoDescriptionTa:
      'மாணவர்களை நிறுவனர்களாக்கி அதை அறிக்கையிடுங்கள்: Vibe Campus இரவுகள், Vibathon தகுதிச் சுற்றுகள், Institution Partner Programme, உங்களுக்கான StartNet X இடம்.',
    crumb: 'For colleges',
    crumbTa: 'கல்லூரிகளுக்கு',
    h1: 'Count your graduates who build companies, not just the ones who get placed.',
    h1Ta: 'வேலை பெற்றவர்களை மட்டுமல்ல, நிறுவனங்களை உருவாக்கும் உங்கள் பட்டதாரிகளையும் எண்ணுங்கள்.',
    lede: 'Start with a Vibe Campus night or a district Vibathon, become a Vibathon host college, then join the Institution Partner Programme.',
    ledeTa: 'ஒரு Vibe Campus இரவு அல்லது மாவட்ட Vibathon-உடன் தொடங்குங்கள், Vibathon நடத்தும் கல்லூரியாகுங்கள், பிறகு Institution Partner Programme-இல் சேருங்கள்.',
    art: { variant: 'map', seed: 71 },
  },
};

/* ------------------------------------------------------------------ Vibe home FAQ */

// AEO FAQ: drafted from Book 2 §3.2 (sub-head, Vibathon / Vibe Academy / Vibe Clubs cards) and §5.2 (Vibathon FAQ:
// who can take part, coding, Tamil) — StartNet review. Unconfirmed points ([confirm] marks) are left out.
// SEO-TA: pending native review
export const VIBE_HOME_FAQ = [
  {
    id: 'what',
    question: 'What is StartNet Vibe?',
    questionTa: 'StartNet Vibe என்றால் என்ன?',
    answer: 'StartNet Vibe takes students from first idea to first company: hackathons, an academy for building in the AI era, campus events and pre-incubation. In Tamil and English, in every district.',
    answerTa: VIBE_HOME.ledeTa,
  },
  {
    id: 'vibathon',
    question: 'What is Vibathon?',
    questionTa: 'Vibathon என்றால் என்ன?',
    answer: 'The state-level AI and vibe-coding hackathon. District qualifiers, themed tracks, an industry jury and a business-plan track. Winners go straight into Vibe Launchpad.',
    answerTa: 'மாநில அளவிலான AI மற்றும் vibe-coding ஹேக்கத்தான். மாவட்டத் தகுதிச் சுற்றுகள், கருப்பொருள் பிரிவுகள், தொழில்துறை நடுவர் குழு, வணிகத் திட்டப் பிரிவு. வெற்றியாளர்கள் நேரடியாக Vibe Launchpad-க்குச் செல்வார்கள்.',
  },
  {
    id: 'who',
    question: 'Who can take part in Vibathon? Do I need to code?',
    questionTa: 'Vibathon-இல் யார் பங்கேற்கலாம்? கோடிங் தெரிந்திருக்க வேண்டுமா?',
    answer: 'Students enrolled in any college or university in Tamil Nadu. You do not need to know how to code: you need to build something that works. AI tools help, and the free starter course on Vibe Academy shows you how.',
    answerTa: 'தமிழ்நாட்டில் உள்ள எந்தக் கல்லூரி அல்லது பல்கலைக்கழகத்திலும் பயிலும் மாணவர்கள். கோடிங் தெரிந்திருக்க வேண்டியதில்லை; செயல்படும் ஒன்றை உருவாக்கினால் போதும். AI கருவிகள் உதவும்; Vibe Academy-இல் உள்ள இலவசத் தொடக்கப் பாடநெறி எப்படி என்று காட்டும்.',
  },
  {
    id: 'tamil',
    question: 'Can I learn and build in Tamil?',
    questionTa: 'தமிழில் கற்று உருவாக்கலாமா?',
    answer: 'Yes. Vibe Academy teaches AI-assisted coding, product, design and go-to-market in Tamil or English, and at Vibathon you can present in Tamil or English.',
    answerTa: 'ஆம். Vibe Academy AI உதவியுடன் கோடிங், தயாரிப்பு, வடிவமைப்பு, சந்தைக்குக் கொண்டு செல்லுதல் ஆகியவற்றைத் தமிழிலோ ஆங்கிலத்திலோ கற்றுத்தருகிறது; Vibathon-இல் தமிழிலோ ஆங்கிலத்திலோ முன்வைக்கலாம்.',
  },
  {
    id: 'clubs',
    question: 'Is it free to join a Vibe Club?',
    questionTa: 'Vibe Club-இல் சேர இலவசமா?',
    answer: 'Yes. Vibe Clubs are free, student-run chapters led by Vibe Captains. Meet monthly, build together, run a Vibe Campus night each term and get first access to Vibathon.',
    answerTa: 'ஆம். Vibe Clubs என்பவை Vibe Captains வழிநடத்தும், மாணவர்கள் நடத்தும் இலவசக் கிளைகள். மாதந்தோறும் சந்தியுங்கள், சேர்ந்து உருவாக்குங்கள், ஒவ்வொரு பருவத்திலும் ஒரு Vibe Campus இரவை நடத்துங்கள், Vibathon-இல் முதல் வாய்ப்பைப் பெறுங்கள்.',
  },
];
