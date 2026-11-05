# Reference: Plug and Play Tech Center home page (deep-dive)

Source: https://www.plugandplaytechcenter.com/ (inspected live on 2026-11-05 with the built-in browser at 1440x900 and 375x812, cookies rejected. Computed styles were read with `getComputedStyle`, and the production stylesheet `styles-NRA6D7TF.css` (103 KB) was downloaded and grepped.)

Stack: Angular SSR, Tailwind utilities plus a small set of hand-written `pnp-*`, `title-*`, `main-*` and `label-*` classes, with Swiper web components (`<swiper-container>`) for carousels. HubSpot runs the newsletter form and CookieYes runs consent.

> **Root font-size quirk.** `html { font-size: 18px }`, so every Tailwind rem utility renders 12.5% bigger than its name implies (`h-20` = 90px, `px-4` = 18px, `gap-4` = 18px, `rounded-lg` = 9px, `rounded-[2rem]` = 36px). The px values below are the **rendered** values. The named utility follows in brackets where it matters. If StartNet uses a 16px root, take the rendered px numbers, not the Tailwind names.

---

## 0. Global tokens (from CSS)

### Colour (PnP's own, listed so it can be mapped)
| Token / class | Hex | Used for |
|---|---|---|
| `pnp-dark-color`, `pnp-background-dark` | `#070E34` | body text colour, dark cards, dark section, CTA band |
| `pnp-text-primary` | `#202A54` | section H2s, logo-wall captions, footer small text |
| `pnp-background-primary-800` / `pnp-newsletter-banner` | `#18203F` | newsletter band, mobile menu sheet |
| `pnp-main-color` / primary-500 | `#5748F5` | the single accent: buttons, links, arrows, "Success story" chip |
| hover / active primary | `#3A2BE0` / `#3024B1` | button hover / pressed |
| primary-400 | `#8077F0` | one audience card |
| secondary-600 | `#348AED` | one audience card |
| grey-400 | `#788098` | one audience card, inactive text |
| grey-200 | `#DFE1EB` | disabled fills |
| `pnp-background-light` / grey-100 | `#F5F5F7` | logo tiles, mega-menu right pane, Playbook tab, footer social squares |
| body background | `#F5F5F5` | page bg (sections paint `#FFFFFF` on top) |
| `pnp-secondary-link` | `#F3F97B` | yellow uppercase link on dark only ("VIEW ALL INDUSTRIES") |
| card gradient overlay | `#111832` to transparent | `bg-gradient-to-t`, opacity .5 (locations) / .8 (stories) |

### Type: one family, Inter, weights 400/500/600/700
| Class | Size / line-height | Weight | Where |
|---|---|---|---|
| hero H1 (utility) | **90 / 90px** desktop, **48 / 54px** mobile | 500 | "We Drive Innovation" |
| `title-xl` | 96 / 126 | 500 | (not on home) |
| `title-lg` | 56 / 56 | 600 | location card title on hover (`group-hover:text-[56px] leading-[76px]`) |
| `title-md` | 48 / 53 | 600 | — |
| `text-[42px] leading-9` | 42 / 40.5 | 600 | "Office Locations" H2 |
| `title-sm-semibold` | **40 / 44**, letter-spacing −0.01em (−0.4px) | 600 | main section H2s, CTA band headline |
| `title-xs` | **32 / 45** | 600 | "Our Global Partners" H2, newsletter title, audience-card + location-card titles |
| `title-xxs` | 24 / 29 | 600 | story-card titles, footer "Contact us →" |
| `title-xxs-regular` | 24 / 29 | 400 | footer "Ready to start innovating…" |
| `subtitle-md` | 16 / 24 | 700 | eyebrow line above H2 (sentence case, NOT uppercase) |
| `text-md-light` | 18 / 26 | 400 | card body copy |
| body | 18 / 27 | 400 | default `body` |
| hero sub | 16 / 27 | 500 | hero paragraph |
| `main-lg-text` | 16 / 16 | 600 | mega-menu column heads |
| `label-md` | 16 / 24 | 600 uppercase | footer column heads |
| `pnp-primary-link` / `pnp-white-link` | 16 / 16 | 600 **UPPERCASE** | "VIEW ALL →", "LEARN MORE →", "READ THEM ALL →" |
| nav items | 14 / 14 | 500 | top-nav labels |
| buttons | 14 / 14 (`-large`: 16 / 16) | 600 | all buttons, sentence case |
| `text-sm-light` | 14 / 21 | 400 | footer links, copyright |
| mega-menu eyebrow | 13.5 / 18, tracking 0.05em (0.675px) | 600 uppercase, `text-gray-400` `#9CA3AF` | "INNOVATE", "WHAT WE DO", "KNOWLEDGE" |
| `label-sm` chips | 12 / 12 | 600 | category chips on story cards |

