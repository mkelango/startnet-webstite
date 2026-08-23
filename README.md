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

## Build & deploy (static export to HostingRaja)

This site builds to a fully static `out/` folder — no Node server required at
runtime, which matches typical shared/cPanel hosting like HostingRaja.

```bash
npm run build        # produces ./out
npm run serve:static  # sanity-check the export locally at http://localhost:3200
```

To deploy:

1. Run `npm run build`.
2. Upload the **contents** of `out/` (not the folder itself) to `public_html/`
   (or the domain's document root) via HostingRaja's File Manager or FTP.
3. Confirm `startnet.in`'s DNS/nameservers point at the HostingRaja hosting
   account the files were uploaded to.

Re-run steps 1–2 on every content or design update.
