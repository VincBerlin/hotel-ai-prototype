# DEC-single-api-route: Trail

> Companion to `DEC-single-api-route.md`.

## Alternatives considered

### Option A: Multiple specialised routes (e.g., /api/chat, /api/escalate, /api/knowledge)
- Pros: separation of concerns at the HTTP layer
- Cons: unnecessary complexity at prototype scale; multiple places where the API key could leak; harder to audit

### Option B: Single orchestrating route with internal module delegation (chosen)
- Pros: single security perimeter; easy to audit; minimal surface area for hotel IT; all pipeline steps are co-located and testable together
- Cons: route handler grows in responsibility (mitigated by small focused lib/ modules)

## Reasoning

Security and simplicity dominate at prototype scale. A single route is easier to rate-limit, audit, and secure. The pipeline complexity is managed through the module structure in `lib/`, not through HTTP routing.

## Human involvement

**Type**: ai-proposed/auto-accepted

**Notes**: Reflects the existing implementation choice.

## Changelog

| Date | Change | Involvement |
|------|--------|-------------|
| 2026-04-03 | Initial decision recorded from existing implementation | ai-proposed/auto-accepted |
