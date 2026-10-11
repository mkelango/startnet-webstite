import { useLang } from '../lib/i18n.jsx';
import { formatDate } from '../lib/format.js';
import { Button } from './Button.jsx';
import { Marquee } from './Marquee.jsx';
import { cx } from './_utils.js';
import './LogoWall.css';

/**
 * Signed partners only (Book 3 C31). Renders nothing when no partner qualifies.
 * Extra optional props: `variant: 'grid'|'marquee'`, `title`, `showLink`.
 */
export function LogoWall({ partners, variant = 'grid', title, showLink = true, className }) {
  const { t, lang } = useLang();
  const list = (Array.isArray(partners) ? partners : []).filter(
    (p) => p && p.name && (!p.agreementStatus || p.agreementStatus === 'signed')
  );
  if (!list.length) return null;

  const since = (p) => (p.since ? formatDate(p.since, { month: 'short', year: 'numeric' }, lang) : '');
  const tiles = list.map((p) => {
    const s = since(p);
    const alt = s ? `${p.name}, ${t('partner since', 'கூட்டாளர், முதல்')} ${s}` : p.name;
    return (
      <figure className="logo-wall__item" key={p.slug || p.name}>
        <div className="logo-wall__logo">
          {p.logo && p.logoPermission !== false ? (
            <img src={p.logo} alt={alt} loading="lazy" decoding="async" />
          ) : (
            <span className="logo-wall__name">{p.name}</span>
          )}
        </div>
        {s && (
          <figcaption className="logo-wall__since">
            {t('since', 'முதல்')} {s}
          </figcaption>
        )}
      </figure>
    );
  });

  return (
    <div className={cx('logo-wall', `logo-wall--${variant}`, className)}>
      {title && <h2 className="logo-wall__title eyebrow">{title}</h2>}
      {variant === 'marquee' ? (
        <Marquee items={tiles} label={title || t('Our partners', 'எங்கள் கூட்டாளர்கள்')} />
      ) : (
        <ul className="logo-wall__grid">
          {tiles.map((tile, i) => (
            <li key={i}>{tile}</li>
          ))}
        </ul>
      )}
      {showLink && (
        <Button variant="tertiary" to="/partner/our-partners" className="logo-wall__link">
          {t('See all partners', 'அனைத்துக் கூட்டாளர்களையும் பாருங்கள்')}
        </Button>
      )}
    </div>
  );
}

export default LogoWall;
