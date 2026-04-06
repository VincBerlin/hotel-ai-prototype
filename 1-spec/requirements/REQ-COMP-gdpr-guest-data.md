# REQ-COMP-gdpr-guest-data: GDPR-compliant guest data handling

**Type**: Compliance

**Status**: Draft

**Priority**: Must-have

**Source**: [CON-supabase-backend](../constraints/CON-supabase-backend.md)

**Source stakeholder**: [STK-hotel-it](../stakeholders.md)

## Description

All guest data stored in Supabase must be handled in compliance with GDPR. Guest messages, conversation records, and profile data are personal data under GDPR and must be stored with a defined retention policy, processed only for the stated purpose, and never exposed beyond the hotel account that owns them.

## Acceptance Criteria

- Given a guest conversation stored in Supabase, then it is scoped to the hotel's `account_id` and inaccessible to other hotel accounts
- Given personal data stored (messages, guest profiles), then it is stored only in the EU Supabase region (or a region with adequate protection per GDPR Article 46)
- Given a hotel requests deletion of a guest's data, then all records linked to that guest's `guest_id` can be deleted via a documented procedure
- Given guest data is processed, then it is used exclusively for providing the AI concierge service — not for training, profiling beyond session context, or third-party sharing
- Given error logs on the server, then no guest message content or personally identifiable information appears in logs

## Related Constraints

- [CON-supabase-backend](../constraints/CON-supabase-backend.md) — data residency and access control rely on Supabase row-level security and region selection