Letter-spacing is `normal` everywhere except `title-sm-semibold` (−0.01em) and the mega-menu eyebrow (+0.05em). There is no serif and no italic anywhere.

### Buttons (exact CSS)
- **`pnp-primary-button`**: height 48px, bg `#5748F5`, 1px border same colour, radius **8px**, text 14/14 600 white, padding 18px 27px (`px-6 py-4`), **shadow `0 20px 28px -20px rgba(58,43,224,.9)`** (a coloured glow under the button only). Hover: bg `#3A2BE0`, shadow removed. Active: `#3024B1`. The `.dark` variant uses bg `#070E34` and turns purple on hover.
- **`pnp-secondary-button`**: white bg, purple text, shadow `0 20px 20px -19px rgba(128,119,240,.8)`. Used on dark bands ("Contact Us →", 324px wide, padding 22.5px 90px).
- **`pnp-outlined-button`**: transparent, 1px `#5748F5` border, purple text. Hover fills `#3A2BE0` with white text. Used for header "Contact" (height forced to 45px).
- **`pnp-white-outlined-button`**: 1px white border on dark. Hover is a white fill with purple text.
- `-large` variants: 56px tall, 16px text.
- Every CTA label ends in a text arrow "→" (`->`), never an icon.

### Text links
`pnp-primary-link`: 16px/600 **uppercase**, purple, padding 8px 0, gap 8px to the arrow, underline on hover. White and yellow variants are used on dark backgrounds.

### Tags / pills
`pnp-dark-tag`: inline-flex, padding 8px 24px, radius 8px, 1px solid white, white text 18px/600, line-height 150%. `.active` is a white fill with navy text. `pnp-light-tag` is the inverse for light backgrounds. These are **8px-radius rectangles, not full pills**.

### Radii in use (rendered)
4.5px (chips) · 8–9px (buttons, nav card, logo tiles, story cards, mega menu) · 18px (mobile cards `rounded-2xl`, footer social squares) · **36px (`rounded-[2rem]`: audience cards, location cards, inset dark section)** · 9999px (carousel arrow circles).

### Shadows
Almost none. Cards use `shadow-sm` (`0 1px 2px rgba(0,0,0,.05)`), which is invisible in practice. Depth comes from **solid colour blocks and photo overlays, not shadows**. The only visible shadows are the coloured glows under buttons and the floating demo widget (`0 8px 32px rgba(0,0,0,.3), 0 2px 8px rgba(0,0,0,.1)`, radius 16px).

### Container and rhythm
- `.container mx-auto max-w-screen-xl`: **max-width 1280px**, inner padding 18px (`px-4`), so content runs 1244px wide. At 1440 the left content edge is x=90.
- Section vertical padding: `py-8 md:py-14` = **63px desktop / 36px mobile** (most sections). "Who we work with" uses `md:py-10` = 45px. Bands (CTA, newsletter) use `py-16` = 72px.
- Section backgrounds alternate white `#FFF` sections with a navy band, then an **inset navy rounded panel** (36px margin, 36px radius), then white, then a navy band.
- Breakpoints: Tailwind defaults 640 / 768 / 1024 / 1280 / 1536. Desktop nav appears at `xl` (1280). Below 1280 the hamburger shows.

---

## 1. Header (fixed, floating card)

