import { Link, useSearchParams } from 'react-router-dom';
import { ArrowRight, MessageCircle, Mail, Handshake, Layers, Newspaper, Briefcase, ShieldCheck } from 'lucide-react';
import {
  Seo, PageHero, Section, SectionHeader, SmartForm, Button, ArtImage, Placeholder, Reveal, RevealGroup,
} from '../../components';
import { useLang } from '../../lib/i18n.jsx';
import { webPageLd, langPath, ORG_REF } from '../../lib/seo.js';
import { waLink } from '../../lib/links.js';
import './Contact.css';
import './restKit.css';

// Book 2 §11 Contact + §13.5 form; Book 1 Part B §2.2 (general form, WhatsApp, offices, grievance officer).
const TOPICS = ['Programmes', 'Events', 'Partnership', 'Sponsorship', 'CSR', 'Media', 'Careers', 'Data protection', 'Founder Ledger correction', 'Other'];
// Tamil labels for the topic select. Values stay English so the stored topic and deep links do not change.
const TOPICS_TA = {
  Programmes: 'திட்டங்கள்',
  Events: 'நிகழ்வுகள்',
  Partnership: 'கூட்டாண்மை',
  Sponsorship: 'ஸ்பான்சர்ஷிப்',
  CSR: 'CSR',
  Media: 'ஊடகம்',
  Careers: 'பணி வாய்ப்புகள்',
  'Data protection': 'தரவுப் பாதுகாப்பு',
  'Founder Ledger correction': 'Founder Ledger திருத்தம்',
  Other: 'மற்றவை',
};
const BRAND_MAILS = ['research', 'vibe', 'connect', 'women'];
// Company record (public): MCA master data and StartNet's LinkedIn page, confirmed by StartNet, Oct 2026.
const LEGAL_ENTITY = 'StartNet Ventures Private Limited';
const LEGAL_CIN = 'U70200TZ2023PTC028823';
const REGISTERED_OFFICE = '112/2F4, Fairlands, 3rd Cross Street, Fairlands, Salem, Tamil Nadu 636016';
const MAP_QUERY = 'StartNet, Sri Devaki Complex, 131/5, Nagaramalai Main Road, NDS Nagar, New Fairlands, Alagapuram Periyaputhur, Salem, Tamil Nadu 636016';
const OFFICE_ADDRESS = '5, 1st Floor, Sri Devaki Complex, 131/5, Nagaramalai Main Road, NDS Nagar, New Fairlands, Alagapuram Periyaputhur, Salem, Tamil Nadu 636016';
// Deep links from elsewhere on the site (?topic=correction from the Founder Ledger, ?topic=briefing from Reports,
// ?topic=data-rights from StartNet X Trust) map onto a topic above.
const TOPIC_ALIASES = {
  correction: 'Founder Ledger correction',
  corrections: 'Founder Ledger correction',
  'founder-ledger-correction': 'Founder Ledger correction',
  briefing: 'Media',
  press: 'Media',
  'data-rights': 'Data protection',
  'data protection': 'Data protection',
  'data-protection': 'Data protection',
  grievance: 'Data protection',
  partnership: 'Partnership',
  partner: 'Partnership',
  sponsor: 'Sponsorship',
  career: 'Careers',
  jobs: 'Careers',
  programme: 'Programmes',
  event: 'Events',
};
const matchTopic = (raw) => {
  const key = String(raw || '').trim().toLowerCase();
  if (!key) return '';
  const aliased = TOPIC_ALIASES[key] || TOPIC_ALIASES[key.replace(/[\s_]+/g, '-')];
  if (aliased) return aliased;
  return TOPICS.find((x) => x.toLowerCase() === key || x.toLowerCase().replace(/\s+/g, '-') === key) || '';
};

