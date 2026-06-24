# GATED CLEARANCES — Clinical Advisory Board

**Board lead:** arbor-clinical-lead · **Date:** 2026-06-23
**Lenses run:** arbor-clinical-psych (AP-049s3, AP-051, AP-053, AP-056, AP-057, AP-058) · arbor-clinical-slp (AP-054) · arbor-clinical-peds (AP-060)
**Scope:** Clear the CLINICAL gates on the Redesign Reconciliation gated items so they can become build-ready. Review/advisory only — no code, no build.
**Binding firewall (CHARTER §3 p11 / advisory.md §0):** internal reviewers are NEVER "licensed clinicians" / "clinically validated" / "clinician-reviewed" / "Expert-Reviewed"; no diagnostic, screening, or effect-size/outcome claims; non-pathologizing, parent-mediated (not kid-companion) framing.

**What this document clears:** the CLINICAL soundness/framing gate only. It does NOT clear the separate **arbor-safety COPPA/GDPR** gate that co-holds AP-049 (Step 4 avatar), AP-056 (export), and AP-057 (child-day input). Those remain open and route through arbor-safety. **Every cleared item still needs Guy's individual Tier-C sign-off** (claim / child-data) before build-ready — none auto-promote.

---

## 1. Per-item verdict table

| AP- | Item | Clinical verdict | Veto? | Claims | Still blocked by (besides Guy) |
|-----|------|------------------|-------|--------|--------------------------------|
| AP-049 (Step 3) | Onboarding focus-domain picker | **CLEARED-WITH-COPY** | no | none | arbor-safety (Step 4 avatar COPPA — separate gate, not clinical) |
| AP-051 | Day Windows panel | **CLEARED-WITH-COPY** | no | none | — (clinical clears it; Guy confirm) |
| AP-053 | Dev Copilot "here's why" | **CLEARED-WITH-COPY** | no | none | — (clinical clears it; Guy confirm) |
| AP-054 | Language Lab balance/% | **CLEARED-WITH-COPY** | no | none | — (clinical clears it; Guy confirm) |
| AP-056 | School Handoff Brief | **CLEARED-WITH-COPY** | no | none | arbor-safety (child data in export — separate gate) |
| AP-057 | Bedtime Stories | **CLEARED-WITH-COPY** (clinical framing only) | no | none | **arbor-safety (COPPA on child-day input — OPEN, must clear before build-ready)** |
| AP-058 | Smart Reminders dashboard | **CLEARED-WITH-COPY** | no | none | — (clinical clears it; Guy confirm) |
| AP-060 | "The Science" page | **CLEARED-WITH-COPY** | no | substantiated (provenance only) | legal/IP check on ASQ-3 deep-link (residual, route to safety/legal) |

**No VETOs. No hard-blocks.** All eight are clearable as conceived, contingent on the exact copy/framing below being adopted verbatim. Soundness across the set: **pass-with-required-fixes**. No item carries an unsubstantiated developmental, diagnostic, or effect-size claim once the copy below is used.

```
soundness: concerns → CLEARED once required copy adopted (no VETO)
claims: AP-049/051/053/054/056/057/058 = none · AP-060 = substantiated (provenance/source-count only, no effect-size)
riskClass: all 8 remain Tier-C gated (child-data and/or claim surface) → Guy individual sign-off required
required_fixes: the exact copy in §2–§3 below, adopted verbatim
cited_basis: [CDC LTSAE 2022 · AAP positive/strengths-based + non-labeling · ASHA bilingual service delivery (total/conceptual vocab) · Siegel & Bryson + Gottman as named framework influence, public guidance — grounding, not endorsement]
```

---

## 2. Exact approved copy — the four copy items

### AP-049 Step 3 — Focus-domain picker (CLEARED-WITH-COPY)

Risk cleared: a 7-tile picker at first-run reading as "pick what's wrong with your child." Reframed to a parent-priority/interest choice. **No tile may show a score, status, "low/high," "needs work," or red/warning styling.**

- **Step headline:** `Where would you like to start?`
- **Subhead:** `Pick the areas you'd like Arbor to focus on first. Every child grows on their own timeline — this just tells Arbor what matters most to you right now. You can change it anytime.`
- **Multi-select hint:** `Choose as many as you like.`
- **Skip label:** `Not sure yet? Skip — Arbor will keep all areas in view.`
- **Per-tile pattern** (domain name + warm capability one-liner, never deficit), e.g.: `Big Feelings — noticing, naming, and riding out strong emotions together.`
- **Footer reassurance:** `Arbor never grades your child. This is about your focus, not a test.`

### AP-051 Day Windows (CLEARED-WITH-COPY)

Risk cleared: the word **"prediction/predicted" must not reach the parent.** Everything is observed tendency from the log; difficulty is located in the *time/context*, never as a child trait.

