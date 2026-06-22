## b1-daily-home — Daily Home (living, time-aware Today)
**Aspects:** IA, UI/UX, Copy · **Surfaces/platforms:** web:Today, ios, android · **Priority:** Phase2

> Skill discipline applied: `impeccable` (interface shaping) + `design:design-handoff` (states/tokens/props spec) + `design:accessibility-review` (AA / keyboard / reduced-motion / RTL) + `design:ux-copy` (microcopy strings). Grounded in the live React app at `PPPPtherapy-/PPPPtherapy-/app/src`, not the html prototypes.

---

### Problem / why

`OverviewTab.tsx` (the `overview` tab = the **Today** pillar, `SECTIONS[0]` in `navigation.ts:35-41`) is already feature-rich but **structurally static and undifferentiated by time of day**. Concrete failures grounded in the file:

1. **No time-aware host.** The only time signal is `greeting` (`OverviewTab.tsx:97-101`) — a label swap. The *content and order* of the screen never change between morning, afternoon, and evening. A parent opening at 7am (plan the day) and 8pm (wind-down / capture the day) sees the identical card order. The North-star "living, time-aware Today" does not exist yet.
2. **Flat, long scroll.** The screen renders ~8 equal-weight `<section>`s in a fixed order (decision hero → JITAI → Practice&Play → Rhythm/Play grid → "How doing" → "try this week" → share/check-in → daily tools → safety). There is no single "one thing now" spine; the most time-relevant action is buried by position.
3. **Rhythm + Daily Play are bolted-on tenants, not orchestrated.** `RhythmStrip` and `DailyPlayCard` sit in a generic 2-col grid (`OverviewTab.tsx:317-329`). This item is the **shell that hosts `c1-rhythm` and `c2-daily-play`** — it must define the slot contract those missions wire into, without itself rewriting their internals.
4. **Missions are orphaned.** `MissionsTab` (`components/practice/MissionsTab.tsx`) computes "today's mission" on a 5-day cycle but is only reachable via the `missions` tab, folded into `grow` by fallback (`navigation.ts:120`). The rationale requires Today to **fold the one current mission into the daily loop** (overlaps `ia-b1-fold-missions`).
5. **No first-class quick capture.** Logging is reachable only through buttons inside the hero / JITAI / nudge (`setQuickLog(true)`). There is no persistent, always-present capture affordance — the #1 daily action is positionally fragile.

**Goal:** Rebuild Today as a *living, time-aware host*: a time-of-day spine that promotes **one thing now**, hosts the **Rhythm** strip and **Daily Play** card as orchestrated tenants, surfaces a **memory nudge** (moat read), folds the **current mission**, and exposes **always-available quick capture** — calm/premium parent register, identical IA on web/iOS/Android, no dark patterns.

---

### Scope across platform domains

- **Web · `web:Today`** (primary): Rebuild `OverviewTab.tsx` into a time-aware host. Add a `useTimeOfDay` selector that reorders/relabels the spine across `morning | afternoon | evening`. Define the tenant slot contract for `RhythmStrip` (c1) and `DailyPlayCard` (c2). Add a persistent **Quick Capture** affordance. Fold the current mission into the loop (one card, deep-links to `missions`). Register the Today section copy keys.
- **iOS (Capacitor)** & **Android (Capacitor)**: Same React surface — no separate code. Requirements: the new persistent Quick Capture bar must respect safe-area insets (coordinate with `m1-ios-safe-area`, do **not** edit `index.css`/`Shell.tsx` here — consume the `--safe-bottom` var it provides); all primary touch targets ≥44×44px; time-of-day is device-local (`new Date()` already device-local). No Capacitor config changes in this item.
- **Landing EN / Landing HE (RTL):** Out of scope. (No `html/` edits.)

---

### IA / UX / Copy detail (build-level)

#### A. Time-of-day spine (the "living" part) — IA + UI

Add a pure, testable selector. The hour bucket drives **section order, the eyebrow, and which "one thing" is promoted** — it does not hide capability, only re-ranks it (no dark pattern, fully reversible by scrolling).

New file `src/lib/timeOfDay.ts`:
```ts
export type DayPart = "morning" | "afternoon" | "evening";
/** Pure: caller injects the hour for testability (no Date.now() inside). */
export function dayPartFor(hour: number): DayPart {
  if (hour < 12) return "morning";
  if (hour < 18) return "afternoon";
  return "evening";
}
```
In `OverviewTab.tsx`, replace the inline `greeting` ternary (lines 97-101) with `const dayPart = dayPartFor(new Date().getHours());` and derive `greeting` from it. Spine ordering by `dayPart`:

