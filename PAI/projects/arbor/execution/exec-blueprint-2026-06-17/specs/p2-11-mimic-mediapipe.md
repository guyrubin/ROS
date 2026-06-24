## p2-11-mimic-mediapipe — MimicStudio on-device MediaPipe scoring
**Aspects:** UI/UX · **Surfaces/platforms:** web:Grow, ios, android · **Priority:** Phase2

### Problem / why
EB #11 (== PRD B). The on-device MediaPipe blendshape scorer already exists and works on web: pure scoring math in `src/practice/faceMatch.ts`, lazy WASM landmarker in `src/lib/faceLandmarker.ts`, and the camera/scoring UI in `src/components/practice/MimicMatch.tsx` (mounted at the bottom of `MimicStudioTab.tsx`). Two real gaps make it not iOS-grade and not legal-grade:

1. **Legal gate (blocking).** `MimicMatch.start()` calls `navigator.mediaDevices.getUserMedia(...)` directly (`MimicMatch.tsx:71`) with no parental-consent gate. A child face read by a blendshape model is biometric capture under COPPA-2026 — the same standard already documented for voice in `src/server/childAsr.ts:12` ("a child voiceprint is biometric PII … gate behind parental consent at the app layer") and applied as local consent in `AvatarCreator.tsx:40`. Camera access here must sit behind the **centralized** consent gate that `p2-9-coppa-consent` introduces. **This item must not ship its own consent UX** — it consumes p2-9's gate.
2. **Not integrated / not iOS-grade.** The geometry game is bolted on as a third card under the parent-led mirror, duplicates the camera lifecycle that `MimicStudioTab` already runs for the mirror (two `getUserMedia` paths, two `<video>` elements), uses raw Tailwind/hex instead of PlayKit child-register primitives, ships only English hardcoded strings, has no reduced-motion / RTL / keyboard handling on its win state, and writes a `MimicSession` that does not flow into the moat with the same `loopEvents` instrumentation as the rest of Practice.

Scope of p2-11: gate the camera behind p2-9, unify the camera lifecycle so MimicStudio has **one** stream, re-skin Face Match onto PlayKit primitives, make it AA + reduced-motion + RTL + keyboard correct, and ensure each scored round writes the longitudinal moat. **Mimic never diagnoses** — we score the geometry of "did the face make this shape," never an inference about emotion or ability; that framing (already in `faceMatch.ts:1-5`) is preserved verbatim.

### Scope across platform domains
- **Web (Grow → Practice → Mimic Studio):** primary surface. Consent gate, unified camera, PlayKit re-skin, i18n, a11y. This is where all behavior is verified.
- **iOS (Capacitor):** the WASM landmarker + `getUserMedia` run inside the WKWebView. Two native concerns: (a) `NSCameraUsageDescription` must be present in `ios/App/App/Info.plist` or the camera call hard-crashes; (b) the WASM/model are fetched from jsDelivr + Google Storage CDNs (`faceLandmarker.ts:11-13`) so the native CORS/allowlist already established in MOBILE.md must cover those origins. No new RN/Swift code — only Info.plist usage string + verify CDN reachability on device. The consent gate from p2-9 is shared React, so it applies automatically.
- **Android (Capacitor):** `<uses-permission android:name="android.permission.CAMERA" />` in `android/app/src/main/AndroidManifest.xml`, and Capacitor's runtime camera permission prompt must be triggered before `getUserMedia`. Same CDN-reachability check. Consent gate shared.
- **Landing EN / Landing HE:** out of scope.

### IA / UX / Copy / Marketing detail

**IA / integration.** Keep Mimic Studio as one Grow→Practice leaf (`MimicStudioTab`). Collapse the two stacked camera experiences into a single round with a **mode segmented control** at the top of the camera panel: `Mirror` (local-only, parent rates) and `Face Match` (on-device auto-scoring). Both modes reuse ONE `getUserMedia` stream and ONE `<video>` element; switching modes does not re-prompt the OS. `MimicMatch` becomes a presentational scorer that receives the shared `videoRef` + an `enabled` flag, instead of owning its own stream (delete the duplicate stream lifecycle at `MimicMatch.tsx:25-43,66-78,102-105`).