export default function Contact() {
  const { t, localePath, lang } = useLang();
  const [params] = useSearchParams();
  const topic = matchTopic(params.get('topic'));

  const routes = [
    {
      icon: Layers,
      title: t('Programmes and events', 'திட்டங்களும் நிகழ்வுகளும்'),
      body: <><a href="mailto:hello@startnet.in">hello@startnet.in</a></>,
      action: (
        <Button variant="whatsapp" size="md" icon={MessageCircle} href={waLink('Hi StartNet, I have a question about programmes and events', `contact, ${lang}`)}>
          {t('Chat on WhatsApp', 'WhatsApp-இல் பேசுங்கள்')}
        </Button>
      ),
    },
    {
      icon: Handshake,
      title: t('Partnerships', 'கூட்டாண்மைகள்'),
      note: t('Institutions, GCCs, government, sponsors, CSR', 'கல்வி நிறுவனங்கள், GCC-கள், அரசு, ஸ்பான்சர்கள், CSR'),
      body: <><a href="mailto:partners@startnet.in">partners@startnet.in</a></>,
      action: <Link className="contact-link" to={localePath('/partner/enquire')}>{t('Start a partner enquiry', 'கூட்டாளர் விசாரணையைத் தொடங்குங்கள்')} <ArrowRight aria-hidden="true" size={16} /></Link>,
    },
    {
      icon: Mail,
      title: t('Brand teams', 'பிராண்ட் குழுக்கள்'),
      body: (
        <>
          {/* Full addresses as link text, so each link makes sense on its own (WCAG 2.4.4). */}
          <span className="contact-brandmails">
            {BRAND_MAILS.map((b) => (
              <a key={b} href={`mailto:${b}@startnet.in`} data-brand={b}>{b}@startnet.in</a>
            ))}
          </span>{' '}
          <Placeholder>[confirm]</Placeholder>
        </>
      ),
    },
    {
      icon: Newspaper,
      title: t('Media', 'ஊடகம்'),
      note: t('Press enquiries', 'பத்திரிகை விசாரணைகள்'), // SEO-TA: pending native review
      body: <><a href="mailto:press@startnet.in">press@startnet.in</a></>,
      action: <Link className="contact-link" to={localePath('/media')}>{t('Media centre', 'ஊடக மையம்')} <ArrowRight aria-hidden="true" size={16} /></Link>,
    },
    {
      icon: Briefcase,
      title: t('Careers', 'பணி வாய்ப்புகள்'),
      body: <><a href="mailto:careers@startnet.in">careers@startnet.in</a></>,
      action: <Link className="contact-link" to={localePath('/careers')}>{t('Open roles', 'திறந்த பணியிடங்கள்')} <ArrowRight aria-hidden="true" size={16} /></Link>,
    },
    {
      icon: ShieldCheck,
      title: t('Data protection and grievances', 'தரவுப் பாதுகாப்பும் குறைகளும்'),
      // Grievance and privacy contact confirmed by StartNet, 10 Oct 2026.
      body: <><a href="mailto:nagaraj@startnet.in">nagaraj@startnet.in</a></>,
      action: <a className="contact-link" href="#grievance">{t('Grievance officer', 'குறைதீர்ப்பு அலுவலர்')} <ArrowRight aria-hidden="true" size={16} /></a>,
    },
  ];

  return (
    <>
      <Seo
        // SEO-TA: pending native review
        title={t('Contact StartNet: programmes, events, partnerships', 'StartNet-ஐத் தொடர்புகொள்ளுங்கள்: திட்டங்கள், நிகழ்வுகள்')}
        jsonLd={webPageLd({ path: langPath('/contact', lang), type: 'ContactPage', lang, name: t('Contact StartNet', 'StartNet-ஐத் தொடர்புகொள்ள'), about: ORG_REF })}
        description={t(
          'Reach the right StartNet team: programmes, events, partnerships, media, careers or data protection. WhatsApp, email or the contact form.',
          'சரியான StartNet குழுவை அணுகுங்கள்: திட்டங்கள், நிகழ்வுகள், கூட்டாண்மைகள், ஊடகம், பணி, தரவுப் பாதுகாப்பு. WhatsApp, மின்னஞ்சல் அல்லது படிவம்.'
        )}
      />

      <PageHero
        className="rk-page"
        eyebrow={t('Contact', 'தொடர்புக்கு')}
        title={t('Talk to the right team.', 'சரியான குழுவிடம் பேசுங்கள்.')}
        lede={lang === 'ta'
          ? 'உங்களுக்கு என்ன தேவை என்று சொல்லுங்கள்; சரியான குழுவுக்கு அனுப்புவோம். இரண்டு வேலை நாட்களுக்குள் பதிலளிக்கிறோம்.' // SEO-TA: pending native review
          : "Tell us what you need and we'll route it. We reply within two working days."}
        breadcrumbs={[{ label: t('Contact', 'தொடர்புக்கு') }]}
        actions={
          <>
            <Button href="#contact-form" size="lg">{t('Send a message', 'செய்தி அனுப்புங்கள்')}</Button>
            <Button variant="tertiary" size="lg" icon={MessageCircle} href={waLink('Hi StartNet', `contact, ${lang}`)}>
              {t('Chat on WhatsApp', 'WhatsApp-இல் பேசுங்கள்')}
            </Button>
          </>
        }
      />

      {/* Quick routes */}
      <Section surface="white">
        <SectionHeader
          eyebrow={t('Quick routes', 'விரைவு வழிகள்')}
          title={t('Go straight to the team you need.', 'உங்களுக்குத் தேவையான குழுவிடம் நேரடியாகச் செல்லுங்கள்.')}
          as="h2"
        />
        <RevealGroup as="ul" className="contact-routes">
          {routes.map((r) => {
            const Icon = r.icon;
            return (
              <li key={r.title} className="contact-route">
                <Icon aria-hidden="true" size={24} strokeWidth={1.75} className="contact-route__icon" />
                <h3 className="h5">{r.title}</h3>
                {r.note && <p className="contact-route__note">{r.note}</p>}
                {r.body && <p className="contact-route__body">{r.body}</p>}
                {r.action && <div className="contact-route__action">{r.action}</div>}
              </li>
            );
          })}
        </RevealGroup>
      </Section>

      {/* Form */}
      <Section id="contact-form">
        <div className="contact-formwrap">
          <div className="contact-formwrap__intro">
            <p className="eyebrow">{t('Write to us', 'எங்களுக்கு எழுதுங்கள்')}</p>
            <h2 className="h2">{t('Send a message', 'செய்தி அனுப்புங்கள்')}</h2>
            <p className="body-lg text-2">
              {t(
                "Tell us what you need and we'll route it. Partnerships have their own form, so we can route them to a named owner.",
                'உங்களுக்கு என்ன தேவை என்று சொல்லுங்கள்; சரியான குழுவுக்கு அனுப்புவோம். கூட்டாண்மைகளுக்குத் தனிப் படிவம் உள்ளது; அவற்றைப் பெயரிடப்பட்ட பொறுப்பாளரிடம் சேர்ப்போம்.'
              )}
            </p>
            <Link className="contact-link" to={localePath('/partner/enquire')}>{t('Partner enquiry form', 'கூட்டாளர் விசாரணைப் படிவம்')} <ArrowRight aria-hidden="true" size={16} /></Link>
          </div>
          <div className="contact-formwrap__form">
            <SmartForm
              type="contact"
              fields={[
                { name: 'name', id: 'contact-name', label: t('Your name', 'உங்கள் பெயர்'), required: true, autoComplete: 'name' },
                { name: 'email', id: 'contact-email', label: t('Email', 'மின்னஞ்சல்'), type: 'email', required: true, autoComplete: 'email' },
                { name: 'phone', id: 'contact-phone', label: t('Mobile (optional)', 'கைபேசி (விருப்பம்)'), type: 'tel', autoComplete: 'tel-national' },
                { name: 'organisation', id: 'contact-org', label: t('Organisation (optional)', 'நிறுவனம் (விருப்பம்)'), autoComplete: 'organization' },
                {
                  name: 'topic', id: 'contact-topic', label: t("I'm writing about…", 'நான் எழுதுவது இதைப் பற்றி…'), type: 'select', required: true,
                  // Field renders the single empty prompt option from `placeholder`.
                  placeholder: t('Choose one', 'ஒன்றைத் தேர்ந்தெடுக்கவும்'),
                  options: TOPICS.map((x) => ({ value: x, label: t(x, TOPICS_TA[x]) })),
                  defaultValue: topic,
                },
                { name: 'message', id: 'contact-message', label: t('Your message', 'உங்கள் செய்தி'), type: 'textarea', required: true },
              ]}
              consents={[{
                purpose: 'contact',
                label: t('StartNet may use these details to reply to this enquiry.', 'இந்த விசாரணைக்குப் பதிலளிக்க StartNet இந்த விவரங்களைப் பயன்படுத்தலாம்.'),
                required: true,
              }]}
              submitLabel={t('Send message', 'செய்தியை அனுப்பு')}
              successTitle={t("Thanks. We've received your message.", 'நன்றி. உங்கள் செய்தி எங்களுக்குக் கிடைத்தது.')}
              successBody={t(
                'We reply within two working days.',
                'இரண்டு வேலை நாட்களுக்குள் பதிலளிக்கிறோம்.'
              )}
              hidden={{ source: 'contact', lang, requestedTopic: topic || undefined }}
            />
          </div>
        </div>
      </Section>

      {/* Office + grievance */}
      <Section surface="white">
        <div className="contact-office">
          <Reveal className="contact-office__card">
            <p className="eyebrow">{t('Office', 'அலுவலகம்')}</p>
            {/* Salem headquarters. Office address: StartNet's LinkedIn page; registered office: MCA record of StartNet
                Ventures Private Limited (CIN U70200TZ2023PTC028823). SEO-TA: pending native review */}
            <h2 className="h3">{t('Salem, Tamil Nadu', 'சேலம், தமிழ்நாடு')}</h2>
            {/* Hairline rows: key small and muted above the value (AngelList contact rows). */}
            <ul role="list" className="contact-office__list">
              <li>
                <span className="contact-office__k">{t('Office', 'அலுவலகம்')}:</span>{' '}
                <span className="contact-office__v" translate="no">{OFFICE_ADDRESS}</span>
              </li>
              <li>
                <span className="contact-office__k">{t('Registered office', 'பதிவு அலுவலகம்')} ({LEGAL_ENTITY}, CIN {LEGAL_CIN}):</span>{' '}
                <span className="contact-office__v" translate="no">{REGISTERED_OFFICE}</span>
              </li>
            </ul>
            {/* Opening hours and a map link: add here when StartNet supplies them. */}
          </Reveal>
          <Reveal delay={0.06} className="contact-office__art">
            {/* Real map of the Salem office (Google Maps embed; CSP frame-src allows www.google.com). */}
            <div className="contact-map">
              <iframe
                className="contact-map__frame"
                src={`https://www.google.com/maps?q=${encodeURIComponent(MAP_QUERY)}&z=17&output=embed`}
                title={t('Map: StartNet office, Salem', 'வரைபடம்: StartNet அலுவலகம், சேலம்')}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
            <a className="contact-link contact-map__link" href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(MAP_QUERY)}`} target="_blank" rel="noopener noreferrer">
              {t('Open in Google Maps', 'Google Maps-இல் திறக்க')} <ArrowRight aria-hidden="true" size={16} />
              <span className="visually-hidden">{t(' (opens in a new tab)', ' (புதிய தாவலில் திறக்கும்)')}</span>
            </a>
          </Reveal>

          <div className="contact-grievance" id="grievance">
          <Reveal delay={0.1}>
            <p className="eyebrow">{t('Data protection', 'தரவுப் பாதுகாப்பு')}</p>
            <h2 className="h3">{t('Grievance officer', 'குறைதீர்ப்பு அலுவலர்')}</h2>
            <p className="text-2">
              {t(
                'To view, correct or delete your data, withdraw a consent, or raise a complaint about how we handle your personal data, write to our Grievance officer.',
                'உங்கள் தரவைப் பார்க்க, திருத்த அல்லது நீக்க, ஓர் ஒப்புதலைத் திரும்பப் பெற, அல்லது உங்கள் தனிப்பட்ட தரவை நாங்கள் கையாளும் விதம் குறித்துப் புகார் அளிக்க, எங்கள் குறைதீர்ப்பு அலுவலருக்கு எழுதுங்கள்.'
              )}
            </p>
            <dl className="contact-grievance__list">
              <div><dt>{t('Email', 'மின்னஞ்சல்')}</dt><dd><a href="mailto:nagaraj@startnet.in">nagaraj@startnet.in</a></dd></div>
              <div><dt>{t('Address', 'முகவரி')}</dt><dd>{LEGAL_ENTITY}, <span translate="no">{REGISTERED_OFFICE}</span></dd></div>
            </dl>
            <div className="cluster">
              <Link className="contact-link" to={localePath('/legal/data-rights')}>{t('Your data rights', 'உங்கள் தரவு உரிமைகள்')} <ArrowRight aria-hidden="true" size={16} /></Link>
              <Link className="contact-link" to={localePath('/legal/privacy')}>{t('Privacy notice', 'தனியுரிமை அறிவிப்பு')} <ArrowRight aria-hidden="true" size={16} /></Link>
            </div>
          </Reveal>
          </div>
        </div>
      </Section>
    </>
  );
}
