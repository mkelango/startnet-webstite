// Renders seeded copy that carries Book 2 register marks inline:
// "[placeholder — …]", "[confirm …]", "[proposed …]" → <Placeholder>, and "[A]" / "[B]" / "[C]" → <TagChip>.
import { Fragment } from 'react';
import { Placeholder, TagChip } from '../../../components';
import { cleanMarks } from '../../../components/_placeholders.js';

const MARK = /(\[[^\]]+\])/g;

export function hasMarks(text) {
  return typeof text === 'string' && /\[[^\]]+\]/.test(text);
}

export default function RichText({ text }) {
  if (text == null) return null;
  if (typeof text !== 'string') return text;
  // Marks the sentence reads correctly without are left out (cleanMarks); marks that stand in for a word stay.
  const parts = cleanMarks(text).split(MARK).filter((s) => s !== '');
  return parts.map((part, i) => {
    const tag = /^\[(A|B|C)\]$/.exec(part);
    if (tag) return <TagChip key={i} tag={tag[1]} />;
    if (/^\[[^\]]+\]$/.test(part)) return <Placeholder key={i}>{part}</Placeholder>;
    return <Fragment key={i}>{part}</Fragment>;
  });
}
