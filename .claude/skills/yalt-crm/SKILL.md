---
name: yalt-crm
description: Interact with the Yalt Sales CRM API to manage leads, activities, logs, emails, routes, statistics, and team data. Use this skill whenever the user wants to query, create, update, or delete data in the Yalt CRM — including leads, contacts, notes, call/visit/meeting logs, email sequences, route planning, or team statistics. Trigger even for casual requests like "show me my leads", "add a call log", "send an email to this lead", "generate a route for today", or "check team stats".
---

# Yalt Sales CRM Skill

## Overview

This skill provides full access to the Yalt Sales CRM API, a Supabase Edge Function-based API for managing B2B sales operations: leads, contacts, activity tracking, email outreach, route planning, and statistics.

**Base URL:** `https://portal.sales-crm.yalt.co/functions/v1`

## Authentication

Every request requires a single header:

```
x-api-key: <yalt_api_key>
```

The API key is generated from the CRM dashboard and has the format `yalt_<hex>`. No organization ID or Bearer token is needed — the key is scoped to the organization automatically.

**Ask the user for their API key if not already provided.** Do not guess or invent tokens.

---

## Endpoint Reference

See `references/endpoints.md` for the full endpoint map. Below is a quick summary by domain.

### System
| Method | Path | Description |
|--------|------|-------------|
| GET | `/v1/health` | Health check (no auth required) |

### Organizations
| Method | Path | Description |
|--------|------|-------------|
| POST | `/v1/api/organizations` | Create organization |
| PUT | `/v1/api/organizations/{id}` | Update organization |
| GET | `/v1/api/organizations/my` | List current user's organizations |
| POST | `/v1/api/organizations/switch` | Switch active organization |

### Leads (core entity)
| Method | Path | Description |
|--------|------|-------------|
| GET | `/v1/api/leads` | List leads (supports filters: `status`, `priority`, `assignedTo`, `scope=mine`, `search`, `sort`, `limit`, `offset`) |
| POST | `/v1/api/leads` | Create lead |
| POST | `/v1/api/leads/bulk` | Bulk create leads (max 10 000) |
| GET | `/v1/api/leads/search` | Full-text search (`?q=`) |
| GET | `/v1/api/leads/match-by-context` | Match by `?website=` or `?linkedin=` |
| POST | `/v1/api/leads/assign-batch` | Assign unassigned leads to a user |
| POST | `/v1/api/leads/merge` | Merge two leads (`sourceId` + `targetId`) |
| GET | `/v1/api/leads/{id}` | Get single lead |
| PUT | `/v1/api/leads/{id}` | Update lead |
| DELETE | `/v1/api/leads/{id}` | Delete lead |
| GET | `/v1/api/leads/{id}/audit-log` | Get lead audit history |

**LeadInput schema** (required: `businessName`):
```json
{
  "businessName": "string",
  "description": "string",
  "contactPerson": "string",
  "phone": "string",
  "email": "email",
  "address": "string",
  "city": "string",
  "country": "string",
  "source": "string",
  "status": "string",
  "priority": "low|medium|high",
  "assignedTo": "uuid|null",
  "tags": ["string"],
  "lat": 0.0,
  "lng": 0.0,
  "nextFollowUp": "date",
  "isChain": false,
  "parentLeadId": "uuid|null",
  "salesData": {},
  "chainInfo": {}
}
```

### Logs (call / visit / meeting)
| Method | Path | Description |
|--------|------|-------------|
| GET | `/v1/api/logs/{table}` | List logs. `{table}` = `call_logs`, `visit_logs`, or `meeting_logs`. Optional `?leadId=` filter |
| POST | `/v1/api/logs/{table}` | Create log entry |

### Activities
| Method | Path | Description |
|--------|------|-------------|
| GET | `/v1/api/activities` | List all activities |
| POST | `/v1/api/activities` | Create activity |
| GET | `/v1/api/activities/lead/{leadId}` | Activities for a specific lead |

### Generic Resources (notes, call_logs, visit_logs, meeting_logs, lead_contacts, lead_files)

