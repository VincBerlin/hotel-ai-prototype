# ASM-claude-language-detection: Claude reliably detects and mirrors guest language

**Category**: Technology

**Status**: Unverified

**Risk if wrong**: Medium — guests would receive responses in the wrong language, breaking the hospitality experience; a fallback language instruction would need to be added to the system prompt

## Statement

Claude reliably detects the language of a guest message and responds in the same language without explicit language-detection logic in TypeScript.

## Rationale

Claude's multilingual capabilities are well-documented and observed in testing. The system prompt instructs Claude to mirror the guest's language. No prior incidents of incorrect language detection have been observed in prototype testing.

## Verification Plan

Test with messages in 5+ languages (German, English, French, Italian, Spanish) in the running prototype. Confirm response language matches input in all cases.

## Related Artifacts

- [GOAL-intelligent-guest-assistance](../goals/GOAL-intelligent-guest-assistance.md)
- [REQ-F-language-detection-response](../requirements/REQ-F-language-detection-response.md)
