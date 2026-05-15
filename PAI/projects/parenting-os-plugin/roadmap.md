# Arbor Roadmap — AI Child Development Platform

Last updated: 2026-05-15
Owner: PAI
Status: Draft v1

---

## 1. Product Decision

Build Arbor as a **developmental operating system for families**, not as a generic parenting chatbot, therapy replacement, or medical symptom checker.

Initial wedge:

> Help parents turn stressful one-off questions into calm guidance, child-specific memory, developmental tracking, and professional-ready handoff notes.

Primary market path:

1. **Netherlands** — trust, institutional pilots, schools, municipalities, insurers, youth-care ecosystem.
2. **Israel** — expert/content engine, professional depth, therapeutic and educational knowledge.
3. **Belgium / EU** — expansion after proof of safety, privacy, and outcomes.

---

## 2. North Star

Arbor helps parents answer six recurring questions:

1. What is happening with my child?
2. Is this normal, urgent, or a pattern?
3. What should I do today?
4. What should I track over time?
5. When should I involve a professional?
6. How do I create structure, meaning, responsibility, and emotional safety at home?

Strategic moat:

> Longitudinal developmental intelligence: child profile, family context, interaction history, intervention outcomes, routines, professional notes, and localized guidance improving over time.

---

## 3. Roadmap Thesis

Start narrow. Win trust. Expand.

Do **not** start with marketplace, broad curriculum, AR, school platform, or medical workflows. Start with the trust layer:

- Parent question intake
- Child profile memory
- Safety triage
- Developmental guidance
- Practical action plan
- Tracking prompts
- Professional escalation note

If this works, Arbor becomes the memory layer and guidance interface for family development.

---

## 4. Phase 0 — Foundation Sprint

Timeline: Week 0–2
Goal: Define the product spine before building screens.

### Deliverables

- PRD v1
- Data model v1
- Safety policy v1
- Parent intake template v1
- AI response policy v1
- First 20 canonical parent scenarios
- Landing-page positioning draft

### Key Decisions

- Age range: 0–12, but MVP examples should focus on 2–8 because behavior, routines, language, school readiness, and emotional regulation are urgent and common.
- Product category: co-support platform for parents and professionals.
- Risk posture: no diagnosis, no prescribing, no emergency care, no therapy cosplay.
- First wedge: parent question → structured answer → child memory → follow-up tracking.

### Exit Criteria

- One-page PRD approved.
- Safety boundaries written.
- First demo flow can be described in under 60 seconds.
- 20 parent scenarios mapped to expected AI behavior.

---

## 5. Phase 1 — Concierge MVP

Timeline: Week 2–6
Goal: Validate user value before overbuilding.

### Build

1. Parent question intake
2. Child profile capture
3. Safety triage
4. AI-generated guidance response
5. Practical action plan
6. Tracking prompts
7. Professional handoff note
8. Memory update after each interaction

### MVP User Flow

1. Parent enters question.
2. Arbor asks only essential clarifying questions.
3. Arbor classifies risk: low / medium / high / urgent.
4. Arbor gives a calm practical plan for today.
5. Arbor suggests what to track.
6. Arbor creates or updates the child profile.
7. Arbor generates a concise professional note if escalation is useful.

### Manual-First Implementation

Use a lightweight stack first:

- Form or chat interface
- Markdown/JSON child profile
- Scenario library
- Human review for early high-risk cases
- Weekly learning review

### Success Metrics

- 20–30 parent testers onboarded.
- 100+ parent questions processed.
- 70%+ responses rated “useful today.”
- 50%+ parents return with a second question.
- Zero unsafe escalations missed in review.

### Exit Criteria

- Parents trust the answers.
- Child memory improves follow-up quality.
- Safety triage is conservative and reliable.
- At least 5 recurring use cases emerge.

---

## 6. Phase 2 — Private Beta Product

Timeline: Month 2–4
Goal: Turn concierge MVP into repeatable product.

### Build

- Parent account
- Child profiles
- Developmental timeline
- Conversation history
- Intervention tracker
- Routine builder
- Professional handoff export
- Admin review dashboard
- Feedback loop on every answer

### Core Features

#### A. Parent Guidance
- Structured answer format
- Do Today actions
- Track over time
- Escalate if triggers

#### B. Developmental Memory
- Child age and context
- Parent concerns
- Past interventions
- Outcomes
- School/daycare notes
- Family routines

#### C. Safety Triage
- Emergency escalation
- Professional assessment recommendation
- Non-diagnostic language
- Conservative handling of autism, ADHD, speech delay, trauma, anxiety, medical-adjacent issues

#### D. Professional Note
- Situation summary
- Observed behaviors
- Timeline
- What was tried
- Questions for pediatrician / psychologist / educator

### Success Metrics

- 100–250 beta families.
- 30%+ weekly active usage among onboarded families.
- 40%+ of active families create at least one child timeline entry.
- 25+ professional handoff notes generated.
- Qualitative evidence of reduced parent confusion or better professional conversations.

### Exit Criteria

- Beta retention is real.
- Top 10 use cases are clear.
- Safety review process is stable.
- Data model supports longitudinal intelligence.

---

## 7. Phase 3 — Professional Co-Support Layer

