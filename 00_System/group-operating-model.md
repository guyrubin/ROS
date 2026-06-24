# Rubin OS — Group Operating Model (multi-company)

**Version:** 1.0
**Created:** 2026-06-22
**Owner:** CoS (the group HQ) · **CEO:** Guy
**Status:** Phase 1 active — Arbor is company #1; the rest stay group functions/domains until promoted.

ROS is no longer just Guy's personal multi-domain OS. It is the operating system of a **group** — a portfolio of companies plus shared group services — with **Guy as CEO**. This model is an **operating/agent reframe on top of the assets already built** (meshes, the release engine, the principal + per-client isolation), not a new system and **not a legal/financial entity build**. It costs nothing new to stand up; it renames and wires what exists, and leaves a clean path to physical/legal separation when (and only when) a company earns it.

## The three tiers

```
GROUP  (Rubin OS · CEO = Guy)                      ← CoS is the CEO's office
  │  strategy · capital + attention allocation · group OKRs · board cadence · the Standard · confidentiality
  ├── SHARED SERVICES (built once, consumed by every company)
  │     Delivery/Release engineering · Finance/Admin · Research · the output Standard · the cockpit
  │
  └── COMPANIES (first-class portfolio entities — each runs itself)
        • Arbor — product company #1 (ACTIVE)
        • HollandVest — domain today, company-eligible
        • EA / Advisory — domain today, company-eligible
```

### 1. Group (ROS) — the CEO's office
**CoS becomes the group HQ.** `ros-conductor` is the **portfolio conductor across companies** (not just across Guy's domains). The group owns what only a CEO/HQ owns:
- group strategy + **capital and attention allocation** across companies (where does the next unit of Guy-time / spend go?),
- **group OKRs** + a **per-company board cadence** (each company gets a board-style review; the group gets a portfolio review),
- the **shared services** (below), the **output Standard**, and **cross-company confidentiality** (no company's private context leaks into another's session — the EA-client rule, raised to the company axis).

### 2. Companies — first-class entities
A **company** is a value-producing business with its own: **org** (a mesh or set of meshes), **backlog(s)**, **release/delivery lane**, **identity/connectors**, **P&L lane**, and **isolation class**. It runs itself day-to-day; the group sets strategy, allocates capital/attention, and holds the prod-promotion + spend gates.

- **Arbor = company #1** (ACTIVE). Its org *is* the existing PAI/Arbor mesh; see [Arbor COMPANY.md](../PAI/projects/arbor/COMPANY.md).
- **HollandVest, EA/Advisory** are **company-eligible domains** — real proto-businesses, but they stay domains until promoted (gradual, on purpose).

### 3. Shared services — group-level, consumed by all
Built once, offered to every company so none rebuilds them:
- **Delivery / Release engineering** — [`/00_System/release-engineering/`](release-engineering/README.md), lead `ros-release-lead`. Already product-aware (per-company release trains).
- **Finance / Admin** — FIN mesh; will consolidate per-company P&L lanes when legal/financial separation is turned on (not now).
- **Research** — KK-owned `research-agent`, dispatchable by any company.
- **The output Standard** — `/de-slop` + the ROS Standard; the brand/quality bar for every company's outputs.
- **The cockpit** — the command center, to gain a per-company portfolio view (the CEO surface; see Roadmap).

## Company vs group-function vs personal (the taxonomy)

| Kind | Definition | Examples |
| :-- | :-- | :-- |
| **Company** | a value-producing business entity with its own org, backlog, delivery, identity, P&L, isolation | **Arbor** |
| **Company-eligible domain** | a proto-business run as a domain until promoted | HollandVest, EA/Advisory |
| **Group service** | a capability built once and consumed by all companies | Delivery, FIN, Research, the Standard, the cockpit; CoS itself |
| **Personal** | Guy's personal operations — never a company | KK (personal ops) |

The canonical list + each entity's attributes live in the **[company registry](companies.md)**.

## Isolation (reuse the patterns we already have)
Per-company isolation **is** the principal + EA-per-client pattern, raised one level:
- a company's **agents, memory, connectors, and (later) financials are scoped to that company**;
- the **group (CoS) sees across all companies**; a single company's session does not;
- **no cross-company leakage** of private context unless explicitly shared — same non-negotiable as the EA client-vs-client and Guy↔Joseph rules;
- **company × principal matrix:** Guy is **CEO of every company**; Joseph operates inside EA/Advisory (and his FIN slice). Future people attach per company without a redesign.

Source of truth for identity/confidentiality: [`identity-policy.md`](identity-policy.md) + [`principals.md`](principals.md), now read **per company**.

## How ROS "integrates to" a company (the interface)
A company exposes four interfaces to the group; the group reads these and does **not** reach into the company's internals:
1. its **backlog(s)** (what it's building),
2. its **release ledger** entry (what's shipping — [RELEASE-LEDGER.md](release-engineering/RELEASE-LEDGER.md)),
3. a **health/status** signal (the cockpit domain card / digest),
4. a **P&L lane** (revenue/cost; consolidated by FIN later).

Today Arbor is **nested** in the ROS tree, so the interface is *logical*. The day a company is worth separating, it becomes its **own workspace/repo** exposing the **same four interfaces** — so the move is gradual and costs nothing until taken. This is exactly what "a different company setting that ROS integrates to" means: same contract, looser coupling over time.

## Mapping onto today (nothing new is built)
| Group concept | Already exists as |
| :-- | :-- |
| company org | a **mesh** (`mesh/MESH.md` + `.claude/agents/`) |
| per-company delivery | the **release engine** (per-product trains) |
| isolation | **principals.md** + **identity-policy.md** + EA per-client `CONTEXT.md` |
| backlogs | **ROS-BACKLOG** / **PRODUCT-BACKLOG** / **MARKETING-BACKLOG** |
| group HQ | **CoS** + `ros-conductor` |

The reframe = **a registry + this model + a CEO lens on the cockpit + boot declaring the active company.** No new infra, no new SaaS, no spend.

## CEO operating rhythm
- **Group review** (portfolio): companies' status, capital/attention allocation, cross-company conflicts.
- **Per-company board review**: each company's OKRs, backlog, releases, P&L — run like a board meeting with Guy as chair.
- **The one bottleneck stays batched**: prod-promotion sign-off (one decision per company per release train).

## Gradual rollout (fast · efficient · no extra cost)
- **Phase 1 — now (this build, zero cost):** name the model · stand up the [company registry](companies.md) · make **Arbor company #1** · reframe **CoS as group HQ** · boot declares active company. All logical, all reuse.
- **Phase 2 — when ready:** promote HollandVest and/or EA/Advisory to companies (give each the four interfaces + isolation). Still no infra cost.
- **Phase 3 — when a company earns it:** physical/legal separation — own workspace/repo, own identity (e.g. `arbor@`), own legal entity + P&L consolidation. Cost is taken deliberately, per company, only when justified.

See also: [companies.md](companies.md) (registry) · [Arbor COMPANY.md](../PAI/projects/arbor/COMPANY.md) · [release-engineering/](release-engineering/README.md) · [`AGENTS.md`](../AGENTS.md) boot.
