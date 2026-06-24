## p2-6-jitai — JITAI nudge engine
**Aspects:** IA, UI/UX, Copy · **Surfaces/platforms:** web:Today, web:Grow, ios, android · **Priority:** Phase2

### Problem / why
EB #6 == PRD C3: the wedge no competitor operationalizes. Today Arbor's nudge is a **pure rules engine** (`src/lib/jitai.ts` → `nextNudge`) that fires one cue off the *predicted rhythm* crossed with **clock hour** (`hour >= peak - 2`, `hour === windDownHour`, `hour >= 15`). That is anticipatory but still clock-anchored, has **no personalization, no learning, and no delivery channel** other than an in-app card rendered only when Today happens to be open (`OverviewTab.tsx:148–151, 254–268`). The separate `RemindersCard.tsx` fires **fixed-clock** browser `Notification`s and explicitly notes "Background push would require FCM + a server worker." So the child's logged state never actually *times* a send.

This item turns the existing rules engine into a **just-in-time adaptive intervention (JITAI)**: nudges are selected and **timed off the child's logged behavioural state** (moments, intensity trend, practice gaps), use a **group-level cold-start** rule set that **personalizes the preferred send-window after ~10–20 logged events**, learn from the parent's **act/snooze/dismiss receptivity**, and can be **delivered as a native local notification** at the learned moment on iOS/Android — not at a fixed 7pm. It hosts on Today's existing nudge slot, adds a Grow placement, and adds a scheduled native delivery path.

Scope is deliberately **on-device / heuristic ML** (decayed receptivity weights per hour-band + cold-start priors). No new server model is required; the existing `modelRouter` (`analysis_structured` route) is used **only** to phrase the nudge copy when a dependable signal exists, behind a feature flag — never to decide *whether* to fire.

### Scope across platform domains
- **Web (Today)** — replace the thin `JitaiInputs` with a state-derived input built from `behaviorLogs` + momentum (`computeMomentum`) + practice signals; render the same nudge card but driven by the new engine, with a receptivity feedback control (act / not now / dismiss).
- **Web (Grow)** — surface the **practice-flavoured** nudge (the `practice`/`prep` kinds) at the top of the Grow hub (`DevelopmentTab` / Practice host) so the cue appears where the parent acts on it, not only on Today. One nudge max across the app per session (dedupe by id).
- **iOS (Capacitor)** — schedule the selected nudge as a **`@capacitor/local-notifications`** at the learned send-time; tapping it deep-links to the nudge action tab. No remote push server needed (stays on-device, COPPA-clean).
- **Android (Capacitor)** — same local-notification path; Android 13+ runtime `POST_NOTIFICATIONS` permission handled by the plugin; channel registered in `initNativeShell`.
- **Landing EN / Landing HE** — out of scope (no marketing change in this item).

### IA / UX / Copy detail

#### Engine (the core change) — `src/lib/jitai.ts`
Keep `Nudge`/`NudgeKind` exports and `nextNudge` signature **backwards-compatible** (OverviewTab already calls it), but extend the engine:

1. **New state-aware inputs.** Add optional fields to `JitaiInputs` (all optional → existing callers keep compiling):
   - `intensityTrend?: "easing" | "rising" | "flat" | "none"` (from `computeMomentum().intensityTrend`)
   - `topPattern?: string | null`, `topContext?: string | null` (from momentum)
   - `practiceGapDomains?: PracticeDomain[]` (domains with `band` ≤ "developing" from `domainBands`)
   - `receptivity?: ReceptivityModel` (the learned per-hour-band weights; see below)
   - `eventCount?: number` (total logged behaviour+practice events → drives cold-start→personalized switch at ≥10, full personalization at ≥20)
2. **Cold-start vs personalized selection.** Add `pickSendWindow(receptivity, rhythm, eventCount): { hour: number; basis: "cold-start" | "personalized" }`. With `eventCount < 10` → return the **rhythm-derived** window (current behaviour, basis `"cold-start"`). With `eventCount ≥ 10` → return the hour-band with the **highest decayed receptivity weight**, falling back to rhythm if weights are flat. Never invent precision: when no signal, return `null` and the engine stays quiet.
3. **Richer nudge selection.** Extend the priority ladder so the body text reflects logged state when present: a `prep` nudge for a `rising` intensity trend names `topPattern`/`topContext` ("More **{pattern}** moments this week, usually at **{context}** — a calm move before then tends to soften it."); a `practice` nudge targets the lowest-band `practiceGapDomains[0]`. Selection stays **deterministic** (no `Math.random`); silence remains a valid output.
4. **Pure + injectable.** Continue to take `nowMs`; add `pickSendWindow` and a new `recordReceptivity(model, hour, outcome): ReceptivityModel` reducer (pure, returns a new model). Outcome ∈ `"acted" | "snoozed" | "dismissed"`. Weight update: exponential decay (`w = w*0.85 + delta`), `delta` = +1 acted, 0 snoozed, −0.5 dismissed, bucketed into 4 day-bands (morning 6–11, midday 11–15, afternoon 15–19, evening 19–22).

