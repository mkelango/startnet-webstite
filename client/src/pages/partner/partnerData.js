// Partner content map. Copy: Book 2 §8 (verbatim where it exists), Book 1 Part A §3.2 (proof per payer),
// Part A §7.4 (routing + SLA), Part B §3.2 ⑦ (partner mega menu), Part B §2.2 (page inventory),
// Book 2 §7.3 (StartNet X organisation tiers, indicative [C]).
//
// Tamil: every user-visible string has a `…Ta` twin. Book 2 §14.2–14.3 lines are used verbatim
// ('எங்களுடன் கூட்டு சேருங்கள்', 'எங்களிடம் பேசுங்கள்', 'Founder Ledger-ஐப் படியுங்கள்', 'தொடர்புக்கு');
// the rest is a DRAFT pending native Tamil copywriter review (Book 2 §14 status, Appendix A item 14).
// Brand and programme names (StartNet, StartNet X, Vibathon, Founder Ledger, District Ecosystem Programme…) stay Latin.
import { GraduationCap, Briefcase, Landmark, Megaphone, HeartHandshake, TrendingUp, Sprout, MapPinned } from 'lucide-react';

// Response time confirmed by StartNet (Oct 2026).
export const SLA_LINE = 'We reply within two working days.';
export const SLA_LINE_TA = 'இரண்டு வேலை நாட்களுக்குள் பதிலளிக்கிறோம்.';
export const CONFIRM_NOTE = '[confirm]';
export const CONFIRM_NOTE_TA = '[உறுதிப்படுத்தவும்]';

/** Pre-filled WhatsApp message for the partnerships team. */
export const WA_TEXT = 'Hi StartNet, I would like to talk to the partnerships team';
export const WA_TEXT_TA = 'வணக்கம் StartNet, கூட்டாண்மைக் குழுவுடன் பேச விரும்புகிறேன்';

/** Own-property check (Object.hasOwn semantics; works on Safari 14, which Vite's default target still includes). */
const hasOwn = (o, k) => Object.prototype.hasOwnProperty.call(o, k);

/** Read `obj[key]` in the current language: t(obj.key, obj.keyTa). */
export const tf = (t, obj, key) => (obj ? t(obj[key], obj[`${key}Ta`]) : undefined);

/** Values used by the enquiry form's "Organisation type" select (?type= on /partner/enquire). */
export const ENQUIRY_TYPES = [
  { value: 'institution', label: 'University or college', labelTa: 'பல்கலைக்கழகம் அல்லது கல்லூரி' },
  { value: 'gcc', label: 'GCC or corporate', labelTa: 'GCC அல்லது பெரு நிறுவனம்' },
  { value: 'government', label: 'Government or district', labelTa: 'அரசு அல்லது மாவட்ட நிர்வாகம்' },
  { value: 'sponsor', label: 'Sponsor', labelTa: 'நிதி ஆதரவாளர் (Sponsor)' },
  { value: 'csr', label: 'CSR foundation', labelTa: 'CSR அறக்கட்டளை' },
  { value: 'investor', label: 'Investor', labelTa: 'முதலீட்டாளர்' },
  { value: 'incubator', label: 'Incubator or TBI', labelTa: 'இன்குபேட்டர் அல்லது TBI' },
  { value: 'other', label: 'Other', labelTa: 'மற்றவை' },
];

/** "What outcome are you looking for?" — Book 2 §8.0 sub-head names the outcomes partners pay for. */
export const ENQUIRY_TOPICS = [
  { value: 'spinouts', label: 'Spinouts and student founders', labelTa: 'ஸ்பின்அவுட்களும் மாணவ நிறுவனர்களும்' },
  { value: 'pilots', label: 'Pilots and problem statements', labelTa: 'முன்னோட்டங்களும் சவால் அறிக்கைகளும்' },
  { value: 'talent', label: 'Talent', labelTa: 'திறமையாளர்கள்' },
  { value: 'reach', label: 'Reach (sponsorship)', labelTa: 'பார்வையாளர்களைச் சென்றடைதல் (நிதி ஆதரவு)' },
  { value: 'deal-flow', label: 'Deal flow', labelTa: 'முதலீட்டு வாய்ப்புகள் (deal flow)' },
  { value: 'district-programme', label: 'District Ecosystem Programme', labelTa: 'District Ecosystem Programme' },
  { value: 'csr-programme', label: 'CSR founder programme', labelTa: 'CSR நிறுவனர் திட்டம்' },
  { value: 'snx', label: 'StartNet X demo or licence', labelTa: 'StartNet X செயல்விளக்கம் அல்லது உரிமம்' },
  { value: 'other', label: 'Something else', labelTa: 'வேறு ஏதாவது' },
];

/** Deep-link ?topic= values used elsewhere on the site that map onto an ENQUIRY_TOPICS value. */
export const ENQUIRY_TOPIC_ALIASES = {
  vibathon: 'reach',
  'vibathon-sponsor-deck': 'reach',
  sponsorship: 'reach',
  sponsor: 'reach',
  'startnet-x': 'snx',
  district: 'district-programme',
  csr: 'csr-programme',
  pilot: 'pilots',
  spinout: 'spinouts',
  dealflow: 'deal-flow',
};

/** Resolve a raw ?topic= value to an ENQUIRY_TOPICS value ('' if unknown). */
export const resolveEnquiryTopic = (raw) => {
  const key = String(raw || '').trim().toLowerCase();
  const value = hasOwn(ENQUIRY_TOPIC_ALIASES, key) ? ENQUIRY_TOPIC_ALIASES[key] : key;
  return ENQUIRY_TOPICS.some((o) => o.value === value) ? value : '';
};

const SLA_2 = { sla: '2 business days', slaTa: '2 வேலை நாட்கள்' };

/** Book 1 Part A §7.4 + Part B §9.3: who reads each enquiry. */
export const ROUTING = [
  {
    type: 'Institution', typeTa: 'கல்வி நிறுவனம்',
    owner: 'Research lead (Labs, Institution Partner Programme) or Vibe lead (campus), by stated interest',
    ownerTa: 'Research தலைவர் (Labs, Institution Partner Programme) அல்லது Vibe தலைவர் (வளாகம்), நீங்கள் தெரிவிக்கும் ஆர்வத்தைப் பொறுத்து',
    ...SLA_2,
  },
  {
    type: 'GCC / corporate', typeTa: 'GCC / பெரு நிறுவனம்',
    owner: 'Access engine owner, copying the brand lead',
    ownerTa: 'Access engine பொறுப்பாளர், பிராண்ட் தலைவருக்கு நகலுடன்',
    ...SLA_2,
  },
  {
    type: 'Government / district', typeTa: 'அரசு / மாவட்டம்',
    owner: "Founder & CEO's office", ownerTa: 'நிறுவனர் & CEO அலுவலகம்',
    ...SLA_2,
  },
  {
    type: 'Sponsor', typeTa: 'நிதி ஆதரவாளர்',
    owner: 'Convene engine owner', ownerTa: 'Convene engine பொறுப்பாளர்',
    ...SLA_2,
  },
  {
    type: 'CSR', typeTa: 'CSR',
    owner: 'Partnerships lead (StartNet Foundation once constituted)',
    ownerTa: 'கூட்டாண்மைத் தலைவர் (StartNet Foundation அமைக்கப்பட்ட பின் அதன் வழியாக)',
    ...SLA_2,
  },
  {
    type: 'Investor', typeTa: 'முதலீட்டாளர்',
    owner: "Founder & CEO's office; acknowledgement only, no investment material from the site",
    ownerTa: 'நிறுவனர் & CEO அலுவலகம்; பெற்றுக்கொண்டதற்கான ஒப்புகை மட்டும், இணையதளம் வழியாக முதலீட்டு ஆவணங்கள் எதுவும் அனுப்பப்படாது',
    ...SLA_2,
  },
  {
    type: 'Incubator', typeTa: 'இன்குபேட்டர்',
    owner: 'Launch programme lead', ownerTa: 'Launch திட்டத் தலைவர்',
    ...SLA_2,
  },
];

