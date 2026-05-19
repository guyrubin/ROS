# AGENTS.md — Rubin OS Cross-Agent Contract

**Version:** 1.1
**Last updated:** 2026-05-20

Rubin OS (ROS) is a Markdown-first AI operating system shared by Claude/Cowork, Hermes, and future agents.

## Canonical workspace

- Windows/Claude path: `C:\Users\dguyr\ROS`
- WSL/Hermes path: `/home/guyru/ROS`
- `/home/guyru/ROS` is a symlink to `/mnt/c/Users/dguyr/ROS`.
- GitHub source of truth and audit log: `https://github.com/guyrubin/ROS`.

All agents must operate on this single working tree. Do not create divergent ROS copies.

## Boot sequence

1. Read `CLAUDE.md`.
2. Read `MEMORY.md`.
3. Read `00_System/routing.md`.
4. Route the request to the right domain.
5. Load only that domain's `CLAUDE.md` and `MEMORY.md`.
6. Load deeper project/resource files only when needed.

## Write model

- Durable facts and decisions live in Markdown.
- Operational dashboards/state may live in Notion.
- Binaries and sensitive personal files stay outside Git unless explicitly approved.
- GitHub records committed ROS state.

## Instruction vs memory rule

- Prescriptive behavior (`always`, `never`, `before doing X`) belongs in `CLAUDE.md`, `AGENTS.md`, system docs, or skills.
- Facts/status/context belongs in `MEMORY.md`, domain memory, or project memory.

## Agent identity

- Claude/Cowork commits as `claude-cowork <claude-cowork@rubin-os.local>`.
- Hermes commits as `hermes-agent <hermes@rubin-os.local>`.
- Commit messages begin with `[claude]` or `[hermes]`.
