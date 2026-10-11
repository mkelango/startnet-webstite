import { useEffect, useState } from 'react';
import { useReducedMotion } from '../hooks/useReducedMotion.js';
import { accentHeadline } from './_accent.jsx';
import { cx } from './_utils.js';
import './KineticHeadline.css';

/*
 * Headline with the red full stop (DESIGN-v2 3.19). Letters stay still: the words render as plain text.
 * A final "." becomes the red full stop, which lands ONCE PER SESSION (0.48s --ease-dot, 200ms after first paint;
 * flag `sn-dot-landed` in sessionStorage). Later page views, reduced motion and the prerender show the static dot.
 * Accent: `accentWord` (a whole word of the Latin text, case-sensitive) is set in Instrument Serif italic.
 * `accentFirst` (v1) still accents the first word. Never on Tamil.
 */
const FLAG = 'sn-dot-landed';
const TAMIL = /[஀-௿]/;
const LAST_CLUSTER = /\P{M}\p{M}*$/u;
let landedThisLoad = false;

/*
 * Splits a headline body so the stop can be glued to the text before it: an inline-block stop is a line-break
 * opportunity, so the red dot could drop onto a line of its own. The glued part is only the last letter (with its
 * combining marks, so a Tamil syllable stays whole), or the accented word when it is the last word.
 * No characters are added or removed.
 */
function splitForStop(body, word) {
  let m = null;
  if (word && !TAMIL.test(body)) {
    const esc = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    m = new RegExp(`(^|[^\\p{L}\\p{N}])(${esc})(?=$|[^\\p{L}\\p{N}])`, 'u').exec(body);
  }
  if (m && m.index + m[1].length + m[2].length === body.length) {
    const start = m.index + m[1].length;
    return { lead: body.slice(0, start), tail: <em className="kinetic__accent">{m[2]}</em> };
  }
  const g = LAST_CLUSTER.exec(body);
  const cut = g ? g.index : body.length;
  const leadText = body.slice(0, cut);
  const lead = m ? accentHeadline(leadText, { accentWord: word, dot: false, emClassName: 'kinetic__accent' }) : leadText;
  return { lead, tail: body.slice(cut) };
}

function shouldLand() {
  if (typeof window === 'undefined' || landedThisLoad) return false;
  try {
    return !window.sessionStorage.getItem(FLAG);
  } catch {
    return false;
  }
}

export function KineticHeadline({ text, as = 'h1', className, delay = 0, id, accentFirst = false, accentWord, ...rest }) {
  const reduced = useReducedMotion();
  const Tag = as;
  const [land] = useState(() => !reduced && shouldLand());

  useEffect(() => {
    if (!land) return;
    landedThisLoad = true;
    try {
      window.sessionStorage.setItem(FLAG, '1');
    } catch {
      /* storage blocked: the dot simply lands again next time */
    }
  }, [land]);

  if (typeof text !== 'string') {
    return (
      <Tag id={id} className={cx('kinetic', className)} {...rest}>
        {text}
      </Tag>
    );
  }

  const trimmed = text.trim();
  const endsWithStop = /[^.]\.$/.test(trimmed);
  const body = endsWithStop ? trimmed.slice(0, -1) : trimmed;
  let word = accentWord;
  if (!word && accentFirst) {
    const first = body.split(/\s+/)[0];
    if (first && first !== body) word = first;
  }
  if (!endsWithStop) {
    const content = word ? accentHeadline(body, { accentWord: word, dot: false, emClassName: 'kinetic__accent' }) : body;
    return (
      <Tag id={id} className={cx('kinetic', className)} {...rest}>
        {content}
      </Tag>
    );
  }

  const { lead, tail } = splitForStop(body, word);
  return (
    <Tag id={id} className={cx('kinetic', className)} {...rest}>
      {lead}
      <span className="kinetic__end">
        {tail}
        <span
          className={cx('dot', 'kinetic__dot', land && !reduced && 'kinetic__dot--land')}
          style={land && delay ? { animationDelay: `${Math.round(200 + delay * 1000)}ms` } : undefined}
        >
          .
        </span>
      </span>
    </Tag>
  );
}

export default KineticHeadline;
