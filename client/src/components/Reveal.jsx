import { Children, isValidElement, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useReducedMotion } from '../hooks/useReducedMotion.js';
import { observeOnce } from './_inview.js';
import { cx } from './_utils.js';
import { snapshotPending } from '../lib/handover.js';
import './Reveal.css';

/*
 * F-33/F-14: Reveal used framer-motion's whileInView, which forced the animation feature bundle into the entry
 * chunk and set up one observer per element. It is now one shared IntersectionObserver plus an inline CSS
 * transition with the same values (fade + rise, 0.48s, ease-enter, same delay/stagger, same viewport margin),
 * applied as inline styles like framer-motion did, so page CSS cascades exactly as before.
 */
/* One motion grammar (AIWO blueprint §3, top-15 #15): blocks rise 8px over 0.4s on --ease-snap (shorter and
   smaller than the old 12px / 0.6s, so it reads calm); media (clip) keeps 0.6s; 60ms stagger capped at 6 items. */
const EASE = 'cubic-bezier(0.2, 0, 0, 1)';
const DURATION = 0.4;
const CLIP_DURATION = 0.6;
const MASK_DURATION = 0.5;
const durationOf = (variant) => (variant === 'clip' ? CLIP_DURATION : variant === 'mask' ? MASK_DURATION : DURATION);
/*
 * V2-K2 fail-safe. A plain in-view observer only fires when an element *intersects* the viewport, so a fast
 * fling under CPU load could carry an element from below the fold to above it between two observer samples
 * and leave it at opacity 0 for good. So:
 *  - the observer's root is stretched far upwards: an element counts as reached once it is in the viewport
 *    (or within 20% of it below the fold) OR anywhere above it. Elements reached while above the viewport (skipped
 *    over, or an #anchor landing below them) jump straight to the final state, no transition;
 *  - a sweep once scrolling settles, and SAFETY_MS after mount, reveals anything in or above the viewport the
 *    observer has not reported yet (late or lost callbacks);
 *  - phase 1 always ends in phase 2 (inline opacity 1, no transition) after delay + duration, well inside
 *    SAFETY_MS. Content never stays at opacity 0.
 */
/*
 * The bottom margin is positive: a block starts its reveal just before it scrolls into view (20% of the viewport
 * below the fold), so at normal reading speed the fade is under way as it appears instead of the block arriving
 * blank and fading in on screen.
 */
const VIEWPORT = { margin: '100000px 0px 20% 0px', amount: 0 };
const SAFETY_MS = 1500;

/*
 * Fast scrolling (a mouse-wheel fling, Lenis glide, End / Page Down): anything reached while the page moves faster
 * than FAST_PX_PER_MS appears at once, with no fade or stagger. Fading blocks in under a fast scroll reads as
 * blank areas popping in. Speed is measured from scroll events (passive) and decays when scrolling stops.
 */
const FAST_PX_PER_MS = 0.6;
let lastScrollY = 0;
let lastScrollT = 0;
let scrollSpeed = 0;
function trackSpeed() {
  const now = performance.now();
  const y = window.scrollY;
  const dt = now - lastScrollT;
  if (dt > 0 && dt < 200) scrollSpeed = Math.abs(y - lastScrollY) / dt;
  else scrollSpeed = 0;
  lastScrollY = y;
  lastScrollT = now;
}
const scrollingFast = () => scrollSpeed > FAST_PX_PER_MS && performance.now() - lastScrollT < 150;
const pending = new Map(); // element -> fire()
let sweepTimer = 0;
let listening = false;

function sweep() {
  sweepTimer = 0;
  const limit = window.innerHeight * 1.2;
  for (const [el, fire] of [...pending]) {
    if (!el.isConnected) { pending.delete(el); continue; }
    const r = el.getBoundingClientRect();
    if ((r.width > 0 || r.height > 0) && r.top < limit) fire();
  }
}

function scheduleSweep(ms) {
  if (typeof window === 'undefined') return;
  clearTimeout(sweepTimer);
  sweepTimer = setTimeout(sweep, ms);
}

const onScrollSettle = () => scheduleSweep(120);

