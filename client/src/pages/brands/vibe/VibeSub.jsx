import { useParams } from 'react-router-dom';
import {
  Code2, Boxes, PenTool, Megaphone, Moon, Mic, Flame, Lightbulb, Users, Hammer, CalendarDays, Ticket,
  MessagesSquare, SearchCheck, Building, Landmark, MessageCircle, BadgeCheck,
} from 'lucide-react';
import { useApi } from '../../../hooks/useApi.js';
import { useLang } from '../../../lib/i18n.jsx';
import { snxLink, waLink } from '../../../lib/links.js';
import {
  Seo, BrandHero, Breadcrumbs, Section, SectionHeader, Button, Badge, Stat, KeyFacts, Steps, CTABand, Reveal,
  RevealGroup, ProgrammeCard, SmartForm, EmptyState, Dot,
} from '../../../components';
import NotFound from '../../utility/NotFound.jsx';
import VibeEvents from './parts/VibeEvents.jsx';
import { ph } from './parts/ph.jsx';
import { VIBE_SUB, VIBE_PROOF, tx, tr, localiseMetric } from './vibeContent.js';
import '../brandPage.css';
import './VibeSub.css';
import { courseLd } from '../../../lib/seo.js';
import { pageLd } from '../seoBits.js';

/* ------------------------------------------------------------------ shared bits */

function IconList({ items, className = '' }) {
  return (
    <RevealGroup as="ul" className={`vibe-sub__icons ${className}`}>
      {items.map(({ icon: Icon, title, body }) => (
        <li key={title} className="vibe-sub__icon-item">
          <span className="vibe-sub__icon" aria-hidden="true"><Icon size={26} strokeWidth={1.75} /></span>
          <span className="vibe-sub__icon-title">{title}</span>
          {body && <span className="vibe-sub__icon-body">{ph(body)}</span>}
        </li>
      ))}
    </RevealGroup>
  );
}

function Statement({ eyebrow, children, id }) {
  return (
    <Section surface="paper" labelledBy={id}>
      <Reveal className="vibe-sub__statement">
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h2 id={id} className="h1 vibe-sub__statement-text">{children}</h2>
      </Reveal>
    </Section>
  );
}

/** Vibe programmes from the API whose slug matches; renders nothing when none. */
function RelatedProgrammes({ match, title }) {
  const { t } = useLang();
  const { data } = useApi('/api/programmes?brand=vibe');
  const items = (Array.isArray(data) ? data : []).filter((p) => !match || p.slug?.includes(match));
  if (!items.length) return null;
  return (
    <Section surface="white">
      <SectionHeader as="h2" eyebrow={tx(t, 'Programmes')} title={title || t('Open now', 'இப்போது திறந்துள்ளவை')} />
      <RevealGroup className={items.length === 1 ? 'vibe-sub__programmes vibe-sub__programmes--single' : `grid ${items.length === 2 ? 'grid-2' : 'grid-3'} vibe-sub__programmes`}>
        {items.slice(0, 3).map((p) => <ProgrammeCard key={p.slug} programme={p} />)}
      </RevealGroup>
    </Section>
  );
}

const planningNote = (t) => t('Planning assumption.', 'திட்ட அனுமானம்.');

/* ------------------------------------------------------------------ Academy */

