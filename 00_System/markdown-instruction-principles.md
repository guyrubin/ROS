# ROS Markdown Instruction Principles
Version: 1.1
Last updated: 2026-05-24

## Purpose

This file defines the quality standards and structural rules for ROS instruction files. `CLAUDE.md` remains the current instruction filename for compatibility, but the content should be model-agnostic unless a rule is explicitly runtime-specific.

## Core Rules

### 1. One rule, one file

No rule appears in more than one instruction file. If a rule belongs in `/AGENTS.md`, root `/CLAUDE.md`, or `/00_System/*.md`, do not repeat it in a domain `CLAUDE.md`. Reference the source file instead.

### 2. Token discipline

| File | Max lines | Purpose |
|---|---:|---|
| Root `CLAUDE.md` | 100 | Identity, routing, session protocol, safety levels |
| Domain `CLAUDE.md` | 200 | Role definition, commands, connectors, memory pointers |
| Skill or runbook file | 150 | Single repeatable procedure or command specification |
| `MEMORY.md` files | 80 | State only: facts, not instructions |

If a file exceeds its limit, split or defer content. Instructions that are not loaded are not useful; instructions that bloat context are actively harmful.

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
