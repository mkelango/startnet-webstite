/* ============================================================================
   StartNet Design System — COMPONENT LIBRARY (markup layer)
   ----------------------------------------------------------------------------
   Every component here is a pure function returning an HTML string. They read
   only semantic tokens via class names — no inline colour, no inline size.
   ========================================================================== */

/* --- escaping ------------------------------------------------------------ */
export const esc = (s = '') =>
  String(s).replace(/[&<>"']/g, (c) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])
  );

/**
 * accent() — the two typographic moves this system is built on.
 *
 * 1. Braces promote a phrase to the editorial serif italic:
 *      'Tamil Nadu’s next {100,000} founders'
 *    At most ONE accent phrase per headline, on the words that carry the
 *    idea. Two accents in one line cancel each other out.
 *
 * 2. `[.]` renders the full stop in Signal red — the same period that ends
 *    the StartNet wordmark. It is the brand signing the sentence, so it
 *    belongs only at the end of a statement the company is prepared to own.
 *    It stays real text, so it is still read aloud as a full stop.
 */
export const accent = (s = '') =>
  esc(s)
    .replace(/\{([^}]+)\}/g, '<em class="accent">$1</em>')
    .replace(/\[\.\]/g, '<span class="brand-stop">.</span>');

/* --- inline icons -------------------------------------------------------- */

export const iconArrow = () =>
  `<svg class="icon" viewBox="0 0 16 16" aria-hidden="true" focusable="false"><path d="M4.5 11.5 11.5 4.5M5.75 4.5h5.75v5.75" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

export const iconArrowRight = () =>
  `<svg class="icon" viewBox="0 0 16 16" aria-hidden="true" focusable="false"><path d="M3 8h9.5M8.75 4.25 12.5 8l-3.75 3.75" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

export const iconChevron = () =>
  `<svg class="icon icon--chevron" viewBox="0 0 16 16" aria-hidden="true" focusable="false"><path d="M4 6.25 8 10.25l4-4" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

/* --- eyebrow -------------------------------------------------------------
   A pill label carrying the brand dot. This is where the dot appears at its
   smallest, most functional scale — a section's name badge.
   ------------------------------------------------------------------------ */
export const eyebrow = (label, { tone = '' } = {}) => `
  <p class="eyebrow${tone ? ` eyebrow--${tone}` : ''}">
    <span class="eyebrow__dot" aria-hidden="true"></span>
    <span class="eyebrow__label">${esc(label)}</span>
  </p>`;

/* --- button --------------------------------------------------------------
   Pill + detached circular arrow. The two halves move toward each other on
   hover — the interaction reads as "closing a gap", which is the entire
   point of a masterbrand whose job is routing people onward.
   ------------------------------------------------------------------------ */
export const button = ({
  label,
  href = '#',
  variant = 'primary', // primary | inverse | ghost | accent
  external = false,
  arrow = true,
  size = 'md', // sm | md
  ariaLabel = '',
} = {}) => {
  const rel = external ? ' target="_blank" rel="noopener"' : '';
  return `<a class="btn btn--${variant} btn--${size}${arrow ? ' btn--arrow' : ''}" href="${esc(
    href
  )}"${rel}${ariaLabel ? ` aria-label="${esc(ariaLabel)}"` : ''}>
    <span class="btn__label">${esc(label)}</span>
    ${arrow ? `<span class="btn__badge" aria-hidden="true">${iconArrow()}</span>` : ''}
  </a>`;
};

/* Submit variant — same anatomy, real <button type="submit">. */
export const submitButton = ({ label, variant = 'primary', size = 'md' } = {}) =>
  `<button type="submit" class="btn btn--${variant} btn--${size} btn--arrow">
    <span class="btn__label">${esc(label)}</span>
    <span class="btn__badge" aria-hidden="true">${iconArrow()}</span>
  </button>`;

/* --- text link with trailing arrow --------------------------------------- */
export const linkArrow = ({ label, href, external = false, tone = '' } = {}) => {
  const rel = external ? ' target="_blank" rel="noopener"' : '';
  return `<a class="link-arrow${tone ? ` link-arrow--${tone}` : ''}" href="${esc(
    href
  )}"${rel}><span>${esc(label)}</span>${iconArrowRight()}</a>`;
};

/* --- rule ----------------------------------------------------------------
   A hairline that draws itself in on reveal. Used to separate a claim from
   its evidence — never as pure decoration.
   ------------------------------------------------------------------------ */
