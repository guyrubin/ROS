# Clinical Sign-Off Packet — 2026-06-21

**Author:** `arbor-clinical-lead` (Clinical Advisory Board), coordinating `arbor-clinical-peds` / `-slp` / `-psych`.
**Purpose:** convert the council's HELD/concerns developmental items into **build-ready specs** by *fixing the evidence*, not bypassing the gate. Every flip target below is grounded in a real, cited public source (CDC 2022 "Learn the Signs. Act Early.", AAP/HealthyChildren.org, ASHA + Hustad 2021 JSLHR). The board owns no code; these are **specs**, not edits.

**Source intake:** `PRODUCT-BACKLOG.md` → "Council Intake — 2026-06-21 (full council…)". App root: `PPPPtherapy-/PPPPtherapy-/app`.

**Firewall (binding on every string below):** all copy is **"developmentally informed, grounded in CDC/AAP/ASHA"** — never "clinically validated," "clinician-reviewed," or "clinician-approved." No adviser/thinker identity appears anywhere. Arbor's reviewers are not licensed clinicians and are never presented as such (advisory.md §0).

**Honesty stance:** this packet substantiates *facts and copy*. A flip to `soundness:pass` is **conditional on the pod's diff matching these specs** — the citations are sound, but several items only clear once the on-screen code reflects them (called out per item). HE copy is **EN-approved, HE-flagged for human clinical translation** in every case — machine translation is not safe for non-pathologizing clinical register.

---

## Summary verdict table

| Item | Before | Flip target | Status |
|---|---|---|---|
| **CI-02 / CI-03** corrected age | concerns / none — HELD on diff | `soundness:pass / claims:none` | **build-ready-after-fixes** (peds-substantiated; pass on the actual diff) |
| **CI-04** honest red-flag layer | concerns / UNSUBSTANTIATED — HELD | `soundness:pass / claims:none` | **build-ready-after-fixes** (hard dep: CI-02/CI-03 land first) |
| **CLI-04** SLP referral timing | concerns / UNSUBSTANTIATED — HELD | `soundness:pass / claims:none` | **build-ready-after-fixes** (windows + honesty framing must match diff) |
| **CI-08** honesty surface | pass / none | `soundness:pass / claims:none` | **build-ready** (canonical string finalized below) |
| **CI-05** escalation currency | pass / none | `soundness:pass / claims:none` | **build-ready** (mechanism spec + fail-loud finalized) |
| **CI-01** weekly brief copy | pass / none (copy needs board) | `soundness:pass / claims:none` | **build-ready-after-fixes** (copy rules + skeletons approved; board signs final strings) |

> No clinical **VETO** in this packet. Every item is a fixable framing/wiring item, not a soundness rejection. Each remains `gated` by procedure (child-data / consent / crisis-copy category) and routes through `arbor-orchestrator` exactly like an `arbor-safety` clearance — the clinical block is what this packet lifts; the procedural gate to Guy is separate and unchanged.

---

## CI-02 / CI-03 — Preterm corrected age (the keystone dependency)

**Owner pods:** arbor-growth (CI-02 capture/display) · arbor-ai (CI-03 wire into monitoring). **Lens:** peds (lead), with psych on the badge copy.

