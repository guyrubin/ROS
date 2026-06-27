---
type: policy
title: ROS Markdown Instruction Principles
description: Standards for writing instruction and memory markdown files in ROS.
---

# ROS Markdown Instruction Principles
Version: 1.3
Last updated: 2026-06-27

## Purpose

This file defines the quality standards and structural rules for ROS instruction files. `CLAUDE.md` remains the current instruction filename for compatibility, but the content should be model-agnostic unless a rule is explicitly runtime-specific.

## Core Rules

### 1. One rule, one file

No rule appears in more than one instruction file. If a rule belongs in `/AGENTS.md`, root `/CLAUDE.md`, or `/00_System/*.md`, do not repeat it in a domain `CLAUDE.md`. Reference the source file instead.

### 2. Token discipline

This is the **single source of truth for file size ceilings**. Other files (`/CLAUDE.md`, `memory-archive-policy.md`, `ros-hygiene-runbook.md`) reference these numbers and must not restate them.

| File | Max lines | Purpose |
|---|---:|---|
| Root `CLAUDE.md` | 100 | Identity, routing, session protocol, safety levels |
| Domain `CLAUDE.md` | 150 | Role, commands, connectors, memory pointers |
| Root `MEMORY.md` | 100 | Active cross-domain state only |
| Domain `MEMORY.md` | 150 | Active domain state only |
| Project `MEMORY.md` | 150 | Active project state only |
| Skill or runbook file | 150 | Single repeatable procedure or command spec |

If a file exceeds its limit, split, defer, or archive content — do not raise the ceiling. Instructions that are not loaded are not useful; instructions that bloat context are actively harmful.

### 3. Instruction language

Write instructions as direct commands, not descriptions or suggestions.

**Do:** `Read /MEMORY.md before responding.`

**Don't:** `The agent should probably read MEMORY.md at the start of a session.`

**Do:** `Draft emails. Never send without user confirmation.`

**Don't:** `It would be good to draft emails first before sending.`

### 4. Imperative headers

Section headers must describe what the agent does, not what the section contains.

**Do:** `## On Session Start`, `## When Drafting Emails`, `## Before Sending`

**Don't:** `## Session Initialization`, `## Email Drafting Guidelines`, `## Sending Behavior`

The "On X" / "When X" / "Before X" / "After X" format helps any agent match a trigger to an instruction block.

### 5. Table-first mappings

Routing rules, command lists, connector maps, and memory paths must use tables instead of prose.

```markdown
| Trigger | Action |
|---|---|
| analyze deal | Run `/hv.analyze-deal` |
```

### 6. Explicit file paths

Use full paths from the ROS root in durable docs.

**Do:** `Read /00_System/routing.md`

**Don't:** `Read the routing file`

Durable docs should use forward-slash ROS-root paths. Use runtime-specific absolute paths only when documenting runtime access.

### 7. Safety levels at command level

Every command that takes an external action must state its safety level. Do not rely on a general "be careful" instruction.

```markdown
## /hv.send-offer
Safety level: 3 - requires user confirmation before executing
```

### 8. MEMORY.md is state, not instructions

`MEMORY.md` files store facts agents have learned: decisions, preferences, active projects, contacts, and current status. They do not store behavioral rules.

**In memory:** `2026-05-24 - Badhuiskade 217 remains the primary HV target pending DD.`

**In instruction files:** `Before quoting renovation budgets, check /HV/MEMORY.md.`

## Minimalism ladder (adapted from ponytail)

ROS has no separate `/de-slop` file on disk; this is the canonical home for the minimalism doctrine. Source: ponytail (DietrichGebert/ponytail), adapted from a code/YAGNI minimalism skill into this markdown+git PKM context.

Before adding anything (a note, a file, a section, a line, a skill, a route), climb the ladder top-down and stop at the first rung that satisfies the need. YAGNI first: the cheapest artifact that is correct wins.

| Rung | Ask | Default |
|---:|---|---|
| 1 | Does it need to exist at all? | Prefer not creating it. |
| 2 | Can an existing note, skill, or route serve? | Reuse before new. |
| 3 | Can it be one memory line? | One line in `MEMORY.md` before a paragraph. |
| 4 | Can it reference instead of restate? | Link the source file before restating its content. |
| 5 | Can it extend existing structure? | Add to an existing file/section before a new file. |
| 6 | How few lines does it take? | Minimal lines; cut filler. |
| 7 | What is the bare minimum that works? | Ship that; defer the rest. |

### Intensity dial

Pick a setting per task; default to `lite` for routine PKM work.

| Setting | Use when | Effect |
|---|---|---|
| `lite` | Routine edits, additions | Apply rungs 3–7; light touch. |
| `full` | New docs, restructures | Apply all 7 rungs deliberately. |
| `ultra` | Bloat audits, consolidation | Aggressively collapse, merge, archive; justify every retained line. |

### Floors (never cut for brevity)

Minimalism trims words and artifacts, never correctness. These are non-negotiable regardless of intensity:

- **Accuracy** — every retained fact stays true and current.
- **Security** — never drop a safety gate, secret-handling rule, or confirmation step to save lines.
- **Validation** — keep the checks that prove a change is correct.
- **Accessibility** — preserve structure (headers, tables, paths) that keeps docs navigable.
- **Full comprehension before acting** — read and understand the source completely before trimming or editing it.

## Domain CLAUDE.md Structure

Every domain `CLAUDE.md` must follow this order:

```markdown
# [Domain] - [Role title]
Version: [X.Y]
Last updated: [YYYY-MM-DD]

## Role
[1-2 sentences. What this domain does and does not do.]

## On Session Start
[3-6 file reads. Always ends with this domain's MEMORY.md.]

## Commands
[Table of commands with description and safety level.]

## Connectors
[Table of connected tools, their purpose, and fallback if unavailable.]

## Memory
[Path to MEMORY.md. What kinds of facts are stored there.]

## Output Rules
[Format rules for this domain's outputs.]

## Boundaries
[What this domain does not handle and where to hand off.]
```

## Versioning

Every instruction and policy file carries a version number (`Version: X.Y`) and a `Last updated` date.

- Increment minor version for additions or clarifications.
- Increment major version for structural changes or rule reversals.
- Update `Last updated` on every edit.

`MEMORY.md` files are living state documents and do not need versions.

## Anti-patterns

| Anti-pattern | Problem | Fix |
|---|---|---|
| "The agent should try to..." | Weak instruction | Use imperative: "Do X." |
| Duplicating root rules in domain files | Creates drift | Reference the root/system file. |
| Prose routing rules | Unreliable matching | Use routing matrix tables. |
| Undated instruction files | Staleness is unclear | Add `Last updated`. |
| Instructions longer than limits | Context bloat | Split into system docs, skills, or runbooks. |
| `MEMORY.md` with behavioral rules | Wrong layer | Move rules to instruction files. |
| Ambiguous paths | Wrong file may be loaded | Use ROS-root paths. |
| Vendor-specific universal rules | Breaks LLM portability | Scope them to the runtime or connector. |
