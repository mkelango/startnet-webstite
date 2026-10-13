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
`playableInEmbed: true`; the six added on 9 Oct 2026 were re-checked that day; the four added on 13 Oct 2026 were
checked that day). Captions use only the video's own listing (title, description, upload date),
`server/data/events.json` and the research notes in `docs/research/`; nobody is named from the footage alone.
Pre-event promos from the organiser's own channels were added on 13 Oct 2026 at StartNet's request (the NIRF promo
and the embeddable D2C Connect speaker Shorts the research lists). Each carries a "Promo" or "Pre-event Short" chip so
it never passes for event footage.

## On the site

| Video | Event | Channel | Length | Where |
|---|---|---|---|---|
| `hjdl0ChhIGY` | D2C Connect Summit & Expo 2024, Le Méridien Coimbatore, 30 Nov 2024 (aftermovie) | D2C Connect (StartNet) | 3:22 | D2C Connect series + 2024 edition, Connect D2C page, Home, past events |
| `iDsGfi83cJQ` | ClickPost session at D2C Connect 2024 | ClickPost (sponsor) | 5:41 | D2C Connect 2024 edition, Connect D2C page |
| `uN2vFxMIScg` | GenAI Connect Summit & Expo 2024, Radisson Salem, 27 Apr 2024 (coverage) | Iconxt Stories (media) | 23:12 | GenAI Connect series + 2024 edition, Connect GenAI page, past events |
| `-HXs7af5K1k` | StartNet launch event, July 2023 | startnet india (StartNet) | 1:52 | About → history |
| `hEgQYAesg9U` | M K Elango interview (not an event) | StartupTN | 2:16 | Leadership |
| `O8nBgNH2d9M` | NIRF Higher Ed Summit 2024, Salem edition (31 Aug 2024): official promo, uploaded 28 Aug 2024. Credit names the handle, `@startnetresearch on YouTube`: the channel (display name "StartNet Research") has an empty About section, so StartNet's ownership is strongly indicated but not stated (`docs/research/nirf-and-other-events.md` §1) | @startnetresearch (StartNet Research) | 0:43 | `/research` "Past event" block (by id); NIRF Higher Ed Summit series page and Salem edition (`series: 'nirf-higher-ed-summit'`, `edition: '2024-salem'`) |

### In `videos.js`, waiting for a page edit (see `docs/VIDEO-PLACEMENTS.md`)

| Video | Event | Channel | Length | Format | Place key / intended spot |
|---|---|---|---|---|---|
| `W8of-AARf14` | D2C Connect 2024: Juie (Team ClickPost) on returns, refund visibility and exchanges; part ClickPost card, part footage of the D2C ShePower panel on stage | ClickPost (sponsor) | 1:00 | 9:16 Short | `d2c-connect` / `2024` (3rd video of the edition; shows once the edition page passes `max={3}`) |
| `GaT8mPIl9oA` | StartNet monthly network meeting, Hotel Windsor Castle, 30 Sep 2023: testimonial, S. Velayutham (TamiraBot Advanced Engineering) | startnet india (StartNet) | 1:47 | 16:9 | `about-network` (About → history) |
| `LhxZNFtJiP4` | Same meeting: testimonial, A. K. Gowtham (Nutz) | startnet india (StartNet) | 1:44 | 16:9 | `about-network` |
| `ixvgMC3JO8Y` | Same meeting: testimonial, Sivanesh K S (MTech student). Three people on screen; only he is named | startnet india (StartNet) | 2:09 | 16:9 | `about-network` (3rd) |
| `WVlGpo4vUwk` | Same meeting: testimonial, K. Ilamurugu (La Choco Foods & Amusement Services); the listing's joke job title is left out | startnet india (StartNet) | 0:30 | 16:9 | `about-network` (spare, 4th) |
| `S44yEwSjd1E` | Unnamed StartNet startup event on ChatGPT for business (listing: "Business & Entrepreneurial Startup Event"), uploaded 26 Jul 2023; StartNet backdrop on stage. Title on YouTube is a raw file name; no venue, date or speaker given, so the caption names none | startnet india (StartNet) | 1:28 | 9:16 phone footage | `about-early-events` (low priority, optional) |
| `GMm4Z2hBVjE` | D2C Connect 2024 speaker announcement: Logesh Velusamy, Founder, ProfitStory.AI (uploaded 28 Nov 2024) | D2C Connect (StartNet) | 2:00 | 9:16 Short, chip "Pre-event Short" | `d2c-connect` / `2024`, 4th: shows only where a page asks for more than three |
| `045DJcqp_UU` | D2C Connect 2024 speaker announcement: Nivetha Muralidharan, Founder, Newgenmax (uploaded 28 Nov 2024) | D2C Connect (StartNet) | 1:28 | 9:16 Short, chip "Pre-event Short" | `d2c-connect` / `2024`, 5th |
| `2wgSBjcnKx4` | D2C Connect 2024 speaker announcement: Shadhik, founder of Reen Naturals (uploaded 27 Nov 2024). Posted by the **SNX India** channel (its only upload); events.json records D2C Connect 2024 as an SNX initiative | SNX India | 1:44 | 9:16 Short, chip "Pre-event Short" | `d2c-connect` / `2024`, 6th |

