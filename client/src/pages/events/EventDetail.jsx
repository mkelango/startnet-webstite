// /events/:slug — Event edition (Book 1 Part B T05; Book 3 Part B §4 T04/T05: event hero, URL-synced tabs, Register + ICS).
// Post-event the same URL becomes the recap with outcomes (Book 4 IX-22 "one URL throughout").
// Tamil: template copy via t() (Book 2 §14 drafts; native review pending). Event titles, ledes and date
// labels come from the API and use titleTa / summaryTa / dateLabelTa / cityTa when supplied.
import { useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowRight, CalendarPlus, Check, MapPin, Clock, Languages, Ticket, Users, Monitor, BellRing, Building2 } from 'lucide-react';
import {
  Seo, Section, SectionHeader, KineticHeadline, Breadcrumbs, KeyFacts, Badge, Button, Accordion, EventCard, FactBand,
  CTABand, Skeleton, ArtImage, PersonCard, Reveal, RevealGroup,
} from '../../components';
import { useLang, contentLangFor } from '../../lib/i18n.jsx';
import { snxLink, waLink } from '../../lib/links.js';
import { useApi } from '../../hooks/useApi.js';
import { useMediaQuery, useShell } from '../../layout/shell.jsx';
import { BRANDS } from '../../data/brands.js';
import NotFound from '../utility/NotFound.jsx';
import RichText, { hasMarks } from '../programmes/parts/RichText.jsx';
import { labelize, isPlaceholderValue } from '../programmes/parts/facets.js';
import UrlTabs from './parts/UrlTabs.jsx';
import { isPlaceholderText, realMetrics } from '../../components/_placeholders.js';
import { downloadIcs } from './parts/ics.js';
import { eventTimeRange, eventDateRange, dateBlock, daysUntil } from './parts/eventTime.js';
import {
  byDate, seriesLabel, isConfirmed, dateTextFor, dateText, formatLabel, langLabel, seatsLabel, pickLang,
} from './parts/eventMeta.js';
import './parts/eventList.css';
import './EventDetail.css';
import { eventPath } from '../../components/_utils.js';
import { eventLd } from '../../lib/seo.js';
import { fitTitle, fitDescription } from '../programmes/parts/seoFit.js';
import { editionWhenSentence } from '../mega/events-series/seriesData.js';
import { eventPhotoKeys, photoFor, PHOTO_SIZES } from '../../data/photos.js';
import {
  RecordRecap, RecordHighlights, RecordPeople, RecordLists, RecordPartners, RecordSources, hasRecap, hasHighlights,
  hasPeople, hasJuryGroup, peopleNames, recordFigures,
} from './parts/EventRecord.jsx';

const ART = { research: 'grid', vibe: 'network', connect: 'network', women: 'kolam', x: 'dot' };
const seedOf = (s = '') => [...s].reduce((n, c) => (n * 31 + c.charCodeAt(0)) % 997, 7);

const priceString = (e, t, lang) =>
  e.price === 'free' && !e.priceTBC
    ? t('Free', 'இலவசம்')
    : pickLang(e, 'priceNote', lang) || (e.price === 'free' ? t('Free', 'இலவசம்') : t('Paid', 'கட்டணம் உண்டு'));