**Layout.** `<header class="fixed top-0 left-0 right-0 px-3 pt-3 z-20">` is transparent and gives 13.5px gutters on the top, left and right. Inside sits `<nav class="bg-white h-20 rounded-lg px-4 flex justify-between items-center">`, a **white card 90px tall, radius 9px, 18px side padding**, full width minus gutters (1398px at 1440). It floats over the hero photo, so the hero image shows around its edges. There is **no shadow and no border**.

**Content, left to right** (desktop ≥1280):
1. Logo, 144px wide (117px rendered at 1440), wordmark in navy.
2. Group 1 (dropdowns, gap 16px): **Innovation Services ▾ · Venture Capital ▾ · Vertical Industries ▾ · Insights ▾**
3. Group 2 (gap ~9–14px): **About Us ▾ · Locations · Success Stories · Co-Working ▾ · Events**
4. **Contact** (outlined button, 45px tall, 8px radius) and a **search** square (45x45 primary button with a Material "search" icon).
- Nav labels: Inter 14px/500, `#070E34`. The dropdown caret is the Material Icons `arrow_drop_down`. It flips to `arrow_drop_up` when open. Direct links have padding 13.5px 6.75px.
- **"Playbook" tab**: a small tab hangs from the very top-right of the viewport (`absolute top-0 right-0 mx-7`), bg `#F5F5F7`, `rounded-b-lg`, 12px/500 text with a small icon, padding 4.5px 9px 9px. It works as a utility link that sits above the nav card.

**Sticky behaviour.** Always fixed at top 0. It **does not change on scroll**: no shrink, no colour change, no hide-on-scroll-down. I verified this at scrollY 500: same classes, same 90px height, white bg. Content scrolls beneath the white card and is visible in the 13.5px gutter.

**Mega menus** (open on **click**, not hover; the caret toggles; clicking the same item again closes it):
- Panel: `absolute top-[105px]`, so it drops **~1px below the nav card** with no visible gap. It is white, `rounded-lg` (9px), `shadow-sm`/`shadow-md`, and `w-max`.
- **Innovation Services** (the widest, 1058x322): a **two-pane** layout.
  - Left pane, 300px wide, white, padding 45px: eyebrow **"INNOVATE"**, then 3 large links stacked with big gaps ("All About Innovation Services", "Explore our Custom Programs", "AI Centers of Excellence"). Links are 16px/600 navy.
  - Right pane, 758px wide, bg `#F5F5F7`, `rounded-r-lg`, padding 45px: eyebrow **"WHAT WE DO"**, then **3 columns**:
    - For Corporations: Industry Connections, Accelerator Programs, Innovation Strategy, Startup Scouting, Our Partners
    - For Startups: Investment Opportunities, Accelerator Programs, Business Development, Challenge Offerings, Our Startups
    - The third column has three heads only: For Governments, For Universities, For Mentors
  - Column head: 16px/600 navy. Child links: 15.75px/500 (`text-sm font-medium`), 13.5px top margin each.
  - Eyebrow: 13.5px/600 uppercase, tracking 0.05em, `#9CA3AF`, margin-bottom 18px.
- **Vertical Industries** (865x512): one white pane, padding 45px. Eyebrow "KNOWLEDGE", then a bold "All Vertical Industries" link, then a **3-column grid** of 27 industries (`grid-cols-[repeat(3,max-content)] gap-y-4 gap-x-20` = 18px row gap and 90px column gap). Plain 16px/500 links.
- **Venture Capital / Insights / About Us / Co-Working**: a small single-column dropdown (about 300px wide, padding 45px). The first link is bold ("All About Venture Capital", "All Industry Content") and the rest are regular, with about 18px vertical spacing (Venture Capital: Plug and Play Ventures, Investment Announcements, Startup Portfolio, Our Funds, Fintech & AI Fund I).
- No icons, no images and no promo cards inside the menus. They are text-only, and the hierarchy comes from the grey eyebrow, bold heads and the grey second pane.

