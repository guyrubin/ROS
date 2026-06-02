# memory.md — Persistent Product Memory

## Product Name

Working names:
- Arbor
- Parenting OS
- Family Development OS

Preferred strategic positioning:

> Arbor: the developmental operating system for modern families.

---

## Founder Intent

The platform should become the authoritative parent guide from birth to age 12.

It should answer parent questions across:
- psychology
- behavior
- emotional regulation
- routines
- education
- language learning
- autism spectrum concerns
- school readiness
- family communication
- medical-adjacent questions
- creative solutions such as personalized stories and AR experiences

---

## Strategic Inspiration

Jordan Peterson inspiration:
- family order
- meaning
- responsibility
- discipline with warmth
- truth-telling
- developmental competence
- practical problem-solving
- moral and emotional development

Do not copy tone or ideology. Convert the inspiration into product principles.

---

## Knowledge System Inspiration

Andrej Karpathy inspiration:
- markdown-based knowledge base
- small composable notes
- source-grounded knowledge
- memory as infrastructure
- AI as interface over structured knowledge
- fast iteration and artifact generation
- build the system like a personal/team operating system

---

## Product Thesis

Most parenting platforms fail because they are either:
1. content libraries,
2. generic chatbots,
3. medical symptom checkers,
4. therapy marketplaces,
5. fragmented school/parent communication tools.

Arbor should combine:
- trusted knowledge
- personal child context
- longitudinal memory
- actionable guidance
- human professional escalation
- local market integration

---

## Core Moat

The moat is not content.

The moat is:
- child profile memory
- developmental timeline
- parent interaction history
- intervention outcomes
- professional notes
- family routines
- localization by country and culture
- pattern recognition over time

Strategic phrase:

> Longitudinal developmental intelligence.

---

## Target Users

### Parent
Needs calm, actionable advice in stressful moments.

### Child Development Professional
Needs structured intake, observation history, and intervention tracking.

### Educator / Daycare / School
Needs communication, behavior context, and practical support plans.

### Municipality / Insurer / Health System
Needs scalable early support, prevention, triage, and cost reduction.

---

## Market Strategy

### Israel
Use as content and professional expertise engine.
Strong parenting, therapy, child-development, and education ecosystem.

### Netherlands
Use as institutional scaling market.
Focus on municipalities, schools, youth care, insurers, and subsidized family support.

### Belgium / EU
Secondary expansion market after proof of model.

---

## Business Model

Revenue streams:
1. B2C subscription for parents.
2. B2B2C institutional licensing.
3. Professional dashboard subscription.
4. Premium assessments and reports.
5. Human expert marketplace take-rate.
6. Localized content/curriculum packs.
7. API/data partnerships where legally and ethically appropriate.

---

## MVP Scope

MVP must include:
- parent question intake
- child profile
- safety triage
- age-based developmental guidance
- practical action plan
- tracking prompts
- escalation note for professionals
- knowledge base memory

MVP must not include:
- diagnosis
- autonomous treatment plans
- emergency handling beyond escalation
- unsupported medical claims
- over-complex marketplace features

---

## Product Personality

The product should feel:
- calm
- serious
- useful
- warm
- intelligent
- structured
- non-judgmental
- high-agency

Avoid:
- childish UX
- generic chatbot tone
- over-medicalization
- therapy cosplay
- spiritual fluff
- moral preaching

---

## Key Differentiator

Arbor should turn one-off parent questions into accumulated developmental intelligence.

Every interaction should improve:
- the child profile
- the family context
- the intervention history
- future recommendations
- professional handoff quality

---

## Implementation Status — 2026-06-02 (capability backlog build)

Canonical app: `PPPPtherapy-/app` (React/Express). Work landed on branch
`feat/capability-backlog` in 6 verified, tested waves (47 unit tests + build +
browser verification, no console errors). Local-first persistence
(localStorage, child-scoped); Firestore swap-in seam preserved.

**Shipped:**
- **Closed loop (W1):** coach answers save as plans, `observe[]` → tracking
  prompts, follow-up check-ins capture outcomes that feed back into the prompt,
  per-answer "useful?" feedback, the load-bearing Six-Frame surfaced inline.
  Everything persists across refresh.
- **Story/grounding (W2):** illustrated stories (Imagen, graceful fallback),
  discussion questions, one-click analysis→plan, accumulated handoff notes,
  handoff Markdown download + print stylesheet + cloud share, source-card
  grounding, legible Scholar Lenses.
- **Safety (W3):** real localized crisis resources (NL/IL/intl — Veilig Thuis,
  ERAN/1201, 112) replacing placeholders; semantic "elevated concern" gate +
  model-risk gate above the regex; server-backed high-risk review queue with
  Safety-tab UI.
- **11pm capabilities (W4):** always-available panic button → calm overlay
  (breathing pacer, co-regulation scripts, offline client-side crisis screen),
  voice input (STT) + read-aloud (TTS), locale-aware.
- **Identity (W5):** multi-child family model + onboarding (age from birth
  month) + child switcher; de-grandified copy ("What's happening with <child>
  today?"); removed false HIPAA claim and `select-none`.
- **Governance + modules (W6):** pattern detection (recurring/rising/trigger),
  GDPR export + hard delete, retention enforcement (expiry sweep), guided
  starters (sleep, responsibility ladder, mealtime, screen-time), one-tap
  pediatric visit-prep.

**Design note:** the warm-paper "field-notebook" aesthetic is already applied
at runtime via the `.arbor-app` override layer in `index.css` (the dark-gold
JSX hex values are remapped). D-01 is effectively done; the earlier "app is
dark-gold" read was from the JSX source, not the rendered output.

**Deferred (need external decisions or larger effort), not yet built:**
- E-09 photo/video multimodal logging — **requires legal/AVG review first.**
- E-04 co-parent shared mode — needs real multi-user auth/sharing infra.
- A-11 full UI localization (NL/HE) — crisis resources are localized; full i18n
  is a separate pass.
- K-10 confidence calibration, K-08 deeper frame-routing-as-decision.
- D-07 design-token refactor, D-06 full WCAG audit, E-08 toileting, E-10 keepsake.
- Firestore migration of the new local-first stores for production.
