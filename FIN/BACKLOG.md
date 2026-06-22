# FIN — Backlog
Last updated: 2026-06-22

> Stable `FIN-NNN` ids — never renumber, never reuse. Closed items keep their id and move to **Done**. Each item: owner, the obligation it feeds in `MEMORY.md`, and whether it's gated. FIN actions are Safety Level 4 minimum (`FIN/CLAUDE.md`); the universal loop + Definition-of-Done gate live in the [ROS Agent Framework](../00_System/agent-framework/FRAMEWORK.md). This backlog tracks *populating and refreshing the ledger* — the ledger itself is `MEMORY.md`.

## Scoring

`sev × imp × conf ÷ eff` (1–5 each), matching the ROS-CIL convention. Higher = do sooner.

## Open

| ID | Item | Feeds | Score | Owner | Gated |
| :-- | :-- | :-- | :-: | :-- | :-: |
| FIN-001 | Populate **insurance renewals** — provider, premium, renewal date, coverage per policy. Highest value: an unflagged lapsed renewal is a real loss. | Insurance policies | 4.0 | fin-admin | No (read Gmail + ask Guy) |
| FIN-002 | Populate **recurring subscriptions** — service, cost, cadence, next renewal, billing account. Reconcile against the three Gmail accounts. | Subscriptions | 3.6 | fin-admin | No |
| FIN-003 | Build the **NL + BE tax/filing calendar** — VAT/BTW, income tax, holding-co filings; relevant given the relocation posture. Dates + estimated amounts + jurisdiction. | Tax & filing calendar | 3.6 | fin-admin | No (confirm with Guy/accountant) |
| FIN-004 | Stand up the **staleness sweep** — a cadence that re-verifies every ledger row and flags any past its last-verified window, queuing a connector refresh here. | All sections | 2.7 | fin-admin | Gated (live cron / Level-3 automation) |
| FIN-005 | Capture **active invoices** (issued + received) across `bguy` / `hollandvest` / `joseph` as they arise; this is event-driven, not a one-time backfill. | Active invoices | 2.4 | fin-admin | No |

## Done

_None yet._
