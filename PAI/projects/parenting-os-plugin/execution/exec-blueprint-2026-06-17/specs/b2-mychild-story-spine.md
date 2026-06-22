## b2-mychild-story-spine — My Child collapse to Story spine
**Aspects:** IA, UI/UX, Copy · **Surfaces/platforms:** web:MyChild · **Priority:** Phase2

> Owner mission for the `web:MyChild` pillar. Subsumes the depth side of IA missions `ia-b2-memory-inline` and `ia-b3-screening-action`. Grounded against the live React app under `PPPPtherapy-/PPPPtherapy-/app/src`.

### Problem / why
The My Child pillar today exposes **four equal-weight leaves** (`navigation.ts:53-58`): `Story` (timeline), `Development` (4-facet hub), `Moments` (behaviors), `Language & Communication`. Two more capabilities — **Child Memory** (`memory`) and **Development Check / Screening** (`screening`) — are orphaned leaves, reachable only by deep link via `TAB_SECTION_FALLBACK` (`navigation.ts:108,110`). The result:

1. **No spine.** The pillar reads as a flat list of peers. There is no answer to "where do I go to understand my child?" The Story timeline (`StoryTimelineTab.tsx`) is already the natural answer — it ingests moments, milestones, plans, memory and coach signals into one living feed (`buildTimeline`, line 100-103) — but it sits as one tab among four.
2. **Development is a second navigational layer.** `DevelopmentTab` is itself a 4-facet `HubTabs` (Now / Milestones / Profile / Journey, `DevelopmentTab.tsx:22-28`). Combined with the pillar's tab bar, a parent navigates two tab rows to reach a milestone. The redesign brief calls for Development as a **single view**, not a hub-within-a-pillar.
3. **Memory & Screening are dead-ends as destinations.** Both are *behaviors a parent does in context* (approve a fact; run a quick check), not places they browse to. Memory belongs where facts are surfaced (the Story spine); Screening belongs where a concern is felt (an inline action that produces a next step). Today they are full-page tabs with their own `PageHeader` (`ChildMemory.tsx:19`, `Screening.tsx:51`) that most parents never find.

**Target IA (from `arbor-ia-redesign-2026-06-14.md`, 6-pillar / ~15-leaf model):** My Child becomes **Story-as-spine** with exactly two visible leaves — **Story** (default) and **Development** (single view) — plus **Moments** and **Language** retained as the two capture/communication leaves. **Child Memory** and **Screening** stop being navigable leaves and become **inline behaviors**: a Memory review card living on the Story spine, and a "Quick check" inline action that opens the screener in a sheet from both Story and Development. No capability is deleted; surfaces are demoted to behaviors and remain deep-linkable.

### Scope across platform domains
- **Web (web:MyChild):** the only surface this mission changes. All edits are in the React app. IA reorder in `navigation.ts`; Development becomes single view (remove its inner `HubTabs` second layer or flatten it — see detail); Memory becomes an inline panel on Story; Screening becomes an inline action/sheet launched from Story + Development. `memory` and `screening` tabs are removed from any visible nav but kept as valid deep-link routes (no `ActiveTab` union deletion — avoids touching the `ArborContext` hotspot).
- **iOS (Capacitor) / Android (Capacitor):** no platform-specific code. They render the same web tree via Capacitor; inheriting the IA change is the whole intent. Only requirement: the inline Screening sheet must be reachable and dismissible with a touch target ≥44px and respect safe-area (it sits inside the existing Shell content area, so `m1-ios-safe-area` already covers chrome). No edits to `capacitor.config.ts` or `lib/native.ts`.
- **Landing EN / Landing HE (RTL):** not in scope. No marketing aspect on this item.

### IA / UX / Copy detail

#### A. IA — `navigation.ts` (the `child` section)
Reduce visible My Child leaves and re-anchor on Story. Replace the `child` section `items` (`navigation.ts:53-58`) with:

