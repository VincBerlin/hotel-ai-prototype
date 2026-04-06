# REQ-F-conversation-persistence: Persist all messages to Supabase

**Type**: Functional

**Status**: Draft

**Priority**: Must-have

**Source**: [US-retrieve-conversation-history](../user-stories/US-retrieve-conversation-history.md)

**Source stakeholder**: [STK-hotel-manager](../stakeholders.md)

## Description

Every guest message and AI response must be written to the `messages` table in Supabase. Writes are best-effort and non-blocking — they are enqueued after the Claude response is returned to the guest, via `Promise.allSettled` fire-and-forget. Write failures must not degrade the guest experience. Each record must include sufficient metadata for analytics and staff review.

## Acceptance Criteria

- Given a guest sends a message, when the API route processes it, then both the guest message and AI response are enqueued for writing to the `messages` table after the response is returned (fire-and-forget via `Promise.allSettled`)
- Given a message record is written, then it includes: `conversation_id`, `role` (user | assistant), `content`, `created_at`, `escalation_level`, and `handoff`
- Given a conversation exists, when a new session begins for the same guest, then a new `conversation_id` is created and linked to the same guest profile
- Given stored messages, when queried by `account_id`, then only messages belonging to that hotel are returned
- Given a Supabase write failure, then the error is logged server-side and the guest receives their AI response unaffected

## Related Constraints

- [CON-supabase-backend](../constraints/CON-supabase-backend.md) — all persistence must use Supabase