Timeline: Month 4–8
Goal: Make Arbor useful to pediatric professionals, educators, parent coaches, and municipalities.

### Build

- Professional dashboard
- Parent-shared child summary
- Structured intake forms
- Observation timeline
- Intervention plan tracking
- Consent and sharing controls
- Case notes export
- Organization admin model

### First Professional Segments

1. Child development professionals
2. Parent coaches
3. Pediatric-adjacent practices
4. Schools / daycare support teams
5. Municipality family-support pilots

### B2B2C Pilot Offer

> Arbor helps families prepare better intake notes, track patterns between appointments, and turn professional advice into daily routines.

### Success Metrics

- 3–5 professional design partners.
- 1 institutional pilot in Netherlands.
- 50+ professional-reviewed cases.
- Evidence that Arbor reduces intake friction or improves follow-through.

### Exit Criteria

- Professionals see Arbor as support, not competition.
- Consent model is understandable.
- Institutional buyer pain is validated.

---

## 8. Phase 4 — Localized Market Expansion

Timeline: Month 8–12
Goal: Build country-specific credibility and monetization.

### Netherlands Track

- Dutch-language flows
- Jeugdgezondheidszorg / school / municipality mapping
- Privacy-first institutional story
- B2B2C pilots
- Subsidized prevention framing

### Israel Track

- Expert advisory circle
- Hebrew content and professional workflows
- Content depth and parenting-method library
- Clinical/educational review partnerships

### Belgium / EU Track

- Prepare only after Netherlands proof.
- Reuse EU privacy and institutional compliance work.

### Monetization Tests

- B2C subscription for parents
- Professional dashboard subscription
- Institutional pilot fee
- Premium assessment/report workflow
- Localized content pack

### Success Metrics

- First paying parent cohort.
- First paid professional or institutional pilot.
- Clear willingness-to-pay by segment.
- Repeat usage around routines, behavior, and developmental tracking.

---

## 9. Phase 5 — Platform & Moat

Timeline: Year 2
Goal: Make Arbor the trusted developmental intelligence layer.

### Build

- Longitudinal pattern detection
- Personalized routine recommendations
- Multi-child family model
- School/daycare collaboration tools
- Expert-reviewed knowledge packs
- Marketplace for human expert escalation
- API/data partnerships only where ethical, legal, and value-aligned

### Possible Expansion Modules

- Personalized therapeutic stories
- AR emotional regulation exercises
- School readiness plan
- Speech/language observation tracker
- Screen-time reset program
- Parent-child conflict repair scripts
- Family responsibility/routine system

### Strategic Rule

Only add expansion modules when they strengthen the core loop:

> Ask → understand → act → track → learn → escalate if needed.

---

## 10. Non-Goals

Do not build in the first 12 months:

- Diagnosis engine
- Therapy replacement
- Emergency service
- Open-ended generic chatbot
- Full expert marketplace
- Complex school communication platform
- Claims about medical outcomes without evidence
- Large content library without personalization
- AR/gamified child experiences before parent trust is proven

---

## 11. Product Architecture Roadmap

### Data Objects

- Parent profile
- Child profile
- Family context
- Question/intake record
- Risk classification
- Guidance response
- Action plan
- Tracking prompt
- Intervention outcome
- Professional note
- Consent/share record
- Knowledge source reference

### AI Behaviors

- Ask minimal clarifying questions.
- Classify risk conservatively.
- Give practical parent actions.
- Store only useful longitudinal memory.
- Avoid diagnosis and unsupported claims.
- Create professional-ready summaries.
- Improve from outcomes and feedback.

### Knowledge System

- Markdown-first canonical knowledge base.
- Atomic notes by scenario, age range, concern, and intervention.
- Source-grounded answer generation.
- Versioned safety rules.
- Review queue for uncertain or high-risk categories.

---

## 12. 30 / 60 / 90 Day Execution Plan

### Next 30 Days

- Write PRD v1.
- Define data model v1.
- Define safety policy v1.
- Build parent-question intake prototype.
- Create 20 scenario tests.
- Recruit 10–20 friendly parent testers.
- Run concierge responses manually or semi-manually.

### Next 60 Days

- Build child profile memory.
- Add developmental timeline.
- Add safety triage labels.
- Add feedback rating.
- Generate professional handoff notes.
- Review first 100 questions.
- Identify top 5 use cases.

### Next 90 Days

- Launch private beta.
- Add parent account and profile persistence.
- Add admin review dashboard.
- Recruit 2–3 professional advisors.
- Package Netherlands institutional pilot narrative.
- Decide first paid offer.

---

## 13. Immediate Next Artifacts

Create these files next:

1. `PAI/projects/parenting-os-plugin/prd-v1.md`
2. `PAI/projects/parenting-os-plugin/data-model-v1.md`
3. `PAI/projects/parenting-os-plugin/safety-policy-v1.md`
4. `PAI/projects/parenting-os-plugin/scenario-library-v1.md`
5. `PAI/projects/parenting-os-plugin/gtm-netherlands-v1.md`

---

## 14. CoS / PAI Recommendation

Proceed with **Phase 0 immediately**.

The next best move is not building a full app. It is creating a tight PRD, scenario library, safety policy, and concierge prototype that proves parents trust Arbor enough to return with real problems.
