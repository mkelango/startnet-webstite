/* ============================================================================
   404 — still a routing page
   Even a missed URL is an opportunity to point someone at the right door.
   ========================================================================== */

import { properties } from '../data/site.js';
import { accent, esc, eyebrow, ring, button } from '../lib/ui.js';

export const notFoundPage = () => ({
  path: '/404',
  title: 'Page not found: StartNet',
  description: 'That page does not exist. Here are the five doors that do.',
  bodyClass: 'page-404',
  main: `
<section class="hero" data-surface="404">
  <div class="shell hero__shell">
    <div class="hero__body">
      ${eyebrow('404')}
      <h1 class="hero__title display-2" style="margin-top:var(--space-6)">${accent(
        'That door doesn’t exist. {These five do}[.]'
      )}</h1>
      <div class="routes" style="margin-top:var(--space-10);max-width:560px">
        ${properties
          .map(
            (p) => `
          <a class="route" href="${esc(p.href)}"
             style="--prop:${p.swatch}">
            <span class="route__dot" aria-hidden="true"></span>
            <span class="route__label"><strong>${esc(p.name)}</strong>${esc(p.kind)}</span>
            <svg class="icon" viewBox="0 0 16 16" aria-hidden="true" width="14" height="14"><path d="M4.5 11.5 11.5 4.5M5.75 4.5h5.75v5.75" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </a>`
          )
          .join('')}
      </div>
      <div style="margin-top:var(--space-10)">
        ${button({ label: 'Back to StartNet', href: '/', variant: 'primary' })}
      </div>
    </div>
    ${ring({
      states: ['signal', 'path'],
      arc: 200,
      from: -175,
      solid: 60,
      count: 30,
      size: 'lg',
      tone: 'accent',
      className: 'hero__ring',
    })}
  </div>
</section>`,
});
