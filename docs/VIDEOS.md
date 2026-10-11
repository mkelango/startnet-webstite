# Event videos

Event videos are embedded from YouTube, never downloaded or re-hosted. `client/src/components/VideoFeature.jsx` shows
the paper-ink poster (from `i.ytimg.com`) with a round play button; the privacy-enhanced player
(`youtube-nocookie.com`) loads only when the visitor presses play. Nothing autoplays. Vertical Shorts and phone
footage use `aspect: '9:16'` (a portrait frame, or centred on a blurred poster inside the 16:9 playlist stage), and
`<EventVideos layout="playlist">` (or 3+ videos with the default `layout="auto"`) shows one large video plus a rail of
thumbnails. Placements for videos not yet on a page are in `docs/VIDEO-PLACEMENTS.md`. The production CSP in `server/src/main.ts` allows
exactly these two hosts. The list lives in `client/src/data/videos.js`.

Rule: a video goes on a page only if it shows that event (or the founder), comes from StartNet or from a sponsor /
media partner of that event, and is embeddable. Every video was checked in October 2026 (oEmbed 200,
`playableInEmbed: true`; the six added on 9 Oct 2026 were re-checked that day). Captions use only the video's own
listing (title, description, upload date) and `server/data/events.json`; nobody is named from the footage alone.

## On the site

| Video | Event | Channel | Length | Where |
|---|---|---|---|---|
| `hjdl0ChhIGY` | D2C Connect Summit & Expo 2024, Le Méridien Coimbatore, 30 Nov 2024 (aftermovie) | D2C Connect (StartNet) | 3:22 | D2C Connect series + 2024 edition, Connect D2C page, Home, past events |
| `iDsGfi83cJQ` | ClickPost session at D2C Connect 2024 | ClickPost (sponsor) | 5:41 | D2C Connect 2024 edition, Connect D2C page |
| `uN2vFxMIScg` | GenAI Connect Summit & Expo 2024, Radisson Salem, 27 Apr 2024 (coverage) | Iconxt Stories (media) | 23:12 | GenAI Connect series + 2024 edition, Connect GenAI page, past events |
| `-HXs7af5K1k` | StartNet launch event, July 2023 | startnet india (StartNet) | 1:52 | About → history |
| `hEgQYAesg9U` | M K Elango interview (not an event) | StartupTN | 2:16 | Leadership |

### In `videos.js`, waiting for a page edit (see `docs/VIDEO-PLACEMENTS.md`)

| Video | Event | Channel | Length | Format | Place key / intended spot |
|---|---|---|---|---|---|
| `W8of-AARf14` | D2C Connect 2024: Juie (Team ClickPost) on returns, refund visibility and exchanges; part ClickPost card, part footage of the D2C ShePower panel on stage | ClickPost (sponsor) | 1:00 | 9:16 Short | `d2c-connect` / `2024` (3rd video of the edition; shows once the edition page passes `max={3}`) |
| `GaT8mPIl9oA` | StartNet monthly network meeting, Hotel Windsor Castle, 30 Sep 2023: testimonial, S. Velayutham (TamiraBot Advanced Engineering) | startnet india (StartNet) | 1:47 | 16:9 | `about-network` (About → history) |
| `LhxZNFtJiP4` | Same meeting: testimonial, A. K. Gowtham (Nutz) | startnet india (StartNet) | 1:44 | 16:9 | `about-network` |
| `ixvgMC3JO8Y` | Same meeting: testimonial, Sivanesh K S (MTech student). Three people on screen; only he is named | startnet india (StartNet) | 2:09 | 16:9 | `about-network` (3rd) |
| `WVlGpo4vUwk` | Same meeting: testimonial, K. Ilamurugu (La Choco Foods & Amusement Services); the listing's joke job title is left out | startnet india (StartNet) | 0:30 | 16:9 | `about-network` (spare, 4th) |
| `S44yEwSjd1E` | Unnamed StartNet startup event on ChatGPT for business (listing: "Business & Entrepreneurial Startup Event"), uploaded 26 Jul 2023; StartNet backdrop on stage. Title on YouTube is a raw file name; no venue, date or speaker given, so the caption names none | startnet india (StartNet) | 1:28 | 9:16 phone footage | `about-early-events` (low priority, optional) |

