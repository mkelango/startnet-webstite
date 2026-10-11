import { formatDate } from '../lib/format.js';
import { useLang } from '../lib/i18n.jsx';
import { Reveal } from './Reveal.jsx';
import { cx, isoLike } from './_utils.js';
import './Quote.css';

/** Pull quote (Book 3 C30): <figure><blockquote><figcaption>. Use only with written consent. */
export function Quote({ quote, name, role, place, date, brand, size = 'lg', className }) {
  const { lang } = useLang();
  if (!quote) return null;
  const details = [role, place, isoLike(date) ? formatDate(date, undefined, lang) : date].filter(Boolean).join(' · ');
  return (
    <Reveal as="figure" className={cx('quote', `quote--${size}`, className)} data-brand={brand || undefined} y={12}>
      <span className="quote__mark" aria-hidden="true">
        “
      </span>
      <blockquote className="quote__text">
        {typeof quote === 'string' ? <p>{quote}</p> : quote}
      </blockquote>
      {(name || details) && (
        <figcaption className="quote__cite">
          {name && <span className="quote__name">{name}</span>}
          {details && <span className="quote__details">{details}</span>}
        </figcaption>
      )}
    </Reveal>
  );
}

export default Quote;
