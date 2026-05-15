# ROS Layer Model
Version: 1.0
Last updated: 2026-05-13

---

## Overview

Rubin OS runs across four distinct layers. Each layer has one job. Nothing should live in two layers. When in doubt, ask: "Will Claude need to _read this as an instruction_ or _act on this as a task_?" Instructions → Knowledge layer. Tasks → Operations layer.

```
┌─────────────────────────────────────────────────────┐
│  Layer 4: REASONING  (Claude Cowork)                 │
│  Active sessions · Plugin execution · Output         │
├─────────────────────────────────────────────────────┤
│  Layer 3: EXECUTION  (Google Workspace)              │
│  Gmail · Calendar · Drive · Live communication       │
├─────────────────────────────────────────────────────┤
│  Layer 2: OPERATIONS (Notion)                        │
│  Tasks · Deals · Dashboards · Relational state       │
├─────────────────────────────────────────────────────┤
│  Layer 1: KNOWLEDGE  (Obsidian / File system)        │
│  Instructions · Memory · Reference · Templates       │
└─────────────────────────────────────────────────────┘
```

---

## Layer 1 — Knowledge Layer (Obsidian / File System)

**What lives here**: Everything that defines HOW the system thinks and what it knows long-term.

| Content type | Examples | Path |
|---|---|---|
| Instruction files | CLAUDE.md, agent CLAUDE.md files | `/`, `/CoS/`, `/HV/`, etc. |
| System policy files | routing.md, identity-policy.md | `/00_System/` |
| Memory files | MEMORY.md, agent MEMORY.md files | `/`, `/EA/`, `/HV/`, etc. |
| Reference documents | Architecture guides, regulatory PDFs | `/EA/references/`, `/HV/references/` |
| Templates | Email templates, output formats | `/CoS/templates/`, etc. |
| Architecture records | HLDs, ADRs | `/EA/HLDs/`, `/EA/ADRs/` |
| Client context | CONTEXT.md per client | `/EA/clients/{client}/` |
| Deal notes | Asset notes, deal memos | `/HV/deals/` |

**Properties of the Knowledge layer:**
- Persistent — survives across sessions
- Local — stored in OneDrive, accessible offline
- Version-controllable — plain Markdown, no lock-in
- Authoritative — Claude reads these files on session start; they define behavior
- Slow-changing — content here is reviewed, not reactive

**Not for**: Live tasks, current project status, things that need filtering or querying. If you need to ask "what's the status of X today?" it belongs in Notion.

---

## Layer 2 — Operations Layer (Notion)

**What lives here**: Everything that represents the CURRENT STATE of work across all 7 domains.

| Content type | Examples | Notion database |
|---|---|---|
| Task registry | Assigned tasks, due dates, status | My Tasks |
| Deal pipeline | BRRRR properties, stages, values | HV Deal Pipeline |
| Client tracker | EA clients, engagements, deliverables | EA Client Dashboard |
| Project registry | Active projects per domain | Projects |
| Command center | Cross-domain daily view | Work Command Center |
| HV command center | Properties, tasks, financing radar | HollandVest Command Center |

**Properties of the Operations layer:**
- Live — updated continuously via Notion MCP and manual edits
- Relational — databases link to each other (tasks ↔ projects ↔ clients)
- Queryable — filtering, sorting, views, dashboards
- Collaborative — shareable with Joseph, partners, tenants if needed
- Volatile — state changes frequently; not the source of truth for behavior

**Not for**: Instructions to Claude, architectural decisions, reference documents, long-form knowledge. If Claude needs to follow a rule, it belongs in Obsidian.

---

## Obsidian vs Notion — The Definitive Distinction

