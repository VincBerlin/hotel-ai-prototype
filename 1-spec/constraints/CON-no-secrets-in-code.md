# CON-no-secrets-in-code: No secrets in source code

**Category**: Operational

**Status**: Active

**Source stakeholder**: [STK-hotel-it](../stakeholders.md)

## Description

API keys, tokens, database credentials, and any other secrets must never appear in source code, committed files, or logs. All secrets are managed exclusively via environment variables in `.env.local` (local development) or the deployment platform's secret store (production).

## Rationale

Exposure of secrets in version control is an irreversible security incident. The Anthropic API key and Supabase credentials were briefly exposed during early development and required rotation — this constraint formalizes the prevention of recurrence.

## Impact

All code that accesses external services must read credentials from `process.env`. Secret presence must be validated at application startup. `.env.local` is in `.gitignore` and must never be committed.

## Derived Requirements

- [REQ-SEC-api-key-server-only](../requirements/REQ-SEC-api-key-server-only.md) — Anthropic API key and Supabase service role key must never appear in client code, responses, or logs
