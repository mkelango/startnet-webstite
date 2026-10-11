# StartNet Brand Book v1.0: brief for chapter authors

You are a senior brand designer writing one chapter of a premium, minimalist brand book for **StartNet**, Tamil Nadu's
founder-making network. The format follows the elan1 brand book: 16:9 pages, quiet paper grounds, hairline rules, one red
point per page, generous space and practical examples. It follows international brand-guideline practice.

## Files

- `book.css`: the page system. Read it first and use its classes. Do **not** edit it. Chapter-only CSS goes in a
  `<style>` block at the top of your own file, with every selector prefixed by your chapter class (e.g. `.c02-…`).
- `pages/00-front.html`: the reference for quality and markup. Copy its patterns.
- `palette.json`: every colour value. Use the CSS variables in `book.css` (e.g. `var(--red)`, `var(--ink)`).
- Write **only** your own file, `pages/0N-<name>.html`. Never touch other chapter files.
- Preview: run `node build.mjs --only 0N --png` from `D:/Startet 2.0/brand-book`. Then look at every PNG in
  `out/preview-0N/` with the Read tool. Fix anything that overflows (the build prints `OVERFLOW`), looks crowded,
  misaligns or reads poorly. Iterate until each page is genuinely premium.

## Page markup

```html
<section class="page" id="<id>" data-section="0N · Chapter name">
  <div class="page__body">
    <div class="kicker">0N.1</div>
    <h1 class="title">Page title</h1>
    … content …
  </div>
</section>
```

- The build injects the header (section label plus "StartNet Brand Book · V1.0"), the footer and the folio. Optional
  attributes: `data-note="…"` (footer right, uppercase), `data-foot-rule="1"` (hairline above the footer).
- Grounds: `page` (paper, the default), `page page--bone` (alternate light), `page page--ink` (dark). Use about one ink
  content page per chapter, as elan1 does.
- **Body area:** about 1712 × 810 px (1920 × 1080 page, 104 px side margins, 136 px header, 92 px footer, 40 px top
  padding). Nothing may overflow. Leave air: elan1 pages are about 60% full.
- **Type classes:** `.kicker`, `.title` (84 px), `.statement` (64 px), `.lede` (34 px), `.body` (26 px), `.small`
  (22 px), `.label` (uppercase red-700), `.label--muted`, `.h3`, `.h4`.
  - `<em>` inside a title becomes the Instrument Serif italic accent. Use it for at most one word per title, and not
    on every page.
- **Layout and blocks:** `.grid .g2/.g3/.g4/.g5/.g6`, `.split`, `.split--even`, `.split--wide`, `.rules` (numbered
  hairline list: `<li><b>01</b><span>…<span class="sub">…</span></span></li>`), `.spec` (tables), `.box`
  (registration-cross box: add `<i class="x1"></i><i class="x2"></i>`), `.card`, `.say`/`.not`, `.ok`/`.no` marks,
  `.top-rule`, `.hair-top`.
- **Logo:** always `<span class="sn-logo" style="font-size:Npx">StartNet<span class="d"></span></span>`.
  - Modifiers: `sn-logo--rev` (paper on ink), `sn-logo--mono` (dot takes the text colour), `sn-logo--white`.
  - A descriptor goes as `<span class="desc" style="color:…">Research</span>` after the dot.
  - Never type "StartNet." as plain text for the logo.
- **Brand device:** `.fullstop` (a big red circle positioned absolutely and cropped by the page edge), `.pulli` (dot
  grid, `--pulli` sets the colour), `.ring`. One page-scale full stop per page at most.
- **Chapter divider** (first page of your file): copy this exactly and change the number, title and nav.

```html
<section class="page page--ink chapter" id="ch-XXX" data-section="Chapter">
  <div class="pulli" style="left:0; top:136px; width:1920px; height:944px; --pulli: rgb(244 244 240 / .06)"></div>
  <div class="fullstop" style="width:520px; height:520px; right:-110px; top:-190px;"></div>
  <div class="page__body">
    <div class="chapter__num">0N</div>
    <div class="chapter__title">Title</div>
    <div class="chapter__nav"><span>Item</span><span>Item</span>…</div>
  </div>
</section>
```

## Facts: the hard rule

**Never invent facts.** That covers figures, partner names, people, dates, venues, prices and legal names. Use only:

- **StartNet Website Books.** The paths are `C:/Users/rhaml/Downloads/StartNet_Website_Book{1..4}_*.md`.
  - Book 3, Brand Identity, is the brand system: the idea in §1, the logo in §2, colour in §3, type in §4, grid in §5,
    icons in §6, imagery in §7, voice and naming in §8, and applications in §10.
  - Book 1 covers strategy, audiences and positioning (§1, §3, §4).
  - Book 2 covers page copy; the boilerplate is in its media-centre section.
