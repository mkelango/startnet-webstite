/* ============================================================================
   PARTNERS
   ========================================================================== */

import { site, partnerTracks, properties, propertyById } from '../data/site.js';
import { accent, esc, eyebrow, button, ring, pageHero, sectionHead } from '../lib/ui.js';

const tracks = () => `
<section class="section" id="ways" data-surface="partner-tracks">
  <div class="shell">
    ${sectionHead({
      label: 'Ways to partner',
      title: 'Four entry points, {one team to talk to}[.]',
      deck: 'Whichever door you come through, the conversation starts in the same place — and we route it from there.',
    })}
    <div class="tracks" data-reveal-group>
      ${partnerTracks
        .map(
          (t, i) => `
        <article class="track" data-reveal="rise" data-reveal-i="${i}">
          <p class="track__entry">${esc(t.entry)}</p>
          <h3 class="track__title">${esc(t.title)}</h3>
          <p class="track__body">${esc(t.body)}</p>
        </article>`
        )
        .join('')}
    </div>
  </div>
</section>`;

const surface = () => `
<section class="section" data-theme="paper" data-surface="partner-surface">
  <div class="shell">
    ${sectionHead({
      label: 'Where you would show up',
      title: 'The five surfaces a partner can {actually stand on}[.]',
      align: 'stacked',
    })}
    <div class="who__grid" data-reveal-group>
      ${properties
        .map(
          (p, i) => `
        <article class="who__card" style="--prop:${p.swatch}" data-reveal="rise" data-reveal-i="${i}">
          <span class="who__dot" aria-hidden="true"></span>
          <h3 class="who__title">${esc(p.name)}</h3>
          <p class="who__body">${esc(p.kind)}. ${esc(p.bestFor)}</p>
        </article>`
        )
        .join('')}
    </div>
  </div>
</section>`;

const cta = () => `
<section class="section" data-theme="dark" data-surface="partner-cta">
  <div class="shell story__shell">
    <div class="story__lead" data-reveal-group>
      ${eyebrow('Start here')}
      <h2 class="story__title display-2" data-reveal="rise">${accent(
        'One conversation, {five ways to plug in}[.]'
      )}</h2>
    </div>
    <div class="story__body" data-reveal-group>
      <p class="story__para" data-reveal="rise">
        Tell us what you are trying to move and we will point at the property that
        moves it — or tell you honestly that none of them do.
      </p>
      ${button({
        label: 'Start a conversation',
        href: '/contact?topic=Partnership',
        variant: 'primary',
      })}
      <p class="proof__asof" style="border:0;padding:0;margin:0">
        Or write to <a href="mailto:${esc(site.email.partners)}">${esc(
  site.email.partners
)}</a> directly.
      </p>
    </div>
  </div>
  ${ring({
    states: ['network', 'signal', 'orbit'],
    arc: 230,
    from: 130,
    solid: 80,
    count: 40,
    size: 'xl',
    tone: 'accent',
    className: 'story__ring',
  })}
</section>`;

export const partnersPage = () => ({
  path: '/partners',
  title: 'Partner with StartNet — Government, institutional & sponsor relationships',
  description:
    'Work with StartNet across training, acceleration and annual gatherings — for government bodies, institutions and sponsors building Tamil Nadu’s AI startup ecosystem.',
  bodyClass: 'page-partners',
  main: [
    pageHero({
      label: 'Partners',
      title: 'One conversation. {Five ways to plug in}[.]',
      deck: 'Whether you are a government body, an institution or a sponsor, there is a natural entry point across our portfolio — and one team to talk to about all of it.',
      ringOpts: {
        states: ['orbit', 'network', 'path'],
        arc: 200,
        from: -165,
        solid: 85,
        count: 34,
        size: 'lg',
        tone: 'accent',
      },
    }),
    tracks(),
    surface(),
    cta(),
  ].join('\n'),
});
