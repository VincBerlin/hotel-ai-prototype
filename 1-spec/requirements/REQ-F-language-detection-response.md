# REQ-F-language-detection-response: Language detection and matched response

**Type**: Functional

**Status**: Draft

**Priority**: Must-have

**Source**: [US-ask-concierge-question](../user-stories/US-ask-concierge-question.md)

**Source stakeholder**: [STK-hotel-guest](../stakeholders.md)

## Description

The system must detect the language of the guest's message and respond in the same language. Language detection and response language selection are handled entirely by Claude — no pre-processing NLP layer is permitted.

## Acceptance Criteria

- Given a guest message in German, when the AI responds, then the response is in German
- Given a guest message in English, when the AI responds, then the response is in English
- Given a guest message in any other language Claude supports, when the AI responds, then the response is in that language
- Given the system prompt, then it must instruct Claude to mirror the guest's language in every response

## Related Constraints

- [CON-anthropic-api-only](../constraints/CON-anthropic-api-only.md) — language detection is Claude's responsibility; no external NLP service permitted
