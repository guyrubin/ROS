# PRD — Arbor × Ten Epics: Coverage Map & Gap-Closure Build
Date: 2026-06-12
Author: Guy Rubin
Status: Approved → In build (same-day execution)
Venture: Arbor
Companion: `PRD_2026-06-12_speech-language-fall-release.md` (shipped to production earlier today)

## Purpose

A product backlog of 10 epics (sourced via ChatGPT) defines the "AI Development Operating System for Children" vision. Much of it already exists in Arbor in some form. This PRD does three things:

1. **Maps every epic** to what is already shipped — so we don't rebuild what exists.
2. **Defines the genuine gaps** and ships the code-implementable ones now.
3. **Names what we will NOT build** and why — an epic list from a chatbot is not a roadmap; some asks are clinically or legally indefensible as written.

## Coverage map — epic by epic

Legend: ✅ shipped · 🔨 building now (this PRD) · ⏩ fast follow · ⛔ rejected as written (with replacement)

### Epic 1 — AI Development Assessment
| Ask | Status | Where / What |
|---|---|---|
| Continuous assessment from natural interactions (speech, stories, games) | ✅ | Practice Studio signals: speech attempts, adventure results, mission records, hero-journey choice metrics |
| Parent questionnaires | ✅ | Development Check (age-banded screener, saved history) |
| Domain picture: language / cognitive / social / emotional | ✅ | Development Dashboard bands (milestones + practice blend) |
| Executive function as a domain | 🔨 partial | EF milestone items already live inside the cognition domain (`cognition_executive_function`); task-persistence signal added from mission/adventure completion. A separate EF band is ⏩ until we have enough distinct EF signal to be honest. |
| Confidence score | 🔨 | Per-domain confidence (data volume + recency based) shown on the dashboard |
| Radar chart | 🔨 | Radar view of the five domains (recharts, already in the bundle) |
| Trend analysis / historical progression | 🔨 | Weekly band snapshots persisted per child; trend arrows + history on the dashboard |
| **"Developmental age estimate"** | ⛔ | **Rejected as written.** Point age-equivalents from home observation are clinically indefensible and an EU-MDR trap. Replacement: bands + confidence + trend (decided in the Fall-release PRD; unchanged). |

