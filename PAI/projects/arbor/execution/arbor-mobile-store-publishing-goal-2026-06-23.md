# GOAL — Arbor Mobile App: Published & Live in the Apple App Store + Google Play

**Date:** 2026-06-23 · **Owner:** PAI / Arbor (product) · CoS (portfolio) · **Runner:** Arbor Agent Mesh (`arbor-native` lead + `arbor-release` + `arbor-safety`)
**Prod API/host:** https://arborprd-westeu.web.app · **App repo:** `PPPPtherapy-/PPPPtherapy-` (remote `guyrubin/PPPPtherapy-`), native shells in `app/ios` + `app/android`
**Runbook:** `app/MOBILE.md` · **Related memory:** [[arbor-mobile-store-publishing]], [[arbor-native-and-playkit]], [[arbor-app-architecture]]

---

## THE GOAL (north star)

> **Arbor is downloadable and running from the Apple App Store and Google Play** — a real user can install it on an iPhone and an Android phone, sign in, and use the live app against the prod API.

**Done =** an approved iOS build live on the App Store (or, intermediate: a working TestFlight build), an approved AAB live on Google Play (or, intermediate: an internal-testing track), both passing store review under the **kids/families** programs, pointed at prod, with rollback understood.

## Scope boundary (read first)

- **This session/goal = the mobile *publishing* track ONLY.** Native shells, signing, CI binaries, store listings, compliance, review. It does **not** build product features or UI.
- **The redesign is a SEPARATE concurrent session (web app).** The mobile shell bundles the same `dist/` web build, so the redesign **lands in the mobile app automatically** once it merges to `main` and we cut a build — no mobile-side UI work here. Do not touch web/UI source.
- **Concurrency rule:** another session owns the web/UI hot files. This track stays in mobile-only surfaces (`app/capacitor.config.ts`, `app/ios/**`, `app/android/**`, `.github/workflows/ios.yml|android.yml`, `app/MOBILE.md`, store-listing assets) — disjoint from the redesign. Rebase on `origin/main` before any build; never branch from a stale base.

## Current state (verified on disk 2026-06-23)

Already done — the hard engineering is finished:

- ✅ **Android CI** (`.github/workflows/android.yml`) builds release AAB — GREEN.
- ✅ **iOS CI** (`.github/workflows/ios.yml`) compiles a signed-or-unsigned Xcode archive — GREEN. The non-obvious Capacitor-8/SPM + Xcode-26/Swift-6.2 build fix is in place.
- ✅ **iOS signing path wired** — `app/ios/App/fastlane/Fastfile` builds + uploads a signed `.ipa` to TestFlight **from just an ASC API key** (no Mac, no manual certs).
- ✅ **Native ↔ backend** — `src/config/env.ts` allows `capacitor://localhost` + `https://localhost` in CORS; `src/lib/runtime.ts` re-points `/api/*` at prod.
- ✅ **Store-required policy pages live** — `app/public/privacy.html` + `app/public/terms.html`.
- ✅ **Icons/splash** source art present (`app/assets/`); **iOS Info.plist** usage strings present (Camera/Mic/PhotoLibrary/PhotoLibraryAdd).

What's left is **store-operations + two human gates** — not engineering.

## The two hard gates (Guy-only — block first submission)

| # | Gate | Why it blocks | Status |
| :-- | :-- | :-- | :-- |
| **G-A** | **Lock the bundle/package ID + store name** (`appId` in `capacitor.config.ts`, currently placeholder `app.arbor.family`; appName `Arbor`) | Immutable once a listing exists; every listing + signing artifact keys off it | ⛔ **Guy: decide later** (per 2026-06-23) — first thing to unblock |
| **G-B** | **Enroll paid store accounts + create app records + hand over keys** — Apple Developer Program ($99/yr) and Google Play Console ($25 one-time) | Only Guy can pay/own these; CI can't sign/ship without the keys | ⏸️ **Guy: not yet** (per 2026-06-23) — drive everything else to ready first |

**G-B deliverables Guy produces (then the mesh wires them):**
- *Apple:* enroll → App Store Connect → create API key (App Manager) + download `.p8` → create app record (with G-A bundle id). Then repo **secrets** `ASC_KEY_ID`, `ASC_ISSUER_ID`, `ASC_KEY_CONTENT` (base64 `.p8`) + repo **variable** `IOS_BUNDLE_ID`.
- *Google:* Play Console → create app. Generate upload keystore (`keytool`), then repo **secrets** `ANDROID_KEYSTORE_BASE64`, `ANDROID_KEYSTORE_PASSWORD`, `ANDROID_KEY_ALIAS`, `ANDROID_KEY_PASSWORD`. (Play App Signing manages the app key after first upload.)

