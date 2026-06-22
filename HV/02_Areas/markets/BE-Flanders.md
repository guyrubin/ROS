# Market Module — BE / Flanders (Antwerp-first)

**Version:** 1.0 · **Created:** 2026-06-21 · **Owner:** HV · **Status:** 🆕 stood up (HV's 2nd live market)
**Source of figures:** `HV/03_Deals/2026-06-21_dev-research/be-antwerp-datapack.md` (2026-06-21 snapshot — re-verify at deal time)
**Why this file:** Makes HV's EU-pluggable model *real* — Antwerp is no longer "config", it's a populated market. Adding a market = fill this template, not new agents.

> ⚠️ **The five things that break an NL-anchored brain in Belgium** (read before underwriting any BE deal):

## 1. Acquisition tax — HV pays 12%, not 2%
- **Registratierechten (registration duty): 12%** for HV (investment/development). The 2% rate is **sole-own-home only** — not for an investor/BV.
- The old **1% major-renovation (IER) rate is abolished** (since 1 Jan 2025). The **1% monument** rate is also own-home-only → a *constraint* for HV, not a tax break.
- **All-in acquisition friction ≈ 13–14%** of price (duty + notary degressive ereloon + admin). Budget it explicitly — it's far heavier than NL's 8%.

## 2. The sale of developed units is a VAT decision (21% is the default)
- New-build / **transformed** units sold to an investor, or **>175 m²**, or speculative dev-for-sale → **21% VAT** on construction value.
- **6% demo-and-rebuild VAT** is permanent **but conditioned** (own-home ≤175 m², or social/long-term let). **Do not model 6% on a spec dev-for-sale.**
- Land in a split sale is always **12% duty**, never VAT.
- → **Input-VAT recovery + 21%/6% fork + private-vs-vennootschap exit are deal-defining. Engage a BE notary + tax advisor on deal #1.**

## 3. Renovatieverplichting — dated mandatory capex
- Non-own-home residential bought at **EPC label E/F → must reach label D within 6 years** of the deed (relaxed from 5; **tightens to C in 2028**). Fines €500–€5,000.
- This **pushes the thesis toward deep-reno**, not a light flip — the energy capex is not optional. It's also the value-add lever (E/F/G stock is where the €/m² uplift lives).

## 4. Permits (Omgevingsvergunning Vlaanderen)
- **Simplified procedure ≈ 60 days**; **regular (public inquiry) ≈ 105 days** (120 w/ OVC), ~135–150 days incl. admissibility. **Public inquiry = 30 days.**
- **Opdeling** (splitting a building into extra dwelling units) needs a permit and meets **Antwerp city** density/quality rules — confirm per address via stad Antwerpen + Geopunt/DSI (gewestplan / RUP / BPA).
- **Beschermd monument / stads- en dorpsgezicht** (relevant to Het Zuid + historic centre) → stricter, longer, higher build spec.

## 5. Capital
- Investment **LTV (quotiteit) ≈ 80%** (NBB guidance); rate **≈ 4.2–7%** (2026, lender-dependent). Pull a real term sheet from ≥2 BE banks before fixing leverage — appetite for a foreign-owned dev/vennootschap varies.

---

## Market figures (Antwerp prime, 2026 — confidence-flagged)
| Item | Figure | Conf. |
| :-- | :-- | :-- |
| Het Zuid (2000) prime buy | €3,800/m²+ | Med |
| Eilandje (2000) new-build | €3,800–4,500/m² | Med |
| Zurenborg prime | ~€3,500/m²+ | Med |
| Rent (prime) | ~€10–11/m²/mo (province avg €10.22) | Med |
| Price trend YoY | +1.3% (24→25) → +3–4% exp. 2026 | Med-High |
| Reno medium/comfort | €800–1,500/m² | High |
| Reno full-gut / casco→turnkey | €1,300–2,200/m² (luxe €2,800) | High |
| Add floor / extra m² | €1,500–2,500/m² | Low-Med |

**Underwrite off sold comps per address (Immoweb/Realo/Statbel), not these aggregates.** District €/m² are aggregator-level only.

## Portals & data (see `mesh/CONNECTOR-LAYER.md`)
Immoweb (search + broker pages; `/en/classified/<id>` 404s), Zimmo, Immovlan, Realo · Geopunt/DSI (zoning) · Woningpas + EPC · CadGIS (kadaster).

## Sourcing note (2026-06-21)
Antwerp prime whole-building dev stock in the €0.75–1.5M band is **live and more available than Den Haag's** right now (e.g. Oever 18 €1.15M, Dries 20 €1.15M, plus price-unconfirmed Vlaamsekaai 10 / Italiëlei 114 / Museumstraat 27). Het Zuid / Vlaamsekaai is the closest like-for-like to the Zuidpark reference.
