# Tasks

## Status Legend

| Symbol | Status |
|--------|--------|
| `Todo` | Not started |
| `In Progress` | Currently being worked on |
| `Blocked` | Waiting on a dependency or decision (reason **must** be noted in the Notes column) |
| `Done` | Completed |
| `Cancelled` | No longer needed (reason **must** be noted in the Notes column) |

## Priority Legend

| Priority | Meaning |
|----------|---------|
| `P0` | Infrastructure / cross-cutting — required before feature work |
| `P1` | Implements a Must-have goal |
| `P2` | Implements a Should-have goal |
| `P3` | Implements a Could-have goal |

---

## Task Table

<!-- Req column: links to requirements this task implements (comma-separated), or "-" if none. -->

### Setup & Infrastructure

| ID | Task | Priority | Status | Req | Dependencies | Updated | Notes |
|----|------|----------|--------|-----|--------------|---------|-------|
| TASK-nextjs-scaffold | Next.js 15 project with TypeScript, Tailwind, App Router | P0 | Done | - | - | 2026-04-04 | |
| TASK-supabase-schema | Supabase initial schema migration (7 tables) | P0 | Done | [REQ-F-account-scoped-data](../1-spec/requirements/REQ-F-account-scoped-data.md) | TASK-nextjs-scaffold | 2026-04-04 | 001_initial_schema.sql migrated |
| TASK-supabase-client | Supabase client files (browser + server instances, auto-generated types) | P0 | Done | - | TASK-supabase-schema | 2026-04-04 | lib/supabase/ |

### Frontend

| ID | Task | Priority | Status | Req | Dependencies | Updated | Notes |
|----|------|----------|--------|-----|--------------|---------|-------|
| TASK-frontend-hotel-page | Hotel page with `[hotelId]` routing and server-side config load | P1 | Done | [REQ-F-hotel-routing](../1-spec/requirements/REQ-F-hotel-routing.md) | TASK-nextjs-scaffold | 2026-04-04 | Partial — routing hardcoded |
| TASK-frontend-guest-journey | GuestJourney phase stepper + phase 0/1 pre-composed content | P2 | Done | [REQ-USA-journey-phase-ui](../1-spec/requirements/REQ-USA-journey-phase-ui.md) | TASK-frontend-hotel-page | 2026-04-04 | Removed in product vision refactor 2026-04-05 |
| TASK-frontend-chat-interface | ChatInterface with message bubbles and classification styling | P1 | Done | [REQ-F-escalation-detection](../1-spec/requirements/REQ-F-escalation-detection.md), [REQ-F-handoff-notification](../1-spec/requirements/REQ-F-handoff-notification.md) | TASK-frontend-hotel-page | 2026-04-04 | Updated for 5-class classification in refactor |
| TASK-staff-auth-session | Simple staff auth: password login with signed session cookie for `/staff/*` routes | P1 | Done | [REQ-SEC-api-key-server-only](../1-spec/requirements/REQ-SEC-api-key-server-only.md) | TASK-cases-db-migration | 2026-04-06 | V1: single shared password via env var STAFF_PASSWORD |
| TASK-case-detail-page | Case detail page `/staff/inbox/[caseId]`: full message thread + status buttons + staff note | P1 | Done | - | TASK-staff-auth-session | 2026-04-06 | |
| TASK-cases-filter-tabs | Filter tabs in inbox (All / New / In Progress / Escalated) | P1 | Done | - | TASK-case-detail-page | 2026-04-06 | |
| TASK-guests-list-page | Guest list `/staff/guests`: channel, room, last activity, link to conversation | P1 | Done | [REQ-F-conversation-persistence](../1-spec/requirements/REQ-F-conversation-persistence.md) | TASK-staff-auth-session | 2026-04-06 | |
| TASK-knowledge-list-page | Knowledge list `/staff/knowledge`: all items grouped by category | P1 | Done | [REQ-F-knowledge-management-via-supabase](../1-spec/requirements/REQ-F-knowledge-management-via-supabase.md) | TASK-knowledge-api-routes | 2026-04-06 | |
| TASK-knowledge-edit-item | Edit knowledge item inline: category, question, content | P1 | Done | [REQ-F-knowledge-management-via-supabase](../1-spec/requirements/REQ-F-knowledge-management-via-supabase.md) | TASK-knowledge-list-page | 2026-04-06 | Implemented inline in KnowledgeList.tsx |
| TASK-knowledge-add-item | Add new knowledge item and save as active | P1 | Done | [REQ-F-knowledge-management-via-supabase](../1-spec/requirements/REQ-F-knowledge-management-via-supabase.md) | TASK-knowledge-list-page | 2026-04-06 | Implemented inline in KnowledgeList.tsx |
| TASK-knowledge-toggle-active | Toggle knowledge item active/inactive without deletion | P1 | Done | [REQ-F-knowledge-management-via-supabase](../1-spec/requirements/REQ-F-knowledge-management-via-supabase.md) | TASK-knowledge-list-page | 2026-04-06 | Implemented inline in KnowledgeList.tsx |

