## p2-10-kid-asr — Real kid phoneme ASR
**Aspects:** UI/UX · **Surfaces/platforms:** web:Grow, ios, android · **Priority:** Phase2

### Problem / why
EB #10 == PRD B/§9. Arbor's Speech Coach (`src/components/practice/SpeechCoachTab.tsx`, the Grow → "playful sound practice" surface) already records the child, but its automatic scoring is **word-level transcript matching**, not phoneme-level articulation assessment:
- On-device path: vendor-prefixed Web Speech (`SpeechCoachTab.tsx:136–153`) → `matchResult` (`signals.ts:627`), a normalized-Levenshtein word similarity. It returns "got/almost/missed" off *spelling distance*, not whether the target sound was produced.
- Cloud path: `scoreUtterance` (`lib/speechScorer.ts:49`) → `POST /api/score-utterance` (`routes/api.ts:702`) → `scoreChildUtterance` (`server/childAsr.ts:97`). The `whisper` provider transcribes then runs the same lenient `matchResult`; the `soapbox` provider is **scaffolded only** — the response mapping is an explicit `ADAPT-TO-VENDOR` placeholder (`childAsr.ts:90–94`) that assumes a flat `{ score, recognized, transcript }` shape SoapBox does not actually return.

Consequently: (a) the child can mispronounce the target sound yet score "got" if Whisper auto-corrects the word (Whisper is *biased toward the target* by the `prompt` field, `childAsr.ts:63` — it will hallucinate the right word); (b) there is **no per-phoneme / target-sound signal**, so the SpeechCoach progress bars and the Care-Network report (`SpeechCoachTab.tsx:541`) overstate accuracy; (c) **p2-7 phonics gating** cannot key off "the /s/ phoneme is produced correctly" because that signal doesn't exist.

This item makes child phoneme scoring **real and target-word-scoped**: it (1) finishes the SoapBox phoneme integration to the vendor's actual schema and surfaces a true per-target-sound correctness signal, (2) keeps hosted Whisper as a working fallback but **constrains it to verify the target sound is present** rather than trusting an auto-corrected transcript, (3) prefers an **on-device-first** path so audio need not leave the device, and (4) exposes the richer result (per-phoneme correctness + confidence) in the SpeechCoach UI honestly. It is gated behind **p2-9 COPPA consent** (child voice = biometric PII) and a **vendor + Guy decision** (SoapBox license).

This is tagged UI/UX because the *visible* deliverable is the SpeechCoach scoring experience — honest per-sound feedback, confidence-aware states, and the consent-gated recording affordance — backed by the scorer seam. No new pillar, no IA move.

### Scope across platform domains
- **Web (Grow / Speech Coach)** — `SpeechCoachTab.tsx` shows a true target-sound result with confidence; new states for "scoring", "low-confidence / couldn't hear clearly", "consent required", "cloud unavailable → you-be-the-judge". Per-phoneme breakdown when the provider returns it (SoapBox). The on-device Web Speech path stays as the floor; parent self-scoring always remains.
- **iOS (Capacitor)** — recording uses the same `MediaRecorder` getUserMedia path inside the WKWebView; ensure mic permission strings + `audio/mp4`/`audio/aac` mime handling (iOS Safari/WKWebView does **not** emit `audio/webm`). On-device scoring preferred so audio stays on the handset; cloud call only after consent.
- **Android (Capacitor)** — same `MediaRecorder` path (`audio/webm;codecs=opus` is supported); runtime mic permission. Same consent gate.
- **Landing EN / Landing HE** — out of scope (no marketing change in this item).

### IA / UX / Copy detail (build-level)

