// C20 Timeline (Book 3): past → Mission 1L/1M, as a PnP history rail (SPEC §4.10, §5.8): a Scroller of year cards,
// oldest first. Each card: the 4/3 warm mono photo (radius 16) → the year as a dot label (Ink ring for past, the filled
// Ink point for "now", a dashed ring for the future; the page's red point stays with the headline stop) → title
// (--text-h3) → body → metric → a real status line. The rail is ordered (<ol>), keeps its counter and 48px arrows, and
// is prerender-safe (every card is in the markup).
import { ArtImage, Scroller, Stat } from '../../components';
import { isPlaceholderNode } from '../../components/_placeholders.js';
import './Timeline.css';

const CARD_SIZES = '(min-width: 1024px) 352px, 82vw';

/**
 * items: [{ id, date (year label; omitted when missing), title, body?, metric? (Stat props), future?, now?, pending?, art? (ArtImage props) }]
 */
export default function Timeline({ items, label }) {
  return (
    <div className="about-timeline">
      <Scroller ordered label={label} itemWidth="min(22rem, 82vw)" nudge={false} className="about-timeline__rail">
        {items.map((m, i) => (
          <article
            key={m.id}
            className={`about-timeline__item${m.future ? ' about-timeline__item--future' : ''}${m.now ? ' about-timeline__item--now' : ''}${m.art ? ' about-timeline__item--art' : ''}`}
          >
            {m.art && (
              <div className="about-timeline__art">
                <ArtImage ratio="4/3" seed={i + 11} sizes={CARD_SIZES} {...m.art} />
              </div>
            )}
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
          </article>
        ))}
      </Scroller>
    </div>
  );
}
