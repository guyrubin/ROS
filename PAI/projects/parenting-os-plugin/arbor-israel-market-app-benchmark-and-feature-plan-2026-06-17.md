# Arbor — Israel Market App Benchmark & Feature Plan

**Date:** 2026-06-17  
**Owner:** PAI / Arbor  
**Status:** Product strategy + build-ready feature direction  
**Trigger:** Review current Arbor/ROS/Cowork state, inspect the live Arbor marketing surface, identify two comparable apps in the Israeli market, and define the most relevant features Arbor should build *better* than those apps.

---

## 1. Decision

For the Israeli market, Arbor should not position itself as “another baby tracker” or “another Kupat Holim portal.” The winning wedge is:

> **A Hebrew-first developmental operating system that sits between the family, Tipat Halav/Kupat Holim, the gan/school, and private professionals — turning scattered health/development information into daily action and a professional-ready child story.**

The most relevant Israeli-market apps to benchmark are now:

1. **talkon SLP** — the primary benchmark for the therapist–patient operating loop: SLP admin, clinical-program management, therapist–parent–client circle, parent feedback through an integrated app, and professional/managerial decision support.
2. **טיפת חלב** — Ministry of Health: official child-health record, vaccines, growth checks, screening results, appointments, professional knowledge.
3. **התפתחות הילד** — Clalit Health Services: child-development tracker from birth to age 6, digital questionnaires for parents/ganenet/therapists, medical/development-service workflow, forms, appointments.

Use global leaders only as capability benchmarks:

- **Kinedu / BabySparks** for daily developmental activities and progress reports.
- **Huckleberry** for predictive daily rhythm and sleep timing.
- **Good Inside / Cleo / Maven** for parent scripts and human expert trust.

---

## 2. What the Israeli apps prove

### A. talkon SLP — therapist–patient operating loop

**App Store IL listing inspected:** `id6444620831`, seller `talkon ltd.`, Medical, rating 5.0 from 4 ratings. Tagline: “For more efficient therapy.”

**Claimed core capabilities:**

- SLP software that streamlines administrative tasks and therapeutic processes.
- Full suite of administrative tools for speech-language pathologists.
- End-to-end management of clinical programs.
- Empowers the therapy circle of **therapist–parent–client**.
- Parents receive ongoing feedback from the SLP through an integrated app.
- Improves decision-making on professional and managerial levels.
- Saves therapist time and makes work easier.

**What it proves:**

- The strongest Israeli product pattern is not an end-user “feature showcase”; it is a **care-delivery workflow**.
- The buyer/user center of gravity can be the therapist, not only the parent.
- The valuable loop is: assess → set therapy program → assign home practice → parent performs/logs → therapist reviews → adjusts program → reports progress.
- Arbor should compete on the *therapist–patient collaboration layer*, not on edge capabilities like avatars, games, or generic AI content.
- For the Israel beachhead, speech-language therapy is the cleanest professional wedge.

### B. טיפת חלב — Ministry of Health

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

### C. התפתחות הילד — Clalit

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

## 4. Build the Israeli version around the therapist–patient loop

### Feature 1 — Therapist–Patient Workspace

**What talkon proves:** the core product is not a child-facing capability; it is an operating system for therapy delivery.

**Arbor better version:**

A shared workspace for therapist, parent, and child context:

- therapist dashboard by active caseload;
- child profile with developmental story, goals, sessions, home practice, parent logs, and documents;
- therapy program with goals, exercises, dosage, status, and next review date;
- parent app view showing only the relevant home tasks and feedback from the therapist;
- feedback loop: assigned → done/not done → parent note/media → therapist review → adjust program;
- progress summary and professional note generated from real activity, not manual reconstruction.

**Main capabilities, not edge features:**

1. caseload and child profiles;
2. therapy plans / clinical programs;
3. home-practice assignment;
4. parent feedback and secure messaging;
5. session notes and progress tracking;
6. professional reports / summaries;
7. manager-level view for clinic/team operations.

**Why it wins:** Talkon optimizes the SLP workflow. Arbor can add the missing longitudinal child-memory spine: parent moments, gan context, daily practice, development ladder, and professional packet all become part of the same therapy loop.

---

### Feature 2 — Israel Child Record Mirror

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

### Feature 3 — Israeli Development Ladder Plus Daily Action

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

### Feature 4 — Digital Questionnaire Hub: Parent + Ganenet + Therapist

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

### Feature 5 — Israeli Professional Handoff Packet

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

### Feature 6 — Today for Israeli Parents

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

### Feature 7 — Hebrew Speech & Language Beachhead

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

### Feature 8 — Parent Scripts for Israeli Reality

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

### P0 — Therapist–patient operating loop

1. Therapist–Patient Workspace: caseload, child profile, therapy plan, session notes.
2. Home-practice assignment + parent feedback loop.
3. Hebrew SLP professional packet and progress summary.
4. Manual Israeli child-record timeline import.
5. Ganenet/teacher observation form.

### P1 — Israel credibility layer

6. Development ladder localization for ages 0–6.
7. Tipat Halav/Kupat/Gan/private-professional source badges.
8. Consent/redaction/expiry controls for professional sharing.

### P2 — Daily support loop

9. Today/Rhythm localization for gan, holidays, transitions.
10. Daily Play Israel content pack: 40–60 Hebrew activities, household-items-first.
11. Parent scripts for top 20 Israeli scenarios.

### P3 — Deeper professional moat

12. קלינאית תקשורת / OT / sleep consultant consult categories.
13. Professional share link + clinic/team manager view.
14. Private expert pilot: one partner expert, not a marketplace.
15. Hebrew speech/language track and school-readiness plan.

---

## 6. Acceptance criteria for “better than the Israeli apps”

Arbor is winning when a parent can say:

- “Talkon manages the SLP workflow; Arbor manages the full therapy circle around the child — therapist plan, home practice, parent feedback, gan context, and longitudinal progress.”
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
- Apple Search API, country `IL`, terms: `התפתחות הילד`, `ילדים התפתחות`, `baby development`, `parenting`, plus direct lookup for Talkon.
- App Store IL listings:
  - `talkon SLP` — talkon ltd., `id6444620831`.
  - `טיפת חלב` — Israel Ministry of Health, `id6451442089`.
  - `התפתחות הילד` — Clalit Health Services, `id6746529114`.
  - Global benchmarks present in IL App Store: Kinedu, Huckleberry, BabySparks, Good Inside.
