# US-request-human-help: Request connection to a human staff member

**As a** hotel guest, **I want** to be connected to a real staff member when my request exceeds the AI's capabilities, **so that** I am never left without support.

**Status**: Draft

**Priority**: Must-have

**Source stakeholder**: [STK-hotel-guest](../stakeholders.md)

**Related goal**: [GOAL-escalation-and-handoff](../goals/GOAL-escalation-and-handoff.md)

## Acceptance Criteria

- Given a guest sends a request that requires human judgment or action, when Curt AI detects an escalation signal, then a handoff is triggered automatically
- Given a handoff is triggered, then the guest receives a clear message acknowledging the handoff and setting expectations
- Given a handoff is triggered, then hotel staff receive a structured notification with the guest's request and conversation context
- Given a request that partially warrants staff awareness, when Curt AI responds, then a soft escalation (amber) is flagged without stopping the conversation
- Given any guest interaction, then no request results in a silent failure or dead end

## Derived Requirements

- [REQ-F-escalation-detection](../requirements/REQ-F-escalation-detection.md)
- [REQ-F-handoff-notification](../requirements/REQ-F-handoff-notification.md)