### AI Pipeline

| ID | Task | Priority | Status | Req | Dependencies | Updated | Notes |
|----|------|----------|--------|-----|--------------|---------|-------|
| TASK-api-route-setup | POST /api/chat route with full pipeline orchestration | P1 | Done | - | TASK-nextjs-scaffold | 2026-04-04 | app/api/chat/route.ts |
| TASK-request-validator | Request body validation with typed error codes | P1 | Done | - | TASK-api-route-setup | 2026-04-04 | lib/api/chat.ts |
| TASK-hardcoded-hotel-loader | Hotel config loader from TypeScript files (temporary) | P0 | Done | - | TASK-nextjs-scaffold | 2026-04-04 | To be replaced in Phase 2 |
| TASK-knowledge-mapper | HotelConfig → HotelKnowledge mapper | P1 | Done | [REQ-F-knowledge-grounded-response](../1-spec/requirements/REQ-F-knowledge-grounded-response.md) | TASK-hardcoded-hotel-loader | 2026-04-04 | lib/knowledge-base/mapper.ts |
| TASK-context-builder | Realtime context builder (timezone only — weather/events removed in refactor) | P1 | Done | - | TASK-api-route-setup | 2026-04-04 | lib/context/builder.ts |
| TASK-message-interpreter | Message interpreter — intent and language hints | P1 | Done | [REQ-F-language-detection-response](../1-spec/requirements/REQ-F-language-detection-response.md) | TASK-api-route-setup | 2026-04-04 | Removed in product vision refactor 2026-04-05 |
| TASK-escalation-engine | Escalation decision and action engine (rule-based pre-decision) | P1 | Done | [REQ-F-escalation-detection](../1-spec/requirements/REQ-F-escalation-detection.md) | TASK-message-interpreter | 2026-04-04 | Replaced by 5-class classification in refactor |
| TASK-prompt-builder | System prompt with classification rules, HEARD framework, knowledge injection | P1 | Done | [REQ-F-knowledge-grounded-response](../1-spec/requirements/REQ-F-knowledge-grounded-response.md), [REQ-F-language-detection-response](../1-spec/requirements/REQ-F-language-detection-response.md) | TASK-knowledge-mapper | 2026-04-04 | lib/system-prompt.ts — updated for 5-class in refactor |
| TASK-claude-api-integration | Claude API call via Anthropic SDK (claude-sonnet-4) | P1 | Done | [REQ-F-knowledge-grounded-response](../1-spec/requirements/REQ-F-knowledge-grounded-response.md) | TASK-prompt-builder | 2026-04-04 | model: claude-sonnet-4-20250514; wrapped in ConciergeAIProvider interface |
| TASK-post-processor | META tag parser — extracts classification, language, case title | P1 | Done | [REQ-F-escalation-detection](../1-spec/requirements/REQ-F-escalation-detection.md) | TASK-claude-api-integration | 2026-04-04 | lib/post-processor.ts — new format: class= lang= case= |
| TASK-proactive-engine | Proactive message appender based on hotel config | P2 | Done | - | TASK-context-builder | 2026-04-04 | Removed in product vision refactor 2026-04-05 |
| TASK-security-layer | Rate limiting and chat token validation | P1 | Done | [REQ-SEC-api-key-server-only](../1-spec/requirements/REQ-SEC-api-key-server-only.md) | TASK-api-route-setup | 2026-04-04 | lib/security/ |
| TASK-seed-grand-hotel | Insert Grand Hotel Vienna account into Supabase | P1 | Cancelled | [REQ-F-knowledge-base-from-supabase](../1-spec/requirements/REQ-F-knowledge-base-from-supabase.md) | TASK-supabase-schema | 2026-04-04 | Not needed — loader works for any onboarded hotel |
| TASK-supabase-hotel-resolver | Fetch account + knowledge_base config from Supabase by `hotel_id` | P1 | Done | [REQ-F-hotel-routing](../1-spec/requirements/REQ-F-hotel-routing.md) | TASK-supabase-schema | 2026-04-04 | lib/knowledge-base/loader.ts |
| TASK-supabase-document-fetch | Fetch active documents by `hotel_id`; transform via fromDbDocuments | P1 | Done | [REQ-F-knowledge-base-from-supabase](../1-spec/requirements/REQ-F-knowledge-base-from-supabase.md), [REQ-F-account-scoped-data](../1-spec/requirements/REQ-F-account-scoped-data.md) | TASK-supabase-hotel-resolver | 2026-04-04 | lib/knowledge-base/mapper.ts |
| TASK-wire-supabase-loader | Replace hardcoded Hotel Loader in API route with Supabase resolver | P1 | Done | [REQ-F-knowledge-base-from-supabase](../1-spec/requirements/REQ-F-knowledge-base-from-supabase.md), [REQ-F-hotel-routing](../1-spec/requirements/REQ-F-hotel-routing.md) | TASK-supabase-document-fetch | 2026-04-04 | |
| TASK-verify-knowledge-grounded | Smoke test: 5 questions verify responses match Supabase documents | P1 | Done | [REQ-F-knowledge-grounded-response](../1-spec/requirements/REQ-F-knowledge-grounded-response.md) | TASK-wire-supabase-loader | 2026-04-04 | 5/5 pass |
| TASK-conversation-create | On each chat request, create or retrieve a conversations row | P1 | Done | [REQ-F-conversation-persistence](../1-spec/requirements/REQ-F-conversation-persistence.md) | TASK-wire-supabase-loader | 2026-04-04 | lib/supabase/persistence.ts |
| TASK-message-persist-user | Write guest message to messages table | P1 | Done | [REQ-F-conversation-persistence](../1-spec/requirements/REQ-F-conversation-persistence.md) | TASK-conversation-create | 2026-04-04 | |
| TASK-message-persist-assistant | Write AI response to messages table with classification, language | P1 | Done | [REQ-F-conversation-persistence](../1-spec/requirements/REQ-F-conversation-persistence.md) | TASK-message-persist-user | 2026-04-04 | Updated for 5-class in refactor |
| TASK-escalation-persist | Update conversations.status based on classification | P1 | Done | [REQ-F-handoff-notification](../1-spec/requirements/REQ-F-handoff-notification.md), [REQ-F-conversation-persistence](../1-spec/requirements/REQ-F-conversation-persistence.md) | TASK-message-persist-assistant | 2026-04-04 | status=escalated when class=human |
| TASK-latency-instrumentation | Add per-step timing logs to API route | P1 | Done | [REQ-PERF-response-latency](../1-spec/requirements/REQ-PERF-response-latency.md) | TASK-wire-supabase-loader | 2026-04-04 | `[timing:requestId]` logs |
| TASK-latency-verify | Run 20 test messages; confirm p95 ≤ 8s | P1 | Done | [REQ-PERF-response-latency](../1-spec/requirements/REQ-PERF-response-latency.md) | TASK-latency-instrumentation | 2026-04-04 | p95=7911ms — PASS |
| TASK-security-audit | Confirm API key server-side only | P1 | Done | [REQ-SEC-api-key-server-only](../1-spec/requirements/REQ-SEC-api-key-server-only.md) | TASK-wire-supabase-loader | 2026-04-04 | |
| TASK-escalation-signal-verify | 20 test messages; confirm META tag parsed in all cases | P1 | Done | [REQ-F-escalation-detection](../1-spec/requirements/REQ-F-escalation-detection.md) | TASK-wire-supabase-loader | 2026-04-04 | Note: taxi false-positive; fixed in refactor via classification |
| TASK-second-hotel-onboarding | Insert second hotel into Supabase; verify routing + isolation | P2 | Done | [REQ-F-hotel-routing](../1-spec/requirements/REQ-F-hotel-routing.md), [REQ-F-account-scoped-data](../1-spec/requirements/REQ-F-account-scoped-data.md) | TASK-wire-supabase-loader | 2026-04-04 | |
| TASK-fix-mapper-categories | Fix fromDbDocuments mapper: category mapping corrections | P1 | Done | [REQ-F-knowledge-base-from-supabase](../1-spec/requirements/REQ-F-knowledge-base-from-supabase.md), [REQ-F-knowledge-grounded-response](../1-spec/requirements/REQ-F-knowledge-grounded-response.md) | TASK-second-hotel-onboarding | 2026-04-04 | |
| TASK-load-conversation-history | Load last N messages for conversationId from Supabase; inject into Claude request | P1 | Done | [REQ-F-conversation-history-context](../1-spec/requirements/REQ-F-conversation-history-context.md) | TASK-conversation-create | 2026-04-04 | |
| TASK-history-token-guard | Truncate injected history if total chars exceed budget | P1 | Done | [REQ-F-conversation-history-context](../1-spec/requirements/REQ-F-conversation-history-context.md) | TASK-load-conversation-history | 2026-04-04 | 20-message limit + 24k char guard |
| TASK-graceful-degradation-supabase | Fallback to hardcoded registry on Supabase failure | P1 | Done | [REQ-REL-graceful-degradation](../1-spec/requirements/REQ-REL-graceful-degradation.md) | TASK-wire-supabase-loader | 2026-04-04 | |
| TASK-graceful-degradation-history | Proceed stateless on history load failure | P1 | Done | [REQ-REL-graceful-degradation](../1-spec/requirements/REQ-REL-graceful-degradation.md) | TASK-load-conversation-history | 2026-04-04 | |
| TASK-graceful-degradation-claude | Return 502 with guest-safe message on AI error | P1 | Done | [REQ-REL-graceful-degradation](../1-spec/requirements/REQ-REL-graceful-degradation.md) | TASK-claude-api-integration | 2026-04-04 | |
| TASK-sanitize-server-logs | Audit logs; no PII or guest content in server output | P1 | Done | [REQ-COMP-gdpr-guest-data](../1-spec/requirements/REQ-COMP-gdpr-guest-data.md) | TASK-message-persist-assistant | 2026-04-04 | |
| TASK-fix-escalation-handoff-threshold | Update escalation-persist to class=human threshold | P1 | Done | [REQ-F-escalation-detection](../1-spec/requirements/REQ-F-escalation-detection.md), [REQ-F-handoff-notification](../1-spec/requirements/REQ-F-handoff-notification.md) | TASK-escalation-persist | 2026-04-04 | |
| TASK-cases-db-migration | Apply Supabase cases table migration (20260405_add_cases.sql) + classification column in messages | P0 | Done | - | - | 2026-04-06 | TypeScript types updated; SQL must be run in Supabase dashboard |
| TASK-knowledge-api-routes | API routes `/api/knowledge` (GET / POST / PATCH / DELETE) with staff auth guard | P1 | Done | [REQ-F-knowledge-base-from-supabase](../1-spec/requirements/REQ-F-knowledge-base-from-supabase.md) | TASK-staff-auth-session | 2026-04-06 | |
| TASK-gemini-sdk-install | Install `@google/generative-ai` SDK; add GEMINI_API_KEY to .env.local | P1 | Done | - | - | 2026-04-06 | |
| TASK-gemini-provider | Implement `lib/ai/gemini-provider.ts` (ConciergeAIProvider interface) | P1 | Done | [REQ-F-knowledge-grounded-response](../1-spec/requirements/REQ-F-knowledge-grounded-response.md) | TASK-gemini-sdk-install | 2026-04-06 | model: gemini-2.0-flash |
| TASK-ai-provider-factory | `lib/ai/provider-factory.ts`: select Claude or Gemini via AI_PROVIDER env var | P1 | Done | - | TASK-gemini-provider | 2026-04-06 | |
| TASK-wire-provider-factory | route.ts: use provider factory instead of direct claudeProvider import | P1 | Done | - | TASK-ai-provider-factory | 2026-04-06 | |
| TASK-verify-gemini-classification | Smoke test: 10 messages through Gemini, all 5 classes tested, META format correct | P1 | Todo | [REQ-F-language-detection-response](../1-spec/requirements/REQ-F-language-detection-response.md) | TASK-wire-provider-factory | 2026-04-05 | |
| TASK-whatsapp-outbound-client | Implement `lib/whatsapp/client.ts`: `sendWhatsAppMessage()` via Meta Cloud API v20 | P2 | Todo | - | - | 2026-04-05 | Requires WHATSAPP_TOKEN + WHATSAPP_PHONE_NUMBER_ID env vars |
| TASK-whatsapp-webhook-parser | Parse incoming Meta webhook payload: extract text and audio message types | P2 | Todo | - | TASK-whatsapp-outbound-client | 2026-04-05 | |
| TASK-whatsapp-text-pipeline | Route WhatsApp text messages through core pipeline; send reply via outbound client | P2 | Todo | [REQ-F-language-detection-response](../1-spec/requirements/REQ-F-language-detection-response.md) | TASK-whatsapp-webhook-parser | 2026-04-05 | |
| TASK-speech-to-text | `lib/speech/transcribe.ts`: audio URL → text via Whisper API | P2 | Todo | - | - | 2026-04-05 | |
| TASK-whatsapp-voice-pipeline | Voice notes: download media → transcribe → inject into pipeline | P2 | Todo | - | TASK-speech-to-text, TASK-whatsapp-text-pipeline | 2026-04-05 | |
| TASK-whatsapp-guest-identification | Identify/create guest by phone number (channel_id); link to conversation | P2 | Todo | [REQ-F-conversation-persistence](../1-spec/requirements/REQ-F-conversation-persistence.md) | TASK-whatsapp-text-pipeline | 2026-04-05 | |
| TASK-whatsapp-e2e-verify | End-to-end test with WhatsApp test number: text + voice, Action Card appears in inbox | P2 | Todo | - | TASK-whatsapp-guest-identification, TASK-whatsapp-voice-pipeline | 2026-04-05 | |

