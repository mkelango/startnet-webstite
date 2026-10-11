import { useEffect, useId, useRef, useState } from 'react';
import { Pause, Play } from 'lucide-react';
import { useLang } from '../lib/i18n.jsx';
import { useReducedMotion } from '../hooks/useReducedMotion.js';
import { cx, safeId } from './_utils.js';
import './FeatureTabs.css';

/**
 * Auto-advancing feature list + media (DESIGN-v2 3.21.3, Meridian pattern). 4/8 at ≥1024; an accordion with the
 * media inline under the active item below 1024.
 * Props: items = [{ id, title, body, media }] (existing content only), interval = 7500 (ms), autoplay = true,
 *        label (tablist aria-label), className. (Tab titles are tab buttons, not headings: ARIA tabs own their labels.)
 * ARIA: a set of disclosures (one open at a time): each title is a button with aria-expanded / aria-controls pointing
 * at its own body, which holds the text and CTA; arrow keys + Home/End move between titles as an extra. (Not
 * tablist/tabpanel: the bodies expand inline under each title, so a tablist would contain non-tab content and the
 * tabs would control media-only panels.) Every body stays in the DOM (collapsed with grid-rows, never display:none;
 * collapsed ones are inert) and the media column is decorative (aria-hidden), so the prerender carries all text. Autoplay pauses on hover, focus-within, a hidden tab or when out of view, and has a visible
 * 48px pause/play button (the existing "Pause"/"Play" strings). Reduced motion: no autoplay and no progress bar.
 */
export function FeatureTabs({ items, interval = 7500, autoplay = true, label, className }) {
  const { t } = useLang();
  const reduced = useReducedMotion();
  const uid = safeId(useId());
  const list = (Array.isArray(items) ? items : []).filter(Boolean);
  const [active, setActive] = useState(0);
  const [userPaused, setUserPaused] = useState(false);
  const [hover, setHover] = useState(false);
  const [focusIn, setFocusIn] = useState(false);
  const [inView, setInView] = useState(false);
  const [docHidden, setDocHidden] = useState(false);
  const [cycle, setCycle] = useState(0);
  const rootRef = useRef(null);
  const tabRefs = useRef([]);

  useEffect(() => {
    const el = rootRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return undefined;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.25 });
    io.observe(el);
    const vis = () => setDocHidden(document.hidden);
    document.addEventListener('visibilitychange', vis);
    return () => {
      io.disconnect();
      document.removeEventListener('visibilitychange', vis);
    };
  }, []);

  if (!list.length) return null;
  const canAuto = autoplay && !reduced && list.length > 1;
  const running = canAuto && !userPaused && !hover && !focusIn && inView && !docHidden;

  const select = (i, focus) => {
    const n = (i + list.length) % list.length;
    setActive(n);
    setCycle((c) => c + 1);
    if (focus) tabRefs.current[n]?.focus();
  };
  const onKeyDown = (e) => {
    let next = null;
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') next = active + 1;
    else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') next = active - 1;
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = list.length - 1;
    if (next === null) return;
    e.preventDefault();
    select(next, true);
  };

  return (
    <div
      ref={rootRef}
      className={cx('feature-tabs', canAuto && 'feature-tabs--auto', className)}
      style={{ '--ft-interval': `${interval}ms` }}
      onPointerEnter={(e) => e.pointerType === 'mouse' && setHover(true)}
      onPointerLeave={() => setHover(false)}
      onFocus={() => setFocusIn(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) setFocusIn(false);
      }}
    >
      <div className="feature-tabs__nav">
      <div className="feature-tabs__list" role="group" aria-label={label} onKeyDown={onKeyDown}>
        {list.map((it, i) => {
          const selected = i === active;
          const tabId = `ft-tab-${uid}-${i}`;
          const bodyId = `ft-body-${uid}-${i}`;
          return (
            <div className={cx('feature-tabs__item', selected && 'is-active')} key={it.id || i}>
              <div className="feature-tabs__title">
                <button
                  ref={(el) => {
                    tabRefs.current[i] = el;
                  }}
                  type="button"
                  id={tabId}
                  aria-expanded={selected}
                  aria-controls={bodyId}
                  className="feature-tabs__tab"
                  onClick={() => select(i, false)}
                >
                  {it.title}
                </button>
              </div>
              <div
                className="feature-tabs__body"
                id={bodyId}
                data-open={selected ? '' : undefined}
                inert={selected ? undefined : ''}
              >
                <div className="feature-tabs__body-inner">
                  {typeof it.body === 'string' ? <p>{it.body}</p> : it.body}
                  {it.media && <div className="feature-tabs__inline-media">{it.media}</div>}
                </div>
              </div>
              <span className="feature-tabs__progress" aria-hidden="true">
                {selected && canAuto && (
                  <span
                    key={`${i}-${cycle}`}
                    className="feature-tabs__progress-fill"
                    style={{ animationPlayState: running ? 'running' : 'paused' }}
                    onAnimationEnd={() => select(active + 1, false)}
                  />
                )}
              </span>
            </div>
          );
        })}
      </div>
        {canAuto && (
          <button
            type="button"
            className="feature-tabs__toggle"
            aria-pressed={userPaused}
            aria-label={userPaused ? t('Play', 'இயக்கு') : t('Pause', 'நிறுத்து')}
            onClick={() => setUserPaused((p) => !p)}
          >
            {userPaused ? <Play size={18} aria-hidden="true" /> : <Pause size={18} aria-hidden="true" />}
          </button>
        )}
      </div>
      <div className="feature-tabs__media" aria-hidden="true">
        {list.map((it, i) => (
          <div
            key={it.id || i}
            className={cx('feature-tabs__panel', i === active && 'is-active')}
            inert=""
          >
            {it.media}
          </div>
        ))}
      </div>
    </div>
  );
}

export default FeatureTabs;
