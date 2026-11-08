// Insights section tabs (docs/redesign/SPEC.md §5.6): the PnP folder tabs as a row of links, so each one keeps its
// own route (All · Founder Ledger · Reports · Stories · Indices · Podcast). Same look as Tabs variant="folder"
// (§4.9): a full-bleed Bone strip, the current tab Paper and joined to the Paper sheet below it.
import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useLang } from '../../lib/i18n.jsx';
import './insightsKit.css';

const TABS = [
  { to: '/insights', label: ['All', 'அனைத்தும்'], exact: true },
  { to: '/insights/founder-ledger', label: ['Founder Ledger', 'Founder Ledger'] },
  { to: '/insights/reports', label: ['Reports', 'அறிக்கைகள்'] },
  { to: '/insights/stories', label: ['Stories', 'கதைகள்'] },
  { to: '/insights/indices', label: ['Indices', 'குறியீடுகள்'] },
  { to: '/insights/podcast', label: ['Podcast', 'பாட்காஸ்ட்'] },
];

/** `current`: the base path of the page this strip sits on (e.g. '/insights/reports'). */
export function InsightsTabs({ current, className }) {
  const { t, lang, localePath } = useLang();
  const listRef = useRef(null);
  // Below 1024 the row scrolls sideways: bring the current tab into view (no animation, no page scroll).
  useEffect(() => {
    const list = listRef.current;
    const cur = list?.querySelector('[aria-current]');
    if (!list || !cur || list.scrollWidth <= list.clientWidth) return;
    const li = cur.parentElement;
    list.scrollLeft = Math.max(0, li.offsetLeft - (list.clientWidth - li.offsetWidth) / 2);
  }, [current]);
  return (
    <nav className={`ins-tabs${className ? ` ${className}` : ''}`} aria-label={t('Insights sections', 'நுண்ணறிவுப் பிரிவுகள்')}>
      <div className="container">
        <ul className="ins-tabs__list" ref={listRef}>
          {TABS.map((tab) => (
            <li key={tab.to}>
              <Link
                className="ins-tabs__tab"
                to={localePath(tab.to)}
                aria-current={current === tab.to ? 'page' : undefined}
                lang={lang === 'ta' && tab.label[0] === tab.label[1] ? 'en' : undefined}
              >
                {t(tab.label[0], tab.label[1])}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}

export default InsightsTabs;