## Workstreams the mesh CAN do now (account-free → drive to READY)

These need **no** paid account and are this track's actionable work. Target: when Guy opens the accounts, submission is hours away, not weeks.

| id | workstream | owner pod | gated? | output |
| :-- | :-- | :-- | :-- | :-- |
| **M1** | **Store-readiness audit** — re-verify both CI builds green on current `main`; confirm `cap sync`, icons/splash render, splash/status-bar config, native runtime classes | arbor-native + arbor-release | no | pass/fail report + any fixes |
| **M2** | **Kids/Families compliance pack** — Apple **Kids Category** + Google **Families** policy checklist for a 0–12 child-data app: COPPA/GDPR-K parent-managed consent, no behavioral ads, data-safety posture, restricted SDKs | arbor-safety (veto) + arbor-native | no | compliance checklist + gaps to fix before review |
| **M3** | **Listing metadata pack** (EN + HE) — app name/subtitle, full description, keywords, category, promo text, support URL, marketing URL, what's-new | arbor-marketing-lead + arbor-content | no | ✅ **DONE 2026-06-23** — `execution/mobile-store/M3-listing-metadata.md`; 2 pre-submission gates flagged (FR-10 loop verify + /support URL) |
| **M4** | **Privacy nutrition labels** — Apple **App Privacy** + Google **Data Safety** forms, drawn from actual data practices (EU storage, child data parent-managed, face/voice revocable consent, AI-training off by default) | arbor-safety + arbor-native | no | exact form answers |
| **M5** | **Age-rating questionnaires** — Apple age rating + Google IARC content-rating answers | arbor-safety | no | questionnaire answer sheet |
| **M6** | **Screenshot + preview set** — required device sizes (iPhone 6.7"/6.5", iPad, Android phone/tablet). **Depends on the redesign** — capture once it lands so the store shows the new UI | arbor-creative + arbor-native | no (coordinate w/ redesign) | per-size screenshot set |
| **M7** | **Signing dry-run + handover doc** — confirm Fastfile + workflows consume the G-B secrets correctly; write the exact "paste these 7 secrets + 1 variable" steps so wiring is mechanical when keys arrive | arbor-release | no | secret-wiring runbook |
| **M8** | **Backend CORS / native-origin verify** — confirm native origins live in prod (redeploy is a gated/coordinated deploy if needed) | arbor-release | deploy gated | verified or queued |

## Critical path

```
G-A lock bundle id ──┐
                     ├─→ M7 secret-wiring ready ─→ G-B accounts+keys ─→ CI ships signed iOS→TestFlight + signed AAB→Play internal track ─→ store review (M2/M4/M5 clean) ─→ LIVE
M1 audit green ──────┤
M2 compliance clean ─┤
M3/M4/M5 listing pack┤
M6 screenshots ──────┘   (M6 waits on redesign landing on main)
```

The mesh can complete **M1–M5, M7, M8** entirely now. **M6** waits on the redesign. Then everything parks at **G-A** then **G-B**.

## Definition of Done (per platform)

- **iOS:** signed `.ipa` on TestFlight green → App Store review passed (Kids Category) → live, installable, runs against prod.
- **Android:** signed AAB on an internal-testing track green → production review passed (Families) → live, installable, runs against prod.
- Rollback understood: stores via phased release / halt rollout; app content via the web `main`→deploy path (the binary is a thin shell).

## Coordination & autonomy

- **Autonomy:** M1–M8 prep is auto (Tier-A). **G-A, G-B, any paid spend, any store submission, and any prod redeploy** are Guy-gated (Level 3–5).
- **No prod-hosting clobber** while the redesign session is active — mobile track does not deploy hosting; if M8 needs a backend redeploy, coordinate ("deploy clear") first.
- After each step: update this doc's status + append a memory pointer. Keep `app/MOBILE.md` as the live runbook.

---

## ⚠️ WAVE 1 RESULT (2026-06-23) — REFRAME: the gates are NOT the long pole

Ran M1, M3, M2/M4/M5, M7/M8 + two adversarial verifiers (store-review sim + clinical claims gate). Full go/no-go: **`execution/mobile-store/SUBMISSION-READINESS.md`**. Both verifiers returned `readyToSubmit: false`.

