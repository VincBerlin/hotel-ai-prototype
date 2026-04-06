# US-verify-security-posture: Verify the security posture of the integration

**As a** hotel IT staff member, **I want** to verify that the Curt AI integration handles secrets and API surface securely, **so that** I can confirm the system meets our security requirements without needing AI expertise.

**Status**: Draft

**Priority**: Must-have

**Source stakeholder**: [STK-hotel-it](../stakeholders.md)

**Related goal**: [GOAL-secure-integration](../goals/GOAL-secure-integration.md)

## Acceptance Criteria

- Given the Curt AI integration is deployed, when I inspect the browser network requests, then no Anthropic API key or Supabase service role key appears in any request or response
- Given the source code repository, when I search for hardcoded secrets, then none are found — all credentials are loaded from environment variables
- Given the API surface, when I review it, then only one public endpoint exists (`POST /api/chat`) and it enforces rate limiting and token validation
- Given the integration documentation, when an IT staff member reads it, then the security model (server-side AI calls, secret management, rate limiting) is understandable without AI knowledge

## Derived Requirements

- [REQ-SEC-api-key-server-only](../requirements/REQ-SEC-api-key-server-only.md)
