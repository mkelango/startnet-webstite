/* ============================================================================
   THE ORBIT
   ----------------------------------------------------------------------------
   Five dots on one ring. Each dot is a property; the active one opens into
   the centre. This is the single component that carries the whole strategic
   argument — that these five things are one system, not five links — and it
   does it with the brand's own atomic element rather than a stock carousel.

   The markup is complete and readable before this file runs: all five names,
   descriptions and outbound links are in the DOM as a plain list, which is
   what search and answer engines index. This only enhances.
   ========================================================================== */

const VIEW = 400;
const C = VIEW / 2;
const R = 148;
const AUTOPLAY_MS = 4200;

const svgEl = (name, attrs = {}) => {
  const el = document.createElementNS('http://www.w3.org/2000/svg', name);
  for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
  return el;
};

class Orbit {
  constructor(root) {
    this.root = root;
    this.items = [...root.querySelectorAll('[data-orbit-item]')];
    if (this.items.length < 2) return;

    this.nodesGroup = root.querySelector('.orbit__nodes');
    this.centre = root.querySelector('.orbit__centre');
    this.rotor = root.querySelector('.orbit__rotor');

    this.fields = {
      group: this.centre.querySelector('.orbit__group'),
      name: this.centre.querySelector('.orbit__name'),
      line: this.centre.querySelector('.orbit__line'),
      link: this.centre.querySelector('.orbit__link'),
      linkLabel: this.centre.querySelector('.orbit__link span'),
    };

    this.active = 0;
    this.paused = false;
    this.timer = null;

    this.buildNodes();
    this.bind();
    this.select(0, { instant: true });
  }

  /** Place one dot per property, evenly, starting at 12 o'clock. */
  buildNodes() {
    const n = this.items.length;
    this.nodes = this.items.map((btn, i) => {
      const angle = (360 / n) * i - 90;
      const rad = (angle * Math.PI) / 180;
      const cx = C + R * Math.cos(rad);
      const cy = C + R * Math.sin(rad);
      const swatch = btn.dataset.swatch || 'var(--sn-signal)';

      const g = svgEl('g', { class: 'orbit__node', 'data-i': String(i) });
      const halo = svgEl('circle', {
        class: 'orbit__halo',
        cx: cx.toFixed(2),
        cy: cy.toFixed(2),
        r: 22,
        fill: swatch,
      });
      const dot = svgEl('circle', {
        class: 'orbit__dot',
        cx: cx.toFixed(2),
        cy: cy.toFixed(2),
        r: 7,
        fill: swatch,
      });
      g.append(halo, dot);
      this.nodesGroup.appendChild(g);
      return { g, halo, dot, angle, btn };
    });
  }

  bind() {
    this.items.forEach((btn, i) => {
      btn.addEventListener('click', () => {
        this.select(i);
        this.restart();
      });
      btn.addEventListener('focus', () => this.select(i));
    });

    /* Pause when a person is actually looking at it or interacting. */
    ['pointerenter', 'focusin'].forEach((ev) =>
      this.root.addEventListener(ev, () => {
        this.paused = true;
      })
    );
    ['pointerleave', 'focusout'].forEach((ev) =>
      this.root.addEventListener(ev, () => {
        if (this.root.contains(document.activeElement)) return;
        this.paused = false;
      })
    );

    this.root.addEventListener('keydown', (e) => {
      if (!['ArrowRight', 'ArrowLeft', 'ArrowUp', 'ArrowDown'].includes(e.key)) return;
      e.preventDefault();
      const dir = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : -1;
      const next = (this.active + dir + this.items.length) % this.items.length;
      this.items[next].focus();
      this.select(next);
      this.restart();
    });
  }

  select(i, { instant = false } = {}) {
    if (i === this.active && !instant) return;
    this.active = i;
    const btn = this.items[i];
    const d = btn.dataset;

    this.items.forEach((b, k) => {
      b.classList.toggle('is-active', k === i);
      b.setAttribute('aria-selected', String(k === i));
      b.tabIndex = k === i ? 0 : -1;
    });

    this.nodes.forEach((node, k) => {
      node.g.classList.toggle('is-active', k === i);
    });

    /* Turn the ring so the live property sits at twelve o'clock. The nodes
       are circles, so they need no counter-rotation. */
    if (this.rotor) {
      this.rotor.style.transform = `rotate(${-(360 / this.items.length) * i}deg)`;
    }

    const swap = () => {
      this.centre.style.setProperty('--prop', d.swatch || 'var(--sn-signal)');
      this.fields.group.textContent = d.group || '';
      this.fields.name.textContent = d.name || '';
      this.fields.line.textContent = d.line || '';
      this.fields.link.href = d.href || '#';
      this.fields.linkLabel.textContent = `Explore ${d.name || ''}`;
    };

    if (instant || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      swap();
      this.centre.classList.add('is-in');
      return;
    }

    this.centre.classList.remove('is-in');
    clearTimeout(this.swapTimer);
    this.swapTimer = window.setTimeout(() => {
      swap();
      this.centre.classList.add('is-in');
    }, 220);
  }

  restart() {
    clearInterval(this.timer);
    this.start();
  }

  start() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    clearInterval(this.timer);
    this.timer = window.setInterval(() => {
      if (this.paused || document.hidden) return;
      this.select((this.active + 1) % this.items.length);
    }, AUTOPLAY_MS);
  }

  stop() {
    clearInterval(this.timer);
    this.timer = null;
  }
}

export function initOrbit(scope = document) {
  const roots = scope.querySelectorAll('[data-orbit]');
  roots.forEach((root) => {
    const orbit = new Orbit(root);
    if (!orbit.nodes) return;
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => (e.isIntersecting ? orbit.start() : orbit.stop())),
      { threshold: 0.25 }
    );
    io.observe(root);
  });
}
