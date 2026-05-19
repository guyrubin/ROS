# ROS Session Audit Protocol

**Created:** 2026-05-20
**Owner:** CoS

Run at the end of meaningful ROS work or when the user asks for wrap-up.

## Purpose

Capture durable context without bloating root memory.

## Steps

1. Identify what changed: files, decisions, active projects, workflows.
2. Decide whether each item is instruction, memory, project note, archive, or external state.
3. Update only the smallest correct file.
4. If memory grows too much, compress and archive instead of appending indefinitely.
5. Check for sensitive files before staging.
6. Commit and push relevant safe ROS changes when appropriate.

## Decision table

| Item type | Destination |
|---|---|
| Universal agent behavior | `CLAUDE.md`, `AGENTS.md`, or `00_System/*.md` |
| Domain-specific behavior | `<domain>/CLAUDE.md` |
| Stable/current fact | nearest `MEMORY.md` |
| Project-specific detail | project README/MEMORY |
| Historical/completed detail | nearest `archive.md` |
| Repeatable procedure | Hermes skill or runbook |
| Binary/sensitive file | local-only or Drive registry |
| Operational task/database state | Notion |

## Output

Produce a short audit note:

```markdown
## Session audit — YYYY-MM-DD
- Durable decisions:
- Files updated:
- Memory/archive updates:
- Git status:
- Follow-ups:
```
