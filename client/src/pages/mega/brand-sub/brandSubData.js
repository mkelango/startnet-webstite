// Content for the brand sub-pages built in this folder (mega-menu group "brand-sub").
// Every user-visible string is a pair [English, Tamil]; pages render it with t(en, ta).
// Sources: Book 2 §3.1.1 (Labs), §3.4 (Women, Summit & Awards), §5.1 (Events hub copy), §14 (Tamil CTAs);
// Book 1 Part B §2.2 (page inventory: T03 Lab ×4, T15 brand stories/events, T04 Summit & Awards), §10 (facets).
// Brand-view intro lines are written for these pages (Book 1 §7.4: brand filtered views carry unique intro copy);
// they make no factual claims beyond the books.

export const PH = '[placeholder — to be supplied by StartNet]';
export const BRAND_KEYS = ['research', 'vibe', 'connect', 'women'];

/* ------------------------------------------------------------------ Labs (Book 2 §3.1.1) */

export const LAB_STATUS = ['Launching 2027', '2027-இல் தொடக்கம்'];

export const LABS = [
  {
    slug: 'agentic-ai',
    name: 'Agentic AI Lab',
    // SEO: "<lab>: research to startup" (Book 1 §9.2 Research theme). SEO-TA: pending native review
    seo: 'Agentic AI Lab: research to startup',
    seoTa: 'Agentic AI Lab: ஆய்விலிருந்து நிறுவனம்',
    meta: 'Enterprise agents, evaluation, safety and Indic-language agents. Work on GCC problem statements and form companies on standard terms.',
    metaTa: "நிறுவன AI முகவர்கள், மதிப்பீடு, பாதுகாப்பு, இந்திய மொழி முகவர்கள். GCC சிக்கல் அறிக்கைகளில் பணியாற்றி, நிலையான விதிமுறைகளில் நிறுவனங்களைத் தொடங்குங்கள்.",
    sub: [
      'Enterprise agents that work in production: evaluation, safety and Tamil- and Indic-language agents, built against real GCC problems.',
      'உண்மையான பயன்பாட்டில் இயங்கும் நிறுவன AI முகவர்கள்: மதிப்பீடு, பாதுகாப்பு, தமிழ் மற்றும் இந்திய மொழி முகவர்கள், உண்மையான GCC பிரச்சினைகளை முன்வைத்து உருவாக்கப்படுபவை.',
    ],
    focus: [
      ['Enterprise agents that work in production', 'உண்மையான பயன்பாட்டில் இயங்கும் நிறுவன முகவர்கள்'],
      ['Evaluation and safety of agents', 'முகவர்களின் மதிப்பீடும் பாதுகாப்பும்'],
      ['Tamil- and Indic-language agents', 'தமிழ் மற்றும் இந்திய மொழி முகவர்கள்'],
    ],
    art: { variant: 'network', seed: 11 },
  },
  {
    slug: 'ontology-knowledge',
    name: 'Ontology & Knowledge Lab',
    // SEO: "<lab>: research to startup" (Book 1 §9.2 Research theme). SEO-TA: pending native review
    seo: 'Ontology & Knowledge Lab: research to startup',
    seoTa: 'Ontology & Knowledge Lab: ஆய்விலிருந்து நிறுவனம்',
    meta: 'Knowledge graphs and domain ontologies for health, legal, manufacturing and government data, built with industry problem owners.',
    metaTa: "சுகாதாரம், சட்டம், உற்பத்தி, அரசுத் தரவுகளுக்கான அறிவு வரைபடங்களும் துறை ஆன்டாலஜிகளும், தொழில்துறைச் சிக்கல் உரிமையாளர்களுடன் உருவாக்கப்படுபவை.",
    sub: [
      'Knowledge graphs and domain models that make health, legal, manufacturing and government data usable.',
      'சுகாதாரம், சட்டம், உற்பத்தி, அரசுத் தரவுகளைப் பயன்படுத்தக்கூடியதாக்கும் அறிவு வரைபடங்களும் துறை மாதிரிகளும்.',
    ],
    focus: [
      ['Knowledge graphs and domain models for health data', 'சுகாதாரத் தரவுக்கான அறிவு வரைபடங்களும் துறை மாதிரிகளும்'],
      ['Knowledge graphs and domain models for legal data', 'சட்டத் தரவுக்கான அறிவு வரைபடங்களும் துறை மாதிரிகளும்'],
      ['Knowledge graphs and domain models for manufacturing data', 'உற்பத்தித் தரவுக்கான அறிவு வரைபடங்களும் துறை மாதிரிகளும்'],
      ['Knowledge graphs and domain models for government data', 'அரசுத் தரவுக்கான அறிவு வரைபடங்களும் துறை மாதிரிகளும்'],
    ],
    art: { variant: 'kolam', seed: 23 },
  },
  {
    slug: 'physical-ai',
    name: 'Physical AI Lab',
    // SEO: "<lab>: research to startup" (Book 1 §9.2 Research theme). SEO-TA: pending native review
    seo: 'Physical AI Lab: research to startup',
    seoTa: 'Physical AI Lab: ஆய்விலிருந்து நிறுவனம்',
    meta: "Robotics, autonomy, vision and edge AI research for Tamil Nadu's automotive and electronics manufacturers, for PhD scholars and faculty. Launches 2027.",
    metaTa: "தமிழ்நாட்டின் வாகன, மின்னணு உற்பத்தியாளர்களுக்கான ரோபாட்டிக்ஸ், தன்னியக்கம், கணினிப் பார்வை, எட்ஜ் AI. 2027-இல் தொடக்கம்.",
    sub: [
      "Robots, autonomy, vision and edge AI, tested with the manufacturers in Tamil Nadu's automotive and electronics base.",
      'ரோபோக்கள், தன்னியக்கம், கணினிப் பார்வை, எட்ஜ் AI: தமிழ்நாட்டின் வாகன, மின்னணு உற்பத்தியாளர்களுடன் சோதிக்கப்படுபவை.',
    ],
    focus: [
      ['Robots and autonomy for automotive and electronics manufacturers', 'வாகன, மின்னணு உற்பத்தியாளர்களுக்கான ரோபோக்களும் தன்னியக்கமும்'],
      ['Vision and edge AI for automotive and electronics manufacturers', 'வாகன, மின்னணு உற்பத்தியாளர்களுக்கான கணினிப் பார்வையும் எட்ஜ் AI-யும்'],
    ],
    art: { variant: 'grid', seed: 37 },
  },
  {
    slug: 'drug-discovery',
    name: 'Drug Discovery Lab',
    // SEO: "<lab>: research to startup" (Book 1 §9.2 Research theme). SEO-TA: pending native review
    seo: 'Drug Discovery Lab: research to startup',
    seoTa: 'Drug Discovery Lab: ஆய்விலிருந்து நிறுவனம்',
    meta: 'AI-assisted molecule design and biologics with bio-incubators and pharma partners: a long-cycle, computation-first lab for PhD scholars and faculty.',
    metaTa: "உயிரி-இன்குபேட்டர்கள், மருந்து நிறுவனக் கூட்டாளர்களுடன் AI உதவியுடன் மூலக்கூறு வடிவமைப்பும் உயிரியல் மருந்துகளும்; கணினி முதன்மை ஆய்வகம்.",
    sub: [
      'AI-assisted molecule design and biologics. Long timelines, computation first, with bio-incubators and pharma partners.',
      'AI உதவியுடன் மூலக்கூறு வடிவமைப்பும் உயிரியல் மருந்துகளும். நீண்ட காலம், கணினி முதலில், உயிரி-இன்குபேட்டர்கள் மற்றும் மருந்து நிறுவனக் கூட்டாளர்களுடன்.',
    ],
    focus: [
      ['AI-assisted molecule design', 'AI உதவியுடன் மூலக்கூறு வடிவமைப்பு'],
      ['Biologics, computation first', 'உயிரியல் மருந்துகள், கணினி முதலில்'],
    ],
    art: { variant: 'dot', seed: 41 },
  },
];

