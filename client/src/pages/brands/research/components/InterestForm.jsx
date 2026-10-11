import { SmartForm, Button, Reveal } from '../../../../components';
import { useLang } from '../../../../lib/i18n.jsx';
import { waLink } from '../../../../lib/links';
import { LABS } from '../researchContent';
import './InterestForm.css';

const ROLES = [
  { value: 'phd-scholar', label: 'PhD scholar', labelTa: 'முனைவர் பட்ட ஆய்வாளர்' },
  { value: 'post-doc', label: 'Post-doc', labelTa: 'முனைவர் பட்டத்துக்குப் பிந்தைய ஆய்வாளர்' },
  { value: 'faculty', label: 'Faculty', labelTa: 'பேராசிரியர்' },
  { value: 'masters', label: "Final-year master's student", labelTa: 'இறுதியாண்டு முதுநிலை மாணவர்' },
  { value: 'institution', label: 'Institution (IIC, dean, VC, principal)', labelTa: 'கல்வி நிறுவனம் (IIC, முதன்மையர், துணைவேந்தர், முதல்வர்)' },
  { value: 'industry', label: 'GCC or industry partner', labelTa: 'GCC அல்லது தொழில்துறைக் கூட்டாளர்' },
  { value: 'government', label: 'Government', labelTa: 'அரசு' },
];

const INTERESTS = [
  ...LABS.map((l) => ({ value: l.slug, label: l.name })),
  { value: 'fellowship', label: 'Scholar Founders Fellowship' },
  { value: 'summit', label: 'Lab-to-Market Summit' },
  { value: 'ipp', label: 'Institution Partner Programme' },
  { value: 'sponsor', label: 'Sponsoring a Lab or the Summit', labelTa: 'ஆய்வகம் அல்லது Summit-க்கு ஸ்பான்சர் செய்தல்' },
];

/** Register interest (StartNet Research). Posts to /api/forms/interest. */
export default function InterestForm({ id = 'register-interest', title, body, source = 'research' }) {
  const { t } = useLang();
  const opts = (list) => list.map((o) => ({ value: o.value, label: t(o.label, o.labelTa) }));
  return (
    <div className="rinterest" id={id}>
      <Reveal className="rinterest__intro">
        <p className="eyebrow">{t('Register interest', 'ஆர்வத்தைப் பதிவு செய்யுங்கள்')}</p>
        <h2 className="h2 rinterest__title">{title}</h2>
        {body && <p className="body-lg text-2 rinterest__body">{body}</p>}
        <div className="rinterest__wa">
          <p className="small muted">{t('Prefer to talk first?', 'முதலில் பேச விரும்புகிறீர்களா?')}</p>
          <Button variant="whatsapp" href={waLink("Hi StartNet Research, I'd like to talk about my research.", 'research')}>
            {t('Talk to the Research team', 'Research குழுவிடம் பேசுங்கள்')}
          </Button>
        </div>
      </Reveal>
      <div className="rinterest__form form-card">
        <SmartForm
          type="interest"
          brand="research"
          fields={[
            { id: `${id}-name`, name: 'name', label: t('Full name', 'முழுப் பெயர்'), type: 'text', required: true, autoComplete: 'name' },
            { id: `${id}-email`, name: 'email', label: t('Email', 'மின்னஞ்சல்'), type: 'email', required: true, autoComplete: 'email', width: 'half' },
            { id: `${id}-phone`, name: 'phone', label: t('Mobile number', 'கைபேசி எண்'), type: 'tel', hint: t('Optional. We only use it to reply.', 'விருப்பத்தேர்வு. பதில் அளிக்க மட்டுமே பயன்படுத்துவோம்.'), autoComplete: 'tel-national', width: 'half' },
            { id: `${id}-role`, name: 'role', label: t('I am a', 'நான் ஒரு'), type: 'select', required: true, options: opts(ROLES), width: 'half' },
            { id: `${id}-interest`, name: 'interest', label: t('Interested in', 'ஆர்வமுள்ளது'), type: 'select', required: true, options: opts(INTERESTS), width: 'half' },
            { id: `${id}-message`, name: 'message', label: t('Your research, in a few lines', 'உங்கள் ஆய்வு, சில வரிகளில்'), type: 'textarea', hint: t('What does it do, and whose problem could it solve?', 'அது என்ன செய்கிறது, யாருடைய சிக்கலைத் தீர்க்கக்கூடும்?') },
          ]}
          consents={[
            { purpose: 'contact', label: t('StartNet may contact me about my interest in StartNet Research.', 'StartNet Research-இல் எனக்குள்ள ஆர்வம் குறித்து StartNet என்னைத் தொடர்புகொள்ளலாம்.'), required: true },
            { purpose: 'whatsapp_updates', label: t('Send me StartNet Research updates on WhatsApp. I can stop them any time.', 'StartNet Research தகவல்களை WhatsApp-இல் அனுப்புங்கள். எப்போது வேண்டுமானாலும் நிறுத்தலாம்.') },
          ]}
          submitLabel={t('Register interest', 'ஆர்வத்தைப் பதிவு செய்யுங்கள்')}
          successTitle={t('Thanks. We have your details.', 'நன்றி. உங்கள் விவரங்கள் கிடைத்தன.')}
          // The "Next cohort and Lab dates: [placeholder]" sentence is left out until the dates are supplied.
          successBody={t(
            'The StartNet Research team will reply by email.',
            'StartNet Research குழு மின்னஞ்சலில் பதில் அளிக்கும்.'
          )}
          hidden={{ brand: 'research', source }}
        />
      </div>
    </div>
  );
}
