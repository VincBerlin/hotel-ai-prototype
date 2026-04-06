# REQ-F-knowledge-grounded-response: Knowledge-grounded AI responses

**Type**: Functional

**Status**: Approved

**Priority**: Must-have

**Source**: [US-ask-concierge-question](../user-stories/US-ask-concierge-question.md)

**Source stakeholder**: [STK-hotel-guest](../stakeholders.md)

## Description

Every AI response must be grounded in the hotel's knowledge base. Claude must not fabricate hotel-specific facts (room numbers, prices, opening hours, policies). If the requested information is not available in the knowledge base, Claude must acknowledge this and offer alternatives or suggest contacting the front desk.

## Acceptance Criteria

- Given the system prompt includes the hotel knowledge base, when Claude responds to a factual question, then the answer matches the knowledge base content
- Given the knowledge base does not contain the requested information, when Claude responds, then it states the information is unavailable and suggests an alternative (e.g., "Please contact the front desk")
- Given a guest asks about hotel facilities, then the response reflects the current knowledge base — not training data guesses

## Related Constraints

- [CON-anthropic-api-only](../constraints/CON-anthropic-api-only.md) — grounding is achieved via prompt context injection, not retrieval middleware
