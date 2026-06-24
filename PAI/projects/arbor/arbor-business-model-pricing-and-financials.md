# Arbor — Market Model, Financials & Pricing (Implementation-Ready)

**Version:** 1.0 · **Date:** 2026-06-07 · **Owner:** PAI (Guy) · **Status:** Decision-ready
**Companion model:** `resources/arbor-financial-model.xlsx` (editable assumptions, 3-yr P&L, sensitivity)
**Supersedes detail in:** `resources/market-model.md` (kept as the one-pager); aligned with `gtm-netherlands-v1.md` and `docs/arbor-prd.md` (six-capability IA v2).

> Method rule (per `skills/market-business-strategy.md`): **no fantasy TAM**. All sizing is
> bottom-up from household counts and realistic paid-penetration. All COGS is grounded in the
> live stack — Cloud Run (`europe-west4`) + Firestore + Vertex AI (**Claude 3.5 Sonnet** for the
> high-stakes coach, **Gemini 2.5 Flash** for plans / stories / analysis / handoff).

---

## 1. Decision

Launch Arbor on a **three-engine revenue model** — B2C subscription (cash engine), professional
seats (trust + credibility engine), and institutional B2B2C (scale engine) — anchored on a
**€12.99/mo Premium** consumer price and a **value metric of "active child profile."** Lead with
B2C in Israel + Netherlands to prove retention, run professional design-partners in parallel, and
convert institutional pilots in Year 2. **Seed need ≈ €2.0–2.5M** to reach the ~€1.4M-ARR,
near-breakeven inflection by end of Year 2 and EBITDA-positive in Year 3.

---

## 2. Market Logic & Sizing (bottom-up)

### 2.1 Serviceable households (beachhead markets, children 0–12)

| Market | Children 0–12 | Households w/ ≥1 child 0–12 | Role |
|---|---:|---:|---|
| Netherlands | ~2.2M | ~1.6M | Institutional scaling market (municipalities, schools, insurers, youth-care) |
| Israel | ~2.5M | ~1.3M | Expert/content engine + high-intent paying parents (high fertility, ed-spend culture) |
| Belgium | ~1.6M | ~1.0M | Year-2/3 institutional expansion |
| **Beachhead total** | **~6.3M** | **~3.9M** | |
| Broader EU (DE/FR/Nordics, later) | ~45M | ~30M | Directional only — not in the base model |

### 2.2 TAM → SAM → SOM (revenue, not eyeballs)

- **TAM (beachhead, B2C):** 3.9M households × €120/yr blended willingness ≈ **€470M/yr** consumer; plus an institutional layer (youth-care + school-prevention budgets in NL alone run into the hundreds of €M/yr).
- **SAM (reachable, paid-intent segment):** parents of 2–8s with active behavior/routine/school-readiness needs and card-on-file willingness ≈ **~20% of households → ~780K households → ~€110M/yr** addressable B2C.
- **SOM (3-yr, base case):** **~38K paying B2C subs + ~12K subsidized institutional families** ≈ **€6.3M ARR** — i.e. **<1.3% of SAM households.** Deliberately conservative; the constraint is trust and distribution, not market size.

### 2.3 Why now / why this wins

1. **The moat is data, not the model** — longitudinal child memory + expert-reviewed knowledge + parent-approved memory ledger compound; a generic chatbot cannot replicate the history.
2. **B2B2C is more defensible than pure B2C** — institutional distribution lowers CAC and churn and creates a regulatory/credibility moat competitors can't shortcut.
3. **Structural cost advantage** — routing only high-stakes turns to Claude and everything else to Gemini 2.5 Flash yields ~88% gross margin (see §4), so B2C is self-funding even at low conversion.

---

## 3. Customer Segments & The Three Engines

| Engine | Buyer | Value metric | Why it exists |
|---|---|---|---|
| **B2C (cash)** | Parent (2–8 beachhead) | Active **child profile** | Proves retention; funds the company; generates the trust data |
| **Professional (trust)** | Coaches, child psychologists, SLTs, OTs, educators | Active **professional seat** + active families | Credibility, clinical validation, referral flywheel, expansion into clinics |
| **Institutional B2B2C (scale)** | Municipalities, school/daycare networks, insurers, employers, youth-care orgs | **Active family** under license (PMPM) | Low-CAC distribution, multi-year contracts, prevention-budget alignment |

