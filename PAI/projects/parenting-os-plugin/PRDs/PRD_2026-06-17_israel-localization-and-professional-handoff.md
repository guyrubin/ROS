# PRD — Arbor Israel Localization & Professional Handoff

**Date:** 2026-06-17  
**Owner:** PAI / Arbor  
**Status:** Build-ready product PRD  
**Parent strategy doc:** `../arbor-israel-market-app-benchmark-and-feature-plan-2026-06-17.md`  
**Canonical app:** `PPPPtherapy-/PPPPtherapy-/app`

---

## 1. Decision

Ship an Israel-localized Arbor layer that turns the existing Arbor memory spine into a Hebrew-first bridge between:

- parents;
- Tipat Halav / Ministry child-health workflows;
- Kupat Holim / child-development-center workflows;
- ganenet / teacher observations;
- private professionals: קלינאית תקשורת, ריפוי בעיסוק, פיזיותרפיה, פסיכולוג/ית התפתחותי/ת, יועצת שינה.

This is not a medical-record replacement and not a diagnostic product. It is a parent-owned developmental context system that prepares daily action and professional handoff.

---

## 2. Why it wins

Israeli-market benchmark apps prove three demands:

1. **Official record demand:** Tipat Halav gives vaccines, growth, screenings, appointments, and Ministry knowledge.
2. **Development workflow demand:** Clalit’s `התפתחות הילד` app covers age-based development tracking, digital forms, parent/ganenet/therapist questionnaires, and appointments.
3. **Parent execution gap:** Neither app turns records and forms into a calm daily plan, personalized activities, scripts, patterns, or a professional-ready story across providers.

Arbor wins by owning the continuity layer:

> official data + parent moments + gan context + private therapy notes → longitudinal child story → today’s action → professional packet.

---

## 3. Scope

### In scope

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

### Flow A — Import Israeli child context

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

### Flow B — Development Ladder + Daily Action

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

### Flow C — Multi-informant context collection

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

### Flow D — Hebrew professional packet

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

### Flow E — Israel Daily Play pack

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

- No diagnosis.
- No official-integration claim without real connector.
- Imported record content is document context until parent approves memory inclusion.
- Multi-informant forms have explicit consent and expiration.
- Professional links expire and are revocable.
- Packet export is explicit Safety Level 3 external action.

### Required tests

- Imported document is not included in memory by default.
- Parent can redact every packet section.
- Shared link expires.
- Gananet form cannot access the child record.
- Professional packet includes consent audit.
- Escalation copy uses “discuss with a professional,” never diagnosis.

---

## 9. Metrics

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

### Milestone 1 — Packet MVP

1. Data model source tags.
2. Hebrew packet template.
3. ConsultTab category picker.
4. Packet preview + redaction.
5. PDF/copy export.

### Milestone 2 — Context collection

6. Add Israel context import to Story.
7. Gananet/teacher share form.
8. Parent form.
9. Timeline source badges.

### Milestone 3 — Daily loop

10. DevelopmentTab localized action layout.
11. 40–60 Daily Play Israel content items.
12. Today/Rhythm labels for gan/routine transitions.

### Milestone 4 — Beta pilot

13. Pilot with 5–10 Israeli families.
14. One private professional reviewer.
15. Iterate packet and forms.

---

## 11. Open questions

1. First professional category: speech-language, OT, or developmental psychology?  
   **Recommendation:** speech-language (`קלינאית תקשורת`) because it is high-intent and maps to Arbor’s Language & Communication surface.

2. First age band: 18–36m or 3–5y?  
   **Recommendation:** 3–5y if the wedge is gan/school readiness; 18–36m if the wedge is early speech/regulation anxiety.

3. Partner path: private professional pilot or packet-only?  
   **Recommendation:** packet-only first, then one friendly private professional after parents show demand.

---

## 12. Definition of done

The Israel MVP is done when a Hebrew-speaking parent can:

1. create a child profile;
2. add one Tipat Halav/Kupat/Gan/private-professional context item;
3. see it in Story with source badge;
4. get one concrete Daily Play / Do Today action;
5. collect ganenet context by link;
6. generate a Hebrew professional packet;
7. redact it;
8. export/share it;
9. explain why Arbor helped beyond Tipat Halav or Clalit.
