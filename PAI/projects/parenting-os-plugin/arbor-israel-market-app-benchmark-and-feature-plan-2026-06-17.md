# Arbor — Israel Market App Benchmark & Feature Plan

**Date:** 2026-06-17  
**Owner:** PAI / Arbor  
**Status:** Product strategy + build-ready feature direction  
**Trigger:** Review current Arbor/ROS/Cowork state, inspect the live Arbor marketing surface, identify two comparable apps in the Israeli market, and define the most relevant features Arbor should build *better* than those apps.

---

## 1. Decision

For the Israeli market, Arbor should not position itself as “another baby tracker” or “another Kupat Holim portal.” The winning wedge is:

> **A Hebrew-first developmental operating system that sits between the family, Tipat Halav/Kupat Holim, the gan/school, and private professionals — turning scattered health/development information into daily action and a professional-ready child story.**

The two most relevant Israeli-market apps to benchmark are:

1. **טיפת חלב** — Ministry of Health: official child-health record, vaccines, growth checks, screening results, appointments, professional knowledge.
2. **התפתחות הילד** — Clalit Health Services: child-development tracker from birth to age 6, digital questionnaires for parents/ganenet/therapists, medical/development-service workflow, forms, appointments.

Use global leaders only as capability benchmarks:

- **Kinedu / BabySparks** for daily developmental activities and progress reports.
- **Huckleberry** for predictive daily rhythm and sleep timing.
- **Good Inside / Cleo / Maven** for parent scripts and human expert trust.

---

## 2. What the two Israeli apps prove

### A. טיפת חלב — Ministry of Health

**App Store IL listing found via Apple Search API:** `id6451442089`, seller `Israel Ministry of Health`, Medical, rating ~2.56 from 45 ratings.

**Claimed features:**

- Birth-to-18 child-health information surface.
- Vaccines, growth measurements, screening-test results.
- Appointments and medical information from Tipat Halav / school health services.
- Professional health information from Ministry of Health experts.
- Registration through Tipat Halav nurse.

**What it proves:**

- Israeli parents already expect a state-backed child record.
- The trusted vocabulary is health, vaccines, growth, official checks, appointments.
- The product gap is not authority; it is usability, day-to-day guidance, personalization, and continuity between appointments.

### B. התפתחות הילד — Clalit

**App Store IL listing found via Apple Search API:** `id6746529114`, seller `Clalit Health Services`, Health & Fitness.

**Claimed features:**

- Birth-to-age-6 development app.
- Age-adapted developmental ladder / tracker.
- Structured professional home follow-up tools.
- Digital questionnaires and forms for parents, ganenet, caregivers, and therapists.
- Integrated management of development services: tests, forms, questionnaires, appointments in Clalit centers.

**What it proves:**

- The real Israeli demand is not generic parenting content; it is development-service navigation.
- Parent + ganenet + therapist questionnaires are a critical workflow.
- Age 0–6 is the beachhead, with school-readiness as the commercial/emotional hook.
- Kupot own the official workflow, but they do not own the daily parent loop.

---

## 3. Arbor’s current position

Based on ROS memory, product docs, live marketing, and app source inspection:

- Live public marketing: `https://arborprd-westeu.web.app/marketing/`, Hebrew-first, already positioned as “מערכת הפעלה להתפתחות הילד.”
- Live app root is auth-gated; marketing page publicly presents:
  - child memory;
  - Today / Rhythm;
  - Daily Play;
  - Grow / Growth Plans;
  - Academy / child-as-hero stories;
  - Care / expert handoff;
  - safety and control.
- Current app IA already has the right shells:
  - Today
  - Ask Arbor
  - My Child: Story, Development, Moments, Language & Communication
  - Grow: Daily Play, Practice, Growth Plans
  - Care Network: Consult, My Care Team, Trusted Sharing, Appointments, Safety
  - Academy: Story Journeys, Masterclasses, Family Formation
- Source inspection confirms work has moved beyond the old plan:
  - `src/rhythm/predict.ts`
  - `DailyPlayCard`, `DailyPlayTab`
  - `growth/devScore.ts`
  - `consult/packet.ts`, `AskSpecialist`, `ConsultTab`
  - avatar / story hero surfaces and `/api/generate-avatar` paths are present in the current dirty Cowork worktree.

**Read:** Arbor’s structure now matches the strategic thesis. The next product challenge is not inventing more generic features; it is localizing the existing spine into the Israeli parent/professional workflow.

---

## 4. Build the Israeli version better than the local apps

### Feature 1 — Israel Child Record Mirror

**What Tipat Halav / Clalit do:** show official record fragments: vaccines, growth, screenings, appointments, forms.

**Arbor better version:**