### Deploy & Operations

| ID | Task | Priority | Status | Req | Dependencies | Updated | Notes |
|----|------|----------|--------|-----|--------------|---------|-------|
| TASK-phase1-manual-testing | Create baseline runbook: startup + manual test scenarios for working prototype | P0 | Done | - | TASK-security-layer | 2026-04-04 | 4-deploy/runbooks/phase1-manual-testing.md |
| TASK-phase2-manual-testing | Update runbook: Supabase knowledge integration scenarios + seed SQL docs | P1 | Done | - | TASK-verify-knowledge-grounded | 2026-04-04 | 4-deploy/runbooks/phase2-5-manual-testing.md |
| TASK-phase3-manual-testing | Update runbook: persistence verification (check Supabase rows after conversation) | P1 | Done | - | TASK-escalation-persist | 2026-04-04 | |
| TASK-phase4-manual-testing | Update runbook: latency, security, escalation, multi-hotel checklists | P1 | Done | - | TASK-second-hotel-onboarding | 2026-04-04 | |
| TASK-document-knowledge-schema | Write knowledge-management.md: documents table schema, field descriptions, non-developer guide | P1 | Done | [REQ-F-knowledge-management-via-supabase](../1-spec/requirements/REQ-F-knowledge-management-via-supabase.md) | TASK-wire-supabase-loader | 2026-04-04 | 4-deploy/runbooks/knowledge-management.md |
| TASK-gdpr-deletion-procedure | Write gdpr-deletion.md: SQL to delete guest data by guest_id | P1 | Done | [REQ-COMP-gdpr-guest-data](../1-spec/requirements/REQ-COMP-gdpr-guest-data.md) | TASK-supabase-schema | 2026-04-04 | 4-deploy/runbooks/gdpr-deletion.md |
| TASK-phase5-manual-testing | Update runbook: conversation continuity, graceful fallback, log PII audit | P1 | Done | - | TASK-sanitize-server-logs | 2026-04-04 | |
| TASK-phase6-manual-testing | Update runbook: inbox startup, Action Card flow, status updates, staff auth | P1 | Done | - | TASK-cases-filter-tabs, TASK-guests-list-page | 2026-04-05 | |
| TASK-phase7-manual-testing | Update runbook: knowledge edit scenarios, verify AI reflects changes | P1 | Done | - | TASK-knowledge-toggle-active | 2026-04-06 | 4-deploy/runbooks/phase7-knowledge-management.md |
| TASK-phase8-manual-testing | Update runbook: AI_PROVIDER switch guide, Gemini vs. Claude comparison | P1 | Todo | - | TASK-verify-gemini-classification | 2026-04-05 | |
| TASK-phase9-manual-testing | Update runbook: WhatsApp setup, webhook verify, text + voice test scenarios | P2 | Todo | - | TASK-whatsapp-e2e-verify | 2026-04-05 | |

