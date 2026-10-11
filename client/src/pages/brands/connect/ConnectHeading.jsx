import { Dot, SectionHeader } from '../../../components';
import './ConnectHeading.css';

/** Section heading for Connect pages. A trailing full stop in `title` renders as <Dot /> (set in the text colour on
 *  brand pages: brandPage.css keeps red to the h1 stop). */
export function DotTitle({ text }) {
  if (typeof text !== 'string') return text;
  return text.endsWith('.') ? <>{text.slice(0, -1)}<Dot /></> : text;
}

/**
 * The foundation SectionHeader (DESIGN-v2 3.8: dot label, h2, lede in 40ch, 8/4 action on the title's baseline,
 * 0/60/120/180ms choreography) with the Connect title treatment. `align="center"` is passed through.
 */
export default function ConnectHeading({ id, eyebrow, title, lede, action, as = 'h2', align = 'left' }) {
  return (
    <SectionHeader
      className="connect-heading"
      as={as}
      align={align}
      id={id}
      eyebrow={eyebrow}
      title={<DotTitle text={title} />}
      lede={lede}
      action={action}
    />
  );
}
