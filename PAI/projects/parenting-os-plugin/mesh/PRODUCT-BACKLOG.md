# Arbor Product Backlog — the one scored queue

**Owner:** Product Council (PAI). Canonical body is curated by a human / the Orchestrator. The council loop **appends** dated `## Council Intake` candidate blocks below; it never clobbers the body. Promotion into a live track is a deliberate step. See [PRODUCT-COUNCIL.md](PRODUCT-COUNCIL.md).

> **Canonical role (release-engineering, 2026-06-22):** this is the **one canonical Arbor Product backlog** a release train pulls from (`REL-ARBOR-*`). Promoted items take an **`AP-`** id and back-reference their origin (`from: CIL-… / DEM-… / market lens`). The **[CIL IMPROVEMENT-BACKLOG](improvement/IMPROVEMENT-BACKLOG.md)** and the Council Intake blocks below are **feeders** — a finding is a candidate until promoted here with an `AP-` id; it is never tracked live in two places. Ready-bar + identity rules: [BACKLOG-MODEL.md](../../../../00_System/release-engineering/BACKLOG-MODEL.md). Any item carrying a developmental/medical/effect-size claim needs a row in the [claim register](../../../../00_System/release-engineering/CLAIM-REGISTER.md) and ships **dark** (flag OFF) until signed.

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
| CIL-conv-no-post-checkout-activation | No post-checkout activation on payment return | bug | cil | Promoted — `safe`, score 22 | **AP-006** |
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

**AP-001**
- **Title:** Non-pathologizing framing guard on behavior/emotion coaching
- **From:** CLI-06 (Council Intake 2026-06-21, clinical stream)
- **Type:** enhancement · **Stream:** clinical · **riskClass:** safe
- **Owner pod:** arbor-growth (BehaviorsTab.tsx / PatternInsights.tsx / /analyze-behavior route)
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

**AP-005**
- **Title:** JITAI home nudge hardcoded English — wire i18n EN+HE
- **From:** CIL-lang-jitai-nudge-en-regression (IMPROVEMENT-BACKLOG.md, cycle 2026-06-22, language lens, score 23)
- **Type:** bug · **Stream:** cil · **riskClass:** safe
- **Owner pod:** arbor-growth (+ arbor-content for HE strings)
- **Problem:** `lib/jitai.ts:52-96` returns raw EN headline/body/cta strings. `OverviewTab.tsx:274-278` renders them with no `t()` call. `nextNudge()` receives no `language` param (OverviewTab:154). Hebrew-language regression on the #1 retention surface — same class of defect fixed elsewhere in a prior cycle.
- **Acceptance criteria:** (1) 4 nudge strings (headline, body, cta, and any dynamic segment) moved to `i18n.ts` under EN + HE keys. (2) `language` threaded from the active child profile through `nextNudge()`. (3) All nudge strings resolved via `t()` in the render path. (4) Hebrew copy reviewed for naturalness (arbor-content HE pass).
- **Success metric:** Zero hardcoded EN strings in the JITAI nudge render path; Hebrew-locale users see Hebrew nudge copy on all retained scenarios.
- **Score:** priority = (4 × 4 × 0.9 × 1.0) ÷ 2 = **7.2**

**AP-006**
- **Title:** No post-checkout activation on payment return
- **From:** CIL-conv-no-post-checkout-activation (IMPROVEMENT-BACKLOG.md, cycle 2026-06-22, conversion lens, score 22)
- **Type:** bug · **Stream:** cil · **riskClass:** safe
- **Owner pod:** arbor-billing
- **Problem:** `useCheckout.ts:21` redirects to hosted Stripe checkout but nothing reads a `?checkout=success` return. A parent who just paid lands in a cold app — no "Welcome to Plus," no unlocked-feature handoff, no entitlement refresh. This is a confirmed gap (grep: no `searchParams`/`URLSearchParams` in the checkout path).
- **Acceptance criteria:** (1) On mount, detect `?checkout=success` URL param. (2) Force entitlement refresh (poll or re-fetch RevenueCat/Stripe subscription state). (3) Show a one-time success sheet ("Welcome to Arbor Plus — here's what just unlocked"). (4) Strip the `?checkout=success` param after handling to prevent re-trigger on refresh.
- **Success metric:** >90% of successful checkouts show the activation sheet within 3s of redirect return; zero cold-app landings post-payment in the first 14 days post-ship.
- **Score:** priority = (4 × 4 × 0.9 × 1.0) ÷ 2 = **7.2**

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

| Priority | AP- id | Title | Owner pod | Effort | Score |
|---|---|---|---|---|---|
| 1 | AP-004 | PaywallModal — add per-cadence price display | arbor-billing + arbor-content | 2 | 11.25 |
| 2 | AP-007 | Trust chip at onboarding hand-over | arbor-content + arbor-design | 1 | 10.2 |
| 3 | AP-005 | JITAI nudge hardcoded English — wire i18n | arbor-growth | 2 | 7.2 |
| 4 | AP-006 | No post-checkout activation | arbor-billing | 2 | 7.2 |
| 5 | AP-009 | PlayActivity citation schema + render (plumbing only) | arbor-practice | 2 | 7.2 |
| 6 | AP-010 | Surface existing coach citations to parent (source + link, no grade) | arbor-practice | 2 | 6.4 |
| 7 | AP-001 | Non-pathologizing framing guard — wire screenModelOutput to /analyze-behavior | arbor-growth | 2 | 6.0 |
| 8 | AP-002 | Competence Ladder — scaffolding that retires itself | arbor-growth | 3 | 4.0 |
| 9 | AP-013 | School-age 7–10 surveillance track (substantiated set only) | arbor-growth + arbor-practice | 3 | 4.3 |
| 10 | AP-010 | Coach citations source surface (if not bundled with AP-009 in same PR) | arbor-practice | 2 | 6.4 |

**Conflict note:** AP-004 touches `billing/PaywallModal.tsx` + `i18n.ts`. AP-005 touches `lib/jitai.ts` + `OverviewTab.tsx` + `i18n.ts`. AP-007 touches `OnboardingFlow.tsx` + `i18n.ts`. All three write `i18n.ts` — arbor-orchestrator must sequence them (not parallelize into the same file) or merge the i18n additions in a single pass. AP-001 touches `safety/outputScreen.ts` + `routes/api.ts` — no overlap with above. AP-009 + AP-010 both touch `content.ts` + CoachTab render path — coordinate.

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

*Grooming cycle complete 2026-06-22. Next: hand Wave PM-01-2026-06-22 to arbor-orchestrator. Surface gated list to Guy. Re-score after CLI-07 and the brief-template clinical sign-off land (both unblock multiple HELD items).*