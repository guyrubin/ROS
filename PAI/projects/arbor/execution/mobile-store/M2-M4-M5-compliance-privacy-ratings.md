# M2 / M4 / M5 — Kids/Families Compliance, Privacy Labels, Age Ratings

**Product:** Arbor — parenting intelligence, ages 0–12. Parent-owned record; six surfaces (Daily Play, Rhythm, Ask Arbor, Practice Studio, Arbor Care, Child Memory). EU storage (Google Cloud europe-west4). COPPA / GDPR-K, parent-managed consent. NOT therapy/medical/diagnosis.
**Owner:** arbor-safety (veto) + arbor-native · **Date:** 2026-06-23 · **Status:** READY-WITH-GAPS (3 blocking code/config gaps before review)
**Evidence base:** `PPPPtherapy-/PPPPtherapy-/app/` — all citations are `path:line` in that repo. READ-ONLY pass; nothing committed.

> **Compliance verdict in one breath:** The *data* posture is strong (no third-party ad/analytics SDK, first-party telemetry only, server-enforced consent gates, real GDPR export+erase, EU storage). The *commerce* posture fails store review as built: in-app subscriptions redirect to a **web purchase URL with no native IAP path** — an automatic Apple 3.1.1 rejection and a Google Play Payments violation. Plus there is **no parental gate** in front of purchases/external links, which Kids/Families programs require. Fix those before first submission.

---

## M2 — Kids / Families Compliance Checklist

### Apple App Store — Kids Category (Guideline 1.3 + 5.1.4)

| # | Requirement | Comply | Evidence (file:line) | Fix if GAP |
|--|--|--|--|--|
| A1 | **No third-party behavioral advertising / no third-party analytics in Kids apps** | ✅ Y | No ad/analytics SDK in deps (`app/package.json:18-66`); telemetry is first-party only — writes to the user's own Firestore subcollection, "no third-party scripts, no cross-site tracking" (`src/lib/analytics.ts:4-8,35-37`); attribution is client-side only (`src/lib/attribution.ts:11-13`) | — |
| A2 | **No behavioral data collection from children for ads** | ✅ Y | App is parent-operated; child data entered by the adult (`app/public/privacy.html:78-79`); no IDFA/ad SDK present (`package.json:18-66`) | — |
| A3 | **Parental gate before purchases (Plus/Family upgrade)** | ❌ GAP | Paywall buttons call `startCheckout` directly with no gate (`src/components/billing/PaywallModal.tsx:46-51`; `src/hooks/useCheckout.ts:17-28`); no gate component exists (repo-wide search for ParentalGate/age-verify returns none) | Add an Apple-compliant parental gate (e.g. dynamic math/long-press) in front of `startCheckout`, `openPortal`, and every external link |
| A4 | **Parental gate before links that leave the app / external commerce** | ❌ GAP | External links opened ungated: `window.open(...,"_blank")` (`src/components/tabs/BehaviorsTab.tsx:200`; `src/lib/reportExport.ts:115`); checkout redirect `window.location.href = url` (`useCheckout.ts:22,35`) | Gate all of the above behind the parental gate from A3 |
| A5 | **In-app purchases use Apple IAP (no external payment for digital goods)** | ❌ GAP (BLOCKER) | Checkout always redirects to a hosted web purchase URL (RevenueCat Web Link / Stripe) — `billingCheckoutUrl` (`src/server/billing.ts:225-258`) consumed by `useCheckout.ts:22` with `window.location.href`; **no native StoreKit/Purchases SDK** (`package.json:18-66`) and **no platform branch** (`src/lib/runtime.ts:17-18` exposes `isNativePlatform` but checkout never reads it) | Integrate RevenueCat native SDK (or `@revenuecat/purchases-capacitor`) and branch: on iOS use StoreKit IAP, web keeps the hosted link. RC webhook→entitlement plumbing already exists (`billing.ts:160-199`) so only the buy-side SDK is missing |
| A6 | **Privacy policy link present + reachable** | ✅ Y | Live page `app/public/privacy.html`; linked from terms footer (`privacy.html:124`); contact `privacy@arbor.family` (`privacy.html:121`) | Confirm the in-app Settings surface links to it (Settings routes data/privacy to the profile editor — `src/components/layout/SettingsModal.tsx:169`) |
| A7 | **Approved/restricted SDKs only (no disallowed trackers)** | ✅ Y | Deps are Capacitor core + Firebase + Google GenAI/Vertex + React/UI libs (`package.json:18-66`) — no ad-network/MMP/social-login-tracker SDK | — |
| A8 | **Discloses data collected from/about children; consent governs sensitive media** | ✅ Y | "What we collect" + children's-data section (`privacy.html:67-79`); face/voice each require separate, time-boxed, revocable consent server-enforced — `requireConsent` returns 451 fail-closed (`src/server/requireConsent.ts:17-36`); consent ledger (`src/sharing/consent.ts:20-65`); gated avatar/ASR endpoints (`src/routes/api.ts:782,835`) | — |
| A9 | **Account-deletion path in-app (App Store account-deletion requirement)** | ⚠️ PARTIAL | Per-child real server erasure + receipt: `/privacy/erase` hard-deletes memory ledger, shares, consents (`src/routes/api.ts:1739-1756`); client wrappers `deleteChildData` / `eraseEverything` (`src/lib/childData.ts:95-119`). **But no single "delete my account" action** that removes the Firebase Auth user + email | Add an in-app "Delete account" that loops erase over all children, deletes the auth user, and clears `entitlements/{uid}`. Apple requires account deletion, not just data deletion |
| A10 | **No "diagnosis/medical-device" claims (kids health positioning)** | ✅ Y | Privacy framing is "non-diagnostic guidance" (`privacy.html:65`); ASR prompt explicitly "play, not a clinical assessment" (`src/server/childAsr.ts:108`) | Keep clinical-claim veto on listing copy (M3 already flags this) |

