// Placeholder-content helpers (internal to the UI kit and pages).
// Approved rule: a visitor-facing block whose main content is only a Book 2 register mark ("[placeholder — …]",
// "[number]", "[date TBC]"…) is hidden until StartNet supplies the real content; it reappears automatically when the
// data arrives. Confidence tags "[A]" / "[B]" / "[C]" are not placeholders.

import { Fragment, isValidElement } from 'react';
import { Placeholder } from './Placeholder.jsx';

const MARK = /\[[^\]]+\]/g;
// Confidence tags, including qualified ones such as "[C, indicative]".
const TAG_MARK = /^\[(?:A|B|C)(?:[,;]\s*[^\]]*)?\]$/;

/** True for a single register mark such as "[placeholder — …]" (not an A/B/C tag). */
export const isMark = (s) => typeof s === 'string' && /^\[[^\]]+\]$/.test(s.trim()) && !TAG_MARK.test(s.trim());

/** True when a string has at least one register mark (A/B/C tags excluded). */
export const hasMark = (s) => typeof s === 'string' && (s.match(MARK) || []).some((m) => !TAG_MARK.test(m));

/**
 * True when the text says nothing once its register marks are removed: "[placeholder — …]", "[placeholder]",
 * "[number] [date]". Empty / null text is "missing", not a placeholder, and returns false.
 */
export function isPlaceholderText(s) {
  if (typeof s !== 'string' || !s.trim() || !hasMark(s)) return false;
  return s.replace(MARK, (m) => (TAG_MARK.test(m) ? m : '')).replace(/[\s.,;:·—–\-()]/g, '') === '';
}

/**
 * True for an answer / value that is only a label and a mark: "Fee: [placeholder — …]." (or only marks).
 * Used to hide FAQ answers and fact lines that say nothing yet.
 */
export const isPlaceholderAnswer = (s) =>
  isPlaceholderText(s) || (typeof s === 'string' && /^[^.!?:[\]]{1,40}:\s*(?:\[[^\]]+\]\s*)+\.?$/.test(s.trim()) && hasMark(s));

/** Text with no real content: missing, or only register marks. */
export const isBlankOrPlaceholder = (s) => s == null || (typeof s === 'string' && (!s.trim() || isPlaceholderText(s)));

/**
 * True when a rendered value says nothing but a register mark: a placeholder string, a <Placeholder>, a
 * <span className="placeholder">, or a fragment / array of those (blank strings ignored).
 */
export function isPlaceholderNode(v) {
  if (v == null || v === false || v === true) return true;
  if (typeof v === 'string') return !v.trim() || isPlaceholderText(v);
  if (typeof v === 'number') return false;
  if (Array.isArray(v)) return v.length > 0 && v.every(isPlaceholderNode) && v.some((x) => x != null && x !== false && !(typeof x === 'string' && !x.trim()));
  if (!isValidElement(v)) return false;
  if (v.type === Placeholder) return v.props.children == null || v.props.children === '' || isPlaceholderNode(v.props.children);
  if (typeof v.type === 'string' && /(^|\s)placeholder(\s|$)/.test(v.props.className || '')) return true;
  if (v.type === Fragment) return isPlaceholderNode(v.props.children);
  // Text renderers that declare which prop carries their text (InlineMarks: `text`).
  if (v.type && v.type.placeholderTextProp) return isPlaceholderText(v.props[v.type.placeholderTextProp]);
  return false;
}

/** Seeded founder story with no real story yet (stories.json `placeholder: true`, or a title that is only a mark). */
export const isPlaceholderStory = (s) => !s || s.placeholder === true || isPlaceholderText(s.title);

/** Person whose name has not been supplied ("[placeholder — to be supplied by StartNet]"). */
export const isPlaceholderPerson = (p) => !p || p.placeholder === true || isBlankOrPlaceholder(p.name);

/** Metric with no value yet (Stat would render "[placeholder]"). */
export const isPlaceholderMetric = (m) => !m || m.value === null || m.value === undefined || m.value === '' || isPlaceholderText(String(m.value));

/** Published stories only. Accepts anything; always returns an array. */
export const realStories = (list) => (Array.isArray(list) ? list.filter((s) => !isPlaceholderStory(s)) : []);

/** Named people only. */
export const realPeople = (list) => (Array.isArray(list) ? list.filter((p) => !isPlaceholderPerson(p)) : []);

/** Metrics with a real value only (each keeps its own confidence tag). */
export const realMetrics = (list) => (Array.isArray(list) ? list.filter((m) => m && !isPlaceholderMetric(m)) : []);

/** List items whose main text field(s) are real, e.g. realItems(faqs, 'a') or realItems(cards, ['title', 'body']). */
export function realItems(list, fields) {
  if (!Array.isArray(list)) return [];
  const keys = Array.isArray(fields) ? fields : [fields];
  return list.filter((x) => {
    if (x == null) return false;
    if (typeof x === 'string') return !isPlaceholderText(x);
    return !keys.some((k) => isPlaceholderText(typeof x[k] === 'string' ? x[k] : undefined));
  });
}

/* ------------------------------------------------------------------ */
/* Inline marks inside real sentences.                                 */
/* ------------------------------------------------------------------ */

