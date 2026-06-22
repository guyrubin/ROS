# HV Backlog — ranked queue of record

**Owner:** `hv-orchestrator` · **Reports to:** ros-conductor (CoS) · **Created:** 2026-06-22
**Method:** scored `sev×imp×conf÷eff` per the [ROS Agent Framework](../../00_System/agent-framework/FRAMEWORK.md); shipped to the [HV Definition-of-Done](MESH.md#gate-definition-of-done) and the [ROS output standard](../../.claude/skills/de-slop/). IDs are stable (`HV-NNN`) — a loop enumerates this file and CoS reads it; never renumber a shipped item.

This is HV's single on-disk queue (GA-3). It pulls the HV-owned items that were floating in `CoS/ROS-BACKLOG.md` into stable IDs HV owns, plus the live deal-stage pipeline. **Infra items** = how the mesh runs; **deal-stage items** = the pipeline itself. IC *verdicts* live in [`13_Decision_Log/`](../13_Decision_Log/README.md); active *theses* live in [`HV/MEMORY.md`](../MEMORY.md); this file is *what to do next and in what order*.

## Infra — how the mesh runs

| ID | Item | Score | Safe/Gated | Connector-indep | Source | Status |
| :-- | :-- | :-: | :-- | :-: | :-- | :-- |
| HV-001 | **Revive the Smart-Living Deal Radar as a real cron** — stalled ~2026-06-05, never registered on a runtime; re-create as a Hermes loop that writes Deals/Properties + the radar dashboard + Notion write-back. | **2.7** | Gated (live cron) | No | ROS-BACKLOG F-DRIFT-4 / E3 / G1 | Open — Guy-gated |
| HV-002 | **Write `HV-DIGEST-<date>.md` on disk before the connector publish** — the live `hv-weekly-digest` (Mon 08:00) emits only to Drive + Gmail draft; persist the durable artifact under `HV/00_Dashboards/` first so an offline run still produces a ledger entry. | **high** | Safe | Yes | ROS-BACKLOG GA-10 | Open |
| HV-003 | **Define an on-disk degraded mode** — when Funda/Pararius/Immoweb/Notion drop, operate from this backlog + `13_Decision_Log/` + `MEMORY.md`, flag stale, queue a refresh; stop degrading to silent no-op or "manual review". | **high** | Safe | Yes | ROS-BACKLOG GA-2 | Open |
| HV-004 | **Correct connector status vs real wiring** — `HV/CLAUDE.md`/`MESH.md` mark Gmail/Notion "verified", but Notion query is Enterprise-gated (fetch/create/update only) and the HV mailbox is Hermes-only, not MCP (per `MEMORY.md` Integrations). State per-connector fallback. | **med** | Safe | Yes | ROS-BACKLOG GA-7 | Open |
| HV-005 | **Reconcile the HV folder schema** — collapse competing numbering (`02_Areas`/`02_Sourcing`, `03_Analysis`/`03_Deals`/`deals/`, empty `04_Assets`) to the `HV/CLAUDE.md` file map; delete dead empties. | **4** | Safe | Yes | ROS-BACKLOG D6 | Open |

## Deal-stage — the pipeline

Stages per `HV/CLAUDE.md`: lead → underwriting → due_diligence → pre-permit → permitting → renovation → stabilised. IC verdicts recorded in [`13_Decision_Log/`](../13_Decision_Log/README.md).

| ID | Asset | Stage | Ask | Next action | Status |
| :-- | :-- | :-- | :-- | :-- | :-- |
| HV-101 | A1 Zuidpark, Antwerp Het Zuid | due_diligence | €975k | Negotiate to discount basis; clear EPC/renovatieverplichting, monument, Bouwcode ≥3 units (HV-DEC-2026-06-21-1) | Open — deal #1 |
| HV-102 | A3 Dries 20, Antwerp | underwriting | €1.15M | Confirm vacant-on-completion + permit-feasible ≥4 units (HV-DEC-2026-06-21-2) | Open — backup #1 |
| HV-103 | Volkstraat 15, Antwerp Het Zuid (Immoweb 21643742) | lead | €950k | Verify EPC + net m²; 4-unit structure exists (lower split risk) — ties/edges Zuidpark | Watch (Notion P1) |
| HV-104 | Badhuiskade 217, Amsterdam Noord | due_diligence | €900k | Decide viewing + DD document request as immediate personal-living move (per MEMORY open decision) | Open — primary personal-living |
| HV-105 | Asterweg 19, Amsterdam Noord (BOG) | lead | €625k | Confirm zoning / residential or live-work conversion feasibility before treating as living option | Open — development track |
| HV-106 | Den Haag mandate posture | lead | — | Set broker mandates (Estata/Frisia/Beeuwkes/SCOOP/Stokman Van Duren); be-first when splitsing gate opens 1-Apr-2026 (HV-DEC-2026-06-21-4) | Open — mandate-only |

## Conventions
- A new IC pass or deal append takes the next free `HV-1NN`; a new infra item takes the next free `HV-0NN`. Never reuse or renumber.
- When a deal-stage item reaches an IC verdict, record the verdict in `13_Decision_Log/` and link it here.
- Closed/superseded items move to `archive.md` (Memory/Archive policy), not deleted, so IDs stay resolvable.

> Seeded 2026-06-22 by ros-evaluator (Group-Autonomy pass, GA-3) — consolidates the HV-owned items that were floating in `CoS/ROS-BACKLOG.md` (F-DRIFT-4, GA-2/7/10, D6) and the live pipeline from `HV/MEMORY.md` into HV's own ranked, enumerable queue.
