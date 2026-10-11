import { useEffect, useId, useRef, useState } from 'react';
import { AnimatePresence, m } from 'framer-motion';
import { MotionFeatures } from '../lib/motionFeatures.js';
import { useReducedMotion } from '../hooks/useReducedMotion.js';
import { cx, safeId } from './_utils.js';
import { useSlidingIndicator } from './_indicator.js';
import './Tabs.css';

const EASE = [0.2, 0, 0.38, 0.9];

/**
 * WAI-ARIA tabs with automatic activation (arrows, Home/End) and a sliding indicator (DESIGN-v2 3.12).
 * `variant`: 'underline' (default: 2px Ink rule on a hairline base) or 'pill' (segmented: Ink pill, Paper text).
 * Extra optional prop: `onChange(id)`.
 */
export function Tabs({ tabs, defaultTab, label, onChange, variant = 'underline', className }) {
  const reduced = useReducedMotion();
  const uid = safeId(useId());
  const list = (Array.isArray(tabs) ? tabs : []).filter(Boolean);
  const [active, setActive] = useState(() =>
    list.some((tb) => tb.id === defaultTab) ? defaultTab : list[0] ? list[0].id : null
  );
  const refs = useRef({});
  const scrollerRef = useRef(null);
  const mounted = useRef(false);
  const listRef = useRef(null);
  const current = list.length ? (list.some((tb) => tb.id === active) ? active : list[0].id) : null;

  // Keep the selected tab clear of the right-edge fade when the list scrolls (phones).
  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      return;
    }
    const sc = scrollerRef.current;
    const el = current != null ? refs.current[current] : null;
    if (!sc || !el || sc.scrollWidth <= sc.clientWidth) return;
    const pad = 40;
    const sr = sc.getBoundingClientRect();
    const er = el.getBoundingClientRect();
    let dx = 0;
    if (er.right > sr.right - pad) dx = er.right - (sr.right - pad);
    else if (er.left < sr.left + pad) dx = er.left - (sr.left + pad);
    if (dx) sc.scrollBy({ left: dx, behavior: reduced ? 'auto' : 'smooth' });
  }, [current, reduced]);

  // APG: the active panel is a tab stop only when it has no focusable content of its own (otherwise Tab from the tab
  // would land on the whole panel box before its first link). Re-checked whenever the panel's content changes.
  const panelRefs = useRef({});
  useEffect(() => {
    const panel = current != null ? panelRefs.current[current] : null;
    if (!panel) return undefined;
    const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select, textarea, iframe, summary, [tabindex]:not([tabindex="-1"])';
    const sync = () => {
      if (panel.querySelector(FOCUSABLE)) panel.removeAttribute('tabindex');
      else panel.setAttribute('tabindex', '0');
    };
    sync();
    if (typeof MutationObserver === 'undefined') return undefined;
    const mo = new MutationObserver(sync);
    mo.observe(panel, { childList: true, subtree: true });
    return () => mo.disconnect();
  }, [current]);

  // One indicator slides between tabs (shared hook; transform / clip-path only).
  useSlidingIndicator(listRef, '[aria-selected="true"]', [current, list.length, variant]);

  if (!list.length) return null;

  const select = (id, focus) => {
    setActive(id);
    if (onChange) onChange(id);
    if (focus) refs.current[id]?.focus();
  };

  const onKeyDown = (e) => {
    const idx = list.findIndex((tb) => tb.id === current);
    let next = null;
    if (e.key === 'ArrowRight') next = (idx + 1) % list.length;
    else if (e.key === 'ArrowLeft') next = (idx - 1 + list.length) % list.length;
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = list.length - 1;
    if (next === null) return;
    e.preventDefault();
    select(list[next].id, true);
  };

  return (
    <div className={cx('tabs', `tabs--${variant}`, className)}>
      <div className="tabs__scroller" ref={scrollerRef}>
        <div className="tabs__list" role="tablist" aria-label={label} onKeyDown={onKeyDown} ref={listRef}>
          {list.map((tb) => {
            const selected = tb.id === current;
            return (
              <button
                key={tb.id}
                ref={(el) => {
                  refs.current[tb.id] = el;
                }}
                type="button"
                role="tab"
                id={`tab-${uid}-${tb.id}`}
                className={cx('tabs__tab', selected && 'tabs__tab--active')}
                aria-selected={selected}
                aria-controls={`panel-${uid}-${tb.id}`}
                tabIndex={selected ? 0 : -1}
                onClick={() => select(tb.id, false)}
              >
                <span className="tabs__label">{tb.label}</span>
              </button>
            );
          })}
          <span className={cx('ind', variant === 'pill' ? 'ind--pill' : 'ind--line')} aria-hidden="true" />
        </div>
      </div>
      {list.map((tb) => {
        const selected = tb.id === current;
        return (
          <div
            key={tb.id}
            role="tabpanel"
            id={`panel-${uid}-${tb.id}`}
            aria-labelledby={`tab-${uid}-${tb.id}`}
            className="tabs__panel"
            hidden={!selected}
            ref={(el) => { panelRefs.current[tb.id] = el; }}
            tabIndex={0}
          >
            <MotionFeatures>
            <AnimatePresence initial={false} mode="wait">
              {selected && (
                <m.div
                  key={tb.id}
                  initial={reduced ? false : { opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0, transition: { duration: reduced ? 0 : 0.24, ease: EASE } }}
                >
                  {tb.content}
                </m.div>
              )}
            </AnimatePresence>
            </MotionFeatures>
          </div>
        );
      })}
    </div>
  );
}

export default Tabs;
