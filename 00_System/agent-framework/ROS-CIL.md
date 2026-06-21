# ROS Continuous Improvement Loop (ROS-CIL)

**Version:** 1.0
**Created:** 2026-06-21
**Owner:** ROS CoS (conductor) · the company-wide self-improvement engine
**Status:** Built — the ROS-level sibling of the [Arbor CIL](../../PAI/projects/parenting-os-plugin/mesh/improvement/CIL.md)

Arbor has a CIL that improves the *product*. **This loop improves the *company*.** It audits all of ROS on a cadence, scores + verifies findings into [`CoS/ROS-BACKLOG.md`](../../CoS/ROS-BACKLOG.md), fixes the safe ones itself, surfaces the gated ones, and writes a **"State of the Company"** to the cockpit — so ROS gets better every week without being told to. This is the engine behind the [strategy](../../CoS/ROS-STRATEGY.md)'s "self-improving 50-employee company."

---

## The loop

```
 SENSE → AUDIT (lenses, parallel) → SCORE+VERIFY → SYNTHESIZE → FIX(safe) → CONFIRM → [human ships gated]
   ▲                                                                                          │
   └────────────────────────── run again next cadence ───────────────────────────────────────┘
```

- **SENSE** — pull ground truth: git-derived domain `MEMORY.md` freshness (`build-state.mjs`), the Hermes `cron/jobs.json` reality, the Notion cockpit state, the open ROS-BACKLOG, recent commits.
- **AUDIT** — the lens panel (below) runs in parallel, each returning **scored findings** (same schema as the Arbor [CRITICS](../../PAI/projects/parenting-os-plugin/mesh/improvement/CRITICS.md): severity × impact × confidence ÷ effort).
- **VERIFY** — `ros-evaluator` adversarially checks each finding (reproduce/confirm against the real file/state); drops the unsubstantiated; forces `gated` on anything Level 3+.
- **SYNTHESIZE** — roll into themes, write a 4–6 line **State of the Company**, cap the queue.
- **FIX (safe)** — autonomously apply `riskClass:safe` fixes: refresh stale memory, refresh the cockpit, fix doc-vs-reality drift, tighten a mesh — on a branch, build-on-not-clutter.
- **CONFIRM** — re-check each fix landed; write back to ROS-BACKLOG + memory + the cockpit.
- **Human ships gated** — Notion writes, live crons, external actions, spend, anything Level 3+.

## The audit lenses (what it checks)

| Lens | Audits | Run by |
| :-- | :-- | :-- |
| **Domain health & freshness** | Each mesh: memory git-fresh? loops running? `Next:` actionable? DoD held? | each domain lead in self-audit mode (deep), or `build-state` staleness (light) |
| **Management adherence** | Cadence running? cockpit fresh? decisions-needed cleared? OKRs tracked? | `ros-conductor` |
| **The ROS Standard** | Sampled recent outputs pass substance + voice + aesthetic? | `ros-evaluator` (Theme K) |
| **Tooling & skills currency** | Right tools/skills wired + used? missing? new in the ecosystem? | `research-agent` (Theme I/L) |
| **Reality check** | Docs match truth? (SCHEDULED-LOOPS vs Hermes `jobs.json`; meshes vs `notion_database_registry`; no fictional automations) | `ros-evaluator` |
| **Cross-domain + multi-principal** | Conflicts, Joseph coverage, no confidentiality leakage | `ros-conductor` |
| **Self-improvement health** | Are the Arbor CIL + this loop actually running + shipping? | `ros-evaluator` |

## Autonomy (set by Guy)
**Find + fix-safe autonomously; human ships gated.** Safe = doc/memory/cockpit-refresh/mesh-tightening fixes on a branch. Gated (stops for Guy) = Notion workspace writes, creating/enabling live crons, any external action (send/post/spend/deploy), child-data/billing — mirrors `/CLAUDE.md` Levels 3–5.

## Cadence
- **Weekly (light):** freshness + management + reality lenses (cheap, diff-aware) → refresh cockpit, flag drift, update ROS-BACKLOG.
- **Monthly (deep):** full panel incl. domain self-audits + Standard + tooling → State of the Company + a fix wave.

Both registered in [SCHEDULED-LOOPS.md](SCHEDULED-LOOPS.md), **not live until Guy confirms the cron**; until then run on-demand.

## Run
- Workflow: `/.claude/workflows/ros-improve.workflow.js` — `args:{mode:"light"|"deep"}`.
- Lead: `ros-evaluator` (eval lead; the ops-side sibling of `arbor-evaluator`).
- A single lens on-demand: dispatch the agent in its row.

## Principles (extend the framework)
Evidence or it's dropped · score don't vibe · confirm the cure · safety/external never auto-applied · **every cycle writes a State of the Company to the cockpit + memory** · build-on-not-clutter (the loop's own bias).

## Related
[Arbor CIL](../../PAI/projects/parenting-os-plugin/mesh/improvement/CIL.md) (template) · [FRAMEWORK.md](FRAMEWORK.md) · [UNIVERSAL-LOOP.md](UNIVERSAL-LOOP.md) · [ROS-STRATEGY.md](../../CoS/ROS-STRATEGY.md) · [ROS-BACKLOG.md](../../CoS/ROS-BACKLOG.md)
