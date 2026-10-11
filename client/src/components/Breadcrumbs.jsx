import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useLang } from '../lib/i18n.jsx';
import { cx } from './_utils.js';
import { SITE_ORIGIN } from '../lib/seo.js';
import './Breadcrumbs.css';

/** Canonical trail Home › Section › Page (Book 3 C08). < 768px: a single back link. */
export function Breadcrumbs({ items, className }) {
  const { t, localePath } = useLang();
  const list = [{ label: t('Home', 'முகப்பு'), to: '/' }, ...(Array.isArray(items) ? items.filter(Boolean) : [])];
  if (list.length < 2) return null;
  const parent = [...list.slice(0, -1)].reverse().find((i) => i.to) || list[0];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: list.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: typeof item.label === 'string' ? item.label : undefined,
      item: item.to ? `${SITE_ORIGIN}${localePath(item.to)}` : undefined,
    })),
  };

  return (
    <nav className={cx('breadcrumbs', className)} aria-label={t('Breadcrumb', 'வழித்தடம்')}>
      <ol className="breadcrumbs__list">
        {list.map((item, i) => {
          const last = i === list.length - 1;
          return (
            <li className="breadcrumbs__item" key={`${item.to || item.label}-${i}`}>
              {item.to && !last ? (
                <Link to={localePath(item.to)}>{item.label}</Link>
              ) : (
                <span aria-current={last ? 'page' : undefined}>{item.label}</span>
              )}
              {!last && (
                <span className="breadcrumbs__sep" aria-hidden="true">
                  /
                </span>
              )}
            </li>
          );
        })}
      </ol>
      <Link className="breadcrumbs__back" to={localePath(parent.to || '/')}>
        <ArrowLeft size={16} aria-hidden="true" />
        <span>{parent.label}</span>
      </Link>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </nav>
  );
}

export default Breadcrumbs;
