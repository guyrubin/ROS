---
type: reference
title: ROS Backlog (company-level)
description: Single append-only ledger for ROS-the-company epics, cross-domain items, and self-improvement findings.
---

# ROS Backlog (company-level)

Single ledger for ROS-the-company work: epics, cross-domain items, and the
self-improvement findings from the weekly review. Routines APPEND dated blocks
here; they never clobber prior entries. Guy triages at epic level.

Tiers (from the daily execution mechanism):
- **A** autonomous (bugs / small safe fixes) · **B** epic-approval · **C** always-gated (claims, child-data, money, DNS, store, irreversible).

---

## Open epics

### [2026-06-27] Knowledge Architecture — next enhancements
Seeded from the OKF execution ([report](reports/ros-okf-execution-2026-06-27.md)). Themes: **K** Knowledge · **A** Autonomy · **H** Harness · **G** Hygiene.

**K — Knowledge Architecture (OKF)**
- **K-1 · Machine cleanup + Arbor-under-PAI migration + GitHub rename** `PPPPtherapy-`→`Arbor` — disk 92% full; WIP preserved as commits; **paused** on concurrent Arbor session. *(C, M)*
- **K-2 · Promote OKF linter to a committed `.claude/settings.json` hook** — enforce invariants fleet-wide (today local git hook only). *(C, S)*
- **K-3 · Frontmatter second pass** — the ~160 remaining vault files + 4 eager boot files (`type:`-only). *(A, M)*
- **K-4 · Populate `.mcp.json` with real server defs** once Codex/Hermes MCP configs captured. *(A, M)*
- **K-5 · Wikilink → relative-link export** for agent-portable graph (keep `[[ ]]` for humans). *(A, S)*
- **K-6 · Backlink index + typed edges** — *post-traction; flagged overkill now, do not build early.* *(A, L)*
- **K-7 · OKF static HTML visualizer** over the vault — on-demand, not a build item. *(A, S)*

**A — Autonomy (three-engine loop)**
- **A-1 · Codex Plugin pilot** on ONE Arbor backlog item — the autonomy keystone. *(C, M)*
- **A-2 · `grill-me-codex` align card** so the Codex surface never builds un-grilled. *(C, S)*
- **A-3 · Hermes SENSE schedule** (kill-switched) — the always-on trigger. *(C, M)*
- **A-4 · `ros-redteam`** to falsify evaluator findings (closes the critic+evaluator asymmetry). *(A, S)*

**H — Harness (R4 ring)**
- **H-1 · Validator tool-strip (G-M1)** — make ~13 validator-class agents read-only by tool-grant. *(C, S)*
- **H-2 · Uncomment the Arbor prod-promote gate** + Guy as Required Reviewer. *(C, S)*
- **H-3 · Agent-run telemetry** (`agent-runs.jsonl` → cost-per-epic + eval-score-trend). *(A, M)*

**G — Hygiene**
- **G-1 · De-orphan `state.json`** (5/11 keys, frozen 2026-06-22) + freshness alarm. *(A, S)*
- **G-2 · Reconcile fleet counts** (62 = 22 ROS + 40 Arbor) across harness doc + operating plan. *(A, S)*
- **G-3 · Rotate the plaintext z.ai key** — hygiene at convenience, NOT urgent. *(C, S)*

### [2026-06-28] Central Backlog + Night Knowledge Management
Source: Guy reported that ROS is inefficient, lacks a night knowledge-management operation for saving today's activity into memory, and Claude/Hermes have synchronization issues. Decision: centralize these as one company-level backlog stream here instead of scattering them across chat memory, hidden runtime state, or per-agent notes.

**CB — Central Backlog / Knowledge Operations**
- **CB-1 · Make `CoS/ROS-BACKLOG.md` the single backlog intake for ROS operating-system work** — all cross-agent efficiency, sync, memory, automation, and runtime improvement items land here first; domain/project backlogs may exist only for domain execution detail and should link back when work affects ROS-the-company. *(A, S)*
- **CB-2 · Night knowledge-management operation** — implement as a ponytail-style efficient closeout: one script gathers git/session/backlog deltas once, then one LLM pass emits only memory candidates, archive candidates, backlog deltas, and unresolved decisions; start read-only/reporting before enabling writes. *(C, M)*
- **CB-3 · Memory write-back guardrail** — require each proposed memory save to name source evidence, target file (`MEMORY.md`, domain `MEMORY.md`, archive, or project note), freshness horizon, and whether it is fact vs instruction. *(A, S)*
- **CB-4 · Claude/Hermes synchronization preflight** — before memory/backlog writes, check git status, branch, ahead/behind, dirty files, and active cross-agent handoff notes; never hide sync conflicts in chat-only state. *(A, S)*
- **CB-5 · Backlog triage cadence** — add a CoS review lane that promotes only approved backlog items into Notion/My Tasks or domain execution plans, avoiding duplicate task systems. *(B, S)*
- **CB-6 · Night-op audit trail** — log each night run's source window, files read, memory/backlog changes proposed or made, git outcome, and blockers so Claude and Hermes can resume from the same evidence. *(A, M)*

