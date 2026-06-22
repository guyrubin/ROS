# Arbor Professional Platform — Strategic Design Brief (Evaluated)

**Version:** 1.0 · **Date:** 2026-06-10 · **Owner:** PAI (Guy) · **Status:** Decision-ready
**Inputs:** `arbor-business-model-pricing-and-financials.md` (2026-06-07) · `docs/arbor-ia-enhancement-plan-2026-06-07.md` · WAF assessment (2026-06-04) · live app state (redesign Phases 1–3 in production)
**Stance:** Skeptical product executive. Nothing below is accepted because it was proposed.

---

## 0. The business outcome (defined before any feature)

The brief's vision — "Operating System Between Therapy Sessions" — is evaluated against the
**already-modeled** three-engine economics, not against ambition:

| Engine | Y3 revenue (base) | Strategic job |
|---|---:|---|
| B2C | €5,244K (83%) | Cash. Funds everything. |
| **Professional** | **€259K (4%)** | **Trust, clinical validation, referral flywheel, institutional door-opener.** |
| Institutional | €792K (13%) | Scale. The real B2B prize (PMPM, prevention budgets). |

**Therefore the professional platform's success metric is NOT professional seat revenue.** It is:

1. **Retention lift on B2C** — a parent whose therapist prescribes through Arbor does not churn (institutional bundling + habit are two of our three churn dampers).
2. **Referral CAC** — each active professional brings 5–15 families at ~€0 CAC (vs €25–40 paid).
3. **Institutional credibility** — no municipality/insurer signs a PMPM deal without professionals already using and endorsing the product.
4. **Pilot readiness** — 1–2 NL youth-care/municipal pilots in Y2 require a working pro surface.

**Budget discipline that follows:** the professional platform earns a *thin-wedge* investment
(design-partner scale, weeks not quarters per increment), not a clinic-CRM build-out. Any
feature below that only makes sense at clinic-CRM scale is rejected regardless of how good it sounds.

**Hard prerequisites (from the WAF assessment — these gate ANY professional launch):**
DPIA, GDPR export/erasure, audit logging, PII redaction before LLM calls, semantic safety
classifier, observability beyond `console.*`. A professional handling child data through Arbor
multiplies our regulatory surface; we do not invite professionals into a system that hasn't
closed CMP-/SEC- backlog items.

---

## Phase 1 — Critical evaluation of the five concepts

Scoring: Value / Failure modes / Competition / Adoption barriers / Legal risk / Complexity / Business impact → **Verdict**.

### 1.1 Child Development Digital Twin

| Dimension | Assessment |
|---|---|
| Why valuable | Longitudinal cross-stakeholder record is Arbor's stated moat; professionals genuinely lack between-session visibility. |
| Why it fails | **Professionals will not double-enter data.** NL therapists live in EPDs (declaration-linked, legally required); schools live in leerlingvolgsystemen (ParnasSys/Esis). A second record system is a burden, not a product. "Digital Twin" framing invites building a data platform before anyone asks for one. |
| Competition | EPD vendors, school LVS, Therapieland/Minddistrict (e-health modules), paper + parent memory. |
| Adoption barriers | Data-entry time; medico-legal ambiguity (which record is authoritative? Answer must be: theirs, not ours); professional skepticism of parent-reported data. |
| Legal/privacy | Child developmental data ≈ health data (GDPR Art. 9 special category) + Art. 8 child consent; cross-org sharing needs a legal basis *per stakeholder*; data-minimization scrutiny in any DPIA. |
| Complexity | **Low for us** — Arbor already has ~80%: Child Memory ledger, Story timeline, milestones, behaviors, screening, Growth Plans. The delta is a *scoped professional read-view* + lightweight observation capture. |
| Business impact | High *indirectly* — it's what makes the session brief and the handoff valuable. Zero direct revenue. |

**Verdict: REFRAME, don't build.** There is no new "Digital Twin" system. The twin already
exists — it's the parent-maintained child record. Ship it to professionals as **read-scoped
views over existing data** (via Trusted Sharing grants), plus a 30-second observation capture
(voice/text note tagged to the child) for pros who *want* to contribute. Professionals consume;
parents and AI produce. The authoritative clinical record stays in the professional's EPD —
Arbor is explicitly the *between-sessions* layer, never the chart.

### 1.2 Professional-to-Home Intervention Engine

