// Shared bits for the series (T04) and edition (T05) pages: bilingual event labels and the edition card.
import { Card, Badge, InlineMarks } from '../../../components';
import { useLang } from '../../../lib/i18n.jsx';
import { isConfirmed, pickLang } from '../../events/parts/eventMeta.js';
import { eventDateRange } from '../../events/parts/eventTime.js';
import { ART_FOR, brandOf, editionPath, seedOf, localizeEvent, enIf } from './seriesData.js';
import { isPlaceholderText as isOnlyPlaceholder } from '../../../components/_placeholders.js';
import { eventPool, PHOTO_SIZES } from '../../../data/photos.js';
import './seriesParts.css';

/** Bilingual labels for event facets (data values stay English; labels follow the page language). */
export function useEventText() {
  const { t, lang } = useLang();
  const FORMAT = { 'in-person': t('In person', 'நேரில்'), online: t('Online', 'ஆன்லைன்'), hybrid: t('Hybrid', 'நேரிலும் ஆன்லைனிலும்') };
  const LANGUAGE = { en: t('English', 'ஆங்கிலம்'), ta: 'தமிழ் (Tamil)', bilingual: t('English & தமிழ்', 'தமிழ் & English') };
  const SEATS = { available: t('Open', 'பதிவு திறந்துள்ளது'), few: t('Few seats left', 'சில இருக்கைகளே உள்ளன'), full: t('Waitlist', 'காத்திருப்புப் பட்டியல்') };
  return {
    t,
    lang,
    enOnly: lang === 'ta' ? 'en' : undefined,
    format: (f) => FORMAT[f] || f || '',
    // A language still to be confirmed ("[to be confirmed]") renders as a placeholder mark, not raw brackets.
    language: (l) => LANGUAGE[l] || (isOnlyPlaceholder(l) ? <InlineMarks text={l} /> : l) || '',
    seats: (s) => SEATS[s] || s || '',
    /** Free / price note (with inline placeholder marks) / Paid. A record with no price on file shows its note. */
    price: (e) => {
      if (!e.price) return <InlineMarks text={e.priceNote || '[placeholder — to be supplied by StartNet]'} />;
      if (e.price === 'free' && !e.priceTBC) return t('Free', 'இலவசம்');
      if (e.priceNote && !isOnlyPlaceholder(e.priceNote)) return <InlineMarks text={e.priceNote} />;
      return e.price === 'free' ? t('Free', 'இலவசம்') : t('Paid', 'கட்டணம் உண்டு');
    },
    /** "Venue, City", "Online", or the district. Values that are only a placeholder are left out. */
    place: (e) => {
      if (e.format === 'online') return FORMAT.online;
      const parts = [e.venue, e.city].filter((p) => p && !isOnlyPlaceholder(p)).filter((p, i, a) => a.indexOf(p) === i);
      const district = e.district && !isOnlyPlaceholder(e.district) ? e.district : '';
      return parts.length ? <InlineMarks text={parts.join(', ')} /> : district ? <InlineMarks text={district} /> : '';
    },
    // Dates in the page language: Tamil month/weekday names (Latin digits) on /ta, and dateLabelTa when supplied.
    when: (e) => {
      if (isConfirmed(e)) return eventDateRange(e.date, e.endDate, lang);
      const label = pickLang(e, 'dateLabel', lang);
      return label && !isOnlyPlaceholder(label) ? <InlineMarks text={label} /> : t('Dates soon', 'தேதிகள் விரைவில்');
    },
    // `lang` for each value above on /ta pages: "en" only when the value has no Tamil (an English fallback); our own labels are translated.
    whenLang: (e) => {
      if (lang !== 'ta') return undefined;
      if (isConfirmed(e)) return enIf(lang, eventDateRange(e.date, e.endDate, lang));
      const label = pickLang(e, 'dateLabel', lang);
      return label && !isOnlyPlaceholder(label) ? enIf(lang, label) : undefined;
    },
    placeLang: (e) => (lang === 'ta' && e.format !== 'online' && (e.venue || e.city || e.district) ? 'en' : undefined),
    priceLang: (e) => (lang === 'ta' && e.price && e.priceNote && !(e.price === 'free' && !e.priceTBC) ? 'en' : undefined),
    /** Register label per Book 2 §5.1 / §14.3. */
    register: (e) => {
      if (e.seats === 'full') return t('Join the waitlist', 'காத்திருப்புப் பட்டியலில் சேருங்கள்');
      if (/register interest/i.test(e.ctaLabel || '')) return t('Register interest', 'ஆர்வத்தைப் பதிவு செய்யுங்கள்');
      if (/register your team/i.test(e.ctaLabel || '')) return t('Register your team', 'உங்கள் குழுவைப் பதிவு செய்யுங்கள்');
      return e.price === 'free' && !e.priceTBC ? `${t('Register', 'பதிவு செய்யுங்கள்')} · ${t('Free', 'இலவசம்')}` : t('Register', 'பதிவு செய்யுங்கள்');
    },
  };
}

/** One edition of a series, linking to its canonical /events/<series>/<edition> page. */
export function EditionCard({ event, headingLevel = 3 }) {
  const x = useEventText();
  const e = localizeEvent(event, x.lang);
  const brand = brandOf(e.brand);
  const past = e.status === 'past';
  return (
    <Card
      to={editionPath(e)}
      brand={brand || undefined}
      headingLevel={headingLevel}
      art={{ variant: ART_FOR[brand] || 'dot', brand: brand || undefined, ratio: '16/9', seed: seedOf(e.slug), alt: '', photoPool: eventPool(event), sizes: PHOTO_SIZES.card }}
      badges={
        <>
          {past ? (
            <Badge kind="status" status="closed">{x.t('Past edition', 'முந்தைய பதிப்பு')}</Badge>
          ) : e.seats ? (
            <Badge kind="status" status={e.seats === 'full' ? 'closed' : e.seats === 'few' ? 'closing' : 'open'}>{x.seats(e.seats)}</Badge>
          ) : (
            <Badge kind="status" status="upcoming">{x.t('Upcoming', 'வரவிருக்கிறது')}</Badge>
          )}
          <Badge kind="type">{x.format(e.format)}</Badge>
        </>
      }
      eyebrow={<span lang={x.whenLang(e)}>{x.when(e)}</span>}
      title={<span lang={enIf(x.lang, e.title)}>{e.title}</span>}
      body={
        <p className="series-card__summary" lang={enIf(x.lang, e.summary)}>
          <InlineMarks text={e.summary} />
        </p>
      }
      meta={
        <dl className="series-card__meta">
          <div>
            <dt>{x.t('Where', 'இடம்')}</dt>
            <dd lang={e.format === 'online' ? undefined : enIf(x.lang, [e.venue, e.city, e.district].filter(Boolean).join(' ') || '—')}>{x.place(e) || '—'}</dd>
          </div>
          <div>
            <dt>{x.t('Price', 'கட்டணம்')}</dt>
            <dd lang={x.priceLang(e) && enIf(x.lang, e.priceNote)}>{x.price(e)}</dd>
          </div>
        </dl>
      }
      cta={past ? x.t('See the recap', 'சுருக்கத்தைப் பாருங்கள்') : x.t('See this edition', 'இந்தப் பதிப்பைப் பாருங்கள்')}
    />
  );
}
