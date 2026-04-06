# ASM-supabase-latency-acceptable: Supabase query latency does not breach response time budget

**Category**: Technology

**Status**: Unverified

**Risk if wrong**: High — if Supabase queries add significant latency, the 8s p95 response time requirement (REQ-PERF-response-latency) may be breached; query optimization or caching would be needed

## Statement

Supabase queries for knowledge base retrieval and message persistence add less than 500ms to the total request lifecycle under prototype load.

## Rationale

Supabase runs on PostgreSQL with a managed REST layer. For small datasets (single hotel, hundreds of knowledge entries), query times are expected to be well under 500ms. The prototype operates under low concurrent load.

## Verification Plan

Instrument the `/api/chat` route to log Supabase query duration separately from Claude API duration. Verify combined overhead stays within budget during local testing.

## Related Artifacts

- [REQ-PERF-response-latency](../requirements/REQ-PERF-response-latency.md)
- [REQ-F-knowledge-base-from-supabase](../requirements/REQ-F-knowledge-base-from-supabase.md)
