import { useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useLang } from '../lib/i18n.jsx';
import { allocateLibraryPhoto, claimPoolPhoto, hintFixedPhoto, markPhotoUsed, releasePhoto, themeFor } from '../data/photos.js';
import { planFor, planSlotKey } from '../data/imagePlan.js';
import { cx, hashString } from './_utils.js';
import { snapshotPending } from '../lib/handover.js';
import './ArtImage.css';

/**
 * Every image slot on the site shows a photograph (user decision, 13 Oct 2026: the animated Canvas visuals are retired).
 * What a slot shows, in order:
 *   1. IMAGE PLAN (data/imagePlan.js, docs/IMAGE-PLAN.md): planFor(path, slot props) returns the curated manifest photo
 *      for the slot, or undefined when the plan does not name it. It never touches galleries (`documentary` /
 *      `noCaption`) or portraits unless a route entry names the slot. `plan={false}` opts a slot out (site chrome);
 *      `curated` marks a caller-chosen photo (the mega-menu feature photos).
 *   2. The `photo` prop (a manifest photo), then the first free photo of `photoPool` (e.g. an event's own photos, then
 *      its series, then related StartNet events: data/photos.js eventPool).
 *   3. A photo from the themed library for the slot's brand / page (data/photos.js allocateLibraryPhoto): StartNet's
 *      own photos first, licensed stock after; event pages only ever take StartNet event photos.
 * Portraits (variant "portrait") never take a library photo: a person without a consented photo of their own keeps
 * the neutral head-and-shoulders figure. A photo file that fails to load leaves the slot's plain ground (no art).
 * Photos are graded to grayscale by the pipeline (tools/images/photos.mjs), so the site reads as one set.
 */

/** Kept for callers from the motion-visual era (PulliTimeline): nothing to coordinate now. */
export function notePageKinds() {
  return () => {};
}

const RATIOS = { '16/9': [16, 9], '4/5': [4, 5], '3/2': [3, 2], '1/1': [1, 1], '21/9': [21, 9], '4/3': [4, 3], '5/4': [5, 4] };
const W = 160;
const r2 = (n) => Math.round(n * 100) / 100;

function parseRatio(r) {
  if (RATIOS[r]) return RATIOS[r];
  const m = String(r || '').split('/').map(Number);
  return m.length === 2 && m[0] > 0 && m[1] > 0 ? m : [16, 9];
}

const aspectOf = (r) => {
  const [w, h] = parseRatio(r);
  return w / h;
};
const narrower = (a, b) => (aspectOf(a) <= aspectOf(b) ? a : b);

/*
 * `sizes` describes the slot's width, but object-fit: cover enlarges a photo that is wider than its slot: a 16:9
 * photo in a 4:5 slot is drawn 2.2x the slot width. Scale every size value by that crop factor (capped at 2.5x) so
 * the browser picks a file that stays sharp. Media conditions are left alone. `shape` is the narrowest shape the slot
 * is drawn at (a hero's CSS draws it taller than its `ratio` prop; heroes default to 4:5).
 */
function cropSizes(sizes, pic, shape) {
  const pa = pic.width && pic.height ? pic.width / pic.height : 0;
  const f = pa ? Math.min(2.5, pa / aspectOf(shape)) : 1;
  if (!(f > 1.05) || typeof sizes !== 'string') return sizes;
  const k = Math.round(f * 100) / 100;
  return sizes
    .split(',')
    .map((entry) => {
      const e = entry.trim();
      const m = /^(\(.*\)\s+)?(.+)$/.exec(e);
      if (!m) return e;
      const cond = m[1] || '';
      const v = m[2].trim();
      const simple = /^(\d+(?:\.\d+)?)(vw|px)$/.exec(v);
      const scaled = simple ? `${Math.round(Number(simple[1]) * k)}${simple[2]}` : `calc(${v} * ${k})`;
      return cond + scaled;
    })
    .join(', ');
}

