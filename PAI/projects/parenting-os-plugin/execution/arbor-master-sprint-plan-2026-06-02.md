# Arbor — Master Sprint Plan (merged backlog)

**Date:** 2026-06-02
**Owner:** PAI
**Merges:** advisory `arbor-enhancement-backlog-jbp-2026-06-02.md` (A/K/D) · capability `arbor-capability-backlog-2026-06-02.md` (H/E) · study-group QA `arbor-study-group-backlog-2026-06-02.md` (G).
**Code:** `PPPPtherapy-/PPPPtherapy-/app/src` (`App.tsx`, `initialData.ts`, `routes/api.ts`, `contracts/coach.ts`, `safety/escalation.ts`).

This is the single source of truth for sequencing. The three source backlogs remain the detailed ticket specs; this file decides **order** and removes duplicates.

---

## 🎯 Sprint 1 goal (set 2026-06-02)

> **Ship Tier 0 bugs → Tier 1 legibility this sprint** — it's all small and it's exactly the "tell the truth / calm the room" work the advisory backlog called P0. **Fold G-10/G-11 into the A-01/A-02 profile work** since it's the same code.

### Sprint 1 ticket list (deduped, in build order)

**Block 1 — Bugs (nothing demos until these die)**
- **G-01** Blueprint button produces nothing → fix or hide. `App.tsx` (milestones)
- **G-02** Story buttons overlap → z-index/layout fix. `App.tsx`
- **G-03** Colour contrast unreadable → WCAG-AA pass *(= D-06; wedge into the D-01 aesthetic decision)*. `App.tsx`, tokens

**Block 2 — Legibility & "tell the truth" (small, trust-building)**
- **G-04 = A-04/D-02** Kill jargon ("Sage-Clay", "Total Mastery") + de-grandify copy. `App.tsx`, `initialData.ts`
- **G-06** "New" button affordance (Parent Coach) → relabel to its real action. `App.tsx`
- **G-05 = H-09** Theorist cards show a plain one-liner (Parent Coach **and** Scholar Academy). `App.tsx`, `initialData.ts`
- **G-07** Reminders → visible default-open Enable/Disable toggles. `App.tsx`
- **G-08** EDIT panel: bigger font + rewrite the Risk Level question. `App.tsx`
- **G-09** Align the three top dashboard cards. `App.tsx`

**Block 3 — Profile (one code path, do once)**
- **A-01** Real onboarding + child profile create/edit (replace hard-coded "Dylan, 5"). `App.tsx`, profile store
- **A-02** Multi-child family model + child switcher (API already keys on `childId`). `App.tsx`, `routes/api.ts`
- **G-10** ↳ Child photo/avatar in the profile editor *(folds into A-01)*. mind consent/retention.
- **G-11 = H-06** ↳ Manual challenge entry → AI sharpening → plan *(`/api/analyze-behavior` wired to a manual entry point)*. `App.tsx`, `routes/api.ts`

**Sprint 1 done when:** no dead/overlapping controls; contrast passes AA; no cockpit/jargon copy on any screen; a parent can create + switch between real children (with a photo); a typed challenge yields a saved, source-grounded plan.

---

## ⚠️ Parallel non-negotiable: the safety gate (does NOT wait for a sprint slot)

The advisory pass is explicit: **you cannot ethically run a beta with real families until these land.** They are not in the Sprint 1 *goal* (which is the visible UX work), but they gate the beta and should run in parallel, not after.

- **K-03** Replace crisis-resource placeholders with real, localised contacts *(most urgent item in the entire backlog — `escalation.ts` currently ships "Local resource placeholder" to a parent in crisis).*
- **K-01** Semantic safety classifier above the keyword regex.
- **K-02** Wire the high-risk human-review queue to the UI.

**E-01 (panic button) is blocked on K-03 — do not build it until crisis resources are real.**

---

## Sprint 2 — Close the loop (the PRD's core promise)

Make every coach answer persist, track, and close.
- **H-12 = A-03** Feedback control on every answer (the 70%-useful exit metric — currently unmeasurable). *Strong candidate to pull into Sprint 1 if capacity allows.*
- **H-01** Save `todayPlan` as a checkable, persisted plan.
- **H-02** Auto-create tracking prompts from the `observe` array.
- **H-03 = A-06/A-07** Follow-up + `InterventionOutcome` capture (worse/same/better/resolved).
- **A-05** Persist everything (logs/milestones/plans/stories survive refresh).
- **K-04/K-05** Typed retention policy + right-to-be-forgotten (child export + hard delete) — **AVG/GDPR deal-gate for the NL pitch.**
- **D-03** Remove `select-none` (parents must copy scripts). **D-04/D-05** calm motion, one primary action per screen.

## Sprint 3 — Surface the edge + first deep module

- **H-10 = A-08** Surface the Six Frames inline (lead with the load-bearing frame), not a footer.
- **K-08** Make Six Frames a routing decision, not boilerplate. **K-09** pattern detection across logs *(= G-12 clarify/build auto-categorisation)*.
- **E-03** Sleep & bedtime coach (flagship module). **H-04** illustrated stories. **H-05** discussion questions.
- **H-07** accumulate handoff notes. **H-08 = A-09/D-09** export/print a clean one-page handoff. **H-11 = K-06** source grounding visible.

## Later / gated
- **G-16** Account Settings (payment method + invoices) — **needs the pricing/beta-paid decision first.**
- **E-02** voice in/read-aloud · **E-04** co-parent (= A-10) · **E-05** visit prep · **E-06** responsibility ladder.
- **A-11** NL/HE localisation · **A-12** weekly review artifact · **K-07/K-10** eval harness + confidence calibration.
- **E-07** picky eating · **E-08** toilet training · **E-09** photo/video logging *(= G's multimodal; legal/AVG review)* · **E-10** keepsake · **E-11** screen-time · **G-13/G-14/G-15** theorist personalisation + folk/biblical story corpus + older-age challenges.

---

## Duplicate map (so we build each thing once)

| Theme | Tickets that are the same work |
|---|---|
| De-grandify / kill jargon | **G-04 = A-04 = D-02** |
| Contrast / accessibility | **G-03 = D-06** (wedge into D-01 aesthetic) |
| Theorist legibility | **G-05 = H-09** |
| Manual challenge → plan | **G-11 = H-06** |
| Child profile (incl. photo) | **A-01/A-02 ⊃ G-10** |
| Feedback / 70% metric | **H-12 = A-03 = C4** |
| Outcome loop | **H-03 = A-06/A-07** |
| Surface Six Frames | **H-10 = A-08 = C5** |
| Auto-categorise / patterns | **G-12 = K-09** |
| Handoff export/print | **H-08 = A-09 = D-09** |
| Source grounding | **H-11 = K-06** |
| Co-parent | **E-04 = A-10** |

## Open decisions (study group)
1. **Voice:** warm benefit-led headlines vs de-grandified copy — resolve before writing screen headers (blocks part of G-04).
2. **Pricing:** is beta paid? Gates **G-16**.
3. **Aesthetic (D-01):** commit to warm-paper field-notebook (advised) or formally adopt the dark cockpit — G-03 contrast work should land inside whichever is chosen.
