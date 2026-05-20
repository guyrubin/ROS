# Email Project & Task Confirmation Automation

**Owner:** KK / Personal Ops  
**Status:** Design draft  
**Purpose:** Frequently scan connected mailboxes and produce a deduplicated confirmation list of projects and tasks Guy should approve, reject, delegate, or snooze.

---

## Goal

Create a frequent read-only email automation that:

1. Scans all connected Gmail accounts via Himalaya:
   - `bguy` → `bguy.rubin@gmail.com`
   - `hollandvest` → `bhollandvest@gmail.com`
   - `joseph` → `josephdoronrubin@gmail.com`
2. Extracts likely projects, tasks, follow-ups, deadlines, decisions, documents needed, and waiting-for items.
3. Groups related emails into project/task candidates.
4. Avoids duplicates across runs and across accounts.
5. Sends Guy a concise confirmation digest rather than creating/sending anything externally without review.

---

## Core principle

The automation is **read-only by default**.

It may generate a confirmation list and optionally write local/ROS/Notion task candidates, but it must not send emails or take external actions without explicit confirmation under the ROS identity policy.

---

## Recommended cadence

- **Frequent scan:** every 2 hours during the day.
- **Morning digest:** once daily around 08:00 with all open confirmations.
- **Optional urgent scan:** every 30 minutes only for high-signal unread email from known senders or emails with hard deadline language.

Initial implementation should start with **every 2 hours** to avoid noisy summaries.

---

## Data sources

### Email accounts

Use Himalaya CLI with structured JSON where possible:

```bash
HOME=/home/guyru himalaya --account bguy envelope list --folder INBOX --page-size 50 --output json
HOME=/home/guyru himalaya --account hollandvest envelope list --folder INBOX --page-size 50 --output json
HOME=/home/guyru himalaya --account joseph envelope list --folder INBOX --page-size 50 --output json
```

For candidate messages, read full content:

```bash
HOME=/home/guyru himalaya --account <account> message read <id>
```

**Note:** Hermes profile sessions may set `HOME=/home/guyru/.hermes/profiles/cos/home`; Himalaya config currently lives under `/home/guyru/.config/himalaya/config.toml`. Automation commands should either set `HOME=/home/guyru` explicitly or the config should be linked into the Hermes profile home.

---

## Candidate extraction rules

A message becomes a candidate if it contains one or more of:

- Explicit ask: “can you”, “please”, “need you to”, “action required”, “confirm”, “approve”, “send”, “review”.
- Deadline or time cue: “by Friday”, “today”, “tomorrow”, “before”, “due”, “deadline”, meeting date/time.
- Document cue: contract, invoice, attachment, onboarding, ID, passport, policy, permit, quote, proposal.
- Waiting-for cue: “we are waiting”, “pending”, “following up”, “next step”.
- Project/entity cue: Coca-Cola, ABN, Hollandvest, property addresses, notary, lender, tenant, contractor, client/workplace names.

Ignore or low-priority:

- Newsletters, marketing, receipts without action, automated status notifications, social media notifications, spam/promotions.

---

## Classification schema

Each extracted candidate should be normalized into this shape:

```json
{
  "candidate_id": "stable fingerprint",
  "source": {
    "account": "bguy|hollandvest|joseph",
    "folder": "INBOX",
    "message_id": "RFC Message-ID if available",
    "himalaya_id": "transient local envelope id",
    "thread_key": "normalized subject + participants",
    "date": "ISO date",
    "from": "sender",
    "subject": "subject"
  },
  "domain": "KK|EA|HV|FIN|PAI|MKT|CoS",
  "project": "short project/workstream name",
  "task": "actionable task phrased as a verb",
  "type": "task|decision|waiting_for|follow_up|document|meeting",
  "urgency": "urgent|soon|normal|low",
  "due_date": "ISO date or null",
  "confidence": 0.0,
  "recommended_action": "confirm|reject|snooze|delegate|draft_reply|file_only",
  "evidence": ["short quoted snippets"],
  "status": "needs_confirmation|confirmed|rejected|snoozed|done"
}
```

---

## Duplicate avoidance design

Use a small local SQLite state DB, e.g.:

`~/.hermes/profiles/cos/state/email_task_confirmation.sqlite`

### Tables

