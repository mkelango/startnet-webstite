import { useLang } from '../lib/i18n.jsx';
import './PageLoader.css';

/** Suspense fallback: a single pulsing full stop. */
export function PageLoader() {
  const { t } = useLang();
  return (
    <div className="page-loader" role="status" aria-live="polite">
      <span className="page-loader__dot" aria-hidden="true" />
      <span className="visually-hidden">{t('Loading', 'ஏற்றுகிறது')}</span>
    </div>
  );
}

export default PageLoader;
