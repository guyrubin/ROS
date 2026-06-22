## c4-dev-score — Longitudinal Development Score
**Aspects:** IA, UI/UX, Copy · **Surfaces/platforms:** web:MyChild, web:Today · **Priority:** Phase2

### Problem / why
PRD C4 (folded under EXECUTION-BACKLOG Phase-2 / Workstream B). Arbor's differentiator is the longitudinal memory moat, but parents currently see milestones only as a flat checklist (`MilestonesTab`). They get no single, honest read of "where is my child developing, and what's moving." The scaffold for the answer already exists and is high quality:

- `src/growth/devScore.ts` — pure, deterministic compute (`computeDevScore`, `toSnapshot`, `shouldSnapshot`), with `devScore.test.ts` green (7 cases). Non-diagnostic by design (file header).
- `src/components/sections/DevScoreCard.tsx` — rendered card (overall ring, per-domain bars, weekly trend arrows, "nurture next" → Coach).
- `src/lib/i18n.ts:113-119` (EN) and `:619-625` (HE) — full `devscore.*` key set in both languages.
- `DevScoreCard` is mounted exactly once: top of `My Child › Development` (`DevelopmentTab.tsx:20`).

This item is **finish + correctness + reach**, not greenfield. Three real gaps:

1. **Snake-case domain bug (must-fix).** The compute groups by `m.domain`, which is a `DevelopmentalDomainId` enum (`types.ts:24` — e.g. `social_development`, `language_communication`). `DevScoreCard.tsx:96` renders that raw id as the bar label, and `:66`/`devscore.focus` interpolate it raw into copy ("Worth nurturing next: social_development"). The human labels live in `src/framework.json` (`social_development` → "Social development"). The card currently ships visible machine ids to parents.
2. **Not on Today.** Surfaces include `web:Today`, but `OverviewTab.tsx` never mounts a dev-score element. Today should carry a compact, glanceable summary (one line + ring), deep-linking into the full card on My Child — not a duplicate full card.
3. **Trend persistence is browser-local only.** Snapshots persist to `localStorage` (`DevScoreCard.tsx:30-49`), keyed per child. That means trend resets on a new device and never enters the moat. We add a typed snapshot to `types.ts` and persist through the same child-collection path the rest of the app uses, so trend survives devices and the snapshot becomes a moat artifact.

### Scope across platform domains
- **Web (My Child › Development):** fix domain labels, wire snapshot persistence to the child collection, add reduced-motion + a11y polish to `DevScoreCard`. Primary surface.
- **Web (Today / Overview):** add a new compact `DevScoreStrip` summary that reads the same compute and deep-links to `development`. No second full card.
- **iOS / Android (Capacitor):** no platform-specific code. Both surfaces are the same React views inside the Capacitor shell, so the changes ride along; only requirement is that touch targets and safe-area behavior already satisfied by the shell are not regressed (the new Today strip is a standard tappable card).
- **Landing EN / Landing HE:** not in scope.

### IA detail
- The full **DevScoreCard stays the lead element of `My Child › Development`** (`DevelopmentTab.tsx`), above `HubTabs`. It is the "answer" that frames the four facets (Now / Milestones / Profile / Journey) beneath it. No nav/registry change — `DevelopmentTab` is already the merged Development leaf; this item does **not** touch `navigation.ts`, `ArborContext` tab union, or `Shell.tsx`.
- On **Today**, add a one-line summary strip near the top of the existing card stack in `OverviewTab.tsx` (place it after the hero/nudge sections and before/near `DailyPlayCard` ~line 318 — single column, full width). It is a **pointer, not a panel**: overall number + ring + one focus line + chevron, tapping it calls `setActiveTab("development")`. This preserves the "one home for the development picture" IA and avoids two editable copies of the same data.

### UI / UX detail

**Fix 1 — domain labels (DevScoreCard).** Import the framework domain list and resolve id→label.
```ts
import framework from "../../framework.json";
const DOMAIN_LABEL: Record<string, string> =
  Object.fromEntries(framework.domains.map((d) => [d.id, d.label]));
const labelFor = (id: string) => DOMAIN_LABEL[id] ?? id;
```
- Bar label (`DevScoreCard.tsx:96`): render `labelFor(d.domain)` instead of `d.domain`. Widen the label column from `w-28` to `w-36` and keep `truncate` + add `title={labelFor(d.domain)}` for the full string on hover (labels like "Cognition and executive function" are long).
- Focus copy (`:110`): pass `labelFor(score.focusDomain)` into `t("devscore.focus", { domain })`.
- Coach prompt (`:66`): use `labelFor(score.focusDomain).toLowerCase()`.

