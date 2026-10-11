import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import {
  Section, SectionHeader, Reveal, RevealGroup, Button, ArtImage, Accordion,
  Stat, Scroller, EventCard, ProgrammeCard, StoryCard, LogoWall, EmptyState,
  Skeleton, VideoFeature, CTABand,
} from '../../components';
import { ClipReveal } from '../../components/ClipReveal.jsx';
import { featuredVideos } from '../../data/videos.js';
import { useApi } from '../../hooks/useApi.js';
import { useLang } from '../../lib/i18n.jsx';
import { waLink } from '../../lib/links.js';
import * as programmeMeta from '../programmes/parts/programmeMeta.js';
import FounderStory from './FounderStory.jsx';
import MissionMeter from './MissionMeter.jsx';
import UpdatesTabs from './UpdatesTabs.jsx';
import { localizeMetric } from './homeI18n.js';
import { realStories } from '../../components/_placeholders.js';
import { homeFaqItems } from './homeFaq.js';

/*
 * Home, below the first screens (F-33/F-14): FounderStory → closing CTA. Split out of Home.jsx so this code is not
 * in the entry chunk every other page downloads, and so Home's first render (hero, persona band, proof band,
 * doors) is a shorter task; this part renders in a task of its own once its chunk arrives. Markup, copy and
 * order are unchanged. Data requests that were already made by Home stay there and arrive here as props.
 */

const PARTNER_LINKS = [
  { label: 'For institutions', labelTa: 'கல்வி நிறுவனங்களுக்கு', to: '/partner/institutions' },
  { label: 'For GCCs & corporates', labelTa: 'GCC-கள் மற்றும் பெருநிறுவனங்களுக்கு', to: '/partner/gccs' },
  { label: 'For government', labelTa: 'அரசுக்கு', to: '/partner/government' },
  { label: 'For sponsors & CSR', labelTa: 'ஸ்பான்சர்கள் மற்றும் CSR-க்கு', to: '/partner/sponsors' },
];

/*
 * "Open now" = every status that is accepting applications (rolling calls included), soonest first —
 * the same set /programmes/open-calls lists. TODO(F-66): ACCEPTING and sortCalls come from
 * programmeMeta once the programmes fix exports them; these fallbacks keep the same meaning until then.
 */
const ACCEPTING = programmeMeta.ACCEPTING || ['closing', 'open', 'rolling'];
const CALL_ORDER = { closing: 0, open: 1, rolling: 2 };
const sortCalls = programmeMeta.sortCalls || ((a, b) => {
  const sa = CALL_ORDER[a.status] ?? 3;
  const sb = CALL_ORDER[b.status] ?? 3;
  if (sa !== sb) return sa - sb;
  const da = a.applyBy ? Date.parse(a.applyBy) : Infinity;
  const db = b.applyBy ? Date.parse(b.applyBy) : Infinity;
  if (da !== db) return da - db;
  return String(a.title).localeCompare(String(b.title));
});

/*
 * Closing CTA (DESIGN-v2 3.15 / 6.1): the shared Ink CTA band, a quiet centred statement on the static pulli grid.
 * The title's full stop was already part of the line (read by screen readers, drawn as the red point); it is now the
 * band's <Dot/> via CTABand, so the visible and spoken text are unchanged. The lede sits left-aligned in a centred box.
 */
