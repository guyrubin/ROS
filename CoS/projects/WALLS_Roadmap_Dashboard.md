---
type: project-dashboard
status: active
agent: CoS
created: 2026-05-15
source: handwritten note image 2026-05-15
notion_status: ready_for_import_api_blocked
---

# WALLS Roadmap Dashboard

## Executive takeaway

This roadmap converts Guy's handwritten setup note into an execution dashboard. The operating idea is to build the **WALLS operating stack**: workspace, agents, lists/tasks, library/knowledge, and scoreboards/dashboards.

**Current blocker:** Notion API access is not configured in Hermes (`NOTION_API_KEY` missing). I created a Notion-ready database import and dashboard spec locally. Once the Notion integration is connected, this can be pushed into Notion as a real database.

## Transcription from image

Approximate transcription:

- Set up software?
- Google Workspace / Workbook(?)
- HeyGen AI
- Obsidian
- Notion — project running task dashboard
- Design / branding → content growth
- Marketing
- Knowledge base — Obsidian
- Dashboards

## WALLS interpretation

| WALLS layer | Meaning | Source note item | Owner agent | Status |
|---|---|---|---|---|
| W — Workspace | Google Workspace, account/workspace setup, operating folders | Google Workspace / workbook | KK / CoS | Todo |
| A — AI Tools | AI production tools for video/content and operating leverage | HeyGen AI | PAI / MKT | Todo |
| L — Lists & Tasks | Notion project-running task dashboard | Notion task dashboard | CoS / KK | Blocked by Notion API |
| L — Library | Knowledge base / notes | Obsidian knowledge base | CoS | In progress |
| S — Scoreboards | Dashboards for projects, content, marketing, agents | Dashboards | CoS | In progress |

## Roadmap by workstream

### 1. Workspace foundation

**Goal:** Create the daily operating workspace where files, accounts, docs, and dashboards live.

Tasks:
- Confirm Google Workspace account/domain to use.
- Define folder structure: Admin, Clients, Ventures, Content, Real Estate, Personal Ops.
- Connect Google Drive/Docs/Calendar to ROS/Notion operating flow where possible.
- Decide whether "Workbook" in the note means a workbook/spreadsheet or a workspace brand name.

### 2. AI production stack

**Goal:** Use AI tools to create leverage for content, marketing, training, and client material.

Tasks:
- Set up HeyGen AI account/workflow.
- Define 3 first HeyGen use cases:
  - founder video / personal brand intro
  - client explainer video
  - content repurposing from notes/scripts
- Create first script template.
- Test one pilot video.

### 3. Notion project-running dashboard

**Goal:** Create one Notion operating dashboard for projects, tasks, owners, deadlines, dependencies, and status.

Database properties:
- Name
- Workstream
- Owner Agent
- Status
- Priority
- Due
- Next Action
- Dependency
- Source
- Notes

Tasks:
- Connect Notion integration to Hermes.
- Create `WALLS Roadmap` database.
- Add initial task rows from `notion_import/WALLS_Roadmap_Tasks.csv`.
- Create dashboard views:
  - Today / Next actions
  - By workstream
  - Blocked
  - This week
  - Agent ownership

### 4. Design / branding → content growth

**Goal:** Convert brand/design into a repeatable content growth engine.

Tasks:
- Define brand positioning for Guy / Cloud AI / HollandVest as separate lanes.
- Create visual identity basics: colors, fonts, logo direction, templates.
- Build content pillars:
  - AI architecture / enterprise cloud
  - personal operating system / AI workflows
  - real estate / HollandVest
  - founder/family/productivity narrative
- Create weekly content calendar.
- Produce first 5 content drafts.

### 5. Marketing engine

**Goal:** Convert content and brand into lead generation and trust-building.

Tasks:
- Define primary channels: LinkedIn first, website second, newsletter optional.
- Create a lead magnet / credibility asset.
- Create outreach/follow-up workflow.
- Track marketing metrics in dashboard.

### 6. Knowledge base — Obsidian / ROS

**Goal:** Keep Obsidian/ROS as the durable knowledge base and source of truth.

Tasks:
- Maintain ROS as canonical Markdown source.
- Add Notion only as operating dashboard / execution interface.
- Link project pages back to ROS notes.
- Keep agent memories updated when durable decisions are made.
- Push memory updates to GitHub.

### 7. Dashboards / scoreboards

**Goal:** Every active domain has a clear scoreboard.

Dashboards to maintain:
- CoS: weekly priorities, blocked decisions, active projects.
- KK: personal ops, documents, calendar/admin.
- EA: Coca-Cola / ABN / client work.
- HV: smart living + deal radar.
- PAI: ventures / products.
- MKT: brand/content calendar.
- FIN: invoices, insurance, admin.

## Immediate execution queue

1. **Blocked:** Add Notion integration token locally and share target Notion page with integration.
2. **Ready:** Import `/home/guyru/ROS/CoS/projects/notion_import/WALLS_Roadmap_Tasks.csv` into Notion if API remains unavailable.
3. **Next:** Create first Notion database once parent page ID is available.
4. **Now:** Use this ROS dashboard as temporary source of truth.

## Notion setup needed

Hermes cannot currently create the Notion database because `NOTION_API_KEY` is missing.

Setup steps:
1. Create Notion integration: <https://www.notion.so/my-integrations>
2. Add the token locally to `~/.hermes/.env`:
   `NOTION_API_KEY=ntn_...`
3. Share the target Notion dashboard page with the integration.
4. Send only the parent page ID or URL — do **not** paste the API token into Telegram.

## Source files

- CSV import: `CoS/projects/notion_import/WALLS_Roadmap_Tasks.csv`
- JSON schema: `CoS/projects/notion_import/WALLS_Roadmap_Notion_Schema.json`