**Consent gate (consumes p2-9).** Before any `getUserMedia`, both modes call the gate p2-9 exposes (assume `useBiometricConsent("camera")` returning `{ granted, request }`, surfaced via `ArborContext`/profile). Flow:
- `granted === false` → camera panel shows a locked default state (no auto-prompt): Sprout + one line + a single primary `PlayButton` "Ask a grown-up" that opens p2-9's consent sheet. Do not call `getUserMedia` until `granted` flips true.
- `granted === true` → existing Start/Turn-on-mirror buttons enabled.
- If p2-9 is not yet merged, gate behind a typed shim `useBiometricConsent` that defaults to `{ granted: false }` so the camera is fail-closed (never opens without explicit consent). Replace the shim import with p2-9's real hook on merge — no other change.

**UI states (camera panel, both modes).**
- *Locked (no consent):* dark panel `#1c222b`, centered Sprout (`HeroAvatar`/`ArborMascot` mood `"wave"`), copy + "Ask a grown-up" button. Touch target ≥54px (PlayButton size `lg`).
- *Idle (consent granted, camera off):* Camera icon + "Start Face Match" / "Turn on mirror" PlayButton.
- *Loading:* "Warming up the camera…" with an indeterminate shimmer; for Face Match also covers the lazy WASM/model download (can be seconds on first run — show this state until `status==="live"`, see `MimicMatch.tsx:66-79`).
- *Live:* mirrored `<video>` (`transform: scaleX(-1)`), and in Face Match a live match meter (reuse `pct` bar, `MimicMatch.tsx:142-146`).
- *Win:* `Celebrate`-style overlay using PlayKit (`Celebrate`/`celebrateBurst` from `ui/playkit.tsx`) with 3-star rating from `matchToStars`. Replace the ad-hoc overlay at `MimicMatch.tsx:147-156`.
- *Empty (face detected but no blendshapes / no face in frame):* meter sits at 0 with a gentle nudge line "Bring your face into the circle" — do not error. Maps to `cats.length === 0` branch (`MimicMatch.tsx:94-96`).
- *Error / unavailable:* permission denied, no camera, or model fetch failed → graceful fallback to Mirror mode with the existing reassuring line. Distinguish *permission-denied* (offer "Ask a grown-up" again) from *no-hardware* (offer Mirror) by inspecting the `getUserMedia` rejection `name` (`NotAllowedError` vs `NotFoundError`).

**Motion.** Star pop and confetti must route through `celebrateBurst()` which already early-returns on `prefers-reduced-motion` (`playkit.tsx:19-21`). The match-meter `transition-all` is decorative width animation — wrap in a reduced-motion guard so it snaps instead of animates when reduce is set. The target-emoji spring (`MimicStudioTab.tsx:133`) already exists; gate it the same way.

**Touch targets / a11y (AA).** Mode segmented control, Start, Ask-a-grown-up, prev/next round, and rating buttons all ≥48px (PlayKit primitives already clear 54/46px). Add:
- `aria-live="polite"` region announcing match state transitions ("Almost there", "You did it — 3 stars") so the win is not purely visual.
- The live meter gets `role="progressbar"` `aria-valuenow={pct}` `aria-valuemin=0` `aria-valuemax=100` (mirror the `ProgressPips` pattern at `playkit.tsx:205`).
- Mode control is keyboard-operable (native `<button>`s with `aria-pressed`), `Tab`/`Enter` reach Start and rating.
- Color is never the only signal: the `pct >= 75` green vs yellow meter (`MimicMatch.tsx:144`) is paired with the text/`aria-live` cue above.
- Decorative emoji get `aria-hidden`; the target face card exposes `face.label` + `face.cue` as the accessible name.

**RTL.** Mimic Studio is reachable in Hebrew. The mode segmented control, meter (`left-3 right-3` → use logical `inset-inline`), and prev/next chevrons must flip under `dir="rtl"`. Swap `ChevronLeft`/`ChevronRight` semantics for prev/next by logical direction, not physical icon. `scaleX(-1)` on the video is a mirror effect, not layout — keep it in both directions.

**Copy (move all strings into i18n; current ones are hardcoded EN in `MimicMatch.tsx`).** Add keys under `prac.mimic.*` in `LanguageContext.tsx` (append-only — see conflict note):
- `prac.mimic.facematch.title` = "Face Match"
- `prac.mimic.facematch.sub` = "Copy the face — {name}'s camera scores the shape, right on the device."
- `prac.mimic.facematch.start` = "Start Face Match"
- `prac.mimic.facematch.loading` = "Warming up the camera…"
- `prac.mimic.consent.locked` = "A grown-up needs to say yes to the camera first."
- `prac.mimic.consent.cta` = "Ask a grown-up"
- `prac.mimic.privacy` = "The camera is read on this device to score the face shape — no video or face data is recorded, stored, or uploaded." (preserve the existing on-device promise, `MimicMatch.tsx:124`)
- `prac.mimic.empty` = "Bring your face into the circle"
- `prac.mimic.win` = "You did it!"
- `prac.mimic.unavailable.nocam` = "No camera here — no problem: use the mirror and you be the judge!"
- The six `MIMIC_FACES` labels/cues (`faceMatch.ts:18-25`) get i18n keys too, keyed by face `id`. Keep `faceMatch.ts` data-only (no React/i18n import) — resolve strings in the component via `t()`.