/** Portrait placeholder (people without a consented photo): a soft head-and-shoulders figure and the point. */
function portraitFigure(H) {
  const minSide = Math.min(W, H);
  const cxp = W / 2;
  const head = minSide * 0.15;
  const hy = H * 0.42;
  const bw = minSide * 0.36;
  const by = hy + head + minSide * 0.08;
  return {
    head: { x: cxp, y: hy, r: head },
    body: `M${r2(cxp - bw)} ${r2(H + 2)} L${r2(cxp - bw)} ${r2(by + bw)} A${r2(bw)} ${r2(bw)} 0 0 1 ${r2(cxp + bw)} ${r2(by + bw)} L${r2(cxp + bw)} ${r2(H + 2)} Z`,
    point: { x: cxp + head * 0.92, y: hy - head * 0.92, r: Math.max(2.4, minSide * 0.03) },
  };
}

const useIsoLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;

export function ArtImage({
  variant = 'grid',
  brand,
  ratio = '16/9',
  label,
  alt,
  night = false,
  seed = 1,
  // eslint-disable-next-line no-unused-vars
  animate = false, // kept for API compatibility (the retired motion visuals)
  initials,
  photo: photoProp,
  photoPool: photoPoolProp,
  theme,
  noCaption = false,
  documentary = false,
  // eslint-disable-next-line no-unused-vars
  kind, // kept for API compatibility (the retired motion visuals)
  slot: slotKey,
  plan = true,
  curated = false,
  sizes = '100vw',
  cropRatio,
  priority = false,
  className,
  style,
}) {
  const { lang, basePath } = useLang();
  const [photoFailed, setPhotoFailed] = useState(false);
  // Snapshot hand-over: React sets an <img>'s src before the <img> is inside its <picture>, so the browser would first
  // fetch the JPEG fallback instead of reusing the WebP the snapshot already shows (a blank frame at the swap when the
  // cache is cold). While the live copy renders behind the snapshot, the sources are set one commit later, once
  // the <img> is in place (still before paint).
  const [deferSrc, setDeferSrc] = useState(() => typeof window !== 'undefined' && snapshotPending());
  useIsoLayoutEffect(() => { if (deferSrc) setDeferSrc(false); }, []); // eslint-disable-line react-hooks/exhaustive-deps
  // `photo` undefined or null: take a photo from the themed library (data/photos.js). Portraits never use the library.
  const slotId = useId();
  const path = basePath || '/';
  // The image plan wins (see the note at the top). Pure and synchronous, so prerender and browser agree.
  const planned = useMemo(
    () => (plan && !curated ? planFor(path, { slot: slotKey, variant, seed, ratio, documentary, noCaption }) : undefined),
    [plan, curated, path, slotKey, variant, seed, ratio, documentary, noCaption]
  );
  const isPortrait = variant === 'portrait';
  const photo = planned != null ? planned : photoProp != null ? photoProp : isPortrait ? null : undefined;
  // `photoPool` (no fixed photo): the first of these not already on the page, e.g. an event's photos for several cards
  // of one series; when every one is taken, the slot falls back to the library.
  const photoPool = planned != null ? undefined : photoPoolProp;
  const pooled = photo === undefined && Array.isArray(photoPool) && photoPool.length > 0;
  const poolKey = pooled ? photoPool.map((c) => c && c.key).join('|') : '';
  const poolRef = useRef(photoPool);
  poolRef.current = photoPool;
  const auto = photo === undefined && !isPortrait;
  if (photo && photo.key) hintFixedPhoto(path, photo.key);
  const [libraryPick, setLibraryPick] = useState(null);
  // Reserve photos only for slots that are really on the page (runs before paint, so no art flash).
  useIsoLayoutEffect(() => {
    if (photo && photo.key) {
      markPhotoUsed(path, photo.key);
      return () => releasePhoto(path, null, photo.key);
    }
    if (!auto) return undefined;
    const pick = (poolKey && claimPoolPhoto(path, slotId, poolRef.current)) ||
      allocateLibraryPhoto(path, slotId, themeFor({ theme, variant, brand, path }), (Number(seed) || 1) + hashString(`${path}|${variant}`));
    setLibraryPick(pick);
    return () => releasePhoto(path, slotId);
  }, [auto, photo, poolKey, path, slotId, theme, variant, brand, seed]);
  const chosen = photo !== undefined ? photo : auto ? libraryPick : null;
  const pic = chosen && chosen.base && Array.isArray(chosen.widths) && chosen.widths.length && !photoFailed ? chosen : null;
  const ref = useRef(null);
  const [rw, rh] = parseRatio(ratio);
  const H = r2((W * rh) / rw);
  const photoSizes = useMemo(() => (pic ? cropSizes(sizes, pic, cropRatio || (priority ? narrower(ratio, '4/5') : ratio)) : sizes), [pic, sizes, cropRatio, priority, ratio]);
  const figure = useMemo(() => (isPortrait ? portraitFigure(H) : null), [isPortrait, H]);
  const showInitials = Boolean(initials) && isPortrait && !pic;
  const photoAlt = pic ? (lang === 'ta' && pic.altTa) || pic.alt || alt || '' : '';
  // A filled slot shows the photo's own caption; a "[placeholder — … photo]" caption only marks an empty slot, and is
  // not shown while the slot's photo is still being chosen.
  const placeholderLabel = typeof label === 'string' && /\[/.test(label);
  const shownLabel = pic && noCaption
    ? undefined
    : pic
      ? (lang === 'ta' && pic.captionTa) || pic.caption || (placeholderLabel ? undefined : label)
      : !isPortrait && placeholderLabel
        ? undefined
        : label;

  return (
    <div
      ref={ref}
      className={cx(
        'art-image',
        `art-image--${variant}`,
        night && 'art-image--night',
        brand && 'art-image--brand',
        pic && 'art-image--photo',
        className
      )}
      data-brand={brand || undefined}
      data-slot={plan && !curated ? planSlotKey({ slot: slotKey, variant, seed }) : undefined}
      data-photo={pic ? pic.key : undefined}
      style={{ aspectRatio: `${rw} / ${rh}`, ...style }}
      /* Page `alt` strings were written for the retired pulli/kolam art; a photo brings its own alt text, so only
         portraits without a photo keep role="img". A visible caption stays readable. */
      role={isPortrait && !pic && alt ? 'img' : undefined}
      aria-label={isPortrait && !pic && alt ? alt : undefined}
      aria-hidden={!pic && !shownLabel && !(isPortrait && alt) ? 'true' : undefined}
    >
      {pic && (
        <picture className="art-image__picture">
          {pic.formats?.includes('webp') && (
            <source type="image/webp" srcSet={pic.widths.map((w) => `${pic.base}-${w}.webp ${w}w`).join(', ')} sizes={photoSizes} />
          )}
          <img
            className="art-image__photo"
            sizes={photoSizes}
            srcSet={deferSrc ? undefined : (pic.jpgWidths || pic.widths).map((w) => `${pic.base}-${w}.jpg ${w}w`).join(', ')}
            src={deferSrc ? undefined : `${pic.base}-${(pic.jpgWidths || pic.widths)[0]}.jpg`}
            width={pic.width}
            height={pic.height}
            alt={photoAlt}
            loading={priority ? 'eager' : 'lazy'}
            fetchpriority={priority ? 'high' : undefined}
            decoding={priority ? 'sync' : 'async'}
            style={{ '--focus': pic.focus || '50% 50%', '--focus-m': pic.focusMobile || pic.focus || '50% 50%' }}
            onError={() => setPhotoFailed(true)}
          />
        </picture>
      )}
      {figure && !pic && (
        <svg className="art-image__svg" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
          <rect className="art__bg" x="0" y="0" width={W} height={H} />
          {!showInitials && (
            <>
              <g className="art__figure">
                <circle cx={r2(figure.head.x)} cy={r2(figure.head.y)} r={r2(figure.head.r)} />
                <path d={figure.body} />
              </g>
              <circle className="art__point" cx={r2(figure.point.x)} cy={r2(figure.point.y)} r={r2(figure.point.r)} />
            </>
          )}
        </svg>
      )}
      {showInitials && (
        <span className="art-image__initials" aria-hidden="true">
          <span className="art-image__initials-text">
            {initials}
            <span className="art-image__initials-dot" />
          </span>
        </span>
      )}
      {shownLabel && <span className="art-image__label">{shownLabel}</span>}
    </div>
  );
}

export default ArtImage;
