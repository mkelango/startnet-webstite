// StartNet Women copy and data. English copy is Book 2 §3.4 verbatim where it exists.
// Tamil (*Ta fields): Book 2 §14 where it supplies a line; everything else is a draft pending native
// Tamil review (Book 2 §14 status, Appendix A item 14). Brand and programme names (StartNet Women,
// Women Circles, Rise Academy, HerCapital, TANSEED, Vetri Magalir) stay in Latin script. District names are proper nouns.

export const BRAND = 'women';

/** /women/<slug> sub-pages built in WomenSub.jsx, for the server's known-route list (F-97). */
export const WOMEN_SUB_SLUGS = ['circles', 'rise-academy', 'hercapital', 'summit'];

// Book 2 §14.3 main CTAs (Tamil drafts)
export const TA = {
  joinStartNet: 'StartNet-இல் இணையுங்கள்',
  register: 'பதிவு செய்யுங்கள்',
  applyNow: 'இப்போதே விண்ணப்பியுங்கள்',
  chatWhatsApp: 'WhatsApp-இல் பேசுங்கள்',
  updatesWhatsApp: 'WhatsApp-இல் தகவல்களைப் பெறுங்கள்',
  talkToUs: 'எங்களிடம் பேசுங்கள்',
  createProfile: 'உங்கள் இலவச சுயவிவரத்தை உருவாக்குங்கள்',
  seeEvents: 'வரவிருக்கும் நிகழ்வுகளைப் பாருங்கள்',
  findProgramme: 'உங்கள் திட்டத்தைக் கண்டறியுங்கள்',
  partner: 'எங்களுடன் கூட்டு சேருங்கள்',
  readLedger: 'Founder Ledger-ஐப் படியுங்கள்',
  // Book 1 Part B search-term table (Women founders row)
  womenSchemes: 'பெண் தொழில்முனைவோர் திட்டம்',
  womenLoans: 'பெண்களுக்கான தொழில் கடன்',
  journey: 'பெண் → நிறுவனர்',
};

// SNX deep-link intents (Book 1: x.startnet.in/signup?persona&intent&brand&lang&src)
export const SNX = {
  circle: { path: '/signup', params: { persona: 'woman-founder', intent: 'circle' } },
  startCircle: { path: '/signup', params: { persona: 'woman-founder', intent: 'start-circle' } },
  rise: { path: '/signup', params: { persona: 'woman-founder', intent: 'rise-academy' } },
  readiness: { path: '/signup', params: { persona: 'woman-founder', intent: 'readiness-review' } },
  summit: { path: '/signup', params: { persona: 'woman-founder', intent: 'summit' } },
};

// Book 2 §3.4 hero source line
export const WOMEN_LED_METRIC = {
  id: 'tn-women-led-dpiit',
  key: 'tn_women_led_startups',
  value: 7572,
  label: 'of 15,037 DPIIT-recognised startups in Tamil Nadu are women-led',
  labelTa: 'தமிழ்நாட்டில் DPIIT அங்கீகாரம் பெற்ற 15,037 ஸ்டார்ட்அப்களில் பெண்கள் தலைமையிலானவை',
  tag: 'A',
  asAt: 'July 2026',
  source: 'DPIIT data via DT Next, July 2026',
  note: 'DPIIT counts a startup as women-led if it has at least one woman director.',
  noteTa: 'குறைந்தது ஒரு பெண் இயக்குநர் இருந்தால், DPIIT அந்த ஸ்டார்ட்அப்பைப் பெண்கள் தலைமையிலானது எனக் கணக்கிடுகிறது.',
  brand: 'women',
};

