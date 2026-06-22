# CoS Delivery — Release Engineering Mesh

**Owner principal:** Guy · **Tier:** CoS sub-mesh (DevSecOps under the Conductor) · **Lead:** `ros-release-lead`
**Framework:** [ROS Agent Framework](../../00_System/agent-framework/README.md) · **Standard:** [release-engineering/](../../00_System/release-engineering/README.md)
**Created:** 2026-06-22

The CoS-owned capability that ships code **incrementally, gated, and coordinated** across products. It is to *delivery* what `ros-conductor` is to *strategy* and `ros-evaluator` is to *improvement* — the third CoS engine. It does not build product features; it owns the **release train** that gets them to prod safely (ROS-BACKLOG Theme O).

## Why it exists
A 2026-06-22 session built 6 green Arbor items and could not ship them safely: blind 100%-to-prod deploys, `main` moving under concurrent sessions, no incremental promotion, no feature/claim-level gating, ad-hoc regression. Manual in-session deploys are the wrong tool. This mesh is the right one.

## Roster

| Role | Agent | Does |
| :-- | :-- | :-- |
| **Lead** | `ros-release-lead` | Owns the standard, the train, the ledger + merge-lane lock, the claim register; prepares the prod-promote decision. |
| Product team (Arbor) | `arbor-devsecops-lead` (+ `arbor-release/qa/sec/sre`) | Executes the build + gate + canary inside the pipeline; reports up. |
| Product team (ROS-the-OS) | `ros-evaluator` + CoS | ROS doc/agent/dashboard releases (lighter pipeline: doc-lint + `build-state.mjs` regression). |
| Product team (Arbor Marketing) | `arbor-marketing-lead` | Marketing-surface releases (`regress:mktg`, firewall lint). |
| Sign-off | CoS / Guy | Holds prod promotion (Level 3) + claim flips + Level 4–5. |

> The product teams already exist and are owned by their products. This mesh **borrows** them into a train; it adds no duplicate release agents.

## The gate (this mesh's Definition-of-Done)
A release is **DONE** only when: items were READY + from one canonical backlog · full green-gate passed (not lint+test only) · branch was current with `main` · canary + smoke green · claim-bearing items shipped dark with registered claims · **prod promotion signed by CoS/Guy** · ledger + backlog (`shipped`+`REL-` id) + product MEMORY written back. (Full pipeline: [RELEASE-PIPELINE.md](../../00_System/release-engineering/RELEASE-PIPELINE.md).)

## Loops it owns

| Loop | Cadence | Posture | Status |
| :-- | :-- | :-- | :-- |
| **Release-train cadence** | weekly (Arbor Product) · 2×/wk (Marketing) · on-demand (ROS) | build→gate→canary→smoke, **stop at prod-promote for Guy** | Proposed — Guy-gated (see [SCHEDULED-LOOPS.md](../../00_System/agent-framework/SCHEDULED-LOOPS.md)) |
| **Ledger heartbeat** | with each train | write-back to `RELEASE-LEDGER.md` + product MEMORY | active (manual until cadence loop is live) |

## Escalation (up to CoS / Guy)
Prod promotion (canary→100%) · claim flip · IAM/cred (OPS-C1 WIF) · billing/store/domain · 2 consecutive rollbacks (kill-switch) · cross-product prod-window conflict.

## Invocation
- **`/ros-release`** — plan + run a train end-to-end (stops at the prod-promote gate).
- Dispatch **`ros-release-lead`** directly for: open/advance a train, claim/release the merge lane, manage the claim register, prepare a promote decision.
- Coordinates with `ros-conductor` (portfolio sequencing) and `ros-evaluator` (ROS-CIL fixes feed `REL-ROS-*`).

## State
- Standard: built 2026-06-22 (`/00_System/release-engineering/`).
- First train: **`REL-ARBOR-001`** seeded in the ledger — the OPS net + `flags.ts` + claim register wiring + the 6 green council items, to ship *through* the pipeline. Pre-flight blockers + Guy-gated items listed in the ledger.

## Team profile (capabilities · operation · standards · tools)