These share a common CRUD pattern:
- `GET /v1/api/{resource}` — supports `limit`, `order` (e.g. `created_at.desc`), `select`
- `POST /v1/api/{resource}` — create record
- `PUT /v1/api/{resource}/{id}` — update record
- `DELETE /v1/api/{resource}/{id}` — delete record

Resources: `notes`, `call_logs`, `visit_logs`, `meeting_logs`, `lead_contacts`, `lead_files`

### Enrichment
| Method | Path | Description |
|--------|------|-------------|
| POST | `/v1/api/lead_contacts/{id}/enrich-kaspr` | Enrich contact via Kaspr |
| POST | `/v1/api/lead_contacts/{id}/enrich-lusha` | Enrich contact via Lusha |

### Statistics
| Method | Path | Description |
|--------|------|-------------|
| GET | `/v1/api/stats/leads` | Lead stats for the org |
| GET | `/v1/api/stats/team` | Team performance stats |
| GET | `/v1/api/stats/objectives/rep/{userId}` | Objectives for a sales rep |
| GET | `/v1/api/stats/objectives/team` | Team-wide objectives |
| PUT | `/v1/api/objectives/{userId}` | Upsert weekly objective |

### Team
| Method | Path | Description |
|--------|------|-------------|
| GET | `/v1/api/team` | List team members |
| PUT | `/v1/api/profile` | Update current user profile |
| POST | `/v1/api/invites` | Invite users to organization |

### Email
| Method | Path | Description |
|--------|------|-------------|
| POST | `/v1/api/emails/send` | Send email immediately |
| POST | `/v1/api/emails/schedule` | Schedule email |
| GET | `/v1/api/emails` | List emails |
| GET | `/v1/api/emails/threads/{leadId}` | Email thread for a lead |
| GET/POST | `/v1/api/emails/templates` | List / create email templates |
| PUT/DELETE | `/v1/api/emails/templates/{id}` | Update / delete template |
| GET/POST | `/v1/api/emails/signatures` | List / create signatures |
| PUT/DELETE | `/v1/api/emails/signatures/{id}` | Update / delete signature |
| GET/DELETE | `/v1/api/emails/settings/gmail` | Get / disconnect user Gmail |
| GET | `/v1/api/emails/settings/gmail/aliases` | List Gmail aliases |
| GET/DELETE | `/v1/api/emails/settings/gmail/org` | Org Gmail settings |
| POST | `/v1/api/emails/settings/gmail/oauth` | Save Gmail OAuth credentials |

**EmailInput schema** (required: `to`, `subject`, `bodyHtml`):
```json
{
  "leadId": "uuid",
  "to": "string",
  "cc": "string",
  "bcc": "string",
  "subject": "string",
  "bodyHtml": "string",
  "bodyText": "string",
  "scheduledAt": "datetime",
  "trackingEnabled": true,
  "signatureId": "uuid",
  "attachments": []
}
```

### Routes (field sales planning)
| Method | Path | Description |
|--------|------|-------------|
| POST | `/v1/routes/generate` | Generate daily route (calls or visits) |
| GET | `/v1/routes/{date}/{userId}` | Get a generated route |

**Route generation body:**
```json
{
  "userId": "uuid",
  "date": "YYYY-MM-DD",
  "routeType": "visits|calls",
  "maxLeads": 8,
  "startLocation": { "lat": 0.0, "lng": 0.0 }
}
```

### Webhooks
| Method | Path | Description |
|--------|------|-------------|
| GET/POST | `/v1/api/webhook-configs` | List / create webhook configs |
| GET/PUT/DELETE | `/v1/api/webhook-configs/{id}` | Manage a webhook config |
| POST | `/v1/api/webhooks/leads/{webhookId}` | Incoming leads webhook (no auth, uses `X-Webhook-Secret`) |

### Imports
| Method | Path | Description |
|--------|------|-------------|
| POST | `/v1/api/scrapper/import` | Import scraper chains & locations |

