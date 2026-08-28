/* ============================================================================
   CAREERS — every opening across the ecosystem, in one place
   ========================================================================== */

import { site, jobs, properties, propertyById } from '../data/site.js';
import { esc, pageHero, filterBar, linkArrow, iconArrow, tag } from '../lib/ui.js';

const filters = [
  { label: 'All', value: 'all' },
  { label: 'StartNet', value: 'startnet', swatch: 'var(--sn-signal)' },
  ...properties.map((p) => ({ label: p.name, value: p.id, swatch: p.swatch })),
];

const jobRow = (j, i) => {
  const p = j.propertyId ? propertyById[j.propertyId] : null;
  return `
  <a class="job" href="${esc(j.href)}"
     style="--prop:${p ? p.swatch : 'var(--sn-signal)'}"
     data-property="${esc(j.propertyId || 'startnet')}"
     data-reveal="rise" data-reveal-i="${i}">
    <span>
      <span class="job__title">${esc(j.title)}</span>
      <span class="job__meta">
        ${tag(j.propertyLabel, p ? p.swatch : 'var(--sn-signal)')}
        <span>${esc(j.location)}</span>
        <span>${esc(j.type)}</span>
      </span>
      <span class="job__summary">${esc(j.summary)}</span>
    </span>
    <span class="news-card__badge" aria-hidden="true">${iconArrow()}</span>
  </a>`;
};

const listing = () => `
<section class="section" id="openings" data-surface="careers">
  <div class="shell">
    <div class="section-head section-head--split" data-reveal-group>
      <div class="section-head__lead">
        ${filterBar(filters, { name: 'property' })}
      </div>
      <div class="section-head__aside">
        <p class="filter-status" data-filter-status="property" role="status" aria-live="polite"></p>
      </div>
    </div>

    <div class="jobs" data-filter-target="property" data-reveal-group>
      ${jobs.map(jobRow).join('')}
    </div>

    <p class="filter-empty" data-filter-empty="property" hidden>
      Nothing open in that part of the ecosystem right now.
    </p>
  </div>
</section>`;

const general = () => `
<section class="section section--tight" data-theme="paper" data-surface="careers-general">
  <div class="shell event__compact-shell" data-reveal-group>
    <p class="event__compact-text" data-reveal="fade">
      <span class="event__compact-dot" style="--prop:var(--sn-signal)" aria-hidden="true"></span>
      Nothing open right now that fits?
    </p>
    ${linkArrow({
      label: 'Send us a general application',
      href: `mailto:${site.email.careers}?subject=General%20application`,
    })}
  </div>
</section>`;

export const careersPage = () => ({
  path: '/careers',
  title: 'Careers at StartNet: Openings across the ecosystem',
  description:
    'Open roles across StartNet X, Connect, Research, Vibe and AI, one place to see everything.',
  bodyClass: 'page-careers',
  main: [
    pageHero({
      label: 'Careers',
      title: 'Build the infrastructure, {not just a product}[.]',
      deck: 'Openings across every part of the StartNet ecosystem, listed in one place.',
      ringOpts: {
        states: ['path', 'signal', 'orbit'],
        arc: 195,
        from: -170,
        solid: 75,
        count: 32,
        size: 'md',
        tone: 'accent',
      },
    }),
    listing(),
    general(),
  ].join('\n'),
  schema: JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Careers at StartNet',
    url: `${site.origin}/careers`,
    hasPart: jobs.map((j) => ({
      '@type': 'JobPosting',
      title: j.title,
      description: j.summary,
      employmentType: j.type,
      hiringOrganization: { '@type': 'Organization', name: j.propertyLabel },
      jobLocation: {
        '@type': 'Place',
        address: { '@type': 'PostalAddress', addressLocality: j.location },
      },
    })),
  }),
});
