// Global navigation data: 7 mega menus (Book 1 Part B §3.2, intro lines from Book 2 §0.4),
// utility nav (§3.3), footer rows (§3.8), search quick links (§3.6).
// Tamil: primary/utility labels and CTAs from Book 2 §14.2 / §14.3. Every other *Ta string (labelTa, headingTa,
// introTa, titleTa, noteTa, hintTa, journeyTa) is a DRAFT pending native Tamil review (Book 2 §14 status note).
// Brand and programme names stay in Latin script. `shortLabelTa` on a primary item is the compact desktop-trigger
// label; the full labelTa is used in panels and the drawer.
// All paths are English-root paths; components localise them with localePath().
// `phase` marks P2/P3 pages (informational only: several phase-3 pages do resolve).
// `unpublished: true` hides a link whose page is not built yet; filter every list with isPublished().

/** False for links (or whole columns) whose page is not built yet. */
export const isPublished = (l) => !!l && !l.unpublished;

/** A column's visible links; empty for an unpublished column. */
export const publishedLinks = (col) => (isPublished(col) ? (col.links || []).filter(isPublished) : []);

export const PRIMARY_NAV = [
  {
    id: 'who',
    label: 'Who we are',
    labelTa: 'நாங்கள் யார்',
    to: '/about',
    match: ['/about', '/districts'],
    intro: 'Tamil Nadu’s founder-making network, and how we hold ourselves to account.',
    introTa: 'தமிழ்நாட்டின் நிறுவனர்களை உருவாக்கும் வலையமைப்பு, நாங்கள் எவ்வாறு பொறுப்புக்கூறுகிறோம் என்பதும்.',
    columns: [
      {
        heading: 'About StartNet',
        headingTa: 'StartNet பற்றி',
        links: [
          { label: 'Our story', labelTa: 'எங்கள் கதை', to: '/about' },
          { label: 'Mission 1 Lakh', to: '/about/mission-1-lakh' },
          { label: 'The founder ladder L1–L7', labelTa: 'நிறுவனர் ஏணி L1–L7', to: '/about/mission-1-lakh#ladder' },
          { label: 'How we work', labelTa: 'நாங்கள் செயல்படும் விதம்', to: '/about/how-we-work' },
          { label: 'Leadership & team', labelTa: 'தலைமை & குழு', to: '/about/leadership' },
        ],
      },
      {
        heading: 'How we keep score',
        headingTa: 'நாங்கள் எப்படிக் கணக்கிடுகிறோம்',
        links: [
          { label: 'Evidence standard', labelTa: 'சான்றுத் தரநிலை', to: '/about/evidence-standard' },
          { label: 'Governance & kill criteria', labelTa: 'நிர்வாகம் & நிறுத்த அளவுகோல்கள்', to: '/about/governance' },
          { label: 'Corrections log', labelTa: 'திருத்தப் பதிவேடு', to: '/insights/founder-ledger/corrections' },
          { label: 'Self-diagnosis report', labelTa: 'சுய மதிப்பீட்டு அறிக்கை', to: '/about/self-diagnosis', phase: 3 },
          { label: 'ThinkTN alliance', labelTa: 'ThinkTN கூட்டணி', to: '/about/thinktn-alliance' },
        ],
      },
      {
        heading: 'Where we work',
        headingTa: 'நாங்கள் பணியாற்றும் இடங்கள்',
        links: [
          // /districts is a list of districts (no map yet), so the label says what it opens.
          { label: 'All districts', labelTa: 'அனைத்து மாவட்டங்கள்', to: '/districts' },
          { label: 'Chennai', labelTa: 'சென்னை', to: '/districts/chennai', phase: 3 },
          { label: 'Coimbatore', labelTa: 'கோயம்புத்தூர்', to: '/districts/coimbatore', phase: 3 },
          { label: 'Madurai', labelTa: 'மதுரை', to: '/districts/madurai', phase: 3 },
          { label: 'Tiruchirappalli', labelTa: 'திருச்சிராப்பள்ளி', to: '/districts/tiruchirappalli', phase: 3 },
          { label: 'Our partners', labelTa: 'எங்கள் கூட்டாளர்கள்', to: '/partner/our-partners' },
        ],
      },
    ],
    featured: {
      kind: 'mission',
      title: 'Mission 1 Lakh: where we stand',
      titleTa: 'Mission 1 Lakh: நாங்கள் எங்கே இருக்கிறோம்',
      cta: { label: 'Read the mission', labelTa: 'இலக்கைப் படியுங்கள்', to: '/about/mission-1-lakh' },
    },
    footer: [
      { label: 'Media', labelTa: 'ஊடகம்', to: '/media' },
      { label: 'Careers', labelTa: 'பணி வாய்ப்புகள்', to: '/careers' },
      { label: 'Contact', labelTa: 'தொடர்புக்கு', to: '/contact' },
    ],
    seeAll: { label: 'See all of Who we are', labelTa: '‘நாங்கள் யார்’ பகுதி முழுவதையும் பாருங்கள்', to: '/about' },
  },
  {
    id: 'brands',
    label: 'Our brands',
    labelTa: 'எங்கள் பிராண்டுகள்',
    shortLabelTa: 'பிராண்டுகள்',
    to: '/brands',
    match: ['/brands', '/research', '/vibe', '/connect', '/women'],
    variant: 'brands',
    intro: 'Four doors into founding. Pick the one that fits who you are today.',
    introTa: 'நிறுவனராவதற்கு நான்கு வாசல்கள். இன்று நீங்கள் யார் என்பதற்குப் பொருந்துவதைத் தேர்ந்தெடுங்கள்.',
    columns: [
      {
        brand: 'research',
        heading: 'StartNet Research',
        journey: 'Scholar → Founder',
        journeyTa: 'ஆய்வாளர் → நிறுவனர்',
        links: [
          { label: 'Overview', labelTa: 'கண்ணோட்டம்', to: '/research' },
          { label: 'StartNet Labs', to: '/research/labs' },
          { label: 'Scholar Founders Fellowship', to: '/research/fellowship' },
          { label: 'Lab-to-Market Summit', to: '/research/lab-to-market-summit' },
          { label: 'Institution Partner Programme', to: '/research/institution-partner-programme' },
          { label: 'Problem statements', labelTa: 'சிக்கல் அறிக்கைகள்', to: '/research/problem-statements' },
        ],
        visit: { label: 'Visit StartNet Research', labelTa: 'StartNet Research-க்குச் செல்லுங்கள்', to: '/research' },
      },
      {
        brand: 'vibe',
        heading: 'StartNet Vibe',
        journey: 'Student → Founder',
        journeyTa: 'மாணவர் → நிறுவனர்',
        links: [
          { label: 'Overview', labelTa: 'கண்ணோட்டம்', to: '/vibe' },
          { label: 'Vibathon', note: 'a StartNet Vibe programme', noteTa: 'StartNet Vibe-இன் ஒரு திட்டம்', to: '/vibe/vibathon' },
          { label: 'Vibe Academy', to: '/vibe/academy' },
          { label: 'Vibe Campus', to: '/vibe/campus' },
          { label: 'Vibe Launchpad', to: '/vibe/launchpad' },
          { label: 'Vibe Clubs', to: '/vibe/clubs' },
          { label: 'Vibe Summit', to: '/vibe/summit' },
        ],
        visit: { label: 'Visit StartNet Vibe', labelTa: 'StartNet Vibe-க்குச் செல்லுங்கள்', to: '/vibe' },
      },
      {
        brand: 'connect',
        heading: 'StartNet Connect',
        journey: 'Professional → Founder, Startup → Scale',
        journeyTa: 'தொழில்முறையாளர் → நிறுவனர், ஸ்டார்ட்அப் → விரிவாக்கம்',
        links: [
          { label: 'Overview', labelTa: 'கண்ணோட்டம்', to: '/connect' },
          { label: 'Connect Series', to: '/connect/series' },
          { label: 'Connect Circles', to: '/connect/circles' },
          { label: 'Founder Switch', to: '/connect/founder-switch' },
          { label: 'Scale Connect', to: '/connect/scale' },
          { label: 'StartNet Angels', to: '/connect/angels', phase: 3 },
        ],
        visit: { label: 'Visit StartNet Connect', labelTa: 'StartNet Connect-க்குச் செல்லுங்கள்', to: '/connect' },
      },
      {
        brand: 'women',
        heading: 'StartNet Women',
        journey: 'Woman → Founder',
        journeyTa: 'பெண் → நிறுவனர்',
        links: [
          { label: 'Overview', labelTa: 'கண்ணோட்டம்', to: '/women' },
          { label: 'Women Circles', to: '/women/circles' },
          { label: 'Rise Academy', to: '/women/rise-academy' },
          { label: 'HerCapital', to: '/women/hercapital' },
          { label: 'Women Founders Summit & Awards', to: '/women/summit' },
        ],
        visit: { label: 'Visit StartNet Women', labelTa: 'StartNet Women-க்குச் செல்லுங்கள்', to: '/women' },
      },
    ],
    featured: {
      kind: 'platform-strip',
      title: 'All four brands run on one platform. One free SNX profile follows you from your first event to your first funding.',
      titleTa: 'நான்கு பிராண்டுகளும் ஒரே தளத்தில் இயங்குகின்றன. ஒரே இலவச SNX சுயவிவரம் உங்கள் முதல் நிகழ்விலிருந்து முதல் நிதி வரை உங்களுடன் வரும்.',
      cta: { label: 'Explore StartNet X', labelTa: 'StartNet X-ஐ ஆராயுங்கள்', to: '/startnet-x' },
    },
    footer: [],
    seeAll: { label: 'See all brands', labelTa: 'அனைத்து பிராண்டுகளையும் பாருங்கள்', to: '/brands' },
  },
  {
    id: 'programmes',
    label: 'Programmes',
    labelTa: 'திட்டங்கள்',
    to: '/programmes',
    match: ['/programmes'],
    intro: 'Find the right next step in two questions.',
    introTa: 'இரண்டு கேள்விகளில் உங்களுக்கான அடுத்த படியைக் கண்டறியுங்கள்.',
    columns: [
      {
        heading: 'Learn to build',
        headingTa: 'உருவாக்கக் கற்க',
        meta: 'L1–L3',
        links: [
          { label: 'Vibe Academy', to: '/vibe/academy' },
          { label: 'Rise Academy', to: '/women/rise-academy' },
          { label: 'Scholar Founders Fellowship', to: '/research/fellowship' },
          { label: 'Founder Switch', to: '/connect/founder-switch' },
        ],
      },
      {
        heading: 'Start a company',
        headingTa: 'நிறுவனத்தைத் தொடங்குங்கள்',
        meta: 'L3–L5',
        links: [
          { label: 'Vibe Launchpad', to: '/vibe/launchpad' },
          { label: 'StartNet Labs venture studio', labelTa: 'StartNet Labs வென்ச்சர் ஸ்டுடியோ', to: '/research/labs' },
          { label: 'Women Launch cohorts', labelTa: 'Women Launch குழுக்கள்', to: '/women/hercapital#launch', phase: 3, unpublished: true },
          { label: 'Co-founder matching', labelTa: 'இணை நிறுவனர் பொருத்தம்', to: '/connect/founder-switch#matching' },
        ],
      },
      {
        heading: 'Raise money',
        headingTa: 'நிதி திரட்டுங்கள்',
        meta: 'L5–L6',
        links: [
          { label: 'HerCapital', to: '/women/hercapital' },
          { label: 'Grant Desk', to: '/programmes/grant-desk', phase: 3 },
          { label: 'StartNet Angels', to: '/connect/angels', phase: 3 },
          { label: 'Investor days', labelTa: 'முதலீட்டாளர் நாட்கள்', to: '/connect/scale#investor-days' },
        ],
      },
      {
        heading: 'Find customers and peers',
        headingTa: 'வாடிக்கையாளர்கள் & சக நிறுவனர்கள்',
        // L4–L7 matches Book 1 (line 990).
        meta: 'L4–L7',
        links: [
          { label: 'Scale Connect pilot days', labelTa: 'Scale Connect முன்னோட்ட நாட்கள்', to: '/connect/scale' },
          { label: 'GCC problem statements', labelTa: 'GCC சிக்கல் அறிக்கைகள்', to: '/research/problem-statements' },
          { label: 'Connect Circles', to: '/connect/circles' },
          { label: 'Women Circles', to: '/women/circles' },
          { label: 'Vibe Clubs', to: '/vibe/clubs' },
        ],
      },
    ],
    featured: {
      kind: 'open-calls',
      title: 'Open calls',
      titleTa: 'திறந்த அழைப்புகள்',
      cta: { label: 'Find a programme', labelTa: 'ஒரு திட்டத்தைக் கண்டறியுங்கள்', to: '/programmes' },
    },
    footer: [
      { label: 'Not sure where to start? Answer two questions', labelTa: 'எங்கு தொடங்குவது எனத் தெரியவில்லையா? இரண்டு கேள்விகளுக்குப் பதிலளியுங்கள்', to: '/join' },
      { label: 'All open calls', labelTa: 'அனைத்து திறந்த அழைப்புகள்', to: '/programmes/open-calls' },
    ],
    seeAll: { label: 'See all programmes', labelTa: 'அனைத்து திட்டங்களையும் பாருங்கள்', to: '/programmes' },
  },
  {
    id: 'events',
    label: 'Events',
    labelTa: 'நிகழ்வுகள்',
    to: '/events',
    match: ['/events'],
    intro: 'Summits, sector Connects, campus build nights and district editions.',
    introTa: 'உச்சி மாநாடுகள், துறைசார் Connect நிகழ்வுகள், வளாக உருவாக்க இரவுகள், மாவட்டப் பதிப்புகள்.',
    columns: [
      {
        heading: 'What’s on',
        headingTa: 'நடப்பவை',
        links: [
          { label: 'All upcoming', labelTa: 'வரவிருக்கும் அனைத்தும்', to: '/events' },
          { label: 'This month', labelTa: 'இந்த மாதம்', to: '/events?when=month' },
          { label: 'Near me', labelTa: 'எனக்கு அருகில்', to: '/districts' },
          { label: 'Online & hybrid', labelTa: 'இணையவழி & கலப்பு', to: '/events?format=online,hybrid' },
        ],
      },
      {
        heading: 'Flagships',
        headingTa: 'முதன்மை நிகழ்வுகள்',
        links: [
          { label: 'Vibathon', to: '/events/vibathon' },
          { label: 'Lab-to-Market Summit', to: '/events/lab-to-market-summit' },
          { label: 'Women Founders Summit & Awards', to: '/events/women-founders-summit' },
          { label: 'Vibe Summit', to: '/events/vibe-summit', phase: 2 },
          { label: 'StartNet Founders Day', to: '/events/founders-day', phase: 3 },
        ],
      },
      {
        heading: 'Series',
        headingTa: 'தொடர்கள்',
        links: [
          { label: 'GenAI Connect', to: '/events/genai-connect' },
          { label: 'SaaS Connect', to: '/events/saas-connect' },
          { label: 'D2C Connect', to: '/events/d2c-connect' },
          { label: 'All sector Connects', labelTa: 'அனைத்து துறைசார் Connect நிகழ்வுகள்', to: '/connect/series' },
          { label: 'Vibe Campus', to: '/events/vibe-campus' },
          { label: 'Research Days', to: '/events/research-days' },
        ],
      },
      {
        heading: 'Take part',
        headingTa: 'பங்கேற்க',
        links: [
          { label: 'Host an event in your college or district', labelTa: 'உங்கள் கல்லூரியில் அல்லது மாவட்டத்தில் நிகழ்வு நடத்துங்கள்', to: '/events/host', phase: 2 },
          { label: 'Speak or mentor', labelTa: 'உரையாற்றுங்கள் அல்லது வழிகாட்டுங்கள்', to: '/events/speak' },
          { label: 'Sponsor an event', labelTa: 'நிகழ்வுக்கு நிதியுதவி செய்யுங்கள்', to: '/partner/sponsors' },
          { label: 'Past events & outcomes', labelTa: 'கடந்த நிகழ்வுகள் & விளைவுகள்', to: '/events/past' },
        ],
      },
    ],
    featured: {
      kind: 'flagship',
      title: 'Next flagship',
      titleTa: 'அடுத்த முதன்மை நிகழ்வு',
      cta: { label: 'Register', labelTa: 'பதிவு செய்யுங்கள்', to: '/events' },
    },
    // Footer strips never repeat a link that is already in the panel's columns.
    footer: [{ label: 'Event recaps', labelTa: 'நிகழ்வுச் சுருக்கங்கள்', to: '/insights/stories?type=recap' }],
    seeAll: { label: 'See all events', labelTa: 'அனைத்து நிகழ்வுகளையும் பாருங்கள்', to: '/events' },
  },
  {
    id: 'insights',
    label: 'Insights',
    labelTa: 'நுண்ணறிவுகள்',
    to: '/insights',
    match: ['/insights'],
    intro: 'What we count, how we count it, and what we’ve learned.',
    introTa: 'நாங்கள் எதைக் கணக்கிடுகிறோம், எப்படிக் கணக்கிடுகிறோம், என்ன கற்றுக்கொண்டோம்.',
    columns: [
      {
        heading: 'Founder Ledger',
        links: [
          { label: 'This quarter', labelTa: 'இந்தக் காலாண்டு', to: '/insights/founder-ledger' },
          { label: 'How we count', labelTa: 'நாங்கள் கணக்கிடும் முறை', to: '/insights/founder-ledger/methodology' },
          { label: 'Corrections log', labelTa: 'திருத்தப் பதிவேடு', to: '/insights/founder-ledger/corrections' },
          { label: 'Past quarters', labelTa: 'கடந்த காலாண்டுகள்', to: '/insights/founder-ledger#archive', unpublished: true },
        ],
      },
      {
        // Each report appears only once published: filled from GET /api/reports at runtime.
        heading: 'Reports & indices',
        headingTa: 'அறிக்கைகள் & குறியீடுகள்',
        dynamic: 'reports',
        links: [
          { label: 'Reports library', labelTa: 'அறிக்கை நூலகம்', to: '/insights/reports' },
          { label: 'Indices', labelTa: 'குறியீடுகள்', to: '/insights/indices', phase: 3 },
        ],
      },
      {
        heading: 'Stories',
        headingTa: 'கதைகள்',
        links: [
          { label: 'Founder stories', labelTa: 'நிறுவனர் கதைகள்', to: '/insights/stories' },
          { label: 'Event recaps', labelTa: 'நிகழ்வுச் சுருக்கங்கள்', to: '/insights/stories?type=recap' },
          { label: 'Podcast (Tamil & English)', labelTa: 'பாட்காஸ்ட் (தமிழ் & ஆங்கிலம்)', to: '/insights/podcast', phase: 3 },
          { label: 'Newsletter', labelTa: 'செய்திமடல்', to: '/insights/newsletter' },
        ],
      },
    ],
    featured: {
      kind: 'ledger',
      title: 'The Ledger at a glance',
      titleTa: 'Ledger ஒரே பார்வையில்',
      cta: { label: 'Get the quarterly Ledger', labelTa: 'காலாண்டு Ledger-ஐப் பெறுங்கள்', to: '/insights/newsletter?topic=ledger' },
    },
    footer: [{ label: 'Evidence standard', labelTa: 'சான்றுத் தரநிலை', to: '/about/evidence-standard' }],
    seeAll: { label: 'See all insights', labelTa: 'அனைத்து நுண்ணறிவுகளையும் பாருங்கள்', to: '/insights' },
  },
  {
    id: 'snx',
    label: 'StartNet X',
    labelTa: 'StartNet X',
    to: '/startnet-x',
    match: ['/startnet-x'],
    intro: 'One founder profile for every StartNet programme.',
    introTa: 'ஒவ்வொரு StartNet திட்டத்திற்கும் ஒரே நிறுவனர் சுயவிவரம்.',
    columns: [
      {
        heading: 'The platform',
        headingTa: 'தளம்',
        links: [
          { label: 'What SNX is', labelTa: 'SNX என்றால் என்ன', to: '/startnet-x' },
          { label: 'Modules', labelTa: 'தொகுதிகள்', to: '/startnet-x/modules' },
          { label: 'AI agents and guardrails', labelTa: 'AI முகவர்களும் பாதுகாப்பு வரம்புகளும்', to: '/startnet-x/agents', phase: 3 },
          { label: 'Trust, privacy & security', labelTa: 'நம்பிக்கை, தனியுரிமை & பாதுகாப்பு', to: '/startnet-x/trust' },
          { label: 'Updates', labelTa: 'புதுப்பிப்புகள்', to: '/startnet-x/updates', phase: 2 },
        ],
      },
      {
        heading: 'Built for',
        headingTa: 'யாருக்காக',
        links: [
          { label: 'Founders & learners (free)', labelTa: 'நிறுவனர்கள் & கற்போர் (இலவசம்)', to: '/startnet-x/founders' },
          { label: 'Institutions', labelTa: 'கல்வி நிறுவனங்கள்', to: '/startnet-x/institutions', phase: 2 },
          { label: 'Incubators & TBIs', labelTa: 'இன்குபேட்டர்கள் & TBI-கள்', to: '/startnet-x/incubators', phase: 2 },
          { label: 'GCCs & corporates', labelTa: 'GCC-கள் & பெருநிறுவனங்கள்', to: '/startnet-x/gccs', phase: 2 },
          { label: 'Government & districts', labelTa: 'அரசு & மாவட்டங்கள்', to: '/startnet-x/government', phase: 2 },
          { label: 'Investors', labelTa: 'முதலீட்டாளர்கள்', to: '/startnet-x/investors', phase: 2 },
        ],
      },
      {
        heading: 'Plans',
        headingTa: 'கட்டணத் திட்டங்கள்',
        links: [
          { label: 'Pricing', labelTa: 'கட்டணம்', to: '/startnet-x/pricing' },
          { label: 'Students: Pro at 50% off', labelTa: 'மாணவர்களுக்கு: Pro 50% தள்ளுபடியில்', to: '/startnet-x/pricing#plan-pro' },
          { label: 'Request a demo', labelTa: 'டெமோ கோருங்கள்', to: '/partner/enquire?topic=snx' },
        ],
      },
      {
        heading: 'Developers',
        headingTa: 'டெவலப்பர்கள்',
        phase: 3,
        links: [
          { label: 'API & Ledger data', labelTa: 'API & Ledger தரவு', to: '/startnet-x/developers' },
          { label: 'Webhooks', to: '/startnet-x/developers#webhooks' },
          { label: 'Status', labelTa: 'நிலை', to: '/startnet-x/developers#status' },
        ],
      },
    ],
    featured: {
      kind: 'snx',
      title: 'Free for talent. One profile from first Vibathon to first funding.',
      titleTa: 'திறமையாளர்களுக்கு இலவசம். முதல் Vibathon முதல் முதல் நிதி வரை ஒரே சுயவிவரம்.',
      cta: { label: 'Create your free profile', labelTa: 'உங்கள் இலவச சுயவிவரத்தை உருவாக்குங்கள்', snx: '/signup' },
    },
    footer: [],
    seeAll: { label: 'See all of StartNet X', labelTa: 'StartNet X பகுதி முழுவதையும் பாருங்கள்', to: '/startnet-x' },
  },
  {
    id: 'partner',
    label: 'Partner with us',
    labelTa: 'எங்களுடன் கூட்டு சேருங்கள்',
    shortLabelTa: 'கூட்டாளராகுங்கள்',
    to: '/partner',
    match: ['/partner'],
    intro: 'Back the next generation of Tamil Nadu founders and see what it produced.',
    introTa: 'தமிழ்நாட்டின் அடுத்த தலைமுறை நிறுவனர்களுக்குத் துணை நில்லுங்கள், அதன் விளைவுகளைப் பாருங்கள்.',
    columns: [
      {
        heading: 'Partner by type',
        headingTa: 'கூட்டாளர் வகைப்படி',
        links: [
          { label: 'Universities & colleges', labelTa: 'பல்கலைக்கழகங்கள் & கல்லூரிகள்', to: '/partner/institutions' },
          { label: 'GCCs & corporates', labelTa: 'GCC-கள் & பெருநிறுவனங்கள்', to: '/partner/gccs' },
          { label: 'Government & districts', labelTa: 'அரசு & மாவட்டங்கள்', to: '/partner/government' },
          { label: 'Sponsors', labelTa: 'நிதியுதவியாளர்கள்', to: '/partner/sponsors' },
          { label: 'CSR foundations', labelTa: 'CSR அறக்கட்டளைகள்', to: '/partner/csr' },
          { label: 'Investors', labelTa: 'முதலீட்டாளர்கள்', to: '/partner/investors' },
          { label: 'Incubators & TBIs', labelTa: 'இன்குபேட்டர்கள் & TBI-கள்', to: '/partner/incubators' },
        ],
      },
      {
        heading: 'Ready-made solutions',
        headingTa: 'தயார்நிலைத் தீர்வுகள்',
        links: [
          { label: 'District Ecosystem Programme', to: '/partner/district-programme' },
          { label: 'Institution Partner Programme', to: '/research/institution-partner-programme' },
          { label: 'Lab sponsorship', labelTa: 'ஆய்வக நிதியுதவி', to: '/research/labs#sponsor' },
          { label: 'Vibathon partnerships', labelTa: 'Vibathon கூட்டாண்மைகள்', to: '/vibe/vibathon#partners' },
          { label: 'GCC talent package', labelTa: 'GCC திறமைத் தொகுப்பு', to: '/partner/gccs#talent' },
          { label: 'Intrapreneur-to-founder programme', labelTa: 'பணியாளரிலிருந்து நிறுவனர் வரை திட்டம்', to: '/partner/gccs#intrapreneurs' },
          { label: 'CSR founder programmes', labelTa: 'CSR நிறுவனர் திட்டங்கள்', to: '/partner/csr' },
        ],
      },
      {
        heading: 'Proof',
        headingTa: 'சான்று',
        links: [
          { label: 'Our partners (signed, dated)', labelTa: 'எங்கள் கூட்டாளர்கள் (கையொப்பமிட்டு, தேதியிட்டவை)', to: '/partner/our-partners' },
          { label: 'Partner outcomes', labelTa: 'கூட்டாளர் விளைவுகள்', to: '/partner/our-partners' },
          { label: 'Founder Ledger', to: '/insights/founder-ledger' },
          { label: 'Rate card (on request)', labelTa: 'கட்டண அட்டவணை (கோரிக்கையின் பேரில்)', to: '/partner/sponsors#rate-card' },
        ],
      },
    ],
    featured: {
      kind: 'partner',
      title: 'Tell us what you need. We reply within two working days.',
      titleTa: 'உங்களுக்கு என்ன தேவை என்று சொல்லுங்கள். இரண்டு வேலை நாட்களுக்குள் பதிலளிக்கிறோம்.',
      cta: { label: 'Start an enquiry', labelTa: 'விசாரணையைத் தொடங்குங்கள்', to: '/partner/enquire' },
    },
    // 'Start an enquiry' is the featured CTA and 'Our partners' is in Proof, so the strip offers a person to talk to.
    footer: [{ label: 'Talk to us', labelTa: 'எங்களிடம் பேசுங்கள்', to: '/contact?topic=partnership' }],
    seeAll: { label: 'See all partnership options', labelTa: 'அனைத்து கூட்டாண்மை வாய்ப்புகளையும் பாருங்கள்', to: '/partner' },
  },
];

