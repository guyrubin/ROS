# SUBMISSION-READINESS — Arbor Mobile Wave 1 (Go/No-Go Rollup)

**Date:** 2026-06-23 · **Owner:** PAI / Arbor · **Runner:** Arbor Agent Mesh (`arbor-native` + `arbor-release` + `arbor-safety`)
**Sources:** M1 (store-readiness audit), M2/M4/M5 (compliance/privacy/ratings), M3 (listing metadata), M7/M8 (release wiring), goal doc, + 2 adversarial verifier verdicts.
**Verdict basis:** both verifiers returned `readyToSubmit: false`. This rollup reconciles their blockers with the M-pack and separates *engineering/copy fixes the mesh can do now* from *the two Guy-only gates (G-A, G-B) that are open by design*.

---

## VERDICT — per store

> **Apple App Store: NO-GO — fix-list-remaining, not just gate-blocked.** Even with G-A/G-B closed, 6 hard rejections stand (dead policy/support URLs, no in-app privacy link, no StoreKit IAP, no parental gate, no full account deletion, unverified Practice Studio claim). All are **account-free engineering/copy** — none need the paid account to fix. So Apple is *engineering-blocked first, gate-blocked second*.

> **Google Play: NO-GO — fix-list-remaining, not just gate-blocked.** Same store-facing rejections as Apple plus two Android-specific risks (permission-vs-feature mismatch, Data Safety "Shared" over-declaration) and the unwired Android signing step (M7 GAP-1). Again, **every item is account-free** except the final keystore upload. Play is *engineering-blocked first, gate-blocked second*.

**Bottom line:** G-A and G-B are NOT the long pole. The long pole is ~6 account-free reject-class fixes (5 client code/copy + 1 hosting-config). Closing G-A/G-B today would still produce an instant double rejection.

---

## CONSOLIDATED FIX LIST (deduped, severity-ordered: reject → risk → minor)

Merges M1 engineering fixes + both verifier blocker sets. "Account-free?" = can be built/landed now without the Apple/Google paid accounts.

