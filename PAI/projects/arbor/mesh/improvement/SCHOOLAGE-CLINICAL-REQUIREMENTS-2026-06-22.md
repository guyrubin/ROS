# School-Age (7–10) Clinical Requirements + Substantiation Packet — 2026-06-22

**Author:** `arbor-clinical-lead` (Clinical Advisory Board), coordinating `arbor-clinical-peds` / `-slp` / `-psych`.
**Mode:** **PROPOSE-ONLY.** This packet *originates* clinical requirements and substantiates them with cited public guidance so the Product Council can turn **SA1–SA6** (the missing school-age 7–10 track) into build-ready items. The board owns no code; these are **requirements + specs**, not edits. No build, no deploy.
**Source intent:** `arbor-product-elevation-plan-2026-06-21.md` §3B (SA1–SA6). App root: `C:\Users\dguyr\ROS\.arbor-build\app`.
**Precedent:** mirrors the format + register of `CLINICAL-SIGNOFF-2026-06-21.md` (CI-04 surfacing register · CI-08 honesty string · CI-01 parent-opened, non-push rule).

---

## 0. The binding frame (read first)

- **CDC "Learn the Signs. Act Early." STOPS at age 5.** The 75th-percentile discrete-milestone checklist construct `src/lib/milestoneData.ts` is built on (it hard-stops at `ageMonths: 66`, the "Age 5-6" band) **does not exist for 7–10.** Porting that mental model into this band would be a fabrication. 7–10 expectations come from **AAP Bright Futures (middle childhood, the 6/7/8/9/10y health-supervision visits)**, **ASHA** (literacy / spoken-language role), academic-readiness frameworks (ORF norms, Simple View, Scarborough, Chall), and **named developmental researchers** (Diamond, Erikson, Selman, Bowlby/Ainsworth).
- **Middle childhood is domains-and-competencies, not a checklist.** This band tracks *broad developmental-surveillance domains and observable competencies* over time, never a "by age 8 your child should…" pass/fail list. Every 7–10 item ships in the register *"most children around this age are usually… — a good thing to notice,"* never *"your child should."*
- **Surveillance, never diagnosis.** Every item surfaces an **observable behavior/competency**, never a **condition**. Banned as a verdict or screen target at every SA surface: ADHD, learning disability, dyslexia, reading disorder, anxiety / anxiety disorder, school refusal, social-skills deficit, "delayed," "behind," "below grade level," "disorder," "at risk for." These are clinician diagnoses arrived at with validated instruments — **not Arbor outputs.**
- **G2 (claims).** Mechanism cited, never an effect size, never "proven/validated/clinically validated." No claim that any Arbor activity *improves/trains/boosts* reading, EF, math, or wellbeing.
- **Firewall (advisory.md §0).** All copy is **"developmentally informed, grounded in CDC/AAP/ASHA"** — never "clinically validated," "clinician-reviewed," or "clinician-approved." No adviser/thinker identity anywhere. Arbor's reviewers are not licensed clinicians and are never presented as such.
- **Parent-mediated, never a kid companion.** Every SA surface points the parent AT a real-world activity (read-together, a homework routine, a conversation after a hard day). The coach speaks to the **parent**. The single hardest design risk in this band is the **unobserved school** (the parent isn't in the room) creating a pull to have Arbor *infer the child's internal state* — that is both pathologizing and kid-companion drift, and is a **recommend-veto** (see SA6).
- **EU-MDR read** is required before any **clinician-facing summary**, any **percentile/score-as-result**, and the whole **SA6 anxiety/withdrawal/mood cluster** ships — surfacing those patterns with a referral function sits near the medical-device boundary. That read is the lead's call, flagged per item below.

---

## 1. Board verdict (the gate, per requirement)

| Req | Title | soundness | claims | riskClass | Ship line |
|---|---|---|---|---|---|
| **SA1** | Middle-childhood surveillance domains 7–10 | **pass** | none | safe (display) | **substantiated** — ships; one guardrail (no percentile/"behind" verdict) |
| **SA2** | Reading fluency + comprehension | **pass (conditional)** | none / **UNSUBSTANTIATED if WPM-as-score** | gated (norm display) | **split** — mechanism + behavior signals ship; WCPM-percentile-as-score / dyslexia label → gated, EU-MDR |
| **SA4** | Numeracy / early math | **pass** | none | safe (content) | **substantiated** as content; any "math delay" verdict → gated |
| **SA5** | Executive function / homework support | **pass** | none / **UNSUBSTANTIATED if "improves EF"** | safe (coaching) | **split** — Diamond-cited mechanism + scaffolding ship; EF score / "improves EF" / ADHD naming → gated |
| **SA6** | School social-emotional | **pass (conditional) / concerns** | none on the mechanism; **gated on every anxiety/withdrawal/mood string** | gated (clinical-lead) | **mechanism ships; SR5/SR6/SR7 cluster gated, EU-MDR + lead string sign-off; inference-of-child-state = recommend-veto** |

> **No clinical VETO issued in this packet** — every item is a buildable surveillance/coaching requirement with the labels and scores fenced off. **One veto trigger is flagged** (SA6: any design that infers the child's internal state, or any kid-direct/parent-blame framing). The SA2 WPM-percentile-as-score and the SA6 anxiety/mood cluster are **HELD as `gated`** until their on-screen strings/displays match these specs and the EU-MDR read clears the clinician-facing/score surfaces — identical handling to an `arbor-safety` block, routed through `arbor-orchestrator`.

---

## SA1 — Middle-childhood developmental expectations as non-diagnostic surveillance
*(lens: peds, lead — with psych on the SEL domain)*

**Requirement (one line).** For 7–10, Arbor surfaces **broad developmental-surveillance domains and observable competencies** (school adjustment, peer relationships, growing independence/self-responsibility, emotional regulation, communication, health/motor habits) framed as *"things worth noticing and talking about,"* never an age-pegged milestone checklist with a hit/miss verdict. **DevScore (`growth/devScore.ts`) is age-open and lights up the instant this set extends** — so the keystone is *what data we add and in what register*, not new code.

**Mechanism + source.** AAP **Bright Futures 4th ed., Middle Childhood (5–10y visits):** developmental surveillance is a continuous, collaborative observation of the child's developing abilities across the **Self / Family / Friends / Community / School** domains, with anticipatory guidance — explicitly a *domains-and-competencies* model, not a discrete milestone-attainment model. Middle childhood is the period where school performance, peer/social competence, and growing self-responsibility become the central developmental tasks. (Bright Futures Middle Childhood Tools; brightfutures.org developmental-surveillance curriculum.) Mechanism only.

**Mapping to Arbor's existing six domains (no new domain needed).**
| Bright Futures middle-childhood domain | Observable competency Arbor may surface (parent-mediated) | Arbor domain |
|---|---|---|
| School adjustment / academic performance | "generally follows classroom routines and completes schoolwork at a level that works for them" | `cognition_executive_function` |
| Peer relationships | "has one or more friendships; takes turns, shares, navigates everyday disagreements" | `social_development` |
| Self-responsibility / independence | "takes on age-appropriate responsibilities — packing a bag, simple chores, some self-care decisions" | `independence_adaptive_skills` |
| Emotional/behavioral self-regulation | "increasingly manages frustration, calms down, bounces back from disappointment" | `attachment_regulation` |
| Social/school communication | "holds a back-and-forth conversation, explains events, follows multi-step directions" | `language_communication` |
| Physical activity / health habits / motor | "active and coordinated in everyday play, sport, handwriting; sleep/activity routines" | `sensory_motor_patterns` |

**Surveillance framing.** Surface the **observable competency** in the *"usually / worth noticing"* register. Never *"by age 8 your child should…"*, never a numeric/percentile "where your child ranks," never a named condition as target or result.

**When-to-refer.** A calm *"worth raising with your pediatrician or your child's teacher"* prompt fires **only** on a **persistent, cross-setting, or regression** pattern (Bright Futures surveillance logic): persistent struggle with schoolwork/reading despite support; the **teacher** raising concerns across settings (cross-informant is the key signal, not one rough week); a child who has lost previously-held skills or social connections; persistent sadness/withdrawal; any parent worry that won't settle. *"It's not a diagnosis, it's a conversation worth having."*

**Status.**
- **Substantiated (ships in user copy):** the six-domain observable-competency surveillance prompts + the surveillance-not-checklist framing + the cross-setting/persistence/regression referral prompt.
- **Gated (EU-MDR read):** any numeric/percentile "where your child ranks," any reproduction of a named clinical screening instrument (Vanderbilt/SDQ/BASC) or its scoring, any condition named as a screen target or result. **Guardrail (binding):** confirm `devScore.ts` does **not** render a 7–10 "behind"/percentile verdict when the milestone set extends.

**cited_basis:** AAP Bright Futures 4th ed. — Middle Childhood (5–10y) developmental-surveillance curriculum; Bright Futures Middle Childhood Tools (aap.org / brightfutures.org).
**Honesty flag:** there is **no** authoritative discrete 7–10 milestone checklist — copy must be explicit this band is domains/competencies, not pass/fail. The cross-setting/persistence referral threshold is a defensible clinical convention, **not** a validated cutoff — keep it "worth a conversation."

---

## SA2 — Reading fluency + comprehension (learn-to-read → read-to-learn)
*(lens: slp, lead)*

**Requirement (one line).** The 7–10 reading track must move past decoding (where `src/practice/literacy.ts` stops) to **fluency + comprehension**, surfacing *both* a fluency signal **and** a meaning signal — because reading comprehension = decoding × language comprehension (Simple View), so fluency alone is insufficient. Arbor measures **practice accuracy/behavior in a game, not a standardized reading assessment** — same scope-honesty lesson as CLI-04 (trend, never a score).

### SA2.1 — The decoding → fluency/comprehension shift
**Mechanism + source.** Automaticity frees working memory for comprehension — as decoding becomes automatic, cognitive resources move from sounding-out to meaning (**LaBerge & Samuels, 1974**). **Simple View of Reading** = decoding × language comprehension (**Gough & Tunmer, 1986**; named in ASHA's SLP-literacy policy). **Scarborough's Reading Rope (2001)** as the content map; **Chall's Stages (1983)** Stage 2 (fluency, ~gr 2–3) → Stage 3 (reading-to-learn, ~gr 4–8). Mechanism only.
**Surveillance framing.** "Reading is shifting from *sounding out* to *reading for meaning* — here are read-together challenges that grow with your child." Show the *behavior* ("retold the story in their own words," "read the line smoothly"), never a condition.
**Status:** **substantiated** (ships as a track rationale, not a benefit claim).

### SA2.2 — Fluency signal (WPM / WCPM) with cited ranges
**Mechanism + source — Hasbrouck & Tindal 2017 ORF norms** (compiled DIBELS/easyCBM; grades 1–6; 10/25/50/75/90th percentiles). WCPM = words read correctly in one minute on an *unpracticed grade-level passage*. **50th-percentile WCPM (verified, spring anchor):** G2 ≈ 100 · G3 ≈ 112 · G4 ≈ 133 · G5 ≈ 146 · G6 ≈ 146. Use **only as labeled "typical readers around this grade often land near…" context**, with a visible caveat that these are reference norms, **not an Arbor measurement and not a grade**. Arbor's own rate (if shown at all) is a *practiced-passage* number — it **inflates** vs the unpracticed norms and **must never be plotted on top of the percentile bands as if comparable**. Pair with **prosody/expression** and **inference/retell** as the comprehension signals (Simple View requires the meaning signal alongside rate).
**Surveillance framing.** "On today's read-together, your child read this passage smoothly / with expression / paused to fix mistakes." Trend as a gradient. **Never** "your child reads at the 30th percentile," **never** "below grade level."
**Status — split:**
- **substantiated:** naming the Hasbrouck & Tindal norms as *general context*; surfacing reading *behaviors* (smoothness, expression, retell).
- **GATED (EU-MDR read):** computing/showing a **WCPM percentile as a child score**, mapping Arbor's practiced rate onto the ORF bands, any "reading age / grade-equivalent." Assessment claim → clinician-facing/score surface, HELD until cleared.

### SA2.3 — The surveillance-vs-clinical line
**Mechanism + source — ASHA "Roles and Responsibilities of SLPs With Respect to Reading and Writing"** supports *identifying children at risk* and *fostering* literacy via referral/assessment by qualified professionals — it does **not** license a consumer app to label. ASHA **Written Language Disorders** practice portal is the clinician-diagnosis boundary; Arbor sits *before* that line.
**When-to-refer.** A **persistent plateau across the whole age window** (months of no movement in fluency *and* comprehension, AND parent/teacher concern) → *"worth discussing with your child's teacher and pediatrician, or a reading specialist or SLP."* Never auto-fires on a bad day or one game; the normal-variation caveat in the same breath. Every surface anchors to **shared book-reading** — the app points AT reading *with* the child, never replaces it.
**Status — split:**
- **substantiated:** the persistent-trend, behavior-level "worth discussing" nudge + referral copy.
- **GATED / banned in user copy:** "dyslexia," "reading disorder," "delayed," any "dyslexia screen," any percentile-as-result, any effect-size/"proven" → EU-MDR + clinical/safety sign-off.

**cited_basis:** Hasbrouck & Tindal (2017) *An Update to Compiled ORF Norms* (Tech Report 1702; via Reading Rockets fluency-norms chart); Gough & Tunmer (1986) Simple View; Scarborough (2001) Reading Rope; Chall (1983) Stages of Reading Development; LaBerge & Samuels (1974) automaticity; ASHA *Roles & Responsibilities… Reading and Writing* (PS2001-00104) + *Written Language Disorders* portal.
**Honesty flags:** the "fourth-grade slump" is contested/uneven (stronger in lower-income/EL samples) — copy may name "the shift around grade 3–4" but **must not** assert it as a guaranteed event. Arbor's in-game rate is a *practiced-passage* number, **not** comparable to unpracticed-passage ORF norms — never overlay them.

---

## SA4 — Numeracy / early math (developmental sequence + surveillance line)
*(lens: peds, lead — flagged for council; this is academic content, not a clinical instrument)*

**Requirement (one line).** Numeracy may ship as **parent-mediated academic content sequenced to the normal developmental progression**, with the same surveillance-not-diagnosis discipline as reading — Arbor may surface a *persistent practice-accuracy trend* as "worth discussing," but may **never** issue a math-delay / dyscalculia verdict or a percentile-as-score.

**Mechanism + source.** The normal developmental sequence is well-established and academic-curriculum-public: **number sense / subitizing / counting → number-fact fluency (addition/subtraction) → place value & multiplicative reasoning → multi-step word problems** (consistent with NCTM/Common Core grade progressions and developmental-numeracy literature, e.g. the number-sense-as-foundation account). Mechanism/sequence only — **no claim Arbor's math content improves outcomes, no effect size, no "proven."** A "math delay"/dyscalculia determination is a clinician/educational-psychologist diagnosis with validated instruments, not an Arbor output.

**Surveillance framing.** Sequence the content (number sense → fluency → place value/multiplication → word-problems-as-quests, tied to the story, "do one at dinner"). Surface the **behavior** ("counted on confidently," "found two-digit addition tricky over several sessions"), never a condition. Frame onset/variation as a gradient.

**When-to-refer.** A **persistent practice-accuracy plateau across the window**, AND parent/teacher concern → *"worth raising with your child's teacher and pediatrician."* Cross-setting/persistence is the threshold; never a single low session.

**Status.**
- **Substantiated (ships):** the developmental-sequence framing + the content + the behavior-level "worth discussing" trend prompt.
- **Gated (EU-MDR read):** any math **percentile-as-score / grade-equivalent**, any "math delay"/"dyscalculia" naming, any "improves math" efficacy claim.

**cited_basis:** NCTM / Common Core grade-level numeracy progressions (public academic-readiness frameworks); developmental number-sense literature (number sense as the foundation for arithmetic fluency).
**Honesty flag:** the *sequence* is robust; specific grade-by-grade "should" cutoffs vary by curriculum/jurisdiction (NL/IL differ) — ship as a *progression to follow with your child*, never a jurisdiction-pegged "behind."

---

## SA5 — Executive function (planning / working memory / attention / task-initiation / self-monitoring) + homework support
*(lens: peds, lead)*

**Requirement (one line).** Arbor may help parents **support and notice** everyday executive-function behaviors in homework and daily routines, framed as *normally still-developing skills* a parent can scaffold — never as a deficit screen.

**Mechanism + source — Adele Diamond, "Executive Functions," *Annu Rev Psychol* 2013 (PMC4084861).** Three core EFs — **inhibitory control, working memory, cognitive flexibility** — from which planning/reasoning/problem-solving are built. EFs depend on the **prefrontal cortex** (dorsolateral PFC for working-memory manipulation), and PFC maturation is **protracted and asynchronous** into adolescence: inhibitory control keeps refining, working memory improves gradually, cognitive flexibility emerges latest (~ages 7–9). **Implication:** at 7–10 these systems are *still under construction* — a child who struggles to start, hold instructions, or shift tasks is showing **immaturity of a developing system, not a defect.** This complements Bright Futures' middle-childhood emphasis on school performance. Mechanism only — **no effect size, no "improves EF," no claim any Arbor activity trains EF.**

**Surveillance framing.** Surface the **observable behavior**, never the condition: *"Around this age, the brain's 'self-management' skills — planning, remembering instructions, getting started, checking your own work — are still developing and grow a lot over these years."* Homework copy stays in scaffolding register (break tasks into steps; externalize working memory with checklists/visible timers; support task-initiation with routines) — *help the child practice the skill*, normal variation. **Never** "your child may have ADHD / an attention disorder / an executive-function disorder."

**When-to-refer.** A *"worth discussing with your pediatrician or teacher"* prompt when EF-type difficulties are **persistent, cross-setting, and functionally impairing** — the protracted-development account means transient struggle is expected, so the signal is *durable + multi-setting + impairing*: the **teacher** independently reports attention/organization/learning concerns; difficulties at home **and** school; persistent inability to keep up despite reasonable support; loss of previously-held ability. *"If a teacher is also noticing this across the school day, that's a good cue to talk with your pediatrician — it's a conversation, not a diagnosis."*

**Status.**
- **Substantiated (ships):** the Diamond-cited EF mechanism, the "still-developing self-management skills" homework framing, the scaffolding tips, the cross-setting/persistence referral prompt.
- **Gated (EU-MDR read):** any EF "score," any "improves/trains/boosts EF" claim, any reproduction of a clinician EF/attention rating scale, any text naming ADHD or an EF disorder as a target or result.

**cited_basis:** Diamond A. "Executive Functions." *Annu Rev Psychol.* 2013;64:135–168 (PMC4084861); AAP Bright Futures middle-childhood school-performance surveillance.
**Honesty flag:** the cross-setting/impairment referral threshold is a defensible clinical convention, not a validated cutoff — keep it "worth a conversation," never a determination.

---

## SA6 — School social-emotional (friendship, anxiety, resilience, belonging, fairness)
*(lens: psych, lead — co-held with arbor-safety on the escalation branches)*

**Requirement (one line).** SA6 reuses the existing hero-metric + dilemma + `NON_DIAGNOSTIC_CONTRACT` coaching spine at a **school register**, surfacing the **observed situation** (a hard week with friends, worry about school, a fairness conflict) reflected back to the **parent**, coaching the parent as the child's **secure base** — never a condition, never parent-blame, never kid-direct.

**The six developmental sub-requirements (mechanism → framing → status):**

| # | Sub-req | Mechanism + named source | Framing | Status |
|---|---|---|---|---|
| **SR1** | Industry vs inferiority (the spine) | **Erikson** stage 4 (~6–11y): competence/mastery via productive activity + peer comparison; chronic shortfall → inferiority (*Childhood and Society*, 1950). AAP Bright Futures middle-childhood milieu. | Coach the parent to notice/name effort + mastery the child *shows*, never score the child. The hero-metric = competence the child is building, never a leaderboard. | **substantiated** (frame ships) |
| **SR2** | Friendship / perspective-taking | **Selman** stages of friendship & social perspective-taking — momentary → reciprocal (~7–10) → intimate (*The Growth of Interpersonal Understanding*, 1980). *Descriptive theory, not a calibrated instrument.* | Calibrate dilemmas to where the child is; coach the parent to help the child take the other's view (normal, still forming). Never "lacks social skills." | **substantiated** as a frame; **gated** if Selman is rendered as a per-child *stage score* |
| **SR3** | Social comparison & self-concept | Self-concept becomes comparative/trait-based in middle childhood (developmental-psych consensus; consistent with Erikson 4 + Bright Futures SEL). | Anchor the child to *personal* progress/effort over peer ranking. **Design guard:** Arbor's own metric/streak surfaces must **not** become a comparison engine. | **substantiated** frame; the "no comparison surface" point is a **design constraint for the council** |
| **SR4** | Attachment as secure base | **Bowlby/Ainsworth** secure-base/safe-haven — the child explores the unobserved peer world more confidently with a responsive caregiver to return to (Bowlby 1969; Ainsworth 1978). | The product is the parent's tool for being the steady home base after a hard day. **Never** the child's confidant; **never** a parent-blame causal story. | **substantiated** as the parent-mediated frame; **recommend-veto** on any kid-direct or parent-blame design |
| **SR5** | Normative worry vs impairing anxiety | Worry/fears are developmentally normal; the meaningful line is **persistence + functional impairment** (AAP/Bright Futures surveillance — observe pattern + impact, route, don't label). | Reflect the parent's **own** observation ("you mentioned this week's been full of worry about school") — behavior/situation, never "anxiety"/"anxiety disorder"/"school refusal." | **GATED** (EU-MDR + lead verbatim string sign-off) |
| **SR6** | Withdrawal / sustained exclusion / bullying | Peer rejection, chronic exclusion, bullying = recognized risk contexts; standard Bright Futures surveillance topics. | Surface the observed pattern reflected back, behavior-only. **Two-tier route** (below). | **GATED**; safety branch wires to the **existing** escalation path |
| **SR7** | Marked change / regression in mood/behavior | A distinct change from the child's **own baseline** (sleep/mood/engagement/school) is a recognized "worth-checking" signal (extends CI-04 loss-of-skills logic to the school-age behavioral baseline). | Reflect the parent's before/after observation ("used to love going, now dreads it"); never "regression"/"deterioration"/"mood disorder." | **GATED** |

**When-to-refer + route (the psych lens's responsibility).**
- **Non-emergency → pediatrician or school counselor:** SR5 (worry *persistent over weeks AND impairing* — not going to school, not sleeping, withdrawing from things they used to enjoy); SR6 (sustained exclusion / a child markedly pulled back over weeks — counselor is the right first call for peer-environment issues); SR7 (marked change → "worth a call in the next little while"). Register identical to CLI-04 — *"worth a calm conversation,"* never a verdict. **These do NOT enter the crisis-escalation path.**
- **Existing safety-escalation path** (`screenForImmediateEscalation` / `escalation.ts`, CI-05-verified, leads with 112/911/101/100 + crisis lines): **only** the safety-signal branches — bullying involving threats/physical harm, self-harm ideation, or hopelessness in parent or child.

**Status / the binding holds.**
- **Substantiated (ships):** SR1/SR2/SR4 developmental *frames* (Erikson/Selman/Bowlby-Ainsworth as parent-facing framing, never a per-child score) + SR3 design guard.
- **GATED — HELD (EU-MDR read + clinical-lead verbatim string sign-off):** the entire **SR5/SR6/SR7 anxiety / withdrawal / mood-change cluster.** On-screen strings must be approved exactly as CI-04 was — verbatim, banned-string-checked, **HE flagged for human translation** (Hebrew carries loaded terms — חרדה / רגרסיה must never appear as a parent-facing verdict). Inherit the CI-08 honesty string at equal visual weight at every SA6 surface.
- **Recommend-VETO trigger (flagged for the lead/council):** any design where (a) the child talks to Arbor directly about peers/feelings (kid-companion drift), or (b) Arbor **infers the child's internal state** from logs ("your child seems anxious"), or (c) any parent-blame attachment narrative. The unobserved-school gap must be answered by **strengthening the parent as secure base + reflecting the parent's own observation**, never by Arbor inferring the child's state or inserting itself into the gap.

**Reuse, don't reinvent.** SA6 rides the existing `NON_DIAGNOSTIC_CONTRACT` + `developmentalFramework` plan prompt and the `screenForImmediateEscalation` pre-screen (live coaching path) — the school register is a `challengeTopic` + a calibrated dilemma set, not a new uncontracted path.

**cited_basis:** Erikson, *Childhood and Society* (1950) — Industry vs Inferiority; Selman, *The Growth of Interpersonal Understanding* (1980); Bowlby, *Attachment and Loss* (1969) + Ainsworth, *Patterns of Attachment* (1978) — secure base; AAP Bright Futures middle-childhood SEL / peer-relationship surveillance; internal precedent `CLINICAL-SIGNOFF-2026-06-21.md` (CI-04 register, CI-08 string, CI-01 non-push rule).
**Honesty flag:** Erikson/Bowlby/Ainsworth are canonical but *conceptual* (not effect-sized); Selman is *descriptive* (not a calibrated instrument) — ship as frames, never per-child scores. No prevalence numbers, no effect sizes anywhere in SA6 copy.

---

## 2. Cross-cutting notes for the Council + Orchestrator

- **Build/sequence dependency.** SA1 is the cheap keystone (data + register; DevScore extends free) and should land first; it carries the one guardrail (confirm no 7–10 percentile/"behind" verdict). SA2/SA4/SA5 ship their *substantiated* halves while the *gated* halves (WPM-percentile-as-score, math/EF scores + efficacy claims) stay HELD. **SA6 is the most gated** — the SR5/SR6/SR7 cluster cannot be build-ready until the EU-MDR read clears the surface and the lead signs the verbatim strings; the inference-of-state design risk is a standing veto trigger.
- **What this packet does NOT clear.** It substantiates *facts, mechanism, and copy register*. It does **not** clear the **procedural** gates: child-data capture/egress for any new tracking, the **EU-MDR read** for the score/clinician-facing/SR-cluster surfaces, and `arbor-safety` sign-off on the escalation wiring — those remain Guy/`arbor-safety` decisions, unchanged. This packet lifts only the **clinical soundness/claims** block for the substantiated items.
- **The on-screen strings are the gate.** Every flip to `soundness:pass` is **conditional on the diff matching these specs** — citations are the floor; the displayed copy must match them, with zero banned strings. Any diff that ships a percentile-as-score, a condition label, an effect-size, or an inferred child-state reverts to HELD.
- **HE everywhere.** All EN strings require **human** clinical translation — machine translation is unsafe for the non-pathologizing register.

**Board verdict (packet):** `soundness: pass (conditional on diffs; SA6 SR-cluster HELD) · claims: none on the substantiated set / UNSUBSTANTIATED on any score/efficacy/label surface · riskClass: SA1/SA4/SA5-core safe, SA2/SA5/SA6 gated surfaces HELD · required_fixes: per item above · cited_basis: AAP Bright Futures · ASHA · Diamond 2013 · Hasbrouck & Tindal 2017 · Simple View / Scarborough / Chall · Erikson / Selman / Bowlby-Ainsworth`. Routed to the Product Council as **build-ready-after-fixes** for the substantiated set; **HELD/gated** for the score, efficacy, and SR5–SR7 surfaces; **one recommend-veto trigger** standing (SA6 inference-of-state / kid-direct / parent-blame). No clinical veto outstanding.