/** Book 1 Part B §3.3 / Book 3 C01 */
export const UTILITY_LINKS = [
  { id: 'media', label: 'Media', labelTa: 'ஊடகம்', to: '/media' },
  { id: 'careers', label: 'Careers', labelTa: 'பணி வாய்ப்புகள்', to: '/careers' },
  { id: 'contact', label: 'Contact', labelTa: 'தொடர்புக்கு', to: '/contact' },
];

export const SIGN_IN = {
  label: 'Sign in',
  labelTa: 'உள்நுழைக',
  tooltip: 'Sign in to StartNet X, your founder profile.',
  tooltipTa: 'உங்கள் நிறுவனர் சுயவிவரமான StartNet X-இல் உள்நுழையுங்கள்.',
};

export const JOIN = { label: 'Join StartNet', labelTa: 'StartNet-இல் இணையுங்கள்', shortLabel: 'Join StartNet', shortLabelTa: 'இணையுங்கள்', to: '/join' };

/** Search quick links before typing (Book 1 Part B §3.6) */
export const SEARCH_QUICK_LINKS = [
  { label: 'Vibathon', to: '/vibe/vibathon', hint: 'a StartNet Vibe programme', hintTa: 'StartNet Vibe-இன் ஒரு திட்டம்' },
  { label: 'Open calls', labelTa: 'திறந்த அழைப்புகள்', to: '/programmes/open-calls', hint: 'Programmes accepting applications now', hintTa: 'இப்போது விண்ணப்பங்களை ஏற்கும் திட்டங்கள்' },
  { label: 'Founder Ledger', to: '/insights/founder-ledger', hint: 'What we count, with A/B/C tags', hintTa: 'நாங்கள் கணக்கிடுபவை, A/B/C குறிச்சொற்களுடன்' },
  { label: 'Join StartNet', labelTa: 'StartNet-இல் இணையுங்கள்', to: '/join', hint: 'Answer two questions, find your path', hintTa: 'இரண்டு கேள்விகளுக்குப் பதிலளித்து, உங்கள் பாதையைக் கண்டறியுங்கள்' },
];

