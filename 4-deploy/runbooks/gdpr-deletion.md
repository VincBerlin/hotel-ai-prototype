# Runbook: GDPR Guest Data Deletion

**Audience**: Hotel IT staff or data protection officer  
**Prerequisite**: Supabase service role access (admin)  
**Related requirement**: [REQ-COMP-gdpr-guest-data](../../1-spec/requirements/REQ-COMP-gdpr-guest-data.md)

---

## Overview

This runbook documents how to fulfil a guest's **right to erasure** (GDPR Art. 17) or equivalent data deletion request. Guest data is stored across several Supabase tables, all scoped to a hotel `account_id`.

---

## What Counts as Personal Data

| Table | Personal data stored |
|-------|---------------------|
| `guest_profiles` | name, email, phone, nationality, preferred language, loyalty tier |
| `conversations` | guest_name, guest_room, language, status |
| `messages` | message content (user messages may contain personal details) |
| `bookings` | booking reference, room number, arrival/departure dates, guest name |
| `consent_records` | consent decisions linked to guest |
| `privacy_requests` | deletion/portability requests |

---

## Step 1 — Identify the Guest

Determine the `guest_profile_id` for the guest. You can find it by querying:

```sql
SELECT id, name, email, guest_identifier
FROM guest_profiles
WHERE account_id = '<your-account-id>'
  AND (
    name ILIKE '%<guest-name>%'
    OR email = '<guest-email>'
    OR guest_identifier = '<token-or-phone>'
  );
```

Note the `id` value — this is `<guest_profile_id>` used in the steps below.

---

## Step 2 — Delete Guest Data

Run the following SQL in order. All cascading deletes are handled by Supabase foreign key constraints where possible, but explicit deletion ensures no orphaned records remain.

```sql
-- 1. Delete messages (via conversations)
DELETE FROM messages
WHERE conversation_id IN (
  SELECT id FROM conversations
  WHERE guest_profile_id = '<guest_profile_id>'
);

-- 2. Delete conversations
DELETE FROM conversations
WHERE guest_profile_id = '<guest_profile_id>';

-- 3. Delete bookings
DELETE FROM bookings
WHERE guest_profile_id = '<guest_profile_id>';

-- 4. Delete consent records (if linked by guest_identifier or profile)
-- Note: adjust column name to match your consent_records schema
DELETE FROM consent_records
WHERE account_id = '<account-id>'
  AND guest_identifier = '<guest_identifier>';

-- 5. Delete the guest profile itself
DELETE FROM guest_profiles
WHERE id = '<guest_profile_id>';
```

---

## Step 3 — Verify Deletion

```sql
-- Confirm guest profile is gone
SELECT id FROM guest_profiles WHERE id = '<guest_profile_id>';
-- Expected: 0 rows

-- Confirm no orphaned conversations
SELECT id FROM conversations WHERE guest_profile_id = '<guest_profile_id>';
-- Expected: 0 rows

-- Confirm no orphaned messages
SELECT id FROM messages WHERE conversation_id IN (
  SELECT id FROM conversations WHERE guest_profile_id = '<guest_profile_id>'
);
-- Expected: 0 rows (conversations already deleted, so also 0)
```

---

## Step 4 — Record the Request (GDPR Art. 17 / Art. 30)

Log the deletion in `privacy_requests`:

```sql
INSERT INTO privacy_requests (
  account_id,
  request_type,
  guest_identifier,
  status,
  resolved_at,
  notes
) VALUES (
  '<account-id>',
  'erasure',
  '<guest-email-or-identifier>',
  'completed',
  now(),
  'Guest data deleted per GDPR Art. 17 request received <date>'
);
```

---

## Notes

- **Audit log** (`audit_log` table): is insert-only and cannot be deleted. This is intentional — the audit log records that a deletion occurred, not the personal data itself. This is compliant with GDPR Art. 30 (records of processing activities).
- **Backups**: If your Supabase project has point-in-time recovery enabled, the data may persist in backups. Document the backup retention period in your privacy policy.
- **Conversations without a guest profile**: Some conversations may have been created without a `guest_profile_id` (anonymous sessions). These can be identified and deleted by `hotel_id` + date range if the guest can provide the approximate time of their conversation.