#### Receptivity persistence — `src/lib/jitaiStore.ts` (NEW)
Thin localStorage wrapper keyed `arbor.jitai.<childId>`: `{ model: ReceptivityModel; lastFiredId?: string; lastFiredAt?: string; snoozedUntil?: string; eventCount: number }`. Provides `loadJitaiState(childId)`, `saveJitaiState(childId, state)`, `applyOutcome(childId, hour, outcome)`. **Snooze** sets `snoozedUntil = +3h`; the engine suppresses all nudges while `nowMs < snoozedUntil`. Mirrors the localStorage pattern already used in `RemindersCard.tsx:31–52`. No raw behaviour content is stored here — only aggregate weights (privacy-first).

#### Today host — `src/components/tabs/OverviewTab.tsx`
- Build the new inputs from data already in scope: `behaviorLogs` (present), add `momentum = useMemo(() => computeMomentum(behaviorLogs, actionPlans, milestones), …)` and reuse `recentCount`. Pass `intensityTrend`, `topPattern`, `topContext`, `receptivity` (from `loadJitaiState`), `eventCount`.
- Keep the existing card markup (`OverviewTab.tsx:254–268`); **add a feedback row** under the CTA: two ghost controls — `Not now` (snooze 3h) and a dismiss `×` (top-right). On primary CTA → call `applyOutcome(childId, hour, "acted")` then run existing `onNudge`; on snooze → `"snoozed"`; on dismiss → `"dismissed"`. After any outcome the card animates out.
- **States:** default = nudge card; loading = none (engine is synchronous, no skeleton); empty = render nothing (silence is a feature — no "no nudges" placeholder); error = wrap `loadJitaiState`/`nextNudge` in try/catch, fall back to the cold-start rules path on throw (never crash Today).

#### Grow host — `src/components/tabs/DevelopmentTab.tsx`
- Render a compact variant of the **same** nudge **only** when `nudge.kind ∈ {"prep","practice"}` and it was **not** already shown on Today this session (dedupe via a module-level `shownNudgeIds: Set<string>` in `jitaiStore`). Reuse the card; route CTA into the Practice hub.

