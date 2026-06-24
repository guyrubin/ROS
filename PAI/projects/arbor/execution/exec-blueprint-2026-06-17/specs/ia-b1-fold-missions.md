## ia-b1-fold-missions — Fold Missions into Today (kill orphan)
**Aspects:** IA, UI/UX, Copy · **Surfaces/platforms:** web:Today, web:Grow · **Priority:** Phase2

### Problem / why
"Daily Missions" is a half-removed orphan. The IA intent is already on record but only half-executed:

- `PracticeHubTab.tsx:6-8` header comment already says *"Daily Missions moved to Today"* and the Practice hub panels list **excludes** missions (`components/practice/PracticeHubTab.tsx:21-24`).
- `lib/navigation.ts:120` already maps `missions: "grow"` in `TAB_SECTION_FALLBACK`, and missions is **not** a primary `NavItem` in any `SECTIONS` entry (`lib/navigation.ts:35-95`).

But the destination it was "moved to" was never built, and the route is still fully alive:

- `missions` is still in the `ActiveTab` union (`context/ArborContext.tsx:84`), in `VALID_TABS` (`context/ArborContext.tsx:99`), and in `tabRegistry` (`components/layout/Shell.tsx:89`).
- `OverviewTab.tsx` (Today) has **no** missions surface at all — no daily-loop card, no streak/score, no mission check-off.
- The only inbound link is `DevelopmentCopilot.tsx:184` ("Open this week's mission →") which routes to a tab that no nav exposes and whose copy/shell (`MissionsTab` wraps everything in `PlayShell`/`PlayHeader`, `MissionsTab.tsx:112-117`) belongs to the **child playful register**, not Today's **calm parent register**.

Net: a parent can only reach the full mission experience by deep-link or one buried Copilot button. The daily-loop value (one mission/day, streak, Development Score) is absent from the surface parents open every day. This item finishes the move: surface the daily mission loop inside Today, refactor `MissionsTab` into an embeddable parent-register block, and retire `missions` as a standalone destination.

### Scope across platform domains
- **Web (Today + Grow):** the only surface that changes. Add a "Today's mission" block to `OverviewTab.tsx`; refactor `MissionsTab.tsx` into a shell-less embeddable `MissionsPanel` (parent register, no `PlayShell`); repoint the `DevelopmentCopilot` deep link to `overview`; remove `missions` from the `ActiveTab` union / `VALID_TABS` / `tabRegistry` / `TAB_SECTION_FALLBACK`. No `SECTIONS` array change is needed (missions is already not a primary leaf).
- **iOS (Capacitor) / Android (Capacitor):** no native code change. The web Today surface renders inside the Capacitor shell unchanged. Verify the new card respects existing safe-area/scroll (no new fixed elements). No `capacitor.config.ts` or `lib/native.ts` edits.
- **Landing EN / Landing HE:** out of scope. No marketing surface mentions missions as a destination.

### IA / UX / Copy detail

#### IA (the kill)
1. **Remove the standalone route.** Delete `missions` from:
   - `context/ArborContext.tsx:84` (`ActiveTab` union member + comment).
   - `context/ArborContext.tsx:99` (the `VALID_TABS` set — kills the `#/missions` deep link).
   - `components/layout/Shell.tsx:50` (the `lazy(() => import("../practice/MissionsTab"))`) and `Shell.tsx:89` (`missions: MissionsTab` registry row).
   - `lib/navigation.ts:120` (`missions: "grow"` fallback — now a dead key; remove with the union member, and update the comment on `lib/navigation.ts:115`).
2. **Today becomes the mission home.** The mission loop is surfaced inside `OverviewTab` (see UI). Grow keeps the *deliberate drills* only — Practice hub is already correct (`PracticeHubTab.tsx`), no edit needed there.
3. **Reachability preserved for capability, not as a destination.** Mission completion + Development Score data (`usePracticeData`) is unchanged; it is now read/written from the Today embed instead of a dedicated tab. JourneyTab (`components/practice/JourneyTab.tsx`) still shows the weekly mission grid and is unaffected — it does not link to `missions`.

#### UI/UX — Today embed (`OverviewTab.tsx`)
**Placement:** insert a new `<section>` directly **after** the "Today: predicted rhythm + a play idea" section (`OverviewTab.tsx:317-329`) and **before** "How your child is doing" (`OverviewTab.tsx:331`). This keeps the daily-action cluster (rhythm → play → mission) together at the top of the daily-return zone.