function Academy() {
  const { t, lang } = useLang();
  const courses = snxLink('/learn', { brand: 'vibe', src: 'vibe-academy', lang });
  const browse = t('Browse courses', 'பாடநெறிகளைப் பாருங்கள்');
  return (
    <>
      <Section surface="white" labelledBy="vibe-academy-what">
        <div className="split split--8-4 vibe-sub__split">
          <div className="vibe-sub__stack">
            <SectionHeader as="h2" eyebrow={t('What you learn', 'நீங்கள் கற்பது')} title={<span id="vibe-academy-what">{t('Four ways to build in the AI era', 'AI காலத்தில் உருவாக்க நான்கு வழிகள்')}</span>} />
            <IconList
              items={[
                { icon: Code2, title: t('AI-assisted coding', 'AI உதவியுடன் கோடிங்') },
                { icon: Boxes, title: t('Product', 'தயாரிப்பு') },
                { icon: PenTool, title: t('Design', 'வடிவமைப்பு') },
                { icon: Megaphone, title: t('Go-to-market', 'சந்தைக்குக் கொண்டு செல்லுதல்') },
              ]}
            />
            <div className="vibe-sub__langs">
              <span className="vibe-sub__lang" lang="en">English</span>
              <span className="vibe-sub__lang vibe-sub__lang--ta" lang="ta">தமிழ்</span>
              <span className="small text-2">{t('In cohorts or at your own pace.', 'குழுக்களாகவோ உங்கள் வேகத்திலோ.')}</span>
            </div>
          </div>
          <KeyFacts
            items={[
              { label: t('Format', 'வடிவம்'), value: t('Cohorts or self-paced', 'குழுக்களாக அல்லது சுய வேகத்தில்') },
              { label: t('Language', 'மொழி'), value: t('Tamil or English', 'தமிழ் அல்லது ஆங்கிலம்') },
              {
                label: t('Fee', 'கட்டணம்'),
                value: <Stat value={999} prefix="₹" label={t('from, per course', 'ஒரு பாடநெறிக்கு, இதிலிருந்து')} tag="C" note={planningNote(t)} source={t('StartNet planning rate card', 'StartNet திட்டக் கட்டண அட்டவணை')} variant="compact" />,
              },
              { label: t('Free', 'இலவசம்'), value: t('Starter courses on StartNet X', 'StartNet X-இல் தொடக்கப் பாடநெறிகள்') },
              { label: t('Credits', 'மதிப்பெண் வரவு'), value: t('Where your college allows', 'உங்கள் கல்லூரி அனுமதிக்கும் இடங்களில்') },
            ]}
            action={<Button variant="brand" full href={courses}>{browse}</Button>}
          />
        </div>
      </Section>
      <Statement eyebrow={t('How the certificate works', 'சான்றிதழ் எப்படிச் செயல்படுகிறது')} id="vibe-academy-cert">
        {t('Our certificate says "shipped with users", not "attended"', 'எங்கள் சான்றிதழ் "கலந்துகொண்டார்" என்று அல்ல, "பயனர்களுடன் வெளியிட்டார்" என்று சொல்கிறது')}<Dot />
      </Statement>
      <RelatedProgrammes match="academy" title={t('Vibe Academy courses open now', 'இப்போது திறந்துள்ள Vibe Academy பாடநெறிகள்')} />
      <CTABand
        surface="paper"
        brand="vibe"
        className="brand-close"
        title={t('Start with a free starter course.', 'இலவசத் தொடக்கப் பாடநெறியுடன் தொடங்குங்கள்.')}
        body={t('Students get 50% off StartNet X Pro.', 'மாணவர்களுக்கு StartNet X Pro-வில் 50% தள்ளுபடி.')}
        actions={
          <>
            <Button variant="brand" href={courses}>{browse}</Button>
            <Button variant="secondary" href={snxLink('/signup', { brand: 'vibe', src: 'vibe-academy', lang })}>{tx(t, 'Create your free profile')}</Button>
          </>
        }
      />
    </>
  );
}

/* ------------------------------------------------------------------ Campus */

function Campus() {
  const { t } = useLang();
  const host = t('Host Vibe Campus', 'Vibe Campus-ஐ நடத்துங்கள்');
  const see = t('See campus events', 'கல்லூரி நிகழ்வுகளைப் பாருங்கள்');
  return (
    <>
      <Section surface="white" labelledBy="vibe-campus-formats">
        <SectionHeader
          as="h2"
          eyebrow={t('What happens on campus', 'கல்லூரியில் என்ன நடக்கிறது')}
          title={<span id="vibe-campus-formats">{t('Build nights, talks, firesides and pitches', 'உருவாக்க இரவுகள், உரைகள், கலந்துரையாடல்கள், முன்வைப்புகள்')}</span>}
          lede={t("Hosted with your Institution's Innovation Council.", 'உங்கள் கல்லூரியின் புத்தாக்கக் குழு (IIC) உடன் இணைந்து நடத்தப்படுகிறது.')}
        />
        <IconList
          className="vibe-sub__icons--4"
          items={[
            { icon: Moon, title: t('Build nights', 'உருவாக்க இரவுகள்') },
            { icon: Mic, title: t('Talks', 'உரைகள்') },
            { icon: Flame, title: t('Founder fireside chats', 'நிறுவனர்களுடன் கலந்துரையாடல்') },
            { icon: Lightbulb, title: t('Idea pitches', 'யோசனை முன்வைப்புகள்') },
          ]}
        />
      </Section>
      <Section surface="paper" labelledBy="vibe-campus-paths">
        <h2 id="vibe-campus-paths" className="visually-hidden">{t('Two ways to take part', 'பங்கேற்க இரண்டு வழிகள்')}</h2>
        <div className="vibe-sub__paths">
          <Reveal className="vibe-sub__path">
            <p className="eyebrow">{t('For colleges', 'கல்லூரிகளுக்கு')}</p>
            <h3 className="h3">{host}</h3>
            <p className="text-2">{t(
              'A series of events in your college, run with your IIC. Vibe Campus nights are also where Vibathon warm-ups happen.',
              'உங்கள் IIC உடன் இணைந்து உங்கள் கல்லூரியில் தொடர் நிகழ்வுகள். Vibathon ஆயத்த நிகழ்வுகளும் Vibe Campus இரவுகளில்தான் நடக்கின்றன.'
            )}</p>
            <Button variant="brand" to="/vibe/for-colleges">{host}</Button>
          </Reveal>
          <Reveal className="vibe-sub__path" delay={0.06}>
            <p className="eyebrow">{t('For students', 'மாணவர்களுக்கு')}</p>
            <h3 className="h3">{see}</h3>
            <p className="text-2">{t(
              'Find a build night near you, or start a Vibe Club and run one each term.',
              'உங்கள் அருகில் உள்ள உருவாக்க இரவைக் கண்டறியுங்கள், அல்லது Vibe Club-ஐத் தொடங்கி ஒவ்வொரு பருவத்திலும் ஒன்றை நடத்துங்கள்.'
            )}</p>
            <div className="cluster">
              <Button variant="secondary" href="#events">{see}</Button>
              <Button variant="tertiary" to="/vibe/clubs">{t('Start a Vibe Club', 'Vibe Club-ஐத் தொடங்குங்கள்')}</Button>
            </div>
          </Reveal>
        </div>
        <p className="vibe-sub__note">
          {t('One Vibe Summit each year is the state finale.', 'ஒவ்வோர் ஆண்டும் ஒரு Vibe Summit மாநில இறுதி நிகழ்வாக நடக்கிறது.')} <Button variant="tertiary" to="/vibe/summit">Vibe Summit</Button>
        </p>
      </Section>
      <Section surface="white" id="events" labelledBy="vibe-campus-events">
        <SectionHeader as="h2" eyebrow={tx(t, 'Events')} title={<span id="vibe-campus-events">{t('Campus events', 'கல்லூரி நிகழ்வுகள்')}</span>} action={<Button variant="tertiary" to="/events?brand=vibe">{tx(t, 'See upcoming events')}</Button>} />
        <VibeEvents waRef="vibe-campus" label={t('Upcoming Vibe Campus events', 'வரவிருக்கும் Vibe Campus நிகழ்வுகள்')} />
      </Section>
    </>
  );
}