function ClosingCta() {
  const { t } = useLang();
  return (
    <CTABand
      surface="night"
      className="home-close"
      title={`${t('Start where you are', 'நீங்கள் இருக்கும் இடத்திலிருந்தே தொடங்குங்கள்')}.`}
      accentWord="Start"
      body={t(
        'Make a free StartNet X profile and we’ll show you the next step that fits you: an event, a course, a circle or a programme.',
        'இலவச StartNet X சுயவிவரத்தை உருவாக்குங்கள்; உங்களுக்குப் பொருந்தும் அடுத்த படியை நாங்கள் காட்டுவோம்: ஒரு நிகழ்வு, ஒரு பயிற்சி, ஒரு வட்டம் அல்லது ஒரு திட்டம்.'
      )}
      actions={(
        <>
          <Button size="lg" to="/join">{t('Join StartNet', 'StartNet-இல் இணையுங்கள்')}</Button>
          <Button size="lg" variant="whatsapp" href={waLink('Hi StartNet', 'home')}>{t('Chat on WhatsApp', 'WhatsApp-இல் பேசுங்கள்')}</Button>
          <p className="home-close__micro">
            <span>{t('Free for individuals. Takes about two minutes. Tamil or English.', 'தனிநபர்களுக்கு இலவசம். சுமார் இரண்டு நிமிடங்கள் ஆகும். தமிழ் அல்லது ஆங்கிலம்.')}</span>
          </p>
        </>
      )}
    />
  );
}

