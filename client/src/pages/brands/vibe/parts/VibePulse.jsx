import './VibePulse.css';

// The Vibe motif (Book 3 §7): a pulse line (code / energy) that travels and ends in the full stop.
// Decorative only. Two stacked copies: a faint base line, and an accent line revealed with clip-path
// (transform / opacity / clip-path only). Reduced motion: the accent line is simply drawn.
const PATH =
  'M0 60 H120 L140 60 L152 22 L170 98 L186 40 L198 60 H260 L272 60 L282 34 L296 86 L308 60 H380 L392 60 L404 14 L420 104 L434 52 L446 60 H560';

function PulseSvg({ className }) {
  return (
    <svg className={className} viewBox="0 0 600 120" preserveAspectRatio="none" aria-hidden="true" focusable="false">
      <path d={PATH} fill="none" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

/**
 * @param {{ night?: boolean, point?: boolean, className?: string }} props
 * `point` = end in the red full stop. Pass false where the view already has its red point (the dot then uses the accent).
 */
export default function VibePulse({ night = false, point = true, className = '' }) {
  return (
    <div className={`vibe-pulse${night ? ' vibe-pulse--night' : ''}${point ? '' : ' vibe-pulse--accent-dot'} ${className}`} aria-hidden="true">
      <PulseSvg className="vibe-pulse__base" />
      <div className="vibe-pulse__draw">
        <PulseSvg className="vibe-pulse__line" />
      </div>
      <div className="vibe-pulse__spark" />
      <span className="vibe-pulse__dot" />
    </div>
  );
}