#### Scorer seam — `src/server/childAsr.ts` (finish, don't redesign)
The pluggable provider switch (`scoreChildUtterance`) and the `ChildScoreResult` contract stay. Changes:
1. **Real per-phoneme result.** Extend `ChildScoreResult` (append-only) with an optional `phonemes?: { phoneme: string; correct: boolean; score?: number }[]` and `targetSoundCorrect?: boolean`. `targetSoundCorrect` is the load-bearing signal for SpeechCoach and p2-7: did the child produce the lesson's `input.sound` correctly, regardless of the rest of the word.
2. **SoapBox → real schema.** Replace the `ADAPT-TO-VENDOR` placeholder (`childAsr.ts:81–95`) with SoapBox Labs' actual phoneme-fluency response mapping (per the licensed API docs Guy obtains at the vendor gate): map their per-phoneme pronunciation result to `phonemes[]`, derive `targetSoundCorrect` by locating `input.sound`'s phoneme(s) in the target word and reading their correctness, and collapse to the 3-level `result` via: all target phonemes correct → `got`; target phoneme correct but ≥1 other wrong → `almost`; target phoneme wrong → `almost` if word recognized else `missed`. Keep `confidence` = vendor word/phoneme confidence.
3. **Whisper → target-sound verification, not transcript trust.** Keep transcription, but **remove the target-word `prompt` bias** for scoring purposes (it makes Whisper hallucinate the right word). Instead: request `response_format: "verbose_json"` to get segment/word confidence; compute `result` from `matchResult(target, heard)` **only when** the no-prompt transcript independently contains a word matching the target (similarity ≥ 0.8). When the unbiased transcript does NOT contain the target, return `result: "almost"` with low `confidence` and `targetSoundCorrect: undefined` — i.e. Whisper is an *honest fallback that admits uncertainty*, never a false "got". (Whisper cannot do true phoneme scoring; it must not pretend to.)
4. **`childAsrConfigured` unchanged.** Still gates on env (`whisperApiUrl`, or `soapboxApiUrl`+`soapboxApiKey`).

#### Route — `src/routes/api.ts` (`POST /api/score-utterance`)
- **Consent gate (depends on p2-9).** Before scoring, require the consent signal p2-9 establishes (e.g. a `childVoiceConsent` claim on the authed request / a server-checked consent record). If absent → respond `403 { configured: true, consentRequired: true }` and **never forward audio to a vendor**. The client treats this as "consent required" state, not an error. (Coordinate the exact field name with p2-9; this spec consumes whatever p2-9 exposes — see Dependencies.)
- Pass through the new `phonemes`/`targetSoundCorrect` fields in the JSON response.
- Keep the existing 8 MB cap (`api.ts:714`), mime guard, and the "audio is never persisted" behaviour (audio is request-scoped only — preserve this; do not add logging of `dataB64`).

#### Client scorer — `src/lib/speechScorer.ts`
- Add `phonemes` + `targetSoundCorrect` to `UtteranceScore` (append-only).
- Add a `consentRequired` outcome: when the API returns `403 consentRequired`, return `{ result: "almost", source: "on-device", consentRequired: true }`-style sentinel (or a dedicated discriminated field) so the component can show the consent prompt rather than silently degrading. Do not throw.
- **On-device-first ordering:** keep the current order (Web Speech transcript is computed live during recording; cloud is the *upgrade* only when configured + consented). Document in the file header that audio leaves the device **only** on the consented cloud path. No behaviour regression for the `none` provider.

#### Signals — `src/practice/signals.ts` (append only)
- Add a pure helper `phonemeAccuracy(attempts: SpeechAttempt[], sound: string): number | null` that, when attempts carry the new per-target-sound signal, returns 0–100 target-sound accuracy (distinct from the current word-level `recentAccuracy`). This is what `domainBands`/`soundStats` and p2-7 should read for *articulation* truth.
- **Do not edit** existing exports (`matchResult`, `soundStats`, `domainBands`, `speechDose`, etc.). Append at end of file. (`signals.ts` is also touched by p2-6-jitai and p2-7 — see conflict notes.)

#### Types — `src/types.ts`
- Extend `SpeechAttempt` (append-only optional fields): `targetSoundCorrect?: boolean`, `confidence?: number`, `phonemes?: { phoneme: string; correct: boolean }[]`. `saveAttempt` (`SpeechCoachTab.tsx:166`) records these when `method === "auto"` and the cloud/SoapBox path supplied them. (Confirm with p2-5-milestone-rebase, which also edits `types.ts` — append-only, no reorder.)

