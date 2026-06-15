# ROS Layer Model
Version: 1.2
Last updated: 2026-06-14

## Overview

Rubin OS runs across four layers. Each layer has one job. Nothing should live in two layers. When in doubt, ask: "Will an agent need to read this as an instruction, remember it as durable context, act on it as live state, or execute it externally?"

```text
+------------------------------------------------------+
| Layer 4: REASONING                                   |
| Claude/Cowork, Codex, Hermes, future agents          |
| Active sessions, tool use, synthesis, file edits      |
+------------------------------------------------------+
| Layer 3: EXECUTION                                   |
| Gmail, Calendar, Drive, external portals, APIs        |
| Live communication and external side effects          |
+------------------------------------------------------+
| Layer 2: OPERATIONS                                  |
| Notion and operational dashboards                     |
| Tasks, deals, projects, relational current state      |
+------------------------------------------------------+
| Layer 1: KNOWLEDGE                                   |
| Obsidian / Markdown filesystem / GitHub               |
| Instructions, memory, references, templates, outputs  |
+------------------------------------------------------+
```

## Layer 1 - Knowledge Layer

**What lives here:** Everything that defines how ROS behaves and what it knows long term.

| Content type | Examples | Path |
|---|---|---|
| Cross-agent contract | Agent runtime rules, workspace paths | `/AGENTS.md` |
| Instruction files | Root and domain instruction surfaces | `/CLAUDE.md`, `/<domain>/CLAUDE.md` |
| System policy files | Routing, identity policy, filesystem contract | `/00_System/` |
| Memory files | Current facts and decisions | `/MEMORY.md`, `/<domain>/MEMORY.md` |
| Reference documents | Architecture guides, market references, regulatory material | `/<domain>/references/` |
| Templates | Email templates, ADR templates, output formats | `/<domain>/templates/` |
| Architecture records | HLDs, ADRs | `/EA/HLDs/`, `/EA/ADRs/` |
| Client context | Context per active client | `/EA/clients/{client}/` |
| Deal notes | Asset notes and deal memos | `/HV/03_Deals/`, `/HV/deals/` |

**Properties:** persistent, local, version-controllable, human-readable, model-agnostic, and authoritative.

**Not for:** live task queues, raw operational state, hidden agent memory, or connector-only data.

## Layer 2 - Operations Layer

**What lives here:** Current state of work across ROS domains.

| Content type | Examples | System |
|---|---|---|
| Task registry | Assigned tasks, due dates, status | Notion My Tasks |
| Deal pipeline | BRRRR properties, stages, values | Notion HV Deal Pipeline |
| Client tracker | EA clients, engagements, deliverables | Notion EA Client Dashboard |
| Project registry | Active projects per domain | Notion Projects |
| Command center | Cross-domain daily view | Notion Work Command Center |

**Properties:** live, relational, queryable, collaborative, and volatile.

**Not for:** behavior instructions, architectural decisions, long-form knowledge, or source-of-truth memory.

## Layer 3 - Execution Layer

**What lives here:** Live communication, scheduling, portals, and external actions.

| Tool | What it handles | Rule |
|---|---|---|
| Gmail | Email triage, drafts, replies, sends | Draft first; never send without explicit confirmation. |
| Calendar | Scheduling and time blocks | Confirm external changes before committing. |
| Drive / Docs / Sheets | Documents in transit | Promote durable reviewed outputs into ROS Markdown when useful. |
| Web portals / APIs | Forms, dashboards, vendor/client systems | Confirm irreversible or external side effects. |

**Properties:** real-time, external-facing, and often ephemeral.

## Layer 4 - Reasoning Layer

**What lives here:** Active agent sessions and runtime tools.

| Runtime | Role |
|---|---|
| Claude/Cowork | Interactive ROS reasoning and legacy instruction consumer. |
| Codex | Coding/file-system agent for direct workspace changes. |
| Hermes | WSL automation/runtime agent and scheduled jobs. |
| Future agents | Any LLM/runtime that follows `/AGENTS.md` and the filesystem contract. |

**Properties:** ephemeral by default. Anything useful must be written back to the correct lower layer.

## Workstations vs skills

Domains (`CoS`, `KK`, `HV`, `EA`, `PAI`, `MKT`, `FIN`) are **workstations** — places where ongoing work happens and context accumulates. A **skill/runbook** is a repeatable process that runs the same way each time. Put accumulating context in domain memory; put repeatable procedures in skills or runbooks, never in long root instructions.

## Obsidian vs Notion

| Question | Knowledge layer | Operations layer |
|---|---|---|
| "How should agents behave?" | Yes - instruction files | No |
| "What is due this week?" | No | Yes - task views |
| "What are Guy's routing preferences?" | Yes - `/00_System/routing.md` | No |
| "What is the current status of a client or deal?" | Yes for durable facts | Yes for live state |
| "What template should an agent use?" | Yes - template files | No |
| "How many deals are in the pipeline?" | No | Yes - pipeline database |
| "What did Guy decide about refinancing strategy?" | Yes - domain memory or decision note | Maybe as linked operational context |

**Rule:** Obsidian/Markdown is the long-term memory and instruction set. Notion is the current operational state.

## Ongoing Learning and Update Mechanism

Where new state belongs is defined once in the **Promotion rule** of `/00_System/agent-filesystem-contract.md` (on create) and the **decision table** of `/00_System/session-audit.md` (at wrap-up). Domain-specific destinations (ADRs → `/EA/ADRs/`, deals → `/HV/03_Deals/`, voice → `/<domain>/voice.md`) live in each domain's `CLAUDE.md`.

## Layer Violations to Avoid

| Violation | Problem | Fix |
|---|---|---|
| Behavioral rules written only in Notion | Agents will not reliably load them | Move to instruction files. |
| Current task lists in `MEMORY.md` | Memory becomes a stale task manager | Use Notion or a task import pack. |
| Architecture decisions only in Notion | Weak auditability and versioning | Write ADRs or decision notes. |
| Runtime-specific hidden memory | Breaks portability across LLMs | Promote durable context to Markdown. |
| Agent-specific copies of ROS | Creates split-brain context | Use the canonical workspace only. |
| Session facts not captured | Context disappears after the session | Run session audit and update memory. |