// Book 1 Part A, objective B5 / KPI table: planning target. "FY27 target" is not a date, so it lives
// in the note rather than asAt (F-63).
export const INCLUSION_FLOOR_METRIC = {
  id: 'women-share-floor',
  key: 'women_share_target',
  value: 40,
  prefix: '≥',
  unit: '%',
  label: 'women in every StartNet programme: our floor, tracked from the first form',
  labelTa: 'ஒவ்வொரு StartNet திட்டத்திலும் பெண்கள்: எங்கள் குறைந்தபட்ச இலக்கு, முதல் படிவத்திலிருந்தே கண்காணிக்கப்படுகிறது',
  tag: 'C',
  source: 'StartNet strategy (Book 1 Part A, objective B5), planning target',
  sourceTa: 'StartNet உத்தி (Book 1 Part A, நோக்கம் B5), திட்ட இலக்கு',
  note: 'FY27 target. A planning target, not an outcome. Share of sign-ups is self-declared and optional.',
  noteTa: 'FY27 இலக்கு. இது திட்டமிடல் இலக்கு, விளைவு அல்ல. பதிவுகளில் பங்கு சுயமாக அறிவிக்கப்படுவது, விருப்பத்தேர்வு.',
  brand: 'women',
};

/** A metric with its Tamil label, note and source applied when t() picks Tamil. */
export const localMetric = (m, t) => ({
  ...m,
  label: t(m.label, m.labelTa),
  note: m.note ? t(m.note, m.noteTa) : m.note,
  source: m.source ? t(m.source, m.sourceTa) : m.source,
});

// Book 2 §3.4 proof band (all placeholders until the Founder Ledger supplies them)
export const PROOF_LABELS = [
  { key: 'women_circles_active', label: 'Women Circles active', labelTa: 'செயல்பாட்டில் உள்ள Women Circles' },
  { key: 'rise_graduates', label: 'Rise Academy graduates', labelTa: 'Rise Academy பட்டதாரிகள்' },
  { key: 'hercapital_capital_raised', label: 'Capital raised through HerCapital', labelTa: 'HerCapital மூலம் திரட்டப்பட்ட முதலீடு' },
  { key: 'women_share_participants', label: 'Women share of all StartNet participants', labelTa: 'அனைத்து StartNet பங்கேற்பாளர்களில் பெண்களின் பங்கு' },
];

export const WHO_FOR = [
  {
    icon: 'briefcase', title: 'Professional women', titleTa: 'தொழில்முறைப் பெண்கள்',
    body: 'Professional women, including women returning after a career break',
    bodyTa: 'பணி இடைவேளைக்குப் பிறகு மீண்டும் வரும் பெண்கள் உட்பட, தொழில்முறைப் பெண்கள்',
  },
  {
    icon: 'store', title: 'Business owners', titleTa: 'தொழில் உரிமையாளர்கள்',
    body: 'Business owners in home-based, MSME and self-help-group enterprises who want to grow into product or service companies',
    bodyTa: 'வீட்டிலிருந்து நடத்தும் தொழில்கள், MSME மற்றும் சுய உதவிக் குழு நிறுவனங்களை, தயாரிப்பு அல்லது சேவை நிறுவனங்களாக வளர்க்க விரும்பும் உரிமையாளர்கள்',
  },
  {
    icon: 'grad', title: 'Researchers and students', titleTa: 'ஆய்வாளர்களும் மாணவர்களும்',
    body: 'Researchers and students in StartNet Research and Vibe programmes, with dedicated tracks and mentors',
    bodyTa: 'StartNet Research மற்றும் Vibe திட்டங்களில் உள்ள ஆய்வாளர்களும் மாணவர்களும், தனிப் பிரிவுகள் மற்றும் வழிகாட்டிகளுடன்',
  },
];

