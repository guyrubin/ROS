# Rubin OS — Root Memory
Last updated: 2026-05-24

Read at session start. Write durable current facts here. Prescriptive behavior belongs in `CLAUDE.md`, `AGENTS.md`, system docs, or skills.

---

## Operating facts

- 2026-05-20 — ROS is a Markdown-first AI operating system: durable knowledge lives in Markdown, operational state may live in Notion, binaries/sensitive files stay local-only or in Drive unless explicitly approved.
- 2026-05-20 — Canonical shared workspace is `C:\Users\dguyr\ROS` (`/mnt/c/Users/dguyr/ROS`); `/home/guyru/ROS` is a symlink to the same working tree for Hermes.
- 2026-05-24 — ROS cross-agent architecture is model-agnostic: Claude/Cowork, Codex, Hermes, and future agents share the filesystem as the stable context layer via `/AGENTS.md` and `/00_System/agent-filesystem-contract.md`.
- 2026-05-20 — ROS uses the whiteboard/archive pattern: active facts stay in `MEMORY.md`; stale/completed history moves to nearest `archive.md`.
- 2026-05-20 — Hermes scheduled job `bc55de81f9f1` runs a read-only ROS weekly hygiene audit Mondays at 08:00 and reports findings without editing or pushing.
- 2026-05-24 — Notion is the canonical surface for project and task dashboards (My Tasks DB + Command Center). Do not bootstrap parallel `TASKS.md` / `dashboard.html` from the productivity plugin; KK reads/writes tasks via the Notion connector.

## People

| Name | Role | Account | Agent scope |
|---|---|---|---|
| Joseph Rubin | EA consultant, CTO consultant — main EA lead | josephdoronrubin@gmail.com | EA (primary lead), FIN |

## Active across all agents

### HV — Real Estate
Status: Active | Pipeline: smart living + development-upside sourcing — Amsterdam Noord, Amsterdam Zuid, Den Haag coastal prestige
Next: Maintain [[HV/00_Dashboards/Smart_Living_Deal_Radar_Netherlands|Smart Living Deal Radar — Netherlands]]; current primary target is [[HV/03_Deals/Badhuiskade_217_Amsterdam_Noord|Badhuiskade 217]] pending viewing + DD.

### EA — Enterprise Arch / Workplaces
Status: Active | Focus: current workplaces only — Coca-Cola employment contract + ABN freelance onboarding
Lead: Guy Rubin | Joseph only when explicitly involved
Next: Track Coca-Cola employment contract and ABN onboarding steps

### PAI — Ventures / AI Products
Status: Active | Focus: Arbor parenting app — production build running locally
Canonical version: `guyrubin/PPPPtherapy-` main @ `04cc2c7` | Local clone: `C:\Users\dguyr\ROS\PPPPtherapy-\PPPPtherapy-`
Running: `npm run start` from `app/` → `http://localhost:3000` | AI: disabled until real GEMINI_API_KEY added to `app/.env.local`
Shipped 2026-05-28: 10 scholar-grounded developmental routine action plans (sleep, eating, emotional regulation, screen time, reading, movement, chores, evening wind-down)
Next: Add GEMINI_API_KEY to activate AI coach; decide cloud deployment target

### KK — Personal Ops
Status: Active
Next: [update as tasks develop]

### MKT — Marketing
Status: Active
Next: [update as campaigns develop]

---