## Found but not used

- **SaaS Connect 2025:** all 25 uploads on @thesaasconnect are 5–10 second square promo and partner cards posted
  before the 22 Feb 2025 event (e.g. `_cVfJiUUb7c` countdown, `CGFxbue4fX4` ZautoAI, `Fe_oM2KFjUk` Increff,
  `GMpaGLDp5Vw` TealOrca, `grz_97gojNc` AssistNow, `Vlg7IRXPrNM` Clops AI, `9fxdfVG8zM8` Deecodes.io, `pUtKVICK6es`
  Titanium Tekzi, `AMmfrGmBoHA` Yaa Creations, `_xgvxvoDfhk` DigiNadu, `LXWcfxVQSnE` CandorBees, `y5hrMLvgWnU`
  PoultryCare, `rHcYqthwiLc` Startup TN, and the rest), plus `xNnM9xrwYbw` (Tamilar Startup). No footage of the event.
  The SaaS Connect pages keep their photos.
- **D2C Connect 2024 speaker Shorts** (`GMm4Z2hBVjE`, `045DJcqp_UU`, `2wgSBjcnKx4`): pre-event announcements in a
  vertical format.
- **Feb 2024 sessions at CJ Pallazzio, Salem**: raw camera files with empty descriptions and no event or speaker
  names: `tAbBIAYK_rs` (C0026, a "Fireside Chat" stage, probably with the founder), `AJOV7DmrbhY` (C0036),
  `Umv_3Cky3M4` (C0014), `afSl-MEXRGM` (C0019 1), `1z3239l1zWY` (C0016), `S1M2yhwfHe0` (C0018), `ZXAR4ahImbU` (C0028).
  They need a title or caption from StartNet first; `tAbBIAYK_rs` would suit Leadership once named.
- **StartNet brand promo** `apy6HMamN6c` ("Igniting Startup Success…", Jun 2023): stock imagery, no event. Stock
  footage is not allowed.
- **Startup-story Shorts** on @startnetindia (`bkXnwkHyUuY` Zivame, `yxsH9IM_gno` Lenskart, `Bj1Za7mly-I` Zomato,
  Jul 2024): explainers about other companies; no StartNet event or founder.
- **LocalKart product launch keynote** `Qfoy5J8-iWA` (M K Elango, Sep 2023, @localkart6950): shows the founder, but
  it is published by the launch's host, not StartNet or a partner. Needs StartNet's OK; it could then go on Leadership
  as "Keynote at the LocalKart product launch · September 2023".
- **D2C Connect 2024 preview** `rNqzKb4CjxA` (TealOrca, 26 Nov 2024): a pre-event explainer, and TealOrca is not a
  confirmed D2C Connect 2024 partner.
- **NIRF Higher Ed Summit 2024 promo** (`O8nBgNH2d9M`, @startnetresearch): it isn't confirmed that this channel is
  StartNet's.
- **Similar names, other events:** `qdsbFt6seVc` (GDG Vibathon, not StartNet's Vibathon 2025), `3WVGJ0ixe-c`
  (Upekkha VIBE Summit), `k_sPHeQQrzg` (general TNGSS 2025 recap with no StartNet Vibe footage).
- **Third-party promos** (ticket discount codes, community cards): left out.

## Gaps (StartNet to supply)

There is no public video of these:
- Vibathon 2025 (KSRCE);
- Vibe Marketing Summit 2025;
- StartNet Vibe at TNGSS 2025;
- SaaS Connect 2025 itself;
- GenAI Connect 2024 beyond the single Iconxt Stories coverage film;
- names for the Feb 2024 raw files and for the July 2023 ChatGPT session (`S44yEwSjd1E`).

If StartNet has highlight reels for them (Instagram or Facebook reels count), upload them to YouTube and add an entry
to `client/src/data/videos.js`. The page shows them automatically.

## Link hygiene found during the search

- `saasconnect.in` now serves a gambling page and `d2cconnect.in` no longer resolves. The site does not link to either
  (they appear only as research sources in `server/data`).
- The social handles in use (`@startnetindia` on LinkedIn, YouTube and X) are the working ones.
