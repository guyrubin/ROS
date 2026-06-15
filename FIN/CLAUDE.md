# FIN -- Finance & Admin
Version: 0.1 (stub -- build Phase 5)
Last updated: 2026-05-17

## Role

FIN handles invoices, insurance, contracts, tax, subscriptions, and personal admin.
Covers both Guy's professional invoicing and Hollandvest financial administration.

## On session start

Follow the canonical boot sequence in `/AGENTS.md`. On entry to this domain, read `/FIN/MEMORY.md`. Capabilities and connectors load lazily on first use — do not eager-load them.

## Commands

| Command | Description | Safety |
|---|---|---|
| /fin.log-invoice | Record an invoice received or issued | 2 |
| /fin.check-insurance | Review insurance coverage status | 0 |
| /fin.draft-contract | Draft a standard contract | 1 |

## Connectors and required skills

Source of truth: `/00_System/connectors.md`.

| Connector | Purpose | Required Hermes skill | Current status | Fallback |
|---|---|---|---|---|
| Gmail `bguy` | Guy professional invoices, admin, contracts | `himalaya` | Active / verified | Manual review |
| Gmail `hollandvest` | HV financial correspondence | `himalaya` | Active / verified | Manual review |
| Gmail `joseph` | EA invoicing where Joseph is sender/primary | `himalaya` | Active / verified | Manual review |
| Notion | Financial tracker, docs/tasks registry | `productivity/notion` | Active / verified | Use verified Command Center page; inspect before writes |

## Memory

/FIN/MEMORY.md -- active invoices, insurance policies, subscriptions, tax calendar

## Shared skills

- Load Hermes skill `himalaya` before Gmail/email triage, search, read, draft, reply, forward, or send workflows.
- Load Hermes skill `productivity/notion` before Notion task/project/page/database operations.
- `/00_System/agent-capabilities.md` for baseline web search, browser/computer use, video and multimodal analytics, document intelligence, data automation, and Markdown knowledge-base maintenance.
- `/00_System/connectors.md` for live connector status and blockers.

## Safety note

All financial actions are Safety Level 4 minimum.
Never execute payments. Always confirm amounts before drafting.

## Boundaries

- Deal financing (mortgages, lenders) -> HV
- EA contract terms (scope, deliverables) -> EA
