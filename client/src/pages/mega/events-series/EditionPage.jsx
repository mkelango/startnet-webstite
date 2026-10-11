// /events/<series>/<edition> (+ /agenda, /speakers) — Event edition (Book 1 Part B §2.2 P1/P2, template T05:
// event hero (date, venue, district, format, price) → key facts → tabs Overview · Agenda · Speakers, synced to the
// sub-route → Register (SNX) + add to calendar; post-event the same URL is the recap with outcomes (Book 4 IX-22).
// One component serves all three routes: the tab comes from the `tab` prop or the path suffix, so switching tabs
// keeps the page mounted. Edition → event record: "<series>-<edition>" slug (e.g. vibathon/2027 → vibathon-2027).
// Data: GET /api/events?series=<series> (the edition plus its siblings, shared cache with the series page).
import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { ArrowRight, BellRing, CalendarPlus, Check, MessageCircle } from 'lucide-react';
import {
  Seo, Section, SectionHeader, KineticHeadline, Breadcrumbs, KeyFacts, Badge, Button, Accordion, CTABand, Stat,
  InlineMarks, Skeleton, ArtImage, PersonCard, Reveal, RevealGroup,
} from '../../../components';
import { SITE_ORIGIN, eventLd } from '../../../lib/seo.js';
import { fitTitle, fitDescription, realText } from '../../programmes/parts/seoFit.js';
import { useLang } from '../../../lib/i18n.jsx';
import { snxLink, waLink } from '../../../lib/links.js';
import { useApi } from '../../../hooks/useApi.js';
import { useSlidingIndicator } from '../../../components/_indicator.js';
import { usePageCta } from '../../../layout/shell.jsx';
import { BRANDS } from '../../../data/brands.js';
import { byDate, isConfirmed } from '../../events/parts/eventMeta.js';
import { eventTimeRange, eventDateRange, dateBlock } from '../../events/parts/eventTime.js';
import { downloadIcs } from '../../events/parts/ics.js';
import NotFound from '../../utility/NotFound.jsx';
import { isPlaceholderText as isOnlyPlaceholder } from '../../../components/_placeholders.js';
import { seriesConfig, findEdition, editionKeyOf, editionCrumb, brandOf, ART_FOR, seedOf, isPlaceholderText, localizeEvent, enIf, SERIES_SEO, editionWhenSentence } from './seriesData.js';
import { useEventText, EditionCard } from './seriesParts.jsx';
import './EditionPage.css';
import { eventGallery, eventPhotoKeys, photoFor, posterPhoto, PHOTO_SIZES } from '../../../data/photos.js';
import { eventPath } from '../../../components/_utils.js';
import { EventGallery } from '../../../components/EventGallery.jsx';
import { EventVideos } from '../../../components/VideoFeature.jsx';
import { videosFor } from '../../../data/videos.js';

const TAB_IDS = ['overview', 'agenda', 'speakers'];


// Book 1 §7.4: /events/<series>/<edition> is the canonical URL of an edition. The /agenda and /speakers tabs show the
// same record, so they point canonical, og:url and the hreflang alternates at the edition URL. Seo (a child) writes
// the path-based tags first in the same commit; this effect then corrects them. Seo removes its links on unmount.
function setHeadLink(rel, href, hreflang) {
  const sel = hreflang ? `link[rel="${rel}"][hreflang="${hreflang}"]` : `link[rel="${rel}"]:not([hreflang])`;
  const el = document.head.querySelector(sel);
  if (el) el.setAttribute('href', href);
}
function useEditionCanonical(path, lang, pathname) {
  useEffect(() => {
    if (!path || typeof document === 'undefined') return;
    const enUrl = `${SITE_ORIGIN}${path}`;
    const taUrl = `${SITE_ORIGIN}/ta${path}`;
    const canonical = lang === 'ta' ? taUrl : enUrl;
    setHeadLink('canonical', canonical);
    setHeadLink('alternate', enUrl, 'en-IN');
    setHeadLink('alternate', taUrl, 'ta-IN');
    setHeadLink('alternate', enUrl, 'x-default');
    document.head.querySelector('meta[property="og:url"]')?.setAttribute('content', canonical);
  }, [path, lang, pathname]);
}

function tabFromPath(pathname) {
  if (/\/agenda\/?$/.test(pathname)) return 'agenda';
  if (/\/speakers\/?$/.test(pathname)) return 'speakers';
  return 'overview';
}


