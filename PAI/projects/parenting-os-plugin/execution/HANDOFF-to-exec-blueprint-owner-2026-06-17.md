# Handoff → the `[exec-blueprint]` execution owner

**Date:** 2026-06-17
**From:** the blueprint author (this session). **Decision:** single owner drives execution (you); I've stood down from editing `PPPPtherapy-/PPPPtherapy-` to avoid collisions.

## Use these
- **Wave/contention plan:** `arbor-ai-avatar-execution-blueprint-2026-06-17.md` (+ `.result.json` = all 14 specs + verdicts + digest). The load-bearing rule: one owner edits the spine (`createApp.ts`/`api.ts`/`env.ts`+`testConfig.ts`/`modelRouter.ts`) append-only, in wave order; `lib/i18n.ts` additive, M13 last.
- **Ready patches (apply at your discretion, re-ground first):** `arbor-exec-patches-M9-M6-2026-06-17.md` + `.json`
  - **M6 (mood-mirror avatar):** verdict **apply-ready**. New `practice/moodMirror.ts` (pure `latestMood`, +test) + a scoped OverviewTab status-band edit reusing `EmotionAvatar`. Depicted/explicit-log-derived only — never infers inner emotion.
  - **M9 (Growth-Plan auto-regenerate):** verdict **needs-fix** — single-route extension of `/api/generate-plan` (inherits aiQuota + advancedPlans), additive `ActionPlan` lineage fields in `types.ts`, pure `regeneratePlanDecision()` in `lib/plans.ts` (+test), `api.regeneratePlan` client, `handleRegenerateActionPlan` in ArborContext, "Regenerate from progress" in PlansTab. Apply the verdict corrections (verbatim `oldText` re-grounding) before landing.

## Verified facts that de-risk the plan
- **Avatar image-gen works in prod** — multiple `200`s on `/api/generate-avatar` in `europe-west4` (Vertex `gemini-2.5-flash-image` resolves there). **M14's region concern is closed**; M14 reduces to the health route + baking the env var for explicitness.
- **M7 (ASR) and M12 (consent) are already mostly built** — `gateVoice/gateFacePhoto` mounted, `grantConsent/listConsent/revokeConsent` exist, consent UI + audit landing. Rescope to the genuinely-missing pieces (client 451 surfacing, vendor mapping, audit trail, ConsentDrawer) — see the blueprint's grounding corrections.

## Loose end to reconcile (from my superseded M3)
Your pass rewrote `Avatar.tsx` and dropped the M3 `frame` prop, so **`app/src/practice/useActiveFrame.ts` is now likely orphaned** (ProfileSwitcher no longer imports it). Either re-wire M3 (additive `frame` prop on `Avatar` + `useActiveFrame` in ProfileSwitcher — it shows the earned cosmetic on the child avatar) or delete the orphan. Your call.

## Blocked-on-Guy (the author will drive these via computer-use on approval when you reach the wave)
- **M2:** enable Firebase **Storage** on `arborprd-westeu` (console) + bucket CORS/lifecycle.
- **M7:** **SoapBox** licensing / hosted **Whisper** endpoint + secret (`--set-secrets`, not `--set-env-vars`).
- **M1/M8/M10:** **Mac** for the iOS archive; set bundle id `app.arbor.family`; M8 must download `face_landmarker.task` at build (pinned SHA256 — not in node_modules).

## Deploy flow (proven this session)
Freeze green snapshot → `cd app && VITE_FIREBASE_*=… npm run build` → `gcloud builds submit --config cloudbuild.prod.yaml --substitutions=_REGION=europe-west4,_TAG=<sha>` (Cloud Run) → `firebase deploy --only hosting` → verify (home 200 / fresh hash / new routes 401) → push. Rollback: `firebase hosting:rollback` + redeploy prior Cloud Run revision.