### SDLC Alignment

| ID | Task | Priority | Status | Req | Dependencies | Updated | Notes |
|----|------|----------|--------|-----|--------------|---------|-------|
| TASK-update-claude-md | Update CLAUDE.md: project overview, architecture block, current state to new vision | P1 | Todo | - | TASK-phase6-manual-testing | 2026-04-05 | |
| TASK-deprecate-stale-spec | Deprecate requirements and user stories for journey phases and old escalation model | P1 | Todo | - | TASK-update-claude-md | 2026-04-05 | REQ-USA-journey-phase-ui, REQ-F-journey-phase-context, REQ-F-escalation-detection (old form) |
| TASK-add-new-requirements | Add new requirements: 5-class classification, Operations Inbox, WhatsApp, AI provider abstraction | P1 | Todo | - | TASK-deprecate-stale-spec | 2026-04-05 | |
| TASK-update-architecture-doc | Update architecture.md: new component map (Provider layer, Staff Portal, WhatsApp Webhook) | P1 | Todo | - | TASK-add-new-requirements | 2026-04-05 | |
| TASK-update-data-model-doc | Update data-model.md: add cases table, classification column in messages | P1 | Todo | - | TASK-update-architecture-doc | 2026-04-05 | |
| TASK-update-decisions | Update DEC-meta-tag-escalation; add DEC-ai-provider-abstraction, DEC-whatsapp-channel | P1 | Todo | - | TASK-update-data-model-doc | 2026-04-05 | |

