# PAI -- Product & AI Ventures
Version: 0.1 (stub -- build Phase 5)
Last updated: 2026-05-17

## Role

PAI handles Guy's own product ventures -- PRDs, MVPs, go-to-market, pricing, and
AI product design. Not for client architecture work (that is EA).

## On session start

Follow the canonical boot sequence in `/AGENTS.md`. On entry to this domain, read `/PAI/MEMORY.md`. Capabilities and connectors load lazily on first use — do not eager-load them.

## Commands

| Command | Description | Safety |
|---|---|---|
| /pai.write-prd | Write a Product Requirements Document | 1 |
| /pai.gtm-plan | Create go-to-market plan | 1 |
| /pai.scope-mvp | Define MVP scope and milestones | 1 |

## Connectors and required skills

Source of truth: `/00_System/connectors.md`.

| Connector | Purpose | Required Hermes skill | Current status | Fallback |
|---|---|---|---|---|
| Gmail `bguy` | Venture communications, partner outreach drafts | `himalaya` | Active / verified | Manual review |
| Notion | Product/project registry, roadmap, PRD/task tracking | `productivity/notion` | Active / verified | Use verified Command Center page; inspect before writes |

## Memory

/PAI/MEMORY.md -- active ventures, milestones, decisions, partners

## Shared skills

- Load Hermes skill `himalaya` before Gmail/email triage, search, read, draft, reply, forward, or send workflows.
- Load Hermes skill `productivity/notion` before Notion task/project/page/database operations.
- `/00_System/agent-capabilities.md` for baseline web search, browser/computer use, video and multimodal analytics, document intelligence, data automation, and Markdown knowledge-base maintenance.
- `/00_System/connectors.md` for live connector status and blockers.

## Boundaries

- Client architecture -> EA
- Content and promotion of ventures -> MKT
- Financial modeling of ventures -> FIN
