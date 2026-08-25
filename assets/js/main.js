/* ============================================================================
   StartNet — entry point
   Everything below is an enhancement. The page is complete, readable and
   navigable before a single line of it runs.
   ========================================================================== */

import { initDotSystem } from './dot-system.js';
import { initReveal } from './reveal.js';
import { initHeader } from './header.js';
import { initCounters } from './counters.js';
import { initOrbit } from './orbit.js';
import { initFilters } from './filters.js';
import { initPillars } from './pillars.js';
import { initForm } from './form.js';
import { initOutboundTracking } from './telemetry.js';

/* Marks the document as enhanced. Reveal styles only bite once this is set,
   so a failed module load can never leave content invisible. */
document.documentElement.classList.add('js-on');

const boot = () => {
  initHeader();
  initDotSystem();
  initReveal();
  initCounters();
  initOrbit();
  initFilters();
  initPillars();
  initForm();
  initOutboundTracking();
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot, { once: true });
} else {
  boot();
}
