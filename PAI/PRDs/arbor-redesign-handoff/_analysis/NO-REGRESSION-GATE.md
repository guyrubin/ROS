# Arbor Redesign — No-Regression Ship Gate

**Owner:** arbor-devsecops-lead · **Date:** 2026-06-23
**Scope:** AP-043..AP-054 (4 waves). IA/visual/design-system upgrade on a RICHER live app.
**Spec only — does NOT modify CI or product code.** This is the gate definition the build pods implement and DevSecOps enforces.

**#1 risk:** the redesign silently regresses shipped capability. The prototype is THINNER than live in 6+ dimensions (games 14 vs 6, journeys 10 vs 4, milestones 133 vs 35, tiers 3 vs 2, routes 34 vs 6). Implementing the prototype literally is a hard regression. This gate makes every such dimension a machine-checked FLOOR.

**App under gate:** `C:/Users/dguyr/ROS/PPPPtherapy-/PPPPtherapy-/app`
**Doctrine (binding):** branch → green-gate → canary → prod. Never blind-to-main. Never hand-deploy. Merge-the-PR IS the prod-promote (client deploys from `main` via `arbor-deploy.yml`).

---

## 1. Regression FLOORS — automatable assertions

Each floor is a hard inequality on a value read from a CANONICAL source already in the code (located by probe below). The new check `npm run check:floors` (a `scripts/capability-floors.mjs` the build pod adds) imports these sources and asserts each floor; a single failing floor = red gate = ship blocked.

| # | Floor | Canonical source in code (LOCATED) | How CI counts it |
|---|---|---|---|
| F1 | Routes ≥ 34 | `src/context/ArborContext.tsx:54` `ActiveTab` union + `:97` `VALID_TABS` set (35 entries today) | `VALID_TABS.size >= 34`; assert `ActiveTab` union member count == `VALID_TABS.size` (they must not drift). Existing test `src/lib/navigation.test.ts` already asserts `SECTIONS` shape + deep-link `sectionForTab` coverage. |
| F2 | Practice worlds ≥ 14 | `src/components/practice/HeroArcade.tsx:69` `const WORLDS: World[]` — 14 entries today (speech, feelings, adventures, mimic, memory, reading, beat, pose, pattern, order, truth, promise, courage, aim) | Export/derive the world-id list and assert `WORLDS.length >= 14` with unique ids. **NOTE: `WORLDS` is module-local — see §1a probe action.** |
| F3 | Hero journeys ≥ 10 | `src/lib/heroJourneys.ts` `HERO_STORIES` | ALREADY ASSERTED: `src/lib/heroJourneys.test.ts:31` `expect(HERO_STORIES).toHaveLength(10)` + unique ids + 4 PACKS. Tighten the floor variant to `>= 10` so enrichment can ADD stories without re-editing the test. |
| F4 | Dev domains = 7 | `src/types.ts:33` `DevelopmentalDomainId` union (7 members: attachment_regulation, language_communication, cognition_executive_function, social_development, independence_adaptive_skills, sensory_motor_patterns, ecosystem_stressors) + `src/framework.json` `domains[]` | Assert `framework.json.domains.length === 7` AND the 7 `DevelopmentalDomainId` literals are exactly those ids. `npm run check:framework` (`scripts/framework-check.mjs`) ALREADY cross-checks `framework.json.domains` against the operating-model doc — extend it to assert count == 7. |
| F5 | Milestone items ≥ 133 | `src/lib/milestoneData.ts` `ALL_MILESTONES` (= CDC + ASHA + ARBOR_EXTENDED) | Assert `ALL_MILESTONES.length >= 133`. Existing test `src/lib/milestoneData.test.ts:73` already asserts `ALL_MILESTONES.length` == sum of sources, and `:38` bounds `CDC_MILESTONES >= 110`. Add the absolute `>= 133` floor on the union. |
| F6 | Billing tiers include Family | `src/server/entitlements.ts:26` `type Plan = "free" \| "plus" \| "family"` + `:58` `PLAN_LIMITS.family` + `:121` `isPlan` guard | Assert `isPlan("family") === true` AND `PLAN_LIMITS.family` exists AND co-parent seat (`family.shareSeats >= 1`). Existing tests under `src/server/entitlements.test.ts`. |
| F7 | Scholar lenses ≥ 6 | `src/services/scholars.ts` SCHOLARS array (8 today: vygotsky, bowlby, winnicott, montessori, bronfenbrenner, piaget, erikson, integrated) | Assert the exported scholars list length `>= 6` with unique ids. Anchor in `src/services/scholars.test.ts`. |
| F8 | Memory ledger append-only invariant | `src/memory/memoryService.ts:82` `appendMemoryProposals` → `:101/:139` `store.appendEvent(...)`; `foldMemoryEvents` reduces events to state | ALREADY ASSERTED: `src/memory/memoryService.test.ts:21` "folds append-only events to the latest non-deleted review item". Floor = a STATIC guard + the existing behavioral test: assert `memoryService` has no mutate/overwrite path (only `appendEvent`); a delete is a new append-event (tombstone), never an in-place erase. |
| F9 | Consent purposes face/voice/training present | `src/types.ts:87` `type ConsentPurpose = "face_processing" \| "voice_processing" \| "ai_training"` | Assert the `ConsentPurpose` union contains all three literals. A redesigned onboarding/consent surface (AP-049) must not drop a purpose. Static-string assertion over `types.ts`. |
| F10 | RTL / HE preserved | `src/context/LanguageContext.tsx:46` `document.documentElement.dir = uiLang === "he" ? "rtl" : "ltr"`; `src/lib/i18n.ts:10` `UiLang = "en" \| "he"`; `index.css` `html[lang="he"]` font stack | Assert `UiLang` includes `"he"` AND LanguageContext sets `dir="rtl"` for `he`. Plus a route smoke that loads with `lang=he` and asserts `documentElement.dir === "rtl"` (see §2 smoke). |
| F11 | Activity library ≥ 250 (Bucket-C, add) | `src/playbank/content.ts` activity registry | Assert activity count `>= 250`. Anchor in `src/playbank/content.test.ts`. Included because the prototype shows ~3 cards — naive reskin could truncate the picker source. |