- **Panel title:** `Your Day at a Glance`
- **Subhead:** `Patterns Arbor has noticed from what you've logged — calmer stretches and the trickier ones.`
- **Window labels:** `Usually calmer` / `Often trickier`
- **Pattern string pattern:** `Mornings before preschool have been harder 5 of the last 7 days you logged.` (always anchor the denominator to "the days you logged")
- **Determinism guard (always visible near chart):** `These are tendencies, not predictions — every day is different, and you know your child best.`
- **Low-data state (<7 days):** `Keep logging and these patterns get clearer. Right now there's not quite enough to see a rhythm yet.`
- **Builder hard rules:** no string may contain "will be," "predicts," "expect [child] to," or a confidence %. No clinical/diagnostic terms ("dysregulated," "behavioral episode") — use "harder moment / trickier stretch."

### AP-053 Dev Copilot "here's why" (CLEARED-WITH-COPY)

Sharpest item: foregrounding the **lowest-scoring** domain is exactly where a sound signal flips to implied-deficit. Reframed to "least-explored / good place to explore next" — about parent engagement and Arbor's knowledge, not child performance.

- **Section header:** `A good place to explore next`
- **Recommendation line:** `Arbor suggests starting with [Domain] — here's a gentle place to put your energy this week.`
- **"Here's why" expansion (load-bearing):** `This is simply an area you've logged less about so far, so Arbor has the least to go on here. Spending a little time here helps Arbor understand your child better — it's not a sign anything is wrong.`
- **Course roll-up:** `Courses to explore for [Domain]`, progress as `[X] of [Y] explored` (NOT "% complete" against the child)
- **Builder hard rules:** never render the domain set as a ranked deficit list; no red/alert styling on the recommended domain; never the words "low," "weak," "behind," "delay," "concern."

### AP-054 Language Lab (CLEARED-WITH-COPY)

Risk cleared: a balance-% read as "one language is behind." Per ASHA + Core et al. (2013), a single-language count *underestimates* a bilingual child's knowledge — **total/combined vocabulary is the meaningful number; the split must be secondary, neutral context.** There is no clinically correct ratio.

- **Lead the view with combined total**; present the mix as secondary.
- **Mix label (NOT "balance"/"imbalance"/"gap"):** `Logged mix: Hebrew / English`
- **Value line:** `62% of the words you've logged so far are in Hebrew, 38% in English.`
- **Interpretation caption (adjacent, required):** `This shows the mix of what you've logged — not how much your child knows in each language. Children who hear two languages almost always log unevenly, and that's expected.`
- **Provenance line (required, visible):** `Based only on the phrases you've logged. Arbor doesn't listen to or score your child's speech — these are your observations, not a test or a measurement of your child's vocabulary.`
- **Activities section title (NOT "balanced activities"):** `Ideas for both languages`
- **Activity item pattern:** `Want more Hebrew moments this week? Try shared story-time in Hebrew.` (optional enrichment, never "catch up")
- **Activity sub-line (required):** `These are ideas, not instructions. There's no right ratio between a child's languages.`
- **First-view disclaimer (required, re-accessible):** `A child's two languages almost never grow at the same rate, and one is usually stronger than the other. That's a normal feature of bilingual development, not a delay. What matters most is your child's total vocabulary across both languages combined — not how the two compare. If you ever have concerns about your child's language development, a speech-language pathologist who works with bilingual children is the right person to ask.`
- **Builder hard rules:** no red/amber on the lower-count language; trend lines may show per-language growth but must never characterize one as "falling behind"; never a readiness score/percentile/verdict.

---

## 3. AP-060 "The Science" page — firewall-safe copy + stats rules

### 3a. Mandatory verbatim replacements (firewall fix)

- **Hero card** — DELETE `Expert-Reviewed by our clinical board`. REPLACE with:
  `Developmentally informed — built on cited public guidance from the CDC, AAP, ASHA, and WHO.`
  (space-constrained variant: `Developmentally informed. Grounded in public CDC/AAP/ASHA guidance.`)
- **Board-composition line** — REPLACE any "clinical board" / credential framing with:
  `Reviewed by Arbor's internal developmental reviewers (backgrounds spanning child psychology, speech-language, and developmental pediatrics). They are not licensed clinicians and Arbor is not clinically validated; their role is to keep our content faithful to cited public guidance.`
- **The word "clinical" may NOT modify "board," "review," "validation," or "approval" anywhere on the page.** "Developmental reviewers" is the only permitted internal-role label.

### 3b. Framework-stats / source-count framing — ALLOWED vs BANNED

