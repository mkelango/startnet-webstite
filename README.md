# StartNet — Masterbrand Website

The masterbrand landing site for StartNet — the operating infrastructure behind
Tamil Nadu's AI-driven startup ecosystem (AI Flywheel, Nooru.AI, Agentic AI
Connect, Physical AI Connect, and SNX).

## Stack

Next.js (App Router, static export) · React 19 · TypeScript · Tailwind CSS v4 ·
GSAP + Lenis for scroll motion · Motion for UI interactions.

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Content

All copy and portfolio data live in typed files under `lib/content/*.ts` — edit
those rather than the JSX. `lib/content/portfolio.ts` is the single source of
truth for each property's name, one-line description, and accent color; it's
reused across the header dropdown, homepage grid, footer, and portfolio page.

Numbers in the homepage proof section (`lib/content/home.ts`) render as
"Pending verification" until their `verified` flag is flipped to `true` with a
real, sourced number — never replace a pending stat with a guessed figure.

## Build & deploy (GitHub Pages, custom domain)

This site builds to a fully static `out/` folder and deploys automatically via
[`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) on every push to
`main` — GitHub Pages serves it directly, no server required.

```bash
npm run build        # produces ./out
npm run serve:static  # sanity-check the export locally at http://localhost:3200
```

`public/CNAME` (containing `startnet.in`) and `public/.nojekyll` are copied
into every build — the CNAME keeps the custom domain pinned even if Pages
settings are ever reset, and `.nojekyll` stops GitHub Pages from ignoring the
`_next/` asset folder.

One-time repo setup (Settings → Pages): set **Build and deployment → Source**
to **GitHub Actions**, and **Custom domain** to `startnet.in`.

DNS (managed at HostingRaja, since that's where `startnet.in`'s nameservers
point) — leave all existing mail (MX/TXT/DKIM) records untouched, only change
the web-serving records:

| Type  | Host | Value |
|-------|------|-------|
| A     | `startnet.in` | `185.199.108.153` |
| A     | `startnet.in` | `185.199.109.153` |
| A     | `startnet.in` | `185.199.110.153` |
| A     | `startnet.in` | `185.199.111.153` |
| CNAME | `www.startnet.in` | `mkelango.github.io` |

Re-run `npm run build` locally only to preview — the live site rebuilds
automatically from the GitHub Actions workflow on every push to `main`.