/* ------------------------------------------------------------------ Launchpad */

function Launchpad() {
  const { t, lang } = useLang();
  const apply = snxLink('/programmes/vibe-launchpad', { brand: 'vibe', src: 'vibe-launchpad', lang });
  const applyLabel = t('Apply to Launchpad', 'Launchpad-க்கு விண்ணப்பியுங்கள்');
  return (
    <>
      <Section surface="white" labelledBy="vibe-launchpad-what">
        <div className="split split--8-4 vibe-sub__split">
          <div className="vibe-sub__stack">
            <SectionHeader as="h2" eyebrow={t('What you get', 'உங்களுக்குக் கிடைப்பவை')} title={<span id="vibe-launchpad-what">{t('Twelve weeks, four things', 'பன்னிரண்டு வாரங்கள், நான்கு விஷயங்கள்')}</span>} />
            <IconList
              items={[
                { icon: CalendarDays, title: t('Weekly mentor sessions', 'வாராந்திர வழிகாட்டி அமர்வுகள்') },
                { icon: SearchCheck, title: t('Customer validation', 'வாடிக்கையாளர் சரிபார்ப்பு') },
                { icon: Building, title: t('Company formation basics', 'நிறுவனம் தொடங்குவதன் அடிப்படைகள்') },
                {
                  icon: Landmark,
                  title: t('Help applying', 'விண்ணப்பிக்க உதவி'),
                  body: t("to partner incubators and state seed schemes such as StartupTN's TANSEED", 'கூட்டாளர் இன்குபேட்டர்கள், StartupTN-இன் TANSEED போன்ற மாநில விதை நிதித் திட்டங்களுக்கு'),
                },
              ]}
            />
            <div className="vibe-sub__weeks" aria-hidden="true">
              {Array.from({ length: 12 }, (_, i) => <span key={i} className="vibe-sub__week" style={{ '--i': i }}>{i + 1}</span>)}
            </div>
          </div>
          <KeyFacts
            items={[
              { label: t('Duration', 'காலம்'), value: t('12 weeks', '12 வாரங்கள்') },
              { label: t('For', 'யாருக்கு'), value: t('Student teams with a working prototype', 'செயல்படும் முன்மாதிரி உள்ள மாணவர் குழுக்கள்') },
              { label: t('Seats', 'இடங்கள்'), value: ph(t('Funded by CSR and sponsors [placeholder — confirm funding]', 'CSR மற்றும் ஸ்பான்சர் நிதியில் [விவரம் வர உள்ளது — நிதி உறுதி செய்யப்பட உள்ளது]')) },
              { label: t('Route in', 'சேரும் வழி'), value: t('Vibathon winners get a guaranteed interview.', 'Vibathon வெற்றியாளர்களுக்கு உறுதியான நேர்காணல்.') },
            ]}
            action={<Button variant="brand" full href={apply}>{applyLabel}</Button>}
          />
        </div>
      </Section>
      <Statement eyebrow={t('The route in', 'சேரும் வழி')} id="vibe-launchpad-route">
        {t('Vibathon winners get a guaranteed interview', 'Vibathon வெற்றியாளர்களுக்கு உறுதியான நேர்காணல்')}<Dot />
      </Statement>
      <RelatedProgrammes match="launchpad" title={t('Vibe Launchpad calls', 'Vibe Launchpad அழைப்புகள்')} />
      <CTABand
        surface="paper"
        brand="vibe"
        className="brand-close"
        title={t('Got a working prototype and a team?', 'செயல்படும் முன்மாதிரியும் குழுவும் உள்ளதா?')}
        body={t('Apply now, or build one first at Vibathon 2027.', 'இப்போதே விண்ணப்பியுங்கள், அல்லது முதலில் Vibathon 2027-இல் ஒன்றை உருவாக்குங்கள்.')}
        actions={
          <>
            <Button variant="brand" href={apply}>{applyLabel}</Button>
            <Button variant="secondary" to="/vibe/vibathon">{t('See Vibathon 2027', 'Vibathon 2027-ஐப் பாருங்கள்')}</Button>
          </>
        }
      />
    </>
  );
}