**Component:** render `<MissionsPanel variant="today" />` (the refactored panel, see below). For Today it renders a **single focused block**, not the full studio:
- Header row: small Target icon + `t("ov.mission.title")` ("Today's mission") on the left; a compact streak pill on the right (`🔥 {n}` from `data.streak`) reusing the peach token (`var(--arbor-peach-soft)`/`var(--arbor-peach-ink)`).
- One `MissionCard` for `todaysMission` (the existing card from `MissionsTab.tsx:77-109`, lifted into the panel) — title, domain chip, numbered steps, "Mark done" toggle, "Coach me through this".
- A quiet text link below: `t("ov.mission.more")` ("See this week's rotation →") that calls `setActiveTab("development")` — routing the curious parent to the broader picture inside My Child › Development, **not** back to a dead missions tab. (Development already owns Copilot/Journey context.)
- **Do NOT** bring the 3-card Development Score / streak / completed-this-week stat grid (`MissionsTab.tsx:119-150`) into Today — that density belongs to Development. Today shows only today's single action + streak pill.

**States:**
- *default:* today's mission card, not yet done.
- *done:* "Mark done" flips to the clay "Done!" state (existing `aria-pressed` toggle, `MissionsTab.tsx:90-97`); on first completion of the day, the streak pill increments and a `toast(t("ov.mission.toastDone"), "success")` fires (reuse `useToast` already imported at `OverviewTab.tsx:10`).
- *loading:* `usePracticeData` reads from local cache/Firestore; while `data.missions` is hydrating, render a single `Skeleton` card (reuse `Skeleton` already imported, `OverviewTab.tsx:12`) at the card's footprint. No layout shift.
- *empty:* `MISSION_CYCLE` is static content so there is always a mission; no true empty state. If `childProfile.name` is unset, the existing `firstName` fallback ("your child", `OverviewTab.tsx:49`) applies.
- *error:* mission upsert failure must not block the UI — keep the optimistic toggle (existing `void data.missions.upsert(rec)` is fire-and-forget, `MissionsTab.tsx:64`); on rejection show `toast(t("ov.mission.toastErr"), "error")` and revert the toggle. Wrap the panel in the existing `ErrorBoundary` path (Shell already wraps the tab; the embed inherits it).

**Motion:** the new section inherits the parent `motion.div` fade/translate (`OverviewTab.tsx:165-168`). The card itself gets no entrance animation of its own. The "Mark done" press keeps the existing `active:scale` micro-interaction. All motion must be gated by `prefers-reduced-motion` — confirm the section adds no unconditional transform/transition; the Tailwind `transition` classes already degrade, and no new `motion` keyframes are introduced.

**Touch targets:** "Mark done" and "Coach me through this" buttons must be ≥44×44px. The existing "Mark done" is `px-3.5 py-2` (~36px tall) — **bump to `min-h-[44px]`** when lifting into the panel. "Coach me through this" is an 11px text link (`MissionsTab.tsx:104`) — give it `min-h-[44px] inline-flex items-center` in the Today variant.

**a11y (AA):**
- Streak pill: add `aria-label={t("ov.mission.streakA11y", { n })}` (e.g. "3 day practice streak") since `🔥 3` alone is not descriptive.
- Mission card heading uses a real `<h3>` (currently a `<b>`, `MissionsTab.tsx:86`) so the Today section has a proper heading outline under the section `<h2>`.
- "Mark done" already has `aria-pressed` — keep it.
- Contrast: domain chip colors come from `DOMAIN_META` (`practice/content.ts:181`); these are existing tokens already used elsewhere and pass on `soft` backgrounds. Do not introduce new hex.
- Keyboard: both buttons are native `<button>`s (focusable, Enter/Space) — no change needed; verify focus ring is visible against `var(--arbor-paper-elevated)`.

**RTL:** the panel uses logical flex (`flex items-center justify-between`, `gap-*`) and inherits the app's `dir` from `LanguageContext`. No `ml-`/`mr-` hard directions are introduced. The streak pill `🔥 {n}` order is fine in RTL (emoji + number). Verify in `עב` mode that the "See this week's rotation →" arrow flips (use `ArrowRight` which mirrors via app CSS, consistent with `OverviewTab.tsx:335`).

