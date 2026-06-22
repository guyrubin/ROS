# Arbor Conflict Map — shared-file → items matrix + safe build order

**Date:** 2026-06-17 · **Companion:** `EXECUTION-BLUEPRINT.md` (waves, index, risks)
**Repo root for all paths:** `PPPPtherapy-/PPPPtherapy-/app/src/` unless marked otherwise.

This is the binding shared-file contention map. For every file touched by 2+ items it gives: the editing items, the **safe build order**, and **why**. Legend:
- **SERIAL** = exactly one item edits at a time, in the stated order (real clash risk).
- **PARALLEL-SAFE** = simultaneous edits OK because regions are disjoint and append-only.
- **CALL-ONLY** = item invokes existing exports, does not edit the file.

---

## A. The CSS / design-system substrate (highest contention)

### `index.css` — #1 merge magnet (490 lines, design system + override layer + play layer)
**Items:** m4, m2, m1, m5, m7, p3 · **SERIAL.**

| Order | Item | Region / action |
| :-: | :-- | :-- |
| 1 | **m4** | DELETE the dead `.arbor-app [class*=...]` override layer (~lines 153–247, 334–340). Shrinks file ~40%. Must go first. |
| 2 | **m2** | Add `:root` token inventory consumed by TS (`CSS_VARS`). New semantic tokens (`--arbor-on-accent`, `--arbor-cam-stage`, etc.). |
| 3 | **m1** | Add safe-area insets / `--safe-bottom` var; `viewport-fit=cover` plumbing. |
| 4 | **m5** | Touch-target + ErrorState-related rules (minimal). |
| 5 | **m7** | PlayKit primitive CSS (`play-correct`/`play-nudge` reconciliation, lines ~477–489). |
| 6 | **p3** | APPEND ONLY at end-of-file (below the PLAY LAYER which begins line 410, after line 489). Never touch override layer (gone) or `:root`. Reduced-motion guard at lines ~400–405 is read-only. |

**Why:** m4 removes the conflict surface first; m2 establishes the token vocabulary the rest reference; m1 adds insets that m5/m7 hit-box math depends on; p3 is polish-only and must see the final state. **A single out-of-order edit corrupts the design system app-wide.**

### `:root` token block (inside index.css) — **m2 SOLE AUTHOR.** m3 consumes via `var(--arbor-*)`; never re-declares.

### `components/ui/kit.tsx`
**Items:** m2, m3, p3 · **SERIAL.** Order: **m2** (re-export tokens / `PASTEL`, `cardCls`) → **m3** (swap hardcoded hex on `Button`/`kit` primitives, 2 each) → **p3** (Chip/TrustSafetyBar contrast adjust AFTER values settle; Chip is a non-interactive `<span>` — contrast-only, no tap-target change).

### `components/ui/playkit.tsx`
**Items:** m2, m7, p1, p2-7, p3 (+ p2-11 reads) · **SERIAL APPEND-ONLY.**
Order: **m2** (token re-export) → **m7** (settle primitive API: ChoiceTile/Celebrate/ProgressPips) → **p1** (append `ComicPage` export) → **p2-7** (append `TraceCanvas` export — but see §F: tracing already exists, likely dropped) → **p3** (polish, no signature changes).
**Rule:** never touch `TONE_INK`/`TONE_SOFT` maps (m2 owns) or existing primitive signatures (m7 owns). New features append new exports only.

---

## B. The app shell & global chrome

### `components/layout/Shell.tsx`
**Items:** m1, m5, surf-app-shell, p4, p3 (+ b5 reads logs) · **SERIAL.**

| Order | Item | Action |
| :-: | :-- | :-- |
| 1 | **m1** | Safe-area insets on header/chrome. |
| 2 | **m5** | Resize header buttons to ≥44px (search/settings/sign-out). |
| 3 | **surf-app-shell** | Chrome IA/copy; append muted `top.trackingSince` moat segment after focus chip (`Shell.tsx:147`) — only if `b5`/`moat.ts` landed, else skip. |
| 4 | **p4** | Add ONE `sr-only` route-status live-region div at a stable anchor. |
| 5 | **p3** | Tap-target + reduced-motion polish; re-anchor to snippets (line refs drift ~20–50). |