---

## Execution Plan

Defines the order in which tasks should be executed. Tasks are grouped into phases; complete all tasks in a phase before moving to the next. Within a phase, execute tasks in the listed order. Each phase ends with a deployable or testable system.

### Phase 1: Baseline — Working Prototype (Complete)

**Capabilities delivered:**
- Guest navigates three journey phases (pre-arrival, check-in day, stay)
- Chat interface with AI responses and classification styling
- Language detection and matched responses via Claude (GOAL-intelligent-guest-assistance SC1, SC4)
- Knowledge-grounded responses from hardcoded hotel config (GOAL-intelligent-guest-assistance SC2 partial)
- API key server-side only (REQ-SEC-api-key-server-only)
- Supabase schema migrated, client files ready

**Tasks:**
1. TASK-nextjs-scaffold
2. TASK-supabase-schema
3. TASK-supabase-client
4. TASK-frontend-hotel-page
5. TASK-frontend-guest-journey
6. TASK-frontend-chat-interface
7. TASK-api-route-setup
8. TASK-request-validator
9. TASK-hardcoded-hotel-loader
10. TASK-knowledge-mapper
11. TASK-context-builder
12. TASK-message-interpreter
13. TASK-escalation-engine
14. TASK-prompt-builder
15. TASK-claude-api-integration
16. TASK-post-processor
17. TASK-proactive-engine
18. TASK-security-layer
19. TASK-phase1-manual-testing

