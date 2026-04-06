# ASM-single-hotel-prototype-sufficient: A single-hotel prototype is sufficient to validate the core concept

**Category**: Business

**Status**: Unverified

**Risk if wrong**: Low — if a single hotel is insufficient to validate multi-hotel isolation or onboarding, a second hotel account can be added to the Supabase instance without code changes, per REQ-F-hotel-routing

## Statement

Building and validating the prototype with a single hotel account (Grand Hotel Vienna) is sufficient to prove the core AI concierge concept and inform the production architecture.

## Rationale

The core value proposition — intelligent guest interaction, escalation, knowledge grounding — is hotel-agnostic. Multi-tenancy is an infrastructure concern that is architecturally planned (account_id scoping) but does not need to be exercised to validate the guest experience.

## Verification Plan

After prototype validation, attempt to add a second hotel account via Supabase only (no code change). Confirm the routing, knowledge isolation, and chat interface all work for the second account per REQ-F-hotel-routing.

## Related Artifacts

- [CON-prototype-scope](../constraints/CON-prototype-scope.md)
- [GOAL-multi-hotel-platform](../goals/GOAL-multi-hotel-platform.md)
- [REQ-F-hotel-routing](../requirements/REQ-F-hotel-routing.md)
