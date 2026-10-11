// StartNet X "Built for" audience pages (Book 1 Part B §2.2 + §3.2 ⑥, template T11; Book 2 §7.2 copy, §7.3 pricing).
// Every user-visible string is an [English, Tamil] pair; the page renders it with t(en, ta).
// Book 2 §7.2 copy is used verbatim where it exists (founders, institutions, GCCs, government). Incubators and
// investors have no §7.2 row: their copy is built from the §7.3 organisation tiers and Book 1 Part A §3.2 / §4.2.
// Proof lists follow Book 1 Part A §3.2 "Proof needed"; FAQs answer the §3.1/§3.2 objections with book facts only.
// Prices are indicative, ex-GST, tag C (Book 2 §7.3) until the published rate card replaces them (Appendix A #10).

export const AUDIENCE_ORDER = ['founders', 'institutions', 'incubators', 'gccs', 'government', 'investors'];

export const PRICE_SOURCE = ['StartNet X pricing (indicative, ex-GST)', 'StartNet X விலை (தோராயமானது, GST தவிர்த்து)'];
export const PRICE_NOTE = [
  'Indicative price until the published rate card replaces it.',
  'வெளியிடப்படும் கட்டண அட்டை வரும் வரை இது தோராயமான விலை.',
];

/** The nine StartNet X modules (Book 2 §7.1). Status is Appendix A #11: never shown as Live until confirmed. */
export const MODULES = {
  id: { name: 'SNX ID', icon: 'Fingerprint', line: ['One sign-in and profile across all StartNet brands.', 'எல்லா StartNet பிராண்டுகளுக்கும் ஒரே உள்நுழைவு, ஒரே சுயவிவரம்.'] },
  events: { name: 'Events', icon: 'CalendarCheck', line: ['Register, pay and get your QR ticket, even inside WhatsApp.', 'பதிவு செய்யுங்கள், கட்டணம் செலுத்துங்கள், QR டிக்கெட்டைப் பெறுங்கள்; WhatsApp-க்குள்ளேயே கூட.'] },
  learn: { name: 'Learn', icon: 'GraduationCap', line: ['Courses and cohorts with verifiable certificates.', 'சரிபார்க்கக்கூடிய சான்றிதழ்களுடன் பாடநெறிகளும் குழுக்களும்.'] },
  circles: { name: 'Circles', icon: 'Users', line: ['Your chapter, attendance and introductions.', 'உங்கள் கிளை, வருகைப் பதிவு, அறிமுகங்கள்.'] },
  launch: { name: 'Launch', icon: 'Rocket', line: ['Apply to programmes and track milestones.', 'திட்டங்களுக்கு விண்ணப்பித்து, மைல்கற்களைக் கண்காணியுங்கள்.'] },
  capital: { name: 'Capital', icon: 'Landmark', line: ['Data room, investor CRM and grant tracker.', 'தரவு அறை, முதலீட்டாளர் CRM, மானியக் கண்காணிப்பு.'] },
  access: { name: 'Access', icon: 'Briefcase', line: ['Apply to GCC and government problem statements.', 'GCC மற்றும் அரசுப் பிரச்சினை அறிக்கைகளுக்கு விண்ணப்பியுங்கள்.'] },
  insights: { name: 'Insights & Ledger', icon: 'LineChart', line: ['Dashboards and the public Founder Ledger.', 'டாஷ்போர்டுகளும் பொது Founder Ledger-உம்.'] },
  agents: { name: 'Agents', icon: 'Bot', line: ['An AI Founder Coach, Matchmaker and Grant Navigator that suggest; people decide.', 'AI Founder Coach, Matchmaker, Grant Navigator பரிந்துரைக்கின்றன; முடிவெடுப்பது மனிதர்களே.'] },
};

/** Book 1 Part B §2.2: org "For X" pages lead with "Request a demo"; Book 2 §7.2 overrides per page where it has copy. */
export const DEFAULT_ORG_CTA = ['Request a demo', 'டெமோ கோருங்கள்'];

const ORG_STEPS = (who, cta) => [
  {
    title: cta,
    body: [
      `Tell us about your ${who[0]} and what you want to run. Your enquiry goes to a named owner, with a reference number.`,
      `உங்கள் ${who[1]} பற்றியும், நீங்கள் நடத்த விரும்புவது பற்றியும் சொல்லுங்கள். உங்கள் கோரிக்கை, குறிப்பு எண்ணுடன், பொறுப்புள்ள ஒருவரிடம் செல்லும்.`,
    ],
  },
  {
    title: ['See it on sample data', 'மாதிரித் தரவில் பாருங்கள்'],
    body: [
      'We walk you through the space you would use, on clearly marked sample data, until live tenants agree to be shown.',
      'நீங்கள் பயன்படுத்தப்போகும் பகுதியை, தெளிவாகக் குறிக்கப்பட்ட மாதிரித் தரவில் காட்டுகிறோம். நேரடிப் பயனர்கள் ஒப்புக்கொள்ளும் வரை இதுவே முறை.',
    ],
  },
  {
    title: ['Agree the licence and go live', 'உரிமத்தை ஒப்புக்கொண்டு தொடங்குங்கள்'],
    body: [
      'An annual licence from the published tiers. We set up your space, and you invite your people.',
      'வெளியிடப்பட்ட நிலைகளில் இருந்து ஆண்டு உரிமம். உங்கள் பகுதியை நாங்கள் அமைக்கிறோம்; உங்கள் குழுவை நீங்கள் அழைக்கிறீர்கள்.',
    ],
  },
];

const SIGNED_ONLY = ['[placeholder — signed tenants only]', '[இடம்பிடிப்பு — கையெழுத்திட்டவர்கள் மட்டும்]'];
const TO_BE_SUPPLIED = ['[placeholder — to be supplied by StartNet]', '[இடம்பிடிப்பு — StartNet வழங்கும்]'];

