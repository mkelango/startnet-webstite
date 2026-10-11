// /insights/newsletter — newsletter sign-up and archive (Book 1 Part B §2.2: T16 "Sign-up and archive", CTA Subscribe, P1).
// Copy: Book 2 footer newsletter strip (heading/body verbatim), §6.1 ("New data, once a quarter."), §13.2 newsletter
// microcopy, §13.3 WhatsApp microcopy, §14.3 Tamil CTAs. Book 1 Part A §8.2 (EN and தமிழ் editions), §10 (double opt-in).
// Interaction: Book 4 IX-30 (kit NewsletterForm: topic chips, language, separate unticked WhatsApp box).
// Data: GET /api/programmes, /api/events?when=upcoming, /api/ledger — used only to show what an issue carries today.
import { useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowRight, Mail, MessageCircle, Inbox, CalendarDays, Megaphone, BarChart3, Newspaper } from 'lucide-react';
import {
  Seo, PageHero, Section, SectionHeader, Button, Reveal, RevealGroup, Stat, Badge, NewsletterForm, WhatsAppButton,
  Accordion, EmptyState, InlineMarks, Skeleton,
} from '../../../components';
import { useApi } from '../../../hooks/useApi.js';
import { useLang } from '../../../lib/i18n.jsx';
import { formatDateShort } from '../../../lib/format.js';
import './Newsletter.css';
import { eventPath } from '../../../components/_utils.js';

const TOPIC_KEYS = ['ledger', 'vibe', 'connect', 'women', 'research'];

// Topic chips match the kit NewsletterForm values. Names from Book 2 (programme names stay in Latin script).
const TOPICS = [
  {
    key: 'ledger',
    name: 'Founder Ledger',
    body: ['New data, once a quarter, with a confidence tag on every figure.', 'காலாண்டுக்கு ஒருமுறை புதிய தரவு; ஒவ்வொரு எண்ணுக்கும் நம்பகத்தன்மைக் குறி.'],
  },
  {
    key: 'vibe',
    brand: 'vibe',
    name: 'StartNet Vibe',
    body: ['Vibathon, Vibe Campus build nights and Vibe Academy calls for students.', 'மாணவர்களுக்கான Vibathon, Vibe Campus build nights, Vibe Academy அழைப்புகள்.'],
  },
  {
    key: 'connect',
    brand: 'connect',
    name: 'StartNet Connect',
    body: ['Sector Connects for GenAI, SaaS and D2C, and Founder Switch for professionals.', 'GenAI, SaaS, D2C துறை Connect நிகழ்வுகள்; தொழில்முறையாளர்களுக்கு Founder Switch.'],
  },
  {
    key: 'women',
    brand: 'women',
    name: 'StartNet Women',
    body: ['Women Circles, Rise Academy and schemes for women-led startups.', 'Women Circles, Rise Academy, பெண்கள் தலைமையிலான ஸ்டார்ட்அப்களுக்கான திட்டங்கள்.'],
  },
  {
    key: 'research',
    brand: 'research',
    name: 'StartNet Research',
    body: ['Labs, the Scholar Founders Fellowship and problem statements.', 'Labs, Scholar Founders Fellowship, தீர்வு தேடும் பிரச்சினைகள்.'],
  },
];

// Book 2 §13.3 topics (all unticked in the WhatsApp flow).
const WA_TOPICS = [
  ['Events near me', 'எனக்கு அருகிலுள்ள நிகழ்வுகள்'],
  ['Programme calls', 'திட்ட அழைப்புகள்'],
  ['Vibathon', 'Vibathon'],
  ['Women Circles', 'Women Circles'],
  ['Founder Ledger', 'Founder Ledger'],
];

const OPEN_STATUS = ['open', 'closing', 'rolling'];
const LEDGER_GLANCE = ['founders-nurtured', 'startups-launched', 'capital-raised'];
const KPI_TA = {
  'founders-nurtured': 'வளர்க்கப்பட்ட நிறுவனர்கள் (L2+), இதுவரை',
  'startups-launched': 'தொடங்கப்பட்ட ஸ்டார்ட்அப்கள் (L5), மொத்தம்',
  'capital-raised': 'StartNet நிறுவனர்கள் திரட்டிய முதலீடு',
};

/** `data` marks an English-only record title (programme/event) as lang="en" on /ta pages; translated labels omit it. */
function ItemLink({ to, data = false, children }) {
  const { localePath, lang } = useLang();
  return (
    <Link className="newsletter-page-issue__link" to={localePath(to)} lang={data && lang === 'ta' ? 'en' : undefined}>
      {children}
    </Link>
  );
}

