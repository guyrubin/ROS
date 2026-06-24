## c1-rhythm — Rhythm — predictive daily timeline
**Aspects:** IA, UI/UX, Copy · **Surfaces/platforms:** web:Today, ios, android · **Priority:** Phase2

### Problem / why
Redesign C1 (tenant of `b1-daily-home`). The Rhythm engine and strip already ship:
`predictRhythm()` (`app/src/rhythm/predict.ts`) turns the family behaviour log into an
anticipatory read of *today* (friction peak, calm window, wind-down), and `RhythmStrip.tsx`
renders it inside Today. But Rhythm is currently **read-only and dead-ends**:

1. **No memory-loop write-back.** A repeated friction peak (e.g. "hard around 5pm" seen 10 days
   running) is exactly the kind of durable, parent-confirmable fact the memory moat exists to
   hold — yet Rhythm never proposes it. The pattern is recomputed from raw logs every render and
   forgotten. The redesign's north-star is that *every* feature reads/writes the longitudinal
   moat; Rhythm reads (`behaviorLogs`) but never writes.
2. **Only one contextual action.** The friction chip routes to Coach with a canned prompt
   (`prepWindow`, `OverviewTab.tsx:80`). The wind-down and calm-window chips are inert
   `<span>`s — no action, not focusable. A predicted hard hour should let the parent *do*
   something (prep a script, set a one-tap reminder) and a calm window should be one tap to
   "use this for today's Daily Play".

This item: (a) wire Rhythm → memory proposal write-back (parent-approved, never silent), and
(b) make every insight chip an actionable, accessible control. No engine maths change — the
`predictRhythm` contract and its tests (`predict.test.ts`) stay intact.

### Scope across platform domains
- **Web (Today / `OverviewTab`):** primary surface. New write-back hook + actionable chips.
- **iOS (Capacitor):** same React bundle — no native code. Verify the new POST goes through the
  `lib/native.ts` api-base shim (relative `/api/...` works in web; native build needs the
  absolute base). Touch targets ≥44px for the new buttons.
- **Android (Capacitor):** same as iOS; verify active-state / tap feedback and 48dp targets.
- **Landing EN / HE:** out of scope.

### IA / UX / Copy detail

#### IA
- Rhythm stays a tenant **inside Today**, rendered by `OverviewTab` (host shell owned by
  `b1-daily-home`). No new nav leaf, no route. `navigation.ts` is **not** touched by c1.
- Write-back targets the existing memory ledger (`memoryReviewItems` → Child Memory review queue),
  so the proposed fact surfaces in the **My Child › Memory** review list parents already know —
  not a new store. Single source of truth preserved.

#### UI/UX — `RhythmStrip.tsx`
Convert the three insight chips into a consistent, accessible action row, and add the write-back affordance.

- **Friction chip** (exists): keep `onPrepWindow(hour)` → Coach. Already a `<button>` (good).
- **Wind-down chip** (currently inert `<span>`): make it a `<button>` calling new
  `onSetWindDownReminder?(hour)`. On tap → emits a local reminder intent (reuses
  `RemindersCard` data path in Today; if no reminder store, fall back to `onPrepWindow`-style
  Coach prompt — see Files). Same pill styling.
- **Calm chip** (currently inert `<span>`): make it a `<button>` calling new
  `onUseCalmWindow?(startHour, endHour)` → routes to Daily Play for that window (sets a flag the
  `DailyPlayCard` reads, or simply scrolls to it). Same pill styling.
- **Confirm-the-pattern affordance (the write-back):** when `confidence === "high"` **and**
  `frictionPeak` exists **and** this peak has not already been proposed/approved as a memory,
  render a quiet inline confirm row beneath the chips:
  > "Arbor noticed {name} often has a harder time around {time}. Remember this?" · **[Remember]**  **[Not really]**
  - **[Remember]** → `onRememberPattern?(hour)` → proposes a memory (pending, parent-owned).
  - **[Not really]** → dismiss locally (localStorage key, per child + hour) so it doesn't nag.
  - Never auto-writes. The proposal lands as **pending** in Child Memory; nothing enters the AI
    context until the parent approves it there. This is the moat-write, done honestly.

