# ROS Agent Framework — Meta-Charter

**Version:** 1.0
**Created:** 2026-06-21
**Owner:** ROS CoS (portfolio)
**Status:** Active

How any Rubin OS domain becomes a disciplined **agent environment**. This is the reusable generalization of the [Arbor Agent Mesh](../../PAI/projects/parenting-os-plugin/mesh/CHARTER.md): same bones (charter → roster → loop → gate → memory), retuned so it fits knowledge-work domains as well as software.

---

## 1. What an "agent environment" is

A domain agent environment = five parts:

1. **A lead/orchestrator** — the one agent that frames work, dispatches pods, holds the gate, and reports up to the CoS Conductor.
2. **A roster** — the lead + any specialist pods, each with **owned scope** (paths/topics it may touch) and an escalation line.
3. **A loop** — every agent runs the [universal loop](UNIVERSAL-LOOP.md). On-demand, scheduled, or both.
4. **A gate** — the domain's **Definition-of-Done** (DoD): the testable bar a deliverable must pass before DELIVER. Replaces Arbor's `npm test` for knowledge work.
5. **Memory** — the domain `MEMORY.md` (facts/decisions) the loop writes to on close.

A domain declares all five in one file: `<DOMAIN>/mesh/MESH.md` (use [templates/charter.md](templates/charter.md)).

---

## 2. Tier model

```
 Tier 0  ROS GOVERNANCE     /AGENTS.md · /CLAUDE.md · /MEMORY.md · /00_System/routing.md · safety levels
            │  priorities down / status up
 Tier 1  CONDUCTOR          ros-conductor (CoS)  — portfolio: weekly review, cross-domain priority, dispatch
            │
 Tier 2  DOMAIN MESHES      HV · EA · KK · MKT · FIN · Career · PAI/Arbor   (each = a lead + its loop + its gate)
            │
 Tier 3  SPECIALIST PODS    e.g. hv-sourcing, hv-underwriting, mkt-content  (fan-out where it pays)
            │
 CROSS-CUTTING              research-agent (KK-owned; any domain may dispatch) · Arbor DevSecOps (code only) · Safety gate
```

- **Priorities flow down, status flows up.** Pods report to their lead; leads report to the Conductor; the Conductor reports to Guy.
- **Most ROS domains are a lead + skills**, not a 19-pod mesh. Add a Tier-3 pod only when parallel fan-out is genuinely faster (e.g. screening N property listings, researching M sources) or when a slice needs a distinct persona/gate (e.g. EA client isolation).

---

## 3. The two loop types

Every mesh declares which it runs.

| Type | Trigger | Example | Gate before any external effect |
| :-- | :-- | :-- | :-- |
| **On-demand** | Guy or the Conductor dispatches the lead for a task | "Analyze this Funda listing", "Write the launch campaign" | The domain DoD (§ gate) |
| **Scheduled** | A cron/Hermes job fires on a clock | KK morning triage 08:30; HV weekly deal radar Mon | Read-only by default; any send/write/spend is **Level 3+** and must be pre-authorized in [SCHEDULED-LOOPS.md](SCHEDULED-LOOPS.md) |

**Scheduled loops are real external automations.** A new one is not live until: (a) it is specced in SCHEDULED-LOOPS.md, (b) Guy confirms, (c) it is created on the runtime (Hermes cron / `scheduled-tasks` / `/schedule`). Default posture is **read-and-report**, never **send-or-spend**, unless explicitly granted.

---

## 4. Safety — inherited, non-negotiable

The root ROS safety levels (`/CLAUDE.md`) apply to every agent and every loop:

| Level | Action | Gate |
| :-: | :-- | :-- |
| 0–2 | Analyze / draft / write-in-workspace | Auto |
| 3 | External action (send email, post, API, deploy, **any scheduled automation that acts**) | **Confirm** |
| 4 | Financial (payment, contract, paid spend) | **Confirm + state amounts** |
| 5 | Irreversible (delete, legal, transfer, store submission) | **Confirm + explicit warning** |

Identity & sending rules from `/00_System/identity-policy.md` bind every agent: **always draft first; never send without explicit confirmation; use the correct account for the domain.** EA adds client-confidentiality isolation; PAI/Arbor adds COPPA/GDPR child-data vetoes.

---

## 5. How to invoke

- **Run a domain task:** dispatch that mesh's lead subagent (e.g. `hv-orchestrator`, `mkt-lead`) or invoke a pod directly for a scoped loop.
- **Cross-domain / portfolio:** dispatch `ros-conductor` (weekly review, priority call, multi-domain push).
- **Research anything:** dispatch `research-agent` (KK-owned shared service; or the `deep-research` skill) — returns a sourced, verified brief.
- **Command syntax** (see `/00_System/routing.md`): `/cos.*`, `/hv.*`, `/ea.*`, `/kk.*`, `/mkt.*`, `/fin.*`, `/career.*`, `/research`.

Runnable defs live in `/.claude/agents/ros/`. Deterministic fan-out (screen N listings, research M sources, multi-domain weekly review) can run as a `/.claude/workflows/*.workflow.js` — model on `arbor-mesh.workflow.js`.

---

## 6. Operating principles (the eight, generalized from Arbor)

1. **One source of truth.** Work traces to a backlog item, a task in Notion, or an explicit ask. Agents don't invent scope.
2. **Gate or no deliver.** Nothing leaves the workspace until it passes the domain DoD. The lead holds the gate.
3. **Stay in lane.** A pod edits only its owned scope. Cross-boundary work escalates to the lead.
4. **Isolate parallel work.** Concurrent code-writing pods use git worktrees (Arbor pattern); concurrent doc work uses separate files, never `git add -A` over another agent's WIP.
5. **Safety overrides velocity.** Safety/confidentiality/financial gates can stop any task.
6. **On-demand, not autonomous** — unless a scheduled loop is explicitly registered and granted.
7. **Every loop ends in memory.** Write what changed + what was learned to the domain `MEMORY.md`.
8. **Report up, decide down.** Status flows to the Conductor; priorities flow from it.

---

## 7. Related

- [UNIVERSAL-LOOP.md](UNIVERSAL-LOOP.md) · [SCHEDULED-LOOPS.md](SCHEDULED-LOOPS.md) · [templates/](templates/)
- Canonical boot + identity: `/AGENTS.md`, `/00_System/routing.md`, `/00_System/identity-policy.md`
- Reference implementation: `/PAI/projects/parenting-os-plugin/mesh/`