export default function Newsletter() {
  const { t, lang } = useLang();
  const [params] = useSearchParams();
  const topicParam = params.get('topic');
  const defaultTopics = useMemo(
    () => (topicParam || '').split(',').map((s) => s.trim().toLowerCase()).filter((s) => TOPIC_KEYS.includes(s)),
    [topicParam]
  );

  const programmes = useApi('/api/programmes');
  const events = useApi('/api/events?when=upcoming');
  const ledger = useApi('/api/ledger');

  const progList = Array.isArray(programmes.data) ? programmes.data : [];
  const openCalls = progList.filter((p) => OPEN_STATUS.includes(p.status)).slice(0, 3);
  const calls = openCalls.length ? openCalls : progList.slice(0, 3);
  const nextEvents = (Array.isArray(events.data) ? events.data : []).slice(0, 3);
  const glance = LEDGER_GLANCE.map((id) => (ledger.data?.kpis || []).find((k) => k.id === id || k.key === id)).filter((m) => m && m.value != null);
  const en = lang === 'ta' ? 'en' : undefined;

  const faq = [
    {
      id: 'nl-frequency',
      question: t('How often will you email me?', 'எவ்வளவு அடிக்கடி மின்னஞ்சல் அனுப்புவீர்கள்?'),
      answer: (
        <p>
          {/* "The newsletter goes out [frequency]." is left out until StartNet supplies the frequency. */}
          {t('The Founder Ledger topic carries new data once a quarter.', 'Founder Ledger தலைப்பில் காலாண்டுக்கு ஒருமுறை புதிய தரவு வரும்.')}
        </p>
      ),
    },
    {
      id: 'nl-language',
      question: t('Can I get it in Tamil?', 'தமிழில் பெற முடியுமா?'),
      answer: t(
        'Yes. There are English and தமிழ் editions. Choose your email language when you subscribe.',
        'ஆம். ஆங்கிலம், தமிழ் என இரண்டு பதிப்புகள் உள்ளன. பதிவு செய்யும்போதே மின்னஞ்சல் மொழியைத் தேர்ந்தெடுங்கள்.'
      ),
    },
    {
      id: 'nl-confirm',
      question: t('I subscribed but nothing arrived.', 'பதிவு செய்தேன், ஆனால் எதுவும் வரவில்லை.'),
      answer: t(
        'We ask you to confirm your email first. If the message isn’t there in five minutes, look in Promotions or Spam.',
        'முதலில் உங்கள் மின்னஞ்சலை உறுதிப்படுத்தச் சொல்கிறோம். ஐந்து நிமிடங்களில் வரவில்லை என்றால் Promotions அல்லது Spam-இல் பாருங்கள்.'
      ),
    },
    {
      id: 'nl-unsub',
      question: t('How do I unsubscribe?', 'பதிவை எப்படி நீக்குவது?'),
      answer: t(
        'Every email has a one-click unsubscribe link. We won’t email you again unless you sign up.',
        'ஒவ்வொரு மின்னஞ்சலிலும் ஒரே கிளிக்கில் பதிவை நீக்கும் இணைப்பு உண்டு. நீங்கள் மீண்டும் பதிவு செய்யாவிட்டால் மின்னஞ்சல் அனுப்ப மாட்டோம்.'
      ),
    },
    {
      id: 'nl-data',
      question: t('What do you do with my email?', 'என் மின்னஞ்சலை என்ன செய்வீர்கள்?'),
      answer: t(
        'We’ll only use your email for this newsletter. WhatsApp updates are a separate choice with their own consent. See our privacy notice.',
        'உங்கள் மின்னஞ்சலை இந்தச் செய்திமடலுக்கு மட்டுமே பயன்படுத்துவோம். WhatsApp தகவல்கள் தனி ஒப்புதலுடன் கூடிய தனித் தேர்வு. எங்கள் தனியுரிமை அறிவிப்பைப் பாருங்கள்.'
      ),
    },
  ];

  return (
    <div className="newsletter-page">
      <Seo
        // SEO-TA: pending native review
        title={t('StartNet newsletter: calls, events and Ledger data', 'StartNet செய்திமடல்: அழைப்புகள், நிகழ்வுகள், தரவு')}
        description={t(
          'One email with StartNet programme calls, Tamil Nadu event dates and the latest Founder Ledger figures. English or Tamil. Unsubscribe in one click.',
          'திட்ட அழைப்புகள், நிகழ்வுத் தேதிகள், சமீபத்திய Founder Ledger எண்கள் ஒரே மின்னஞ்சலில். ஆங்கிலம் அல்லது தமிழில். ஒரே கிளிக்கில் விலகலாம்.'
        )}
      />

      <PageHero
        eyebrow={t('The StartNet newsletter', 'StartNet செய்திமடல்')}
        title={t('One email. What opened, what happened, what’s next.', 'ஒரே மின்னஞ்சல். எது திறந்தது, என்ன நடந்தது, அடுத்தது என்ன.')}
        lede={
          <>
            {/* The ", [frequency — to be supplied by StartNet]" clause is left out until the frequency is supplied. */}
            {t(
              'Programme calls, event dates and the latest Founder Ledger figures',
              'திட்ட அழைப்புகள், நிகழ்வுத் தேதிகள், சமீபத்திய Founder Ledger எண்கள்'
            )}
            {t('. No spam, unsubscribe in one click.', '. ஸ்பேம் இல்லை; ஒரே கிளிக்கில் விலகலாம்.')}
          </>
        }
        breadcrumbs={[
          { label: t('Insights', 'நுண்ணறிவுகள்'), to: '/insights' },
          { label: t('Newsletter', 'செய்திமடல்') },
        ]}
        actions={
          <>
            <Button href="#newsletter-signup" icon={Mail}>{t('Subscribe', 'செய்திமடலைப் பெறுங்கள்')}</Button>
            <Button variant="tertiary" href="#newsletter-whatsapp" icon={MessageCircle}>
              {t('Get updates on WhatsApp', 'WhatsApp-இல் தகவல்களைப் பெறுங்கள்')}
            </Button>
          </>
        }
        art={{ variant: 'dot', seed: 13, label: t('English and தமிழ் editions', 'ஆங்கிலம், தமிழ் பதிப்புகள்') }}
      />

      {/* Sign-up + topics */}
      <Section surface="white" id="newsletter-signup" labelledBy="newsletter-topics-title" className="newsletter-page__signup">
        <div className="newsletter-page-signup">
          <Reveal className="newsletter-page-signup__form">
            <NewsletterForm defaultTopics={defaultTopics} />
            <p className="newsletter-page-signup__privacy">
              {t('We’ll only use your email for this newsletter.', 'உங்கள் மின்னஞ்சலை இந்தச் செய்திமடலுக்கு மட்டுமே பயன்படுத்துவோம்.')}{' '}
              <PrivacyLink />
            </p>
          </Reveal>
          <div className="newsletter-page-signup__topics">
            <SectionHeader
              id="newsletter-topics-title"
              eyebrow={t('Topics', 'தலைப்புகள்')}
              title={t('Choose what you hear about', 'நீங்கள் அறிய விரும்புவதைத் தேர்ந்தெடுங்கள்')}
              lede={t(
                'Pick one topic or all five, in the form. Each is about a different part of StartNet.',
                'படிவத்தில் ஒரு தலைப்பையோ ஐந்தையுமோ தேர்ந்தெடுங்கள். ஒவ்வொன்றும் StartNet-இன் ஒரு பகுதியைப் பற்றியது.'
              )}
            />
            <RevealGroup as="ul" className="newsletter-page-topics" role="list">
              {TOPICS.map((tp) => (
                <li key={tp.key} className="newsletter-page-topics__item" data-brand={tp.brand}>
                  <span className="newsletter-page-topics__rule" aria-hidden="true" />
                  <span className="newsletter-page-topics__name" lang={en}>{tp.name}</span>
                  <span className="newsletter-page-topics__body">{t(tp.body[0], tp.body[1])}</span>
                </li>
              ))}
            </RevealGroup>
          </div>
        </div>
      </Section>

      {/* Sample issue outline */}
      <Section surface="sunken" labelledBy="newsletter-issue-title">
        <div className="newsletter-page-issue-row">
        <SectionHeader
          className="newsletter-page-issue-row__head"
          id="newsletter-issue-title"
          eyebrow={t('Inside an issue', 'ஒரு இதழில் என்ன இருக்கும்')}
          title={t('What an issue would carry today', 'இன்று ஒரு இதழ் எதைக் கொண்டிருக்கும்')}
          lede={t(
            'A sample outline built from what is on the site right now. Real issues follow the same four parts.',
            'தளத்தில் இப்போது உள்ளவற்றைக் கொண்டு உருவாக்கிய மாதிரி வடிவம். உண்மையான இதழ்களும் இதே நான்கு பகுதிகளைப் பின்பற்றும்.'
          )}
        />
        <Reveal className="newsletter-page-issue" as="article" aria-label={t('Sample issue outline', 'மாதிரி இதழ் வடிவம்')}>
          <header className="newsletter-page-issue__head">
            <p><span className="newsletter-page-issue__k">{t('From', 'அனுப்புநர்')}</span> StartNet</p>
            {/* Subject line: hidden until StartNet supplies one per issue. */}
          </header>

          <ol className="newsletter-page-issue__parts">
            <li className="newsletter-page-issue__part">
              <h3 className="newsletter-page-issue__title"><Megaphone size={18} aria-hidden="true" /> {t('What opened', 'எது திறந்தது')}</h3>
              <p className="newsletter-page-issue__lede">{t('Programme calls you can apply to, with apply-by dates.', 'விண்ணப்பிக்கக்கூடிய திட்ட அழைப்புகள், கடைசித் தேதிகளுடன்.')}</p>
              {programmes.loading ? (
                <Skeleton height="3rem" count={2} />
              ) : calls.length ? (
                <ul className="newsletter-page-issue__items" role="list">
                  {calls.map((p) => (
                    <li key={p.slug}>
                      <ItemLink data to={typeof p.url === 'string' && p.url.startsWith('/') ? p.url : `/programmes/${p.slug}`}>{p.title}</ItemLink>
                      <Badge kind="status" status={p.status} />
                    </li>
                  ))}
                </ul>
              ) : null /* No open calls listed: no placeholder line. */}
            </li>

            <li className="newsletter-page-issue__part">
              <h3 className="newsletter-page-issue__title"><Newspaper size={18} aria-hidden="true" /> {t('What happened', 'என்ன நடந்தது')}</h3>
              <p className="newsletter-page-issue__lede">
                {t(
                  'Event recaps and founder stories, shared only with the founder’s written consent.',
                  'நிகழ்வுச் சுருக்கங்களும் நிறுவனர் கதைகளும், நிறுவனரின் எழுத்துப்பூர்வ ஒப்புதலுடன் மட்டும்.'
                )}
              </p>
              <p className="newsletter-page-issue__more">
                <ItemLink to="/insights/stories">{t('Founder stories', 'நிறுவனர் கதைகள்')} <ArrowRight size={14} aria-hidden="true" /></ItemLink>
              </p>
            </li>

            <li className="newsletter-page-issue__part">
              <h3 className="newsletter-page-issue__title"><CalendarDays size={18} aria-hidden="true" /> {t('What’s next', 'அடுத்தது என்ன')}</h3>
              <p className="newsletter-page-issue__lede">{t('Upcoming events. Most first events are free.', 'வரவிருக்கும் நிகழ்வுகள். பெரும்பாலான முதல் நிகழ்வுகள் இலவசம்.')}</p>
              {events.loading ? (
                <Skeleton height="3rem" count={2} />
              ) : nextEvents.length ? (
                <ul className="newsletter-page-issue__items" role="list">
                  {nextEvents.map((e) => (
                    <li key={e.slug}>
                      <ItemLink data to={eventPath(e)}>{e.title}</ItemLink>
                      <span className="newsletter-page-issue__when" lang={en}>
                        {e.dateLabel ? <InlineMarks text={e.dateLabel} /> : e.date ? formatDateShort(e.date) : null}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : null /* No upcoming events listed: no placeholder line. */}
            </li>

            <li className="newsletter-page-issue__part">
              <h3 className="newsletter-page-issue__title"><BarChart3 size={18} aria-hidden="true" /> {t('The Ledger at a glance', 'Ledger ஒரு பார்வையில்')}</h3>
              <p className="newsletter-page-issue__lede">{t('Headline figures from the latest Founder Ledger, each with its tag and as-at date.', 'சமீபத்திய Founder Ledger-இன் முக்கிய எண்கள்; ஒவ்வொன்றுக்கும் குறியும் நிலவரத் தேதியும்.')}</p>
              {ledger.loading ? (
                <Skeleton height="4rem" count={1} />
              ) : glance.length ? (
                <div className="newsletter-page-issue__stats">
                  {glance.map((m) => (
                    <Stat key={m.id} metric={{ ...m, label: t(m.label, KPI_TA[m.id]) }} variant="compact" />
                  ))}
                </div>
              ) : null /* No published Ledger figures: no placeholder line. */}
              <p className="newsletter-page-issue__more">
                <ItemLink to="/insights/founder-ledger">{t('Read the Founder Ledger', 'Founder Ledger-ஐப் படியுங்கள்')} <ArrowRight size={14} aria-hidden="true" /></ItemLink>
              </p>
            </li>
          </ol>

          <footer className="newsletter-page-issue__foot">
            {t('Every issue ends with a one-click unsubscribe link.', 'ஒவ்வொரு இதழின் இறுதியிலும் ஒரே கிளிக்கில் விலகும் இணைப்பு இருக்கும்.')}
          </footer>
        </Reveal>
        </div>
      </Section>

      {/* WhatsApp opt-in (Book 2 §13.3) */}
      <Section surface="paper" id="newsletter-whatsapp" labelledBy="newsletter-wa-title">
        <div className="newsletter-page-wa">
          <div className="newsletter-page-wa__text">
            <SectionHeader
              id="newsletter-wa-title"
              eyebrow="WhatsApp"
              title={t('Rather have it on WhatsApp?', 'WhatsApp-இல் பெற விரும்புகிறீர்களா?')}
              lede={t(
                'Short updates on the topics you choose. Your district helps us send only nearby events.',
                'நீங்கள் தேர்ந்தெடுக்கும் தலைப்புகளில் சுருக்கமான தகவல்கள். உங்கள் மாவட்டத்தைச் சொன்னால், அருகிலுள்ள நிகழ்வுகளை மட்டும் அனுப்புவோம்.'
              )}
            />
            <ul className="newsletter-page-wa__topics" role="list" aria-label={t('WhatsApp topics', 'WhatsApp தலைப்புகள்')}>
              {WA_TOPICS.map(([e, ta]) => (
                <li key={e}>{t(e, ta)}</li>
              ))}
            </ul>
            <div className="newsletter-page-wa__actions cluster">
              <WhatsAppButton
                text={t('Hi StartNet, please send me updates on WhatsApp.', 'வணக்கம் StartNet, WhatsApp-இல் எனக்குத் தகவல்கள் அனுப்புங்கள்.')}
                refCode="insights-newsletter"
                label={t('Get updates on WhatsApp', 'WhatsApp-இல் தகவல்களைப் பெறுங்கள்')}
              />
            </div>
          </div>
          <Reveal className="newsletter-page-wa__rules" delay={0.06}>
            <p className="newsletter-page-wa__rules-title"><Inbox size={18} aria-hidden="true" /> {t('How it works', 'எப்படிச் செயல்படுகிறது')}</p>
            <ul>
              <li>{t('Choose your topics and language: English or தமிழ்.', 'தலைப்புகளையும் மொழியையும் தேர்ந்தெடுங்கள்: ஆங்கிலம் அல்லது தமிழ்.')}</li>
              <li>{t('No messages between 9 p.m. and 8 a.m.', 'இரவு 9 மணி முதல் காலை 8 மணி வரை செய்திகள் இல்லை.')}</li>
              <li>{t('Reply STOP any time to opt out, or HELP to talk to a person.', 'எப்போது வேண்டுமானாலும் விலக STOP என்றும், ஒருவரிடம் பேச HELP என்றும் பதில் அனுப்புங்கள்.')}</li>
              <li>{t('WhatsApp is a separate choice from email, with its own consent box, unticked until you tick it.', 'WhatsApp என்பது மின்னஞ்சலிலிருந்து தனியான தேர்வு; அதற்கெனத் தனி ஒப்புதல் பெட்டி, நீங்கள் தேர்ந்தெடுக்கும் வரை காலியாகவே இருக்கும்.')}</li>
            </ul>
          </Reveal>
        </div>
      </Section>

      {/* Archive + FAQ */}
      <Section surface="white" labelledBy="newsletter-archive-title">
        <div className="newsletter-page-more">
          <div className="newsletter-page-more__archive">
            <SectionHeader id="newsletter-archive-title" eyebrow={t('Archive', 'காப்பகம்')} title={t('Past issues', 'முந்தைய இதழ்கள்')} />
            <EmptyState
              title={t('No issues yet.', 'இன்னும் இதழ்கள் இல்லை.')}
              body={t('Past issues will be listed here once the first one goes out.', 'முதல் இதழ் வெளியானதும் முந்தைய இதழ்கள் இங்கே பட்டியலிடப்படும்.')}
              action={
                <Button variant="tertiary" href="#newsletter-signup" icon={ArrowRight}>
                  {t('Subscribe', 'செய்திமடலைப் பெறுங்கள்')}
                </Button>
              }
            />
          </div>
          <div className="newsletter-page-more__faq">
            <SectionHeader eyebrow={t('Questions', 'கேள்விகள்')} title={t('Before you subscribe', 'பதிவு செய்யும் முன்')} />
            <Accordion items={faq} faq />
          </div>
        </div>
      </Section>
    </div>
  );
}

function PrivacyLink() {
  const { t, localePath } = useLang();
  return (
    <Link to={localePath('/legal/privacy')} className="newsletter-page-signup__privacy-link">
      {t('See our privacy notice', 'எங்கள் தனியுரிமை அறிவிப்பைப் பாருங்கள்')}
    </Link>
  );
}