export const LAB_SLUGS = LABS.map((l) => l.slug);

/** Lab charter rows (Book 2: Status line of the individual Lab template). Values are placeholders until confirmed. */
export const LAB_CHARTER = [
  { id: 'host', label: ['Host institution', 'தலைமை நிறுவனம்'], note: ['The anchor institution that houses the Lab', 'ஆய்வகத்தை நடத்தும் மைய நிறுவனம்'] },
  { id: 'spokes', label: ['Spoke institutions', 'இணை நிறுவனங்கள்'], note: ['Three to five partner institutions', 'மூன்று முதல் ஐந்து கூட்டாளர் நிறுவனங்கள்'] },
  { id: 'sponsors', label: ['Industry sponsors', 'தொழில்துறை ஆதரவாளர்கள்'], note: ['One or two industry, GCC or government sponsors', 'ஒன்று அல்லது இரண்டு தொழில்துறை, GCC அல்லது அரசு ஆதரவாளர்கள்'] },
  { id: 'director', label: ['Lab Director', 'ஆய்வக இயக்குநர்'], note: ['A faculty member', 'ஒரு பேராசிரியர்'] },
  { id: 'venture', label: ['StartNet venture lead', 'StartNet முயற்சித் தலைவர்'], note: ['Runs venture building with the teams', 'குழுக்களுடன் நிறுவன உருவாக்கத்தை நடத்துபவர்'] },
];

