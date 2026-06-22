# HV Connector Layer — the real data spine

**Version:** 1.0 · **Created:** 2026-06-21 · **Owner:** HV · loaded by `hv-sourcing`, `hv-underwriting`, `hv-permit`
**Purpose:** Turn the generic "scraper → vetter → permit-checker → comms" blueprint into HV's *actual, working* data path — honest about what loads, what's walled, and what needs a paid key. **Capitalize on what exists; do not pretend a scraper holds where it doesn't.**

---

## 0. The reference blueprint, upgraded

A generic rental-pipeline design (Puppeteer→Funda, BAG/Kadaster/DSO, SendGrid/Twilio auto-outreach) is a fine *sketch*. HV is past it. The four reference agents map onto HV's existing mesh — and each is made better:

| Reference agent | HV reality | The upgrade |
| :-- | :-- | :-- |
| **1. Scraper** (Puppeteer→Funda, cron 15 min) | `hv-sourcing` + a (stalled) daily radar | **Funda is Cloudflare-walled** — proven repeatedly since May 2026 (returns the *"Je bent bijna op de pagina"* interstitial). Don't fight it with proxies for a 1-person dev shop. Use the **open/legible portals** below + Google snippets + **broker mandates** (the good dev stock transacts off-market). |
| **2. Financial vetter** (yield/ROI) | `hv-underwriting` (BRRRR) | **Dual-exit dev model** — develop-to-sell margin *and* BRRRR yield/refi, per candidate (`DEV-MODEL.md`). |
| **3. Permit checker** (BAG/Kadaster/DSO) | `hv-permit` (NL) | **Two regimes**: NL (Omgevingswet/DSO) + **BE/Flanders module** (Omgevingsloket Vlaanderen, RUP, renovatieverplichting). |
| **4. Comms** (SendGrid/Twilio **auto-send**) | draft-first email rules | **Never auto-send.** Tenant-protection law (NL *Wet betaalbare huur*; BE security-of-tenure) makes auto-signing a liability. Human-in-the-loop is a feature, not a gap. Plus the **architecture / finance / investor / mortgage advisor panel**. |

---

## 1. Sourcing portals (what actually loads)

| Market | Primary (loads / legible) | Secondary | Walled — avoid as source of truth |
| :-- | :-- | :-- | :-- |
| **NL** | **Pararius**, broker sites (Frisia, Estata, Beeuwkes, Verra, DOEN, SCOOP, Stokman Van Duren), jaap.nl, huislijn.nl, **Funda content via Google snippets** | Funda in Business (intermittent), MVA/MarketSuite API (Amsterdam) | **Funda.nl detail pages** (Cloudflare interstitial) |
| **BE** | **Immoweb** (`/nl/zoekertje/` + agent pages load; `/en/classified/<id>` deep links 404 — use search + broker pages), **Zimmo**, **Immovlan**, **Realo** | Broker sites (Antonissen, Heylen, Hillewaere, BAGG) | — |

**Operating rule:** the best development stock (whole panden, opbrengstpanden, conversion plays) is **thin and fast-moving** (Den Haag DOM ~46 days, sells >asking; the strongest deals are gone in 3–6 months). Portals are a *lagging* signal. **The real pipe is broker mandates + off-market alerts**, with portals as confirmation. `hv-sourcing` should triangulate price+size from ≥1 working source and **flag unconfirmed** rather than invent.

## 2. Government / cadastral data

| Need | NL | BE / Flanders |
| :-- | :-- | :-- |
| Registered area, use-function (gebruiksdoel), build year | **BAG** (bag.kadaster.nl / PDOK BAG API — free) | **Gebouwenregister / GRB** via Geopunt; **Woningpas** (per-address dossier) |
| Ownership, plot, erfpacht / charges | **Kadaster BRK** (paid; commercial **Mijn Kadaster** account for production) | **Kadaster (FOD Financiën) / CadGIS** (paid for extracts) |
| Zoning / use plan | **Omgevingsloket (DSO)** + the **Omgevingsplan** per coordinate | **Geopunt / DSI** — gewestplan, **RUP/BPA** per coordinate |
| Permit application & status | **Omgevingsloket** (Omgevingswet, 2024+) | **Omgevingsloket Vlaanderen** |
| Energy | EP-online (energielabel) | **EPC + renovatieverplichting** (Woningpas) — a hard BE cost driver |
| Comps | Kadaster sold transactions (paid) | Statbel / Immoweb-Realo sold data |

**Guardrail (reference §3):** continuous automated BAG/Kadaster querying needs a **commercial Mijn Kadaster** key — not yet held. BAG/PDOK and the public Omgevingsloket viewer are free for manual/low-volume use; that's the current HV mode. Treat the API spine as **config-ready, not yet provisioned** — don't claim live API automation we don't have.

## 3. Status ledger (honest)

| Capability | Status |
| :-- | :-- |
| NL portal + snippet sourcing | ✅ Working (manual + agent) |
| BE portal sourcing (Immoweb/Zimmo) | ✅ Working (this session proved it) |
| BAG / PDOK manual lookup | ✅ Free, available |
| Kadaster BRK production API | 🔒 Needs paid Mijn Kadaster account |
| DSO / Omgevingsloket zoning read | ✅ Manual viewer; ⚙️ API config-ready |
| BE Geopunt / Woningpas / EPC | ✅ Manual; new this session |
| Daily radar loop | ⚠️ Stalled ~2026-06-05 — revive as a Hermes loop (Guy-gated) |
| Auto-outreach (SendGrid/Twilio) | ❌ Deliberately not built — draft-first only |

## 4. Guardrails (carried from the reference, sharpened)
1. **No auto-sign, ever.** NL *Wet betaalbare huur* + tenant security-of-tenure (and BE equivalents) make an auto-signed lease a long-tail liability. Comms = draft-first, Level-3 confirm, `bhollandvest@gmail.com` only.
2. **No scraper arms race.** A premium-proxy/stealth stack to beat Funda Cloudflare is not worth it for HV's volume — use legible portals + broker mandates.
3. **Provenance or flag.** Every candidate fact carries a working source or an explicit *unconfirmed* flag. No invented listings.
4. **Snapshot discipline.** Listing data is a 24–48h snapshot of a fast-churning market — re-confirm with the broker before any IC step.
