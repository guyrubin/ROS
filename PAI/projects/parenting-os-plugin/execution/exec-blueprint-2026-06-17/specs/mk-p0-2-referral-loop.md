## mk-p0-2-referral-loop — Referral loop (code/user, Plus-month on activation)
**Aspects:** Marketing · **Surfaces/platforms:** app:shell · **Priority:** P0

### Problem / why
Marketing P0-2 is half built. First-touch attribution already captures an inbound `?ref=CODE` (`src/lib/attribution.ts` parses `ref`/`referral`, persists first-touch, exposes `referral_code` on every analytics event) and `main.tsx` calls `captureAttribution()` at boot. But the loop is open on both ends:

1. **No way to send an invite.** `trackInviteSent` (`src/lib/loopEvents.ts:62`) is a **dead export** — grep confirms zero callers anywhere in `src/`. There is no UI that surfaces the parent's own referral code or a shareable invite link.
2. **No activation payoff.** Nothing reads the captured `referral_code` after signup, there is no `invite_activated` server endpoint, and no Plus-month is granted to either party. `LoopEvent.InviteActivated = "invite_activated"` exists as a name only (`loopEvents.ts:20`) with no emitter.

Result: the funnel `install → activation → refer → pay` has the "refer" arc completely missing. The GTM plan's product-led loop and **all of P1 (loop optimization, avatar challenge, etc.) depend on a working referral primitive.** This item closes the loop end-to-end: generate a per-user code, give the parent a way to invite, detect a referred new user's activation server-side, and grant both sides one Plus month.

### Scope across platform domains
- **Web (primary):** Invite entry point in the app shell (Settings modal Plan row + a lightweight "Invite a parent" affordance), client wiring of `trackInviteSent`, a new `/api/referral/*` surface, and a server-side referral grant that writes a `comp`-provider Plus month into the existing entitlement seam.
- **iOS (Capacitor):** Reuses the same web bundle. The invite share must use the Web Share API with a `navigator.share` capability check (already the platform pattern); the referral link must be an `https://` universal link to the canonical domain, never a relative path (native origin is `localhost`). No native-only code; just verify the share sheet opens and the link resolves to the remote domain.
- **Android (Capacitor):** Same as iOS — Web Share API, absolute `https://` link.
- **Landing EN / Landing HE:** Out of scope here. The landing pages already accept `?ref=` via attribution (handled by `mk-p0-5-attribution-utm`); this item only consumes the captured code inside the app. Do **not** edit the landing HTML.

### IA / UX / Copy / Marketing detail

#### The loop (mechanics)
```
Parent A opens Invite  →  GET /api/referral/code  →  returns stable code "ARBOR-<8char>" for uid_A
   → shares link https://<canonical>/?ref=ARBOR-XXXX  (trackInviteSent(channel))
Parent B clicks link  →  attribution.ts persists referralCode first-touch (already works)
   → B signs up + reaches activation (first generated plan = LoopEvent.FirstPlan)
   → client POSTs /api/referral/activate { code }  (once, deduped via existing once() pattern)
   → server validates: code maps to uid_A, B != A, B is new (no prior activation), code not self/again
   → server grants 1 Plus month to BOTH uid_A and uid_B  (referralGrantStore + setEntitlement comp record)
   → emits invite_activated (server logs) ; client emits LoopEvent.InviteActivated
```

**Entitlement grant — the load-bearing design decision.** `server/billing.ts` documents RevenueCat as the *sole* writer of `entitlements/{uid}`. A referral month must **not** masquerade as a RevenueCat event. Instead use the existing **`comp` provider + `setEntitlement` seam** (`entitlements.ts:29` `BillingProvider = "comp"`, `EntitlementStore.setEntitlement`). The grant writes:
```ts
{ plan: "plus", status: "active", provider: "comp", productId: "referral_month",
  willRenew: false, currentPeriodEnd: <now + 30d ISO>, rcOriginalAppUserId: null }
```
`resolveEntitlement` already honors this: `recordStillEntitles` keeps a `willRenew:false` comp record alive until `currentPeriodEnd`, then it lapses to Free cleanly — exactly the "one free month" semantics, no billing rails needed. **Conflict rule:** a referral grant must never overwrite an active paid (`stripe`/`app_store`/`play_store`) record — guard with a read-before-write: only write the comp record if the current record is absent, free, or itself a `comp` referral whose period is further extended.

**Stacking & abuse guards (no dark patterns, but no free-month farming):**
- One activation credit per *referred* uid, ever (dedupe key `referral_activated:<uid_B>`).
- A referrer earns at most N=5 referral months total (configurable `REFERRAL_MAX_GRANTS`, default 5); beyond that the invite still works socially but stops granting — surfaced honestly in copy.
- Self-referral blocked (`uid_A === uid_B`), and the code must resolve to a real, different user.
- Grants extend (not double-count): if B already holds a comp referral month, push `currentPeriodEnd` out by 30d rather than creating a second record.

