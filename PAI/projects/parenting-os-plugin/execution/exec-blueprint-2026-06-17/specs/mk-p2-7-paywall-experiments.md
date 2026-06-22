## mk-p2-7-paywall-experiments — Pricing/paywall experiments
**Aspects:** Marketing, Copy · **Surfaces/platforms:** app:shell · **Priority:** P2

### Problem / why
Marketing backlog **P2-7** (co-primary revenue goal): optimize the Free→Plus conversion by experimenting with **trigger placement** (where the paywall appears) and **trial length** (A/B), *without starving the free-tier growth loop* (no dark patterns, no nagging).

**Stale-rationale correction (verified in code):** the work-item rationale says "current paywall is waitlist (`set.plan.notify`) not checkout — billing rails empty." That is **no longer true.** Checkout is already wired end-to-end:
- `SettingsModal.tsx:56-67` calls `api.billingCheckout(plan, cadence)` → `api.ts:165` → `routes/api.ts:1436` `POST /billing/checkout` → `billing.ts:198 billingCheckoutUrl()` builds the hosted RevenueCat/Stripe link from `config.billingCheckoutUrls` (`env.ts:119-124`).
- `set.plan.notify` / `set.plan.notifyToast` (`i18n.ts:389-390`, `885-886`) are now **dead strings** — the upgrade buttons (`set.plan.upgradePlus/Family`) drive real checkout. The only gap is that checkout URLs are env-gated (empty in dev → `checkoutSoon` toast fallback).

So this item is **not** "build a paywall." It is: (1) add an **experiment-assignment seam** + **paywall instrumentation** so trigger placement and trial length become measurable/tunable; (2) **place the upsell contextually** at the moment of friction (the 402 coach-limit hit, Plus-feature taps) instead of burying it in Settings; (3) make **trial length** a server-config A/B knob feeding the existing RevenueCat trial. All of this must read/write the shared `entitlements`/`billing`/`i18n` files **without clobbering the parallel `mk-p0-2-referral-loop` grant path**.

### Scope across platform domains
- **Web (primary):** new `<UpgradeSheet>` reusable paywall component + `usePaywall()` experiment hook in the app shell; contextual trigger at the coach-limit 402; experiment-arm + `paywall_view`/`paywall_cta` instrumentation. SettingsModal reuses the same sheet (single source).
- **iOS (Capacitor) / Android (Capacitor):** same React surfaces ride the Capacitor shell unchanged. **One native rule:** on native, the upgrade CTA must route to RevenueCat native purchase (not a web checkout URL) per App Store / Play policy. We gate the CTA on `Capacitor.isNativePlatform()` (already used in `lib/native.ts`) and, when native, fall back to the existing store-managed copy (`set.plan.manageStore`) until the native purchase sheet ships under a separate mission. No StoreKit work here — just don't show a web-checkout button inside the app binaries.
- **Landing EN / Landing HE:** out of scope (this is `app:shell` only). Pricing copy on the landing is owned by `mk-landing-parity-rebuild` / `mk-p2-1`.

### IA / UX / Copy / Marketing detail

#### 1. Experiment-assignment seam (new, client-side, deterministic)
Create `lib/experiments.ts`. Pure, deterministic bucketing keyed on a stable per-device id so a user always sees the same arm (no flicker, reproducible in analytics):
- `getExperimentArm(experiment: string, arms: string[]): string` — hash `deviceId + experiment` (FNV-1a over a `localStorage` `arbor.deviceId`, minted once), modulo `arms.length`. No network, no PII.
- Active experiments registry (typed const):
  - `paywall_trial_len` → arms `["t7", "t14"]` (7-day vs 14-day trial).
  - `paywall_trigger` → arms `["limit_inline", "limit_sheet"]` (inline banner vs modal sheet at the coach limit).
- Arm is attached to **every** analytics event as a global prop via `lib/analytics.ts setGlobalProps` (extend the existing attribution provider — append `exp_paywall_trial_len` / `exp_paywall_trigger` keys; do **not** reorder existing keys). This makes `trial_start`/`paid` sliceable by arm with zero new call-site work.

> **Trial length A/B is a labelling+routing knob, not a billing rewrite.** Actual trial duration is set on the RevenueCat product/offering. The `paywall_trial_len` arm chooses **which configured checkout URL** to open by extending the cadence key, e.g. `config.billingCheckoutUrls["plus_monthly_t14"]` with graceful fallback to `plus_monthly` when the arm-specific link is unset. This means **`billing.ts` and `env.ts` get additive optional keys only** — existing `plus_monthly` etc. keep working untouched.