**Headline:** closing G-A + G-B today would still produce an **instant double rejection.** The real blocker is **7 account-free reject-class fixes** (in front of the two gates), not the paid accounts:
- **R1/R2** — declared Privacy/Terms/Support URLs don't resolve (SPA catch-all serves index.html; no `support.html`). *(hosting config — mobile track, low collision)*
- **R3** — no in-app link to the privacy policy. *(web app — collides w/ redesign session)*
- **R4 (highest risk)** — no native IAP; in-app subs redirect to web checkout → automatic Apple 3.1.1 + Play Payments reject. Needs RevenueCat native SDK + platform branch. *(web app)*
- **R5** — no parental gate before purchases/external links → Kids/Families reject. *(web app)*
- **R6** — no full account-deletion path (only per-child erase) → both stores require it. *(web app + hosting)*
- **R7** — 3 unsubstantiated claims in listing copy (Rhythm "predict the day", Practice Studio feedback-loop, HE "יודעת עליו הכל") → clinical-claims veto + Apple 2.3.1. *(copy — safe to fix now)*
- **R9** — Android signing steps not actually wired in `android.yml` (secrets only in a comment). *(CI — mobile track)*
Plus risks R10–R12 (Android perms/Data-Safety/controller identity), minors R13–R16, and the M8 gated prod redeploy.

**What IS verified green:** the child-data/consent/privacy plane (no safety veto), both CI pipelines' structure, native↔backend code, age ratings, and the listing pack minus the R7 claims.

**Collision note:** R3/R4/R5/R6/R10/R11 live in the shared web-app codebase the **concurrent redesign session** is editing — these must be coordinated/sequenced, not fired blind. R1/R2/R7/R9/R13/R15/R16 are mobile-track/config/copy — low collision, safe for this track now.

---

## WAVE 1 BUILD LANDED (2026-06-23) — safe fixes on a green branch

Branch **`claude/mobile-store-safe-fixes`** off `origin/main` (`253da27`), pushed. PR: https://github.com/guyrubin/PPPPtherapy-/pull/new/claude/mobile-store-safe-fixes . **NOT merged** (merge to `main` = prod-hosting deploy via CI — gated; coordinate with the redesign session first). 6 files, all mobile-track/config/hosting, zero web-UI source (disjoint from redesign):
- **R1/R2 ✅** — `firebase.json` rewrites `/privacy`→`/privacy.html`, `/terms`, `/support` above the SPA catch-all + new `app/public/support.html`. The declared store URLs now resolve.
- **R9 ✅** — real Android release signing wired (`build.gradle` conditional `signingConfig` + `android.yml` keystore-decode step). No-op/unsigned when secrets absent → current green compile preserved; signed AAB once G-B keys land.
- **R15 ✅** — unique monotonic build numbers per CI run (`agvtool` iOS, `-PversionCode=$GITHUB_RUN_NUMBER` Android) — required for TestFlight/Play uploads.
- **R13 ✅** — `Info.plist` `ITSAppUsesNonExemptEncryption=false` (export-compliance prompt gone).
- **R16 ✅** — dropped legacy `armv7` → `arm64`.
- **R7 ✅** — claim-safe listing copy: Rhythm "predict the whole day" → anticipate-from-own-pattern; Practice Studio unverified feedback-loop clause stripped; HE "יודעת עליו הכל" → "על מי מדובר". EN+HE, native-voice gate passed (in the M3 doc).

Shared-codebase reject-blockers filed as **PRODUCT-BACKLOG AP-061 (in-app privacy link) / AP-062 (native IAP — highest sev) / AP-063 (parental gate) / AP-064 (account deletion)** for the product/redesign track.

**Remaining before first submit:** merge `claude/mobile-store-safe-fixes` (gated, = deploy) · AP-061..064 built+merged · risks R10/R11/R12 · **G-A** bundle id · **G-B** accounts+keys · M8 prod redeploy · M6 screenshots (after redesign).

---

**Status:** Goal set + Wave 1 executed 2026-06-23. 7 account-free reject-fixes landed on a green branch (unmerged/gated); 4 shared-code blockers on the product backlog. True critical path now = AP-061..064 + the two Guy gates.

**M3 complete 2026-06-23.** Store-ready listing metadata (EN + HE) written to `execution/mobile-store/M3-listing-metadata.md`. App name locked as "Arbor — Know Your Child" (EN) / "Arbor – האפליקציה שזוכרת" (HE). Hero line: "Every parenting app gives you content. Arbor actually knows your kid." Two pre-submission blockers flagged: (1) confirm Practice Studio feedback loop live (FR-10) before the "sessions feed back into the record" claim ships; (2) create/redirect `arborparentingapp.com/support` before entering the Support URL. All Arbor Bar gates pass. arbor-safety clinical sign-off required before submission (no diagnostic/effect-size claims are present, but clinical team should confirm).