export const DESIGN_FOR_YOU = [
  { icon: 'sun', title: 'Daytime and weekend sessions.', titleTa: 'பகல் நேர மற்றும் வார இறுதி அமர்வுகள்.', body: null, placeholder: 'confirm childcare at flagship events before publishing', placeholderTa: 'வெளியிடும் முன் முதன்மை நிகழ்வுகளில் குழந்தைப் பராமரிப்பு வசதியை உறுதிசெய்யவும்' },
  { icon: 'languages', title: 'Tamil-first content for district circles.', titleTa: 'மாவட்ட Circles-க்குத் தமிழுக்கு முன்னுரிமை தரும் உள்ளடக்கம்.', body: null },
  {
    icon: 'trending', title: 'Market access before money', titleTa: 'பணத்துக்கு முன் சந்தை அணுகல்',
    body: 'Buyer introductions and supplier-diversity programmes, because revenue makes founders investable.',
    bodyTa: 'வாங்குபவர் அறிமுகங்களும் விநியோகஸ்தர் பன்முகத் திட்டங்களும், ஏனெனில் வருவாயே நிறுவனர்களை முதலீட்டுக்குத் தகுதியானவர்களாக்குகிறது.',
  },
  {
    icon: 'scale', title: 'A stricter count', titleTa: 'கடுமையான கணக்கீடு',
    body: 'We report "women-owned" as 51%+ equity held by women, alongside the DPIIT definition.',
    bodyTa: 'DPIIT வரையறையுடன் சேர்த்து, 51%-க்கு மேல் பங்குகள் பெண்களிடம் இருந்தால் மட்டுமே "பெண்களுக்குச் சொந்தமானது" என்று நாங்கள் அறிவிக்கிறோம்.',
  },
];

// The journey: Book 1 Part B user flow "Women Circles (district) → Rise Academy → HerCapital"
export const JOURNEY = [
  { key: 'circles', step: 'Market access', stepTa: 'சந்தை அணுகல்', name: 'Women Circles', line: 'Twenty founders in your district, every month.', lineTa: 'உங்கள் மாவட்டத்தில் இருபது நிறுவனர்கள், ஒவ்வொரு மாதமும்.', to: '/women/circles' },
  { key: 'rise-academy', step: 'The business side', stepTa: 'தொழிலின் வணிகப் பக்கம்', name: 'Rise Academy', line: 'Learn the business side, with a mentor beside you.', lineTa: 'உங்களுடன் ஒரு வழிகாட்டி இருக்க, தொழிலின் வணிகப் பக்கத்தைக் கற்றுக்கொள்ளுங்கள்.', to: '/women/rise-academy' },
  { key: 'hercapital', step: 'Capital next', stepTa: 'அடுத்து முதலீடு', name: 'HerCapital', line: "Get ready for the money that's already there.", lineTa: 'ஏற்கெனவே உள்ள நிதிக்குத் தயாராகுங்கள்.', to: '/women/hercapital' },
];

// Book 2 §3.4 HerCapital body. Amounts exactly as stated; tag B (published by the scheme, verify before launch).
// "As published" is not a date: it lives in the note, not asAt (F-63).
export const SCHEMES = [
  {
    id: 'tanseed',
    name: 'TANSEED',
    owner: 'StartupTN',
    kind: 'Seed grant',
    kindTa: 'தொடக்க மானியம்',
    summary: "StartupTN's TANSEED: up to ₹15 L for women-led startups.",
    summaryTa: 'StartupTN-இன் TANSEED: பெண்கள் தலைமையிலான ஸ்டார்ட்அப்களுக்கு ₹15 லட்சம் வரை.',
    amount: {
      value: 15, prefix: '₹', unit: ' L', unitTa: ' லட்சம்',
      label: 'up to, for women-led startups', labelTa: 'வரை, பெண்கள் தலைமையிலான ஸ்டார்ட்அப்களுக்கு',
      tag: 'B',
      note: 'Amount as published by the scheme.', noteTa: 'திட்டம் வெளியிட்ட தொகை.',
      source: 'StartupTN; scheme amounts as published, verify before launch',
      sourceTa: 'StartupTN; திட்டம் வெளியிட்ட தொகைகள், வெளியீட்டுக்கு முன் சரிபார்க்கவும்',
    },
  },
  {
    id: 'vetri-magalir',
    name: 'Vetri Magalir',
    owner: 'TIIC',
    kind: 'Loan',
    kindTa: 'கடன்',
    summary: "TIIC's Vetri Magalir loans: ₹10 L to ₹5 Cr.",
    summaryTa: 'TIIC-இன் Vetri Magalir கடன்கள்: ₹10 லட்சம் முதல் ₹5 கோடி வரை.',
    amount: {
      value: '₹10 L – ₹5 Cr', valueTa: '₹10 லட்சம் – ₹5 கோடி',
      label: 'loan range', labelTa: 'கடன் வரம்பு',
      tag: 'B',
      note: 'Amounts as published by the scheme.', noteTa: 'திட்டம் வெளியிட்ட தொகைகள்.',
      source: 'TIIC; scheme amounts as published, verify before launch',
      sourceTa: 'TIIC; திட்டம் வெளியிட்ட தொகைகள், வெளியீட்டுக்கு முன் சரிபார்க்கவும்',
      countUp: false,
    },
  },
  {
    id: 'wep',
    name: 'Women Entrepreneurship Platform',
    owner: 'NITI Aayog',
    kind: 'National platform',
    kindTa: 'தேசியத் தளம்',
    summary: "NITI Aayog's Women Entrepreneurship Platform.",
    summaryTa: 'NITI Aayog-இன் Women Entrepreneurship Platform.',
    amount: null,
  },
];

