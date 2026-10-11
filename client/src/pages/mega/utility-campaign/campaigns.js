// Campaign landings for /go/:slug (Book 1 Part B §2.2 "Campaign landings", T16, P1; Book 3 Part B §4 T16 + C13).
// Every user-visible string is a pair [English, Tamil]. Copy is Book 2 §5.2 (Vibathon 2027) and §3.2 (Vibe),
// verbatim where it exists. Tamil follows Book 2 §14 where a draft exists; other Tamil lines are drafts
// pending native review (Book 2 §14 status note). Bracketed text renders as a placeholder chip (InlineMarks).
import { snxLink } from '../../../lib/links.js';

export const PH = '[placeholder — to be supplied by StartNet]';

/**
 * Campaign record:
 *  brand            accent key for data-brand (null = masterbrand)
 *  seoTitle, seoDescription, eyebrow (endorsement line), h1, lede, microcopy
 *  deadline         { opens, closes } ISO strings or null (null → placeholder, never a number)
 *  cta              { label, snx (StartNet X path), src } — the ONE campaign action
 *  whatsapp         { text, label } — the M04 secondary (WhatsApp) action
 *  benefits[3]      { id, title, body }
 *  tracks           { title, note, items[{ id, title, body }] } | null
 *  dates            { title, note, items[{ id, stage, when|null, what }] } | null
 *  next             { title, items[{ id, title, body, metricKey? }] } | null
 *  proof            { title, keys[], fallback[], text{}, footnote } — metric keys from /api/metrics (fallback = Book
 *                   figures; text[key] = { label, note?, asAtLabel? } Tamil overrides for the English-only API text)
 *  faq              [{ id, q, a }]
 *  closing          { title, body }
 *  related          { label, to } | null — quiet "full details" link
 */
