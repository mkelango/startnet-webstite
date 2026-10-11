# Photos: shot list and how to add them

Every image slot on the site shows a photograph. Each slot uses the first of these that exists:

1. **StartNet's own photo** for that slot (`hero/…`, `event/…`, `story/…`, `person/…`; see the shot list below).
2. **A curated pick** for the most visible slots: the home, brand and section heroes, and the brand tiles
   (`HERO_PICKS` / `TILE_PICKS` in `client/src/data/photos.js`).
3. **The themed library** (`photos/originals/pool/<theme>/`), 64 licensed editorial photos. A slot draws from the
   theme that fits it: its brand (Research → labs, Vibe → students, Connect → professionals, Women → women
   founders, StartNet X → platform), otherwise its page section (events, insights, partner, districts → places of
   Tamil Nadu…). The choice is fixed per slot, so a page always shows the same photo.
4. **The generative pulli art**, kept on purpose for people without their own consented portrait, for past events
   and story recaps (a stock photo must never pass for a real StartNet person or event), and as the fallback if a
   file fails to load.

**Event pages are strict.** A page or card about one event (an edition, a series, the Vibathon and summit pages,
the SaaS / D2C / GenAI Connect pages) shows only photographs of that event, and keeps the art when there are none.
Each event can hold a gallery: `event/<series>/<edition>.jpg`, then `-2`, `-3` … (for example
`event/saas-connect/2025-3.jpg`). With two or more, the page shows a "From the room" gallery, and tall posters use the
sharpest photo of the edition. A `"crop": [x, y, width, height]` in the .json removes a publisher's frame.

Still needed from StartNet's photographer: D2C.Connect 2024 (the old gallery files were named like `1U7A7398.jpg`,
`3U1A2726.jpg`, `SKP09111.jpg`, `STUS6696.jpg`), GenAI.Connect 2024, more Vibathon 2025, and the Vibe Marketing
Summit 2025. Drop them into `photos/originals/event/<series>/<year>.jpg` (+ `-2`, `-3` …) and run `npm run photos`.

All photos are listed with their owners and sources in [PHOTO_CREDITS.md](PHOTO_CREDITS.md). Library photos are a
stand-in for non-event sections: replace them with StartNet's own photos slot by slot.

**No invented people.** Portraits are only shown for real people listed in `server/data/people.json`, and only with
`"consent": true`. Photos of identifiable people at events also need consent under StartNet's photo policy.
No AI-generated or stock photo may stand in for a real team member, speaker, founder or partner.

## How to add a photo (no code changes)

1. Save the original (JPEG, PNG or WebP, **2000 px or wider**, no text or logos burned in) as
   `photos/originals/<slot key>.jpg`, using the keys in the table below.
2. Optionally, add a file next to it with the same name and `.json`:
   ```json
   {
     "alt": "Students building an app together at Vibathon 2025 in Madurai",
     "altTa": "…",
     "caption": "Vibathon 2025, Madurai",
     "captionTa": "…",
     "focus": "50% 35%",
     "focusMobile": "60% 30%",
     "credit": "Photo: StartNet",
     "consent": true
   }
   ```
   - `alt` describes the photo for screen readers and search. Leave it out only for purely decorative images.
   - `focus` / `focusMobile` say where the subject is, as horizontal and vertical percentages. Faces stay in frame
     when the slot crops: 4:5 on desktop heroes, 16:9 bands on phones, 16:9 and 3:2 cards.
3. Run `npm run photos`, then `npm run build`.
   - `npm run photos` makes 480 / 800 / 1200 / 1600 px WebP + JPEG copies in `client/public/photos/` and
     updates `client/src/data/photos.manifest.json`.
   - `npm run build` rebuilds the site and its crawlable pages.
   - The site serves the right size for each screen, loads below-the-fold photos lazily and reserves the space so
     nothing jumps.

## Shot list

