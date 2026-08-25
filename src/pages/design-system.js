/* ============================================================================
   THE DESIGN SYSTEM — a living specimen page
   Not documentation about the system; the system itself, rendered from the
   same tokens and the same components every other page uses. If a value
   changes in tokens.css, this page changes with it.
   ========================================================================== */

import { site, properties } from '../data/site.js';
import {
  accent,
  esc,
  eyebrow,
  button,
  linkArrow,
  ring,
  rule,
  pageHero,
  propertyCard,
  tag,
  filterBar,
} from '../lib/ui.js';
import { monogram } from '../lib/layout.js';

const block = ({ title, note = '', body }) => `
  <section class="ds-block" data-reveal-group>
    <header class="ds-block__head">
      <h2 class="ds-block__title" data-reveal="rise">${accent(title)}</h2>
      ${note ? `<p class="ds-block__note" data-reveal="fade">${esc(note)}</p>` : ''}
    </header>
    ${body}
  </section>`;

const swatch = (name, value, note = '') => `
  <div class="swatch" data-reveal="rise">
    <div class="swatch__chip" style="--c:${value}"></div>
    <span class="swatch__name">${esc(name)}</span>
    <span class="swatch__value">${esc(note || value)}</span>
  </div>`;

/* -------------------------------------------------------------------------- */

const identity = () =>
  block({
    title: 'The mark, and {the dot}[.]',
    note: 'The wordmark is a vector of the master artwork, not a re-set. The dot is the only element permitted to leave the lockup and act on its own.',
    body: `
    <div class="specimen-grid">
      <div class="specimen" data-reveal="rise">
        <div class="specimen__stage" style="background:var(--sn-neutral-050)">
          <img src="/assets/brand/startnet-wordmark.svg" alt="StartNet wordmark"
               style="width:74%">
        </div>
        <span class="specimen__name">Wordmark</span>
        <span class="specimen__note">Primary lockup. Minimum width 120px. Clear space equals the height of the dot on all four sides.</span>
      </div>

      <div class="specimen" data-reveal="rise">
        <div class="specimen__stage" style="background:var(--sn-neutral-950)">
          <div style="width:52%">${monogram()}</div>
        </div>
        <span class="specimen__name">Monogram</span>
        <span class="specimen__note">For avatars, favicons and any square lock-up under 64px where the full wordmark stops being readable.</span>
      </div>

      <div class="specimen" data-reveal="rise">
        <div class="specimen__stage">
          <span style="width:26%;aspect-ratio:1;border-radius:50%;background:var(--sn-signal);display:block"></span>
        </div>
        <span class="specimen__name">The Dot</span>
        <span class="specimen__note">Signal red, always a perfect circle, never outlined, never gradient, never rotated — a circle has no wrong angle and that is the point.</span>
      </div>
    </div>

    <div class="do-dont" style="margin-top:var(--space-10)">
      <div class="do-dont__item do-dont__item--do" data-reveal="rise">
        <span class="do-dont__tag">Do</span>
        Let the dot travel — as an eyebrow bullet, a swatch on a property card, a
        node on the founder journey, a mark on a ring. It is the same dot each time.
      </div>
      <div class="do-dont__item do-dont__item--dont" data-reveal="rise">
        <span class="do-dont__tag">Don’t</span>
        Re-tint the dot to a property colour, stretch it into an ellipse, or place a
        second dot inside a headline. One dot per statement.
      </div>
    </div>`,
  });

const colour = () =>
  block({
    title: 'Colour',
    note: 'Two brand constants and a restrained neutral field. Signal red is an accent, never a surface — the moment it becomes a background it stops meaning "here".',
    body: `
    <div class="swatches">
      ${swatch('Ink', 'var(--sn-ink)', '#000000 · brand')}
      ${swatch('Signal', 'var(--sn-signal)', '#CC3029 · brand')}
      ${swatch('Signal 600', 'var(--sn-signal-600)', '#AD2621 · hover')}
      ${swatch('Signal 050', 'var(--sn-signal-050)', '#FBECEB · wash')}
      ${swatch('Paper', 'var(--sn-neutral-050)', '#F6F6F4')}
      ${swatch('Line', 'var(--sn-neutral-150)', '#E6E6E2')}
      ${swatch('Text secondary', 'var(--sn-neutral-600)', '#5A5A53')}
      ${swatch('Surface inverse', 'var(--sn-neutral-950)', '#0A0A0A')}
    </div>

    <h3 class="portfolio__group-label" style="margin:var(--space-12) 0 var(--space-5)">
      Portfolio swatches
    </h3>
    <p class="ds-block__note" style="margin-bottom:var(--space-6)">
      One cue per property. Permitted only as a dot, a hairline or a hover wash on
      that property's own card. Never as a section fill — five sub-brands must not
      be able to repaint the parent.
    </p>
    <div class="swatches">
      ${properties.map((p) => swatch(p.name, p.swatch, p.domain)).join('')}
    </div>`,
  });

