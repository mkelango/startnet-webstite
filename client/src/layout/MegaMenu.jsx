// C03 · Mega menu panel content (Book 1 Part B §3.2, AIWO blueprint P1). The open/close shell lives in Header.jsx.
// Variants: 'columns' (intro + 2–4 columns in cols 1–8 · the featured card in cols 9–12, led by a media ·
// footer strip) and 'brands' (4 accent-ruled columns + ink strip).
// Featured-card media: a real photograph where it shows the panel's own subject (curated from the library, used on
// no page in data/imagePlan.js, so it never repeats a photo on the page behind the panel); the event's own photo
// (or a motion visual) for the next flagship; a motion visual for data and platform panels (Ledger, StartNet X).
// Copy comes from data/nav.js (English + *Ta fields); Tamil strings here are drafts pending native review.
import { Link } from 'react-router-dom';
import { m } from 'framer-motion';
import { ArrowRight, ArrowUpRight, MessageCircle } from 'lucide-react';
import { useLang } from '../lib/i18n.jsx';
import { useApi } from '../hooks/useApi.js';
import { snxLink, waLink } from '../lib/links.js';
import { formatDate, formatDateShort } from '../lib/format.js';
import { BRANDS } from '../data/brands.js';
import { isPublished, publishedLinks } from '../data/nav.js';
import { Badge, BrandLockup, Button, Placeholder, Stat, ArtImage } from '../components';
import { eventPath as eventPathOf } from '../components/_utils.js';
import { findMetric, signInHref } from './shell.jsx';
import './MegaMenu.css';
import { eventPhotoKeys, photoFor } from '../data/photos.js';

const PLACEHOLDER = ['[placeholder — to be supplied by StartNet]', '[இடம்பிடிப்பு — StartNet வழங்க வேண்டும்]'];

const colVariants = {
  hidden: { opacity: 0, y: 6 },
  show: (i) => ({ opacity: 1, y: 0, transition: { delay: Math.min(i, 5) * 0.04, duration: 0.24, ease: [0.2, 0, 0, 1] } }),
};

function MenuLink({ link, onNavigate }) {
  const { t, localePath } = useLang();
  return (
    <li>
      <Link to={localePath(link.to)} className="mega-menu__link" onClick={onNavigate}>
        <span className="mega-menu__link-label">
          {t(link.label, link.labelTa)}
          <ArrowRight size={16} strokeWidth={1.75} aria-hidden="true" className="mega-menu__link-arrow" />
        </span>
        {link.note && <span className="mega-menu__link-note">{t(link.note, link.noteTa)}</span>}
      </Link>
    </li>
  );
}

function ReportLinks({ onNavigate }) {
  // Reports and indices appear only once published (§3.2 ⑤).
  const { data } = useApi('/api/reports');
  const published = Array.isArray(data) ? data.filter((r) => r.status === 'published').slice(0, 5) : [];
  // A record's own page URL (indices live at /insights/indices/<index>, the Ledger at /insights/founder-ledger);
  // hub anchors (/insights/reports#…) fall back to the report detail page.
  const pageOf = (r) => (typeof r.url === 'string' && r.url.startsWith('/') && !r.url.includes('#') ? r.url : `/insights/reports/${r.slug}`);
  return published.map((r) => (
    <MenuLink key={r.slug} link={{ label: r.title, labelTa: r.titleTa, to: pageOf(r) }} onNavigate={onNavigate} />
  ));
}

function Column({ col, index, reduced, onNavigate }) {
  const { t } = useLang();
  return (
    <m.div
      className="mega-menu__col"
      custom={index}
      variants={reduced ? undefined : colVariants}
      initial={reduced ? false : 'hidden'}
      animate="show"
    >
      <h3 className="mega-menu__col-title">
        {t(col.heading, col.headingTa)}
        {col.meta && <span className="mega-menu__col-meta">{col.meta}</span>}
      </h3>
      <ul className="mega-menu__list">
        {col.dynamic === 'reports' && <ReportLinks onNavigate={onNavigate} />}
        {publishedLinks(col).map((l) => <MenuLink key={l.to + l.label} link={l} onNavigate={onNavigate} />)}
      </ul>
    </m.div>
  );
}

/* ---------- Featured cards (dynamic where the book says so) ---------- */

