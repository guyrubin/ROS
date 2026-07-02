---
type: runbook
title: ROS Capability Optimization Runbook
description: Procedure for tuning and optimizing agent capabilities across ROS.
---

# ROS Capability Optimization Runbook
Version: 1.0
Last updated: 2026-06-27

## Purpose

Use this runbook to turn ROS capabilities into repeatable, measured workflows across the four-layer ROS model. `/00_System/agent-capabilities.md` defines what agents can do. This file defines how agents improve those capabilities without bloating root context or mixing layers.

## When To Use

| Trigger | Action |
|---|---|
| Guy asks to enhance ROS capabilities | Run this optimization loop before editing system docs. |
| A domain workflow repeats three times | Promote it into a template, runbook, skill, or automation. |
| A capability depends on external facts, visual evidence, documents, or web apps | Add source, freshness, and verification gates. |
| A domain accumulates operational tasks in Markdown memory | Move live state to Notion or a Markdown import pack. |
| An agent produces useful runtime state | Promote it using `/00_System/agent-filesystem-contract.md`. |

## Optimization Loop

Run capability improvement as a closed loop:

```text
SENSE -> FRAME -> DESIGN -> EXECUTE -> JUDGE -> PROMOTE -> AUDIT
```

| Step | What agents do | Output layer |
|---|---|---|
| SENSE | Inspect files, connector state, user need, and existing workflows. **Start at the ROS-level system map** (the in-app **MAP** view in `CoS/projects/ros-interface-v4` `/map` — interactive Graphify graph of runtimes·agents·skills; static source archived at `CoS/projects/_retired/ros-multi-agent-map.html` — plus `layer-model.md`, this runbook, `okf-spec.md`, the `.claude/` harness) **before judging any domain — domains inherit the shared layer, so "not in the domain folder" ≠ "missing."** | Layer 4 reasoning |
| FRAME | Name the capability, owner domain, safety level, and expected result. | Layer 1 knowledge |
| DESIGN | Choose the lightest durable shape: checklist, template, runbook, skill, or automation. | Layer 1 knowledge |
| EXECUTE | Use tools, connectors, browser, scripts, or docs to complete the work. | Layer 3 execution |
| JUDGE | Verify evidence, tests, freshness, safety, and layer placement. | Layer 4 reasoning |
| PROMOTE | Write durable facts, decisions, templates, or operational imports to the correct place. | Layers 1 or 2 |
| AUDIT | Run `/00_System/session-audit.md` after meaningful ROS changes. | Layer 1 knowledge |

## Capability Maturity Levels

| Level | Name | Definition | Promotion test |
|---:|---|---|---|
| 0 | Ad hoc | One-off agent behavior with no durable pattern. | Keep ephemeral unless useful again. |
| 1 | Cataloged | Capability is named in `/00_System/agent-capabilities.md` or a domain file. | Agents know it exists. |
| 2 | Repeatable | Capability has a checklist, template, or command pattern. | Another agent can reproduce it. |
| 3 | Gated | Capability has safety, source, freshness, and verification checks. | Bad outputs are caught before use. |
| 4 | Measured | Capability records quality, time, cost, coverage, or failure signals. | Improvement can be compared over time. |
| 5 | Delegated | Safe reversible work can run by automation; external or risky work still gates to Guy. | Human review sits only at explicit decision points. |

Default target: bring important recurring workflows to Level 3. Use Level 4 or 5 only when the workflow is frequent, high-value, and measurable.

## Layer Optimization Matrix

| ROS layer | Optimize for | Add | Avoid |
|---|---|---|---|
| Layer 1 Knowledge | Small, durable, source-grounded context | Runbooks, templates, ADRs, decision notes, memory pointers | Live task queues, duplicate rules, hidden state |
| Layer 2 Operations | Current work visibility and prioritization | Notion tasks, project dashboards, deal/client views, status fields | Long-form instructions or archival research |
| Layer 3 Execution | Safe external action | Draft-first flows, connector target checks, reversible previews, confirmations | Unconfirmed sends, purchases, deletes, or portal submissions |
| Layer 4 Reasoning | Better agent performance per session | Boot discipline, routing, tool choice, tests, critique, write-back | Durable facts trapped in chat only |

## Universal Quality Gates

Before promoting any new capability, pass these gates:

| Gate | Required check |
|---|---|
| Source | Inputs, source files, URLs, or connector targets are named. |
| Freshness | Current facts are verified when they may have changed. |
| Safety | External, financial, legal, or irreversible actions have the right confirmation level. |
| Layer fit | The output belongs in the chosen ROS layer. |
| Reproducibility | Another agent can follow the file without hidden chat context. |
| Evidence | Tests, screenshots, citations, calculations, or readback support the result when relevant. |
| Write-back | Durable findings are saved to memory, a project file, a runbook, or an archive. |

## Capability Shapes

| Need | Durable shape | Typical path |
|---|---|---|
| One decision | Decision note or ADR | `/13_Decision_Log/` or domain decision folder |
| Recurring output | Template | `/<domain>/templates/` |
| Recurring procedure | Runbook | `/00_System/` or `/<domain>/` |
| Tool-backed workflow | Skill or automation | Runtime-specific skill folder plus Markdown pointer |
| Live task tracking | Notion task/project row | Notion, or Markdown import pack if blocked |
| Historical analysis | Review note | `/CoS/reviews/` or nearest domain review folder |

## Improvement Backlog Pattern

Use this table when proposing capability upgrades:

| Priority | Capability | Current level | Target level | Owner | Next action |
|---|---|---:|---:|---|---|
| P0 | Critical safety or routing fix | 0-2 | 3 | Domain owner | Add gate or instruction. |
| P1 | High-frequency recurring work | 1-2 | 3 | Domain owner | Add template or runbook. |
| P2 | Measurable optimization | 3 | 4 | CoS + domain | Add telemetry or review cadence. |
| P3 | Automation candidate | 3-4 | 5 | CoS + runtime owner | Add reversible automation and human gate. |

## Reporting Format

When reporting an optimization pass, use:

1. Findings: current strengths, gaps, and risks.
2. Multi-layer optimization: changes by Knowledge, Operations, Execution, and Reasoning.
3. Backlog: prioritized actions with owner and next action.
4. Changes made: files edited and verification performed.
5. Next decision: the one choice Guy should make now.