const typography = () =>
  block({
    title: 'Typography',
    note: 'Archivo carries structure and authority. Instrument Serif italic carries the human aside. The mix is the signature — and it only works because it is rationed.',
    body: `
    <div class="type-row" data-reveal="fade">
      <span class="type-row__meta">Display 1<br>40 → 76px</span>
      <p class="display-1" style="margin:0">${accent('Five doors. {One ecosystem}[.]')}</p>
    </div>
    <div class="type-row" data-reveal="fade">
      <span class="type-row__meta">Display 2<br>34 → 60px</span>
      <p class="display-2" style="margin:0">Built to be believed</p>
    </div>
    <div class="type-row" data-reveal="fade">
      <span class="type-row__meta">Title 1<br>28 → 44px</span>
      <p class="title-1" style="margin:0">The numbers we can show our work on</p>
    </div>
    <div class="type-row" data-reveal="fade">
      <span class="type-row__meta">Title 3<br>20 → 26px</span>
      <p class="title-3" style="margin:0">Accelerator cohorts</p>
    </div>
    <div class="type-row" data-reveal="fade">
      <span class="type-row__meta">Deck<br>serif italic, 17 → 21px</span>
      <p class="deck" style="margin:0">
        Our connected properties give founders a measurable advantage — one system,
        five doors, no dead ends.
      </p>
    </div>
    <div class="type-row" data-reveal="fade">
      <span class="type-row__meta">Body<br>16px / 1.62</span>
      <p style="margin:0;max-width:60ch;color:var(--color-text-secondary)">
        StartNet builds the training, the acceleration, and the two annual gatherings
        that turn Tamil Nadu’s AI ambition into a working ecosystem.
      </p>
    </div>
    <div class="type-row" data-reveal="fade">
      <span class="type-row__meta">Label<br>12px / 0.09em</span>
      <p class="label" style="margin:0">Learn &amp; Build</p>
    </div>

    <div class="do-dont" style="margin-top:var(--space-10)">
      <div class="do-dont__item do-dont__item--do" data-reveal="rise">
        <span class="do-dont__tag">Do</span>
        One serif accent per headline, on the phrase that carries the idea.
      </div>
      <div class="do-dont__item do-dont__item--dont" data-reveal="rise">
        <span class="do-dont__tag">Don’t</span>
        Two accents in one line. They cancel each other and the sentence loses its
        centre of gravity.
      </div>
    </div>`,
  });

const dotStates = () => {
  const specs = [
    ['mark', 'One dot. Identity at rest.'],
    ['path', 'Evenly spaced. A journey with steps.'],
    ['signal', 'Graded large to small. Momentum, decay, direction.'],
    ['measure', 'Dots stretched into ticks. Evidence and numbers.'],
    ['orbit', 'Fused into one stroke. Infrastructure.'],
    ['network', 'Concentric lanes. One system, running on more than one level.'],
  ];
  return block({
    title: 'The Dot System',
    note: 'Six states of one element. Every ring on this site is the same set of marks described by four numbers — width, height, radial lane, opacity — which is why any state can morph into any other.',
    body: `
    <div class="specimen-grid">
      ${specs
        .map(
          ([state, note]) => `
        <div class="specimen" data-reveal="rise">
          <div class="specimen__stage">
            ${ring({
              states: [state],
              arc: 300,
              from: -90,
              solid: 0,
              count: 40,
              size: 'sm',
              tone: 'accent',
              spin: false,
            })}
          </div>
          <span class="specimen__name">${esc(state)}</span>
          <span class="specimen__note">${esc(note)}</span>
        </div>`
        )
        .join('')}
    </div>

    <h3 class="portfolio__group-label" style="margin:var(--space-16) 0 var(--space-6)">
      Live morph
    </h3>
    <div class="specimen" data-reveal="rise" style="max-width:420px">
      <div class="specimen__stage">
        ${ring({
          states: ['path', 'signal', 'measure', 'orbit', 'network'],
          arc: 300,
          from: -90,
          solid: 44,
          count: 42,
          size: 'sm',
          tone: 'accent',
          spin: false,
        })}
      </div>
      <span class="specimen__note">
        The full cycle, with a solid tail held constant. Rotation never exceeds
        0.6°/second and the whole system freezes under prefers-reduced-motion.
      </span>
    </div>`,
  });
};

