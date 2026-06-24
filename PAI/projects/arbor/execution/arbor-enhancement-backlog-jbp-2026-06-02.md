# Arbor — Deep Advisory Analysis & Enhancement Backlog

**Adviser:** Jordan Peterson (engaged advisory voice)
**Date:** 2026-06-02
**Reviewed surfaces:** `PPPPtherapy-/app` canonical React/Express build, `framework.json`, coach contract, safety escalation engine, memory ledger, API routes, plus ROS strategy docs (PRD v1, roadmap, data model, surface-coordination 2026-05-28).
**Scope:** Three levels — App (product/features), Capabilities (intelligence/safety/data), Design (look, voice, interaction).

---

## 0. The one-sentence read

Arbor has a genuinely serious spine — a non-diagnostic developmental contract, a safety triage layer, a parent-approved memory ledger, and a formation framework most parenting apps would never attempt — but the product has drifted from the calm, humble thing the strategy describes into a grandiose "cockpit," it serves exactly one hard-coded child, and the deepest part of it (the Six Frames) is buried at the bottom of a wall of text. **The bones are sound. The product is not yet telling the truth about what it is.**

---

## 1. First principles — what this product is for

A parent does not open this at noon when calm. They open it at 11pm, frightened, with a child who will not sleep, will not stop screaming, or has said something that scared them. The entire moral purpose of Arbor is to be the **calm, competent adult in the room** when the parent has run out of being one.

Measure every enhancement against that moment. Three questions:

1. Does it lower the parent's heart rate, or raise it?
2. Does it move responsibility *toward* the parent's competence, or create dependence on the app?
3. Would a serious child psychologist be comfortable standing behind it?

Most of what follows fails at least one of those today. That is the work.

---

## 2. Strategic contradictions found (the things that must be resolved before features)

These are not bugs. They are misalignments between what Arbor *says it is* and what it *does*. Fix these first, because every feature built on a contradiction inherits the contradiction.

| # | Contradiction | Evidence | Why it matters |
|---|---|---|---|
| C1 | **Design says "warm paper, Scandinavian field-notebook"; the app is a dark-gold cockpit.** | `surface-coordination-2026-05-28.md` mandates paper/ink/clay/Delft-blue. `App.tsx` ships `#08090c` near-black + gold `#d7aa55`. This is the exact FORMATION dark-gold aesthetic the doc explicitly forbids "unless deliberately rebranded." | The product has *already* rebranded itself by accident. You are shipping the look you told yourself not to. Decide on purpose. |
| C2 | **Moat is "longitudinal, multi-child memory"; the app has one hard-coded child ("Dylan, age 5").** | `defaultChildProfile`, JSX literals "Dylan", "Age 5", "Hebrew native" throughout `App.tsx`. No onboarding, no second child, no profile editor. | The single thing claimed as the moat does not exist as a usable surface. It is a demo dressed as a platform. |
| C3 | **Brand voice is "calm, humble, non-alarmist"; the copy is grandiose.** | "Parenting Intelligence Cockpit," "Not a parenting chatbot. A development intelligence operating system," "Longitudinal Insights Map," action plans are "woven." | Grandiosity is the enemy of trust with a frightened parent. Humility is a *feature*, not a tone preference. |
| C4 | **Success metric is "70% rated useful today" + "feedback on every answer"; there is no rating UI.** | PRD §10, roadmap §"feedback loop on every answer." No thumbs/rating control anywhere in `App.tsx`. | You cannot measure the one number that defines whether the product works. You are flying blind on your own exit criterion. |
| C5 | **Six Frames is the differentiated formation engine; it renders as a flat list at the bottom of the AI answer.** | `renderCoachResponse` dumps Aim/Two Axes/Story/Shadow/Marriage/Shepherd as bullet 8 of 10. | The most original, defensible idea in the product is the least visible thing in it. |

---

## 3. Level 1 — APP (product & features)

### P0 — Make it true (resolve contradictions, ship nothing else first)

| ID | Item | Outcome | Tied to |
|---|---|---|---|
| A-01 | **Real onboarding + child profile creation/edit.** Replace `defaultChildProfile` with a created profile: name, birth month/year → derived age band, languages, context, known supports. | The product can hold *a* child, not *the* demo child. | C2 |
| A-02 | **Multi-child family model in the UI.** Child switcher in the sidebar; memory, logs, milestones, plans all scoped to `childId` (the API already keys on it). | The moat becomes a usable surface, not a claim. | C2 |
| A-03 | **Feedback control on every AI answer.** "Useful today? yes / partly / no" + optional one-line why, persisted per response. | You can finally measure the 70% exit metric. | C4 |
| A-04 | **De-grandify all product copy.** Strip "cockpit," "operating system," "woven," "intelligence." Replace with plain, warm, parent-grade language. | The product stops over-promising. Trust rises. | C3 |

### P1 — Close the trust loop the PRD already promised

