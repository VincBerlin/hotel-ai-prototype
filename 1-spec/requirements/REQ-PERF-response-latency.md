# REQ-PERF-response-latency: Response latency under 8 seconds at p95

**Type**: Performance

**Status**: Draft

**Priority**: Must-have

**Source**: [US-ask-concierge-question](../user-stories/US-ask-concierge-question.md)

**Source stakeholder**: [STK-hotel-guest](../stakeholders.md)

## Description

The `/api/chat` route must return a complete AI response within 8 seconds at p95 under normal single-user prototype load. Response streaming may be used to improve perceived latency for the guest.

## Acceptance Criteria

- Given a guest sends a message, when the API route completes, then the total server response time is under 8 seconds in 95% of requests
- Given streaming is implemented, when the first token arrives, then it does so within 3 seconds in 95% of requests
- Given normal prototype load (single concurrent user), then no timeout or gateway error occurs
