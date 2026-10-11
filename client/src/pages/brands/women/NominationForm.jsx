import { SmartForm } from '../../../components';
import { useLang } from '../../../lib/i18n.jsx';
import { DISTRICTS } from './womenContent.js';
import './Women.css';

/**
 * Women Founders Summit & Awards: "Nominate a founder" (POST /api/forms/nomination).
 * Error copy is about the nominee, not the nominator (F-64). Tamil: drafts pending native review.
 */
export default function NominationForm({ src = 'women-summit' }) {
  const { t, lang } = useLang();
  return (
    <SmartForm
      type="nomination"
      brand="women"
      className="women-nominate form-card"
      fields={[
        { name: 'name', label: t('Your name', 'உங்கள் பெயர்'), type: 'text', required: true, autoComplete: 'name', requiredMessage: t('Please add your name.', 'உங்கள் பெயரைச் சேர்க்கவும்.') },
        { name: 'email', label: t('Your email', 'உங்கள் மின்னஞ்சல்'), type: 'email', required: true, autoComplete: 'email', requiredMessage: t('Please add your email.', 'உங்கள் மின்னஞ்சலைச் சேர்க்கவும்.') },
        { name: 'phone', label: t('Mobile (optional)', 'கைபேசி எண் (விருப்பத்தேர்வு)'), type: 'tel', autoComplete: 'tel', hint: t('Only to confirm your nomination.', 'உங்கள் பரிந்துரையை உறுதிப்படுத்த மட்டும்.') },
        { name: 'nomineeName', label: t("Founder's name", 'நிறுவனரின் பெயர்'), type: 'text', required: true, requiredMessage: t("Please add the founder's name.", 'நிறுவனரின் பெயரைச் சேர்க்கவும்.') },
        { name: 'nomineeCompany', label: t('Her company', 'அவரது நிறுவனம்'), type: 'text', required: true, requiredMessage: t("Please add her company's name.", 'அவரது நிறுவனத்தின் பெயரைச் சேர்க்கவும்.') },
        {
          name: 'district',
          label: t('District', 'மாவட்டம்'),
          type: 'select',
          required: true,
          // One empty prompt only: the field renders it from `placeholder` (F-64).
          placeholder: t('Choose a district', 'மாவட்டத்தைத் தேர்ந்தெடுக்கவும்'),
          requiredMessage: t("Please choose the founder's district.", 'நிறுவனரின் மாவட்டத்தைத் தேர்ந்தெடுக்கவும்.'),
          options: DISTRICTS.map((d) => ({ value: d.en, label: lang === 'ta' ? `${d.ta} · ${d.en}` : `${d.en} · ${d.ta}` })),
        },
        {
          name: 'reason',
          label: t('Why this founder?', 'ஏன் இந்த நிறுவனர்?'),
          type: 'textarea',
          required: true,
          hint: t('What she has built, and the outcomes you can point to.', 'அவர் உருவாக்கியவை, நீங்கள் சுட்டிக்காட்டக்கூடிய விளைவுகள்.'),
          requiredMessage: t('Please tell us why you are nominating her.', 'அவரை ஏன் பரிந்துரைக்கிறீர்கள் என்று சொல்லுங்கள்.'),
        },
        { name: 'nomineeAware', label: t('The founder knows I am nominating her.', 'நான் அவரைப் பரிந்துரைப்பது அந்த நிறுவனருக்குத் தெரியும்.'), type: 'checkbox' },
      ]}
      consents={[{ purpose: 'contact', label: t('StartNet may contact me about this nomination.', 'இந்தப் பரிந்துரை தொடர்பாக StartNet என்னைத் தொடர்புகொள்ளலாம்.'), required: true }]}
      submitLabel={t('Nominate a founder', 'ஒரு நிறுவனரைப் பரிந்துரையுங்கள்')}
      successTitle={t('Nomination received.', 'பரிந்துரை பெறப்பட்டது.')}
      successBody={t('Thank you. Awards are decided by an independent jury.', 'நன்றி. விருதுகளைச் சுயாதீன நடுவர் குழு முடிவு செய்கிறது.')}
      hidden={{ brand: 'women', programme: 'women-founders-summit', src }}
    />
  );
}
