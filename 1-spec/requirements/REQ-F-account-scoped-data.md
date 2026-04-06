# REQ-F-account-scoped-data: All data scoped by hotel account ID

**Type**: Functional

**Status**: Draft

**Priority**: Must-have

**Source**: [CON-prototype-scope](../constraints/CON-prototype-scope.md)

**Source stakeholder**: [STK-curt-ai-team](../stakeholders.md)

## Description

All data records in Supabase (conversations, messages, knowledge entries, guest profiles, analytics) must include an `account_id` foreign key. All queries must filter by `account_id`. This ensures the data model is ready for multi-tenancy even during the single-account prototype phase.

## Acceptance Criteria

- Given any table that stores hotel-specific data, then it has an `account_id` column referencing the `accounts` table
- Given a query for conversations, knowledge, or guest profiles, then it includes a `WHERE account_id = ?` filter
- Given two hotel accounts exist in the database, then a query scoped to account A never returns records belonging to account B
- Given the prototype runs with a single account, then the `account_id` filter is still applied on every query — no unscoped queries are permitted

## Related Constraints

- [CON-prototype-scope](../constraints/CON-prototype-scope.md) — prototype is single-account but schema must support multi-tenancy
- [CON-supabase-backend](../constraints/CON-supabase-backend.md) — scoping enforced at database query level