A parent-controlled **Israel Child Record Mirror** that lets the parent manually or semi-automatically assemble a private child record from:

- Tipat Halav visits;
- Kupat Holim / Clalit development notes;
- growth measurements;
- vaccines and upcoming appointments;
- ganenet / teacher observations;
- private therapy notes;
- photos, videos, and parent moments.

**Important boundary:** Arbor should not claim direct Ministry/Kupat integration until a real connector exists. Start with guided upload/manual entry/import from PDF/photo, then move to integrations only after partnerships.

**Build:**

- `My Child → Story`: add “Import Israeli child record” flow.
- Inputs: photo/PDF/text/manual form.
- Extract into structured timeline entries: date, source, age, domain, note, follow-up, document link.
- Tag source type: `tipat_halav`, `kupat_holim`, `gan`, `private_therapist`, `parent`.
- Parent controls what enters memory and what stays as private document-only context.

**Why it wins:** Tipat Halav and Clalit are portals. Arbor becomes the parent-owned continuity layer across all portals and professionals.

---

### Feature 2 — Israeli Development Ladder Plus Daily Action

**What Clalit does:** age-based developmental ladder/tracker.

**Arbor better version:**

A Hebrew-first **Development Ladder + Daily Action** engine:

- Show milestone/checkpoint status by age band, not as a cold checklist.
- For every item: “what this looks like at home,” “what to try this week,” “when to ask a professional.”
- Connect each checkpoint to Daily Play, Growth Plan, Ask Arbor, and Consult packet.

**Build:**

- Use current CDC/AAP/ASHA milestone rebase as the technical base.
- Add Israeli-facing labels and flows:
  - `0–6` focus;
  - preschool / gan readiness;
  - first-grade readiness;
  - Hebrew language / speech patterns;
  - bilingual Hebrew-English households.
- For each milestone or concern:
  - one household activity;
  - one parent script;
  - one observation question;
  - one escalation trigger.

**Why it wins:** Local apps tell parents what to track. Arbor tells them what to do today and how to prepare the next professional conversation.

---

### Feature 3 — Digital Questionnaire Hub: Parent + Ganenet + Therapist

**What Clalit does:** digital questionnaires for parents, ganenet, caregivers, and therapists.

**Arbor better version:**

A **multi-informant child context hub** that makes questionnaires useful before and after the appointment.

**Build:**

- `Care → Consult` gains “Collect context” step.
- Three share links:
  1. parent form;
  2. ganenet / teacher observation form;
  3. therapist / doctor note form.
- Each form is short, Hebrew-first, mobile-friendly, and scoped by domain:
  - sleep/routine;
  - speech/language;
  - regulation/behavior;
  - motor/sensory;
  - school readiness.
- Responses become:
  - structured timeline entries;
  - pattern insights;
  - professional handoff packet sections.

**Why it wins:** Clalit collects forms for its own workflow. Arbor turns forms into longitudinal intelligence for the parent and any professional.

---

### Feature 4 — Israeli Professional Handoff Packet

**What local apps do:** help route into appointments and services.

**Arbor better version:**

A **one-click Hebrew professional packet** for Tipat Halav, Kupat Holim development center, private speech therapist, OT, psychologist, ganenet, or pediatrician.

**Packet sections:**

1. Child snapshot: age, languages, family context.
2. Timeline: notable events and patterns.
3. Development ladder: reached / emerging / watch.
4. What parent tried: Daily Play, plans, scripts, outcomes.
5. Multi-informant notes: parent + ganenet + therapist.
6. Safety/escalation notes.
7. Parent questions for the appointment.
8. Redaction controls and consent log.

**Build:**

- Extend existing `consult/packet.ts` and `ConsultTab`.
- Add Israel packet template in Hebrew.
- Add export modes:
  - PDF for appointment;
  - copyable Hebrew summary;
  - professional share link with expiry.

**Why it wins:** The professional starts warm, not cold. This is Arbor’s moat in one document.

---

### Feature 5 — Today for Israeli Parents

**What Huckleberry does globally:** predicts sleep windows.

**Arbor better version for Israel:**

A **Today** surface that combines the family rhythm with Israeli routines:

- gan drop-off / pickup;
- Friday/holiday disruption;
- nap transitions;
- evening bath/dinner/sleep flow;
- separation anxiety at gan;
- “sick day” / post-illness return;
- school-readiness micro-practice.

**Build:**

- Extend `rhythm/predict.ts` with locale-aware schedule labels, not medical claims.
- Let parents define recurring anchors: gan start, pickup, nap, bedtime, therapy days.
- Home shows:
  - likely hard window;
  - one calming script;
  - one Daily Play activity;
  - one thing to observe.