#### `processed_messages`

- `account`
- `message_id` — RFC Message-ID when available
- `thread_key`
- `content_hash`
- `first_seen_at`
- `last_seen_at`
- `last_himalaya_id`

Unique keys:

- `(account, message_id)` when `message_id` exists
- `(account, content_hash)` fallback

#### `task_candidates`

- `candidate_id` — stable fingerprint
- `task_fingerprint`
- `project_key`
- `domain`
- `task_text`
- `source_refs` — JSON list of message refs
- `status`
- `created_at`
- `updated_at`
- `last_presented_at`
- `snooze_until`

Unique key:

- `task_fingerprint`

### Fingerprinting strategy

`task_fingerprint = sha256(normalized(domain + project + task_intent + due_date + primary_counterparty))`

Normalization rules:

- Lowercase.
- Remove punctuation and common filler words.
- Strip reply prefixes: `re:`, `fw:`, `fwd:`.
- Collapse whitespace.
- Canonicalize known names/accounts.
- Map synonyms: approve/confirm/greenlight, review/check/look at.

### Cross-run behavior

- If the same message appears again: update `last_seen_at`, do not re-present.
- If a new reply in the same thread contains the same task: link source refs, do not duplicate.
- If a task changed materially, create a new candidate or update existing with a “changed since last digest” marker.
- If Guy confirms/rejects/snoozes a candidate, persist that status so it is not repeatedly shown.

---

## Confirmation digest format

The frequent automation should send only actionable deltas:

```markdown
## Mail-derived tasks to confirm

**New candidates:** 3  
**Changed candidates:** 1  
**Still waiting:** 2

### 1. Confirm ABN onboarding document upload
- Domain: EA
- Account: bguy
- From: example@example.com
- Due: tomorrow
- Evidence: “Please upload the signed form before…”
- Recommended action: confirm task
- Options: Confirm / Reject / Snooze / Draft reply

### 2. Review Hollandvest notary invoice
- Domain: HV / FIN
- Account: hollandvest
- From: notary@example.com
- Due: none found
- Evidence: “Attached invoice…”
- Recommended action: confirm task
```

No external email should be sent from this digest. If a reply is needed, the system should draft only after Guy selects “Draft reply” or explicitly asks.

---

## Implementation phases

### Phase 1 — Read-only digest

- Scan recent inbox messages across all accounts.
- Extract candidates.
- Store processed messages and task fingerprints in SQLite.
- Deliver Telegram confirmation digest to Guy.
- No Notion writes.

### Phase 2 — Confirmation commands

Add a lightweight way for Guy to respond:

- “Confirm 1”
- “Reject 2”
- “Snooze 3 until Friday”
- “Draft reply for 4”

Persist the selection in SQLite.

### Phase 3 — Task registry integration

After confirmation, optionally write confirmed items into Notion My Tasks or ROS task files.

Rules:

- Inspect target database first.
- Check existing tasks by fingerprint/title/source URL before writing.
- Keep source email reference and account.

### Phase 4 — Smarter threading and project memory

- Maintain project/workstream keys.
- Summarize per project: open tasks, waiting-for, next action.
- Escalate stale waiting-for items.

---

## Safety and identity constraints

- Reading/summarizing email is safety level 0.
- Creating local/ROS task candidates is safety level 2.
- Sending email is safety level 3 and requires explicit confirmation.
- Use the correct account identity per `/00_System/identity-policy.md`.
- Never auto-CC Joseph or mix Coca-Cola and ABN context unless Guy explicitly instructs it.

---

## Open decisions

1. Default cadence: every 2 hours, or more frequent?
2. Should confirmed tasks be written to Notion, ROS Markdown, both, or only sent as Telegram digest for now?
3. How far back should the first scan go: unread only, last 7 days, or last 30 days?
4. Should newsletters/promotions be excluded by folder/label, sender blocklist, or LLM classification only?

---

## Recommended first build

Build Phase 1 as a Hermes cron job with a Python pre-run script:

- Script collects envelopes/messages and manages SQLite deduplication.
- Agent turns collected candidate JSON into a concise Telegram digest.
- Delivery target: origin Telegram chat.
- Schedule: `every 2h`.

If the digest is too noisy, tighten extraction rules before adding Notion writes.
