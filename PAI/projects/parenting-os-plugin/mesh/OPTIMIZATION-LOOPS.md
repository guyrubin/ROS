# Arbor — Multi-Agent Optimization Loop System

**Version:** 1.0 · **Created:** 2026-06-22 · **Owner:** PAI (product org)
**Mandate:** define the loops the product team runs to continuously optimize and evolve Arbor toward three north stars. Each loop has one owner, optimizes one measurable metric, and feeds **one backlog → one release train**. This is how the org *operates*, not a one-time plan.

---

## 0. The three north stars (the objective function)

The whole system optimizes these three, in tension, on purpose. A change that wins one while breaking another is down-weighted by the gates.

| # | North star (Guy's words) | What it means | The metric the loops move | Honesty rail |
| :- | :-- | :-- | :-- | :-- |
| **N1** | **Transform parenting & child development** | Build the parent's *competence*, not the app's grip. The record that knows the child is the moat. | **Competence + retention:** D30 retention · competence-ladder step-back rate (guidance fading = parent growing) · observations-per-child (record depth) | The advisor rubric — meaning over engagement; a streak/dark-pattern win doesn't count |
| **N2** | **Clinically the best offer in the market** | Deepest, soundest developmental intelligence — beats Kinedu/Lovevery/Khan on clinical authority, not features. | **Clinical authority score:** milestone/red-flag coverage vs CDC-2022/AAP/ASHA × soundness × **% claims substantiated** × benchmark-vs-competitors | The clinical board veto + the branding firewall — never "clinician-endorsed," never an unsubstantiated claim |
| **N3** | **Financially viral** | Viral *and* monetizing — a loop that grows AND converts. | **Viral-financial product:** K-factor (invite × convert) · free→paid conversion · LTV:CAC | K honesty (no blended K) · claims/child-data/paid-spend gated |

> A feature's `strategic_fit` in the Council score = how much it moves N1/N2/N3 net of the gates. That single number is what the multi-agent system is optimizing.

---

## 1. The loop system (one picture)

```
   SENSING / OPTIMIZING LOOPS                 PRIORITIZE            BUILD            SHIP
   (each owns one north star, runs on a clock)

   ┌───────────────────────────┐
   │ Product CIL      (N1)      │─┐   critic panel → findings
   │ Clinical Excellence (N2)   │ │   clinical gaps + substantiation
   │ Growth/Marketing  (N3 top) │ ├──►  PRODUCT       ──►  arbor-       ──►  RELEASE TRAIN
   │ Monetization     (N3 btm)  │ │     COUNCIL            orchestrator      (ros-release-lead,
   └───────────────────────────┘ │   (weekly: score,      (build wave       Theme O: incremental
                                  │    dedupe, clinical-    to green on        promote · claim-flag
   feature-requests, gaps,  ─────┘    gate → ONE backlog)   a branch)         gate · regression gate)
   competitor intel, usage                    │                                      │
        ▲                                      ▼                                      ▼
        └──────────────────  LEARN  ◄────  what shipped + its metric move  ◄──── prod (canary→100%)
```

Every loop ends by writing to shared state (`mesh/MEMORY.md` + the relevant backlog). The Council is the **meta-loop** that aims the build; the release train is the **delivery loop** that lands it safely. Nothing reaches prod except through the train.

---

## 2. The loops, defined

Each loop: **owner · cadence · senses · optimizes (the metric) · outputs · gate.**

### L1 — Product CIL (continuous improvement) — owns **N1**
- **Owner:** `arbor-evaluator` (eval) + `arbor-orchestrator` (build). **Cadence:** eval 2×/day, build 2×/wk. **LIVE.**
- **Senses:** the live app — bugs, IA/UX, language, capability gaps, feedback/analytics (the critic panel).
- **Optimizes:** N1 — product quality + the competence/retention mechanic. Fixes root-cause themes, not nits.
- **Outputs:** scored `IMPROVEMENT-BACKLOG.md` → Council. Builds top `safe` items to a green branch.
- **Gate:** advisor rubric (is the fix competence-building?) + DevSecOps green-gate.

### L2 — Clinical Excellence — owns **N2** *(NEW — formalize the board as a loop, not just a gate)*
- **Owner:** `arbor-clinical-lead` + peds/slp/psych. **Cadence:** weekly. **TO BUILD/REGISTER.**
- **Senses:** Arbor's developmental content + the market's clinical bar — milestone/red-flag coverage vs CDC-2022/AAP/ASHA, competitor clinical claims, the substantiation backlog.
- **Optimizes:** N2 — the clinical authority score. Two moves: (a) **proactively close clinical gaps** (the "what we should build to be the best" requirements) and (b) **substantiate held claims** so they can ship (the `CLINICAL-SIGNOFF` packet).
- **Outputs:** `clinical` requirements + a substantiation packet → Council; the binding claim gate on everything else.
- **Gate:** its own veto on soundness/claims; the firewall on branding.

