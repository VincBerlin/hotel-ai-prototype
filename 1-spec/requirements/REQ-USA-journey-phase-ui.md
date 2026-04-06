# REQ-USA-journey-phase-ui: Guest journey phase reflected in the UI

**Type**: Usability

**Status**: Draft

**Priority**: Should-have

**Source**: [US-navigate-guest-journey](../user-stories/US-navigate-guest-journey.md)

**Source stakeholder**: [STK-hotel-guest](../stakeholders.md)

## Description

The guest-facing UI must visually reflect the current journey phase. Phase-appropriate pre-composed content (booking confirmation card, WhatsApp message, local recommendations) must be surfaced in the correct phase. A phase stepper must allow navigation between phases.

## Acceptance Criteria

- Given the guest journey UI loads, then a phase stepper shows the three phases (pre-arrival, check-in day, stay) with the current phase highlighted
- Given phase 0 (pre-arrival), then a booking confirmation card and WhatsApp welcome message are displayed
- Given phase 1 (check-in day), then local recommendations, events, and sport facilities are displayed
- Given phase 2 (stay), then the full chat interface is displayed
- Given the user advances to the next phase, then the UI transitions immediately without a page reload