**Note:** b1/c1/c2 do NOT edit Shell — they consume `--safe-bottom`. The sign-out button is a `min-h-[38px]` padded button (line ~219); only Settings is `w-10 h-10` (line ~209) — m5/p3 must not conflate them.

### `App.tsx`
**Items:** m4, mk-p0-4, mk-p0-2 · **SERIAL.**
Order: **m4** (migrate auth/profile gates + config-error screen off dark palette) → **mk-p0-4** (billing-return effect on mount: `?billing=success` → `refreshEntitlement()` + `history.replaceState`; entitlement-transition watcher firing `trackTrialStart`/`trackPaid`, beta/comp-guarded) → **mk-p0-2** (referral-capture-on-boot). Append distinct `useEffect`s; no reorder.

### `components/layout/MobileNav.tsx`
**Items:** m1, p3 (+ surf-android reads) · **SERIAL.** Order: **m1** (safe-area inset keeps tabs above gesture pill) → **p3** (tap-target polish).

### `lib/native.ts`
**Items:** m1, p2-6, surf-ios, surf-android · **SERIAL APPEND.**
Order: **m1** (edge-to-edge bars) → **p2-6** (append local-notification channel + tap listener as NEW try/catch inside `initNativeShell`) → **surf-ios** / **surf-android** (reconcile `StatusBar.setBackgroundColor` to transparent under edge-to-edge; native:18). Never reorder the status-bar/keyboard/splash blocks.

---

## C. The god-context & routing

### `context/ArborContext.tsx` — #1 god-context hotspot
**Items:** p4, p2-5, ia-b1, b5, mk-p0-4 (+ many CALL-ONLY) · **SERIAL.**

| Order | Item | Action / region |
| :-: | :-- | :-- |
| 1 | **p4** | Remove error-as-content writes (`renderApiConnectionError` at :293/:332/:619 — NOT :287/:326/:612 as spec says); append entitlement cache ONLY if not already in `useEntitlement.ts` (prefer wrapping existing hook — see §G). |
| 2 | **p2-5** | Self-contained milestone-migration block near `milestonesCol` (~:159–173). |
| 3 | **ia-b1** | Remove `missions` from `ActiveTab` union / `VALID_TABS` / `tabRegistry` / `TAB_SECTION_FALLBACK`. SOLE owner of routing-union edits. |
| 4 | **b5** | Moat-copy reads (`computeMoatStat`); no value-object reorder. |
| 5 | **mk-p0-4** | (coordinated with p4) loop-wiring touchpoints; p4 owns error/quota state, mk-p0-4 owns loop. |

**Rule:** do NOT touch the `ActiveTab` union / `VALID_TABS` / hash routing except `ia-b1`. Never reorder the context value object (~:870–956). Each edit a self-contained block.

### `lib/navigation.ts` — IA-edit hotspot
**Items:** b1, b2, b3, ia-b1, ia-b6, b5 · **SERIAL.**
Order: **b1 → b2 → b3** (pillar reorgs land first) → **ia-b1 → ia-b6** (remove orphan fallbacks; ia-b1 removes the one `missions` fallback line) → **b5** (final dead-leaf audit / registry cleanup). Only remove the lines your item owns; do not reorder `SECTIONS`.

### `lib/navigation.test.ts`
**Items:** p4 (parity test) · note: tests `SECTIONS`/`sectionForTab` (6-pillar IA), NOT ArborContext leaf routing. p4's routing parity test belongs in a NEW `arborRouting.test.ts` (see EXECUTION-BLUEPRINT §7 risk #3).

---

## D. Types & analytics contracts

### `types.ts`
**Items:** p2-5, c4, p2-10, p2-9 · **PARALLEL-SAFE (append-only, disjoint fields).**
- **p2-5:** `Milestone.ageMonths/source/reference/exemplar` + `ChildProfile.birthDate/gestationalWeeks`. Land `ageMonths` FIRST (c4 consumes it).
- **c4:** `DevScoreSnapshot` interface (append at end).
- **p2-10:** optional `SpeechAttempt` fields.
- **p2-9:** `ChildProfile.consent` (append after avatar block).
**Rule:** append distinct members only; no reorder. Note `PracticeEventKind` already has `'phonics'|'sight-word'|'letter-trace'` (types.ts:325–327) — p2-7 must NOT re-add `'letter-trace'` (duplicate).

