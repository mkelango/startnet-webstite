/* ============================================================================
   PLATFORM — StartNet X
   Strategy §5.2 (Platform submenu) and §6.1. Built as one rich page rather
   than a six-page tree — the submenu topics below (Diagnostics, Directory,
   Matching, Archive, Data & method, Pricing) are sections on this page, not
   separate URLs, so the site gains real depth without a 25-page sprawl.
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
  tag,
} from '../lib/ui.js';

const brand = propertyById.x;

const jump = () => `
<section class="section section--tight" data-surface="platform-jump">
  <div class="shell">
    <div class="routes" style="max-width:720px;margin:0 auto">
      ${[
        ['What StartNet X is', '#what'],
        ['The Founder Diagnostic', '#diagnostic'],
        ['The Directory', '#directory'],
        ['Matching', '#matching'],
        ['The Archive', '#archive'],
        ['Data & method', '#method'],
        ['Pricing', '#pricing'],
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
<section class="section section--tight" id="what" data-surface="platform-what">
  <div class="shell">
    <article class="prop-deep" style="--prop:${brand.swatch};border-top:0">
      <div class="prop-deep__lead">
        <span class="prop-deep__mark" data-reveal="fade">${esc(brand.kind)}</span>
        <h2 class="prop-deep__name" data-reveal="rise">What StartNet X is</h2>
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

const diagnostic = () => `
<section class="section" id="diagnostic" data-theme="paper" data-surface="platform-diagnostic">
  <div class="shell">
    ${sectionHead({
      label: 'The Founder Diagnostic',
      title: 'Free. {No login to start.}',
      deck: 'An email to finish. This is the front door of the whole house, and the top of every funnel StartNet has: a directory is a thing people are in, a diagnostic is a thing people do.',
      cta: { label: 'Start the diagnostic', href: 'mailto:hello@startnet.in?subject=Founder%20Diagnostic', variant: 'primary' },
    })}
    <div class="tracks" data-reveal-group>
      <article class="track" data-reveal="rise" data-reveal-i="0">
        <p class="track__entry">Step 1</p>
        <h3 class="track__title">How it works</h3>
        <p class="track__body">A short, structured set of questions about your stage, your team and your traction: a few minutes, no jargon.</p>
      </article>
      <article class="track" data-reveal="rise" data-reveal-i="1">
        <p class="track__entry">Step 2</p>
        <h3 class="track__title">What you get</h3>
        <p class="track__body">A result page with a specific next step (a Vibe track, a Research lab near you, a Connect pass, or a nooru.ai application), not a generic score.</p>
      </article>
      <article class="track" data-reveal="rise" data-reveal-i="2">
        <p class="track__entry">Step 3</p>
        <h3 class="track__title">Sample report</h3>
        <p class="track__body">Every result is reachable from your profile afterwards, alongside the archive of everything else you have done on the platform.</p>
      </article>
    </div>
  </div>
</section>`;

const directory = () => `
<section class="section" id="directory" data-surface="platform-directory">
  <div class="shell">
    ${sectionHead({
      label: 'The Directory',
      title: 'Everyone in the ecosystem, {in one place}[.]',
      align: 'stacked',
    })}
    <div class="who__grid" data-reveal-group>
      ${[
        ['Startups', 'Every founder who has completed the diagnostic, searchable by stage and sector.'],
        ['Investors', 'Angels and funds active in Tamil Nadu, with the deal flow they actually want to see.'],
        ['Mentors', 'Matched by domain, not by availability alone.'],
        ['Incubators', 'Every incubator and accelerator in the state, cross-referenced with StartNet Research labs.'],
        ['Service providers', 'Legal, accounting and compliance partners who already know how a startup works.'],
        ['Colleges', 'Every institution running a StartNet Research lab or a Vibe partnership.'],
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

const matching = () => `
<section class="section" id="matching" data-theme="dark" data-surface="platform-matching">
  <div class="shell story__shell">
    <div class="story__lead" data-reveal-group>
      ${eyebrow('Matching')}
      <h2 class="story__title title-1" data-reveal="rise">${accent(
        'One matching agent. {Not eight.}'
      )}</h2>
    </div>
    <div class="story__body" data-reveal-group>
      <p class="story__para" data-reveal="rise">
        The legacy platform architecture specified eight separate AI agents, a build
        for a company with a hundred engineers. We ship one matching agent covering
        mentor matching, investor readiness, talent and programme matching, and add
        the rest only when usage demands it.
      </p>
      ${button({ label: 'Talk to the platform team', href: '/contact', variant: 'primary' })}
    </div>
  </div>
</section>`;

const archive = () => `
<section class="section" id="archive" data-theme="paper" data-surface="platform-archive">
  <div class="shell">
    ${sectionHead({
      label: 'The Archive',
      title: 'Every session, {kept.}',
      deck: 'Every Connect session, every Vibe Summit, every report and every playbook the house has published, reachable from one account.',
    })}
  </div>
</section>`;

const method = () => `
<section class="section" id="method" data-surface="platform-method">
  <div class="shell">
    ${sectionHead({
      label: 'Data & method',
      title: 'How our numbers {are produced}[.]',
      deck: 'Every figure carries a confidence tag and a date. See the full method on the About page.',
      cta: { label: 'Our published figures', href: '/about#numbers', variant: 'primary' },
    })}
  </div>
</section>`;

const pricing = () => `
<section class="section section--tight" id="pricing" data-theme="dark" data-surface="platform-pricing">
  <div class="shell">
    ${sectionHead({
      label: 'Pricing',
      title: 'Free for founders. {Paid for institutions.}',
      align: 'stacked',
    })}
    <div class="tracks" data-reveal-group>
      ${[
        ['Free tier', 'Every founder and student: diagnostic, profile, directory listing, archive access.'],
        ['Institution', 'Colleges and incubators: cohort management, aggregate diagnostic data, Research and Vibe integration.'],
        ['Corporate', 'GCCs and investors: the platform’s real revenue, and where deal flow and talent search live.'],
      ]
        .map(
          ([title, body], i) => `
        <article class="track" data-reveal="rise" data-reveal-i="${i}">
          <p class="track__entry">Tier</p>
          <h3 class="track__title">${esc(title)}</h3>
          <p class="track__body">${esc(body)}</p>
        </article>`
        )
        .join('')}
    </div>
  </div>
</section>`;

export const platformPage = () => ({
  path: '/platform',
  title: 'StartNet X: The platform every founder in Tamil Nadu has',
  description:
    'StartNet X is the free account every founder in Tamil Nadu has: diagnostics, profile, matching, and the archive of everything the house has published.',
  bodyClass: 'page-platform',
  main: [
    pageHero({
      label: 'StartNet X',
      title: 'The account {every founder} has[.]',
      deck: 'Free to join, free to be listed, free to be diagnosed. StartNet X is where every founder’s path through the house begins.',
      ringOpts: {
        states: ['path', 'signal', 'orbit'],
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
    diagnostic(),
    directory(),
    matching(),
    archive(),
    method(),
    pricing(),
  ].join('\n'),
  schema: JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'StartNet X',
    url: `${site.origin}/platform`,
    applicationCategory: 'BusinessApplication',
    description: brand.line,
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
  }),
});
