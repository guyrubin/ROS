# Arbor Critic Panel — Spec, Scoring & Verify Protocol

**Version:** 1.1
The critic panel is the sensing layer of the [CIL](CIL.md). Each critic is one expert lens that inspects the live Arbor app + source and emits **scored findings** in the schema below. The `arbor-evaluator` dedupes, finalizes scores, adversarially verifies, and **synthesizes themes** before anything reaches the [IMPROVEMENT-BACKLOG](IMPROVEMENT-BACKLOG.md).

App under test: `PPPPtherapy-/PPPPtherapy-/app` · Prod: https://arborprd-westeu.web.app · run locally with the `arbor-dev` launch config or `npm run dev` from `app/`.

---

## 0. The bar — smart, not shallow

A finding is only worth filing if it would make a **senior practitioner in that lens** nod. Every critic must clear this bar or stay silent:

1. **See it, don't guess it.** Visual lenses (IA, UX) **run the app and look at the rendered screen** (preview screenshot/snapshot/inspect at mobile + desktop, EN + HE/RTL) — they do not infer UI quality from source. Bug/functional lenses **reproduce**. Strategy lenses (capability, market) **cite a real source**.
2. **Benchmark against world-class.** State the standard you're judging against (Khan Kids / Duolingo for kids' craft; Apple HIG / Linear / Things for calm parent surfaces; the named competitors for capability). A finding names the gap to that bar, not a personal preference.
3. **Root cause, not nits.** Prefer the systemic cause ("the app has no type scale, so every screen's hierarchy is muddy") over ten symptom-level nits. Symptom nits get rolled into the theme.
4. **Actionable + specific.** `suggestedFix` is a concrete change a pod can build, not "improve UX." For features, it is **SMART** (see §3 capability/market).
5. **Honest scoring.** confidence reflects real evidence strength; effort is an honest build estimate; no inflating severity to get attention.

The `arbor-evaluator` rejects findings that fail §0 in the verify step. **Efficiency:** quality over quantity — a tight set of high-signal, root-cause findings beats a long nit list (it also costs less to build and to read).

## 1. The finding schema (every critic emits an array of these)

```json
{
  "id": "CIL-<lens>-<shortslug>",
  "lens": "ia | language | bugs | capability | market | safety-cost",
  "title": "one-line problem statement",
  "surface": "where in the app (route/component/file)",
  "evidence": "concrete proof — file:line, test output, a quoted string, a screenshot observation, a competitor URL. NO vague claims.",
  "severity": 1,            // 1 trivial … 5 broken/blocking
  "userImpact": 1,          // 1 edge … 5 hits every user on a core flow
  "confidence": 0.0,        // 0..1 how sure the finding is real
  "effort": 1,              // 1 trivial fix … 5 large
  "ownerPod": "arbor-<pod>",
  "suggestedFix": "the concrete change",
  "riskClass": "safe | gated"  // gated = touches safety/consent/billing/cost/child-data
}
```

`riskClass: gated` ⇒ filed but **never auto-built** (CIL §2). Critics must mark anything touching child-safety, consent/COPPA/GDPR, billing/entitlements, image-gen/model cost, or child-data schema as `gated`.

## 2. Scoring (computed by `arbor-evaluator`, not by vibes)

```
score = round( (severity × userImpact × confidence) ÷ effort × 4 )
```

Higher = do sooner. The weekly build wave pulls the top `safe` items by score within the conflict-map budget. Ties broken by lower effort. The formula is RICE/WSJF-flavored: it rewards high-impact, high-confidence, low-effort fixes — exactly the "lots of small bugs" the loop should clear fast.

## 3. The lenses (rubrics)

Each critic measures against **the app's own bar** — the "iOS-level / fully integrated" definition in [EXECUTION-BACKLOG.md](../../EXECUTION-BACKLOG.md) §"THE GOAL".

