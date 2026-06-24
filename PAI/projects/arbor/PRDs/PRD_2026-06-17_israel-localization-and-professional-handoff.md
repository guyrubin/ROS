# PRD — Arbor Israel Therapist–Patient Workspace & Professional Handoff

**Date:** 2026-06-17  
**Owner:** PAI / Arbor  
**Status:** Build-ready product PRD  
**Parent strategy doc:** `../arbor-israel-market-app-benchmark-and-feature-plan-2026-06-17.md`  
**Canonical app:** `PPPPtherapy-/PPPPtherapy-/app`

---

## 1. Decision

Ship an Israel-localized **therapist–patient workspace** first, with professional handoff as an output of the workflow — not the whole product.

The product center of gravity is the SLP / therapist delivery loop:

> therapist assesses → builds a therapy program → assigns home practice → parent/client performs and reports → therapist reviews → adjusts program → progress/reporting is generated from the live record.

This layer turns the existing Arbor memory spine into a Hebrew-first bridge between:

- parents;
- Tipat Halav / Ministry child-health workflows;
- Kupat Holim / child-development-center workflows;
- ganenet / teacher observations;
- private professionals: קלינאית תקשורת, ריפוי בעיסוק, פיזיותרפיה, פסיכולוג/ית התפתחותי/ת, יועצת שינה.

This is not a medical-record replacement and not a diagnostic product. It is a parent-owned developmental context system that prepares daily action and professional handoff.

---

## 2. Why it wins

Israeli-market benchmark apps prove three demands:

1. **Therapy delivery demand:** talkon SLP positions around SLP administrative tools, end-to-end clinical-program management, the therapist–parent–client circle, ongoing parent feedback, and professional/managerial decision support. This is the primary competitive lens.
2. **Official record demand:** Tipat Halav gives vaccines, growth, screenings, appointments, and Ministry knowledge.
3. **Development workflow demand:** Clalit’s `התפתחות הילד` app covers age-based development tracking, digital forms, parent/ganenet/therapist questionnaires, and appointments.
4. **Parent execution gap:** These products still leave room for a longitudinal child-memory system that connects therapy plans, home practice, gan context, parent moments, and progress reporting.

Arbor wins by owning the therapist–patient continuity layer:

> therapy program + parent practice + child memory + gan context + official/private documents → progress review → next assignment → professional packet/report.

---

## 3. Scope

### In scope

- Therapist-facing caseload, therapy-program, session-note, assignment, and progress-review flows.
- Parent/client home-practice app flow with therapist feedback.
- Hebrew-first Israel UX copy for the child-development workflow.
- Israel source tags on timeline/memory entries.
- Manual/semi-structured import flow for child-record notes and documents.
- Multi-informant forms: parent, ganenet/teacher, therapist/professional.
- Hebrew professional handoff packet.
- Development ladder localization for ages 0–6.
- Daily Play Israel content pack specification.
- Consult categories for Israeli professionals.
- Consent/redaction/expiry controls.

### Out of scope for this PRD

- Direct Ministry of Health / Kupat Holim integration.
- Diagnosis, treatment prescription, medication, or emergency care.
- Public expert marketplace.
- Automated Hebrew child-ASR scoring beyond validated parent-scored workflows.

---

## 4. User jobs

### Therapist / SLP

- “I need to manage my caseload and know what each child is working on.”
- “I need to turn assessment into a therapy program with goals and home practice.”
- “I need parents to know exactly what to do between sessions.”
- “I need parent/client feedback without reconstructing everything in WhatsApp.”
- “I need progress notes and reports generated from the actual work.”

### Clinic / practice manager

- “I need visibility into active programs, follow-up gaps, and therapist workload without reading every session note.”

### Parent

- “I need to understand whether this is normal, worth watching, or worth asking someone about.”
- “I need one thing to do today, not 20 articles.”
- “I need to bring a clear picture to Tipat Halav / Clalit / a private therapist.”
- “I need the ganenet’s observations without chasing WhatsApp messages.”

### Gananet / teacher

- “I need a short, respectful way to share what I see without writing a report.”

### Professional

- “I need clean context: age, concern, what has been tried, patterns, and parent questions.”

---

## 5. Data model additions

Add types without breaking existing memory/timeline model.

