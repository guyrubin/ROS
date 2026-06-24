# Arbor Enhanced Backlog — The Most Viral, Capable, and Transforming Way to Raise a Kid

**Date:** 2026-06-21 · **Owner:** PAI / Arbor · **Base:** origin/main prod (arborprd-westeu.web.app) · **Status:** action-ready, adversarial critique merged
**Method:** 8-agent market-analysis workflow (5 cited research briefs → synthesis → adversarial stress-test → finalize). Builds on the verified production audit in [arbor-updated-backlog-2026-06-21.md](arbor-updated-backlog-2026-06-21.md).

---

## 0. Thesis

Arbor wins by owning the one position every incumbent is structurally unable to copy: **the parent-mediated, evidence-grounded, provenance-clean, parent-owns-the-data AI for raising a kid — explicitly not a kid-facing companion.** The category leaks (12–18%/mo churn as children age out of stages), the obvious "AI friend for kids" product shape is now radioactive (FTC inquiry, 44-AG letter, Character.AI ban/settlement, Fairplay "AI Toys" advisory, COPPA-2026 biometrics rule), and the share artifact and the regulation point the same direction (milestone pride via a stylized artifact, never the child's face). Arbor already shipped the moat — the append-only, parent-owned child-memory record — and the trust architecture that lets it generate a child's stylized hero safely. So the play is not to chase K>1 with broadcast share cards; it is to **make the moat compound monthly** (retention is the binding constraint), wrap it in the one daily/2-sided loops that are AADC-clean and moat-native (the streak and the second-guardian invite), and convert the 2025–26 regulatory backlash into Arbor's loudest GTM weapon.

**Legend:** `NEW` net-new · `ENHANCE` extends a shipped feature · Effort `S` (≤1 wk) / `M` (2–4 wk) / `L` (5+ wk).

**Two governance gates that bind the whole document (read first):**
- **G1 — Loop-math honesty.** No blended-K guarantee anywhere. Every viral loop is measured as **installs-per-sharing-parent-per-month** with its full factor chain (share-rate × accept-rate × activation) instrumented, treated as a *measurement bet*, not a growth promise.
- **G2 — Copy governance (P0, gates the entire TRANSFORMING track).** Cite the *mechanism*, never transfer the clinical *effect size*. Outcome verbs ("proven," "reduces," "improves," "clinically validated") are **banned in all user-facing surfaces** until Arbor's own measured data (T6) exists. Enforced build gate, not a footnote.

---

## NORTH STAR 1 — VIRAL (growth loops & shareability)

> Measured as installs-per-sharing-parent-per-month (G1). The child's real face/data is **never** the viral payload — stylized artifact only.

### V0. Second-Guardian Invite — the moat-native 1:1 loop `NEW` (highest-leverage viral item)
- **Insight (virality; critique "the real K-driver"):** The compounding loop is not the broadcast share card — it's the **1:1 invite to a second adult who co-owns the same child's record** (co-parent, grandparent, nanny). Intrinsically two-sided, *raises the inviter's own retention* (shared streak + memory), COPPA/AADC-clean (adult-to-adult), structurally high accept rate (blood-relationship stake in *this* child). Lovevery/BeReal can't; Arbor can, because the moat exists.
- **Build:** First-class "invite the other parent / grandparent / caregiver to co-view this child's record." Both get shared streak + a slice of premium. Granular co-viewer permissions (view-only vs. contribute). Reward account-level, never gated on the child's engagement.
- **Metric:** invited-guardian accept rate (target 40%+); D90 retention inviting vs solo parent; guardians-per-active-child.
- **Effort:** M. **Depends on:** shipped moat + entitlements + invite infra.

### V1. Milestone Share Card — parent-pride artifact `ENHANCE`
- **Insight (virality; ~80% already built):** Sharenting's #1 driver is milestone pride via an abstracted artifact, AADC-clean by construction. A *trigger + template* on top of the shipped branded PNG share/export — not a new engine.
- **Build:** On milestone/virtue crossing, auto-offer a branded card (stylized comic-hero + achievement, never a photo). One-tap share, UTM deep link.
- **Metric:** installs-per-sharing-parent-per-month from cards; % parents sharing ≥1 card/mo. **Effort:** S.

### V2. WhatsApp-First Forwardable Layer (Israel wedge) `ENHANCE`
- **Insight (market-gtm):** WhatsApp = 98% reach / 95% daily in Israel; the family group *is* the social graph. Re-baselined per G1 (the old "5% install / K≈0.5" numbers are deleted as unsupported).
- **Build:** WhatsApp-native preview + one-tap "share to group," HE/EN RTL, UTM deep links, no child PII in payload. **Prereq: fix the RTL comic SFX bug.**
- **Metric:** installs-per-sharing-parent-per-month in IL geo; WA share→install activation. **Effort:** S.

### V3. Hero/Avatar Generator as shareable artifact — the safe Remini `ENHANCE`
- **Insight (virality; ai-frontier):** AI-artifact loops have the highest ceiling (Remini 5× revenue/week) but every source warns against uploading real child faces. Arbor's stylized comic-hero is the safe version.
- **Build:** "Turn your child into their superhero" → postable comic strip on the character-consistent avatar. **Mandatory safety:** ephemeral reference-photo handling, never stored (auditable invariant); C2PA + SynthID signed; **default external-share artifact omits any child-identifying render**; per-share explicit parental consent; never auto-suggest sharing the hero.
- **Metric:** generations/parent; consented-share rate; organic installs per shared grid. **Effort:** M. **Hard-blocked by S2 (cost cap) + S4 (provenance).**

### V4. Daily Ritual + Streak (for the PARENT) `ENHANCE`
- **Insight (virality; transformation; re-scoped to S):** The retention flywheel that multiplies every loop's LTV — a state-machine + UI layer over three shipped systems (Today spine, daily-play, JITAI), not a flagship build.
- **Build:** One daily play/connection prompt on Today with a streak. **Mandatory AADC-hardening: no streak-loss / guilt notifications, infinite catch-up, no punitive reset — frame as "moments logged."** Optional family/co-parent shared streak (pairs with V0). Pass the AADC lens *before* building.
- **Metric:** D7/D30/D90 retention; DAU/MAU; streak-survival without rising opt-outs. **Effort:** S.

### V5. Two-Sided Referral 2.0 `ENHANCE`
- **Insight (virality):** Two-sided incentive is the biggest lever on invite-accept (Dropbox/PayPal/Lovevery $20/$20). Arbor ships one-sided today.
- **Build:** Make it two-sided ("give a Plus month, get a Plus month / avatar pack"). Account-level reward, never gated on the *child's* engagement. Cycle <7 days.
- **Metric:** invite-accept rate (target 30–50%); installs-per-sharing-parent-per-month; cycle time. **Effort:** S.

### V6. SLP/Educator B2B2C Referral Program `NEW` (de-scoped per critique)
- **Insight (critique):** The consumer-influencer "Cal AI $1M MRR on codes" comp is survivorship bias + FTC/likeness liability. The defensible version is the **prescribe→parent wedge.**
- **Build:** SLPs/educators/clinicians get referral codes earning on installs/conversions; briefed on no-real-child-likeness + FTC disclosure. **Drop the consumer-influencer track until post-PMF.**
- **Metric:** SLP/educator-sourced installs + activation; prescribe→parent conversion. **Effort:** M.

> **CUT — "Sprout mascot meme loop":** manufacturing a memeable mascot pre-scale is cargo-culting Duolingo with ~zero attributable installs. Demoted to a brand-tone guideline, not a growth item.

---

## NORTH STAR 2 — CAPABLE (best-in-market AI/feature depth)

> Own the loop no incumbent closes: **child play → developmental signal → parent guidance**, grounded in the moat. Good Inside coaches only the parent; Heeyo only entertains; Kinedu/BabySparks only list; Nanit only senses. Arbor closes all four in software.

### C1. Parent Real-Time Coach — the category to own `NEW` (flagship; immediately follows the retention spine)
- **Insight (ai-frontier; transformation-PCIT; "real winner #2"):** Parent-coaching AI is the fastest-emerging, lowest-regulatory-risk category and Arbor's natural home. Most rivals have *no peer-reviewed evidence*; the win is **cited, evidence-graded, clinician-reviewed** guidance. The AI talks to the *parent*, never the child. The paid-conversion + daily-value engine.
- **Build:** Context-aware in-the-moment coach grounded in the child's longitudinal profile (reads the moat). Every suggestion carries a citation + evidence grade + "not medical advice" (G2). Routes via shipped Gemini/Vertex/Claude layer. **Invariant: safety-critical / red-flag responses are never metered or upsold.**
- **Metric:** coach DAU; suggestion-helpful rate; % answers cited (target 100%); free-meter → paid conversion. **Effort:** L (the quarter's single L-bet).

### C2. Async Interaction Review (de-risked from "PCIT port") `NEW`
- **Insight (transformation; critique — NOT PCIT):** True PCIT needs live low-latency audio coaching Arbor doesn't have, on a Guy-gated child-ASR pipeline 2–5× worse WER. The honest shippable version is **asynchronous.**
- **Build:** Parent records/describes a real moment; AI returns specific, mechanism-cited coaching. Uses the shipped ASR seam + avatar delivery. Writes skill-use to the moat. **No borrowed PCIT effect size in copy (G2).**
- **Metric:** rise in coached-skill use (labeled praise, emotion labels) across reviews/parent. **Effort:** L. **Gated behind the single ASR-vendor decision (shared with C5/C8).**

### C3. JITAI 2.0 — just-in-time micro-support `ENHANCE`
- **Insight (transformation; critique — collapse instrumentation into one workstream):** JITAI delivers the right support at the right moment; parenting-specific evidence is thin — Arbor can own it.
- **Build:** Upgrade the shipped nudge with Nahum-Shani components: decision points, tailoring variables (passive + parent-entered — **no automated emotion recognition**, per EU AI Act), options *including doing nothing*, receptivity gating.
- **Metric:** MRT-estimated lift at prompted vs non-prompted points; prompt→action without rising opt-outs. **Effort:** M–L. **Feeds the single measurement workstream (10x Bet A).**

### C4. Child-as-Hero Story/Comic Studio `ENHANCE`
- **Insight (ai-frontier; competitive):** Multi-page identity-consistent stories are the most commercially mature frontier; consistency-across-scenes is the common failure mode and Arbor already nails it.
- **Build:** Extend the shipped story engine to multi-page, multi-character (sibling/parent co-stars), longer arcs, more styles — identity-consistent, C2PA+SynthID signed, **private/parent-only by default; same default-omit-child-render + per-share-consent rule as V3 for external shares.**
- **Metric:** stories/family; completion rate; cache-hit rate (via S3). **Effort:** M. **Coupled to S2/S3/S4.**

### C5. Bounded Kid Voice — explicitly NOT a companion `NEW`
- **Insight (ai-frontier):** Open kid-facing voice is the regulatory landmine (Curio/Miko/Character.AI). The defensible version is bounded, push-to-talk, transcript-visible, scoped to one activity.
- **Build:** Push-to-talk, on-device ASR, scoped to a specific story/practice game — never an open-ended friend, no passive listening, no simulated affection, transcripts parent-visible, hard content allow-lists + safety classifiers.
- **Metric:** activity-completion lift with voice on; zero safety-classifier escapes; parent-trust survey. **Effort:** L. **Gate behind S5; one gated bet with C8 (shared ASR path).**

### C6. Zero-Effort Longitudinal Tracking on CDC milestones `ENHANCE`
- **Insight (transformation; competitive; best-reasoned item):** Self-monitoring is the strongest digital BCT but decays with burden. The unfair advantage over a one-shot clinic visit is the longitudinal trajectory. Stay in **surveillance** (consumer-safe), never **screening/diagnosis** (regulated).
- **Build:** Near-zero-effort logging (passive inference + 1-tap confirms); hedged language ("worth mentioning to your pediatrician"); clinician-shareable summary. **Mandatory gate: regulatory read on the clinician-facing summary before ship (EU MDR — software flagging developmental concern can be a medical device).**
- **Metric:** sustained monitoring cadence; trajectory completeness over 6/12 mo; early-flag → referral conversion. **Effort:** M.

### C7. Emotion-Coaching Skill Builder `NEW`
- **Insight (transformation):** Emotion coaching is proven in online self-paced RCTs (2024 Nature Sci Rep) to cut child conduct problems + parenting stress — the cleanest consumer-app fit. (Mechanism cited; effect size not in user copy, G2.)
- **Build:** notice → label → validate → problem-solve micro-lessons + practice on the parent's *own* scenarios (read from the moat). Slots into Academy + Today.
- **Metric:** drop in dismissive responses / rise in coaching responses; parent-reported conduct + stress trend (internal, un-marketed until T6). **Effort:** M.

### C8. Real Child-Phoneme ASR (Practice Studio) `ENHANCE`
- **Insight (ai-frontier; market-gtm):** Speech-delay parents are the **highest-WTP segment** ("~1 in 4 kids need speech support," $60–100/yr tolerance) and the prescribe→parent wedge. Child WER is 2–5× adult — degrade gracefully.
- **Build:** Integrate a child-tuned ASR vendor for the shipped phonics/letter-tracing/Mimic features; graceful low-confidence UX. Anchors the IL speech wedge vs clinician-gated Talkon/TikTalk (Arbor serves the un-waitlisted majority).
- **Metric:** phoneme-feedback usage; speech-segment retention; speech-wedge paid conversion. **Effort:** M. **Blocked-on-Guy: ASR vendor (one decision unblocks C2 + C5 + C8).**

---

## NORTH STAR 3 — TRANSFORMING (evidence-based outcome change + retention)

> The defensible moat is **causal evidence almost no consumer app has.** Bind every "formation" claim to a proven *mechanism*; **never transfer the clinical effect size to user copy (G2)**; under-claim on screening; measure Arbor's *own* effects.

### T4. Narrativized Memory Moat — "The Story of [Child]" `ENHANCE` (the actual retention answer — Wave 1)
- **Insight (competitive unmet-need #1; transformation; "real winner #1"):** Durable longitudinal memory is *the* thing that fixes churn — but the moat is currently "browsable, not narrativized." A reason-to-return tied to the child's growth is the #1 retention keeper, mostly shipped infra, lowest regulatory risk, and the one artifact parents *intrinsically* want to revisit and share (feeds V1/V0).
- **Build:** Turn the append-only record into a living, narrated developmental story (hero arc + virtue growth + milestone timeline), parent-owned, exportable.
- **Metric:** memory-view DAU; export/share rate; D90 retention of memory-viewers vs non-viewers. **Effort:** M.

### T1. Tiny-Habits + Implementation-Intentions Engine `NEW`
- **Insight (transformation; Peterson framing):** If-then plans + tiny-habit anchoring → consistent limits/routines (Incredible Years core). Peterson order/responsibility/competence lives here — **bound to mechanism, stripped of punishment; corporal punishment excised entirely (brand-ending liability).** (Mechanism cited; effect size not in copy, G2.)
- **Build:** Parent picks one tiny anchored habit ("after dinner, one labeled praise"); app scaffolds + scales it. Wraps the shipped Family Charter → virtue mapping in real behavior-change scaffolding.
- **Metric:** habit-streak survival; % habits scaled-up; downstream consistency-of-limits self-report. **Effort:** M.

### T2. Parental Self-Efficacy / Reflective-Functioning Builder `NEW`
- **Insight (transformation):** Parental self-efficacy is Triple P's strongest proximal effect; reflective functioning (COS) changes how the parent *interprets* the child. (Mechanism cited; effect size not transferred, G2.)
- **Build:** "What was your child needing *behind* that behavior?" reframes (COS "Circle") + periodic confidence check-ins scored with a validated self-efficacy scale. Writes to the moat.
- **Metric:** validated self-efficacy scale movement over time; reduction in hostile attributions. **Effort:** M.

### T3. Fresh-Start Re-Engagement `NEW`
- **Insight (transformation):** The fresh-start effect drives re-engagement at natural restarts; a child-dev app has *more* (birthdays, milestone windows, new school year) than any adult-wellness app — directly attacking 12–18% churn.
- **Build:** Milestone/birthday-triggered "new chapter" moments that re-onboard lapsed parents with a fresh personalized goal. Reads the moat for the right restart.
- **Metric:** reactivation rate at milestone triggers vs baseline; D30/D90 retention lift. **Effort:** S–M.

### T5. Guided / Human-Touch Tier — "Ask a Specialist" `NEW`
- **Insight (transformation; market-gtm):** Guided digital interventions consistently *out-retain* pure self-serve; highest engagers are higher-distress parents who benefit most.
- **Build:** Paid coach/SLP/specialist layer (Family tier). Specialist reads the moat for context; answer snippet shareable. Anchors the prescribe→parent B2B2C channel (ties to V6).
- **Metric:** guided-vs-self-serve retention + outcome delta; paid-tier D90 retention. **Effort:** L.

### T6. The Evidence Engine — measure Arbor's OWN effects `NEW` (de-risked per critique)
- **Insight (transformation; critique):** Almost no consumer parenting app has real causal evidence; Arbor could. **But a weak, self-selected "published effect" is worse than none.** So: build the internal measurement harness now; **defer any external published-claim until a pre-registered, controlled design (ideally academic partner).**
- **Build:** Lightweight outcome layer (validated short scales: self-efficacy, child conduct, emotion-coaching frequency) + MRT harness on JITAI/coach. **Phase 1 = internal decisions + honest "your family's trend" to the parent.** Phase 2 (gated) = external causal claim only with real design + control + pre-registration.
- **Metric:** % active families with ≥1 baseline + follow-up measure; (Phase 2, gated) first defensible pre-registered effect size. **Effort:** L. **The single measurement workstream (C3-instrumentation + T6 + Bet A collapsed — no triple-counting).**

---

## CROSS-CUTTING — TRUST / SAFETY AS MOAT

> Trust is the differentiating product, and it **gates the AI/viral items above.**

### S2. Image-Gen Cost Cap + Abuse Guard `ENHANCE` (ship in DAYS — most urgent item in the doc)
- **Insight (known gap; critique — more urgent than S4):** Image-gen has **no cost cap** — a live financial + abuse risk blocking every generative/viral feature.
- **Build:** Per-user/per-tier generation budget + global circuit breaker + abuse detection on the AI-Studio Gemini path.
- **Metric:** image-gen spend/DAU capped; zero runaway-cost incidents. **Effort:** S. **Hard prereq for V3, C4. Decoupled from S4 — ship first.**

### S4. Provenance Layer — C2PA + SynthID on every asset `NEW`
- **Insight (ai-frontier):** Machine-readable AI-content marking is **mandatory under EU AI Act Art. 50 from Aug 2, 2026**; table stakes by 2026.
- **Build:** C2PA Content Credentials + SynthID as a default pipeline step on every generated image/story/comic. Surfaces as the S1 badge.
- **Metric:** % generated assets signed (target 100%); Art. 50 compliance pre-Aug-2026. **Effort:** M. **Hard prereq for V3/C4 external sharing. Sequence after S2.**

### S1. Family Trust Center — make compliance a marketing surface `NEW`
- **Insight (ai-frontier; "real winner #3"):** "See exactly how we protect your child" is positioning no leader can claim. Converts COPPA-2026, DSA (Mar 2026), UK OSA, CA AADC, EU AI Act Art. 50 from cost into a wedge.
- **Build:** Visible in-app center: on-device vs cloud processing, C2PA badge per image, one-tap full export + granular delete, published retention limits, consent status. Parent is the named data controller.
- **Metric:** Trust-Center visit rate; export/delete usage; onboarding trust lift; cited in App Store copy. **Effort:** M. **Core of 10x Bet C.**

### S3. Persistent Scene-Art Cache `ENHANCE`
- **Build:** Cache generated scenes keyed to child+scene+style; serve from cache. Pairs with S2 (spend) + C4 (consistency).
- **Metric:** cache-hit rate; cost/story; consistency-defect rate. **Effort:** S–M.

### S5. No-Open-Companion Guardrail (codified) `ENHANCE`
- **Build:** Architectural invariant + automated test: no kid-facing open free-text chat, no simulated affection/dependency, no passive listening, transcripts parent-visible, layered safety classifiers. Extends the shipped output-safety screen.
- **Metric:** zero open-companion surfaces in audit; classifier escape rate = 0. **Effort:** S–M. **Gates C5.**

### S6. Age Assurance + VPC Flow `ENHANCE`
- **Build:** Privacy-preserving age assurance + parent-gated account creation (VPC), surfaced in S1. On-device-first; no ID storage.
- **Metric:** VPC completion rate; compliance coverage IL/NL/EU/US. **Effort:** M.

### S7. Model Red-Team Cadence + Safety-Eval Suite + Abuse-Reporting `NEW` (added per critique — the missing S item)
- **Insight (critique):** For a kid-adjacent AI in 2026 you'll be asked "what's your process when the model says something harmful?" S5's test is necessary but not sufficient.
- **Build:** Recurring red-team against coach/voice/story surfaces; standing safety-eval suite in CI; in-app abuse/harm reporting with a triage + response runbook.
- **Metric:** red-team cadence met; safety-eval pass rate in CI; time-to-triage on reported harms. **Effort:** M. **Required before scaling C1/C2/C5.**

---

## 10x BETS

- **Bet A — The Evidence Moat:** combine **C3 + C1 + T6 into one measurement workstream**. Causal evidence is the asset money can't quickly buy and the key to Tipat Halav / kupah / JGZ institutional doors. De-risk: internal "your family's trend" first; external effect only via pre-registered, controlled, academic-partnered design. **L · category-defining.**
- **Bet B — "Knows-My-Child" parent-owned moat:** push **T4 + the shipped record** into a true longitudinal developmental model so coaching/stories/JITAI compound monthly, parent as data controller. The direct answer to churn *and* the structural counter to Nanit's hardware-sensor moat (software memory travels, needs no camera). **L · durable retention.**
- **Bet C — Trust Wedge as GTM weapon:** turn **S1+S4+S5+S6+S7** into a loud public **"The AI for raising your kid you can actually trust"** — the one claim no leader can make while regulators punish incumbents. Mostly already-built pieces repackaged. **M · highest-leverage, lowest-cost swing.**
- **Bet D — Israel Lighthouse:** stack **V2 + V0 + C8 + T5 + Bet A's evidence** into a Hebrew-first wedge with **one Tipat Halav / kupah reference partnership**. Demographic tailwind (TFR 2.85, 31.7% under 18), white space (only 44 children's health-tech startups since 2010), Talkon/TikTalk clinician-gated. **M–L · lowest-CAC entry + national credibility.**

---

## RECOMMENDED SEQUENCE — 30 / 60 / 90 days

> **Hard constraint (critique): one L-bet at a time.** Force-ranked to one L-bet per quarter, starting with C1.

**First 30 days — stop the leak, get legal, lay the retention spine**
1. **S2 — Image-gen cost cap (SHIP IN DAYS).** Live leak + abuse risk; gates every generative/viral feature.
2. **S4 — Provenance (C2PA+SynthID)** + **S3 — Scene-art cache** + **RTL SFX fix.** Aug-2026 landmine + cost/consistency + the IL share path. (S4 has runway; don't let it delay S2.)
3. **T4 — Narrativized Memory Moat** — the real retention answer; mostly shipped infra; **begin now (Wave 1).**
4. **V4 — Daily Streak (S, AADC-hardened)** + **V0 — Second-Guardian Invite.** Retention spine + the moat-native 1:1 K-driver.

**Days 30–60 — safe viral + flagship monetization**
5. **V1 + V2 + V5** — highest-confidence AADC-clean loops; the IL wedge.
6. **C1 — Parent Real-Time Coach (the quarter's single L-bet)** — 100%-cited, red-flag responses never metered.
7. **T3 — Fresh-Start Re-Engagement** — cheap churn attack on the milestone engine.
8. **S7 — Red-team + safety-eval + abuse-reporting** — before scaling any AI surface.

**Days 60–90 — capability depth + surface the trust moat**
9. **C6 (with the MDR regulatory read) + C7 + T1 + T2** — the evidence-based transformation core, all under G2.
10. **S1 + S6** — surface the trust moat publicly → **10x Bet C.**
11. **C3 JITAI 2.0** → seeds the single measurement workstream (T6 / Bet A) — internal-trend phase only.

**Beyond 90 days — gated, category-defining bets (one L-bet each)**
- One **ASR vendor decision unblocks C2 + C5 + C8.**
- **T6 Phase 2 + Bet A** (external causal claim) only with pre-registered controlled design.
- **T5 + V6 → Bet D (Israel Lighthouse)** with one institutional reference partner.

**One line:** *Stop the leak and get legal → make them stay (T4 + streak + second-guardian) → make it most capable (C1, then evidence-based depth) → surface the trust moat as GTM → swing big on gated bets — one L-bet at a time.*

---

## Non-negotiables (honored throughout)
No kid-facing open companion · no dark patterns / guilt-framing aimed at minors, **no streak-loss/guilt notifications even parent-facing — infinite catch-up, "moments logged"** (AADC/Fairplay) · COPPA-2026 biometrics & retention compliance · privacy-first / parent-owns-the-data (parent = named data controller) · child's real face/data **never** the viral payload, **default external-share omits child render + per-share explicit consent + ephemeral reference-photo handling as an auditable invariant** · surveillance-not-diagnosis on all tracking, with a **regulatory read before any clinician-facing artifact (EU MDR)** · **mechanism cited, clinical effect size never transferred to user copy until Arbor's own data exists (G2)** · safety-critical/red-flag coach responses never metered or upsold · all generated assets C2PA+SynthID signed · standing red-team + safety-eval + abuse-reporting before scaling any AI surface.

---

*Research provenance: 5 cited briefs (competitive landscape · virality mechanics · transformation/outcomes · AI frontier & safety/regulatory · market sizing/GTM/pricing), synthesized and adversarially stress-tested. Full agent transcripts under the workflow run `wf_d2c1c680-742`.*
