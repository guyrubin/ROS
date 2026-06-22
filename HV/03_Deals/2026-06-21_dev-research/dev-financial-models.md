---
type: financial-model
status: draft
agent: hv-underwriting
created: 2026-06-21
scope: dual-exit (develop-to-sell + BRRRR-hold) for 5 shortlisted dev candidates
markets: Antwerp (BE) + Den Haag (NL)
sources: nl-denhaag-datapack.md, be-antwerp-datapack.md, antwerp-candidates.md, denhaag-candidates.md
---

# Dual-Exit Financial Models — Antwerp + Den Haag Dev Shortlist

**Headline finding:** At the sourced 2026 inputs, **none of the five candidates clears a develop-to-sell margin, and none clears a 1.25 DSCR BRRRR**. Every sell exit is negative; every hold exit is sub-3.5% gross yield with capital trapped and negative/breakeven leverage. NL (D2) is structurally the closest to working; Antwerp prime is the worst because high entry €/m² + low rent (€12/m²) + 21% VAT-on-sale + EPC-D capex compound against a low renovated-sale ceiling (~€4,400/m²). **This is a pricing verdict, not a thesis verdict** — the value-add thesis is sound; these specific assets are bought too rich for a leveraged flip or BRRRR. Off-market basis or a 25–40% price cut is what flips them.

---

## Shared model assumptions (ALL LABELED — flag every one)

### NL (Den Haag)
| Input | Value | Basis / flag |
|---|---|---|
| Acquisition friction (hold/entry) | **~11% of price** (8% OVB + ~3% KK stack) | datapack §A (9.5–12%). ASSUMPTION mid. |
| Renovated-sale €/m² — prime Duinoord/Statenkwartier | **€6,200/m²** base (€6,800 premium pocket) | datapack §B asking €5,500–6,800. ASSUMPTION — replace w/ Kadaster sold comps. |
| Renovated-sale €/m² — Belgisch Park | **€5,400/m²** | datapack §B coast-adjacent. ASSUMPTION. |
| Free-sector rent prime | **€24–25/m²/mo** | datapack §B (avg €24.41; prime higher). ASSUMPTION. |
| Reno full gut | **€1,800/m²** | datapack §C (€1,500–2,500, pre-2000 +25–40%). ASSUMPTION mid-upper. |
| Souterrain dig | **€4,000/m²** | datapack §C (€3,000–5,000+, LOW conf). HIGH-RISK ASSUMPTION. |
| Soft costs | **10% of build** | datapack (8–12%). ASSUMPTION. |
| Finance | ~5%, IO, ~65% of (price+reno), 12–18 mo | datapack §E (4.6–5.5%). ASSUMPTION. |
| Selling cost | **2.5% of GDV** | ASSUMPTION. |
| Refi LTV (value-in-let) | **75%** | datapack §E (70–80%). |
| DSCR floor | **1.25** | datapack §E (NIBC/RNHB 1.25). |
| VAT-vs-OVB on sale | base case = **renovation → buyer pays 8% OVB, NO VAT on seller**; downside = "in wezen nieuwbouw" → **21% VAT on sale** | datapack §A. PER-DEAL FISCAL RULING REQUIRED. |

### BE (Antwerp)
| Input | Value | Basis / flag |
|---|---|---|
| Acquisition friction | **~13.5% of price** (12% duty + notary stack) | datapack §A. |
| Renovated-sale €/m² — Zuid/centre | **€4,400/m²** (€4,800 top) | datapack §B band €4,000–4,800. ASSUMPTION — confirm 3 sold comps. |
| Rent prime | **€12/m²/mo** | datapack §B (province €10.22; prime €12–15). CONSERVATIVE ASSUMPTION. |
| Reno full gut | **€1,700/m²** + kitchens/baths | datapack §C (€1,300–2,200). ASSUMPTION. |
| Reno medium (EPC-C stock) | **€1,000/m²** | datapack §C. ASSUMPTION. |
| VAT on sale to investor | **21% on construction value**, input VAT recoverable | datapack §A — dev-for-sale = professional VAT sale. Modeled as net leakage; SINGLE BIGGEST BE-SELL UNCERTAINTY. |
| 21% VAT on works (hold) | added to reno (NOT recoverable when holding to let, not >10yr private home) | datapack §C. |
| EPC E/F → D in 6yr | mandatory dated capex; aligns w/ deep reno | datapack §D. |
| Refi LTV | **80%** | datapack §E (NBB ~80%). |
| Net→sellable efficiency | **~85–88% of gross m²** | ASSUMPTION (gross listings → net sellable). |