export const LAB_WHO = [
  "PhD scholars, post-docs and faculty in the field; final-year master's students by invitation",
  'இத்துறையில் உள்ள PhD ஆய்வாளர்கள், முதுமுனைவர் ஆய்வாளர்கள், பேராசிரியர்கள்; இறுதியாண்டு முதுநிலை மாணவர்கள் அழைப்பின் பேரில்',
];

export const LAB_GET = [
  ['A place in the Scholar Founders Fellowship', 'Scholar Founders Fellowship-இல் ஓர் இடம்'],
  ['Mentors from industry', 'தொழில்துறை வழிகாட்டிகள்'],
  ['A funded proof of concept, if selected', 'தேர்வானால், நிதியுதவியுடன் ஒரு proof of concept'],
  ['Help with grants', 'மானியங்களுக்கு விண்ணப்பிக்க உதவி'],
  ['Standard terms if you form a company', 'நிறுவனம் தொடங்கினால் நிலையான விதிமுறைகள்'],
];

/** What every Lab commits to each year [C, targets] — same figures as /api/metrics group labs-commitments. */
export const LAB_COMMITMENTS = [
  { id: 'lab-problem-statements-target', value: 10, label: ['problem statements (at least), each co-signed by an industry, GCC or government sponsor', 'சிக்கல் அறிக்கைகள் (குறைந்தது), ஒவ்வொன்றும் தொழில்துறை, GCC அல்லது அரசு ஆதரவாளரால் இணைக் கையொப்பமிடப்பட்டவை'] },
  { id: 'lab-fellows-target', value: 20, label: ['Scholar Founders Fellows through the 7-week sprint', '7 வார ஸ்பிரின்ட் வழியாக Scholar Founders Fellows'] },
  { id: 'lab-poc-teams-target', value: 6, label: ['teams with a funded proof of concept', 'நிதியுதவி பெற்ற proof of concept கொண்ட குழுக்கள்'] },
  { id: 'lab-companies-target', value: '2–3', label: ['companies formed on standard terms', 'நிலையான விதிமுறைகளில் உருவாகும் நிறுவனங்கள்'] },
];
export const LAB_COMMIT_SOURCE = 'StartNet Labs charter (targets)';

export const LAB_STOPPING_RULE = [
  'No company formed in 24 months means the Lab closes or pivots, and we publish the decision.',
  '24 மாதங்களில் ஒரு நிறுவனமும் உருவாகவில்லை என்றால், ஆய்வகம் மூடப்படும் அல்லது திசை மாறும்; அந்த முடிவை நாங்கள் வெளியிடுவோம்.',
];

export const LABS_WAVE2 = [
  ['Climate & EV Materials', 'காலநிலை & EV பொருட்கள்'],
  ['MedTech', 'MedTech'],
  ['Agri & Food', 'வேளாண்மை & உணவு'],
  ['Semiconductor Design', 'குறைக்கடத்தி வடிவமைப்பு'],
];
export const LABS_WAVE2_NOTE = [
  'Proposed. Not yet committed. Tell us if your institution wants to host one.',
  'முன்மொழியப்பட்டவை. இன்னும் உறுதியாகவில்லை. உங்கள் நிறுவனம் ஒன்றை நடத்த விரும்பினால் எங்களுக்குத் தெரிவியுங்கள்.',
];

