# DEC-claude-model-version: claude-sonnet-4 is the designated Claude model

**Status**: Active

**Category**: Architecture

**Scope**: backend

**Source**: [CON-anthropic-api-only](../1-spec/constraints/CON-anthropic-api-only.md)

**Last updated**: 2026-04-03

## Context

The Anthropic API offers multiple models with different capability and cost profiles. The model is specified in `app/api/chat/route.ts`. An undocumented model choice creates ambiguity when upgrading or debugging.

## Decision

`claude-sonnet-4` (current pinned version: `claude-sonnet-4-20250514`) is the designated model for all Claude API calls in this project. Model upgrades require an explicit decision update and testing of the META tag format and escalation behaviour before deployment.

## Enforcement

### Trigger conditions

- **Code phase**: when modifying the Claude API call in `app/api/chat/route.ts`; when a new Claude model version is released and an upgrade is considered.

### Required patterns

- The model string in `anthropic.messages.create()` must always reference a `claude-sonnet-4` model.
- Model version is hardcoded in `route.ts`; do not read it from environment variables (keeps it auditable in code review).

### Required checks

1. After any model version change, re-run escalation tests to verify META tag format is still correctly produced and parsed.
2. Verify response quality on a representative set of test messages before promoting a new version.

### Prohibited patterns

- Using a different model family (e.g., Opus, Haiku) without updating this decision and re-testing.
- Reading the model version from an environment variable (obscures auditable config).