### 1a. Probe actions before W1 (build-pod task, not a gate change)

- **F2 (worlds):** `WORLDS` is a module-local `const` in `HeroArcade.tsx` — not importable by a floor script today. Build pod must EXPORT the world-id registry (e.g. `export const WORLD_IDS` or move `WORLDS` to `src/practice/worlds.ts`) so `capability-floors.mjs` can import and count it. Until exported, F2 falls back to a grep-count assertion on the `WORLDS: World[]` array literal (brittle — replace with import ASAP).
- **F1 (routes):** add an `export const ALL_TABS: ActiveTab[]` derived from `VALID_TABS` so the floor script imports one canonical list instead of re-deriving the union.
- **F11 (activities):** confirm the activity array is exported from `playbank/content.ts`; if only a selector is exported, export the raw count.

### LOCATED vs NEEDS-PROBE summary

- **LOCATED in code (10/11):** F1, F3, F4, F5, F6, F7, F8, F9, F10, F11 — exact file:line cited above; assertions are writable today.
- **LOCATED but needs an EXPORT to assert cleanly (1):** F2 (worlds) — value exists at `HeroArcade.tsx:69`, but is module-local; needs the §1a export. Assertable via brittle grep in the interim.
- No floor is missing from the codebase. The only code change required to enable the gate is non-functional EXPORTS (F1, F2, F11) — no behavior change, lands inside W1.

### Floors that CANNOT be fully automated — need a manual reviewer

These have an automatable PRESENCE floor but a SEMANTIC dimension a script cannot judge. The presence check runs in CI; the named reviewer signs the PR.