export const CAMPAIGNS = {
  'vibathon-2027': {
    brand: 'vibe',
    // SEO-TA: pending native review (Tamil title/description shortened to fit 60 / 155 chars).
    seoTitle: ["Vibathon 2027: Tamil Nadu's AI build hackathon", 'Vibathon 2027: தமிழ்நாட்டின் AI ஹேக்கத்தான்'],
    seoDescription: [
      'Build with AI, from your district to the state finale. Free to ₹499 per team. Five tracks, an industry jury and a direct route into Vibe Launchpad.',
      'மாவட்டத்திலிருந்து மாநில இறுதிப் போட்டி வரை, AI உதவியுடன் உருவாக்குங்கள். ஒரு குழுவுக்கு இலவசம் முதல் ₹499 வரை. ஐந்து பிரிவுகள், Vibe Launchpad-க்கு நேரடி வழி.',
    ],
    eyebrow: ['a StartNet Vibe programme', 'StartNet Vibe வழங்கும் திட்டம்'],
    h1: 'Vibathon 2027',
    lede: [
      'Build something people use, with AI, in a weekend. Start in your district, finish at the state finale, and leave with a route into Vibe Launchpad.',
      'ஒரே வார இறுதியில், AI உதவியுடன், மக்கள் பயன்படுத்தும் ஒன்றை உருவாக்குங்கள். உங்கள் மாவட்டத்தில் தொடங்கி, மாநில இறுதிப் போட்டியில் முடித்து, Vibe Launchpad-க்கான வழியுடன் வெளியேறுங்கள்.',
    ],
    microcopy: [
      'Teams of 2–4 [confirm]. Any college in Tamil Nadu. Registration: free to ₹499 per team [placeholder — final fee].',
      'குழுவுக்கு 2–4 பேர் [confirm]. தமிழ்நாட்டின் எந்தக் கல்லூரியும். பதிவுக் கட்டணம்: ஒரு குழுவுக்கு இலவசம் முதல் ₹499 வரை [placeholder — final fee].',
    ],
    deadline: { opens: null, closes: null },
    cta: {
      label: ['Register your team', 'உங்கள் குழுவைப் பதிவு செய்யுங்கள்'],
      snx: '/events/vibathon-2027/register',
      src: 'go-vibathon-2027',
    },
    whatsapp: {
      text: 'VIBATHON',
      label: ['Join the Vibathon WhatsApp channel', 'Vibathon WhatsApp சேனலில் இணையுங்கள்'],
    },
    benefits: [
      {
        id: 'build',
        title: ['Build', 'உருவாக்குங்கள்'],
        body: [
          'A [12-hour, confirm 2027 format] build sprint with AI tools. Judged on what works, not on slides.',
          'AI கருவிகளுடன் ஒரு [12-hour, confirm 2027 format] உருவாக்கப் போட்டி. ஸ்லைடுகளை அல்ல, உண்மையில் வேலை செய்வதையே மதிப்பிடுவோம்.',
        ],
      },
      {
        id: 'compete',
        title: ['Compete', 'போட்டியிடுங்கள்'],
        body: ['District qualifiers, then a state finale.', 'முதலில் மாவட்டத் தகுதிச் சுற்றுகள், பின்னர் மாநில இறுதிப் போட்டி.'],
      },
      {
        id: 'continue',
        title: ['Continue', 'தொடருங்கள்'],
        body: [
          "Winners get a guaranteed interview for Vibe Launchpad's 12-week pre-incubation.",
          'வெற்றியாளர்களுக்கு Vibe Launchpad-இன் 12 வார முன்-இன்குபேஷன் திட்டத்தில் நேர்காணல் உறுதி.',
        ],
      },
    ],
    tracks: {
      title: ['Tracks', 'பிரிவுகள்'],
      note: ['[proposed — confirm the 2027 track list and track partners]', '[proposed — confirm the 2027 track list and track partners]'],
      items: [
        {
          id: 'ai-tn',
          title: ['AI for Tamil Nadu', 'தமிழ்நாட்டுக்கான AI'],
          body: ['Tools in Tamil and other Indian languages for real local users', 'உண்மையான உள்ளூர் பயனர்களுக்காக, தமிழிலும் பிற இந்திய மொழிகளிலும் கருவிகள்'],
        },
        {
          id: 'health',
          title: ['Health', 'உடல்நலம்'],
          body: ['Products for patients, clinics and community health workers', 'நோயாளிகள், மருத்துவமனைகள், சமூக சுகாதாரப் பணியாளர்களுக்கான தயாரிப்புகள்'],
        },
        {
          id: 'climate',
          title: ['Climate', 'காலநிலை'],
          body: ['Energy, water, waste and climate resilience', 'ஆற்றல், நீர், கழிவு மேலாண்மை, காலநிலை மீள்திறன்'],
        },
        {
          id: 'gcc',
          title: ['GCC problem statements', 'GCC சிக்கல் அறிக்கைகள்'],
          body: [
            'Real problems set by Global Capability Centres [placeholder — sponsors]',
            'Global Capability Centres வழங்கும் உண்மையான சிக்கல்கள் [placeholder — sponsors]',
          ],
        },
        {
          id: 'business-plan',
          title: ['Business-plan track', 'வணிகத் திட்டப் பிரிவு'],
          body: [
            'For teams with a strong idea and a customer plan, judged on validation evidence',
            'வலுவான யோசனையும் வாடிக்கையாளர் திட்டமும் உள்ள குழுக்களுக்கு; சரிபார்ப்புச் சான்றுகளின் அடிப்படையில் மதிப்பீடு',
          ],
        },
      ],
    },
    dates: {
      title: ['Key dates', 'முக்கியத் தேதிகள்'],
      note: ['[all dates — to be supplied by StartNet]', '[all dates — to be supplied by StartNet]'],
      items: [
        { id: 'opens', stage: ['Call opens', 'அழைப்பு திறப்பு'], when: null, what: ['Registration opens on StartNet X and WhatsApp', 'StartNet X மற்றும் WhatsApp-இல் பதிவு தொடங்கும்'] },
        {
          id: 'warmups',
          stage: ['Vibe Campus warm-ups', 'Vibe Campus பயிற்சி நிகழ்வுகள்'],
          when: null,
          what: ['Build nights at host colleges; free starter course on Vibe Academy', 'நடத்தும் கல்லூரிகளில் build nights; Vibe Academy-இல் இலவச தொடக்கப் பாடநெறி'],
        },
        { id: 'closes', stage: ['Registration closes', 'பதிவு நிறைவு'], when: null, what: ['Team details and track choice locked', 'குழு விவரங்களும் பிரிவுத் தேர்வும் இறுதி செய்யப்படும்'] },
        {
          id: 'qualifiers',
          stage: ['District qualifiers', 'மாவட்டத் தகுதிச் சுற்றுகள்'],
          when: null,
          what: ['Qualifiers in [number] districts [placeholder]', '[number] மாவட்டங்களில் தகுதிச் சுற்றுகள் [placeholder]'],
        },
        {
          id: 'finale',
          stage: ['State finale', 'மாநில இறுதிப் போட்டி'],
          when: null,
          what: [
            'Finalists build and demo to the industry jury, at [venue placeholder]',
            'இறுதிப் போட்டியாளர்கள் [venue placeholder]-இல் தொழில்துறை நடுவர் குழுவின் முன் உருவாக்கிக் காட்டுவார்கள்',
          ],
        },
        {
          id: 'interviews',
          stage: ['Launchpad interviews', 'Launchpad நேர்காணல்கள்'],
          when: null,
          what: [
            'Winners and jury picks interview for Vibe Launchpad',
            'வெற்றியாளர்களும் நடுவர்கள் தேர்ந்தெடுத்தவர்களும் Vibe Launchpad-க்கு நேர்காணல் செய்யப்படுவார்கள்',
          ],
        },
      ],
    },
    next: {
      title: ['Prizes and what comes next', 'பரிசுகளும் அடுத்த கட்டமும்'],
      items: [
        {
          id: 'prize-pool',
          title: ['Prize pool', 'பரிசுத் தொகை'],
          body: [PH, PH],
          metricKey: 'vibathon-2025-prize-pool',
          metricLead: ['For reference, the 2025 pool:', 'ஒப்பீட்டுக்கு, 2025 பரிசுத் தொகை:'],
        },
        {
          id: 'seed',
          title: ['Seed support', 'தொடக்க நிதி ஆதரவு'],
          body: ['[placeholder — terms and provider to be confirmed]', '[placeholder — terms and provider to be confirmed]'],
        },
        {
          id: 'launchpad',
          title: ['Vibe Launchpad', 'Vibe Launchpad'],
          body: ['Guaranteed interview for winning teams', 'வெற்றி பெறும் குழுக்களுக்கு நேர்காணல் உறுதி'],
        },
        {
          id: 'certificates',
          title: ['Certificates', 'சான்றிதழ்கள்'],
          body: [
            '"Shipped" certificates on StartNet X for every team that demos a working product',
            'வேலை செய்யும் தயாரிப்பைக் காட்டும் ஒவ்வொரு குழுவுக்கும் StartNet X-இல் "shipped" சான்றிதழ்',
          ],
        },
      ],
    },
    proof: {
      title: ['Vibathon so far', 'இதுவரை Vibathon'],
      keys: ['vibathon-2025-tier-3-4-colleges', 'vibathon-2025-participants', 'vibathon-2027-host-colleges-target', 'vibathon-2027-participants-target'],
      // Book 2 §3.2 proof band and the seeded planning targets; used only if /api/metrics is unavailable.
      fallback: [
        { id: 'vibathon-2025-tier-3-4-colleges', key: 'vibathon-2025-tier-3-4-colleges', value: 80, unit: '%', label: 'of colleges reached by Vibathon 2025 were Tier 3 or 4', tag: 'B', asAt: 'Vibathon 2025', source: 'Vibathon 2025 brochure' },
        { id: 'vibathon-2025-participants', key: 'vibathon-2025-participants', value: null, label: 'Vibathon 2025 participants', tag: 'B', asAt: null, source: 'Vibathon 2025 final attendance', note: 'The 2025 brochure gave "1,000+ expected participants". That is not an actual figure and is not published as one.' },
      ],
      // Tamil for the English-only /api/metrics label, note and as-at text (drafts pending native review).
      text: {
        'vibathon-2025-tier-3-4-colleges': {
          label: ['of colleges reached by Vibathon 2025 were Tier 3 or 4', 'Vibathon 2025 சென்றடைந்த கல்லூரிகளில் Tier 3 அல்லது Tier 4 கல்லூரிகள்'],
        },
        'vibathon-2025-participants': {
          label: ['Vibathon 2025 participants', 'Vibathon 2025 பங்கேற்பாளர்கள்'],
          note: [
            'The 2025 brochure gave "1,000+ expected participants". That is not an actual figure and is not published as one.',
            '2025 கையேட்டில் "1,000+ பங்கேற்பாளர்கள் எதிர்பார்க்கப்படுகிறார்கள்" என்று குறிப்பிடப்பட்டிருந்தது. அது உண்மையான எண்ணிக்கை அல்ல; அவ்வாறு வெளியிடப்படுவதும் இல்லை.',
          ],
        },
        'vibathon-2027-host-colleges-target': {
          label: ['host colleges for Vibathon 2027', 'Vibathon 2027-ஐ நடத்தும் கல்லூரிகள்'],
          asAtLabel: ['Target · blueprint', 'இலக்கு · திட்ட வரைவு'],
        },
        'vibathon-2027-participants-target': {
          label: ['Vibathon 2027 participants', 'Vibathon 2027 பங்கேற்பாளர்கள்'],
          asAtLabel: ['Target · blueprint', 'இலக்கு · திட்ட வரைவு'],
        },
        'vibathon-2025-prize-pool': {
          label: ['Vibathon 2025 prize pool', 'Vibathon 2025 பரிசுத் தொகை'],
        },
      },
      footnote: [
        'A = verified · B = claimed, checked but not independently verified · C = estimate or target, never summed with A or B. Tap a tag for its source.',
        'A = சரிபார்க்கப்பட்டது · B = கூறப்பட்டது, சரிபார்த்தது ஆனால் தனிப்பட்ட முறையில் உறுதிசெய்யப்படவில்லை · C = மதிப்பீடு அல்லது இலக்கு; A அல்லது B உடன் ஒருபோதும் கூட்டப்படாது. மூலத்தைப் பார்க்க ஒரு குறியைத் தொடுங்கள்.',
      ],
    },
    faq: [
      {
        id: 'who',
        q: ['Who can take part?', 'யார் பங்கேற்கலாம்?'],
        a: [
          'Students enrolled in any college or university in Tamil Nadu. [confirm whether recent graduates are eligible]',
          'தமிழ்நாட்டில் உள்ள எந்தக் கல்லூரி அல்லது பல்கலைக்கழகத்திலும் பயிலும் மாணவர்கள். [confirm whether recent graduates are eligible]',
        ],
      },
      {
        id: 'code',
        q: ['Do I need to know how to code?', 'எனக்கு கோடிங் தெரிந்திருக்க வேண்டுமா?'],
        a: [
          'No. You need to build something that works. AI tools help, and the free starter course on Vibe Academy shows you how.',
          'தேவையில்லை. வேலை செய்யும் ஒன்றை நீங்கள் உருவாக்க வேண்டும், அவ்வளவுதான். AI கருவிகள் உதவும்; Vibe Academy-இன் இலவச தொடக்கப் பாடநெறி எப்படி என்று காட்டும்.',
        ],
      },
      {
        id: 'cost',
        q: ['How much does it cost?', 'கட்டணம் எவ்வளவு?'],
        a: [
          'Free to ₹499 per team [placeholder — final fee]. Fee waivers are available on request. [confirm]',
          'ஒரு குழுவுக்கு இலவசம் முதல் ₹499 வரை [placeholder — final fee]. கேட்டால் கட்டண விலக்கு கிடைக்கும். [confirm]',
        ],
      },
      {
        id: 'tamil',
        q: ['Can I take part in Tamil?', 'தமிழில் பங்கேற்கலாமா?'],
        a: ['Yes. You can present in Tamil or English.', 'ஆம். தமிழிலோ ஆங்கிலத்திலோ நீங்கள் வழங்கலாம்.'],
      },
      {
        id: 'team',
        q: ['Do I need a full team?', 'முழுக் குழு தேவையா?'],
        a: [
          "No. Register on your own and we'll help you find teammates through StartNet X.",
          'தேவையில்லை. தனியாகப் பதிவு செய்யுங்கள்; StartNet X மூலம் குழு உறுப்பினர்களைக் கண்டறிய நாங்கள் உதவுவோம்.',
        ],
      },
      {
        id: 'ip',
        q: ['Who owns what we build?', 'நாங்கள் உருவாக்குவது யாருக்குச் சொந்தம்?'],
        a: [
          'Your team does. Sponsors receive no rights to your work unless you agree separately in writing.',
          'உங்கள் குழுவுக்கே. நீங்கள் தனியாக எழுத்துமூலம் ஒப்புக்கொண்டால் ஒழிய, ஸ்பான்சர்களுக்கு உங்கள் படைப்பின் மீது எந்த உரிமையும் இல்லை.',
        ],
      },
      {
        id: 'under-18',
        q: ["I'm under 18. Can I join?", 'எனக்கு 18 வயது ஆகவில்லை. நான் சேரலாமா?'],
        a: [
          "You can, with verifiable consent from a parent or guardian. We'll send them a link when you register.",
          'சேரலாம், பெற்றோர் அல்லது பாதுகாவலரின் சரிபார்க்கக்கூடிய ஒப்புதலுடன். நீங்கள் பதிவு செய்யும்போது அவர்களுக்கு ஓர் இணைப்பை அனுப்புவோம்.',
        ],
      },
      {
        id: 'after',
        q: ['What happens after?', 'அதன் பிறகு என்ன?'],
        a: [
          'Every team gets a StartNet X profile with its project. Winners interview for Vibe Launchpad.',
          'ஒவ்வொரு குழுவுக்கும் அதன் திட்டத்துடன் ஒரு StartNet X சுயவிவரம் கிடைக்கும். வெற்றியாளர்கள் Vibe Launchpad-க்கு நேர்காணல் செய்யப்படுவார்கள்.',
        ],
      },
      {
        id: 'updates',
        q: ['How do I get updates?', 'தகவல்களை எப்படிப் பெறுவது?'],
        a: [
          'Join the Vibathon WhatsApp channel or turn on email alerts.',
          'Vibathon WhatsApp சேனலில் இணையுங்கள் அல்லது மின்னஞ்சல் அறிவிப்புகளை இயக்குங்கள்.',
        ],
      },
    ],
    // Closing headline: the first clause of the Book 2 §5.2 sub-head. ("Your first step is free." from §3.2 is not
    // used here: Vibathon registration may cost up to ₹499 per team, so the line would read as a fee claim.)
    closing: {
      title: ['Build something people use, with AI.', 'AI உதவியுடன், மக்கள் பயன்படுத்தும் ஒன்றை உருவாக்குங்கள்.'],
      body: [
        'Register on your own or as a team. Any college in Tamil Nadu, in Tamil or English.',
        'தனியாகவோ குழுவாகவோ பதிவு செய்யுங்கள். தமிழ்நாட்டின் எந்தக் கல்லூரியும், தமிழிலோ ஆங்கிலத்திலோ.',
      ],
    },
    related: { label: ['Full details on the Vibathon page', 'Vibathon பக்கத்தில் முழு விவரங்கள்'], to: '/vibe/vibathon' },
  },
};