| Dimension | Assessment |
|---|---|
| Why valuable | **The strongest concept — it IS the "OS between sessions" thesis.** Home carryover is the known weak link in pediatric speech/OT/behavioral therapy; today it's PDFs, WhatsApp, and hope. A therapist's prescription arriving as a living, AI-coached Growth Plan is a real 10× over a PDF: personalized to the child's profile, reminded, adapted when it fails, and visible back to the therapist. |
| Why it fails | If prescribing takes longer than WhatsApp, therapists won't. If parents experience it as homework-on-top-of-homework, they disengage. If the AI silently modifies a professional's protocol, trust dies on both sides. |
| Competition | TheraPlatform/embedded HEP tools, printed home programs, generic homework apps. None own the parent side with an AI coach + child memory. That's the differentiation — defensible because it requires our B2C product to exist. |
| Adoption barriers | Therapist time (<60s to prescribe or dead); template coverage per discipline (SLT ≠ OT ≠ psych); parent fatigue. |
| Legal/privacy | Framing matters: **"home practice support," never "treatment delivery"** — treatment framing walks into MDR. AI adaptation of a prescribed activity must be bounded (tone/scheduling personalization yes; protocol changes no, or flagged back to the prescriber). |
| Complexity | Medium. Growth Plans + Trusted Sharing + Reports exist. New: prescribe→accept→track loop, template library per discipline, carryover signal back. |
| Business impact | **Highest of the five.** Drives the €45 seat, drives parent retention, generates the engagement data the institutional pitch needs ("X% home-practice completion vs ~30% industry baseline"). |

**Verdict: BUILD — this is the wedge.** Everything else in the professional platform exists to
make this loop work.

### 1.3 AI Clinical Copilot

| Dimension | Assessment |
|---|---|
| Why valuable | Session-prep time is real pain (10–15 min/child reading notes). A 60-second brief from between-session data is an honest, immediate win. |
| Why it fails | **Regulatory wall.** Under MDR Rule 11, software providing information used for diagnostic or therapeutic decisions is a medical device (Class IIa+); the EU AI Act layers high-risk obligations on top. "Identify risks" and "suggest next interventions" to a clinician is squarely that territory. Also: hallucinated patterns in a clinical context are reputation-fatal; pros will test it adversarially. |
| Competition | General LLMs (the therapist pastes notes into ChatGPT today — with worse privacy); EPD vendors adding AI summaries. |
| Adoption barriers | Clinical trust; "is this validated?"; professional bodies' AI guidance. |
| Legal/privacy | The line that matters: **summarizing data the professional already has access to = information organization (defensible). Generating clinical inferences/recommendations = medical device (not now).** |
| Complexity | Low for the summarizer (our AI pipeline + contracts + Gemini Flash do this today for Reports). High for the inference layer — and it's gated on regulatory strategy anyway. |
| Business impact | Medium — it's the daily-use hook that keeps the pro logging in, which protects the seat. |

**Verdict: DESCOPE to "Session Brief."** Ship: pre-session summary of shared-scope data
(activity completion, parent observations, milestone changes, flagged moments) with **every
sentence provenance-linked to a source entry**, a visible "information summary — not clinical
advice" contract, and zero unsourced inferences. Defer pattern-detection/risk-flagging/intervention-suggestion to a V2+ with a real regulatory opinion. Safeguards: human-in-the-loop always; no
autonomous alerts to third parties; professional sees exactly what the parent shared, nothing more.

### 1.4 Parent Compliance Intelligence

| Dimension | Assessment |
|---|---|
| Why valuable | The underlying question is legitimate: "is the home program actually happening?" — without it the intervention loop is open-ended. |
| Why it fails | **As specified, this is the most dangerous concept in the brief.** The parent is our paying customer and trust anchor; an app that scores parents for "compliance" and reports it to authority figures converts a coach into a surveillance device. Predictable failures: (a) parents stop logging honestly → data worthless; (b) a "low-compliance" label leaks into a youth-care context and becomes a safeguarding signal it was never designed to be → real harm + liability; (c) completion data is sparse and gameable, so the "score" is pseudo-precision. |
| Legal/privacy | Profiling parents (GDPR Art. 22 adjacency), purpose-limitation problems if engagement data flows into institutional reporting, DPIA red flag. |
| Complexity | Low to build, high to build *responsibly*. |
| Business impact | The honest version is necessary plumbing for the wedge; the scored version destroys the B2C engine that funds the company. |