#### Copy (exact strings — add to `lib/i18n.ts` EN @ ~line 45 nav block is N/A; add to the `ov.*` group, and HE mirror near line 553/796)
New EN keys (place beside existing `ov.*` keys):
- `"ov.mission.title": "Today's mission"`
- `"ov.mission.streakA11y": "{n}-day practice streak"`
- `"ov.mission.more": "See this week's rotation"`
- `"ov.mission.toastDone": "Done. That keeps {name}'s streak alive."`
- `"ov.mission.toastErr": "Couldn't save that just now — try again."`

New HE keys (mirror, RTL):
- `"ov.mission.title": "המשימה של היום"`
- `"ov.mission.streakA11y": "רצף תרגול של {n} ימים"`
- `"ov.mission.more": "לרצף השבועי המלא"`
- `"ov.mission.toastDone": "יופי. זה שומר על הרצף של {name}."`
- `"ov.mission.toastErr": "לא הצלחנו לשמור כרגע — נסו שוב."`

Reuse existing `prac.missions.title` / `prac.missions.sub` only inside the (now embeddable) panel's full variant if still rendered elsewhere; the Today variant uses the new `ov.mission.*` keys (shorter, calmer register). Do **not** delete `prac.missions.*` keys — `MissionsPanel` full variant and JourneyTab copy reference the mission vocabulary.

### Files to create / edit (exact repo-relative paths)
**Edit**
- `PPPPtherapy-/PPPPtherapy-/app/src/components/practice/MissionsTab.tsx` — refactor into an embeddable `MissionsPanel`: extract the body out of the `PlayShell`/`PlayHeader` wrapper (`MissionsTab.tsx:112-117`); add a `variant: "today" | "full"` prop (default `"full"`); in `"today"` render only the single `todaysMission` card + streak pill + "see rotation" link; keep `"full"` rendering the existing studio body (for JourneyTab/Development reuse). Lift `MissionCard` to a named export. Promote the mission `<b>` title to `<h3>`. Bump button hit areas to `min-h-[44px]`.
- `PPPPtherapy-/PPPPtherapy-/app/src/components/tabs/OverviewTab.tsx` — import `MissionsPanel`; insert the new `<section>` between lines 329 and 331; wire the success/error toasts (toast already available).
- `PPPPtherapy-/PPPPtherapy-/app/src/lib/navigation.ts` — remove `missions: "grow"` (line 120); update the comment on line 115 to drop the "missions folded into Today loop" half-statement (now fully done; missions is no longer a routable tab).
- `PPPPtherapy-/PPPPtherapy-/app/src/components/layout/Shell.tsx` — remove the `MissionsTab` lazy import (line 50) and the `missions: MissionsTab` registry entry (line 89).
- `PPPPtherapy-/PPPPtherapy-/app/src/context/ArborContext.tsx` — remove `| "missions"` from the `ActiveTab` union (line 84) and `"missions"` from `VALID_TABS` (line 99).
- `PPPPtherapy-/PPPPtherapy-/app/src/components/practice/DevelopmentCopilot.tsx` — repoint `setActiveTab("missions")` (line 184) to `setActiveTab("overview")`; update button label key to point at Today.
- `PPPPtherapy-/PPPPtherapy-/app/src/lib/i18n.ts` — add the five `ov.mission.*` keys in EN (~line 45–55 ov block) and HE (~line 553+ ov block).

**Create**
- *(optional)* `PPPPtherapy-/PPPPtherapy-/app/src/components/overview/MissionTodayCard.tsx` — only if the engineer prefers a thin Today-specific wrapper over the `variant` prop. The `variant` prop on `MissionsPanel` is the leaner path; create this file only if `MissionsPanel` cannot cleanly serve both registers.

No new test file required; extend existing practice tests if `MissionCard` export changes a signature (it should not).

