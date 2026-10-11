import { cx } from './_utils.js';
import './Skeleton.css';

/** Skeleton blocks in final geometry with a slow shimmer (client-fetched blocks only). */
export function Skeleton({ height = '1rem', count = 1, radius, className }) {
  const n = Math.max(1, Number(count) || 1);
  const h = typeof height === 'number' ? `${height}px` : height;
  return (
    <div className={cx('skeleton', className)} aria-hidden="true">
      {Array.from({ length: n }, (_, i) => (
        <span
          key={i}
          className="skeleton__block"
          style={{ height: h, borderRadius: radius, width: n > 1 && i === n - 1 ? '72%' : undefined }}
        />
      ))}
    </div>
  );
}

export default Skeleton;
