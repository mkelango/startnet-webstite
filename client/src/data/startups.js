// Community startups shown on /insights/stories ("Companies our founders are building"), in StartNet's order.
// Researched 14 Oct 2026 from each company's own site plus public profiles (LinkedIn, YourStory, YNOS, Tracxn);
// sources and open questions per company: docs/research/startups/README.md. Original logo files:
// docs/research/startups/logos/; web copies (trimmed, ≤640 px): client/public/logos/startups/.
// `ratio` is the logo's width ÷ height, used to size every logo to the same optical weight; `scale` fine-tunes a
// logo whose ink is much heavier or lighter than the rest.
// `tie` is StartNet's part in the company's journey as StartNet reports it (confidence B, Claimed).
// Tamil: drafts pending native review (Book 2 §14).
export const STARTUPS = [
  {
    slug: 'the-divine-foods',
    name: 'The Divine Foods',
    url: 'https://www.thedivinefoods.com/',
    logo: '/logos/startups/the-divine-foods.png',
    ratio: 387 / 320,
    sector: ['Food & wellness, D2C', 'உணவு & நலவாழ்வு, D2C'],
    place: ['Attur, Salem', 'ஆத்தூர், சேலம்'],
    founded: 2019,
    founders: [{ name: 'Kiru Maikkapillai', role: ['Founder', 'நிறுவனர்'] }],
    oneLiner: [
      'Traditional Tamil Nadu superfoods, sold direct to homes in India and abroad.',
      'தமிழ்நாட்டின் பாரம்பரிய சூப்பர்ஃபுட்கள், இந்தியாவிலும் வெளிநாடுகளிலும் உள்ள வீடுகளுக்கு நேரடியாக.',
    ],
    description: [
      'Turns turmeric, palm sugar, honey and moringa from Tamil Nadu farmers into ready-to-use wellness foods, from Paruthi Paal and ABC milk mixes to natural sweeteners and herbal remedies.',
      'தமிழ்நாட்டு விவசாயிகளிடமிருந்து பெறும் மஞ்சள், பனஞ்சர்க்கரை, தேன், முருங்கையை உடனே பயன்படுத்தக்கூடிய நலவாழ்வு உணவுகளாக மாற்றுகிறது: பருத்திப் பால், ABC பால் கலவைகள் முதல் இயற்கை இனிப்பூட்டிகள், மூலிகை மருந்துகள் வரை.',
    ],
    tie: ['StartNet Rising Star · D2C Connect 2024', 'StartNet Rising Star · D2C Connect 2024'],
  },
  {
    slug: 'coir-garden',
    name: 'Coir Garden',
    url: 'https://coirgarden.com/',
    logo: '/logos/startups/coir-garden.png',
    ratio: 640 / 280,
    sector: ['AgriTech, home gardening', 'வேளாண் தொழில்நுட்பம், வீட்டுத் தோட்டம்'],
    place: ['Coimbatore', 'கோயம்புத்தூர்'],
    founded: null,
    founders: [{ name: 'Prabhu Raj', role: ['Founder & CEO', 'நிறுவனர் & தலைமைச் செயல் அதிகாரி'] }],
    oneLiner: [
      'Coconut-coir growing media and organic inputs for home gardeners.',
      'வீட்டுத் தோட்டக்காரர்களுக்குத் தென்னை நார் வளர்ப்பு ஊடகங்களும் இயற்கை இடுபொருட்களும்.',
    ],
    description: [
      'Supplies terrace and home gardeners with coco peat blocks, husk chips, coir baskets, coco pots and poles, plus vermicompost, neem cake and other organic manures, through its own store and marketplaces.',
      'மாடி, வீட்டுத் தோட்டக்காரர்களுக்குக் கோகோ பீட் கட்டிகள், தேங்காய் உமிச் சில்லுகள், நார்க் கூடைகள், நார்த் தொட்டிகள், கம்புகள், மண்புழு உரம், வேப்பம் புண்ணாக்கு போன்ற இயற்கை உரங்களைத் தன் சொந்தக் கடையிலும் சந்தைத் தளங்களிலும் வழங்குகிறது.',
    ],
    tie: ['StartNet community startup', 'StartNet சமூக ஸ்டார்ட்அப்'],
  },
  {
    slug: 'tamirabot',
    name: 'Tamirabot',
    url: 'https://www.tamirabot.com/',
    logo: '/logos/startups/tamirabot.png',
    ratio: 640 / 178,
    sector: ['EV hardware', 'மின்வாகன வன்பொருள்'],
    place: ['Salem', 'சேலம்'],
    founded: 2023,
    founders: [{ name: 'Velayutham S.', role: ['Founder & Director', 'நிறுவனர் & இயக்குநர்'] }],
    oneLiner: [
      'EV charging connectors, designed and made in India.',
      'இந்தியாவிலேயே வடிவமைத்து உருவாக்கப்படும் மின்வாகன சார்ஜிங் இணைப்பிகள்.',
    ],
    description: [
      'Builds Type 2 AC, Type 6 and CCS2 DC charging connectors and vehicle inlets to IEC 62196, so charger makers and EV manufacturers need not import them. Incubated at IIT Madras Research Park.',
      'சார்ஜர் தயாரிப்பாளர்களும் மின்வாகன உற்பத்தியாளர்களும் இறக்குமதி செய்யத் தேவையில்லாமல், IEC 62196 தரத்தில் Type 2 AC, Type 6, CCS2 DC சார்ஜிங் இணைப்பிகளையும் வாகன இன்லெட்டுகளையும் உருவாக்குகிறது. IIT மெட்ராஸ் ஆய்வுப் பூங்காவில் இன்குபேட் செய்யப்பட்டது.',
    ],
    tie: ['In the StartNet network since 2023', '2023 முதல் StartNet வலையமைப்பில்'],
  },
  {
    slug: 'poultrycare',
    name: 'PoultryCare',
    url: 'https://www.poultry.care/',
    logo: '/logos/startups/poultrycare.png',
    ratio: 280 / 95,
    sector: ['AgriTech, SaaS', 'வேளாண் தொழில்நுட்பம், SaaS'],
    place: ['Chennai & Namakkal', 'சென்னை & நாமக்கல்'],
    founded: 2019,
    founders: [{ name: 'Janagaran Varadharaj', role: ['Founder & CEO', 'நிறுவனர் & தலைமைச் செயல் அதிகாரி'] }],
    oneLiner: [
      'Cloud ERP that runs a poultry business end to end.',
      'கோழிப்பண்ணைத் தொழிலை முழுமையாக இயக்கும் கிளவுட் ERP.',
    ],
    description: [
      'A mobile-first platform for breeder, broiler and layer farms, hatcheries, feed mills, processing and trading, with finance and reports in one place. The company says 250+ poultry businesses in 15+ countries use it.',
      'இனப்பெருக்க, இறைச்சிக்கோழி, முட்டைக்கோழிப் பண்ணைகள், குஞ்சு பொரிப்பகங்கள், தீவன ஆலைகள், பதப்படுத்தல், வணிகம் ஆகியவற்றுக்கான மொபைல்-முதல் தளம்; நிதியும் அறிக்கைகளும் ஒரே இடத்தில். 15+ நாடுகளில் 250+ கோழித் தொழில்கள் இதைப் பயன்படுத்துவதாக நிறுவனம் கூறுகிறது.',
    ],
    tie: ['PoultryTech Summit 2024 · SaaS.Connect 2025', 'PoultryTech Summit 2024 · SaaS.Connect 2025'],
  },
  {
    slug: 'yaa-creations',
    name: 'Yaa Creations',
    url: 'https://yaacreations.com/',
    logo: '/logos/startups/yaa-creations.png',
    ratio: 640 / 187,
    sector: ['Software, SaaS', 'மென்பொருள், SaaS'],
    place: ['Rasipuram, Namakkal', 'ராசிபுரம், நாமக்கல்'],
    founded: 2019,
    founders: [{ name: 'Eswaran Arumugam', role: ['CEO & Co-founder', 'தலைமைச் செயல் அதிகாரி & இணை நிறுவனர்'] }],
    oneLiner: [
      'A Rasipuram software studio building custom apps and its own SaaS.',
      'தனிப்பயன் செயலிகளையும் சொந்த SaaS தயாரிப்புகளையும் உருவாக்கும் ராசிபுரம் மென்பொருள் நிறுவனம்.',
    ],
    description: [
      'Builds web, mobile and AI-assisted software for clients in healthcare, finance and retail, and runs its own products: YaaConnect for HR and DocMotez for clinics. It started in 2019 with one person.',
      'சுகாதாரம், நிதி, சில்லறை வணிக வாடிக்கையாளர்களுக்கு இணையம், மொபைல், AI உதவியுடனான மென்பொருளை உருவாக்குகிறது; மனிதவளத்துக்கு YaaConnect, மருத்துவமனைகளுக்கு DocMotez ஆகிய சொந்தத் தயாரிப்புகளையும் நடத்துகிறது. 2019-இல் ஒருவரால் தொடங்கப்பட்டது.',
    ],
    tie: ['SaaS.Connect 2025', 'SaaS.Connect 2025'],
  },
  {
    slug: 'kwic',
    name: 'KWIC',
    url: 'https://www.kwic.in/',
    logo: '/logos/startups/kwic.png',
    ratio: 640 / 225,
    sector: ['SaaS, MarTech', 'SaaS, சந்தைப்படுத்தல் தொழில்நுட்பம்'],
    place: ['Salem', 'சேலம்'],
    founded: null,
    founders: [{ name: 'Abubakkar Siddiq M', role: ['Founder & CEO', 'நிறுவனர் & தலைமைச் செயல் அதிகாரி'] }],
    oneLiner: [
      'WhatsApp Business API for broadcasts, chatbots and support.',
      'ஒளிபரப்புகள், சாட்பாட்கள், வாடிக்கையாளர் ஆதரவுக்கான WhatsApp Business API.',
    ],
    description: [
      'Lets businesses run official WhatsApp broadcasts, no-code chatbots, a shared team inbox and analytics, connected to Shopify, WooCommerce, Google Sheets and more. Built in Salem by Nekhop Technology Services.',
      'அதிகாரப்பூர்வ WhatsApp ஒளிபரப்புகள், கோடிங் இல்லாத சாட்பாட்கள், பகிரப்பட்ட குழு இன்பாக்ஸ், பகுப்பாய்வு ஆகியவற்றை Shopify, WooCommerce, Google Sheets போன்றவற்றுடன் இணைத்து இயக்க வணிகங்களுக்கு உதவுகிறது. Nekhop Technology Services சேலத்தில் உருவாக்கியது.',
    ],
    tie: ['Community success story, SaaS.Connect 2025', 'சமூக வெற்றிக் கதை, SaaS.Connect 2025'],
  },
  {
    slug: 'grahaa-space',
    name: 'Grahaa Space',
    url: 'https://www.grahaa.space/',
    logo: '/logos/startups/grahaa-space.png',
    ratio: 640 / 111,
    sector: ['SpaceTech', 'விண்வெளித் தொழில்நுட்பம்'],
    place: ['Bengaluru', 'பெங்களூரு'],
    founded: 2018,
    founders: [{ name: 'Ramesh Kumar V', role: ['Co-founder & CEO', 'இணை நிறுவனர் & தலைமைச் செயல் அதிகாரி'] }],
    oneLiner: [
      'Nanosatellites that stream near real-time video of Earth.',
      'பூமியின் கிட்டத்தட்ட நேரடி வீடியோவை ஒளிபரப்பும் நுண்செயற்கைக்கோள்கள்.',
    ],
    description: [
      'Building a constellation of small Earth-observation satellites that process data on board and stream live geospatial video instead of still images. Began at PSG STEP, Coimbatore.',
      'தரவைச் செயற்கைக்கோளிலேயே செயலாக்கி, நிலைப் படங்களுக்குப் பதிலாக நேரடிப் புவியியல் வீடியோவை ஒளிபரப்பும் சிறிய புவி கண்காணிப்புச் செயற்கைக்கோள் தொகுப்பை உருவாக்குகிறது. கோயம்புத்தூர் PSG STEP-இல் தொடங்கியது.',
    ],
    tie: ['StartNet Rising Star Award, SpaceTech, 2024', 'StartNet Rising Star விருது, விண்வெளித் தொழில்நுட்பம், 2024'],
  },
  {
    slug: 'dotzza',
    name: 'Dotzza',
    url: 'https://www.dotzza.com/',
    logo: '/logos/startups/dotzza.svg',
    ratio: 104 / 21,
    scale: 0.72, // heavy, solid wordmark: shrink to match the others' weight
    sector: ['HealthTech, EdTech', 'சுகாதார, கல்வித் தொழில்நுட்பம்'],
    place: ['Salem', 'சேலம்'],
    founded: 2022,
    founders: [{ name: 'Dr Chokkalingam Manivasagam', role: ['Founder & CEO, SeeDataMD', 'நிறுவனர் & தலைமைச் செயல் அதிகாரி, SeeDataMD'] }],
    oneLiner: [
      'One workspace for healthcare students, mentors and colleges.',
      'சுகாதாரக் கல்வி மாணவர்கள், வழிகாட்டிகள், கல்லூரிகளுக்கான ஒரே பணியிடம்.',
    ],
    description: [
      'Helps medical and health-science students run dissertations, theses and journal clubs, with ready-made templates, goal tracking, file review and dashboards for colleges. On web, iOS and Android; built by SeeDataMD.',
      'மருத்துவ, சுகாதார அறிவியல் மாணவர்கள் ஆய்வேடுகள், ஆய்வுக் கட்டுரைகள், ஜர்னல் கிளப்புகளை ஆயத்த வார்ப்புருக்கள், இலக்குக் கண்காணிப்பு, கோப்பு மதிப்பாய்வு, கல்லூரிகளுக்கான டாஷ்போர்டுகளுடன் நடத்த உதவுகிறது. இணையம், iOS, Android-இல்; SeeDataMD உருவாக்கியது.',
    ],
    tie: ['StartNet community startup', 'StartNet சமூக ஸ்டார்ட்அப்'],
  },
  {
    slug: 'start-insights',
    name: 'Start Insights',
    url: 'https://startinsights.io/',
    logo: '/logos/startups/start-insights.svg',
    ratio: 225 / 52,
    sector: ['Startup services', 'ஸ்டார்ட்அப் சேவைகள்'],
    place: ['Salem', 'சேலம்'],
    founded: 2021,
    founders: [{ name: 'Premananth S', role: ['Founder & CEO', 'நிறுவனர் & தலைமைச் செயல் அதிகாரி'] }],
    oneLiner: [
      'Pitch decks and fundraising support for early-stage founders.',
      'தொடக்கநிலை நிறுவனர்களுக்கு பிட்ச் டெக்குகளும் நிதி திரட்டல் ஆதரவும்.',
    ],
    description: [
      'Gets founders investor-ready: pitch decks, financial projections and valuations, pitch coaching, a founder cohort and a fundraising course. Based at Sona Incubation Foundation, Salem.',
      'நிறுவனர்களை முதலீட்டாளர்களுக்குத் தயார்படுத்துகிறது: பிட்ச் டெக்குகள், நிதி முன்கணிப்புகள், மதிப்பீடுகள், பிட்ச் பயிற்சி, நிறுவனர் குழு, நிதி திரட்டல் பாடநெறி. சேலம் சோனா இன்குபேஷன் ஃபவுண்டேஷனில் இயங்குகிறது.',
    ],
    tie: ['Pitching partner, SaaS.Connect 2025 · Vibathon 2025', 'பிட்சிங் கூட்டாளர், SaaS.Connect 2025 · Vibathon 2025'],
  },
  {
    slug: 'trueline-research',
    name: 'Trueline Research',
    // truelineresearch.in is a parked domain (21 Oct 2026), so the card links to the LinkedIn page.
    url: 'https://www.linkedin.com/company/trueline-research-private-limited',
    logo: '/logos/startups/trueline-research.png',
    ratio: 632 / 121,
    scale: 1.2, // thin wordmark beside a tall mark: enlarge to match the others' weight
    sector: ['AI research & development', 'AI ஆய்வு & மேம்பாடு'],
    place: ['Salem', 'சேலம்'],
    founded: 2023,
    founders: [], // not named publicly; ask StartNet
    oneLiner: [
      'AI-driven research, product development and IPR support from Salem.',
      'சேலத்திலிருந்து AI சார்ந்த ஆய்வு, தயாரிப்பு மேம்பாடு, அறிவுசார் சொத்துரிமை ஆதரவு.',
    ],
    description: [
      'Builds AI products and runs research and development for institutions and startups, with IPR and patent consulting, international research collaboration, training, internships and certification courses.',
      'நிறுவனங்களுக்கும் ஸ்டார்ட்அப்களுக்கும் AI தயாரிப்புகளை உருவாக்கி ஆய்வு, மேம்பாட்டுப் பணிகளை நடத்துகிறது; அறிவுசார் சொத்துரிமை, காப்புரிமை ஆலோசனை, பன்னாட்டு ஆய்வுக் கூட்டுழைப்பு, பயிற்சி, இன்டர்ன்ஷிப், சான்றிதழ் படிப்புகளையும் வழங்குகிறது.',
    ],
    tie: ['StartNet community startup', 'StartNet சமூக ஸ்டார்ட்அப்'],
  },
];

/** Logo width as a % of its tile, so wide wordmarks and stacked marks carry the same visual weight. */
export const logoWidth = (ratio, scale = 1) => Math.min(66, Math.max(20, 27 * Math.sqrt(ratio || 1) * scale));

/** "www.thedivinefoods.com/" → "thedivinefoods.com" */
export const domainOf = (url) => String(url || '').replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '');