### Google Play — Designed for Families / Teacher Approved + Data Safety

| # | Requirement | Comply | Evidence (file:line) | Fix if GAP |
|--|--|--|--|--|
| G1 | **No interest-based ads / no ad SDK in a Families app** | ✅ Y | No ads SDK (`package.json:18-66`); first-party analytics only (`src/lib/analytics.ts:4-8`) | — |
| G2 | **No Advertising ID; AD_ID permission absent** | ✅ Y | AndroidManifest declares only `INTERNET` — no `com.google.android.gms.permission.AD_ID`, no GMS ads (`android/app/src/main/AndroidManifest.xml:34`) | Keep manifest minimal; if any dep later injects AD_ID, add `tools:node="remove"` |
| G3 | **Only families-approved SDKs (self-certified SDK list)** | ✅ Y | Firebase + Google GenAI/Vertex + Capacitor only (`package.json:18-66`); all Google-self-cert-friendly | When RevenueCat SDK is added (A5/G6), confirm its Families self-certification |
| G4 | **Privacy policy declared in Console + in-app** | ✅ Y | `app/public/privacy.html`; EU storage + no-sale + training-off stated (`privacy.html:46,108-109`) | Paste URL into Play Console listing |
| G5 | **Data Safety form matches actual collection** | ✅ Y (see M4) | Collection set verified in code (account/child/observations/optional media/diagnostics) — `privacy.html:67-75` cross-checked against `src/` | Submit M4 table verbatim |
| G6 | **Play Billing for in-app digital subscriptions (no external checkout)** | ❌ GAP (BLOCKER) | Same web-redirect issue as A5 — `useCheckout.ts:22` → hosted URL; no Play Billing client (`package.json`) | Use RevenueCat → Google Play Billing on Android; web keeps hosted link |
| G7 | **Parental controls / gate for purchases + external links** | ❌ GAP | No gate (see A3/A4) | Same fix as A3/A4 |
| G8 | **In-app account & data deletion + web deletion route** | ⚠️ PARTIAL | Per-child erase exists (`api.ts:1739-1756`); no full-account deletion (see A9) | Add full-account deletion in-app AND a web-accessible deletion request URL (Play requires both) |

### Ordered GAP list — code/config to land before review

1. **[BLOCKER] Native IAP** — add RevenueCat native SDK; branch checkout on `isNativePlatform` (`src/lib/runtime.ts:17`): iOS→StoreKit, Android→Play Billing, web→existing hosted link (`useCheckout.ts:17-28`, `PaywallModal.tsx:46-51`). Entitlement webhook side already done (`server/billing.ts`).
2. **[BLOCKER] Parental gate** — one reusable gate component; wrap `startCheckout`, `openPortal`, all `window.open`/`location.href` exits (`useCheckout.ts:22,35`; `BehaviorsTab.tsx:200`; `reportExport.ts:115`).
3. **[BLOCKER] Full account deletion** — in-app "Delete account" (erase all children + delete auth user + clear entitlements) and a web deletion URL; extend the per-child path in `src/lib/childData.ts:109-119`.
4. **[Config] Settings → Privacy link** — confirm the in-app data/privacy entry (`SettingsModal.tsx:169`) surfaces the policy URL and the deletion action prominently.
5. **[Config] Lock bundle id** before any listing (`capacitor.config.ts:18` placeholder `app.arbor.family`) — also G-A in the goal doc.
6. **[Config] /support URL** live before Support URL entry (already flagged in M3).

