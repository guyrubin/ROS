# AGENTS.md - Rubin OS Cross-Agent Contract

**Version:** 1.3
**Last updated:** 2026-06-14

Rubin OS (ROS) is a Markdown-first AI operating system shared by Claude/Cowork, Codex, Hermes, and future agents.

## Design principle

The filesystem is the stable context layer. Agents, models, tools, and runtimes may change; the ROS working tree remains the canonical interface for instructions, memory, routing, source context, and durable outputs.

**ROS is model- and runtime-agnostic.** Use the best tool for each job — Claude Code (interactive + MCP), Codex (bulk code/file edits), Gemini (generation, multimodal, large-context; both principals' subscriptions), Hermes (WSL automation + scheduled loops). No capability is locked to one vendor; the filesystem + `state.json` are the shared contract so any runtime can pick up another's work. The goal is to **get the most out of every connected subscription, across both principals** (see `/00_System/principals.md`).

See `/00_System/agent-filesystem-contract.md` for the full filesystem contract.

## Canonical workspace

- Windows path: `C:\Users\dguyr\ROS`
- WSL path: `/home/guyru/ROS`
- `/home/guyru/ROS` is a symlink to `/mnt/c/Users/dguyr/ROS`.
- GitHub source of truth and audit log: `https://github.com/guyrubin/ROS`.

All agents must operate on this single working tree. Do not create divergent ROS copies.

## Runtime registry

| Runtime | Primary path | Role | Commit identity |
|---|---|---|---|
| Claude/Cowork | `C:\Users\dguyr\ROS` | Interactive ROS agent and legacy instruction consumer | `claude-cowork <claude-cowork@rubin-os.local>` |
| Codex | `C:\Users\dguyr\ROS` | Coding/file-system agent in the shared Windows workspace | `codex-agent <codex@rubin-os.local>` |
| Hermes | `/home/guyru/ROS` | WSL automation/runtime agent over the same working tree | `hermes-agent <hermes@rubin-os.local>` |
| Gemini | `C:\Users\dguyr\ROS` / Gemini CLI · API | Model/runtime for generation, multimodal, and large-context work; Arbor model path (Vertex/AI-Studio); both principals' Gemini subscriptions | `gemini-agent <gemini@rubin-os.local>` |

## Division of labor (one ecosystem, not silos)

The runtimes are agnostic peers sharing the filesystem + Notion as the baton — each does what it's best at, hands off through shared state, never works in a silo:

| Runtime | Best at | Surfaces it owns | Hands off via |
| :-- | :-- | :-- | :-- |
| **Claude / Cowork** | Interactive reasoning, orchestration, cross-domain synthesis, design | MCP (Gmail/Notion/Calendar/Drive), the meshes | Markdown memory + `state.json` + Notion |
| **Codex** | Bulk code/file execution, large refactors, long edit runs | Code repos (Arbor), big mechanical edits | git + the filesystem tree |
| **Hermes** (WSL) | Scheduled automation, Google Workspace, the daily loops, Telegram | `cron/jobs.json`, `kanban.db`, Notion refresh, the HV scan, Google OAuth | writes back to `MEMORY.md` + Notion DBs |
| **Gemini** | Generation, multimodal, large-context | Arbor model path; gen tasks (both principals' subs) | outputs into the tree |

**The two human surfaces:** the **Notion Command Center** (`2b4f37e2-31fe-801c-8495-dea36d0efd4d`) is the canonical human cockpit + second brain (10 master DBs, per-domain dashboards, radar refresh); **ROS Markdown** is the agent-maintained durable knowledge. Notion DB IDs live in [`/00_System/notion_database_registry.md`](00_System/notion_database_registry.md). A runtime that runs a scheduled loop **must write its result back** to shared state (Markdown/Notion) — that write-back is what makes the four runtimes one ecosystem instead of four silos.

## Boot sequence (canonical)

This is the single source of truth for context loading. `/CLAUDE.md`, `/00_System/routing.md`, and every domain `CLAUDE.md` reference this sequence; they must not restate it.

**Eager — load every session, in order:**

1. `/AGENTS.md` (this file).
2. `/CLAUDE.md` — root instruction surface, regardless of model runtime.
3. `/MEMORY.md` — root current memory.
4. `/00_System/routing.md` — routing matrix.
5. `/00_System/principals.md` — confirm the **active principal** (Guy or Joseph): sets default identity, domain scope, and the confidentiality boundary.
6. `/00_System/companies.md` — confirm the **active company** (default: Guy / group). ROS is a multi-company group (Guy = CEO); this scopes routing, connectors, memory, and the per-company isolation boundary. Model: `/00_System/group-operating-model.md`.
7. Route the request, then load only the matched domain's `CLAUDE.md` + `MEMORY.md` (and the company's `COMPANY.md` if one applies — e.g. Arbor).

**Lazy — load only when the task needs it:**

| Load this file | When |
|---|---|
| `/00_System/agent-capabilities.md` | Before using a shared capability (web search, browser/computer use, multimodal, document intel, data automation). |
| `/00_System/connectors.md` | Before any connector action (Gmail, Notion, Calendar, etc.) or when reporting connector status. |
| `/00_System/agent-filesystem-contract.md` | When changing structure, storage, or agent contracts. |
| Domain `references/`, `templates/`, `projects/` | When the specific task requires that source/output. |
| `/00_System/session-audit.md` | At session wrap-up after meaningful ROS work. |

Capabilities and connectors are baseline inheritances — do not eager-load them at boot. Load on first use.

## Write model

- Durable facts and decisions live in Markdown.
- Operational dashboards/state may live in Notion.
- Binaries and sensitive personal files stay outside Git unless explicitly approved.
- GitHub records committed ROS state.
- Preserve path portability between Windows and WSL; avoid hard-coding runtime-specific absolute paths inside durable notes unless documenting runtime access.
- Prefer small, discoverable Markdown files over hidden agent memory. If an agent needs durable context, write it to the correct ROS file.

## Instruction vs memory rule

- Prescriptive behavior (`always`, `never`, `before doing X`) belongs in `CLAUDE.md`, `AGENTS.md`, system docs, or skills.
- Facts/status/context belongs in `MEMORY.md`, domain memory, or project memory.

## Agent identity

- Claude/Cowork commits as `claude-cowork <claude-cowork@rubin-os.local>`.
- Codex commits as `codex-agent <codex@rubin-os.local>`.
- Hermes commits as `hermes-agent <hermes@rubin-os.local>`.
- Commit messages begin with `[claude]`, `[codex]`, or `[hermes]`.