### (a) Corrected / cited facts
- **Formula confirmed.** The correction is `(40 − gestationalWeeks)` weeks, converted to months, subtracted from chronological age. This is the AAP rule and is **already correctly implemented** in `correctedAge()` (`lib/milestoneData.ts` ~L316-332): `adjustmentWeeks = TERM_WEEKS(40) − gestationalWeeks`, `correctedMonths = chrono − adjustmentWeeks × (12/52)`. The day-form (corrected days = chrono days + GA days − 280) reduces to the same thing (280 days = 40 weeks). **No formula change needed.**
- **24-month ceiling confirmed.** AAP guidance is to correct for prematurity **until ~24 months** for developmental follow-up; `CORRECTION_CEILING_MONTHS = 24` (~L307) is correct. (Peds caveat, non-blocking: the longer up-to-36-month window in the very/extremely-preterm literature is a **growth-chart** nuance, *not* the milestone rule — do not copy the 24m ceiling blindly into any future growth-chart code, e.g. DEM-003.)
- **The bug (CI-03).** `deriveMonitoring()` (`lib/monitoring.ts` L181) sets `ageMonths = clampMonths(input.ageYears)` from **raw chronological age** and never calls the working corrected-age engine 150 lines away (`comparisonAgeMonths()`, `milestoneData.ts` L339). So a preterm infant is flagged "overdue" early against AAP corrected-age guidance — a manufactured false alarm.
- **Grace term confirmed as independent.** The 2-month `OVERDUE_GRACE_MONTHS` (`monitoring.ts` L192) must remain a **separate, additive, edge-of-window term applied ON TOP of correction** — it is not a substitute for correction. The two correct **orthogonal** error sources: corrected age removes a *real biological offset* (a 32-weeker at 12 mo chrono is developmentally ~10 mo); the grace absorbs *normal between-child timing variance + checklist granularity* at a band boundary. Folding one into the other would either under-correct the most-preterm infants (false reassurance — the worst failure mode) or misapply correction to term infants. **Correct order is non-negotiable: correct the age FIRST → THEN apply the grace.**

### (b) Approved copy (EN; HE flagged for human translation)
- Corrected-age badge: **"Corrected age: {X} mo"** with a tap-explainer: **"Because {child} arrived {N} weeks early, we compare milestones to a corrected age until 2 years. This is the standard pediatric approach — developmentally informed, grounded in AAP."**
- Gestation prompt (optional, onboarding/profile): **"Was {child} born early? If you know how many weeks along the pregnancy was at birth, we'll compare milestones to a corrected age — a fairer read for a preterm baby. You can skip this."**
- Ceiling note (shown once correction stops): **"From 2 years on, we compare {child} to their actual age — correcting for an early birth is only needed in the first two years (AAP)."**

### (c) Required fixes (a pod must implement)
1. **CI-02:** add the optional gestation capture + "corrected age" badge to onboarding/profile; **reuse `correctedAge()` — do not re-implement the math**; stop displaying correction at 24 mo corrected (the engine already gates this via `applied`). Gestation is sensitive child-health data → rides the existing consent/redaction path (arbor-safety procedural gate, separate from this clinical clearance).
2. **CI-03:** in `deriveMonitoring()`, replace `ageMonths = clampMonths(input.ageYears)` with the corrected value, i.e. compute `comparisonAgeMonths(chronoMonths, input.preterm?.gestationalWeeks)` and band against **that**; keep `OVERDUE_GRACE_MONTHS` applied on top (`ageMonths >= due + OVERDUE_GRACE_MONTHS` stays, now on corrected `ageMonths`).
3. **CI-03 test:** add a **28-week preterm regression test** asserting that an infant at, e.g., 12 mo chronological is banded at ~9 mo corrected and is **not** flagged "overdue" for a milestone due at 10-12 mo that a raw-age path would flag.

### (d) Verdict-flip target → **build-ready-after-fixes**
`soundness: pass / claims: none / riskClass: gated (child-data capture only — no claim)`. Peds **passes the math, the ceiling, and the grace-stacking**. CI-03 flips on the **actual diff** (the board confirms the corrected value reaches the banding comparison and the grace remains additive). CI-02 must land before CI-03 (capture before wire), and **both must land before CI-04** (the whole red-flag layer must read corrected age).
**cited_basis:** AAP / HealthyChildren.org — "Corrected Age For Preemies"; AAP developmental-surveillance practice (correct to ~24 months).

---

## CI-04 — Honest red-flag layer (CDC 2022 "Act Early")

**Owner pod:** arbor-ai. **Lens:** peds (thresholds), slp (language wording), psych (joint-attention + surfacing register). **Hard dependency:** CI-02 → CI-03 land first, or it urgency-flags a preemie on raw age.

