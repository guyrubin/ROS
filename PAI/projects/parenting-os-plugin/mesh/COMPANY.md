# Arbor — The Multi-Agent Company

**Version:** 1.0 · **Created:** 2026-06-22
**Owner:** ROS PAI (product) + ROS CoS (portfolio)
**Status:** Live. This is the **canonical internal org map** for the Arbor company — the single view of its topology + teams that the CHARTER, ROSTER, framework, and the delivery/marketing meshes each saw only a slice of. The **group-level company charter** — Arbor's boundary/interfaces/gates *as a company in the multi-company group* (what [`companies.md`](../../../../00_System/companies.md) points to) — is **[`../COMPANY.md`](../COMPANY.md)**. This file = how Arbor is organized *inside*; the charter = how it plugs into the group.

Arbor is run as a real product company made of agents: a governance layer sets priority, two Tier-1 advisory functions decide *what is worth building and whether it is sound*, an intake fuses every demand stream into one scored backlog, a conductor turns it into conflict-free build waves, and three Tier-2 teams (build · ship-gate · demand) plus shared services do the work — every change green-gated, every claim cleared, every decision traceable to a backlog item and a memory entry.

> This doc **consolidates and points**; it does not restate. Canonical depth lives in [`CHARTER.md`](CHARTER.md) (principles + safety), [`ROSTER.md`](ROSTER.md) (ownership + paths), the [Agent Framework](../../../../00_System/agent-framework/README.md) (the reusable pattern), and each team's own spec linked below.

## Topology

```
 GOVERN (T0)   ROS CoS ───────────────── ROS PAI            portfolio + product owner
                  │                          │
 COS ENGINES   ros-conductor · ros-evaluator · CoS Delivery/DevOps (ros-release-lead)
                                             │
 ADVISORY (T1) Advisory & Clinical Board  ◄──┼──►  Head of Product (arbor-product)
               (philosophy back-end + clinical, holds veto) │ (discovery · PRD · metric · voice-of-parent)
                                             ▼  both feed ▼
 INTAKE        Product Council  ── fuses 5 streams → ONE scored PRODUCT-BACKLOG
                                             ▼
 CONDUCTOR     arbor-orchestrator  ── backlog → conflict-free build waves
              ┌──────────────┬──────────────┬──────────────┐
 TEAMS (T2)   Domain Pods ×10  DevSecOps ×5   Marketing ×5
              build the app    gate every ship funnel · brand
 SHARED SVC   Research service (research-agent, KK-owned) · voice-of-parent → Head of Product
```

A visual of this org (with built/gap status) was rendered in the 2026-06-22 design session.

## The five teams (the working-session scope) — profile: capabilities · operation · standards · tools

| Team | Lead | Capabilities | Operation | Standard (DoD) | Tools | Canonical spec |
| :-- | :-- | :-- | :-- | :-- | :-- | :-- |
| **DevOps (CoS Delivery)** | `ros-release-lead` | Incremental promotion (branch→gate→canary→prod), feature/claim-level gating, cross-product release calendar + merge-lane lock, rollback/kill-switch, IAM/secrets (OPS-C1 WIF) | Train: READY items → branch → product DevSecOps builds+gates+canary → ledger → **STOP at prod-promote for CoS/Guy** | READY from one backlog · full green-gate · branch current · canary+smoke green · claims shipped dark · prod-promote signed · ledger+MEMORY written | git+worktrees, Cloud Build/Run/Hosting, `flags.ts` claim register, RELEASE-LEDGER, `build-state.mjs`, scheduled-tasks | [`CoS/delivery/MESH.md`](../../../../CoS/delivery/MESH.md) + [release-engineering/](../../../../00_System/release-engineering/README.md) |
| **Product (dept)** | `arbor-product` (Head of Product) | Head of Product + **PM** (`arbor-pm`, backlog engine) + **UX/Research** (`arbor-ux`, voice-of-parent + flows) + **UI** (`arbor-design`) + 10 eng pods | Direction (HoP) → research+flow (UX) → UI spec (Design) → ready scored `AP-` ticket (PM) → Council → Orchestrator builds | Each role's DoD in [`teams/product.md`](teams/product.md): evidence-led · usable (all states) · ready-bar + metric · green-gate | `prd-generator`, `write-spec`, `product-management:*`, `design:*`, `impeccable`; dispatches `research-agent` + `arbor-critic-feedback` | [`teams/product.md`](teams/product.md) |
| **Clinical & Philosophy Advisory** | `arbor-clinical-lead` | Clinical requirements intake; soundness + claim review (peds/SLP/psych lenses); internal product-philosophy rubric (`arbor-advisor`) | Advisory in, review out; benchmarks vs CDC-2022/AAP/ASHA; substantiates claims so they can ship | **Veto** on clinical soundness + any developmental/medical/effect-size claim (co-held with `arbor-safety`) | `arbor-clinical-loop`, `arbor-product-council`; WebSearch (guideline lookups) | [`teams/advisory.md`](teams/advisory.md) |
| **Marketing** | `arbor-marketing-lead` | Brand/ECD, content (EN+HE/RTL), SEO/AEO, growth loops, funnel awareness→activation→referral | Autonomous loop: SENSE→frame vs brand spine→build→ECD+safety gate→publish safe / gate paid | On-brand (ECD veto on generic) · claims substantiated · channel-fit+CTA · EN+HE preview · backlog re-scored | `marketing:*`, `gtm-strategist`, `copywriter`; Canva/SEO tools | [`marketing/MESH.md`](marketing/MESH.md) + [`BRAND-STRATEGY.md`](marketing/BRAND-STRATEGY.md) |
| **Research** | `research-agent` (KK) | Sourced, fact-checked, cited briefs: competitor scans, market/regulatory, due-diligence, tool comparisons | On-demand: gather multi-source → adversarially verify → hand cited brief back to the dispatcher | Claims verified before reporting; uncertainty flagged; no action taken | `deep-research`, WebSearch/WebFetch | [`KK/research/MESH.md`](../../../../KK/research/MESH.md) |

