# Arbor AI + Avatar — Conflict-Aware Execution Blueprint

**Date:** 2026-06-17
**Source:** 36-agent multi-agent workflow (6 platform/domain map lenses → digest → 14 build-ready specs → adversarial verify each → synthesis). Full specs + digest + verdicts in the sidecar `arbor-ai-avatar-blueprint-2026-06-17.result.json`.
**Purpose:** build + deploy each mission at the right level **without clobbering shared files** — a repo where a concurrent agent is actively refactoring.

> **The #1 rule this encodes:** the backend "spine" files (`createApp.ts`, `routes/api.ts`, `ai/modelRouter.ts`, `config/env.ts` + `testConfig.ts`, `lib/i18n.ts`, `package.json`, native manifests) must be edited by a **single serialized owner per wave**, append-only, never reordering the existing middleware chain. Frontend-only and isolated missions can run in parallel.

---

## Mission status (adversarially verified)

| # | Mission | Build-ready | Effort | Level | Shared files |
|---|---------|:--:|:--:|---|:--:|
| M9 | Growth Plan full auto-regenerate loop | ✅ | M | backend-first | 5 |
| M3 | Apply earned cosmetic frame to `<Avatar>` globally | rescope | S | inline | 1 |
| M14 | Prod ops: image-region + health route + deploy runbook | rescope | S | backend-first | 3 |
| M11 | AI cost governance (quota/entitlement gating + telemetry) | rescope | M | backend-first | 4 |
| M12 | Unified COPPA consent granularity + audit | **mostly done** | L | backend-first | 7 |
| M7 | SpeechCoach real ASR (SoapBox/Whisper) + consent | **half done** | M | backend-first | 6 |
| M5 | Child-as-hero scene cache + image cost guard | rescope | L | backend-first | 7 |
| M2 | Avatar hosting: Firebase Storage + migrate off data URLs | rescope | M | worktree | 3 |
| M1 | Avatar native capture (Capacitor Camera) iOS/Android | rescope | M | worktree | 5 |
| M8 | MimicStudio MediaPipe cross-platform hardening | rescope | M | worktree | 3 |
| M10 | JITAI nudges as native notifications | rescope | M | worktree | 7 |
| M4 | Memory-portrait / hero-card export + Sharing | rescope | M | worktree | 5 |
| M6 | Emotion-state avatar deepening (mood mirror) | rescope | M | inline | 2 |
| M13 | i18n (Hebrew/RTL) + a11y sweep — **LAST** | L | worktree | 5 |

Every verdict came back `buildReady=false` **except M9** — not because the work is wrong, but because each spec was missing a shared-file edit (almost always `testConfig.ts` alongside `env.ts`, or a `createApp.ts` mount) or a consent/cost gate. The corrections are folded into the waves below.

---

## The waves (ordered, conflict-aware)

**Wave 1 — foundations + frontend-only (parallel-safe):** `M14`, `M3`
M14 = the FIRST `createApp.ts` insertion (health router mounted at `/api` — `firebase.json` only rewrites `/api/**`) so later backend missions layer on a known-good chain; add `vertexImageLocation` to **both** `env.ts` and `testConfig.ts`. M3 = frontend-only cosmetic frame on `<Avatar>`; descope its test to a pure `.ts` logic test (vitest env is node-only, glob `*.test.ts`).
*Reality check: prod logs already show `200`s on `/api/generate-avatar` in europe-west4 — image gen resolves there, so M14's region risk is largely closed; M14 reduces to the health route + baking the env var for explicitness.*

**Wave 2 — backend cost/consent spine (serialized, one owner):** `M11` → `M12`
Both inject a new store into `ApiDeps` + a new `app.use` block into `createApp.ts` — they **cannot** run concurrently on those files. M11 first (cost leak is the bigger risk): `featureQuota` on image/scene/comic/adventure/ASR/voice, take `(entitlementStore,counters)`, add a 12 MB json body-parser **before** the 250 kb default, mount quota **after** the existing consent gates so denied requests don't inflate counters. M12 is **mostly done** (consent persisted, `grantConsent/listConsent/revokeConsent` exist, gates live) → rescope to: `consentAudit` store + `/consent/audit` route + `share:scope` gate (legacy soft-allow-then-record migration) + `ConsentDrawer` UI + `ConsentAuditEvent` in `types.ts`.

