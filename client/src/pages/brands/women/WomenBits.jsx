import './Women.css';

/**
 * Button label with a shorter phone version (< 480px; < 640px for Tamil, which runs ~40% longer), so CTAs
 * stay on one line instead of wrapping around a floating icon (F-63). Only the visible label is exposed
 * to assistive technology (display: none).
 */
export function FitLabel({ long, short }) {
  if (!short || short === long) return long;
  return (
    <>
      <span className="women-fit__long">{long}</span>
      <span className="women-fit__short">{short}</span>
    </>
  );
}

export default FitLabel;
