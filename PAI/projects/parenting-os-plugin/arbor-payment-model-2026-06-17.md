# Arbor — Payment Model & Monetization Build Spec

**Date:** 2026-06-17 · **Owner:** Guy · **Status:** Approved direction, ready to build
**Decision:** Launch **Free + Plus + Family** on **web (Stripe) AND native iOS/iPad + Google Play (store billing), both at full speed.** Web revenue starts this month; store revenue follows on app review.

---

## 1. The core problem, stated plainly

"I don't know which subscription I'm logged in under" is **not a bug — billing was never connected.** The entitlement *gating* is fully built; the *money* and *clarity* layers are missing.

| Layer | State today | What's missing |
| :--- | :--- | :--- |
| **Identity** (who you are) | ✅ Firebase Auth — Google + email/password | Account page that shows the signed-in identity |
| **Entitlement** (what you get) | ✅ Free vs Plus gating live in `app/src/server/entitlements.ts`, stored at `entitlements/{uid}` | A 3rd tier (`family`), status/renewal fields, a visible plan badge |
| **Billing** (how you pay) | ❌ Nothing. No Stripe, no Apple/Google billing | The whole thing — the "seam" is empty |
| **Packaging** (where it runs) | ⚠️ Pure web SPA (runs in Safari/Chrome everywhere) | Capacitor wrapper for App Store + Play |

**Why your own login shows no plan:** in beta the server runs `ENFORCE_ENTITLEMENTS=false`, which resolves **every** logged-in user to Plus (`entitlements.ts:104-106`), and you're likely also in the `ARBOR_PLUS_EMAILS` comp list. There is no subscription attached to your account because nothing has ever written one. The fix is this spec.

**The architectural win:** the code already self-gates the moment *anything* writes `{plan}` to `entitlements/{uid}`. We don't rebuild gating — we fill the seam from three billing sources and make the result visible.

---

## 2. Tiers & price points (launch)

Carried from `arbor-business-model-pricing-and-financials.md`. Value metric = **active child profile**.

| Tier | Price | Children | Coach (Ask Arbor) | Pro reports / handoff | Advanced plans |
| :--- | :--- | :---: | :--- | :---: | :---: |
| **Seedling** (Free) | €0 | 1 | 10 / day (metered) | ❌ | ❌ |
| **Arbor Plus** | **€12.99/mo** or **€119/yr** | up to 6 | Unlimited | ✅ | ✅ |
| **Arbor Family** | **€19.99/mo** or **€189/yr** | up to 6 + co-parent seat | Unlimited | ✅ | ✅ |

> **Plus vs Family** today differ only by the **co-parent seat** (shared access to the same children via the existing `families/{familyId}/members` model). That is the cleanest launch wedge — no new limit math, just "second adult on the account." We can widen the gap later (e.g. Family = more children, shared memory). Annual prices set ~10 months-for-12 to push annual (better cash + lower churn + lower store-fee frequency).

**7-day free trial on Plus & Family** — recommended (Apple/Google heavily reward trials; Stripe supports natively). Flag for your sign-off in §7.

---

## 3. Target architecture — one seam, three billing brains

```
                    ┌─────────────── BILLING SOURCES ───────────────┐
   Web checkout ──▶ │  Stripe (web)      Apple StoreKit 2 (iOS/iPad) │
   iOS purchase ──▶ │                    Google Play Billing (Android)│
   Android purchase │            ▲ unified by RevenueCat ▲           │
                    └───────────────────────┬───────────────────────┘
                                            │  ONE webhook per source
                                            ▼
                        Cloud Run: POST /api/billing/webhook
                        (verify signature → reconcile → write seam)
                                            │
                                            ▼
                     Firestore  entitlements/{uid}   ◀── the seam (exists)
                                            │
                                            ▼
              resolveEntitlement() → gates coach / children / reports / plans
                                            │
                                            ▼
                 useEntitlement() hook → Account page shows plan + renewal
```

**Recommended billing stack: RevenueCat as the single entitlement brain across all three platforms.**

