## c2-daily-play — Daily Play — behavior-aware activity engine
**Aspects:** IA, UI/UX, Copy, Marketing · **Surfaces/platforms:** web:Today, web:Grow, ios, android · **Priority:** Phase2

> Skill discipline applied: `impeccable` (card/interaction shaping + states) + `design:design-handoff` (slot contract, props, completion→moat write spec) + `design:ux-copy` (microcopy strings) + `marketing:campaign-plan` (the completion→share loop instrumentation). Grounded in the live React app at `PPPPtherapy-/PPPPtherapy-/app/src`, not the html prototypes.

---

### Problem / why

Redesign **C2**. The `playbank/*` engine is scaffolded and tested (`select.ts`, `content.ts`, `courses.ts`, `coverage.ts`, `stages.ts` + their `.test.ts` siblings), and the UI is wired in two places: the single hero pick on **Today** (`OverviewTab.tsx:66-78,320-328`) and the activity library on **Grow › Daily Play** (`DailyPlayTab.tsx`). The selector already does the differentiator the prototypes can't: it matches an activity to the child's **band AND recently-logged concern domains** (`select.ts:70-89`, `concernDomainsFromLogs` reading `behaviorLogs`). That part works. The gaps that keep C2 from being "operational end-to-end at iOS level":

1. **Completion never reaches the moat.** This is the headline gap, and the rationale's explicit requirement ("Completion writes to timeline"). "Did this" in both `OverviewTab.markPlayDone` (`OverviewTab.tsx:88-95`) and `DailyPlayTab.markDone` (`DailyPlayTab.tsx:71-78`) writes **only** to `localStorage` (`arbor.play.done.{childId}`). Nothing is written to any synced child collection, so a completed activity does **not** appear in the Story timeline (`StoryTimelineTab` builds from `behaviorLogs/milestones/actionPlans/memory/conversations` via `buildTimeline`, `signalTimeline.ts:77` — there is no play source), does not survive a device switch, and does not feed momentum. The behavior-aware engine reads the moat but never **writes** to it. The loop is open.
2. **Two divergent completion implementations.** `OverviewTab.markPlayDone` and `DailyPlayTab.markDone` are near-duplicate copies with the same localStorage key and the same `slice(0, 30)` cap. They will drift. There is no single source of truth for "what has this child done," and the Today card and Grow tab can disagree until a reload.
3. **The "because…" line is honest but thin.** The card shows one of two reason strings (`DailyPlayCard.tsx:35-38`, `play.whyConcern`/`play.whyStage`) but never names *which* concern domain drove the pick, so the moat advantage is asserted, not shown. A parent whose child has been melting down at transitions should see "because regulation has come up a lot lately," not a generic line.
4. **Seed bank is below the reviewed threshold.** `PLAY_ACTIVITIES` currently holds **21** hand-authored activities (`content.ts:43-366`). The rationale sets the target at **40–60 expert-reviewed seed activities** and flags a **Guy gate: reviewer capacity**. With 21 items, several `band × domain` cells are thin (e.g. `infant × cognitive`, `early-school × motor`), so the daily pick over-repeats and the novelty penalty (`select.ts:82`) starves. `coverage.ts` exists to measure exactly this — it must gate the bank.
5. **No completion instrumentation for the growth loop.** A completed activity is the single highest-intent "this product worked today" moment, and it emits **zero** loop events (`loopEvents.ts`). It should be a natural share prompt ("share {name}'s win") feeding `share_initiated`/`share_completed`.

**Goal:** Close the loop. Make activity completion a **first-class moat write** (synced `playLog` collection → Story timeline signal), unify the two completion paths behind one context writer, sharpen the "because…" line to name the driving concern, grow the seed bank to the reviewed 40–60 target behind the coverage gate, and instrument completion as a gentle, honest share moment. Parent register stays calm/premium; identical behavior on web/iOS/Android; no dark patterns.

---

### Scope across platform domains