/* ------------------------------------------------------------------ Clubs */

function Clubs() {
  const { t, lang } = useLang();
  const start = t('Start a Vibe Club', 'Vibe Club-ஐத் தொடங்குங்கள்');
  return (
    <>
      <Section surface="white" labelledBy="vibe-clubs-what">
        <SectionHeader
          as="h2"
          eyebrow={t('What a Vibe Club does', 'Vibe Club என்ன செய்கிறது')}
          title={<span id="vibe-clubs-what">{t('Meet monthly. Build together.', 'மாதந்தோறும் சந்தியுங்கள். சேர்ந்து உருவாக்குங்கள்.')}</span>}
          lede={t('Vibe Captains run monthly builds and bring StartNet to their district.', 'Vibe Captains மாதாந்திர உருவாக்க அமர்வுகளை நடத்தி, StartNet-ஐத் தங்கள் மாவட்டத்துக்குக் கொண்டு வருகிறார்கள்.')}
        />
        <IconList
          className="vibe-sub__icons--4"
          items={[
            { icon: Users, title: t('Meet monthly', 'மாதந்தோறும் சந்திப்பு') },
            { icon: Hammer, title: t('Build together', 'சேர்ந்து உருவாக்குதல்') },
            { icon: Moon, title: t('Run a Vibe Campus night each term', 'ஒவ்வொரு பருவத்திலும் ஒரு Vibe Campus இரவு') },
            { icon: Ticket, title: t('First access to Vibathon', 'Vibathon-இல் முதல் வாய்ப்பு') },
          ]}
        />
      </Section>
      <Section surface="paper" id="find" labelledBy="vibe-clubs-find">
        <SectionHeader as="h2" eyebrow={t('Find a club', 'கிளப்பைக் கண்டறியுங்கள்')} title={<span id="vibe-clubs-find">{t('Find a club near you', 'உங்கள் அருகில் உள்ள கிளப்பைக் கண்டறியுங்கள்')}</span>} />
        <div className="vibe-sub__find">
          <EmptyState
            title={t('The club directory is on its way.', 'கிளப் பட்டியல் விரைவில் வருகிறது.')}
            action={
              <Button variant="whatsapp" icon={MessageCircle} href={waLink('Hi StartNet, I want to find a Vibe Club near me', `vibe-clubs, ${lang}`)}>
                {tx(t, 'Chat on WhatsApp')}
              </Button>
            }
          />
        </div>
      </Section>
      <Section surface="white" id="start" width="narrow" labelledBy="vibe-clubs-start">
        <SectionHeader
          as="h2"
          eyebrow={start}
          title={<span id="vibe-clubs-start">{t('Start the club your campus is missing.', 'உங்கள் கல்லூரியில் இல்லாத கிளப்பைத் தொடங்குங்கள்.')}</span>}
          lede={t("Tell us about your college and we'll help you get started. Free.", 'உங்கள் கல்லூரியைப் பற்றிச் சொல்லுங்கள்; தொடங்க நாங்கள் உதவுவோம். இலவசம்.')}
        />
        <div className="vibe-sub__form form-card">
          <SmartForm
            type="interest"
            brand="vibe"
            hidden={{ brand: 'vibe', programme: 'vibe-clubs', lang }}
            fields={[
              { name: 'name', id: 'club-name', label: t('Your name', 'உங்கள் பெயர்'), type: 'text', required: true, autoComplete: 'name' },
              { name: 'email', id: 'club-email', label: t('Email', 'மின்னஞ்சல்'), type: 'email', required: true, autoComplete: 'email' },
              { name: 'phone', id: 'club-phone', label: t('WhatsApp number', 'WhatsApp எண்'), type: 'tel', hint: t('10-digit mobile number', '10 இலக்கக் கைபேசி எண்'), autoComplete: 'tel-national' },
              { name: 'college', id: 'club-college', label: t('College', 'கல்லூரி'), type: 'text', required: true, autoComplete: 'organization' },
              { name: 'district', id: 'club-district', label: t('District', 'மாவட்டம்'), type: 'text', hint: t('Your district helps us send only nearby events.', 'உங்கள் மாவட்டத்தைக் கொண்டு அருகிலுள்ள நிகழ்வுகளை மட்டுமே அனுப்புவோம்.') },
              {
                name: 'intent', id: 'club-intent', label: t('I want to', 'நான் விரும்புவது'), type: 'select', required: true,
                options: [
                  { value: 'start', label: start },
                  { value: 'join', label: t('Join a Vibe Club', 'Vibe Club-இல் சேர') },
                ],
              },
            ]}
            consents={[
              { purpose: 'contact', label: t('I agree that StartNet may contact me about Vibe Clubs.', 'Vibe Clubs குறித்து StartNet என்னைத் தொடர்புகொள்ள ஒப்புக்கொள்கிறேன்.'), required: true },
              {
                purpose: 'whatsapp_updates',
                label: t(
                  "I agree to receive messages from StartNet on WhatsApp about the topics I've chosen. No messages between 9 p.m. and 8 a.m. Reply STOP any time to opt out.",
                  'நான் தேர்ந்தெடுத்த தலைப்புகள் குறித்து StartNet-இடமிருந்து WhatsApp செய்திகளைப் பெற ஒப்புக்கொள்கிறேன். இரவு 9 முதல் காலை 8 வரை செய்திகள் இல்லை. எப்போது வேண்டுமானாலும் விலக STOP என்று பதில் அனுப்புங்கள்.'
                ),
              },
            ]}
            submitLabel={start}
            successTitle={t("Thanks. We'll be in touch.", 'நன்றி. விரைவில் தொடர்புகொள்வோம்.')}
            successBody={t('A StartNet Vibe lead will reach out about your club.', 'உங்கள் கிளப் குறித்து StartNet Vibe பொறுப்பாளர் ஒருவர் தொடர்புகொள்வார்.')}
          />
        </div>
      </Section>
    </>
  );
}

