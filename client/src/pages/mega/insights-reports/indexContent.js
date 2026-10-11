// Content map for /insights/indices/:index. Sources: Book 1 Part B §2.2 ("Indices … Named, quotable frameworks · Institutions, media ·
// See your institution · P3"), §1 calendar (Campus Innovation Index, Oct 2027), Book 2 §4 (Institution Partner Programme: "a Campus
// Innovation Index score"; Lab-to-Market Summit: "we launch the TN Research Commercialisation Index"), Book 2 §6.1 ("Planned. We'll
// publish the method before the first edition."), server/data/reports.json (status labels).
// Anything the books do not state (indicators, weights, scores, dates) is a placeholder. "Scope" lists are the questions each index
// is set up to answer, worded from the books; the indicators themselves come with the published method.

export const INDEX_CONTENT = {
  'campus-innovation-index': {
    name: 'Campus Innovation Index',
    short: ['Institutions', 'கல்வி நிறுவனங்கள்'],
    art: 'grid',
    seed: 41,
    audience: ['Colleges, universities and the media', 'கல்லூரிகள், பல்கலைக்கழகங்கள், ஊடகங்கள்'],
    lede: [
      'A score for institutions on the founders they produce, part of the Institution Partner Programme.',
      'கல்வி நிறுவனங்கள் உருவாக்கும் நிறுவனர்களின் அடிப்படையில் அவற்றுக்கான மதிப்பெண்; Institution Partner Programme-இன் ஒரு பகுதி.',
    ],
    hook: ['Measure your institution by the founders it produces.', 'உங்கள் நிறுவனத்தை, அது உருவாக்கும் நிறுவனர்களைக் கொண்டு அளவிடுங்கள்.'],
    scope: [
      ['How many students and faculty start on the founder ladder through the institution.', 'அந்த நிறுவனத்தின் வழியாக எத்தனை மாணவர்களும் ஆசிரியர்களும் நிறுவனர் ஏணியில் அடியெடுத்து வைக்கிறார்கள்.'],
      ['How many of them go on to build, launch and fund companies (L4 to L6).', 'அவர்களில் எத்தனை பேர் நிறுவனங்களை உருவாக்கி, தொடங்கி, நிதி பெறுகிறார்கள் (L4 முதல் L6 வரை).'],
      ['What the institution has in place to support them: policy, IP committee and faculty development.', 'அவர்களுக்கு ஆதரவாக நிறுவனத்தில் என்ன உள்ளது: கொள்கை, அறிவுசார் சொத்துக் குழு, ஆசிரியர் மேம்பாடு.'],
    ],
    unit: ['Institution', 'கல்வி நிறுவனம்'],
    context: ['tn-higher-education-ger', 'institutions-worked-with'],
    related: { en: 'Institution Partner Programme', ta: 'Institution Partner Programme', to: '/partner/institutions' },
    primary: { en: 'Book a consultation', ta: 'ஆலோசனைக்கு நேரம் பதிவு செய்யுங்கள்', to: '/partner/institutions' },
  },
  'research-commercialisation-index': {
    name: 'TN Research Commercialisation Index',
    short: ['Research', 'ஆராய்ச்சி'],
    art: 'network',
    seed: 57,
    audience: ['Research institutions, government and the media', 'ஆராய்ச்சி நிறுவனங்கள், அரசு, ஊடகங்கள்'],
    lede: [
      'How research in Tamil Nadu turns into companies, pilots and first customers. Launched at the Lab-to-Market Summit.',
      'தமிழ்நாட்டின் ஆராய்ச்சி எப்படி நிறுவனங்களாகவும், முன்னோட்டத் திட்டங்களாகவும், முதல் வாடிக்கையாளர்களாகவும் மாறுகிறது. Lab-to-Market Summit-இல் அறிமுகமாகிறது.',
    ],
    hook: ['Where lab teams meet their first customers.', 'ஆய்வகக் குழுக்கள் தங்கள் முதல் வாடிக்கையாளர்களைச் சந்திக்கும் இடம்.'],
    scope: [
      ['How many research teams take a problem statement to a proof of concept.', 'எத்தனை ஆராய்ச்சிக் குழுக்கள் ஒரு சிக்கல் அறிக்கையை கருத்துச் சான்று (proof of concept) வரை கொண்டு செல்கின்றன.'],
      ['How many research-based companies are registered.', 'ஆராய்ச்சி அடிப்படையிலான எத்தனை நிறுவனங்கள் பதிவு செய்யப்படுகின்றன.'],
      ['How many lab teams sign pilots or first customers with GCCs, industry and government.', 'எத்தனை ஆய்வகக் குழுக்கள் GCC-கள், தொழில்துறை, அரசுடன் முன்னோட்டம் அல்லது முதல் வாடிக்கையாளர் ஒப்பந்தம் செய்கின்றன.'],
    ],
    unit: ['Institution', 'கல்வி நிறுவனம்'],
    context: ['tn-phd-enrolments', 'research-partner-institutions'],
    related: { en: 'Lab-to-Market Summit', ta: 'Lab-to-Market Summit', to: '/research/lab-to-market-summit' },
    primary: { en: 'Register interest in the Summit', ta: 'Summit-இல் ஆர்வத்தைப் பதிவு செய்யுங்கள்', to: '/research/lab-to-market-summit' },
  },
  'founder-readiness-index': {
    name: 'Founder Readiness Index',
    short: ['Founders', 'நிறுவனர்கள்'],
    art: 'ladder',
    seed: 63,
    audience: ['Founders, institutions and the media', 'நிறுவனர்கள், கல்வி நிறுவனங்கள், ஊடகங்கள்'],
    lede: [
      "Planned. We'll publish the method before the first edition.",
      'திட்டமிடப்பட்டுள்ளது. முதல் பதிப்புக்கு முன் முறையியலை வெளியிடுவோம்.',
    ],
    hook: null,
    scope: null,
    unit: null,
    context: [],
    related: { en: 'The founder ladder', ta: 'நிறுவனர் ஏணி', to: '/about/how-we-work' },
    primary: null,
  },
};
