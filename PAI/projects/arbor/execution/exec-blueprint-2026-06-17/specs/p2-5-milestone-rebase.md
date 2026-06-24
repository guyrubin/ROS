## p2-5-milestone-rebase — Milestone re-base (CDC/AAP-2022 + ASHA-2023)
**Aspects:** IA, UI/UX, Copy · **Surfaces/platforms:** web:MyChild, web:Grow · **Priority:** Phase2

> Maps to EXECUTION-BACKLOG #5 and PRD C1. Re-base the milestone reference set on the **CDC/AAP-2022 75th-percentile** developmental checklists (159 milestones across 12 well-child checkpoints, including the 15- and 30-month checkpoints added in 2022) plus **ASHA-2023** communication, feeding and swallowing milestones (birth–5y; ASHA uniquely contributes feeding). Add a per-milestone **"what the skill looks like"** media slot and **corrected-age** support for preterm children. This is the credibility floor under p2-6 (Missions weekly closed-loop), c2-daily-play, and screening, all of which select against "milestones not yet reached."

### Problem / why

1. **The set is not the CDC/AAP-2022 set it claims to be.** The seed in `PPPPtherapy-/PPPPtherapy-/app/src/initialData.ts:65-128` carries only **46** milestones (40 CDC birth–3y + 6 bespoke 4–6y), not the **159 / 12-checklist** set PRD C1 requires. The 4–6y entries (`m-1`…`m-10`) are hand-written, age-banded loosely ("Age 4-5", "Age 5-6"), and one (`m-7` "Handles Code-Switching") is a bespoke bilingual item, not a standards milestone. CDC's surveillance set runs birth–5y across 12 checkpoints (2/4/6/9/12/15/18/24/30/36/48/60 mo); the current set has no 4mo, no 4y, no 5y rows.
2. **References are domain-level, not milestone-level, and that's the whole content of the file the work item names.** `milestoneReferences.ts:4-33` is a 7-entry `DOMAIN_REFERENCES` map (one URL per Arbor domain). `MilestonesTab.tsx:205-216` falls back to that domain URL for every non-custom milestone, so "Smiles at people" and "Draws a circle" both deep-link to the same generic CDC index page. There is no per-milestone source citation and no "what it looks like" exemplar.
3. **No corrected-age support.** `ChildProfile` (`types.ts:1-20`) stores only integer `age` — no birth date, no gestational age. A preterm child is scored against chronological-age milestones, which is clinically wrong (AAP advises correcting for prematurity until ~24 months). The "Watch points" copy (`MilestonesTab.tsx:301-308`) can't reflect corrected age.
4. **The set is the moat's anchor.** Per PRD §4, p2-6 / c2-daily-play / screening all select play and nudges against *milestones not yet reached for this child's age*. If the age-band taxonomy is loose strings ("Age 4-5") rather than a normalized `ageMonths` checkpoint, downstream selectors can't reliably compute "what's next." Re-base must land first and expose a clean, queryable shape.

### Scope across platform domains