/* ------------------------------------------------------------------ Summit */

function Summit() {
  const { t, lang } = useLang();
  return (
    <>
      <Section surface="white" labelledBy="vibe-summit-about">
        <div className="split split--8-4 vibe-sub__split">
          <div className="vibe-sub__stack">
            <SectionHeader
              as="h2"
              eyebrow={t('About the summit', 'Summit பற்றி')}
              title={<span id="vibe-summit-about">{t('The state finale of Vibe Campus', 'Vibe Campus-இன் மாநில இறுதி நிகழ்வு')}</span>}
              lede={t(
                'Through the year, Vibe Campus runs build nights, talks, founder fireside chats and idea pitches in colleges across Tamil Nadu. One Vibe Summit each year is the state finale.',
                'ஆண்டு முழுவதும் தமிழ்நாடெங்கும் உள்ள கல்லூரிகளில் Vibe Campus உருவாக்க இரவுகள், உரைகள், நிறுவனர்களுடன் கலந்துரையாடல்கள், யோசனை முன்வைப்புகளை நடத்துகிறது. ஒவ்வோர் ஆண்டும் ஒரு Vibe Summit மாநில இறுதி நிகழ்வாக நடக்கிறது.'
              )}
            />
            {/* "Agenda, speakers and venue: [placeholder]" is hidden until StartNet supplies them. */}
          </div>
          <KeyFacts
            items={[
              // Venue and price are not supplied yet: those rows are left out (KeyFacts hides placeholder-only values).
              { label: t('When', 'எப்போது'), value: <span className="small text-2">{t('Planning calendar: October 2027', 'திட்ட நாட்காட்டி: அக்டோபர் 2027')}</span> },
              { label: t('For', 'யாருக்கு'), value: t('Students, colleges and sponsors', 'மாணவர்கள், கல்லூரிகள், ஸ்பான்சர்கள்') },
            ]}
            action={<Button variant="whatsapp" full icon={MessageCircle} href={waLink('VIBE SUMMIT', `vibe-summit, ${lang}`)}>{tx(t, 'Get updates on WhatsApp')}</Button>}
          />
        </div>
      </Section>
      <Section surface="paper" labelledBy="vibe-summit-events">
        <SectionHeader as="h2" eyebrow={tx(t, 'Events')} title={<span id="vibe-summit-events">{t('Summit dates', 'Summit தேதிகள்')}</span>} />
        <VibeEvents series="vibe-summit" waRef="vibe-summit" label={t('Vibe Summit editions', 'Vibe Summit பதிப்புகள்')} />
      </Section>
      <CTABand
        surface="paper"
        brand="vibe"
        className="brand-close"
        title={t('Meet the audience before everyone else does.', 'மற்றவர்களுக்கு முன்பே இந்தப் பார்வையாளர்களைச் சந்தியுங்கள்.')}
        body={t('Sponsor the Vibe Summit or a Vibathon track.', 'Vibe Summit அல்லது ஒரு Vibathon பிரிவுக்கு ஸ்பான்சர் செய்யுங்கள்.')}
        actions={
          <>
            <Button variant="brand" to="/partner/sponsors">{tx(t, 'Partner with us')}</Button>
            <Button variant="secondary" to="/vibe/vibathon">{t('See Vibathon 2027', 'Vibathon 2027-ஐப் பாருங்கள்')}</Button>
          </>
        }
      />
    </>
  );
}

/* ------------------------------------------------------------------ For colleges (T11) */

