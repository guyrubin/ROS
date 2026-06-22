## b5-naming-moat-exposure — Naming & moat exposure + dead-leaf audit
**Aspects:** Copy, IA · **Surfaces/platforms:** web:Today, web:MyChild, web:Care, app:shell, landing:en, landing:he · **Priority:** Phase2

> RUN AS A DEDICATED REGISTRY-CLEANUP PASS. Do not parallelize against `b1-daily-home` or `ia-b1-fold-missions` — all three touch `navigation.ts` / `ArborContext.tsx` / `Shell.tsx`. This item is the FINAL pass on those files after b1/b2/b3 pillar reorgs and ia-b1/ia-b6 have landed. Subsumes IA mission `ia-b5-deadleaf-audit`.

---

### Problem / why

Three concrete defects, all verified in code today:

1. **`comics` is a broken dead-leaf.** `comics` is in `VALID_TABS` (`ArborContext.tsx:98`) and `tabRegistry` (`Shell.tsx:85`), and is reachable as a live deep-link from `AdventuresTab.tsx:240` (`setActiveTab("comics")`). But it is in **no** `SECTIONS` entry and **missing from `TAB_SECTION_FALLBACK`** (`navigation.ts:103-125`). So `sectionForTab("comics")` falls through to `SECTIONS[0]` → **Today** (`navigation.ts:131`). Opening Hero Comics highlights the wrong sidebar pillar. This is the headline bug.

2. **Orphan leaves `strengths` / `weekly` / `handoff` are half-retired.** The `navigation.ts` header comment (lines 28-31) says they were folded into hubs, and they exist only in `TAB_SECTION_FALLBACK`. But they are **still actively routed**: `weekly` from `StoryTimelineTab.tsx:132` + `SearchModal.tsx:12`; `handoff` from `WeeklyTab.tsx:264`, `Reports.tsx:48`, `CoachTab.tsx:422,682`, `SearchModal.tsx:13`; `strengths` is folded into `ChildProfile`/Development with no live caller. "Retire" here means: keep the routes valid (deep-link + fallback) but make the IA story honest and consistent — not delete components. `strengths` has zero live entry points and is the only true orphan safe to drop from the union later; `weekly`/`handoff` stay as deep-links.

3. **The memory moat is invisible.** Arbor's differentiator is the longitudinal record ("a memory that knows your child and grows with them" — already on the landing, `arbor-marketing-landing-page-en.html:156`). In-app, nothing states *how long* Arbor has been tracking. `RhythmStrip` says only a vague "from your last few weeks" (`rhythm.fromWeeks`, `i18n.ts:77`); the consult packet has a "Context worth knowing" section (`packet.ts:118-128`) but no "tracking since [date] / N moments over M months" framing — the single most persuasive moat statement for a clinician handoff.

Note: `ChildProfile` has **no `createdAt`** (`types.ts:1-20`). The "tracking since" date MUST be **derived from the earliest signal** (oldest `behaviorLog.timestamp`, oldest approved memory item, or oldest milestone observation), never invented. If there is no history yet, show a "just getting started" state — never a fake date.

Also reconcile Academy leaf order (`navigation.ts:90-93`: stories → masterclasses → family) against the IA redesign target and decide where `comics` belongs (deep-link under Academy, resolving to the `academy` section).

### Scope across platform domains

- **Web (Today, My Child, Care, app shell):** the registry-cleanup edits to `navigation.ts` + `ArborContext.tsx`; moat copy in `RhythmStrip` (Today), `StoryTimelineTab` (My Child), and the consult packet (Care). Shell.tsx is touched only if the Academy sub-nav order changes (it reads `section.items`).
- **iOS (Capacitor) / Android (Capacitor):** no native-shell code change. These wrap the same web bundle, so all fixes ride along. Acceptance must include a smoke check that the moat string and corrected sidebar highlight render in the Capacitor webview (RTL + safe-area unaffected).
- **Landing EN / Landing HE (RTL):** light reinforcement only — add one dated/longitudinal proof line near the existing "grows with your child" block (`en:241`, HE equivalent). No structural rewrite (that belongs to `mk-landing-parity-rebuild`). Coordinate: if the parity rebuild has not landed, make the EN edit minimal and idempotent so the rebuild can re-apply it.