#### Code format
`ARBOR-` + 8 chars from a non-ambiguous alphabet (no `0/O/1/I`), derived deterministically from a HMAC of the uid + server secret so it is stable per user and reversible-by-lookup (store `code → uid` in a `referralCodes` collection on first `GET /api/referral/code`). Stable code = same link every time the parent re-opens Invite.

#### UI — Invite entry point (app shell)
Primary placement: **Settings modal** (`src/components/layout/SettingsModal.tsx`), a new `Row` directly under the Plan block (after line 148), icon `Gift` (lucide, already in the icon set used here). Title `t("set.referral.title")`, sub `t("set.referral.sub")`.

Content of the row (a small `InviteCard` component, `src/components/referral/InviteCard.tsx`):
- **Default state:** the parent's referral link in a read-only field + a primary "Copy link" button and a "Share" button (Web Share API when `navigator.share` exists, else copy-to-clipboard fallback). Below: a one-line earned-counter ("You've earned 2 free months").
- **Loading state:** skeleton bar where the code field is, buttons disabled (`busy`), mirroring the existing `disabled:opacity-50` pattern used by `startCheckout`.
- **Empty/anon state:** if the user is not signed in (`entitlement` resolvable but no uid / `local-sandbox`), show the value prop + a "Sign in to get your link" prompt rather than a code.
- **Error state:** if `GET /api/referral/code` fails, show `t("set.referral.error")` inline (reuse the toast pattern already imported in SettingsModal) and a retry; never block the rest of Settings.
- **Activation confirmation (Parent B side):** when `/api/referral/activate` succeeds, fire the existing `toast(..., "success")` with `t("set.referral.granted")` and refetch entitlement (`useEntitlement` already powers the Plan row, so the badge flips to Plus automatically).

**Motion:** copy/share buttons use the existing button transitions; on successful copy, a 1.2s checkmark swap (respect `prefers-reduced-motion` → no animation, just state text change). No confetti on the parent surface (premium/calm register).

**Touch targets:** all buttons ≥44×44px (match existing `px-3 py-2` rounded-xl buttons in this modal).

**a11y (AA):** the link field is `readOnly` with an explicit `<label>`; Copy/Share are real `<button>`s with `aria-label`; success uses `aria-live="polite"` for the "Copied" / "month granted" announcement; contrast uses existing `--arbor-clay` (≥4.5:1 on white, already used for primary CTAs). Full keyboard path: Tab to field → Tab to Copy → Enter copies.

**RTL:** all strings go through `i18n.ts`; the link field uses `dir="ltr"` even in HE (URLs are LTR) while surrounding copy follows the document `dir`. Verify in Hebrew that the row reads right-to-left and the link field stays LTR.

#### Copy (actual strings — add to `src/lib/i18n.ts`, EN + HE)
```
set.referral.title    EN: "Invite a parent, both get a free month"      HE: "הזמינו הורה — שניכם תקבלו חודש חינם"
set.referral.sub      EN: "Share Arbor. When they create their child's first plan, you each get a month of Plus."
                      HE: "שתפו את Arbor. כשהם יוצרים את התוכנית הראשונה לילד, שניכם מקבלים חודש Plus."
set.referral.copy     EN: "Copy link"            HE: "העתקת קישור"
set.referral.share    EN: "Share"                HE: "שיתוף"
set.referral.copied   EN: "Link copied"          HE: "הקישור הועתק"
set.referral.earned   EN: "You've earned {count} free month(s)"   HE: "צברתם {count} חודשי חינם"
set.referral.maxed    EN: "You've earned the maximum referral months — keep sharing the love."
                      HE: "הגעתם למקסימום חודשי ההזמנה — המשיכו לשתף."
set.referral.granted  EN: "A free month of Plus is on us — enjoy."  HE: "חודש Plus חינם עלינו — תיהנו."
set.referral.signin   EN: "Sign in to get your invite link"        HE: "התחברו כדי לקבל קישור הזמנה"
set.referral.error    EN: "Couldn't load your invite link — try again."  HE: "לא הצלחנו לטעון את קישור ההזמנה — נסו שוב."
```
Share-sheet body (Web Share `text`): EN `"I use Arbor to understand my kid's development. Here's a free month of Plus 🌱"` / HE equivalent. Title: `"Arbor"`. URL: the canonical referral link.

