# ROS Markdown Instruction Principles
Version: 1.0
Last updated: 2026-05-13

---

## Purpose

This file defines the quality standards and structural rules for all CLAUDE.md instruction files across ROS. Every plugin and agent CLAUDE.md must conform to these principles. Inconsistent instruction files cause inconsistent behavior — this is the style guide for the instruction layer.

---

## Core rules

### 1. One rule, one file

No rule appears in more than one CLAUDE.md. If a rule belongs in the root CLAUDE.md, it is not repeated in any plugin CLAUDE.md. If a rule belongs in a plugin CLAUDE.md, it is not in the root. Duplication creates drift — when one copy is updated, the other becomes stale.

### 2. Token discipline

| File | Max lines | Purpose |
|---|---|---|
| Root CLAUDE.md | 100 lines | Identity, routing, session protocol, safety levels |
| Plugin CLAUDE.md | 200 lines | Role definition, commands, connectors, memory pointers |
| Agent skill files | 150 lines | Single skill or command specification |
| MEMORY.md files | 80 lines | State only — facts, not instructions |

If a file exceeds its limit, split or defer content. Instructions that are not loaded are not useful — but instructions that bloat the context are actively harmful.

### 3. Instruction language

Write instructions as direct commands, not as descriptions or suggestions.

**Do**: `Read MEMORY.md before responding.`
**Don't**: `Claude should probably read MEMORY.md at the start of a session.`

**Do**: `Draft emails. Never send without user confirmation.`
**Don't**: `It would be good to draft emails first before sending.`

Passive voice, hedged language, and conditional phrasing weaken instruction adherence.

### 4. Imperative headers

Section headers must describe what Claude does, not what the section contains.

**Do**: `## On session start` / `## When drafting emails` / `## Before sending`
**Don't**: `## Session initialization` / `## Email drafting guidelines` / `## Sending behavior`

The "On X" / "When X" / "Before X" / "After X" format makes it easier for Claude to match a trigger to an instruction block.

### 5. Table-first for routing and mappings

Routing rules, command lists, connector maps, and memory paths must use tables, not prose. Tables are scanned more reliably than paragraphs.

**Do**:
```
| Trigger | Action |
|---|---|
| "analyze deal" | Run /hv.analyze-deal |
```

**Don't**: "When the user says something like analyze deal or similar, Claude should run the hv analyze-deal command..."

### 6. Explicit file paths

Never refer to files by relative or ambiguous names. Always use the full path from the ROS root.

**Do**: `Read /00_System/routing.md`
**Don't**: `Read the routing file` / `See routing.md`

Paths are always written as forward-slash Unix-style paths from the project root (Hollandvest/).

### 7. Safety levels must be stated at command level

Every command that takes an action with external effect must state its safety level. Do not rely on a general "be careful" instruction.

```
## /hv.send-offer
Safety level: 3 — requires user confirmation before executing
```

### 8. MEMORY.md is state, not instructions

MEMORY.md files store facts Claude has learned (decisions, preferences, active projects, contacts). They do not store behavioral rules. Rules go in CLAUDE.md. Facts go in MEMORY.md.

**In MEMORY.md**: "Groenewegje renovation budget confirmed at €45,000."
**In CLAUDE.md**: "Before quoting renovation budgets, check HV/MEMORY.md."

---

## CLAUDE.md file structure (plugin template)

Every plugin CLAUDE.md must follow this order:

```markdown
# [Plugin Name] — [Role title]
Version: [X.Y]
Last updated: [YYYY-MM-DD]

## Role
[1-2 sentences. What this agent does and does not do.]

## On session start
[3-5 file reads. Always ends with reading this plugin's MEMORY.md.]

## Commands
[Table of /commands with description and safety level.]

## Connectors
[Table of connected MCPs, their purpose, and fallback if unavailable.]

## Memory
[Path to MEMORY.md. What kinds of facts are stored there.]

## Output rules
[Format rules for this agent's outputs — template names, file paths, workbook rules.]

## Boundaries
[What this agent does NOT handle — explicit handoff rules to other agents.]
```

---

## Versioning

Every CLAUDE.md and policy file carries a version number (`Version: X.Y`) and a `Last updated` date. When a file is edited:
- Increment minor version (1.0 → 1.1) for additions or clarifications
- Increment major version (1.x → 2.0) for structural changes or rule reversals
- Update `Last updated` date

MEMORY.md files are not versioned — they are living state documents.

---

## Anti-patterns to avoid

| Anti-pattern | Problem | Fix |
|---|---|---|
| "Claude should try to..." | Weak instruction | Use imperative: "Do X." |
| Duplicating root rules in plugin files | Creates drift | Reference root file instead |
| Prose routing rules | Unreliable matching | Use routing matrix table |
| Undated files | Can't tell if stale | Always include Last updated |
| Instructions longer than 200 lines | Context bloat | Split into skill files |
| MEMORY.md with behavioral rules | Wrong layer | Move rules to CLAUDE.md |
| Ambiguous file path references | Wrong file loaded | Always use full path from root |