- RevenueCat natively unifies **App Store + Google Play** and now offers **RevenueCat Web Billing (Stripe under the hood)**. One SDK, one webhook, one source of truth.
- **Killer benefit:** a user who subscribes on iPhone is recognized as Plus on the web and vice-versa — because RevenueCat keys entitlements to *your* app user ID (the Firebase `uid`), not to the store account. This is the cross-platform identity problem solved for us.
- Our `entitlements/{uid}` seam becomes the mirror of RevenueCat's entitlement, written by **one** webhook handler.

**Fallback / alternative (if you want full EU invoicing control on web):** Stripe **direct** for web (Checkout + Customer Portal + Stripe Tax for NL/IL/BE VAT + proper invoices) and RevenueCat for mobile only. Two webhook writers into the same seam, both keyed by `uid`. More control, slightly more reconciliation code. **Default to RevenueCat-everywhere for speed; switch web to Stripe-direct only if invoicing/VAT control becomes a hard requirement.**

---

## 4. Data model changes (the seam, upgraded)

### 4.1 `Plan` enum → add `family` (`app/src/server/entitlements.ts:24`)
```ts
export type Plan = "free" | "plus" | "family";
```

### 4.2 `PLAN_LIMITS` → add `family` row (`entitlements.ts:34`)
```ts
family: {
  coachMessagesPerDay: null,   // unlimited
  maxChildren: 6,
  professionalReports: true,
  advancedPlans: true,
  coParentSeats: 1,            // NEW limit field; Plus = 0, Family = 1
},
```
Add `coParentSeats: number` to `PlanLimits` (Free 0, Plus 0, Family 1) and enforce it where co-parent invites are created (`families/{familyId}/members`).

### 4.3 `entitlements/{uid}` document — richer shape
Today: `{ plan }`. Target (written by the webhook, read by `FirestoreEntitlementStore`):
```jsonc
{
  "plan": "free" | "plus" | "family",
  "status": "active" | "in_trial" | "grace_period" | "canceled" | "expired",
  "provider": "stripe" | "app_store" | "play_store" | "comp" | "none",
  "productId": "arbor_plus_monthly",      // store/Stripe price id
  "willRenew": true,
  "currentPeriodEnd": "2026-07-17T00:00:00Z",
  "rcOriginalAppUserId": "<firebase-uid>", // RevenueCat linkage
  "updatedAt": "2026-06-17T..."            // webhook write time
}
```
`FirestoreEntitlementStore.getPlan()` (`entitlements.ts:85-94`) keeps returning `plan`, but extend it to surface `status`/`currentPeriodEnd` so the Account page can show renewal/grace. `resolveEntitlement` keeps its precedence: **beta-unenforced → env comp → store → free** (`entitlements.ts:104-114`). Add: if `status` is `expired`/`canceled` past period end, treat as `free`.

### 4.4 Firestore rules — keep `entitlements` server-only
Unchanged: clients never write entitlements. The webhook (Cloud Run, Admin SDK) is the only writer. This is already the security posture — preserve it.

---

## 5. Auth & "what am I logged in as" — make it visible

This is the part that directly answers your complaint. Three concrete pieces:

1. **Account / Billing screen** (extend `app/src/components/layout/SettingsModal.tsx`, which already reads `useEntitlement`). Always show:
   - Signed-in identity: email / Google avatar (from `AuthContext`).
   - **Current plan badge** + status (`Active` / `Trial — 4 days left` / `Past due`) + **renewal date** + which store it was bought on.
   - Primary action: **Upgrade** (→ checkout) when Free; **Manage subscription** (→ Stripe Customer Portal or store-management deep link) when paid.
   - Replace today's "Join the launch list" toast with the real checkout.

2. **Stop comping yourself.** Remove your account from `ARBOR_PLUS_EMAILS` and flip `ENFORCE_ENTITLEMENTS=true` in a **staging** project so you experience real Free/Plus/Family states. Keep a separate test Google account permanently on Free to QA the paywall.

3. **Friendlier auth errors** (from the handoff backlog P0.1) — map Firebase error codes to parent-friendly copy in `LoginScreen.tsx` so the login that gates billing feels trustworthy.

---

## 6. Build plan — two tracks, full speed