export const rule = ({ inset = false } = {}) =>
  `<span class="rule${inset ? ' rule--inset' : ''}" data-reveal="rule" aria-hidden="true"></span>`;

/* --- THE DOT SYSTEM ------------------------------------------------------
   Renders the mount point for a ring. All geometry is produced at runtime by
   assets/js/dot-system.js so a single element can morph between the six
   states of the Dot without shipping six sets of markup.

   states:  mark | path | signal | measure | orbit | network
   ------------------------------------------------------------------------ */
export const ring = ({
  id = '',
  states = ['path', 'signal', 'measure', 'orbit', 'network'],
  arc = 300, // degrees of the ring that carry the morphing treatment
  from = 118, // start angle, degrees, 0 = 3 o'clock, clockwise
  solid = 0, // degrees at the tail rendered as a continuous stroke
  count = 34, // number of dots at rest
  size = 'lg', // sm | md | lg | xl
  tone = 'accent', // accent | ink | inverse | ghost
  spin = true,
  className = '',
} = {}) => `
  <div class="ring ring--${size} ring--${tone}${className ? ` ${className}` : ''}"
       ${id ? `id="${esc(id)}"` : ''}
       data-dot-ring
       data-states="${states.join(',')}"
       data-arc="${arc}"
       data-from="${from}"
       data-solid="${solid}"
       data-count="${count}"
       data-spin="${spin ? 'true' : 'false'}"
       aria-hidden="true">
    <svg class="ring__svg" viewBox="0 0 400 400" fill="none" preserveAspectRatio="xMidYMid meet">
      <g class="ring__ghost"></g>
      <g class="ring__marks"></g>
    </svg>
  </div>`;

/* --- section shell -------------------------------------------------------- */
export const section = ({
  id = '',
  theme = '', // '' | dark | paper
  tone = '', // extra modifier
  className = '',
  inner = '',
  full = false,
} = {}) => `
  <section class="section${tone ? ` section--${tone}` : ''}${className ? ` ${className}` : ''}"
    ${id ? `id="${esc(id)}"` : ''}${theme ? ` data-theme="${theme}"` : ''}>
    ${full ? inner : `<div class="shell">${inner}</div>`}
  </section>`;

/* --- section header ------------------------------------------------------
   The canonical two-column head: label + headline on the left, editorial
   deck + call to action on the right. Mirrors the reference's split so the
   eye always knows where the claim ends and the invitation begins.
   ------------------------------------------------------------------------ */
export const sectionHead = ({
  label = '',
  title = '',
  deck = '',
  cta = null,
  align = 'split', // split | stacked | centre
  level = 2,
} = {}) => `
  <header class="section-head section-head--${align}" data-reveal-group>
    <div class="section-head__lead">
      ${label ? eyebrow(label) : ''}
      <h${level} class="section-head__title" data-reveal="rise">${accent(title)}</h${level}>
    </div>
    ${
      deck || cta
        ? `<div class="section-head__aside" data-reveal="rise">
             ${deck ? `<p class="deck">${accent(deck)}</p>` : ''}
             ${cta ? button(cta) : ''}
           </div>`
        : ''
    }
  </header>`;

/* --- property card -------------------------------------------------------
   A window into a sub-brand, not a transplant of it. The only thing the
   sub-brand is allowed to bring onto this page is a single swatch dot.
   ------------------------------------------------------------------------ */
export const propertyCard = (p, { index = 0 } = {}) => `
  <a class="prop-card" href="${esc(p.href)}"
     style="--prop: ${p.swatch}" data-reveal="rise" data-reveal-i="${index}"
     data-property="${esc(p.id)}">
    <span class="prop-card__swatch" aria-hidden="true"></span>
    <span class="prop-card__kind">${esc(p.kind)}</span>
    <h3 class="prop-card__name">${esc(p.name)}</h3>
    <p class="prop-card__line">${esc(p.line)}</p>
    <span class="prop-card__foot">
      <span class="prop-card__cta">Explore ${esc(p.name)}</span>
      <span class="prop-card__badge" aria-hidden="true">${iconArrow()}</span>
    </span>
  </a>`;

