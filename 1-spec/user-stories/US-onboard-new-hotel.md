# US-onboard-new-hotel: Onboard a new hotel account

**As a** Curt AI team member, **I want** to onboard a new hotel account by adding a database record, **so that** no code change or redeployment is required.

**Status**: Draft

**Priority**: Should-have

**Source stakeholder**: [STK-curt-ai-team](../stakeholders.md)

**Related goal**: [GOAL-multi-hotel-platform](../goals/GOAL-multi-hotel-platform.md)

## Acceptance Criteria

- Given a new hotel account record is created in Supabase, when a request is routed for that hotel, then the system uses that hotel's isolated knowledge base and configuration
- Given two hotel accounts exist, then their conversations, knowledge bases, and guest profiles are fully isolated — no data leakage between accounts
- Given a hotel account is configured with a unique `hotelId`, then the Next.js routing resolves to the correct hotel context at `/hotel/[hotelId]`
- Given a new hotel is onboarded, then no existing hotel's behavior is affected

## Derived Requirements

- [REQ-F-hotel-routing](../requirements/REQ-F-hotel-routing.md)
