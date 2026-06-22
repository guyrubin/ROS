# Arbor — Autonomous Execution Goal & Wave Plan

**Date:** 2026-06-21 · **Owner:** PAI / Arbor (product) · CoS (portfolio) · **Runner:** Arbor Agent Mesh (`arbor-orchestrator`)
**Drives:** [PRD_2026-06-21_arbor-viral-capable-transforming.md](../PRDs/PRD_2026-06-21_arbor-viral-capable-transforming.md) · [arbor-enhanced-backlog-2026-06-21.md](../arbor-enhanced-backlog-2026-06-21.md)
**Prod:** https://arborprd-westeu.web.app · **Repo:** `PPPPtherapy-/PPPPtherapy-` (remote `guyrubin/PPPPtherapy-`)

---

## THE GOAL (north star)

> **Execute the entire enhanced backlog to best-in-market quality, with maximum autonomy, while coexisting safely with other sessions/agents working on production — delivered efficiently, wave by wave, every change green-gated.**

Done = every backlog item (V/C/T/S tracks) shipped to the Definition-of-Done bar below, the PRD's success metrics instrumented, and the ROS PRD + backlog kept current as the single source of truth.

## ⚠️ DEPLOY MODEL — CORRECTED 2026-06-21 (read first; supersedes the table below)

**There is a CI pipeline that auto-deploys on push to `main`:** `.github/workflows/arbor-deploy.yml` builds + deploys **API (Cloud Run) AND hosting+firestore on every push to `main`**, gated by its own quality checks. **So the deploy path is: branch → green-gate → merge/FF to `main` → CI deploys. Period.**

- **DO NOT hand-deploy** (`gcloud builds submit`, `firebase deploy`) or hand-rollback (`firebase` ROLLBACK). Manual deploys **race the CI pipeline** and get overwritten ~5 min later — this caused the 2026-06-21 incident ([[arbor-prod-regression-incident-2026-06-21]]). The "concurrent session clobbering hosting" was CI, not another agent.
- **To roll back:** `git revert` the bad commit on `main` → CI redeploys the reverted state. (Or trigger a prior good build from the Actions tab.) Not a manual `firebase` rollback.
- **Env/secrets** belong in `cloudbuild.prod.yaml` (CI reads it), not in ad-hoc `gcloud run services update` (CI overwrites those next deploy).
- Prod-prod-config changes are still gated by the CI quality checks; treat `main` as the production trigger.

## Autonomy model (how far the mesh goes on its own)

**Default (active now):** the mesh runs **fully autonomously through build → green-gate → push to an isolated integration branch → open/refresh a PR.** It does **not** deploy to prod unattended. **(Note: merging/FF to `main` IS deploying, via CI — so treat a merge to main as the deploy action, gated accordingly.)**

**Why prod deploy is the one gate:** memory records a real **hosting-ownership clobber risk** — a concurrent agent previously redeployed prod hosting over our build. Deploying over a live concurrent session is hard-to-reverse and outward-facing, so prod deploy is **coordinated/confirmed**, not unattended. (Standing authorization for green-gated push→prod exists for Arbor; it is intentionally held behind the coordination check while concurrent sessions are active. Flip to auto-deploy by confirming "deploy is clear.")

| Stage | Autonomy |
| :-- | :-- |
| Plan wave from backlog, frame items | Auto |
| Build in isolated worktree, run tsc/tests/safety-evals | Auto |
| Green-gate (DoD) + push integration branch + PR | Auto |
| Merge to `main` | Auto **iff** rebased clean on `origin/main` + green + no concurrent edits to the same hot files |
| **Deploy to prod (Cloud Run + Hosting)** | **Gated** — confirm "deploy clear" (no concurrent hosting deploy in flight) |
| Paid spend, store submission, vendor/legal | Human (Level 3–5) |

## Concurrent-session coordination protocol (binding)

1. **Isolated worktree.** Build only in `.arbor-build` (or a fresh worktree), never in a checkout another session may hold. Branch per wave: `claude/auto-wave-<n>` off the latest `origin/main`.
2. **Rebase-before-touch.** `git fetch origin` and rebase on `origin/main` at the start of every wave and before every push. Never branch from a stale base.
3. **Honor the shared-file lock map.** The exec-blueprint `CONFLICT-MAP.md` order is binding for `index.css`, `ArborContext.tsx`, `api.ts`, `OverviewTab.tsx`, `reportExport.ts`, `navigation.ts`, `i18n.ts`, `loopEvents.ts`. Within a wave, serialize any item that touches a hot file; pick **disjoint-file** items to parallelize.
4. **Detect concurrent edits.** Before push, re-fetch; if `origin/main` advanced into files this wave touched, rebase and re-green-gate. If a concurrent session is clearly mid-flight on the same surface, pick a different backlog item rather than collide.
5. **Append-only on hot files.** Add scoped blocks/exports; never reorder or rewrite another owner's region.
6. **No prod-hosting clobber.** Never `firebase deploy` hosting while a concurrent session may own the live channel. Deploy is the gated stage above.
7. **Atomic, reversible deploys.** When deploy is cleared: tag image with git SHA, keep the prior Cloud Run revision for instant rollback, deploy API + Hosting together.

