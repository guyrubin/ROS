# HV Dual-Exit Development Model + Development-Potential Score

**Version:** 1.0 · **Created:** 2026-06-21 · **Owner:** `hv-underwriting` (model) + `hv-sourcing` (score)
**Purpose:** Upgrade HV's underwriting from single-strategy BRRRR to a **dual-exit** model (develop-to-sell *and* BRRRR-hold, compared per asset) and give `hv-sourcing` a **development-potential score** so the radar ranks on upside, not just buy-box fit. This is the "financial vetter, made better" from the reference blueprint.

---

## 1. Development-Potential Score (sourcing gate, 0–100)

`hv-sourcing` scores each candidate so the shortlist ranks on *latent value*, not just price:

| Lever | Weight | What earns points |
| :-- | :-- | :-- |
| **Entry €/m² discount to district** | 30 | Bigger gap between ask €/m² and renovated-sale district €/m² = more latent equity (A1 Zuidpark: ~33% discount → top score) |
| **Volume/unit-add headroom** | 20 | Split into N units / optopping / uitbouw / souterrain / BOG→wonen legally available |
| **Control & vacancy** | 15 | Whole-building control + vacant (or vacant-on-completion) > fragmented/tenanted |
| **EPC / label upside** | 15 | E/F/G that can be lifted = uplift lever; but in BE weigh the renovatieverplichting *cost* |
| **Permit openness** | 10 | Lever open *now* (Antwerp opdeling) beats lever *frozen* (Den Haag splitsing to Apr-2026) |
| **Location durability** | 10 | Prime, liquid, appreciating micro-location |

**Disqualifier flags (don't zero, but surface):** beschermd monument, protected stadsgezicht, erfpacht with step-up, tenanted-below-market, unconfirmed m²/price.

## 2. Dual-Exit Model (underwriting)

Run **both** exits on every candidate; recommend the winner + the breakeven that flips it.

### A. Develop-to-sell
```
GDV            = Σ(sellable m² per unit × renovated-sale €/m² [district SOLD comps])
Total cost     = purchase
               + acquisition friction   (NL ~9.5–12% · BE ~13–14%)
               + reno/dev capex         (size × €/m² by scope; +25–40% pre-1940/asbestos)
               + soft costs ~8–12%      (architect, constructie, permit, finance carry)
               + selling costs ~2–3%
Profit         = GDV − Total cost
Margin on cost = Profit / Total cost      ← target ≥ 20%
Margin on GDV  = Profit / GDV             ← target ≥ 15%
```
**Tax fork (decision-grade):** NL — does the work make it *"in wezen nieuwbouw"* (21% VAT on full sale) or stay renovation (8% OVB)? BE — transformed/spec/>175 m² unit sold to investor = **21% VAT**, not 6%. Land in a split = duty, not VAT. Get a fiscalist ruling per deal (`hv-finance`).

### B. BRRRR-hold
```
Stabilised rent → gross yield → net yield (after opex/canon)
ARV (value-in-let) → refinance at LTV (NL ~70–80% · BE ~80%)
Cash left in  = total invested − refinance proceeds
Cash-on-cash  = net cashflow / cash left in
DSCR check    = NOI / debt service     ← NL banks want 1.25–1.30; BE looser "rent > charge"
```
**The two binding caps:** NL **WWS >186 pts** for free-sector (else regulated middenhuur ≤€1,228/mo → DSCR fails); BE **low prime rent (~€10–11/m²/mo)** structurally weakens BRRRR → develop-to-sell often wins in BE, hold often wins in NL.

### C. Output (per candidate)
Best exit · profit/margin (sell) · yield/CoC/DSCR (hold) · the breakeven move (what reno-cost or sale-€/m² shift flips the verdict) · numeric verdict (Proceed / Proceed-if / Hold / Do-not).

## 3. The discipline (learned 2026-06-21)
At ask + sourced inputs, prime value-add deals frequently print **negative leveraged margins and sub-1.0 DSCR** — that is a *pricing* signal, not a thesis kill. **Underwrite the discount, not the pro-forma.** Rank by margin-of-safety (entry €/m² gap) when every pro-forma is underwater; the deal with the most latent equity is the one you can negotiate into a real return. Always replace aggregator €/m² with sold comps and reno mids with fixed-price quotes before a bid.
