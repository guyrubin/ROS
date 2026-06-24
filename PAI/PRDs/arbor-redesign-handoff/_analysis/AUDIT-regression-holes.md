# AUDIT — Regression Holes in the No-Regression Gate

**Auditor:** arbor-evaluator (adversarial regression-hole critic)
**Date:** 2026-06-23
**Question answered:** Which LIVE, SHIPPED capabilities can a builder delete while "implementing the prototype" with NO floor (F1–F11) or Bucket-B/C entry catching it?
**Method:** Cross every [FULL] inventory item + MUST-NOT-REGRESS entry against F1–F11; for each suspected hole, probe `app/src` to confirm the capability is real AND confirm no automated assertion guards it.

**Verdict: coverage is NOT complete.** F1–F11 protect 11 *content-count / enum-presence* dimensions well, but the gate is **structurally blind to behavioral/runtime capabilities** — the safety, consent-enforcement, voice, image, sharing-expiry, and export surfaces. These are exactly the surfaces a "reskin to the prototype" PR strips, because the prototype never shows them. Below: 7 confirmed holes (3 of them gated/critical), each with the missing floor assertion.

---

## CONFIRMED HOLES

### HOLE-1 — Safety output-screening + escalation has NO floor (CRITICAL / gated)
- **Live capability:** Input-side escalation screen (`src/safety/escalation.ts` — regex crisis/escalation keyword detector) + output-side model screening (`src/safety/outputScreen.ts` — `OutputScreenVerdict.flagged` blocks model output before it reaches a parent). Inventory: `safety` tab [FULL], MUST-NOT-REGRESS #2 + #16, Bucket **B-17** ("Non-negotiable. No redesign wave may touch or remove this surface").
- **Evidence:** `src/safety/escalation.test.ts`, `src/safety/outputScreen.test.ts` both exist and pass; wired via `npm run eval:safety` (`scripts/safety-eval.mjs`).
- **Gap:** B-17 is a *prose* protect-note, not a machine floor. `eval:safety` runs in the green-gate but asserts **output quality**, not **structural presence** — nothing fails red if a builder deletes `escalation.ts`, removes the SafetyTab route, or unwires the screen from the chat path. F1 (routes ≥34) would only catch the tab if `safety` stays in `VALID_TABS`, but a builder can keep the route shell and gut the screening logic. No floor asserts the escalation/output-screen modules are imported on the live coach path.
- **Which floor SHOULD cover it:** none does. This is the single highest-severity hole — it is the one Bucket-B item explicitly marked "non-negotiable" yet has zero count/presence floor.
- **Proposed floor F12 — Safety screening present + wired:**
  - Assert `src/safety/escalation.ts` exports the escalation screener AND `src/safety/outputScreen.ts` exports `OutputScreenVerdict` (static-presence).
  - Assert the coach API path (`routes/api.ts` `/api/chat`) imports the output screen — grep/import assertion that the screen sits between model output and response.
  - Keep `eval:safety` as the behavioral half. **Manual reviewer:** arbor-safety signs that the screen is still on the live path (a script sees the import; only a human confirms it is not short-circuited).
  - riskClass: **gated** (safety surface — file, never auto-queue).

