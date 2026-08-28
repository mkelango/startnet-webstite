/* ============================================================================
   CONNECT — StartNet Connect
   Strategy §5.2 (Connect submenu) and §6.2. Two flagship events, each on
   its own published date — the strategy's open item 2 fixed: the two
   summits no longer share a date.
   ========================================================================== */

import { site, properties, propertyById, nextEvent, secondEvent } from '../data/site.js';
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

const brand = propertyById.connect;

const jump = () => `
<section class="section section--tight" data-surface="connect-jump">
  <div class="shell">
    <div class="routes" style="max-width:720px;margin:0 auto">
      ${[
        ['Agentic AI Connect', '#agentic'],
        ['Physical AI Connect', '#physical'],
        ['Sponsorship', '#sponsorship'],
        ['Speak', '#speak'],
        ['The Archive', '#archive'],
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
<section class="section section--tight" id="what" data-surface="connect-what">
  <div class="shell">
    <article class="prop-deep" style="--prop:${brand.swatch};border-top:0">
      <div class="prop-deep__lead">
        <span class="prop-deep__mark" data-reveal="fade">${esc(brand.kind)}</span>
        <h2 class="prop-deep__name" data-reveal="rise">StartNet Connect</h2>
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

const eventBlock = ({ id, name, dateDisplay, city, theme, stage, cta }) => `
<section class="section" id="${id}" data-theme="dark" data-surface="connect-${id}" style="--prop:${brand.swatch}">
  <div class="shell event__shell" data-reveal-group>
    <div class="event__lead">
      ${eyebrow(stage)}
      <h2 class="event__title display-2" data-reveal="rise">${esc(name)}</h2>
      <p class="event__where" data-reveal="rise">${esc(dateDisplay)} · ${esc(city)}</p>
    </div>
    <div class="event__aside" data-reveal="rise">
      ${theme ? `<p class="deck">${esc(theme)}</p>` : ''}
      <div class="event__actions">
        ${cta.map((l, i) => button({ label: l.label, href: l.href, variant: i === 0 ? 'accent' : 'ghost' })).join('')}
      </div>
      <p class="proof__asof" style="border:0;padding:0;margin-top:var(--space-4)">
        Published on a fixed annual window and never moved. A small institution
        earns standing by being predictable enough to plan around.
      </p>
    </div>
  </div>
</section>`;

const sponsorship = () => `
<section class="section" id="sponsorship" data-theme="paper" data-surface="connect-sponsorship">
  <div class="shell">
    ${sectionHead({
      label: 'Sponsorship',
      title: 'A published {rate card}[.]',
      deck: 'No Indian policy or business summit was found publishing one. Publishing ours is a differentiator, not a giveaway.',
      cta: { label: 'Request the rate card', href: '/partners', variant: 'primary' },
    })}
    <div class="tracks" data-reveal-group>
      ${[
        ['Category exclusivity', 'One sponsor per category at each flagship: used by every large event, and one of two levers that cost nothing.'],
        ['Bundled delegate passes', 'Every sponsorship tier bundles delegate passes into it, so sponsorship is never a pure cost line.'],
        ['Named track sponsorship', 'Put your name on a stage of the AI Flywheel: Perception, Generative, Agentic or Physical.'],
      ]
        .map(
          ([title, body], i) => `
        <article class="track" data-reveal="rise" data-reveal-i="${i}">
          <p class="track__entry">Lever</p>
          <h3 class="track__title">${esc(title)}</h3>
          <p class="track__body">${esc(body)}</p>
        </article>`
        )
        .join('')}
    </div>
    <p class="proof__asof">
      Exact pricing is finalised per edition and provided on request, published here
      the moment it is costed, per the same rule every number on this site follows.
    </p>
  </div>
</section>`;

const speak = () => `
<section class="section section--tight" id="speak" data-surface="connect-speak">
  <div class="shell event__compact-shell" data-reveal-group>
    <p class="event__compact-text" data-reveal="fade">
      <span class="event__compact-dot" style="--prop:${brand.swatch}" aria-hidden="true"></span>
      Call for speakers: we look for people shipping in production, not slide decks.
    </p>
    ${linkArrow({ label: 'Submit a talk', href: 'mailto:hello@startnet.in?subject=Speaker%20submission' })}
  </div>
</section>`;

const archive = () => `
<section class="section" id="archive" data-theme="dark" data-surface="connect-archive">
  <div class="shell">
    ${sectionHead({
      label: 'The Archive',
      title: 'Every session, {on demand}[.]',
      deck: 'Sessions and reports from past editions, reachable from your StartNet X account.',
      cta: { label: 'Go to StartNet X', href: '/platform', variant: 'primary' },
    })}
  </div>
</section>`;

export const connectPage = () => ({
  path: '/connect',
  title: 'StartNet Connect: Agentic AI Connect & Physical AI Connect',
  description:
    'StartNet Connect runs the two days a year Tamil Nadu’s AI ecosystem is in one room: Agentic AI Connect and Physical AI Connect, on separate published dates.',
  bodyClass: 'page-connect',
  main: [
    pageHero({
      label: 'StartNet Connect',
      title: 'The two days a year {the ecosystem} is in one room[.]',
      deck: 'Agentic AI Connect and Physical AI Connect, published on fixed dates a year apart, so ministries, sponsors and journalists can plan around them.',
      ringOpts: {
        states: ['signal', 'path', 'orbit'],
        arc: 210,
        from: -60,
        solid: 90,
        count: 36,
        size: 'lg',
        tone: 'accent',
      },
    }),
    jump(),
    what(),
    eventBlock({
      id: 'agentic',
      name: nextEvent.name,
      dateDisplay: nextEvent.dateDisplay,
      city: nextEvent.city,
      theme: nextEvent.theme,
      stage: 'Digital summit · yearly',
      cta: nextEvent.links,
    }),
    eventBlock({
      id: 'physical',
      name: secondEvent.name,
      dateDisplay: secondEvent.dateDisplay,
      city: secondEvent.city,
      theme: 'The flagship gathering: in the room, once a year.',
      stage: 'Physical summit · yearly',
      cta: [{ label: 'Learn more', href: secondEvent.href }],
    }),
    sponsorship(),
    speak(),
    archive(),
  ].join('\n'),
  schema: JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'StartNet Connect',
    url: `${site.origin}/connect`,
    description: brand.line,
    event: [
      {
        '@type': 'Event',
        name: nextEvent.name,
        startDate: nextEvent.date,
        location: { '@type': 'Place', name: nextEvent.city },
      },
      {
        '@type': 'Event',
        name: secondEvent.name,
        startDate: secondEvent.date,
        location: { '@type': 'Place', name: secondEvent.city },
      },
    ],
  }),
});
