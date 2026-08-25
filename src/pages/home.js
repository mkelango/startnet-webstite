/* ============================================================================
   HOMEPAGE
   Section order follows the masterbrand strategy §3.2 exactly. The one
   deviation the strategy itself asks for: the flagship-event module is
   promoted above "Who this is for" while inside its pre-event window.
   ========================================================================== */

import {
  site,
  properties,
  propertiesByGroup,
  propertyById,
  proof,
  nextEvent,
  audiences,
  news,
  journey,
} from '../data/site.js';
import {
  accent,
  esc,
  eyebrow,
  button,
  linkArrow,
  ring,
  rule,
  sectionHead,
  propertyCard,
  newsCard,
  stat,
  iconArrow,
} from '../lib/ui.js';
import { monogram } from '../lib/layout.js';

/* --------------------------------------------------------------------------
   1. HERO
   Comprehension, not conversion. No call to action lives here by design —
   the first click opportunity is the portfolio below.
   ----------------------------------------------------------------------- */
const hero = () => `
<section class="hero" id="hero" data-surface="hero" data-reveal-group>
  <div class="shell hero__shell">
    <div class="hero__body">
      <p class="hero__kicker" data-reveal="fade">
        <span class="hero__kicker-dot" aria-hidden="true"></span>
        Masterbrand · Tamil Nadu
      </p>
      <h1 class="hero__title display-1" data-reveal="rise">${accent(
        'The infrastructure behind Tamil Nadu’s next {100,000} founders[.]'
      )}</h1>
      <div class="hero__meta">
        <div class="hero__claim" data-reveal="rise">
          <p class="hero__claim-text">Five doors.<br>One ecosystem.</p>
          ${rule()}
        </div>
        <p class="hero__deck" data-reveal="rise">${esc(site.narrative)}</p>
      </div>
    </div>
    <div class="hero__ring-stage">
      <div class="hero__ring-reveal" data-reveal="fade">
        ${ring({
          id: 'hero-ring',
          states: ['path', 'signal', 'measure', 'network', 'orbit'],
          arc: 172,
          from: -186,
          solid: 128,
          count: 30,
          size: 'xl',
          tone: 'accent',
          className: 'hero__ring',
        })}
        <div class="hero__ring-badge" aria-hidden="true">
          <span class="hero__ring-badge-halo"></span>
          ${monogram('hero__ring-badge-mark')}
        </div>
      </div>
    </div>
  </div>
  <div class="hero__scroll" aria-hidden="true">
    <span class="hero__scroll-label">Scroll</span>
    <span class="hero__scroll-track"><span class="hero__scroll-dot"></span></span>
  </div>
</section>`;

/* --------------------------------------------------------------------------
   2. PORTFOLIO
   The Orbit carries the argument; the grid carries the detail. Both use the
   same canonical one-line description, never a re-write.
   ----------------------------------------------------------------------- */
const orbit = () => {
  const groupLabel = (id) =>
    ({ learn: 'Learn & Build', gather: 'Gather', home: 'Year-round Home' }[id] || '');
  const first = properties[0];
  return `
  <div class="orbit" data-orbit>
    <div class="orbit__stage">
      <svg class="orbit__svg" viewBox="0 0 400 400" aria-hidden="true">
        <circle class="orbit__track" cx="200" cy="200" r="148" />
        <g class="orbit__rotor">
          <g class="orbit__nodes"></g>
        </g>
      </svg>
      <div class="orbit__centre is-in" style="--prop:${first.swatch}">
        <p class="orbit__group">${esc(groupLabel(first.group))}</p>
        <h3 class="orbit__name">${esc(first.name)}</h3>
        <p class="orbit__line">${esc(first.line)}</p>
        <a class="link-arrow orbit__link" href="${esc(
          first.href
        )}" target="_blank" rel="noopener"><span>Visit ${esc(
    first.domain
  )}</span><svg class="icon" viewBox="0 0 16 16" aria-hidden="true"><path d="M3 8h9.5M8.75 4.25 12.5 8l-3.75 3.75" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg></a>
      </div>
    </div>

    <div class="orbit__rail">
      <p class="orbit__rail-label">The five doors</p>
      <ul class="orbit__list" role="tablist" aria-label="StartNet properties">
        ${properties
          .map(
            (p, i) => `
          <li role="presentation">
            <button class="orbit__item" type="button" role="tab"
              data-orbit-item="${i}"
              aria-selected="${i === 0}"
              tabindex="${i === 0 ? 0 : -1}"
              style="--prop:${p.swatch}"
              data-name="${esc(p.name)}"
              data-group="${esc(groupLabel(p.group))}"
              data-line="${esc(p.line)}"
              data-href="${esc(p.href)}"
              data-domain="${esc(p.domain)}"
              data-swatch="${p.swatch}">
              <span class="orbit__item-dot" aria-hidden="true"></span>
              <span class="orbit__item-name">${esc(p.name)}</span>
              <span class="orbit__item-kind">${esc(p.kind)}</span>
            </button>
          </li>`
          )
          .join('')}
      </ul>
    </div>
  </div>`;
};

