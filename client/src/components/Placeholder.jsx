import { useLang } from '../lib/i18n.jsx';
import { PLACEHOLDER_TEXT, PLACEHOLDER_TEXT_TA, cx } from './_utils.js';
import './Placeholder.css';

// The generic register marks in Tamil (Book 2 Appendix A).
const TA_MARKS = {
  '[placeholder]': '[இடநிரப்பி]',
  '[number]': '[எண்]',
  '[date]': '[தேதி]',
  '[date TBC]': '[தேதி விரைவில்]',
  '[date placeholder]': '[தேதி இடநிரப்பி]',
  '[confirm]': '[உறுதிசெய்ய வேண்டும்]',
  '[first edition date placeholder]': '[முதல் பதிப்புத் தேதி இடநிரப்பி]',
  '[status — to be confirmed]': '[நிலை — உறுதிசெய்யப்பட வேண்டும்]',
  [PLACEHOLDER_TEXT]: PLACEHOLDER_TEXT_TA,
};

const SUPPLY = 'StartNet வழங்கும்';

// Recurring notes inside "[placeholder — …]" marks (seeded data keeps the English note even in *Ta strings).
// Keys are matched case-sensitively after trimming; brand and programme names stay Latin.
const TA_NOTES = {
  '…': '…',
  'to be supplied by StartNet': 'StartNet வழங்க வேண்டும்',
  "to be supplied by StartNet, with the founder's written consent": `நிறுவனரின் எழுத்துப்பூர்வ ஒப்புதலுடன் ${SUPPLY}`,
  'to be supplied by StartNet: real founder stories with written consent. Do not publish quotes until approved in writing by the founder.':
    `${SUPPLY}: எழுத்துப்பூர்வ ஒப்புதலுடன் உண்மையான நிறுவனர் கதைகள். நிறுவனர் எழுத்துப்பூர்வமாக ஒப்புதல் அளிக்கும் வரை மேற்கோள்களை வெளியிட வேண்டாம்.`,
  jury: 'நடுவர் குழு',
  'final fee': 'இறுதிக் கட்டணம்',
  'first edition date': 'முதல் பதிப்புத் தேதி',
  date: 'தேதி',
  time: 'நேரம்',
  name: 'பெயர்',
  email: 'மின்னஞ்சல்',
  phone: 'தொலைபேசி',
  address: 'முகவரி',
  link: 'இணைப்பு',
  'file link': 'கோப்பு இணைப்பு',
  'file links': 'கோப்பு இணைப்புகள்',
  'policy link': 'கொள்கை இணைப்பு',
  'survey link': 'கணக்கெடுப்பு இணைப்பு',
  'static map image link': 'நிலையான வரைபடப் பட இணைப்பு',
  'link to disclosure statement': 'வெளிப்படுத்தல் அறிக்கைக்கான இணைப்பு',
  'investor relations email': 'முதலீட்டாளர் உறவுகள் மின்னஞ்சல்',
  'full address, Chennai, Tamil Nadu': 'முழு முகவரி, சென்னை, தமிழ்நாடு',
  'name, email, address': 'பெயர், மின்னஞ்சல், முகவரி',
  'name, with written consent': 'பெயர், எழுத்துப்பூர்வ ஒப்புதலுடன்',
  'name, email and postal address to be supplied by StartNet': `பெயர், மின்னஞ்சல், அஞ்சல் முகவரி: ${SUPPLY}`,
  'founding year': 'தொடங்கிய ஆண்டு',
  'founding year, first event, key milestones with dates': 'தொடக்க ஆண்டு, முதல் நிகழ்வு, தேதியுடன் முக்கிய மைல்கற்கள்',
  'planned 2027': '2027-இல் திட்டமிடப்பட்டது',
  'none yet': 'இன்னும் இல்லை',
  'rate card': 'கட்டண அட்டவணை',
  'CSR-subsidised': 'CSR மானியத்துடன்',
  'confirm funding': 'நிதி உறுதிசெய்யப்பட வேண்டும்',
  sponsors: 'ஸ்பான்சர்கள்',
  'signed only': 'கையெழுத்தானவை மட்டும்',
  'signed and dated only': 'கையெழுத்திட்டு தேதியிட்டவை மட்டும்',
  'signed sponsors only': 'கையெழுத்திட்ட ஸ்பான்சர்கள் மட்டும்',
  'signed sponsors only, shown from signature date': 'கையெழுத்திட்ட ஸ்பான்சர்கள் மட்டும், கையெழுத்திட்ட தேதியிலிருந்து காட்டப்படும்',
  'signed tenants only': 'ஒப்பந்தம் கையெழுத்தான குடியிருப்பு நிறுவனங்கள் மட்டும்',
  'shown only when signed': 'கையெழுத்தான பின்பே காட்டப்படும்',
  'mostly sponsor- or grant-funded seats': 'பெரும்பாலும் ஸ்பான்சர் அல்லது மானிய நிதியிலான இடங்கள்',
  'members, with consent to be named': 'உறுப்பினர்கள், பெயரிட ஒப்புதல் பெற்ற பின்',
  'named speakers, with consent': 'ஒப்புதலுடன் பேச்சாளர்களின் பெயர்கள்',
  'named industry jurors with consent': 'ஒப்புதலுடன் தொழில்துறை நடுவர்களின் பெயர்கள்',
  'named mentors and faculty, with consent': 'ஒப்புதலுடன், பெயருடன் வழிகாட்டிகளும் பேராசிரியர்களும்',
  'joining details': 'இணைவதற்கான விவரங்கள்',
  'venue to be confirmed': 'இடம் உறுதிசெய்யப்பட வேண்டும்',
  'terms and provider to be confirmed': 'விதிமுறைகளும் வழங்குநரும் உறுதிசெய்யப்பட வேண்டும்',
  'partner platform or fund, to be confirmed': 'கூட்டாளர் தளம் அல்லது நிதியம், உறுதிசெய்யப்பட வேண்டும்',
  'boundary data source and licence to be confirmed': 'எல்லைத் தரவு ஆதாரமும் உரிமமும் உறுதிசெய்யப்பட வேண்டும்',
  'StartNet Foundation (CSR-1) or a registered implementing partner, to be confirmed':
    'StartNet Foundation (CSR-1) அல்லது பதிவுசெய்யப்பட்ட செயல்படுத்தும் கூட்டாளர், உறுதிப்படுத்தப்பட வேண்டும்',
  'final attendance, as at date': 'இறுதி வருகை எண்ணிக்கை, குறிப்பிட்ட தேதியின் நிலவரப்படி',
  'attendance tagged A/B': 'வருகை எண்ணிக்கை A/B எனக் குறிக்கப்படும்',
  'outcomes tagged A/B': 'விளைவுகள் A/B எனக் குறிக்கப்படும்',
  'directions and accessibility notes': 'வழி மற்றும் அணுகல் குறிப்புகள்',
  'confirm childcare at flagship events before publishing': 'வெளியிடும் முன் முதன்மை நிகழ்வுகளில் குழந்தைப் பராமரிப்பை உறுதிசெய்யவும்',
  'results of the accessibility audit': 'அணுகல்தன்மைத் தணிக்கையின் முடிவுகள்',
  'reporting route': 'புகார் வழி',
  'on approval by counsel': 'சட்ட ஆலோசகர் ஒப்புதல் அளித்ததும்',
  'to be drafted by counsel': 'சட்ட ஆலோசகர் வரைய வேண்டும்',
  'to be confirmed by counsel': 'சட்ட ஆலோசகர் உறுதிசெய்ய வேண்டும்',
  'full terms to be drafted by counsel': 'முழு விதிமுறைகளைச் சட்ட ஆலோசகர் வரைய வேண்டும்',
  'prices follow the published rate card': 'விலைகள் வெளியிடப்பட்ட கட்டண அட்டவணையைப் பின்பற்றும்',
  'refund windows and conditions, to be confirmed by counsel': 'பணத்திருப்பக் காலமும் நிபந்தனைகளும், சட்ட ஆலோசகர் உறுதிசெய்ய வேண்டும்',
  'list of processors and locations, to be confirmed by counsel': 'செயலாக்குநர்கள், இடங்களின் பட்டியல், சட்ட ஆலோசகர் உறுதிசெய்ய வேண்டும்',
  'to be confirmed by StartNet and the jury': 'StartNet-உம் நடுவர் குழுவும் உறுதிசெய்ய வேண்டும்',
  "to be confirmed after proofing by StartNet's print partner": 'StartNet அச்சுக் கூட்டாளரின் சோதனை அச்சுக்குப் பின் உறுதிசெய்யப்படும்',
  'quarter-to-month mapping to be confirmed by StartNet': 'காலாண்டு–மாதப் பொருத்தத்தை StartNet உறுதிசெய்ய வேண்டும்',
  'captioned Vibathon 2025 team photo': 'தலைப்புடன் Vibathon 2025 அணிப் புகைப்படம்',
  'Vibathon 2025 winning team, with consent: what they built, and the ladder level reached since':
    'Vibathon 2025 வெற்றி அணி, ஒப்புதலுடன்: அவர்கள் உருவாக்கியது, அதன்பின் எட்டிய ஏணி நிலை',
  'founder stories with written consent, to be supplied by StartNet': `எழுத்துப்பூர்வ ஒப்புதலுடன் நிறுவனர் கதைகள்: ${SUPPLY}`,
  'findings to be supplied by StartNet with the first edition': 'முதல் பதிப்புடன் StartNet கண்டறிதல்களை வழங்கும்',
  'founder story to be supplied by StartNet': `நிறுவனர் கதையை ${SUPPLY}`,
  'recap and outcomes to be supplied by StartNet': `சுருக்கமும் முடிவுகளும் ${SUPPLY}`,
  'series description to be supplied by StartNet': `தொடர் விவரத்தை ${SUPPLY}`,
  'agenda to be supplied by StartNet': `நிகழ்ச்சி நிரலை ${SUPPLY}`,
  'upcoming events to be supplied by StartNet': `வரவிருக்கும் நிகழ்வுகளை ${SUPPLY}`,
  'touchpoint list to be supplied by StartNet': `தொடர்புப் புள்ளிகளின் பட்டியலை ${SUPPLY}`,
  'subject line to be supplied by StartNet per issue': `ஒவ்வொரு இதழுக்குமான தலைப்பு வரியை ${SUPPLY}`,
  'status page URL to be supplied by StartNet': `நிலைப் பக்க URL-ஐ ${SUPPLY}`,
  'sponsor tiers and rate card to be supplied by StartNet': `ஸ்பான்சர் நிலைகளையும் கட்டண அட்டவணையையும் ${SUPPLY}`,
  'signing, retries and delivery terms to be supplied by StartNet': `கையொப்பம், மறுமுயற்சி, விநியோக விதிமுறைகளை ${SUPPLY}`,
  'role outcome to be supplied by StartNet': `இந்தப் பணியின் விளைவை ${SUPPLY}`,
  'release text to be supplied by StartNet': `செய்திக் குறிப்பின் உரை ${SUPPLY}`,
  'photo library to be supplied by StartNet': `புகைப்படத் தொகுப்பை ${SUPPLY}`,
  'open calls to be supplied by StartNet': `திறந்த அழைப்புகளை ${SUPPLY}`,
  'method to be supplied by StartNet': `வழிமுறையை ${SUPPLY}`,
  'method change log to be supplied by StartNet': `வழிமுறை மாற்றப் பதிவை ${SUPPLY}`,
  'file to be supplied by StartNet': `கோப்பை ${SUPPLY}`,
  'names and scope of the remaining agents to be supplied by StartNet': `மீதமுள்ள முகவர்களின் பெயர்களையும் வரம்பையும் ${SUPPLY}`,
  'existing StartNet master logo files (vector) to be supplied by StartNet': `தற்போதைய StartNet முதன்மை லோகோ கோப்புகளை (வெக்டர்) ${SUPPLY}`,
  'safeguarding lead, event rules and reporting route, to be supplied by StartNet':
    'பாதுகாப்புப் பொறுப்பாளர், நிகழ்வு விதிகள், புகார் வழி; StartNet வழங்க வேண்டும்',
  'code of conduct text, to be supplied by StartNet': 'நடத்தை விதிமுறை உரை, StartNet வழங்க வேண்டும்',
  'district pages with local events, circles and Ledger figures, to be supplied by StartNet':
    'உள்ளூர் நிகழ்வுகள், வட்டங்கள், Ledger எண்களுடன் மாவட்டப் பக்கங்கள்; StartNet வழங்க வேண்டும்',
  'Vibe Club directory by district, to be supplied by StartNet': `மாவட்ட வாரியான Vibe Club பட்டியல்: ${SUPPLY}`,
};