#### 2. `<UpgradeSheet>` — the one paywall component (new)
`components/billing/UpgradeSheet.tsx`. Extract the Free-plan upgrade block currently inline in `SettingsModal.tsx:120-147` into a reusable component, then have SettingsModal render `<UpgradeSheet variant="inline" context="settings" />`. Props: `{ variant: "inline" | "modal"; context: string; onClose?: () => void }`.

States:
- **default:** plan pitch (`set.plan.plusPitch`), cadence toggle (monthly/annual — existing), trial-length line driven by arm (`paywall.trialLine` with `{days}`), Upgrade-to-Plus (primary, `--arbor-clay`) + Upgrade-to-Family (`--arbor-green-ink`) buttons.
- **loading:** buttons `disabled` + `opacity-50` while `busy` (mirror existing `SettingsModal` `busy` pattern, lines 56-80). Add `aria-busy`.
- **empty/n-a:** if `isPaid` or `isBeta`, render nothing (paywall never shown to paid/beta users — fail-safe).
- **error:** checkout failure shows toast `set.plan.checkoutSoon` (existing fallback). On native (`Capacitor.isNativePlatform()`), show `set.plan.manageStore` and disable the web CTA.

Motion: modal variant uses the existing `Modal` component's transition; no new keyframes. Respect `prefers-reduced-motion` (inherited from `Modal`/`index.css` — do not add motion that ignores it).
Touch targets: all buttons ≥44×44 CSS px (current `px-3 py-2` text-xs buttons are ~32px tall — **bump to `py-2.5` min-h-[44px]** for the contextual surfaces).
A11y (AA): modal variant must trap focus + `aria-modal` (Modal already provides), CTAs are real `<button>`s with discernible text, cadence toggle is `role="radiogroup"` with `aria-checked`. Color contrast: white-on-`--arbor-clay` and white-on-`--arbor-green-ink` already AA — keep.
RTL: component uses logical Tailwind utilities and existing tokens; verify in HE (`aiLang`/`dir`) the cadence pill order and button row mirror correctly (use `flex-wrap gap-2`, no hard `left/right`).

#### 3. Contextual trigger placement (the actual experiment)
Today the only upsell entry point is buried in Settings. Place the trigger at the **moment of friction**, gated by the `paywall_trigger` arm:
- **Coach daily-limit (402):** `CoachTab.tsx` already handles the `402` upgrade payload from `entitlements.ts:241-246` (`upgrade.feature = "coach_unlimited"`). At that point:
  - arm `limit_inline` → render a calm inline `<UpgradeSheet variant="inline" context="coach_limit">` banner under the composer (non-blocking; the user can still read prior answers).
  - arm `limit_sheet` → open `<UpgradeSheet variant="modal" context="coach_limit">` once per limit-hit per day (dedupe via `loopEvents.once`-style guard so it is **not** a nag).
  - Copy: reuse the server `details` string, plus `paywall.coachLimitTitle` = "You've used today's free coaching" / HE "השתמשתם בכל האימון החינמי להיום". **No countdown-pressure, no fake scarcity** — state the reset time (`upgrade.resetAt` already returned) plainly: `paywall.resetsAt` = "Resets {time}".
- **Plus-only feature tap (professional reports / advanced plans):** the `402` from `requirePlusFeature` (`entitlements.ts:252-266`) → `<UpgradeSheet variant="modal" context="pro_reports" | "advanced_plans">`. (Wire only the contexts whose call sites already surface the 402 to the user; do not invent new gates.)

#### 4. Instrumentation (Marketing deliverable)
Extend `lib/loopEvents.ts` (append only — see conflict note):
- `PaywallView: "paywall_view"` and `PaywallCta: "paywall_cta"` added to `LoopEvent`.
- `trackPaywallView(context: string)` — fired on `UpgradeSheet` mount.
- `trackPaywallCta(context: string, plan: "plus" | "family", cadence: "monthly" | "annual")` — fired on Upgrade click, *before* `window.location.href`.
- Existing `trackTrialStart(tier)` / `trackPaid(tier)` stay the conversion endpoints; both now auto-carry the experiment arms via global props.
- Funnel becomes: `paywall_view → paywall_cta → trial_start → paid`, sliceable by `context`, `exp_paywall_trigger`, `exp_paywall_trial_len`, and first-touch `market`/`source` (already global). This is what the marketing dashboard reads to pick a winning arm.

