/* ============================================================================
   HEADER — condense, mega menu, mobile menu
   The exit points of a masterbrand site should never be more than one
   scroll-and-click away, so nothing here ever traps focus except the mobile
   overlay, which is a genuine modal.
   ========================================================================== */

const CONDENSE_AT = 100;

export function initHeader() {
  const header = document.querySelector('[data-header]');
  if (!header) return;

  /* ---- condense on scroll -------------------------------------------- */
  let ticking = false;
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      header.classList.toggle('is-condensed', window.scrollY > CONDENSE_AT);
      ticking = false;
    });
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---- mega menu ------------------------------------------------------ */
  const trigger = header.querySelector('[data-mega-trigger]');
  const mega = document.getElementById('mega-portfolio');
  const megaRoot = header.querySelector('[data-mega-root]');

  if (trigger && mega) {
    let closeTimer = null;

    const open = () => {
      clearTimeout(closeTimer);
      if (!mega.hidden) return;
      mega.hidden = false;
      /* Next frame so the transition has a start value to run from. */
      requestAnimationFrame(() => mega.classList.add('is-open'));
      trigger.setAttribute('aria-expanded', 'true');
    };

    const close = ({ immediate = false } = {}) => {
      clearTimeout(closeTimer);
      const finish = () => {
        mega.classList.remove('is-open');
        trigger.setAttribute('aria-expanded', 'false');
        window.setTimeout(() => {
          if (!mega.classList.contains('is-open')) mega.hidden = true;
        }, 260);
      };
      if (immediate) finish();
      else closeTimer = window.setTimeout(finish, 140);
    };

    trigger.addEventListener('click', () =>
      mega.hidden ? open() : close({ immediate: true })
    );

    /* Pointer intent: open on hover, but forgive the diagonal travel from
       the trigger down into the panel. */
    const hoverZone = [megaRoot, mega].filter(Boolean);
    hoverZone.forEach((el) => {
      el.addEventListener('pointerenter', (e) => {
        if (e.pointerType === 'mouse') open();
      });
      el.addEventListener('pointerleave', (e) => {
        if (e.pointerType === 'mouse') close();
      });
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !mega.hidden) {
        close({ immediate: true });
        trigger.focus();
      }
    });

    document.addEventListener('focusin', (e) => {
      if (mega.hidden) return;
      if (!mega.contains(e.target) && !megaRoot.contains(e.target)) {
        close({ immediate: true });
      }
    });

    document.addEventListener('click', (e) => {
      if (mega.hidden) return;
      if (!mega.contains(e.target) && !megaRoot.contains(e.target)) {
        close({ immediate: true });
      }
    });
  }

  /* ---- mobile menu ---------------------------------------------------- */
  const burger = header.querySelector('[data-burger]');
  const menu = document.querySelector('[data-mobile-menu]');

  if (burger && menu) {
    let lastFocus = null;

    const openMenu = () => {
      lastFocus = document.activeElement;
      menu.hidden = false;
      requestAnimationFrame(() => menu.classList.add('is-open'));
      burger.setAttribute('aria-expanded', 'true');
      burger.setAttribute('aria-label', 'Close menu');
      document.body.classList.add('is-locked');
      const first = menu.querySelector('a, button');
      if (first) first.focus({ preventScroll: true });
    };

    const closeMenu = () => {
      menu.classList.remove('is-open');
      burger.setAttribute('aria-expanded', 'false');
      burger.setAttribute('aria-label', 'Open menu');
      document.body.classList.remove('is-locked');
      window.setTimeout(() => {
        if (!menu.classList.contains('is-open')) menu.hidden = true;
      }, 280);
      if (lastFocus) lastFocus.focus({ preventScroll: true });
    };

    burger.addEventListener('click', () => (menu.hidden ? openMenu() : closeMenu()));

    menu.addEventListener('click', (e) => {
      if (e.target.closest('a')) closeMenu();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !menu.hidden) closeMenu();
      if (e.key !== 'Tab' || menu.hidden) return;
      /* Focus trap — the overlay covers the page, so it owns the tab ring. */
      const focusables = [
        burger,
        ...menu.querySelectorAll('a[href], button:not([disabled])'),
      ].filter((el) => el.offsetParent !== null || el === burger);
      if (!focusables.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    });

    const mq = window.matchMedia('(min-width: 1024px)');
    mq.addEventListener('change', (e) => {
      if (e.matches && !menu.hidden) closeMenu();
    });
  }

  /* ---- mobile accordion ------------------------------------------------ */
  document.querySelectorAll('[data-acc-trigger]').forEach((btn) => {
    const panel = btn.parentElement.querySelector('[data-acc-panel]');
    if (!panel) return;
    btn.addEventListener('click', () => {
      const open = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!open));
      panel.hidden = open;
    });
  });
}