function ForColleges() {
  const { t, lang } = useLang();
  const hostNight = t('Host a Vibe Campus night', 'Vibe Campus இரவை நடத்துங்கள்');
  return (
    <>
      <Section surface="white" labelledBy="vibe-colleges-ladder">
        <SectionHeader
          as="h2"
          eyebrow={t('How it works', 'இது எப்படிச் செயல்படுகிறது')}
          title={<span id="vibe-colleges-ladder">{t('Three steps, at your pace', 'உங்கள் வேகத்தில் மூன்று படிகள்')}</span>}
        />
        <div className="vibe-sub__steps">
          <Steps
            variant="row"
            steps={[
              { title: t('Start small', 'சிறிதாகத் தொடங்குங்கள்'), body: t('A Vibe Campus night or a district Vibathon.', 'ஒரு Vibe Campus இரவு அல்லது மாவட்ட Vibathon.'), icon: Moon },
              { title: t('Become a Vibathon host college', 'Vibathon நடத்தும் கல்லூரியாகுங்கள்'), body: t('Host a qualifier plus a year of Vibe Campus events.', 'ஒரு தகுதிச் சுற்றையும் ஓராண்டு Vibe Campus நிகழ்வுகளையும் நடத்துங்கள்.'), icon: BadgeCheck },
              {
                title: t('Join the Institution Partner Programme', 'Institution Partner Programme-இல் சேருங்கள்'),
                body: t(
                  'Lab membership, innovation policy kit, faculty development, Campus Innovation Index score, your own StartNet X space.',
                  'ஆய்வக உறுப்பினர், புத்தாக்கக் கொள்கைத் தொகுப்பு, பேராசிரியர் மேம்பாடு, Campus Innovation Index மதிப்பெண், உங்களுக்கான StartNet X இடம்.'
                ),
                icon: Building,
              },
            ]}
          />
        </div>
      </Section>

      <Section surface="paper" labelledBy="vibe-colleges-report">
        <div className="split vibe-sub__split">
          <div className="vibe-sub__stack">
            <SectionHeader as="h2" eyebrow={t('What you can report', 'நீங்கள் அறிக்கையிடக்கூடியவை')} title={<span id="vibe-colleges-report">{t('Outcomes your IIC and accreditation teams can use', 'உங்கள் IIC மற்றும் அங்கீகாரக் குழுக்கள் பயன்படுத்தக்கூடிய விளைவுகள்')}</span>} />
            <IconList
              items={[
                { icon: Users, title: t('Student founders by ladder level', 'நிலை வாரியாக மாணவர் நிறுவனர்கள்') },
                { icon: Building, title: t('Companies formed', 'உருவான நிறுவனங்கள்') },
                { icon: Lightbulb, title: t('Patents and spinouts', 'காப்புரிமைகளும் புதிய நிறுவனங்களும்') },
                { icon: MessagesSquare, title: t('IIC activity', 'IIC செயல்பாடு') },
              ]}
            />
          </div>
          <div className="vibe-sub__proof">
            <Stat metric={localiseMetric(t, VIBE_PROOF.metric)} variant="hero" />
            <div className="vibe-sub__package">
              <p className="eyebrow">{t('College host package', 'நடத்தும் கல்லூரித் தொகுப்பு')}</p>
              <p className="h5">{t('Host a qualifier plus a year of Vibe Campus events', 'ஒரு தகுதிச் சுற்றும் ஓராண்டு Vibe Campus நிகழ்வுகளும்')}</p>
              <Stat value="₹1–3 L" label={t('a year, indicative', 'ஆண்டுக்கு, தோராயமாக')} tag="C" note={t('Planning rate card.', 'திட்டக் கட்டண அட்டவணை.')} source={t('StartNet planning rate card', 'StartNet திட்டக் கட்டண அட்டவணை')} variant="compact" countUp={false} />
              <p className="caption">{t('Prices exclude GST.', 'விலைகள் GST நீங்கலாக.')}</p>
            </div>
          </div>
        </div>
      </Section>

      <Section surface="white" id="enquire" labelledBy="vibe-colleges-enquire">
        <div className="split vibe-sub__split vibe-sub__split--top">
          <div className="vibe-sub__stack">
            <SectionHeader
              as="h2"
              eyebrow={t('Become a host college', 'நடத்தும் கல்லூரியாகுங்கள்')}
              title={<span id="vibe-colleges-enquire">{t('Book a consultation', 'ஆலோசனைக்கு நேரம் பதிவு செய்யுங்கள்')}</span>}
              lede={t(
                "Principals, IIC leads and faculty: tell us about your institution and we'll suggest where to start.",
                'முதல்வர்கள், IIC பொறுப்பாளர்கள், பேராசிரியர்கள்: உங்கள் கல்வி நிறுவனத்தைப் பற்றிச் சொல்லுங்கள்; எங்கிருந்து தொடங்கலாம் என்று பரிந்துரைப்போம்.'
              )}
            />
            <div className="cluster">
              <Button variant="secondary" to="/vibe/campus">{hostNight}</Button>
              <Button variant="tertiary" to="/partner/institutions">Institution Partner Programme</Button>
            </div>
          </div>
          <div className="vibe-sub__form form-card">
            <SmartForm
              type="host"
              brand="vibe"
              hidden={{ brand: 'vibe', route: 'for-colleges', lang }}
              fields={[
                { name: 'name', id: 'host-name', label: t('Your name', 'உங்கள் பெயர்'), type: 'text', required: true, autoComplete: 'name' },
                { name: 'email', id: 'host-email', label: t('Work email', 'பணி மின்னஞ்சல்'), type: 'email', required: true, autoComplete: 'email' },
                { name: 'phone', id: 'host-phone', label: t('Phone', 'தொலைபேசி'), type: 'tel', autoComplete: 'tel-national' },
                { name: 'institution', id: 'host-institution', label: t('Institution', 'கல்வி நிறுவனம்'), type: 'text', required: true, autoComplete: 'organization' },
                {
                  name: 'role', id: 'host-role', label: t('Your role', 'உங்கள் பொறுப்பு'), type: 'select', required: true,
                  options: [
                    { value: 'principal', label: t('Principal / Head of institution', 'முதல்வர் / கல்வி நிறுவனத் தலைவர்') },
                    { value: 'iic', label: t('IIC lead', 'IIC பொறுப்பாளர்') },
                    { value: 'faculty', label: t('Faculty', 'பேராசிரியர்') },
                    { value: 'other', label: t('Other', 'மற்றவை') },
                  ],
                },
                { name: 'district', id: 'host-district', label: t('District', 'மாவட்டம்'), type: 'text', required: true },
                { name: 'message', id: 'host-message', label: t('What would you like to start with?', 'எதிலிருந்து தொடங்க விரும்புகிறீர்கள்?'), type: 'textarea' },
              ]}
              consents={[{ purpose: 'partner', label: t('I agree that StartNet may contact me about hosting StartNet Vibe at my institution.', 'என் கல்வி நிறுவனத்தில் StartNet Vibe-ஐ நடத்துவது குறித்து StartNet என்னைத் தொடர்புகொள்ள ஒப்புக்கொள்கிறேன்.'), required: true }]}
              submitLabel={t('Become a host college', 'நடத்தும் கல்லூரியாகுங்கள்')}
              successTitle={t("Thank you. We'll be in touch.", 'நன்றி. விரைவில் தொடர்புகொள்வோம்.')}
              successBody={t('The StartNet Vibe team will reply with next steps.', 'அடுத்த படிகளுடன் StartNet Vibe குழு பதில் அளிக்கும்.')}
            />
          </div>
        </div>
      </Section>

      <CTABand
        surface="paper"
        brand="vibe"
        className="brand-close"
        title={t('Rather talk it through?', 'நேரில் பேச விரும்புகிறீர்களா?')}
        actions={
          <>
            <Button variant="whatsapp" icon={MessageCircle} href={waLink('Hi StartNet, I want to host StartNet Vibe at my college', `vibe-for-colleges, ${lang}`)}>{tx(t, 'Chat on WhatsApp')}</Button>
            <Button variant="secondary" to="/contact">{tx(t, 'Talk to us')}</Button>
          </>
        }
      />
    </>
  );
}

