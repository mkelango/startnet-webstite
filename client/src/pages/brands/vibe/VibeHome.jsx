import { motion } from 'framer-motion';
import { Languages, MessageCircle } from 'lucide-react';
import { useApi } from '../../../hooks/useApi.js';
import { realStories } from '../../../components/_placeholders.js';
import { useReducedMotion } from '../../../hooks/useReducedMotion.js';
import { useLang } from '../../../lib/i18n.jsx';
import { snxLink, waLink } from '../../../lib/links.js';
import {
  Seo, BrandHero, Section, SectionHeader, Button, RevealGroup, Reveal, ArtImage, Badge, Stat,
  ProgrammeCard, StoryCard, CTABand, Dot, Accordion,
} from '../../../components';
import { itemListLd } from '../../../lib/seo.js';
import { pageLd } from '../seoBits.js';
import VibeJourney from './parts/VibeJourney.jsx';
import VibeEvents from './parts/VibeEvents.jsx';
import VibeProof from './parts/VibeProof.jsx';
import { VIBE_HOME, VIBE_HOME_FAQ, VIBE_JOURNEY, VIBE_WAYS_IN, tx, tr } from './vibeContent.js';

/** Programmes listed on this brand home (ItemList JSON-LD). */
const VIBE_PROGRAMMES = [
  { name: 'Vibathon', path: '/vibe/vibathon' },
  { name: 'Vibe Academy', path: '/vibe/academy' },
  { name: 'Vibe Campus', path: '/vibe/campus' },
  { name: 'Vibe Launchpad', path: '/vibe/launchpad' },
  { name: 'Vibe Clubs', path: '/vibe/clubs' },
];
import '../brandPage.css';
import './VibeHome.css';
import { seriesPhoto } from '../../../data/photos.js';
import { ScrubText } from '../../../components/ScrubText.jsx';
import { FeatureTabs } from '../../../components/FeatureTabs.jsx';

const ART_WIPE = { hidden: { clipPath: 'inset(0 0 100% 0)' }, shown: { clipPath: 'inset(0 0 0% 0)' } };

/** "What past winners did next": real stories from the API only; the whole section hides until one is published. */
function WinnerStories({ children }) {
  const { data } = useApi('/api/stories?brand=vibe');
  const stories = realStories(data).slice(0, 3);
  if (!stories.length) return null;
  return (
    <Section surface="white" labelledBy="vibe-home-stories">
      {children}
      <RevealGroup className="grid grid-3 vibe-home__stories">
        {stories.map((s) => <StoryCard key={s.slug} story={s} />)}
      </RevealGroup>
    </Section>
  );
}

function VibeProgrammes() {
  const { t } = useLang();
  const { data } = useApi('/api/programmes?brand=vibe');
  const items = Array.isArray(data) ? data : [];
  if (!items.length) return null;
  return (
    <Section surface="white" labelledBy="vibe-home-programmes">
      <SectionHeader
        as="h2"
        eyebrow={t('Open now', 'இப்போது திறந்துள்ளவை')}
        title={<span id="vibe-home-programmes">{t('StartNet Vibe programmes', 'StartNet Vibe திட்டங்கள்')}</span>}
        action={<Button variant="tertiary" to="/programmes?brand=vibe">{t('All programmes', 'அனைத்துத் திட்டங்களும்')}</Button>}
      />
      <RevealGroup className="grid grid-3 vibe-home__programmes">
        {items.slice(0, 6).map((p) => <ProgrammeCard key={p.slug} programme={p} />)}
      </RevealGroup>
    </Section>
  );
}