**Efficiency constraint (ponytail/full)**
- Reuse this backlog; no new doctrine file unless the run needs more than this section.
- Prefer deterministic collection code over agent browsing: one shell/Python collector, one compact JSON/Markdown report, one LLM decision pass.
- Inputs are deltas only: today's git commits/status, changed files, cron outputs, session-search hits, and existing backlog lines.
- Output caps: max 5 memory candidates, max 5 backlog deltas, max 5 open decisions, plus blockers; omit empty sections.
- Floors not cut: evidence paths, sync safety, secret handling, and validation.

**Immediate next cut**
1. Write the night-op prompt/runbook against this backlog item, not as a hidden cron-only behavior.
2. Run it manually once in read-only mode to produce proposed memory/backlog deltas.
3. Only after the manual run is useful, schedule it as a Hermes cron with explicit owner, delivery, and write boundary.

### [2026-06-29] Centralized ROS Code Optimization Backlog v3
Source: Guy asked to go over the entire ROS codebase and centralize code optimization work using ponytail/code-efficiency discipline. Detailed backlog: `CoS/backlogs/ros-code-optimization-backlog-v3-2026-06-29.md`.

**RCO3 — Code Optimization**
- **RCO3-01 · Generated/build artifact separation** — separate source from generated/cache/build outputs before optimizing or deleting. *(C, S)*
- **RCO3-02 · Arbor source-of-truth deduplication** — name one authoritative Arbor app tree before editing or removing mirrors. *(C, S)*
- **RCO3-03 · TypeScript hotspot decomposition** — split only stable seams in the largest Arbor modules. *(B, M)*
- **RCO3-04 · Type-safety tightening without rewrite** — reduce high-risk `any` at API/AI/billing/storage boundaries first. *(A/B, M)*
- **RCO3-05 · Test/build command normalization** — define cheap verification ladders for each code surface. *(A, S)*
- **RCO3-06 · TODO/noise triage** — separate generated/vendor TODO noise from actionable source TODOs. *(A, S)*
- **RCO3-07 · Python utility hardening** — add dry-run/input-validation conventions to Notion/import scripts. *(A, S)*
- **RCO3-08 · Secret and local-env hygiene** — verify secret files are ignored/untracked and rotate anything exposed. *(C, S)*
- **RCO3-09 · Agent worktree hygiene** — add active-worktree cleanup/expiry rules. *(C, S)*
- **RCO3-10 · Graph/output regeneration boundary** — decide committed graph artifacts vs regenerable cache. *(A, S)*

**Execution order:** RCO3-08 → RCO3-01/02 → RCO3-05 → RCO3-03/04 → RCO3-06/09/10 → RCO3-07.

## Done / shipped

- **[2026-06-27] ROS Knowledge Architecture (OKF)** — multi-agent; OKF spec+frontmatter, linter-as-hook (0 hard violations), shared `.mcp.json`, ponytail→de-slop, Obsidian graph+8 indexes; PAI v1.0. Committed `a095886`, pushed. Report: `reports/ros-best-shape-2026-06-27.md`.
- **[2026-06-27] Disk optimization** — ~7 GB freed (19→26 GB), 14 Arbor worktrees removed (67 branches preserved), node_modules purged.
- **[2026-06-27] Arbor repo** — GitHub renamed `PPPPtherapy-`→`Arbor`, local remote updated; repo recovered from a partial-move split (nothing lost); concurrent WIP preserved (`cd9a4d2`); **prod verified at latest `d69e467`, live + functional**.

- **[2026-06-27] Arbor folder flatten — DONE ✅** (Guy ran it once the lock cleared): single clean repo at **`ROS/Arbor`** (67 branches, latest `main`, remote→`Arbor`); stale wrapper + husk removed; `launch.json` repointed.

### Still open — retire the stale `.workspace` clone (K-1b)
`.workspace/PPPPtherapy-` is a separate 25-day-old clone (`feat/arbor-next`, 2026-06-02, old remote name, 5 branches, 0 uncommitted) that a Codex session mistook for its repo — its real edits are safe in `ROS/Arbor` (`cd9a4d2`). **Action:** point the Codex session at `ROS/Arbor`, then remove `.workspace/PPPPtherapy-` + `.workspace/arbor-export` + `.workspace/arbor_audit.txt`. Low-risk (gitignored, stale, nothing uncommitted) but do it with that session closed.
