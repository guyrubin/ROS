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

## Done / shipped

_(rolling log)_
