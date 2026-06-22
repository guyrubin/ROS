# Rubin OS - Root Constitution

**Version:** 1.9
**Last updated:** 2026-06-22

## Session Boot Sequence

Follow the **canonical boot sequence in `/AGENTS.md`** — it is the single source of truth, so this file does not restate it. In short: eager-load `/AGENTS.md` → `/CLAUDE.md` → `/MEMORY.md` → `/00_System/routing.md`, then route and load the matched domain's `CLAUDE.md` + `MEMORY.md`. Lazy-load capabilities, connectors, and the filesystem contract only when a task needs them. Run `/session-audit` at wrap-up after meaningful ROS work.

> **Core Directive (Karpathy PKM):** ROS is an AI-maintained knowledge base. When Guy says "remember X" or provides raw notes, compile, structure, and interlink them into Markdown. Output style: executive, structured, direct; end with a decision or next action.

## Operating Standard & Method

- **De-slop every output** — run `/de-slop` (the ROS output standard) before delivering anything written: accuracy, density, voice, a decision. No AI-slop, ever.
- **Method:** `/grill-me` (align before planning) → `/vertical-slice` (ship one real artifact, get judged) → de-slop → loop. Never generate everything and verify nothing.
- **LLM-agnostic OS, 3 persistent runtimes + Google** (`/AGENTS.md`): Claude (core builder) · Codex (bulk) · Gemini (gen/multimodal) · Hermes (scheduled) — the filesystem + Notion are the shared baton. Get the most from every subscription, both principals.
- **Second brain:** Notion (PARA) is canonical; ROS Markdown is the durable agent knowledge; the **ROS OS Dashboard** (`CoS/projects/ros-os-dashboard/`) is the HTML control surface on top.
- **Self-improving:** Arbor CIL (product) + ROS-CIL (company) + a weekly **AI-trends watch** keep ROS current (`/00_System/agent-framework/SCHEDULED-LOOPS.md`).
- **Shipping is incremental + gated** under CoS Delivery (`/ros-release`): release train branch→green-gate→canary→prod with feature/claim-level gating — never blind-to-main, never hand-deployed (`/00_System/release-engineering/`).
- **Multi-company group (Guy = CEO):** ROS runs as a portfolio of companies + shared group services; CoS is the group HQ. **Arbor = product company #1.** Registry `/00_System/companies.md`; model `/00_System/group-operating-model.md`. Boot declares the active company.

## Routing Map

| Domain | Agent | Required Files to Load |
| :--- | :--- | :--- |
| Weekly review, OKRs, strategy, cross-domain orchestration | CoS | `CoS/CLAUDE.md` + `CoS/MEMORY.md` |
| Daily ops, inbox, calendar, tasks, scheduling | KK | `KK/CLAUDE.md` + `KK/MEMORY.md` |
| Real estate deals, BRRRR, permits, WWS, tenants | HV | `HV/CLAUDE.md` + `HV/MEMORY.md` |
| Architecture reviews, HLDs, ADRs, cloud, EA clients | EA | `EA/CLAUDE.md` + `EA/MEMORY.md` |
| AI products, PRDs, GTM, pricing, ventures | PAI | `PAI/CLAUDE.md` + `PAI/MEMORY.md` |
| Content, copy, campaigns, brand, social | MKT | `MKT/CLAUDE.md` + `MKT/MEMORY.md` |
| Invoices, insurance, contracts, tax, admin | FIN | `FIN/CLAUDE.md` + `FIN/MEMORY.md` |
| Job search, CV, applications, recruiters, work permit | Career (KK-owned sub-mesh) | `KK/job-automation/MESH.md` |
| Sourced research, due diligence, fact-checked briefs | research-agent (KK-owned) | `KK/research/MESH.md` |

Full keyword routing rules live in `/00_System/routing.md`. Every domain runs as an agent environment under the **ROS Agent Framework** (`/00_System/agent-framework/`): a lead + optional pods + the universal loop + a domain Definition-of-Done. Dispatch a mesh lead from `/.claude/agents/ros/`, or `ros-conductor` for cross-domain work.

## Email Identity and Safety

**Strict Rule:** Always draft first. Never send without explicit user confirmation.

| Account | Agent Scope |
| :--- | :--- |
| `bguy.rubin@gmail.com` | CoS, KK, EA, PAI, MKT |
| `bhollandvest@gmail.com` | HV only |
| `josephdoronrubin@gmail.com` | Joseph (EA lead) - send/receive for EA work |

Full identity rules live in `/00_System/identity-policy.md`.

## Safety Levels

| Level | Action Type | Execution Gate |
| :---: | :--- | :--- |
| 0 | Analyze, summarize, research | Auto-execute; no confirmation |
| 1 | Draft content such as email, docs, plans | Auto-execute; no confirmation |
| 2 | Write or edit files in workspace | Auto-execute; no confirmation |
| 3 | External action such as email, post, API | Require confirmation |
| 4 | Financial action such as payment or contract | Confirm and state amounts |
| 5 | Irreversible action such as delete, legal, transfer | Confirm with explicit warning |

## Knowledge Management

ROS uses an LLM-maintained wiki approach:

- **Raw ingest:** Guy may drop unstructured data, transcripts, or notes into `/raw/` folders.
- **AI compilation:** Agents read raw data and compile it into structured, interlinked Markdown notes.
- **Query-first:** Guy asks questions; agents read compiled summaries and synthesize answers.
- **Health checks:** Agents periodically identify gaps, inconsistencies, and connections across the wiki.

## Shared Resources

| Resource | Path |
| :--- | :--- |
| Contacts | `/00_System/contacts.md` |
| Connectors | `/00_System/connectors.md` |
| Notion Templates | `/00_System/notion_templates.md` |
| Routing Matrix | `/00_System/routing.md` |
| Agent Capabilities | `/00_System/agent-capabilities.md` |
| Identity Policy | `/00_System/identity-policy.md` |
| Agent Filesystem Contract | `/00_System/agent-filesystem-contract.md` |
| Memory/Archive Policy | `/00_System/memory-archive-policy.md` |
| Hygiene Runbook | `/00_System/ros-hygiene-runbook.md` |
| Session Audit | `/00_System/session-audit.md` |
| Instruction Standards | `/00_System/markdown-instruction-principles.md` |
| Layer Model | `/00_System/layer-model.md` |
| Agent Framework | `/00_System/agent-framework/README.md` |
| Release Engineering (Delivery) | `/00_System/release-engineering/` |
| ROS OS + Dashboard | `/CoS/ROS-OS.md` · `/CoS/projects/ros-os-dashboard/` (:4700) |
| Standard & method skills | `/.claude/skills/{de-slop,grill-me,vertical-slice}/` |
| Self-improvement loops | Arbor `/PAI/projects/parenting-os-plugin/mesh/improvement/`, ROS `/00_System/agent-framework/ROS-CIL.md` |

## Token Optimization Rules

- **Size Limit:** This file must stay under 100 lines. Domain-specific rules live in domain `CLAUDE.md` files.
- **Memory Diet:** Root/domain `MEMORY.md` files hold active facts only; stale detail moves to `archive.md`.
- **Instruction vs Memory:** Prescriptive rules live in instruction files or skills; facts/status live in memory files.
- **DRY Principle:** No rule appears in more than one file.
- **Lazy Loading:** Each domain's `CLAUDE.md` is loaded only when that domain is active.
- **Model Selection:** Use the runtime's default capable model; use a stronger model only for complex tasks with 3+ interdependent steps.
