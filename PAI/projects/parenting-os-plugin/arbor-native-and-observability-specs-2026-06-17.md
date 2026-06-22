# Arbor — Native (Track M) + Observability: verified build-ready specs

**Date:** 2026-06-17 · **Source:** workflow `wf_eba6f66d-aa2` (6 agents, spec → adversarial verify). Replaces guesswork with repo-grounded, verified specs for the external-dependent monetization work. Two of three verdicts "sound", one "needs_changes" (fixes folded in below).

> **Key finding (verified):** native iOS/iPad + Play billing needs **no new server code.** `server/billing.ts` already maps `APP_STORE`/`PLAY_STORE` → provider and keys on the Firebase uid; an App Store/Play purchase fires the *same* `/webhooks/billing/revenuecat` → writes `entitlements/{uid}` → gates the app. Native work is client + store config only.

---

## Already done this session (prerequisites, web-safe, committed)
- **`SettingsModal` → `useCheckout` refactor**: removed its duplicate web-only checkout/portal path. Both verdicts flagged this as a real App-Store-rejection risk — on native, that path would have linked out to web Stripe. Now Settings + PaywallModal share one hook, so the native branch (below) applies in one place.
- **`ai.usage` `event` field**: added a stable `event:"ai.usage"` discriminator for the BigQuery sink filter.
- **BigQuery cost analytics**: build-ready runbook `docs/observability-bigquery.md` + views `docs/sql/ai_usage_cost.sql` (rates kept in sync with `server/admin.ts`).

---

## Spec A — RevenueCat Capacitor SDK (native purchases) · verdict: SOUND (0.86)

Route in-app upgrades through StoreKit/Play via RevenueCat; web unchanged.

**Code (the only changes needed):**
- `app/package.json`: add `@revenuecat/purchases-capacitor` — **pin the version whose peer Capacitor major == 8** (repo is `@capacitor/core ^8.4.0`); `npm install` + `npx cap sync`.
- `app/src/lib/nativeBilling.ts` (new): dynamic-import + no-op-on-web (mirror `lib/native.ts`). Export `configureRevenueCat(uid)` (`Purchases.configure({ apiKey, appUserID: uid })`, public SDK key from `VITE_RC_IOS_KEY`/`VITE_RC_ANDROID_KEY`), `purchaseNativePlan(plan, cadence)` (offerings → `purchasePackage`; map userCancelled → `{cancelled:true}`), `restoreNativePurchases()`, `logOutRevenueCat()`.
- `app/src/context/AuthContext.tsx`: configure/`logIn(uid)` on auth-resolved uid change, `logOut()` on signOut. **Must be here, not `native.ts`/`main.tsx`** (verifier: `initNativeShell` runs before auth resolves → would key to an anonymous RC id).
- `app/src/hooks/useCheckout.ts`: `if (isNativePlatform)` → `purchaseNativePlan` then `refreshEntitlement()` (also trust the returned `customerInfo` for immediate UI to beat webhook lag); else the existing web path. `openPortal` on native → App Store/Play manage deep links, not the Stripe portal.
- Tests: `nativeBilling.test.ts` (mock the plugin); `useCheckout` native-branch test; existing `billing.test.ts` must stay green unchanged (proves the webhook already covers native).

**Risks:** version skew vs Capacitor 8; keep public SDK keys separate from `REVENUECAT_WEBHOOK_AUTH` (server secret); webhook race after purchase; iOS build needs a Mac.

---

## Spec B — Store config (App Store Connect / Play / RevenueCat) · verdict: NEEDS_CHANGES (fixes folded in)

Mostly **external console config**; the only code is Spec A. Verifier corrections applied: (1) include the `SettingsModal` refactor (done); (2) RC init in `AuthContext`, not `native.ts`.

**Naming contract (load-bearing — `planFromRevenueCat` substring-matches):** product ids `arbor_plus_monthly/annual`, `arbor_family_monthly/annual`; RC entitlement ids `plus` and `family`. Offering `default` with packages mapping plus/family × monthly/annual.

**External steps:** register the real bundle id in `capacitor.config.ts` (replace placeholder `app.arbor.family`) **before** any store listing (immutable after); create the 4 subscriptions in App Store Connect + matching Play base plans; add a **7-day free-trial intro offer** per product; set local prices at parity with web; wire App Store Server Notifications V2 + Play RTDN into RevenueCat (RC ingests, emits the same outbound webhook — already pointed at prod with `REVENUECAT_WEBHOOK_AUTH`).

---

## Spec C — RevenueCat live revenue + BigQuery cost · verdict: SOUND (0.82)

**Part 1 — RC revenue in admin (code, graceful-degrading):**
- `config/env.ts`: add `revenueCatApiKey?` (`REVENUECAT_API_KEY`, a v2 `sk_…`) + `revenueCatProjectId?` (`REVENUECAT_PROJECT_ID`) + `revenueCatConfigured()`. **Separate from `REVENUECAT_WEBHOOK_AUTH`.**
- `app/src/server/revenuecat.ts` (new): thin REST client (global `fetch`, `AbortSignal.timeout(4000)`, returns `null` on any error → fall back). `metrics()` → active subs / trials / MRR (+currency) / 28d revenue / churn.
- `adminMetrics.ts`: add optional `revenue` to `AdminOverview`, fold into the `Promise.all`; Null store returns `revenue:null`. `lib/api.ts`: mirror the optional field (hand-written literal — client must not import server types). `AdminDashboard.tsx`: render a "Revenue (RevenueCat)" card when present, else a "connect for live MRR" note.
- **⚠ Verify before trusting numbers:** the RC **v2 Overview Metrics** endpoint path + exact metric ids/units + churn availability are account/API-version dependent — isolate path+parse in `revenuecat.ts` (one-file fix). Surface `mrrCurrency` (RC reports the project's display currency, not necessarily EUR). Use Secret Manager (`--update-secrets`), **not** plaintext `--set-env-vars`, for the key.

**Part 2 — BigQuery cost (infra/docs):** DONE as `docs/observability-bigquery.md` + `docs/sql/ai_usage_cost.sql`. Operator runs the gcloud/bq commands; no backfill (starts at sink creation).

---

## What's blocked on Guy (Wave 0 — accounts/secrets I cannot create)
RevenueCat / Apple Developer ($99) / Google Play ($25) signup; public SDK keys + the `sk_…` API key; Cloud Run env/Secret Manager; a Mac for iOS builds. These gate Specs A/B/C-Part-1 from *functioning* — the code/specs are ready to drop in once they exist.