#### 5. Copy strings (exact, EN + HE — append to `i18n.ts`)
```
"paywall.coachLimitTitle": "You've used today's free coaching"   | "השתמשתם בכל האימון החינמי להיום"
"paywall.coachLimitBody":  "Arbor Plus removes the daily limit — keep asking, anytime."
                                                                  | "ארבור פלוס מסיר את המגבלה היומית — המשיכו לשאול, בכל עת."
"paywall.resetsAt":        "Free coaching resets {time}."         | "האימון החינמי מתאפס ב-{time}."
"paywall.trialLine":       "Start with a {days}-day free trial — cancel anytime."
                                                                  | "התחילו עם {days} ימי ניסיון חינם — אפשר לבטל בכל עת."
"paywall.notNow":          "Not now"                              | "לא עכשיו"
```
`paywall.notNow` (modal dismiss) is required — an honest exit is part of "no dark patterns."

### Files to create / edit (exact repo-relative paths)
**Create:**
- `PPPPtherapy-/PPPPtherapy-/app/src/lib/experiments.ts` — deterministic arm assignment + active-experiment registry.
- `PPPPtherapy-/PPPPtherapy-/app/src/components/billing/UpgradeSheet.tsx` — the single reusable paywall (inline + modal).
- `PPPPtherapy-/PPPPtherapy-/app/src/lib/experiments.test.ts` — bucketing is stable & uniform-ish across arms.

**Edit:**
- `PPPPtherapy-/PPPPtherapy-/app/src/lib/loopEvents.ts` — append `PaywallView`/`PaywallCta` + `trackPaywallView`/`trackPaywallCta`.
- `PPPPtherapy-/PPPPtherapy-/app/src/lib/analytics.ts` — *no edit if* attribution provider is extended in App bootstrap; otherwise extend `setGlobalProps` source to merge experiment arms (prefer wiring in `App`/`ArborContext` bootstrap to avoid touching this hotspot).
- `PPPPtherapy-/PPPPtherapy-/app/src/components/layout/SettingsModal.tsx` — replace inline Free-plan block (lines 120-147) with `<UpgradeSheet variant="inline" context="settings" />`.
- `PPPPtherapy-/PPPPtherapy-/app/src/components/tabs/CoachTab.tsx` — on 402 coach-limit, render UpgradeSheet per `paywall_trigger` arm.
- `PPPPtherapy-/PPPPtherapy-/app/src/lib/i18n.ts` — append `paywall.*` keys (EN block ~line 404, HE block ~line 900).
- `PPPPtherapy-/PPPPtherapy-/app/src/server/billing.ts` — `billingCheckoutUrl`: accept optional arm suffix; look up `${plan}_${cadence}_${arm}` then fall back to `${plan}_${cadence}` (additive, non-breaking).
- `PPPPtherapy-/PPPPtherapy-/app/src/server/entitlements.ts` — **no schema change required.** Trial length is RevenueCat-side; the resolver already handles `in_trial`. Touch only if a `trialDays` display field is wanted on `Entitlement` (optional, additive field).
- `PPPPtherapy-/PPPPtherapy-/app/src/config/env.ts` — extend `billingCheckoutUrls` map to also read optional arm-suffixed env vars (`BILLING_URL_PLUS_MONTHLY_T14`, etc.); existing keys unchanged.
- `PPPPtherapy-/PPPPtherapy-/app/src/routes/api.ts` — `/billing/checkout` (line 1436): accept optional `arm` in body, pass to `billingCheckoutUrl`.
- `PPPPtherapy-/PPPPtherapy-/app/src/lib/api.ts` — `billingCheckout(plan, cadence, arm?)` signature extended (optional 3rd arg, back-compatible).
- **Cleanup:** remove dead `set.plan.notify` / `set.plan.notifyToast` / `ac.notifyToast` strings (`i18n.ts:389-390,437,885-886`) and any remaining `notify` waitlist references — they are unused now that checkout is live. Grep first to confirm zero call sites before deleting.

