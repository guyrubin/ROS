# Rubin OS — Root Memory
Last updated: 2026-06-21

Read at session start. Write durable current facts here. Prescriptive behavior belongs in `CLAUDE.md`, `AGENTS.md`, system docs, or skills.

---

## Operating facts

- 2026-05-20 — ROS is a Markdown-first AI operating system: durable knowledge lives in Markdown, operational state may live in Notion, binaries/sensitive files stay local-only or in Drive unless explicitly approved.
- 2026-05-20 — Canonical shared workspace is `C:\Users\dguyr\ROS` (`/mnt/c/Users/dguyr/ROS`); `/home/guyru/ROS` is a symlink to the same working tree for Hermes.
- 2026-05-24 — ROS cross-agent architecture is model-agnostic: Claude/Cowork, Codex, Hermes, and future agents share the filesystem as the stable context layer via `/AGENTS.md` and `/00_System/agent-filesystem-contract.md`.
- 2026-05-20 — ROS uses the whiteboard/archive pattern: active facts stay in `MEMORY.md`; stale/completed history moves to nearest `archive.md`.
- 2026-06-21 — Hermes scheduled job `bc55de81f9f1` (weekly hygiene audit) is **NOT in `jobs.json`** — documented but not running; re-create deliberately if wanted. (Verified by ros-evaluator against `/home/guyru/.hermes/cron/jobs.json`.)
- 2026-05-24 — Notion is the canonical surface for project and task dashboards (My Tasks DB + Command Center). Do not bootstrap parallel `TASKS.md` / `dashboard.html` from the productivity plugin; KK reads/writes tasks via the Notion connector.
- 2026-06-21 — Every ROS domain runs as an **agent environment** under the **ROS Agent Framework** (`/00_System/agent-framework/`): a lead/orchestrator + optional pods + the universal loop (SENSE→FRAME→DESIGN→PRODUCE→VERIFY→DELIVER→LEARN) + a per-domain **Definition-of-Done** gate (the knowledge-work equivalent of Arbor's `npm test`). Meshes: CoS conductor (`ros-conductor`), HV (4-agent deal mesh), EA, KK, MKT, FIN, and PAI/Arbor (pre-existing). **KK (Guy's PA) also owns two sub-meshes:** Career/job-search (`KK/job-automation/MESH.md`) and Research (`KK/research/MESH.md`, `research-agent` — KK-owned but any domain may dispatch it). Each domain mesh spec = `<DOMAIN>/mesh/MESH.md`; runnable subagents in `/.claude/agents/ros/`. Scheduled/autonomous loops are registered + human-gated in `SCHEDULED-LOOPS.md`. **Two runtimes carry live loops (verified 2026-06-21):** Hermes `jobs.json` = 2 read-only crons (KK triage `333eaf638d76` + Career sprint `4fc75fbfad30`); the **`scheduled-tasks` MCP** = 5 enabled tasks (HV weekly digest + 4 Arbor: `arbor-cil-eval`, `arbor-cil-build`, `arbor-product-council`, `arbor-marketing-loop`) — these run while the app is open / on next launch. **Doc-vs-reality finding:** the Arbor marketing loop was documented "ACTIVE" but had never actually been registered until 2026-06-21 — verify loops against the runtime (`list_scheduled_tasks` / `jobs.json`), not the docs. Generalized from the Arbor Mesh pattern.
- 2026-06-21 — **Operating standard & method** (CLAUDE.md v1.8): every written output passes **`/de-slop`** (accuracy · density · voice · decision) before delivery; work runs **grill-me → vertical-slice → de-slop → loop** (`.claude/skills/`). ROS is **LLM-agnostic** on 5 runtimes — Claude (core builder) · Codex (bulk) · Gemini (gen) · Hermes (scheduled/Google) · Google ecosystem — filesystem + Notion are the shared baton (`/AGENTS.md` division of labor).
- 2026-06-21 — **Self-improvement:** Arbor CIL (product) + **ROS-CIL** (company; `/00_System/agent-framework/ROS-CIL.md`, lead `ros-evaluator`, `/ros-improve`) audit→score→verify→fix-safe→human-ships. First ROS-CIL run verdict: *the management heartbeat has never run* (no weekly reviews, no OKRs set, COO cadence specced not run). A weekly **AI-trends watch** (`/ai-trends-watch`) keeps the OS current.
- 2026-06-22 — **Release engineering is a missing capability (CoS/DevOps).** A session built 6 green Arbor items and a hand-deploy attempt exposed: Arbor auto-deploys *blind 100% to prod on push to `main`*, `main` moves under concurrent agents (rebase races), no incremental promotion (backlog→staging→canary→prod), no feature/claim-level gating (a clinical claim can only be gated by holding the whole change). **Rule: don't improvise prod deploys in-session — build to a green branch and STOP.** The capability is filed as **ROS-BACKLOG Theme O — Release engineering (DevOps under CoS)** (O1 incremental promotion · O2 feature/claim-level gating · O3 regression-gated cycle · O4 release ownership). DevSecOps builds it; CoS holds the Level-3 prod sign-off.
- 2026-06-21 — **Surfaces:** Notion `🧠 Rubin OS — Command Center` (PARA) is the canonical second brain + cockpit (live DB query = Hermes `NOTION_API_KEY` token; **MCP query is Enterprise-gated**). The **ROS OS Dashboard** (`CoS/projects/ros-os-dashboard/`, serve :4700) is the HTML mission-control surface on top. `CoS/ROS-OS.md` is the one operating doc (PRD/Strategy/Capitalization collapsed into it). This session's work is on branch `claude/ros-shape-up` (12 commits, not pushed/merged).

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
Next: (1) iOS + Android store publishing — native Capacitor builds green in CI; only Apple/Google account-gated steps remain. (2) Buy/verify Israeli domain (`arbor.co.il`, else `getarbor.co.il`/`hellarbor.co.il`), connect in Firebase Hosting + Search Console, then switch canonical/sitemap/LLM URLs. (3) Viral GTM (€10k/6mo, Israel-first).
**Arbor Agent Mesh = a full multi-agent PRODUCT ORG (2026-06-21, CHARTER v2.0):** a standing **Advisory Board** (`arbor-advisor` product-philosophy = voice + `arbor-clinical-lead`/`-peds`/`-slp`/`-psych` board = veto on clinical soundness & any developmental/medical claim) → a **Product Council** intake (`/arbor-product-council`) fusing advisory+clinical+marketing-feature-requests+CIL into the one scored `PRODUCT-BACKLOG.md` → `arbor-orchestrator` → 10 pods + DevSecOps + Marketing. **4 loops live; merge/deploy human-gated.** 🔒 The Jordan-Peterson influence is **back-end inspiration ONLY** — never branded, never user-facing, never a clinician-endorsement claim (CHARTER §3 principle 11).
Detail + dated update log: [[PAI/MEMORY|PAI Memory]] (current as of 2026-06-21) + [[PAI/archive|PAI Archive]].

### KK — Personal Ops
Status: Active
Next: [update as tasks develop]

### MKT — Marketing
Status: Active
Next: [update as campaigns develop]

---