### IA / UX / Copy detail (build-level)

#### A. Dead-leaf audit — `navigation.ts` (registry cleanup)

1. **Fix the `comics` fallback.** Add to `TAB_SECTION_FALLBACK` (`navigation.ts:103-125`), in the Academy group:
   ```ts
   // Academy — Hero Comics render as a deep-linked reader off Story Journeys.
   comics: "academy",
   ```
   This makes `sectionForTab("comics").id === "academy"` so the sidebar highlights Arbor Academy when the comic reader opens from `AdventuresTab`.

2. **Make the fold-comment accurate.** Update the header doc-comment (`navigation.ts:21-34`) and the `TAB_SECTION_FALLBACK` doc-comment (`navigation.ts:97-102`) to (a) list `comics → academy`, (b) state that `weekly`/`handoff` remain live deep-links (not dead), and (c) note `strengths` has no live caller and is folded into Development Profile.

3. **Academy leaf order.** Keep visible primary order `stories → masterclasses → family` (matches IA redesign — Story Journeys lead). Do NOT surface `comics` as a 4th equal-weight leaf (it renders inside Story Journeys per the comment at `navigation.ts:88`). Add a one-line comment above the academy `items` array stating comics is intentionally a deep-link, not a primary leaf, so a future audit doesn't "fix" it by adding it.

4. **Extend `navigation.test.ts`** (the structural guard) with:
   - `expect(sectionForTab("comics").id).toBe("academy");`
   - assert Academy primary order: `expect(SECTIONS.find(s=>s.id==="academy")?.items.map(i=>i.tab)).toEqual(["stories","masterclasses","family"]);`
   - a "no surfaced tab is also a fallback key" guard: for every `s.items[].tab`, assert it is **not** a key in `TAB_SECTION_FALLBACK` (catches a leaf accidentally living in both). Export `TAB_SECTION_FALLBACK` from `navigation.ts` (currently module-private) to test it, or add a `fallbackTabs()` accessor — prefer the accessor to keep the map private.

5. **`ArborContext` union hygiene (low-risk, optional within this pass).** Do NOT remove `weekly`/`handoff`/`comics` from the `ActiveTab` union or `VALID_TABS` — they are live. `strengths` may be flagged with a `// orphan: folded into Development Profile, no live caller as of 2026-06-17` comment but kept (removing it is a larger typecheck blast radius; defer to a future cleanup). The ONLY functional `ArborContext` change in this pass is none required — keep this item's `ArborContext` footprint to a comment so it does not collide with `mk-p0-4`/`p4` handler edits.

#### B. Moat exposure — "tracking since" language

Add one pure helper so the date is derived once and reused (no duplicated logic, no invented dates):

`src/lib/moat.ts` (new):
```ts
import type { BehaviorLog, MemoryReviewItem, Milestone } from "../types";

export interface MoatStat {
  /** ISO date (YYYY-MM-DD) of the earliest tracked signal, or null if none. */
  since: string | null;
  /** Whole months of history (>=1 once a signal exists this month). */
  months: number;
  /** Total signals counted toward the longitudinal record. */
  signals: number;
}

/** Derive how long Arbor has been tracking this child from real signals only.
 *  Never fabricates a date: returns since=null when there is no history. */
export function computeMoatStat(args: {
  logs: BehaviorLog[];
  memory: MemoryReviewItem[];
  milestones?: Milestone[];
  nowMs?: number;
}): MoatStat { /* earliest timestamp across logs + approved memory; count signals */ }
```
- Earliest source: oldest `behaviorLog.timestamp` and oldest approved `MemoryReviewItem` (use whatever timestamp field exists; if memory items lack a timestamp, fall back to logs only). `months = max(1, round((now - sinceMs)/30d))` once `since` exists.
- Unit-test `moat.ts`: empty → `{since:null, months:0, signals:0}`; single log today → `months:1`; logs spanning 90d → `months≈3`.

