# DEC-hardcoded-hotel-config: Trail

> Companion to `DEC-hardcoded-hotel-config.md`.

## Alternatives considered

### Option A: Keep hardcoded config indefinitely
- Pros: no integration work; simple
- Cons: violates REQ-F-knowledge-base-from-supabase; managers cannot update content; breaks multi-hotel support

### Option B: Migrate immediately (before prototype validation)
- Pros: correct architecture from the start
- Cons: delays prototype validation; Supabase integration risk before core AI behaviour is proven

### Option C: Hardcoded for prototype, migrate as next step (chosen)
- Pros: prototype validated quickly; migration is well-defined and bounded
- Cons: temporary technical debt; must not be forgotten

## Reasoning

Validating the AI concierge behaviour took priority over infrastructure correctness. The Supabase schema is already in place; the migration is the next bounded development step. This decision formalises the plan and prevents drift.

## Human involvement

**Type**: ai-proposed/auto-accepted

**Notes**: Reflects the agreed development sequence from the project handoff document.

## Changelog

| Date | Change | Involvement |
|------|--------|-------------|
| 2026-04-03 | Initial decision recorded | ai-proposed/auto-accepted |
