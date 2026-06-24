## m7-playkit-completeness — PlayKit completeness audit
**Aspects:** UI/UX · **Surfaces/platforms:** child:PlayKit, web:Grow · **Priority:** Phase2

### Problem / why
The child-facing "Practice Studio" tabs (routed under the **Grow** pillar — `navigation.ts:61-68` defines the `grow` section; `TAB_SECTION_FALLBACK` at `navigation.ts:115-120` maps `speech`/`mimic`/`feelings`/`adventures`/`missions` → `grow`) are supposed to share one coherent child register built from the PlayKit primitive library (`components/ui/playkit.tsx`). Adoption is uneven:

- **AdventuresTab** (`practice/AdventuresTab.tsx:12`) is the gold-standard adopter — it imports and uses `PlayShell, PlayHeader, PlayButton, PlayPanel, ChoiceTile, ProgressPips, MascotSay, Celebrate` and drives the `ChoiceTile` `state` prop through `idle/correct/wrong/dim` with a closing `Celebrate`.
- **FeelingsLabTab** (`practice/FeelingsLabTab.tsx:6,173-179`) also uses `ChoiceTile` with a real `state` binding — good.
- **MimicStudioTab** (`practice/MimicStudioTab.tsx:7`) imports only `PlayShell, PlayHeader, PlayButton`. Its choice surfaces (sound-pack buttons `:111-124`, rating buttons `:178-191`, prev/next round `:140-147`) are hand-rolled with raw `<button>` + `cardCls` + inline hex/`--arbor-*` styles. **No `Celebrate` on a completed pack** — pack completion only flips a tiny `Star` icon (`:121`). The embedded `MimicMatch` win (`MimicMatch.tsx:149-158`) is a bespoke overlay, not `Celebrate`.
- **SpeechCoachTab** (`practice/SpeechCoachTab.tsx:6`) imports only `PlayShell, PlayHeader, PlayButton`. The "Category pick" drill (`:454-470`) renders option tiles as raw `cardCls` buttons with manual border-color state instead of `ChoiceTile` — so it has no shared `idle/correct/wrong/dim` states, no `play-correct`/`play-nudge` feedback animation, and no shared 112px touch target. There is **no `Celebrate`/win** anywhere; the per-drill "saved" affirmation is an inline `<Check>`.

The result: two drills render correct/wrong feedback with ad-hoc colors and animations that diverge from `ChoiceTile`'s `play-correct`/`play-nudge` (`index.css:477-489`), and two surfaces lack a celebratory win beat. This breaks the "integrated, Apple-grade, coherent system" north star inside the child register.

This is an **audit + remediation** mission: every `practice/*` interactive drill must (a) use PlayKit primitives rather than ad-hoc `<button>`/`cardCls`, and (b) expose the full `idle/correct/wrong/dim` state set plus a `Celebrate` win where a drill/pack completes.

### Scope across platform domains
- **Web (Grow pillar / Practice Studio):** the only surface. Refactor `MimicStudioTab.tsx` and `SpeechCoachTab.tsx` to consume `ChoiceTile`, `PlayPanel`, `StatBubble`, `ProgressPips`, and `Celebrate` from `playkit.tsx`. No new primitives required for the core fix; the existing API is sufficient.
- **iOS / Android (Capacitor):** no platform-specific code — the same React tree renders in the Capacitor shell. Only requirement: verify the refactored tiles still clear the 48px touch target on a real device viewport (ChoiceTile is already `min-h-[112px]`, PlayButton `min-h-[54px]`/`min-h-[46px]`), and that `confetti` in `Celebrate` runs inside the WebView (it does — `celebrateBurst` guards `typeof window`).
- **Landing EN / Landing HE:** out of scope.

### IA / UX / Copy detail (build-level)

This is a **UI/UX** mission. Two work-streams.

#### A. Audit pass (produce the checklist, then fix)
Walk every interactive drill in each `practice/*` tab and classify against the PlayKit contract. The drill inventory and required state:

| Tab | Drill / choice surface | Current | Required |
| --- | --- | --- | --- |
| MimicStudioTab | Sound-pack picker (`:106-126`) | raw `<button>`+`cardCls` | keep as selector (not a quiz), but replace bespoke pip row (`:117-122`) with `ProgressPips` |
| MimicStudioTab | Rating buttons (`:178-191`) | `PlayButton variant=soft` | OK — leave as PlayButton (rating, not idle/correct/wrong) |
| MimicStudioTab | Pack completion | tiny `Star` flip only (`:121`) | add `Celebrate` win beat when `packDone(pack) === pack.prompts.length` |
| MimicStudioTab (MimicMatch) | Face-match win (`MimicMatch.tsx:149-158`) | bespoke overlay | acceptable to keep overlay (live-camera context), but the star row should reuse `Celebrate`'s star semantics or be left as-is; **document, don't force** if it regresses the live meter |
| SpeechCoachTab | Category-pick options (`:454-470`) | raw `cardCls`, manual border | **replace with `ChoiceTile`** driven by `idle/correct/wrong/dim` |
| SpeechCoachTab | Sound result buttons (`:393-401`) | raw `<button>` | leave (scoring control), but consider `PlayButton variant=soft` for token consistency |
| SpeechCoachTab | Sound-picker chips (`:283-303`) | raw `<button>`, `play-pressable` | leave (selector); ensure focus-visible ring |
| SpeechCoachTab | Drill completion (dose met) | inline `<Check>` | add `Celebrate` when `dose.sessionMetToday` first becomes true this session |

#### B. SpeechCoachTab — Category pick → ChoiceTile (the load-bearing fix)
Replace the option grid (`SpeechCoachTab.tsx:454-470`) with `ChoiceTile`. State mapping:
- before a pick (`categoryPick === null`): every tile `state="idle"`.
- after a pick (`categoryPick === idx`):
  - the picked tile → `state={ option.correct ? "correct" : "wrong" }`
  - the correct tile (when the child picked wrong) → `state="correct"` (reveal the right answer)
  - all other tiles → `state="dim"`.
- `disabled={categoryPick !== null}` on every tile so a round can't be re-answered.

Concrete states (default/loading/empty/error):
- **default/idle:** ChoiceTile renders emoji + word, white bg, neutral ring, 112px target.
- **correct:** green-soft bg + `play-correct` pulse (already in `ChoiceTile`).
- **wrong:** pink-soft bg + `play-nudge` shake (already in `ChoiceTile`).
- **dim:** 0.5 opacity (already in `ChoiceTile`).
- **loading:** category rounds are static content (`CATEGORY_ROUNDS`) — no async, no loading state needed.
- **empty:** `CATEGORY_ROUNDS` is non-empty constant; guard with `categoryRound` already present — no empty state required.
- **error:** none (no network).

#### C. MimicStudioTab — pack-complete Celebrate
After `rate()` (`:70-85`) advances, compute pack completion. When `packDone(pack) === pack.prompts.length` for the first time in the session, render `<Celebrate title=… subtitle=… stars=… starsTotal=…>` with a `PlayButton` to pick the next pack. Gate behind a `useState` `celebratedPacks: Set<string>` so it fires once per pack per mount (no nag loop).