> **VAT leakage model (BE sell):** GDV treated as VAT-inclusive market price. Net VAT cost ≈ 21% × (new-construction share of GDV, ~50–60%) − input VAT recovered on reno. This is an approximation; the true number swings on the land/construction split and the professional VAT structure — **get a BE tax ruling per deal.**

---

## ANTWERP

### A1 — Zuidpark, Het Zuid 2000 (the reference) · €975,000 · 385 m² gross / 95 m² plot

**Concept:** full gut of GLV+4 block → split into ~5–6 units (avg ~60 m²). Net sellable ≈ 385 × 0.88 = **339 m²**. Bouwcode 100m²-unit rule may not bind (plot 95m², outdoor likely <15m²) — FLAG verify.

**DEVELOP-TO-SELL**
| Line | € |
|---|---|
| GDV (339 × €4,400) | 1,491,600 |
| Purchase | 975,000 |
| Acquisition 13.5% | 131,625 |
| Reno (385 × €1,700) + 6× kit/bath €120k | 774,500 |
| Soft costs 10% | 77,450 |
| Finance (18 mo) | 85,275 |
| Selling 2.5% | 37,290 |
| VAT net leakage | 53,542 |
| **Total cost** | **2,134,682** |
| **Profit** | **−643,082** |
| Margin on cost | **−30%** · Margin on GDV **−43%** |

Even at €5,500/m² sell (above any Antwerp band): GDV €1.86M → still **−€270k**. Sell is structurally broken: entry €2,532/m² gross vs €4,400 net ceiling is too thin once reno + 13.5% + 21% VAT bite.

**BRRRR-HOLD** (reno incl 21% VAT = €937,145; all-in ≈ **€2,216,220**)
- Stabilised rent: 339 × €12 × 12 = **€48,816/yr gross** → gross yield **2.2%**, net ~1.65%.
- ARV (value-in-let @3.5% net) ≈ **€1,046,000** → refi 80% = €836,845 → **cash stuck €1,379,375**.
- DSCR = NOI 36,612 / 41,842 = **0.87 — FAILS**.

**Which wins / breakeven:** Neither. Sell loses €643k, hold yields 2.2%. Flip needs buy ≤ ~€520k (−47%) at €4,400 sell; hold needs rent ≥ ~€22/m² (vs €12). **VERDICT: Do-not at €975k.**

---

### A2 — Oever 18, historic centre · €1,150,000 · 3 apts (2 permitted + 1 regularise)

**Concept:** regularise 3rd unit → 3 legal apts + EPC lift. **Size NOT stated — MISSING VARIABLE**, estimated ~330 m² gross / ~290 net from "12 bedrooms, 3 apts". FLAG: confirm m² before any action.

**DEVELOP-TO-SELL**
| Line | € |
|---|---|
| GDV (290 × €4,400) | 1,276,000 |
| Purchase | 1,150,000 |
| Acquisition 13.5% | 155,250 |
| Reno (330 × €1,400) + EPC/baths | 522,000 |
| Soft 10% | 52,200 |
| Finance (12 mo) | 54,350 |
| Selling 2.5% | 31,900 |
| VAT net leakage | 24,360 |
| **Total cost** | **1,990,060** |
| **Profit** | **−714,060** |
| Margin on cost **−36%** · on GDV **−56%** |

