# CON-supabase-backend: Supabase as the sole persistence layer

**Category**: Technical

**Status**: Active

**Source stakeholder**: [STK-curt-ai-team](../stakeholders.md)

## Description

Supabase is the only persistence layer. No alternative database (SQLite, MongoDB, Redis as primary store, etc.) may be introduced. All persistent data — conversations, messages, guest profiles, hotel knowledge, analytics — lives in Supabase (PostgreSQL).

## Rationale

Supabase provides PostgreSQL, row-level security, real-time subscriptions, and a REST/SDK interface in a managed environment. Choosing a single persistence layer reduces operational complexity and keeps the prototype focused.

## Impact

All data access code must use the Supabase client SDK or Supabase REST API. The initial schema (001_initial_schema.sql) has been successfully migrated. New data requirements must be expressed as Supabase migrations.

## Derived Requirements

- [REQ-F-conversation-persistence](../requirements/REQ-F-conversation-persistence.md) — all messages must be written to Supabase
- [REQ-F-knowledge-base-from-supabase](../requirements/REQ-F-knowledge-base-from-supabase.md) — hotel knowledge fetched from Supabase at request time
- [REQ-F-hotel-routing](../requirements/REQ-F-hotel-routing.md) — hotel context resolved from Supabase by hotelId
- [REQ-F-account-scoped-data](../requirements/REQ-F-account-scoped-data.md) — all Supabase records scoped by account_id
