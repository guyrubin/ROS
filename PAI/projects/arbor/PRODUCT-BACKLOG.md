# Arbor — Unified Product Backlog & Autonomous Execution Operating Model

**Owner:** Head of Product + Eng (this doc)
**Date:** 2026-06-21
**Status:** **Autonomous-Execution Operating Model + the OPS/release source — NOT the product feature queue.** Supersedes and unifies `arbor-updated-backlog-2026-06-21.md`, `arbor-enhanced-backlog-2026-06-21.md`, `PRDs/PRD_2026-06-21_arbor-viral-capable-transforming.md`, and `execution/arbor-autonomous-execution-goal-2026-06-21.md` (reference inputs now).

> **⚠️ Disambiguation (2026-06-22) — two files were both named `PRODUCT-BACKLOG.md`.** The **canonical Arbor product feature queue** is **[`mesh/PRODUCT-BACKLOG.md`](mesh/PRODUCT-BACKLOG.md)** (Council-owned, `AP-` ids) — that is the one a release train pulls from. **This** file is the *operating model* + the home of the **§2 OPS-net**; that release/CI/deploy content is now codified product-agnostically in **[`/00_System/release-engineering/`](../../../00_System/release-engineering/README.md)**, and the §2 OPS items are queued as **`REL-ARBOR-001`** in the [release ledger](../../../00_System/release-engineering/RELEASE-LEDGER.md) to ship *through* that pipeline. See [BACKLOG-MODEL.md](../../../00_System/release-engineering/BACKLOG-MODEL.md).

**Ground-truth note (read before executing).** This doc was reconciled against `main` directly. Several per-item line citations in the source drafts came from post-`main` feature branches and are **wrong against `main`** — they are corrected inline below and called out in §11. The core thesis holds and is verified: the entire rich-image + consent + image-quota stack is **post-`main`** — confirmed absent on `main`: comic CSS, the `generate-scene/comic/avatar` routes, `AvatarCreator`, `imageQuota`, `requireConsent`, `healthz`, `purchases-capacitor`. Do not trust an item's line numbers blindly; re-confirm against `main` at kickoff.

---

## 0. The one-paragraph truth (where we are)

Arbor's code is healthier than the "bad UI / no billing" framing suggests — there is a real design system, a wired viral loop, a near-complete billing scaffold, and decent safety primitives. The damage is concentrated and structural, in priority order: (1) **the founder-loved rich-image client never reached `main`** — verified: `main` has zero comic CSS and no image-generation routes — so CI deploys the "shapes + emoji" client, which is the founder's #1 pain; (2) **every deploy goes blind, 100%, straight to prod, with no health probe, no smoke gate, and no rollback** — that is exactly the gap that let the 413 incident through, and the deploy workflow today gates on `lint + test` only (no `tsc`, no `check:framework`, no `eval:safety`, and it still uses a long-lived `GCP_SA_KEY`); (3) **billing collects no money** because the products/secrets the (complete) code needs don't exist yet, and beta resolves everyone to Plus. The incident lesson is sharper than "we shipped a bug": changes were **hand-deployed via `gcloud`/`firebase` racing CI** and **the authed app can't be rendered headlessly**, so nothing proved the deploy before users hit it. The plan therefore inverts: agents **stand up the deploy safety net AND the data-migration safety net to green FIRST**, then push the rich design through that hardened pipeline as its first payload, then billing, then completeness/quality/trust/growth — all under one rule: the only path to prod is push-to-`main` → CI → canary → smoke → promote-or-rollback, and rules/data/billing-flip changes never auto-promote.

---

## 1. Track map