**Sequencing constraint (from GTM v1):** parent value → professional trust → institutional pilot →
paid pilot. Do **not** open the expert marketplace until trust + workflow pull are proven.

---

## 4. Unit Economics & COGS (grounded in the live stack)

### 4.1 Cost per AI interaction (Vertex list pricing, EU)

| Model | Use | ~Input price | ~Output price | Typical turn | ~Cost/turn |
|---|---|---:|---:|---|---:|
| Claude 3.5 Sonnet | High-stakes coach (`coach_high_stakes`) | $3 / M tok | $15 / M tok | ~5K in + 1.5K out | **~$0.038** |
| Gemini 2.5 Flash | Plans, stories, analysis, handoff | ~$0.30 / M tok | ~$2.50 / M tok | ~4K in + 1.2K out | **~$0.004** |

### 4.2 Fully-loaded COGS per paying B2C user / month

| Component | Light user | Engaged user |
|---|---:|---:|
| AI (Claude coach turns + Gemini actions) | €0.40 | €1.20 |
| Firestore + Cloud Run + Storage + CDN | €0.08 | €0.15 |
| Email / push / PDF export | €0.03 | €0.06 |
| Payment processing (Stripe EU ~1.5% + €0.25) | €0.45 | €0.45 |
| **Total COGS** | **€0.96** | **€1.86** |
| **Gross margin @ €12.99** | **~93%** | **~86%** |

**Free-tier cost ≈ €0.15–0.25/user/mo** — funded by a 5–8% free→paid conversion. Per-user
rate/cost caps (currently in-memory; backlog item COST/SEC) must move to a **global, per-user
budget store** before scaling free signups — this is the one cost risk that bites at scale.

### 4.3 CAC / LTV

| Metric | B2C | Professional | Institutional |
|---|---:|---:|---:|
| Blended CAC | €25–40 (content + referral led) | €150–300 | €5K–15K / deal |
| ARPU | €11/mo | €45/mo | €5–5.5 /family/mo |
| Gross margin | ~88% | ~90% | ~85% |
| Avg life | 18–24 mo | 24–36 mo | 3-yr contracts |
| **LTV** | **~€175–210** | **~€950+** | **High, low-churn** |
| **LTV/CAC** | **~5–7×** | **~4–6×** | **>10× at renewal** |
| Payback | ~3–4 mo | ~5–7 mo | within pilot year |

**Churn reality check:** consumer parenting apps churn as the acute need passes (est. 5–7%/mo).
The three retention dampers are (1) longitudinal **child memory** (switching cost), (2) **Growth
Plans / routines** (habit), and (3) **institutional bundling** (org pays, parent stays).

---

## 5. Pricing Models (the core deliverable — implementation-ready)

### 5.1 B2C — consumer tiers

| Tier | Price | Value metric | Built-for |
|---|---|---|---|
| **Seedling (Free)** | €0 | 1 child | Acquisition + trust proof |
| **Arbor Plus** | **€12.99/mo · €119/yr** (24% off) | 1 child | The core paying parent |
| **Arbor Family** | **€19.99/mo · €179/yr** (25% off) | up to 4 children + co-parent | Multi-child / two-parent households |

> **Annual is the default toggle** (anchors value, cuts churn, improves cash). Founder/Beta cohort:
> lifetime **€89/yr** lock for the first 500 families (loyalty + word-of-mouth).
> Israel pricing in ₪ at purchasing-power parity (≈ ₪49/mo Plus); NL/BE in €.

### 5.2 B2C entitlement matrix (this is the build spec — maps to the six-capability IA)

