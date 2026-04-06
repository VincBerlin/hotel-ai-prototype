# AI Pipeline

**Responsibility**: Server-side AI pipeline — request validation, hotel config loading, context building, prompt assembly, Claude API call, post-processing, escalation logic, and Supabase persistence.

**Technology**: Next.js API Routes, TypeScript, Anthropic SDK (`claude-sonnet-4`), Supabase JS client

**Source paths**: `app/api/chat/route.ts`, `lib/ai/`, `lib/api/`, `lib/context/`, `lib/hotels/`, `lib/knowledge-base/`, `lib/post-processor.ts`, `lib/security/`, `lib/simulation/`, `lib/supabase/`, `lib/system-prompt.ts`

## Interfaces

- REST server ← `frontend`: receives `POST /api/chat`, returns structured JSON response
- External → Claude API: `anthropic.messages.create()` — system prompt + message history in, raw text + META tag out
- External → Supabase: read `accounts`, `knowledge_bases`, `documents` (planned); write `conversations`, `messages` (planned)

## Requirements Addressed

| File | Type | Priority | Summary |
|------|------|----------|---------|
| [REQ-F-language-detection-response](../../1-spec/requirements/REQ-F-language-detection-response.md) | Functional | Must-have | Detect guest language and respond in kind — via Claude + system prompt |
| [REQ-F-knowledge-grounded-response](../../1-spec/requirements/REQ-F-knowledge-grounded-response.md) | Functional | Must-have | AI responses grounded in hotel knowledge base; no fabrication |
| [REQ-PERF-response-latency](../../1-spec/requirements/REQ-PERF-response-latency.md) | Performance | Must-have | Complete response within 8s at p95 |
| [REQ-F-escalation-detection](../../1-spec/requirements/REQ-F-escalation-detection.md) | Functional | Must-have | Every response classified with escalation level 0–3 |
| [REQ-F-handoff-notification](../../1-spec/requirements/REQ-F-handoff-notification.md) | Functional | Must-have | Level-2+ escalation sets handoff: true; event recorded in Supabase |
| [REQ-F-knowledge-base-from-supabase](../../1-spec/requirements/REQ-F-knowledge-base-from-supabase.md) | Functional | Must-have | Hotel knowledge fetched from Supabase at request time |
| [REQ-F-conversation-persistence](../../1-spec/requirements/REQ-F-conversation-persistence.md) | Functional | Must-have | All messages written to Supabase messages table per request |
| [REQ-SEC-api-key-server-only](../../1-spec/requirements/REQ-SEC-api-key-server-only.md) | Security | Must-have | Anthropic API key server-side only; never in client code or responses |
| [REQ-F-hotel-routing](../../1-spec/requirements/REQ-F-hotel-routing.md) | Functional | Must-have | Hotel context resolved from Supabase by hotelId |
| [REQ-F-account-scoped-data](../../1-spec/requirements/REQ-F-account-scoped-data.md) | Functional | Must-have | All Supabase records include account_id; all queries filtered by account |

## Relevant Decisions

| File | Title | Trigger |
|------|-------|---------|
| [DEC-meta-tag-escalation](../../decisions/DEC-meta-tag-escalation.md) | Claude signals escalation via embedded META tag | Any change to system prompt or post-processor |
| [DEC-hardcoded-hotel-config](../../decisions/DEC-hardcoded-hotel-config.md) | Hotel config is hardcoded; migration to Supabase is next | Any change to Hotel Loader or hotel routing |
| [DEC-single-api-route](../../decisions/DEC-single-api-route.md) | Single POST /api/chat orchestrates the AI pipeline | Any proposed new AI endpoint |
| [DEC-claude-model-version](../../decisions/DEC-claude-model-version.md) | claude-sonnet-4 is the designated model | Any model version change |