- **Web · `web:Today`** (consumer of b1's slot): `OverviewTab.tsx` keeps owning the *placement* of the single hero `DailyPlayCard` (b1 owns the slot contract). c2 only swaps the local `markPlayDone` for the new context writer `logPlayCompletion` and the local `donePlayIds` source for the context-derived done set. **No change to section order / spine** — that is b1's.
- **Web · `web:Grow`** (primary): `DailyPlayTab.tsx` — replace local `markDone`/`doneIds` with the context writer + derived done set; pass the driving concern domain into `DailyPlayCard`; add the post-completion share affordance. `DailyPlayCard.tsx` — sharpen the "because…" line, add the optional share row in the done state.
- **iOS (Capacitor) / Android (Capacitor):** Same React surface, no separate native code. The new completion writes go through the same `useChildCollection` (Firestore-when-authed / localStorage-in-sandbox) path used by `behaviorLogs`, so sync works on device unchanged. All new tappables ≥44×44px; the done-state share row respects existing safe-area handling from the Shell (no `Shell.tsx`/`index.css` edits here). No `capacitor.config.ts` change.
- **Landing EN / Landing HE (RTL):** Out of scope (no `html/` edits). RTL still matters **in-app** — see RTL note below.

---

### IA / UI/UX / Copy / Marketing detail (build-level)

#### A. Completion → moat write (the core fix) — IA + data

Introduce a dedicated, synced **play-completion** record rather than overloading `BehaviorLog` (which is negative/incident-shaped: `intensity`, `trigger`, `response`, `resolved` — `types.ts:93-106`). A play completion is a positive, lightweight win; conflating it with incident logs would pollute `concernDomainsFromLogs` (`select.ts:43-57`) and `computeMomentum`.

1. **New type** in `types.ts` (append near `BehaviorLog`):
```ts
export interface PlayLog {
  id: string;            // = activity id + ISO date, idempotent per day
  activityId: string;
  title: string;         // denormalized for timeline display without re-lookup
  domain: PlayDomain;    // import type from playbank/content
  reason: "concern-match" | "stage-match";
  source: "today" | "library" | "course";
  timestamp: string;     // ISO
}
```
2. **New collection** in `ArborContext.tsx` (beside `logsCol`, ~line 163):
```ts
const playLogCol = useChildCollection<PlayLog>(childProfile.id, "playLogs", {
  orderByField: "timestamp", orderDir: "desc", max: 200,
});
```
3. **New context writer + derived done set** (expose on the context value, the big `return {…}` at `ArborContext.tsx:860+`):
```ts
const playLogs = useMemo(() => [...playLogCol.items].sort((a,b)=> a.timestamp < b.timestamp ? 1 : -1), [playLogCol.items]);
const donePlayIds = useMemo(() => playLogs.map(p => p.activityId), [playLogs]);
const logPlayCompletion = (a: ScoredActivity, source: PlayLog["source"]) => {
  const day = new Date().toISOString().slice(0,10);
  const rec: PlayLog = {
    id: `${a.activity.id}.${day}`, activityId: a.activity.id, title: a.activity.title,
    domain: a.activity.domain, reason: a.reason, source, timestamp: new Date().toISOString(),
  };
  void playLogCol.upsert(rec);                 // idempotent per activity per day
  trackPlayCompleted(a.activity.domain, a.reason, source); // loop event, §E
};
```
   Expose `playLogs`, `donePlayIds`, `logPlayCompletion` on the context. This is the **single source of truth** that fixes gap #2 — both surfaces consume it; the two local `useState`/localStorage copies are deleted.
4. **Timeline source** — extend `signalTimeline.ts` so completions show in the Story:
   - Add `"play"` to `SignalKind` (`signalTimeline.ts:15`) and `play?: PlayLog[]` to `TimelineSources` (`signalTimeline.ts:33-39`).
   - In `buildTimeline` push one signal per play log: `{ kind:"play", tone:"mint", title: t-equivalent "Played: {title}", detail: "Builds {domain}", meta: reason==="concern-match" ? "matched to a recent pattern" : undefined, at: timestamp }`. (Map a `KIND_ICON`/`KIND_LABEL` entry for `"play"` in `StoryTimelineTab.tsx:65,76` — reuse `Sprout`.)
   - `StoryTimelineTab` (`:95,101`) destructures `playLogs` from `useArbor()` and passes `play: playLogs` into `buildTimeline`. This is the moat **write** becoming visible — closing the loop.

> Migration note: the old `localStorage["arbor.play.done.{childId}"]` is abandoned, not read. Acceptable — it was per-device ephemeral state, never the source of truth for anything synced. Do **not** attempt a backfill (no reliable timestamps existed).

#### B. Today + Grow rewire (UI/UX) — consume the writer

- **`OverviewTab.tsx`**: delete the local `donePlayIds` state + `markPlayDone` (`:62-65,88-95`); pull `donePlayIds` and `logPlayCompletion` from `useArbor()`. The hero pick's `onDid` becomes `(p) => logPlayCompletion(p, "today")`. `done={donePlayIds.includes(dailyPlay.activity.id)}` now reads the synced set. **Leave the slot/section JSX (`:317-329`) to b1** — only swap the two handler/prop references.
- **`DailyPlayTab.tsx`**: delete the local `doneIds` state + `markDone` (`:23-26,71-78`); use context `donePlayIds` + `logPlayCompletion`. Picks grid `onDid` = `(p) => logPlayCompletion(p, "library")`. The `CourseCard` toggle stays its own localStorage path for now (out of c2 scope; flag as fast-follow — courses are a separate completion model).
- **Idempotency:** because the record id is `activityId.YYYY-MM-DD`, tapping "Did this" twice in a day is a no-op upsert — no duplicate timeline spam, no double loop event (guard the event with a "was this id already present" check before `track`).

#### C. Sharpen the "because…" line (Copy + moat-shows-not-tells)

`DailyPlayCard` currently picks one of two generic strings (`:35-38`). Pass the **driving domain** so the line can name it. The selector already knows it: when `reason === "concern-match"`, the activity's `domain` is (by construction in `select.ts:84-85`) one of the child's concern domains. Add a human label map and a third, richer string:

- Extend `DailyPlayCard` props with `concernLabel?: string` (the localized domain word, e.g. "settling big feelings", "talking", "focus"). `DailyPlayTab`/`OverviewTab` derive it from `pick.activity.domain` via a new `PLAY_DOMAIN_LABEL` map in `content.ts` (EN + HE).
- New copy `play.whyConcernNamed` (EN): `"Because {area} has come up a lot for {name} lately."` — used when `reason==="concern-match"` and a label exists; fall back to the existing `play.whyStage` otherwise. This makes the longitudinal-memory moat **legible** instead of asserted.

`PLAY_DOMAIN_LABEL` (EN): `regulation`→"settling big feelings", `language`→"talking and words", `motor`→"moving and coordination", `cognitive`→"focus and problem-solving", `social`→"playing with others".

#### D. Grow the seed bank to 40–60 (content — the Guy gate)

- Author **+19 to +39** new `PlayActivity` entries in `content.ts` to reach **40–60 total** (currently 21). Each must carry full `bands`, `domain`, `skillTags`, `householdItems`, `whatItBuilds`, 4 `steps`, `durationMin`, plus a matching `PLAY_ACTIVITIES_HE` entry. Prioritize the thin cells revealed by `coverage.ts` (run `coverage.test.ts` / the coverage report to find every `band × domain` cell with < 2 activities; fill those first).
- **Quality gate (Guy):** every new activity is reviewed by the clinical/expert reviewer before merge — this is the declared `Guy gate: reviewer capacity`. Ship in **two batches** so the gate isn't a single blocker: Batch 1 fills coverage gaps to a hard floor of **≥2 activities per non-empty band×domain cell**; Batch 2 brings depth to 50±. Add a `coverage.test.ts` assertion that fails CI if any populated cell drops below 2 — the engine literally cannot regress below playable.
- Keep the file's stated discipline (`content.ts:1-8`): authored, expert-reviewable, household-items-only, no medicalized "developmental age" numbers — use `bands`/`stages`.

#### E. Completion as a share moment (Marketing — the loop)

- **New loop event.** Add to `loopEvents.ts` (the canonical contract — `loopEvents.ts:12-23`): `PlayCompleted: "play_completed"` and a helper `trackPlayCompleted(domain: string, reason: string, source: string)` going through `track()` so first-touch attribution attaches automatically. **Append only — do not rename existing events** (dashboards depend on them; see hotspot).
- **Honest share affordance.** In `DailyPlayCard`'s **done** state only (after `onDid`), reveal a calm, secondary text row (not a popup, not a blocker): `play.shareWin` (EN): `"Share {name}'s win →"`. Tapping it calls the existing share path used elsewhere (route through the same artifact-share entry the app already uses; emit `trackShareInitiated("growth_card","daily_play")`). No auto-prompt, no streak pressure, no nag if dismissed — it simply appears and can be ignored. This converts the highest-intent moment into a self-serve loop input without manufacturing urgency.
- **Marketing asset:** the shared card is a "win" growth_card (handled by the marketing share/export missions; c2 only fires the event + opens the existing share entry — it does **not** build the renderer; that's `mk-p0-3-share-export`).

#### F. States / motion / a11y / RTL

- **States (DailyPlayCard):**
  - *default*: pick shown, "Did this" primary (green gradient), "Coach me" secondary.
  - *done*: "Did this" → disabled pill "Added to {name}'s day" (existing, `:104-108`); reveal the `Share {name}'s win →` row beneath the why-line. Idempotent re-tap = no-op.
  - *loading*: while `playLogCol.loaded` is false on a cold start, the done set is empty — acceptable (optimistic). No spinner needed; the upsert is local-first.
  - *empty*: if `dailyPlay` is null (no activity matched — only possible if the bank is empty for a band, which the coverage floor prevents), Today renders nothing in the slot (existing `{dailyPlay && …}` guard, `:320`). Grow shows the course/readiness sections regardless.
  - *error*: `playLogCol.upsert` failure is non-fatal (fire-and-forget `void`, matching `logsCol.upsert` at `:691`); the optimistic done state still shows; a failed Firestore write retries on next session via the collection hook. No error toast for a completion (don't punish the parent for a sync hiccup).
- **Motion:** reuse existing `active:scale-[0.98]` press (`DailyPlayCard.tsx:103`). The share row fades in on done — wrap in the existing `motion` fade already imported in tabs; under `prefers-reduced-motion` it appears without transition (no autoplay motion anywhere).
- **Touch targets:** all buttons keep `px-5 py-3` (≥44px). The new share row is its own `min-h-[44px]` button.
- **A11y (AA):** share row uses `--arbor-green-ink` on `--arbor-paper-elevated` (shipped AA pairing). The done state must announce — keep `aria-live="polite"` on the actions container so "Added to {name}'s day" is read. Steps disclosure already uses `aria-expanded` (`:79`). All controls are real `<button>`s (keyboard/Enter/Space, visible focus ring).
- **RTL (Hebrew):** every new EN string gets a HE counterpart; the trailing `→` in `play.shareWin` uses `rtl:rotate-180`; the why-line and domain labels mirror automatically under `dir="rtl"`. Add HE for `PLAY_DOMAIN_LABEL` and `play.whyConcernNamed`.

---

### Files to create / edit (exact repo-relative paths)

Edit:
- `PPPPtherapy-/PPPPtherapy-/app/src/types.ts` — add `PlayLog` interface (import `PlayDomain` from playbank/content). **Shared with `p2-5-milestone-rebase`, `c4-dev-score` — append-only, do not touch `Milestone`/score types.**
- `PPPPtherapy-/PPPPtherapy-/app/src/context/ArborContext.tsx` — add `playLogCol`, `playLogs`, `donePlayIds`, `logPlayCompletion`; expose on context value. **Heavy shared hotspot — see notes.**
- `PPPPtherapy-/PPPPtherapy-/app/src/lib/signalTimeline.ts` — add `"play"` SignalKind + `play?: PlayLog[]` source + the per-log signal in `buildTimeline`.
- `PPPPtherapy-/PPPPtherapy-/app/src/components/tabs/StoryTimelineTab.tsx` — `KIND_ICON`/`KIND_LABEL` entry for `"play"`; pass `play: playLogs` into `buildTimeline`.
- `PPPPtherapy-/PPPPtherapy-/app/src/playbank/select.ts` — (no logic change to ranking) only the file-header scope comment if needed for b4's coordination; the selector already supports c2. **Shared with `b4-practice-vs-dailyplay`.**
- `PPPPtherapy-/PPPPtherapy-/app/src/playbank/content.ts` — +19–39 reviewed `PlayActivity` + HE entries; add `PLAY_DOMAIN_LABEL` (EN+HE).
- `PPPPtherapy-/PPPPtherapy-/app/src/playbank/coverage.test.ts` — add the "≥2 per populated band×domain cell" assertion.
- `PPPPtherapy-/PPPPtherapy-/app/src/components/overview/DailyPlayCard.tsx` — `concernLabel` prop; named why-line; done-state share row. **Shared with `b1-daily-home`.**
- `PPPPtherapy-/PPPPtherapy-/app/src/components/tabs/DailyPlayTab.tsx` — consume context writer/done set; derive `concernLabel`; pass share handler. **Shared with `b4-practice-vs-dailyplay`.**
- `PPPPtherapy-/PPPPtherapy-/app/src/components/tabs/OverviewTab.tsx` — swap local handler/done state for context (placement stays b1's). **Shared with `b1-daily-home`, `c1-rhythm`, `ia-b1-fold-missions`, `m5`.**
- `PPPPtherapy-/PPPPtherapy-/app/src/lib/loopEvents.ts` — add `PlayCompleted` + `trackPlayCompleted` (append only). **Heavy shared hotspot.**
- `PPPPtherapy-/PPPPtherapy-/app/src/lib/i18n.ts` — append `play.whyConcernNamed`, `play.shareWin`, `play.domain.*` (EN+HE), append only.

Create: none (uses existing `useChildCollection` hook and share entry).

---

### Shared-file conflict notes

- **`OverviewTab.tsx`** (`touchedBy: b1-daily-home, c1-rhythm, ia-b1-fold-missions, m5`): per the Today hotspot, **b1 lands the rebuilt host first**; c2 then makes a *surgical* swap — replace only the two `DailyPlayCard` props (`onDid`, `done`) and delete the now-dead local `markPlayDone`/`donePlayIds`. Do **not** touch section order, the spine, or the slot JSX (b1/c1 own those). If b1 has already removed the local play state in favor of a tenant contract, c2 just supplies `logPlayCompletion` as the `onDid` the contract calls.
- **`DailyPlayTab.tsx` / `playbank/select.ts`** (`touchedBy: b4-practice-vs-dailyplay, c2-daily-play`): per b4's own spec, **c2 lands first**; b4 only appends a header re-voice + cross-link row after c2 settles. c2 owns all selector/completion wiring here. Keep c2's edits to the picks grid + the new context wiring; leave the bottom of the JSX clean for b4's later cross-link append.
- **`ArborContext.tsx`** (`touchedBy: b5, ia-b1-fold-missions, mk-p0-4-analytics-wiring, p4`): the god-context. Per the hotspot, do `p4` + `mk-p0-4` (handler/event wiring) **before** IA edits, and run `b5`+`ia-b1` as one registry pass. c2's additions are **purely additive** (a new collection + 3 new exported members) and touch **no** existing state, the `ActiveTab` union, `VALID_TABS`, or hash routing — so c2 can land in any order relative to the IA passes, but should land **after** `mk-p0-4` if that pass restructures the analytics/handler block, to avoid a merge on the same region. Add the new members at the end of the return object to minimize diff overlap.
- **`loopEvents.ts`** (`touchedBy: p4, mk-p0-2, mk-p0-3, mk-p0-4, mk-p1-6, mk-p2-6`): canonical event contract. Per the hotspot, **`mk-p0-4` wires the dead exports first**; c2 then **appends** `PlayCompleted`/`trackPlayCompleted` and must **not rename** any existing event. Land c2's loopEvents edit after mk-p0-4.
- **`signalTimeline.ts`** is **not** in the shared map — c2 owns its `"play"` additions outright.
- **`StoryTimelineTab.tsx`** (`touchedBy: b2-mychild-story-spine, b5`): c2 adds only a `KIND_ICON`/`KIND_LABEL` entry + one `buildTimeline` source arg. If b2 is rebuilding the story spine, coordinate so the new `"play"` kind is in b2's `KIND_*` maps; if b2 lands first, c2 appends its entry to b2's settled maps. Append-only, no reordering of existing kinds.
- **`types.ts`** (`touchedBy: p2-5, c4-dev-score`): append `PlayLog` only; don't touch `Milestone` or dev-score types.

---

### Dependencies (other item ids that must land first)

- **`b1-daily-home`** (hard — declared `dependsOn`). b1 rebuilds Today and defines the `DailyPlayCard` tenant slot contract. c2 wires the completion **into** that slot; starting c2's `OverviewTab` edits before b1 risks clobbering the spine. Land b1 first, then c2 swaps the handler.
- **`b4-practice-vs-dailyplay`** (declared `dependsOn`, but per b4's spec the real order is **c2 → b4**). b4 explicitly says "c2 lands first" for `DailyPlayTab.tsx`/`select.ts`. Treat the dependency as: c2 must be **coordinated with** b4 and land its `DailyPlayTab` wiring **before** b4's cross-link append. (If the orchestrator enforces b4-after-c2, no conflict.)
- Soft: `mk-p0-4-analytics-wiring` should land before c2's `loopEvents.ts`/`ArborContext.tsx` analytics-region edits (hotspot ordering).
- Soft: `mk-p0-3-share-export` provides the growth_card share renderer; c2 only fires the event + opens the existing share entry, so it is **not** a hard blocker — the share row degrades gracefully to the app's current share path if the branded renderer isn't built yet.

---

### Acceptance criteria (testable, including verified live on dev server)

1. **Completion writes to the moat.** Tapping "Did this" on the Today hero pick **or** a Grow › Daily Play pick creates a `PlayLog` in the `playLogs` collection (synced in authed mode, localStorage in sandbox). Verified live: complete an activity, open **My Child › Story** — a `"Played: {title}"` signal appears with the day's timestamp and a "Builds {domain}" detail. Verified live on the dev server.
2. **Single source of truth.** Completing on Today instantly shows the done state on Grow › Daily Play (and vice-versa) without a reload — both read `donePlayIds` from context. The old `arbor.play.done.*` localStorage key is no longer read or written. Verified live.
3. **Idempotent.** Tapping "Did this" twice in the same day yields exactly one `PlayLog` (id = `activityId.YYYY-MM-DD`) and exactly one `play_completed` event. (Unit + live.)
4. **"Because…" names the driver.** When a pick is a `concern-match`, the why-line reads "Because {area} has come up a lot for {name} lately." with the correct domain word; `stage-match` picks fall back to the stage line. Verified live by logging transition meltdowns and confirming a regulation pick names "settling big feelings."
5. **Seed bank meets the gate.** `PLAY_ACTIVITIES.length` is between **40 and 60**; `coverage.test.ts` passes its new "≥2 activities per populated band×domain cell" assertion; every new activity has a matching `PLAY_ACTIVITIES_HE` entry (test enforces parity). Each new activity carries the expert-review sign-off (Guy gate) before merge.
6. **Loop event fires.** Completing an activity emits `play_completed` with `{domain, reason, source}` through `track()` (visible in the analytics debug/console). Verified live.
7. **Share moment is honest + optional.** The done state reveals "Share {name}'s win →"; tapping it opens the existing share entry and emits `share_initiated` with `artifact:"growth_card"`. Nothing auto-prompts; ignoring it has no consequence. Verified live.
8. **HE/RTL correct.** In Hebrew, the named why-line, domain labels, and share row render in HE; the share arrow flips (`rtl:rotate-180`); the timeline signal label is localized. Verified live in HE.
9. **Quality gates green.** `npx tsc --noEmit` passes; existing `playbank/*.test.ts` + the new coverage assertion pass; no console errors on Today, Grow › Daily Play, or My Child › Story.

---

### Operating-rule checks

- **No dark patterns.** The share row is a quiet, secondary, dismissible affordance that appears only *after* a genuine completion — no streak counter, no guilt, no manufactured urgency, no hidden exit. Completion is never gated behind a share. The "because…" line is descriptive truth, not persuasion.
- **Privacy / COPPA-2026.** `PlayLog` stores no child PII beyond what the app already holds (an activity id, title, domain, timestamp scoped to the child profile) — no free text, no media, no third-party calls on completion. The share event carries only `artifact`/`surface` (no child data); the actual share content is the parent's explicit action through the existing reviewed share path. The new collection inherits the same Firestore child-scoped security rules as `behaviorLogs`.
- **Moat read/write.** This item is the missing **write** side of the moat: the engine already *reads* the child's logged concerns to rank (`select.ts`); c2 makes completion *write back* a longitudinal play signal that the Story timeline and (future) momentum can compound on. Read + write are now both present — the loop is closed, which is the whole point of the moat.
- **Ships-visible.** Every change is immediately visible to a parent on web/iOS/Android the moment it lands: the named why-line on the card, the new Story signal after completion, the share row in the done state — no flag, no hidden state, no dead code.