/** Book 2 §8.0 — how partnering works (three steps). Steps reads `title`/`body`, so localise with localiseSteps(). */
export const HOW_IT_WORKS = [
  {
    title: 'Tell us the outcome you need.', titleTa: 'உங்களுக்குத் தேவையான விளைவைச் சொல்லுங்கள்.',
    body: 'Spinouts, pilots, talent, reach or deal flow. Start with the result you are paying for.',
    bodyTa: 'ஸ்பின்அவுட்கள், முன்னோட்டங்கள், திறமையாளர்கள், பார்வையாளர் அணுகல் அல்லது முதலீட்டு வாய்ப்புகள். நீங்கள் எந்த முடிவுக்காகச் செலவிடுகிறீர்களோ அதிலிருந்து தொடங்குங்கள்.',
  },
  {
    title: 'We propose a programme.', titleTa: 'நாங்கள் ஒரு திட்டத்தை முன்மொழிகிறோம்.',
    body: "A programme, a price from our published rate card and the measures we'll report.",
    bodyTa: 'ஒரு திட்டம், எங்கள் வெளியிடப்பட்ட கட்டண அட்டவணையிலிருந்து ஒரு விலை, நாங்கள் அறிக்கையிடும் அளவீடுகள்.',
  },
  {
    title: 'We run it and report.', titleTa: 'நாங்கள் நடத்தி, அறிக்கை தருகிறோம்.',
    body: 'We run it on StartNet X and report quarterly, against the Founder Ledger.',
    bodyTa: 'StartNet X-இல் அதை நடத்தி, Founder Ledger அடிப்படையில் காலாண்டுதோறும் அறிக்கையிடுகிறோம்.',
  },
];

/** HOW_IT_WORKS in the current language, in the { title, body } shape <Steps> expects. */
export const localiseSteps = (t) => HOW_IT_WORKS.map((s) => ({ title: tf(t, s, 'title'), body: tf(t, s, 'body') }));

/** Book 1 Part B §3.2 ⑦ — ready-made solutions column. */
export const SOLUTIONS = [
  {
    title: 'District Ecosystem Programme', to: '/partner/district-programme',
    body: 'All four StartNet brands in one district for a year.',
    bodyTa: 'ஒரு மாவட்டத்தில் ஓராண்டுக்கு StartNet-இன் நான்கு பிராண்டுகளும்.',
  },
  {
    title: 'Institution Partner Programme', to: '/research/institution-partner-programme',
    body: 'Lab membership, innovation policy kit, faculty development and your own StartNet X space.',
    bodyTa: 'Lab உறுப்பினர், புத்தாக்கக் கொள்கைத் தொகுப்பு, ஆசிரியர் மேம்பாடு, உங்களுக்கென ஒரு StartNet X தளம்.',
  },
  {
    title: 'Lab sponsorship', titleTa: 'Lab நிதி ஆதரவு', to: '/research/labs#sponsor',
    body: 'Sponsor a StartNet Lab and co-sign its problem statements.',
    bodyTa: 'ஒரு StartNet Lab-க்கு நிதி ஆதரவளித்து, அதன் சவால் அறிக்கைகளில் இணைந்து கையெழுத்திடுங்கள்.',
  },
  {
    title: 'Vibathon partnerships', titleTa: 'Vibathon கூட்டாண்மைகள்', to: '/vibe/vibathon#partners',
    body: 'Sponsor a track at Vibathon, a StartNet Vibe programme.',
    bodyTa: 'StartNet Vibe திட்டமான Vibathon-இல் ஒரு பிரிவுக்கு நிதி ஆதரவளியுங்கள்.',
  },
  {
    title: 'GCC talent package', titleTa: 'GCC திறமையாளர் தொகுப்பு', to: '/partner/gccs#talent',
    body: 'Opted-in access to talent from StartNet programmes.',
    bodyTa: 'StartNet திட்டங்களிலிருந்து, ஒப்புதல் அளித்த திறமையாளர்களை அணுகும் வாய்ப்பு.',
  },
  {
    title: 'Intrapreneur-to-founder programme', titleTa: 'ஊழியர்களை நிறுவனர்களாக்கும் திட்டம்', to: '/partner/gccs#intrapreneurs',
    body: 'A founder programme for your own staff.',
    bodyTa: 'உங்கள் சொந்த ஊழியர்களுக்கான ஒரு நிறுவனர் திட்டம்.',
  },
  {
    title: 'CSR founder programmes', titleTa: 'CSR நிறுவனர் திட்டங்கள்', to: '/partner/csr',
    body: 'Student-founder, women-founder and district programmes with quarterly outcome reports.',
    bodyTa: 'மாணவ நிறுவனர், பெண் நிறுவனர், மாவட்டத் திட்டங்கள், காலாண்டு விளைவு அறிக்கைகளுடன்.',
  },
];

/** "Proof you can check" item labels (Book 1 Part A §3.2). Keys stay English: ProofNeeded links by them. */
export const PROOF_TA = {
  'Signed institutions': 'கையெழுத்திட்ட கல்வி நிறுவனங்கள்',
  'Lab charter and kill criteria': 'Lab சாசனமும் நிறுத்த அளவுகோல்களும்',
  'Tenant demo': 'StartNet X தளச் செயல்விளக்கம்',
  'DPDP and security posture': 'DPDP மற்றும் பாதுகாப்பு நிலை',
  'Signed GCCs': 'கையெழுத்திட்ட GCC-கள்',
  'Pilot outcomes': 'முன்னோட்ட விளைவுகள்',
  'Feeder-and-connector stance': 'நிறுவனர்களை அனுப்பி இணைக்கும் எங்கள் நிலைப்பாடு',
  'District Ledger': 'District Ledger',
  'Co-host history': 'இணைந்து நடத்திய வரலாறு',
  'Tagged audience profiles': 'குறியிட்ட பார்வையாளர் விவரங்கள்',
  'Post-event reports': 'நிகழ்வுக்குப் பிந்தைய அறிக்கைகள்',
  'Schedule VII-compliant outcomes': 'அட்டவணை VII-க்கு இணங்கிய விளைவுகள்',
  Team: 'எங்கள் குழு',
  'Founder Ledger': 'Founder Ledger',
  'Corrections log': 'திருத்தப் பதிவேடு',
  'ThinkTN related-party disclosure': 'ThinkTN தொடர்புடைய தரப்பு வெளிப்படுத்தல்',
};

/** Tamil promise lines for the four talent brands on the District Ecosystem Programme page. */
export const BRAND_PROMISE_TA = {
  research: 'உங்கள் ஆய்வை, உங்கள் கல்வி நிறுவனம் கையெழுத்திடக்கூடிய நிலையான விதிமுறைகளில், நீங்களும் இணை உரிமையாளராக உள்ள நிறுவனமாக மாற்றுங்கள்.',
  vibe: 'கல்லூரியிலேயே, தமிழிலோ ஆங்கிலத்திலோ, AI கொண்டு உருவாக்குங்கள்; ஒரு தயாரிப்பு, ஒரு குழு, அடுத்த அடியுடன் வெளியேறுங்கள்.',
  connect: 'நீங்கள் தொடங்க, மாற அல்லது வளர உதவக்கூடிய உங்கள் துறை மனிதர்களை, அதற்கென்றே அமைக்கப்பட்ட அரங்குகளில் சந்தியுங்கள்.',
  women: 'தொழில் உரிமையாளரிலிருந்து முதலீட்டுக்குத் தகுதியான நிறுவனர் வரை: முதலில் சந்தை அணுகல், அடுத்து மூலதனம்.',
};

