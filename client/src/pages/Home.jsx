import { Suspense, lazy, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import {
  Seo, Section, SectionHeader, KineticHeadline, Reveal, Button, BrandTile, Scroller, Marquee,
} from '../components';
import { ScrubText } from '../components/ScrubText.jsx';
import { Stat } from '../components/Stat.jsx';
import { realMetrics } from '../components/_placeholders.js';
import { eventPath, cx } from '../components/_utils.js';
import { useApi } from '../hooks/useApi.js';
import { useLang } from '../lib/i18n.jsx';
import { TALENT_BRANDS } from '../data/brands.js';
import PersonaChips, { firstChipInputId } from './home/PersonaChips.jsx';
import { getPersona } from './home/personas.js';
import HeroShowcase from './home/HeroShowcase.jsx';
import { pickHomeMetrics, proofAndContext, brandMetric, withoutVerifiedTag } from './home/homeMetrics.js';
import { localizeMetric } from './home/homeI18n.js';
import { homeFaqItems } from './home/homeFaq.js';
import { itemListLd } from '../lib/seo.js';
import { cleanFaqLd, pageLd } from './brands/seoBits.js';
import './Home.css';
import { STARTUPS, logoWidth } from '../data/startups.js';
import { formatDate } from '../lib/format.js';

// Everything from FounderStory down loads as its own chunk (F-33: not in the entry every page downloads, and not
// part of Home's first load; F-14: Home's first render covers only the first screens).
const HomeRest = lazy(() => import('./home/HomeRest.jsx'));

// Once requested in this session (or when arriving with a #hash / scrolled), Home renders the rest straight away.
// The build-time prerender (tools/seo/prerender.mjs) renders the whole page at once, so the crawlable snapshot holds
// the same sections a visitor gets as soon as they scroll (including the FAQ that the FAQPage markup describes).
const PRERENDER = typeof navigator !== 'undefined' && /StartNetPrerender/.test(navigator.userAgent || '');
// A prerendered snapshot is already on screen: render the whole page now so the live app can take over from it.
let restWanted = PRERENDER || (typeof document !== 'undefined' && !!document.getElementById('sn-prerender'));
const REST_TRIGGERS = ['scroll', 'wheel', 'touchstart', 'pointerdown', 'keydown', 'beforeprint'];

/**
 * True once the rest of Home should render: it is within one screen of the viewport (IntersectionObserver, which
 * also covers crawlers that render with a tall viewport), or the visitor starts interacting (first scroll, touch,
 * click or key), or the browser is idle after the window 'load' event, so the chunk is normally in well before it
 * is scrolled to. Until then it is not downloaded.
 */
function useRestOfHome() {
  const ref = useRef(null);
  const [show, setShow] = useState(
    () => restWanted || (typeof window !== 'undefined' && (!!window.location.hash || window.scrollY > 0))
  );
  useEffect(() => {
    if (show) { restWanted = true; return undefined; }
    const go = () => setShow(true);
    REST_TRIGGERS.forEach((e) => window.addEventListener(e, go, { passive: true, once: true }));
    let io = null;
    if (typeof IntersectionObserver === 'undefined' || !ref.current) go();
    else {
      io = new IntersectionObserver((rs) => { if (rs.some((r) => r.isIntersecting)) go(); }, { rootMargin: '0px 0px 100% 0px' });
      io.observe(ref.current);
    }
    // Also mount in idle time once the page has loaded (after LCP), so the chunk and its first render are usually
    // done before the first wheel; otherwise mounting on that wheel drops a frame mid-glide.
    let idleId = 0;
    let idleTimer = 0;
    const scheduleIdle = () => {
      if ('requestIdleCallback' in window) idleId = window.requestIdleCallback(go, { timeout: 2000 });
      else idleTimer = window.setTimeout(go, 1500);
    };
    if (document.readyState === 'complete') scheduleIdle();
    else window.addEventListener('load', scheduleIdle, { once: true });
    return () => {
      REST_TRIGGERS.forEach((e) => window.removeEventListener(e, go, { passive: true, once: true }));
      if (io) io.disconnect();
      window.removeEventListener('load', scheduleIdle);
      if (idleId && 'cancelIdleCallback' in window) window.cancelIdleCallback(idleId);
      clearTimeout(idleTimer);
    };
  }, [show]);
  return [ref, show];
}

// Holds the space while the rest is not rendered, so the footer is not pulled up into view meanwhile.
const restPlaceholder = (ref) => <div ref={ref} className="home-rest-pending" style={{ minHeight: '100vh' }} aria-hidden="true" />;

/*
 * Home (T01). Copy: Book 2 §1 (verbatim). Stack: Book 1 Part B §6.2 T01 + Book 2 §1 order.
 * Layout: Book 3 Part B §4 (hero 6/6, persona tiles, doors 4/2/1, one Night fact band,
 * events scroller, updates tabs). Motion: Book 4 E1 — the page's one beat is the full stop
 * landing in the hero; one pinned scroll story (FounderStory) on desktop only.
 *
 * Tamil: Book 2 §14.1 (hero) and §14.3 (CTAs) verbatim; every other Tamil string here is a DRAFT
 * written for this page — native Tamil review pending before launch (Book 2 §14 status).
 * Brand and programme names stay in Latin script.
 */

// SEO: primary "startup network Tamil Nadu", secondary "founder programmes Tamil Nadu" (Book 1 §9.2). Title and
// description from Book 2 §1, with the keyword added; no figures or superlatives.
const SEO = {
  title: "StartNet: Tamil Nadu's startup and founder-making network",
  // SEO-TA: pending native review
  titleTa: 'StartNet: தமிழ்நாட்டின் ஸ்டார்ட்அப் நிறுவனர் வலையமைப்பு',
  description:
    'Every talent, a founder. Startup programmes, events, learning, incubation and capital for students, scholars, professionals and women across Tamil Nadu.',
  // SEO-TA: pending native review
  descriptionTa:
    'ஒவ்வொரு திறமையும், ஒரு நிறுவனர். தமிழ்நாட்டின் மாணவர்கள், ஆய்வாளர்கள், பணியாளர்கள், பெண்களுக்கான ஸ்டார்ட்அப் திட்டங்கள், நிகழ்வுகள், இன்குபேஷன், மூலதனம்.',
};

/*
 * Hero (SPEC §5.1 #1, the Plug and Play home hero). One Ink band that runs up under the floating header card:
 *   1. Copy (cols 1–6, max --measure-hero) on a static pulli dot grid: a live "next event" pill (the soonest upcoming
 *      event with a confirmed date; the eyebrow line until events load or when there is none) → h1 with one serif
 *      accent word and the red full stop → lede → the two actions → the partner line.
 *   2. Showcase (cols 7–12, home/HeroShowcase.jsx): one large photo of StartNet's own at a time, bleeding to the top
 *      and right edges (32 0 0 32 corners); the next photo crossfades in.
 *   3. Proof strip (a 64px row at the hero's foot, full container width): community companies as one-colour marks
 *      in the kit Marquee.
 * Phones and portrait tablets: the photo first (full bleed, under the header card), then the copy, then the strip.
 * The copy is visible from first paint (transform-only entrance); the mosaic boxes are sized by CSS (no CLS).
 */
/** The soonest upcoming event with a confirmed date (the API lists upcoming events; sort defensively). */
function nextEvent(list) {
  const arr = Array.isArray(list) ? list : Array.isArray(list?.items) ? list.items : [];
  const today = new Date().toISOString().slice(0, 10);
  return arr
    .filter((e) => e && e.slug && e.date && e.dateConfirmed !== false && e.status !== 'past' && String(e.date) >= today)
    .sort((a, b) => String(a.date).localeCompare(String(b.date)))[0];
}

/*
 * A fixed "next" announcement that takes the pill's place while it is set (Nov 2026: the next Agentic AI Connect is
 * 2027, date to come). Set to null to go back to the soonest dated event from the API.
 */
const HERO_NEXT = {
  title: 'Agentic AI Connect 2027',
  titleTa: 'Agentic AI Connect 2027',
  meta: 'Coming soon',
  metaTa: 'விரைவில்',
  to: '/events/agentic-ai-connect/2027',
};

function HeroPill({ event: apiEvent }) {
  const { t, lang, pick, localePath } = useLang();
  if (HERO_NEXT) {
    return (
      <Link className="home-hero__pill home-hero__rise" to={localePath(HERO_NEXT.to)}>
        <span className="home-hero__pill-tag">
          <span className="home-hero__pill-dot" aria-hidden="true" />
          {t('Next', 'அடுத்து')}
        </span>
        <span className="home-hero__pill-text">
          <span className="home-hero__pill-title">{t(HERO_NEXT.title, HERO_NEXT.titleTa)}</span>
          <span className="home-hero__pill-meta">{t(HERO_NEXT.meta, HERO_NEXT.metaTa)}</span>
        </span>
        <ArrowRight className="home-hero__pill-arrow" size={16} strokeWidth={1.75} aria-hidden="true" />
      </Link>
    );
  }
  const event = apiEvent;
  if (!event) {
    return (
      <p className="eyebrow home-hero__eyebrow home-hero__rise">
        {t("Tamil Nadu's founder-making network", 'தமிழ்நாட்டின் நிறுவனர்களை உருவாக்கும் வலையமைப்பு')}
      </p>
    );
  }
  const title = pick(event, 'title');
  const city = pick(event, 'city');
  const date = formatDate(event.date, { day: 'numeric', month: 'short' }, lang);
  return (
    <Link className="home-hero__pill home-hero__rise" to={localePath(eventPath(event))}>
      <span className="home-hero__pill-tag">
        <span className="home-hero__pill-dot" aria-hidden="true" />
        {t('Next', 'அடுத்து')}
      </span>
      <span className="home-hero__pill-text">
        <span className="home-hero__pill-title">{title}</span>
        <span className="home-hero__pill-meta">{[date, city].filter(Boolean).join(' · ')}</span>
      </span>
      <ArrowRight className="home-hero__pill-arrow" size={16} strokeWidth={1.75} aria-hidden="true" />
    </Link>
  );
}

function HeroProof() {
  const { t, localePath } = useLang();
  // SPEC §5.1: the proof strip is the kit Marquee (64px row, Paper marks at 60%), pinned to the hero's foot. It pauses
  // on hover / focus and with its Pause button, and is a static wrapped row under reduced motion.
  const logos = STARTUPS.map((s) => (
    <span key={s.slug} className="home-hero__logo">
      <img src={s.logo} alt={s.name} loading="lazy" decoding="async" style={{ '--logo-w': `${(logoWidth(s.ratio, s.scale) * 2.1).toFixed(0)}px` }} />
    </span>
  ));
  return (
    <div className="home-hero__proof home-hero__rise home-hero__rise--3">
      <Link className="home-hero__proof-label" to={`${localePath('/insights/stories')}#community-startups`}>
        {t('Built by founders in our community', 'எங்கள் சமூக நிறுவனர்கள் உருவாக்கியவை')}
        <ArrowRight size={14} strokeWidth={1.75} aria-hidden="true" />
      </Link>
      <Marquee className="home-hero__logos" items={logos} label={t('Community companies', 'சமூக நிறுவனங்கள்')} />
    </div>
  );
}

function HomeHero({ events }) {
  const { t } = useLang();
  const next = useMemo(() => nextEvent(events), [events]);
  return (
    <section className="home-hero home-hero--v3" data-surface="night" aria-label={t("Tamil Nadu's founder-making network", 'தமிழ்நாட்டின் நிறுவனர்களை உருவாக்கும் வலையமைப்பு')}>
      {/* The static pulli dot grid on the left 45% (SPEC §4.16), behind the copy. */}
      <div className="home-hero__bg u-pulli" aria-hidden="true" />
      <div className="container home-hero__grid">
        <div className="home-hero__copy">
          <div className="home-hero__lead-slot">
            <HeroPill event={next} />
          </div>
          <KineticHeadline
            as="h1"
            accentWord="founder"
            className="display-2xl home-hero__title"
            text={t('Every talent, a founder.', 'ஒவ்வொரு திறமையும், ஒரு நிறுவனர்.')}
          />
          {/* Lede + CTAs render visible from the first paint (LCP); the entrance is transform-only (Home.css). */}
          <p className="body-lg home-hero__lede home-hero__rise home-hero__rise--1">
            {t(
              'StartNet is Tamil Nadu’s founder-making network. We go to campuses, labs, workplaces and districts, and help people with talent turn it into companies.',
              'StartNet தமிழ்நாட்டின் நிறுவனர்களை உருவாக்கும் வலையமைப்பு. கல்லூரிகள், ஆய்வகங்கள், பணியிடங்கள், மாவட்டங்கள் என திறமை இருக்கும் இடத்திற்கே நாங்கள் சென்று, அந்தத் திறமையை நிறுவனங்களாக மாற்ற உதவுகிறோம்.'
            )}
          </p>
          <div className="home-hero__cta home-hero__rise home-hero__rise--2">
            <div className="home-hero__actions">
              <Button size="lg" to="/programmes" icon={ArrowRight}>{t('Find your programme', 'உங்கள் திட்டத்தைக் கண்டறியுங்கள்')}</Button>
              <Button size="lg" variant="secondary" to="/events">{t('See upcoming events', 'வரவிருக்கும் நிகழ்வுகளைப் பாருங்கள்')}</Button>
            </div>
            <p className="home-hero__partner">
              <span className="home-hero__partner-q">
                {t('Representing an institution, GCC or government body?', 'கல்வி நிறுவனம், GCC அல்லது அரசுத் துறையைச் சார்ந்தவரா?')}
              </span>{' '}
              <Button variant="tertiary" to="/partner" className="home-hero__partner-link">{t('Partner with us', 'எங்களுடன் கூட்டு சேருங்கள்')}</Button>
            </p>
          </div>
        </div>
        <HeroShowcase />
        <HeroProof />
      </div>
    </section>
  );
}

/*
 * "I am a…" (M02), the pre-redesign look restored at the user's request (Nov 2026): the question in cols 1–4, the
 * nine personas as pill chips in two groups in cols 5–12 (home/PersonaChips.jsx), and Continue under the chips. The
 * chosen persona's next step shows beside the button, which then names that step; Continue with no choice says what
 * is missing and moves focus to the first chip. /join keeps its own tiles (PersonaSelector).
 */
function PersonaBand() {
  const [value, setValue] = useState('');
  const [error, setError] = useState(false);
  const navigate = useNavigate();
  const { t, localePath } = useLang();
  const persona = getPersona(value);
  return (
    <Section id="i-am" className="home-persona-band">
      <form
        className="home-persona-band__form"
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          if (persona) { navigate(localePath(persona.to)); return; }
          setError(true);
          document.getElementById(firstChipInputId('home-persona'))?.focus();
        }}
      >
        <div id="home-persona-legend" className="home-persona-band__head">
          <Reveal as="h2" className="h2 home-persona-band__title">{t('I am a…', 'நான் ஒரு…')}</Reveal>
          <Reveal as="p" delay={0.06} className="body-lg home-persona-band__lede">
            {t(
              'Pick the one closest to you and we’ll take you to the right door.',
              'உங்களுக்கு மிக நெருக்கமானதைத் தேர்ந்தெடுங்கள்; சரியான வாசலுக்கு உங்களை அழைத்துச் செல்கிறோம்.'
            )}
          </Reveal>
        </div>
        <Reveal delay={0.12} className="home-persona-band__pick">
          <PersonaChips
            name="home-persona"
            value={value}
            onChange={(v) => { setValue(v); setError(false); }}
            legendId="home-persona-legend"
            invalid={error}
            describedBy={error ? 'home-persona-error' : undefined}
          />
          {error && (
            <p className="home-persona-band__error" id="home-persona-error" role="alert">
              {t('Please choose the option closest to you.', 'உங்களுக்கு மிக நெருக்கமான தேர்வைத் தேர்ந்தெடுக்கவும்.')}
            </p>
          )}
        </Reveal>
        <div className="home-persona-band__go" aria-live="polite">
          {persona && <p className="small muted home-persona-band__hint">{t(persona.next, persona.nextTa)}</p>}
          <Button
            type="submit"
            size="lg"
            icon={ArrowRight}
            aria-disabled={!persona || undefined}
            className={cx('home-persona-band__submit', !persona && 'is-inactive')}
          >
            {persona ? t(persona.stepLabel, persona.stepLabelTa) : t('Continue', 'தொடருங்கள்')}
          </Button>
        </div>
      </form>
    </Section>
  );
}