**B1 — RhythmStrip (Today).** Replace the generic `rhythm.fromWeeks` chip text (`RhythmStrip.tsx:63`, key `i18n.ts:77`) with a moat-aware variant when `since` exists:
- New i18n keys:
  - `"rhythm.trackingSince": "Tracking since {date}"` (HE: `"עוקבים מאז {date}"`)
  - keep `"rhythm.fromWeeks"` as the fallback when `since` is null / very recent (< 14 days).
- Format `{date}` via `new Date(since).toLocaleDateString(undefined, { month: "short", year: "numeric" })` so it localizes (e.g. "Apr 2026" / "אפר׳ 2026"). Pass `since` into RhythmStrip via a new optional prop `trackingSince?: string` from `OverviewTab` (computed with `computeMoatStat`). RhythmStrip is shared with b1/c1 — **append the prop, do not reorder existing props**; default to current behavior when prop is absent.

**B2 — StoryTimelineTab (My Child).** The momentum strip (`StoryTimelineTab.tsx:150-178`) is the natural moat home. Add a small caption under `PageHeader` (after line 147): when `computeMoatStat(...).since` exists, render a muted line: `"{n} moments tracked since {date}"` — concrete proof the record is longitudinal. Empty state already exists (`:221-237`); leave it. New i18n keys `"story.trackedSince": "{n} moments tracked since {date}"` (HE: `"{n} רגעים מתועדים מאז {date}"`).

**B3 — Consult packet (Care, the highest-value surface).** In `buildConsultPacket` (`packet.ts:55`), add a moat line to the "Context worth knowing" section header note OR as a new lead line in the "About" section. Concretely, extend `BuildPacketInput` with optional `trackingSince?: string` + `signalCount?: number`, and when present prepend an item to the `about` section (after `:65`):
```ts
if (input.trackingSince) aboutItems.push({
  id: "about-since",
  text: `Arbor has been tracking ${profile.name} since ${input.trackingSince} — ${input.signalCount ?? 0} logged moments and observations inform this summary.`,
});
```
This is the line that tells a clinician "this isn't a one-off intake form." Caller (`ConsultTab`) supplies `trackingSince`/`signalCount` from `computeMoatStat`. Keep `serializePacket` unchanged (it already iterates items). Non-diagnostic, factual — fits the packet's "facts and parent observations only" contract (`packet.ts:1-9`).

**B4 — Landing reinforcement (EN + HE).** Near the existing "A system that grows with your child" section (`en:241`), add one proof sub-line, e.g.: *"Every moment you log builds a record only Arbor has — so the next answer is sharper than the last."* Mirror in HE (RTL): place it inside the same RTL block; do not introduce LTR punctuation drift. Keep it a single `<p class="...">` so `mk-landing-parity-rebuild` can re-host it. No new assets.

#### States / motion / a11y / RTL (for the in-app copy)
- **Default:** moat line/chip visible when `since` exists.
- **Empty / loading:** when `logsLoaded` is false or `since` is null, render the existing "still learning" / "getting started" copy — never a placeholder date or "0 months".
- **Error:** moat computation is pure and total; on any malformed timestamp, `computeMoatStat` returns `since:null` (defensive) → falls back to non-moat copy. No error UI needed.
- **Motion:** the new caption/chip inherits existing container; no new animation. Respect `prefers-reduced-motion` already honored by RhythmStrip (`useReducedMotion`).
- **Touch targets:** no new interactive targets (captions are static text). The existing RhythmStrip chip stays ≥ its current size.
- **a11y (AA):** captions are plain text in normal flow, read by SR in order. Ensure the date is real text (not an icon) so it's announced. Contrast: use `var(--arbor-muted)` on paper (already AA in this system).
- **RTL:** all strings go through `t()`; `{date}` is locale-formatted. Verify the HE moat line reads correctly RTL (date trailing) and the EN landing sub-line mirrors. No hardcoded LTR direction.