const componentsBlock = () =>
  block({
    title: 'Components',
    note: 'Every component reads semantic tokens only. None of them knows what colour it is until the surface tells it.',
    body: `
    <div class="ds-panel" data-reveal="rise">
      <p class="label" style="margin-bottom:var(--space-5)">Buttons</p>
      <div class="ds-row">
        ${button({ label: 'Primary', href: '#' })}
        ${button({ label: 'Accent', href: '#', variant: 'accent' })}
        ${button({ label: 'Ghost', href: '#', variant: 'ghost' })}
        ${button({ label: 'Small', href: '#', size: 'sm' })}
        ${linkArrow({ label: 'Text link', href: '#' })}
      </div>
    </div>

    <div class="ds-panel ds-panel--dark" data-theme="dark" data-reveal="rise"
         style="margin-top:var(--space-6)">
      <p class="label" style="margin-bottom:var(--space-5)">On an inverse surface</p>
      <div class="ds-row">
        ${button({ label: 'Primary', href: '#' })}
        ${button({ label: 'Accent', href: '#', variant: 'accent' })}
        ${button({ label: 'Ghost', href: '#', variant: 'ghost' })}
        ${linkArrow({ label: 'Text link', href: '#' })}
      </div>
    </div>

    <div class="ds-panel" data-reveal="rise" style="margin-top:var(--space-6)">
      <p class="label" style="margin-bottom:var(--space-5)">Labels, tags and filters</p>
      <div class="ds-row">
        ${eyebrow('Portfolio')}
        ${tag('Nooru.AI', 'var(--sn-prop-nooru)')}
        ${tag('Physical AI Connect', 'var(--sn-prop-physical)')}
      </div>
      <div style="margin-top:var(--space-6)">
        ${filterBar(
          [
            { label: 'All', value: 'all' },
            { label: 'AI Flywheel', value: 'flywheel', swatch: 'var(--sn-prop-flywheel)' },
            { label: 'SNX', value: 'snx', swatch: 'var(--sn-prop-snx)' },
          ],
          { name: 'demo' }
        )}
      </div>
    </div>

    <div style="margin-top:var(--space-10)">
      <p class="label" style="margin-bottom:var(--space-5)">Property card</p>
      <div class="portfolio__cards">
        ${properties
          .slice(0, 2)
          .map((p, i) => propertyCard(p, { index: i }))
          .join('')}
      </div>
    </div>`,
  });

const principles = () =>
  block({
    title: 'Principles',
    note: 'Five rules that decide the argument when two options both look fine.',
    body: `
    <div class="pillars__list" style="gap:var(--space-10)">
      ${[
        [
          '01',
          'Institutional before expressive',
          'This is the entity that stands behind five brands. It should read calmer than any of them. When a choice is between more interesting and more credible, take credible.',
        ],
        [
          '02',
          'One accent, rationed',
          'Signal red and the serif italic are the only two things allowed to raise their voice. Spend them once per screen and they keep working.',
        ],
        [
          '03',
          'Evidence over adjectives',
          'Every number carries its source. Nothing says leading, premier or world-class. If a claim cannot be sourced, the row is cut rather than softened.',
        ],
        [
          '04',
          'The parent never competes',
          'No logins, no dashboards, no course catalogues. Every transactional action routes out to the property that owns it.',
        ],
        [
          '05',
          'Motion is decoration, never information',
          'Nothing on this site requires an animation to be understood. Under reduced-motion everything settles to a resolved state and the page reads identically.',
        ],
      ]
        .map(
          ([n, title, body]) => `
        <article class="pillar is-active" data-reveal="rise">
          <span class="pillar__n">${n}</span>
          <h3 class="pillar__title" style="font-size:var(--text-title-2)">${esc(title)}</h3>
          <p class="pillar__body">${esc(body)}</p>
        </article>`
        )
        .join('')}
    </div>`,
  });

const foundations = () =>
  block({
    title: 'Foundations',
    note: 'Spacing, radius and motion tokens. Nothing in the CSS uses a raw value.',
    body: `
    <div class="swatches">
      ${[
        ['Section rhythm', 'clamp(4.5rem, 2.5rem + 8vw, 10rem)'],
        ['Page inset', 'clamp(1.25rem, 0.4rem + 4vw, 5.5rem)'],
        ['Gutter', 'clamp(1rem, 0.5rem + 1.6vw, 2rem)'],
        ['Max width', '1440px'],
        ['Radius lg', '20px'],
        ['Radius pill', '999px'],
        ['House curve', 'cubic-bezier(.16, 1, .3, 1)'],
        ['Reveal', '900ms'],
      ]
        .map(
          ([k, v]) => `
        <div class="swatch" data-reveal="fade">
          <span class="swatch__name">${esc(k)}</span>
          <span class="swatch__value">${esc(v)}</span>
        </div>`
        )
        .join('')}
    </div>`,
  });

export const designSystemPage = () => ({
  path: '/design-system',
  title: 'StartNet Design System',
  description:
    'The StartNet visual system — the dot, the wordmark, colour, typography, components and the principles that govern them.',
  bodyClass: 'page-design-system',
  main: [
    pageHero({
      label: 'Design system',
      title: 'One dot, and everything {that follows}[.]',
      deck: 'The working system behind startnet.in — rendered from the same tokens and components every other page on this site uses.',
      ringOpts: {
        states: ['mark', 'path', 'signal', 'measure', 'orbit', 'network'],
        arc: 260,
        from: -180,
        solid: 50,
        count: 40,
        size: 'lg',
        tone: 'accent',
      },
    }),
    `<section class="section" data-surface="design-system">
      <div class="shell">
        ${identity()}
        ${colour()}
        ${typography()}
        ${dotStates()}
        ${componentsBlock()}
        ${foundations()}
        ${principles()}
      </div>
    </section>`,
  ].join('\n'),
});
