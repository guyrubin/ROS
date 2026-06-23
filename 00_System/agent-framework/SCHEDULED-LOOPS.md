# ROS Scheduled Loops — Registry

**Version:** 1.0
**Last updated:** 2026-06-21

The single registry of every recurring autonomous loop in ROS. A scheduled loop is a **Level-3 external automation** — it does not go live until it appears here **and** Guy has confirmed it. Default posture for every loop is **read-and-report** (read sources, classify, deliver a digest); **send / write-ROS-state / spend** require an explicit grant noted in the row.

Runtimes: **Hermes cron** (WSL automation), the `scheduled-tasks` MCP, or `/schedule` (cloud routines). Each loop names its owning mesh and its delivery channel.

---

## Live loops (already running — do not duplicate)

| ID | Owner | Cadence | Does | Posture | Delivery |
| :-- | :-- | :-- | :-- | :-- | :-- |
_Verified against Hermes `/home/guyru/.hermes/cron/jobs.json` on 2026-06-21 — only TWO live crons actually exist:_

| `333eaf638d76` | KK | `30 8,13,18 * * 1-5` (08:30/13:30/18:30 wkdays) | Actionable Gmail triage across `bguy` / `hollandvest` / `joseph`; 08:30 run = canonical **morning routing** | Read-only | ✅ enabled (verified) |
| `4fc75fbfad30` | Career | `0 9 * * 1,4` (Mon/Thu 09:00) | LinkedIn + Google Jobs sourcing sprint for Guy + Joseph (skills: job-application-automation, google-workspace, himalaya) | Read-only | ✅ enabled (verified) |
| `hv-weekly-digest` | HV | `0 8 * * 1` (Mon 08:00) | Compile best assets + project-management RAG from ROS HV files → **Google Drive doc + Gmail draft to Guy** | Draft-only (no send) | ✅ active 2026-06-21 — **`scheduled-tasks` MCP** (runs while app open), not Hermes |
| `arbor-cil-eval` | PAI/Arbor | `0 3,15 * * *` | CIL cheap regression panel → refresh `IMPROVEMENT-BACKLOG.md` | Write-backlog | ✅ verified live (last run 2026-06-21 13:03) — `scheduled-tasks` MCP |
| `arbor-cil-build` | PAI/Arbor | `0 4 * * 1,4` | CIL deep eval + build top safe fixes to green branch `claude/cil-week` | Build-to-branch | ✅ verified live; never merges/deploys |
| `arbor-clinical-loop` | PAI/Arbor | `0 6 * * 6` (Sat) | **Clinical Excellence loop (L2)** — Clinical Board benchmarks Arbor vs CDC/AAP/ASHA + competitors → clinical requirements + claim substantiations to `IMPROVEMENT-BACKLOG.md` (ahead of Sun Council). Owns north star N2 "clinically the best". | Write-backlog | ✅ live 2026-06-22; propose-only; firewall enforced |
| `arbor-product-council` | PAI/Arbor | `0 6 * * 0` (Sun) | **Product Council intake** — fuse Advisory + Clinical + Marketing + CIL → scored `PRODUCT-BACKLOG.md` candidate block (ahead of the Mon build wave) | Write-backlog | ✅ live 2026-06-21; no build/merge/deploy; clinical + gated items surfaced for Guy |
| `arbor-marketing-loop` | PAI/Arbor Mktg | `0 5 * * 2,5` (Tue+Fri) | Marketing loop — build safe materials to the brand spine, ECD+safety gate, **publish to owned organic surfaces** | Publish-organic | ✅ live 2026-06-21 — **was doc-claimed-active but NOT actually registered until now**; money/claims/child-data/store/domain/user-email gated |
| `ros-daily-plan` | CoS | `0 7 * * 1-5` (wkday 07:00) | **Daily epic-plan** — reconcile prod + git + ledger + the 3 backlogs → write `CoS/daily/PLAN-<date>.md` with the day's proposed epics + Tier-A smalls + Tier-C decisions; surface for Guy's epic approval | Plan + surface only (no execute) | ✅ live 2026-06-22 — `scheduled-tasks` MCP; the morning step of the [Daily Execution Mechanism](../daily-execution-mechanism.md) |
| `ros-cil-weekly` | CoS | `0 9 * * 1` (Mon 09:00) | **ROS-CIL light** — the management heartbeat: `/ros-improve` light (freshness + management + doc-vs-reality) → `CoS/ROS-BACKLOG.md` + State of the Company; safe filesystem fixes only | Write-backlog (safe fixes) | ✅ live 2026-06-23 — `scheduled-tasks` MCP (moved from Proposed) |
| `arbor-auto-promote` | CoS Delivery / Arbor | `0 */3 * * *` (every 3h) | Promote the newest CI-built Ready Cloud Run revision (sitting at 0% traffic) to 100% prod after a live `GET / → 200` smoke; idempotent; closes the unreliable GitHub Actions `promote` job. Script: `release-engineering/auto-promote-arbor.sh` | **Prod-promote (Level-3)** — promotes traffic, but only a CI-green-gated revision, never flips a claim/feature flag | ✅ live — `scheduled-tasks` MCP. Cadence lowered hourly→3h 2026-06-23 |

