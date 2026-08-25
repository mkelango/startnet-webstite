/* ============================================================================
   PILLARS
   A numbered sequence where the sticky ring changes state as each pillar
   takes the viewport. The ring is not illustrating the text — it is telling
   you where you are in a five-part argument.
   ========================================================================== */

export function initPillars(scope = document) {
  scope.querySelectorAll('[data-pillars]').forEach((root) => {
    const items = [...root.querySelectorAll('[data-pillar]')];
    const ringEl = root.querySelector('[data-dot-ring]');
    const progress = root.querySelector('[data-pillar-progress]');
    const counter = root.querySelector('[data-pillar-counter]');
    if (!items.length) return;

    const setActive = (i) => {
      items.forEach((el, k) => el.classList.toggle('is-active', k === i));
      if (progress) {
        progress.style.setProperty('--p', String((i + 1) / items.length));
      }
      if (counter) {
        counter.textContent = String(i + 1).padStart(2, '0');
      }
      const state = items[i].dataset.pillarState;
      if (state && ringEl?.__snRing) ringEl.__snRing.setState(state, { instant: true });
    };

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          setActive(items.indexOf(entry.target));
        });
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: 0 }
    );

    items.forEach((el) => io.observe(el));
    setActive(0);
  });
}