### HOLE-2 — Consent-enforcement middleware (`requireConsent`) is un-floored AND untested (CRITICAL / gated)
- **Live capability:** Server-side consent gate (`src/server/requireConsent.ts`) — returns **HTTP 451 `consentRequired`** unless `consentStore.isActive(childId, purpose)` is true, blocking face/voice/AI-training capture without active parental consent. Inventory: MUST-NOT-REGRESS #12, Bucket **B-12** (COPPA, "Do not remove or weaken"). This is the *enforcement* behind F9.
- **Evidence:** `src/server/requireConsent.ts` confirmed (451 path on missing consent). AvatarCreator UI says photo "used once, then immediately discarded — never stored."
- **Gap:** F9 asserts the three `ConsentPurpose` **literals exist in `types.ts`** — pure enum presence. It does NOT assert the **enforcement middleware still runs**. A builder can keep the enum and delete/bypass the `requireConsent` wrapper on the avatar/voice routes during a reskin, and F9 stays green. **`requireConsent.ts` has no test file** (`find src -name "*requireConsent*"` → only the source). This is the gap between "the consent enum is present" (F9, green) and "consent is actually enforced before capture" (unprotected).
- **Which floor SHOULD cover it:** F9 covers the enum, not the gate. The semantic note under F9 ("arbor-sec + arbor-safety confirm AP-049 REQUESTS the right purpose") is a Wave-3 manual review of the *new* onboarding — it does not protect the *existing* server middleware on every other wave.
- **Proposed floor F13 — Consent gate enforced on capture routes:**
  - Assert `requireConsent` is imported and applied to every route that captures face/voice/training data (avatar generation, voice dictation, any image-from-photo path) — import/wiring assertion in `routes/api.ts` / `server/createApp.ts`.
  - Add a behavioral test: a capture request with no active consent returns 451. (Fills the missing `requireConsent.test.ts`.)
  - riskClass: **gated** (consent/child-data).

### HOLE-3 — Sharing role/scope/server-enforced expiry has no floor (gated)
- **Live capability:** `src/sharing/shares.ts` — `ShareRole = "co_parent" | "viewer" | "professional"`, `scopes: string[]`, `expiresAt`, and **server-enforced** `isShareActive` (every read passes grants through it; expired/revoked grants resolve to nothing). Plus GDPR `eraseByChild` (`sharesErase.test.ts`). Inventory: `sharing`/`care-team` tabs [FULL], MUST-NOT-REGRESS #11, Bucket **B-10** ("Live enforces co-parent-seat-limit server-side").
- **Evidence:** `shares.ts`, `consent.ts`, `shares.test.ts`, `sharesErase.test.ts` all confirmed.
- **Gap:** F6 asserts `PLAN_LIMITS.family` exists and `coParentSeats >= 1` — that protects the *billing seat count*, not the *sharing access-control model*. No floor asserts the three `ShareRole` literals survive, that scopes are honored, or that `isShareActive` still gates reads (server-enforced expiry). A reskinned "Family Circle" (prototype has 5 roles, no seat enforcement per B-10) could collapse the live 3-role server-enforced model into a client-only display and no floor fails.
- **Which floor SHOULD cover it:** F6 is adjacent (Family tier) but does not reach the sharing access model.
- **Proposed floor F14 — Sharing access model preserved:**
  - Assert `ShareRole` union contains `co_parent`, `viewer`, `professional` (static, like F9).
  - Assert `isShareActive` is exported and applied on the read path (server-enforced expiry, not client-filtered).
  - Behavioral test already exists (`shares.test.ts`, `sharesErase.test.ts`) — anchor F14 there.
  - riskClass: **gated** (child-data egress / access control).

### HOLE-4 — Voice I/O (speech-in + TTS-out) has no floor and no test (safe)
- **Live capability:** `src/lib/speech.ts` (`startDictation`, Web Speech API input) + `src/lib/tts.ts` (`speak`, SpeechSynthesis output). Inventory: MUST-NOT-REGRESS #17, Bucket **B-15** ("new chrome must not strip the voice I/O affordance").
- **Evidence:** both modules confirmed exporting their wrappers. **No test files** (`find src -name "*speech*test*" -o -name "*tts*test*"` → empty).
- **Gap:** Voice I/O lives entirely in the coach chrome — exactly the surface the prototype shows as "a simpler chat UI" (B-1/B-15 warn about this). A shell/topbar reskin (Wave 1/2) that rebuilds CoachTab can silently drop the mic + speaker affordances. No floor, no test, no tab-count signal (coach tab stays in F1 regardless).
- **Proposed floor F15 — Voice I/O affordance present on coach:**
  - Assert `speech.ts` `startDictation` and `tts.ts` `speak` are imported by `CoachTab.tsx` (import/wiring assertion).
  - Optional smoke: coach view renders a mic control when `speechSupported()`.
  - riskClass: **safe** (no data surface; pure capability presence) — auto-queueable.

