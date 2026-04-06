# REQ-SEC-api-key-server-only: Anthropic API key must remain server-side only

**Type**: Security

**Status**: Draft

**Priority**: Must-have

**Source**: [CON-serverside-ai-calls](../constraints/CON-serverside-ai-calls.md)

**Source stakeholder**: [STK-hotel-it](../stakeholders.md)

## Description

The Anthropic API key must only be accessed via `process.env.ANTHROPIC_API_KEY` in server-side code (Next.js API Routes or Server Actions). It must never be referenced in client components, exposed in API responses, or logged.

## Acceptance Criteria

- Given the codebase, when scanned for `ANTHROPIC_API_KEY`, then all occurrences are in server-side files only (files under `app/api/` or `lib/` without `'use client'`)
- Given an API response, then it never includes the API key or any secret value
- Given application logs, then no secret value appears in any log output
- Given a client component, then it has no access path to `process.env.ANTHROPIC_API_KEY`

## Related Constraints

- [CON-serverside-ai-calls](../constraints/CON-serverside-ai-calls.md) — all Claude API calls must run server-side
- [CON-no-secrets-in-code](../constraints/CON-no-secrets-in-code.md) — secrets via env vars only
