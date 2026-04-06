# REQ-REL-graceful-degradation: Graceful degradation on dependency failure

**Type**: Reliability

**Status**: Draft

**Priority**: Must-have

**Source**: [GOAL-intelligent-guest-assistance](../goals/GOAL-intelligent-guest-assistance.md)

**Source stakeholder**: [STK-hotel-guest](../stakeholders.md)

## Description

The system must degrade gracefully when non-critical dependencies (Supabase, history loading) are unavailable. The guest must always receive a response — even if degraded — rather than an unhandled error. The Claude API is the only hard dependency; its failure returns a structured error response.

## Acceptance Criteria

- Given Supabase is unreachable when loading conversation history, when the API route handles the failure, then it proceeds without history (stateless fallback) and logs the error server-side
- Given Supabase is unreachable when loading hotel knowledge, when the API route handles the failure, then it falls back to the hardcoded hotel registry (`lib/hotels/`) and logs the error server-side
- Given Supabase write operations fail after the Claude response, when `Promise.allSettled` resolves, then errors are logged and the guest response is unaffected
- Given the Claude API returns an error, when the API route catches it, then it returns a structured JSON error response (`500` with a guest-safe message) — no stack trace or internal detail is exposed
- Given any unhandled exception in the API route, then the response is a structured error with HTTP 500 — the server does not crash

## Related Constraints

- [CON-supabase-backend](../constraints/CON-supabase-backend.md) — fallback to hardcoded registry is permitted only when Supabase is unavailable