/* ------------------------------------------------------------------ hero actions per page */

function heroActions(slug, { t, lang }) {
  switch (slug) {
    case 'academy':
      return (
        <>
          <Button variant="brand" size="lg" href={snxLink('/learn', { brand: 'vibe', src: 'vibe-academy', lang })}>{t('Browse courses', 'பாடநெறிகளைப் பாருங்கள்')}</Button>
          <Button variant="secondary" size="lg" href={snxLink('/signup', { brand: 'vibe', src: 'vibe-academy', lang })}>{tx(t, 'Create your free profile')}</Button>
        </>
      );
    case 'campus':
      return (
        <>
          <Button variant="brand" size="lg" to="/vibe/for-colleges">{t('Host Vibe Campus', 'Vibe Campus-ஐ நடத்துங்கள்')}</Button>
          <Button variant="secondary" size="lg" href="#events">{t('See campus events', 'கல்லூரி நிகழ்வுகளைப் பாருங்கள்')}</Button>
        </>
      );
    case 'launchpad':
      return (
        <>
          <Button variant="brand" size="lg" href={snxLink('/programmes/vibe-launchpad', { brand: 'vibe', src: 'vibe-launchpad', lang })}>{t('Apply to Launchpad', 'Launchpad-க்கு விண்ணப்பியுங்கள்')}</Button>
          <Button variant="tertiary" to="/vibe/vibathon">{t('See Vibathon 2027', 'Vibathon 2027-ஐப் பாருங்கள்')}</Button>
        </>
      );
    case 'clubs':
      return (
        <>
          <Button variant="brand" size="lg" href="#start">{t('Start a Vibe Club', 'Vibe Club-ஐத் தொடங்குங்கள்')}</Button>
          <Button variant="secondary" size="lg" href="#find">{t('Find a club near you', 'உங்கள் அருகில் உள்ள கிளப்பைக் கண்டறியுங்கள்')}</Button>
        </>
      );
    case 'summit':
      return (
        <>
          <Button variant="whatsapp" size="lg" href={waLink('VIBE SUMMIT', `vibe-summit, ${lang}`)}>{tx(t, 'Get updates on WhatsApp')}</Button>
          <Button variant="tertiary" to="/vibe/campus">{t('About Vibe Campus', 'Vibe Campus பற்றி')}</Button>
        </>
      );
    case 'for-colleges':
      return (
        <>
          <Button variant="brand" size="lg" href="#enquire">{t('Book a consultation', 'ஆலோசனைக்கு நேரம் பதிவு செய்யுங்கள்')}</Button>
          <Button variant="secondary" size="lg" to="/vibe/campus">{t('Host a Vibe Campus night', 'Vibe Campus இரவை நடத்துங்கள்')}</Button>
        </>
      );
    default:
      return null;
  }
}

