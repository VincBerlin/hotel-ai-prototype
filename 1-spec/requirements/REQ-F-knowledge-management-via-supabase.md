# REQ-F-knowledge-management-via-supabase: Hotel knowledge managed directly via Supabase

**Type**: Functional

**Status**: Draft

**Priority**: Must-have

**Source**: [US-update-hotel-knowledge](../user-stories/US-update-hotel-knowledge.md)

**Source stakeholder**: [STK-hotel-manager](../stakeholders.md)

## Description

For the prototype, hotel knowledge is managed directly through the Supabase dashboard (no custom admin UI). A hotel manager with Supabase access can insert, update, or deactivate knowledge entries in the `documents` table. Changes take effect on the next guest request — no code change or redeployment is required.

Note: a dedicated hotel admin UI is explicitly out of scope for the prototype (see [CON-prototype-scope](../constraints/CON-prototype-scope.md)).

## Acceptance Criteria

- Given a knowledge entry is updated in the Supabase `documents` table, when the next guest request is processed, then the AI response reflects the updated knowledge
- Given a new knowledge entry is inserted with the correct `account_id`, then it is included in AI responses for that hotel without a code change or redeployment
- Given a knowledge entry has `active = false`, then it is excluded from AI responses
- Given the Supabase dashboard is the management interface, then the `documents` table schema is documented sufficiently for a non-developer manager to add and edit entries

## Related Constraints

- [CON-prototype-scope](../constraints/CON-prototype-scope.md) — custom knowledge management UI is out of scope for the prototype
- [CON-supabase-backend](../constraints/CON-supabase-backend.md) — all knowledge stored in Supabase