**Mobile header** (375): the same floating white card (348x90, radius 9px). It holds the logo, a search button (45x45 outlined) and a hamburger (45x45 filled purple, Material `menu`). The Playbook tab stays top-right.
- **Mobile menu**: a full-screen sheet (`h-screen absolute`, bg `#18203F`) with a white logo and a close "X" in a 45px grey-blue square.
  - Primary group (gap 27px): Innovation Services, Venture Capital, Vertical Industries, Insights. These are **22.5px/600 white**, each with a `chevron_right`.
  - Secondary group (gap 18px): About Us › (20px/400), then Locations, Success Stories, Co-Working ›, Events at 18px/400.
  - Below that: a full-width white "Playbook" button and a "Contact" button.
  - **Drill-down**: tapping an item with › replaces the list with a sub-list. A back row "‹ Innovation Services" (underlined, muted) sits over a hairline divider, and the sub-links follow at 20px/600 white. Nested items keep their › (For Corporations ›, For Startups ›).

---

## 2. Hero ("We Drive Innovation")

**Layout.** `<section class="relative flex overflow-hidden bg-cover bg-center h-[860px] md:h-[720px] items-end md:items-start">`. It is **720px tall on desktop and 860px on mobile**.
- Background: **one composite raster image**, `Desktop-Hero-2970x1323px` (`Mobile-Hero-526x1251` on mobile), with `bg-cover bg-center`. The left 45% is near-black navy with fine purple/teal **wireframe "wave" line art** curling in from the left edge. The right ~55% is a **full-colour cut-out-style stage photo of the founder** (smiling, holding a mic, stage lights behind in blue). The photo bleeds to the right edge and the bottom. There is **no CSS overlay or gradient**: the darkness is baked into the image.
- Inner: container 1280 → `grid grid-cols-1 md:grid-cols-2 pt-12`, with text in the **left column only**. The right column is empty because the photo sits there.
- Text block: `max-w-md` (504px), `h-[652px] flex flex-col justify-center gap-4` (18px gaps), vertically centred. On mobile it is bottom-aligned (`items-end`, `pb-12`) under the photo.

**Content and type**
- H1 "We Drive Innovation": **90px/90px, weight 500, white, letter-spacing normal**, 2 lines (468px wide). On mobile it is 48/54.
- Sub: "Empowering the future with corporations, governments, startups, investors, and universities." 16px/500, line-height 27px, white, 2 lines.
- One CTA: **"Get In Touch →"** primary button (48px tall, 158px wide, purple glow shadow). On mobile it runs full width (339px).
- No second CTA, no stats, no logos and no eyebrow in the hero. It is deliberately minimal.

**Floating elements** (fixed, all pages):
- A bottom-right "**Accelerate your innovation**" card (360x84, white, radius 16px, heavy soft shadow, avatar photo on the left, a purple circular → button on the right, a small "–" collapse control).
- An AI-agent bubble ("Hey! Let's talk, I'm your personal AI agent.") in `#F1F0FF`, radius 12px.
- The CookieYes revisit button (45px purple circle) bottom-left.

---

## 3. "Our Global Partners" (logo wall carousel)

**Layout.** A white section with padding 63px top and 36px bottom (`py-8 md:pt-14`), 570px tall.
- Header row: H2 **"Our Global Partners"** (`title-xs`: 32/45, 600, `#202A54`), left-aligned (centred on mobile). Below it, the link **"VIEW ALL →"** (`pnp-primary-link`, uppercase purple 16px/600).
- **Carousel arrows top-right** of the header row: two 45px buttons. Each holds a 45px **filled purple circle** (`rounded-full bg-[#5748F5] border`) with a white Tabler `arrow-left`/`arrow-right` (24px stroke icon). On hover the circle goes white and the arrow purple. The gap between the two is about 12px.
- Track: `<swiper-container slides-per-view="auto" space-between="20" speed="400">`, which adds CSS scroll-snap (`snap-x snap-mandatory`, slides `snap-start snap-always`). There is **no autoplay and no marquee**. The track has 27px padding and a 36px margin.
- **Slide = logo tile + caption**: 296px wide.
  - Tile: `h-44` (198px), bg `#F5F5F7`, radius 9px, padding 40.5px 22.5px. The logo sits inside with `object-contain` and **`mix-blend-darken`** so white logo backgrounds disappear into the grey. Logos are **full-colour brand logos, not greyscale**.
  - Caption below the tile: the company name **uppercase**, 16px/600, `#202A54`, centred (JLR, BAYER, DAIMLER TRUCK NORTH AMERICA, ZIMMER BIOMET, VOLVO GROUP, ELI LILLY…).