export const AUDIENCES = {
  /* ------------------------------------------------------------------ Founders & learners (P1) */
  founders: {
    id: 'founders',
    navLabel: ['For founders', 'நிறுவனர்களுக்கு'],
    menuLabel: ['Founders & learners (free)', 'நிறுவனர்கள் & கற்பவர்கள் (இலவசம்)'],
    seoTitle: ['StartNet X for founders: one free founder profile', 'நிறுவனர்களுக்கு StartNet X: இலவச சுயவிவரம்'], // SEO-TA: pending native review
    seoDescription: [
      'A free profile that follows you through every StartNet programme, with courses, matching, grant help and a data room as you grow.',
      'ஒவ்வொரு StartNet திட்டத்திலும் உங்களைத் தொடரும் இலவசச் சுயவிவரம்; நீங்கள் வளரும்போது பாடநெறிகள், பொருத்துதல், மானிய உதவி, தரவு அறை.',
    ],
    eyebrow: ['Built for founders & learners', 'நிறுவனர்கள் & கற்பவர்களுக்காக'],
    title: ['Your founder journey, in one place.', 'உங்கள் நிறுவனர் பயணம், ஒரே இடத்தில்.'],
    lede: [
      'Free to start. Upgrade only when you need team tools, a data room or investor access.',
      'தொடங்குவது இலவசம். குழுக் கருவிகள், தரவு அறை அல்லது முதலீட்டாளர் அணுகல் தேவைப்படும்போது மட்டும் மேம்படுத்துங்கள்.',
    ],
    micro: [
      'Free for individuals. Works on your phone, on WhatsApp and in Tamil.',
      'தனிநபர்களுக்கு இலவசம். உங்கள் கைப்பேசியிலும் WhatsApp-இலும் தமிழிலும் செயல்படும்.',
    ],
    art: { variant: 'ladder', seed: 21 },
    cta: { kind: 'snx', path: '/signup', label: ['Create your free profile', 'உங்கள் இலவச சுயவிவரத்தை உருவாக்குங்கள்'] },
    gives: [
      {
        title: ['What you get free', 'இலவசமாக உங்களுக்குக் கிடைப்பது'],
        body: [
          'Your profile, event registration, starter courses and Founder Coach (lite). No card needed.',
          'உங்கள் சுயவிவரம், நிகழ்வுப் பதிவு, தொடக்கப் பாடநெறிகள், Founder Coach (lite). கட்டண அட்டை தேவையில்லை.',
        ],
      },
      {
        title: ['When to upgrade', 'எப்போது மேம்படுத்தலாம்'],
        body: [
          'Pro, Team and Scale add the full Academy, co-founder and mentor matching, a team data room and investor tools, when you need them.',
          'Pro, Team, Scale திட்டங்கள் முழு Academy, இணை நிறுவனர் மற்றும் வழிகாட்டி பொருத்துதல், குழுத் தரவு அறை, முதலீட்டாளர் கருவிகளைச் சேர்க்கின்றன; தேவைப்படும்போது மட்டும்.',
        ],
      },
      {
        title: ['Your data, your choice', 'உங்கள் தரவு, உங்கள் விருப்பம்'],
        body: [
          'You choose who sees your profile. It is shared with an investor, GCC or institution only if you opt in, and every share is logged.',
          'உங்கள் சுயவிவரத்தை யார் பார்க்கலாம் என்பதை நீங்களே முடிவு செய்கிறீர்கள். நீங்கள் ஒப்புக்கொண்டால் மட்டுமே அது முதலீட்டாளர், GCC அல்லது கல்வி நிறுவனத்துடன் பகிரப்படும்; ஒவ்வொரு பகிர்வும் பதிவாகும்.',
        ],
      },
    ],
    modules: [
      { id: 'id', why: ['One profile from your first Vibathon to your first funding. You never start again.', 'முதல் Vibathon முதல் முதல் நிதி வரை ஒரே சுயவிவரம். மீண்டும் தொடக்கத்தில் இருந்து தொடங்க வேண்டியதில்லை.'] },
      { id: 'events', why: ['Register for StartNet events and keep every ticket in one place.', 'StartNet நிகழ்வுகளுக்குப் பதிவு செய்து, எல்லா டிக்கெட்டுகளையும் ஒரே இடத்தில் வைத்திருங்கள்.'] },
      { id: 'learn', why: ['Starter courses are free. Pro opens the full Academy library and certificates.', 'தொடக்கப் பாடநெறிகள் இலவசம். Pro முழு Academy நூலகத்தையும் சான்றிதழ்களையும் திறக்கும்.'] },
      { id: 'circles', why: ['Find your chapter and the people who can introduce you onward.', 'உங்கள் கிளையையும், உங்களை அடுத்தவர்களுக்கு அறிமுகப்படுத்தக்கூடியவர்களையும் கண்டறியுங்கள்.'] },
      { id: 'agents', why: ['Founder Coach (lite) is free. The agents suggest; people decide.', 'Founder Coach (lite) இலவசம். முகவர்கள் பரிந்துரைக்கின்றன; முடிவெடுப்பது மனிதர்களே.'] },
    ],
    steps: [
      {
        title: ['Sign up on your phone', 'உங்கள் கைப்பேசியில் பதிவு செய்யுங்கள்'],
        body: [
          'Use your phone or WhatsApp OTP, an email link or Google. Choose Tamil or English.',
          'கைப்பேசி அல்லது WhatsApp OTP, மின்னஞ்சல் இணைப்பு அல்லது Google மூலம் பதிவு செய்யுங்கள். தமிழ் அல்லது ஆங்கிலத்தைத் தேர்ந்தெடுங்கள்.',
        ],
      },
      {
        title: ['Choose what you share', 'எதைப் பகிர்வது என்று முடிவு செய்யுங்கள்'],
        body: [
          'Each purpose has its own box, unticked by default. You can withdraw consent with one tap.',
          'ஒவ்வொரு நோக்கத்துக்கும் தனிப் பெட்டி; இயல்பாக அவை தேர்வு செய்யப்படாதவை. ஒரே தட்டலில் ஒப்புதலைத் திரும்பப் பெறலாம்.',
        ],
      },
      {
        title: ['Get your ladder card', 'உங்கள் ஏணி அட்டையைப் பெறுங்கள்'],
        body: [
          'Your profile starts at L1. We suggest a next step that fits you: an event, a Club, a Circle or a programme.',
          'உங்கள் சுயவிவரம் L1-இல் தொடங்கும். உங்களுக்குப் பொருந்தும் அடுத்த அடியைப் பரிந்துரைப்போம்: ஒரு நிகழ்வு, Club, Circle அல்லது திட்டம்.',
        ],
      },
    ],
    pricing: {
      title: ['Free to start. Pay only when you need more.', 'தொடங்குவது இலவசம். கூடுதல் தேவைப்படும்போது மட்டும் கட்டணம்.'],
      stats: [
        { value: 0, prefix: '₹', label: ['SNX Free, for anyone starting out', 'SNX Free, தொடங்கும் அனைவருக்கும்'], countUp: false },
        { value: 499, prefix: '₹', unit: '/month', unitTa: '/மாதம்', label: ['SNX Pro, for learners and solo founders', 'SNX Pro, கற்பவர்களுக்கும் தனி நிறுவனர்களுக்கும்'] },
        { value: 50, unit: '%', label: ['Off Pro for students', 'மாணவர்களுக்கு Pro-வில் தள்ளுபடி'] },
      ],
      notes: [
        ['Connect and Women Circle members get Pro included.', 'Connect மற்றும் Women Circle உறுப்பினர்களுக்கு Pro சேர்த்தே வழங்கப்படும்.'],
        ['Pay by UPI Autopay, card or net banking. Cancel any time; access runs to the end of the period.', 'UPI Autopay, அட்டை அல்லது இணைய வங்கி மூலம் செலுத்தலாம். எப்போது வேண்டுமானாலும் ரத்து செய்யலாம்; காலம் முடியும் வரை அணுகல் தொடரும்.'],
      ],
      link: { label: ['Compare every plan', 'எல்லாத் திட்டங்களையும் ஒப்பிடுங்கள்'], to: '/startnet-x/pricing#plans' },
    },
    proof: {
      title: ['Free means free. Check for yourself.', 'இலவசம் என்றால் இலவசம்தான். நீங்களே சரிபாருங்கள்.'],
      lede: [
        'Your data stays in India. You choose who sees your profile. No automated rejections, ever.',
        'உங்கள் தரவு இந்தியாவிலேயே இருக்கும். உங்கள் சுயவிவரத்தை யார் பார்க்கலாம் என்பதை நீங்களே தேர்வு செய்கிறீர்கள். தானியங்கி நிராகரிப்பு ஒருபோதும் இல்லை.',
      ],
      items: [
        { title: ['Is this a fee trap?', 'இது கட்டணப் பொறியா?'], body: ['SNX Free needs no card. Every paid plan is listed in public.', 'SNX Free-க்கு அட்டை தேவையில்லை. கட்டணத் திட்டங்கள் அனைத்தும் பொதுவில் பட்டியலிடப்பட்டுள்ளன.'], link: { label: ['See pricing', 'விலையைப் பாருங்கள்'], to: '/startnet-x/pricing' } },
        { title: ['What did founders do next?', 'நிறுவனர்கள் அடுத்து என்ன செய்தார்கள்?'], body: ['Founder stories are published with written consent and tagged outcomes.', 'நிறுவனர் கதைகள் எழுத்துப்பூர்வ ஒப்புதலுடனும் குறியிடப்பட்ட விளைவுகளுடனும் வெளியிடப்படுகின்றன.'], link: { label: ['Read founder stories', 'நிறுவனர் கதைகளைப் படியுங்கள்'], to: '/insights/stories' } },
        { title: ['Who can see my data?', 'என் தரவை யார் பார்க்கலாம்?'], body: ['Your rights under the DPDP Act 2023: access, correct, erase, withdraw consent.', 'DPDP சட்டம் 2023-இன் கீழ் உங்கள் உரிமைகள்: அணுகல், திருத்தம், அழித்தல், ஒப்புதலைத் திரும்பப் பெறுதல்.'], link: { label: ['How we handle your data', 'உங்கள் தரவை எப்படிக் கையாள்கிறோம்'], to: '/startnet-x/trust' } },
      ],
    },
    faq: [
      { q: ['Is Free really free?', 'Free உண்மையிலேயே இலவசமா?'], a: ['Yes, no card needed.', 'ஆம், கட்டண அட்டை தேவையில்லை.'] },
      { q: ['Is it only for Chennai?', 'இது சென்னைக்கு மட்டுமா?'], a: ['No. StartNet X works on your phone and on WhatsApp, wherever you are in Tamil Nadu.', 'இல்லை. தமிழ்நாட்டில் நீங்கள் எங்கிருந்தாலும் StartNet X உங்கள் கைப்பேசியிலும் WhatsApp-இலும் செயல்படும்.'] },
      { q: ["My English isn't good enough. Can I use it?", 'எனக்கு ஆங்கிலம் சரியாக வராது. பயன்படுத்த முடியுமா?'], a: ['Yes. StartNet X works in Tamil and English. You choose your language when you sign up.', 'ஆம். StartNet X தமிழிலும் ஆங்கிலத்திலும் செயல்படும். பதிவு செய்யும்போதே உங்கள் மொழியைத் தேர்ந்தெடுக்கலாம்.'] },
      { q: ['Can my college pay for me?', 'என் கல்லூரி எனக்காகக் கட்டணம் செலுத்த முடியுமா?'], a: ['Yes, through an institution licence.', 'ஆம், கல்வி நிறுவன உரிமம் மூலம்.'] },
      { q: ["What if I'm sponsored by CSR?", 'CSR மூலம் எனக்கு நிதியுதவி கிடைத்தால்?'], a: ['Your seat is activated with a code.', 'ஒரு குறியீடு மூலம் உங்கள் இடம் செயல்படுத்தப்படும்.'] },
      { q: ['Do you sell my data?', 'என் தரவை விற்கிறீர்களா?'], a: ['No.', 'இல்லை.'] },
    ],
    whatsapp: ["Hi StartNet, I'd like help setting up my StartNet X profile", 'வணக்கம் StartNet, என் StartNet X சுயவிவரத்தை அமைக்க உதவி வேண்டும்'],
    closing: {
      title: ['Start where you are.', 'நீங்கள் இருக்கும் இடத்திலிருந்தே தொடங்குங்கள்.'],
      body: [
        "Make a free StartNet X profile and we'll show you the next step that fits you: an event, a course, a circle or a programme.",
        'இலவச StartNet X சுயவிவரத்தை உருவாக்குங்கள்; உங்களுக்குப் பொருந்தும் அடுத்த அடியைக் காட்டுவோம்: ஒரு நிகழ்வு, பாடநெறி, Circle அல்லது திட்டம்.',
      ],
    },
  },

  /* ------------------------------------------------------------------ Institutions (P2) */
  institutions: {
    id: 'institutions',
    enquiryType: 'institution',
    partnerPage: '/partner/institutions',
    navLabel: ['For institutions', 'கல்வி நிறுவனங்களுக்கு'],
    menuLabel: ['Institutions', 'கல்வி நிறுவனங்கள்'],
    seoTitle: ['StartNet X for colleges: student founder platform', 'கல்லூரிகளுக்கு StartNet X: மாணவ நிறுவனர் தளம்'], // SEO-TA: pending native review
    seoDescription: [
      'Your own branded space on StartNet X: cohorts, courses, innovation reporting and student founder outcomes, tracked in one place.',
      'StartNet X-இல் உங்கள் சொந்த பிராண்டட் பகுதி: குழுக்கள், பாடநெறிகள், புத்தாக்க அறிக்கைகள், மாணவ நிறுவனர் விளைவுகள், அனைத்தும் ஒரே இடத்தில்.',
    ],
    eyebrow: ['Built for universities & colleges', 'பல்கலைக்கழகங்கள் & கல்லூரிகளுக்காக'],
    title: ['Run your innovation programme on StartNet X.', 'உங்கள் புத்தாக்கத் திட்டத்தை StartNet X-இல் நடத்துங்கள்.'],
    lede: [
      'A branded space for your students and faculty, with the reporting your IIC and accreditation teams need.',
      'உங்கள் மாணவர்களுக்கும் ஆசிரியர்களுக்கும் ஒரு பிராண்டட் பகுதி; உங்கள் IIC மற்றும் அங்கீகாரக் குழுக்களுக்குத் தேவையான அறிக்கைகளுடன்.',
    ],
    micro: ['Your branded tenant at x.startnet.in/t/your-institution', 'உங்கள் பிராண்டட் பகுதி: x.startnet.in/t/your-institution'],
    art: { variant: 'grid', seed: 31 },
    who: ['institution', 'கல்வி நிறுவனம்'],
    ctaLabel: ['Book a demo', 'டெமோவுக்கு முன்பதிவு செய்யுங்கள்'], // Book 2 §7.2
    needs: [
      ['Founder outcomes you can report, not workshops you have to justify.', 'நியாயப்படுத்த வேண்டிய பயிலரங்குகள் அல்ல; அறிக்கையிடக்கூடிய நிறுவனர் விளைவுகள்.'],
      ['NAAC- and NIRF-relevant innovation metrics, ready when the accreditation team asks.', 'அங்கீகாரக் குழு கேட்கும்போது தயாராக இருக்கும் NAAC, NIRF தொடர்பான புத்தாக்க அளவீடுகள்.'],
      ['One place for student founders, faculty and cohorts, instead of spreadsheets and forms.', 'விரிதாள்களும் படிவங்களும் அல்ல; மாணவ நிறுவனர்கள், ஆசிரியர்கள், குழுக்களுக்கு ஒரே இடம்.'],
    ],
    gives: [
      { title: ['Branded tenant', 'பிராண்டட் பகுதி'], body: ['Your own space at x.startnet.in/t/your-institution, for your students and faculty.', 'உங்கள் மாணவர்களுக்கும் ஆசிரியர்களுக்கும் x.startnet.in/t/your-institution என்ற உங்கள் சொந்தப் பகுதி.'] },
      { title: ['Cohorts, LMS and reporting', 'குழுக்கள், LMS, அறிக்கைகள்'], body: ['Cohorts, LMS and IIC/NAAC innovation reporting, with your Campus or Research Index score.', 'குழுக்கள், LMS, IIC/NAAC புத்தாக்க அறிக்கைகள்; உங்கள் Campus அல்லது Research Index மதிப்பெண்ணுடன்.'] },
      { title: ['Student Pro seats included', 'மாணவர் Pro இடங்கள் சேர்த்தே'], body: ['Student Pro seats and Vibe Campus events come with the licence.', 'மாணவர் Pro இடங்களும் Vibe Campus நிகழ்வுகளும் உரிமத்துடன் சேர்ந்து வரும்.'] },
    ],
    modules: [
      { id: 'learn', why: ['Run cohorts and courses for students and faculty, with certificates anyone can verify.', 'மாணவர்களுக்கும் ஆசிரியர்களுக்கும் குழுக்களும் பாடநெறிகளும்; யாரும் சரிபார்க்கக்கூடிய சான்றிதழ்களுடன்.'] },
      { id: 'launch', why: ['Students apply to programmes and you see their milestones.', 'மாணவர்கள் திட்டங்களுக்கு விண்ணப்பிக்கிறார்கள்; அவர்களின் மைல்கற்களை நீங்கள் பார்க்கிறீர்கள்.'] },
      { id: 'events', why: ['Vibe Campus events and your own sessions, with registration and QR tickets.', 'Vibe Campus நிகழ்வுகளும் உங்கள் சொந்த அமர்வுகளும்; பதிவு மற்றும் QR டிக்கெட்டுகளுடன்.'] },
      { id: 'insights', why: ['Innovation reporting and student founder outcomes, tagged A, B or C.', 'புத்தாக்க அறிக்கைகளும் மாணவ நிறுவனர் விளைவுகளும், A, B அல்லது C குறியுடன்.'] },
    ],
    pricing: {
      title: ['An annual licence, priced by size.', 'அளவைப் பொறுத்து விலையிடப்படும் ஆண்டு உரிமம்.'],
      stats: [{ value: 3, prefix: '₹', unit: 'L / year', unitTa: 'L / ஆண்டு', label: ['Institution licence, from, by size', 'கல்வி நிறுவன உரிமம், தொடக்க விலை, அளவைப் பொறுத்து'] }],
      includes: ['Branded tenant, cohorts and LMS, IIC and NAAC innovation reporting, Campus or Research Index score, student Pro seats, Vibe Campus events.', 'பிராண்டட் பகுதி, குழுக்கள் மற்றும் LMS, IIC, NAAC புத்தாக்க அறிக்கைகள், Campus அல்லது Research Index மதிப்பெண், மாணவர் Pro இடங்கள், Vibe Campus நிகழ்வுகள்.'],
      notes: [["Institutions can pay by purchase order. Multi-year terms get a discount; we don't negotiate case by case.", 'கல்வி நிறுவனங்கள் கொள்முதல் ஆணை மூலம் செலுத்தலாம். பல ஆண்டு ஒப்பந்தங்களுக்குத் தள்ளுபடி உண்டு; தனித்தனியாகப் பேரம் பேசுவதில்லை.']],
      link: { label: ['See organisation pricing', 'நிறுவன விலையைப் பாருங்கள்'], to: '/startnet-x/pricing#organisations' },
    },
    proof: {
      title: ['What to check before you sign.', 'கையெழுத்திடும் முன் சரிபார்க்க வேண்டியவை.'],
      items: [
        { title: ['Signed institutions', 'கையெழுத்திட்ட கல்வி நிறுவனங்கள்'], body: ['Institutions appear here only with a signed agreement and a date.', 'கையெழுத்திட்ட ஒப்பந்தமும் தேதியும் இருந்தால் மட்டுமே கல்வி நிறுவனங்கள் இங்கே தோன்றும்.'], placeholder: SIGNED_ONLY },
        { title: ['Lab charter and kill criteria', 'ஆய்வக சாசனமும் நிறுத்த அளவுகோல்களும்'], body: ['How StartNet Research Labs are run, and when one is closed.', 'StartNet Research ஆய்வகங்கள் எப்படி நடத்தப்படுகின்றன, எப்போது ஒன்று மூடப்படுகிறது.'], link: { label: ['See the Labs', 'ஆய்வகங்களைப் பாருங்கள்'], to: '/research/labs' } },
        { title: ['A tenant demo', 'பகுதி டெமோ'], body: ['See the space your students and faculty would use, on clearly marked sample data.', 'உங்கள் மாணவர்களும் ஆசிரியர்களும் பயன்படுத்தும் பகுதியை, தெளிவாகக் குறிக்கப்பட்ட மாதிரித் தரவில் பாருங்கள்.'], demo: true },
      ],
    },
    faq: [
      { q: ['Is this another AI-workshop vendor?', 'இது இன்னொரு AI பயிலரங்க விற்பனையாளரா?'], a: ['No. StartNet X tracks founder outcomes, not attendance: cohorts, ladder levels from L1 to L7, and innovation reporting with every figure tagged A, B or C.', 'இல்லை. StartNet X வருகையை அல்ல, நிறுவனர் விளைவுகளைக் கண்காணிக்கிறது: குழுக்கள், L1 முதல் L7 வரையிலான ஏணி நிலைகள், ஒவ்வொரு எண்ணுக்கும் A, B அல்லது C குறியுடன் புத்தாக்க அறிக்கைகள்.'] },
      { q: ['Can students use their own profile?', 'மாணவர்கள் தங்கள் சொந்தச் சுயவிவரத்தைப் பயன்படுத்தலாமா?'], a: ['Yes. Each student has one StartNet X profile across every StartNet brand, and chooses who sees it.', 'ஆம். ஒவ்வொரு மாணவருக்கும் எல்லா StartNet பிராண்டுகளிலும் ஒரே StartNet X சுயவிவரம்; அதை யார் பார்க்கலாம் என்பதை அவரே தேர்வு செய்கிறார்.'] },
      { q: ['Can we pay by purchase order?', 'கொள்முதல் ஆணை மூலம் செலுத்தலாமா?'], a: ['Yes. Institutions can pay by purchase order. Multi-year terms get a discount.', 'ஆம். கல்வி நிறுவனங்கள் கொள்முதல் ஆணை மூலம் செலுத்தலாம். பல ஆண்டு ஒப்பந்தங்களுக்குத் தள்ளுபடி உண்டு.'] },
      { q: ['Where is student data stored?', 'மாணவர் தரவு எங்கே சேமிக்கப்படுகிறது?'], a: ['In India, encrypted in transit and at rest. For anyone under 18, we ask for verifiable consent from a parent or guardian.', 'இந்தியாவில், பரிமாற்றத்திலும் சேமிப்பிலும் குறியாக்கத்துடன். 18 வயதுக்குட்பட்டவர்களுக்கு, பெற்றோர் அல்லது பாதுகாவலரின் சரிபார்க்கக்கூடிய ஒப்புதலைக் கேட்கிறோம்.'] },
    ],
  },

  /* ------------------------------------------------------------------ Incubators & TBIs (P2) */
  incubators: {
    id: 'incubators',
    enquiryType: 'incubator',
    partnerPage: '/partner/incubators',
    navLabel: ['For incubators', 'இன்குபேட்டர்களுக்கு'],
    menuLabel: ['Incubators & TBIs', 'இன்குபேட்டர்கள் & TBI-கள்'],
    seoTitle: ['StartNet X for incubators: programme CRM, portfolio', 'இன்குபேட்டர்களுக்கு StartNet X: திட்ட CRM'], // SEO-TA: pending native review
    seoDescription: [
      'Programme CRM, applications and judging, portfolio tracking, Ledger export and investor-day tools for incubators and TBIs.',
      'இன்குபேட்டர்களுக்கும் TBI-களுக்கும் திட்ட CRM, விண்ணப்பங்கள், மதிப்பீடு, போர்ட்ஃபோலியோ கண்காணிப்பு, Ledger ஏற்றுமதி, முதலீட்டாளர் தினக் கருவிகள்.',
    ],
    eyebrow: ['Built for incubators & TBIs', 'இன்குபேட்டர்கள் & TBI-களுக்காக'],
    title: ['Run every cohort on one platform.', 'ஒவ்வொரு குழுவையும் ஒரே தளத்தில் நடத்துங்கள்.'],
    lede: [
      'Programme CRM, applications and judging, portfolio tracking, Ledger export and investor-day tools, in one place.',
      'திட்ட CRM, விண்ணப்பங்கள், மதிப்பீடு, போர்ட்ஃபோலியோ கண்காணிப்பு, Ledger ஏற்றுமதி, முதலீட்டாளர் தினக் கருவிகள்; அனைத்தும் ஒரே இடத்தில்.',
    ],
    micro: ['Founders join free. Your licence covers the programme tools.', 'நிறுவனர்கள் இலவசமாக இணைகிறார்கள். உங்கள் உரிமம் திட்டக் கருவிகளுக்கானது.'],
    art: { variant: 'network', seed: 41 },
    who: ['incubator', 'இன்குபேட்டர்'],
    needs: [
      ['Applications, judging and cohort tracking without a stack of spreadsheets.', 'விரிதாள் குவியல் இல்லாமல் விண்ணப்பங்கள், மதிப்பீடு, குழுக் கண்காணிப்பு.'],
      ['Portfolio outcomes you can export and stand behind.', 'ஏற்றுமதி செய்யக்கூடிய, நம்பிக்கையுடன் முன்வைக்கக்கூடிய போர்ட்ஃபோலியோ விளைவுகள்.'],
      ['Founders who arrive with a profile, not a blank form.', 'வெற்றுப் படிவத்துடன் அல்ல, சுயவிவரத்துடன் வரும் நிறுவனர்கள்.'],
    ],
    gives: [
      { title: ['Programme CRM', 'திட்ட CRM'], body: ['Applications and judging, from first form to selected cohort. Every selection is made by a named person.', 'முதல் படிவம் முதல் தேர்ந்தெடுக்கப்பட்ட குழு வரை விண்ணப்பங்களும் மதிப்பீடும். ஒவ்வொரு தேர்வையும் பெயர் குறிப்பிடப்பட்ட ஒருவரே செய்கிறார்.'] },
      { title: ['Portfolio tracking', 'போர்ட்ஃபோலியோ கண்காணிப்பு'], body: ['Track milestones across your portfolio and export them in the Founder Ledger format.', 'உங்கள் போர்ட்ஃபோலியோ முழுவதும் மைல்கற்களைக் கண்காணித்து, Founder Ledger வடிவத்தில் ஏற்றுமதி செய்யுங்கள்.'] },
      { title: ['Investor day', 'முதலீட்டாளர் தினம்'], body: ['Investor-day tools for the founders you are ready to show.', 'காட்டத் தயாராக உள்ள நிறுவனர்களுக்கான முதலீட்டாளர் தினக் கருவிகள்.'] },
    ],
    modules: [
      { id: 'launch', why: ['Applications, judging and milestones for each cohort you run.', 'நீங்கள் நடத்தும் ஒவ்வொரு குழுவுக்கும் விண்ணப்பங்கள், மதிப்பீடு, மைல்கற்கள்.'] },
      { id: 'capital', why: ['Data rooms and investor CRM for your founders as they raise.', 'நிதி திரட்டும் உங்கள் நிறுவனர்களுக்குத் தரவு அறைகளும் முதலீட்டாளர் CRM-உம்.'] },
      { id: 'insights', why: ['Portfolio dashboards and Ledger export, with every figure tagged.', 'போர்ட்ஃபோலியோ டாஷ்போர்டுகளும் Ledger ஏற்றுமதியும்; ஒவ்வொரு எண்ணும் குறியுடன்.'] },
      { id: 'events', why: ['Demo days and cohort sessions with registration and QR tickets.', 'பதிவு மற்றும் QR டிக்கெட்டுகளுடன் டெமோ தினங்களும் குழு அமர்வுகளும்.'] },
    ],
    pricing: {
      title: ['An annual licence for your programmes.', 'உங்கள் திட்டங்களுக்கான ஆண்டு உரிமம்.'],
      stats: [{ value: 2, prefix: '₹', unit: 'L / year', unitTa: 'L / ஆண்டு', label: ['Incubator / TBI licence, from', 'இன்குபேட்டர் / TBI உரிமம், தொடக்க விலை'] }],
      includes: ['Programme CRM, applications and judging, portfolio tracking, Ledger export, investor-day tools.', 'திட்ட CRM, விண்ணப்பங்கள், மதிப்பீடு, போர்ட்ஃபோலியோ கண்காணிப்பு, Ledger ஏற்றுமதி, முதலீட்டாளர் தினக் கருவிகள்.'],
      notes: [['Multi-year terms get a discount; we don\'t negotiate case by case.', 'பல ஆண்டு ஒப்பந்தங்களுக்குத் தள்ளுபடி உண்டு; தனித்தனியாகப் பேரம் பேசுவதில்லை.']],
      link: { label: ['See organisation pricing', 'நிறுவன விலையைப் பாருங்கள்'], to: '/startnet-x/pricing#organisations' },
    },
    proof: {
      title: ['What to check before you sign.', 'கையெழுத்திடும் முன் சரிபார்க்க வேண்டியவை.'],
      items: [
        { title: ['Signed incubators', 'கையெழுத்திட்ட இன்குபேட்டர்கள்'], body: ['Incubators appear here only with a signed agreement and a date.', 'கையெழுத்திட்ட ஒப்பந்தமும் தேதியும் இருந்தால் மட்டுமே இன்குபேட்டர்கள் இங்கே தோன்றும்.'], placeholder: SIGNED_ONLY },
        { title: ['How outcomes are counted', 'விளைவுகள் எப்படிக் கணக்கிடப்படுகின்றன'], body: ['The ladder levels and the A/B/C tags behind every exported figure.', 'ஏற்றுமதி செய்யப்படும் ஒவ்வொரு எண்ணுக்கும் பின்னால் உள்ள ஏணி நிலைகளும் A/B/C குறிகளும்.'], link: { label: ['Read the evidence standard', 'சான்றுத் தரநிலையைப் படியுங்கள்'], to: '/about/evidence-standard' } },
        { title: ['Data protection', 'தரவுப் பாதுகாப்பு'], body: ['DPDP Act 2023, data stored in India, consent logged per purpose.', 'DPDP சட்டம் 2023, இந்தியாவில் சேமிக்கப்படும் தரவு, ஒவ்வொரு நோக்கத்துக்கும் பதிவாகும் ஒப்புதல்.'], link: { label: ['Trust, privacy & security', 'நம்பிக்கை, தனியுரிமை & பாதுகாப்பு'], to: '/startnet-x/trust' } },
      ],
    },
    faq: [
      { q: ['Do our founders have to pay?', 'எங்கள் நிறுவனர்கள் கட்டணம் செலுத்த வேண்டுமா?'], a: ['No. Founders and learners use StartNet X free. Your licence covers the programme tools.', 'இல்லை. நிறுவனர்களும் கற்பவர்களும் StartNet X-ஐ இலவசமாகப் பயன்படுத்துகிறார்கள். உங்கள் உரிமம் திட்டக் கருவிகளுக்கானது.'] },
      { q: ['Can we export portfolio data for our own reports?', 'எங்கள் சொந்த அறிக்கைகளுக்குப் போர்ட்ஃபோலியோ தரவை ஏற்றுமதி செய்யலாமா?'], a: ['Yes. Ledger export is part of the incubator licence, and every figure keeps its A, B or C tag.', 'ஆம். Ledger ஏற்றுமதி இன்குபேட்டர் உரிமத்தின் ஒரு பகுதி; ஒவ்வொரு எண்ணும் அதன் A, B அல்லது C குறியுடன் இருக்கும்.'] },
      { q: ['Does AI decide who gets selected?', 'யார் தேர்ந்தெடுக்கப்படுவது என்பதை AI முடிவு செய்கிறதா?'], a: ['No. There is no automated rejection. Every selection, funding or exclusion decision is made by a named person.', 'இல்லை. தானியங்கி நிராகரிப்பு இல்லை. ஒவ்வொரு தேர்வு, நிதி அல்லது விலக்கல் முடிவையும் பெயர் குறிப்பிடப்பட்ட ஒருவரே எடுக்கிறார்.'] },
    ],
  },

  /* ------------------------------------------------------------------ GCCs & corporates (P2) */
  gccs: {
    id: 'gccs',
    enquiryType: 'gcc',
    partnerPage: '/partner/gccs',
    navLabel: ['For GCCs', 'GCC-களுக்கு'],
    menuLabel: ['GCCs & corporates', 'GCC-கள் & நிறுவனங்கள்'],
    seoTitle: ['StartNet X for GCCs: problem statements and pilots', 'GCC-களுக்கு StartNet X: சிக்கல் அறிக்கைகள், பைலட்கள்'], // SEO-TA: pending native review
    seoDescription: [
      'Post problem statements, run pilots, meet opted-in talent and get innovation-impact reports, from one challenge board.',
      'பிரச்சினை அறிக்கைகளை வெளியிடுங்கள், முன்னோட்டங்களை நடத்துங்கள், ஒப்புக்கொண்ட திறமையாளர்களைச் சந்தியுங்கள், புத்தாக்கத் தாக்க அறிக்கைகளைப் பெறுங்கள்; ஒரே சவால் பலகையில்.',
    ],
    eyebrow: ['Built for GCCs & corporates', 'GCC-கள் & பெருநிறுவனங்களுக்காக'],
    title: ['Problems in. Pilots and talent out.', 'பிரச்சினைகள் உள்ளே. முன்னோட்டங்களும் திறமையும் வெளியே.'],
    lede: [
      'A challenge board, pilot pipeline and talent access for Global Capability Centres and corporates.',
      'Global Capability Centre-களுக்கும் பெருநிறுவனங்களுக்கும் சவால் பலகை, முன்னோட்டக் குழாய், திறமையாளர் அணுகல்.',
    ],
    micro: ['Talent is shown to you only if they opt in, and every share is logged.', 'திறமையாளர்கள் ஒப்புக்கொண்டால் மட்டுமே உங்களுக்குக் காட்டப்படுவார்கள்; ஒவ்வொரு பகிர்வும் பதிவாகும்.'],
    art: { variant: 'network', seed: 51 },
    who: ['company', 'நிறுவனம்'],
    ctaLabel: ['Book a demo', 'டெமோவுக்கு முன்பதிவு செய்யுங்கள்'], // Book 2 §7.2
    needs: [
      ['Pilots that start from your real problems, not a generic hackathon brief.', 'பொதுவான hackathon சுருக்கம் அல்ல; உங்கள் உண்மையான பிரச்சினைகளில் இருந்து தொடங்கும் முன்னோட்டங்கள்.'],
      ['AI talent and research from across Tamil Nadu, in one account.', 'தமிழ்நாடு முழுவதிலும் இருந்து AI திறமையும் ஆய்வும், ஒரே கணக்கில்.'],
      ['A report your leadership can read each quarter.', 'உங்கள் தலைமை ஒவ்வொரு காலாண்டும் படிக்கக்கூடிய ஓர் அறிக்கை.'],
    ],
    gives: [
      { title: ['Challenge board', 'சவால் பலகை'], body: ['Challenge board and pilot tracking, from problem statement to pilot result.', 'பிரச்சினை அறிக்கை முதல் முன்னோட்ட முடிவு வரை சவால் பலகையும் முன்னோட்டக் கண்காணிப்பும்.'] },
      { title: ['Opted-in talent', 'ஒப்புக்கொண்ட திறமையாளர்கள்'], body: ['Opted-in talent from Vibathon, Labs and Founder Switch.', 'Vibathon, Labs, Founder Switch-இல் இருந்து ஒப்புக்கொண்ட திறமையாளர்கள்.'] },
      { title: ['Impact reporting', 'தாக்க அறிக்கை'], body: ['Quarterly innovation-impact report, with an intrapreneur cohort if you want one.', 'காலாண்டுப் புத்தாக்கத் தாக்க அறிக்கை; நீங்கள் விரும்பினால் உள்நிறுவன தொழில்முனைவோர் குழுவுடன்.'] },
    ],
    modules: [
      { id: 'access', why: ['Post problem statements and run the pilot pipeline.', 'பிரச்சினை அறிக்கைகளை வெளியிட்டு, முன்னோட்டக் குழாயை நடத்துங்கள்.'] },
      { id: 'agents', why: ['The Matchmaker suggests people for your problems; your team decides.', 'உங்கள் பிரச்சினைகளுக்கு Matchmaker ஆட்களைப் பரிந்துரைக்கிறது; உங்கள் குழு முடிவு செய்கிறது.'] },
      { id: 'learn', why: ['Run an intrapreneur cohort with courses and certificates.', 'பாடநெறிகளும் சான்றிதழ்களும் கொண்ட உள்நிறுவன தொழில்முனைவோர் குழுவை நடத்துங்கள்.'] },
      { id: 'insights', why: ['Innovation-impact dashboards for your leadership.', 'உங்கள் தலைமைக்கான புத்தாக்கத் தாக்க டாஷ்போர்டுகள்.'] },
    ],
    pricing: {
      title: ['An annual licence for your site.', 'உங்கள் மையத்துக்கான ஆண்டு உரிமம்.'],
      stats: [{ value: 10, prefix: '₹', unit: 'L / year', unitTa: 'L / ஆண்டு', label: ['GCC / corporate licence, from', 'GCC / பெருநிறுவன உரிமம், தொடக்க விலை'] }],
      includes: ['Challenge board, pilot pipeline, talent access, intrapreneur cohort, innovation-impact reports.', 'சவால் பலகை, முன்னோட்டக் குழாய், திறமையாளர் அணுகல், உள்நிறுவன தொழில்முனைவோர் குழு, புத்தாக்கத் தாக்க அறிக்கைகள்.'],
      notes: [['Multi-year terms get a discount; we don\'t negotiate case by case.', 'பல ஆண்டு ஒப்பந்தங்களுக்குத் தள்ளுபடி உண்டு; தனித்தனியாகப் பேரம் பேசுவதில்லை.']],
      link: { label: ['See organisation pricing', 'நிறுவன விலையைப் பாருங்கள்'], to: '/startnet-x/pricing#organisations' },
    },
    proof: {
      title: ['What to check before you sign.', 'கையெழுத்திடும் முன் சரிபார்க்க வேண்டியவை.'],
      items: [
        { title: ['Data protection and security', 'தரவுப் பாதுகாப்பும் பாதுகாப்பு நிலையும்'], body: ['DPDP Act 2023, data stored in India, encrypted in transit and at rest.', 'DPDP சட்டம் 2023, இந்தியாவில் சேமிக்கப்படும் தரவு, பரிமாற்றத்திலும் சேமிப்பிலும் குறியாக்கம்.'], link: { label: ['Trust, privacy & security', 'நம்பிக்கை, தனியுரிமை & பாதுகாப்பு'], to: '/startnet-x/trust' } },
        { title: ['Signed GCCs', 'கையெழுத்திட்ட GCC-கள்'], body: ['GCCs appear here only with a signed agreement and a date.', 'கையெழுத்திட்ட ஒப்பந்தமும் தேதியும் இருந்தால் மட்டுமே GCC-கள் இங்கே தோன்றும்.'], placeholder: SIGNED_ONLY },
        { title: ['Pilot outcomes', 'முன்னோட்ட விளைவுகள்'], body: ['Partner stories with tagged outcomes, published with consent.', 'ஒப்புதலுடன் வெளியிடப்படும், குறியிடப்பட்ட விளைவுகளுடன் கூடிய கூட்டாளர் கதைகள்.'], link: { label: ['Read partner stories', 'கூட்டாளர் கதைகளைப் படியுங்கள்'], to: '/insights/stories?type=partner' } },
      ],
    },
    faq: [
      { q: ['Is our data safe?', 'எங்கள் தரவு பாதுகாப்பானதா?'], a: ['Data is stored in India and encrypted in transit and at rest. We follow the Digital Personal Data Protection Act, 2023.', 'தரவு இந்தியாவில் சேமிக்கப்பட்டு, பரிமாற்றத்திலும் சேமிப்பிலும் குறியாக்கம் செய்யப்படுகிறது. டிஜிட்டல் தனிநபர் தரவுப் பாதுகாப்புச் சட்டம், 2023-ஐ நாங்கள் பின்பற்றுகிறோம்.'] },
      { q: ['Can we see any profile we want?', 'நாங்கள் விரும்பும் எந்தச் சுயவிவரத்தையும் பார்க்கலாமா?'], a: ['No. A profile is shared with a GCC only if that person opts in, and every share is logged. We never sell personal data.', 'இல்லை. அந்த நபர் ஒப்புக்கொண்டால் மட்டுமே சுயவிவரம் GCC-யுடன் பகிரப்படும்; ஒவ்வொரு பகிர்வும் பதிவாகும். தனிப்பட்ட தரவை நாங்கள் ஒருபோதும் விற்பதில்லை.'] },
      { q: ['Who decides which pilots go ahead?', 'எந்த முன்னோட்டங்கள் தொடரும் என்பதை யார் முடிவு செய்கிறார்?'], a: ['People do. The agents suggest matches; every selection is made by a named person.', 'மனிதர்களே. முகவர்கள் பொருத்தங்களைப் பரிந்துரைக்கின்றன; ஒவ்வொரு தேர்வையும் பெயர் குறிப்பிடப்பட்ட ஒருவரே செய்கிறார்.'] },
    ],
  },

  /* ------------------------------------------------------------------ Government & districts (P2) */
  government: {
    id: 'government',
    enquiryType: 'government',
    partnerPage: '/partner/government',
    navLabel: ['For government', 'அரசுக்கு'],
    menuLabel: ['Government & districts', 'அரசு & மாவட்டங்கள்'],
    seoTitle: ['StartNet X for government: district founder dashboards', 'அரசுக்கு StartNet X: மாவட்ட நிறுவனர் டாஷ்போர்டுகள்'], // SEO-TA: pending native review
    seoDescription: [
      'District and state founder dashboards, scheme pipelines and programme operations, with tagged data and India residency.',
      'மாவட்ட மற்றும் மாநில நிறுவனர் டாஷ்போர்டுகள், திட்டக் குழாய்கள், திட்டச் செயல்பாடுகள்; குறியிடப்பட்ட தரவுடனும் இந்தியாவுக்குள் சேமிப்புடனும்.',
    ],
    eyebrow: ['Built for government & districts', 'அரசு & மாவட்டங்களுக்காக'],
    title: ['See every founder programme in your district.', 'உங்கள் மாவட்டத்தின் ஒவ்வொரு நிறுவனர் திட்டத்தையும் பாருங்கள்.'],
    lede: [
      'Dashboards, scheme pipelines and programme operations for StartupTN, iTNT and district administrations.',
      'StartupTN, iTNT மற்றும் மாவட்ட நிர்வாகங்களுக்கு டாஷ்போர்டுகள், திட்டக் குழாய்கள், திட்டச் செயல்பாடுகள்.',
    ],
    micro: ['Tagged data, stored in India.', 'குறியிடப்பட்ட தரவு, இந்தியாவில் சேமிப்பு.'],
    art: { variant: 'map', seed: 61 },
    who: ['department or district', 'துறை அல்லது மாவட்டம்'],
    ctaLabel: ['Request a briefing', 'விளக்கக் கூட்டம் கோருங்கள்'],
    needs: [
      ['Measured delivery in every district, not a count of events.', 'நிகழ்வுகளின் எண்ணிக்கை அல்ல; ஒவ்வொரு மாவட்டத்திலும் அளவிடப்பட்ட செயல்பாடு.'],
      ['A pipeline that feeds StartupTN, iTNT and EDII-TN programmes.', 'StartupTN, iTNT, EDII-TN திட்டங்களுக்கு ஊட்டும் ஒரு குழாய்.'],
      ['Data you can publish, with every figure tagged.', 'ஒவ்வொரு எண்ணும் குறியிடப்பட்ட, வெளியிடக்கூடிய தரவு.'],
    ],
    gives: [
      { title: ['Dashboards', 'டாஷ்போர்டுகள்'], body: ['District or state dashboards, by ladder level, brand and district.', 'ஏணி நிலை, பிராண்டு, மாவட்டம் வாரியாக மாவட்ட அல்லது மாநில டாஷ்போர்டுகள்.'] },
      { title: ['Operations', 'செயல்பாடுகள்'], body: ['Scheme pipeline and programme operations, in one place.', 'திட்டக் குழாயும் திட்டச் செயல்பாடுகளும், ஒரே இடத்தில்.'] },
      { title: ['Open data', 'திறந்த தரவு'], body: ['Open-data feeds with A/B/C tags. C-tagged figures are shown separately and never summed with A or B.', 'A/B/C குறிகளுடன் திறந்த தரவு ஊட்டங்கள். C குறி எண்கள் தனியாகக் காட்டப்படும்; A அல்லது B-உடன் ஒருபோதும் கூட்டப்படாது.'] },
    ],
    modules: [
      { id: 'insights', why: ['District and state dashboards, and the public Founder Ledger by district.', 'மாவட்ட, மாநில டாஷ்போர்டுகளும் மாவட்ட வாரியான பொது Founder Ledger-உம்.'] },
      { id: 'launch', why: ['Run scheme applications and track each founder\'s milestones.', 'திட்ட விண்ணப்பங்களை நடத்தி, ஒவ்வொரு நிறுவனரின் மைல்கற்களையும் கண்காணியுங்கள்.'] },
      { id: 'access', why: ['Post government problem statements for founders to solve.', 'நிறுவனர்கள் தீர்க்க அரசுப் பிரச்சினை அறிக்கைகளை வெளியிடுங்கள்.'] },
      { id: 'events', why: ['District events with registration, QR tickets and attendance.', 'பதிவு, QR டிக்கெட், வருகைப் பதிவுடன் மாவட்ட நிகழ்வுகள்.'] },
    ],
    pricing: {
      title: ['An annual licence for your programme.', 'உங்கள் திட்டத்துக்கான ஆண்டு உரிமம்.'],
      stats: [{ value: 25, prefix: '₹', unit: 'L / year', unitTa: 'L / ஆண்டு', label: ['Government / ecosystem licence, from', 'அரசு / சூழலமைப்பு உரிமம், தொடக்க விலை'] }],
      includes: ['District or state dashboards, programme operations, scheme pipelines, open-data feeds.', 'மாவட்ட அல்லது மாநில டாஷ்போர்டுகள், திட்டச் செயல்பாடுகள், திட்டக் குழாய்கள், திறந்த தரவு ஊட்டங்கள்.'],
      notes: [["We respond to tenders and expressions of interest. Send us the reference number and we'll route it to the right team.", 'ஒப்பந்தப்புள்ளிகளுக்கும் விருப்பக் கோரிக்கைகளுக்கும் பதிலளிக்கிறோம். குறிப்பு எண்ணை அனுப்புங்கள்; சரியான குழுவுக்கு அனுப்பி வைப்போம்.']],
      link: { label: ['See organisation pricing', 'நிறுவன விலையைப் பாருங்கள்'], to: '/startnet-x/pricing#organisations' },
    },
    proof: {
      title: ['What to check before you commission.', 'பணி ஒப்படைக்கும் முன் சரிபார்க்க வேண்டியவை.'],
      items: [
        { title: ['The Ledger by district', 'மாவட்ட வாரியான Ledger'], body: ['Founder counts by level, brand and district, with tags and corrections.', 'நிலை, பிராண்டு, மாவட்டம் வாரியான நிறுவனர் எண்ணிக்கை; குறிகளுடனும் திருத்தங்களுடனும்.'], link: { label: ['Read the Founder Ledger', 'Founder Ledger-ஐப் படியுங்கள்'], to: '/insights/founder-ledger' } },
        { title: ['Feeder, not a duplicate', 'ஊட்டுபவர், நகல் அல்ல'], body: ['How StartNet feeds and connects to state programmes.', 'StartNet மாநிலத் திட்டங்களுக்கு எப்படி ஊட்டுகிறது, இணைக்கிறது.'], link: { label: ['District Ecosystem Programme', 'District Ecosystem Programme'], to: '/partner/government' } },
        { title: ['Co-host history', 'இணை நடத்துநர் வரலாறு'], body: ['Events co-hosted with government bodies, credited by name.', 'அரசு அமைப்புகளுடன் இணைந்து நடத்திய நிகழ்வுகள், பெயருடன்.'], placeholder: TO_BE_SUPPLIED },
      ],
    },
    faq: [
      { q: ['Does this duplicate StartupTN?', 'இது StartupTN-ஐ நகலெடுக்கிறதா?'], a: ['No. StartNet is a feeder and connector: measured delivery in every district, feeding StartupTN, iTNT and EDII-TN programmes.', 'இல்லை. StartNet ஓர் ஊட்டுநரும் இணைப்பாளரும்: ஒவ்வொரு மாவட்டத்திலும் அளவிடப்பட்ட செயல்பாடு, StartupTN, iTNT, EDII-TN திட்டங்களுக்கு ஊட்டம்.'] },
      { q: ['Where is the data stored?', 'தரவு எங்கே சேமிக்கப்படுகிறது?'], a: ['In India, encrypted in transit and at rest, under the DPDP Act 2023.', 'இந்தியாவில், DPDP சட்டம் 2023-இன் கீழ், பரிமாற்றத்திலும் சேமிப்பிலும் குறியாக்கத்துடன்.'] },
      { q: ['Can we publish the figures?', 'எண்களை நாங்கள் வெளியிடலாமா?'], a: ['Yes. Open-data feeds carry A/B/C tags, and C-tagged figures are never summed with A or B.', 'ஆம். திறந்த தரவு ஊட்டங்கள் A/B/C குறிகளுடன் வரும்; C குறி எண்கள் A அல்லது B-உடன் ஒருபோதும் கூட்டப்படாது.'] },
    ],
  },

  /* ------------------------------------------------------------------ Investors (P2) */
  investors: {
    id: 'investors',
    enquiryType: 'investor',
    partnerPage: '/partner/investors',
    navLabel: ['For investors', 'முதலீட்டாளர்களுக்கு'],
    menuLabel: ['Investors', 'முதலீட்டாளர்கள்'],
    seoTitle: ['StartNet X for investors: curated deal flow', 'முதலீட்டாளர்களுக்கு StartNet X: முதலீட்டு வாய்ப்புகள்'], // SEO-TA: pending native review
    seoDescription: [
      'Curated deal flow, data rooms, syndicate tools and Ledger analytics, with founders who opted in and evidence that is tagged.',
      'ஒப்புக்கொண்ட நிறுவனர்களுடனும் குறியிடப்பட்ட சான்றுகளுடனும் தேர்ந்த முதலீட்டு வாய்ப்புகள், தரவு அறைகள், கூட்டு முதலீட்டுக் கருவிகள், Ledger பகுப்பாய்வு.',
    ],
    eyebrow: ['Built for investors', 'முதலீட்டாளர்களுக்காக'],
    title: ['Meet founders with the evidence attached.', 'சான்றுகளுடன் வரும் நிறுவனர்களைச் சந்தியுங்கள்.'],
    lede: [
      'First look at founders who have climbed a measured ladder, with tagged evidence. Curated deal flow, data rooms, syndicate tools and Ledger analytics.',
      'அளவிடப்பட்ட ஏணியில் ஏறிய நிறுவனர்களை, குறியிடப்பட்ட சான்றுகளுடன் முதலில் பாருங்கள். தேர்ந்த முதலீட்டு வாய்ப்புகள், தரவு அறைகள், கூட்டு முதலீட்டுக் கருவிகள், Ledger பகுப்பாய்வு.',
    ],
    micro: ['Founders are shown only if they opt in. No investment material on this site.', 'நிறுவனர்கள் ஒப்புக்கொண்டால் மட்டுமே காட்டப்படுவார்கள். இந்தத் தளத்தில் முதலீட்டு ஆவணங்கள் இல்லை.'],
    art: { variant: 'dot', seed: 71 },
    who: ['fund or angel network', 'நிதியம் அல்லது ஏஞ்சல் வலையமைப்பு'],
    ctaLabel: ['Request a demo', 'டெமோ கோருங்கள்'],
    needs: [
      ['A pipeline of founders you can follow quarter by quarter.', 'காலாண்டுதோறும் பின்தொடரக்கூடிய நிறுவனர்களின் தொடர் வரிசை.'],
      ['Numbers that are real: every figure with a source, an as-at date and a tag.', 'உண்மையான எண்கள்: ஒவ்வொரு எண்ணுக்கும் ஆதாரம், தேதி, குறி.'],
      ['A data room that is ready before the first call.', 'முதல் அழைப்புக்கு முன்பே தயாராக இருக்கும் தரவு அறை.'],
    ],
    gives: [
      { title: ['Deal flow', 'முதலீட்டு வாய்ப்புகள்'], body: ['Curated deal flow from founders who opted in to be seen by investors.', 'முதலீட்டாளர்கள் பார்க்க ஒப்புக்கொண்ட நிறுவனர்களிடமிருந்து தேர்ந்த முதலீட்டு வாய்ப்புகள்.'] },
      { title: ['Data rooms', 'தரவு அறைகள்'], body: ['Data rooms and syndicate tools, so diligence starts with documents, not requests.', 'தரவு அறைகளும் கூட்டு முதலீட்டுக் கருவிகளும்; ஆய்வு கோரிக்கைகளுடன் அல்ல, ஆவணங்களுடன் தொடங்கும்.'] },
      { title: ['Ledger analytics', 'Ledger பகுப்பாய்வு'], body: ['Ledger analytics by level, brand and district, with every figure tagged A, B or C.', 'நிலை, பிராண்டு, மாவட்டம் வாரியாக Ledger பகுப்பாய்வு; ஒவ்வொரு எண்ணும் A, B அல்லது C குறியுடன்.'] },
    ],
    modules: [
      { id: 'capital', why: ['Data rooms, investor CRM and syndicate tools.', 'தரவு அறைகள், முதலீட்டாளர் CRM, கூட்டு முதலீட்டுக் கருவிகள்.'] },
      { id: 'insights', why: ['Ledger analytics and the public Founder Ledger.', 'Ledger பகுப்பாய்வும் பொது Founder Ledger-உம்.'] },
      { id: 'launch', why: ['See the programmes and milestones behind each founder\'s ladder level.', 'ஒவ்வொரு நிறுவனரின் ஏணி நிலைக்குப் பின்னால் உள்ள திட்டங்களையும் மைல்கற்களையும் பாருங்கள்.'] },
    ],
    pricing: {
      title: ['An annual licence for deal flow.', 'முதலீட்டு வாய்ப்புகளுக்கான ஆண்டு உரிமம்.'],
      stats: [{ value: 50000, prefix: '₹', unit: ' / year', unitTa: ' / ஆண்டு', label: ['Investor licence, from', 'முதலீட்டாளர் உரிமம், தொடக்க விலை'] }],
      includes: ['Curated deal flow, data rooms, syndicate tools, Ledger analytics.', 'தேர்ந்த முதலீட்டு வாய்ப்புகள், தரவு அறைகள், கூட்டு முதலீட்டுக் கருவிகள், Ledger பகுப்பாய்வு.'],
      notes: [['A software licence, not an investment product. StartNet shares no investment material on this site.', 'இது மென்பொருள் உரிமம், முதலீட்டுப் பொருள் அல்ல. இந்தத் தளத்தில் StartNet எந்த முதலீட்டு ஆவணத்தையும் பகிர்வதில்லை.']],
      link: { label: ['See organisation pricing', 'நிறுவன விலையைப் பாருங்கள்'], to: '/startnet-x/pricing#organisations' },
    },
    proof: {
      title: ['Are the numbers real? Check them.', 'எண்கள் உண்மையானவையா? சரிபாருங்கள்.'],
      items: [
        { title: ['The Founder Ledger', 'Founder Ledger'], body: ['Quarterly counts by level, brand and district. Past editions are frozen.', 'நிலை, பிராண்டு, மாவட்டம் வாரியான காலாண்டு எண்ணிக்கை. முந்தைய பதிப்புகள் மாற்றப்படுவதில்லை.'], link: { label: ['Read the Founder Ledger', 'Founder Ledger-ஐப் படியுங்கள்'], to: '/insights/founder-ledger' } },
        { title: ['Corrections log', 'திருத்தப் பதிவு'], body: ['Public, dated, with severity.', 'பொதுவானது, தேதியுடன், தீவிர நிலையுடன்.'], link: { label: ['See corrections', 'திருத்தங்களைப் பாருங்கள்'], to: '/insights/founder-ledger/corrections' } },
        { title: ['Team and governance', 'குழுவும் ஆளுகையும்'], body: ['Who runs StartNet, and how decisions are made.', 'StartNet-ஐ யார் நடத்துகிறார்கள், முடிவுகள் எப்படி எடுக்கப்படுகின்றன.'], link: { label: ['Leadership', 'தலைமை'], to: '/about/leadership' } },
        { title: ['Related-party disclosure', 'தொடர்புடைய தரப்பு வெளிப்படுத்தல்'], body: ["ThinkTN is a related party of StartNet. Any dealings between the two are at arm's length and disclosed.", 'ThinkTN, StartNet-இன் தொடர்புடைய தரப்பு. இரண்டுக்கும் இடையிலான எந்தப் பரிவர்த்தனையும் சம நிலையில் நடைபெற்று வெளிப்படுத்தப்படுகிறது.'], link: { label: ['ThinkTN alliance', 'ThinkTN கூட்டணி'], to: '/about/thinktn-alliance' }, placeholder: ['[placeholder — link to disclosure statement]', '[இடம்பிடிப்பு — வெளிப்படுத்தல் அறிக்கைக்கான இணைப்பு]'] },
      ],
    },
    faq: [
      { q: ['Are the numbers real?', 'எண்கள் உண்மையானவையா?'], a: ['Every figure carries an A, B or C tag, a source and an as-at date. C-tagged figures are never summed with A or B, and corrections are logged in public.', 'ஒவ்வொரு எண்ணுக்கும் A, B அல்லது C குறி, ஆதாரம், தேதி உண்டு. C குறி எண்கள் A அல்லது B-உடன் ஒருபோதும் கூட்டப்படாது; திருத்தங்கள் பொதுவில் பதிவாகும்.'] },
      { q: ['Is this an investment offer?', 'இது முதலீட்டு அழைப்பா?'], a: ['No. The investor tier is a software licence for deal flow, data rooms and analytics. There is no investment material on this site.', 'இல்லை. முதலீட்டாளர் நிலை என்பது முதலீட்டு வாய்ப்புகள், தரவு அறைகள், பகுப்பாய்வுக்கான மென்பொருள் உரிமம். இந்தத் தளத்தில் முதலீட்டு ஆவணம் எதுவும் இல்லை.'] },
      { q: ["Will I see founders' data without their consent?", 'நிறுவனர்களின் ஒப்புதல் இல்லாமல் அவர்களின் தரவைப் பார்ப்பேனா?'], a: ['No. A profile is shared with an investor only if the founder opts in, and every share is logged.', 'இல்லை. நிறுவனர் ஒப்புக்கொண்டால் மட்டுமே சுயவிவரம் முதலீட்டாளருடன் பகிரப்படும்; ஒவ்வொரு பகிர்வும் பதிவாகும்.'] },
    ],
  },
};

// Organisation pages share the same three-step "how it works".
Object.values(AUDIENCES).forEach((a) => {
  if (a.id !== 'founders') a.steps = ORG_STEPS(a.who, a.ctaLabel || DEFAULT_ORG_CTA);
});
