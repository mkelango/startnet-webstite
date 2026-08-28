/* ============================================================================
   StartNet Design System — DOCUMENT SHELL, HEADER, FOOTER
   ========================================================================== */

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { site, nav, properties, aboutMenu } from '../data/site.js';
import { esc, accent, button, iconChevron, iconArrow, eyebrow } from './ui.js';

const brandDir = new URL('../../assets/brand/', import.meta.url);
const readBrand = (f) => readFileSync(fileURLToPath(new URL(f, brandDir)), 'utf8').trim();

const WORDMARK = readBrand('startnet-wordmark.svg');
const MONOGRAM = readBrand('startnet-monogram.svg');
const ROCKET = readBrand('startnet-rocket.svg');

/* The wordmark, stripped of its own <svg> wrapper attributes we override. */
const wordmark = (className = '') =>
  WORDMARK.replace(
    '<svg ',
    `<svg class="sn-wordmark${className ? ` ${className}` : ''}" `
  );

export const monogram = (className = '') =>
  MONOGRAM.replace('<svg ', `<svg class="sn-monogram${className ? ` ${className}` : ''}" `);

/* About page only — see src/pages/about.js. */
export const rocketMark = (className = '') =>
  ROCKET.replace('<svg ', `<svg class="sn-rocket${className ? ` ${className}` : ''}" `);

/* ---------------------------------------------------------------------------
   STRUCTURED DATA
   The strategy asks this page to be the thing an answer engine quotes when
   asked "what is StartNet". That means: crawlable internal links, one
   consistently-worded description per brand, and a single Organization —
   the five doors are sections of this org, not sub-organizations, now that
   they live on one site rather than five external domains.
   ------------------------------------------------------------------------ */
const orgSchema = () =>
  JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: site.name,
    url: site.origin,
    description: site.narrative,
    slogan: site.tagline,
    logo: `${site.origin}/assets/brand/startnet-wordmark.svg`,
    email: site.email.general,
    areaServed: { '@type': 'AdministrativeArea', name: 'Tamil Nadu, India' },
    sameAs: site.social.map((s) => s.href),
    makesOffer: properties.map((p) => ({
      '@type': 'Offer',
      name: p.name,
      url: `${site.origin}${p.href}`,
      description: p.line,
    })),
  });

/* ---------------------------------------------------------------------------
   HEADER
   Sticky, condenses past 100px. About is the one nav item that carries a
   mega-menu — the five brands are direct top-level links instead, per the
   strategy's brand-led navigation (§5.2). The DOM id stays "mega-portfolio"
   internally; it is never shown, so renaming it is not worth the touch.
   ------------------------------------------------------------------------ */
const megaMenu = () => `
  <div class="mega" id="mega-portfolio" hidden>
    <div class="mega__inner shell">
      <div class="mega__intro">
        ${eyebrow('About')}
        <p class="mega__lede">${accent('Five doors. {One ecosystem}[.]')}</p>
        <a class="link-arrow" href="/about"><span>Read the full story</span>${iconArrow()}</a>
      </div>
      <div class="mega__groups">
        ${aboutMenu
          .map(
            (g) => `
          <div class="mega__group">
            <h3 class="mega__group-label">${esc(g.label)}</h3>
            <ul class="mega__list">
              ${g.items
                .map(
                  (item) => `
                <li>
                  <a class="mega__item" href="${esc(item.href)}">
                    <span class="mega__dot" aria-hidden="true"></span>
                    <span class="mega__text">
                      <span class="mega__name">${esc(item.name)}</span>
                      <span class="mega__kind">${esc(item.kind)}</span>
                    </span>
                    <span class="mega__badge" aria-hidden="true">${iconArrow()}</span>
                  </a>
                </li>`
                )
                .join('')}
            </ul>
          </div>`
          )
          .join('')}
      </div>
    </div>
  </div>`;

const header = (current = '/') => `
<a class="skip-link" href="#main">Skip to content</a>
<header class="header" data-header>
  <div class="header__bar">
    <div class="shell header__shell">
      <a class="header__brand" href="/" aria-label="StartNet — home">
        ${wordmark('header__wordmark')}
      </a>

      <nav class="header__nav" aria-label="Primary">
        <ul class="header__list">
          ${nav
            .map((n) =>
              n.mega
                ? `<li class="header__item header__item--mega" data-mega-root>
                     <button class="header__link" type="button"
                             aria-expanded="false" aria-controls="mega-portfolio" data-mega-trigger>
                       ${esc(n.label)}${iconChevron()}
                     </button>
                   </li>`
                : `<li class="header__item">
                     <a class="header__link${
                       current.startsWith(n.href) ? ' is-active' : ''
                     }" href="${esc(n.href)}"${
                     current.startsWith(n.href) ? ' aria-current="page"' : ''
                   }>${esc(n.label)}</a>
                   </li>`
            )
            .join('')}
        </ul>
      </nav>

      <div class="header__actions">
        ${button({ label: 'Join StartNet X', href: '/platform', variant: 'primary', size: 'sm' })}
        <button class="burger" type="button" aria-expanded="false" aria-controls="mobile-menu"
                aria-label="Open menu" data-burger>
          <span class="burger__box" aria-hidden="true">
            <span class="burger__line"></span>
            <span class="burger__line"></span>
          </span>
        </button>
      </div>
    </div>
  </div>
  ${megaMenu()}
  <span class="header__hairline" aria-hidden="true"></span>
</header>

<div class="mobile-menu" id="mobile-menu" data-mobile-menu hidden>
  <div class="mobile-menu__inner">
    ${nav
      .filter((n) => !n.mega)
      .map((n) => `<a class="mobile-menu__link" href="${esc(n.href)}">${esc(n.label)}</a>`)
      .join('')}
    <div class="mobile-menu__group">
      <button class="mobile-menu__acc" type="button" aria-expanded="false" data-acc-trigger>
        <span>About</span>${iconChevron()}
      </button>
      <div class="mobile-menu__panel" data-acc-panel hidden>
        ${aboutMenu
          .map(
            (g) => `
          <div class="mobile-menu__sub">
            <h3 class="mobile-menu__sub-label">${esc(g.label)}</h3>
            ${g.items
              .map(
                (item) => `
              <a class="mobile-menu__prop" href="${esc(item.href)}">
                <span class="mega__dot" aria-hidden="true"></span>
                <span class="mega__text">
                  <span class="mega__name">${esc(item.name)}</span>
                  <span class="mega__kind">${esc(item.kind)}</span>
                </span>
              </a>`
              )
              .join('')}
          </div>`
          )
          .join('')}
        <a class="mobile-menu__link mobile-menu__link--sub" href="/about">Read the full story</a>
      </div>
    </div>
    <a class="mobile-menu__link" href="/platform">Join StartNet X</a>
  </div>
</div>`;

