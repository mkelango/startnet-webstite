# mega/media-careers

Three P1 pages from Book 1 Part B §2.2. They are not routed yet: the integration step reads `routes.js`.

## Pages
| Path | File | Template | Data |
|---|---|---|---|
| `/media/kit` | `MediaKit.jsx` | T19 standard page: in-page nav aside (desktop) / collapsible (phone) | static (Book 2 §9, Book 3 §2, §3.2, §7.4–7.5, §8.2) |
| `/media/releases/:slug` | `PressRelease.jsx` | T09 article: centred measure, share row | `GET /api/press` (kind `release` only) |
| `/careers/:slug` | `JobDetail.jsx` | T09 article + sticky `KeyFacts` aside | `GET /api/careers` |

`shared.jsx/.css` holds page-local helpers (`Ph` bilingual placeholder mark, `CopyButton`, `ShareRow`, `fmtDate`, boilerplate EN + Tamil draft, press/careers emails).

## Content
- Media kit: Book 2 §9 boilerplate (verbatim) and usage microcopy; logo versions, lock-ups, clear space/min sizes, 10 don'ts (Book 3 §2.1–2.5); colour HEX/RGB (§3.2); naming table (§8.2); photo consent and AI rules (§7.4–7.5). Working client-side downloads: boilerplate TXT, colours JSON. Contact form: `SmartForm type="contact"` with hidden `topic: 'Media kit request'`.
- Release: optional CMS fields used when present: `summary|standfirst`, `city|dateline`, `body` (string[] or string, `[A]/[B]/[C]` and `[…]` marks via InlineMarks), `figures` (Metric[] → Stat), `quote {quote,name,role}`, `notes` (string[]), `pdfUrl`, `embargo`. Coverage items and unknown slugs render NotFound.
- Job: optional `outcome`, `about|description`, `responsibilities[]`, `requirements[]|lookingFor[]`, `niceToHave[]`, `applyBy`, `language`. Apply = `applyUrl` (http) or `mailto:careers@startnet.in?subject=Application: <title>`. Book 2 §10 hiring steps, working-here lines and commitments; equal-opportunity line; JobPosting JSON-LD.

## Placeholders
Media contact name and phone (the press email, `press@startnet.in`, is confirmed); master logo vector files; Pantone/press CMYK; photo library; all asset files and the ZIP (buttons disabled); Tamil boilerplate marked as a draft; release text when `body` is missing; role outcome, responsibilities and requirements when missing; POSH link; paid work sample `[confirm]`. Stats: Mission 1 Lakh 1,00,000 (C), 5-working-day image takedown target (C), 40% women target (C).

## Integration notes
- `press.json` and `careers.json` are both `[]`, so every `/media/releases/*` and `/careers/*` URL currently renders NotFound (server should 404 them too: slugs from `api:/api/press?kind=release` and `api:/api/careers`).
- `menu.replaces` is null for all three: nav.js has no entry pointing at a media-kit, release or role target today (only `/media` and `/careers` in the utility bar and footer).
- Register `media/kit` as a static route next to `media`. Nothing else under `media/` or `careers/` conflicts.
- `/media` (utility/Media.jsx) should link internal releases to `/media/releases/<slug>` and add a "Full media kit" link in its #media-kit section; `/careers` (utility/Careers.jsx) should link role titles to `/careers/<slug>`.
- Breadcrumbs: Home › Media › Media kit; Home › Media › <release title>; Home › Careers › <role title>.
- Add `/media/kit` to the sitemap and the footer "Media" column. Release and job URLs are data-driven.