```ts
items: [
  { tab: "timeline", label: "Story", icon: Waypoints },        // spine / default
  { tab: "development", label: "Development", icon: Gauge },    // single view
  { tab: "behaviors", label: "Moments", icon: Activity },
  { tab: "language", label: "Language & Communication", icon: Languages },
],
```

This is mostly unchanged from current (the four leaves already match) — the *real* IA change is that `memory` and `screening` were **never** visible leaves here; they only need to remain in `TAB_SECTION_FALLBACK` (already present at `navigation.ts:108,110`) so deep links still highlight the `child` section. **Keep both fallback entries; do not add `memory`/`screening` as `NavItem`s.** Confirm `primaryTabOf(child)` returns `timeline` (it does — `items[0]`, `navigation.ts:134`) so the pillar opens on the Story spine.

> If `b5-naming-moat-exposure` later prunes dead leaves, it must NOT remove `memory`/`screening` from `TAB_SECTION_FALLBACK` — they are now inline-only but still deep-linkable. Note added in shared-file section below.

#### B. UI/UX — Development becomes a single view (`DevelopmentTab.tsx`)
Current `DevelopmentTab` renders `DevScoreCard` + a 4-facet `HubTabs` (Now/Milestones/Profile/Journey, lines 21-29). The "single view" target removes the *pillar-level* second tab row feeling. Two acceptable executions — **use option 1**:

1. **Keep the hub, demote it visually to a segmented control and add the inline Quick-check.** Retain `HubTabs` (it is the in-place facet switch, not a second pillar nav) but: (a) the default facet stays `now`; (b) add a compact **"Quick check"** affordance to the `DevScoreCard` header area that opens the Screening sheet (see section D). This satisfies "Development = single destination" because there is exactly one entry in the pillar nav and the facets are a local control, while removing Screening as a separate leaf.

Concretely in `DevelopmentTab.tsx`:
- Lift screening-sheet state to a shared host (see section D) or render `<ScreeningSheet />` locally and trigger from a button placed beside `DevScoreCard`.
- Button copy: **"Quick development check"** with `ClipboardCheck` icon (reuse from `Screening.tsx:3`). Secondary/quiet style (`var(--arbor-paper-deep)` bg, `var(--arbor-green-ink)` text) — not a primary CTA; it must read as a calm, optional tool, never as an alarming prompt.

States for the Development view (unchanged facets keep their own states; new button only):
- **default:** quiet pill button visible under the score card.
- **loading/empty/error:** the button is stateless (opens a sheet); no async. `DevScoreCard` retains its existing empty copy (`devscore.empty`, `i18n.ts:116`).

#### C. UI/UX — Memory becomes an inline panel on the Story spine (`StoryTimelineTab.tsx`)
Today `ChildMemory` is a full page. Inline its **pending-review action queue** onto the Story spine, where memory facts already appear as timeline signals (`kind: "memory"`, `StoryTimelineTab.tsx:35,82`).

Add a **Memory review card** to `StoryTimelineTab`, rendered **above the filters / timeline** and **only when `pendingMemoryItems.length > 0`** (so it is a contextual action queue, not permanent chrome):

- Source data already on context: `pendingMemoryItems`, `approvedMemoryItems`, `handleMemoryDecision`, `isMemoryUpdating` (`ArborContext.tsx:435-436,458`). Pull them in the existing `useArbor()` destructure (`StoryTimelineTab.tsx:94-97`).
- Reuse the existing `MemoryRow` component. **Refactor**: export `MemoryRow` from `ChildMemory.tsx` (currently a private fn at line 68) so the Story card reuses it verbatim — no visual divergence, single source of truth.
- Card shell: reuse `SectionCard title={`${pendingMemoryItems.length} new facts to review`} icon={<ShieldCheck/>} tone="yellow"` (matches `ChildMemory.tsx:25`). Cap to first 3 pending rows; if more, a quiet **"Review all (N)"** link that sets `setActiveTab("memory")` (the full page survives as the manage-everything destination — deep-link only, not in nav).
- States:
  - **default:** N pending rows with Approve / Dismiss.
  - **loading:** per-row `busy={isMemoryUpdating === m.memoryId}` already dims the row + shows spinner (`ChildMemory.tsx:78,85`). No change.
  - **empty:** card is *absent* when no pending items (no empty state — the absence IS the state). Approved facts remain visible as `memory` timeline signals below.
  - **error:** `handleMemoryDecision` already `alert()`s on failure (`ArborContext.tsx:470`). Acceptable for v1; do not add new error UI.