**Fix 2 — Today strip (new `DevScoreStrip`).** A compact read-only summary.
- Layout: `ProgressRing` (size 44, stroke 6) showing `score.overall`; to its right, two lines — `t("devscore.overall")` bold + `t("devscore.todayLine", { focus })` muted (the focus label, or "tracking steadily" when no focus); right-aligned chevron. Whole strip is a `<button>` → `setActiveTab("development")`.
- Reuse card chrome tokens from `DevScoreCard` (`--arbor-paper-elevated`, `--arbor-rule`, `rounded-[22px]`).
- **States:**
  - *default:* ring + overall + focus line.
  - *loading:* milestones come from `useArbor().milestones` which is already resolved synchronously from the collection/initial set — if `milestones.length === 0` treat as empty, not a spinner (matches the rest of Overview which has no skeleton for derived cards).
  - *empty* (`score.confidence === "none"`): render nothing on Today (the full card already owns the empty teaching state; Today stays uncluttered). Return `null`.
  - *error:* compute is pure and total-safe (returns `overall: 0`); there is no throwing path, so no error state is needed.
- **Motion:** ProgressRing already animates `stroke-dashoffset` 700ms ease-out. Gate it under reduced motion (see a11y).
- **Touch target:** strip button min-height 64px, full-width tap area — comfortably > 44px.

