/* ============================================================================
   ABOUT
   Rebuilt per STARTTNWEBSITESTRATEGY.md §1.1, §3.3, §4, §5.2. Anchors on this
   page (#story #flywheel #house #numbers #people) are what the header's
   About mega-menu and mobile accordion link into.
   ========================================================================== */

import {
  site,
  beliefs,
  properties,
  flywheel,
  coreDrive,
  houseRelationship,
  brandGate,
  proof,
} from '../data/site.js';
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
import { rocketMark } from '../lib/layout.js';

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
        So we built it as one house with five doors: an account every founder has
        through <strong>StartNet X</strong>, two flagship gatherings through
        <strong>StartNet Connect</strong>, an accreditation route for colleges through
        <strong>StartNet Research</strong>, a ladder from student to builder through
        <strong>StartNet Vibe</strong>, and the products we build with industry through
        <strong>StartNet AI</strong>.
      </p>
      <p data-reveal="rise">
        Each door stands on its own name and its own numbers. Together, on one
        account, they are the operating system for building an AI company in
        Tamil Nadu.
      </p>
    </div>
  </div>
</section>`;

/* --------------------------------------------------------------------------
   THE AI FLYWHEEL — fixed (strategy §4)
   Perception credited to Jensen Huang's CES 2025 progression rather than
   silently reused; the loop back into Perception is StartNet's own
   contribution, and it is what makes this a flywheel rather than a ladder.
   ----------------------------------------------------------------------- */
const flywheelSection = () => `
<section class="section" id="flywheel" data-theme="dark" data-surface="flywheel">
  <div class="shell">
    ${sectionHead({
      label: 'The AI Flywheel',
      title: 'A ladder is not a flywheel. {A loop is}[.]',
      deck: 'Physical AI, deployed in a real poultry shed or a real knitting floor, generates data no public corpus contains. That data makes Perception better, and Perception is where the next turn starts.',
      align: 'stacked',
    })}
    <ol class="journey" data-reveal-group aria-label="The AI Flywheel, stage by stage" style="margin-top:0">
      ${flywheel
        .map(
          (f, i) => `
        <li class="journey__step" style="--prop:var(--sn-signal)" data-reveal="rise" data-reveal-i="${i}">
          <span class="journey__node" aria-hidden="true"></span>
          <span class="journey__label">Stage ${i + 1}</span>
          <span class="journey__prop">${esc(f.stage)}</span>
          <span class="journey__body">${esc(f.body)}</span>
        </li>`
        )
        .join('')}
    </ol>
    <p class="proof__asof" data-reveal="fade">
      Stages two to four are Jensen Huang’s CES 2025 progression, credited rather than
      claimed as our own. Closing the loop from Data back into Perception is StartNet’s
      contribution, and it is the argument for why an ecosystem body in an industrial
      state has an advantage a lab in a metro does not.
    </p>

    <div class="pillars" style="margin-top:clamp(var(--space-16),8vw,var(--space-24))">
      <div class="pillars__list" style="gap:var(--space-10)">
        <article class="pillar is-active">
          <span class="pillar__n">CORE</span>
          <h3 class="pillar__title" style="font-size:var(--text-title-2)">The governance ring</h3>
          <p class="pillar__body">
            ${coreDrive.core.map((c) => `<strong>${esc(c.letter)}</strong>${esc(c.word)}`).join(' · ')}:
            the check every flywheel stage runs through.
          </p>
        </article>
        <article class="pillar is-active">
          <span class="pillar__n">DRIVE</span>
          <h3 class="pillar__title" style="font-size:var(--text-title-2)">The operating engine</h3>
          <p class="pillar__body">
            ${coreDrive.drive.map((d) => `<strong>${esc(d.letter)}</strong>${esc(d.word)}`).join(' · ')}.
            It maps almost exactly to the five doors: Diagnose is StartNet X,
            Research is StartNet Research, Incubate is StartNet AI, Validate is
            StartNet Vibe, Expand is StartNet Connect.
          </p>
        </article>
      </div>
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

/* --------------------------------------------------------------------------
   THE HOUSE — Think TN relationship (strategy §1.1)
   Stated in the same words this document uses, so nobody else states it for
   us: a shared founder is a related-party disclosure, not a secret.
   ----------------------------------------------------------------------- */