- **Moat:** this is a read+write of the memory moat. The card READS approved/pending memory and WRITES parent decisions back through `/api/memory` (existing handler). Keep the **source link + timestamp** chips (`MemoryRow` lines 81-82) — they are the "Arbor remembers, and shows its work" moat signal. Do not hide provenance.

#### D. UI/UX — Screening becomes an inline action / sheet (`Screening.tsx` → sheet)
Screening today is a full page with intro→questions→result phases (`Screening.tsx:34,59-191`). Convert it into a **dismissible sheet/modal** launched inline from two places:
1. **Development view** — the "Quick development check" button (section B).
2. **Story spine** — when the `nextStep` / "Arbor noticed" coral card (`StoryTimelineTab.tsx:181-198`) is *absent or low-signal*, OR always as a quiet secondary action in the Story `PageHeader` action cluster (`StoryTimelineTab.tsx:129-146`) — add a third quiet button **"Quick check"** (`ClipboardCheck` icon) beside "Weekly insight". Do not make it loud; the existing "Capture a moment" stays the primary.

Implementation:
- Create `components/sections/ScreeningSheet.tsx` that wraps the existing screener body. **Refactor `Screening.tsx`**: extract the phase machine + question/result JSX (lines 34-191) into an exported `ScreeningFlow` component that takes an optional `onClose?: () => void`. The full-page `Screening` keeps its `PageHeader` + `TrustSafetyBar` and renders `<ScreeningFlow />` (deep-link route `#/screening` survives). `ScreeningSheet` renders `ScreeningFlow` inside a modal panel with the same `TrustSafetyBar` non-diagnostic disclaimer at top.
- Sheet chrome: focus-trapped dialog (`role="dialog"`, `aria-modal="true"`, `aria-label="Development check"`), close button (X, ≥44×44 touch target), `Esc` to close, click-scrim to close. Body scrolls; sheet caps at `max-h-[90vh]`.
- **Result routing preserved:** the result phase's "Prepare a professional summary" → `setActiveTab("reports")` and "Find a professional" → `setActiveTab("find-pro")` (`Screening.tsx:170,173`) must close the sheet *then* navigate, so the parent lands on the Care surface (call `onClose()` before `setActiveTab`).
- States: **intro / questions / result** are the existing phases — unchanged logic. **loading:** none (scoring is sync, `scoreScreening`). **empty:** intro phase is the empty state. **error:** `col.upsert` is fire-and-forget (`Screening.tsx:44`); leave as-is.
- **Moat:** screening results persist via `useChildCollection(...,"screenings")` (`Screening.tsx:28,44`) — keep. The "Last checked … / View last result" recall (`Screening.tsx:69-77`) is a moat signal ("Arbor remembers your last check"); preserve it in the sheet intro.
- **No dark patterns / COPPA:** keep the `TrustSafetyBar` non-diagnostic disclaimer verbatim (`Screening.tsx:57`) and the "contact a professional directly — don't wait" safety note (`Screening.tsx:185-187`). The inline trigger must never imply urgency or use fear copy.

#### E. Copy (actual strings)
New / changed strings (add to `i18n.ts` EN block near `hub.*` line 111, and HE block near line 607; keys are append-only):
- `mychild.quickcheck.cta` → EN: `"Quick development check"` · HE: `"בדיקת התפתחות מהירה"`
- `mychild.quickcheck.short` → EN: `"Quick check"` · HE: `"בדיקה מהירה"` (Story header button)
- `mychild.memoryreview.title` → EN: `"{count} new facts to review"` · HE: `"{count} עובדות חדשות לבדיקה"`
- `mychild.memoryreview.all` → EN: `"Review all ({count})"` · HE: `"לבדוק הכל ({count})"`
- `mychild.screening.sheettitle` → EN: `"Development check"` · HE: `"בדיקת התפתחות"`