### Files to create / edit (exact repo-relative paths)

Create:
- `PPPPtherapy-/PPPPtherapy-/app/src/lib/moat.ts` — `computeMoatStat` + `MoatStat`.
- `PPPPtherapy-/PPPPtherapy-/app/src/lib/moat.test.ts` — unit tests for the helper.

Edit:
- `PPPPtherapy-/PPPPtherapy-/app/src/lib/navigation.ts` — add `comics: "academy"` to `TAB_SECTION_FALLBACK`; correct doc-comments; add `fallbackTabs()` accessor for the test; Academy deep-link comment.
- `PPPPtherapy-/PPPPtherapy-/app/src/lib/navigation.test.ts` — comics fallback + Academy order + no-double-registration guards.
- `PPPPtherapy-/PPPPtherapy-/app/src/lib/i18n.ts` — new keys: `rhythm.trackingSince`, `story.trackedSince` (EN + HE).
- `PPPPtherapy-/PPPPtherapy-/app/src/components/overview/RhythmStrip.tsx` — accept `trackingSince?` prop; swap chip copy.
- `PPPPtherapy-/PPPPtherapy-/app/src/components/tabs/OverviewTab.tsx` — compute `computeMoatStat` and pass `trackingSince` to RhythmStrip. (Shared with b1/c1 — additive only.)
- `PPPPtherapy-/PPPPtherapy-/app/src/components/tabs/StoryTimelineTab.tsx` — moat caption under PageHeader.
- `PPPPtherapy-/PPPPtherapy-/app/src/consult/packet.ts` — optional `trackingSince`/`signalCount` inputs + "about-since" item.
- `PPPPtherapy-/PPPPtherapy-/app/src/components/tabs/ConsultTab.tsx` — pass moat stats into `buildConsultPacket`.
- `PPPPtherapy-/PPPPtherapy-/app/src/context/ArborContext.tsx` — **comment only** (`strengths` orphan note). No behavior change.
- `PAI/projects/parenting-os-plugin/html/arbor-marketing-landing-page-en.html` — one moat proof sub-line.
- `PAI/projects/parenting-os-plugin/html/arbor-marketing-landing-page-he.html` — RTL mirror of the same line.

### Shared-file conflict notes

Cite the conflict hotspot list:
- **`navigation.ts`** (touched by b1/b2/b3/ia-b1/ia-b6/surf-app-shell): hotspot says land pillar reorgs (b1/b2/b3) first, then ia-b1/ia-b6, **then b5 as the final dead-leaf/order/fallback cleanup**. This item must be the last write. Only append the `comics` fallback key and the accessor; do not reorder `SECTIONS` (that's b1/ia-b1's job). Re-run `navigation.test.ts` after merging on top of their state.
- **`ArborContext.tsx`** (b5/ia-b1/mk-p0-4/p4): hotspot says do p4 + mk-p0-4 handler/event wiring **before** IA edits, and run b5 + ia-b1 as a single registry-cleanup pass. To avoid clobber, this item makes **zero functional changes** to ArborContext (comment only) — keeps the union/VALID_TABS edits to ia-b1.
- **`Shell.tsx`** (p3/b5/ia-b1/m1/m5/surf-app-shell): only touched if Academy sub-nav order changes — it does NOT here (order preserved), so **no Shell.tsx edit is required**. If a merge forces a touch, limit to the `tabRegistry`/sub-nav comment region and serialize after ia-b1.
- **`LanguageContext.tsx`** (b5/ia-b6/surf-ask/surf-academy): hotspot says append i18n keys only, no reordering; reconcile collisions in the b5 final pass. New keys here go in `i18n.ts` (the dict), not `LanguageContext.tsx` itself — so no LanguageContext edit is needed. If ia-b6/surf-academy added colliding `rhythm.*`/`story.*` keys, dedupe in this pass.
- **`RhythmStrip.tsx`** (b1/b5/c1): hotspot sequence is b1 → c1 → b5. **Append** the `trackingSince` prop; do not touch the prediction wiring c1 owns. Default-safe when prop absent.
- **`consult/packet.ts`** (b3/c3/p2-8/b5): hotspot says land b3+c3 (same flow), then p2-8 extends the packet, **then b5 adds moat copy last**. Add only the optional inputs + `about-since` item; do not alter section ordering b3 established.
- **Landing EN/HE** (mk-landing-parity-rebuild rewrites EN wholesale): make the EN edit a single self-contained `<p>` so the rebuild can re-apply it; if the rebuild has not landed, this edit is minimal and idempotent.