**Wave 3 — AI features on the spine (serialized behind W2):** `M7` → `M5`
M7 is **half done** (`gateVoice` already on `/score-utterance`, `childId` plumbed) → rescope to: real vendor mapping in `childAsr.ts`, surface `451` to the client (currently swallowed), `VoiceConsentGate` UI, fix `cloudbuild` to use `--set-secrets` (NOT `--set-env-vars`) for SoapBox/Whisper keys, ASR telemetry line. M5: add `sceneArtStore` to `ApiDeps`, raise body limit, **fail-open** on Firestore cache-put, default to Cloud Storage (not inline base64), cache-HIT short-circuits **before** the quota increment. Both can land behind `CHILD_ASR_PROVIDER=none` / cache flag until creds arrive.

**Wave 4 — storage + native shells (worktree each):** `M2`, then native trio `M1`/`M8`/`M10`
M2: enable Storage (europe-west4) + CORS + lifecycle first, gated Firestore export step 0, harden `Avatar.tsx onError` (the primary renderer), make `avatar.storagePath` required, append-only CSP edit. Native trio all add `@capacitor/*` deps + edit `Info.plist` + `AndroidManifest.xml` + run `npx cap sync` → **single dependency-bump owner** lands the union, then they proceed. M8 blocker: `face_landmarker.task` is NOT in node_modules — its copy script must **download with a pinned SHA256**.

