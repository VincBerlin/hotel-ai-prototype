# REQ-F-escalation-detection: Escalation level classification

**Type**: Functional

**Status**: Draft

**Priority**: Must-have

**Source**: [US-request-human-help](../user-stories/US-request-human-help.md)

**Source stakeholder**: [STK-hotel-guest](../stakeholders.md)

## Description

The system must classify every AI response with an escalation level: 0 (normal), 1 (soft escalation / amber), 2 (amber-red, goodwill gesture), or 3 (critical / emergency, hard staff handoff). Classification uses two parallel signals: Claude's structured output (via META tag) and a rule-based pre-classifier. The final level is `Math.max(rule_level, model_level)`. No separate classifier model is permitted.

## Acceptance Criteria

- Given any AI response, when the post-processor runs, then it extracts an `escalationLevel` value of 0, 1, 2, or 3
- Given escalation level 0, then the response is displayed as a normal assistant message
- Given escalation level 1, then the response is displayed with amber styling as a soft escalation indicator
- Given escalation level 2, then amber-red styling is applied and a goodwill gesture may be offered; the conversation continues
- Given escalation level 3, then `handoff: true` is set and the hard handoff flow is triggered
- Given the system prompt, then it must include instructions for Claude to signal escalation level in a parseable format
- Given both a rule-based level and a model-signalled level, then the final escalation level equals `Math.max(rule_level, model_level)`

## Related Constraints

- [CON-anthropic-api-only](../constraints/CON-anthropic-api-only.md) — escalation classification is Claude's responsibility via structured output
