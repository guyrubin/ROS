# HV Deal Mesh

**Version:** 1.0
**Created:** 2026-06-21
**Owner:** HV (HollandVest) · reports to ros-conductor (CoS)
**Loop type:** both (on-demand deal work + scheduled deal radar)
**Runs:** `/AGENTS.md` boot → reads `/HV/MEMORY.md` → [ROS Agent Framework](../../00_System/agent-framework/FRAMEWORK.md)

## Mission
Turn raw market signal into investment-committee-grade decisions: source candidates against the buy-box, underwrite them (BRRRR/value-add), clear the permit/zoning path, reach an explicit Proceed/Hold verdict — fast, with facts/assumptions/risks always separated — and once approved, **execute the deal end-to-end (Renovate → Rent → Refinance)**, backed by a deal-grade DD research lane.

## Roster

| ID | Role | Owns | Escalates to |
| :-- | :-- | :-- | :-- |
| `hv-orchestrator` | Lead | Frames the deal question, dispatches pods, holds the IC gate, writes the decision | ros-conductor |
| `hv-sourcing` | Sourcing/radar | Funda/Pararius/Kadaster scans, buy-box fit-scoring, candidate shortlist | `hv-orchestrator` |
| `hv-underwriting` | Underwriting | BRRRR model, WWS points, ARV/LTV/yield, financial verdict | `hv-orchestrator` |
| `hv-permit` | Permit/zoning | Vergunning/bestemmingsplan pathway, monument/protected-cityscape flags, critical-path | `hv-orchestrator` |
| `hv-execution` | **PM lead / project director** | The back half of BRRRR as a stage-gated project (G0–G8): holds the baseline, runs gate reviews, weekly RAG status, risk/decision/change-control, escalates AFC-vs-baseline; leads the PM pods (`HV/06,07,08,13`) | `hv-orchestrator` |
| `hv-cost-control` | PM — cost/QS | Budget vs committed vs actual vs CTC, contingency ledger, variations, AFC, draw schedule/cashflow | `hv-execution` |
| `hv-programme` | PM — planner | Milestone schedule, critical path, look-ahead, permit-to-completion, slippage + carry cost | `hv-execution` |
| `hv-procurement` | PM — contracts | Tender log, vendor register, contracts + certified-milestone payments, retentions | `hv-execution` |
| `hv-architecture` | Advisor — feasibility | Buildable scheme, structural/heritage/daylight/fire constraints, fragile concept assumptions, reno grade + contingency | `hv-orchestrator` |
| `hv-finance` | Advisor — fiscal/structuring | Transfer tax/registratierechten, VAT-vs-OVB exit fork, input-VAT, entity (BV/vennootschap), cross-border | `hv-orchestrator` |
| `hv-investor` | Advisor — IC skeptic | Risk-adjusted ranking, margin-of-safety under stress, deal-killer + proceed-condition, portfolio call | `hv-orchestrator` |
| `hv-mortgage` | Advisor — finance | Debt structure, day-1 cash, refinance pull-out, DSCR test, financing red flags | `hv-orchestrator` |

> Fan-out pays here: `hv-sourcing` screens N listings in parallel, then `hv-underwriting` + `hv-permit` + `hv-architecture` run concurrently on the shortlist, the **advisor panel** (`hv-investor` / `hv-mortgage` / `hv-finance`) mediates across it, and `hv-orchestrator` synthesizes the IC memo. **After go, the deal becomes a project:** `hv-execution` (PM lead) imports the underwriting model as the baseline and runs the **stage-gated lifecycle (G0–G8)** with `hv-cost-control` / `hv-programme` / `hv-procurement` — controls, weekly RAG status, and the AFC-vs-baseline tripwire per [`PROJECT-MODEL.md`](PROJECT-MODEL.md) (templates: [`06_Renovation/_templates/`](../06_Renovation/_templates/); status roll-up: `/hv-project-control`). **Research is a shared lane:** any pod dispatches `research-agent` with [`DD-brief-template.md`](DD-brief-template.md) for deal-grade DD (ROS-BACKLOG D2). **Runnable end-to-end** via the [`hv-dev-deal` workflow](../../.claude/workflows/hv-dev-deal.workflow.js) (`/hv-dev-deal`).

## Gate (Definition-of-Done)
- Facts / labeled assumptions / risks / financial impact **separated**.
- Yields, LTV, ARV computed in `<thinking>`; missing variables flagged.
- **Dual-exit** modeled where development is in play (develop-to-sell margin *and* BRRRR yield/DSCR) per [`DEV-MODEL.md`](DEV-MODEL.md); the winning exit + the breakeven that flips it stated.
- Permit dependency on the critical path explicitly stated.
- Explicit verdict: **Proceed / Proceed-if-conditions / Hold / Do-not-proceed** + next actions.
- Sources grounded ([`CONNECTOR-LAYER.md`](CONNECTOR-LAYER.md) — no invented listings); as-is / stabilised / ARV values separated.
- **Underwrite the discount, not the pro-forma:** when leveraged pro-formas are underwater at ask, rank by margin-of-safety (entry €/m² gap) — that's a pricing signal, not a thesis kill.

