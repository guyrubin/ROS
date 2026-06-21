# Research Mesh

**Version:** 1.0
**Created:** 2026-06-21
**Owner:** KK-owned (Guy's PA) shared service · lead `kk-ops` · reports up to ros-conductor (CoS)
**Loop type:** on-demand
**Runs:** `/AGENTS.md` boot → reads `/KK/MEMORY.md` → [ROS Agent Framework](../../00_System/agent-framework/FRAMEWORK.md) → [Universal Loop](../../00_System/agent-framework/UNIVERSAL-LOOP.md)

## Mission
Turn any open question into a **sourced, adversarially-verified, cited brief** — market scans, due-diligence intel, competitor analysis, technical comparisons, regulatory/legal lookups — so a domain decides on evidence, not stale model memory. KK owns the capability (it's Guy's PA doing the legwork); **any domain mesh or `ros-conductor` may dispatch it**, and the dispatching domain owns the resulting decision.

## Roster

| ID | Role | Owns (scope) | Escalates to |
| :-- | :-- | :-- | :-- |
| `research-agent` | KK-owned research capability | Multi-source gather, adversarial verification, synthesis, citation. For big jobs it fans out web searches **internally** via the `deep-research` skill — no separate pods. | `kk-ops` → `ros-conductor` |

> No domain memory of its own: `research-agent` hands the brief **back** to the caller. The **dispatching domain** records any durable fact in **its** `MEMORY.md`.

## Gate (Definition-of-Done)
The Research row of [UNIVERSAL-LOOP.md](../../00_System/agent-framework/UNIVERSAL-LOOP.md):
- **Every material claim cited** (prefer official/primary sources; mark anything unverified).
- **Key claims adversarially verified** — triangulated against a second independent source; contradictions surfaced.
- **Uncertainty flagged** — confidence, gaps, and stale-data risk called out, not buried.
- **Synthesized, not dumped** — an answer with a takeaway, not a link pile.
- Plus the universal checks: safety level respected · no confidential leakage.

## Skills this mesh loads
| Task | Skill |
| :-- | :-- |
| Deep, multi-source, fact-checked report (fan-out) | `deep-research` (primary) |
| Scoped lookup / quick synthesis before a decision | `research` (PA) |
| Live-web search + source triangulation | web search capability per [/00_System/agent-capabilities.md](../../00_System/agent-capabilities.md) |

## Loops it owns

| Loop | Type | Cadence | Posture | In registry |
| :-- | :-- | :-- | :-- | :-- |
| Research brief | on-demand | — | read-only (web read + workspace draft) | — |

## How to invoke
- Any domain lead or the Conductor dispatches `research-agent` with a framed question; it returns the brief to the caller.
- Command: `/research`.
- If the finding is durable, **the caller** saves it to the relevant domain folder and logs the fact in that domain's `MEMORY.md` — `research-agent` does not.

## Boundaries
- Produces **evidence and analysis only** — never decisions, sends, posts, commitments, or any Level 3+ external action. The dispatching domain owns the decision and any external action (draft-first, account/identity rules from `/00_System/identity-policy.md`).
- Confidentiality: when researching for EA, stays within the client's context — no cross-client leakage.
- Does not own or write a domain `MEMORY.md`; it hands findings back for the caller to record.