**Marketing / loop.** Each successful Face Match round already calls `track("mimic_face_match", …)` (`MimicMatch.tsx:56`). Additionally emit the canonical Practice completion via `loopEvents` (do NOT invent a new event name — import the stable name; see hotspot note for `loopEvents.ts`). This is the same moat-write event other Practice tabs emit, so Mimic rounds feed streaks, the weekly digest, and the consult packet "tracking since" language. No new acquisition asset.

### Files to create / edit (exact repo-relative paths)
- **Edit** `PPPPtherapy-/PPPPtherapy-/app/src/components/practice/MimicMatch.tsx` — remove owned camera stream; accept shared `videoRef`, `enabled` (consent), and `active` (mode) props; re-skin to PlayKit (`Celebrate`, `MascotSay`, `PlayButton`); add `aria-live`, `role="progressbar"`, reduced-motion guard; i18n all strings; permission-denied vs no-hardware branching.
- **Edit** `PPPPtherapy-/PPPPtherapy-/app/src/components/practice/MimicStudioTab.tsx` — add mode segmented control; own the single shared `getUserMedia`/`<video>`; pass `videoRef`/consent/mode to `MimicMatch`; gate `startMirror`/Face-Match behind `useBiometricConsent`; render locked state; i18n.
- **Edit** `PPPPtherapy-/PPPPtherapy-/app/src/practice/faceMatch.ts` — keep scoring math; replace inline EN labels/cues with stable `id`s + a `MIMIC_FACE_IDS` export so the component can resolve i18n (data stays React-free). Do not change `scoreFaceMatch`/`matchToStars`/`blendshapesToMap` signatures (covered by `faceMatch.test.ts`).
- **Edit** `PPPPtherapy-/PPPPtherapy-/app/src/components/ui/playkit.tsx` — ONLY if a new primitive is genuinely needed (e.g. a `<ModeToggle>` segmented control). Prefer composing existing primitives; if added, append at end of file, no edits to existing exports (see hotspot).
- **Edit** `PPPPtherapy-/PPPPtherapy-/app/src/context/LanguageContext.tsx` — append `prac.mimic.*` keys for EN + HE (append-only).
- **Edit** `PPPPtherapy-/PPPPtherapy-/app/src/lib/faceLandmarker.ts` — no logic change; add a one-line guard returning a typed "unavailable" rejection when WebGL/WASM is absent so the error state is deterministic (optional, nice-to-have).
- **Create** `PPPPtherapy-/PPPPtherapy-/app/src/components/practice/MimicMatch.test.tsx` (or extend `faceMatch.test.ts`) — assert: fail-closed when `enabled=false` (no `getUserMedia` call), `aria-live` announces win, `matchToStars` thresholds, reduced-motion path.
- **Edit (native config)** `PPPPtherapy-/PPPPtherapy-/app/ios/App/App/Info.plist` (`NSCameraUsageDescription`) and `PPPPtherapy-/PPPPtherapy-/app/android/app/src/main/AndroidManifest.xml` (`CAMERA` permission) — if these native projects exist in the repo; if not yet generated, record the requirement in `PPPPtherapy-/PPPPtherapy-/app/MOBILE.md`.
- **Consume (do not edit)** the consent hook from `p2-9-coppa-consent` (`useBiometricConsent`). If absent at build time, add a temporary fail-closed shim in `PPPPtherapy-/PPPPtherapy-/app/src/lib/biometricConsent.ts` to be deleted/replaced by p2-9.

