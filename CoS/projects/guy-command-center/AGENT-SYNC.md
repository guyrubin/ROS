# Command Center — Agent Sync Contract

**Version:** 1.0 · **Updated:** 2026-05-31
**Purpose:** Make the Command Center a *voice agentic file system* — one shared state that Hermes (WSL), Claude (MCP), and the dashboard all read and write, with a queue that turns intents into real actions across Google, Notion, and ROS.

This file is the contract. Any agent touching the Command Center reads this first.

---

## 1. Source of truth

| File | Role | Writers |
| :--- | :--- | :--- |
| `state.json` | Canonical state — front seat, domains, tasks, signals, fitness, **clients**, integrations | Hermes, Claude, (dashboard proposes) |
| `state.json → actionQueue[]` | Intent queue — voice/dashboard requests that need an agent to execute | Dashboard + voice write; Hermes/Claude consume |
| ROS Markdown (`/EA`, `/HV`, …) | Durable knowledge | Agents, deliberately |
| `localStorage (cc3)` | Dashboard's live edit buffer only | Dashboard |

**Rule:** `state.json` wins over `localStorage`. The dashboard pulls `state.json` on load; local edits are a *proposal* until an agent commits them back.

---

## 2. Write protocol (avoid clobbering)

Every write updates `meta`:

```json
"meta": { "updatedAt": "<ISO8601>", "updatedBy": "claude|hermes|dashboard" }
```

- **Read → modify → write whole file.** Keep it valid JSON.
- **Last-write-wins**, but if `updatedAt` changed since you read it, re-read and re-apply your delta (don't overwrite blind).
- Hermes writes via WSL at `/home/guyru/ROS/CoS/projects/guy-command-center/state.json`.
- Claude writes via the file tools / MCP at the same path (Windows: `C:\Users\dguyr\ROS\...`).
- Commit message convention: `[hermes]` or `[claude] state: <what changed>`.

---

## 3. The agentic loop (voice → action → result)

```
Voice note / dashboard mic / ⌘K
        │  appends an intent
        ▼
state.json.actionQueue[]  →  Hermes or Claude picks it up
        │                         │ executes via the right connector
        │                         ▼
        └──────── writes result + status back, updates the UI state
```

### actionQueue item shape

```json
{
  "id": "uuid",
  "ts": "ISO8601",
  "source": "voice|dashboard|telegram",
  "verb": "calendar.create | gmail.draft | drive.folder | notion.upsert | task.add | note.promote | client.update | signal.add",
  "args": { "...": "verb-specific" },
  "domain": "EA|HV|...",
  "safety": 0,
  "status": "pending|done|blocked|rejected",
  "result": ""
}
```

### Verb registry (what agents execute)

| verb | Connector | Safety | Notes |
| :--- | :--- | :---: | :--- |
| `task.add` / `task.done` | state.json (+ Google Tasks when wired) | 2 | local state |
| `note.promote` | ROS Markdown | 2 | move durable fact into right domain note |
| `signal.add` | state.json | 0 | war/market/finance signal |
| `client.update` | state.json (+ Notion) | 2 | EA client status/milestone |
| `calendar.create` | Google Calendar (MCP) | **3** | **draft/confirm first** |
| `gmail.draft` | Gmail (MCP) | **3** | always draft, never send |
| `drive.folder` / `drive.doc` | Google Drive (MCP) | **3** | create engagement folders/docs |
| `notion.upsert` | Notion (MCP) | **3** | projects/clients/decision-log DBs |

**Safety gates** follow `/CLAUDE.md`: 0–2 auto, 3 external (confirm), 4 financial (confirm + amounts), 5 irreversible (explicit warning). The dashboard marks queued 3+ items `pending`; an agent surfaces them for Guy's yes/no before executing.

---

## 4. Voice entry points

1. **Telegram voice (primary, hands-free):** Guy sends a voice note → Hermes transcribes (Whisper) → parses to a verb → appends to `actionQueue` (and executes ≤ safety 2 immediately, queues 3+ for confirmation) → updates `state.json`.
2. **Dashboard mic (desk):** Web Speech API button captures speech → quick-capture to Brain Dump + appends an `actionQueue` intent tagged `source:dashboard`.
3. **Command grammar** (both): natural language, but these patterns route cleanly:
   - "front seat: <mission>" → `frontSeat.mission`
   - "block deep work / stretch / run [at <time>]" → `calendar.create`
   - "draft email to <person> about <x>" → `gmail.draft`
   - "client <name> is <green|amber|red> because <ctx>" → `client.update`
   - "remember <fact> in <domain>" → `note.promote`
   - "signal <red|amber|green>: <text>" → `signal.add`
   - "task: <text>" → `task.add`

---

## 5. EA client support (this engagement)

`state.json.clients[]` carries the active engagement. The contract for a new EA client:

1. **Scaffold (one-time, gated):**
   - `drive.folder` → create `EA — <Client> — Engagement` in Drive; store id in `clients[].drive`.
   - ROS folder `EA/clients/<id>/` for HLDs/ADRs/notes.
   - `notion.upsert` → client row in the EA/CoS projects DB; store url in `clients[].notion`.
2. **Identity:** EA comms send from `josephdoronrubin@gmail.com` (EA lead) or `bguy.rubin@gmail.com` per `/00_System/identity-policy.md`. Draft-first, always.
3. **Skills wired:** `architecture-review`, `hld-writer`, `adr-writer`, `prd-generator` (internal tooling). Palette buttons enqueue these.
4. **Cockpit:** dashboard renders the active client — phase, next decision, stakeholders, milestones, Drive/Notion deep links, RAG status.

---

## 6. Sync commands (Hermes/Claude)

- **Pull/refresh state:** read `state.json`, render/report.
- **Apply dashboard proposal:** Guy clicks "⤴ Push" → copies JSON or a `cc-apply` blob → paste to Hermes/Claude → agent validates + writes `state.json` + bumps `meta`.
- **Drain queue:** process `actionQueue` where `status:pending`, oldest first, respecting safety gates; write `result` + flip `status`.
- **Morning sync:** Hermes cron → Gmail triage + calendar → refresh `signals`, propose `frontSeat`, post top-5 to Telegram, update `state.json`.
- **Close day:** snapshot to `EA/CoS` daily note, reset fitness/sessions, archive done tasks.

---

## 7. Integration status (live in Claude/Cowork)

| Connector | Status | Surface |
| :--- | :--- | :--- |
| Gmail | **Live** | MCP (Claude) · Himalaya (Hermes) |
| Google Calendar | **Live** | MCP (Claude) · prefilled links (dashboard) |
| Google Drive | **Live** | MCP (Claude) |
| Notion | **Live** | MCP (Claude) |
| Google Tasks / Contacts | Planned | wire next |
| Client-side (Slack/Jira/Confluence/DevOps) | Confirm with client | scope per engagement |

> The dashboard itself is a static file and cannot call these APIs directly. **Agents are the actuators**; the dashboard renders state and proposes intents. That is the whole point of the agentic file system.
