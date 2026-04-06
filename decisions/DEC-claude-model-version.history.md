# DEC-claude-model-version: Trail

> Companion to `DEC-claude-model-version.md`.

## Alternatives considered

### Option A: claude-opus-4 (rejected for prototype)
- Pros: highest capability
- Cons: higher cost; overkill for hospitality Q&A at prototype scale

### Option B: claude-haiku-4 (rejected)
- Pros: lowest latency and cost
- Cons: lower instruction-following reliability; META tag format compliance less consistent

### Option C: claude-sonnet-4 (chosen)
- Pros: strong instruction following; reliable META tag output; good balance of quality and cost
- Cons: higher cost than Haiku

## Reasoning

Sonnet-4 provides the reliability needed for consistent META tag escalation output and high-quality hospitality responses at an acceptable cost for prototype-scale usage.

## Human involvement

**Type**: ai-proposed/auto-accepted

**Notes**: Reflects the existing hardcoded model in `route.ts`.

## Changelog

| Date | Change | Involvement |
|------|--------|-------------|
| 2026-04-03 | Initial decision recorded from existing implementation | ai-proposed/auto-accepted |
