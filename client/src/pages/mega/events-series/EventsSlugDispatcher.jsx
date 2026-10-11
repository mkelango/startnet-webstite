// /events/:slug dispatcher. Series pages (/events/vibathon, /events/saas-connect …, Book 1 Part B §2.2) share the
// URL space with event detail pages (/events/vibathon-2027). Known series render SeriesPage at once.
// An event that belongs to a series (event.series set) is an edition: Book 1 §7.4 makes /events/<series>/<edition>
// its canonical URL, so the flat /events/<series>-<edition> form redirects there (replace, keeping ?query and #hash,
// /ta prefix kept by localePath). The server also 301s that form (routes.ts redirectFor) and leaves it out of sitemap.xml.
// Events without a series keep rendering the existing EventDetail. When the event lookup 404s and /api/events has
// editions in a series of that name (a series added to the data after this build), SeriesPage renders instead.
// The integrator points the existing `events/:slug` route at this component (static routes such as events/past,
// events/speak, events/host and events/founders-day still win over :slug in React Router).
import { Navigate, useLocation, useParams } from 'react-router-dom';
import { PageLoader } from '../../../components';
import { useApi } from '../../../hooks/useApi.js';
import { useLang } from '../../../lib/i18n.jsx';
import EventDetail from '../../events/EventDetail.jsx';
import SeriesPage from './SeriesPage.jsx';
import { isKnownSeries, editionKeyOf, editionPath } from './seriesData.js';

export default function EventsSlugDispatcher() {
  const { slug = '' } = useParams();
  const { search, hash } = useLocation();
  const { localePath } = useLang();
  const known = isKnownSeries(slug);
  // Same path string EventDetail uses, so the request is shared (in-flight dedupe + cache in useApi).
  const ev = useApi(known ? null : `/api/events/${encodeURIComponent(slug)}`);
  const missing = !known && !!ev.error && /^404/.test(ev.error.message || '');
  const ser = useApi(missing ? `/api/events?series=${encodeURIComponent(slug)}` : null);

  if (known) return <SeriesPage series={slug} />;
  if (ev.loading) return <PageLoader />;
  const e = ev.data;
  if (e && typeof e === 'object' && typeof e.series === 'string' && e.series && e.slug === slug && editionKeyOf(e)) {
    return <Navigate to={{ pathname: localePath(editionPath(e)), search, hash }} replace />;
  }
  if (!missing) return <EventDetail />;
  if (ser.loading) return <PageLoader />;
  if (Array.isArray(ser.data) && ser.data.some((s) => s.series === slug)) return <SeriesPage series={slug} />;
  return <EventDetail />;
}