### Track W — Web + Stripe → **first revenue this month**
| # | Task | Files / surface |
| :-- | :--- | :--- |
| W1 | Add `family` to `Plan`/`PLAN_LIMITS` + `coParentSeats` enforcement | `entitlements.ts`, family-invite path |
| W2 | Webhook endpoint `POST /api/billing/webhook` — verify signature, reconcile, write `entitlements/{uid}` (Admin SDK) | new `app/src/server/billingWebhook.ts`, register in `createApp.ts` |
| W3 | Checkout: RevenueCat Web Billing **or** Stripe Checkout session keyed to Firebase `uid`; success → user already gated | new `/api/billing/checkout`, client upgrade buttons |
| W4 | Account/Billing UI: plan badge, renewal, Upgrade / Manage | `SettingsModal.tsx`, `useEntitlement.ts` |
| W5 | Flip `ENFORCE_ENTITLEMENTS=true` in staging; QA Free↔Plus↔Family; **then prod** | Cloud Run env |
| W6 | **Pre-launch blocker:** move the in-memory per-user AI cost cap to a global store before opening free signups (see [[arbor-waf-assessment]]) | quota/cost store |

### Track M — Native iOS/iPad + Google Play (parallel, 4–8 wks incl. review)
| # | Task |
| :-- | :--- |
| M1 | Wrap the React app with **Capacitor** (`ios/` + `android/` projects, same web build) |
| M2 | Apple Developer ($99/yr) + Google Play ($25 one-time) accounts; App Store Connect + Play Console listings |
| M3 | Configure subscription products in App Store Connect & Play Console (`arbor_plus_monthly/annual`, `arbor_family_monthly/annual`) at price-parity tiers |
| M4 | RevenueCat SDK in the Capacitor app; same Firebase `uid` as RC App User ID → cross-platform entitlement; same webhook writes the seam |
| M5 | App Store Server Notifications V2 + Play RTDN → RevenueCat (handled by RC) |
| M6 | Submit for review; pass Apple's subscription-metadata + restore-purchases requirements; launch |

**Dependency:** Track M reuses W1–W4 entirely. Build W first; M is "wrap + store config," not a second payment system.

---

## 7. Decisions needed from you (don't block the build to answer)

1. **Free trial?** Recommend **7-day** on Plus & Family. (Yes/No)
2. **Web billing: RevenueCat Web Billing vs Stripe-direct?** Default RevenueCat (fastest, unified). Choose Stripe-direct only if you want native EU VAT invoices + Customer Portal now.
3. **Store price parity vs markup?** Apple/Google take 15–30%. Recommend **keep €12.99/€19.99 everywhere** (trust > margin), accept lower net on store sales, and steer new users to web checkout where rules allow (EU DMA external-link entitlement helps here). Alternative: mark store prices up to €14.99/€22.99 to protect net.
4. **Family = co-parent seat only at launch?** Recommend yes (cheapest to ship); widen later.

---

## 8. Risks / watch-items

- **Apple review rejects new subscription apps** that lack: restore-purchases, a real privacy policy, working account deletion, and clear subscription terms near the buy button. Budget for 1–2 rejection cycles.
- **Double-billing:** a user could buy on web *and* iOS. RevenueCat-everywhere prevents this (one entitlement). If using Stripe-direct web + RC mobile, the reconciler must pick one active sub and refund/ignore the other.
- **Cost cap before free signups (W6)** is a hard gate — charging implies opening signups, and the per-user AI cost cap is currently in-memory ([[arbor-waf-assessment]]).
- **VAT/tax:** NL/IL/BE consumers — Stripe Tax (or store-handled tax on mobile) must be on before first euro.

---

## 9. Bottom line

The expensive part — entitlement gating across the whole product — **already exists.** This spec adds: one webhook, one checkout, a third tier, and an Account page that finally shows you what you're paying for. **Track W can take real money on the web this month; Track M reuses the same plumbing to reach the App Store and Play.**

**Next action:** start **W1–W3** (third tier + webhook + checkout) in the `PPPPtherapy-` repo and stand up a RevenueCat project. Answer the four §7 decisions in parallel — none of them block W1.
