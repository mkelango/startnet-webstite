# Frappe DocTypes for StartNet website forms

Every website form posts to `POST /api/forms/:type`. There are **8 form types**, so we need **8 DocTypes** (one table each).
Today, submissions go to `server/storage/submissions.jsonl`. The field rules are in `server/src/forms/form-rules.ts`.

| # | DocType | Form type | Used on (pages) |
|---|---------|-----------|-----------------|
| 1 | SN Contact | `contact` | Contact, Media Kit request |
| 2 | SN Partner Enquiry | `enquiry` | Partner enquiry, StartNet X audience pages |
| 3 | SN Newsletter | `newsletter` | Newsletter form (site-wide) |
| 4 | SN Interest | `interest` | Research, Vibe Clubs, Founders Day, event series, reports/indices/podcast notify, report download gate, self-diagnosis, developer API key |
| 5 | SN Nomination | `nomination` | Women Founders Summit & Awards |
| 6 | SN Host Event | `host` | Host an event, Events, District pages, Vibe for colleges |
| 7 | SN Speaker Mentor | `speak` | Speak / Mentor |
| 8 | SN Join | `join` | *No page uses this yet (Join sends people to StartNet X signup). Build it later if needed.* |

---

## Common fields (add to every DocType)

| Field | Type | Notes |
|-------|------|-------|
| submission_id | Data, unique | ID from the website (UUID) |
| received_at | Datetime | |
| page | Data | URL path the form was sent from |
| source | Data | e.g. `contact`, `events-host`, `report-gate` |
| brand | Data | research · vibe · women · x … |
| lang | Select | en / ta |
| consent_contact | Check | |
| consent_partner | Check | |
| consent_newsletter | Check | |
| consent_whatsapp_updates | Check | |
| consent_profile | Check | |
| consent_version | Data | currently `2026-10` |
| extra_data | JSON | any other context fields the page sends |
| status | Select | New / In progress / Closed (default New) |

Settings: naming `hash` or `format:{type}-{#####}`. Track changes on. Sort by `received_at` desc.

Field types used: **Email** = Data (Options: Email) · **Phone** = Data, 10 digits · **URL** = Data (Options: URL).

---

## 1. SN Contact
| Field | Type | Req | Max |
|-------|------|-----|-----|
| full_name | Data | ✓ | 120 |
| email | Email | ✓ | 254 |
| phone | Phone | | |
| organisation | Data | | 200 |
| topic | Data | | 80 |
| message | Long Text | ✓ | 5000 |
| requested_topic | Data | | |

## 2. SN Partner Enquiry
| Field | Type | Req | Max |
|-------|------|-----|-----|
| full_name | Data | ✓ | 120 |
| email | Email | ✓ | 254 |
| phone | Phone | | |
| organisation | Data | ✓ | 200 |
| role | Data | | |
| partner_type | Data | | 60 |
| topic | Data | | |
| interest | Small Text | | 500 |
| budget | Data | | 120 |
| timeline | Data | | 120 |
| district | Data | | 80 |
| message | Long Text | ✓ | 5000 |
| audience | Data | | StartNet X audience id |
| requested_type | Data | | |

## 3. SN Newsletter
| Field | Type | Req | Max |
|-------|------|-----|-----|
| email | Email | ✓ | 254 |
| full_name | Data | | 120 |
| phone | Phone | | required only if WhatsApp opt-in |
| district | Data | | 80 |
| language | Select | | en / ta |
| topics | Small Text | | comma list: ledger, vibe, connect, women, research |
| whatsapp_opt_in | Check | | |

Rule: one row per email. Update the existing row instead of making a duplicate.

## 4. SN Interest
| Field | Type | Req | Max |
|-------|------|-----|-----|
| full_name | Data | | 120 |
| email | Email | * | 254 |
| phone | Phone | * | |
| organisation | Data | | 200 |
| district | Data | | 80 |
| programme | Data | | 120 (e.g. `founders-day`, `report-download:<slug>`, `lab-<slug>`) |
| role | Data | | |
| interest | Data | | |
| purpose | Data | | |
| message | Long Text | | 5000 |

\* Email **or** phone is required.

## 5. SN Nomination
| Field | Type | Req | Max |
|-------|------|-----|-----|
| full_name | Data | ✓ | nominator |
| email | Email | ✓ | 254 |
| phone | Phone | | |
| nominee_name | Data | ✓ | 120 |
| nominee_company | Data | ✓ | 200 |
| category | Data | | 120 |
| district | Data | | 80 |
| reason | Long Text | | |
| message | Long Text | | 5000 |
| nominee_aware | Check | | |
| programme | Data | | women-founders-summit / women-founders-awards |

## 6. SN Host Event
| Field | Type | Req | Max |
|-------|------|-----|-----|
| full_name | Data | ✓ | 120 |
| email | Email | ✓ | 254 |
| phone | Phone | | |
| organisation | Data | | 200 (college / institution) |
| district | Data | | 80 |
| format | Data | | 120 |
| role | Data | | |
| message | Long Text | | 5000 |

## 7. SN Speaker Mentor
| Field | Type | Req | Max |
|-------|------|-----|-----|
| full_name | Data | ✓ | 120 |
| email | Email | ✓ | 254 |
| phone | Phone | | |
| organisation | Data | | 200 |
| role | Data | | speak / mentor |
| brand | Data | | which brand they want to support |
| topic | Small Text | | 300 |
| link | URL | | 300 (LinkedIn) |
| message | Long Text | | 5000 |

## 8. SN Join (later)
| Field | Type | Req | Max |
|-------|------|-----|-----|
| full_name | Data | ✓ | 120 |
| email | Email | * | 254 |
| phone | Phone | * | |
| district | Data | | 80 |
| persona | Data | | 60 |
| organisation | Data | | 200 |
| language | Select | | en / ta |
| under_18 | Check | | |
| guardian_phone | Phone | | required if under_18 |

\* Email **or** phone is required.

---

## Integration (live in code)
- How it works: the website checks the form as before and saves it to `server/storage/submissions.jsonl`. It then sends a copy to Frappe from the server, in the background (`server/src/forms/frappe.service.ts`).
  - Endpoint: `POST {FRAPPE_BASE_URL}/api/method/startnet.api.submit_form`, header `Authorization: token <key>:<secret>`. The secret never reaches the browser.
- Config (env vars):
  - `FRAPPE_BASE_URL`, `FRAPPE_API_KEY`, `FRAPPE_API_SECRET`.
  - Local runs: put them in `server/.env` (gitignored).
  - Live site: set them in Coolify.
  - If any one is missing, the sync is off.
- Form keys: contact→`contact` · enquiry→`partner` · newsletter→`newsletter` · join→`join` · interest→`interest` · nomination→`nomination` · host→`host_event` · speak→`speaker_mentor`.
- Field names change on the way: `name` → `full_name`, camelCase → snake_case, lists → comma text, consents → `consent_*` = 1.
  - The website's submission UUID is sent as `submission_id`, so a resend never makes a duplicate.
- If Frappe is down: the visitor still sees success. The error is logged as `[FrappeService]`, and the row stays in the `.jsonl` file so it can be resent.
