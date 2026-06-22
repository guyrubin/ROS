# Arbor — Company Charter (product company #1)

**Version:** 1.0 · **Created:** 2026-06-22
**Group:** Rubin OS ([group-operating-model.md](../../../00_System/group-operating-model.md)) · **Registry:** [companies.md](../../../00_System/companies.md)
**CEO:** Guy · **GM / operator:** `arbor-orchestrator`
**Status:** ACTIVE — the first first-class company in the group.

Arbor is a **product company** within the Rubin OS group: a parenting-intelligence SaaS for ages 0–12. This charter makes Arbor a first-class company **without moving any files** — its org *is* the existing PAI/Arbor mesh; this doc names the company boundary, the interfaces it exposes to the group, and the gates the group holds. It is an operating reframe on top of what's built; no legal entity, no new infra, no new cost (Phase 1).

> **Two COMPANY.md files, two altitudes (reconciled 2026-06-22):** *this* file (plugin root) is the **group-facing company charter** — what [`companies.md`](../../../00_System/companies.md) points to: Arbor's boundary, interfaces, and gates *as a company in the group*. The **internal org map** — Arbor's full topology and team profiles — is **[`mesh/COMPANY.md`](mesh/COMPANY.md)** (built in parallel by another session). Charter (this) → org map (`mesh/COMPANY.md`) → depth (`mesh/CHARTER.md` + `ROSTER.md`). Neither restates the other.

## The company (its org — referenced, not restated)
Arbor's internal org is the existing Arbor Agent Mesh — its canonical map is **[`mesh/COMPANY.md`](mesh/COMPANY.md)** (topology + the five teams), with principles/safety in [`mesh/CHARTER.md`](mesh/CHARTER.md). Do not duplicate it here:
- **Advisory Board + Clinical Board** (`mesh/teams/advisory.md`) — product-philosophy rubric + the clinical veto on soundness/claims.
- **Product Council** (`mesh/PRODUCT-COUNCIL.md`) — intake → the one scored product backlog.
- **`arbor-orchestrator`** (GM/conductor) → **10 domain pods + DevSecOps + the Marketing mesh** (`.claude/agents/arbor/`).
- Product owner = **PAI**; portfolio owner = **CoS/group**. That reporting line is unchanged — it is now expressed as "a company reporting to the group."

## The four group interfaces (how the group integrates to Arbor)
| Interface | Arbor's surface |
| :-- | :-- |
| **Backlog(s)** | Arbor Product [`mesh/PRODUCT-BACKLOG.md`](mesh/PRODUCT-BACKLOG.md) (`AP-`) + Arbor Marketing [`mesh/marketing/MARKETING-BACKLOG.md`](mesh/marketing/MARKETING-BACKLOG.md) (`AM-`). Feeders (CIL, Council, Clinical) promote into these. |
| **Release ledger** | `REL-ARBOR-*` via the group Delivery service ([RELEASE-LEDGER.md](../../../00_System/release-engineering/RELEASE-LEDGER.md)); first train `REL-ARBOR-001`. |
| **Health / status** | the live prod app + the CIL eval digest + the cockpit PAI/Arbor card. |
| **P&L lane** | RevenueCat/Stripe billing + image-gen/AI cost; FIN (group service) consolidates when financial separation is turned on. |

## Identity & isolation
- **Identity today:** `bguy` (group account). **Phase 3 (later, when earned):** Arbor's own identity (`arbor@…`) + its own legal entity. Not now.
- **Isolation:** company-scoped, **plus** the non-negotiable child-data + clinical-claim firewall (`mesh/CHARTER.md` §3 p10–11) — operationalized by the group [claim register](../../../00_System/release-engineering/CLAIM-REGISTER.md): no developmental/medical/effect-size claim or clinician identity ships unless registered + signed (Clinical + Safety).

## Group gates Arbor runs under (what the CEO/HQ holds, not Arbor)
- **Prod promotion** (canary → 100%) — CoS/Guy, Level 3, via the release train.
- **Money / store / domain / child-data** — Level 4–5, surfaced to Guy.
- **Any clinical/developmental claim flip** — Clinical Board + `arbor-safety`.
- Everything else — Arbor runs **autonomously** day-to-day (the live CIL/Council/Marketing/Clinical loops), reporting status up to the group.

## Consumes (group shared services — never rebuilt inside Arbor)
Delivery/Release engineering · Finance/Admin · Research (`research-agent`) · the output Standard (`/de-slop`). Arbor keeps its **own** product, clinical, design, and marketing orgs (those are the company's core, not shared services).

## What changed vs "Arbor as a PAI project"
Nothing operational broke. The mesh, loops, backlogs, and firewall are identical. What's new: Arbor is now a **named company** with explicit **interfaces** and a **CEO/group boundary**, so (1) the group can run it as a portfolio company, and (2) it can be physically separated later — its own workspace exposing these same four interfaces — at no cost until that day. See the [group model](../../../00_System/group-operating-model.md) §"How ROS integrates to a company."
