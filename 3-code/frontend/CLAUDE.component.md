# Frontend

**Responsibility**: Guest-facing UI — hotel page, guest journey phase stepper, chat interface. Renders phase-appropriate content and sends guest messages to the AI pipeline via REST.

**Technology**: Next.js 15, React, TypeScript, Tailwind CSS

**Source paths**: `app/hotel/[hotelId]/`, `app/layout.tsx`, `app/page.tsx`, `app/globals.css`

## Interfaces

- REST client → `ai-pipeline`: `POST /api/chat` — sends `{hotelId, message, history, guestContext}`, receives `{reply, escalationLevel, handoff, intent, language}`

## Requirements Addressed

| File | Type | Priority | Summary |
|------|------|----------|---------|
| [REQ-USA-journey-phase-ui](../../1-spec/requirements/REQ-USA-journey-phase-ui.md) | Usability | Should-have | Phase stepper UI reflects current phase; phase-appropriate content surfaced |
| [REQ-F-journey-phase-context](../../1-spec/requirements/REQ-F-journey-phase-context.md) | Functional | Should-have | Phase 2 only: guest context (name, room) passed to API via guestContext |
| [REQ-F-handoff-notification](../../1-spec/requirements/REQ-F-handoff-notification.md) | Functional | Must-have | Renders "Staff member notified" label when handoff: true in API response |
| [REQ-F-escalation-detection](../../1-spec/requirements/REQ-F-escalation-detection.md) | Functional | Must-have | Renders escalation level as neutral / amber / red message bubble styling |

## Relevant Decisions

| File | Title | Trigger |
|------|-------|---------|
| [DEC-single-api-route](../../decisions/DEC-single-api-route.md) | Single POST /api/chat orchestrates the AI pipeline | Any change to how the frontend communicates with the backend |