export default function Home() {
  const { lang, t, localePath } = useLang();
  const metricsReq = useApi('/api/metrics');
  const eventsReq = useApi('/api/events?when=upcoming');
  const partnersReq = useApi('/api/partners');
  const [restRef, showRest] = useRestOfHome();

  const m = useMemo(() => pickHomeMetrics(metricsReq.data), [metricsReq.data]);
  const { proof, context } = useMemo(() => {
    const pc = proofAndContext(m);
    const prep = (x) => withoutVerifiedTag(localizeMetric(x, lang));
    return { proof: pc.proof.map(prep), context: pc.context.map(prep) };
  }, [m, lang]);

  return (
    <div className="home">
      <Seo
        title={t(SEO.title, SEO.titleTa)}
        description={t(SEO.description, SEO.descriptionTa)}
        titleTa={SEO.titleTa}
        descriptionTa={SEO.descriptionTa}
        jsonLd={[
          pageLd({ path: '/', lang, name: t(SEO.title, SEO.titleTa), description: t(SEO.description, SEO.descriptionTa) }),
          itemListLd({
            name: t('The four StartNet brands', 'நான்கு StartNet பிராண்டுகள்'),
            items: TALENT_BRANDS.map((b) => ({ name: b.name, path: b.base })),
            lang,
          }),
          // AEO FAQ (rendered in HomeRest): JSON-LD here so it is present on first render.
          cleanFaqLd(homeFaqItems(t)),
        ]}
      />

      {/* M01 · Hero */}
      <HomeHero events={eventsReq.data} />

      {/* M02 · Persona selector */}
      <PersonaBand />

      {/* M12 · Proof band (Ink band #1, redesigned Nov 2026): the statement, a one-line intro and both links in cols 1–4;
          the figures as equal-height Night-1 cards in cols 5–12 (3 across, 2×2 for four), each with its evidence tag
          at the card's foot. The statement is the page's one scroll-scrubbed line. */}
      {realMetrics(proof).length > 0 && (
      <Section surface="night" id="where-things-stand" className="home-proof" labelledBy="home-proof-title">
        <div className="home-proof__inner">
          <div className="home-proof__head">
            <h2 className="h2 home-proof__title" id="home-proof-title">
              <ScrubText as="span" className="home-proof__statement">{t('Where things stand', 'இப்போதைய நிலை')}</ScrubText>
            </h2>
            <p className="home-proof__lede">
              {t(
                'The startup picture in Tamil Nadu, and how far StartNet has reached.',
                'தமிழ்நாட்டின் ஸ்டார்ட்அப் நிலவரமும், StartNet இதுவரை சென்றடைந்தவையும்.'
              )}
            </p>
            <ul className="home-proof__links">
              <li>
                <Link className="arrow-link home-proof__link" to={localePath('/insights/founder-ledger')}>
                  <span className="arrow-link__label">{t('Read the Founder Ledger', 'Founder Ledger-ஐப் படியுங்கள்')}</span>
                  <span className="arrow" aria-hidden="true"><ArrowRight size={16} strokeWidth={1.75} /></span>
                </Link>
              </li>
              <li>
                <Link className="arrow-link home-proof__link home-proof__link--muted" to={localePath('/about/evidence-standard')}>
                  <span className="arrow-link__label">{t('How we count, and what we got wrong', 'நாங்கள் எப்படி எண்ணுகிறோம், எங்கே தவறினோம்')}</span>
                  <span className="arrow" aria-hidden="true"><ArrowRight size={16} strokeWidth={1.75} /></span>
                </Link>
              </li>
            </ul>
          </div>
          <Reveal as="dl" y={12} className={cx('home-proof__grid', `home-proof__grid--n${Math.min(realMetrics(proof).length, 4)}`)}>
            {realMetrics(proof).slice(0, 4).map((metric) => (
              <Stat key={metric.id || metric.key} metric={metric} dl variant="lg" className="home-proof__card" />
            ))}
          </Reveal>
        </div>
      </Section>
      )}

      {/* M03 · Four doors (SPEC §5.1 #4): a Scroller of the four Ink / Slate BrandTiles; its counter and arrows share
          the header's action row from 1024 (.home-rail). */}
      <Section id="brands" className="home-doors home-rail">
        <SectionHeader
          eyebrow={t('Our brands', 'எங்கள் பிராண்டுகள்')}
          title={t('Four doors into founding', 'நிறுவனராவதற்கு நான்கு வாசல்கள்')}
          action={<Button variant="tertiary" to="/brands">{t('See all our brands', 'எங்கள் அனைத்துப் பிராண்டுகளையும் பாருங்கள்')}</Button>}
        />
        <div className="home-block">
          <Scroller className="home-doors__rail" label={t('The four StartNet brands', 'நான்கு StartNet பிராண்டுகள்')} itemWidth="min(24rem, 82vw)" nudge={false}>
            {TALENT_BRANDS.map((b, i) => (
              <Reveal key={b.key} delay={Math.min(i, 5) * 0.06} className="home-doors__item">
                <BrandTile brand={b.key} stat={withoutVerifiedTag(localizeMetric(brandMetric(metricsReq.data, b.key), lang))} />
              </Reveal>
            ))}
          </Scroller>
        </div>
      </Section>

      {/* M07 → M04: FounderStory, Why Tamil Nadu + Mission 1 Lakh, the film, events, open calls, partners,
          questions, closing CTA (home/HomeRest.jsx). Their data requests start here, with the page. */}
      {showRest ? (
        <Suspense fallback={restPlaceholder(null)}>
          <HomeRest m={m} context={context} eventsReq={eventsReq} partnersReq={partnersReq} />
        </Suspense>
      ) : (
        restPlaceholder(restRef)
      )}
    </div>
  );
}