Reuse existing strings unchanged: `sec.mem.*` (full-page Memory still uses them), `sec.screen.*`, `hub.now/milestones/profile/journey`. RTL: all new strings ship in the HE block; the sheet inherits the app's existing `dir` handling (no per-component RTL hacks needed since layout uses logical flex, not left/right hardcoding — verify the close-button position uses `end`-side via flex, not absolute `left`).

### Files to create / edit (exact repo-relative paths)
**Create:**
- `PPPPtherapy-/PPPPtherapy-/app/src/components/sections/ScreeningSheet.tsx` — modal wrapper around extracted `ScreeningFlow`.

**Edit:**
- `PPPPtherapy-/PPPPtherapy-/app/src/lib/navigation.ts` — confirm `child` section = Story/Development/Moments/Language; keep `memory`+`screening` in `TAB_SECTION_FALLBACK` only.
- `PPPPtherapy-/PPPPtherapy-/app/src/components/tabs/StoryTimelineTab.tsx` — add inline Memory review card (above filters) + "Quick check" header button opening `ScreeningSheet`.
- `PPPPtherapy-/PPPPtherapy-/app/src/components/tabs/DevelopmentTab.tsx` — add "Quick development check" button opening `ScreeningSheet`; default facet `now`.
- `PPPPtherapy-/PPPPtherapy-/app/src/components/sections/ChildMemory.tsx` — `export` the `MemoryRow` component (was private) for reuse; full page otherwise unchanged.
- `PPPPtherapy-/PPPPtherapy-/app/src/components/sections/Screening.tsx` — extract `ScreeningFlow` (exported, takes `onClose?`); page shell renders it.
- `PPPPtherapy-/PPPPtherapy-/app/src/lib/i18n.ts` — append 5 keys to EN (after line 111) and HE (after line 607) blocks.

**Do NOT edit (deliberately avoided to stay off hotspots):**
- `ArborContext.tsx` — no change to `ActiveTab` union or `VALID_TABS`; `memory`/`screening` stay valid routes.
- `Shell.tsx` — `tabRegistry` keeps `memory`→`ChildMemory`, `screening`→`Screening`, `development`→`DevelopmentTab` (deep links intact). No registry edit needed.

### Shared-file conflict notes
- **`navigation.ts`** (hotspot: `b1-daily-home`, `b2-mychild-story-spine`, `b3-care-consult`, `b5-naming-moat-exposure`, `ia-b1-fold-missions`, `ia-b6-ask-from-ask`, `surf-app-shell`). Per the hotspot directive, land **b1/b2/b3 pillar reorgs first**, then `ia-b1`/`ia-b6`, then `b5` cleanup. b2 touches ONLY the `child` section object and the `TAB_SECTION_FALLBACK` `child` entries — do not reorder other sections or the `SECTIONS` array order. Leave a comment that `memory`/`screening` are inline-behavior routes so `b5` does not prune their fallback entries.
- **`StoryTimelineTab.tsx`** (also touched by `b5-naming-moat-exposure`). b2 adds the Memory card + header button; b5 adds moat copy. **Sequence b2 → b5.** b2 confines edits to the `useArbor()` destructure, the `PageHeader` action cluster, and one new block above the filters — b5's moat-copy edits to subtitle/labels won't collide if b2 leaves the subtitle text alone (it does).
- **`Screening.tsx`** (also touched by `p2-8-red-flag-monitoring`). b2 only *extracts* `ScreeningFlow` without changing scoring logic; p2-8 extends red-flag detection inside the flow. Coordinate: b2 lands the extraction first so p2-8 edits the single `ScreeningFlow` body, not a duplicated page.
- **`DevelopmentTab.tsx`** (also touched by `p2-5-milestone-rebase`, `c4-dev-score`). b2 only adds a button + sheet host; `c4-dev-score` edits `DevScoreCard` (separate file) and `p2-5` edits `MilestonesTab` (separate file). Low collision risk — keep b2's edit to the JSX wrapper only, do not touch the `panels` array facets.
- **`ChildMemory.tsx`** (b2-only). Safe; only change is exporting `MemoryRow`.
- **`i18n.ts`** (touched by several mk-* missions). Append-only; never reorder. Add keys at the end of the relevant section blocks to avoid merge churn.

