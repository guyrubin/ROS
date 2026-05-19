# ROS AI Operating System Principles

**Created:** 2026-05-20
**Owner:** CoS

This file translates the AI-second-brain principles into ROS operating rules.

## 1. Markdown is the substrate

ROS is a normal Markdown filesystem first. Obsidian, Claude, Hermes, Notion, and other tools are interfaces over it.

- Markdown files hold durable knowledge.
- GitHub provides history and off-machine audit.
- Obsidian is the human-friendly editor/lens.
- Agents are operators that read, write, route, and maintain the vault.

## 2. Root files stay lean

Root files are loaded often. They must contain only universal instructions, routing, and active cross-domain memory.

Targets:

- `CLAUDE.md`: under 100 lines.
- Root `MEMORY.md`: under 100 lines.
- Domain `CLAUDE.md`: under 120 lines unless the domain has a specific reason.
- Domain `MEMORY.md`: active facts only; archive stale history.

When a root file grows, move specific detail into a referenced file instead of raising the ceiling.

## 3. Instructions and memory are separate

Use this test:

- If it tells an agent how to behave, it is instruction.
- If it records what is true, current, historical, or decided, it is memory.

Instruction locations:

- `CLAUDE.md`
- `AGENTS.md`
- domain `CLAUDE.md`
- `00_System/*.md`
- Hermes skills

Memory locations:

- `MEMORY.md`
- domain `MEMORY.md`
- project `MEMORY.md`
- `archive.md` files for historical material

## 4. Route before loading

Agents should not load the whole vault. Start at root, consult routing, then load only the owning domain and relevant project files.

Root memory should know a project exists; project memory should hold the details.

## 5. Workstations vs skills

- Domain/workstation = a place where ongoing work happens and context accumulates.
- Skill = a repeatable process that should run the same way each time.

ROS domains are workstations: `CoS`, `KK`, `HV`, `EA`, `PAI`, `MKT`, `FIN`.

Repeatable procedures should become Hermes skills or documented runbooks, not long root instructions.

## 6. Active memory vs archive

`MEMORY.md` is the whiteboard. `archive.md` is the filing cabinet.

Keep current facts, active projects, and key decisions in memory. Move completed, stale, or verbose history to archive.

See `00_System/memory-archive-policy.md`.

## 7. Operate and optimize continuously

ROS should have recurring loops:

- Daily/weekly operator briefs that ingest new context.
- Weekly hygiene checks for bloat, duplicates, stale files, broken links, and misplaced rules.
- Git sync verification after meaningful workspace changes.

See `00_System/ros-hygiene-runbook.md` and `00_System/session-audit.md`.
