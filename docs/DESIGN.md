> **Superseded in part (2026-10-09):** the v2 spec in [`DESIGN-v2.md`](./DESIGN-v2.md) (StartNet Brand Book v1.0 applied:
> SNX Red #EF4444, Ink #0C1719, Paper #F4F3EF, one red point per composition, one sheet rise per page, the v2 motion
> grammar) wins wherever the two disagree. Tokens now live only in `client/src/styles/tokens.css`; see the
> "Foundation API" section at the end of DESIGN-v2.md for the shared components, classes and props.

# StartNet UI: the AngelList-family design language (Oct 2026)

The site's look follows angellist.com, usvc.com and meridian.angellist.com: one design family made by AngelList.
Content, components and behaviour are unchanged; this document says how things should look. The global layer is
`client/src/styles/theme.css` (tokens + shell); page CSS builds on its tokens. Reference captures of the three sites
(1440 px) are kept in the session scratchpad and summarised here.

## 1. Principles

1. **Quiet confidence.** Few elements, lots of space, regular-weight type. Nothing shouts except one accent.
2. **Ink band, paper sheets.** The top of every page (header + hero) is a deep ink band. Content sits on off-white
   *sheets* with large rounded tops that slide over the band and over each other.
3. **One accent.** StartNet Red is used for the main conversion action and the full stop, the way AngelList uses
   lavender and USVC uses blue. Brand pages use their brand accent in the same sparing way.
4. **Editorial type.** Headlines are big, regular weight (400), tight tracking. One word may be set in the serif
   italic accent (the first word of hero headlines; `<em>` inside headings).
5. **Monochrome photography.** Every photo is graded "paper-ink" (near black-and-white, warm paper tint) and sits in
   a 12 px frame. Colour comes from the accent, not from photos.
6. **Same content.** Never change copy, data, links or order of information to achieve a look.

## 2. Tokens (theme.css)

| Token | Value | Use |
|---|---|---|
| `--night-0` | `#0C1719` | the ink band: header, heroes, footer, night bands |
| `--night-1` / `--night-2` | `#13211F` / `#1B2C2B` | raised surfaces and quiet buttons on ink |
| `--night-line` | `#263937` | hairlines on ink |
| `--night-text` / `-2` / `-muted` | `#F4F4F0` / `#C4CBC8` / `#95A09C` | text on ink |
| `--sheet` | `#F4F3EF` | default content sheet (`--color-bg`) |
| `--sheet-2` | `#EBEAE5` | page base under sheets, quiet fills (`--color-bg-sunken`) |
| card surface | `#FBFAF7` | cards, white sections |
| `--color-border` | `#DEDCD5` | hairlines on sheets |
| `--sheet-radius` | 40 px (24 px < 768) | rounded top of a sheet |
| `--media-radius` | 12 px | photos, video, cards |
| `--btn-radius` | 4 px | buttons, chips, labels |
| `--font-display` / `--font-sans` | Inter | everything |
| `--font-accent` | Instrument Serif italic | the accent word only |

## 3. Patterns

- **Dot label** (replaces uppercase eyebrows): `● Section name`, 16 px regular, the dot in the accent colour.
  Use the existing `.eyebrow` class; theme.css restyles it.
- **Section header:** dot label → big regular headline (`.h2` ≈ 40–60 px) → grey lede (`--color-text-2`), left aligned;
  generous space above (one `--space-section`).
- **Feature row:** text left (dot label, title, lede, 1–2 buttons) and a media frame right (12 px radius), on a sheet.
  Alternate sides only when it helps rhythm.
- **Cards:** flat `#FBFAF7` surface, 1 px hairline, 12 px radius, no resting shadow; hover = border darkens + 2 px lift +
  soft shadow. Titles 500 weight. Brand marker = a small accent dot, not a coloured top bar.
- **Numbers:** big light numerals (`font-weight: 300`), label beneath, columns separated by 1 px vertical lines.
- **Lists / FAQs:** full-width hairline rows; question in regular weight; thin plus that turns into ×.
- **Buttons:** 4 px radius, regular/450 weight. Primary = ink on sheets / paper on ink. Secondary = quiet fill, no
  outline. Tertiary = text link with arrow.
- **Navigation:** centred pill group on the ink header; current item gets a subtle filled pill.
- **Footer:** ink, link columns, giant "StartNet." wordmark.
- **Video:** event videos play in a 12 px frame with a large round play button over the paper-ink poster; they load
  only when played (privacy-enhanced YouTube).

## 4. Decisions taken during the restyle (Oct 2026)

- **Colour of links and buttons:** text links (tertiary buttons) are ink, and red is kept for conversion: "Join StartNet", the
  main call to action and the full stop. Brand pages use their brand accent for links. Selected filters and toggles
  are ink, not brand colour.
- **Page tops:** every page top is ink (header + hero + brand sub-nav + phone menu). A page has at most one further night band, and
  a night band never sits directly above the ink footer. Closing call-to-action bands are paper sheets.
- **Headings:** h2 / `.h3` 400, small headings (h3–h6 elements, `.h4`, `.h5`) 500, numerals 300.
- **The full stop:** next to headings under 24 px it is one step darker (`--sn-red-700`) so it keeps 4.5:1.
- **Brand-page helpers:** `pages/brands/brandPage.css` (`.bp-facts`, `.brand-close`, `.bp-crumbs`).
- **Home:** PersonaSelector `variant="list"`.
- **Video:** `components/VideoFeature.jsx` (`VideoFeature`, `EventVideos`) with data in `data/videos.js`. A cinema-letterboxed
  poster is cropped with `posterZoom`. Sources are in docs/VIDEOS.md.

## 5. Quality bar (unchanged rules)

- WCAG AA contrast (4.5:1 text, 3:1 large text / UI), visible focus rings, one `<h1>` per page, keyboard access.
- Motion only via transform / opacity; nothing under reduced motion. No layout shift.
- 375 / 768 / 1024 / 1440 px must all look intentional; no horizontal scroll at 320 px.
- Tamil (`/ta`) uses the same layout; Tamil text never uses the serif italic (no Tamil glyphs).
