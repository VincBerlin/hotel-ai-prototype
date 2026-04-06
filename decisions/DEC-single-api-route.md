# DEC-single-api-route: A single POST /api/chat route orchestrates the entire AI pipeline

**Status**: Active

**Category**: Architecture

**Scope**: backend

**Source**: [CON-serverside-ai-calls](../1-spec/constraints/CON-serverside-ai-calls.md), [REQ-SEC-api-key-server-only](../1-spec/requirements/REQ-SEC-api-key-server-only.md)

**Last updated**: 2026-04-03

## Context

The system needs to keep the Anthropic API key server-side and the integration surface minimal for hotel IT staff. Multiple specialised endpoints would distribute responsibility and increase surface area without benefit at prototype scale.

## Decision

All guest chat interactions flow through a single `POST /api/chat` Next.js API Route. This route is the only entry point for AI calls. It owns the full pipeline: validation → hotel loading → context building → prompt assembly → Claude call → post-processing → response. No other route calls Claude.

## Enforcement

### Trigger conditions

- **Design phase**: any proposed new AI endpoint must be evaluated against this decision.
- **Code phase**: when adding server-side functionality; when reviewing API surface changes.

### Required patterns

- All Claude API calls must originate from `app/api/chat/route.ts` or a server action it delegates to.
- The Anthropic client (`const anthropic = new Anthropic(...)`) is instantiated only in server-side files.
- `process.env.ANTHROPIC_API_KEY` is referenced only inside server-side modules.

### Required checks

1. Grep the codebase for `ANTHROPIC_API_KEY` — all occurrences must be in server-side files (no `'use client'`).
2. Grep for `new Anthropic(` — must only appear in server-side files.
3. Confirm no client component imports any module that references the Anthropic SDK.

### Prohibited patterns

- Client components calling Claude directly.
- Multiple API routes that each instantiate an Anthropic client.
- Passing the API key through an intermediate API response for client-side use.