export const CAMPAIGN_SLUGS = Object.keys(CAMPAIGNS);

export const getCampaign = (slug) => (slug && Object.prototype.hasOwnProperty.call(CAMPAIGNS, slug) ? CAMPAIGNS[slug] : null);

const UTM = /^utm_(source|medium|campaign|term|content)$/;

/** utm_* parameters from a query string, safe to forward to StartNet X. */
export function utmFrom(search) {
  const out = {};
  try {
    new URLSearchParams(search || '').forEach((v, k) => {
      if (UTM.test(k) && v && v.length <= 100) out[k] = v;
    });
  } catch {
    /* ignore malformed query strings */
  }
  return out;
}

/** The campaign's single StartNet X action URL (src = go-<slug>, brand, lang, utm_* forwarded). */
export function campaignCtaHref(campaign, lang = 'en', extra = {}) {
  if (!campaign?.cta) return null;
  return snxLink(campaign.cta.snx, { src: campaign.cta.src, brand: campaign.brand || undefined, lang, ...extra });
}

/**
 * For the integrator's bottom CTA bar: { label, href } for a slug, or null. `search` is the page's query string
 * (useLocation().search) so the bar forwards the same utm_* as the hero CTA; when omitted, the current
 * window.location.search is used (browser only).
 */
export function campaignBottomCta(slug, lang = 'en', search) {
  const c = getCampaign(slug);
  if (!c) return null;
  const qs = search !== undefined ? search : typeof window !== 'undefined' ? window.location?.search || '' : '';
  return { label: lang === 'ta' ? c.cta.label[1] : c.cta.label[0], href: campaignCtaHref(c, lang, utmFrom(qs)) };
}
