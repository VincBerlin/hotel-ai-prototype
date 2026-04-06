# Runbook: Phase 1 Manual Testing — Working Prototype

## Overview

Startup and manual test scenarios for the Phase 1 prototype. Verifies:
- Three-phase guest journey (pre-arrival, check-in day, stay)
- Chat interface with AI responses and escalation styling
- Language detection and matched responses
- Knowledge-grounded responses from hardcoded hotel config
- Escalation levels 0–3 detected and rendered (neutral / amber / red)
- Anthropic API key server-side only

## Prerequisites

- Node.js 18+ installed
- `.env.local` present in `3-code/ai-pipeline/` (or the worktree root) with:
  ```
  ANTHROPIC_API_KEY=sk-ant-...
  NEXT_PUBLIC_SUPABASE_URL=https://<ref>.supabase.co   # optional — omit to use hardcoded fallback
  SUPABASE_SERVICE_ROLE_KEY=...                         # optional
  ```
- Internet access (Anthropic API)

## Startup

```bash
cd 3-code/ai-pipeline   # or the worktree: .worktrees/feature/initial-build
npm install
npm run dev
```

Open `http://localhost:3000`.

Redirect to hotel page: `http://localhost:3000/hotel/grand-hotel`

Expected: page loads with hotel name "Grand Hotel Vienna" and phase stepper showing Phase 0 (Pre-Arrival).

---

## Test Scenarios

### S1 — Phase Navigation

**Goal:** All three journey phases load and show phase-appropriate content.

1. Open `http://localhost:3000/hotel/grand-hotel`
2. Verify: Phase 0 (Pre-Arrival) is active. Content block for pre-arrival is visible.
3. Click to Phase 1 (Check-in Day). Verify: phase stepper updates; check-in day content is visible.
4. Click to Phase 2 (Stay). Verify: chat interface is visible.

**Pass:** All three phases render without errors.

---

### S2 — Basic Knowledge Question (English)

**Goal:** AI responds using hotel knowledge from the hardcoded config.

1. Navigate to Phase 2 (Stay).
2. Type: `What time is check-in?`
3. Send message.

**Expected:**
- Response mentions **15:00** (check-in time from hotel config).
- Message bubble uses neutral styling (no escalation colour).
- No "Staff member notified" label.

**Pass:** Response contains correct check-in time; no escalation.

---

### S3 — Knowledge-Grounded Dining Question

**Goal:** AI uses dining knowledge from hotel config.

1. In Phase 2 chat, type: `Can I have dinner at your restaurant tonight?`

**Expected:**
- Response mentions **The Grand Restaurant**, dinner hours **18:30–22:30**, and that **reservations are required**.
- Formal tone.
- Neutral styling.

**Pass:** Response includes specific restaurant details from config.

---

### S4 — Language Detection (German)

**Goal:** AI detects German and responds in German.

1. In Phase 2 chat, type: `Wie lautet das WLAN-Passwort?`

**Expected:**
- Response is in **German**.
- Mentions WiFi network `GrandHotel_Guest` and password `welcome2024`.
- Neutral styling.

**Pass:** Response language matches input language.

---

### S5 — Escalation Level 1 (Amber) — Room Issue

**Goal:** Room issue triggers level-1 amber escalation.

1. In Phase 2 chat, type: `The air conditioning in my room is broken and I can't sleep.`

**Expected:**
- Response acknowledges the issue with empathy.
- Message bubble has **amber styling** (level 1).
- No "Staff member notified" label (level 1 = advisory only).

**Pass:** Amber bubble visible; no handoff label.

---

### S6 — Escalation Level 2 (Red) — Service Failure + Handoff

**Goal:** Service failure triggers level-2+ red escalation with handoff label.

1. In Phase 2 chat, type: `I ordered room service 90 minutes ago and it still hasn't arrived. This is completely unacceptable.`

**Expected:**
- Response is apologetic and offers resolution.
- Message bubble has **red styling** (level 2+).
- **"Staff member notified"** label is visible.

**Pass:** Red bubble and handoff label both visible.

---

### S7 — Emergency Escalation (Level 3)

**Goal:** Safety/emergency message triggers highest escalation.

1. In Phase 2 chat, type: `There is smoke coming from under the door in my room.`

**Expected:**
- Response treats this as an emergency with urgent tone.
- Message bubble has **red styling** (level 3).
- **"Staff member notified"** label is visible.

**Pass:** Immediate escalation to level 3; handoff label present.

---

### S8 — API Key Security Check

**Goal:** Confirm API key is never exposed to the browser.

1. Open browser DevTools → Network tab.
2. Send any chat message.
3. Inspect the request to `/api/chat` and its response.

**Expected:**
- Request body: `{hotelId, message, history, guestContext}` — no API key.
- Response body: `{reply, escalationLevel, handoff, intent, language}` — no API key.

4. Open DevTools → Console. Run:
   ```js
   document.documentElement.innerHTML.includes('sk-ant-')
   ```

**Expected:** `false`

**Pass:** `ANTHROPIC_API_KEY` is never visible in the browser at any point.

---

## Rollback

No state is persisted in Phase 1 (hardcoded config, no Supabase writes). Stop the dev server to tear down:

```bash
Ctrl+C
```

## Troubleshooting

| Symptom | Likely cause | Fix |
|---------|-------------|-----|
| Page loads but chat returns `500` | Missing `ANTHROPIC_API_KEY` in `.env.local` | Add the key and restart `npm run dev` |
| Response is `Hotel not found` | Wrong `hotelId` in URL | Use `/hotel/grand-hotel` |
| Chat does not appear in Phase 0/1 | Expected — chat only renders in Phase 2 (Stay) | Navigate to Phase 2 |
| Response language is wrong | Claude occasionally deviates; retry | Send the same message again |
