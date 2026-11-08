import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useLang } from '../lib/i18n.jsx';
import { formatDate } from '../lib/format.js';
import { Button } from './Button.jsx';
import { Marquee } from './Marquee.jsx';
import { Scroller } from './Scroller.jsx';
import { cx } from './_utils.js';
import './LogoWall.css';

/**
 * Signed partners only (Book 3 C31, docs/redesign/SPEC.md §4.8). Renders nothing when no partner qualifies.
 * Extra optional props: `variant: 'grid'|'marquee'|'carousel'`, `title`, `showLink`.
 * - `grid` (default): hairline cell grid, 2 / 3 (768) / 5 (1280), mono Ink logos at 80% → 100% on hover.
 * - `marquee`: the moving strip (Marquee), mono logos at 60%.
 * - `carousel` (NEW, the PnP partners section): a Scroller of logo tiles on the tile ground with the "since" caption
 *   under each; the last tile links to all partners.
 * `allLink` (NEW, optional { label, to }) replaces the "See all partners" link (e.g. community companies → stories).
 * A partner record may carry its own `caption` (e.g. a company's district); otherwise the caption is "since …".
 */
export function LogoWall({ partners, variant = 'grid', title, showLink = true, allLink, className }) {
  const { t, lang, localePath } = useLang();
  const list = (Array.isArray(partners) ? partners : []).filter(
    (p) => p && p.name && (!p.agreementStatus || p.agreementStatus === 'signed')
  );
  if (!list.length) return null;

  const allLabel = allLink?.label || t('See all partners', 'அனைத்துக் கூட்டாளர்களையும் பாருங்கள்');
  const allTo = allLink?.to || '/partner/our-partners';
  const since = (p) => (p.since ? formatDate(p.since, { month: 'short', year: 'numeric' }, lang) : '');
  const tiles = list.map((p) => {
    const s = since(p);
    const alt = s && !p.caption ? `${p.name}, ${t('partner since', 'கூட்டாளர், முதல்')} ${s}` : p.name;
    return (
      <figure className="logo-wall__item" key={p.slug || p.name}>
        <div className="logo-wall__logo">
          {p.logo && p.logoPermission !== false ? (
            <img src={p.logo} alt={alt} loading="lazy" decoding="async" />
          ) : (
            <span className="logo-wall__name">{p.name}</span>
          )}
        </div>
        {p.caption ? (
          <figcaption className="logo-wall__since">{p.caption}</figcaption>
        ) : s && (
          <figcaption className="logo-wall__since">
            {t('since', 'முதல்')} {s}
          </figcaption>
        )}
      </figure>
    );
  });

  let body;
  if (variant === 'marquee') {
    body = <Marquee items={tiles} label={title || t('Our partners', 'எங்கள் கூட்டாளர்கள்')} />;
  } else if (variant === 'carousel') {
    body = (
      <Scroller className="logo-wall__rail" label={title || t('Our partners', 'எங்கள் கூட்டாளர்கள்')} itemWidth="17.5rem">
        {tiles}
        {showLink && (
          <Link key="all" to={localePath(allTo)} className="logo-wall__all">
            <span className="logo-wall__all-label">
              {allLabel}
              <ArrowRight size={18} strokeWidth={1.75} aria-hidden="true" className="logo-wall__all-arrow" />
            </span>
          </Link>
        )}
      </Scroller>
    );
  } else {
    body = (
      <ul className="logo-wall__grid">
        {tiles.map((tile, i) => (
          <li key={i}>{tile}</li>
        ))}
      </ul>
    );
  }

  return (
    <div className={cx('logo-wall', `logo-wall--${variant}`, className)}>
      {title && <h2 className="logo-wall__title eyebrow">{title}</h2>}
      {body}
      {showLink && variant !== 'carousel' && (
        <Button variant="tertiary" to={allTo} className="logo-wall__link">
          {allLabel}
        </Button>
      )}
    </div>
  );
}

export default LogoWall;
