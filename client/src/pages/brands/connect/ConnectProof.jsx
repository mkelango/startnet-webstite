import { FactBand, Section } from '../../../components';
import { useApi } from '../../../hooks/useApi.js';
import { useLang } from '../../../lib/i18n.jsx';
import { realMetrics } from '../../../components/_placeholders.js';
import './ConnectProof.css';

// Book 2 §3.3 proof band. Figures come from /api/metrics; until StartNet supplies at least one, the band
// (section included) renders nothing rather than placeholder slots.
export default function ConnectProof() {
  const { t } = useLang();
  const { data } = useApi('/api/metrics?brand=connect');
  const metrics = realMetrics(data).slice(0, 4);

  if (!metrics.length) return null;

  return (
    <Section surface="paper" pad="sm" labelledBy="connect-proof-title">
      <h2 id="connect-proof-title" className="visually-hidden">{t('StartNet Connect in numbers', 'எண்களில் StartNet Connect')}</h2>
      <FactBand className="bp-facts" metrics={metrics} title={t('StartNet Connect in numbers', 'எண்களில் StartNet Connect')} link={{ label: t('Read the Founder Ledger', 'Founder Ledger-ஐப் படியுங்கள்'), to: '/insights/founder-ledger' }} />
    </Section>
  );
}