## The rest of the company (already built)

- **Governance (T0):** **ROS CoS** — portfolio, OKRs, cross-domain priority, final prod green-gate sign-off. **ROS PAI** — Arbor product owner: roadmap priority, PRDs, GTM intent, pricing.
- **CoS engines:** `ros-conductor` (strategy/sequencing) · `ros-evaluator` (ROS self-improvement, ROS-CIL) · CoS Delivery/DevOps (above).
- **Product Council (intake):** fuses **five** streams — Head of Product, Advisory, Clinical, Marketing feature-requests, CIL findings — into one scored `PRODUCT-BACKLOG.md`. Clinical-claim items aren't build-ready until the Clinical Board clears them. Loop `/arbor-product-council`. See [`PRODUCT-COUNCIL.md`](PRODUCT-COUNCIL.md).
- **Conductor:** `arbor-orchestrator` — the only agent that declares a wave shipped; builds only from the backlog; enforces the [CONFLICT-MAP](execution/exec-blueprint-2026-06-17/CONFLICT-MAP.md).
- **Domain Pods (10):** `arbor-ai · -avatar · -practice · -growth · -memory · -billing · -safety · -native · -api · -design` — each owns a slice of `app/src/` and runs the dev loop. Ownership map in [`ROSTER.md`](ROSTER.md).
- **DevSecOps (5):** `arbor-devsecops-lead · -sec · -release · -sre · -qa` — gates every ship; veto on quality/security/release. See [`teams/devsecops.md`](teams/devsecops.md).
- **Continuous Improvement Loop:** `arbor-evaluator` + the critic panel — evaluates the live app, scores+verifies findings into the backlog. See [`improvement/CIL.md`](improvement/CIL.md).

## Non-negotiables (the firewall + the gates)
- **Back-end inspiration, never branding.** The product-philosophy rubric draws on a named thinker's themes **as internal design inspiration only**. That name/likeness, and the word "clinical" as an endorsement, **never** appear in marketing, app copy, store listings, or any public claim. Arbor is never presented as authored, endorsed, or supervised by that thinker or by licensed clinicians. Violating this is a marketing/safety veto. (CHARTER §3 p11.)
- **Clinical soundness is a gate, not a footnote.** Any feature tracking development, screening behavior, coaching speech, or touching health is Clinical-Board reviewed; a soundness veto blocks it like a safety veto.
- **Green-gate or no ship; conflict-map is law; every loop ends in memory.** (CHARTER §3.) Safety levels 0–5 inherited from ROS root; deploy/paid-spend/store/child-data are L3–5 and human-gated.

## How to run the company
- **Decide what to build:** dispatch `arbor-product` (discovery + PRD + metric) → run `/arbor-product-council` (fuse + score) → lands in `PRODUCT-BACKLOG.md`.
- **Build a wave:** dispatch `arbor-orchestrator` or run `/arbor-mesh`.
- **Ship safely:** run `/ros-release` (the train stops at the prod-promote gate for CoS/Guy).
- **Improve on a clock:** `/arbor-improve` (CIL) · `/arbor-product-council` · `/arbor-marketing-loop` · `/arbor-clinical-loop` run live on `scheduled-tasks`; merge/deploy stay human-gated.
- **Review a feature:** `arbor-clinical-lead` (soundness+claims) / `arbor-advisor` (worth-building).

## Changelog
- **2026-06-22 v1.0** — Company map created (consolidation). Added Tier-1 **Head of Product** (`arbor-product`) closing the "what to build & why" + voice-of-parent gap. CoS DevOps team profiled into a full team (`CoS/delivery/MESH.md`). Product Council intake now fuses **five** streams (added Head of Product).
