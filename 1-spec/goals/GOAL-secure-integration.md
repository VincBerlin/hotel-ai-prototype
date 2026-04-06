# GOAL-secure-integration: Secure, maintainable system integration

**Description**: The Curt AI integration is secure by design and easy to maintain by hotel IT staff. Secrets are managed safely, API surface is minimal, and the system can be embedded or updated without specialist AI knowledge.

**Status**: Draft

**Priority**: Must-have

**Source stakeholder**: [STK-hotel-it](../stakeholders.md)

## Success Criteria

- [ ] No secret or credential is ever exposed in source code, logs, or API responses
- [ ] All AI calls run server-side; the browser has no access to the Anthropic API key
- [ ] The integration surface is documented and minimal (a single API route)
- [ ] A hotel IT staff member can verify the security posture without reading AI-specific code

## Related Artifacts

- User stories: [US-verify-security-posture](../user-stories/US-verify-security-posture.md)
- Requirements: [REQ-SEC-api-key-server-only](../requirements/REQ-SEC-api-key-server-only.md), [REQ-COMP-gdpr-guest-data](../requirements/REQ-COMP-gdpr-guest-data.md)
