import { useLang } from '../lib/i18n.jsx';
import { formatDateShort, formatDate } from '../lib/format.js';
import { Card } from './Card.jsx';
import { Badge } from './Badge.jsx';
import { InlineMarks } from './InlineMarks.jsx';
import { metaText } from './_placeholders.js';
import { ctaLabelFor, cx, formatLabel, hashString, langList, priceLabel } from './_utils.js';
import './ProgrammeCard.css';

// PnP programme cards (SPEC §4.6): a 3:2 photo from the brand's library pool (ArtImage picks a free one per page,
// the same in the prerender and the app). No caption chip on card media.
const CARD_SIZES = '(min-width: 1280px) 400px, (min-width: 768px) 50vw, 92vw';

/** The card's default media: a warm mono library photo for the programme's brand (Programmes.jsx passes the same). */
export const programmeCardArt = (p, seed) => ({
  variant: 'grid',
  brand: (p && p.brand) || undefined,
  seed: seed ?? (hashString((p && (p.slug || p.title)) || '') % 997) + 1,
  alt: '',
  noCaption: true,
  sizes: CARD_SIZES,
});

// A price note that reads as a short qualifier ("By selection") joins the meta line; sentences stay on the page.
const SHORT_NOTE = 32;

/**
 * Programme card (Book 3 C23, docs/redesign/SPEC.md §4.6, the PnP programme card): 3:2 media at 16px on top, status
 * chip + brand chip, title (--text-h3, 2 lines), a short summary, then one meta line (stage · format · language ·
 * price · apply-by; values that still hold a register mark are left out) and the CTA. Unframed on Paper, framed on
 * Bone grounds. `art` (ArtImage props or a node) replaces the default photo; `art={false}` makes a text-only card.
 * `artRatio` changes the ratio.
 */
export function ProgrammeCard({ programme, headingLevel = 3, className, art, artRatio = '3/2' }) {
  const { t, lang, pick } = useLang();
  if (!programme) return null;
  const p = programme;
  const media = art === false ? null : art || programmeCardArt(p);
  const note = metaText(pick(p, 'priceNote'));
  const duration = metaText(pick(p, 'duration'));
  const closed = p.status === 'closed';
  const stage = p.stageEntry && p.stageExit ? `${p.stageEntry} → ${p.stageExit}` : p.stageEntry || p.stageExit;
  const languages = (Array.isArray(p.languages) ? p.languages : p.languages ? [p.languages] : []).filter((l) => metaText(l));
  const price = p.price && metaText(priceLabel(p.price, lang)) ? (
    <>
      {priceLabel(p.price, lang)}
      {note && note.length <= SHORT_NOTE ? <> · <InlineMarks text={note} /></> : null}
    </>
  ) : null;

  // One meta line (PnP): each fact keeps its label for screen readers; separators sit between present values.
  const facts = [
    stage && (
      <span key="stage" className="programme-card__fact">
        <span className="visually-hidden">{t('Stage', 'நிலை')}: </span>
        <span className="programme-card__stage" aria-label={stage.replace('→', t('to', 'முதல்'))}>
          {stage}
        </span>
      </span>
    ),
    p.format && (
      <span key="format" className="programme-card__fact">
        <span className="visually-hidden">{t('Format', 'வடிவம்')}: </span>
        {formatLabel(p.format, lang)}
        {duration ? ` · ${duration}` : ''}
      </span>
    ),
    languages.length > 0 && (
      <span key="lang" className="programme-card__fact">
        <span className="visually-hidden">{t('Language', 'மொழி')}: </span>
        {langList(languages, lang)}
      </span>
    ),
    price && (
      <span key="price" className="programme-card__fact">
        <span className="visually-hidden">{t('Price', 'கட்டணம்')}: </span>
        {price}
      </span>
    ),
    p.applyBy && !closed && (
      <span key="by" className="programme-card__fact">
        {t('Apply by', 'விண்ணப்பக் கடைசி நாள்')}{' '}
        <time dateTime={p.applyBy} title={formatDate(p.applyBy, undefined, lang)}>
          {formatDateShort(p.applyBy, lang)}
        </time>
      </span>
    ),
  ].filter(Boolean);

  return (
    <Card
      to={p.slug ? `/programmes/${p.slug}` : undefined}
      brand={p.brand}
      className={cx('programme-card', closed && 'programme-card--closed', className)}
      headingLevel={headingLevel}
      art={media}
      ratio={media ? artRatio : undefined}
      badges={
        <>
          {p.status && <Badge kind="status" status={p.status} />}
          {p.brand && <Badge kind="brand" brand={p.brand} />}
        </>
      }
      title={pick(p, 'title')}
      body={pick(p, 'summary')}
      meta={facts.length ? <p className="programme-card__facts">{facts}</p> : null}
      cta={closed ? t('Notify me', 'எனக்குத் தெரிவிக்கவும்') : ctaLabelFor(p.ctaLabel, p.ctaLabelTa, lang, t('View programme', 'திட்டத்தைப் பாருங்கள்'))}
    />
  );
}

export default ProgrammeCard;
