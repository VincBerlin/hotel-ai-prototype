# GOAL-escalation-and-handoff: Reliable escalation and staff handoff

**Description**: Curt AI detects when a guest request exceeds its capabilities or requires human judgment and hands off to hotel staff clearly and reliably. No guest is left in a dead end.

**Status**: Draft

**Priority**: Must-have

**Source stakeholder**: [STK-hotel-staff](../stakeholders.md)

## Success Criteria

- [ ] Soft escalation (amber) is triggered for requests Claude can partially address but that warrant staff awareness
- [ ] Hard handoff (red) is triggered for requests that require direct human action
- [ ] Staff receive a structured, actionable handoff notification
- [ ] The guest is informed when a handoff has occurred
- [ ] No guest request results in a dead end or silent failure

## Related Artifacts

- User stories: [US-request-human-help](../user-stories/US-request-human-help.md)
- Requirements: [REQ-F-escalation-detection](../requirements/REQ-F-escalation-detection.md), [REQ-F-handoff-notification](../requirements/REQ-F-handoff-notification.md)