- 4.2 tiles are visible at 1440. The last slide is a **"VIEW ALL +" tile**: the same 198px height, a 1px `#5748F5` border, transparent fill and uppercase purple text.
- Mobile: one 339px tile per view, swipeable, no visible arrows.

---

## 4. "Who We Work With" (audience cards)

**Layout.** A white section, padding 45px top and bottom. H2 **"Who We Work With"** (`title-sm-semibold`: 40/44, 600, −0.4px, `#202A54`) with margin-bottom 63px. Cards sit in `flex flex-wrap justify-center gap-4` (18px), giving **3 columns x 2 rows** at 1440.

**Card** (desktop, `hidden md:block`): **396x414px, radius 36px**, `overflow-hidden`. Each card has its **own solid background colour**:
| Card | bg |
|---|---|
| Corporations | `#070E34` navy |
| Governments | `#348AED` blue |
| Startups | `#5748F5` purple |
| Investors | `#788098` slate grey |
| Universities | `#8077F0` lavender |
| Mentors | `#070E34` navy |

- Resting state: a photo fills the top ~55% of the card. It is a **pre-cropped image with rounded corners and padding baked in**, `object-contain`, at **opacity .70**, so the card colour tints it. The title sits under it, 32/45 600 white (`title-xs`, margin-top 45px). **"LEARN MORE →"** is absolutely positioned 45px from the bottom (`pnp-white-link`, uppercase 16px/600 white).
- **Hover** (`group-hover`): the contained image is hidden and a second **full-bleed `object-cover` photo** (opacity .80, still tinted by the card colour) is shown. It **scales to 1.10** over 300ms `ease-in`, and the title gets **underlined**. The card itself does not lift or gain a shadow.
- **Mobile card** (`block md:hidden`): 339x180px, **radius 18px**, the same solid colours. The title (24/29 600 white) is top-left with padding. A **128px circular photo** (`w-32 h-32 rounded-full float-right`, opacity .30) sits at the right. There is no "Learn more" text: the whole card is the link. The cards stack in one column with an 18px gap.

---

## 5. "Office Locations" (image carousel)

**Layout.** A white section, padding 63px. Header: H2 **"Office Locations"** (42px/40.5, 600, `#070E34`, `max-w-sm`) with "VIEW ALL →" below it and the same purple circle arrows at top-right.
- Track: `<swiper-container slides-per-view="auto" space-between="16" slide-to-clicked-slide="true">`, margin 63px top and bottom.
- **Slide: 400x500px portrait photo card, radius 36px** (18px on mobile), bg navy behind. The image is `object-cover`, with an overlay `bg-gradient-to-t from-[#111832] to-transparent` at **opacity .5**.
- City name **centred** in the middle of the card: `title-xs` 32/45 600 white, `line-clamp-2`.
- **Hover**: the image scales to 1.05 (300ms ease-in-out). The **title grows from 32px to 56px** (line-height 76px), so "Silicon Valley" breaks to 2 lines. A **"DISCOVER →"** white uppercase link appears 45px from the bottom (`hidden group-hover:block`).
- Slides: Silicon Valley, Tokyo, New York City, Stuttgart, Riyadh, then a VIEW ALL tile. About 3.1 cards are visible at 1440, and 1 card (339x500) on mobile.

---

## 6. CTA headband ("Start your innovation journey with us.")

**Layout.** A full-bleed **navy band** `#070E34` (`pnp-headband-banner-dark`), padding 72px top and bottom (32px on mobile), 232px tall. Inside the container: `grid lg:grid-cols-2 items-end gap-24` (108px).
- Left: **"Start your innovation journey with us."** `title-sm-semibold` 40/44 600 white, 2 lines, left-aligned (centred on mobile).
- Right: **"Contact Us →"** white `pnp-secondary-button`, 324px wide, 48px tall, purple text, lavender glow shadow, centred in the right column and bottom-aligned with the headline.
- The CSS also defines `pnp-headband-banner-*-with-lines` variants (the same band with a line-art PNG at `background-position: 60% 20%`). The home page uses the plain dark one.