#### Native scheduling — `src/lib/nativeNudge.ts` (NEW) + `src/lib/native.ts`
- `scheduleNudgeNotification(nudge, sendHour, childName)`: dynamic-import `@capacitor/local-notifications` (mirrors the dynamic-import no-op-on-web pattern in `native.ts:13–37`). Request permission lazily on first schedule; if denied, no-op. Schedule **one** notification for today at `sendHour:00` local (or tomorrow if already past), id derived from `nudge.kind`+date so re-renders don't duplicate. `extra: { tab: nudge.action }` for deep-link.
- In `initNativeShell()` add: register the Android notification channel (`arbor-nudges`, importance default) and attach a `localNotificationActionPerformed` listener that sets the hash route to `nudge.action` tab (reuse the app's existing hash routing).
- **No-op on web** (`isNativePlatform` guard) → web behaviour byte-for-byte unchanged.

#### Copy (actual strings — calm, parent-register, no guilt, no dark patterns)
- prep / rising: `Get ahead of {window}` · `More "{pattern}" moments this week, usually {context}. A calm move now tends to soften the next one.` · CTA `Get a 1-line script`
- prep / cold-start (unchanged): `Get ahead of {window}` · `Around {window} tends to be a harder stretch for {name}. A calm move now usually softens it.`
- calm: `Time to start winding down` · `Evenings go smoother when the wind-down starts before everyone's tired.` · CTA `Open a calm-down`
- practice / gap: `A quick win for {name}` · `{Domain} could use a little play this week — two minutes keeps it moving.` · CTA `Practice & Play`
- log: `Capture a moment from {name}'s day` · `One quick note keeps the picture growing — and makes every tip sharper.` · CTA `Log a moment`
- feedback controls: `Not now` (snooze) · aria-label on dismiss: `Dismiss this nudge`
- native notification title = `nudge.headline`; body = first sentence of `nudge.body` (truncate to ~120 chars).
- All copy via existing `t()` i18n keys (`ov.jitai.*`); add EN keys; HE keys appended (append-only, no reorder) so RTL renders (the card is flex, already RTL-safe).

#### A11y / motion / RTL / touch
- Card already uses semantic `<section>`; add `role="status"` + `aria-live="polite"` so the nudge is announced once when it appears (not on every render — gate with the dedupe set).
- Feedback controls are real `<button>`s, focus-visible ring, **min 44×44** touch target (CTA already `min-h-[44px]`; make `Not now` and `×` ≥44px).
- `prefers-reduced-motion`: the exit animation must collapse to opacity-only (use the existing `motion` reduced-motion handling; no translate/scale when reduced).
- RTL: keep flex layout, use logical props; the `×` sits at inline-end (`end-0`), not hard-right.
- Contrast: nudge text uses `PASTEL[tone].ink` on `PASTEL[tone].soft` — verify AA (≥4.5:1) for each of the 4 tones; if any tone fails, render body text in `var(--arbor-ink)`/`--arbor-muted` instead of the tone ink.

### Files to create / edit (exact repo-relative paths)
**Edit**
- `PPPPtherapy-/PPPPtherapy-/app/src/lib/jitai.ts` — extend inputs, add `pickSendWindow`, `recordReceptivity`, `ReceptivityModel`; richer state-aware selection (back-compat).
- `PPPPtherapy-/PPPPtherapy-/app/src/practice/signals.ts` — export a small helper `practiceGapDomains(bands): PracticeDomain[]` (lowest-band domains) for the engine. **Append only**, no edits to existing exports.
- `PPPPtherapy-/PPPPtherapy-/app/src/ai/modelRouter.ts` — **no signature change**; only consumed (route `analysis_structured`) by an optional server copy-polish path. If a server endpoint is added it lives in `src/server/`; do **not** alter routing/provider logic here. (Listed as a sharedFile because the feature reads its route enum; treat as read-only.)
- `PPPPtherapy-/PPPPtherapy-/app/src/components/overview/RemindersCard.tsx` — add a one-line cross-link ("Smart nudges adapt to {name}'s rhythm — manage in Settings") and ensure it does **not** double-fire with the JITAI native path (gate the daily-log `Notification` behind "no JITAI nudge scheduled today").
- `PPPPtherapy-/PPPPtherapy-/app/src/components/tabs/OverviewTab.tsx` — new inputs + feedback controls (within the existing nudge `<section>`).
- `PPPPtherapy-/PPPPtherapy-/app/src/components/tabs/DevelopmentTab.tsx` — Grow placement of the practice/prep nudge.
- `PPPPtherapy-/PPPPtherapy-/app/src/lib/native.ts` — register nudge channel + tap listener inside `initNativeShell`.
- `PPPPtherapy-/PPPPtherapy-/app/src/components/i18n/*` (or wherever `t()` keys live) — add `ov.jitai.*` EN + HE keys.

**Create**
- `PPPPtherapy-/PPPPtherapy-/app/src/lib/jitaiStore.ts` — receptivity persistence + snooze + dedupe set.
- `PPPPtherapy-/PPPPtherapy-/app/src/lib/nativeNudge.ts` — Capacitor local-notification scheduling (dynamic import, web no-op).
- `PPPPtherapy-/PPPPtherapy-/app/src/lib/jitaiStore.test.ts` and extend `PPPPtherapy-/PPPPtherapy-/app/src/lib/jitai.test.ts` — cover cold-start→personalized switch, receptivity decay, snooze suppression, silence.

**Dependency add**
- `PPPPtherapy-/PPPPtherapy-/app/package.json` — add `@capacitor/local-notifications` (^8 to match other `@capacitor/*` ^8 deps); run `npx cap sync` for native projects.

### Shared-file conflict notes
- `src/practice/signals.ts` — also touched by **p2-10-kid-asr**. Per the conflict map both append; coordinate by **appending** the `practiceGapDomains` helper at the end of the file, no reorder of existing exports. Land after p2-10 if it merges first, else flag for a trivial merge.
- `src/ai/modelRouter.ts` — also touched by **p4-operational-hardening** (which owns retry/usage/telemetry). Per `dependsOn`, **p4 lands first**; this item treats `modelRouter.ts` as **read-only** (consumes the route enum only) to avoid clobbering p4's changes. Do not edit provider/retry logic.
- `src/lib/native.ts` — also touched by **m1-ios-safe-area / surf-ios / surf-android** (which own status bar / safe-area / api-base shim). Add **only** the notification-channel + listener block as a new `try/catch` section appended inside `initNativeShell`; do not reorder the existing status-bar/keyboard/splash blocks. Coordinate so m1 lands its safe-area block first; this appends after.
- `src/components/overview/RemindersCard.tsx` — not in the cross-item hotspot list (no parallel writers); safe, but keep the change additive.
- `OverviewTab.tsx` / `DevelopmentTab.tsx` are touched by other IA missions (b1-daily-home, c1-rhythm; p2-5-milestone-rebase, c4-dev-score). **Scope edits to the JITAI nudge `<section>` only** — do not touch the rhythm strip, recommendation well, or development-score regions. Land after the b1/c1 (Today) and p2-5 (Grow) reorgs settle.

### Dependencies (other item ids that must land first)
- **p4-operational-hardening** — owns `modelRouter.ts` retry/usage; this item must build on the stabilized router (and reuse its analytics for nudge-fired/acted events). *(declared)*
- **p2-5-milestone-rebase** — rebases milestones/`types.ts`/`DevelopmentTab.tsx`; the Grow placement and `practiceGapDomains` consume the rebased bands, so land after. *(declared)*
- Soft: **b1-daily-home** / **c1-rhythm** (Today reorg + `predictRhythm` write-back) should settle first since the engine reads `rhythm`.

### Acceptance criteria (testable)
1. `npm run build` (tsc + vite) passes; `npm test` green including new `jitai`/`jitaiStore` tests.
2. **Cold-start:** with `eventCount < 10`, `pickSendWindow` returns the rhythm-derived window with `basis: "cold-start"` (unit test).
3. **Personalization:** after ≥10 simulated `"acted"` outcomes biased to one day-band, `pickSendWindow` returns that band with `basis: "personalized"` (unit test).
4. **Receptivity decay:** `recordReceptivity` is pure, applies 0.85 decay + signed delta, never mutates input (unit test).
5. **Snooze:** with `snoozedUntil` in the future, `nextNudge` returns `null` regardless of state (unit test).
6. **Silence:** empty logs + cold-start + morning hour with no friction signal → `nextNudge` returns `null` (no card, no placeholder).
7. **Today (verified live on dev server):** with seeded logs showing a rising intensity trend, the nudge card shows the state-aware body naming the top pattern; clicking the CTA records `"acted"` and routes to `coach`; `Not now` hides it for 3h; `×` dismisses and updates weights.
8. **Grow (verified live on dev server):** the practice/prep nudge appears at the top of Grow and is **not** duplicated if already shown on Today this session.
9. **Native:** on a Capacitor build (`npx cap run android` or iOS sim) a local notification is scheduled at the learned hour; tapping it opens the correct tab. Web build schedules nothing (no-op) and is byte-for-byte unchanged.
10. **a11y:** card is announced once via `aria-live="polite"`; all controls keyboard-reachable with visible focus and ≥44px targets; reduced-motion uses opacity-only exit; verified in both LTR and RTL.

### Operating-rule checks
- **No dark patterns:** silence is a valid output; `Not now`/dismiss are first-class and respected (3h snooze, weight decay); at most one nudge per session app-wide; no streak-shaming or fake urgency; copy is supportive, never guilt-based.
- **Privacy / COPPA-2026:** receptivity store holds only **aggregate hour-band weights** + counts — no behaviour content, no child PII; native notifications are **on-device local** (no remote push server, no third-party token). Notification permission requested lazily and only after the user has an active nudge preference.
- **Moat read/write:** the engine **reads** the longitudinal record (`behaviorLogs`, momentum, `domainBands`, `predictRhythm`) — exactly the per-child signal a content-only rival can't replicate — and **writes** receptivity learning back, deepening the moat over time. Nudge-fired / acted / snoozed events flow through the existing loop/analytics layer (post-p4).
- **Ships-visible:** lands on Today's existing nudge slot and a new Grow placement; native users get a real local notification at the learned time — observable behaviour change, not internal-only plumbing.
