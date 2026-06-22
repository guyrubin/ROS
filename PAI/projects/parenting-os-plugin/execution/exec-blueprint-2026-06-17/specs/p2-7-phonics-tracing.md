## p2-7-phonics-tracing — Phonics/early-reading track + letter-tracing
**Aspects:** UI/UX, Copy · **Surfaces/platforms:** web:Grow, child:PlayKit, ios, android · **Priority:** Phase2

### Problem / why
Arbor's Speech Coach (`SpeechCoachTab.tsx`) today is purely an *articulation* tool: pick a sound, say words/sentences/story, score with parent self-rating or Web-Speech/cloud ASR. It stops at "can the child *produce* the sound." There is no bridge from articulation → **letter–sound knowledge (phonics)** or **letter formation (tracing)** — the two earliest, most-demanded early-literacy skills for the 3–6 band and the natural next rung once a sound is being produced reliably.

EB #7 maps to PRD §8.1/B (early-reading/phonics on Speech Coach + a finger letter-tracing mini-game). The phonics track reuses the existing `SOUND_LIBRARY` (each `SoundEntry` already pairs a phoneme with its display letter and example words) so it writes to the same longitudinal moat as articulation. The tracing mini-game is a child-register PlayKit activity (finger/stylus drawing of the target letter) that closes the loop: hear the sound → say the sound → know the letter → form the letter.

This is **gated by `p2-10-kid-asr`** because the "say the sound that matches this letter" phonics check is an articulation→phonics judgement: it needs the phoneme-level kid ASR seam (`scoreUtterance` / `childAsr`) to confirm the child produced the right *sound* for the shown letter, not just any word. Until kid-ASR lands, the phonics speak-check degrades to parent self-scoring (the existing universal floor), and tracing — which needs no ASR — ships independently.

### Scope across platform domains
- **Web (Grow → Practice → Speech Coach):** Add a third register to `SpeechCoachTab` — a "Letters & Sounds" (phonics) `SectionCard` and a "Trace the letter" mini-game card, sitting after the existing articulation practice card. Both consume the active `sound`/`SoundEntry`. New PlayKit primitive `<TraceCanvas>` added to `playkit.tsx`. New content + a write-back path through `PracticeEvent`.
- **iOS (Capacitor):** Tracing must work with touch (Pointer Events, not mouse-only). Drawing canvas must respect safe-area and not trigger page scroll/rubber-band while a finger is down (`touch-action: none` on the canvas). No native plugin needed — pure DOM Canvas/SVG works inside the WKWebView shell.
- **Android (Capacitor):** Same Pointer-Events path; verify stylus + finger both register. No separate code path.
- Landing EN / Landing HE: **out of scope** (no marketing aspect on this item).

### IA / UX / Copy detail

#### A. Phonics track (Letters & Sounds) — `SpeechCoachTab.tsx`, parent-guided child activity
Insert a new `SectionCard` ("Letters & Sounds", icon `<BookOpenCheck/>` from lucide, tone `"sky"`) **after** the existing `{sound.label} · {sound.ipa}` practice card (after line 408, before the "Words & Express" card). It binds to the already-selected `sound` so the sound picker drives all three tracks coherently.