/** Footer row 2 · link columns (Book 1 Part B §3.8) */
export const FOOTER_COLUMNS = [
  {
    id: 'who',
    heading: 'Who we are',
    headingTa: 'நாங்கள் யார்',
    links: [
      { label: 'Our story', labelTa: 'எங்கள் கதை', to: '/about' },
      { label: 'Mission 1 Lakh', to: '/about/mission-1-lakh' },
      { label: 'Leadership', labelTa: 'தலைமை', to: '/about/leadership' },
      { label: 'Evidence standard', labelTa: 'சான்றுத் தரநிலை', to: '/about/evidence-standard' },
      { label: 'Districts', labelTa: 'மாவட்டங்கள்', to: '/districts' },
    ],
  },
  {
    id: 'brands',
    heading: 'Our brands',
    headingTa: 'எங்கள் பிராண்டுகள்',
    links: [
      { label: 'StartNet Research', to: '/research', brand: 'research' },
      { label: 'StartNet Vibe', to: '/vibe', brand: 'vibe' },
      { label: 'StartNet Connect', to: '/connect', brand: 'connect' },
      { label: 'StartNet Women', to: '/women', brand: 'women' },
      { label: 'StartNet X', to: '/startnet-x', brand: 'x' },
    ],
  },
  {
    id: 'take-part',
    heading: 'Take part',
    headingTa: 'பங்கேற்க',
    links: [
      { label: 'Programmes', labelTa: 'திட்டங்கள்', to: '/programmes' },
      { label: 'Open calls', labelTa: 'திறந்த அழைப்புகள்', to: '/programmes/open-calls' },
      { label: 'Events', labelTa: 'நிகழ்வுகள்', to: '/events' },
      { label: 'Join StartNet', labelTa: 'StartNet-இல் இணையுங்கள்', to: '/join' },
      { label: 'Speak or mentor', labelTa: 'உரையாற்றுங்கள் அல்லது வழிகாட்டுங்கள்', to: '/events/speak' },
    ],
  },
  {
    id: 'insights',
    heading: 'Insights',
    headingTa: 'நுண்ணறிவுகள்',
    links: [
      { label: 'Founder Ledger', to: '/insights/founder-ledger' },
      { label: 'Reports', labelTa: 'அறிக்கைகள்', to: '/insights/reports' },
      { label: 'Stories', labelTa: 'கதைகள்', to: '/insights/stories' },
      { label: 'Corrections log', labelTa: 'திருத்தப் பதிவேடு', to: '/insights/founder-ledger/corrections' },
    ],
  },
  {
    id: 'partner',
    heading: 'Partner with us',
    headingTa: 'எங்களுடன் கூட்டு சேருங்கள்',
    links: [
      { label: 'Universities & colleges', labelTa: 'பல்கலைக்கழகங்கள் & கல்லூரிகள்', to: '/partner/institutions' },
      { label: 'GCCs & corporates', labelTa: 'GCC-கள் & பெருநிறுவனங்கள்', to: '/partner/gccs' },
      { label: 'Government & districts', labelTa: 'அரசு & மாவட்டங்கள்', to: '/partner/government' },
      { label: 'Sponsors', labelTa: 'நிதியுதவியாளர்கள்', to: '/partner/sponsors' },
      { label: 'CSR foundations', labelTa: 'CSR அறக்கட்டளைகள்', to: '/partner/csr' },
      { label: 'Investors', labelTa: 'முதலீட்டாளர்கள்', to: '/partner/investors' },
      { label: 'Incubators & TBIs', labelTa: 'இன்குபேட்டர்கள் & TBI-கள்', to: '/partner/incubators' },
      { label: 'Enquire', labelTa: 'விசாரிக்க', to: '/partner/enquire' },
    ],
  },
  {
    id: 'company',
    heading: 'Company',
    headingTa: 'நிறுவனம்',
    links: [
      { label: 'Media', labelTa: 'ஊடகம்', to: '/media' },
      { label: 'Careers', labelTa: 'பணி வாய்ப்புகள்', to: '/careers' },
      { label: 'Contact', labelTa: 'தொடர்புக்கு', to: '/contact' },
      { label: 'Grievance officer', labelTa: 'குறைதீர்ப்பு அலுவலர்', to: '/legal/grievance' },
    ],
  },
];

