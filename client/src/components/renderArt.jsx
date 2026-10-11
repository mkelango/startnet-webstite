import { isValidElement } from 'react';
import { ArtImage } from './ArtImage.jsx';

/** Accepts ArtImage props (object) or a ready node; returns a node or null. */
export function renderArt(art, defaults = {}) {
  if (!art) return null;
  if (isValidElement(art)) return art;
  if (typeof art === 'object') return <ArtImage {...defaults} {...art} />;
  return null;
}

export default renderArt;
