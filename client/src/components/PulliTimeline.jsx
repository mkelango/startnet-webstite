import { useEffect, useId, useRef, useState } from 'react';
import { useReducedMotion } from '../hooks/useReducedMotion.js';
import { cx, safeId } from './_utils.js';
import { ArtImage } from './ArtImage.jsx';
import './PulliTimeline.css';

/*
 * PulliTimeline (DESIGN-v2 3.21.4): the brand device as a step timeline, dot → grid → network → full stop.
 * Desktop (≥1024, after mount): a 4/8 split. Left, a vertical list of disclosure buttons with a 2px hairline track, an Ink progress fill
 * (scaleY) and the active node as the red full stop (`node="accent"` uses the brand accent instead, for brand pages).
 * Right, an Ink panel with the active step's photograph (`photos`, one manifest photo per step).
 * Mobile and SSR/prerender: a stacked hairline list, every step with its text and a 120px photo.
 * No GSAP.
 * Props: steps = [{ id, label, title, body }], headingLevel = 3, node = 'point' | 'accent', scrollSync = false,
 *        label (tablist aria-label), photos (one manifest photo per step, shown in the panel), className.
 * Since Oct 2026 the panel shows a photograph per step (the animated Canvas visuals are retired site-wide).
 */
/** One step's photograph (square, Ink ground while it loads). */
export function PulliArt({ photo, mini = false, className }) {
  return (
    <div className={cx('pulli-art', mini && 'pulli-art--mini', className)} aria-hidden="true">
      {photo && (
        <ArtImage photo={photo} ratio="1/1" curated plan={false} noCaption sizes={mini ? '120px' : '(min-width: 1024px) 560px, 100vw'} />
      )}
    </div>
  );
}

function useDesktop() {
  const [desk, setDesk] = useState(false);
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return undefined;
    const mq = window.matchMedia('(min-width: 1024px)');
    const on = () => setDesk(mq.matches);
    on();
    mq.addEventListener?.('change', on);
    return () => mq.removeEventListener?.('change', on);
  }, []);
  return desk;
}

export function PulliTimeline({ steps, headingLevel = 3, node = 'point', scrollSync = false, label, photos, className }) {
  const reduced = useReducedMotion();
  const desktop = useDesktop();
  const uid = safeId(useId());
  const list = (Array.isArray(steps) ? steps : []).filter(Boolean);
  const [active, setActive] = useState(0);
  const tabRefs = useRef([]);
  const itemRefs = useRef([]);
  const rootRef = useRef(null);
  const photoOf = (i) => (Array.isArray(photos) ? photos[i] || photos[photos.length - 1] : undefined);

  // Optional scroll-sync at ≥1024 (no pinning): the step whose block crosses the viewport middle becomes active.
  useEffect(() => {
    if (!scrollSync || !desktop || reduced || typeof IntersectionObserver === 'undefined') return undefined;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(Number(e.target.dataset.i));
        });
      },
      { rootMargin: '-45% 0px -45% 0px' }
    );
    itemRefs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, [scrollSync, desktop, reduced, list.length]);

  if (!list.length) return null;
  const H = `h${Math.min(Math.max(Number(headingLevel) || 3, 2), 6)}`;
  const n = list.length;
  const tabs = desktop;

  const onKeyDown = (e) => {
    let next = null;
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') next = (active + 1) % n;
    else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') next = (active - 1 + n) % n;
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = n - 1;
    if (next === null) return;
    e.preventDefault();
    setActive(next);
    tabRefs.current[next]?.focus();
  };

  return (
    <div
      ref={rootRef}
      className={cx('pulli-timeline', tabs && 'pulli-timeline--tabs', node === 'accent' && 'pulli-timeline--accent', className)}
      style={{ '--pt-progress': n > 1 ? active / (n - 1) : 1 }}
    >
      <div className="pulli-timeline__rail">
        <span className="pulli-timeline__track" aria-hidden="true">
          <span className="pulli-timeline__fill" />
        </span>
        {/* Desktop: a set of disclosures (one open at a time). Each step title is a button with aria-expanded /
            aria-controls pointing at its own body (text + link); arrow keys move between titles as an extra. The Ink
            panel on the right is decorative. (Not a tablist: the bodies expand inline under each title.) */}
        <ol
          className="pulli-timeline__list"
          aria-label={label}
          onKeyDown={tabs ? onKeyDown : undefined}
        >
          {list.map((s, i) => {
            const selected = i === active;
            const passed = i < active;
            return (
              <li
                key={s.id || i}
                ref={(el) => {
                  itemRefs.current[i] = el;
                }}
                data-i={i}
                className={cx('pulli-timeline__step', selected && 'is-active', passed && 'is-passed')}
              >
                <span className="pulli-timeline__tick" aria-hidden="true" />
                {tabs && <span className="pulli-timeline__node" aria-hidden="true" />}
                {tabs ? (
                  <button
                    ref={(el) => {
                      tabRefs.current[i] = el;
                    }}
                    type="button"
                    id={`pt-tab-${uid}-${i}`}
                    aria-expanded={selected}
                    aria-controls={s.body ? `pt-body-${uid}-${i}` : undefined}
                    className="pulli-timeline__tab"
                    onClick={() => setActive(i)}
                  >
                    {s.label && <span className="pulli-timeline__label">{s.label}</span>}
                    <span className="pulli-timeline__title">{s.title}</span>
                  </button>
                ) : (
                  <>
                    {s.label && <p className="pulli-timeline__label">{s.label}</p>}
                    <H className="pulli-timeline__title">{s.title}</H>
                  </>
                )}
                {s.body && (
                  <div
                    className="pulli-timeline__body"
                    id={`pt-body-${uid}-${i}`}
                    data-open={!tabs || selected ? '' : undefined}
                    inert={!tabs || selected ? undefined : ''}
                  >
                    <div className="pulli-timeline__body-inner">{typeof s.body === 'string' ? <p>{s.body}</p> : s.body}</div>
                  </div>
                )}
                <PulliArt photo={photoOf(i)} mini className="pulli-timeline__mini" />
              </li>
            );
          })}
        </ol>
      </div>
      <div className="pulli-timeline__panel" aria-hidden="true">
        <PulliArt key={active} photo={photoOf(active)} />
      </div>
    </div>
  );
}

export default PulliTimeline;
