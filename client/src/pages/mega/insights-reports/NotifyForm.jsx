// "Notify me" for planned reports, indices and the podcast (Book 2 §6.1 microcopy: "Planned. We'll publish the method before the first edition." `Notify me`).
// Posts to /api/forms/interest (fields: name?, email|phone, organisation?, programme = context).
import { SmartForm } from '../../../components';
import { useLang } from '../../../lib/i18n.jsx';

export default function NotifyForm({ context, what, submitLabel, withOrg = true, className }) {
  const { t } = useLang();
  const fields = [
    { name: 'name', label: t('Your name', 'உங்கள் பெயர்'), autoComplete: 'name', width: 'half' },
    { name: 'email', label: t('Email', 'மின்னஞ்சல்'), type: 'email', required: true, autoComplete: 'email', width: 'half' },
  ];
  if (withOrg) {
    fields.push({
      name: 'organisation',
      label: t('Organisation (optional)', 'அமைப்பு (விருப்பத்தேர்வு)'),
      autoComplete: 'organization',
    });
  }
  return (
    <SmartForm
      type="interest"
      className={className}
      fields={fields}
      consents={[
        {
          purpose: 'contact',
          required: true,
          label: t(
            `Email me when ${what} is published. My details are used only for this.`,
            `${what} வெளியானதும் எனக்கு மின்னஞ்சல் அனுப்புங்கள். என் விவரங்கள் இதற்கு மட்டுமே பயன்படுத்தப்படும்.`,
          ),
        },
      ]}
      hidden={{ programme: context, source: 'insights' }}
      submitLabel={submitLabel || t('Notify me', 'எனக்கு அறிவியுங்கள்')}
      successTitle={t("You're on the list.", 'நீங்கள் பட்டியலில் சேர்க்கப்பட்டீர்கள்.')}
      successBody={t(
        `We'll email you when ${what} is published.`,
        `${what} வெளியானதும் உங்களுக்கு மின்னஞ்சல் அனுப்புவோம்.`,
      )}
    />
  );
}
