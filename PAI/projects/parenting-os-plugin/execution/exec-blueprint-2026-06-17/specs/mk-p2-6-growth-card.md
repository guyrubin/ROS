## mk-p2-6-growth-card — Monthly Growth Card re-engagement
**Aspects:** Marketing, UI/UX, Copy · **Surfaces/platforms:** app:shell, cross:hero · **Priority:** P2

### Problem / why
Arbor has a *weekly* retention surface (RET-1 `server/digest.ts` + `WeeklyTab`) but no **monthly** re-engagement beat — and nothing that produces a *shareable* monthly artifact to feed the viral loop. The `LoopArtifact` union in `lib/loopEvents.ts:25` already reserves `"growth_card"` and the P0-3 share engine (`lib/shareCard.ts`, built by mk-p0-3) already ships a **growth_card template stub + renderer hook** (mk-p0-3 spec, AC #9) "so p2-6 only supplies data." So this item is the *data + cadence + re-engagement loop* on top of an existing renderer, not a new renderer.

The job: once a month, compute a truthful month-over-month growth summary (reusing the deterministic stats core that already powers the weekly digest), render it through the existing branded `shareCard.ts` growth template, surface it as a dismissible **Monthly Growth Card** in the app shell, and (where a channel exists) deliver it as a re-engagement nudge that pulls a lapsing parent back in and gives them something proud to share. Re-engagement → open → share → referral install: the back half of the loop the marketing plan monetizes.

This is **P2** and explicitly depends on **mk-p0-3-share-export** (the renderer it reuses) and **p4-operational-hardening** (which owns the `loopEvents.ts` dead-export wiring and the `analytics.ts`/event contract). It must not duplicate the clinical PDF path or invent a new canvas renderer.

### Scope across platform domains
- **Web app (app:shell)** — a new `MonthlyGrowthCard` re-engagement card rendered in the app shell's "what's new" slot (top of Today / shell banner region), shown at most once per calendar month when a fresh monthly card is available. Card → "See {name}'s month" (opens the rendered growth card in a sheet) + a `<ShareButton artifact="growth_card" surface="growth">` (the P0-3 primitive). New `lib/growthCard.ts` computes the month stats and assembles the `ShareCardOpts` the P0-3 `growth_card` template consumes. New server route `POST /api/growth-card` (sibling of `/api/digest`) produces the warm monthly narrative with a deterministic fallback.
- **cross:hero** — the rendered card uses the child's **hero avatar** (same `photoUrl`/hero source the Hero Card uses) as the identity anchor, so the monthly artifact is part of the cross-cutting hero promise, not a generic stat sheet.
- **iOS (Capacitor)** — re-engagement *delivery* via a local notification ("{name}'s month is ready") IF and only if `@capacitor/local-notifications` is already present and consent is granted; otherwise the in-app shell card is the only surface. Sharing the PNG reuses the P0-3 native `@capacitor/share` path. No new always-on permission is *required* by this item — notification is strictly opt-in and degrades to in-app-only.
- **Android (Capacitor)** — same local-notification path via the same plugin; same opt-in/degrade rule. Share sheet via P0-3.
- **Email re-engagement** — *channel-agnostic payload only* in this item. Like the weekly digest, the monthly payload includes `subject`/`preheader`/`summary` fields so it is email/push-ready, but **no transactional email infra exists in the repo yet** (verified: no sendgrid/resend/postmark/SES client present). This item ships the payload + an `email_ready` flag and the `growth_card_email_*` event names reserved through p4; actual send is a follow-up once an ESP is wired. **Do not** build SMTP/ESP plumbing here.
- **Landing EN / Landing HE** — out of scope for code. The share caption/deep link points at the canonical landing URL (owned by mk-p0-1) with the growth-card UTM, identical to P0-3's contract.

### IA / UX / Copy / Marketing detail

#### Marketing — the loop, the asset, the instrumentation
Loop position: **lapsing parent → monthly re-engagement nudge (in-app card / opt-in local notification) → opens "{name}'s month" → proud branded growth card → 1-tap share with referral+UTM baked in → recipient lands on canonical site with first-touch attribution → installs.** Re-engagement (pulling the existing user back) and acquisition (the share) in one artifact.

Instrumentation (reuse existing/p4-owned names from `lib/loopEvents.ts`; **do not rename**, **do not add events that p4 hasn't wired** — coordinate so p4 lands the dead-export wiring first):
- Card becomes visible in shell → `track("reengage_card_shown", { artifact: "growth_card", month })` (new event name — must be added by/with p4-operational-hardening in `loopEvents.ts`, never renamed after; if p4 hasn't landed, gate behind the wired exports and ship the card without the shown-event rather than racing the file).
- Parent opens the card → `track("reengage_card_opened", { artifact: "growth_card", month })`.
- Parent taps Share → P0-3 already fires `trackShareInitiated("growth_card", "growth")`; on resolve `trackShareCompleted("growth_card", channel)`. **This item adds no new share events** — it only supplies the `growth_card` data to the P0-3 `<ShareButton>`.
- Parent dismisses the card → `track("reengage_card_dismissed", { artifact: "growth_card", month })`. Dismissal is honored for the rest of that calendar month (persisted, see UX).
- All events flow through `analytics.track()` → first-touch attribution attached as global props automatically (`analytics.ts:18-26`), so re-engagement is sliceable by original acquisition channel.

The **asset** is the branded `growth_card` PNG: hero avatar + child first name + the month's headline numbers (moments logged this month, milestones reached, the single proudest line) + "Made with Arbor" + canonical URL band — all rendered by the *existing* P0-3 `shareCard.ts` `growth_card` template. This item supplies the data object; it does not draw pixels.

Cadence rule (anti-spam, no dark patterns): **at most one monthly card per calendar month**, shown only when (a) a new calendar month has data and (b) the parent hasn't already opened or dismissed *this* month's card. Persisted via a `arbor.growthCard.lastShownMonth` / `arbor.growthCard.dismissedMonth` localStorage pair (mirrors the `once()` pattern in `loopEvents.ts:30-39`). Quiet by design: if there's no meaningful month (zero logged moments), show an encouraging low-key variant, never a guilt nudge.

#### Data / compute — `lib/growthCard.ts` + `POST /api/growth-card`
Reuse the deterministic stats core. `server/digest.ts` already exports `computeWeeklyDigestStats` over a 7-day window with prev-week comparison; this item adds `computeMonthlyGrowthStats(logs, milestones, now)` **in `server/digest.ts`** (same file, append-only — it is the home of truthful stat computation and is NOT in the shared-file hotspot list, so it is conflict-safe) that uses a 28/30-day current window vs the prior month, returning:
```ts
export type MonthlyGrowthStats = {
  monthOf: string;            // "2026-05"
  momentsLogged: number;
  previousMonthMoments: number;
  daysCovered: number;
  milestonesDone: number;
  milestonesTotal: number;
  milestonesGainedThisMonth: number; // newly checked vs prior snapshot if available, else 0
  topContext: string | null;
  topBehavior: string | null;
  intensityTrend: "easing" | "steady" | "intensifying" | "unknown";
};
```
and `fallbackMonthlyNarrative(childName, stats)` returning `{ title, subject, preheader, summary, headline, highlights, tryNextMonth }` (deterministic, truthful even with AI off — same contract as `fallbackDigestNarrative`).

`POST /api/growth-card` (new route in `routes/api.ts`, sibling of `/digest` at `:1485`) mirrors the digest route exactly: compute stats server-side → AI narrative via `modelProvider.generateJson({ route: "analysis_structured", ... })` with the `NON_DIAGNOSTIC_CONTRACT` + `REDACTION_DIRECTIVE` + `createRedaction` privacy wrapper already used by `/digest` → deterministic fallback on error → `res.json({ ...narrative, stats, generated })`. **Register the new path in the auth/AI gate list at `server/createApp.ts:117`** (add `"/api/growth-card"` alongside `"/api/digest"`).

Client `lib/growthCard.ts`:
- `getMonthlyCard(ctx): Promise<{ stats, narrative, cardOpts: ShareCardOpts } | null>` — calls `api.growthCard(...)` (new method in `lib/api.ts`, mirroring `api.digest`), assembles `cardOpts` for the P0-3 `growth_card` template: `{ artifact: "growth_card", imageUrl: heroUrl, name: firstName, headline, statLines: [...] }`. Returns `null` if no current-month data.
- `shouldShowMonthlyCard(now): boolean` — month-gating against the localStorage keys.
- `markMonthlyCardShown(month)` / `markMonthlyCardDismissed(month)`.

> **`lib/api.ts` note:** adding `api.growthCard` touches a hotspot file (see conflict notes). Add it as a single new method on the existing `api` object next to `api.digest`; do not refactor the surrounding object.

#### UI/UX — `MonthlyGrowthCard` shell card + card sheet (parent register, calm/premium)
New component `components/overview/MonthlyGrowthCard.tsx`, mounted in the app shell's banner/"what's new" region (top of `OverviewTab.tsx` content, above the rhythm strip — coordinate placement with b1-daily-home which owns Today layout; render it as a self-contained card so it slots in without restructuring Today). Parent register — calm/premium kit (`components/ui/kit.tsx`), **not** playkit.

States:
- **default** — a soft card: small hero thumbnail + "{name}'s month is ready" + one-line preheader + primary "See the month" + dismiss "×". Min touch target 44×44 on all interactive elements (AA / Apple HIG). On open, expands into a sheet showing the rendered growth-card preview image + the `<ShareButton artifact="growth_card" surface="growth" getCardOpts={...} label={t("share.cta.growth")} />` (the P0-3 primitive — already supplies `share.cta.growth` copy).
- **loading** — while `getMonthlyCard` resolves / canvas renders: skeleton card with `aria-busy="true"`; spinner shown only after 150ms to avoid flicker (mirrors P0-3 ShareButton rule).
- **empty / quiet-month** — zero logged moments this month: card still appears once, low-key copy ("A quiet month — even one moment a week keeps {name}'s story sharp"), primary becomes "Log a moment" deep-linking to the logger; **no share button** in the quiet variant (nothing proud to share yet → no dangling action), matching P0-3's "hide, don't disable" rule.
- **error** — `getMonthlyCard` or render fails: card silently does not appear (re-engagement must never show a broken state); error logged via existing logger only. No event on error.
- **dismissed** — "×" persists `dismissedMonth`; card does not reappear that calendar month. Dismiss is one tap, honored silently (no "are you sure", no re-nag) — explicitly no dark pattern.
- **motion** — card entrance: gentle fade+rise (existing kit motion); `active:scale-[0.97]` on buttons. All motion gated under `prefers-reduced-motion` via the existing `index.css` reduced-motion guard (do not add new global CSS — reuse tokens; `index.css` is a top merge magnet, leave it to the m-series).
- **a11y (AA)** — card is a `<section aria-label="Monthly growth update for {name}">`; buttons are real `<button>`s, keyboard-activatable, focus-visible ring via existing token; dismiss has `aria-label="Dismiss {name}'s monthly card"`; the open/share results announce via `aria-live="polite"`. Hero thumbnail `alt="{name}'s hero avatar"`.
- **RTL (HE)** — card is flex/logical-property based so it mirrors automatically under `dir="rtl"`. The localized strings come from `lib/i18n.ts`; the **canvas growth-card image** follows the P0-3 rule (brand wordmark stays latin "Made with Arbor"; child name rendered as-is with RTL detection already handled inside `shareCard.ts`).

#### Copy — actual strings (append-only to `lib/i18n.ts` EN block ~`:491` and HE block ~`:983`; do not reorder; reconcile any collision with mk-p0-8 copy-pack by deferring to copy-pack)
- `growthCard.title`: EN "{name}'s month is ready" / HE "החודש של {name} מוכן"
- `growthCard.cta.open`: EN "See the month" / HE "צפו בחודש"
- `growthCard.cta.logMoment`: EN "Log a moment" / HE "תיעוד רגע"
- `growthCard.dismiss`: EN "Dismiss" / HE "סגירה"
- `growthCard.quiet`: EN "A quiet month — even one moment a week keeps {name}'s story sharp." / HE "חודש שקט — אפילו רגע אחד בשבוע שומר על הסיפור של {name} חד."
- `growthCard.preheaderFallback`: EN "Here's what changed for {name} this month." / HE "הנה מה שהשתנה אצל {name} החודש."
- Share CTA + caption reuse the **existing P0-3 keys** `share.cta.growth` ("Share progress" / "שתפו התקדמות") and `share.caption.growth` ("{name}'s progress this month — Arbor. {url}" / HE equivalent) — **do not redefine them.**
- Server narrative `headline` is AI/fallback-generated and localized by the `language` directive in the route (same mechanism as `/digest`), not via i18n keys.

### Files to create / edit (exact repo-relative paths)
Create:
- `PPPPtherapy-/PPPPtherapy-/app/src/lib/growthCard.ts` — `getMonthlyCard`, `shouldShowMonthlyCard`, `markMonthlyCardShown`, `markMonthlyCardDismissed`; assembles `ShareCardOpts` for the P0-3 `growth_card` template.
- `PPPPtherapy-/PPPPtherapy-/app/src/lib/growthCard.test.ts` — unit tests for the month-gating logic and `ShareCardOpts` assembly (pure functions; mirrors `attribution.test.ts`/`jitai.test.ts`).
- `PPPPtherapy-/PPPPtherapy-/app/src/components/overview/MonthlyGrowthCard.tsx` — the shell re-engagement card + open sheet described above.

Edit:
- `PPPPtherapy-/PPPPtherapy-/app/src/server/digest.ts` — **append** `computeMonthlyGrowthStats` + `fallbackMonthlyNarrative` (NOT in hotspot list; conflict-safe). Do not modify the weekly functions.
- `PPPPtherapy-/PPPPtherapy-/app/src/server/digest.test.ts` — add monthly-stats cases.
- `PPPPtherapy-/PPPPtherapy-/app/src/routes/api.ts` — add `POST /api/growth-card` route directly after the `/digest` route (`:1526`); import the two new functions from `server/digest.js`.
- `PPPPtherapy-/PPPPtherapy-/app/src/server/createApp.ts` — add `"/api/growth-card"` to the gated-route list at `:117`.
- `PPPPtherapy-/PPPPtherapy-/app/src/lib/api.ts` — add `api.growthCard(args)` next to `api.digest` (single new method; **shared hotspot — append only**).
- `PPPPtherapy-/PPPPtherapy-/app/src/lib/loopEvents.ts` — **no rename, no removal.** Only if p4-operational-hardening has NOT already added them, append the three re-engagement event-name constants (`ReengageCardShown`/`Opened`/`Dismissed`) — coordinate so p4 owns them. Prefer p4 adds them; this item imports.
- `PPPPtherapy-/PPPPtherapy-/app/src/components/tabs/OverviewTab.tsx` — mount `<MonthlyGrowthCard />` at the top of Today content (coordinate with b1-daily-home).
- `PPPPtherapy-/PPPPtherapy-/app/src/lib/i18n.ts` — append the `growthCard.*` keys to EN + HE blocks (append-only).
- (Native, optional, behind capability check) `PPPPtherapy-/PPPPtherapy-/app/src/lib/native.ts` — add an opt-in `scheduleMonthlyGrowthNudge()` guarded by `isNativePlatform` + plugin presence + granted consent; degrades to no-op on web/denied.

### Shared-file conflict notes
- **`lib/reportExport.ts`** (hotspot: p2-hero-everywhere, c3, p2-8, mk-p0-3, mk-p2-6): per the hotspot rule, the clinical PDF path stays single and the image renderer lives in `shareCard.ts`. **This item makes NO edit to `reportExport.ts`** — it consumes the `growth_card` template that mk-p0-3 built in `shareCard.ts`. The work item lists `reportExport.ts` as a shared file only because of the renderer lineage; in practice this spec touches `shareCard.ts` (already shipped by P0-3), not `reportExport.ts`. Build the data layer beside the renderer; do not fork `buildReport`.
- **`lib/loopEvents.ts`** (hotspot: p4 + all mk items): **p4-operational-hardening wires the dead exports and owns event names first.** This item imports the wired helpers and, for the three new `reengage_*` names, coordinates with p4 to add them in p4's pass — never racing the file. Once wired, names are frozen. The `LoopArtifact` union already contains `"growth_card"` — no edit.
- **`lib/api.ts`** (hotspot: p1-comic-reader, p4, c3): append `api.growthCard` as one new method object-property next to `api.digest`; do not reorder or refactor the `api` object. Land after p4 (which also touches this file) to take its retry/hardening wrapper for free.
- **`components/tabs/OverviewTab.tsx`** (hotspot: b1-daily-home, c1-rhythm, ia-b1, m5): mount the card as a single self-contained child at the top; **do not restructure Today layout** — b1-daily-home owns that reorg. Land after b1 so the host shell is settled; insert one `<MonthlyGrowthCard />` line.
- **`lib/i18n.ts`** (hotspot: mk-p0-8, mk-p2-1, mk-p2-7): append-only to each language block; reconcile any `growthCard.*` collision with the copy-pack by deferring to copy-pack wording. **Reuse** the existing `share.cta.growth`/`share.caption.growth` keys from P0-3 — do not redefine.
- **`server/digest.ts`** — NOT in the hotspot/shared-file map; append the monthly functions safely.
- **`server/createApp.ts`** (hotspot: ArborContext-adjacent, p4 touches it): only a one-token addition to the route-gate array at `:117`; coordinate with p4 to avoid a trivial merge by appending at the end of the array literal.

### Dependencies (other item ids that must land first)
- **mk-p0-3-share-export** (hard) — ships `lib/shareCard.ts`, the `growth_card` template stub + renderer hook, the `<ShareButton>` primitive, and the share/loop-event wiring this item consumes. Without it there is no renderer to feed.
- **p4-operational-hardening** (hard) — owns `loopEvents.ts` event-name wiring and the `lib/api.ts`/`analytics.ts` hardening; lands the `reengage_*` event names and the API retry wrapper this item rides on.
- **mk-p0-4-analytics-wiring** (transitive via p4) — `track()` must route with first-touch attribution global props live before re-engagement events are meaningful.
- **mk-p0-1-domain** (soft) — canonical URL for the share caption/watermark; until then P0-3's `SHARE_URL` placeholder is used (one-line swap).
- **b1-daily-home** (soft/ordering) — settles Today layout before the card is mounted there.

### Acceptance criteria (testable, including "verified live on dev server")
1. `tsc` + `npm run build` pass; `npm test` green incl. new `growthCard.test.ts` and the appended `digest.test.ts` monthly cases (month gating: same month after open/dismiss → `shouldShowMonthlyCard` false; new month → true; zero-moment month → quiet variant flag set).
2. `POST /api/growth-card` returns `{ ...narrative, stats, generated: "ai"|"fallback" }`, mirrors `/digest` privacy/redaction, and is in the gated-route list (`createApp.ts:117`). With AI forced to throw, it returns the deterministic `fallback` and still 200s.
3. **Verified live on dev server**: on Today, the `MonthlyGrowthCard` appears once for a profile with current-month logs; "See the month" opens the sheet showing the rendered branded growth-card PNG (hero + name + month headline + "Made with Arbor" + URL band) produced by the P0-3 `growth_card` template; the `<ShareButton>` shares it.
4. **Verified live**: after opening or dismissing, the card does not reappear within the same calendar month (localStorage persisted); simulating a new month (clearing/advancing the stored month key) re-shows it.
5. Quiet-month variant: a profile with zero current-month moments shows the low-key card with "Log a moment" and **no** share button.
6. DevTools console (DEV) shows `[track] reengage_card_shown`, `reengage_card_opened`, `reengage_card_dismissed` with `{ artifact: "growth_card", month }`; share fires the existing P0-3 `share_initiated`/`share_completed` events.
7. a11y: card section + buttons reachable/activatable by keyboard, descriptive `aria-label`s; under `prefers-reduced-motion` no entrance/scale animation; under `dir="rtl"` (HE) labels render and the card mirrors.
8. Native (Android emulator via `npx cap run android`): if `@capacitor/local-notifications` + granted consent, an opt-in monthly nudge can be scheduled; if absent/denied, the app behaves identically minus the notification (no crash). iOS marked "code-complete, verify on Mac."
9. The monthly payload includes `subject`/`preheader`/`summary` (email/push-ready) even though no email send is wired — verified by inspecting the route response.

### Operating-rule checks
- **No dark patterns** — at most one card per calendar month; dismiss is one tap, honored silently for the month, no re-nag, no guilt copy on quiet months; sharing is explicit/opt-in via the P0-3 ShareButton; the opt-in local notification is the only push and degrades to nothing without consent. Nothing auto-posts or auto-emails.
- **Privacy / COPPA-2026** — the artifact uses only the **stylized hero avatar** (never a raw face, per `heroCard.ts`/`AvatarCreator` discard rule) + first name + month stat counts; the `/api/growth-card` route applies the same `createRedaction`/`REDACTION_DIRECTIVE` privacy wrapper as `/digest`; canvas render is 100% on-device (no upload); referral code is baked into the tappable *caption*, never rendered as readable image text (P0-3 rule). No new child PII surfaced.
- **Moat read/write** — the monthly card **reads** the longitudinal memory (a month of logged moments + milestone progress, computed truthfully server-side) and **writes** `reengage_*` + share events to the per-user `users/{uid}/events` collection via `track()`, feeding the loop dashboards. Re-engagement that pulls a lapsing parent back to logging is directly moat-reinforcing.
- **Ships-visible** — a real user-facing card in the app shell on Today, an openable branded artifact, a working share, and an observable event stream. Integrated on top of the existing weekly-digest stats core and the P0-3 share engine — one renderer, one stats core, not a bolted-on second system.