### (a) Corrected / cited facts
- **The "no words by 16 months" rule is RETIRED.** It must not be used. CDC's 2022 revision sets checkpoints at the age by which **~75% of children** show the skill (not the old 50th-percentile average), precisely so a single miss is actionable. Current **verbatim** CDC 2022 language checkpoints:
  - **15 months:** *"Tries to say one or two words besides 'mama' or 'dada,' like 'ba' for ball or 'da' for dog."*
  - **18 months:** *"Tries to say three or more words besides 'mama' or 'dada.'"* and *"Follows one-step directions without any gestures…"*
  - → The honest framing is **"most children try a word or two by 15 months / three or more by 18 months,"** never "no words by 16 months."
- **Loss of skills (regression) is an Act-Early flag at EVERY age.** CDC verbatim, on every milestone page: *"Don't wait. If your child is not meeting one or more milestones, **has lost skills he or she once had**, or you have other concerns, act early."* Regression is age-agnostic and is the single most urgent signal — it should prompt a route to the provider regardless of band. **This confirms the council's premise that "regression is already caught" was FALSE** — there is no loss-of-skills detector today; one must be built (premise = a parent-logged skill previously observed is now reported absent).
- **Other CDC 2022 hard-stops worth surfacing (verbatim ages):**
  - **Independent walking — 18 months:** *"Walks without holding on to anyone or anything."* ("Takes a few steps on his own" is the 15-month item.) → the defensible "not walking" checkpoint is **18 months corrected**, not earlier.
  - **Gestures / social-communication — 12 months:** *"Waves 'bye-bye,'"* *"Calls a parent 'mama'/'dada,'"* *"Plays games with you, like pat-a-cake."* **Do NOT resurrect "points to show you something"** as a hard 12-month milestone — CDC deliberately removed it in the 2022 revision. Use the items above for the joint-attention/gesture domain.
- **Must sit on corrected age.** Every checkpoint above is age-banded; on raw age a 32-week preemie at 18 mo chrono (~16 mo corrected) gets falsely flagged for not yet saying three words / not walking. **CI-04 cannot pass until CI-02/CI-03 land.**

### (b) Approved copy (EN; HE flagged) — non-alarmist surfacing
Register: surface the **behavior**, never the **condition**; calm + dated + agency-giving. `{behavior}` is always an observed/absent behavior, never a condition name.

**Time-sensitive (missing milestone):**
- "No {single words} noted yet. Around this age many children are starting to — so it's worth bringing up with your child's doctor in the next few weeks."
- "By around {18 months}, {behavior} is something many children are doing. Since you haven't noted it yet, a quick conversation with your provider in the next few weeks is a sensible next step."
- "This is a checkpoint, not a conclusion: {behavior} isn't in your notes yet. Worth a conversation with your child's doctor soon."