**a11y (AA, applies to both card and strip):**
- The Today strip button needs an explicit `aria-label` because its visual content is a number + truncated phrase: `aria-label={t("devscore.today.aria", { score: score.overall, focus })}` → "Development picture: 71 out of 100. Tap to open." Add the `devscore.today.aria` key (EN+HE).
- Trend arrows in `DevScoreCard` are decorative (`aria-hidden="true"` already at `:101`) — good, but the trend must also be conveyed non-visually: append a visually-hidden `<span className="sr-only">` per bar stating `{labelFor(d.domain)}: {d.score}, trend {d.trend}`. (Color alone — green up / peach down — fails AA non-color-cue.) Add `devscore.bar.aria` key.
- Color contrast: bar fill uses `--arbor-clay` on `--arbor-paper-sunk` track — this is a meter, not text, so contrast minimums don't bind, but ensure the numeric `d.score` (`:100`, `--arbor-muted`) and overall number (`--arbor-green-ink`) meet 4.5:1 on `--arbor-paper-elevated`. Verify with the accessibility-review pass; both are existing tokens already used for body text elsewhere, so expected pass.
- Keyboard: the Today strip is a real `<button>` (focusable, Enter/Space) — do not use a `<div onClick>`. The Coach button in the card is already a `<button>` — keep.
- **prefers-reduced-motion:** wrap the ProgressRing transition and the bar-width transition so they snap rather than animate. The bars at `DevScoreCard.tsx:98` currently have no transition (acceptable). For the rings, rely on a global rule in `index.css` — **do not add a new `@media (prefers-reduced-motion)` block to `index.css`** (that file is the #1 merge magnet, see conflict notes). Instead pass a prop: extend `ProgressRing` to accept `animate?: boolean` (default true) and compute it locally via `window.matchMedia("(prefers-reduced-motion: reduce)").matches` in the two consumers, setting `className`/transition accordingly. This keeps the change inside owned files.

**RTL (HE):** Both card and strip use flex rows with logical gap and `truncate`; they inherit `dir` from the app root. Verify: (a) trend arrows do not imply LTR direction (up/down arrows are direction-neutral — fine); (b) the Today chevron points logically — use a chevron that flips, i.e. render `ChevronLeft` in RTL / `ChevronRight` in LTR via `uiLang === "he"`, or use a CSS `[dir=rtl] &{transform:scaleX(-1)}` utility already present. (c) The `w-36` fixed label column is fine in RTL (flex order handles it). HE `devscore.*` keys already exist; add HE for the 3 new keys.

### Copy detail
Existing keys (`i18n.ts:113-119` / `:619-625`) are good and stay. Add these (EN then HE):

```
// EN
"devscore.todayLine": "Worth nurturing next: {focus}",
"devscore.todayLineSteady": "Tracking steadily across domains",
"devscore.today.aria": "Development picture: {score} out of 100. Tap to open.",
"devscore.bar.aria": "{domain}: {score} out of 100, trend {trend}",
// HE
"devscore.todayLine": "כדאי לטפח עכשיו: {focus}",
"devscore.todayLineSteady": "התקדמות יציבה בכל התחומים",
"devscore.today.aria": "תמונת התפתחות: {score} מתוך 100. הקישו לפתיחה.",
"devscore.bar.aria": "{domain}: {score} מתוך 100, מגמה {trend}",
```
Copy stance (carry the existing non-diagnostic voice, per PRODUCT.md): never "score", "ability", "behind/ahead", "percentile". The number is a *picture / snapshot*, focus is *worth nurturing*, trend is descriptive. `devscore.note` (the disclaimer) already enforces this on the card; the Today strip is a glance and links to the card where the disclaimer lives, so no second disclaimer needed on Today.

### Data / persistence detail (Fix 3)
- Add a typed snapshot to `types.ts` so the moat artifact is first-class (today it is an untyped `localStorage` blob):
```ts
/** Weekly snapshot of the Longitudinal Development Score (moat artifact, PRD C4). */
export interface DevScoreSnapshot {
  takenMs: number;
  overall: number;
  byDomain: Record<string, number>; // domain id → 0-100
}
```
  Note: `growth/devScore.ts` already declares a structurally identical `DevScoreSnapshot`. Keep `devScore.ts` as the source of truth and `export type { DevScoreSnapshot }` re-export from `types.ts` (or import it there) — do **not** define two divergent shapes. (The pure module must stay dependency-free, so the canonical definition stays in `devScore.ts`; `types.ts` re-exports for discoverability.)
- Persist snapshots through the same child-collection mechanism the rest of the app uses (`useChildCollection`, see `ArborContext.tsx:159`) under a `devScoreSnapshots` collection, replacing the `localStorage`-only path in `DevScoreCard.tsx:30-49`. Keep `localStorage` as a read-through cache fallback for first paint, but the authoritative weekly snapshot writes to the collection so trend survives device changes (= moat write). `shouldSnapshot` weekly cadence and the `score.confidence === "none"` guard stay exactly as-is.
- The Today strip is **read-only** — it must never write a snapshot (avoid double-writes). Only `DevScoreCard` owns the write.

### Dependency interaction with p2-5-milestone-rebase
`p2-5-milestone-rebase` rebases the milestone set onto age **bands** (`framework.json` ageBands: `0-12m`, `12-36m`, `3-5y`, …) instead of the current `ageGroup` string (`types.ts:111`). C4's "age-appropriate milestone set" is exactly the input `computeDevScore` consumes. After p2-5 lands, the `milestones` array surfaced by `useArbor()` is already filtered/keyed to the child's current band, so **C4 needs no extra filtering** — it scores whatever band-scoped set it is given. The only coupling: confirm the rebased `Milestone` still carries `domain: DevelopmentalDomainId` (it must — domains are orthogonal to age bands) and that `checked` semantics are unchanged. If p2-5 changes the `Milestone` shape, re-run `devScore.test.ts` and adjust the `milestones.map(...)` adapter at `DevScoreCard.tsx:38`.

### Files to create / edit (exact repo-relative paths)
**Create:**
- `PPPPtherapy-/PPPPtherapy-/app/src/components/overview/DevScoreStrip.tsx` — the Today summary (read-only).

**Edit:**
- `PPPPtherapy-/PPPPtherapy-/app/src/components/sections/DevScoreCard.tsx` — domain id→label fix; sr-only trend text; reduced-motion-aware ring; collection-backed snapshot write; widen label column.
- `PPPPtherapy-/PPPPtherapy-/app/src/components/tabs/OverviewTab.tsx` — mount `<DevScoreStrip />` in the card stack (~after line 318 / before `DailyPlayCard` section).
- `PPPPtherapy-/PPPPtherapy-/app/src/types.ts` — add/re-export `DevScoreSnapshot`.
- `PPPPtherapy-/PPPPtherapy-/app/src/lib/i18n.ts` — 4 new keys × 2 languages (append only).
- `PPPPtherapy-/PPPPtherapy-/app/src/components/ui/ProgressRing.tsx` — add optional `animate?: boolean` prop (default true) gating the existing `transition-[stroke-dashoffset]` class. Backward compatible.
- `PPPPtherapy-/PPPPtherapy-/app/src/growth/devScore.ts` — no logic change expected; only if p2-5 alters the `Milestone` shape. Keep as canonical `DevScoreSnapshot` definition.
- `PPPPtherapy-/PPPPtherapy-/app/src/growth/devScore.test.ts` — add a regression assertion that domain ids round-trip unchanged through compute (label resolution is a view concern, not compute), only if compute is touched.

### Shared-file conflict notes
- **`PPPPtherapy-/PPPPtherapy-/app/src/types.ts`** — co-touched by `p2-5-milestone-rebase` (sharedFileMap). p2-5 reshapes `Milestone` / age fields; C4 only *appends* a `DevScoreSnapshot` interface (or re-export). **Land p2-5 first** (it is C4's declared `dependsOn`), then C4 appends its interface at the end of the file's interface block — no overlap with the `Milestone`/age region p2-5 edits. Append-only; do not reorder existing exports.
- **`DevelopmentTab.tsx`** — co-touched by `p2-5-milestone-rebase` and `b2-mychild-story-spine` (conflict hotspot). C4 does **not** need to edit `DevelopmentTab.tsx` (the card is already mounted there). Leave that file to p2-5/b2; if a merge requires re-confirming `<DevScoreCard />` is still the lead element, do it as a no-op verification, not a rewrite.
- **`OverviewTab.tsx`** — conflict hotspot, co-touched by `b1-daily-home`, `c1-rhythm`, `ia-b1-fold-missions`, `m5-touch-error-states`. Per the hotspot guidance, **land b1/c1 (Today shell + rhythm) first**, then C4 inserts a single self-contained `<DevScoreStrip />` line into the settled card stack. Insert as one new `<section>`/component mount; do not reorder sibling cards owned by b1/c1.
- **`ProgressRing.tsx`** and **`i18n.ts`** — `i18n.ts` is co-touched by several copy missions (`mk-p0-8-copy-pack`, etc.); merge by **append only** under the existing `devscore.*` block, no key reordering. `ProgressRing.tsx` is not on the hotspot list; the `animate` prop is additive/back-compatible.
- C4 explicitly does **not** touch `navigation.ts`, `ArborContext.tsx`, `Shell.tsx`, `LanguageContext.tsx`, or `index.css` — staying clear of the four highest-traffic merge magnets (reduced-motion handled via the `animate` prop instead of an `index.css` media block).

### Dependencies (must land first)
- `p2-5-milestone-rebase` — supplies the band-scoped, age-appropriate milestone set that is C4's compute input. Verify `Milestone.domain` survives the rebase.
- Soft-ordering (not hard deps): `b1-daily-home` / `c1-rhythm` should settle `OverviewTab` before the Today strip is inserted (conflict avoidance only).

### Acceptance criteria (testable)
1. `vitest run src/growth/devScore.test.ts` passes (7+ cases green); `tsc --noEmit` clean.
2. In `My Child › Development` on the dev server, the per-domain bars and the "worth nurturing next" line show **human labels** ("Social development"), never enum ids (`social_development`). Verified live on dev server.
3. On **Today**, a compact development strip appears when `confidence !== "none"`, shows the overall number + ring + focus line, and tapping it navigates to `My Child › Development`. When `confidence === "none"`, the strip is absent from Today. Verified live on dev server.
4. Trend persists across a simulated device change: clear `localStorage`, reload — the card's weekly trend is recovered from the child collection (not reset to flat), proving the snapshot is a moat artifact. Verified live on dev server.
5. With OS "Reduce Motion" on, the ProgressRing on both card and strip renders at its final value with no sweep animation. Verified live on dev server.
6. Screen-reader / keyboard: the Today strip is reachable by Tab, activatable by Enter/Space, and announces the overall score + "Tap to open"; each domain bar exposes its label, value, and trend via sr-only text (trend not color-only). Verified with VoiceOver/NVDA or the accessibility-review pass.
7. HE (RTL): card and strip lay out correctly RTL, the Today chevron points logically inward, and all 4 new strings render in Hebrew. Verified live on dev server with `uiLang === "he"`.
8. The Today strip performs **no** snapshot write (only `DevScoreCard` writes); no duplicate snapshots created on a day both surfaces render.

### Operating-rule checks
- **No dark patterns:** the score is framed as a non-diagnostic "picture/snapshot," never a verdict, percentile, or "behind" framing; disclaimer (`devscore.note`) stays on the card; Today links to it rather than gamifying. No streak pressure, no loss-aversion nudging.
- **Privacy / COPPA-2026:** snapshots contain only derived aggregate numbers (0-100 per domain + timestamp) — no free text, no child media — and persist to the child's own collection under existing consent scope. No new data category, no new external call.
- **Moat read/write:** **reads** the milestone set (the moat's longitudinal record); **writes** a typed weekly `DevScoreSnapshot` into the child collection — a new, durable, cross-device moat artifact that powers honest trend. This is the C4 rationale ("a face of the memory moat; rides the growth/ seam") realized.
- **Ships-visible:** the fix is immediately visible (correct labels), Today gains a real summary, and trend becomes trustworthy across devices — all observable on the dev server, not behind a flag.
