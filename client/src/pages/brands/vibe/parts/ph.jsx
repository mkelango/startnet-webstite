import { Fragment } from 'react';
import { cleanMarks } from '../../../../components/_placeholders.js';

/**
 * Render a Book 2 string, styling every "[…]" marker (placeholder / confirm / proposed) with `.placeholder`.
 * Markers the sentence reads correctly without ("Teams of 2–4 [confirm].") are left out (cleanMarks).
 */
export function ph(text) {
  if (typeof text !== 'string' || !text.includes('[')) return text;
  return cleanMarks(text).split(/(\[[^\]]+\])/g).map((part, i) =>
    part.startsWith('[') && part.endsWith(']')
      ? <span key={i} className="placeholder">{part}</span>
      : <Fragment key={i}>{part}</Fragment>
  );
}
