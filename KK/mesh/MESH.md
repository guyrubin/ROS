# KK Ops Mesh

**Version:** 1.0
**Created:** 2026-06-21
**Owner:** KK (Personal Operations) · reports to ros-conductor (CoS)
**Loop type:** scheduled-first (recurring morning-routing/triage is the core value) + on-demand for ad-hoc planning & follow-ups
**Runs:** `/AGENTS.md` boot → reads `/KK/MEMORY.md` → [ROS Agent Framework](../../00_System/agent-framework/FRAMEWORK.md)

## Mission
Keep Guy's day actionable: turn inbox + calendar + tasks into a prioritized top 1–5, capture commitments to Notion, and draft (never auto-send) the follow-ups that keep things moving. Execution, not strategy.

## Roster

| ID | Role | Owns (scope/paths/topics) | Escalates to |
| :-- | :-- | :-- | :-- |
| `kk-ops` | Lead | Daily planning, inbox triage, task capture, follow-up drafts, calendar/scheduling, holds the KK gate, reports up | ros-conductor |

> Single lead, no parallel pods — KK is execution, not fan-out. As Guy's PA, `kk-ops` also **oversees two KK-owned sub-meshes** (each reports up through `kk-ops`):
> - **Career / job-search** → [`KK/job-automation/MESH.md`](../job-automation/MESH.md) (`career-orchestrator`) — route job sourcing / CV / eligibility there.
> - **Research** → [`KK/research/MESH.md`](../research/MESH.md) (`research-agent`) — KK-owned shared service; any domain may dispatch it for a sourced, verified brief.

## Gate (Definition-of-Done)
- **Actionable & prioritized** — output is a **top 3 (5 max)**, ruthlessly filtered, not a broad inbox dump.
- **Correctly routed** — each item goes to the right domain/account; non-KK items handed off, not actioned.
- **Draft-first** — anything outbound is drafted, never sent without explicit confirmation (Level 3).
- **Respects morning-routing scope/noise filters** — suppress newsletters, receipts, subscription/job-alert noise per `/KK/CLAUDE.md`.
- Universal checks: safety level respected · identity/account correct · no confidential leakage.

## Skills this mesh loads
| Task | Skill |
| :-- | :-- |
| Triage inbox, what needs a reply | `inbox-manager` |
| Tasks, priorities, capture an action | `task-manager` |
| Draft a follow-up / reply | `email-composer` (account per identity policy) |
| Background before a decision | `research` (or dispatch KK's own `research-agent`) |
| Push tasks/notes to Notion | `notion-sync` |

> Notion is the **canonical task surface** (My Tasks DB + Command Center) — do not bootstrap a parallel `TASKS.md`.
> **Runtime-aware connectors** (`/00_System/connectors.md`): in **Claude Code/Cowork** use the **MCP** Gmail/Calendar/Notion directly — don't force the Hermes path when you're interactive. In **Hermes** (the scheduled crons) use `himalaya` / `productivity/notion`. This is the fix for "KK is Hermes-bound and inefficient."

## Loops it owns

| Loop | Type | Cadence | Posture | Registry |
| :-- | :-- | :-- | :-- | :-- |
| Daily Gmail actionable triage (08:30 run = **morning routing**) | scheduled | Weekdays 08:30 / 13:30 / 18:30 | read-only | `333eaf638d76` |
| Tsagareli Capricorn forecast (Hebrew, Capricorn only) | scheduled | Mondays 10:00 | read-only | `c20375b10b15` |
| Daily plan / inbox triage / capture / follow-up | on-demand | — | drafts in-workspace | — |

## How to invoke
- A daily-ops task: dispatch `kk-ops`.
- Command: `/kk.daily-plan`, `/kk.triage-inbox`, `/kk.capture-task`, `/kk.follow-up`.

## Boundaries
- Weekly strategy / OKRs / cross-domain orchestration → CoS.
- Real estate → HV · client architecture → EA · product ventures → PAI · content/campaigns → MKT · invoices/tax/admin → FIN.
- Job-search / CV / eligibility → Career sub-mesh (`KK/job-automation/MESH.md`). Sourced/verified briefs → Research sub-mesh (`KK/research/MESH.md`). Both are KK-owned.
- Sending email: draft-first, correct account per `/00_System/identity-policy.md`, Level 3 confirm.
