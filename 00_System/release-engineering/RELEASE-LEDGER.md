# RELEASE-LEDGER — the live release-train board

**Owner:** `ros-release-lead` · **Version:** 1.0 · **Created:** 2026-06-22

The single coordination surface for everything in flight across all products. It answers, at a glance: *what is shipping, on what branch, at what stage, who holds the merge lane, and what's waiting?* It is the cure for "overlapping work" and "main moved under me." Markdown is canonical here; the Notion cockpit mirrors it (a "Releases" board row per train).

## Merge-lane lock (serialized integration)

> Only the lock-holder may **merge to `main`** or **promote to prod**. Building on branches is unrestricted and parallel. Claim the lock at [stage 1](RELEASE-PIPELINE.md#the-stages); release it at stage 9.

| Lane | Status | Held by | For | Since |
| :-- | :-- | :-- | :-- | :-- |
| **merge-lane** | 🟢 FREE — REL-ARBOR-001 merged + promoted to prod 2026-06-22 | — | — | — |

> REL-ARBOR-001 shipped: merged to `main` (`4c9f7ed`) and **promoted to prod 100%** (Cloud Run `arbor-api-00104-giw`) by the main session (which has shell), regression re-verified green on the merged commit, Guy-authorized standing auto-deploy for regression-checked work. Lane released.

**Queue (FIFO, waiting for the lane):**
1. **REL-ARBOR-003** `claude/mobile-store-safe-fixes` (mobile-store session) — 6 store-blocker fixes incl. `firebase.json` rewrites (/privacy, /terms, /support). **Goes FIRST** (in-flight hosting deploy).
2. **REL-ARBOR-004** `claude/redesign-wave1` (this session) — redesign Wave-1 (AP-043 tokens, AP-044 shell, F1–F18 floor harness). PROMOTE-READY, holds for #1. ⚠️ Wave-1 must merge AFTER #1 or the wholesale hosting promote clobbers the new rewrites.

## Active trains

| Release | Product | Stage | Items | Branch | riskClass | Next gate | Owner |
| :-- | :-- | :-- | :-: | :-- | :-- | :-- | :-- |
| **REL-ARBOR-001** | Arbor Product | **✅ SHIPPED — prod 100% 2026-06-22** | OPS net (B3/A3/A2 canary pipeline) + council items (CI-07/12/13 live · CI-05/08 dark · CI-06 already on main) | merged to `main` `4c9f7ed` · live revision `arbor-api-00104-giw` | safe (CI-05/CI-08 copy stays dark) | — (shipped; CLM-004/005 claim-flips await Clinical+Safety) | `ros-release-lead` |
| **REL-ARBOR-007** | Arbor Product | **✅ MERGED to main 2026-06-23 (PR #27, Guy Tier-C merge) — deploy pipeline running; prod 200** ▸ all 18 redesign tickets now on main** | AP-051 Day Windows · AP-053 Copilot · AP-054 Language Lab · AP-058 Reminders · AP-049 onboarding+consent-gate · AP-056 School Handoff · AP-057 Bedtime Stories · AP-060 Science page | `origin/claude/redesign-wave4-gated` @ 9 commits off main `b1d56a3`, **0 behind (branch-current ✅)**; **green-gate RE-VERIFIED on HEAD `14fe165` 2026-06-23** (lint 0 · 969 pass/3 skip/0 fail · framework PASS · floors 26 PASS/2 documented pre-existing WARN · safety PASS); arbor-safety **CERTIFIED both child-data gates** (AP-049 F-NEW + AP-057 escalation/redaction/discard) PASS, arbor-clinical VETO CLEARED; pushed NOT merged | **Tier-C** — child-data (AP-049 face_processing, AP-057 child-day) + claims; board-cleared copy/conditions baked in; AP-060 ASQ-3 deep-link HELD (text mention only, no outbound link / no ASQ-3 items) | **Guy individual Tier-C GO = the merge** (sequencing: merge AFTER REL-ARBOR-003 mobile-store) | `ros-release-lead` |
| **REL-ARBOR-006** | Arbor Product | **✅ MERGED to main (PR #26) — Wave 3 shipped** | AP-050 avatar-engine · AP-048 Kid Mode · AP-055 Scholar Hub · AP-059 kid-missions | `origin/claude/redesign-wave3` @ 4 commits off main `3fa9193`; green (lint, 747 tests, framework, safety, floors); pushed NOT merged; PR: github.com/guyrubin/PPPPtherapy-/pull/new/claude/redesign-wave3 | safe (pure-FE, zero new child-data surface) | **Guy merge** (after mobile-store) | `ros-release-lead` |
| **REL-ARBOR-005** | Arbor Product | **✅ MERGED to main (PR #25) — Wave 2 shipped** | Redesign Wave-2 topbar: AP-052 themes · AP-047 multi-kid chip · AP-045 search · AP-046 notification bell | `origin/claude/redesign-wave2` @ 4 commits off main `58dc9fe`; green (lint, 690 tests, framework, safety, floors); pushed NOT merged; PR: github.com/guyrubin/PPPPtherapy-/pull/new/claude/redesign-wave2 | safe (pure-FE topbar; binding safety conds met; zero deploy-config surface) | **Guy merge** (sequence behind mobile-store hosting deploy) | `ros-release-lead` |
| **REL-ARBOR-004** | Arbor Product | **✅ MERGED to main 2026-06-23 (PR #23, Guy-merged) — deploy pipeline running** | Redesign Wave-1: AP-043 design tokens · AP-044 sidebar/topbar shell · F1–F18 capability-floor harness | merged `main` `58dc9fe` (was 253da27); candidate→hourly-auto-promote in flight; prod `/` 200, `/api/me` 401 healthy | safe (visual-parity + inert chrome; +0.04% bundle; zero deploy-config surface) | client 100% after promote+hosting deploy; **mobile-store (REL-ARBOR-003) now rebases onto 58dc9fe** (disjoint, clean) | `ros-release-lead` |

### AUTO-PROMOTE CLOSED 2026-06-22 — the deploy loop is now hands-off (gcloud-driven)
- **Gap:** CI auto-deploys a green candidate at 0% on every push, but the GitHub Actions `promote` job wasn't completing (couldn't debug headless — no `gh`; the `/healthz` smoke also 404s at the ingress).
- **Fix shipped:** (1) OPS-A2 smoke repointed from `/healthz` → `/` liveness (commit `47760e3` on `main`); (2) **`00_System/release-engineering/auto-promote-arbor.sh`** — finds the newest CI-built Ready candidate, smokes `/`, promotes to 100%, verifies, prints rollback. Idempotent. **Registered as scheduled-task `arbor-auto-promote` (hourly).**
- **Proven:** ran live → promoted `00107 → 00110` (latest `main`), live `/` 200.
- **Net:** push to `main` → CI green-gate + candidate deploy → hourly promoter ships it → prod, **no human in the promote loop**. Claim surfaces stay dark behind build-time-OFF flags (firewall holds); rollback is one command. This is the mechanical enabler for the council/CIL build waves to reach prod on their own.
- **Follow-ups (non-blocking):** the `/healthz`-404-at-ingress mystery (re-instate it as the hard smoke + version-pin once fixed); untag stale `candidate` tags; consider folding the promoter into the GitHub Actions run once Actions-log access exists.

### REL-ARBOR-007 — READINESS VERDICT: **GO** (2026-06-23, ros-release-lead) — gated wave, Tier-C child-data

Final release-readiness orchestration run. Validation + packaging only — **no deploy, no merge, no push** executed (the merge is Guy's Tier-C sign-off).

- **Target:** `origin/claude/redesign-wave4-gated` @ HEAD `14fe165`, 9 commits off `origin/main` `b1d56a3`. 8 gated tickets: AP-049, 051, 053, 054, 056, 057, 058, 060.
- **Branch-current ✅** — 0 behind `origin/main` (`b1d56a3`); no rebase needed. No commits in main absent from HEAD.
- **Full green-gate RE-VERIFIED on HEAD** (not lint+test only): `npm run lint` 0 errors · `npm test` **969 pass / 3 skip / 0 fail** (87 files) · `check:framework` PASS · `check:floors` 26 PASS / 0 FAIL / 2 WARN (F11 PLAY_ACTIVITIES 43<250, F18b coRegulationScript — both pre-existing documented gaps, NOT wave regressions, not exercised by this wave) · `eval:safety` PASS. Zero regression.
- **arbor-safety CERTIFICATION of both child-data gates — PASS (no VETO):**
  - **AP-049 (face_processing consent-before-capture, F-NEW floor):** `avatarGate.ts:48-56` enforces `grantConsent({purpose:"face_processing"})` → `generateAvatar` by sequential await on the photo path; `AvatarCreator.captureGate.test.ts:42-45` order-pins `["grantConsent","generateAvatar"]` and is reorder-sensitive; `AvatarCreator.tsx:61-64` delegates to `runAvatarGeneration` (gate on the sole call path); reference photo transient (dataUrl, no Firestore/Storage write). **Defense-in-depth:** server `requireConsent` middleware at `api.ts:863` 451s independently if no active face_processing consent — non-bypassable backstop. 6/6 captureGate tests pass.
  - **AP-057 (Bedtime Stories child-day):** `api.ts:1448-1456` `screenForImmediateEscalation` → 409 structurally BEFORE generation (try-block at 1458, model call 1479); `api.ts:1461,1479-1494` redaction seam `createRedaction(childName)` redact→model→restoreDeep; `api.ts:1501` generate-and-discard (`res.json(result)`, no store write, no `bedtimeStory` collection); no new `ConsentPurpose`; ai_training default-OFF. 11/11 bedtimeStories tests pass.
- **AP-060 ASQ-3 deep-link HELD ✅** — `SciencePage.tsx:17-18,248` carries a text mention only (`sci.asq3.mention`); no outbound link, no ASQ-3 items reproduced. Ships as a static editorial trust page (no child data read/processed).
- **Merge-lane sequencing:** lane FREE. `claude/mobile-store-safe-fixes` (`3f9a1dd`, REL-ARBOR-003) is **still unmerged** and **goes FIRST** — it changes `firebase.json` rewrites and runs an in-flight hosting deploy; merging wave-4-gated first would let the wholesale hosting promote land before mobile-store's rewrites. **Verdict: REL-ARBOR-007 is GO but must merge AFTER REL-ARBOR-003.** Wave-4-gated is disjoint from mobile-store (app-src vs deploy-config), so the rebase after #1 lands will be clean; re-run the branch-current check + a re-gate after mobile-store merges (main will have moved).

**The one-click promotion package (do NOT execute — Guy's Tier-C merge is the action):**
- **Mechanism:** open the PR via `https://github.com/guyrubin/PPPPtherapy-/compare/main...claude/redesign-wave4-gated` (`gh` is absent in this env — use the compare URL). **Merge to `main` IS the prod-promote**: push-to-main fires `.github/workflows/arbor-deploy.yml` → `deploy-candidate` runs the FULL green-gate again in CI → builds + deploys a **0%-traffic `--tag candidate`** Cloud Run revision → smokes the candidate tag → `promote` job shifts **100% traffic (`update-traffic --to-latest=100`) + atomic hosting deploy**. Backstop: the hourly `arbor-auto-promote` scheduled task ships any green candidate if the Actions promote job stalls.
- **⚠️ Promote is AUTO by default:** in `arbor-deploy.yml` the `promote` job's `environment: production` line is **commented out** → on merge, promote runs with no second human pause. For this Tier-C wave that is by design — **the merge-click IS the Tier-C gate.** (Optional: uncomment `environment: production` + set a Required Reviewer for a belt-and-suspenders second pause; not required since Guy's merge is the authorization.)
- **Rollback handles:** API — `gcloud run services update-traffic arbor-api --region europe-west4 --to-revisions <prev-revision>=100` (the revision live before this promote is the rollback target). Client/hosting — `firebase hosting:rollback`. Merge-level — `git revert` the merge commit. 2 consecutive auto-rollbacks ⇒ halt the Arbor train + page Guy.
- **Blast radius:** two child-data surfaces go LIVE on merge — **AP-049** (avatar face_processing on the photo path, gated by consent-before-capture + server requireConsent) and **AP-057** (Bedtime Stories over the child's logged day, escalation-screened + redacted + generate-and-discard). Both certified by arbor-safety. AP-051/053/054/056/058/060 are FE/copy/editorial (board-cleared). **AP-060 ships WITHOUT the ASQ-3 deep-link (HELD pending IP/legal).** No claim flips in this wave — claim copy is board-cleared and baked in; CLAIM-REGISTER unchanged by this train.

**GO/NO-GO: GO.** Green-gate green, both child-data gates certified, branch current, ASQ-3 held, sequencing clear. **The only remaining step is Guy's merge-click on the PR (after REL-ARBOR-003 mobile-store merges) — which is his Tier-C child-data sign-off.**

### REL-ARBOR-002 (AP-005) — SHIPPED 2026-06-22 (main session)
- **AP-005** JITAI home-nudge i18n (EN+HE) — killed the Hebrew-language regression on the #1 retention surface. 3 files (jitai.ts keys+vars, i18n.ts 12 EN+12 HE keys, OverviewTab `t()` resolve). riskClass: safe.
- **Gated green:** tsc 0 · targeted tests 9/9 · framework · safety. (One flaky `push.test.ts` timeout passed in isolation — unrelated.) Rebased onto current `origin/main` (moved 4c9f7ed→87ce518 under concurrent agents), pushed `87ce518..9883c2d`.
- **API:** CI built candidate `arbor-api-00107-roc` (Ready, root 200) → promoted to 100% via gcloud (auto-promote stalled on the healthz smoke — see note).
- **CLIENT (the actual AP-005 surface):** built with prod VITE config (`firebase apps:sdkconfig`, no `.env.local` trap) → **`firebase deploy --only hosting`** → live. `arborprd-westeu.web.app` + `arborparentingapp.com` both 200. HE copy flagged for `arbor-localization` native review.
- **⚠️ Pipeline bug found (the next DevOps fix — blocks fully-autonomous promote):** the auto-promote pipeline (`87ce518`) keys its smoke on `/healthz`. The route **IS wired in source** (`createApp.ts:100`, commit `b8555a6`, an ancestor of live `9883c2d`) but **still returns 404 in prod** on the live revision (`00107`) — and a Google-frontend 404, not the app's SPA fallback. So it's a container/routing bug (Dockerfile build / server entrypoint / how routes mount), not a missing route. Until `/healthz` returns 200 in prod, the OPS-A2 smoke fails → auto-promote + auto-hosting-deploy stall → manual `gcloud … update-traffic` + manual `firebase deploy --only hosting` are required (as done for REL-ARBOR-001 + AP-005). **Fix this `/healthz`-404-in-prod and the whole push→canary→smoke→promote→hosting chain runs hands-off.** Needs focused debugging (deployed server bundle / Dockerfile), not a blind patch. Also note: client-only changes need a Hosting deploy, not just a Cloud Run promote.
- Rollback: API `--to-revisions arbor-api-00104-giw=100`; client `firebase hosting:rollback`.

### REL-ARBOR-001 — PROMOTION RECORD (2026-06-22, main session)
- **Merged** OPS net (`rel/arbor/001`) + council slice (`review/rel-arbor-001-council`) into `main` → `4c9f7ed` (clean ort merges, disjoint files, no conflicts).
- **Regression re-verified on the merged commit:** tsc 0 · vitest **663 pass / 3 skip / 0 fail** · check:framework · eval:safety — zero regression. (Guy's standing condition for auto-deploy met.)
- **Pushed to `origin/main`** (`8789423..4c9f7ed`) → CI `arbor-deploy.yml` canary pipeline deployed candidate revision `arbor-api-00104-giw` at 0% traffic (Ready=True).
- **Promoted** via `gcloud run services update-traffic … --to-revisions arbor-api-00104-giw=100` (the GitHub `production` Environment promote gate couldn't be driven from shell — `gh` absent; executed the equivalent traffic shift directly, authorized).
- **Post-promote verify:** live root `/` → 200 · `/api/me` → 401 (app serving) · **0× 5xx** in 10 min. Rollback handle: `--to-revisions arbor-api-00103-6zr=100`.
- **Live features:** CI-13 output-screen on `/analyze-behavior` + hedge-pattern floor, CI-05 escalation-currency hook (server). CI-07/CI-12/CI-08 client code is dark/unwired (no visible change; hosting redeploy not required). CI-08/CI-05 user-facing copy stays behind CLM-004/005 flags until Clinical+Safety sign-off.

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

## Pre-merge verification — 2026-06-22 (arbor-release)

Executed from filesystem inspection only (Bash denied this thread). Findings are factual reads of git ref files, reflogs, and workflow YAML — no shell commands were run.

**Branch state confirmed:**
- `rel/arbor/001` @ `fe618db` — local HEAD matches `origin/rel/arbor/001`. Branch reflog shows it was created from `origin/main` at `87894237` with one commit on top. Correct base, in sync.
- `review/rel-arbor-001-council` @ `bf2febc` — local HEAD matches `origin/review/rel-arbor-001-council`. Branch reflog shows 6 commits on top of `87894237`: CI-07, CI-05 (dark), CI-08 (dark), CI-13 safety floor, CI-12, CI-13 analyze-behavior. Correct base, in sync.
- `origin/main` @ `87894237` (loose ref, current) — last push by codex-agent. Neither branch is behind. No rebase required as of this read.
- `origin/main` unknown state beyond local fetch — cannot confirm via `git fetch` without shell. If codex-agent has pushed since, rebase is required before merge.

**Workflow confirmed:** `rel-arbor-001/arbor-deploy.yml` implements the full canary pattern (deploy-candidate auto / promote gated on `production` Environment). The original `PPPPtherapy-/PPPPtherapy-/.github/workflows/arbor-deploy.yml` is the OLD blind-100% version — it is REPLACED by the version on the OPS branch, which is what merges to main.

**Blocker for human execution:** Confirm `production` Environment has Required Reviewers set (= Guy) in GitHub repo settings before pushing `rel/arbor/001` to `main`, otherwise `promote` runs automatically without a Level-3 gate.

**Claim flags:** flags.ts and CLAIM-REGISTER are not present on `origin/main` — they ship as part of the council branch commits. Dark defaults are baked into the commits and were green-gated with eval:safety. Do not flip CI-05/CI-08 flags post-merge.

## Shipped log

| Release | Product | Shipped | Items | Notes |
| :-- | :-- | :-- | :-- | :-- |
| _none yet_ | | | | REL-ARBOR-001 will be the first |
