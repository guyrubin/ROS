# HV Decision Log

**Owner:** `hv-orchestrator` (the IC gate) · **Cadence:** every IC pass and live-project gate review writes one row; cleared/closed at the next gate or in the CoS weekly review.
**Rule:** every Proceed / Proceed-if-conditions / Hold / Do-not-proceed verdict from the [HV Deal Mesh](../mesh/MESH.md) Definition-of-Done persists here — not ad hoc inside `03_Deals/` subfolders. The full IC memo stays in `03_Deals/`; this is the durable, scannable ledger of the *verdict*. Closed/superseded rows move to `archive.md`.

Path of record for `HV/CLAUDE.md` File-locations → Decision log, and for `HV/mesh/MESH.md` §Boundaries (`13_Decision_Log/` saves). One row per IC verdict or stage-gate decision. IDs are stable: `HV-DEC-YYYY-MM-DD-N`.

| ID | Decision (deal / gate) | Verdict | Conditions / breakeven | Owner | Due / review | Status | IC memo |
| :-- | :-- | :-- | :-- | :-- | :-- | :-- | :-- |
| HV-DEC-2026-06-21-1 | A1 Zuidpark, Antwerp Het Zuid — €975k whole block | **Proceed-if-conditions** (deal #1, at a negotiated basis only) | Negotiate to ~33% €/m² discount (≈€480k latent equity); confirm EPC/renovatieverplichting, not a beschermd monument, Bouwcode allows ≥3 sellable units | Guy / `hv-orchestrator` | At negotiated offer | Open | [IC-MEMO](../03_Deals/2026-06-21_dev-research/IC-MEMO-development-alternatives.md) |
| HV-DEC-2026-06-21-2 | A3 Dries 20, Antwerp — €1.15M mixed-use whole bldg | **Proceed-if-conditions** (backup #1 / cleanest execution) | Vacant-on-completion + permit-feasible unit count ≥4 | Guy / `hv-orchestrator` | If A1 falls | Open | [IC-MEMO](../03_Deals/2026-06-21_dev-research/IC-MEMO-development-alternatives.md) |
| HV-DEC-2026-06-21-3 | D1 1e Sweelinckstraat 6, Den Haag Duinoord — €1.65M | **Do-not-proceed** | Over cap, souterrain dig risk, split frozen to 1-Apr-2026; watch only at ≤€1.35M | `hv-orchestrator` | — (closed) | Closed | [IC-MEMO](../03_Deals/2026-06-21_dev-research/IC-MEMO-development-alternatives.md) |
| HV-DEC-2026-06-21-4 | Den Haag market posture | **Hold — set mandate, don't buy** | In-budget prime value-add already sold; broker mandates + a 1-Apr-2026 splitsing trigger (be-first-when-gate-opens, not buy-now) | `hv-orchestrator` | 2026-04-01 (gate opens) | Open | [IC-MEMO](../03_Deals/2026-06-21_dev-research/IC-MEMO-development-alternatives.md) |

> Seeded 2026-06-22 by ros-evaluator (Group-Autonomy pass, GA-4) from the verdicts in `HV/MEMORY.md` + the dev-research IC memo, so the IC gate has a ledger of record on disk. Personal-living candidates (Badhuiskade 217 et al.) are tracked in `HV/MEMORY.md` until they reach an IC verdict.
