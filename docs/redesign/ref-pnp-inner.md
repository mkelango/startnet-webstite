# Plug and Play inner pages: templates and tokens

Reference study for the StartNet redesign. Source: plugandplaytechcenter.com, fetched 2026-11-05 with curl, no browser.

## How this was measured (read first)

- plugandplaytechcenter.com is an Angular SPA (`<pnp-site-root>`), with no server-side rendering. The HTML is an empty shell. Content comes from a headless Magnolia CMS:
  - Page JSON: `https://public.dxp.playbook.vc/.rest/delivery/pages/v1/plug-and-play/<path>`
  - Nav tree: `https://public.dxp.playbook.vc/.rest/delivery/navigation/plug-and-play`
- Every page is a **flat stack of CMS components** (`site-lm:components/*`). Each one is rendered by an Angular component (`pnp-*`) that uses Tailwind classes. The section orders below come from the CMS JSON. The sizes come from the Tailwind class lists compiled into `main-AGDSNPIM.js`, plus `styles-NRA6D7TF.css`.
- **Root font size is 18px** (`html{font-size:18px}`), so every Tailwind rem utility is 1.125x the stock Tailwind value. Example: `px-4` = 1rem = **18px**, `py-14` = **63px**, `gap-24` = **108px**. Below, rem utilities are written as `class (= computed px)`. Arbitrary values such as `h-[644px]` and `text-[48px]` are real px.
- There are **no breadcrumbs anywhere** (0 occurrences in the bundle). Wayfinding comes from three things: the mega-menu, a small uppercase eyebrow label above each H1, and anchor sub-nav on location pages.

---

## Page templates

### Global chrome (shared by every inner page)