/**
 * Footer row 3 · master social handles (Book 1 §3.8, Book 2 §0.4). Official StartNet profiles (public, confirmed by
 * StartNet, Oct 2026). Instagram has no confirmed handle yet: a channel without a `url` is not shown; add the URL
 * when StartNet confirms it.
 */
export const SOCIAL_CHANNELS = [
  { id: 'linkedin', label: 'LinkedIn', url: 'https://www.linkedin.com/company/startnetindia' },
  { id: 'instagram', label: 'Instagram' },
  { id: 'youtube', label: 'YouTube', url: 'https://www.youtube.com/@startnetindia' },
  { id: 'x', label: 'X', url: 'https://x.com/startnetindia' },
];

/** Footer row 6 · legal (Book 1 §3.8). `action: 'cookies'` reopens the consent banner. */
export const LEGAL_LINKS = [
  { label: 'Privacy', labelTa: 'தனியுரிமை', to: '/legal/privacy' },
  { label: 'Terms', labelTa: 'விதிமுறைகள்', to: '/legal/terms' },
  { label: 'Cookies', labelTa: 'குக்கீகள்', to: '/legal/cookies' },
  { label: 'Cookie settings', labelTa: 'குக்கீ அமைப்புகள்', action: 'cookies' },
  { label: 'Your data rights', labelTa: 'உங்கள் தரவு உரிமைகள்', to: '/legal/data-rights' },
  { label: 'Refunds', labelTa: 'பணத்திருப்பம்', to: '/legal/refunds' },
  { label: 'Accessibility', labelTa: 'அணுகல்தன்மை', to: '/legal/accessibility' },
  { label: 'Code of conduct', labelTa: 'நடத்தை விதிமுறைகள்', to: '/legal/code-of-conduct' },
  { label: 'Sitemap', labelTa: 'தள வரைபடம்', to: '/sitemap' },
];

/** ThinkTN line: locked in code (Book 1 Part B §3.8 row 5, Book 3 C09). The Tamil line is a draft for native review. */
export const THINKTN_LINE =
  'StartNet follows an evidence standard shared with ThinkTN Foundation, an independent non-profit. ThinkTN is not part of StartNet.';
export const THINKTN_LINE_TA =
  'StartNet, சுயாதீன இலாப நோக்கற்ற அமைப்பான ThinkTN Foundation-உடன் பகிரப்பட்ட சான்றுத் தரநிலையைப் பின்பற்றுகிறது. ThinkTN, StartNet-இன் ஒரு பகுதி அல்ல.';

/** Which primary section a pathname (without /ta) belongs to. */
export function sectionFor(pathname) {
  const hit = PRIMARY_NAV.find((item) =>
    item.match.some((m) => pathname === m || pathname.startsWith(`${m}/`))
  );
  return hit ? hit.id : null;
}
