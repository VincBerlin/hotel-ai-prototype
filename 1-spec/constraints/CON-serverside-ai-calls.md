# CON-serverside-ai-calls: All Claude API calls must run server-side

**Category**: Technical

**Status**: Active

**Source stakeholder**: [STK-hotel-it](../stakeholders.md)

## Description

All calls to the Claude API must be made from server-side code (Next.js API Routes or Server Actions). The Anthropic API key must never be sent to or accessible by the browser.

## Rationale

Exposing the API key client-side would allow any visitor to make unauthorized API calls using the hotel's credentials, resulting in cost abuse and potential data leakage.

## Impact

The chat interface sends guest messages to `/api/chat` (a Next.js API Route), which constructs the prompt and calls Claude server-side. No Anthropic SDK usage is permitted in client components. Rate limiting and authentication must be enforced at the API route level.

## Derived Requirements

- [REQ-SEC-api-key-server-only](../requirements/REQ-SEC-api-key-server-only.md) — Anthropic API key must never reach the browser
