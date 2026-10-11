import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useLang } from '../../../lib/i18n.jsx';
import { PulliTimeline } from '../../../components/PulliTimeline.jsx';
import { JOURNEY, TA } from './womenContent.js';
import './Women.css';

/**
 * Women signature, v2 (DESIGN-v2 6.2): the journey Circles → Rise Academy → HerCapital as a PulliTimeline step
 * timeline. The progress fill and the active node carry the Women accent (no red here: brand pages keep red to the
 * h1 stop); the Ink panel draws the brand device dot → grid → network as the steps advance. Same steps, numbers,
 * labels, names, lines and links as before; each line links to its programme.
 */
export default function RisingPath() {
  const { localePath, t } = useLang();
  const steps = JOURNEY.map((j, i) => ({
    id: j.key,
    label: (
      <span className="women-path__label">
        <span className="women-path__num tnum" aria-hidden="true">0{i + 1}</span>
        <span>{t(j.step, j.stepTa)}</span>
      </span>
    ),
    title: j.name,
    body: (
      <Link to={localePath(j.to)} className="women-path__go">
        <span className="women-path__go-label">{t(j.line, j.lineTa)}</span>
        <ArrowRight className="women-path__go-arrow" size={18} aria-hidden="true" />
      </Link>
    ),
  }));

  return (
    <div className="women-path">
      <PulliTimeline steps={steps} node="accent" headingLevel={3} label={t('Woman → Founder', TA.journey)} />
    </div>
  );
}
