# Redesign Reconciliation — Adversarial Completeness Audit

**Date:** 2026-06-23
**Auditor:** arbor-product (adversarial completeness critic pass)
**Sources read:** PROTOTYPE-CATALOGUE.md · REDESIGN-DIFF.md · PRODUCT-BACKLOG.md (Redesign Reconciliation, AP-043–AP-054) · LIVE-APP-INVENTORY.md · raw `Arbor Prototype.dc.html` (spot-checked lines 1580–1860)

**Verdict:** The PM captured 12 Bucket-A items (AP-043–AP-054) correctly. **6 net-new prototype features with no live equivalent were not ticketed.** They are not in any AP- slot, not in any Council Intake block, and are not classified as Bucket B or C in REDESIGN-DIFF. Each is confirmed present in the prototype source and absent from LIVE-APP-INVENTORY.md.

---

## MISSED NET-NEW ITEMS (6)

### M-1. Scholar Hub — weekly auto-matched developmental concept feed
**Design file / section:** `Arbor Prototype.dc.html` lines 1666, 1761–1769 (FEAT map entry + full `scholar` detail block); PROTOTYPE-CATALOGUE §1C "Scholar Hub."
**What it is:** A parent-facing surface surfacing one developmental concept per week, auto-matched to the child's current pattern (e.g. "window of tolerance — Dr. Dan Siegel, 5 min read"). Topics: Regulation, Attachment, Bilingualism, Transitions. Each article is auto-selected from the child's live data, not a generic catalogue. Prototype routes it under the ACADEMY category landing alongside courses, activities, and Bedtime Stories.
**Why net-new:** The live app has `masterclasses` [FULL] (parent education modules) but LIVE-APP-INVENTORY.md contains no Scholar Hub, no weekly auto-matched concept, no article-recommendation engine keyed to the child's domain data. The REDESIGN-DIFF does not classify it in Bucket A, B, or C. The PROTOTYPE-CATALOGUE §5 explicitly lists "Scholar Hub" as a concept the web summary did not mention.
**Proposed ticket:** AP-055 — Scholar Hub: weekly auto-matched developmental-concept feed, keyed to the child's lowest domain, surfaced in the Academy category landing.

---

### M-2. School Handoff Brief — 1-page preschool-staff export (distinct from specialist/clinician handoff)
**Design file / section:** `Arbor Prototype.dc.html` lines 1671, 1752–1760 (FEAT map entry + full `handoff` detail block); PROTOTYPE-CATALOGUE §1C "School Handoff."
**What it is:** A distinct, parent-controlled 1-page brief for preschool / kindergarten staff: what calms the child, words that help, bilingual context (Hebrew at home, English at school). Private until the parent approves export. Export PDF or send to the teacher. Content: calm strategies, transition phrases, bilingual framing. Separate from the clinical consult packet (Care Network, B-9).
**Why net-new:** LIVE-APP-INVENTORY.md lists "Professional handoff [FULL] — warm brief, teacher/specialist notes, export" at the `consult` route — this is the clinician/specialist-facing consult packet. The prototype's School Handoff is a distinct artifact aimed at preschool teachers, not specialists. It has different content (routine language, transition phrases, bilingual context), a different audience, a different privacy gate ("nothing shared until you approve"), and a different scope (1 page, no clinical data). REDESIGN-DIFF Bucket B item B-9 note says "Do not flatten" the care structure but does not classify the School Handoff as net-new either. The PROTOTYPE-CATALOGUE §5 explicitly calls it out as a new dashboard. No AP- ticket exists.
**Proposed ticket:** AP-056 — School Handoff Brief: 1-page preschool-staff export (what calms / words that help / bilingual context), parent-gated, PDF-export; distinct from clinician consult packet. Gate: arbor-clinical-psych copy pass on transition-language framing; arbor-safety COPPA review (child data in export).

---

### M-3. Bedtime Stories — AI-generated personalized story library starring the hero avatar
**Design file / section:** `Arbor Prototype.dc.html` lines 1667, 1812–1820 (FEAT map entry + full `stories` detail block); PROTOTYPE-CATALOGUE §1C "Bedtime Stories."
**What it is:** A distinct parent-accessible surface — a library of personalized bedtime stories built around the child's day and starring their hero avatar. Stories are generated fresh ("new tonight" example: "Mia and the Brave Goodbye"), have read-aloud voice playback in the child's chosen language (HE or EN), and are distinct from the Hero Comics (child-facing, canvas-rendered) and the Hero Journeys (interactive 8-beat stories in the Academy). The prototype routes Bedtime Stories under the ACADEMY category as "Mia's library."
**Why net-new:** LIVE-APP-INVENTORY.md has `stories` [FULL] = "10 hero journeys (4 packs, 8-beat spine, choices, metrics)" — those are the interactive child-facing narrative adventures. Bedtime Stories is a distinct format: parent-side (or handoff to the child), auto-generated from the day's events, read-aloud voice playback, HE/EN, starring the avatar. No equivalent route or capability appears in LIVE-APP-INVENTORY.md. REDESIGN-DIFF Bucket C notes "Prototype shows 4 stories. Live has 10" — this refers to the Hero Journeys, not to the Bedtime Stories surface. No AP- ticket exists.
**Proposed ticket:** AP-057 — Bedtime Stories: AI-generated nightly story library, rooted in the child's day, starring the hero avatar, with HE/EN read-aloud; separate from Hero Journeys and Hero Comics. Gate: arbor-safety COPPA review (child-day data input); arbor-clinical-psych copy pass on any developmental framing in generated story prompts.

