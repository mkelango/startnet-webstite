// Title / meta-description fitting for data-driven templates (programme, event, story, report pages).
// Rules (SEO brief, Oct 2026): rendered title ≤ 60 chars including " · StartNet"; description 120–155 chars,
// phrased as a direct answer. Placeholder text ("[placeholder — …]", "[C]", "[confirm]") never reaches a tag.
import { fullTitle } from '../../../components/Seo.jsx';
import { isPlaceholder } from '../../../lib/seo.js';

export const TITLE_MAX = 60;
export const DESC_MIN = 120;
export const DESC_MAX = 155;

/** Text with every [bracketed] note removed and spacing / dangling punctuation tidied. Empty → ''. */
export function cleanText(s) {
  if (typeof s !== 'string') return '';
  return s
    .replace(/\[[^\]]*\]/g, '')
    .replace(/\(\s*\)/g, '')
    .replace(/\s+\)/g, ')')
    .replace(/\(\s+/g, '(')
    .replace(/\s+([.,;:·])/g, '$1')
    .replace(/([:;,])\s*\./g, '.')
    .replace(/·\s*\./g, '.')
    .replace(/\s{2,}/g, ' ')
    .replace(/^[\s·,;:.-]+|[\s·,;:-]+$/g, '')
    .trim();
}

/** A real (non-placeholder) cleaned string, or undefined. Bracketed notes inside real text are removed. */
export const realText = (s) => {
  if (typeof s !== 'string') return undefined;
  const c = cleanText(s);
  if (!c || c.length < 2 || isPlaceholder(c)) return undefined;
  return c;
};

/** First candidate whose rendered title fits in 60 chars; otherwise the last one cut at a word boundary. */
export function fitTitle(...candidates) {
  const list = candidates.flat().map((c) => (typeof c === 'string' ? c.replace(/\s+/g, ' ').trim() : '')).filter(Boolean);
  for (const c of list) if (fullTitle(c).length <= TITLE_MAX) return c;
  const last = list[list.length - 1] || 'StartNet';
  const room = TITLE_MAX - (fullTitle(last).length - last.length) - 1;
  const cut = last.slice(0, room).replace(/\s+\S*$/, '').replace(/[\s:,·–-]+$/, '');
  return `${cut}…`;
}

const endSentence = (s) => (/[.!?…]$/.test(s) ? s : `${s}.`);
const balanced = (s) => (s.match(/\(/g) || []).length === (s.match(/\)/g) || []).length;

/**
 * Shorten a sentence to `room` chars: drop trailing list items at the last ", " / "; " / ": " that keeps
 * brackets balanced (ending with a full stop), else cut at a word boundary with an ellipsis.
 */
function clauseCut(s, room) {
  if (s.length <= room) return s;
  const head = s.slice(0, room);
  const seps = [];
  head.replace(/[,;:]\s/g, (m, i) => {
    seps.push(i);
    return m;
  });
  for (let k = seps.length - 1; k >= 0; k--) {
    const cut = head.slice(0, seps[k]).replace(/\s+(and|or|with|including|such as|மற்றும்)$/i, '');
    if (cut.length >= 40 && balanced(cut)) return `${cut}.`;
  }
  return `${head.slice(0, room - 1).replace(/\s+\S*$/, '').replace(/[\s,;:·–-]+$/, '')}…`;
}

const norm = (s) => s.toLowerCase().replace(/[.!?…]+$/, '').trim();

/**
 * Description of 120–155 chars from parts, in order. A string part is split into whole sentences; an
 * array part is a list of alternatives (the first that fits is used). Sentences are added while they fit
 * until the text reaches 120 chars; a sentence that does not fit is shortened at a clause boundary.
 * Repeated sentences are skipped and placeholder text is dropped.
 */
export function fitDescription(...parts) {
  const units = [];
  for (const p of parts) {
    if (Array.isArray(p)) {
      const alts = p.map((a) => realText(a)).filter(Boolean).map(endSentence);
      if (alts.length) units.push({ alts });
    } else {
      const r = realText(p);
      if (!r) continue;
      endSentence(r)
        .split(/(?<=[.!?])\s+(?=[A-Z஀-௿"“‘(])/)
        .map((x) => x.trim())
        .filter(Boolean)
        .forEach((x) => units.push({ text: x }));
    }
  }
  let out = '';
  for (const u of units) {
    if (out.length >= DESC_MIN) break;
    const room = DESC_MAX - (out ? out.length + 1 : 0);
    if (u.alts) {
      const pick = u.alts.find((a) => a.length <= room && !norm(out).includes(norm(a)));
      if (pick) out = out ? `${out} ${pick}` : pick;
      continue;
    }
    if (out && norm(out).includes(norm(u.text))) continue;
    if (u.text.length <= room) out = out ? `${out} ${u.text}` : u.text;
    // Tamil clauses do not survive a cut well, so only the opening Tamil sentence is ever shortened.
    else if (!out || (room >= 50 && !/[஀-௿]/.test(u.text))) {
      const cut = clauseCut(u.text, room);
      if (!out || !cut.endsWith('…')) out = out ? `${out} ${cut}` : cut;
    }
  }
  return out || undefined;
}
