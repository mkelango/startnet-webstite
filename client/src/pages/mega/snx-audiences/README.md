# snx-audiences: StartNet X "Built for" pages

These are the six audience pages for mega menu ⑥ StartNet X › Built for (Book 1 Part B §2.2, §3.2). They use template T11 and render inside `BrandLayout brand="x"`.

| Route | File | Phase | Primary CTA |
|---|---|---|---|
| `/startnet-x/founders` | Founders.jsx | P1 | Create your free profile → `snxLink('/signup', { src: 'snx-founders', brand: 'x', lang })` |
| `/startnet-x/institutions` | Institutions.jsx | P2 | Book a demo (Book 2 §7.2) → `/partner/enquire?topic=snx&type=institution&audience=institutions&brand=x&ref=snx-institutions` |
| `/startnet-x/incubators` | Incubators.jsx | P2 | Request a demo (type=incubator) |
| `/startnet-x/gccs` | Gccs.jsx | P2 | Book a demo (type=gcc), per Book 2 §7.2 |
| `/startnet-x/government` | Government.jsx | P2 | Request a briefing (type=government), per Book 2 §7.2 |
| `/startnet-x/investors` | Investors.jsx | P2 | Request a demo (type=investor) |

- `SnxAudiencePage.jsx` and `.css` hold the shared template. The page order is: breadcrumbs (Home › StartNet X › For …), BrandHero, then problems (orgs) or the ladder card (founders), what SNX gives you, modules, how it works (Steps), pricing hint (`<Stat>` tag C), proof (the page's only Night band), FAQ (Accordion with FAQPage JSON-LD) and the other-audiences switcher. Founders end on a CTABand plus WhatsApp. Organisations end on an inline `SmartForm type="enquiry"` panel with hidden `partnerType`, `topic=snx`, `audience`, `brand=x` and `ref`.
- `audienceContent.js` is the content map. Every string is an `[en, ta]` pair.

## Content sources
- Book 2 §7.2 supplies the SEO title, meta, H1, sub-head and three blocks, used verbatim, for founders, institutions, GCCs and government. Book 2 §7.3 supplies prices, tier contents, plan microcopy and the FAQ.
- Book 2 has no §7.2 row for incubators or investors. Their copy comes from the §7.3 organisation tiers and Book 1 Part A §4.2. The investor lede uses the §4.2 proposition verbatim.
- Book 1 Part A §3.1 and §3.2 supply the needs, the "proof needed" lists and the objections answered in the FAQs. Book 1 Part B §9.4 and Part A §7.3 supply the founder sign-up steps. Book 2 §2.6 supplies the trust and data answers.
- No data is fetched. Everything is static, so there are no `/api` calls.
- The Tamil copy is my own draft written in the §14 register. Like all of §14, it needs native review.

## Placeholders
- Module status shows `[status — to be confirmed]` (Book 2 Appendix A #11).
- Signed institutions, incubators and GCCs, and the "Institutions using StartNet X" slot, show `[placeholder — signed tenants only]`.
- Government co-host history and the enquiry reply-time promise show `[placeholder — to be supplied by StartNet]`.
- The investor page's ThinkTN related-party item shows `[placeholder — link to disclosure statement]` (Book 2 ThinkTN page, Section 3).
- Organisation licence prices render in lakh as Book 2 §7.3 prints them (₹3 L / year); price figures do not count up.
- All prices are tag C, indicative and ex-GST until the published rate card replaces them (Appendix A #10).

## Integration notes
- Add these routes as children of the existing `<Route path="startnet-x" element={<BrandLayout brand="x" />}>` (for example `path="founders"`). None of them are param routes.
- Update the nav.js links in the StartNet X › Built for column only:
  - The "Founders & learners (free)" link `/startnet-x` becomes `/startnet-x/founders`.
  - Institutions, Incubators & TBIs, GCCs & corporates, Government & districts and Investors change from `/partner/<x>` to `/startnet-x/<x>`.
  - The Partner with us menu keeps its `/partner/<x>` links. Each SNX page cross-links to its `/partner/<x>` page.
- Optionally add "For founders" to `BRANDS.x.subNav`. Module cards deep-link to `/startnet-x/modules#<moduleId>` (the section ids the Modules page's own in-page nav uses). The overview Tabs could also link to these pages.
- The `/partner/enquire` page already reads `?type` and `?topic`. `audience` is attribution only and the form ignores it.
- The server's sitemap and status lists need the 6 new URLs: founders as P1, the rest as P2.
