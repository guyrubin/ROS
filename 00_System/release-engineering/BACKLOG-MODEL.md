# BACKLOG-MODEL — three canonical queues, feeders flow in

**Owner:** `ros-release-lead` (model) + each product's Council/lead (their queue) · **Version:** 1.0 · **Created:** 2026-06-22

The cure for "lots of overlapping." Recon found **5 active backlogs — two both literally named `PRODUCT-BACKLOG.md`** — three incompatible ID schemes, and the same item tracked in 2–4 places with no single owner (image-gen cost cap in 3 docs; the referral loop in 4). This model defines exactly **three canonical product backlogs** the whole system coordinates on, demotes the rest to **feeders**, and gives every item **one identity** that survives across docs.

## The three canonical backlogs (the only shippable queues)

| Product | Canonical backlog | Owner | ID prefix | Feeds the train |
| :-- | :-- | :-- | :-- | :-- |
| **Arbor Product** | `PAI/projects/parenting-os-plugin/mesh/PRODUCT-BACKLOG.md` | Product Council (PAI) | `AP-` | `REL-ARBOR-*` |
| **Arbor Marketing** | `PAI/projects/parenting-os-plugin/mesh/marketing/MARKETING-BACKLOG.md` | `arbor-marketing-lead` | `AM-` | `REL-MKTG-*` |
| **ROS (the OS)** | `CoS/ROS-BACKLOG.md` | CoS (`ros-evaluator` maintains) | `ROS-` | `REL-ROS-*` |

> A backlog is *canonical* if a release train pulls shippable items from it. Nothing else is. There is exactly one canonical backlog per product, and a single shippable item lives in exactly one of them.

## Feeders (produce findings/requests — never hold shippable truth in parallel)

| Feeder | Produces | Flows into | Rule |
| :-- | :-- | :-- | :-- |
| **Arbor CIL** `mesh/improvement/IMPROVEMENT-BACKLOG.md` | scored findings (`CIL-<lens>-*`) | → Product Council intake (`AP-`) or Marketing (`AM-`) | a finding is a *candidate*; it becomes shippable only once promoted into a canonical queue with an `AP-`/`AM-` id that **references** its `CIL-` origin |
| **Product Council intake** (blocks inside `mesh/PRODUCT-BACKLOG.md`) | scored candidates (`DEM/CLI/PHI`) | → the same file's shippable queue as `AP-` | intake is the *front door*; promotion assigns the `AP-` id |
| **Gated decisions** `GATED-DECISIONS-*.md` | Guy decision surface | → unblocks an item in a canonical queue | a decision is not an item; it gates one |
| **Clinical sign-off** `CLINICAL-SIGNOFF-*.md` | claim evidence | → a [claim-register](CLAIM-REGISTER.md) row | evidence, not a queue |
| ROS-CIL audit (`ros-evaluator`) | findings | → `ROS-` items in `ROS-BACKLOG.md` | already the case |

**The pipe, one line:** `CIL/Council/audit (feeders) → promote into the ONE canonical product backlog with a stable AP-/AM-/ROS- id that back-references the feeder id → release train → shipped`.

## Cross-doc identity (kills the duplication)

1. **One item, one canonical id.** When a feeder finding is promoted, it gets an `AP-`/`AM-`/`ROS-` id and is marked `promoted → AP-xxx` in the feeder. It is **not** re-tracked in parallel.
2. **Reference, never re-id.** The canonical item carries `from: CIL-bugs-imagegen-quota` so the lineage is one click. The feeder shows `promoted: AP-014`. No item ever has two live ids in two docs.
3. **One surface, one row.** If the same work shows up from the CIL *and* marketing lens, it is one `AP-`/`AM-` row citing both origins — not two rows.
4. **Release id closes the loop.** When shipped, the canonical item gets its `REL-<product>-<n>` and status `shipped`; the feeder and ledger agree.

## Dedupe actions (applied this build — see the restructure)

| Overlap found | Resolution |
| :-- | :-- |
| **Two files named `PRODUCT-BACKLOG.md`** (`mesh/` = product queue; root = ops/exec operating-model) | `mesh/PRODUCT-BACKLOG.md` stays the **only** canonical Arbor product queue. The **root** `PAI/.../PRODUCT-BACKLOG.md` is **retired as a backlog**: its release/CI/OPS content is the source for [RELEASE-PIPELINE](RELEASE-PIPELINE.md) + the OPS items of `REL-ARBOR-001`; it gets a header pointing here and to the mesh queue. The duplicate-name trap is removed. |
| **CIL findings ≡ Council items** (proactive alerts, cited content, growth tracking, literacy) | CIL is a **feeder**; those become `AP-` items referencing their `CIL-` origin. CIL marks them `promoted`. |
| **Marketing items in CIL + Marketing + root** (dead-hero-CTA, HE OG, hreflang, brand-domain, referral loop) | one `AM-` row each in MARKETING-BACKLOG, citing origins. CIL `market` findings flow to `AM-`. |
| **Same defect in 3–4 docs** (image-gen cost cap; `/vision` consent; referral `/join?ref=`) | one canonical row each (`AP-`), all other mentions become references. |

## The "ready" bar (what a train can pull)

An item is **READY** for a train only when it has: an `AP-/AM-/ROS-` id · a one-line outcome · an owner pod · a `riskClass` (safe / gated-claim / gated-data / gated-money) · any claim it carries registered in the [claim register](CLAIM-REGISTER.md) · a score. Findings in feeders are *not* ready by definition — they must be promoted first.

> This is what `/ros-release` and the Product Council enforce. The result: every product has **one** list a train pulls from, every item has **one** id, and the feeders make that list better without competing with it.