/** Photos for the feature cards (keys from photos.manifest.json): StartNet's own where one fits, Indian stock otherwise. */
const FEATURE_PHOTOS = {
  mission: 'pool/team/01', //      Who we are: the StartNet community at its first anniversary (real)
  'open-calls': 'pool/students/09', // Programmes: a mentor guiding students at their computers
  partner: 'pool/team/06', //      Partner: StartNet 2.0 agreements signed on stage (real)
  ledger: 'pool/insights/02', //   Founder Ledger: an analyst at her computer
  snx: 'pool/platform/03', //      StartNet X: a young founder at work
};

function FeatureMedia({ kind }) {
  const key = FEATURE_PHOTOS[kind];
  const photo = key ? photoFor(key) : undefined;
  if (!photo) return null;
  return (
    <div className="mega-feature__media">
      <ArtImage ratio="3/2" photo={photo} curated plan={false} sizes="(min-width: 1024px) 400px, 100vw" />
    </div>
  );
}

function FeatureShell({ title, children, tone = 'sunken', eyebrow, media }) {
  const { t } = useLang();
  return (
    <aside className={`mega-feature mega-feature--${tone}${media ? ' mega-feature--media' : ''}`} aria-label={title}>
      {media && <FeatureMedia kind={media} />}
      <p className="mega-feature__eyebrow">{eyebrow || t('Featured', 'சிறப்புப் பகுதி')}</p>
      <h3 className="mega-feature__title">{title}</h3>
      {children}
    </aside>
  );
}

const ctaLabel = (t, cta) => t(cta.label, cta.labelTa);

function FeaturedMission({ f }) {
  const { t } = useLang();
  const { data } = useApi('/api/metrics');
  const metric = findMetric(data, [/nurtur/i, /\bl2\b/i]);
  const known = metric && typeof metric.value === 'number';
  const pct = known ? Math.max(0, Math.min(1, metric.value / 100000)) : 0;
  return (
    <FeatureShell title={t(f.title, f.titleTa)} media="mission">
      <div className="mega-feature__stat">
        {known ? <Stat metric={metric} variant="compact" /> : (
          <p className="mega-feature__body">
            {t('Nurtured founders (L2+):', 'வளர்க்கப்பட்ட நிறுவனர்கள் (L2+):')} <Placeholder>{t(...PLACEHOLDER)}</Placeholder>
          </p>
        )}
      </div>
      <div className="mega-progress" aria-hidden="true">
        <span className="mega-progress__bar" style={{ transform: `scaleX(${pct})` }} />
      </div>
      <p className="mega-feature__caption">{t('Progress toward Mission 1 Lakh', 'Mission 1 Lakh இலக்கை நோக்கிய முன்னேற்றம்')}</p>
      <Button to={f.cta.to} variant="tertiary" size="sm" icon={ArrowRight}>{ctaLabel(t, f.cta)}</Button>
    </FeatureShell>
  );
}

const OPEN_STATUSES = ['open', 'closing', 'rolling'];

