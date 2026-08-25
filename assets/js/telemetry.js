/* ============================================================================
   OUTBOUND TRACKING
   ----------------------------------------------------------------------------
   Strategy §8.4 and §9: this site's primary success metric is how well it
   routes people to the right door, and that is only measurable if outbound
   click tracking exists before launch rather than being retrofitted.

   This module is analytics-agnostic on purpose. It pushes a normalised event
   to window.dataLayer (GTM), calls gtag if present, and always emits a DOM
   CustomEvent so any other tool can subscribe. No vendor script is bundled,
   so nothing here sets a cookie or contacts a third party on its own.
   ========================================================================== */

const PROPERTY_DOMAINS = {
  'aiflywheel.in': 'flywheel',
  'nooru.ai': 'nooru',
  'agenticaiconnect.in': 'agentic',
  'physicalaiconnect.in': 'physical',
  'snx.in': 'snx',
};

function propertyFor(url) {
  try {
    const host = new URL(url, window.location.origin).hostname.replace(/^www\./, '');
    return PROPERTY_DOMAINS[host] || null;
  } catch {
    return null;
  }
}

/** The nearest named region of the page, so we can tell which module routed. */
function surfaceFor(el) {
  const named = el.closest('[data-surface]');
  if (named) return named.dataset.surface;
  const section = el.closest('section[id]');
  return section ? section.id : 'unknown';
}

export function emit(name, payload = {}) {
  const detail = { event: name, ...payload, ts: Date.now() };
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(detail);
  if (typeof window.gtag === 'function') window.gtag('event', name, payload);
  document.dispatchEvent(new CustomEvent(`sn:${name}`, { detail }));
}

export function initOutboundTracking() {
  document.addEventListener(
    'click',
    (e) => {
      const link = e.target.closest('a[href]');
      if (!link) return;

      const href = link.getAttribute('href');
      if (!href || href.startsWith('#')) return;

      if (href.startsWith('mailto:')) {
        emit('contact_click', { channel: 'email', to: href.slice(7), surface: surfaceFor(link) });
        return;
      }

      const property = propertyFor(href);
      if (property) {
        emit('portfolio_outbound', {
          property,
          domain: new URL(href, window.location.origin).hostname.replace(/^www\./, ''),
          surface: surfaceFor(link),
          label: link.textContent.trim().slice(0, 80),
        });
        return;
      }

      const isExternal = /^https?:\/\//i.test(href) && !href.includes(window.location.host);
      if (isExternal) {
        emit('outbound', { href, surface: surfaceFor(link) });
      }
    },
    { capture: true }
  );
}