### HOLE-5 — Image / comic generation has no floor and no test (safe)
- **Live capability:** Story-beat + comic-panel image generation (`src/lib/image.ts`, Gemini vision via `routes/api.ts`; `HeroComicsTab.tsx`, `HeroScenePlayer.tsx`). Inventory: "Image generation" [FULL], `comics` tab [PARTIAL], C2PA/SynthID-at-export called out in the gate's AP-050 note.
- **Evidence:** `image.ts` confirmed; comic/scene render paths confirmed. **No image/comic test** (`find` → empty).
- **Gap:** No floor counts or asserts the image-generation path. The gate's AP-050 note ("C2PA/SynthID at export preserved") is a *Wave-4 ticket review*, not a standing floor — it only fires when someone touches AP-050. A naive Playbank/Academy reskin (B-5/B-6 surfaces) could drop the comic generation path with nothing red.
- **Proposed floor F16 — Image-gen path present + provenance preserved:**
  - Assert the image-generation export in `lib/image.ts` / `routes/api.ts` exists.
  - Assert the C2PA/SynthID tagging step exists on the export path (static-presence) — promote the AP-050 note into a standing floor so it guards every wave, not just AP-050.
  - riskClass: **safe** for presence; the provenance assertion is **gated** (child-image egress) — split into F16a (presence, safe) + F16b (provenance, gated, arbor-sec signs).

### HOLE-6 — Professional handoff / report export has no floor and no test (safe)
- **Live capability:** `src/lib/reportExport.ts` (client-side warm brief / teacher-specialist notes → printable/Save-as-PDF), `consult` route. Inventory: `consult` tab [FULL], MUST-NOT-REGRESS #9, Bucket **B-9** ("Do not flatten").
- **Evidence:** `reportExport.ts` confirmed (`ReportDoc`, `ReportType`, generated from real child data). **No reportExport/handoff test** (`find` → empty).
- **Gap:** The 5-tab Care Network (B-9: consult/care-team/sharing/appointments/safety) is route-counted by F1, but F1 only checks the tab *exists in VALID_TABS* — it does not check the handoff/export *capability* inside `consult` survives. The prototype shows only a "consult packet builder" (B-9), so a reskin that keeps the consult tab shell but drops `reportExport` regresses with F1 green.
- **Proposed floor F17 — Handoff export present:**
  - Assert `reportExport.ts` exports the report builder AND it is wired into the consult/handoff path.
  - Add the missing test (report generates non-empty sections from a sample child).
  - riskClass: **safe** (read-only export of already-consented data) — auto-queueable.

