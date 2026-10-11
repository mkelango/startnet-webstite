import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLang } from '../../../../lib/i18n.jsx';
import './VibeJourney.css';

/**
 * Vibe signature interaction: the student journey as a pulse track. Hovering or focusing a stage moves
 * the full stop along the track to it ("the pulse travels"). Content is a plain <ol> of links at rest.
 * @param {{ steps: {id, verb, via, to}[] }} props
 */
export default function VibeJourney({ steps }) {
  const { t, localePath } = useLang();
  const [active, setActive] = useState(steps.length - 1);
  const last = steps.length - 1;

  return (
    <div
      className="vibe-journey"
      style={{ '--vibe-journey-pos': active, '--vibe-journey-n': steps.length, '--vibe-journey-last': last }}
      onMouseLeave={() => setActive(last)}
    >
      <div className="vibe-journey__track" aria-hidden="true">
        <span className="vibe-journey__fill" />
        <span className="vibe-journey__rail"><span className="vibe-journey__dot" /></span>
      </div>
      <ol className="vibe-journey__list">
        {steps.map((s, i) => {
          const inner = (
            <>
              <span className="vibe-journey__num tnum" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
              <span className="vibe-journey__verb">{t(s.verb, s.verbTa)}</span>
              <span className="vibe-journey__via">{t(s.via, s.viaTa)}</span>
            </>
          );
          const handlers = { onMouseEnter: () => setActive(i), onFocus: () => setActive(i) };
          return (
            <li key={s.id} className={`vibe-journey__step${i <= active ? ' is-reached' : ''}${i === active ? ' is-active' : ''}`}>
              <span className="vibe-journey__node" aria-hidden="true" />
              {s.to ? (
                <Link className="vibe-journey__link" to={localePath(s.to)} {...handlers}>{inner}</Link>
              ) : (
                <span className="vibe-journey__link vibe-journey__link--static" tabIndex={-1} {...handlers}>{inner}</span>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
