// Upcoming / Past folder tabs for the events listing (docs/redesign/SPEC.md §5.4 #2, §4.9 `folder`).
// The two tabs are routes (/events, /events/past), so they are links in a <nav> with aria-current="page", not an
// ARIA tablist; the look is the kit's folder variant (full-bleed Bone strip, the current tab Paper so it merges
// with the Paper listing below). Labels are the pages' own section titles. Works without JS and in the prerender.
import { Link } from 'react-router-dom';
import { useLang } from '../../../lib/i18n.jsx';
import './EventsTabs.css';

export default function EventsTabs({ current = 'upcoming' }) {
  const { t, localePath } = useLang();
  const tabs = [
    { id: 'upcoming', to: '/events', label: t('Upcoming events', 'வரவிருக்கும் நிகழ்வுகள்') },
    { id: 'past', to: '/events/past', label: t('Past events', 'கடந்த நிகழ்வுகள்') },
  ];
  return (
    <nav className="events-tabs" aria-label={t('Events', 'நிகழ்வுகள்')}>
      <div className="container">
        <ul className="events-tabs__list">
          {tabs.map((tb) => (
            <li key={tb.id}>
              <Link
                to={localePath(tb.to)}
                className={`events-tabs__tab${tb.id === current ? ' is-current' : ''}`}
                aria-current={tb.id === current ? 'page' : undefined}
              >
                {tb.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