| Floor | Automatable part | Manual reviewer + what they judge |
|---|---|---|
| F8 memory ledger | "only appendEvent path exists / delete = tombstone" (static + behavioral test) | **arbor-sec** — confirms no new UI path lets a parent or sync job hard-delete a ledger event in place (GDPR erase must be a tombstone + retention job, not an in-place wipe). |
| F9 consent purposes | all 3 literals present | **arbor-sec + arbor-safety** — confirm AP-049 onboarding actually REQUESTS the right purpose before face/voice/training capture, and copy is COPPA/GDPR-valid. Presence of the enum ≠ correct consent UX. |
| F10 RTL/HE | `dir=rtl` for `he` + smoke | **arbor-qa (HE reviewer)** — visual RTL correctness (mirrored layout, no clipped Hebrew, sidebar/topbar mirror) on the NEW shell. A script cannot see a broken mirror. Mandatory on AP-044 (shell) and any topbar ticket. |
| F4/F5 clinical framing | counts (=7, ≥133) | **arbor-clinical-psych / -slp** — for AP-049 (focus-domain copy), AP-051 (Day Windows), AP-054 (Language Lab): non-pathologizing, non-diagnostic framing. Counts are green but framing is a human veto. |
| Visual-parity (AP-043 token migration) | screenshot diff CAN flag pixel deltas | **arbor-design** — adjudicates whether a flagged diff is an intended token change or a regression. The diff tool flags; a human decides. |

---

## 2. Green-gate — existing + redesign additions

### Existing green-gate (unchanged, runs on every PR)
From `app/package.json`:
```bash
cd app && npm run lint && npm test && npm run check:framework && npm run eval:safety
```
- `lint` = `tsc --noEmit` (type floor — F1/F4/F6/F9 union changes break the build here first)
- `test` = `vitest run` (carries F3, F5, F6, F8 existing assertions)
- `check:framework` = `scripts/framework-check.mjs` (domains/age-bands/Six Frames vs docs — anchor for F4)
- `eval:safety` = `scripts/safety-eval.mjs` (output-screening eval)
- `test:coverage` = `vitest --coverage` (coverage-regression gate — arbor-qa owns the threshold)

### Additions for the redesign (build pod adds these scripts; DevSecOps requires them)

**(a) Capability-floor check — `npm run check:floors`** (`scripts/capability-floors.mjs`)
Imports the canonical sources (§1) and asserts F1–F11. Pure read, no network, runs in <2s. This is the new no-regression spine. Add to the composite:
```bash
cd app && npm run lint && npm test && npm run check:framework && npm run eval:safety && npm run check:floors
```

**(b) Route + visual smoke — `npm run smoke:routes`**
A Playwright/Vitest-browser smoke that, against a built preview:
1. Loads each of the 34 `VALID_TABS` via `#/<tab>` hash route and asserts the view mounts without an error boundary (F1 reachability — the shell swap in AP-044 must keep all 34 reachable).
2. Loads `lang=he` and asserts `document.documentElement.dir === "rtl"` (F10).
3. Loads at <768px and asserts the bottom-tab mobile nav renders (Bucket B-20 mobile-first; AP-044 must not break mobile).
4. (AP-043) runs before/after screenshot diff on primary surfaces; non-empty diff set → arbor-design adjudicates (manual gate above).

Smoke runs in canary, not just unit CI, because it needs a built app.

---

## 3. Wave sequencing

Doctrine reinforced every wave: **branch → green-gate (lint+test+check:framework+eval:safety+check:floors) → canary (smoke:routes) → prod (merge to `main` = promote).** Never blind-to-main. Never hand-deploy. Deploy-to-prod is Level-3 — Guy confirms each promote.

### Wave 1 — Tokens + Shell (pure FE) · AP-043, AP-044
- **Branch:** `rel/arbor/redesign-w1-foundation`
- **Gate checks:** full green-gate + `check:floors` (must pass with the new §1a EXPORTS landed) + `smoke:routes` (all 34 reachable, mobile nav intact) + AP-043 visual-diff adjudicated by arbor-design + F10 RTL smoke.
- **Blast radius:** EVERY screen (token migration touches all components; shell wraps all routes). Highest-surface, lowest-logic wave. 344 hex literals → tokens.
- **Rollback:** revert the merge commit; client redeploys prior `main`. Token layer is additive (CSS custom props) — revert is clean. Shell swap is behind no flag but is pure chrome; revert restores `Shell.tsx` tab bar.
- **Specialist sign-off:** arbor-design (visual parity), arbor-qa (HE/RTL + mobile smoke), arbor-release (build green + revert path), arbor-sre (no bundle-size/perf regression from token runtime).