| Slot (top → bottom) | morning | afternoon | evening |
|---|---|---|---|
| 1 — Decision hero ("one thing now") | plan-the-day focus | mid-day check-in | **wind-down + capture the day** |
| 2 — Rhythm strip (c1 tenant) | shown high (plan ahead) | shown | shown, **wind-down chip emphasised** |
| 3 — Daily Play card (c2 tenant) | shown | **promoted** (peak play time) | demoted below memory nudge |
| 4 — Memory nudge (moat read) | shown if pending | shown if pending | **promoted** (review the day's facts) |
| 5 — Folded mission card | shown | shown | shown |
| rest — "How doing" / try-this / share / tools / safety | unchanged order | unchanged | unchanged |

Implementation: keep all existing sections, but wrap slots 2–5 in an array reordered by `dayPart` (a small `order` map → `Array.sort`), rendered in a single `<div className="space-y-4">`. Do **not** duplicate JSX per daypart; compute order once. The eyebrow copy in the hero's "Today for {name}" well changes by daypart (see Copy).

#### B. Tenant slot contract for c1-rhythm + c2-daily-play — IA

This item **owns the host, not the tenants.** Define and freeze the props the tenants already accept so `c1`/`c2` can extend behavior without the host churning:
- `RhythmStrip` slot: host passes `prediction`, `childName`, `onPrepWindow` (already the signature — `RhythmStrip.tsx:22-31`). `c1-rhythm` later adds write-back/actions; host must NOT change the prop names. Host responsibility: compute `rhythm` via `predictRhythm(...)` (already at `OverviewTab.tsx:54-61`) and pass it. Leave the `predict.ts` write-back wiring to `c1`.
- `DailyPlayCard` slot: host passes `pick`, `childName`, `done`, `onDid`, `onCoach` (already the signature — `DailyPlayCard.tsx:17-29`). `c2-daily-play` later owns `playbank/select.ts` scoring; host must keep passing the `ScoredActivity` it already selects (`OverviewTab.tsx:66-78`). Host keeps the `localStorage` done-state + toast (lines 88-95) as the canonical write path until c2 supersedes it.

Net: **b1 makes zero behavioral edits inside `RhythmStrip.tsx` / `DailyPlayCard.tsx`** — it only relocates them into the time-aware spine and guarantees the prop contract. (This is the conflict-avoidance commitment; see Shared-file notes.)

#### C. Memory nudge (moat read) — UI

Promote the existing Memory tile (`OverviewTab.tsx:354-371`) into a first-class **spine slot** when `pendingMemoryItems.length > 0`, especially in the evening. Reuse the existing `pendingMemoryItems` / `approvedMemoryItems` from `useArbor()` — **read-only**, no new writes (write-back stays in the `memory` tab). Evening copy nudges review of the day's captured facts. This is the moat *read*; the moat *write* in Today is Quick Capture (below).

#### D. Persistent Quick Capture — UI + IA

Add a always-present capture affordance so the #1 daily action is never positionally fragile. Two-part:
- Reuse the existing `QuickLogModal` (`OverviewTab.tsx:18,453`) and `quickLog` state — **no new modal.**
- Add a new component `src/components/overview/QuickCaptureBar.tsx`: a slim, sticky-within-Today capture row pinned to the bottom of the Today scroll region (NOT a global FAB — that would collide with `MobileNav`/`surf-app-shell`). One primary button "Capture a moment" → `setQuickLog(true)`. On web ≥`lg` it sits inline at the top of the spine; on mobile it is `position: sticky; bottom: var(--safe-bottom, 0)` so it clears the iOS home indicator and the mobile tab bar.

States, motion, a11y for `QuickCaptureBar`:
- **default:** button enabled, label "Capture a moment", `Plus` icon.
- **loading/empty/error:** N/A (opens a modal; no async). The *modal's* states are out of scope (owned by `QuickLogModal`).
- **touch target:** `min-height:48px`, full-tap row; ≥44px hit area (meets `m5-touch-error-states` baseline).
- **motion:** entry `opacity/translateY` 160ms; **must** honor `useReducedMotion()` (gate the transition like `RhythmStrip.tsx:32,94`).
- **a11y:** `<button aria-label>` from i18n; focus-visible ring using `--arbor-green-ink`; reachable in tab order as the first interactive element of Today (so keyboard users hit capture immediately). On RTL the icon flips to the trailing side via `document.documentElement.dir` (already global — use logical `gap`, not `margin-left`).

#### E. Folded mission card — IA

Add `src/components/overview/TodaysMissionCard.tsx`: a compact card that shows the **single current mission** (the 5-day-cycle "today's mission" already computed in `MissionsTab.tsx:28-35`). Extract the cycle-day math into a shared pure helper `src/practice/missionToday.ts` (`todaysMissionFor(dateISO)`) and import it in BOTH `MissionsTab.tsx` and the new card so the Today loop and the Missions tab never disagree. Card shows mission title + domain + one CTA "Open today's mission" → `setActiveTab("missions")`. Completion toggle stays inside the `missions` tab (do not duplicate the write here — read-only summary + deep link). This realizes the rationale's "folds missions" and is the coordinated half of `ia-b1-fold-missions`.

#### F. Copy (actual strings — EN, append to the `en` dict in `i18n.ts` before line 514; mirror in `he` before line 994)

```
"today.part.morning.eyebrow": "Plan {name}'s day",
"today.part.afternoon.eyebrow": "How's {name}'s day going",
"today.part.evening.eyebrow": "Wind down with {name}",
"today.capture.cta": "Capture a moment",
"today.capture.aria": "Capture a moment in {name}'s story",
"today.memory.evening.title": "Look back on today",
"today.memory.evening.body": "{n} new things Arbor noticed — review before they're saved.",
"today.mission.eyebrow": "Today's mission",
"today.mission.cta": "Open today's mission",
"today.mission.sub": "One small {domain} mission for {name} today.",
```
Reuse existing keys where present: hero greeting (`ov.greeting.*`), pulse (`ov.pulse.*`), play card (`play.*`), rhythm (`rhythm.*`), memory tile (`ov.toReview`/`ov.factsWaiting`/`ov.remembered`). **Do not invent** new strings where an `ov.*` key already covers it. HE values: provide RTL-correct translations (the surrounding direction is handled globally; only translate the text). Voice: calm, second-person, non-clinical, no urgency manipulation (matches PRODUCT.md tone).

---

### Files to create / edit (exact repo-relative paths)

**Create**
- `PPPPtherapy-/PPPPtherapy-/app/src/lib/timeOfDay.ts` — `dayPartFor(hour)` pure selector + `DayPart` type.
- `PPPPtherapy-/PPPPtherapy-/app/src/lib/timeOfDay.test.ts` — bucket boundaries (11/12/17/18).
- `PPPPtherapy-/PPPPtherapy-/app/src/components/overview/QuickCaptureBar.tsx` — persistent capture row.
- `PPPPtherapy-/PPPPtherapy-/app/src/components/overview/TodaysMissionCard.tsx` — folded single-mission summary.
- `PPPPtherapy-/PPPPtherapy-/app/src/practice/missionToday.ts` — `todaysMissionFor(dateISO)` shared cycle-day helper.

**Edit**
- `PPPPtherapy-/PPPPtherapy-/app/src/components/tabs/OverviewTab.tsx` — replace inline greeting with `dayPartFor`; reorder spine slots 2–5 by daypart; mount `QuickCaptureBar` (first in tab order) + `TodaysMissionCard`; promote memory nudge; pass tenant props unchanged.
- `PPPPtherapy-/PPPPtherapy-/app/src/components/practice/MissionsTab.tsx` — replace inline cycle-day math (lines 28-35) with `todaysMissionFor` import (no behavior change).
- `PPPPtherapy-/PPPPtherapy-/app/src/lib/i18n.ts` — append the `today.*` keys to `en` (before line 514) and `he` (before line 994).
- `PPPPtherapy-/PPPPtherapy-/app/src/lib/navigation.ts` — **no structural change required** (Today already = `SECTIONS[0]`, single `overview` leaf). Only touch if `ia-b1-fold-missions` has not yet removed `missions` from a surfaced position; otherwise leave untouched. (See conflict notes — defer the leaf/order cleanup to the IA triad.)

---

### Shared-file conflict notes

Per the conflict hotspot list, this item touches four shared files. Avoid-clobber plan:

- **`navigation.ts`** (hotspot: `b1,b2,b3,b5,ia-b1,ia-b6,surf-app-shell`; rule = "land b1/b2/b3 pillar reorgs first, then ia-b1+ia-b6, then b5"). **b1 lands FIRST among the IA triad.** b1's footprint here is minimal/zero (Today is already a single-leaf section). Make NO edits to `SECTIONS`/`TAB_SECTION_FALLBACK` unless strictly needed; leave the `missions` fallback (line 120) for `ia-b1-fold-missions` to finalize. This keeps the merge surface clean for b2/b3/b5.
- **`OverviewTab.tsx`** (hotspot: `b1,c1-rhythm,ia-b1-fold-missions,m5-touch-error-states`). b1 is the **host rebuild and lands first**; it defines the spine + tenant slots so `c1-rhythm` only edits `RhythmStrip.tsx` internals (not the host), `ia-b1-fold-missions` only swaps the deep-link target, and `m5` only hardens touch/error states on the already-placed `QuickCaptureBar`. Mark the tenant render block with a comment anchor (`{/* TENANT: rhythm (c1) */}`, `{/* TENANT: daily-play (c2) */}`, `{/* FOLDED: mission (ia-b1) */}`) so downstream missions edit by anchor, not by line.
- **`RhythmStrip.tsx`** (hotspot: `b1,b5,c1-rhythm`; rule = "b1 builds the host shell, c1 wires predict.ts write-back, b5 adds moat copy — sequence b1 → c1 → b5"). **b1 makes NO edits to this file's logic** — only relocates the component in `OverviewTab`. Leave write-back to c1.
- **`DailyPlayCard.tsx`** (hotspot: `b1,c2-daily-play`). Same: **b1 does not edit this file**; it preserves the `pick/done/onDid/onCoach` contract and lets `c2-daily-play` own `playbank/select.ts`.

Non-shared but coordinate: `i18n.ts` — append-only, never reorder existing keys (multiple copy missions append; key collisions reconciled in `b5` final pass). `--safe-bottom` token is provided by `m1-ios-safe-area` via `index.css` — **do not author it here**; consume with a fallback `var(--safe-bottom, 0px)`.

---

### Dependencies (other item ids that must land first)

- **None hard.** `dependsOn: []`.
- Soft ordering: b1 should land **before** `c1-rhythm`, `c2-daily-play`, and `ia-b1-fold-missions` (they consume the host/slots/anchors b1 establishes). For the safe-area inset, b1 ships a `var(--safe-bottom, 0px)` fallback so it does not block on `m1-ios-safe-area`.

---

### Acceptance criteria (testable)

1. **Time-aware spine works.** `dayPartFor` unit test passes for hours {0,11,12,17,18,23}. On the dev server, mocking `new Date().getHours()` (or via system clock) to morning vs evening produces a **different section order** for slots 2–5 and a different hero eyebrow string. *Verified live on dev server* (`npm run dev`, both buckets).
2. **Tenants render unchanged.** `RhythmStrip` and `DailyPlayCard` render with identical props and behavior to pre-change; `git diff` shows **zero changes** to `RhythmStrip.tsx` and `DailyPlayCard.tsx`. Verified live: rhythm strip and play card both render and their existing actions (prep-window chip, "We did this", "Coach me") still fire.
3. **Quick Capture persistent + accessible.** `QuickCaptureBar` is the **first** tab-focusable element in Today; pressing it opens `QuickLogModal`. On a ~390px viewport the bar clears the bottom nav (sticky, respects `--safe-bottom`). Keyboard: Tab → Enter opens modal; focus ring visible. `prefers-reduced-motion: reduce` removes the entry animation. *Verified live on dev server* at mobile + desktop widths.
4. **Memory nudge is a read.** When `pendingMemoryItems.length > 0`, the evening spine promotes the memory slot with the new copy; clicking routes to `memory`. No write occurs from Today (verified: pending count unchanged after viewing Today).
5. **Mission folds + agrees with Missions tab.** `TodaysMissionCard` shows the same mission id as `MissionsTab` for the same date (both import `todaysMissionFor`); CTA deep-links to `missions`. Unit test: `todaysMissionFor` is deterministic for a fixed date.
6. **i18n complete.** All `today.*` keys exist in BOTH `en` and `he`; no missing-key fallback warnings in console; HE renders RTL correctly (icons on trailing side).
7. **Build green.** `npx tsc --noEmit` and existing test suite pass; no new console errors on Today.

---

### Operating-rule checks

- **No dark patterns:** Time-of-day re-ranks but never hides capability — everything remains reachable by scrolling; no false urgency, no manipulative streak pressure (mission completion stays opt-in in its own tab). Quick Capture is a convenience, not a nag.
- **Privacy / COPPA-2026:** Today reads only already-stored local/profile state (`behaviorLogs`, `pendingMemoryItems`, `childProfile`); no new data collection, no child-facing data entry on this parent surface, no third-party calls added.
- **Moat read/write:** Reads the longitudinal memory (rhythm prediction from `behaviorLogs`, pending/approved memory items) and writes to it via the existing Quick Capture → `QuickLogModal` path and the existing Daily Play done-state. Every spine slot is a moat read or a moat write.
- **Ships-visible:** The change is immediately perceptible — the Today screen visibly reorders and re-labels by time of day, and a persistent Capture affordance appears. Verified live on the dev server at both phone and desktop widths before sign-off.