| id | store | sev | issue | fix | owner pod | account-free? |
| :-- | :-- | :-- | :-- | :-- | :-- | :-- |
| **R1** | both | reject | Declared Privacy + Terms URLs (`/privacy`, `/terms`, no extension) don't resolve — no `cleanUrls`, catch-all SPA rewrite serves `index.html` not the policy. Static files are `privacy.html`/`terms.html`. Reviewer sees the app, not a policy → Apple 5.1.1(i) + Play privacy-policy reject. | Add `"cleanUrls": true` to `firebase.json` OR explicit rewrites `/privacy→/privacy.html`, `/terms→/terms.html` ABOVE the catch-all; re-test exact declared URLs incognito before entering in consoles. | arbor-release | ✅ yes |
| **R2** | both | reject | Support URL `https://arborparentingapp.com/support` does not exist (no page/file); hits the same catch-all. Apple + Play both require a working support URL. (M3 flagged as unverified.) | Create `app/public/support.html` (or a real route) + hosting rewrite so `/support` resolves; verify live URL pre-submission. | arbor-release + arbor-content | ✅ yes |
| **R3** | both | reject | No in-app link to the privacy policy. Repo-wide search of `app/src` found zero refs to `privacy.html`/`/privacy`/the domain. Settings "Data & privacy" row only opens the child profile editor (`SettingsModal.tsx:169-174`). M2 A6 "confirmed" was wrong. Apple 5.1.1 + Play (Designed for Families) require it. | Add a visible in-app link to the live privacy policy (+ terms) from Settings and from the account-creation/consent surface; use the URL that resolves after R1. | arbor-native | ✅ yes |
| **R4** | both | reject | No native IAP. In-app subscriptions redirect to a hosted web checkout (`useCheckout.ts:22` `window.location.href` → `billingCheckoutUrl`); no StoreKit/Play Billing client in deps; no `isNativePlatform` branch. → Apple 3.1.1 + Play Payments violation. (M2 BLOCKER A5/G6.) | Add RevenueCat native SDK (`@revenuecat/purchases-capacitor`); branch on `runtime.isNativePlatform`: iOS→StoreKit, Android→Play Billing, web→keep hosted link. Webhook→entitlement side already exists (`server/billing.ts:160-199`). | arbor-native + arbor-release | ✅ yes |
| **R5** | both | reject | No parental gate before purchases or external links. Paywall calls `startCheckout` directly (`PaywallModal.tsx:46-51`); ungated `window.open` (`BehaviorsTab.tsx:200`, `reportExport.ts:115`). No gate component exists. → Apple Kids 1.3 + Play Designed-for-Families reject. (M2 A3/A4/G7.) | One reusable parental-gate component (dynamic math / timed long-press); wrap `startCheckout`, `openPortal`, and every `window.open`/`location.href` exit. | arbor-native | ✅ yes |
| **R6** | both | reject | No full account-deletion path. Only per-child erase exists (`childData.ts:95-119`, `eraseEverything`). No action deletes the Firebase Auth user + email + entitlements; no web deletion URL. Apple requires in-app account deletion; Play requires in-app + web route. (M2 A9/G8.) | In-app "Delete account" that loops erase across children, deletes the Auth user, clears `entitlements/{uid}`; + a web-accessible deletion-request URL. Verify receipt path still works. | arbor-native + arbor-release | ✅ yes |
| **R7** | both | reject | Practice Studio "predict the whole day" + "sessions feed back into the record / the coach can see what they practiced" — an unsubstantiated behavioral-prediction claim (Rhythm) and an unverified intervention-loop claim (FR-10), in BOTH stores + EN/HE. → Apple 2.3.1 "doesn't perform as advertised" + clinical-claim class the board vetoes. (M3 deployment gate + Verifier-2 blockers.) | **(a) Rhythm:** replace "predict(s) the whole day / ליום שלם" with anticipate/reflect-back scoped to the child's OWN logged data. **(b) Practice Studio:** until FR-10 verified live, strip the feedback-loop clause; use fallback "child-facing speech, language, and social-emotional games." **(c) HE promo:** match EN claim ceiling — drop "יודעת עליו הכל", use "על מי מדובר"; only list "שפה" if FR-10 verified; fix typo "לאמר"→"לומר". Apply Apple+Play, EN+HE. | arbor-content + arbor-localization (arbor-safety/clinical veto) | ✅ yes |
| **R8** | both | reject (config) | Bundle id is still the placeholder `app.arbor.family` across `capacitor.config.ts:18`, iOS `project.pbxproj` (Debug+Release), Android `build.gradle:7`, `strings.xml`. Cannot create listings or upload builds against an unfinalized id. (M1 F-1.) | **Lock final bundle id (G-A, Guy).** Then update all four locations + Appfile; rebuild; confirm CI `IOS_BUNDLE_ID` var. | arbor-native | ⛔ **G-A (Guy)** |
| **R9** | both | reject (config) | Android signing not wired. `android.yml` references the 4 keystore secrets only in a comment — no decode step, no signing step; `release` buildType has no `signingConfig`. Unsigned AABs are rejected by Play. (M7 GAP-1.) | Write the keystore-decode + sign steps into `android.yml` now (account-free; mirrors iOS pattern — unsigned when secrets absent, signed when present). Keys themselves come at G-B. | arbor-release | ✅ yes (code) / keys = G-B |
| **R10** | google | risk | Android permissions vs features mismatch. Manifest declares only `INTERNET` (`AndroidManifest.xml:34`) — no CAMERA/RECORD_AUDIO/READ_MEDIA_IMAGES — yet avatar (camera/photo) + speech (mic) ship and iOS declares all three. Either Android features break at runtime or a transitive merge adds undisclosed perms; reviewers cross-check against Data Safety. (M1 F-3.) | Decide which media features ship on Android. If they ship: declare CAMERA + RECORD_AUDIO (+ READ_MEDIA_IMAGES) and reflect in Data Safety. If not: gate them off on Android, keep manifest minimal. Resolve before locking Data Safety. | arbor-native | ✅ yes |
| **R11** | google | risk | Data Safety "Shared = Yes" likely wrong. M4 marks Photos + Voice/Audio Shared=Yes (processor: Google GenAI). Google's "Shared" means transfer to a THIRD PARTY and excludes processors acting on your behalf. Over-declaring can trigger a Data Safety mismatch review and is inconsistent with the Apple form. | Re-evaluate each "Shared" answer against Google's processor exclusion. If Google Cloud/GenAI are contracted processors (DPA in `privacy.html:103-106`), "Shared" should generally be No, with processing disclosed under collection/purpose. Align Apple + Google + code. | arbor-safety | ✅ yes |
| **R12** | both | risk | Data-controller identity/contact anonymous + off-domain. `privacy.html` names controller only as "Arbor (we, us)", no legal entity/address; contact `privacy@arbor.family` ≠ product domain `arborparentingapp.com`. For a children's-data GDPR controller this is a trust/credibility flag and weakens the COPPA/GDPR-Art.8 posture. | Name the actual legal controller entity + address in `privacy.html`; use a contact at the verified product domain (or confirm `arbor.family` is controlled/reachable). Align email across listing, policy, in-app link. | arbor-safety + arbor-content (Guy = legal entity) | ⚠️ mostly (legal entity name may need Guy) |
| **R13** | apple | minor | `ITSAppUsesNonExemptEncryption` absent from `Info.plist`. Omission causes a submission-time prompt / processing delay. (M1 F-2.) | Add `<key>ITSAppUsesNonExemptEncryption</key><false/>` (standard HTTPS only, no custom crypto). | arbor-native | ✅ yes |
| **R14** | both | minor | Icon art unverified — Android vector drawables (`ic_launcher_background.xml` teal grid, `ic_launcher_foreground.xml` robot) are confirmed Capacitor/Android defaults; iOS `AppIcon-512@2x.png` + Android mipmap PNGs unconfirmed as Arbor art. (M1 F-4.) | Visually confirm; regenerate with Arbor SVG sources via `npx @capacitor/assets generate`; re-run `cap sync`. | arbor-creative + arbor-native | ✅ yes |
| **R15** | both | minor | CI has no build-number auto-increment — each upload needs a unique monotonic build number. (M1 F-5.) | Add `agvtool new-version -all $GITHUB_RUN_NUMBER` to `ios.yml`; `-PversionCode=$GITHUB_RUN_NUMBER` to `android.yml`. | arbor-release | ✅ yes |
| **R16** | apple | minor | `UIRequiredDeviceCapabilities` contains `armv7` (Capacitor default; Apple ignores on 64-bit but unclean). (M1 NOTE.) | Remove the array or set to `arm64`. Optional cleanliness. | arbor-native | ✅ yes |
| **M8** | both | risk (ops) | Prod `arbor-api` Cloud Run image currency unknown — native CORS origins (`env.ts:103-104`) are code-correct but the live image may predate them; native calls would CORS-fail. (M7/M8.) | Schedule the gated `cloudbuild.prod.yaml` redeploy (Level 3, coordinate with any active hosting session) BEFORE any TestFlight/Play-internal test against prod. | arbor-release | ⚠️ deploy-gated (no paid account, but Level-3 Guy confirm) |

