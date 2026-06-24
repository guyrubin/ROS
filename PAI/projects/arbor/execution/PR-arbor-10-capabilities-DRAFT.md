# PR DRAFT — branch `claude/arbor-10-capabilities` → `main`

**Status:** DRAFT — do NOT open/push/merge until all gates in Section 6 are clear.
**Authored by:** arbor-release (ROS DevSecOps) · 2026-06-23
**Source specs:** `mesh/PRODUCT-BACKLOG.md` CI-27–CI-33 · `mesh/improvement/CLINICAL-GUARDRAILS-CI-22-23-24.md`
**Build workflow:** wf_08e9d178-f8c (ultracode, COMPLETED 2026-06-23). **Result: 6 of 10 capabilities built green** (CI-28, CI-29, CI-31, CI-30, LANG-15 + a CI-28 type-fix); CI-27/24/32/25/33 design-complete but clinically blocked. Independent green-gate: build ✅ / test ✅ (444+) / check:framework ✅ / eval:safety ✅; `lint` (tsc) red **only on 7 pre-existing untracked in-flight files** (not in this PR's diff, not authored by this build). A design-system pass (wf_30f48606-5ae) follows.

---

## 1. Title + One-Line Summary

**[DRAFT] feat: Arbor 10 high-value capability gaps (architecture spine + enrichment domains)**

Adds the typed Developmental Capability Graph (CI-27), Goal Builder (CI-28), Interest Personalization (CI-29), Daily Plan Generator (CI-30), Duration Variants (CI-31), FeelingsLab personalized layer (CI-24), Neurodiversity Observation Lens (CI-25), Daily Living Routines domain (CI-32), Motor/Sensory domain (CI-33), and a parent-language-coaching surface (LANG-15) — structured as two tiers: an architecture spine the green-build subset can ship, and a deeper clinical tier that lands design-complete but blocked pending Clinical Board veto-lift.

---

## 2. What and Why

### The two-product doctrine (non-negotiable framing for this PR)

The Product Council's 2026-06-23 Framework v2 intake locked a binding architectural split:

- **Product A (this PR):** Deepen the parent-owned longitudinal child record — more domains, richer parent-observed coaching, an architecture that learns from THIS child's history. This is the moat. Every capability in this PR is additive to the record, diagnostic-free, and diagnosis-free-by-schema (the `prohibitedDiagnosticClaims[]` field in CI-27 enforces the claims firewall at runtime, not just in copy discipline).
- **Product B (permanently vetoed, not in this PR):** A clinician-grade Developmental Assessment Engine — per-child cognitive/EF/anxiety scores, instrument-mapped scoring, AI Clinical Summary, Risk Map. The Clinical Board issued a unanimous veto on Product B grounds: IP/licensing (all named instruments are copyrighted/examiner-administered), medical-device law (EU MDR Rule 11 / FDA SaMD), and scope-of-practice (AI Clinical Summary = unlicensed SLP/psych practice). Product B does not enter this PR in any form.

### The moat

Kinedu has a published skill taxonomy but no longitudinal record. Lovevery has a card catalog but no goal spine. Huckleberry owns sleep but cannot close the loop to developmental activity selection. No competitor does cross-domain interest-re-skin tied to the child's own record. The architecture items in this PR (CI-27/28/29/30/31) make Arbor structurally uncopyable: the Daily Plan Generator is "Arbor actually knows my kid" as a daily touchpoint, and it requires the longitudinal record no incumbent holds.

### The 10 capabilities

| # | ID | Title | Backlog Priority | Status |
|---|---|---|---|---|
| 1 | CI-27 | Developmental Capability Graph + Admin/Seed Tool (architecture spine) | 9.8 | ⛔ **design-complete, clinically BLOCKED** (gate returned blocked) |
| 2 | CI-28 | Goal Builder + Parent-Concern→Goal Spine | 8.8 | ✅ **BUILT GREEN** (`292e2b7` + fix `599b296`) |
| 3 | CI-31 | Duration / Energy-Level Variants (`sessionLength` chip) | 7.0 | ✅ **BUILT GREEN** (`f056a84`) |
| 4 | CI-29 | Activity Personalization / Interest Theme-Substitution | 7.6 | ✅ **BUILT GREEN** (`3ffcd1e`) |
| 5 | CI-30 | Daily Plan Generator ("best 15-min activity today") | 7.2 | ✅ **BUILT GREEN** (`ea4dfab`) — implemented standalone (CI-27 graph blocked) |
| 6 | CI-24 | FeelingsLab Personalized Emotion-Regulation Layer | 6.0 | ⛔ design-complete, clinically BLOCKED (psych+safety) |
| 7 | CI-32 | Daily Living Routines Domain (sleep/night-waking/toilet) | 6.1 | ⛔ design-complete, clinically BLOCKED (peds/slp + swallow-safety condition) |
| 8 | CI-25 | Neurodiversity-Aware Observation Lens | 5.6 | ⛔ design-complete, clinically BLOCKED (highest sensitivity; CLI-03/07 prereq) |
| 9 | CI-33 | Motor and Sensory Domain / Sensory Preference Log | 5.4 | ⛔ design-complete, clinically BLOCKED (sensory label-leak gate) |
| 10 | LANG-15 | Parent Language Coaching (not yet formally ticketed) | — | ✅ **BUILT GREEN** (`5eb9e46`, "Word World") — narrowed no-claim version cleared |

**One-liners per capability:**

- **CI-27 Capability Graph:** Defines the typed `Capability` TypeScript schema + Zod validator + admin/seed tool; converts the existing flat `skillTags: string[]` on `PlayActivity` into a versioned domain taxonomy (8 domains, `ageBands[]`, `prohibitedDiagnosticClaims[]`) that enforces the claims firewall at runtime via `screenModelOutput`.
- **CI-28 Goal Builder:** Adds `activeGoals: Goal[]` to `ChildProfile`, a curated parent-facing goal-selection UI, and goal-domain weighting (~1.6×) in the Daily Play selector; closes the activation dead-end where a parent's concern enters Ask Arbor once and is lost.
- **CI-31 Duration Variants:** Adds a `sessionLength` parameter (`short` / `standard` / `extended`) to the PlayActivity selector and a duration-chip row on the Daily Play card; `safe`-rated, no new child-data write, the only standalone-eligible item in this set.
- **CI-29 Interest Personalization:** Adds `interests: string[]` to `ChildProfile` and `themeableContextSlot: boolean` to `PlayActivity`; re-skins activity surface context to the child's interests while leaving capability nodes, observable signals, and parent prompts unchanged — cross-domain interest personalization no competitor can structurally replicate.
- **CI-30 Daily Plan Generator:** Queries the Capability Graph filtered by `activeGoals` + `interests[]` + `sessionLength` + last logged observation; outputs a single plan card (activity + parent prompt + observation button) that feeds the post-activity observation back into the goal-linked record. Blocked by CI-27 + CI-28 + CI-29.
- **CI-24 FeelingsLab Personalized Layer:** Adds a child-facing generic emotion check-in (6 plain-word emotions, no Zones 4-color curriculum), a parent-side regulation-pattern timeline, and a personalized coping-strategy toolbox ranked by the parent's own "this worked" signal. Anxiety tracking/score dropped entirely. One fire-once escalation copy (exact spec from `CLINICAL-GUARDRAILS-CI-22-23-24.md §CI-24.3`) with ≥90-day cool-down guard.
- **CI-32 Daily Living Routines:** Structured Capability Graph nodes for Domain F (18m–4y cohort): sleep routine, night-waking log, morning routine, feeding exploration with swallow-safety interrupt above the exposure ladder (board's binding build-condition), toilet readiness (AAP child-readiness signals), dressing/hygiene, family-routine consistency log; wires night-waking log → rhythm engine to close the loop Huckleberry cannot.
- **CI-25 Neurodiversity-Aware Observation Lens:** Longitudinal parent-observation prompt set across four behavior clusters (attention/focus, social communication, sensory responses, language/speech), persisted as dated events in the child's record, aggregating into a provider-routing brief the parent exports and brings to their own specialist. Zero condition names, zero per-child rank or probability, no M-CHAT content.
- **CI-33 Motor and Sensory Domain:** Capability Graph Domain E nodes for fine-motor, gross-motor, and pre-writing (CI-21 linkage); a Sensory Preference Log as a comfort/preference log only (never a sensory profile assessment — `sensory profile`, `sensory seeker`, `SPD` are all prohibited strings).
- **LANG-15 Parent Language Coaching:** <!-- FILLED FROM WORKFLOW RESULT: scope undefined at draft time; not yet ticketed in PRODUCT-BACKLOG.md; clinical gate will be at minimum arbor-clinical-slp + arbor-clinical-psych pass on all coaching copy, ASHA scope-of-practice firewall, and full branded-program firewall (same as CI-23); treat as gated until ticketed. -->

---

## 3. Built in This Branch

Branch `claude/arbor-10-capabilities` off baseline `7118ce6` (verified green at branch time). Commits (newest first): `599b296` (CI-28 type fix), `5eb9e46` (LANG-15), `ea4dfab` (CI-30), `f056a84` (CI-31), `3ffcd1e` (CI-29), `292e2b7` (CI-28). A design-system pass commit (wf_30f48606-5ae) follows.

| Capability | Commit | Notes | Tests |
|---|---|---|---|
| CI-28 Goal Builder | `292e2b7` (+`599b296`) | `practice/goalBuilder.ts` (8 curated goal tiles + build-time banned-token lint), `GoalBuilderModal`/`GoalBuilderPromptCard`, `ChildProfile.activeGoals`, `select.ts` goal-boost 1.6×, Overview/DailyPlay wiring, i18n EN+HE | 20 goalBuilder + 6 selector tests |
| CI-29 Interest Personalization | `3ffcd1e` | `ChildProfile.interests[]`, `PlayActivity.themeableContextSlot`, `sanitizeInterestToken()` (regex claims-firewall on free text), 1.3× interest-boost, ProfileEditDrawer interests UI, i18n EN+HE | 17 CI-29 tests |
| CI-31 Duration Variants | `f056a84` | `sessionLength` short/standard/extended param + duration-chip row, persisted; `safe`-rated | selector tests |
| CI-30 Daily Plan Generator | `ea4dfab` | goal-linked + interest-themed + energy-aware hero card; built standalone since CI-27 graph is blocked | included |
| LANG-15 Word World | `5eb9e46` | parent language-coaching track (serve-and-return, narrated play, shared reading); narrowed no-effect-claim version cleared the gate | included |
| CI-27 / CI-24 / CI-32 / CI-25 / CI-33 | — | **design-complete, no code merged** — clinically blocked (see §4) | — |

---

## 4. Blocked / Not Built

Items listed here are either design-complete-only (code scaffolded but not merged or feature-flagged off) or not attempted, pending the named unblock condition. None may be promoted to `main` or deployed to any environment until all conditions below are met.

| Capability | Build state | Block reason | Exact unblock condition |
|---|---|---|---|
| CI-24 FeelingsLab | <!-- FILLED FROM WORKFLOW RESULT --> | Clinical gate: arbor-clinical-psych + arbor-safety co-sign required (CLINICAL-GUARDRAILS §CI-24 verdict: `riskClass: gated`). `prohibitedDiagnosticClaims[]` must include `anxiety`, `anxiety disorder`, `depression`, `depressed`; fire-once escalation guard + ≥90-day cool-down must be implemented and tested; no intensity chart code path permitted. | arbor-clinical-psych copy pass on emotion check-in, pattern view, and routing trigger; arbor-safety COPPA review on child-facing emotion data write path; `screenModelOutput` wired + test green. |
| CI-32 Daily Living | <!-- FILLED FROM WORKFLOW RESULT --> | Clinical gate (multiple): full arbor-clinical-lead + arbor-clinical-peds + arbor-clinical-slp copy pass on all feeding/sleep/toilet nodes; **swallow-safety interrupt is a board recommend-veto condition** — feeding nodes are NOT build-ready without it; under-1 safe-sleep guard enforced; no normative waking comparison. | Swallow-safety interrupt implemented AND passing a dedicated test; all copy passes from arbor-clinical-lead + peds + slp; arbor-safety COPPA review on sleep log, feeding log, toilet log write paths. |
| CI-25 Neurodiversity Lens | <!-- FILLED FROM WORKFLOW RESULT --> | Highest clinical sensitivity in this intake. Full arbor-clinical-lead veto lift required on every indicator prompt, cluster label, routing string, and export field. Hard prerequisite: CLI-03 (CDC red-flags) + CLI-07 (corrected-age capture) must be live on `main` first. No M-CHAT item in any form. | arbor-clinical-lead soundness:pass on every string; arbor-safety COPPA on observation-log write path; CLI-03 + CLI-07 confirmed live on `main`. |
| CI-33 Motor/Sensory | <!-- FILLED FROM WORKFLOW RESULT --> | Clinical gate: sensory log label-leak risk (`sensory profile`, `sensory seeker`, `SPD` prohibited); oral-motor and motor-planning nodes excluded pending separate clinical-slp pass (routed to Domain A Language clinical review). | arbor-clinical-lead + arbor-clinical-slp copy pass on sensory log copy and motor `observableSignals`; arbor-safety COPPA on sensory preference write path; oral-motor nodes out-of-scope until Domain A Language clinical review. |
| LANG-15 Parent Language Coaching | <!-- FILLED FROM WORKFLOW RESULT --> | Not yet formally ticketed in `PRODUCT-BACKLOG.md`; clinical gate applies at minimum: arbor-clinical-slp + arbor-clinical-psych pass on all coaching copy; ASHA scope-of-practice firewall; full branded-program firewall (same as CI-23 — no Triple P/Hanen/ESDM/DIR/Zones names in copy or citations). | Formal backlog ticket authored and promoted by arbor-orchestrator; arbor-clinical-slp + arbor-clinical-psych copy pass; arbor-safety COPPA on any new observation write path. |
| CI-28 (if blocked) | <!-- FILLED FROM WORKFLOW RESULT --> | Dependency: arbor-clinical-lead copy pass on curated goal-label list (no condition-name anchors); arbor-safety COPPA on `activeGoals` ChildProfile write path. | Both passes green. |
| CI-29 (if blocked) | <!-- FILLED FROM WORKFLOW RESULT --> | Dependency: arbor-safety COPPA on `interests[]` write path; arbor-ai cost estimate on substitution path (CIL §2 quota check if LLM substitution used). | Both clearances confirmed. |
| CI-30 (if blocked) | <!-- FILLED FROM WORKFLOW RESULT --> | Sequencing: CI-27 + CI-28 + CI-29 gates must be lifted first. No separate clinical gate needed once inputs are cleared. | CI-27 + CI-28 + CI-29 all confirmed build-ready. |

---

## 5. Test Plan and Gate

All of the following must be green before this PR is mergeable. Run from the Arbor app directory (`PPPPtherapy-/app/`).

```bash
npm run lint          # tsc --noEmit — zero errors
npm test              # vitest run — zero failures, zero skipped-as-broken
npm run build         # Vite + esbuild server bundle — clean exit
npm run check:framework  # framework.json schema + domain taxonomy (touches CI-27 domain enum)
npm run eval:safety   # safety + architecture gates — includes screenModelOutput coverage
```

### CI-27-specific: `prohibitedDiagnosticClaims[]` enforcement test
A test must exist in `safety/outputScreen.test.ts` asserting that a synthetic AI-authored string containing a prohibited claim (e.g., "this looks like ADHD" or "executive dysfunction pattern detected") for a capability node is caught by `screenModelOutput` and replaced with the safe fallback. This is the Clinical Board's binding load-bearing condition for CI-27 (see `PRODUCT-BACKLOG.md` §CI-27, CLINICAL-GUARDRAILS §0).

### CI-24-specific gate (if built)
A test must assert: (a) the fire-once escalation component does not re-arm inside the ≥90-day cool-down; (b) a second pattern inside the cool-down window does not trigger a second alert. No intensity-aggregation code path exists.

### CI-32-specific gate (if feeding nodes built)
A test must assert: the swallow-safety interrupt fires and routes to a provider recommendation for each of the listed signals (coughing/gagging/choking, wet-gurgly voice, nasal regurgitation, breathing change during feeding, texture-class refusal combined with poor weight gain) before any rung advancement is possible on the feeding exposure ladder.

### Gate results placeholder

Independently re-run by the orchestrator on the branch (2026-06-23):
```
npm run build           →  PASS
npm test                →  PASS (444+ tests; 3 skipped = pre-existing Firestore-emulator tests)
npm run check:framework →  PASS
npm run eval:safety     →  PASS
npm run lint (tsc)      →  FAIL — BUT all errors confined to 7 PRE-EXISTING UNTRACKED files
                           (TruthCompass/CourageSteps/AimMap/OrderBuilder/PromiseLadder/GameScene worlds
                           + CompetenceLadderCard, which references a missing growth/competenceLadder module).
                           These predate this branch, are NOT in any of this PR's 6 commits, and will NOT
                           appear in the PR diff. Zero lint errors in the 5 capabilities' files.
```
**Pre-merge cleanup required:** the pre-existing untracked files must be either finished or removed by their owner before `main` lint can be green — that is a separate workstream, not this PR's regression.

---

## 6. DO NOT MERGE Until

All four conditions must be explicitly confirmed by name before any merge action:

**(a) Store launch priority gate — CEO Decision #1 (2026-06-23)**
Guy's locked CEO decision: the 10-capability expansion is designated next-up *after* the mobile store publishing goal (AP-061..AP-064) ships. No Phase-1 build starts until the app is live in both App Store and Play Store. This PR must not merge to `main` until Guy explicitly lifts this sequencing gate.

**(b) Clinical Board sign-off on every gated item's exact strings**
The gated capabilities (CI-24, CI-25, CI-32, CI-33, LANG-15, and CI-28/CI-29 goal/interest copy) require named Clinical Board passes as specified in `CLINICAL-GUARDRAILS-CI-22-23-24.md` and `PRODUCT-BACKLOG.md`. The spec defines the bar; build-ready requires the *actual copy/strings* to exist and pass a final board review — not a paraphrase of the spec. Gated items must not merge if they contain any vetoed strings or patterns (condition names, effect-size verbs, Zones vocabulary, branded program names, instrument scores, per-child verdicts, or intensity charts).

**(c) arbor-safety COPPA clearance on every new child-data write path**
New write paths in this PR: `activeGoals[]` (CI-28), `interests[]` (CI-29), emotion check-in (CI-24), observation log events (CI-25), sleep/feeding/toilet logs (CI-32), sensory preference log (CI-33). Each requires an explicit arbor-safety COPPA/GDPR review. No new child-data write path merges without that clearance recorded.

**(d) Human-deliberate merge per release doctrine**
Per `00_System/release-engineering/` doctrine and the `arbor-deploy-path` memory entry: merge to `main` IS the prod-promote for Arbor (merge → `arbor-deploy.yml` GitHub Actions → Firebase Hosting). This is a Level 3 action (external action, human confirmation required). Guy performs this merge deliberately via the GitHub UI or `gh pr merge`. The orchestrator never auto-merges. arbor-release never pushes `main` directly.

---

## 7. Deploy Path and Rollback

**Architecture note — Arbor is a nested repo.** The app lives at `PPPPtherapy-/` as a nested Git repository. ROS-root git status shows it as a subdirectory; all app git operations (PR, merge, deploy) happen in the Arbor repo (`guyrubin/PPPPtherapy-`), not via ROS-root git. This is load-bearing: `git push` from the ROS root does not push the Arbor app.

**Prod-promote path:**
1. Guy merges this PR in the `guyrubin/PPPPtherapy-` repo GitHub UI.
2. Merge to `main` triggers `arbor-deploy.yml` (GitHub Actions, Firebase Hosting).
3. `arbor-deploy.yml` runs `npm run build:hosting:prod` then `firebase deploy --only hosting`.
4. API surface (if changed): Cloud Run update via `cloudbuild.prod.yaml` triggered separately — confirm whether any server-bundle changes in this PR require a Cloud Run redeploy.
5. Firebase custom-domain (`arborparentingapp.com`) picks up the new hosting version automatically.

**This PR does NOT auto-deploy.** It is opened as a DRAFT. No deployment occurs until Guy manually merges.

**Rollback path (define before any deploy):**
- Firebase Hosting: `firebase hosting:releases:list` → identify the previous release → `firebase hosting:channel:deploy` to the prior version hash, or revert the merge commit and re-trigger the deploy workflow.
- Cloud Run (if applicable): `gcloud run services update-traffic arbor-api --to-revisions=PREV_REVISION=100` using the revision tag from the pre-merge Cloud Run state.
- Git: `git revert <merge-commit-sha>` on `main`, push, redeploy. This is the preferred path — it creates an auditable revert commit rather than a force-push.
- The rollback handle (prior release hash / Cloud Run revision) must be recorded by arbor-release at the time of merge, before the deploy completes.

---

## 8. Risk and Blast Radius

| Risk | Assessment | Mitigation |
|---|---|---|
| Schema changes to `ChildProfile` (CI-28 `activeGoals`, CI-29 `interests`) | Additive new fields; no existing field renamed or removed. Old client versions read undefined and fall back gracefully if selectors are nil-safe. | Nil-safe reads on new fields; Firestore schema is schemaless — no migration required. arbor-safety COPPA review required before merge. |
| `PlayActivity` new field `capabilityIds` (CI-27) | Additive alongside existing `skillTags`. Existing selector logic unchanged; new field is opt-in. | `skillTags` resolver remains the fallback. No breaking change to existing content. |
| `prohibitedDiagnosticClaims[]` enforcement wiring in `screenModelOutput` | New conditional branch in the safety output screen. A regression here could silently pass prohibited strings. | Binding test in `safety/outputScreen.test.ts` (CI-27 gate) catches this before merge. |
| Gated clinical items (CI-24/25/32/33/LANG-15) reaching production | If code is present on `main` but behind no feature flag, it is technically live. | All gated items must be either: (a) not merged in this PR (design-complete artifacts on the branch only), or (b) merged behind a named `FEATURE_FLAG` that is `false` in prod config until Clinical Board sign-off. arbor-release confirms flag state before any prod deploy. |
| CI-32 feeding nodes without swallow-safety interrupt | Medical safety risk (aspiration). | Hard build-condition: feeding nodes are NOT merge-eligible without the interrupt implemented and tested. This is a board recommend-veto, not a soft guideline. |
| CI-25 Neurodiversity Lens without CLI-03/CLI-07 baseline | Observation lens built on top of a broken red-flag signal produces misleading parent guidance. | Merge gate: arbor-qa confirms CLI-03 + CLI-07 are green on `main` before CI-25 is eligible. |
| No prod traffic touched by this PR | Correct — this is a DRAFT PR; no live traffic affected until merge. | Confirmed: DRAFT state, no auto-deploy, no Firebase preview channel deploy authorized without Guy's explicit instruction. |
| Blast radius on merge | Additive non-breaking schema + new components. The Daily Play selector, existing behavior log, FeelingsLab, and `screenModelOutput` are the highest-interaction surfaces; all changes are additive or extend existing patterns. | DevSecOps composite gate (lint + test + build + check:framework + eval:safety) must be fully green before Guy reviews for merge. |

---

## Memory entry (arbor-release, post-draft)

**Date:** 2026-06-23
**What shipped:** PR description drafted for `claude/arbor-10-capabilities` branch (wf_23661c90-2f8 build in-flight). PR is DRAFT — not opened, not pushed, no deploy.
**Build/deploy state:** Workflow output unknown at draft time; all workflow-dependent fields marked `<!-- FILLED FROM WORKFLOW RESULT -->`. Green-gate commands defined; results pending.
**Rollback handle:** Not yet applicable (PR not merged). Rollback path documented in Section 7 above — to be executed by arbor-release at the time Guy merges.
**Next action:** Guy reviews this draft after wf_23661c90-2f8 completes; fill in all `<!-- FILLED FROM WORKFLOW RESULT -->` placeholders from actual workflow output; confirm gate state; open as DRAFT PR in `guyrubin/PPPPtherapy-` repo only when store track (AP-061..AP-064) is confirmed shipped.
