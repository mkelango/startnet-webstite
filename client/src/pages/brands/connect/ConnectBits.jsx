import { Link } from 'react-router-dom';
import {
  Button, EmptyState, EventCard, Placeholder, RevealGroup, Scroller, Skeleton, Stat, TagChip, WhatsAppButton,
} from '../../../components';
import { useLang } from '../../../lib/i18n.jsx';
import { formatDate } from '../../../lib/format.js';
import { eventPath } from '../../../components/_utils.js';
import { CONNECT_FLAGSHIPS, flagshipEvent } from './connectData.js';
import './ConnectBits.css';

/**
 * The next StartNet Connect flagships (connectData.js CONNECT_FLAGSHIPS): name, date, city. A name links to its event
 * page only when /api/events lists it, so the list never points at a page that does not exist yet.
 */
export function ConnectFlagships({ events = [], className = '' }) {
  const { t, lang, localePath } = useLang();
  return (
    <ul className={`connect-flagships ${className}`.trim()}>
      {CONNECT_FLAGSHIPS.map((f) => {
        const ev = flagshipEvent(events, f);
        const to = ev ? eventPath(ev) : null;
        return (
          <li key={f.id} className="connect-flagships__item">
            {to
              ? <Link className="connect-flagships__name" to={localePath(to)}>{f.name}</Link>
              : <span className="connect-flagships__name">{f.name}</span>}
            <span className="connect-flagships__meta small text-2">
              <time className="tnum" dateTime={f.date}>{formatDate(f.date, undefined, lang)}</time> · {t(f.city, f.cityTa)}
            </span>
          </li>
        );
      })}
    </ul>
  );
}

/** The last flagship edition of a sector Connect (connectData.js SECTOR_PAST): sourced facts, one tagged figure. */
export function SectorPast({ past }) {
  const { t } = useLang();
  if (!past) return null;
  return (
    <div className="connect-past">
      <p className="connect-past__when small text-2">
        <span className="tnum">{t(past.when, past.whenTa)}</span> · {t(past.where, past.whereTa)}
      </p>
      <h3 className="h4 connect-past__name">{past.name}</h3>
      <p className="text-2">{t(past.body, past.bodyTa)}</p>
      {past.metric && <Stat metric={past.metric} variant="compact" />}
      <p className="caption connect-past__src">{t(past.sources, past.sourcesTa)}</p>
      <Button variant="tertiary" to={past.edition}>{t('See the edition', 'அந்தப் பதிப்பைப் பாருங்கள்')}</Button>
    </div>
  );
}

// Small Connect building blocks shared by ConnectHome and ConnectSub. Tamil strings are drafts pending native review.

/**
 * Button label with a shorter phone version (< 480px; < 640px for Tamil). Both are real text, and only
 * the visible one is exposed to assistive technology (display: none).
 */
export function FitLabel({ long, short }) {
  if (!short || short === long) return long;
  return (
    <>
      <span className="connect-fit__long">{long}</span>
      <span className="connect-fit__short">{short}</span>
    </>
  );
}

export function CircleMembership({ variant = 'compact' }) {
  const { t } = useLang();
  return (
    <Stat
      value={30000}
      prefix="₹"
      unit={t('a year', 'ஆண்டுக்கு')}
      label={t('Circle membership from (includes StartNet X Pro)', 'Circle உறுப்பினர் கட்டணம், இதிலிருந்து (StartNet X Pro உட்பட)')}
      tag="C"
      note={t('Indicative price, shown before the published rate card.', 'உத்தேச விலை; அதிகாரபூர்வ கட்டண அட்டை வெளியாகும் முன் காட்டப்படுகிறது.')}
      source={t('StartNet indicative pricing (rate card to be published)', 'StartNet உத்தேச விலை (கட்டண அட்டை வெளியிடப்பட உள்ளது)')}
      variant={variant}
    />
  );
}

export function SwitchFacts() {
  const { t } = useLang();
  return (
    <dl className="connect-home__facts">
      <div><dt>{t('Length', 'காலம்')}</dt><dd>{t('12 weeks, evenings and weekends', '12 வாரங்கள், மாலை நேரங்களும் வார இறுதிகளும்')}</dd></div>
      <div><dt>{t('Fee', 'கட்டணம்')}</dt><dd><Placeholder>[placeholder — rate card; indicative ₹35,000–75,000]</Placeholder> <TagChip tag="C" /></dd></div>
      {/* Next cohort date: hidden until StartNet supplies it. */}
      <div><dt>{t('Format', 'வடிவம்')}</dt><dd>{t('Chennai in person + online', 'சென்னையில் நேரடியாக + இணையவழி')}</dd></div>
    </dl>
  );
}

export function UpcomingConnect({ events, loading, error }) {
  const { t } = useLang();
  if (loading) return <Skeleton height="22rem" count={3} />;
  if (error || !events?.length) {
    return (
      <>
        <EmptyState
          title={t('Dates soon', 'தேதிகள் விரைவில்')}
          body={t('New Connect dates are announced first to the Connect community on WhatsApp.', 'புதிய Connect தேதிகள் முதலில் WhatsApp-இல் Connect சமூகத்துக்கு அறிவிக்கப்படும்.')}
          action={<WhatsAppButton text="CONNECT" label={t('Get updates on WhatsApp', 'WhatsApp-இல் தகவல்களைப் பெறுங்கள்')} />}
        />
        {/* Until the API lists them, the next flagships are still named, with their dates (no link). */}
        <div className="connect-flagships-wrap">
          <p className="small text-2">{t('The next StartNet Connect flagships:', 'அடுத்த StartNet Connect முதன்மை நிகழ்வுகள்:')}</p>
          <ConnectFlagships events={[]} />
        </div>
      </>
    );
  }
  if (events.length > 3) {
    return (
      <Scroller label={t('Upcoming Connect events', 'வரவிருக்கும் Connect நிகழ்வுகள்')} itemWidth="min(85vw, 24rem)">
        {events.map((e) => <EventCard key={e.slug} event={e} />)}
      </Scroller>
    );
  }
  return (
    <RevealGroup className={`grid ${events.length === 2 ? 'grid-2' : 'grid-3'}`}>
      {events.map((e) => <EventCard key={e.slug} event={e} />)}
    </RevealGroup>
  );
}
