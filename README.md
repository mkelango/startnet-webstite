# startnet.in — masterbrand site

The parent site for the StartNet portfolio: AI Flywheel, Nooru.AI, Agentic AI
Connect, Physical AI Connect and SNX.

Its entire job is to help a stranger understand the portfolio in fifteen seconds
and choose the right door in thirty.

---

## Run it

```bash
node startnet/server.mjs
```

Then open <http://localhost:4321>. Zero dependencies — Node 18+ only.

## Build it

```bash
node startnet/build.mjs
```

Renders every page to static HTML in `startnet/`, plus `sitemap.xml`,
`robots.txt` and `portfolio.json`. Run it after any change to `src/`.

Deploy the `startnet/` directory to any static host.

---

## Layout

```
startnet/
├── build.mjs              generates the HTML
├── server.mjs             zero-dependency preview server
├── src/
│   ├── data/site.js       ← ALL content lives here
│   ├── lib/ui.js          component markup
│   ├── lib/layout.js      document shell, header, footer
│   └── pages/*.js         one module per page
├── assets/
│   ├── css/tokens.css     design tokens — the single source of truth
│   ├── css/base.css       reset, typography, grid, reveal
│   ├── css/components.css component styles
│   ├── css/sections.css   page-level compositions
│   ├── js/dot-system.js   the ring engine — the identity
│   ├── js/orbit.js        the five-door selector
│   ├── js/telemetry.js    outbound click tracking
│   └── brand/*.svg        wordmark, monogram, dot, favicon
├── docs/design-system.md  the written system
└── *.html                 generated — do not edit by hand
```

**Everything editorial is in `src/data/site.js`.** Property descriptions, proof
metrics, news, jobs, event dates, partner tracks. Change it there and it changes
everywhere it appears, including `portfolio.json`.

The generated `*.html` files are build output. Editing them directly will be
overwritten on the next build.

---

## Brand assets

Vectorised directly from the master logo artwork, so the geometry is the real
wordmark rather than a re-set in a lookalike typeface.

| File | Use |
|---|---|
| `assets/brand/startnet-wordmark.svg` | primary lockup; type is `currentColor`, dot is fixed `#CC3029` |
| `assets/brand/startnet-wordmark-animated.svg` | same, split per glyph for animation |
| `assets/brand/startnet-monogram.svg` | round `SN.` mark for avatars and small square lockups |
| `assets/brand/favicon.svg` | squared monogram |
| `assets/brand/startnet-dot.svg` | the dot alone |

Brand colours: **Ink `#000000`**, **Signal `#CC3029`**. Both sampled from the
master artwork.

---

## Before launch

Placeholders that need real values before this goes live:

- [ ] **Proof figures** in `site.js → proof.metrics`. Each row carries a
      `source` and a `verified` flag; unverified rows are not rendered, so
      replace the numbers rather than removing the guard.
- [ ] **Leadership names and bios** on `/about` — currently withheld by design.
- [ ] **Event details** in `site.js → nextEvent` (date, city, theme, links).
      The homepage module expands automatically inside `windowDays` of the date.
- [ ] **Email addresses** in `site.js → site.email` — confirm each mailbox exists.
- [ ] **Social URLs** in `site.js → site.social`.
- [ ] **Contact form endpoint.** `assets/js/form.js` currently hands off to
      `mailto:` so nothing is silently lost. Swap in a `POST` when the endpoint
      exists; no other file needs to change.
- [ ] **Analytics.** `assets/js/telemetry.js` pushes to `window.dataLayer` and
      calls `gtag` if present, but bundles no vendor script and sets no cookie.
      Add your tag and the events arrive.
- [ ] **`/privacy` and `/terms`** are linked from the footer but not yet built.

---

## Design system

See [`docs/design-system.md`](docs/design-system.md) for the written system, and
`/design-system` in the running site for live specimens rendered from the same
tokens and components as every other page.
