# CON-anthropic-api-only: Claude (Anthropic) as the sole AI layer

**Category**: Technical

**Status**: Active

**Source stakeholder**: [STK-curt-ai-team](../stakeholders.md)

## Description

Claude (Anthropic) is the only AI/LLM layer in the system. No other language model provider may be integrated. No keyword-matching, intent classification, or NLP pre-processing layer sits in front of Claude.

## Rationale

Curt AI's core design principle is that Claude owns language understanding, intent detection, tone, and escalation logic. Introducing a secondary model or pre-processing layer would fragment responsibility, increase complexity, and undermine the architecture's simplicity and testability.

## Impact

All AI-related features (language detection, intent handling, escalation, response generation) must be implemented as prompt and context engineering against the Claude API. TypeScript owns orchestration and post-processing only.

## Derived Requirements

- [REQ-F-escalation-detection](../requirements/REQ-F-escalation-detection.md) — escalation classification is Claude's sole responsibility via structured output; no secondary classifier permitted
- [REQ-F-language-detection-response](../requirements/REQ-F-language-detection-response.md) — language detection delegated entirely to Claude
