/* ============================================================================
   PORTFOLIO — the deeper version of the homepage grid
   Same canonical one-line description at the top of every block, plus the
   detail and a "best for" tag. Consistency here is the whole point.
   ========================================================================== */

import { site, properties, propertiesByGroup } from '../data/site.js';
import { accent, esc, eyebrow, button, ring, pageHero, linkArrow } from '../lib/ui.js';

const deepBlock = (p, i) => `
  <article class="prop-deep" id="${esc(p.id)}" style="--prop:${p.swatch}"
           data-reveal-group data-surface="portfolio-${esc(p.id)}">
    <div class="prop-deep__lead">
      <span class="prop-deep__mark" data-reveal="fade">${esc(p.kind)}</span>
      <h3 class="prop-deep__name" data-reveal="rise">${esc(p.name)}</h3>
      ${button({
        label: `Visit ${p.domain}`,
        href: p.href,
        external: true,
        variant: 'primary',
        size: 'sm',
      })}
    </div>
    <div class="prop-deep__body">
      <p class="prop-deep__line" data-reveal="rise">${esc(p.line)}</p>
      <p class="prop-deep__detail" data-reveal="rise">${esc(p.detail)}</p>
      <dl class="prop-deep__best" data-reveal="fade">
        <dt>Best for</dt>
        <dd>${esc(p.bestFor)}</dd>
      </dl>
    </div>
  </article>`;

const groupSection = (g, gi) => `
<section class="section${gi % 2 === 1 ? '' : ''}" id="group-${esc(g.id)}"
         ${gi % 2 === 1 ? 'data-theme="paper"' : ''} data-surface="portfolio-group-${esc(g.id)}">
  <div class="shell">
    <header class="portfolio__group-head" data-reveal-group>
      <h2 class="portfolio__group-label" data-reveal="fade">${esc(g.label)}</h2>
      <p class="portfolio__group-note" data-reveal="fade">${esc(g.note)}</p>
    </header>
    ${g.items.map(deepBlock).join('')}
  </div>
</section>`;

const index = () => `
<section class="section section--tight" data-surface="portfolio-index">
  <div class="shell">
    <nav class="orbit__rail" aria-label="Jump to a property">
      <p class="orbit__rail-label">Five doors</p>
      <ul class="orbit__list">
        ${properties
          .map(
            (p) => `
          <li>
            <a class="orbit__item" href="#${esc(p.id)}" style="--prop:${p.swatch}">
              <span class="orbit__item-dot" aria-hidden="true"></span>
              <span class="orbit__item-name">${esc(p.name)}</span>
              <span class="orbit__item-kind">${esc(p.kind)}</span>
            </a>
          </li>`
          )
          .join('')}
      </ul>
    </nav>
  </div>
</section>`;

const closing = () => `
<section class="section" data-theme="dark" data-surface="portfolio-closing">
  <div class="shell story__shell">
    <div class="story__lead" data-reveal-group>
      ${eyebrow('Still choosing')}
      <h2 class="story__title title-1" data-reveal="rise">${accent(
        'Not sure which door? {Start with the diagnostic}[.]'
      )}</h2>
    </div>
    <div class="story__body" data-reveal-group>
      <p class="story__para" data-reveal="rise">
        The SNX founder diagnostic exists precisely for this. It takes a few minutes,
        it is free, and it ends with a specific next step rather than a brochure.
      </p>
      ${button({ label: 'Go to snx.in', href: 'https://snx.in', external: true, variant: 'primary' })}
    </div>
  </div>
  ${ring({
    states: ['signal', 'path', 'orbit'],
    arc: 220,
    from: 140,
    solid: 80,
    count: 34,
    size: 'lg',
    tone: 'accent',
    className: 'story__ring',
  })}
</section>`;

export const portfolioPage = () => ({
  path: '/portfolio',
  title: 'The StartNet Portfolio — Five properties, one ecosystem',
  description:
    'A closer look at AI Flywheel, Nooru.AI, Agentic AI Connect, Physical AI Connect and SNX — what each one does and who it is for.',
  bodyClass: 'page-portfolio',
  main: [
    pageHero({
      label: 'Portfolio',
      title: 'Five doors. {Here’s what’s behind each one}[.]',
      deck: 'Each property keeps its own name, its own site and its own numbers. This page is the map, not the destination.',
      ringOpts: {
        states: ['network', 'path', 'orbit'],
        arc: 210,
        from: -170,
        solid: 80,
        count: 36,
        size: 'lg',
        tone: 'accent',
      },
    }),
    index(),
    ...propertiesByGroup.map(groupSection),
    closing(),
  ].join('\n'),
  schema: JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'The StartNet Portfolio',
    url: `${site.origin}/portfolio`,
    hasPart: properties.map((p) => ({
      '@type': 'Organization',
      name: p.name,
      url: p.href,
      description: p.line,
    })),
  }),
});