const shortPrice = (e, t, lang) => {
  const note = pickLang(e, 'priceNote', lang);
  return e.price === 'free' ? t('Free', 'இலவசம்') : e.priceTBC ? '' : note && !/\[/.test(note) ? note : '';
};

/** Known CMS CTA labels (Book 2 §14.3 where it has them). */
const CTA_TA = {
  'register your team': 'உங்கள் குழுவைப் பதிவு செய்யுங்கள்',
  'register for the next event': 'அடுத்த நிகழ்வுக்குப் பதிவு செய்யுங்கள்',
  register: 'பதிவு செய்யுங்கள்',
};

/** Hero register label, e.g. "Register · Free" / "Join the waitlist" / "Register interest". */
function registerLabelFor(e, t, lang) {
  const priceShort = shortPrice(e, t, lang);
  if (e.seats === 'full') return t('Join the waitlist', 'காத்திருப்புப் பட்டியலில் சேருங்கள்');
  if (/register interest/i.test(e.ctaLabel || '')) return t('Register interest', 'ஆர்வத்தைப் பதிவு செய்யுங்கள்');
  if (/^register/i.test(e.ctaLabel || '')) {
    return lang === 'ta' ? e.ctaLabelTa || CTA_TA[e.ctaLabel.trim().toLowerCase()] || e.ctaLabel : e.ctaLabel;
  }
  return `${t('Register', 'பதிவு செய்யுங்கள்')}${priceShort ? ` · ${priceShort}` : ''}`;
}

const isPastEvent = (e) => e.status === 'past' || (isConfirmed(e) && daysUntil(e.endDate || e.date) < -1);

/** "Venue, City" — placeholders stay visible as placeholders (rendered via RichText). */
/** District label: Tamil field when present, else the slug made readable. */
function districtText(e, lang) {
  return (lang === 'ta' && e.districtTa) || labelize(e.district);
}

function placeString(e, t, lang) {
  if (e.format === 'online') return t('Online', 'ஆன்லைன்');
  const parts = [pickLang(e, 'venue', lang), pickLang(e, 'city', lang)].filter(Boolean);
  const uniq = parts.filter((p, i) => parts.indexOf(p) === i);
  if (uniq.length > 1 && uniq.every(isPlaceholderValue)) return uniq[0];
  return uniq.join(', ') || districtText(e, lang) || '';
}

// ---- Phone hero facts (< 480px, F-72): placeholder notes shrink to a "TBC" chip; the full notes move to Overview.
const TBC_TA = /உறுதிசெய்யப்பட|உறுதிப்படுத்தப்பட|உறுதியாகவில்லை/;
const isTbcText = (s) => isPlaceholderValue(s) || TBC_TA.test(s || '');
const isPureValue = (s) => typeof s === 'string' && !!s.trim() && !/\[/.test(s) && !isTbcText(s);

/**
 * "May–June 2027 · date to be confirmed" -> { text: 'May–June 2027', tbc: true };
 * "Free to ₹499 per team [placeholder — final fee]. Fee waivers …" -> { text: 'Free to ₹499 per team', tbc: true };
 * "[placeholder — to be supplied by StartNet]" or "Qualifiers in [number] districts" -> { text: '', tbc: true }.
 * A bracket in the middle of a phrase drops the whole phrase, so no half-sentence is shown.
 */
function compactValue(s) {
  if (typeof s !== 'string' || !s.trim()) return { text: '', tbc: true };
  let tbc = false;
  const segs = s
    .split(/\s+·\s+/)
    .map((seg) => {
      const open = seg.indexOf('[');
      if (open === -1) {
        if (!isTbcText(seg)) return seg.trim();
        tbc = true;
        return '';
      }
      tbc = true;
      const close = seg.indexOf(']', open);
      const before = seg.slice(0, open).trim().replace(/[\s:,;—–-]+$/, '');
      const after = close === -1 ? '' : seg.slice(close + 1).trim();
      return before && (!after || /^[.;,]/.test(after)) && !isTbcText(before) ? before : '';
    })
    .filter(Boolean);
  return { text: segs.join(' · '), tbc };
}

/** Phone "Where": the confirmed parts only (e.g. the city when the venue is still a placeholder). */
function compactPlace(e, t, lang) {
  if (e.format === 'online') return { text: t('Online', 'ஆன்லைன்'), tbc: false };
  const parts = [pickLang(e, 'venue', lang), pickLang(e, 'city', lang)].filter(Boolean);
  const pure = parts.filter(isPureValue).filter((p, i, a) => a.indexOf(p) === i);
  if (pure.length) return { text: pure.join(', '), tbc: false };
  return compactValue(parts[0] || '');
}

/** WhatsApp click-to-chat as an inline text link: new tab, and announced as such. */
function WaLink({ href, children }) {
  const { t } = useLang();
  return (
    <a href={href} className="event-detail__wa-link" target="_blank" rel="noopener noreferrer">
      {children}
      <span className="visually-hidden">{t(' (opens WhatsApp)', ' (WhatsApp-இல் திறக்கும்)')}</span>
    </a>
  );
}

/** API copy: carries lang="en" on /ta pages when no Tamil version was supplied (WCAG 3.1.2). */
function useContentLang() {
  const { lang } = useLang();
  return (text) => contentLangFor(lang, text);
}

/** Speakers named (with consent) in the agenda; placeholder names are never listed. */
const speakerNames = (e) => {
  const listed = peopleNames(e);
  return [...new Set((e.agenda || []).map((a) => a.speaker).filter((s) => s && !isPlaceholderValue(s) && !listed.has(s)))];
};
const hasRealJury = (e, lang) => !!e.jury && !isPlaceholderText(pickLang(e, 'jury', lang));

// Approved rule: blocks that would only show a placeholder (agenda, speakers, outcomes, venue notes) are hidden
// until StartNet supplies the content; they reappear automatically with the data.
function Agenda({ e }) {
  const { t, lang } = useLang();
  if (e.agenda?.length) {
    return (
      <div className="event-detail__agenda">
        <h2 className="h3">{t('Agenda', 'நிகழ்ச்சி நிரல்')}</h2>
        <table className="event-agenda">
          <caption className="caption">{t('All times IST', 'அனைத்து நேரங்களும் IST')}</caption>
          <thead>
            <tr>
              <th scope="col">{t('Time', 'நேரம்')}</th>
              <th scope="col">{t('Session', 'அமர்வு')}</th>
              <th scope="col">{t('Speaker', 'பேச்சாளர்')}</th>
            </tr>
          </thead>
          <tbody>
            {e.agenda.map((a, i) => (
              <tr key={`${a.time}-${i}`}>
                <td className="event-agenda__time tnum">{a.time}</td>
                <th scope="row" className="event-agenda__title"><RichText text={a.title} /></th>
                <td className="event-agenda__speaker">{a.speaker ? <RichText text={a.speaker} /> : '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
  if (Array.isArray(e.timeline) && e.timeline.length) {
    return (
      <div className="event-detail__agenda">
        <h2 className="h3">{t('Timeline', 'காலவரிசை')}</h2>
        <table className="event-agenda">
          <caption className="visually-hidden">{t('Timeline', 'காலவரிசை')}</caption>
          <thead>
            <tr>
              <th scope="col">{t('Stage', 'கட்டம்')}</th>
              <th scope="col">{t('When', 'எப்போது')}</th>
              <th scope="col">{t('What happens', 'என்ன நடக்கும்')}</th>
            </tr>
          </thead>
          <tbody>
            {e.timeline.map((r, i) => (
              <tr key={`${r.stage}-${i}`}>
                <th scope="row" className="event-agenda__title">{pickLang(r, 'stage', lang)}</th>
                <td className="event-agenda__time">{isPlaceholderText(pickLang(r, 'when', lang)) ? '—' : <RichText text={pickLang(r, 'when', lang)} />}</td>
                <td className="event-agenda__speaker"><RichText text={pickLang(r, 'what', lang)} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
  // Past events: the programme as the sources describe it (EventRecord, Oct 2026 archive).
  if (hasHighlights(e)) {
    return (
      <div className="event-detail__agenda">
        <h2 className="h3">{t('Programme highlights', 'நிகழ்ச்சிச் சிறப்பம்சங்கள்')}</h2>
        <RecordHighlights e={e} headingLevel={3} />
      </div>
    );
  }
  return null;
}

function Speakers({ e }) {
  const { t, lang } = useLang();
  const names = speakerNames(e);
  const people = hasPeople(e);
  return (
    <div className="event-detail__speakers">
      {(names.length > 0 || people) && <h2 className="h3">{t('Speakers', 'பேச்சாளர்கள்')}</h2>}
      {/* People named by the sources, each with the role the source states (EventRecord). */}
      {people && <RecordPeople e={e} headingLevel={3} />}
      {names.length > 0 && (
        <>
          <RevealGroup as="ul" className="event-detail__speaker-grid">
            {names.map((name) => (
              <li key={name}>
                <PersonCard person={{ name, role: t('Speaker', 'பேச்சாளர்'), brand: e.brand }} />
              </li>
            ))}
          </RevealGroup>
        </>
      )}
      {hasRealJury(e, lang) && (
        <div className="event-detail__jury">
          {/* With no named speakers the jury heading moves up a level (no skipped heading). */}
          {names.length || people ? <h3 className="h4">{t('Jury', 'நடுவர் குழு')}</h3> : <h2 className="h3">{t('Jury', 'நடுவர் குழு')}</h2>}
          <p className="text-2">
            <RichText text={pickLang(e, 'jury', lang)} />
          </p>
        </div>
      )}
    </div>
  );
}

function Venue({ e }) {
  const { t, lang } = useLang();
  const online = e.format === 'online';
  return (
    <div className="event-detail__venue">
      <h2 className="h3">{t('Venue and travel', 'இடமும் பயணமும்')}</h2>
      <dl className="event-detail__venue-list">
        <div>
          <dt>{t('Format', 'வடிவம்')}</dt>
          <dd>{formatLabel(t, e.format)}</dd>
        </div>
        {!online && (
          <>
            {e.venue && !isPlaceholderText(pickLang(e, 'venue', lang)) && (
              <div>
                <dt>{t('Venue', 'இடம்')}</dt>
                <dd>
                  <RichText text={pickLang(e, 'venue', lang)} />
                </dd>
              </div>
            )}
            <div>
              <dt>{t('City', 'நகரம்')}</dt>
              <dd><RichText text={pickLang(e, 'city', lang) || '—'} /></dd>
            </div>
            {e.district && e.district !== e.city && (
              <div>
                <dt>{t('District', 'மாவட்டம்')}</dt>
                <dd><RichText text={districtText(e, lang)} /></dd>
              </div>
            )}
            {/* "Getting there" and online "Joining details" appear once StartNet supplies them. */}
          </>
        )}
        {e.coHost && (
          <div>
            <dt>{t('Co-host', 'இணை ஏற்பாட்டாளர்')}</dt>
            <dd><RichText text={pickLang(e, 'coHost', lang)} /></dd>
          </div>
        )}
      </dl>
    </div>
  );
}

/**
 * Hero lede, actions and registration microcopy. On phones the lede clamps to three lines and the microcopy to
 * two (CSS); one Read more toggle under the lede opens both, and renders only when either actually overflows.
 */
function HeroCopy({ text, micro, children }) {
  const { t } = useLang();
  const langOf = useContentLang();
  const uid = useId().replace(/:/g, '');
  const ledeId = `ev-lede-${uid}`;
  const microId = `ev-micro-${uid}`;
  const ledeRef = useRef(null);
  const microRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [clamped, setClamped] = useState(false);
  useLayoutEffect(() => {
    const els = [ledeRef.current, microRef.current].filter(Boolean);
    if (!els.length || typeof ResizeObserver === 'undefined') return undefined;
    const check = () => setClamped(els.some((el) => el.scrollHeight - el.clientHeight > 2));
    check();
    const ro = new ResizeObserver(check);
    els.forEach((el) => ro.observe(el));
    return () => ro.disconnect();
  }, [text, micro]);
  return (
    <>
      <div className="event-hero__lede-wrap hero-rise">
        <p id={ledeId} ref={ledeRef} className={`body-lg event-hero__lede${open ? ' is-open' : ''}`} lang={langOf(text)}>
          <RichText text={text} />
        </p>
        {(clamped || open) && (
          <button
            type="button"
            className="event-hero__more"
            aria-expanded={open}
            aria-controls={micro ? `${ledeId} ${microId}` : ledeId}
            onClick={() => setOpen((o) => !o)}
          >
            {open ? t('Show less', 'சுருக்கு') : t('Read more', 'மேலும் படிக்க')}
          </button>
        )}
      </div>
      {children}
      {micro && (
        <p id={microId} ref={microRef} className={`caption event-hero__micro${open ? ' is-open' : ''}`} lang={langOf(micro)}>
          <RichText text={micro} />
        </p>
      )}
    </>
  );
}

/** True while the element is on screen (used to keep facts listed once: hero strip or sticky aside). */
function useOnScreen(ref, ready) {
  const [on, setOn] = useState(true);
  useEffect(() => {
    const el = ref.current;
    if (!ready || !el || typeof IntersectionObserver === 'undefined') return undefined;
    const io = new IntersectionObserver(([en]) => setOn(en.isIntersecting), { threshold: 0 });
    io.observe(el);
    return () => io.disconnect();
  }, [ref, ready]);
  return on;
}

export default function EventDetail() {
  const { slug } = useParams();
  const { t, lang, localePath } = useLang();
  const langOf = useContentLang();
  const { data: e, loading, error } = useApi(`/api/events/${encodeURIComponent(slug)}`);
  const factsRef = useRef(null);
  const heroFactsOnScreen = useOnScreen(factsRef, !!e && !loading);
  const { data: more } = useApi(e ? `/api/events?when=upcoming${e.brand ? `&brand=${encodeURIComponent(e.brand)}` : ''}` : null);
  const [added, setAdded] = useState(false);
  const shell = useShell();
  const setPageCta = shell?.setPageCta;
  const singleCol = useMediaQuery('(max-width: 1023px)');
  const compact = useMediaQuery('(max-width: 479px)');

  // Context CTA for the mobile bottom bar (Book 1 Part B §3.4): Event -> "Register · ₹/Free"; same label/target as the hero.
  const pageCta = useMemo(() => {
    if (!e) return null;
    if (isPastEvent(e)) return { label: t('See upcoming events', 'வரவிருக்கும் நிகழ்வுகளைப் பாருங்கள்'), to: '/events', brand: e.brand || undefined };
    const label = registerLabelFor(e, t, lang);
    const short = t('Register', 'பதிவு செய்யுங்கள்');
    // A long data label ("Register for the next event") gets a short form, so the bottom bar never truncates it.
    const longRegister = e.seats !== 'full' && /^register\b/i.test(e.ctaLabel || '') && !/register interest/i.test(e.ctaLabel || '');
    return {
      label,
      ...(longRegister && label !== short ? { shortLabel: short } : {}),
      href: snxLink(`/events/${e.slug}/register`, { src: 'event', brand: e.brand, lang }),
      brand: e.brand || undefined,
    };
  }, [e, t, lang]);
  const pageCtaKey = pageCta ? JSON.stringify(pageCta) : '';
  useEffect(() => {
    if (!pageCta || typeof setPageCta !== 'function') return undefined;
    setPageCta(pageCta);
    return () => setPageCta(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageCtaKey, setPageCta]);

  const upcomingOthers = useMemo(
    () => (Array.isArray(more) ? more.filter((x) => x.slug !== slug && x.status !== 'past').sort(byDate) : []),
    [more, slug]
  );
  const related = upcomingOthers.slice(0, 3);

  if (error && /^404/.test(error.message || '')) return <NotFound />;

  if (loading || (!e && !error)) {
    return (
      <div className="event-detail" aria-busy="true">
        {/* No <Seo> while loading: the snapshot's (or previous route's) head stays until the data-backed <Seo> renders. */}
        <div className="container event-detail__loading">
          <Skeleton height="3rem" />
          <Skeleton height="20rem" radius="var(--radius-lg)" />
          <Skeleton height="8rem" count={2} />
        </div>
      </div>
    );
  }

  if (error || !e) {
    return (
      <div className="event-detail">
        <Seo title="Event" titleTa="நிகழ்வு" />
        <Section>
          <div className="event-detail__error" role="alert">
            <h1 className="h2">{t("We couldn't load this event.", 'இந்த நிகழ்வை ஏற்ற முடியவில்லை.')}</h1>
            <p className="text-2">
              {t(
                'Something went wrong on our side, not yours. Please try again in a minute.',
                'பிழை எங்கள் பக்கம், உங்களுடையது அல்ல. ஒரு நிமிடம் கழித்து மீண்டும் முயலுங்கள்.'
              )}
            </p>
            <div className="cluster">
              <Button onClick={() => window.location.reload()}>{t('Try again', 'மீண்டும் முயலுங்கள்')}</Button>
              <Button variant="secondary" to="/events">{t('See all events', 'அனைத்து நிகழ்வுகளையும் பாருங்கள்')}</Button>
            </div>
          </div>
        </Section>
      </div>
    );
  }

  const past = isPastEvent(e);
  const confirmed = isConfirmed(e);
  const brand = BRANDS[e.brand];
  const full = e.seats === 'full';
  const interestOnly = /register interest/i.test(e.ctaLabel || '');
  const title = pickLang(e, 'title', lang);
  const summary = pickLang(e, 'summary', lang);
  const registerHref = snxLink(`/events/${e.slug}/register`, { src: 'event', brand: e.brand, lang });
  const waRegister = waLink(`Register me for ${e.title}`, `event:${e.slug}`);
  const waDate = waLink(`Send me the date for ${e.title}`, `event-date:${e.slug}`);
  const registerLabel = registerLabelFor(e, t, lang);
  const block = dateBlock(e.date, lang);
  const time = confirmed ? eventTimeRange(e.date, e.endDate) : '';
  const when = dateTextFor(e, t, lang);
  const place = placeString(e, t, lang);
  const price = priceString(e, t, lang);
  const seriesUrl = e.brandUrl && e.brandUrl !== `/events/${e.slug}` ? e.brandUrl : null;
  const seriesName = e.series ? seriesLabel(e.series) : '';
  const city = pickLang(e, 'city', lang);
  // The next edition of this series (for a past event's FAQ), from the upcoming feed already loaded.
  const nextEdition = past && e.series ? upcomingOthers.find((x) => x.series === e.series) : null;

  const addToCalendar = () => {
    downloadIcs(e);
    setAdded(true);
  };

  const calendarButton = (fullWidth) =>
    confirmed ? (
      <Button variant="secondary" onClick={addToCalendar} icon={added ? Check : CalendarPlus} full={fullWidth}>
        {added ? t('Added to calendar', 'நாள்காட்டியில் சேர்க்கப்பட்டது') : t('Add to calendar', 'நாள்காட்டியில் சேர்க்கவும்')}
      </Button>
    ) : (
      <Button variant="secondary" href={waDate} icon={BellRing} full={fullWidth}>
        {t('Get the date on WhatsApp', 'தேதியை WhatsApp-இல் பெறுங்கள்')}
      </Button>
    );

  const actions = past ? (
    <>
      <Button to="/events" icon={ArrowRight} data-primary-cta="">
        {t('See upcoming events', 'வரவிருக்கும் நிகழ்வுகளைப் பாருங்கள்')}
      </Button>
      <Button variant="secondary" to="/events/past">
        {t('Browse past events', 'கடந்த நிகழ்வுகளைப் பாருங்கள்')}
      </Button>
    </>
  ) : (
    <>
      <Button variant={brand ? 'brand' : 'primary'} href={registerHref} data-primary-cta="">
        {registerLabel}
      </Button>
      {calendarButton(false)}
    </>
  );

  // `text` is the plain value, used to let long values take a full row on phones.
  const heroFacts = [
    { key: 'date', icon: CalendarPlus, label: t('Date', 'தேதி'), text: when, value: <RichText text={when} /> },
    confirmed && time && { key: 'time', icon: Clock, label: t('Time', 'நேரம்'), text: time, value: time },
    { key: 'where', icon: MapPin, label: t('Where', 'எங்கே'), text: place, value: <RichText text={place} /> },
    e.format !== 'online' && e.district && e.district !== e.city && {
      key: 'district', icon: MapPin, label: t('District', 'மாவட்டம்'), text: districtText(e, lang), value: <RichText text={districtText(e, lang)} />,
    },
    { key: 'format', icon: Monitor, label: t('Format', 'வடிவம்'), text: formatLabel(t, e.format), value: formatLabel(t, e.format) },
    { key: 'language', icon: Languages, label: t('Language', 'மொழி'), text: langLabel(t, e.language), value: <RichText text={langLabel(t, e.language)} /> },
    { key: 'price', icon: Ticket, label: t('Price', 'கட்டணம்'), text: price, value: <RichText text={price} /> },
    !past && e.seats && { key: 'seats', icon: Users, label: t('Seats', 'இடங்கள்'), text: seatsLabel(t, e.seats), value: seatsLabel(t, e.seats) },
    !past && e.registrationClosesLabel && {
      key: 'closes', icon: Clock, label: t('Registration closes', 'பதிவு முடியும் நாள்'), text: pickLang(e, 'registrationClosesLabel', lang), value: <RichText text={pickLang(e, 'registrationClosesLabel', lang)} />,
    },
    e.coHost && { key: 'cohost', icon: Building2, label: t('Co-host', 'இணை ஏற்பாட்டாளர்'), text: pickLang(e, 'coHost', lang), value: <RichText text={pickLang(e, 'coHost', lang)} /> },
  ].filter(Boolean);
  // Phones under 480px (F-72): a placeholder note becomes a short "TBC" chip (keeping any confirmed part, e.g.
  // "May–June 2027"), the price shows its short form, and the full notes are listed in the Overview tab.
  const tbcText = t('TBC', 'விரைவில்'); // Tamil: the site's TBC word (date block, Placeholder '[date TBC]')
  const tbcChip = (
    <span className="placeholder event-hero__tbc">
      {lang === 'ta' ? tbcText : <abbr title={t('To be confirmed', 'இன்னும் உறுதியாகவில்லை')}>{tbcText}</abbr>}
    </span>
  );
  const movedNotes = [];
  if (compact) {
    heroFacts.forEach((f) => {
      if (typeof f.text !== 'string') return;
      let c = null;
      if (f.key === 'where') c = compactPlace(e, t, lang);
      else if (f.key === 'price') c = shortPrice(e, t, lang) ? { text: shortPrice(e, t, lang), tbc: false } : compactValue(f.text);
      else if (/\[/.test(f.text) || isTbcText(f.text)) c = compactValue(f.text);
      if (!c || (c.text === f.text && !c.tbc)) return;
      movedNotes.push({ key: f.key, label: f.label, value: f.value, text: f.text });
      f.chipOnly = !c.text;
      f.text = `${c.text}${c.tbc ? ` ${tbcText}` : ''}`.trim();
      f.value = (
        <>
          {c.text && <RichText text={c.text} />}
          {c.text && c.tbc && ' '}
          {c.tbc && tbcChip}
        </>
      );
    });
    // Chip-only facts go last, where they pair up two to a row instead of each sitting beside a wide value.
    heroFacts.sort((a, b) => Number(!!a.chipOnly) - Number(!!b.chipOnly));
    // A district that is only a TBC chip repeats what Where already says; its note is in the Overview box.
    const di = heroFacts.findIndex((f) => f.key === 'district' && f.chipOnly);
    if (di !== -1 && heroFacts.some((f) => f.key === 'where' && !f.chipOnly)) heroFacts.splice(di, 1);
  }
  // Phones (2 columns): a value longer than ~24 characters spans both columns, so it is not squeezed into
  // three lines; a half-width fact left alone before a wide one (or at the end) spans too, so no row is half empty.
  const longValue = (f) => typeof f.text === 'string' && f.text.length > 24;
  const wideKeys = new Set();
  heroFacts.forEach((f, i) => {
    if (longValue(f)) return wideKeys.add(f.key);
    const openHalf = heroFacts.slice(0, i).filter((x) => !wideKeys.has(x.key)).length % 2 === 1;
    if (openHalf) return undefined; // completes a row
    const next = heroFacts[i + 1];
    if (!next || longValue(next)) wideKeys.add(f.key);
    return undefined;
  });
  const isWide = (f) => wideKeys.has(f.key);

  const defaultFaq = past
    ? [
        {
          id: 'ev-faq-results',
          question: t('Where can I see results?', 'முடிவுகளை எங்கே பார்க்கலாம்?'),
          answer: t(
            'On this page. The recap and outcomes appear here once StartNet publishes them.',
            'இந்தப் பக்கத்திலேயே. StartNet வெளியிட்டதும் சுருக்கமும் முடிவுகளும் இங்கே இடம்பெறும்.'
          ),
        },
        {
          id: 'ev-faq-next',
          question: t('When is the next edition?', 'அடுத்த பதிப்பு எப்போது?'),
          answer: nextEdition ? (
            <>
              <span lang={langOf(pickLang(nextEdition, 'title', lang))}>{pickLang(nextEdition, 'title', lang)}</span>
              {': '}
              <RichText text={dateTextFor(nextEdition, t, lang)} />.{' '}
              <Button variant="tertiary" to={eventPath(nextEdition)}>
                {t('See the next edition', 'அடுத்த பதிப்பைப் பாருங்கள்')}
              </Button>
            </>
          ) : (
            <>
              {t('Dates are not confirmed yet. ', 'தேதிகள் இன்னும் உறுதியாகவில்லை. ')}
              <WaLink href={waDate}>{t('Get the date on WhatsApp', 'தேதியை WhatsApp-இல் பெறுங்கள்')}</WaLink>.
            </>
          ),
        },
        { id: 'ev-faq-lang', question: t('What language was it in?', 'எந்த மொழியில் நடந்தது?'), answer: <RichText text={langLabel(t, e.language)} /> },
      ]
    : [
        { id: 'ev-faq-cost', question: t('How much does it cost?', 'கட்டணம் எவ்வளவு?'), answer: <RichText text={price} /> },
        { id: 'ev-faq-lang', question: t('What language is it in?', 'எந்த மொழியில் நடைபெறும்?'), answer: <RichText text={langLabel(t, e.language)} /> },
        {
          id: 'ev-faq-register',
          question: t('How do I register?', 'எப்படிப் பதிவு செய்வது?'),
          answer: t(
            'Register on StartNet X, or on WhatsApp in under a minute.',
            'StartNet X-இல் பதிவு செய்யுங்கள், அல்லது WhatsApp-இல் ஒரு நிமிடத்துக்குள் பதிவு செய்யுங்கள்.'
          ),
        },
        {
          id: 'ev-faq-full',
          question: t('What if it is full?', 'இடங்கள் நிரம்பிவிட்டால்?'),
          answer: t(
            "Join the waitlist and we'll message you if a seat opens.",
            'காத்திருப்புப் பட்டியலில் சேருங்கள். இடம் கிடைத்தால் உங்களுக்குச் செய்தி அனுப்புவோம்.'
          ),
        },
        {
          id: 'ev-faq-time',
          question: t('What time zone are the times in?', 'நேரங்கள் எந்த நேர மண்டலத்தில் உள்ளன?'),
          answer: t('All times are in IST (India Standard Time).', 'அனைத்து நேரங்களும் IST (இந்திய நேரம்).'),
        },
      ];
  const cmsFaq = Array.isArray(e.faq) && e.faq.length
    ? e.faq.map((q, i) => { const a = pickLang(q, 'answer', lang); return { id: `ev-faq-${i}`, question: pickLang(q, 'question', lang), answer: hasMarks(a) ? <RichText text={a} /> : a }; })
    : null;
  // The hero shows the short price on phones; the full price note always has a FAQ answer.
  const faq = cmsFaq
    ? !past && !e.faq.some((q) => /cost|price|fee|கட்டண/i.test(`${q.question || ''} ${q.questionTa || ''}`))
      ? [...cmsFaq, defaultFaq.find((q) => q.id === 'ev-faq-cost')]
      : cmsFaq
    : defaultFaq;

  // "What happened" figures: server outcomes plus the event's own sourced figures (tag, as-at and source each).
  const outcomeFigures = [...realMetrics(e.outcomes), ...recordFigures(e)];
  // Overview copy: the description (or recap) — never the hero lede again.
  const description = pickLang(e, 'description', lang);
  const overviewText = description && description.trim() !== (summary || '').trim() ? description : null;

  const overview = (
    <div className="event-detail__overview">
      {/* "What happened" shows only with verified outcomes (FactBand hides placeholder figures). */}
      {past && outcomeFigures.length > 0 && (
        <div className="event-detail__outcomes">
          <FactBand metrics={outcomeFigures.slice(0, 4)} title={t('What happened', 'என்ன நடந்தது')} surface="paper" />
        </div>
      )}
      {past && hasRecap(e) ? (
        <div className="prose">
          <h2 className="h3">{t('About this event', 'இந்த நிகழ்வு பற்றி')}</h2>
          <RecordRecap e={e} />
        </div>
      ) : overviewText && (
        <div className="prose">
          <h2 className="h3">{past ? t('About this event', 'இந்த நிகழ்வு பற்றி') : t("What you'll leave with", 'நீங்கள் பெறுவது')}</h2>
          <p className="body-lg" lang={langOf(overviewText)}>
            <RichText text={overviewText} />
          </p>
        </div>
      )}

      {Array.isArray(e.whatItIs) && e.whatItIs.length > 0 && (
        <RevealGroup as="ol" className="event-detail__pillars" data-count={e.whatItIs.length}>
          {e.whatItIs.map((w, i) => (
            <li key={w.title} className="event-detail__pillar">
              <span className="event-detail__pillar-num tnum" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
              <h3 className="h4" lang={langOf(pickLang(w, 'title', lang))}>{pickLang(w, 'title', lang)}</h3>
              <p className="text-2" lang={langOf(pickLang(w, 'body', lang))}><RichText text={pickLang(w, 'body', lang)} /></p>
            </li>
          ))}
        </RevealGroup>
      )}

      {Array.isArray(e.prizes) && e.prizes.length > 0 && (
        <div className="event-detail__prizes">
          <h2 className="h3">{t('Prizes and what comes next', 'பரிசுகளும் அடுத்த கட்டமும்')}</h2>
          <ul className="event-detail__prize-list">
            {(pickLang(e, 'prizes', lang) || e.prizes).map((p) => (
              <li key={p}>
                <Check size={18} aria-hidden="true" />
                <span lang={langOf(p)}><RichText text={p} /></span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <RecordLists e={e} />
      <RecordPartners e={e} />
      <RecordSources e={e} />

      {movedNotes.length > 0 && (
        <div className="event-detail__tbc">
          <h2 className="h4">{t('Still to be confirmed', 'இன்னும் உறுதியாகவில்லை')}</h2>
          <dl className="event-detail__tbc-list">
            {movedNotes.map((n) => (
              <div key={n.key}>
                <dt>{n.label}</dt>
                <dd lang={langOf(n.text)}>{n.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      )}

      {!past && (
        <p className="event-detail__wa">
          {t('Register on WhatsApp in under a minute.', 'WhatsApp-இல் ஒரு நிமிடத்துக்குள் பதிவு செய்யுங்கள்.')}{' '}
          <WaLink href={waRegister}>{t('Chat on WhatsApp', 'WhatsApp-இல் பேசுங்கள்')} →</WaLink>
        </p>
      )}

      <div className="event-detail__faq">
        <h2 className="h3">{t('FAQ', 'அடிக்கடி கேட்கப்படும் கேள்விகள்')}</h2>
        <Accordion items={faq} faq />
      </div>
    </div>
  );

  const hasTimeline = Array.isArray(e.timeline) && e.timeline.length && !e.agenda?.length;
  const tabs = [
    { id: 'overview', label: t('Overview', 'கண்ணோட்டம்'), content: overview },
    // Agenda / Speakers tabs appear only when there is something to show (no tab of placeholders).
    (e.agenda?.length || hasTimeline || hasHighlights(e)) && {
      id: 'agenda',
      label: hasTimeline ? t('Timeline', 'காலவரிசை') : !e.agenda?.length ? t('Programme', 'நிகழ்ச்சிகள்') : t('Agenda', 'நிகழ்ச்சி நிரல்'),
      content: <Agenda e={e} />,
    },
    (speakerNames(e).length > 0 || hasRealJury(e, lang) || hasPeople(e)) && {
      id: 'speakers',
      label: hasRealJury(e, lang) || hasJuryGroup(e)
        ? (speakerNames(e).length || hasPeople(e) ? t('Speakers and jury', 'பேச்சாளர்களும் நடுவர்களும்') : t('Jury', 'நடுவர் குழு'))
        : t('Speakers', 'பேச்சாளர்கள்'),
      content: <Speakers e={e} />,
    },
    { id: 'venue', label: t('Venue and travel', 'இடமும் பயணமும்'), content: <Venue e={e} /> },
  ].filter(Boolean);

  const crumbs = [
    { label: t('Events', 'நிகழ்வுகள்'), to: '/events' },
    ...(past ? [{ label: t('Past events', 'கடந்த நிகழ்வுகள்'), to: '/events/past' }] : []),
    { label: title },
  ];

  // Aside facts (>= 1024px): listed only once the hero fact strip has scrolled away, so they never show twice.
  const asideFacts = heroFactsOnScreen
    ? [...(!past && e.seats ? [{ label: t('Seats', 'இடங்கள்'), value: seatsLabel(t, e.seats) }] : [])]
    : [
        { label: t('Date', 'தேதி'), value: <RichText text={when} /> },
        ...(time ? [{ label: t('Time', 'நேரம்'), value: time }] : []),
        { label: t('Where', 'எங்கே'), value: <RichText text={place} /> },
        { label: t('Price', 'கட்டணம்'), value: <RichText text={price} /> },
        ...(!past && e.seats ? [{ label: t('Seats', 'இடங்கள்'), value: seatsLabel(t, e.seats) }] : []),
      ];
  const asideTitle = past
    ? t('This event has ended', 'இந்த நிகழ்வு முடிந்துவிட்டது')
    : heroFactsOnScreen
      ? t('Ready to register?', 'பதிவு செய்யத் தயாரா?')
      : t('Key facts', 'முக்கிய விவரங்கள்');

  return (
    <div className="event-detail" data-brand={e.brand || undefined}>
      {/* SEO: "<Event>: startup event in Tamil Nadu" (trimmed to 60); Event JSON-LD from eventLd(), which is null
          until the date is confirmed and a real venue/city exists. SEO-TA: pending native review. */}
      <Seo
        title={fitTitle(`${e.title}: startup event in Tamil Nadu`, `${e.title}: StartNet event`, e.title)}
        titleTa={fitTitle(`${e.titleTa || e.title}: தமிழ்நாட்டில் ஸ்டார்ட்அப் நிகழ்வு`, `${e.titleTa || e.title}: StartNet நிகழ்வு`, e.titleTa || e.title)}
        description={fitDescription(e.summary, editionWhenSentence(e, 'en', dateText), ['Register on StartNet X, or on WhatsApp in under a minute.', 'Register on StartNet X or WhatsApp.'])}
        descriptionTa={fitDescription(e.summaryTa || '', editionWhenSentence(e, 'ta', (ev) => eventDateRange(ev.date, ev.endDate, 'ta')), ['StartNet X-இல் அல்லது WhatsApp-இல் ஒரு நிமிடத்துக்குள் பதிவு செய்யுங்கள்.', 'StartNet X அல்லது WhatsApp-இல் பதிவு செய்யுங்கள்.'])}
        jsonLd={eventLd(e, { path: eventPath(e) || `/events/${e.slug}`, lang })}
      />

      {/* Event hero */}
      {/* The hero is the ink band (data-surface="night"); the tabbed body slides over it as a sheet (EventDetail.css). */}
      <section className="event-hero" data-surface="night">
        <div className="container event-hero__inner">
          <Breadcrumbs items={crumbs} />
          <div className="event-hero__grid">
            <div className="event-hero__copy">
              <div className="event-hero__chips">
                {brand && <Badge kind="brand" brand={e.brand}>{brand.name}</Badge>}
                {e.series && seriesUrl ? (
                  // The series chip links to the series page (phones drop the separate "More about" link).
                  <Link to={localePath(seriesUrl)} className="event-hero__series-chip">
                    <Badge kind="type">{seriesName}</Badge>
                    <span className="visually-hidden">{t(' — more about this series', ' — இந்தத் தொடர் பற்றி மேலும்')}</span>
                  </Link>
                ) : (
                  e.series && <Badge kind="type">{seriesName}</Badge>
                )}
                {past ? (
                  <Badge kind="status" status="closed">{t('Past event', 'முடிந்த நிகழ்வு')}</Badge>
                ) : (
                  e.seats && (
                    <Badge kind="status" status={full ? 'closed' : e.seats === 'few' ? 'closing' : 'open'}>
                      {seatsLabel(t, e.seats)}
                    </Badge>
                  )
                )}
              </div>
              <KineticHeadline text={title} as="h1" className="display-xl event-hero__title" lang={langOf(title)} />
              {e.endorsement && (
                <p className="event-hero__endorse" lang={langOf(pickLang(e, 'endorsement', lang))}>
                  {pickLang(e, 'endorsement', lang)}
                </p>
              )}
              {/* LCP: lede and actions paint on first render (transform-only entrance, M-11). */}
              <HeroCopy text={summary} micro={!past && e.microcopy ? pickLang(e, 'microcopy', lang) : ''}>
                <div className="cluster event-hero__actions hero-rise">
                  {actions}
                </div>
              </HeroCopy>
              {!past && !interestOnly && (
                <p className="caption event-hero__wa">
                  {t('Or ', 'அல்லது ஒரு நிமிடத்துக்குள் ')}
                  <WaLink href={waRegister}>{t('register on WhatsApp', 'WhatsApp-இல் பதிவு செய்யுங்கள்')}</WaLink>
                  {t(' in under a minute.', '.')}
                </p>
              )}
              {seriesUrl && (
                <Button variant="tertiary" to={seriesUrl} className="event-hero__series">
                  {e.series
                    ? t(`More about ${seriesName}`, `${seriesName} பற்றி மேலும்`)
                    : t('More about this series', 'இந்தத் தொடர் பற்றி மேலும்')}
                </Button>
              )}
            </div>

            <Reveal className="event-hero__poster" delay={0.1}>
              <ArtImage
                variant={ART[e.brand] || 'dot'}
                brand={e.brand}
                ratio={singleCol ? '21/9' : '4/5'}
                seed={seedOf(e.slug)}
                alt=""
                photo={photoFor(eventPhotoKeys(e, eventPath(e))) ?? null}
                priority
                sizes={PHOTO_SIZES.hero}
                label={e.format === 'online' ? t('Online', 'ஆன்லைன்') : !isPlaceholderValue(city) ? city : undefined}
                animate
              />
              {e.date && (
                <div className="event-hero__dateblock" aria-hidden="true">
                  {confirmed ? (
                    <>
                      <span className="event-hero__dateblock-month">{block.month}</span>
                      <span className="event-hero__dateblock-day tnum">{block.day}</span>
                      <span className="event-hero__dateblock-wd">{block.weekday}</span>
                    </>
                  ) : past ? (
                    // Archived edition without a confirmed date: show the year, not "JAN TBC".
                    <>
                      <span className="event-hero__dateblock-month">{t('Recap', 'சுருக்கம்')}</span>
                      <span className="event-hero__dateblock-day tnum">{(e.date || '').slice(0, 4)}</span>
                    </>
                  ) : (
                    <>
                      <span className="event-hero__dateblock-month">{block.month}</span>
                      <span className="event-hero__dateblock-day event-hero__dateblock-day--word">{t('TBC', 'விரைவில்')}</span>
                      <span className="event-hero__dateblock-wd">{(e.date || '').slice(0, 4)}</span>
                    </>
                  )}
                </div>
              )}
            </Reveal>
          </div>

          <dl className="event-hero__facts" ref={factsRef} data-count={heroFacts.length}>
            {heroFacts.map((f) => (
              <div key={f.key} className={`event-hero__fact${isWide(f) ? ' event-hero__fact--wide' : ''}`}>
                <dt>
                  <f.icon size={16} aria-hidden="true" />
                  {f.label}
                </dt>
                <dd lang={langOf(f.text)}>{f.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Tabs + sticky register aside */}
      <Section surface="paper" className="event-detail__body">
        <div className="event-detail__layout">
          <div className="event-detail__aside">
            <div className="event-detail__sticky">
              <KeyFacts
                sticky={false}
                title={asideTitle}
                items={asideFacts}
                action={
                  past ? (
                    <Button to="/events" full>
                      {t('See upcoming events', 'வரவிருக்கும் நிகழ்வுகளைப் பாருங்கள்')}
                    </Button>
                  ) : (
                    <div className="event-detail__aside-actions">
                      <Button variant={brand ? 'brand' : 'primary'} href={registerHref} full>
                        {registerLabel}
                      </Button>
                      {calendarButton(true)}
                      <Button variant="whatsapp" href={waRegister} full>
                        {t('Chat on WhatsApp', 'WhatsApp-இல் பேசுங்கள்')}
                      </Button>
                    </div>
                  )
                }
              />
              <p className="visually-hidden" role="status" aria-live="polite">
                {added ? t('Calendar file downloaded.', 'நாள்காட்டிக் கோப்பு பதிவிறக்கப்பட்டது.') : ''}
              </p>
            </div>
          </div>
          <div className="event-detail__main">
            <UrlTabs tabs={tabs} label={t('Event details', 'நிகழ்வு விவரங்கள்')} />
          </div>
        </div>
      </Section>

      {related.length > 0 && (
        <Section surface="white" className="event-detail__related">
          <SectionHeader
            eyebrow={brand ? brand.name : t('Events', 'நிகழ்வுகள்')}
            title={t('More events coming up', 'வரவிருக்கும் மேலும் நிகழ்வுகள்')}
            action={
              <Button variant="tertiary" to={e.brand ? `/events?brand=${e.brand}` : '/events'}>
                {t('See all events', 'அனைத்து நிகழ்வுகளையும் பாருங்கள்')}
              </Button>
            }
          />
          <RevealGroup as="ul" className="event-detail__related-grid" data-count={related.length}>
            {related.map((r) => (
              <li key={r.slug}>
                <EventCard event={r} />
              </li>
            ))}
          </RevealGroup>
        </Section>
      )}

      {past ? (
        <CTABand
          surface="night"
          title={t('Find a room full of builders near you.', 'உங்கள் அருகில் உருவாக்குநர்கள் நிறைந்த ஓர் அரங்கைக் கண்டறியுங்கள்.')}
          body={t(
            'Summits, sector Connects, campus build nights and district editions across Tamil Nadu. Most first events are free.',
            'தமிழ்நாடு முழுவதும் உச்சி மாநாடுகள், துறைசார் Connect நிகழ்வுகள், கல்லூரி build nights, மாவட்டப் பதிப்புகள். பெரும்பாலான முதல் நிகழ்வுகள் இலவசம்.'
          )}
          actions={
            <Button to="/events" icon={ArrowRight}>
              {t('See upcoming events', 'வரவிருக்கும் நிகழ்வுகளைப் பாருங்கள்')}
            </Button>
          }
        />
      ) : (
        <CTABand
          surface="night"
          title={t('Register on WhatsApp in under a minute.', 'WhatsApp-இல் ஒரு நிமிடத்துக்குள் பதிவு செய்யுங்கள்.')}
          body={
            <>
              <span lang={langOf(title)}>{title}</span> · <RichText text={when} />
            </>
          }
          actions={
            <>
              <Button variant={brand ? 'brand' : 'primary'} href={registerHref}>{registerLabel}</Button>
              <Button variant="whatsapp" href={waRegister}>
                {t('Chat on WhatsApp', 'WhatsApp-இல் பேசுங்கள்')}
              </Button>
            </>
          }
        />
      )}
    </div>
  );
}