### `arbor-critic-ia` — Information Architecture, flows & presentation
**Runs the app and navigates the real flows** (preview, mobile+desktop, EN+HE) — judges how information is *structured and presented*, not just what exists.
- **Presentation quality** (Guy's "things are not presented well"): is each screen scannable in 3 seconds? Right grouping, labels, ordering, **progressive disclosure** (most-important-first, not a wall)? Does the screen answer the user's one question for that surface?
- Orphan features / side-tabs that should live inside a flow (the charter's "integrated, not bolted-on"); dead-ends, broken back/▸ navigation, duplicate destinations, things that "miss the point" of the task.
- Missing **empty / loading / error** states on every async surface.
- Cross-screen **model coherence**: do the pillars (Today/Practice/Academy/Grow/Care/My-Child) form one mental model, or seven disconnected apps? Is the same concept named the same everywhere?
- Benchmark: Apple HIG / Linear / Things for calm parent IA. Inspect: `components/navigation.ts`, tabs/sections, every pillar — with screenshots as evidence.

### `arbor-critic-ux` — Visual & interaction design (craft)
**Looks at the rendered pixels** (preview screenshots at mobile+desktop, light/dark, EN+HE/RTL) and critiques like a senior product designer using the `impeccable` + `design:design-critique` + `design:accessibility-review` skills.
- **Visual hierarchy & craft:** type scale, spacing rhythm, alignment, color/contrast, density, consistent components — is there a real design system or 344 one-off hex literals (known debt)? Flag the systemic cause.
- **Register fit:** parent surfaces calm/premium/Apple-grade; child surfaces vivid/playful/character-driven (the hero everywhere). Flag mismatches and "AI-generic" blandness.
- **Interaction & motion:** touch-target size, hit states, transitions, loading skeletons, haptic-feeling feedback; delight where it earns it, calm where it matters.
- **Accessibility:** WCAG AA contrast, focus-visible, dynamic-type/RTL safety, screen-reader labels.
- Benchmark: Khan Kids / Lingokids / Duolingo (kid craft); Apple HIG / Headspace / Calm (parent calm). Evidence = a screenshot + the specific pixels. Owner pods usually `arbor-design` (+ the surface's pod).

### `arbor-critic-language` — Copy, Voice & Hebrew/RTL naturalness
- Stilted / AI-generated-sounding English; off-voice copy (should be calm, direct, humane, non-alarmist for parents).
- **Hebrew naturalness** read as a native speaker would — awkward MT phrasing, wrong register, RTL layout breakage.
- i18n completeness: untranslated strings, hard-coded English, missing `he` keys, `dir=rtl` issues.
- Inspect: i18n dictionaries, all user-facing strings, the marketing pages (EN+HE).

### `arbor-critic-bugs` — Functional & runtime
- **Actually run it** (preview tools + `npm run lint` + `npm test`): failing/flaky tests, tsc errors, dead buttons, console errors, failed network calls, broken generative flows.
- Reproduce before filing; attach the repro/evidence. confidence reflects reproducibility.
- Inspect: live app flows, test output, browser console/network.

### `arbor-critic-capability` — SMART feature analysis vs the market
Finds the feature gaps worth building — **fused with market evidence**, not vibes.
- Benchmark current Arbor vs Khan Kids / Lingokids / Duolingo ABC / Lovevery / Kinedu (dispatch `research-agent` for live, cited facts). For each gap: what they do, what Arbor lacks, and **why it matters on Arbor's longitudinal-memory moat** (don't recommend parity for parity's sake — recommend what compounds the moat).
- Every feature finding is **SMART**: **S**pecific (one capability), **M**easurable (the metric it should move — activation, D30 retention, referral), **A**chievable (honest effort + which pod), **R**elevant (ties to the moat + a real market signal/competitor proof), **T**ime-bound (which wave). A finding without a target metric is not done.
- Quantify where possible: market size/adoption signal, competitor pricing/positioning, the demand evidence. Cite every claim.

### `arbor-critic-market` — Marketing, funnel & positioning
- Landing/marketing pages (EN+HE) **rendered** (screenshot the funnel), activation flow, SEO/AEO coverage (sitemap, llms.txt, JSON-LD), the viral/growth loop, share surfaces.
- Conversion friction, missing/weak CTAs, positioning vs the GTM plan; quantify with funnel/analytics data when connected. Each finding names the funnel stage and the metric it should move.
- Coordinates with PAI's `arbor-marketing-lead`/`arbor-seo`/`arbor-acquisition`. Paid-spend ideas = `gated` (Level 4).

> **Fusion (capability × market):** these two lenses are joined by `arbor-evaluator` into **prioritized feature theses** — each a SMART bet backed by both a capability gap *and* a market/feedback signal. That synthesis (not the raw lists) is what reaches the backlog's feature section.

### `arbor-critic-feedback` — User feedback & analytics signal
Brings the *real world* into the loop and **re-weights everything else** by observed user pain.
- Sources (use whatever is connected; degrade gracefully — Arbor is pre-launch, so signal may be thin): App Store / Play reviews, support/inbox threads, **product analytics** (Amplitude/Pendo via MCP), session/funnel drop-off, Intercom, and any logged in-app feedback.
- Output two things: (1) findings *from* feedback (recurring complaint → scored finding), and (2) a **weight map** — which surfaces/features users actually touch and complain about — so the evaluator boosts findings on high-traffic/high-pain surfaces and discounts findings on dead ones.
- When there is little/no real feedback yet, say so honestly and lean on analytics + heuristic proxies rather than inventing user quotes.

### Safety/cost/perf — existing DevSecOps pods in audit mode
- `arbor-safety` (consent/redaction/COPPA gaps), `arbor-sec` (secrets/CVEs/auth), `arbor-sre` (image-gen **cost leaks**, latency/perf budgets). Findings here are almost always `riskClass: gated`.

## 4. Adversarial verify protocol (the gate before backlog)

`arbor-evaluator` takes each candidate finding and **tries to disprove it**:
- **Bugs** → reproduce it; if it can't be reproduced, drop or lower confidence.
- **IA/UX/Language** → confirm the surface/string actually exists as described (open the file/route); reject stale or misread findings.
- **Capability/Market** → confirm the competitor claim against a real source and that Arbor genuinely lacks it (not just hidden elsewhere).
- Re-check the `riskClass`: anything touching safety/consent/billing/cost is forced to `gated`.
- Output a verdict `{ verified: bool, reason, scoreAdjustment? }`. Only `verified` findings reach the backlog.

## 5. Output discipline
- No duplicates within a critic; the evaluator dedupes across critics (same surface+fix = merge, keep highest score).
- Every finding is independently actionable by its `ownerPod` (maps to [ROSTER.md](../ROSTER.md)).
- Findings are **observations, not edits** — critics never change product code; they report. The build half fixes.

## 6. Synthesis — the evaluator's editor pass (what makes the panel *smart*)
Raw findings are an input, not the output. After verify, `arbor-evaluator` does an **editor pass**:
1. **Roll symptoms into themes.** Ten muddy-hierarchy nits become one theme ("no type scale → systemic hierarchy debt") with the nits as sub-items. The theme gets the priority; fixing the cause clears the symptoms.
2. **Fuse capability × market × feedback into feature theses.** Each candidate feature is a SMART bet justified by a capability gap *and* a market/feedback signal — not one lens alone.
3. **Re-weight by real usage** using `arbor-critic-feedback`'s weight map: boost findings on high-traffic/high-pain surfaces, discount dead ones.
4. **Write a 4–6 line "State of the app"** at the top of each cycle in the backlog — the narrative (what's strong, the top 3 systemic problems, the one feature bet) — so a human reads insight, not a 60-row table.
5. **Cap the queue.** Surface the top ~10 `safe` items + the top 3 themes + the top feature thesis per cycle; park the long tail. Focus = smarter *and* cheaper to build.
