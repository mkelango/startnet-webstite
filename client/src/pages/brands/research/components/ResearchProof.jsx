import { RevealGroup, Stat } from '../../../../components';
import { useApi } from '../../../../hooks/useApi';
import { useLang } from '../../../../lib/i18n.jsx';
import { PROOF } from '../researchContent';
import './ResearchProof.css';

/**
 * Proof band (Book 2 §3.1). Live metrics from /api/metrics replace the local records when they exist. Figures with no
 * value yet are left out (not shown as placeholder tiles); they appear as soon as StartNet supplies them.
 */
export default function ResearchProof() {
  const { t } = useLang();
  const { data } = useApi('/api/metrics?brand=research');
  const live = Array.isArray(data) ? data : [];
  const items = PROOF.map((p) => {
    const m = live.find((x) => (x.key === p.id || x.id === p.id) && x.value != null);
    // Tamil label: the API's own labelTa when it has one, else the local one for the same metric.
    const src = m || p;
    return { ...src, label: t(src.label, src.labelTa || p.labelTa) };
  }).filter((m) => m.value != null);

  if (!items.length) return null;

  return (
    <RevealGroup className={`rproof bp-statrow${items.length === 1 ? ' bp-statrow--single' : ''}`}>
      {items.map((m) => (
        <div key={m.id} className="rproof__item">
          <Stat metric={m} value={m.value} unit={m.unit} prefix={m.prefix} label={m.label} tag={m.tag} asAt={m.asAt} source={m.source} note={m.note} />
        </div>
      ))}
    </RevealGroup>
  );
}