export default function HomeRest({ m, context, eventsReq, storiesReq, partnersReq }) {
  const { lang, t, localePath } = useLang();
  const progReq = useApi(`/api/programmes?status=${ACCEPTING.join(',')}`);
  const events = Array.isArray(eventsReq.data) ? eventsReq.data : [];
  const programmes = useMemo(
    () => (Array.isArray(progReq.data) ? progReq.data : []).filter((p) => ACCEPTING.includes(p.status)).sort(sortCalls).slice(0, 3),
    [progReq.data]
  );
  // Seeded placeholder stories are never listed; the section hides until a real founder story is published.
  const stories = realStories(storiesReq.data).filter((s) => s.type !== 'recap').slice(0, 6);
  const partners = Array.isArray(partnersReq.data) ? partnersReq.data : [];
  const showStories = storiesReq.loading || stories.length > 0;
  const film = featuredVideos().filter((v) => v.series === 'd2c-connect').slice(0, 1);
  // Strict Paper / Bone alternation (DESIGN-v2 6.1): when the stories band is hidden, the last two grounds swap so
  // Updates (Bone) is never followed by another Bone band.
  const partnerSurface = showStories ? 'sunken' : 'paper';
  const faqSurface = showStories ? 'paper' : 'sunken';

  return (
    <>
      {/* M07 · How it works, told as dot → grid → network → full stop (PulliTimeline; no pin) */}
      <FounderStory nextId="mission" />

      {/* Mission 1 Lakh: 5/7, copy top-aligned; the figure panel carries the meter whose current value is the red point */}
      <Section id="mission" surface="sunken" className="home-mission home-lazy">
        <div className="home-mission__inner">
          <div className="home-mission__copy">
            <SectionHeader eyebrow={t('Our goal', 'எங்கள் இலக்கு')} title="Mission 1 Lakh" />
            <Reveal>
              <p className="body-lg home-mission__body">
                {t(
                  'Our goal is to nurture 1,00,000 founders and aspiring founders in Tamil Nadu by March 2031, and 10,00,000 by 2040. “Nurtured” has a strict meaning: a StartNet X profile plus at least two meaningful programme touchpoints. We count it in public, every quarter.',
                  'மார்ச் 2031-க்குள் தமிழ்நாட்டில் 1,00,000 நிறுவனர்களையும் நிறுவனராக விரும்புவோரையும், 2040-க்குள் 10,00,000 பேரையும் வளர்த்தெடுப்பதே எங்கள் இலக்கு. “வளர்த்தெடுக்கப்பட்டவர்” என்பதற்குக் கண்டிப்பான பொருள் உண்டு: ஒரு StartNet X சுயவிவரமும், குறைந்தது இரண்டு அர்த்தமுள்ள திட்டத் தொடர்புகளும். ஒவ்வொரு காலாண்டும் இதைப் பொதுவில் எண்ணுகிறோம்.'
                )}
              </p>
            </Reveal>
            <Reveal delay={0.08} className="home-mission__actions">
              <Button variant="secondary" to="/about/evidence-standard">{t('See how we count', 'நாங்கள் எப்படி எண்ணுகிறோம் என்று பாருங்கள்')}</Button>
              <Button variant="tertiary" to="/insights/founder-ledger">{t('Read the latest Founder Ledger', 'சமீபத்திய Founder Ledger-ஐப் படியுங்கள்')}</Button>
            </Reveal>
          </div>
          <Reveal delay={0.12} className="home-mission__panel">
            <div className="home-mission__targets">
              <Stat metric={localizeMetric(m.target2031, lang)} variant="default" />
              <Stat metric={localizeMetric(m.target2040, lang)} variant="compact" />
            </div>
            <p className="caption home-mission__tagline">{t('Target · planning assumption', 'இலக்கு · திட்டமிடல் அனுமானம்')}</p>
            <MissionMeter metric={m.nurtured} />
          </Reveal>
        </div>
      </Section>

      {/* Why Tamil Nadu: 7/5, copy and a 2×2 stat grid left, the map art right (clip-in) */}
      <Section id="why-tamil-nadu" className="home-why home-lazy">
        <div className="home-why__inner">
          <div className="home-why__copy">
            <SectionHeader
              eyebrow={t('Why Tamil Nadu', 'ஏன் தமிழ்நாடு')}
              title={t("The talent is here. The bridge to capital isn't, yet.", 'திறமை இங்கே இருக்கிறது. மூலதனத்துக்கான பாலம் இன்னும் இல்லை.')}
              lede={t(
                'Tamil Nadu has the students, the researchers, the women founders and the Global Capability Centres. What it lacks is enough people helping talent become companies, especially outside Chennai.',
                'தமிழ்நாட்டில் மாணவர்கள், ஆய்வாளர்கள், பெண் நிறுவனர்கள், Global Capability Centres அனைத்தும் உள்ளன. குறைவாக இருப்பது, திறமையை நிறுவனங்களாக மாற்ற உதவும் போதுமான மனிதர்கள்தான், குறிப்பாகச் சென்னைக்கு வெளியே.'
              )}
            />
            <RevealGroup className="home-why__stats">
              {context.map((s) => <Stat key={s.id} metric={s} />)}
            </RevealGroup>
            <Reveal className="home-why__more">
              <Button variant="tertiary" to="/insights">{t('Explore Insights', 'நுண்ணறிவுகளை ஆராயுங்கள்')}</Button>
            </Reveal>
          </div>
          <Reveal variant="clip" className="home-why__art">
            <ArtImage
              variant="map"
              ratio="4/5"
              seed={38}
              alt={t("Abstract dot map of Tamil Nadu's 38 districts", 'தமிழ்நாட்டின் 38 மாவட்டங்களின் புள்ளி வரைபடம் (கலைப்படைப்பு)')}
            />
          </Reveal>
        </div>
      </Section>

      {/* On film: the D2C Connect 2024 aftermovie (data/videos.js) on the Ink band, 16/9, opened up by ClipReveal */}
      <Section id="on-film" surface="night" className="home-film home-lazy">
        {film.length > 0 && (
          <>
            <SectionHeader
              eyebrow={t('On film', 'காணொளியில்')}
              title={t('Inside the room at D2C Connect 2024', 'D2C Connect 2024 அரங்கின் உள்ளே')}
            />
            {film.map((v) => (
              <ClipReveal key={v.id} className="home-film__media">
                <VideoFeature video={v} />
              </ClipReveal>
            ))}
          </>
        )}
        <div className="home-film__more">
          <Button variant="tertiary" to="/events/past">{t('See past events', 'கடந்த நிகழ்வுகளைப் பாருங்கள்')}</Button>
        </div>
      </Section>

      {/* M05 · What's on: a right-bleed snap scroller; its controls share the header's action row (Home.css) */}
      <Section id="coming-up" surface="white" className="home-events home-rail home-lazy">
        <SectionHeader
          eyebrow={t("What's on", 'நடப்பவை')}
          title={t('Coming up', 'வரவிருப்பவை')}
          action={<Button variant="tertiary" to="/events">{t('See all events', 'அனைத்து நிகழ்வுகளையும் பாருங்கள்')}</Button>}
        />
        <div className="home-block">
          {eventsReq.loading ? (
            <Skeleton height="22rem" count={1} />
          ) : events.length ? (
            <Scroller label={t('Upcoming events', 'வரவிருக்கும் நிகழ்வுகள்')} itemWidth="min(20rem, 82vw)">
              {events.slice(0, 8).map((e) => <EventCard key={e.slug} event={e} />)}
            </Scroller>
          ) : (
            <EmptyState
              title={t('New dates are being confirmed.', 'புதிய தேதிகள் உறுதி செய்யப்பட்டு வருகின்றன.')}
              body={t('Get them first on WhatsApp or by email.', 'WhatsApp அல்லது மின்னஞ்சல் வழியாக முதலில் பெறுங்கள்.')}
              action={(
                <Button variant="whatsapp" href={waLink('Hi StartNet, please send me event alerts', 'home-events')}>
                  {t('Get event alerts', 'நிகழ்வு அறிவிப்புகளைப் பெறுங்கள்')}
                </Button>
              )}
            />
          )}
        </div>
      </Section>

      {/* M06 · Open calls: open, closing and rolling (F-40); framed cards 3-up */}
      <Section id="open-now" className="home-open home-lazy">
        <SectionHeader
          eyebrow={t('Programmes', 'திட்டங்கள்')}
          title={t('Open now', 'இப்போது திறந்துள்ளவை')}
          lede={t('Most first steps are free.', 'பெரும்பாலான முதல் படிகள் இலவசம்.')}
          action={<Button variant="tertiary" to="/programmes">{t('Find your programme', 'உங்கள் திட்டத்தைக் கண்டறியுங்கள்')}</Button>}
        />
        <div className="home-block">
          {progReq.loading ? (
            <Skeleton height="16rem" count={1} />
          ) : programmes.length ? (
            <RevealGroup className="home-open__grid">
              {programmes.map((p) => <ProgrammeCard key={p.slug} programme={p} />)}
            </RevealGroup>
          ) : (
            <EmptyState
              title={t('Nothing open right now.', 'இப்போது எதுவும் திறந்திருக்கவில்லை.')}
              body={t('Get an alert when something opens.', 'ஏதேனும் திறக்கும்போது அறிவிப்பு பெறுங்கள்.')}
              action={(
                <Button variant="whatsapp" href={waLink('Hi StartNet, alert me when a programme opens', 'home-programmes')}>
                  {t('Get alerts', 'அறிவிப்புகளைப் பெறுங்கள்')}
                </Button>
              )}
            />
          )}
        </div>
      </Section>

      {/* Updates: a pill segmented control with a sliding indicator */}
      <Section id="updates" surface="white" className="home-updates home-lazy">
        <SectionHeader
          eyebrow={t('Updates', 'புதிய தகவல்கள்')}
          title={t('News, events and the Founder Ledger', 'செய்திகள், நிகழ்வுகள் மற்றும் Founder Ledger')}
        />
        <Reveal className="home-block">
          <UpdatesTabs events={events} eventsLoading={eventsReq.loading} />
        </Reveal>
      </Section>

      {/* M14 · Founder stories (hidden until at least one real story exists) */}
      {showStories && (
      <Section id="stories" className="home-stories home-rail home-lazy">
        <SectionHeader
          eyebrow={t('Stories', 'கதைகள்')}
          title={t('Founders, in their own words', 'நிறுவனர்கள், அவர்களின் சொந்த வார்த்தைகளில்')}
          action={<Button variant="tertiary" to="/insights/stories">{t('Read more stories', 'மேலும் கதைகளைப் படியுங்கள்')}</Button>}
        />
        <div className="home-block">
          {storiesReq.loading ? (
            <Skeleton height="18rem" count={1} />
          ) : (
            <Scroller label={t('Founder stories', 'நிறுவனர் கதைகள்')} itemWidth="min(22rem, 82vw)">
              {stories.map((s) => <StoryCard key={s.slug} story={s} />)}
            </Scroller>
          )}
        </div>
      </Section>
      )}

      {/* Partner band: 5/7, the copy left, the art (and the signed-partner wall, when there is one) right */}
      <Section id="partner" surface={partnerSurface} className="home-partner home-lazy">
        <div className="home-partner__inner">
          <div className="home-partner__aside">
            <Reveal variant="clip" className="home-partner__art">
              <ArtImage
                variant="network"
                ratio="3/2"
                seed={4}
                alt={t('Generative artwork: dots joined into a network', 'உருவாக்கக் கலைப்படைப்பு: ஒரு வலையமைப்பாக இணைந்த புள்ளிகள்')}
              />
            </Reveal>
            {partners.length >= 3 && (
              <div className="home-partner__logos">
                <LogoWall partners={partners} />
              </div>
            )}
          </div>
          <div className="home-partner__copy">
            <Reveal as="p" className="eyebrow">{t('Partner with us', 'எங்களுடன் கூட்டு சேருங்கள்')}</Reveal>
            <Reveal as="h2" delay={0.06} className="h2 home-partner__title">
              {t('Organisations that need founders pay for founders', 'நிறுவனர்கள் தேவைப்படும் அமைப்புகளே நிறுவனர்களுக்காகச் செலவிடுகின்றன')}
            </Reveal>
            <Reveal as="p" delay={0.12} className="body-lg text-2 home-partner__lede">
              {t(
                'Universities want spinouts and innovation metrics. GCCs want problem-solvers, pilots and talent. Government wants reach and measured delivery. We design programmes around those outcomes and report on them in public.',
                'பல்கலைக்கழகங்களுக்கு ஸ்பின்அவுட்களும் புத்தாக்க அளவீடுகளும் தேவை. GCC-களுக்குச் சிக்கல் தீர்ப்பவர்கள், பைலட்கள், திறமையாளர்கள் தேவை. அரசுக்குப் பரவலான சென்றடைவும் அளவிடப்பட்ட செயலாக்கமும் தேவை. அந்த விளைவுகளைச் சுற்றியே நாங்கள் திட்டங்களை வடிவமைத்து, அவற்றைப் பொதுவில் அறிக்கையிடுகிறோம்.'
              )}
            </Reveal>
            <RevealGroup as="ul" className="home-partner__links">
              {PARTNER_LINKS.map((l) => (
                <li key={l.to}>
                  <Link className="home-partner__link" to={localePath(l.to)}>
                    <span className="home-partner__link-label">{t(l.label, l.labelTa)}</span>
                    <ArrowRight size={18} aria-hidden="true" />
                  </Link>
                </li>
              ))}
            </RevealGroup>
          </div>
        </div>
      </Section>

      {/* AEO FAQ: drafted from Book 2 §1 and §3.0 — StartNet review. FAQPage JSON-LD is emitted by Home.jsx.
          4/8: the header sticks in cols 1–4 at ≥1024 while the questions scroll in cols 5–12. */}
      <Section id="questions" surface={faqSurface} className="home-faq home-lazy" labelledBy="home-faq-title">
        <div className="home-faq__inner">
          <div className="home-faq__head">
            <SectionHeader
              eyebrow={t('Common questions', 'பொதுவான கேள்விகள்')}
              title={<span id="home-faq-title">{t('Questions about StartNet', 'StartNet பற்றிய கேள்விகள்')}</span>}
            />
          </div>
          <Reveal className="home-faq__list">
            <Accordion items={homeFaqItems(t)} />
          </Reveal>
        </div>
      </Section>

      {/* M04 · Closing CTA — the last thing on the page is the brand device */}
      <ClosingCta />
    </>
  );
}
