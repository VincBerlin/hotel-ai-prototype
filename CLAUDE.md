# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Language Policy

**All AI outputs must be in English**, regardless of the language used in user prompts. This applies to code, comments, documentation, configuration files, and commit messages. Conversational responses may be in German if the user writes in German.

---

## Project Overview

**Curt AI** is a hotel AI concierge platform providing intelligent guest interactions across web chat, WhatsApp, and Instagram DM. Claude (Anthropic) is the sole intelligence layer — no pre-processing keyword or intent logic sits in front of it. TypeScript orchestrates context building, prompt assembly, post-processing, and routing. Supabase provides persistence for conversations, guest profiles, hotel knowledge bases, and cases.

**Core capabilities:**
- Answer guest questions using structured hotel knowledge data
- Auto-detect guest language and respond in-kind
- Classify messages into 5 classes and create cases for actionable ones
- Operations Inbox for staff with Action Cards and status workflow
- Support multiple hotel accounts with isolated knowledge bases

### Current State

- Active branch: `feature/initial-build` (worktree at `.worktrees/feature/initial-build`)
- Phases 1–5 complete. Phase 6+ covers Operations Inbox, Knowledge Editor, Gemini provider, WhatsApp channel
- Implementation progress: 63/79 tasks done — Phase 8 in progress (provider factory wired)
- Next action: TASK-verify-gemini-classification — smoke test requires GEMINI_API_KEY; then TASK-phase8-manual-testing

---

## Development Commands

> All commands run from `.worktrees/feature/initial-build/` — that is where the Next.js app lives.

```bash
cd .worktrees/feature/initial-build

npm run dev          # Start dev server at localhost:3000
npm run build        # Production build
npm run typecheck    # tsc --noEmit — run before every commit
npm run test         # Run all unit tests
```

**Run a single test file:**
```bash
node --experimental-strip-types --test lib/__tests__/post-processor.test.ts
node --experimental-strip-types --test lib/api/__tests__/chat.test.ts
node --experimental-strip-types --test lib/ai/__tests__/smoke.test.ts
```

Tests use Node.js built-in `node:test` + `node:assert/strict` — no Jest or Vitest.

### Required Environment Variables

File: `.worktrees/feature/initial-build/.env.local` (symlinked from root `.env.local`)

```
ANTHROPIC_API_KEY=             # Claude API key — server-side only
NEXT_PUBLIC_SUPABASE_URL=      # Supabase project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY= # Anon key
SUPABASE_SERVICE_ROLE_KEY=     # Service role key — server-side only
CHAT_TOKEN_SECRET=             # Min 16 chars — used for chat tokens AND staff sessions
STAFF_PASSWORD=                # Shared password for /staff portal (V1)
```

If `NEXT_PUBLIC_SUPABASE_URL` is unset, the app falls back to the hardcoded `grand-hotel` registry (`lib/hotels/grand-hotel.ts`) — dev mode without Supabase.

---

## Key Architecture Details

### Worktree Layout

The repository root contains SDLC planning artifacts (`1-spec/`, `2-design/`, `3-code/`, `decisions/`). The actual Next.js application lives at:
```
.worktrees/feature/initial-build/   ← all app code, package.json, node_modules
```

### Guest Chat Pipeline (`POST /api/chat`)

```
POST /api/chat
  ├── parseChatRequestBody         → lib/api/chat.ts
  ├── loadHotelKnowledgeFromDb     → lib/knowledge-base/loader.ts
  │     fallback: lib/hotels/grand-hotel.ts
  ├── getOrCreateConversation      → lib/supabase/persistence.ts  [awaited]
  ├── loadConversationHistory      → lib/supabase/persistence.ts
  ├── buildSystemPrompt            → lib/system-prompt.ts
  ├── claudeProvider.respond()     → lib/ai/claude-provider.ts
  │     calls Anthropic SDK, then postProcess() → lib/post-processor.ts
  └── Promise.allSettled([         [fire-and-forget]
        persistMessage (user),
        persistMessage (assistant),
        updateConversation,
        createCase (if class ≠ info)
      ])
```

Returns: `{ reply, classification, handoff: boolean, language, conversationId }`

### 5-Class Message Classification

Every guest message is classified by Claude into exactly one of:

| Class | Meaning | Creates case? |
|-------|---------|---------------|
| `info` | Question answered from KB | No |
| `service` | Guest requests something (taxi, towels, wake-up) | Yes |
| `problem` | Something isn't working | Yes |
| `complaint` | Guest is dissatisfied | Yes |
| `human` | Staff needed / critical — triggers `handoff: true` | Yes |

### META Tag Protocol

Claude appends a structured tag to every response:
```
[META: class=info, lang=en]
[META: class=service, lang=de, case=Zimmer 204 – Handtücher]
```
`postProcess()` in `lib/post-processor.ts` strips the tag and returns `{ cleanText, metadata }`. Falls back to `{ classification: 'info', language: 'en' }` if absent — never throws.

### AI Provider Abstraction