- **States:**
  - *default (high confidence):* day bar + 3 action chips + (if eligible) confirm row.
  - *loading:* `predictRhythm` is synchronous (pure) — no spinner. The write-back POST shows a
    pressed/disabled state on **[Remember]** (`aria-busy`) until it resolves.
  - *empty / learning:* unchanged `learning` branch (`confidence none|low`) — no chips, no
    confirm row, shows `rhythm.learningBody` + days-to-go. Do not show write-back while learning.
  - *error:* if the write-back POST fails, revert the button, keep the row visible, and `toast`
    `rhythm.rememberError`. Never lose the parent's intent silently.
- **Motion:** reuse existing bar transition (`height .5s cubic-bezier(.22,1,.36,1)`, staggered
  `${i*18}ms`). The confirm row fades/translates in (≤200ms). All gated on `useReducedMotion()`
  (already imported) — when reduced, no transition, no translate.
- **Touch targets:** chips currently `py-1.5` (~30px) — bump action chips and the two confirm
  buttons to min-height 44px (web) via `min-h-[44px]` so iOS/Android pass. Keep pill look.
- **A11y (AA):**
  - All three chips become real `<button>`s (focusable, Enter/Space). The confirm row buttons
    are `<button>`s in a `role="group"` labelled by the confirm sentence.
  - Day bar keeps `role="img"` + `aria-label={ariaSummary}` (already correct).
  - Tone colours already use the paired `*-soft`/`*-ink` tokens (TONE map) — verify each pair
    meets ≥4.5:1 for the chip text (peach-ink on peach-soft, green-ink on green-soft,
    yellow-ink on yellow-soft). If any fails, darken the `-ink` token usage locally is NOT
    allowed (m3 owns hex) — instead flag to `m3-hex-sweep`; for c1 use the existing tokens.
  - `aria-busy` on **[Remember]** while posting; `aria-live="polite"` toast for success/error.
- **RTL:** chips use logical flex (`flex-wrap gap-2`) — already direction-agnostic. The confirm
  row must use `flex` + `gap` (not margin-left). Hebrew strings via `t()` (keys below).

#### Copy (exact strings — add to `lib/i18n.ts`, EN + HE blocks)
EN:
- `rhythm.windDownAction`: "Set a wind-down reminder for {time}"  *(replaces inert label intent; keep `rhythm.windDown` as the visible chip text)*
- `rhythm.useCalm`: "Use {from}–{to} for today's play"
- `rhythm.rememberPrompt`: "Arbor noticed {name} often has a harder time around {time}."
- `rhythm.rememberCta`: "Remember this"
- `rhythm.rememberDismiss`: "Not really"
- `rhythm.remembered`: "Saved for review. You can approve it in {name}'s Memory."
- `rhythm.rememberError`: "Couldn't save that just now. Please try again."
- `rhythm.rememberAria`: "Ask Arbor to remember that {name} often has a harder time around {time}. It will appear in Memory for your approval."

HE (RTL — mirror keys in the HE block, same placeholders):
- `rhythm.windDownAction`: "קבעו תזכורת הרגעה ל־{time}"
- `rhythm.useCalm`: "השתמשו ב־{from}–{to} למשחק של היום"
- `rhythm.rememberPrompt`: "ארבור שם לב ש{name} נוטה להתקשות בסביבות {time}."
- `rhythm.rememberCta`: "לזכור את זה"
- `rhythm.rememberDismiss`: "לא ממש"
- `rhythm.remembered`: "נשמר לבדיקה. אפשר לאשר זאת בזיכרון של {name}."
- `rhythm.rememberError`: "לא הצלחנו לשמור כרגע. נסו שוב."
- `rhythm.rememberAria`: "בקשו מארבור לזכור ש{name} נוטה להתקשות בסביבות {time}. זה יופיע בזיכרון לאישורכם."