### `lib/loopEvents.ts` — growth-event contract
**Items:** mk-p0-4 (writer/freezer), mk-p0-2 (add `trackInviteActivated`); p1, mk-p0-3, mk-p2-6 CALL-ONLY · **SERIAL for additions.**
Order: **mk-p0-4** wires the dead exports (`trackTrialStart`/`trackPaid`/`trackShareInitiated`/`trackShareCompleted`/`trackInviteSent`) and FREEZES names → **mk-p0-2** appends `trackInviteActivated` → consumers import stable names. `LoopArtifact` union (`avatar|story|answer_card|growth_card`): surface-owning missions edit the union; mk-p0-4 reuses `story` for the packet, adds none. p4's `gen_*` events live in a SEPARATE `genEvents.ts` — NOT in loopEvents.ts.

### `lib/analytics.ts`
**Items:** mk-p0-4 only (confirm `track()` sink) · No rename, no reorder. p4 and mk-p1-6 read the sink but do not edit.

### `lib/i18n.ts` — the REAL i18n key store (NOT `LanguageContext.tsx`)
**Items:** mk-p0-8, p2-5 (`ms.*`), p2-6 (`ov.jitai.*`), p2-9 (`consent.*`), mk-p2-1 (`nl` dict), mk-p2-7 (`paywall.*`), surf-* / b5 (misc) · **PARALLEL-SAFE (append-only, distinct namespaces).**
Order preference: **mk-p0-8** (referral/share keys) FIRST so mk-p2-1 localizes a stable set. All others append `<namespace>.*` keys to BOTH `en` and `he` maps (EN ~line 213/524, HE ~line 761/1060). **Never reorder.** Every new key MUST exist in both en+he or `t()` falls back to the raw key string (HE users see `ms.seeIt`).
**Correction:** specs p2-5 / p2-6 wrongly name `LanguageContext.tsx` (67-line shim, holds no maps) — all key edits target `lib/i18n.ts`. This also means p2-5/p2-6/p2-9 share the file with the mk copy items (coordinate with mk-p0-8 owner).

---

## E. The clinical export / report chain

### `lib/reportExport.ts` — single clinical exporter
**Items:** b3, c3, p2-8, p2-hero, mk-p0-3, mk-p2-6 · **SERIAL.**

| Order | Item | Action |
| :-: | :-- | :-- |
| 1 | **b3** | Care/Consult reorg of the export call sites. |
| 2 | **c3** | `buildReport` / `openPrintableReport` restructure for Ask-a-Specialist. |
| 3 | **p2-8** | Add `'screening'` `ReportType` case + optional context fields (only if reconciled with `lib/monitoring.ts` — see §F). |
| 4 | **p2-hero** | Add optional `heroImageUrl` field + brand-lockup `<img>`; prefer `data:` URL or wait for `img.onload` before print (250ms timeout risks blank hero). |
| 5 | **mk-p0-3 / mk-p2-6** | Branded share renderer BESIDE `buildReport` (do not modify the clinical HTML path). |

**Rule:** one exporter shared by c3/b3/p2-8/p2-hero. Additive only. `buildReport` has no TS exhaustiveness check — a missing case silently returns undefined; verify `tsc` after adding a case.

### `components/sections/Reports.tsx`
**Items:** b3, c3, p2-8, p2-hero · **SERIAL append-only.** Order matches reportExport. p2-8 adds `useChildCollection('screenings')` read; p2-hero adds `useHeroAvatar()` + `heroImageUrl` arg. Do not touch Consult/Handoff reorg (b3 owns).

### `consult/packet.ts`
**Items:** b3, c3, p2-8 · **SERIAL.** p2-8 appends a screening section. **WARNING:** the existing `packet.test.ts:30` asserts `sections.map(s=>s.id) === ['about','patterns','development','tried','memory']`. Inserting screening mid-array BREAKS that test. p2-8 must either APPEND at the end (after `memory`) or update the test assertion explicitly — do not claim "no reorder" while inserting mid-array.

---

## F. The practice / child-register chain

### `components/practice/SpeechCoachTab.tsx`
**Items:** p2-10, p2-7, m7 · **SERIAL.**
Order: **p2-10** (stabilize `startRecording`/`scoreUtterance`, add scoring states) → **p2-7** (reuse the path with `level:'sound'`; insert whole SectionCard blocks ~line 408/510) → **m7** (adopt `ChoiceTile`/`Celebrate` for category-pick + Sound Studio). Land p2-10 before p2-7 (p2-7 reads `targetSoundCorrect`).