### Shared-file conflict notes
This item sits on the **IA triad hotspots**. Per the conflict map:
- `context/ArborContext.tsx` — touched by `b5-naming-moat-exposure`, `mk-p0-4-analytics-wiring`, `p4-operational-hardening`. **Run `mk-p0-4` + `p4` (handler/event wiring) BEFORE this item; run `b5` + `ia-b1` as a single registry-cleanup pass, never in parallel.** This item only *removes* the `missions` union member + `VALID_TABS` entry — do it inside the same b5 pass that does the dead-leaf/order cleanup so the union is edited once.
- `lib/navigation.ts` — IA-edit hotspot. **Land `b1`/`b2`/`b3` pillar reorgs first, then `ia-b1` + `ia-b6`, then `b5` final fallback cleanup.** This item depends on `b1-daily-home` already owning the Today shell. Only remove the one `missions` fallback line; do not reorder `SECTIONS`.
- `components/layout/Shell.tsx` — `tabRegistry` hotspot shared with `b5`. Make the `tabRegistry` deletion (missions row) part of the same serialized b5 registry pass. Do not touch global chrome / safe-area (owned by `m1`/`m5`).
- `components/tabs/OverviewTab.tsx` — shared with `b1-daily-home`, `c1-rhythm`, `m5-touch-error-states`. **`b1` builds the Today shell first; insert the mission section after `b1` lands** so the section ordering (hero → nudge → play launcher → rhythm/play → **mission** → how-doing) is stable. `c1` owns RhythmStrip; this item must not edit the rhythm section. Append the new `<section>` between existing sections — do not reflow `b1`'s layout.
- `MissionsTab.tsx` is **not** in any other item's shared list — safe to refactor freely.

### Dependencies (other item ids that must land first)
- `b1-daily-home` (declared dependency) — Today shell + section ordering must exist before the mission section is inserted.
- Sequence-only (not hard blockers but must be serialized on shared files, per hotspots): `mk-p0-4-analytics-wiring` and `p4-operational-hardening` before any `ArborContext` edit; `b5-naming-moat-exposure` co-runs as the single registry-cleanup pass with this item on `ArborContext` / `navigation.ts` / `Shell.tsx`.

### Acceptance criteria (testable, including "verified live on dev server")
1. `npm run lint` (tsc `--noEmit`) passes with `missions` removed from the `ActiveTab` union — no remaining reference to `"missions"` as a tab compiles. (`grep -rn '"missions"' src` returns only `MissionRecord`/`missionRecords`/copy-vocabulary hits, no `setActiveTab`/registry/union/VALID_TABS hits.)
2. `npm run test` (vitest) stays green; practice signal/achievement tests unaffected.
3. Navigating to `#/missions` no longer resolves (falls through `tabFromHash` → `null`) and the app does not render a standalone Missions page.
4. **Verified live on dev server** (`npm run dev`): Today shows a "Today's mission" block between the rhythm/play row and "How your child is doing"; the card shows today's mission with steps; "Mark done" toggles to "Done!", increments the streak pill, and fires the success toast; "Coach me through this" deep-links into Ask Arbor with a prefilled prompt; "See this week's rotation →" opens My Child › Development.
5. **Verified live**: DevelopmentCopilot's "This week's focus" button now lands on Today (not a dead tab).
6. **a11y verified**: streak pill has an `aria-label`; mission title is an `<h3>`; both action buttons are ≥44px and keyboard-operable with a visible focus ring; the section has no unconditional motion under `prefers-reduced-motion: reduce`.
7. **RTL verified** in `עב`: the block, chips, and "see rotation" arrow mirror correctly; no clipped or LTR-stuck elements.
8. Practice hub (Grow › Practice) still renders exactly four drill panels (no missions) — unchanged and confirmed.

### Operating-rule checks
- **No dark patterns:** the streak pill is informational, not coercive — completing a mission is optional, no guilt copy, no fake urgency, no streak-loss threat. "Done." toast is neutral-positive.
- **Privacy / COPPA-2026:** no new data collected; mission completion already writes to the child-scoped `missionRecords` collection via `usePracticeData` (`practice/usePracticeData.ts:44`). No child PII surfaced on Today beyond the existing first name. No new analytics events added by this item (analytics wiring is owned by `mk-p0-4`).
- **Moat read/write:** the Today mission block **reads** the longitudinal mission/streak/score signal (`data.missions`, `data.streak`) and **writes** each completion back into the same memory store — strengthening the daily-loop moat exactly as intended ("surface missions daily-loop inside OverviewTab").
- **Ships-visible:** the change is immediately visible on the surface parents open daily (Today), and removes a confusing orphan route — net IA clarity gain, no hidden capability.
