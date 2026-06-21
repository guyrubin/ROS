# Rubin OS — Root Memory
Last updated: 2026-06-21

Read at session start. Write durable current facts here. Prescriptive behavior belongs in `CLAUDE.md`, `AGENTS.md`, system docs, or skills.

---

## Operating facts

- 2026-05-20 — ROS is a Markdown-first AI operating system: durable knowledge lives in Markdown, operational state may live in Notion, binaries/sensitive files stay local-only or in Drive unless explicitly approved.
- 2026-05-20 — Canonical shared workspace is `C:\Users\dguyr\ROS` (`/mnt/c/Users/dguyr/ROS`); `/home/guyru/ROS` is a symlink to the same working tree for Hermes.
- 2026-05-24 — ROS cross-agent architecture is model-agnostic: Claude/Cowork, Codex, Hermes, and future agents share the filesystem as the stable context layer via `/AGENTS.md` and `/00_System/agent-filesystem-contract.md`.
- 2026-05-20 — ROS uses the whiteboard/archive pattern: active facts stay in `MEMORY.md`; stale/completed history moves to nearest `archive.md`.
- 2026-05-20 — Hermes scheduled job `bc55de81f9f1` runs a read-only ROS weekly hygiene audit Mondays at 08:00 and reports findings without editing or pushing.
- 2026-05-24 — Notion is the canonical surface for project and task dashboards (My Tasks DB + Command Center). Do not bootstrap parallel `TASKS.md` / `dashboard.html` from the productivity plugin; KK reads/writes tasks via the Notion connector.
- 2026-06-21 — Every ROS domain runs as an **agent environment** under the **ROS Agent Framework** (`/00_System/agent-framework/`): a lead/orchestrator + optional pods + the universal loop (SENSE→FRAME→DESIGN→PRODUCE→VERIFY→DELIVER→LEARN) + a per-domain **Definition-of-Done** gate (the knowledge-work equivalent of Arbor's `npm test`). Meshes: CoS conductor (`ros-conductor`), HV (4-agent deal mesh), EA, KK, MKT, FIN, and PAI/Arbor (pre-existing). **KK (Guy's PA) also owns two sub-meshes:** Career/job-search (`KK/job-automation/MESH.md`) and Research (`KK/research/MESH.md`, `research-agent` — KK-owned but any domain may dispatch it). Each domain mesh spec = `<DOMAIN>/mesh/MESH.md`; runnable subagents in `/.claude/agents/ros/`. Scheduled/autonomous loops are registered + human-gated in `SCHEDULED-LOOPS.md` (4 live, all read-only; new ones spec'd-but-not-live until Guy confirms). Generalized from the Arbor Mesh pattern.

## People

| Name | Role | Account | Agent scope |
|---|---|---|---|
| Joseph Rubin | EA consultant, CTO consultant — main EA lead | josephdoronrubin@gmail.com | EA (primary lead), FIN |

## Active across all agents

### HV — Real Estate
Status: Active | Pipeline: smart living + development-upside sourcing — Amsterdam Noord, Amsterdam Zuid, Den Haag coastal prestige
Next: Maintain [[HV/00_Dashboards/Smart_Living_Deal_Radar_Netherlands|Smart Living Deal Radar — Netherlands]]; current primary target is [[HV/03_Deals/Badhuiskade_217_Amsterdam_Noord|Badhuiskade 217]] pending viewing + DD.

### EA — Enterprise Arch / Workplaces
Status: Active | Focus: current workplaces only — ABN Security Enterprise Architecture onboarding + Coca-Cola Infrastructure & Security Enterprise Architecture contract/final onboarding
Lead: Guy Rubin | Joseph only when explicitly involved
Next: Track Coca-Cola employment contract and ABN onboarding steps; activate demand-aligned EA skill cards from `EA/frameworks/ea-skill-process-outcomes.md` for onboarding, current-state review, HLD, ADR/governance, compliance/control mapping, and executive briefs

### PAI — Ventures / AI Products
Status: Active | Focus: Arbor — AI child-development platform for parents (birth–12), **live in production**
Live at https://arborprd-westeu.web.app (Firebase Hosting + Cloud Run API `arbor-api`). Shipped & verified in prod: AI coach (Gemini/Vertex/Claude routing + token resilience), Academy Story Engine + Practice Mission Engine (2026-06-21), avatar + image generation, and the EN+HE marketing surface (SEO/AEO, 19 pages, `sitemap.xml`/`llms.txt`/JSON-LD).
Repo `guyrubin/PPPPtherapy-`; canonical product = React app at `PPPPtherapy-/PPPPtherapy-/app/src/` (HTML in `PAI/projects/parenting-os-plugin/html/` is legacy prototypes). Run from `app/`: dev `npm run dev` / prod `npm run start`; ROS `.claude/launch.json` exposes `arbor-dev`/`arbor-prod`.
Next: (1) iOS + Android store publishing — native Capacitor builds green in CI; only Apple/Google account-gated steps remain. (2) Buy/verify Israeli domain (`arbor.co.il`, else `getarbor.co.il`/`hellarbor.co.il`), connect in Firebase Hosting + Search Console, then switch canonical/sitemap/LLM URLs. (3) Viral GTM (€10k/6mo, Israel-first). Arbor Agent Mesh (multi-domain build/harden/grow) is scaffolded, on-demand only.
Detail + dated update log: [[PAI/MEMORY|PAI Memory]] (current as of 2026-06-21) + [[PAI/archive|PAI Archive]].

### KK — Personal Ops
Status: Active
Next: [update as tasks develop]

### MKT — Marketing
Status: Active
Next: [update as campaigns develop]

---
