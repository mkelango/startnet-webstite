import { cx } from './_utils.js';
import './Dot.css';

/**
 * The red full stop. With `animate`, it drops into place once with the
 * only overshoot on the site (--ease-dot, Book 4 R4 pattern 1).
 * Reduced motion: --dur-5 is 0ms, so it is static from first paint.
 */
export function Dot({ animate = false, delay, className }) {
  return (
    <span
      className={cx('dot', animate && 'dot--land', className)}
      style={animate && delay != null ? { '--dot-delay': `${delay}s` } : undefined}
    >
      .
    </span>
  );
}

export default Dot;
