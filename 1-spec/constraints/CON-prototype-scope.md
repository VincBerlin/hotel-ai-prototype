# CON-prototype-scope: Single-account prototype scope

**Category**: Business

**Status**: Active

**Source stakeholder**: [STK-curt-ai-team](../stakeholders.md)

## Description

The current build is a functional prototype for a single hotel account (Grand Hotel Vienna). Multi-tenant operation, real payment flows, and production SLA obligations are out of scope.

## Rationale

Validating the core guest interaction model and AI concierge behavior takes priority over building multi-tenant infrastructure. The prototype must prove the concept before scaling investment.

## Impact

Data isolation between hotel accounts, billing logic, and tenant management features are deferred. The data model must be designed to support multi-tenancy in the future (account scoping on all tables), but the runtime only needs to handle one account during the prototype phase.

## Related Requirements

- [REQ-F-account-scoped-data](../requirements/REQ-F-account-scoped-data.md) — derived from this constraint; enforces account_id scoping on all Supabase queries