**Wave 5 — frontend identity + i18n LAST:** `M9`, `M4`, `M6`, then `M13`
M9 (buildReady) takes the single-route path (extends `/generate-plan`, zero `createApp.ts` edits). M4 must **EDIT** existing `heroCard.ts` (creating it clobbers — it's used by OverviewTab). M6 sources `useHeroAvatar` from `components/ui/HeroAvatar`. **M13 goes absolutely last** — it touches `i18n.ts` + `playkit.tsx` + every surface the other missions edit; running it earlier guarantees i18n merge conflicts.

**Parallel-safe set:** M14, M3, M8, M10 (with the dependency-bump owner caveat for the native pair).

---

## Hot-file contention → strategy

| File | Missions | Strategy |
|------|----------|----------|
| `server/createApp.ts` | M14,M11,M12,M5,M7,M2 | **Single backend-spine owner, serialized.** Append-only mounts in wave order M14→M11→M12→M7→M5; M2's CSP edit merges separately. Never reorder the existing rateLimit→vision-12mb→250kb→auth→bindUid→aiQuota→coachMeter chain. |
| `routes/api.ts` | M11,M12,M9,M5,M7 | Serialize via spine owner. `ApiDeps` type + destructure are the shared insertion points — **append** `consentAuditStore` (M12), `sceneArtStore` (M5), never reorder. M9 = single-route, no ApiDeps change. M7 gate already present. |
| `lib/i18n.ts` | M11,M12,M5,M8,M9,M4,M6,M13,M10 | **Additive-only**, namespaced blocks appended at the END of both `en`/`he`, key parity enforced. **M13 is the final consolidator.** Grep for the dict-close brace, not line numbers. |
| `package.json` | M1,M8,M10,M4,M2,M3,M11 | **Single dependency-bump owner** adds the union of `@capacitor/*` ^8.x deps (match `@capacitor/core ^8.4.0`) + build-script edits in one hunk. |
| `Info.plist` / `AndroidManifest.xml` | M1,M7,M8,M10,M12 | **Additive-only, single native-config owner.** Union the usage-description keys / `<uses-permission>` once (currently NONE / only INTERNET). |
| `config/env.ts` + `testConfig.ts` | M11,M5,M7,M14 | **Always change together** — any new REQUIRED `ArborConfig` field omitted from `testConfig.ts` breaks `tsc` across the whole suite. Single config-batch owner. |
| `ai/modelRouter.ts` | M11,M5,M14 | Serialize: M14 (image client region) → M11 (telemetry fallback) → M5 (usage signal). Distinct method bodies, same file. |
| `ProfileEditDrawer.tsx` | M1,M2,M3,M12 | Serialize by function: M2(onCreated storage)→M3(header Avatar frame)→M12(consent entry)→M1(onPickPhoto native). |
| `AvatarCreator.tsx` | M1,M12,M13 | M12 mostly done → M1(capture)→M13(i18n) last. |
| `OverviewTab.tsx` | M6,M10,M4 | Scope to distinct sections: M4(existing hero-card onClick)→M6(status band)→M10(nudge section). |
| `heroCard.ts` | M4 | **EDIT not create** (exists, used by OverviewTab) — add `composeHeroCard` alongside. |
| `types.ts` | M9,M11,M12 | Additive-only; `ConsentGrant/ConsentPurpose` already exist — don't duplicate. |
| `cloudbuild.prod.yaml` | M14,M7,M11 | Additive via single config owner; append to the fragile `^@^` env string with `@` (never a comma); M7 secrets via `--set-secrets`. |
| `vitest.config.mjs` | M3,M1,M4 | Env is node-only, glob `*.test.ts`. **Descope DOM tests to pure-logic `.test.ts`** to avoid a shared config edit. |

---

## Deploy order (per wave)

1. **W1:** M14 backend-first (verify image region → deploy Cloud Run → `/api/health` + authed `/api/generate-avatar` smoke). M3 frontend-only Hosting + `cap sync`.
2. **W2:** Deploy Cloud Run **before** clients — M11 then M12 (set image/adventure/ASR caps + `CONSENT_POLICY_VERSION`; deploy `firestore.rules` for consents/consentAudit), then Hosting.
3. **W3:** Cloud Run first (`CHILD_ASR_PROVIDER=none` default; Firestore TTL on `sceneArt.expireAt`), then Hosting, then `cap sync`.
4. **W4:** Storage bucket + CORS + lifecycle → gated Firestore export → deploy with new CSP → run migration with admin creds. Native: union deps → `cap sync` → Android local build / iOS archive on a Mac (bundle id `app.arbor.family` must be set).
5. **W5:** M9 Cloud Run then Hosting; M4/M6 Hosting; **M13 Hosting last**, verify HE + reduced-motion across all 6 surfaces.
- **Global:** every native-touching mission runs `npx cap sync` after `npm run build` (stale committed `dist/` under `ios/.../public` + `android/.../assets/public` otherwise ships an old frontend).

---

## Grounding corrections (verified against the real repo)

1. Several verdicts cite a phantom `CONFLICT-MAP.md` / `REL-4` / `app/specs/` scheme from a **different (WAF) mission set** — N/A here. The generic contention (api.ts/createApp.ts/i18n.ts/package.json/manifests) is real and is what this serializes on.
2. `heroCard.ts` **exists** and is used by OverviewTab → M4 edits it.
3. `EmotionAvatar.tsx` exists → M2/M6 references valid.
4. Consent gates `gateFacePhoto/gateVoice/gateVoiceSurface` **already exist** (api.ts) and are mounted on avatar/scene/comic/voice/score-utterance → M7/M12 are far more done than their specs assumed.
5. `lib/api.ts` already has `grantConsent/listConsent/revokeConsent`; AvatarCreator already persists `face_processing` consent → only `consentAudit` + share gate + `ConsentDrawer` + `ConsentAuditEvent` remain.
6. No `@capacitor/camera|share|filesystem|local-notifications` installed; `@mediapipe/tasks-vision ^0.10.35` present but **no `.task` model** (M8 must download it).
7. `firebase.json` rewrites **only** `/api/**` → M14 health route must mount at `/api`.
- **Test infra (blocks component tests for M1/M3/M4/M5/M6):** vitest env `node`, glob `src/**/*.test.ts`, no jsdom/@testing-library — `.tsx` tests won't even be collected. Default stance: **descope DOM tests to pure-logic `.test.ts`**.
- **Beta enforcement:** `ENFORCE_ENTITLEMENTS` makes everyone Plus in beta, so M11's Free caps are inert — the Plus **abuse-ceiling 429** is the only live cost protection until billing.

---

## Blocked-on-Guy (need external action; use computer-use to approve)

- **M2:** enable Firebase **Storage** on `arborprd-westeu` (console "Get Started") + bucket CORS/lifecycle.
- **M7:** **SoapBox** licensing (vendor signup, now Curriculum Associates) and/or a hosted **Whisper** endpoint URL/secret. Code lands behind `CHILD_ASR_PROVIDER=none` until then.
- **M1/M8/M10:** iOS archive needs a **Mac** + bundle id; Android local build.
- **M11/M12:** confirm Free-tier caps + `CONSENT_POLICY_VERSION` values for prod.
