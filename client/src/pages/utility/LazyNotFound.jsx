import { lazy, Suspense } from 'react';

/* Detail pages render the 404 only when a slug misses. Loading it lazily keeps NotFound's JS and CSS
   out of every valid detail page's bundle (perf audit: 0% of NotFound CSS used on a found page). */
const NotFound = lazy(() => import('./NotFound.jsx'));

export default function LazyNotFound(props) {
  return (
    <Suspense fallback={null}>
      <NotFound {...props} />
    </Suspense>
  );
}
