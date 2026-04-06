# REQ-F-hotel-routing: Hotel context routing by hotelId

**Type**: Functional

**Status**: Draft

**Priority**: Must-have

**Source**: [US-onboard-new-hotel](../user-stories/US-onboard-new-hotel.md)

**Source stakeholder**: [STK-curt-ai-team](../stakeholders.md)

## Description

The system must route every request to the correct hotel context based on the `hotelId` URL parameter (`/hotel/[hotelId]`). The hotel configuration must be resolvable from Supabase by `hotelId` without any code change or redeployment.

## Acceptance Criteria

- Given a request to `/hotel/grand-hotel`, when the page loads, then the hotel config for `grand-hotel` is fetched from Supabase and used for all subsequent interactions
- Given an unknown `hotelId`, when the page loads, then a 404 response is returned
- Given a second hotel account exists in Supabase, when accessed via its `hotelId`, then its own knowledge base, name, and configuration are loaded — no code change required
- Given two simultaneous requests for different hotels, then each request resolves the correct hotel context independently

## Related Constraints

- [CON-supabase-backend](../constraints/CON-supabase-backend.md) — hotel config must be stored in and resolved from Supabase
- [CON-prototype-scope](../constraints/CON-prototype-scope.md) — multi-hotel routing must be architecturally supported even if only one hotel is active in the prototype