/* ------------------------------------------------------------------ Brand stories / events (T15 filtered views) */

export const BRAND_NAME_TA = {
  research: 'StartNet Research',
  vibe: 'StartNet Vibe',
  connect: 'StartNet Connect',
  women: 'StartNet Women',
};

export const BRAND_STORIES = {
  research: {
    // SEO-TA: pending native review
    seo: 'Research spinout stories: lab to first customer',
    seoTa: 'ஆய்விலிருந்து நிறுவனம்: ஆய்வாளர் கதைகள்',
    meta: 'Stories from scholars and faculty taking research towards customers and companies, with tagged outcomes and written consent.',
    metaTa: "ஆய்வை வாடிக்கையாளர்களையும் நிறுவனங்களையும் நோக்கி எடுத்துச் செல்லும் ஆய்வாளர்கள், பேராசிரியர்களின் கதைகள், எழுத்துப்பூர்வ ஒப்புதலுடன்.",
    title: ['From the lab bench to a first customer.', 'ஆய்வக மேசையிலிருந்து முதல் வாடிக்கையாளர் வரை.'],
    lede: [
      'Stories from scholars and faculty who pointed their research at a customer. Every outcome carries a source or a confidence tag, and every story is published with the founder’s written consent.',
      'தங்கள் ஆய்வை ஒரு வாடிக்கையாளரை நோக்கித் திருப்பிய ஆய்வாளர்கள், பேராசிரியர்களின் கதைகள். ஒவ்வொரு விளைவுக்கும் ஆதாரம் அல்லது நம்பக அடையாளம் உண்டு; ஒவ்வொரு கதையும் நிறுவனரின் எழுத்துப்பூர்வ ஒப்புதலுடன் மட்டுமே வெளியிடப்படும்.',
    ],
    next: { label: ['Apply to the Fellowship', 'Fellowship-க்கு விண்ணப்பியுங்கள்'], to: '/research/fellowship' },
  },
  vibe: {
    // SEO-TA: pending native review
    seo: 'Student startup stories from Vibathon · StartNet Vibe',
    seoTa: 'Vibathon மாணவர் ஸ்டார்ட்அப் கதைகள் · StartNet Vibe',
    meta: 'Stories and recaps from Vibathon, Vibe Campus and Vibe Launchpad student teams in Tamil Nadu, with tagged outcomes and written consent.',
    metaTa: "Vibathon, Vibe Campus, Vibe Launchpad குழுக்களின் கதைகளும் சுருக்கங்களும்: அடையாளமிட்ட விளைவுகளுடனும் எழுத்துப்பூர்வ ஒப்புதலுடனும்.",
    title: ['Students who shipped something.', 'எதையாவது உருவாக்கி வெளியிட்ட மாணவர்கள்.'],
    lede: [
      'Stories and recaps from Vibathon, Vibe Campus and Vibe Launchpad. Every outcome carries a source or a confidence tag, and every story is published with the founder’s written consent.',
      'Vibathon, Vibe Campus, Vibe Launchpad ஆகியவற்றின் கதைகளும் சுருக்கங்களும். ஒவ்வொரு விளைவுக்கும் ஆதாரம் அல்லது நம்பக அடையாளம் உண்டு; ஒவ்வொரு கதையும் நிறுவனரின் எழுத்துப்பூர்வ ஒப்புதலுடன் மட்டுமே வெளியிடப்படும்.',
    ],
    next: { label: ['Register for Vibathon 2027', 'Vibathon 2027-க்குப் பதிவு செய்யுங்கள்'], to: '/vibe/vibathon' },
  },
  connect: {
    // SEO-TA: pending native review
    seo: 'Professional-to-founder stories · StartNet Connect',
    seoTa: 'பணியிலிருந்து நிறுவனர்: கதைகள் · StartNet Connect',
    meta: 'Stories from working professionals in sector Connects, Connect Circles and Founder Switch, with tagged outcomes and written consent.',
    metaTa: "துறை Connect-கள், Connect Circles, Founder Switch ஆகியவற்றின் கதைகள்: அடையாளமிட்ட விளைவுகளுடனும் எழுத்துப்பூர்வ ஒப்புதலுடனும்.",
    title: ['Professionals who made the switch.', 'நிறுவனராக மாறிய தொழில்முறையாளர்கள்.'],
    lede: [
      'Stories from sector Connects, Connect Circles and Founder Switch: people who started, switched or scaled. Every outcome carries a source or a confidence tag, and every story is published with the founder’s written consent.',
      'துறை Connect-கள், Connect Circles, Founder Switch ஆகியவற்றிலிருந்து: தொடங்கியவர்கள், மாறியவர்கள், வளர்ந்தவர்களின் கதைகள். ஒவ்வொரு விளைவுக்கும் ஆதாரம் அல்லது நம்பக அடையாளம் உண்டு; ஒவ்வொரு கதையும் நிறுவனரின் எழுத்துப்பூர்வ ஒப்புதலுடன் மட்டுமே வெளியிடப்படும்.',
    ],
    next: { label: ['Find your sector Connect', 'உங்கள் துறை Connect-ஐக் கண்டறியுங்கள்'], to: '/connect/series' },
  },
  women: {
    // SEO-TA: pending native review
    seo: 'Women entrepreneur stories, Tamil Nadu · StartNet Women',
    seoTa: 'பெண் தொழில்முனைவோர் கதைகள் · StartNet Women',
    meta: 'Stories from Women Circles, Rise Academy and HerCapital founders across Tamil Nadu, with tagged outcomes and written consent.',
    metaTa: "தமிழ்நாடு முழுவதும் Women Circles, Rise Academy, HerCapital நிறுவனர்களின் கதைகள்: அடையாளமிட்ட விளைவுகளுடனும் எழுத்துப்பூர்வ ஒப்புதலுடனும்.",
    title: ['Women founders, in their own words.', 'பெண் நிறுவனர்கள், அவர்களின் சொந்த வார்த்தைகளில்.'],
    lede: [
      'Stories from Women Circles, Rise Academy and HerCapital founders across Tamil Nadu. Every outcome carries a source or a confidence tag, and every story is published with the founder’s written consent.',
      'தமிழ்நாடு முழுவதும் Women Circles, Rise Academy, HerCapital நிறுவனர்களின் கதைகள். ஒவ்வொரு விளைவுக்கும் ஆதாரம் அல்லது நம்பக அடையாளம் உண்டு; ஒவ்வொரு கதையும் நிறுவனரின் எழுத்துப்பூர்வ ஒப்புதலுடன் மட்டுமே வெளியிடப்படும்.',
    ],
    next: { label: ['Join a Women Circle', 'ஒரு Women Circle-இல் இணையுங்கள்'], to: '/women/circles' },
  },
};