The memory **fact** proposed (server-stored, English-canonical so it folds into the existing
prompt context regardless of UI locale): `"{name} often has a harder time around {timeLabel}."`
with `source: "rhythm"`, `retention: "3 months"` (re-confirmed if the pattern persists).

#### Write-back path (the moat write)
The client has no "propose memory" endpoint today — proposals only come from the coach response
(`memoryProposals`, folded in `appendMemoryProposals`, `memoryService.ts:82`). Add a minimal
authenticated POST that appends a **pending** proposal via the same `appendMemoryProposals`
helper (so dedupe + ledger semantics are identical):

- **New route** `POST /api/memory/:childId/propose` in `app/src/routes/api.ts` (beside the
  existing `GET`/`PATCH` at lines 76–107). Body `{ fact, source, retention, prompt? }`.
  Validates non-empty `fact`, calls `appendMemoryProposals(memoryStore, childId, [{fact, source, retention}], { familyId, prompt: prompt ?? "rhythm:pattern", frameRouting: null })`,
  returns `{ items }` (folded ledger). 400 on empty fact; 500 wrapped like the siblings.
- **Context handler** add `proposeMemory(fact, opts)` to `ArborContext` next to
  `handleMemoryDecision` (line 458), POSTing to the new route and setting `memoryReviewItems`
  from the response — mirroring the existing fetch shape at lines 442/461 so the native api-base
  shim and auth headers are reused. Expose it in the context return object (line 944 area).
- `OverviewTab` passes `onRememberPattern={(hour) => proposeMemory(...)}` into `RhythmStrip` and
  toasts `rhythm.remembered` / `rhythm.rememberError`.

> **Conflict-aware note:** `ArborContext.tsx` is a serialized hotspot (`p4`, `mk-p0-4`, `b5`,
> `ia-b1`). c1 only **appends** one handler (`proposeMemory`) + one return key — no edits to
> `ActiveTab`/`VALID_TABS`/routing. Land after `mk-p0-4`/`p4` handler-wiring; append-only, do not
> reorder the return object.

#### Loop instrumentation
Rhythm is a habit-surface, so fire loop/analytics events (do **not** add to the canonical
`LoopEvent` enum — those are funnel-stable; use `track()` directly via `analytics.ts`):
- `track("rhythm_prep_opened", { hour })` on friction chip.
- `track("rhythm_remember_proposed", { hour })` on **[Remember]**.
This must wait on `mk-p0-4-analytics-wiring` having wired `track()`; import the stable surface, add no new `LoopEvent` names (loopEvents.ts hotspot rule).

### Files to create / edit (exact repo-relative paths)
Edit:
- `PPPPtherapy-/PPPPtherapy-/app/src/components/overview/RhythmStrip.tsx` — make 3 chips
  `<button>`s, add new optional props (`onSetWindDownReminder`, `onUseCalmWindow`,
  `onRememberPattern`, `alreadyRemembered`), add confirm row + states + a11y + 44px targets.
- `PPPPtherapy-/PPPPtherapy-/app/src/components/tabs/OverviewTab.tsx` — pass new handlers,
  add `proposeMemory` wiring + toasts + per-child/hour dismiss localStorage + `track()` calls.
- `PPPPtherapy-/PPPPtherapy-/app/src/context/ArborContext.tsx` — **append** `proposeMemory`
  handler + return key (no other edits).
- `PPPPtherapy-/PPPPtherapy-/app/src/routes/api.ts` — add `POST /memory/:childId/propose`.
- `PPPPtherapy-/PPPPtherapy-/app/src/lib/i18n.ts` — add the 8 EN + 8 HE keys above (append only).
Create:
- `PPPPtherapy-/PPPPtherapy-/app/src/components/overview/RhythmStrip.test.tsx` — render
  high-confidence prediction; assert chips are buttons, confirm row appears only at high
  confidence with a friction peak, `onRememberPattern` fires, `alreadyRemembered` hides the row,
  learning branch shows no confirm row.
- (optional) extend `app/src/routes/api.test.ts` if a propose-route test harness exists.

`predict.ts` and `predict.test.ts` are **not** modified (engine contract frozen).

