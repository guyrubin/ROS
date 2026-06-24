# Data Model v1 — Arbor

Last updated: 2026-05-15
Status: Phase 0 working draft

---

## Design Principles

- Memory is the moat.
- Store only what improves future support.
- Separate parent claims, observations, AI interpretations, professional notes, and safety classifications.
- Every shareable object needs consent metadata.
- Every AI answer should be traceable to intake context and knowledge source category.

---

## Core Objects

### 1. ParentProfile

```yaml
parent_id: string
name: string optional
language: nl|en|he|other
timezone: string
relationship_to_child: parent|guardian|caregiver|other
communication_preferences:
  tone: calm|direct|detailed|brief
  reminders: true|false
created_at: datetime
updated_at: datetime
```

### 2. ChildProfile

```yaml
child_id: string
parent_id: string
name_or_alias: string
birth_month_year: YYYY-MM
age_band: 0-1|1-2|2-4|4-6|6-8|8-12
languages: [string]
school_or_daycare_context: string optional
known_diagnoses: [string] # only parent/professional stated
known_supports: [string]
strengths: [string]
parent_concerns: [string]
created_at: datetime
updated_at: datetime
```

### 3. FamilyContext

```yaml
family_context_id: string
child_id: string
household_notes: string
routines:
  sleep: string
  meals: string
  screen_time: string
  school_morning: string
  bedtime: string
stressors: [string]
protective_factors: [string]
updated_at: datetime
```

### 4. IntakeRecord

```yaml
intake_id: string
child_id: string
parent_id: string
question: string
situation: string
when_started: string
frequency: string
triggers: [string]
what_parent_tried: [string]
child_response: string
safety_concerns: string
parent_goal: string
created_at: datetime
```

### 5. RiskClassification

```yaml
risk_id: string
intake_id: string
level: low|medium|high|urgent
risk_domains:
  - medical
  - mental_health
  - abuse_neglect
  - developmental
  - behavioral
  - family_safety
red_flags: [string]
rationale: string
required_action: monitor|professional_assessment|urgent_care|emergency
review_required: true|false
created_at: datetime
```

### 6. GuidanceResponse

```yaml
response_id: string
intake_id: string
risk_id: string
read: string
risk_level: string
do_today: [string]
what_to_say: [string]
what_to_avoid: [string]
track: [string]
escalate_if: [string]
knowledge_refs: [string]
created_at: datetime
```

### 7. ActionPlan

```yaml
action_plan_id: string
response_id: string
actions:
  - action: string
    owner: parent|child|family|professional
    timeframe: today|this_week|two_weeks
    difficulty: low|medium|high
status: planned|in_progress|done|stopped
```

### 8. TrackingPrompt

```yaml
tracking_id: string
child_id: string
intake_id: string
metric: string
prompt: string
frequency: daily|weekly|event_based
start_date: date
end_date: date optional
```

### 9. InterventionOutcome

```yaml
outcome_id: string
action_plan_id: string
what_happened: string
parent_rating: worse|same|better|resolved
notes: string
created_at: datetime
```

### 10. ProfessionalNote

```yaml
note_id: string
child_id: string
intake_ids: [string]
summary: string
observed_patterns: [string]
timeline: [string]
what_was_tried: [string]
current_questions: [string]
recommended_professional_type: pediatrician|psychologist|speech_therapist|educator|parent_coach|municipality_support|other
created_at: datetime
```

### 11. ConsentShareRecord

```yaml
share_id: string
parent_id: string
child_id: string
object_ids: [string]
shared_with: string
purpose: string
expires_at: datetime optional
revoked_at: datetime optional
created_at: datetime
```

---

## First Implementation Format

Use one JSON file per child in concierge MVP:

`data/children/{child_id}.json`

Use one markdown timeline per child:

`data/children/{child_id}-timeline.md`

This keeps Phase 1 fast and inspectable before database design is finalized.