A real DevOps team, not a lone lead. Its people are **borrowed** — each product's DevSecOps pod executes the build inside this team's pipeline (Arbor: `arbor-devsecops-lead` + `arbor-release/qa/sec/sre`; ROS: `ros-evaluator`+CoS; Marketing: `arbor-marketing-lead`). This team owns the *standard, the train, the lane lock, the ledger, the claim register, and the prod-promotion pack*; it adds **no duplicate release agents**.

### 1. Capabilities (across Arbor Product · Arbor Marketing · ROS)
- **Incremental promotion** — branch off current `main` → full green-gate → no-traffic canary + smoke → prod, on every product. No blind 100%-to-prod, no by-hand `gcloud`/`firebase` deploy (the removed bug).
- **Feature/claim-level gating** — claim-bearing code ships **dark** (flag OFF, fails closed) and is exposed only when its register row is signed (Clinical + Safety). A flag flip is a config change, not a deploy.
- **Cross-product release calendar + merge-lane lock** — one coordination board sequences trains across products and serializes merges/promotes so concurrent sessions stop racing `main`.
- **Rollback / kill-switch** — auto-rollback on a failed canary/smoke; 2 consecutive rollbacks on a product halt its train and page Guy.
- **The release ledger** — the live train board (stage · branch · queue · lock holder), written back on every train.
- **Cross-cutting concerns it owns DIRECTLY (no product team does):** IAM/secrets incl. the **OPS-C1 WIF** blocker; the **prod-promotion decision pack** (canary evidence + gate results + ledger, assembled for CoS/Guy); and the **per-product regression-gate definition** (what each suite must contain to count as green).

### 2. Operation (the team's loop)
A train pulls only **READY** items from **one** canonical backlog (id · owner · riskClass · score), bundles them as `REL-<product>-<n>`, and sequences by the conflict map. The lead opens the train, **claims the merge lane**, and the product DevSecOps pod builds on `rel/<product>/<n>` cut off current `origin/main` — building stays parallel and unlocked. Each promotion requires the full green-gate **and** branch-current-with-`main` (rebase + re-gate if behind); only the lock-holder merges/promotes. Green → no-traffic canary → smoke (healthz+version · 1.5 MB ≠ 413 · authed render); green canary is eligible, fail auto-rolls back. The train then **writes the ledger + backlog + product MEMORY and STOPS at prod-promote** — that sign-off is always CoS/Guy (Level 3). **Merge-lane lock protocol (the documented pain that created this mesh):** build wide, merge narrow — parallel branches are free, but merge-to-`main` and promote serialize through a single ledger-held lane lock; the lock-holder is the only writer to `main`, and any branch behind `main` rebases and re-gates before it can take the lane.

### 3. Standards (binding, referenced not restated)
The binding standard is **[`/00_System/release-engineering/`](../../00_System/release-engineering/README.md)** — pipeline in [RELEASE-PIPELINE.md](../../00_System/release-engineering/RELEASE-PIPELINE.md), live board in [RELEASE-LEDGER.md](../../00_System/release-engineering/RELEASE-LEDGER.md), gate in [GREEN-GATE.md](../../00_System/release-engineering/GREEN-GATE.md). The per-product regression gate, in one table:

| Product | Regression gate |
| :-- | :-- |
| **Arbor Product** | `lint` (tsc) + `test` + `check:framework` + `eval:safety` |
| **Arbor Marketing** | `regress:mktg` + firewall lint (no unregistered claim string) |
| **ROS (OS)** | doc-lint + `build-state.mjs` clean |

### 4. Tools (surfaces)
- **git branches + worktree isolation** — `rel/<product>/<n>` per train; isolated worktrees for parallel building.
- **Cloud Build / Cloud Run / Firebase Hosting** (Arbor) — the canary→promote pipeline surface; never invoked by hand outside it.
- **`app/src/lib/flags.ts` + the claim register** ([CLAIM-REGISTER.md](../../00_System/release-engineering/CLAIM-REGISTER.md)) — `isEnabled(flag, ctx)`, default OFF; the switchboard for claim-level gating.
- **[RELEASE-LEDGER.md](../../00_System/release-engineering/RELEASE-LEDGER.md)** — the train board + merge-lane lock.
- **`build-state.mjs`** (ROS) — the ROS regression check + dashboard feed.
- **`scheduled-tasks` MCP** — the runtime for the (proposed, Guy-gated) release-train cadence loop.
