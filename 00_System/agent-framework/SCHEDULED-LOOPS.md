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

**⚠️ Doc-vs-reality gaps found 2026-06-21 (the "not connected" problem, concretely):**
- The **HV daily Smart-Living scan** (radar logged 05-18→06-05) is **NOT a registered cron** — it ran, then stalled ~06-05. Needs reviving as a real job (Guy-gated). See HV mesh.
- Previously-claimed crons **`c20375b10b15` (Tsagareli)** and **`bc55de81f9f1` (hygiene audit)** are **NOT in Hermes `jobs.json`** — they were documented but aren't running. Removed from "live"; re-create deliberately if wanted.

---

## Proposed loops (specced — NOT live until Guy confirms)

Each is **read-and-report** unless noted. Spec a new one with [templates/scheduled-loop.md](templates/scheduled-loop.md), add the row here, then ask Guy before creating it on a runtime.

| Proposed | Owner | Cadence | Would do | Why |
| :-- | :-- | :-- | :-- | :-- |
| HV Deal Radar | HV | Weekly (Mon) | Scan Funda/Pararius/Kadaster signals for the active buy-box; rank top N new candidates with a 3-line fit note | Keeps the pipeline fed without manual sourcing |
| CoS Weekly Review prep | CoS | Fridays | Pre-assemble the cross-domain weekly review (status pulled from each domain `MEMORY.md` + Notion) so the live review is a decision, not a gather | Cuts review prep time |
| Command Center morning refresh | CoS | Weekday mornings | `node CoS/projects/guy-command-center/build-state.mjs` — refresh the dashboard `state.json` from live domain memory (read+workspace-write only) | Keeps the cockpit auto-fed; surfaces stale domains |
| MKT Content cadence | MKT | Weekly | Draft the week's post slate from the content calendar (draft-only) | Keeps personal-brand cadence alive |
| FIN Deadline watch | FIN | Weekly | Flag upcoming invoice due-dates, insurance renewals, tax/filing deadlines | Nothing slips |
| Arbor health digest | PAI | Daily | Pull prod error/latency/cost + AI usage into one digest (read-only) | Catch regressions early |
| **Arbor CIL nightly eval** | PAI | Daily (off-peak) | Run `arbor-improve` `mode:"eval"`: critic panel → score → verify → update `IMPROVEMENT-BACKLOG.md` (workspace write only, no merge/deploy) | Keeps the self-improvement queue fresh; catches regressions |
| **Arbor CIL weekly build** | PAI | Weekly | Run `arbor-improve` `mode:"build"`: build top verified `safe` findings to green on branch `claude/cil-week` + re-confirm; **opens approve-to-ship roll-up — no merge/deploy** | Closes the loop; human ships |

> The two **Arbor CIL** loops are the sanctioned autonomous mode (Arbor CHARTER §3.6 / [CIL.md](../../PAI/projects/parenting-os-plugin/mesh/improvement/CIL.md)). They act beyond read-only (write the backlog; push a build branch = Level 3) but **never merge or deploy** and never auto-build `gated` (safety/consent/billing/cost) items. Not live until Guy confirms the crons.

---

## Rules

1. **Write back to shared state (non-negotiable).** Every loop ends by appending a dated one-liner to its owning domain `MEMORY.md` (+ `state.json` findings where relevant). "Read-and-report" means the report lands in **shared state**, not just a Telegram message — a loop that doesn't write back to the filesystem IS the two-runtime (Hermes↔Claude) disconnect. (ROS-BACKLOG B1.)
2. **Read-and-report is the default.** Escalating a loop to send/write/spend is a separate, explicit grant — record it in the row and in the owning mesh's `MESH.md`.
3. **One loop, one owner.** Every loop maps to exactly one mesh; that mesh's `MESH.md` lists it.
4. **No silent drift.** When a loop's scope changes, update this registry first.
5. **Kill-switch.** Any loop can be paused/removed via its runtime (`CronDelete` / `scheduled-tasks` / `/schedule`); record removals here.
