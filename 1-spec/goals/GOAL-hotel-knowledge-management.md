# GOAL-hotel-knowledge-management: Hotel knowledge management

**Description**: Hotel managers can define and maintain the knowledge base that Curt AI uses to answer guest questions. Changes to hotel information are reflected in AI responses without requiring code changes or redeployment.

**Status**: Draft

**Priority**: Must-have

**Source stakeholder**: [STK-hotel-manager](../stakeholders.md)

## Success Criteria

- [ ] Hotel knowledge (facilities, policies, local area, events, FAQs) is stored in Supabase, not hardcoded
- [ ] A manager can add, update, or remove knowledge entries
- [ ] Updated knowledge is used in subsequent AI responses without a deployment
- [ ] Knowledge is scoped per hotel account (no cross-account leakage)

## Related Artifacts

- User stories: [US-update-hotel-knowledge](../user-stories/US-update-hotel-knowledge.md)
- Requirements: [REQ-F-knowledge-base-from-supabase](../requirements/REQ-F-knowledge-base-from-supabase.md)