```ts
export type TherapyProgramStatus = 'draft' | 'active' | 'paused' | 'completed';

export interface TherapyProgram {
  id: string;
  childId: string;
  therapistId: string;
  category: IsraelProfessionalCategory;
  status: TherapyProgramStatus;
  goals: Array<{ id: string; title: string; target: string; reviewAt?: string }>;
  homePractice: Array<{ id: string; title: string; dosage: string; instructions: string; dueAt?: string }>;
  lastReviewedAt?: string;
  nextReviewAt?: string;
}

export interface TherapySessionNote {
  id: string;
  programId: string;
  childId: string;
  therapistId: string;
  occurredAt: string;
  note: string;
  goalsReviewed: string[];
  assignmentsCreated: string[];
  parentVisibleSummary?: string;
}

export interface HomePracticeFeedback {
  id: string;
  programId: string;
  assignmentId: string;
  childId: string;
  submittedBy: 'parent' | 'client';
  submittedAt: string;
  status: 'done' | 'partial' | 'not_done' | 'too_hard' | 'unclear';
  note?: string;
  mediaIds?: string[];
  therapistReviewedAt?: string;
}
```

```ts
export type IsraelContextSource =
  | 'parent'
  | 'tipat_halav'
  | 'kupat_holim'
  | 'clalit_development'
  | 'gan'
  | 'school'
  | 'private_professional'
  | 'document_import';

export type IsraelProfessionalCategory =
  | 'pediatrician'
  | 'tipat_halav_nurse'
  | 'speech_language'
  | 'occupational_therapy'
  | 'physical_therapy'
  | 'developmental_psychology'
  | 'sleep_consultant'
  | 'teacher_ganenet'
  | 'other';

export interface IsraelTimelineMetadata {
  source: IsraelContextSource;
  professionalCategory?: IsraelProfessionalCategory;
  institutionName?: string;
  sourceDocumentId?: string;
  childAgeMonthsAtEvent?: number;
  originalLanguage?: 'he' | 'en' | 'other';
  parentApprovedForMemory: boolean;
  parentApprovedForPacket: boolean;
}

export interface MultiInformantFormResponse {
  id: string;
  childId: string;
  role: 'parent' | 'ganenet' | 'teacher' | 'therapist' | 'doctor' | 'other';
  domain: 'sleep' | 'routine' | 'speech_language' | 'behavior_regulation' | 'motor_sensory' | 'school_readiness' | 'general';
  submittedAt: string;
  answers: Array<{ questionId: string; answer: string | number | boolean | string[] }>;
  consent: {
    canIncludeInMemory: boolean;
    canIncludeInPacket: boolean;
    expiresAt?: string;
  };
}
```

---

## 6. Product flows

### Flow A — Therapist–Patient Workspace

**Entry points:**

- `Care → Therapist Workspace`
- `Professional → Caseload`
- `Child → Therapy Program`

**Core screens:**

1. **Caseload:** children, active program, next session, stale feedback, urgent follow-up.
2. **Child therapy profile:** goals, sessions, home practice, parent/client feedback, documents, gan observations.
3. **Program builder:** create goals, assign exercises, set dosage, choose review cadence.
4. **Parent/client home view:** today’s assigned practice, therapist note, “done / partial / too hard / unclear,” optional media/note.
5. **Therapist review queue:** feedback to review, missed practice, parent questions, suggested next adjustment.
6. **Progress summary:** auto-drafted from goals, sessions, home practice, feedback, and timeline.

**Acceptance:** therapist can create an active program, assign home practice, receive parent feedback, review it, adjust the program, and export a progress note without leaving the workspace.

---

### Flow B — Import Israeli child context

**Entry points:**

- `My Child → Story → Add context`
- `Care → Consult → Prepare packet`
- `Development → Add checkup`

**Steps:**

1. Choose source:
   - Tipat Halav visit;
   - Kupat Holim / Clalit development note;
   - gan observation;
   - private professional note;
   - parent note;
   - document/photo upload.
2. Add date and child age auto-derived from child DOB.
3. Add text/photo/PDF/manual fields.
4. Arbor proposes structured summary:
   - what happened;
   - domain;
   - follow-up;
   - parent questions;
   - suggested next action.
5. Parent approves:
   - save to Story only;
   - include in child memory;
   - include in future professional packet.

**Acceptance:** no imported content enters memory or packet without explicit parent approval.

---

### Flow C — Development Ladder + Daily Action

**Entry point:** `My Child → Development`

**Sections:**

- Now: what is active for this age/stage.
- Watch: items to observe calmly.
- Try this week: activities from Daily Play.
- Ask if: escalation triggers.
- Prepare: questions/documents for the next appointment.

**For every developmental item:**

