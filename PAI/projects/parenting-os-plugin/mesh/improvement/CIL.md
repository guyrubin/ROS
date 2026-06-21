# Arbor Continuous Improvement Loop (CIL)

**Version:** 1.0
**Created:** 2026-06-21
**Owner:** PAI (product) + ROS CoS (portfolio)
**Status:** Scaffolded — the sanctioned **autonomous** opt-in reserved by [CHARTER.md](../CHARTER.md) §3.6.

The CIL is the **evaluation half** of the Arbor Agent Mesh. The mesh already had the build half (Orchestrator → pods → green-gate); the CIL adds the part that **autonomously discovers what to build**: a panel of critic agents inspects the live app, scores and verifies findings into a backlog, the Orchestrator builds the top items to green on a branch, and the critics **re-check that the fix actually landed**. It runs on a clock so Arbor improves itself continuously.

---

## 1. The loop

```
   ┌────────────────────────────────────────────────────────────────────────┐
   │                                                                          │
   ▼                                                                          │
 EVALUATE ──► TRIAGE+SCORE ──► VERIFY ──► PRIORITIZE ──► BUILD ──► GATE ──► CONFIRM
 critic       dedupe +         adversarial   top-N by    pods,     DevSec   re-run the
 panel        score each       fact-check    score,      worktree, gate     critic on the
 (parallel)   finding          (drop the     conflict-   green                changed surface
                               hallucinated) map safe                          (regression guard)
                                                                          │
                                                              human approves merge+deploy
```

- **EVALUATE** — the [critic panel](CRITICS.md) runs in parallel, each lens grading the app against its rubric.
- **TRIAGE + SCORE** — dedupe across critics; score each finding `(severity × userImpact × confidence) ÷ effort` (see [CRITICS.md](CRITICS.md)).
- **VERIFY** — adversarially fact-check each candidate; a finding that can't be reproduced/substantiated is dropped. The loop never builds on a hallucination.
- **SYNTHESIZE** — the evaluator's editor pass (the "smart" step): roll symptoms into **themes**, fuse capability × market × feedback into **SMART feature theses**, **re-weight by real usage** (feedback weight map), and write a 4–6 line "State of the app" narrative. See [CRITICS.md](CRITICS.md) §6.
- **PRIORITIZE** — take the top verified `riskClass: safe` items + the top themes/thesis within the conflict-map budget.
- **BUILD → GATE** — the Orchestrator dispatches the owning pods in the `.arbor-build` worktree; the standard green-gate applies. Nothing merges automatically.
- **CONFIRM** — re-run the relevant critic on the changed surface to prove the finding is resolved (and nothing regressed). This is what makes it *improvement*, not just churn.

## 2. Autonomy model (set by Guy, 2026-06-21)

**Find + fix to green on a branch → human approves the release.**

| Stage | Autonomous? |
| :-- | :-- |
| Evaluate · score · verify · write backlog | ✅ Fully autonomous |
| Build top `safe` items to green on a branch | ✅ Autonomous (isolated worktree, no merge) |
| Re-confirm the fix | ✅ Autonomous |
| **Merge to `main` + deploy to prod** | 🔒 **Human approves** (Level 3) |
| **Any `gated` change class** (below) | 🔒 **Stops + asks Guy** |

**Hard-gated change classes — the loop never auto-builds these, it only files them as `riskClass: gated`:** child-safety / output screening · consent / COPPA / GDPR · billing / entitlements / paywall · anything that raises **image-gen or model cost** · child-data schema/migration · store submission. These mirror the CHARTER §4 Level 3–5 gates and the `arbor-safety` / `arbor-sec` vetoes.

## 3. Cadence (set by Guy, 2026-06-21)

| Loop | Cadence | Does | Mode |
| :-- | :-- | :-- | :-- |
| **Nightly eval** | Daily (off-peak) | Critic panel → score → verify → update [IMPROVEMENT-BACKLOG.md](IMPROVEMENT-BACKLOG.md). Catches regressions fast; keeps the scored backlog fresh. | `mode: "eval"` |
| **Weekly build wave** | Weekly | Re-eval light, then build the top verified `safe` items to green on `claude/cil-<week>`, re-confirm, and open the approve-to-ship roll-up. | `mode: "build"` |

Both are registered in [/00_System/agent-framework/SCHEDULED-LOOPS.md](../../../../00_System/agent-framework/SCHEDULED-LOOPS.md) and are **not live until Guy confirms** the cron. Until then the loop runs on-demand via the workflow.

## 3.1 Smart & efficient by design

The loop must be *both* — deep insight without burning tokens. How:

