# Arbor — Capability Value Backlog (build-ready)

**Date:** 2026-06-02
**Owner:** PAI
**Adviser framing:** Jordan Peterson advisory engagement
**Source of truth for code:** `PPPPtherapy-/app/src` (`routes/api.ts`, `contracts/coach.ts`, `framework.json`, `memory/*`, `safety/escalation.ts`, `App.tsx`)

## How to read this

Two parts:

- **Part A — Harvest.** Capabilities we have *already built and paid for* but are not delivering value to the parent. These are cheap, high-return, and should ship first. Each cites the exact code that already exists.
- **Part B — Expand.** New capabilities inside our domain (child development 0–12), ranked by likely popularity × fit × safety. These are bets, scoped tightly.

Every ticket has: **Intent · Build · Files · Acceptance · Effort (S/M/L) · Priority (P0–P2)**.

Rule for the whole backlog: *no capability ships unless it survives the 11pm test — does it lower a frightened parent's heart rate and move responsibility toward their competence.*

---

# PART A — HARVEST: deliver value from what we already built

The coach endpoint already returns a rich structured contract (`coachResponseZodSchema`): `riskLevel, ageBand, domains, nonDiagnosticHypotheses, todayPlan, parentScript, avoid, observe, escalateIf, frameRouting, memoryProposals, handoffNotes, sourceCardsUsed`. **Today the UI throws almost all of that structure away and renders it as flat markdown** (`renderCoachResponse` → string). That is the single biggest pool of unrealized value in the product. Most of Part A is about making those fields *do something*.

### H-01 — Turn `todayPlan` into a saved, checkable plan · P0 · M
- **Intent:** The coach already produces a 1–3 step same-day plan every answer. The parent reads it and it evaporates. Make it stick.
- **Build:** Add a "Save as plan" action on each coach response that materializes `todayPlan` + `parentScript` into the existing `ActionPlan` structure and persists it. Steps become checkable (the toggle logic already exists: `handleTogglePlanStep`).
- **Files:** `App.tsx` (coach render + plans state), reuse `defaultActionPlans` shape, persist via memory store.
- **Acceptance:** A coach answer can be saved; it appears in Action Plans; steps check off and survive refresh.

