// Tamil fallbacks for brand copy shown on the about pages (draft, pending native review).
// data/brands.js is owned elsewhere: a `labelTa` / `promiseTa` supplied there always wins over these.

const SUB_TA = {
  '/research/labs': 'ஆய்வகங்கள்',
  '/research/fellowship': 'Fellowship',
  '/research/lab-to-market-summit': 'Lab-to-Market Summit',
  '/research/institution-partner-programme': 'கல்வி நிறுவனங்கள்',
  '/research/problem-statements': 'சிக்கல் அறிக்கைகள்',
  '/research/terms': 'விதிமுறைகள்',
  '/vibe/vibathon': 'Vibathon',
  '/vibe/academy': 'Academy',
  '/vibe/campus': 'வளாகம்',
  '/vibe/launchpad': 'Launchpad',
  '/vibe/clubs': 'கிளப்புகள்',
  '/vibe/for-colleges': 'கல்லூரிகளுக்கு',
  '/connect/series': 'Connect Series',
  '/connect/circles': 'வட்டங்கள்',
  '/connect/founder-switch': 'Founder Switch',
  '/connect/scale': 'Scale',
  '/connect/angels': 'Angels',
  '/events?brand=connect': 'நிகழ்வுகள்',
  '/women/circles': 'வட்டங்கள்',
  '/women/rise-academy': 'Rise Academy',
  '/women/hercapital': 'HerCapital',
  '/women/summit': 'Summit & Awards',
  '/insights/stories?brand=women': 'கதைகள்',
};

const PROMISE_TA = {
  research: 'உங்கள் ஆய்வை, உங்கள் கல்வி நிறுவனம் கையெழுத்திடக்கூடிய நிலையான விதிமுறைகளில், நீங்களும் இணை உரிமையாளராக இருக்கும் நிறுவனமாக மாற்றுங்கள்.',
  vibe: 'கல்லூரியிலேயே AI கொண்டு, தமிழிலோ ஆங்கிலத்திலோ உருவாக்குங்கள்; ஒரு தயாரிப்பு, ஒரு குழு, அடுத்த அடியுடன் வெளியேறுங்கள்.',
  connect: 'உங்கள் துறையில், தொடங்கவோ மாறவோ வளரவோ உதவக்கூடியவர்களை, அதற்கென்றே அமைக்கப்பட்ட அரங்குகளில் சந்தியுங்கள்.',
  women: 'தொழில் உரிமையாளரிலிருந்து முதலீட்டுக்குத் தகுதியான நிறுவனர் வரை: முதலில் சந்தை அணுகல், பிறகு மூலதனம்.',
};

/** Localised sub-nav label for a brand link. */
export const subLabel = (s, t) => t(s.label, s.labelTa || SUB_TA[s.to]);

/** Localised brand promise. */
export const brandPromise = (b, t) => t(b.promise, b.promiseTa || PROMISE_TA[b.key]);
