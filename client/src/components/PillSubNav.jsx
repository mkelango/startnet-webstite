import { useEffect, useRef, useState } from 'react';
import { useLang } from '../lib/i18n.jsx';
import { useReducedMotion } from '../hooks/useReducedMotion.js';
import { cx } from './_utils.js';
import './PillSubNav.css';

/**
 * Sticky pill sub-nav with scroll-spy (AIWO blueprint P17, top-15 #14), for long pages with in-page sections
 * (About, brand hubs, programme / event detail).
 *
 *   <PillSubNav items={[{ id: 'outcome', label: 'Outcome' }, …]} label="On this page" />
 *
 * - A strip of 44px pill chips under the header, sticky at the header's visible height (--shell-offset, which drops
 *   to 0 when the header hides on scroll down, so the strip rides up with it).
 * - Scroll-spy: the section crossing the upper part of the viewport marks its chip current (aria-current="location",
 *   Ink fill; Paper fill on a night strip). The current chip is kept in view in the sideways-scrolling row.
 * - Plain in-page links: they work without JS and in the prerender (no chip is marked until JS runs). With JS a click
 *   scrolls to the section clear of the header and the strip, and moves focus there.
 * - Reduced motion (OS or data-motion="reduced"): no smooth scrolling, no chip transitions.
 * Labels are passed in (existing copy only); `night` puts the strip on Ink.
 */
export function PillSubNav({ items, label, night = false, className }) {
  const { t } = useLang();
  const reduced = useReducedMotion();
  const ids = (Array.isArray(items) ? items : []).map((i) => i.id).filter(Boolean);
  const [active, setActive] = useState(null);
  const rowRef = useRef(null);
  const navRef = useRef(null);
  const key = ids.join('|');

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined' || !ids.length) return undefined;
    const els = ids.map((id) => document.getElementById(id)).filter(Boolean);
    if (!els.length) return undefined;
    const seen = new Map();
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) seen.set(e.target.id, e.isIntersecting);
        // The first section (in page order) inside the spy band wins; past the last one, keep the last.
        const hit = ids.find((id) => seen.get(id));
        if (hit) setActive(hit);
        else if (els[0].getBoundingClientRect().top > window.innerHeight * 0.3) setActive(null);
      },
      { rootMargin: '-30% 0px -60% 0px', threshold: 0 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  // Keep the current chip visible in the row (scrolls the row only, never the page).
  useEffect(() => {
    const row = rowRef.current;
    const chip = row?.querySelector('[aria-current]');
    if (!row || !chip || row.scrollWidth <= row.clientWidth) return;
    const left = chip.offsetLeft - (row.clientWidth - chip.offsetWidth) / 2;
    row.scrollTo({ left: Math.max(0, left), behavior: reduced ? 'auto' : 'smooth' });
  }, [active, reduced]);

  if (!ids.length) return null;

  const onClick = (e, id) => {
    const target = document.getElementById(id);
    if (!target || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    const shell = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--shell-offset')) || 0;
    const bar = navRef.current ? navRef.current.offsetHeight : 0;
    const y = window.scrollY + target.getBoundingClientRect().top - shell - bar - 16;
    window.scrollTo({ top: Math.max(0, y), behavior: reduced ? 'auto' : 'smooth' });
    if (history.replaceState) history.replaceState(null, '', `#${id}`);
    if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
    target.focus({ preventScroll: true });
    setActive(id);
  };

  return (
    <nav
      ref={navRef}
      className={cx('pill-subnav', night && 'pill-subnav--night', className)}
      data-surface={night ? 'night' : undefined}
      aria-label={label || t('On this page', 'இந்தப் பக்கத்தில்')}
    >
      <div className="container">
        <ul className="pill-subnav__row" ref={rowRef}>
          {items.map((item) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                className="pill-subnav__chip"
                aria-current={active === item.id ? 'location' : undefined}
                onClick={(e) => onClick(e, item.id)}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}

export default PillSubNav;