### H-02 — Auto-create tracking prompts from the `observe` array · P0 · M
- **Intent:** Every coach answer returns an `observe` list. The data model defines `TrackingPrompt` (object #8) — **it is implemented nowhere.** This is the "track over time" loop the PRD promises and never closes.
- **Build:** On each answer, offer "Track these" → create tracking prompts from `observe[]` with a frequency (daily/weekly/event). Schedule a follow-up surface (see H-03).
- **Files:** new `TrackingPrompt` type wired to memory store; `App.tsx` coach render; `data-model-v1.md` object #8 as the schema.
- **Acceptance:** Selecting observe items creates persisted tracking prompts visible in the child timeline.

### H-03 — Close the loop: follow-up + `InterventionOutcome` capture · P0 · M
- **Intent:** Tracking is pointless if nothing ever asks "did it work?" Data model object #9 (`InterventionOutcome`) is also unbuilt.
- **Build:** N days after a saved plan, surface a check-in card: "Did the morning transition get easier?" → capture `worse/same/better/resolved` + one line. Feed the outcome back into the next coach prompt as context.
- **Files:** memory store (outcome event), `App.tsx` (check-in card), `routes/api.ts` chat prompt (inject recent outcomes alongside `getApprovedMemoryContext`).
- **Acceptance:** Saved plans generate a follow-up; outcomes persist and demonstrably appear in later coach context.

### H-04 — Render illustrated bedtime stories (the prompt already exists) · P0 · M
- **Intent:** `/api/generate-story` already returns `illustrationPrompt` for every story — **and nothing renders an image.** A free, high-"wow" feature is sitting unused.
- **Build:** Add an image route to the model router (new route `creative_image`) that takes `illustrationPrompt` → generates a page illustration. Render it in the story reader (`activeStoryPage`).
- **Files:** `ai/modelRouter.ts` (image route), `routes/api.ts` (`/api/generate-story` returns image refs or a follow-on `/api/generate-illustration`), `App.tsx` story reader.
- **Acceptance:** Generated stories show an illustration per page; degrade gracefully when no image model/key.
- **Note:** Keep child-facing imagery on the safest model route and run it through the same escalation screen already applied to story topics.

### H-05 — Surface `discussionQuestions` in the story reader · S · P1
- **Intent:** Stories already return `discussionQuestions`; they're under-surfaced. This is the parent–child connection payload — the actual developmental value of the story.
- **Build:** Show discussion questions on the final story page as "Talk about it together."
- **Files:** `App.tsx` story reader.
- **Acceptance:** Every generated story ends with its discussion questions presented as a parent prompt.

### H-06 — One-click: behavior analysis → action plan · S · P1
- **Intent:** `/api/analyze-behavior` already returns `actionPlanSuggestion`. The parent has to re-type it into the plan generator.
- **Build:** "Build a plan from this" button on the analysis result → prefill `planChallengeTopic` and call `/api/generate-plan`.
- **Files:** `App.tsx` (behavior analysis render → plan handler).
- **Acceptance:** From an analysis, one click produces a saved action plan.

### H-07 — Accumulate handoff notes instead of regenerating · M · P1
- **Intent:** *Every* coach answer already returns `handoffNotes.teacher` and `handoffNotes.professional`. The School Handoff Hub ignores them and regenerates from scratch via `/api/generate-handoff`.
- **Build:** Collect per-answer handoff notes into the child record; the Handoff Hub composes from accumulated real interactions + logs, not a cold regeneration.
- **Files:** memory store (handoff fragments), `App.tsx` handoff tab, optionally `routes/api.ts` to compose.
- **Acceptance:** Handoff brief reflects the actual logged history, not a one-shot guess.

### H-08 — Wire the existing GCS export to a button · S · P1
- **Intent:** `/api/export/handoff` is fully implemented (signed URL, 24h) with **no UI to call it.**
- **Build:** "Export / share" on a completed handoff → call the endpoint, show the download link; print stylesheet for a clean one-page PDF (the unused `Printer` icon is already imported).
- **Files:** `App.tsx` handoff tab; print CSS.
- **Acceptance:** A parent can export a handoff to a shareable file and print a clean page.

### H-09 — Make Scholar Lenses legible (show what each lens does) · S · P1
- **Intent:** The lens selector (`scholarsInfo`: Vygotsky/Bowlby/Piaget/Winnicott…) already changes the AI's reasoning frame, but parents don't know what they're choosing.
- **Build:** One-line plain-language description per lens + a "recommended for this concern" hint. Let the model suggest the lens (it already routes domains).
- **Files:** `App.tsx` lens selector, `initialData.ts` `scholarsInfo`.
- **Acceptance:** Each lens has a parent-readable purpose; a default lens is suggested per question.

### H-10 — Surface `frameRouting` (Six Frames) inline and meaningfully · M · P1
- **Intent:** The Six Frames is our most differentiated capability and renders as a footer list nobody reads (`renderCoachResponse`).
- **Build:** Pull the load-bearing frame to the top of the answer (e.g. when `twoAxes` says this is a structure problem, lead with it). Show the other frames behind a "go deeper" disclosure. (Pairs with capability ticket K-08 in the prior backlog.)
- **Files:** `contracts/coach.ts` `renderCoachResponse`, `App.tsx`.
- **Acceptance:** The decisive frame is the first thing the parent sees; full six are available on demand.

### H-11 — Show source grounding to the parent · S · P1
- **Intent:** `sourceCardsUsed` is captured and rendered as bare ids. Grounded answers build trust.
- **Build:** Resolve card ids → human titles; render "This rests on: …" with the knowledge cards actually used.
- **Files:** `knowledge/wiki.ts` (id→title), `contracts/coach.ts` render, `App.tsx`.
- **Acceptance:** Parents see named, real sources under guidance.

### H-12 — Add the feedback control the success metric requires · S · P0
- **Intent:** PRD §10 success = "70% rated useful today." There is **no rating UI.** We cannot measure our own exit criterion.
- **Build:** "Useful today? yes / partly / no" + optional one line, per coach answer, persisted with the response and lens.
- **Files:** `App.tsx`, memory store (feedback event).
- **Acceptance:** Every answer is ratable; ratings persist and are queryable for the 70% metric.

---

# PART B — EXPAND: new capabilities ranked by popularity potential

Scored 1–5 on **Demand** (how often parents search/struggle), **Fit** (sits inside our existing engine), **Safety** (low = risky), **Cost** (build effort). Build the top of the list first.

| Rank | Capability | Demand | Fit | Safety | Cost | Verdict |
|---|---|---|---|---|---|---|
| 1 | Panic-button live co-regulation mode | 5 | 5 | 4 | S | **Do now** |
| 2 | Voice in / read-aloud out (TTS + STT) | 5 | 5 | 5 | M | **Do now** |
| 3 | Sleep & bedtime coach module | 5 | 5 | 4 | M | **Do now** |
| 4 | Co-parent / caregiver shared mode | 4 | 5 | 4 | M | High value |
| 5 | Pediatric-visit prep pack | 4 | 5 | 5 | S | High value |
| 6 | Routine & responsibility ladder builder | 4 | 5 | 5 | M | Strong fit |
| 7 | Picky-eating & mealtime module | 4 | 4 | 3 | M | Strong |
| 8 | Toilet-training tracker | 4 | 4 | 4 | M | Strong |
| 9 | Photo/video observation logging (multimodal) | 4 | 4 | 2 | L | Bet — guardrails |
| 10 | Milestone memory book / keepsake | 3 | 4 | 5 | M | Retention hook |
| 11 | Screen-time negotiation kit | 4 | 4 | 4 | S | Quick win |
| 12 | Anonymous parent benchmarking | 3 | 3 | 3 | L | Later (needs scale) |

### E-01 — Panic-button live co-regulation mode · P0 · S
- **Intent:** The defining 11pm moment. One tap → an immediate, calm, read-aloud co-regulation script for *right now*, before any analysis. We already generate co-regulation scripts (`handleGetInlineCoRegulationScript`, Bowlby lens).
- **Build:** Persistent "I need help now" button. Opens a stripped, calm screen: 3-line script, slow breathing pacer, "log what happened" after. Runs the escalation screen first (`screenForImmediateEscalation`) and routes to crisis resources if matched.
- **Files:** `App.tsx` (global button + minimal modal), reuse co-regulation prompt, `safety/escalation.ts`.
- **Acceptance:** From anywhere, ≤2 taps to a calming script; escalation cases route to help instead.
- **Depends on:** real crisis resources (prior backlog K-03) — **do not ship the button until K-03 lands.**

### E-02 — Voice in, read-aloud out · P0 · M
- **Intent:** A parent holding a screaming child cannot type. Speak the worry; hear the script read back calmly. This is the highest-leverage accessibility + usability bet in the domain.
- **Build:** STT on the coach input; TTS on `parentScript`, story pages, and panic-mode scripts. Browser Web Speech API first; upgrade to a cloud voice later.
- **Files:** `App.tsx` coach + story + panic mode; small audio service.
- **Acceptance:** Parent can ask by voice and have the script/story read aloud; works hands-free.

### E-03 — Sleep & bedtime coach module · P0 · M
- **Intent:** Sleep is the single most-searched parenting problem 0–6. We have every primitive: profile, logs, plans, stories, age bands.
- **Build:** A focused flow — capture bedtime routine + night wakings (specialized log type), generate an age-banded sleep plan (reuse `/api/generate-plan` with a sleep system prompt), pair with a calming bedtime story (existing). Track nights → outcome (H-03 loop).
- **Files:** `App.tsx` new module; `framework.json` independence/attachment domains already cover it; reuse plan + story routes.
- **Acceptance:** A parent gets a personalized, trackable sleep plan + nightly story in one flow.

### E-04 — Co-parent / caregiver shared mode · P1 · M
- **Intent:** The Six Frames literally names "Marriage" (caregiver alignment) — the highest-leverage intervention in a child's life. We have Firebase auth + family/child documents (`ensureFamilyChild`).
- **Build:** Invite a second caregiver to the family; shared read of approved memory, plans, and a "consistent rules" card so both adults respond the same way. Respect consent records (data model #11).
- **Files:** `routes/api.ts` onboarding/family, `AuthContext.tsx`, `App.tsx` sharing UI.
- **Acceptance:** Two caregivers see one aligned child record and the same agreed scripts.

### E-05 — Pediatric-visit prep pack · P1 · S
- **Intent:** Parents forget what to ask the doctor. We already turn logs into professional notes (`/api/generate-handoff`, `current_questions` in data model).
- **Build:** "Prep for a doctor visit" → compiles recent logs, patterns, and the open questions into a printable one-pager with the `pediatrician` audience already supported.
- **Files:** reuse `/api/generate-handoff` (audience=pediatrician), `App.tsx`, print CSS (H-08).
- **Acceptance:** One tap produces a dated, printable visit-prep sheet.

### E-06 — Routine & responsibility ladder builder · P1 · M
- **Intent:** Order before chaos; competence before dependence. Age-appropriate chores/routines build the child's agency — squarely in our philosophical core and the `independence_adaptive_skills` domain.
- **Build:** Pick an age band → generate a "responsibility ladder" (what this child can own now, next, later) + a visual routine card. Track adherence.
- **Files:** new route or reuse `/api/generate-plan` with a routine schema; `framework.json` age bands already specify the core task per band.
- **Acceptance:** Parent gets an age-true responsibility/routine plan they can post on the fridge.

### E-07 — Picky-eating & mealtime module · P2 · M
- **Intent:** Top-five recurring stressor. Sits in independence + sensory domains.
- **Build:** Specialized log (foods offered/accepted, mealtime conflict), non-diagnostic guidance, exposure-ladder plan. Watch the sensory/medical boundary already encoded in `framework.json`.
- **Acceptance:** A trackable, non-coercive mealtime plan; flags persistent concern to professional advice.

### E-08 — Toilet-training tracker · P2 · M
- **Intent:** High-demand, time-boxed, naturally trackable.
- **Build:** Readiness check by age band, a staged plan, simple daily tracking with the outcome loop (H-03).
- **Acceptance:** Readiness-gated plan + streak tracking + escalation for medical signs.

### E-09 — Photo/video observation logging (multimodal) · P2 · L · BET
- **Intent:** Capabilities doc lists multimodal/video analytics. Parents want to capture "is this worth noting" (a motor pattern, a play behavior). **High demand, lowest safety score — handle with care.**
- **Build:** Attach a photo/clip to a behavior log; model produces *observations only*, never assessment, hard-gated by the non-diagnostic contract + escalation screen, never stored without explicit consent + retention policy.
- **Files:** multimodal route in `modelRouter.ts`, storage with consent, `safety/escalation.ts`.
- **Acceptance:** Media attaches to a log and yields observation language only; consent + retention enforced; any red flag routes to a professional. **Requires legal/AVG review before build.**

### E-10 — Milestone memory book / keepsake · P2 · M
- **Intent:** Emotional retention hook — the reason a parent keeps the app for years (the real moat is *time in the record*). We already track milestones, logs, stories.
- **Build:** Auto-compile a warm, printable "year in your child's development" from milestones hit, wins logged, and favorite stories.
- **Acceptance:** A shareable keepsake artifact generated from real logged history.

### E-11 — Screen-time negotiation kit · P2 · S
- **Intent:** Universal flashpoint; we already auto-fill a screen-time scenario in `autofillLogTemplate`.
- **Build:** Ready scripts + a family screen-time agreement template + transition rituals, by age band.
- **Acceptance:** Parent gets age-true scripts and a simple agreement they can adopt today.

---

# PART C — Recommended build order

**Sprint 1 — Harvest + the two unmissable bets.**
H-12 (feedback) · H-01 (save plans) · H-02 (tracking) · H-03 (outcome loop) · H-10 (surface Six Frames) · E-01 (panic mode, after crisis resources) · E-02 (voice).
*Theme: make every coach answer persist, track, and close — and give the parent the 11pm button.*

**Sprint 2 — The flagship module + grounding.**
E-03 (sleep coach) · H-04 (illustrated stories) · H-05/H-06/H-07 (story questions, analysis→plan, accumulated handoff) · H-08 (export) · H-11 (source grounding).
*Theme: one deep, beloved use case (sleep) + the polish that makes the engine feel substantial.*

**Sprint 3 — Alignment + reach.**
E-04 (co-parent) · E-05 (visit prep) · E-06 (responsibility ladder) · H-09 (lens legibility).
*Theme: align the adults and reach the professionals.*

**Later / gated:** E-07, E-08, E-09 (legal review), E-10, E-11.

---

## The principle holding this together

We are not short of capability — we are short of *delivery*. The engine already produces a plan, a script, observations, frames, handoff notes, and memory proposals on every single answer, and the product currently lets almost all of it fall on the floor. **Pick it up first.** Then add the two things a parent in a hard moment actually needs and we strangely don't yet have: a button to press right now, and the ability to use the thing without their hands.

Build narrow, make it real, tell the truth about what it is.