### Shared-file conflict notes
- **`src/components/ui/playkit.tsx`** (hotspot: p1-comic-reader, p3-ios-grade-audit, p2-7-phonics-tracing, **p2-11**, m2-token-extraction, m7-playkit-completeness): the hotspot rule is *m2 (token extraction) + m7 (completeness) settle the primitive API FIRST; feature missions consume stable primitives.* So p2-11 should **prefer composing existing exports** and add at most one appended primitive. Do not rename or re-signature any existing PlayKit export. Coordinate so this lands after m2/m7 if they are in flight; if p2-11 needs a `ModeToggle`, flag it to m7 so it can be absorbed into the completeness pass rather than duplicated.
- **`src/components/practice/MimicStudioTab.tsx`** (touched by p2-11 + m7-playkit-completeness): m7 re-skins to PlayKit; p2-11 changes camera/consent structure. Land as a single coordinated pass on this file — do the structural camera/consent change (p2-11) and the PlayKit visual conversion (m7) together, not in parallel branches, to avoid clobber.
- **`src/server/childAsr.ts`** (touched by p2-9 + p2-10): not edited here, but it is the precedent for the consent contract — keep the consent hook shape consistent with whatever p2-9 wires for `childAsr`/`AvatarCreator` so there is ONE consent mechanism, not three.
- **`LanguageContext.tsx`** (hotspot, multiple copy/IA missions append keys): append `prac.mimic.*` only; no reordering; reconcile any key collision in b5's final pass.
- `MimicMatch.tsx` and `faceMatch.ts` are owned solely by p2-11 (no other item lists them) — low conflict.

### Dependencies (other item ids that must land first)
- **`p2-9-coppa-consent`** — HARD dependency. The camera must sit behind p2-9's parental-consent gate. p2-11 may build against a fail-closed shim, but cannot be marked done until it consumes p2-9's real `useBiometricConsent`.
- Soft-coordinate with **m7-playkit-completeness** and **m2-token-extraction** (PlayKit API), and with the shared edit to `MimicStudioTab.tsx`.

### Acceptance criteria (testable, including "verified live on dev server")
1. With consent NOT granted, opening Mimic Studio shows the locked camera state and **`getUserMedia` is never called** (verify via Network/Application camera indicator + unit test asserting no `mediaDevices.getUserMedia` invocation when `enabled=false`).
2. Tapping "Ask a grown-up" opens p2-9's consent sheet; after grant, Start enables and the camera opens without an app reload.
3. Mirror and Face Match share ONE camera stream and ONE `<video>`; switching modes does not re-trigger the OS permission prompt (observe single prompt, verified live on dev server).
4. A scored Face Match round ≥ `SUCCESS_AT` shows the PlayKit `Celebrate` win with the correct 1/2/3 stars from `matchToStars`, persists a `MimicSession` via `data.mimic.upsert`, and emits the canonical Practice-completion `loopEvents` event (verify the session appears in the moat / weekly stats).
5. `npm run typecheck` and `npm test` pass, including the new `MimicMatch.test.tsx` and unchanged `faceMatch.test.ts`.
6. `prefers-reduced-motion: reduce` suppresses confetti and meter/emoji animation; the win still announces via `aria-live` (verified live with the OS reduce-motion setting on).
7. Keyboard-only: Tab reaches mode toggle → Start → rating; Enter activates; focus-visible rings present (AA). Screen reader announces match progress and the win.
8. Hebrew (`dir="rtl"`): mode toggle, meter, and prev/next flip correctly; no clipped/overlapping controls; the video mirror still reads naturally.
9. No hardcoded user-facing English remains in `MimicMatch.tsx`/`MimicStudioTab.tsx`; all strings resolve through `t()` for EN + HE.
10. iOS/Android: camera opens in the Capacitor shell with the native usage string present and the WASM/model CDNs reachable (or the requirement is recorded in MOBILE.md if native projects aren't generated yet).

### Operating-rule checks
- **No dark patterns:** consent is fail-closed and parent-initiated; no auto-prompt, no nag. Privacy line is stated plainly before any camera use. Win/celebration is genuine progress, not a gambling loop.
- **Privacy / COPPA-2026:** camera frames are processed on-device only (MediaPipe WASM, `faceLandmarker.ts:1-7`); no image/video/face data is recorded, stored, or uploaded — only the resulting star `MimicSession`. Biometric capture sits behind the centralized parental-consent gate (p2-9). Geometry-only scoring — **mimic, never diagnose** (`faceMatch.ts:1-5`).
- **Moat read/write:** reads existing `data.mimic.items` for pack progress; writes each scored round as a `MimicSession` into the longitudinal store and emits the canonical Practice-completion event so it feeds streaks, digest, and the consult packet.
- **Ships-visible:** lands in the live web app at Grow → Practice → Mimic Studio (and the Capacitor shells), verified on the dev server — not a doc-only change.
