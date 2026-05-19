# ROS Agent Capabilities
Version: 1.0
Last updated: 2026-05-17

---

## Purpose

This is the shared, current baseline capability catalog for every Rubin OS agent. Domain `CLAUDE.md` files should reference this file instead of duplicating tool rules.

All agents inherit these capabilities unless a domain-specific safety rule narrows access.

---

## Baseline capabilities for all agents

| Capability | What agents must be able to do | Default use cases | Guardrails |
|---|---|---|---|
| Web search and source-grounded research | Search the live web, compare sources, cite or save sources, and separate current facts from assumptions | Market scans, property checks, company/client research, vendor/tool comparison, news, pricing, regulations | Prefer official/primary sources; mark unverified claims; do not rely on stale model memory for current facts |
| Browser / computer use | Operate websites and web apps through visual browsing when APIs or direct files are insufficient | Notion, portals, dashboards, forms, visual QA, manual workflows | No external submissions, sends, purchases, payments, deletes, or irreversible actions without explicit confirmation |
| Video and multimodal analytics | Ingest video, screenshots, images, screen recordings, transcripts, and audio-derived text; extract evidence, timelines, objects, UI states, and action items | Meeting recordings, property walkthroughs, product demos, tutorials, social/video content analysis, bug reproduction | Preserve source context; flag uncertainty; avoid biometric/identity claims unless explicitly provided by the user |
| Document intelligence | Extract, OCR, summarize, compare, and convert PDFs, scans, docs, slides, spreadsheets, and images into Markdown-first ROS artifacts | Contracts, invoices, listings, decks, reports, forms | Keep originals referenced; distinguish extraction from interpretation |
| Data analysis and lightweight automation | Use scripts/notebooks/CLI tools for calculations, tables, parsing, charts, and repeatable checks | Financial models, content calendars, lead lists, KPI reviews, logs | Verify outputs; keep reusable scripts/templates in the appropriate ROS folder |
| Knowledge-base maintenance | Convert findings into atomic, linked Markdown notes and update the right `MEMORY.md` when context is durable | Research synthesis, decisions, agent memory, dashboards | Do not store temporary task progress as durable memory |

---

## Shared Gmail and Notion operating layer

All agents inherit `/00_System/connectors.md` as the source of truth for connector status.

| Workflow | Required Hermes skill | Current access | Universal rule |
|---|---|---|---|
| Gmail / email triage, search, read, draft, reply, forward, send | `himalaya` | Himalaya CLI accounts: `bguy` verified; `hollandvest` and `joseph` active / verified | Always use the domain's authorized account; draft first; never send without explicit confirmation |
| Notion pages/databases/tasks/projects | `productivity/notion` | `NOTION_API_KEY` present for integration `ROS KK Con`; Rubin OS and HollandVest Command Center pages verified accessible | Validate target page/database before writes; upsert by exact title/name; do not create disconnected junk |
| Hermes configuration / tools / profiles / gateway | `hermes-agent` | Local Hermes runtime on WSL | Load the skill before config/tool/profile/gateway changes |

Agents should not duplicate connector status in domain files except for domain-specific account scope. If live connector access is blocked, agents should produce clean ROS Markdown/import packs and state the blocker.

---

## Popular modern skill families to prefer

When choosing tools or workflows, agents should prefer current, widely adopted approaches in these categories:

- **Search/research:** web search, official docs, reputable databases, source triangulation, citation capture.
- **Computer-use automation:** browser automation, visual inspection, form review, screenshot-based QA, portal navigation.
- **Multimodal AI:** image understanding, OCR, video transcript analysis, frame sampling, audio transcription, screen-recording analysis.
- **Document workflows:** PDF/OCR extraction, Markdown conversion, structured summaries, compare/diff workflows.
- **Productivity integrations:** Gmail, Calendar, Drive/Docs/Sheets, Notion, GitHub, and other workspace APIs when available.
- **Data workflows:** Python notebooks/scripts, CSV/JSON parsing, charts, lightweight ETL, validation checks.

---

## Agent operating rule

Before answering any request that depends on current external facts, visual context, video, documents, or web apps, the agent must load or use the relevant capability above instead of answering from stale memory.
