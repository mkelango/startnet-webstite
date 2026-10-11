import { Dot } from './Dot.jsx';

const TAMIL = /[\u0B80-\u0BFF]/;

/**
 * Headline helper (DESIGN-v2 2.4 / 3.15 / 3.19): wraps ONE whole word of a Latin headline in <em> (the Instrument
 * Serif accent) and, when the string already ends with a full stop, renders that stop as the red <Dot/>.
 * Never adds or removes characters: the visible text is unchanged. Tamil text is returned without an accent.
 *   accentHeadline('Build what is next.', { accentWord: 'Build' })
 * Non-string input is returned unchanged.
 */
export function accentHeadline(text, { accentWord, dot = true, emClassName } = {}) {
  if (typeof text !== 'string') return text;
  const endsWithStop = dot && /[^.]\.$/.test(text.trim());
  const body = endsWithStop ? text.trim().slice(0, -1) : text;
  let node = body;
  if (accentWord && !TAMIL.test(body)) {
    const esc = accentWord.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const m = new RegExp(`(^|[^\\p{L}\\p{N}])(${esc})(?=$|[^\\p{L}\\p{N}])`, 'u').exec(body);
    if (m) {
      const start = m.index + m[1].length;
      node = (
        <>
          {body.slice(0, start)}
          <em className={emClassName}>{m[2]}</em>
          {body.slice(start + m[2].length)}
        </>
      );
    }
  }
  if (!endsWithStop) return node;
  return (
    <>
      {node}
      <Dot />
    </>
  );
}

export default accentHeadline;
