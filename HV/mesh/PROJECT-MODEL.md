# HV Development Project-Management Model

**Version:** 1.0 · **Created:** 2026-06-21 · **Owner:** `hv-execution` (PM lead) + `hv-cost-control` / `hv-programme` / `hv-procurement`
**Purpose:** Turn an *acquired* deal into a *delivered* one — on scope, on budget, on programme — and hand a stabilised, revalued asset to refinance. This is the back half of BRRRR made into a real PM function, not a single tracker. Capitalizes the empty `HV/06–08` + `13` folders and the Notion HV backbone.

> **The handoff:** the deal mesh (`hv-orchestrator` + sourcing/underwriting/permit/advisor panel) decides *whether* and *at what numbers*. At the go-decision the **underwriting model becomes the project baseline** (the budget, programme and exit the PM is measured against). Drift from that baseline is the thing this function exists to catch.

---

## 1. Lifecycle — the stage gates (post-acquisition)

Each gate has a Definition-of-Done; you do not pass a gate until it's met. `hv-execution` runs the gate review.

| Gate | Stage | DoD to exit the gate |
| :-- | :-- | :-- |
| **G0** | **Handover-in** | Deal note → project charter created; underwriting model imported as the **baseline budget + programme + exit**; team + RACI set; survey/diligence gaps from DD listed as day-1 actions |
| **G1** | **Design & Permit** | Concept→technical design fixed; permit submitted (`hv-permit` pathway → `hv-execution` tracks status); cost plan priced to design; **GMP/contingency confirmed vs baseline** |
| **G2** | **Procurement / Tender** | Trades tendered; contractor(s) appointed; contract + payment-milestone schedule signed; programme contractually fixed |
| **G3** | **Mobilise** | Permit granted/irrevocable; build facility drawdown #1 ready; site setup, insurances, party-wall/burenakkoord, start-of-works notice |
| **G4** | **Construction** | Works to programme; monthly valuation → certified draw; variations controlled; this is where the weekly cadence lives |
| **G5** | **Snagging / Completion** | Practical completion; snag list cleared; statutory sign-offs (oplevering / as-built / EPC / *BE: renovatieverplichting met*); occupancy-ready |
| **G6** | **Stabilise (Rent / Sell)** | Rent: tenanted at modelled rent + **WWS points locked (NL)**; Sell: units listed/sold, notary lined up. Income/sale vs model confirmed |
| **G7** | **Refinance / Exit** | Revaluation ordered; refinance drawn at ARV×LTV (DSCR cleared) **or** sale completed; cash-out vs the underwriting refinance-gap reconciled |
| **G8** | **Close-out** | Final account settled; lessons → MEMORY; asset → `HV/04_Assets/` (hold) or deal closed (sell); decision log archived |

## 2. Control framework — the seven instruments

The PM function is these seven artifacts, kept live. Templates: `HV/06_Renovation/_templates/`.

1. **Project Charter** — scope, objectives, baseline budget/programme/exit, team + RACI, assumptions, success criteria. *(`hv-execution`)*
2. **Cost Control** — budget vs committed vs actual vs **cost-to-complete (CTC)**, contingency drawdown ledger, variations register, anticipated final cost (AFC). *(`hv-cost-control`)*
3. **Cashflow & Draw Schedule** — lender certified-milestone drawdowns + equity calls; cash runway. *(`hv-cost-control` + `hv-mortgage` at refi)*
4. **Programme** — milestone schedule, **critical path**, 4-week look-ahead, permit-to-completion tracking, float. *(`hv-programme`)*
5. **Procurement & Vendors** — tender log, vendor/contractor register, contract + payment-milestone status, retentions. *(`hv-procurement`)*
6. **Risk Register** — likelihood×impact, mitigation, owner, trigger; the live top-5 surfaced in every report. *(`hv-execution`, fed by all)*
7. **Quality & Handover** — snag/punch list, statutory sign-off checklist, completion/handover pack. *(`hv-execution`)*

Plus the **Decision Log** (`HV/13_Decision_Log/`) + **change control** (any scope/cost/time change vs baseline is a logged, approved variation — never silent).

## 3. Reporting & cadence

| Output | Cadence | Owner | Contents |
| :-- | :-- | :-- | :-- |
| **Project Status Report** | Weekly | `hv-execution` | RAG on **Scope · Cost · Time · Quality · Risk**; % complete; this-week/next-week; top-5 risks; decisions needed |
| **Cost Report + Draw** | Monthly | `hv-cost-control` | Budget/committed/actual/CTC/AFC; contingency left; variation movement; drawdown request |
| **Gate Review** | Per gate | `hv-execution` | DoD checklist; go/hold to next stage |
| **Refinance pack** | At G6→G7 | `hv-cost-control` + `hv-mortgage` | Revaluation, refi-gap reconciliation vs underwriting |

**The one number that governs everything: Anticipated Final Cost vs baseline.** If AFC drifts toward eroding the development margin / refinance pull-out, escalate to `hv-orchestrator` immediately — that's a deal-economics event, not a site event.

## 4. RACI (who does what)

| Activity | hv-execution | hv-cost-control | hv-programme | hv-procurement |
| :-- | :--: | :--: | :--: | :--: |
| Charter / baseline / gate reviews | **A/R** | C | C | C |
| Budget, variations, CTC, draws | A | **R** | C | C |
| Schedule, critical path, look-ahead | A | C | **R** | C |
| Tender, contracts, vendor mgmt | A | C | C | **R** |
| Risk register | **R** | C | C | C |
| Weekly status report | **R** | C | C | C |
| Refinance coordination | A | **R** | I | I |
| External vendor/lender comms | **A** (draft-first, L3) | C | I | R (draft-first) |

## 5. Notion backbone (use it — don't reinvent)
Source: `/00_System/notion_database_registry.md`. PM layer writes to:
- **HV Tasks** `10d8e0b9-…` — milestones, actions, snags *(hv-execution / hv-programme)*
- **Documents & Models** `821baf7b-…` — drawings, contracts, cost reports *(hv-cost-control / hv-procurement)*
- **Vendors & Partners** `95f6ed2b-…` — contractor/advisor register *(hv-procurement)*
- **Capital & Financing** `f8419975-…` — draws, refinance *(hv-cost-control)*

## 6. Market specifics on the critical path
- **NL:** omgevingsvergunning sign-off + oplevering; **WWS points must be locked at completion** to secure free-sector rent (a programme + design dependency, not an afterthought); refinance at revaluation in let-state.
- **BE:** omgevingsvergunning + **renovatieverplichting deadline** (E/F→D in 6 yrs) is a hard completion gate; **21%/6% VAT status** drives whether units can be sold spec or must be let — a procurement/exit dependency. Engage the BE notary at G1, not G7.

## 7. Guardrails
- **No fabricated progress** — every % and status is grounded in a real artifact (valuation, certificate, photo, invoice).
- **Change control or it didn't happen** — baseline changes only via logged, approved variations.
- **External comms draft-first** (Level 3, `bhollandvest@gmail.com`); **payments/contracts Level 4** (state amounts, confirm).
- **AFC-vs-baseline is the escalation tripwire** to the deal mesh.
