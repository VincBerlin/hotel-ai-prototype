# GOAL-multi-hotel-platform: Multi-hotel platform support

**Description**: The platform supports multiple hotel accounts with isolated data and independently configurable knowledge bases. A new hotel can be onboarded without code changes.

**Status**: Draft

**Priority**: Should-have

**Source stakeholder**: [STK-curt-ai-team](../stakeholders.md)

## Success Criteria

- [ ] All data (conversations, knowledge, guests, analytics) is scoped by hotel account ID
- [ ] No cross-account data leakage is possible at the database or API level
- [ ] A second hotel account can be onboarded by adding a database record, not by changing code
- [ ] Each hotel account has its own configurable knowledge base, tone settings, and escalation rules

## Related Artifacts

- User stories: [US-onboard-new-hotel](../user-stories/US-onboard-new-hotel.md)
- Requirements: [REQ-F-hotel-routing](../requirements/REQ-F-hotel-routing.md), [REQ-F-account-scoped-data](../requirements/REQ-F-account-scoped-data.md)
