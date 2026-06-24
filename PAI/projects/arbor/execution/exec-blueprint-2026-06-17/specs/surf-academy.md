## surf-academy — Surface audit — Academy
**Aspects:** IA, UI/UX, Copy · **Surfaces/platforms:** web:Academy · **Priority:** Phase1

> Skill discipline applied: `impeccable` + `design:design-handoff` + `design:accessibility-review` + `design:ux-copy`.
> Every claim grounded in real files under `PPPPtherapy-/PPPPtherapy-/app/src`. Citations are `file:line`.

---

### Problem / why

Academy is the parent's-own-learning pillar (three leaves: Story Journeys, Parent Masterclasses, Family Formation). No mission owns it cross-aspect — `p1-comic-reader` touches `HeroJourneyTab` but is reader-feature-only (it embeds the comic-book player; it does not audit the catalog IA, the hex offenders, the leaf order, or the masterclasses/family copy+UX). This surface audit closes the gaps:

1. **IA leaf order is wrong vs the redesign target.** `navigation.ts:90-92` orders the Academy section **Story Journeys → Masterclasses → Family Formation**, but the IA redesign target (`arbor-ia-redesign-2026-06-14.md:195-197` and `:80-82`) puts the parent-learning entry first: **Parent Masterclasses → Story Journeys → Family Formation**. The label is also wrong: nav says `"Arbor Academy"` (`navigation.ts:85`) but the redesign explicitly drops the brand prefix → `"Academy"` (`arbor-ia-redesign-2026-06-14.md:101`).

2. **HeroJourneyTab is the #2 hex offender (13 raw hex literals).** Confirmed by sweep: `#38C8F0`, `#3cc081`×2, `#68B4FF`×2, `#6f9e6f`, `#A07AF8`, `#d7aa55`×2, `#e2562d`×2, `#fff`×2 (`HeroJourneyTab.tsx:45-58, 284, 293, 332, 450`). Two design-system maps (`PACK_COLORS`, `METRIC_COLORS`) are hand-rolled hex with no token backing; `#fff` is used as a raw card background twice. This collides with `m3-hex-sweep` (which also owns this file) — this spec defines the *token contract* so m3 can execute mechanically.

3. **Copy is not internationalized and is inconsistent.** `HeroJourneyTab` has **zero** `t()` calls — the entire catalog and player chrome ("Story Journeys", "Start journey", "Weaving your journey…", "The End", "Finish & save …'s development", reflection labels) is hardcoded English even though the surface ships HE/RTL. `Masterclasses.tsx` and `FamilyFormation.tsx` use `t()` for the page header only; all card content (8 class titles, 7 formation items) is hardcoded English. `LanguageContext.tsx` is listed as a shared file because the new Academy keys land in the i18n store it reads.

4. **`PageHeader` silently drops the `eyebrow` prop.** `Masterclasses.tsx:23` and `FamilyFormation.tsx:38` both pass `eyebrow="Arbor Academy"`, but `PageHeader` (`kit.tsx:40-50`) accepts `eyebrow?` in its type and **never renders it**. The "Arbor Academy" eyebrow is invisible today — a real dead-prop bug. The surface should render a proper eyebrow (and reconcile it with the de-branded "Academy" decision).

5. **Masterclasses is 100% `ComingSoon`** — 8 cards, every one stamped "Coming soon" (`Masterclasses.tsx:34`), zero real content. This is borderline a dark-pattern (advertising a populated catalog that does nothing). Needs an honest empty/teaser framing.

---

### Scope across platform domains

- **Web (`web:Academy`)** — the only surface in scope. All three leaf views: `HeroJourneyTab` (Story Journeys catalog + player), `Masterclasses`, `FamilyFormation`, plus the section definition in `navigation.ts` and the i18n keys in `i18n.ts`. This is the audit's entire footprint.
- **iOS / Android (Capacitor)** — no platform-specific code changes. The same React views render in the Capacitor shell; touch-target and safe-area fixes below are shared and benefit native automatically (verify in `m1-ios-safe-area` scope, not here).
- **Landing EN / Landing HE** — out of scope (Academy is in-app only).

---

### IA detail

**A. Reorder + rename the Academy section** in `navigation.ts:83-94` to match the redesign target:

```ts
{
  id: "academy",
  label: "Academy",                 // was "Arbor Academy" — drop brand prefix (IA redesign :101)
  icon: GraduationCap,
  items: [
    { tab: "masterclasses", label: "Parent Masterclasses", icon: GraduationCap }, // FIRST
    { tab: "stories",       label: "Story Journeys",        icon: BookOpen },
    { tab: "family",        label: "Family Formation",      icon: Heart },
  ],
},
```

