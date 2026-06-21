<!--
TEMPLATE: a domain mesh. Copy to <DOMAIN>/mesh/MESH.md and fill every bracket.
Keep it to ~1 page. Reference the framework; never restate the loop or safety levels.
-->
# [DOMAIN] Mesh

**Version:** 0.1
**Created:** [YYYY-MM-DD]
**Owner:** [domain] · reports to ros-conductor (CoS)
**Loop type:** [on-demand | scheduled-first | both]
**Runs:** [/AGENTS.md boot] → reads `[DOMAIN]/MEMORY.md` → [ROS Agent Framework](../../00_System/agent-framework/FRAMEWORK.md)

## Mission
[One sentence: what this mesh produces and the outcome it drives toward.]

## Roster

| ID | Role | Owns (scope/paths/topics) | Escalates to |
| :-- | :-- | :-- | :-- |
| `[lead-id]` | Lead/orchestrator | Frames work, dispatches, holds the gate, reports up | ros-conductor |
| `[pod-id]` | [specialist] | [owned scope] | `[lead-id]` |

> Add a pod only where parallel fan-out genuinely pays or a slice needs a distinct persona/gate.

## Gate (Definition-of-Done)
[The testable bar from UNIVERSAL-LOOP.md for this domain. List the must-pass checks.]

## Skills this mesh loads
[Map task → skill, e.g. "IC memo → deal-analyzer". Reference the domain CLAUDE.md if already listed.]

## Loops it owns

| Loop | Type | Cadence | Posture | In registry |
| :-- | :-- | :-- | :-- | :-- |
| [name] | [on-demand/scheduled] | [—/cron] | [read-only/acts] | [SCHEDULED-LOOPS.md id] |

## How to invoke
- Task: dispatch `[lead-id]` (or a pod for a scoped loop).
- Command: `/[domain].[command]`.

## Boundaries
- [What routes elsewhere; confidentiality/account rules; what this mesh never does.]