### L3 — Growth / Marketing — owns **N3 (top of funnel)**
- **Owner:** `arbor-marketing-lead` + brand/content/seo/acquisition. **Cadence:** 2×/wk (Tue+Fri). **LIVE.**
- **Senses:** market + competitors, the funnel (awareness→activation→referral), the viral loop.
- **Optimizes:** N3-top — **K-factor** and organic reach. Publishes safe materials to owned surfaces.
- **Outputs:** published assets; competitor **feature-requests handed to the Council**.
- **Gate:** brand ECD essence+craft → `arbor-safety`; money/claims/child-data/store gated.

### L4 — Monetization — owns **N3 (bottom of funnel)** *(NEW — pair growth with revenue)*
- **Owner:** `arbor-billing` + `arbor-marketing-lead` (pricing). **Cadence:** weekly. **TO BUILD/REGISTER.**
- **Senses:** activation→paid funnel, pricing experiments, entitlement/quota friction, LTV/churn.
- **Optimizes:** N3-bottom — **free→paid conversion + LTV:CAC**, so "viral" is also "financial."
- **Outputs:** pricing/paywall/quota candidates → Council; the billing-rails readiness checklist.
- **Gate:** Level-4 (amounts) on any price change; billing rails confirmed live before conversion claims.

### L5 — Product Council (the meta-loop / prioritizer)
- **Owner:** `/arbor-product-council`. **Cadence:** weekly (Sun). **LIVE.**
- **Role:** fuse L1–L4 streams → **one scored `PRODUCT-BACKLOG.md`**, apply the clinical gate, flag top safe build-ready + surface gated. It does not build; it *aims* the build at the north stars.

### L6 — Release train (the delivery loop)
- **Owner:** `ros-release-lead` (DevSecOps under CoS). **Cadence:** per release. **TO BUILD (ROS-BACKLOG Theme O).**
- **Role:** turn green branches into prod **safely + incrementally** — backlog→staging→canary→prod, **claim/feature-flag gating**, regression-gated, branch-current-with-`main`. This is what makes "ship everything" safe instead of a blind push. CoS holds the Level-3 prod sign-off.

---

## 3. How they interlock (the operating rhythm)

1. **Sense (continuous):** L1–L4 each run on their clock, each optimizing their north-star metric, each writing findings/requirements to their backlog.
2. **Prioritize (weekly):** L5 Council fuses everything into one scored queue, clinical-gated, north-star-weighted.
3. **Build (2×/wk):** the Orchestrator builds top `safe` items to a green branch.
4. **Ship (per release):** L6 release train promotes incrementally — claim-gated, regression-gated — to prod.
5. **Learn:** each shipped item's **metric move** (did N1/N2/N3 actually move?) returns to the sensing loops and re-weights the next cycle. *A loop that can't show its metric moved is churning, not optimizing.*

**The single rule that ties it together:** every change traces a line from a **north star → a Council score → a build → a release → a measured metric move**. No orphan work, no vanity wins.

---

## 4. Governance & honesty rails (non-negotiable)

- **Advisor rubric (N1 guard):** competence/meaning over engagement — vetoes vanity-metric wins by down-weighting them to zero `strategic_fit`.
- **Clinical board (N2 guard):** veto on soundness + any developmental/medical/effect-size claim.
- **Branding firewall (CHARTER §3 p11):** Peterson = back-end inspiration only; never branded, never "clinician-endorsed."
- **Release gate (N3 + safety):** money/child-data/store/claims are Level 3–5 — surfaced to Guy, never auto-shipped.
- **Honesty:** K is unblended; clinical claims are substantiated or held; a metric move is real or the item is churn.

---

## 5. State + next actions

| Loop | Status | Next |
| :-- | :-- | :-- |
| L1 Product CIL | ✅ live | running |
| L3 Growth/Marketing | ✅ live | tune to optimize K explicitly |
| L5 Product Council | ✅ live (Sun) | running; first wave shipped 6 green |
| **L2 Clinical Excellence** | ⛏ to build | author `/arbor-clinical-loop` workflow + register weekly |
| **L4 Monetization** | ⛏ to build | author `/arbor-monetization-loop` + define the conversion/LTV metric source |
| **L6 Release train** | ⛏ to build | ROS-BACKLOG **Theme O** (ros-release-lead) — the gate that lets everything ship safely |

**Recommended sequence:** L6 (release train) first — it unblocks shipping for *all* loops — then L2 (clinical excellence, the N2 moat), then L4 (monetization, closes N3). L1/L3/L5 already run.

## 6. Related
- [CHARTER.md](CHARTER.md) · [PRODUCT-COUNCIL.md](PRODUCT-COUNCIL.md) · [teams/advisory.md](teams/advisory.md) · [improvement/CIL.md](improvement/CIL.md) · [marketing/MESH.md](marketing/MESH.md)
- Release capability: `CoS/ROS-BACKLOG.md` Theme O · agent `ros-release-lead`
- Loop registry: `/00_System/agent-framework/SCHEDULED-LOOPS.md`