**Network meeting testimonials.** `GaT8mPIl9oA`, `LhxZNFtJiP4`, `ixvgMC3JO8Y`, `WVlGpo4vUwk` also carry `series: 'network-meetings'`, `edition: '2023-09'` (events.json `network-meetings-2023-09`), so they show on that series and edition page as well as About.

**Series key for the NIRF promo.** `series: 'nirf-higher-ed-summit'`, `edition: '2024-salem'` match the events record
`nirf-higher-ed-summit-2024-salem` (edition key = slug minus `<series>-`), so the film shows on that edition page and the
series page. `/research` finds it by id and does not depend on the key.

## Found but not used

- **SaaS Connect 2025:** all 25 uploads on @thesaasconnect are 5–10 second square promo and partner cards posted
  before the 22 Feb 2025 event (e.g. `_cVfJiUUb7c` countdown, `CGFxbue4fX4` ZautoAI, `Fe_oM2KFjUk` Increff,
  `GMpaGLDp5Vw` TealOrca, `grz_97gojNc` AssistNow, `Vlg7IRXPrNM` Clops AI, `9fxdfVG8zM8` Deecodes.io, `pUtKVICK6es`
  Titanium Tekzi, `AMmfrGmBoHA` Yaa Creations, `_xgvxvoDfhk` DigiNadu, `LXWcfxVQSnE` CandorBees, `y5hrMLvgWnU`
  PoultryCare, `rHcYqthwiLc` Startup TN, and the rest), plus `xNnM9xrwYbw` (Tamilar Startup). No footage of the event.
  The SaaS Connect pages keep their photos.
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
- **D2C Connect 2024 preview** `rNqzKb4CjxA` (TealOrca, 26 Nov 2024, 9:21; oEmbed 200, re-checked 13 Oct 2026): a
  pre-event explainer, and TealOrca's 2024 role is unresolved (10times lists TealOrca as organiser, events.json says
  SNX; `docs/research/CONFLICTS.md`). It can be added if StartNet confirms TealOrca as a 2024 partner.
- **Similar names, other events:** `qdsbFt6seVc` (GDG Vibathon, not StartNet's Vibathon 2025), `3WVGJ0ixe-c`
  (Upekkha VIBE Summit), `k_sPHeQQrzg` (general TNGSS 2025 recap with no StartNet Vibe footage).
- **Third-party promos** (ticket discount codes, community cards): left out.

## Gaps (StartNet to supply)

There is no public video of these (re-searched 13 Oct 2026, `docs/research/`):
- Vibathon 2025 (KSRCE). The @startnetvibe YouTube channel (created 7 May 2025) has no public videos;
- Vibe Coding Summit 2025 (Coimbatore, 14 Jun 2025): the official promo is an Instagram reel only
  (`instagram.com/reel/DKyjBQ_psJM`, @startnetvibe), not on YouTube;
- Vibe Marketing Summit 2025;
- StartNet Vibe at TNGSS 2025;
- SaaS Connect 2025 itself (the 25 SaaS.Connect uploads are 5–10 s pre-event cards);
- GenAI Connect 2024 beyond the single Iconxt Stories coverage film;
- NIRF Higher Ed Summit 2024 beyond the Salem promo (nothing from the Coimbatore edition);
- names for the Feb 2024 raw files and for the July 2023 ChatGPT session (`S44yEwSjd1E`).

If StartNet has highlight reels for them (Instagram or Facebook reels count), upload them to YouTube and add an entry
to `client/src/data/videos.js`. The page shows them automatically.

## Link hygiene found during the search

- `saasconnect.in` now serves a gambling page and `d2cconnect.in` no longer resolves. The site does not link to either
  (they appear only as research sources in `server/data`).
- The social handles in use (`@startnetindia` on LinkedIn, YouTube and X) are the working ones.
