# PROD-GATE record — branch `claude/arbor-10-capabilities`

**Date:** 2026-06-23 · **Scope:** the 5 built capabilities (CI-28 Goal Builder, CI-29 Interest Personalization, CI-31 Duration chips, CI-30 Daily Plan Generator, LANG-15 Word World) + the design-system pass. **Verdict: BOTH GATES GREEN — cleared for production** (deploy itself remains a Level-3 human-gated merge).

## Clinical gate (arbor-clinical-lead + peds/SLP/psych)
- **soundness: concerns→pass / claims: substantiated / riskClass: safe** once the 3 fixes below landed. **No veto.**
- **CI-31 + LANG-15:** clear to ship as-is (SLP cleared Word World mechanism lines, age-band→prompt maps, non-branded vocabulary, non-alarmist referral).
- **3 required one-line fixes — APPLIED (commit `72e7326`):**
  1. CI-28 `goalBuilder.ts` — relabel `"Switching between activities without a meltdown"` → `"Moving between activities more smoothly"` (deficit-framing → attachment-safe; routing preserved).
  2. CI-29 `select.ts` `BANNED_INTEREST_TOKENS_RE` — added `stim(ming/s)`, `hyper-fixation`, `preoccupation` (highest-frequency autism-coded bypass tokens).
  3. CI-30 `dailyPlan.ts` sparse why-line — `"Sharpens as you log more days"` → `"Gets more personalized as you log more days"` (removed engine-effect verb; the line shown when data is thinnest).
- **Non-blocking follow-up (file for arbor-pm):** age-aware goal ordering — confirm under-2 matched activities reflect parallel/proto-turn-taking, not true sharing/multi-step. Not veto-grade.
- **cited_basis:** CDC-2022 LTSAE; AAP/HealthyChildren; ASHA communication milestones; Center on the Developing Child (co-regulation); advisory.md §0 firewall.

## COPPA / child-data safety gate (arbor-safety) — **VERDICT: YES, safe to deploy**
- New persisted fields: `ChildProfile.activeGoals` (closed curated vocabulary + build-time lint), `interests[]` + `interestsUpdatedAt` (write-time `sanitizeInterestToken`, 40-char cap, parent-entered only). No new field for CI-30/CI-31; LANG-15 rides the existing `PracticeEvent` subcollection.
- Parent-owned, no new PII class, no new consent purpose (`face/voice/ai_training` unchanged), **zero third-party/model egress**, fully covered by existing GDPR export (`exportChildData` by-reference) + delete (`eraseEverything`/`wipeClientChildData`). `eval:safety` green; `select.test.ts` sanitizer 33/33 green.
- **No blocking consent/retention change.** Non-blocking: add "developmental goals + interests" as example parent-entered data to the privacy notice at next routine revision.

## Branch state at gate time
- 9 commits since baseline `7118ce6`; HEAD `72e7326`. Build ✅ · 550 tests ✅ (3 skipped = pre-existing Firestore-emulator) · `tsc` clean. Pushed to `origin`, PR-ready.
- Pre-existing untracked broken files (CompetenceLadderCard + practice worlds) were a SEPARATE workstream (handled in another session); never part of this branch's commits.

## Remaining before prod (all human/process, not clinical)
1. **Deploy choice** — canary stage (none exists in `arbor-deploy.yml` today; would be added) vs straight-to-prod via GitHub web merge.
2. **The merge itself** — Level-3, human-performed (no `gh` in this env; GitHub web UI), triggers `arbor-deploy.yml` → Cloud Run + Firebase Hosting straight to prod.
3. **Store-launch lock** — deploying overrides CEO Decision #1 (behind store launch); requires explicit lift.
