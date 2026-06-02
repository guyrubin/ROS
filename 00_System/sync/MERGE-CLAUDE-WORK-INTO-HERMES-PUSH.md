# Merge plan â€” Claude/Cowork's pending work into Hermes's pushed state
# SUPERSEDED - old merge plan, do not execute

This file is retained only as historical context for the 2026-05-19 reconciliation.
It describes an obsolete WSL-canonical layout where `~/ROS` was primary and the Windows path pointed into WSL.

The current ROS contract is the opposite:

- Canonical Windows tree: `C:\Users\dguyr\ROS`
- Hermes/WSL path: `/home/guyru/ROS`
- Required symlink: `/home/guyru/ROS -> /mnt/c/Users/dguyr/ROS`

For the current repair procedure, use:

- `/00_System/sync/current-path-contract.md`
- `/00_System/sync/repair-wsl-ros-path.sh`

---


**Context:** On 2026-05-19, Hermes pushed commit `a4dbcfd [hermes] CoS: implement ROS AI OS hygiene layer` to `github.com/guyrubin/ROS` â€” establishing the AI-OS doctrine layer, archive policy, hygiene runbook, and session-audit protocol. In parallel, Claude/Cowork wrote a multi-agent sync architecture in the **Windows-mounted** copy at `C:\Users\dguyr\ROS` that was never committed. The two views have forked.

This document is the one-time reconciliation. After this, `~/ROS` (WSL) is canonical and `C:\Users\dguyr\ROS` is a symlink to it (per runbook Â§A.1).


## What each side contributed

| Hermes (pushed) | Claude (Cowork-mounted, uncommitted) |
|---|---|
| `AGENTS.md` (42 lines â€” cross-agent contract, AI-OS doctrine pointer) | `AGENTS.md` (~91 lines â€” multi-agent substrate, sync stages, journal pattern, identity, projections) |
| `00_System/ai-os-principles.md` | â€” |
| `00_System/memory-archive-policy.md` | â€” |
| `00_System/ros-hygiene-runbook.md` | â€” |
| `00_System/session-audit.md` | `00_System/sync/hermes-plugin/skills/session-audit/SKILL.md` (Hermes plugin variant) |
| `archive.md` + `<DOMAIN>/archive.md` Ã— 7 | â€” |
| Cleaned `CLAUDE.md` (91 lines, AGENTS-first boot) | `CLAUDE.md` v1.4 (referenced AGENTS.md + HERMES.md, sync layer link) |
| Cleaned `MEMORY.md` (44 lines, facts only) | `MEMORY.md` (with shared-by-Claude-and-Hermes header + sync layer journal entries) |
| Domain `CLAUDE.md` updates (Notion no longer blocked, KK identity policy, HV factual rephrasing) | â€” |
| `CoS/projects/notion-second-brain/README.md` (new) | â€” |
| `CoS/projects/notion-command-center-update/README.md` (new) | â€” |
| Updated `00_System/connectors.md` (Notion verified) | â€” |
| Updated `00_System/agent-capabilities.md` | â€” |
| â€” | `HERMES.md` (Hermes bootstrap shim) |
| â€” | `00_System/sync/HLD.md` (multi-agent shared-memory HLD) |
| â€” | `00_System/sync/ADR-001-github-as-spine.md` |
| â€” | `00_System/sync/ADR-002-shared-working-tree.md` |
| â€” | `00_System/sync/ADR-003-memory-journal-and-identity.md` |
| â€” | `00_System/sync/runbook.md` (one-time + daily ops) |
| â€” | `00_System/sync/skill-sync.md` (portable `/sync` skill) |
| â€” | `00_System/sync/scripts/sync-{pull,push,unstick}.sh` |
| â€” | `00_System/sync/scripts/notion-sync.py` (operational artifact upsert) |
| â€” | `00_System/sync/scripts/notion-mirror.py.deprecated` |
| â€” | `00_System/sync/scripts/drive-{mirror,register}.py` |
| â€” | `00_System/sync/hermes-plugin/*` (rubin-os plugin: 4 tools, 3 hooks, 5 slash commands, install.sh, 2 skills) |
| â€” | `00_System/sync/hermes-config.yaml` + `hermes.env.example` |
| â€” | `00_System/sync/github-action-projection.yml` |
| â€” | `00_System/sync/notion-obsidian-boundary.md` |
| â€” | `00_System/files-index.json` |

## Conflict resolution

| File | Resolution |
|---|---|
| `AGENTS.md` | **Hermes's 42-line version is canonical.** It correctly establishes the AGENTS-first contract and points at the AI-OS doctrine. Claude's longer version contained too much implementation detail that belongs in `00_System/sync/`. After the merge, append a single line to AGENTS.md pointing at `00_System/sync/HLD.md` as the multi-agent implementation reference. |
| `CLAUDE.md` | **Keep Hermes's 91-line cleaned version.** It already loads AGENTS.md first and respects the line-count budget. No re-addition of HERMES.md sibling is needed â€” HERMES.md is referenced from AGENTS.md after the append above. |
| `MEMORY.md` | **Keep Hermes's 44-line cleaned version.** The journal entries Claude added (sync layer status, design completion) belong in the new dedicated location â€” append them to a new section in `CoS/MEMORY.md` under "Active projects â†’ Multi-agent shared memory" instead. |
| `00_System/session-audit.md` vs `00_System/sync/hermes-plugin/skills/session-audit/SKILL.md` | **Keep both.** Hermes's `session-audit.md` is the **protocol** (what gets decided where). Claude's plugin SKILL.md is the **runtime invocation** for Hermes Agent's slash command. They reference each other. |
| Everything else | **Additive â€” Claude's `HERMES.md` + entire `00_System/sync/` tree + `files-index.json` come over wholesale.** No conflict because Hermes didn't touch those paths. |

## Why this split makes sense

- **AGENTS.md + ai-os-principles + memory-archive-policy + hygiene-runbook + session-audit.md** (Hermes's layer) = the **operating philosophy** of the AI OS: what files exist for, how to keep memory hygienic, when to archive, what a session ends with.
- **00_System/sync/** (Claude's layer) = the **multi-agent implementation**: how Claude and Hermes coordinate on disk, in git, and across MCP servers; the journal pattern, the per-agent identity, the projections to Notion and Drive, the Hermes plugin that makes Hermes a peer of Claude.

The philosophy layer lives at `00_System/`. The implementation layer lives at `00_System/sync/`. They reference each other but don't duplicate.
