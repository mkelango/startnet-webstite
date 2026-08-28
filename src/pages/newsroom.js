/* ============================================================================
   NEWSROOM — one newsroom, every property
   ========================================================================== */

import { site, news, properties, propertyById } from '../data/site.js';
import { esc, eyebrow, pageHero, filterBar, linkArrow, iconArrow, tag } from '../lib/ui.js';

const filters = [
  { label: 'All', value: 'all' },
  ...properties.map((p) => ({ label: p.name, value: p.id, swatch: p.swatch })),
  { label: 'StartNet', value: 'startnet', swatch: 'var(--sn-signal)' },
];

const row = (n, i) => {
  const p = n.propertyId ? propertyById[n.propertyId] : null;
  const rel = n.external ? ' target="_blank" rel="noopener"' : '';
  return `
  <a class="news__row" href="${esc(n.href)}"${rel}
     style="--prop:${p ? p.swatch : 'var(--sn-signal)'}"
     data-property="${esc(n.propertyId || 'startnet')}"
     data-reveal="rise" data-reveal-i="${i}">
    <span class="news__row-meta">
      ${tag(p ? p.name : 'StartNet', p ? p.swatch : 'var(--sn-signal)')}
      <time datetime="${esc(n.date)}">${esc(n.dateDisplay)}</time>
    </span>
    <span>
      <span class="news__row-title">${esc(n.title)}</span>
      <span class="news__row-summary">${esc(n.summary)}</span>
    </span>
    <span class="news-card__badge" aria-hidden="true">${iconArrow()}</span>
  </a>`;
};

const list = () => `
<section class="section" id="all-news" data-surface="newsroom">
  <div class="shell">
    <div class="section-head section-head--split" data-reveal-group>
      <div class="section-head__lead">
        ${filterBar(filters, { name: 'property' })}
      </div>
      <div class="section-head__aside">
        <p class="filter-status" data-filter-status="property" role="status" aria-live="polite"></p>
      </div>
    </div>

    <div class="news__list" data-filter-target="property" data-reveal-group>
      ${news.map(row).join('')}
    </div>

    <p class="filter-empty" data-filter-empty="property" hidden>
      Nothing filed under that property yet.
    </p>
  </div>
</section>`;

const pressBox = () => `
<section class="section section--tight" data-theme="paper" data-surface="press">
  <div class="shell event__compact-shell" data-reveal-group>
    <p class="event__compact-text" data-reveal="fade">
      <span class="event__compact-dot" style="--prop:var(--sn-signal)" aria-hidden="true"></span>
      For interviews, data requests or media partnerships:
      <strong>${esc(site.email.press)}</strong>
    </p>
    ${linkArrow({ label: 'Email the press desk', href: `mailto:${site.email.press}` })}
  </div>
</section>`;

export const newsroomPage = () => ({
  path: '/newsroom',
  title: 'StartNet Newsroom — Announcements across the ecosystem',
  description:
    'The latest news, cohort results and event announcements from across StartNet X, Connect, Research, Vibe and AI.',
  bodyClass: 'page-newsroom',
  main: [
    pageHero({
      label: 'Newsroom',
      title: 'One newsroom. {Every property}[.]',
      deck: 'Announcements, results and press coverage from across the StartNet ecosystem — filter by property or browse everything.',
      ringOpts: {
        states: ['path', 'measure', 'orbit'],
        arc: 190,
        from: -175,
        solid: 70,
        count: 34,
        size: 'md',
        tone: 'accent',
      },
    }),
    list(),
    pressBox(),
  ].join('\n'),
  schema: JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'StartNet Newsroom',
    url: `${site.origin}/newsroom`,
    hasPart: news.map((n) => ({
      '@type': 'NewsArticle',
      headline: n.title,
      datePublished: n.date,
      description: n.summary,
      url: n.external ? n.href : `${site.origin}${n.href}`,
    })),
  }),
});