### Wave 2 — Topbar (search / notifications / multi-kid) · AP-045, AP-046, AP-047
- **Branch:** `rel/arbor/redesign-w2-topbar`
- **Gate checks:** green-gate + `check:floors` + `smoke:routes`. Extra: assert search is read-only (no new API endpoint; no child-data write) and notification bell reads existing JITAI/monitoring signals (no FCM/push consent added — that stays AP-038).
- **Blast radius:** topbar zone + global query layer. Read-only over existing content stores. Multi-kid chip reuses `ProfileContext`/`ProfileSwitcher` — active-child switch path must be byte-identical (F-multi-child).
- **Rollback:** revert merge; topbar reverts to W1 placeholder. No data migration to undo.
- **Specialist sign-off:** arbor-sec (search has no child-data egress; bell adds no push consent), arbor-qa, arbor-release, arbor-sre (search index perf).

### Wave 3 — Kid Mode + Onboarding · AP-048 (safe), AP-049 (GATED)
- **Branch:** `rel/arbor/redesign-w3-kidmode-onboarding`
- **Gate checks:** green-gate + `check:floors` (Kid Mode must surface all 14 worlds + 10 journeys — F2/F3 re-confirmed behind the overlay) + smoke. **AP-049 is GATED:** Step-3 focus-domain copy needs arbor-clinical-psych non-pathologizing sign-off; Step-4 avatar = child-data needs arbor-safety COPPA/GDPR review + F9 consent floor. **Surfaces for Guy (Level-3+).** Ship AP-048 + AP-049 safe-slice (steps 1/2/5) first; gated steps 3/4 land after clinical + safety + Guy sign-off.
- **Blast radius:** AP-048 pure FE (no data write on enter/exit — assert). AP-049 writes child profile via existing `ProfileContext` path (no schema change) + avatar via existing `AvatarCreator` consent path.
- **Rollback:** revert merge. Onboarding writes use the existing profile schema, so no migration rollback. Kid Mode is a stateless overlay.
- **Specialist sign-off:** arbor-clinical-psych (copy), arbor-safety (consent/COPPA), arbor-sec (child-data path unchanged), arbor-qa, arbor-release, arbor-sre. **Guy confirms the gated merge.**

### Wave 4 — Day Windows + enrichment · AP-050, AP-052, AP-053 (safe); AP-051, AP-054 (GATED)
- **Branch:** `rel/arbor/redesign-w4-enrichment`
- **Gate checks:** green-gate + `check:floors` + smoke. AP-050 avatar fan-out: existing story/comic output unchanged (visual diff) + C2PA/SynthID at export preserved. **AP-051 (Day Windows) GATED** — arbor-clinical-psych non-predictive-framing pass; reads behavior log (child-data read, no write). **AP-054 (Language Lab) GATED** — arbor-clinical-slp non-screen-framing pass; reads language log. Both surface for Guy.
- **Blast radius:** AP-050/052/053 pure FE; AP-051/054 read-only over child data. Theme switching (AP-052) must hold WCAG AA on all 3 themes (manual contrast check).
- **Rollback:** revert merge per ticket; all additive views, no data migration.
- **Specialist sign-off:** arbor-clinical-psych (AP-051), arbor-clinical-slp (AP-054), arbor-design (AP-052 contrast, AP-050 parity), arbor-sec (read-only child-data), arbor-qa, arbor-release, arbor-sre. **Guy confirms AP-051/AP-054.**

**Cross-wave dependency:** AP-043 (tokens) is a HARD prerequisite for AP-044, AP-050, AP-052, AP-053, AP-054. AP-044 (shell) is prerequisite for all topbar/Kid-Mode tickets. No wave merges out of order.

---

## 4. Composite ship-verdict format (per PR)

DevSecOps returns exactly one block per redesign PR:

