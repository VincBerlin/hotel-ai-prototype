# US-update-hotel-knowledge: Update the hotel knowledge base

**As a** hotel manager, **I want** to update the hotel's knowledge base, **so that** Curt AI's answers always reflect current information without requiring a developer.

**Status**: Draft

**Priority**: Must-have

**Source stakeholder**: [STK-hotel-manager](../stakeholders.md)

**Related goal**: [GOAL-hotel-knowledge-management](../goals/GOAL-hotel-knowledge-management.md)

## Acceptance Criteria

- Given a manager updates a knowledge entry in Supabase, when a guest asks a related question, then Curt AI's response reflects the updated information
- Given a manager adds a new knowledge entry, then it is available to Curt AI without a code change or redeployment
- Given knowledge entries exist in Supabase, then they are scoped to the hotel's account — no other hotel's knowledge is accessible
- Given the knowledge base is queried, then only active, non-expired entries are used in AI responses

## Derived Requirements

- [REQ-F-knowledge-base-from-supabase](../requirements/REQ-F-knowledge-base-from-supabase.md)
- [REQ-F-knowledge-management-via-supabase](../requirements/REQ-F-knowledge-management-via-supabase.md)
