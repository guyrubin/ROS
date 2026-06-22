# FIN Memory
Last updated: 2026-06-22
Reviewed: 2026-06-22

> **Ledger of record.** This file is FIN's source of truth for tracked obligations — renewals, subscriptions, tax/filing deadlines, active invoices. Each row carries an amount, a date, and a **last-verified** date.
>
> **Connector-down behaviour (overrides the `CLAUDE.md` "Manual review" fallback):** when Gmail/Notion are unreachable, **operate from this ledger** — answer "what's due / what's owed" from these rows, do not go dark. Treat any row whose **last-verified** date is older than its review cadence (default 90 days, or 30 days within the month before a deadline) as **STALE** and flag it explicitly in the answer; queue a connector refresh as a `FIN-NNN` item in `BACKLOG.md` rather than silently trusting or silently dropping the figure. Confirmed-empty sections are stated as "none tracked," not left blank.

---

## Active invoices

_None tracked yet. Verified empty 2026-06-22._

| Invoice | Counterparty | Amount | Issued / Due | Status | Last-verified |
| :-- | :-- | :-- | :-- | :-- | :-- |
| — | — | — | — | — | — |

## Insurance policies

_None tracked yet. Renewals are the highest-value gap — see FIN-001._

| Policy | Provider | Premium | Renewal date | Coverage | Last-verified |
| :-- | :-- | :-- | :-- | :-- | :-- |
| — | — | — | — | — | — |

## Subscriptions

_None tracked yet. See FIN-002._

| Service | Cost | Cadence | Next renewal | Owner / account | Last-verified |
| :-- | :-- | :-- | :-- | :-- | :-- |
| — | — | — | — | — | — |

## Tax & filing calendar

_None tracked yet. NL + BE deadlines are the compliance gap — see FIN-003._

| Deadline | Type | Jurisdiction | Due date | Amount (est.) | Status | Last-verified |
| :-- | :-- | :-- | :-- | :-- | :-- | :-- |
| — | — | — | — | — | — | — |

---

_Obligations are tracked here; remediation and gap-filling work is tracked in `FIN/BACKLOG.md` with stable `FIN-NNN` ids. Operating rules live in `FIN/CLAUDE.md`; the Definition-of-Done gate lives in the [ROS Agent Framework](../00_System/agent-framework/FRAMEWORK.md)._