```
ARBOR REDESIGN SHIP-VERDICT — <AP-id> on <branch>
Green-gate:    lint ✅ | test ✅ | check:framework ✅ | eval:safety ✅ | check:floors ✅ | smoke:routes ✅
Floors:        F1 routes 35≥34 ✅ | F2 worlds 14≥14 ✅ | F3 journeys 10≥10 ✅ | F4 domains 7=7 ✅ |
               F5 milestones <n>≥133 ✅ | F6 Family tier ✅ | F7 scholars 8≥6 ✅ | F8 ledger append-only ✅ |
               F9 consent face/voice/training ✅ | F10 RTL/HE ✅ | F11 activities <n>≥250 ✅
Specialists:   arbor-sec <PASS/VETO> | arbor-qa <PASS/VETO> | arbor-release <PASS/VETO> | arbor-sre <PASS/VETO>
Gated reviews: <clinical-psych/clinical-slp/safety: PASS/N/A> (Wave 3/4 only)
Manual floors: <design visual-parity / HE-RTL reviewer / sec ledger-erase: signed/N/A>
VERDICT:       PASS → promote (Level-3, Guy confirms)   OR   VETO: <specialist> — <exact failing floor/evidence> → bounce to <pod> with fix
```

**Rules:** a single specialist or gated-review VETO blocks the ship — never override; bounce to the owning pod via the orchestrator with the exact fix. Any floor red = automatic VETO before specialists even look. Prod promote is Level-3 — never green-light without Guy's confirm. End every gate with a `mesh/MEMORY.md` entry: PASS/VETO + which floor/specialist + why.

---

## Return summary

**Floors LOCATED in code (assertable today):** F1 routes (`ArborContext.tsx:54/97`), F3 journeys (`heroJourneys.test.ts:31` already asserts 10), F4 domains=7 (`types.ts:33` + `framework.json`), F5 milestones (`milestoneData.ts` ALL_MILESTONES, test:73), F6 Family tier (`entitlements.ts:26`), F7 scholars (`scholars.ts`, 8 today), F8 ledger append-only (`memoryService.ts:82/101`, test:21), F9 consent (`types.ts:87`, all 3 purposes), F10 RTL/HE (`LanguageContext.tsx:46`, `i18n.ts:10`), F11 activities (`playbank/content.ts`).

**Floor needing a PROBE/EXPORT before clean automation:** F2 practice worlds — value is present and correct (`HeroArcade.tsx:69`, exactly 14) but `WORLDS` is module-local; needs a one-line EXPORT (non-functional) to be importable by the floor script. Interim: brittle grep-count. F1 and F11 also benefit from an `ALL_TABS` / activity-count export (§1a).

**Gate additions:** `npm run check:floors` (new `scripts/capability-floors.mjs` asserting F1–F11) appended to the existing `lint && test && check:framework && eval:safety` green-gate; plus `npm run smoke:routes` (34-route reachability + HE/RTL + mobile-nav + AP-043 visual diff) run in canary.

**Floors that CANNOT be fully automated (need a manual reviewer):** F8 in-place-erase check (arbor-sec), F9 consent-UX correctness (arbor-sec + arbor-safety), F10 RTL visual correctness on the new shell (arbor-qa HE reviewer), F4/F5 clinical FRAMING for AP-049/051/054 (arbor-clinical-psych/-slp), and AP-043 visual-parity adjudication (arbor-design). Presence is machine-checked; semantics are human-vetoed.

---

## 5. Additional Floors F12..F18 — Behavioral / Runtime Capability Holes (2026-06-23)

**Source:** `AUDIT-regression-holes.md` (arbor-evaluator adversarial regression audit, 2026-06-23). The original gate (F1–F11) protects content counts and enum presence well but is structurally blind to behavioral/runtime capabilities — the safety, consent-enforcement, voice, image, sharing-access, and export surfaces. These are exactly the surfaces a "reskin to the prototype" PR can strip silently, because the prototype never shows them. Floors F12–F18 close the structural gap.

