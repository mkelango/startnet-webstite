import { Button, Reveal, Section, Stat } from '../../../components';
import { useApi } from '../../../hooks/useApi.js';
import { useLang } from '../../../lib/i18n.jsx';
import { PROOF_LABELS, TA } from './womenContent.js';
import './Women.css';

/**
 * Book 2 §3.4 proof band. Each figure comes from /api/metrics?brand=women when the Founder Ledger
 * has it (tagged, dated). Figures not supplied yet are left out, and the whole band (section included)
 * renders nothing until at least one exists. Never invented.
 */
export default function WomenProof() {
  const { t, lang } = useLang();
  const { data } = useApi('/api/metrics?brand=women');
  const metrics = Array.isArray(data) ? data : [];
  const byKey = (k) => metrics.find((m) => m.key === k && m.value !== null && m.value !== undefined);
  const shown = PROOF_LABELS.map((p) => ({ p, m: byKey(p.key) })).filter((x) => x.m);

  if (!shown.length) return null;

  return (
    <Section surface="white" pad="sm" labelledBy="women-proof-title">
      <h2 id="women-proof-title" className="visually-hidden">{t('StartNet Women in numbers', 'எண்களில் StartNet Women')}</h2>
      <div className="women-proof">
        <div className={`women-proof__grid bp-statrow${shown.length === 1 ? ' bp-statrow--single' : ''}`}>
          {shown.map(({ p, m }, i) => (
            <Reveal key={p.key} className="women-proof__item" delay={i * 0.04}>
              <Stat metric={m} />
            </Reveal>
          ))}
        </div>
        <div className="women-proof__foot bp-statrow__foot">
          <p className="caption">
            {/* Each figure carries its own as-at date, so the band no longer shows "As at [date]". */}
            {lang === 'ta'
              ? 'StartNet சான்றுத் தரநிலையின்படி A/B/C எனக் குறியிடப்பட்டவை.'
              : 'Tagged A/B/C under the StartNet evidence standard.'}
          </p>
          <Button variant="tertiary" size="sm" to="/insights/founder-ledger">{t('Read the Founder Ledger', TA.readLedger)}</Button>
        </div>
      </div>
    </Section>
  );
}
