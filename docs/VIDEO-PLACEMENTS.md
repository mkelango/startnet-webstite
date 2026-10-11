# Video placements for the integrator

The six videos added to `client/src/data/videos.js` on 9 October 2026 are verified and ready to use (sources and checks
are in `docs/VIDEOS.md`). None of them shows on a page yet: each needs a small edit in a page file, listed below. The
component side is done, so nothing else needs to change.

Nothing here loads YouTube before a press. `EventVideos` renders the posters (`i.ytimg.com`) and captions as plain
markup, so the prerender carries them, and it renders nothing when its list is empty.

## Component API (all backward compatible)

`client/src/components/VideoFeature.jsx`:

- `<EventVideos series? edition? videos? max={2} headingLevel={2} title? eyebrow? className? layout="auto" playlistLabel? />`
  - `layout`: `'auto'` (default) shows a grid for 1–2 videos and the playlist for 3 or more; `'grid'`; `'playlist'`
    (one large stage plus a thumbnail rail, from 2 videos up). The existing calls (max 2) render as before.
  - `playlistLabel`: the accessible name of the thumbnail rail. It defaults to `title`.
- `<VideoFeature video variant="card|stage" priority? autoPlay? onPlay? caption? />`: a single video. A video with
  `aspect: '9:16'` gets a portrait frame; `variant="stage"` keeps a 16:9 box and centres a vertical video on a
  blurred copy of its poster.
- `<VideoPlaylist videos label? />`: the playlist on its own, without a section heading.
- `data/videos.js` adds `videoById(id)`. It already has `videosFor(series, edition)`, `videosForPlace(place)` and
  `featuredVideos()`.

The playlist is keyboard accessible as ARIA tabs: arrow keys and Home/End move along the rail, and Enter or Space
selects. Selecting a thumbnail swaps the stage. If the visitor already pressed play, the next video starts too;
otherwise only the poster changes.

---

## 1. /about, section `#history`: the September 2023 network meeting (priority: high)

- **File:** `client/src/pages/about/About.jsx`, inside `<Section id="history">`, directly after the existing
  `<EventVideos videos={videosForPlace('about-history')} … className="about-history__film" />` (about line 412).
- **Videos (place `about-network`):** `GaT8mPIl9oA` S. Velayutham, `LhxZNFtJiP4` A. K. Gowtham, `ixvgMC3JO8Y`
  Sivanesh K S, and `WVlGpo4vUwk` K. Ilamurugu (a 30-second spare, 4th). All four are on StartNet's own channel and
  were filmed at Hotel Windsor Castle on 30 September 2023.
- **Call:**

```jsx
{/* StartNet monthly network meeting, 30 Sep 2023: testimonials (data/videos.js 'about-network', docs/VIDEOS.md) */}
<EventVideos
  videos={videosForPlace('about-network')}
  max={3}
  layout="playlist"
  headingLevel={3}
  eyebrow={t('From the network meetings', 'நெட்வொர்க் சந்திப்புகளிலிருந்து')}
  title={t('September 2023, Hotel Windsor Castle', 'செப்டம்பர் 2023, Hotel Windsor Castle')}
  playlistLabel={t('Testimonials from the September 2023 network meeting', 'செப்டம்பர் 2023 நெட்வொர்க் சந்திப்பின் அனுபவப் பகிர்வுகள்')}
  className="about-history__film about-history__network"
/>
```

- **Notes:** `videosForPlace` is already imported in About.jsx. Use `max={4}` to include the 30-second spare. For a
  plain 2-up grid, use `max={2}` with no `layout`. The section's existing gap spacing applies. If the next block
  needs more room, add `.about-history__network { margin-top: var(--space-12); }` to the About page CSS.

## 2. /about, section `#history`: July 2023 ChatGPT-for-business session (priority: low, optional)

- **Video (place `about-early-events`):** `S44yEwSjd1E`, 1:28, vertical phone footage in front of the StartNet
  backdrop. The YouTube title is a raw file name. The description says only "Business & Entrepreneurial Startup Event"
  on using ChatGPT for startup businesses, so the caption names no venue, date or speaker. "July 2023" is the upload
  month.
- **Option A (recommended):** show it next to the launch film as a pair. Change the existing call to:

```jsx
<EventVideos
  videos={[...videosForPlace('about-history'), ...videosForPlace('about-early-events')]}
  max={2}
  layout="playlist"
  headingLevel={3}
  eyebrow={t('Where it started', 'தொடங்கிய இடம்')}
  title={t('The first rooms, July 2023', 'முதல் அரங்குகள், ஜூலை 2023')}
  className="about-history__film"
/>
```

  The playlist keeps the 16:9 stage, and the vertical video sits centred on a blurred poster when it is selected.
- **Option B:** leave it out until StartNet names the event and the speaker. Then update `title` and `caption` in
  videos.js.

## 3. /events/d2c-connect/2024, Overview tab: ClickPost sponsor Short (priority: medium)

- **File:** `client/src/pages/mega/events-series/EditionPage.jsx`, in the "Films of this edition" block (about line
  677).
- **Video:** `W8of-AARf14`, 1:00, 9:16. It is already tagged `series: 'd2c-connect', edition: '2024'`, so it is the
  third video for that edition and is hidden only by the default `max={2}`.
- **Call:** replace `<EventVideos series={e.series} edition={base.split('/').pop()} />` with

```jsx
<EventVideos series={e.series} edition={base.split('/').pop()} max={3} />
```

  `layout="auto"` turns 3 videos into the playlist: the aftermovie on the stage, with the ClickPost session and the
  Short in the rail. No other edition has more than 2 videos today, so this changes only D2C Connect 2024.
- **Do not** add it to Home, the series page (`SeriesPage.jsx`) or the Connect D2C page (`ConnectSub.jsx`). Those keep
  the default `max={2}`, which keeps their current pair.

## 4. Not placed (needs StartNet first)

- `Qfoy5J8-iWA` (founder keynote at the LocalKart launch) could go on `/about/leadership` after the StartupTN
  interview, with the caption "Keynote at the LocalKart product launch · September 2023", but only if StartNet
  approves. It is not in videos.js.
- `tAbBIAYK_rs` (Feb 2024 "Fireside Chat" raw file) could go on `/about/leadership` once StartNet supplies a title
  and the speaker names.
