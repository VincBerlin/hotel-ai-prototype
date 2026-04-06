# GOAL-conversation-persistence: Conversation persistence and guest profiles

**Description**: All guest conversations are stored in Supabase and linked to guest profiles. Conversation history is retrievable for context, analytics, and staff review.

**Status**: Draft

**Priority**: Must-have

**Source stakeholder**: [STK-hotel-manager](../stakeholders.md)

## Success Criteria

- [ ] Every conversation and message is persisted to Supabase in real time
- [ ] Conversations are linked to a guest profile (by booking reference or identifier)
- [ ] Prior conversation history can be loaded and used as context in subsequent interactions
- [ ] Analytics (usage, escalation rates, knowledge gaps) can be computed from stored data

## Related Artifacts

- User stories: [US-retrieve-conversation-history](../user-stories/US-retrieve-conversation-history.md)
- Requirements: [REQ-F-conversation-persistence](../requirements/REQ-F-conversation-persistence.md), [REQ-F-conversation-history-context](../requirements/REQ-F-conversation-history-context.md)