// StartNet's own readiness questions, built from what Rise Academy and HerCapital cover (Book 2 §3.4).
// Not the schemes' official eligibility criteria.
export const READINESS = [
  { id: 'women-led', label: 'My company is women-led: at least one woman director (the DPIIT definition).', labelTa: 'என் நிறுவனம் பெண்கள் தலைமையிலானது: குறைந்தது ஒரு பெண் இயக்குநர் உள்ளார் (DPIIT வரையறை).' },
  { id: 'women-owned', label: 'I know our women-owned share (StartNet counts 51%+ equity held by women).', labelTa: 'எங்கள் நிறுவனத்தில் பெண்களுக்குச் சொந்தமான பங்கு எனக்குத் தெரியும் (StartNet 51%-க்கு மேல் பெண்களின் பங்குகளைக் கணக்கிடுகிறது).' },
  { id: 'model', label: 'I can explain my business model on one page.', labelTa: 'என் வணிக மாதிரியை ஒரே பக்கத்தில் விளக்க முடியும்.' },
  { id: 'finance', label: 'My finance and compliance basics are in order.', labelTa: 'என் நிதி மற்றும் சட்ட இணக்க அடிப்படைகள் சரியாக உள்ளன.' },
  { id: 'market', label: 'I am selling, or have buyer introductions lined up.', labelTa: 'நான் விற்பனை செய்கிறேன், அல்லது வாங்குபவர் அறிமுகங்கள் தயாராக உள்ளன.' },
];

