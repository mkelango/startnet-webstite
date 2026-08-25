/* ============================================================================
   REVEAL
   One observer for the whole document. Elements reveal once and are then
   unobserved — content that re-animates on every pass reads as decoration,
   and this page is asking to be believed, not admired.
   ========================================================================== */

export function initReveal(scope = document) {
  const nodes = scope.querySelectorAll('[data-reveal]');
  if (!nodes.length) return;

  /* Assign stagger indices within each group so a row of cards arrives as a
     sequence rather than a block. */
  scope.querySelectorAll('[data-reveal-group]').forEach((group) => {
    group.querySelectorAll('[data-reveal]').forEach((el, i) => {
      if (!el.dataset.revealI) el.dataset.revealI = String(i);
    });
  });

  nodes.forEach((el) => {
    if (el.dataset.revealI) el.style.setProperty('--reveal-i', el.dataset.revealI);
  });

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    nodes.forEach((el) => el.classList.add('is-revealed'));
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-revealed');
        entry.target.dispatchEvent(new CustomEvent('sn:reveal', { bubbles: true }));
        io.unobserve(entry.target);
      });
    },
    { rootMargin: '0px 0px -12% 0px', threshold: 0.05 }
  );

  nodes.forEach((el) => io.observe(el));
}
