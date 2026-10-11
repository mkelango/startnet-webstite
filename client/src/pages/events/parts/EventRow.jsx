// Event row for the events lists at >= 1024px (DESIGN-v2 6.3, AIWO hairline rows):
//   160px date (day numeral + month/year meta) | 1fr (brand label, title, 2-line summary, facts) | 240px (place + arrow).
// Same data and strings as the shared EventCard (which the lists use below 1024px); only the layout differs. The
// whole row is one link (the title link's ::after covers the row), so there is one tab stop per event.
import { Link } from 'react-router-dom';
import { MapPin } from 'lucide-react';
import { Badge, Stat, InlineMarks } from '../../../components';
import { isPlaceholderText } from '../../../components/_placeholders.js';
import { cx, eventPath, formatLabel, langList, priceLabel } from '../../../components/_utils.js';
import { BRANDS } from '../../../data/brands.js';
import { dateFormat, formatDate } from '../../../lib/format.js';
import { useLang } from '../../../lib/i18n.jsx';

const SEATS = {
  available: ['Seats available', 'இடங்கள் உள்ளன'],
  few: ['Few seats left', 'சில இடங்களே உள்ளன'],
  full: ['Full · join the waitlist', 'நிரம்பியது · காத்திருப்புப் பட்டியலில் சேருங்கள்'],
};

function dateParts(iso, lang) {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  const opts = { timeZone: 'Asia/Kolkata', numberingSystem: 'latn' };
  return {
    day: dateFormat(lang, { ...opts, day: 'numeric' }).format(d),
    month: dateFormat(lang, { ...opts, month: 'short' }).format(d),
    year: dateFormat(lang, { ...opts, year: 'numeric' }).format(d),
  };
}

// "[number]", "To be confirmed": nothing to show as a place (same rule as EventCard).
const isPh = (s) => typeof s === 'string' && /^\[.*\]$|^to be confirmed$/i.test(s.trim());

export default function EventRow({ event: e, headingLevel = 3, muted = false }) {
  const { t, lang, pick, localePath } = useLang();
  if (!e) return null;
  const H = `h${Math.min(Math.max(Number(headingLevel) || 3, 2), 6)}`;
  const dateTbc = e.dateConfirmed === false || !e.date;
  const dp = e.date ? dateParts(e.date, lang) : null;
  const past = e.status === 'past';
  const outcome = Array.isArray(e.outcomes) && e.outcomes.length ? e.outcomes[0] : null;
  const city = pick(e, 'city');
  const district = pick(e, 'district');
  const dateLabel = pick(e, 'dateLabel');
  const priceNote = pick(e, 'priceNote');
  const summary = pick(e, 'summary');
  const placeText = [city, district && district !== city ? district : null].filter((s) => s && !isPh(s)).join(', ');
  const brand = e.brand && BRANDS[e.brand] ? BRANDS[e.brand] : null;

  // Date block: the same strings as the card's date item (day + month, "TBC" + year, year + "Held").
  let date = null;
  if (dp && !dateTbc) {
    date = (
      <time className="ev-row__date" dateTime={e.date} aria-label={formatDate(e.date, undefined, lang)}>
        <span className="ev-row__day">{dp.day}</span>
        <span className="ev-row__month">
          {dp.month} {dp.year}
        </span>
      </time>
    );
  } else if (dp && dateTbc && past) {
    date = (
      <span className="ev-row__date" aria-hidden="true">
        <span className="ev-row__day">{dp.year}</span>
        <span className="ev-row__month">{t('Held', 'நடந்தது')}</span>
      </span>
    );
  } else if (dp && dateTbc) {
    date = (
      <span className="ev-row__date ev-row__date--tbc" aria-hidden="true">
        <span className="ev-row__day">{t('TBC', 'விரைவில்')}</span>
        <span className="ev-row__month">{dp.year}</span>
      </span>
    );
  }

  const cta = past
    ? t('See the recap', 'சுருக்கத்தைப் பாருங்கள்')
    : e.seats === 'full'
      ? t('Join the waitlist', 'காத்திருப்புப் பட்டியலில் சேருங்கள்')
      : t('Register', 'பதிவு செய்யுங்கள்');

  const facts = [
    dateTbc && dateLabel && !isPlaceholderText(dateLabel) ? (
      <li key="dl" className="ev-row__date-label">
        <InlineMarks text={dateLabel} />
      </li>
    ) : null,
    e.format ? <li key="f">{formatLabel(e.format, lang)}</li> : null,
    e.language ? <li key="l">{langList(e.language, lang)}</li> : null,
    e.price ? (
      <li key="p">
        {priceLabel(e.price, lang)}
        {priceNote && !isPlaceholderText(priceNote) ? <> · <InlineMarks text={priceNote} /></> : null}
      </li>
    ) : null,
    !past && e.seats && SEATS[e.seats] ? (
      <li key="s" className={`ev-row__seats ev-row__seats--${e.seats}`}>
        {t(SEATS[e.seats][0], SEATS[e.seats][1])}
      </li>
    ) : null,
  ].filter(Boolean);

  return (
    <article className={cx('ev-row', past && 'ev-row--past', muted && 'ev-row--muted')} data-brand={e.brand || undefined}>
      <div className="ev-row__when">{date}</div>
      <div className="ev-row__main">
        {(brand || past) && (
          <p className="ev-row__kicker">
            {brand && <span className="ev-row__brand">{brand.name}</span>}
            {past && <Badge kind="status" status="past" />}
          </p>
        )}
        <H className="ev-row__title">
          <Link className="ev-row__link" to={localePath(eventPath(e))} draggable="false">
            <span className="ev-row__title-text">{pick(e, 'title')}</span>
          </Link>
        </H>
        {summary && !isPlaceholderText(summary) && (
          <p className="ev-row__summary">
            <InlineMarks text={summary} />
          </p>
        )}
        {facts.length > 0 && <ul className="ev-row__facts">{facts}</ul>}
        {past && outcome && <Stat metric={outcome} variant="compact" />}
      </div>
      <div className="ev-row__side">
        {placeText && (
          <p className="ev-row__place">
            <MapPin size={16} aria-hidden="true" />
            <span>
              <InlineMarks text={placeText} />
            </span>
          </p>
        )}
        <span className="ev-row__cta" aria-hidden="true">
          <span className="ev-row__cta-label">{cta}</span>
          <svg className="ev-row__arrow" viewBox="0 0 16 16" width="16" height="16" focusable="false">
            <path d="M2 8h11M9 4l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </div>
    </article>
  );
}
