import { useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useLang } from '../lib/i18n.jsx';
import { allocateLibraryPhoto, claimPoolPhoto, hintFixedPhoto, markPhotoUsed, releasePhoto, themeFor } from '../data/photos.js';
import { planFor } from '../data/imagePlan.js';
import { ALL_KINDS, CARD_KINDS, HERO_KINDS } from '../lib/motion-visuals/registry.js';
import { BRAND_ACCENTS } from '../lib/motion-visuals/palette.js';
import { cx, hashString, rng } from './_utils.js';
import { MotionVisual } from './MotionVisual.jsx';
import { snapshotPending } from '../lib/handover.js';
import './ArtImage.css';

/**
 * IMAGE PLAN (data/imagePlan.js, docs/IMAGE-PLAN.md) decides first: planFor(path, slot props) returns
 *   undefined  no plan for this slot → the DECORATIVE_PHOTOS behaviour below (photo / photoPool props);
 *   null       'motion' → the animated MotionVisual, no photo, no library pick;
 *   object     the curated manifest photo → shown even with DECORATIVE_PHOTOS off (it overrides photo / photoPool).
 * The plan never touches galleries (`documentary` / `noCaption`) or portraits unless a route entry names the slot.
 * `plan={false}` opts a slot out (site chrome such as the mega-menu cards); `curated` marks a caller-chosen photo that
 * is content, not decoration (the mega-menu feature photos), so it shows with DECORATIVE_PHOTOS off.
 *
 * DECORATIVE_PHOTOS: the one switch for photographs in decorative slots (user decision, Oct 2026).
 *   false (now): every hero / card / section slot shows an animated MotionVisual (Canvas 2D: gradient light, flowing
 *          lines, orbits…) instead of a library or slot photo. Real photographs stay only where the photo IS the
 *          content: event galleries ("From the room": ArtImage with `documentary`, or `noCaption` as EventGallery
 *          passes it), people portraits (variant "portrait"), and VideoFeature posters (which do not use ArtImage).
 *   true:  restores the previous behaviour (slot photos, then the themed library) with no other change; the photo
 *          files, photos.manifest.json and data/photos.js are untouched. VITE_DECORATIVE_PHOTOS=true also flips it.
 */
export const DECORATIVE_PHOTOS =
  (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_DECORATIVE_PHOTOS === 'true') || false;

/*
 * Which motion visual a slot shows (deterministic per page):
 * - a hero (`priority`) takes one of HERO_KINDS from its page path + variant + seed, so heroes vary across pages;
 * - every other slot takes the next kind of a page-specific cycle through CARD_KINDS (shuffled by the path, the
 *   hero's kind left out), in the order the slots mount. Consecutive slots on a page therefore never share a kind.
 * - an explicit `kind` that names a motion visual wins.
 * The old ArtImage `variant` names ('network', 'grid', 'dot', 'kolam', 'ladder', 'map') only feed the seed now.
 */
const PAGES = new Map(); // path → { live: Set<slotId>, k, heroKind, cycle }

function pageRecord(path) {
  let p = PAGES.get(path);
  if (!p) {
    const R = rng(hashString(`cycle|${path}`) || 1);
    const cycle = [...CARD_KINDS];
    for (let i = cycle.length - 1; i > 0; i--) {
      const j = Math.floor(R() * (i + 1));
      [cycle[i], cycle[j]] = [cycle[j], cycle[i]];
    }
    p = { live: new Set(), k: hashString(path) % cycle.length, heroKind: null, cycle, last: null, recent: [] };
    PAGES.set(path, p);
  }
  return p;
}

function heroKindFor(path, variant, seed) {
  return HERO_KINDS[(hashString(`${path}|${variant}`) + (Number(seed) || 0)) % HERO_KINDS.length];
}

// A slot avoids the kinds of the last RECENT slots on the page (not only the one before it), so two cards a row or a
// section apart never share a visual (e.g. a featured block and the card grid under it).
const RECENT = 3;

function claimKind(path, slotId, hero, variant, seed) {
  const p = pageRecord(path);
  p.live.add(slotId);
  if (hero) {
    const k = heroKindFor(path, variant, seed);
    p.heroKind = k;
    p.last = k;
    p.recent = [k];
    return k;
  }
  const avoid = p.avoid;
  p.avoid = null;
  const blocked = (k) => k === p.heroKind || k === p.last || p.recent.includes(k) || (avoid && avoid.includes(k));
  let kind = p.cycle[p.k % p.cycle.length];
  let n = 0;
  for (; n < p.cycle.length && blocked(kind); n++) {
    p.k += 1;
    kind = p.cycle[p.k % p.cycle.length];
  }
  // Everything blocked (very short cycle): fall back to "not the hero, not the last one".
  if (n >= p.cycle.length) {
    for (let m = 0; m < p.cycle.length && (kind === p.heroKind || kind === p.last); m++) {
      p.k += 1;
      kind = p.cycle[p.k % p.cycle.length];
    }
  }
  p.k += 1;
  p.last = kind;
  p.recent = [...p.recent, kind].slice(-RECENT);
  return kind;
}

/**
 * For other components that draw their own motion visuals in the page flow (e.g. PulliTimeline): the next slot that
 * claims a kind on this page avoids `kinds`, so the two never sit side by side with the same visual.
 * Returns a release function (call it on unmount).
 */
