# Daily Execution Mechanism (epic-approval autonomy)

**Version:** 1.0 · **Created:** 2026-06-22 · **Owner:** CoS (group HQ) · **CEO/approver:** Guy
**Extends:** the root [safety levels](../CLAUDE.md) (0–5) · runs on the [release engine](release-engineering/README.md) · draws from the [canonical backlogs](release-engineering/BACKLOG-MODEL.md) · dispatches the [company](group-operating-model.md) agents.

How the group runs day-to-day. **Guy approves *scope* once a day at the epic level; CoS produces the assignments and executes them multi-agent; small things (bugs, small capabilities, small features) run with no approval; the hard gates are unchanged.** This is the operating rhythm that turns the backlogs + release engine + company model into daily shipped output instead of stalled branches.

## The three approval tiers (the contract)

| Tier | Scope | Approval | Definition |
| :-- | :-- | :-- | :-- |
| **A — Autonomous** | bug fix · small capability · small feature | **none** — execute + ship continuously | `riskClass: safe` **and** small (effort ≤ ~3 / one pod / no new surface) **and** reversible **and** touches no Tier-C item. A bug fix (restoring intended behavior) is always Tier A. |
| **B — Epic (daily batch)** | the day's larger assignments, grouped as epics | **Guy, once each morning** (one batched decision) | Anything bigger than Tier A: a multi-item feature, a cross-pod initiative, a wave. Approving the epic authorizes (1) building everything in it **and** (2) promoting the day's green, safe (non-Tier-C) output to production. |
| **C — Always explicit** | prod-promote of a claim/child-data item · money/spend · DNS/domain · store submission · clinical/developmental/effect-size claim · legal/irreversible | **Guy, per item** — *even inside an approved epic* | The existing Level 3–5 gates + the release-engine claim/promote gates. Epic approval never auto-authorizes a Tier-C action; each surfaces individually. |

> **"Small" is bounded on purpose.** If an item is `riskClass: gated`, carries a claim, touches child-data/billing/money/DNS/store, is irreversible, or is large/cross-cutting — it is **not** Tier A. When in doubt, it's an epic (Tier B), not autonomous.

## The daily loop

1. **PLAN — CoS produces (autonomous).** Each morning, assemble the day's work from the canonical backlogs (`AP-`/`AM-`/`ROS-`) into **epics**, each with: its items, the owning agents, `riskClass`, and any **Tier-C gate** it will hit. Also list the **Tier-A smalls running today** (for visibility — they don't need approval).
2. **APPROVE — Guy, epic level (one batched decision).** Approve / trim / reorder the epic list. This single approval = scope authorization **+ the batched daily prod-promote** for the day's green, safe output. (Tier-A smalls run regardless.)
3. **EXECUTE — CoS, multi-agent.** Dispatch the approved epics + Tier-A smalls across the company's agents (product pods · DevSecOps · marketing). Every change still goes through the **release pipeline**: branch → full green-gate → canary → smoke → promote. For safe output, the morning epic approval **is** the promote sign-off. **Stop and surface any item that hits a Tier-C gate** — it waits for an individual yes.
4. **REPORT — CoS, end of day.** What shipped · what's staged awaiting a Tier-C gate · what's blocked. Write back to the [release ledger](release-engineering/RELEASE-LEDGER.md) + the backlogs (`shipped` + `REL-` id) + the relevant `MEMORY.md`. Nothing drops.

## Guardrails (non-negotiable, even under an approved epic)
- **The pipeline is still the only path to prod.** No blind deploy, no by-hand `gcloud`/`firebase`. Epic approval batches the *promote decision*; it does not bypass the gate, the canary, or the smoke.
- **Tier-C always surfaces individually.** A claim flip, a charge, a DNS change, a store submission, a child-data/consent change, anything irreversible — explicit yes each time.
- **Reversible + gated by riskClass.** Tier-A autonomy is only for safe, reversible work. Anything that can't be cleanly rolled back is at least Tier B.
- **Everything writes back.** No assignment is "done" until the ledger/backlog/memory records it (the LEARN gate).
- **Concurrent-safe.** Execution claims the merge lane per the [release pipeline](release-engineering/RELEASE-PIPELINE.md) so the day's work doesn't race other sessions.

## Cadence + invocation
- **Daily** (morning): CoS produces the epic plan; Guy approves. Run via the `/ros-release` train for the ship step.
- A scheduled **daily-plan** loop can pre-assemble the morning epic list (proposed in [SCHEDULED-LOOPS.md](agent-framework/SCHEDULED-LOOPS.md); read-and-report, Guy-gated to go live).
- This mechanism is how CoS operationalizes the [group operating model](group-operating-model.md) CEO rhythm: the per-company board cadence + the one batched promote decision, run daily.