export const BRAND_EVENTS = {
  research: {
    // SEO-TA: pending native review
    seo: 'Research events for scholars and faculty',
    seoTa: 'ஆய்வாளர்கள், பேராசிரியர்களுக்கான நிகழ்வுகள்',
    meta: 'Lab-to-Market Summit and Research Days for PhD scholars, faculty, GCCs and investors in Tamil Nadu: where lab teams meet their first customers.',
    metaTa: "தமிழ்நாட்டு ஆய்வாளர்கள், பேராசிரியர்கள், GCC-கள், முதலீட்டாளர்களுக்கான Lab-to-Market Summit, Research Days: ஆய்வு முதல் வாடிக்கையாளரைச் சந்திக்கும் இடம்.",
    title: ['Where research meets its first customer.', 'ஆய்வு தன் முதல் வாடிக்கையாளரைச் சந்திக்கும் இடம்.'],
    lede: [
      'The Lab-to-Market Summit and Research Days, where lab teams meet GCCs, investors and government.',
      'Lab-to-Market Summit மற்றும் Research Days: ஆய்வகக் குழுக்கள் GCC-கள், முதலீட்டாளர்கள், அரசுடன் சந்திக்கும் இடங்கள்.',
    ],
    series: [
      { label: ['Lab-to-Market Summit', 'Lab-to-Market Summit'], body: ['The annual day where lab teams demo to GCCs, investors and government.', 'ஆய்வகக் குழுக்கள் GCC-கள், முதலீட்டாளர்கள், அரசு முன் செயல்விளக்கம் தரும் ஆண்டு நாள்.'], to: '/research/lab-to-market-summit' },
      { label: ['StartNet Labs', 'StartNet Labs'], body: ['Four problem-first Labs, launching 2027.', 'சிக்கலை முதன்மையாகக் கொண்ட நான்கு ஆய்வகங்கள், 2027-இல் தொடக்கம்.'], to: '/research/labs' },
    ],
  },
  vibe: {
    // SEO-TA: pending native review
    seo: 'Hackathons and build nights for students · StartNet Vibe',
    seoTa: 'கல்லூரி மாணவர்களுக்கான ஹேக்கத்தான்கள் · StartNet Vibe',
    meta: 'Vibe Campus build nights, Vibathon district qualifiers and the Vibe Summit across Tamil Nadu colleges. Most first events are free.',
    metaTa: "தமிழ்நாட்டுக் கல்லூரிகளில் Vibe Campus உருவாக்க இரவுகள், Vibathon மாவட்டத் தகுதிச் சுற்றுகள், Vibe Summit. பெரும்பாலான முதல் நிகழ்வுகள் இலவசம்.",
    title: ['Build nights, qualifiers and a state finale.', 'உருவாக்க இரவுகள், தகுதிச் சுற்றுகள், ஒரு மாநில இறுதிப் போட்டி.'],
    lede: [
      'Vibe Campus build nights, Vibathon district qualifiers and the Vibe Summit, in colleges across Tamil Nadu. Most first events are free.',
      'தமிழ்நாடு முழுவதும் கல்லூரிகளில் Vibe Campus உருவாக்க இரவுகள், Vibathon மாவட்டத் தகுதிச் சுற்றுகள், Vibe Summit. பெரும்பாலான முதல் நிகழ்வுகள் இலவசம்.',
    ],
    series: [
      { label: ['Vibathon', 'Vibathon'], body: ['From your district to the state finale. A StartNet Vibe programme.', 'உங்கள் மாவட்டத்திலிருந்து மாநில இறுதிப் போட்டி வரை. ஒரு StartNet Vibe திட்டம்.'], to: '/vibe/vibathon' },
      { label: ['Vibe Campus', 'Vibe Campus'], body: ['Build nights at host colleges.', 'நடத்தும் கல்லூரிகளில் உருவாக்க இரவுகள்.'], to: '/vibe/campus' },
      { label: ['Vibe Summit', 'Vibe Summit'], body: ['The state finale.', 'மாநில இறுதி நிகழ்வு.'], to: '/vibe/summit' },
    ],
  },
  connect: {
    // SEO-TA: pending native review
    seo: 'Startup events for professionals · StartNet Connect',
    seoTa: 'பணியாளர்களுக்கான ஸ்டார்ட்அப் நிகழ்வுகள் · StartNet Connect',
    meta: 'GenAI, SaaS and D2C Connects and the sector series that follow: startup events for working professionals and founders across Tamil Nadu.',
    metaTa: "தமிழ்நாடு முழுவதும் தொழில்முறையாளர்களுக்கும் நிறுவனர்களுக்குமான GenAI, SaaS, D2C Connect-களும் தொடரும் துறைத் தொடர்களும்.",
    title: ['Your sector, in one room.', 'உங்கள் துறை, ஒரே அறையில்.'],
    lede: [
      'GenAI, SaaS and D2C Connects and the sector series that follow, for professionals and founders who want to start, switch or scale.',
      'GenAI, SaaS, D2C Connect-களும் தொடரும் துறைத் தொடர்களும்: தொடங்க, மாற, அல்லது வளர விரும்பும் தொழில்முறையாளர்களுக்கும் நிறுவனர்களுக்கும்.',
    ],
    series: [
      { label: ['GenAI Connect', 'GenAI Connect'], body: ['The GenAI sector community and its editions.', 'GenAI துறைச் சமூகமும் அதன் பதிப்புகளும்.'], to: '/connect/genai' },
      { label: ['SaaS Connect', 'SaaS Connect'], body: ['The SaaS sector community and its editions.', 'SaaS துறைச் சமூகமும் அதன் பதிப்புகளும்.'], to: '/connect/saas' },
      { label: ['D2C Connect', 'D2C Connect'], body: ['The D2C sector community and its editions.', 'D2C துறைச் சமூகமும் அதன் பதிப்புகளும்.'], to: '/connect/d2c' },
      { label: ['All sector Connects', 'அனைத்துத் துறை Connect-கள்'], body: ['Every sector series and its next date.', 'ஒவ்வொரு துறைத் தொடரும் அதன் அடுத்த தேதியும்.'], to: '/connect/series' },
    ],
  },
  women: {
    // SEO-TA: pending native review
    seo: 'Events for women entrepreneurs · StartNet Women',
    seoTa: 'பெண் தொழில்முனைவோருக்கான நிகழ்வுகள் · StartNet Women',
    meta: 'The Women Founders Summit & Awards and StartNet Women sessions, in daytime and weekend formats, Tamil-first in the districts.',
    metaTa: "Women Founders Summit & Awards மற்றும் StartNet Women அமர்வுகள்: பகல் நேர, வார இறுதி வடிவங்களில், மாவட்டங்களில் தமிழ் முதன்மையுடன்.",
    title: ['Days built around real lives.', 'உண்மையான வாழ்க்கைக்கு ஏற்ற நாட்கள்.'],
    lede: [
      'The Women Founders Summit & Awards and StartNet Women sessions, with daytime and weekend formats and Tamil-first content in the districts.',
      'Women Founders Summit & Awards மற்றும் StartNet Women அமர்வுகள்: பகல் நேர, வார இறுதி வடிவங்களில், மாவட்டங்களில் தமிழ் முதன்மை உள்ளடக்கத்துடன்.',
    ],
    series: [
      { label: ['Women Founders Summit', 'Women Founders Summit'], body: ['The annual StartNet Women flagship.', 'StartNet Women-இன் ஆண்டு முதன்மை நிகழ்வு.'], to: '/women/summit' },
      { label: ['Women Founders Awards', 'Women Founders Awards'], body: ['Decided by an independent jury. Nominate a founder.', 'சுயாதீன நடுவர் குழு முடிவு செய்யும். ஒரு நிறுவனரைப் பரிந்துரையுங்கள்.'], to: '/women/summit/awards' },
      { label: ['Women Circles', 'Women Circles'], body: ['Monthly district chapters of 20–30 founders.', 'மாவட்டந்தோறும் 20–30 நிறுவனர்களின் மாதாந்திரக் குழுக்கள்.'], to: '/women/circles' },
    ],
  },
};