export function notePageKinds(path, slotId, kinds) {
  const p = pageRecord(path);
  p.live.add(slotId);
  p.avoid = [...kinds];
  p.last = null;
  p.recent = [...kinds].slice(-RECENT);
  return () => releaseKind(path, slotId);
}

function releaseKind(path, slotId) {
  const p = PAGES.get(path);
  if (!p) return;
  p.live.delete(slotId);
  if (!p.live.size) PAGES.delete(path); // next visit starts the cycle afresh (same order every load)
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
  animate = false, // kept for API compatibility: motion visuals always animate (unless reduced motion)
  initials,
  photo: photoProp,
  photoPool: photoPoolProp,
  theme,
  noCaption = false,
  documentary = false,
  kind,
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
  // `photo` undefined: take a photo from the themed library (data/photos.js); `photo` null: keep the art on purpose
  // (people without their own consented photo, past events). Portraits never use the library.
  const slotId = useId();
  const path = basePath || '/';
  // `photoPool` (with `photo` undefined): the first of these not already on the page, e.g. a series' photos for
  // several cards of the same series; when every one is taken, the slot falls back to the library like `photo` undefined.
  // With DECORATIVE_PHOTOS off, only documentary slots (galleries) and portraits keep their photographs.
  // The image plan wins (see the note at the top): a planned photo shows with DECORATIVE_PHOTOS off, a planned
  // 'motion' slot never takes a photo or a library pick. Pure and synchronous, so prerender and browser agree.
  const planned = useMemo(
    () => (plan && !curated ? planFor(path, { slot: slotKey, variant, seed, ratio, documentary, noCaption }) : undefined),
    [plan, curated, path, slotKey, variant, seed, ratio, documentary, noCaption]
  );
  const photoAllowed = curated || DECORATIVE_PHOTOS || documentary || noCaption || variant === 'portrait';
  const photo = planned !== undefined ? planned : photoAllowed ? photoProp : null;
  const photoPool = planned !== undefined ? undefined : photoAllowed ? photoPoolProp : undefined;
  const pooled = photo === undefined && Array.isArray(photoPool) && photoPool.length > 0;
  const poolKey = pooled ? photoPool.map((c) => c && c.key).join('|') : '';
  const poolRef = useRef(photoPool);
  poolRef.current = photoPool;
  const auto = photo === undefined && variant !== 'portrait';
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
  const isPortrait = variant === 'portrait';
  const showVisual = !pic && !isPortrait;
  const explicitKind = kind && ALL_KINDS.includes(kind) ? kind : null;

  // Server / prerender: the visual renders at once from props (its markup is the static gradient fallback).
  // Client: before first paint, read the slot's context (night surface, brand page) and claim this page's next kind;
  // only DOM attribute reads (closest), so no forced layout.
  const [slot, setSlot] = useState(() =>
    typeof window === 'undefined' && showVisual
      ? { kind: explicitKind || (priority ? heroKindFor(path, variant, seed) : CARD_KINDS[(hashString(`${path}|${variant}`) + (Number(seed) || 0)) % CARD_KINDS.length]), night, brand }
      : null
  );
  useIsoLayoutEffect(() => {
    if (!showVisual) {
      setSlot(null);
      return undefined;
    }
    const el = ref.current;
    const surface = el && el.closest('[data-surface]');
    const ctxNight = night || (surface ? surface.getAttribute('data-surface') === 'night' : false);
    const ctxBrandAttr = !brand && el ? el.closest('[data-brand]')?.getAttribute('data-brand') : null;
    const ctxBrand = brand || (ctxBrandAttr && BRAND_ACCENTS[ctxBrandAttr] ? ctxBrandAttr : undefined);
    const k = claimKind(path, slotId, priority, variant, seed);
    // One red point per composition: only the first motion visual of a section (a hero, a card row, a scroller)
    // draws its point in red; later ones in the same section draw it in the accent. A DOM read only, no layout.
    let quiet = false;
    if (el && !priority) {
      const group = el.closest('section, aside, header, footer, nav, dialog') || el.ownerDocument.body;
      quiet = group.querySelector('.art-image--visual') !== el;
    }
    setSlot({ kind: explicitKind || k, night: ctxNight, brand: ctxBrand, quiet });
    return () => releaseKind(path, slotId);
  }, [showVisual, path, slotId, priority, variant, seed, night, brand, explicitKind]);
  const visualSeed = (Number(seed) || 1) * 7919 + hashString(`${variant}|${path}`);

  const figure = useMemo(() => (isPortrait ? portraitFigure(H) : null), [isPortrait, H]);
  const showInitials = Boolean(initials) && isPortrait && !pic;
  const photoAlt = pic ? (lang === 'ta' && pic.altTa) || pic.alt || alt || '' : '';
  // A filled slot shows the photo's own caption; a "[placeholder — … photo]" caption only marks an empty slot.
  // A motion visual stands in for a photo on purpose, so a "[placeholder — … photo]" marker caption is not shown on it.
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
        showVisual && 'art-image--visual',
        className
      )}
      data-brand={brand || undefined}
      style={{ aspectRatio: `${rw} / ${rh}`, ...style }}
      /* A motion visual is decorative: page `alt` strings were written for the retired pulli/kolam art and would now
         describe something that is not there, so only portraits keep role="img". A visible caption stays readable. */
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
      {showVisual && slot && (
        <MotionVisual
          className="art-image__mv"
          kind={slot.kind}
          seed={visualSeed}
          brand={slot.brand}
          night={slot.night}
          hero={priority}
          quiet={Boolean(slot.quiet)}
        />
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
