## mk-p0-4-analytics-wiring — Analytics events wired (kill dead exports)
**Aspects:** Marketing · **Surfaces/platforms:** app:shell · **Priority:** P0

### Problem / why
`src/lib/loopEvents.ts` defines the canonical growth-loop funnel (install → activation → habit → refer → pay), but five of its helpers are **dead exports with zero call-sites** (verified by grep across `app/src` on 2026-06-17):

- `trackShareInitiated(artifact, surface?)` — `loopEvents.ts:56`
- `trackShareCompleted(artifact, channel?)` — `loopEvents.ts:59`
- `trackInviteSent(channel?)` — `loopEvents.ts:62`
- `trackTrialStart(tier)` — `loopEvents.ts:65`
- `trackPaid(tier)` — `loopEvents.ts:67`

Only `trackAppStart` (`main.tsx:21`), `trackProfileCreated` (`ProfileContext.tsx:136`), and `trackFirstPlan` (`ArborContext.tsx:754`) are wired today. Without the refer/pay/share events firing, **K-factor and CAC→LTV are unmeasurable**, the marketing dashboard has install + activation but no loop or conversion data, and **mk-p1-6 (loop optimization) is impossible** — it has nothing to optimize against. This item closes the funnel: every existing share/refer/pay surface that *already ships in the live app* gets its loop event wired, and the event-name contract is frozen so the parallel missions that build new surfaces (mk-p0-2 referral, mk-p0-3 share-export, mk-p2-6 growth-card) import stable names.

This is the **first writer** on `loopEvents.ts` and `analytics.ts` per the conflict plan — it wires the dead exports and freezes names before any other mission imports them.

### Scope across platform domains
- **Web app (app:shell):** primary surface. Wire `trackTrialStart`/`trackPaid` on the billing-return path; wire `trackShareInitiated`/`trackShareCompleted` at the share/copy surfaces that exist today (Coach answer-card copy, Ask-a-Specialist packet copy). Add a single billing-return handler at app boot. Enrich `trackProfileCreated` with the child's band.
- **iOS (Capacitor) / Android (Capacitor):** same JS bundle, so wiring is shared. One platform nuance: native billing returns via RevenueCat (`server/billing.ts` maps `app_store`/`play_store`), not a web redirect — so the `trackPaid`/`trackTrialStart` trigger MUST be driven by the **entitlement transition** (free → paid/in_trial), not by the web `?billing=success` query param alone, so it fires correctly on native. See instrumentation detail below. No native-shell code changes.
- **Landing EN / Landing HE (RTL):** out of scope. Landing-page UTM/attribution is mk-p0-5; this item is in-app event wiring only.

### IA / UX / Copy / Marketing detail (Marketing — instrumentation)
No visible UI changes. This is pure instrumentation on top of the existing `track()` pipe in `lib/analytics.ts` (writes to `users/${uid}/events` in Firestore, first-party only, attribution auto-merged via `setGlobalProps` at `main.tsx:20`). All events inherit first-touch attribution (`market`/`source`/`referral_code`/`utm_*`) for free, so each becomes sliceable by acquisition channel.

**1) Pay funnel — `trackTrialStart` / `trackPaid` (the highest-value gap).**
Billing checkout today redirects out to a hosted Stripe/RevenueCat URL (`SettingsModal.tsx:60-61`, `window.location.href = url`) and there is **no return handler** (grep for `billing`/`checkout=`/`refreshEntitlement` in `App.tsx` → no matches). The honest, dedup-safe place to fire pay events is on the **entitlement transition**, which covers both web redirect-back and native RevenueCat:
- Add a billing-return effect in `App.tsx` (app shell): on mount, if `window.location.search` contains `billing=success`, call `refreshEntitlement()` (`hooks/useEntitlement.ts:29`) and strip the param via `history.replaceState`.
- Add a transition watcher: compare the **previous** entitlement plan (persisted in `localStorage` key `arbor.lastBilledPlan`) against the freshly-fetched `entitlement.plan` + `entitlement.status`. When it crosses from a non-paid state into `status === "in_trial"`, fire `trackTrialStart(entitlement.plan)` once; when it crosses into `status === "active"` on a paid plan (`plan !== "free"`, `provider !== "comp"`/`"none"`, and not beta), fire `trackPaid(entitlement.plan)` once. Persist the new state so it never double-fires (mirror the `once()` dedup pattern in `loopEvents.ts:30`).
- Guard against beta: `entitlement.source`/beta resolves everyone to Plus today (see MEMORY: Arbor Payment Model). Do **not** fire `trackPaid` when `provider === "comp"` or `provider === "none"` or when the beta flag is set — otherwise every beta user pollutes the paid count. Use the same `isBeta`/`provider` checks already present in `SettingsModal.tsx:47,108`.

