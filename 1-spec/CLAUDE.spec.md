Phase-specific instructions for the **Specification** phase. Extends [../CLAUDE.md](../CLAUDE.md).

## Purpose

This phase defines **what** we're building and **why**. Focus on clarity, measurability, and alignment with stakeholder needs.

## Phase artifacts

| Artifact | Location | Purpose |
|----------|----------|---------|
| Stakeholders | [`stakeholders.md`](stakeholders.md) | Roles with interests and influence |
| Goals | [`goals/`](goals/) | High-level outcomes |
| User Stories | [`user-stories/`](user-stories/) | User-facing capabilities |
| Requirements | [`requirements/`](requirements/) | Testable system requirements |
| Assumptions | [`assumptions/`](assumptions/) | Beliefs taken as true but not verified |
| Constraints | [`constraints/`](constraints/) | Hard limits on design and implementation |

---

## AI Guidelines

### Per-artifact guidance

**Stakeholders**: ask who uses, funds, operates, or is affected by the system. Record influence level honestly — it drives conflict resolution. Add entries to [`stakeholders.md`](stakeholders.md).

**Goals**: decompose vague ideas into concrete, measurable outcomes. Use MoSCoW priority consistently.
Status lifecycle: `Draft → Approved → Achieved → Deprecated`. Only a human can approve or deprecate. The agent marks `Achieved` when all success criteria are met (linked requirements implemented).

**User Stories**: use "As a [role], I want [capability], so that [benefit]." The role must be an existing stakeholder ID. Acceptance criteria at the story level are high-level; detailed criteria live in requirements.
Status lifecycle: `Draft → Approved → Implemented → Deprecated`. Only a human can approve or deprecate. The agent marks `Implemented` when all linked requirements reach `Implemented`.

**Requirements**: use clear, testable language (not "should be fast" — use "response time < 200ms at p95"). Choose the correct requirement class.
Requirement classes: `REQ-F` Functional, `REQ-PERF` Performance, `REQ-SEC` Security, `REQ-REL` Reliability, `REQ-USA` Usability, `REQ-MNT` Maintainability, `REQ-PORT` Portability, `REQ-SCA` Scalability, `REQ-COMP` Compliance.
Status lifecycle: `Draft → Approved → Implemented → Deprecated`. Only a human can approve or deprecate. The agent marks `Implemented` when all linked tasks reach Done.

**Assumptions**: always record the risk level (what happens if wrong?) and a verification plan when possible.
Status lifecycle: `Unverified → Verified | Invalidated`. The agent marks `Verified` when the verification plan confirms the assumption. Only a human can mark `Invalidated` (triggers impact analysis on dependent artifacts).

**Constraints**: consider technical (platforms, dependencies), business (budget, timeline, team size), and operational (hosting, compliance) categories.
Status lifecycle: `Active → Lifted`. Only a human can lift a constraint.

### Conflict resolution

A conflict exists when two or more requirements cannot both be satisfied as stated.

**Never resolve a conflict silently.** Always surface it before acting.

1. **Identify**: note conflicting requirement IDs, source stakeholders, influence levels, and why they are incompatible.
2. **Ask the user**: present what makes them incompatible, stakeholders and influence levels, two or more resolution options, and a recommended option if one is clearly better.
3. **Wait for explicit approval** before modifying any file.
4. **Apply**: update affected requirement files and index rows. Update dependent user stories or goals if affected. Record a decision if the resolution imposes a recurring constraint.
5. **Verify**: no artifacts remain in a conflicting state after resolution.

### Assumption invalidation

When an assumption is found to be wrong or no longer holds:

1. **Identify impact**: list all artifacts (requirements, user stories, decisions) that depend on the invalidated assumption.
2. **Ask the user**: present the invalidated assumption, the affected artifacts, and proposed adjustments or alternatives.
3. **Wait for explicit approval** before modifying any file.
4. **Apply**: change the assumption's Status to `Invalidated`. Update or flag all dependent artifacts as directed.
5. **Verify**: no artifacts remain based on the invalidated assumption without acknowledgment.

### Artifact deprecation

When an artifact (goal, user story, requirement) is no longer relevant:

1. Propose deprecation to the user with rationale and downstream impact.
2. Wait for explicit approval.
3. Change Status to `Deprecated` in the artifact file. Update its index row.
4. Check for dependent artifacts — flag any that reference the deprecated item.

---

## Decisions Relevant to This Phase

| File | Title | Trigger |
|------|-------|---------|
<!-- Add rows as decisions are recorded. File column: [DEC-kebab-name](../decisions/DEC-kebab-name.md) -->

---

## Linking to Other Phases

- Goals, user stories, constraints, assumptions, and requirements are referenced in design documents (`2-design/`)
- Requirements determine the development tasks in `3-code/tasks.md`; each task references the requirements it fulfills
- Acceptance criteria inform test cases (`3-code/`)

---

## Goals Index

| File | Priority | Status | Summary |
|------|----------|--------|---------|
| [GOAL-intelligent-guest-assistance](goals/GOAL-intelligent-guest-assistance.md) | Must-have | Approved | Guests get fast, accurate, natural-language answers in their own language |
| [GOAL-escalation-and-handoff](goals/GOAL-escalation-and-handoff.md) | Must-have | Draft | Reliable escalation detection and structured staff handoff |
| [GOAL-hotel-knowledge-management](goals/GOAL-hotel-knowledge-management.md) | Must-have | Draft | Managers maintain hotel knowledge base without code changes |
| [GOAL-guest-journey-touchpoints](goals/GOAL-guest-journey-touchpoints.md) | Should-have | Draft | Contextual engagement across pre-arrival, check-in, and stay phases |
| [GOAL-conversation-persistence](goals/GOAL-conversation-persistence.md) | Must-have | Draft | All conversations stored in Supabase, linked to guest profiles |
| [GOAL-multi-hotel-platform](goals/GOAL-multi-hotel-platform.md) | Should-have | Draft | Multi-account platform with isolated data per hotel |
| [GOAL-secure-integration](goals/GOAL-secure-integration.md) | Must-have | Draft | Secure, maintainable integration; no secrets exposed; server-side AI calls only |

---

## User Stories Index

| File | Role | Priority | Status | Summary |
|------|------|----------|--------|---------|
| [US-ask-concierge-question](user-stories/US-ask-concierge-question.md) | STK-hotel-guest | Must-have | Draft | Guest asks a question and gets an accurate, language-matched response |
| [US-request-human-help](user-stories/US-request-human-help.md) | STK-hotel-guest | Must-have | Draft | Guest is escalated to a human staff member when needed |
| [US-update-hotel-knowledge](user-stories/US-update-hotel-knowledge.md) | STK-hotel-manager | Must-have | Draft | Manager updates knowledge base; AI reflects changes without redeployment |
| [US-navigate-guest-journey](user-stories/US-navigate-guest-journey.md) | STK-hotel-guest | Should-have | Draft | Guest receives phase-appropriate content across pre-arrival, check-in, stay |
| [US-retrieve-conversation-history](user-stories/US-retrieve-conversation-history.md) | STK-hotel-manager | Must-have | Draft | All conversations persisted to Supabase and linked to guest profiles |
| [US-onboard-new-hotel](user-stories/US-onboard-new-hotel.md) | STK-curt-ai-team | Should-have | Draft | New hotel onboarded via database record; no code change required |
| [US-verify-security-posture](user-stories/US-verify-security-posture.md) | STK-hotel-it | Must-have | Draft | IT staff verifies security posture without AI expertise |

---

## Requirements Index