**Why it wins:** Huckleberry predicts naps. Arbor predicts the family day and gives the next useful action.

---

### Feature 6 — Hebrew Speech & Language Beachhead

**Why this matters in Israel:** speech/language and bilingual households are high-intent, high-anxiety, and professional-service-linked.

**Arbor better version:**

A Hebrew-first **Language & Communication** path that connects home observations to professional speech-language support.

**Build:**

- Hebrew phoneme / articulation content bank.
- Hebrew-English bilingual profile fields.
- Parent-friendly “what I heard” logs.
- Short home games for speech sounds, narrative, turn-taking, and comprehension.
- Consult packet section for קלינאית תקשורת.

**Guardrail:** No diagnosis and no overconfident speech scoring until a Hebrew child-ASR path is validated. Start with parent-scored / record-and-replay workflows.

**Why it wins:** Kinedu/BabySparks are generic. Local Kupot are clinical portals. Arbor becomes the bridge between home practice and the speech therapist.

---

### Feature 7 — Parent Scripts for Israeli Reality

**What Good Inside does:** scripts and strategies for hard parenting moments.

**Arbor better version:**

Scripts that are personalized by child history and localized to Israeli family life.

**Scenario packs:**

- refusing gan drop-off;
- “עוד חמש דקות” bedtime negotiations;
- sibling conflict in small apartments;
- Hebrew/English bilingual frustration;
- grandparents giving conflicting advice;
- transition from vacation/holiday/Shabbat back to routine;
- school readiness and first-grade anxiety.

**Build:**

- Ask Arbor answer format already exists: Read / Risk / Do Today / Track / Escalate.
- Add script library and “save script to plan.”
- Link scripts to Rhythm windows and Daily Play.

**Why it wins:** It turns advice into an executable family operating manual.

---

## 5. Prioritized build order

### P0 — Israel credibility layer

1. Hebrew-first Israel packet template for `Consult`.
2. Manual Israeli child-record timeline import.
3. Development ladder localization for ages 0–6.
4. Ganenet/teacher observation form.

### P1 — Daily retention loop

5. Today/Rhythm localization for gan, holidays, transitions.
6. Daily Play Israel content pack: 40–60 Hebrew activities, household-items-first.
7. Parent scripts for top 20 Israeli scenarios.

### P2 — Professional moat

8. קלינאית תקשורת / OT / sleep consultant consult categories.
9. Professional share link + redaction + expiry.
10. Private expert pilot: one partner expert, not a marketplace.

### P3 — Deeper moat

11. Hebrew speech/language track.
12. School-readiness plan.
13. Optional future official integrations after partnerships.

---

## 6. Acceptance criteria for “better than the Israeli apps”

Arbor is winning when a parent can say:

- “Tipat Halav shows me the official record; Arbor helps me understand what it means for my child this week.”
- “Clalit gives me the forms; Arbor helps everyone fill the right context and turns it into a useful story.”
- “Kinedu gives me activities by age; Arbor gives me the right activity for my child’s actual pattern.”
- “Huckleberry predicts sleep; Arbor helps me manage the day.”
- “When I meet a professional, I don’t start from zero.”

---

## 7. Next artifact

Create a build PRD:

`PRDs/PRD_2026-06-17_israel-localization-and-professional-handoff.md`

It should define:

1. data model additions for Israeli source tags and multi-informant forms;
2. Hebrew consult packet template;
3. UI changes to `ConsultTab`, `StoryTimelineTab`, `DevelopmentTab`, and `DailyPlayTab`;
4. 40–60 activity seed-content requirements;
5. privacy/consent/redaction acceptance tests;
6. launch plan for an Israel beta with 5–10 families and 1–2 professionals.

---

## Sources inspected

- Live Arbor marketing surface: `https://arborprd-westeu.web.app/marketing/`.
- App source: `PPPPtherapy-/PPPPtherapy-/app/src/lib/navigation.ts`, plus current feature files under `src/rhythm`, `src/growth`, `src/consult`, `src/components/overview`, `src/components/tabs`.
- ROS product docs:
  - `arbor-competitive-analysis-and-feature-defs-2026-06-14.md`
  - `arbor-redesign-and-additions-definition-2026-06-14.md`
  - `PRDs/PRD_2026-06-17_avatar-games-growth.md`
- Apple Search API, country `IL`, terms: `התפתחות הילד`, `ילדים התפתחות`, `baby development`, `parenting`.
- App Store IL listings:
  - `טיפת חלב` — Israel Ministry of Health, `id6451442089`.
  - `התפתחות הילד` — Clalit Health Services, `id6746529114`.
  - Global benchmarks present in IL App Store: Kinedu, Huckleberry, BabySparks, Good Inside.