/* ---------------------------------------------------------------------------
   FOOTER — the portfolio directory
   Strategy §3.2.7: the footer is the page's second, lower-commitment chance
   to route someone correctly. It repeats the canonical line verbatim.
   ------------------------------------------------------------------------ */
const footer = () => `
<footer class="footer" data-theme="dark">
  <div class="shell footer__shell">
    <div class="footer__top">
      <p class="footer__statement">${accent('One ecosystem. {Five doors}[.]')}</p>
      <div class="footer__brand">
        ${monogram('footer__monogram')}
        <p class="footer__narrative">${esc(site.narrative)}</p>
      </div>
    </div>

    <div class="footer__grid">
      <div class="footer__col footer__col--wide">
        <h2 class="footer__label">The five doors</h2>
        <ul class="footer__props">
          ${properties
            .map(
              (p) => `
            <li style="--prop:${p.swatch}">
              <a class="footer__prop" href="${esc(p.href)}">
                <span class="footer__prop-dot" aria-hidden="true"></span>
                <span class="footer__prop-name">${esc(p.name)}</span>
                <span class="footer__prop-line">${esc(p.line)}</span>
              </a>
            </li>`
            )
            .join('')}
        </ul>
      </div>

      <div class="footer__col">
        <h2 class="footer__label">Company</h2>
        <ul class="footer__links">
          <li><a href="/about">About</a></li>
          <li><a href="/partners">Partners</a></li>
          <li><a href="/careers">Careers</a></li>
          <li><a href="/design-system">Design system</a></li>
        </ul>
      </div>

      <div class="footer__col">
        <h2 class="footer__label">Get in touch</h2>
        <ul class="footer__links">
          <li><a href="/newsroom">Newsroom</a></li>
          <li><a href="/contact">Contact</a></li>
          <li><a href="mailto:${esc(site.email.press)}">${esc(site.email.press)}</a></li>
          <li><a href="mailto:${esc(site.email.partners)}">${esc(site.email.partners)}</a></li>
        </ul>
        <ul class="footer__links footer__links--social">
          ${site.social
            .map(
              (s) =>
                `<li><a href="${esc(s.href)}" target="_blank" rel="noopener">${esc(
                  s.label
                )}</a></li>`
            )
            .join('')}
        </ul>
      </div>
    </div>

    <div class="footer__base">
      <p>© ${site.year} ${esc(site.legalName)}. All rights reserved.</p>
      <ul class="footer__legal">
        <li><a href="/privacy">Privacy</a></li>
        <li><a href="/terms">Terms</a></li>
      </ul>
    </div>
  </div>
</footer>`;

/* ---------------------------------------------------------------------------
   DOCUMENT
   ------------------------------------------------------------------------ */
export const page = ({
  path = '/',
  title,
  description,
  bodyClass = '',
  main = '',
  schema = '',
}) => {
  const canonical = `${site.origin}${path === '/' ? '' : path}`;
  return `<!doctype html>
<html lang="en-IN">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<link rel="canonical" href="${esc(canonical)}">
<meta name="theme-color" content="#000000">

<meta property="og:type" content="website">
<meta property="og:site_name" content="StartNet">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${esc(canonical)}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(title)}">
<meta name="twitter:description" content="${esc(description)}">

<link rel="icon" href="/assets/brand/favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/assets/brand/favicon.svg">

<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Archivo:ital,wght@0,400..800;1,400..800&family=Instrument+Serif:ital@0;1&display=swap">

<link rel="stylesheet" href="/assets/css/tokens.css">
<link rel="stylesheet" href="/assets/css/base.css">
<link rel="stylesheet" href="/assets/css/components.css">
<link rel="stylesheet" href="/assets/css/sections.css">

<script type="application/ld+json">${orgSchema()}</script>
${schema ? `<script type="application/ld+json">${schema}</script>` : ''}
</head>
<body class="${esc(bodyClass)}">
${header(path)}
<main id="main" class="main">
${main}
</main>
${footer()}
<script type="module" src="/assets/js/main.js"></script>
</body>
</html>
`;
};