/* --- news card ------------------------------------------------------------ */
export const newsCard = (n, propertyById, { index = 0 } = {}) => {
  const prop = n.propertyId ? propertyById[n.propertyId] : null;
  const rel = n.external ? ' target="_blank" rel="noopener"' : '';
  return `
  <a class="news-card" href="${esc(n.href)}"${rel}
     style="--prop: ${prop ? prop.swatch : 'var(--sn-signal)'}"
     data-reveal="rise" data-reveal-i="${index}"
     data-property="${esc(n.propertyId || 'startnet')}">
    <span class="news-card__meta">
      <span class="tag"><span class="tag__dot" aria-hidden="true"></span>${esc(
        prop ? prop.name : 'StartNet'
      )}</span>
      <time datetime="${esc(n.date)}">${esc(n.dateDisplay)}</time>
    </span>
    <h3 class="news-card__title">${esc(n.title)}</h3>
    <p class="news-card__summary">${esc(n.summary)}</p>
    <span class="news-card__foot">
      <span class="news-card__badge" aria-hidden="true">${iconArrow()}</span>
    </span>
  </a>`;
};

/* --- tag ------------------------------------------------------------------ */
export const tag = (label, swatch = 'var(--sn-signal)') =>
  `<span class="tag" style="--prop:${swatch}"><span class="tag__dot" aria-hidden="true"></span>${esc(
    label
  )}</span>`;

/* --- stat / ledger figure -------------------------------------------------
   The counter animates from 0 only once, on first reveal. Numbers that
   re-animate every scroll read as decoration; these are evidence.
   ------------------------------------------------------------------------ */
export const stat = (m, { index = 0 } = {}) => `
  <div class="stat" data-reveal="rise" data-reveal-i="${index}">
    <div class="stat__value" data-counter="${m.value}" data-display="${esc(m.display)}">${esc(
  m.display
)}</div>
    <div class="stat__label">${esc(m.label)}</div>
    <div class="stat__source">Source: ${esc(m.source)}</div>
  </div>`;

/* --- page hero (inner pages) ---------------------------------------------- */
export const pageHero = ({
  label,
  title,
  deck = '',
  ringOpts = null,
  badge = '', // optional — a self-contained SVG string centred in the ring.
  className = '', // optional page-specific modifier, scopes badge CSS safely.
}) => `
  <section class="page-hero${className ? ` ${className}` : ''}" data-reveal-group>
    <div class="shell page-hero__shell">
      <div class="page-hero__body">
        ${eyebrow(label)}
        <h1 class="page-hero__title" data-reveal="rise">${accent(title)}</h1>
        ${deck ? `<p class="page-hero__deck deck" data-reveal="rise">${accent(deck)}</p>` : ''}
      </div>
      ${
        ringOpts && badge
          ? `<div class="page-hero__ring-stage">
               <div class="page-hero__ring-reveal" data-reveal="fade">
                 ${ring(ringOpts)}
                 <div class="page-hero__badge" aria-hidden="true">
                   <span class="page-hero__badge-halo"></span>
                   ${badge}
                 </div>
               </div>
             </div>`
          : ringOpts
          ? ring(ringOpts)
          : ''
      }
    </div>
    <span class="hairline-gradient" aria-hidden="true"></span>
  </section>`;

/* --- sub navigation (inner page tabs) ------------------------------------- */
export const subnav = (items, activeHref) => `
  <nav class="subnav" aria-label="Section">
    <div class="shell subnav__shell">
      <ul class="subnav__list">
        ${items
          .map(
            (i) =>
              `<li><a class="subnav__item${
                i.href === activeHref ? ' is-active' : ''
              }" href="${esc(i.href)}"${
                i.href === activeHref ? ' aria-current="page"' : ''
              }>${esc(i.label)}</a></li>`
          )
          .join('')}
      </ul>
    </div>
  </nav>`;

/* --- filter bar ----------------------------------------------------------- */
export const filterBar = (items, { name = 'filter' } = {}) => `
  <div class="filterbar" data-filter-bar="${esc(name)}" role="tablist" aria-label="Filter">
    ${items
      .map(
        (i, k) =>
          `<button class="chip${k === 0 ? ' is-active' : ''}" type="button" role="tab"
             aria-selected="${k === 0}" data-filter-value="${esc(i.value)}"
             ${i.swatch ? `style="--prop:${i.swatch}"` : ''}>
             ${i.swatch ? '<span class="chip__dot" aria-hidden="true"></span>' : ''}${esc(
            i.label
          )}</button>`
      )
      .join('')}
  </div>`;