Three micro-steps, each a `PracticeEvent` write (reuse the existing `savePracticeEvent` helper and `kind` enum — see "Files to edit / types" below for the new kinds):
1. **Letter–sound match** ("Which letter makes the `/s/` sound?"): a row of 3 `ChoiceTile`s (target letter + 2 distractor letters drawn from other `SOUND_LIBRARY` entries of the same `band`). On pick → `ChoiceTile` `state="correct"|"wrong"`, fire `celebrateBurst()` on correct, write `PracticeEvent { kind: "phonics-match", domain: "language", correct }`.
2. **Sound–letter speak check** ("Show the letter, say its sound"): shows the big letter (display style identical to the articulation target card — `var(--font-display)`, ~3.4rem). Reuses the EXACT record path already in this file (`startRecording`/`stopRecording`, `scoreUtterance`) but with `level: "sound"` (this `SpeechLevel` value already exists in `types.ts:268` and `signals.ts:28` but is currently unused by the UI). Saves a `SpeechAttempt { sound, level: "sound", target: <letter>, result, method }` via the existing `data.speech.upsert` — so it flows into `soundStats`/`speechDose`/reports with zero new plumbing. **Dependency note:** the cloud branch only returns a confident phoneme result once `p2-10-kid-asr` is wired; until then `autoResult` comes from on-device Web Speech and parent scoring remains the floor (identical to today's articulation behavior).
3. **Word blending** ("Sound it out: `/s/` … `/u/` … `/n/` → sun"): a tappable CVC strip built from `sound.words` filtered to ≤4-letter entries; tapping each grapheme chunk plays nothing but enlarges/animates it (`play-pop-in`), and a "We read it!" button writes `PracticeEvent { kind: "phonics-blend", domain: "language", correct: true }`.

Copy is parent-facing-scaffolding + child-readable, calm-but-warm (Speech Coach already mixes both registers). Exact strings:
- Card title: `"Letters & Sounds"`; Chip: `"Early reading"`.
- TrustSafety-style sub (one line, muted): `"Reading grows from sounds the ear already knows — we start from the sound {first} is practising."` (`{first}` = child first name, already in scope on line 42).
- Match prompt: `` `Which letter makes the “${sound.id}” sound?` `` (use the spoken-sound cue, not IPA, for the parent to voice).
- Match correct toast: `"That's the one! 🎉"` · wrong toast: `"Good guess — this letter makes a different sound. Try again."`
- Speak-check prompt: `` `Point to the letter and say its sound: “${sound.cue.split('—')[0].trim()}”` `` (reuses the existing `cue` field so we don't author new pronunciation copy).
- Blend prompt: `` `Sound it out, then blend it fast: ${target}` ``; button label idle `"We read it!"` / saved `"Saved ✓"`.
- Honest-limits line (muted, bottom of card): `"This is playful early-reading exposure, not a reading assessment. If you have concerns about {first}'s reading, a speech-language or literacy professional is the right next step — Arbor can prepare the report."`

States (all three sub-cards):
- **default**: target letter + interactive controls.
- **loading**: only the speak-check has async work — reuse the existing recording UI (`recState === "recording"` pulsing Stop button); no separate spinner.
- **empty**: if the active `sound` has no ≤4-letter word for blending, hide step 3 and show muted `"No short word for this sound yet — try the letter match above."` (graceful, never a blank card).
- **error**: mic-unavailable reuses the existing `micError` string + parent-scoring fallback already in the file (lines 154–157, 371–377). No new error surface.

#### B. Letter-tracing mini-game — child:PlayKit, full child register
A `SectionCard` ("Trace the letter", icon `<PenLine/>`, tone `"peach"`) immediately below the phonics card, hosting a new PlayKit primitive **`<TraceCanvas letter glyph onComplete/>`** (added to `playkit.tsx`). It is a vivid, child-facing activity (lives inside `PlayShell` → `.arbor-play` scope already wrapping the tab).

Behavior:
- Renders the active letter (`sound.id.toUpperCase()` for the form; offer a lower/upper toggle) as a large faint guide glyph (SVG `<text>` or a stroked path) behind a transparent `<canvas>` sized to its container (min 280×280, scales to width).
- Child drags a finger/pointer; we draw a thick rounded brush stroke (`var(--arbor-clay)`, lineWidth ~14, `lineCap/lineJoin: "round"`) following Pointer Events (`pointerdown/move/up`, `setPointerCapture`).
- **Completion = coverage heuristic** (no per-stroke path matching needed for v1): sample the guide glyph's filled pixels vs. drawn pixels on `pointerup`; when ≥70% of guide pixels are covered, call `onComplete()` → `celebrateBurst()` + `<Celebrate>`-style inline win + write `PracticeEvent { kind: "letter-trace", domain: "language", correct: true, score: <coveragePct>, meta: sound.id }`.
- Controls: `<PlayButton tone="peach">Trace it!</PlayButton>` is implicit (just start drawing), plus `Clear` (ghost) and `Done` (soft) buttons; case toggle as two small pills (`A` / `a`).

Copy (child-register, larger, friendly):
- Title `"Trace the letter"`; Chip `"Finger play"`.
- Sprout line via existing `<MascotSay mood="happy" tone="peach">`: `` `Trace the ${sound.id.toUpperCase()} with your finger — follow the grey lines!` ``
- On completion `<Celebrate title="You traced it! ⭐" subtitle={\`That's the letter that makes the “${sound.id}” sound.\`} stars={3} starsTotal={3} />` — reuse the existing `Celebrate` component (lines 233–270 of playkit.tsx).
- Clear button `"Start over"`; Done `"I'm done"`.

UI / motion / a11y / RTL:
- **Touch targets:** all buttons via `PlayButton`/pills clear the documented 48px floor (PlayKit comment, playkit.tsx:11–13); `ChoiceTile` already `min-h-[112px]`.
- **Motion:** reuse `play-pop-in`, `play-correct`, `play-nudge`, `celebrateBurst()` — all already `prefers-reduced-motion`-gated (`celebrateBurst` checks `matchMedia` at playkit.tsx:21; keyframes are opt-in classes). TraceCanvas adds NO new continuous animation; the only flourish (a brief stroke "settle") must be skipped when `prefers-reduced-motion: reduce`.
- **`prefers-reduced-motion`:** confetti already disabled; ensure the completion celebration still shows the static `<Celebrate>` headline/stars (it does — only confetti is gated).
- **Keyboard / AA / screen-reader:** TraceCanvas is inherently pointer-based; provide a keyboard-accessible fallback — a `"Mark as traced"` button (visually secondary, always present) so a non-pointer or assistive-tech user can complete the activity and log the event. Canvas gets `role="img"` + `aria-label={\`Tracing area for the letter ${letter}\`}`. ChoiceTiles already expose `aria-pressed`; ensure each phonics tile has an accessible label `\`Letter ${L}\``. Contrast: clay brush on white and the sky/peach card tones are existing tokens already passing AA in the design system — do not introduce raw hex.
- **RTL:** Speech Coach is English-articulation content (English letters), so the *content* stays LTR even under HE locale; wrap the tracing canvas and letter displays in `dir="ltr"` so glyphs/order don't mirror, while the surrounding card chrome inherits document `dir`. (Hebrew phonics is explicitly out of scope here; flag as a future item, do not build.)
- **Tokens only:** every color via `var(--arbor-*)` / PlayKit `TONE_*` maps; no hardcoded hex (respect the m2/m3 token-discipline missions sharing these files).

### Files to create / edit (exact repo-relative paths)
Create:
- `PPPPtherapy-/PPPPtherapy-/app/src/practice/phonicsContent.ts` — phonics helpers derived from `SOUND_LIBRARY`: `letterDistractors(sound, band)`, `blendableWords(sound)` (≤4-letter CVC filter), and a `LETTER_GLYPH_PATHS` map (or reuse `<text>` rendering) for the trace guide. Keep it pure + deterministic (matches the `content.ts` discipline).
- `PPPPtherapy-/PPPPtherapy-/app/src/components/practice/__tests__/phonicsContent.test.ts` — unit tests for the two pure helpers (distractor uniqueness, blend filtering).

Edit:
- `PPPPtherapy-/PPPPtherapy-/app/src/components/practice/SpeechCoachTab.tsx` — add the two new `SectionCard`s (Letters & Sounds, Trace the letter); reuse `startRecording`/`scoreUtterance` with `level: "sound"`; add `savePracticeEvent` calls for new kinds. (Shared file — see conflict notes.)
- `PPPPtherapy-/PPPPtherapy-/app/src/components/ui/playkit.tsx` — add and export `<TraceCanvas>`; reuse `celebrateBurst`, `Celebrate`, `PlayButton`, `MascotSay`. (Shared file — see conflict notes.)
- `PPPPtherapy-/PPPPtherapy-/app/src/types.ts` — extend `PracticeEventKind` union with `'phonics-match' | 'phonics-blend' | 'letter-trace'`. (Shared file — see conflict notes.)
- `PPPPtherapy-/PPPPtherapy-/app/src/practice/signals.ts` — extend `eventAccuracy` language inputs in `domainBands` (line ~209) and `domainConfidence` (line ~297) to include `'phonics-match'`, `'phonics-blend'` so phonics contributes to the **language** band/confidence (the moat read). `letter-trace` is effort-only (no `correct` weighting needed beyond presence). Append only — do not reorder existing kinds.

### Shared-file conflict notes
- **`components/ui/playkit.tsx`** (hotspot: touchedBy `p1-comic-reader, p3-ios-grade-audit, p2-7-phonics-tracing, p2-11-mimic-mediapipe, m2-token-extraction, m7-playkit-completeness`; note: "m2 + m7 settle the API first; feature missions then consume stable primitives"). **Land `m2-token-extraction` and `m7-playkit-completeness` BEFORE this item.** Add `<TraceCanvas>` as a *new export appended at the end* of the file — touch no existing primitive signatures. Use the `TONE_INK`/`TONE_SOFT` maps as-is (do not re-key them — m2 owns that). If m2/m7 haven't landed, still append-only and avoid editing lines 45–60 (the tone maps m2 will refactor).
- **`components/practice/SpeechCoachTab.tsx`** (hotspot: touchedBy `p2-7-phonics-tracing, p2-10-kid-asr, m7-playkit-completeness`). **`p2-10-kid-asr` is a hard dependency and edits the same record/score path** (`startRecording`/`scoreUtterance`). Sequence: let `p2-10-kid-asr` land its kid-ASR wiring on `startRecording`/`scoreUtterance` FIRST, then this item *adds new cards that call the already-stabilized record path* with `level: "sound"` — do not re-implement recording, reuse the existing handlers. Insert new cards as whole new `<SectionCard>` blocks between existing cards (line 408 → 410) to minimize line-overlap with m7's PlayKit-completeness edits.
- **`types.ts`** (touchedBy `p2-5-milestone-rebase, c4-dev-score`). Only append three members to the `PracticeEventKind` union (line ~317–324); do not touch the `Milestone`/dev-score-related types those missions edit.
- **`signals.ts`** (touchedBy `p2-6-jitai, p2-10-kid-asr`). Edit only the `eventAccuracy` kind-lists in `domainBands`/`domainConfidence`; do not touch `speechDose`/`matchResult` (p2-10 territory) or any JITAI signal logic (p2-6).

### Dependencies (other item ids that must land first)
- **`p2-10-kid-asr`** — REQUIRED. Provides the phoneme-level kid-ASR seam that makes the sound–letter speak-check a real articulation→phonics judgement; also stabilizes the `startRecording`/`scoreUtterance` path this item reuses. (Tracing mini-game has no ASR dependency and could ship first, but ship the item as one unit gated behind p2-10.)
- Recommended-before (not hard): `m7-playkit-completeness` + `m2-token-extraction` (settle PlayKit API/tokens before adding `<TraceCanvas>`).

### Acceptance criteria (testable, including "verified live on dev server")
1. In Grow → Practice → Speech Coach, a "Letters & Sounds" card appears bound to the selected sound; switching the sound updates the letter, distractors, and blend word together.
2. Letter–sound match: picking the correct letter shows the correct state + confetti (confetti suppressed under `prefers-reduced-motion`) and writes a `PracticeEvent { kind: "phonics-match", correct: true }` to `speechAttempts`/`practiceEvents` (verify via the existing `usePracticeData` collection / Sound Progress + report).
3. Sound–letter speak check writes a `SpeechAttempt` with `level: "sound"` that appears in `data.stats`/`speechDose` and the professional report copy (Care → Reports), proving moat write-through.
4. "Trace the letter" mini-game: a finger/pointer drag draws strokes on iOS and Android Capacitor builds without scrolling the page; reaching ≥70% guide coverage fires the `<Celebrate>` win and writes `PracticeEvent { kind: "letter-trace", score }`.
5. Keyboard/AT users can complete both phonics-match (tiles are buttons with labels) and tracing (via the always-present "Mark as traced" fallback) and log the same events.
6. No raw hex literals introduced; all colors via `var(--arbor-*)`/PlayKit tones. `tsc` clean and the new `phonicsContent.test.ts` passes; existing 241+ Practice tests stay green.
7. Phonics-match accuracy contributes to the **language** domain band/confidence (assert `domainBands`/`domainConfidence` change when phonics events are present).
8. **Verified live on dev server** (`arborprd-westeu` dev / local `vite` + Capacitor live-reload): all three phonics steps and the trace game complete end-to-end, events persist across reload, and the cards render correctly at mobile width with safe-area respected.

### Operating-rule checks
- **No dark patterns:** no streak-shaming, no fake urgency. Completion is celebratory but every step is optional; the honest-limits line explicitly frames this as *exposure, not assessment* and routes concerns to a professional.
- **Privacy / COPPA-2026:** the speak-check audio path reuses the existing on-device-first scorer; child audio is forwarded to the kid-ASR provider only when configured and consented (gated by `p2-10-kid-asr` / `p2-9-coppa-consent`) and is never persisted by Arbor (`childAsr.ts` header contract). Tracing captures NO audio/camera and stores only a coverage score + letter id — no biometric data, no canvas image persisted.
- **Moat read/write:** reads the selected `SoundEntry` and band to pick distractors (read); writes `SpeechAttempt(level:"sound")` + three `PracticeEvent` kinds that feed `soundStats`, `speechDose`, `domainBands` (language), confidence, weekly snapshots, and the professional report — the longitudinal record a content-only competitor can't show.
- **Ships-visible:** lands as visible cards in the live Speech Coach tab with working interactions, not a flag-dark stub; the tracing mini-game is a complete, playable child activity on web + iOS + Android on day one.
