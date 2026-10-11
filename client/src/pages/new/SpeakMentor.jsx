// /events/speak — speaker and mentor sign-up, T13 form template (Book 1 Part B §2 sitemap, P2).
// Field names match server FORM_RULES.speak: name, email, phone, organisation, topic, link, message (+ extras kept).
import { Link } from 'react-router-dom';
import { ArrowDown, ArrowRight, Check, Mic, Users, CalendarClock, Languages } from 'lucide-react';
import { Seo, PageHero, Section, SmartForm, Button } from '../../components';
import { useLang } from '../../lib/i18n.jsx';
import './SpeakMentor.css';

// A profile link: http(s)://… or a bare LinkedIn path (linkedin.com/in/…, www.linkedin.com/…).
const LINKEDIN_BARE = /^(www\.)?linkedin\.com\/\S+$/i;
function isProfileLink(raw) {
  const v = String(raw || '').trim();
  if (!v) return true; // optional field
  if (/\s/.test(v)) return false;
  if (LINKEDIN_BARE.test(v)) return true;
  try {
    const u = new URL(v);
    return (u.protocol === 'http:' || u.protocol === 'https:') && u.hostname.includes('.');
  } catch {
    return false;
  }
}

export default function SpeakMentor() {
  const { t, lang, localePath } = useLang();

  const asks = [
    { icon: Mic, text: t('Share what you know: a talk, a panel, a workshop or office hours at a StartNet event.', 'உங்கள் அறிவைப் பகிருங்கள்: StartNet நிகழ்வில் உரை, குழு விவாதம், பயிலரங்கம் அல்லது ஆலோசனை நேரம்.') },
    { icon: Users, text: t('Mentor founders one to one, online or in person, in Tamil or English.', 'நிறுவனர்களுக்கு நேரிலோ இணையத்திலோ, தமிழிலோ ஆங்கிலத்திலோ தனிப்பட்ட வழிகாட்டுதல்.') },
    { icon: CalendarClock, text: t('Tell us how much time you can give. We match you to events and founders that fit.', 'எவ்வளவு நேரம் தர முடியும் என்று சொல்லுங்கள். பொருத்தமான நிகழ்வுகளுடனும் நிறுவனர்களுடனும் இணைப்போம்.') },
  ];
  const gets = [
    t('A clear brief before every session: audience, format, time and language.', 'ஒவ்வொரு அமர்வுக்கும் முன் தெளிவான விவரம்: பார்வையாளர், வடிவம், நேரம், மொழி.'),
    t('Credit on the event page and in the recap, with your permission.', 'உங்கள் அனுமதியுடன், நிகழ்வுப் பக்கத்திலும் சுருக்கத்திலும் உங்கள் பெயர்.'),
    t('A way to follow the founders you helped as they move up the ladder.', 'நீங்கள் உதவிய நிறுவனர்கள் ஏணியில் முன்னேறுவதைப் பின்தொடரும் வாய்ப்பு.'),
  ];

  return (
    <>
      <Seo
        // SEO-TA: pending native review
        title={t('Speak or mentor at startup events in Tamil Nadu', 'நிகழ்வுகளில் பேசுங்கள், வழிகாட்டுங்கள்')}
        description={t(
          'Speak at StartNet events or mentor founders in Tamil Nadu: summits, sector Connects and campus build nights. Tell us your topic and the time you can give.',
          'StartNet நிகழ்வில் பேசுங்கள் அல்லது தமிழ்நாடு முழுவதும் நிறுவனர்களுக்கு வழிகாட்டுங்கள். உங்கள் தலைப்பையும் தரக்கூடிய நேரத்தையும் சொல்லுங்கள்.'
        )}
      />

      <PageHero
        eyebrow={t('Events', 'நிகழ்வுகள்')}
        title={t('Speak or mentor at StartNet.', 'StartNet-இல் பேசுங்கள் அல்லது வழிகாட்டுங்கள்.')}
        lede={t(
          'Founders become mentors. If you have built, funded, researched or sold something, there is a room in Tamil Nadu that needs to hear it.',
          'நிறுவனர்கள் வழிகாட்டிகளாகிறார்கள். நீங்கள் எதையாவது உருவாக்கியிருந்தால், நிதியளித்திருந்தால், ஆய்வு செய்திருந்தால் அல்லது விற்றிருந்தால், அதைக் கேட்க வேண்டிய ஓர் அரங்கம் தமிழ்நாட்டில் உள்ளது.'
        )}
        breadcrumbs={[
          { label: t('Events', 'நிகழ்வுகள்'), to: '/events' },
          { label: t('Speak or mentor', 'பேசுங்கள் அல்லது வழிகாட்டுங்கள்') },
        ]}
        actions={
          <Button href="#speak-form" size="lg" icon={ArrowDown} data-primary-cta="">
            {t('Apply to speak or mentor', 'விண்ணப்பிக்கவும்')}
          </Button>
        }
      />

      {/* One band, two columns from 1024 px: what we ask / what you get on the left, the form in a flat card on the
          right. Each column keeps its own labelled region (ids and aria-labelledby unchanged). */}
      <Section className="speak-band">
        <div className="speak-grid">
          <section className="speak-info" aria-labelledby="speak-asks-title">
            <div className="speak-lists">
              <div className="speak-list">
                <h2 id="speak-asks-title" className="h4">{t('What we ask', 'நாங்கள் கேட்பது')}</h2>
                <ul role="list" className="speak-list__items">
                  {asks.map((a) => {
                    const Icon = a.icon;
                    return (
                      <li key={a.text} className="speak-list__item">
                        <Icon aria-hidden="true" size={20} strokeWidth={1.75} className="speak-list__icon" />
                        <span>{a.text}</span>
                      </li>
                    );
                  })}
                </ul>
              </div>
              <div className="speak-list">
                <h2 className="h4">{t('What you get', 'உங்களுக்குக் கிடைப்பது')}</h2>
                <ul role="list" className="speak-list__items">
                  {gets.map((g) => (
                    <li key={g} className="speak-list__item">
                      <Check aria-hidden="true" size={20} strokeWidth={2} className="speak-list__icon speak-list__icon--check" />
                      <span>{g}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          <section id="speak-form" className="speak-form-col" aria-labelledby="speak-form-title">
            <div className="speak-form" data-primary-cta="">
              <h2 id="speak-form-title" className="h3">{t('Tell us about you', 'உங்களைப் பற்றிச் சொல்லுங்கள்')}</h2>
              <p className="speak-form__intro">
                <Languages aria-hidden="true" size={18} />
                <span>{t('You can write in Tamil or English. Every field not marked optional is required.', 'தமிழிலோ ஆங்கிலத்திலோ எழுதலாம். "விருப்பம்" எனக் குறிக்கப்படாத புலங்கள் அனைத்தும் தேவை.')}</span>
              </p>
              <SmartForm
                type="speak"
                className="speak-form__form"
                fields={[
                  { name: 'name', id: 'speak-name', label: t('Your name', 'உங்கள் பெயர்'), required: true, autoComplete: 'name' },
                  { name: 'email', id: 'speak-email', label: t('Email', 'மின்னஞ்சல்'), type: 'email', required: true, autoComplete: 'email' },
                  { name: 'phone', id: 'speak-phone', label: t('Mobile (optional)', 'கைபேசி (விருப்பம்)'), type: 'tel', autoComplete: 'tel-national' },
                  { name: 'organisation', id: 'speak-org', label: t('Organisation (optional)', 'நிறுவனம் (விருப்பம்)'), autoComplete: 'organization' },
                  {
                    name: 'role', id: 'speak-role', label: t('I would like to', 'நான் விரும்புவது'), type: 'select', required: true,
                    // Field renders the single empty prompt option from `placeholder`.
                    placeholder: t('Choose one', 'ஒன்றைத் தேர்ந்தெடுக்கவும்'),
                    options: [
                      { value: 'speak', label: t('Speak at an event', 'நிகழ்வில் பேச') },
                      { value: 'mentor', label: t('Mentor founders', 'நிறுவனர்களுக்கு வழிகாட்ட') },
                      { value: 'both', label: t('Both', 'இரண்டும்') },
                    ],
                  },
                  {
                    name: 'topic', id: 'speak-topic', label: t('Your topic or expertise', 'உங்கள் தலைப்பு அல்லது நிபுணத்துவம்'), required: true,
                    hint: t('For example: first sales, GenAI products, grant applications, D2C brands.', 'எ.கா.: முதல் விற்பனை, GenAI தயாரிப்புகள், மானிய விண்ணப்பங்கள், D2C பிராண்டுகள்.'),
                  },
                  {
                    name: 'brand', id: 'speak-brand', label: t('Where would you like to help? (optional)', 'எங்கு உதவ விரும்புகிறீர்கள்? (விருப்பம்)'), type: 'select',
                    placeholder: t('Choose one (optional)', 'ஒன்றைத் தேர்ந்தெடுக்கவும் (விருப்பம்)'),
                    options: [
                      { value: 'any', label: t('Anywhere it fits', 'பொருந்தும் எங்கும்') },
                      { value: 'research', label: 'StartNet Research' },
                      { value: 'vibe', label: 'StartNet Vibe' },
                      { value: 'connect', label: 'StartNet Connect' },
                      { value: 'women', label: 'StartNet Women' },
                    ],
                  },
                  {
                    name: 'link', id: 'speak-link', label: t('Profile link (optional)', 'சுயவிவர இணைப்பு (விருப்பம்)'), type: 'url', autoComplete: 'url',
                    inputMode: 'url',
                    hint: t('LinkedIn, a website or a past talk.', 'LinkedIn, இணையதளம் அல்லது முந்தைய உரை.'),
                    validate: (v) => (isProfileLink(v) ? '' : t('Enter a link that starts with https://', 'https:// என்று தொடங்கும் இணைப்பை உள்ளிடவும்')),
                  },
                  { name: 'message', id: 'speak-message', label: t('Anything else? (optional)', 'வேறு ஏதேனும்? (விருப்பம்)'), type: 'textarea' },
                ]}
                consents={[
                  {
                    purpose: 'contact',
                    label: t('StartNet may use these details to contact me about speaking or mentoring.', 'பேசுதல் அல்லது வழிகாட்டுதல் குறித்து என்னைத் தொடர்புகொள்ள StartNet இந்த விவரங்களைப் பயன்படுத்தலாம்.'),
                    required: true,
                  },
                ]}
                submitLabel={t('Send my details', 'என் விவரங்களை அனுப்பு')}
                successTitle={t('Thanks. We will be in touch.', 'நன்றி. விரைவில் தொடர்புகொள்வோம்.')}
                successBody={t('We reply within two working days.', 'இரண்டு வேலை நாட்களுக்குள் பதிலளிக்கிறோம்.')}
                hidden={{ source: 'events-speak', lang }}
              />
            </div>
            <p className="speak-alt">
              {t('Want to host an event instead?', 'நிகழ்வை நடத்த விரும்புகிறீர்களா?')}{' '}
              <Link className="speak-link" to={localePath('/events#host')}>
                {t('Host an event', 'நிகழ்வை நடத்துங்கள்')} <ArrowRight aria-hidden="true" size={16} />
              </Link>
            </p>
          </section>
        </div>
      </Section>
    </>
  );
}
