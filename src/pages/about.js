/* ============================================================================
   ABOUT
   ========================================================================== */

import { site, beliefs, properties, propertyById } from '../data/site.js';
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

const story = () => `
<section class="section" id="story" data-surface="about-story">
  <div class="shell story__shell">
    <div class="story__lead" data-reveal-group>
      ${eyebrow('Our story')}
      <h2 class="story__title title-1" data-reveal="rise">${accent(
        'We build the infrastructure. {Founders build the companies}[.]'
      )}</h2>
    </div>
    <div class="story__body prose" data-reveal-group>
      <p data-reveal="rise">
        StartNet started with a simple observation: Tamil Nadu had the talent, the
        government support and the ambition to build a world-class AI startup
        ecosystem. What it did not have was the connective infrastructure to make
        all three compound.
      </p>
      <p data-reveal="rise">
        So we built it, one property at a time — training and research through
        <strong>AI Flywheel</strong>, a flagship accelerator through
        <strong>Nooru.AI</strong>, two annual gatherings through
        <strong>Agentic AI Connect</strong> and <strong>Physical AI Connect</strong>,
        and a year-round home for founders through <strong>SNX</strong>.
      </p>
      <p data-reveal="rise">
        None of them report into this page. Each one stands on its own name, its own
        domain and its own numbers. StartNet is the entity that stands behind all five.
      </p>
    </div>
  </div>
</section>`;

const believe = () => `
<section class="section section--tight" id="beliefs" data-theme="paper" data-surface="beliefs">
  <div class="shell">
    ${sectionHead({
      label: 'What we believe',
      title: 'Three commitments we can be {held to}[.]',
      align: 'stacked',
    })}
    <div class="pillars" data-pillars>
      <div class="pillars__list">
        ${beliefs
          .map(
            (b, i) => `
          <article class="pillar${i === 0 ? ' is-active' : ''}" data-pillar
                   data-pillar-state="${['orbit', 'measure', 'network'][i] || 'path'}">
            <span class="pillar__n">${esc(b.n)}</span>
            <h3 class="pillar__title">${esc(b.title)}</h3>
            <p class="pillar__body">${esc(b.body)}</p>
          </article>`
          )
          .join('')}
      </div>
      <div class="pillars__stage">
        ${ring({
          states: ['orbit', 'measure', 'network'],
          arc: 300,
          from: -90,
          solid: 40,
          count: 44,
          size: 'md',
          tone: 'accent',
          spin: false,
        })}
      </div>
    </div>
  </div>
</section>`;

const thinktn = () => `
<section class="section" id="think-tn" data-theme="dark" data-surface="think-tn">
  <div class="shell story__shell">
    <div class="story__lead" data-reveal-group>
      ${eyebrow('Relationships')}
      <h2 class="story__title title-1" data-reveal="rise">${accent(
        'How we work with {Think TN and AITN}'
      )}</h2>
    </div>
    <div class="story__body" data-reveal-group>
      <p class="story__para" data-reveal="rise">
        StartNet operates as an independent commercial company, working alongside
        Think TN and AITN’s broader mission for an AI-driven Tamil Nadu. We contribute
        evidence and pipeline. We do not share their governance structure or their
        nonprofit obligations — a deliberate separation that keeps both organisations
        moving at the right speed for what they each do.
      </p>
      ${button({ label: 'Talk to our partnerships team', href: '/partners', variant: 'primary' })}
    </div>
  </div>
  ${ring({
    states: ['network', 'orbit'],
    arc: 190,
    from: 130,
    solid: 100,
    count: 36,
    size: 'lg',
    tone: 'accent',
    className: 'story__ring',
  })}
</section>`;

const leadership = () => `
<section class="section" id="leadership" data-surface="leadership">
  <div class="shell">
    ${sectionHead({
      label: 'Leadership',
      title: 'One accountable owner, {five stakeholders}[.]',
      deck: 'A single owner is accountable for what this page says, with a review checkpoint whenever any property launches something new.',
      align: 'split',
    })}
    <div class="tracks" data-reveal-group>
      ${[
        {
          role: 'Founder & Chief Executive',
          note: 'Accountable for the portfolio, the masterbrand, and every number published on this site.',
        },
        {
          role: 'Head of Ecosystem',
          note: 'Runs the relationships across government, institutions and the investor network.',
        },
        {
          role: 'Head of Capability',
          note: 'Owns the ladder from diagnostic to certification across Flywheel and Nooru.',
        },
      ]
        .map(
          (l, i) => `
        <article class="track" data-reveal="rise" data-reveal-i="${i}">
          <p class="track__entry">Name to be confirmed</p>
          <h3 class="track__title">${esc(l.role)}</h3>
          <p class="track__body">${esc(l.note)}</p>
        </article>`
        )
        .join('')}
    </div>
    <p class="proof__asof">
      Named biographies are withheld until confirmed. This page follows the same rule
      as the proof section — nothing goes up that cannot be verified.
    </p>
  </div>
</section>`;

const closing = () => `
<section class="section section--tight" data-theme="paper" data-surface="about-closing">
  <div class="shell event__compact-shell" data-reveal-group>
    <p class="event__compact-text" data-reveal="fade">
      Want to know more about a specific part of the ecosystem?
    </p>
    ${linkArrow({ label: 'See the full portfolio', href: '/portfolio' })}
  </div>
</section>`;

export const aboutPage = () => ({
  path: '/about',
  title: 'About StartNet — Building Tamil Nadu’s AI startup infrastructure',
  description:
    'StartNet is the commercial engine behind Tamil Nadu’s AI startup ecosystem — training, acceleration, and the annual gatherings that bring founders, investors and government together.',
  bodyClass: 'page-about',
  main: [
    pageHero({
      label: 'About',
      title: 'We build the infrastructure. {Founders build the companies}[.]',
      deck: site.narrative,
      ringOpts: {
        states: ['path', 'orbit', 'network'],
        arc: 200,
        from: -160,
        solid: 90,
        count: 32,
        size: 'lg',
        tone: 'accent',
      },
    }),
    story(),
    believe(),
    thinktn(),
    leadership(),
    closing(),
  ].join('\n'),
  schema: JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: 'About StartNet',
    url: `${site.origin}/about`,
    description: site.narrative,
    about: {
      '@type': 'Organization',
      name: site.name,
      url: site.origin,
      subOrganization: properties.map((p) => ({
        '@type': 'Organization',
        name: p.name,
        url: p.href,
      })),
    },
  }),
});
