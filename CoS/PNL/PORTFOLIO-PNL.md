# Portfolio P&L — the group's money interface (filesystem-canonical)

**Version:** 0.1 (stub)
**Created:** 2026-06-22
**Owner:** CoS (group HQ) · refreshed by FIN + each company's loops when connectors are up
**Status:** Stub — the 4th group interface, now present on disk before any connector is wired.

> **Why this file exists.** `group-operating-model.md` §"the interface" promises every company exposes four interfaces: backlog · release ledger · health · **P&L**. The first three resolve to real files; the P&L lane resolved only to connectors (RevenueCat/Stripe), so a hands-off CEO had **zero portfolio money view when connectors are offline**. This file makes the P&L interface filesystem-canonical: numbers are hand-entered or loop-written, last-verified-dated, and parseable into the cockpit. Connectors *refresh* this file; they are not the source of truth.

> **Rules.** (1) Every number carries a `verified:` date — stale past 30d reads amber, past 60d red. (2) No connector write is required to read this file. (3) FIN consolidates the legal/financial roll-up *later* (Phase 3); this is the operating view, not statutory accounting. (4) Money actions stay Level 4 — this file *records*, it never moves money.

---

## Per-company P&L (operating view)

### Arbor (company #1, ACTIVE)
| Line | Value | verified | Source |
| :-- | :-- | :-- | :-- |
| MRR | _unknown — needs first RevenueCat read_ | — | RevenueCat |
| Installs / active | _unknown_ | — | analytics (Amplitude, not wired) |
| K-factor | _unknown_ | — | growth loop |
| AI / image-gen run-rate (cost) | _unknown — has a cost cap (S2), no live meter_ | — | Vertex/AI-Studio billing |
| Net monthly | _not yet computable_ | — | derived |

> First action when connectors return: one RevenueCat read + one AI-cost read → fill MRR + cost run-rate, set `verified:` to that date. Until then Arbor's money card reads **RED (no data)**, honestly.

### HollandVest (company-eligible domain)
| Line | Value | verified | Source |
| :-- | :-- | :-- | :-- |
| Portfolio all-in cost | _per-deal, lives in Notion Capital & Financing DB_ | — | hv-underwriting |
| Equity deployed | _unknown on disk_ | — | Notion |
| Target vs actual CoC / DSCR | _computed per deal, not aggregated_ | — | hv-underwriting |
| Refinance pull-out (BRRRR) | _per active deal_ | — | brrrr-calculator |

> HV's numbers exist only behind the Enterprise-gated Notion query path. Mirror the active-deal economics here (or into `HV/00_Dashboards/PORTFOLIO-PNL.md`) so the portfolio survives Notion being offline.

### EA / Advisory (company-eligible domain)
| Line | Value | verified | Source |
| :-- | :-- | :-- | :-- |
| Active engagements (revenue) | _none captured on disk_ | — | per-client CONTEXT.md |
| — | FIN consolidates EA P&L later (group-service rule) | — | — |

### Group services (cost centers, not companies)
| Service | Monthly cost signal | verified | Note |
| :-- | :-- | :-- | :-- |
| Delivery / CI | _untracked_ | — | CI/release minutes |
| Subscriptions (runtimes/connectors) | _untracked — lives in FIN_ | — | FIN ledger when populated |

---

## Roll-up (what the CEO reads)
- **Portfolio net:** not yet computable — every line is `unknown` pending a first connector sweep.
- **Capital/attention call this period:** Arbor is the only ACTIVE company; HV is the only one with real capital at stake. Both money views are currently blind on disk — closing that is GA-1's gated half.

> When `gen-state.mjs` is extended (separate stream — do not touch the dashboard here), it should parse this file's per-company `Net monthly` + `verified` into each cockpit company card. Until then this file IS the CEO's offline money view.