- **This brief and `palette.json`.**
- **Confirmed corrections:**
  - HQ is **Salem**, Tamil Nadu, not Chennai. The registered office is 112/2F4, Fairlands, 3rd Cross Street,
    Fairlands, Salem 636016.
  - The legal entity is STARTNET VENTURES PRIVATE LIMITED, CIN U70200TZ2023PTC028823, incorporated 4 July 2023. The
    public record starts in 2023; never say "five years".
  - Emails: hello@startnet.in, partners@startnet.in, press@startnet.in, careers@startnet.in. Website: startnet.in.
- **Colour decision (this edition):**
  - Primary: **SNX Red #EF4444**, replacing Book 3's #E5322D.
    - Working steps: Red-600 #DC2626 for button fills with white text (4.83:1).
    - Red-700 #B91C1C for red text on paper (5.83:1).
    - Red-400 #F87171 on ink (6.59:1). SNX Red on ink is 4.84:1; on paper it is 3.39:1 (large type and graphics
      only).
  - Secondary: **Ink #0C1719**, with **Paper #F4F3EF** as its ground.
  - Tertiary: **Marigold #FBA62A** (warm) and **Lagoon #117780** (cool).
  - Brand accents are unchanged: Research #4A3AA7, Vibe #E2581F, Connect #0E8F63, Women #C2386F.
  - The X descriptor and every "red" in Book 3 now use SNX Red.
- **Brand journeys** (the website's data):
  - Research: Scholar → Founder
  - Vibe: Student → Founder
  - Connect: Professional → Founder · Startup → Scale
  - Women: Woman → Founder
  - StartNet X: One profile, first event to first funding
- **Typography as built** on the live site (startnet.in, Oct 2026):
  - Headlines: Inter at 400–500 weight, tracking −3% to −4.5%, with an Instrument Serif Italic accent on one English
    word.
  - Body: Inter 400 at 1.5 leading.
  - Labels: uppercase, letter-spaced 600 in print; on the web, "● dot labels".
  - Tamil: Noto Sans Tamil for text and Anek Tamil for display.
  - The logo is Inter at weight 750, −3.5% tracking, with the red full stop a perfect circle 0.2 em wide.
- **Unknowns:** where a fact is unknown (names, phone numbers, figures, partner logos), show a visible placeholder in
  square brackets, e.g. `[Name]`, `[figure · tag · as at date]`, `[to be supplied by StartNet]`. Mock-ups use
  placeholders, never made-up people or numbers.
- **The SNX One deck** (E:/Startnet/SNX.One.pdf) is an unconfirmed inspiration document. Use only its red. **Never**
  use its statistics, partners or claims. "SNX.One / SNXOne" is a retired name (Book 3 §2.5); in prose the platform is
  StartNet X, and the app mark is SNX.

## Real photos you may use

These are StartNet's own photos, already graded in the website's paper-ink tone. Paths are relative to the book root,
e.g. `../client/public/photos/pool/vibereal/05-1152.webp`. Use `<div class="photo"><img src="…"></div>` with a fixed
size.

| Path | Width | Caption to use |
|---|---|---|
| `pool/vibereal/05` | 1152 | StartNet Vibe at TNGSS 2025, Coimbatore |
| `pool/vibereal/08` | 1080 | StartNet Vibe at TNGSS 2025, Coimbatore |
| `pool/vibereal/02` | 800 | StartNet Vibe at TNGSS 2025, Coimbatore |
| `pool/stage/08` | 1280 | StartNet launch, July 2023 |
| `pool/stage/11` | 1280 | StartNet network meeting, September 2023 |
| `pool/stage/03` | 1280 | StartNet event, February 2024 |
| `event/saas-connect/2025` | 1220 | SaaS Connect 2025, PSG Convention Centre, Coimbatore |
| `event/saas-connect/2025-2` | 1220 | SaaS Connect 2025, PSG Convention Centre, Coimbatore |
| `event/vibathon/2025` | 572 | Vibathon 2025, K.S.R. College of Engineering, Tiruchengode |

The file name is `<key>-<width>.webp`; 800 px versions also exist as `.jpg`. Website screenshots are in
`assets/site-home-1440.jpg`, `assets/site-research-1440.jpg`, `assets/site-events-1440.jpg` and
`assets/site-vibe-375.jpg`.

## Quality bar

- **Minimal and consistent:** one idea per page, a clear hierarchy, aligned edges and hairline structure.
- **Colour use:** red appears as one point per page (the kicker dot counts as furniture). Never fill large paper areas
  with red, except on the colour pages.
- **Practical examples:** show the thing (a mock-up or a diagram built in HTML/CSS), not only describe it.
  Specifications go in `.spec` tables.
- **Copy:** British English, sentence case, plain and specific, no superlatives or exclamation marks.
- **Final check:** every page passes the build with no overflow, and you have looked at every PNG.
