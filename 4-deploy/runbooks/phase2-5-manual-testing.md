# Runbook: Phases 2–5 Manual Testing

Covers manual verification for Phases 2 (Supabase Knowledge), 3 (Persistence), 4 (Verification), and 5 (Resilience, History & Compliance). Extends Phase 1 runbook.

---

## Prerequisites

- App running: `npm run dev` in the worktree root (`.worktrees/feature/initial-build/`)
- `.env.local` symlinked into the worktree root (symlink to repo root `.env.local`)
- Supabase project accessible with service role key set

---

## Phase 2: Supabase Knowledge Integration

**Verifies**: hotel knowledge reads from Supabase documents table; hotel routing by `pms_hotel_id`; account-scoped isolation.

### Test scenarios

**2.1 Knowledge from Supabase**
1. Open `http://localhost:3000/hotel/grand-hotel`
2. Ask: "Do you have a swimming pool?"
3. Expected: response mentions heated indoor pool on B1, spa hours — data from Supabase `documents` table, **not** the hardcoded `grand-hotel.ts` file
4. Ask: "What is your cancellation policy?"
5. Expected: mentions 24-hour free cancellation — from Supabase

**2.2 Second hotel routing**
1. Navigate to `http://localhost:3000/hotel/hotel-bernstein`
2. Ask: "Was kostet das Frühstück?" (German)
3. Expected: responds in German, mentions €18, buffet hours — from Hotel Bernstein Supabase docs

**2.3 Data isolation**
1. In Hotel Bernstein chat: "Do you have a swimming pool?"
2. Expected: says no pool at Hotel Bernstein (Grand Hotel Vienna's pool must not appear)
3. Ask Grand Hotel about "BernsteinGuest" wifi network
4. Expected: Grand Hotel says it doesn't know that network

**2.4 Fallback to hardcoded registry**
1. (Simulation only) — set `NEXT_PUBLIC_SUPABASE_URL=` to empty, restart server
2. Navigate to `http://localhost:3000/hotel/grand-hotel`
3. Expected: app still works using hardcoded `grand-hotel.ts` config
4. Restore env and restart

---

## Phase 3: Conversation Persistence

**Verifies**: conversations and messages written to Supabase; escalation recorded.

### Test scenarios

**3.1 Conversation creation**
1. Open `http://localhost:3000/hotel/grand-hotel`
2. Send any message
3. In Supabase Table Editor → `conversations` table: confirm a new row appeared with `hotel_id` matching the account ID, `status: active`

**3.2 Message persistence**
1. Send 3 messages in the chat
2. In Supabase → `messages`: confirm 6 rows (3 user + 3 assistant) with correct `role`, `content`, `language`, `escalation`

**3.3 Escalation persistence**
1. Send: "I need help right now, this is an emergency!"
2. Expected in UI: red escalation indicator, handoff message
3. In Supabase → `conversations`: confirm `status = 'escalated'`, `escalation_level = 3`

**3.4 Fire-and-forget (write failure tolerance)**
1. Temporarily disconnect Supabase (invalid key in env)
2. Send a chat message
3. Expected: guest still receives AI response; server logs show persistence error but no 500 to client

---

## Phase 4: Verification & Multi-Hotel

### Latency (TASK-latency-verify) — Results

- p50 = 5056ms, p95 = **7911ms**, max = 7911ms
- **PASS** — budget ≤ 8000ms at p95
- Supabase timing: run `grep "\[timing:" server logs` to see per-step breakdown

### Security (TASK-security-audit) — Results

- `ANTHROPIC_API_KEY` referenced only in `app/api/chat/route.ts:14` (server-side route)
- No Anthropic SDK imports in any `app/` client components
- Chat token (`x-chat-token` header) validated on every request via HMAC-SHA256
- Rate limiter: in-memory per IP, resets on server restart

**Manual check**: open browser DevTools → Network → send a chat message → confirm no API key appears in request or response headers/body.

### Escalation signal (TASK-escalation-signal-verify) — Results

- 20/20 META tags parsed successfully
- Emergencies (break-in, medical, fire): level=3, handoff=True ✓
- Normal requests: level=0 ✓
- Note: taxi/transport requests show occasional false-positive level=2 (service-request sensitivity)

**Manual check**: send "Someone is trying to break into my room!" → confirm red escalation + handoff message in UI.

---

## Phase 5: Resilience, History & Compliance

### Conversation continuity

1. Send 3 messages to Grand Hotel
2. Note the `conversationId` from the network response
3. Reload the page
4. Send a follow-up referencing an earlier message (e.g., "What did you just say about the pool?")
5. Expected: Claude references prior context from Supabase history (not just the current turn)

### Graceful degradation

**Supabase unreachable (hotel knowledge)**:
1. Temporarily break Supabase URL in env, restart
2. Send a message to `grand-hotel`
3. Expected: server logs `[loader] Supabase unreachable, using hardcoded fallback` — response still works

**Claude API error**:
1. Temporarily use an invalid `ANTHROPIC_API_KEY`, restart
2. Send a message
3. Expected: guest receives `{ error: "AI service temporarily unavailable.", code: "AI_SERVICE_ERROR" }` — no stack trace in response

### Log PII audit

1. Start dev server with `npm run dev` 
2. Send several messages including messages with a guest name in the text (e.g., "Hi, I'm Maria")
3. Check terminal logs
4. Expected: logs contain only timing, request IDs, and error messages — no guest message content, no names

### GDPR deletion

See `4-deploy/runbooks/gdpr-deletion.md` for the step-by-step deletion procedure.

### Knowledge management

See `4-deploy/runbooks/knowledge-management.md` for how to add/update/deactivate knowledge entries without code changes.