- Hebrew title.
- Parent-friendly description.
- “What it looks like at home.”
- “Try this today.”
- “Track this.”
- “Discuss with a professional if…”
- Links to:
  - Daily Play activity;
  - Ask Arbor script;
  - Consult packet.

**Acceptance:** every surfaced concern has a non-alarmist action and a professional escalation boundary.

---

### Flow D — Multi-informant context collection

**Entry point:** `Care → Consult → Collect context`

**Form types:**

1. Parent quick context.
2. Gananet / teacher observation.
3. Therapist / doctor note.

**Form design:**

- Hebrew-first.
- Mobile web share link.
- 3–7 minutes max.
- Domain-specific, not generic.
- Clear consent sentence: who sees this and for what.

**Example ganenet questions:**

- באילו מצבים הכי קל לילד להשתתף?
- מתי הכי קשה לו במעבר בין פעילויות?
- איך הוא מבקש עזרה?
- מה קורה במשחק עם ילדים אחרים?
- האם יש דפוס שחוזר בשעה/סיטואציה מסוימת?
- מה כבר עזר בגן?

**Acceptance:** response creates a timeline entry and can be toggled in/out of the professional packet.

---

### Flow E — Hebrew professional packet

**Entry point:** `Care → Consult`

**Packet modes:**

- `קלינאית תקשורת`
- `ריפוי בעיסוק`
- `פיזיותרפיה`
- `פסיכולוגיה התפתחותית`
- `טיפת חלב / רופא ילדים`
- `גננת / בית ספר`
- `כללי`

**Packet sections:**

1. פרטי הילד: גיל, שפות, מסגרת, רקע משפחתי רלוונטי.
2. הסיבה לפנייה: parent concern in parent’s words.
3. תמונת התפתחות: strengths, watch areas, recent changes.
4. ציר זמן קצר: key events/patterns.
5. מה ניסינו: activities, scripts, plans, outcomes.
6. תצפיות מהגן/בית הספר.
7. שאלות לפגישה.
8. נספחים: documents/photos only if approved.
9. Redaction/consent audit.

**Export options:**

- PDF.
- Copyable Hebrew summary.
- Expiring professional link.

**Acceptance:** parent sees packet preview and redaction controls before export/share.

---

### Flow F — Israel Daily Play pack

**Entry point:** `Grow → Daily Play` and `Today`

**Seed content requirement:** 40–60 Hebrew activities.

**Coverage:**

- Ages: 0–6, weighted to 18m–5y for first beta.
- Domains:
  - speech/language;
  - regulation/behavior;
  - social play;
  - fine/gross motor;
  - independence/routines;
  - school readiness.
- Scenario tags:
  - gan drop-off;
  - bedtime;
  - sibling conflict;
  - holidays/Shabbat disruption;
  - transitions;
  - bilingual home;
  - separation anxiety;
  - toilet readiness;
  - first-grade readiness.

**Activity shape:**

```ts
interface IsraelDailyPlayActivity {
  id: string;
  ageMinMonths: number;
  ageMaxMonths: number;
  domain: string;
  scenarioTags: string[];
  householdItems: string[];
  durationMin: number;
  titleHe: string;
  parentSetupHe: string;
  stepsHe: string[];
  whatItBuildsHe: string;
  observeHe: string;
  adaptIfHardHe: string;
  escalateIfHe?: string;
  reviewedBy?: string;
}
```

**Acceptance:** every activity is doable at home, with household items, in ≤10 minutes, and has one observation to save back to Story.

---

## 7. UI changes

### `TherapistWorkspace`

- Add caseload dashboard.
- Add child therapy profile.
- Add therapy program builder.
- Add session-note entry.
- Add home-practice assignment and feedback review queue.
- Add progress summary / report export.

### `Parent Home Practice`

- Show therapist-assigned tasks separately from generic Daily Play.
- Capture done/partial/too hard/unclear feedback.
- Let parent add note/media for therapist review.
- Show therapist feedback in parent-safe language.

### `ConsultTab`

- Add “Prepare Israeli professional packet.”
- Add category picker.
- Add collect-context links.
- Add packet preview and redaction step.

### `StoryTimelineTab`

- Add “Add Israeli context” button.
- Add source badges: Tipat Halav, Kupat Holim, Gan, Private professional, Parent.
- Add filter by source and domain.

### `DevelopmentTab`

- Localized `Now / Watch / Try this week / Ask if / Prepare` layout.
- Link each watch item to activity and packet.

### `DailyPlayTab`