---

## 7. "Our Vertical Industries" (inset dark panel + tag cloud)

**Layout.** `<section class="pnp-background-dark md:m-8 md:rounded-[2rem]">` is an **inset navy panel**: a 36px margin on all sides and **radius 36px**, 1353px wide at 1440, 665px tall. On mobile it runs full-bleed with no radius. Inner container padding 63px 18px. Everything is **centred**.
- Eyebrow: "We help our partners innovate across more than 25 vertical industries" (`subtitle-md` 16/24 **700**, white, sentence case).
- H2 **"Our Vertical Industries"** (`title-sm-semibold` 40/44 600 white).
- **Tag cloud**: `flex flex-wrap justify-center gap-3` (13.5px) with 27 `pnp-dark-tag` links (1px white border, 8px radius, padding 8px 24px, 18px/600 white, 45px tall). There are 5 centred rows. **Hover underlines the label**; the tag fill stays the same.
- Footer link: **"VIEW ALL INDUSTRIES →"** in **yellow `#F3F97B`** uppercase 16px/600, centred. This is the only non-purple accent on the page.
- There is no imagery and no line art. It is pure type on navy.

---

## 8. "Real Success Stories" (story cards)

**Layout.** A white section, padding 63px.
- Header: eyebrow **"How we help our Global Partners innovate"** (`subtitle-md` 16/24 700, `#202A54`, padding-bottom 36px). Below it the H2 **"Real Success Stories"** (40px/45, 600, `#202A54`, `max-w-md`). The "READ THEM ALL →" link sits on the right of the header row.
- Grid: `grid md:grid-cols-2 lg:grid-cols-3 gap-5` (22.5px), giving 3 cards at 1440 (400px each). This is a static grid, not a carousel.
- **Story card**: 400x495px (`h-[27.5rem]`), bg navy `#070E34`, **radius 9px** (smaller than the audience and location cards), `overflow-hidden`.
  - Top: a 252px (`h-56`) photo, `object-cover`, `rounded-lg`, with a navy gradient overlay (`from-[#111832]` at opacity .8).
  - Over the photo at top-left, a **chip row** (gap 9px, margin-bottom 18px): category chips are **white bg, navy text, 12px/600 uppercase, radius 4.5px, padding 4.5px** ("ENTERPRISE & AI", "FINTECH"). The type chip "**Success story**" is **purple bg, white text, sentence case**.
  - The text block is pushed down (`relative top-48`), so the title overlaps the bottom edge of the photo. Title: `title-xxs` 24/29 600 white, `line-clamp-1` with ellipsis. Excerpt: 18/26 400 white, `line-clamp-4`.
  - Meta row: a location-pin SVG (16px), "Seattle, Washington", then the date "07-28-2026".
  - **Hover**: the image and overlay scale to 1.05 (300ms) and the title underlines.
- Mobile: one column, 339x495 cards.

---

## 9. Promo image banner ("20 Years Driving Innovation")

A full-bleed `<img>` (`w-full max-h-[450px] object-cover`), 236px tall at 1440 and 62px on mobile. It is a designed graphic: a large "20 YEARS" numeral lock-up beside the words "Driving Innovation" on a light blue-grey background with a photo. It is not live text, and it has no CTA overlay.

---

## 10. Newsletter band

**Layout.** A full-bleed band in `#18203F` (`pnp-newsletter-banner`, set up for a cover background image), padding 72px. Grid `md:grid-cols-2 items-center gap-24` (108px).
- Left column (568px):
  - Title "Sign up for our global newsletter" (`title-xs` 32/45 600 white, nowrap).
  - Copy: "Stay ahead of Tech and Innovation" / "Don't miss the latest trends…" in 18/27 white.
  - Email input: **320x56, white, 1px `#5748F5` border, radius 8px, 15px text**, with the placeholder "Your email address…*".
  - Legal copy at 14/18 white with a purple "Privacy Policy" link.
  - A 20px consent checkbox (radius 4px).
  - A **"Sign up"** HubSpot button: 150x56, purple, radius 8px.
- Right column: a single white uppercase link, "DISCOVER OUR INDUSTRY NEWSLETTERS →".