---

### M-4. Smart Reminders detail dashboard — JITAI nudge settings with calm-window scheduling and quiet-hours
**Design file / section:** `Arbor Prototype.dc.html` lines 1674, 1845–1860 (FEAT map entry + full `reminders` detail block); PROTOTYPE-CATALOGUE §1C "Smart Reminders."
**What it is:** A dedicated parent-facing settings + status surface for the nudge engine: shows the next scheduled nudge (time + type), a list of reminder types the parent can toggle (Today's guidance, milestone moment, weekly report), quiet-hours enforcement, and an explicit "max 2 nudges/day" contract. The prototype routes it as a full mini-dashboard under ASK ARBOR, not as a buried settings toggle.
**Why net-new:** LIVE-APP-INVENTORY.md shows the JITAI engine (`lib/jitai.ts`) produces nudges that appear as inline elements on the Today/Overview tab and in `appointments` (Calendar, reminders, notes). There is no dedicated Smart Reminders settings/status surface — no route, no dedicated tab. The REDESIGN-DIFF A-3 (Notification Bell, AP-046) only adds a notification-list inbox; it does not create a settings/cadence-management surface. The Smart Reminders dashboard is the control surface where parents manage nudge type, frequency, quiet hours, and calm-window scheduling — a distinct UX need. No AP- ticket exists.
**Proposed ticket:** AP-058 — Smart Reminders settings dashboard: parent-controlled nudge cadence (type toggles, quiet-hours, calm-window scheduling, ≤2/day ceiling), surfaced as a dedicated view wiring to the existing JITAI engine. Gate: arbor-clinical-psych copy pass on nudge-cadence framing (advisory-tension item per existing backlog context on nudge engines).

---

### M-5. Kid Weekly Missions Calendar — 7-day mission-progress strip in the Studio
**Design file / section:** `Arbor Prototype.dc.html` lines 884–895, 1580–1588, 2095 (`weekMissions` data + render block + `missionsTitle`); PROTOTYPE-CATALOGUE §1D "Studio / Learning Studio — weekly missions calendar."
**What it is:** A 7-day strip in the kid's Learning Studio showing per-day mission completion status (color-coded by activity type: movement/art/feelings/reading/etc.), with a "done" ring state and a "today" highlight. Distinct from the daily-goal ring (3 goals: Quest/Feeling/Practice) and from the Effort Badges. This is a week-view habit calendar embedded in the child-facing Studio — the weekly cadence layer of the kid economy.
**Why net-new:** LIVE-APP-INVENTORY.md has the practice studio (14 worlds, cosmetics) and cosmetics (50+ badges/titles/frames earned every 5 sessions). None of this is a weekly missions calendar with a 7-day strip in the Studio. The REDESIGN-DIFF Bucket C row on cosmetics says "KEEP LIVE — 50+ cosmetics. Prototype treasure system is a simplified illustration" — this refers to the Treasure rewards, not the weekly missions strip. The effort badges (also in the prototype Studio) are not the same as the weekly calendar. No AP- ticket exists.
**Proposed ticket:** AP-059 — Kid weekly missions calendar: 7-day per-day mission-type progress strip in the Learning Studio, keyed to the existing quest/practice engine; safe (kid UI, no new child-data write beyond existing session data).

---

### M-6. "The Science" / Evidence Page — parent-facing source transparency dashboard
**Design file / section:** `Arbor Prototype.dc.html` lines 1802–1811 (full `evidence` detail block); PROTOTYPE-CATALOGUE §1C "The Science — 133 milestones · 7 domains · 40+ sources"; also referenced in §1A under parent feature-catalogue.
**What it is:** A standalone parent-facing page asserting the clinical framework: 3 headline stats (133 milestones, 7 domains, 40+ sources), the clinical board composition (child psych / speech / developmental pediatrics), cited frameworks (CDC "Learn the Signs," ASQ-3, Co-regulation Siegel & Bryson), a list of source documents, and an explicit "Arbor isn't a diagnostic tool" disclaimer. Presented as a trust/credibility surface — the parent can verify why Arbor knows what it knows.
**Why net-new:** LIVE-APP-INVENTORY.md has no "Science" or "Evidence" tab or page. The existing coach citations (AP-010) surface server-side source names on the CoachTab — that is a coach-response-level citation, not a product-level trust page about the overall framework. The prototype's Evidence page is a product-level credibility surface separate from per-response citations. No AP- ticket exists. Note: this item carries clinical claim exposure — the "clinician-reviewed" framing in the prototype hero card ("Expert-Reviewed / Arbor's clinical board") is exactly the language the Clinical Board firewall prohibits per CHARTER §3 p11. Requires arbor-clinical-lead copy clearance before ship.
**Proposed ticket:** AP-060 — "The Science" page: parent-facing source-transparency dashboard (framework stats, cited standards, disclaimer); Gate: arbor-clinical-lead copy pass required — the prototype's "clinician-reviewed" hero-card language is a firewall violation and must be reworded to "developmentally informed, grounded in CDC/AAP/ASHA" before this is build-ready.

---

## 3 CLOSEST CALLS (checked and ruled NOT missed)

**Close call 1 — Family Circle (role-based caregiver sharing)**
PROTOTYPE-CATALOGUE §1C lists "Family Circle — invite co-parent/grandparent/nanny; role-based access (Parent=all, Grandparent=milestones, Carer=routines); revocable." This looks net-new. On check: LIVE-APP-INVENTORY.md has `sharing` [FULL] = "Create grants (role, scope, duration), co-parent seat limit" and `care-team` [FULL]; REDESIGN-DIFF Bucket B item B-10 calls it out explicitly: "Prototype's Family Circle has 5 roles but no co-parent-seat-limit enforcement. Live enforces this server-side." Ruling: Bucket B (already live, richer in live than prototype). Not missed.

**Close call 2 — Daily Routines with step-progress feeding the Development Map**
PROTOTYPE-CATALOGUE §1C: "Daily Routines — morning/evening/transition routines with step progress; completing a routine feeds Self-Regulation on the Map." The value-loop connection (routine completion → domain %) sounds net-new. On check: LIVE-APP-INVENTORY.md has no "routines" tab. The live app has a Daily Play picker (250+ activities) and Plans tab (kanban steps) but no routine-step-progress surface. This appears genuinely net-new. However, on close inspection the prototype's Daily Routines detail (`Arbor Prototype.dc.html` line 1831) presents the routine as a list of steps (morning/evening) with a "complete" state that feeds Self-Regulation — it is substantially the same data model as the live Plans tab (kanban steps, domain-tagged). The REDESIGN-DIFF did not ticket it separately; it is architecturally subsumed by the Plans tab as a view variant. This is a judgment call: the surface is net-new (no dedicated route) but the underlying capability is live. This item sits on the boundary and should be flagged to the PM for a deliberate inclusion/exclusion call — it is not a clear miss, but it is also not a clear Bucket B.

**Close call 3 — Consult-packet per-line redaction (include/exclude toggle)**
PROTOTYPE-CATALOGUE §2: "Consult-packet redaction with per-line include/exclude + live selected-count, plus Copy/Download/PDF/Send." This is more granular than the live "build verified packet." On check: LIVE-APP-INVENTORY.md has `consult` [FULL] = "Ask specialist, handoff brief, find professional." REDESIGN-DIFF Bucket B item B-9 says "Do not flatten." The per-line redaction is a UX upgrade to an existing live capability, not a new capability — it is the existing consult surface with finer parent control. The REDESIGN-DIFF correctly classifies it as a Bucket B protect note ("Do not flatten"), meaning the redesigned Care Network shell must preserve (and ideally improve) the existing consult capability. A dedicated ticket for the per-line redaction UX upgrade would be appropriate but it is defensible as a scope note on the AP-049/redesign wave, not a net-new capability gap. Not a clear miss.

---

## GATE SUMMARY FOR MISSED ITEMS

| ID | Title | Safe/Gated | Clinical gate required |
|----|-------|------------|----------------------|
| AP-055 | Scholar Hub weekly concept feed | safe (read-only, existing content) | No — content is editorial, not a developmental claim |
| AP-056 | School Handoff Brief | gated | Yes — arbor-clinical-psych copy pass + arbor-safety COPPA review |
| AP-057 | Bedtime Stories | gated | Yes — arbor-safety COPPA (child-day data input) + arbor-clinical-psych story-prompt framing |
| AP-058 | Smart Reminders dashboard | gated | Yes — arbor-clinical-psych nudge-cadence framing pass |
| AP-059 | Kid weekly missions calendar | safe | No — kid UI, no new child-data write |
| AP-060 | The Science page | gated | Yes — arbor-clinical-lead must reword "clinician-reviewed" to "developmentally informed"; firewall violation blocks ship |

---

*Audit complete. 6 missed net-new items found. All 6 confirmed present in raw prototype source and absent from LIVE-APP-INVENTORY.md and from the AP-043–AP-054 ticket set. Write these into a Council Intake block before the next Product Council run. Do not promote to build-ready until clinical gates are cleared for the gated items.*
