# Runbook: Hotel Knowledge Management

**Audience**: Hotel managers and IT staff  
**Prerequisite**: Access to the Supabase dashboard for the Curt AI project  
**Related requirement**: [REQ-F-knowledge-management-via-supabase](../../1-spec/requirements/REQ-F-knowledge-management-via-supabase.md)

---

## Overview

Hotel knowledge is stored in the `documents` table in Supabase. Every AI response is grounded in these documents — there is no other knowledge source during normal operation (unless Supabase is unreachable, in which case a read-only hardcoded fallback is used).

Changes take effect immediately on the next guest request. No code change or redeployment is required.

---

## The `documents` Table

| Column | Type | Required | Description |
|--------|------|----------|-------------|
| `id` | UUID | auto | Unique identifier (set automatically) |
| `account_id` | UUID | yes | Your hotel's account ID — must match your account |
| `knowledge_base_id` | UUID | no | Link to your knowledge base config (optional) |
| `category` | text | yes | One of: `faq`, `policy`, `amenity`, `restaurant`, `attraction`, `transport`, `event`, `other` |
| `title` | text | yes | Short title shown in logs and admin views |
| `content` | text | yes | The actual knowledge text injected into the AI context |
| `description` | text | no | Internal description for your team (not shown to guests) |
| `language` | text | yes | ISO language code, default `en` |
| `active` | boolean | yes | `true` = included in AI responses; `false` = excluded |
| `version` | integer | auto | Incremented automatically on update |
| `created_at` / `updated_at` | timestamp | auto | Set automatically |

**Columns you can ignore for basic use**: `file_url`, `file_size_bytes`, `mime_type`, `proactive_trigger`, `uploaded_by`

---

## How to Add a Knowledge Entry

1. Open the Supabase dashboard → Table Editor → `documents`
2. Click **Insert row**
3. Fill in:
   - `account_id`: your hotel's account UUID (find it in the `accounts` table)
   - `category`: choose the closest match (e.g., `faq` for Q&A, `policy` for hotel rules)
   - `title`: e.g., `"Check-in and check-out times"`
   - `content`: the full text the AI will use, e.g.:
     ```
     Check-in is from 15:00. Early check-in from 12:00 is available on request, subject to room availability, at €20 per hour. Check-out is by 11:00. Late check-out until 14:00 can be arranged at €30. Extensions beyond 14:00 are charged at the full daily rate.
     ```
   - `language`: `en` (or the relevant language)
   - `active`: `true`
4. Save. The entry is live immediately.

---

## How to Update an Entry

1. Find the entry in Table Editor → `documents`
2. Click the row to edit
3. Update the `content` (and `title` if needed)
4. Save. The change is live on the next guest request.

---

## How to Deactivate an Entry

Set `active = false` on the row. The entry is excluded from AI responses but remains in the database for reference. To reactivate, set `active = true`.

Do **not** delete entries — deactivating preserves history and allows easy reactivation.

---

## Category Guide

| Category | Use for |
|----------|---------|
| `faq` | Common guest questions and answers |
| `policy` | Hotel rules: cancellation, pets, smoking, children |
| `amenity` | Facilities: pool, gym, spa, parking |
| `restaurant` | Dining options, hours, dress code, reservations |
| `attraction` | Local sights, activities, distances |
| `transport` | Airport transfers, taxi, public transport |
| `event` | Upcoming hotel or local events |
| `other` | Anything that doesn't fit the above |

---

## Tips for Good Knowledge Content

- Write in full sentences, as if briefing a new concierge
- Include prices, hours, and contact details where relevant — the AI will quote these directly
- Keep entries focused: one topic per entry is easier to maintain than one large entry covering everything
- Update entries when prices or policies change — the AI will otherwise give outdated information

---

## Verification

After adding or updating an entry, test it:

1. Open the hotel chat at `/hotel/[your-hotelId]`
2. Ask a question related to the entry you changed
3. Confirm the AI's response reflects the updated content
