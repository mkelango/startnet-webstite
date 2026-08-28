/* ============================================================================
   VIBE — StartNet Vibe
   Strategy §5.2 (Vibe submenu) and §6.4. Three products on one ladder —
   Vibathon's 80% tier-3/4 reach is, per the strategy, the single most
   distinctive asset in the house.
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
  stat,
} from '../lib/ui.js';

const brand = propertyById.vibe;

const jump = () => `
<section class="section section--tight" data-surface="vibe-jump">
  <div class="shell">
    <div class="routes" style="max-width:720px;margin:0 auto">
      ${[
        ['Vibe Academy', '#academy'],
        ['Vibathon', '#vibathon'],
        ['Vibe Summits', '#summits'],
        ['For colleges', '#colleges'],
        ['For students', '#students'],
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
<section class="section section--tight" id="what" data-surface="vibe-what">
  <div class="shell">
    <article class="prop-deep" style="--prop:${brand.swatch};border-top:0">
      <div class="prop-deep__lead">
        <span class="prop-deep__mark" data-reveal="fade">${esc(brand.kind)}</span>
        <h2 class="prop-deep__name" data-reveal="rise">StartNet Vibe</h2>
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

const academy = () => `
<section class="section" id="academy" data-theme="paper" data-surface="vibe-academy">
  <div class="shell">
    ${sectionHead({
      label: 'Vibe Academy',
      title: 'Faculty development {is the product}[.]',
      deck: 'Not student courses. A college can be sold faculty training out of an existing budget line, and trained faculty are what make a lab survive after the installer leaves.',
    })}
    <div class="tracks" data-reveal-group>
      ${[
        ['Courses', 'AI education on the four flywheel tracks: Perception, Generative, Agentic, Physical.'],
        ['Cohorts', 'Fixed intake windows, run alongside the academic calendar, not against it.'],
        ['Certification', 'A formal assessment path recognised across the StartNet Research lab network.'],
        ['Fees', 'Priced against an existing faculty-development budget line, the easiest first rupee in the house.'],
      ]
        .map(
          ([title, body], i) => `
        <article class="track" data-reveal="rise" data-reveal-i="${i}">
          <p class="track__entry">Academy</p>
          <h3 class="track__title">${esc(title)}</h3>
          <p class="track__body">${esc(body)}</p>
        </article>`
        )
        .join('')}
    </div>
  </div>
</section>`;

const vibathon = () => `
<section class="section" id="vibathon" data-theme="dark" data-surface="vibe-vibathon">
  <div class="shell story__shell">
    <div class="story__lead" data-reveal-group>
      ${eyebrow('Vibathon')}
      <h2 class="story__title display-2" data-reveal="rise">${accent(
        'Reach no metro event has, {and it is real.}'
      )}</h2>
    </div>
    <div class="story__body" data-reveal-group>
      <p class="story__para" data-reveal="rise">
        Smart India Hackathon and every metro event reach tier 1 and tier 2 colleges.
        Vibathon’s reach is genuinely tier 3 and tier 4, the differentiator worth
        saying out loud, rather than an unverifiable “largest hackathon” claim.
      </p>
      ${button({ label: 'Host a Vibathon', href: '/partners', variant: 'primary' })}
    </div>
    <div class="proof__grid" data-reveal-group style="grid-column:1/-1;margin-top:var(--space-8);max-width:220px">
      ${stat(
        { value: 80, display: '80%', label: 'of participating colleges are tier 3 and 4', source: 'Vibathon 2025 brochure' },
        { index: 0 }
      )}
    </div>
  </div>
  ${ring({
    states: ['signal', 'orbit'],
    arc: 210,
    from: 150,
    solid: 90,
    count: 38,
    size: 'lg',
    tone: 'accent',
    className: 'story__ring',
  })}
</section>`;

const summits = () => `
<section class="section" id="summits" data-surface="vibe-summits">
  <div class="shell">
    ${sectionHead({
      label: 'Vibe Summits',
      title: 'Cheap, {high-frequency.}',
      deck: 'Campus summits run with the host institution: the recruiting engine for both Vibathon and Academy.',
      cta: { label: 'Host a summit', href: '/partners', variant: 'primary' },
    })}
  </div>
</section>`;

const audiences = () => `
<section class="section" data-theme="paper" data-surface="vibe-audiences">
  <div class="shell">
    <div class="who__grid" data-reveal-group>
      <article class="who__card" id="colleges" style="--prop:${brand.swatch}" data-reveal="rise" data-reveal-i="0">
        <span class="who__dot" aria-hidden="true"></span>
        <h3 class="who__title">For colleges</h3>
        <p class="who__body">Partner with Vibe: what we bring, what you provide, and how the fees work against your faculty-development budget.</p>
        ${linkArrow({ label: 'Partner with Vibe', href: '/partners' })}
      </article>
      <article class="who__card" id="students" style="--prop:${brand.swatch}" data-reveal="rise" data-reveal-i="1">
        <span class="who__dot" aria-hidden="true"></span>
        <h3 class="who__title">For students</h3>
        <p class="who__body">Start with a campus summit, run the ladder: Summit → Academy → Vibathon → a nooru.ai cohort → StartNet X.</p>
        ${linkArrow({ label: 'Start here', href: '/platform' })}
      </article>
    </div>
  </div>
</section>`;

export const vibePage = () => ({
  path: '/vibe',
  title: 'StartNet Vibe: How a student becomes a builder',
  description:
    'StartNet Vibe is Vibe Academy, Vibathon and Vibe Summits: the ladder from a first campus summit to a founded company, with 80% of Vibathon colleges tier 3 and 4.',
  bodyClass: 'page-vibe',
  main: [
    pageHero({
      label: 'StartNet Vibe',
      title: 'How a student {becomes a builder}[.]',
      deck: 'Summits recruit, the Academy trains, Vibathon proves it, on a ladder that reaches tier 3 and tier 4 colleges no metro event touches.',
      ringOpts: {
        states: ['path', 'measure', 'orbit'],
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
    academy(),
    vibathon(),
    summits(),
    audiences(),
  ].join('\n'),
  schema: JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'EducationalOrganization',
    name: 'StartNet Vibe',
    url: `${site.origin}/vibe`,
    description: brand.line,
  }),
});
