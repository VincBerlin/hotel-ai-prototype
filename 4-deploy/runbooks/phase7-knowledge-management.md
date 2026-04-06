# Runbook: Phase 7 Manual Testing — Knowledge Management

Covers manual verification for Phase 7: Knowledge Editor (list, add, edit, toggle active). Extends the Phase 6 runbook.

---

## Prerequisites

- App running: `npm run dev` in `.worktrees/feature/initial-build/`
- Staff session active: logged in at `http://localhost:3000/staff/login`
- Supabase configured with `grand-hotel` account and at least one knowledge base
- `.env.local` contains `SUPABASE_SERVICE_ROLE_KEY` (required for admin writes from the knowledge API)

---

## 7.1 Knowledge List Page

**Verifies**: `/staff/knowledge` renders all documents grouped by category; active/inactive state displays correctly.

### Test scenarios

**7.1.1 Page loads**
1. Navigate to `http://localhost:3000/staff/knowledge`
2. Expected: page title "Knowledge Base", counter shows "N active · M inactive"
3. Items grouped under category headings (e.g., "Facilities", "Dining", "FAQ")
4. Each item shows title and a two-line preview of content

**7.1.2 Inactive items are dimmed**
1. If any inactive item exists: it renders at reduced opacity with an "inactive" label badge
2. The "Activate" button is shown instead of "Deactivate"

**7.1.3 Authentication guard**
1. Open an incognito window, navigate directly to `/staff/knowledge`
2. Expected: redirected to `/staff/login`

---

## 7.2 Edit Knowledge Item

**Verifies**: inline edit form opens; saving persists changes to Supabase; AI reflects the updated content in subsequent guest responses.

### Test scenarios

**7.2.1 Open inline edit**
1. Find any knowledge item, click "Edit"
2. Expected: the row expands into an edit form with fields pre-filled: Category, Language, Title, Content
3. A left-border accent (`border-l-2`) marks the active edit row
4. Other rows remain visible and unchanged

**7.2.2 Edit and save**
1. Modify the Title or Content of the item (e.g., change pool hours from "7:00–22:00" to "6:00–23:00")
2. Click "Save"
3. Expected:
   - Button shows "Saving…" briefly
   - Row returns to read-only view with the updated content
   - Toast notification: "Item saved"

**7.2.3 Cancel edit**
1. Open an edit form, make changes, click "Cancel"
2. Expected: form closes; original values preserved; no Supabase write

**7.2.4 Validation — empty fields**
1. Open edit form, clear the Title field entirely
2. Expected: "Save" button is disabled (cannot submit empty title)

**7.2.5 AI reflects updated content**
1. After saving a change (e.g., new pool hours), open the guest chat at `http://localhost:3000/hotel/grand-hotel`
2. Ask: "What time does the pool open?"
3. Expected: AI response uses the new hours (e.g., "6:00") — not the old value
4. Note: Supabase documents are fetched per-request; no cache invalidation required

---

## 7.3 Add New Knowledge Item

**Verifies**: add form creates a new document in Supabase; item appears in the grouped list immediately.

### Test scenarios

**7.3.1 Open add form**
1. Click "+ Add item" in the top-right of the page
2. Expected: an "Add item" form card appears above the grouped list
3. Fields: Category (dropdown), Language (text input, default "en"), Title, Content

**7.3.2 Create a new item**
1. Set Category: "services"
2. Title: "Airport shuttle service"
3. Content: "The hotel offers a private airport shuttle. Book at the concierge desk 24h in advance. Cost: €45 one-way."
4. Click "Save"
5. Expected:
   - Button shows "Saving…" briefly
   - Form closes
   - Toast: "Item added"
   - New item appears under "Services" category group
   - Page header counter increments (active count +1)

**7.3.3 Validation — empty fields**
1. Click "+ Add item", leave Title blank, click "Save"
2. Expected: "Save" button remains disabled

**7.3.4 Cancel add**
1. Open the add form, fill in some fields, click "Cancel"
2. Expected: form closes, fields reset to defaults, no item created

**7.3.5 AI responds to new item**
1. After adding the airport shuttle item, open guest chat
2. Ask: "How can I get to the airport from the hotel?"
3. Expected: AI answer includes the shuttle option and price from the new document

---

## 7.4 Toggle Active / Inactive

**Verifies**: deactivating an item hides it from AI context; reactivating restores it.

### Test scenarios

**7.4.1 Deactivate an item**
1. Find an active knowledge item, click "Deactivate"
2. Expected:
   - Button shows "…" briefly while saving
   - Item renders at reduced opacity with "inactive" badge
   - Button label changes to "Activate"
   - Toast: "Item deactivated"
   - Page counter updates (active count -1)

**7.4.2 AI ignores deactivated item**
1. Deactivate the item you edited in scenario 7.2.2 (e.g., pool hours)
2. In guest chat, ask: "When does the pool open?"
3. Expected: AI either says it doesn't have that information, or falls back to a general response — it does NOT cite the deactivated document

**7.4.3 Reactivate an item**
1. Click "Activate" on the inactive item
2. Expected:
   - Item returns to full opacity, badge removed
   - Button label reverts to "Deactivate"
   - Toast: "Item activated"

**7.4.4 AI resumes using reactivated item**
1. After reactivating the pool hours item, ask the guest chat again
2. Expected: AI returns the pool hours from the reactivated document

---

## 7.5 Category and Language Handling

**Verifies**: items are grouped correctly after edits; language field is preserved.

### Test scenarios

**7.5.1 Change category**
1. Edit an item currently in "FAQ", change Category to "Dining"
2. Save
3. Expected: item disappears from "FAQ" section, appears under "Dining"

**7.5.2 Language field**
1. Add a new item with Language set to "de" (German)
2. Expected: item saved with `language: "de"` in Supabase (verify via Table Editor)
3. Language field is informational — it does not change AI response language (language detection is handled separately by Claude)

---

## Startup Commands Reference

```bash
# From repo root
cd .worktrees/feature/initial-build
npm run dev

# Typecheck before committing
npm run typecheck

# Run all unit tests
npm test
```

---

## Troubleshooting

| Symptom | Likely cause | Fix |
|---------|-------------|-----|
| Knowledge page shows 0 items | `grand-hotel` has no knowledge_base or no documents | Insert a knowledge_base row for `grand-hotel` in Supabase, then insert documents |
| "Failed to save item" toast | Supabase service role key missing or incorrect | Check `SUPABASE_SERVICE_ROLE_KEY` in `.env.local` |
| AI still using old content after edit | Unlikely — loader is per-request. If persisting, verify the document `active` flag is `true` in Supabase Table Editor |
| Add form "Save" always disabled | Title or Content field is empty or contains only whitespace | Fill in both required fields |