**ALLOWED (provenance / mechanism — descriptive, falsifiable, about Arbor's own content):**
- `133 milestones across 7 developmental domains` (count of Arbor's own content / scope)
- `Built on 40+ cited public sources` (provenance count)
- `Grounded in / built on / aligned to CDC guidance` (mechanism statement about sourcing)
- `Our milestones map to the CDC's "Learn the Signs. Act Early." framework`

**BANNED (endorsement, evidence-grade, or quality-badge framing):**
- `CDC-recommended` / `CDC-validated` / `CDC-endorsed` / `CDC-approved` / `in partnership with the CDC` / `AAP-endorsed` — no public body has reviewed or endorsed Arbor. "Grounded in CDC" describes sourcing; "CDC-recommended" asserts their endorsement — that is the trap.
- Source count as an **evidence grade**: `40+ peer-reviewed sources`, `40+ clinically validated sources`, `evidence-based` as a standalone medal, `most rigorously sourced`. A count is provenance, not a grade.
- `7 domains` dressed as a proprietary instrument (`Arbor's 7-domain assessment`) — it is a content taxonomy, not a validated subscale.
- Any outcome/effect-size drift (`improves development`, `X% faster milestones`) — keep OFF this page; triggers a new claim-register row + fresh veto pass.

### 3c. Named-framework hedges (peds lens)

- **CDC LTSAE** — cite the **2022 revision**. Milestone copy must use "**most children**" language (the 2022 ~75% placement principle), NOT "by [age]". LTSAE covers **2 months–5 years** — do not imply CDC coverage for ages 6–12.
- **ASQ-3** — highest-risk name. It is a copyrighted, professional-scored *screening tool* (Brookes). Arbor must NOT imply it administers/scores/replicates it. Permitted only as influence: `informed by the structure of validated screening tools such as the ASQ-3, which professionals use.` BANNED: `Arbor's ASQ-3 screening`, `take the ASQ-3 in Arbor`, `ASQ-3-based score`. If it can't be cited without implying administration, drop the name.
- **Siegel & Bryson** / **Gottman** — defensible as named parenting/emotion-coaching framework *influences* (`content informed by`), NOT a clinical-validation source. Scope Gottman to the behavior/emotion-coaching surface (its evidence base is not a child milestone instrument).

### 3d. Approved disclaimer (verbatim, above the fold)

`Arbor is not a diagnostic tool and does not replace professional care. It tracks development and surfaces things worth discussing — it does not diagnose, screen, or label your child. Milestones describe what most children do at a given age; every child develops on their own timeline. If you have a concern, or if Arbor flags one, talk to your pediatrician or a qualified professional.`

---

## 4. Still needs Guy (Tier-C) vs board-cleared outright

**The board CLEARS the clinical/firewall gate on all eight** once the copy above is adopted verbatim. None can be marked build-ready without the remaining sign-offs below.

| AP- | Clinical gate | Other open gate | Guy Tier-C sign-off |
|-----|---------------|------------------|---------------------|
| AP-049 | CLEARED (copy) | **arbor-safety — Step 4 avatar COPPA/GDPR (OPEN)** | **Required** (child-data) |
| AP-051 | CLEARED (copy) | none | **Required** (child-data read) |
| AP-053 | CLEARED (copy) | none | **Required** (developmental-read surface) |
| AP-054 | CLEARED (copy) | none | **Required** (child-data read) |
| AP-056 | CLEARED (copy) | **arbor-safety — child data in export (OPEN)** | **Required** (child-data export) |
| AP-057 | CLEARED (framing) | **arbor-safety — COPPA on child-day input (OPEN, hard)** | **Required** (child-data input) |
| AP-058 | CLEARED (copy) | none | **Required** (nudge/JITAI settings) |
| AP-060 | CLEARED (copy) | legal/IP — confirm ASQ-3 deep-link doesn't reproduce copyrighted items (residual) | **Required** (claim surface) |

**Board-cleared outright (clinical gate fully lifted, no other gate open — only Guy's confirm remains):** AP-051, AP-053, AP-054, AP-058.

**Cleared by board but a SECOND gate (arbor-safety/legal) is still OPEN — cannot reach build-ready until that clears too:** AP-049, AP-056, **AP-057** (COPPA input is a hard gate), AP-060 (ASQ-3 IP check).

**Route any unresolved safety gate (AP-049/056/057) through arbor-orchestrator → arbor-safety,** identical to a safety veto, before those three are build-ready.

---

**Memory note:** 2026-06-23 — Clinical Board cleared all 8 redesign gated items (AP-049s3/051/053/054/056/057/058/060) as CLEARED-WITH-COPY; no VETO. Exact copy filed in GATED-CLEARANCES-CLINICAL.md. AP-060 firewall fix: "Expert-Reviewed by our clinical board" → "Developmentally informed — built on cited public guidance from CDC/AAP/ASHA/WHO." Remaining blockers: arbor-safety COPPA on AP-049/056/057, ASQ-3 IP check on AP-060, + Guy Tier-C on all 8.