| Track | Purpose | Lead pod (arbor-mesh) |
|---|---|---|
| **P0-SAFETY (INFRA/CI/OPS)** | Make autonomous deploys provable and undoable — incl. **data/rules** migration + backup, not just code. **Green first.** | DevSecOps + Platform |
| **P0-RESTORE** | Get codex's rich-image design into `main` so CI deploys it. Founder's #1 pain. First payload through the hardened pipeline. | Design + Stories + DevSecOps |
| **P0-SAFETY (CHILD)** | Close the one live child-data exposure (`/api/vision` consent) — there is **no consent layer on `main` at all`. | Safety |
| **BILLING** | Turn the complete billing scaffold into real euros. | Monetization + DevSecOps |
| **DESIGN/UX** | Depth-of-polish on an already-real design system. | Design |
| **COMPLETENESS** | Close the retention loop + finish the illustrated-hero promise. | Product + Stories + Practice |
| **TRUST/SAFETY** | COPPA-2026 + red-team + transparency + retention/backup. | Safety/DevSecOps |
| **GROWTH** | Aggregate analytics + two-sided loops + IL launch readiness. | Growth |

**Legend.** Effort: **S** ≤0.5–1d · **M** 1–3d · **L** 3d–2wk. Build-type: **[AGENT]** fully agent-buildable & auto-deployable through the pipeline · **[AGENT+VERIFY]** agent builds, prod-affecting design/behavior → human eyeballs the canary before promote · **[FOUNDER]** account setup, paid spend, vendor, or a pricing/design/legal decision only Guy can make.

---

## 2. TRACK P0-SAFETY (INFRA/CI/OPS) — the foundation, GREEN FIRST

> **This leads the plan — it is no longer "parallel with RESTORE."** D1 (the restore) is the single riskiest change in the whole plan (a tree-replacement merge + a brand-new Firestore surface). Shipping the riskiest change *while* building the net meant to catch it is the incident pattern. The net below — including data/rules migration + backup — must be **green before D1 merges**. D1 is then the net's first real payload.

### Code-deploy net
| ID | Title | Build (what) | Effort | Dep | Type | Done signal |
|---|---|---|---|---|---|---|
| **OPS-A1** | Unauthenticated `/healthz` + `/readyz` | Tiny unauthed route mounted before the `/api` auth chain returning `{status, version:GITHUB_SHA, env, knowledgeCards, modelProvider, firestore:reachable}`. Wire as Cloud Run startup+liveness probe. | S | — | **[AGENT]** | `/healthz` returns 200 + version on the live service; Cloud Run probe configured. |
| **OPS-A2** | Post-deploy smoke gate that fails the pipeline | `scripts/post-deploy-smoke.mts` vs the just-deployed URL: hits `/healthz`; POSTs a ~1.5MB avatar payload to the **new** `/api/generate-scene` (added by D1) asserting **not 413**; exercises one text endpoint; asserts 2xx + non-empty. Final required step of the deploy workflow; non-zero → rollback. | M | A1, D1 (route exists) | **[AGENT]** | The 413-class check runs every deploy and blocks promote on failure. |
| **OPS-A3** | Canary traffic split (no blind 100% cutover) | Deploy new revision `--no-traffic --tag candidate`; smoke (A2/B2) the tagged URL; only `update-traffic --to-latest=100` after green. | M | A2 | **[AGENT]** | New revisions get zero live traffic until smoke passes; promote is automatic-on-green. |
| **OPS-A4** | One-command + automated **code** rollback | `scripts/rollback.sh` (promote previous healthy Cloud Run revision + `firebase hosting:rollback`); auto-invoke on A2 failure; `docs/ops/rollback-runbook.md`. **Scope: code only** — see OPS-D3 for data/rules. | S | A2 | **[AGENT]** | A failed smoke auto-reverts code within seconds; runbook is one command. |
| **OPS-A5** | Prod alerting → a real notification channel | Log-based metric on 4xx/5xx + a 413/429/503 alert; circuit-breaker-tripped alert (first emit a distinct WARNING in `imageQuota.ts` — it trips silently today); uptime check on `/healthz`; budget alert. Route to email/Slack. | M | A1 | **[AGENT+VERIFY]** | A prod 413 spike or tripped breaker pages within minutes; budget alert live. Founder confirms the channel. |
| **OPS-B1** | Body-size/payload integration test in CI | Vitest driving the real Express app from `createApp()`, POSTing oversized + at-limit payloads to each large-body route, asserting documented limits (vision is already 12mb on `main`, `createApp.ts:97`; the **new** gen routes D1 adds need the same). | S | — | **[AGENT]** | The comment-only limit is an enforced regression gate, applied to the new gen routes. |
| **OPS-B2** | Headless **authed** visual/render smoke — **prove it works (P0 spike)** | Playwright: load deployed client, sign in via a CI test account (Firebase Auth custom-token path), open an Academy/Playbank card, assert an `<img>` has natural dimensions > 0; capture screenshot artifact. **The incident's lesson was literally "the authed app can't be rendered headlessly" — until this is demonstrated green ONCE, the model does NOT prevent the founder's actual pain. Treat the headless-authed-render path as an explicit spike, not an assumed capability.** | M | A1, test-account | **[AGENT+VERIFY]** | A signed-in headless render asserts a real `<img>`; screenshot artifact per deploy. |
| **OPS-B3** | Wire the REAL green-gate (move to P0) | The deploy workflow currently gates on **`lint + test` only**. Add `tsc --noEmit` + `check:framework` + `eval:safety` to the merge gate. Every "green-gate every change" claim in §10 is false until this lands — so this is P0, not an S-effort afterthought. | S | — | **[AGENT]** | Deploy gate == full CI gate; a tsc/framework/safety regression blocks merge. |
| **OPS-B4** | Atomic API+hosting deploy (no split-brain) | If hosting fails after the API deployed (or vice-versa), fail the pipeline + trigger A4 so the two halves never diverge in prod. | S | A4 | **[AGENT]** | No split-brain prod. |
| **OPS-B5** | Real staging environment + gate | Stand up `arborstg-*` project; revive the dead `cloudbuild.yaml`; staging deploy + smoke (A2/B2) must go green before `main`→prod. Seed a stable test family. **Until this exists, prod is still the first integration surface for D1 — a loud P0 risk, not a footnote.** | L | A2, B2 | **[FOUNDER]** (GCP project + billing) then **[AGENT]** | A staging URL exists; prod is no longer the first integration surface. |
| **OPS-C1** | Kill the long-lived SA key (security P0) | Workflow uses long-lived `GCP_SA_KEY` in GitHub secrets → any compromised action can deploy prod. Finish `docs/ops/wif-migration.md`; set `GCP_WIF_PROVIDER`/`GCP_DEPLOY_SA`; delete `GCP_SA_KEY` + the IAM key; tighten the deployer SA off Datastore Owner to least privilege. | S | — | **[FOUNDER+AGENT]** | No long-lived deploy credential exists; SA least-privileged. |
| **OPS-C2** | Pin Cloud Run capacity + concurrency | Add `--min-instances`, `--max-instances`, `--concurrency`, `--memory/--cpu`, `--timeout` to `cloudbuild.prod.yaml` (all defaults today). `--max-instances` is a second cost backstop. | S | — | **[AGENT]** | Capacity bounded. |
| **OPS-C3** | Keyless smoke harness | Refactor the 4 manual smoke scripts (`live/vision/voice/council-smoke.mts`) into one runner with `--mocked` (CI, no keys) and `--live` (post-deploy) modes. | S | A2 | **[AGENT]** | Smoke is a reusable building block any wave calls. |

### Data / rules / supply-chain net — **NEW, and the highest-uncovered risk**
| ID | Title | Build (what) | Effort | Dep | Type | Done signal |
|---|---|---|---|---|---|---|
| **OPS-D1** | Firestore rules + index migration review + emulator test | D1 drops a new client + 3 server routes + new image-quota/avatar collections onto live prod Firestore, and rules deploy via `firebase deploy --only firestore`. A blind rules deploy can **lock out every existing user**. Add: a `firestore.rules` diff review, a rules+index migration test in the **Firestore emulator** in CI, and an existing-user compat/backfill plan (old-shape avatars/entitlements). **Must be green BEFORE the D1 merge.** | M | — | **[AGENT+VERIFY]** | Emulator test passes against current + migrated shapes; existing-user read paths verified; rules diff reviewed by founder. |
| **OPS-D2** | Secret inventory + boot-time presence assertions | Enumerate every secret the merged `main` requires (image-gen / AI-Studio Gemini key, `REVENUECAT_WEBHOOK_AUTH`, `BILLING_*`, WIF provider) and assert presence at boot in `env.ts`. D4/D5 (auto-gen) mass-fail in prod if the image key isn't wired; the plan must not hand-wave "after prod keys confirmed." | S | — | **[AGENT]** | `env.ts` refuses to boot if any required merged-surface secret is missing; inventory documented. |
| **OPS-D3** | Firestore backup/export + **data** rollback runbook | `git revert` undoes code, **not** a rules change, a purged collection, or a migrated document shape. Add scheduled Firestore backup/export; **any rules/data-affecting deploy is gated behind a fresh backup**; write `docs/ops/data-rollback-runbook.md` distinct from the code-revert runbook. (Pairs with T2's purge: purge runs dry-run/log-only for 1 week first.) | M | — | **[AGENT+VERIFY]** | A backup exists pre-deploy for any rules/data change; data-rollback runbook restores a known-good export. |
| **OPS-D4** | Lockfile-integrity / `npm ci` reproducibility gate | `npm ci` runs unpinned; a prior incident had `firebase` undeclared so a clean install pruned it and broke auth. Add a lockfile-integrity check + a regression test that asserts declared deps (incl. `firebase`) survive `npm ci`. | S | — | **[AGENT]** | CI fails on lockfile drift; the firebase/declared-deps regression is covered. |
| **OPS-D5** | SLO + auto-pause kill-switch for the loop | Define an error-budget / failure-rate that **auto-pauses autonomous deploys**. If two consecutive autonomous deploys roll back, the mesh **halts and pages Guy** instead of retrying. No kill-switch for the loop itself exists today. | S | A5 | **[AGENT+VERIFY]** | A second consecutive rollback halts the loop and pages the founder. |

**The safe loop this produces:** `agent builds → full green-gate (tsc + tests + framework + safety) → PR → merge → backup-if-data-change → deploy CANARY (no traffic) → smoke candidate (healthz + 1.5MB≠413 + authed render-img>0) → promote on green, else AUTO-ROLLBACK (code; data via OPS-D3) → alerting watches prod → 2 consecutive rollbacks ⇒ halt + page.`

---

## 3. TRACK P0-RESTORE — get the rich-image design into `main`

> The gate. Until D1+D2 land on `main` and deploy green **through the §2 net**, the live app stays "icon AI." D1 is the riskiest single step; it merges only after OPS-A1–A4, OPS-B2 (proven), OPS-B3, OPS-D1, OPS-D3 are green.

| ID | Title | Build (what) | Effort | Dep | Type | Done signal |
|---|---|---|---|---|---|---|
| **D1** | Merge the rich-image client line into `main` | Bring the post-`main` stack down as the new client (reconcile, not cherry-pick): gen API client + the 3 server routes `generate-scene/comic/avatar`, `AvatarCreator.tsx`, `HeroComicsTab`, avatar-composited `HeroScenePlayer`, in-memory scene cache, image cost cap, **and the 12mb body-limit applied to the NEW gen routes** (vision is already 12mb on `main`). | L | OPS-A1–A4, OPS-B2, OPS-B3, OPS-D1, OPS-D3 | **[AGENT+VERIFY]** | `main` has all 3 gen routes + `AvatarCreator`; full green-gate passes; canary smoke renders a real `<img>` (not shapes) + a render-diff gate passes; founder confirms on the canary "this is the design I love." |
| **D2** | Restore the comic-book CSS dropped in the merge | Port `.arbor-play{--comic-ink/--comic-line/--comic-pop}`, `.comic-panel`, `.comic-halftone`, `.world-tile` (+states), `.comic-sfx` into current `app/src/index.css`. These classes are referenced by `HeroJourneyTab`/`HeroComicsTab` but undefined on `main` → cards render flat. Ships in the same PR as D1. | S | D1 | **[AGENT]** | Comic tokens defined; Academy/Comics cards render ink borders + halftone + tilt-on-hover. |
| **D3** | Make avatar creation a first-run, near-mandatory step | Prompt avatar creation in onboarding + a persistent "Create {name}'s hero" banner until done. The rich look is gated on a saved stylized avatar. | M | D1 | **[AGENT+VERIFY]** | New user is prompted before reaching Academy; no-avatar users see a banner, not shapes; first-run completion event fires. |
| **D4** | Auto-generate the first scene/comic image | In `HeroScenePlayer`, eagerly generate the opening beat's art on story-open when an avatar exists; one hero "cover" per card on first view, respecting `imageQuota.ts` caps. **Load note: eager gen on every first view can blow the image budget on a launch spike — cap + rate-limit it; see OPS-A5 breaker + OPS-C2 ceiling.** | M | D1, D3, OPS-D2 (image key) | **[AGENT+VERIFY]** | First-run user with an avatar sees generated hero art as the **default**; cap respected; no mass-fallback. |
| **D5** | Replace AdventuresTab emoji tiles with hero/scene imagery | Give each scenario card a generated or themed scene thumbnail (reuse comic/scene gen + cache, keyed by scenario). | M | D4 | **[AGENT]** | Adventures cards show scene imagery, cached per scenario. |
| **D6** | Branded on-theme illustration fallback (kill geometric shapes) | Replace `StoryIllustration.tsx` (random circle/rect/triangle from a hash) with a small committed set of on-brand scene illustrations per pack/story, for when gen is unavailable/off. | S | — | **[AGENT]** | A quota/network failure falls back to a curated branded illustration, never abstract shapes. |
| **D7** | Visual smoke: fail when comic classes are referenced but undefined | Lint/test cross-checking comic `className` tokens against defined CSS (would have caught D2) + a screenshot diff of the Academy/Comics catalog. | S | OPS-A1 | **[AGENT]** | CI fails if a referenced comic token is undefined; screenshot artifact per deploy. |

**Restore notes:** D1 gate; D2 ships with it (cheapest high-leverage win). The cache/cap fixes already exist on the branch — they must **travel with D1** or cards 413/leak cost. D4/D5 require the image key wired (OPS-D2) or auto-gen mass-fails to fallback.

---

## 4. TRACK P0-SAFETY (CHILD) — close the live exposure

| ID | Title | Build (what) | Effort | Dep | Type | Done signal |
|---|---|---|---|---|---|---|
| **R2** | Add a consent layer and gate `/api/vision` on `face_processing` | **Corrected:** `requireConsent` does **not exist on `main`** — there is **no consent-enforcement infrastructure on `main` at all** (it lives only on feature branches). So this is not "mirror the existing gate (one line)"; it is "port the consent-enforcement layer + gate vision." `/api/vision` (`routes/api.ts` ~`:601` on `main`) accepts real child-photo uploads with only payload-size + MIME + escalation-text checks — **no consent**. This is a **live COPPA-2026 / child-biometric exposure on prod today**, so it is **P0**, alongside RESTORE. | M | — | **[AGENT]** | A consent layer exists on `main`; `/vision` 403s without `face_processing` consent; covered by a test. |

---

## 5. TRACK BILLING & MONETIZATION — to the first real euro

> Code is ~90% done. Blockers are mostly **founder dashboard/secrets work** + **one real eng gap (native IAP)**. Critical path to euro #1: **B1→B2→B3→B4→B5→B6** (mostly Guy's dashboard time). **B3 is the keystone:** the code goes live the moment the secrets + offering exist.
>
> **STATUS 2026-06-21 — engine 100% built + configured, sitting in SANDBOX.** Done via API + dashboard automation: B1 (prices locked) ✅ · B2 (4 products €12.99/119/19.99/179 + 7-day trial, `plus`/`family` entitlements, offering `default`=`ofrng2b9a615534` with the 4 correctly-named packages, **Web Purchase Link "Arbor web checkout" created**) ✅ · webhook PROVEN end-to-end (signed test → `entitlements/{uid}` written; auth enforced) covering most of B3/B4 · durability PR `claude/billing-durability` bakes the secrets into cloudbuild. **THE ONE REMAINING GATE = founder KYC:** Stripe/RC Web Billing is in **sandbox mode** (app shows a *Sandbox API Key*; Share dialog offers only a `pay.rev.cat/sandbox/…` link marked "Not for customers"). RC emits the production checkout link only after Stripe is **activated live** (business details + bank + tax). That's legally Guy's. Once live: copy the production Share URL → `--update-secrets BILLING_WEB_PURCHASE_LINK=…` → B5 staged enforce → B6 real card = euro #1.

### Gate A — Decide & price
| ID | Title | Build | Effort | Dep | Type | Done |
|---|---|---|---|---|---|---|
| **B1** | Lock the price points | ✅ **DECIDED 2026-06-21** (grounded in arbor-business-model-pricing): **Plus €12.99/mo · €119/yr** (save 24%, 1 child); **Family €19.99/mo · €179/yr** (save 25%, up to 4 kids + co-parent); **7-day free trial** on both; **annual is the default/highlighted toggle**; **beta lock €89/yr** for existing+first-500 families (= the B5 grandfather list). Free "Seedling" tier stays. RC package ids: `plus_monthly`/`plus_annual`/`family_monthly`/`family_annual`. | S | — | **[FOUNDER→DONE]** | ✅ 4 price points + trial locked. |

### Gate B — Web revenue (fastest path)
| ID | Title | Build | Effort | Dep | Type | Done |
|---|---|---|---|---|---|---|
| **B2** | Create Stripe + RevenueCat web products & offering | Connect Stripe in RC; create Products+Prices; one Offering with 4 packages named **exactly** `plus_monthly/plus_annual/family_monthly/family_annual`; define `plus`/`family` entitlements (webhook matches on substring); copy Web Purchase Link + webhook secret + portal URL. | M | B1 | **[FOUNDER]** | Offering live with the 4 correctly-named packages; link + secret in hand. |
| **B3** | Wire billing secrets into the running API | Add via Secret Manager to the real prod deploy: `REVENUECAT_WEBHOOK_AUTH`, `BILLING_WEB_PURCHASE_LINK`, `BILLING_MANAGE_URL`. **Keystone** — flips webhook 503→live and checkout "coming soon"→real charge. (Presence asserted by OPS-D2.) | S | B2 | **[FOUNDER+AGENT]** | Secrets present in prod; webhook returns 200 to a signed test; checkout returns a real URL. |
| **B4** | Point the RC webhook at prod & verify | Set webhook URL to `…/webhooks/billing/revenuecat` with the B3 auth; fire a RC test event; confirm `entitlements/{uid}` is written. | S | B3 | **[FOUNDER]** | A RC test event writes a real entitlement record. |
| **B5** | Turn enforcement ON in prod — **staged, with grandfathering** | Verify prod has `ARBOR_ENV=prod` / set `ENFORCE_ENTITLEMENTS=true` so the paywall stops resolving everyone to Plus. **Flipping enforcement is the moment every existing beta user can hit a paywall** → add a grandfather list + staged rollout + comms; keep founder/testers on `ARBOR_FAMILY_EMAILS`; add a smoke assertion that comped users stay Plus *after* the flip (the comp-list is a single point of lockout). Confirm which workflow truly deploys the API. | M | B4 | **[AGENT+VERIFY]** | A non-comped prod user hits the paywall; existing beta users are grandfathered; comped users verified Plus post-flip. |
| **B6** | E2E web purchase smoke (real card) | Buy Plus on web in prod: 402→paywall→checkout→webhook→entitlement→unlimited coach. **Euro #1.** | S | B5 | **[FOUNDER+AGENT]** | A real card grants Plus end-to-end. |

### Gate C — Native revenue (real eng; after web earns)
| ID | Title | Build | Effort | Dep | Type | Done |
|---|---|---|---|---|---|---|
| **B7** | Add a RevenueCat purchase SDK to the app | Install `@revenuecat/purchases-capacitor` (missing from `package.json`); init with Firebase uid as RC App User ID; replace the `window.location.href` web-redirect in `useCheckout.ts` with `Purchases.purchasePackage()` on native (keep web redirect on web via platform check). Web-redirect-for-digital-goods risks App Store rejection. | L | B2 | **[AGENT]** | Native presents the offering via StoreKit/Play Billing, not a web redirect. |
| **B8** | Create store IAP products + connect stores to RC | Sign Apple Paid Apps Agreement (Active); create matching subscription products in App Store Connect + Play Console; add Apple Shared Secret + IAP Key + Play Service Credentials to RC (Play creds up to 36h to propagate). | M | B1 | **[FOUNDER]** | IAP products exist; stores connected to RC. |
| **B9** | Native purchase smoke (sandbox→prod) | Sandbox-buy on a real iPhone + Android; confirm RC webhook writes the same `entitlements/{uid}`; verify cross-platform (buy on iPhone → Plus on web). | S | B7, B8 | **[FOUNDER+AGENT]** | A native sandbox purchase grants Plus and is recognized on web. |

### Gate D — Revenue hygiene (non-blocking)
| ID | Title | Build | Effort | Dep | Type | Done |
|---|---|---|---|---|---|---|
| **B10** | Account screen: plan state + manage/cancel | Surface `status`/`willRenew`/`currentPeriodEnd`; wire `openPortal()` (web) + "manage in App Store/Play" (native). Mostly built — verify live data. | S | B6 | **[AGENT]** | Account screen shows real plan + a working manage link. |
| **B11** | Annual price + savings copy in paywall | Toggle exists but shows no prices; pull display prices from the RC offering. | S | B2 | **[AGENT]** | Paywall shows real prices + annual savings. |
| **B12** | Billing observability | Alert on webhook 401/503 spikes + failed checkouts (extends OPS-A5). | S | OPS-A5, B3 | **[AGENT]** | A silently-misconfigured billing secret pages someone. |

---

## 6. TRACK DESIGN / UX QUALITY (depth-of-polish on a real design system)

> Code-grounded, not pixel-verified — confirm via `arbor-deep-eval` live render before marking done.

| ID | Title | Build | Effort | Dep | Type | Done |
|---|---|---|---|---|---|---|
| **Q1** | Finish the token migration (kill the inlined CTA gradient) | `--gradient-cta` exists but ~31 sites inline `linear-gradient(135deg,#3cc081,…)` + ~101 raw hex literals remain. Sweep to tokens. | S | — | **[AGENT]** | 0 inlined CTA gradients; hex literals replaced. |
| **Q2** | Onboarding "first win" depth | Add a 2nd micro-step previewing personalized Home + triggering the first plan inline. `trackFirstPlan` is the activation event. | M | — | **[AGENT+VERIFY]** | Time-to-first-plan drops; first-plan fires inside onboarding. |
| **Q3** | Motion + reduced-motion consistency | Motion in ~44 components, `prefers-reduced-motion` guards only ~9. Shared motion tokens + a global reduced-motion gate. | M | — | **[AGENT]** | All motion respects reduced-motion; durations/easings tokenized. |
| **Q4** | A11y hardening (focus-visible + contrast + targets) | Visible focus rings everywhere; contrast pass on `--arbor-*-ink` on `-soft`; 44px targets. | M | — | **[AGENT]** | WCAG AA contrast passes; visible focus on every interactive surface. |
| **Q5** | RTL/Hebrew full-surface QA | Systematic Hebrew pass on every tab: mirrored layout, icon direction, number/link LTR-islands. Israel-first = Hebrew is primary. | M | — | **[AGENT+VERIFY]** | Every tab renders correctly in Hebrew RTL. |

---

## 7. TRACK PRODUCT COMPLETENESS (close the retention loop + finish the hero promise)

| ID | Title | Build | Effort | Dep | Type | Done |
|---|---|---|---|---|---|---|
| **PC2** | Off-app delivery channel (push/local notif) | Add `@capacitor/local-notifications` (+ FCM for push); the product cannot reach a parent who closed the app — digest/JITAI/re-engagement/invites are all in-app-only. The biggest structural cap on retention. | M | — | **[AGENT+VERIFY]** (FCM setup may need founder) | A scheduled local notification fires on device. |
| **PC3** | Digest scheduling + send | `server/digest.ts` generates JSON that is **never sent**. Schedule weekly + deliver via PC2. | S/M | PC2 | **[AGENT]** | A weekly digest is delivered, not just generated. |
| **PC4** | T3 — Fresh-start re-engagement | Birthday/milestone-triggered "new chapter" reactivation reading the memory moat. Missing today. | S/M | PC2 | **[AGENT]** | A milestone triggers a re-engagement nudge. |
| **PC5** | V0 — Second-guardian backend | Promote `SecondGuardianCard` from a deep-link shim into a real co-viewer-with-contribute role + shared streak + grant-on-accept + accept-rate metric. | M | — | **[AGENT]** | Invited guardian gets a contribute role + shared streak; accept-rate instrumented. |
| **PC6** | H4 — Hero composited into Practice world-cards | Wire comic/scene-gen into `PracticeHubTab`/`AdventuresTab` so world-cards show the child's hero, cached. Finishes "your child as hero *everywhere*." | M | D1, D4 | **[AGENT+VERIFY]** | Practice world-cards show the composited hero, cached. |
| **PC7** | C1 — Surface coach citations to the parent | Render `sourceCardsUsed` + evidence grade + "not medical advice" in `CoachTab`. Grounding exists server-side but is invisible — the flagship "cited guidance" differentiator isn't shown. | S/M | — | **[AGENT]** | Coach answers show sources + evidence grade in the UI. |
| **PC8** | V5 — Two-sided referral (give-get) | `referral.ts` has only `referrerEarned`; add redeemer-side reward + entitlement grant. | S | B2 | **[AGENT]** | Both referrer and redeemer earn on accept. |
| **PC10** | Empty/loading/error states for 5 bare tabs | `ConsultTab`, `DevelopmentTab`, `HandoffTab`, `LanguageLabTab`, `ScholarTab` render with no empty/loading/error handling; wire the `OverviewTab` ErrorState TODO. | S each | — | **[AGENT]** | Each tab has empty/loading/error states. |

> **PC9 removed.** The source draft's "resolve dead `/api/generate-scene`" assumed an orphan route on `main`; **it does not exist on `main`** — it arrives *only* via D1. Wiring it as the cheap scene fallback for PC6 is now part of D1/PC6 scope, not a standalone item.

---

## 8. TRACK TRUST / SAFETY (COPPA-2026 + red-team + transparency + retention)

| ID | Title | Build | Effort | Dep | Type | Done |
|---|---|---|---|---|---|---|
| **T1** | COPPA-2026 third-party-disclosure consent | Compliance deadline (Apr 22 2026) has **passed**. Add a distinct disclosure-consent purpose surfaced before any vendor (Google/Vertex) call for child PI/biometrics; document the vendor-as-processor stance. (Builds on the consent layer R2 introduces.) | M | R2 | **[AGENT+VERIFY]** (legal stance = founder) | A separate disclosure consent gates any third-party child-data send. |
| **T2** | Data-retention policy + automated TTL purge — **dry-run first** | Memory expires logically on read but nothing **deletes**. Add Firestore TTL + a purge job for child data/events/avatars/shares + `RETENTION.md`. **Gated behind OPS-D3 backup; runs dry-run/log-only for 1 week before live delete.** | M | OPS-D3 | **[AGENT+VERIFY]** | Scheduled hard-delete runs (after dry-run week); retention schedule published. |
| **T3** | Abuse / safety-incident reporting channel | One-tap "report unsafe output" on coach answers + generated images → moderation queue. (Outbound crisis escalation exists; inbound reporting does not.) | S | — | **[AGENT]** | A report button routes to a queue. |
| **T4** | Red-team eval harness in CI | Adversarial/jailbreak suite (prompt-injection via child name/theme fields — `generate-comic` interpolates user strings into the image prompt) gating every deploy, with a **defined baseline** so it blocks on regression, not noise. Input screening is regex-based and bypassable. | M | OPS pipeline | **[AGENT]** | A red-team suite runs on deploy and blocks on regression against the baseline. |
| **T5** | Consent-receipt + audit-log view for the parent | Trust/Privacy panel listing every active consent + share with one-tap revoke (revoke endpoints exist). Cheapest trust win; supports trust-as-GTM. | S | R2 | **[AGENT]** | Parent sees + can revoke every consent/share. |

---

## 9. TRACK GROWTH (measure the loop, close the two-sided loops, IL launch)

| ID | Title | Build | Effort | Dep | Type | Done |
|---|---|---|---|---|---|---|
| **G1** | Aggregate analytics backend (cross-user funnel) | `track()` writes `users/{uid}/events`; `AttributionTab` reads **only the operator's own** events. No cross-user funnel — can't answer "IL install→first_plan→paid by channel." Add a server-side sink (BigQuery export or admin `collectionGroup` aggregate) feeding an operator dashboard. Blocks every GTM decision. | M | — | **[AGENT+VERIFY]** (BigQuery = paid, founder) | An operator dashboard shows cross-cohort funnel by channel. |
| **G2** | Referral-aware landing/deep-link | `?ref=CODE` is captured but the referred user lands generic — no inviter, no offer, no earned-month; activation only fires at first-plan. Add a referral landing + carry the code through signup. | M | — | **[AGENT]** | A referred user sees inviter + offer on arrival; code survives signup. |
| **G3** | Second-guardian two-sided incentive (grant-on-accept) | The moat-native loop: accept → both sides get a reward + a shared child-story surface. (Pairs with PC5 — overlap acknowledged.) | M | PC5 | **[AGENT]** | Accept grants both sides a reward + shared surface. |
| **G4** | Activation instrumentation + share-channel attribution | Channel often unset; web-share dismissals silent; no event distinguishes which artifact (avatar/story/comic) drives installs. Tighten channel tagging + add `invite_activated{role:"referrer"}` server-side. Also define the **cost-per-active-user** metric (image gen is the cost driver; only a global breaker exists). | S | G1 | **[AGENT]** | Every share is channel-tagged; k-factor by artifact + cost-per-active-user are measurable. |
| **G5** | Israel-first GTM readiness | Verify `/il` routing + Hebrew share copy + **IL crisis hotlines** (escalation lists only NL/BE — no IL numbers) + App Store IL metadata. | M | Q5 | **[AGENT+VERIFY]** | IL path has localized hotlines + share copy + store metadata. |

---

## 10. THE OPERATING MODEL — safe ongoing autonomous execution

Designed from the incident lessons. The incident happened because changes were **hand-deployed (`gcloud`/`firebase`) racing CI** and **deployed blind** (the authed app can't render headlessly). The model makes those failure modes structurally impossible — and extends the safety net to **data/rules**, which code-revert alone cannot undo.

### 10.1 The one rule
**The ONLY path to prod is `push-to-main → CI`.** No human or agent ever runs `gcloud run deploy` / `firebase deploy` by hand against prod. Manual deploys are the incident; they are banned. Enforce by removing direct-deploy creds from everything but the CI service account once OPS-C1 lands. Document in `docs/ops/rollback-runbook.md`.

### 10.2 The deploy pipeline (every change, no exceptions)
```
agent builds on a branch
  → green-gate: tsc --noEmit + vitest + check:framework + eval:safety   (OPS-B3 — NOT wired today; P0)
  → PR → merge to main
  → IF the change touches Firestore rules/indexes/data shape:
        require a fresh Firestore backup/export                         (OPS-D3)
        + rules/index emulator migration test green                     (OPS-D1)
  → CI deploys CANARY revision (--no-traffic --tag candidate)           (OPS-A3)
  → smoke the candidate URL:
        /healthz + 1.5MB payload≠413 + AUTHED render-img>0              (OPS-A2 / B2)
  → green  → promote --to-latest=100
     not green → AUTO-ROLLBACK:
        code  → git revert + previous Cloud Run revision + hosting:rollback  (OPS-A4)
        data  → restore from the pre-deploy export per data-rollback runbook (OPS-D3)
  → alerting watches prod (4xx/5xx, 413/429/503, breaker, budget)       (OPS-A5)
  → 2 consecutive rollbacks ⇒ HALT the loop + page Guy                  (OPS-D5)
```
- **Green-gate every change** — tsc + tests + framework + safety eval. Non-negotiable, **and not currently wired** (OPS-B3 is P0).
- **Staging gate** (once OPS-B5 lands): main→prod is preceded by a staging deploy + smoke. Until then, **prod is the first integration surface for D1 — a known P0 risk.**
- **Code rollback ≠ system rollback.** `git revert` undoes code only. A rules change, a TTL purge (T2), an enforcement flip (B5), or a migrated document shape (D1) is **not** undone by revert — those require the data-rollback runbook + a pre-deploy backup. This is the single most dangerous honesty gap; the pipeline above closes it.

### 10.3 Higher-tier changes that NEVER auto-promote (human-gated past canary)
Rules/data/billing-flip changes are a distinct tier. Even on a green canary, the agent **stops** and hands Guy the promote decision:
- **D1** (tree-replacement + new Firestore surface), **OPS-D1** rules deploys, **T2** purge go-live, **B5** enforcement flip.
- Rationale: for these, a green-looking gate can coexist with corrupted/locked data — the gates in §10.2 can report healthy while real users are broken. A human eyeballs prod before traffic moves.

### 10.4 Who owns what
- **The arbor-mesh orchestrator is the single backlog owner.** It plans a wave from THIS doc, frames items, fans out to the owning pods, green-gates each through DevSecOps, and rolls status to PAI/CoS. No other agent self-assigns prod work.
- **The CIL (`arbor-improve` / `arbor-cil-eval` / `arbor-deep-eval`) is the ongoing eval engine.** The critic panel runs the live app, scores + adversarially verifies findings into `IMPROVEMENT-BACKLOG.md`, and feeds new items back into THIS backlog. Cheap regression panel twice-daily; deep lenses twice-weekly. **The CIL proposes; the orchestrator disposes.** No CIL finding ships without going through 10.2.
- **arbor-mesh is on-demand, never self-triggering** — a human or a scheduled job kicks a wave; agents never autonomously decide to deploy prod-affecting design changes.

### 10.5 Human-gated items (agents must STOP and flag)
The agent prepares everything and hands Guy a one-click/one-decision step:
- **Billing accounts & secrets** — B1 (price), B2 (Stripe/RC), B3/B4 (secrets+webhook), B8 (Apple/Play agreements). Money rails are founder-only.
- **Any paid spend** — staging GCP project (OPS-B5), BigQuery (G1), budget ceilings.
- **Prod-affecting design changes** — anything tagged **[AGENT+VERIFY]**: ship to canary, founder eyeballs the canary URL, then promote. The design the founder "loves" is a founder call.
- **Rules/data/billing-flip changes** — the §10.3 higher tier.
- **Legal/compliance stance** — T1/T2 (COPPA disclosure language, retention sign-off).
- **Vendor decisions** — child-ASR vendor (SoapBox placeholder), any new external processor.

### 10.6 Cost & safety backstops (keep on)
- Per-user hourly AI quota + per-user daily image cap + global circuit breaker (`imageQuota.ts`) — **and** OPS-A5 alerts when the breaker trips (silent today).
- Cloud Run `--max-instances` ceiling (OPS-C2) as a second cost backstop; D4 eager-gen is capped + rate-limited against a launch spike.
- `env.ts` prod invariants that refuse to boot on misconfiguration — keep; OPS-D2 adds the billing/image/WIF secret presence checks.
- Image-gen runs only after the prod image key is confirmed (OPS-D2), or auto-gen mass-fails to fallback.

### 10.7 Definition of Done (the gate every item passes)
DONE only when: code merged to `main` · full green-gate passed · (for data/rules changes) pre-deploy backup taken + emulator migration test green · canary smoke (incl. authed render-img check) passed · promoted to 100% (human-promoted for §10.3 tier) · its "Done signal" is observably true in prod · and the human gate was honored for **[AGENT+VERIFY]**/**[FOUNDER]** items.

---

## 11. Prioritization — 30 / 60 / 90

Ordering principle: **stand up BOTH safety nets (deploy + data) green → push the rich design through as the first payload → make money → deepen.**

### Days 0–30 — SAFETY NETS GREEN → RESTORE → first euro setup
**Agents (sequenced):**
- **P0-SAFETY first slice (must go green BEFORE D1 merges):** OPS-A1 → OPS-B3 (wire the real gate) → OPS-A2/A3/A4 → **OPS-B2 spike (prove headless authed render)** → **OPS-D1 (rules migration test) + OPS-D3 (Firestore backup)**. OPS-B1, OPS-C2, OPS-D2, OPS-D4 alongside. **OPS-C1 (kill the long-lived key) is a security P0 — do it now.**
- **P0-RESTORE (D1 is the net's first payload):** D1 + D2 (one PR) → D6 (fallback) → D3 → D7. **Founder promotes the D1 canary** ("is this the design I love?").
- **P0-SAFETY (CHILD): R2** — port the consent layer + gate `/api/vision`. Live exposure; ship in this window.
- OPS-A5 channel + OPS-D5 kill-switch.

**Founder (parallel, unblocks billing):** B1 → B2 → B3 → B4 → B5 (staged + grandfather) → **B6 = euro #1**. Plus OPS-A5 channel, OPS-C1 + OPS-B5 approvals, OPS-D1 rules-diff sign-off.

**30-day exit:** every deploy is gated (tsc+tests+framework+safety), canaried, smoke-tested (incl. authed render), and code+data rollbackable; the long-lived deploy key is gone; the rich-image design is live in prod; `/api/vision` is consent-gated; first real euro on web.

### Days 31–60 — RETENTION LOOP + DESIGN POLISH + billing hardening
**Agents:** D4 + D5 (auto-gen, after image key confirmed) · PC2 → PC3 → PC4 · PC7 · PC5 · Q1 · Q2 · OPS-B4/B5 (atomic + staging) · T5 (consent ledger) · B10/B11.
**Founder:** B7/B8 native IAP (if mobile revenue in scope) · OPS-B5 staging project.

**60-day exit:** retention loop closed (the product can reach a parent who closed the app); auto-gen images are the default; design polish landed; billing observable; native IAP started.

### Days 61–90 — GROWTH MEASUREMENT + TRUST DEPTH + completeness tail
**Agents:** G1 → G4 · G2 · G3 + PC8 · PC6 (+ wire the ex-PC9 scene fallback) · Q3/Q4/Q5 · T1 + T2 (dry-run-first purge, backup-gated) · T3/T4 · G5.
**Founder:** B9 native smoke · COPPA legal stance · BigQuery/IL store metadata.

**90-day exit:** cross-cohort funnel measurable; two-sided viral loops live; COPPA-2026 closed (disclosure consent + retention purge); the illustrated-hero promise holds across Academy + Practice; IL launch-ready.

---

## 12. What changed vs. the prior backlogs (so nothing is lost)

- **`arbor-updated-backlog`** P0s (image cost cap, /vision consent, iOS CI) → cost cap travels with D1; /vision → **R2** (resized S→M: no consent layer exists on `main`); native/CI → B7/OPS items.
- **`arbor-enhanced-backlog`** north stars (VIRAL/CAPABLE/TRANSFORMING/TRUST) and winners → T4 already shipped; C1→**PC7**, V0→**PC5+G3**, trust wedge→**T1–T5**.
- **`PRD_arbor-viral-capable-transforming`** → loops are now **G1–G5 + PC5/PC8**.
- **`arbor-autonomous-execution-goal`** → realized as **§10**, now made safe with canary + authed-render smoke + auto-rollback + **data/rules backup-and-migration** + push-to-main-only + a kill-switch, which the prior doc lacked.

**Corrections applied vs. the synthesized draft (verified against `main`):**
1. **R2 resized + reprioritized** — `requireConsent` does **not exist on `main`**; this is a consent-layer build + a live COPPA exposure, not a one-liner.
2. **The 413 fix is already on `main` for vision** (`createApp.ts:97`, 12mb). The remaining 413 risk is on the **new** gen routes D1 adds — stated precisely in OPS-B1/D1.
3. **`generate-scene` does not exist on `main`** → the standalone "dead endpoint" item (PC9) is removed; it arrives via D1 and is wired in PC6.
4. **The deploy gate is `lint + test` only** (no tsc/framework/safety) and uses a long-lived `GCP_SA_KEY` → OPS-B3 + OPS-C1 promoted to P0.
5. **Four data/supply-chain tracks added** (OPS-D1 rules migration, OPS-D2 secret inventory, OPS-D3 backup + data-rollback, OPS-D4 lockfile, OPS-D5 SLO/kill-switch) — the highest-uncovered risk class.
6. **Rollback split** into code-rollback vs data-rollback in §10.2; a higher-tier human-gated class (§10.3) added for D1/T2/B5/rules deploys.
7. **B5 grandfathering** added (the enforcement flip can paywall existing beta users).

**Honest caveats.** (1) D1's reconciliation merge is the riskiest single step and may surface conflicts beyond the audit's read; the data-migration safety net (OPS-D1/D3) exists precisely because of this. (2) QUALITY/UX claims are code-grounded, not pixel-verified — confirm via `arbor-deep-eval` before marking Q-track items done. (3) Line citations throughout were drawn partly from feature branches; re-confirm against `main` at each item's kickoff. The thesis (rich-image + consent + quota stack is post-`main`) is verified and holds.

---

**Files referenced (absolute).**
Restore — `C:\Users\dguyr\ROS\.arbor-build\app\src\index.css`, `...\components\stories\HeroScenePlayer.tsx`, `...\components\stories\StoryIllustration.tsx`, `...\components\tabs\HeroJourneyTab.tsx`, `...\components\tabs\HeroComicsTab.tsx`, `...\components\practice\AdventuresTab.tsx`, `...\components\profile\AvatarCreator.tsx`, `...\app\src\lib\api.ts`, `...\app\src\server\createApp.ts` (vision 12mb L97).
Billing — `...\app\src\server\billing.ts`, `...\app\src\server\entitlements.ts`, `...\app\src\hooks\useCheckout.ts`, `...\app\package.json`, `...\firestore.rules`, prod deploy `PPPPtherapy-\PPPPtherapy-\cloudbuild.prod.yaml`.
Ops — `...\.github\workflows\arbor-ci.yml`, `...\arbor-deploy.yml` (push:main auto-deploy, gates = lint+test only, long-lived `GCP_SA_KEY`), `...\cloudbuild.prod.yaml`, `...\cloudbuild.yaml` (dead staging stage), `...\app\src\server\imageQuota.ts`, `...\docs\ops\`.
Trust/Growth — `...\app\src\routes\api.ts` (vision route ~L601, **no requireConsent**; comic prompt interpolation), `...\app\src\safety\escalation.ts` (NL/BE hotlines only), `...\app\src\sharing\consent.ts`, `...\app\src\components\tabs\AttributionTab.tsx`, `...\app\src\components\overview\SecondGuardianCard.tsx`, `...\app\src\server\digest.ts`, `...\app\src\server\referral.ts`.

**This doc lives at:** `C:\Users\dguyr\ROS\PAI\projects\arbor\PRODUCT-BACKLOG.md`. Mark the four superseded docs accordingly in their headers.

---

## Council Intake — 2026-06-21

*Proposed candidates (advisory + clinical reviewed). The council/Orchestrator promotes into the live tracks; this block does not rewrite the canonical body above (council rule 2).*

| ID | Title | Stream | riskClass | Clinical | Advisor | Owner pod | Note |
|----|-------|--------|-----------|----------|---------|-----------|------|
| PHI-04 | Cosmetics earned by development only — codify the no-dark-pattern guardrail as a shippable spec | philosophy | safe | n/a | aligned | avatar | Reframe-free; sharpen as a failing test, not a doc principle. |

**Advisor note (PHI-04) — verdict: `aligned`.**
This is the rubric made enforceable: a tested product invariant that bars variable-reward/streak/purchase bait from the one surface (avatar progression / FeelingsLab cosmetics) where it could creep in. It scores positive on all five tests and is the bullseye on test 5 (meaning over engagement) — it builds the principle into the codebase instead of relying on intent. No reframe needed (this *is* the competence-building version). One execution guardrail so it earns the score: ship it as a real failing test — e.g. an invariant asserting no cosmetic unlock is triggered by a streak-count, login-count, time-in-app, or purchase event, only by a logged development action — not a documented principle. A doc principle backslides the first time a growth experiment wants a streak reward; a red test holds the line. Recommend council weight this `aligned` (full strategic_fit) and the Orchestrator schedule it in a `safe` wave.

---

## Council Intake — 2026-06-21 (full council: advisory + clinical + demand + CIL)

*Scribe: arbor-evaluator (Product Council). Streams pulled: **philosophy** (arbor-advisor, 10), **clinical** (arbor-clinical-lead board, 8), **demand** (arbor-marketing-lead, 12), **cil** (arbor-evaluator IMPROVEMENT-BACKLOG, top findings folded). Deduped across streams (one root cause, not ten symptoms), scored `priority = (reach×impact×confidence×strategic_fit)÷effort` with `strategic_fit`: aligned=1.0 · tension=0.6 (the rubric down-weights engagement-bait framing on purpose); clinical-gate items that score `soundness:pass / claims:none` carry full fit, board-`HELD` items carry the same priority but cannot be build-ready. Top ~12 kept; the rest folded as dedupes. This block **proposes** — it does not rewrite the canonical body (council rule 2). The Orchestrator/human promotes into the live tracks above.*

### Dedupe map (one root cause per row)
| Cluster | Root cause | Merged candidates | Kept as |
|---|---|---|---|
| **Parent-agency briefing** | One brief template (one read + one honest signal + one parent-owned next step) fed by `monitoring.ts`, surfaced across digest / proactive card / milestone | PHI-02, PHI-07, PHI-05, DEM-002, + CIL FT-2 / T5 / `CIL-capability-proactive-memory-alerts` (18) | **CI-01** |
| **Corrected-age honesty** | Preterm corrected-age exists in `milestoneData.ts` but the live monitoring path + capture UX don't use it | CLI-01 (wire), CLI-07 (capture/display) | **CI-02** (capture, dep) + **CI-03** (wire, depends on it) |
| **Honest red-flag layer** | CDC "Act Early" hard-stops + behavior regression never surfaced; surveillance-not-diagnosis | CLI-03 ≡ PHI-10 | **CI-04** |
| **Referral / second-guardian loop** | `/join?ref=` resolver + grant + share export unbuilt; reframe = real care-circle, not give-get bounty | DEM-007, DEM-008, PHI-09, + CIL FT-1 / `CIL-bugs-referral-join-route-missing` (13) | **CI-10** (resolver+grant), **CI-11** (share export) |
| **Governed JITAI nudge** | JITAI fires only in render-time `useMemo`; no delivery + needs an attention-budget governor | DEM-001 (FCM push) + PHI-06 (budget) + CIL `CIL-capability-push-notifications` (20) | **CI-09** |

### Scored candidate queue (top 12 + clinical-gate cluster)
| ID | Title | Stream | riskClass | Priority | Clinical | Advisor | Owner pod | Note |
|----|-------|--------|-----------|----------|----------|---------|-----------|------|
| CI-04 | Honest red-flag layer — CDC "Act Early" hard-stops + regression, non-alarmist, surveillance-not-diagnosis (folds PHI-10) | clinical | gated | 26.7 | **concerns / UNSUBSTANTIATED — HELD** | aligned | arbor-ai | Truth-before-avoidance, the time-sensitive case. **Clinical HOLD (not a veto):** fix the 16m→18m language threshold (retired DSM rule), build a loss-of-skills detector (premise that regression is already caught = false), surface the missing *behavior* not the condition, "worth a conversation in the next few weeks" never "red flag". **Hard dep: CI-02→CI-03 (corrected age) land first** or it urgency-flags a preemie on raw age. SLP owns language wording, psych owns joint-attention framing. Inherits CI-08 honesty line. |
| CI-08 | Consistent "not a diagnosis / not a clinician" honesty surface across all developmental signals | clinical | gated | 25.5 | **pass / none** | aligned | arbor-design | One canonical i18n string at equal visual weight, repeated at each signal surface (Screening/DevScore/Coach/Practice) — never swallowed fine-print. "A signal to discuss with your provider — not a diagnosis" + "Developmentally informed, grounded in CDC/AAP/ASHA"; never "clinically validated". Reconcile the existing scattered in-code non-diagnostic strings to ONE string. **Lands alongside CI-04/CI-05 so their new surfaces inherit the line by default.** Board passes wording before build-ready. |
| CI-13 | Non-pathologizing output-screen guard on behavior/emotion coaching (wire `screenModelOutput` into `/analyze-behavior` + inline co-reg) | clinical | **safe** | 24.0 | **concerns / none (no claim → not gated)** | aligned | arbor-growth | The rare candidate that *is* the rubric. Verified gap: `screenModelOutput` (safety/outputScreen.ts) is wired only into coach+council (api.ts L352/L481), **not** `/analyze-behavior` or the inline co-regulation route — the two model-authored surfaces with the highest label-leak risk. Fixes: wrap both routes in the existing screen + add a test asserting "this looks like ADHD" is caught. **`safe` — claim-suppression guard, no claim/consent/billing → does not meet the gating trigger; passes normal DevSecOps gate. Build-ready after the two fixes + test.** |
| CI-05 | Escalation/red-flag copy clinical re-review + jurisdiction-currency hook (live-registry verify, fail-loud) | clinical | gated | 24.0 | **pass / none** | aligned | arbor-safety | Truth-before-avoidance, the maintenance case. `escalation.ts` already routes outward (112/101/findahelpline, trilingual). Add a dated periodic re-review that verifies every helpline literal **against a live authoritative national registry each pass** (not a rubber-stamp) + a currency hook that **fails loudly** (surfaces a stale-number flag). Trivial effort (1), highest reach (5). Gated by category (crisis copy) — arbor-safety + clinical-lead sign off every number before build-ready; not auto-built. |
| CI-02 | Corrected-age capture + display in onboarding/profile (AAP 24-month ceiling) — the data prerequisite | clinical | gated | 20.4 | **pass / none** | aligned | arbor-growth | Honest baseline at the input. `types.ts` has `preterm.gestationalWeeks` but capture/display is thin. Gentle optional gestation prompt + "corrected age" badge, stop at 24m corrected, reuse existing `correctedAge()` (don't re-implement). **Unblocks CI-03 + CI-04.** Gestation is sensitive child-health data → rides existing consent/redaction path. Board passes the 24m ceiling + prompt copy before build-ready. |
| CI-03 | Wire preterm corrected-age into the live developmental-monitoring path | clinical | gated | 20.0 | **concerns / none — HELD on diff** | aligned | arbor-ai | Textbook truth-before-avoidance — the live path lies by omission: `deriveMonitoring` (monitoring.ts L181) drives off raw `ageYears` and never calls the existing `comparisonAgeMonths` (milestoneData.ts L339), so a preemie is flagged "overdue" early vs AAP. Real correctness bug. **Dep: CI-02 (capture) first.** Keep the 2-month grace as an *independent* edge-of-window term on top of correction. Add a 28w preterm regression test. Board returns soundness:pass on the actual diff before build-ready. |
| CI-06 | Expert-cited activity content — citation fields on PlayActivity (split: schema safe, copy gated) | demand | gated (copy) / **safe (schema)** | 18.0 | **pass / substantiated** | aligned | arbor-practice | Aligned, competence+truth, claim correctly fenced. **Split the work: schema + render plumbing is SAFE and may land now; every populated citation stays gated until per-source sign-off.** Render each citation as a verifiable door (source + org + scope + working link), never a credibility badge / implied effect-size; personalization points at evidence FOR the concern, never "treats it". CDC reads "grounded in", never "endorsed by". Partially overlaps the already-shipped `CIL-capability-cited-expert-content` (branch `claude/cil-week`) — coordinate, don't double-build. |
| CI-01 | Parent-agency weekly brief — one shared template (one read + one honest signal + one parent-owned next step), feeds digest + proactive card + milestone (folds PHI-02/05/07, DEM-002) | demand | gated | 13.3 | **pass / none (copy needs board)** | tension→aligned (reframed) | arbor-growth | The biggest dedupe: **build ONE brief template** the monitoring signal feeds, gated once, not three surfaces. Reframe (already the competence version): a calm digest the parent *opens* (not a retention push), success = parent action / real conversation NOT opens/DAU, every brief ends in one parent-owned real-world step (never "open the app"), surfaces the honest signal incl. worth-discussing (no "everything's lovely" reel), exactly three parts. **Depends on CI-02/CI-03 (corrected age) landing first** so the read isn't built on an uncorrected-age artifact. Board passes every word of card/digest copy (non-diagnostic) before ship. Maps to canonical PC3/PC4/PC7. |
| CI-07 | Competence Ladder — scaffolding that deliberately retires itself as the parent succeeds | philosophy | safe | 13.7 | n/a | aligned | growth | The purest competence-not-dependence mechanic and a genuine differentiator vs every engagement-maximizing rival. Build guardrail (protects the alignment): the fade triggers on a real capability signal (parent resolves before opening the prompt / override-able self-report), and is **reversible + parent-visible** ("we've stepped back — tap to bring guidance back"). A silent/irreversible/engagement-triggered fade inverts it into a covert churn mechanic. `safe`; light psych note on parent-mediated framing, non-blocking. |
| CI-12 | Cosmetics earned by development only — codify the no-dark-pattern guardrail as a failing test (PHI-04, already proposed above) | philosophy | safe | 12.0 | n/a | aligned | avatar | Carried from the 2026-06-21 advisory block above. Ship as a real failing test (no cosmetic unlock fires on streak/login/time-in-app/purchase, only a logged development action), not a doc principle. Meaning-over-engagement made enforceable. **Build-ready safe.** |
| CI-08b / PHI-08 | Consent + audit panel framed as parental ownership of the record (see/govern/revoke) | philosophy | gated | 9.6 | n/a | aligned | safety | Cheapest trust win = strongest agency statement; hits responsibility-before-comfort dead-on. Copy frames the parent **owning** the record (see every share, govern it, revoke in one tap), not reassurance ("you're safe with us"). Maps to canonical T5. Gated (touches consent) → human decision, not auto-build. |
| CI-09 | Governed JITAI rhythm cue — low-frequency, parent-capped delivery that teaches the cue and tapers itself (folds DEM-001 push + PHI-06 budget) | demand | gated | 8.0 | **pass / none** | tension→aligned (reframed) | arbor-growth | Real moat value (optimal-moment cue from the child's own rhythm record) but delivery framing tilts to re-engagement. Reframe: payload hands the parent a window they own ("good window for [child]'s wind-down coming up"), never "open Arbor"; parent-set cap (≤1/day default) + quiet hours at consent opt-in; **name the cue so the parent learns the pattern**; success = acted-on-without-opening / fires-less-over-time (the self-retiring taper is the load-bearing non-dependence metric), never opens/streaks. Maps to canonical PC2. Gated on FCM consent + server-side child-data read (not a claim) → Guy. |
| CI-10 | Referral grant + `/join?ref=` resolver, fired on a real caregiver joining the care circle (folds DEM-007 + PHI-09 + CIL FT-1) | cil/demand | gated | 6.0 | n/a | tension→aligned (reframed) | arbor-growth | Resolver + `invite_sent`/`invite_activated` instrumentation are neutral plumbing; reframe fires the grant on **a real second caregiver joining THIS child's care circle and contributing an observation**, not raw invite volume — success = circles that became real, not K-factor. Keep the incentive subordinate (no referral counter / unlock-gate / streak at the top of `SecondGuardianCard`). Maps to canonical PC5/PC8/G3. Gated (writes entitlements/billing) — Guy confirms reward + that billing rails are live. |
| CI-11 | One-tap branded share export with referral code in deep link (artifact-leads, code as quiet footer) | cil/demand | gated | 6.0 | n/a | tension | arbor-avatar | Export pipeline is neutral plumbing; reframe makes the **artifact carry the value** (parent shares pride in their kid), referral a quiet footer; measure meaningful-shares not viral-K. **Load-bearing safety fence: stylized HeroAvatar only — no real face, no raw developmental data — enforced in the render pipeline, not merely asserted.** Gated (billing grant on activation + child-derived render) → Guy. |

### Strong demand candidates folded below the cut (scored, parked — promote when the cluster above lands)
| ID | Title | Stream | riskClass | Priority | Advisor | Note |
|----|-------|--------|-----------|----------|---------|------|
| CLI-02 | Age-window the Development Score to the age-appropriate milestone set | clinical | gated | 17.0 | aligned | **pass / none — HELD on peds boundary sign-off.** Correctness fix: `DevScoreCard.tsx:39` feeds the full ~175-item library unfiltered → young child false-low, older child noisy. Window to CDC checkpoints; depends on CI-02 corrected age. Already scored in the advisory block above. |
| DEM-009 | Double-Aha onboarding as a first competence loop (not a <60s funnel gate) | demand | gated | 16.0 | tension | Right substance (demonstrate the moat first-run), engagement-bait frame. Reframe: real coach answer ending in one parent-owned step; Rhythm *invitation* not *promise*; metric = first-action-completed not activated-in-60s. Board clears coach copy. Maps to canonical Q2. |
| DEM-003 | Physical growth tracking — own-curve plot, percentile as quiet context not a score | demand | gated | 14.4 | tension | Append-only parent-owned growth record is moat value; don't ship percentile as a headline/rank. WHO 0-24m + CDC 2y+ switch; trend/crossing logic (≥3 pts, 2 major lines), not single-reading; depends on CI-02. arbor-safety clears COPPA/GDPR schema. |
| DEM-006 | Per-child family orientation view (NOT a sibling comparison scoreboard) | demand | gated | 9.6 | tension | Cross-child longitudinal DevScore is real moat; render so two numbers aren't rankable (no shared axis/sort), each card ends in one parent-owned step, frame Family plan as "hold each child's record in one place". Entitlement gate before UI; board confirms non-diagnostic per-child framing. |
| DEM-012 | Memory-adaptive literacy track — readiness as parent-logged observation, never a screen | demand | gated | 10.4 | tension | Strongest competence story in demand (moat beats free Duolingo ABC/Khan), but "readiness signal" carries assessment framing. Reframe: surface observed behaviors not a score; success = child's reading habit not lessons; route to shared book-reading; plateau→"worth raising with provider" never "delayed". SLP signs literacy windows. |
| DEM-010 | Founding-member paywall at proven value — real honored cohort, no fake slot cap | demand | gated | 9.6 | tension | Charging at proven value is fine; **the 500-slot scarcity is fake-limit-to-convert (fails truth)**. Make the cohort real (locked price/early access) or drop the counter; no-card trial always visible; keep the kill-gate (no live paywall until 50 reviews OR press). Level 4 billing → Guy confirms price + cap reality. |
| DEM-011 | Email/waitlist capture with GDPR consent — gift-of-competence, not a lead hook | demand | gated | 9.6 | tension | Ship the compliant double-opt-in + unsubscribe (real GDPR prerequisite); make the promise one useful source-grounded artifact ("3 things worth watching at your child's age, grounded in CDC/AAP"), framed "get something useful now" not "don't miss out". arbor-safety reviews consent/lawful-basis/retention. Maps to canonical `CIL-market-no-activation-email-capture` (CIL gated). |
| CLI-04 | SLP referral-timing prompt tied to ASHA intelligibility windows | clinical | gated | 21.3 | aligned | **concerns / UNSUBSTANTIATED — HELD.** Correct the cited windows to current ASHA (Hustad et al. JSLHR 2021), anchor to conservative lower-bound not the 50th-pct rule (over-refers normal late-bloomers); state Arbor's score is practice accuracy not measured intelligibility. SLP re-confirms windows + referral copy before build-ready. Lands with CI-08 honesty line. |

---

### (a) Top SAFE, build-ready items — flagged for arbor-orchestrator's next wave
1. **CI-13** — wire `screenModelOutput` into `/analyze-behavior` + inline co-regulation route + the catch-test (priority 24.0, `safe`, board: no claim → not gated). The single highest-value safe item; closes a verified label-leak hole on two model-authored surfaces. Owner: arbor-growth.
2. **CI-06 (schema half)** — add the `source?`/citation fields + render plumbing to `PlayActivity` (the **schema is safe**; populated copy stays gated). Coordinate with the already-shipped `CIL-capability-cited-expert-content` on `claude/cil-week` so it isn't double-built. Owner: arbor-practice.
3. **CI-12 / PHI-04** — cosmetics-earned-by-development invariant as a real failing test (priority 12.0, `safe`). Locks meaning-over-engagement into CI. Owner: arbor-avatar.
4. **CI-07** — Competence Ladder self-retiring scaffold, built reversible + parent-visible (priority 13.7, `safe`). Owner: growth. *(Light psych framing note, non-blocking — fine for a safe wave.)*

> All four pass the normal DevSecOps green-gate (tsc + tests + framework + safety eval) and carry no claim/consent/billing/cost/child-data surface. Everything else this cycle is `gated` (clinical sign-off and/or child-data/billing/consent) → not auto-built.

### (b) Gated — needs Guy (explicit decision list)
*Each row = the one decision Guy must make. Surfaced per council rule 5; never auto-scheduled.*

| Item | The one decision needed |
|---|---|
| **CI-04** honest red-flag layer | Approve building the CDC "Act Early" hard-stop + loss-of-skills surfacing **after** the clinical board fixes the 16m→18m threshold and signs off thresholds/escalation copy — and confirm CI-02/CI-03 (corrected age) ship first as the hard dependency. (claims:UNSUBSTANTIATED until board passes.) |
| **CI-01** parent-agency weekly brief | Approve the **delivery channel** decision: a parent-*opened* weekly digest/card grounded in the child's monitoring signal touches child-data egress (and PHI-05's dated/name-bearing milestone nudge reads the record out to email/push). Confirm channel + that board signs every word of non-diagnostic copy before ship. |
| **CI-09** governed JITAI cue | Approve FCM push opt-in consent flow + server-side read of child rhythm state. Confirm the cue is the parent-governed, self-tapering version (not a re-engagement push) before any build. |
| **CI-10 / CI-11** referral grant + share export | Confirm the reward amount **and that billing rails are live** (grant writes entitlements, Level 4). Confirm the share artifact uses stylized HeroAvatar only (no real face / no raw developmental data, enforced in the render pipeline). |
| **CI-02 / CI-03** corrected age | Sign off the AAP 24-month corrected-age ceiling + the `(40 − gestationalWeeks)` math + grace-window wiring on the actual diff (peds). Data prerequisite for the whole clinical cluster. |
| **CI-05** escalation currency hook | Approve a dated re-review owner (arbor-safety) + that the currency check verifies against a live national registry and **fails loud**. Crisis copy stays gated by category. |
| **CI-08** honesty surface | Approve the one canonical wording ("A signal to discuss with your provider — not a diagnosis" / "Developmentally informed, grounded in CDC/AAP/ASHA") before it's reconciled across all locales. |
| **DEM-005** live expert booking | **[HELD — see Clinical GATE block above]** Drop the "richer than cold telehealth" claim, default to invite-your-own-provider, packet-not-booking metric; then Guy + arbor-safety clear Stripe billing + full-memory-packet egress. |
| **DEM-010** founding paywall | Decide: real honored founding cohort (locked price / early access) **or drop the slot counter** — no fake 500-slot scarcity. Confirm price (€89/yr founding) + the kill-gate. Level 4 billing. |
| **DEM-003** growth tracking | Approve the child-health-data (COPPA/GDPR) schema (height/weight) and that percentile ships as quiet context, never a score/rank; WHO/CDC chart switch; depends on CI-02. |
| **DEM-009 / DEM-011 / DEM-012 / DEM-006 / CLI-02 / CLI-04** | Parked below the cut this cycle — surfaced for awareness; each carries a clinical and/or child-data/billing gate noted in its row. No decision needed until promoted. |
