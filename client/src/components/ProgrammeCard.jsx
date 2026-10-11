import { useLang } from '../lib/i18n.jsx';
import { formatDateShort, formatDate } from '../lib/format.js';
import { Card } from './Card.jsx';
import { Badge } from './Badge.jsx';
import { InlineMarks } from './InlineMarks.jsx';
import { isPlaceholderText } from './_placeholders.js';
import { ctaLabelFor, cx, formatLabel, langList, priceLabel } from './_utils.js';
import './ProgrammeCard.css';

/**
 * Programme card (Book 3 C23): brand chip, status chip, title, L → L, format, language, price, apply-by, CTA.
 * Optional `art` (ArtImage props or a node) puts a media at the top of the card, 3:2 by default (AIWO P9); `artRatio`
 * changes the ratio. Without `art` the card is text only, as before.
 */
export function ProgrammeCard({ programme, headingLevel = 3, className, art, artRatio = '3/2' }) {
  const { t, lang, pick } = useLang();
  if (!programme) return null;
  const p = programme;
  const priceNote = pick(p, 'priceNote');
  const duration = pick(p, 'duration');
  const closed = p.status === 'closed';
  const stage = p.stageEntry && p.stageExit ? `${p.stageEntry} → ${p.stageExit}` : p.stageEntry || p.stageExit;
  const price = p.price ? (
    <>
      {priceLabel(p.price, lang)}
      {priceNote && !isPlaceholderText(priceNote) ? <> · <InlineMarks text={priceNote} /></> : null}
    </>
  ) : null;

  return (
    <Card
      to={p.slug ? `/programmes/${p.slug}` : undefined}
      brand={p.brand}
      className={cx('programme-card', closed && 'programme-card--closed', className)}
      headingLevel={headingLevel}
      art={art}
      ratio={art ? artRatio : undefined}
      badges={
        <>
          {p.brand && <Badge kind="brand" brand={p.brand} />}
          {p.status && <Badge kind="status" status={p.status} />}
        </>
      }
      title={pick(p, 'title')}
      body={pick(p, 'summary')}
      meta={
        <dl className="card-facts">
          {stage && (
            <>
              <dt>{t('Stage', 'நிலை')}</dt>
              <dd>
                <span className="programme-card__stage" aria-label={stage.replace('→', t('to', 'முதல்'))}>
                  {stage}
                </span>
              </dd>
            </>
          )}
          {p.format && (
            <>
              <dt>{t('Format', 'வடிவம்')}</dt>
              <dd>
                {formatLabel(p.format, lang)}
                {duration ? ` · ${duration}` : ''}
              </dd>
            </>
          )}
          {p.languages && (
            <>
              <dt>{t('Language', 'மொழி')}</dt>
              <dd>{langList(p.languages, lang)}</dd>
            </>
          )}
          {price && (
            <>
              <dt>{t('Price', 'கட்டணம்')}</dt>
              <dd>{price}</dd>
            </>
          )}
          {p.applyBy && !closed && (
            <>
              <dt>{t('Apply by', 'விண்ணப்பக் கடைசி நாள்')}</dt>
              <dd>
                <time dateTime={p.applyBy} title={formatDate(p.applyBy, undefined, lang)}>
                  {formatDateShort(p.applyBy, lang)}
                </time>
              </dd>
            </>
          )}
        </dl>
      }
      cta={closed ? t('Notify me', 'எனக்குத் தெரிவிக்கவும்') : ctaLabelFor(p.ctaLabel, p.ctaLabelTa, lang, t('View programme', 'திட்டத்தைப் பாருங்கள்'))}
    />
  );
}

export default ProgrammeCard;