#### Motion
- Reuse PlayKit's built-in `play-correct`/`play-nudge`/`play-pop-in`/`play-cheer` (`index.css:461-489`). Do **not** add new keyframes.
- `Celebrate` fires `celebrateBurst()` which already short-circuits under `prefers-reduced-motion` (`playkit.tsx:19-28`). No extra guard needed.
- The global reduced-motion guard (`index.css:401-407`) already neutralizes `.arbor-play` animations; verify the refactored tiles inherit it (they do — all under `PlayShell`'s `.arbor-play`).

#### Touch targets / a11y (AA)
- `ChoiceTile` is `min-h-[112px]` — exceeds 48px. `PlayButton` lg=54px, md=46px (md is 2px under; not introduced by this mission, leave for p3-ios-grade-audit).
- `ChoiceTile` sets `aria-pressed={state==="correct"||state==="wrong"}` — keep. Add an `aria-label` on the correct-reveal tile is unnecessary (visible word label suffices).
- Ensure every refactored `<button>`/tile has a visible `:focus-visible` ring. `play-pressable` has no focus style today — add a focus-visible outline token in `index.css` `.arbor-play .play-pressable:focus-visible` (2px `var(--arbor-sky-ink)` outline, offset 2px) so keyboard users see focus on tiles. This is the one `index.css` touch (additive, scoped to `.arbor-play`).
- Keyboard: tiles are native `<button>` — Enter/Space already activate. Tab order follows DOM. No custom roving tabindex needed.
- Category-pick feedback panel (`:471-480`) text must remain (it explains correct/incorrect) — it carries the "why", which the ChoiceTile color alone must not be the only signal of (color-independence for AA). Keep that text panel.
- RTL: Practice Studio is gated to `en-US` ASR but the chrome must still mirror under HE. ChoiceTile/PlayPanel use logical flex (no hard left/right) — no RTL work needed; verify pip/`ProgressPips` flex direction reads correctly under `dir="rtl"` (it is symmetric).

#### Copy (microcopy — reuse existing i18n)
- All titles/subs already resolve through `t("prac.*")` from `src/lib/i18n.ts` (confirmed: `prac.speech.title`, `prac.mimic.title`, `prac.mimic.face.win` exist). **Do not hardcode new English strings** where an i18n key is warranted.
- New `Celebrate` copy needs keys. Add to `src/lib/i18n.ts` (append-only, both `en` and `he`):
  - `prac.mimic.packWin.title` = "Pack complete!" / HE equivalent
  - `prac.mimic.packWin.sub` = "{name} played every round in {pack}. Pick another, or come back tomorrow." 
  - `prac.speech.doseWin.title` = "Today's dose done!" / HE
  - `prac.speech.doseWin.sub` = "{name} hit {target} reps. Little and often beats long and rare."
  - Wire with the existing `t(key, { name, pack, target })` interpolation pattern used at `MimicStudioTab.tsx:95-97`.

### Files to create / edit (exact repo-relative paths)
- **Edit** `PPPPtherapy-/PPPPtherapy-/app/src/components/practice/SpeechCoachTab.tsx` — replace category-pick grid (`:454-470`) with `ChoiceTile`; add `ProgressPips`/`Celebrate` imports; add dose-met `Celebrate`.
- **Edit** `PPPPtherapy-/PPPPtherapy-/app/src/components/practice/MimicStudioTab.tsx` — replace bespoke pack pips with `ProgressPips`; add pack-complete `Celebrate`; extend imports.
- **Edit** `PPPPtherapy-/PPPPtherapy-/app/src/components/ui/playkit.tsx` — **only if** a primitive gap is found during the audit (e.g. ChoiceTile needs a `aria-label` override prop). Prefer zero change; if touched, additive props only, no signature breaks.
- **Edit** `PPPPtherapy-/PPPPtherapy-/app/src/index.css` — add scoped `.arbor-play .play-pressable:focus-visible` outline (≈3 lines, in the PLAY LAYER block ~`:442`).
- **Edit** `PPPPtherapy-/PPPPtherapy-/app/src/lib/i18n.ts` — append the 4 Celebrate keys (en + he). **Append-only** (shared file — see below).
- **No edit needed** to `MimicMatch.tsx` unless the audit decides to converge its overlay (document the decision; default = leave).
- **Audit artifact:** record the per-drill checklist (the table above, filled with PASS/FIXED) as a short note in the PR description — do **not** write a new `.md` report file.

### Shared-file conflict notes
- **`components/ui/playkit.tsx`** (hotspot: `p1-comic-reader, p3-ios-grade-audit, p2-7-phonics-tracing, p2-11-mimic-mediapipe, m2-token-extraction, m7-playkit-completeness`). Per the hotspot rule, **m2 (token extraction) + m7 settle the primitive API first; feature missions then consume stable primitives.** Therefore m7 must make **only additive, non-breaking** changes to `playkit.tsx` (ideally zero). Coordinate with **m2**: if m2 is extracting tokens from `playkit.tsx`'s inline `TONE_INK`/`TONE_SOFT` maps in parallel, land m2's token pass first, then m7 consumes the result. Do not rename or reshape exported primitive props.
- **`practice/SpeechCoachTab.tsx`** (touchedBy `p2-7-phonics-tracing, p2-10-kid-asr, m7`). m7 touches the **category-pick grid + dose Celebrate** only; p2-7 (phonics tracing) and p2-10 (kid ASR) touch the **record/recognition** path (`:103-158`). Land m7's tile refactor in a self-contained block away from the recorder; if p2-10 lands first, rebase the ChoiceTile diff onto it (no overlap expected).
- **`practice/MimicStudioTab.tsx`** (touchedBy `p2-11-mimic-mediapipe, m7`). p2-11 owns the `MimicMatch`/MediaPipe path; m7 owns the parent-mirror pack UI + pips + pack-Celebrate. Keep m7's changes above the `<MimicMatch>` call (`:199`) so the two diffs don't collide.
- **`index.css`** (hotspot: `p3-ios-grade-audit, m1-ios-safe-area, m2-token-extraction, m4-retire-override-layer`). Order is **m4 → m2 → m1, p3 last.** m7's 3-line focus-visible addition is tiny and scoped to `.arbor-play`; append it **after** m4/m2 land to avoid a merge magnet. If m7 runs before them, place the rule at the end of the existing PLAY LAYER block and flag for rebase.
- **`lib/i18n.ts`** (touchedBy `mk-p0-8-copy-pack, mk-p2-1-localize-nl, mk-p2-7-paywall-experiments`). **Append-only**; never reorder existing keys. Resolve collisions in favor of existing keys.

### Dependencies (other item ids that must land first)
- **m2-token-extraction** — should settle the `playkit.tsx` token surface before m7 consumes it (soft dependency; m7 can proceed if it makes zero `playkit.tsx` changes).
- No hard blockers. `dependsOn: []` is correct per the work item; treat m2 as a sequencing preference, not a gate.

### Acceptance criteria (testable)
1. Every interactive drill in `practice/MimicStudioTab.tsx` and `practice/SpeechCoachTab.tsx` that presents discrete choices renders via `ChoiceTile` (no raw `cardCls`/`<button>` quiz tiles remain) — verify by grep: no `option.correct` styling on a non-PlayKit button.
2. SpeechCoach category-pick drives `idle/correct/wrong/dim` correctly: picking the correct option pulses green (`play-correct`); picking wrong shakes pink (`play-nudge`) AND reveals the correct tile as `correct`; all others `dim`; re-answer is disabled.
3. A `Celebrate` win fires once per session when (a) a Mimic sound pack reaches full completion and (b) the Speech daily dose is met — confirmed it does NOT re-fire on every render.
4. `celebrateBurst` does not fire under `prefers-reduced-motion: reduce` (set OS flag, complete a drill, observe no confetti; the win card still renders).
5. All ChoiceTiles clear 48px touch target (≥112px height) and show a visible focus ring on keyboard Tab.
6. New Celebrate copy resolves via `t()` in both `en` and `he`; no hardcoded English win strings.
7. `npm run build` / `tsc` passes and the existing practice test suite stays green.
8. **Verified live on dev server:** run the app (`PPPPtherapy-/PPPPtherapy-/app`, Vite dev), navigate Grow → Practice → Mimic Studio and Speech Coach, complete a category-pick round and a pack, and screenshot the correct/wrong/dim states + both Celebrate beats.

### Operating-rule checks
- **No dark patterns:** Celebrate is a genuine completion reward, not an engagement nag — gated to fire once per pack/session, with a calm "come back tomorrow" rather than a streak-loss threat. Wrong answers retain warm scaffolding + reveal (no shame state) — preserves the existing "there is no fail" stance.
- **Privacy / COPPA-2026:** zero data-handling change. The mirror/camera/ASR paths (MimicStudio `:44-58`, SpeechCoach `:103-158`, MimicMatch) are untouched; their local-only/on-device guarantees remain. No new capture, storage, or upload.
- **Moat read/write:** unchanged — drills still write `MimicSession`/`SpeechAttempt`/`PracticeEvent` through `usePracticeData` into the longitudinal record (`SpeechCoachTab.tsx:166-200`, `MimicStudioTab.tsx:70-85`); the "feeds the report you share with a professional" copy (`SpeechCoachTab.tsx:541-543`) stays true. This mission only changes presentation, not the read/write contract.
- **Ships-visible:** the change is immediately visible in the live app (consistent tile feedback + two celebratory win moments in the child register).