Entry €3,966/net-m² vs €4,400 ceiling = €434/m² spread before a euro of reno. Hopeless. (Swing: if works qualify as "renovation" not new-build, the SALE avoids 21% VAT — buyer pays 12% duty instead — saving the €24k leakage but not the €714k gap.)

**BRRRR-HOLD** (reno incl VAT €631,620; all-in ≈ **€2,049,070**)
- Rent: 290 × €12 × 12 = **€41,760/yr** → gross yield **2.0%**.
- ARV @3.5% net ≈ €895,000 → refi 80% = €715,886 → **cash stuck €1,333,184**.
- DSCR = 31,320 / 35,794 = **0.88 — FAILS**.

**VERDICT: Do-not at €1.15M.** Worst entry €/sellable-m² of the set; regularisation upside immaterial against the gap. Confirm m² but unlikely to change the call.

---

### A3 — Dries 20, central · €1,150,000 · 470 m² · EPC C · up to 7 units + garage · tenanted

**Concept:** EPC C (NO forced-D capex — lighter reno possible) → medium reno + re-plan to 7 units. Net sellable ≈ 470 × 0.85 = **400 m²**. Indoor garage = value. Tenanted → vacant-possession risk (FLAG). This is the least-bad Antwerp deal.

**DEVELOP-TO-SELL**
| Line | € |
|---|---|
| GDV (400 × €4,400) | 1,760,000 |
| Purchase | 1,150,000 |
| Acquisition 13.5% | 155,250 |
| Reno (470 × €1,000) + 7× kit/bath €140k | 610,000 |
| Soft 10% | 61,000 |
| Finance (12 mo) | 57,200 |
| Selling 2.5% | 44,000 |
| VAT net leakage | 56,700 |
| **Total cost** | **2,134,150** |
| **Profit** | **−374,150** |
| Margin on cost **−18%** · on GDV **−21%** |

Least-bad BE sell (entry €2,875/net-m²) but still −€374k. Needs buy ≤ ~€780k (−32%) or sell ≥ €5,350/m² to clear ~10%.

**BRRRR-HOLD** — Antwerp's only semi-viable hold (income property, EPC C, mixed-use):
- (reno incl VAT €738,100; all-in ≈ **€2,169,350**)
- Rent: 400 × €12 + retail premium ≈ **€60,000/yr** → gross yield **2.77%**, net ~2.1%.
- ARV @4% net (mixed-use central) ≈ **€1,125,000** → refi 80% = €900,000 → **cash stuck €1,269,350**.
- DSCR = 45,000 / 45,000 = **1.00** — fails NL 1.25 floor but **marginally passes the BE "rent > credit charge" interest-only test**.

**Which wins / breakeven:** Hold edges sell (sell −€374k vs hold ~breakeven cashflow). Still sub-yield. Sensitivity: at proven €15/m² rent → gross yield 3.5%, DSCR ~1.25 (works). **VERDICT: Hold — revisit only if buy −25% or rent confirms €15/m²+.**

---

## DEN HAAG

### D1 — 1e Sweelinckstraat 6, Duinoord · €1,650,000 · 289 woon m² / 219 plot · label C · 1892 · cellar 1.81m → souterrain · beschermd stadsgezicht

**Concept:** souterrain dig (1.81m → full height, +~80 m²) + reconfig/unit-add. Total ≈ **369 m²**. Splitsing legal from 1-Apr-2026 (min 35m²/unit, Duinoord qualifies on leefbaarheid). Beschermd → welstand drag + likely uitgebreide procedure. **Above the €1.5M cap (FLAG).**

**DEVELOP-TO-SELL** (base case: renovation → no 21% VAT on sale)
| Line | € |
|---|---|
| GDV (369 × €6,200) | 2,287,800 |
| Purchase | 1,650,000 |
| Acquisition 11% | 181,500 |
| Reno (289 × €1,800) + souterrain (80 × €4,000) | 840,200 |
| Soft 10% | 84,020 |
| Finance (18 mo) | 121,350 |
| Selling 2.5% | 57,195 |
| **Total cost** | **2,934,265** |
| **Profit** | **−646,465** |
| Margin on cost **−22%** · on GDV **−28%** |

