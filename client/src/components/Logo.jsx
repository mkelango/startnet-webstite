import { cx } from './_utils.js';
import './Logo.css';

/**
 * Masterbrand wordmark "StartNet." with the red full stop as a mark (Book 3 §2.1).
 * [placeholder — existing StartNet master logo files (vector) to be supplied by StartNet]
 */
export function Logo({ reversed = false, size = 'md', mono = false, className }) {
  return (
    <span
      className={cx('logo', `logo--${size}`, reversed && 'logo--reversed', mono && 'logo--mono', className)}
      role="img"
      aria-label="StartNet"
    >
      <span className="logo__word" aria-hidden="true">
        StartNet
      </span>
      <span className="logo__dot" aria-hidden="true" />
    </span>
  );
}

export default Logo;