**Loss-of-skills (regression) — prompter, still no verdict:**
- "You noted that {child} used to {behavior} and isn't now. A change like that is worth checking in on — it's a good idea to call your child's doctor about it soon, rather than waiting for the next visit."
- "You mentioned {child} has stopped {behavior} they used to do. That's exactly the kind of thing your child's doctor would want to hear about — worth a call in the next little while."
- (Reflect the parent's *own* report back — "you noted/mentioned" — so it reads as Arbor organizing what the parent observed, not Arbor issuing a finding.)

**BANNED strings (must never appear):** "red flag" / "🚩", "regression detected", "warning"/"alert"/"concern detected", "abnormal"/"atypical"/"delayed"/"delay"/"behind"/"below average"/"failed", any condition name as a verdict or screen target ("autism"/"ASD"/"speech delay"/"developmental delay"/"disorder"/"at risk for…"), "you should be concerned", "urgent"/"immediately"/"don't ignore this".

### (c) Required fixes
1. **Replace** any "16-month language" threshold with the CDC 2022 **15m (one-two words) / 18m (three+ words)** checkpoints, verbatim-grounded.
2. **Build a loss-of-skills detector:** premise = a milestone/behavior the parent previously logged as observed is now reported absent → fire the regression copy + prompt a *prompt* (not emergency) provider route, **age-agnostic**.
3. **Add the CDC hard-stop set on corrected age:** 18m independent walking, 18m three+ words, 12m gesture set — surfaced as the missing *behavior* only, all reading corrected age (dep CI-02/CI-03).
4. **Inherit the CI-08 canonical honesty string** at every new surface. **Visual non-alarm:** no red/amber severity colors, alarm icons, or badge counts on these surfaces — visual alarm pathologizes even with clean words.
5. **Lens ownership:** slp signs the language wording; psych signs the joint-attention + regression surfacing register; peds signs the ages/thresholds.

### (d) Verdict-flip target → **build-ready-after-fixes**
`soundness: pass / claims: none / riskClass: gated`. The `UNSUBSTANTIATED` came from the retired 16m rule and the false "regression already caught" premise — **both now corrected**. Flips to pass **once (i) the thresholds are the CDC 2022 verbatim checkpoints, (ii) the loss-of-skills detector exists, (iii) it reads corrected age (CI-02/CI-03 landed), and (iv) copy uses the approved register with zero banned strings.** Until then: HELD.
**cited_basis:** CDC "Learn the Signs. Act Early." 2022 checklists — 15 months, 18 months, 1 year (12 months); CDC key-points (75th-percentile basis); the per-page "lost skills… act early" statement.

---

## CLI-04 — SLP referral-timing prompt (ASHA / Hustad 2021)

**Owner pod:** arbor-practice. **Lens:** slp (lead).

### (a) Corrected / cited facts
- **The old windows are wrong and must be replaced.** "~50% by 2y / ~75% by 3y / ~100% by 4y" (Lynch; Coplan & Gleason 1988; older Flipsen) are **parent-estimated** norms running ~1 year ahead of the modern **unfamiliar-listener** evidence. ASHA's Practice Portal now cites Hustad et al. 2021.
- **Current evidence — Hustad et al. (2021), JSLHR 64(10)** (n=538 typically developing, 1,076 naïve adult listeners transcribing recorded speech, the objective gold standard). Mean (50th-pctile) intelligibility to an **unfamiliar listener**: single-word **47.5% at 30 mo / 57.7% at 36 mo**; ASHA's portal anchors **50% at ~31 mo, 75% at ~49 mo, 90% at ~83 mo (~7 yrs)**. **Full intelligibility is NOT expected at 4 years** — and for median/lower-percentile children, intelligibility growth continues through **~9 years**. Any "~100% by 4" claim is developmentally wrong and over-refers.
- **The conservative lower bound to anchor on (the crux of not over-referring late-bloomers).** Anchor a "consider an assessment" prompt to the **5th-percentile floor**, NOT the mean. Hustad 5th-pctile: 50% intelligibility isn't reached until **~46 months**; at 36 mo the 5th-pctile child is only ~25-34% intelligible. So a perfectly typical 3-year-old can sit in the mid-20s-to-low-30s%. The defensible, ASHA-consistent conservative flag is the long-standing clinical anchor: **"less than ~50% intelligible to unfamiliar listeners at age 3 (36 months)"** — which sits near the 5th-pctile multiword curve and catches genuine concern while leaving late-bloomers above the line. (Do **not** use the "75% at 3" figure as a flag — that's the retired parent-estimate standard.)

### (b) Approved copy (EN; HE flagged) — practice-accuracy, not intelligibility
- **"{Child} has found these sounds tricky over several sessions. If you'd like, it may be worth discussing a speech-language assessment with your pediatrician or a speech-language pathologist."**
- Optional softener: **"Lots of children take their time with specific sounds — this is just a pattern worth mentioning, not a diagnosis."**