### Storage
| Method | Path | Description |
|--------|------|-------------|
| POST | `/v1/api/storage/upload` | Upload file (multipart/form-data) |
| POST | `/v1/api/storage/signed-url` | Get signed URL for a file |

---

## How to Make Requests

Always use `bash_tool` or inline code in artifacts. Example pattern:

```bash
curl -s -X GET "https://portal.sales-crm.yalt.co/functions/v1/v1/api/leads?limit=20&status=new" \
  -H "x-api-key: yalt_..." \
  | jq .
```

For POST/PUT:
```bash
curl -s -X POST "https://portal.sales-crm.yalt.co/functions/v1/v1/api/leads" \
  -H "x-api-key: yalt_..." \
  -H "Content-Type: application/json" \
  -d '{"businessName": "Acme Corp", "status": "new", "priority": "high"}'
```

---

## Common Workflows

### 1. List & filter leads
```
GET /v1/api/leads?status=contacted&priority=high&scope=mine&limit=50
```

### 2. Create and assign a lead
1. `POST /v1/api/leads` with `LeadInput`
2. `PUT /v1/api/leads/{id}` to set `assignedTo`

### 3. Log a call after a visit
`POST /v1/api/logs/call_logs` with `leadId`, duration, notes, outcome.

### 4. Send a follow-up email
`POST /v1/api/emails/send` with `leadId`, `to`, `subject`, `bodyHtml`.

### 5. Generate today's visit route
`POST /v1/routes/generate` with `userId`, today's date, `routeType: "visits"`, and optional `startLocation`.

### 6. Check team performance
`GET /v1/api/stats/team` then `GET /v1/api/stats/leads` for lead pipeline breakdown.

---

## Error Handling

All errors follow:
```json
{ "error": "string", "details": "string" }
```

Common codes: `400` bad request, `401` unauthorized (check token + org header), `500` server error.

If a 401 is returned, ask the user to confirm their Supabase token and `x-organization-id`.

---

## Notes

- The API base doubles the `/v1` prefix in some paths: the server base is `…/functions/v1` and routes start with `/v1/…`, so full URLs are `…/functions/v1/v1/api/leads`.
- UUIDs are required for all `{id}` path params.
- Generic resource routes require both `Authorization` and `x-access-token` headers.
- `select` param on generic list endpoints accepts Supabase PostgREST column selectors (e.g. `id,businessName,status`).

---

## Data Quality Caveats

These are known data integrity issues to account for when querying or analyzing leads.

### Lead status
Valid statuses: `new` | `to-prospect` | `approaching` | `send-proposal` | `negociation` | `later` | `closed` | `lost` | `inadequate`

**`status: null` must be treated as `new`** — many leads imported from the scrapper have no status set. Never exclude `null` status leads when filtering for uncontacted leads.

"Never contacted" = status is `new` OR `null`. "Contacted" = any other non-null status.

### locationsCount
`locationsCount` on the lead object is unreliable — it can be 0, 1, or stale even for multi-location chains. The real count is inside `chainInfo.locationCount` (or `chainInfo.locationsCount`).

**Always prefer `chainInfo` to get the true number of locations.** Note: `chainInfo` is stored as a character-indexed object (`{"0":"{","1":"\"","2":"c",...}`) and must be reconstructed by joining chars in key order before JSON-parsing.

```python
def extract_chain_location_count(chain_info):
    if not chain_info or not isinstance(chain_info, dict):
        return 0
    if '0' in chain_info:
        s = ''.join(chain_info[str(i)] for i in range(len(chain_info)))
        try:
            parsed = json.loads(s)
            return parsed.get('locationCount', parsed.get('locationsCount', 0))
        except:
            return 0
    return chain_info.get('locationCount', chain_info.get('locationsCount', 0))
```

### isChain flag
`isChain` is set manually by users and is unreliable — it can be `null` or `false` even for genuine multi-location chains. **Do not rely on `isChain` alone** to identify chain leads. Cross-reference with `chainInfo` presence and the location count extracted from it.