---

## M4 — Privacy Nutrition Labels

**Universal facts (apply to every row):** Used for tracking = **NO** for all types (no third-party ad/analytics SDK — `package.json:18-66`, `analytics.ts:4-8`). Data shared/sold = **NO** for advertising; processors only (Google Cloud/Firebase + Google GenAI as contracted processors — `privacy.html:100-106`). Encryption in transit = **YES** (HTTPS; native origins over TLS — `privacy.html:115`). Deletion = in-app per-child erase + GDPR endpoints (`api.ts:1739-1756`, `childData.ts:95-119`); full-account deletion pending Gap #3.

### Apple — App Privacy ("Data Used to Track You" = **None**)

| Data type | Collected | Linked to user | Used for tracking | Purpose |
|--|--|--|--|--|
| Email address | Yes | Yes | **No** | App Functionality (account/auth) — `privacy.html:70` |
| User ID (auth uid) | Yes | Yes | **No** | App Functionality — `analytics.ts:34-37` |
| Name (child first name/nickname) | Yes | Yes | **No** | App Functionality; redacted before any model call (`server/redaction.ts:14,45-52`) |
| Sensitive info (child observations/milestones/behavior notes) | Yes | Yes | **No** | App Functionality (the core record) — `privacy.html:72`, `childData.ts:7-19` |
| Photos (avatar reference photo) | Yes | Yes | **No** | App Functionality; explicit revocable consent, no face-recognition profile (`privacy.html:94-96`, gated `api.ts:835`) |
| Audio data (child speech, practice only) | Yes (transient) | Yes | **No** | App Functionality; forwarded for scoring, not persisted (`server/childAsr.ts:15-16`), consent-gated (`api.ts:782`) |
| Product interaction (feature-usage events) | Yes | Yes | **No** | Analytics + Product Personalization; first-party Firestore (`analytics.ts:35-37`) |
| Crash/Performance/Diagnostics | Yes | No (minimized) | **No** | App Functionality (`privacy.html:74`) |
| Other usage / marketing attribution (UTM/referral) | Yes | Yes | **No** | Analytics; client-side, no cross-site tracking (`attribution.ts:11-13`) |
| Coarse/precise location | No | — | — | Not collected (no location code/permission; manifest = INTERNET only, `AndroidManifest.xml:34`) |
| Contacts / Browsing history / Search history / Financial info | No | — | — | Not collected. Payment handled by store/RevenueCat off-device — Arbor stores no card data |

### Google — Data Safety

| Data type | Collected | Shared | Processed ephemerally | Required/Optional | Purpose | Encrypted in transit | User can request deletion |
|--|--|--|--|--|--|--|--|
| Email / User IDs | Yes | No | No | Required | Account management, App functionality | Yes | Yes (`api.ts:1739`) |
| Name (child) | Yes | No | No | Required | App functionality | Yes | Yes |
| Health & fitness / "Other personal info" (developmental observations) | Yes | No | No | Optional | App functionality | Yes | Yes (`childData.ts:95-119`) |
| Photos | Yes | Yes (processor: Google GenAI) | No | Optional | App functionality (avatar) | Yes | Yes |
| Voice/Audio (child speech) | Yes | Yes (processor) | **Yes (not stored)** | Optional | App functionality (pronunciation scoring) | Yes | N/A (not retained) — `childAsr.ts:15-16` |
| App interactions | Yes | No | No | Optional | Analytics, App functionality | Yes | Yes |
| Crash logs / Diagnostics | Yes | No | No | Optional | App functionality (minimized) | Yes | Yes |
| Approximate/precise location, Contacts, Financial info, Web browsing | No | — | — | — | Not collected | — | — |

**Data Safety top-level answers:** Collects data = Yes · Shares data = Yes (processors only, never for advertising) · All in-transit encrypted = Yes · Users can request deletion = Yes · Committed to Play Families Policy = Yes · Independent security review = No (state honestly).

---

## M5 — Age Ratings

