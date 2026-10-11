// Page-local building blocks shared by the StartNet X pages.
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useSnxT } from './snxTamil.js';
import { SNX_ICONS } from './snxIcons.js';
import './SnxParts.css';

/** Module status chip. Status must be one of live | beta | coming; anything else renders nothing (never "Live" by default). */
export function SnxStatus({ status, phase }) {
  const { tx } = useSnxT();
  if (status === 'live') return <span className="snx-status snx-status--live">{tx('Live')}</span>;
  if (status === 'beta') return <span className="snx-status snx-status--beta">{tx('In beta')}</span>;
  if (status === 'coming') return <span className="snx-status snx-status--coming">{tx('Coming')}{phase ? ` ${phase}` : ''}</span>;
  // Unconfirmed status (Book 2 Appendix A #11): no chip at all (never "Live" by default, never a placeholder).
  return null;
}

/** Module card; whole card links to the module's anchor on /startnet-x/modules. */
export function SnxModuleCard({ module, to, index }) {
  const { localePath, tx } = useSnxT();
  const Icon = SNX_ICONS[module.icon];
  return (
    <article className="snx-module">
      <div className="snx-module__top">
        <span className="snx-module__icon" aria-hidden="true">{Icon && <Icon size={22} strokeWidth={1.5} />}</span>
        {typeof index === 'number' && <span className="snx-module__num" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>}
      </div>
      <h3 className="snx-module__name h5">
        {to ? (
          <Link to={localePath(to)} className="snx-module__link">{module.name}</Link>
        ) : (
          module.name
        )}
      </h3>
      <p className="snx-module__line">{tx(module.line)}</p>
      <div className="snx-module__foot">
        <SnxStatus status={module.status} phase={module.phase} />
        {to && <ArrowRight className="snx-module__arrow" size={18} aria-hidden="true" />}
      </div>
    </article>
  );
}