// Latin words allowed to stay inside a Tamil note (brand/programme names, tags, units).
const LATIN_OK = /^(StartNet|Foundation|CSR|CSR-1|Ledger|Vibe|Club|Vibathon|URL|A\/B|A|B|C)$/;
const hasEnglish = (s) => (s.match(/[A-Za-z][A-Za-z'/-]*/g) || []).some((w) => !LATIN_OK.test(w));
const isTamil = (s) => /[஀-௿]/.test(s);

/** One note segment → Tamil, or null when there is no known translation. */
function noteSegment(seg) {
  const s = seg.trim();
  if (!s || isTamil(s) || !hasEnglish(s)) return s;
  if (TA_NOTES[s]) return TA_NOTES[s];
  let m = /^indicative\s+(.+)$/i.exec(s);
  if (m) return `தோராயமாக ${m[1]}`;
  m = /^to be supplied by StartNet:\s*(.+)$/.exec(s);
  if (m) {
    const inner = noteSegment(m[1]);
    return inner == null ? null : `${SUPPLY}: ${inner}`;
  }
  m = /^(.+?),?\s+to be supplied by StartNet$/.exec(s);
  if (m) {
    const inner = noteSegment(m[1]);
    return inner == null ? null : `${inner}: ${SUPPLY}`;
  }
  return null;
}

/** Tamil note for the text after "[placeholder — ", or null when any part stays English. */
function noteTa(note) {
  const whole = noteSegment(note);
  if (whole != null) return whole;
  const parts = note.split(/;\s+/).map(noteSegment);
  return parts.length > 1 && parts.every((p) => p != null) ? parts.join('; ') : null;
}

const PREFIX = /^\[(?:placeholder|இடநிரப்பி)\s*[—–-]\s*([\s\S]*)\]$/;

/**
 * Splits a register mark into Tamil parts: { mark } when fully localised, or
 * { prefix, note, suffix } when the note has no Tamil form (render the note with lang="en").
 */
export function localiseMarkParts(text, lang) {
  if (lang !== 'ta' || typeof text !== 'string') return { mark: text };
  const s = text.trim();
  if (TA_MARKS[s]) return { mark: TA_MARKS[s] };
  const m = PREFIX.exec(s);
  if (!m) return { mark: s.replace(/^\[placeholder\b/, '[இடநிரப்பி') };
  const ta = noteTa(m[1]);
  if (ta != null) return { mark: `[இடநிரப்பி — ${ta}]` };
  return { prefix: '[இடநிரப்பி — ', note: m[1], suffix: ']' };
}

/** Tamil form of a register mark as a plain string (untranslated notes stay English). */
export function localiseMark(text, lang) {
  const p = localiseMarkParts(text, lang);
  return p.mark != null ? p.mark : `${p.prefix}${p.note}${p.suffix}`;
}

/** Placeholder register marker (Book 2 Appendix A): visible, never hidden. */
export function Placeholder({ children, className }) {
  const { t, lang } = useLang();
  let content;
  if (children == null || children === '') content = t(PLACEHOLDER_TEXT, PLACEHOLDER_TEXT_TA);
  else if (typeof children !== 'string') content = children;
  else {
    const p = localiseMarkParts(children, lang);
    content =
      p.mark != null ? (
        p.mark
      ) : (
        <>
          {p.prefix}
          <span lang="en">{p.note}</span>
          {p.suffix}
        </>
      );
  }
  return <span className={cx('placeholder', 'placeholder-chip', className)}>{content}</span>;
}

export default Placeholder;
