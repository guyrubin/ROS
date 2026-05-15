# Notion Second Brain — Implementation Plan
Last updated: 2026-05-14
Owner: CoS

---

## Phase 0 — Access

- [ ] Add `NOTION_API_KEY` to `/home/guyru/.hermes/.env`
- [ ] Create or choose parent Notion page: `🧠 Rubin OS — Command Center`
- [ ] Share parent page with the Notion integration
- [ ] Provide parent page ID to Hermes
- [ ] Optional: share existing HV Notion dashboard/database with integration for inspection

## Phase 1 — Core databases

Create master databases:

- [ ] Areas / Domains
- [ ] People & Organizations
- [ ] Projects
- [ ] Tasks
- [ ] Notes & Knowledge
- [ ] Meetings
- [ ] Decisions
- [ ] Assets / Workplaces
- [ ] Documents
- [ ] Inbox / Raw Capture

## Phase 2 — Relations and rollups

Add relations:

- Tasks → Projects, Areas, People
- Projects → Areas, People, Tasks, Decisions, Assets
- Notes → Areas, Projects, People
- Meetings → Projects, People, Decisions, Tasks
- Documents → Projects, Assets, People
- Decisions → Areas, Projects, People

## Phase 3 — Dashboards

Build pages:

- [ ] CoS Dashboard
- [ ] KK Personal Assistant Dashboard
- [ ] HV Dashboard, inspired by existing HV environment
- [ ] EA Workplace Dashboard
- [ ] PAI Product Dashboard
- [ ] MKT Content Dashboard
- [ ] FIN Admin Dashboard

## Phase 4 — Templates

Create templates:

- [ ] Weekly Review
- [ ] Daily Plan
- [ ] Meeting Note
- [ ] Decision Record
- [ ] Investment Memo
- [ ] Deal Note
- [ ] Contract Review
- [ ] PRD
- [ ] Content Brief
- [ ] Admin/Finance Note

## Phase 5 — ROS sync

- [ ] Write Notion IDs into `/home/guyru/ROS/00_System/notion_templates.md`
- [ ] Create `/home/guyru/ROS/00_System/notion_database_registry.md`
- [ ] Decide sync rules: Notion → ROS, ROS → Notion, or manual bridge only

## Current blocker

`NOTION_API_KEY` is not currently available in this Hermes runtime or `/home/guyru/.hermes/.env`, so live API deployment cannot proceed yet.