const portfolio = () => `
<section class="section section--portfolio" id="portfolio" data-surface="portfolio" data-theme="paper">
  <div class="shell">
    ${sectionHead({
      label: 'Portfolio',
      title: 'Five doors. {One ecosystem}[.]',
      deck: 'Wherever you are starting from, there is a door that fits. Each property stands on its own — together they are one system.',
      cta: { label: 'See the full portfolio', href: '/portfolio', variant: 'primary' },
    })}

    ${orbit()}

    <div class="portfolio__groups" data-reveal-group>
      ${propertiesByGroup
        .map(
          (g, gi) => `
        <div class="portfolio__group">
          <div class="portfolio__group-head" data-reveal="rise">
            <h3 class="portfolio__group-label">${esc(g.label)}</h3>
            <p class="portfolio__group-note">${esc(g.note)}</p>
          </div>
          <div class="portfolio__cards portfolio__cards--${g.items.length}">
            ${g.items.map((p, i) => propertyCard(p, { index: gi * 2 + i })).join('')}
          </div>
        </div>`
        )
        .join('')}
    </div>
  </div>
</section>`;

/* --------------------------------------------------------------------------
   3. PROOF
   Every row carries its source. A row without one is cut, not softened.
   ----------------------------------------------------------------------- */
const proofSection = () => {
  const rows = proof.metrics.filter((m) => m.verified);
  return `
<section class="section section--proof" id="proof" data-surface="proof">
  <div class="shell">
    ${sectionHead({
      label: 'Proof',
      title: 'The numbers we can {show our work on}[.]',
      deck: proof.note,
    })}
    <div class="proof__grid" data-reveal-group>
      ${rows.map((m, i) => stat(m, { index: i })).join('')}
    </div>
    <p class="proof__asof">Reconciled as of ${esc(proof.asOf)}.</p>
  </div>
  ${ring({
    states: ['measure', 'path', 'orbit'],
    arc: 200,
    from: 20,
    solid: 60,
    count: 44,
    size: 'lg',
    tone: 'ghost',
    className: 'proof__ring',
  })}
</section>`;
};

/* --------------------------------------------------------------------------
   4. THE ECOSYSTEM STORY
   Written so a single paragraph, lifted verbatim, correctly answers "what is
   StartNet and what does it do" — the internal test set in strategy §6.
   ----------------------------------------------------------------------- */
const story = () => `
<section class="section section--story" id="story" data-theme="dark" data-surface="story">
  <div class="shell story__shell">
    <div class="story__lead" data-reveal-group>
      ${eyebrow('The ecosystem')}
      <h2 class="story__title display-2" data-reveal="rise">${accent(
        'Most ecosystems ask you to pick one door and stay there. {This one doesn’t}[.]'
      )}</h2>
    </div>

    <div class="story__body" data-reveal-group>
      <p class="story__para" data-reveal="rise">
        A founder might start with a diagnostic on SNX, take a course on the Flywheel,
        get into a Nooru cohort, and meet their first investor at Physical AI Connect —
        all before their first year is out. Each property stands on its own. Together,
        they are the closest thing Tamil Nadu has to an operating system for building
        an AI company.
      </p>
      ${button({
        label: 'How the five fit together',
        href: '/about',
        variant: 'primary',
      })}
    </div>

    <ol class="journey" data-reveal-group aria-label="A founder’s path through the ecosystem">
      ${journey
        .map((j, i) => {
          const p = propertyById[j.propertyId];
          return `
        <li class="journey__step" style="--prop:${p.swatch}" data-reveal="rise" data-reveal-i="${i}">
          <span class="journey__node" aria-hidden="true"></span>
          <span class="journey__label">${esc(j.step)}</span>
          <span class="journey__prop">${esc(p.name)}</span>
          <span class="journey__body">${esc(j.body)}</span>
        </li>`;
        })
        .join('')}
    </ol>
  </div>
  ${ring({
    states: ['network', 'orbit', 'signal'],
    arc: 210,
    from: 150,
    solid: 90,
    count: 40,
    size: 'lg',
    tone: 'accent',
    className: 'story__ring',
  })}
</section>`;

/* --------------------------------------------------------------------------
   5. NEXT FLAGSHIP EVENT
   Content §9: this module changes state on a date range rather than a manual
   content edit. Inside the window it expands and moves up the page.
   ----------------------------------------------------------------------- */
