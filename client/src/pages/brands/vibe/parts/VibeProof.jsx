import { useApi } from '../../../../hooks/useApi.js';
import { FactBand, Stat } from '../../../../components';
import { useLang } from '../../../../lib/i18n.jsx';
import { CURATED_METRICS, VIBE_PROOF, localiseMetric } from '../vibeContent.js';
import './VibeProof.css';

/**
 * StartNet Vibe proof band. Prefers live metrics from /api/metrics?brand=vibe; otherwise shows the one
 * sourced Book 2 figure (figures not supplied yet are left out, not shown as placeholder tiles).
 * A metric the Vibe pages curate from sourced research (CURATED_METRICS, e.g. the Vibathon 2025 prize pool) replaces
 * the API record with the same key.
 */
export default function VibeProof() {
  const { t } = useLang();
  const { data } = useApi('/api/metrics?brand=vibe');
  const metrics = Array.isArray(data)
    ? data
        .map((m) => (m && Object.prototype.hasOwnProperty.call(CURATED_METRICS, m.key) ? CURATED_METRICS[m.key] : m))
        .filter((m) => m && m.value !== null && m.value !== undefined)
    : [];

  if (metrics.length >= 2) {
    return (
      <FactBand
        className="bp-facts"
        metrics={metrics.slice(0, 4).map((m) => localiseMetric(t, m))}
        footnote={t('Every figure carries its source, as-at date and A/B/C tag.', 'ஒவ்வோர் எண்ணுக்கும் அதன் ஆதாரம், தேதி, A/B/C குறி உண்டு.')}
        link={{ label: t('How we tag evidence', 'சான்றுகளை எப்படிக் குறிக்கிறோம்'), to: '/about/evidence-standard' }}
      />
    );
  }

  return (
    <div className="vibe-proof bp-statrow bp-statrow--single">
      <div className="vibe-proof__item vibe-proof__item--lead">
        <Stat metric={localiseMetric(t, VIBE_PROOF.metric)} />
      </div>
      {/* Figures StartNet has not supplied yet (VIBE_PROOF.placeholders) are not shown as placeholder tiles. */}
    </div>
  );
}
