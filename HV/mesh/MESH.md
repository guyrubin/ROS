# HV Deal Mesh

**Version:** 1.0
**Created:** 2026-06-21
**Owner:** HV (HollandVest) · reports to ros-conductor (CoS)
**Loop type:** both (on-demand deal work + scheduled deal radar)
**Runs:** `/AGENTS.md` boot → reads `/HV/MEMORY.md` → [ROS Agent Framework](../../00_System/agent-framework/FRAMEWORK.md)

## Mission
Turn raw market signal into investment-committee-grade decisions: source candidates against the buy-box, underwrite them (BRRRR/value-add), clear the permit/zoning path, and reach an explicit Proceed/Hold verdict — fast, with facts/assumptions/risks always separated.

## Roster

| ID | Role | Owns | Escalates to |
| :-- | :-- | :-- | :-- |
| `hv-orchestrator` | Lead | Frames the deal question, dispatches pods, holds the IC gate, writes the decision | ros-conductor |
| `hv-sourcing` | Sourcing/radar | Funda/Pararius/Kadaster scans, buy-box fit-scoring, candidate shortlist | `hv-orchestrator` |
| `hv-underwriting` | Underwriting | BRRRR model, WWS points, ARV/LTV/yield, financial verdict | `hv-orchestrator` |
| `hv-permit` | Permit/zoning | Vergunning/bestemmingsplan pathway, monument/protected-cityscape flags, critical-path | `hv-orchestrator` |

> Fan-out pays here: `hv-sourcing` can screen N listings in parallel, then `hv-underwriting` + `hv-permit` run concurrently on the shortlist before `hv-orchestrator` synthesizes the IC memo.

## Gate (Definition-of-Done)
- Facts / labeled assumptions / risks / financial impact **separated**.
- Yields, LTV, ARV computed in `<thinking>`; missing variables flagged.
- Permit dependency on the critical path explicitly stated.
- Explicit verdict: **Proceed / Proceed-if-conditions / Hold / Do-not-proceed** + next actions.
- Sources grounded; as-is / stabilised / ARV values separated.

## Skills this mesh loads
| Task | Skill |
| :-- | :-- |
| Investment analysis, IC memo | `deal-analyzer` |
| BRRRR financial model | `brrrr-calculator` |
| Permit / zoning pathway | `permit-pathway` |
| WWS points, rent ceiling | `wws-analyzer` |
| Create/update deal note | `deal-note-creator` |
| Deal correspondence | `email-composer` (Gmail `hollandvest`) |

## Loops it owns

| Loop | Type | Cadence | Posture | Registry |
| :-- | :-- | :-- | :-- | :-- |
| Deal analysis / IC | on-demand | — | acts in-workspace | — |
| HV Deal Radar | scheduled (proposed) | Weekly Mon | read-only | SCHEDULED-LOOPS.md |

## How to invoke
- A deal / listing: dispatch `hv-orchestrator` (or a pod directly for a scoped step).
- Command: `/hv.analyze`, `/hv.brrrr`, `/hv.permit`, `/hv.wws`.
- Deterministic batch (screen N listings): model on `arbor-mesh.workflow.js`.

## Boundaries
- Financial administration (invoices, tax, insurance) → FIN.
- Sending deal email: draft-first, Gmail `bhollandvest@gmail.com` only, Level 3 confirm.
- Saves under `HV/03_Deals/`, `HV/04_Assets/`, `HV/13_Decision_Log/` per the HV CLAUDE.md file map.
