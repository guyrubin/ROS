# Rubin OS — Operating Doc

**Version:** 1.0 · **Created:** 2026-06-21 · **Owner:** ROS CoS
**Supersedes:** ROS-PRD.md · ROS-STRATEGY.md · ROS-CAPITALIZATION.md (archive). **Live queue:** [ROS-BACKLOG.md](ROS-BACKLOG.md).

## What ROS is
An AI-run company that is an extension of **Guy and Joseph Rubin** — a high-trust bench of agent "departments" run by a COO conductor, serving two principals, holding one operating picture. The filesystem (Markdown memory + `state.json`) is the shared brain and the only cross-runtime handoff. The org chart is drawn and the loop muscle is built; the gap is that it doesn't yet *run* — most loops are on paper and 5/7 domains are git-stale. The job is to make the drawn company a running one.

## The org

| Layer | Role | Who |
| :-- | :-- | :-- |
| Principals | Owners | Guy · Joseph |
| Conductor | COO / Chief of Staff | `ros-conductor` (CoS) — portfolio priority, weekly review, dispatch; reports both principal lanes |
| Departments | Domain leads | `hv-orchestrator` · `ea-lead` · `kk-ops` (owns Career + Research) · `mkt-lead` · `fin-admin` · `arbor-orchestrator` |
| Specialists | Pods | hv-{sourcing,underwriting,permit,execution} · mkt-content · Arbor pods |
| Quality | Standards + critics | `arbor-evaluator` + critic panel · DevSecOps · the de-slop gate |
| Shared services | Cross-cutting | `research-agent` (KK-owned) · the Tooling/Skills loop |
| Always-on staff | Scheduled loops | the live crons + `SCHEDULED-LOOPS.md` registry |

Domain north-stars: **KK** = ultimate PA / second brain · **HV** = ultimate AI real-estate dev in the EU · **PAI** = a product-AI company (Arbor + ventures). Principals registry: [`/00_System/principals.md`](../00_System/principals.md); confidentiality between Guy-private and Joseph-private domains is non-negotiable.

## The operating method
Every mesh runs the universal loop ([UNIVERSAL-LOOP.md](../00_System/agent-framework/UNIVERSAL-LOOP.md)) and ends in a memory write-back. Four moves define the house standard:

1. **Grill** — interrogate the work against reality (the file, the git date, the count); drop the unsubstantiated. No claim without evidence.
2. **Vertical-slice** — ship one thin end-to-end thing that runs, not a broad plan that doesn't.
3. **De-slop** — every output clears [`/.claude/skills/de-slop/SKILL.md`](../.claude/skills/de-slop/SKILL.md): accurate, dense, in voice, ends in a decision. This is the ROS Standard, made specific; it's the VERIFY gate.
4. **Loop** — SENSE → FRAME → ACT → VERIFY → LEARN; LEARN writes memory + a `Reviewed:` heartbeat. A frame isn't done to the conductor without it.

## Autonomy & loops
Safety posture (FRAMEWORK §4): **L0–2 auto** (analyze/draft/workspace write incl. memory write-back + dashboard refresh) · **L3 confirm** (external send/post/API/deploy/any scheduled automation that acts) · **L4 confirm + amounts** · **L5 confirm + warning**.

**LIVE today — only 2 crons exist** (verified against Hermes `jobs.json`):
- `333eaf638d76` — KK Gmail triage, weekdays 08:30/13:30/18:30 (08:30 = morning routing). Read-only.
- `4fc75fbfad30` — Career sourcing sprint, Mon/Thu 09:00. Read-only.

**GATED / not live** (specced in [SCHEDULED-LOOPS.md](../00_System/agent-framework/SCHEDULED-LOOPS.md), need Guy's flip): Command Center morning refresh · CoS weekly-review prep · HV Deal Radar · FIN deadline watch · MKT cadence · ROS-CIL weekly+monthly · the two Arbor CIL loops (eval 2×/day, build 2×/wk — Guy-confirmed cadence, awaiting cloud activation). All read + workspace-write; none merges, sends, or deploys.

**Dead/phantom — do not cite as live:** Tsagareli `c20375b10b15`, hygiene `bc55de81f9f1`, HV Smart-Living radar — documented but absent from `jobs.json`. Revive deliberately = gated.

Every loop **writes back** a dated line to its owning domain `MEMORY.md` (+ `state.json` where relevant) — the cure for the Hermes↔Claude disconnect.

## The cockpit
One surface: the **guy-command-center** ([`CoS/projects/guy-command-center/`](projects/guy-command-center/)), `index.html` on :4500, fed by `build-state.mjs` → `state.json`. Freshness is **git-derived** (commit date of each `MEMORY.md`), so the signal is honest, not header-gameable. Never fork a second dashboard — extend this one (loops panel, decisions-needed queue, principal toggle).

## Principles
- **BUILD ON, NEVER CLUTTER** — every change names the asset it extends; no parallel system, second dashboard, or resurrected `sync/` plugin.
- **One source of truth per fact** (DRY).
- **Filesystem is the only cross-runtime handoff** — `MEMORY.md` + `state.json`.
- **Two principals by default** — Guy/Joseph confidentiality is non-negotiable.
- **Every loop ends in memory · gate or no deliver · safety overrides velocity · capitalize don't accumulate** (wire a tool when a team will use it).

**Non-goals:** not a chatbot · no autonomous external action without a registered grant · no second dashboard/scheduler/sync framework · serves exactly two named principals, not generic SaaS.