### (c) Required fixes
1. **Correct any cited windows** in CLI-04 copy/logic to the Hustad 2021 figures; remove "75% by 3 / 100% by 4."
2. **Anchor the referral trigger to the conservative lower bound** (5th-pctile-aligned; the "<50% to unfamiliar listeners at age 3" clinical anchor), not the mean — explicitly to avoid over-referring late-bloomers.
3. **Honesty / scope fix (load-bearing):** `speechScorer.ts` measures **practice accuracy** (target phoneme/word production in a game), which is a *different construct* from connected-speech intelligibility to an unfamiliar listener and **cannot** measure it. The prompt must therefore **never** display an intelligibility %, state "X% intelligible," or say "delayed." It frames a **persistently-low practice-accuracy TREND** as "you may want to discuss an assessment with your provider," full stop.
4. Inherit the CI-08 honesty string; firewall holds.

### (d) Verdict-flip target → **build-ready-after-fixes**
`soundness: pass / claims: none / riskClass: gated`. Facts are now substantiated. The board lifts `UNSUBSTANTIATED` **conditionally**: the build must adopt (i) the Hustad 2021 windows, (ii) the conservative <50%-at-3 lower-bound anchor, and (iii) the practice-accuracy-trend-not-intelligibility framing. **Until the on-screen copy matches all three, CLI-04 stays HELD** — citations sound, but the displayed claims must match them before sign-off. SLP re-confirms the final referral strings on the diff.
**cited_basis:** Hustad et al. (2021), *Speech Development Between 30 and 119 Months… Intelligibility Growth Curves*, JSLHR 64(10) (doi 10.1044/2021_JSLHR-21-00142; open access PMC9132140); Hustad et al. (2020) companion (PMC7839034); ASHA Practice Portal, *Speech Sound Disorders: Articulation and Phonology* (cites Hustad thresholds; intelligibility varies by listener familiarity/context).

---

## CI-08 — Canonical non-diagnostic honesty surface (the inherited string)

**Owner pod:** arbor-design. **Lens:** psych (lead). This is the ONE string every developmental surface (Screening / DevScore / Coach / Practice / CI-04 / CI-01) inherits — at equal visual weight, never swallowed fine-print.

### (a) Corrected / cited facts
CDC explicitly states its milestone materials are **"not a substitute for standardized, validated developmental screening tools"** and directs parents to "talk with your child's doctor… and ask about developmental screening" — not to self-diagnose. "Clinically validated" is therefore a **false claim** for Arbor's surfaces and is correctly banned; the canonical string must (1) say *signal-to-discuss, not a diagnosis* and (2) state provenance honestly while disclaiming being a screening/diagnostic tool.

### (b) Approved canonical string (EN; HE flagged — **recommended**)
> **"A signal to discuss with your provider, never a diagnosis. Developmentally informed, drawing on guidance from the CDC, AAP, and ASHA — not a screening or diagnostic tool."**

Tighter UI-constrained variant (same meaning):
> **"A signal to discuss with your provider — not a diagnosis. Developmentally informed (CDC · AAP · ASHA), not a diagnostic tool."**

This is the most honest of the candidates: the second clause both credits the right bodies **and** disclaims validation, mirroring CDC's own self-description and inoculating against over-trust better than a bare "developmentally informed" line.

### (c) Required fixes
1. Implement **one** i18n key; reconcile the scattered in-code non-diagnostic strings (e.g. the inline close in `monitoring.ts` L164) to inherit it.
2. Render at **equal visual weight** at each signal surface — not fine-print.
3. **Lands alongside CI-04/CI-05** so their new surfaces inherit the line by default.

### (d) Verdict-flip target → **build-ready**
`soundness: pass / claims: none / riskClass: gated (consistency/consent-adjacent only)`. Wording is board-approved as above. No outstanding clinical substantiation — this is the string the rest of the cluster inherits.
**cited_basis:** CDC "Learn the Signs. Act Early." (materials are not a substitute for validated screening; provider-conversation routing); AAP/Bright Futures surveillance model; ASHA scope-of-practice (diagnosis requires a qualified professional, not software).