**Root-cause principle:** F1–F11 assert *how much content shows*; F12–F18 assert *does the behavior still run*. A prototype-reskin PR that keeps all tab routes and enum strings but guts the enforcement middleware, screening logic, or export capability will pass F1–F11 and fail every F12–F18 assertion. These floors are the second spine of the gate.

**F12 note for F2:** `WORLDS` in `HeroArcade.tsx` is module-local (§1a). Before F12's composite gate script can import F2 alongside F12–F18, the non-functional EXPORT (§1a probe action) must land in Wave 1. This is a code-shape task, not a behavior change — the export must be present in Wave 1.

---

| # | Floor | Canonical source | Automatable | riskClass | Manual reviewer |
|---|---|---|---|---|---|
| F12 | Safety screening present + wired | `src/safety/escalation.ts`, `src/safety/outputScreen.ts`, `routes/api.ts` `/api/chat` | Static presence + import-chain grep | **gated** | **arbor-safety** signs that the output screen still sits on the live coach path (script sees the import; human confirms it is not short-circuited) |
| F13 | Consent gate enforced on capture routes | `src/server/requireConsent.ts`, `routes/api.ts`, `server/createApp.ts` | Import/wiring assertion + behavioral test (capture request with no active consent returns HTTP 451) | **gated** | **arbor-sec + arbor-safety** — consent UX correctness (parity with F9 note) |
| F14 | Sharing access model preserved | `src/sharing/shares.ts` `ShareRole` union, `isShareActive`, read-path wiring | Static type-shape assertion + `shares.test.ts` + `sharesErase.test.ts` behavioral anchor | **gated** | **arbor-sec** — confirms server-enforced expiry still gates reads (not client-filtered) |
| F15 | Voice I/O affordance present on coach | `src/lib/speech.ts` `startDictation`, `src/lib/tts.ts` `speak`, `CoachTab.tsx` import | Import/wiring assertion — both modules imported by CoachTab | safe | arbor-qa — visual confirm mic control renders when `speechSupported()` |
| F16a | Image-gen path present | `src/lib/image.ts` export, `routes/api.ts` image endpoint | Static presence assertion | safe | — |
| F16b | C2PA/SynthID provenance preserved at export | Export path in `lib/image.ts` / `routes/api.ts` | Static-presence assertion on C2PA/SynthID step at export | **gated** | **arbor-sec** — confirms provenance signature survives every new avatar fan-out surface (per-surface manual confirm on AP-050 wave) |
| F17 | Handoff export present | `src/lib/reportExport.ts` `ReportDoc` + `ReportType` exports, consult/handoff route wiring | Import/wiring assertion + missing behavioral test: report generates non-empty sections from a sample child | safe | — |
| F18a | Corrected-age export present | `src/lib/milestoneData.ts` `CorrectedAge` / preterm-correction export | Static presence | safe | — |
| F18b | Behavior-log field shape preserved | `src/types.ts` `BehaviorLog` type | Static type-shape assertion: intensity + context + trigger + response + photo + co-regulation-script fields present | safe (framing-gated for copy changes) | arbor-clinical-psych / -slp for any copy change touching these fields |
| F18c | Screening export present + tested | `src/lib/screening.ts` screener export | Static presence + missing behavioral test: screener produces output from sample input | safe | — |

### Floor details

**F12 — Safety screening present + wired (CRITICAL / gated)**
- Assert `src/safety/escalation.ts` exports the escalation screener AND `src/safety/outputScreen.ts` exports `OutputScreenVerdict`.
- Assert the coach API path (`routes/api.ts` `/api/chat`) imports the output screen — grep/import assertion that the screen sits between model output and response serialization.
- Keep `eval:safety` as the behavioral half (output quality). F12 is the structural half (presence + wiring).
- **arbor-safety manual sign-off required per wave** — not a one-time clearance. Any wave touching the coach chrome (AP-044 shell, AP-053 copilot) re-confirms F12.
- B-17 prose protect-note is not a floor. This assertion replaces reliance on prose alone.