### Dependencies (other item ids that must land first)
- **None hard.** `dependsOn: []`.
- **Soft ordering:** land before `b5-naming-moat-exposure` (b5 does the final `navigation.ts` dead-leaf/fallback cleanup and adds Story moat copy — it must see b2's settled `child` section). Coordinate with `p2-8-red-flag-monitoring` so b2's `Screening.tsx` extraction lands first.

### Acceptance criteria (testable)
1. My Child pillar shows exactly **two anchor leaves visible as the story** — Story (default) and Development — plus Moments and Language; `memory` and `screening` are **not** present as `NavItem`s in `SECTIONS` (`navigation.ts`).
2. Opening My Child lands on **Story** (`primaryTabOf` → `timeline`).
3. Deep links `#/memory` and `#/screening` still resolve to their full pages and highlight the **My Child** section (via `TAB_SECTION_FALLBACK`).
4. On the **Story** spine, when ≥1 pending memory item exists, a **Memory review card** appears above the filters with Approve/Dismiss that call `handleMemoryDecision` and update live; the card disappears when no pending items remain.
5. A **"Quick check"** action on Story and a **"Quick development check"** button on Development both open the **Screening sheet**; the sheet runs intro→questions→result identically to the old page and persists the result (visible as "Last checked …" on next open).
6. From the screening result, "Prepare a professional summary" and "Find a professional" **close the sheet and navigate** to `reports` / `find-pro`.
7. **a11y:** sheet is `role="dialog" aria-modal`, focus-trapped, `Esc`-closable, close button ≥44×44; all new buttons reachable by keyboard with visible focus; AA contrast on the quiet button (verify `green-ink` on `paper-deep`); the screener answer pills already meet AA. `prefers-reduced-motion` honored by the sheet open animation (use existing `motion` patterns; gate transform on the media query).
8. **RTL (HE):** with `uiLang=he`, the Memory card, Quick-check buttons and sheet render mirrored with no clipped/overlapping controls; close button sits on the inline-end side.
9. **Verified live on dev server:** `npm run dev` in `PPPPtherapy-/PPPPtherapy-/app`; manually walk My Child → Story (Memory card + Quick check) → Development (Quick check) → run a screening in the sheet → confirm result routes to Care; toggle to HE and re-verify mirroring. `npx tsc --noEmit` and the existing test suite pass.

### Operating-rule checks
- **No dark patterns:** Quick-check is a *quiet, optional* affordance — no fear copy, no fake urgency, no forced flow. The non-diagnostic disclaimer (`TrustSafetyBar`) and "contact a professional directly" safety note are preserved verbatim.
- **Privacy / COPPA-2026:** Memory card shows only parent-owned, parent-approved facts and writes decisions through the existing `/api/memory` consent path; nothing is shared without approval (TrustSafetyBar note retained). No new data collection from children; screening is parent-observed answers only.
- **Moat read/write:** Story spine now READS pending+approved memory and WRITES parent approvals inline (provenance chips kept); screening READS last result and WRITES new results to the child's `screenings` collection — both reinforce the longitudinal memory moat rather than bolting on.
- **Ships-visible:** the change is immediately visible — a parent opens My Child onto a single Story spine, sees facts to review in place, and can run a check without leaving the page. Inherited by iOS/Android via the shared web tree.