**Verdict: REJECT the scoring model. REBUILD as "Carryover Signal."** Principles:
1. **Symmetric transparency** — the parent sees *exactly* what the professional sees, pixel-identical.
2. **No composite score, no ranking, no "compliance" vocabulary** anywhere. Show raw, honest signals: sessions done this week, streaks, parent-reported difficulty, parent notes.
3. **Effort framing** — the surface celebrates attempts and surfaces *barriers* ("we tried, she refused" is a clinically useful data point, not a failure).
4. **Parent-controlled scope** — sharing activity data is a Trusted Sharing scope the parent grants and can revoke.
5. The professional-side insight is **"is the plan working / too hard / abandoned — adjust it,"** not "is this parent adherent."

### 1.5 Care Network Intelligence

| Dimension | Assessment |
|---|---|
| Why valuable | Multi-stakeholder coordination around a child is a real systemic gap (the NL "1 gezin, 1 plan" policy ambition exists precisely because nobody does this). |
| Why it fails | **Cold start squared.** It needs ≥2 professionals + a school active on the *same child* in Arbor — we don't have one professional yet. Multi-party messaging also drags us toward communications-platform compliance (retention, discovery, professional-secrecy rules) and OT-vs-teacher permission edge cases that consume quarters. |
| Competition | Email, phone, the parent-as-courier (the incumbent), MDO meeting notes. |
| Legal/privacy | Hardest of the five: inter-professional sharing of child data crosses organizational legal bases; teachers and clinicians have different confidentiality regimes. |
| Complexity | High. |
| Business impact | High *eventually* — it's the longitudinal-intelligence-platform endgame and the institutional differentiator — but zero at current adoption. |

**Verdict: DEFER the collaboration layer; KEEP the permissions foundation.** Trusted Sharing
(scoped, time-boxed, revocable, server-enforced — already live) *is* the Care Network
permissions model. Every wedge feature must build on share grants so that when ≥50 children
have ≥2 active professionals, the network layer is an unlock, not a rebuild. Until then, the
parent remains the hub — which is also the GDPR-cleanest topology.

### Phase 1 summary

| Concept | Verdict | Investment now |
|---|---|---|
| Digital Twin | Reframe → scoped views over existing record | Small |
| Intervention Engine | **Build — the wedge** | Main |
| AI Clinical Copilot | Descope → provenance-linked Session Brief | Small |
| Compliance Intelligence | Reject scoring → honest Carryover Signal | Small |
| Care Network Intelligence | Defer; keep Trusted Sharing as foundation | None new |

---

## Phase 2 — The redesigned professional platform

### 2.1 The product in one sentence

> **A professional prescribes a home program in under a minute; the parent receives it as a
> living, AI-coached plan; the professional walks into the next session already knowing what
> happened — all on data the parent explicitly shared.**

One loop. Five touchpoints. Everything else is deferred until this loop retains professionals.

### 2.2 The loop (therapist → parent → child → back)

```
┌─ PROFESSIONAL ─────────────┐      ┌─ PARENT (existing app) ──────────┐
│ 1. PRESCRIBE               │      │ 2. RECEIVE & ACCEPT              │
│  pick template / adapt /   │ ───▶ │  plan appears as Growth Plan,    │
│  freehand · set dose       │      │  personalized to child profile,  │
│  (<60s, from session)      │      │  AI coach knows it               │
│                            │      │ 3. EXECUTE                       │
│ 5. SESSION BRIEF           │      │  guided steps · quick-log (done/ │
│  60s provenance-linked     │ ◀─── │  hard/refused + note) · coach    │
│  summary: activity, notes, │      │  helps when stuck                │
│  barriers, milestones      │      │ 4. CARRYOVER SIGNAL              │
│  → adjust the plan (→1)    │      │  parent-visible, scope-granted   │
└────────────────────────────┘      └──────────────────────────────────┘
```

**Why this beats PDFs/WhatsApp (the honest answer):** not the delivery channel — WhatsApp
delivers fine. The 10× is (a) the plan is *alive*: personalized, reminded, AI-supported at the
moment of execution; (b) the loop *closes*: the professional learns what happened before the
next session instead of asking "did you practice?"; (c) the child's context compounds: every
prescription lands on top of the longitudinal record, so plan #3 is smarter than plan #1.

### 2.3 What we build per concept (post-evaluation shape)

**Shared Child Record (was "Digital Twin")**
- Professional sees, per share grant scope: Story timeline, milestones + Development Check
  results, behavior moments, Child Memory facts, active plans, prior reports.
- New entity: `observations` — 30-second pro note (text/voice→text), tagged to child, visible
  to parent (symmetry), feeding the timeline.
- Explicit non-goal: clinical documentation, billing, scheduling. The EPD stays authoritative.

**Prescription flow (Intervention Engine)**
- Template library per discipline (SLT/OT/behavioral/sleep), seeded from our 10
  scholar-grounded routine plans + commissioned per design-partner discipline.
