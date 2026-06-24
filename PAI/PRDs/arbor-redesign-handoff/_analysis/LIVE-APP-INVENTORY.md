# Arbor Live App Feature Inventory

**Generated:** 2026-06-23  
**App Root:** C:/Users/dguyr/ROS/PPPPtherapy-/PPPPtherapy-/app  

## EXECUTIVE SUMMARY

The live Arbor app spans 6 sections, 34 tabs, 14 practice worlds, 250+ activities, and parent-coaching AI.

**Architectural moat:** Parent-controlled memory ledger (append-only, source-linked, time-boxed); scholar-lens guided coaching (6 Frames routing); export/handoff workflow; multi-child co-parent sharing (Family tier); COPPA/GDPR ready consent.

---

## ROUTES & SCREENS (34 Tabs Total)

### TODAY (1 tab)
- **overview** [FULL] — Dashboard: rhythm prediction, daily play pick, quick-log, trends, reminders

### ASK ARBOR (1 tab)
- **coach** [FULL] — Streaming coach: scholar lenses (6 frameworks), structured contract, voice I/O, memory proposals

### MY CHILD (13 tabs)
- **timeline** [FULL] — Unified signal timeline (milestones, logs, journeys, memories, practice)
- **development** [FULL] — Hub: domain radar, competence ladder, streak
- **behaviors** [FULL] — Quick-log (intensity 1-5, context, trigger, response, photo), pattern analysis
- **language** [FULL] — Multilingual (home+2nd+exposure), phrase cards, Serve & Return
- **profile** [FULL] — Profile editing, avatar generation (local-only)
- **memory** [FULL] — Append-only ledger: pending→approve/reject/delete
- **milestones** [FULL] — CDC/ASQ (7 domains × 12 bands), corrected-age for preterm
- **strengths** [PARTIAL] — Strengths/challenges editor
- **screening** [PARTIAL] — Non-diagnostic screener
- **comics** [PARTIAL] — Hero-in-comic generation
- **journey** [FULL] — Development journey objectives (monthly per domain)
- **copilot** [FULL] — AI recommendation engine for this week
- **weekly** [FULL] — Weekly wrap narrative + pattern insights

### GROW (3 tabs)
- **daily-play** [FULL] — 250+ activity library, smart picker (age+concern), courses
- **practice** [FULL] — Hero Arcade: 14 worlds, cosmetics (badges, titles, frames)
- **plans** [FULL] — Growth plan generation, kanban steps, scripts

### CARE NETWORK (5 tabs)
- **consult** [FULL] — Ask specialist, handoff brief, find professional
- **care-team** [FULL] — Share grants display, inbound shares
- **sharing** [FULL] — Create grants (role, scope, duration), co-parent seat limit
- **appointments** [FULL] — Calendar, reminders, notes
- **safety** [FULL] — Escalation criteria, crisis resources

### ARBOR ACADEMY (3 tabs)
- **stories** [FULL] — 10 hero journeys (4 packs, 8-beat spine, choices, metrics)
- **masterclasses** [FULL] — Parent education modules
- **family** [FULL] — Family formation guidance

---

## 14 PRACTICE WORLDS (Full Suite)

1. Speech Lab — ASHA-gated articulation, 3-level ladder, browser ASR
2. Mood Mountain — Emotion ID, why, calm strategies
3. Story Quest — Branching scenarios, comprehension
4. Mimic Studio — Face imitation, local camera
5. Mind Vault — Memory match game
6. Spell Forge — Phonics, sight words, letter tracing
7. Beat Keeper — Rhythm timing game
8. Hero Pose — Action pose imitation
9. Pattern Power — Sequence continuation, logic
10. Order Builder — Practical sequencing
11. Truth Compass — Honest words + kindness
12. Promise Ladder — Follow-through responsibilities
13. Courage Steps — Small brave actions
14. Aim Map — Helpful goals & concrete actions

Cosmetics: Badges (50+), Titles, Frames earned every 5 sessions.

---

## CORE CAPABILITIES MATRIX