### `practice/signals.ts`
**Items:** p2-6, p2-10, p2-7 (+ p2-7 reads) · **PARALLEL-SAFE (append at end).**
- p2-6: append `practiceGapDomains()`.
- p2-10: append `phonemeAccuracy()`.
- p2-7: edit `eventAccuracy` kind-lists in `domainBands`/`domainConfidence`.
**WARNING:** signals.ts:209–213 DELIBERATELY excludes phonics from `languageAcc` accuracy ("exposure not accuracy ... excluded to avoid inflating the language band"). p2-7 AC #7 (phonics → domain band) REVERSES this — must justify or drop (see §G / blueprint risk #1).

### `server/childAsr.ts`
**Items:** p2-9, p2-10 · **SERIAL, disjoint regions.** p2-9: COMMENT-ONLY edit (header ~lines 12–14 naming the consent gate). p2-10: actual `hasConsent` wiring + vendor schema mapping (inside `scoreSoapbox`/`scoreWhisper`). Do not add the gate call in p2-9 (would clobber p2-10).

### `components/profile/AvatarCreator.tsx`
**Items:** p2-9, p4, mk-p0-3 · **SERIAL.** Order: **p2-9** (gate photo mode, add `child` prop — signature change FIRST) → **p4** (migrate `generate()`/error path to `useGenerative`) → **mk-p0-3** (share renderer downstream of `result`). Prefer migrating `ArborVision` as p4's primary reference site (fewer co-editors).

### EXISTING-FEATURE COLLISIONS (rescope required)
- **p2-7-phonics-tracing:** `EarlyReadingTrack.tsx` + `literacy.ts` already ship the phonics ladder + `LetterTrace` tracer (live at SpeechCoachTab:510). Rewrite p2-7 as an enhancement; drop the new `TraceCanvas`/`phonicsContent.ts`.
- **p2-8-red-flag-monitoring:** `lib/monitoring.ts` (Mission M8) + Screening.tsx monitoring SectionCard already ship a monitoring layer + `buildMonitoringReportDoc`. Rewrite p2-8 to extend `deriveMonitoring` with screening-history input; do NOT build a second strip.

---

## G. Today (OverviewTab) & Grow (DevelopmentTab) render chains

