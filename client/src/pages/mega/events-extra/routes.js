// Mega-menu pages for the "events-extra" group. Read by the integration step (App.jsx routes, nav.js, server sitemap).
// Both paths are static and must be registered BEFORE the `events/:slug` catch-all in App.jsx.
export const MEGA_ROUTES = [
  {
    path: 'events/host',
    file: './HostEvent.jsx',
    brand: null,
    navLabel: 'Host an event in your college or district',
    phase: 2,
    menu: { section: 'Events', replaces: '/events#host' },
    slugs: null,
    bottomCta: { label: 'Enquire about hosting', to: '/events/host#host-form' },
    notes:
      'T19 + T13 form (SmartForm type "host"; fields name, email, phone, organisation, district, format, message). ' +
      'Events.jsx still has an inline #host form; integration may point its "Host an event" buttons to /events/host. ' +
      'Breadcrumb: Home › Events › Host an event.',
  },
  {
    path: 'events/founders-day',
    file: './FoundersDay.jsx',
    brand: null,
    navLabel: 'StartNet Founders Day',
    phase: 3,
    menu: { section: 'Events', replaces: '/events/founders-day' },
    slugs: null,
    bottomCta: { label: 'Register interest', to: '/events/founders-day#fday-interest' },
    notes:
      'T04 event series, status Planned. nav.js entry is currently { phase: 3, unpublished: true } — integration decides whether to publish. ' +
      'Editions read from /api/events?series=founders-day (none in events.json yet). SmartForm type "interest" with hidden programme=founders-day. ' +
      'FLAGSHIPS in pages/events/parts/eventMeta.js has the fday entry without `to`; integration may add to: "/events/founders-day".',
  },
];

export default MEGA_ROUTES;
