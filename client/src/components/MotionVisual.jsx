import { useEffect, useMemo, useRef, useState } from 'react';
import { fallbackVars, resolvePalette } from '../lib/motion-visuals/palette.js';
import './MotionVisual.css';

/*
 * MotionVisual: an animated Canvas 2D visual for decorative slots (gradient light, flowing lines, orbits…).
 *
 *   <MotionVisual kind="aurora" seed={3} brand="vibe" night hero ratio="16/9" className="…" />
 *
 * - SSR / prerender / no JS: the wrapper's CSS background IS the visual (a soft palette gradient, no dot grids), and
 *   the box keeps the slot ratio (no CLS). Nothing below touches window during render.
 * - After mount the core (lib/motion-visuals/core.js, loaded on demand) inits the variant on first intersection and
 *   the <canvas aria-hidden> fades in once its first frame is painted. Reduced motion (OS or data-motion="reduced")
 *   → one static frame, no loop. Offscreen / hidden tab → paused. dpr capped at 2.
 * - `ratio` ('16/9', '4/5', '1/1', '21/9' or 'w/h'): sets aspect-ratio on the wrapper. Omit it to fill the parent
 *   (width/height 100%), e.g. inside a slot that already reserves its own ratio.
 * - `brand` ('research' | 'vibe' | 'connect' | 'women' | 'x'): the accent; only pass it on that brand's own pages.
 * - `quiet`: the variant's point is drawn in the accent instead of red, for the second and later visuals of one
 *   composition (a card row, a scroller), so the composition keeps ONE red point.
 */

let corePromise = null;
const loadCore = () => (corePromise ||= import('../lib/motion-visuals/core.js'));

function cssRatio(r) {
  if (!r) return undefined;
  const m = String(r).split(/[/:x]/).map((v) => Number(v.trim()));
  return m.length === 2 && m[0] > 0 && m[1] > 0 ? `${m[0]} / ${m[1]}` : undefined;
}

export function MotionVisual({ kind = 'aurora', seed = 1, brand, night = false, hero = false, quiet = false, ratio, className }) {
  const canvasRef = useRef(null);
  const [ready, setReady] = useState(false);
  const palette = useMemo(() => resolvePalette({ brand, night }), [brand, night]);
  const style = useMemo(() => {
    const s = fallbackVars(palette, seed, night);
    const ar = cssRatio(ratio);
    if (ar) s.aspectRatio = ar;
    return s;
  }, [palette, seed, night, ratio]);

  useEffect(() => {
    let alive = true;
    let scene = null;
    setReady(false); // new props → new scene: show the fallback until its first frame (no stale/blank canvas)
    const start = () => {
      loadCore()
        .then(({ createScene }) => {
          if (!alive || !canvasRef.current) return;
          scene = createScene(canvasRef.current, {
            kind,
            seed,
            brand,
            night,
            hero,
            palette: quiet ? { red: palette.accent } : undefined,
            onReady: () => alive && setReady(true),
            onError: () => alive && setReady(false),
          });
        })
        .catch(() => {
          /* chunk failed to load: the CSS fallback stays */
        });
    };
    // The core (and, inside it, the variant) is fetched only once the slot comes within 600px of the viewport, so a
    // page with many visuals does not download them all during the first load (the CSS gradient shows until then).
    let io = null;
    if (typeof IntersectionObserver !== 'undefined' && canvasRef.current) {
      io = new IntersectionObserver(
        (entries) => {
          if (!entries.some((e) => e.isIntersecting)) return;
          io.disconnect();
          io = null;
          start();
        },
        { rootMargin: '600px' }
      );
      io.observe(canvasRef.current);
    } else start();
    return () => {
      alive = false;
      io?.disconnect();
      scene?.destroy();
    };
  }, [kind, seed, brand, night, hero, quiet, palette]);

  const cls = [
    'mv',
    `mv--${kind}`,
    night ? 'mv--night' : 'mv--day',
    hero && 'mv--hero',
    !ratio && 'mv--fill',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={cls} style={style} data-ready={ready ? '' : undefined} aria-hidden="true">
      <canvas ref={canvasRef} className="mv__canvas" aria-hidden="true" />
    </div>
  );
}

export default MotionVisual;
