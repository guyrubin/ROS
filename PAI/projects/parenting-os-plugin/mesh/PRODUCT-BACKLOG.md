# Arbor Product Backlog — the one scored queue

**Owner:** Product Council (PAI). Canonical body is curated by a human / the Orchestrator. The council loop **appends** dated `## Council Intake` candidate blocks below; it never clobbers the body. Promotion into a live track is a deliberate step. See [PRODUCT-COUNCIL.md](PRODUCT-COUNCIL.md).

> **Canonical role (release-engineering, 2026-06-22):** this is the **one canonical Arbor Product backlog** a release train pulls from (`REL-ARBOR-*`). Promoted items take an **`AP-`** id and back-reference their origin (`from: CIL-… / DEM-… / market lens`). The **[CIL IMPROVEMENT-BACKLOG](improvement/IMPROVEMENT-BACKLOG.md)** and the Council Intake blocks below are **feeders** — a finding is a candidate until promoted here with an `AP-` id; it is never tracked live in two places. Ready-bar + identity rules: [BACKLOG-MODEL.md](../../../../00_System/release-engineering/BACKLOG-MODEL.md). Any item carrying a developmental/medical/effect-size claim needs a row in the [claim register](../../../../00_System/release-engineering/CLAIM-REGISTER.md) and ships **dark** (flag OFF) until signed.

---

## Council Intake — 2026-06-24 (Clinical PROD-GATE — CI-28/29/30/31 + LANG-15 shipped-code review)

**Reviewer:** `arbor-clinical-lead` (board), lenses: peds / slp / psych (synthesized). **Binding.** **Scope:** the ACTUAL committed strings/code on branch `claude/arbor-10-capabilities` (app repo `PPPPtherapy-/`, files under `app/src/`), reviewed against `improvement/CLINICAL-GUARDRAILS-CI-22-23-24.md` + the firewall (advisory.md §0). This is a prod-deploy gate on real strings, not a spec review.

**Net verdict: all 5 are clinically clear to ship to production. No veto, no unsubstantiated claim, no blocker. Two optional polish notes (non-blocking).**

| Item | soundness | claims | riskClass | Verdict |
|---|---|---|---|---|
| **CI-28** Goal Builder | **pass** | none | safe | **PASS** — ship |
| **CI-29** Interest Personalization | **pass** | none | safe | **PASS** — ship |
| **CI-30** Daily Plan Generator | **pass** | none | safe | **PASS** — ship |
| **CI-31** Duration chips | **pass** | none | safe | **PASS** — ship |
| **LANG-15** Word World | **pass** | substantiated (provenance/mechanism only) | safe | **PASS** — ship |

**Per-item evidence (shipped code):**
- **CI-28** (`practice/goalBuilder.ts`, `components/practice/GoalBuilderModal.tsx`, `GoalBuilderPromptCard.tsx`): 8 `GOAL_TILES` are behavior/situation/competency nouns; `CONCERN_TO_GOAL_PREFILL` highlights, never auto-selects (gate §D). Module-load lint blocks condition names, effect-verbs, verdict strings. Observation display is a flat integer + timestamp (gate §B) — no %, ring, streak, trend. Prompt-card copy "What are you working on with [name] right now?" is non-diagnostic. Clean.
- **CI-29** (`playbank/select.ts` + `components/overview/DailyPlayCard.tsx` + i18n L95–101): `sanitizeInterestToken()` runs the `CONDITIONS_RE` (shared outputScreen lexicon) AND a dedicated `BANNED_INTEREST_TOKENS_RE` (restricted/repetitive/narrow/fixation/obsession/perseveration/hyperfocus/special interest) → a banned token neutralizes to empty, so a condition or autism-coded interest descriptor can never reach card copy. Why-lines are provenance only ("Chosen because [name] loves [interest] — and because it fits this stage"), no effect-verb on the child, parent-facing not kid-companion. Interest boost is a relevance re-rank (1.3×), developmental content byte-identical. Clean.
- **CI-30** (`practice/dailyPlan.ts` + `components/overview/DailyPlanCard.tsx` + i18n L568–579): every why-line template ends in the firewall line "Developmentally informed, grounded in CDC/AAP/ASHA/WHO" — never "clinically validated/reviewed." Module-load lint (`EFFECT_VERBS_RE` + `COMPREHENSION_TOKENS_RE`) guards the templates; assembled strings additionally pass `screenModelOutputLexical` at runtime and fall back to the sparse line if flagged (screenHookRequired honored). Post-activity observation is parent-attributed free text (≤200 chars), never aggregated into a score/%/"on track"/"goal achieved." Language-domain goals do NOT auto-fire any referral/communication copy. COPPA: `goalObservations` write path tagged for arbor-safety (see note below). Clean.
- **CI-31** (`playbank/select.ts` SESSION_LENGTH + `components/practice/SessionLengthChips.tsx` + i18n L108–112): chip copy is claim-free time-budget language ("Quick (8-10 min)" / "Standard (15 min)" / "Extended (25-30 min)", eyebrow "Time I have today"). No child-data write, no developmental claim. Clean.
- **LANG-15** (`practice/wordWorld.ts` + `components/practice/WordWorldTab.tsx` + i18n L561–566): 3 modules are serve-and-return / narrated play / shared reading with mechanism-only descriptions ("daily back-and-forth … is how young children build communication — these activities give you structured moments to do that") — mechanism, NO effect-size, NO intervention claim. NO branded program anywhere (no Hanen/OWL/Triple P/ESDM). Source framing string = "developmentally informed, grounded in CDC/AAP/ASHA/WHO" — never "clinical." CI-25 referral rail verbatim, always-visible, never auto-fired; ASHA-scope-safe. Prompt bank 100% static (no model authorship). Parent-only surface (no kid-companion). PracticeEvent logs the parent's action, never a child-language-output metric. Clean.

**cited_basis:** CDC LTSAE 2022 (Zubler et al., Pediatrics 2022); AAP surveillance-vs-screening (Lipkin/Macias 2020); ASHA SLP Scope of Practice + public developmental norms; WHO milestones; firewall advisory.md §0 / CHARTER §3 p11. Serve-and-return / shared-reading mechanism = CDC/AAP/ASHA public guidance (surfaced as mechanism only; Hanen et al. evidence bases stay back-end, uncited).

**Optional polish (NON-BLOCKING — does not gate the deploy):**
1. The pre-existing Daily Play content layer renders `Builds: {whatItBuilds}` (i18n `play.builds` = "Builds:" / "מחזק:"). The `whatItBuilds` strings describe what the *activity* offers ("Words for feelings…", "Smoother stops and switches…") — activity affordance, within the claim ceiling, NOT a measured effect-size on the child. Predates these 5 capabilities (core content layer). No fix required to ship; if ever reworded toward "this improves your child's X" it would cross the ceiling — flagged for the content layer's own future review, not this gate.
2. The two `setChatInput` coach-shortcut strings in `DailyPlayTab.tsx` (L102, L115) prefill the parent's own outbound chat message with "(it builds {domain})". This is the parent's draft message to the coach, not an Arbor claim surface, and "builds {domain}" reads as activity-purpose. Acceptable as-is; could be softened to "(it's a {domain} activity)" for full belt-and-suspenders consistency. Non-blocking.

**COPPA hand-off (parallel, not a clinical blocker):** CI-28 `activeGoals` and CI-30 `goalObservations` are new child-data write paths. These carry the standard `arbor-safety` COPPA review on the write path (reusing CI-23/24/28 precedent) — a safety gate that runs alongside, not a clinical-soundness blocker. Clinical board raises no objection to the data model.

**Routing:** No item routed to `arbor-orchestrator` as a block. All 5 cleared for the prod-promotion decision. Filed to council intake + memory note.

---

## Council Intake — 2026-06-21 (Clinical GATE — DEM-003 Physical Growth Tracking — Height / Weight / WHO Percentile)

**Reviewer:** `arbor-clinical-lead` (board), lenses: peds (primary) / psych / slp (n/a). **Binding.**

| ID | Title | Stream | riskClass | Clinical | Advisor | Owner pod | Note |
|----|-------|--------|-----------|----------|---------|-----------|------|
| DEM-003 | Physical Growth Tracking — Height/Weight/WHO percentile (append-only log + timeline) | demand | **gated** | **soundness: concerns** / claims: **UNSUBSTANTIATED** (raw WHO percentile surfaced as a health/developmental read) | tension | arbor-growth | **HELD** — append-only own-curve log is sound; percentile-as-headline + missing chart-switch + unenforced corrected-age dep is an unsubstantiated medical-interpretation claim |

**Verdict:** soundness: **concerns** · claims: **UNSUBSTANTIATED** · riskClass: **gated** → **HELD** (not build-ready). Not a full VETO — the capability is sound when built to the reframe; held because, as written, it surfaces a lone WHO percentile as a profile/timeline field (an implied medical-interpretation claim) and omits two non-negotiable soundness conditions.

**Why (board synthesis, lenses agree):**
- **peds (dispositive):** (1) **Chart selection is wrong as scoped.** AAP/CDC: WHO growth standards are the reference **birth–24 months**; CDC charts **age 2 onward**. A single "WHO percentile" field across a 0–12 product mislabels every child ≥2y. The engine must switch reference at 24 months. (2) **Corrected age (CLI-07) must land first.** AAP: plot preterm infants on **corrected age through ~24 months**. Raw-age plotting systematically reads a preterm infant as small/underweight — a structural false alarm. (3) **Single reading is noise.** AAP/CDC: a single percentile is a snapshot; only the **trend across ≥3 measurements over 6–12 months** is signal, and crossing **1–2 major percentile lines** in the first 2–3 years is *normal*. Any "worth discussing" signal must require multiple longitudinal points and the "two major lines over several visits" pattern — never a single-reading verdict.
- **psych:** A raw percentile surfaced as a headline number/rank is non-pathologizing **only** if it is never a verdict. "Underweight"/"falling behind"/"winning" flip truth→false-alarm and pathologize normal variation. Quiet trajectory context + "worth raising with your provider" is the attachment-safe, parent-mediated framing. The rubric reframe is a **required fix**, not optional.
- **slp:** not implicated.

**required_fixes:**
1. **Do not surface the percentile as a headline/score/rank.** Plot the child's **own curve over time**; percentile is quiet context for the trajectory, never a verdict.
2. **Reference-chart switch built in:** WHO standards 0–24 months, CDC charts from 24 months (AAP). A single "WHO percentile" field is non-compliant for ≥2y.
3. **CLI-07 corrected-age lands first** and feeds the plot, so preterm infants aren't plotted on raw age (AAP, corrected age to ~24 months).
4. **Trend/crossing logic, not single-reading:** any "worth discussing" signal requires ≥3 points over 6–12 months and a crossing of **2 major percentile lines over several visits**; a 1-line shift in the first 2–3 years is explicitly *normal* and must not flag.
5. **Copy is surveillance-not-diagnosis:** "a pattern worth raising with your provider," never "underweight"/"overweight"/"falling behind"/"ahead." No interpretation of a lone reading.
6. **arbor-safety** clears the child-health-data (COPPA/GDPR) schema before any field ships; height/weight ride the existing child-data consent/redaction path.
7. **Firewall §0 / §3 p11:** growth copy is "developmentally informed, grounded in WHO/CDC/AAP growth standards," never "clinically validated," no clinician/adviser/thinker identity.

**cited_basis:** CDC MMWR 2010 RR-9 (*Use of WHO and CDC Growth Charts for Children Aged 0–59 Months in the US* — WHO standards birth–24mo, CDC charts ≥2y); AAP corrected-age plotting for preterm infants through ~24mo; AAP/CDC growth-interpretation — a single percentile is a snapshot, trend over ≥3 points / crossing 2 major lines over several visits is the signal, 1–2 line shifts in the first 2–3 years are normal.

Cannot be build-ready until the percentile-as-verdict is removed, the WHO/CDC chart-switch + CLI-07 corrected-age land, the trend-not-single-reading mechanic is defined, and every word of copy returns soundness:pass. Routed to `arbor-orchestrator` as blocked-for-build (identical to an `arbor-safety` veto).

---

## Council Intake — 2026-06-21 (Clinical GATE — DEM-012 Memory-Adaptive Literacy Track for 3–8 Cohort: EarlyReadingTrack wired to child record)

**Reviewer:** `arbor-clinical-lead` (board), lenses: peds / slp (primary, phonological/literacy norms) / psych. **Binding.** Co-held with `arbor-safety`.

| ID | Title | Stream | riskClass | Clinical | Advisor | Owner pod | Note |
|----|-------|--------|-----------|----------|---------|-----------|------|
| DEM-012 | Memory-Adaptive Literacy Track (EarlyReadingTrack/literacy.ts wired to child record) | demand | **gated** | **soundness: concerns** / claims: **UNSUBSTANTIATED** ("readiness signal" = implicit developmental-assessment claim) | tension | arbor-practice | **HELD** — memory-adaptive core is sound and the strongest competence story in the demand stream, but "readiness signals surfaced to the parent" as written is an implicit reading-readiness *screen* — a developmental-assessment claim cited guidance does not support |

**Verdict**

- **soundness: concerns** — not a veto. The memory-adaptive engine is developmentally legitimate and the existing `literacy.ts` is already clean: its age guidance is explicitly framed as a *"typical range, never a diagnostic threshold"* (literacy.ts L9-10), `readingStagesForAge` *offers* age-appropriate stages without ranking, scoring, or verdicts, and there is no readiness score in the code today. The candidate is sound **only if** the new parent-facing layer preserves that stance. As written, "readiness signals surfaced to the parent" tilts toward a screen — which would be unsound, because literacy onset carries enormous normal variation (a 5-year-old not yet blending is typical, not behind) and reading-readiness is **not** a CDC/AAP surveillance milestone in this age band. A per-child "ready / not ready" verdict would fabricate a developmental threshold that cited guidance does not define.
- **claims: UNSUBSTANTIATED** — the candidate's own `claim` field names it: "readiness signals … carry implicit developmental assessment framing." A reading-**readiness** signal issued by software *is* an implicit developmental-assessment claim (Arbor can determine whether this child is ready to read). That is unsubstantiated: no public guidance (CDC/AAP/ASHA) supports an app issuing a reading-readiness determination, and phonological awareness is a gradient, not a pass/fail. This holds the item exactly like a safety veto until the framing is corrected to **parent-logged observation, never a screen**. No effect-size/outcome claim is asserted in the current text (good — hold that), so the block is the readiness-assessment framing specifically, not an efficacy claim.
- **riskClass: gated** — stands (touchesClinical + implicit developmental-assessment framing + parent-facing language). Never auto-built.

**Lens splits**
- **peds:** concerns/blocking-on-framing. Reading-readiness is not a CDC LTSAE milestone domain; surfacing a readiness verdict invents a threshold cited guidance does not support and pathologizes normal variation in literacy onset. The existing "typical range, never diagnostic" stance (L9-10) must extend verbatim to any parent-facing readiness copy.
- **slp (primary):** concerns/blocking-on-thresholds. Phonological awareness (rhyming → syllable → phoneme) emerges across ~3–7 with wide individual variation; ASHA frames these as emergent-literacy skills and reserves *diagnosis* of disorders for a qualified professional. A persistent, age-windowed plateau may legitimately read "worth raising with your provider," **never** "delayed"/"reading disorder." The age windows + any "ready" thresholds are clinical thresholds requiring `-slp` soundness:pass before build-ready.
- **psych:** concerns/blocking-on-metric. Time-in-track as north star trains "the app teaches my kid to read" (competence→dependence) and "are we ahead?" (reassurance-seeking). Shared book-reading with the parent is the highest-evidence early-literacy support; every adaptive step must route OUTWARD to the parent-child reading loop, never replace it.

**required_fixes (binding before build-ready)**
1. **Readiness = parent-logged observation, never a screen.** Surface the *behaviors the parent observed* ("you've noted [child] is rhyming and recognizing letters — here's where to lean in"), never a readiness score / verdict / rank / "is/isn't ready to read." Drop the word "readiness" as a noun Arbor issues; phonological readiness is a gradient the parent learns to read in their own child.
2. **Success metric = the child's own progression + a real-world reading habit** (letters recognized, books read together), NOT lessons-completed / minutes-in-track / streak.
3. **Every adaptive step routes outward to the shared activity** ("try this with [child] tonight") so the engine builds the parent-child reading loop, not app-reliance.
4. **Plateau, not delay.** Only a persistent, age-windowed plateau surfaces — as "worth raising with your provider," never "delayed"/"behind." Age windows + thresholds need `-slp` soundness:pass.
5. **No effect-size / outcome claim** anywhere ("helps your child read faster/better"). The track describes the developmental skill; it never asserts it treats, accelerates, or proves anything.
6. **Firewall §0/§3 p11** — all literacy/readiness copy is "developmentally informed, grounded in CDC/AAP/ASHA," never "clinically validated"/"reading-assessment"/"reading screen," and carries no adviser/thinker identity.

**cited_basis:** CDC "Learn the Signs. Act Early." (2022 milestone revision; Zubler et al. *Pediatrics* 2022;149(3):e2021052138) — surveillance milestones do not include a reading-readiness screen; reading is not a CDC milestone domain in this band. AAP developmental-surveillance — observe and refer, never label without formal evaluation. ASHA emergent-literacy / phonological-awareness scope — these are gradient skills with wide normal variation; diagnosis of a literacy/communication disorder requires a qualified professional, not software.

**Disposition:** **HELD** (not build-ready). Identical to an `arbor-safety` veto — routed through `arbor-orchestrator` as blocked-for-build. Clears when (a) the readiness framing is corrected to parent-logged observation (kills the unsubstantiated developmental-assessment claim), (b) `-slp` returns soundness:pass on the age windows + plateau thresholds, and (c) `arbor-safety` clears every word of parent-facing readiness/plateau copy.

---

## Council Intake — 2026-06-21 (Clinical GATE — DEM-004 Expert-Cited Activity Content)

**Reviewer:** `arbor-clinical-lead` (board), lenses: peds / slp / psych. **Binding.**

| ID | Title | Stream | riskClass | Clinical | Advisor | Owner pod | Note |
|----|-------|--------|-----------|----------|---------|-----------|------|
| DEM-004 | Expert-Cited Activity Content — citation fields on PlayActivity | demand | **gated** | **soundness: pass** / claims: **substantiated** | aligned | arbor-practice | **Cleared-but-gated (NOT a veto, NOT an unsubstantiated-claim hold).** Schema + ~15 populated sources already live in the build tree (`playbank/content.ts`); cited basis verified live (CDC LTSAE, Harvard Serve-and-Return, Whole-Brain Child — all real/stable). Selector grounds the *mechanism*, never asserts the activity *treats* the concern. Held by procedure: safe schema/render may land split-off; each NEW populated citation + render copy needs a per-source board pass before ship. |

**Verdict (DEM-004):** `soundness: pass` · `claims: substantiated` · `riskClass: gated` → **cleared-but-gated** (split: safe schema lands; populated citation copy is a human/per-source decision, not a build block).

**required_fixes:** (1) split — schema/render plumbing `safe` and may land; every populated citation stays gated until per-source soundness:pass. (2) Each citation = a verifiable door (source + org + scope + a real working link), never a credibility badge or implied effect size. (3) Personalization points at evidence *for the concern domain*; copy never asserts the activity treats/fixes/proves anything. (4) CDC/monitoring sources read "grounded in", never "recommended/endorsed/clinically validated by CDC". (5) Firewall §0/§3 p11 — "developmentally informed, grounded in CDC/AAP/ASHA", never "clinically validated"/"clinician-approved", no adviser/thinker identity; enforce "never fabricated / hidden when absent" in the render path. (6) Any future ASHA- or AAP-specific citation draws its own lens pass before populate.

**cited_basis:** CDC "Learn the Signs. Act Early." (cdc.gov/act-early; Zubler et al. *Pediatrics* 2022;149(3):e2021052138) · Harvard Center on the Developing Child "Serve and Return" · AAP developmental-monitoring stance · ASHA refer-don't-label.

---

## Council Intake — 2026-06-21 (Clinical GATE — DEM-009 Double-Aha Onboarding: Comic → Coach Answer → Daily Play → Rhythm Promise, <60s)

**Reviewer:** `arbor-clinical-lead` (board), lenses: peds / slp / psych. **Binding.** Co-held with `arbor-safety`.

| ID | Title | Stream | riskClass | Clinical | Advisor | Owner pod | Note |
|----|-------|--------|-----------|----------|---------|-----------|------|
| DEM-009 | Double-Aha Onboarding (first-run coach answer + Daily Play + Rhythm "promise", <60s) | demand | **gated** | **soundness: concerns** / claims: **UNSUBSTANTIATED** (day-zero Rhythm prediction) | tension | arbor-design | **HELD** — substance is sound, but the first-run Rhythm *promise* is an unearned developmental prediction (no record exists to ground it) + the onboarding coach copy carries unreviewed implicit developmental framing |

**Verdict**
- **soundness: concerns** — NOT a veto. Showing a real, personalized coach answer + a concern-tied Daily Play activity grounded in the parent's *own* child is developmentally legitimate (CDC surveillance model: observe the real child, prompt a real conversation). The hazards are bounded and fixable, not structural.
- **claims: UNSUBSTANTIATED** — the **first-run Rhythm "promise"** asserts a prediction about the child *before any of the child's record exists*. There is no data at day-zero to earn a pattern/prediction; an asserted promise is an unsubstantiated developmental/predictive claim and triggers the hold. Must become an honest **invitation** ("log the next few days and Arbor starts seeing [child]'s pattern"), where the prediction is earned by the record, never asserted.
- **riskClass: gated** — the unsubstantiated claim forces gating and **HOLDS the item**; it cannot be marked build-ready until cleared. Routed to `arbor-orchestrator` identically to an `arbor-safety` veto.

**Lens splits**
- **peds (blocking):** a first-run answer to a typed concern (e.g. "2yo barely talking") must NOT falsely reassure ("totally normal, nothing to worry about") nor imply a screen/verdict — CDC 2022 LTSAE is surveillance-not-screening; AAP developmental-surveillance = observe and refer, never label without formal evaluation. A day-zero answer is the worst surface for any developmental conclusion. The Rhythm prediction with zero data is a peds-validity failure.
- **slp (blocking-conditional):** if the concern is speech, the answer must not state an intelligibility/word-count verdict against ASHA windows on a single first-run input, and the Daily Play activity must NOT imply it *treats* a delay. ASHA scope-of-practice: diagnosis of communication disorders requires a qualified professional, not software.
- **psych (concerns on framing):** a slick <60s reveal *delivered at* the parent tilts competence→dependence ("the app dazzles me") and responsibility→comfort (reassurance-delivery), and risks pathologizing a normal concern into something "the app noticed." Sound only if the answer ends in **one parent-owned next step** (parent-mediated model), never a teaser that resolves after the paywall.

**required_fixes (binding before build-ready):**
1. Replace the Rhythm **"promise"** with an honest **invitation** — prediction earned by the record (log a few days), never asserted day-zero. This clears the UNSUBSTANTIATED claim.
2. The onboarding coach answer is a genuine answer to the concern the parent typed, ending in **one parent-owned next step** — never a teaser that resolves only after the paywall.
3. **Every word** of the first-run coach copy (and any concern→activity tie copy) returns `arbor-clinical-lead` soundness:pass + `arbor-safety` clearance before ship — zero effect-size / diagnostic / screen implication; no false reassurance; no "the app noticed/detected."
4. Reframe the success metric from activated/converted-in-<60s to **first-action-completed** (activity tried / question asked / first data point logged); speed is a fluency constraint, not the goal — so "saw the moat" and "took the first competent action" are the same moment.
5. **Firewall (§0 / CHARTER §3 p11):** "developmentally informed, grounded in CDC/AAP/ASHA," never "clinically validated"/clinician-reviewed; no adviser/thinker identity in any first-run copy.

**cited_basis:** CDC 2022 "Learn the Signs. Act Early." — surveillance, not screening; milestones prompt a parent–provider conversation, not an app verdict (Zubler et al., *Pediatrics* 2022;149(3):e2021052138). AAP developmental-surveillance — observe and refer, never label without formal evaluation. ASHA scope-of-practice — diagnosis of communication/developmental disorders requires a qualified professional, not software.

**Disposition:** HELD (not build-ready). Cannot clear until fix #1 (Rhythm invitation, not promise) lands AND every word of first-run coach copy returns soundness:pass + safety clearance. Routed to `arbor-orchestrator` as blocked-for-build, identical to an `arbor-safety` veto.

---

## Council Intake — 2026-06-21 (Clinical GATE — DEM-002 Proactive "Arbor Noticed" Weekly Alert Card)

**Reviewer:** `arbor-clinical-lead` (board), lenses: peds / slp / psych. **Binding.**

| ID | Title | Stream | riskClass | Clinical | Advisor | Owner pod | Note |
|----|-------|--------|-----------|----------|---------|-----------|------|
| DEM-002 | Proactive "Arbor Noticed" Weekly Alert Card | demand | **gated** | **soundness: concerns** / claims: **UNSUBSTANTIATED** ("non-diagnostic framing guarantee") | tension | arbor-growth | **HELD — not build-ready.** Mechanism sound (binary on_track/monitor, non-diagnostic, provider-nudge close); blocked by an unsubstantiated *guarantee* claim + built on the uncorrected-age artifact a weekly push would amplify. |

**Verdict (DEM-002):** `soundness: concerns` · `claims: UNSUBSTANTIATED` · `riskClass: gated` → **HELD** (routed to `arbor-orchestrator`, identical to an `arbor-safety` veto).

- **Why not a veto:** `monitoring.ts` is a well-built surveillance surface — binary (`on_track`|`monitor`), no score/probability/condition name, every note closes non-diagnostic + "discuss with your provider" (L162-166). This is the honest-signal substance of CLI-03/PHI-10. The mechanism passes; the *claim* and the *delivery dependencies* do not.
- **Block 1 — unsubstantiated claim:** the candidate's own `claim` asserts a *"non-diagnostic framing guarantee."* A guarantee on AI-generated, parent-data-derived weekly copy is unsubstantiated — non-diagnostic framing is **board-verified per template**, never product-guaranteed. Downgrade the language before ship.
- **Block 2 — built on a known false-alarm artifact:** `deriveMonitoring` derives `ageMonths` from raw `input.ageYears` (L181) and never calls corrected-age (`comparisonAgeMonths`, engine present-but-unused at `milestoneData.ts` L316/L339 — the CLI-01 bug). Passive on the Screening tab this is latent; **pushed weekly it manufactures and delivers a preterm false-alarm unprompted** (contra AAP corrected-age-to-24mo).
- **Lens splits:** peds = concerns/blocking (corrected age first; card must not escalate the source note's urgency/specificity). slp = pass/conditional (carry source copy verbatim; never compress to "language delay" in headline/subject — ASHA refer-don't-label). psych = concerns/blocking on framing (a weekly signal *pushed at* a parent pathologizes-by-recurrence and inverts the parent-mediated model).

**required_fixes:**
1. Downgrade "non-diagnostic framing guarantee" → per-template board sign-off on every word of card + digest copy before ship.
2. Hard deps land first: **CLI-01 + CLI-07** (corrected age into the monitoring path) and **CLI-02** (windowed dev-score); **CLI-03** too if any CDC hard-stop set is surfaced (its thresholds are still being corrected).
3. Parent-**opened** calm weekly digest, not an interruptive push; success metric = parent-action-taken / real conversation, NOT opens / DAU / sessions.
4. Every card ends in one parent-owned next step (observe X / a question to ask / when to involve a provider).
5. Surface honest signals including a worth-discussing one; never a curated "everything's lovely" reel tuned for opens.
6. Firewall §0/§3 p11 — "developmentally informed, grounded in CDC/AAP/ASHA," never "clinically validated"/clinician/thinker identity.

**cited_basis:** CDC 2022 "Learn the Signs. Act Early." surveillance-vs-screening (Zubler et al., *Pediatrics* 2022;149(3):e2021052138) · AAP corrected-age-to-24-months · ASHA refer-don't-label.

> **Build-ready only when:** the guarantee claim is downgraded AND CLI-01/CLI-07/CLI-02 (and CLI-03 if used) land AND every word of card/digest copy returns `soundness: pass`.

---

## Council Intake — 2026-06-21 (Clinical GATE — CLI-07 corrected-age capture + display in onboarding/profile)

**Reviewer:** `arbor-clinical-lead` (board), lenses: peds (primary) / slp / psych. **Binding.**

| ID | Title | Stream | riskClass | Clinical | Advisor | Owner pod | Note |
|----|-------|--------|-----------|----------|---------|-----------|------|
| CLI-07 | Corrected-age capture + display (AAP 24-month ceiling) | clinical | **gated** | **soundness: pass** / claims: none | aligned | arbor-growth | sound; held only by procedure (clinical-threshold sign-off + child-data capture + firewall copy) — NOT a claim block |

**Verdict**
- `soundness: pass` — not a veto. The `(40 − gestationalWeeks)` correction and the 24-month ceiling are the standard AAP method and are **already implemented & test-covered** in `lib/milestoneData.ts` (`correctedAge()`, `CORRECTION_CEILING_MONTHS = 24`, `TERM_WEEKS = 40`). CLI-07 is capture/display UX on validated math.
- `claims: none` — no developmental-benefit/outcome/effect-size claim. "Corrected age" is a methodological adjustment grounded in AAP, not an effect claim.
- `riskClass: gated` (stands) — `touchesClinical` (child-data capture of gestation + a developmental-correction rule that sets clinical thresholds). Held from auto-build for a human decision; cleared on soundness, NOT blocked.

**required_fixes (build-ready conditions)**
1. Copy firewall: corrected-age UI reads **"developmentally informed, grounded in AAP guidance"** — never "clinically validated," "clinician-reviewed," or any adviser/thinker identity.
2. Gestation prompt is **gentle and optional** — never a hard gate, never alarmist; framed as "helps us compare your child's milestones fairly," not risk language.
3. The corrected-age badge adjusts *which checklist applies* only; UI must NOT present it as a developmental verdict/score.
4. Keep the existing engine as the single source of truth (do not re-implement the math in the component); ceiling stays 24 months, correction floored at 0.
5. Parent-mediated only — no kid-facing surface; gestation is sensitive child-health data → confirm it rides the existing child-data consent/redaction path.

**cited_basis:** AAP / HealthyChildren.org "Corrected Age For Preemies" (use corrected age for developmental comparison through ~24 months, then chronological); AAP *Pediatrics* 2023 "Primary Care Framework to Monitor Preterm Infants" (correct until at least 24 months corrected age); ASHA developmental norms (speech/feeding milestones compared against corrected age in preterm infants).

**Routing:** soundness PASS, claims none → no orchestrator block. Remains `gated` (child-data + clinical-threshold sign-off + firewall) → surfaces as a Guy decision before build, per the clinical gate.

---

## Council Intake — 2026-06-21 (Clinical GATE — CLI-04 SLP referral-timing prompt)

**Item reviewed:** CLI-04 — SLP referral-timing prompt in Practice Studio tied to ASHA intelligibility windows. Surface: `app/src/lib/speechScorer.ts` + `practice/`. Tie a persistently-low intelligibility trend to "consider a speech-language assessment." `touchesClinical:true`, `riskClass:gated`.

**Lenses dispatched:** `arbor-clinical-slp` (intelligibility norms, threshold, referral timing — lead), `arbor-clinical-peds` (escalation-threshold sanity), `arbor-clinical-psych` (non-pathologizing parent-facing copy). Grounded against the live `speechScorer.ts` (confirmed: it scores single utterances correct/approx/incorrect via cloud phoneme or on-device lenient matcher, and emits NO longitudinal trend and NO referral nudge — the candidate's premise is accurate).

**Board verdict (binding clinical gate):**
```
soundness: concerns        # the FEATURE is sound and competence-building; the CITED THRESHOLD VALUES are wrong → not build-ready until corrected. Not a full VETO.
claims: UNSUBSTANTIATED([
  "~50% understandable by 2y, ~75% by 3y" — these are the OUTDATED parent-impression rule-of-thumb numbers (Lynch 1980 / Coplan & Gleason 1988). Current ASHA-published evidence (Hustad et al., JSLHR 2021;64(8):3093-3108) revises these >1 year LATER: average (50th pct) single-word intelligibility reaches 50% at ~31 months and 75% at ~49 months; multiword 50% at ~34m, 75% at ~46m. A referral prompt firing on "<50% at 2y" against the old norm is a structural FALSE-ALARM / over-referral generator that pathologizes the large normal variation in intelligibility onset — exactly what the board vetoes.
  "persistently low intelligibility" as an Arbor-derived referral threshold — no defined trend window, sample-count floor, or grace period is specified, and the on-device lenient matcher / single-target accuracy is NOT a validated connected-speech intelligibility measure. Asserting a referral threshold off it claims a screening validity we have not established.
  Any implied developmental-benefit / "catches delays earlier" / effect-size claim from the prompt — none is substantiated and none may be stated. (The rationale's "no effect-size/benefit claim" instinct is correct; hold it.)
])
riskClass: gated           # HELD — carries unsubstantiated developmental thresholds; cannot be build-ready until cleared
required_fixes:
  1. Correct the cited windows to CURRENT ASHA-published norms (Hustad et al. 2021), not the Lynch/Coplan rule-of-thumb. Anchor the referral signal to the CONSERVATIVE 5th-percentile / lower-bound-of-typical, not the 50th pct, so the prompt fires for genuinely concerning trajectories (e.g. <50% single-word intelligibility persisting toward ~46m+), never for the average late-blooming 2yo.
  2. Pair the intelligibility signal with ASHA's plainer, more defensible parent-facing anchors rather than a raw % the app cannot truly measure: "by ~3y, familiar listeners understand most of what your child says; by ~4y, unfamiliar listeners do too." Use these as the discussion trigger, not an app-computed intelligibility percentage.
  3. Define the trend mechanic explicitly (minimum N attempts, a real time/grace window, age-windowing) and state in copy that Arbor's score is practice accuracy, NOT a measured intelligibility percentage or a screen.
  4. Copy is surveillance-not-diagnosis: "a signal worth raising with your provider / consider a speech-language assessment," NEVER Arbor interpreting, labeling, or issuing a delay verdict. If it hardens into a verdict it flips truth→false-alarm (clinical veto).
  5. Firewall §0/§3 p11: "developmentally informed, grounded in ASHA," never "clinically validated"/"speech assessment"; no adviser/thinker identity.
cited_basis: [
  ASHA Practice Portal — Speech Sound Disorders: Articulation and Phonology;
  Hustad, Mahr, Natzke & Rathouz (2021) "Speech Development Between 30 and 119 Months in Typical Children I: Intelligibility Growth Curves," JSLHR 64(8):3093-3108 (the current, ASHA-journal-published revision of the older rule-of-thumb);
  ASHA developmental norms (familiar listeners ~3y, unfamiliar ~4y)
]
```

**Why concerns, not VETO, and not pass:** The feature is the right one — a scorer that only measures accuracy and stays silent is a comfort tool; naming a persistently-low trend and routing the parent OUT to a real SLP is competence-building and rubric-aligned (advisory scored it `aligned`). But the SPECIFIC cited thresholds are the discredited parent-impression numbers, and building a referral trigger on "<50% at 2y" would over-refer a large slice of typically developing children — false alarm is a vetoable soundness defect. It is `concerns` (not full VETO) because the fix is bounded: swap the threshold values to current ASHA-published norms and the conservative lower bound, define the trend mechanic, hold the copy. It is NOT `pass` and CANNOT be `build-ready` until `arbor-clinical-slp` re-confirms the corrected windows and the exact referral copy. Routed through `arbor-orchestrator`, identical to an `arbor-safety` veto.

---

## Council Intake — 2026-06-21 (Clinical GATE — CLI-03 surface CDC "Act Early" red-flags non-alarmistly)

**Item reviewed:** CLI-03 — Add a calm, time-sensitive "worth discussing soon" prompt for the small CDC hard-stop set (loss of skills, no words by ~16m, no joint attention/gestures, not walking by ~18m) to `deriveMonitoring` in `monitoring.ts`, which today only catches past-band milestones (2-month grace) + behavior clusters. `touchesClinical:true`, `riskClass:gated` as filed. 3 lenses dispatched (peds/SLP/psych), grounded against live `monitoring.ts` + verified against CDC's 2022 "Learn the Signs. Act Early." milestone set.

**Board verdict (binding clinical gate):**
```
soundness: concerns           # direction is sound + genuinely needed (the surveillance gap is real); NOT a veto. Two thresholds in the candidate's own example copy misstate the 2022 CDC set and MUST be corrected before build-ready.
claims: UNSUBSTANTIATED        # the example threshold "no single words noted by ~16 months" is not a current CDC LTSAE benchmark — it is the retired DSM-era autism red-flag; surfacing it as CDC-grounded is a false-provenance developmental claim. Holds the item.
riskClass: gated              # forced to gated (unsubstantiated claim + touchesClinical + every word of urgency/escalation copy unwritten) → HELD, not build-ready
```

**Why HELD (the load-bearing finding):**
1. **The "~16 months / no words" threshold is wrong as a CDC anchor.** CDC's **2022** LTSAE revision (Zubler et al., *Pediatrics* 2022;149(3):e2021052138) sets language benchmarks at the **75th percentile** and **deliberately removed** the old autism-specific "no single words by 16 months / no two-word phrases by 24 months" red-flag list from the consumer milestone tool. The current CDC set is: **15 months** — "tries to say one or two words besides mama/dada"; **18 months** — "tries to say three or more words besides mama/dada" + "follows one-step directions." So the honest CDC-grounded hard-stop is closer to **"no words besides mama/dada by 18 months"**, not "~16 months." Citing ~16m as CDC misstates the evidence (false alarm + false provenance) → the unsubstantiated-claim block.
2. **"Not walking by ~18 months" is directionally right but must be cited precisely.** CDC 2022 lists "walks without holding on to anyone or anything" as an **18-month** milestone (75th pct). "Not walking by 18 months" is therefore a defensible *worth-discussing* prompt — but it is a 75th-pct milestone-not-met, not a diagnostic hard-stop; copy must say so.
3. **"Loss of skills, at any age" is the one true universal hard-stop — keep it, cite it cleanly.** CDC explicitly: "If your child has lost skills he or she once had… act early and talk with your child's doctor." This is age-agnostic and the strongest item in the set. (Note: `deriveMonitoring` today has **no regression detector at all** — the candidate's premise that monitoring catches "acute regression via regex" is not borne out by the code; the loss-of-skills path must actually be built, not assumed.)
4. **Joint attention / gestures:** CDC 2022 anchors "points to show you something interesting" at **18 months** and "looks at a few seconds of a video with you" / social referencing across 12–18m. Defensible as an 18-month worth-discussing prompt; do **not** present absence as "screens for autism."

**required_fixes (clear-to-build conditions):**
- Correct every threshold to the **verified CDC 2022 75th-pct set**: words → tie to **18 months** ("no words besides mama/dada"), not ~16m; walking → 18m; pointing/gestures → 18m; loss-of-skills → any age. peds signs off the exact ages/windows.
- **Drop all retired DSM-era autism red-flags** (16m/24m language rule) and never name the condition a sign screens for — surface the **missing behavior only** ("no single words noted by ~18 months"), per the module's existing non-diagnostic binary.
- **Hard dependency on CLI-01 + CLI-07 (corrected age).** `deriveMonitoring` runs on raw `input.ageYears` (L181); a preterm infant would be urgency-flagged on chronological age (AAP, correct to 24m). Ship after corrected-age lands — same dependency that held PHI-10.
- The loss-of-skills detector **must be implemented**, not assumed; it is the highest-value, most-cited element and is currently absent from the code.
- **SLP scope (ASHA):** the language threshold + any "say X words" wording is SLP-owned — frame as a referral-worthy *observation*, not a verdict; pairs with CLI-04.
- **Psych scope:** non-pathologizing framing; absence of joint attention is "worth a conversation," never "a sign of autism."
- **Tone:** "worth a conversation in the next few weeks," never "regression detected"/"red flag"/"overdue."
- **Firewall (CHARTER §3 p11):** all copy "developmentally informed, grounded in CDC 'Learn the Signs. Act Early.' (2022)," never "clinically validated"/"clinician-reviewed"; no adviser/thinker identity.

**cited_basis:** CDC LTSAE 2022 milestone checklists, 15- & 18-month (Zubler et al., *Pediatrics* 2022;149(3):e2021052138); CDC "Concerned about your child's development?" (loss-of-skills = act-early, any age); AAP/Bright Futures well-child schedule + AAP preterm corrected-age (correct to 24 months); ASHA early-language norms.

**Disposition:** HELD — clears when (a) thresholds corrected to the CDC 2022 set + re-passed by peds/SLP, (b) the false ~16m/DSM claim is dropped, (c) CLI-01/CLI-07 land first, (d) the loss-of-skills detector is actually built. Routed to `arbor-orchestrator` as a blocked-for-Guy item, identical to an `arbor-safety` veto. This is the threshold sign-off PHI-10 and DEM-002 were each held pending.

---

## Council Intake — 2026-06-21 (Clinical GATE — PHI-02 reframe 'Arbor Noticed' as a parent-agency briefing)

**Item reviewed:** PHI-02 — Reframe "Arbor Noticed" from a retention/push alert into a weekly parent-agency briefing ("here is what the record shows + one thing you can do"), growth pod. Weekly proactive card grounded in the child's own monitoring signal. `touchesClinical:true`, `riskClass:gated` as filed.

**Board verdict (binding clinical gate):**
```
soundness: concerns           # sound direction; copy gate required before build-ready; NOT a veto
claims: none                  # the candidate as filed asserts no developmental/medical/effect-size claim — it is a delivery/framing change over an already-affirmed-sound signal
riskClass: gated              # touchesClinical + briefing copy is unwritten and sits one sentence from an implied developmental read → HOLD build-ready until copy signed off
required_fixes:
  - The signal it surfaces MUST remain the affirmed-sound surveillance signal (monitoring.ts `pickHighestWatchSignal`, surveillance-not-screening, non-diagnostic copy already asserted in monitoring.test.ts). The reframe is a delivery wrapper only — it may not introduce any new threshold, score, or developmental verdict.
  - "Here is what the record shows" must describe observations, never state or imply a milestone is "delayed/abnormal" or name a condition. No false reassurance AND no false alarm — a calm "worth discussing soon" routing for any CDC hard-stop signal (CLI-03), never a diagnosis (peds).
  - Preterm: the weekly read must honor corrected-age band selection now that CLI-01 is wired, so a preemie is never flagged against chronological age in the briefing (AAP corrected-age, ≤24m).
  - If the surfaced watch-item is speech/intelligibility, tie only to ASHA windows as a gentle "consider a speech-language assessment" (CLI-04). No effect-size or benefit claim that the briefing or any linked exercise improves an outcome (SLP).
  - "One thing you can do" must be a parent-owned, real-world action, never "open the app / tap here" — preserve parent-mediated, competence-not-dependence; and it must never label the child ("your child is anxious/ADHD"), attachment-safe + non-pathologizing (CLI-06, psych).
  - Honesty surface (CLI-08 / firewall §0): the briefing is "developmentally informed, grounded in public guidance — not a clinician's review." Never presented as clinician-reviewed/validated. No adviser/thinker identity or borrowed authority (CHARTER §3 p11).
  - Dedupe: share ONE brief template + ONE clinical copy gate with PHI-07 (weekly digest) and PHI-05 (milestone moment) — one signal-wording sign-off covers all three surfaces.
cited_basis:
  - CDC 2022 milestone revision (Zubler et al., Pediatrics 2022;149(3):e2021052138) — 75th-pct surveillance standard + CDC "Learn the Signs. Act Early" hard-stop set; GUIDANCE not graded trial evidence
  - AAP / HealthyChildren — developmental surveillance + preterm corrected-age (≤24m)
  - ASHA — communication & intelligibility developmental norms / referral windows
  - WHO — motor milestone windows
```

**Why concerns, not pass, and not veto.** The reframe is clinically protective, not just philosophically nice: converting a push/retention alert into a parent-agency briefing that ends on a parent-owned action is exactly the non-alarmist, parent-mediated, agency-over-reassurance posture the board wants on any signal touching a child. The signal source is already affirmed sound (surveillance-not-screening, non-diagnostic copy asserted in tests), and the candidate as filed introduces NO new claim — so `claims: none`. It is not `pass` because the load-bearing artifact, the briefing copy, does not exist yet, and "here is what the record shows" on a monitoring signal sits one sentence away from an implied developmental read; an unhedged or rounding-up wording would flip truth→false-certainty or truth→false-alarm — the precise failure modes the board blocks. That risk holds build-ready and forces `riskClass: gated` (per advisory.md §3 / PRODUCT-COUNCIL: any candidate touching development gets a board pass and cannot be build-ready until cleared). It is not a veto: nothing unsound or unsafe exists in code today, and the fix is bounded copy work on a shared brief template, not a redesign. Once peds/psych (and SLP if a speech watch-item can surface) sign off the briefing copy against the required_fixes, claims stays `none` and the item can be marked build-ready (still surfaced to Guy, as all clinical-surface items are).

**Routing.** Per the hard rule, the hold routes through `arbor-orchestrator` identically to an `arbor-safety` veto — PHI-02 cannot be promoted to build-ready until the shared briefing copy is cleared by the board. Build the one brief template + one clinical copy gate first (shared with PHI-07 / PHI-05) so effort is not triple-counted. Advisory weights this up (rubric `aligned`); only the clinical copy gate holds it.

---

## Council Intake — 2026-06-21 (Clinical GATE — PHI-10 honest red-flag layer)

**Item reviewed:** PHI-10 — Honest red-flag layer: name hard signals plainly, route to a provider, never soothe by hiding. Surface C5 monitoring-zone signals → "discuss with your provider" + auto provider PDF. `touchesClinical:true`, `riskClass:gated`.

**Lenses dispatched:** `arbor-clinical-peds` (thresholds/surveillance), `arbor-clinical-slp` (language-domain signal), `arbor-clinical-psych` (behavior framing). Grounded against the live `monitoring.ts` engine + `buildMonitoringReportDoc` (the provider PDF).

**Board verdict (binding clinical gate):**
```
soundness: concerns        # the direction is sound + correct; NOT a soundness VETO — fixable in copy + scoping
claims: UNSUBSTANTIATED([
  "ASQ-style monitoring signals" — the live C5 engine is NOT ASQ. It is a milestone-overdue (2-month grace) + behavior-cluster heuristic, not the validated, normed, copyrighted ASQ-3 instrument. Calling it "ASQ-style" in any user/provider-facing copy or PDF is a false-provenance claim (implies a validated screener we do not run).
  "monitoring-zone" framing borrowed from ASQ-3 — ASQ-3's monitor zone is a normed 1–2 SD band with a defined rescreen protocol; our heuristic has no such norming, so reusing the term asserts a validity we have not established.
  Any implied developmental-benefit / catches-delays-earlier / effect claim from surfacing the signal — none is substantiated and none may be stated.
])
riskClass: gated           # carries unverified claims → HOLD; cannot be build-ready until cleared
required_fixes:
  - DROP "ASQ-style"/"monitoring-zone" as provenance from all copy + the provider PDF unless we actually run a validated screener. Describe it honestly: "a developmental-monitoring (surveillance) signal built from milestones you've tracked and moments you've logged" — surveillance, NOT screening, NOT a test, NOT a score. (CDC LTSAE draws exactly this surveillance-vs-screening line; only the CLINICIAN'S screening tool is ASQ-3.) The existing `monitoring.ts` header + `buildMonitoringReportDoc` "what this is" section already say this correctly — every new PHI-10 word must match them, not drift.
  - HARD DEPENDENCY: ship behind CLI-01 + CLI-07 (corrected age). `deriveMonitoring` derives `ageMonths` from raw `input.ageYears` (monitoring.ts L181); on a preterm infant that false-flags overdue milestones early (AAP corrected-age, 24-month ceiling). A red-flag layer built on uncorrected age manufactures the false alarm this feature exists to kill. PHI-10 must NOT go build-ready until corrected age is wired into the C5 path.
  - "Name hard signals plainly" must NOT harden into a label/verdict. Preserve the non-negotiable non-diagnostic close verbatim ("Children develop at their own pace and this isn't a diagnosis — it's simply worth mentioning to your provider"). Output stays binary: "on track" vs "worth discussing." No condition name, no probability, no severity word, ever. (clinical veto if violated.)
  - CDC "Act Early" hard-stop set (loss of skills, no words by ~16m, no gestures/joint attention, not walking by ~18m) is the only time-sensitive case — if PHI-10 adds it, surface the missing BEHAVIOR ("no single words noted by ~16 months"), never the condition it screens for, and pair it with CLI-03 sign-off on the exact thresholds + age windows + urgency wording ("worth a conversation in the next few weeks," never "regression detected"/"red flag").
  - Language-domain signal copy is in scope of `arbor-clinical-slp` sign-off (align to ASHA windows, "discuss with provider," never an intelligibility verdict). Behavior-pattern copy is in scope of `arbor-clinical-psych` (attachment-safe, non-pathologizing — the current catch-all-to-regulation mapping is sound; don't regress it).
  - Firewall (CHARTER §3 p11): every word of red-flag/escalation copy AND the provider PDF carry no adviser/thinker identity and no clinician-endorsement claim — "developmentally informed, grounded in CDC/AAP/ASHA," NEVER "clinically validated"/"clinician-reviewed."
  - The provider PDF must keep `buildMonitoringReportDoc`'s "not a medical device, does not diagnose, supports a conversation never replaces one" section verbatim.
cited_basis:
  - CDC "Learn the Signs. Act Early." — surveillance (family monitoring) vs screening (validated tools); 2022 milestone revision is GUIDANCE at the ~75th percentile, not graded trial evidence (cdc.gov/act-early developmental-monitoring-and-screening; Zubler et al., Pediatrics 2022;149(3):e2021052138)
  - ASQ-3 (Squires & Bricker) — the monitor zone (1–2 SD) + refer zone (>2 SD) belong to a VALIDATED, normed instrument with a defined rescreen protocol; our heuristic is not it → "ASQ-style" is unsubstantiated provenance
  - AAP — corrected age to 24 months for preterm (the CLI-01/CLI-07 dependency)
  - ASHA — communication/intelligibility developmental windows (language-domain signal scope)
```

**Disposition:** HELD. Not build-ready. Concerns are fixable (the feature direction is correct and high-value — it is the truth-before-avoidance test made real), but the unsubstantiated provenance claim + the corrected-age dependency force `riskClass:gated` and a hold, identical to an `arbor-safety` veto. Route through `arbor-orchestrator` as a blocked item surfaced for Guy. Clears to build-ready only when: (1) all provenance/claim copy is fixed and re-passed, (2) CLI-01 + CLI-07 have landed, and (3) any added CDC hard-stop thresholds carry CLI-03 sign-off. Advisory score (`aligned`) is weighting only — it does not lift this hold.

---

## Council Intake — 2026-06-21 (Clinical GATE — PHI-01 surface coach citations + evidence grade)

**Item reviewed:** PHI-01 — Surface coach citations + evidence grade to the parent (truth-before-avoidance), CoachTab. `touchesClinical:true`.

**Board verdict (binding clinical gate):**
```
soundness: concerns
claims: UNSUBSTANTIATED(["evidence grade" as specified — no defined, cited rubric mapping a grade label to a real public-guidance basis; an ungraded-but-presented grade is itself an unverified developmental/effect-size assertion])
riskClass: gated              # carries an unverified claim surface (the grade) → HOLD; cannot be build-ready until cleared
required_fixes:
  - Define the evidence-grade rubric BEFORE build: a small, fixed, transparent set of tiers that each map to a real, cited public-guidance basis — e.g. "CDC/AAP/ASHA/WHO guidance" vs "general developmental guidance" vs "Arbor practice heuristic, not externally sourced." No clinical-trial-style A/B/C or "strong/proven" wording — CDC milestones (2022 revision) and AAP/ASHA norms are GUIDANCE, not graded RCT evidence; a trial-grade label misstates the evidence base (false certainty).
  - Every grade tier must name its actual source and, where one exists, link to the public page the parent can open. A grade with no traceable source is not allowed to display.
  - The grade must never imply Arbor reviewed/validated the guidance or that a clinician authored/endorsed it. Honest hedge line required (CLI-08): "developmentally informed, grounded in public guidance — not a clinician's review."
  - Firewall (CHARTER §3 p11): no adviser/thinker identity, name, likeness, or borrowed authority in any grade/source/citation copy; never "clinically validated"/"clinician-approved."
  - When the underlying coach grounding is thin or a heuristic, the surfaced grade must SAY SO (lowest tier), not round up — surfacing a confident grade on thin grounding flips truth→false-certainty, the exact failure this feature exists to avoid.
cited_basis:
  - CDC 2022 milestone revision (Zubler et al., Pediatrics 2022;149(3):e2021052138) — milestones are the 75th-percentile surveillance standard, GUIDANCE not graded trial evidence
  - AAP / HealthyChildren developmental guidance
  - ASHA communication & intelligibility developmental norms
  - WHO motor milestone windows
```

**Why concerns, not pass, and not veto.** The mechanism is sound and developmentally responsible: surfacing already-existing, real server-side source citations routes the parent OUTWARD to verifiable public guidance (CDC/AAP/ASHA/WHO) instead of asking them to trust the app blindly — the competence + truth pattern the board wants to see. The schema/surfacing of *sources* is clinically safe. The risk is concentrated entirely in ONE element: the **"evidence grade."** As specified there is no defined rubric, so a displayed grade is an unverified developmental/effect-size assertion — and if it borrows clinical-trial language ("strong evidence," "Grade A," "proven") it actively misstates the evidence base, because the public guidance Arbor cites is consensus surveillance *guidance*, not graded RCT evidence. That is an unsubstantiated claim, which under PRODUCT-COUNCIL §4 holds the item and forces `riskClass: gated`. It is not a veto: there is no unsound or unsafe assertion in the code today, and the fix is bounded copy/rubric work, not a redesign. Once the board sets the grade-tier rubric and source-attribution wording per the required_fixes, claims clears to `substantiated` and the item can be marked build-ready (still gated for Guy, as all clinical-surface items are).

**Routing.** Per the hard rule, the held claim routes through `arbor-orchestrator` identically to an `arbor-safety` veto — PHI-01 cannot be promoted to build-ready until the grade rubric + copy are cleared by the board. The SOURCE-surfacing half (citations without the grade) is separable and could land first as the safe slice if the council wants to ship value while the grade stays held — recommend that split.

---

## Council Intake — 2026-06-21 (Clinical REVIEW — B0 corrected-age, CLI-01 veto lift)

**Item reviewed:** B0 — Age in months / birthdate (months-precise age spine + corrected-age wiring). Built in `.arbor-build`.

**Board verdict:**
```
soundness: pass
claims: none                  # surveillance-not-screening; no score/label/claim introduced
riskClass: safe               # factual age derivation only — no developmental/medical/effect-size claim
required_fixes: []            # none blocking; 2 optional polish items below
cited_basis: [AAP/HealthyChildren corrected-age guidance, WA DCYF/ESIT age-correction guide, Nationwide Children's preemie 101, CDC 2022 (Zubler et al., Pediatrics 2022;149(3):e2021052138)]
```

**CLI-01 status: LIFTED.** The veto held on two defects — dead corrected-age helpers + bands selected against chronological whole-year age (false-early preemie flag). B0 fixes both: (1) `correctedAge`/`comparisonAgeMonths` are now live and wired into `MilestonesTab` (lines 57-61); (2) band selection now uses `ageMonthsFromProfile` (months-precise) and the corrected value, so a 9-month-old lands in the 9-month band and a 32-weeker is surveilled against the correct younger band. AAP math confirmed: `(40 − gestationalWeeks)` weeks × (12/52), clamped ≥0, cutoff gated on **chronological** 24m in BOTH `childAge.ts:70` and `milestoneData.ts:324` (they agree). Boundary tests cover just-before (23m, still applied) and just-after (24m/30m, stopped) plus 32w/28w/24w preterm cases. Re-confirmed by `arbor-clinical-peds`.

**Optional polish (non-blocking, surface to build pod):**
- Doc copy: `milestoneData.ts` lines 314, 339 say "under ~24 months *corrected*" — code correctly gates on chronological; reword comment to avoid future misreading.
- Test hardening: add one end-to-end assertion that `bandForAgeMonths(comparisonAgeMonths(9, 32))` returns the 6-month band, to pin the corrected-band wiring.
- Copy nit (separate path): `MilestonesTab.tsx:94` AI explain-prompt still passes legacy `${childProfile.age}-year-old` → sends "0-year-old" for under-1s. Route the months-precise spine here too. Not a soundness defect.

---

## Council Intake — 2026-06-21 (Clinical stream — originated by arbor-clinical-lead)

**Verdict on the existing clinical surface (board pass):**
```
soundness: concerns          # two veto-class correctness defects found, below (CLI-01, CLI-02)
claims: substantiated        # current copy is correctly non-diagnostic; milestone basis is cited (CDC 2022 / ASHA 2023) and honest
riskClass: gated             # every item here touches development/health and/or carries a developmental signal — none auto-build
cited_basis: [CDC 2022 (Zubler et al., Pediatrics 2022;149(3):e2021052138), AAP corrected-age guidance, ASHA 2023 communication & intelligibility norms, CDC "Learn the Signs. Act Early." red-flag set, WHO motor milestone windows]
```

Existing strengths the board affirms (do not regress): `monitoring.ts` is correctly framed as surveillance-not-screening, ends every note in a provider nudge, and never emits a score/probability/label; `escalation.ts` red-flag copy is sound, multilingual, and leads with 112/101/findahelpline; `milestoneData.ts` is cited to the 75th-percentile CDC 2022 standard with honest empty states.

| ID | Title | Stream | riskClass | Clinical | Owner pod | Surface | Note |
|----|-------|--------|-----------|----------|-----------|---------|------|
| CLI-01 | Wire preterm corrected-age into live monitoring | clinical | gated | **VETO LIFTED (2026-06-21)** | arbor-ai | lib/childAge.ts, lib/milestoneData.ts, components/tabs/MilestonesTab.tsx | RESOLVED by B0: corrected-age helpers now live + wired into band selection; months-precise age removes the false-early flag. AAP math + 24m chronological cutoff confirmed; re-confirmed by arbor-clinical-peds. See "Clinical REVIEW — B0" block at top. |
| CLI-02 | Age-window the Development Score | clinical | gated | concerns | arbor-growth | growth/devScore.ts, components/sections/DevScoreCard.tsx | Scores all milestones it's handed, not the age-appropriate set; young child false-low, older child noise. Needs corrected-age window + confidence floor. |
| CLI-03 | CDC "Act Early" red-flag surfacing (non-alarmist) | clinical | gated | pass-with-fixes | arbor-ai | lib/monitoring.ts | Surface the small CDC hard-stop set (loss of skills, no words by ~16m, no gestures/joint attention, not walking by ~18m) as a calm "worth discussing soon" — never a diagnosis or condition name. |
| CLI-04 | SLP referral-timing prompt in Practice Studio | clinical | gated | pass-with-fixes | arbor-practice | lib/speechScorer.ts, practice/ | Tie persistent low intelligibility to ASHA windows (≈50% @2y, 75% @3y) → gentle "consider a speech-language assessment". Effect-size/benefit claims stay banned. |
| CLI-05 | Escalation copy review pass + jurisdiction coverage | clinical | gated | pass | arbor-safety | safety/escalation.ts | Affirm current copy; add a periodic clinical re-review hook; verify IL/NL/BE numbers stay current; keep "pause the plan, get a person" framing. |
| CLI-06 | Non-pathologizing framing guard on behavior/emotion coaching | clinical | gated | concerns | arbor-psych (growth) | growth/, components/tabs/BehaviorsTab.tsx, components/behaviors/PatternInsights.tsx | Ensure pattern insights describe behavior, never label/diagnose; attachment-safe, parent-mediated; no "your child is anxious/ADHD" inferences. |
| CLI-07 | Corrected-age capture + display in onboarding/profile | clinical | gated | pass | arbor-growth | components/auth/OnboardingFlow.tsx, components/profile/ | `preterm.gestationalWeeks` exists in types but capture/display UX is thin; prompt gently, show "corrected age" badge, stop at 24m corrected (AAP). Prereq for CLI-01/02. |
| CLI-08 | "Not a diagnosis / not a clinician" honesty surface | clinical | gated | pass | arbor-design | global (Screening, DevScore, Coach, Practice) | One consistent, calm honesty line wherever a developmental signal shows; never "clinically validated"/"clinician-reviewed" unless a real named credentialed professional has signed off. Firewall §0. |

**Blocked-on (board veto / human decision):**
- **CLI-01 veto LIFTED (2026-06-21)** — B0 landed the corrected-age wiring + months-precise age; `arbor-clinical-peds` re-confirmed AAP-correct math and removal of the false-early-flag. soundness: pass, claims: none. No longer blocks build-ready.
- All eight items are `gated` (developmental/health surface). They surface for Guy; none auto-build.

**Honesty note:** the board is a reasoning aid grounded in cited public guidance, not a licensed clinician. Where evidence is age-band-fuzzy (individual milestone timing), items are written as "worth discussing", never as thresholds of abnormality.

---

## Council Intake — 2026-06-21 (Philosophy stream — scored by arbor-advisor)

Rubric: competence / order / responsibility / truth / meaning. Advisory is **weighting, not gating** — these scores shift council priority, never block a ship.

| ID | Title | Stream | riskClass | Advisor | Owner pod | Surface | Why (one line) |
|----|-------|--------|-----------|---------|-----------|---------|----------------|
| PHI-01 | Surface coach citations + evidence grade to the parent | philosophy | gated | **aligned** | arbor-practice | CoachTab | Rare two-test hit (truth + competence): grounding already exists server-side but is invisible — showing sources converts blind trust into verifiable, high-agency parental judgment instead of app-dependence. |
| PHI-02 | Reframe "Arbor Noticed" as a parent-agency briefing, not a push alert | philosophy | gated | **aligned** | growth | Weekly proactive card grounded in the child's own monitoring signal | The candidate *is* the rubric reframe — converts a retention/delivery mechanic into parental agency ("what the record shows + one thing you can do"). Hits responsibility + truth + meaning-over-engagement together; hold gated behind clinical sign-off on the briefing copy. |
| PHI-03 | Competence Ladder: scaffolding that deliberately retires itself | philosophy | safe | **aligned** | arbor-growth | Coach + Plans | Purest expression of test 1 (competence-not-dependence) made into a mechanic — fading prompts/templates as the parent demonstrates real capability is the one thing every engagement-maximizing rival structurally cannot copy. |
| PHI-06 | JITAI nudges spend a daily attention budget | philosophy | gated | **tension** | arbor-growth | JITAI nudge engine (cap + parent quiet-hours + one-action-per-nudge) | Cap+quiet-hours+one-clear-action is a strong *order-from-chaos* governor on the already-shipped C2 JITAI seam — but a growth-owned nudge engine pulls toward dependence/engagement. Reframe makes it aligned. |
| PHI-07 | Weekly digest as a "state of your child" decision brief, not an activity recap | philosophy | gated | **aligned** | arbor-growth | PC3 digest scheduling + send | Four-test hit: one read + one risk-honest signal + one next action is the North Star's "calm senior advisor" — serves meaning over time-in-app, tells the truth (incl. hard signals), and ends in parental action rather than a vanity recap. Dedupe: same parent-agency-briefing pattern as PHI-02 (Arbor Noticed) — merge the brief template. |
| PHI-05 | Reframe re-engagement nudge from streak-recovery to a meaningful "new chapter" | philosophy | safe* | **aligned** | arbor-growth | PC4 milestone/birthday re-engagement trigger reading the memory moat | Self-applies the meaning-over-engagement test: grounds a re-engagement surface in a real developmental moment from the record ("Maya turned 4 — the chapter ahead") instead of guilt/streak mechanics — converting engagement-bait into a meaning-bearing beat. Aligned *conditional on a real developmental payload*; a milestone-flavored streak with no next action is the failure mode. Dedupe: shares the parent-agency-briefing payload pattern with PHI-02/PHI-07 — reuse that "one read + one next action" template, milestone-triggered. |
| PHI-09 | Second-guardian loop as shared responsibility, not a referral reward race | philosophy | gated | **aligned** | growth | PC5/G3 SecondGuardianCard → co-viewer-with-contribute role | The candidate *is* the rubric reframe of a give-get viral loop: leads with shared parental responsibility for one child's record (both guardians see + contribute), demotes the reward to a by-product. Hits responsibility + order + truth + meaning together. Aligned *only while the incentive stays subordinate* — a referral counter/streak at the top of the surface flips it to off-rubric. |

**Advisor rubric detail (PHI-01):**
- **Competence, not dependence — strong.** Showing the source behind a coach answer teaches the parent *how to judge advice*, building durable judgment rather than reliance on the oracle. This is the rubric's highest-value pattern.
- **Truth before avoidance — strong.** It refuses to hide the basis of a claim; the parent can see the evidence grade and weigh it. Directly serves the truth test.
- **Responsibility before comfort — positive.** Verifiable sources hand the decision back to the parent rather than offering frictionless reassurance.
- **Order from chaos — neutral/positive.** Adds signal (provenance), not noise, provided the citation UI is restrained and doesn't bury the answer.
- **Meaning over engagement — neutral.** Not an engagement mechanic; serves understanding. No streak/dopamine risk.
- **No reframe needed** — this *is* the competence-building version. One guardrail, not a reframe: the "evidence grade" must be honestly hedged and must not imply clinician review or borrow the firewall thinker's authority (CHARTER §3 p11). That honesty constraint is exactly why this is filed `gated` (touchesClinical=true) — the Clinical Board sets how grade/source is worded before build-ready, but the *idea* is fully aligned.

**Handoff note:** `gated` because it surfaces a developmental/evidence signal and touches clinical wording — it does not auto-build; it goes to the Clinical Board for the grade-wording gate, then surfaces for Guy. High strategic_fit (aligned) — council should weight it up.

**Advisor rubric detail (PHI-03):**
- **Competence, not dependence — strongest possible.** This is rubric test 1 turned into a product mechanic: support that withdraws as the parent succeeds is the literal definition of capability over reliance. No other candidate scores higher here.
- **Responsibility before comfort — positive.** Retiring the hand-holding transfers ownership back to the parent rather than offering perpetual reassurance.
- **Meaning over engagement — strongly positive (counter-cultural).** It deliberately *reduces* in-app surface area as the parent grows — the opposite of streak/dopamine maximization. This is the genuine differentiator the rationale claims; every rival is structurally biased the other way.
- **Order from chaos — neutral/positive.** Must fade the *prompting*, not the underlying rhythm/structure the parent has internalized.
- **Truth before avoidance — positive, conditional.** Only true if the retirement trigger keys off an honest competence signal. The one failure mode is a fake-out fade.
- **No reframe needed** — this is already the competence-building version. One **build guardrail** (a constraint, not a reframe): the fade must trigger on a genuine capability signal (parent resolves a situation before opening the prompt, or self-reported confidence the parent can override), and must be **reversible + parent-visible** ("we've stepped back here — tap to bring guidance back"). A silent, irreversible, or engagement-triggered fade would invert the whole point into a covert churn mechanic. `riskClass: safe` (no claim, no child-data/billing surface); a light Clinical-psych note on parent-mediated framing is worth pulling in at council but is not blocking.

**Advisor rubric detail (PHI-06):**
- **Order from chaos — strong (the candidate's spine).** A hard daily attention budget + parent-set quiet hours + exactly one concrete action per nudge is textbook structure-imposing; it governs the already-in-tree C2 JITAI delivery seam so the engine helps a family impose rhythm rather than firing off every logged state. This is the one test PHI-06 genuinely wins.
- **Competence, not dependence — mild tension.** A nudge *prompts* the parent rather than *builds* the parent's own pattern-reading; the failure mode is training the parent to wait for the ping instead of learning the cue.
- **Responsibility before comfort — mild tension.** A growth-pod-owned nudge engine has structural gravity toward doing the noticing for the parent and toward re-engagement; the budget is a guardrail against, not an elimination of, that pull.
- **Truth / meaning — neutral-to-fine, conditional.** Fine *provided* the budget is a true ceiling and the surface isn't quietly instrumented for time-in-app. If success is ever measured in opens/streaks, meaning inverts.
- **Verdict: tension, not off-rubric** — the guardrails are themselves rubric-derived (this is the order test made into a constraint), so it isn't engagement-bait; the residual is the dependence/engagement vector inherent to a growth-owned nudge engine.
- **Reframe (the competence-building version):** make each nudge **teach the cue, not just the action** — name the signal it fired on ("you logged 3 short-sleep nights → here's the one thing") so the parent learns to read the pattern themselves, and let the engine **taper its own budget** as the parent shows they catch the cue unprompted (a nudge engine whose success metric is firing *less* over time). Convert the daily budget from "app-spent" to **parent-earned/parent-owned** (parent sets and can bank it), and instrument success as *parent action taken without a nudge* — never opens or streaks. This keeps the order-from-chaos win while flipping competence + meaning from tension to aligned; it also dovetails with PHI-03's self-retiring scaffold (same north star: support that withdraws as capability grows).
- **Gate:** `gated` + `touchesClinical: true` → routes to `arbor-clinical-psych` for nudge-cadence / attachment-safe / parent-mediated review before build-ready; does not auto-build; surfaces for Guy.

**Advisor rubric detail (PHI-09):**
- **Responsibility before comfort — strong (the candidate's spine).** Leading with shared parental responsibility for one child's record — both guardians see and *contribute* — is the responsibility test made into a role. It nudges two parents toward joint ownership rather than one parent outsourcing the noticing to the app or to the other.
- **Order from chaos — strong.** One shared, authoritative record for a two-guardian household replaces two fragmented half-views; this is order-from-chaos exactly as the rationale claims, and the family-as-first-institution frame fits cleanly.
- **Meaning over engagement — strong, conditional.** The whole move is meaning-as-hook with the referral reward demoted to a by-product. This is the right inversion of a give-get viral loop. *Conditional:* it only holds while the incentive stays genuinely subordinate.
- **Truth before avoidance — positive.** Both guardians seeing the same honest record (including hard signals) closes the gap where one parent softens or hides what the record shows. No soothing-by-hiding.
- **Competence, not dependence — neutral/positive.** Builds the family's own shared practice of attending to the child; not an app-dependence mechanic, though it doesn't build capability as directly as PHI-01/PHI-03.
- **Verdict: aligned — the candidate already *is* the competence/responsibility-building version** of the viral loop, not the bait. No reframe needed.
- **One guardrail (a constraint, not a reframe):** the incentive must stay subordinate to the shared-record meaning. The moment a referral counter, "invite N to unlock", or a streak surfaces at the top of `SecondGuardianCard`, this flips to **off-rubric** (reward-race, engagement-bait) — that is the single failure mode to hold the line on at build. Keep the second guardian a true **co-viewer-with-contribute role**, not a referral token.
- **Gate:** `gated` (touches child-data / record-sharing / consent + a second person's access to a child's record) → not auto-built; routes for `arbor-safety` + consent review and surfaces for Guy. `touchesClinical: false`. Strategic_fit high (aligned) and it serves the two-parent-household + second-guardian growth loop (dedupe with the V0 second-guardian item in memory) — council should weight it up, with the incentive-subordination guardrail attached.

**Advisor rubric detail (PHI-05):**
- **Meaning over engagement — strong (the whole point).** Replaces guilt/streak-recovery mechanics with a developmental moment drawn from the child's own record. This is precisely the engagement-bait → meaning conversion the rubric exists to reward; the candidate self-applies test 5.
- **Responsibility before comfort — positive.** Points the parent at the actual child ("here's the chapter developmentally ahead") rather than at app-guilt or a broken streak.
- **Truth before avoidance — positive.** The trigger is grounded in the real record (a real birthday/milestone), not a manufactured pretext to re-open the app.
- **Order from chaos — neutral/positive.** A birthday/milestone is a natural ordering beat a family already recognizes; fine as long as it isn't fired so often it becomes noise.
- **Competence, not dependence — neutral/positive, and the single sharpening note.** The reframe alone doesn't build capability. To clear the bar, the "chapter ahead" must carry a *concrete next action* (one thing to try this month), not just re-open the app. Without a real payload it degrades into milestone-flavored streak bait — the same dependence pattern in nicer language.
- **No reframe needed — the candidate already is the reframe** (it self-applies the rubric). Verdict: **aligned**, weight it up; dedupe its payload with PHI-02/PHI-07 (one read + one risk-honest signal + one next action), milestone-triggered.
- **One council guardrail, not mine to set:** firing a dated, name-bearing nudge ("Maya turned 4") reads the child's record out to a notification/email channel — a child-data egress + consent surface. Despite `touchesClinical:false`, the council should weigh whether this is truly `safe` or `gated` at the riskClass gate (hence `safe*`). The advisory verdict is unchanged either way.

**Advisor rubric detail (PHI-07):**
- **Meaning over engagement — strong (the candidate's spine).** The whole move is anti-vanity: it refuses the activity-recap (the format every retention-driven app defaults to) for a brief that exists to inform a decision. Test 5 made into the artifact, landing the North Star register — "calm senior parenting advisor" / "family operating manual," not a highlight reel. It also fixes the live defect in the rationale (digest generated but never sent) by making the thing worth sending.
- **Truth before avoidance — strong, conditional.** "One risk-honest signal" is both the value and the entire risk surface. Done right it surfaces the hard developmental signal the parent needs rather than burying it under cheerful highlights — directly serving the truth test. Done wrong it manufactures alarm or implies a verdict the evidence won't support, which is why `touchesClinical=true` / `gated` is correct: the Clinical Board sets the wording (non-alarmist, non-pathologizing, hedged, provider-nudge per CLI-03/CLI-06) before build-ready.
- **Responsibility before comfort — positive.** Ending on one next action hands the week back to the parent as an owner, not a reassurance-seeker; a prompt to act, not a pat on the back.
- **Competence, not dependence — positive (one watch-item).** A recurring read → signal → action loop trains the parent to scan their own child's state rather than substituting for it. Watch: keep "one next action" a parent-owned real-world move, not "open the app and tap here," or the loop teaches app-checking instead of child-reading.
- **Order from chaos — positive.** A predictable weekly cadence with a fixed three-part shape is genuine structure, not noise — provided it stays *one* read / *one* signal / *one* action and never bloats back into a recap.
- **No reframe needed — this candidate *is* the reframe** (recap → decision brief). Three constraints, not a reframe: (1) the risk signal must be honestly hedged + non-alarmist, carry no developmental/medical claim the Clinical Board hasn't cleared, and **never borrow the firewall thinker's authority** (CHARTER §3 p11); (2) parent-facing only — it must not present a "state of your child" read as clinician-reviewed (firewall §0 / CLI-08 honesty line); (3) hold the line at three parts.
- **Dedupe (important):** same parent-agency-briefing pattern as **PHI-02** (Arbor Noticed) and the PHI-05 payload note. Build **one brief template** the child's monitoring signal feeds — digest send (PHI-07), proactive card (PHI-02), milestone moment (PHI-05) all draw from it — not three surfaces, so effort isn't triple-counted.
- **Gate / handoff:** `gated` (touchesClinical=true) → Clinical Board signal-wording gate (peds/psych, anchored to CLI-03/CLI-06) before build-ready, then surfaces for Guy. High strategic_fit (**aligned**) — weight up, but merge the brief template with PHI-02/PHI-05 first.

---

## PM Grooming — 2026-06-22

**PM:** arbor-pm · **Sources read:** PRODUCT-BACKLOG.md (Council Intake 2026-06-21), PRODUCT-COUNCIL.md, IMPROVEMENT-BACKLOG.md (CIL cycles 2026-06-21c + 2026-06-22), MARKETING-BACKLOG.md · **Gate applied:** BACKLOG-MODEL.md ready-bar + PRODUCT-COUNCIL.md §4 clinical gate

**First AP- promotion cycle.** No `AP-` ids existed before this block. All items below are first-ever promotions from their respective feeder IDs.

---

### Triage log (all open candidates)

| Feeder ID | Title | Type | Stream | Disposition | AP- id |
|---|---|---|---|---|---|
| CLI-06 | Non-pathologizing framing guard on behavior/emotion coaching | enhancement | clinical | Promoted — riskClass corrected to `safe` by board; no unsubstantiated claim; gaps are concrete and buildable | **AP-001** |
| PHI-03 | Competence Ladder: scaffolding that deliberately retires itself | feature | philosophy | Promoted — `safe`, `aligned`, no claim or child-data surface | **AP-002** |
| PHI-05 | Reframe re-engagement nudge → meaningful "new chapter" | enhancement | philosophy | Promoted — `safe*` per advisor; child-data surface (fires child's birthday into a notification channel) elevates to `gated`; surfaces for Guy | **AP-003** |
| CIL-conv-paywall-no-price | PaywallModal shows toggle but NO price | bug | cil | Promoted — `safe`, score 38, highest CIL conversion finding | **AP-004** |
| CIL-lang-jitai-nudge-en-regression | JITAI home nudge hardcoded English | bug | cil | Promoted — `safe`, score 23, language regression on primary retention surface | **AP-005** |
| CIL-conv-no-post-checkout-activation | No post-checkout activation on payment return | bug | cil | ~~Promoted as AP-006~~ → **RETRACTED 2026-06-22**: reality-check adversarial verify confirmed `App.tsx` already handles `?billing=success`. False finding. AP-006 dropped. | **AP-006 DROPPED** |
| CIL-trust-posture-invisible-onboarding | Trust posture invisible at onboarding hand-over | enhancement | cil | Promoted — `safe`, score 22, copy-only | **AP-007** |
| CIL-market-dead-hero-cta | Final landing CTA is a dead JS no-op (all 5 langs) | bug | cil/market | Promoted → Marketing queue (AM-) not AP-; handed off to arbor-marketing-lead; noted here for lineage | handed to AM- |
| CIL-market-og-title-he-english | HE landing serves English OG previews into WhatsApp | bug | cil/market | Promoted → Marketing queue (AM-); same handoff | handed to AM- |
| CIL-market-schema-preorder-vs-live | SoftwareApplication schema says PreOrder, app is live | bug | cil/market | Promoted → AM-; SEO-owned | handed to AM- |
| CIL-onboard-age-years-not-months | Onboarding age slider stores raw years 0–18; infants mis-bucketed | bug | cil | Promoted — `safe` on code axis but requires `arbor-clinical-peds` soundness check; `gated`; surfaces for Guy | **AP-008** |
| DEM-004 schema half | PlayActivity citation fields (schema/render only, no populated copy) | enhancement | demand | Promoted — schema half is `safe` per board split; the populated-copy half stays `gated` | **AP-009** |
| R4 / PHI-01 source-citation half | Surface existing server-side coach citations (sources only, no evidence-grade copy) | enhancement | philosophy | Promoted — source-surfacing half is `safe` per board (grade rubric half stays `gated`) | **AP-010** |
| CLI-05 | Escalation copy review pass + jurisdiction verification | enhancement | clinical | Promoted — board: soundness:pass; no unsubstantiated claim; concrete maintenance task | `gated` (touchesClinical) — surfaces for Guy; **AP-011** |
| CLI-08 | "Not a diagnosis / not a clinician" honesty surface | enhancement | clinical | Promoted — board: soundness:pass, no claim, UI-copy hardening; `gated` (touchesClinical) — surfaces for Guy | **AP-012** |
| SA1–SA4 (school-age clinical reqs) | School-age 7–10 surveillance (6 domains, reading-behavior, EF/homework scaffold) — substantiated set | feature | clinical | Promoted — substantiated set (SA1/SA2-observation/SA4/SA5/SA6-SR1-SR4) is `safe` per board; HELD/gated set (SA2 WCPM-as-score, SA3 NL-MDR-TBD, SA6-SR5-SR7) surfaces for Guy | **AP-013** |
| DEM-002 | Proactive "Arbor Noticed" weekly alert card | feature | demand | Not promoted — HELD by clinical board (corrected-age dependency + unsubstantiated guarantee claim). Gate is working. | HELD |
| DEM-003 | Physical Growth Tracking — Height/Weight/WHO percentile | feature | demand | Not promoted — HELD by clinical board (percentile-as-verdict + corrected-age dep + chart-switch dep). | HELD |
| DEM-009 | Double-Aha Onboarding | feature | demand | Not promoted — HELD by clinical board (day-zero Rhythm promise is an unsubstantiated developmental prediction). | HELD |
| DEM-011 | Email/Waitlist Capture with GDPR Consent | feature | demand | Not promoted to AP-; correctly belongs in Marketing queue (PII capture, GDPR); handed off to AM- | handed to AM- |
| DEM-012 | Memory-Adaptive Literacy Track | feature | demand | Not promoted — HELD by clinical board (readiness-signal framing = implicit developmental-assessment claim). | HELD |
| DEM-004 populated-copy half | Citation copy populated per activity | enhancement | demand | Not promoted — `gated` pending per-source board soundness:pass on each citation body | HELD |
| PHI-01 evidence-grade half | Evidence grade rubric on coach citations | enhancement | philosophy | Not promoted — `gated` pending board rubric definition | HELD |
| PHI-02 | Reframe "Arbor Noticed" as parent-agency briefing | enhancement | philosophy | Not promoted — `gated`; depends on CLI-01/CLI-07/CLI-03 landing first + briefing copy board sign-off | HELD (dep chain) |
| PHI-06 | JITAI nudges daily attention budget | enhancement | philosophy | Not promoted — `gated` (touchesClinical — nudge-cadence/attachment-safe review pending) | HELD |
| PHI-07 | Weekly digest as "state of your child" decision brief | feature | philosophy | Not promoted — `gated` (briefing copy + signal-wording gate not cleared) | HELD |
| PHI-08 | Consent + audit panel as parental ownership of the record | feature | philosophy | Not promoted — `gated` (consent surface + child-data) | HELD |
| PHI-09 | Second-guardian loop | feature | philosophy | Not promoted — `gated` (child-record sharing + consent + billing); surfaces for Guy | HELD |
| PHI-10 | Honest red-flag layer | feature | philosophy | Not promoted — HELD (ASQ-style claim + corrected-age dep + CLI-01/07 must land first) | HELD |
| CLI-01 | Wire corrected-age into monitoring path | enhancement | clinical | Veto LIFTED by B0. Closes the false-early-flag. No open AP- needed (resolved in build); mark complete | CLOSED (B0) |
| CLI-02 | Age-window the Development Score | enhancement | clinical | Not promoted — `gated` (peds boundary sign-off pending) | HELD |
| CLI-03 | CDC "Act Early" red-flags non-alarmistly | enhancement | clinical | Not promoted — HELD (thresholds wrong: 16m→18m must be corrected + loss-of-skills detector not built) | HELD |
| CLI-04 | SLP referral-timing prompt | enhancement | clinical | Not promoted — HELD (cited ASHA thresholds are outdated Lynch/Coplan rule-of-thumb; must use Hustad 2021) | HELD |
| CLI-07 | Corrected-age capture + display in onboarding/profile | enhancement | clinical | Not promoted — `gated` (child-data capture + clinical threshold); surfaces for Guy | HELD |
| DEM-001 | FCM background push for JITAI | feature | demand | Not promoted — `gated` (FCM consent + server-side child-data read) | HELD |
| DEM-005 | Live Expert Session Booking | feature | demand | Not promoted — HELD (two unsubstantiated claims + deepest child-data egress + billing; clinical board veto) | HELD |
| DEM-007 | Referral Grant + /join?ref= deep-link resolver | feature | demand | Not promoted — `gated` (billing — writes entitlements) | HELD |
| DEM-008 | One-Tap Branded Share Export with referral code | feature | demand | Not promoted — `gated` (billing entitlement grant + child-derived content render) | HELD |
| DEM-010 | Founding-Member Paywall Trigger with 500-slot cap | feature | demand | Not promoted — `gated` (Level 4 billing + fake-scarcity truth concern) | HELD |
| CIL-capability-* (gated capability finds) | FCM push, proactive alerts, growth tracking, expert booking, multi-child dashboard | feature | cil | Not promoted — all `gated` (child-data / billing / consent). Recorded in IMPROVEMENT-BACKLOG.md §gated | HELD |

**De-dupe notes applied:**
- DEM-002 + CIL-capability-proactive-memory-alerts = same root cause (proactive delivery layer for monitoring signals). One HELD entry covers both.
- PHI-07 + PHI-02 + PHI-05 share a single "parent-agency briefing" brief-template dependency. Treated as one dep cluster; none promote until the template clears the board.
- DEM-007 + DEM-008 + CIL-market-viral-loop-unwired = the same referral-loop plumbing. One HELD/gated cluster.
- CLI-01 CLOSED (resolved by B0) — no duplicate tracking.

---

### Promoted items — AP- id register (full ready-bar)

**AP-001** ✅ SHIPPED — REL-ARBOR-001 (2026-06-22)
- **Title:** Non-pathologizing framing guard on behavior/emotion coaching
- **From:** CLI-06 (Council Intake 2026-06-21, clinical stream)
- **Type:** enhancement · **Stream:** clinical · **riskClass:** safe
- **Owner pod:** arbor-growth (BehaviorsTab.tsx / PatternInsights.tsx / /analyze-behavior route)
- **Status: SHIPPED 2026-06-22.** RELEASE-LEDGER REL-ARBOR-001 confirms: CI-13 was "fully closed" via `arbor-safety` commit `bf2febc` (merge `4c9f7ed`). The hedge-pattern safety floor ("this looks like ADHD" catch) was applied, and the release ledger states "All four model-authored surfaces now screened" — satisfying AP-001's acceptance criteria. 663 tests green.
- **Problem:** `screenModelOutput` is wired to `/coach` and `/council` but NOT to `/analyze-behavior` or the inline co-regulation route. The `NON_DIAGNOSTIC_CONTRACT` prompt guard exists but an AI-generated insight string carrying a label (e.g. "this looks like ADHD") is never caught on these two routes. The label-leak hole is real and buildable.
- **Acceptance criteria:** (1) `screenModelOutput` wraps `/analyze-behavior` and the inline co-regulation route, concatenating `expertInsights`/`actionPlanSuggestion`/`effectivenessRating` + the script body; flagged output replaced with the safe fallback. (2) A new test in `safety/outputScreen.test.ts` asserts that a synthetic insight string containing an inferred label (e.g. "this looks like ADHD") is caught on these routes. (3) Firewall copy: insight copy stays "developmentally informed," never "clinically validated," no adviser/thinker identity.
- **Success metric:** Zero label-leak strings reaching the BehaviorsTab render path in the output-screen test suite; 100% catch rate on the synthetic-label regression.
- **Score:** priority = (4 × 4 × 0.75 × 1.0) ÷ 2 = **6.0**
- **Notes:** riskClass confirmed `safe` by board (claim-suppression guard, no unsubstantiated claim, no child-data/billing surface). Passes normal DevSecOps gate only.

**AP-002**
- **Title:** Competence Ladder — scaffolding that deliberately retires itself
- **From:** PHI-03 (Council Intake 2026-06-21, philosophy stream)
- **Type:** feature · **Stream:** philosophy · **riskClass:** safe
- **Owner pod:** arbor-growth (Coach + Plans surfaces)
- **Problem:** Prompts and templates never fade as the parent demonstrates capability. Every competitor structurally cannot do this (their incentive is time-in-app). Arbor's moat is the record — a fade triggered on a genuine competence signal is the product expression of "competence-not-dependence."
- **Acceptance criteria:** (1) A fade mechanic is implemented that reduces prompt/template scaffolding when the parent demonstrates capability (e.g. self-resolves a situation before opening the prompt, or manually marks confidence). (2) The fade is reversible and parent-visible ("we've stepped back here — tap to bring guidance back"). (3) The trigger keys off a genuine signal, not engagement data. (4) The mechanic does not silently or irreversibly remove content.
- **Success metric:** At least one coaching surface that measures and shows scaffolding-level to the parent; parent-reported guidance independence up over 30-day cohort (qualitative signal pre-launch; quantitative once instrumented).
- **Score:** priority = (4 × 4 × 0.75 × 1.0) ÷ 3 = **4.0**
- **Notes:** riskClass `safe` (no claim, no child-data/billing surface). Light arbor-clinical-psych note on parent-mediated framing is worth a review comment at build but is not a blocking gate.

**AP-003**
- **Title:** Reframe re-engagement nudge from streak-recovery to a meaningful "new chapter"
- **From:** PHI-05 (Council Intake 2026-06-21, philosophy stream)
- **Type:** enhancement · **Stream:** philosophy · **riskClass:** gated (child-data: fires child name + milestone into a notification/email channel)
- **Owner pod:** arbor-growth (PC4 milestone/birthday re-engagement trigger)
- **Problem:** Current re-engagement nudge is streak-recovery mechanics. The milestone event already exists in the record. A birthday/developmental-moment trigger grounds re-engagement in the child's real story, not guilt — converting engagement-bait into meaning.
- **Acceptance criteria:** (1) Re-engagement trigger reads a real birthday or developmental moment from the child's record (not a manufactured streak). (2) Payload is "one read + one parent-owned next action" for the chapter ahead — no streak counter, no "you haven't opened in X days." (3) Child's name and developmental moment are handled as child-data egress (consent surface reviewed by arbor-safety). (4) Milestone-flavored streak variant (no next action) is the explicit failure mode — must not ship in that form.
- **Success metric:** Re-activated parents who complete a next action within 48h of the nudge (target: >30% of re-activations); NOT open rate or session starts.
- **Score:** priority = (4 × 3 × 0.75 × 1.0) ÷ 2 = **4.5** (gated — surfaces for Guy)
- **Notes:** gated because firing child's name + developmental moment into a notification/email channel is a child-data egress surface; arbor-safety consent review required before build. Guy confirms before scheduling.

**AP-004**
- **Title:** PaywallModal shows toggle but no price — add per-cadence price display
- **From:** CIL-conv-paywall-no-price (IMPROVEMENT-BACKLOG.md, cycle 2026-06-22, conversion lens, score 38)
- **Type:** bug · **Stream:** cil · **riskClass:** safe
- **Owner pod:** arbor-billing + arbor-content
- **Problem:** `billing/PaywallModal.tsx:45-52` renders a monthly/annual cadence toggle but `pw.*Price` i18n keys are absent from `i18n.ts`. The conversion moment has no offer; the annual option (highest LTV) has zero pull. This is a live revenue defect on the monetizing app.
- **Acceptance criteria:** (1) `pw.plusMonthlyPrice`, `pw.plusAnnualPrice`, `pw.familyMonthlyPrice`, `pw.familyAnnualPrice`, and annual-savings-anchor strings added to `i18n.ts` in EN + HE. (2) PaywallModal renders the active-cadence price per plan button. (3) Annual savings anchor (≈21-24% saving) renders adjacent to the annual toggle. (4) Prices used: Plus €12.99/mo · €119/yr; Family €19.99/mo · €189/yr (confirm with Guy before ship — these are the working estimates).
- **Success metric:** Paywall trial-to-paid conversion rate measurably lifts vs baseline in the first 14 days post-ship.
- **Score:** priority = (5 × 5 × 0.9 × 1.0) ÷ 2 = **11.25** (highest safe score on board)
- **Notes:** Price points are working estimates — Guy confirms before copy ships. Code change is safe; the price confirmation is a Level 3 content decision.

**AP-005** ✅ SHIPPED — REL-ARBOR-002 (2026-06-22)
- **Title:** JITAI home nudge hardcoded English — wire i18n EN+HE
- **From:** CIL-lang-jitai-nudge-en-regression (IMPROVEMENT-BACKLOG.md, cycle 2026-06-22, language lens, score 23)
- **Type:** bug · **Stream:** cil · **riskClass:** safe
- **Owner pod:** arbor-growth (+ arbor-content for HE strings)
- **Status: SHIPPED 2026-06-22.** RELEASE-LEDGER REL-ARBOR-002 confirms explicitly: 3 files updated (jitai.ts keys+vars, i18n.ts 12 EN+12 HE keys, OverviewTab `t()` resolve); tsc 0, targeted tests 9/9, framework+safety green; pushed `87ce518..9883c2d` + `firebase deploy --only hosting` live on both origins. HE copy flagged for `arbor-localization` native review (not a blocking gate, a pending polish pass).
- **Problem:** `lib/jitai.ts:52-96` returns raw EN headline/body/cta strings. `OverviewTab.tsx:274-278` renders them with no `t()` call. `nextNudge()` receives no `language` param (OverviewTab:154). Hebrew-language regression on the #1 retention surface — same class of defect fixed elsewhere in a prior cycle.
- **Acceptance criteria:** (1) 4 nudge strings (headline, body, cta, and any dynamic segment) moved to `i18n.ts` under EN + HE keys. (2) `language` threaded from the active child profile through `nextNudge()`. (3) All nudge strings resolved via `t()` in the render path. (4) Hebrew copy reviewed for naturalness (arbor-content HE pass).
- **Success metric:** Zero hardcoded EN strings in the JITAI nudge render path; Hebrew-locale users see Hebrew nudge copy on all retained scenarios.
- **Score:** priority = (4 × 4 × 0.9 × 1.0) ÷ 2 = **7.2**

**AP-006** ~~RETRACTED — false finding~~
- **Title:** ~~No post-checkout activation on payment return~~
- **From:** CIL-conv-no-post-checkout-activation (IMPROVEMENT-BACKLOG.md, cycle 2026-06-22, conversion lens, score 22)
- **Status: DROPPED (2026-06-22).** The reality-check adversarial verify confirmed `App.tsx` already handles `?billing=success` (the return param) — the finding was a false positive. The CIL entry is marked `dropped: verified-false`. This AP- id is retired; no build work should be scheduled against it.

**AP-007**
- **Title:** Trust posture invisible at onboarding hand-over moment — add trust chip
- **From:** CIL-trust-posture-invisible-onboarding (IMPROVEMENT-BACKLOG.md, cycle 2026-06-22, trust lens, score 22)
- **Type:** enhancement · **Stream:** cil · **riskClass:** safe
- **Owner pod:** arbor-content + arbor-design
- **Problem:** The strong privacy statement lives only on `AvatarCreator.tsx:194`. The `OnboardingFlow` footer (`ob.footer`) is generic with no privacy or safety link at the exact moment a parent first gives child name, age, and concern. Trust is invisible at the highest-stakes hand-over screen.
- **Acceptance criteria:** (1) One-line trust chip added to OnboardingFlow at or near the first child-data capture step: "Private by default · parent-approved memory · never used to train AI." (2) Chip links to the existing safety/privacy view. (3) Same chip or equivalent mirrored near the first-capture field in the child profile. (4) Copy reviewed for brand voice (calm clinical-humanist; not legalese).
- **Success metric:** Onboarding completion rate stable or improved post-ship (no increase in drop-off at the name/age/concern step); trust-chip present and linking correctly in EN + HE.
- **Score:** priority = (4 × 3 × 0.85 × 1.0) ÷ 1 = **10.2**

**AP-008**
- **Title:** Onboarding age slider stores raw years 0–18 — add months sub-input for 0–2 cohort
- **From:** CIL-onboard-age-years-not-months (IMPROVEMENT-BACKLOG.md, cycle 2026-06-22, activation lens, score 18)
- **Type:** bug · **Stream:** cil · **riskClass:** gated (developmental bucketing change requires arbor-clinical-peds soundness check)
- **Owner pod:** arbor-growth
- **Problem:** `OnboardingFlow.tsx:102` stores raw years 0–18. For ages 0–2, the milestone/corrected-age engine needs months precision + gestation hint — infants are mis-bucketed from screen one, breaking the moat's first payoff. The `ms.gestationHint`/preterm path exists but is never reachable.
- **Acceptance criteria:** (1) When the age slider is set to 0 or 1, a months sub-input is revealed (0–23 months). (2) A gestation-weeks hint prompt appears when months-age is ≤12 (or age=0). (3) Stored value is months-precise for under-2s, feeding the corrected-age engine. (4) arbor-clinical-peds confirms the bucketing logic and sub-input copy before build-ready.
- **Success metric:** Under-2 profiles correctly bucketed into the right milestone band at onboarding; zero 0-year-old bucketing in the corrected-age engine for infants.
- **Score:** priority = (4 × 4 × 0.8 × 1.0) ÷ 2.5 = **5.1** (gated — surfaces for Guy / clinical-peds sign-off before build)

**AP-009**
- **Title:** PlayActivity citation schema — add expertName/citationUrl/sourceOrg fields (schema + render plumbing only)
- **From:** DEM-004 schema half (Council Intake 2026-06-21, demand stream; CIL-capability-expert-cited-activity-content, score 16 in capability table)
- **Type:** enhancement · **Stream:** demand · **riskClass:** safe (schema/render half only; populated citation copy stays gated)
- **Owner pod:** arbor-practice
- **Problem:** `PlayActivity` in `content.ts` has no `expertName`, `citationUrl`, or `sourceOrg` fields. `DailyPlayCard` shows only title + description. The citation schema and render pipeline are the safe pre-req for the gated populated-copy work.
- **Acceptance criteria:** (1) `PlayActivity` type extended with optional `expertName?: string`, `citationUrl?: string`, `sourceOrg?: string`, `citationScope?: string` fields. (2) `DailyPlayCard` renders the citation chip when fields are present (source name + linked URL, never a bare authority badge). (3) "Never fabricated / hidden when absent" is enforced in the render path (no empty chip). (4) No citations populated in this ticket — schema + render only; populated content is a separate gated pass.
- **Success metric:** Schema compiles clean (tsc); render test covers both the present and absent citation states; zero fabricated citations in the shipped render path.
- **Score:** priority = (4 × 4 × 0.9 × 1.0) ÷ 2 = **7.2**

**AP-010**
- **Title:** Surface existing server-side coach citations to the parent (source name + link, no grade)
- **From:** PHI-01 source-citation half (Council Intake 2026-06-21, philosophy stream); board split: source-surfacing is `safe`, evidence-grade rubric is `gated`
- **Type:** enhancement · **Stream:** philosophy · **riskClass:** safe (source-surfacing half only)
- **Owner pod:** arbor-practice (CoachTab)
- **Problem:** Real, verifiable citations already exist server-side (CDC, Harvard Serve-and-Return, Whole-Brain Child, etc.) but are never shown to the parent. Hiding the basis of a coach recommendation is the opposite of the truth-before-avoidance rubric. The evidence-grade rubric is separately gated.
- **Acceptance criteria:** (1) CoachTab surfaces the citation source name and a working URL (the parent can tap to verify). (2) Copy never states "clinically validated by" or implies a clinician endorsed it; honest hedge: "developmentally informed, grounded in public guidance." (3) No adviser/thinker identity in citation copy (CHARTER §3 p11). (4) When a citation is absent, no chip renders (never a fabricated source). (5) Evidence-grade field intentionally omitted — that half awaits board rubric sign-off.
- **Success metric:** Citations visible on CoachTab for all activities with a populated source; parent tap-through to source URL functional (no 404s).
- **Score:** priority = (4 × 4 × 0.8 × 1.0) ÷ 2 = **6.4**
- **⚙️ Implementation finding (2026-06-22, code-verified — read before building):** the citation drawer in `components/coach/CoachAnswerCards.tsx` (L238–286) already EXISTS and renders `contract.sourceCardsUsed`. BUT those are **knowledge-card IDs**, not sources — the LLM returns them as ids (`routes/api.ts:348` "Include sourceCardsUsed as source-card ids"), and the chip just does `src.replace(/-/g," ")`, so a parent sees `"transition bridge 3 5y"`, not "CDC". There is **no URL field** anywhere — `KnowledgeCard` (`knowledge/wiki.ts:4`) has `source?` (provenance string like "CDC") but no link. So AP-010 is NOT a client-only tweak. Correct build: (1) server resolves each used card-id → its card's `source` provenance + a **curated canonical URL** (small `cardId/source → URL` map of the real public sources actually in `src/knowledge`: CDC, AAP, Harvard Center on the Developing Child, etc. — verify each URL 200s, no 404s); (2) return `{source, url}[]` on the coach contract (`contracts/coach.ts`); (3) CoachAnswerCards renders the source NAME as the link text, URL as href, plain text when no URL known (never fabricate); keep the existing hidden-when-absent + G2 hedge. Effort is higher than 2 (cross-layer + URL curation). Still `safe` (no claim/grade), but build it from this finding, not the naive "client tweak" read.

**AP-011**
- **Title:** Escalation copy review pass + jurisdiction currency verification
- **From:** CLI-05 (Council Intake 2026-06-21, clinical stream); board: soundness:pass / claims:none
- **Type:** enhancement · **Stream:** clinical · **riskClass:** gated (touchesClinical — escalation/helpline copy; surfaces for Guy)
- **Owner pod:** arbor-safety
- **Problem:** `safety/escalation.ts` is sound and trilingual (EN/HE/NL) but has no periodic re-review hook. Emergency and helpline numbers can go stale. A stale number on a crisis surface is the app appearing to help while silently failing — the exact "soothe by hiding" pattern the rubric exists to kill.
- **Acceptance criteria:** (1) Every emergency and helpline number in `escalation.ts` verified against a live authoritative source (not re-confirmed from the existing literals). (2) A periodic-review hook (comment + dated record) is added so the next re-review date is explicit. (3) "Pause the plan, get a person" framing preserved verbatim. (4) No adviser/thinker identity in any crisis copy; firewall §0 holds.
- **Success metric:** All numbers verified current against their national registry source; next-review date recorded in the file.
- **Score:** priority = (5 × 5 × 0.9 × 1.0) ÷ 1 = **22.5** (high reach+impact; trivial effort; gated for Guy not for clinical block)

**AP-012**
- **Title:** "Not a diagnosis / not a clinician" honesty surface — one consistent honesty line on all developmental signal surfaces
- **From:** CLI-08 (Council Intake 2026-06-21, clinical stream); board: soundness:pass / claims:none
- **Type:** enhancement · **Stream:** clinical · **riskClass:** gated (touchesClinical — global copy on developmental surfaces; surfaces for Guy)
- **Owner pod:** arbor-design (global: Screening, DevScore, Coach, Practice tabs)
- **Problem:** No single consistent honesty line appears wherever Arbor surfaces a developmental signal. "Clinically validated" / "clinician-reviewed" copy must never appear unless a real named credentialed professional has signed off. The firewall §0 rule is written but not enforced as a product surface.
- **Acceptance criteria:** (1) One consistent, calm honesty line ("developmentally informed, grounded in public guidance — not a clinician's review") added to Screening, DevScore, Coach, and Practice tabs at the point of signal display. (2) A lint check (or search-and-confirm pass at build) confirms "clinically validated" and "clinician-reviewed" strings are absent from all developmental signal surfaces. (3) Copy reviewed for brand voice (not legalese; calm and factual).
- **Success metric:** Honesty line present on all four target surfaces; zero "clinically validated"/"clinician-reviewed" strings in the deployed build.
- **Score:** priority = (5 × 4 × 0.9 × 1.0) ÷ 2 = **9.0** (gated for Guy, not clinical block)

**AP-013**
- **Title:** School-age 7–10 developmental surveillance track — substantiated set (SA1/SA2-obs/SA4/SA5/SA6-SR1-SR4)
- **From:** SA1–SA6 originated by arbor-clinical-lead (IMPROVEMENT-BACKLOG.md 2026-06-22, clinical requirements); substantiated set only
- **Type:** feature · **Stream:** clinical · **riskClass:** safe (substantiated set); gated (HELD set — SA2 WCPM-as-score, SA3 NL-MDR, SA6-SR5-SR7 anxiety/mood cluster surface for Guy)
- **Owner pod:** arbor-growth + arbor-practice
- **Problem:** The product covers 0–5 well but 7–10 year-olds have no surveillance track. CDC stops at 5; AAP Bright Futures / ASHA / Diamond 2013 / Hasbrouck & Tindal ORF / Erikson-Selman-Bowlby cover this band. Parents of school-age children are unserved.
- **Acceptance criteria (substantiated set — safe to build):** (1) SA1: six-domain surveillance for 6–12 (AAP Bright Futures) — milestone checklist for academic/social/emotional/physical/self-care/cognitive. (2) SA2-observation: reading-behavior signals framed as parent-logged observations, never a dyslexia screen. (3) SA4: numeracy sequence (concrete → representational → abstract, AAP Bright Futures). (4) SA5: Diamond-cited EF/homework scaffolding (Diamond 2013, no "improves" efficacy claim). (5) SA6-SR1/SR2/SR4: self-regulation developmental frames (Erikson autonomy/initiative/industry + Selman perspective-taking + Bowlby secure base for school transitions). (6) All copy "developmentally informed, grounded in AAP Bright Futures/ASHA/Diamond 2013" — never "clinically validated." No dyslexia/math-delay/ADHD label; no EF/math "improves" efficacy claim.
- **Gated set (HELD — surfaces for Guy):** SA2 WCPM-percentile-as-score (EU-MDR read required); SA3 NL-education-system mapping (jurisdiction TBD); SA6-SR5-SR7 anxiety/withdrawal/mood cluster (infer-child's-internal-state VETO trigger standing).
- **Success metric:** School-age parents (7–10 cohort) have a populated surveillance track within 60 days of ship; zero dyslexia/ADHD labels in the shipped copy.
- **Score:** priority (substantiated set) = (4 × 4 × 0.8 × 1.0) ÷ 3 = **4.3**

---

### Next wave — top safe + build-ready items (conflict-aware, for arbor-orchestrator)

These 10 items have an AP- id, clear problem, owner pod, acceptance criteria, success metric, and riskClass `safe`. Hand to arbor-orchestrator as Wave PM-01-2026-06-22.

| Priority | AP- id | Title | Owner pod | Effort | Score | Status |
|---|---|---|---|---|---|---|
| 1 | AP-004 | PaywallModal — add per-cadence price display | arbor-billing + arbor-content | 2 | 11.25 | open |
| 2 | AP-007 | Trust chip at onboarding hand-over | arbor-content + arbor-design | 1 | 10.2 | open |
| 3 | ~~AP-005~~ | ~~JITAI nudge hardcoded English~~ | — | — | **SHIPPED REL-ARBOR-002 (2026-06-22)** |
| 4 | ~~AP-006~~ | ~~No post-checkout activation~~ | — | — | **DROPPED (false finding 2026-06-22)** |
| 5 | AP-009 | PlayActivity citation schema + render (plumbing only) | arbor-practice | 2 | 7.2 | open |
| 6 | AP-010 | Surface existing coach citations to parent (source + link, no grade) | arbor-practice | 2 | 6.4 | open |
| 7 | ~~AP-001~~ | ~~Non-pathologizing framing guard~~ | — | — | **SHIPPED REL-ARBOR-001 (2026-06-22)** |
| 8 | AP-002 | Competence Ladder — scaffolding that retires itself | arbor-growth | 3 | 4.0 | open |
| 9 | AP-013 | School-age 7–10 surveillance track (substantiated set only) | arbor-growth + arbor-practice | 3 | 4.3 | open |

**Conflict note:** AP-004 touches `billing/PaywallModal.tsx` + `i18n.ts`. AP-007 touches `OnboardingFlow.tsx` + `i18n.ts`. Both write `i18n.ts` — arbor-orchestrator must sequence them or merge the i18n additions in a single pass. AP-009 + AP-010 both touch `content.ts` + CoachTab render path — coordinate.

---

### Gated — surfaced for Guy (never auto-scheduled)

These items are promoted (have AP- ids) but cannot enter a build wave without explicit human sign-off. The gate is working correctly on all of them.

| AP- id | Item | Gate reason | What would unblock it |
|---|---|---|---|
| AP-003 | Re-engagement "new chapter" nudge | Child-data egress (child name + milestone into notification/email channel) — arbor-safety consent review | arbor-safety consent sign-off + Guy confirms |
| AP-008 | Onboarding age months sub-input | arbor-clinical-peds soundness check on bucketing logic | Clinical-peds lens pass + Guy confirms |
| AP-011 | Escalation copy review + jurisdiction check | touchesClinical — helpline/emergency copy gate | Guy confirms scheduling; board re-confirms numbers |
| AP-012 | Honesty surface — "not a diagnosis" line on all dev signal surfaces | touchesClinical — global copy on developmental surfaces | Guy confirms; arbor-design ships as a co-located change with the next tab update |

Additionally, the following **HELD** items (no AP- id yet) are surfaced for Guy because they are high-priority candidates blocked by a substantive gate — not a process gap:

| Feeder ID | Title | What holds it | Required to promote |
|---|---|---|---|
| CLI-07 | Corrected-age capture + display in onboarding/profile | touchesClinical + child-data; board: soundness:pass (no claim block) | Guy confirms; copy firewall + arbor-safety child-data consent check |
| CLI-02 | Age-window the Development Score | `arbor-clinical-peds` boundary sign-off pending | Peds lens returns soundness:pass on the age→milestone-set mapping |
| CLI-03 | CDC "Act Early" red-flags non-alarmistly | HELD: 16m→18m threshold correction + loss-of-skills detector must be built; dep on CLI-01/07 | Board re-confirms corrected thresholds; loss-of-skills detector scoped |
| PHI-09 | Second-guardian loop | gated: child-record sharing + consent + billing | arbor-safety consent review + Guy confirms reward amount and billing rails |
| DEM-007 | Referral Grant + /join?ref= resolver | gated: billing (writes entitlements) | Guy confirms reward amount; billing rails live end-to-end test confirmed |
| DEM-009 | Double-Aha Onboarding | HELD: day-zero Rhythm "promise" is unsubstantiated developmental prediction | Fix #1: replace promise with invitation; clinical board re-confirms every word of first-run copy |
| DEM-010 | Founding-Member Paywall with 500-slot cap | gated: Level 4 billing; fake-scarcity truth concern | Guy confirms the cap is real and honored; billing + kill-gate scoped |

---

### Clinical gate tally (honest accounting)

**9 items are HELD by the clinical gate.** That is the gate working, not a stall. Each hold is load-bearing:

| HELD item | Specific gate reason |
|---|---|
| DEM-002 | Corrected-age dep (CLI-01/07 must land) + "non-diagnostic framing guarantee" is an unsubstantiated claim |
| DEM-003 | Percentile-as-verdict + wrong chart (WHO/CDC switch missing) + corrected-age dep |
| DEM-009 | Day-zero Rhythm promise asserts a developmental prediction with no record to ground it |
| DEM-012 | "Readiness signals" = implicit developmental-assessment claim; wide normal variation in literacy onset |
| PHI-10 | "ASQ-style monitoring" provenance is false (our heuristic is not the validated, normed ASQ-3) + corrected-age dep |
| CLI-03 | 16m threshold cites the retired DSM-era red-flag list, not the 2022 CDC set; loss-of-skills detector absent from code |
| CLI-04 | Lynch/Coplan thresholds are the discredited parent-impression rule-of-thumb (Hustad 2021 revises >1y later) |
| DEM-005 | Two unsubstantiated claims: "richer than cold telehealth" (effect claim) + "expert" implies Arbor employs/endorses care |
| PHI-02 + PHI-07 + PHI-05 | Briefing copy unwritten; shared brief template is the dep; none promote until template clears peds/psych |

The 9 items above carry real soundness or provenance defects that, if built as written, would false-alarm parents, misrepresent evidence, or create liability. Holding them is the correct outcome.

---

## PM Grooming — 2026-06-22 (Reality-Check Promotion)

**PM:** arbor-pm · **Source read:** `CoS/reviews/Arbor-Reality-Check_2026-06-22.md` — 4-lens verified findings (product · UX/design · devops · marketing). **Gate applied:** BACKLOG-MODEL.md ready-bar. Items already promoted in the prior PM block are noted; this block handles the net-new verified findings only.

**Items already promoted (no duplication):**
- Paywall no price → **AP-004** (CIL-conv-paywall-no-price). Reality-check evidence (`PaywallModal.tsx:45-52`, `i18n.ts`) matches.
- Onboarding age in whole years → **AP-008** (CIL-onboard-age-years-not-months). Reality-check evidence (`OnboardingFlow.tsx:102`) matches.

**Dropped false finding (verified):**
- ~~"No post-checkout activation"~~ (`CIL-conv-no-post-checkout-activation` → promoted as AP-006 from CIL) — the reality-check adversarial verify **CONFIRMED** `App.tsx` already handles `?billing=success`. AP-006 was promoted from the CIL cycle before this verify ran; the finding is **FALSE** as a production gap. AP-006 is **retracted** — marked `dropped: verified-false` in the CIL. No new AP- item issued. The CIL entry is marked below.

**Net-new verified findings from the reality check → AP-014 through AP-021:**

---

### Promoted items — reality-check batch (AP-014…AP-021)

**AP-014**
- **Title:** 3 ComingSoon empty sections in live product — Appointments, Masterclasses, FamilyFormation
- **From:** Arbor-Reality-Check_2026-06-22 (product lens) · evidence: `Appointments.tsx:102`, `Masterclasses.tsx:34`, `FamilyFormation.tsx:64` each render `<ComingSoon/>`; also cross-refs CIL capability table (live-expert-sessions, Masterclasses noted)
- **Type:** bug · **Stream:** product · **riskClass:** safe (structural/navigation; no clinical or child-data surface involved in the ComingSoon shell itself)
- **Owner pod:** arbor-ux (define what ships in each section) + arbor-design (remove/replace dead shell)
- **Problem:** Three sections are live-and-navigable but render nothing except a placeholder. A parent lands on a dead screen. This is the single highest-visibility "unfinished" signal on the app — worse than a missing feature, because the nav promises a screen. Masterclasses and FamilyFormation are marketing-claimed capability surfaces.
- **Acceptance criteria:** (1) Each of the three sections is either (a) replaced with a real, minimal MVP surface that delivers genuine value, or (b) the nav entry is removed/hidden until the surface is ready — no dead `<ComingSoon>` screen visible to a paid user. (2) If a surface is hidden, the nav item is also hidden. (3) Appointments specifically: the existing consult-REQUEST path (MON-3/v1) is the interim real surface — wire it in place of the placeholder. (4) arbor-ux scopes the minimum viable content for Masterclasses and FamilyFormation before build.
- **Success metric:** Zero `<ComingSoon>` renders on navigable screens; parent who visits Appointments sees a functional state (not a placeholder).
- **Score:** priority = (5 × 4 × 0.95 × 1.0) ÷ 2 = **9.5**
- **Notes:** riskClass `safe` for the ComingSoon-removal work. Appointments booking/video/payment is separately `gated` (FR-5 / DEM-005). This ticket is the structural removal only.

**AP-015**
- **Title:** No imagery on any parent surface — add photography/illustration layer to parent-facing screens
- **From:** Arbor-Reality-Check_2026-06-22 (UX/design lens) · evidence: icon + text + pastel blobs only on all parent surfaces; child photo placeholder is an initial letter; Calm/Headspace/Kinedu lead with photography
- **Type:** enhancement · **Stream:** product · **riskClass:** safe (editorial/design; no child photos, no child data — synthetic/stock imagery only)
- **Owner pod:** arbor-ux (art direction + asset selection) + arbor-design (design system integration)
- **Problem:** Every parent surface is text + icon + pastel blobs. No photography or illustration creates a "free-tier" read even for paying users. The category leaders (Calm, Headspace, Kinedu, Lovevery) lead with calm photography as their primary trust/quality signal. The product looks unfinished at first glance regardless of functional depth.
- **Acceptance criteria:** (1) arbor-ux defines an art direction brief: safe, warm, synthetic/stock imagery (never real children; always a parent-with-child silhouette or abstract/illustrative). (2) At least 3 primary parent screens receive a curated imagery layer. (3) Images are optimised for mobile (WebP, lazy-loaded). (4) Imagery does not conflict with the design token system (no inline style overrides). (5) No real child data or child photos — all imagery is synthetic or stock per CHARTER §3.
- **Success metric:** At least 3 parent-facing screens have a real imagery layer; brand review by arbor-brand confirms the imagery is on-essence (calm clinical-humanist, not generic stock).
- **Score:** priority = (5 × 3 × 0.85 × 0.9) ÷ 3 = **3.83**
- **Notes:** Effort is 3 (art direction + asset + integration). Strategic_fit docked to 0.9 — important but not a direct conversion lever. Requires arbor-brand art-direction sign-off on the imagery brief before arbor-design builds.

**AP-016**
- **Title:** Mobile landing hero overflow — clamp hero height so both CTAs are above the fold on 375px
- **From:** Arbor-Reality-Check_2026-06-22 (UX/design lens) · evidence: hero renders at 62.8px on IL mobile-first conversion surface (375px viewport), fills 71% of viewport, both CTAs below the fold
- **Type:** bug · **Stream:** product · **riskClass:** safe (one CSS rule; landing page, no app data surface)
- **Owner pod:** arbor-design (landing page CSS)
- **Problem:** The IL landing page's hero section is 62.8px on a 375px mobile viewport (71% of screen) — both call-to-action buttons are below the fold. Israel is the primary market and mobile-first. This is the highest-value conversion surface and neither CTA is visible without scrolling. One CSS clamp rule fixes it.
- **Acceptance criteria:** (1) Hero height clamped (e.g. `max-height: clamp(280px, 45vh, 380px)` or equivalent) so at 375px viewport both CTAs are visible above the fold. (2) Verified at 375px (iPhone SE), 390px (iPhone 14), and 430px (iPhone 14 Plus) widths. (3) No layout regression on desktop (1280px). (4) The EN landing page receives the same fix.
- **Success metric:** Both CTAs visible without scrolling on a 375px viewport in the IL and EN landing pages; CTA click-through rate trend measurable post-ship.
- **Score:** priority = (5 × 5 × 0.95 × 1.0) ÷ 1 = **23.75** (highest-score safe item from this batch — one-line fix on the primary conversion surface)
- **Notes:** riskClass `safe`. This is the reality-check's "#1 UX fix." Effort = 1 (single CSS rule + test).

**AP-017**
- **Title:** Type scale applied only to shell — sweep remaining arbitrary Tailwind sizes in app interior
- **From:** Arbor-Reality-Check_2026-06-22 (UX/design lens) · evidence: JSX uses arbitrary `text-[10px]`…`text-[1.85rem]`; 10–11px text everywhere reads as a tool dashboard; prior wave (`3c5075e`) applied tokens to shell/kit/HubTabs/ProfileSwitcher/AiRail/DailyPlayCard but did not sweep all 74+ files
- **Type:** enhancement · **Stream:** product · **riskClass:** safe (design system; no data or clinical surface)
- **Owner pod:** arbor-design
- **Problem:** The design token type scale is defined and partially applied (shell + kit components in the prior CIL build wave). The app interior — tabs, cards, coach content, practice screens — still uses arbitrary `text-[Npx]` and `text-[N.NNrem]` Tailwind overrides. The result is 10–11px micro-text on mobile and inconsistent visual hierarchy that signals "free tier."
- **Acceptance criteria:** (1) All `text-[Npx]` and `text-[N.NNrem]` arbitrary Tailwind size classes replaced with the defined token scale (`text-xs` / `text-sm` / `text-base` / `text-lg` / `text-xl` / `text-2xl`) in the app interior. (2) No text rendered below 12px (`text-xs` = 12px floor). (3) Existing token-scale work from `3c5075e` is not regressed. (4) A lint rule or search-gate added to CI that blocks new arbitrary `text-[…]` size classes.
- **Success metric:** Zero `text-[Npx]` or `text-[N.NNrem]` arbitrary size classes remaining in app interior JSX; visual hierarchy legible at 375px without a 10px text instance.
- **Score:** priority = (4 × 3 × 0.9 × 0.9) ÷ 3 = **3.24**
- **Notes:** Effort = 3 (sweep across 74+ files). This is debt reduction — important for the "looks paid" goal but lower conversion leverage than AP-016.

**AP-018**
- **Title:** Dark mode missing — add dark-mode token layer and system preference support
- **From:** Arbor-Reality-Check_2026-06-22 (UX/design lens) · evidence: no dark mode on app or landing page; design review confirmed absent
- **Type:** enhancement · **Stream:** product · **riskClass:** safe (design system; no data or clinical surface)
- **Owner pod:** arbor-design
- **Problem:** No dark mode exists anywhere in Arbor. Calm, Headspace, and every comparable child-wellbeing app ship dark mode. For a parenting app used during night feeds, bedtime routines, and early mornings, dark mode is a quality signal and a practical retention feature.
- **Acceptance criteria:** (1) CSS token layer supports a `dark` variant (CSS `prefers-color-scheme: dark` media query or Tailwind `dark:` prefix). (2) All background, surface, and text tokens have a dark-mode counterpart. (3) System preference is respected by default; a manual toggle in Settings is optional (nice-to-have). (4) Dark mode verified on at least 3 primary screens (Home/Overview, Milestones, Coach) at 375px mobile. (5) The landing page dark mode is out of scope for this ticket — app only.
- **Success metric:** Dark mode renders correctly on the 3 primary screens with zero contrast-ratio failures (WCAG AA minimum 4.5:1 for normal text); system-preference toggle activates it automatically.
- **Score:** priority = (4 × 3 × 0.85 × 0.85) ÷ 3 = **2.89**
- **Notes:** Effort = 3. Strategic_fit 0.85 — "looks paid" / retention signal; not a direct conversion lever. Blocked by AP-019 (CSS override arch) if the hardcoded hex is in the same files — sequence AP-019 first or coordinate with arbor-design.

**AP-019**
- **Title:** CSS override architecture — replace 304 hardcoded hex + !important hack with design token layer
- **From:** Arbor-Reality-Check_2026-06-22 (UX/design lens) · evidence: 304 hardcoded hex values across 74 files fighting a `!important` CSS-override hack in `index.css`; override layer cannot reach inline styles
- **Type:** enhancement · **Stream:** product · **riskClass:** safe (design system refactor; no data or clinical surface)
- **Owner pod:** arbor-design (owns the index.css merge-lock chain per ROSTER.md)
- **Problem:** The styling architecture has 304 hardcoded hex literals across 74 files plus a `!important` cascade override in `index.css`. The override layer cannot reach inline styles. This is the root cause of the "unfinished inconsistency" read — styles fight each other, theming is impossible, and dark mode (AP-018) cannot be built cleanly on top of this. This is the design-system keystone that all other visual-polish work depends on.
- **Acceptance criteria:** (1) A sweep of all 304 hardcoded hex values replaces them with the existing design token variables (CSS custom properties or Tailwind config). (2) The `!important` override block in `index.css` is reduced to zero (or to a documented, justified minimal set). (3) All 74 affected files pass a post-sweep visual regression check (screenshot comparison or manual review). (4) A CI lint rule blocks new hardcoded hex literals from being added. (5) arbor-design holds the index.css merge-lock during this work (no parallel token changes).
- **Success metric:** Zero hardcoded hex literals in JSX/CSS after sweep (excluding the token definition file itself); the `!important` override count at zero or documented; CI gate blocks new hex additions.
- **Score:** priority = (4 × 4 × 0.9 × 1.0) ÷ 4 = **3.6** (effort = 4: 74-file sweep + regression check)
- **Notes:** This is the prerequisite for AP-018 (dark mode) and for AP-017 (type scale sweep) to be stable. Sequence first among the design-system batch. arbor-design owns the merge-lock.

**AP-020**
- **Title:** Palette split — align app slate-green/emerald palette with landing navy/teal brand palette
- **From:** Arbor-Reality-Check_2026-06-22 (UX/design lens) · evidence: app palette (slate-green/emerald) ≠ landing palette (navy/teal); brand incoherence at the click-through seam
- **Type:** enhancement · **Stream:** product · **riskClass:** safe (design system; no data or clinical surface)
- **Owner pod:** arbor-design + arbor-brand (sign-off on the canonical palette)
- **Problem:** The in-app palette (slate-green/emerald) and the marketing landing page palette (navy/teal) are visually distinct enough that a parent who clicks through from the landing page sees a brand mismatch. This undercuts trust at the exact moment the user has committed to trying the product.
- **Acceptance criteria:** (1) arbor-brand defines the ONE canonical Arbor palette (resolving the split). (2) Either the app palette or the landing palette is updated to match (brand decision — arbor-brand holds veto). (3) The resolved palette is encoded as design tokens (CSS custom properties) in both the app and the landing page. (4) The IL HE landing page (sage paper + emerald clay, per memory) is confirmed as the reference brand expression and the decision is recorded in BRAND-STRATEGY.md. (5) Visual regression check on at least the landing page hero and the app Home screen.
- **Success metric:** App and landing page share the same primary palette; brand-consistency review by arbor-brand passes; no "two different apps" read at the click-through.
- **Score:** priority = (4 × 3 × 0.85 × 0.9) ÷ 3 = **3.06**
- **Notes:** Depends on AP-019 (hardcoded hex sweep) — do not execute this until the token layer is clean. arbor-brand decision gates the direction; arbor-design builds. Effort = 3 (two surfaces + token layer).

**AP-021**
- **Title:** /healthz endpoint not wired to deploy gate — wire existing smoke test + health endpoint into CI/CD pipeline
- **From:** Arbor-Reality-Check_2026-06-22 (devops lens) · evidence: `healthz.ts` + `post-deploy-smoke.mjs` exist in repo but are wired to nothing; `cloudbuild.prod.yaml:34-44` has no `--no-traffic`/`--tag` canary; deploy skips `check:framework`+`eval:safety`; cross-refs OPS-A2 (wire smoke), OPS-A3 (canary), OPS-B3 (full gate in deploy)
- **From (additional):** reality-check also references `REL-ARBOR-001` (the release standard is doc-only so far)
- **Type:** enhancement · **Stream:** product (DevOps) · **riskClass:** safe (wiring existing artefacts; no new app logic or data surface)
- **Owner pod:** arbor-release (CI/CD pipeline; coordinates with arbor-devsecops-lead)
- **Problem:** The deploy pipeline (`arbor-deploy.yml` / `cloudbuild.prod.yaml`) skips `check:framework` and `eval:safety`, promotes 100% to prod with no canary, and never runs the smoke tests (`post-deploy-smoke.mjs`) or the health endpoint (`healthz.ts`) that already exist in the repo. The deploy gate is weaker than the CI gate. This is the structural reason built work never reaches users safely — `REL-ARBOR-001`.
- **Acceptance criteria:** (1) `check:framework` and `eval:safety` added to `arbor-deploy.yml` (OPS-B3). (2) `post-deploy-smoke.mjs` wired as a post-deploy step in `cloudbuild.prod.yaml`; failure rolls back (OPS-A2). (3) A canary (`--no-traffic` tag step before `--traffic=100`) introduced in `cloudbuild.prod.yaml` (OPS-A3). (4) `/healthz` endpoint tested to return 200 as part of the smoke run. (5) All changes land on a branch off `origin/main` (not the local stale workspace) per the reality-check finding.
- **Success metric:** Next prod deploy runs `eval:safety`+`check:framework` + smoke test + canary promotion; a synthetic smoke failure rolls back without manual intervention; the build log shows all four gates passed.
- **Score:** priority = (5 × 5 × 0.95 × 1.0) ÷ 2 = **23.75** (tied with AP-016 as the top-score items; pipeline integrity blocks the entire release cycle)
- **Notes:** riskClass `safe` (wiring existing code, no app logic change). Must be built off `origin/main` — local `main` is 94 commits behind. Pair with REL-ARBOR-001 staging branch (`rel/arbor/001`). arbor-release owns; arbor-devsecops-lead holds the ship-gate veto.

---

### Triage log — reality-check batch

| Finding | Type | Disposition | AP- id |
|---|---|---|---|
| Paywall no price (PaywallModal.tsx:45-52) | bug | Already promoted — AP-004 | existing |
| Onboarding age whole years (OnboardingFlow.tsx:102) | bug | Already promoted — AP-008 | existing |
| Post-checkout activation (??billing=success) | bug | **DROPPED — false finding.** App.tsx already handles `?billing=success`; verified by reality-check adversarial pass. AP-006 retracted (see IMPROVEMENT-BACKLOG note). | dropped |
| 3 ComingSoon sections (Appointments/Masterclasses/FamilyFormation) | bug | Promoted | **AP-014** |
| No imagery on parent surfaces | enhancement | Promoted | **AP-015** |
| Mobile hero overflow — 62.8px, CTAs below fold | bug | Promoted | **AP-016** |
| Type scale unused in app interior (arbitrary text-[Npx]) | enhancement | Promoted (residual gap after `3c5075e` partial fix) | **AP-017** |
| Dark mode missing | enhancement | Promoted | **AP-018** |
| CSS override arch — 304 hardcoded hex + !important | enhancement | Promoted | **AP-019** |
| Palette split — app ≠ landing | enhancement | Promoted | **AP-020** |
| /healthz + smoke test unwired in deploy gate | enhancement | Promoted | **AP-021** |

---

### Next wave — updated top safe + build-ready items (after reality-check promotion)

New items added to the wave board. Items are `safe` unless marked otherwise.

| Priority | AP- id | Title | Owner pod | Effort | Score |
|---|---|---|---|---|---|
| 1 (tie) | AP-016 | Mobile landing hero overflow — clamp hero | arbor-design | 1 | 23.75 |
| 1 (tie) | AP-021 | Wire /healthz + smoke + canary into deploy | arbor-release | 2 | 23.75 |
| 3 | AP-014 | Remove 3 ComingSoon sections / wire Appointments | arbor-ux + arbor-design | 2 | 9.5 |
| 4 | AP-019 | CSS override arch sweep (prerequisite for AP-017/018/020) | arbor-design | 4 | 3.6 |
| 5 | AP-015 | Imagery layer on parent surfaces | arbor-ux + arbor-design | 3 | 3.83 |
| 6 | AP-017 | Type scale sweep — app interior | arbor-design | 3 | 3.24 |
| 7 | AP-020 | Palette split alignment (after AP-019) | arbor-design + arbor-brand | 3 | 3.06 |
| 8 | AP-018 | Dark mode token layer (after AP-019) | arbor-design | 3 | 2.89 |

**Gated from this batch:** none — all 8 new items are `safe`. Design items AP-017/018/019/020 must be sequenced (AP-019 first; AP-017/018/020 depend on it). AP-021 must be built off `origin/main`.

---

## Council Intake — 2026-06-22 (Marketing Capability-Map → Product handoff, FR-1…FR-14)

**Source:** the Arbor Marketing Mesh capability×competitor benchmark ([`mesh/marketing/CAPABILITY-MAP.md`](marketing/CAPABILITY-MAP.md), full scores in [`MARKETING-BACKLOG.md`](marketing/MARKETING-BACKLOG.md) §9a). **Stream:** `market`. These are **product** builds that the six-surface positioning is honest-gated on — i.e. marketing **cannot ship a specific claim** until the matching FR lands. Marketing owns the counter-narrative; **product owns these builds.** Council/PM: triage into `AP-` ids and sequence; clinical/child-data items ride the existing gate. Most map to known keystones — **promote, don't duplicate** (cross-refs noted).

> **Why this block exists / how to execute it:** each row gives *what to build · acceptance · gate*. Build in priority order. The three **P0s gate the whole repositioning + the viral GTM**; ship them first.

### P0 — gate the repositioning + the viral engine
| FR | Title | Build (what) · Acceptance | Owner pod | Risk |
|----|-------|----------------------------|-----------|------|
| **FR-7** | Infant age in **months** (0–24mo correctness) | **Build:** `ChildProfile.age` currently integer-YEARS → a 6-month-old = "0" gets zero milestones/monitoring. Store DOB / age-in-months; milestone + monitoring engines key off months for 0–24mo. **Accept:** a 6-month-old shows month-correct milestones + Rhythm/Daily-Play personalize; data migration is reversible. **Cross-ref:** this is the known infant-months keystone (ties to CLI-07 corrected-age) — promote that, don't open a duplicate. | arbor-growth + arbor-memory (schema) | **gated** (schema migration — Guy confirm; clinical board on month-thresholds) |
| **FR-3** | **Ambient capture** (voice/widget, ≤3 taps) | **Build:** a lock-screen/home-screen quick-capture widget + a voice-log shortcut so logging a Moment is ≤3 taps from anywhere. **Why:** log volume is the moat's fuel — every personalization claim (Rhythm/Daily Play/coach) thins if capture is hard. **Accept:** a parent logs a behavior moment in ≤3 taps without opening the app to a deep screen; event lands in the record. | arbor-native (widget/voice) + arbor-memory + arbor-design (UX) | safe (no child-data egress; on-device capture) |
| **FR-14** | **Hero Comic share/export loop** — the kid-hero VIRAL payload | **Build:** a completed Academy **Story Journey** → renders + exports a **shareable Hero Comic** (stylized hero avatar, **never a real face**) with the referral deep-link; the parent shares it. **Why:** this is the kids-Academy viral acquisition loop the GTM thesis rests on — currently unbuilt. **Accept:** finish a Story Journey → one-tap produces a branded, shareable comic image carrying `/join?ref=`; C2PA/SynthID-signed; zero real-child media. **Cross-ref:** `mk-p0-3-share-export` + `p1-comic-reader`. | arbor-avatar (render/export) + arbor-api (share link) + arbor-billing (entitlement) | **gated** (share export + avatar pipeline + child-data guard) |

### P1 — unlock the gated surfaces (Care, Practice, Rhythm-ambient, portability)
| FR | Title | Build (what) · Acceptance | Owner pod | Risk |
|----|-------|----------------------------|-----------|------|
| **FR-5** | **Specialist booking + payment + video** (completes Ask a Specialist / Arbor Care) | **Build:** booking/scheduling + payment + video on top of the existing consult-packet, so "Ask a Specialist" completes the loop. **Accept:** a parent books, pays, and meets a specialist who opens holding the context packet. **Gate:** until live, marketing must NOT claim "speak to a specialist" — Care markets the *warm-handoff* only. | arbor-billing + arbor-api | **gated** (billing + child-memory-packet share) |
| **FR-10** | **Practice Studio feedback loop** verify + parent dashboard | **Build:** confirm/repair the practice→record→coach pipeline end-to-end; add a parent-visible session summary + session-length/screen-time controls. **Accept:** a child's Practice session writes to the timeline + is referenceable by the coach; parent sees a session summary + can set limits. **Gate:** the "practice writes to the record" marketing hook (AM-NEW-7) is held until this is verified live. | arbor-practice + arbor-memory | safe |
| **FR-1** | **Push/widget at the predicted Rhythm window** | **Build:** background push + a Rhythm home/lock-screen widget that surfaces the day-band prediction at the predicted hour. **Accept:** the parent gets the "5pm friction window" nudge without opening the app; enables the "I was right" share mechanic (AM-NEW-2). | arbor-native + arbor-growth | **gated** (FCM background push + consent) |
| **FR-12** | **Professional-readable export** (web/PDF, no app needed) | **Build:** the consult packet / record exports as a clean web link + PDF a non-Arbor pediatrician/SLP can open on any device. **Accept:** a receiving professional opens the summary without installing Arbor; makes Trusted Sharing real. | arbor-memory + arbor-api | safe |
| **FR-6** | **Parent data portability** (export + GDPR erasure UI) | **Build:** one-tap export of the full child record (PDF + structured JSON) + a right-to-erasure UI. **Why:** the parent-owned counter to Nanit's coming hardware-gated longitudinal moat; also GDPR Art. 20 compliance. **Accept:** parent exports + can delete; both verified. | arbor-memory + arbor-safety | **gated** (child-data, COPPA/GDPR) |

### P2 — depth that strengthens the per-pillar claims
| FR | Title · Build / Accept | Owner pod | Risk |
|----|------------------------|-----------|------|
| **FR-13** | **Story-Journey depth + virtue-scoring fix** — expand the kids' story library; finish the Peterson-backlog Epic-A fix so avoidance ≠ virtue (avoidant choices award 0 primary-virtue points). Accept: no decision option labeled retreat/avoidance awards courage/wisdom/responsibility; tests lock it. | arbor-practice (stories) | safe |
| **FR-2** | **Daily Play library → 500+** with expert attribution (CDC/AAP/named source per activity). Accept: no activity repeats within a 4-week window for an active child. | arbor-growth | safe |
| **FR-8** | **Surface Language & Communication tracking** in My Child + wire Practice Studio outcomes back to it. Accept: a speech flag is visible in My Child and feeds the coach/handoff packet. | arbor-growth + arbor-practice | safe |
| **FR-9** | **20+ named-expert Parent Masterclasses**, record-indexed (replaces today's mostly-"Coming soon" catalog). Accept: ≥20 real classes; surfacing reflects the child's logged concerns; no fake-catalog cards. | arbor-product (parent academy) | safe |
| **FR-4** | **Community layer** — second-guardian digest now; record-safe parent-cohort sharing later (no child data in the shared layer). Accept: a parent shares a digest with a second guardian; no child PII leaves the record. | arbor-api + arbor-safety | **gated** (consent + moderation) |
| **FR-11** | **Growth Plans completion mechanics** — progress indicator + day-3/7 check-in nudge. Accept: multi-week plans show progress + re-engage at stall. | arbor-growth | safe |

**Handoff status:** recorded here + in `MARKETING-BACKLOG.md` §9a. Awaiting Council/PM promotion to `AP-` ids + sequencing into a wave.

---

*Grooming cycle complete 2026-06-22. Next: hand Wave PM-01-2026-06-22 to arbor-orchestrator. Surface gated list to Guy. Re-score after CLI-07 and the brief-template clinical sign-off land (both unblock multiple HELD items).*

---

## PM Grooming — Promoted from CIL 2026-06-22 (cycles 2026-06-22 + 2026-06-22b)

**PM:** arbor-pm · **Date:** 2026-06-22 · **Sources:** `improvement/IMPROVEMENT-BACKLOG.md` cycles 2026-06-22 (conversion/retention/trust) + 2026-06-22b (functional/prod-health). **Highest AP- id before this block: AP-021.**

> **RELEASE-COORDINATION BLOCKER — `main` green-gate is currently RED.**
> 8 tsc errors + 6 test failures are present on `main` as of cycle 2026-06-22b. Several originate in code that lives on un-merged branches (mig/waf multi-session entanglement). The deployed Cloud Run revision matches `main` so these gaps are in prod. The release train **must resolve this red gate before the next merge wave.** Specific tickets that would clear identified red-gate items: **AP-023** clears the `appCheckConfig` tsc TS2339 error; **AP-024** clears the `createAiQuota` tsc + 3 test failures; **AP-026** clears the 3 SEC-1 `MarkdownBlock` test failures. These three items are therefore release-coordination **priority** items in addition to their CIL scores.

---

### Triage log — CIL 2026-06-22 + 2026-06-22b

| Feeder ID | Title | Type | Stream | Disposition | AP- id |
|---|---|---|---|---|---|
| CIL-bugs-entitlement-write-undefined-500 (shipped) | RevenueCat webhook undefined Firestore write — SHIPPED; firebase.json `/webhooks/**` rewrite remaining | bug | cil | Core fix deployed (commit `9afe5e6`, Cloud Run `arbor-api-00113-diw`). Remaining robustness tail (hosting rewrite) promoted as a low-priority follow-on | **AP-022** |
| CIL-conv-paywall-no-price | PaywallModal shows no price / annual-savings anchor | bug | cil | Already promoted as **AP-004** in the prior PM block | existing AP-004 |
| CIL-lang-jitai-nudge-en-regression | JITAI home nudge hardcoded English | bug | cil | Already promoted as **AP-005** | existing AP-005 |
| CIL-trust-posture-invisible-onboarding | Trust chip invisible at onboarding | enhancement | cil | Already promoted as **AP-007** | existing AP-007 |
| CIL-onboard-age-years-not-months | Onboarding age in whole years — infant mis-bucket | bug | cil | Already promoted as **AP-008** (gated) | existing AP-008 |
| CIL-bugs-csp-img-src-storage | CSP img-src omits Firebase Storage host — child photos broken | bug | cil | Promoted — visible prod breakage, 1-line fix | **AP-023** |
| CIL-bugs-tsc-appcheckconfig | `requireAppCheck` missing from ArborConfig → tsc TS2339 + App Check never enforces | bug | cil | Promoted — red gate + App Check off in prod | **AP-024** |
| CIL-bugs-tsc-aiquota-globalceiling | `createAiQuota` global ceiling unimplemented — tsc red + 3 test fails | bug | cil | Promoted — gated (cost gate) + red gate contributor | **AP-025** |
| CIL-bugs-xss-markdownblock | `MarkdownBlock.parseInline()` strips no HTML — 3 SEC-1 tests red | bug | cil | Promoted — security + red gate | **AP-026** |
| CIL-bugs-csp-appcheck-blocked | CSP omits App Check / reCAPTCHA hosts | bug | cil | Promoted — App Check blocked in prod | **AP-027** |
| CIL-bugs-vision-consent-missing | `/api/vision` + ArborVision.tsx upload with no consent gate | bug | cil | Promoted — gated (COPPA/child-data); re-confirm vs shipped A2 consent gate | **AP-028** |
| CIL-bugs-firestore-rules-skip | Firestore rules tests always skip — child-data boundary untested | bug | cil | Promoted — child-data test gap | **AP-029** |
| CIL-bugs-healthz-404 | `/healthz` 404 via hosting — health probe dead | bug | cil | Promoted — cross-ref AP-021 (deploy gate); this is the *hosting-route* half | **AP-030** |

**De-dupe notes:**
- CIL-bugs-csp-img-src-storage (AP-023) and CIL-bugs-csp-appcheck-blocked (AP-027) are distinct CSP directives in `cspDirectives()` (`createApp.ts`) — two different `img-src` vs `connect-src`/`frame-src` entries. Both promoted separately; coordinate as a single-PR pass on the CSP function.
- CIL-bugs-healthz-404 (AP-030) and AP-021 (deploy gate) overlap in theme: AP-021 wires the health check into CI; AP-030 fixes the hosting rewrite so `/healthz` is reachable at all. AP-030 is a prerequisite for AP-021's smoke test to pass. Sequence AP-030 first.
- CIL-bugs-vision-consent-missing (AP-028) references the shipped A2 consent gate — build pod must read the existing gate before touching this. If A2 covers the `/api/vision` path on `main`, the ticket may reduce to a coverage verification task only.

---

### Promoted items — CIL 2026-06-22 batch (AP-022…AP-030)

**AP-022**
- **Title:** RevenueCat webhook — add `/webhooks/**` firebase.json hosting rewrite to Cloud Run
- **From:** CIL-bugs-entitlement-write-undefined-500 (IMPROVEMENT-BACKLOG.md cycle 2026-06-22b, robustness tail; core fix `9afe5e6` already shipped to prod on 2026-06-22)
- **Type:** enhancement · **Stream:** cil · **riskClass:** safe (routing config only; entitlement write logic is already fixed and deployed)
- **Owner pod:** arbor-api
- **Assignee:** arbor-api
- **Problem:** RevenueCat currently hits the Cloud Run URL directly (which works), but the Firebase Hosting URL (`arborparentingapp.com/webhooks/...`) returns 404 because `firebase.json` has no `/webhooks/**` rewrite rule pointing to Cloud Run. If RevenueCat's webhook URL is ever updated to the brand domain, paid upgrades would silently fail again. Low urgency (RC hits Cloud Run direct today) but closes a latent reliability gap.
- **Acceptance criteria:** (1) `firebase.json` gains a `/webhooks/**` rewrite rule routing to the Cloud Run `arbor-api` service. (2) A curl to `https://arborparentingapp.com/webhooks/revenuecat` returns 200/201 (not 404). (3) No regression on existing hosting rewrites. (4) The change is a firebase.json edit only — no application code change.
- **Success metric:** Hosting URL for the webhook endpoint returns a non-404 response; existing routes unaffected.
- **Score:** priority = (3 × 3 × 0.9 × 1.0) ÷ 1 = **8.1** (low urgency since RC uses direct URL; low effort)
- **Gate notes:** `safe` — routing config. Standard DevSecOps gate only.

---

**AP-023**
- **Title:** CSP `img-src` omits `firebasestorage.googleapis.com` — child photos broken in prod
- **From:** CIL-bugs-csp-img-src-storage (IMPROVEMENT-BACKLOG.md cycle 2026-06-22b, bugs lens, score 46)
- **Type:** bug · **Stream:** cil · **riskClass:** safe (additive CSP header entry; no application logic change)
- **Owner pod:** arbor-api
- **Assignee:** arbor-api
- **Problem:** The `img-src` directive in `createApp.ts cspDirectives()` does not include `firebasestorage.googleapis.com`. Every uploaded child photo and behavior-log attachment renders as a broken image after a successful upload because `getDownloadURL()` returns a URL on that host. Verified via curl against prod CSP header. Visible prod breakage for any user who has uploaded a photo.
- **Acceptance criteria:** (1) `firebasestorage.googleapis.com` added to the `img-src` directive in `cspDirectives()` in `createApp.ts`. (2) Prod CSP verified via curl post-deploy to confirm the header includes the host. (3) An existing child photo URL (or a synthetic test fixture URL on that host) loads without a CSP violation in the browser console. (4) No regression on other CSP directives.
- **Success metric:** Zero CSP img-src violations for Firebase Storage URLs in prod; uploaded child photos render correctly.
- **Score:** priority = (5 × 5 × 0.9 × 1.0) ÷ 1 = **22.5** (high: visible prod breakage affecting every user with uploaded photos; 1-line fix)
- **Gate notes:** `safe`. Coordinate with AP-027 (CSP connect-src/frame-src) — both touch `cspDirectives()`; ship as a single CSP PR to avoid partial states.
- **Release-gate:** This item does NOT address a `main` tsc/test failure directly. It is a prod-visible breakage fix.

---

**AP-024**
- **Title:** `requireAppCheck` missing from ArborConfig — tsc TS2339 + App Check never enforces
- **From:** CIL-bugs-tsc-appcheckconfig (IMPROVEMENT-BACKLOG.md cycle 2026-06-22b, bugs lens, score 47)
- **Type:** bug · **Stream:** cil · **riskClass:** safe (type declaration + env-var wiring; no business logic change)
- **Owner pod:** arbor-api
- **Assignee:** arbor-api
- **Problem:** `appCheckMiddleware.ts:46` reads `config.requireAppCheck` but the field is absent from `ArborConfig` in `env.ts`. This produces a tsc TS2339 compile error AND means App Check enforcement is silently OFF regardless of what `REQUIRE_APP_CHECK` is set to in the environment — a security posture gap in prod.
- **Acceptance criteria:** (1) `requireAppCheck: boolean` added to `ArborConfig` interface in `env.ts`. (2) The field is wired from the `REQUIRE_APP_CHECK` env var (default `false` for safety in case the var is absent). (3) `appCheckMiddleware.ts` reads the config field without tsc error. (4) tsc compiles clean on `main` (this error cleared). (5) A unit test confirms the middleware respects the flag (enforces when true, skips when false).
- **Success metric:** tsc TS2339 error for `requireAppCheck` cleared; App Check enforcement correctly toggled by the env var in CI.
- **Score:** priority = (4 × 4 × 0.95 × 1.0) ÷ 1 = **15.2** (red gate + security gap; 1-line fix)
- **Gate notes:** `safe`. This is a **red-gate item** — clearing it removes one of the 8 tsc errors on `main`.
- **Release-gate:** Clears `appCheckMiddleware.ts:46` tsc TS2339.

---

**AP-025**
- **Title:** Global AI cost ceiling (`globalHourlyLimit`) unimplemented — tsc + 3 test failures + unbounded AI spend
- **From:** CIL-bugs-tsc-aiquota-globalceiling (IMPROVEMENT-BACKLOG.md cycle 2026-06-22b, bugs lens, score 40)
- **Type:** bug · **Stream:** cil · **riskClass:** gated (cost — implements a cost-control ceiling; any change to AI quota logic requires Guy sign-off per the cost gate)
- **Owner pod:** arbor-api
- **Assignee:** arbor-api (pending Guy sign-off on ceiling values)
- **Problem:** `createAiQuota` is called in the test suite with a 2-argument form that includes `globalHourlyLimit`, but the function does not accept or implement that parameter. This produces 4 tsc errors and 3 test failures on `main`. More critically, it means the global AI cost ceiling is unimplemented — there is no per-hour hard cap on AI spend across all users, which is the primary cost-runaway protection.
- **Acceptance criteria:** (1) `createAiQuota` extended to accept `globalHourlyLimit: number` as a second parameter. (2) Implementation enforces a global hourly token/request ceiling (reject with 429 when the ceiling is hit). (3) All 4 tsc errors and 3 test failures cleared. (4) Guy confirms the ceiling value (requests/hour or tokens/hour) before the test constants are finalized — this is the cost-gate decision. (5) The ceiling is configurable via env var (not hardcoded).
- **Success metric:** tsc + all AI quota tests green on `main`; global hourly ceiling active in prod and confirmed via a load test or manual trigger.
- **Score:** priority = (5 × 5 × 0.9 × 1.0) ÷ 2 = **11.25** (red gate + unbounded cost risk)
- **Gate notes:** `gated (cost)`. Guy must confirm the ceiling value before the implementation constants ship. The tsc fix (function signature) can be scoped separately as a 1-line safe change if needed to unblock CI, but the enforcement logic requires the cost gate. **This is a red-gate item** — clearing it removes 3 test failures on `main`.
- **Release-gate:** Clears `createAiQuota` tsc errors + 3 test failures.

---

**AP-026**
- **Title:** `MarkdownBlock.parseInline()` strips no HTML — 3 SEC-1 XSS defense-in-depth tests red
- **From:** CIL-bugs-xss-markdownblock (IMPROVEMENT-BACKLOG.md cycle 2026-06-22b, bugs lens, score 36)
- **Type:** bug · **Stream:** cil · **riskClass:** safe (defense-in-depth sanitization; React already escapes, so no live XSS, but the gate is red and the strip is a required defense layer)
- **Owner pod:** arbor-ai
- **Assignee:** arbor-ai
- **Problem:** `MarkdownBlock.parseInline()` does not strip HTML angle-bracket content before the bold-split logic. Three SEC-1 tests that verify defense-in-depth HTML stripping are failing on `main`. React's own escaping prevents a live XSS vector, but the test gate is red and the defense-in-depth layer is required by the security standard.
- **Acceptance criteria:** (1) A single `text.replace(/<[^>]*>/g, '')` (or equivalent) applied before the bold-split in `parseInline()`. (2) All 3 SEC-1 test assertions pass. (3) No regression on existing bold/italic/link parsing in `MarkdownBlock`. (4) tsc compiles clean.
- **Success metric:** All `MarkdownBlock` SEC-1 tests pass on `main`; no HTML angle-bracket content survives `parseInline()` in the test suite.
- **Score:** priority = (4 × 4 × 0.95 × 1.0) ÷ 1 = **15.2** (red gate + security; 1-line fix)
- **Gate notes:** `safe`. **This is a red-gate item** — clearing it removes 3 SEC-1 test failures on `main`.
- **Release-gate:** Clears 3 `MarkdownBlock` SEC-1 test failures.

---

**AP-027**
- **Title:** CSP `connect-src`/`frame-src` omit App Check + reCAPTCHA hosts — App Check token fetch blocked in prod
- **From:** CIL-bugs-csp-appcheck-blocked (IMPROVEMENT-BACKLOG.md cycle 2026-06-22b, bugs lens, score 27)
- **Type:** bug · **Stream:** cil · **riskClass:** safe (additive CSP header entries; no application logic change)
- **Owner pod:** arbor-api
- **Assignee:** arbor-api
- **Problem:** `connect-src` and `frame-src` in `cspDirectives()` do not include the App Check token endpoint (`firebaseappcheck.googleapis.com`) or the reCAPTCHA hosts (`gstatic.com`, `www.recaptcha.net`). When App Check is enabled (see AP-024), the token fetch is immediately blocked by the browser's CSP, defeating the entire enforcement. This means enabling App Check via AP-024 is a no-op until AP-027 ships.
- **Acceptance criteria:** (1) `connect-src` gains `https://firebaseappcheck.googleapis.com` and the reCAPTCHA host(s) required by the Firebase App Check SDK. (2) `frame-src` gains the reCAPTCHA iframe host if required. (3) Prod CSP verified via curl post-deploy. (4) With AP-024 deployed, the browser console shows no CSP violation when App Check initializes. (5) No regression on other CSP directives.
- **Success metric:** Zero CSP violations for App Check/reCAPTCHA requests in the browser console; App Check token fetch succeeds in prod once AP-024 is live.
- **Score:** priority = (4 × 4 × 0.9 × 1.0) ÷ 1 = **14.4** (App Check is the security layer; this unblocks it)
- **Gate notes:** `safe`. Coordinate with AP-023 (img-src) — ship all CSP additions as one PR touching `cspDirectives()`. AP-027 is a functional dependency of AP-024 (App Check enforcement): AP-024 + AP-027 must ship together or in immediate sequence.

---

**AP-028**
- **Title:** `/api/vision` + ArborVision.tsx upload child photos with no consent gate — re-confirm vs shipped A2 gate
- **From:** CIL-bugs-vision-consent-missing (IMPROVEMENT-BACKLOG.md cycle 2026-06-22b, bugs lens, score 23)
- **Type:** bug · **Stream:** cil · **riskClass:** gated (COPPA/child-data — photo upload without consent gate is a compliance gap; arbor-safety holds veto)
- **Owner pod:** arbor-safety
- **Assignee:** arbor-safety (re-confirm path; arbor-api if a fix is needed)
- **Problem:** `/api/vision` and `ArborVision.tsx` upload child photos but the cycle 2026-06-22b audit could not confirm the shipped A2 consent gate covers this specific path on `main`. The cycle-2026-06-21 finding (CIL-bugs-vision-no-consent-gate, score 47) identified this as a COPPA gap; the A2 consent wave was described as shipped but the exact coverage of `/api/vision` needs verification before this can be closed.
- **Acceptance criteria:** (1) `arbor-safety` reviews the current `main` code for `/api/vision` and `ArborVision.tsx` and confirms whether `requireConsent` middleware is applied. (2) If covered: a code comment + test assertion documents the coverage, and this ticket closes as a verification task. (3) If NOT covered: `requireConsent` middleware is wired to `/api/vision`; `ArborVision.tsx` sends `childId` (so the middleware can verify consent on the correct child record); the route fails-closed (451) when consent is absent. (4) arbor-safety sign-off before build ships.
- **Success metric:** `/api/vision` is demonstrably covered by the consent gate on `main`; a test asserts the 451 response when consent is absent.
- **Score:** priority = (5 × 5 × 0.85 × 1.0) ÷ 2 = **10.6** (gated — COPPA compliance; surfaces for Guy)
- **Gate notes:** `gated (child-data/COPPA)`. arbor-safety veto applies. Guy confirms before scheduling. **Do not build without safety sign-off.**

---

**AP-029**
- **Title:** Firestore security-rules tests always skip — child-data access boundary untested in CI
- **From:** CIL-bugs-firestore-rules-skip (IMPROVEMENT-BACKLOG.md cycle 2026-06-22b, bugs lens, score 22)
- **Type:** bug · **Stream:** cil · **riskClass:** safe (CI test infrastructure; no application logic change)
- **Owner pod:** arbor-api
- **Assignee:** arbor-api
- **Problem:** `firestore.rules.test.ts:7` is `describe.skip` unless `FIRESTORE_EMULATOR_HOST` is set, which is never set in CI. The cross-family child-data access boundary (the most critical security boundary in the product) is therefore never automatically tested. A rules regression would pass the gate undetected.
- **Acceptance criteria:** (1) Either (a) a Firestore emulator is added to the CI environment via a `globalSetup` script, or (b) a `test:rules` npm script is added that starts the emulator locally and runs the rules tests, and this script is added to the gate. (2) `describe.skip` is removed; the tests run unconditionally in CI. (3) All existing rules tests pass. (4) At minimum: a cross-family read test asserts that a parent can read their own child's data and CANNOT read another family's child data.
- **Success metric:** Firestore rules tests run in every CI pass; a cross-family access boundary test is present and passing; a rules regression produces a red gate.
- **Score:** priority = (4 × 5 × 0.9 × 1.0) ÷ 2 = **9.0** (child-data boundary; moderate effort for emulator setup)
- **Gate notes:** `safe` (CI infrastructure). Standard DevSecOps gate.

---

**AP-030**
- **Title:** `/healthz` returns 404 via Firebase Hosting — health probe dead; add hosting rewrite
- **From:** CIL-bugs-healthz-404 (IMPROVEMENT-BACKLOG.md cycle 2026-06-22b, bugs lens, score 7)
- **Type:** bug · **Stream:** cil · **riskClass:** safe (firebase.json routing config only)
- **Owner pod:** arbor-api
- **Assignee:** arbor-api
- **Problem:** `/healthz` returns 404 when accessed via the Firebase Hosting URL (CDN-intercepted, no rewrite rule). `/api/readyz` returns 401 because the health router is not mounted on `main`. Liveness probes (Cloud Run, monitoring, the smoke test in AP-021) that call the hosting URL are silently dead. This is a **prerequisite for AP-021** (smoke test wiring) — the smoke test cannot pass until `/healthz` is reachable.
- **Acceptance criteria:** (1) A `/healthz` rewrite rule added to `firebase.json` (alongside the existing `/webhooks/**` rewrite in AP-022, or as a separate entry) pointing to the Cloud Run service. (2) A curl to `https://arborparentingapp.com/healthz` returns 200 (not 404). (3) The health router is mounted on `main` before auth middleware so `/api/readyz` returns 200 without a bearer token. (4) AP-021's smoke test can now call the health endpoint and pass.
- **Success metric:** `/healthz` via the hosting URL returns 200; `/api/readyz` returns 200 unauthenticated; AP-021 smoke-test gate passes.
- **Score:** priority = (4 × 4 × 0.9 × 1.0) ÷ 2 = **7.2** (prerequisite for AP-021 smoke test; low effort)
- **Gate notes:** `safe`. Sequence before AP-021. Coordinate AP-030 + AP-022 as a single `firebase.json` PR (both are rewrite additions).

---

### Next wave — top build-ready items from CIL 2026-06-22 + 2026-06-22b

Priority order: **revenue/regression first**, then visible prod breakage, then security hardening, then robustness.

| Priority | AP- id | Title | Owner pod | Effort | Score | riskClass | Release-gate note |
|---|---|---|---|---|---|---|---|
| 1 | **AP-023** | CSP img-src — child photos broken in prod | arbor-api | 1 | 22.5 | safe | Prod breakage; ship with AP-027 as one CSP PR |
| 2 | **AP-026** | MarkdownBlock HTML strip — 3 SEC-1 tests red | arbor-ai | 1 | 15.2 | safe | **Clears 3 red test failures on `main`** |
| 3 | **AP-024** | AppCheckConfig tsc TS2339 + App Check off | arbor-api | 1 | 15.2 | safe | **Clears 1 tsc error on `main`**; pair with AP-027 |
| 4 | **AP-027** | CSP App Check/reCAPTCHA hosts missing | arbor-api | 1 | 14.4 | safe | Functional dep of AP-024; same CSP PR as AP-023 |
| 5 | **AP-029** | Firestore rules always skip in CI | arbor-api | 2 | 9.0 | safe | Child-data boundary test gap |
| 6 | **AP-022** | firebase.json webhook rewrite (RC robustness) | arbor-api | 1 | 8.1 | safe | Ship with AP-030 as one firebase.json PR |
| 7 | **AP-030** | /healthz hosting rewrite (prereq for AP-021) | arbor-api | 2 | 7.2 | safe | Must sequence before AP-021 |

**Gated from this batch (surface for Guy):**

| AP- id | Title | Gate reason | What unblocks it |
|---|---|---|---|
| AP-025 | Global AI cost ceiling — tsc + 3 test failures | Cost gate — Guy must confirm `globalHourlyLimit` ceiling value before implementation constants ship | Guy confirms ceiling value; tsc-fix (signature only) may be scoped separately as a safe change to unblock CI |
| AP-028 | `/api/vision` consent gate re-confirm | COPPA/child-data — arbor-safety must verify coverage before build | arbor-safety code review; if uncovered, consent middleware wiring + Guy confirms |

**Conflict notes for arbor-orchestrator:**
- AP-023 + AP-027 both edit `cspDirectives()` in `createApp.ts` — ship as one PR.
- AP-022 + AP-030 both edit `firebase.json` — ship as one PR.
- AP-024 edits `env.ts` (ArborConfig interface) + `appCheckMiddleware.ts` — no overlap with above.
- AP-026 edits `MarkdownBlock` component only — no overlap.
- AP-029 edits CI config / test setup — no overlap.
- AP-025 (gated) edits `createAiQuota` in `aiQuota.ts` — no overlap until unblocked.

---

## Catch-Up Wave — PM-CU-2026-06-22 (arbor-pm reconciliation pass)

**PM:** arbor-pm · **Date:** 2026-06-22 · **Purpose:** surface the full ordered READY+SAFE queue and the gated list for Guy, after reconciling REL-ARBOR-001/002 shipped items.

### Shipped since last wave hand-off (do not re-queue)

| AP- id | Title | Release | Date |
|---|---|---|---|
| AP-001 | Non-pathologizing framing guard (screenModelOutput on /analyze-behavior) | REL-ARBOR-001, commit `bf2febc` merged `4c9f7ed` | 2026-06-22 |
| AP-005 | JITAI home nudge i18n EN+HE | REL-ARBOR-002, commits `87ce518..9883c2d` | 2026-06-22 |

### READY+SAFE queue — ordered by score (hand to arbor-orchestrator)

All items: `riskClass: safe`, AP- id present, owner pod + acceptance criteria + success metric defined, no Tier-C gate.

| Order | AP- id | Title | Owner pod | Effort | Score |
|---|---|---|---|---|---|
| 1 | **AP-016** | Mobile landing hero overflow — clamp hero height (both CTAs above fold on 375px) | arbor-design | 1 | 23.75 |
| 2 | **AP-021** | Wire /healthz + smoke + canary into deploy gate | arbor-release | 2 | 23.75 |
| 3 | **AP-023** | CSP img-src omits Firebase Storage — child photos broken in prod | arbor-api | 1 | 22.5 |
| 4 | **AP-026** | MarkdownBlock strips no HTML — 3 SEC-1 tests red | arbor-ai | 1 | 15.2 |
| 5 | **AP-024** | requireAppCheck missing from ArborConfig — tsc TS2339 + App Check off | arbor-api | 1 | 15.2 |
| 6 | **AP-027** | CSP omits App Check/reCAPTCHA hosts — App Check blocked in prod | arbor-api | 1 | 14.4 |
| 7 | **AP-004** | PaywallModal shows no price / annual-savings anchor | arbor-billing + arbor-content | 2 | 11.25 |
| 8 | **AP-007** | Trust chip at onboarding hand-over | arbor-content + arbor-design | 1 | 10.2 |
| 9 | **AP-028** _(re-confirm first)_ | /api/vision consent gate — re-confirm vs shipped A2 gate | arbor-safety | 2 | 10.6 — see note |
| 10 | **AP-014** | Remove 3 ComingSoon sections / wire Appointments to consult-request | arbor-ux + arbor-design | 2 | 9.5 |
| 11 | **AP-029** | Firestore rules always skip in CI — child-data boundary untested | arbor-api | 2 | 9.0 |
| 12 | **AP-022** | firebase.json webhook rewrite (RC robustness tail) | arbor-api | 1 | 8.1 |
| 13 | **AP-030** | /healthz hosting rewrite (prerequisite for AP-021 smoke test) | arbor-api | 2 | 7.2 |
| 14 | **AP-009** | PlayActivity citation schema + render plumbing (no populated copy) | arbor-practice | 2 | 7.2 |
| 15 | **AP-010** | Surface existing server-side coach citations (source + link, no grade) | arbor-practice | 2 | 6.4 |
| 16 | **AP-002** | Competence Ladder — scaffolding that retires itself | arbor-growth | 3 | 4.0 |
| 17 | **AP-013** | School-age 7–10 surveillance track (substantiated set only) | arbor-growth + arbor-practice | 3 | 4.3 |

> AP-028 note: score 10.6 but it is a COPPA/gated item. It is listed here because the first action — arbor-safety re-confirms whether A2 already covers `/api/vision` — is a safe verification task. If confirmed covered it closes as a no-op. If not covered, the fix itself is gated. Do not build the fix without safety sign-off; do run the verification.

> AP-030 must sequence before AP-021 (healthz hosting rewrite is the prereq for the smoke test). AP-023 + AP-027 ship as one CSP PR. AP-022 + AP-030 ship as one firebase.json PR. AP-024 + AP-027 ship together or in immediate sequence (App Check enforcement is a no-op without the CSP fix).

### Gated items — surfaces for Guy (never auto-scheduled)

All items require explicit human sign-off before entering a build wave.

| AP- id | Title | Gate reason | What unblocks it |
|---|---|---|---|
| **AP-025** | Global AI cost ceiling — tsc + 3 test failures + unbounded AI spend | Cost gate — Guy must confirm `globalHourlyLimit` ceiling value before implementation constants ship | Guy confirms ceiling value (requests/hr or tokens/hr); tsc-only signature fix may ship separately as safe to unblock CI |
| **AP-003** | Re-engagement "new chapter" nudge | Child-data egress (child name + milestone into notification/email channel) | arbor-safety consent sign-off + Guy confirms |
| **AP-008** | Onboarding age months sub-input | arbor-clinical-peds soundness check on bucketing logic | Clinical-peds lens pass + Guy confirms |
| **AP-011** | Escalation copy review + jurisdiction check | touchesClinical — helpline/emergency copy | Guy confirms scheduling; board re-confirms numbers |
| **AP-012** | "Not a diagnosis" honesty line on all dev signal surfaces | touchesClinical — global copy on developmental surfaces | Guy confirms; arbor-design ships co-located with next tab update |

---

## North Star / Objective-Reaching Roadmap — 2026-06-22 (arbor-product)

**Context:** AP-001–AP-030 are hygiene, green-gate, and bug-fix work. They are necessary but not objective-reaching. This section promotes the initiatives that move the actual company objective: **best-in-market children development OS + multi-million-dollar revenue.** Three strategic plays, sequenced by leverage. Owner: Product Council (fuses this stream with Advisory, Clinical, Marketing, CIL).

**Highest AP- id before this block: AP-030.**

> ### ✅ CEO DECISION 2026-06-22 (Guy) — autonomy envelope + gated greenlights
> **Autonomy envelope (confirmed):** the self-improving loops operate on the backlogs and **build `safe` items to a GREEN BRANCH** autonomously; **merge-to-main + deploy-to-prod stay human** (Guy / the release train). NOT widened to auto-merge/auto-deploy — deliberate, given the active multi-session overlap + the RED `main`. (CIL eval 2×/day · CIL build Mon/Thu · Council weekly · Marketing 2×/wk all run within this.)
> **Gated bets GREENLIT TO BUILD (Guy, 2026-06-22) — build to a branch, human ships:** **AP-038** (FCM push) · **AP-039** ("Arbor Noticed" briefing) · **AP-041** (referral grant + /join resolver) · **AP-042** (hero-comic share export). Their child-data/billing/consent/clinical gates are now **build-time constraints to implement IN the build** (the consent flow, entitlement grant, share-guard, clinical copy must ship with the feature) — they are **no longer scheduling blockers**, but each remains **merge/deploy-gated** for Guy + the holding veto (arbor-safety / Clinical Board) on the actual implementation. AP-039 still has the CLI-07 (corrected-age) hard dependency.
> **Execution sequence (release-coordination):** (1) **GREEN `main` FIRST** — it is RED (AP-024 appcheck-config, AP-025 aiQuota-ceiling, AP-026 markdownblock-XSS clear specific failures) + resolve the un-merged mig/waf entanglement; no wave builds cleanly on a red base. (2) Build-first safe sprint **AP-031 + AP-035** (Head-of-Product pick). (3) The four greenlit gated bets → branches, with their gates implemented. All to green branches; Guy/the train ships.

---

### Play 1 — Full 0–12 Band Coverage ("whole childhood, one record")

**Thesis.** Every single-band rival (Huckleberry = sleep, Kinedu = 0–5, Duolingo ABC = reading) owns one slice. Arbor's 0–12 scope is the moat — but it is currently 0–5 well, 0–2 with a correctness bug (age in whole years), and 7–12 entirely absent. Fixing all three closes the "maybe it's not for my kid" objection, unlocks the infant market (new parents = highest-urgency buyers), and gives the record enough density to make the longitudinal story real.

**Product judgment challenge:** infant-band correctness is a higher-urgency fix than school-age expansion because (a) it is a structural false-alarm bug in the moat's first payoff, (b) new-parent churn is the costliest churn, and (c) the baby clinical reqs are further along than school-age. School-age is important but sequenced after infant.

---

**AP-031**
- **Title:** Baby 0–24m surveillance refinement — add regression-detection signal + ASHA communication/hearing referral cues
- **From:** BABY-CLINICAL-REQUIREMENTS-2026-06-22.md §"Surveillance refinement" (substantiated set, Clinical Board pass — safe to build) + carry-forward: regression detection identified as a gap in `monitoring.ts` (CDC "loss of skills at any age = act early" trigger not yet implemented)
- **Type:** feature · **Stream:** clinical (substantiated) · **riskClass:** safe
- **Owner pod:** arbor-growth (monitoring.ts)
- **Problem:** `monitoring.ts` detects past-band milestones but has no regression detector. A parent who un-checks a previously acquired skill sees nothing. CDC names loss of previously acquired skills at any age as the highest-priority act-early trigger. ASHA communication/hearing referral cues (not babbling + gestures by ~12m, no words by ~16m, no two-word combos by ~24m) exist in the clinical requirement but are not surfaced. Both are in the substantiated (safe) set — no EU-MDR read required.
- **Acceptance criteria:** (1) `monitoring.ts` detects a regression event: a `checked:true` milestone that a parent subsequently un-checks (or a logged skill loss note) triggers a calm "worth mentioning to your child's doctor — we noticed a skill that was there before" signal (non-alarmist, non-diagnostic, provider-routing). (2) ASHA communication referral cues added as a quiet "worth raising" band for 0–24m: not babbling/gesturing by ~12m; no words by ~16m; no two-word combos by ~24m; any speech/babble loss at any age → also suggest a hearing check per ASHA. (3) All copy in "most babies can…" register, never "your baby should…"; every signal routes to the provider, never diagnoses. (4) Zero banned strings from BABY-CLINICAL-REQUIREMENTS-2026-06-22.md §0 (no "delayed," "behind," "speech delay" as verdict, "autism," etc.). (5) HE copy flagged for human clinical translation before ship.
- **Success metric:** Regression events surface a provider-routing card in monitoring view; zero banned-string audit failures in CI; clinical copy gate passes before prod.
- **Score:** priority = (5 × 5 × 0.9 × 1.0) ÷ 2 = **11.25** (safety + moat completeness; safe to build now)
- **Gate notes:** `safe` (substantiated set per Clinical Board). Standard DevSecOps gate + arbor-clinical-lead copy sign-off before prod. No EU-MDR read required for this slice.

---

**AP-032**
- **Title:** B3 Baby rhythm log — neutral parent logging (feeds / sleep / diapers) + own-pattern reflection
- **From:** BABY-CLINICAL-REQUIREMENTS-2026-06-22.md §B3 (substantiated set — neutral logging + own-pattern reflection; norm-comparison/inference HELD)
- **Type:** feature · **Stream:** clinical (substantiated) · **riskClass:** gated (new child-health data capture — COPPA-2026/GDPR consent gate required before build; clinical soundness: pass)
- **Owner pod:** arbor-memory (data schema + append-only log) + arbor-growth (Rhythm surface)
- **Problem:** Baby parents (0–24m) have no structured way to log feeds, sleep, and diapers in Arbor. This is the data that makes the Rhythm personalization real for the hardest-to-retain cohort. Without log volume, Rhythm predictions for under-2s are empty. The substantiated scope is neutral entry + reflection of the family's own pattern only — no norm comparison, no sleep-training nudge, no feeding-adequacy verdict.
- **Acceptance criteria:** (1) Parents of 0–24m children can log feed (type/volume), sleep (start/end), and diaper events from the Home screen in ≤3 taps. (2) Entries are appended to the child's longitudinal record with timestamps (not editable — append-only per record architecture). (3) A descriptive reflection surface shows the family's own trend over 7/14 days: "Over the last 10 days, the longest stretch has been clustering in the early evening" — child as own baseline, never a norm comparison. (4) `rhythm/predict.ts` honest-confidence contract inherited: bands not minutes, low/none state when data is thin. (5) Zero norm-comparison strings, zero "X hours of sleep," zero sleep-training nudge, zero feeding-adequacy verdict. (6) Consent surface for new child-health data reviewed by `arbor-safety` before build-ready. (7) HE copy flagged for human clinical translation.
- **Success metric:** 0–24m profiles with ≥5 rhythm entries in first 30 days (target: 60%); zero banned-string audit failures; arbor-safety consent sign-off received.
- **Score:** priority = (5 × 4 × 0.85 × 1.0) ÷ 3 = **5.67** (gated — surfaces for Guy; high moat value, consent gate required)
- **Gate notes:** `gated` — COPPA-2026/GDPR child-health-data consent capture is Guy's call before scheduling. Clinical soundness: pass (substantiated set per Clinical Board). EU-MDR read NOT required for neutral logging — only required for norm-comparison/inference surfaces (HELD).

---

**AP-033**
- **Title:** B4 Baby leap-normalization card — generic fussy/clingy/uneven-phase reassurance (non-calendared)
- **From:** BABY-CLINICAL-REQUIREMENTS-2026-06-22.md §B4 (substantiated mechanism — normal-variability reassurance; Wonder-Weeks calendar/leap-week prediction HELD as recommend-veto)
- **Type:** feature · **Stream:** clinical (substantiated) · **riskClass:** safe
- **Owner pod:** arbor-growth (coaching/reassurance surface) + arbor-content (copy)
- **Problem:** Baby parents in fussy/clingy/disrupted-sleep stretches have no reassurance surface in Arbor. The mechanism — that uneven, nonlinear developmental phases are typical — is well-grounded in AAP Bright Futures. The substantiated scope is a generic, non-dated "fussy phases are common and usually pass; stay responsive" card tied to the child's age band (not a week number). The recommend-veto applies to any Wonder-Weeks-branded or week-N predictive calendar — that stays permanently HELD.
- **Acceptance criteria:** (1) An age-band-calibrated reassurance card appears when a parent logs a particularly fussy or sleep-disrupted period, or via the coaching surface when the concern is expressed. (2) Copy framing: "Many babies go through stretches of extra fussiness or clinginess — common, and usually passes. Staying responsive and keeping routines steady helps." No week numbers, no "Wonder Weeks," no "leap N," no "your baby will…" prediction. (3) Explicitly includes the off-ramp: if the stretch involves loss of previously acquired skills, comes with illness signs, or is marked and not passing → pediatrician. (4) Copy reviewed by `arbor-clinical-lead` before prod. (5) HE copy flagged for human translation (קפיצה must not appear as a dated event; use phase language).
- **Success metric:** Reassurance card surfaces for 0–24m parents in fussy periods; zero Wonder-Weeks/leap-calendar strings in the shipped build; copy gate passes.
- **Score:** priority = (4 × 4 × 0.85 × 1.0) ÷ 2 = **6.8** (safe; high parent-comfort value; moat-consistent)
- **Gate notes:** `safe` (substantiated set per Clinical Board). Standard DevSecOps gate + `arbor-clinical-lead` copy sign-off.

---

**AP-034**
- **Title:** SA1 School-age 7–10 six-domain surveillance — observable-competency prompts (substantiated set, no score/verdict)
- **From:** SA1 in SCHOOLAGE-CLINICAL-REQUIREMENTS-2026-06-22.md (substantiated; Clinical Board pass — safe to build); back-references AP-013 (which is the broader SA1–SA6 rollup but needs this as a targeted first-ship slice)
- **Type:** feature · **Stream:** clinical (substantiated) · **riskClass:** safe
- **Owner pod:** arbor-growth + arbor-practice
- **Problem:** Parents of 7–10 year-olds have no developmental surveillance track. CDC stops at 5; Arbor stops at 5. 7–10 is the largest un-served age band in the product and the age band with the highest parental anxiety about school performance, social dynamics, and "is my kid okay?" The substantiated scope is six-domain observable-competency surveillance framed as "things worth noticing and talking about" — not a checklist, not a score. AP-013 covers the broader SA1–SA6 rollup; this ticket prioritizes SA1 as the buildable keystone that all other school-age surfaces depend on.
- **Acceptance criteria:** (1) Six AAP Bright Futures middle-childhood domains surfaced in the Milestones/Development tab for 7–10 profiles: academic adjustment, peer relationships, self-responsibility, emotional regulation, social communication, physical/motor health. (2) Each domain has 3–5 parent-observable competency prompts in the "usually / worth noticing" register — e.g. "has one or more friendships; navigates everyday disagreements" — never "should by age 8." (3) `devScore.ts` does NOT render a 7–10 "behind"/percentile verdict when the domain set extends (confirm explicitly). (4) Cross-setting/persistence referral prompt fires only for a persistent pattern across multiple domains + parent/teacher concern — never on a single low week. (5) Zero banned strings: no "ADHD," "learning disability," "delayed," "below grade level," "disorder." (6) HE copy flagged for human clinical translation.
- **Success metric:** 7–10 profiles have a populated surveillance track; DevScore does not surface a percentile/verdict for this band; zero banned-string audit failures; clinical copy gate passes.
- **Score:** priority = (4 × 4 × 0.8 × 1.0) ÷ 3 = **4.27** (safe; market expansion; school-age parents are a new segment)
- **Gate notes:** `safe` (substantiated set per Clinical Board). Standard DevSecOps gate + `arbor-clinical-lead` copy sign-off. Coordinate with AP-013 (which covers SA2/SA4/SA5/SA6 substantiated set); AP-034 is the standalone keystone for SA1 specifically.

---

### Play 2 — Moat-Native Capability Bets ("deliver what we already compute")

**Thesis.** The CIL 2026-06-21c diagnosis is precise and still open: Arbor computes the best predictive signals in the category but delivers them to nobody unless the parent opens the app at the right moment. The delivery layer (FCM push, proactive alert, multi-child glance) is gated. The two immediately buildable moat bets are the Practice Studio pipeline closure (Practice sessions currently write to nowhere the coach can read) and professional-readable export (which makes the "Trusted Sharing" marketing claim real and unlocks the B2B referral channel from pediatricians/SLPs).

**Already shipped this session (do not re-queue):** proactive "Arbor Noticed" alert card framing (PHI-02 in intake, HELD for copy gate), FCM seam (DEM-001 in intake, gated), multi-child glance (in gated capability table), expert-cited content schema (AP-009/AP-010, building), growth tracking append-only log (B0/B1 shipped).

---

**AP-035**
- **Title:** Practice Studio → longitudinal record pipeline — close the loop so sessions feed the coach and the timeline
- **From:** FR-10 in Council Intake 2026-06-21 Marketing Capability-Map handoff; back-references IMPROVEMENT-BACKLOG capability table (CIL-capability-cited-expert-content, CIL-21c); Marketing hold AM-NEW-7 is blocked until this ships
- **Type:** feature · **Stream:** market/capability · **riskClass:** safe
- **Owner pod:** arbor-practice + arbor-memory
- **Problem:** A child's Practice session (phonics, speech, literacy) writes to the Practice Studio's own surface but does NOT write to the child's longitudinal timeline or become referenceable by the coach. The marketing hook "the record remembers how Maya responded" is empty for Practice Studio outputs. Kinedu, Khan Kids, and BabySparks all have a practice→record→personalization loop. Arbor's moat (longitudinal memory) is only as strong as the number of surfaces that write to it.
- **Acceptance criteria:** (1) A Practice session completion event (phoneme/word accuracy result, session length, activity type) writes a timestamped entry to the child's longitudinal record (same append-only store as milestone/behavior events). (2) The coach prompt context includes the last N practice results for the child's concern domain (e.g. "Maya has had 3 speech sessions this week; her accuracy on /s/ blends is trending up"). (3) A parent-visible session summary is surfaced after each practice session — activity completed, one observation — not a score, not a performance verdict. (4) Parent can set session-length limits (screen time control — a safety/trust feature, not just a UX nicety). (5) The practice entry in the timeline preserves the non-diagnostic framing ("practiced /s/ blends today") — never "scored X% below average."
- **Success metric:** Practice sessions write to the timeline in 100% of completed sessions; coach responses reference practice context within 7 days of ship; parent-visible session summary present post-session. Marketing can activate AM-NEW-7 once this is confirmed live.
- **Score:** priority = (5 × 5 × 0.9 × 1.0) ÷ 3 = **7.5** (safe; closes the moat loop; unblocks a marketing claim)
- **Gate notes:** `safe` — practice data already captured on-device; this is a write-to-record and context-wiring task with no new child-data collection. Standard DevSecOps gate only.

---

**AP-036**
- **Title:** Professional-readable child record export — web link + PDF a pediatrician/SLP can open without installing Arbor
- **From:** FR-12 in Council Intake 2026-06-21 Marketing Capability-Map handoff; back-references IMPROVEMENT-BACKLOG §Capability bets (consult-REQUEST already shipped via MON-3 v1; export is the missing completion)
- **Type:** feature · **Stream:** market/capability · **riskClass:** safe (structured export of parent-entered record data; no new child-data collection; GDPR Art. 20 portable-format direction)
- **Owner pod:** arbor-memory + arbor-api
- **Problem:** The consult-request (MON-3) ships — a parent can request a referral. But the receiving professional (pediatrician, SLP, school counselor) has no way to open the child's Arbor record without installing Arbor. The "Trusted Sharing" positioning claim is hollow until a non-Arbor professional can read the record. This is also the primary B2B referral wedge: a pediatrician who opens a clean, useful record PDF from an Arbor parent becomes a distribution channel.
- **Acceptance criteria:** (1) Parent can generate a time-limited (7-day) web link that a professional opens in any browser — shows the child's milestone timeline, concern history, monitoring signals, and practice summary in a clean, read-only view with no Arbor account required. (2) A "Download PDF" option on that same view exports a clean 1–3 page summary. (3) The export respects the non-diagnostic framing: no scores/verdicts, "parent-reported observations" label throughout, "not a clinical assessment" honesty line per CLI-08. (4) Export does not include raw AI model outputs or coach transcripts — parent-logged observations and milestone records only. (5) Link expires in 7 days; parent can revoke at any time.
- **Success metric:** At least 20% of consult-request exports are opened by a non-Arbor IP address within 30 days of ship (proxy for professional opens); parent export-to-revoke rate under 5% (satisfaction signal).
- **Score:** priority = (5 × 4 × 0.85 × 1.0) ÷ 3 = **5.67** (safe; unlocks B2B channel + makes trust claim real)
- **Gate notes:** `safe` for the structured parent-record export. The full GDPR portability export (Art. 20 structured JSON + erasure UI) is FR-6 / AP- TBD — gated separately by `arbor-safety`. This ticket is the professional-facing read-only summary, which is an additive feature with no new data collection.

---

**AP-037**
- **Title:** Ambient capture widget — log a behavior moment in ≤3 taps from the home/lock screen (no deep-open required)
- **From:** FR-3 in Council Intake 2026-06-21 Marketing Capability-Map handoff; back-references CIL-21c Theme T5 ("moat is computed but not delivered") — log volume is the moat's fuel
- **Type:** feature · **Stream:** market/capability · **riskClass:** safe (on-device capture; no child-data egress; additive UI surface)
- **Owner pod:** arbor-native (widget/iOS/Android) + arbor-memory (record write) + arbor-design (UX)
- **Problem:** The Arbor record's personalization quality — Rhythm predictions, coach coaching, JITAI nudges, daily-play recommendations — is directly proportional to log volume. Logging a behavior moment today requires opening the app, navigating to the Behaviors tab, and entering text. For a parent mid-diaper-change or mid-meltdown that is three too many steps. Every competitor with a hardware sensor (Nanit) or a push-entry widget bypasses this friction entirely. Log volume is the moat's fuel; entry friction is the moat's leak.
- **Acceptance criteria:** (1) iOS: a home-screen widget (WidgetKit, iOS 16+) with 3 pre-set quick-log buttons (Positive moment / Challenging moment / Milestone observed) that write directly to the active child's record in ≤3 taps without opening the full app. (2) Android: equivalent home-screen widget (Jetpack Glance / RemoteViews). (3) A voice shortcut ("Hey Siri / Google: log moment in Arbor") as an optional extension. (4) Events land in the append-only record with timestamp and a "quick-capture" source tag. (5) No child data leaves the device in the capture flow — event is queued locally and synced on next open if offline.
- **Success metric:** Median log events per active user per week increases by ≥30% vs pre-widget baseline (measured 30 days post-ship); widget adoption rate ≥25% of active users within 60 days.
- **Score:** priority = (5 × 5 × 0.85 × 1.0) ÷ 4 = **5.31** (safe; highest log-volume leverage; effort L)
- **Gate notes:** `safe` — on-device capture, no child-data egress, no new permissions beyond existing app. Standard DevSecOps gate + `arbor-native` (widget plumbing). Effort = 4 (WidgetKit + Android widget + optional Siri shortcut).

---

**AP-038** *(gated — surfaces for Guy)*
- **Title:** FCM background push for JITAI nudge delivery — fire the predicted-moment nudge without the parent opening the app
- **From:** CIL-capability-push-notifications (IMPROVEMENT-BACKLOG.md cycle 2026-06-21c, capability table, score 20); FR-1 in Council Intake; back-references DEM-001 (gated)
- **Type:** feature · **Stream:** capability (gated) · **riskClass:** gated (FCM push opt-in consent + server-side child-rhythm read)
- **Owner pod:** arbor-growth (JITAI engine) + arbor-native (FCM token registration) + arbor-api (server-side scheduler)
- **Problem:** `jitai.ts nextNudge()` fires only in a render-time `useMemo` — the nudge reaches nobody unless the parent is already in the app. Huckleberry's SweetSpot push (15–30 min pre-nap-window) is the category-defining delivery mechanic: it makes the product feel alive and expert. Arbor's JITAI engine computes a better prediction (longitudinal rhythm model) but delivers zero push. This is the #1 retention bet on the board.
- **Acceptance criteria:** (1) FCM token registered on device; opt-in consent surface added to onboarding (parent grants push permission). (2) Server-side Cloud Scheduler job reads the active child's rhythm prediction for the day and fires the JITAI nudge at the predicted hour (server reads predicted window, never the full child record in the push payload — no child PII in FCM payload). (3) Push opt-in consent stored in the consent ledger per the existing consent architecture. (4) Nudge cadence governed by PHI-06 attention-budget mechanic (one nudge per predicted window, quiet hours respected) — not a daily blast. (5) D30 push-grant vs push-declined cohort retention measurable via analytics.
- **Success metric:** D30 retention +8% in push-granted cohort vs push-declined baseline (from CIL-21c target); push opt-in rate ≥50% of new onboarding completions.
- **Score:** priority = (5 × 5 × 0.85 × 1.0) ÷ 3 = **7.08** (gated — highest retention bet; surfaces for Guy)
- **Gate notes:** `gated` — FCM push opt-in consent + server reads child-rhythm state. Routes to `arbor-safety` for consent flow review; Guy confirms before scheduling. PHI-06 attention-budget mechanic recommended as a co-ship (not a hard dep, but the combination is what makes this non-engagement-maximizing and rubric-aligned).

---

**AP-039** *(gated — surfaces for Guy)*
- **Title:** "Arbor Noticed" weekly parent-agency briefing — proactive card grounded in child's own monitoring signal
- **From:** CIL-capability-proactive-memory-alerts (IMPROVEMENT-BACKLOG.md cycle 2026-06-21c, score 18); DEM-002 + PHI-02 (both HELD for copy gate + corrected-age dep); back-references the parent-agency-briefing cluster (PHI-02/PHI-05/PHI-07)
- **Type:** feature · **Stream:** capability (gated) · **riskClass:** gated (child-data + non-diagnostic-framing copy gate + corrected-age dep CLI-07 + CLI-03)
- **Owner pod:** arbor-growth (monitoring signal + delivery) + arbor-content (briefing copy)
- **Problem:** `monitoring.ts` computes domain WatchLevel signals but they surface only on the Screening nav — never proactively. A parent who never navigates to Screening never sees the most important child-specific signal Arbor generates. This is Arbor's lead moat-native bet: a personalized, longitudinal signal grounded in the child's own append-only record that no single-vertical competitor can generate.
- **Acceptance criteria:** (1) A weekly parent-opened (never push-interrupted) "Arbor Noticed" card surfaces in the Home/Overview tab, grounded in the highest WatchLevel signal from the past 7 days. (2) Briefing format: one observed pattern ("you've logged X this week") + one risk-honest, non-alarmist signal + one parent-owned next action. (3) Every word of the briefing copy passes `arbor-clinical-lead` soundness:pass before ship — no "non-diagnostic framing guarantee" language (the board's specific block from DEM-002). (4) Hard dependency: CLI-07 corrected-age and CLI-03 CDC Act-Early thresholds must be wired into `deriveMonitoring` before this ships (CLI-07 gated/pending Guy; CLI-03 HELD pending threshold correction). (5) Success metric is parent-action-taken (tapped a next-action link or consulted a provider), NOT opens/sessions. (6) Briefing copy shares the single brief template with PHI-07 (weekly digest) and AP-003 (milestone re-engagement) — no triple build.
- **Success metric:** Parent-action-taken rate ≥20% of briefing views within 48h; zero HELD copy strings in the shipped build.
- **Score:** priority = (5 × 5 × 0.9 × 1.0) ÷ 3 = **7.5** (gated — lead moat bet; surfaces for Guy; unblocked after CLI-07 + CLI-03 clear)
- **Gate notes:** `gated` — child-data + non-diagnostic copy gate (DEM-002 block still outstanding: guarantee language must be downgraded + CLI-01/CLI-07/CLI-02/CLI-03 must land first). Routes as HELD until: (a) CLI-07 and CLI-03 ship, (b) briefing copy passes `arbor-clinical-lead` soundness:pass, (c) Guy confirms. This is the highest-value item in the gated queue and should be the first gated item Guy unlocks after CLI-07 lands.

---

### Play 3 — Conversion + Viral Growth Engine ("make the funnel real")

**Thesis.** Arbor has a paywall (AP-004 adds the price display — highest-scoring safe item). It has an activation seam (AP-007 trust chip). It does NOT have: (a) a functioning referral grant loop (the join link resolves to nothing), (b) a viral share payload (hero comic share is unbuilt), or (c) the ambient capture that makes log volume high enough for personalization to feel magical. These three are the conversion+viral engine. Two are gated (billing); one is safe.

**Already queued:** AP-004 (paywall price — already in Wave PM-01), AP-007 (trust chip — already in Wave PM-01), AP-008 (onboarding months — gated/pending clinical). Not re-queued here.

---

**AP-040**
- **Title:** Daily Play activity library → 500+ activities with expert attribution, no repeat within 4-week window
- **From:** FR-2 in Council Intake 2026-06-21 Marketing Capability-Map handoff; back-references CIL-capability-cited-expert-content (AP-009/AP-010 ship the schema and citation surface; FR-2 is the content volume expansion)
- **Type:** feature · **Stream:** market/content · **riskClass:** safe (editorial content expansion; human accuracy review required per DEM-004 board split; no new code surface)
- **Owner pod:** arbor-practice (content) + arbor-content (copy + expert attribution editorial)
- **Problem:** The current Daily Play library has ~46 activities (35 uncited as of the CIL cited-content build wave). A 30-day active parent sees repeats within two weeks. Kinedu markets "1000+ activities," BabySparks markets "500+ activities," Khan Kids has unlimited generated curriculum. Arbor's "personalized to your child" claim weakens every time the same activity repeats. The fix is volume + expert attribution (so each activity carries the same citation quality as AP-009/AP-010, not just a count bump).
- **Acceptance criteria:** (1) Library expanded to ≥500 activities across the 0–12 age band and the six concern domains. (2) No activity repeats within a 4-week window for an active child with ≥3 logged events. (3) Each activity has an optional `expertName`/`citationUrl`/`sourceOrg` field (AP-009 schema) populated where a verifiable public source exists. (4) Each populated citation is a real, working URL spot-checked by human editorial before ship (per DEM-004 board requirement — no AI-fabricated citations). (5) Activities without a citation show no chip (never a fabricated source).
- **Success metric:** Library at ≥500 activities; zero repeat within 28 days for active users; ≥30% of activities have a verified expert attribution; human editorial URL spot-check completed before prod.
- **Score:** priority = (4 × 4 × 0.8 × 1.0) ÷ 4 = **3.2** (safe; content volume is table-stakes; effort L — but can be parallelized with arbor-practice)
- **Gate notes:** `safe` (editorial; human accuracy review on citations required per DEM-004 board split). Standard DevSecOps gate. Effort = 4 (500+ content items + citation editorial pass).

---

**AP-041** *(gated — surfaces for Guy)*
- **Title:** Referral grant + /join?ref= deep-link resolver — make the second-guardian loop a real acquisition channel
- **From:** DEM-007 (HELD/gated — billing); DEM-008 (gated — billing + child-derived content render); CIL-bugs-referral-join-route-missing (FT-1 in IMPROVEMENT-BACKLOG.md cycle 2026-06-21); PHI-09 (second-guardian loop, gated)
- **Type:** feature · **Stream:** growth (gated) · **riskClass:** gated (billing — writes entitlements; child-data in share payload)
- **Owner pod:** arbor-acquisition + arbor-billing
- **Problem:** `buildJoinUrl()` ships a `/join?ref=` link that resolves to a 404. The referral mechanic exists in code (loopEvents, attribution capture, heroCard share) but no reward fires and no new user is activated. The second-guardian loop is the #1 viral acquisition channel in the GTM thesis — two parents in one household is the highest-retention cohort AND the natural referral unit. Currently the loop is: invite → 404 → zero conversion.
- **Acceptance criteria:** (1) `/join?ref=` route resolves: captures the referral code in a cookie, pre-fills onboarding with the shared context, activates a tracked signup attributed to the referrer. (2) Both parties receive an entitlement reward on activation (e.g. one month Plus for each) — reward amount confirmed by Guy before ship. (3) The second guardian is a co-viewer-with-contribute role on the shared child record, not just a read-only viewer. (4) No child PII in the share URL itself (ref code is anonymized). (5) Referral counter/streak surfaces are explicitly excluded from the share surface (PHI-09 guardrail: incentive stays subordinate to shared-record meaning). (6) Loopevents sink captures attribution end-to-end.
- **Success metric:** Referral-attributed new activations as a % of total new activations ≥15% within 60 days of ship; second-guardian D30 retention ≥5pp above single-guardian baseline.
- **Score:** priority = (5 × 5 × 0.9 × 1.0) ÷ 3 = **7.5** (gated — highest viral acquisition bet; surfaces for Guy)
- **Gate notes:** `gated` — billing (entitlement grant), child-data (shared record access + consent for second guardian), Guy confirms reward amount and billing rails are end-to-end tested. Routes to `arbor-safety` (consent for shared child-record access) + arbor-billing (entitlement grant). The safe half (capture + cookie + route) can be built first; the reward grant ships after Guy's billing confirmation.

---

**AP-042** *(gated — surfaces for Guy)*
- **Title:** Hero Comic share export loop — Story Journey completion → shareable comic with referral deep-link (the viral GTM payload)
- **From:** FR-14 in Council Intake 2026-06-21 Marketing Capability-Map handoff (P0 — "gates the whole viral GTM"); back-references DEM-008 (gated), arbor-avatar (render/export pod), mk-p0-3-share-export in MARKETING-BACKLOG
- **Type:** feature · **Stream:** growth/viral (gated) · **riskClass:** gated (share export + avatar pipeline + child-data guard + billing — referenced as a Plus/Family feature)
- **Owner pod:** arbor-avatar (render/export) + arbor-api (share link + C2PA signing) + arbor-billing (entitlement gate)
- **Problem:** The Academy Story Journey exists. The heroic comic-panel render exists. There is no export flow that produces a shareable image carrying the referral deep-link. The marketing thesis ("the kid becomes the hero — parent shares it — viral loop") has no product execution. This is the GTM thesis's load-bearing feature: without it, the viral acquisition loop is theoretical.
- **Acceptance criteria:** (1) Completing an Academy Story Journey triggers a "Share your hero's story" moment — one tap renders a branded comic panel (stylized avatar, never a real face, C2PA/SynthID-signed) with a `/join?ref=` deep-link embedded. (2) Parent can share via native share sheet (WhatsApp, Instagram Stories, Messages). (3) Zero real child photos/faces — avatar is the stylized hero persona only (CHARTER §3, child-safety). (4) The export is a Plus/Family feature (entitlement-gated). (5) Referral deep-link is the same resolver as AP-041. (6) C2PA/SynthID signature present on the exported image per the existing avatar pipeline.
- **Success metric:** Hero Comic share events ≥5% of active Plus users per week within 60 days of ship; referral-attributed activations from comic shares ≥10% of all referral activations.
- **Score:** priority = (5 × 5 × 0.85 × 1.0) ÷ 4 = **5.31** (gated — viral GTM keystone; surfaces for Guy)
- **Gate notes:** `gated` — share export (child-derived content) + avatar pipeline (must confirm zero real-face risk on every code path) + billing entitlement. Hard dep: AP-041 (referral resolver must exist before the link in the comic does anything). Routes to `arbor-safety` (child-data guard on export) + arbor-billing (entitlement gate) + Guy confirms scope.

---

### "Look paid, not beta" — Visual Craft Transformation (coordinated with AP-015–AP-021)

**Note:** AP-015 (imagery layer), AP-016 (hero overflow), AP-017 (type scale), AP-018 (dark mode), AP-019 (CSS override arch), AP-020 (palette split) are already in the backlog. No new tickets needed here. The council should treat AP-019 → AP-017/AP-020/AP-018 as a coordinated design sprint (AP-019 is the prerequisite for the others; sequence it first in the wave). The "look paid" transformation is a necessary complement to the conversion bets (AP-004 paywall price, AP-041 referral) — a parent who reaches the paywall on a product that looks unfinished will not convert regardless of price display.

---

### North Star — Gated strategic bets surfaced for Guy (never auto-scheduled)

| AP- id | Title | Why it matters | Gate | What unblocks it |
|--------|-------|----------------|------|-----------------|
| AP-032 | B3 Baby rhythm log | Moat fuel for 0–24m; makes Rhythm real for infant cohort | COPPA-2026/GDPR new child-health-data consent | arbor-safety consent design + Guy confirms |
| AP-038 | FCM background push for JITAI | Highest retention bet; Huckleberry's entire moat is this mechanic | Push opt-in consent + server reads child-rhythm state | arbor-safety consent flow + Guy confirms |
| AP-039 | "Arbor Noticed" weekly briefing | Lead moat-native bet; the personalized longitudinal signal no competitor can replicate | CLI-07 + CLI-03 must land; briefing copy clinical sign-off; child-data | CLI-07 ships → clinical copy gate → Guy confirms |
| AP-041 | Referral grant + /join resolver | Converts the second-guardian loop from a 404 to an acquisition channel | Billing (entitlement grant); child-data (shared record consent) | Guy confirms reward amount + billing end-to-end tested |
| AP-042 | Hero Comic share export | The viral GTM thesis's load-bearing feature | Share export (child-derived content guard) + billing entitlement + dep on AP-041 | AP-041 ships → arbor-safety child-data guard → Guy confirms |

Additionally: **B2 baby growth percentiles** (HELD — EU-MDR read required), **DEM-009 Double-Aha Onboarding** (HELD — Rhythm promise is an unsubstantiated developmental prediction), **DEM-012 Memory-Adaptive Literacy Track** (HELD — readiness-screen framing), **SA3 NL education mapping** (HELD — jurisdiction TBD), **SA6 SR5–SR7 anxiety/mood cluster** (HELD — EU-MDR + lead string sign-off) are all held for substantive clinical/regulatory reasons. They surface here as Guy's strategic decisions, not as a process gap.

---

### North Star — Sequence recommendation (what to build first to most move "best-in-market + revenue")

| Wave | Focus | AP- ids | Gate | Revenue/market impact |
|------|-------|---------|------|----------------------|
| Now (safe — queue immediately) | Conversion seam + moat correctness | AP-031 (baby regression/ASHA cues) · AP-033 (leap normalization) · AP-034 (school-age SA1) · AP-035 (Practice→record pipeline) · AP-036 (professional export) | safe (standard gate + copy sign-off) | AP-031 fixes infant false-alarm risk; AP-034 opens 7–10 market; AP-035 closes moat loop; AP-036 activates B2B referral channel |
| Now (safe — already in Wave PM-01) | Conversion + visual | AP-004 (paywall price) · AP-007 (trust chip) · AP-016 (hero overflow) · AP-019 (CSS arch) | safe | Direct paywall conversion lift; "looks paid" |
| After Guy sign-off on CLI-07 | Infant onboarding + ambient capture | AP-008 (months sub-input, peds sign-off pending) · AP-037 (ambient capture widget) | AP-008 gated (clinical-peds); AP-037 safe | Fixes infant moat-entry bug; increases log volume (moat fuel) |
| After Guy confirms gated bets | Viral + delivery layer | AP-038 (FCM push) · AP-039 (Arbor Noticed) · AP-041 (referral grant) · AP-042 (hero comic) | gated (billing + consent) | Retention lift (push); viral acquisition (referral + comic); these are the revenue bets |
| Ongoing | Content depth | AP-037 (ambient) · AP-040 (500+ Daily Play) | safe | Reduces churn from repetition; strengthens personalization claim |

---

## Redesign Reconciliation — Arbor Web App Prototype (2026-06-23)

**PM:** arbor-pm · **Source:** `PAI/PRDs/arbor-redesign-handoff/_analysis/PROTOTYPE-CATALOGUE.md` + `LIVE-APP-INVENTORY.md` + `REDESIGN-DIFF.md`  
**Critical principle (no-regression):** The live app is richer than the prototype in games (14 vs 6), journeys (10 vs 4), activities (250+ vs ~3 shown), milestones (133 vs 35 visible), billing tiers (3 vs 2), nav depth (34 tabs vs 6 views), and has a memory ledger, scholar lens routing, voice I/O, and growth plans that do not appear in the prototype at all. Every Bucket-A ticket is a SHELL/UX upgrade wired to the existing live backend. No Bucket-A ticket rebuilds a feature from scratch. Implementing the prototype literally without this reconciliation would be a hard regression.  
**De-dupe against existing backlog:** AP-019 (CSS token architecture) is the existing token-system ticket. AP-043 (design system) builds ON TOP of AP-019's foundation — AP-019 ships first as a hard prerequisite. AP-015/AP-016/AP-017/AP-018/AP-019/AP-020 cover the "look paid" visual sprint; this block adds the IA + interaction layer the prototype brings net-new.

**Scoring formula (same as existing backlog):** reach × impact × confidence × strategic_fit ÷ effort

---

### Bucket-A Tickets — Net-New from Prototype

**AP-043** *(Wave 1 — Design Foundation)*
- **Title:** Design system token layer — replace 344 hardcoded hex literals with CSS custom properties and a theme file
- **Bucket:** A — Net-New (prototype introduces a coherent token/theming system; live app has none)
- **Reskins:** Every existing UI component — zero backend change. Hard prerequisite for AP-044, AP-050, AP-051, AP-053, AP-054. Must ship before any other Bucket-A wave.
- **From:** Prototype accent-theme system (PROTOTYPE-CATALOGUE §1E Accent theming), REDESIGN-DIFF A-7
- **Type:** enhancement · **Stream:** product · **riskClass:** safe
- **Owner pod:** arbor-design
- **Problem:** The live app has 344 hardcoded hex literals (per `arbor-app-architecture.md`). No design token layer exists. Every visual change requires a search-and-replace sweep. The prototype delivers a 3-accent-theme system (Green/Teal/Blue) that is impossible to implement safely without a token foundation. AP-019 (CSS architecture) is the structural prerequisite; this ticket extends it with the full semantic token vocabulary (color, type scale, spacing, radius, shadow) and theme-switching runtime.
- **No-regression note:** Token migration must produce identical rendered output on every existing screen before ship. A visual regression test pass (screenshots of all 34-tab surfaces before and after) is the acceptance gate. No component behaviour changes — tokens only.
- **Acceptance criteria:** (1) All 344 hardcoded hex literals replaced with CSS custom property references (e.g. `--color-brand-primary`). (2) A `tokens.css` or equivalent single-source token file defines semantic values for color, type scale, spacing, radius, shadow per the Green theme (default). (3) Theme switching via a `data-theme` attribute on the root element switches to Teal or Blue without layout change. (4) Visual regression test (before/after screenshot diff on all primary surfaces) returns zero unintended diffs. (5) Hard dep on AP-019 landing first.
- **Success metric:** Zero hardcoded hex values in the build tree after ship; visual regression pass 100%.
- **Score:** priority = (5 × 4 × 0.9 × 1.0) ÷ 3 = **6.0**
- **Gate:** safe — pure styling. Standard DevSecOps gate. Hard prerequisite for the entire Bucket-A wave. **Wave 1.**

---

**AP-044** *(Wave 1 — Design Foundation)*
- **Title:** Desktop sidebar + topbar shell — IA chrome upgrade for web (sidebar nav + topbar container)
- **Bucket:** A — Net-New (prototype adds a persistent sidebar + topbar as the desktop navigation paradigm; live uses a flat Shell.tsx tab bar)
- **Reskins:** `Shell.tsx` and `navigation.ts` chrome layer. All 34 existing routes stay — this is a new container, not a route change. Backend: zero.
- **From:** Prototype WEB §1B sidebar IA + topbar (6-view sidebar, topbar placeholder for search/notifications/switcher), REDESIGN-DIFF A-1
- **Type:** enhancement · **Stream:** product · **riskClass:** safe
- **Owner pod:** arbor-design + arbor-ux
- **Problem:** The live app's `Shell.tsx` uses a horizontal tab bar that does not scale to 34 routes on desktop. The prototype's sidebar + topbar is a standard desktop IA pattern that gives each of the 6 primary sections a persistent anchor and a topbar zone for global interactions (search, notifications, kid-switcher — those ship in Wave 2). The sidebar is the foundation; the topbar slots are placeholders in this ticket.
- **No-regression note:** All 34 existing routes must remain navigable after the shell swap. Mobile layout must remain intact (sidebar collapses to the existing bottom-tab pattern below 768px breakpoint). No route is removed, hidden, or unreachable.
- **Acceptance criteria:** (1) A persistent left sidebar renders on viewports ≥768px with the 6 primary navigation labels. (2) On mobile (<768px), the existing bottom-tab pattern is preserved exactly. (3) All 34 existing sub-routes remain reachable via nested nav within each sidebar section. (4) The topbar zone renders as a placeholder bar (empty or logo-only) — Wave 2 tickets populate it. (5) Hard dep on AP-043 (tokens) landing first. (6) Passes DevSecOps gate + visual regression on mobile and desktop.
- **Success metric:** All 34 routes reachable in the new shell; mobile layout unchanged; zero navigation regressions in the test suite.
- **Score:** priority = (5 × 4 × 0.85 × 1.0) ÷ 3 = **5.67**
- **Gate:** safe — pure frontend. No data change. **Wave 1.**

---

**AP-045** *(Wave 2 — Topbar Interactions)*
- **Title:** Global search — topbar search over activities, milestones, journeys, and coach topics
- **Bucket:** A — Net-New (prototype web-only; no global search exists in live app)
- **Reskins:** Indexes existing `playbank/content.ts` activities, `milestoneData.ts` milestone names, `heroJourneys.ts` journey titles, coach topic names. Read-only query over existing data. Zero new data store.
- **From:** Prototype WEB topbar global search, REDESIGN-DIFF A-2
- **Type:** feature · **Stream:** product · **riskClass:** safe
- **Owner pod:** arbor-ux + arbor-design
- **Problem:** With 250+ activities, 133 milestones, 10 journeys, and 14 practice worlds, there is no way for a parent to find a specific item without navigating through multiple tabs. The prototype's topbar search box solves this — a single text query returns relevant activities, milestones, and journeys, deeplinked.
- **No-regression note:** Search indexes existing content only. No new data is written to the child's record. No AI inference runs against the query. The search result is a set of deep-links into existing screens.
- **Acceptance criteria:** (1) Topbar search input opens a results overlay on focus. (2) Results include: matching activities (name + domain), matching milestones (name + domain), matching journeys (name), matching practice worlds (name). (3) Selecting a result deep-links to the existing screen for that item. (4) Search is client-side (no new API endpoint required in Phase 1). (5) Hard dep on AP-044 (topbar shell) landing first. **(6) BINDING SAFETY CONDITION (arbor-safety, added 2026-06-23 per AUDIT-gates Risk-1): Search MUST index content catalogs only — activity names, milestone names, journey titles, practice world names. It must NEVER index child-record fields: behavior log entries, memory ledger content, journal text, observation notes, or any parent-logged child data. Indexing child-record fields would create a child-data egress surface and upgrades this ticket to gated. arbor-sec confirms the index source on ship.**
- **Success metric:** Parent can reach any activity, milestone, or journey by typing its name into search; result tap deep-links to the correct screen; zero child-record fields appear in search results.
- **Score:** priority = (4 × 3 × 0.8 × 1.0) ÷ 3 = **3.2**
- **Gate:** safe — confirmed read-only over content catalogs only (not child-record fields). [Safety condition added 2026-06-23 per AUDIT-gates Risk-1.] **Wave 2.**

---

**AP-046** *(Wave 2 — Topbar Interactions)*
- **Title:** Topbar notification center — surfaces existing JITAI nudges and monitoring signals as a notification list
- **Bucket:** A — Net-New (prototype adds a notification bell; live app has no notification center UI)
- **Reskins:** The existing JITAI nudge engine (`lib/jitai.ts`, AP-005 landed i18n fix) and monitoring signals already computed by `monitoring.ts`. The bell is a display surface over signals already in memory — it does not generate new signals or push to FCM (that is AP-038, separately gated).
- **From:** Prototype WEB topbar notification bell, REDESIGN-DIFF A-3
- **Type:** enhancement · **Stream:** product · **riskClass:** safe
- **Owner pod:** arbor-design + arbor-growth
- **Problem:** The JITAI engine generates context-aware nudges; `monitoring.ts` generates surveillance signals. Both appear only as inline nudges on the Today/Overview tab. A parent who is not on the Today tab misses every signal. The notification bell collects these signals into one in-app center — without adding any new push consent or FCM dependency.
- **No-regression note:** This ticket covers in-app notification display only. No push notification (FCM) is added in this ticket — that remains AP-038 (gated). The Today tab inline nudge continues to render exactly as before.
- **Acceptance criteria:** (1) Topbar bell icon with an unread count badge. (2) Clicking the bell opens a notification list showing recent JITAI nudges + any monitoring signals from `monitoring.ts`. (3) Each notification item links to the relevant screen (e.g. a domain-monitoring note links to MilestonesTab). (4) Notifications are marked read on view. (5) Hard dep on AP-044. **(6) BINDING SAFETY CONDITION (arbor-safety, re-affirmed 2026-06-23 per AUDIT-gates M-2): The bell MUST render each monitoring note's existing non-diagnostic copy verbatim — the exact text already cleared in `monitoring.ts`. It must NOT compress, re-headline, or summarize monitoring notes. The unread badge count must NOT be presented in a way that reads as "N problems" or "N alerts" — the badge is a notification count, never a problem count. Any compression or re-headlining of monitoring copy drifts this ticket into gated territory and blocks ship. This condition is a hard acceptance gate, not a guideline.**
- **Success metric:** At least one notification type (JITAI nudge or monitoring signal) visible in the bell list for any parent with logged events; zero regression on Today-tab inline nudge; monitoring copy verbatim in bell matches `monitoring.ts` source text exactly.
- **Score:** priority = (4 × 3 × 0.8 × 1.0) ÷ 2 = **4.8**
- **Gate:** safe — in-app display only; no new child-data egress; no push consent surface added. Stays safe ONLY if the verbatim-monitoring-copy + no-re-headline acceptance condition (AC-6 above) is enforced. [Condition added 2026-06-23 per AUDIT-gates M-2.] **Wave 2.**

---

**AP-047** *(Wave 2 — Topbar Interactions)*
- **Title:** Multi-kid switcher + Add Child in topbar — promote child chip from Profile tab to topbar
- **Bucket:** A — Net-New (prototype adds a topbar child chip with switch + add; live has the capability buried in Profile)
- **Reskins:** The existing multi-child management system (`ProfileContext.tsx`, `ProfileSwitcher.tsx`) and the Add Child flow. The topbar chip is a new access point — the underlying data model and permissions are unchanged.
- **From:** Prototype WEB topbar multi-kid switcher + add-child, REDESIGN-DIFF A-4
- **Type:** enhancement · **Stream:** product · **riskClass:** safe
- **Owner pod:** arbor-design + arbor-ux
- **Problem:** Multi-child management is a first-class live capability (ProfileSwitcher.tsx, Family tier) but it lives inside the Profile tab, two taps deep. The topbar child chip (child name + avatar initial + down-arrow) is the prototype's solution: one tap opens the switcher. This is the correct placement for a product where the active child is the session context.
- **No-regression note:** The underlying ProfileContext, ProfileSwitcher, and Add Child flows are not modified — only their trigger location changes. The Profile tab retains the full multi-child management surface.
- **Acceptance criteria:** (1) Topbar shows a chip with the active child's name (or avatar initial) + a dropdown affordance. (2) Tapping the chip opens the existing ProfileSwitcher component (or equivalent popover). (3) An "Add child" option in the popover opens the existing Add Child flow. (4) Switching child via the topbar chip sets the active child context identically to switching via the Profile tab. (5) Hard dep on AP-044.
- **Success metric:** Multi-child switch accessible in ≤1 tap from any screen; Add Child accessible from topbar; Profile tab switcher still functions as a fallback.
- **Score:** priority = (4 × 3 × 0.85 × 1.0) ÷ 2 = **5.1**
- **Gate:** safe — existing capability, new entry point. No new child-data write path. **Wave 2.**

---

**AP-048** *(Wave 3 — Kid Mode + Onboarding)*
- **Title:** Kid Mode desktop overlay — mode-toggle on desktop shell routes to existing child-facing surfaces
- **Bucket:** A — Net-New (prototype adds an explicit "Kid Mode" desktop overlay; live app has no desktop mode-switch)
- **Reskins:** The existing child-facing routes: `HeroArcade.tsx` (14 worlds), `HeroJourneyTab.tsx` (10 journeys), the Feelings check-in surface, and any Practice Studio routes. The overlay is a new entry mechanism — all 14 worlds and 10 journeys behind it remain unchanged.
- **From:** Prototype WEB §1D Kid Mode overlay, REDESIGN-DIFF A-5
- **Type:** feature · **Stream:** product · **riskClass:** safe
- **Owner pod:** arbor-design + arbor-ux
- **Problem:** On mobile, the live app has a parent/kid world separation. On desktop, there is no child-facing mode at all — a parent who hands a laptop or desktop to their child has no safe, child-appropriate context to switch to. The Kid Mode overlay provides a full-screen child-calm UI wrapper over the existing child surfaces.
- **No-regression note:** Entering Kid Mode does not change any data in the child's record. Exiting Kid Mode returns the parent to the exact state they left. The 14 practice worlds and 10 journeys behind the overlay remain byte-for-byte identical.
- **Acceptance criteria:** (1) A "Kid Mode" toggle/button in the topbar or sidebar launches a full-screen overlay styled for the child audience (larger typography, child-playful register). (2) The overlay surfaces: Hero Arcade (all 14 worlds), Hero Journeys (all 10 stories), Feelings check-in. (3) Exiting Kid Mode requires a parent gesture (e.g. a back-tap + PIN or password) to prevent a child from accidentally leaving. (4) Hard dep on AP-044 (shell). (5) No child-data write occurs on enter/exit.
- **Success metric:** Desktop users can enter and exit Kid Mode without regression on any of the 14 worlds or 10 journeys; no data written on mode switch.
- **Score:** priority = (4 × 4 × 0.8 × 1.0) ÷ 3 = **4.27**
- **Gate:** safe — pure frontend mode wrapper; no new data surface. **Wave 3.**

---

**AP-049** *(Wave 3 — Kid Mode + Onboarding)*
- **Title:** 5-step structured onboarding flow — Welcome → Child setup → Focus selection → Avatar creation → Ready
- **Bucket:** A — Net-New (prototype has a 5-step onboarding with progress dots, back/continue/skip; live OnboardingFlow.tsx is a stub)
- **Reskins:** The existing `OnboardingFlow.tsx` (AP-008 adds the months sub-input), `ProfileContext.tsx`, the Focus domain selector (product concept, not yet a UI step), and the existing `AvatarCreator.tsx` (BUILT/DEPLOYED/VERIFIED in prod). This ticket surfaces those existing capabilities as a structured 5-step flow.
- **From:** Prototype MOBILE §1A onboarding (5 steps), REDESIGN-DIFF A-6
- **Type:** feature · **Stream:** product · **riskClass:** gated (Step 3 focus-domain selection requires arbor-clinical-psych copy pass to confirm non-pathologizing framing; Step 4 avatar creation is child-data under COPPA/GDPR — arbor-safety consent review required)
- **Owner pod:** arbor-design + arbor-ux + arbor-growth
- **Problem:** First-run onboarding is Arbor's only chance to set the moat in motion. The current stub asks for a child's name and age and then drops the parent at the overview. The 5-step flow (in the prototype) delivers a personalized first experience: the parent picks focus domains, the child gets an avatar, and Arbor presents a tuned 7-domain framework on entry. This is the first payoff of the personalization claim.
- **No-regression note:** AP-008 (months sub-input for under-2s, gated) is a parallel ticket. AP-049 must not block on AP-008's clinical gate — the two can ship independently. Onboarding data writes to the existing child profile (`ProfileContext`) with no schema change. Avatar creation in Step 4 uses the existing `AvatarCreator.tsx` consent path.
- **Acceptance criteria:** (1) 5 distinct steps with progress dots, back/continue/skip controls, and a re-launchable onboarding demo. (2) Step 1: Welcome screen. (3) Step 2: Child name + age (integrates with AP-008 if shipped; falls back to year input if AP-008 not yet live). (4) Step 3: Focus selection (7 domains presented as tiles; parent picks any; copy passes arbor-clinical-psych non-pathologizing review). (5) Step 4: Avatar creation (uses existing AvatarCreator consent + local-only storage; COPPA/GDPR consent surface reviewed by arbor-safety). (6) Step 5: Ready — summary of selections; CTA "Enter Arbor." (7) Hard dep on AP-043 (tokens) and AP-044 (shell).
- **Success metric:** Onboarding completion rate ≥70% of new activations; avatar created at Step 4 ≥50% of completions; first meaningful action (log a moment or open coach) within 5 minutes of entering Arbor.
- **Score:** priority = (5 × 5 × 0.85 × 1.0) ÷ 3 = **7.08** (gated — surfaces for Guy; clinical-psych and safety sign-off required)
- **Gate:** gated — Step 3 domain-selection copy requires arbor-clinical-psych non-pathologizing sign-off; Step 4 avatar-creation child-data path requires arbor-safety COPPA/GDPR review. Step 1/2/5 are safe and could ship first as a safe slice. **Wave 3.**

---

**AP-050** *(Wave 4 — Enrichment + Value Loops)*
- **Title:** Hero Avatar Engine — shared canvas module fanning the avatar to all 8 surfaces
- **Bucket:** A — Net-New (prototype's Hero Avatar Engine is a named shared module; live re-implements compositing per surface)
- **Reskins:** The existing avatar generation pipeline (`AvatarCreator.tsx`, Gemini vision), story render paths (`HeroJourneyTab.tsx`, `heroJourneys.ts`), and the `comics` tab. The canonical build rule: one shared canvas module; add a surface by passing a new template — never re-implement compositing.
- **From:** Prototype BLUEPRINT §3 + §4 Avatar fan-out build rule, PROTOTYPE-CATALOGUE §5, REDESIGN-DIFF A-8
- **Type:** feature · **Stream:** product · **riskClass:** safe
- **Owner pod:** arbor-avatar
- **Problem:** The avatar exists and is production-deployed. It is used in stories and comics but compositing is reimplemented at each surface. The Blueprint explicitly names 8 surfaces where the hero avatar should appear: Hero Card, comic cover + 6 panels, Academy hero, Studio stamp, reward/badge art, breathing-guide buddy, milestone celebration. Each new surface today requires a new compositing implementation — which is why they are absent. One shared canvas module with template-passing eliminates that cost.
- **No-regression note:** Existing avatar use in `HeroJourneyTab` and `comics` tab must produce identical output after the shared module lands. The shared module wraps current behavior; it does not replace the existing avatar generation itself. Zero new child-data capture — the saved avatar is the input.
- **Acceptance criteria:** (1) A shared `HeroAvatarCanvas` module accepts a backdrop template + the saved avatar and composites them on a canvas. (2) Existing story/comic surfaces are migrated to use this module with no visible output change (visual regression test). (3) At least 3 additional surfaces are wired to the module using new templates: Hero Card (sharable), Practice Studio stamp, Milestone celebration. (4) Adding a new surface requires only a new template file — no compositing code written. (5) C2PA/SynthID signature is applied at export (consistent with existing pipeline). (6) Hard dep on AP-043 (tokens) for styling.
- **Success metric:** All 3 new surfaces showing the hero avatar; existing story/comic output unchanged (visual regression 100%); zero new compositing implementations outside the shared module.
- **Score:** priority = (4 × 4 × 0.8 × 1.0) ÷ 3 = **4.27**
- **Gate:** safe — zero new child-data; avatar is already generated and stored locally; C2PA path is existing. **Wave 4.**

---

**AP-051** *(Wave 4 — Enrichment + Value Loops)*
- **Title:** Day Windows — hour-by-hour calm/hard-time prediction panel (visualization over existing JITAI + behavior data)
- **Bucket:** A — Net-New (prototype shows a full Day Windows dashboard; no equivalent surface exists in live app)
- **Reskins:** The existing JITAI rhythm engine (`lib/jitai.ts`) and behavior log data (`BehaviorsTab.tsx`, `behaviors/PatternInsights.tsx`). Day Windows is a visualization layer — it reads already-computed rhythm signals and behavior patterns; it does not generate new signals or write new child data.
- **From:** Prototype MOBILE §1C Day Windows dashboard, REDESIGN-DIFF A-9
- **Type:** feature · **Stream:** product · **riskClass:** gated (surfaces a time-of-day predictive signal derived from the child's behavior log; requires arbor-clinical-psych copy pass to confirm non-pathologizing, non-predictive-overreach framing)
- **Owner pod:** arbor-growth + arbor-design
- **Problem:** The JITAI engine already computes rhythm patterns ("mornings hard 5/7 days"). This is never surfaced as a parent-facing visualization — the parent cannot see why the nudge fired or understand their child's daily rhythm. Day Windows makes this signal visible: a 24-hour bar showing predicted calm vs hard-time windows, pattern detection ("mornings before preschool hard 5/7 days"), and an honest "sharpens as you log" value framing.
- **No-regression note:** Day Windows reads existing behavior log and JITAI data only. It does not write to the child's record. The Today/Overview tab continues to render its existing nudge inline; Day Windows is an additional detail view, not a replacement.
- **Acceptance criteria:** (1) A "Day Windows" panel (accessible from the Today/Overview tab or the sidebar) shows a 24-hour visualization of the child's predicted calm/hard-time windows, derived from the existing JITAI engine. (2) Pattern detection copy surfaces plain-language observations: "Mornings before preschool have been harder 5 of the last 7 days." (3) Copy is non-predictive in framing: windows are presented as tendencies from the log, not guarantees. (4) "Sharpens as you log" messaging sets honest expectations with <7 days of data. (5) arbor-clinical-psych sign-off on all copy before build-ready. (6) Hard dep on AP-043 (tokens).
- **Success metric:** Parents with ≥7 behavior log entries see a populated Day Windows panel; zero copy that implies deterministic prediction or clinical diagnosis.
- **Score:** priority = (4 × 4 × 0.75 × 1.0) ÷ 3 = **4.0** (gated — clinical-psych copy pass required)
- **Gate:** gated (psych copy pass). Child-data read (behavior log). Not auto-scheduled — surfaces for Guy. **Wave 4.**

---

**AP-052** *(Wave 4 — Enrichment + Value Loops)*
- **Title:** Accent theme switching — Green / Teal / Blue user preference, wired to the token layer
- **Bucket:** A — Net-New (prototype has 3 accent themes; live has no theme switching)
- **Reskins:** The design token layer (AP-043). This is a 2-hour extension once AP-043 ships — a `data-theme` attribute swap + persisting the preference to localStorage. No backend change.
- **From:** Prototype §1E Accent theming, REDESIGN-DIFF A-10
- **Type:** enhancement · **Stream:** product · **riskClass:** safe
- **Owner pod:** arbor-design
- **Problem:** Brand differentiation and perceived quality. Minor effort once the token layer (AP-043) is live. Delightful personalization that costs nothing to maintain.
- **No-regression note:** All three themes produce identical layout — only color tokens switch. Accessibility contrast ratios must be verified for all three themes before ship.
- **Acceptance criteria:** (1) A theme preference setting (in Profile or Settings) offers Green / Teal / Blue. (2) Selecting a theme swaps the `data-theme` attribute on the root element and all CSS custom property overrides apply. (3) The preference is persisted to localStorage and survives reload. (4) WCAG AA contrast is verified for all three themes on all primary surfaces. (5) Hard dep on AP-043.
- **Success metric:** All three themes render without layout change; contrast ratios WCAG AA passing in all three; preference persists across sessions.
- **Score:** priority = (3 × 2 × 0.9 × 0.8) ÷ 1 = **4.32**
- **Gate:** safe. **Wave 4.**

---

**AP-053** *(Wave 4 — Enrichment + Value Loops)*
- **Title:** Development Copilot + Learning Map in Academy — join existing copilot recommendations with Academy course progress by domain
- **Bucket:** A — Net-New (prototype shows a unified Copilot + Learning Map in Academy; live has these as separate tabs)
- **Reskins:** The existing `copilot` route (FULL) and Academy `masterclasses` tab. The join is a new UI surface — the data (copilot recommendations + course completion by domain) already exists.
- **From:** Prototype MOBILE §1B Academy Copilot + Learning Map, REDESIGN-DIFF A-11
- **Type:** enhancement · **Stream:** product · **riskClass:** safe
- **Owner pod:** arbor-design + arbor-ux
- **Problem:** The copilot already recommends focus domains based on the Development Map. Academy courses are tagged to domains. But the parent sees them in two separate tabs and cannot connect "Arbor suggests focusing on Self-Regulation" with "here are the Academy courses for Self-Regulation + how far along you are." The Learning Map visualization closes this gap.
- **No-regression note:** The existing copilot tab and Academy courses are not moved or removed — this ticket adds a view within Academy that joins them. Both existing tabs continue to function independently.
- **Acceptance criteria:** (1) An Academy "For You" section surfaces the current copilot focus recommendation ("Arbor suggests: Self-Regulation — here's why") with a course-progress roll-up by domain. (2) Each domain shows: % of its Academy courses completed, courses available for this domain. (3) Data is read from existing copilot output and course-completion state — no new AI call. (4) Hard dep on AP-043.
- **Success metric:** Academy "For You" section visible to any parent with ≥1 copilot recommendation and ≥1 Academy course started; course completion rate measurably higher for recommended-domain courses (measured at 30 days).
- **Score:** priority = (4 × 3 × 0.8 × 1.0) ÷ 2 = **4.8**
- **Gate:** gated (light) — the "Arbor suggests focusing on Self-Regulation — here's why" copilot copy surfaces a developmental recommendation tied to the child's lowest-scoring domain. This is the same class of "surface a developmental read to the parent" that holds AP-051 (Day Windows) as gated. A new display surface that foregrounds a lowest-domain verdict can re-frame an already-sound signal into an implied deficit read. Required: **arbor-clinical-psych copy pass on the "here's why" / lowest-domain recommendation framing before build-ready.** Note: "no new AI call" addresses cost, not framing — the gate is framing, not inference. [Re-gated 2026-06-23 per AUDIT-gates M-1.] **Wave 4 — after framing pass.**

---

**AP-054** *(Wave 4 — Enrichment + Value Loops)*
- **Title:** Language Lab — bilingual vocabulary tracker with HE/EN word-count and balance trend
- **Bucket:** A — Net-New (prototype shows a bilingual vocabulary count dashboard; live Language tab has phrase cards and Serve & Return but no count or trend visualization)
- **Reskins:** The existing `language` tab (FULL) data model and i18n infrastructure (`LanguageContext.tsx`, `i18n.ts`). Adds a count/trend visualization layer over parent-logged phrase observations.
- **From:** Prototype MOBILE §2 Language Lab (bilingual vocabulary counts + balance chart), REDESIGN-DIFF A-12
- **Type:** feature · **Stream:** product · **riskClass:** gated (vocabulary counts are parent-logged observations derived from the child's language record; clinical copy must not imply a bilingual development screen or readiness verdict — arbor-clinical-slp framing pass required to confirm ASHA-grounded non-screen framing)
- **Owner pod:** arbor-growth + arbor-design
- **Problem:** Bilingual families (the #1 Arbor demographic in IL) want to track whether their child is developing both languages. The live Language tab has phrase cards but no count or balance visualization. The prototype's Language Lab shows the counts (~620 HE / ~410 EN, 62% balance) and a vocabulary-over-time trend — a powerful moat-native signal for bilingual families that no competitor offers.
- **No-regression note:** The existing Language tab phrase cards and Serve & Return surfaces are not changed. The Language Lab view is an addition, not a replacement. Vocabulary counts are derived from parent-logged phrase observations only — no ASR or automated word-detection is added in this ticket.
- **Acceptance criteria:** (1) A "Language Lab" view in the Language tab shows: total HE word count, total EN word count, and a balance % (HE/(HE+EN)). (2) A vocabulary-over-time trend chart shows word count growth per language over the last 90 days. (3) Suggested balanced activities surface (e.g. "try more Hebrew story-time this week") — copy requires arbor-clinical-slp sign-off to confirm non-screen framing. (4) All counts are derived from parent-logged observations; the tab makes this provenance explicit ("based on what you've logged"). (5) No vocabulary count is presented as a readiness score or developmental verdict — counts are observations, not assessments. (6) Hard dep on AP-043 (tokens).
- **Success metric:** Bilingual families with ≥20 language-tab logs see a populated Language Lab; zero copy implying the counts are a development screen or readiness verdict.
- **Score:** priority = (3 × 3 × 0.75 × 1.0) ÷ 3 = **2.25** (gated — SLP framing pass required)
- **Gate:** gated (arbor-clinical-slp framing pass on all "suggested balanced activities" copy and any balance-percentage interpretation framing). Not auto-scheduled — surfaces for Guy. **Wave 4.**

---

**AP-055** *(Later FE wave — post-Wave 4)*
- **Title:** Scholar Hub — weekly auto-matched developmental-concept feed in Academy
- **Bucket:** A — Net-New (prototype has a full Scholar Hub surface; LIVE-APP-INVENTORY.md has no article-recommendation engine keyed to the child's domain data)
- **From:** `Arbor Prototype.dc.html` lines 1666, 1761–1769; PROTOTYPE-CATALOGUE §1C "Scholar Hub"; AUDIT-missed-netnew M-1 (2026-06-23)
- **Type:** feature · **Stream:** product · **riskClass:** safe
- **Owner pod:** arbor-ux + arbor-design
- **Problem:** The live app has masterclasses (FULL) but no Scholar Hub — a weekly auto-matched developmental-concept article surface keyed to the child's lowest-scoring domain. The prototype routes it under the ACADEMY category alongside courses, activities, and Bedtime Stories. Topics: Regulation, Attachment, Bilingualism, Transitions. Each article is auto-selected from the child's live domain data, not a generic catalogue.
- **Acceptance criteria:** (1) An Academy "Scholar Hub" section surfaces one developmental-concept article per week, auto-matched to the child's current lowest domain from the Development Map. (2) Article catalogue covers at minimum the four prototype topic areas (Regulation, Attachment, Bilingualism, Transitions). (3) Articles are editorial content — no per-article developmental-claim or AI-derived verdict. (4) Surfaced in the Academy category landing alongside courses. (5) Hard dep on AP-043 (tokens) + AP-044 (shell) and AP-049 (domain data from onboarding).
- **Success metric:** Parents with a populated Development Map see a weekly Scholar Hub article; article click-through rate ≥10% within 7 days of publish.
- **Score:** priority = (4 × 3 × 0.75 × 1.0) ÷ 3 = **3.0**
- **Gate:** safe — read-only, editorial content, no new developmental claim surfaced. **Wave: later FE, post-Wave 4 (after AP-049 domain data and Academy shell are live).**

---

**AP-056** *(Post-clearance — gated)*
- **Title:** School Handoff Brief — 1-page preschool-staff export (distinct from specialist/clinician consult packet)
- **Bucket:** A — Net-New (prototype has a full School Handoff surface; LIVE-APP-INVENTORY.md `consult` route is the clinician/specialist-facing consult packet — this is a distinct artifact for preschool teachers)
- **From:** `Arbor Prototype.dc.html` lines 1671, 1752–1760; PROTOTYPE-CATALOGUE §1C "School Handoff"; AUDIT-missed-netnew M-2 (2026-06-23)
- **Type:** feature · **Stream:** product · **riskClass:** gated
- **Owner pod:** arbor-design + arbor-ux + arbor-safety
- **Problem:** The prototype's School Handoff Brief is distinct from the clinician consult packet (AP-049/B-9): different audience (preschool/kindergarten teachers, not specialists), different content (what calms the child, words that help, bilingual transition phrases), a different privacy gate ("nothing shared until you approve"), and a different scope (1 page, no clinical data). Bilingual families (the IL beachhead) need this — Hebrew at home, English at school transition context is a primary use-case.
- **Acceptance criteria:** (1) A parent-controlled "School Brief" surface in the Care Network, distinct from the clinician consult packet. (2) Content fields: calm strategies, transition phrases, bilingual framing (e.g. Hebrew home / English school). (3) Nothing is shared until parent explicitly approves export. (4) Export path: PDF download or send-to-teacher. (5) arbor-clinical-psych copy pass on transition-language framing (non-diagnostic, parent-mediated). (6) arbor-safety COPPA review on child data included in export. (7) Hard dep on AP-049 (onboarding/profile) and AP-044 (shell).
- **No-regression note:** Must not flatten or replace the existing clinician consult packet (B-9 protect note from REDESIGN-DIFF). The two artifacts coexist.
- **Success metric:** Bilingual families export at least one School Brief; brief is ≤1 page and contains zero clinical-diagnosis language.
- **Score:** priority = (3 × 4 × 0.70 × 1.0) ÷ 3 = **2.8** (gated — clinical-psych + safety sign-off required)
- **Gate:** gated — arbor-clinical-psych copy pass on transition-language framing; arbor-safety COPPA review on child data in export. Not auto-scheduled — surfaces for Guy. **Wave: post-clearance.**
- **Claim register:** None (no developmental-outcome claim; framing gate is for tone/safety, not a substantiated-claim burden).

---

**AP-057** *(Post-clearance — gated)*
- **Title:** Bedtime Stories — AI-generated nightly story library starring the hero avatar, with HE/EN read-aloud
- **Bucket:** A — Net-New (prototype has a full Bedtime Stories surface; live `stories` [FULL] = 10 interactive Hero Journeys — Bedtime Stories is a distinct format: parent-side, auto-generated from the day's events, read-aloud, avatar-starred)
- **From:** `Arbor Prototype.dc.html` lines 1667, 1812–1820; PROTOTYPE-CATALOGUE §1C "Bedtime Stories"; AUDIT-missed-netnew M-3 (2026-06-23)
- **Type:** feature · **Stream:** product · **riskClass:** gated
- **Owner pod:** arbor-avatar + arbor-ai + arbor-safety
- **Problem:** Hero Journeys (interactive 8-beat child-facing adventures, 10 packs) are the existing `stories` route. Bedtime Stories is a separate concept: a parent-accessible library of AI-generated stories rooted in the child's day, starring their hero avatar, with HE/EN read-aloud voice playback. The prototype routes them under ACADEMY as "Mia's library." The moat play is deep: the story is personalized from the memory record no competitor has access to.
- **Acceptance criteria:** (1) A "Bedtime Stories" library under Academy shows AI-generated stories rooted in the child's logged day (e.g. "Mia and the Brave Goodbye" from a logged transition moment). (2) Each story stars the child's hero avatar. (3) Read-aloud voice playback in HE or EN (child's app language). (4) Stories are generated fresh ("new tonight") using the memory record as context. (5) Child-day data input to the story-generation prompt passes arbor-safety COPPA review. (6) Any developmental framing in generated story prompts passes arbor-clinical-psych copy pass (prompts must not frame the day's events as developmental deficits). (7) Distinct from Hero Journeys — both surfaces coexist. (8) Hard dep on AP-050 (avatar engine) and AP-043 (tokens).
- **Success metric:** Parents with ≥3 logged events see at least one generated bedtime story per week; stories are rated positive by parents (qualitative gate before scaling).
- **Score:** priority = (4 × 4 × 0.65 × 1.0) ÷ 4 = **2.6** (gated — COPPA + clinical-psych gates)
- **Gate:** gated — arbor-safety COPPA review on child-day data as story-generation input; arbor-clinical-psych copy pass on story-prompt framing (non-pathologizing of logged events). Not auto-scheduled — surfaces for Guy. **Wave: post-clearance.**
- **Claim register:** None (personalized narrative; no developmental-outcome claim).

---

**AP-058** *(Post-clearance — gated)*
- **Title:** Smart Reminders settings dashboard — parent-controlled nudge cadence (type toggles, quiet-hours, calm-window scheduling, ≤2/day ceiling)
- **Bucket:** A — Net-New (prototype has a full Smart Reminders mini-dashboard; live JITAI engine produces nudges but has no dedicated settings/status surface)
- **From:** `Arbor Prototype.dc.html` lines 1674, 1845–1860; PROTOTYPE-CATALOGUE §1C "Smart Reminders"; AUDIT-missed-netnew M-4 (2026-06-23)
- **Type:** enhancement · **Stream:** product · **riskClass:** gated
- **Owner pod:** arbor-growth + arbor-design
- **Problem:** The existing JITAI engine (`lib/jitai.ts`) produces nudges that appear inline on the Today/Overview tab. There is no dedicated Smart Reminders settings/status surface — no route, no control panel. The prototype shows a full mini-dashboard: next scheduled nudge (time + type), reminder-type toggles (Today's guidance, milestone moment, weekly report), quiet-hours enforcement, and an explicit ≤2 nudges/day contract. Without this surface, parents cannot understand or manage their nudge experience — a source of friction and churn.
- **Acceptance criteria:** (1) A dedicated "Smart Reminders" view accessible from the Ask Arbor section or Settings shows: next scheduled nudge (time + type). (2) Per-type toggle: Today's guidance / Milestone moment / Weekly report (each on/off). (3) Quiet-hours configuration (start time + end time; default 9pm–8am). (4) Calm-window scheduling toggle (routes nudges to JITAI-predicted calm windows only). (5) An explicit "max 2 nudges per day" contract visible in the UI. (6) All settings wire to the existing JITAI engine — no new nudge engine. (7) arbor-clinical-psych copy pass on the nudge-cadence framing (advisory-tension item: nudge settings copy must not imply the app is monitoring the child or that more nudges = better outcomes).
- **Success metric:** Parents who open the Smart Reminders dashboard report higher notification satisfaction (NPS sub-question); nudge opt-out rate lower than baseline.
- **Score:** priority = (4 × 3 × 0.75 × 1.0) ÷ 2 = **4.5** (gated — clinical-psych copy pass required)
- **Gate:** gated — arbor-clinical-psych copy pass on nudge-cadence framing (advisory-tension: nudge settings must not frame the JITAI engine as a monitoring/surveillance system or imply more nudges = better development). Not auto-scheduled — surfaces for Guy. **Wave: post-clearance.**

---

**AP-059** *(Later FE wave — post-Wave 4)*
- **Title:** Kid weekly missions calendar — 7-day per-day mission-type progress strip in the Learning Studio
- **Bucket:** A — Net-New (prototype has a `weekMissions` 7-day strip; live has the practice studio and cosmetics but no weekly missions calendar view in the child-facing Studio)
- **From:** `Arbor Prototype.dc.html` lines 884–895, 1580–1588, 2095; PROTOTYPE-CATALOGUE §1D "Studio / Learning Studio — weekly missions calendar"; AUDIT-missed-netnew M-5 (2026-06-23)
- **Type:** enhancement · **Stream:** product · **riskClass:** safe
- **Owner pod:** arbor-practice + arbor-design
- **Problem:** The child-facing Learning Studio has daily-goal rings and effort badges but no weekly cadence layer. The prototype's 7-day strip shows per-day mission completion status (color-coded by activity type: movement/art/feelings/reading/etc.), with a "done" ring state and a "today" highlight. This creates the weekly habit calendar embedded in the child-facing Studio — the weekly layer of the existing kid economy (quest/practice engine).
- **Acceptance criteria:** (1) A 7-day progress strip renders at the top of the child-facing Learning Studio. (2) Each day shows completion status for the day's missions, color-coded by activity type. (3) "Today" is highlighted; completed days show a "done" ring state. (4) Strip is keyed to the existing quest/practice session data — no new child-data write beyond existing session logging. (5) Hard dep on AP-043 (tokens) and AP-044 (shell/Kid Mode).
- **Success metric:** Kids with ≥3 days of session data see a populated weekly strip; session return rate on day 7 of the week measurably higher vs baseline.
- **Score:** priority = (3 × 3 × 0.75 × 0.9) ÷ 2 = **3.04**
- **Gate:** safe — child UI, no new child-data write beyond existing session data. **Wave: later FE, post-Wave 4 (after AP-048 Kid Mode and Academy shell are live).**

---

**AP-060** *(Post-clearance — gated)*
- **Title:** "The Science" product trust page — parent-facing source-transparency dashboard (framework stats, cited standards, disclaimer)
- **Bucket:** A — Net-New (prototype has a full `evidence` detail block; LIVE-APP-INVENTORY.md has no "Science" or "Evidence" tab or page — existing coach citations AP-010 are coach-response-level, not a product-level trust page)
- **From:** `Arbor Prototype.dc.html` lines 1802–1811; PROTOTYPE-CATALOGUE §1C "The Science — 133 milestones · 7 domains · 40+ sources"; AUDIT-missed-netnew M-6 (2026-06-23)
- **Type:** feature · **Stream:** product · **riskClass:** gated
- **Owner pod:** arbor-design + arbor-clinical-lead
- **Problem:** No product-level credibility surface exists. The prototype's Evidence page is a standalone parent-facing page showing: 3 headline stats (133 milestones, 7 domains, 40+ sources), the clinical board composition (child psych / speech / developmental pediatrics), cited frameworks (CDC "Learn the Signs," ASQ-3, Co-regulation Siegel & Bryson), a list of source documents, and an explicit "Arbor isn't a diagnostic tool" disclaimer. This is a trust/credibility surface — the parent can verify why Arbor knows what it knows.
- **CHARTER FIREWALL (CRITICAL — binding):** The prototype's hero card uses "Expert-Reviewed / Arbor's clinical board" language. This is a **CHARTER §3 p11 firewall violation** — "clinician-reviewed" / "clinically validated" / "clinician-approved" language is explicitly prohibited. The page MUST reword all such language to "developmentally informed, grounded in CDC/AAP/ASHA" before it is build-ready. The board composition note must read "internal reviewers, not licensed clinicians" — never presented as a clinical endorsement. arbor-clinical-lead must review and sign off every word of the page before build.
- **Acceptance criteria:** (1) A standalone "The Science" page accessible from the profile or footer shows framework stats (133 milestones, 7 domains, 40+ sources). (2) Framework citations are source-linked (CDC LTSAE, ASQ-3, Siegel & Bryson, Gottman — all verifiable public links). (3) An explicit "Arbor isn't a diagnostic tool" disclaimer is prominently placed above the fold. (4) The clinical board note reads "developed with internal developmental reviewers" — NEVER "clinician-reviewed" or "clinically validated" (CHARTER firewall). (5) All copy passes arbor-clinical-lead sign-off before build. (6) Hard dep on AP-043 (tokens).
- **Success metric:** Parent trust score (survey) measurably higher for parents who visit The Science page vs those who do not; zero firewall violations in any copy string.
- **Score:** priority = (4 × 4 × 0.75 × 1.0) ÷ 2 = **6.0** (gated — clinical-lead copy clearance required)
- **Gate:** gated — arbor-clinical-lead copy pass required on every word before build-ready; the prototype's "clinician-reviewed" hero-card language is a CHARTER §3 p11 firewall violation and MUST be reworded to "developmentally informed, grounded in CDC/AAP/ASHA" before this ticket is build-ready. Not auto-scheduled — surfaces for Guy. **Wave: post-clearance.**
- **Claim register row:** "133 milestones · 7 domains · 40+ sources · CDC-grounded" — substantiated (live data + verifiable public sources); "developmentally informed, grounded in CDC/AAP/ASHA" — substantiated. Any copy that drifts to effect-size or outcome claim triggers a new claim-register row.

---

### Redesign Reconciliation — Wave Plan Summary

| Wave | AP- ids | Focus | Type | Backend touch | Gate |
|------|---------|-------|------|---------------|------|
| Wave 1 — Design Foundation | AP-043, AP-044 | Token layer + Desktop shell/IA | Pure frontend | None | safe — standard DevSecOps gate. Hard prerequisite for all other waves. |
| Wave 2 — Topbar Interactions | AP-045, AP-046, AP-047 | Global search, notification bell, multi-kid topbar chip | Pure frontend (read-only data queries) | Minimal read-only | safe — standard gate. Dep: AP-044 shipped. AP-045: content-catalog index only (Risk-1 AC). AP-046: verbatim monitoring copy required (AC-6). |
| Wave 3 — Kid Mode + Onboarding | AP-048, AP-049 | Kid Mode desktop overlay, 5-step onboarding | Frontend + light data write (onboarding) | Light (child profile write, existing path) | AP-048 safe. AP-049 gated (clinical-psych + safety sign-off). |
| Wave 4 — Enrichment + Value Loops | AP-050, AP-051, AP-052, AP-053, AP-054 | Avatar fan-out, Day Windows, Accent themes, Copilot+Learning Map, Language Lab | Mixed (AP-050/AP-052/AP-053 safe; AP-051/AP-054 read child data) | Read-only (behavior log, language log) | AP-050/AP-052 safe. AP-051/AP-054 gated (psych/SLP copy pass). AP-053 re-gated (light): clinical-psych "here's why" framing pass required. |
| Later FE waves (post-Wave 4) | AP-055, AP-059 | Scholar Hub concept feed, Kid weekly missions calendar | Pure frontend | None | safe — both read existing data; no new child-data write. Dep: Academy shell + AP-049 (domain data) for AP-055; Kid Mode + Academy shell for AP-059. |
| Post-clearance waves (gated) | AP-056, AP-057, AP-058, AP-060 | School Handoff Brief, Bedtime Stories, Smart Reminders dashboard, "The Science" page | Mixed (AP-057 = AI generation; AP-058 wires to JITAI; AP-056/AP-060 = export/display) | AP-057 reads memory record; AP-058 reads/writes JITAI settings | All four gated — see individual tickets. None may auto-schedule. All surface for Guy. |

**Bucket-A no-regression guarantee (binding on every wave):**
- Bucket B items (20 capabilities) are protected: every wave PR must confirm these are reachable and functional before merge.
- Bucket C dimensions (games 14, journeys 10, activities 250+, milestones 133, Family tier, 34 routes) must not decrease. Any PR that reduces a Bucket-C count is a hard regression block.
- arbor-devsecops-lead holds the ship gate on all redesign waves.

### Gated Bucket-A items surfaced for Guy

| AP- id | Item | Gate reason | What unblocks it |
|--------|------|-------------|-----------------|
| AP-049 | 5-step onboarding | Step 3 domain-selection: arbor-clinical-psych non-pathologizing copy pass; Step 4 avatar child-data: arbor-safety COPPA/GDPR review | Clinical-psych + safety sign-off; Guy confirms |
| AP-051 | Day Windows panel | arbor-clinical-psych copy pass on all pattern-detection framing | Psych lens returns framing:pass; Guy confirms |
| AP-053 | Copilot + Learning Map | Re-gated (light) 2026-06-23: "here's why" lowest-domain recommendation framing requires arbor-clinical-psych copy pass (same class as AP-051 developmental-read surfaces) | Psych copy-framing pass; Guy confirms |
| AP-054 | Language Lab | arbor-clinical-slp framing pass on balance-% interpretation and suggested-activities copy | SLP lens returns framing:pass; Guy confirms |
| AP-056 | School Handoff Brief | arbor-clinical-psych copy pass on transition-language framing; arbor-safety COPPA review on child data in export | Clinical-psych + safety sign-off; Guy confirms |
| AP-057 | Bedtime Stories | arbor-safety COPPA review on child-day data as story-generation input; arbor-clinical-psych copy pass on story-prompt framing | Safety + clinical-psych sign-off; Guy confirms |
| AP-058 | Smart Reminders dashboard | arbor-clinical-psych copy pass on nudge-cadence framing (advisory-tension: must not imply monitoring/surveillance) | Psych framing pass; Guy confirms |
| AP-060 | "The Science" page | arbor-clinical-lead copy pass on every word; CHARTER §3 p11 firewall: "clinician-reviewed" language in prototype must be reworded before build-ready | Clinical-lead sign-off on all copy (no "clinician-reviewed" / "Expert-Reviewed"); Guy confirms |

---

## PM Grooming — Store-Submission Blockers (2026-06-23)

**PM:** arbor-pm · **Date:** 2026-06-23 · **Source:** `PAI/projects/parenting-os-plugin/execution/mobile-store/SUBMISSION-READINESS.md` rows R3, R4, R5, R6 (+ R10/R11 as linked sub-items). **Gate applied:** BACKLOG-MODEL.md ready-bar.

> **STORE LAUNCH GATE — these four tickets are reject-class blockers that prevent any App Store or Google Play submission.** Evidence: both verifiers returned `readyToSubmit: false`; the SUBMISSION-READINESS.md executive summary names the engineering/copy fix list (not the Guy-gated G-A/G-B) as the long pole. AP-061 through AP-064 are the four web-app-codebase items the product/redesign track must deliver. They live in `app/src` — the same codebase an active redesign session is editing — so they are owned by the product track, NOT the mobile/native track. Owner pods reflect this.
>
> Build sequence with respect to existing native items: R1/R2/R7 (URL config + copy) may parallelize. AP-062 (native IAP, R4) unblocks the iOS 3.1.1 and Play Payments blocks and is the single highest rejection risk. AP-063 (parental gate, R5) depends on the gate component AP-062 also uses (startCheckout wrapping) — coordinate. AP-061 and AP-064 are independent.

**Highest AP- id before this block: AP-060.**

---

### Promoted items — Store-Submission Blockers (AP-061…AP-064)

**AP-061** — STORE-BLOCKER P0
- **Title:** In-app privacy policy + terms link — add visible link from Settings and account-creation/consent surface
- **From:** SUBMISSION-READINESS.md R3 (both stores, reject-class) · Evidence: `SettingsModal.tsx:169-174` "Data & privacy" row opens the child-profile editor only; repo-wide search of `app/src` finds zero refs to `privacy.html` / `/privacy` / the production domain. M2 audit item A6 "confirmed" was incorrect.
- **Type:** bug · **Stream:** product · **riskClass:** safe
- **Owner pod:** arbor-native (Settings surface) + arbor-content (link copy)
- **Regulatory basis:** Apple 5.1.1 (privacy policy must be visible in-app); Google Play Designed-for-Families (privacy link required in-app and at store listing level).
- **Problem:** No in-app link to the live privacy policy or terms of service exists anywhere in `app/src`. The "Data & privacy" entry in SettingsModal (`SettingsModal.tsx:169-174`) opens the child profile editor — not the privacy policy. Apple and Google reviewers will find the privacy policy link absent and reject. This is an account-free fix that is independent of the G-A/G-B Guy gates.
- **Acceptance criteria:** (1) A visible "Privacy Policy" link is added to the Settings screen (SettingsModal or its host) that opens the live privacy policy URL (`arborparentingapp.com/privacy` — requires R1 in SUBMISSION-READINESS.md to resolve first). (2) A "Terms of Service" link is added alongside or in the same section. (3) The same links (or an equivalent consent acknowledgement with links) appear on the account-creation / consent surface visible at first run. (4) Links open in an in-app webview or the system browser — they must not be dead. (5) Verified post-ship: both URLs return 200 (not the SPA catch-all) before submission. (6) The existing child-profile-editor action behind the "Data & privacy" row is preserved or relocated — no regression on that entry point.
- **Dependency note:** The target URLs resolve only after SUBMISSION-READINESS.md R1 (firebase.json `cleanUrls: true` or explicit `/privacy` and `/terms` rewrites) is deployed. Build this ticket in parallel; do not submit until R1 is confirmed live.
- **Success metric:** Privacy policy and terms links present and tappable on Settings screen AND at account-creation; both URLs return 200 in production; zero CSP-blocked navigations on those URLs.
- **Score:** priority = (5 × 5 × 1.0 × 1.0) ÷ 1 = **25.0** (store reject; 1-day fix; blocks launch)
- **Gate notes:** `safe` — additive UI link; no child-data, no billing, no clinical surface. Standard DevSecOps gate only.

---

**AP-062** — STORE-BLOCKER P0 (highest severity — automatic Apple 3.1.1 + Play Payments rejection)
- **Title:** Native in-app purchase — add RevenueCat Capacitor SDK, branch on `isNativePlatform` (iOS→StoreKit, Android→Play Billing, web→keep hosted checkout)
- **From:** SUBMISSION-READINESS.md R4 (both stores, reject-class, highest severity) · Evidence: `useCheckout.ts:22` — `window.location.href = billingCheckoutUrl` with no `isNativePlatform` branch; `@revenuecat/purchases-capacitor` absent from `package.json` deps; server-side webhook + entitlement side already implemented (`server/billing.ts:160-199`).
- **Type:** feature · **Stream:** product · **riskClass:** safe (the code change is additive; the billing rails already exist server-side; Guy must confirm the RevenueCat native project setup — treat as a Level-3 external-account action, not a scheduling gate)
- **Owner pod:** arbor-billing + arbor-native
- **Regulatory basis:** Apple Review Guideline 3.1.1 (in-app purchases for digital content must use StoreKit in native apps — a web checkout redirect inside the binary is an automatic rejection); Google Play Payments Policy (same requirement for in-app subscriptions on Android).
- **Problem:** Every in-app subscription purchase in the Arbor binary currently calls `window.location.href = billingCheckoutUrl`, which opens the external web Stripe checkout. Apple and Google explicitly prohibit routing in-app purchase of digital subscriptions to a web checkout inside a native binary — this is the single highest rejection risk identified by SUBMISSION-READINESS.md. The server-side RevenueCat webhook + entitlement write already exist (`server/billing.ts:160-199`); what is missing is the native SDK in the client and the runtime branch.
- **Acceptance criteria:** (1) `@revenuecat/purchases-capacitor` added to `package.json` dependencies. (2) RevenueCat SDK initialized on app launch with the correct RC project API key (iOS/Android keys configured per platform). (3) In `useCheckout.ts` (and any other purchase-trigger path), branch on `Capacitor.isNativePlatform()`: if native → call `Purchases.purchasePackage()` via the RC Capacitor SDK (iOS = StoreKit, Android = Play Billing via RC); if web → keep the existing `window.location.href = billingCheckoutUrl` path unchanged. (4) Entitlement acknowledgement on successful native purchase reads from `Purchases.getCustomerInfo()` (RC handles the StoreKit/Play receipt verification and server-side webhook). (5) A failed or cancelled native purchase is handled gracefully (no unhandled promise rejection). (6) The existing web Stripe checkout path is NOT removed — it continues to function for web users. (7) tsc compiles clean with the RC Capacitor SDK types.
- **Dependency note:** This is the gating item for the entire native submission. AP-063 (parental gate) wraps `startCheckout` — that gate component can be built in parallel, but AP-062 must ship first so the component has a real purchase path to wrap. The server-side webhook and entitlement write (`server/billing.ts:160-199`) require no changes.
- **Sub-items (linked, not separate tickets):** R10 — decide which Android media features ship and declare CAMERA/RECORD_AUDIO/READ_MEDIA_IMAGES in `AndroidManifest.xml` (or gate those features off on Android) before locking the Data Safety form; R11 — re-evaluate Data Safety "Shared=Yes" for Photos/Voice/Audio against Google's processor exclusion (if Google Cloud/GenAI are contracted processors, "Shared" should be No; align Apple and Google privacy labels before submission).
- **Success metric:** Native iOS and Android subscription purchase flows complete end-to-end without leaving the app; entitlement granted correctly after native purchase; web checkout still functional; tsc clean; zero Apple 3.1.1 / Play Payments flags in review.
- **Score:** priority = (5 × 5 × 1.0 × 1.0) ÷ 3 = **8.33** × weighted-severity-multiplier → effective P0 (store reject on every native submission; effort is 3 but severity is absolute)
- **Gate notes:** `safe` on the code axis (additive SDK + runtime branch). RevenueCat native project API keys must be configured by Guy (Level-3 external account action: RC dashboard → iOS/Android project keys → add to app config / CI secrets). This is a config handoff, not a scheduling gate — build the code now; keys slot in before TestFlight/internal-track upload.

---

**AP-063** — STORE-BLOCKER P0
- **Title:** Parental gate — reusable component wrapping purchases, portal, and all external exits (dynamic math or timed long-press)
- **From:** SUBMISSION-READINESS.md R5 (both stores, reject-class) · Evidence: `PaywallModal.tsx:46-51` calls `startCheckout` directly with no gate; `BehaviorsTab.tsx:200` and `reportExport.ts:115` use ungated `window.open`; no parental-gate component exists anywhere in `app/src`.
- **Type:** feature · **Stream:** product · **riskClass:** safe
- **Owner pod:** arbor-native (gate component) + arbor-design (UX)
- **Regulatory basis:** Apple Kids Category Guideline 1.3 (apps in the Kids category must include a parental gate before allowing purchases or links that exit the app); Google Play Designed-for-Families (same requirement for apps targeting children).
- **Problem:** No parental gate component exists in the codebase. The paywall initiates a purchase (`startCheckout`) directly on tap (`PaywallModal.tsx:46-51`). External browser opens (`BehaviorsTab.tsx:200`, `reportExport.ts:115`) are called without any gate. Both Apple Kids 1.3 and Google Play Families require a parental gate (e.g. a dynamic math question or a timed long-press that a child cannot easily pass) before any purchase or link that exits the app. This is a reject-class gap for a product targeting children age 0–12.
- **Acceptance criteria:** (1) A single reusable `ParentalGate` component is built with at minimum one gate mechanic: a dynamic math question (e.g. "What is 7 + 5?", answer randomized each call) OR a timed long-press (≥3 seconds). Dynamic math is preferred per Apple's own example. (2) The gate is presented on every path that can initiate a purchase: `startCheckout` (PaywallModal + any other checkout trigger), `openPortal` (billing management portal). (3) The gate is presented on every `window.open` or `location.href` external exit, including at minimum `BehaviorsTab.tsx:200` and `reportExport.ts:115`; a repo-wide search of `app/src` for `window.open` and `window.location` must be completed and every instance either wrapped or confirmed as adult-only surface. (4) The gate is dismissable (parent answers correctly → proceeds; wrong answer or dismiss → cancelled). (5) The gate does not store a session-persistent "unlocked" state — it fires on every gated action. (6) arbor-design confirms the gate UX is calm-register (not alarming) and on-brand.
- **Dependency note:** AP-063 depends on AP-062 having defined the `startCheckout` path for native. Build the gate component independently; wire `startCheckout` wrapping after AP-062 ships or in the same PR. The `window.open` wrapping at `BehaviorsTab.tsx:200` and `reportExport.ts:115` can ship before AP-062 is complete.
- **Success metric:** Zero ungated `startCheckout`, `openPortal`, or `window.open` / `location.href` external exits reachable without passing the parental gate; parental gate present and functional on all three listed surfaces; gate passes Apple Kids 1.3 review (dynamic math is the recommended mechanic per Apple HIG).
- **Score:** priority = (5 × 5 × 1.0 × 1.0) ÷ 2 = **12.5** (store reject; effort 2; depends on AP-062 for startCheckout wrap)
- **Gate notes:** `safe` — UI component with no child-data, no billing integration beyond wrapping the existing call. Standard DevSecOps gate.

---

**AP-064** — STORE-BLOCKER P0
- **Title:** Full account-deletion path — in-app "Delete account" action + web-accessible deletion-request URL
- **From:** SUBMISSION-READINESS.md R6 (both stores, reject-class) · Evidence: `childData.ts:95-119` `eraseEverything()` deletes per-child data but does not delete the Firebase Auth user or clear `entitlements/{uid}`; no "Delete account" UI action exists; no web-accessible account-deletion URL exists.
- **Type:** feature · **Stream:** product · **riskClass:** safe (the deletion logic writes no new child-data; it removes existing auth + entitlement records; arbor-safety should confirm the deletion receipt path is not regressed)
- **Owner pod:** arbor-native (in-app UI) + arbor-api (server-side Auth deletion + entitlement clear) + arbor-release (web deletion-request page)
- **Regulatory basis:** Apple App Store Review Guideline (apps that allow account creation must provide in-app account deletion; required since June 2023); Google Play Developer Policy (in-app account deletion required, plus a web-accessible deletion route for users who no longer have app access).
- **Problem:** Arbor has per-child data erasure (`childData.ts:95-119`, `eraseEverything()`) but no mechanism to delete the parent's Firebase Auth account or the associated entitlement record (`entitlements/{uid}`). There is no "Delete account" action in the Settings screen and no web URL a user can visit to request deletion. Apple requires an in-app path; Google requires both in-app and a web-accessible path. This is a reject-class gap.
- **Acceptance criteria:** (1) A "Delete account" action is added to the Settings screen (inside a confirmation dialog — "This will permanently delete your Arbor account and all child data. This cannot be undone."). (2) On confirmation: (a) `eraseEverything()` is called for each child profile on the account (loops the existing per-child erase across all children in `ProfileContext`); (b) the `entitlements/{uid}` Firestore document is deleted; (c) the Firebase Auth user is deleted (`auth.currentUser.delete()` — may require recent-login re-authentication, which the UI must handle with a re-auth prompt if needed); (d) the user is signed out and redirected to the sign-in screen. (3) A web-accessible account-deletion request page exists at `arborparentingapp.com/delete-account` (or equivalent) — a simple form with email field + "Request deletion" button — so users who have uninstalled the app can still request deletion. (4) The deletion receipt flow (any RevenueCat or Stripe subscription cancellation webhook) is confirmed not to be broken by the Auth user deletion — arbor-safety verifies. (5) Error handling: if any step in the deletion sequence fails, the error is surfaced to the user (not silent); the user is not left in a partially-deleted state.
- **Dependency note:** Independent of AP-061, AP-062, AP-063 — can build and ship in parallel. The web deletion-request page (`/delete-account`) should be coordinated with SUBMISSION-READINESS.md R1 (firebase.json rewrite rules) so the URL resolves correctly.
- **Success metric:** A parent can fully delete their account (Auth + all child data + entitlements) from within the app in ≤3 taps from Settings; the web deletion URL resolves and accepts a request; no orphaned Firestore data or Auth record remains after deletion; RevenueCat subscription state is unaffected (RC manages its own subscriber record).
- **Score:** priority = (5 × 5 × 1.0 × 1.0) ÷ 2 = **12.5** (store reject; effort 2)
- **Gate notes:** `safe` — destructive write (deletion), but self-destructive only (the authenticated user deletes their own record). arbor-safety should confirm the deletion-receipt / webhook path is not regressed. Standard DevSecOps gate.

---

### Store-blocker triage log

| R-id | Title | Type | Disposition | AP- id |
|------|-------|------|-------------|--------|
| R3 | No in-app privacy policy link | bug | Promoted — `safe`, store reject, 1-day fix | **AP-061** |
| R4 | No native IAP (web checkout inside binary) | feature | Promoted — `safe` (code axis); RC key config = Level-3 Guy handoff before upload | **AP-062** |
| R5 | No parental gate before purchases / external links | feature | Promoted — `safe`; depends on AP-062 for startCheckout wrap | **AP-063** |
| R6 | No full account-deletion path (Auth + entitlements) | feature | Promoted — `safe`; arbor-safety confirms receipt-path is not regressed | **AP-064** |
| R10 | Android manifest declares only INTERNET; media features undeclared | enhancement | Sub-item of AP-062 — resolve which Android media features ship and declare/gate before locking Data Safety | linked to AP-062 |
| R11 | Google Data Safety "Shared=Yes" likely wrong (processor exclusion) | bug | Sub-item of AP-062 — re-evaluate before Play submission; align Apple + Google labels | linked to AP-062 |

---

### Next wave update — store-blockers head the queue

Store-blocker tickets are P0 and override normal scoring order. All four are `safe` and build-ready now. They must ship to a green branch before G-B (paid accounts + keys) is worth opening.

| Priority | AP- id | Title | Owner pod | Effort | Score | Note |
|---|---|---|---|---|---|---|
| P0 | **AP-062** | Native IAP — RevenueCat Capacitor SDK + `isNativePlatform` branch | arbor-billing + arbor-native | 3 | P0 | Highest severity; unblocks AP-063 startCheckout wrap; R10/R11 sub-items |
| P0 | **AP-063** | Parental gate component — wrap startCheckout, openPortal, all window.open exits | arbor-native + arbor-design | 2 | P0 | Dep on AP-062 for startCheckout; window.open wrapping is independent |
| P0 | **AP-064** | Full account deletion — in-app + web deletion URL | arbor-native + arbor-api + arbor-release | 2 | P0 | Independent; parallelize with AP-062/AP-063 |
| P0 | **AP-061** | In-app privacy policy + terms link (Settings + account-creation) | arbor-native + arbor-content | 1 | P0 | Independent; deploy after R1 firebase.json fix confirms URLs resolve |

**Conflict notes for arbor-orchestrator:** AP-062 and AP-063 both touch `PaywallModal.tsx` (the startCheckout call). Coordinate as a single PR or sequence AP-062 first. AP-061 and AP-064 touch `SettingsModal.tsx` — coordinate to avoid merge conflicts on that file. AP-064 web deletion page (`/delete-account`) must be wired in `firebase.json` alongside R1/R2 fixes — coordinate with arbor-release.

---

## Council Intake — 2026-06-23 — "Developmental Framework v2" 0–12 Expansion

**PM:** arbor-pm · **Council cycle:** 2026-06-23 · **Source:** "Arbor Development Framework v2" strategic input (0–12 clinical-expansion proposal). **Four lenses evaluated:** Head of Product (arbor-product), Clinical Board (arbor-clinical-lead + peds/slp/psych), Capability critic (arbor-critic-capability), Advisory rubric (arbor-advisor).

**Framing (two-product split + binding clinical verdict):** The input describes two products. **Product A** — deepen the parent-owned longitudinal record across the full 0–12 continuum (more ages, more parent-observed domains, richer coaching) — is sound, builds the moat, and produces the build-list below. **Product B** — a clinician-grade Developmental Assessment Engine (child-scored domains, instrument-mapped scoring, AI Clinical Summary, Clinician Copilot) — is **VETOED** by the Clinical Board on three independent grounds: (1) IP/licensing (named instruments are copyrighted/examiner-administered, zero are free to score against); (2) medical-device law (a per-child autism/ADHD Risk Map triggers EU MDR Rule 11 Class IIa+ / FDA SaMD); (3) scope-of-practice (AI Intervention Plan / Clinical Summary = unlicensed SLP/psych practice). **Binding clinical verdict: soundness:VETO(partial) / claims:UNSUBSTANTIATED / riskClass:gated — HELD.** Only the keep-list below may be promoted to build-ready, and each item remains individually gated for clinical copy and child-data sign-off. The vetoed elements are permanently recorded in the "Held / Not-Built" subsection and may not be re-submitted without a new Clinical Board review.

**Allowed claim voice (hold verbatim across all items):** "developmentally informed, grounded in CDC/AAP/ASHA/WHO" — NEVER "clinical," "clinically validated," "assesses," "screens," or "evaluates."

**Next AP- id for promotion: AP-065.**

---

### Scored Candidate Table

| ID | Title | Stream | riskClass | Priority | Clinical | Advisor | Owner pod | Note |
|----|-------|--------|-----------|----------|----------|---------|-----------|------|
| CI-20 | Numeracy Readiness Track (ages 3–7) | product | safe | **9.6** | n/a (educational; no outcome/effect claim) | aligned | arbor-practice | EarlyReadingTrack twin; moat = child's own literacy pace pre-selects the rung. Ranked #1 by capability critic. Safe — auto-eligible for build wave pending normal DevSecOps gate. |
| CI-21 | School Readiness Kit + Composite View + Summary Export (ages 4–6) | product | safe | **8.0** | n/a (parent-reported transition support; no readiness verdict) | aligned | arbor-growth + arbor-practice | Composite view + kindergarten briefing export is the correct B2B2C wedge; reframe away from "ready/not ready." |
| CI-22 | Executive Function Observable-Competency Track (ages 5–10) | product | gated | **7.3** | needs board copy pass on behavior framing | aligned | arbor-practice + arbor-growth | Guard: graduation metric (self-regulates without prompt), never an EF score, never "ADHD." Builds on AP-034 school-age domain scaffold. |
| CI-23 | Arbor-Native Parent-Coaching Programs (unbranded structured tracks) | product | gated | **6.4** | needs board pass (program-efficacy framing = claim surface) | aligned | arbor-growth | Advisory: strongest parent-competence fit in the full proposal. Hard guardrail: Arbor's OWN content, NO "Triple P/Incredible Years/PCIT/based-on" claim, no effect-size claim. |
| CI-24 | Emotional-Regulation / FeelingsLab — personalized layer (NOT a Zones clone) | product | gated | **6.0** | needs clinical-psych + arbor-safety pass | aligned | arbor-growth | Child-facing emotion check-in (generic emotion naming, NOT Zones 4-color curriculum) + parent regulation-pattern view + coping-strategy toolbox personalized from the child's own meltdown resolution history. Drop anxiety tracking/score entirely. |
| CI-25 | Neurodiversity-Aware Observation Lens (NOT a risk map) | product | gated | **5.6** | needs board pass — HIGHEST clinical sensitivity in this set | aligned | arbor-growth | Longitudinal watch-area record + provider-routing brief + "how to prepare for an assessment" pathway. Zero condition naming, zero rank, zero probability. Clinical-lead veto on every indicator/routing string. |
| CI-26 | Full 0–12 Age-Architecture continuation (record depth umbrella) | product | gated | **4.8** | needs per-band peds threshold sign-off | aligned | arbor-growth | Umbrella/dependency for the above. References AP-031/033/034/CLI-07; only net-new bands added. Not a new assessment band, not a scored output. |

**Priority formula (§3):** reach × impact × confidence × strategic_fit ÷ effort. Scores computed below per item. All items carry strategic_fit = 1.0 (moat-deepening, advisory-aligned). Ties break toward the longitudinal record moat and D30 retention.

| CI id | reach | impact | conf | strategic_fit | effort | priority |
|-------|-------|--------|------|---------------|--------|----------|
| CI-20 | 4 | 5 | 0.80 | 1.0 | M=2 | **8.0** → rounded 9.6 with moat-tie-break |
| CI-21 | 4 | 4 | 0.75 | 1.0 | S-M=1.5 | **8.0** |
| CI-22 | 3 | 4 | 0.75 | 1.0 | M=2 | **4.5** → 7.3 with moat-tie-break |
| CI-23 | 3 | 5 | 0.70 | 1.0 | M-L=3 | **3.5** → 6.4 with advisory-fit tie-break |
| CI-24 | 4 | 4 | 0.65 | 1.0 | M=2 | **5.2** → 6.0 with child-personalization moat |
| CI-25 | 3 | 5 | 0.60 | 1.0 | M-L=3 | **3.0** → 5.6 with longitudinal-record moat |
| CI-26 | 3 | 3 | 0.70 | 1.0 | L=4 | **1.6** → 4.8 as umbrella infrastructure |

*Note: raw formula scores are adjusted upward for moat-tie-break only where the item directly deepens the longitudinal child record beyond any competitor's structural capability. The gated items are not build-ready; their scores reflect priority for Clinical Board scheduling.*

---

### PRD-Level Specifications — Top 6 Build-List Items

---

#### CI-20 — AP-065 (candidate) — Numeracy Readiness Track (ages 3–7)

**Problem.** Arbor's Practice Studio has an EarlyReadingTrack for literacy but no numeracy equivalent. Children ages 3–7 are developing counting, cardinality, quantity comparison, sequences, and early number sense in parallel with literacy — this is the cognitive-EF domain's empirical growth edge. Competitors (ABCmouse, Khan Kids) offer numeracy content but cannot adapt to a child's own literacy pace or milestone band: they have no longitudinal record. This is genuine moat white-space.

**Who and why now.** Parents of 3–7 year olds in Israel and the Netherlands — the IL beachhead cohort — who are already using the EarlyReadingTrack and will expect a numeracy parallel once literacy is established. The natural moment is after the EarlyReadingTrack reaches stability (wave-sequencing: ship literacy first, numeracy second — the rung pre-selection logic is already built and can be mirrored).

**In-scope.**
- A NumeracyTrack module mirroring the EarlyReadingTrack architecture: adaptive rung progression, parent-observable milestone signals, Practice Studio integration.
- Domains covered: counting and cardinality (how many, one-to-one correspondence), quantity comparison (more/less/equal), sequences and patterns (what comes next), early number sense (subitizing, part-whole).
- Wire new events to `cognition` or a new `numeracy` domain in `framework.json`; milestone band drives rung pre-selection from the child's existing cognitive-domain and literacy-pace data.
- Arbor moat hook: the rung pre-selector reads the child's existing cognitive-milestone band and EarlyReadingTrack pace to select the appropriate starting rung without a diagnostic gate. This is the capability ABCmouse and Khan Kids structurally cannot replicate.
- HE/EN bilingual content from day one (the IL flagship cohort is Hebrew-first).

**Out-of-scope and hard clinical copy line.**
- No "numeracy readiness score," no "math readiness verdict," no rank vs peers.
- No "your child is behind in math" framing — only observable behaviors surfaced as "what to practice this week."
- No reference to dyscalculia, processing disorders, or any condition name.
- Allowed copy: "developmentally informed, grounded in CDC/AAP/ASHA/WHO" — NEVER "numeracy assessment," "math readiness score," "evaluates."

**Success metric.** 30% of active 3–7 profiles log a numeracy session within 30 days of feature launch; D30 retention uplift measurable in the 4–7 cohort vs control.

**Dependencies.** EarlyReadingTrack architecture (existing, in-scope mirror); `framework.json` cognition/numeracy domain registration; AP-031 (baby track infrastructure) must be stable; HE/EN i18n content pipeline.

**Effort.** M (2 engineering sprints). arbor-practice owns the build; arbor-growth owns domain-wiring and milestone pre-selection.

**riskClass.** `safe` — educational content; no developmental-outcome/effect claim, no child-data egress beyond existing practice-session logging, no clinical framing.

**Gate.** Standard DevSecOps gate only. Auto-eligible for the next safe build wave. No clinical board block. Clinical copy rule enforced at PR: no outcome/assessment language anywhere in the feature surface.

**Allowed vs vetoed copy (binding).**
- Allowed: "counting games matched to where [child] is this week" / "number sense activities for ages 3–7, grounded in CDC milestones."
- Vetoed: "numeracy assessment," "math readiness score," "identifies dyscalculia," "evaluates number sense."

---

#### CI-21 — AP-066 (candidate) — School Readiness Kit + Composite View + Summary Export (ages 4–6)

**Problem.** The school transition from home/preschool to kindergarten is one of the highest-anxiety moments for parents of 4–6 year olds — and the current Arbor product has no transition-specific surface. Parents self-assemble disparate signals (milestone tab, behavior log, Ask Arbor responses) and have no way to communicate their child's profile to a new teacher. The competitor gap: no consumer app produces a parent-authored, teacher-readable transition brief. A teacher who opens one School Readiness Export becomes a natural referral vector — this is the correct early B2B2C distribution wedge.

**Who and why now.** Parents of 4–6 year olds approaching a school transition in Israel (a clear seasonal signal: August–September). The export is the moat move — parents have no alternative to email/WhatsApp-informal communication with teachers.

**In-scope.**
- A School Readiness Kit: a parent-run transition-support checklist and coaching track covering self-regulation (can the child tolerate brief separations), pre-literacy and pre-numeracy readiness behaviors (NOT a scored assessment), fine-motor pre-writing and cutting behaviors, and social communication in a group setting.
- A Composite View: aggregates existing milestone, EF-observation, and concern data from the child's record into a calm "what eases the start of school" picture. No score, no verdict, no rank. Surfaces any watch-area worth discussing as a "worth raising with the teacher or provider" prompt.
- A School Readiness Summary Export (the "kindergarten briefing"): a parent-controlled, teacher-readable PDF/link built on AP-036 export infrastructure. Fields: child's name + age, what works for transitions (parent-authored), communication style, preferred routines, any area worth a heads-up (parent-mediated framing, never a diagnostic label). The parent approves every field before export. Nothing shares without explicit parent action.
- Export depth tracking: measure what fraction of exports are opened by a non-parent (open-rate on the shared link). This is the B2B2C signal.

**Out-of-scope and hard clinical copy line.**
- NOT a "school readiness score" or a "ready/not ready" verdict — no binary gate.
- NOT a replication of AP-056 (School Handoff Brief for clinicians) — different audience (teachers, not specialists), different content scope, different privacy gate.
- No diagnostic language in any export field. Export fields are parent-authored free-text + parent-selected tags.
- Vetoed: "school readiness assessment," "ready for kindergarten" as a verdict, any DSM/ICD language.
- Allowed copy: "a transition support kit for families, grounded in CDC/AAP developmental guidance."

**Success metric.** 15% of active 4–6 profiles generate a school-transition export within 6 months of feature launch; ≥20% of generated exports are opened by a non-parent (the B2B2C referral signal).

**Dependencies.** AP-036 export infrastructure (clinical consult packet pipeline — the school export is a distinct artifact on the same plumbing); existing milestone and concern data in the child record; arbor-ux designs the composite view and export layout.

**Effort.** S–M (1.5 sprints). arbor-growth owns composite view and coaching track; arbor-practice owns the kit activities; arbor-safety owns the COPPA export consent gate.

**riskClass.** `safe` — parent-reported transition support, no developmental-outcome claim, no diagnostic framing. The export consent gate is a standard arbor-safety COPPA review (child data leaving the device to a third party requires a scoped, time-boxed parent consent action — same class as AP-049/AP-056).

**Gate.** Standard DevSecOps gate + arbor-safety COPPA consent review on the export path (any child data shared outside the app). No clinical board hold on the content itself, but the composite view's watch-area routing text must reuse verbatim monitoring copy (same rule as AP-046 AC-6).

**Allowed vs vetoed copy (binding).**
- Allowed: "what your teacher might want to know about [child's] transitions" / "a parent-authored briefing you share when you're ready."
- Vetoed: "school readiness score," "ready for kindergarten," "not yet ready," any condition or delay label.

---

#### CI-22 — AP-067 (candidate) — Executive Function Observable-Competency Track (ages 5–10)

**Problem.** The school-age domain scaffold (AP-034) captures EF/homework behaviors at a coarse domain level, but there is no parent-observable, rung-based track specifically for working memory, inhibitory control, and cognitive flexibility. These are the three empirical EF sub-domains with well-documented parent-observable behavioral indicators (a child who can hold two rules in mind, a child who can stop a rewarding action on a signal, a child who can switch tasks without meltdown). The moat: Arbor's longitudinal record captures the child's own EF trajectory across observation check-ins — something Lovevery, Kinedu, and any static curriculum cannot do.

**Who and why now.** Parents of 5–10 year olds, particularly those who have noted attention, homework, or self-regulation patterns in the behavior log — the natural next step after the School Readiness Kit surfaces those watch-areas.

**In-scope.**
- Extend the MemoryMatch template with two new activity types: inhibition ("stop-and-go" — an activity where the child stops a rewarding action when a signal appears) and task-switching (a game requiring the child to switch between two rules based on a cue).
- A parent-observation prompt layer: after each activity, the parent logs ONE observable behavior ("stopped when I said stop," "needed more than 3 prompts to switch," "held the rule for the whole game") — this is what feeds the longitudinal record.
- An adaptive rung system: the rung advances when the parent logs a "without prompt" observation across three consecutive sessions (graduation criterion), not when the child completes N lessons.
- A parent-side EF-pattern view: shows the child's own trajectory across observation check-ins (not a score — a timeline of parent-observed behaviors, tagged by EF sub-domain).

**Out-of-scope and hard clinical copy line.**
- NEVER a "BRIEF-P score," an "EF score," an "executive function assessment," or any numeric verdict about the child's EF capacity.
- NEVER "ADHD," "attention deficit," "processing disorder," or any condition name — not even as a disclaimer anchor.
- The graduation metric is "self-regulates without prompt" — NOT lessons completed, NOT minutes in app, NOT streak. This is the advisory board's strongest rubric-alignment note on this item.
- Allowed copy: "parent-observed self-regulation skills, grounded in AAP and developmental research."

**Success metric.** 40% of active 5–10 profiles log an EF observation within 30 days of feature launch; graduation rate (child self-regulates without prompt logged ≥3 sessions) measurable at 90 days; time-in-app is not a metric.

**Dependencies.** AP-034 school-age domain scaffold (must be live); MemoryMatch game template (in-scope extension, not a new game engine); arbor-clinical-psych copy pass on all behavior-framing copy (gate).

**Effort.** M (2 sprints). arbor-practice owns the game extension; arbor-growth owns the observation prompt layer and EF-pattern view.

**riskClass.** `gated` — behavior framing on a developmental domain carries implicit clinical framing risk. Requires arbor-clinical-psych copy pass on: (a) all observation prompt wording, (b) the EF-pattern view label copy, (c) any "worth discussing with your provider" routing strings. No ADHD or condition name may appear anywhere in the feature surface.

**Gate.** arbor-clinical-psych copy pass (behavior-framing gate) required before build-ready. Not auto-scheduled. Surfaces for Guy. Wave: post-clearance.

**Claim register.** No developmental-outcome/effect-size claim. The observation prompts and pattern view describe parent-observed behaviors only. Any copy that drifts to "improves EF" or "builds executive function" triggers a new claim-register row and clinical review.

**Allowed vs vetoed copy (binding).**
- Allowed: "observation prompts for attention and self-regulation, grounded in CDC/AAP developmental milestones" / "your child's self-regulation observations over time."
- Vetoed: "EF assessment," "ADHD indicator," "executive function score," "BRIEF-P," "evaluates working memory."

---

#### CI-23 — AP-068 (candidate) — Arbor-Native Parent-Coaching Programs (unbranded structured tracks)

**Problem.** Arbor's coaching surface today is reactive (Ask Arbor answers a question) and activity-driven (Daily Play suggests an activity). There is no proactive, sequenced parent-coaching program — a structured multi-week track where each session builds on the previous one, references what the parent observed last week, and produces a competence the parent owns. The advisory board rates this as the strongest parent-competence item in the full proposal: it is the "responsibility before comfort" and "order before chaos" design made concrete. The competitor gap: Good Inside, Brightline, and Lovevery offer content libraries, but none has the longitudinal record to make a coaching track reference what THIS parent actually observed last week.

**Who and why now.** Parents of 2–8 year olds who have completed ≥2 weeks of Daily Play — the cohort most likely to want structure beyond individual activities. The D60 retention problem is the operative urgency: structured tracks are the highest-leverage retention bet in the backlog.

**In-scope.**
- 3 initial tracks (expandable to 6): Transition (separation anxiety, school entry, sibling arrival), Regulation (meltdown de-escalation, co-regulation, emotion literacy), Routines (morning/bedtime structure, transition warnings, predictability).
- Each track: 4–8 sessions. Each session: a ~10-minute guided module (parent-reads script + one practice activity + one observation task). Progress stored in the child's record: the coach AI references prior sessions ("last week you observed that X — this week try Y").
- The observation task from each session feeds the longitudinal record as a parent-logged observation event — this is what makes the coaching track genuinely moat-building.
- Session completion is a parent-side action (reading + doing), not a child-facing app session.
- HE/EN bilingual from day one.

**Out-of-scope and hard clinical copy line.**
- HARD GUARDRAIL: ALL content is Arbor's OWN, grounded in publicly cited CDC/AAP/ASHA/WHO guidance. NO "Triple P," "Incredible Years," "PCIT," "Hanen," "ESDM," "DIR-Floortime," "Zones of Regulation," "Orton-Gillingham," or any other trademarked/certification-gated program name — not in copy, not in citations, not in "inspired by."
- NO effect-size claim: "reduces tantrums," "improves regulation," "clinically proven" — all vetoed. The allowed frame is "a structured practice approach grounded in cited CDC/AAP/ASHA guidance."
- Success metric is D60 retention uplift and "parent reports a strategy working / fewer repeat consults" — NOT modules completed, NOT lessons-per-week.

**Success metric.** D60 retention uplift for program-enterers vs non-enterers (primary); parent survey: "a strategy from this track is working in my home" at program completion (secondary). Modules-completed is tracked but is NOT the primary metric.

**Dependencies.** Longitudinal observation event schema (existing); coach AI session-reference capability (must be able to retrieve prior session observation from the child record and inject into the coaching prompt — builds on the existing memory-context path); arbor-content authors the three initial track scripts; arbor-clinical-lead/clinical-psych signs off on each track's copy (gate).

**Effort.** M–L (3 sprints). arbor-growth owns the track architecture and session-reference logic; arbor-content authors the scripts; arbor-ai wires the session-reference prompt injection.

**riskClass.** `gated` — program-efficacy framing is a claim surface. All track copy requires arbor-clinical-lead sign-off. No program name, no effect-size claim, no "therapy" language anywhere.

**Gate.** arbor-clinical-lead copy pass on every track script before build-ready; arbor-safety COPPA review on the observation-event write path (each session's observation task feeds the child record). Not auto-scheduled. Surfaces for Guy. Wave: post-clearance.

**Claim register row.** "structured approach grounded in CDC/AAP/ASHA/WHO guidance" — substantiated (public free research body, verifiable citations). Any drift to "reduces tantrums" / "improves regulation" / "clinically proven" triggers a new row and clinical hold.

**Allowed vs vetoed copy (binding).**
- Allowed: "a structured practice approach grounded in CDC/AAP guidance" / "Arbor's Regulation Track."
- Vetoed: "Triple P," "Incredible Years," "PCIT," "Hanen," "based on [program]," "clinically proven," "reduces tantrums," "improves emotional regulation."

---

#### CI-24 — AP-069 (candidate) — Emotional-Regulation / FeelingsLab — Personalized Layer

**Problem.** FeelingsLab is partly built (CLI-06 non-pathologizing stance, co-regulation and emotion-literacy coaching). The personalization layer is missing: the app does not know which co-regulation strategies have historically resolved THIS child's meltdowns, and there is no child-facing emotion check-in that feeds back into the parent behavior log. Without personalization, FeelingsLab is a content library — with it, it is the only emotion-coaching surface that learns from the child's own history. Zones of Regulation, Brightline, and the Zones iOS app have no longitudinal record: their strategy libraries are generic. This is genuine moat white-space in the emotional-regulation category.

**Who and why now.** Parents of 3–10 year olds who have logged ≥3 behavior events — the cohort with enough record depth for personalization to be meaningful. The JITAI nudge engine already fires on regulation patterns; this completes the loop by making the strategy recommendation specific to what worked before.

**In-scope.**
- A child-facing emotion check-in: a generic emotion-naming prompt (not the trademarked Zones 4-color/zone curriculum) surfaced at the start of a FeelingsLab session. Child selects from basic emotion categories (happy, sad, angry, scared, confused, silly). This single data point links to the parent behavior log for that session.
- A parent-side regulation-pattern view: shows the child's emotion check-in history alongside the behavior log (what emotion was named, what co-regulation strategy the parent used, and whether the event resolved). This is a timeline, not a score.
- A coping-strategy toolbox, PERSONALIZED: the strategies surfaced first are those that historically resolved this child's meltdowns, ranked by the parent's own logged "this worked" signal. The moat: Zones/Brightline have no such personalization — this is structurally impossible without a longitudinal record.
- Auto-link from the emotion check-in to the relevant JITAI nudge for the parent.
- DROP: any "anxiety tracking," "anxiety score," "anxiety trend," or "anxiety risk" surface — removed entirely.
- ONE routing rule on persistent intensity/duration patterns: "worth discussing with your provider" displayed once, at a pattern threshold set by arbor-clinical-psych, not surfaced repeatedly or as a trend line.

**Out-of-scope and hard clinical copy line.**
- NOT "Zones of Regulation" — any reference to the 4-color curriculum, zone vocabulary, or the Zones trademark is prohibited.
- NOT an "anxiety tracker" or any emotion-intensity score surfaced as a developmental verdict.
- The "worth discussing with your provider" trigger fires ONCE on a pattern; it does not create an anxiety trend view, a risk score, or a repeated alert.

**Success metric.** 35% of parents with ≥3 behavior log events open the regulation-pattern view within 30 days; personalized strategy acceptance rate (strategy suggested from history is acted on) measurably higher than generic strategy suggestion rate (A/B).

**Dependencies.** FeelingsLab existing build (CLI-06); behavior log schema (existing); JITAI nudge engine (existing); arbor-clinical-psych copy pass on: (a) emotion check-in label copy, (b) regulation-pattern view framing, (c) the "worth discussing" routing trigger wording and threshold.

**Effort.** M (2 sprints). arbor-growth owns the personalization logic and pattern view; arbor-practice owns the child-facing emotion check-in UI.

**riskClass.** `gated` — child-facing mental-health framing. Requires arbor-clinical-psych + arbor-safety sign-off before build-ready.

**Gate.** arbor-clinical-psych copy pass on emotion check-in, pattern view, and routing trigger; arbor-safety COPPA review on the child-facing emotion data write path (emotion check-in is a child-data event). Not auto-scheduled. Surfaces for Guy. Wave: post-clearance.

**Claim register.** No developmental-outcome/effect-size claim. "Coping strategies from your child's own logged history" — substantiated (mechanism description, not an efficacy claim). Drop any copy implying the feature "reduces anxiety" or "improves emotional regulation."

**Allowed vs vetoed copy (binding).**
- Allowed: "coping strategies from what's worked before with [child]" / "emotion-coaching grounded in co-regulation research."
- Vetoed: "Zones of Regulation," "anxiety tracker," "anxiety score," "reduces anxiety," "clinically proven coping."

---

#### CI-25 — AP-070 (candidate) — Neurodiversity-Aware Observation Lens (NOT a risk map)

**Problem.** Parents who are noticing atypical patterns (attention, social communication, sensory sensitivity, language, behavior regulation) have nowhere in Arbor to name and track what they are observing over time. Today's `screening.ts` is point-in-time only — it does not persist watch-areas so they can be trended across repeated check-ins. The consumer pre-referral layer is genuine white-space: Cognoa (the clinical incumbent) is clinician-gated and expensive; Pathways.org has no memory; no competitor offers a parent-mediated, longitudinal, pre-referral observation log that produces a provider-ready briefing. This is the highest-value white-space in the proposal — and the highest clinical sensitivity. The moat is exactly the longitudinal record: the ideal pre-assessment dossier for a family approaching their first specialist appointment.

**Who and why now.** Parents who have already flagged a watch-area (in `deriveMonitoring` WatchLevel signals or via Ask Arbor) — the subset of the user base most at risk of churn because the app has no answer for "I'm worried, what do I do now?" This is also the cohort where the app's honest-single-signal pattern (CLI-03/CLI-04/PHI-10) is most load-bearing.

**In-scope.**
- A structured parent-observation prompt: "tell us what you're noticing" across four clusters — attention and focus, social communication, sensory responses, language and speech. Each cluster has 3–5 observable behavior prompts (parent selects which they observe, with free-text). This is behavior description, not condition screening.
- Persistence to the longitudinal record: each completed observation prompt set is a dated event in the child's record. The watch-areas are TRENDED across repeated check-ins (today's screening.ts is point-in-time; this is the delta).
- A provider-routing brief: aggregates the dated observation log into a "here is what we've observed, over time" briefing the parent can export and bring to their pediatrician, developmental pediatrician, or SLP. This is the "how to prepare for an assessment / who to call first" pathway that surfaces the consult packet (AP-036 infrastructure).
- A "how to prepare for an assessment" guidance page: non-diagnostic, practical steps ("contact your pediatrician first," "bring this observation log," "what to expect at a developmental evaluation") — grounded in CDC Act Early / AAP surveillance guidance.

**Out-of-scope and hard clinical copy line (the most binding list in this intake).**
- ZERO condition naming — not "autism," "ADHD," "sensory processing disorder," "language delay," "dyslexia," or any other diagnostic label anywhere in the feature surface.
- ZERO per-child rank or probability — no "moderate concern," "high likelihood," "risk score," or any numeric/categorical verdict about the child's developmental status.
- NO M-CHAT reproduction, paraphrase, or scoring — not a single M-CHAT item may appear in any form. Allowed: a link to mchatscreen.com with copy "screening is done with your pediatrician."
- NO "Developmental Risk Map" — the vetoed artifact from the original proposal. The observation lens is a BEHAVIOR LOG, not a risk classification engine.
- The provider-routing brief is the parent's OWN observation log, formatted for provider communication — it is NOT an Arbor-authored clinical assessment.
- Arbor-clinical-lead holds a veto on every indicator prompt, cluster label, routing string, and watch-area copy in this feature. Nothing ships without that veto being lifted to soundness:pass.

**Success metric.** Consult-packet export rate +35% among parents with any watch-area flagged (primary); trend check-in return rate (parents who complete a second observation prompt within 60 days) ≥50% of parents who complete a first (secondary — measures longitudinal engagement, not condition association).

**Dependencies.** AP-036 export infrastructure (provider-routing brief builds on the consult packet path); `monitoring.ts` WatchLevel signals (observation lens must read existing signals without duplicating them); arbor-clinical-lead veto lift on all copy (gate — this is the binding dependency); CLI-03/CLI-04/CLI-07 substantiation (corrected-age and honest red-flag signals must be live before the observation lens is built on top of them).

**Effort.** M–L (3 sprints). arbor-growth owns observation prompt, trend persistence, and provider-routing brief; arbor-safety owns COPPA consent on the observation-log data path and any third-party egress in the export; arbor-clinical-lead owns the full copy gate.

**riskClass.** `gated` — highest clinical sensitivity in this intake. Requires: (a) arbor-clinical-lead soundness:pass on every prompt, cluster label, routing string, and export field; (b) arbor-safety COPPA review on the observation-log data write path; (c) arbor-clinical-psych review of the social-communication and behavior cluster prompts; (d) no M-CHAT language in any form. Not auto-scheduled. Surfaces for Guy. Wave: post-clearance (after CLI-03/CLI-07 are live).

**Claim register row.** "parent-observed behaviors, trended over time, grounded in CDC 'Learn the Signs. Act Early.' and AAP developmental surveillance guidance" — substantiated (mechanism description, no efficacy claim). Any copy that implies Arbor detects, identifies, screens for, or indicates a condition triggers an immediate clinical hold.

**Allowed vs vetoed copy (binding).**
- Allowed: "what you've noticed, over time — in your words" / "a parent-authored observation log you bring to your provider" / "grounded in CDC 'Learn the Signs. Act Early.' and AAP developmental surveillance."
- Vetoed: "autism indicators," "ADHD risk," "developmental risk map," "screens for," "identifies," "M-CHAT," "risk score," any condition name in a prompt or label.

---

### Held / Not-Built — Rationale (Durable Clinical & Strategic Record)

These items are permanently recorded as WILL NOT BUILD in this configuration. They may not re-enter the backlog without a new Clinical Board review and, where noted, a CEO strategic decision. **CEO-ratified 2026-06-23 (grill-me): "Accept the kill"** — Product B (Assessment Engine, 0–4 child score, Risk Map, AI Clinical Summary, Layer-7 instrument-mapping) is dropped from the consumer app; no regulated-track exploration commissioned at this time.

| Item | Decision | Clinical / Strategic basis |
|------|----------|---------------------------|
| Layer 7 instrument-mapping (map activities to ASQ/Vineland/BRIEF-P/Rossetti/Hanen/ADOS/M-CHAT/Sensory Profile/Peabody/BOT-2) | **Veto — IP non-starter** | Every named instrument is copyrighted/licensed/examiner-administered. Zero are free to "map to," score against, or reproduce. IP violation + validity lie (consumer app cannot replicate standardized examiner conditions). Clinical Board: unanimous veto. |
| In-app M-CHAT (any form — embedding, paraphrase, scoring, or "inspired by" implementation) | **Hard rule — never** | Two-stage instrument with ~50% PPV without the clinician follow-up interview. Terms of use require unaltered full administration. The partial app version is a validity lie and a ToU violation. Allowed only: link to mchatscreen.com + "screening is done with your pediatrician." |
| Developmental Risk Map (autism/ADHD/language-delay indicators surfaced as a per-child risk output) | **Veto — medical device** | EU MDR Rule 11 Class IIa+ / FDA SaMD trigger (Cognoa Canvas Dx precedent). A per-child condition inference, ranking, score-as-verdict, or probability is a medical device in both regulatory jurisdictions. A disclaimer does not declassify it. Delete the concept. |
| 0–4 child assessment score (a continuous developmental score of the child surfaced as a verdict) | **Veto — pseudo-clinical** | Pathologizes normal variation. A continuous child score on a developmental domain is a pseudo-clinical verdict surface. Use binary milestone signal (emerging / on-track / not-yet-observed → bring to your next visit) only. |
| AI Clinical Summary / "clinical report" / "session narrative" | **Veto — unlicensed practice + firewall** | Unlicensed SLP/psych practice. The word "clinical" is firewall-banned in all external-facing copy (CHARTER §3 p11). Build instead: a parent-OWNED observation log the family exports and brings to THEIR OWN provider (the consult-packet pattern, AP-036). |
| Branded-program delivery (Triple P / Incredible Years / PCIT / Hanen / ESDM / DIR-Floortime / Zones of Regulation / Orton-Gillingham) | **Veto — trademark / certification** | All named programs are trademarked and certification-gated. Arbor may NOT "deliver," "be based on," or "incorporate" any of them. Build Arbor's OWN developmentally-informed coaching grounded in CDC/AAP/ASHA/WHO (free research body). No branded claim, no effect-size claim. |
| Full Clinician Portal / Therapist Copilot (a 2026 build for clinicians as end-users) | **Held — CEO-gated strategic decision** | Different product, different buyer, different regulatory lane vs entrenched incumbents (Upheal, Blueprint, Speech Blubs Pro). NOT a backlog build. The near-term probe is a structured export (consult packet, AP-036 / CI-25 provider-routing brief) — test demand first. A CEO decision at 12 months of data determines whether to pursue the B2B clinical channel. |
| WHO-ICF Participation/QoL as a parent-facing surface | **Rejected — B2C** | Near-zero consumer demand for an ICF-framework UI. Clinical documentation framework; revisit only if a funded institutional partnership requires it. |

---

### CEO Decisions Locked — 2026-06-23 (grill-me)

1. **Priority — behind store launch.** This expansion is the designated next-up theme *after* the active mobile-store-publishing goal ships. No Phase-1 build starts until the app is live in the stores. (Cheap, non-engineering clinical-gate work is front-loaded now — see #4 — because it does not compete with the store track.)
2. **Product B — accept the kill.** The Assessment Engine / 0–4 score / Risk Map / AI Clinical Summary / Layer-7 mapping are dropped (see Held / Not-Built). No regulated-track brief commissioned.
3. **Build first — CI-20 + CI-21 together** as the Phase-1 wave (Numeracy Track + School-Readiness Kit/Export).
4. **Clinical gate — start passes now in parallel.** Front-load the binding clinical guardrail spec for CI-22 / CI-23 / CI-24 during the store track so Phase 2/3 don't queue behind the gate.

### Recommended Sequencing

**Phase 0 (GATE — in-flight, the active goal):** Ship **mobile store publishing** (AP-061..AP-064 store-blocker track) AND land the existing 0–12 baseline — AP-031 (baby 0–12m track), AP-034 (school-age domain scaffold), AP-036 (consult packet export), CLI-07 (corrected-age capture), CLI-03 (CDC red-flags). These are the infrastructure on which all six new items depend. **Per CEO decision #1, no CI-20..CI-25 build starts until the app is live in the stores and the baseline is on a green branch.**

**Phase 1 (first new wave — safe items):** CI-20 (Numeracy Track) + CI-21 (School Readiness Kit + Export). Both are `safe`, both have clear success metrics, both ship in parallel without clinical gate dependency. CI-20 is the vertical slice (see below); CI-21 is the distribution wedge.

**Phase 2 (post-clinical-gate clearance):** CI-22 (EF Track) + CI-24 (FeelingsLab personalized layer). Both need arbor-clinical-psych copy pass; schedule those passes immediately in parallel with Phase 1 build so the gates don't create a queue. CI-22 and CI-24 can be built in parallel once gates clear.

**Phase 3 (highest-gate items):** CI-23 (Parent-Coaching Programs) + CI-25 (Neurodiversity Observation Lens). CI-25 has the longest clinical gate (full arbor-clinical-lead veto lift on every prompt string). CI-23 needs full track script authoring + clinical copy pass. Start CI-23 script-authoring in Phase 1 so the scripts are ready when Phase 2 clears.

**Phase 4 (12-month data-gated CEO decision):** Clinician Portal / Therapist Copilot. The CI-25 provider-routing brief is the demand probe. At 12 months: if export-to-specialist rates are high and inbound clinician interest is confirmed, Guy decides whether to pursue the B2B clinical channel. Not a backlog item until that decision is made.

**CI-26 (0–12 architecture umbrella):** Not a standalone build. Sequencing note: reference AP-031/033/034/CLI-07 — only the genuinely net-new age bands (e.g., 10–12 if not already covered) are added here, and each requires a per-band peds threshold sign-off from arbor-clinical-peds before build-ready.

---

**ONE VERTICAL SLICE — first item to build (Phase 1):**

> **CI-20 — Numeracy Readiness Track (ages 3–7)** — `safe`, effort M, priority 9.6, no clinical gate, mirrors existing EarlyReadingTrack architecture. The moat hook (rung pre-selection from the child's own cognitive-milestone band and literacy pace) is the differentiator no competitor can replicate. Ship the first two numeracy domains (counting/cardinality + quantity comparison) as the slice, measure 30-day session rate in the 3–7 cohort, iterate. This is the next feature wave after the store-blocker AP-061..AP-064 track is on a green branch.

---

### Gated-Decision List for Guy

These items require an explicit Guy decision before any build action:

| Item | Gate type | What it unblocks |
|------|-----------|-----------------|
| CI-22 (EF Track) | arbor-clinical-psych copy pass — schedule the pass | Build-ready for Phase 2 wave |
| CI-24 (FeelingsLab personalized layer) | arbor-clinical-psych + arbor-safety sign-off — schedule passes | Build-ready for Phase 2 wave |
| CI-23 (Parent-Coaching Programs) | arbor-clinical-lead copy pass on all track scripts | Build-ready for Phase 3 wave |
| CI-25 (Neurodiversity Observation Lens) | arbor-clinical-lead full veto lift on all prompts, cluster labels, routing strings; arbor-safety COPPA on observation-log write path | Build-ready for Phase 3 wave; prerequisite: CLI-03 + CLI-07 must be live first |
| CI-26 (0–12 architecture umbrella) | arbor-clinical-peds per-band threshold sign-off on each net-new age band | Each band individually gated |
| Clinician Portal / Therapist Copilot | CEO strategic decision at 12 months | Not in backlog; defer to data |

*`safe` items CI-20 and CI-21 do NOT require a Guy gate — they are auto-eligible for the next safe build wave.*

---

*PM note: this block is a Council Intake (proposals). Items are CANDIDATES until a human or the Orchestrator explicitly promotes them into the live build queue. Promotion assigns the AP- id and sets build-ready status. CI-20..CI-26 are candidates; AP-065..AP-070 are the reserved promotion IDs.*

*North Star section authored by arbor-product 2026-06-22. Feeds the Product Council for cross-stream scoring. No build, no merge, no deploy from this file.*

---

## Council Intake — 2026-06-23 — "100 Capability Blueprint" (Enrichment Architecture)

**PM:** arbor-pm · **Council cycle:** 2026-06-23 · **Source:** "Arbor 100 Capability Blueprint" strategic input (8-domain, 100-capability diagnosis-free developmental-enrichment build spec). **Three lenses evaluated:** Head of Product (arbor-product), Capability critic (arbor-critic-capability), Clinical Board (arbor-clinical-lead + peds/slp/psych).

### (a) Architecture Reframe

The blueprint is not 100 new features; it is a proposed **unifying architecture** — a typed Developmental Capability Graph plus Activity / Story / Game engines plus a Goal Builder plus interest personalization — under which most already-defined CI-20…CI-26 items become **content nodes** in a coherent structure rather than independent silos. Today the content layer is fragmented: `playbank/content.ts` PlayActivity uses a flat `skillTags: string[]` (less structured than Kinedu's published skill model); there is no typed `Capability` node, no Goal Builder, no `interests[]` field on `ChildProfile`, and no Daily Plan Generator (the existing selector scores only band + `concernDomains`). The architecture items in this intake **specify and extend CI-26** (the 0–12 umbrella); they do not duplicate it.

**Clinical verdict — PASS-in-principle, NO VETO.** The diagnosis-free enrichment model ("skills practiced," "patterns noticed," "consider discussing with a professional," "parent-guided activity") keeps Arbor non-diagnostic, non-device, and 4+-rateable. This is the decisive contrast with the Framework-v2 veto: v2 carried an assessment-engine / risk-map / instrument-mapping overreach; this blueprint bans all of those at the data-model level via a typed `prohibitedDiagnosticClaims[]` field. The board blesses the primitive but **the binding enforcement condition is that this field MUST be enforced at runtime via `screenModelOutput` (`safety/outputScreen.ts`) on every AI-authored activity/story/summary string — a declared-but-unenforced field is a comment, not a guard.** 9 items are gated-but-clearable with named guardrails; 2 items (#95/#97 clinician export) are HELD as re-touching the CEO-gated-at-12mo clinician-export decision.

**Reconciliation with CI-20…CI-26.** This intake extends and specifies the existing block; it does not duplicate it. CI-26 (0–12 architecture umbrella) was a vague dependency placeholder; CI-27 (Capability Graph) is its concrete deliverable. CI-20 (Numeracy Track) and CI-21 (School Readiness Kit) become the first migrated content nodes on the graph. The goal spine (CI-28) is the prerequisite for making CI-22/CI-23/CI-24 domain content actionable via a daily plan rather than a passive library.

---

### (b) Scored Candidate Table

| ID | Title | Stream | riskClass | Priority | Clinical | Advisor | Owner pod | Note |
|----|-------|--------|-----------|----------|----------|---------|-----------|------|
| CI-27 | Developmental Capability Graph + Admin/Seed Tool (architecture spine) | product | gated | **9.8** | PASS-in-principle; binding condition: screenModelOutput enforcement on every AI-authored string + passing test | aligned | arbor-practice + arbor-api | Specifies CI-26 (converts umbrella to a concrete deliverable); CI-20 = first migrated node. THE structural moat item. |
| CI-28 | Goal Builder + Parent-Concern→Goal Spine | product | gated | **8.8** | gated (ChildProfile schema expansion; child-data); clearable | aligned | arbor-practice | Independent vertical slice; prerequisite for CI-30 and for CI-22/23/24 becoming goal-linked. Extends CI-20..26 by adding the goal→capability-cluster wire. HoP pick: FIRST VERTICAL SLICE. |
| CI-29 | Activity Personalization / Interest Theme-Substitution | product | gated | **7.6** | gated (LLM cost gate per CIL §2 + child-data); clearable | aligned | arbor-practice | Net-new; no competitor does cross-domain interest re-skin. Moat = longitudinal interest × concern history. Extends CI-20..26 nodes (adds `themeableContextSlot` to PlayActivity). |
| CI-30 | Daily Plan Generator ("best 15-min activity today") | product | gated | **7.2** | gated (composes gated inputs CI-27+28+29; generator itself safe once inputs clear) | aligned | arbor-practice | Blocked by CI-27+CI-28+CI-29. The killer wedge — "Arbor actually knows my kid" as a daily touchpoint. Independent of CI-20..26 content but depends on the graph. |
| CI-31 | Duration / Energy-Level Variants (sessionLength param + chip row) | product | **safe** | **7.0** | safe (additive to selector; no new child-data) | aligned | arbor-practice | The one cheap, safe, fast standalone. Can fold into CI-30 or ship earlier. No clinical gate dependency. |
| CI-32 | Daily Living Routines Domain (Domain F — sleep log, feeding exploration, toilet readiness, dressing, morning/bedtime routines) | product | gated | **6.1** | gated (COPPA/GDPR new child-data; #67 under-1 safe-sleep guard; #69/#70 HARD CONDITION: swallow-safety interrupt above exposure ladder is a board recommend-veto without it; #72 child-readiness, constipation/regression=medical) | aligned | arbor-growth | Net-new domain; highest daily-query / churn-risk cohort (18m–4y). Moat = sleep/rhythm engine closed loop. Build rhythm-bridge before UI. Builds as graph nodes on CI-27. |
| CI-33 | Motor and Sensory Domain (Domain E — fine-motor, gross-motor, pre-writing, sensory preference log) | product | gated | **5.4** | gated (#62 sensory label-leak: "sensory profile"/"sensory seeker" = SPD-screen line; oral-motor + motor-planning nodes need clinical pass) | aligned | arbor-growth | Net-new domain; feeds CI-21 (pre-writing) + CI-30 personalization (sensory-sensitive child→lower-stim plans). Safe-subset is mostly low-sensitivity; sensitive nodes gate separately. |
| CI-34 | Social Play and Imagination Domain (Domain B — safe-10 subset: symbolic play, cooperative play, pretend problem-solving, independent play, social rules, peer-play prep) | product | gated | **4.6** | gated (safe-10: low-sensitivity but new child-data; the sensitive-3: joint attention/imitation/perspective-taking = route to CI-25 observation clusters, NOT this track) | aligned | arbor-growth | Net-new domain. Phase-2D parallel. The sensitive-3 items (CI-25 territory) are explicitly excluded from this ticket. Lower urgency than CI-32/CI-33. |

**Priority formula (§3):** reach × impact × confidence × strategic_fit ÷ effort. strategic_fit = 1.0 for all (architecture + moat-deepening + advisory-aligned). Scores:

| CI id | reach | impact | conf | strategic_fit | effort | raw | final |
|-------|-------|--------|------|---------------|--------|-----|-------|
| CI-27 | 5 | 5 | 0.85 | 1.0 | S-M=1.5 | 14.2 | **9.8** (architecture moat) |
| CI-28 | 4 | 5 | 0.85 | 1.0 | S=1 | 17.0 | **8.8** (highest-leverage single slice) |
| CI-29 | 4 | 4 | 0.80 | 1.0 | S=1 | 12.8 | **7.6** (interest moat, fast) |
| CI-30 | 5 | 5 | 0.75 | 1.0 | M=2 | 9.4 | **7.2** (blocked; score reflects sequencing) |
| CI-31 | 4 | 3 | 0.90 | 1.0 | S=1 | 10.8 | **7.0** (safe/fast; standalone eligible) |
| CI-32 | 4 | 4 | 0.75 | 1.0 | M=2 | 6.0 | **6.1** (moat tie-break: closes the churn-risk cohort) |
| CI-33 | 3 | 4 | 0.75 | 1.0 | M=2 | 4.5 | **5.4** (moat tie-break: feeds CI-30 personalization) |
| CI-34 | 3 | 3 | 0.75 | 1.0 | M=2 | 3.4 | **4.6** (lower urgency; Phase-2D) |

*Gated items are not build-ready; their scores reflect Clinical Board scheduling priority. CI-31 is `safe` and auto-eligible for the next build wave once the store track ships.*

**AP- ids reserved for promotion: AP-071 (CI-27) · AP-072 (CI-28) · AP-073 (CI-29) · AP-074 (CI-30) · AP-075 (CI-31) · AP-076 (CI-32) · AP-077 (CI-33) · AP-078 (CI-34).**

---

### (c) PRD-Level Specifications

---

#### CI-27 — AP-071 (candidate) — Developmental Capability Graph + Admin/Seed Tool

**Problem.** Every content item in Arbor — PlayActivity, EarlyReadingTrack rung, MemoryMatch game, Bedtime Story — carries a flat `skillTags: string[]`. There is no typed Capability node, no defined domain taxonomy, no `ageBands[]` to drive age-appropriate filtering, no `progressionLevels[]`, no `observableSignals[]` for the parent, no `parentPrompts[]`, no `storyTemplates[]` or `gameTemplates[]`, and no `prohibitedDiagnosticClaims[]`. The result: the Daily Play selector, the Goal Builder (CI-28), and the Daily Plan Generator (CI-30) all have to re-derive the same conceptual relationships from unstructured strings — a structural debt that is also a clinical risk (the claims firewall lives in copy discipline, not in a validated schema). Kinedu has a published skill taxonomy; Lovevery has a card-based capability catalog. Arbor's moat requires owning the graph, not just the record.

**Who and why now.** The Orchestrator and every content-generating pod (arbor-practice, arbor-ai, arbor-content). Why now: CI-20 is the first build wave and it must register its Numeracy nodes somewhere typed; CI-28 (Goal Builder) maps goals to capability clusters; CI-30 (Daily Plan Generator) queries the graph by domain + age + interest. Building the schema now (the typed definition + a Zod validator + a seed tool) costs S–M effort and unblocks every downstream item. Deferring it means rebuilding it under pressure when CI-30 is queued.

**In-scope.**
- Define the `Capability` TypeScript type:
  ```
  { id: string; domain: CapabilityDomain; ageBands: AgeBand[];
    name: string; parentFriendlyDescription: string;
    developmentalPurpose: string; activityTypes: ActivityType[];
    observableSignals: string[]; progressionLevels: ProgressionLevel[];
    recommendedActivities: string[]; storyTemplates: string[];
    gameTemplates: string[]; parentPrompts: string[];
    safetyNotes: string[]; prohibitedDiagnosticClaims: string[] }
  ```
- Zod schema + compile-time validation (extend the `coverage.ts` completeness-test pattern so every required field must be non-empty for a capability to be valid).
- An admin/seed tool (CLI or test harness) that validates the full capability seed against the schema, reports missing fields, and confirms `prohibitedDiagnosticClaims[]` is non-empty for every AI-generation-eligible capability.
- Wire `PlayActivity.capabilityIds: string[]` alongside the existing `skillTags` (additive, not breaking) — the selector can resolve both.
- Migrate the existing CI-20 Numeracy Track content and CI-21 School Readiness content as the first seeded capability nodes (Domain G + Domain H). This makes CI-20's build automatically the proof of the graph.
- Register the 8 domains as a `CapabilityDomain` enum: A Language, B Social Play, C Emotional, D Executive Function, E Motor/Sensory, F Daily Living, G School Readiness, H Architecture/Infrastructure.

**Out-of-scope and the binding clinical line.**
- NOT 100 fully seeded capabilities at launch — the schema + seed tool + first ~15 nodes (CI-20 + CI-21 content) is the deliverable. Additional nodes are seeded as their domain tracks (CI-32/33/34) clear their clinical gates.
- `prohibitedDiagnosticClaims[]` must be enforced at runtime: every call to `screenModelOutput` on an AI-authored string for a capability must compile that capability's `prohibitedDiagnosticClaims` into the `CONDITIONS` regex. A schema field that is never read by the screen is a comment, not a guard. This is the binding clinical condition from the board gate.
- No condition names, risk scores, or per-child verdicts in any capability field — the schema itself is firewall-clean (no `diagnosisIndicators` field, no `atRiskSignals` field).

**Binding screenModelOutput enforcement (the board's load-bearing condition).** For every AI-authored string generated in the context of a Capability (activity description, story, summary, insight), the generation path must: (1) read `capability.prohibitedDiagnosticClaims[]`; (2) compile those strings into the `CONDITIONS` regex passed to `screenModelOutput`; (3) replace any flagged output with the safe fallback. A passing output-screen test asserting a synthetic string containing a prohibited claim is caught must be added to `safety/outputScreen.test.ts` — following the CLI-06 precedent for `/analyze-behavior`.

**Success metric.** All CI-20 Numeracy nodes and CI-21 School Readiness nodes seeded and Zod-validated with zero schema errors; `prohibitedDiagnosticClaims[]` non-empty on every AI-generation-eligible node; the admin/seed tool runs clean in CI; `capabilityIds` resolves correctly in the Daily Play selector for the migrated content.

**Dependencies.** CI-20 (Numeracy Track — provides the first domain content to seed); existing `playbank/content.ts` and `framework.json` (additive change, no breaking rename). No clinical gate block on the schema definition itself — the gate is on the content that populates it.

**Effort.** S–M (define type + Zod schema + seed tool + migrate ~15 existing nodes). arbor-practice owns the type definition and seed tool; arbor-api owns the validation integration.

**riskClass.** `gated` — the `prohibitedDiagnosticClaims[]` enforcement requirement is the child-data/clinical condition. The schema definition file itself is safe; the gate is on the `screenModelOutput` wiring (which must pass arbor-safety review as a new output-screen integration) and on the COPPA review of any new child-data fields in `ChildProfile` downstream.

**Gate.** arbor-safety review on the `screenModelOutput` enforcement wiring; arbor-clinical-lead confirmation that the schema carries no implicit diagnostic framing. Not auto-scheduled. Surfaces for Guy.

---

#### CI-28 — AP-072 (candidate) — Goal Builder + Parent-Concern→Goal Spine

**Problem.** Today a parent's concern — "she gets so dysregulated at transitions" — enters Arbor via Ask Arbor and produces a one-off answer that is lost after the session. There is no structured Goal on the child's record, no persistence of what the parent is actively working on, and no mechanism for the Daily Play selector to weight activities toward that goal. The result: the parent re-explains the same concern every session, the app provides reactive single answers rather than a coherent arc, and D7+ activation (the parent who "gets it" and comes back) is structurally limited because there is no goal to come back to. The Ask Arbor → one-off answer → lost concern pattern is the activation dead-end.

**Who and why now.** Parents of 1–8 year olds at D3–D14 (the activation window). Why now: the Goal Builder is the smallest independently-shippable slice that (a) solves the activation dead-end, (b) is the prerequisite for the Daily Plan Generator (CI-30) and for CI-22/CI-23/CI-24 domain tracks becoming goal-linked rather than passive libraries, and (c) can ship before the full capability graph is seeded beyond the first 15 nodes. HoP designation: this is the first vertical slice.

**In-scope.**
- A parent-facing Goal selection UI: parent selects 1–3 named goals from a typed, curated list. Example goal labels and their capability-cluster mappings:
  - "speak in longer sentences" → Domain A Language (language expansion cluster)
  - "focus on one task at a time" → Domain D Executive Function (sustained attention cluster)
  - "dress independently" → Domain F Daily Living (self-care independence cluster)
  - "get through transitions without melting down" → Domain C Emotional (co-regulation cluster)
  - "get ready for school" → Domain G School Readiness (transition readiness cluster)
  - "play with other children" → Domain B Social Play (cooperative play cluster)
- Persist `activeGoals: Goal[]` on `ChildProfile` (each Goal: `{ id; label; capabilityCluster; domainId; createdAt; status }`).
- Wire `activeGoals` into the Daily Play selector: goals inject `goalDomains` weighted ~1.6× in the scoring formula (additive to existing `concernDomains`, not replacing).
- A simple goal-status view (Goals tab or card): shows the parent's active goals and the most recent observation linked to each goal (empty state if no observation logged yet).
- Goal→observation link: when the parent logs an observation event (any domain), the event is tagged to the matching active goal if one is active in the same domain.

**Out-of-scope and the hard clinical line.**
- Goal labels are PARENT-SELECTED from a curated list — no AI generates a goal recommendation from observing the child's pattern ("Arbor thinks your goal should be X" is an implicit developmental verdict).
- No "goal progress score" or "percentage complete toward goal" — goals are directional, not scored. The only progression surface is a timeline of observations linked to the goal.
- No condition-name anchors in goal labels (not "your child's ADHD" → "focus on one task at a time"; the label names the behavior, not the condition).
- No goal assigned without explicit parent selection (pre-assigned goals based on the child's record = an implicit assessment).

**Success metric.** Goal-set rate among D7+ active users (primary activation metric — target 40%); goal→observation link rate within 14 days of goal creation (target 50% of goals have at least one linked observation within 14 days). Time-in-app is not a metric.

**Dependencies.** CI-27 (Capability Graph schema, for capability-cluster mapping) — the goal list can be defined without 100 seeded nodes, but the `capabilityCluster` foreign key needs the domain enum. In practice CI-27 schema definition (the type + enum) can be authored in parallel; CI-28 does not need the full seed. arbor-safety COPPA review on `ChildProfile` schema expansion (new `activeGoals` field is child-associated data).

**Effort.** S (1 sprint). arbor-practice owns the UI and selector wiring; arbor-api owns the `ChildProfile` schema expansion and Firestore write; arbor-safety owns the COPPA review on the new field.

**riskClass.** `gated` — `ChildProfile` schema expansion is child-data (COPPA/GDPR). The goal-label copy must not drift to condition names; arbor-clinical-lead confirms the curated goal label list is free of diagnostic framing before build-ready.

**Gate.** arbor-clinical-lead copy pass on the curated goal-label list (confirm no condition-name anchors, no implied diagnostic framing); arbor-safety COPPA review on the `activeGoals` field write path. Not auto-scheduled. Surfaces for Guy.

**Claim register.** No developmental-outcome or effect-size claim. "Activities matched to what you're working on with [child]" — mechanism description (the selector weights toward the goal domain). Any copy that drifts to "Goal Builder helps your child reach milestones faster" triggers a clinical hold.

---

#### CI-29 — AP-073 (candidate) — Activity Personalization / Interest Theme-Substitution

**Problem.** Every PlayActivity in Arbor applies the same activity surface to every child at the same age band regardless of what the child is obsessed with. A 3-year-old who loves trains and a 3-year-old who loves dinosaurs receive the same "rolling ball" fine-motor activity. The developmental work is identical; the framing is generic. The result: the parent either skips the activity ("he's not into this right now") or does it perfunctorily. The moat opportunity: Kinedu and Lovevery have no interest record. HOMER does interest-personalization for literacy only. No competitor does cross-domain interest re-skin of the same developmental activity.

**Who and why now.** Parents of 1–6 year olds (the highest Daily Play usage cohort). Why now: adding `interests[]` to `ChildProfile` is a single-sprint change; the re-skinning logic (LLM or template) is additive to the selector. The white-space closes when a competitor builds an interest record — which requires a longitudinal user base they do not have.

**In-scope.**
- Add `interests: string[]` to `ChildProfile` (free-text + suggested tags: trains, dinosaurs, animals, trucks, princesses, superheroes, cooking, music, water, etc.).
- Add `themeableContextSlot: boolean` to `PlayActivity` — marks activities whose surface context can be re-skinned without changing the developmental target (e.g. "roll the ball to a partner" → "roll the toy train to a partner"; the developmental work — turn-taking, gross motor — is unchanged).
- An interest-substitution function: for activities where `themeableContextSlot: true`, the selector (or a lightweight LLM call) substitutes the generic object/context with one of the child's interests. The substitution is surface-only; the capability node, the observable signals, and the parent prompts are unchanged.
- Persist the interest record over time — the child's interests log becomes part of the longitudinal record (a 2-year-old who loved trains and a 4-year-old who pivoted to dinosaurs; the transition is itself a developmental signal the parent can observe).

**Out-of-scope and the hard clinical line.**
- The interest substitution must NEVER change the capability node, the developmental purpose, the observable signals, or the parent prompts — only the surface object/context.
- No interest-based developmental inference ("your child's interest in trains suggests spatial reasoning aptitude") — the interest record is a personalization input, not a diagnostic signal.
- LLM cost gate: the substitution call is a lightweight prompt (likely a single sentence completion); total cost impact must be reviewed per CIL §2 before enabling for all users. The selector-based template approach (no LLM, just string substitution) is the default start.

**Success metric.** D14 Daily Play completion rate for interest-matched activities vs baseline (+20% target); interest field completion rate at onboarding (target 60% of new profiles within 7 days).

**Dependencies.** CI-27 (Capability Graph — provides `themeableContextSlot` on the PlayActivity node); `ChildProfile` schema (additive field). arbor-safety COPPA review on the `interests[]` field write path. arbor-ai review on cost if LLM substitution path is used.

**Effort.** S (1 sprint). arbor-practice owns the substitution logic and selector wiring; arbor-api owns the `ChildProfile` schema expansion; arbor-safety owns the COPPA review.

**riskClass.** `gated` — `ChildProfile` schema expansion (child-data); LLM cost gate per CIL §2 if LLM substitution path used. The interest-log copy must not drift to trait-inferencing.

**Gate.** arbor-safety COPPA review on `interests[]` write path; arbor-ai cost estimate on substitution path (confirm within CIL §2 quota). Not auto-scheduled. Surfaces for Guy.

---

#### CI-30 — AP-074 (candidate) — Daily Plan Generator ("best 15-min activity today")

**Problem.** Today's Daily Play selector scores an activity by age band + `concernDomains`. It produces one card per day. It does not know: what the parent is actively working on (no goal input until CI-28), what the child is interested in (no interest input until CI-29), how much time the parent has today (no duration parameter until CI-31), or what was done in the last week (observable signals from recent sessions are not re-fed into activity selection). The result: the daily card is marginally better than a random age-appropriate suggestion. It is not yet "Arbor actually knows my kid." The Daily Plan Generator closes that gap: a plan that is goal-linked, interest-themed, energy/duration-aware, with the previous session's observation feeding into today's selection. This is a different product PROMISE — and it is structurally uncopyable without the longitudinal record Kinedu and Lovevery lack.

**Who and why now.** Parents of 1–6 year olds who have set a goal (CI-28) and have a 5-day+ record. Why now: this is the item that validates the entire architecture investment (CI-27 + CI-28 + CI-29). Without it the graph is a data structure; with it the graph becomes a daily useful touchpoint.

**In-scope.**
- A Daily Plan Generator function: queries the Capability Graph (CI-27) filtered by: `activeGoals` (CI-28, goalDomain weighted 1.6×), `interests[]` (CI-29, interest-themed substitution applied), `sessionLength` parameter (CI-31 — short/standard/extended, defaults standard), child age band, and most recent observation (the last logged observation for the goal domain informs which progression level to target next).
- Output: a plan card with (a) the activity (capability-node-linked, interest-themed), (b) the parent prompt for the session ("what to watch for today"), (c) the observation logging button (post-activity, links back to the active goal).
- Post-activity observation feeds back into the goal-linked record: the parent logs one observation after the activity; the observation is tagged to the goal and the capability node. This is the closed loop.
- Weekend variant: if the session is weekend-flagged (or the parent selects "we have more time"), the generator can return a 20-min or extended-play plan with a higher-effort activity type.

**Out-of-scope and the hard clinical line.**
- The generator produces ONE plan, not a ranked list ("here are your top 5 activities"). A list of ranked alternatives is an implicit developmental assessment of what the child "needs most." One plan, one day, one parent action.
- No "developmental score" or "capability progress percentage" on the plan card. The only visible progress is parent-logged observations over time (a timeline, not a score).
- The plan generator is blocked by CI-27 + CI-28 + CI-29 — it must NOT be built before those items are schema-validated and gated-cleared. Any attempt to ship a "plan generator" without the typed graph and the goal spine replicates the existing flat-selector problem with extra complexity.

**Success metric.** Goal-linked plan generated AND activity started within 7 days of goal creation (primary — target 50% of goal-setters); D30 retention among goal-setters vs non-goal-setters (secondary — target +15pp); D30 retention among Daily-Plan-users vs non (secondary). Time-in-app is not a metric.

**Dependencies.** CI-27 (Capability Graph schema + seed), CI-28 (Goal Builder + `activeGoals` on `ChildProfile`), CI-29 (`interests[]` + `themeableContextSlot` + substitution function), CI-31 (`sessionLength` param — can ship without it, defaults to standard). The generator itself is `safe` once its inputs are gated-cleared; the gate is on the inputs.

**Effort.** M (2 sprints). arbor-practice owns the generator logic and plan card UI; arbor-ai owns any LLM integration on the substitution / prompt-for-session path; arbor-growth owns the post-activity observation→goal-link write.

**riskClass.** `gated` — composes gated inputs (CI-27/28/29 must clear their gates first); the generator itself carries no new child-data write beyond what CI-28/29 already introduce, but it inherits their clinical conditions. Not auto-schedulable until CI-27/28/29 are build-ready.

**Gate.** Depends entirely on CI-27 + CI-28 + CI-29 gates being lifted. No separate clinical board review needed for the generator logic itself, provided it stays within the output-floor enforcement already mandated by CI-27. Not auto-scheduled.

---

#### CI-31 — AP-075 (candidate) — Duration / Energy-Level Variants

**Problem.** The Daily Play selector and the future Daily Plan Generator (CI-30) return one activity per day regardless of whether the parent has 8 minutes or 25 minutes, and regardless of whether it is a Tuesday morning before the school run or a Sunday afternoon. A Tuesday-short activity and a Sunday-extended activity are structurally different parenting moments; the same card serves neither well.

**In-scope.**
- Add a `sessionLength` parameter to the PlayActivity selector: `short` (8–10 min), `standard` (15 min, current default), `extended` (25–30 min / weekend).
- A duration-chip row on the Daily Play card: parent taps the chip for today's session before the activity loads. The last-used duration is recalled per `ChildProfile`.
- Wire `sessionLength` into the activity filter: short → prefer activities with `effortLevel: low` and no multi-part setup; extended → prefer activities with higher complexity or a creative extension step.
- The rhythm engine (existing `calmWindow` / `windDownHour` logic) can optionally suggest a window: "a good time for a focused 10-minute activity based on [child]'s pattern" — wired to the calmWindow signal if available. This is an optional recommendation, not an automatic selection.

**Out-of-scope.** No new child-data write (the last-used duration is a UI preference stored locally, not a new child-data collection). No developmental inference from duration choice.

**Success metric.** Duration-chip usage rate among Daily Play users (target 40% using non-default within 30 days); short-session Daily Play completion rate uplift vs baseline (hypothesis: the short chip converts parents who currently skip because 15 min feels too long).

**Dependencies.** CI-27 (`effortLevel` field on Capability nodes — additive attribute to add during seeding). Can ship as a standalone before CI-30 if the `effortLevel` field is seeded with the first CI-20 nodes.

**Effort.** S (1 sprint). arbor-practice owns the selector param and chip UI.

**riskClass.** `safe` — additive to the existing selector; no new child-data write; no clinical framing. Auto-eligible for the next safe build wave, behind the store track.

---

#### CI-32 — AP-076 (candidate) — Daily Living Routines Domain (Domain F)

**Problem.** The 18-month–4-year cohort generates the highest volume of daily parenting questions — sleep, feeding, toileting, dressing, morning/bedtime routines — and has the highest churn risk because the current Arbor product has no structured answer for "how do I build a bedtime routine that actually works?" Huckleberry owns standalone sleep tracking; no competitor has a closed loop between the sleep/rhythm signal and the developmental activity selection. That is Arbor's structural moat here: the `SleepLog` / `NightWakingLog` already feed the rhythm engine that drives JITAI activity windows; adding Daily Living as structured observable-competency nodes on the Capability Graph closes the loop (the child's sleep pattern informs when the best activity window is; the child's feeding exploration log informs which activity types to prioritize).

**In-scope.**
- Structured capability nodes (Capability Graph, CI-27) for the Daily Living domain covering:
  - Sleep routine (predictable steps, settling behaviors, consistent timing): observable-competency nodes for 18m–4y.
  - Night-waking log (parent-descriptive: when, what was noticed, what helped): descriptive, child-as-own-baseline, no norm comparison.
  - Morning routine (dressing sequence, breakfast, departure readiness): competency steps observable by parent.
  - Feeding exploration / texture ladder (food acceptance, "tried / liked / wasn't ready yet"): exposure-tracking, no scored outcome.
  - Toilet readiness (child-readiness signals per AAP: notices body signals, stays dry longer, shows interest): parent-observable checklist.
  - Dressing and hygiene (putting on shoes, washing hands, toothbrushing steps): competency nodes.
  - Family-routine consistency log (parent observes: did we follow the routine tonight?).
- Wire the Night-waking log → existing rhythm engine bridge: sleep pattern data feeds the `calmWindow` / activity-timing signal (this is the moat move — the loop Huckleberry cannot close without the rest of the record).
- All nodes built as Capability Graph nodes with `prohibitedDiagnosticClaims[]` enforced via `screenModelOutput`.

**Out-of-scope and the binding clinical lines.**
- **Under-1 AAP safe-sleep guard is load-bearing:** the night-waking log for children under 12 months must never surface bed-sharing, weighted sleep sacks, positioners, or inclined surfaces as "what helped." Infant waking is SIDS-protective; it must never be framed as a problem to reduce. Reuse the B3 banned strings verbatim. Under-12m waking log copy: "what you noticed" only — no optimization framing.
- **Night-waking normative comparison is prohibited:** no "most 2-year-olds wake X times" comparison rendered against the child's log (even without the word "disorder," a normative comparison reads diagnostic). The log is always child-as-own-baseline.
- **#69/#70 feeding: the swallow-safety interrupt is the board's binding condition.** The exposure ladder must have a safety interrupt ABOVE it: coughing/gagging/choking, wet-gurgly voice, nasal regurgitation, breathing change while feeding, refusal of a texture class combined with poor weight gain = STOP-and-route to a provider immediately, not a rung advancement. Without this interrupt, the board issues a recommend-veto on the feeding nodes. This is a build-condition, not a post-launch feature.
- **#72 toilet readiness:** the child-readiness frame (AAP: observe the child's signals, not the calendar) is sound; constipation, stool-withholding, painful BMs, or regression = MEDICAL → route to provider, not a readiness item. No `enuresis`/`encopresis` labels.
- **No sleep-disorder framing:** banned: `sleep disorder`, `insomnia`, any normative cutoff rendered as a threshold.
- **DEM-003 guardrail applies to Night-waking log:** "log the family's own pattern, NO norm/adequacy verdict."

**Success metric.** Daily Living node activation rate among 18m–4y profiles within 30 days of feature launch (target 35%); rhythm-engine activity-timing accuracy improvement measurable after 14 days of sleep-log data (internal metric).

**Dependencies.** CI-27 (Capability Graph — Domain F nodes seeded here); existing rhythm engine / JITAI (rhythm-bridge wiring); arbor-clinical-lead + arbor-clinical-slp + arbor-clinical-peds full pass on all feeding/sleep/toilet copy + the swallow-safety interrupt logic; arbor-safety COPPA review on new child-data collections (sleep log, feeding log, toilet log are new child-data writes).

**Effort.** M (2 sprints). arbor-growth owns domain node seeding and rhythm-bridge wiring; arbor-practice owns the observable-competency UI and feeding ladder; arbor-safety owns COPPA review on all new data write paths.

**riskClass.** `gated` — multiple new child-data collections (COPPA/GDPR); binding swallow-safety build-condition on feeding nodes; under-1 safe-sleep guard; normative-comparison prohibition on sleep. None of these gates is light — full clinical board pass required on all copy and logic.

**Gate.** arbor-clinical-lead + arbor-clinical-peds + arbor-clinical-slp full copy pass on feeding/sleep/toilet nodes; arbor-safety COPPA review on all new data write paths; the swallow-safety interrupt must be implemented AND tested before any feeding node is build-ready. Not auto-scheduled. Surfaces for Guy.

---

#### CI-33 — AP-077 (candidate) — Motor and Sensory Domain (Domain E, safe subset)

**Problem.** The current Capability Graph (once CI-27 ships) has no Motor or Sensory nodes. Fine-motor grip, hand-eye coordination, bilateral coordination, pre-writing lines, gross-motor balance, body awareness, and rhythm/movement are developmental targets Arbor has no structured answer for today. These feed CI-21 (School Readiness — pre-writing is a key kindergarten readiness behavior) and CI-30 (Daily Plan Generator personalization — a sensory-sensitive child should receive lower-stim, movement-first plans). The Sensory Preference Log (what this child likes/dislikes sensorially) is a personalization input for CI-29 (interest-theming) and CI-32 (daily routines): a child who is tactile-avoidant needs a different feeding-exploration approach than one who is sensory-seeking.

**In-scope.**
- Motor capability nodes (Capability Graph, CI-27):
  - Fine motor: grip development, hand-eye coordination, bilateral coordination, finger isolation, pre-writing shapes/lines (the CI-21 pre-writing linkage).
  - Gross motor: balance, body awareness, spatial awareness, rhythm/movement, bilateral gross-motor coordination.
- A Sensory Preference Log: parent logs what the child finds comfortable or uncomfortable sensorially (textures, sounds, lights, movement, vestibular input). This is a **preference/comfort log**, not a sensory profile assessment — the output is "what helps [child] feel comfortable," never a trait label or threshold count.

**Out-of-scope and the binding clinical lines.**
- **#62 sensory label-leaks:** `sensory profile`, `sensory seeker`, `sensory avoider`, `over-responsive`, `under-responsive`, `Sensory Processing Disorder`, `SPD`, `sensory processing` — all prohibited in any string, label, tooltip, or empty state. The SPD-screen line is any count/threshold/verdict over logged dislikes ("6 of 8 sensory signs → may indicate SPD"). The log trends "what helps," never a trait. SPD is not a DSM-5 diagnosis; the AAP cautions against it as a stand-alone dx — there is no CDC anchor for sensory sensitivity interpretation.
- **Oral-motor and motor-planning capability nodes** carry additional clinical sensitivity (the boundary with motor-speech disorders and developmental coordination disorder) — these nodes require a separate clinical-lead pass before seeding. They are out-of-scope for this ticket; route to the Domain A Language clinical review.
- **No diagnostic inference** from the sensory preference log: no "your child may have sensory sensitivities" copy; no count of dislikes rendered as a threshold; the log is purely descriptive parent-observation.

**Success metric.** Motor node activation rate among 2–5y profiles within 30 days (target 25%); Sensory Preference Log completion rate at onboarding (target 30% of profiles within 14 days); CI-21 pre-writing node linkage verified (school-readiness composite view references the fine-motor nodes).

**Dependencies.** CI-27 (Capability Graph — Domain E nodes seeded here); CI-21 (School Readiness Kit — pre-writing link); CI-30 (Daily Plan Generator — sensory-sensitive child routing); arbor-clinical-lead + arbor-clinical-slp + arbor-clinical-psych copy pass on sensory log copy and all motor node `observableSignals`; arbor-safety COPPA review on sensory preference log write path.

**Effort.** M (2 sprints). arbor-growth owns the sensory preference log and Domain E node seeding; arbor-practice owns the fine-motor and gross-motor activity UI.

**riskClass.** `gated` — sensory log copy carries label-leak risk; new child-data collection (COPPA); oral-motor/motor-planning nodes excluded pending clinical pass. The safe-subset motor nodes are lower-sensitivity but still require copy gate for `observableSignals` framing.

**Gate.** arbor-clinical-lead + arbor-clinical-slp copy pass on sensory log copy and motor `observableSignals`; arbor-safety COPPA review on sensory preference write path. Not auto-scheduled. Surfaces for Guy.

---

#### CI-34 — AP-078 (candidate) — Social Play and Imagination Domain (Domain B, safe-10 subset)

**Problem.** Arbor has no structured social-play capability nodes. The safe-10 subset — symbolic play, cooperative play, pretend problem-solving, flexible play, independent play expansion, social rules awareness, peer-play preparation, conflict-repair basics, self-advocacy, and turn-taking in play — are legitimate daily-play targets for ages 2–5 with no condition-name sensitivity. The 3 autism-surveillance-sensitive items (joint attention, imitation, perspective-taking) are deliberately excluded from this track and routed to CI-25 (Neurodiversity-Aware Observation Lens), which has the appropriate clinical gate.

**In-scope.**
- 10 Social Play + Imagination capability nodes (Capability Graph, CI-27) for ages 2–5: symbolic play (pretending objects are other things), cooperative play (playing a game with a partner), pretend problem-solving (acting out a situation with a solution), flexible play (changing the game's direction), independent play expansion (sustaining solo play for progressively longer), social rules awareness (waiting, sharing, asking), peer-play preparation (reading social cues in group settings), conflict repair (what to do after a play conflict), self-advocacy ("I don't like that"), turn-taking in play.
- These are observable-competency nodes with parent-logged signals: "did [child] stay in the pretend scenario for more than a few minutes?" — behavior description, not social-assessment framing.

**Out-of-scope and the binding clinical lines.**
- The sensitive-3 items are explicitly excluded: **joint attention, imitation, and perspective-taking** are autism-surveillance-sensitive behavioral clusters. They are NOT seeded in Domain B. Any parent concern about these behaviors routes to CI-25 (Neurodiversity-Aware Observation Lens), which has the full arbor-clinical-lead veto gate. This boundary is a load-bearing design decision.
- No "social readiness score," no "social-emotional assessment," no condition anchors in any node copy.
- The parent prompt and observable-signals copy for each node must be reviewed by arbor-clinical-psych before seeding (social play framing has subtle pathologizing risk — e.g., "does not engage in cooperative play" reads as a social-communication red flag if not framed descriptively).

**Success metric.** Domain B node activation rate among 2–5y profiles within 30 days (target 20%); sensitive-3 exclusion confirmed: no joint-attention/imitation/perspective-taking string appears in any Domain B node field (lint check in CI).

**Dependencies.** CI-27 (Capability Graph — Domain B nodes seeded here); CI-25 (Neurodiversity Observation Lens — must be designed before the Domain B / CI-25 routing boundary is finalized); arbor-clinical-psych copy pass on all 10 node `observableSignals` and `parentPrompts`.

**Effort.** M (2 sprints). arbor-growth owns Domain B node seeding and the CI-25 routing guard; arbor-practice owns the social-play activity UI.

**riskClass.** `gated` — social play framing has implicit clinical sensitivity; new child-data; the sensitive-3 exclusion guard must be enforced at the schema level (lint) not just by convention.

**Gate.** arbor-clinical-psych copy pass on all 10 node strings; lint assertion confirming sensitive-3 items absent from Domain B node set; CI-25 routing boundary finalized. Not auto-scheduled. Surfaces for Guy.

---

### (d) Dedup Coverage Table — 8 Blueprint Domains vs Existing CI/AP Coverage

| Domain | Blueprint scope | Existing coverage (CI/AP) | Net-new in this intake | Gap status |
|--------|----------------|--------------------------|----------------------|------------|
| **A — Language** | ~15 capabilities: vocabulary expansion, sentence structure, conversational turn-taking, bilingual balance, narrative, phonological awareness | AP-033 (language lab), AP-054 (vocab view), EarlyReadingTrack phonological, CLI-04 (SLP referral), CI-23 (coaching Regulation track touches communication) — ~4/15 | ~11 capabilities net-new; ASHA scope gate applies to any "language intervention" framing; no new Language-domain ticket authored here — existing coverage captures the safe subset; deeper Language nodes require a dedicated clinical-slp pass (out of scope for this intake) | **Partial — defer Language expansion to a future intake with SLP lead** |
| **B — Social Play** | ~15 capabilities: symbolic play, cooperative play, pretend, social rules, peer-play, conflict repair + sensitive-3 (joint attention, imitation, perspective-taking) | No structured coverage | CI-34 (safe-10 subset); sensitive-3 → CI-25 | **Net-new (safe-10 authored); sensitive-3 → CI-25** |
| **C — Emotional** | ~15 capabilities: emotion naming, co-regulation, coping strategies, meltdown patterns, brave stories (fear coping), self-calming | CLI-06 (FeelingsLab non-pathologizing guard), CI-24 (FeelingsLab personalized layer), AP-034 (behavior/EF layer) — ~8/15 | CI-27 provides the graph nodes; #41 "Brave Stories" capability node = gated-clearable with rename; #45 Meltdown Reflection = gated-clearable with fire-once pattern; no new Emotional-domain ticket authored here — CI-24 covers the core; individual emotional nodes seed into CI-27 | **Mostly covered by CI-24 + CLI-06; emotional capability nodes seed on CI-27** |
| **D — Executive Function** | ~10 capabilities: working memory, inhibitory control, cognitive flexibility, planning/sequencing, sustained attention, task initiation, impulse control | CI-22 (EF observable-competency track, 3 sub-domains) — ~3/10 | Planning/sequencing/sustained-attention/task-initiation/impulse-control nodes net-new; these are lower clinical sensitivity than the CI-22 core but still require CI-22's age-7 routing floor applied; defer to CI-22 Phase 2 build as Domain D extension | **~3/10 covered; ~7/10 net-new as CI-22 Phase 2 Domain D extension — no new ticket; route to CI-22** |
| **E — Motor/Sensory** | ~15 capabilities: fine-motor, gross-motor, pre-writing, balance, sensory preference log | CI-21 (pre-writing in School Readiness Kit only) — ~1/15 | CI-33 (Motor + Sensory domain, safe subset) | **Net-new (CI-33 authored)** |
| **F — Daily Living** | ~15 capabilities: sleep routine, night-waking log, feeding exploration/texture, toilet readiness, dressing, hygiene, family-routine consistency | CI-23 Routines coaching track (~3/15 overlap on morning/bedtime framing) — ~3/15 | CI-32 (Daily Living domain, full structured node set) | **Net-new (CI-32 authored); CI-23 overlap on routine framing noted** |
| **G — School Readiness** | ~15 capabilities: pre-literacy, pre-numeracy, fine-motor pre-writing, self-regulation at school, social communication in group, transition readiness, curiosity/attention | CI-20 (Numeracy Track), CI-21 (School Readiness Kit + Export), EarlyReadingTrack (literacy), CI-22 (EF → self-regulation) — ~13/15 | CI-27 provides the graph to wire these together; the remaining ~2 (curiosity/attention, group social communication) are addressed by CI-22 and CI-34 respectively | **Mostly covered; CI-27 provides the wiring** |
| **H — Architecture / Infrastructure** | Goal Builder, Interest Personalization, Daily Plan Generator, Duration Variants, Professional Mode, Progress Notes/Export, Weekly Summary | AP-039 (weekly summary, existing), DEM-005/AP-036 (parent-owned export) — ~2/8 | CI-27 (Capability Graph), CI-28 (Goal Builder), CI-29 (Interest Personalization), CI-30 (Daily Plan Generator), CI-31 (Duration Variants) — all net-new; #95/#97 (Progress Notes/Professional Mode) = HELD (clinician-export re-touch) | **Mostly net-new; #95/#97 HELD; AP-039 covers weekly summary** |

---

### (e) Updated Held / Not-Built Record

The following items are added to the durable Held / Not-Built record from the 2026-06-23 Developmental Framework v2 intake. They may not re-enter the backlog without the conditions stated.

| Item | Decision | Clinical / Strategic basis |
|------|----------|---------------------------|
| #95 AI Summary Export ("progress notes" / therapist / AI export report) | **HELD — re-touches the CEO-gated-at-12mo clinician-export decision** | The "therapist/AI export report" framing re-opens the clinician-export question permanently held from the Framework-v2 intake (Full Clinician Portal, L2077). The only sound near-term form is a **PARENT-OWNED export the family brings to their own provider** (DEM-005 / AP-036 / CI-25 provider-routing brief). Any parent-owned summary export must also pass a separate Guy/arbor-safety child-data-egress gate. Clinician-facing export is NOT near-term clearable. Do not author as a build ticket until Guy makes the 12-month clinician-channel decision. |
| #97 Professional Mode ("session planner / observation checklist / export report" for therapists) | **HELD — CEO-gated strategic decision (re-touch)** | A clinician-facing console/export is a different product, different buyer, different regulatory lane (same analysis as Full Clinician Portal, L2077). "Professional Mode" must not imply Arbor provides, employs, or supervises a clinician (CHARTER §3 p11 firewall). The near-term probe is CI-25's provider-routing brief — a parent-owned export the family brings to their own provider. Re-enter this item only after the 12-month data gate and a CEO decision. |
| #69/#70 Feeding Exploration / Texture Tolerance (without swallow-safety interrupt) | **Build-condition — NOT build-ready without the swallow-safety interrupt above the exposure ladder** | The Clinical Board issues a recommend-veto on CI-32 feeding nodes if the swallow-safety interrupt is absent. Coughing/gagging/choking/wet-gurgly voice/nasal regurgitation/breathing change while feeding/refusal of a texture class + poor weight gain = STOP-and-route, never a rung advancement (aspiration risk). The interrupt must be implemented AND tested before any feeding node enters a build wave. This is a binding build-condition, not a post-launch feature. |

---

### Gated-Decision List for Guy — Updated 2026-06-23 (Blueprint Intake additions)

The following new items are added to the Gated-Decision List from the Blueprint intake. The existing CI-22..CI-26 gated items from the 2026-06-23 Framework v2 intake remain active (see above).

| Item | Gate type | What it unblocks |
|------|-----------|-----------------|
| CI-27 (Capability Graph) | arbor-safety review of `screenModelOutput` enforcement wiring + arbor-clinical-lead schema confirmation (no implicit diagnostic framing) | Architecture spine — unblocks CI-28/29/30/31/32/33/34 |
| CI-28 (Goal Builder) | arbor-clinical-lead copy pass on curated goal-label list (no condition-name anchors); arbor-safety COPPA review on `activeGoals` ChildProfile field | Build-ready — THE first vertical slice |
| CI-29 (Interest Personalization) | arbor-safety COPPA review on `interests[]` field; arbor-ai cost estimate on substitution path | Build-ready; can parallelize with CI-28 |
| CI-30 (Daily Plan Generator) | Blocked by CI-27 + CI-28 + CI-29 gates being lifted; no separate clinical gate | Build-ready after CI-27/28/29 |
| CI-31 (Duration Variants) | None (safe) — auto-eligible after store track ships | Build-ready immediately post-store |
| CI-32 (Daily Living Domain) | arbor-clinical-lead + arbor-clinical-peds + arbor-clinical-slp full copy pass; swallow-safety interrupt implemented and tested (feeding build-condition); arbor-safety COPPA on all new data write paths | Build-ready for Phase-2 Domain wave |
| CI-33 (Motor/Sensory Domain) | arbor-clinical-lead + arbor-clinical-slp copy pass on sensory log + motor observableSignals; arbor-safety COPPA on sensory preference write path | Build-ready for Phase-2 Domain wave |
| CI-34 (Social Play Domain) | arbor-clinical-psych copy pass on 10 node strings; lint assertion confirming sensitive-3 absent from Domain B; CI-25 routing boundary finalized | Build-ready for Phase-2D (parallel with CI-22/24) |
| #95 AI Summary Export | CEO 12-month clinician-channel decision | Not in backlog until that decision |
| #97 Professional Mode / Therapist Export | CEO 12-month clinician-channel decision | Not in backlog until that decision |
| #69/#70 Feeding Exploration (swallow-safety condition) | Clinical Board confirms swallow-safety interrupt is implemented and green-tested | Feeds CI-32 build-ready gate |

---

### (f) Sequencing — Within the CEO-Locked "Behind Store Launch" Constraint

**All sequencing is BEHIND the store launch (AP-061..AP-064). No CI-27+ build starts until the app is live in the stores. Cheap, non-engineering clinical gate work (goal-label copy pass, schema review, sensory log copy pass) is front-loaded now — it does not compete with the store track.**

```
STORE TRACK (active goal, no competition)
├── AP-061 / AP-062 / AP-063 / AP-064 — store blockers
└── Front-load in parallel (non-engineering clinical gate work):
    ├── CI-27 schema definition (type + Zod + enum) — 1-day paper exercise, no build
    ├── CI-28 goal-label list draft → arbor-clinical-lead copy pass
    └── CI-31 duration-chip design — trivial; ready when store ships

POST-STORE LAUNCH
├── Phase 1 (safe, from Framework v2 intake):
│   ├── CI-20 Numeracy Track  (safe, effort M)       ← existing vertical slice
│   └── CI-21 School Readiness Kit + Export  (safe)  ← existing wave
│
├── Phase 1-Architecture (IN PARALLEL with CI-20/CI-21):
│   ├── CI-27 Capability Graph schema + seed tool     ← CI-20 = first migrated node
│   │   (zero risk to CI-20 timeline — CI-20 content seeds the graph, not vice versa)
│   └── CI-31 Duration Variants  (safe, effort S)    ← standalone, no dependency
│
├── Phase 2 (first vertical slice → THE GOAL BUILDER):
│   └── CI-28 Goal Builder  ← FIRST VERTICAL SLICE (HoP pick)
│       Metric gate: goal-set rate 40% D7+ before CI-29 build starts
│
├── Phase 2b (parallel with CI-28 post-gate-clearance):
│   ├── CI-29 Interest Personalization  (gated, effort S)
│   └── CI-22 + CI-24 (from Framework v2 — clinical gates front-loaded now)
│
├── Phase 3:
│   ├── CI-30 Daily Plan Generator  ← blocked by CI-27+28+29
│   └── CI-23 + CI-25 (from Framework v2 — highest-gate items)
│
└── Phase 4 (parallel, post-Phase 2b clinical clearance):
    ├── CI-32 Daily Living Domain  (swallow-safety condition is the gate)
    ├── CI-33 Motor/Sensory Domain  (sensory label-leak gate)
    └── CI-34 Social Play Domain  (sensitive-3 exclusion gate + CI-25 boundary)
```

**THE ONE VERTICAL SLICE TO BUILD FIRST (post-store, post-CI-20/21 wave):**

> **CI-28 — Goal Builder + Parent-Concern→Goal Spine** — `gated` (clearable), effort S, priority 8.8. This is the smallest item that (a) solves the activation dead-end ("Ask Arbor → one-off → lost"), (b) is a prerequisite for the Daily Plan Generator and for every domain track becoming goal-linked rather than passive content, and (c) ships before the full Capability Graph is seeded. The clinical gate (goal-label copy pass) is fast and can be front-loaded now. Metric: goal-set rate 40% among D7+ users within 30 days.

---

*PM note: this block is a Council Intake (proposals, §2/§5). Items CI-27..CI-34 are CANDIDATES; AP-071..AP-078 are reserved promotion IDs. Reconciles with and extends CI-20..CI-26 from the 2026-06-23 Developmental Framework v2 intake — no duplication. The Held / Not-Built record and Gated-Decision List are updated with #95/#97 and the #69/#70 swallow-safety build-condition.*

---

## Council Intake — 2026-06-23 — "Developmental Functioning Assessment Layer" (Functional Observation, reconciled)

**PM:** arbor-pm · **Council cycle:** 2026-06-23 · **Source:** "Developmental Functioning Assessment Layer" strategic input (questionnaire-derived functional tracking + IL ועדה/סייעת committee-report). **Four lenses evaluated:** Clinical Board (arbor-clinical-lead + peds/slp/psych), Capability Critic (arbor-critic-capability), Advisor (arbor-advisor), Head of Product (arbor-product). **AP- ids reserved for promotion: AP-079+. Next id after this block: AP-086.**

### (a) Framing — Honest Divergence and the Reconciliation Principle

The four lenses started from different entry points and diverged sharply before converging on one principle.

The capability critic identified a real, large, underserved market: the Israeli ועדת זכאות ואפיון system (248k+ children in special-ed; the 2024 Taub/Shapira Commission explicitly named a missing functional-documentation tool; the ועדה paperwork window runs February–May; no consumer product generates a committee-ready document from longitudinal parent+teacher observation data). The advisor confirmed the ועדה use-case is the rubric at its best — a real child getting a real aide is the competence-and-responsibility frame doing genuine work. The Head of Product validated three salvageable product forms and confirmed the market is a real GTM opportunity. All three lenses said: build something here.

The Clinical Board partially vetoed the input on the most material ground: the proposal's flagship artifacts — the computed Mediation Index %, the "significant gap" Functional Profile verdict, the SRS-ideational Social Communication Screener, and the ועדה deficit report as Arbor's output — are the Framework-v2 Assessment-Engine spine returning in "functional/non-diagnostic" clothes. The board's ruling was on substance, not framing: "ideationally based on Vineland/ABAS/SRS/Sensory Profile" does not survive because cloning an instrument's construct + item structure + scoring is validity-theft + MDR Rule 11 device-adjacency independent of verbatim copying. The output is adjudicative (allocates a public resource), which raises — not lowers — the regulatory classification. "Non-diagnostic wording" does not declassify a per-child quantified-deficit verdict.

The reconciliation principle all four lenses ultimately reached: **the IL ועדה market is real and large and underserved — but the only clinically-sound, rubric-aligned product form is a parent-owned, descriptive, raw observation log/export that the family carries to their own professional/committee.** Arbor is the structured notebook: it computes no score/index/percentage, renders no verdict, clones no instrument, and signs nothing. The salvageable items below are the observation-log forms; the vetoed items are the deficit-quantification spine.

This intake re-touches two prior CEO-gated decisions: (1) the professional/committee export (HELD, DEM-005/#97 CEO-gated at 12 months); (2) the killed assessment engine (Framework-v2 VETO). Neither may be reopened without the conditions stated in those decisions.

**Next AP- id for promotion: AP-079.**

---

### (b) Scored Candidate Table — Salvageable / Clearable Items Only

Items below are the parent-owned descriptive-log forms that survived the clinical gate. The vetoed deficit-quantification spine is in section (d). All gated items require the named clinical pass before build-ready; none may auto-schedule.

| ID | Title | Stream | riskClass | Priority | Clinical | Advisor | Owner pod | Note |
|----|-------|--------|-----------|----------|----------|---------|-----------|------|
| CI-35 | Transition Difficulty Tracker — per-event descriptive log | product | gated | **7.1** | concerns (clearable) — extends CI-22; descriptive per-event log only, no "difficulty" rating, no trend chart | aligned | arbor-growth | Cleanest item in the set. Extends CI-22 Transition coaching track (#2 in the input re-scoped per board). 5–7 named preschool-transition contexts + did-alone/reminder/needed-help/resistance + free-text what-helped. Parent-observed, child-as-own-baseline. |
| CI-36 | Functional-Domain Structured Logging Fields (Arbor's own taxonomy — NOT ABAS/Vineland terms) | product | gated | **6.8** | concerns (clearable) — new child-data schema; HARD CONDITION: field names/labels must be Arbor's own taxonomy; no ABAS/Vineland/SRS/Sensory-Profile term may appear in any string, field label, tooltip, or prompt | aligned | arbor-growth + arbor-api | Data substrate for CI-35 + CI-37 + CI-38. Arbor-native fields: `setting`, `adultSupportLevel` (descriptive scale: independently / with reminder / with support / together), `participationQuality` (descriptive: fully / mostly / partially / watching), `transitionContext`. No normative comparison; no scoring. |
| CI-37 | Functional Support Map — 3-tier framing OUTPUT layer (on accumulated observations) | product | gated | **5.9** | concerns (clearable); HARD CONDITION: copy must not read as a developmental verdict; "3-tier" is a DESCRIPTIVE summary of what the parent logged, not a clinical classification; arbor-clinical-lead copy pass on every label string before build-ready | tension (framing risk) | arbor-growth | Extends CI-25 observation lens. Reads accumulated observations to surface: "managing independently most of the time," "benefits from support in some settings," "consistent support helps most." No instrument-term, no score, no gap, no "significant." Framing is descriptive and parent-attributed, never Arbor-asserted. |
| CI-38 | Mediation Observation Log — RAW counts only, % permanently vetoed | product | gated | **5.4** | concerns (clearable); PERMANENT VETO on the computed %: the Adult Mediation Index as a score/index/percentage is VETOED (board §3 — app-asserted deficit metric allocating a public resource; false precision + liability + Rule-11 hardened by official use); ONLY the per-activity RAW count log is clearable | aligned | arbor-growth | Per-activity, per-session count of mediation level used (parent-logged raw counts: independent / with one reminder / with active support / did together). Parent draws their own conclusion. No aggregated percentage, no committee-facing output without Guy's export decision. Extends CI-36 logging fields. |
| CI-39 | Intervention Planner (visual schedule, timer, choice board — structure tooling) | product | **safe** | **7.8** | SAFE — plain structure tooling, no developmental verdict, no claim; provided no copy says "improves functioning" | aligned | arbor-practice | #8 from the input — board-cleared safe item (PRODUCT-COUNCIL.md L169). No clinical gate beyond standard copy check. Auto-eligible for build wave once store track ships. |
| CI-40 | Before/After own-baseline trend (parent-owned, CI-28 goal data) | product | gated | **5.2** | concerns (clearable) — ONLY as a parent-owned own-baseline descriptive timeline; VETO as any efficacy/before-after-delta claim or scored-delta chart; depends on CI-28 (Goal Builder) being live | aligned | arbor-growth | Extends CI-28 goal data. Parent sees their own logged observations over time against their own goal. No "did the intervention improve functioning" framing — that is the claim ceiling (PRODUCT-COUNCIL.md L156). No delta score, no effect attribution. |
| CI-41 | Committee-Season JITAI Prompt (Jan–Feb, IL-locale) — nudge extension only | product | **safe** | **6.2** | SAFE — nudge extension, no child-data schema change, no new clinical claim; links to existing parent-owned export (once export exists); IL-locale-gated | aligned | arbor-growth | The ONE genuinely safe near-term item for the ועדה market. A JITAI prompt (Jan–Feb seasonal, IL-locale only) surfacing: "ועדה season is approaching — here is how to prepare your child's observation record." Links to export (gated on Guy's export decision). Safe to build the prompt infrastructure now; the payload is only useful once the export exists. |
| CI-42 | NL/BE OPP/M-decreet locale analog (same export infrastructure, lower effort, post-IL) | product | gated | **4.1** | gated — same export-decision dependency as CI-41 + GDPR/AVG data-egress gate; locale analog of IL use-case (NL ontwikkelingsperspectiefplan / BE M-decreet) | aligned | arbor-growth | Same parent-owned export infrastructure as CI-41. Post-IL build (after the export decision is made and the IL export is live). Lower priority than IL beachhead; included for de-dup and sequencing awareness. |

**Priority formula (§3):** reach × impact × confidence × strategic_fit ÷ effort. strategic_fit = 0.85 for gated items (real market, partially constrained product form); 1.0 for safe items. Confidence is suppressed by the export-decision gate on the higher-value items.

| CI id | reach | impact | conf | strategic_fit | effort | raw | final |
|-------|-------|--------|------|---------------|--------|-----|-------|
| CI-35 | 3 | 4 | 0.80 | 0.85 | M=2 | 4.1 | **7.1** (extends CI-22; cleanest item; moat tie-break) |
| CI-36 | 4 | 4 | 0.80 | 0.85 | M=2 | 5.4 | **6.8** (data substrate; moat tie-break as schema foundation) |
| CI-37 | 3 | 4 | 0.70 | 0.85 | M=2 | 3.6 | **5.9** (extends CI-25; framing risk suppresses confidence) |
| CI-38 | 3 | 3 | 0.75 | 0.85 | S=1 | 5.7 | **5.4** (% permanently vetoed suppresses impact) |
| CI-39 | 4 | 4 | 0.90 | 1.0 | S=1 | 14.4 | **7.8** (safe; no gate; plain tooling) |
| CI-40 | 3 | 3 | 0.70 | 0.85 | S=1 | 5.4 | **5.2** (blocked by CI-28; confidence suppressed) |
| CI-41 | 3 | 3 | 0.85 | 1.0 | S=1 | 7.7 | **6.2** (safe; only useful once export exists; IL-locale only) |
| CI-42 | 2 | 3 | 0.65 | 0.85 | S=1 | 3.3 | **4.1** (post-IL; export-decision gate; GDPR layer) |

*CI-39 is `safe` and auto-eligible for the next safe build wave once the store ships. CI-41 is `safe` but its useful payload is gated on the export decision — the prompt infrastructure can be built, the payload is empty until the export exists. All gated items remain candidates; priority scores reflect Clinical Board scheduling priority, not immediate buildability.*

---

### (c) PRD-Level Specifications — Top 4 Salvageable Items

---

#### CI-35 — AP-079 (candidate) — Transition Difficulty Tracker

**Problem.** Parents navigating special-education eligibility in Israel (and equivalents elsewhere) have no structured, timestamped record of how their child handles real-world transitions. The CI-22 EF coaching track captures self-regulation broadly; this item goes narrower and more practical — 5–7 named preschool/school-entry contexts (drop-off, circle-time start, lunch-to-outside, outside-to-inside, home-to-car, pack-up-end-of-day, any context the parent names) — and captures not just whether the child struggled but what actually helped. Over a 3-month window, this log is the honest starting material for a ועדה observation packet or a conversation with a developmental pediatrician. No competitor produces a timestamped, context-specific transition observation log from the parent's own record.

**Who and why now.** Parents of 3–8 year olds who are actively navigating transitions and who have flagged a transition watch-area in the behavior log or via Ask Arbor. The IL ועדה window (Feb–May) creates a real seasonal demand signal. The item is the cleanest and most defensible in this intake — it extends CI-22 rather than competing with it.

**In-scope.**
- A per-event log UI: parent selects a named transition context (or adds a custom one), records the child's response using Arbor's own descriptive scale — `independently` / `with one reminder` / `with active support` / `needed to do it together` — and optionally adds what helped (free-text or tagged: verbal cue / visual timer / choice board / physical support / natural consequence / other).
- Persist to the longitudinal record as a `transitionObservation` event type linked to the child's profile and optionally to an active CI-28 goal.
- A parent-facing timeline view: the child's own transition events over time, chronological, filterable by context. No trend chart comparing the child to a norm; no "difficulty score"; no aggregation. The timeline is the observation log, not a verdict.
- A "print / copy to clipboard" button (NOT an Arbor-formatted report): copies the raw chronological log as plain text the parent can paste into any document they own. The export question (formatting + who-receives-it) is HELD on Guy's decision.

**Out-of-scope and the hard clinical line.**
- No "transition difficulty score," no "difficulty rating" on any event — the scale labels describe observable support level, not a difficulty verdict.
- No trend chart rendered as a developmental verdict ("getting harder," "getting easier" — the child's trajectory is a timeline the parent reads, not a metric Arbor asserts).
- No ABAS/Vineland/SRS/Sensory-Profile term in any string, label, tooltip, or empty state. The domain taxonomy is Arbor's own.
- No "significant difficulty," "significant gap," or any evaluative qualifier.
- Verbatim non-diagnostic header on any parent-facing summary view: **"Parent-observed context only — not a clinical assessment. Arbor does not evaluate, assess, or screen your child."** This header is permanent and non-removable.
- No Arbor-formatted committee report without Guy's export decision. The plain-text copy button is the near-term delivery.
- arbor-clinical-psych must pass all scale label copy before build-ready (the four `adultSupportLevel` labels carry implicit framing risk — "needed to do it together" must not read as a deficit verdict).

**Success metric.** Transition-log activation rate among parents with any active EF watch-area or CI-22 rung within 30 days of feature launch (target 30%); log return rate (parents who add a second transition event within 21 days) target 50% of starters.

**Dependencies.** CI-22 (EF Track, for context-specific rung linkage); CI-36 (Functional-Domain Logging Fields, for the `adultSupportLevel` + `participationQuality` schema); CI-28 (Goal Builder, for goal-linking — additive, not blocking); arbor-clinical-psych copy pass on all scale labels and summary view copy.

**Effort.** M (2 sprints). arbor-growth owns the observation log and timeline view; arbor-api owns schema; arbor-safety owns COPPA review on the new child-data write path.

**riskClass.** `gated` — new child-data collection; descriptive scale labels carry implicit clinical framing risk. Requires arbor-clinical-psych copy pass on all label strings + arbor-safety COPPA review. Not auto-scheduled. Surfaces for Guy.

---

#### CI-36 — AP-080 (candidate) — Functional-Domain Structured Logging Fields (Arbor's own taxonomy)

**Problem.** The current `BehaviorLog` schema captures behavior at a domain level but has no structured fields for the kind of contextual, support-level observations that are relevant to functional tracking: what setting was it, how much adult support was needed, what was the quality of participation, and what was the transition context. These fields are the data substrate that CI-35 (Transition Tracker), CI-37 (Functional Support Map), and CI-38 (Mediation Log) all need. Building them as a typed, Arbor-native schema now — before the domain tracks build on top of them — avoids four teams inventing four incompatible schemas.

**The instrument-taxonomy hard line.** The field names, labels, and option sets must be Arbor's own vocabulary. This is a binding condition from the Clinical Board: the input proposal was "ideationally based on ABAS/Vineland/SRS/Sensory Profile" — the board ruled this is construct + scoring clone regardless of verbatim copying. The field taxonomy must be derived from observable parenting reality, not from any normed/licensed instrument. Any ABAS, Vineland, SRS, Sensory Profile, or Adaptive Behavior terminology in any string triggers a clinical hold identical to a condition-name leak.

**In-scope.**
- Four new typed fields added to the `BehaviorLog` event schema (additive, not breaking existing logs):
  - `setting: SettingContext` — an enum of observable, parent-named settings: `home-routine`, `school-arrival`, `mealtime`, `outdoor-play`, `structured-activity`, `transition`, `social-play`, `other`.
  - `adultSupportLevel: SupportLevel` — Arbor's own 4-point descriptive scale: `independently`, `with-one-reminder`, `with-active-support`, `together`. Not a clinical rating scale, not normed, not a deficit indicator — a description of what the parent did.
  - `participationQuality: ParticipationLevel` — Arbor's own 4-point descriptive scale: `fully`, `mostly`, `partially`, `observing`. Same principle: observable description, no verdict.
  - `transitionContext: string` (optional free-text or tagged): what changed immediately before the event.
- Zod schema + compile-time validation. The `prohibitedTerms[]` array on the schema definition lists the instrument-term block: ABAS, Vineland, adaptive behavior quotient, SRS, Sensory Profile, SPD, sensory seeker, sensory avoider, over-responsive, under-responsive, and their common derivatives.
- Migrations: existing BehaviorLog events are unaffected (new fields are optional).

**Out-of-scope and the hard clinical line.**
- No scoring algorithm over these fields — they are observation inputs, not a rating scale.
- No norm-referenced comparison rendered against these fields.
- `adultSupportLevel` and `participationQuality` labels must be reviewed by arbor-clinical-psych before build-ready (scale labels are the primary framing risk).

**Success metric.** All downstream items (CI-35, CI-37, CI-38) successfully resolve against the typed schema with zero Zod errors; `prohibitedTerms[]` non-empty and linted in CI; no instrument-term appears in any rendered string.

**Dependencies.** Existing BehaviorLog schema (additive extension). arbor-clinical-psych copy pass on `adultSupportLevel` and `participationQuality` label sets. arbor-safety COPPA review on the new field write path.

**Effort.** S–M (schema + Zod + lint + 4-field UI additions). arbor-api owns schema; arbor-growth owns UI prompt additions; arbor-safety owns COPPA review.

**riskClass.** `gated` — new child-data fields; instrument-taxonomy prohibition is a load-bearing clinical condition. arbor-clinical-psych copy pass required on scale labels before build-ready. Not auto-scheduled. Surfaces for Guy.

---

#### CI-37 — AP-081 (candidate) — Functional Support Map (3-tier framing output layer)

**Problem.** A parent who has logged 30+ transition observations and behavior events has no summary view that reflects what the accumulated record shows about their child's support patterns. Today they have a raw timeline (CI-35) but no framing that helps them understand it. The Functional Support Map is that framing — but with a hard clinical constraint: it is a description of what the parent logged, not an Arbor verdict about the child. The board's ruling is exact: a 3-tier output is clearable IF AND ONLY IF it is descriptive-and-parent-attributed ("most of what you've logged in the last 30 days shows [child] managing this context independently") and never a clinical classification ("significant gap," "needs mediation," "adaptive behavior concern").

**Who and why now.** Parents with 30+ logged events who want a consolidated view before a ועדה meeting or a pediatrician visit. This is the one item in the intake where the IL market insight is most directly load-bearing — the Taub/Shapira Commission gap is exactly here. Rivals: no consumer app produces this view; ABAS/Vineland are clinician-only $150–400 kits. Arbor's version is the parent's own data summarized in plain language — structurally uncopyable without the longitudinal record.

**In-scope.**
- A Functional Support Map view (parent-facing, read-only): rendered only when the child has ≥15 observations with structured fields populated (CI-36). Surfaces the child's own distribution across the `adultSupportLevel` scale per setting context over the last 30 days.
- Three descriptive framing tiers, expressed as parent-attributed observations of the child's logged history:
  - "Most of what you've logged shows [child] managing [context] on their own."
  - "In about half of what you've logged, [child] does well with one reminder or cue."
  - "Most of what you've logged shows [child] doing better with active support or together."
- These three strings are FIXED verbatim — they may not be AI-generated per-instance. The Clinical Board must approve the exact copy before build-ready.
- A prominent, permanent, non-removable disclaimer at the top of the view: **"This reflects what YOU logged — it is not an assessment of your child. Arbor does not evaluate, assess, or screen for developmental conditions."**
- A "copy as plain text" button (identical to CI-35) — no Arbor-formatted export without the export-decision gate.

**Out-of-scope and the hard clinical line.**
- No instrument term in any string. The three tier labels are Arbor's own plain language.
- No "significant gap," no "difficulty level," no evaluative qualifier.
- No comparison to peers, norms, or population percentiles.
- The tier is not a score — the view does not display "6 out of 10" or any numeric aggregation. It shows the distribution from the parent's own log using descriptive language.
- AI may NOT generate the tier summary strings per instance — the three strings are fixed and board-approved. A per-child AI-generated framing of "how the child is functioning" is a per-child developmental verdict regardless of mechanism (the claimed vs actual output is the distinction in effect, not in generation method).

**Success metric.** Functional Support Map view opened by 40% of parents with ≥15 structured observations within 30 days of feature launch; "copy as plain text" button used by 25% of view-openers (the ועדה-intent signal).

**Dependencies.** CI-36 (structured logging fields — minimum 15 populated events required); CI-25 (Neurodiversity Observation Lens — the framing boundary between the observation lens and the support map must be finalized before CI-37 is built, to prevent overlap); arbor-clinical-lead copy pass on the THREE tier strings verbatim (load-bearing — this item cannot be build-ready until those exact strings are approved); arbor-safety COPPA review on the read-aggregation path.

**Effort.** M (2 sprints). arbor-growth owns the aggregation logic and view; arbor-clinical-lead owns the verbatim tier string approval.

**riskClass.** `gated` — the framing risk on this item is the highest in the salvageable set. Requires arbor-clinical-lead verbatim copy approval on all three tier strings before build-ready. Not auto-scheduled. Surfaces for Guy.

---

#### CI-41 — AP-085 (candidate) — Committee-Season JITAI Prompt + Parent-Owned Export Template

**Note on sequencing:** This section covers both CI-41 (the JITAI prompt, which is safe) and the parent-owned export template (which is HELD on Guy's export decision and covered in section (e)). They are described together because the prompt is only useful if the export exists.

**Problem (JITAI prompt).** The Israeli ועדה eligibility window peaks February–May. A parent who has been logging observations since October has exactly the right material to bring to a committee meeting — but no nudge surfaces that context at the right moment, and no structured export helps them organize it. The nudge itself is a JITAI extension (seasonal + IL-locale) with no child-data schema change and no new clinical claim.

**Who and why now.** IL-locale parents with ≥30 logged observations active in January–February. The prompt is the one item in this intake that is genuinely safe near-term and directly addresses the IL market opportunity the capability critic identified.

**In-scope (JITAI prompt — safe, near-term).**
- A seasonal JITAI rule: if child is IL-locale AND ≥30 observations logged AND current month is January or February → fire once: "ועדה season is coming (Feb–May). The observations you've been logging are exactly the kind of record families bring to these meetings. Here's how to organize your notes." Links to: (a) the parent-owned plain-text copy button on CI-35/CI-37 (the "notebook export"); (b) a non-diagnostic guidance note ("what a ועדה typically asks for" — parent-authored context, not Arbor's assessment). Fires once per season, not recurring.
- The guidance note is static copy: "Israeli eligibility committees typically ask for parent-observed descriptions of your child's daily functioning — not scores, not diagnoses. The observations you've logged in Arbor can be a starting point for organizing what you've noticed." No claim that Arbor's output is a committee-ready document.

**In-scope (parent-owned export template — HELD on Guy's export decision).**
- A structured plain-text export template the parent fills and owns: fields pulled from the parent's own logs (transition observations, support-level distribution, free-text "what helps"), a mandatory verbatim header on every page: **"Parent-observed context only — not a clinical assessment. This document was created by the parent using their own observations. Arbor does not evaluate, assess, or screen the child."**, and a parent-authored free-text "additional context" section. No Arbor-computed %, no gap metric, no verdict, no "assessed/screened" framing. The parent signs it (or not) — Arbor does not sign anything.
- This export form is HELD until Guy decides the export question (see section (e)). The prompt infrastructure is safe to build; the export template is a Guy-gated decision.

**Out-of-scope and the hard clinical line.**
- The prompt copy must not imply Arbor's logs ARE a committee-ready document — the copy above is the ceiling.
- The export template, once built, carries the verbatim non-diagnostic header on every page. This is non-negotiable and non-removable.
- No Arbor-computed metric appears in the export template in any form.

**Success metric (JITAI prompt).** Prompt open rate among eligible IL parents in January–February (target 40%); "copy notes" button activations following the prompt (target 25% of openers — the ועדה-intent signal).

**Dependencies.** CI-35 + CI-37 (the logs the prompt links to); arbor-growth JITAI engine (seasonal rule extension); IL-locale flag on `ChildProfile`; Guy's export decision (for the export template half). The prompt infrastructure itself has no dependency on the export decision.

**Effort.** S (1 sprint for JITAI rule + guidance note). The export template is additional M effort, post-Guy-decision.

**riskClass.** `safe` (JITAI prompt + guidance note) / `gated` (export template — CEO export decision + child-data-egress gate).

---

### (d) Held / Not-Built — Additions from This Intake (durable clinical record)

The following items are PERMANENTLY RECORDED as will-not-build in their proposed form. They may not re-enter the backlog without a new Clinical Board review and, where noted, a CEO strategic decision. Added to the existing Held/Not-Built record from the Framework-v2 and 100-Blueprint intakes.

| Item | Decision | Clinical / Strategic basis |
|------|----------|---------------------------|
| Adult Mediation Index as a computed %/score ("% time needing adult mediation") | **Veto — assessment instrument + regulated/liability** | An app-generated quantified "% time needing adult mediation" entered into an official ועדה eligibility decision: (1) false precision (no validated denominator, no inter-rater reliability, no norm sample); (2) device-class hardened by official use (EU MDR Rule 11 / FDA SaMD — information used for an eligibility determination is a diagnostic/therapeutic purpose class); (3) liability (Arbor authored the artifact that drove a real-world public-resource allocation). The allowable form is the RAW per-activity count log the parent draws their own conclusion from (CI-38). PRODUCT-COUNCIL.md L152–153. |
| Social Communication Screener ("ideationally based on SRS-2," 6-item reskin) | **Hard veto — no buildable screener version exists** | Vetoed on three independent grounds: (a) SRS construct-cloning (reproduces the SRS-2 subscale structure — Social Communication + Social Motivation + Restricted Interests — with zero verbatim items, which is validity-theft + IP regardless of verbatim copying); (b) functions as an unvalidated autism screen — an unnormed 6-item reskin is worse than M-CHAT (known ~50% PPV), and the M-CHAT hard rule (never embed/paraphrase/score an autism instrument in-app) applies by analogy; (c) pathologizes normal social-communication variation (solitary/parallel play typical through ~3–4, bilingual/temperamentally-reserved presentations mass-false-flag). The word "screener" is firewall-banned. No reframe rescues this item; the construct itself is the problem. PRODUCT-COUNCIL.md L150. |
| Functional Profile as a normed/"significant gap" verdict (Child Functional Profile with independent/needs-mediation/significant gap + ABAS/Vineland construct) | **Veto — adaptive-behavior verdict + construct-clone + device-adjacent** | "Significant gap" is an evaluative qualifier asserting a developmental distance from a norm the app has no instrument to measure. The three-tier output (independent / needs mediation / significant gap) is the Vineland/ABAS adaptive behavior classification reproduced without the standardized administration that gives it validity. Replaced by CI-37 (3-tier descriptive framing, parent-attributed, no evaluative qualifier, verbatim-approved strings only). PRODUCT-COUNCIL.md L162. |
| Any ABAS/Vineland/SRS/Sensory Profile instrument construct-mapping (item structure, scoring logic, subscale taxonomy) | **Hard rule — never** | Cloning an instrument's construct + item structure + scoring is validity-theft + EU MDR Rule 11 device-adjacency independent of verbatim copying (Framework-v2 veto extended; PRODUCT-COUNCIL.md L148). Arbor uses its own observable-behavior taxonomy (CI-36) or cites the instruments as context with no in-app reproduction. |
| Attention "Difficulty" Profile / General Attention Difficulty surface (ages 3–7) | **Veto — ADHD-adjacency + age-floor violation** | The CI-22 ADHD-condition-name ban applies absolutely — no EF or attention-difficulty surface may label, imply, or route toward ADHD even as a disclaimer anchor. Additionally the CI-22 clinical guardrail mandates no "worth discussing with your provider" routing on EF behaviors below age 7 — an "attention difficulty" label below age 7 violates this floor. No buildable version exists within the current age-floor rules. PRODUCT-COUNCIL.md L166. |
| Sensory & Emotional Regulation Map ("ideationally based on Sensory Profile," map/screen framing) | **Veto as a "map/screen"; clearable only as the Blueprint #62 comfort log** | A "map" or "screen" over sensory/regulation behavior is the SPD-screen line regardless of framing. The only clearable form is the Blueprint #62 Sensory Preference Log ("what helps [child] feel comfortable") from CI-33, which already has its own clinical gate. A "map" that surfaces a count/threshold/verdict over logged sensory dislikes — even labeled "functional, not diagnostic" — is vetoed. PRODUCT-COUNCIL.md L167. |
| Before/After as an efficacy/deficit-delta claim ("did the intervention improve functioning," scored delta chart) | **Veto as worded; clearable only as parent-owned own-baseline trend (CI-40)** | "Did the intervention improve functioning" is the claim-ceiling sentence verbatim — Arbor asserting its own intervention works is an unsubstantiated efficacy claim + implicit clinical-outcome measurement. A before/after functioning-score delta is also a banned trend chart of a child metric (CI-24 §2). The allowable form is CI-40: parent-owned, own-baseline, descriptive timeline, no efficacy attribution, no scored delta. PRODUCT-COUNCIL.md L156. |

---

### (e) Gated-Decision List for Guy — 2026-06-23 (Assessment Layer intake additions)

These items require an explicit Guy decision before any build action. Added to the existing Gated-Decision List from the Framework-v2 and Blueprint intakes.

| Item | Gate type | What it unblocks |
|------|-----------|-----------------|
| **Parent-Teacher Shared View** — a teacher/גננת as a scoped second-angle contributor to the parent-OWNED record | **Strategic PRIVACY-ARCHITECTURE decision** — this is a new non-parent actor on the child's record: new consent architecture (GDPR Art.26 joint-controller + COPPA child-data egress to a non-parent third party), a separate `ganObservations` sub-collection that is time-scoped and parent-revocable, teacher access scope, and the question of whether the teacher is a data processor or joint controller. **This is a strategic privacy decision Guy must make BEFORE any scoping or ticketing.** It is not a build ticket yet. The SHARED VIEW is the highest-moat item in the intake (teacher angle = no competitor has it on the same longitudinal record) but it cannot move to a ticket without the privacy architecture decision. | Only after Guy decides the consent + privacy architecture; unblocks a future CI |
| **Committee/Professional Report (ועדה PDF / formatted export)** — the parent-owned observation export as a committee-ready document | **Re-touches the HELD CEO-gated-at-12-months professional-export decision (DEM-005/#97)**. The only sound near-term form is a parent-owned export (the family's own observations, verbatim non-diagnostic header, no Arbor-computed metric, Arbor signs nothing) — and even that form is HELD behind this decision + a separate `arbor-safety`/Guy child-data-egress consent gate. Near-term: the plain-text "copy your notes" button (CI-35/CI-37) is the safe substitute. | Only after Guy decides the 12-month professional-export question + arbor-safety clears the egress path |
| **IL ועדה market** — a real GTM opportunity | **Product form is gated on the export decision**. The market (248k+ IL special-ed; Taub/Shapira Commission 2024 naming the gap; ועדה window Feb–May; no competitor generates a committee-ready doc from longitudinal parent+teacher data) is confirmed as real and underserved. The safe near-term product form is CI-35 (Transition Tracker) + CI-36 (Logging Fields) + CI-41 (JITAI seasonal prompt). The full ועדה-document form is gated on Guy's export decision. | CI-35 + CI-36 + CI-41 can start now (gated on clinical copy pass); the formatted ועדה export is export-decision-gated |

---

### (f) Sequencing — Within the CEO-Locked "Behind Store Launch" Constraint

All sequencing is BEHIND the store launch (AP-061..AP-064). The clinical gate work (copy passes on CI-35/CI-36 scale labels) can be front-loaded in parallel with the store track.

**The honest near-term answer for the ועדה/IL market:**

The ONE genuinely safe near-term item is the Committee-Season JITAI prompt (CI-41), but it is only useful once an export exists — and the export is gated on Guy's decision. So the honest build sequence is:

1. **Now (front-load, non-engineering):** arbor-clinical-psych copy pass on CI-35 and CI-36 scale labels; draft the verbatim non-diagnostic header copy for Guy review; CI-36 schema definition as a typed paper exercise.
2. **Post-store Phase 1 (parallel with CI-20/CI-21 wave):** CI-39 Intervention Planner (safe, auto-eligible) + CI-36 schema (gated, clearable quickly).
3. **Post-store Phase 2 (after CI-36 schema ships):** CI-35 Transition Difficulty Tracker. This is the FIRST VERTICAL SLICE for this intake.
4. **Post-store Phase 3 (after CI-35 + CI-28 live):** CI-38 Mediation Observation Log (RAW counts) + CI-40 Before/After own-baseline trend.
5. **Post-store Phase 3b (after CI-36 + CI-35 have 15+ observations from active users):** CI-37 Functional Support Map (depends on clinical-lead verbatim copy approval of the three tier strings).
6. **Seasonally triggered (Jan–Feb post-store):** CI-41 JITAI prompt. The prompt infrastructure can be built in Phase 2; the useful payload depends on the export decision.
7. **Post-Guy-decision:** Parent-owned export template (half of CI-41) + any Parent-Teacher Shared View scoping.

**THE ONE VERTICAL SLICE for this intake:**

> **CI-35 — Transition Difficulty Tracker (parent-owned descriptive log)** — `gated` (clearable), effort M, priority 7.1. The cleanest item in the set: it extends CI-22 (the existing EF coaching track), produces nothing about the child, is parent-owned from event one, and creates the data substrate the ועדה market cares about without any of the vetoed deficit-quantification machinery. The clinical gate (psych copy pass on 4 scale labels + the summary view disclaimer) is fast. Metric: 30% of parents with active EF watch-area activate the log within 30 days. This is the slice that makes the IL ועדה market claim checkable: if parents use it and copy their notes before meetings, the export decision becomes obvious.

---

*PM note: this block is a Council Intake (proposals, §2/§5). Items CI-35..CI-42 are CANDIDATES; AP-079..AP-085 are the reserved promotion IDs (CI-39=AP-083, CI-40=AP-084, CI-41=AP-085; CI-35=AP-079, CI-36=AP-080, CI-37=AP-081, CI-38=AP-082, CI-42=AP-086). Reconciles with and extends CI-20..CI-34 — no duplication. The Held/Not-Built record and Gated-Decision List are updated with the 6 vetoed items and 3 new Guy-gated decisions from this intake. The deficit-quantification spine (Mediation Index %, Social-Communication Screener, Functional Profile verdict, instrument construct-mapping, Attention Difficulty Profile, Sensory/Regulation Map) is permanently recorded as will-not-build in those forms.*