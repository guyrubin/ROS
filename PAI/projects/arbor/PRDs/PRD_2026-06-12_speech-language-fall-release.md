# PRD — Arbor Fall Release: Speech & Language Development Suite
Date: 2026-06-12
Author: Guy Rubin
Status: Draft → In build (same-day execution, commits on `main`)
Venture: Arbor (AI parenting / child-development platform)

## Problem

Arbor today is strong on *understanding* (coach, memory, milestones, screening) but thin on *daily skill-building*. The market leaders in the speech & language category — Articulation Station, Speech Blubs, Otsimo, MITA — each own one slice of structured practice. None of them connects practice data back into a longitudinal developmental picture a parent, speech-language pathologist (SLP), or health fund can act on.

Arbor's wedge: don't copy any single app — **connect the category**. Practice generates signal; signal feeds the Development Copilot; the Copilot feeds the existing professional handoff (Reports, Trusted Sharing). That is the prescribe→signal loop the professional-platform strategy already selected as the wedge.

## User persona

- **Primary:** Parent of a child aged 2–7 with a speech/language concern (late talker, unclear articulation, bilingual transition) — motivated for 5–10 min/day of guided practice, anxious about "is this normal," not equipped to evaluate progress.
- **Secondary:** SLP / developmental professional who told the parent to "practice at home" and currently gets zero data back between sessions.

## Goals

1. A parent can run a complete 5–10 minute practice session daily with zero preparation.
2. Every practice interaction produces a stored, per-child signal (sound accuracy, mission completion, comprehension result).
3. The Development Dashboard turns those signals + existing milestones into a per-domain picture with one concrete weekly recommendation.
4. Practice data flows into the existing professional report/handoff path.

## The ten features (sourced → ported)

### Module A — Speech Coach (from Articulation Station)
| # | Feature | What ships |
|---|---|---|
| 1 | **Sound Studio** | Age-banded target-sound library (18 English + early-acquisition set), word lists per sound, difficulty ladder: isolated sound → word → sentence → story prompt. Sound selection guided by typical acquisition ages — never framed as diagnosis. |
| 2 | **Record & Compare** | Child recording via MediaRecorder with instant playback next to a model pronunciation cue. Where the browser supports speech recognition, an automatic "heard you say…" match; everywhere, a parent-scored Got it / Almost / Try again. All audio stays on-device. |
| 3 | **Sound Progress Tracking** | Per-sound accuracy + consistency trend over time, visible to the parent and exportable to the SLP via Reports. |

### Module B — Mimic Studio (from Speech Blubs)
| # | Feature | What ships |
|---|---|---|
| 4 | **Mimic Mirror** | "Can you do what I do?" imitation prompts (mouth shapes, syllables, animal sounds) beside a live camera mirror (getUserMedia, local-only, explicit consent, nothing recorded or uploaded). Video modeling via expressive prompt cards in v1 — not real-children video content. |
| 5 | **Sound Packs & Rewards** | Themed packs (Animal Sounds, First Words, Silly Faces, Power Syllables) with instant celebration feedback and per-pack completion stickers. |

### Module C — Development Missions (from Otsimo)
| # | Feature | What ships |
|---|---|---|
| 6 | **Daily Mission Engine** | Rotating 5-day cycle: Day 1 new words · Day 2 emotions · Day 3 story retell · Day 4 sound mimicry · Day 5 social play. Each mission = one card with a 3-step parent script, "Coach me" into Ask Arbor, and a done-toggle. |
| 7 | **Development Score & Streaks** | Fitbit-style weekly score aggregating practice volume + breadth across domains, with streak tracking. Framed as *practice consistency*, never as child ability. |

### Module D — Cognitive Adventures (from MITA)
| # | Feature | What ships |
|---|---|---|
| 8 | **AI Adventures** | Scenario-based comprehension play: "The lion is hungry — what does he need?" Choice → gentle feedback → next scene. Covers instruction-following, logic, sequencing, vocabulary, abstract thinking. v1 = curated age-banded scenario bank (deterministic, sandbox-safe); AI-generated scenarios are a fast follow. The child never sees a test — only a story. |

