# Runbook: Phase 6 Manual Testing

Covers manual verification for Phase 6: Operations Inbox, Action Cards, Staff Auth, and Guest List. Extends the Phase 2–5 runbook.

---

## Prerequisites

- App running: `npm run dev` in `.worktrees/feature/initial-build/`
- `.env.local` contains `STAFF_PASSWORD` (dev default: `curt-staff-2024`)
- Supabase migration applied: `supabase/migrations/20260405_add_cases.sql`
  - If not applied, cases will not persist but the guest chat still works
- Browser with DevTools available (for cookie inspection)

---

## Applying the Supabase Migration

Before running Phase 6 tests, apply the cases table migration:

1. Open Supabase dashboard → SQL Editor
2. Paste the full contents of `supabase/migrations/20260405_add_cases.sql`
3. Run the query
4. Verify: table `cases` appears in Table Editor

---

## 6.1 Staff Authentication

**Verifies**: login page renders, password gate blocks unauthenticated access, cookie is set, logout clears session.

### Test scenarios

**6.1.1 Unauthenticated redirect**
1. Open `http://localhost:3000/staff/inbox` in a fresh incognito window
2. Expected: redirected to `/staff/login?from=/staff/inbox`

**6.1.2 Wrong password**
1. On login page, enter `wrongpassword`
2. Click "Sign in"
3. Expected: error message "Invalid password" appears, no redirect

**6.1.3 Correct login**
1. Enter `curt-staff-2024` (or your `STAFF_PASSWORD` value)
2. Click "Sign in"
3. Expected: redirected to `/staff/inbox`
4. In DevTools → Application → Cookies: `staff-session` cookie present, HttpOnly, 8h TTL

**6.1.4 Session persistence**
1. Refresh `http://localhost:3000/staff/inbox`
2. Expected: page loads without redirect (session valid)

**6.1.5 Logout**
1. In the staff sidebar, click "Sign out"
2. Expected: redirected to `/staff/login`
3. In DevTools → Cookies: `staff-session` cookie gone
4. Navigate to `http://localhost:3000/staff/inbox`
5. Expected: redirected to login again

---

## 6.2 Action Card Creation

**Verifies**: guest messages classified as service/problem/complaint/human create cases; info messages do not.

### Test scenarios

**6.2.1 Service request creates case**
1. Open `http://localhost:3000/hotel/grand-hotel`
2. Send: "Can you please bring extra towels to room 201?"
3. Expected AI response: friendly confirmation of the request
4. Open `/staff/inbox` (logged in)
5. Expected: new Action Card with type "Service Request", room or name visible, status "New"

**6.2.2 Problem report creates case**
1. In guest chat, send: "The air conditioning in my room is not working."
2. Expected AI response: apology + acknowledgement
3. In `/staff/inbox`: new card with type "Problem", status "New"

**6.2.3 Complaint creates case**
1. In guest chat, send: "I'm very unhappy — the check-in took 45 minutes."
2. In `/staff/inbox`: new card with type "Complaint"

**6.2.4 Human handoff creates case**
1. In guest chat, send: "I need to speak with the manager immediately."
2. Expected AI response: acknowledges escalation, staff will be in touch
3. In `/staff/inbox`: new card with type "Needs Staff", status "New"
4. In `/staff/guests`: the conversation shows status "escalated"

**6.2.5 Info message does NOT create case**
1. In guest chat, send: "What time does the restaurant open?"
2. Expected AI response: provides restaurant hours
3. In `/staff/inbox`: no new card appears for this message

---

## 6.3 Action Card Status Flow

**Verifies**: Accept → In Progress → Done flow; Escalate path; status badges update correctly.

### Test scenarios

**6.3.1 Accept a case**
1. In `/staff/inbox`, find a "New" Action Card
2. Click "Accept"
3. Expected: status badge changes to "Accepted", button label changes to "Start"

**6.3.2 Start a case**
1. Click "Start" on an accepted card
2. Expected: status badge → "In Progress", button label → "Mark Done"

**6.3.3 Mark done**
1. Click "Mark Done"
2. Expected: card becomes semi-transparent (opacity-60), action buttons disappear

**6.3.4 Filter: Done cases**
1. Click "Done" filter tab
2. Expected: only completed cards visible, count updates

**6.3.5 Escalate**
1. Find any non-done card, click "Escalate"
2. Expected: red "Escalated — staff handling" label replaces action buttons

**6.3.6 Filter tabs**
1. Test each tab: All open / New / In Progress / Escalated / Done
2. Expected: each tab shows only cases matching that status; "All open" excludes Done cases

---

## 6.4 Case Detail Page

**Verifies**: clicking a case title opens detail view; message thread shows; staff note saves.

### Test scenarios

**6.4.1 Open case detail**
1. In `/staff/inbox`, click the title of any Action Card
2. Expected: navigates to `/staff/inbox/<caseId>`
3. Page shows: type badge, status badge, room/name if present, action buttons

**6.4.2 Message thread**
1. On case detail page, scroll to "Conversation" section
2. Expected: guest messages appear on the right (dark background), AI messages on the left (grey)
3. Timestamps visible on each bubble

**6.4.3 Status actions in detail view**
1. Click "Accept" in the detail view header
2. Expected: status badge updates, buttons re-render for next step

**6.4.4 Staff note**
1. Type a note in the "Staff note" textarea: "Called guest, confirmed issue acknowledged"
2. Click "Save note"
3. Expected: button shows "Saving…" briefly, then returns to "Save note"
4. Reload the page
5. Expected: note persists

**6.4.5 Back navigation**
1. Click "← Back to Inbox"
2. Expected: returns to `/staff/inbox`

---

## 6.5 Guest List Page

**Verifies**: conversations appear in the guest list with correct metadata.

### Test scenarios

**6.5.1 Guest list populates**
1. Navigate to `/staff/guests`
2. Expected: table shows all conversations, each row has guest name (or "Anonymous"), room, channel, status, last activity

**6.5.2 Channel badge**
1. Conversations sent via web chat show "web" badge (neutral colour)
2. (WhatsApp not yet active — placeholder for Phase 9)

**6.5.3 Status badge**
1. Conversations with `human` classification show "escalated" badge (red)
2. Other conversations show "active" badge (neutral)

**6.5.4 Last activity**
1. Timestamps display as relative time (e.g., "2m ago", "1h ago")
2. Sorted by most recent activity first

---

## Startup Commands Reference

```bash
# From repo root
cd .worktrees/feature/initial-build
npm run dev

# Typecheck before committing
npm run typecheck

# Run all tests
npm test
```

---

## Environment Variables (Phase 6 additions)

| Variable | Required | Description |
|----------|----------|-------------|
| `STAFF_PASSWORD` | Yes | Shared password for staff login (V1). Min 8 chars recommended. |
| `CHAT_TOKEN_SECRET` | Yes | Used for both chat token signing AND staff session signing. |

All other variables unchanged from Phase 2–5 runbook.