export const FAQ = [
  // AEO FAQ: drafted from Book 2 §3.4 sub-head and sub-page cards — StartNet review. SEO-TA: pending native review
  {
    id: 'what',
    question: 'What is StartNet Women?',
    questionTa: 'StartNet Women என்றால் என்ன?',
    answer: 'StartNet Women helps women build product and service companies in Tamil Nadu and get them ready for investment, with formats that fit around real lives: monthly district Women Circles, Rise Academy with a 1:1 mentor, HerCapital investment readiness and the Women Founders Summit & Awards.',
    answerTa: 'உண்மையான வாழ்க்கைக்கு ஏற்ற வடிவங்களுடன், தமிழ்நாட்டில் பெண்கள் தயாரிப்பு மற்றும் சேவை நிறுவனங்களை உருவாக்கி, அவற்றை முதலீட்டுக்குத் தயார்படுத்த StartNet Women உதவுகிறது: மாதாந்திர மாவட்ட Women Circles, 1:1 வழிகாட்டியுடன் Rise Academy, HerCapital முதலீட்டுத் தயார்நிலை, Women Founders Summit & Awards.',
  },
  {
    id: 'tech',
    question: 'Is StartNet Women only for tech founders?',
    questionTa: 'StartNet Women தொழில்நுட்ப நிறுவனர்களுக்கு மட்டும்தானா?',
    answer: 'No. StartNet Women helps women build product and service companies. That includes business owners in home-based, MSME and self-help-group enterprises who want to grow into product or service companies, professional women (including women returning after a career break), and researchers and students in StartNet Research and Vibe programmes.',
    answerTa: 'இல்லை. StartNet Women பெண்கள் தயாரிப்பு மற்றும் சேவை நிறுவனங்களை உருவாக்க உதவுகிறது. வீட்டிலிருந்து நடத்தும் தொழில்கள், MSME மற்றும் சுய உதவிக் குழு நிறுவனங்களைத் தயாரிப்பு அல்லது சேவை நிறுவனங்களாக வளர்க்க விரும்பும் உரிமையாளர்கள், தொழில்முறைப் பெண்கள் (பணி இடைவேளைக்குப் பிறகு மீண்டும் வருபவர்கள் உட்பட), StartNet Research மற்றும் Vibe திட்டங்களில் உள்ள ஆய்வாளர்கள் மற்றும் மாணவர்கள் அனைவரும் இதில் அடங்குவர்.',
  },
  {
    id: 'small',
    question: 'Is my business too small?',
    questionTa: 'என் தொழில் மிகவும் சிறியதா?',
    answer: 'Start with a Women Circle in your district: a chapter of 20–30 women founders that meets monthly for accountability, problem-solving and introductions to buyers. We put market access before money, because revenue makes founders investable.',
    answerTa: 'உங்கள் மாவட்டத்தின் Women Circle-இலிருந்து தொடங்குங்கள்: பொறுப்புணர்வு, சிக்கல் தீர்வு மற்றும் வாங்குபவர் அறிமுகங்களுக்காக மாதந்தோறும் சந்திக்கும் 20–30 பெண் நிறுவனர்களின் குழு. பணத்துக்கு முன் சந்தை அணுகலுக்கு முன்னுரிமை தருகிறோம், ஏனெனில் வருவாயே நிறுவனர்களை முதலீட்டுக்குத் தகுதியானவர்களாக்குகிறது.',
  },
  {
    id: 'language',
    question: 'Is it in Tamil?',
    questionTa: 'இது தமிழில் கிடைக்குமா?',
    answer: 'Content for district circles is Tamil-first. Rise Academy runs on your phone, in Tamil or English, paired with a 1:1 mentor.',
    answerTa: 'மாவட்ட Circles-க்கான உள்ளடக்கத்தில் தமிழுக்கே முன்னுரிமை. Rise Academy உங்கள் கைபேசியில், தமிழில் அல்லது ஆங்கிலத்தில், தனிப்பட்ட (1:1) வழிகாட்டியுடன் நடக்கிறது.',
  },
  {
    id: 'time',
    question: 'When do sessions happen?',
    questionTa: 'அமர்வுகள் எப்போது நடக்கும்?',
    answer: 'Daytime and weekend sessions, designed around real lives. Childcare at flagship events: [placeholder — confirm childcare at flagship events before publishing].',
    answerTa: 'உண்மையான வாழ்க்கைக்கு ஏற்ப வடிவமைக்கப்பட்ட பகல் நேர மற்றும் வார இறுதி அமர்வுகள். முதன்மை நிகழ்வுகளில் குழந்தைப் பராமரிப்பு: [placeholder — confirm childcare at flagship events before publishing].',
  },
  {
    id: 'cost',
    question: 'What does it cost?',
    questionTa: 'இதற்கு என்ன கட்டணம்?',
    answer: 'Women Circles membership is from ₹10,000 a year [C, indicative]; CSR-funded places are available [placeholder]. Rise Academy: [placeholder — CSR-subsidised; indicative ₹5,000–15,000] [C]. Ask about sponsored seats.',
    answerTa: 'Women Circles உறுப்பினர் கட்டணம் ஆண்டுக்கு ₹10,000 முதல் [C, உத்தேசம்]; CSR நிதியுதவி பெற்ற இடங்களும் உள்ளன [placeholder]. Rise Academy: [placeholder — CSR-subsidised; indicative ₹5,000–15,000] [C]. நிதியுதவி பெற்ற இடங்கள் பற்றிக் கேளுங்கள்.',
  },
  {
    id: 'grants',
    question: 'Will StartNet decide on my grant or loan?',
    questionTa: 'என் மானியம் அல்லது கடன் பற்றி StartNet முடிவு செய்யுமா?',
    answer: 'No. We help you prepare and apply. Decisions on grants and loans are made by the scheme, not by StartNet.',
    answerTa: 'இல்லை. நீங்கள் தயாராகவும் விண்ணப்பிக்கவும் உதவுகிறோம். மானியங்கள் மற்றும் கடன்கள் பற்றிய முடிவுகளை StartNet அல்ல, அந்தந்தத் திட்டமே எடுக்கிறது.',
  },
  {
    id: 'count',
    question: 'How do you count "women-led" and "women-owned"?',
    questionTa: '"பெண்கள் தலைமையிலானது", "பெண்களுக்குச் சொந்தமானது" என்பதை எப்படிக் கணக்கிடுகிறீர்கள்?',
    answer: 'DPIIT counts a startup as women-led if it has at least one woman director. We also report a stricter count: "women-owned" means 51%+ equity held by women.',
    answerTa: 'குறைந்தது ஒரு பெண் இயக்குநர் இருந்தால், DPIIT அந்த ஸ்டார்ட்அப்பைப் பெண்கள் தலைமையிலானது எனக் கணக்கிடுகிறது. நாங்கள் கடுமையான கணக்கீட்டையும் அறிவிக்கிறோம்: 51%-க்கு மேல் பங்குகள் பெண்களிடம் இருந்தால் மட்டுமே "பெண்களுக்குச் சொந்தமானது".',
  },
];