/** Calls reveal(instant) once the element is in or above the viewport; instant = it is entirely above it. */
function watchReveal(el, reveal) {
  if (!el) { reveal(true); return () => {}; }
  let done = false;
  let stopObserver;
  const fire = () => {
    if (done) return;
    done = true;
    pending.delete(el);
    stopObserver?.();
    // Instant (final state, no transition) when the block is already above the viewport, the page is moving fast,
    // or the block is already well inside the viewport when first reported (the page jumped past the reveal line
    // between two samples, e.g. the first wheel tick of a fling).
    const r = el.getBoundingClientRect();
    reveal(r.bottom <= 0 || scrollingFast() || (window.scrollY > 0 && r.top < window.innerHeight * 0.75));
  };
  pending.set(el, fire);
  stopObserver = observeOnce(el, fire, VIEWPORT);
  if (done) return () => {}; // no IntersectionObserver: revealed synchronously
  if (!listening) {
    listening = true;
    for (const type of ['scroll', 'scrollend', 'resize']) window.addEventListener(type, onScrollSettle, { passive: true });
    lastScrollY = window.scrollY;
    lastScrollT = performance.now();
    window.addEventListener('scroll', trackSpeed, { passive: true });
  }
  scheduleSweep(SAFETY_MS);
  return () => {
    done = true;
    pending.delete(el);
    stopObserver();
  };
}
// framer-motion's m[tag] fell back to a div for anything that is not an HTML tag name.
const tagOf = (tag) => (typeof tag === 'string' ? tag : 'div');
const px = (v) => (typeof v === 'number' ? `${v}px` : v);

/** 0 = hidden, 1 = transitioning in, 2 = done (the inline transition is dropped so it never affects hover styles). */
function useRevealed(reduced, delay, duration = DURATION) {
  const ref = useRef(null);
  const [phase, setPhase] = useState(0);
  // Snapshot hand-over: the prerendered copy already shows everything in the first screen at its final state. If the
  // live copy started those items at opacity 0 they would blink out at the swap and fade in again, so items in (or
  // above) the viewport start revealed. #root is still hidden here, and this runs before paint.
  useLayoutEffect(() => {
    if (reduced || !snapshotPending() || !ref.current) return;
    if (ref.current.getBoundingClientRect().top < window.innerHeight) setPhase(2);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (reduced) return undefined;
    if (phase === 0) return watchReveal(ref.current, (instant) => setPhase(instant ? 2 : 1));
    if (phase === 1) {
      const id = setTimeout(() => setPhase(2), ((delay || 0) + duration) * 1000 + 60);
      return () => clearTimeout(id);
    }
    return undefined;
  }, [reduced, phase, delay, duration]);
  return [ref, phase];
}

/**
 * Inline styles for each phase (the end state is opacity 1, transform none, no clip).
 * Every hidden state carries opacity:0 (the prerender strips it), never clip-path alone (DESIGN-v2 3.20).
 */
const CLIP_FROM = 'inset(0 0 12% 0 round 12px)';
const CLIP_TO = 'inset(0 0 0% 0 round 12px)';
/*
 * 'mask' (headlines): the text rises from behind a fixed line at its own bottom edge. The element moves up by its
 * own height while the clip's bottom inset shrinks by the same amount, so the visible window stays put on the page
 * (a line-mask reveal without splitting the text into lines, so it works for any language and for SSR markup).
 * The clip is padded by 0.25em on the other sides so italic accents and descenders are never cut.
 */