---

## 11. Footer

**Desktop** (`hidden lg:block`): a white footer with a **very light lavender-gradient background image** (`/assets/bg-footer.jpg`) that fades in at the bottom. Padding 45px, 575px tall. `flex justify-between gap-8`.
- **Left column** (499px, `flex-col gap-10` = 45px):
  - Logo (144px).
  - "Ready to start innovating your organization?" in `title-xxs-regular` 24/29 400 navy, then **"Contact us →"** in `title-xxs` 24/29 **600 purple**.
  - A large spacer.
  - **Social row**: 5 **63x63 squares, bg `#F5F5F7`, radius 18px**, gap 9px, holding navy X, Instagram, Facebook, LinkedIn and YouTube glyphs.
  - "Plug and Play 2026© | All rights reserved." in 14/21 `#202A54`.
- **Right side**: two columns, each about 139px wide with a 36px gap. Each column stacks link groups:
  - Col 1: **DISCOVER** (All Locations, All Vertical Industries, Events, Success Stories), then **CONNECT** (For Startups, For Corporations, For Governments, For Universities).
  - Col 2: **ABOUT US** (All About Us, Our History, Work With Us), then **COMPLIANCE** (Privacy & Legal, Trust Center, Your Privacy Choices), then **JOIN** (Join a Startup, IT Perks for Startups).
  - Group heads use `label-md` 16/24 600 uppercase navy, with a 34px top margin between groups. Links are 14/21 400 navy, about 4.5px apart (`space-y-1`), underlined on hover.
- **Mobile** (`lg:hidden`): the same content stacked in one column (898px tall), padding 22.5px 18px, all groups expanded. There are no accordions.

---

## 12. Page rhythm summary (desktop 1440, total height 6409px)

| # | Section | y-start | height | bg | vertical padding |
|---|---|---|---|---|---|
| 1 | Header (fixed, overlays) | 0 | 104 | transparent, white card | 13.5 top gutter |
| 2 | Hero | 0 | 720 | composite photo | text centred in 652 |
| 3 | Global Partners carousel | 720 | 570 | white | 63 / 36 |
| 4 | Who We Work With (6 cards) | 1290 | 1043 | white | 45 / 45 |
| 5 | Office Locations carousel | 2333 | 897 | white | 63 / 63 |
| 6 | CTA headband | 3230 | 232 | navy `#070E34` | 72 / 72 |
| 7 | Vertical Industries (inset panel) | 3498 | 665 | navy, 36 margin, 36 radius | 63 / 63 |
| 8 | Real Success Stories (3-up grid) | 4199 | 816 | white | 63 / 63 |
| 9 | 20-years promo image | 5015 | 236 | image | 0 |
| 10 | Newsletter | 5250 | 584 | `#18203F` | 72 / 72 |
| 11 | Footer | 5834 | 575 | white with lavender wash | 45 / 45 |

Mobile (375): 8434px total. Hero 860, Partners 458, Who-we-work-with 1393 (6 stacked 180px cards), Locations 749, CTA 288, Verticals 1492, Stories 1856, promo 62, Newsletter 378, Footer 898.

## 13. Interaction and motion inventory
- **No scroll-reveal animations.** No AOS, no `animate-*`, no fade-ups. Content is static on scroll.
- **No marquee or autoplay.** Both carousels are manual Swiper (`speed 400`, `slides-per-view auto`, scroll-snap) with circle arrow buttons. Touch swipe works on mobile.
- **No tabs** on the home page. The CSS has `pnp-mat-tabs` (centred Material tabs with no indicator), but they are used elsewhere.
- Hover vocabulary, applied consistently:
  1. Image zoom inside an `overflow-hidden` card: `scale-105` (locations, stories) or `scale-110` (audience), 300ms.
  2. Title underline.
  3. Image swap from contained to full-bleed (audience cards).
  4. Title size jump from 32 to 56px and a revealed "DISCOVER →" (locations).
  5. Buttons: darker fill, shadow removed.
  6. Arrow circles invert from purple to white.
