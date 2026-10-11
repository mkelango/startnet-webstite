// The four talent brands + StartNet X. Accent tokens come from CSS via [data-brand] (Book 3 §9.3).
// Sub-nav links and CTAs: Book 1 Part B §4.
// Sub-nav items may carry `match: string[]` — extra paths (and their children) that light up that item.
// CTAs: { label, labelTa?, shortLabel, shortLabelTa?, to } or, for StartNet X, { label, snx: '/signup' }
// (the layout builds the x.startnet.in URL with src/brand/lang). shortLabel is used on phones < 360 px,
// shortLabelTa on every Tamil bottom bar. `cta.byPath` maps a (language-stripped) page path to a CTA that suits
// that page better than the brand default; brandCtaFor() resolves it.
// Tamil: CTA verbs from Book 2 §14.3; every other *Ta string is a draft pending native Tamil review.
// Brand and programme names stay in Latin script.

export const BRANDS = {
  research: {
    key: 'research',
    name: 'StartNet Research',
    descriptor: 'Research',
    journey: 'Scholar → Founder',
    journeyTa: 'ஆய்வாளர் → நிறுவனர்',
    promise: 'Turn your research into a company you co-own, on standard terms your institution can sign.',
    promiseTa: 'உங்கள் ஆய்வை, உங்கள் கல்வி நிறுவனம் கையொப்பமிடக்கூடிய நிலையான விதிமுறைகளில், நீங்களும் இணை உரிமையாளராக இருக்கும் நிறுவனமாக மாற்றுங்கள்.',
    base: '/research',
    subNav: [
      // Brand stories/events pages have no sub-nav item of their own (Book 1 §4): they light up Overview.
      { label: 'Overview', labelTa: 'கண்ணோட்டம்', to: '/research', match: ['/research/stories', '/research/events'] },
      { label: 'Labs', to: '/research/labs' },
      { label: 'Fellowship', to: '/research/fellowship' },
      { label: 'Lab-to-Market Summit', to: '/research/lab-to-market-summit' },
      { label: 'Institutions', labelTa: 'கல்வி நிறுவனங்கள்', to: '/research/institution-partner-programme' },
      { label: 'Problem statements', labelTa: 'சிக்கல் அறிக்கைகள்', to: '/research/problem-statements' },
      { label: 'Terms', labelTa: 'விதிமுறைகள்', to: '/research/terms' },
    ],
    cta: {
      label: 'Apply to the Fellowship',
      labelTa: 'Fellowship-க்கு விண்ணப்பியுங்கள்',
      shortLabel: 'Apply now',
      shortLabelTa: 'இப்போதே விண்ணப்பியுங்கள்',
      to: '/research/fellowship',
      byPath: {
        '/research/institution-partner-programme': {
          label: 'Book a consultation',
          labelTa: 'ஆலோசனைக்கு நேரம் பதிவு செய்யுங்கள்',
          shortLabel: 'Book a consultation',
          shortLabelTa: 'ஆலோசனை பதிவு',
          to: '/partner/enquire?type=institution&ref=research-ipp',
        },
      },
    },
  },
  vibe: {
    key: 'vibe',
    name: 'StartNet Vibe',
    descriptor: 'Vibe',
    journey: 'Student → Founder',
    journeyTa: 'மாணவர் → நிறுவனர்',
    promise: 'Build with AI in college, in Tamil or English, and leave with a product, a team and a next step.',
    promiseTa: 'கல்லூரியிலேயே AI மூலம், தமிழிலோ ஆங்கிலத்திலோ உருவாக்குங்கள்; ஒரு தயாரிப்பு, ஒரு குழு, அடுத்த படியுடன் வெளியே வாருங்கள்.',
    base: '/vibe',
    subNav: [
      { label: 'Overview', labelTa: 'கண்ணோட்டம்', to: '/vibe', match: ['/vibe/stories', '/vibe/events'] },
      { label: 'Vibathon', to: '/vibe/vibathon' },
      { label: 'Academy', to: '/vibe/academy' },
      { label: 'Campus', to: '/vibe/campus' },
      { label: 'Launchpad', to: '/vibe/launchpad' },
      { label: 'Clubs', to: '/vibe/clubs' },
      { label: 'Summit', labelTa: 'உச்சி மாநாடு', to: '/vibe/summit' },
      { label: 'For colleges', labelTa: 'கல்லூரிகளுக்கு', to: '/vibe/for-colleges' },
    ],
    cta: {
      label: 'Register for Vibathon 2027',
      labelTa: 'Vibathon 2027-க்குப் பதிவு செய்யுங்கள்',
      shortLabel: 'Register',
      shortLabelTa: 'பதிவு செய்யுங்கள்',
      to: '/vibe/vibathon',
    },
  },
  connect: {
    key: 'connect',
    name: 'StartNet Connect',
    descriptor: 'Connect',
    journey: 'Professional → Founder · Startup → Scale',
    journeyTa: 'தொழில்முறையாளர் → நிறுவனர் · ஸ்டார்ட்அப் → விரிவாக்கம்',
    promise: 'Meet the people in your sector who can help you start, switch or scale, in rooms built for it.',
    promiseTa: 'தொடங்க, மாற, அல்லது விரிவாக்க உதவக்கூடிய உங்கள் துறை மனிதர்களை, அதற்கென அமைக்கப்பட்ட அரங்குகளில் சந்தியுங்கள்.',
    base: '/connect',
    subNav: [
      { label: 'Overview', labelTa: 'கண்ணோட்டம்', to: '/connect', match: ['/connect/stories'] },
      {
        label: 'Connect Series',
        to: '/connect/series',
        match: [
          '/connect/series', '/connect/genai', '/connect/saas', '/connect/d2c', '/connect/deeptech',
          '/connect/fintech', '/connect/industry-4-0', '/connect/healthtech', '/connect/agrifood', '/connect/climate',
        ],
      },
      { label: 'Circles', to: '/connect/circles' },
      { label: 'Founder Switch', to: '/connect/founder-switch' },
      { label: 'Scale', to: '/connect/scale' },
      { label: 'Angels', to: '/connect/angels' },
      { label: 'Events', labelTa: 'நிகழ்வுகள்', to: '/connect/events' },
    ],
    cta: {
      label: 'Find your sector Connect',
      labelTa: 'உங்கள் துறைக்கான Connect-ஐக் கண்டறியுங்கள்',
      shortLabel: 'Find your Connect',
      shortLabelTa: 'Connect-ஐக் கண்டறியுங்கள்',
      to: '/connect/series',
      byPath: {
        '/connect/scale': {
          label: 'Apply to Scale Connect',
          labelTa: 'Scale Connect-க்கு விண்ணப்பியுங்கள்',
          shortLabel: 'Apply now',
          shortLabelTa: 'இப்போதே விண்ணப்பியுங்கள்',
          snx: '/apply/scale-connect',
        },
      },
    },
  },
  women: {
    key: 'women',
    name: 'StartNet Women',
    descriptor: 'Women',
    journey: 'Woman → Founder',
    journeyTa: 'பெண் → நிறுவனர்',
    promise: 'From business owner to investable founder: market access first, capital next.',
    promiseTa: 'தொழில் உரிமையாளரிலிருந்து முதலீட்டுக்குத் தகுதியான நிறுவனர் வரை: முதலில் சந்தை அணுகல், பிறகு மூலதனம்.',
    base: '/women',
    subNav: [
      { label: 'Overview', labelTa: 'கண்ணோட்டம்', to: '/women', match: ['/women/events'] },
      { label: 'Circles', to: '/women/circles' },
      { label: 'Rise Academy', to: '/women/rise-academy' },
      { label: 'HerCapital', to: '/women/hercapital' },
      { label: 'Summit & Awards', labelTa: 'Summit & விருதுகள்', to: '/women/summit' },
      { label: 'Stories', labelTa: 'கதைகள்', to: '/women/stories' },
    ],
    cta: {
      label: 'Join a Women Circle',
      labelTa: 'ஒரு Women Circle-இல் இணையுங்கள்',
      shortLabel: 'Join a Circle',
      shortLabelTa: 'Circle-இல் இணையுங்கள்',
      to: '/women/circles',
    },
  },
  x: {
    key: 'x',
    name: 'StartNet X',
    descriptor: 'X',
    journey: 'One profile, first event to first funding',
    journeyTa: 'ஒரே சுயவிவரம், முதல் நிகழ்விலிருந்து முதல் நிதி வரை',
    promise: 'Free for talent. One profile from first Vibathon to first funding.',
    promiseTa: 'திறமையாளர்களுக்கு இலவசம். முதல் Vibathon முதல் முதல் நிதி வரை ஒரே சுயவிவரம்.',
    base: '/startnet-x',
    subNav: [
      // Book 1 §4: Overview · Modules · Pricing · For organisations · Trust · Developers. The talent page (/founders)
      // and Updates light up Overview; AI agents are a module (Book 1 §2.2), so /agents lights up Modules.
      { label: 'Overview', labelTa: 'கண்ணோட்டம்', to: '/startnet-x', match: ['/startnet-x/founders', '/startnet-x/updates'] },
      { label: 'Modules', labelTa: 'தொகுதிகள்', to: '/startnet-x/modules', match: ['/startnet-x/agents'] },
      { label: 'Pricing', labelTa: 'கட்டணம்', to: '/startnet-x/pricing' },
      {
        // No organisations hub exists: the item opens the first buyer page and stays lit on all five.
        label: 'For organisations',
        labelTa: 'அமைப்புகளுக்கு',
        to: '/startnet-x/institutions',
        match: ['/startnet-x/institutions', '/startnet-x/incubators', '/startnet-x/gccs', '/startnet-x/government', '/startnet-x/investors'],
      },
      { label: 'Trust', labelTa: 'நம்பிக்கை', to: '/startnet-x/trust' },
      { label: 'Developers', labelTa: 'டெவலப்பர்கள்', to: '/startnet-x/developers' },
    ],
    cta: { label: 'Create your free profile', labelTa: 'உங்கள் இலவச சுயவிவரத்தை உருவாக்குங்கள்', shortLabel: 'Free profile', shortLabelTa: 'இலவச சுயவிவரம்', snx: '/signup' },
  },
};

export const TALENT_BRANDS = ['research', 'vibe', 'connect', 'women'].map((k) => BRANDS[k]);

/**
 * The brand CTA for a (language-stripped) path: a `cta.byPath` override when one matches, else the brand default.
 * Returns a copy without `byPath`, so callers can spread it safely.
 */
export function brandCtaFor(brandKey, basePath = '') {
  const cta = BRANDS[brandKey]?.cta;
  if (!cta) return null;
  const { byPath, ...base } = cta;
  const hit = byPath?.[basePath] || byPath?.[basePath.replace(/\/+$/, '')];
  return hit ? { ...hit } : base;
}
