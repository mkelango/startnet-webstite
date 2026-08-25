/* ============================================================================
   COUNTERS
   Numbers count up once, on first reveal, and keep their published
   formatting (commas, plus signs). If JavaScript never runs, the final
   figure is already in the HTML — the evidence does not depend on the
   animation.
   ========================================================================== */

const easeOutExpo = (t) => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t));

function formatLike(template, value) {
  /* Preserve the published shape: "2,400+" keeps its comma and its plus. */
  const hasPlus = template.includes('+');
  const grouped = Math.round(value).toLocaleString('en-IN');
  return grouped + (hasPlus ? '+' : '');
}

export function initCounters(scope = document) {
  const nodes = scope.querySelectorAll('[data-counter]');
  if (!nodes.length) return;

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  nodes.forEach((el) => {
    const target = Number(el.dataset.counter);
    const display = el.dataset.display || el.textContent.trim();
    if (!Number.isFinite(target) || reduced) return;

    let started = false;
    const run = () => {
      if (started) return;
      started = true;
      const duration = 1400;
      const t0 = performance.now();
      const step = (now) => {
        const p = Math.min(1, (now - t0) / duration);
        el.textContent = formatLike(display, target * easeOutExpo(p));
        if (p < 1) requestAnimationFrame(step);
        else el.textContent = display;
      };
      el.textContent = formatLike(display, 0);
      requestAnimationFrame(step);
    };

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            run();
            io.disconnect();
          }
        });
      },
      { threshold: 0.4 }
    );
    io.observe(el);
  });
}