#### Instrumentation (loopEvents)
- Wire `trackInviteSent(channel)` at the share/copy action in `InviteCard` — `channel` = `"web_share" | "copy" | "<navigator.share target if known>"`. This activates the currently-dead export.
- Add a thin `trackInviteActivated(role: "referrer" | "referred")` helper to `loopEvents.ts` that wraps `track(LoopEvent.InviteActivated, { role })` (the event name already exists; just add the emitter). Client fires it on the referred side after `/api/referral/activate` returns success.
- **Do not rename any LoopEvent value.** Per the loopEvents hotspot, `mk-p0-4-analytics-wiring` owns wiring the dead exports first; this item must import the **stable** names. If mk-p0-4 has already wired `trackInviteSent`, reuse it as-is and only add `trackInviteActivated`.

### Files to create / edit (exact repo-relative paths)
**Create:**
- `PPPPtherapy-/PPPPtherapy-/app/src/server/referral.ts` — `ReferralStore` interface + `LocalReferralStore` / `FirestoreReferralStore` (collections `referralCodes` `{code→uid}` and `referralGrants` `{uid, count, activatedBy[]}`), `codeForUid(uid)`, `activateReferral({ code, redeemerUid })` returning grant result, and the comp-grant writer that calls `entitlementStore.setEntitlement` with the read-before-write guard.
- `PPPPtherapy-/PPPPtherapy-/app/src/server/referral.test.ts` — unit tests for code stability, self/dup/maxed guards, comp-record shape, and the "don't clobber paid" guard.
- `PPPPtherapy-/PPPPtherapy-/app/src/components/referral/InviteCard.tsx` — the invite UI (states above).

**Edit:**
- `PPPPtherapy-/PPPPtherapy-/app/src/lib/loopEvents.ts` — add `trackInviteActivated`; wire `trackInviteSent` if not already wired by mk-p0-4. **Append only**, no renames.
- `PPPPtherapy-/PPPPtherapy-/app/src/lib/attribution.ts` — no signature changes; add a tiny `consumeReferralCode()` helper that returns `loadAttribution()?.referralCode` so the activation call has one read path. (Append-only export.)
- `PPPPtherapy-/PPPPtherapy-/app/src/server/entitlements.ts` — add `productId: "referral_month"` handling is already supported (free-form string); add an exported helper `buildReferralGrant(currentPeriodEndIso)` returning the `EntitlementRecord` so referral.ts and tests share one shape. No change to `resolveEntitlement` logic (comp + willRenew:false already lapses correctly).
- `PPPPtherapy-/PPPPtherapy-/app/src/server/billing.ts` — **no behavioral change**; add a one-line doc comment noting `comp`/`referral_month` records are written out-of-band by `server/referral.ts` (so the "RevenueCat is sole writer" comment stays honest). Optional/minimal.
- `PPPPtherapy-/PPPPtherapy-/app/src/routes/api.ts` — add `GET /api/referral/code` (returns `{ code, link, earnedMonths, maxed }`) and `POST /api/referral/activate` (`{ code }` → grant). Both inside the auth-gated `/api` router (uid required). Inject `referralStore` via `ApiDeps`.
- `PPPPtherapy-/PPPPtherapy-/app/src/server/createApp.ts` — construct `referralStore` (local vs firestore by `config.memoryAdapter`, mirroring `entitlementStore`) and pass it into `createApiRouter`. Pass `entitlementStore` into the referral store so it can write comp grants.
- `PPPPtherapy-/PPPPtherapy-/app/src/lib/api.ts` — add `referralCode: () => get(...)` and `referralActivate: (code) => post(...)` client helpers + their result types.
- `PPPPtherapy-/PPPPtherapy-/app/src/components/layout/SettingsModal.tsx` — add the `Gift` `Row` + `<InviteCard />` under the Plan block.
- `PPPPtherapy-/PPPPtherapy-/app/src/lib/i18n.ts` — add the `set.referral.*` keys (EN + HE).
- Activation trigger: call `referralActivate(consumeReferralCode())` from the same place `trackFirstPlan` fires (find via grep for `trackFirstPlan` — likely `OverviewTab`/`DailyPlayCard`/plan-generation handler in `ArborContext.tsx`), guarded by the existing `once()` dedupe so it fires exactly once per device and only when a `referralCode` is present. Wire this in the file that already owns first-plan tracking; do not add a new boot path.