| File | Type | Priority | Status | Summary |
|------|------|----------|--------|---------|
| [REQ-F-language-detection-response](requirements/REQ-F-language-detection-response.md) | Functional | Must-have | Draft | Detect guest language; respond in the same language via Claude |
| [REQ-F-knowledge-grounded-response](requirements/REQ-F-knowledge-grounded-response.md) | Functional | Must-have | Approved | AI responses grounded in hotel knowledge base; no fabrication |
| [REQ-PERF-response-latency](requirements/REQ-PERF-response-latency.md) | Performance | Must-have | Draft | Complete response within 8s at p95; first token within 3s if streaming |
| [REQ-F-escalation-detection](requirements/REQ-F-escalation-detection.md) | Functional | Must-have | Draft | Every response classified with escalation level 0/1/2/3; Math.max(rule,model) |
| [REQ-F-handoff-notification](requirements/REQ-F-handoff-notification.md) | Functional | Must-have | Draft | Level-3 escalation triggers handoff flag, guest indicator, and DB record |
| [REQ-F-knowledge-base-from-supabase](requirements/REQ-F-knowledge-base-from-supabase.md) | Functional | Must-have | Draft | Knowledge fetched from Supabase at request time; not hardcoded |
| [REQ-F-conversation-persistence](requirements/REQ-F-conversation-persistence.md) | Functional | Must-have | Draft | All messages written to Supabase messages table per request |
| [REQ-SEC-api-key-server-only](requirements/REQ-SEC-api-key-server-only.md) | Security | Must-have | Draft | Anthropic API key server-side only; never in client code or responses |
| [REQ-F-hotel-routing](requirements/REQ-F-hotel-routing.md) | Functional | Must-have | Draft | Hotel context resolved from Supabase by hotelId; no code change needed |
| [REQ-F-journey-phase-context](requirements/REQ-F-journey-phase-context.md) | Functional | Should-have | Draft | Journey phase injected into Claude context to tailor responses per phase |
| [REQ-USA-journey-phase-ui](requirements/REQ-USA-journey-phase-ui.md) | Usability | Should-have | Draft | Phase stepper UI reflects current phase; phase-appropriate content surfaced |
| [REQ-F-account-scoped-data](requirements/REQ-F-account-scoped-data.md) | Functional | Must-have | Draft | All Supabase records include account_id; all queries filtered by account |
| [REQ-F-conversation-history-context](requirements/REQ-F-conversation-history-context.md) | Functional | Must-have | Draft | Prior messages loaded from Supabase and injected into Claude context |
| [REQ-REL-graceful-degradation](requirements/REQ-REL-graceful-degradation.md) | Reliability | Must-have | Draft | System degrades gracefully on Supabase/Claude failure; guest always gets a response |
| [REQ-COMP-gdpr-guest-data](requirements/REQ-COMP-gdpr-guest-data.md) | Compliance | Must-have | Draft | Guest data stored GDPR-compliant; scoped, deletable, EU region, no log leakage |
| [REQ-F-knowledge-management-via-supabase](requirements/REQ-F-knowledge-management-via-supabase.md) | Functional | Must-have | Draft | Knowledge managed via Supabase dashboard; no custom UI for prototype |

---

## Assumptions Index

| File | Category | Status | Risk | Summary |
|------|----------|--------|------|---------|
| [ASM-claude-language-detection](assumptions/ASM-claude-language-detection.md) | Technology | Unverified | Medium | Claude reliably detects and mirrors guest language without extra logic |
| [ASM-supabase-latency-acceptable](assumptions/ASM-supabase-latency-acceptable.md) | Technology | Unverified | High | Supabase queries add <500ms; stays within 8s response budget |
| [ASM-claude-escalation-signal-parseable](assumptions/ASM-claude-escalation-signal-parseable.md) | Technology | Unverified | High | Claude consistently outputs a parseable escalation signal |
| [ASM-single-hotel-prototype-sufficient](assumptions/ASM-single-hotel-prototype-sufficient.md) | Business | Unverified | Low | Single-hotel prototype sufficient to validate core concept |

---

## Constraints Index

| File | Category | Status | Summary |
|------|----------|--------|---------|
| [CON-anthropic-api-only](constraints/CON-anthropic-api-only.md) | Technical | Active | Claude is the sole AI layer; no other LLM or pre-processing allowed |
| [CON-prototype-scope](constraints/CON-prototype-scope.md) | Business | Active | Single-account prototype; multi-tenancy and payments deferred |
| [CON-supabase-backend](constraints/CON-supabase-backend.md) | Technical | Active | Supabase is the only persistence layer |
| [CON-no-secrets-in-code](constraints/CON-no-secrets-in-code.md) | Operational | Active | Secrets only via env vars; never in source code or logs |
| [CON-serverside-ai-calls](constraints/CON-serverside-ai-calls.md) | Technical | Active | All Claude API calls must run server-side; key never reaches the browser |
