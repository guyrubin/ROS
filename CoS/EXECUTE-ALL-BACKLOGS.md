# EXECUTE-ALL — the standing goal to drain every product backlog

**Version:** 1.0 · **Created:** 2026-06-22 · **Owner:** CoS (group HQ) · **CEO/approver:** Guy
**Model:** [daily-execution-mechanism.md](../00_System/daily-execution-mechanism.md) · ships via [release-engineering/](../00_System/release-engineering/README.md) · scoped by [companies.md](../00_System/companies.md)

**The goal:** drive the **three canonical product backlogs to done** — continuously, coordinated, safely — using the machine already built. Guy's chosen mode (2026-06-22): **one catch-up wave now, then the daily epic-approval rhythm.** Scope = **Arbor Product (`AP-`) · Arbor Marketing (`AM-`) · ROS (`ROS-`)**. Domain meshes (HV/EA/KK/FIN/Career) are out of scope (they ship deliverables, not code).

## How each backlog executes (the lanes)

| Backlog | Builder | Path to done |
| :-- | :-- | :-- |
| **Arbor Product** `AP-` | `arbor-orchestrator` + the domain pods | build wave → full green-gate → **release pipeline auto-canary→smoke→promote** → prod |
| **Arbor Marketing** `AM-` | `arbor-marketing-lead` + pods | build to brand spine → ECD + safety gate → publish to owned surfaces (Firebase deploy) |
| **ROS** `ROS-` | `ros-evaluator` + CoS | doc/agent/dashboard/config edits → committed (no deploy) |

All three flow through the **daily epic-approval mechanism**: `ros-daily-plan` (07:00 wkdays) assembles the cross-backlog plan → Guy approves the day's epics → execute → **Tier-A safe items auto-ship; Tier-C surfaces individually.**

## The catch-up wave — READY + SAFE queue (2026-06-22, from the 3-agent pass)

> All `riskClass: safe`, shippable now. Sequenced. Gated (Tier-C) items listed separately for Guy. The READY+SAFE queue itself is **owned by each canonical backlog** — read the ranked items there, not here, so this file can't drift:

- **Arbor Product (`AP-`):** [mesh/PRODUCT-BACKLOG.md](../PAI/projects/parenting-os-plugin/mesh/PRODUCT-BACKLOG.md) → "Wave PM-CU-2026-06-22".
- **Arbor Marketing (`AM-`):** [MARKETING-BACKLOG.md](../PAI/projects/parenting-os-plugin/mesh/marketing/MARKETING-BACKLOG.md).
- **ROS (`ROS-`):** [ROS-BACKLOG.md](ROS-BACKLOG.md).

## Tier-C — Guy-gated (never auto; surfaced, not executed)
- **Product:** AP-025 AI cost ceiling (cost) · AP-028 /vision consent (COPPA) · AP-003 re-engagement child-data egress · AP-008 0–2 age bucketing (clinical-peds) · AP-011/AP-012 clinical copy · CLM-004/005 claim flips.
- **Marketing:** all paid spend (creator/Meta/TikTok ~€800–3,600) · outbound-to-people (creator DMs, group seeding, native-HE reviewer) · ₪ pricing publish · referral grant (billing) · social-channel creation (NOW-12).
- **ROS:** N2 + E1/E3/G1 live crons · F-DRIFT-3 Notion write · Q3 OKRs · OPS-C1 WIF · J2/J3/J4 Drive grants.
- **Email:** the `support@arborparentingapp.com` Workspace admin steps + (if I can't reach the GoDaddy key) the DNS.

## Constraints that shape execution (hard reality)
- **Code ships from the main session / CI, not subagents** — subagents are denied `git`/`npm` (the documented hands-off-build gap). So `AP-` code waves are built by a git/npm-capable session + ride the auto-pipeline.
- **`main`'s green-gate must be GREEN** before a train ships — a few `AP-` items (AP-024/026/025) exist *because* `main` currently has tsc/test red from multi-session entanglement; clearing that red is the first sub-wave.
- **The merge-lane serializes** — one integrator merges/promotes at a time; building is parallel. Stops the duplication that bit us twice today.
- **Auto-deploy is proven** — merged safe code reaches prod via canary→smoke→auto-promote, verified by `gcloud`.

## Status
- Backlogs reconciled + ready-queues assembled (3-agent pass, 2026-06-22). Shipped today: REL-ARBOR-001, AP-005, the entitlement revenue-fix.
- Catch-up wave = in motion via `arbor-orchestrator` (Product) + marketing loop (Marketing) + CoS (ROS), coordinated through the lane + auto-pipeline.
- Daily rhythm live: `ros-daily-plan` 07:00 weekdays.