**2) Share funnel — `trackShareInitiated` / `trackShareCompleted`.**
Wire the two share/copy surfaces that exist in the live app today:
- **Coach answer card copy** (`components/coach/CoachAnswerCards.tsx:62`, `copy()` → `navigator.clipboard.writeText`): fire `trackShareInitiated("answer_card", "coach")` at the start of `copy()` and `trackShareCompleted("answer_card", "clipboard")` after the write resolves.
- **Ask-a-Specialist packet copy** (`components/sections/AskSpecialist.tsx:50`, `navigator.clipboard.writeText(markdown())`): fire `trackShareInitiated("story", "ask_specialist")` before the write and `trackShareCompleted("story", "clipboard")` on success. (`LoopArtifact` union = `avatar | story | answer_card | growth_card`; reuse `story` for the packet — do not add a new artifact value here, leave union edits to the surface-owning missions.)
- **Avatar share (`avatar`) and growth-card (`growth_card`)** are NOT wired here — those surfaces are built by mk-p0-3 (share-export / AvatarCreator) and mk-p2-6 (growth-card). They import the now-stable `trackShareInitiated/Completed` once their UI lands. This spec only freezes the names + signatures they consume.

**3) Invite funnel — `trackInviteSent`.**
The referral/invite UI is built by **mk-p0-2-referral-loop** (it owns `attribution.ts` + `entitlements.ts` + `billing.ts` referral plumbing). `trackInviteSent` has no surface to attach to until that lands. This item keeps the export and its signature `(channel?: string)` frozen and documents the contract; mk-p0-2 calls it at its "invite sent" action. Do **not** add a placeholder call-site.

**4) Activation enrichment — `trackProfileCreated` band.**
`ProfileContext.tsx:136` calls `trackProfileCreated(count)` without the optional `band`. Pass the new child's band (`newChild.band` / age-band derivation already in scope) so activation is sliceable by age band: `trackProfileCreated(count, newChild.band)`. Low-risk, same writer.

**Event contract (frozen — do not rename; dashboards + mk-p1-6 depend on these):** `install`, `app_open`, `profile_created`, `first_plan`, `share_initiated`, `share_completed`, `invite_sent`, `invite_activated`, `trial_start`, `paid` (all already defined in `LoopEvent`, `loopEvents.ts:12-23`). This item adds **no new event names** — it only adds call-sites for existing names.

### Files to create / edit (exact repo-relative paths)
- **Edit** `PPPPtherapy-/PPPPtherapy-/app/src/App.tsx` — add billing-return effect: read `?billing=success`, `refreshEntitlement()`, clean URL, and run the entitlement-transition watcher that fires `trackTrialStart`/`trackPaid` once per transition (localStorage-deduped).
- **Edit** `PPPPtherapy-/PPPPtherapy-/app/src/context/ProfileContext.tsx` — pass `band` to `trackProfileCreated` (line ~136).
- **Edit** `PPPPtherapy-/PPPPtherapy-/app/src/components/coach/CoachAnswerCards.tsx` — wire `trackShareInitiated/Completed("answer_card", …)` in `copy()` (line ~62).
- **Edit** `PPPPtherapy-/PPPPtherapy-/app/src/components/sections/AskSpecialist.tsx` — wire `trackShareInitiated/Completed("story", …)` around the clipboard write (line ~50).
- **Edit (comment only)** `PPPPtherapy-/PPPPtherapy-/app/src/lib/loopEvents.ts` — add a one-line "wired by:" note above each share/invite/pay helper documenting its call-site / owning mission; keep names + signatures unchanged. (No logic change — preserves the frozen contract.)
- **Edit (none expected)** `PPPPtherapy-/PPPPtherapy-/app/src/lib/analytics.ts` — `track()` already merges global attribution; touch only if a tiny helper is needed. Avoid changes here to minimize conflict surface.
- **Create** `PPPPtherapy-/PPPPtherapy-/app/src/lib/loopEvents.test.ts` (if not present) — unit test the new wiring paths via a mocked `track`.
- **Note:** `context/ArborContext.tsx` is listed in `sharedFiles` but **no edit is required** here — `trackFirstPlan` is already wired at `ArborContext.tsx:754`. Touching it risks colliding with p4 / ia-b1 / b5. Leave it untouched.

