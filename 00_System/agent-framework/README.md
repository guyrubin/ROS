# ROS Agent Framework

**Version:** 1.0
**Created:** 2026-06-21
**Owner:** ROS CoS (portfolio) — instantiated per domain by each domain owner

The single, reusable pattern for how every Rubin OS domain runs as an **agent environment**: a lead/orchestrator, optional specialist pods, a uniform work loop, a domain quality gate, and the loops (on-demand + scheduled) it owns. It generalizes the proven [Arbor Agent Mesh](../../PAI/projects/parenting-os-plugin/mesh/CHARTER.md) from a code-building mesh into a pattern that fits both **knowledge work** (HV/EA/KK/MKT/FIN/Career/Research) and **software** (PAI/Arbor).

> **Meshes now sit inside companies.** ROS is a multi-company group (see [group-operating-model.md](../group-operating-model.md) + [companies.md](../companies.md)); a company's org is one or more meshes. Arbor is **company #1** and its mesh is its org. Group services (CoS/FIN/Research/Delivery/MKT) and company-eligible domains (HV/EA) all still run as meshes under this framework.

## Read order

1. [FRAMEWORK.md](FRAMEWORK.md) — the meta-charter: tier model, how a domain plugs in, loop types, safety, invocation.
2. [UNIVERSAL-LOOP.md](UNIVERSAL-LOOP.md) — the loop every agent runs (SENSE→FRAME→DESIGN→PRODUCE→VERIFY→DELIVER→LEARN) + the per-domain Definition-of-Done gate.
3. [SCHEDULED-LOOPS.md](SCHEDULED-LOOPS.md) — registry of recurring autonomous loops (live + proposed). All new ones are human-gated before go-live.
3b. [ROS-CIL.md](ROS-CIL.md) — the **company-wide self-improvement loop** (lead `ros-evaluator`, workflow `/ros-improve`): audits ROS on a cadence, scores findings into the backlog, fixes safe items, surfaces gated. The ops-side sibling of the Arbor CIL.
3c. [../release-engineering/README.md](../release-engineering/README.md) — the **release-engineering standard** (branch→green-gate→canary→prod, feature/claim-level gating) the CoS Delivery mesh runs.
4. [templates/](templates/) — fill-in templates: `charter.md` (a domain MESH), `agent.md` (a runnable subagent), `scheduled-loop.md` (a cron spec).

## The instances

| Mesh | Lead agent | Spec | Type |
| :-- | :-- | :-- | :-- |
| CoS Conductor (portfolio) | `ros-conductor` | [CoS/mesh/MESH.md](../../CoS/mesh/MESH.md) | on-demand + scheduled |
| HV — Real Estate deal mesh | `hv-orchestrator` | [HV/mesh/MESH.md](../../HV/mesh/MESH.md) | on-demand + scheduled |
| EA — Engagement mesh | `ea-lead` | [EA/mesh/MESH.md](../../EA/mesh/MESH.md) | on-demand |
| KK — Personal Ops loop | `kk-ops` | [KK/mesh/MESH.md](../../KK/mesh/MESH.md) | scheduled-first |
| MKT — Content engine | `mkt-lead` | [MKT/mesh/MESH.md](../../MKT/mesh/MESH.md) | on-demand + scheduled |
| FIN — Admin loop | `fin-admin` | [FIN/mesh/MESH.md](../../FIN/mesh/MESH.md) | on-demand + scheduled |
| Career — Job-search (KK-owned sub-mesh) | `career-orchestrator` | [KK/job-automation/MESH.md](../../KK/job-automation/MESH.md) | scheduled-first |
| Research — KK-owned shared service | `research-agent` | [KK/research/MESH.md](../../KK/research/MESH.md) | on-demand |
| PAI — Arbor Agent Mesh | `arbor-orchestrator` | [Arbor CHARTER](../../PAI/projects/parenting-os-plugin/mesh/CHARTER.md) | on-demand (pre-existing) |
| Arbor Marketing (PAI sub-mesh) | `arbor-marketing-lead` | [Arbor Marketing MESH.md](../../PAI/projects/parenting-os-plugin/mesh/marketing/MESH.md) | scheduled-first (autonomous, publishes safe materials) |
| CoS Delivery — Release Engineering | `ros-release-lead` | [CoS/delivery/MESH.md](../../CoS/delivery/MESH.md) | on-demand + scheduled |

Runnable subagents: `/.claude/agents/ros/` (this framework) and `/.claude/agents/arbor/` (Arbor). Workflows: `/.claude/workflows/`.

## Design rules (efficiency + effectiveness)

- **Reuse, don't restate.** A domain mesh references this framework and the canonical boot sequence in `/AGENTS.md`; it never re-explains the loop or safety levels.
- **One file per domain mesh.** A domain's whole environment is one `MESH.md` (roster + gate + loops + escalation). Pods get a runnable subagent only where fan-out genuinely pays.
- **The gate is the domain's Definition-of-Done**, not a generic check. Knowledge work has no `npm test`; see UNIVERSAL-LOOP.md.
- **On-demand by default.** Scheduled/autonomous loops are an explicit opt-in, Level-3, and listed in SCHEDULED-LOOPS.md.
- **Every loop ends in memory.** No task is "done" until the domain `MEMORY.md` records what changed and what was learned.