## Definition of Done (green-gate — every item)

- `npx tsc --noEmit` clean · `npm test` (vitest) green · `npm run eval:safety` (and `check:framework`) green where applicable.
- New surface has real loading/empty/error states; no dead ends; deep-link safe.
- Honors PRD gates **G1/G2** + non-negotiables (DevSecOps/arbor-safety veto on any child-data/safety/claim change).
- Success metric instrumented (analytics event or measurable signal) per the backlog item.
- PR description states: item id, files touched, DoD evidence (test counts, tsc), and any concurrent-conflict handling.

## Efficiency rules (best quality, least waste)

- **One L-bet per quarter** (start C1). Parallelize only S/M, disjoint-file items within a wave.
- **Reuse before build** — most viral items are *enhancements* of shipped systems (share/export, JITAI, Today spine, referral). Don't rebuild; extend.
- **Smallest correct change** that meets DoD; no speculative refactors of hot files.
- **Cost-first ordering** — S2 (image-gen cap) before any generative/viral feature; it's both the live leak and the prerequisite.
- **Collapse duplicated instrumentation** — C3-MRT + T6 + Bet A are one measurement workstream, built once.
- **Verify live** only after deploy is cleared; until then, green-gate is the proof.

## Wave plan (sequenced from the enhanced backlog's 30/60/90)

> Each wave: rebase → build (parallel where disjoint) → green-gate → PR. Prod deploy gated.