const HERO_META = {
  academy: [['Learn', 'கற்றல்'], ['Tamil · English', 'தமிழ் · ஆங்கிலம்']],
  campus: [['Spark', 'தூண்டல்'], ['With your IIC', 'உங்கள் IIC உடன்']],
  launchpad: [['Launch', 'தொடக்கம்'], ['12 weeks', '12 வாரங்கள்']],
  clubs: [['Student-run', 'மாணவர்கள் நடத்துவது'], ['Free', 'இலவசம்']],
  summit: [['State finale', 'மாநில இறுதி'], ['Annual', 'ஆண்டுதோறும்']],
  'for-colleges': [['For colleges', 'கல்லூரிகளுக்கு'], ['Principals · IIC leads', 'முதல்வர்கள் · IIC பொறுப்பாளர்கள்']],
};

// Course JSON-LD (Book 1 §9.4) with real fields only: fees are planning figures [C] or placeholders, so no price.
const COURSES = {
  academy: (t, lang) =>
    courseLd({
      name: 'Vibe Academy',
      description: tr(t, VIBE_SUB.academy, 'lede'),
      path: '/vibe/academy',
      lang,
      inLanguage: ['en', 'ta'],
    }),
  // Teaching language is not stated for Launchpad, so inLanguage is dropped rather than defaulted to the page's.
  launchpad: (t, lang) => ({
    ...courseLd({
      name: 'Vibe Launchpad',
      description: t(
        'A 12-week pre-incubation programme for student teams with a working prototype.',
        'செயல்படும் முன்மாதிரி உள்ள மாணவர் குழுக்களுக்கான 12 வார முன்-இன்குபேஷன் திட்டம்.'
      ),
      path: '/vibe/launchpad',
      lang,
      timeRequired: 'P12W',
    }),
    inLanguage: undefined,
  }),
};

const BODIES = { academy: Academy, campus: Campus, launchpad: Launchpad, clubs: Clubs, summit: Summit, 'for-colleges': ForColleges };

/** Slugs served by /vibe/:slug (vibathon has its own route). The server's route list mirrors this — F-97. */
export const VIBE_SLUGS = Object.keys(BODIES);

/** Own-property lookup: "constructor", "toString", "hasOwnProperty"… are not pages. */
const own = (table, key) => (typeof key === 'string' && Object.prototype.hasOwnProperty.call(table, key) ? table[key] : undefined);

export default function VibeSub() {
  const { slug } = useParams();
  const lang = useLang();
  const { t } = lang;
  const page = own(VIBE_SUB, slug);
  const Body = own(BODIES, slug);
  const meta = own(HERO_META, slug) || [];
  if (!page || !Body) return <NotFound />;

  return (
    <div className={`vibe-sub vibe-sub--${slug}`}>
      <Seo
        title={tr(t, page, 'seoTitle')}
        titleTa={page.seoTitleTa}
        description={tr(t, page, 'seoDescription')}
        descriptionTa={page.seoDescriptionTa}
        noindex={!!page.noindex}
        jsonLd={[
          pageLd({ path: `/vibe/${slug}`, lang: lang.lang, name: tr(t, page, 'seoTitle'), description: tr(t, page, 'seoDescription') }),
          own(COURSES, slug) ? own(COURSES, slug)(t, lang.lang) : null,
        ]}
      />
      <div className="bp-crumbs" data-surface="night">
        <div className="container vibe-sub__crumbs">
          <Breadcrumbs items={[{ label: 'StartNet Vibe', to: '/vibe' }, { label: tr(t, page, 'crumb') }]} />
        </div>
      </div>
      <BrandHero
        brand="vibe"
        compact={slug === 'for-colleges'}
        className={slug === 'academy' ? 'brand-hero--portrait-art' : undefined}
        title={tr(t, page, 'h1')}
        lede={tr(t, page, 'lede')}
        actions={heroActions(slug, lang)}
        art={{ ...page.art, brand: 'vibe', ratio: '4/5', alt: '' }}
        meta={
          <div className="cluster vibe-sub__meta">
            {meta.map(([en, ta], i) => <Badge key={en} kind={i === 0 ? 'brand' : 'type'} brand={i === 0 ? 'vibe' : undefined}>{t(en, ta)}</Badge>)}
          </div>
        }
      />
      <Body key={slug} />
    </div>
  );
}
