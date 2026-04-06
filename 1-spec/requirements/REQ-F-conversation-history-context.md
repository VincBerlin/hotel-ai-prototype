# REQ-F-conversation-history-context: Load prior messages as Claude context

**Type**: Functional

**Status**: Draft

**Priority**: Must-have

**Source**: [US-retrieve-conversation-history](../user-stories/US-retrieve-conversation-history.md)

**Source stakeholder**: [STK-hotel-guest](../stakeholders.md)

## Description

When a guest sends a message in an ongoing conversation, the API route must load prior messages from Supabase and include them in the Claude context. This enables Claude to maintain continuity — referencing earlier questions, avoiding repetition, and building on prior answers.

## Acceptance Criteria

- Given a conversation with prior messages, when the API route builds the Claude request, then the N most recent prior messages are included as conversation history (user/assistant turns)
- Given a new conversation with no prior messages, when the API route builds the Claude request, then no history is injected and the system behaves normally
- Given a conversation history, then the total token count of injected history must not cause requests to exceed the Claude context limit; truncate oldest messages first if necessary
- Given a guest returns to an existing conversation, then Claude's responses demonstrate awareness of earlier context (no contradictions with prior answers)

## Related Constraints

- [CON-anthropic-api-only](../constraints/CON-anthropic-api-only.md) — history is injected as conversation turns into the Claude request, not processed by any secondary model
- [CON-supabase-backend](../constraints/CON-supabase-backend.md) — prior messages are loaded from the Supabase `messages` table