| Capability | Status | Notes |
|------------|--------|-------|
| Streaming parent coach | FULL | Gemini 2.5 Flash, 6 scholar lenses, structured output, Six Frames routing |
| Memory ledger | FULL | Append-only, source-linked, time-boxed, parent-controlled |
| Milestone tracking | FULL | CDC/ASQ (7 domains × 12 bands), corrected-age, custom milestones |
| Behavior logging & analysis | FULL | Quick-log (intensity, context, trigger, response, photo), pattern insights |
| Practice studio (14 worlds) | FULL | All games with score tracking, cosmetics progression |
| Hero journeys | FULL | 10 stories, 4 packs, 8-beat spine, choice mechanics, metric earn |
| Daily activity picker | FULL | 250+ activities, age+concern weighting, diversity-aware, courses |
| Growth plans | FULL | Challenge→multi-phase, scripts, kanban steps |
| Professional handoff | FULL | Warm brief, teacher/specialist notes, export |
| Sharing & roles | FULL | Co-parent/professional/viewer, time-boxed, server-enforced |
| Multi-child management | FULL | Switch child, add/edit profiles, family subscriptions |
| Avatar generation | FULL | Local-only, from photo or descriptor, reusable |
| Image generation | FULL | Story beats, comic panels (Gemini vision) |
| Consent & privacy | FULL | Purpose-scoped (face, voice, AI training), COPPA-ready, export/erase |
| Billing & entitlements | FULL | Free/Plus/Family, RevenueCat, metering, paywall |
| Safety & escalation | FULL | Input/output screening, escalation keywords, trust bar, crisis resources |
| Internationalization | FULL | English/Hebrew UI, RTL, Hebrew AI output (first draft) |
| Voice I/O | FULL | Web Speech API input, Gemini TTS output |
| Weekly digest | PARTIAL | Summary generation, email delivery TBD |
| Admin dashboard | FULL | User count, paying breakdown, token spend |
| Real-time sessions | STUB | Infrastructure only, no UI |

---

## MUST-NOT-REGRESS (20 Critical Capabilities)

1. Parent coaching with scholar lens routing (psychologically-informed, not generic)
2. Non-diagnostic safety screening (escalation keywords, trust bar)
3. Child memory ledger (append-only, source-linked, time-boxed moat)
4. Milestone tracking with corrected age (CDC/ASQ, preterm support)
5. 14 skill-building worlds (full practice suite)
6. Hero journey storytelling (10 stories, 8 beats, choices, metrics)
7. Smart daily activity picker (250+ activities, concern-weighted)
8. Growth plans (multi-phase, scripts, success indicators)
9. Professional handoff (warm brief, teacher/specialist)
10. Multi-child management (switch, add, family subscriptions, co-parent role Family tier)
11. Sharing with roles & scopes (time-boxed, granular, revocable)
12. Consent & COPPA (purpose-scoped, export/erase)
13. Bilingual support (Hebrew UI + RTL + AI output if maintained)
14. Avatar generation (local, reusable across stories/practice)
15. Jitai nudging (context-aware coaching opportunities)
16. Trust/safety bar (risk level on coach responses)
17. Voice I/O (speech input + TTS output in coach)
18. Weekly digest & timeline (unified signals: logs+milestones+journeys+practice)
19. Playbank courses (multi-week activity sequences)
20. Responsive mobile-first design (collapsible tools, mobile nav, touch-friendly)

---

## KEY FILE LOCATIONS

- **Navigation:** `ArborContext.tsx`, `navigation.ts`, `Shell.tsx`
- **Coaching:** `CoachTab.tsx`, `routes/api.ts` (/api/chat, /api/council), `scholars.ts`
- **Memory:** `ChildMemory.tsx`, `memoryService.ts`
- **Milestones:** `MilestonesTab.tsx`, `milestoneData.ts`
- **Practice:** `HeroArcade.tsx`, `cosmetics.ts`, `content.ts`
- **Stories:** `HeroJourneyTab.tsx`, `heroJourneys.ts`
- **Daily Play:** `DailyPlayTab.tsx`, `playbank/content.ts`, `playbank/select.ts`
- **Plans:** `PlansTab.tsx`, `routes/api.ts` (/api/generate-plan)
- **Sharing:** `TrustedSharing.tsx`, `sharing/shares.ts`
- **Safety:** `SafetyTab.tsx`, `safety/escalation.ts`
- **i18n:** `LanguageContext.tsx`, `i18n.ts`
- **Billing:** `PaywallModal.tsx`, `useEntitlement.ts`
- **Multi-Child:** `ProfileContext.tsx`, `ProfileSwitcher.tsx`

---

END OF INVENTORY (2026-06-23)
