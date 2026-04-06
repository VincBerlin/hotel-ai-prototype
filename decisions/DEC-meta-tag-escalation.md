# DEC-meta-tag-escalation: Claude signals escalation and intent via embedded META tag

**Status**: Active

**Category**: Architecture

**Scope**: backend

**Source**: [REQ-F-escalation-detection](../1-spec/requirements/REQ-F-escalation-detection.md), [CON-anthropic-api-only](../1-spec/constraints/CON-anthropic-api-only.md)

**Last updated**: 2026-04-03

## Context

The system must classify every AI response with an escalation level (0–3) and detect intent and language — without a separate classifier model (CON-anthropic-api-only). The classification must be reliable enough for automated post-processing.

## Decision

Claude is instructed via the system prompt to append a structured `[META: ...]` tag to every response. The post-processor (`lib/post-processor.ts`) parses this tag to extract `intent`, `escalation`, and `language`. The tag is stripped before the response is shown to the guest.

Format: `[META: intent=<value>, escalation=none|low|high|critical, language=<ISO code>]`

## Enforcement

### Trigger conditions

- **Design phase**: any change to the system prompt structure or post-processor must preserve the META tag format and parsing contract.
- **Code phase**: when modifying `lib/system-prompt.ts` or `lib/post-processor.ts`; when adding new escalation levels or intent categories.

### Required patterns

- The system prompt must always include the META tag instruction at the end of the prompt.
- The post-processor must strip the tag using the regex: `/\[META:\s*intent=([\w_]+),\s*escalation=(\w+),\s*language=(\w+)\]/`
- If the tag is absent, fall back to safe defaults: `{ intent: 'question', escalation: 'none', language: 'en' }`.
- The escalation string-to-number mapping is: `{ none: 0, low: 1, high: 2, critical: 3 }`.
- Final `escalationLevel` is `Math.max(postProcessorLevel, preDecisionLevel)`.

### Required checks

1. After any system prompt change, verify the META tag is still present in Claude's output.
2. After any post-processor change, verify the regex matches the current META tag format.
3. Confirm the fallback is applied when Claude omits the tag (test with a short-response scenario).

### Prohibited patterns

- No separate ML classifier for intent or escalation.
- No parsing of escalation from the response body text (only from the META tag).
- Never expose the META tag in the guest-facing response.