- Prescribe = choose template → AI pre-adapts to child (age, language, profile) → professional
  reviews/edits → set dose & duration → send. Target <60 seconds.
- Parent accepts → becomes a Growth Plan with a `prescribedBy` provenance badge. The AI coach
  may personalize delivery (tone, timing, framing) but **never alters protocol content**; "this
  isn't working" routes a flag to the prescriber instead.

**Carryover Signal (was Compliance Intelligence)**
- Per prescribed plan: completion events, parent-reported difficulty (easy/ok/hard/refused),
  free-text barriers, streak. No composite score. Pixel-identical parent and pro views.

**Session Brief (was AI Clinical Copilot)**
- On-demand + pre-appointment: Gemini Flash summary over shared-scope data since last brief;
  every claim links to its source entry; standing "summary, not clinical advice" frame.
- Reuses the existing Reports pipeline + Zod contracts; new prompt + provenance post-processor.

**Foundation (was Care Network Intelligence)**
- Trusted Sharing extended with professional role types + per-capability scopes
  (`record:read`, `plans:prescribe`, `signal:read`, `observations:write`).
- Pro-side inbound view = the existing `sharedWithMe` surface, upgraded to a caseload list.

### 2.4 UX architecture

- **Professional surface = separate lightweight web portal** (same codebase, `role=professional`
  shell): Caseload list → Child view (Record · Plans · Signal · Briefs) → Prescribe flow.
  Mobile-friendly; no native app.
- **Parent surface changes are minimal:** prescribed plans appear in Growth Plans with the pro's
  badge; sharing-grant flow gains "invite your professional" (email link → pro onboarding).
  This matters: **the parent invites the professional**, not the reverse — it matches the trust
  topology, the GDPR basis, and our B2C-first distribution.

---

## Phase 3 — Prioritization

**Top 5 for professional adoption**
1. <60s prescribe flow with discipline templates
2. Session Brief (provenance-linked, zero prep)
3. Caseload inbound view over share grants (zero data entry)
4. Carryover Signal with barrier notes ("why it didn't happen" is clinical gold)
5. Professional-grade PDF reports they can drop into their own EPD (extends existing 8 types)

**Top 5 for parent value**
1. Prescribed plan as living AI-coached Growth Plan (vs. crumpled PDF)
2. AI coach aware of the active home program at the moment of struggle
3. "My therapist sees my effort, not a score" symmetric signal
4. One shared record → stop re-telling the child's story to every new professional
5. Revocable, scoped control over exactly what each professional sees

**Top 5 for healthcare organizations**
1. Carryover/engagement outcomes data (the prevention-budget business case)
2. DPIA-backed, audit-logged, parent-consented sharing model (procurement pass)
3. PMPM-ready license administration + activation metering
4. Population-level anonymized engagement reporting (cohort, not child)
5. Waitlist-time activation: structured home support while families wait for care (NL waitlists are the institutional pain)

**Top 5 for competitive moat**
1. Closed prescribe→execute→signal loop (requires owning BOTH sides; chatbots and EPDs each own one)
2. Longitudinal child memory under the loop (every cycle compounds)
3. Parent-consent-native sharing architecture (regulatory moat — hard to retrofit)
4. Discipline template library × AI personalization (content moat, grows per design partner)
5. Cross-stakeholder graph latent in share grants (the future network layer)

**Top 5 for a successful pilot (centers / insurers / HMOs / systems)**
1. The working loop with 10–20 design-partner professionals (proof, not promise)
2. Compliance dossier: DPIA, Art. 8 consent flows, export/erasure, audit logs, EU data residency
3. Pilot success metrics wired in: carryover %, parent activation, pro time saved, satisfaction
4. Org admin: cohort onboarding, license activation, anonymized dashboard
5. Localization NL (parent surface Dutch; pro surface can stay English initially)

---

## Phase 4 — Execution plan

### 4.1 Entities (Firestore, extending current model)

```
professionals/{proId}            profile, discipline, verification status, seat billing
shareGrants/{grantId}            EXISTS — add roleType, scopes[], proId
prescriptions/{rxId}             childId, proId, templateId, adaptedContent, dose,
                                 duration, status(draft|sent|accepted|active|completed|flagged)
templates/{templateId}           discipline, age band, protocol steps, evidence notes, locale
observations/{obsId}             childId, proId, text, createdAt, parentVisible:true (always)
carryoverEvents/{eventId}        rxId, type(done|hard|refused|skipped), note, ts
briefs/{briefId}                 childId, proId, generatedAt, content, sourceRefs[]
orgs/{orgId} (V2)                license admin, activation metering
```
Parent-side data stays where it is; professional surface reads through grant-scoped queries.
Audit log on every cross-boundary read/write (WAF SEC item — prerequisite, not feature).