### Phase 2: Supabase — Hotel Knowledge Integration (Complete)

**Capabilities delivered:**
- Hotel knowledge reads from Supabase documents table (GOAL-intelligent-guest-assistance SC2 fully met)
- Hotel config resolved from Supabase by hotelId (REQ-F-hotel-routing)
- All knowledge queries scoped by account_id (REQ-F-account-scoped-data)

**Tasks:**
1. TASK-seed-grand-hotel
2. TASK-supabase-hotel-resolver
3. TASK-supabase-document-fetch
4. TASK-wire-supabase-loader
5. TASK-verify-knowledge-grounded
6. TASK-phase2-manual-testing

### Phase 3: Supabase — Conversation Persistence (Complete)

**Capabilities delivered:**
- Every conversation and message persisted to Supabase (GOAL-conversation-persistence SC1)
- Escalation and handoff events recorded (GOAL-escalation-and-handoff SC5)

**Tasks:**
1. TASK-conversation-create
2. TASK-message-persist-user
3. TASK-message-persist-assistant
4. TASK-escalation-persist
5. TASK-phase3-manual-testing

### Phase 4: Verification, Security & Multi-Hotel Smoke Test (Complete)

**Capabilities delivered:**
- Response latency confirmed within 8s p95 (REQ-PERF-response-latency verified)
- API key confirmed unreachable from browser (REQ-SEC-api-key-server-only verified)
- Second hotel account confirmed working with zero code changes (GOAL-multi-hotel-platform SC1/SC2)