| Question | Obsidian | Notion |
|---|---|---|
| "How should Claude behave?" | ✅ Yes — CLAUDE.md | ❌ No |
| "What is Claude working on today?" | ❌ No | ✅ Yes — Tasks DB |
| "What are Guy's routing preferences?" | ✅ Yes — routing.md | ❌ No |
| "What's the status of the bpost engagement?" | ✅ MEMORY.md (facts) | ✅ Client tracker (live) |
| "What template should Claude use for an ADR?" | ✅ Yes — template file | ❌ No |
| "How many deals are in the HV pipeline?" | ❌ No | ✅ Yes — Deal Pipeline DB |
| "What did Guy decide about refinancing strategy?" | ✅ Yes — HV/MEMORY.md | ❌ No |
| "What tasks are due this week?" | ❌ No | ✅ Yes — My Tasks |

**The rule in one sentence**: Obsidian is the system's _long-term memory and instruction set_. Notion is the system's _current operational state_.

### Why not just use one?

Obsidian fails at operations: no filtering, no relational queries, no dashboards, poor for "give me all tasks due this week across 7 domains."

Notion fails at instructions: Claude does not natively read Notion pages on session start; they are not version-controlled; behavioral rules in Notion drift and become stale without being noticed.

---

## Layer 3 — Execution Layer (Google Workspace)

**What lives here**: Live communication and scheduling.

| Tool | What it handles | MCP status |
|---|---|---|
| Gmail (bguy.rubin) | EA, CoS, KK, PAI, MKT email | Connected ✅ |
| Gmail (bhollandvest) | HV-only email | Connected ✅ |
| Google Calendar | Scheduling, time-blocking | Not connected ❌ |
| Google Drive | Documents in transit | Not connected ❌ |

**Properties**: Real-time, external-facing, ephemeral. Emails processed by Claude are captured as MEMORY.md facts or Notion tasks via session audit. Drive documents are downloaded to the knowledge layer once reviewed.

---

## Layer 4 — Reasoning Layer (Claude Cowork)

**What lives here**: Active session context, plugin execution, output generation.

**Properties**: Entirely ephemeral. Everything processed in a session disappears unless explicitly captured. This is why the session-audit protocol exists.

**What persists from a session**:
- Facts → written to MEMORY.md (Knowledge layer)
- Tasks → created or updated in Notion (Operations layer)
- Deliverables → saved as files in the file system (Knowledge layer)
- Emails → drafted and sent via Gmail (Execution layer)

---

## Ongoing Learning & Update Mechanism

### Trigger → Action → Destination

| Trigger | Action | Destination |
|---|---|---|
| Session ends | Run /session-audit | MEMORY.md (root or agent) |
| "Remember [X]" | Immediate write | MEMORY.md |
| Engagement completes | Update CONTEXT.md | EA or HV client folder |
| Architectural decision made | Write ADR | EA/ADRs/ |
| New routing pattern identified | Update routing.md | 00_System/routing.md |
| Task completed | Mark done in Notion | Operations layer |
| New deal enters pipeline | Create deal note | HV/deals/ + Notion pipeline |
| Voice/style learning | Update voice.md | Agent voice file |

### Memory freshness rules

| File | Update frequency | Staleness risk |
|---|---|---|
| Root MEMORY.md | Every session with new facts | Low — session-audit catches this |
| Agent MEMORY.md | Per domain session | Medium — only updated when agent is active |
| Client CONTEXT.md | Per engagement update | High — must be manually updated after key meetings |
| routing.md | When new routing patterns emerge | Low — stable once designed |
| Notion databases | Continuously via MCP | Low — live state |

### Obsidian → Notion sync (MVP)

For MVP, sync is **one-way and on-demand**: Obsidian is the source of truth. When Notion needs context (e.g., a project brief, client overview), Claude reads from Obsidian and writes to Notion manually.

Automated sync is deferred post-MVP. The risk of two-way sync before the system is stable is that conflicts between layers create confusion about which is authoritative.

---

## Layer violations to avoid

| Violation | Problem |
|---|---|
| Behavioral rules written in Notion | Claude won't read them on session start; they become stale |
| Current task lists in MEMORY.md | MEMORY.md is for facts, not task management; use Notion |
| Architecture decisions only in Notion | Not version-controlled; risk of loss or confusion |
| Emails stored in Obsidian (not processed) | Obsidian is for digested knowledge, not raw email |
| Session facts not captured in MEMORY.md | Lost on session end — the most common ROS failure mode |