const SPONSOR_RULE = 'Sponsors never appear next to ThinkTN content or Insights findings, and never see findings before publication.';
const SPONSOR_RULE_TA = 'ThinkTN உள்ளடக்கம் அல்லது Insights கண்டறிதல்களுக்கு அருகில் நிதி ஆதரவாளர்கள் ஒருபோதும் இடம்பெற மாட்டார்கள்; வெளியீட்டுக்கு முன் கண்டறிதல்களைப் பார்க்கவும் மாட்டார்கள்.';
const FEEDER_HOW = 'We feed founders to state programmes and incubators rather than duplicate them, and every figure we report carries a source or a confidence tag.';
const FEEDER_HOW_TA = 'மாநிலத் திட்டங்களையும் இன்குபேட்டர்களையும் நகலெடுக்காமல், அவற்றுக்கு நிறுவனர்களை அனுப்புகிறோம். நாங்கள் அறிக்கையிடும் ஒவ்வொரு எண்ணுக்கும் ஒரு மூலம் அல்லது நம்பக அடையாளம் உண்டு.';
const TENDER_NOTE = "We respond to tenders and expressions of interest. Send us the reference number and we'll route it to the right team.";
const TENDER_NOTE_TA = 'டெண்டர்களுக்கும் விருப்ப வெளிப்பாடுகளுக்கும் (EOI) பதிலளிக்கிறோம். குறிப்பு எண்ணை அனுப்புங்கள்; சரியான குழுவுக்கு அனுப்பி வைக்கிறோம்.';
export { TENDER_NOTE, TENDER_NOTE_TA };
const DISTRICT_ONE_LINE_TA = 'மாவட்ட நிர்வாகம், StartupTN அல்லது ஒரு CSR நிதியளிப்பாளருடன் இணைந்து, ஒரு மாவட்டத்தில் ஓராண்டுக்கு StartNet-இன் நான்கு பிராண்டுகளும். ஒவ்வொரு மாவட்டத்துக்கும் தனியாக வரையறுத்து விலை நிர்ணயிக்கப்படுகிறது.';
export { DISTRICT_ONE_LINE_TA };

/**
 * Partner type pages (T11; district-programme is T03).
 * hubCard: the five cards on /partner (Book 2 §8.0). Outcome lines are taken from each audience page's meta description.
 * Every string field `x` may carry a Tamil twin `xTa`; read it with tf(t, obj, 'x').
 */
