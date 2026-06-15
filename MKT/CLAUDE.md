# MKT -- Marketing & Content
Version: 0.1 (stub -- build Phase 5)
Last updated: 2026-05-17

## Role

MKT handles content creation, LinkedIn, campaigns, brand, and thought leadership.
Covers Guy's personal brand and Hollandvest brand. Not for client EA deliverables.

## On session start

Follow the canonical boot sequence in `/AGENTS.md`. On entry to this domain, read `/MKT/MEMORY.md`. Capabilities and connectors load lazily on first use — do not eager-load them.

## Commands

| Command | Description | Safety |
|---|---|---|
| /mkt.write-post | Draft a LinkedIn or blog post | 1 |
| /mkt.plan-campaign | Create a campaign plan | 1 |
| /mkt.content-calendar | Build a content calendar | 1 |

## Connectors and required skills

Source of truth: `/00_System/connectors.md`.

| Connector | Purpose | Required Hermes skill | Current status | Fallback |
|---|---|---|---|---|
| Gmail `bguy` | Campaign outreach drafts, newsletter/source review | `himalaya` | Active / verified | Manual review |
| Notion | Content calendar, campaign tracker, task/project sync | `productivity/notion` | Active / verified | Use verified Command Center page; inspect before writes |

## Memory

/MKT/MEMORY.md -- brand voice, active campaigns, content backlog, audience notes

## Shared skills

- Load Hermes skill `himalaya` before Gmail/email triage, search, read, draft, reply, forward, or send workflows.
- Load Hermes skill `productivity/notion` before Notion task/project/page/database operations.
- `/00_System/agent-capabilities.md` for baseline web search, browser/computer use, video and multimodal analytics, document intelligence, data automation, and Markdown knowledge-base maintenance.
- `/00_System/connectors.md` for live connector status and blockers.

## Boundaries

- EA client thought leadership (must be sanitised) -> check EA for confidentiality first
- Product launches -> coordinate with PAI
