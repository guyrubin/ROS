# Arbor Developmental Framework — Claude Design Brief (CI-20…CI-42 safe spine)

**Date:** 2026-06-23 · **Owners:** CoS (brief) · arbor-clinical-lead (gate) · arbor-design (system) · **For:** a Claude Design wireframe run that hands off to the proven build pipeline.

This is not a backlog dump. It is the brief that makes the design run produce one thing: **a buildable, board-clear "Arbor knows my kid" wedge**, visually continuous with the app we just shipped, with the clinical guardrail encoded so the design cannot drift into vetoed territory.

---

## 1. The one idea to design
> **"Arbor turns what you've logged about your child into the single best 15 minutes you can spend with them today."**

That is the moat made visible: a **Daily Plan** (CI-30) generated from the child's **Goals** (CI-28) running on a **Capability Graph** (CI-27), tuned by **Duration/energy** (CI-31) and **interest** (CI-29). Everything else in the safe spine is a node that feeds this loop. Design the loop, not a feature list.

## 2. Design system — REUSE, do not reinvent
The redesign shipped (AP-043…060, live on `main`). The CI work must look like it was always part of it:
- **Tokens:** the shipped `index.css` token layer + `lib/tokens.ts` (calm sage/teal + deep navy ink; accent themes Green/Teal/Blue). No new palette, no hardcoded hex.
- **Shell:** the live sidebar + topbar (search, notification bell, multi-kid chip). New surfaces mount *inside* this shell — they are not new chrome.
- **Register:** parent surfaces = calm, clinical-humanist, plain language. Child surfaces = playful (Kid Mode). Never mix.
- **RTL/i18n:** every string EN + HE, logical inset props only. The shipped app is RTL-correct; keep it.
- **States are mandatory:** every screen needs empty (<7 days logged — "sharpens as you log"), loading, and error. The empty state is the most important screen — most parents start there.

## 3. What to wireframe — vertical slices, in order
Design these as a **sequence of shippable slices**, each one whole on its own (mirrors how we shipped the redesign):

| Slice | Screens to design | The job |
|---|---|---|
| **S1 — Goal spine** (CI-28) | Parent-concern → goal flow; "Mia's goals" panel; goal detail | Turn a worry ("she melts down at drop-off") into a tracked goal wired to capabilities. **First vertical slice.** |
| **S2 — Daily Plan** (CI-30 + CI-31) | "Today's plan" hero card; the why-line; duration/energy chip row; activity run view | The daily touchpoint — one recommended 15-min activity + *why it was chosen*. The wedge. |
| **S3 — Capability Graph** (CI-27) | Domain overview; a domain's node list; a node's observable-signal view | The structural moat — the child's own longitudinal record, as a navigable graph. |
| **S4 — Content nodes** (CI-20, CI-21, CI-29, CI-32/33/34 safe-subset) | Numeracy track; School-Readiness Kit + export-brief layout; interest theme-picker; safe domain node lists | The library the plan draws from. |

For each screen, the handoff must define: the **empty state**, the **happy path**, and the **"why this" affordance** (the line that proves personalization). That affordance is the product.

## 4. The guardrail — encoded by colour, enforced by the board
Three buckets. The wireframe may only contain Buckets 1 and 2; Bucket 3 never enters design.

### ✅ Bucket 1 — design in full (safe spine, no developmental claim)
CI-20 Numeracy · CI-21 School-Readiness Kit/Export (reframed off any "ready/not-ready" verdict) · CI-27 Capability Graph + admin/seed tool · CI-28 Goal Builder · CI-29 Interest personalization · CI-30 Daily Plan Generator · CI-31 Duration/Energy variants · CI-32/33/34 domain **safe-subset nodes only**.

### ⚠️ Bucket 2 — shell only, watermarked "pending clinical sign-off"
CI-22 EF Observable-Competency track · CI-24 FeelingsLab personalized layer. Design the *container and flow*; leave the copy as placeholder. Hard limits in the shell: **no score, no condition name, no Zones 4-colour, no anxiety surface, no intensity chart.** The board supplies the literal strings at build.

### ⛔ Bucket 3 — never wireframe (vetoed / permanently held / claim-core)
CI-25 Neurodiversity observation lens · CI-23 coaching programs (efficacy-claim surface) · Adult Mediation Index (VETO) · Attention→"difficulty" (VETO, ADHD-adjacent) · Sensory/Emotion **Map** (VETO) · in-app M-CHAT · Risk Map · 0–4 numeric dev-score · AI Clinical Summary · branded-program clones (Triple P / Incredible Years / PCIT / Zones) · Clinician Portal (CEO 12-mo decision) · WHO-ICF mapping · any **feeding recommendation** (choking-risk VETO — feeding may only ever be a parent-logged exploration entry behind the swallow-safety interrupt, never a "what to feed" suggestion).

### The line that governs every screen
> Wireframe **structure, flow, and educational surfaces**. Never render a **claim, score, condition, risk, probability, or screener**. No effect-size verb on a child capacity (improves / builds / trains / strengthens / reduces) — **mechanism and observation only**. No branded program in copy *or* citations. Behaviour-noun, never condition-noun ("settling at drop-off," never "separation anxiety").

## 5. The loop after the handoff (how it ships)
Export the run as a `.dc.html` bundle into the repo → hand to CoS → **teardown → diff vs live → one no-regression backlog → green-branch build (F1–F18 floor gate) → your merge.** Identical to the pipeline that just shipped 18 redesign tickets. Bucket 3 stays parked behind the clinical gates + the store-launch lock; nothing in Bucket 3 reaches design or build via a "deploy all."

---

## 6. Paste-ready Claude Design kickoff prompt
> Design a parent-facing web feature set for **Arbor**, a calm, clinical-humanist child-development companion. Reuse Arbor's existing design language: soft sage/teal surfaces, deep-navy ink, generous rounded cards, a persistent left sidebar + top bar, full English + Hebrew/RTL, parent-calm register (plain, warm, never clinical-alarming).
>
> Design this loop as a connected flow, with empty / loading / populated states for each screen:
> 1. **Goal spine** — a parent turns a worry ("she melts down at drop-off") into a tracked goal; a "Mia's goals" panel; goal detail.
> 2. **Today's plan** — a hero card recommending one ~15-minute activity for today, with a visible "why we chose this" line tying it to the child's goals and progress; a duration/energy chip row (5/10/15 min · calm/active); an activity run view.
> 3. **Capability graph** — the child's developmental record as a navigable graph: domain overview → a domain's observable-skill nodes → a node detail showing logged observations over time.
> 4. **Content nodes** — a numeracy-readiness track, a school-readiness kit with a one-page summary-export layout, and an interest theme-picker that re-skins activities.
>
> Hard rules: **never** show a numeric developmental score, a risk level, a condition/diagnosis name, a screener (no M-CHAT), or any "ready / not-ready" verdict. Use observation and mechanism language only — never "improves/builds/trains" a child capacity. Progress = observed skills mastered, never a score. Frame a child's least-developed area as "a good place to explore next," never a deficit. Include two clearly-watermarked "pending clinical review" placeholder shells (an executive-function track and an emotion check-in) with no scores, no colour-zone system, no anxiety tracking.
>
> Goal: the parent should feel "Arbor actually knows my child," delivered as the single best 15 minutes today — warm, never clinical, never alarming.