/** Facet labels (Book 1 Part B §10). */
export const STORY_TYPES = [
  { value: 'founder', label: ['Founder stories', 'நிறுவனர் கதைகள்'] },
  { value: 'partner', label: ['Partner stories', 'கூட்டாளர் கதைகள்'] },
  { value: 'recap', label: ['Event recaps', 'நிகழ்வுச் சுருக்கங்கள்'] },
];
export const EVENT_FORMATS = [
  { value: 'in-person', label: ['In person', 'நேரில்'] },
  { value: 'online', label: ['Online', 'இணையவழி'] },
  { value: 'hybrid', label: ['Hybrid', 'கலப்பு'] },
];
export const EVENT_LANGS = [
  { value: 'en', label: ['English', 'ஆங்கிலம்'] },
  { value: 'ta', label: ['Tamil', 'தமிழ்'] },
  { value: 'bilingual', label: ['Tamil & English', 'தமிழ் & ஆங்கிலம்'] },
];
export const EVENT_PRICES = [
  { value: 'free', label: ['Free', 'இலவசம்'] },
  { value: 'paid', label: ['Paid', 'கட்டணம்'] },
];

/* ------------------------------------------------------------------ Women Founders Awards (Book 2 §3.4) */

/**
 * Categories are not set in the books. Book 2 §3.4 names three groups StartNet Women serves; the page shows
 * them as PROPOSED categories, marked as such, until StartNet and the jury confirm the final list.
 */