| ID | Item | Outcome |
|---|---|---|
| A-05 | **Persist everything.** Behavior logs, milestone checks, plans, stories currently live in React state and vanish on refresh. Wire to the memory store / Firestore. | The "longitudinal record" is real, not session-local theater. |
| A-06 | **Tracking prompts → follow-up loop.** The PRD's "Track over time" closes nowhere. After a plan, schedule a check-in ("3 days later: did the morning transition improve?") and capture `InterventionOutcome`. | The core loop (ask → act → track → learn) actually closes. |
| A-07 | **Intervention outcome capture.** Data model object #9 exists on paper, nowhere in code. Add "worse / same / better / resolved" after each plan. | Memory gains *outcomes*, which is what makes longitudinal guidance better than a one-shot chatbot. |
| A-08 | **Surface the formation frame inline, not as a footer.** When a frame is decisive (e.g. Two Axes: this is a structure problem, not a warmth problem), lead with it. | The differentiated capability becomes visible product value. (C5) |
| A-09 | **Print/export handoff to PDF.** `Printer` icon is imported and unused; GCS export exists but no parent-facing artifact. Generate a clean one-page note for the teacher/pediatrician. | The "professional handoff" promise becomes a thing a parent can hand over. |

### P2 — Earn the right to expand

| ID | Item | Outcome |
|---|---|---|
| A-10 | **Co-parent alignment surface.** The Six Frames already names "Marriage" (caregiver alignment). Add a shareable read-only child summary for the second caregiver. | Aligns the two adults — the highest-leverage intervention in a child's life. |
| A-11 | **Dutch + Hebrew localization (real, not just safety regex).** NL is the GTM wedge; the UI is English-only. | Removes the single biggest blocker to the Netherlands institutional story. |
| A-12 | **Weekly family review artifact.** Auto-compile the week: logs, what was tried, what worked, one thing to try next. | Converts daily noise into a calm weekly decision — the Karpathy "compile into knowledge" move. |

---

## 4. Level 2 — CAPABILITIES (intelligence, safety, data)

The intelligence layer is the strongest part of Arbor. It is also where the most dangerous gaps live, because they are invisible until they fail.

### P0 — Safety must stop being a regex

| ID | Item | Outcome |
|---|---|---|
| K-01 | **Add a semantic safety layer above the keyword screen.** `escalation.ts` is a regex match (EN/HE). It will miss paraphrase, indirection, and a parent's coded language. Add a lightweight model-based safety classifier as a second gate before any parent-facing output. | A child says they want to disappear without the word "suicide" — today that passes. That cannot stand. |
| K-02 | **Wire the high-risk human review queue to the UI.** `config.enableHighRiskReviewQueue` exists; nothing surfaces it. High/urgent outputs need a real human-in-the-loop path before the beta touches real families. | The "zero unsafe escalations missed" metric becomes operationally real, not aspirational. |
| K-03 | **Replace crisis-resource placeholders with real, localized contacts.** `escalation.ts` ships literal "Local resource placeholder" strings to a parent in crisis. | At the single highest-stakes moment, the product currently says nothing useful. This is the most urgent item in the entire backlog. |

### P1 — Make the memory a real moat, not a ledger

| ID | Item | Outcome |
|---|---|---|
| K-04 | **Enforce retention.** `retention` is a free-text string on every memory event, never acted on. Make it a typed policy (e.g. `session / 90d / until-revoked`) with actual expiry. | "Memory is the moat" only works if memory is *governed*. Otherwise it's a liability. |
| K-05 | **Right-to-be-forgotten: full child-data export + hard delete.** AVG/GDPR is the entire NL institutional pitch. There is no "delete this child and everything about them" path. | No municipality or insurer signs without this. It is a deal-gate, not a nicety. |
| K-06 | **Source-grounding visible to the parent.** `sourceCardsUsed` is captured but rendered as bare ids. Show *which* knowledge the guidance rests on. | Grounded answers build trust; ungrounded confidence destroys it. |
| K-07 | **Eval harness expansion.** `npm run eval:safety` exists; extend to: no-diagnosis, age-band fit, practicality, memory hygiene, handoff quality, and escalation recall. Run in CI. | Quality stops being vibes and becomes a gate. |

### P2 — Sharpen the formation engine

| ID | Item | Outcome |
|---|---|---|
| K-08 | **Make the Six Frames a routing decision, not decoration.** Today the model fills all six every time. Let it decide *which frame is load-bearing* for this concern and weight the answer accordingly. | The framework becomes diagnostic of the *parent's* situation, not boilerplate. |
| K-09 | **Pattern detection across logs.** The roadmap's Phase 5 "longitudinal pattern detection" — start small: flag when a trigger repeats or intensity trends up. | The product starts to *notice* before the parent does. That is the magic moment. |
| K-10 | **Confidence calibration on hypotheses.** `confidence` is a free string. Constrain to a scale and teach the model to stay humble when data is thin. | Honesty about uncertainty *is* the non-diagnostic stance, operationalized. |