**F13 — Consent gate enforced on capture routes (CRITICAL / gated)**
- Assert `requireConsent` is imported and applied to every route that captures face/voice/training data (avatar generation, voice dictation, any image-from-photo path).
- Add the missing behavioral test: a capture request with no active consent for the matching `ConsentPurpose` returns HTTP 451. Fills the missing `requireConsent.test.ts`.
- F9 (enum presence) remains but is explicitly NOT sufficient to pass this floor — F13 asserts the enforcement middleware is wired, not just that the enum exists.
- Closes the gap flagged in AUDIT-gates.md: "avatar creation (AP-049 Step 4) cannot fire AvatarCreator before the COPPA/GDPR consent is recorded."

**F14 — Sharing access model preserved (gated)**
- Assert `ShareRole` union contains `co_parent`, `viewer`, `professional` (static, like F9).
- Assert `isShareActive` is exported and applied on the read path (server-enforced expiry, not client-filtered).
- Behavioral anchor: `shares.test.ts` and `sharesErase.test.ts` (already exist) — F14 requires they pass AND that `isShareActive` wiring is asserted.
- Closes the gap between F6 (billing seat count) and actual access-model enforcement.

**F15 — Voice I/O affordance present on coach (safe)**
- Assert `speech.ts` `startDictation` and `tts.ts` `speak` are imported by `CoachTab.tsx`.
- Optional smoke: coach view renders a mic control when `speechSupported()`.
- Priority: AP-044 (shell) is the highest-risk wave for this surface — F15 must be in the Wave 1 gate for that reason.

**F16a + F16b — Image-gen path + C2PA provenance (safe / gated split)**
- F16a: Assert `lib/image.ts` image-generation export exists — safe, auto-assertable.
- F16b: Assert the C2PA/SynthID tagging step exists on the export path. This promotes the AP-050 note into a standing floor — guards every wave, not just AP-050.
- arbor-sec signs F16b per wave touching AP-050 fan-out surfaces (8 surfaces, per-surface manual confirm).

**F17 — Handoff export present (safe)**
- Assert `reportExport.ts` exports `ReportDoc` and `ReportType` AND they are wired into the consult/handoff path.
- Add the missing test: report generates non-empty sections from a sample child fixture.
- Closes the gap between F1 (consult tab exists) and the capability inside the tab.

**F18 — Clinical-content shape preserved (safe / framing-gated for copy)**
- F18a: `CorrectedAge` / preterm-correction export in `milestoneData.ts` — covers B-3, AAP corrected-age requirement.
- F18b: `BehaviorLog` type in `types.ts` retains all 6 fields — covers B-4 "do not strip the behavior log" protect note.
- F18c: `screening.ts` screener export exists + missing behavioral test added — covers Bucket-C "KEEP LIVE" note.
- Framing-gated caveat: F18b is a static type floor (safe for presence); any copy change on the behavior-log fields requires arbor-clinical-psych/-slp sign-off (same as F4/F5 framing note).

### Updated composite gate command

```bash
cd app && npm run lint && npm test && npm run check:framework && npm run eval:safety && npm run check:floors
```

`check:floors` now asserts F1–F18. F12/F13/F14/F16b require manual reviewer sign-off (see table above); the presence/wiring assertions are machine-checked, the semantic/enforcement confirmation is human-vetoed.

### Updated ship-verdict format (add to §4)

```
Floors F12-F18: F12 safety-wired ✅/❌ | F13 consent-enforced ✅/❌ | F14 sharing-access ✅/❌ |
                F15 voice-IO ✅/❌ | F16a image-gen ✅/❌ | F16b C2PA ✅/❌ |
                F17 handoff-export ✅/❌ | F18a corrected-age ✅/❌ | F18b behavior-fields ✅/❌ | F18c screening ✅/❌
Manual F12-F14/F16b: arbor-safety/arbor-sec sign-off: <signed/N/A>
```

F12, F13, F14 are CRITICAL/gated — a red on any of these three is an automatic VETO before specialists look, identical to a safety veto. They protect the three Bucket-B "non-negotiable / do-not-weaken" surfaces that had zero floor before this audit.

---

**Spec written to:** `C:/Users/dguyr/ROS/PAI/PRDs/arbor-redesign-handoff/_analysis/NO-REGRESSION-GATE.md`
