# REQ-F-journey-phase-context: Guest journey phase injected into AI context

**Type**: Functional

**Status**: Draft

**Priority**: Should-have

**Source**: [US-navigate-guest-journey](../user-stories/US-navigate-guest-journey.md)

**Source stakeholder**: [STK-hotel-guest](../stakeholders.md)

## Description

The current guest journey phase context must be reflected in the AI interaction. **Design note (2026-04-03):** In the current prototype design, Claude is only invoked during phase 2 (stay). Phases 0 (pre-arrival) and 1 (check-in day) display pre-composed static content — no Claude call is made. This requirement therefore applies exclusively to phase 2: guest context (name, room number) is injected into the system prompt via `guestContext`.

## Acceptance Criteria

- Given a guest is in phase 2 (stay), when a chat request is processed, then the system prompt includes the guest's name and room number via `guestContext`
- Given `guestContext` is provided, when Claude responds, then it addresses the guest by name where natural and is aware of their room
- Given phases 0 and 1, then no Claude call is made — static pre-composed content is displayed instead

## Related Constraints

- [CON-anthropic-api-only](../constraints/CON-anthropic-api-only.md) — phase awareness is achieved via context injection, not a separate routing layer
