/* ============================================================================
   RESEARCH — StartNet Research
   Strategy §5.2 (Research submenu) and §6.3 — the section rewritten hardest,
   because the research found the legacy lab-sales model would not sell.
   All prices are indicative and derived from the strategy's own benchmark
   (₹68.98 lakh over three years), not quotations — stated as such, per the
   site's own confidence-tag discipline.
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

const brand = propertyById.research;

const labTypes = [
  { name: 'Perception Lab', price: '₹8–12 lakh/yr', body: 'Vision and sensing, edge devices, annotation, rented compute.', who: 'Any college: the entry tier.' },
  { name: 'Generative Lab', price: '₹15–20 lakh/yr', body: 'Fine-tuning, RAG, evaluation, Tamil-language work with AI4Bharat.', who: 'Colleges with a CSE department worth the name.' },
  { name: 'Agentic Lab', price: '₹20–25 lakh/yr', body: 'Agent frameworks, tool use, orchestration, safety evaluation.', who: 'Autonomous institutions.' },
  { name: 'Physical AI Lab', price: '₹35–50 lakh/yr', body: 'Robotics cell, sim-to-real, a real industrial problem from a real plant.', who: 'Institutions near a cluster: Coimbatore, Tiruppur, Namakkal.' },
];

const jump = () => `
<section class="section section--tight" data-surface="research-jump">
  <div class="shell">
    <div class="routes" style="max-width:720px;margin:0 auto">
      ${[
        ['The lab programme', '#programme'],
        ['Lab types', '#lab-types'],
        ['Why a college does this', '#why'],
        ['The industry side', '#industry'],
        ['Evidence', '#evidence'],
        ['Start', '#start'],
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

const programme = () => `
<section class="section section--tight" id="programme" data-surface="research-what">
  <div class="shell">
    <article class="prop-deep" style="--prop:${brand.swatch};border-top:0">
      <div class="prop-deep__lead">
        <span class="prop-deep__mark" data-reveal="fade">${esc(brand.kind)}</span>
        <h2 class="prop-deep__name" data-reveal="rise">The lab programme</h2>
      </div>
      <div class="prop-deep__body">
        <p class="prop-deep__line" data-reveal="rise">${esc(brand.line)}</p>
        <p class="prop-deep__detail" data-reveal="rise">${esc(brand.detail)}</p>
        <p class="prop-deep__detail" data-reveal="rise">
          A three-year operating contract (curriculum, staffing and rented compute),
          not a capital equipment sale. No major technology company funds general AI
          labs at teaching colleges; NVIDIA, AWS, Intel, Google, Microsoft and Huawei
          give curriculum, certification and cloud credits free, and fund real
          laboratories only at MIT tier. The college pays, and the fee order is why
          it is worth it. See “Why a college does this” below.
        </p>
        <dl class="prop-deep__best" data-reveal="fade">
          <dt>Best for</dt>
          <dd>${esc(brand.bestFor)}</dd>
        </dl>
      </div>
    </article>
  </div>
</section>`;

const labTypesSection = () => `
<section class="section" id="lab-types" data-theme="paper" data-surface="research-lab-types">
  <div class="shell">
    ${sectionHead({
      label: 'Lab types',
      title: 'Four labs, {mapped to the flywheel}[.]',
      deck: 'All figures are indicative, derived from a published three-year benchmark, and not a quotation: costed properly before any proposal.',
    })}
    <div class="tracks" data-reveal-group>
      ${labTypes
        .map(
          (l, i) => `
        <article class="track" data-reveal="rise" data-reveal-i="${i}">
          <p class="track__entry">${esc(l.price)}</p>
          <h3 class="track__title">${esc(l.name)}</h3>
          <p class="track__body">${esc(l.body)}</p>
          <p class="track__body" style="margin-top:var(--space-3);color:var(--color-text-tertiary)"><strong>Who buys:</strong> ${esc(l.who)}</p>
        </article>`
        )
        .join('')}
    </div>
    <p class="proof__asof">Indicative figures, derived from a ₹68.98 lakh / three-year benchmark. Not a quotation.</p>
  </div>
</section>`;

const why = () => `
<section class="section" id="why" data-theme="dark" data-surface="research-why">
  <div class="shell story__shell">
    <div class="story__lead" data-reveal-group>
      ${eyebrow('Why a college does this')}
      <h2 class="story__title title-1" data-reveal="rise">${accent(
        'A fee band, {not an ambition.}'
      )}</h2>
    </div>
    <div class="story__body" data-reveal-group>
      <p class="story__para" data-reveal="rise">
        Tamil Nadu’s fee order permits a Category I accredited college to charge
        ₹55,000 against ₹50,000. For a 1,550-student college that is ₹77.5 lakh a
        year, every year. NBA accreditation has a direct cash value, and an AI lab is
        a route to it. A well-run lab can pay for itself several times over in fee
        headroom alone.
      </p>
      <p class="story__para" data-reveal="rise">
        NIRF is the second argument, and it rewards sustained operating spend at
        roughly three times the rate it rewards buying equipment, which is why we
        sell a three-year operating contract rather than capital hardware.
      </p>
      ${button({ label: 'Propose a lab', href: '#start', variant: 'primary' })}
    </div>
  </div>
  ${ring({
    states: ['measure', 'orbit'],
    arc: 200,
    from: 130,
    solid: 80,
    count: 34,
    size: 'lg',
    tone: 'accent',
    className: 'story__ring',
  })}
</section>`;

const industry = () => `
<section class="section" id="industry" data-surface="research-industry">
  <div class="shell">
    ${sectionHead({
      label: 'The industry side',
      title: 'A named lab, {a live problem}[.]',
      align: 'stacked',
    })}
    <div class="who__grid" data-reveal-group>
      ${[
        ['Sponsor a lab', 'Put your name on a Perception, Generative, Agentic or Physical AI lab.'],
        ['Named labs', 'A permanent, branded presence inside the institution you sponsor.'],
        ['Live problems from industry', 'Real data, real constraints, not a synthetic dataset.'],
        ['GCC-linked labs', 'A direct pipeline from a lab to a Global Capability Centre’s talent needs.'],
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

const evidence = () => `
<section class="section section--tight" id="evidence" data-theme="paper" data-surface="research-evidence">
  <div class="shell event__compact-shell" data-reveal-group>
    <p class="event__compact-text" data-reveal="fade">
      <span class="event__compact-dot" style="--prop:${brand.swatch}" aria-hidden="true"></span>
      What has not worked, published alongside what has: the Alan Turing Institute,
      the United Kingdom’s national AI institute, has been in serious and public
      difficulty. A lab programme that says so out loud is more credible than one
      that promises transformation.
    </p>
    ${linkArrow({ label: 'Our published figures', href: '/about#numbers' })}
  </div>
</section>`;

const start = () => `
<section class="section" id="start" data-theme="dark" data-surface="research-start">
  <div class="shell">
    ${sectionHead({
      label: 'Start',
      title: 'Eligibility, {site visit, proposal.}',
      deck: 'A short conversation to establish fit, a site visit, and a costed proposal, in that order.',
      cta: { label: 'Start a conversation', href: '/partners', variant: 'primary' },
    })}
  </div>
</section>`;

export const researchPage = () => ({
  path: '/research',
  title: 'StartNet Research: AI labs colleges buy to become accredited',
  description:
    'StartNet Research sells three-year AI lab operating contracts to Tamil Nadu colleges: Perception, Generative, Agentic and Physical AI, priced against a real fee band and NIRF score.',
  bodyClass: 'page-research',
  main: [
    pageHero({
      label: 'StartNet Research',
      title: 'The lab a college buys {to become accredited}[.]',
      deck: 'A three-year lab operating contract that moves a fee band and an accreditation score, not a capital purchase nobody can afford to run.',
      ringOpts: {
        states: ['orbit', 'network', 'measure'],
        arc: 200,
        from: -165,
        solid: 85,
        count: 34,
        size: 'lg',
        tone: 'accent',
      },
    }),
    jump(),
    programme(),
    labTypesSection(),
    why(),
    industry(),
    evidence(),
    start(),
  ].join('\n'),
  schema: JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: 'AI laboratory operating contract',
    provider: { '@type': 'Organization', name: site.name },
    name: 'StartNet Research',
    url: `${site.origin}/research`,
    description: brand.line,
  }),
});
