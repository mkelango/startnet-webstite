/* ============================================================================
   LEGAL — Privacy & Terms
   Placeholder copy, structurally complete. Replace the body text before
   launch; the shell, nav and footer are already load-bearing.
   ========================================================================== */

import { site } from '../data/site.js';
import { pageHero } from '../lib/ui.js';

const shell = (paras) => `
<section class="section section--tight" data-surface="legal">
  <div class="shell">
    <div class="prose">
      ${paras.map((p) => `<p>${p}</p>`).join('\n')}
    </div>
  </div>
</section>`;

export const privacyPage = () => ({
  path: '/privacy',
  title: 'Privacy — StartNet',
  description: 'How StartNet collects, uses and protects information across startnet.in.',
  bodyClass: 'page-legal',
  main: [
    pageHero({ label: 'Legal', title: 'Privacy' }),
    shell([
      `This page describes how StartNet handles information collected through startnet.in. It does not cover the five properties in the portfolio, each of which publishes and is responsible for its own privacy policy.`,
      `<strong>Placeholder — replace before launch.</strong> This draft has not been reviewed by counsel and should not be published as-is.`,
      `Questions about this policy can be sent to <a href="mailto:${site.email.general}">${site.email.general}</a>.`,
    ]),
  ].join('\n'),
});

export const termsPage = () => ({
  path: '/terms',
  title: 'Terms — StartNet',
  description: 'Terms of use for startnet.in.',
  bodyClass: 'page-legal',
  main: [
    pageHero({ label: 'Legal', title: 'Terms of use' }),
    shell([
      `These terms govern use of startnet.in, the masterbrand site for the StartNet portfolio. Each of the five properties — AI Flywheel, Nooru.AI, Agentic AI Connect, Physical AI Connect and SNX — operates under its own terms, published on its own domain.`,
      `<strong>Placeholder — replace before launch.</strong> This draft has not been reviewed by counsel and should not be published as-is.`,
      `Questions about these terms can be sent to <a href="mailto:${site.email.general}">${site.email.general}</a>.`,
    ]),
  ].join('\n'),
});
