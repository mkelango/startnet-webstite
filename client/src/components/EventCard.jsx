import { MapPin } from 'lucide-react';
import { useLang } from '../lib/i18n.jsx';
import { dateFormat, formatDate } from '../lib/format.js';
import { Card } from './Card.jsx';
import { Badge } from './Badge.jsx';
import { BRANDS } from '../data/brands.js';
import { Stat } from './Stat.jsx';
import { InlineMarks } from './InlineMarks.jsx';
import { isPlaceholderText } from './_placeholders.js';
import { cx, eventPath, formatLabel, hashString, langList, priceLabel } from './_utils.js';
import { eventPhotoKeys, eventPool, photoFor, PHOTO_SIZES } from '../data/photos.js';
import './EventCard.css';

const VARIANTS = ['network', 'grid', 'map', 'dot', 'kolam'];
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

// "[number]", "To be confirmed": nothing to show as a place.
const isPh = (s) => typeof s === 'string' && /^\[.*\]$|^to be confirmed$/i.test(s.trim());

/** Event card (docs/redesign/SPEC.md §4.6, the PnP event card): 3:2 media with a date chip inset top-left and the
 *  format chip top-right, then the meta row (brand dot · place), title (2 lines), 2-line summary, facts (language,
 *  price), the seats status row and the CTA bottom-left. */
/**
 * The card's photo: the event's own; else one of its series' photos that is not already on the page (so several
 * cards of one series never show the same picture), then a library photo; a series with no photos keeps the art.
 */
function cardPhoto(e) {
  const own = photoFor(eventPhotoKeys(e, eventPath(e)));
  if (own) return { photo: own };
  // The series' photos, then related StartNet events (data/photos.js eventPool); each keeps its own caption.
  const pool = eventPool(e);
  if (pool.length) return { photoPool: pool };
  return { photo: undefined };
}

export function EventCard({ event, headingLevel = 3, className }) {
  const { t, lang, pick } = useLang();
  if (!event) return null;
  const e = event;
  const h = hashString(e.slug || e.title || '');
  // Unconfirmed dates are stored mid-month only for sorting: never show them as a day/month block.
  // The block then reads "TBC" over the year (upcoming) or the year over "Held" (past), and the facts
  // carry the month range from dateLabel.
  const dateTbc = e.dateConfirmed === false || !e.date;
  const dp = e.date ? dateParts(e.date, lang) : null;
  const past = e.status === 'past';
  const outcome = Array.isArray(e.outcomes) && e.outcomes.length ? e.outcomes[0] : null;
  const city = pick(e, 'city');
  const district = pick(e, 'district');
  const dateLabel = pick(e, 'dateLabel');
  const priceNote = pick(e, 'priceNote');
  const placeText = [city, district && district !== city ? district : null].filter((s) => s && !isPh(s)).join(', ');
  const price = e.price ? (
    <>
      {priceLabel(e.price, lang)}
      {priceNote && !isPlaceholderText(priceNote) ? <> · <InlineMarks text={priceNote} /></> : null}
    </>
  ) : null;

  // Date as a plain meta item (same strings as the v1 date block: day + month, "TBC" + year, year + "Held").
  let dateItem = null;
  if (dp && !dateTbc) {
    dateItem = (
      <time className="event-card__date" dateTime={e.date} aria-label={formatDate(e.date, undefined, lang)}>
        <span className="event-card__day">{dp.day}</span> <span className="event-card__month">{dp.month}</span>
      </time>
    );
  } else if (dp && dateTbc && past) {
    // A past event with no confirmed day: "soon"/"TBC" would read as a future date. Show the year it
    // happened and a plain "held"; the facts list still carries dateLabel when there is one.
    dateItem = (
      <span className="event-card__date event-card__date--year" aria-hidden="true">
        <span className="event-card__day">{dp.year}</span> <span className="event-card__month">{t('Held', 'நடந்தது')}</span>
      </span>
    );
  } else if (dp && dateTbc) {
    dateItem = (
      <span className="event-card__date event-card__date--tbc" aria-hidden="true">
        <span className="event-card__day">{t('TBC', 'விரைவில்')}</span> <span className="event-card__month">{dp.year}</span>
      </span>
    );
  }

  const ctaFallback = past
    ? t('See the recap', 'சுருக்கத்தைப் பாருங்கள்')
    : e.seats === 'full'
      ? t('Join the waitlist', 'காத்திருப்புப் பட்டியலில் சேருங்கள்')
      : t('Register', 'பதிவு செய்யுங்கள்');

  // Meta row (one line): brand dot label · place. Separators only between present values. The date sits on the media.
  const kicker = [
    e.brand && BRANDS[e.brand] ? (
      <span key="b" className="event-card__brand" data-brand={e.brand}>
        {BRANDS[e.brand].name}
      </span>
    ) : null,
    past ? <Badge key="s" kind="status" status="past" /> : null,
    placeText ? (
      <span key="p" className="event-card__place">
        <MapPin size={16} strokeWidth={1.75} aria-hidden="true" className="event-card__icon" />
        <InlineMarks text={placeText} />
      </span>
    ) : null,
  ].filter(Boolean);

  // On the media: the date chip (top-left) and the format chip (top-right).
  const overlay = dateItem || e.format ? (
    <>
      {dateItem && <span className="event-card__date-chip">{dateItem}</span>}
      {e.format && <Badge kind="type" className="event-card__format">{formatLabel(e.format, lang)}</Badge>}
    </>
  ) : null;

  return (
    <Card
      variant="media"
      ratio="3/2"
      to={eventPath(e)}
      brand={e.brand}
      className={cx('event-card', past && 'event-card--past', className)}
      headingLevel={headingLevel}
      art={{ variant: VARIANTS[h % VARIANTS.length], seed: h % 997, ratio: '3/2', brand: e.brand, ...cardPhoto(e), sizes: PHOTO_SIZES.card, noCaption: true }}
      mediaOverlay={overlay}
      kicker={kicker.length ? <span className="event-card__kicker">{kicker}</span> : null}
      title={pick(e, 'title')}
      body={pick(e, 'summary') && !isPlaceholderText(pick(e, 'summary')) ? <p className="event-card__summary"><InlineMarks text={pick(e, 'summary')} /></p> : null}
      meta={
        <>
          {((dateTbc && dateLabel && !isPlaceholderText(dateLabel)) || e.language || price) && (
          <ul className="event-card__facts">
            {dateTbc && dateLabel && !isPlaceholderText(dateLabel) && (
              <li className="event-card__date-label">
                <InlineMarks text={dateLabel} />
              </li>
            )}
            {e.language && <li>{langList(e.language, lang)}</li>}
            {price && <li>{price}</li>}
          </ul>
          )}
          {!past && e.seats && SEATS[e.seats] && (
            <p className={cx('event-card__seats', `event-card__seats--${e.seats}`)}>{t(SEATS[e.seats][0], SEATS[e.seats][1])}</p>
          )}
          {past && outcome && <Stat metric={outcome} variant="compact" />}
        </>
      }
      cta={ctaFallback}
    />
  );
}

export default EventCard;
