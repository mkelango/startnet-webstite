/* ============================================================================
   AI — StartNet AI
   Strategy §5.2 (AI submenu) and §6.5 — rewritten around the evidence.
   Domain-specific models do not survive contact with the evidence; domain-
   specific products do. This page states the thesis, the evidence for it,
   and the counter-evidence that makes the corrected version actually work.
   ========================================================================== */

import { site, properties, propertyById } from '../data/site.js';
import {
  accent,
  esc,
  eyebrow,
  button,
  ring,
  pageHero,
  sectionHead,
  linkArrow,
} from '../lib/ui.js';

const brand = propertyById.ai;

const jump = () => `
<section class="section section--tight" data-surface="ai-jump">
  <div class="shell">
    <div class="routes" style="max-width:720px;margin:0 auto">
      ${[
        ['Domain AI', '#domain'],
        ['nooru.ai', '#nooru'],
        ['GCC partnerships', '#gcc'],
        ['AI transformation', '#transformation'],
        ['How we build', '#how'],
      ]
        .map(
          ([label, href]) => `
        <a class="route" href="${href}" style="--prop:${brand.swatch}">
          <span class="route__dot" aria-hidden="true"></span>
          <span class="route__label"><strong>${esc(label)}</strong></span>
          <svg class="icon" viewBox="0 0 16 16" aria-hidden="true" width="14" height="14"><path d="M4.5 11.5 11.5 4.5M5.75 4.5h5.75v5.75" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </a>`
        )
        .join('')}
    </div>
  </div>
</section>`;

const what = () => `
<section class="section section--tight" id="what" data-surface="ai-what">
  <div class="shell">
    <article class="prop-deep" style="--prop:${brand.swatch};border-top:0">
      <div class="prop-deep__lead">
        <span class="prop-deep__mark" data-reveal="fade">${esc(brand.kind)}</span>
        <h2 class="prop-deep__name" data-reveal="rise">StartNet AI</h2>
      </div>
      <div class="prop-deep__body">
        <p class="prop-deep__line" data-reveal="rise">${esc(brand.line)}</p>
        <p class="prop-deep__detail" data-reveal="rise">${esc(brand.detail)}</p>
        <dl class="prop-deep__best" data-reveal="fade">
          <dt>Best for</dt>
          <dd>${esc(brand.bestFor)}</dd>
        </dl>
      </div>
    </article>
  </div>
</section>`;

const thesis = () => `
<section class="section" id="how" data-theme="dark" data-surface="ai-thesis">
  <div class="shell story__shell">
    <div class="story__lead" data-reveal-group>
      ${eyebrow('How we build')}
      <h2 class="story__title display-2" data-reveal="rise">${accent(
        'Domain products, {not domain models.}'
      )}</h2>
    </div>
    <div class="story__body" data-reveal-group>
      <p class="story__para" data-reveal="rise">
        BloombergGPT — 50 billion parameters, a 363-billion-token proprietary corpus —
        was beaten by GPT-4 with zero financial pretraining at all. Seven medical
        LLMs tested against their own base models won 12.1% of the time and were
        significantly worse 38.2% of the time. Krutrim spent ₹10,000 crore and left
        model-building inside thirty months.
      </p>
      <p class="story__para" data-reveal="rise">
        And the counter-evidence is what makes the corrected thesis work: the same
        Bloomberg paper shows small fine-tuned models beating GPT-4 by 26 points on
        domain-specific entity recognition, and a 2026 industrial study found
        retrieval-augmented generation the most cost-efficient adaptation method,
        with 3-billion-parameter open models matching frontier ones.
      </p>
      <p class="story__para" data-reveal="rise">
        <strong>Small models win where the data is proprietary and the task is
        narrow. Frontier models win at language. We build the first and rent the
        second — training small vision and tabular models, renting the language
        layer from whoever is best that quarter, and owning the data access.</strong>
      </p>
    </div>
  </div>
  ${ring({
    states: ['network', 'signal', 'orbit'],
    arc: 210,
    from: 150,
    solid: 90,
    count: 40,
    size: 'lg',
    tone: 'accent',
    className: 'story__ring',
  })}
</section>`;