const house = () => `
<section class="section" id="house" data-theme="dark" data-surface="house">
  <div class="shell story__shell">
    <div class="story__lead" data-reveal-group>
      ${eyebrow('The house')}
      <h2 class="story__title title-1" data-reveal="rise">${accent(
        'How we work with {Think TN and AITN}'
      )}</h2>
    </div>
    <div class="story__body" data-reveal-group>
      <p class="story__para" data-reveal="rise">${esc(houseRelationship.intro)}</p>
      ${button({ label: 'Talk to our partnerships team', href: '/partners', variant: 'primary' })}
    </div>
  </div>

  <div class="shell" style="margin-top:clamp(var(--space-10),4vw,var(--space-16))" data-reveal-group>
    <div class="ds-panel ds-panel--dark" data-reveal="rise" style="overflow-x:auto">
      <table style="width:100%;border-collapse:collapse;font-size:var(--text-small)">
        <thead>
          <tr style="text-align:left;border-bottom:1px solid var(--color-line)">
            <th style="padding:var(--space-3) var(--space-4);color:var(--color-text-tertiary);font-weight:var(--weight-semibold)"></th>
            <th style="padding:var(--space-3) var(--space-4);color:var(--color-text-tertiary);font-weight:var(--weight-semibold)">Think TN Foundation</th>
            <th style="padding:var(--space-3) var(--space-4);color:var(--color-text-tertiary);font-weight:var(--weight-semibold)">StartNet</th>
          </tr>
        </thead>
        <tbody>
          ${houseRelationship.rows
            .map(
              (r) => `
          <tr style="border-bottom:1px solid var(--color-line)">
            <td style="padding:var(--space-3) var(--space-4);font-weight:var(--weight-semibold)">${esc(
              r.label
            )}</td>
            <td style="padding:var(--space-3) var(--space-4);color:var(--color-text-secondary)">${esc(
              r.thinktn
            )}</td>
            <td style="padding:var(--space-3) var(--space-4);color:var(--color-text-secondary)">${esc(
              r.startnet
            )}</td>
          </tr>`
            )
            .join('')}
        </tbody>
      </table>
    </div>
    <p class="proof__asof" data-reveal="fade">${esc(houseRelationship.note)}</p>
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

/* --------------------------------------------------------------------------
   NUMBERS — "the page that proves the method" (strategy §5.3)
   Nobody else in this market publishes one. It is the cheapest credibility
   on the site.
   ----------------------------------------------------------------------- */
const numbers = () => `
<section class="section" id="numbers" data-surface="numbers">
  <div class="shell">
    ${sectionHead({
      label: 'Our published figures',
      title: 'Every number, {sourced and dated}[.]',
      deck: proof.note,
    })}
    <div class="do-dont">
      <div class="do-dont__item do-dont__item--do">
        <span class="do-dont__tag">A: verified</span>
        Checked against a primary source: a government register, a published order,
        an audited filing.
      </div>
      <div class="do-dont__item">
        <span class="do-dont__tag" style="color:var(--color-text-tertiary)">B: reported</span>
        An organisation’s own claim (ours included), published as exactly that,
        never dressed up as independently verified.
      </div>
      <div class="do-dont__item do-dont__item--dont">
        <span class="do-dont__tag">C: estimate</span>
        An inference or a derived figure, marked as one, and never published as a
        quotation or a guarantee.
      </div>
    </div>
    <p class="proof__asof" style="margin-top:clamp(var(--space-10),4vw,var(--space-16))">
      A number without a tag and a date does not go on this site. See the Proof
      section on the homepage for the figures currently live under this rule.
    </p>
    <div style="margin-top:var(--space-6)">
      ${linkArrow({ label: 'See the numbers themselves', href: '/#proof' })}
    </div>
  </div>
</section>`;

/* --------------------------------------------------------------------------
   THE BRAND GATE (strategy §3.3)
   The rule that stops the house becoming nine brands again.
   ----------------------------------------------------------------------- */
const gate = () => `
<section class="section section--tight" data-theme="paper" data-surface="brand-gate">
  <div class="shell">
    ${sectionHead({
      label: 'How a sixth door would happen',
      title: 'Five is the ceiling, {and there is a gate}[.]',
      align: 'stacked',
    })}
    <ol class="journey" data-reveal-group aria-label="The five conditions a new brand must clear" style="grid-template-columns:repeat(5,minmax(0,1fr))">
      ${brandGate
        .map(
          (g, i) => `
        <li class="journey__step" style="--prop:var(--sn-signal)" data-reveal="rise" data-reveal-i="${i}">
          <span class="journey__node" aria-hidden="true"></span>
          <span class="journey__label">Condition ${i + 1}</span>
          <span class="journey__body">${esc(g)}</span>
        </li>`
        )
        .join('')}
    </ol>
  </div>
</section>`;

/* --------------------------------------------------------------------------
   PEOPLE (strategy §5.2 — People: Team · Advisors · Careers)
   ----------------------------------------------------------------------- */
const leadership = () => `
<section class="section" id="people" data-surface="leadership">
  <div class="shell">
    ${sectionHead({
      label: 'People',
      title: 'One accountable owner, {five doors}[.]',
      deck: 'A single owner is accountable for what this page says, with a review checkpoint whenever any door launches something new.',
      align: 'split',
      cta: { label: 'See open roles', href: '/careers', variant: 'primary' },
    })}
    <div class="tracks" data-reveal-group>
      ${[
        {
          role: 'Founder & Chief Executive',
          note: 'Accountable for the house, the five doors, and every number published on this site.',
        },
        {
          role: 'Head of Ecosystem',
          note: 'Runs the relationships across government, institutions and the investor network.',
        },
        {
          role: 'Head of Capability',
          note: 'Owns the ladder from diagnostic to accreditation across StartNet Research and Vibe.',
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
      as the proof section: nothing goes up that cannot be verified.
    </p>
  </div>
</section>`;

const closing = () => `
<section class="section section--tight" data-theme="paper" data-surface="about-closing">
  <div class="shell event__compact-shell" data-reveal-group>
    <p class="event__compact-text" data-reveal="fade">
      Want to know more about a specific door?
    </p>
    ${linkArrow({ label: 'See the five doors', href: '/#portfolio' })}
  </div>
</section>`;

export const aboutPage = () => ({
  path: '/about',
  title: 'About StartNet: Building Tamil Nadu’s AI startup infrastructure',
  description:
    'StartNet is the commercial house behind Tamil Nadu’s AI startup ecosystem: StartNet X, Connect, Research, Vibe and AI, the AI Flywheel, and our relationship with Think TN Foundation.',
  bodyClass: 'page-about',
  main: [
    pageHero({
      label: 'About',
      title: 'We build the infrastructure. {Founders build the companies}[.]',
      deck: site.narrative,
      className: 'page-hero--about',
      badge: rocketMark('page-hero__badge-mark'),
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
    flywheelSection(),
    believe(),
    house(),
    numbers(),
    gate(),
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
      makesOffer: properties.map((p) => ({
        '@type': 'Offer',
        name: p.name,
        url: `${site.origin}${p.href}`,
      })),
    },
  }),
});
