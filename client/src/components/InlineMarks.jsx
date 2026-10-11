import { Fragment } from 'react';
import { Placeholder } from './Placeholder.jsx';
import { TagChip } from './TagChip.jsx';
import { cleanMarks } from './_placeholders.js';

const MARK = /(\[[^\]]+\])/g;

/**
 * Renders seeded copy that carries Book 2 register marks inline:
 * "[A]" / "[B]" / "[C]" → <TagChip short>, any other "[…]" → <Placeholder>.
 * Marks the sentence reads correctly without ("Planned January 2027 [first edition date placeholder]",
 * "…on request. [confirm]") are left out (_placeholders.js cleanMarks); marks that stand in for a word stay.
 */
export function InlineMarks({ text }) {
  if (text == null || text === '') return null;
  if (typeof text !== 'string') return text;
  return cleanMarks(text)
    .split(MARK)
    .filter((s) => s !== '')
    .map((part, i) => {
      const tag = /^\[(A|B|C)\]$/.exec(part);
      if (tag) return <TagChip key={i} tag={tag[1]} short />;
      if (/^\[[^\]]+\]$/.test(part)) return <Placeholder key={i}>{part}</Placeholder>;
      return <Fragment key={i}>{part}</Fragment>;
    });
}

// Lets placeholder checks (_placeholders.js isPlaceholderNode) see that <InlineMarks text="[placeholder]" /> says nothing yet.
InlineMarks.placeholderTextProp = 'text';

export default InlineMarks;