const MASK_FROM = 'inset(-0.25em -0.25em 100% -0.25em)';
const MASK_TO = 'inset(-0.25em -0.25em -0.25em -0.25em)';
function revealStyle(phase, y, delay, style, variant) {
  const clip = variant === 'clip';
  if (variant === 'mask') {
    if (phase === 0) return { ...style, opacity: 0, transform: 'translateY(100%)', clipPath: MASK_FROM };
    if (phase === 2) return { ...style, opacity: 1, transform: 'none' };
    const d = `${delay || 0}s`;
    return {
      ...style,
      opacity: 1,
      transform: 'none',
      clipPath: MASK_TO,
      transition: `opacity ${MASK_DURATION * 0.6}s ${EASE} ${d}, transform ${MASK_DURATION}s ${EASE} ${d}, clip-path ${MASK_DURATION}s ${EASE} ${d}`,
    };
  }
  if (phase === 0) {
    return clip
      ? { ...style, opacity: 0, clipPath: CLIP_FROM }
      : { ...style, opacity: 0, transform: `translateY(${px(y)})` };
  }
  if (phase === 2) return clip ? { ...style, opacity: 1 } : { ...style, opacity: 1, transform: 'none' };
  const d = `${delay || 0}s`;
  if (clip) {
    return {
      ...style,
      opacity: 1,
      clipPath: CLIP_TO,
      transition: `opacity ${DURATION}s ${EASE} ${d}, clip-path ${CLIP_DURATION}s ${EASE} ${d}`,
    };
  }
  return {
    ...style,
    opacity: 1,
    transform: 'none',
    transition: `opacity ${DURATION}s ${EASE} ${d}, transform ${DURATION}s ${EASE} ${d}`,
  };
}

/**
 * Fade and rise once on entering the viewport. Reduced motion (and the prerender): static.
 * Props: as, delay (s), y (px, default 8), variant ('rise' | 'clip' for media: inset 12% bottom → 0 + fade, 0.6s |
 * 'mask' for headlines: line-mask rise, 0.5s).
 */
export function Reveal({ as = 'div', delay = 0, y = 8, variant = 'rise', className, style, children, ...rest }) {
  const reduced = useReducedMotion();
  const [ref, phase] = useRevealed(reduced, delay, durationOf(variant));
  if (reduced) {
    const Tag = as;
    return (
      <Tag className={className} style={style} {...rest}>
        {children}
      </Tag>
    );
  }
  const Tag = tagOf(as);
  return (
    <Tag {...rest} ref={ref} className={className} style={revealStyle(phase, y, delay, style, variant)}>
      {children}
    </Tag>
  );
}

const keyOf = (child, i) => (isValidElement(child) && child.key != null ? child.key : i);
// If the caller already passes <li> children to a list, reuse their props instead of nesting <li> in <li>.
const unwrap = (child, ItemTag) =>
  isValidElement(child) && child.type === ItemTag
    ? { props: { ...child.props, children: undefined }, own: child.props.children }
    : { props: {}, own: child };

/** One staggered group item: observes the viewport itself, so items added later still animate in. */
function RevealItem({ as: Tag, delay, y = 8, variant, itemProps, children }) {
  const [ref, phase] = useRevealed(false, delay, durationOf(variant));
  return (
    <Tag
      {...itemProps}
      ref={ref}
      className={cx('reveal-group__item', itemProps.className)}
      style={revealStyle(phase, y, delay, itemProps.style, variant)}
    >
      {children}
    </Tag>
  );
}

/**
 * Children stagger in (cap 6 steps, 60ms; the 7th and later share the 6th delay). Each child is wrapped in an item
 * element (li for ul/ol) that stretches to fill its grid cell. Each item observes the viewport
 * itself, so children added after the group has revealed (e.g. data arriving) still animate in.
 */
export function RevealGroup({ as = 'div', className, stagger = 0.06, y = 8, variant, children, ...rest }) {
  const reduced = useReducedMotion();
  const ItemTag = as === 'ul' || as === 'ol' ? 'li' : 'div';
  const items = Children.toArray(children).filter((c) => c !== null && c !== false);

  if (reduced) {
    const Tag = as;
    return (
      <Tag className={cx('reveal-group', className)} {...rest}>
        {items.map((child, i) => {
          const { props, own } = unwrap(child, ItemTag);
          return (
            <ItemTag {...props} className={cx('reveal-group__item', props.className)} key={keyOf(child, i)}>
              {own}
            </ItemTag>
          );
        })}
      </Tag>
    );
  }

  const Tag = tagOf(as);
  return (
    <Tag {...rest} className={cx('reveal-group', className)}>
      {items.map((child, i) => {
        const { props, own } = unwrap(child, ItemTag);
        return (
          <RevealItem as={ItemTag} itemProps={props} y={y} variant={variant} delay={Math.min(i, 5) * stagger} key={keyOf(child, i)}>
            {own}
          </RevealItem>
        );
      })}
    </Tag>
  );
}

export default Reveal;