### Shared-file conflict notes
Four declared shared files; all are on the hotspot list. Coordination:
- **`server/entitlements.ts`** (touchedBy `mk-p0-2-referral-loop`, `mk-p2-7`): mk-p0-2 **writes** a Plus-month grant via `store.setEntitlement` (a new *writer/caller*); mk-p2-7 only **reads** the resolver and at most adds an optional additive display field. **Rule: mk-p0-2 lands its grant path first; mk-p2-7 rebases on top and adds no logic to `recordStillEntitles`/`resolveEntitlement`.** No competing edits to the same functions.
- **`server/billing.ts`** (touchedBy `mk-p0-2`, `mk-p2-7`): mk-p0-2 may extend the RevenueCat record mapping (grant write); mk-p2-7 only extends `billingCheckoutUrl` key lookup. **Different functions — additive, non-overlapping.** Land mk-p0-2 first, then patch `billingCheckoutUrl`.
- **`lib/i18n.ts`** (touchedBy `mk-p0-8-copy-pack`, `mk-p2-1-localize-nl`, `mk-p2-7`): per hotspot rule, **append-only, never reorder.** Add `paywall.*` keys at the end of EN and HE blocks. Do the `set.plan.notify` deletion as the final pass and announce it so `mk-p0-8` does not re-add the waitlist string.
- **`lib/loopEvents.ts`** (canonical event-name contract; `mk-p0-4` wires it first): append `PaywallView`/`PaywallCta` **after** mk-p0-4 has landed; never rename existing events. New names are additive.
- **`lib/analytics.ts`** (hotspot): prefer extending the global-props provider at the App bootstrap call site rather than editing `analytics.ts` itself, to stay off the merge magnet shared with `p4`/`mk-p0-4`/`mk-p1-6`.

### Dependencies (other item ids that must land first)
- **`mk-p0-2-referral-loop`** (declared) — must land its `entitlements`/`billing` grant-write path first; mk-p2-7 rebases and stays additive.
- **`mk-p0-4-analytics-wiring`** — wires `loopEvents.ts` dead exports + global-props; mk-p2-7's `paywall_*` events and arm props build on that stable surface.
- Soft: **`mk-p0-2`** already requires real `BILLING_URL_*` env links to be set for live checkout; arm-suffixed links are optional (graceful fallback), so the experiment can ship in "instrumentation + trigger placement" mode even before arm-specific links exist.

### Acceptance criteria (testable, incl. verified live on dev server)
1. `experiments.test.ts`: `getExperimentArm` is deterministic per device id and distributes across arms; `tsc` clean; full suite green (currently 235+ tests).
2. On a Free account on the **dev server**, hitting the coach daily limit (set `FREE_COACH_MESSAGES_PER_DAY=1`, send 2 messages) shows the contextual UpgradeSheet per the assigned `paywall_trigger` arm — inline banner OR modal — with a working "Not now" dismiss and a working Upgrade CTA.
3. `paywall_view` fires on sheet mount and `paywall_cta` fires on Upgrade click, both carrying `context`, `exp_paywall_trigger`, `exp_paywall_trial_len`, `market`, `source` (verified in the dev `[track]` console output).
4. Clicking Upgrade with an arm-suffixed checkout link configured opens the correct URL; with only the base link set, it falls back to `plus_monthly` (no broken link, no 503 surfaced to user — `checkoutSoon` toast on miss).
5. Paid/Beta users **never** see the paywall (UpgradeSheet renders null when `isPaid || isBeta`).
6. SettingsModal still shows the same upgrade block (now via UpgradeSheet) — no visual regression; HE/RTL renders correctly.
7. On native build flag (`Capacitor.isNativePlatform()` mocked true), the web-checkout CTA is replaced by store-managed copy — no web checkout button inside app binaries.
8. `set.plan.notify`/`notifyToast` strings have zero remaining references (grep clean) and are removed.

### Operating-rule checks
- **No dark patterns:** non-blocking inline option, explicit "Not now," once-per-day dedupe on the modal, plain reset-time copy (no countdown/scarcity), honest trial copy ("cancel anytime"). Free-tier loop is preserved — the paywall appears only at genuine limits, never gates the share/referral/activation path.
- **Privacy / COPPA-2026:** experiment bucketing uses a first-party `arbor.deviceId` (no PII, no third-party scripts) consistent with `lib/analytics.ts`/`attribution.ts`; events stay in the user's own Firestore collection. No child data touches the paywall.
- **Moat read/write:** paywall **reads** entitlement/usage (the longitudinal account state) to decide placement; it does not write child memory. Conversion events enrich the funnel that protects the free loop feeding the moat.
- **Ships-visible:** verifiable on the dev server (criteria 2-6) — a Free user sees a real, dismissible contextual paywall and a real checkout, and the funnel is observable in analytics.