export default function VibeHome() {
  const { t, lang } = useLang();
  const reduced = useReducedMotion();
  const bringVibe = t('Bring Vibe to your college', 'உங்கள் கல்லூரிக்கு Vibe-ஐக் கொண்டு வாருங்கள்');

  return (
    <>
      <Seo
        title={tr(t, VIBE_HOME, 'seoTitle')}
        titleTa={VIBE_HOME.seoTitleTa}
        description={tr(t, VIBE_HOME, 'seoDescription')}
        descriptionTa={VIBE_HOME.seoDescriptionTa}
        jsonLd={[
          pageLd({ path: '/vibe', lang, name: tr(t, VIBE_HOME, 'seoTitle'), description: tr(t, VIBE_HOME, 'seoDescription') }),
          itemListLd({ name: t('StartNet Vibe programmes', 'StartNet Vibe திட்டங்கள்'), items: VIBE_PROGRAMMES, lang }),
        ]}
      />

      <BrandHero
        brand="vibe"
        title={tr(t, VIBE_HOME, 'h1')}
        lede={tr(t, VIBE_HOME, 'lede')}
        actions={
          <>
            <Button variant="brand" size="lg" to="/vibe/vibathon">{t('Register for Vibathon 2027', 'Vibathon 2027-க்குப் பதிவு செய்யுங்கள்')}</Button>
            <Button variant="secondary" size="lg" to="/vibe/for-colleges">{bringVibe}</Button>
          </>
        }
        meta={
          <div className="cluster vibe-home__hero-meta">
            <Badge kind="type">{t('Your first step is free', 'உங்கள் முதல் அடி இலவசம்')}</Badge>
            <Badge kind="lang">English · தமிழ்</Badge>
          </div>
        }
        art={{ variant: 'network', brand: 'vibe', seed: 7, animate: true, alt: '' }}
      />

      {/* Proof band */}
      <Section surface="paper" pad="sm" labelledBy="vibe-home-proof">
        <h2 id="vibe-home-proof" className="visually-hidden">{t('StartNet Vibe in figures', 'எண்களில் StartNet Vibe')}</h2>
        <VibeProof />
      </Section>

      {/* The journey: the signature interaction */}
      <Section surface="white" labelledBy="vibe-home-journey">
        <SectionHeader
          as="h2"
          eyebrow={tx(t, 'Student → Founder')}
          title={<span id="vibe-home-journey">{t('From first idea to first company', 'முதல் யோசனையிலிருந்து முதல் நிறுவனம் வரை')}</span>}
          lede={<ScrubText as="span">{t(
            'Spark at Vibe Campus, learn at Vibe Academy, build at Vibathon, launch with Vibe Launchpad, then fund it with prizes, CSR grants and state seed schemes.',
            'Vibe Campus-இல் தூண்டப்படுங்கள், Vibe Academy-இல் கற்றுக்கொள்ளுங்கள், Vibathon-இல் உருவாக்குங்கள், Vibe Launchpad-உடன் தொடங்குங்கள், பிறகு பரிசுகள், CSR மானியங்கள், மாநில விதை நிதித் திட்டங்கள் மூலம் நிதி திரட்டுங்கள்.'
          )}</ScrubText>}
        />
        <div className="vibe-home__journey">
          <VibeJourney steps={VIBE_JOURNEY} />
        </div>
      </Section>

      {/* Four ways in */}
      <Section surface="paper" labelledBy="vibe-home-ways">
        <SectionHeader
          as="h2"
          eyebrow={t('Four ways in', 'நுழைய நான்கு வழிகள்')}
          title={<span id="vibe-home-ways">{t('Pick where you start.', 'எங்கே தொடங்குவது என்று தேர்ந்தெடுங்கள்.')}</span>}
          lede={t(
            'Hackathons, an AI-era building academy, campus build nights and student-run clubs. Start with Vibathon.',
            'ஹேக்கத்தான்கள், AI காலத்தில் உருவாக்கக் கற்றுத்தரும் அகாடமி, கல்லூரி உருவாக்க இரவுகள், மாணவர்கள் நடத்தும் கிளப்புகள். Vibathon-உடன் தொடங்குங்கள்.'
          )}
        />
        {/* Four ways in as feature tabs (DESIGN-v2 6.2): the same four items, order and links; the media crossfades. */}
        <Reveal className="vibe-home__ways">
          <FeatureTabs
            label={t('Four ways in', 'நுழைய நான்கு வழிகள்')}
            items={VIBE_WAYS_IN.map((w, i) => ({
              id: w.id,
              title: w.title,
              body: (
                <div className="vibe-ways__body">
                  <p className="vibe-ways__meta">{tr(t, w, 'eyebrow')}</p>
                  <p>{tr(t, w, 'body')}</p>
                  <Button variant="tertiary" to={w.to}>{tr(t, w, 'cta')}</Button>
                </div>
              ),
              media: (
                <ArtImage
                  {...w.art}
                  brand="vibe"
                  ratio="4/3"
                  alt=""
                  {...(i === 0 ? { night: true, photo: seriesPhoto('vibathon') } : {})}
                />
              ),
            }))}
          />
        </Reveal>
        <p className="vibe-home__ways-more small text-2">
          {t('Built something already?', 'ஏற்கனவே எதையாவது உருவாக்கிவிட்டீர்களா?')}{' '}
          <Button variant="tertiary" to="/vibe/launchpad">{t('Vibe Launchpad: twelve weeks from team to company', 'Vibe Launchpad: குழுவிலிருந்து நிறுவனம் வரை பன்னிரண்டு வாரங்கள்')}</Button>
        </p>
      </Section>

      {/* Statement: Academy in Tamil & English */}
      <Section surface="white" labelledBy="vibe-home-academy">
        <div className="split vibe-home__statement">
          <Reveal className="vibe-home__statement-text">
            <p className="eyebrow">Vibe Academy</p>
            <h2 id="vibe-home-academy" className="h1 vibe-home__statement-title">
              {t('Ship it, then get the certificate', 'முதலில் வெளியிடுங்கள், பிறகு சான்றிதழ்')}<Dot />
            </h2>
            <p className="body-lg text-2">
              {t(
                'Learn AI-assisted coding, product, design and go-to-market in cohorts or at your own pace, in Tamil or English. Our certificate says "shipped with users", not "attended". Credits where your college allows.',
                'AI உதவியுடன் கோடிங், தயாரிப்பு, வடிவமைப்பு, சந்தைக்குக் கொண்டு செல்லுதல் ஆகியவற்றைக் குழுக்களாகவோ உங்கள் வேகத்திலோ, தமிழிலோ ஆங்கிலத்திலோ கற்றுக்கொள்ளுங்கள். எங்கள் சான்றிதழ் "கலந்துகொண்டார்" என்று அல்ல, "பயனர்களுடன் வெளியிட்டார்" என்று சொல்கிறது. உங்கள் கல்லூரி அனுமதிக்கும் இடங்களில் மதிப்பெண் வரவு.'
              )}
            </p>
            <div className="vibe-home__langs" role="list" aria-label={t('Languages', 'மொழிகள்')}>
              <span role="listitem" className="vibe-home__lang" lang="en"><Languages size={18} aria-hidden="true" /> English</span>
              <span role="listitem" className="vibe-home__lang vibe-home__lang--ta" lang="ta">தமிழ்</span>
            </div>
            <div className="vibe-home__fee">
              <Stat
                value={999}
                prefix="₹"
                label={t('Vibe Academy fee per course, from · free starter courses on StartNet X', 'Vibe Academy ஒரு பாடநெறிக் கட்டணம், இதிலிருந்து · StartNet X-இல் இலவசத் தொடக்கப் பாடநெறிகள்')}
                tag="C"
                note={t('Planning assumption.', 'திட்ட அனுமானம்.')}
                source={t('StartNet planning rate card', 'StartNet திட்டக் கட்டண அட்டவணை')}
                variant="compact"
              />
            </div>
            <div className="cluster">
              <Button variant="brand" to="/vibe/academy">{t('Browse courses', 'பாடநெறிகளைப் பாருங்கள்')}</Button>
              <Button variant="tertiary" href={snxLink('/signup', { brand: 'vibe', src: 'vibe-home-academy', lang })}>{tx(t, 'Create your free profile')}</Button>
            </div>
            <p className="caption">{t('Students get 50% off StartNet X Pro.', 'மாணவர்களுக்கு StartNet X Pro-வில் 50% தள்ளுபடி.')}</p>
          </Reveal>
          <Reveal className="vibe-home__statement-art" delay={0.08}>
            {/* The observer sits on an unclipped wrapper: a fully clipped element never reports as in view. */}
            <motion.div
              className="vibe-home__academy-frame"
              initial={reduced ? false : 'hidden'}
              whileInView="shown"
              viewport={{ once: true, amount: 0.3 }}
            >
              <motion.div
                className="vibe-home__academy-art"
                variants={reduced ? undefined : ART_WIPE}
                transition={{ duration: 0.8, ease: [0.4, 0.14, 0.3, 1] }}
              >
                <ArtImage variant="grid" brand="vibe" ratio="1/1" seed={23} alt="" />
                <span className="vibe-home__academy-glyph" aria-hidden="true" lang="ta">அ</span>
                <span className="vibe-home__academy-glyph vibe-home__academy-glyph--en" aria-hidden="true">A</span>
              </motion.div>
            </motion.div>
          </Reveal>
        </div>
      </Section>

      <VibeProgrammes />

      {/* Events */}
      <Section surface="paper" labelledBy="vibe-home-events">
        <SectionHeader
          as="h2"
          eyebrow={tx(t, 'Events')}
          title={<span id="vibe-home-events">{t('Build nights, qualifiers and finales near you.', 'உங்கள் அருகில் உருவாக்க இரவுகள், தகுதிச் சுற்றுகள், இறுதிப் போட்டிகள்.')}</span>}
          action={<Button variant="tertiary" to="/events?brand=vibe">{tx(t, 'See upcoming events')}</Button>}
        />
        <VibeEvents waRef="vibe-home" label={t('Upcoming StartNet Vibe events', 'வரவிருக்கும் StartNet Vibe நிகழ்வுகள்')} />
        {/* Past Vibe events on record (docs/research/vibe-events.md): Vibathon 2025, the two 2025 summits. Tamil: draft, pending native review. */}
        <nav className="vibe-home__past" aria-label={t('Past StartNet Vibe events', 'முந்தைய StartNet Vibe நிகழ்வுகள்')}>
          <p className="small text-2 vibe-home__past-label">{t('Past events', 'முந்தைய நிகழ்வுகள்')}</p>
          <ul className="vibe-home__past-list">
            <li><Button variant="tertiary" to="/vibe/vibathon#last-edition">{t('Vibathon 2025, Tiruchengode', 'Vibathon 2025, திருச்செங்கோடு')}</Button></li>
            <li><Button variant="tertiary" to="/vibe/summit#past">{t('Vibe Marketing Summit 2025, Salem', 'Vibe Marketing Summit 2025, சேலம்')}</Button></li>
            <li><Button variant="tertiary" to="/vibe/summit#past">{t('Vibe Coding Summit 2025, Coimbatore', 'Vibe Coding Summit 2025, கோயம்புத்தூர்')}</Button></li>
          </ul>
        </nav>
      </Section>

      {/* What past winners did next (hidden until a real Vibe story exists) */}
      <WinnerStories>
        <SectionHeader
          as="h2"
          eyebrow={t('Founders made', 'உருவான நிறுவனர்கள்')}
          title={<span id="vibe-home-stories">{t('What past winners did next.', 'முந்தைய வெற்றியாளர்கள் அடுத்து என்ன செய்தார்கள்.')}</span>}
          lede={t(
            'Every story shows where the team started on the founder ladder and where they are now, with the source.',
            'ஒவ்வொரு கதையும் நிறுவனர் படிநிலையில் குழு எங்கே தொடங்கியது, இப்போது எங்கே இருக்கிறது என்பதை ஆதாரத்துடன் காட்டுகிறது.'
          )}
          action={<Button variant="tertiary" to="/insights/stories?brand=vibe">{t('All Vibe stories', 'அனைத்து Vibe கதைகளும்')}</Button>}
        />
      </WinnerStories>

      {/* Colleges band */}
      <Section surface="paper" pad="sm" labelledBy="vibe-home-colleges">
        <div className="vibe-home__colleges">
          <div>
            <p className="eyebrow">{t('For colleges', 'கல்லூரிகளுக்கு')}</p>
            <h2 id="vibe-home-colleges" className="h3">{t('Bring builders to your campus.', 'உங்கள் கல்லூரிக்கு உருவாக்குநர்களைக் கொண்டு வாருங்கள்.')}</h2>
            <p className="text-2">{t(
              'Start with a Vibe Campus night or a district Vibathon, then become a Vibathon host college.',
              'ஒரு Vibe Campus இரவு அல்லது மாவட்ட Vibathon-உடன் தொடங்குங்கள், பிறகு Vibathon நடத்தும் கல்லூரியாகுங்கள்.'
            )}</p>
          </div>
          <div className="cluster">
            <Button variant="secondary" to="/vibe/for-colleges">{bringVibe}</Button>
            <Button variant="tertiary" to="/vibe/campus">{t('Host Vibe Campus', 'Vibe Campus-ஐ நடத்துங்கள்')}</Button>
          </div>
        </div>
      </Section>

      {/* AEO FAQ: drafted from Book 2 §3.2 and §5.2 — StartNet review */}
      <Section surface="white" className="bp-faq" labelledBy="vibe-home-faq">
        <SectionHeader
          as="h2"
          eyebrow={t('Common questions', 'பொதுவான கேள்விகள்')}
          title={<span id="vibe-home-faq">{t('Before you start', 'தொடங்கும் முன்')}</span>}
        />
        <Accordion faq items={VIBE_HOME_FAQ.map((f) => ({ id: `vibe-faq-${f.id}`, question: tr(t, f, 'question'), answer: tr(t, f, 'answer') }))} />
      </Section>

      {/* Closing CTA: WhatsApp with keyword VIBATHON */}
      <CTABand
        surface="paper"
        brand="vibe"
        className="brand-close"
        title={tr(t, VIBE_HOME, 'closing')}
        body={t(
          <>Register for Vibathon on StartNet X, or message <strong>VIBATHON</strong> on WhatsApp and we'll take it from there.</>,
          <>StartNet X-இல் Vibathon-க்குப் பதிவு செய்யுங்கள், அல்லது WhatsApp-இல் <strong lang="en">VIBATHON</strong> என்று அனுப்புங்கள்; மற்றதை நாங்கள் பார்த்துக்கொள்கிறோம்.</>
        )}
        actions={
          <>
            <Button variant="primary" to="/join">{tx(t, 'Join StartNet')}</Button>
            <Button variant="whatsapp" icon={MessageCircle} href={waLink('VIBATHON', `vibe-home, ${lang}`)}>
              {t('Join the Vibe WhatsApp channel', 'Vibe WhatsApp சேனலில் இணையுங்கள்')}
            </Button>
          </>
        }
      />
    </>
  );
}
