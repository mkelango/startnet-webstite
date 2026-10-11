import { useId, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useLang } from '../../../../lib/i18n.jsx';
import { useReducedMotion } from '../../../../hooks/useReducedMotion';
import { JOURNEY, tr } from '../researchContent';
import './ResearchJourney.css';

/** Discover → Validate → Build → Form → Fund → Scale. Tap a step to expand it (Book 4 E2 F5, IX-16 variant). */
export default function ResearchJourney() {
  const { t, localePath } = useLang();
  const reduced = useReducedMotion();
  const uid = useId();
  const [open, setOpen] = useState(JOURNEY[0].id);

  return (
    <ol className="rjourney" style={{ '--rjourney-n': JOURNEY.length }}>
      {JOURNEY.map((step, i) => {
        const isOpen = open === step.id;
        const panelId = `${uid}-${step.id}`;
        return (
          <li key={step.id} className={`rjourney__item${isOpen ? ' is-open' : ''}`}>
            <button
              type="button"
              className="rjourney__step"
              aria-expanded={isOpen}
              aria-controls={panelId}
              onClick={() => setOpen(step.id)}
            >
              <span className="rjourney__num tnum" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
              <span className="rjourney__title">{tr(t, step, 'title')}</span>
              <span className="rjourney__marker" aria-hidden="true">
                {isOpen && (
                  <motion.span
                    className="rjourney__dot"
                    layoutId={reduced ? undefined : `${uid}-dot`}
                    transition={{ duration: 0.32, ease: [0.2, 0, 0.38, 0.9] }}
                  />
                )}
              </span>
            </button>
            <div id={panelId} className="rjourney__panel" hidden={!isOpen}>
              <p className="rjourney__eyebrow eyebrow">{t(`Step ${i + 1} of ${JOURNEY.length}`, `படி ${i + 1} / ${JOURNEY.length}`)}</p>
              <p className="rjourney__body h4">{tr(t, step, 'body')}</p>
              <Link className="rjourney__link" to={localePath(step.link.to)}>
                {tr(t, step.link, 'label')}
                <ArrowRight size={18} aria-hidden="true" />
              </Link>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