### Epic 2 — Developmental Red Flag Detection
| Ask | Status | Where / What |
|---|---|---|
| Questionnaire-based detection, never diagnosis | ✅ | Development Check: domain-level "worth a professional conversation," deliberately conversation-biased |
| Continuous pattern detection from passive data (speech delay indicators, regulation difficulties, attention/task-completion patterns, social-engagement signals) | 🔨 | **Watch Signals engine**: fuses latest screening + behavior-log patterns (frequency/intensity/duration trends) + speech practice accuracy vs typical sound ages + social/emotional practice signal → per-area attention level (`steady` / `monitor` / `talk to a professional`) with a monitoring plan and aimed activities. Surfaced on the Development Dashboard. |
| Risk levels Low/Moderate/High | 🔨 | Mapped to non-alarmist language: steady / monitor / discuss. Crisis-level escalation already exists separately (Safety, K-03). |
| **Naming "ASD risk" / "ADHD risk" to parents** | ⛔ | **Rejected as written.** Arbor never shows condition names next to a child's data — that *is* a diagnosis to a parent's eyes (and to a regulator's). Replacement: observable-pattern language only ("social engagement," "attention & task completion"), routed to the Find-a-Professional flow. The signal taxonomy is condition-aware internally for professional reports, not in parent UI. |

### Epic 3 — AI Speech & Language Coach
| Ask | Status |
|---|---|
| Speech recognition: pronunciation accuracy, clarity | ✅ shipped today (Record & Compare; browser-dependent, parent floor) |
| Articulation: R, S, L, SH, CH, TH + more | ✅ shipped today (20 sounds, age-banded) |
| Vocabulary expansion: object naming, categories, story retelling | 🔨 **Words mode** in Speech Coach (naming rounds, category play); story retell already a daily mission |
| Expressive language: open questions, picture descriptions, story creation | 🔨 **Express mode** in Speech Coach (question-of-the-day, emoji-scene description, story starters) |
| Configurable by language | ⏩ Hebrew sound set (Fall-release PRD fast follow, unchanged) |
| Speech progress dashboard | ✅ shipped today |

### Epic 4 — Parent Copilot
| Ask | Status |
|---|---|
| Natural-language parent questions | ✅ Ask Arbor (scholar lenses, council, safety screening, memory) |
| Weekly summaries / monthly reports | ✅ Weekly digest (`/api/digest`), Weekly Insight, report exports |
| Actionable recommendations | ✅ Copilot weekly focus → re-aims missions (shipped today) |
| Weekly action plan (goals, activities, expected outcomes) | 🔨 **Journey weekly plan** (Epic 9 build covers this output) |

### Epic 5 — Professional Dashboard
| Ask | Status |
|---|---|
| Reports, referral/progress summaries | ✅ Reports & Handoffs (8 report types), clinician practice summary (today) |
| Structured sharing with professionals | ✅ Trusted Sharing (server-enforced grants), consult requests |
| Practice/assessment data inside professional reports | 🔨 Bands + practice signals folded into the therapist/pediatrician report exports |
| Standalone professional portal with notes/goals/interventions | ⏩ **Deferred** — this is the B2B pro-platform wedge (separate strategy doc; needs real professionals onboard, not more UI). Building it before professionals use the share flow would be mockup theater. |

### Epic 6 — Interactive AI Stories
| Ask | Status |
|---|---|
| Child as main character, name/age/photo personalization | ✅ Hero Journeys (AI-rendered scenes, child photo) |
| Educational/values stories (courage, responsibility, honesty…) | ✅ packs: Courage, Responsibility, Growth, Wisdom |
| Biblical stories | ✅ David & Goliath, Moses (bilingual EN/HE) |
| Read-along mode | ✅ TTS narration in the scene player |
| Choice → developmental metrics | ✅ per-choice metric deltas saved per run |
| Story signal → assessment | 🔨 hero-run metrics now feed the social/emotional bands |
| Folk tales, more emotional-regulation packs | ⏩ editorial content expansion, not engineering |
| **Animated video generation** | ⛔ as written (video-gen pipeline ≠ this quarter). Illustrated scenes + read-along deliver the experience. |

### Epic 7 — Emotion Recognition & Emotional Coaching
| Ask | Status |
|---|---|
| Emotion identification (6 core emotions) | 🔨 **Feelings Lab**: emotion-face rounds + scenario→feeling rounds |
| Emotional understanding (why emotions happen) | 🔨 Feelings Lab "why" cards per emotion |
| Self-regulation: breathing, calm-down techniques | 🔨 Feelings Lab: guided breathing (animated), calm-down toolkit; panic-mode co-regulation already exists for parents |
| Emotional growth dashboard | 🔨 accuracy + vocabulary growth stats; feeds the emotional band |

### Epic 8 — AI Play Sessions
| Ask | Status |
|---|---|
| Problem solving / social / language / emotional scenarios | ✅ Adventures (logic, sequencing, vocabulary, instructions, abstract) + Feelings Lab scenarios |
| Memory challenges | 🔨 **Memory Match** game in Adventures (pairs grid) |
| Adapt difficulty | 🔨 performance-adaptive sizing (grid grows with success rate; scenario age-band selection nudged by performance) |
| Measure performance, identify strengths/challenges | ✅ all play records feed the bands |

### Epic 9 — Personalized Development Journey
| Ask | Status |
|---|---|
| Weekly development plan (daily activities, stories, games, speech) | 🔨 **Journey tab**: auto-composed 7-day plan from bands + weekly focus (each day: mission, aimed practice, story/adventure suggestion) |
| Monthly objectives with tracking | 🔨 3 suggested objectives from weakest bands, parent-editable, completion-tracked |
| Inputs: assessment, age, parent goals, professional recommendations | ✅/🔨 bands + age + goals (existing GoalsCard) feed the composer |

### Epic 10 — Development Timeline
| Ask | Status |
|---|---|
| Unified record: milestones, assessments, moments, stories | ✅ Story timeline (unified signal timeline) + Child Memory |
| Achievements | 🔨 achievement badges from practice/play/streak data (in Journey) |
| Parent Memory Book / shareable growth summary | 🔨 copyable "Memory Book" growth summary in Journey; print-grade book ⏩ |
| Physical-domain milestones | ✅ sensory & movement exists in screener + milestone domains |
| Videos | ⛔ as written — no video storage in scope (privacy surface, cost); photo moments already supported on logs |

## What we're NOT building (consolidated)

1. **Developmental-age point estimates** — bands + confidence + trend instead (clinical defensibility).
2. **Condition-named risk labels in parent UI** ("ASD risk," "ADHD risk") — observable-pattern language + professional routing instead.
3. **Animated video generation & video storage** — illustrated scenes + read-along; photos only.
4. **Standalone professional portal** — deferred until the share flow has real professional users (pro-platform strategy gate).
5. **Camera-based emotion recognition of the child** — emotion ID is the *child recognizing emotions*, not Arbor classifying the child's face. The distinction is an ethical line, not a technicality.

## Hypotheses (carried + new)

- H1–H3 from the Fall-release PRD remain the gating metrics (habit, SLP value, recommendation-followed).
- **H4:** Watch Signals' "monitor" level produces professional consultations (consult-request rate from dashboard ≥5% of flagged families in 90 days) without alarm-driven churn (no retention drop in flagged cohort).
- **H5:** The Journey weekly plan lifts mission completion vs the bare rotation (A/B by cohort once n allows).

## Success metrics

- 30 days: band-snapshot history exists for ≥80% of active families (proves passive assessment loop); Feelings Lab tried by ≥40%.
- 90 days: H4 consult-rate measured; therapist report containing practice data shared ≥10 times.
- 180 days: timeline + Memory Book referenced in ≥3 SLP/pediatrician conversations (qualitative).

## Build plan (today)

1. Assessment depth: `bandSnapshots` collection, weekly auto-snapshot, trend arrows, per-domain confidence, radar chart; hero-run metrics into bands.
2. Watch Signals engine (`practice/watch.ts`, pure + tested) + Dashboard card with monitoring plan.
3. Speech Coach modes: Words (naming, categories) + Express (questions, scene description, story starters); generic `practiceEvents` collection.
4. Feelings Lab tab (emotion ID, why-cards, breathing, calm toolkit, growth stats).
5. Adventures: Memory Match + adaptive difficulty.
6. Journey tab: weekly plan composer, monthly objectives, achievements, Memory Book summary.
7. Professional reports: bands + practice block in therapist/pediatrician exports.
8. Wire (2 new tabs), full gates (tsc, tests, build), browser verification, deploy.
