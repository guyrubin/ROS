# ROS Delivery — Release Engineering under CoS

**Version:** 1.0
**Created:** 2026-06-22
**Owner:** CoS → `ros-release-lead` (the company release lead)
**Status:** Active — capability built; first release train (`REL-ARBOR-001`) queued.

The one capability that lets the whole system **introduce code incrementally, test it, and ship it** — coordinated across every product, under one owner. It exists because ROS had no real release cycle: Arbor deployed *blind 100% to prod on push to `main`*, `main` *moved under concurrent sessions*, there was *no incremental promotion*, *no feature/claim-level gating*, and the regression bar was *ad-hoc per session*. This is the fix, owned by **DevSecOps under CoS** (ROS-BACKLOG Theme O).

> **It does not replace product DevSecOps teams — it conducts them.** Arbor already has `arbor-devsecops-lead` + `arbor-release/qa/sec/sre`. `ros-release-lead` owns the *standard, the train, the ledger, the claim register, and the prod-promotion gate*; the product teams execute inside it. Same relationship CoS has to every domain.

## The model in one screen

```
PRODUCT BACKLOG (1 per product)         ← BACKLOG-MODEL.md  (3 canonical, feeders flow in)
   │ ready, scored, owned, riskClass
   ▼
RELEASE TRAIN  (REL-<product>-<n>)       ← RELEASE-LEDGER.md (the live coordination board + merge-lane lock)
   │ a bundle of items, one integrator
   ▼
BRANCH off current main → build
   │
   ▼
GREEN-GATE  (tsc · tests · framework · safety · regression)   ← GREEN-GATE.md  (a RELEASE gate, on every promotion)
   │ pass + branch-current-with-main
   ▼
MERGE → main  (serialized through the ledger lock — kills the rebase race)
   │
   ▼
CANARY  (no-traffic tagged revision) → SMOKE → PROMOTE 100%  |  AUTO-ROLLBACK   ← RELEASE-PIPELINE.md
   │                                                              ▲
   └── feature/claim flags: code ships DARK; a claim is flipped ON ─┘
        only when its CLAIM-REGISTER row is green (Clinical + Safety)   ← CLAIM-REGISTER.md
```

Two things are *decoupled* on purpose:
1. **Shipping the code ≠ making the claim.** A feature carrying a developmental/medical/effect-size claim ships behind a flag (default OFF). The wave is never held hostage to one claim's sign-off; the flag is flipped independently once the claim clears. (Arbor branding firewall, operationalized — CHARTER §3 p10–11.)
2. **Building ≠ promoting.** Any session/agent builds on its own branch freely and in parallel. Only **merge-to-main and prod-promote** serialize, through the ledger lock — so concurrent sessions stop racing `main`.

## Read order

1. **[BACKLOG-MODEL.md](BACKLOG-MODEL.md)** — the 3 canonical product backlogs, the feeder→queue→release flow, and the cross-doc identity rules that kill the overlap.
2. **[RELEASE-PIPELINE.md](RELEASE-PIPELINE.md)** — the incremental promotion pipeline, the concurrency/merge-lane protocol, and the branch-current-with-`main` check.
3. **[GREEN-GATE.md](GREEN-GATE.md)** — the regression-gated release gate (the full gate run on *every* promotion, not ad-hoc) + per-product regression suites + cadence.
4. **[CLAIM-REGISTER.md](CLAIM-REGISTER.md)** — feature flags + the claim register: how a single feature/claim is gated independently of its wave.
5. **[RELEASE-LEDGER.md](RELEASE-LEDGER.md)** — the live release-train board across products; the merge-lane lock; `REL-ARBOR-001` seeded.

## Who owns what

| Thing | Owner | Gate |
| :-- | :-- | :-- |
| The release standard (these 5 docs) | `ros-release-lead` (CoS) | — |
| Each product's backlog | the product's Council/lead | — |
| A release train (bundle, sequencing, ledger) | `ros-release-lead` | — |
| The build inside a train | the product DevSecOps team (e.g. `arbor-devsecops-lead`) | green-gate |
| **Prod promotion (canary → 100%)** | **CoS holds the sign-off** | **Level 3 — Guy** |
| A claim flip (flag OFF→ON) | Clinical Board + `arbor-safety` | **Level 3** |
| Money / store / child-data / domain | the product team, surfaced to Guy | **Level 4–5** |

## Scope

- **In:** code- and content-shipping products — **Arbor Product**, **Arbor Marketing**, and **ROS itself** (the OS docs/agents/dashboard). These are the three products the system coordinates a release train for.
- **Out (for now):** knowledge-work meshes (HV/EA/KK/FIN) ship *deliverables*, not deploys — they keep the universal loop + their domain DoD. They can adopt the ledger later for tooling they build.

## Mesh + invocation

- Charter: **[CoS/delivery/MESH.md](../../CoS/delivery/MESH.md)** (the CoS Delivery sub-mesh).
- Lead agent: **`ros-release-lead`** (`.claude/agents/ros/ros-release-lead.md`).
- Run a train: **`/ros-release`** (skill) — plan a train from ready backlog items, build through the product team, green-gate, prepare the canary + smoke, and surface the prod-promote decision to CoS/Guy.
- Cadence loop: see [SCHEDULED-LOOPS.md](../agent-framework/SCHEDULED-LOOPS.md) → *Release-train cadence* (proposed; Guy-gated).