- **Web (primary)** — Surfaces `My Child › Development › Milestones` (the `MilestonesTab` panel inside `DevelopmentTab`'s `HubTabs`) and, transitively, `Grow` (Missions/Daily Play read the re-based set). This item ships: (a) the full CDC/AAP-2022 + ASHA-2023 data set normalized with `ageMonths`; (b) a per-milestone `reference` + optional `exemplar` media slot; (c) corrected-age `ChildProfile` fields and the age-window filter; (d) a re-seed/merge migration so existing children gain the new set without losing their checks; (e) copy for the new exemplar, corrected-age, and citation affordances.
- **iOS (Capacitor)** — No native code change. The web app is the WebView; the new exemplar media must use the existing fetch/asset path (lazy-loaded, `loading="lazy"`) so the bundle doesn't bloat the native shell. Verify touch targets on the new exemplar toggle meet 44×44pt (MOBILE.md grade).
- **Android (Capacitor)** — Same as iOS; no native change.
- **Landing EN / Landing HE (RTL)** — Out of scope. (Marketing can later cite "159 CDC/AAP-2022 milestones" as a credibility line, but that is not this item.)

### IA / UX / Copy detail

#### IA — data shape (the load-bearing change)

Extend `Milestone` in `types.ts:108-117`:

```ts
export interface Milestone {
  id: string;
  domain: DevelopmentalDomainId;
  ageGroup: string;          // keep: human label, e.g. "2 months", "4 years" (display only)
  ageMonths: number;         // NEW: normalized checkpoint, e.g. 2, 48 — the queryable key
  source: 'CDC' | 'ASHA' | 'AAP' | 'custom';  // NEW: provenance badge
  title: string;
  description: string;       // "what the skill looks like" in words (existing)
  checked: boolean;
  reference?: { label: string; url: string };  // NEW: per-milestone citation (singular)
  exemplar?: { kind: 'image' | 'video'; url: string; alt: string };  // NEW: media "what it looks like"
  references?: { label: string; url: string }[];  // keep for back-compat (custom milestones)
  custom?: boolean;
}
```

- `ageMonths` is the canonical age key. CDC checkpoints: `2,4,6,9,12,15,18,24,30,36,48,60`. ASHA feeding/communication rows reuse the same checkpoints. `ageGroup` stays as the display label only.
- `source` drives a small provenance pill ("CDC", "ASHA", "AAP") replacing the generic domain-URL fallback.
- `reference` (singular) is the per-milestone deep link; keep `references` (array) only for parent-authored `custom` milestones already in the wild.
- Add **corrected-age** to `ChildProfile` (`types.ts:1-20`):

```ts
  birthDate?: string;        // ISO date — enables month-accurate age & corrected age
  gestationalWeeks?: number; // e.g. 32 — if < 37, child is preterm
```

  Corrected age (months) = chronologicalMonths − max(0, (40 − gestationalWeeks) × 7 / 30.4), floored at 0, applied only until chronological 24 months (AAP rule). Add a pure helper `correctedAgeMonths(profile): number | null` in a new `lib/milestoneAge.ts` (returns `null` when no `birthDate`, so existing integer-`age` profiles degrade gracefully to `age * 12`).

#### IA — the data set (`milestoneReferences.ts` becomes the milestone catalog)

The work item names `milestoneReferences.ts`; promote it from a 7-URL map to the **milestone reference catalog**. Move the 159-milestone CDC/AAP-2022 + ASHA-2023 set here as the single source of truth, and have `initialData.ts` re-export the catalog (so `initialMilestones` stays the import name `ArborContext.tsx:18` and `initialData.ts:65` already use — no caller churn).

- Keep `DOMAIN_REFERENCES` in the same file (still used as the citation when a milestone has no `reference`).
- Add `export const CDC_AAP_MILESTONES: Milestone[]` — the full set. Domain mapping (CDC → Arbor's 6 domains, per `framework.json`): Social/Emotional → `social_development` (or `attachment_regulation` for separation/regulation items like the 9mo stranger-awareness and 3y drop-off-calm rows, matching the existing seed convention at `initialData.ts:80,110`); Language/Communication → `language_communication`; Cognitive → `cognition_executive_function`; Movement/Physical → `sensory_motor_patterns`; self-care/feeding → `independence_adaptive_skills`. ASHA feeding rows → `independence_adaptive_skills`; ASHA communication rows → `language_communication`.
- **Default `checked` policy:** seed every milestone `checked: false`. The current seed hard-codes `checked: true` for most rows (`initialData.ts:70-126`) which silently inflates the Development Score for a brand-new child. A re-base is the moment to fix this honestly: nothing is "observed" until the parent observes it. (This is also why c4-dev-score depends on this item — see Dependencies.)
- IDs: keep the `cdc-<age>-<n>` scheme already in use (`initialData.ts:70`); add `asha-<age>-<n>` for ASHA rows. Stable IDs are mandatory for the merge migration below.

> **Sourcing note for the implementer:** the exact 159-row wording must be transcribed from the CDC "Learn the Signs. Act Early." checklists (Zubler et al., *Pediatrics* 2022;149(3):e2021052138) and the ASHA developmental-milestones pages cited in PRD §refs. Do **not** invent milestone text. The existing 40 CDC birth–3y rows in `initialData.ts:70-113` are already faithful CDC-2022 wording — reuse them verbatim (re-keyed with `ageMonths`/`source`), and extend with the missing 4mo, 48mo (4y), 60mo (5y) checkpoints + ASHA feeding rows. Where a milestone is not yet transcribed at build time, ship the verified subset and leave a typed `// TODO(catalog): remaining CDC 48/60mo rows` rather than fabricating — partial-but-correct beats complete-but-wrong for a credibility feature.

#### IA — age-window filtering (so the tab shows the right milestones)

Today `MilestonesTab` renders **all** milestones for **all** ages in every domain card (`MilestonesTab.tsx:153-250`) — a newborn's parent sees 5-year-old milestones. Add an age-window filter:

- Compute the child's age in months via `correctedAgeMonths(profile) ?? profile.age * 12`.
- Default view = the **current and adjacent** checkpoints (the checkpoint ≤ child age, plus the next one up) — this is the "what's happening now / what's next" window.
- Add a third filter axis alongside the existing domain tabs (`MilestonesTab.tsx:124-149`): an age-window segmented control — `["Now & next" (default), "All ages"]`. Keep it as a second row under the domain row; do not nest.
- When corrected age is in effect (preterm, < 24mo chronological), show a small inline note next to the age filter: `"Showing corrected age: {n} months"`.

#### UI/UX — the "what the skill looks like" exemplar

Per-milestone media slot inside each milestone row (`MilestonesTab.tsx:163-245`). Add a fourth chip next to the existing Explain button (`MilestonesTab.tsx:217-226`): **"See it"** (icon `Eye` is already imported at line 4; reuse, or use `Image`). It toggles an inline panel — mirror the existing `explain` AnimatePresence pattern (`MilestonesTab.tsx:235-243`) for consistency.

- **default** — chip visible only when `item.exemplar` exists; otherwise omit the chip entirely (no dead control).
- **loading** — exemplar image uses `loading="lazy"` + a skeleton block (reuse `var(--arbor-paper-deep)` bg, `animate-pulse`); video shows a poster frame until played.
- **empty** — milestone has no exemplar → no chip (covered above). Domain with no milestones in the active age window → reuse the existing empty string `t("ms.noMilestones")` (`MilestonesTab.tsx:246`).
- **error** — image `onError` → swap to a text-only fallback card reading the milestone `description` with the copy `t("ms.exemplarUnavailable")` (see Copy). Never show a broken-image glyph.
- **motion** — reuse the `initial={{ opacity:0, height:0 }} → animate={{ height:"auto" }}` collapse already used for explanations (`MilestonesTab.tsx:237`). Gate with `prefers-reduced-motion`: when reduced, set the panel to instant open (no height tween) — the app already imports `motion/react`; wrap with the standard reduced-motion guard used elsewhere in the codebase, or set `transition={{ duration: prefersReduced ? 0 : 0.2 }}`.
- **touch targets** — the new "See it" chip and the age-window segmented control must be ≥ 44×44pt hit area (pad the 9px-text chips at `MilestonesTab.tsx:221` with `min-h-[44px]` wrappers or increase `py`). The current chips are below 44pt — fix as part of this item since we're editing the row.
- **a11y (AA)** — exemplar `<img>` requires `alt={item.exemplar.alt}`; video needs a visible caption/transcript link or `aria-label`. The "See it" toggle gets `aria-expanded` + `aria-controls` pointing at the panel id. Provenance pill (`source`) is decorative-adjacent → give it `title`/`aria-label` ("Source: CDC"). Citation link already has discernible text. Color contrast: the new provenance pill must clear 4.5:1 — use `var(--arbor-muted)` on `var(--arbor-paper-deep)` (existing combo at line 176) which passes.
- **keyboard** — "See it" chip is a `<button>` (keyboard-native); ensure the inline panel is in DOM order right after its trigger so tab order is logical (the explanation panel already does this at `:235`).
- **RTL** — milestone rows use logical flex (`gap`, `flex-start`); exemplar media must not hard-pin `left/right`. Verify the new segmented control flips under `dir="rtl"` (LanguageContext drives HE). No new physical-direction CSS.

#### UI/UX — Development header / score coupling (read-only here)

`DevScoreCard` (`components/sections/DevScoreCard.tsx:38`) computes the score from `milestones.map(m => ({domain, checked}))`. Two consequences this item must honor:
- The `checked:false`-by-default re-base will **drop** the displayed score for new profiles. That's correct (honest baseline) but **coordinate with c4-dev-score** (shared file: see conflict notes) so the score's "trend" copy doesn't read as a regression. Do **not** change `DevScoreCard` math in this item; only the seed data changes.
- `computeDevScore` should ideally weight only **age-appropriate** milestones (don't penalize a 1yo for unchecked 5yo rows). That refinement is **c4-dev-score's** job; this item only guarantees `ageMonths` exists so c4 can do it. Leave a typed comment in `DevScoreCard.tsx` referencing `ageMonths` availability — do not implement the weighting.

#### Copy (UX strings — add to `LanguageContext.tsx` i18n store, EN + HE)

Append keys (do not reorder existing — see conflict notes):

- `ms.seeIt` → EN "See it" · HE "ראו דוגמה"
- `ms.hideExemplar` → EN "Hide" · HE "הסתר"
- `ms.exemplarUnavailable` → EN "Example clip unavailable — here's what to look for:" · HE "הקליפ אינו זמין — הנה מה לחפש:"
- `ms.ageNow` → EN "Now & next" · HE "עכשיו והבא"
- `ms.ageAll` → EN "All ages" · HE "כל הגילים"
- `ms.correctedAge` → EN "Showing corrected age: {n} months" · HE "מוצג גיל מתוקן: {n} חודשים"
- `ms.sourceCdc` / `ms.sourceAsha` / `ms.sourceAap` → EN "Source: CDC / ASHA / AAP" · HE equivalents
- Update **`ms.subtitle`** (existing key used at `MilestonesTab.tsx:114`) to reflect the standards basis, e.g. EN: "Based on the CDC/AAP developmental checklists and ASHA communication milestones. A gentle, non-diagnostic snapshot — never a test."
- Keep the existing non-diagnostic guardrail copy at `ms.snapshotNotScore` and the "Watch points" block (`MilestonesTab.tsx:301-308`); when corrected age is active, prepend "At {correctedAge} months corrected, …" to the watch-points body via interpolation.

Tone discipline (per design:ux-copy): non-diagnostic, warm, parent-second-person. Never imply delay or pass/fail. "Snapshot, not a score" stays the frame.

### Files to create / edit (exact repo-relative paths)

**Edit:**
- `PPPPtherapy-/PPPPtherapy-/app/src/types.ts` — extend `Milestone` (`ageMonths`, `source`, `reference`, `exemplar`); extend `ChildProfile` (`birthDate?`, `gestationalWeeks?`). **(SHARED — see conflict notes, also touched by c4-dev-score.)**
- `PPPPtherapy-/PPPPtherapy-/app/src/lib/milestoneReferences.ts` — promote to milestone catalog: keep `DOMAIN_REFERENCES`, add `export const CDC_AAP_MILESTONES: Milestone[]` (159 rows, CDC/AAP-2022 + ASHA-2023, `checked:false`, `ageMonths`/`source` populated, per-row `reference`).
- `PPPPtherapy-/PPPPtherapy-/app/src/initialData.ts` — replace the inline `initialMilestones` array (`:65-128`) with `export { CDC_AAP_MILESTONES as initialMilestones } from "./lib/milestoneReferences"` (or re-export), so `ArborContext.tsx:18` import is unchanged.
- `PPPPtherapy-/PPPPtherapy-/app/src/components/tabs/MilestonesTab.tsx` — age-window segmented control; "See it" exemplar chip + inline panel; provenance pill; per-milestone `reference` link (prefer `item.reference` over `DOMAIN_REFERENCES` fallback); 44pt touch fixes; corrected-age note; updated subtitle/watch-points interpolation.
- `PPPPtherapy-/PPPPtherapy-/app/src/components/tabs/DevelopmentTab.tsx` — no functional change required; add a one-line comment noting the Milestones facet now reflects corrected age. (Listed as touched per work item; keep the edit minimal — this file is also touched by b2-mychild-story-spine and c4-dev-score, so avoid structural changes.)
- `PPPPtherapy-/PPPPtherapy-/app/src/context/LanguageContext.tsx` — append the new `ms.*` i18n keys (EN + HE), append-only. **(SHARED — see conflict notes.)**
- `PPPPtherapy-/PPPPtherapy-/app/src/context/ArborContext.tsx` — add the one-time **re-seed/merge migration** (see migration section). **(SHARED HOTSPOT — see conflict notes.)**
- `PPPPtherapy-/PPPPtherapy-/app/src/components/sections/DevScoreCard.tsx` — comment only (point c4 at `ageMonths`); no math change.

**Create:**
- `PPPPtherapy-/PPPPtherapy-/app/src/lib/milestoneAge.ts` — `correctedAgeMonths(profile)`, `ageWindowMonths(profile)`, `checkpointFor(months)` pure helpers + unit-testable exports.
- `PPPPtherapy-/PPPPtherapy-/app/src/lib/milestoneAge.test.ts` (or alongside the project's test convention) — corrected-age math (term vs 32-week preterm; > 24mo no-correction cutoff; missing birthDate → null).
- `PPPPtherapy-/PPPPtherapy-/app/src/lib/__tests__/milestoneCatalog.test.ts` — assert catalog invariants: all IDs unique, every row has `ageMonths` ∈ valid checkpoints, every `domain` ∈ the 7 `DevelopmentalDomainId`s, every non-custom row `checked:false`, count ≥ the verified subset.
- (No new asset directory mandated; exemplar `url`s point at the existing asset/fetch path. If local placeholders are needed, use `public/exemplars/` and lazy-load.)

#### Re-seed / merge migration (required — `useChildCollection` seeds only when empty)

`useChildCollection` writes the seed **only when the collection is empty** (`hooks/useChildCollection.ts:71-77`). Existing children already have the old 46-row set, so changing the seed alone reaches **only brand-new children**. Add an idempotent, one-time merge in `ArborContext.tsx` (near the `milestonesCol` definition at `:159-173`):

- Persist a per-child flag `arbor.milestoneCatalogVersion.<childId>` (localStorage + a Firestore field on the child doc) = `"cdc-aap-2022.1"`.
- On load, if the stored version ≠ current: for each catalog row not already present by `id`, `upsert` it (new rows arrive `checked:false`); **never** overwrite an existing row's `checked` (preserve parent observations). Leave orphaned bespoke rows (`m-1`…`m-10`) in place but **do not** re-seed them; optionally tag them `source:'custom'` so they sort/badge correctly.
- Guard with `seededRef`-style once-per-mount idempotency to avoid duplicate batch writes under React StrictMode double-invoke. Wrap in try/catch; degrade silently to local on permission error (matches the existing `useChildCollection` error posture at `:81-85`).
- This migration is additive and reversible (no deletes), satisfying the no-data-loss operating rule.

### Shared-file conflict notes

- **`PPPPtherapy-/PPPPtherapy-/app/src/types.ts`** — shared with **c4-dev-score** (per sharedFileMap). Both append to interfaces. Coordinate: this item adds `Milestone.ageMonths/source/reference/exemplar` and `ChildProfile.birthDate/gestationalWeeks`; c4 adds dev-score types. **No overlap in fields** — merge by appending only; do not reorder existing interface members. Land this item's `ageMonths` first (c4 depends on it).
- **`PPPPtherapy-/PPPPtherapy-/app/src/components/tabs/DevelopmentTab.tsx`** — shared with **b2-mychild-story-spine** and **c4-dev-score**. This item's edit here is comment-only / minimal. Do **not** restructure the `HubTabs` panel list (`DevelopmentTab.tsx:21-29`) — b2 owns the My-Child IA reorg. Keep changes inside `MilestonesTab` and the catalog.
- **`PPPPtherapy-/PPPPtherapy-/app/src/context/ArborContext.tsx`** — **#1 god-context hotspot** (also b5-naming-moat-exposure, ia-b1-fold-missions, mk-p0-4-analytics-wiring, p4-operational-hardening). Per the hotspot rule: **do the milestone migration as a small, self-contained block** near `milestonesCol` (`:159-173`) — do **not** touch `ActiveTab`/`VALID_TABS`/hash routing. Run after p4/mk-p0-4 handler wiring and after the b5+ia-b1 registry cleanup if those are in the same window; this item only adds a migration effect, so it can land independently as long as it doesn't reorder the context value object (`:870-956`).
- **`PPPPtherapy-/PPPPtherapy-/app/src/context/LanguageContext.tsx`** — shared i18n store (b5, ia-b6, surf-ask, surf-academy). **Append-only**: add the `ms.*` keys at the end of the EN and HE maps; reconcile any key collision in b5's final pass. Do not reorder.
- **`PPPPtherapy-/PPPPtherapy-/app/src/components/tabs/MilestonesTab.tsx`** — **only this item touches it** (per sharedFileMap). Free to restructure within the file.
- **`PPPPtherapy-/PPPPtherapy-/app/src/lib/milestoneReferences.ts` / `initialData.ts`** — not in the cross-item shared map beyond this item; safe to promote/re-export.

### Dependencies (must land first)

- **None hard.** `dependsOn: []` in the work item. Standalone-shippable.
- **Soft ordering:** if **c4-dev-score** is in the same window, land this item first (c4 consumes `ageMonths` for age-weighted scoring). If **b2-mychild-story-spine** is reorganizing `DevelopmentTab`/My-Child IA, sequence b2's structural edit and this item's content edit so they don't collide in `DevelopmentTab.tsx` (this item keeps that file near-untouched to make either order safe).
- **This item is itself a prerequisite** for **p2-6** (Missions weekly closed-loop), **c2-daily-play**, and screening (`Screening.tsx`), which select against the re-based set's `ageMonths` window.

### Acceptance criteria (testable)

1. `milestoneReferences.ts` exports `CDC_AAP_MILESTONES`; `initialData.ts` re-exports it as `initialMilestones`; `ArborContext.tsx` compiles unchanged at its import site. `tsc --noEmit` passes.
2. Catalog invariant test passes: all IDs unique; every row has a valid `ageMonths` checkpoint and a `domain` in `DevelopmentalDomainId`; every non-custom row is `checked:false`; row count ≥ the verified subset (no fabricated rows — TODO markers allowed for untranscribed CDC 48/60mo rows).
3. `correctedAgeMonths` unit tests pass: term child → chronological; 32-week preterm at 6mo chronological → ~4mo corrected; > 24mo chronological → no correction; missing `birthDate` → `null`.
4. **Verified live on dev server** (`npm run dev` in `PPPPtherapy-/PPPPtherapy-/app`): open My Child › Development › Milestones. The age-window control defaults to "Now & next" and shows only current+adjacent checkpoints for the active child; "All ages" reveals the full set. Milestones with an `exemplar` show a "See it" chip that expands an inline lazy-loaded media panel with correct `alt`; image `onError` shows the text fallback, never a broken glyph.
5. Provenance pill renders ("CDC"/"ASHA"/"AAP") and per-milestone citation links to the row's `reference.url` (not the generic domain index) when present.
6. New-profile honesty: a freshly created child shows all milestones unchecked and a Development Score baseline that is not inflated by auto-checked rows.
7. Migration: an existing child (seeded with the old 46 rows, some `checked:true`) gains the new catalog rows on next load **without** losing any prior check, and the migration does not re-run or duplicate rows on subsequent loads (version flag respected; StrictMode-safe).
8. a11y: axe/Lighthouse on the Milestones panel reports no new contrast or name/role/value violations; "See it" toggle exposes `aria-expanded`/`aria-controls`; tab order is logical; `prefers-reduced-motion` disables the panel height tween. Touch targets on "See it" and the age-window control measure ≥ 44×44pt.
9. RTL: with HE active (`dir="rtl"`) the age-window segmented control and exemplar panel mirror correctly; no clipped or left-pinned media.
10. Existing 241-test suite stays green (`npm test`); no regression in MilestonesTab toggle/add/delete/explain behavior.

### Operating-rule checks

- **No dark patterns.** Default-unchecked baseline removes the existing silent score-inflation. No streak/loss-aversion mechanics added. The "See it" exemplar is informational, not a nag; corrected-age note is reassuring, never alarming. "Snapshot, not a test" framing preserved.
- **Privacy / COPPA-2026.** `birthDate`/`gestationalWeeks` are child PII — stored only in the existing per-child Firestore subtree / local sandbox via the same `useChildCollection`/profile path (already covered by GDPR export/erase in `childData.ts`). Exemplar media are generic developmental clips (no child likeness, no upload). No new third-party calls; the per-milestone `reference` URLs are outbound `rel="noreferrer"` links (matches existing `MilestonesTab.tsx:201`).
- **Moat read/write.** Read: the re-based catalog + per-child checks are the longitudinal spine that p2-6/c2-daily-play/screening select against (`ageMonths` window). Write: each parent check is a perishable, per-child, auto-captured developmental signal — exactly the NFX data-moat asset PRD §refs cites. The migration preserves all historical checks (the moat is append-only).
- **Ships visible.** The change is user-visible in My Child › Development › Milestones: standards-grounded set, age-windowed view, "See it" exemplars, source citations, and corrected-age support — all reachable in the running dev app, not config-only.