**Header (`pnp-navigation`)**
- Floating bar, not full-bleed. The wrapper is `fixed top-0 left-0 right-0 px-3 pt-3 z-20` (13.5px inset).
- The bar is `bg-white h-20 (=90px) rounded-lg (=9px) px-4 (=18px)`, with flex space-between. It sits over the hero image, which is why most heroes carry `pt-20`/`pt-[102px]` top padding.
- Menu triggers are 14px / 500 / line-height 14px, colour #070E34, with `border-b-2 border-transparent` (underline on hover/open). Below 1336px the labels wrap (`max-width:100px`).
- Right side holds a 40x40 icon button (`pnp-primary-button !w-10 !h-10`, violet, 8px radius) plus the Sign up and Contact CTAs.
- Mega-menu panel: `absolute top-[105px]`, white, `rounded-lg shadow`, `p-10 (=45px)`. There are 3 menu types in the CMS:
  - `complex` (Innovation Services): a left column `w-[300px] p-10` with an eyebrow (`text-xs uppercase tracking-wider text-gray-400`, 13.5px) and top-level links (16px/600). The right panel is grey (#F5F5F7, `p-10 rounded-r-lg`) with sub-link columns (`text-sm font-medium`, 15.75px). Column labels: "Innovate" / "What We Do".
  - `simple` (Venture Capital, Insights, About Us): a single list, `space-y-4`.
  - `category` (Vertical Industries): 27 industry links in a grid, plus an "All Vertical Industries" header link.
- Primary nav order: Innovation Services, Venture Capital, Vertical Industries, Insights. Secondary nav: About Us, Locations, Events, Co-working, Success Stories.

**Pre-footer stack.** The same 2 blocks close almost every page, in this order:
1. `bannerLocation` (`pnp-banner-location`):
   - Full-bleed photo, `h-[464px]`, with an overlay of #050C27 at 30%.
   - Content is a 2-col grid `lg:grid-cols-2 gap-8 md:gap-24 (=108px)` on the 1280 container.
   - Copy, in order: an eyebrow `label-sm` (12px/600 uppercase, white) "PLUG AND PLAY AROUND THE WORLD", an H2 `title-sm-semibold` (40px/600/44px, -0.01em, white), a `main-sm` line (14px/600/21px, `max-w-xl` = 648px), then a white text link "VIEW ALL ->" (`pnp-white-link`, 16px/600 uppercase).
2. `newsletterSubcriptionCTA` (`pnp-newsletter`):
   - `py-16 (=72px)`, background #18203F (navy) with a cover image.
   - 2-col grid `md:grid-cols-2 items-center gap-8 md:gap-24`. Left: eyebrow `subtitle-md` (16px/700/24px), then H3 `title-xs` (32px/600/45px, nowrap on md+). Right: the HubSpot email form, with the input at 320x56, a 1px violet border and 8px radius, plus a 150x56 submit button. Under it: "DISCOVER OUR INDUSTRY NEWSLETTERS ->" (underline on hover).

**Footer (`pnp-footer`)**
- White, with a decorative background image anchored at the bottom (`background-size:100% 50%`). `py-10 (=45px)`, 1280 container.
- Left: `title-xxs-regular` "Ready to start innovating your organization?" (24px/400/29px, #070E34), then `title-xxs` "Contact us ->" in violet (24px/600). Social icons sit `mt-10`, `gap-2`.
- Right: link columns DISCOVER / CONNECT / ABOUT US / COMPLIANCE / JOIN. Headings are `label-md` (16px/600/24px uppercase), links are 14px.
- Copyright is `text-sm-light` (14px/400/21px, #202A54).
- Mobile: `grid-cols-2 gap-6 mb-10`.

**Mid-page CTA band (`bannerButtonsComponent` -> `pnp-banner`).** This is the single most reused block. It appears 1 to 4 times per page.
- `py-8 lg:py-16 (=36/72px)`, 1280 container, grid `lg:grid-cols-2 items-end gap-8 lg:gap-24`.
- Left column: eyebrow `label-md` (16px/600 uppercase), title `title-sm-semibold` (40px/600/44px), optional subtitle `text-[20px] font-bold`.
- Right column: a stack of 1-2 buttons, `w-72 (=324px)` wide, 56px tall.
- Background variants (CMS `bannerBackgroundColor`):
  - `purple` = #5748F5 solid
  - `dark` = #070E34
  - `white` = #FFF
  - `darkLines` = #070E34 plus a line-art PNG at `60% 20%`
  - `purpleLines` = #5748F5 plus the same line art
- Copy pattern: eyebrow = page topic ("Fintech Innovation Programs"), title = "Ready to start your innovation journey?", button = "Contact Us ->".

**Floating side CTA (`sidebarModalPopupCTAComponent`, event pages)**
- A `max-w-[22rem] (=396px)` white card, `p-10`, with a `label-md` title and two stacked full-width buttons.
- The first button is violet (`py-5 px-8 rounded-t-lg`). The second is white with a violet border (`rounded-b-lg`). Together they read as one split pill.

---

### Template A: Vertical / industry page (`/industries/fintech`)

Section order (CMS):
1. `headerIndustryPrimary` (hero)
2. `halfText`: "Uncover Opportunities in the Fintech Industry"
3. `partnerCarousel`: "Our Fintech Innovation Partners" + "View all ->"
4. `unorderedList`: "Our Focus Areas" (7 accordion items)
5. `statsCards` (type `mid`): "Our Fintech ecosystem, by the numbers" (5 stats: 70+, 1,750+, 2,000+, 150+, 9)
6. `cardsInformative`: "The forefront of Finance" (3 cards)
7. `videoCarousel`: "The latest updates from our Fintech ecosystem" (5 YouTube cards)
8. `cards` (design `grey`): "Our Global Fintech Platform" (14 location image cards, "Discover ->")
9. `bannerButtonsComponent` (purple): "Ready to start your innovation journey?"
10. `cards` (design `transparent`): "Fintech Programs" (4 program cards)
11. `bannerInsightUp` + `insightsRelated`: "Our Latest Insights"
12. `relatedSuccessStories`: "Real Success Stories"
13. `quoteModule` (background image)
14. `bannerLocation`
15. `newsletterSubcriptionCTA`
16. footer

**Industry hero (`pnp-header-industry-primary`)**
- Full-bleed cover photo, `h-[500px] md:h-[644px]`, overlay #050C27 at 30%.
- Grid `md:grid-cols-2 items-center md:gap-24`. The left column is `flex-col gap-12 (=54px)`:
  - eyebrow `label-sm` uppercase white
  - H1 `text-[48px] leading-[3rem] (=54px) font-semibold` white, "Innovation in FinTECH"
  - an optional featured-insight card on the right, desktop only (`md:flex hidden`)
- **Featured insight card (`pnp-insight-preview-card`)**: `w-[500px]` dark (#070E34), `rounded-2xl (=18px)`, `h-56 (=252px)`. Text on the left (tag chips: `label-sm`, 1px white border, `rounded p-1`). Image on the right, `h-56 w-52`, `rounded-2xl`.

**halfText (`pnp-half-text`)**
- Dark band (#070E34), grid `md:grid-cols-2 py-12 (=54px) gap-4 md:gap-24`.
- Left: H2 `title-sm-semibold` white. Right: lead `pnp-text-lg-reg` (20px/600/24px), then body `main-lg-text-normal` (16px/400/24px) with `space-y-4`.

**Focus-areas accordion (`pnp-unordered-list`)**
- `bg-white py-8 md:py-14`.
- Left: eyebrow `label-sm`, then title `title-sm-semibold`, with `gap-[7.5rem] (=135px)` between them.
- Right (`lg:col-span-8 xl:col-span-7 xl:col-start-6`): stacked `<details>` items, `px-4 md:px-8 py-5`, `rounded-t-2xl`.
- Each item overlaps the previous one by 15px (`top:-15px`, `-30px`, ... per pair). This gives a "file-folder tabs" stack, with item backgrounds alternating white and #E4E9F5.
- Summary text is `title-xxs leading-7` (24px/600/31.5px) #202A54, and turns violet when open. The body is `pt-6 pb-20` prose, with an optional image (`rounded-lg max-w-[500px] h-[350px]`).

**Stats (`pnp-stat-card`).** 3 variants:
- `withoutBackground`:
  - Heading right-aligned (`title-sm-semibold md:text-right max-w-md`).
  - Row of stats `flex-wrap justify-between gap-12 md:py-[3.25rem] (=58.5px)`.
  - Number `title-xl-extrabold` (96px/700/96px) on desktop, `title-lg` (56px/600) on mobile.
  - 1px grey divider (#788098), then label `title-xxs` (24px/600).
- `mid`: `grid grid-cols-5 gap-[5.25rem] (=94.5px) py-[3.25rem]`. Number `title-lg-extrabold` (56px/800/56px), label `title-xxs`.
- `white`: items `md:w-80 (=360px)`, label in inactive grey #788098.
- Numbers can use gradient text: `pnp-gradient-blue-text` (45deg #5547F5 -> #5AA3F8) or `pnp-gradient-primary-text` (#8077F0 -> #5547F5).

**Informative cards (`pnp-informative-card`)**
- `py-8 md:py-16`. Header row: `max-w-lg (=576px) text-[40px] leading-10 (=45px) font-semibold`, with an optional link on the right.
- Grid `md:grid-cols-2 lg:grid-cols-3 gap-4 (=18px) py-6`.
- Card: `bg-white rounded-[2rem] (=36px) px-8 py-8 (=36px) min-h-[150px] md:max-w-[24.5rem] (=441px)`. Optional icon on top (`mb-4`), then title `title-xxs` (24px/600), then body `text-md-light` (18px/400/26px) in #A5AABA. Inner gap is `gap-8`.

**Image tile carousel (`pnp-cards`, used for locations/programs)**
- `py-8 md:py-14`. Header: H2 `text-[42px] leading-9 font-semibold max-w-sm`, with prev/next arrows on the right (`w-10 h-10 rounded-full border`, hover white). The "View all" link is mobile-only, placed below.
- Swiper: 3 per view at >=1280 (22px gap), 2 at >=768 (20px gap), 1 below.
- Tile: `h-[500px] rounded-2xl md:rounded-[2rem]`, full photo, gradient `from-[#111832]` to transparent at 50% opacity.
- Title `title-xs` (32px/600) is centred. **On hover the title grows to 56px/76px**, the image scales 1.05 (`transition-transform` 300ms ease-in-out), and a "Discover ->" white link appears at `bottom-10`.
- `cardsDesign` variants: `grey`, `transparent`, `white`. Each swaps the section background and the tile/text colour pairs (dark/white, #202A54/#F5F5F7, #070E34/#EDECFC).

**Partner logo carousel (`pnp-partner-carousel`)**
- `bg-white py-8 md:pt-14`. Title `title-xs` (32px).
- Logo tile: `h-44 (=198px)`, #F5F5F7, `rounded-lg`, `py-9 px-5`, with the name under it (`text-secondary-md` 16px/600 uppercase).
- The last tile is a "View all" tile with a 1px violet border. Autoplay is on.

**Video carousel (`pnp-video-carousel`).** Same header as the logo carousel. Each slide is `w-[400px]`: a YouTube thumbnail, then title and description.

**Related success stories (`pnp-related-success-stories`)**
- `py-8 md:py-14`. Eyebrow `subtitle-md` "How we help our fintech partners innovate", then H2 `text-[40px] leading-10 max-w-md` "Real Success Stories". Link "VIEW ALL" on the right. Header block `mb-8 md:mb-20 (=90px)`.
- Grid `md:grid-cols-2 lg:grid-cols-3 gap-5 (=22.5px)`.
- Card: dark (#070E34), `rounded-lg max-w-[24rem] (=432px) h-[27.5rem] (=495px)`.
  - Top image `h-56 (=252px)`, with a #111832 gradient at 80%.
  - Tag chips: white `label-sm rounded p-1`.
  - Title `title-xxs` white, underline on hover.
  - Excerpt `text-md-light` (`line-clamp-4`).
  - Footer: date/source in `card-label` + `label-sm` at 50% opacity.

**Quote (`pnp-quote`)**
- Grid `md:grid-cols-2 md:gap-24 min-h-[620px]` (880px on mobile).
- Quote text `md:leading-[3rem]` semibold, with the highlight span in #A59EF4.
- Author row: 48px round avatar, then name and position.
- The image bleeds off the right edge (`absolute -right-4`), `max-h-[620px]`.

---

### Template B: Audience / program landing (`/innovation-services/startups`, `/corporations`)

Order for **For Startups**:
1. `headerPrimaryLinks` (hero with 2-3 buttons)
2. `titleTextTwoColumns`: "Building an Elite Ecosystem of Startups"
3. `findYourFitComponent`: "How We Help Startups" (4 service cards)
4. `statsCards` (withoutBackground): 40+ unicorns, 2,500+ portfolio...
5. `halfImage` (design2): "For companies big or small"
6. `richText` (grey-light): "How we help Startups Grow"
7. `bannerButtonsComponent` (purple): "Apply Now ->"
8. `startupCarousel`: "Our Unicorns"
9. `videoCarousel`: "Hear from the startups we've invested in"
10. `bannerLocation`
11. newsletter
12. footer

**For Corporations** uses the same skeleton, reordered:
1. hero
2. `halfImage`: "An Essential Guide to Corporate Innovation"
3. `partnerCarousel` (logo wall, about 40 logos)
4. `titleTextTwoColumns`
5. `statsCards`
6. `findYourFit`: "Our Expertise"
7. `richText`
8. `insightsRelated`: "Our Latest Case Studies"
9. `relatedSuccessStories`
10. `bannerButtons` (`darkLines`)
11. bannerLocation
12. newsletter

**Hero with buttons (`pnp-primary-links`)**
- Full-bleed cover image, `h-[600px] md:h-[500px]`.
- Content `flex-col justify-center gap-6 pt-20 md:pt-16`. Text block `max-w-2xl (=756px) gap-8`. Button row `md:flex-row gap-4 md:gap-2 mt-8`.
- CMS fields: title, description, then up to 3 buttons, each with its own colour (`white` / `transparent`). Example: "Get in touch".

**Two-column statement (`titleTextTwoColumns`)**
- Light grey band (#F5F5F7), `py-8 md:py-14`, grid `md:grid-cols-2 gap-24 (=108px)`.
- Left: H2 `title-sm-semibold` (40px). Right: body `pnp-text-lg` (20px/400/30px), `gap-8`.

**Service cards (`pnp-find-your-fit`)**
- `py-8 md:py-14`. H2 `text-[40px] leading-[2.5rem] mb-12 (=54px)`. Grid `md:grid-cols-2 gap-4`.
- Each card is `max-h-[23rem]`, `flex-col gap-4 md:gap-9`, and stacks:
  - a chip eyebrow (`label-sm` violet text on #F5F5F7, `rounded p-1`), e.g. "BOOST GROWTH"
  - title `text-[32px] leading-9 font-semibold line-clamp-3 h-[82px]`, underline on hover, e.g. "Investment Opportunities"
  - description `label-md-light line-clamp-2 min-h-[54px]`
  - an arrow icon bottom-right, which swaps to a hover icon (`group-hover:hidden` / `hidden group-hover:block`)

**Half image (`halfImage`, designs `desing1` / `desing2`)**
- Grid `md:grid-cols-2 gap-24 py-12`.
- Text side: `flex-col justify-center gap-12`, eyebrow `label-md`, H2 `title-sm-semibold line-clamp-4`, body `space-y-4 pt-4`, button `pnp-primary-button px-6 py-4`.
- Image `rounded-lg object-cover`, with a separate mobile image. design1 and design2 swap the image side.

**Startup unicorn carousel (`pnp-startup-swipper-card`)**
- Dark card `rounded-lg h-60 (=270px) p-2`. Industry chips on top (`label-sm` on #E4E9F5).
- White logo plate `h-[72px] rounded` with the logo `object-contain`, then a 3-line description `text-sm-light` in white.

---

### Template C: Listing page (events `/all-events`, insights `/insights/all-insights`, programs `/our-programs`, locations, team)

**Events listing.** Order:
1. `imageComponent` (full)
2. `eventsSearchList`
3. `unorderedList`: "FAQs about Plug and Play Events"
4. `bannerButtonsComponent` (dark)
5. bannerLocation
6. newsletter

`pnp-event-list-search`, in order:
1. **Hero**: `h-[450px]` cover image, centred `gap-6`. H1 `text-[48px] leading-[3rem]` white, then sub `title-xxs` (24px) white, `max-w-xl`.
2. **Big tabs**: "Upcoming" / "Past", full-width strip on #F5F5F7, `pt-12`.
   - Tab: `width:260px; padding:32px 56px; font:24px/600/120%`, colour #788098, `border:1px solid #DFE1EB`, `border-radius:8px 8px 0 0`.
   - Active/hover tab: white background, #202A54 text, white border. It merges into the white content area below like a folder tab.
   - Below 1024px: full-width tabs, `padding:24px 8px`, no radius.
3. **Filter bar**: `py-10 (=45px)`, centred `flex-wrap gap-2`. In order:
   - search input "Search event..." (`md:w-60 (=270px)`, white, `border-gray-300`, `rounded-lg`, `py-3.5 pl-8 pr-5`, 16px, violet focus ring/border, search icon at `ps-3`)
   - Time select (upcoming / past)
   - "All industries" select
   - "All locations" select. Each select is `md:w-60 py-3.5 px-5 rounded-lg` at 16px/600.
   - "Clear" text button (`main-sm-light` violet)
4. **Results grid**: `grid md:grid-cols-2 lg:grid-cols-3 gap-4`, with `pnp-event-card` items.
5. **Empty state**: `#F5F5F7 p-8 rounded-lg`, title `title-xxs`, then a `text-md` line.
6. **Pagination (`pnp-site-pagination`)**: `pt-20 (=90px)`. "PREVIOUS" / "NEXT" in `main-lg-text` uppercase grey, violet on hover. Page numbers are `h-12 w-12 (=54px) rounded-full border-2`, violet text, 16px.

**Event card (`pnp-event-card`)**
- Full image card, `rounded-lg`, image scales 1.05 on hover (300ms ease-in-out). Colour overlay at 80%.
- Content `p-4 md:px-5 md:py-9`, `gap-4`:
  - title `title-xxs line-clamp-2 h-[60px]`, underline on hover
  - meta block `h-[60px]`: date `label-md`, location with a pin icon
  - a live dot (`h-1.5 w-1.5 rounded-full bg-green-500 shadow-green-700`) for open registration
  - CTA `pnp-secondary-button` (white, violet text, 48px) "REGISTER" / "LEARN MORE"
- The `pnp-event-cards-list` header row is `mb-8 md:mb-16`, with H2 `max-w-lg` and "View all" link. The grid has `gap-5`.

**Insights listing.** Order:
1. `headerPrimaryLinks`
2. `halfImage` (featured report: "2025 Company Performance Report", with download button)
3. `insightList`
4. `bannerButtons` (purple)
5. footer

`pnp-insight-list`:
- Filter band on #E4E9F5, `py-8`: search input `md:w-70`, "All Industries" select, "All Types" select, "Clear filters".
- Grid `md:grid-cols-2 lg:grid-cols-3 gap-y-10 (=45px) gap-x-6 (=27px)`, `auto-rows-max`.
- Every N items there is an inline promo row: `md:grid-cols-5` (3 cols copy, 2 cols button `pnp-primary-button-large w-72`).
- Empty state copy: "No search match your criteria." / "Try adjusting your search terms."
- Insight card (`pnp-insight-card`):
  - #E4E9F5 card, `rounded-lg`, `h-full`, image on top, body `p-4 gap-2`.
  - Chip row `h-10 overflow-hidden`: type chip dark (#070E34 background, #DFE1EB text) plus industry chips white. All are `label-sm rounded p-1` uppercase.
  - Title `subtitle-md` (16px/700/24px) #202A54, `line-clamp-4`.
  - Date `card-label` in #788098, with the type in #070E34 semibold uppercase.

**Programs listing (`/our-programs`).** Order:
1. `headerHero` (greyBlue)
2. `imageComponent`
3. `programsList`
4. `bannerButtons` (`purpleLines`): "Find our active Challenges..."
5. `bannerButtons` (purple)
6. bannerLocation
7. newsletter

- `pnp-program-list`: `bg-white py-16`, grid `md:grid-cols-2 lg:grid-cols-3 gap-8 gap-y-24 (=108px) pt-12`. Load-more button `pnp-primary-button-large md:w-[250px] lg:w-[280px] mt-24`.
- `pnp-program-card`:
  - Image `h-[329px] w-[381px] rounded-lg`, scales on hover.
  - Location row with pin, then title `title-sm-semibold` (40px) `line-clamp-2`, underline on hover.
  - Description `label-md-light line-clamp-2`.
  - Chip row: `label-sm` violet text on #F5F5F7.

**Locations index (`/locations/all-locations`).** Order:
1. `headerPrimary` (H1 "Locations" + paragraph)
2. `listLocations`
3. `statsCards`
4. `bannerButtons` (purple): "Get in touch with our experts around the world."

- `pnp-list-locations`:
  - Region tabs (Material tabs): `w-24 md:w-36 lg:w-48`, `py-4 md:py-6`, `rounded-t-lg`, `text-sm md:text-lg` semibold, grey text.
  - Tab panel: white, `px-4 sm:px-10 md:px-20 (=90px) pb-10 pt-16`. Region title `text-[1.33rem] md:text-[1.78rem]` (24/32px).
  - Grid `md:grid-cols-2 lg:grid-cols-3 gap-6 pt-8 pb-16`.
- Location card: photo tile `max-h-[180px] max-w-[385px] rounded-lg`, gradient `from-[#3333CC]` at 40%, city name centred in white.

**Team (`/about-us/our-team`).** Order:
1. `headerHero` (greyBlue): "Our Leadership Team"
2. `ourTeamListCustom`
3. footer

- Grid `md:grid-cols-3 lg:grid-cols-4 gap-4`, with group headings `title-sm-semibold py-8`.
- Card: portrait `h-[290px] max-w-[290px] rounded-2xl object-cover`, scales on hover. Name `title-xxs` (underline on hover), title `text-secondary-md` (16px/600) in #A5AABA. `gap-4`, `my-8`.

**Vertical industries index.** Order:
1. `headerPrimaryLinks`
2. `industryList`
3. `bannerButtons`
4. newsletter

`pnp-industries` is a staggered masonry of photo tiles:
- 1 col on mobile, 2 at md, 3 at lg, 4 at xl.
- Odd columns `pt-24` and even columns `pb-24`, so the columns are offset by 108px.
- Tile `h-[390px] lg:h-[450px] rounded-lg`, with the label `title-sm` (40px/500) white at `pb-8 pl-8`.
- Intro `title-sm text-center max-w-screen-md (=768px) pb-20`.

---

### Template D: Detail page (event detail, insight/article, location)

**Event detail (`/events/silicon-valley-may-summit-2026`).** Order:
1. `headerHero` (white, chip "May 19 - 21, 2026")
2. `statsCards`
3. `richText` (wrap-up video)
4. `videoCarousel`: "Opening Talks"
5. `richText` (grey)
6. `hubspotEmbeddedForm` (gated content)
7. `halfImage`: "Thank you for joining us..."
8. `cardsInformative`: speakers, "View all Speakers ->"
9. `richText` + `iframe` (photo gallery, 600px tall)
10. `bannerButtons` (white): "Save the date..."
11. `halfRichText`
12. `bannerButtons`: "View All Startups ->"
13. `videoCarousel`
14. `iframe` (agenda, 1000px tall)
15. `bannerButtons`: sponsorship, mailto
16. `imageComponent`
17. `insightsRelated`
18. `bannerButtons`: press kit
19. bannerLocation
20. newsletter
21. `sidebarModalPopupCTA`

**Split hero (`pnp-header-hero`)**
- `h-[450px] pt-[102px]`, `grid md:grid-cols-2 gap-12`.
- Left text block `max-w-screen-sm (=640px)`, right-aligned toward the centre (`md:ml-auto md:mr-0 p-6`), `gap-2 md:gap-6 lg:gap-12`. It contains:
  - a back/parent link (`pnp-link`)
  - a date chip: `label-sm` white on #070E34, `rounded p-1`, uppercase
  - H1 `text-[48px] leading-[3rem] font-semibold` #202A54
  - body 16px
- Right: image, `max-h-[450px]`, flush to the right edge.
- Background variants: `white`, `greyBlue` (#E4E9F5).

**Dynamic event detail (`pnp-event-detail-in-person`)**
- After the image hero, the content pulls up by 14rem (`-top-[14rem] -mb-40`, = -252px) to overlap the hero.
- Grid `md:grid-cols-2 lg:grid-cols-3 gap-14 lg:gap-28`.
- Sticky-style **ticket card** in the right column: `bg-white rounded-xl p-8 gap-8`. Day number `title-xl-extrabold` (96px) violet, month `pnp-text-semibold` grey, full-width `pnp-primary-button-large` "Register", then address and time rows.
- Main column `lg:col-span-2`, `gap-[170px]`, in order:
  - format chip: `label-sm` white on #6BC78A green, e.g. "IN PERSON"
  - title `title-sm-semibold`
  - description `text-md-light whitespace-pre-line`
  - sub-heads `title-xxs mt-14`
- **Agenda (`pnp-event-agenda`)**: `px-6 pt-16`, H2 `title-sm-semibold`, day tabs (`flex-wrap gap-2 sm:gap-4 mb-12`, using `.pnp-tab`: 56px tall, 1px violet border, 8px radius, 18px/600, active = violet fill plus the button shadow). Each row is `sm:flex-row gap-10 md:gap-20 border-b py-6`: a time pill (#F5F5F7 `py-2 px-4 text-md`), then the title `text-md` and description `text-md-light`.

**Article / insight detail (`/insights/corporate-ai-strategy`).** Order:
1. `richText` (intro)
2. `insightDetails` (meta header)
3. `imageComponent` (hero image after the title)
4. `richText` (grey, "What's inside?" TOC box)
5. `halfImage` (blue, cross-promo article)
6. `richText` body
7. `bannerButtons` (purple), placed **mid-article**
8. `richText` body
9. `unorderedList`: "FAQs about corporate AI strategy"
10. `insightsRelated`: "Related Insights"
11. bannerLocation
12. newsletter

- `pnp-insight-detail` header (no image hero; the image comes after):
  - white, `pt-32 md:pt-40 (=144/180px) pb-10`
  - meta `label-md font-light uppercase` grey (type and date)
  - H1 `title-sm-semibold max-w-5xl (=1152px) line-clamp-4` (40px)
  - bottom row `mt-10 md:flex-row justify-between`: author with avatar (`text-md underline`), plus a `pnp-outlined-button-large` (download/share)
- Article image: `max-h-[450px] object-cover`, full width.
- Rich-text body scale (`.richTextContent`):
  - h1 56/56
  - h2 40/40 (500)
  - h3 32/32
  - h4 24/24
  - p 16/24
  - lists 16px with `padding-bottom:2rem`
  - blockquote p 32/41.6 (600, -0.01em)
  - tables `max-width:1024px`, links #5748F5
  - every heading `margin-bottom:2rem (=36px)`
- Measure is not capped narrow. The rich-text container is the 1280 container.

**Location detail (`/locations/singapore`).** Order:
1. `headerLocation` (hero with anchor dropdown)
2. `halfTextMedia`: "How we boost innovation in Singapore"
3. `anchorPoint#partners` + `partnerCarousel`
4. `#focus` `unorderedList` (highlighted)
5. `bannerButtons` (purple)
6. `#programs` `cards` (grey)
7. `#apac` `halfImage`
8. `richText` + `hubspotEmbeddedForm` (local newsletter)
9. `eventsCarousel`: "Our Global Events"
10. `#location` `mapLocation`: "Where to find us" (Google map)
11. bannerLocation
12. newsletter

- `pnp-header-location`:
  - `h-[900px] md:h-[644px]`, overlay #050C27 at **60%**.
  - Grid `md:grid-cols-2 gap-6 md:gap-24 px-10 sm:px-24`.
  - Left: eyebrow "INNOVATION IN SINGAPORE", then H1 48px "Singapore", then body 16px, then `pnp-primary-button-large` "Contact Us".
  - Right: an **"On this page" anchor dropdown**: `<details>` with summary `border-b border-[#4C5576] px-2 py-4`, chevron rotates 180deg when open, list `px-8 py-3 gap-4 max-h-[190px]` with hidden scrollbar. This replaces breadcrumbs as in-page navigation.
- `halfTextMedia`: grid `md:grid-cols-2 gap-8 md:gap-24`, H2 `title-xs-spacing` (32px/600/41.6px, -0.01em) `max-w-lg`, media `rounded-lg`.

---

### Template E: Contact (`/contact`)

Order:
1. `contactHeader`
2. `hubspotMultipleForm` (2-step)
3. footer

The page has **no** newsletter and no location banner. It is a focused form page.

**Contact header**
- `#F5F5F7`, `h-[600px]`, centred `gap-6 pt-20`.
- Eyebrow `label-sm` "CONTACT US", then H1 `max-w-xl text-[48px] leading-[3rem]` "Start Your Innovation Journey", then a 16px paragraph `max-w-xl`.

**2-step form**
- Top border `border-t border-[#B5C2E1] pb-16`.
- Step indicator: numbered circles `h-8 w-8 (=36px) rounded-full bg-[#DFE1EB] label-md`, active in violet, with labels "1 ABOUT YOURSELF" / "2 BASIC INFORMATION" (`label-md` uppercase, `gap-1.5`, `pt-8 gap-6`).
- **Step 1 = persona picker**: grid `md:grid-cols-2 lg:grid-cols-4 gap-4 pt-12`. Each card is a `role=button` tile, `bg-white rounded-lg p-8 pb-16`, that fills violet on hover/focus/active. Text is two lines of `title-xxs` (24px/600): line 1 grey #788098 ("I work"), line 2 #202A54 ("at a world class startup company" / "for a major corporation" / "a venture capitalist or an angel investor" / "for a government..."). Both lines turn white on hover.
- **Step 2** shows the chosen persona chip (`bg-[#DFE1EB] rounded-full py-2 px-3`), then a HubSpot form in `max-w-screen-md (=768px) py-8`. Clicking step 1 goes back.

**Form field spec** (identical in every HubSpot embed):
- Field label: 16px/600/24px, #202A54, sentence case.
- Group label (h2): 14px/600/16px uppercase, #788098, `mb 8px`.
- Input: **height 55px**, `border:1px solid #5748F5`, `radius 8px`, 15px/400, colour #788098, `margin-top:4px`. Field `margin-bottom:16px`.
- Error: 1px #F13535 border plus a 14px #F13535 message.
- Checkbox 18x18, radius 4px, checked #5748F5.
- Consent text 14px/21px #788098, with violet underlined links.
- Submit button: **280x56**, #5748F5, radius 8px, 18px/600, shadow `0 20px 28px -20px #3A2BE0E6`.

---

### Reusable template summary for StartNet

| PnP template | Hero | Body blocks (in order) | Close |
|---|---|---|---|
| Vertical / industry | full-bleed photo 644px, 30% overlay, H1 48px + featured card | dark halfText -> logo carousel -> folder accordion -> stats -> 3 info cards -> video carousel -> image tiles -> CTA band -> programs -> insights -> stories -> quote | location banner + newsletter + footer |
| Audience landing | photo 500px with 2-3 buttons | 2-col statement (grey) -> 4 service cards -> stats -> half image -> CTA band -> carousel | same |
| Listing | 450px photo, centred H1 | folder tabs -> filter bar (search + 2-3 selects + Clear) -> 3-col grid -> pagination -> FAQ accordion | CTA band + location banner + newsletter |
| Event detail | split hero 450px (text left, image right, date chip) | overlapping ticket card (-252px) + description + agenda tabs | sidebar popup CTA + newsletter |
| Article | no image hero; meta + 40px H1 at pt-180, image after | rich text with a CTA band mid-article and a grey TOC box | FAQ + related 3-up + newsletter |
| Location | 644px photo, 60% overlay, anchor dropdown | anchor-pointed sections + map | same |
| Contact | 600px grey, centred H1 | step indicator -> 4 persona tiles -> form | footer only |

Suggested StartNet route mapping:

| StartNet route | PnP template |
|---|---|
| `/programs/*` (e.g. GenAI Connect, Vibe, Women) | Vertical, with the sub-brand accent used for chips and stats numbers |
| `/founders`, `/partners`, `/investors` | Audience landing |
| `/events` | Listing |
| `/events/:slug` | Event detail |
| `/research` and articles | Listing / Article |
| `/chapters/:city` (Tamil Nadu districts) | Location |
| `/contact` | Contact, with persona tiles "I am a founder / I run a company / I invest / I'm from government or a college" |

---

## Tokens

### Colour palette (exact hex from CSS + bundle)

| Role | Hex | Where used | StartNet equivalent |
|---|---|---|---|
| Brand violet (primary) | #5748F5 | buttons, links, active tabs, form borders, highlight text (66 occurrences) | SNX Red #EF4444 as the single accent, used sparingly |
| Violet hover | #3A2BE0 | primary button hover | #DC2626 (red-600) |
| Violet active | #3024B1 | pressed | #B91C1C |
| Violet 400 / 300 | #8077F0 / #A59EF4 | gradient start, quote highlight | n/a (use red tint at 70%) |
| Violet 100 | #EDECFC | secondary-button pressed, light chip bg | #FDECEC |
| Ink (darkest) | #070E34 | body text, dark sections, dark chips | Ink #0C1719 |
| Navy text-primary | #202A54 | headings, card titles | Ink #0C1719 |
| Navy 800 | #18203F | newsletter band | Ink 900 (#0C1719 at 100%) |
| Overlay | #050C27 at 30% / 60% | hero photo overlays | #0C1719 at 30-60% |
| Card gradient | #111832 -> transparent | image cards | #0C1719 -> transparent |
| Grey 400 (inactive) | #788098 | meta, inactive tabs, form text | #6B7171 |
| Grey 300 | #A5AABA | card body on white | #8A8F8F |
| Grey 200 / border | #DFE1EB | tab borders, disabled bg, step circles | #E2E0D9 |
| Grey-blue band | #E4E9F5 | insight cards, filter band, alt accordion | Paper-2 #ECEAE3 |
| Grey-blue 50 | #B5C2E1 | form divider | #D6D3CA |
| Light background | #F5F5F7 | light sections, logo tiles, tabs strip | Paper #F4F3EF |
| Page background | #F5F5F5 | `body` | Paper #F4F3EF |
| White | #FFFFFF | cards, sections | #FFFFFF |
| Success / live | #6BC78A, #0E9F6E | "In person" chip, live dot | Connect #0E8F63 |
| Error | #F13535 | form errors | #EF4444 |
| Secondary blue | #348AED, #5AA3F8 | gradient end | n/a |
| Link yellow | #F3F97B | `pnp-secondary-link` on dark | n/a |
| Gradients | `linear-gradient(45deg,#5547F5,#5AA3F8 90.1%)`; `90deg,#EDF3FE,#EDEDFD` (light); `255.96deg,#EDECFE -4.2%,#EBF6FF 82.53%` | stats numbers, light bands | not used (the brand book forbids gradients beyond the single accent) |

### Typography (Inter only, weights 400/500/600/700/800)

Base: `html 18px`. `body 1rem/1.5rem` = **18px/27px**, colour #070E34.

| Class | Size / line-height | Weight | Tracking | Used by |
|---|---|---|---|---|
| `title-2xl` | 120px / 120px (mobile 60/60) | 500 | 0 | home hero only |
| `title-xl` | 96 / 126 | 500 | 0 | display |
| `title-xl-extrabold` | 96 / 96 | 700 | 0 | stat numbers, event day number |
| `text-[80px]` (md) / 60px | 80 / 80 | 600 | 0 | standard-page photo hero H1 |
| `title-lg` | 56 / 56 | 600 | 0 | mobile stats, richText h1 |
| `title-lg-extrabold` | 56 / 56 | 800 | 0 | 5-col stats numbers |
| `title-md` | 48 / 53 | 600 | 0 | n/a |
| `text-[48px] leading-[3rem]` | 48 / 54 | 600 | 0 | **every inner-page H1** (industry, hero, location, events, contact) |
| `text-[42px] leading-9` | 42 / 40.5 | 600 | 0 | image-tile carousel H2 |
| `title-sm-semibold` | 40 / 44 | 600 | -0.01em | **standard section H2**, banner titles, card titles in program list |
| `text-[40px] leading-10` | 40 / 45 | 600 | 0 | find-your-fit, informative, success-stories H2 |
| `title-sm` | 40 / 48 | 500 | 0 | industry tiles, intros |
| `title-xs` | 32 / 45 | 600 | 0 | carousel headings, newsletter title, tile titles |
| `title-xs-spacing` | 32 / 41.6 | 600 | -0.01em | halfTextMedia H2, blockquotes |
| `text-[32px] leading-9` | 32 / 40.5 | 600 | 0 | service-card titles |
| `title-xxs` | 24 / 29 | 600 | 0 | card titles, stat labels, persona tiles, tabs (24px/120%) |
| `title-xxs-regular` | 24 / 29 | 400 | 0 | footer lead |
| `pnp-text-lg` | 20 / 30 | 400 | 0 | lead paragraph (two-column statement) |
| `pnp-text-lg-reg` | 20 / 24 | 600 | 0 | lead on dark halfText |
| `text-md` | 18 / 24 | 600 | 0 | list titles, agenda |
| `text-md-light` | 18 / 26 (mobile 14/18) | 400 | 0 | card body copy |
| `pnp-text-semibold` | 18 / 27 | 700 | 0 | event meta |
| `main-lg-text-normal` | 16 / 24 | 400 | 0 | **body paragraphs** in heroes and sections |
| `text-secondary-md` | 16 / 24 | 600 | 0 | inputs, logo captions, team role |
| `main-lg` / `main-lg-text` | 16 / 18 (16) | 600 | 0 | nav mega-menu links, pagination |
| `label-md` | 16 / 24 | 600 | uppercase | eyebrows on banners, footer headings, step labels |
| `subtitle-md` | 16 / 24 | 700 | 0 | eyebrow above H2, insight card titles |
| buttons (large) | 16 / 16 | 600 | 0 | 56px buttons |
| `pnp-primary-link` | 16 / 16 | 600 | uppercase | "VIEW ALL ->" links |
| buttons (default) | 14 / 14 | 600 | 0 | 48px buttons |
| nav triggers | 14 / 14 | 500 | 0 | header menu |
| `main-sm` / `main-sm-light` | 14 / 21 | 600 / 400 | 0 | small body, "Clear" |
| `text-sm-light` | 14 / 21 | 400 | 0 | footer, startup card text |
| `card-label` | 14 / 14 | 600 | 0 | dates on cards |
| `label-sm` | 12 / 12 | 600 | uppercase | **chips/tags** and hero eyebrows |
| form input | 15 | 400 | 0 | HubSpot inputs |

Pattern to copy:
- Every inner page has one eyebrow (12px uppercase), one H1 at 48/54, section H2s at 40/44, card titles at 24, body at 16/24, and chips at 12.
- Display sizes (80-120px) appear only on the home page and the standard photo hero.
- The StartNet brand allows only Inter 400-500, so map 600 to 500. Put the Instrument Serif Italic accent word inside the H1 or H2 at the same px size.

### Spacing scale (computed at the 18px root)

| Token | Class | px | Typical use |
|---|---|---|---|
| 4.5 | `p-1` | 4.5 | chip padding |
| 9 | `gap-2`, `py-2` | 9 | chip rows, filter-bar gap |
| 18 | `gap-4`, `px-4`, `p-4` | 18 | card grid gap, container gutter |
| 22.5 | `gap-5`, `py-5` | 22.5 | story/event grid gap, accordion item y-padding |
| 27 | `gap-6`, `p-6`, `gap-x-6` | 27 | hero stack gap, banner text stack |
| 36 | `gap-8`, `p-8`, `py-8` | 36 | card padding, mobile section padding |
| 45 | `p-10`, `py-10`, `gap-y-10` | 45 | mega-menu padding, filter bar y, insight row gap |
| 54 | `gap-12`, `py-12`, `mb-12` | 54 | hero inner stack, half-image y, heading-to-grid |
| 58.5 | `py-[3.25rem]` | 58.5 | stats row padding |
| 63 | `py-14` (md) | 63 | **default desktop section padding** |
| 72 | `py-16` | 72 | banners, newsletter, program list |
| 90 | `mb-20`, `pt-20`, `md:px-20` | 90 | header-to-grid on story sections, pagination top |
| 94.5 | `gap-[5.25rem]` | 94.5 | stats columns |
| 108 | `gap-24`, `gap-y-24`, `pt-24` | 108 | **2-column gutter**, program row gap, masonry offset |
| 135 | `gap-[7.5rem]` | 135 | accordion title block |
| 170 | `gap-[170px]` | 170 | event detail main column |

Section rhythm: `py-8 md:py-14` (36 / 63px) is the default. CTA bands use `py-8 lg:py-16` (36 / 72). Sections sit flush against each other and are separated by background colour alternation (white / #F5F5F7 / #E4E9F5 / #070E34 / #5748F5), not by borders.

### Containers, grids, heights

- Content container: `container mx-auto max-w-screen-xl px-4` = **max-width 1280px, gutter 18px**. Tailwind `.container` steps 640/768/1024/1280/1536, capped by `max-w-screen-xl`.
- Narrow measures: `max-w-screen-md` 768 (form, intro), `max-w-screen-sm` 640 (split-hero text), `max-w-2xl` 756 (hero copy), `max-w-xl` 648 (contact/hero sub), `max-w-lg` 576 (section H2 block), `max-w-md` 504, `max-w-sm` 432, `max-w-5xl` 1152 (article H1).
- Grids:
  - 2-col split `md:grid-cols-2 gap-24`
  - card grids `md:grid-cols-2 lg:grid-cols-3 gap-4 | gap-5 | gap-x-6 gap-y-10`
  - team `md:grid-cols-3 lg:grid-cols-4 gap-4`
  - persona `lg:grid-cols-4 gap-4`
  - stats `grid-cols-5`
- Carousels (Swiper): 3 per view at >=1280 (spaceBetween 22), 2 at >=768 / 990 / 1024 (20-22), 1 at 375. Arrows are 40px circles (45px computed), and the arrow cluster is `w-28` (126px).
- Hero heights:
  - photo hero 644px desktop / 500px mobile
  - button hero 500 / 600 mobile
  - split hero 450
  - listing hero 450
  - location 644 / 900 mobile
  - contact 600
  - secondary 500
  - info-pages 488
  - location banner 464
- Card heights:
  - image tile 500
  - story card 495
  - startup card 270
  - logo tile 198
  - program image 329x381
  - team portrait 290
  - event title block 60 + 60
  - industry tile 390 / 450

### Radii

| Value | Where |
|---|---|
| 4px (`rounded`, 4.5px computed) | chips/tags, checkboxes |
| 8px (`rounded-lg`; CSS `8px`, 37 uses) | **default**: buttons, inputs, cards, images, tabs top (`8px 8px 0 0`) |
| 13.5px (`rounded-xl`) | event ticket card |
| 18px (`rounded-2xl`) | team portraits, accordion tops, featured insight card, mobile image tiles |
| 36px (`rounded-[2rem]`) | informative cards, desktop image tiles |
| 9999px | pagination circles, carousel arrows, step dots, persona chip |

### Shadows

- Primary button: `0 20px 28px -20px #3A2BE0E6` (violet glow under the button). It is removed on hover.
- Secondary (white) button: `0 20px 20px -19px #8077F0CC`.
- Cards: Tailwind `shadow-sm` `0 1px 2px 0 rgb(0 0 0/.05)`.
- Dropdowns: `shadow` `0 1px 3px 0 rgb(0 0 0/.1), 0 1px 2px -1px rgb(0 0 0/.1)`. Mobile panel: `shadow-md`.
- There are no large elevation shadows. Depth comes from colour blocks and photo overlays.
- For StartNet: replace the violet glow with `0 20px 28px -20px rgba(239,68,68,.55)` on the red CTA only, or drop it to stay with the flat brand book.

### Buttons and links

| Variant | Height | Padding | Font | Colours |
|---|---|---|---|---|
| `pnp-primary-button` | 48 | `px-6 py-4` (27 / 18) | 14/600 | #5748F5 bg, 1px same border, hover #3A2BE0, active #3024B1, disabled #DFE1EB/#788098 |
| `pnp-primary-button-large` | 56 | `px-6 py-5`; fixed widths 224 (`w-56`), 250-280, 324 (`w-72`) | 16/600, nowrap | same |
| `pnp-secondary-button(-large)` | 48 / 56 | same | same | white bg, violet text, active #EDECFC |
| `pnp-outlined-button(-large)` | 48 / 56 | same | same | transparent, 1px violet border, hover fills #3A2BE0 with white text |
| `pnp-white-outlined-button(-large)` | 48 / 56 | same | same | for dark bands, hover white fill with violet text |
| `.pnp-tab` | 56 | 24 | 18/600 | outline violet, active filled violet with glow |
| Links `pnp-primary-link` / `pnp-white-link` / `pnp-dark-link` | n/a | `py-2` (8px), `gap-2` | 16/600, **uppercase**, trailing arrow "->" | dark link underlines on hover |

### Motion

- Tailwind default: `transition` 150ms `cubic-bezier(.4,0,.2,1)`.
- Image zoom on card hover: `group-hover:scale-105 transition-transform duration-300 ease-in-out`.
- Tab strip: `transition-all duration-300`. Accordion chevron: `transition group-open:rotate-180`.
- Other durations present: 200, 500, 700ms. Plus `.25s ease` (swiper), and `opacity .4s cubic-bezier(.25,.8,.25,1)` (Material).
- Hover title growth on image tiles: 32px to 56px, with no explicit transition (instant).
- A `prefers-reduced-motion` media query exists.

### Breakpoints

- Tailwind defaults: `sm 640`, `md 768`, `lg 1024`, `xl 1280`, `2xl 1536`.
- Custom: `max-width:768px` (mobile type downsizes: `title-2xl` 120 to 60, `text-md-light` 18 to 14), `max-width:1024px` (event tabs go full width), `max-width:1336px` (nav labels wrap), `max-width:640px`.
- Mobile hero heights grow (location 900, button hero 600) so stacked content fits.

### Iconography and misc

- Material Icons + Material Icons Round (24px base). Icon sizes: `pnp-icon-xs` 10, `sm` 14, `md` 16, `lg` 28, `xl` 46, `xxl` 54.
- Arrows in CTAs are text glyphs ("->", "→") or 16-24px inline SVG.
- Chips are always `label-sm` (12px/600 uppercase), `rounded p-1`, with 3 schemes: violet on #F5F5F7, white on #070E34, #070E34 on white.