### Shared-file conflict notes
- `lib/loopEvents.ts` (hotspot: p4, mk-p0-2, mk-p0-3, mk-p0-4, mk-p1-6, mk-p2-6): **mk-p0-4 is the designated first writer** — wire the dead exports and freeze event names FIRST; all other missions import the stable names after. **Do not rename any event** once wired. Only append comments; do not reorder the `LoopEvent` map or change signatures.
- `lib/analytics.ts` (hotspot: p4, mk-p0-4, mk-p1-6): avoid edits; if unavoidable, append only — p4 (operational-hardening) also touches retry/telemetry here, so keep changes additive and non-overlapping.
- `context/ArborContext.tsx` (hotspot: b5, ia-b1, mk-p0-4, p4): **do not edit** in this item (see Files note). The conflict plan says "do p4 + mk-p0-4 handler/event wiring before the IA edits" — for mk-p0-4 that handler work lands in `App.tsx`, not the god-context, so we sidestep the collision entirely.
- `context/ProfileContext.tsx`: only mk-p0-4 touches it — safe; minimal 1-line change.
- `App.tsx`: not in the cross-mission hotspot list — the billing-return effect is a clean addition.
- `CoachAnswerCards.tsx` / `AskSpecialist.tsx`: not flagged as hotspots; c3-ask-specialist touches `AskSpecialist.tsx` broadly — land mk-p0-4's 2-line share wiring as a tight, isolated diff and coordinate ordering with c3 (prefer mk-p0-4 first since it is P0 and additive).

### Dependencies (other item ids that must land first)
- **None.** This item is the unblocker. It depends on nothing and explicitly unblocks **mk-p1-6** (loop optimization), and provides the stable `trackShareInitiated/Completed` + `trackInviteSent` contract that **mk-p0-2** (invite call-site), **mk-p0-3** (avatar/answer share), and **mk-p2-6** (growth-card share) consume.

### Acceptance criteria (testable, including verified live on dev server)
1. `grep -rn "trackShareInitiated\|trackShareCompleted\|trackTrialStart\|trackPaid" app/src` returns **≥1 non-definition call-site each** (zero dead among the wired-here set: share + pay). `trackInviteSent` remains export-only with a documented owner (mk-p0-2).
2. `npx tsc --noEmit` passes; existing test suite (241+ tests) stays green; new `loopEvents.test.ts` asserts `copy()` and the packet-copy path emit `share_initiated` then `share_completed`, and the billing-transition watcher emits `trial_start`/`paid` exactly once per transition and never for beta/comp.
3. **Verified live on dev server** (`npm run dev`, web): in DEV, `track()` logs to console (`analytics.ts:42`). Copy a Coach answer card → console shows `[track] share_initiated {artifact:"answer_card",…}` then `[track] share_completed {…channel:"clipboard"}`, both carrying merged attribution props. Add a child → `[track] profile_created {child_count, band}`.
4. Simulate billing return: load `/?billing=success` with a stubbed entitlement flipping free→active(paid, provider≠comp) → console shows a single `[track] paid {tier:"plus"}`; reloading the same URL does **not** re-fire (localStorage dedup). A beta/comp entitlement fires **nothing**.
5. Event names are byte-identical to `LoopEvent` (`loopEvents.ts:12-23`); no event renamed or added.

### Operating-rule checks
- **No dark patterns:** first-party, server-side Firestore analytics only — no third-party scripts, no cross-site tracking, no fingerprinting (matches `analytics.ts` doc). No new prompts or growth nags added; instrumentation is invisible to the user.
- **Privacy / COPPA-2026:** events carry only the child's age **band** (already coarse, non-PII) and counts/tiers — never a child name, free-text, or content. Share/packet events record `artifact` + `channel`, not the shared payload. Events write to the signed-in parent's own `users/${uid}/events` collection; sandbox/`local-sandbox` uids are skipped (`analytics.ts:35`).
- **Moat read/write:** these events are the measurement layer over the longitudinal moat — activation (`first_plan`), habit, and conversion become attributable to channel, feeding the closed-loop growth the moat depends on. No moat data is duplicated into events.
- **Ships-visible:** end-to-end operational on web + native via the existing `track()` pipe; deployable behind no flag; the marketing dashboard reads the new `share_*`/`trial_start`/`paid` events immediately.