### `components/tabs/OverviewTab.tsx` (Today)
**Items:** b1, ia-b1, c1, c2, c4, p2-6, m5, b5 · **SERIAL (per-section scoping).**
Order: **b1** (rebuild Today spine + define `DailyPlayCard`/`MissionsPanel` tenant slots) → **ia-b1** (mission block) → **c1** (Rhythm strip) → **c2** (Daily Play completion handler into b1's slot) → **c4** (compact dev-score strip) → **p2-6** (JITAI nudge section) → **m5** (error triad) → **b5** (moat copy). Each item edits ONLY its own `<section>`. **Do not parallelize** — highest single-file contention after index.css.

### `components/tabs/DevelopmentTab.tsx` (Grow)
**Items:** p2-5, c4, p2-6, b2 · **SERIAL.** Order: **p2-5** (comment/minimal) → **c4** (dev-score) → **p2-6** (NEW element above `DevScoreCard`, not an existing section) → **b2** (My-Child hub IA — owns HubTabs panel list). Do not touch `HubTabs`/`DevScoreCard` outside your scope.

### `components/sections/DevScoreCard.tsx`
**Items:** c4, p2-5, p2-hero · **SERIAL.** Order: **c4** (label fix `labelFor`, snapshot persistence, a11y) → **p2-5** (one header-row insertion) → **p2-hero** (avatar header). One header-row insertion each; leave score logic untouched.

### `components/tabs/MilestonesTab.tsx`
**Items:** p2-5, p2-hero · **SERIAL.** p2-5 owns catalog/age-window logic; p2-hero adds ONE header-row avatar. Note the confetti helper is `celebrate()` (lines 15–22), not `confetti()`.

### `components/sections/Screening.tsx`
**Items:** b2, p2-8 · **SERIAL.** Land **b2** (entry-point/IA placement) first; **p2-8** confines edits to component body (intro strip + result actions), keep route ids `screening`/`reports`/`find-pro` intact. Line refs in p2-8 are stale (save is :59, "Last checked" :124–132, flagged button :225, toast :233).

### `components/profile/ProfileSwitcher.tsx`
**Items:** p2-hero · **CONDITIONAL.** HeroAvatar reads ArborContext active child, ignores props — cannot render an arbitrary dropdown row child. Either leave on generic `Avatar`, or add an optional `childProfile`/`photoUrl` prop to HeroAvatar (see blueprint risk).

### `hooks/useEntitlement.ts` (existing module cache)
**Items:** p4 · **DO NOT duplicate.** p4 should build `useEntitlementGuard.ts` as a thin wrapper over the EXISTING `useEntitlement` (add `nearLimit`/`atLimit`/`enforced`), and NOT add a second entitlement cache to ArborContext (removes one edit from the #1 hot file).

### `context/ProfileContext.tsx`
**Items:** mk-p0-4, p2-9 (conditional) · **SERIAL.** `updateChild` (lines 142–152) swallows errors and never rejects — p2-9's revert-on-failure AC is dead unless p2-9 edits this file to re-throw (coordinate; shared with mk-p0-4).

---

## H. Marketing landing files

### `html/arbor-marketing-landing-page-en.html` (repo: PAI/projects/parenting-os-plugin/)
**Items:** mk-landing-parity-rebuild, mk-p0-1, mk-p0-5, mk-p2-1, p3 · **SERIAL.**
Order: **mk-landing-parity-rebuild** (REWRITES wholesale) → **mk-p0-1** (domain canonical URLs) → **mk-p0-5** (UTM/attribution scripts) → **mk-p2-1** (NL variant references) → **p3** (tap-target/AA/reduced-motion/safe-area polish — RE-READ the file first, it has changed).

### `html/arbor-marketing-landing-page-he.html`
**Items:** mk-delete-stale-landing, mk-landing-parity-rebuild, mk-p0-5, mk-p1-* entry points, p3 · **SERIAL.**
Order: **mk-delete-stale-landing** (remove stale HE artifact) → **mk-landing-parity-rebuild** (rebuild on shared system, RTL) → **mk-p0-5** (UTM) → **mk-p1-1/1-3/1-4 etc.** (referral/UTM entry points for group/social traffic) → **p3** (polish, re-read first).

**Rule:** the parity rebuild is the upstream owner of both files; every other landing edit depends on it landing first. p3 polishes last and must re-read immediately before editing.

---

## I. Quick contention summary (which files force serialization)

| File | # items | Mode | Master order |
| :-- | :-: | :-- | :-- |
| `index.css` | 6 | SERIAL | m4→m2→m1→m5→m7→p3 |
| `OverviewTab.tsx` | 8 | SERIAL | b1→ia-b1→c1→c2→c4→p2-6→m5→b5 |
| `ArborContext.tsx` | 5 | SERIAL | p4→p2-5→ia-b1→b5→mk-p0-4 |
| `reportExport.ts` | 6 | SERIAL | b3→c3→p2-8→p2-hero→mk-p0-3/mk-p2-6 |
| `navigation.ts` | 6 | SERIAL | b1/b2/b3→ia-b1/ia-b6→b5 |
| `playkit.tsx` | 5 | SERIAL append | m2→m7→p1→p2-7→p3 |
| `Shell.tsx` | 5 | SERIAL | m1→m5→surf-app-shell→p4→p3 |
| `SpeechCoachTab.tsx` | 3 | SERIAL | p2-10→p2-7→m7 |
| `App.tsx` | 3 | SERIAL | m4→mk-p0-4→mk-p0-2 |
| `landing EN/HE` | 5/5 | SERIAL | rebuild→patches→p3 |
| `kit.tsx` | 3 | SERIAL | m2→m3→p3 |
| `types.ts` | 4 | PARALLEL-SAFE | append distinct fields (ageMonths first) |
| `i18n.ts` | 6+ | PARALLEL-SAFE | append distinct namespaces (mk-p0-8 first) |
| `signals.ts` | 3 | PARALLEL-SAFE | append at end |
| `loopEvents.ts` | 2 edit + 3 call | SERIAL add | mk-p0-4→mk-p0-2; rest CALL-ONLY |

**One-line rule of thumb:** if your item appears in any SERIAL row above, do not start your edit to that file until the prior item in the order has merged. If it only appears in PARALLEL-SAFE rows, append-only and you may run concurrently.