// Tamil Nadu's 38 districts (English and Tamil names) for the Circle finder.
export const DISTRICTS = [
  ['Ariyalur', 'அரியலூர்'], ['Chengalpattu', 'செங்கல்பட்டு'], ['Chennai', 'சென்னை'], ['Coimbatore', 'கோயம்புத்தூர்'],
  ['Cuddalore', 'கடலூர்'], ['Dharmapuri', 'தருமபுரி'], ['Dindigul', 'திண்டுக்கல்'], ['Erode', 'ஈரோடு'],
  ['Kallakurichi', 'கள்ளக்குறிச்சி'], ['Kancheepuram', 'காஞ்சிபுரம்'], ['Kanniyakumari', 'கன்னியாகுமரி'], ['Karur', 'கரூர்'],
  ['Krishnagiri', 'கிருஷ்ணகிரி'], ['Madurai', 'மதுரை'], ['Mayiladuthurai', 'மயிலாடுதுறை'], ['Nagapattinam', 'நாகப்பட்டினம்'],
  ['Namakkal', 'நாமக்கல்'], ['Nilgiris', 'நீலகிரி'], ['Perambalur', 'பெரம்பலூர்'], ['Pudukkottai', 'புதுக்கோட்டை'],
  ['Ramanathapuram', 'இராமநாதபுரம்'], ['Ranipet', 'இராணிப்பேட்டை'], ['Salem', 'சேலம்'], ['Sivaganga', 'சிவகங்கை'],
  ['Tenkasi', 'தென்காசி'], ['Thanjavur', 'தஞ்சாவூர்'], ['Theni', 'தேனி'], ['Thoothukudi', 'தூத்துக்குடி'],
  ['Tiruchirappalli', 'திருச்சிராப்பள்ளி'], ['Tirunelveli', 'திருநெல்வேலி'], ['Tirupathur', 'திருப்பத்தூர்'], ['Tiruppur', 'திருப்பூர்'],
  ['Tiruvallur', 'திருவள்ளூர்'], ['Tiruvannamalai', 'திருவண்ணாமலை'], ['Tiruvarur', 'திருவாரூர்'], ['Vellore', 'வேலூர்'],
  ['Viluppuram', 'விழுப்புரம்'], ['Virudhunagar', 'விருதுநகர்'],
].map(([en, ta]) => ({ value: en.toLowerCase(), en, ta }));

export const districtMatch = (a, b) => !!a && !!b && String(a).trim().toLowerCase() === String(b).trim().toLowerCase();