- **Diff-aware nightly, deep weekly.** The nightly `eval` runs only the cheap/fast lenses (bugs, language/i18n, feedback) and scopes them to **what changed since the last cycle** (git diff + the touched surfaces) plus **one rotating deep lens** per night (IA → UX → capability → market, round-robin). The weekly `build` cycle runs the **full panel deep**. So a regression is caught within a day, but the expensive design/strategy passes run once a week, not nightly.
- **Effort/model tiers.** Mechanical lenses (bugs, i18n scan, link/route check) run at low reasoning effort; design, capability, market, and the synthesis pass run at high effort. The workflow sets `effort` per agent so spend tracks value.
- **Cache & dedupe.** Screenshots and competitor research are cached per surface/cycle; the evaluator dedupes across lenses and **caps the queue** (top ~10 `safe` + top 3 themes + 1 feature thesis) so the build wave stays focused and the human reads insight, not noise.
- **Themes over nits.** Fixing one root cause (e.g. "introduce a type scale") clears a dozen symptom findings — cheaper to build, bigger effect than chasing each nit.
- **Stop early when clean.** If the verified-findings count is zero on a surface, the loop skips straight to the report — no build wave on a quiet week.

## 4. Roster (the eval half)

| ID | Role | Owns |
| :-- | :-- | :-- |
| `arbor-evaluator` | **Eval lead** | Conducts the critic panel, dedupes, finalizes scores, runs the adversarial verify, writes the scored backlog, re-confirms fixes. Eval-side sibling of `arbor-orchestrator`. |
| `arbor-critic-ia` | IA, flows & presentation | **Runs the app**: navigation coherence, orphan features, dead-ends, missing states, scannability/progressive-disclosure — "things not presented well." |
| `arbor-critic-ux` | Visual & interaction design | **Looks at rendered pixels** (screenshots; mobile+desktop; EN+HE/RTL) via `impeccable` + `design-critique` + `accessibility-review`: hierarchy, type/spacing/color, motion, touch targets, a11y, register fit. |
| `arbor-critic-language` | Language lens | Copy quality + voice (calm-parent / playful-kid), **Hebrew/RTL naturalness**, i18n completeness, no AI-stilted phrasing. |
| `arbor-critic-bugs` | Functional lens | Runs the app (preview + tests): failing tests, dead controls, console/network errors, broken flows. |
| `arbor-critic-capability` | SMART feature × market | Gaps vs Khan Kids / Lingokids / Duolingo ABC / Lovevery, **fused with cited market evidence** into SMART bets on the moat (dispatches `research-agent`). |
| `arbor-critic-market` | Market & funnel | Landing (rendered), activation, SEO/AEO, growth loop, positioning vs GTM — quantified. |
| `arbor-critic-feedback` | Feedback & analytics | Real user signal (reviews, support, Amplitude/Pendo, funnel drop-off) → findings **+ a weight map** that re-prioritizes the panel by observed user pain. |
| `arbor-safety` + `arbor-sre` + `arbor-sec` | Safety/cost/perf lens | Existing DevSecOps pods in **audit mode** — consent gaps, image-gen cost leaks, latency/perf budgets. (Not duplicated as a new critic.) |

The **build half** (`arbor-orchestrator` + the 10 domain pods + DevSecOps) is unchanged — see [ROSTER.md](../ROSTER.md).

## 5. How to run

- **One cycle, on-demand:** the workflow `/.claude/workflows/arbor-improve.workflow.js` with `args: { mode: "eval" }` (or `"build"`). This is the deterministic driver.
- **A single lens:** dispatch one critic subagent (e.g. `arbor-critic-language`) for a scoped audit.
- **Scheduled:** once Guy confirms, a cron fires the workflow nightly (`eval`) and weekly (`build`).

## 6. Operating principles (extends CHARTER §3)
1. **Evidence or it doesn't exist.** Every finding carries concrete proof; unverified findings are dropped, not built.
2. **Score, don't vibe.** Priority is the computed score, not recency or loudness.
3. **Confirm the cure.** A fix isn't done until the critic that found the problem agrees it's gone.
4. **Safety/cost/billing never auto-build.** Those are filed `gated` and wait for Guy.
5. **Human owns the ship.** The loop builds to green on a branch; merge + deploy is always Guy's call.
6. **Every cycle ends in memory** — [../MEMORY.md](../MEMORY.md) records the cycle: found / verified / built / confirmed / shipped.

## 7. Related
- [CRITICS.md](CRITICS.md) — the panel, the finding schema, the scoring formula, the verify protocol.
- [IMPROVEMENT-BACKLOG.md](IMPROVEMENT-BACKLOG.md) — the scored intake the loop maintains; the Orchestrator burns it down alongside [EXECUTION-BACKLOG.md](../../EXECUTION-BACKLOG.md).
- [CHARTER.md](../CHARTER.md) · [DEV-LOOP.md](../DEV-LOOP.md) · [ORCHESTRATOR.md](../ORCHESTRATOR.md) · [ROSTER.md](../ROSTER.md)
- Workflow: `/.claude/workflows/arbor-improve.workflow.js`