export const PARTNER_TYPES = {
  institutions: {
    slug: 'institutions',
    icon: GraduationCap,
    label: 'Institutions', labelTa: 'கல்வி நிறுவனங்கள்',
    menuLabel: 'Universities & colleges', menuLabelTa: 'பல்கலைக்கழகங்கள் & கல்லூரிகள்',
    enquiryType: 'institution',
    partnerTypes: ['institution'],
    seoTitle: 'Partner with StartNet: universities & colleges',
    seoTitleTa: 'StartNet உடன் கூட்டு: பல்கலைக்கழகங்கள் & கல்லூரிகள்',
    description: 'Turn students and faculty into founders and report it: Vibe Campus, StartNet Labs, the Institution Partner Programme and your own StartNet X space.',
    descriptionTa: 'மாணவர்களையும் ஆசிரியர்களையும் நிறுவனர்களாக்கி அதை அறிக்கையிடுங்கள்: Vibe Campus, StartNet Labs, Institution Partner Programme, உங்களுக்கென ஒரு StartNet X தளம்.',
    eyebrow: 'For universities & colleges', eyebrowTa: 'பல்கலைக்கழகங்கள் & கல்லூரிகளுக்கு',
    title: 'Count your graduates who build companies, not just the ones who get placed.',
    titleTa: 'வேலைக்குச் சேர்ந்தவர்களை மட்டுமல்ல, நிறுவனங்களை உருவாக்கும் உங்கள் பட்டதாரிகளையும் கணக்கிடுங்கள்.',
    lede: 'Turn students and faculty into founders and report it: Vibe Campus, StartNet Labs, the Institution Partner Programme and your own StartNet X space.',
    ledeTa: 'மாணவர்களையும் ஆசிரியர்களையும் நிறுவனர்களாக்கி அதை அறிக்கையிடுங்கள்: Vibe Campus, StartNet Labs, Institution Partner Programme, உங்களுக்கென ஒரு StartNet X தளம்.',
    hubOutcome: 'Turn students and faculty into founders, and report it.',
    hubOutcomeTa: 'மாணவர்களையும் ஆசிரியர்களையும் நிறுவனர்களாக்கி, அதை அறிக்கையிடுங்கள்.',
    offersTitle: 'An offer ladder: start small, then go further',
    offersTitleTa: 'படிப்படியான வாய்ப்புகள்: சிறிதாகத் தொடங்கி, பிறகு மேலே செல்லுங்கள்',
    offers: [
      {
        title: 'Start with a Vibe Campus night or a district Vibathon',
        titleTa: 'ஒரு Vibe Campus இரவு அல்லது மாவட்ட Vibathon-உடன் தொடங்குங்கள்',
        body: 'One evening or one weekend on your campus, building with AI, in Tamil or English.',
        bodyTa: 'உங்கள் வளாகத்தில் ஒரு மாலை அல்லது ஒரு வார இறுதி, AI கொண்டு உருவாக்குதல், தமிழிலோ ஆங்கிலத்திலோ.',
        to: '/vibe/campus', linkLabel: 'Vibe Campus',
      },
      {
        title: 'Become a Vibathon host college', titleTa: 'Vibathon நடத்தும் கல்லூரியாகுங்கள்',
        body: 'Host an edition of Vibathon, a StartNet Vibe programme, for your students and your district.',
        bodyTa: 'StartNet Vibe திட்டமான Vibathon-இன் ஒரு பதிப்பை உங்கள் மாணவர்களுக்காகவும் உங்கள் மாவட்டத்துக்காகவும் நடத்துங்கள்.',
        to: '/vibe/for-colleges', linkLabel: 'For colleges', linkLabelTa: 'கல்லூரிகளுக்கு',
      },
      {
        title: 'Join the Institution Partner Programme', titleTa: 'Institution Partner Programme-இல் இணையுங்கள்',
        body: 'Lab membership, innovation policy kit, faculty development, Campus Innovation Index score, your own StartNet X space.',
        bodyTa: 'Lab உறுப்பினர், புத்தாக்கக் கொள்கைத் தொகுப்பு, ஆசிரியர் மேம்பாடு, Campus Innovation Index மதிப்பெண், உங்களுக்கென ஒரு StartNet X தளம்.',
        to: '/research/institution-partner-programme', linkLabel: 'Institution Partner Programme',
      },
    ],
    reportTitle: 'What you can report', reportTitleTa: 'நீங்கள் அறிக்கையிடக்கூடியவை',
    report: ['Student founders by ladder level', 'Companies formed', 'Patents and spinouts', 'IIC activity'],
    reportTa: ['ஏணி நிலை வாரியாக மாணவ நிறுவனர்கள்', 'உருவான நிறுவனங்கள்', 'காப்புரிமைகளும் ஸ்பின்அவுட்களும்', 'IIC செயல்பாடுகள்'],
    proof: ['Signed institutions', 'Lab charter and kill criteria', 'Tenant demo'],
    objection: 'Another AI-workshop vendor.', objectionTa: 'இன்னொரு AI பயிலரங்கு விற்பனையாளர்.',
    tier: {
      label: 'StartNet X institution licence, from, a year, by size',
      labelTa: 'StartNet X கல்வி நிறுவன உரிமம், அளவைப் பொறுத்து, ஆண்டுக்குக் குறைந்தபட்சம்',
      value: 300000, prefix: '₹',
      note: 'Branded tenant, cohorts and LMS, IIC and NAAC innovation reporting, Campus or Research Index score, student Pro seats, Vibe Campus events.',
      noteTa: 'உங்கள் பிராண்டிலான தளம், குழுக்களும் LMS-உம், IIC மற்றும் NAAC புத்தாக்க அறிக்கையிடல், Campus அல்லது Research Index மதிப்பெண், மாணவர் Pro இருக்கைகள், Vibe Campus நிகழ்வுகள்.',
    },
    ctas: [
      { label: 'Book a consultation', labelTa: 'ஆலோசனைக்கு நேரம் பதிவு செய்யுங்கள்', enquire: true },
      { label: 'Host a Vibe Campus night', labelTa: 'Vibe Campus இரவை நடத்துங்கள்', to: '/vibe/campus' },
    ],
    waRef: 'partner-inst',
  },
  gccs: {
    slug: 'gccs',
    icon: Briefcase,
    label: 'GCCs & corporates', labelTa: 'GCC-கள் & பெரு நிறுவனங்கள்',
    menuLabel: 'GCCs & corporates', menuLabelTa: 'GCC-கள் & பெரு நிறுவனங்கள்',
    enquiryType: 'gcc',
    partnerTypes: ['gcc', 'GCC', 'corporate'],
    seoTitle: 'Partner with StartNet: GCCs & corporates',
    seoTitleTa: 'StartNet உடன் கூட்டு: GCC-கள் & பெரு நிறுவனங்கள்',
    description: 'Problem statements, pilots, talent and intrapreneur programmes for Global Capability Centres and corporates in Tamil Nadu.',
    descriptionTa: 'தமிழ்நாட்டில் உள்ள Global Capability Centre-கள் மற்றும் பெரு நிறுவனங்களுக்கான சவால் அறிக்கைகள், முன்னோட்டங்கள், திறமையாளர்கள், உள்-தொழில்முனைவோர் திட்டங்கள்.',
    eyebrow: 'For Global Capability Centres & corporates', eyebrowTa: 'Global Capability Centre-கள் & பெரு நிறுவனங்களுக்கு',
    title: "Your problems, solved by Tamil Nadu's next founders.",
    titleTa: 'உங்கள் சவால்களுக்குத் தீர்வு, தமிழ்நாட்டின் அடுத்த நிறுவனர்களிடமிருந்து.',
    lede: 'Problem statements, pilots, talent and intrapreneur programmes for Global Capability Centres and corporates in Tamil Nadu.',
    ledeTa: 'தமிழ்நாட்டில் உள்ள Global Capability Centre-கள் மற்றும் பெரு நிறுவனங்களுக்கான சவால் அறிக்கைகள், முன்னோட்டங்கள், திறமையாளர்கள், உள்-தொழில்முனைவோர் திட்டங்கள்.',
    hubOutcome: 'Problem statements, pilots, talent and intrapreneur programmes.',
    hubOutcomeTa: 'சவால் அறிக்கைகள், முன்னோட்டங்கள், திறமையாளர்கள், உள்-தொழில்முனைவோர் திட்டங்கள்.',
    offersTitle: 'Ways in', offersTitleTa: 'தொடங்கும் வழிகள்',
    offers: [
      {
        id: 'tracks', title: 'Sponsor a Vibathon track', titleTa: 'ஒரு Vibathon பிரிவுக்கு நிதி ஆதரவளியுங்கள்',
        body: 'Put your problem in front of student teams building with AI across Tamil Nadu.',
        bodyTa: 'தமிழ்நாடு முழுவதும் AI கொண்டு உருவாக்கும் மாணவக் குழுக்களின் முன் உங்கள் சவாலை வையுங்கள்.',
        to: '/vibe/vibathon#partners', linkLabel: 'Vibathon partnerships', linkLabelTa: 'Vibathon கூட்டாண்மைகள்',
      },
      {
        id: 'talent', title: 'Add a talent package', titleTa: 'திறமையாளர் தொகுப்பைப் பெறுங்கள்',
        body: 'Opted-in access to talent from StartNet programmes. Talent profiles are shared only with people who opt in.',
        bodyTa: 'StartNet திட்டங்களிலிருந்து, ஒப்புதல் அளித்த திறமையாளர்களை அணுகும் வாய்ப்பு. ஒப்புதல் அளித்தவர்களின் சுயவிவரங்கள் மட்டுமே பகிரப்படும்.',
      },
      {
        id: 'intrapreneurs',
        title: 'Sponsor a StartNet Lab or run an intrapreneur-to-founder programme for your staff',
        titleTa: 'ஒரு StartNet Lab-க்கு நிதி ஆதரவளியுங்கள், அல்லது உங்கள் ஊழியர்களை நிறுவனர்களாக்கும் திட்டத்தை நடத்துங்கள்',
        body: 'Co-sign Lab problem statements, or give your own people a founder route.',
        bodyTa: 'Lab சவால் அறிக்கைகளில் இணைந்து கையெழுத்திடுங்கள், அல்லது உங்கள் சொந்த ஊழியர்களுக்கு நிறுவனர் ஆகும் வழியைக் கொடுங்கள்.',
        to: '/research/labs#sponsor', linkLabel: 'Lab sponsorship', linkLabelTa: 'Lab நிதி ஆதரவு',
      },
    ],
    reportTitle: 'What you get', reportTitleTa: 'உங்களுக்குக் கிடைப்பவை',
    report: ['Signed problem statements', 'Funded proofs of concept', 'Opted-in access to talent', 'Pilots with startups', 'A quarterly innovation-impact report'],
    reportTa: ['கையெழுத்திட்ட சவால் அறிக்கைகள்', 'நிதியளிக்கப்பட்ட கருத்துச் சான்றுகள் (PoC)', 'ஒப்புதல் அளித்த திறமையாளர்களை அணுகும் வாய்ப்பு', 'ஸ்டார்ட்அப்களுடன் முன்னோட்டங்கள்', 'காலாண்டு புத்தாக்கத் தாக்க அறிக்கை'],
    microcopy: 'Talent profiles are shared only with people who opt in.',
    microcopyTa: 'ஒப்புதல் அளித்தவர்களின் திறமையாளர் சுயவிவரங்கள் மட்டுமே பகிரப்படும்.',
    proof: ['DPDP and security posture', 'Signed GCCs', 'Pilot outcomes'],
    objection: 'Can a small firm deliver? Is our data safe?',
    objectionTa: 'ஒரு சிறிய நிறுவனத்தால் இதைச் செய்ய முடியுமா? எங்கள் தரவு பாதுகாப்பாக இருக்குமா?',
    trustLink: { label: 'Read how StartNet X handles data', labelTa: 'StartNet X தரவை எப்படிக் கையாள்கிறது என்று படியுங்கள்', to: '/startnet-x/trust' },
    tier: {
      label: 'StartNet X GCC / corporate licence, from, a year',
      labelTa: 'StartNet X GCC / பெரு நிறுவன உரிமம், ஆண்டுக்குக் குறைந்தபட்சம்',
      value: 1000000, prefix: '₹',
      note: 'Challenge board, pilot pipeline, talent access, intrapreneur cohort, innovation-impact reports.',
      noteTa: 'சவால் பலகை, முன்னோட்ட வரிசை, திறமையாளர் அணுகல், உள்-தொழில்முனைவோர் குழு, புத்தாக்கத் தாக்க அறிக்கைகள்.',
    },
    ctas: [
      { label: 'Post a problem statement', labelTa: 'ஒரு சவால் அறிக்கையைப் பதிவிடுங்கள்', enquire: true, topic: 'pilots' },
      { label: 'Talk to the partnerships team', labelTa: 'கூட்டாண்மைக் குழுவிடம் பேசுங்கள்', enquire: true, variant: 'secondary' },
    ],
    waRef: 'partner-gcc',
  },
  government: {
    slug: 'government',
    icon: Landmark,
    label: 'Government', labelTa: 'அரசு',
    menuLabel: 'Government & districts', menuLabelTa: 'அரசு & மாவட்டங்கள்',
    enquiryType: 'government',
    partnerTypes: ['government'],
    seoTitle: 'Partner with StartNet: government & districts',
    seoTitleTa: 'StartNet உடன் கூட்டு: அரசு & மாவட்டங்கள்',
    description: 'District Ecosystem Programmes, co-hosted flagships and scheme delivery for StartupTN, iTNT and district administrations, reported with tagged data.',
    descriptionTa: 'StartupTN, iTNT மற்றும் மாவட்ட நிர்வாகங்களுக்கான District Ecosystem Programme-கள், இணைந்து நடத்தும் முதன்மை நிகழ்வுகள், அரசுத் திட்ட அமலாக்கம், குறியிட்ட தரவுடன் அறிக்கையிடப்படுகின்றன.',
    eyebrow: 'For government & districts', eyebrowTa: 'அரசு & மாவட்டங்களுக்கு',
    title: 'Founder programmes your district can measure.',
    titleTa: 'உங்கள் மாவட்டம் அளவிடக்கூடிய நிறுவனர் திட்டங்கள்.',
    lede: 'District Ecosystem Programmes, co-hosted flagships and scheme delivery for StartupTN, iTNT and district administrations, reported with tagged data.',
    ledeTa: 'StartupTN, iTNT மற்றும் மாவட்ட நிர்வாகங்களுக்கான District Ecosystem Programme-கள், இணைந்து நடத்தும் முதன்மை நிகழ்வுகள், அரசுத் திட்ட அமலாக்கம், குறியிட்ட தரவுடன் அறிக்கையிடப்படுகின்றன.',
    hubOutcome: 'District programmes, co-hosted flagships and scheme delivery, reported with tagged data.',
    hubOutcomeTa: 'மாவட்டத் திட்டங்கள், இணைந்து நடத்தும் முதன்மை நிகழ்வுகள், அரசுத் திட்ட அமலாக்கம்; அனைத்தும் குறியிட்ட தரவுடன்.',
    offersTitle: 'Offers', offersTitleTa: 'வாய்ப்புகள்',
    offers: [
      {
        title: 'District Ecosystem Programme',
        body: 'All four StartNet brands in one district for a year, run with the district administration, StartupTN or a CSR funder.',
        bodyTa: 'மாவட்ட நிர்வாகம், StartupTN அல்லது ஒரு CSR நிதியளிப்பாளருடன் இணைந்து, ஒரு மாவட்டத்தில் ஓராண்டுக்கு StartNet-இன் நான்கு பிராண்டுகளும்.',
        to: '/partner/district-programme', linkLabel: 'About the programme', linkLabelTa: 'திட்டத்தைப் பற்றி',
      },
      {
        title: 'Co-hosted flagships', titleTa: 'இணைந்து நடத்தும் முதன்மை நிகழ்வுகள்',
        body: 'Vibathon, the Lab-to-Market Summit and the Women Founders Summit, co-hosted in your district or state.',
        bodyTa: 'Vibathon, Lab-to-Market Summit, Women Founders Summit ஆகியவை உங்கள் மாவட்டத்திலோ மாநிலத்திலோ இணைந்து நடத்தப்படுகின்றன.',
      },
      {
        title: 'Scheme-delivery cohorts', titleTa: 'அரசுத் திட்ட அமலாக்கக் குழுக்கள்',
        body: 'Founder cohorts that feed your schemes, reported against the measures you set.',
        bodyTa: 'உங்கள் திட்டங்களுக்கு நிறுவனர்களை அனுப்பும் குழுக்கள், நீங்கள் நிர்ணயிக்கும் அளவீடுகளின் அடிப்படையில் அறிக்கையிடப்படுகின்றன.',
      },
      {
        title: 'District or state dashboards on StartNet X', titleTa: 'StartNet X-இல் மாவட்ட அல்லது மாநில டாஷ்போர்டுகள்',
        body: 'District or state dashboards, programme operations, scheme pipelines and open-data feeds.',
        bodyTa: 'மாவட்ட அல்லது மாநில டாஷ்போர்டுகள், திட்டச் செயல்பாடுகள், அரசுத் திட்ட வரிசைகள், திறந்த தரவு ஊட்டங்கள்.',
        to: '/startnet-x', linkLabel: 'StartNet X',
      },
    ],
    howWeWork: FEEDER_HOW, howWeWorkTa: FEEDER_HOW_TA,
    microcopy: TENDER_NOTE, microcopyTa: TENDER_NOTE_TA,
    proof: ['Feeder-and-connector stance', 'District Ledger', 'Co-host history'],
    objection: 'Does this duplicate StartupTN?', objectionTa: 'இது StartupTN செய்வதையே மீண்டும் செய்கிறதா?',
    tier: {
      label: 'StartNet X government / ecosystem licence, from, a year',
      labelTa: 'StartNet X அரசு / சூழலமைப்பு உரிமம், ஆண்டுக்குக் குறைந்தபட்சம்',
      value: 2500000, prefix: '₹',
      note: 'District or state dashboards, programme operations, scheme pipelines, open-data feeds.',
      noteTa: 'மாவட்ட அல்லது மாநில டாஷ்போர்டுகள், திட்டச் செயல்பாடுகள், அரசுத் திட்ட வரிசைகள், திறந்த தரவு ஊட்டங்கள்.',
    },
    ctas: [{ label: 'Request a briefing', labelTa: 'விளக்கக் கூட்டத்தைக் கோருங்கள்', enquire: true, topic: 'district-programme' }],
    waRef: 'partner-gov',
  },
  sponsors: {
    slug: 'sponsors',
    icon: Megaphone,
    label: 'Sponsors', labelTa: 'நிதி ஆதரவாளர்கள்',
    menuLabel: 'Sponsors', menuLabelTa: 'நிதி ஆதரவாளர்கள் (Sponsors)',
    enquiryType: 'sponsor',
    partnerTypes: ['sponsor'],
    seoTitle: 'Sponsor or fund StartNet programmes',
    seoTitleTa: 'StartNet திட்டங்களுக்கு நிதி ஆதரவளியுங்கள்',
    description: 'Reach students, scholars, professionals and women founders across Tamil Nadu. Sponsorship packages and CSR-funded founder programmes.',
    descriptionTa: 'தமிழ்நாடு முழுவதும் மாணவர்கள், ஆய்வாளர்கள், தொழில் வல்லுநர்கள், பெண் நிறுவனர்களைச் சென்றடையுங்கள். நிதி ஆதரவுத் தொகுப்புகளும் CSR நிதியிலான நிறுவனர் திட்டங்களும்.',
    eyebrow: 'For sponsors', eyebrowTa: 'நிதி ஆதரவாளர்களுக்கு',
    title: 'Meet the audience before everyone else does.',
    titleTa: 'மற்றவர்களுக்கு முன்பே இந்தப் பார்வையாளர்களைச் சந்தியுங்கள்.',
    lede: 'Reach students, scholars, professionals and women founders across Tamil Nadu.',
    ledeTa: 'தமிழ்நாடு முழுவதும் மாணவர்கள், ஆய்வாளர்கள், தொழில் வல்லுநர்கள், பெண் நிறுவனர்களைச் சென்றடையுங்கள்.',
    hubOutcome: 'Reach students, scholars, professionals and women founders across Tamil Nadu.',
    hubOutcomeTa: 'தமிழ்நாடு முழுவதும் மாணவர்கள், ஆய்வாளர்கள், தொழில் வல்லுநர்கள், பெண் நிறுவனர்களைச் சென்றடையுங்கள்.',
    offersTitle: 'Packages', offersTitleTa: 'தொகுப்புகள்',
    offers: [
      { title: 'By audience', titleTa: 'பார்வையாளர் வாரியாக', body: 'Students, scholars, professionals, women founders.', bodyTa: 'மாணவர்கள், ஆய்வாளர்கள், தொழில் வல்லுநர்கள், பெண் நிறுவனர்கள்.' },
      { title: 'By format', titleTa: 'வடிவம் வாரியாக', body: 'Flagship, sector Connect, district edition, report sponsorship.', bodyTa: 'முதன்மை நிகழ்வு, துறைசார் Connect, மாவட்டப் பதிப்பு, அறிக்கை நிதி ஆதரவு.' },
      { title: 'Annual all-brand packages', titleTa: 'ஆண்டு முழுவதற்குமான அனைத்து-பிராண்ட் தொகுப்புகள்', body: 'Annual all-brand packages available.', bodyTa: 'ஆண்டு முழுவதற்குமான அனைத்து-பிராண்ட் தொகுப்புகள் கிடைக்கின்றன.' },
    ],
    rule: SPONSOR_RULE, ruleTa: SPONSOR_RULE_TA,
    proof: ['Tagged audience profiles', 'Post-event reports'],
    objection: 'How many, verified how?', objectionTa: 'எத்தனை பேர், எப்படிச் சரிபார்க்கப்பட்டது?',
    rateCard: true,
    ctas: [{ label: 'Talk to us', labelTa: 'எங்களிடம் பேசுங்கள்', enquire: true, topic: 'reach' }],
    crossLink: {
      label: 'Funding founders through CSR? See CSR founder programmes',
      labelTa: 'CSR வழியாக நிறுவனர்களுக்கு நிதியளிக்கிறீர்களா? CSR நிறுவனர் திட்டங்களைப் பாருங்கள்',
      to: '/partner/csr',
    },
    waRef: 'partner-spon',
  },
  csr: {
    slug: 'csr',
    icon: HeartHandshake,
    label: 'CSR', labelTa: 'CSR',
    menuLabel: 'CSR foundations', menuLabelTa: 'CSR அறக்கட்டளைகள்',
    enquiryType: 'csr',
    partnerTypes: ['csr', 'CSR'],
    seoTitle: 'CSR-funded founder programmes (Schedule VII)',
    seoTitleTa: 'CSR நிதியிலான நிறுவனர் திட்டங்கள் (அட்டவணை VII)',
    description: 'Student-founder, women-founder and district programmes aligned to Schedule VII of the Companies Act, with quarterly outcome reports.',
    descriptionTa: 'நிறுவனங்கள் சட்டத்தின் அட்டவணை VII-க்கு இணங்கிய மாணவ நிறுவனர், பெண் நிறுவனர், மாவட்டத் திட்டங்கள், காலாண்டு விளைவு அறிக்கைகளுடன்.',
    eyebrow: 'For CSR foundations', eyebrowTa: 'CSR அறக்கட்டளைகளுக்கு',
    title: 'Fund founders, and see the outcomes.',
    titleTa: 'நிறுவனர்களுக்கு நிதியளியுங்கள், விளைவுகளைப் பாருங்கள்.',
    lede: 'Student-founder, women-founder and district programmes, aligned to Schedule VII of the Companies Act and your CSR policy, with quarterly outcome reports.',
    ledeTa: 'நிறுவனங்கள் சட்டத்தின் அட்டவணை VII-க்கும் உங்கள் CSR கொள்கைக்கும் இணங்கிய மாணவ நிறுவனர், பெண் நிறுவனர், மாவட்டத் திட்டங்கள், காலாண்டு விளைவு அறிக்கைகளுடன்.',
    hubOutcome: 'Student-founder, women-founder and district programmes with quarterly outcome reports.',
    hubOutcomeTa: 'மாணவ நிறுவனர், பெண் நிறுவனர், மாவட்டத் திட்டங்கள், காலாண்டு விளைவு அறிக்கைகளுடன்.',
    offersTitle: 'Programmes you can fund', offersTitleTa: 'நீங்கள் நிதியளிக்கக்கூடிய திட்டங்கள்',
    offers: [
      {
        title: 'Student-founder programmes', titleTa: 'மாணவ நிறுவனர் திட்டங்கள்',
        body: 'Seats for student teams in Vibe programmes, from first build to pre-incubation.',
        bodyTa: 'Vibe திட்டங்களில் மாணவக் குழுக்களுக்கான இடங்கள், முதல் உருவாக்கத்திலிருந்து முன்-இன்குபேஷன் வரை.',
        to: '/vibe', linkLabel: 'StartNet Vibe',
      },
      {
        title: 'Women-founder programmes', titleTa: 'பெண் நிறுவனர் திட்டங்கள்',
        body: 'Circles, Rise Academy and HerCapital for women founders across Tamil Nadu.',
        bodyTa: 'தமிழ்நாடு முழுவதும் உள்ள பெண் நிறுவனர்களுக்கான Circles, Rise Academy, HerCapital.',
        to: '/women', linkLabel: 'StartNet Women',
      },
      {
        title: 'District programmes', titleTa: 'மாவட்டத் திட்டங்கள்',
        body: 'All four StartNet brands in one district for a year.',
        bodyTa: 'ஒரு மாவட்டத்தில் ஓராண்டுக்கு StartNet-இன் நான்கு பிராண்டுகளும்.',
        to: '/partner/district-programme', linkLabel: 'District Ecosystem Programme',
      },
    ],
    entityNote: 'CSR funds are received through [placeholder — StartNet Foundation (CSR-1) or a registered implementing partner, to be confirmed].',
    entityNoteTa: 'CSR நிதிகள் [இடநிரப்பி — StartNet Foundation (CSR-1) அல்லது பதிவுசெய்யப்பட்ட செயல்படுத்தும் கூட்டாளர், உறுதிப்படுத்தப்பட வேண்டும்] வழியாகப் பெறப்படுகின்றன.',
    rule: SPONSOR_RULE, ruleTa: SPONSOR_RULE_TA,
    proof: ['Schedule VII-compliant outcomes', 'Tagged audience profiles', 'Post-event reports'],
    objection: 'How many, verified how?', objectionTa: 'எத்தனை பேர், எப்படிச் சரிபார்க்கப்பட்டது?',
    ctas: [{ label: 'Request a CSR proposal', labelTa: 'CSR முன்மொழிவைக் கோருங்கள்', enquire: true, topic: 'csr-programme' }],
    crossLink: {
      label: 'Looking for sponsorship packages? See sponsors',
      labelTa: 'நிதி ஆதரவுத் தொகுப்புகளைத் தேடுகிறீர்களா? நிதி ஆதரவாளர்கள் பக்கத்தைப் பாருங்கள்',
      to: '/partner/sponsors',
    },
    waRef: 'partner-spon',
  },
  investors: {
    slug: 'investors',
    icon: TrendingUp,
    label: 'Investors', labelTa: 'முதலீட்டாளர்கள்',
    menuLabel: 'Investors', menuLabelTa: 'முதலீட்டாளர்கள்',
    enquiryType: 'investor',
    partnerTypes: ['investor'],
    seoTitle: 'For investors: StartNet founder deal flow',
    seoTitleTa: 'முதலீட்டாளர்களுக்கு: StartNet நிறுவனர் முதலீட்டு வாய்ப்புகள்',
    description: 'Meet founders from StartNet programmes at investor days, through StartNet X and, when open, StartNet Angels.',
    descriptionTa: 'StartNet திட்டங்களின் நிறுவனர்களை முதலீட்டாளர் நாட்களிலும், StartNet X வழியாகவும், திறக்கப்படும்போது StartNet Angels வழியாகவும் சந்தியுங்கள்.',
    eyebrow: 'For investors', eyebrowTa: 'முதலீட்டாளர்களுக்கு',
    title: "Meet founders before they're on everyone's list.",
    titleTa: 'அனைவரின் பட்டியலிலும் இடம்பெறுவதற்கு முன்பே நிறுவனர்களைச் சந்தியுங்கள்.',
    lede: 'Meet founders from StartNet programmes at investor days, through StartNet X and, when open, StartNet Angels.',
    ledeTa: 'StartNet திட்டங்களின் நிறுவனர்களை முதலீட்டாளர் நாட்களிலும், StartNet X வழியாகவும், திறக்கப்படும்போது StartNet Angels வழியாகவும் சந்தியுங்கள்.',
    hubOutcome: 'Meet founders from StartNet programmes at investor days and through StartNet X.',
    hubOutcomeTa: 'StartNet திட்டங்களின் நிறுவனர்களை முதலீட்டாளர் நாட்களிலும் StartNet X வழியாகவும் சந்தியுங்கள்.',
    offersTitle: 'Ways to meet founders', offersTitleTa: 'நிறுவனர்களைச் சந்திக்கும் வழிகள்',
    offers: [
      {
        title: 'Investor days', titleTa: 'முதலீட்டாளர் நாட்கள்',
        body: 'Investor days through Scale Connect and the Lab-to-Market Summit.',
        bodyTa: 'Scale Connect மற்றும் Lab-to-Market Summit வழியாக முதலீட்டாளர் நாட்கள்.',
        to: '/connect/scale#investor-days', linkLabel: 'Scale Connect',
      },
      {
        title: 'Curated deal flow on StartNet X', titleTa: 'StartNet X-இல் தேர்ந்தெடுக்கப்பட்ட முதலீட்டு வாய்ப்புகள்',
        body: 'Curated deal flow and data rooms on StartNet X, investor tier.',
        bodyTa: 'StartNet X முதலீட்டாளர் அடுக்கில், தேர்ந்தெடுக்கப்பட்ட முதலீட்டு வாய்ப்புகளும் தரவு அறைகளும்.',
        priceStat: { value: 50000, prefix: '₹', label: 'Investor tier, from, a year', labelTa: 'முதலீட்டாளர் அடுக்கு, ஆண்டுக்குக் குறைந்தபட்சம்' },
      },
      {
        title: 'StartNet Angels',
        body: 'StartNet Angels when it opens through a SEBI-compliant structure.',
        bodyTa: 'SEBI விதிமுறைகளுக்கு இணங்கிய அமைப்பின் வழியாகத் திறக்கப்படும்போது StartNet Angels.',
        to: '/connect/angels', linkLabel: 'StartNet Angels',
      },
    ],
    legal: 'Nothing on this page is an offer of securities or investment advice.',
    legalTa: 'இந்தப் பக்கத்தில் உள்ள எதுவும் பங்குப் பத்திரங்களுக்கான சலுகையோ முதலீட்டு ஆலோசனையோ அல்ல.',
    irLine: 'Interested in investing in StartNet itself? Write to [placeholder — investor relations email].',
    irLineTa: 'StartNet-இலேயே முதலீடு செய்ய ஆர்வமா? [இடநிரப்பி — முதலீட்டாளர் உறவுகள் மின்னஞ்சல்] முகவரிக்கு எழுதுங்கள்.',
    proof: ['Team', 'Founder Ledger', 'Corrections log', 'ThinkTN related-party disclosure'],
    objection: 'Are the numbers real?', objectionTa: 'இந்த எண்கள் உண்மையானவையா?',
    ctas: [
      { label: 'Register as an investor', labelTa: 'முதலீட்டாளராகப் பதிவு செய்யுங்கள்', enquire: true, topic: 'deal-flow' },
      { label: 'Join an investor day', labelTa: 'முதலீட்டாளர் நாளில் கலந்துகொள்ளுங்கள்', to: '/connect/scale#investor-days', variant: 'secondary' },
    ],
    waRef: 'partner-inv',
  },
  incubators: {
    slug: 'incubators',
    icon: Sprout,
    label: 'Incubators & TBIs', labelTa: 'இன்குபேட்டர்கள் & TBI-கள்',
    menuLabel: 'Incubators & TBIs', menuLabelTa: 'இன்குபேட்டர்கள் & TBI-கள்',
    enquiryType: 'incubator',
    partnerTypes: ['incubator'],
    seoTitle: 'Partner with StartNet: incubators & TBIs',
    seoTitleTa: 'StartNet உடன் கூட்டு: இன்குபேட்டர்கள் & TBI-கள்',
    description: 'Hand-offs from StartNet programmes into your incubator, and a StartNet X tenant to run your own programmes.',
    descriptionTa: 'StartNet திட்டங்களிலிருந்து உங்கள் இன்குபேட்டருக்கு நிறுவனர்கள், உங்கள் சொந்தத் திட்டங்களை நடத்த ஒரு StartNet X தளம்.',
    eyebrow: 'For incubators & TBIs', eyebrowTa: 'இன்குபேட்டர்கள் & TBI-களுக்கு',
    title: 'We send founders on to you, with their record attached.',
    titleTa: 'நிறுவனர்களை அவர்களின் பதிவுகளுடன் உங்களிடம் அனுப்புகிறோம்.',
    lede: 'We are a feeder and connector, not a rival to the institutions already doing this well. We send founders on to incubators, state programmes and investor networks.',
    ledeTa: 'நாங்கள் நிறுவனர்களை அனுப்பி இணைப்பவர்கள்; ஏற்கெனவே இதைச் சிறப்பாகச் செய்யும் நிறுவனங்களுக்குப் போட்டியாளர்கள் அல்ல. நிறுவனர்களை இன்குபேட்டர்கள், மாநிலத் திட்டங்கள், முதலீட்டாளர் வலையமைப்புகளுக்கு அனுப்புகிறோம்.',
    hubOutcome: 'Hand-offs from StartNet programmes, and a StartNet X tenant for your programmes.',
    hubOutcomeTa: 'StartNet திட்டங்களிலிருந்து நிறுவனர்கள், உங்கள் திட்டங்களுக்கு ஒரு StartNet X தளம்.',
    offersTitle: 'How we work with incubators', offersTitleTa: 'இன்குபேட்டர்களுடன் நாங்கள் எப்படிச் செயல்படுகிறோம்',
    offers: [
      {
        title: 'Hand-offs from StartNet programmes', titleTa: 'StartNet திட்டங்களிலிருந்து நிறுவனர் ஒப்படைப்பு',
        body: 'Student teams from Vibe Launchpad and founders from StartNet programmes, with routes into partner incubators and state seed schemes.',
        bodyTa: 'Vibe Launchpad மாணவக் குழுக்களும் StartNet திட்ட நிறுவனர்களும், கூட்டாளர் இன்குபேட்டர்கள் மற்றும் மாநில விதை நிதித் திட்டங்களுக்கான வழிகளுடன்.',
        to: '/vibe/launchpad', linkLabel: 'Vibe Launchpad',
      },
      {
        title: 'A StartNet X incubator tenant', titleTa: 'StartNet X இன்குபேட்டர் தளம்',
        body: 'Programme CRM, applications and judging, portfolio tracking, Ledger export, investor-day tools.',
        bodyTa: 'திட்ட CRM, விண்ணப்பங்களும் மதிப்பீடும், போர்ட்ஃபோலியோ கண்காணிப்பு, Ledger ஏற்றுமதி, முதலீட்டாளர் நாள் கருவிகள்.',
        to: '/startnet-x', linkLabel: 'StartNet X',
      },
      {
        title: 'Co-hosted investor days', titleTa: 'இணைந்து நடத்தும் முதலீட்டாளர் நாட்கள்',
        body: 'Bring your portfolio to investor days through Scale Connect.',
        bodyTa: 'Scale Connect வழியாக முதலீட்டாளர் நாட்களுக்கு உங்கள் போர்ட்ஃபோலியோவைக் கொண்டு வாருங்கள்.',
        to: '/connect/scale', linkLabel: 'Scale Connect',
      },
    ],
    proof: ['Founder Ledger', 'Feeder-and-connector stance'],
    tier: {
      label: 'StartNet X incubator / TBI licence, from, a year',
      labelTa: 'StartNet X இன்குபேட்டர் / TBI உரிமம், ஆண்டுக்குக் குறைந்தபட்சம்',
      value: 200000, prefix: '₹',
      note: 'Programme CRM, applications and judging, portfolio tracking, Ledger export, investor-day tools.',
      noteTa: 'திட்ட CRM, விண்ணப்பங்களும் மதிப்பீடும், போர்ட்ஃபோலியோ கண்காணிப்பு, Ledger ஏற்றுமதி, முதலீட்டாளர் நாள் கருவிகள்.',
    },
    ctas: [{ label: 'Book a call', labelTa: 'அழைப்புக்கு நேரம் பதிவு செய்யுங்கள்', enquire: true }],
    waRef: 'partner-inc',
  },
  'district-programme': {
    slug: 'district-programme',
    icon: MapPinned,
    label: 'District Ecosystem Programme',
    menuLabel: 'District Ecosystem Programme',
    enquiryType: 'government',
    partnerTypes: ['government', 'csr', 'CSR'],
    seoTitle: 'District Ecosystem Programme',
    description: 'All four StartNet brands in one district for a year, run with the district administration, StartupTN or a CSR funder. Scoped and priced per district.',
    descriptionTa: DISTRICT_ONE_LINE_TA,
    eyebrow: 'Ready-made solution · Government & CSR', eyebrowTa: 'தயார்நிலைத் தீர்வு · அரசு & CSR',
    title: 'Four brands. One district. One year.', titleTa: 'நான்கு பிராண்டுகள். ஒரு மாவட்டம். ஓராண்டு.',
    lede: 'District Ecosystem Programme: all four StartNet brands in one district for a year, run with the district administration, StartupTN or a CSR funder. Scoped and priced per district.',
    ledeTa: `District Ecosystem Programme: ${DISTRICT_ONE_LINE_TA}`,
    hubOutcome: 'All four StartNet brands in one district for a year.',
    hubOutcomeTa: 'ஒரு மாவட்டத்தில் ஓராண்டுக்கு StartNet-இன் நான்கு பிராண்டுகளும்.',
    fourBrands: true,
    offersTitle: 'What runs in your district', offersTitleTa: 'உங்கள் மாவட்டத்தில் நடப்பவை',
    howWeWork: FEEDER_HOW, howWeWorkTa: FEEDER_HOW_TA,
    microcopy: TENDER_NOTE, microcopyTa: TENDER_NOTE_TA,
    proof: ['District Ledger', 'Co-host history', 'Feeder-and-connector stance'],
    objection: 'Does this duplicate StartupTN?', objectionTa: 'இது StartupTN செய்வதையே மீண்டும் செய்கிறதா?',
    ctas: [{ label: 'Discuss a district programme', labelTa: 'மாவட்டத் திட்டம் பற்றிப் பேசுங்கள்', enquire: true, topic: 'district-programme' }],
    waRef: 'partner-gov',
  },
};