### 4.2 Permission model

- Grant-scoped capabilities: `record:read`, `plans:prescribe`, `signal:read`, `observations:write` — default minimal, parent-editable, time-boxed, revocable (Trusted Sharing semantics, server-enforced as today).
- Symmetry invariant (architectural, not policy): **no professional-visible artifact without a parent-visible rendering.**
- Org layer (V2): org admin sees activation/aggregate only — never child-level data.

### 4.3 API surface (Express `routes/api.ts` pattern, Zod contracts)

`POST /api/pro/prescriptions` · `GET /api/pro/caseload` · `GET /api/pro/children/:id/record`
· `POST /api/pro/observations` · `POST /api/pro/briefs:generate` · parent: `POST /api/prescriptions/:id/accept` · `POST /api/carryover` — all gated by grant-scope middleware + audit log + per-seat rate caps (global store, not in-memory — COST item lands first).

### 4.4 AI architecture

- Session Brief + template adaptation → **Gemini 2.5 Flash** (~$0.004/turn; pro COGS negligible vs €45 seat).
- Coach-during-execution → existing router (Claude for high-stakes).
- Provenance post-processor: every brief sentence carries `sourceRefs[]`; unverifiable sentences dropped.
- PII redaction before any LLM call (WAF SEC) — **blocking prerequisite**.
- MDR guardrail in the contract layer: briefs and adaptations are template-bound; no generated clinical recommendations.

### 4.5 Compliance (gates, in order)

1. DPIA covering the professional data flows (engage fractional DPO — already in the Y1 budget)
2. GDPR Art. 8 consent UX + export/erasure (CMP backlog — also a B2C gap)
3. Audit logging + PII redaction (SEC backlog)
4. Written MDR/AI-Act boundary opinion: "home practice support + information summarization, non-diagnostic" — one-time legal spend, reused in every institutional procurement
5. EU residency already satisfied (`europe-west4`); add DR before institutional SLAs (REL backlog)

### 4.6 Roadmap

| Stage | Scope | Gate to next |
|---|---|---|
| **MVP (design partners)** | Invite-your-pro flow · caseload view · prescribe v0 (templates, 1–2 disciplines) · carryover signal · compliance gates 1–3 | 10–20 active pros; ≥60% of prescribed plans accepted+started; pros return weekly w/o prompting |
| **V1 (paid pro tier)** | €45 seat billing · Session Brief · observations · template library ×4 disciplines · pro PDF reports · NL parent localization | ≥50 paying seats or 1 signed institutional pilot |
| **V2 (institutional pilot)** | Org admin + PMPM metering · cohort onboarding · anonymized outcome dashboard · waitlist-activation packaging · practice tier (shared caseload, supervisor) | Pilot KPIs met → PMPM conversion |
| **Long-term** | Care-network collaboration layer (when ≥50 children have ≥2 pros) · school role · outcome instruments (e.g., goal-attainment scaling) · marketplace (Phase 5 — after trust, per pricing doc) | — |

**Rejected for complexity without measurable value (standing list):** clinic scheduling/billing
(EPDs own it), in-app pro↔parent chat at MVP (WhatsApp substitution is a V2+ question; messaging
drags compliance), composite compliance scores (§1.4), autonomous AI risk alerts (§1.3),
native pro mobile app, multi-party case conferencing (§1.5).

---

## Decision

Build the **prescribe → execute → signal → brief loop** as a thin professional wedge on top of
Trusted Sharing and Growth Plans, with design partners, behind the compliance gates — and
explicitly do **not** build a digital-twin data platform, a compliance-scoring system, a
clinical-inference copilot, or a multi-stakeholder collaboration suite this year.

## Why it wins

It is the only scope that (a) serves the professional engine's real job — trust, referral CAC,
institutional credibility — at a cost matched to its 4%-of-revenue size, (b) deepens the B2C
moat instead of forking the company into a CRM vendor, and (c) walks into Y2 institutional
pilots with proof instead of decks.

## Next artifact

`prd-professional-wedge-v1.md` — PRD for the MVP slice (invite-your-pro, caseload view,
prescribe v0, carryover signal), including the design-partner recruitment plan (target: 5 SLTs,
5 OTs/behavioral, via the IL expert network) and the compliance-gate checklist as launch blockers.
