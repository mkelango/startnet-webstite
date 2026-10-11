// "I am a…" persona selector data — Book 1 Part B §5.1 (groups) and §5.2 (path per persona).
// Nothing is stored on startnet.in: the answer only builds a route or an SNX deep link.
// *Ta fields: DRAFT Tamil (Book 2 §14 status), native Tamil review pending. Brand/programme names stay Latin.
import { GraduationCap, FlaskConical, Briefcase, Store, School, Building2, Landmark, Handshake, TrendingUp } from 'lucide-react';

export const PERSONA_GROUPS = [
  { id: 'build', label: 'Build something', labelTa: 'ஏதாவது உருவாக்க' },
  { id: 'work', label: 'Work with StartNet', labelTa: 'StartNet-உடன் இணைந்து பணியாற்ற' },
];

export const PERSONAS = [
  // Build something (talent)
  { id: 'student', group: 'build', label: 'Student', labelTa: 'மாணவர்', icon: GraduationCap, brand: 'vibe', to: '/vibe', waRef: 'vibe',
    next: 'Start with StartNet Vibe: Vibathon, Vibe Academy and Launchpad.', stepLabel: 'Explore StartNet Vibe',
    nextTa: 'StartNet Vibe-இல் தொடங்குங்கள்: Vibathon, Vibe Academy மற்றும் Launchpad.', stepLabelTa: 'StartNet Vibe-ஐ ஆராயுங்கள்' },
  { id: 'scholar', group: 'build', label: 'PhD scholar or faculty', labelTa: 'PhD ஆய்வாளர் அல்லது ஆசிரியர்', icon: FlaskConical, brand: 'research', to: '/research', waRef: 'research',
    next: 'Start with StartNet Research: Labs, the Scholar Founders Fellowship and standard terms.', stepLabel: 'Explore StartNet Research',
    nextTa: 'StartNet Research-இல் தொடங்குங்கள்: Labs, Scholar Founders Fellowship மற்றும் நிலையான விதிமுறைகள்.', stepLabelTa: 'StartNet Research-ஐ ஆராயுங்கள்' },
  { id: 'professional', group: 'build', label: 'Working professional', labelTa: 'பணிபுரியும் தொழில்முறையாளர்', icon: Briefcase, brand: 'connect', to: '/connect', waRef: 'connect',
    next: 'Start with StartNet Connect: your sector Connect, Founder Switch and Circles.', stepLabel: 'Explore StartNet Connect',
    nextTa: 'StartNet Connect-இல் தொடங்குங்கள்: உங்கள் துறைக்கான Connect, Founder Switch மற்றும் Circles.', stepLabelTa: 'StartNet Connect-ஐ ஆராயுங்கள்' },
  { id: 'woman-founder', group: 'build', label: 'Woman founder or business owner', labelTa: 'பெண் நிறுவனர் அல்லது தொழில் உரிமையாளர்', icon: Store, brand: 'women', to: '/women', waRef: 'women',
    next: 'Start with StartNet Women: district Circles, Rise Academy and HerCapital.', stepLabel: 'Explore StartNet Women',
    nextTa: 'StartNet Women-இல் தொடங்குங்கள்: மாவட்ட Circles, Rise Academy மற்றும் HerCapital.', stepLabelTa: 'StartNet Women-ஐ ஆராயுங்கள்' },
  // Work with StartNet (payers and partners)
  { id: 'institution', group: 'work', label: 'Institution', labelTa: 'கல்வி நிறுவனம்', icon: School, to: '/partner/institutions', waRef: 'partner-inst',
    next: 'The Institution Partner Programme, Vibe Campus and StartNet X for institutions.', stepLabel: 'See what we do for institutions',
    nextTa: 'Institution Partner Programme, Vibe Campus மற்றும் கல்வி நிறுவனங்களுக்கான StartNet X.', stepLabelTa: 'கல்வி நிறுவனங்களுக்கு நாங்கள் செய்வதைப் பாருங்கள்' },
  { id: 'gcc', group: 'work', label: 'GCC or corporate', labelTa: 'GCC அல்லது பெருநிறுவனம்', icon: Building2, to: '/partner/gccs', waRef: 'partner-gcc',
    next: 'Lab sponsorship, Vibathon tracks, talent packages and intrapreneur programmes.', stepLabel: 'See what we do for GCCs and corporates',
    nextTa: 'ஆய்வக ஸ்பான்சர்ஷிப், Vibathon தடங்கள், திறமையாளர் தொகுப்புகள் மற்றும் உள்-தொழில்முனைவோர் (intrapreneur) திட்டங்கள்.', stepLabelTa: 'GCC-கள் மற்றும் பெருநிறுவனங்களுக்கு நாங்கள் செய்வதைப் பாருங்கள்' },
  { id: 'government', group: 'work', label: 'Government', labelTa: 'அரசு', icon: Landmark, to: '/partner/government', waRef: 'partner-gov',
    next: 'District Ecosystem Programmes, measured delivery and the Founder Ledger by district.', stepLabel: 'See what we do for government',
    nextTa: 'District Ecosystem Programmes, அளவிடப்பட்ட செயலாக்கம் மற்றும் மாவட்ட வாரியான Founder Ledger.', stepLabelTa: 'அரசுக்கு நாங்கள் செய்வதைப் பாருங்கள்' },
  { id: 'sponsor', group: 'work', label: 'Sponsor or CSR', labelTa: 'ஸ்பான்சர் அல்லது CSR', icon: Handshake, to: '/partner/sponsors', waRef: 'partner-spon',
    next: 'The events calendar, past events with outcomes, and the rate card.', stepLabel: 'See sponsorship and CSR',
    nextTa: 'நிகழ்வு நாட்காட்டி, விளைவுகளுடன் கூடிய கடந்த நிகழ்வுகள் மற்றும் கட்டண அட்டவணை.', stepLabelTa: 'ஸ்பான்சர்ஷிப் மற்றும் CSR-ஐப் பாருங்கள்' },
  { id: 'investor', group: 'work', label: 'Investor', labelTa: 'முதலீட்டாளர்', icon: TrendingUp, to: '/partner/investors', waRef: 'partner-inv',
    next: 'The Founder Ledger, Scale Connect investor days and the investor list.', stepLabel: 'See what we do for investors',
    nextTa: 'Founder Ledger, Scale Connect முதலீட்டாளர் நாட்கள் மற்றும் முதலீட்டாளர் பட்டியல்.', stepLabelTa: 'முதலீட்டாளர்களுக்கு நாங்கள் செய்வதைப் பாருங்கள்' },
];

// Footer links under the selector (Book 1 Part B §5.1)
export const PERSONA_EXTRAS = [
  { id: 'media', label: 'Media', labelTa: 'ஊடகம்', to: '/media' },
  { id: 'job-seeker', label: 'Job seeker', labelTa: 'வேலை தேடுபவர்', to: '/careers' },
  { id: 'diaspora', label: 'Tamil diaspora', labelTa: 'புலம்பெயர் தமிழர்', to: '/connect' },
];

// Optional second question for talent (Book 1 Part B §5.1)
export const INTENTS = [
  { id: 'learn', label: 'Learn', labelTa: 'கற்றுக்கொள்ள' },
  { id: 'team', label: 'Build a team', labelTa: 'குழுவை உருவாக்க' },
  { id: 'launch', label: 'Launch', labelTa: 'தொடங்க' },
  { id: 'raise', label: 'Raise', labelTa: 'நிதி திரட்ட' },
  { id: 'customers', label: 'Find customers', labelTa: 'வாடிக்கையாளர்களைக் கண்டறிய' },
];

export const getPersona = (id) => PERSONAS.find((p) => p.id === id) || null;
export const isTalent = (p) => !!p && p.group === 'build';