- Add Israel scenario chips.
- Add “save observation” after activity completion.

### `Ask Arbor`

- Add answer templates for Israeli context:
  - “איך להכין פגישה עם קלינאית תקשורת”
  - “מה לשאול בטיפת חלב”
  - “איך לבקש מהגננת תצפית”
  - “מה לעשות היום עד התור”

---

## 8. Privacy, consent, safety

### Rules

- Therapist notes are private by default; only `parentVisibleSummary` is shown to parents.
- Home-practice feedback is visible to the assigned therapist and parent, not to external professionals unless included in an approved packet.
- No diagnosis.
- No official-integration claim without real connector.
- Imported record content is document context until parent approves memory inclusion.
- Multi-informant forms have explicit consent and expiration.
- Professional links expire and are revocable.
- Packet export is explicit Safety Level 3 external action.

### Required tests

- Therapist note private fields are not shown to parents.
- Parent-visible summaries are separated from clinical notes.
- Home-practice feedback cannot be included in external packet unless parent approves.
- Parent can redact every packet section.
- Shared link expires.
- Gananet form cannot access the child record.
- Professional packet includes consent audit.
- Escalation copy uses “discuss with a professional,” never diagnosis.

---

## 9. Metrics

### Therapist workflow

- # active therapists / SLPs.
- # active therapy programs.
- # home-practice assignments created.
- % assignments receiving parent/client feedback.
- Time from parent feedback to therapist review.
- # progress summaries exported.

### Activation

- % beta families adding at least one Israel-context source.
- % completing child profile + age/stage.
- % generating first professional packet.

### Retention

- Weekly Today opens.
- Daily Play completion.
- Observations saved after activities.

### Professional workflow

- # ganenet/teacher forms completed.
- # packets exported/shared.
- Parent rating: “Did this help you prepare the appointment?”

### Trust

- Redactions per packet.
- Link revocations.
- Support complaints about privacy/confusion.

---

## 10. Build order

### Milestone 1 — Therapist Workspace MVP

1. Data model: therapy program, session note, home-practice assignment/feedback.
2. Caseload dashboard.
3. Child therapy profile.
4. Program builder.
5. Parent/client home-practice view.
6. Therapist review queue.
7. Progress summary export.

### Milestone 2 — Packet and context MVP

8. Data model source tags.
9. Hebrew packet template.
10. ConsultTab category picker.
11. Packet preview + redaction.
12. PDF/copy export.

### Milestone 3 — Context collection

13. Add Israel context import to Story.
14. Gananet/teacher share form.
15. Parent form.
16. Timeline source badges.

### Milestone 4 — Daily loop

17. DevelopmentTab localized action layout.
18. 40–60 Daily Play Israel content items.
19. Today/Rhythm labels for gan/routine transitions.

### Milestone 5 — Beta pilot

20. Pilot with 2–3 SLP/therapists and 5–10 Israeli families.
21. One professional reviewer for packet quality.
22. Iterate workspace, packet, and forms.

---

## 11. Open questions

1. First professional category: speech-language, OT, or developmental psychology?  
   **Recommendation:** speech-language (`קלינאית תקשורת`) because Talkon validates the SLP workflow and Arbor already has Language & Communication / Practice surfaces.

2. First buyer/user: independent SLP, small clinic, or parent-led packet-only?  
   **Recommendation:** independent SLP / tiny clinic first. Avoid parent-only because it misses the Talkon lesson: the primary workflow is therapist-led.

3. First age band: 18–36m or 3–5y?  
   **Recommendation:** 3–5y if the wedge is gan/school readiness; 18–36m if the wedge is early speech/regulation anxiety.

4. Partner path: private professional pilot or packet-only?  
   **Recommendation:** therapist workspace pilot first, packet-only only as a fallback if therapist recruitment stalls.

---

## 12. Definition of done

The Israel MVP is done when a Hebrew-speaking therapist + parent pair can:

1. therapist creates a child therapy profile;
2. therapist opens an active therapy program with goals;
3. therapist assigns home practice;
4. parent sees only the assigned work and therapist-visible context;
5. parent marks done/partial/too hard/unclear and adds a note/media if needed;
6. therapist reviews feedback;
7. therapist adjusts the program or next assignment;
8. therapist exports a progress summary / professional packet;
9. parent can still add one Tipat Halav/Kupat/Gan/private-professional context item;
10. Arbor can explain why it helps beyond Talkon: not just admin + feedback, but therapy workflow connected to longitudinal child memory and daily home context.
