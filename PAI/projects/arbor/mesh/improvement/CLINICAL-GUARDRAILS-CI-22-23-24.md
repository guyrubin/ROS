# Clinical Guardrails — CI-22 / CI-23 / CI-24 (binding build-pod spec)

**Author:** `arbor-clinical-lead`, coordinating `arbor-clinical-psych` (lead on CI-22 framing + CI-24), `-peds`, `-slp`.
**Date:** 2026-06-23 · **Mode:** front-loaded clinical gate (CEO-ratified 2026-06-23, decision #4 — pass these gates in parallel with the store track so Phase 2/3 don't queue behind the board).
**Status: GATED — not build-ready.** This spec defines the bar; nothing is cleared until the *actual* copy/strings exist and pass a final board review. Promotion IDs reserved: CI-22→AP-067, CI-23→AP-068, CI-24→AP-069.
**Source specs:** `mesh/PRODUCT-BACKLOG.md` L1920–2026 (CI-22 ~1920, CI-23 ~1956, CI-24 ~1992); Held/Not-Built L2065–2078. **Precedent:** CLI-06 (`PRODUCT-COUNCIL.md` L122) — the `screenModelOutput` output-floor pattern, reused verbatim below.

---

## 0. The binding frame (read first — applies to all three)

- **Surveillance, never diagnosis.** Every surface shows an **observable behavior / competency**, never a **condition**. Arbor surfaces what the parent observed; it never measures, scores, screens, evaluates, or labels the child. Any "worth discussing with your provider" string is CDC "Learn the Signs. Act Early." surveillance voice ("a good thing to bring to your next visit"), never a verdict.
- **The claim ceiling.** Arbor states a **mechanism**, never an **effect size**. No "improves / builds / boosts / trains / strengthens / develops / reduces" applied to a child's EF, regulation, language, or wellbeing. The verb-on-the-child's-capacity is the tripwire.
- **Firewall (advisory.md §0 / CHARTER §3 p11).** All copy is **"developmentally informed, grounded in CDC/AAP/ASHA/WHO"** — never "clinical," "clinically validated," "clinician-reviewed/approved," "assesses," "screens," "evaluates." No adviser/thinker identity anywhere. Our reviewers are not licensed clinicians and are never presented as such.
- **Parent-mediated, never a kid-companion.** Every surface routes the parent AT a real-world shared activity or a real provider. The app is never the child's emotional comfort source or the locus of progress.
- **Mechanism researchers stay back-end.** Diamond (EF trajectory), Barkley (inhibition-as-foundation), affect-labeling/"name-it-to-tame-it" co-regulation literature, Hanen/Orton-Gillingham/ESDM/DIR evidence bases — these inform the *ordering and design* on the back end only. **Never surfaced, never cited in copy, never in a "further reading" list** (citing a branded program's evidence base = "based on [program]" by the back door — see CI-23).
- **The output-floor is a build-ready precondition, not a nicety.** Any AI-/model-authored string on these surfaces (pattern-view summaries, "where to lean in," personalized strategy text) must pass `screenModelOutput` (`safety/outputScreen.ts`) with the `CONDITIONS` regex extended per item, plus a passing output-screen test — exactly the CLI-06 gap made load-bearing on `BehaviorsTab`.

---

## 1. Board verdict (the gate)

| Item | soundness | claims | riskClass | Becomes build-ready when… |
|---|---|---|---|---|
| **CI-22** EF observable-competency track (5–10) | **concerns (clearable)** | none (mechanism only) | **gated** | the 4 required fixes below are in the actual strings + the age-7 routing floor is honored + output-floor bound & tested + final psych copy pass |
| **CI-23** Arbor-native parent-coaching programs | **concerns (clearable)** | substantiated provenance / **UNSUBSTANTIATED if any branded/efficacy string appears** | **gated** | every track script clears clinical-lead, citations are firewall-clean, no branded name + no effect claim, success-metric framing held, referral rail added |
| **CI-24** FeelingsLab personalized layer | **concerns (clearable)** | none (mechanism only) | **gated** | generic-emotion UI only (no zones), anxiety surface fully dropped, the fire-once escalation pattern implemented as specified, output-floor bound & tested, psych + safety co-sign |

**No clinical VETO issued.** All three are buildable. **Veto triggers** (any one flips the item to a hard block, routed through `arbor-orchestrator` identical to an `arbor-safety` veto): a per-child cognitive/EF/anxiety **score or verdict**; an **emotion-intensity trend chart**; a **recurring** escalation alert; any **condition name** in a string/label/tooltip/empty-state; a **branded-program name** in copy or citations; a **Zones 4-color/zone** vocabulary; a **kid-companion** emotional-substitute framing; **inference of the child's internal state**.

---

## CI-22 — Executive Function Observable-Competency Track (ages 5–10)
*psych lead (framing) · peds (age-windows) · slp (comprehension-leak)*

### (1) Allowed framing + allowed-copy examples
Frame all three EF sub-domains as **what the parent saw the child do** — parent-observed verb on a concrete behavior. Never noun-as-trait ("good working memory"), never Arbor-as-evaluator ("Arbor measured…").

- **Working memory (hold-the-rule):** prompt — *"Did [child] hold both parts of the instruction this time? (e.g. 'get your shoes AND your bag')"* · label — *"Holding multi-step instructions — what you've noticed over time."*
- **Inhibitory control (stop-on-signal):** prompt — *"When you said 'stop,' did [child] stop the fun thing — right away, after a reminder, or not yet?"* · label — *"Stopping a fun activity when asked."*
- **Cognitive flexibility (switch-without-meltdown):** prompt — *"Could [child] switch when the rule changed, or did the switch get stuck this time?"* · label — *"Switching between rules / tasks."*
- **Graduation-facing (neutral, competence-positive):** *"[child] managed this on their own this time — no prompt needed."*
- **Trajectory (the moat, stated honestly):** *"Your child's self-regulation observations over time"* / *"Where to lean in this week, based on what you've noticed."*
- **Outward-routing:** *"Practice this one together tonight"* — every rung routes to a shared parent-child activity, never deeper app time.
- Spec-anchored allowed line: *"parent-observed self-regulation skills, grounded in AAP and developmental research."*

### (2) Vetoed strings / patterns (hard-block)
- Instruments/scores: `BRIEF-P`, `BRIEF`, `EF score`, `executive-function score`, `working-memory score`, any 0–N value, percentile/rank, "above/below age level."
- Condition names — **even as a disclaimer anchor:** `ADHD`, `attention deficit`/`attention-deficit`, `processing disorder`, `executive dysfunction`, `EF deficit`, `dysregulation` (as a label).
- App-as-assessor verbs: `evaluates working memory`, `assesses`, `screens`, `tests EF`, `measures attention`, "Arbor found that [child]…", any per-child cognitive verdict.
- **Subtle effect-drift (reads as efficacy — triggers a claim-register row + clinical hold):** `improves EF`, `builds executive function`, `boosts working memory`, `strengthens inhibitory control`, `trains the brain`, `develops cognitive flexibility`.
- **slp comprehension-leak:** observation prompts must log the **observable action** ("stopped when I said stop," "switched after the cue"), never interpret comprehension — `understands` / `follows directions` / `comprehends` are receptive-language judgments = implied language assessment. Lint for those tokens.

### (3) Age-window + cited basis
The three competencies are parent-**observably** valid across 5–10, but interpretation confidence is **not** uniform.
- **Inhibitory control:** firmest — observable and scaffoldable from ~5.
- **Working memory:** firm at the behavior level 5–10 (CDC refs multi-step instructions); never imply a step-count norm.
- **Cognitive flexibility:** **widest normal variation** — transition-rigidity at 5–7 is developmentally common and is **not** a marker. Copy here stays purely descriptive ("the switch got stuck this time"), never a verdict.
- **HARD age floor (peds, binding):** the practice/graduation prompt may run from **age 5**, but **no "worth discussing with your provider" / watch-area routing may fire below age 7** on EF behaviors alone — below 7, EF behavior is surfaced as *practice only, never a flag*. The 5–6 sub-window also widens graduation tolerance (more prompts expected), it does not reuse the 7–10 threshold.
- **Cited basis + evidence honesty:** CDC "Learn the Signs. Act Early." (2022) **stops at age 5** — there is **no CDC milestone anchor for 6–10 EF.** So the L1951 string *"grounded in CDC/AAP developmental milestones"* must **not** be applied to the 6–10 surface; use the in-scope L1936 line *"grounded in AAP and developmental research"* there. Inhibitory control rises 4→5, consolidates 5→6, develops further 6→8 (peer-reviewed trajectory; back-end basis). **Flag (thin evidence):** no single authoritative free public "EF milestone by age" table exists for 6–10; the age-7 routing floor is the conservative read and should be ratified by a licensed developmental pediatrician before it ships. Cite: Zubler et al., *Pediatrics* 2022 (CDC/AAP milestone revision); AAP surveillance-vs-screening policy (Lipkin/Macias 2020).

### (4) Graduation-metric constraint
Rung advances **only** on a parent-logged "self-regulates without prompt" observation across **3 consecutive sessions** — **not** lessons completed, minutes-in-app, or streak (spec: "time-in-app is not a metric"). Attachment-safe + competence-building: the unit of progress is *a parent observing their own child*, co-regulation→self-regulation is the genuine developmental endpoint (so the metric *is* the goal, not a proxy), it can't be gamed by time-in-app, and 3-consecutive (not one) guards a single lucky read from reading as a verdict.

### (5) Required output-screen / test hooks
- Bind the EF-pattern view and any AI-authored "where to lean in" string to **`screenModelOutput` (`safety/outputScreen.ts`)** — same pattern CLI-06 added to `/analyze-behavior`.
- Extend the `CONDITIONS` regex to catch EF leaks: `ADHD`, `attention deficit`, `executive dysfunction`, `processing disorder`.
- Add an output-screen test (`safety/outputScreen.test.ts`) asserting a synthetic EF insight containing an inferred label (e.g. *"this looks like ADHD"* / *"executive dysfunction"*) is caught and replaced with the safe fallback.
- Build-time lint: flag the effect-drift verbs (§2) within one sentence of any EF noun; flag the comprehension tokens.

### Verdict
```
soundness: concerns
claims: none
riskClass: gated
required_fixes: [age-7 provider-routing floor; 5-6 sub-window widens graduation tolerance; drop "CDC milestones" on 6-10 surface (use "AAP + developmental research"); descriptive-only flexibility copy; bind screenModelOutput + CONDITIONS extension + test; effect-drift + comprehension lint; observation logs action not comprehension]
cited_basis: [CDC LTSAE 2022 (stops at 5); AAP surveillance-vs-screening Lipkin/Macias 2020; Zubler et al. Pediatrics 2022; Diamond/Barkley back-end only]
build-ready when: required_fixes are in the actual strings + output-floor bound and green + final arbor-clinical-psych copy pass.
```

---

## CI-23 — Arbor-Native Parent-Coaching Programs (unbranded structured tracks)
*slp lead (trademarked-program firewall) · peds (provenance + track-topic) · psych (claims) · all on claims*

### (1) Allowed provenance + allowed-copy
- **Provenance is substantiable:** *"a structured practice approach grounded in cited CDC/AAP/ASHA/WHO guidance"* — all four are free, public, citable research bodies; this is a mechanism/provenance statement, not an efficacy claim.
- **Mechanism-only framing (the ceiling) where a track touches communication/regulation:** *"daily back-and-forth and naming feelings is how young children build communication — these activities give you structured moments to do that"* (serve-and-return / responsive-interaction mechanism, no measured gain).
- Track naming: *"Arbor's Regulation Track"* / *"Arbor's Transition Track"* — Arbor's OWN, unbranded.

### (2) Banned strings / patterns (hard-block)
- **Branded / certification-gated program names — not in copy, citations, "further reading," or "inspired by/based on":** `Triple P`, `Incredible Years`, `PCIT`, `Hanen` (incl. *It Takes Two to Talk* / *More Than Words* / *TalkAbility*, OWL / 3A's method), `ESDM`, `DIR`/`Floortime`, `Zones of Regulation`, `Orton-Gillingham` (O-G). **The citation/reference list is part of the firewall** — clinical-lead reviews references, not just body copy; no branded program's *evidence base* may appear as a reference.
- **Effect-size / efficacy claims:** `reduces tantrums`, `reduces meltdowns`, `improves regulation`, `improves emotional regulation`, `improves language/speech`, `builds emotion vocabulary`, `clinically proven`, `therapy`/`therapeutic`. (slp: "emotion literacy" sits inside the Regulation track but is still a *language* target — apply the no-effect lint to language/speech/communication/vocabulary nouns; do not treat it as exempt.)
- **Why (slp/psych basis):** each branded program is certification-gated, fidelity-dependent, and (for Hanen/ESDM/DIR/O-G) SLP/clinician-delivered — invoking the name implies the evidence without the delivery conditions that produced it, which is a validity misrepresentation independent of the trademark/IP issue, and (Hanen/ESDM/DIR/O-G) positions Arbor inside ASHA-reserved assessment/intervention scope. Confirmed against the Held/Not-Built veto (L2076).

### (3) Thresholds / windows + cited basis
- **Track-topic guardrail (peds):** name the *behavior/situation*, not a condition-noun. Transition track → *"settling at drop-off" / "easing separations" / "school-entry transitions,"* **never "separation anxiety"** (the word risks reading as Separation Anxiety Disorder). Regulation track → *"meltdown de-escalation"* is fine as behavior language; never *"emotional dysregulation"* (clinical term).
- **NET-NEW referral rail (slp, binding):** tracks touching communication will surface real concerns ("my 2-yr-old barely talks"). Add a non-diagnostic speech/language referral rail — **reuse CI-25's "worth raising with your pediatrician or an SLP" string; do not invent a new one and do not auto-fire it** (surface as available guidance). Reference windows (ASHA/CDC public norms): few/no words by ~18m; <~50 words or no two-word combos by 24m; ~75% intelligible to unfamiliar listeners by 3, near-fully by 4. **Flag (thin/variable):** these numbers drive a referral prompt and vary modestly across sources — clinical-lead **verifies each numeric threshold against the live ASHA/CDC page** before any rail copy ships (source-of-truth check, identical to CLI-05 jurisdiction-currency discipline).

### (4) Success-metric framing constraint
Primary metric = **D60 retention uplift** (enterers vs non-enterers) + **parent reports a strategy working / fewer repeat consults**. Modules-completed is tracked but is **NOT** the primary metric and may **never** be used as an efficacy proxy (modules-completed → "the program works" is an unsubstantiated effect claim). Hold verbatim from spec L1972/L1974.

### (5) Required output-screen / test hooks
- If the coach AI free-writes any session-reference string ("last week you observed X — this week try Y"), route it through `screenModelOutput`; confirm the `CONDITIONS` regex catches condition leaks on the coaching path.
- Build-time lint: branded-program token list (incl. method-specific phrases like "Observe-Wait-Listen") across scripts **and** citations; effect-verb proximity lint on language/speech/communication/vocabulary/regulation nouns → flag for clinical-lead.
- arbor-safety COPPA review on the observation-event write path (each session's observation task feeds the child record).

### Verdict
```
soundness: concerns
claims: substantiated (provenance) | UNSUBSTANTIATED if any branded name or effect string appears
riskClass: gated
required_fixes: [no branded program in copy OR citations; no effect-size claim; behavior-noun not condition-noun (no "separation anxiety"); add CI-25 referral rail (verify ASHA/CDC numbers live); success metric = retention + parent-report, never modules-as-efficacy; clinical-lead reviews every track script + reference list]
cited_basis: [CDC LTSAE; AAP Bright Futures middle-childhood; ASHA SLP Scope of Practice + public developmental norms; WHO milestones; branded programs = trademark/certification-gated]
build-ready when: every track script + citation list clears arbor-clinical-lead, the referral-rail numbers are source-verified, and arbor-safety clears the observation write path.
```

---

## CI-24 — FeelingsLab Personalized Emotion-Regulation Layer
*psych lead · peds (anxiety-drop + surveillance) · slp (emotion-vocab leak) · arbor-safety co-sign*

### (1) Allowed emotion-UI + pattern-view language
- **Child-facing (generic categories only — the spec six):** *"How are you feeling right now?"* → **happy / sad / angry / scared / confused / silly.** Warm, concrete, first-person; **no intensity scale shown to the child.** (slp: include an icon/visual selection path so a minimally-verbal / late-talking child isn't excluded or implicitly flagged.)
- **Parent-side regulation-pattern view (timeline, never score):** *"What [child] named, and what helped"* · *"Strategies that have worked before with [child]"* (personalized, ranked by the parent's own "this worked" signal — a mechanism description) · *"[child]'s emotion check-ins over time"* (a timeline, explicitly not an intensity chart) · *"Co-regulation comes first"* on every strategy card (the parent does it *with* the child; the app never soothes the child directly).
- Spec-anchored allowed line: *"coping strategies from what's worked before with [child]" / "emotion-coaching grounded in co-regulation research."*

### (2) Vetoed UI / pattern language (hard-block)
- **Zones of Regulation** in any form: 4-color/zone curriculum, "blue/green/yellow/red zone," "which zone are you in," "zones check-in" — trademarked + Held/Not-Built veto. Never in UI, citation, or "inspired by."
- **Anxiety-as-metric (dropped entirely):** `anxiety tracker`, `anxiety score`, `anxiety trend`, `anxiety risk`, `anxiety level`.
- **Intensity-as-verdict:** any 1–N intensity *shown to the child*, any "intensity score," any **trend-chart of emotion intensity**, any "[child] is getting more anxious/angry" inference. (Internal intensity+duration data may exist solely to fire the one routing rule below; it is **never rendered** as a child- or parent-facing trend surface.)
- **slp emotion-vocab leak:** the pattern view trends **parent-logged co-regulation outcomes**, never the child's emotion-word count/range (that becomes an implicit expressive-language metric). No "improves emotional vocabulary" claim.
- **Effect claims:** `reduces anxiety`, `improves emotional regulation`, `clinically proven coping`, `calms your child`.

### (3) The escalation-copy pattern (EXACT — the most safety-sensitive surface)
**Design law: fires once, routes outward, never recurs, never becomes a chart.**

**Exact copy (fires once):**
> *"Over the past few weeks you've logged [child] feeling [scared/sad] strongly and often. That can be completely normal — and it can be worth bringing up with your pediatrician or a child mental-health professional next time you talk to them. You know [child] best."*

Constraints baked into that string: non-pathologizing (names the *observed pattern*, not a condition — no "anxiety"/"depression"/verdict), **normalizes first** ("can be completely normal"), routes to a **real provider** (parent-mediated, outward), affirms parental authority ("you know [child] best"). It is a conversation-starter — the CDC/AAP surveillance posture.

**Threshold shape (set by arbor-clinical-psych — a conservative routing heuristic, NOT a clinical cutoff):**
- **Two conjoint conditions, AND'd** (intensity AND duration, never intensity alone):
  - *intensity:* child names a distress emotion (scared/sad/angry) at the **high end** of the internal-only intensity capture, **and**
  - *duration/persistence:* that high-intensity distress recurs across **≥3 distinct sessions spanning ≥2–3 weeks**.
- **Single-day spikes never fire.** Deliberately tuned to **under-fire** (a missed nudge is recoverable; a false alarm pathologizes a normal phase). Thresholds live in **config** so the board can tune them; they are **never exposed in copy** as if a diagnostic line.

**Once-only display rule (binding):**
- Displays **exactly once per pattern-episode**, then dismissed and **does not re-arm** unless the parent acts/dismisses AND a new, clearly distinct pattern-episode forms after a board-defined cool-down (**≥90 days**). No recurring banner, badge, counter, or "still elevated" re-prompt.
- **Never** spawns an anxiety trend view, risk score, or repeated alert.

### (4) Why psych + safety; attachment-safe rationale
This is the only surface where a **child** inputs **emotional/mental-health-adjacent data** AND a persistent-distress pattern could misread as an anxiety signal — psych (pathologizing/framing risk) + safety (COPPA child-data event) **co-sign**. Matches product CLAUDE.md safety triggers (persistent distress → route to a professional, never label, never diagnose). **peds confirms dropping anxiety tracking is correct** — a per-child anxiety inference (score/trend/risk, and an unlabeled intensity-over-time line *is* an anxiety-trend proxy) is a screening / medical-device-adjacent surface (EU MDR Rule 11 / FDA SaMD class, Cognoa precedent, L2073); the single-fire surveillance nudge is the correct AAP pattern. **Attachment-safe rationale for generic naming over a zone curriculum:** (a) plain-word affect-labeling ("name it to tame it") is evidence-aligned and transfers off-screen through the parent; a closed 4-color zone vocabulary routes the child's emotional language through the app's system, not the parent (kid-companion drift); (b) generic categories *describe*; a zone system implicitly *classifies and ranks* states (red = the "bad" zone) → a regulated/dysregulated verdict on a child, the opposite of the non-pathologizing stance; (c) the personalization moat is attachment-positive *only because* it routes through the parent — it hands the parent back strategies they already logged as working.

### (5) Required output-screen / test hooks
- Bind the personalized strategy text and any model-authored pattern-view summary to **`screenModelOutput`**; confirm the `CONDITIONS` regex covers `anxiety`, `anxiety disorder`, `depression`, `depressed` as label-leaks on these routes; add the test.
- Emotion check-in is a child-data event → **arbor-safety COPPA review** on the write path.
- Build-time assertion: the pattern view has **no intensity-aggregation / chart** code path and **no emotion-word-count aggregation**; the escalation component has a once-only/cool-down guard with a test that a second pattern inside the cool-down does **not** re-fire.

### Verdict
```
soundness: concerns
claims: none
riskClass: gated
required_fixes: [generic 6-emotion UI only, no zones, no child-facing intensity; anxiety surface fully dropped; intensity internal-only, never charted; fire-ONCE escalation copy verbatim with intensity+duration AND-threshold (config, conservative) + >=90d cool-down; bind screenModelOutput + anxiety/depression CONDITIONS + test; pattern view trends co-reg outcomes not emotion-word count; AAC-friendly icon path]
cited_basis: [CDC LTSAE social-emotional milestones; AAP surveillance; affect-labeling co-regulation literature (mechanism, back-end); EU MDR Rule 11 / FDA SaMD on per-child anxiety inference (drop rationale)]
build-ready when: required_fixes are in the actual UI/strings, the escalation guard is implemented + tested, output-floor is green, and arbor-clinical-psych + arbor-safety co-sign.
```

---

## 2. Build-pod checklist (cross-item, copy-paste into the wave)

- [ ] **No condition name** anywhere (string/label/tooltip/empty-state): ADHD, attention deficit, processing disorder, executive dysfunction, autism, anxiety/anxiety disorder, depression, language delay, dyslexia, "delayed/behind/at-risk."
- [ ] **No score/rank/percentile/verdict** about the child on any developmental/EF/emotion domain.
- [ ] **No branded program** (CI-23) in copy OR citations/"further reading."
- [ ] **No Zones** 4-color/zone vocabulary (CI-24).
- [ ] **No effect-size verb** on a child capacity (improves/builds/boosts/trains/strengthens/develops/reduces) — mechanism only.
- [ ] **Firewall:** "developmentally informed, grounded in CDC/AAP/ASHA/WHO" — never "clinical/clinically validated/clinician-reviewed/assesses/screens/evaluates"; no adviser/thinker identity.
- [ ] **Output-floor:** every AI-authored string on these surfaces passes `screenModelOutput` with the per-item `CONDITIONS` extension + a passing test in `safety/outputScreen.test.ts`.
- [ ] **CI-22:** age-7 provider-routing floor; descriptive-only flexibility copy; graduation = without-prompt×3, never lessons/minutes/streak; observation logs action not comprehension.
- [ ] **CI-23:** referral rail added (reuse CI-25 string; ASHA/CDC numbers source-verified live, not recalled); behavior-noun not condition-noun ("settling at drop-off," never "separation anxiety"); success = retention + parent-report.
- [ ] **CI-24:** anxiety surface fully dropped; intensity internal-only (no chart); fire-once escalation verbatim + ≥90d cool-down + test; AAC-friendly icon path.
- [ ] **arbor-safety COPPA** review on every new child-data write path (CI-23 observation event; CI-24 emotion check-in).

## 3. Status + routing
All three remain **GATED**. This spec is the **bar**; build-ready requires the *actual copy/strings to exist and pass a final board review*. Routed through `arbor-orchestrator` as front-loaded clinical requirements (CEO decision #4) — they sit in Phase 2 (CI-22, CI-24) / Phase 3 (CI-23) and do not enter a build wave until the store track ships (CEO decision #1) and these gates are lifted to `soundness: pass` on the real strings.

**Cited basis (consolidated):** CDC "Learn the Signs. Act Early." 2022 milestone revision (Zubler et al., *Pediatrics* 2022 — checklists 2mo–5yr only); AAP developmental surveillance-vs-screening (Lipkin/Macias 2020); ASHA Scope of Practice in SLP + public developmental norms; WHO milestones; EU MDR Rule 11 / FDA SaMD (per-child condition-inference = medical device, Cognoa precedent); advisory.md §0 / CHARTER §3 p11 (firewall). Inhibitory-control trajectory + Diamond/Barkley + affect-labeling literature = back-end mechanism only, never surfaced.