/** Every /partner/:type slug, for route validation (client) and the server's sitemap / 404 check (F-97). */
export const PARTNER_TYPE_SLUGS = Object.freeze(Object.keys(PARTNER_TYPES));

/** Own-key lookup: never resolves Object.prototype names such as "constructor" or "valueOf". */
export const getPartnerType = (slug) =>
  typeof slug === 'string' && hasOwn(PARTNER_TYPES, slug) ? PARTNER_TYPES[slug] : null;

/** Book 2 §8.0 — five hub cards (Sponsors & CSR share one card). */
export const HUB_CARDS = [
  { key: 'institutions', to: '/partner/institutions', label: 'Institutions', labelTa: 'கல்வி நிறுவனங்கள்', icon: GraduationCap },
  { key: 'gccs', to: '/partner/gccs', label: 'GCCs & corporates', labelTa: 'GCC-கள் & பெரு நிறுவனங்கள்', icon: Briefcase },
  { key: 'government', to: '/partner/government', label: 'Government', labelTa: 'அரசு', icon: Landmark },
  {
    key: 'sponsors', to: '/partner/sponsors', label: 'Sponsors & CSR', labelTa: 'நிதி ஆதரவாளர்கள் & CSR', icon: Megaphone,
    outcome: 'Reach students, scholars, professionals and women founders. Sponsorship packages and CSR-funded founder programmes.',
    outcomeTa: 'மாணவர்கள், ஆய்வாளர்கள், தொழில் வல்லுநர்கள், பெண் நிறுவனர்களைச் சென்றடையுங்கள். நிதி ஆதரவுத் தொகுப்புகளும் CSR நிதியிலான நிறுவனர் திட்டங்களும்.',
  },
  { key: 'investors', to: '/partner/investors', label: 'Investors', labelTa: 'முதலீட்டாளர்கள்', icon: TrendingUp },
];

/** Book 1 Part B §3.2 ⑦ — full "partner by type" list (seven types). */
export const ALL_TYPES = ['institutions', 'gccs', 'government', 'sponsors', 'csr', 'investors', 'incubators'];

/** Build /partner/enquire?type=…&topic=… */
export function enquirePath(type, topic) {
  const p = new URLSearchParams();
  if (type) p.set('type', type);
  if (topic) p.set('topic', topic);
  const qs = p.toString();
  return `/partner/enquire${qs ? `?${qs}` : ''}`;
}

/** "since Mon YYYY" (English) or "Mon YYYY முதல்" (Tamil) for signed partners. */
export function sinceLabel(since, lang = 'en') {
  if (!since) return '';
  const ta = lang === 'ta';
  const d = new Date(since);
  const when = Number.isNaN(d.getTime())
    ? String(since)
    : d.toLocaleDateString(ta ? 'ta-IN' : 'en-IN', { month: 'short', year: 'numeric', timeZone: 'Asia/Kolkata' });
  return ta ? `${when} முதல்` : `since ${when}`;
}