export const AWARD_CATEGORIES = [
  {
    value: 'professional',
    label: ['Professional women', 'தொழில்முறைப் பெண்கள்'],
    body: ['Including women returning after a career break, now building a company.', 'பணி இடைவேளைக்குப் பின் திரும்பும் பெண்கள் உட்பட, இப்போது நிறுவனம் உருவாக்குபவர்கள்.'],
  },
  {
    value: 'business-owner',
    label: ['Business owners', 'தொழில் உரிமையாளர்கள்'],
    body: ['Home-based, MSME and self-help-group enterprises growing into product or service companies.', 'வீட்டிலிருந்து நடத்தும், MSME, சுய உதவிக் குழு நிறுவனங்கள், தயாரிப்பு அல்லது சேவை நிறுவனங்களாக வளர்பவை.'],
  },
  {
    value: 'researcher-student',
    label: ['Researchers and students', 'ஆய்வாளர்களும் மாணவிகளும்'],
    body: ['Women founders from StartNet Research and Vibe programmes.', 'StartNet Research, Vibe திட்டங்களிலிருந்து வரும் பெண் நிறுவனர்கள்.'],
  },
];

export const AWARD_CRITERIA = [
  {
    title: ['Women-led, and we say how we count', 'பெண்கள் தலைமையிலானது, எப்படிக் கணக்கிடுகிறோம் என்பதையும் சொல்கிறோம்'],
    body: [
      'DPIIT counts a startup as women-led if it has at least one woman director. We also record "women-owned": 51%+ of equity held by women.',
      'குறைந்தது ஒரு பெண் இயக்குநர் இருந்தால் DPIIT அதைப் பெண்கள் தலைமையிலான ஸ்டார்ட்அப் எனக் கணக்கிடுகிறது. நாங்கள் "பெண்களுக்குச் சொந்தமானது" என்பதையும் பதிவு செய்கிறோம்: 51%-க்கு மேற்பட்ட பங்குகள் பெண்களிடம்.',
    ],
  },
  {
    title: ['Building in Tamil Nadu', 'தமிழ்நாட்டில் உருவாக்குபவர்'],
    body: ['A product or service company built by a founder in Tamil Nadu.', 'தமிழ்நாட்டில் ஒரு நிறுவனர் உருவாக்கிய தயாரிப்பு அல்லது சேவை நிறுவனம்.'],
  },
  {
    title: ['Outcomes you can point to', 'சுட்டிக்காட்டக்கூடிய விளைவுகள்'],
    body: [
      'Customers, revenue, jobs or capital, each with a source or a confidence tag under our evidence standard.',
      'வாடிக்கையாளர்கள், வருவாய், வேலைகள் அல்லது முதலீடு: ஒவ்வொன்றும் எங்கள் சான்றுத் தரத்தின்படி ஆதாரம் அல்லது நம்பக அடையாளத்துடன்.',
    ],
  },
  {
    title: ['Market access, then capital', 'முதலில் சந்தை, பிறகு முதலீடு'],
    body: [
      'Revenue makes founders investable, so the jury looks at buyers and markets won, not only money raised.',
      'வருவாயே நிறுவனர்களை முதலீட்டுக்குத் தகுதியாக்குகிறது; அதனால் திரட்டிய பணத்தை மட்டுமல்ல, வென்ற வாங்குநர்களையும் சந்தைகளையும் நடுவர் குழு பார்க்கும்.',
    ],
  },
];

export const AWARD_TIMELINE = [
  { id: 'open', title: ['Nominations open', 'பரிந்துரைகள் தொடக்கம்'] },
  { id: 'close', title: ['Nominations close', 'பரிந்துரைகள் நிறைவு'] },
  { id: 'jury', title: ['Independent jury review', 'சுயாதீன நடுவர் குழு மதிப்பாய்வு'] },
  { id: 'finalists', title: ['Finalists told', 'இறுதிப் பட்டியலாளர்களுக்குத் தகவல்'] },
  { id: 'summit', title: ['Awards at the Women Founders Summit', 'Women Founders Summit-இல் விருதுகள்'] },
];
