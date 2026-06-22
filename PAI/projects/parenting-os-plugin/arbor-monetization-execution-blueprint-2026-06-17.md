# Arbor — Monetization Execution Blueprint (priority-ordered, conflict-aware)

**Date:** 2026-06-17 · **Goal:** start charging this month, web-first, native in parallel, without clobbering shared files.
**Source:** synthesized from this session's shipped work (MON-1/MON-2/ADM-1) + the 25 distinct missions surfaced by the mapping workflow (the 105 "missions" were cross-surface duplicates). The workflow's verify/synthesis stages were cut off by an account rate limit; this blueprint replaces them.

> **The headline:** the web subscription path is already built and tested. It is blocked on **external RevenueCat config, not code.** Do Wave 0 today and you can take money this week. Everything below Wave 1 is completeness/hardening/native, not a revenue blocker.

---

## Wave 0 — Unblock revenue (TODAY, external config, no code) 🔴 START HERE

The shipped code self-activates the instant these exist. No deploy needed beyond setting env.

1. **RevenueCat project** → create products `arbor_plus_monthly` (€12.99), `arbor_plus_annual` (€119), `arbor_family_monthly` (€19.99), `arbor_family_annual` (€189); attach a **7-day trial**; entitlement ids containing `plus` / `family` (the webhook maps on those substrings).
2. **RevenueCat Web Billing** → create the hosted checkout links; point the **webhook** at `https://<prod>/webhooks/billing/revenuecat`.
3. **Cloud Run env** (staging first): `REVENUECAT_WEBHOOK_AUTH`, `BILLING_URL_{PLUS,FAMILY}_{MONTHLY,ANNUAL}`, `BILLING_MANAGE_URL`, `ARBOR_ADMIN_EMAILS=bguy.rubin@gmail.com`, `ENFORCE_ENTITLEMENTS=true`, and **remove yourself from `ARBOR_PLUS_EMAILS`** so you can see real Free/Plus/Family states.

**Done = a test card on the staging web app upgrades you to Plus and the Account panel shows "renews …".** That is first-revenue-ready.

---

## Wave 1 — Web code gaps (small; I build; SERIALIZE — shared files) 🟠

Not blockers for taking the first euro on Plus, but required for a *complete, trustworthy* web launch. All three touch overlapping hot files → do on **one branch, sequentially** (see matrix).

| # | Mission | Why | Deploy | Touches (hot files) |
|---|---|---|---|---|
| 1.1 | **Paywall interceptor** — when a Free user hits the 402 coach limit, surface the upgrade CTA → checkout inline (not just in Settings) | Converts at the moment of intent | client | `lib/api.ts`, coach UI, `lib/i18n.ts` |
| 1.2 | **Co-parent seat enforcement** — Family ≠ Plus today *only* by a limit number; actually gate the co-parent invite on `coParentSeats` | Makes Family a real, defensible tier | server+client | `families/*`, `routes/api.ts`, `firestore.rules`, `lib/i18n.ts` |
| 1.3 | **Webhook idempotency + graceful billing errors** — dedupe RevenueCat event resends; friendly client copy on 503 | Prevents double-writes / ugly errors | server+client | `server/billing.ts`, `lib/api.ts`, `lib/i18n.ts` |

---

## Wave 2 — Launch readiness (after Wave 1; some parallel) 🟡

- **Firestore rules** for `entitlements` / `usageRollup` stay server-only (verify, tighten) — `firestore.rules`.
- **Post-checkout entitlement refresh** — on return from checkout, force `refreshEntitlement()` so the UI flips without reload — `hooks/useEntitlement.ts`, client.
- **Entitlements backfill** — write `{plan}` for existing beta users before flipping enforcement in prod (one-off script) — *no app file*.
- **Remove beta mode** in prod env; **transactional receipt email** (config/lightweight server).
- **Friendly Firebase auth errors** (handoff P0.1) — `LoginScreen.tsx`.

---

## Wave 3 — Track M: native iOS/iPad + Play (PARALLEL worktree, longer) 🟢

Fully isolatable — lives in `ios/` `android/` + native SDK config, **disjoint from web files** → safe in its own git worktree alongside Waves 1–2.
Capacitor wrap → RevenueCat SDK (keyed to Firebase uid) → store products → restore-purchases → App Store Server Notifications + Play RTDN (RC handles) → **compliance** (privacy policy, account deletion, price display, subscription terms near buy button, Data Safety) → submit for review (budget 1–2 rejection cycles).

---

## Wave 4 — Observability & lifecycle (parallel, new files = low conflict) 🔵

BigQuery sink + Looker for historical token cost · RevenueCat API into the admin dashboard (real MRR) · conversion funnel + churn analytics · billing-webhook failure alerting · win-back / dunning. Mostly new files and infra → safe to run parallel.

---

## Shared-file contention matrix (the anti-clobber map)

| Hot file | Missions that touch it | Rule |
|---|---|---|
| **`app/src/lib/i18n.ts`** | 1.1, 1.2, 1.3, 2 (auth errors), 3 (compliance copy) | **Highest contention.** Append-only at end of each locale block; never two missions editing it concurrently. |
| **`app/src/routes/api.ts`** (the API spine) | 1.2, 1.3, 2 (refresh), 4 (admin) | Append new routes at end; serialize anything editing existing handlers. |
| **`app/src/lib/api.ts`** | 1.1, 1.3, 3 (native bridge), 4 | Append to the `api` object; low risk if append-only. |
| **`app/src/server/billing.ts`** | 1.3, 3 (store notifications), 4 (reconciliation) | Serialize 1.3 before native billing work. |
| **`app/src/server/entitlements.ts`** | 1.2 (seat logic), reconciliation | Single owner per change. |
| **`firestore.rules`** | 1.2, 2 | Serialize. |
| **`config/env.ts`, `.env.example`, `SettingsModal.tsx`** | multiple | Append-only / low risk. |
| **`ios/`, `android/`, compliance pages, BigQuery/Looker** | Wave 3 / Wave 4 | **Disjoint — safe in parallel worktrees.** |

**Isolation plan:** Wave 1 on one branch, missions done **in order** (1.1 → 1.2 → 1.3) to avoid i18n/api collisions. Wave 3 (native) and Wave 4 (observability) run in **separate worktrees in parallel** — they don't touch the web hot files.

---

## The single first move

**Set up RevenueCat + the Cloud Run env vars (Wave 0).** The code is done; this is what turns it on. Until those exist, `/api/billing/checkout` returns 503 and nothing can charge — and no amount of further building changes that.