const domain = () => `
<section class="section" id="domain" data-theme="paper" data-surface="ai-domain">
  <div class="shell">
    ${sectionHead({
      label: 'Domain AI',
      title: 'Namakkal first. {The order matters.}',
      deck: 'No hardware, no new model, no IT literacy required of the farmer — the deliberately unglamorous first product.',
    })}
    <div class="tracks" data-reveal-group>
      <article class="track" data-reveal="rise" data-reveal-i="0">
        <p class="track__entry">Cluster 1 — poultry</p>
        <h3 class="track__title">Namakkal — egg-price and feed-cost forecasting</h3>
        <p class="track__body">
          The Competition Commission of India’s 2022 cease-and-desist order against
          the NECC removed the cluster’s price-coordination mechanism, and nobody
          replaced it with a forecast — an unserved need created by a regulator,
          the most durable kind. Cluster losses were reported at ₹5 crore a day
          during the March 2026 price crash.
        </p>
      </article>
      <article class="track" data-reveal="rise" data-reveal-i="1">
        <p class="track__entry">Cluster 2 — knitwear</p>
        <h3 class="track__title">Tiruppur — fabric defect detection</h3>
        <p class="track__body">A mature product category with real vendors and real prices — a harder sale than Namakkal, taken second on purpose.</p>
      </article>
      <article class="track" data-reveal="rise" data-reveal-i="2">
        <p class="track__entry">Cluster 3 — home textiles</p>
        <h3 class="track__title">Karur</h3>
        <p class="track__body">Third in sequence, each cluster a harder sale than the last.</p>
      </article>
    </div>
    <p class="proof__asof">
      An open-source computer-vision system has already run in 150+ Namakkal farms
      for seventeen years. Establishing whether that is a partner or a competitor
      comes before the first meeting, not after.
    </p>
    <div style="margin-top:var(--space-6)">
      ${linkArrow({ label: 'Propose a cluster', href: '/partners' })}
    </div>
  </div>
</section>`;

const nooru = () => `
<section class="section" id="nooru" data-theme="dark" data-surface="ai-nooru">
  <div class="shell story__shell">
    <div class="story__lead" data-reveal-group>
      ${eyebrow('nooru.ai')}
      <h2 class="story__title title-1" data-reveal="rise">${accent(
        'நூறு {means one hundred.}'
      )}</h2>
    </div>
    <div class="story__body" data-reveal-group>
      <p class="story__para" data-reveal="rise">
        A hundred founders, one flywheel cycle, real outcomes — a curated,
        diagnostic-gated cohort run through a structured programme, with direct
        access to StartNet’s investor network. It is the one name in the house that
        could stand alone if the cohort works, and it is treated with the lightest
        endorsement in the portfolio for exactly that reason.
      </p>
      ${button({ label: 'Apply to the cohort', href: 'mailto:hello@startnet.in?subject=nooru.ai%20cohort%20application', variant: 'primary' })}
    </div>
  </div>
</section>`;

const gcc = () => `
<section class="section" id="gcc" data-theme="paper" data-surface="ai-gcc">
  <div class="shell">
    ${sectionHead({
      label: 'GCC partnerships',
      title: 'Campus to GCC, {directly.}',
      align: 'stacked',
    })}
    <div class="who__grid" data-reveal-group>
      ${[
        ['For GCCs', 'Domain talent pipelines and live projects, sourced directly from StartNet Research labs and Vibe cohorts.'],
        ['Campus-to-GCC', 'A named pathway from a specific college to a specific GCC, not a generic placement drive.'],
        ['Live projects', 'Real GCC problems, run inside a lab or a cohort, not a simulated brief.'],
        ['Talent', 'Search across the full StartNet X directory, filtered by domain and diagnostic result.'],
      ]
        .map(
          ([title, body], i) => `
        <article class="who__card" style="--prop:${brand.swatch}" data-reveal="rise" data-reveal-i="${i}">
          <span class="who__dot" aria-hidden="true"></span>
          <h3 class="who__title">${esc(title)}</h3>
          <p class="who__body">${esc(body)}</p>
        </article>`
        )
        .join('')}
    </div>
  </div>
</section>`;

const transformation = () => `
<section class="section section--tight" id="transformation" data-surface="ai-transformation">
  <div class="shell event__compact-shell" data-reveal-group>
    <p class="event__compact-text" data-reveal="fade">
      <span class="event__compact-dot" style="--prop:${brand.swatch}" aria-hidden="true"></span>
      AI transformation — assessment, roadmaps, build, support. Custom development is
      opportunistic work, deliberately not the business: it has no leverage and it
      will eat the team if it becomes one.
    </p>
    ${linkArrow({ label: 'Start an assessment', href: '/partners' })}
  </div>
</section>`;

export const aiPage = () => ({
  path: '/ai',
  title: 'StartNet AI — Domain AI products, not domain-specific models',
  description:
    'StartNet AI trains small vision and tabular models, rents the language layer, and owns the data access — the nooru.ai cohort, GCC partnerships, and domain clusters starting with Namakkal.',
  bodyClass: 'page-ai',
  main: [
    pageHero({
      label: 'StartNet AI',
      title: 'What we build {and sell with industry}[.]',
      deck: brand.line,
      ringOpts: {
        states: ['network', 'orbit', 'path'],
        arc: 200,
        from: -165,
        solid: 85,
        count: 34,
        size: 'lg',
        tone: 'accent',
      },
    }),
    jump(),
    what(),
    thesis(),
    domain(),
    nooru(),
    gcc(),
    transformation(),
  ].join('\n'),
  schema: JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'StartNet AI',
    url: `${site.origin}/ai`,
    description: brand.line,
  }),
});
