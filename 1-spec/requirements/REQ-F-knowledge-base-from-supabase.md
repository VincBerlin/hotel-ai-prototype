# REQ-F-knowledge-base-from-supabase: Hotel knowledge loaded from Supabase

**Type**: Functional

**Status**: Draft

**Priority**: Must-have

**Source**: [US-update-hotel-knowledge](../user-stories/US-update-hotel-knowledge.md)

**Source stakeholder**: [STK-hotel-manager](../stakeholders.md)

## Description

Hotel knowledge must be read from the `knowledge_bases` table in Supabase at request time. Knowledge must not be hardcoded in source files. All knowledge entries are scoped by `account_id` to prevent cross-hotel leakage.

## Acceptance Criteria

- Given a chat request is received, when the context builder runs, then it fetches active knowledge entries for the hotel's `account_id` from Supabase
- Given a manager adds or updates a knowledge entry in Supabase, when the next guest message is processed, then the updated knowledge is included in the AI context
- Given knowledge entries from two different hotel accounts exist, when a request is processed for hotel A, then only hotel A's knowledge is fetched
- Given a knowledge entry has no hardcoded equivalent in source, then it is still available to Claude via the fetched context

## Related Constraints

- [CON-supabase-backend](../constraints/CON-supabase-backend.md) — Supabase is the only permitted persistence layer for knowledge data
