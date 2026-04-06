# Design: Supabase Knowledge Loader

**Status**: Draft  
**Satisfies**: `REQ-F-knowledge-base-from-supabase`, `REQ-F-hotel-routing`  
**Supersedes**: `DEC-hardcoded-hotel-config` (hardcoded path becomes dev fallback only)  
**Scope**: `lib/knowledge-base/loader.ts`, `lib/knowledge-base/mapper.ts`, `app/api/chat/route.ts`

---

## Problem

Hotel knowledge is currently loaded from `lib/hotels/grand-hotel.ts` — a hardcoded TypeScript file. This violates `REQ-F-knowledge-base-from-supabase` and blocks multi-hotel support and content updates without redeployment.

The Supabase schema is already in place (`accounts`, `knowledge_bases`, `documents`). The Supabase server client (`lib/supabase/server.ts`) is ready. Nothing is wired to the chat pipeline yet.

---

## Scope of This Integration Step

Replace the knowledge-base data source for the **system prompt** only.

Out of scope for this step:
- Conversation persistence (`conversations`, `messages` tables)
- Context builder, escalation engine, proactive engine (still use `HotelConfig` from fallback)
- Authentication / RLS

---

## Current Data Flow

```
loadHotelConfig(hotelId)          → HotelConfig  (hardcoded TypeScript)
toHotelKnowledge(hotelConfig)     → HotelKnowledge
buildSystemPrompt(hotel, guest)   → system prompt string
```

## Target Data Flow

```
loadHotelKnowledgeFromDb(hotelId) → HotelKnowledge  (Supabase: 3 queries)
  └─ query accounts               → name, account_id
  └─ query knowledge_bases        → tone, language, agent_name
  └─ query documents (active)     → category-grouped content
  └─ fromDbDocuments(...)         → HotelKnowledge (new mapper function)

loadHotelConfig(hotelId)          → HotelConfig  (still hardcoded — for context/escalation)
buildSystemPrompt(hotel, guest)   → system prompt string
```

`route.ts` keeps both calls during this step. `HotelKnowledge` (for prompt) comes from Supabase; `HotelConfig` (for escalation + context builder) stays hardcoded until a subsequent step.

---

## Supabase Query Strategy

Three sequential queries, all filtered by `hotel_id`:

```
1. accounts
   SELECT id, name FROM accounts WHERE hotel_id = $1 AND active = true LIMIT 1

2. knowledge_bases
   SELECT id, tone, language, agent_name FROM knowledge_bases WHERE hotel_id = $1 LIMIT 1

3. documents
   SELECT category, title, content FROM documents
   WHERE hotel_id = $1 AND active = true
   ORDER BY category ASC
```

Queries 1 and 2 can run in parallel. Query 3 depends on neither (uses `hotel_id` directly, not `account_id` or `knowledge_base_id`), so all three can be parallelised with `Promise.all`.

If `accounts` returns no row → throw, caller returns 404.  
If `knowledge_bases` returns no row → use safe defaults (tone: `'warm'`, language: `'auto'`).  
If `documents` returns empty → `HotelKnowledge` fields are empty arrays/undefined; Claude prompt degrades gracefully.

---

## Mapping Strategy: `fromDbDocuments`

New function in `lib/knowledge-base/mapper.ts` (alongside existing `toHotelKnowledge`):

```
fromDbDocuments(
  accountName: string,
  kb: { tone: string; language: string; agentName: string | null },
  docs: { category: string; title: string; content: string }[]
): HotelKnowledge
```

Documents are grouped by `category`. Expected categories and their mapping:

| `category` value | Maps to `HotelKnowledge` field |
|------------------|-------------------------------|
| `checkin`        | `checkin` (parsed JSON or plain text) |
| `wifi`           | `wifi` |
| `breakfast`      | `breakfast` |
| `parking`        | `parking` |
| `facilities`     | `amenities[]` (one string per doc) |
| `dining`         | `restaurants[]` |
| `transport`      | `transport` |
| `attractions`    | `attractions[]` |
| `policies`       | `policies` |
| `faq`            | `faq[]` (title = question, content = answer) |
| `contact`        | `escalation` |

**Content format**: each document's `content` field stores a JSON string matching the target sub-type, or a plain text string for simple fields. The mapper must handle both gracefully (try JSON.parse, fall back to treating as plain text string).

`HotelKnowledge` fields not covered by documents default to `undefined` — the system prompt builder already handles optional fields.

---

## Fallback Behaviour

The hardcoded path remains intact and active during this step:

| Scenario | Behaviour |
|----------|-----------|
| `NEXT_PUBLIC_SUPABASE_URL` not set | Skip DB call; use `loadHotelConfig` → `toHotelKnowledge` |
| Supabase query throws (network, timeout) | Log error, fall back to hardcoded config, continue request |
| Hotel not found in DB, but exists in registry | Fall back to hardcoded config, log warning |
| Hotel not found in DB **or** registry | Return 404 |

Fallback is controlled by a single env flag check at the top of `loadHotelKnowledgeFromDb`, keeping `route.ts` unchanged.

---

## Affected Files

| File | Change |
|------|--------|
| `lib/knowledge-base/loader.ts` | Add `loadHotelKnowledgeFromDb(hotelId): Promise<HotelKnowledge>` |
| `lib/knowledge-base/mapper.ts` | Add `fromDbDocuments(accountName, kb, docs): HotelKnowledge` |
| `app/api/chat/route.ts` | Replace `toHotelKnowledge(hotelConfig)` with `await loadHotelKnowledgeFromDb(hotelId)` |
| `lib/knowledge-base/types.ts` | No change — `HotelKnowledge` type already covers this |
| `lib/supabase/server.ts` | No change — already ready |
| `lib/hotels/grand-hotel.ts` | No change — becomes dev fallback only |

---

## Risks

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| `documents.content` format not standardised (DB seeded inconsistently) | High | Medium | Mapper fails gracefully per field; undefined fields → prompt degradation, not crash |
| Supabase cold-start adds latency to first request | Low | Low | Three parallel queries; acceptable for prototype |
| `hotel_id` mismatch between DB and request payload | Medium | High | `accounts` query enforces hotel isolation; 404 on mismatch |
| `fromDbDocuments` produces empty `HotelKnowledge` | Medium | Medium | Claude still responds using the system prompt frame; test with seeded data |
| Escalation engine still uses `HotelConfig` fallback | Known/Accepted | Low | Documented as out-of-scope; no regression vs current state |

---

## Test Strategy

**Unit tests** (`lib/__tests__/`):
- `fromDbDocuments` with full document set → assert correct `HotelKnowledge` shape
- `fromDbDocuments` with empty documents → assert safe defaults, no throw
- `fromDbDocuments` with malformed `content` JSON → assert field skipped, no throw

**Integration test** (`lib/__tests__/loader.integration.ts`, skipped without DB):
- `loadHotelKnowledgeFromDb('grand-hotel')` with DB seeded → assert `hotel.name` matches DB
- `loadHotelKnowledgeFromDb('unknown-hotel')` → assert throws / returns null

**Manual smoke test**:
- Seed `grand-hotel` into Supabase with same data as `grand-hotel.ts`
- Start dev server, send a chat message → verify response is coherent and hotel-specific
- Compare system prompt (add debug log) against hardcoded baseline

**Regression guard**:
- Existing `route.ts` error handling tests must pass unchanged
- Fallback path test: with `NEXT_PUBLIC_SUPABASE_URL` unset, loader returns hardcoded config
