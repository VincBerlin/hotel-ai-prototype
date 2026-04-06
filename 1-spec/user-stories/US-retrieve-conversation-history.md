# US-retrieve-conversation-history: Retrieve and store conversation history

**As a** hotel manager, **I want** all guest conversations to be stored and linked to guest profiles, **so that** I can review interactions and compute usage analytics.

**Status**: Draft

**Priority**: Must-have

**Source stakeholder**: [STK-hotel-manager](../stakeholders.md)

**Related goal**: [GOAL-conversation-persistence](../goals/GOAL-conversation-persistence.md)

## Acceptance Criteria

- Given a guest conversation completes, then all messages are persisted to Supabase with timestamps, session IDs, and guest identifiers
- Given a returning guest starts a new conversation, when prior history exists, then it can be loaded and used as context for the AI
- Given stored conversations, when analytics are computed, then escalation rates, message counts, and knowledge gap occurrences are derivable from the data
- Given any stored record, then it is scoped to the hotel account — no cross-account access is possible

## Derived Requirements

- [REQ-F-conversation-persistence](../requirements/REQ-F-conversation-persistence.md)
- [REQ-F-conversation-history-context](../requirements/REQ-F-conversation-history-context.md)