### Dependencies (must land first)

- `b1-daily-home` (RhythmStrip host shell + Today reorg in navigation.ts)
- `b2-mychild-story-spine` (StoryTimelineTab + My Child leaves settled)
- `b3-care-consult` (ConsultTab + packet.ts consult flow settled)
- Soft-after (if scheduled this cycle): `ia-b1-fold-missions`, `ia-b6-ask-from-ask`, `c1-rhythm`, `c3-ask-specialist` — this item is the final registry-cleanup pass; run after their navigation/packet edits exist.

### Acceptance criteria (testable)

1. `npm run test` passes, including new `navigation.test.ts` cases: `sectionForTab("comics").id === "academy"`; Academy order `["stories","masterclasses","family"]`; no surfaced tab is also a fallback key.
2. `moat.test.ts` passes: empty → `since:null`; single recent log → `months:1`; 90-day span → `months≈3`; malformed timestamp → `since:null` (no throw).
3. **Verified live on dev server (`npm run dev`):** opening Hero Comics from Adventures (`AdventuresTab` → comics) highlights **Arbor Academy** in the sidebar (not Today).
4. **Verified live:** with seeded sample logs, Today's RhythmStrip shows "Tracking since {Mon Year}" instead of "from your last few weeks"; a brand-new child (no logs) shows the original learning/getting-started copy with **no date**.
5. **Verified live:** StoryTimelineTab shows "{n} moments tracked since {date}" caption when history exists; hidden on empty.
6. **Verified live:** generating a consult packet (Care › Consult) includes the "Arbor has been tracking {name} since {date} — N logged moments…" line; serialized Markdown contains it; redaction still works (uncheck removes it).
7. **Verified live in HE (RTL):** the moat strings render correctly right-to-left with localized dates; landing HE sub-line mirrors EN without LTR drift.
8. `npx tsc --noEmit` is clean; no new ESLint errors.
9. Capacitor smoke (or documented as deferred if no Mac): the web bundle in the iOS/Android webview shows the corrected sidebar highlight and moat string.

### Operating-rule checks

- **No dark patterns:** moat copy is factual proof of value, derived only from the user's own logged data; no false urgency, no fake counts. "Tracking since" is suppressed entirely when there is no real history (no fabricated dates).
- **Privacy / COPPA-2026:** no new data collected; `computeMoatStat` reads only already-stored signals. Consult moat line is non-diagnostic (facts/observations only) and ships inside the parent-controlled, export-only packet (`packet.ts:1-9` contract) — nothing leaves the device until the parent exports, and the line is redactable via the existing exclude-id mechanism.
- **Moat read/write:** this item *reads* the longitudinal record to surface it; the act of logging (b1/c1) is what *writes* it. The moat line makes the read visible — directly reinforcing the memory moat north star.
- **Ships-visible:** every change produces user-visible output (corrected nav highlight, dated moat strings on Today / My Child / Consult / landing) — not silent refactor. Apple-grade craft: localized dates, graceful empty states, RTL-correct.
