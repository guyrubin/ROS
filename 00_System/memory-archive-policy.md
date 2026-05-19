# ROS Memory and Archive Policy

**Created:** 2026-05-20
**Owner:** CoS

## Purpose

Keep loaded memory useful, short, and current while preserving historical context outside the hot path.

## Memory is the whiteboard

Use `MEMORY.md` files for:

- current priorities
- active projects
- stable facts likely to matter again
- durable decisions
- pointers to deeper files

Avoid:

- long transcripts
- completed task logs
- temporary progress notes
- duplicate project detail already stored elsewhere
- prescriptive rules that belong in `CLAUDE.md` or skills

## Archive is the filing cabinet

Use `archive.md` files for:

- completed project history
- superseded decisions
- old status logs
- verbose background that is still worth preserving
- monthly or quarterly memory consolidations

Archive files are loaded only when a user asks for historical context or when an audit needs them.

## Ceilings

- Root `MEMORY.md`: target under 100 lines.
- Domain `MEMORY.md`: target under 150 lines.
- Project memory: target under 150 lines unless the project explicitly needs more.

When a ceiling is breached, compress and archive. Do not raise the ceiling by default.

## Append format

When adding durable facts, prefer dated bullets:

```markdown
- 2026-05-20 — Decision: ROS canonical workspace is `C:\Users\dguyr\ROS`; `/home/guyru/ROS` symlinks to it for Hermes.
```

When superseding a fact, preserve audit trail:

```markdown
- ~~Old fact~~ (superseded 2026-05-20 by Hermes)
- 2026-05-20 — New fact.
```

## Misplacement test

Before writing to memory, ask:

1. Is this a durable fact/status/context? If yes, memory may be correct.
2. Is this a behavior rule? If yes, write to instruction files or a skill.
3. Is this detailed project history? If yes, write to project memory or archive.
4. Is this sensitive or binary? If yes, keep local-only or register in Drive, not Git.