### Shared-file conflict notes
- **`RhythmStrip.tsx`** (hotspot: `b1-daily-home`, `b5-naming-moat-exposure`, `c1-rhythm`).
  Sequence is **b1 → c1 → b5**. b1 builds the host shell + initial strip; c1 adds write-back +
  actions; b5 layers "tracking since"/moat copy last. c1 must land *after* b1's strip exists and
  *before* b5 adds moat language — coordinate so b5's copy reuses c1's `rhythm.*` keys rather
  than duplicating. Append i18n keys only (LanguageContext/i18n key-collision rule).
- **`OverviewTab.tsx`** (hotspot: `b1-daily-home`, `c1-rhythm`, `ia-b1-fold-missions`,
  `m5-touch-error-states`). c1 edits only the Rhythm wiring block (~lines 53–95, 319). Land
  after b1's host layout settles; m5's touch/error work is global chrome — no overlap with the
  Rhythm block. Keep the diff scoped to the Rhythm region.
- **`ArborContext.tsx`** — append-only (see write-back note); never reorder the return object;
  land after `mk-p0-4`/`p4` handler passes.
- **`loopEvents.ts`** — do **not** touch. Use `track()` from `analytics.ts` for the two ad-hoc
  events; add no `LoopEvent` enum members (event-name contract is frozen by `mk-p0-4`).

### Dependencies (must land first)
- `b1-daily-home` — owns the Today host shell + the RhythmStrip mount point. **Hard dependency.**
- `mk-p0-4-analytics-wiring` — `track()` must be live before the two `track()` calls. (Soft:
  guard the calls so they no-op if analytics not wired.)
- Should land **before** `b5-naming-moat-exposure` (b5 reuses c1's keys + adds moat copy on the strip).

### Acceptance criteria (testable)
1. All three Rhythm insight chips are keyboard-focusable `<button>`s; Enter/Space activate them.
2. **[Remember]** appears **only** when `confidence === "high"` and `frictionPeak` is non-null
   and the peak hour was not already proposed/dismissed for this child; hidden in the learning
   branch. (unit test in `RhythmStrip.test.tsx`)
3. Tapping **[Remember]** POSTs to `/api/memory/:childId/propose`, the proposed fact appears as a
   **pending** item in My Child › Memory, and `rhythm.remembered` toast fires. Nothing enters AI
   context until the parent approves it there.
4. **[Not really]** dismisses the row for that child+hour and it does not reappear on reload.
5. Wind-down and calm chips perform their action (reminder intent / route to Daily Play),
   verified by click.
6. `prefers-reduced-motion` removes bar + confirm-row transitions; RTL (HE) renders chips and
   confirm row correctly with no clipped/overlapping text.
7. New action buttons are ≥44px tall on web and tappable on iOS/Android Capacitor builds.
8. `npx tsc --noEmit` clean; `predict.test.ts` and the new `RhythmStrip.test.tsx` green; full
   suite unaffected.
9. **Verified live on dev server:** on `npm run dev`, Today shows the actionable chips; seeding
   ≥7 days of 5pm intensity-5 logs surfaces the high-confidence peak + the confirm row; pressing
   Remember creates a pending Memory item visible in My Child › Memory.

### Operating-rule checks
- **No dark patterns:** write-back is opt-in (**[Remember]** / **[Not really]**), never silent;
  proposals land as *pending* requiring explicit parent approval before any AI use. Dismiss is
  honoured permanently per child+hour (no nagging).
- **Privacy / COPPA-2026:** no new PII; the fact is a parent-confirmable behavioural pattern
  ("harder around 5pm"), stored in the existing child-scoped ledger with a bounded 3-month
  retention (honours `retentionToMs`/`isMemoryExpired`). No child-facing surface; parent-only.
- **Moat read/write:** Rhythm already *reads* the log; c1 makes it the first Today surface to
  *write* (a durable, time-boxed, parent-approved memory) — closing the loop the north-star
  requires.
- **Ships-visible:** the actionable chips and the confirm row are immediately visible/usable on
  Today; the resulting memory is visible in My Child › Memory. End-to-end, not a stub.
