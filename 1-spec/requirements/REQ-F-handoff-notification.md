# REQ-F-handoff-notification: Staff handoff notification and guest acknowledgement

**Type**: Functional

**Status**: Draft

**Priority**: Must-have

**Source**: [US-request-human-help](../user-stories/US-request-human-help.md)

**Source stakeholder**: [STK-hotel-staff](../stakeholders.md)

## Description

When escalation level 3 is detected, the system must set `handoff: true` in the API response, display a "Staff member notified" indicator to the guest in the chat UI, and record the handoff event in the `messages` table in Supabase.

## Acceptance Criteria

- Given escalation level 3 is detected by the post-processor, when the API responds, then the response payload includes `handoff: true`
- Given `handoff: true` in the response, when the chat UI renders the message, then a "Staff member notified" label is visible below the message
- Given a handoff event, when it is persisted, then the `messages` table row includes escalation metadata (`escalation_level: 2`, `handoff: true`)
- Given the guest sees the handoff indicator, then the message clearly sets expectations that a staff member has been notified
