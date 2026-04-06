# DEC-hardcoded-hotel-config: Hotel config is hardcoded in TypeScript; migration to Supabase is the next integration step

**Status**: Active

**Category**: Architecture

**Scope**: backend

**Source**: [REQ-F-knowledge-base-from-supabase](../1-spec/requirements/REQ-F-knowledge-base-from-supabase.md), [REQ-F-hotel-routing](../1-spec/requirements/REQ-F-hotel-routing.md), [CON-supabase-backend](../1-spec/constraints/CON-supabase-backend.md)

**Last updated**: 2026-04-03

## Context

Hotel config (facilities, policies, FAQs, local area, escalation rules) is currently loaded from TypeScript files in `lib/hotels/`. This was acceptable to get the prototype running but violates `REQ-F-knowledge-base-from-supabase` and prevents managers from updating content without a redeployment.

## Decision

The current hardcoded hotel config in `lib/hotels/` is a temporary prototype measure. The Hotel Loader (`lib/knowledge-base/loader.ts`) must be migrated to fetch hotel config from Supabase (`accounts`, `knowledge_bases`, `documents`) as the next integration step. No new hotel config should be added to TypeScript files after this decision is recorded.

## Enforcement

### Trigger conditions

- **Design phase**: any change to the Hotel Loader or hotel routing design must account for Supabase as the source of truth.
- **Code phase**: when implementing `REQ-F-knowledge-base-from-supabase` or `REQ-F-hotel-routing`; when adding a new hotel config.

### Required patterns

- Hotel config must be fetched by `hotel_id` from Supabase `accounts` + `knowledge_bases` + `documents`.
- All queries must filter by `hotel_id` (and `account_id` where applicable).
- Only `active: true` documents should be fetched.
- The fetched data must be transformed into `HotelKnowledge` via the Knowledge Mapper before use.

### Required checks

1. Confirm no new hotel config is added to `lib/hotels/` after migration begins.
2. Verify the Knowledge Mapper produces equivalent output from Supabase data as from the hardcoded config.
3. Test that a 404 is returned when `hotel_id` does not match any Supabase account.

### Prohibited patterns

- Adding new hardcoded hotel configs to `lib/hotels/` after the migration is underway.
- Bypassing the Hotel Loader to read hotel config directly from TypeScript files in new code.

## Related Temporary Measures

Weather (`lib/context/weather.ts`) and local events (`lib/context/events.ts`) also return mock data. These are in the same category as hardcoded hotel config — acceptable for prototype validation, to be replaced with live or configurable data in a later phase.
