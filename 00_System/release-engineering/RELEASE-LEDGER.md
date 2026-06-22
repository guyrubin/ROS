# RELEASE-LEDGER — the live release-train board

**Owner:** `ros-release-lead` · **Version:** 1.0 · **Created:** 2026-06-22

The single coordination surface for everything in flight across all products. It answers, at a glance: *what is shipping, on what branch, at what stage, who holds the merge lane, and what's waiting?* It is the cure for "overlapping work" and "main moved under me." Markdown is canonical here; the Notion cockpit mirrors it (a "Releases" board row per train).

## Merge-lane lock (serialized integration)

> Only the lock-holder may **merge to `main`** or **promote to prod**. Building on branches is unrestricted and parallel. Claim the lock at [stage 1](RELEASE-PIPELINE.md#the-stages); release it at stage 9.

| Lane | Status | Held by | For | Since |
| :-- | :-- | :-- | :-- | :-- |
| **merge-lane** | 🟡 HELD (integration; no merge pending — review branch only) | `ros-release-lead` | REL-ARBOR-001 | 2026-06-22 |

> Lane held to serialize the *promotion decision* — no merge-to-`main` is queued. Released the moment Guy gives or withholds the Level-3 promote (stage 9). Building on other branches stays unrestricted.

**Queue (FIFO, waiting for the lane):** _empty_

## Active trains

| Release | Product | Stage | Items | Branch | riskClass | Next gate | Owner |
| :-- | :-- | :-- | :-: | :-- | :-- | :-- | :-- |
| **REL-ARBOR-001** | Arbor Product | **slice 1 OPS staged** (`fe618db`) · **slice 2 council GREEN-GATED + pushed** (`36406da`) | OPS net (B3/A3/A2) + 5 council items (CI-06 already on main) | OPS: `rel/arbor/001` (local, 1 ahead) · council: `review/rel-arbor-001-council` @ `bf2febc` (pushed, off `origin/main 8789423`) | safe (CI-05/CI-08 carry gated copy) | **CoS promote (Level 3)** — see Decision Pack 2026-06-22 below | `ros-release-lead` |

### REL-ARBOR-001 — Decision Pack appended 2026-06-22 (ros-release-lead)

- **Two disjoint slices, off the same `origin/main` (`8789423`), 0 behind, no file overlap** → clean stack (OPS net = 2 workflow/build files; council = 10 app-src files).
- **Council slice (`review/rel-arbor-001-council` @ `36406da`):** full green-gate PASSED on real base — tsc 0 · vitest **661 pass / 3 skip / 0 fail** · check:framework · eval:safety · build all clean. Pushed to review branch only; **no prod deploy triggered** (`arbor-deploy.yml` fires only on `main`).
- **CI-06 dropped from the train** — its schema + render + populated `kind:"guideline"` sources are **already on current `origin/main`** (superseded; mark shipped, no-op).
- **CI-13 reduced then fully closed** — main already wired `screenModelOutput` into `/voice` + coach + council (superseding CI-13's api.ts half). Re-applied the still-novel **hedge-pattern safety floor** (catches "this looks like ADHD"); the remaining gap (`/analyze-behavior` unscreened on main, api.ts L1418) was closed by `arbor-safety` (commit `bf2febc`, full gate green, 663 tests). All four model-authored surfaces now screened.
- **OPS-B3 now closed on `rel/arbor/001`** (deploy gate runs check:framework + eval:safety); promote job is Guy-gated via GitHub production Environment.
- **Gated copy rides dark:** CI-05 (crisis helpline literals) + CI-08 (canonical honesty string) carry copy needing Clinical+Safety sign-off → behind the claim-gate, not blocking the wave.

## REL-ARBOR-001 — the inaugural train (the proof)

**Goal:** ship the release-engineering net itself *through* the pipeline, plus rebase the 6 green council items that were correctly NOT hand-deployed. This is how the capability proves itself.

**Bundle (sequenced — OPS net first, it is the net everything else lands in):**

1. **OPS-B3** — wire the full green-gate into the deploy path (the keystone; until this, nothing else is truly gated).
2. **OPS-A1** `/healthz`+`/readyz` probe · **OPS-A2** post-deploy smoke · **OPS-A3** canary traffic split · **OPS-A4** rollback script.
3. **OPS-B4** atomic API+hosting deploy · **OPS-C2** pinned Cloud Run capacity.
4. **`flags.ts` + claim register wiring** (CLAIM-REGISTER) — enables dark-ship for the claim-bearing council items.
5. **OPS-C1** kill the long-lived SA key → WIF *(Founder+Agent; Level 3)*.
6. **OPS-D1** Firestore rules emulator test · **OPS-D3** data backup runbook *(gated-data; backup before any rules deploy)*.
7. **The 6 green council items** (`CI-13/06/12/07/08/05`, currently on `claude/council-wave-1`, 6 ahead of a now-stale `main`) — rebase onto `rel/arbor/001`, re-gate, ride the canary. Any carrying a claim ride **dark** (flag OFF) per the register.

**Pre-flight (blocking, in order):**
- [ ] `arbor-devsecops-lead` confirms `claude/council-wave-1` re-bases cleanly onto current `origin/main` (it was built off a stale main).
- [ ] OPS-B3 lands first and the deploy path runs the full gate.
- [ ] OPS-C1 (WIF) — **Guy-gated** (GCP IAM). Until done, deploy uses the existing key but it is on the kill-list this train.
- [ ] `regress:arbor` suite green (GREEN-GATE).

**Status — 2026-06-22: slice #1 STAGED ✅ (branch `rel/arbor/001`, commit `fe618db`, 1 ahead of `origin/main`; not pushed/merged/deployed).** The deploy path was rewritten from blind-100% into a real cycle: **OPS-B3** (deploy gate reaches CI parity — adds `check:framework`+`eval:safety`) + **OPS-A3** (`cloudbuild.prod.yaml` deploys a 0%-traffic `--no-traffic --tag candidate` revision) + **OPS-A2** (a `Smoke candidate` step runs the *existing* `app/scripts/post-deploy-smoke.mjs` against the candidate tag's `/healthz`) + a **GUY-GATED `promote` job** (GitHub `production` Environment → set Required Reviewers) that shifts traffic to 100% AND deploys hosting together (kills the API/hosting split-brain). Both YAML files validated (`npx js-yaml`). `concurrency cancel-in-progress:false` so a live promote isn't killed. The full green-gate runs in CI on push (not on my machine — correct home). *Staged by the main session: the dispatched `arbor-devsecops-lead` was blocked (subagents are denied git/npm — the documented hands-off-build gap).*
> **To ship it:** push `rel/arbor/001` → PR → CI green-gate → merge → on merge the candidate deploys + smokes → **Guy approves the `promote` job** → 100%. Plus the 2 other gates below.
> Verified corrections (4-lens audit, [Arbor-Reality-Check_2026-06-22.md](../../CoS/reviews/Arbor-Reality-Check_2026-06-22.md)): the deploy path *does* run lint+test (not zero gate); `healthz.ts` + `post-deploy-smoke.mjs` already **exist in the repo, wired to nothing**; local `main` is **94 commits behind `origin/main`** (build off `origin/main`, never local main); REL-ARBOR-001 was 0% landed before this slice.

**The 3 gated decisions surfaced to Guy (Level 3–4) — these convert all stuck work into visible prod results:**
1. **Point `arborparentingapp.com` → Firebase Hosting** (DNS) — kills the GoDaddy placeholder; makes the funnel + shares real.
2. **Approve `REL-ARBOR-001`** (the canary+smoke+full-gate pipeline) **+ OPS-C1 WIF/IAM** — shipping becomes real + safe.
3. **One prod-promote sign-off** (canary → 100%) — ships the stuck `claude/cil-week` batch (dead-CTA, OG cards, schema, hreflang) + paywall price + mobile-hero fix at once.
- Plus: any claim flip for a council item that carries one (Clinical + Safety).

## How to read / update this ledger

- **Open a train:** add a row to *Active trains* at stage 0, assign `REL-<product>-<NNN>`, claim the merge-lane when you reach stage 1.
- **Advance a stage:** bump the Stage cell; append a dated line to the train's section.
- **Close:** move the train to *Shipped log* below, release the lane, mark items `shipped` in their product backlog with this `REL-` id, write back to the product `MEMORY.md`.
- **One train per product in active integration at a time** (others queue) — that's the serialization that ends the race.

## Shipped log

| Release | Product | Shipped | Items | Notes |
| :-- | :-- | :-- | :-- | :-- |
| _none yet_ | | | | REL-ARBOR-001 will be the first |