// Text that cannot end a phrase: a dropped mark after it would leave the sentence broken, so the mark stays.
const DANGLING_END =
  /(?:[:(₹$#@&/+=–—-]|\b(?:a|an|the|for|at|on|in|into|by|of|from|to|with|since|until|till|before|after|via|per|as|than|about|around|under|over|and|or|is|are|was|were|be|opens|closes|starts|ends|between|is due))\s*$/i;
// Notes that stand in for a missing value (dropping them only works when a date is already given).
const SLOT_NOTE = /^(?:number|year|date|dates|date range|name|names|venue|email|phone|address|link|url|amount|figure|count|time|எண்|தேதி|ஆண்டு)\b/i;
const VERIFY_NOTE = /\bconfirm|\bTBC\b|\bproposed\b|to be confirmed|உறுதி\s?செய்|முன்மொழிவு/i;
const DATE_NOTE = /\bdates?\b|\bTBC\b|\bedition\b|தேதி/i;
const SUPPLY_NOTE = /supplied|வழங்க/i;
const YEAR = /\b(?:19|20)\d{2}\b|(?:19|20)\d{2}(?=-|‑)/;

/** "[placeholder — final fee]" → "final fee"; "[first edition date placeholder]" → "first edition date". */
const noteOf = (mark) =>
  mark
    .slice(1, -1)
    .replace(/^(?:placeholder|இடநிரப்பி|விவரம் வர உள்ளது)\s*(?:[—–-]\s*)?/i, '')
    .replace(/\s*placeholder$/i, '')
    .trim();

/** Can this end-of-clause mark go without breaking the sentence before it? */
function droppableTrailing(mark, before) {
  const note = noteOf(mark);
  if (!note) return true; // bare "[placeholder]" after a complete phrase
  if (VERIFY_NOTE.test(note)) return true; // "[confirm]", "[proposed]", "[date TBC]": the claim stands without it
  const clause = before.split(/[.;:!?]/).pop() || '';
  if (DATE_NOTE.test(note) && YEAR.test(clause)) return true; // "Planned January 2027 [first edition date placeholder]"
  if (SLOT_NOTE.test(note) || SUPPLY_NOTE.test(note)) return false; // "Host colleges [placeholder — to be supplied…]"
  return note.split(/\s+/).length <= 3; // short annotation of a phrase already said: "jury [placeholder — jury]"
}

/**
 * Removes the register marks that can go without breaking the sentence (approved rule: render the sentence without
 * the bracketed part when it reads correctly; otherwise leave the mark). A/B/C tags are kept. Marks that stand in for
 * a word ("as at [date]", "Status: [placeholder]", "Supported by [sponsor placeholder]") stay. A text that is only a
 * placeholder is returned unchanged (callers hide that block).
 */
export function cleanMarks(text) {
  if (typeof text !== 'string' || !hasMark(text) || isPlaceholderText(text)) return text;
  const RE = /\[[^\]]+\]/;
  let out = '';
  let rest = text;
  let changed = false;
  while (rest) {
    const m = RE.exec(rest);
    if (!m) {
      out += rest;
      break;
    }
    out += rest.slice(0, m.index);
    const mark = m[0];
    let after = rest.slice(m.index + mark.length);
    rest = after;
    if (!isMark(mark)) {
      out += mark;
      continue;
    }
    const before = out.replace(/\s+$/, '');
    let drop = false;
    if (!before) {
      // A leading mark that is a sentence of its own: "[placeholder — …]. We highlight…"
      const lead = /^\s*\.\s+(?=\S)/.exec(after);
      if (lead && !TAG_MARK.test((/^\[[^\]]+\]/.exec(after.slice(lead[0].length)) || [''])[0])) {
        drop = true;
        after = after.slice(lead[0].length);
      }
    } else if (/[.!?]$/.test(before)) {
      // A mark that is a sentence of its own: "Fee waivers are available on request. [confirm]"
      if (/^\s*(?:[.!?]|$)/.test(after)) {
        drop = true;
        after = after.replace(/^\s*[.!?]/, '');
      }
    } else if (/:$/.test(before) && /^\s*(?:[.;]|$)/.test(after)) {
      // A short "Label: [mark]." sentence next to real sentences goes as a whole:
      // "…real lives. Childcare at flagship events: [placeholder — …]." → "…real lives."
      const m = /^([\s\S]*[.!?;]\s+|)([^.!?;:[\]]{1,80}):$/.exec(before);
      const tail = after.replace(/^\s*[.;]/, '');
      if (m && m[2].trim().split(/\s+/).length <= 6 && (m[1].trim() || tail.trim())) {
        out = m[1].replace(/\s+$/, '');
        rest = m[1].trim() ? tail : tail.replace(/^\s+/, '');
        changed = true;
        continue;
      }
      out += mark;
      continue;
    } else if (/,\s*(?:at|in|on|by|from|with|via)$/i.test(before) && /^\s*(?:[.;]|$)/.test(after)) {
      // A trailing ", at [venue placeholder]" clause goes as a whole: "…to the industry jury, at [venue]" → "…jury"
      drop = true;
      out = before.replace(/,\s*\S+$/, '');
      rest = after;
      changed = true;
      continue;
    } else if (!DANGLING_END.test(before) && /^(?:\s*$|\s*[.;,)·]|\s*\[)/.test(after)) {
      if (/,$/.test(before) && /^\s*[.;]/.test(after)) {
        // "…figures, [frequency — to be supplied by StartNet]. No spam" → "…figures. No spam"
        drop = true;
        out = before.slice(0, -1);
        rest = after;
        changed = true;
        continue;
      }
      drop = droppableTrailing(mark, before);
    }
    if (drop) {
      changed = true;
      out = before + (after && !/^[\s.,;:!?)]/.test(after) ? ' ' : '');
      rest = after;
    } else {
      out += mark;
    }
  }
  if (!changed) return text;
  return out
    .replace(/[ \t]+([.,;!?)])/g, '$1')
    .replace(/\(\s*\)/g, '')
    .replace(/,\s*([.;])/g, '$1')
    .replace(/\s*·\s*$/, '')
    .replace(/^\s*[.;,·]\s*/, '')
    .replace(/[ \t]{2,}/g, ' ')
    .trim();
}
