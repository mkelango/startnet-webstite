// Tamil for the figures shown on Home and /join. The API (and the book fallbacks in homeMetrics.js)
// carry English labels only, so the Tamil is keyed by the exact English text: an unknown or changed
// label simply stays in English instead of showing a mismatched translation.
// DRAFT Tamil (Book 2 §14 status): native Tamil review pending before launch.

const TA_LABELS = {
  'founders nurtured (L2+) to date': 'இதுவரை வளர்த்தெடுக்கப்பட்ட நிறுவனர்கள் (L2+)',
  'events run since 2023': '2023 முதல் நடத்தப்பட்ட நிகழ்வுகள்',
  'of colleges reached by Vibathon 2025 were Tier 3 or 4': 'Vibathon 2025 சென்றடைந்த கல்லூரிகளில் Tier 3 அல்லது 4 கல்லூரிகள்',
  "colleges and institutions we've worked with": 'நாங்கள் இணைந்து பணியாற்றிய கல்லூரிகள் மற்றும் நிறுவனங்கள்',
  'DPIIT-recognised startups in Tamil Nadu': 'தமிழ்நாட்டில் DPIIT அங்கீகாரம் பெற்ற ஸ்டார்ட்அப்கள்',
  'of them are women-led (7,572)': 'அவற்றில் பெண்கள் தலைமையிலானவை (7,572)',
  'of 15,037 DPIIT-recognised startups in Tamil Nadu are women-led': 'தமிழ்நாட்டின் 15,037 DPIIT அங்கீகாரம் பெற்ற ஸ்டார்ட்அப்களில் பெண்கள் தலைமையிலானவை',
  'Global Capability Centres in the state': 'மாநிலத்தில் உள்ள Global Capability Centres',
  'higher-education GER, the highest in India': 'உயர்கல்வி GER, இந்தியாவிலேயே மிக அதிகம்',
  "of TN's startups are outside Chennai, Coimbatore and Kancheepuram": 'தமிழ்நாட்டு ஸ்டார்ட்அப்களில் சென்னை, கோயம்புத்தூர், காஞ்சிபுரத்துக்கு வெளியே உள்ளவை',
  'founders and aspiring founders nurtured in Tamil Nadu by March 2031': 'மார்ச் 2031-க்குள் தமிழ்நாட்டில் வளர்த்தெடுக்கப்படும் நிறுவனர்கள் மற்றும் நிறுவனராக விரும்புவோர்',
  'founders and aspiring founders nurtured by 2040': '2040-க்குள் வளர்த்தெடுக்கப்படும் நிறுவனர்கள் மற்றும் நிறுவனராக விரும்புவோர்',
  'by 2040': '2040-க்குள்',
  'PhD enrolments in Tamil Nadu institutions': 'தமிழ்நாட்டுக் கல்வி நிறுவனங்களில் PhD சேர்க்கைகள்',
  'Startups launched (L5), cumulative': 'தொடங்கப்பட்ட ஸ்டார்ட்அப்கள் (L5), மொத்தம்',
  'Capital raised by StartNet founders': 'StartNet நிறுவனர்கள் திரட்டிய மூலதனம்',
  'Pilots and contracts signed': 'கையெழுத்தான பைலட்கள் மற்றும் ஒப்பந்தங்கள்',
  'Share of participants who are women': 'பங்கேற்பாளர்களில் பெண்களின் பங்கு',
  'Districts with active programmes': 'திட்டங்கள் நடைபெறும் மாவட்டங்கள்',
  'Colleges active': 'செயல்பாட்டில் உள்ள கல்லூரிகள்',
  'Partner institutions': 'கூட்டாளர் கல்வி நிறுவனங்கள்',
  'Women Circles active': 'செயல்பாட்டில் உள்ள Women Circles',
};

const TA_NOTES = {
  'Tag A or B to be set by the evidence committee when the figure is supplied. L2 = a StartNet X profile plus at least two meaningful touchpoints.':
    'எண் வழங்கப்படும்போது A அல்லது B குறிச்சொல்லை evidence committee தீர்மானிக்கும். L2 = ஒரு StartNet X சுயவிவரமும் குறைந்தது இரண்டு அர்த்தமுள்ள தொடர்புகளும்.',
  'DPIIT counts a startup as women-led if it has at least one woman director.':
    'குறைந்தது ஒரு பெண் இயக்குநர் இருந்தால், DPIIT அந்த ஸ்டார்ட்அப்பைப் பெண்கள் தலைமையிலானதாகக் கணக்கிடுகிறது.',
  '"Nurtured" means a StartNet X profile plus at least two meaningful programme touchpoints. Checkpoint review in 2028.':
    '"வளர்த்தெடுக்கப்பட்டவர்" என்றால் ஒரு StartNet X சுயவிவரமும் குறைந்தது இரண்டு அர்த்தமுள்ள திட்டத் தொடர்புகளும். 2028-இல் இடைநிலை மதிப்பாய்வு.',
  'Target, not an outcome.': 'இலக்கு, விளைவு அல்ல.',
  'Figure and as-at date to be supplied by StartNet.': 'எண்ணையும் நிலவரத் தேதியையும் StartNet வழங்கும்.',
  'Reported against a 40% floor [C].': '40% குறைந்தபட்ச அளவுக்கு எதிராக அறிவிக்கப்படுகிறது [C].',
};

/** A metric with its label/note in the page language (explicit labelTa/noteTa from the API win). */
export function localizeMetric(m, lang) {
  if (!m || lang !== 'ta') return m;
  const label = m.labelTa || TA_LABELS[m.label];
  const note = m.noteTa || (m.note ? TA_NOTES[m.note] : undefined);
  if (!label && !note) return m;
  return { ...m, ...(label ? { label } : {}), ...(note ? { note } : {}) };
}

/** `field` in the page language from API data: `${field}Ta` (or `${field}_ta`) on /ta when present. */
export function pickLang(obj, field, lang) {
  if (!obj) return undefined;
  if (lang === 'ta') {
    const ta = obj[`${field}Ta`] ?? obj[`${field}_ta`];
    if (ta) return ta;
  }
  return obj[field];
}

/** Placeholder register marker text (Book 2 Appendix A) in the page language. */
export const placeholderText = (t, extra) => (extra
  ? t(`[placeholder — to be supplied by StartNet: ${extra.en}]`, `[இடநிரப்பி — StartNet வழங்கும்: ${extra.ta}]`)
  : t('[placeholder — to be supplied by StartNet]', '[இடநிரப்பி — StartNet வழங்கும்]'));
