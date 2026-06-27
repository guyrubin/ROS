# Rubin OS — Root Memory
Last updated: 2026-06-23

Read at session start. Durable current facts only. Prescriptive behavior → `CLAUDE.md`/`AGENTS.md`/skills. Stale detail → nearest `archive.md`.

---

## Operating facts
- Workspace: `C:\Users\dguyr\ROS` (`/mnt/c/...`); `/home/guyru/ROS` = symlink for Hermes. Markdown-first; durable knowledge in Markdown, operational state may live in Notion, binaries/sensitive files local-only.
- Model-agnostic cross-agent OS (Claude/Cowork · Codex · Hermes · Gemini) sharing the filesystem + `state.json` + Notion as the baton — see `/AGENTS.md`.
- Every domain runs as an **agent environment** under the Agent Framework (`/00_System/agent-framework/`): lead + pods + universal loop + per-domain Definition-of-Done. Meshes: CoS/HV/EA/KK/MKT/FIN/PAI + KK sub-meshes (Career, Research). Subagents in `/.claude/agents/`.
- **Live loops (verify against runtime, not docs):** Hermes `jobs.json` = 2 read-only crons (KK triage `333eaf638d76`, Career sprint `4fc75fbfad30`); `scheduled-tasks` MCP = 5 tasks (HV digest + arbor-cil-eval/-build/-product-council/-marketing-loop). Hermes job `bc55de81f9f1` (weekly hygiene) is documented but NOT in `jobs.json`.
- **Operating standard:** every written output passes `/de-slop`; work runs grill-me→vertical-slice→de-slop→loop.
- **Self-improvement:** Arbor CIL + ROS-CIL (`ros-evaluator`, `/ros-improve`) + weekly `/ai-trends-watch`. First ROS-CIL verdict: management heartbeat (weekly review/OKRs) has never run.
- **Release engineering = missing capability (ROS-BACKLOG Theme O).** Arbor auto-deploys blind 100%→prod on push to `main`; no incremental promotion or claim-level gating. Rule: don't improvise prod deploys in-session — build to a green branch and STOP.
- **Surfaces:** Notion Command Center (PARA) = canonical second brain (live query via Hermes `NOTION_API_KEY`; MCP query is Enterprise-gated). ROS OS Dashboard (`CoS/projects/ros-os-dashboard/`, :4700) = HTML mission-control on top.

## People
| Name | Role | Account | Scope |
|---|---|---|---|
| Joseph Rubin | EA/CTO consultant — EA lead | josephdoronrubin@gmail.com | EA (primary), FIN |

## Active by domain
- **HV** (Real Estate): smart-living + development-upside sourcing (Amsterdam Noord/Zuid, Den Haag). Primary target [[HV/03_Deals/Badhuiskade_217_Amsterdam_Noord|Badhuiskade 217]] pending viewing+DD. EU dual-exit dev engine live (see memory).
- **EA** (Enterprise Arch): Boortmalt Information Security Architect / CISO+CCoE security onboarding (Joseph identity), ABN Security EA onboarding, and Coca-Cola Infra & Security EA contract/onboarding. Lead = Guy/Joseph boundary per context; keep client contexts isolated.
- **PAI** (Ventures/Arbor): Arbor live in prod — arborparentingapp.com (Firebase Hosting + Cloud Run `arbor-api`). Full product-org + autonomous marketing mesh + 4 live loops; merge/deploy human-gated. Active GOAL: viral ignition by 2026-07-21 + iOS/Android store publishing (CI green, account-gated steps remain). Detail: [[PAI/MEMORY|PAI Memory]]. 🔒 Peterson = back-end inspiration only, never branded.
- **KK** (Personal Ops): active. **MKT**: active.