| Slot key | Where it shows | Shape it is cropped to | What to shoot |
|---|---|---|---|
| `hero/home` | Home page hero | 4:5 desktop, 16:9 phone | Students, researchers, professionals and women founders building together in a real Tamil Nadu setting (campus, lab, workspace). Natural light, warm tones, people not posing for the camera |
| `hero/research` | StartNet Research home | 4:5 desktop, 3:2 / 16:9 smaller | A scholar or faculty member at work in a lab, with a prototype or experiment |
| `hero/vibe` | StartNet Vibe home | as above | College students coding together at a build night |
| `hero/connect` | StartNet Connect home | as above | Professionals in a small, candid founder-circle discussion |
| `hero/women` | StartNet Women home | as above | Women founders at work or in a Circle meeting |
| `hero/<page path>` | Any brand sub-page hero, e.g. `hero/vibe/academy`, `hero/women/rise-academy` | as above | Only if there's a strong photo of that programme. Otherwise the art stays |
| `event/vibathon/2025` | Vibathon page hero, the Vibathon 2025 edition page, its event cards | 4:5, 16:9 cards, 220 px band on tablets | The captioned **Vibathon 2025 team photo** the page already asks for |
| `event/<series>` | Every edition of that series without its own photo: `vibathon`, `vibe-campus`, `genai-connect`, `saas-connect`, `d2c-connect`, `lab-to-market-summit`, `women-founders-summit`, `vibe-summit`, `investors-summit` | 16:9 cards, 4:5 posters | A typical moment from that series: stage, room, teams |
| `event/<series>/<edition>` | One edition, e.g. `event/genai-connect/2027` (after it happens) | as above | That edition's best wide shot |
| `story/vibathon-2025-recap`, `story/five-years-of-rooms` | Story cards and story pages | 3:2 | One strong photo per story |
| `story/<slug>` | Future founder stories | 3:2 | The founder at work (with written consent) |
| `person/m-k-elango`, `person/v-nagaraj`, `person/poonthamil` | Leadership cards | 1:1 | Professional portrait, plain background, head and shoulders, centred. `"consent": true` required |
| `person/<slug>` | Brand leads, advisory members, speakers (once named in `people.json`) | 1:1 | Same portrait style for everyone, so the grid looks consistent |

Kept as art by design: the Tamil Nadu map, the founder ladder, the network diagrams, brand tiles, report and index
covers, and the mega-menu decoration.

## Photo style (to keep the site consistent)

- Real StartNet moments in Tamil Nadu: campuses, labs, workspaces, district events.
- Natural light, warm neutral tones, calm composition, room around the subject for cropping.
- Candid people rather than posed handshakes. Ask before photographing anyone who could be identified.
- No text, logos, heavy filters, neon or cyber looks. Avoid photos where the only subject sits at the very edge.
- Landscape originals work best for heroes and cards. Mark the subject with `focus` so 4:5 and 16:9 crops both work.

## Grade and placement (since the October 2026 restyle)

- **One grade for every photo.** Every photo gets the "paper-ink" grade (`INK` in `tools/images/photos.mjs`: near
  black-and-white with a warm paper tint), so photos sit with the ink and paper palette of the AngelList-family
  design (docs/DESIGN.md). Send originals in full colour: the pipeline grades them. A sidecar `"grade": "none"` keeps
  a photo in colour. Video posters use the same grade in CSS (`components/VideoFeature.css`).
- **No repeats on a page.**
  - An event card shows its event's own photo.
  - Otherwise it shows one of the series' photos that isn't already on the page (`photoPool`, `claimPoolPhoto` in
    `data/photos.js`).
  - After that comes a library photo, except on event pages, where the card keeps the brand art.
  - Slots with a fixed photo record it while rendering (`hintFixedPhoto`), so other slots on the page leave it alone.
  - `EventGallery` takes `exclude` (e.g. the edition poster).
- **Event videos** are embedded from YouTube rather than stored here: see docs/VIDEOS.md.