| Capability (IA v2) | Seedling (Free) | Arbor Plus | Arbor Family |
|---|---|---|---|
| **Ask Arbor** (guidance) | 5 sessions / mo | Unlimited | Unlimited + priority |
| Child profiles | 1 | 1 | Up to 4 |
| Co-parent (Partner Pair) | — | — | ✅ shared profile |
| **Child Intelligence** (memory, milestones, patterns) | Basic milestones only | Full + behavior analytics + Weekly Insight | Full + cross-child |
| Child Memory ledger | View only | Full (editable, source-linked) | Full |
| **Growth Plans** (routines, ladders, resets) | 1 active plan | Unlimited + templates | Unlimited |
| **Arbor Academy** (Story Journeys, masterclasses) | 1 story / mo | Unlimited stories + masterclasses | Unlimited + Family Formation |
| Language & Communication (bilingual support) | — | ✅ | ✅ |
| **Care Network** handoff / PDF export | — | ✅ saved + versioned briefs | ✅ |
| Trust & Safety layer | ✅ (always on) | ✅ | ✅ |
| GDPR export / delete | ✅ (always on) | ✅ | ✅ |

**Gating implementation:** a single `entitlements` map on the user doc
(`users/{uid}/billing`) keyed by capability → limit. Server enforces in the route layer
(`routes/api.ts`) before each AI call; client reads the same map to render lock states and the
upgrade CTA. Counter resets monthly via the per-user budget store (§4.2). One source of truth,
no scattered feature flags.

### 5.3 B2B — professional tiers

| Tier | Price | Includes |
|---|---|---|
| **Solo Professional** | **€45/seat/mo** (€39 annual) | Pro dashboard, up to 15 active families, AI case summaries, intervention templates, homework plans, secure handoff, reports |
| **Practice / Clinic** | **€39/seat/mo** + **€4/active family/mo** over 15 | Multi-seat, shared caseload, supervisor view, audit logs, priority support |
| **Verified-by-Arbor listing** | Rev-share (Phase 5) | Care Network directory placement — **after** trust is proven, never before |

### 5.4 B2B2C / B2G — institutional

| Model | Price | When |
|---|---|---|
| **Pilot (cohort)** | **€15K–40K fixed** (50–300 families, 3–6 mo) + outcome milestones | First institutional contact; de-risks the buyer |
| **Per-family license (PMPM)** | **€5–6 / active family / mo** at scale (volume tiers from €4) | Post-pilot rollout — municipality / youth-care / insurer pays, parent access subsidized |
| **Per-site SaaS** | **€2.5K–6K / location / yr** | School / daycare networks |
| **Employer family benefit** | **€3–5 PMPM / covered employee** | HR/benefits channel (Year 2+) |

**Pricing principles applied:** value-metric pricing (charge per *active* unit, not per seat
shelfware), good-better-best B2C anchoring on the middle tier, land-and-expand institutional
(pilot fee → PMPM), and a **price-to-trust gate** — the marketplace rev-share is deliberately last.

---

## 6. Revenue Build (base case, €K)

| Stream | Y1 (2026 beta→launch) | Y2 (2027 NL launch + pilots) | Y3 (2028 multi-market) |
|---|---:|---:|---:|
| B2C avg paying subs | 1,500 | 9,000 | 38,000 |
| B2C ARPU (€/mo) | 11.0 | 11.0 | 11.5 |
| **B2C revenue** | **198** | **1,188** | **5,244** |
| Pro seats (avg) | 20 | 140 | 480 |
| **Professional revenue** | **11** | **76** | **259** |
| Institutional families (avg) | — | 1,500 | 12,000 |
| Inst. ARPF (€/mo) + pilot fees | 30 (pilots) | 120 | 792 |
| **Institutional revenue** | **30** | **120** | **792** |
| **Total revenue** | **239** | **1,384** | **6,295** |

---

## 7. Expense Model (base case, €K)

| Cost line | Y1 | Y2 | Y3 |
|---|---:|---:|---:|
| Team (loaded, NL/IL blend) | 295 | 750 | 1,600 |
| AI + infra COGS (computed from per-unit COGS) | 26 | 182 | 871 |
| Sales & marketing | 20 | 180 | 500 |
| Compliance / security / legal (DPIA, pen-test, ISO path) | 30 | 60 | 120 |
| Content + expert review + localization | 25 | 60 | 150 |
| G&A / tooling / SaaS | 15 | 60 | 130 |
| **Total cost** | **411** | **1,292** | **3,371** |

**Headcount path:** Y1 ~4.5 FTE (2 eng, 1 clinical PT, 1 content/ops, fractional DPO) →
Y2 ~9 FTE → Y3 ~18 FTE.