/** Path-synced section tabs (Book 3 C33 `page` variant). Links, not buttons: each tab is its own URL. */
function EditionTabs({ base, active, labels }) {
  const { t, localePath } = useLang();
  const navRef = useRef(null);
  // One 2px Ink underline glides between the tab links (DESIGN-v2 3.12); static underline before it is measured.
  useSlidingIndicator(navRef, '[aria-current="page"]', [active]);
  return (
    <nav className="edition-tabs" id="edition-tabs" ref={navRef} aria-label={t('Edition sections', 'பதிப்புப் பகுதிகள்')}>
      <span className="ind ind--line" aria-hidden="true" />
      <ul className="edition-tabs__list">
        {TAB_IDS.map((id) => {
          const on = id === active;
          const path = id === 'overview' ? base : `${base}/${id}`;
          return (
            <li key={id}>
              <Link
                className={`edition-tabs__tab${on ? ' is-active' : ''}`}
                to={{ pathname: localePath(path), hash: '#edition-tabs' }}
                aria-current={on ? 'page' : undefined}
                preventScrollReset
              >
                {labels[id]}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

function Agenda({ e, x, calendarButton }) {
  if (Array.isArray(e.agenda) && e.agenda.length) {
    return (
      <div className="edition-panel__block">
        <h2 className="h3">{x.t('Agenda', 'நிகழ்ச்சி நிரல்')}</h2>
        <div className="edition-table" role="region" aria-label={x.t('Agenda', 'நிகழ்ச்சி நிரல்')} tabIndex={0}>
          <table className="edition-table__table">
            <caption className="caption">{x.t('All times IST', 'அனைத்து நேரங்களும் IST')}</caption>
            <thead>
              <tr>
                <th scope="col">{x.t('Time', 'நேரம்')}</th>
                <th scope="col">{x.t('Session', 'அமர்வு')}</th>
                <th scope="col">{x.t('Speaker', 'பேச்சாளர்')}</th>
              </tr>
            </thead>
            <tbody lang={enIf(x.lang, e.agenda)}>
              {e.agenda.map((a, i) => (
                <tr key={`${a.time}-${i}`}>
                  <td className="tnum edition-table__time">{a.time}</td>
                  <th scope="row"><InlineMarks text={a.title} /></th>
                  <td>{a.speaker ? <InlineMarks text={a.speaker} /> : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="cluster">{calendarButton}</div>
      </div>
    );
  }
  if (Array.isArray(e.timeline) && e.timeline.length) {
    return (
      <div className="edition-panel__block">
        <h2 className="h3">{x.t('Timeline', 'கால அட்டவணை')}</h2>
        <ol className="edition-timeline" lang={enIf(x.lang, e.timeline)}>
          {e.timeline.map((r, i) => (
            <li key={`${r.stage}-${i}`} className="edition-timeline__item">
              <span className="edition-timeline__dot" aria-hidden="true" />
              {r.when && !isOnlyPlaceholder(r.when) && <p className="edition-timeline__when caption"><InlineMarks text={r.when} /></p>}
              <h3 className="h5 edition-timeline__stage">{r.stage}</h3>
              <p className="text-2"><InlineMarks text={r.what} /></p>
            </li>
          ))}
        </ol>
        {/* Dates and the session agenda are not shown as placeholders; they appear once StartNet supplies them. */}
        <div className="cluster">{calendarButton}</div>
      </div>
    );
  }
  // No agenda yet: no "Agenda" heading over a placeholder, just the calendar action.
  return (
    <div className="edition-panel__block">
      <div className="cluster">{calendarButton}</div>
    </div>
  );
}

function Speakers({ e, x }) {
  const names = [...new Set((e.agenda || []).map((a) => a.speaker).filter((s) => s && !isPlaceholderText(s)))];
  return (
    <div className="edition-panel__block">
      <h2 className="h3">{x.t('Speakers', 'பேச்சாளர்கள்')}</h2>
      {/* Speakers are listed only once named (with consent); no placeholder line until then. */}
      {names.length > 0 && (
        <RevealGroup as="ul" className="edition-speakers">
          {names.map((name) => (
            <li key={name}>
              <PersonCard person={{ name, role: x.t('Speaker', 'பேச்சாளர்'), brand: brandOf(e.brand) || undefined }} />
            </li>
          ))}
        </RevealGroup>
      )}
      {e.jury && !isOnlyPlaceholder(e.jury) && (
        <div className="edition-panel__sub">
          <h3 className="h4">{x.t('Jury', 'நடுவர் குழு')}</h3>
          <p className="text-2" lang={enIf(x.lang, e.jury)}>
            <InlineMarks text={e.jury} />
          </p>
        </div>
      )}
      <div className="edition-panel__sub">
        <h3 className="h4">{x.t('Want to speak or mentor?', 'பேச அல்லது வழிகாட்ட விரும்புகிறீர்களா?')}</h3>
        <p className="text-2">
          {x.t('Tell us what you would like to talk about or mentor on.', 'நீங்கள் எதைப் பற்றிப் பேச அல்லது வழிகாட்ட விரும்புகிறீர்கள் என்று சொல்லுங்கள்.')}
        </p>
        <Button variant="tertiary" to="/events/speak" icon={ArrowRight}>
          {x.t('Speak or mentor', 'பேசுங்கள் அல்லது வழிகாட்டுங்கள்')}
        </Button>
      </div>
    </div>
  );
}

export default function EditionPage({ tab: tabProp }) {
  const { series = '', edition = '' } = useParams();
  const { pathname } = useLocation();
  const { t, lang } = useLang();
  const x = useEventText();
  const [added, setAdded] = useState(false);
  const [microOpen, setMicroOpen] = useState(false); // phones: the eligibility/fee note folds behind a toggle
  const tab = TAB_IDS.includes(tabProp) ? tabProp : tabFromPath(pathname);

  const { data, loading, error } = useApi(series ? `/api/events?series=${encodeURIComponent(series)}` : null);
  const events = useMemo(() => (Array.isArray(data) ? data : []), [data]);
  const raw = findEdition(events, series, edition);
  // e: the edition with its Tamil fields swapped in on /ta (raw keeps the English record for JSON-LD).
  const e = useMemo(() => localizeEvent(raw, lang), [raw, lang]);
  const cfg = seriesConfig(series, events);
  const siblings = useMemo(
    () => events.filter((s) => s.slug !== e?.slug).sort((a, b) => (a.status === b.status ? byDate(a, b) : a.status === 'past' ? 1 : -1)).slice(0, 3),
    [events, e]
  );

  useEditionCanonical(e ? `/events/${series}/${editionKeyOf(e)}` : null, lang, pathname);

  const past = e ? e.status === 'past' : false;
  const brand = e ? brandOf(e.brand) : null;
  const registerHref = e ? snxLink(`/events/${e.slug}/register`, { src: 'event-edition', brand: brand || undefined, lang }) : null;

  usePageCta(
    !e
      ? null
      : past
        ? { label: t('See upcoming events', 'வரவிருக்கும் நிகழ்வுகளைப் பாருங்கள்'), to: '/events', brand: brand || undefined }
        : { label: x.register(e), href: registerHref, brand: brand || undefined }
  );

  if (loading) {
    return (
      <div className="edition-page" aria-busy="true">
        {/* No <Seo> while loading: the snapshot's (or previous route's) head stays until the data-backed <Seo> renders. */}
        <div className="container edition-page__loading">
          <h1 className="visually-hidden">{t('Loading event…', 'நிகழ்வு ஏற்றப்படுகிறது…')}</h1>
          <Skeleton height="3rem" />
          <Skeleton height="18rem" />
          <Skeleton height="8rem" count={2} />
        </div>
      </div>
    );
  }

  if (error && !/^404/.test(error.message || '')) {
    return (
      <div className="edition-page">
        <Seo title={t('Event', 'நிகழ்வு')} />
        <Section>
          <Breadcrumbs items={[{ label: t('Events', 'நிகழ்வுகள்'), to: '/events' }, { label: t('Event', 'நிகழ்வு') }]} />
          <div className="edition-page__error" role="alert">
            <h1 className="h2">{t("We couldn't load this event.", 'இந்த நிகழ்வை ஏற்ற முடியவில்லை.')}</h1>
            <p className="text-2">{t('Something went wrong on our side, not yours. Please try again in a minute.', 'தவறு எங்கள் பக்கம், உங்களுடையது அல்ல. ஒரு நிமிடத்தில் மீண்டும் முயலுங்கள்.')}</p>
            <div className="cluster">
              <Button onClick={() => window.location.reload()}>{t('Try again', 'மீண்டும் முயலுங்கள்')}</Button>
              <Button variant="secondary" to="/events">{t('See all events', 'அனைத்து நிகழ்வுகளையும் பாருங்கள்')}</Button>
            </div>
          </div>
        </Section>
      </div>
    );
  }

  if (!e) return <NotFound />;

  const base = `/events/${series}/${editionKeyOf(e)}`;
  const confirmed = isConfirmed(e);
  const block = confirmed ? dateBlock(e.date, lang) : null;
  const time = confirmed ? eventTimeRange(e.date, e.endDate) : '';
  const full = e.seats === 'full';
  const waRegister = waLink(t(`Register me for ${e.title}`, `${e.title}-க்கு என்னைப் பதிவு செய்யுங்கள்`), `event:${e.slug}`);
  const waDate = waLink(t(`Send me the date for ${e.title}`, `${e.title} தேதியை எனக்கு அனுப்புங்கள்`), `event-date:${e.slug}`);
  const labels = {
    overview: past ? t('Recap', 'சுருக்கம்') : t('Overview', 'கண்ணோட்டம்'),
    agenda: Array.isArray(e.timeline) && e.timeline.length && !e.agenda?.length ? t('Timeline', 'கால அட்டவணை') : t('Agenda', 'நிகழ்ச்சி நிரல்'),
    speakers: e.jury ? t('Speakers and jury', 'பேச்சாளர்களும் நடுவர்களும்') : t('Speakers', 'பேச்சாளர்கள்'),
  };

  // SEO: "<Edition>: <series phrase> in <city | Tamil Nadu>" (city only when it is a real place name), trimmed to
  // 60 chars; tabs get "<Edition>: <tab>". Descriptions restate the edition's own summary and date label, never a
  // placeholder. SEO-TA: pending native review.
  const kw = SERIES_SEO[series];
  const kwText = kw ? t(kw[0], kw[1]) : null;
  const cityName = realText(raw.city);
  const loc = cityName && /^[A-Z][a-z]+$/.test(cityName) ? cityName : 'Tamil Nadu';
  const seoName = e.title;
  const hasKw = kwText && seoName.toLowerCase().includes(kwText.toLowerCase());
  const seoTitle = tab !== 'overview'
    ? fitTitle(`${seoName}: ${labels[tab]}`, `${editionCrumb(e) === seoName ? cfg.name : `${cfg.name} ${editionCrumb(e)}`}: ${labels[tab]}`)
    : lang === 'ta'
      ? fitTitle(kwText && `${seoName}: தமிழ்நாட்டில் ${kwText}`, kwText && `${seoName}: ${kwText}`, `${seoName}: StartNet நிகழ்வு`, seoName)
      : fitTitle(
        kwText && (hasKw ? `${seoName} in ${loc}` : `${seoName}: ${kwText} in ${loc}`),
        kwText && !hasKw && `${seoName}: ${kwText}`,
        seoName
      );
  const whenSentence = editionWhenSentence(raw, lang, (ev) => eventDateRange(ev.date, ev.endDate, lang));
  const stages = Array.isArray(e.timeline) ? e.timeline.map((r) => realText(r.stage)).filter(Boolean) : [];
  const nextStep = past
    ? [t('See the series and the next edition.', 'தொடரையும் அடுத்த பதிப்பையும் பாருங்கள்.')]
    : [
      t('Register on StartNet X, or on WhatsApp in under a minute.', 'StartNet X-இல் அல்லது WhatsApp-இல் ஒரு நிமிடத்துக்குள் பதிவு செய்யுங்கள்.'),
      t('Register on StartNet X or WhatsApp.', 'StartNet X அல்லது WhatsApp-இல் பதிவு செய்யுங்கள்.'),
    ];
  const seoDescription =
    tab === 'agenda'
      ? fitDescription(
        stages.length
          ? t(`${labels.agenda} for ${seoName}: ${stages.join(', ')}.`, `${seoName} ${labels.agenda}: ${stages.join(', ')}.`)
          : t(`${labels.agenda} for ${seoName}, with every session once it is confirmed.`, `${seoName} ${labels.agenda}: உறுதியானதும் ஒவ்வொரு அமர்வும் இங்கே.`),
        whenSentence,
        e.summary,
        nextStep
      )
      : tab === 'speakers'
        ? fitDescription(
          t(`${labels.speakers} for ${seoName}, named with their consent.`, `${seoName} ${labels.speakers}: அவர்களின் ஒப்புதலுடன் பெயரிடப்படுவர்.`),
          whenSentence,
          e.summary,
          [t('Want to speak or mentor? Tell us your topic.', 'பேச அல்லது வழிகாட்ட விரும்புகிறீர்களா? உங்கள் தலைப்பைச் சொல்லுங்கள்.')]
        )
        : fitDescription(e.summary, whenSentence, nextStep);

  const addToCalendar = () => {
    downloadIcs(e);
    setAdded(true);
  };
  const calendarButton = (fullWidth, size) =>
    past ? null : confirmed ? (
      <Button variant="secondary" size={size} onClick={addToCalendar} icon={added ? Check : CalendarPlus} full={fullWidth}>
        {added ? t('Added to calendar', 'நாட்காட்டியில் சேர்க்கப்பட்டது') : t('Add to calendar', 'நாட்காட்டியில் சேர்க்கவும்')}
      </Button>
    ) : (
      <Button variant="secondary" size={size} href={waDate} icon={BellRing} full={fullWidth}>
        {t('Get the date on WhatsApp', 'தேதியை WhatsApp-இல் பெறுங்கள்')}
      </Button>
    );

  const crumbs = [
    { label: t('Events', 'நிகழ்வுகள்'), to: '/events' },
    { label: cfg.name, to: `/events/${series}` },
    tab === 'overview' ? { label: editionCrumb(e) } : { label: editionCrumb(e), to: base },
    tab !== 'overview' ? { label: labels[tab] } : null,
  ].filter(Boolean);

  const dataLang = lang === 'ta' ? 'en' : undefined;
  // lang marks for the localized date / place / price values: "en" only when the value has no Tamil (an English fallback).
  const whenL = x.whenLang(e);
  const placeL = e.format === 'online' ? undefined : enIf(lang, [e.venue, e.city, e.district].filter(Boolean).join(' ') || '—');
  const priceL = x.priceLang(e) && enIf(lang, e.priceNote);
  const heroFacts = [
    { label: t('Date', 'தேதி'), value: x.when(e), lang: whenL },
    time && { label: t('Time', 'நேரம்'), value: time, lang: dataLang },
    { label: t('Where', 'இடம்'), value: x.place(e) || '—', lang: placeL },
    e.format !== 'online' && e.district && e.district !== e.city && { label: t('District', 'மாவட்டம்'), value: <InlineMarks text={e.district} />, lang: enIf(lang, e.district) },
    { label: t('Format', 'வடிவம்'), value: x.format(e.format) },
    { label: t('Price', 'கட்டணம்'), value: x.price(e), lang: priceL },
  ].filter(Boolean);

  const faq =
    Array.isArray(e.faq) && e.faq.length
      ? e.faq.map((q, i) => ({
        id: `ed-faq-${i}`,
        question: q.question,
        // Plain-string answers feed the FAQPage JSON-LD; answers with [placeholder]/[confirm] marks render with their
        // marks and stay out of the markup (unconfirmed facts are never published as answers).
        answer: typeof q.answer === 'string' && !/\[[^\]]*\]/.test(q.answer) ? q.answer : <InlineMarks text={q.answer} />,
      }))
      : [
          { id: 'ed-faq-cost', question: t('How much does it cost?', 'கட்டணம் எவ்வளவு?'), answer: x.price(e) },
          { id: 'ed-faq-lang', question: t('What language is it in?', 'எந்த மொழியில் நடக்கும்?'), answer: x.language(e.language) },
          { id: 'ed-faq-register', question: t('How do I register?', 'எப்படிப் பதிவு செய்வது?'), answer: t('Register on StartNet X, or on WhatsApp in under a minute.', 'StartNet X-இல் பதிவு செய்யுங்கள், அல்லது ஒரு நிமிடத்துக்குள் WhatsApp-இல் பதிவு செய்யுங்கள்.') },
          { id: 'ed-faq-full', question: t('What if it is full?', 'இடம் நிரம்பிவிட்டால்?'), answer: t("Join the waitlist and we'll message you if a seat opens.", 'காத்திருப்புப் பட்டியலில் சேருங்கள்; இடம் கிடைத்தால் உங்களுக்குச் செய்தி அனுப்புவோம்.') },
          { id: 'ed-faq-time', question: t('What time zone are the times in?', 'நேரங்கள் எந்த நேர மண்டலத்தில்?'), answer: t('All times are in IST (India Standard Time).', 'அனைத்து நேரங்களும் IST (இந்திய நேரம்).') },
        ];

  const outcomes = Array.isArray(e.outcomes) ? e.outcomes : [];

  const overview = (
    <div className="edition-panel__stack">
      {/* "What happened" shows only with verified outcomes or a published recap (never a placeholder). */}
      {(outcomes.length > 0 || (past && e.recapSlug)) && (
        <div className="edition-panel__block">
          <h2 className="h3">{past ? t('What happened', 'என்ன நடந்தது') : t('Targets for this edition', 'இந்தப் பதிப்பின் இலக்குகள்')}</h2>
          {outcomes.length > 0 && (
            <dl className="edition-outcomes">
              {outcomes.slice(0, 4).map((m) => (
                <Stat key={m.id || m.key} metric={m} dl />
              ))}
            </dl>
          )}
          {e.recapSlug && (
            <Button variant="tertiary" to={`/insights/stories/${e.recapSlug}`} icon={ArrowRight}>
              {t('Read the full recap', 'முழுச் சுருக்கத்தைப் படியுங்கள்')}
            </Button>
          )}
        </div>
      )}

      <div className="edition-panel__block prose">
        <h2 className="h3">{past ? t('About this edition', 'இந்தப் பதிப்பு பற்றி') : t("What you'll leave with", 'நீங்கள் பெறுவது')}</h2>
        <p className="body-lg" lang={enIf(lang, e.summary)}>
          <InlineMarks text={e.summary} />
        </p>
      </div>

      {Array.isArray(e.whatItIs) && e.whatItIs.length > 0 && (
        <RevealGroup as="ol" className="edition-pillars" lang={enIf(lang, e.whatItIs)}>
          {e.whatItIs.map((w, i) => (
            <li key={w.title} className="edition-pillars__item">
              <span className="edition-pillars__num tnum" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
              <h3 className="h4">{w.title}</h3>
              <p className="text-2"><InlineMarks text={w.body} /></p>
            </li>
          ))}
        </RevealGroup>
      )}

      {Array.isArray(e.tracks) && e.tracks.length > 0 && (
        <div className="edition-panel__block">
          <h2 className="h3">{t('Tracks', 'பிரிவுகள்')}</h2>
          {e.tracksNote && (
            <p className="caption" lang={enIf(lang, e.tracksNote)}>
              <InlineMarks text={e.tracksNote} />
            </p>
          )}
          <ul className="edition-tracks" lang={enIf(lang, e.tracks)}>
            {e.tracks.map((tr) => (
              <li key={tr.title} className="edition-tracks__item">
                <h3 className="h5">{tr.title}</h3>
                <p className="text-2"><InlineMarks text={tr.brief} /></p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {Array.isArray(e.prizes) && e.prizes.length > 0 && (
        <div className="edition-panel__block">
          <h2 className="h3">{t('Prizes and what comes next', 'பரிசுகளும் அடுத்து நடப்பவையும்')}</h2>
          <ul className="edition-prizes" lang={enIf(lang, e.prizes)}>
            {e.prizes.map((p) => (
              <li key={p}>
                <Check size={18} aria-hidden="true" />
                <span><InlineMarks text={p} /></span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="edition-panel__block">
        <h2 className="h3">{t('Sponsors', 'ஸ்பான்சர்கள்')}</h2>
        <Button variant="tertiary" to={`/events/${series}#sponsor`} icon={ArrowRight}>
          {t(`Sponsor ${cfg.name}`, `${cfg.name}-க்கு ஸ்பான்சர் செய்யுங்கள்`)}
        </Button>
      </div>

      <div className="edition-panel__block">
        <h2 className="h3">{t('Venue and travel', 'இடமும் பயணமும்')}</h2>
        <dl className="edition-venue">
          <div>
            <dt>{t('Format', 'வடிவம்')}</dt>
            <dd>{x.format(e.format)}</dd>
          </div>
          {e.format !== 'online' ? (
            <>
              {/* Venue and directions show once confirmed (no placeholder rows). */}
              {e.venue && !isOnlyPlaceholder(e.venue) && (
                <div>
                  <dt>{t('Venue', 'அரங்கம்')}</dt>
                  <dd lang={enIf(lang, e.venue)}><InlineMarks text={e.venue} /></dd>
                </div>
              )}
              <div>
                <dt>{t('City', 'நகரம்')}</dt>
                <dd lang={enIf(lang, e.city || '—')}><InlineMarks text={e.city || '—'} /></dd>
              </div>
            </>
          ) : null /* Joining details: shown once StartNet supplies them. */}
          {e.coHost && (
            <div>
              <dt>{t('Co-host', 'இணை நடத்துநர்')}</dt>
              <dd lang={enIf(lang, e.coHost)}><InlineMarks text={e.coHost} /></dd>
            </div>
          )}
        </dl>
      </div>

      <div className="edition-panel__block">
        <h2 className="h3">{t('Questions', 'கேள்விகள்')}</h2>
        <div lang={Array.isArray(e.faq) && e.faq.length ? enIf(lang, e.faq) : undefined}>
          <Accordion items={faq} faq />
        </div>
      </div>
    </div>
  );

  const panel = tab === 'agenda' ? <Agenda e={e} x={x} calendarButton={calendarButton(false)} /> : tab === 'speakers' ? <Speakers e={e} x={x} /> : overview;

  return (
    <div className="edition-page" data-brand={brand || undefined}>
      {/* Event JSON-LD comes from eventLd(): null until the date is confirmed and a real venue/city exists. The
          /agenda and /speakers tabs canonicalise to the edition (useEditionCanonical), so they carry no Event node. */}
      <Seo title={seoTitle} description={seoDescription} jsonLd={tab === 'overview' ? eventLd(raw, { path: base, lang }) : null} />

      {/* The hero is the ink band (data-surface="night"); the tabbed body slides over it as a sheet (EditionPage.css). */}
      <section className="edition-hero" data-surface="night">
        <div className="container">
          <Breadcrumbs items={crumbs} />
          <div className="edition-hero__grid">
            <div className="edition-hero__copy">
              <div className="edition-hero__chips">
                {brand && BRANDS[brand] && <Badge kind="brand" brand={brand} />}
                <Badge kind="type">{cfg.name}</Badge>
                {past ? (
                  <Badge kind="status" status="closed">{t('Past edition', 'முந்தைய பதிப்பு')}</Badge>
                ) : (
                  e.seats && (
                    <Badge kind="status" status={full ? 'closed' : e.seats === 'few' ? 'closing' : 'open'}>
                      {x.seats(e.seats)}
                    </Badge>
                  )
                )}
              </div>
              <KineticHeadline text={e.title} as="h1" className="display-xl edition-hero__title" lang={enIf(lang, e.title)} />
              {e.endorsement && <p className="edition-hero__endorse">{t(e.endorsement, cfg.endorsement?.[1] || e.endorsement)}</p>}
              <p className="body-lg edition-hero__lede hero-rise" lang={enIf(lang, e.summary)}>
                <InlineMarks text={e.summary} />
              </p>
              <div className="cluster edition-hero__actions hero-rise" data-primary-cta="">
                {past ? (
                  <>
                    <Button to={`/events/${series}`} icon={ArrowRight}>
                      {t(`All ${cfg.name} editions`, `அனைத்து ${cfg.name} பதிப்புகளும்`)}
                    </Button>
                    <Button variant="secondary" to="/events">
                      {t('See upcoming events', 'வரவிருக்கும் நிகழ்வுகளைப் பாருங்கள்')}
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant={brand ? 'brand' : 'primary'} size="lg" href={registerHref}>
                      {x.register(e)}
                    </Button>
                    {/* Same size as the register button beside it. */}
                    {calendarButton(false, 'lg')}
                  </>
                )}
              </div>
              {!past && e.microcopy && (
                <>
                  <button
                    type="button"
                    className="edition-hero__micro-toggle"
                    aria-expanded={microOpen}
                    aria-controls="edition-hero-micro"
                    onClick={() => setMicroOpen((o) => !o)}
                  >
                    {t('Who can enter and fees', 'யார் பங்கேற்கலாம், கட்டணம்')}
                  </button>
                  <p
                    id="edition-hero-micro"
                    className={`caption edition-hero__micro${microOpen ? ' is-open' : ''}`}
                    lang={enIf(lang, e.microcopy)}
                  >
                    <InlineMarks text={e.microcopy} />
                  </p>
                </>
              )}
              {!past && (
                <p className="caption">
                  {t('Or register on WhatsApp in under a minute.', 'அல்லது ஒரு நிமிடத்துக்குள் WhatsApp-இல் பதிவு செய்யுங்கள்.')}{' '}
                  <a href={waRegister} className="edition-hero__wa">
                    {t('Chat on WhatsApp', 'WhatsApp-இல் பேசுங்கள்')}
                  </a>
                </p>
              )}
            </div>

            <Reveal className="edition-hero__poster" delay={0.1}>
              <ArtImage
                variant={ART_FOR[brand] || 'dot'}
                brand={brand || undefined}
                ratio="4/5"
                seed={seedOf(e.slug)}
                alt=""
                animate
                photo={posterPhoto(e.series, eventPath(e).split('/').pop()) ?? photoFor(eventPhotoKeys(e, eventPath(e))) ?? null}
                sizes={PHOTO_SIZES.hero}
              />
              <div className="edition-hero__dateblock" aria-hidden="true">
                {block ? (
                  <>
                    <span className="edition-hero__dateblock-month">{block.month}</span>
                    <span className="edition-hero__dateblock-day tnum">{block.day}</span>
                    <span className="edition-hero__dateblock-wd">{block.weekday}</span>
                  </>
                ) : (
                  <>
                    <span className="edition-hero__dateblock-month">{past ? t('Recap', 'சுருக்கம்') : t('Dates', 'தேதி')}</span>
                    <span className="edition-hero__dateblock-day tnum">{(e.date || '').slice(0, 4) || t('TBC', 'விரைவில்')}</span>
                    {!past && <span className="edition-hero__dateblock-wd">{t('TBC', 'விரைவில்')}</span>}
                  </>
                )}
              </div>
            </Reveal>
          </div>

          <dl className="edition-hero__facts" data-count={heroFacts.length}>
            {heroFacts.map((f) => (
              <div key={f.label} className="edition-hero__fact">
                <dt>{f.label}</dt>
                <dd lang={f.lang}>{f.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <Section surface="paper" className="edition-body">
        <div className="edition-body__layout">
          <div className="edition-body__main">
            <EditionTabs base={base} active={tab} labels={labels} />
            <div className="edition-panel" aria-label={labels[tab]} role="region">
              {panel}
            </div>
          </div>
          <div className="edition-body__aside">
            <div className="edition-body__sticky">
              <KeyFacts
                sticky={false}
                title={past ? t('This edition has ended', 'இந்தப் பதிப்பு முடிந்தது') : t('Key facts', 'முக்கிய விவரங்கள்')}
                items={[
                  { label: t('Date', 'தேதி'), value: <span lang={whenL}>{x.when(e)}</span> },
                  ...(time ? [{ label: t('Time', 'நேரம்'), value: <span lang={dataLang}>{time}</span> }] : []),
                  { label: t('Where', 'இடம்'), value: <span lang={placeL}>{x.place(e) || '—'}</span> },
                  { label: t('Language', 'மொழி'), value: x.language(e.language) },
                  { label: t('Price', 'கட்டணம்'), value: <span lang={priceL}>{x.price(e)}</span> },
                  ...(!past && e.seats ? [{ label: t('Seats', 'இருக்கைகள்'), value: x.seats(e.seats) }] : []),
                  ...(!past && e.registrationClosesLabel ? [{ label: t('Registration closes', 'பதிவு முடிவு'), value: <span lang={enIf(lang, e.registrationClosesLabel)}><InlineMarks text={e.registrationClosesLabel} /></span> }] : []),
                ]}
                action={
                  past ? (
                    <Button to="/events" full>
                      {t('See upcoming events', 'வரவிருக்கும் நிகழ்வுகளைப் பாருங்கள்')}
                    </Button>
                  ) : (
                    <div className="edition-body__aside-actions">
                      <Button variant={brand ? 'brand' : 'primary'} href={registerHref} full>
                        {x.register(e)}
                      </Button>
                      {calendarButton(true)}
                      <Button variant="whatsapp" href={waRegister} full icon={MessageCircle}>
                        {t('Chat on WhatsApp', 'WhatsApp-இல் பேசுங்கள்')}
                      </Button>
                    </div>
                  )
                }
              />
              {cfg.evergreen && (
                <Button variant="tertiary" to={cfg.evergreen} icon={ArrowRight}>
                  {t(`About ${cfg.name}`, `${cfg.name} பற்றி`)}
                </Button>
              )}
              <p className="visually-hidden" role="status" aria-live="polite">
                {added ? t('Calendar file downloaded.', 'நாட்காட்டிக் கோப்பு பதிவிறக்கப்பட்டது.') : ''}
              </p>
            </div>
          </div>
        </div>
      </Section>

      {tab === 'overview' && eventGallery(e.series).length > 1 && (
        <Section surface="white" className="edition-gallery">
          <EventGallery
            series={e.series}
            edition={base.split('/').pop()}
            exclude={[(posterPhoto(e.series, eventPath(e).split('/').pop()) ?? photoFor(eventPhotoKeys(e, eventPath(e))))?.key]}
          />
        </Section>
      )}

      {/* Films of this edition (data/videos.js, docs/VIDEOS.md) */}
      {tab === 'overview' && videosFor(e.series, base.split('/').pop()).length > 0 && (
        <Section surface="white" className="edition-films">
          <EventVideos series={e.series} edition={base.split('/').pop()} max={3} />
        </Section>
      )}

      {siblings.length > 0 && (
        <Section surface="white" className="edition-siblings" labelledBy="edition-siblings-title">
          <SectionHeader
            eyebrow={cfg.name}
            title={<span id="edition-siblings-title">{t('Other editions in this series', 'இந்தத் தொடரின் பிற பதிப்புகள்')}</span>}
            action={
              <Button variant="tertiary" to={`/events/${series}`} icon={ArrowRight}>
                {t('All editions', 'அனைத்துப் பதிப்புகளும்')}
              </Button>
            }
          />
          <RevealGroup as="ul" className="edition-siblings__grid">
            {siblings.map((s) => (
              <li key={s.slug}>
                <EditionCard event={s} />
              </li>
            ))}
          </RevealGroup>
        </Section>
      )}

      <CTABand
        surface="night"
        title={past ? t('Find a room full of builders near you.', 'உங்களுக்கு அருகில் உருவாக்குநர்கள் நிறைந்த ஓர் அரங்கைக் கண்டறியுங்கள்.') : t('Register on WhatsApp in under a minute.', 'ஒரு நிமிடத்துக்குள் WhatsApp-இல் பதிவு செய்யுங்கள்.')}
        body={
          past ? (
            t('Summits, sector Connects, campus build nights and district editions across Tamil Nadu. Most first events are free.', 'தமிழ்நாடு முழுவதும் மாநாடுகள், துறை Connect-கள், கல்லூரி build nights, மாவட்டப் பதிப்புகள். பெரும்பாலான முதல் நிகழ்வுகள் இலவசம்.')
          ) : (
            <span>
              <span lang={enIf(lang, e.title)}>{e.title}</span> · <span lang={whenL}>{x.when(e)}</span>
            </span>
          )
        }
        actions={
          past ? (
            <Button to="/events" icon={ArrowRight}>
              {t('See upcoming events', 'வரவிருக்கும் நிகழ்வுகளைப் பாருங்கள்')}
            </Button>
          ) : (
            <>
              <Button href={registerHref}>{x.register(e)}</Button>
              <Button variant="whatsapp" href={waRegister}>
                {t('Chat on WhatsApp', 'WhatsApp-இல் பேசுங்கள்')}
              </Button>
            </>
          )
        }
      />
    </div>
  );
}