function FeaturedOpenCalls({ f, onNavigate }) {
  const { t, localePath } = useLang();
  // "Accepting applications" = open + closing + rolling, as on the /programmes "Applications open now" section.
  const { data, loading } = useApi('/api/programmes');
  const calls = Array.isArray(data)
    ? data.filter((p) => OPEN_STATUSES.includes(p.status)).sort((a, b) => String(a.applyBy || '9999').localeCompare(String(b.applyBy || '9999'))).slice(0, 2)
    : [];
  return (
    <FeatureShell title={t(f.title, f.titleTa)} media="open-calls">
      {loading && <p className="mega-feature__body">{t('Loading open calls…', 'திறந்த அழைப்புகள் ஏற்றப்படுகின்றன…')}</p>}
      {!loading && calls.length === 0 && (
        <p className="mega-feature__body">
          {t(
            'No calls are open right now. New calls are announced on WhatsApp and in the newsletter.',
            'இப்போது திறந்த அழைப்புகள் எதுவும் இல்லை. புதிய அழைப்புகள் WhatsApp-இலும் செய்திமடலிலும் அறிவிக்கப்படும்.'
          )}
        </p>
      )}
      {calls.length > 0 && (
        <ul className="mega-calls">
          {calls.map((p) => (
            <li key={p.slug} className="mega-calls__item" data-brand={p.brand}>
              <Link to={localePath(`/programmes/${p.slug}`)} className="mega-calls__link" onClick={onNavigate}>
                <Badge kind="brand" brand={p.brand}>{BRANDS[p.brand]?.name || 'StartNet'}</Badge>
                <span className="mega-calls__title">{t(p.title, p.titleTa)}</span>
                {p.applyBy && (
                  <span className="mega-calls__date">
                    {t(`Apply by ${formatDateShort(p.applyBy)}`, `${formatDateShort(p.applyBy, 'ta')}-க்குள் விண்ணப்பியுங்கள்`)}
                  </span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      )}
      <Button to={f.cta.to} variant="tertiary" size="sm" icon={ArrowRight}>{ctaLabel(t, f.cta)}</Button>
    </FeatureShell>
  );
}

const SEATS = {
  available: ['Seats available', 'இடங்கள் உள்ளன'],
  few: ['Few seats left', 'சில இடங்களே உள்ளன'],
  full: ['Full, join the waitlist', 'நிரம்பிவிட்டது, காத்திருப்புப் பட்டியலில் சேருங்கள்'],
};

// The flagship series (Book 1 Part B §3.2 Events: "Next flagship"); campus build nights and sector Connects are not flagships.
const FLAGSHIP_SERIES = ['vibathon', 'agentic-ai-connect', 'physical-ai-connect', 'lab-to-market-summit', 'women-founders-summit', 'vibe-summit'];
const TBC = /to be confirmed|\[.*\]/i;

/** The next upcoming flagship event (also linked from the mobile drawer's Events accordion). Pass enabled=false to skip the fetch. */
export function useNextFlagship(enabled = true) {
  const { data, loading } = useApi(enabled ? '/api/events?when=upcoming' : null);
  const list = Array.isArray(data) ? data : [];
  const ev = list
    .filter((e) => FLAGSHIP_SERIES.includes(e.series))
    .sort((a, b) => String(a.date || '9999').localeCompare(String(b.date || '9999')))[0];
  return { ev: ev || null, loading, path: ev ? eventPathOf(ev) : null };
}

function FeaturedFlagship({ f, onNavigate }) {
  const { t, lang, localePath } = useLang();
  const { ev, loading, path: eventPath } = useNextFlagship();
  const title = t(f.title, f.titleTa);
  if (!ev) {
    return (
      <FeatureShell title={title} eyebrow={title} media="flagship">
        <p className="mega-feature__body">
          {loading
            ? t('Loading the next flagship…', 'அடுத்த முதன்மை நிகழ்வு ஏற்றப்படுகிறது…')
            : t('The next flagship date will be announced here.', 'அடுத்த முதன்மை நிகழ்வின் தேதி இங்கே அறிவிக்கப்படும்.')}
        </p>
        <Button to="/events" variant="tertiary" size="sm" icon={ArrowRight}>{t('All upcoming events', 'வரவிருக்கும் அனைத்து நிகழ்வுகளும்')}</Button>
      </FeatureShell>
    );
  }
  // Unconfirmed dates are stored mid-month only for sorting: show the label ("February 2027 · date to be confirmed").
  const confirmed = ev.dateConfirmed === true || ev.confirmed === true;
  const when = confirmed && ev.date
    ? <time dateTime={ev.date}>{formatDate(ev.date, lang)}</time>
    : <span>{t(ev.dateLabel || 'Date to be confirmed', ev.dateLabelTa || (ev.dateLabel ? undefined : 'தேதி உறுதிப்படுத்தப்பட வேண்டும்'))}</span>;
  const city = ev.city && !TBC.test(ev.city) ? t(ev.city, ev.cityTa) : null;
  const evTitle = t(ev.title, ev.titleTa);
  return (
    <aside className="mega-feature mega-feature--event mega-feature--media" aria-label={`${title}: ${evTitle}`} data-brand={ev.brand}>
      {/* The event's own photo only (events are strict, docs/PHOTOS.md); otherwise a motion visual. Site chrome: the
          page's image plan never applies here. */}
      <Link to={localePath(eventPath)} className="mega-event__art mega-feature__media" onClick={onNavigate} tabIndex={-1} aria-hidden="true">
        <ArtImage variant="network" brand={ev.brand} ratio="3/2" seed={ev.slug.length} photo={photoFor(eventPhotoKeys(ev, eventPath)) ?? null} curated={Boolean(photoFor(eventPhotoKeys(ev, eventPath)))} plan={false} sizes="(min-width: 1024px) 400px, 100vw" />
      </Link>
      <p className="mega-feature__eyebrow">{title}</p>
      <h3 className="mega-feature__title">
        <Link to={localePath(eventPath)} onClick={onNavigate} className="mega-event__title">{evTitle}</Link>
      </h3>
      <p className="mega-event__meta">
        {when}{city && <> · {city}</>}
      </p>
      <div className="mega-event__chips">
        <Badge kind="brand" brand={ev.brand}>{BRANDS[ev.brand]?.name || 'StartNet'}</Badge>
        {ev.seats && SEATS[ev.seats] && (
          <Badge kind="status" status={ev.seats === 'full' ? 'closed' : ev.seats === 'few' ? 'closing' : 'open'}>{t(...SEATS[ev.seats])}</Badge>
        )}
      </div>
      {/* Same destination as the event cards: the event page carries the registration route. */}
      <Button to={eventPath} size="sm" icon={ArrowRight}>{ctaLabel(t, f.cta)}</Button>
    </aside>
  );
}

const LEDGER_TILES = [
  { label: 'Nurtured founders (L2+)', labelTa: 'வளர்க்கப்பட்ட நிறுவனர்கள் (L2+)', patterns: [/nurtur/i, /\bl2\b/i] },
  { label: 'Companies launched (L5)', labelTa: 'தொடங்கப்பட்ட நிறுவனங்கள் (L5)', patterns: [/launch/i, /\bl5\b/i] },
  { label: 'Capital raised', labelTa: 'திரட்டப்பட்ட மூலதனம்', patterns: [/capital/i, /raised/i, /funding/i] },
];

function FeaturedLedger({ f }) {
  const { t } = useLang();
  const { data } = useApi('/api/metrics');
  return (
    <FeatureShell title={t(f.title, f.titleTa)} media="ledger">
      <dl className="mega-ledger">
        {LEDGER_TILES.map((tile) => {
          const metric = findMetric(data, tile.patterns);
          if (metric && metric.value != null) return <Stat key={tile.label} metric={metric} variant="compact" dl className="mega-ledger__tile" />;
          return (
            <div className="mega-ledger__tile" key={tile.label}>
              <dt className="mega-ledger__label">{t(tile.label, tile.labelTa)}</dt>
              <dd className="mega-ledger__value"><Placeholder>{t(...PLACEHOLDER)}</Placeholder></dd>
            </div>
          );
        })}
      </dl>
      <Button to={f.cta.to} variant="tertiary" size="sm" icon={ArrowRight}>{ctaLabel(t, f.cta)}</Button>
    </FeatureShell>
  );
}

function FeaturedSnx({ f }) {
  const { t, lang } = useLang();
  return (
    <FeatureShell title={t(f.title, f.titleTa)} tone="ink" eyebrow="StartNet X" media="snx">
      <div className="mega-feature__actions">
        <Button href={snxLink('/signup', { src: 'menu', lang })} variant="inverse" size="sm">{ctaLabel(t, f.cta)}</Button>
        <a href={signInHref(lang, 'menu')} className="mega-feature__textlink">
          {t('Sign in', 'உள்நுழைக')} <ArrowUpRight size={14} aria-hidden="true" />
          <span className="visually-hidden">{t(' (opens StartNet X)', ' (StartNet X-இல் திறக்கும்)')}</span>
        </a>
      </div>
    </FeatureShell>
  );
}

function FeaturedPartner({ f }) {
  const { t } = useLang();
  return (
    <FeatureShell title={t(f.title, f.titleTa)} media="partner">
      {f.note && <p className="mega-feature__body"><Placeholder>{t(f.note, f.noteTa)}</Placeholder></p>}
      <div className="mega-feature__actions">
        <Button to={f.cta.to} size="sm">{ctaLabel(t, f.cta)}</Button>
        <a
          href={waLink(t('Hi StartNet, I would like to talk about a partnership', 'வணக்கம் StartNet, கூட்டாண்மை பற்றிப் பேச விரும்புகிறேன்'), 'partner-menu')}
          className="mega-feature__textlink"
          target="_blank"
          rel="noopener noreferrer"
        >
          <MessageCircle size={14} aria-hidden="true" /> {t('WhatsApp our partnerships team', 'எங்கள் கூட்டாண்மைக் குழுவுடன் WhatsApp-இல் பேசுங்கள்')}
          <span className="visually-hidden">{t(' (opens WhatsApp)', ' (WhatsApp-இல் திறக்கும்)')}</span>
        </a>
      </div>
    </FeatureShell>
  );
}

const FEATURED = {
  mission: FeaturedMission,
  'open-calls': FeaturedOpenCalls,
  flagship: FeaturedFlagship,
  ledger: FeaturedLedger,
  snx: FeaturedSnx,
  partner: FeaturedPartner,
};

/* ---------- Panel ---------- */

function Intro({ item, onNavigate }) {
  const { t, localePath } = useLang();
  return (
    <div className="mega-menu__intro">
      <h2 className="mega-menu__title">
        <Link to={localePath(item.to)} onClick={onNavigate} className="mega-menu__title-link">
          {t(item.label, item.labelTa)}
          <ArrowRight size={22} aria-hidden="true" className="mega-menu__title-arrow" />
        </Link>
      </h2>
      <p className="mega-menu__lede">{t(item.intro, item.introTa)}</p>
    </div>
  );
}

function Strip({ item, onNavigate }) {
  const { t, localePath } = useLang();
  const footer = (item.footer || []).filter(isPublished);
  return (
    <div className="mega-menu__strip">
      <div className="container mega-menu__strip-inner">
        {footer.length > 0 && (
          <ul className="mega-menu__strip-list">
            {footer.map((l) => (
              <li key={l.label}>
                <Link to={localePath(l.to)} onClick={onNavigate}>{t(l.label, l.labelTa)}</Link>
              </li>
            ))}
          </ul>
        )}
        <Link to={localePath(item.seeAll.to)} onClick={onNavigate} className="mega-menu__seeall">
          {t(item.seeAll.label, item.seeAll.labelTa)} <ArrowRight size={16} aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
}

function BrandsPanel({ item, reduced, onNavigate }) {
  const { t, localePath } = useLang();
  return (
    <>
      <div className="container mega-menu__inner mega-menu__inner--brands">
        <Intro item={item} onNavigate={onNavigate} />
        <div className="mega-menu__brands">
          {item.columns.map((col, i) => (
            <m.div
              key={col.brand}
              data-brand={col.brand}
              className="mega-menu__brand"
              custom={i}
              variants={reduced ? undefined : colVariants}
              initial={reduced ? false : 'hidden'}
              animate="show"
            >
              <Link
                to={localePath(col.visit.to)}
                className="mega-menu__brand-head"
                onClick={onNavigate}
                aria-label={`${col.heading}, ${t(col.journey, col.journeyTa)}`}
              >
                <BrandLockup brand={col.brand} size="sm" />
                <span className="mega-menu__brand-journey">{t(col.journey, col.journeyTa)}</span>
              </Link>
              <ul className="mega-menu__list">
                {publishedLinks(col).map((l) => <MenuLink key={l.to} link={l} onNavigate={onNavigate} />)}
              </ul>
              <Link to={localePath(col.visit.to)} className="mega-menu__brand-visit" onClick={onNavigate}>
                {t(col.visit.label, col.visit.labelTa)} <ArrowRight size={16} aria-hidden="true" />
              </Link>
            </m.div>
          ))}
        </div>
      </div>
      <div className="mega-menu__inkstrip" data-surface="night">
        <div className="container mega-menu__inkstrip-inner">
          <p>{t(item.featured.title, item.featured.titleTa)}</p>
          <Button to={item.featured.cta.to} variant="inverse" size="sm" icon={ArrowRight}>{ctaLabel(t, item.featured.cta)}</Button>
        </div>
      </div>
    </>
  );
}

export default function MegaMenu({ item, reduced = false, onNavigate }) {
  if (item.variant === 'brands') {
    return (
      <div className="mega-menu__content">
        <BrandsPanel item={item} reduced={reduced} onNavigate={onNavigate} />
        <Strip item={item} onNavigate={onNavigate} />
      </div>
    );
  }
  const Featured = FEATURED[item.featured?.kind];
  // Drop a column whose links are all unpublished (the reports column fills itself at runtime).
  // `megaHidden` columns stay in the mobile drawer but not in this panel.
  const columns = item.columns.filter((col) => !col.megaHidden && isPublished(col) && (col.dynamic || publishedLinks(col).length > 0));
  return (
    <div className="mega-menu__content">
      <div className="container mega-menu__inner" data-featured={item.featured?.kind}>
        <Intro item={item} onNavigate={onNavigate} />
        <div className="mega-menu__cols" style={{ '--mega-cols': columns.length }}>
          {columns.map((col, i) => (
            <Column key={col.heading} col={col} index={i} reduced={reduced} onNavigate={onNavigate} />
          ))}
        </div>
        {Featured && (
          <div className="mega-menu__feature-slot" onClick={(e) => { if (e.target.closest('a')) onNavigate?.(e); }}>
            <Featured f={item.featured} onNavigate={onNavigate} />
          </div>
        )}
      </div>
      <Strip item={item} onNavigate={onNavigate} />
    </div>
  );
}
