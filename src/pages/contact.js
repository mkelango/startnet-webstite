/* ============================================================================
   CONTACT
   The form is the fallback. The direct routes beside it exist because most
   people arriving here already know which property they want — and a
   masterbrand should never make them wait for a reply to find out.
   ========================================================================== */

import { site, properties, propertyById } from '../data/site.js';
import { esc, eyebrow, pageHero, submitButton } from '../lib/ui.js';

const routes = [
  { label: 'Founder support', target: 'x' },
  { label: 'Lab & accreditation questions', target: 'research' },
  { label: 'Student & Vibathon questions', target: 'vibe' },
  { label: 'Cohort applications', target: 'ai' },
  { label: 'Event & sponsorship', target: 'connect' },
];

const form = () => `
<section class="section" id="get-in-touch" data-surface="contact">
  <div class="shell contact">
    <div data-reveal-group>
      ${eyebrow('Send a message')}
      <h2 class="title-2" data-reveal="rise" style="margin:var(--space-5) 0 var(--space-8)">
        Not sure which property you’re looking for? Start here.
      </h2>

      <form class="contact__form" data-contact-form novalidate data-reveal="rise">
        <div class="contact__row">
          <div class="field" data-field>
            <label class="field__label" for="f-name">Name</label>
            <input class="field__control" id="f-name" name="name" type="text"
                   autocomplete="name" placeholder="Your name" required>
            <p class="field__error" aria-live="polite"></p>
          </div>
          <div class="field" data-field>
            <label class="field__label" for="f-email">Email</label>
            <input class="field__control" id="f-email" name="email" type="email"
                   autocomplete="email" placeholder="you@example.com" required>
            <p class="field__error" aria-live="polite"></p>
          </div>
        </div>

        <div class="field" data-field>
          <label class="field__label" for="f-topic">I’m reaching out about</label>
          <select class="field__control" id="f-topic" name="topic" required>
            <option value="">Choose one</option>
            <option>General</option>
            <option>Partnership</option>
            <option>Press</option>
            <option>Careers</option>
            <option>A specific property</option>
          </select>
          <p class="field__error" aria-live="polite"></p>
        </div>

        <div class="field" data-field>
          <label class="field__label" for="f-message">Message</label>
          <textarea class="field__control" id="f-message" name="message"
                    placeholder="A sentence or two is enough." required></textarea>
          <p class="field__error" aria-live="polite"></p>
        </div>

        ${submitButton({ label: 'Send message' })}

        <p class="contact__done" data-form-done hidden tabindex="-1">
          Thanks — your message is on its way. We reply to everything within two working days.
        </p>
      </form>
    </div>

    <aside data-reveal-group>
      ${eyebrow('Direct routes')}
      <p class="deck" style="margin:var(--space-5) 0 var(--space-4)" data-reveal="fade">
        Already know where you are going? Skip us entirely.
      </p>
      <div class="routes">
        ${routes
          .map((r, i) => {
            const p = propertyById[r.target];
            return `
          <a class="route" href="${esc(p.href)}"
             style="--prop:${p.swatch}" data-reveal="fade" data-reveal-i="${i}">
            <span class="route__dot" aria-hidden="true"></span>
            <span class="route__label"><strong>${esc(r.label)}</strong>${esc(p.domain)}</span>
            <svg class="icon" viewBox="0 0 16 16" aria-hidden="true" width="14" height="14"><path d="M4.5 11.5 11.5 4.5M5.75 4.5h5.75v5.75" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </a>`;
          })
          .join('')}
      </div>

      <div class="routes" style="margin-top:var(--space-8)">
        <a class="route" href="mailto:${esc(site.email.press)}" style="--prop:var(--sn-signal)">
          <span class="route__dot" aria-hidden="true"></span>
          <span class="route__label"><strong>Press</strong>${esc(site.email.press)}</span>
          <span></span>
        </a>
        <a class="route" href="mailto:${esc(site.email.partners)}" style="--prop:var(--sn-signal)">
          <span class="route__dot" aria-hidden="true"></span>
          <span class="route__label"><strong>Partnerships</strong>${esc(
            site.email.partners
          )}</span>
          <span></span>
        </a>
        <a class="route" href="mailto:${esc(site.email.careers)}" style="--prop:var(--sn-signal)">
          <span class="route__dot" aria-hidden="true"></span>
          <span class="route__label"><strong>Careers</strong>${esc(site.email.careers)}</span>
          <span></span>
        </a>
      </div>
    </aside>
  </div>
</section>`;

export const contactPage = () => ({
  path: '/contact',
  title: 'Contact StartNet',
  description:
    'Get in touch with StartNet — general enquiries, partnerships, press and careers, all in one place.',
  bodyClass: 'page-contact',
  main: [
    pageHero({
      label: 'Contact',
      title: 'Get in touch. {We’ll point you the right way}[.]',
      ringOpts: {
        states: ['path', 'orbit'],
        arc: 180,
        from: -170,
        solid: 70,
        count: 28,
        size: 'md',
        tone: 'accent',
      },
    }),
    form(),
  ].join('\n'),
  schema: JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: 'Contact StartNet',
    url: `${site.origin}/contact`,
  }),
});