- Global `transition: all` is set on most elements, so colour changes ease.
- Header: fixed and static. Mega menus are click-to-toggle panels attached directly under the nav card. Mobile uses a full-screen drill-down sheet.

---

## 14. Translation notes for StartNet (concrete mapping)

| PnP pattern | StartNet equivalent |
|---|---|
| Navy `#070E34` (text, dark cards, bands) | Ink `#0C1719` |
| Light grey `#F5F5F7` tiles / menu pane / page `#F5F5F5` | Paper `#F4F3EF` (page). Use a 4–6% Ink tint for tiles and the mega-menu right pane. |
| `#202A54` H2 colour | Ink `#0C1719` (no second navy) |
| Purple `#5748F5` everywhere (buttons, links, arrows, chips) | **Do not copy.** Primary buttons are Ink-filled with Paper text, and the hover is Ink at 85%. SNX Red `#EF4444` appears once per view as the "full stop": the dot in the logo/H1, or a single active indicator. Never use red as the button fill colour site-wide. |
| Purple glow under buttons `0 20px 28px -20px` | The same geometry in Ink: `0 20px 28px -20px rgba(12,23,25,.45)`. Or drop it. |
| Multi-colour audience cards (navy / blue / purple / slate / lavender / navy) | Map them to sub-brands: Ink (Founders/Startups), Research `#4A3AA7`, Vibe `#E2581F`, Connect `#0E8F63`, Women `#C2386F`, Ink (Mentors/Investors). Same 396x414 / 36px radius card, photo at opacity .7 tinted by the card colour, hover swaps to full-bleed and scales to 1.10. |
| Yellow `#F3F97B` link on dark | Paper-coloured uppercase link, or SNX Red if that is the view's single accent. |
| Inter only, no serif | Keep Inter 400/500 for UI. Add **one Instrument Serif Italic word** in the hero H1 (for example "founder-*making*") and optionally one per section H2. PnP's weight 600 headings become 500 under the StartNet brand (the brand book caps Inter at 500). |
| Hero 90/90 weight 500, left text over a dark composite photo | Keep the 720px desktop / 860px mobile hero, the left `max-w-[504px]` text column, and one primary CTA. Use a warm faded mono-graded photo of Indian founders (per StartNet photo rules) on the right, with Ink darkness baked in on the left. No animated line art: use a static texture or none. |
| Floating white nav card (90px, 9px radius, 13.5px gutters, fixed, no scroll change) | Keep it as is: Paper/white card, Ink 14px/500 labels, an outlined "Apply" button and an Ink-filled square for search or sign-in. |
| Click-open two-pane mega menu (300px white pane + grey pane with 3 columns, grey uppercase eyebrows) | Programs ▾ (left: All Programs / Incubation / Accelerator; right: "FOR FOUNDERS" / "FOR CORPORATES" / "FOR INSTITUTIONS" columns). Sub-brands ▾ as a 3-column text grid like Vertical Industries. Use a `#6B7280`-style muted eyebrow in Ink at 45%. |
| Logo wall as a carousel of 296x198 grey tiles plus uppercase caption, a "VIEW ALL +" last tile, circle arrows | The partner/institution logo wall, unchanged in geometry. Use Ink circles for the arrows (not red). |
| Location cards (400x500 portrait, 36px radius, centred city name, gradient from the bottom) | Tamil Nadu chapters/cities (Chennai, Coimbatore, Madurai, Trichy, Salem…). Same hover (title 32→56px plus "DISCOVER →"). |
| Navy CTA headband (40px headline left, white button right) | An Ink band with a Paper button. The headline may carry the one red full stop. |
| Inset rounded dark panel with tag cloud (8px-radius outlined tags) | Sectors or "What we cover". Ink panel, 36px margin and 36px radius on desktop, Paper outlined tags. |
| Story cards (navy, 9px radius, photo top with chips, 24px title, 4-line excerpt, pin + date) | Founder stories / news. A category chip in the sub-brand colour, a type chip in Paper. |
| Section rhythm: 1280 container, 63px section padding (36 mobile), 72px for bands, H2 40/44 | Take the final numbers from the Techstars sizing reference. PnP's spacing is generous but its H2s (32–42px) are mixed: standardise on one H2 size. |