At €6,800/m² (premium pocket): GDV €2.51M → still **−€425k**. **Breakeven sell = €7,952/m²** (above any DH district). Breakeven buy ≈ **€994k** at €6,200 sell (−40% from ask), ≈ €1.19M at €6,800. The €1.65M ask + €320k souterrain dig (high NL water-table risk) is the killer.

**BRRRR-HOLD** (all-in ≈ **€2,877,070**)
- **WWS:** as 1–2 LARGE units (>140 m² each), renovated to label A, high WOZ, outdoor space → comfortably **>186 pts → FREE-SECTOR** (liberalised). Good — small-split cap risk avoided.
- Rent: 369 × €25 × 12 = **€110,700/yr** → gross yield **3.85%**, net ~3.0%.
- ARV (value-in-let @3.5% net) ≈ **€2,467,000** (below all-in €2.88M → reno doesn't create value over a rich entry) → refi 75% = €1,850,250 → **cash stuck €1,026,820**.
- Cashflow = NOI 86,346 − IO debt 92,513 = **−€6,167/yr (negative)**. DSCR = **0.93 — FAILS**.

**Which wins / breakeven:** Neither. Negative leverage (5% debt on a 3.0% net asset). Hold needs rent ≥ €32/m² OR buy ≤ €1.3M for DSCR 1.25. **VERDICT: Do-not at €1.65M.** Blue-chip asset, wrong price. Proceed-IF negotiated to ~€1.2M AND souterrain quoted cheap/feasible — then re-model.

---

### D2 — Stevinstraat 79, Belgisch Park (SOLD comp / in-budget DH archetype) · €795,000 · ~189 m² · total renovation

**Concept:** total reno of a prime 189 m² house; optional split into 2 (~94 m² each, above 35m² min, post-1-Apr-2026). The realistic in-budget DH deal — and the **best of the shortlist on yield**.

**DEVELOP-TO-SELL** (single renovated house, no add-m²)
| Line | € |
|---|---|
| GDV (189 × €5,400) | 1,020,600 |
| Purchase | 795,000 |
| Acquisition 11% | 87,450 |
| Reno (189 × €1,800) | 340,200 |
| Soft 10% | 34,020 |
| Finance (12 mo) | 36,900 |
| Selling 2.5% | 25,515 |
| **Total cost** | **1,319,085** |
| **Profit** | **−298,485** |
| Margin on cost **−23%** · on GDV **−29%** |

At €5,800/m²: still −€223k. **Breakeven sell = €6,980/m²** (top Statenkwartier/coast only, not Belgisch Park). **That it SOLD at €795k proves end-users/owner-occupiers outbid leveraged flippers** at the prime-reno price point in DH. Adding a 2-unit split (+€60–90k cost, small-unit €/m² premium) does not flip it positive.

**BRRRR-HOLD** (all-in ≈ **€1,293,570**)
- **WWS:** 189 m² renovated label A, Belgisch Park, high WOZ → as 1 unit (or 2× ~94 m²) **>186 pts → free-sector**.
- Rent: 189 × €24 × 12 = **€54,432/yr** → gross yield **4.21% (best of shortlist)**, net ~3.28%.
- ARV @3.5% net ≈ **€1,213,000** (≈ cost — reno barely creates value over entry) → refi 75% = €862,500 (use ~€1.15M ARV conservative) → **cash stuck €431,070**.
- Cashflow = NOI 42,457 − IO debt 43,125 = **−€668/yr (~breakeven)**. DSCR = **0.98 — just fails 1.25 (closest of all)**.

**Which wins / breakeven:** Hold beats sell decisively (sell −€298k vs hold ~breakeven cashflow + 4.2% yield + smallest cash trapped). Still not a true BRRRR (no profitable capital-out). Sensitivity: rent €28/m² → DSCR ~1.14, cashflow positive. **VERDICT: Hold / Proceed-if** — a 4.2%-yield appreciation hold in a +5–7% market, low/no leverage; NOT a refinance-out BRRRR at €795k.

---

## CROSS-CANDIDATE RANKING (risk-adjusted)

| Rank | Candidate | Best exit | Headline | Cash stuck / margin | DSCR | Verdict |
|---|---|---|---|---|---|---|
| 1 | **D2 Stevinstraat (DH archetype)** | Hold | 4.21% gross yield, ~breakeven cashflow | €431k stuck | 0.98 | **Hold / Proceed-if** |
| 2 | **A3 Dries 20** | Hold | 2.77% gross yield; EPC-C lighter reno; BE looser test | €1.27M stuck | 1.00 | **Hold** |
| 3 | **D1 Sweelinck 6** | Hold | 3.85% gross / 3.0% net; blue-chip but over cap; souterrain risk | €1.03M stuck; sell −€646k | 0.93 | **Do-not (at ask); Proceed-if ≤€1.2M** |
| 4 | **A1 Zuidpark (reference)** | — | 2.2% yield; sell −€643k (−30% on cost) | €1.38M stuck | 0.87 | **Do-not** |
| 5 | **A2 Oever 18** | — | 2.0% yield; sell −€714k (−36% on cost); m² unconfirmed | €1.33M stuck | 0.88 | **Do-not** |

**Why NL > BE here:** Den Haag has a higher renovated-sale ceiling (€5,400–6,800 vs €4,400/m²), higher rent (€24–25 vs €12/m²), 8% OVB (vs 12% duty), and **no 21% VAT-on-sale drag** on a renovation exit. Antwerp prime is priced for yield-compressed/owner buyers; the €12/m² rent ceiling kills BRRRR and the €4,400/m² sell ceiling kills the flip. The Antwerp deals would need a 25–32% price cut (off-market) to work; D1 a ~30% cut; D2 is the only one already at a yield that holds.

---

## What flips the verdict (sensitivity master)

- **Sell exit, any candidate:** dead unless buy price −25% to −40% OR renovated-sale €/m² is materially above the district band. The renovated-sale €/m² is the single most load-bearing assumption and is ASSUMPTION-grade (asking aggregators, not sold comps) — **pull 3 sold comps per address before any final call.**
- **Hold exit:** dead on DSCR at €12/m² (BE) and at these entry prices (NL). Flips to viable if (a) BE rent proves €15/m²+ on prime central, or (b) NL rent proves €28–32/m², or (c) entry negotiated down. WWS is NOT the binding constraint for the large-unit NL concepts (they clear 186 pts → free-sector); it WOULD bite if NL units are split small (<~70 m²).
- **BE VAT:** if a deal qualifies for the "renovation not new-build" position, the 21%-VAT-on-sale leakage disappears — improves BE sell by €25–55k per deal (still doesn't close the gap).

## Open items before any deal goes live (escalate to hv-orchestrator)
1. **3 sold comps/address** to replace asking-aggregator renovated-sale €/m² (the verdict-deciding input).
2. **A2 Oever — confirm m²** (currently a missing variable; modeled estimate).
3. **BE tax ruling** per deal: 12% duty vs 21%/6% VAT, input-VAT recovery, vennootschap exit.
4. **NL fiscal ruling** D1/D2: renovation (8% OVB resale) vs "in wezen nieuwbouw" (21% VAT) — swings D1 sell by ~€480k.
5. **D1 souterrain structural quote** (water table, underpinning) — €320k line is LOW-confidence and decision-relevant.
6. **Live rent comps** prime Antwerp centre (only province avg €10.22 verified) — could move BE hold from dead to marginal.
7. **2 fixed-price contractor quotes/deal** to replace reno €/m² ranges.
8. **D1 over €1.5M cap** — only proceeds via negotiation to ~€1.2M.

*Built by hv-underwriting. Numbers feed hv-orchestrator for the IC call — not a standalone IC decision. All non-sourced inputs labeled ASSUMPTION; missing variables flagged, not guessed.*
