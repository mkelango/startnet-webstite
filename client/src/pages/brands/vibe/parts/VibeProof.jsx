import { useApi } from '../../../../hooks/useApi.js';
import { FactBand, Stat } from '../../../../components';
import { useLang } from '../../../../lib/i18n.jsx';
import { VIBE_PROOF, localiseMetric } from '../vibeContent.js';
import './VibeProof.css';

/**
 * StartNet Vibe proof band. Prefers live metrics from /api/metrics?brand=vibe; otherwise shows the one
 * sourced Book 2 figure (figures not supplied yet are left out, not shown as placeholder tiles).
 */
export default function VibeProof() {
  const { t } = useLang();
  const { data } = useApi('/api/metrics?brand=vibe');
  const metrics = Array.isArray(data) ? data.filter((m) => m && m.value !== null && m.value !== undefined) : [];

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