**Count:** 8 reject-class (R1–R7 account-free + R8 = G-A; R9 code is account-free) · 4 risk · 4 minor + 1 ops.
**Account-free reject-class fixes the mesh can land now: R1, R2, R3, R4, R5, R6, R7, R9(code) = 7 distinct work items** (R8 is the only reject that is purely a Guy gate).

---

## HANDOFF FOR GUY (exact order)

**Everything except these two gates is READY for the mesh to execute account-free.** Do the account-free fix list first (R1–R7, R9-code, plus risk/minor), THEN:

1. **[G-A] Lock the bundle/package id + store name.** Decide the final reverse-DNS id (replacing placeholder `app.arbor.family`) and confirm app name "Arbor". → unblocks R8 (mesh updates 4 files + Appfile + CI var) and is the key every listing/signing artifact derives from. **This is the first thing to unblock.**

2. **[G-B] Enroll paid accounts + create app records + hand over keys** (after the account-free fixes are green):
   - **Apple** ($99/yr): enroll → App Store Connect → create API key (App Manager) + download `.p8` → create app record with the G-A bundle id. Then set repo **secrets** `ASC_KEY_ID`, `ASC_ISSUER_ID`, `ASC_KEY_CONTENT` (base64 `.p8`) + repo **variable** `IOS_BUNDLE_ID`.
   - **Google** ($25 one-time): Play Console → create app → enable Play App Signing. Generate upload keystore (`keytool`), then set repo **secrets** `ANDROID_KEYSTORE_BASE64`, `ANDROID_KEYSTORE_PASSWORD`, `ANDROID_KEY_ALIAS`, `ANDROID_KEY_PASSWORD` (R9 code must be merged first so they're consumed).
   - **One Guy data point for R12:** the legal controller entity name + address for `privacy.html` (can run in parallel with G-A).

3. **[Gated deploy, M8] Approve the `cloudbuild.prod.yaml` redeploy** (Level 3) before the first native-vs-prod test, coordinating with any active hosting session.

After G-A + R8 land and G-B keys arrive: trigger iOS workflow → signed IPA to TestFlight; trigger Android workflow → signed AAB to Play internal track. Submission is then hours away, not weeks.

---

## WHAT'S VERIFIED READY (the green, so this is honest not alarmist)

- **Data / consent / privacy plane — strong and code-confirmed by both verifiers:** first-party analytics only (no third-party ad/analytics SDK), fail-closed COPPA/GDPR-K consent gate (`requireConsent` returns 451), child PII redacted before any model call, AI-training off by default, real GDPR export + per-child erase with receipt, EU storage (europe-west4). **arbor-safety: no veto on child-data/consent/privacy grounds.**
- **Both CI pipelines green-structured** (M1 §5): iOS `ios.yml` (Capacitor-8/Xcode-26/Swift-6.2 build fix in place; signed Fastlane path + unsigned fallback) and Android `android.yml` (release AAB build) are internally consistent; iOS signing wired to consume G-B secrets.
- **Native ↔ backend code is correct** (M8): CORS appends `capacitor://localhost` + `https://localhost`; runtime re-points `/api/*` at prod. (Only the live-image currency is unverified — see M8 row.)
- **Listing metadata pack is largely clean** (M3): app name, subtitle, short desc, keywords, categories, six-surface positioning, privacy copy, and all 8 Arbor-Bar brand gates pass EN+HE — **except the 3 claims in R7**, which are the only copy blockers.
- **Age ratings settled** (M5): Apple 4+ (Kids band 6–8), Google IARC 3+ / PEGI 3; only the IAP declaration flag, which doesn't raise the rating.
- **Privacy-label answers drafted** (M4) — submittable verbatim once R11 ("Shared") is corrected for Google.
- **Splash/status-bar/version config, icons-on-disk, iOS Info.plist usage strings** all PASS (M1).

---

## 8-LINE EXECUTIVE SUMMARY

1. **Apple: NO-GO** — 6 account-free reject-class fixes stand even with both Guy gates closed (fix-list-blocked, not just gate-blocked).
2. **Google: NO-GO** — same 6 + Android signing wiring (R9) + 2 Android risks; all account-free except the final keystore upload.
3. **Account-free fixes remaining:** 7 reject-class work items (R1–R7, R9-code) + 4 risk + 4 minor + 1 gated deploy — the mesh can land all of them now.
4. **The data/consent/privacy plane is genuinely strong and code-verified** — no safety veto; the failures are all store-facing (URLs, IAP, gate, deletion, claims), not child-data.
5. **Single highest rejection risk:** native IAP missing (R4) — web checkout inside the binary is an automatic Apple 3.1.1 + Play Payments rejection; tied closely by the dead Privacy/Support URLs (R1/R2).
6. **G-A and G-B are NOT the long pole** — closing them today still yields instant double rejection; the engineering/copy fix list is the real gate.
7. **What unblocks first submission:** land R1–R7 + R9 account-free → Guy locks bundle id (G-A) → Guy opens paid accounts + hands keys (G-B) → approve the M8 prod redeploy → CI ships signed IPA/AAB to TestFlight/internal track.
8. **Then submission is hours away** — listing, ratings, privacy labels, and CI are all verified-ready behind the two gates.