### HOLE-7 — Behavior-log richness + corrected-age + screening are count-blind (safe, framing-gated)
- **Live capability:** (a) Behavior log richness: intensity 1–5 + context + trigger + response + photo + co-regulation scripts (`behaviors` tab [FULL], MUST-NOT-REGRESS, Bucket **B-4** "Do not strip"); (b) corrected-age for preterm (`milestoneData.ts` `CorrectedAge`, MUST-NOT-REGRESS #4, **B-3**); (c) non-diagnostic screener (`lib/screening.ts`, inventory `screening` [PARTIAL], **Bucket-C** "KEEP LIVE — screening tab exists").
- **Evidence:** `behaviorUtils.ts` intensity scale confirmed; `milestoneData.ts` `CorrectedAge` confirmed; `screening.ts` confirmed. **`screening.ts` has NO test** (`find src/lib/screening.test.ts` → NO SCREENING TEST).
- **Gap:** F5 counts milestone *items* (≥133) but says nothing about the **corrected-age** computation surviving (B-3 explicitly: preterm support). F4/F5 are count floors; the behavior-log *field set* (B-4's "intensity, context, trigger, response, photo, co-regulation scripts") has no floor — a reskin to the prototype's "simplified behavior log" (B-4 warns of exactly this) drops fields with nothing red. Screening is a Bucket-C KEEP-LIVE with no floor and no test.
- **Proposed floor F18 — Clinical-content shape preserved:**
  - F18a: assert `CorrectedAge` / preterm-correction export exists in `milestoneData.ts` (presence).
  - F18b: assert the behavior-log type retains intensity + context + trigger + response + photo + co-regulation-script fields (static type-shape assertion over `types.ts` `BehaviorLog`).
  - F18c: assert `screening.ts` screener export exists; add the missing screening test.
  - riskClass: **safe** for presence; **framing-gated** for any copy change (arbor-clinical-psych/-slp, per the gate's F4/F5 manual-framing note).

---

## SUMMARY TABLE — holes vs missing floor

| Hole | Live capability | Inventory evidence | Floor that SHOULD cover (but doesn't) | Proposed floor | riskClass |
|---|---|---|---|---|---|
| H-1 | Safety escalation + output screening | B-17, MNR #2/#16; `safety/escalation.ts`,`outputScreen.ts` | none (B-17 prose only; eval:safety = quality not presence) | **F12** | gated |
| H-2 | Consent-enforcement middleware (451) | B-12, MNR #12; `server/requireConsent.ts` (untested) | F9 (enum only, not enforcement) | **F13** | gated |
| H-3 | Sharing roles/scopes/server-expiry | B-10, MNR #11; `sharing/shares.ts` | F6 (billing seat, not access model) | **F14** | gated |
| H-4 | Voice I/O (speech-in + TTS) | B-15, MNR #17; `lib/speech.ts`,`tts.ts` (untested) | none | **F15** | safe |
| H-5 | Image / comic generation | "Image gen" FULL; `lib/image.ts` (untested) | none (AP-050 note ≠ standing floor) | **F16a/b** | safe / gated |
| H-6 | Professional handoff export | B-9, MNR #9; `lib/reportExport.ts` (untested) | F1 (route exists ≠ capability inside) | **F17** | safe |
| H-7 | Behavior-field richness + corrected-age + screening | B-3/B-4, Bucket-C screening; `behaviorUtils.ts`,`milestoneData.ts`,`screening.ts` (untested) | F4/F5 (counts only, not field shape) | **F18a/b/c** | safe / framing-gated |

---

## ROOT-CAUSE THEME (editor pass)

The gate's blind spot is **categorical, not incidental**: F1–F11 all assert *content counts* (routes, worlds, journeys, milestones, activities, tiers, lenses) or *enum presence* (domains, consent literals, RTL, ledger append-only). **Every count-based floor protects "how much content shows"; none protects "does the behavior still run."** The prototype is thin precisely on the runtime/safety/enforcement surfaces (it shows a simple chat, no memory, no consent, no escalation), so the *capabilities the prototype omits entirely are the ones with zero floor* — the exact opposite of what a no-regression gate should weight. The three highest-severity holes (H-1 safety, H-2 consent enforcement, H-3 sharing access) are all on Bucket-B "non-negotiable / do-not-weaken" surfaces and are all gated/child-data — they must be filed, never auto-queued, and surfaced to Guy.

A secondary signal: **six of seven holes have no test at all** (`requireConsent`, `speech`, `tts`, `image`, `reportExport`, `screening`). The floor gap and the test gap are the same gap.

---

## 3 WEAKEST-COVERED CAPABILITIES (if you treat partial coverage as "covered")

1. **Consent enforcement (H-2)** — F9 gives a false sense of safety (enum present = green) while the actual 451-enforcement middleware is untested and un-floored. Weakest because the green floor actively masks the hole.
2. **Safety screening (H-1)** — `eval:safety` runs but checks output quality, not structural presence/wiring; the one Bucket-B item marked "non-negotiable" has no presence floor.
3. **Voice I/O (H-4)** — explicitly flagged in B-15 as the thing "new chrome must not strip," lives in the most-reskinned surface (coach), has no floor and no test.

---

END OF AUDIT (2026-06-23)