**Tasks:**
1. TASK-latency-instrumentation
2. TASK-latency-verify
3. TASK-security-audit
4. TASK-escalation-signal-verify
5. TASK-second-hotel-onboarding
6. TASK-phase4-manual-testing

### Phase 5: Resilience, History & Compliance (Complete)

**Capabilities delivered:**
- Returning guests get contextually continuous conversations (GOAL-conversation-persistence SC3)
- System survives Supabase and Claude failures gracefully (REQ-REL-graceful-degradation)
- GDPR baseline met: no PII in logs, guest data deletable by procedure (REQ-COMP-gdpr-guest-data)

**Tasks:**
1. TASK-fix-escalation-handoff-threshold
2. TASK-load-conversation-history
3. TASK-history-token-guard
4. TASK-graceful-degradation-supabase
5. TASK-graceful-degradation-history
6. TASK-graceful-degradation-claude
7. TASK-sanitize-server-logs
8. TASK-document-knowledge-schema
9. TASK-gdpr-deletion-procedure
10. TASK-phase5-manual-testing

---

### Phase 6: Operations Inbox — Action Cards Live

**Capabilities delivered:**
- Hotel staff can view and manage live Action Cards in `/staff/inbox` from Supabase (GOAL-escalation-and-handoff SC3)
- Full status workflow: new → accepted → in progress → done / escalated
- Case detail page shows complete guest message thread
- Staff guest overview at `/staff/guests`
- Auth-protected staff portal

**Tasks:**
1. TASK-cases-db-migration
2. TASK-staff-auth-session
3. TASK-case-detail-page
4. TASK-cases-filter-tabs
5. TASK-guests-list-page
6. TASK-phase6-manual-testing

### Phase 7: Knowledge Base Management

**Capabilities delivered:**
- Hotel managers can add, edit, and deactivate knowledge items directly in the staff UI (GOAL-hotel-knowledge-management SC2, SC3)
- Changes are immediately reflected in subsequent AI responses without redeployment

**Tasks:**
1. TASK-knowledge-api-routes
2. TASK-knowledge-list-page
3. TASK-knowledge-edit-item
4. TASK-knowledge-add-item
5. TASK-knowledge-toggle-active
6. TASK-phase7-manual-testing

### Phase 8: AI Provider Abstraction — Gemini

**Capabilities delivered:**
- Gemini is a fully functional, swappable AI provider
- Provider switch via `AI_PROVIDER=gemini|claude` env var — no code change needed
- 5-class classification verified on Gemini

**Tasks:**
1. TASK-gemini-sdk-install
2. TASK-gemini-provider
3. TASK-ai-provider-factory
4. TASK-wire-provider-factory
5. TASK-verify-gemini-classification
6. TASK-phase8-manual-testing

### Phase 9: WhatsApp Channel

**Capabilities delivered:**
- Guests can send text messages via WhatsApp and receive AI responses (GOAL-guest-journey-touchpoints SC4)
- Voice notes are transcribed and processed like text messages
- All WhatsApp messages flow through the same pipeline as web chat
- Action Cards are created in the inbox for service/problem/complaint/human messages

**Tasks:**
1. TASK-whatsapp-outbound-client
2. TASK-whatsapp-webhook-parser
3. TASK-whatsapp-text-pipeline
4. TASK-speech-to-text
5. TASK-whatsapp-voice-pipeline
6. TASK-whatsapp-guest-identification
7. TASK-whatsapp-e2e-verify
8. TASK-phase9-manual-testing

### Phase 10: SDLC Alignment

**Capabilities delivered:**
- CLAUDE.md, design documents, requirements, and decisions reflect the current product vision
- Stale artifacts deprecated; new requirements traceable to implemented features
- Full SDLC traceability restored

**Tasks:**
1. TASK-update-claude-md
2. TASK-deprecate-stale-spec
3. TASK-add-new-requirements
4. TASK-update-architecture-doc
5. TASK-update-data-model-doc
6. TASK-update-decisions