### Wave 1 — Stop the leak + safe hardening (✅ SHIPPED TO GREEN PR · 2026-06-21)
**Status:** Built on branch `claude/auto-wave-1` (off `origin/main` 1e18f86), green-gated, pushed. **PR not auto-opened — `gh` not installed in this env; open at** https://github.com/guyrubin/PPPPtherapy-/pull/new/claude/auto-wave-1 . Prod NOT deployed (gated). Green-gate evidence: `tsc --noEmit` clean · `npm test` 461 pass/3 skip · `eval:safety` pass · `check:framework` pass. Coordination: `origin/main` unchanged during the wave; `.arbor-build` restored to its prior branch + WIP.
- **S2** ✅ `server/imageQuota.ts` (per-user daily cap `IMAGE_GEN_DAILY_LIMIT`=60 + global breaker `IMAGE_GEN_GLOBAL_DAILY_LIMIT`=5000) + 3 image endpoints added to hourly quota + 2 tests. *Per-CHILD cap deferred (childId not in image request bodies — keyed by uid). **Confirm the 60/day default.***
- **S3** ✅ `lib/sceneCache.ts` (persistent localStorage LRU + in-flight dedupe) wired into `HeroScenePlayer` + `heroComics.generatePage` + 3 tests. *Server-side Firebase Storage cross-device cache stays Guy-gated.*
- **RTL** ✅ language-aware comic SFX/dialogue in the hero-journey prompt. *Model-output correctness is deploy-verified (can't unit-assert model text).*

> **Autonomy finding (blocks hands-off waves):** the `arbor-orchestrator` subagent's sandbox **denies `git`/`npm`/`npx`** (even `git --version`), so it cannot green-gate/branch/commit — it correctly refused to ship un-gated. Wave 1 was executed from the **main session** (which has tooling). For future waves to run hands-off, subagents need git+npm+`gh` in their sandbox (settings/permission change), or the loop runs main-session-driven.

### Wave 1 (original framing) — items
| id | item | track | owner pod(s) | files (disjoint) | effort |
| :-- | :-- | :-- | :-- | :-- | :-- |
| **S2** | Image-gen cost cap + abuse guard (per-user/tier budget, circuit breaker, record image usage) | Trust | arbor-billing + arbor-sec + arbor-sre | `server/createApp.ts`, `server/aiQuota.ts`(+new cap), `routes/api.ts` (gen endpoints), `ai/usage.ts` | S |
| **S3** | Persistent scene-art cache (client) keyed child+scene+style | Trust | arbor-avatar + arbor-design | `lib/sceneCache.ts`, `components/stories/HeroScenePlayer.tsx`, `HeroComicsTab.tsx` | S–M |
| **RTL** | Language-aware comic SFX/dialogue (HE not EN) | Capable | arbor-ai | `routes/api.ts` (generate-hero-journey prompt) | S |

*Boundary: S2 (server middleware) ‖ S3 (client cache) ‖ RTL (prompt string) are disjoint — parallel-safe. Gate: tsc+tests green, no runaway-cost path remains, HE story renders HE SFX.*

### Wave 2 — Retention spine + the moat-native loop
- ✅ **V4 Daily Streak SHIPPED + DEPLOYED** (2026-06-21). `lib/streak.ts` (pure, AADC-hardened: no loss/guilt, one-day grace, shows only ≥2 days) + `StreakChip` on Today header, off behaviour logs + Daily Play completions. Green: tsc clean, **468 tests**, safety pass. main FF `b1c720d→645f106`; **client-only → hosting deployed** (release 04:54:31, `/` 200). Branch `claude/auto-wave-2`.
- ✅ **T4 "The Story of {child}" SHIPPED + DEPLOYED** (2026-06-21). `lib/childStory.ts` (pure, deterministic, **G2-safe** — restates only parent-approved facts + momentum, no model call, no outcome verbs) narrates the moat into warm prose at the top of the timeline (`StoryTimelineTab`), with a plain-text "Save story" export (parent-owned). Green: tsc clean, **476 tests**, safety pass. main FF `645f106→6363c7d`; client-only → hosting deployed (release 05:15:42). Branch `claude/auto-wave-2-t4`.
- ✅ **S4 Provenance Trust badge SHIPPED + DEPLOYED** (2026-06-21). Verified the image model auto-applies SynthID + C2PA; surfaced it as a reusable bilingual `ProvenanceBadge` ("AI-made") on the two main generated-art surfaces (`HeroScenePlayer` comic panels + `AvatarCreator` result) — the trust-as-product wedge (Bet C), claiming only what the pipeline applies. Green: tsc clean, **476 tests**, safety pass. main FF `6363c7d→f92ce24`; hosting deployed (release 05:37:26). Branch `claude/auto-wave-2-s4`.
- ⏭️ **Remaining Wave 2:** V0 Second-Guardian Invite (M — the K-driver; the one genuine M left: needs co-viewer share grants + shared-streak entitlement, backend + frontend).

### Wave 3 — Safe viral + flagship monetization
V1 Milestone Share Card (S) · V2 WhatsApp layer (S) · V5 two-sided referral (S) · **C1 Parent Real-Time Coach (L — the quarter's single L-bet)** · T3 Fresh-Start (S–M) · S7 red-team/safety-eval/abuse-reporting (M).

### Wave 4 — Capability depth + trust moat public
C6 zero-effort tracking (M, +MDR read) · C7 emotion-coaching (M) · T1 tiny-habits (M) · T2 self-efficacy (M) · S1 Family Trust Center (M) · S6 age-assurance/VPC (M) · C3 JITAI 2.0 → seeds the measurement workstream (M–L).

### Beyond 90 days — gated, category-defining bets
One ASR vendor decision unblocks C2+C5+C8 · T6 Phase 2 + Bet A (external causal claim, pre-registered) · T5 + V6 → Bet D (Israel Lighthouse, one institutional reference). Whole-app iOS-grade polish (Wave-3 surf-* + p3) folds in as a continuous quality pass.

## Human-gated decisions (unblockers — track in ROS)

Domain (`arbor.co.il`) · Apple/Google accounts + secrets + screenshots · Firebase Storage (server-side S3 cross-device cache) · child-ASR vendor (unblocks C2+C5+C8) · `@arbor.family` socials · paid-spend threshold · "deploy clear" confirmations while concurrent sessions are active.

## ROS source-of-truth upkeep (every wave)

After each wave: update this doc's wave status + the enhanced backlog item state, and append a memory pointer. The PRD changes only on intent change, not per wave.

---

**Status:** Goal set 2026-06-21.

**Wave 1 — merged + deploying (2026-06-21, on "GO"):**
- ✅ `main` fast-forwarded `1e18f86 → b1c720d` (Wave 1, clean FF, no merge commit). Deploy-safety check passed first: origin/main unchanged, +3/−0 FF, no concurrent push in 35h.
- ✅ **API (Cloud Run) DEPLOYED** — revision `arbor-api-00074-wqf` @ image `b1c720d` serving 100% (build SUCCESS, 3m44s). **S2 cost-cap + RTL now live in prod.** Verified: `/api/health` 401 (auth up, booted with prod invariants), `/` 200. Rollback = prior revision `arbor-api-00072-bdb`.
- ✅ **Hosting (S3 client) DEPLOYED** — on Guy's `/goal DEPLOY ALL`, took ownership of the live channel: built `main`'s client (Firebase public web config + `VITE_API_BASE=` same-origin) and `firebase deploy --only hosting`. Release `2026-06-21 04:39:02`; `/` 200, `/privacy.html` 200; SW cache stamped so users self-update. **`main` is now the source of truth for the frontend** (replaced the prior non-main 02:18 build).
- Firebase web config (public): api_key `AIzaSyAa0MZ87e_ofMHlBFdfCxPBSAelC0ghqvs`, auth_domain `arborprd-westeu.firebaseapp.com`, project_id `arborprd-westeu`, app_id `1:628681500167:web:f78b93f5f692e174d2aca2`, storage_bucket `arborprd-westeu.firebasestorage.app`. Hosting build = `cd app && VITE_FIREBASE_*=… VITE_API_BASE= npm run build:hosting:prod` → `firebase deploy --only hosting`.

> **WAVE 1 FULLY LIVE IN PROD (API + hosting).** S2 cost-cap + RTL + S3 scene cache all deployed and verified. Rollback: API → revision `arbor-api-00072-bdb`; hosting → Firebase hosting release history.
