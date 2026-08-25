/* ============================================================================
   FILTERS — newsroom and careers
   Functional, not decorative (Content doc §5.2). Filtering rewrites the URL
   hash so a filtered view is linkable, and announces the result count so it
   is not a silent change for screen reader users.
   ========================================================================== */

export function initFilters(scope = document) {
  scope.querySelectorAll('[data-filter-bar]').forEach((bar) => {
    const name = bar.dataset.filterBar;
    const list = scope.querySelector(`[data-filter-target="${name}"]`);
    if (!list) return;

    const items = [...list.querySelectorAll('[data-property]')];
    const chips = [...bar.querySelectorAll('[data-filter-value]')];
    const status = scope.querySelector(`[data-filter-status="${name}"]`);
    const empty = scope.querySelector(`[data-filter-empty="${name}"]`);

    const apply = (value, { push = true } = {}) => {
      let shown = 0;
      items.forEach((el) => {
        const match = value === 'all' || el.dataset.property === value;
        el.hidden = !match;
        if (match) shown += 1;
      });

      chips.forEach((c) => {
        const on = c.dataset.filterValue === value;
        c.classList.toggle('is-active', on);
        c.setAttribute('aria-selected', String(on));
      });

      if (empty) empty.hidden = shown > 0;
      if (status) {
        const label =
          chips.find((c) => c.dataset.filterValue === value)?.textContent.trim() || 'All';
        status.textContent = `${shown} ${shown === 1 ? 'entry' : 'entries'} · ${label}`;
      }

      if (push) {
        const url = new URL(window.location.href);
        if (value === 'all') url.searchParams.delete(name);
        else url.searchParams.set(name, value);
        history.replaceState(null, '', url);
      }
    };

    chips.forEach((chip) =>
      chip.addEventListener('click', () => apply(chip.dataset.filterValue))
    );

    /* Deep link support: /newsroom?property=nooru */
    const initial = new URL(window.location.href).searchParams.get(name);
    const valid = chips.some((c) => c.dataset.filterValue === initial);
    apply(valid ? initial : 'all', { push: false });
  });
}