## Skills this mesh loads
| Task | Skill |
| :-- | :-- |
| Investment analysis, IC memo | `deal-analyzer` |
| BRRRR financial model | `brrrr-calculator` |
| Permit / zoning pathway | `permit-pathway` |
| WWS points, rent ceiling | `wws-analyzer` |
| Create/update deal note | `deal-note-creator` |
| **Deal-grade DD research** | `research-agent` + [`DD-brief-template.md`](DD-brief-template.md) |
| **Development project management (G0–G8)** | [`PROJECT-MODEL.md`](PROJECT-MODEL.md) + [`_templates/`](../06_Renovation/_templates/) + `project-tracker` (via `hv-execution` + cost/programme/procurement pods); `/hv-project-control` roll-up |
| Deal correspondence | `email-composer` (Gmail `hollandvest`) |

## Loops it owns

| Loop | Type | Cadence | Posture | Registry |
| :-- | :-- | :-- | :-- | :-- |
| Deal analysis / IC | on-demand | — | acts in-workspace | — |
| Dev-deal IC pass (`/hv-dev-deal`) | on-demand | — | acts in-workspace | — |
| **Project control** (`/hv-project-control`) | on-demand / weekly per live project | Weekly | acts in-workspace; vendor/lender comms draft-first | — |
| HV Deal Radar | scheduled (proposed) | Weekly Mon | read-only | SCHEDULED-LOOPS.md |

## Markets (EU-pluggable — NL-first)
HV is built to become **the ultimate AI RE developer in the EU**, so `market` is a **parameter, not a hard-code**. NL is live and deep; other EU markets are config, not a rewrite.

| Market | Status | Sourcing portals | Regulation model | Comps / permit regime |
| :-- | :-- | :-- | :-- | :-- |
| **NL** | ✅ Live | Pararius · brokers · Funda-via-snippets *(Funda detail = bot-walled)* · Kadaster/BAG | WWS / Wet betaalbare huur · liberalisation (>186 pts) · OVB 8% investor | Kadaster comps · omgevingsvergunning / omgevingsplan · splitsing gated to 1-Apr-2026 |
| **BE / Flanders** | ✅ Live (module) | Immoweb · Zimmo · Immovlan · Realo · brokers | Registratierechten 12% · 21%/6% VAT fork · renovatieverplichting (E/F→D in 6yr) | Statbel/Realo comps · omgevingsvergunning Vlaanderen · RUP · opdeling (Bouwcode) |
| DE / ES / PT … | 🔜 Config | _(per-market portals)_ | _(per-market rent/tax law)_ | _(per-market comps + permit)_ |

Each pod scopes its work to the active market: `hv-sourcing` uses that market's portals + buy-box; `hv-underwriting` its rent/tax model; `hv-permit` its permit regime; the DD-brief and IC memo state the market. Adding a market = fill a [market module](../02_Areas/markets/) + this row, not new agents. **BE/Flanders module:** [`02_Areas/markets/BE-Flanders.md`](../02_Areas/markets/BE-Flanders.md). **Data spine:** [`CONNECTOR-LAYER.md`](CONNECTOR-LAYER.md).

## Notion data backbone (the real HV system — use it, don't reinvent)
HV already runs on a verified Notion environment + a daily scan. Pods read/write these via the Notion MCP (source: [`/00_System/notion_database_registry.md`](../../00_System/notion_database_registry.md)). **Do not create parallel trackers.**

| HV database | Notion ID | Used by |
| :-- | :-- | :-- |
| Deals (pipeline) | `fe6a7f22-24f4-45ae-9a52-24dbf46083cb` | hv-sourcing, hv-orchestrator |
| Properties | `3dff6d81-58ba-4bc5-8453-1829e6b0e63c` | hv-sourcing, hv-underwriting |
| HV Tasks | `10d8e0b9-9f5f-4e77-8ffd-f03fe76aea4f` | hv-execution |
| Documents & Models | `821baf7b-d26c-41ef-a014-7ea407b68d3c` | hv-underwriting, hv-execution |
| Vendors & Partners | `95f6ed2b-cb45-4518-814d-810e29f4fb64` | hv-execution |
| Capital & Financing | `f8419975-b16f-42ef-9ac1-e9860d6bf892` | hv-underwriting (refi), FIN |
| HV_AREAS | `83db1165-6361-4980-8fc0-a9bd9d7d78e4` | hv-sourcing |

Plus the **Smart-Living Deal Radar** (`HV/00_Dashboards/Smart_Living_Deal_Radar_Netherlands.md`) — the daily public MVA/MarketSuite scan output. ⚠️ The scan **stalled ~2026-06-05**; reviving it as a real Hermes loop (writes Deals/Properties + radar + write-back) is HV's top infra fix (Guy-gated; see `SCHEDULED-LOOPS.md`).

## How to invoke
- A deal / listing: dispatch `hv-orchestrator` (or a pod directly for a scoped step).
- Command: `/hv.analyze`, `/hv.brrrr`, `/hv.permit`, `/hv.wws`.
- Deterministic batch (screen N listings): model on `arbor-mesh.workflow.js`.

## Boundaries
- Financial administration (invoices, tax, insurance) → FIN.
- Sending deal email: draft-first, Gmail `bhollandvest@gmail.com` only, Level 3 confirm.
- Saves under `HV/03_Deals/`, `HV/04_Assets/`, `HV/13_Decision_Log/` per the HV CLAUDE.md file map.
