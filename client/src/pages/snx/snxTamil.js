// Tamil drafts for the StartNet X pages, keyed by the English master string in snxContent.js and the pages.
// STATUS: DRAFT, native Tamil copywriter review pending (Book 2 §14). Lines marked "Book 2 §14" are the book's own drafts.
// Brand, programme, plan and module names (StartNet X, SNX Free/Pro/Team/Scale, Events, Learn, Circles, Founder Ledger,
// Vibathon …) stay in Latin script. Prices keep Latin digits (₹499/மாதம்).
import { useLang } from '../../lib/i18n.jsx';

export const SNX_TA = {
  /* ---- Shared CTAs (Book 2 §14.3) ---- */
  'Create your free profile': 'உங்கள் இலவச சுயவிவரத்தை உருவாக்குங்கள்',
  'Sign in': 'உள்நுழைக',
  'Talk to us': 'எங்களிடம் பேசுங்கள்',
  'See upcoming events': 'வரவிருக்கும் நிகழ்வுகளைப் பாருங்கள்',
  'Find your programme': 'உங்கள் திட்டத்தைக் கண்டறியுங்கள்',
  'Read the Founder Ledger': 'Founder Ledger-ஐப் படியுங்கள்',
  'Request a demo': 'டெமோ கோருங்கள்',
  'Book a demo': 'டெமோவை முன்பதிவு செய்யுங்கள்',
  'Request a briefing': 'விளக்கக் கூட்டத்தைக் கோருங்கள்',
  'See pricing': 'கட்டணங்களைப் பாருங்கள்',
  'How we handle your data': 'உங்கள் தரவை நாங்கள் எப்படிக் கையாளுகிறோம்',
  'Read the guardrails': 'பாதுகாப்பு வரம்புகளைப் படியுங்கள்',

  /* ---- Shared copy ---- */
  'One profile, from first event to first funding.': 'முதல் நிகழ்விலிருந்து முதல் நிதி வரை, ஒரே சுயவிவரம்.',
  "StartNet X is the platform behind every StartNet programme. You get one profile that remembers what you've done, suggests what's next and stays in your control.":
    'ஒவ்வொரு StartNet திட்டத்தின் பின்னாலும் இருக்கும் தளம் StartNet X. நீங்கள் செய்தவற்றை நினைவில் வைத்து, அடுத்து என்ன என்று பரிந்துரைத்து, உங்கள் கட்டுப்பாட்டிலேயே இருக்கும் ஒரே சுயவிவரம் உங்களுக்குக் கிடைக்கும்.',
  'Free for individuals. Works on your phone, on WhatsApp and in Tamil.':
    'தனிநபர்களுக்கு இலவசம். உங்கள் மொபைலிலும், WhatsApp-இலும், தமிழிலும் இயங்கும்.',
  'Free for talent. Paid for organisations.': 'திறமையாளர்களுக்கு இலவசம். நிறுவனங்களுக்குக் கட்டணம்.',
  'Free for talent. Paid for organisations': 'திறமையாளர்களுக்கு இலவசம். நிறுவனங்களுக்குக் கட்டணம்',
  'Your first step is always free. Pay only when you need more, and organisations pay for the outcomes they want.':
    'உங்கள் முதல் அடி எப்போதும் இலவசம். கூடுதலாகத் தேவைப்படும்போது மட்டும் செலுத்துங்கள்; நிறுவனங்கள் தாங்கள் விரும்பும் விளைவுகளுக்குச் செலுத்துகின்றன.',
  'Run your innovation programme on StartNet X.': 'உங்கள் புத்தாக்கத் திட்டத்தை StartNet X-இல் நடத்துங்கள்.',
  'Annual licences for institutions, GCCs and government.': 'கல்வி நிறுவனங்கள், GCC-கள், அரசுக்கான ஆண்டு உரிமங்கள்.',
  '/month': '/மாதம்',
  '/year': '/ஆண்டு',

  /* ---- Module status ---- */
  Live: 'நேரலையில்',
  'In beta': 'பீட்டாவில்',
  Coming: 'விரைவில்',

  /* ---- Modules (one-liners; module names stay Latin) ---- */
  'One sign-in and profile across all StartNet brands.': 'அனைத்து StartNet பிராண்டுகளுக்கும் ஒரே உள்நுழைவு, ஒரே சுயவிவரம்.',
  'Register, pay and get your QR ticket, even inside WhatsApp.':
    'பதிவு செய்யலாம், பணம் செலுத்தலாம், QR டிக்கெட்டைப் பெறலாம், WhatsApp-இலேயே கூட.',
  'Courses and cohorts with verifiable certificates.': 'சரிபார்க்கக்கூடிய சான்றிதழ்களுடன் படிப்புகளும் கற்றல் குழுக்களும்.',
  'Your chapter, attendance and introductions.': 'உங்கள் கிளை, வருகைப் பதிவு, அறிமுகங்கள்.',
  'Apply to programmes and track milestones.': 'திட்டங்களுக்கு விண்ணப்பித்து, மைல்கற்களைக் கண்காணியுங்கள்.',
  'Data room, investor CRM and grant tracker.': 'தரவு அறை, முதலீட்டாளர் CRM, மானியக் கண்காணிப்பு.',
  'Apply to GCC and government problem statements.': 'GCC மற்றும் அரசின் சிக்கல் அறிக்கைகளுக்கு விண்ணப்பியுங்கள்.',
  'Dashboards and the public Founder Ledger.': 'டாஷ்போர்டுகளும் பொது Founder Ledger-உம்.',
  'An AI Founder Coach, Matchmaker and Grant Navigator that suggest; people decide.':
    'AI Founder Coach, Matchmaker, Grant Navigator பரிந்துரைக்கின்றன; முடிவெடுப்பது மனிதர்களே.',

  /* ---- Trust strip ---- */
  'Your data stays in India. You choose who sees your profile. No automated rejections, ever.':
    'உங்கள் தரவு இந்தியாவிலேயே இருக்கும். உங்கள் சுயவிவரத்தை யார் பார்க்கலாம் என்பதை நீங்களே முடிவு செய்கிறீர்கள். தானியங்கி நிராகரிப்பு ஒருபோதும் இல்லை.',
  'Your data stays in India.': 'உங்கள் தரவு இந்தியாவிலேயே இருக்கும்.',
  'You choose who sees your profile. No automated rejections, ever.':
    'உங்கள் சுயவிவரத்தை யார் பார்க்கலாம் என்பதை நீங்களே முடிவு செய்கிறீர்கள். தானியங்கி நிராகரிப்பு ஒருபோதும் இல்லை.',

  /* ---- Audiences ---- */
  'Founders & learners': 'நிறுவனர்களும் கற்பவர்களும்',
  'Your founder journey, in one place.': 'உங்கள் நிறுவனர் பயணம், ஒரே இடத்தில்.',
  'Free to start. Upgrade only when you need team tools, a data room or investor access.':
    'தொடங்குவது இலவசம். குழுக் கருவிகள், தரவு அறை அல்லது முதலீட்டாளர் அணுகல் தேவைப்படும்போது மட்டும் மேம்படுத்துங்கள்.',
  'What you get free': 'இலவசமாகக் கிடைப்பவை',
  'Profile, events, starter courses, Coach lite.': 'சுயவிவரம், நிகழ்வுகள், தொடக்கப் படிப்புகள், Coach lite.',
  'When to upgrade': 'எப்போது மேம்படுத்துவது',
  'Your data, your choice': 'உங்கள் தரவு, உங்கள் விருப்பம்',
  'You choose who sees your profile.': 'உங்கள் சுயவிவரத்தை யார் பார்க்கலாம் என்பதை நீங்களே முடிவு செய்கிறீர்கள்.',

  Institutions: 'கல்வி நிறுவனங்கள்',
  'A branded space for your students and faculty, with the reporting your IIC and accreditation teams need.':
    'உங்கள் மாணவர்களுக்கும் ஆசிரியர்களுக்கும் உங்கள் பெயரிலான தனி இடம், உங்கள் IIC மற்றும் அங்கீகாரக் குழுக்களுக்குத் தேவையான அறிக்கைகளுடன்.',
  'Branded tenant': 'உங்கள் பெயரிலான தளம்',
  'At x.startnet.in/t/your-institution.': 'x.startnet.in/t/your-institution என்ற முகவரியில்.',
  'Cohorts and reporting': 'கற்றல் குழுக்களும் அறிக்கைகளும்',
  'Cohorts, LMS and IIC/NAAC innovation reporting.': 'கற்றல் குழுக்கள், LMS, IIC/NAAC புத்தாக்க அறிக்கைகள்.',
  'Student seats': 'மாணவர் இடங்கள்',
  'Student Pro seats included.': 'மாணவர்களுக்கான Pro இடங்கள் அடங்கும்.',

  'Incubators & TBIs': 'இன்குபேட்டர்களும் TBI-களும்',
  'Programme CRM, applications and judging, portfolio tracking, Ledger export, investor-day tools.':
    'திட்ட CRM, விண்ணப்பங்களும் மதிப்பீடும், போர்ட்ஃபோலியோ கண்காணிப்பு, Ledger ஏற்றுமதி, முதலீட்டாளர் நாள் கருவிகள்.',
  'Programme CRM': 'திட்ட CRM',
  'Applications and judging.': 'விண்ணப்பங்களும் மதிப்பீடும்.',
  'Portfolio tracking': 'போர்ட்ஃபோலியோ கண்காணிப்பு',
  'Ledger export.': 'Ledger ஏற்றுமதி.',
  'Investor day': 'முதலீட்டாளர் நாள்',
  'Investor-day tools.': 'முதலீட்டாளர் நாள் கருவிகள்.',

  'GCCs & corporates': 'GCC-களும் கார்ப்பரேட்களும்',
  'Problems in. Pilots and talent out.': 'சிக்கல்கள் உள்ளே. பைலட்களும் திறமையாளர்களும் வெளியே.',
  'A challenge board, pilot pipeline and talent access for Global Capability Centres and corporates.':
    'Global Capability Centre-களுக்கும் கார்ப்பரேட் நிறுவனங்களுக்கும் சவால் பலகை, பைலட் வரிசை, திறமையாளர் அணுகல்.',
  'Challenge board': 'சவால் பலகை',
  'Challenge board and pilot tracking.': 'சவால் பலகையும் பைலட் கண்காணிப்பும்.',
  'Opted-in talent': 'ஒப்புதல் அளித்த திறமையாளர்கள்',
  'Opted-in talent from Vibathon, Labs and Founder Switch.': 'Vibathon, Labs, Founder Switch-இலிருந்து ஒப்புதல் அளித்த திறமையாளர்கள்.',
  'Impact reporting': 'தாக்க அறிக்கை',
  'Quarterly innovation-impact report.': 'காலாண்டு புத்தாக்கத் தாக்க அறிக்கை.',

  'Government & districts': 'அரசும் மாவட்டங்களும்',
  'See every founder programme in your district.': 'உங்கள் மாவட்டத்தின் ஒவ்வொரு நிறுவனர் திட்டத்தையும் பாருங்கள்.',
  'Dashboards, scheme pipelines and programme operations for StartupTN, iTNT and district administrations.':
    'StartupTN, iTNT மற்றும் மாவட்ட நிர்வாகங்களுக்கான டாஷ்போர்டுகள், அரசுத் திட்ட வரிசைகள், திட்டச் செயல்பாடுகள்.',
  Dashboards: 'டாஷ்போர்டுகள்',
  'District or state dashboards.': 'மாவட்ட அல்லது மாநில டாஷ்போர்டுகள்.',
  Operations: 'செயல்பாடுகள்',
  'Scheme pipeline and programme operations.': 'அரசுத் திட்ட வரிசையும் திட்டச் செயல்பாடுகளும்.',
  'Open data': 'திறந்த தரவு',
  'Open-data feeds with A/B/C tags.': 'A/B/C குறிச்சொற்களுடன் திறந்த தரவு ஊட்டங்கள்.',

  Investors: 'முதலீட்டாளர்கள்',
  'Curated deal flow, data rooms, syndicate tools, Ledger analytics.':
    'தேர்ந்தெடுத்த முதலீட்டு வாய்ப்புகள், தரவு அறைகள், சிண்டிகேட் கருவிகள், Ledger பகுப்பாய்வு.',
  'Deal flow': 'முதலீட்டு வாய்ப்புகள்',
  'Curated deal flow.': 'தேர்ந்தெடுத்த முதலீட்டு வாய்ப்புகள்.',
  'Data rooms': 'தரவு அறைகள்',
  'Data rooms and syndicate tools.': 'தரவு அறைகளும் சிண்டிகேட் கருவிகளும்.',
  'Ledger analytics': 'Ledger பகுப்பாய்வு',
  'Ledger analytics.': 'Ledger பகுப்பாய்வு.',

  /* ---- Plans ---- */
  'Anyone starting out': 'தொடங்கும் எவருக்கும்',
  'Learners and solo founders': 'கற்பவர்களும் தனி நிறுவனர்களும்',
  'Teams up to 5 seats': '5 இடங்கள் வரையிலான குழுக்கள்',
  'Growth-stage startups': 'வளர்ச்சி நிலை ஸ்டார்ட்அப்கள்',
  'SNX ID and profile': 'SNX ID மற்றும் சுயவிவரம்',
  'Event registration': 'நிகழ்வுப் பதிவு',
  'Community and Circles directory': 'சமூகம் மற்றும் Circles அடைவு',
  'Starter Academy courses': 'தொடக்க Academy படிப்புகள்',
  'Founder Coach (lite)': 'Founder Coach (lite)',
  'Everything in Free': 'Free-இல் உள்ள அனைத்தும்',
  'Full Academy library and certificates': 'முழு Academy நூலகமும் சான்றிதழ்களும்',
  'Co-founder and mentor Matchmaker': 'இணை நிறுவனர், வழிகாட்டி Matchmaker',
  'Priority event seats': 'நிகழ்வுகளில் முன்னுரிமை இடங்கள்',
  'Everything in Pro': 'Pro-இல் உள்ள அனைத்தும்',
  'Team workspace and data room': 'குழுப் பணியிடமும் தரவு அறையும்',
  'Investor CRM': 'முதலீட்டாளர் CRM',
  'GCC challenge applications': 'GCC சவால் விண்ணப்பங்கள்',
  'Scale Connect eligibility': 'Scale Connect தகுதி',
  'Everything in Team': 'Team-இல் உள்ள அனைத்தும்',
  'Deal room and investor-day priority': 'டீல் அறையும் முதலீட்டாளர் நாள் முன்னுரிமையும்',
  'Pilot pipeline analytics': 'பைலட் வரிசைப் பகுப்பாய்வு',
  'Advisor hours': 'ஆலோசகர் நேரம்',
  'Export desk access': 'ஏற்றுமதி மேசை அணுகல்',
  'Start free': 'இலவசமாகத் தொடங்குக',
  'Go Pro': 'Pro-க்கு மாறுக',
  'Start Team': 'Team-ஐத் தொடங்குக',
  'Students get 50% off Pro.': 'மாணவர்களுக்கு Pro-வில் 50% தள்ளுபடி.',
  'Connect and Women Circle members get Pro included.': 'Connect மற்றும் Women Circle உறுப்பினர்களுக்கு Pro சேர்த்தே வழங்கப்படும்.',
  'Profile and community': 'சுயவிவரமும் சமூகமும்',
  Learning: 'கற்றல்',
  'Matching and capital': 'பொருத்தமும் மூலதனமும்',
  'Market access and scale': 'சந்தை அணுகலும் வளர்ச்சியும்',
  'Prices exclude 18% GST [confirm rate]. Cancel any time; access runs to the end of the period.':
    'விலைகளில் 18% GST [confirm rate] சேர்க்கப்படவில்லை. எப்போது வேண்டுமானாலும் ரத்து செய்யலாம்; காலம் முடியும் வரை அணுகல் தொடரும்.',
  'Pay by UPI Autopay, card or net banking.': 'UPI Autopay, கார்டு அல்லது நெட் பேங்கிங் மூலம் செலுத்தலாம்.',

  /* ---- Organisation tiers ---- */
  Institution: 'கல்வி நிறுவனம்',
  'Incubator / TBI': 'இன்குபேட்டர் / TBI',
  'GCC / corporate': 'GCC / கார்ப்பரேட்',
  'Government / ecosystem': 'அரசு / சூழலமைப்பு',
  Investor: 'முதலீட்டாளர்',
  'Branded tenant, cohorts and LMS, IIC and NAAC innovation reporting, Campus or Research Index score, student Pro seats, Vibe Campus events':
    'உங்கள் பெயரிலான தளம், கற்றல் குழுக்களும் LMS-உம், IIC மற்றும் NAAC புத்தாக்க அறிக்கைகள், Campus அல்லது Research Index மதிப்பெண், மாணவர் Pro இடங்கள், Vibe Campus நிகழ்வுகள்',
  'Programme CRM, applications and judging, portfolio tracking, Ledger export, investor-day tools':
    'திட்ட CRM, விண்ணப்பங்களும் மதிப்பீடும், போர்ட்ஃபோலியோ கண்காணிப்பு, Ledger ஏற்றுமதி, முதலீட்டாளர் நாள் கருவிகள்',
  'Challenge board, pilot pipeline, talent access, intrapreneur cohort, innovation-impact reports':
    'சவால் பலகை, பைலட் வரிசை, திறமையாளர் அணுகல், நிறுவன உள் தொழில்முனைவோர் குழு, புத்தாக்கத் தாக்க அறிக்கைகள்',
  'District or state dashboards, programme operations, scheme pipelines, open-data feeds':
    'மாவட்ட அல்லது மாநில டாஷ்போர்டுகள், திட்டச் செயல்பாடுகள், அரசுத் திட்ட வரிசைகள், திறந்த தரவு ஊட்டங்கள்',
  'Curated deal flow, data rooms, syndicate tools, Ledger analytics':
    'தேர்ந்தெடுத்த முதலீட்டு வாய்ப்புகள், தரவு அறைகள், சிண்டிகேட் கருவிகள், Ledger பகுப்பாய்வு',
  '/ year, by size': '/ ஆண்டு, அளவைப் பொறுத்து',
  '/ year': '/ ஆண்டு',

  /* ---- Pricing FAQ ---- */
  'Is Free really free?': 'Free உண்மையிலேயே இலவசமா?',
  'Yes, no card needed.': 'ஆம், கார்டு தேவையில்லை.',
  'Can my college pay for me?': 'என் கல்லூரி எனக்காகப் பணம் செலுத்த முடியுமா?',
  'Yes, through an institution licence.': 'ஆம், கல்வி நிறுவன உரிமம் மூலம்.',
  "What if I'm sponsored by CSR?": 'எனக்கு CSR நிதியுதவி இருந்தால்?',
  'Your seat is activated with a code.': 'ஒரு குறியீடு மூலம் உங்கள் இடம் செயல்படுத்தப்படும்.',
  'Do you sell my data?': 'என் தரவை விற்கிறீர்களா?',
  'No.': 'இல்லை.',

  /* ---- AI guardrails and your data (Book 2 §2.6) ---- */
  'StartNet X uses AI agents to help with coaching, matching, grant applications and operations. People make the decisions.':
    'பயிற்சி, பொருத்துதல், மானிய விண்ணப்பங்கள், செயல்பாடுகள் ஆகியவற்றுக்கு உதவ StartNet X AI முகவர்களைப் பயன்படுத்துகிறது. முடிவுகளை எடுப்பது மனிதர்களே.',
  'No automated rejection. Every selection, funding or exclusion decision is made by a named person.':
    'தானியங்கி நிராகரிப்பு இல்லை. ஒவ்வொரு தேர்வு, நிதி அல்லது விலக்கல் முடிவையும் பெயர் குறிப்பிடப்பட்ட ஒருவரே எடுக்கிறார்.',
  'Bias audits each quarter by gender, district, language and college tier, published in our self-diagnosis.':
    'ஒவ்வொரு காலாண்டும் பாலினம், மாவட்டம், மொழி, கல்லூரி நிலை வாரியாகச் சார்புத் தணிக்கை, எங்கள் சுய ஆய்வில் வெளியிடப்படும்.',
  'Every agent answer cites its source, and figures keep their tag.':
    'ஒவ்வொரு முகவர் பதிலும் அதன் ஆதாரத்தைக் குறிப்பிடும்; எண்ணிக்கைகள் அவற்றின் குறிச்சொல்லுடனே இருக்கும்.',
  'Agents are tested in Tamil and English before they go live.':
    'நேரலைக்கு வரும் முன் முகவர்கள் தமிழிலும் ஆங்கிலத்திலும் சோதிக்கப்படுகின்றன.',
  'Your rights under the DPDP Act': 'DPDP சட்டத்தின் கீழ் உங்கள் உரிமைகள்',
  'We follow the Digital Personal Data Protection Act, 2023. You can access, correct or erase your data, and withdraw consent at any time.':
    'டிஜிட்டல் தனிநபர் தரவுப் பாதுகாப்புச் சட்டம், 2023-ஐ நாங்கள் பின்பற்றுகிறோம். உங்கள் தரவைப் பார்க்கலாம், திருத்தலாம், அழிக்கலாம்; எப்போது வேண்டுமானாலும் ஒப்புதலைத் திரும்பப் பெறலாம்.',
  'Stored in India': 'இந்தியாவில் சேமிக்கப்படுகிறது',
  'Your data is stored in India, encrypted in transit and at rest.':
    'உங்கள் தரவு இந்தியாவில் சேமிக்கப்படுகிறது; அனுப்பும்போதும் சேமிப்பிலும் மறையாக்கம் செய்யப்படுகிறது.',
  'You choose who sees it': 'யார் பார்க்கலாம் என்பது உங்கள் முடிவு',
  'We never sell personal data. Your profile is shared with an investor, GCC or institution only if you opt in, and every share is logged.':
    'தனிப்பட்ட தரவை நாங்கள் ஒருபோதும் விற்பதில்லை. நீங்கள் ஒப்புதல் அளித்தால் மட்டுமே உங்கள் சுயவிவரம் முதலீட்டாளர், GCC அல்லது கல்வி நிறுவனத்துடன் பகிரப்படும்; ஒவ்வொரு பகிர்வும் பதிவு செய்யப்படும்.',
  'Under 18': '18 வயதுக்குட்பட்டவர்கள்',
  'For anyone under 18, we ask for verifiable consent from a parent or guardian.':
    '18 வயதுக்குட்பட்ட எவருக்கும், பெற்றோர் அல்லது பாதுகாவலரிடமிருந்து சரிபார்க்கக்கூடிய ஒப்புதலைக் கேட்கிறோம்.',
  Access: 'பார்த்தல்',
  Correct: 'திருத்துதல்',
  Erase: 'அழித்தல்',
  'Withdraw consent': 'ஒப்புதலைத் திரும்பப் பெறுதல்',
};

/** tx('English') → the Tamil draft on /ta pages (English fallback when no draft exists). */
export function useSnxT() {
  const lang = useLang();
  const tx = (en) => (typeof en === 'string' ? lang.t(en, SNX_TA[en.trim()]) : en);
  return { ...lang, tx };
}
