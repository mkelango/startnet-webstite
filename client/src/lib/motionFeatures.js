import { createElement } from 'react';
import { LazyMotion } from 'framer-motion';

/*
 * framer-motion feature bundle for `m` components (F-19). The kit uses `m.*` instead of `motion.*`
 * so the full bundle (drag, layout projection) stays out of the entry chunk.
 *
 * F-33: the bundle (domAnimation) is never imported statically. It loads as its own chunk — the same chunk the
 * shell's domMax bundle builds on, so nothing is downloaded twice — the first time a kit component that animates
 * with framer-motion mounts. Until it arrives, `m` elements render their `initial` state, exactly as the shell's
 * own async <LazyMotion> already behaves. Once loaded it is passed synchronously, so later mounts animate at once.
 *
 * `loadMotionFeatures` (also the default export) can be passed straight to LazyMotion:
 * <LazyMotion features={loadMotionFeatures}>. Do not set `strict` on LazyMotion: page files that still import
 * `motion` keep working.
 */
let bundle = null;
let pending = null;

export function loadMotionFeatures() {
  if (bundle) return Promise.resolve(bundle);
  if (!pending) {
    pending = import('./motionBundle.js').then(
      (mod) => (bundle = mod.default),
      (err) => { pending = null; throw err; } // a failed chunk load can be retried by the next mount
    );
  }
  return pending;
}

export default loadMotionFeatures;

/**
 * Kit-local provider: kit components wrap their `m` elements in it so they animate even when no
 * app-level LazyMotion is mounted (tests, isolated renders). Nested LazyMotion providers are fine.
 */
export function MotionFeatures({ children }) {
  return createElement(LazyMotion, { features: bundle || loadMotionFeatures }, children);
}