`ConciergeAIProvider` interface (`lib/ai/types.ts`) decouples the pipeline from any specific model. `claudeProvider` (`lib/ai/claude-provider.ts`) is the current implementation. Swap for Gemini by implementing the same interface and updating the import in `app/api/chat/route.ts`.

### Hotel Data Model

`HotelKnowledge` (`lib/knowledge-base/types.ts`) is the flat struct injected into the system prompt. `loadHotelKnowledgeFromDb` loads from Supabase (`accounts` → `knowledge_bases` → `documents`) and falls back to the hardcoded registry.

### Staff Portal (`/staff/*`)

- `middleware.ts` — guards all `/staff/*` routes except `/staff/login` with HMAC session cookie verification
- `lib/security/staff-session.ts` — `createStaffSession()` / `verifyStaffSession()` — HMAC-SHA256, 8h TTL, reuses `CHAT_TOKEN_SECRET`
- `app/api/staff/login/route.ts` — compares `STAFF_PASSWORD`, sets httpOnly `staff-session` cookie
- `app/staff/inbox/` — Operations Inbox: Action Cards with status flow `new → accepted → in_progress → done | escalated`
- `app/staff/inbox/[caseId]/` — Case detail: full message thread + staff note + status actions
- `app/staff/guests/` — Conversation list across all guests
- `app/api/cases/[caseId]/route.ts` — PATCH endpoint for case status / staff note updates

### Persistence Pattern

- `getOrCreateConversation()` — **awaited** before the Claude call (needed for `conversationId`)
- All post-AI Supabase writes — **fire-and-forget** via `void Promise.allSettled([...])`. Errors are logged, never thrown. DB latency must not add to AI response latency.

### Supabase Types

`lib/supabase/types.ts` is auto-generated and lacks `Relationships`. This causes insert/update payloads to infer as `never` and column-select queries to return `data: never`.

Required cast patterns:
- Insert/Update: cast payload `as never`
- Select with columns: cast `result.data as { col: Type } | null`

Regenerate with `npx supabase gen types typescript` once project is linked.

### Security

- `ANTHROPIC_API_KEY` used only in `lib/ai/claude-provider.ts` — server-side only
- Chat tokens: HMAC-SHA256 signed with `CHAT_TOKEN_SECRET`, sent via `x-chat-token` header, verified in `lib/security/chat-token.ts`
- Rate limiter (`lib/security/rate-limit.ts`): in-memory per-IP — resets on restart, not suitable for multi-instance deploy
- Staff sessions: same HMAC key as chat tokens, httpOnly cookie, 8h TTL
- `supabaseAdmin` in `lib/supabase/server.ts` — service role client, never import in client components

### Key Conventions

- `lib/` — all business logic; never import from `app/` into `lib/`
- Timing logs use `[timing:<requestId>]` prefix — grep for these when profiling
- `lib/whatsapp/` — placeholder types for Phase 9; not yet active
- CI runs: `npm ci` → `npm run typecheck` → `npm run test` (`.github/workflows/ci.yml`)

---

## Phase-Specific Instructions

Each phase directory contains a `CLAUDE.<phase>.md` file. When working in a phase:

1. Read the phase-specific instructions — they extend (not override) this file
2. Consult the decisions index in that phase file before starting work

| Phase | Directory | Focus |
|-------|-----------|-------|
| **Specification** | `1-spec/` | Define what to build and why |
| **Design** | `2-design/` | Define how to build it |
| **Code** | `3-code/` | Build it |
| **Deploy** | `4-deploy/` | Ship and operate it |

### Phase Gates

| Transition | Preconditions |
|------------|---------------|
| Spec → Design | Stakeholders defined; at least one goal Approved; at least one requirement Approved |
| Design → Code | All design documents drafted; components identified in `3-code/` |

---

## Artifacts

| Prefix | Artifact | Location |
|--------|----------|----------|
| `GOAL` | Goals | `1-spec/goals/` |
| `US` | User Stories | `1-spec/user-stories/` |
| `REQ-CLASS` | Requirements | `1-spec/requirements/` |
| `ASM` | Assumptions | `1-spec/assumptions/` |
| `CON` | Constraints | `1-spec/constraints/` |
| `STK` | Stakeholders | `1-spec/stakeholders.md` |
| `TASK` | Tasks | `3-code/tasks.md` |
| `DEC` | Decisions | `decisions/` |

---

## Decisions

Decisions live in `decisions/`. Two files per decision:
- `DEC-kebab-name.md` — active record (read during tasks)
- `DEC-kebab-name.history.md` — audit trail (read only when evaluating changes)

See [`decisions/PROCEDURES.md`](decisions/PROCEDURES.md) for recording, deprecating, and superseding decisions.

---

## Graduated Safeguards

| Tier | When | Agent behavior |
|------|------|----------------|
| **Always ask** | Conflict resolution, design gaps, decision deprecation, phase gate advancement | Stop, present options, wait for approval |
| **Ask first time** | Naming conventions, error handling patterns, test structure | Ask once, record decision, apply consistently |
| **Decide and record** | Routine implementation choices within established patterns | Decide autonomously, record in artifact |
