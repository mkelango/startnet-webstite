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
      `This page describes how StartNet handles information collected through startnet.in, across all five doors — StartNet X, Connect, Research, Vibe and AI.`,
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
      `These terms govern use of startnet.in and all five doors published on it — StartNet X, StartNet Connect, StartNet Research, StartNet Vibe and StartNet AI.`,
      `<strong>Placeholder — replace before launch.</strong> This draft has not been reviewed by counsel and should not be published as-is.`,
      `Questions about these terms can be sent to <a href="mailto:${site.email.general}">${site.email.general}</a>.`,
    ]),
  ].join('\n'),
});