**Note on `arbor-auto-promote` runtime (2026-06-23):** cadence cut hourly→every-3h to stop waking a full agent for an idempotent no-op (8× fewer runs, promotion isn't urgent). It stays on the `scheduled-tasks` MCP (runs while the app is open) rather than Hermes — Hermes uptime isn't guaranteed, so moving it there would trade token-waste for a reliability risk. The true always-on home is **Windows Task Scheduler** invoking the `.sh` directly (no agent, no app-open dependency) — pending a one-time check that `gcloud` auth works headless. Gate is liveness-only by design (CI already ran the full green-gate to build the revision).

**⚠️ Doc-vs-reality gaps found 2026-06-21 (the "not connected" problem, concretely):**
- _Refreshed 2026-06-23: the `scheduled-tasks` MCP runtime now holds **10** enabled tasks (the 7 above were 8 with `arbor-clinical-loop`, plus the 2 just added: `ros-cil-weekly`, `arbor-auto-promote`). Verify against `list_scheduled_tasks`, not this doc._
- The **Arbor Marketing loop** was described as "✅ ACTIVE since 2026-06-21" below but was **never actually registered** on the `scheduled-tasks` runtime — only `arbor-cil-eval` + `arbor-cil-build` existed. Registered for real 2026-06-21 (org-rebuild session). The prose below is retained as the autonomy-envelope spec.
- The **HV daily Smart-Living scan** (radar logged 05-18→06-05) is **NOT a registered cron** — it ran, then stalled ~06-05. Needs reviving as a real job (Guy-gated). See HV mesh.
- Previously-claimed crons **`c20375b10b15` (Tsagareli)** and **`bc55de81f9f1` (hygiene audit)** are **NOT in Hermes `jobs.json`** — they were documented but aren't running. Removed from "live"; re-create deliberately if wanted.

---

## Proposed loops (specced — NOT live until Guy confirms)

Each is **read-and-report** unless noted. Spec a new one with [templates/scheduled-loop.md](templates/scheduled-loop.md), add the row here, then ask Guy before creating it on a runtime.

| Proposed | Owner | Cadence | Would do | Why |
| :-- | :-- | :-- | :-- | :-- |
| HV Deal Radar (revive) | HV | Daily/Weekly | Scan Pararius/Immoweb + broker snippets (Funda is bot-walled) for the active buy-box; rank top N new candidates; **write to Notion Deals/Properties + radar** | Reviving the stalled scan (top infra fix). **Write-to-Notion grant required** — Guy-gated |
| HV Project Control | HV | Fridays | For each live project (≥G3): `/hv-project-control` → refresh cost/programme/risk, update Notion Tasks, draft exceptions | Weekly RAG on in-delivery projects; activate when first project hits G3 |
| CoS Weekly Review prep | CoS | Fridays | Pre-assemble the cross-domain weekly review (status pulled from each domain `MEMORY.md` + Notion) so the live review is a decision, not a gather | Cuts review prep time |
| Command Center morning refresh | CoS | Weekday mornings | `node CoS/projects/guy-command-center/build-state.mjs` + the Notion radar refresh script — refresh both cockpits from live data | Keeps the cockpit auto-fed; surfaces stale domains |
| ~~ROS-CIL weekly (light)~~ → **LIVE** | CoS | Weekly | `/ros-improve` `mode:"light"` — freshness + management + reality audit → ROS-BACKLOG + State of the Company; safe fixes only | The self-improvement engine; keeps the company honest. ✅ moved to the live table (`ros-cil-weekly`, 2026-06-23) |
| **ROS-CIL monthly (deep)** | CoS | Monthly | `/ros-improve` `mode:"deep"` — full lens panel (domains/standard/tooling) + safe fix wave; gated items surfaced | Monthly company-wide improvement; human ships gated |
| **AI-trends watch** | CoS | Weekly | `research-agent` scans AI / agent / LLM trends + new tools, skills, methods → proposes ROS optimizations to `ROS-BACKLOG.md` + feeds the dashboard AI-trends panel (read-and-report) | Keeps the LLM-agnostic OS current; "get the most out of everything" |
| MKT Content cadence | MKT | Weekly | Draft the week's post slate from the content calendar (draft-only) | Keeps personal-brand cadence alive |
| FIN Deadline watch | FIN | Weekly | Flag upcoming invoice due-dates, insurance renewals, tax/filing deadlines | Nothing slips |
| Arbor health digest | PAI | Daily | Pull prod error/latency/cost + AI usage into one digest (read-only) | Catch regressions early |
| Release-train cadence | CoS Delivery | weekly (Arbor Product) · 2×/wk (Marketing) · on-demand (ROS) | Run /ros-release: build→full green-gate→canary→smoke, STOP at prod-promote for Guy | The incremental release cycle (ROS-BACKLOG Theme O) — never auto-promotes |

> _The Arbor **CIL eval**, **CIL build**, **Product Council**, and **Marketing loop** moved Proposed → **Live** (see the `scheduled-tasks` MCP table above). Their autonomy envelope is specced below._
>
> The two **Arbor CIL** loops are the sanctioned autonomous mode (Arbor CHARTER §3.6 / [CIL.md](../../PAI/projects/parenting-os-plugin/mesh/improvement/CIL.md)). They act beyond read-only (write the backlog; push a build branch = Level 3) but **never merge or deploy** and never auto-build `gated` (safety/consent/billing/cost) items.
>
> The **Arbor Marketing loop** is a second sanctioned autonomous mode (Guy-confirmed 2026-06-21, full-autonomy-with-publish). It goes further than the CIL loops: it **publishes safe materials to Arbor's owned organic surfaces** (landing/SEO/blog/organic social) without per-item confirmation — because each item still passes brand-review + `arbor-safety` + preview in-loop. It **never** spends money, transfers a clinical/effect-size claim, uses real child face/voice/data, buys a domain, submits a store listing, emails acquired user lists, or edits product code (all T3 — gated). Spec: [Arbor Marketing OPERATING-MODEL.md](../../PAI/projects/parenting-os-plugin/mesh/marketing/OPERATING-MODEL.md). Kill-switch = pause its `scheduled-tasks` row.
>
> **✅ ACTIVE since 2026-06-21** (moved from Proposed → Live), confirmed by Guy. Runtime = the **`scheduled-tasks` MCP** — four Arbor tasks: `arbor-cil-eval` @ `0 3,15 * * *`, `arbor-cil-build` @ `0 4 * * 1,4`, `arbor-product-council` @ `0 6 * * 0`, `arbor-marketing-loop` @ `0 5 * * 2,5` — which run **while the app is open / on next launch** — not Hermes, not a Hermes cron. The build task runs the hang-proof `arbor-cap-market.workflow.js` for its deep refresh, NOT `arbor-deep-eval` (whose IA/UX screenshot critics hang on the app's open-network-request — see [CIL.md]). First proving cycle landed green (branch `claude/cil-week`, commit `3c5075e`, + a capability-vs-competitors backlog).
> **Cloud-always-on is the remaining upgrade** (Guy's original preference): it needs the nested Arbor repo pushed to a git remote + node_modules/Firebase env + a headless preview path provisioned in the cloud runner. Until then the loop runs locally whenever the workstation/app is up.

---

## Rules

1. **Write back to shared state (non-negotiable).** Every loop ends by appending a dated one-liner to its owning domain `MEMORY.md` (+ `state.json` findings where relevant). "Read-and-report" means the report lands in **shared state**, not just a Telegram message — a loop that doesn't write back to the filesystem IS the two-runtime (Hermes↔Claude) disconnect. (ROS-BACKLOG B1.)
2. **Read-and-report is the default.** Escalating a loop to send/write/spend is a separate, explicit grant — record it in the row and in the owning mesh's `MESH.md`.
3. **One loop, one owner.** Every loop maps to exactly one mesh; that mesh's `MESH.md` lists it.
4. **No silent drift.** When a loop's scope changes, update this registry first.
5. **Kill-switch.** Any loop can be paused/removed via its runtime (`CronDelete` / `scheduled-tasks` / `/schedule`); record removals here.
