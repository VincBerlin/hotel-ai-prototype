# ASM-claude-escalation-signal-parseable: Claude consistently outputs a parseable escalation signal

**Category**: Technology

**Status**: Unverified

**Risk if wrong**: High — if Claude does not reliably produce a structured escalation signal, the post-processor cannot classify responses; escalation logic would silently fail, leaving guests without handoff

## Statement

Claude consistently includes a structured escalation level signal (e.g., a JSON tag or delimited field) in its responses when instructed to do so via the system prompt, in a format the post-processor can reliably parse.

## Rationale

Claude follows structured output instructions reliably when the system prompt is explicit and examples are provided. The current post-processor parses escalation level from the response using a defined format.

## Verification Plan

Run 20+ diverse test messages including edge cases (complaints, emergencies, ambiguous requests). Verify the post-processor successfully extracts `escalationLevel` from every response. Confirm no false negatives (missed escalations) on obvious escalation triggers.

## Related Artifacts

- [GOAL-escalation-and-handoff](../goals/GOAL-escalation-and-handoff.md)
- [REQ-F-escalation-detection](../requirements/REQ-F-escalation-detection.md)