### Apple — Age-Rating Questionnaire → expected **4+**

| Question | Answer |
|--|--|
| Cartoon/Fantasy Violence | None |
| Realistic Violence / Prolonged graphic violence | None |
| Sexual content / Nudity | None |
| Profanity / Crude humor | None (output safety screen + PII/profanity redaction — `src/safety/outputScreen.ts`, `server/redaction.ts`) |
| Alcohol, Tobacco, Drugs | None |
| Mature/Suggestive themes, Horror/Fear | None |
| Gambling (simulated or real) | None |
| Contests | None |
| Medical/Treatment information | **None** — non-diagnostic guidance only; explicitly not a clinical tool (`privacy.html:65`, `childAsr.ts:108`). Do NOT select "Medical/Treatment Info" (would imply a medical claim) |
| Unrestricted web access | **No** (external links go through a parental gate once Gap #2 lands; no in-app open browser) |
| User-generated content shared publicly | No (data is private to the parent's family record; sharing is explicit 1:1 to an authorized professional — `privacy.html:104`) |
| **Made for Kids / Kids Category** | **Yes** — submit under Kids 6–8 (or 0–5 band) once Gaps #1–3 land |

**Expected rating: 4+ (Kids Category band: 6–8 recommended).** No content descriptors trigger a higher rating.

### Google — IARC Content-Rating Questionnaire → expected **PEGI 3 / ESRB Everyone / IARC 3+**

| Question | Answer |
|--|--|
| Violence (any kind) | No |
| Fear / Horror | No |
| Sexual content / Nudity | No |
| Bad language | No (redaction + output screen) |
| Drugs / Alcohol / Tobacco / Gambling | No |
| Discrimination | No |
| Digital purchases (in-app) | **Yes** — declare IAP (subscriptions). Required even though spend is parent-gated |
| Shares user location | No |
| Shares personal info with third parties | No (processors only, never for ads) |
| User interaction / shares content with other users | No (private family record; explicit 1:1 professional share only) |
| Unrestricted internet access | No |
| Targets children / Designed for Families | **Yes** |

**Expected rating: IARC "3+" → PEGI 3 / ESRB Everyone / USK 0 / ClassInd L.** The only non-trivial flag is the IAP declaration, which does not raise the content rating but must be disclosed.

---

## arbor-safety VETO lens — review findings

- **No child-data-policy violation found in the data plane.** Consent is server-enforced and fail-closed (`requireConsent.ts:31-34`), child name + contact PII is redacted before any model call (`redaction.ts:45-52`), child audio is non-persisted (`childAsr.ts:15-16`), AI-training is off by default (`consent.ts:6-8,50-51`), and erasure is real and provable with a receipt (`api.ts:1739-1756`, `childData.ts:109-119`). EU storage stated (`privacy.html:108-109`). **No veto on safety/consent/privacy grounds.**
- **Conditional hold (commerce, not child-data):** shipping the web-redirect checkout into the native binaries (`useCheckout.ts:22`) would fail both store reviews and, on a Kids listing, is also a child-protection gap (ungated spend, ungated external links). Treat Gaps #1–3 as hard pre-submission blockers, not nice-to-haves.
- **Watch item:** keep the clinical-claim veto on store listing copy (M3) — the code is correctly non-diagnostic; the risk is marketing language drifting into a medical claim, which would also force a higher Apple age descriptor.

---

## 6-line summary

1. **Verdict:** Data/consent/privacy posture is store-ready and policy-clean; commerce + parental-control posture is NOT — READY-WITH-GAPS.
2. **Biggest rejection risk:** in-app subscriptions redirect to a web purchase URL with no native IAP (`useCheckout.ts:22`, `server/billing.ts:225`) — automatic Apple 3.1.1 + Google Play Payments rejection.
3. **Top fix #1:** add RevenueCat native SDK and branch checkout on `isNativePlatform` (iOS→StoreKit, Android→Play Billing, web→hosted link).
4. **Top fix #2:** add a parental gate in front of all purchases and external links (`PaywallModal.tsx`, `useCheckout.ts`, `BehaviorsTab.tsx:200`, `reportExport.ts:115`).
5. **Top fix #3:** add full in-app account deletion + a web deletion URL (per-child erase exists; account-level does not — `childData.ts:95-119`).
6. **arbor-safety:** no veto on child-data/consent/privacy; hard hold on submission until Gaps #1–3 land (ungated spend on a Kids app is also a child-protection gap).
