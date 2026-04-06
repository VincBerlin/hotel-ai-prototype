# US-ask-concierge-question: Ask the concierge a question

**As a** hotel guest, **I want** to ask the concierge a question in my own language, **so that** I get an accurate, helpful answer without calling the front desk.

**Status**: Draft

**Priority**: Must-have

**Source stakeholder**: [STK-hotel-guest](../stakeholders.md)

**Related goal**: [GOAL-intelligent-guest-assistance](../goals/GOAL-intelligent-guest-assistance.md)

## Acceptance Criteria

- Given a guest sends a message in any language, when Curt AI responds, then the reply is in the same language as the guest's message
- Given a guest asks about hotel facilities, policies, or local area, when Curt AI responds, then the answer is factually grounded in the hotel's knowledge base
- Given a guest receives a response, then the tone is brief, natural, and consistent with hospitality standards — never robotic or overly formal
- Given the guest sends a message, when the response is delivered, then the round-trip time is acceptable for a conversational interface

## Derived Requirements

- [REQ-F-language-detection-response](../requirements/REQ-F-language-detection-response.md)
- [REQ-F-knowledge-grounded-response](../requirements/REQ-F-knowledge-grounded-response.md)
- [REQ-PERF-response-latency](../requirements/REQ-PERF-response-latency.md)
