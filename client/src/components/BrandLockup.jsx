import { BRANDS } from '../data/brands.js';
import { Logo } from './Logo.jsx';
import { cx } from './_utils.js';
import './BrandLockup.css';

/** "StartNet." + descriptor in the brand accent (Book 3 §2.2). Masterbrand when brand is null. */
export function BrandLockup({ brand = null, size = 'md', reversed = false, className }) {
  const b = brand ? BRANDS[brand] : null;
  if (!b) return <Logo size={size} reversed={reversed} className={className} />;
  return (
    <span
      className={cx('brand-lockup', `brand-lockup--${size}`, reversed && 'brand-lockup--reversed', className)}
      data-brand={brand}
      role="img"
      aria-label={b.name}
    >
      <Logo size={size} reversed={reversed} />
      {/* A space in the text (not rendered between flex items) so the lock-up reads "StartNet Vibe", not
          "StartNetVibe", for label-in-name checks on links that wrap it (WCAG 2.5.3). */}
      {' '}
      <span className="brand-lockup__descriptor" aria-hidden="true">
        {b.descriptor}
      </span>
    </span>
  );
}

export default BrandLockup;