- `primaryTabOf(section)` returns `section.items[0].tab` (`navigation.ts:134-136`) — reordering makes **Masterclasses** the default Academy tab on pillar click. Confirm that is intended (it matches the redesign's "help *me* become a better parent" framing, :37). If product wants Story Journeys to remain the landing leaf, keep `stories` first and only fix the label; flag the decision in the PR.
- `TAB_SECTION_FALLBACK` (`navigation.ts:103-125`) contains no Academy leaves — no change needed there.
- `HeroComicsTab` is already removed from nav (comic capability embedded in stories per backlog :22) — do **not** re-add a comics leaf.

### UI/UX detail

**B. Token contract for the hex sweep (HeroJourneyTab).** Replace the 13 raw hex literals. Add four pack tokens + reuse existing metric/brand tokens. `index.css` already defines `--arbor-clay #34b277`, `--arbor-clay-deep`, `--arbor-green-soft`, `--arbor-green-ink`, `--arbor-sky #3f8cc9`, `--arbor-yellow #c2882a` (`index.css:28-40`). The pack/metric palette has no tokens yet — add them in `index.css :root` so both `m3-hex-sweep` and this surface share one source:

```css
/* Academy — Hero Journey pack + development-metric accents */
--arbor-pack-courage:        #e2562d;
--arbor-pack-responsibility: #d7aa55;
--arbor-pack-growth:         #6f9e6f;
--arbor-pack-wisdom:         #68b4ff;
--arbor-metric-resilience:   #a07af8;
--arbor-metric-empathy:      #38c8f0;
```

Then in `HeroJourneyTab.tsx`:
- `PACK_COLORS` / `METRIC_COLORS` (`:45-58`) → reference `var(--arbor-pack-*)` / `var(--arbor-metric-*)`. (Note: these maps are read into inline `style` and string-interpolated as `${color}22` for alpha — keep them as JS values but source from `getComputedStyle`-safe CSS vars via a small `cssVar()` helper, OR keep the literals **only here** and let `m3-hex-sweep` decide. Minimum viable: move the literals into the new tokens and reference tokens where they appear directly in JSX style — i.e. the two `#fff` card backgrounds at `:284, :293` become `var(--arbor-paper-elevated)`; the gradient `#3cc081` at `:332, :450` is already paired with `var(--arbor-clay)` and can stay as the gradient's light stop or move to a `--arbor-clay-light` token.)
- The `${PACK_COLORS[p.id]}22` / `${PACK_COLORS[story.pack]}22` alpha trick (`:293, :313`) is not token-able as-is; convert to `color-mix(in oklab, <token> 13%, transparent)` which `index.css` already uses elsewhere (`:434-437`).

**C. States audit (all three leaves).**

*HeroJourneyTab — catalog (`:240-383`):*
- **default** ✓ (story grid + metrics + library).
- **loading** — per-card spinner on Start (`:334-342`) ✓; library has a `Loading…` line (`:354-355`) ✓.
- **empty** — library `EmptyState` ✓ (`:357-360`). Metrics panel shows zeros — acceptable. Add an empty hint when `visibleStories.length === 0` for a pack filter (currently renders a blank grid).
- **error** — `startJourney` catch → `toast(msg, "error")` ✓ (`:132-134`). No inline retry; acceptable for Phase1.

*HeroJourneyTab — player (`:385-502`):* default/decision/consequence/reflection states all handled. No loading state needed (render is pre-fetched). ✓

*Masterclasses (`:19-39`):* only a default state of 8 `ComingSoon` cards. **Fix:** reframe honestly — one lead "in production" teaser card + the rest as a quiet preview list, OR a single `EmptyState` ("Masterclasses are in production — here's what's coming") above the grid. Keep `ComingSoon` badges but make the empty reality explicit (no fake catalog). Subtitle copy already says "Our first lessons are in production" (`i18n.ts:287`) — make the UI match that promise.

*FamilyFormation (`:21-73`):* Family Charter is a real persisted tool (localStorage `arbor.familyCharter`, `:17, :26-31`) ✓ with proper default/empty ("Add a value to begin your charter." `:50`). The 7 ITEMS grid is all-`ComingSoon` (`:64`) — same honesty note as Masterclasses, but lower priority since Charter is real.

**D. Touch targets & a11y (AA).**
- Pack-filter chips (`:281-297`) are `py-1.5` ≈ 30px tall — **below the 44px min**. Bump to `py-2.5` and ensure ≥44px hit area (or wrap with adequate padding). Same for the library replay cards (`:364-376`, `p-3` is fine since they're large blocks).
- Reflection question buttons (`:425-443`) are checkbox-pattern buttons but use no `role`/`aria-pressed`. Add `aria-pressed={!!questionsChecked[i]}` and `role` is implicit on `<button>` — fine, just add the pressed state for SR.
- Pack-filter chips convey active state by color only (`:284, :293`) — add `aria-pressed` to each filter button so state is non-visual-accessible.
- `chooseOption` fires `confetti()` unconditionally (`:142`) and the finish/save path fires confetti twice (`:162`) — **gate all `canvas-confetti` calls behind `prefers-reduced-motion`** (`window.matchMedia('(prefers-reduced-motion: reduce)').matches`). Same for the `motion.div` entrance animations (motion/react respects reduced-motion if configured — verify). This is the only motion-a11y gap on the surface.
- Decision choice letter badge uses `uppercase` on `c.id` (`:199-201`) — fine; ensure the choice button has a discernible accessible name (the `<span>` label provides it).
- `dir="auto"` is correctly applied to user/AI-generated strings (`:202, :439`) for RTL ✓. Keep it on every AI narration/choice/question string.

**E. RTL.** UI mirrors via `document.documentElement.dir` (`LanguageContext.tsx:43-45`). The player nav (`renderNav` `:211-237`) uses `ChevronLeft`=Back / `ChevronRight`=Next — **these do not flip in RTL**. In HE, "Back" should point right and "Next" left. Either swap icons when `uiLang === 'he'` or use logical `ChevronStart`/`ChevronEnd` wrappers. The immersive overlay close `X` (`:491`) is fine.

### Copy detail (ux-copy)

**F. Internationalize HeroJourneyTab.** Add keys to `i18n.ts` (EN block ~`:280-290`, HE block ~`:780-790`) and route every hardcoded string through `t()`. Concrete strings (EN → key):

| Current string (file:line) | New key | EN | HE |
| --- | --- | --- | --- |
| "Story Journeys" `:245` | `academy.stories.title` | Story Journeys | מסעות סיפור |
| catalog subtitle `:248-250` | `academy.stories.sub` | {name} becomes the hero of timeless stories that build courage, responsibility, resilience, empathy, and wisdom. | {name} הופך/ת לגיבור/ה של סיפורים נצחיים שמפתחים אומץ, אחריות, חוסן, אמפתיה וחוכמה. |
| "{name}'s development" `:257` | `academy.stories.dev` | {name}'s development | ההתפתחות של {name} |
| "{n} journeys completed" `:259` | `academy.stories.completedCount` | {n} journeys completed | {n} מסעות הושלמו |
| "All packs" `:286` | `academy.stories.allPacks` | All packs | כל החבילות |
| "Start journey" `:341` | `academy.stories.start` | Start journey | התחילו מסע |
| "Weaving your journey…" `:336` | `academy.stories.weaving` | Weaving your journey… | אורגים את המסע… |
| "Journey library ({n})" `:352` | `academy.stories.library` | Journey library ({n}) | ספריית המסעות ({n}) |
| "No journeys yet" / body `:358-359` | `academy.stories.empty.title` / `.body` | (keep wording) | (translate) |
| "What do you do, {name}?" `:189-190` | `academy.stories.prompt` | What do you do, {name}? | מה תעשה/י, {name}? |
| "Back" `:219` / "Next" `:231` / "The End" `:234, :490` | `common.back` / `common.next` / `academy.stories.end` | Back / Next / The End | חזרה / הבא / הסוף |
| "Today we practiced" `:408` | `academy.stories.practiced` | Today we practiced | היום תרגלנו |
| "Talk about it together" `:423` | `academy.stories.talk` | Talk about it together | דברו על זה יחד |
| "Finish & save {name}'s development" `:452` | `academy.stories.finish` | Finish & save {name}'s development | סיימו ושמרו את ההתפתחות של {name} |
| "Saved to {name}'s development" `:456` | `academy.stories.saved` | Saved to {name}'s development | נשמר להתפתחות של {name} |
| "All journeys" `:470` | `academy.stories.allJourneys` | All journeys | כל המסעות |
| "Immersive" `:478` | `academy.stories.immersive` | Immersive | מסך מלא |

Interpolate `{name}` / `{n}` via the existing `t(key, vars)` signature (`LanguageContext.tsx:54`). Note the toast strings (`:133, :163`) also need keys.

**G. Masterclasses / FamilyFormation card content i18n.** The 8 `CLASSES` titles (`Masterclasses.tsx:7-16`) and 7 `ITEMS` (title+desc, `FamilyFormation.tsx:7-15`) are hardcoded English. For Phase1, route them through `t()` with keys `academy.master.class.1..8` and `academy.family.item.1..7.{title,desc}`. (If full translation is deferred, at minimum wrap so HE shows translated header — but the redesign ships HE, so translate the card titles too.)

**H. Eyebrow fix.** Either (a) make `PageHeader` render `eyebrow` (`kit.tsx:40-50` — add a small uppercase eyebrow `<p>` above the `<h1>`), then both callers show "Academy"; or (b) drop the dead `eyebrow` prop from both callers. Recommended: **(a)** + change the passed value from `"Arbor Academy"` to `t("academy.eyebrow")` = "Academy" (de-branded per IA :101). HeroJourneyTab's catalog header (`:244-246`) is a custom `<h2>`, not `PageHeader` — give it the same eyebrow treatment for consistency, or migrate it to `PageHeader`.

### Marketing detail
Not applicable — Academy is in-app, no acquisition loop. (Completing a Story Journey already writes development metrics to the moat; the share/export of a finished comic is owned by `p1-comic-reader` + `mk-p0-3-share-export`, not this audit.)

---

### Files to create / edit (exact repo-relative paths)

**Edit:**
- `PPPPtherapy-/PPPPtherapy-/app/src/lib/navigation.ts` — reorder Academy items (Masterclasses first), rename label `"Arbor Academy"` → `"Academy"` (`:83-94`).
- `PPPPtherapy-/PPPPtherapy-/app/src/components/tabs/HeroJourneyTab.tsx` — i18n all chrome via `t()`; reduced-motion gate on `confetti`/motion; touch-target bump on filter chips; `aria-pressed` on filter + reflection buttons; RTL chevron flip; token-source the hex maps (coordinate w/ m3).
- `PPPPtherapy-/PPPPtherapy-/app/src/components/sections/Masterclasses.tsx` — honest empty/teaser framing; i18n card titles; eyebrow fix.
- `PPPPtherapy-/PPPPtherapy-/app/src/components/sections/FamilyFormation.tsx` — i18n card titles/descs; eyebrow fix.
- `PPPPtherapy-/PPPPtherapy-/app/src/lib/i18n.ts` — add all `academy.*` keys (EN block ~`:280`, HE block ~`:780`). **Append only** — do not reorder existing keys.
- `PPPPtherapy-/PPPPtherapy-/app/src/index.css` — add `--arbor-pack-*` + `--arbor-metric-*` tokens in `:root` (coordinate ordering with `m4`/`m2`/`m1` — see conflict notes).
- `PPPPtherapy-/PPPPtherapy-/app/src/components/ui/kit.tsx` — render `eyebrow` in `PageHeader` (`:40-50`) (also fixes the `#eef1f0`/`#69747f` raw hex in `ComingSoon` `:93` if bundling with m3).

**Touched but not owned (shared — see below):**
- `PPPPtherapy-/PPPPtherapy-/app/src/context/LanguageContext.tsx` — only if a new shared `t()` key namespace helper is needed; otherwise read-only (the surface consumes `t`/`uiLang`, it does not modify the provider).

**Create:** none.

---

### Shared-file conflict notes

Per the conflict hotspot list:

- **`navigation.ts`** (hotspot: `b1-daily-home, b2, b3, b5-naming-moat-exposure, ia-b1-fold-missions, ia-b6-ask-from-ask, surf-app-shell`). The note says: *land b1/b2/b3 pillar reorgs first, then ia-b1 + ia-b6, then b5 as the final dead-leaf/order/fallback cleanup.* This Academy reorder is a leaf-order edit. **Sequence: do this surface's `navigation.ts` edit inside the `b5` final order/cleanup pass, or hand the exact diff (Academy items reorder + label rename) to whoever runs b5 so it is not done in parallel.** Touch ONLY the `academy` block — do not touch other sections' items.

- **`LanguageContext.tsx`** (hotspot: `b5, ia-b6-ask-from-ask, surf-ask, surf-academy`). The note: *Multiple copy/IA missions append keys; merge by appending only (no reordering) and reconcile key collisions in b5 final pass.* This surface does **not** modify the provider itself — it only adds keys to `i18n.ts`. Use the `academy.*` namespace exclusively to avoid collision with `surf-ask`'s keys (which use `ask.*`/`hub.*`) and b5's moat-copy keys. If any `common.back`/`common.next` key already exists, reuse it rather than redefining.

- **`HeroJourneyTab.tsx`** (hotspot: `p1-comic-reader, m3-hex-sweep, surf-academy`). Two parallel missions touch this file. **Coordination:** `p1-comic-reader` edits only the **player body** (`HeroScenePlayer` integration, page-turn, save/share — `:386-501`). `m3-hex-sweep` owns the **hex literals** (`:45-58, 284, 293, 332, 450`). This surface owns the **i18n + a11y + IA copy** of the catalog (`:240-383`) and the chrome. To avoid clobber: (1) land `p1-comic-reader` first (it is a `dependsOn`); (2) provide the token contract (section B) to `m3-hex-sweep` so it executes the color swap, and this surface only routes the *resulting* color references — do not both rewrite `PACK_COLORS` simultaneously; (3) the i18n/a11y edits in the catalog don't overlap the player region p1 owns. Stage as: **p1 → m3 (hex) → surf-academy (i18n/a11y/eyebrow)**.

- **`index.css`** (hotspot: `p3, m1-ios-safe-area, m2-token-extraction, m4-retire-override-layer`). The note: *Order: m4 → m2 → m1 → p3. Never parallelize.* This surface only **appends** `--arbor-pack-*`/`--arbor-metric-*` tokens to `:root`. Append them as part of the **m2 token-extraction pass** (they are exactly that mission's job) rather than as a standalone edit — hand m2 the six token definitions in section B.

- **`kit.tsx`** (hotspot: `p3, m2, m3`). The `PageHeader` eyebrow render is a tiny additive change; the `ComingSoon` raw hex is m3's. **Bundle the eyebrow change with `p3-ios-grade-audit` polish or land it as a single 3-line additive edit that m3 can rebase trivially.** Do not refactor `PageHeader`'s API beyond rendering the already-declared `eyebrow` prop.

---

### Dependencies (must land first)

- **`p1-comic-reader`** — owns the `HeroJourneyTab` player region; land it before this surface's `HeroJourneyTab` edits so the i18n/a11y pass rebases onto the final player markup.
- **Soft-ordering (not hard blockers):** `m3-hex-sweep` and `m2-token-extraction` should ideally land the token swap before/with this surface's color references; `b5-naming-moat-exposure` is the agreed home for the `navigation.ts` order/label edit. Coordinate per conflict notes; if they slip, this surface can still ship i18n + a11y + Masterclasses/Family honesty independently.

---

### Acceptance criteria (testable)

1. Academy nav renders **Parent Masterclasses → Story Journeys → Family Formation** in that order, labelled **"Academy"** (no "Arbor" prefix), verified live on dev server in the sidebar.
2. `grep -oE '#[0-9a-fA-F]{3,8}' HeroJourneyTab.tsx` returns **0** raw hex literals (or only the documented gradient light-stop if a `--arbor-clay-light` token is not added) — verified by sweep; the catalog renders visually identical (same pack/metric colors) on dev server.
3. With UI language = HE, **every** visible string in Story Journeys catalog + player is Hebrew and RTL-mirrored (chevrons flip correctly); no English leaks. Verified live on dev server with `localStorage.arbor.uiLang='he'`.
4. Masterclasses and FamilyFormation page eyebrow renders "Academy" (no longer silently dropped); card titles localize in HE.
5. Masterclasses no longer presents 8 fake-catalog cards as if live — honest "in production / coming" framing matches the subtitle promise; verified on dev server.
6. With `prefers-reduced-motion: reduce`, **no** confetti fires and entrance animations are suppressed; verified via DevTools emulation on dev server.
7. Pack-filter chips and reflection buttons expose `aria-pressed`; all interactive controls have ≥44px touch targets; keyboard-tab order reaches every control. Verified with a11y inspector on dev server.
8. `tsc --noEmit` passes and the existing test suite (241 tests) stays green.

---

### Operating-rule checks

- **No dark patterns:** the Masterclasses honesty fix is the core of this — we stop presenting a non-existent catalog as live. No fake urgency, no forced confetti (now reduced-motion-gated). Pack filters reflect real story availability.
- **Privacy / COPPA-2026:** Story hero uses the **generated stylized avatar (data-URL), never a raw face photo or remote URL** — already enforced (`HeroJourneyTab.tsx:68-71`); keep that guard intact through the edits. No new data collection on this surface.
- **Moat read/write:** Story Journeys **reads** completed `heroRuns` to compute development metrics (`:73-77`) and **writes** earned metrics back via `runsCol.upsert` on finish (`:146-164`). Preserve this read/write path exactly; the Family Charter persists family values to `arbor.familyCharter` (`FamilyFormation.tsx:26-31`) — a moat write the IA should keep wired.
- **Ships-visible:** every change is user-visible on the live dev server (nav order, HE strings, honest Masterclasses, reduced-motion behavior, eyebrow). No behind-the-flag work.
