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

**North star (2026 H2):** Weekly-Active-Habit (WAH) families — installs that activate (child profile + first plan) and return ≥3×/week — with paying subscribers (Plus / Family) as the co-primary. Instrumented in-app via `app/src/lib/loopEvents.ts`: `install · profile_created · first_plan · share_* · invite_* · trial_start · paid`, each carrying first-touch attribution (market / source / referral_code / utm).

**Growth-loop KPIs (gates):** activation (install→profile+plan) 35%→55% · week-1 habit (≥3 returns) 20%→35% · K-factor 0.4→~1.0 · invite rate 15%→25% · free→paid 3%→6% · blended CAC < €4. Monthly kill/double: any channel under its floor for 30 days is cut, budget moves to what beats target. Retention gates spend — no paid into a leaky funnel.

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

## 12. Go-to-Market & Growth Loop

**Markets (sequenced):** Israel first (ignition — native HE product, dense WhatsApp/Facebook parent groups, large micro-creator scene = cheapest place to prove K-factor), then Netherlands (anchor), then Belgium / Ireland / UK in English. Budget €10k / 6 months, organic & product-led, with ~30% (≈€3k) paid used only to amplify already-proven assets. Full plan: `marketing/arbor-viral-gtm-2026-H2.md`.

**The loop:** 4 share artifacts (Avatar · personalized story · "is this normal?" answer card · monthly growth card) × 3 mechanics (referral = free Plus month on invitee *activation*; share-to-unlock; creator/UGC seeding). K = invites × conversion; target ≥0.4 early → ~1.0. Gating builds: branded 1-tap share export (P0-3) + referral grant (P0-2). Analytics + first-touch referral capture **shipped** (P0-4). Spec: `marketing/arbor-loop-eng-spec.md`.

**Campaign — "The 2am Test":** enemy = fear-Googling the internet at 2am; line = *"Stop fear-Googling your kid."* Manifesto film → #ArborAvatar challenge → "what did you Google at 2am?" UGC → referral. Landing pages (HE/EN) are message-matched to the hook. Docs: `marketing/arbor-launch-campaign-the-2am-test.md`, `marketing/arbor-launch-copy-pack.md`.

**Channels:** IG / TikTok / YouTube Shorts (HE-first), WhatsApp & Facebook parent groups, AEO/SEO (live guide hubs + `llms.txt`), micro-creators (vetted shortlist: `marketing/arbor-il-creator-tracker.md`). Long-form YouTube = Phase-2 evergreen authority, repurposed not bespoke.

**Conversion → revenue:** Free / Plus €12.99 / Family €19.99. Free-tier volume feeds the loop; paywall triggers tuned to fire post-activation, never before the "aha." Billing rails per `arbor-payment-model-2026-06-17.md`.

**Brand language (locked):** light cool-white canvas, white cards + soft blue shadow, navy ink, teal-green `oklch(0.68 0.14 178)` + blue accents, Assistant (HE) / Inter + serif (EN). Source of truth = the shipping marketing pages, not approximations.
