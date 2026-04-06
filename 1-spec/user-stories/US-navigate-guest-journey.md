# US-navigate-guest-journey: Navigate the guest journey phases

**As a** hotel guest, **I want** to receive contextually relevant information at each stage of my stay, **so that** I feel guided and informed throughout my experience.

**Status**: Draft

**Priority**: Should-have

**Source stakeholder**: [STK-hotel-guest](../stakeholders.md)

**Related goal**: [GOAL-guest-journey-touchpoints](../goals/GOAL-guest-journey-touchpoints.md)

## Acceptance Criteria

- Given a guest is in the pre-arrival phase, when they interact with Curt AI, then the context includes booking confirmation details and arrival information
- Given a guest is in the check-in day phase, when they interact with Curt AI, then the context includes check-in instructions, room details, and local recommendations
- Given a guest is in the stay phase, when they interact with Curt AI, then a full conversational interface is available with access to hotel services and local knowledge
- Given a guest journey phase is active, then the UI reflects the correct phase and surfaces relevant pre-composed content (booking card, WhatsApp message, recommendations)

## Derived Requirements

- [REQ-F-journey-phase-context](../requirements/REQ-F-journey-phase-context.md)
- [REQ-USA-journey-phase-ui](../requirements/REQ-USA-journey-phase-ui.md)