---

## 5. Level 3 — DESIGN (look, voice, interaction)

### P0 — Resolve the identity (do this before any pixel work)

| ID | Item | Outcome |
|---|---|---|
| D-01 | **Decide the aesthetic, on purpose.** Either (a) commit to the documented warm-paper field-notebook and re-skin the app off dark-gold, or (b) formally adopt the dark cockpit as the new Arbor identity and update every strategy doc. **My recommendation: (a).** A frightened parent at night needs warm paper and a calm hand, not a black-and-gold trading terminal. The dark cockpit signals *surveillance and performance*; the paper signals *care and reflection*. The whole brand thesis is "calm senior advisor" — build the room that advisor sits in. | Ends the C1 drift. One Arbor, chosen deliberately. |
| D-02 | **Rewrite the voice top to bottom.** Replace cockpit/OS/intelligence language with plain, warm, literate copy. The hero should not boast; it should *settle* the parent. e.g. replace "Not a parenting chatbot. A development intelligence operating system." with something like "A calm place to think through what's happening with your child." | The product sounds like the adviser it claims to be. (C3) |

### P1 — Interaction integrity

| ID | Item | Outcome |
|---|---|---|
| D-03 | **Remove `select-none` from the app root.** The whole app blocks text selection (`App.tsx:640`). Parents need to *copy* the co-regulation scripts to send to a partner or read aloud. | A core use (copy the script) is currently blocked by a styling default. |
| D-04 | **Calm the motion.** Pulsing green "live" dots, animated banners, "engines" language. Crisis software should be still. Reduce ambient animation to near-zero. | Stillness lowers the parent's arousal. The interface should breathe slowly. |
| D-05 | **One clear primary action per screen.** The overview has competing CTAs (Ask Coach, View Plans, Open Book, three AI widgets). Establish hierarchy: in a hard moment, there is *one* thing to do. | Reduces decision load at exactly the moment the parent has none to spare. |
| D-06 | **Accessibility pass (WCAG AA).** Gold-on-near-black and gray-on-dark are likely failing contrast; touch targets, focus states, screen-reader labels unaudited. | A product for *all* parents — including exhausted, disabled, or low-vision ones — must meet the floor. |

### P2 — Polish that signals seriousness

| ID | Item | Outcome |
|---|---|---|
| D-07 | **Design tokens as a real system.** Extract paper/ink/clay/blue/sage, radii (2–6px), mono labels, serif accents into documented tokens consumed by the app. | One Arbor look, enforced, not redrawn each screen. |
| D-08 | **Empty states that teach.** First-run, no-logs, no-plans states should model *what good looks like*, not show zeros. | Onboarding becomes pedagogy: the product teaches the parent to observe. |
| D-09 | **Print/handoff stylesheet.** The exported note should look like something a professional respects — clean, dated, sourced, one page. | The handoff is Arbor's reputation in someone else's hands. Make it credible. |

---

## 6. Recommended sequencing (what I would actually do)

**Sprint 1 — Tell the truth (P0 across all levels).**
K-03 (real crisis resources) → D-01/D-02 (pick the aesthetic, rewrite voice) → A-01/A-02 (real + multi-child) → A-03 (feedback) → A-04 (de-grandify) → K-01 (semantic safety) → D-03 (unblock copy).

This sprint contains no new "magic." It is entirely about Arbor becoming what it already claims to be. **You cannot ethically run a beta with real families until K-03, K-01, and K-02 are done.**

**Sprint 2 — Close the loop.** A-05/A-06/A-07 (persist, track, outcomes) + K-04/K-05 (retention + delete) + D-04/D-05 (calm, focus).

**Sprint 3 — Sharpen the edge.** A-08 (surface frames) + K-08/K-09 (frame routing, pattern detection) + A-09/D-09 (handoff that earns respect).

---

## 7. The hardest truth

The most valuable thing in this codebase is the **Six Frames** — Aim, Two Axes, Story, Shadow, Marriage, Shepherd. That is a genuine articulation of what it means to raise a child well: orient toward an aim, balance warmth against structure, give the family a story to live inside, refuse to bypass the hard emotion, align the parents, and know which steward to hand the child to next. No competitor has anything like it.

And right now it is rendered as bullet point eight, in gold text, at the bottom of a screen no frightened parent will scroll to.

**Stop hiding the best thing you have made.** Build the product around that frame, give it a calm room to live in, make it safe enough to put in front of a real family, and tell the truth in the copy about what it is: not an operating system, not a cockpit — a calm, competent adult, available at 11pm, who helps a parent become the calm, competent adult their child needs.

That is the product. The backlog above is the distance between here and there.

---

*Next artifact suggested: a one-screen redesign of the Parent Coach view in the warm field-notebook system, with the Six Frames surfaced inline and a feedback control, as the reference implementation for Sprint 1 design.*
