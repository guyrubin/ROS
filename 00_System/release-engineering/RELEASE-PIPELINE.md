# RELEASE-PIPELINE — incremental promotion + concurrency

**Owner:** `ros-release-lead` · **Version:** 1.0 · **Created:** 2026-06-22

The canonical, product-agnostic path from a backlog item to production. It replaces the blind `push-to-main → 100%-prod` path. Every product instantiates it; the runtime is **GitHub Actions + Cloud Run revision tags** (no new SaaS, no separate staging project — canary is a no-traffic tagged revision).

## The stages

| # | Stage | What happens | Exit condition | Owner |
| :-: | :-- | :-- | :-- | :-- |
| 0 | **READY** | Item is scored, owned, `riskClass`-tagged in its product backlog; any claim it carries has a row in the [claim register](CLAIM-REGISTER.md). | Item meets the backlog "ready" bar (BACKLOG-MODEL §ready). | product Council/lead |
| 1 | **TRAIN** | `ros-release-lead` bundles ready items into a release `REL-<product>-<n>`, sequences by the conflict map, claims the **merge-lane lock** in the [ledger](RELEASE-LEDGER.md). | Train opened + lock held. | `ros-release-lead` |
| 2 | **BRANCH** | Cut `rel/<product>/<n>` **off current `origin/main`** (never a stale local main). Build the items. Parallel feature branches are fine; they rebase onto the train branch. | Code builds locally. | product DevSecOps team |
| 3 | **GREEN-GATE** | Run the **full** [green-gate](GREEN-GATE.md) (tsc · tests · framework · safety · regression) in CI on the branch. | All green. | product QA/release |
| 4 | **MERGE** | **Branch-current check**: branch must be 0 behind `origin/main`. If behind → rebase, re-gate. Then merge. Only the lock-holder merges. | Merged to `main`, gate re-green on `main`. | `ros-release-lead` (lock) |
| 5 | **CANARY** | Deploy a Cloud Run revision with `--no-traffic --tag candidate` (+ hosting to a preview channel). 0% live traffic. | Candidate revision live, reachable by tag URL. | product release |
| 6 | **SMOKE** | Run the post-deploy smoke against the candidate tag: `/healthz` + version==SHA, 1.5 MB payload ≠ 413, one authed render path > 0. Non-zero ⇒ stop. | Smoke green. | product release |
| 7 | **PROMOTE** | **CoS prod-promotion sign-off (Level 3 — Guy).** On approval: `update-traffic --to-latest=100`. On smoke fail or sign-off withheld: **auto-rollback** (re-point traffic to last-good revision; `git revert` the merge if needed). | 100% on new revision, or rolled back. | CoS sign-off → product release |
| 8 | **FLAGS / CLAIMS** | Flip any feature/claim flags whose [register](CLAIM-REGISTER.md) row is green. A dark feature can ship in stage 7 and be flipped here days later — independently. | Flags set; register updated. | claim owner (Clinical+Safety) |
| 9 | **CLOSE** | Release marked shipped in the ledger; lock released; items marked `shipped` in their backlog with the `REL-` id; memory write-back. | Ledger + backlog + MEMORY updated. | `ros-release-lead` |

> **The iron rule (inherited from Arbor §10):** the only path to prod is **branch → CI gate → merge → CI deploy → canary → smoke → gated promote**. No human or agent ever runs `gcloud run deploy` / `firebase deploy` by hand. Manual in-session deploys are the bug this capability exists to remove.

## Concurrency — how `main` stops moving under you

The problem: multiple sessions/agents (2 were live the day this was built) push to `main` mid-deploy → rebase races + a deploy built on a `main` that changed.

The protocol — **build wide, merge narrow:**

1. **Building is unrestricted.** Any session works on its own branch in parallel. No lock needed to write code.
2. **The merge lane is a single-holder lock.** Stage 1 claims it in the ledger (`merge-lane: held by <session/agent> for REL-<id> since <ts>`). Only the holder may merge to `main` or promote. Everyone else queues.
3. **Branch-current gate (stage 4)** blocks any merge whose branch is behind `origin/main`. Behind ⇒ rebase + re-gate. This makes "main moved under me" impossible to merge through silently.
4. **Lock is released at stage 9** (or on abort/timeout). The ledger shows the queue so a waiting session knows its position.
5. **Deploys are serialized by GitHub Actions concurrency** (`concurrency: prod-release, cancel-in-progress: false`) — a second push waits, it does not cancel a live promote.

This decouples the two things that were tangled: **parallel building (fast, unlimited)** vs **serialized integration (safe, one at a time)**.

## Risk tiers → how far a train auto-runs

| Tier | Examples | Auto path | Stops for |
| :-- | :-- | :-- | :-- |
| **safe** | UI, copy, content, additive non-claim features behind a flag | stages 0–6 auto | CoS promote (7) |
| **gated-claim** | a feature making a dev/medical/effect-size claim | ships dark (0–7), flag OFF | claim flip (8): Clinical + Safety |
| **gated-data** | Firestore rules, schema/index migration, data-touching | 0–4 auto, then **backup before deploy**; never past canary without review | OPS-D review + CoS |
| **gated-money/store/domain** | billing flip, store submission, domain buy | never auto past gate | Guy (Level 4–5) |

> 2 consecutive auto-rollbacks on a product ⇒ **halt that product's train + page Guy** (SLO kill-switch, OPS-D5).

## What the pipeline needs in the product repo (the build payload)

These are **code** items — they are not hand-applied; they are the inaugural payload that flows *through* this pipeline as part of `REL-ARBOR-001` (see ledger). The Arbor versions already exist as `PRODUCT-BACKLOG §2` OPS-A/B/C/D:

- `/healthz` + `/readyz` returning `{status, version, env}` wired as the Cloud Run probe (OPS-A1)
- `scripts/post-deploy-smoke.mts` (OPS-A2) + canary traffic split (OPS-A3) + `scripts/rollback.sh` (OPS-A4)
- the deploy workflow gates on the **full** green-gate, not just lint+test (OPS-B3)
- atomic API+hosting deploy (OPS-B4); WIF instead of the long-lived key (OPS-C1); pinned Cloud Run capacity (OPS-C2)
- a feature-flag module + the claim register wired to it (see CLAIM-REGISTER.md)

The standard is product-agnostic; ROS-the-OS and Arbor-Marketing instantiate lighter versions (content/docs ship via their own CI; the *ledger, gate discipline, and promote sign-off* are identical).
