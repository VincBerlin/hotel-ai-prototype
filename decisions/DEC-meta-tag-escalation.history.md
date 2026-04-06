# DEC-meta-tag-escalation: Trail

> Companion to `DEC-meta-tag-escalation.md`.

## Alternatives considered

### Option A: Separate classifier call (rejected)
Make a second Claude or ML API call to classify the response after generation.
- Pros: decoupled classification logic
- Cons: violates CON-anthropic-api-only; doubles latency; adds complexity

### Option B: Parse escalation from response body text (rejected)
Use regex or keyword matching on the guest-facing text to infer escalation.
- Pros: no prompt changes needed
- Cons: brittle; guest-facing text varies; false positives/negatives likely

### Option C: Structured JSON output from Claude (considered)
Ask Claude to return a JSON object with `reply` and `metadata` fields.
- Pros: clean separation; no stripping needed
- Cons: JSON output less reliable for free-text; harder to validate; more prompt complexity

### Option D: Embedded META tag (chosen)
Append a structured tag at the end of every response, stripped by post-processor.
- Pros: simple; single API call; reliable given explicit prompt instruction; easy to test
- Cons: tag occasionally omitted by Claude (handled by fallback)

## Reasoning

Option D minimises API calls and keeps the architecture simple (CON-anthropic-api-only). The tag format is explicit and testable. The fallback handles the rare omission case without breaking the user experience.

## Human involvement

**Type**: ai-proposed/auto-accepted

**Notes**: Decision derived from existing implementation in `lib/post-processor.ts` and `lib/system-prompt.ts`.

## Changelog

| Date | Change | Involvement |
|------|--------|-------------|
| 2026-04-03 | Initial decision recorded from existing implementation | ai-proposed/auto-accepted |
