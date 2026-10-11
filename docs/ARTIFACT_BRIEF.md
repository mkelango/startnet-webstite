# Brand artifacts brief — StartNet Research · Vibe · Connect · Women

Each brand gets a **standalone single-file HTML microsite** at `D:\Startet 2.0\artifacts\<brand>.html` (research.html, vibe.html, connect.html, women.html). It is published as a claude.ai Artifact, so it must follow the hosting contract below exactly. It presents that brand "under StartNet": masterbrand strip on top ("StartNet." with red full stop → startnet.in), brand lock-up "StartNet. <Brand>", brand accent, and all of the brand's sub-pages as in-page sections reachable from a sticky brand sub-nav.

## Content (use the books' copy, verbatim where it exists)
- Book 2 §3 (Our brands) has each brand's landing page and sub-pages copy. Grep for the brand's section and every sub-page listed in Book 1 Part B §4 (sub-nav links and CTA). Also use the persona/proof rows for that brand in Book 1 Part A §3, Tamil copy in Book 2 §14 where it exists (offer an EN | தமிழ் toggle for strings you have Tamil for).
- Books are at `C:\Users\rhaml\Downloads\StartNet_Website_Book{1..4}_*.md` (use grep / line ranges — they are long).
- Numbers: only figures stated in the books, each with its A/B/C tag + as-at/source in a tag popover. Unknowns are shown as a visible amber placeholder chip "[placeholder — to be supplied by StartNet]". Never invent people, partners, outcomes.
- Every CTA deep-links to `https://x.startnet.in/...?src=artifact-<brand>&brand=<brand>` or `https://startnet.in/<brand>/...`. Forms (e.g. "Register interest", "Join a Circle") are page UI only: validate, `preventDefault()`, show an in-page success state ("You're in." with the full stop landing). Never claim a message was sent anywhere.

## Design (Book 3 + Book 4 apply — the user's design system wins over generic artifact taste)
- Ink #0E0E10, StartNet Red #E5322D (full stop + display only; buttons red-600 #D32523), Paper #F6F5F2, brand accent + its scale from Book 3 §9.2:
  Research #4A3AA7 (-700 #5641C5, -400 #9894FF, -50 #F4F5FF) white text on fill ·
  Vibe #E2581F (-700 #9F3605, -400 #F37C52, -50 #FFF3EF) **Ink** text on fill ·
  Connect #0E8F63 (-700 #006F4B, -400 #5DB88F, -50 #EFF9F3) **Ink** text on fill ·
  Women #C2386F (-700 #A12659, -400 #F0749E, -50 #FFF2F5) white text on fill.
- Night surface tokens (Book 3 §9.3) for the dark theme and for one "evidence" night band.
- Type: Inter (Google Fonts, weights 400–800) + Noto Sans Tamil + Anek Tamil for Tamil headings. Fluid type scale from Book 3 §4.3.
- Motion tokens from Book 4 R4 §4 (durations, easings incl. `--ease-dot` overshoot only for the red full stop). Signature interactions from Book 4 R4 §5 / Part B and the Informa teardown (Appendix R1): kinetic headline word reveal, full-stop landing, count-up stats, accent sweep on entry, hover lift + duotone→colour cards, sticky sub-nav with scroll-spy, horizontal scroller with buttons, accordions, tabs, a ladder L1–L7 explorer. **Each brand must have one distinctive signature interaction** (suggestions: Research — interactive term-sheet split / lab pipeline; Vibe — Vibathon countdown + tracks explorer + season timeline, louder campaign energy on a night hero; Connect — sector series grid with filter + Founder Switch go/no-go stepper + network graph of dots and lines; Women — Circle finder by district + scheme guide calculator/explorer (TANSEED women-led ₹15 L, Vetri Magalir) + story carousel).
- Imagery: no photos. Draw generative brand art with inline SVG/canvas built on the pulli dot grid → network lines → red full stop concept (Book 3 §1, §7). No traditional kolam wallpaper, no religious motifs.
- Respect `prefers-reduced-motion` (and include a small "Reduce motion" toggle in the footer). Content must be fully visible at rest — animations start from a visible state or are progressive enhancements; never leave text at opacity 0 waiting for an observer.

## Hosting contract (CSP-enforced — violations silently break the page)
- **Do NOT write `<!doctype>`, `<html>`, `<head>` or `<body>` tags.** The file is wrapped automatically. Start the file with `<title>StartNet Research</title>` (resp. Vibe/Connect/Women), then `<link>` to Google Fonts, then `<style>`, then markup, then `<script>`.
- External **stylesheets only from fonts.googleapis.com**; external **scripts only from https://cdnjs.cloudflare.com** (pin exact versions, UMD builds, e.g. `https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js` and `.../ScrollTrigger.min.js`), placed before the inline script that uses them. Vanilla JS is preferred; GSAP optional. No other hosts: no images/fetch/iframes/embeds from anywhere. No `window.print`, `alert`, `confirm`, `prompt`. No `<a download>`. `mailto:`/`tel:` shown as selectable text.
- **Theme-aware tokens**: every colour as a CSS custom property defined first on bare `:root` (light values), redefined in `@media (prefers-color-scheme: dark) { :root:not([data-theme="light"]) { … color-scheme: dark } }` and again in `:root[data-theme="dark"] { … color-scheme: dark }`. `body` sets `background: var(--bg); color: var(--fg)`. No literal colours in component rules.
- Keep the skeleton's `:root` padding (don't reset `:root` padding). Sticky header uses `top: env(safe-area-inset-top, 0px)`.
- Responsive down to 360px: 16px side gutter via `padding-inline` on one outer wrapper, no horizontal page scroll, grids collapse to one column, `min-width: 0` on flex/grid text children, tables in `overflow-x:auto` wrappers. 44px touch targets. Visible focus rings. Only `#plain-anchor` hash links.
- localStorage only for the reduce-motion/lang preference, wrapped in try/catch.
- Size well under 1 MB. Close every tag, double-quote attributes, give every form control a stable `id`.
