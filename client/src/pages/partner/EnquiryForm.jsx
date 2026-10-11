// Shared partner enquiry form (Book 2 §13.5, Book 1 Part A §7.4 / Part B §9.3). Page-local to /partner.
import { SmartForm } from '../../components';
import { useLang } from '../../lib/i18n.jsx';
import {
  ENQUIRY_TYPES, ENQUIRY_TOPICS, SLA_LINE, SLA_LINE_TA, resolveEnquiryTopic, tf,
} from './partnerData.js';

/**
 * `hidden` adds attribution fields to the payload (e.g. { ref: 'research-ipp', brand: 'connect' } from deep links).
 * `defaultTopic` accepts ENQUIRY_TOPICS values or the aliases in ENQUIRY_TOPIC_ALIASES (e.g. 'vibathon').
 */
export default function EnquiryForm({ defaultType = '', defaultTopic = '', source = 'partner-enquire', hidden = {}, className = '' }) {
  const { lang, t } = useLang();
  const type = ENQUIRY_TYPES.some((o) => o.value === defaultType) ? defaultType : '';
  const topic = resolveEnquiryTopic(defaultTopic);
  const requestedTopicRaw = defaultTopic && defaultTopic !== topic ? defaultTopic : undefined;
  // Field renders the empty "choose" option itself from `placeholder` (F-88: no duplicate prompt row).
  const choose = t('Choose one', 'ஒன்றைத் தேர்ந்தெடுங்கள்');
  const opts = (list) => list.map((o) => ({ value: o.value, label: tf(t, o, 'label') }));

  const fields = [
    { name: 'organisation', id: `${source}-organisation`, label: t('Organisation', 'நிறுவனம்'), required: true, autoComplete: 'organization' },
    { name: 'name', id: `${source}-name`, label: t('Your name', 'உங்கள் பெயர்'), required: true, autoComplete: 'name' },
    {
      name: 'role', id: `${source}-role`, label: t('Your role', 'உங்கள் பொறுப்பு'),
      hint: t('For example: principal, innovation head, district officer.', 'எடுத்துக்காட்டு: முதல்வர், புத்தாக்கத் தலைவர், மாவட்ட அலுவலர்.'),
      autoComplete: 'organization-title',
    },
    {
      name: 'email', id: `${source}-email`, label: t('Email', 'மின்னஞ்சல்'), type: 'email', required: true, autoComplete: 'email',
      hint: t('A work email helps us route your enquiry.', 'பணி மின்னஞ்சல் இருந்தால் உங்கள் விசாரணையைச் சரியான குழுவுக்கு அனுப்ப உதவும்.'),
    },
    { name: 'phone', id: `${source}-phone`, label: t('Mobile (optional)', 'கைபேசி (விருப்பத்தேர்வு)'), type: 'tel', autoComplete: 'tel-national' },
    {
      name: 'partnerType', id: `${source}-type`, label: t('Organisation type', 'நிறுவன வகை'), type: 'select', required: true,
      placeholder: choose, options: opts(ENQUIRY_TYPES), defaultValue: type,
    },
    {
      name: 'topic', id: `${source}-topic`, label: t('What outcome are you looking for?', 'நீங்கள் எதிர்பார்க்கும் விளைவு என்ன?'), type: 'select',
      placeholder: choose, options: opts(ENQUIRY_TOPICS), defaultValue: topic,
    },
    {
      name: 'message', id: `${source}-message`, label: t('Your message', 'உங்கள் செய்தி'), type: 'textarea', required: true,
      hint: t(
        'Tender or EOI? Include the reference number and we will route it to the right team.',
        'டெண்டர் அல்லது EOI-ஆ? குறிப்பு எண்ணைச் சேர்த்தால், சரியான குழுவுக்கு அனுப்புகிறோம்.'
      ),
    },
  ];

  return (
    <SmartForm
      className={['partner-enquiry-form', className].filter(Boolean).join(' ')}
      type="enquiry"
      fields={fields}
      consents={[{
        purpose: 'partner',
        label: t('StartNet may use these details to reply to this enquiry.', 'இந்த விசாரணைக்குப் பதிலளிக்க StartNet இந்த விவரங்களைப் பயன்படுத்தலாம்.'),
        required: true,
      }]}
      submitLabel={t('Send message', 'செய்தியை அனுப்புங்கள்')}
      successTitle={t("Thanks. We've received your message.", 'நன்றி. உங்கள் செய்தி எங்களுக்குக் கிடைத்தது.')}
      // Same SLA line as every other partner surface (F-88).
      successBody={<p>{t(SLA_LINE, SLA_LINE_TA)}</p>}
      hidden={{
        source,
        lang,
        requestedType: type || undefined,
        requestedTopic: topic || undefined,
        requestedTopicRaw,
        ...Object.fromEntries(Object.entries(hidden).filter(([, v]) => v != null && v !== '')),
      }}
    />
  );
}
