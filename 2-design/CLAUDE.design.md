Phase-specific instructions for the **Design** phase. Extends [../CLAUDE.md](../CLAUDE.md).

## Purpose

This phase defines **how** we're building the system. Focus on architecture, data models, APIs, and key technical decisions.

## Files in This Phase

| File | Purpose |
|------|---------|
| [`architecture.md`](architecture.md) | System architecture overview and diagrams |
| [`data-model.md`](data-model.md) | Data structures, schemas, and relationships |
| [`api-design.md`](api-design.md) | API specifications and contracts |

---

## Decisions Relevant to This Phase

| File | Title | Trigger |
|------|-------|---------|
| [DEC-meta-tag-escalation](../decisions/DEC-meta-tag-escalation.md) | Claude signals escalation via embedded META tag | Any change to system prompt structure or post-processor |
| [DEC-hardcoded-hotel-config](../decisions/DEC-hardcoded-hotel-config.md) | Hotel config is hardcoded; migration to Supabase is next | Any change to Hotel Loader or hotel routing design |
| [DEC-single-api-route](../decisions/DEC-single-api-route.md) | Single POST /api/chat orchestrates the entire AI pipeline | Any proposed new AI endpoint or API surface change |
| [DEC-claude-model-version](../decisions/DEC-claude-model-version.md) | claude-sonnet-4 is the designated model | Any model version change or upgrade consideration |

---

## Linking to Other Phases

- Reference requirements from `1-spec/` to justify design choices
- Design documents guide implementation in `3-code/`
- Infrastructure design informs deployment in `4-deploy/`
