// C20 Timeline (Book 3): past → Mission 1L/1M. DESIGN-v2 6.4: a hairline vertical list with tabular years.
// Each milestone is one row (year · rail node · title/body/metric · art). The "now" node is the Ink point (the page's
// red point belongs to the headline stop); future nodes are dashed rings. A 2px Ink fill grows down the rail as the
// list scrolls through the viewport (transform only; off under reduced motion and in SSR, where the hairline rail stays).
import { useEffect, useRef, useState } from 'react';
import { useMotionValueEvent, useScroll } from 'framer-motion';
import { ArtImage, Stat } from '../../components';
import { isPlaceholderNode } from '../../components/_placeholders.js';
import { useReducedMotion } from '../../hooks/useReducedMotion.js';
import './Timeline.css';

function RailProgress({ target }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target, offset: ['start 0.75', 'end 0.6'] });
  const write = (v) => ref.current?.style.setProperty('--tl-p', Math.min(1, Math.max(0, v)).toFixed(4));
  useMotionValueEvent(scrollYProgress, 'change', write);
  useEffect(() => write(scrollYProgress.get()), [scrollYProgress]); // eslint-disable-line react-hooks/exhaustive-deps
  return <li ref={ref} className="about-timeline__fill" aria-hidden="true" />;
}

/**
 * items: [{ id, date (node; omitted when missing), title, body?, metric? (Stat props), future?, now?, pending?, art? (ArtImage props) }]
 */
export default function Timeline({ items, label }) {
  const reduced = useReducedMotion();
  const listRef = useRef(null);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const live = mounted && !reduced;

  return (
    <div className="about-timeline" role="region" aria-label={label}>
      <ol className={`about-timeline__list${live ? ' is-live' : ''}`} ref={listRef}>
        {live && <RailProgress target={listRef} />}
        {items.map((m, i) => (
          <li
            key={m.id}
            className={`about-timeline__item${m.future ? ' about-timeline__item--future' : ''}${m.now ? ' about-timeline__item--now' : ''}${m.art ? ' about-timeline__item--art' : ''}`}
          >
            <div className="about-timeline__when">
              <span className="about-timeline__node" aria-hidden="true" />
              {!isPlaceholderNode(m.date) && <p className="about-timeline__date tnum">{m.date}</p>}
            </div>
            <div className="about-timeline__main">
              <h3 className="about-timeline__title h4">{m.title}</h3>
              {m.body && <p className="about-timeline__body">{m.body}</p>}
              {m.metric && (
                <div className="about-timeline__metric">
                  <Stat variant="compact" {...m.metric} />
                </div>
              )}
              {/* A "[placeholder — …]" note stays hidden; a real status line (no register mark) shows. */}
              {!isPlaceholderNode(m.pending) && <p className="about-timeline__pending">{m.pending}</p>}
            </div>
            {m.art && (
              <div className="about-timeline__art">
                <ArtImage ratio="4/3" seed={i + 11} {...m.art} />
              </div>
            )}
          </li>
        ))}
      </ol>
    </div>
  );
}