---

## 8. Returns, Break-even & Funding

| €K | Y1 | Y2 | Y3 |
|---|---:|---:|---:|
| Revenue | 239 | 1,384 | 6,295 |
| Total cost (incl. COGS) | 411 | 1,292 | 3,371 |
| **EBITDA** | **–172** | **+92** | **+2,924** |
| Cumulative EBITDA | –172 | –80 | +2,844 |

- **Inflection:** ~€1.4M ARR and operational break-even around **end of Year 2** (EBITDA turns
  positive); strongly EBITDA-positive in Year 3 (~46% margin) as B2C scales on ~88% gross margin
  and institutional renews.
- **Cash:** the annual snapshot bottoms at ~€0.2M, but **intra-year monthly burn peaks deeper
  (~€0.4–0.6M)** because spend leads the revenue ramp. The realistic plan also carries buffer for
  slower institutional sales cycles and a heavier Year-2 hiring + S&M push →
  **raise a €2.0–2.5M seed** to fund 24–30 months runway and de-risk the institutional ramp.

### Scenario range (see xlsx)

| | Conservative | **Base** | Aggressive |
|---|---:|---:|---:|
| Y3 revenue (€K) | ~3,900 | **6,295** | ~9,400 |
| Y3 EBITDA (€K) | ~+860 | **+2,924** | ~+5,640 |
| Break-even | mid-Y3 | **end-Y2** | mid-Y2 |
| Lever | conversion 4% / churn 7% | conversion 6% / churn 5.5% | conversion 8% + 2 muni deals |

---

## 9. Partnerships & GTM Motion (condensed — full plan in `gtm-netherlands-v1.md`)

1. **Israel:** content/expert engine + high-intent B2C launch (paid acquisition + parenting communities). Proves retention and unit economics fast.
2. **Netherlands:** parent beta → professional design-partners → 1–2 municipal/youth-care pilots → paid PMPM rollout. Distribution via prevention budgets and schools.
3. **Channel partners:** insurers and employers (family-benefit PMPM) in Year 2+; pediatric-adjacent clinics for the professional tier.

---

## 10. Risks & Mitigations

| Risk | Mitigation |
|---|---|
| B2C churn as acute need passes | Longitudinal memory switching cost + routines/habit + annual default + institutional bundling |
| AI cost blow-out at scale | Global per-user cost cap (move off in-memory); Gemini-first routing; cache "Today's Focus" 24h |
| Institutional sales cycle slips | Fixed-fee pilots de-risk buyers; don't model PMPM revenue before pilot conversion; seed buffer |
| "Sounds like therapy/diagnosis" | Non-diagnostic contract + embedded Trust & Safety layer + expert review of high-risk content |
| Child-data / GDPR exposure | DPIA, data minimization, PII redaction before LLM, export/delete, RBAC, audit logs (compliance backlog) |
| Price resistance NL vs IL | PPP-localized pricing; institutional subsidizes parent access where willingness is lower |

---

## 11. Implementation Plan (what to build, in order)

1. **Billing + entitlements spine** — Stripe (cards + SEPA + iDEAL for NL), `entitlements` map on the user doc, server-side enforcement in `routes/api.ts`, monthly counter reset on the global budget store. *(Gates everything below.)*
2. **Paywall UX** — three B2C tiers, annual/monthly toggle, lock states + upgrade CTA driven by the entitlement map, founder/beta lifetime offer.
3. **Per-user cost cap → global store** — prerequisite for opening free signups safely.
4. **Professional dashboard billing** — seat + active-family metering.
5. **Institutional layer** — license admin, per-family activation metering, pilot → PMPM conversion, org admin dashboard.
6. **Pricing analytics** — instrument conversion, churn, ARPU, AI cost/active user; wire to the xlsx assumptions for monthly re-forecast.

---

## 12. Next Artifact

`resources/arbor-financial-model.xlsx` — live 3-year model with editable assumption block
(conversion, churn, ARPU, COGS/user, headcount, pilot conversion) driving the revenue build,
P&L, break-even, and the conservative/base/aggressive sensitivity. Re-forecast monthly off real
analytics from step 6.