### Shared-file conflict notes
- **`src/lib/loopEvents.ts`** (hotspot: mk-p0-4 wires dead exports FIRST, then everyone imports stable names; never rename events). → This item depends on / coordinates with `mk-p0-4-analytics-wiring`. If sequenced after mk-p0-4, just consume `trackInviteSent`; only *add* `trackInviteActivated`. Append-only.
- **`src/lib/attribution.ts`** (touched by mk-p0-2 + `mk-p0-5-attribution-utm`). → mk-p0-5 owns parsing/landing UTM; this item only *reads* the already-captured `referralCode`. Add `consumeReferralCode()` as a new export; do not touch `parseAttribution`/`captureAttribution` internals.
- **`src/server/entitlements.ts`** (touched by mk-p0-2 + `mk-p2-7-paywall-experiments`). → Only **add** `buildReferralGrant` helper; do not change `PLAN_LIMITS`, `resolveEntitlement`, or middleware that the paywall-experiments item will edit. Keep edits at the bottom of the file.
- **`src/server/billing.ts`** (touched by mk-p0-2 + `mk-p2-7`). → Comment-only change here; all real grant logic lives in the new `server/referral.ts` so the two missions don't collide in billing.ts.
- **`src/routes/api.ts`** is not in the declared shared set for this item but is edited by `p1-comic-reader`/`p4-operational-hardening`/`c3-ask-specialist`. → Append the two new routes at the end of the router (near the existing `/billing/*` block ~line 1460) to minimize merge surface; add the `referralStore` field to `ApiDeps` adjacently to `entitlementStore`.
- **`src/components/layout/SettingsModal.tsx`** — not in this item's declared shared list and low-traffic; insert the new `Row` as a contiguous block under Plan to avoid interleaving with other edits.

### Dependencies (other item ids that must land first)
- `mk-p0-4-analytics-wiring` — wires the dead `loopEvents` exports and stabilizes event names. Land first; this item imports the stable `trackInviteSent` and reuses the `track()` path. (Soft dependency: if mk-p0-4 slips, this item can wire `trackInviteSent` itself, but must hand the name back unchanged.)
- `mk-p0-5-attribution-utm` — ensures the landing pages propagate `?ref=` into the app. Recommended-before, not hard-blocking (in-app capture already works for direct app links).

### Acceptance criteria (testable, including "verified live on dev server")
1. `GET /api/referral/code` (authed) returns a **stable** `ARBOR-XXXX` code (same code on repeat calls for the same uid) plus an absolute `https://` referral link to the canonical domain.
2. `trackInviteSent` has ≥1 live caller (grep no longer reports it dead); copying/sharing the link emits `invite_sent` with a `channel` prop (verify in the analytics dev console / network panel).
3. A new user landing via `?ref=CODE`, signing up, and reaching first-plan activation triggers `POST /api/referral/activate` exactly once; the server writes a `comp`/`referral_month` Plus record for **both** referrer and referred, and both `entitlement` endpoints now return `plan:"plus", provider:"comp", willRenew:false` with `currentPeriodEnd ≈ now+30d`.
4. Guards proven by `referral.test.ts`: self-referral rejected; second activation by the same referred uid is a no-op; referrer past `REFERRAL_MAX_GRANTS` stops earning but the call still 200s; an active `stripe`/`app_store` paid record is **never** overwritten by the comp grant.
5. The Settings Plan row shows the invite affordance with all states (default/loading/empty/error) reachable; on grant, the Plan badge flips to Plus without reload (entitlement refetch).
6. Hebrew (RTL): the invite row renders right-to-left, the link field stays `dir="ltr"`, all strings localized; `prefers-reduced-motion` disables the copy animation.
7. `tsc` clean and all existing + new unit tests green.
8. **Verified live on dev server:** run the app dev server, open Settings → copy link → confirm `invite_sent` fires; simulate a referred activation (second account or seeded `referralCode` in localStorage + trigger first-plan) → confirm both accounts read Plus via `/api/entitlement` and the toast appears.

### Operating-rule checks
- **No dark patterns:** the offer is symmetric and honestly stated ("both get a free month"); the earned cap is disclosed (`set.referral.maxed`), not hidden; no fake scarcity, no forced sharing to unlock features, the month auto-lapses to Free with no surprise charge (`willRenew:false`, no card on file).
- **Privacy / COPPA-2026:** referral operates on the *parent* account only — no child data in the link, the code, or the share text. The code is an HMAC of uid + secret (no PII). Reference photos/child memory are never involved. The share text mentions no child name.
- **Moat read/write:** the loop *reads* the activation signal (first generated plan = the family's first write into the longitudinal memory moat) as its trigger, so the referral payoff is earned by genuine product activation, not a hollow signup. It writes the entitlement grant (account-level), not child data — keeping the moat clean.
- **Ships-visible:** the Invite affordance is a real, reachable surface in the app shell (Settings), the granted Plus month is visible in the Plan badge, and both events appear in the analytics funnel — the loop is operational end-to-end, not bolted-on.