### Module E — Child Development Copilot (the killer feature — connect, don't copy)
| # | Feature | What ships |
|---|---|---|
| 9 | **Development Dashboard** | Per-domain picture (language, speech sounds, cognition, social, emotional regulation) combining milestone completion + practice signals, shown as domain strength bands relative to age expectations. Explicitly non-diagnostic: bands, not "developmental age = 3.7 years" precision we cannot defend clinically. |
| 10 | **Copilot Recommendation + Clinician Summary** | One weekly recommendation ("increase emotion-recognition play — here's tomorrow's mission") that re-aims the Mission Engine, plus a practice-data summary block that rides the existing professional report/handoff path. |

## What we're NOT building (this release)

- **Phoneme-level acoustic scoring or ML lip/face tracking.** Browser speech recognition + parent scoring is the honest v1. *Real-time articulation analysis is a research project, not a fall feature.*
- **"Developmental age = X.X years" numbers.** The Copilot shows bands and trends. Pinpoint age-equivalents without normed instruments is clinically indefensible and an EU-MDR trap.
- **Real-children video content** (Speech Blubs' core asset) — licensing/COPPA/consent burden; prompt cards + the mirror deliver the imitation mechanic.
- **Hebrew articulation sound set** — English-first; Hebrew set is a fast follow once the mechanic is validated.
- **Any cloud upload of audio/video.** All capture is on-device and ephemeral except the scores the parent confirms.
- **Health-fund integrations, CE marking, clinical validation studies** — these consume the signal later; they are not gated on this release.

## Hypotheses (labelled — these are not requirements)

- **H1 (riskiest):** Parents will sustain a daily 5–10 min practice habit when missions remove all preparation. Kill criterion: <20% of active families complete ≥3 missions/week by day 30.
- **H2:** Parent-scored articulation accuracy is a good-enough signal for SLPs to find the trend report useful. Validate with 3 SLP interviews on the report artifact.
- **H3:** A weekly Copilot recommendation measurably shifts which missions get done (recommendation-followed rate >40%).

## Requirements

### Must have (this build)
- All ten features above, sandbox-safe (work with no API key, no Firebase).
- All practice data persisted per child via the existing child-collection layer (Firestore when authed, localStorage sandbox).
- Microphone/camera: explicit in-context consent, local-only processing, clear privacy copy.
- Non-diagnostic framing + TrustSafetyBar on the Dashboard and Speech Coach.
- Navigation: new "Practice Studio" section (Speech Coach, Mimic Studio, Daily Missions, Adventures); Development Dashboard under My Child.

### Should have (fast follow)
- AI-generated adventure scenarios via the model router; Hebrew sound set; recommendation push into the weekly digest; SLP-facing standalone report page.

### Won't have (this version)
- Everything in "NOT building" above; multiplayer/social play; offline PWA packaging.

## Success metrics

- **30 days:** ≥50% of active families try ≥2 modules; ≥20% complete 3+ missions/week (H1 gate).
- **90 days:** ≥500 stored practice signals per retained family; 3 SLP interviews validate the summary report (H2); recommendation-followed rate measured (H3).
- **180 days:** First external professional consuming practice reports through Trusted Sharing; decision point on clinical-validation investment.

## Risks and open questions

- [ ] H1/H2/H3 validation above.
- [ ] Browser speech recognition quality varies (Chrome good, Safari partial, Firefox absent) — parent scoring is the universal floor; confirm degradation UX is acceptable.
- [ ] Camera mirror + children: confirm privacy copy with counsel before public launch (already local-only by design).
- [ ] Development Score naming: "practice score" vs "development score" — current build says Development Score with explicit consistency framing; revisit with clinical advisor.
- [ ] Does Practice Studio deserve its own top-level section long-term, or fold into Growth Plans after data?

## Timeline

- **Today (2026-06-12):** All ten features implemented on `main`, sandbox-verified, build green.
- **Week of 2026-06-15:** Push + production deploy (watch CSP per backlog note), family beta exposure.
- **By 2026-07-10:** H1 instrumentation review; SLP interviews booked.
- **Fall window:** Hebrew sound set + AI adventures + digest integration, gated on H1.

## Source apps (category map)

1. Articulation Station — articulation practice, 20+ sounds, word→conversation ladder (readingrockets.org review).
2. Speech Blubs — video-modeling mimicry, voice-activated, sound packs (speechblubs.com).
3. Otsimo Speech Therapy — 150+ activities across first words, body parts, colors, vocabulary (otsimo.com).
4. MITA — cognitive/language training: instructions, logic, sequencing, abstraction (littlegemsspeechtherapy.com roundup).
