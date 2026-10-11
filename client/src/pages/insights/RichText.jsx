// Renders seed copy that carries inline markers: "[A]" / "[B]" / "[C]" become TagChips and
// any other "[...]" segment (placeholder register items) is styled with .placeholder.
import { Fragment } from 'react';
import { TagChip, Placeholder } from '../../components';
import { cleanMarks } from '../../components/_placeholders.js';
import { useLang } from '../../lib/i18n.jsx';
import { statusTa } from './ledgerUtils.js';

export function RichText({ text }) {
  if (text == null) return null;
  // Marks the sentence reads correctly without are left out (cleanMarks); marks that stand in for a word stay.
  const parts = cleanMarks(String(text)).split(/(\[[^\]]+\])/g).filter(Boolean);
  return parts.map((part, i) => {
    const m = /^\[([ABC])\]$/.exec(part);
    if (m) return <TagChip key={i} tag={m[1]} />;
    if (/^\[.*\]$/.test(part)) return <Placeholder key={i}>{part}</Placeholder>;
    return <Fragment key={i}>{part}</Fragment>;
  });
}

// Tamil case suffixes are hyphenated onto Latin words and numerals ("Summit-இல்", "2027-இல்"); a line break at that
// hyphen strands the suffix on its own line, so it becomes a non-breaking hyphen (U+2011).
const keepSuffix = (s) => s.replace(/([A-Za-z0-9])-(?=[஀-௿])/g, '$1‑');

/**
 * A short API label (status, schedule) in the page language: `textTa` when supplied, else a Tamil rendering of
 * the known English shapes (statusTa), else the English marked lang="en" (WCAG 3.1.2).
 */
export function LocalText({ text, textTa }) {
  const { lang } = useLang();
  if (text == null || text === '') return null;
  if (lang !== 'ta') return <RichText text={text} />;
  const ta = textTa || statusTa(text);
  return ta ? <RichText text={keepSuffix(String(ta))} /> : <span lang="en"><RichText text={text} /></span>;
}

export default RichText;