const isInWindow = () => {
  const event = new Date(nextEvent.date).getTime();
  const now = Date.now();
  const opens = event - nextEvent.windowDays * 864e5;
  return now >= opens && now <= event;
};

const eventModule = () => {
  const p = propertyById[nextEvent.propertyId];
  const expanded = isInWindow();
  if (!expanded) {
    return `
<section class="section section--tight event event--compact" id="next-event" data-surface="event">
  <div class="shell event__compact-shell" data-reveal-group>
    <p class="event__compact-text" data-reveal="fade">
      <span class="event__compact-dot" style="--prop:${p.swatch}" aria-hidden="true"></span>
      Next gathering: <strong>${esc(nextEvent.name)}</strong>, ${esc(nextEvent.dateDisplay)}.
    </p>
    ${linkArrow({ label: 'Learn more', href: p.href, external: true })}
  </div>
</section>`;
  }

  return `
<section class="section event event--expanded" id="next-event" data-theme="dark" data-surface="event"
         style="--prop:${p.swatch}">
  <div class="shell event__shell" data-reveal-group>
    <div class="event__lead">
      ${eyebrow('Next gathering')}
      <h2 class="event__title display-2" data-reveal="rise">${esc(nextEvent.name)}</h2>
      <p class="event__where" data-reveal="rise">
        ${esc(nextEvent.dateDisplay)} · ${esc(nextEvent.city)}
      </p>
    </div>
    <div class="event__aside" data-reveal="rise">
      <p class="deck">${esc(nextEvent.theme)}</p>
      <div class="event__actions">
        ${nextEvent.links
          .map((l, i) =>
            button({
              label: l.label,
              href: l.href,
              external: true,
              variant: i === 0 ? 'accent' : 'ghost',
            })
          )
          .join('')}
      </div>
    </div>
  </div>
  ${ring({
    states: ['signal', 'path', 'orbit'],
    arc: 240,
    from: -60,
    solid: 70,
    count: 36,
    size: 'lg',
    tone: 'accent',
    className: 'event__ring',
  })}
</section>`;
};

/* --------------------------------------------------------------------------
   6. WHO THIS IS FOR
   ----------------------------------------------------------------------- */
const who = () => `
<section class="section section--who" id="who" data-surface="who" data-theme="paper">
  <div class="shell">
    ${sectionHead({
      label: 'Who this is for',
      title: 'Tell us where you’re standing, {we’ll point at the door}[.]',
      align: 'stacked',
    })}
    <div class="who__grid" data-reveal-group>
      ${audiences
        .map((a, i) => {
          const p = a.propertyId ? propertyById[a.propertyId] : null;
          return `
        <article class="who__card" style="--prop:${
          p ? p.swatch : 'var(--sn-signal)'
        }" data-reveal="rise" data-reveal-i="${i}">
          <span class="who__dot" aria-hidden="true"></span>
          <h3 class="who__title">${esc(a.title)}</h3>
          <p class="who__body">${esc(a.body)}</p>
          ${linkArrow({ label: a.cta.label, href: a.cta.href, external: Boolean(a.cta.external) })}
        </article>`;
        })
        .join('')}
    </div>
  </div>
</section>`;

/* --------------------------------------------------------------------------
   7. NEWSROOM PREVIEW
   ----------------------------------------------------------------------- */
const newsroomPreview = () => `
<section class="section section--news" id="news" data-surface="news">
  <div class="shell">
    ${sectionHead({
      label: 'Newsroom',
      title: 'What’s new {across StartNet}',
      cta: { label: 'View all', href: '/newsroom', variant: 'primary' },
    })}
    <div class="news__grid" data-reveal-group>
      ${news
        .slice(0, 3)
        .map((n, i) => newsCard(n, propertyById, { index: i }))
        .join('')}
    </div>
  </div>
</section>`;

/* ------------------------------------------------------------------------ */

export const homePage = () => ({
  path: '/',
  title: 'StartNet — The infrastructure behind Tamil Nadu’s AI startup ecosystem',
  description:
    'StartNet builds the training, acceleration, and annual gatherings behind Tamil Nadu’s AI-driven startup ecosystem — AI Flywheel, Nooru.AI, Agentic AI Connect, Physical AI Connect, and SNX.',
  bodyClass: 'page-home',
  main: [
    hero(),
    portfolio(),
    proofSection(),
    story(),
    isInWindow() ? eventModule() : '',
    who(),
    isInWindow() ? '' : eventModule(),
    newsroomPreview(),
  ].join('\n'),
  schema: JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: site.name,
    url: site.origin,
    description: site.narrative,
    publisher: { '@type': 'Organization', name: site.name, url: site.origin },
  }),
});