---

## CI-05 — Escalation currency check (live-registry verify, fail-loud)

**Owner pod:** arbor-safety. **Lens:** lead (with arbor-safety co-hold). **riskClass:** gated by category (crisis copy).

### (a) Corrected / cited facts
- `escalation.ts` already routes outward and is sound: leads with **112** (EU/NL/BE/mobile-IL) + **911** (US) + **101** (IL ambulance/MDA) + **100** (IL police), trilingual EN/HE/NL, with **findahelpline.com** as the international fallback.
- **Spot-check this pass (2026-06-21) against live registries — all current:** US **988** Suicide & Crisis Lifeline (live since Jul 2022); NL **113** / **0800-0113** (113 Zelfmoordpreventie); BE **1813** (Zelfmoordlijn) + **0800 32 123** (Centre de Prévention du Suicide); IL **1201** (ERAN); NL **0800-2000** (Veilig Thuis); BE **1712**; US Childhelp **1-800-422-4453**. No stale literal found this pass.
- **The point of CI-05 is the mechanism, not freezing these numbers.** A one-time check is exactly the rubber-stamp failure mode. The sign-off is on a **dated, recurring re-review that verifies each literal against a live authoritative national registry every pass, and fails loud when a number can't be confirmed.** A stale emergency number is the app appearing to help while silently failing — the precise harm this item exists to prevent.

### (b) Approved behavior spec (not user-facing copy — operational)
- **Verification source per jurisdiction:** national emergency/health-ministry registry or the maintained findahelpline.com country directory; the literal is "verified" only when matched against the live source this pass — **never** by re-confirming the existing constant against itself.
- **Fail-loud behavior:** any literal that cannot be matched against a live source raises a **visible stale-number flag** (build/CI surfaces a failing check + an entry in a dated re-review log); it does **not** silently pass. A stale or unverifiable number blocks the re-review's "green" status.
- **Trilingual literals confirmed:** EN/HE/NL crisis copy and the emoji-flagged jurisdiction lines (no person named) hold the firewall — numbers are jurisdictions only.

### (c) Required fixes
1. Add a **dated periodic re-review** (owner: arbor-safety) that checks **every** helpline literal against a live national registry each pass.
2. Add a **currency hook that fails loudly** — a stale/unconfirmable number surfaces a flag and fails the check, rather than defaulting to pass.
3. Keep `112/911/101/100` + findahelpline lead-with-emergency ordering; preserve trilingual coverage.

### (d) Verdict-flip target → **build-ready**
`soundness: pass / claims: none / riskClass: gated (crisis copy category)`. Board passes every current number this pass **and** the fail-loud live-registry mechanism. Procedural gate: arbor-safety owns the recurring re-review and signs each number every pass; never auto-built.
**cited_basis:** live national emergency/helpline registries (FCC 988; 113 Zelfmoordpreventie NL; Zelfmoordlijn 1813 BE; ERAN 1201 IL; findahelpline.com directory), verified 2026-06-21.

---

## CI-01 — Weekly brief copy (parent-opened digest, non-diagnostic)

