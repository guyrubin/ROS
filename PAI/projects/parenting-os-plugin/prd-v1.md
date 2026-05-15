# PRD v1 — Arbor AI Child Development Platform

Last updated: 2026-05-15
Owner: PAI
Source: `source-prds/claude-cowork-parenting-os-plugin.md`, `roadmap.md`
Status: Phase 0 working draft

---

## 1. Problem

Parents face stressful, recurring questions about behavior, routines, emotional regulation, language, school readiness, and developmental concerns. Existing options are fragmented: generic content libraries, generic chatbots, medical symptom checkers, therapy marketplaces, and school communication tools. None reliably combine immediate guidance with child-specific memory, developmental context, tracking, and professional-ready handoff.

## 2. User

### Primary user: Parent
Needs calm, practical, non-judgmental guidance in the moment and a way to understand patterns over time.

### Secondary user: Child development professional / parent coach / educator
Needs structured intake, observation history, what was tried, and outcome tracking.

### Institutional user: Municipality / insurer / school / youth-care ecosystem
Needs scalable early support, prevention, triage, and better prepared families without replacing professional care.

## 3. Job To Be Done

When I am worried about my child, I want Arbor to help me understand what may be happening, what I should do today, what to track, and when to involve a professional, so I can act calmly and build a useful developmental record over time.

## 4. MVP Scope

The MVP focuses on the trust loop:

1. Parent question intake
2. Child profile capture
3. Safety triage
4. Age-based developmental guidance
5. Practical action plan
6. Tracking prompts
7. Professional handoff note
8. Memory update after each interaction

Initial age focus: **2–8** inside the broader 0–12 vision, because behavior, routines, emotional regulation, speech/language, and school readiness are frequent high-value use cases.

## 5. Non-Goals

- Diagnosis engine
- Therapy replacement
- Medical device
- Emergency service
- Autonomous treatment planning
- Full expert marketplace
- Broad content library
- School communication platform
- AR/gamified child layer before parent trust is validated

## 6. User Flow

1. Parent opens Arbor and asks a question.
2. Arbor identifies missing essentials: child age, situation, duration/frequency, safety concerns, what parent tried, and parent goal.
3. Arbor classifies risk: low / medium / high / urgent.
4. Arbor answers in a structured format:
   - Read
   - Risk Level
   - Do Today
   - Track
   - Escalate If
5. Arbor asks permission to save useful details to child memory.
6. Arbor creates follow-up tracking prompts.
7. If useful, Arbor generates a professional handoff note.
8. Parent returns later; Arbor uses the timeline and prior outcomes to improve guidance.

## 7. Data Model

Core objects:

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

## 8. AI Behavior

Arbor must:

- Ask minimal clarifying questions.
- Be calm, structured, non-alarmist, and practical.
- Classify safety risk conservatively.
- Never diagnose or prescribe.
- Distinguish normal variation, patterns to monitor, and escalation triggers.
- Convert guidance into concrete parent actions.
- Store only durable, useful memory.
- Produce professional-ready summaries when needed.
- Use source-grounded developmental knowledge.

## 9. Safety / Compliance

Safety posture:

- Urgent escalation for self-harm, harm to others, abuse/neglect, severe medical symptoms, breathing problems, seizures, loss of consciousness, serious allergic reaction, suspected poisoning, acute regression with symptoms, psychosis/mania/severe dissociation.
- Educational guidance only for medical-adjacent questions.
- No diagnosis for autism, ADHD, speech delay, trauma, anxiety, or behavioral issues.
- Professional assessment recommended when patterns or red flags warrant it.
- Privacy and consent are product requirements, not backend details.

## 10. Success Metrics

Phase 1 concierge MVP:

- 20–30 parent testers onboarded
- 100+ parent questions processed
- 70%+ responses rated “useful today”
- 50%+ parents return with a second question
- Zero unsafe escalations missed in review

Private beta:

- 100–250 beta families
- 30%+ weekly active usage among onboarded families
- 40%+ active families create at least one child timeline entry
- 25+ professional handoff notes generated
- Qualitative evidence of reduced parent confusion or better professional conversations

## 11. Build Plan

### Phase 0 — Foundation Sprint

- Approve this PRD v1.
- Finalize data model v1.
- Finalize safety policy v1.
- Create 20 scenario tests.
- Build HTML roadmap / demo artifact.
- Recruit 10–20 friendly parent testers.

### Phase 1 — Concierge MVP

- Implement parent intake form or chat interface.
- Use markdown/JSON child profile memory.
- Run responses manually or semi-manually.
- Review all high-risk cases.
- Measure usefulness and return behavior.

### Phase 2 — Private Beta

- Add persistent parent/child profiles.
- Add developmental timeline.
- Add intervention tracker.
- Add admin review dashboard.
- Recruit professional advisors.