#### SpeechCoach UI — `src/components/practice/SpeechCoachTab.tsx`
The "Record & Compare" card (`:354–408`) gains honest, confidence-aware states. Reuse existing kit/playkit primitives (`PlayButton`, `SectionCard`, `Chip`); no new color literals — use `var(--arbor-*)` tokens already present in this file.
- **default** — current "Record {first}" button.
- **recording** — current pulse "Stop" (`:361`). Keep `animate-pulse`; gate to opacity-only under `prefers-reduced-motion`.
- **scoring (NEW)** — after Stop, while the cloud call is in flight, show a non-blocking inline "Listening to {first}…" chip with a spinner; the parent self-score buttons stay usable (never block the floor). Currently the cloud call has no visible pending state (`:122–130`).
- **result** — when `targetSoundCorrect` is present, lead with the **target sound** verdict, not the word: e.g. the "Arbor heard" row (`:379`) becomes "Heard \"{heard}\" — the **{sound.label}** sound sounded {got→clear / almost→close / missed→not quite}." When `phonemes[]` exist (SoapBox), render a compact per-phoneme row: each phoneme as a small chip, mint when `correct`, clay-outline when not (reuse `Chip` tones). Confidence < 0.5 → see low-confidence.
- **low-confidence (NEW)** — when `confidence < 0.5` or `targetSoundCorrect === undefined` (Whisper couldn't verify): do **not** show an auto verdict. Show "Arbor couldn't hear that clearly — give it another go, or you be the judge below." Keep audio playback + parent scoring. (No false positives — operating-rule.)
- **consent-required (NEW)** — when scorer returns `consentRequired`: replace the auto-result row with a calm prompt "To let Arbor listen and score {first}'s sounds, turn on voice scoring in Settings — your recordings are scored on the spot and never stored." + a button routing to the consent/settings surface p2-9 builds. Parent self-scoring still works without consent. The Record button still records (on-device Web Speech needs no cloud consent); only the *cloud upload* is gated.
- **cloud-unavailable** — existing `!recognitionAvailable` copy (`:371–375`) stays for browsers with no Web Speech; when cloud provider is `none`, behaviour is unchanged (parent-judge floor).
- **a11y (AA):** the scoring chip and result row use `aria-live="polite"` so the verdict is announced once (currently the "Arbor heard" row is silent to SR). Per-phoneme chips need text labels, not color-only correctness — append "✓"/"✗" glyphs + `aria-label` ("s sound: correct"). All buttons ≥ 44×44 (the result "Save this score" button `:384` is currently small — bump to `min-h-[44px]`). Visible focus rings.
- **RTL:** card is flex/logical already; the new phoneme chip row must use `flex-wrap` + logical gap (no hard-left). Verify HE.
- **motion:** spinner and result entrance respect `prefers-reduced-motion` (opacity-only).
- **touch:** phoneme chips are display-only (not buttons) so no target-size requirement; the consent CTA and Save are ≥44px.

#### Copy (actual strings — calm, parent-register, honest)
- scoring chip: `Listening to {first}…`
- result/got: `Heard "{heard}" — the {sound.label} sound sounded clear. 🎉`
- result/almost: `Heard "{heard}" — the {sound.label} sound was close. One more try?`
- result/missed: `Heard "{heard}" — the {sound.label} sound wasn't quite there yet. That's normal — keep it playful.`
- low-confidence: `Arbor couldn't hear that one clearly. Give it another go, or you be the judge below.`
- consent-required title: `Turn on voice scoring`
- consent-required body: `To let Arbor listen and score {first}'s sounds, switch on voice scoring. Recordings are scored on the spot and never stored.`
- consent CTA: `Turn it on in Settings`
- per-phoneme chip aria-label: `{phoneme} sound: correct` / `{phoneme} sound: not yet`
- All strings via existing `t()` i18n keys (`prac.speech.*`); add EN keys, append HE keys (append-only, no reorder) so RTL renders.

### Files to create / edit (exact repo-relative paths)
**Edit**
- `PPPPtherapy-/PPPPtherapy-/app/src/server/childAsr.ts` — finish SoapBox real-schema mapping; constrain Whisper to honest target-sound verification; add `phonemes` + `targetSoundCorrect` to `ChildScoreResult` (append-only). *(shared — see conflict notes; p2-9 lands first.)*
- `PPPPtherapy-/PPPPtherapy-/app/src/routes/api.ts` — add p2-9 consent gate to `POST /api/score-utterance` (403 `consentRequired`, no vendor forward without consent); pass through new fields. Preserve no-persist + 8 MB cap.
- `PPPPtherapy-/PPPPtherapy-/app/src/lib/speechScorer.ts` — add `phonemes`/`targetSoundCorrect`/`consentRequired` to `UtteranceScore`; map 403; document on-device-first / consent-gated upload.
- `PPPPtherapy-/PPPPtherapy-/app/src/lib/api.ts` — extend `scoreUtterance` response type with `phonemes?`, `targetSoundCorrect?`, `consentRequired?` (`api.ts:148–150`).
- `PPPPtherapy-/PPPPtherapy-/app/src/practice/signals.ts` — append `phonemeAccuracy()` helper. *(shared — append-only; coordinate with p2-6/p2-7.)*
- `PPPPtherapy-/PPPPtherapy-/app/src/types.ts` — append optional `targetSoundCorrect`/`confidence`/`phonemes` to `SpeechAttempt`. *(shared with p2-5 — append-only.)*
- `PPPPtherapy-/PPPPtherapy-/app/src/components/practice/SpeechCoachTab.tsx` — scoring/low-confidence/consent-required states; target-sound-led result; per-phoneme chips; a11y/RTL/touch fixes. *(shared — see conflict notes; p2-7 also edits.)*
- `PPPPtherapy-/PPPPtherapy-/app/src/config/env.ts` — (if SoapBox docs require) add any new SoapBox config fields (e.g. region/endpoint variant); else no change.

**Create**
- `PPPPtherapy-/PPPPtherapy-/app/src/server/childAsr.test.ts` — unit tests: SoapBox schema → `phonemes`/`targetSoundCorrect`/3-level collapse; Whisper honest-fallback (no false "got" when unbiased transcript lacks target); consent-required path forwards no audio.
- `PPPPtherapy-/PPPPtherapy-/app/src/practice/signals.test.ts` — extend (file exists) with `phonemeAccuracy` cases (null below min-N; 0–100 otherwise).

**Vendor / decision (no code)**
- SoapBox Labs license + API docs (Guy + vendor gate) — required before the SoapBox mapping can be finalized to the real schema. Until then `whisper` honest-fallback + on-device is the shipped path.

### Shared-file conflict notes
- `src/server/childAsr.ts` — also touched by **p2-9-coppa-consent** (hotspot list). p2-9 lands **first** (it is this item's declared dependency and owns the consent contract). This item then finishes provider mappings + adds result fields. Coordinate: p2-9 owns the consent/no-forward guard wiring; p2-10 owns the vendor schema + scoring honesty. Keep edits in distinct regions (consent guard near the route/entry; mapping inside `scoreSoapbox`/`scoreWhisper`).
- `src/practice/signals.ts` — also touched by **p2-6-jitai** (appends `practiceGapDomains`) and read by **p2-7-phonics-tracing**. All append-only at end of file; no reorder of existing exports. If p2-6 merges first, append `phonemeAccuracy` after its helper — trivial merge.
- `src/components/practice/SpeechCoachTab.tsx` — also touched by **p2-7-phonics-tracing** (adds phonics/letter-tracing module) and **m7-playkit-completeness** (primitive polish). Scope this item's edits to the **Record & Compare card** (`:354–408`) and the imports/handlers it needs (`saveAttempt`, `scoreUtterance` call site `:122–130`). Do **not** touch the Words & Express, Sound Studio, or progress-tracking sections (p2-7 / m7 territory). p2-7 consumes the `targetSoundCorrect` signal this item produces, so **land p2-10 before p2-7** where possible.
- `src/types.ts` — also touched by **p2-5-milestone-rebase** and **c4-dev-score**. Append optional fields to `SpeechAttempt` only; no reorder. p2-5 rebases milestone types (different region) — non-overlapping.
- `src/lib/api.ts` — also touched by **p1-comic-reader / p4-operational-hardening / c3-ask-specialist**. Only extend the `scoreUtterance` return type; additive, isolated to those two lines.

### Dependencies (other item ids that must land first)
- **p2-9-coppa-consent** *(declared)* — establishes the child-voice consent record/claim and the Settings surface this item routes to and gates the cloud upload on. p2-10 consumes p2-9's consent field name and the consent UI route; without it, the cloud path must remain gated/off (on-device + parent-judge only). Hard dependency.
- **Vendor + Guy gate** — SoapBox Labs license/decision for the phoneme path; until then ships on Whisper honest-fallback + on-device.
- Soft: **p2-7-phonics-tracing** should land *after* (it reads `targetSoundCorrect`).

### Acceptance criteria (testable, incl. verified live on dev server)
1. `npm run build` (tsc + vite) passes; `npm test` green including new `childAsr.test.ts` and extended `signals.test.ts`.
2. **SoapBox mapping (unit):** a fixture matching SoapBox's real per-phoneme response maps to `phonemes[]` + `targetSoundCorrect` + the correct 3-level `result` (got/almost/missed) per the collapse rules.
3. **Whisper honesty (unit):** when the unbiased transcript does **not** contain the target word, the scorer returns `almost`/low-confidence with `targetSoundCorrect: undefined` — it never returns `got`. When it does contain the target (sim ≥ 0.8), it returns `got`.
4. **No-persist (unit/inspection):** `POST /api/score-utterance` never logs or stores `dataB64`; audio is request-scoped only; 8 MB cap + mime guard intact.
5. **Consent gate (unit):** with no consent signal, the route returns `403 consentRequired` and `scoreChildUtterance`/vendor `fetch` is **not** invoked (assert the vendor call is not made).
6. **SpeechCoach — scoring state (verified live on dev server):** with a cloud provider configured + consent on, recording → "Listening to {first}…" appears, then a target-sound-led verdict; per-phoneme chips render for the SoapBox provider; parent self-score buttons remain clickable throughout.
7. **SpeechCoach — low-confidence (live):** a deliberately unclear/empty utterance shows the "couldn't hear that clearly" copy and **no** auto verdict; parent scoring + audio playback still work.
8. **SpeechCoach — consent-required (live):** with consent off, recording still works (on-device), the auto-result area shows the "Turn on voice scoring" prompt with a working route to Settings, and **no audio is uploaded** (verify in network tab — no `/api/score-utterance` POST, or a 403 with no audio body retained).
9. **Fallback parity (live):** with provider `none`, SpeechCoach behaves exactly as today (on-device Web Speech transcript + parent judge) — no regression.
10. **a11y:** verdict/scoring announced once via `aria-live="polite"`; per-phoneme correctness conveyed by text/glyph + aria-label (not color alone); Save/consent CTAs ≥ 44×44 with visible focus; reduced-motion = opacity-only; verified LTR + RTL (HE).
11. **Mobile mime:** on an iOS Capacitor build the recorded `audio/mp4`/`audio/aac` blob is accepted by `/api/score-utterance` (extend `extFor`/mime handling in `childAsr.ts:51–52` if needed) and scored; Android `audio/webm` path unchanged.

### Operating-rule checks
- **No dark patterns:** scoring is encouragement-framed, never shaming; low-confidence and "missed" copy is supportive and normalizing; parent self-scoring is always the floor; no fake "got" to flatter; consent prompt states plainly that recordings are scored on the spot and not stored (truthful, not coercive).
- **Privacy / COPPA-2026:** child voice = biometric PII → cloud upload is **gated behind p2-9 parental consent**; on-device path needs no upload; audio is **request-scoped, never persisted** server-side (preserve existing behaviour, assert in tests); no raw audio in logs; on-device-first is the default posture.
- **Moat read/write:** writes a *true* per-target-sound articulation signal (`targetSoundCorrect`, `phonemes`) into the child's longitudinal `SpeechAttempt` record — a higher-fidelity moat datum a content-only rival can't produce; `phonemeAccuracy` makes it readable by SpeechCoach progress, `domainBands`, the Care-Network report, and p2-7 phonics gating.
- **Ships-visible:** the parent sees honest, sound-specific feedback (and per-phoneme chips on the licensed path) in the Speech Coach card across web/iOS/Android — observable behaviour change, not internal-only plumbing.