**Owner pod:** arbor-growth. **Lens:** psych (lead). **Depends on:** CI-02/CI-03 (so the read isn't built on an uncorrected-age artifact).

### (a) Corrected / cited facts
A **parent-OPENED** digest (not a push) is consent-respecting and lower-alarm — the parent chose the moment. Keep it that way: **a worth-discussing signal must never arrive by push** (push = alarm on the app's schedule, not attachment-safe); a neutral "your weekly read is ready" push is fine. Grounded in CDC surveillance framing (the brief organizes what the parent observed and routes to the provider; it never labels) and parent-mediated/attachment-safe principle.

### (b) Approved copy rules + skeletons (EN; HE flagged)
**Three-part structure, every brief, in this order:**
1. **One honest read** — warm, specific, behavior-grounded reflection of the week. Not a score/grade/label.
2. **One honest signal — including the uncomfortable one.** The integrity rule: the brief must be willing to surface a worth-discussing signal and must **never** default to an "everything's lovely" highlight reel. Always a behavior + a route, framed "worth noticing / worth discussing," never "problem"/condition.
3. **One parent-owned, real-world next step.** Ends in the parent's hands, in the real world (try / notice / bring to the provider) — **never** an in-app action as the "next step" (the child and the provider are the destinations, not the app).

No brief contains a label, condition name, score, or guilt cue.

**Skeleton A — all on track:**
> **This week.** {Child} was full of words — three new ones and lots of pointing-and-naming. Lovely back-and-forth.
> **Worth noticing.** Pretend play is starting to show up (feeding the toy, "talking" on a block) — a nice thread to follow.
> **One thing to try.** Narrate your own little actions out loud ("I'm pouring the water…") — it gives all that new language something to lock onto.

**Skeleton B — with a worth-discussing signal:**
> **This week.** {Child} is on the move — lots of cruising and climbing, and clearly proud of it.
> **Worth discussing.** You haven't logged any single words yet, and around this age many children are starting to use a few. That's often just each child's own pace — and a sensible thing to mention to your child's doctor, sometime in the next few weeks rather than waiting.
> **One thing to try.** Name things as you both look at them ("ball… your ball") and leave a beat for {child} to fill in. Jot down any word-like sounds — useful to show your doctor.

### (c) Required fixes
1. Build **one** brief template (the council dedupe — feeds digest + proactive card + milestone; gated once, not three surfaces) that emits exactly the three parts.
2. **No worth-discussing signal via push** — only inside the parent-opened brief; neutral "ready" push only.
3. Inherit the CI-08 honesty string; honest-signal-not-highlight-reel rule is load-bearing (surfacing only good news flips truth→avoidance).
4. Depends on CI-02/CI-03 landing first.

### (d) Verdict-flip target → **build-ready-after-fixes**
`soundness: pass / claims: none / riskClass: gated (child-data egress in delivery)`. Copy rules + skeletons board-approved. The clinical hold lifts on the copy; the **delivery channel** (a record-grounded digest touches child-data egress) remains a Guy/arbor-safety procedural decision. Board signs the final populated strings on the diff.
**cited_basis:** CDC surveillance framing (organize-and-route, never label); AAP/Bright Futures parent-observation-plus-provider-conversation; attachment-safe / parent-mediated principle.

---

## Cross-cutting notes for the Orchestrator

- **Dependency chain (build in this order):** CI-02 (capture) → CI-03 (wire) → then CI-04 / CI-01 / DEM-002 / CLI-02 / DEM-003 (all read corrected age). CI-08 lands alongside CI-04/CI-05 so new surfaces inherit the honesty line. **Do not schedule CI-04 or CI-01 before CI-02/CI-03 are green** — they would false-alarm a preterm infant on raw age.
- **What this packet does NOT do:** it does not clear the **procedural** gates (child-data capture/egress, crisis-copy category, consent) — those remain `arbor-safety` + Guy decisions, unchanged. This packet lifts only the **clinical soundness/claims** block.
- **No VETO issued.** Every item is build-ready-after-fixes or build-ready. Anything whose diff does not match these specs reverts to HELD — the citations are the floor, the on-screen strings must match them.
- **HE everywhere:** all approved EN strings require **human** clinical translation (machine translation is unsafe for non-pathologizing register; HE has its own loaded terms — avoid איחור התפתחותי / רגרסיה as parent-facing verdicts).

**Board verdict (packet):** `soundness: pass (conditional on diffs) · claims: none · riskClass: gated (procedure) · required_fixes: per item above · cited_basis: CDC 2022 / AAP / ASHA+Hustad 2021`. Routed to `arbor-orchestrator` as **build-ready-after-fixes**; no clinical veto outstanding.
