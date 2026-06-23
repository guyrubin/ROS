# ROS Agent Filesystem Contract
Version: 1.1
Last updated: 2026-06-14

## Purpose

Make ROS LLM-agnostic by treating the working tree as the context layer for every agent. Claude, Codex, Hermes, and future runtimes use the same files, routes, memory boundaries, and audit trail.

This contract is inspired by the "filesystem as context layer" pattern: agents should see normal folders and files while implementation details, runtimes, and connectors can vary behind that stable interface.

References:

- User-provided video: `https://youtu.be/w0S-khYCaB4?si=mwy8KrLVGV2dHl5P`
- Supporting article: `https://blog.box.com/filesystems-context-layer-ai-agents-powered-box`

## Invariants

| Invariant | Rule |
|---|---|
| Single tree | Use the canonical ROS workspace only. Do not create parallel agent-specific copies. |
| Files as interface | Store durable instructions, memory, references, templates, and outputs as normal files. |
| Runtime neutrality | Write instructions for "agents" unless a rule applies only to Claude, Codex, or Hermes. |
| Path portability | Use ROS-root paths like `/00_System/routing.md` in durable docs; document absolute paths only for runtime access. |
| Lazy context | Load root files, route, then load only the relevant domain/project files. |
| Versioned truth | GitHub records committed ROS state and provides audit history. |
| Human inspectability | Prefer Markdown and plain text formats that Guy can read, diff, and edit. |

## Path map

| Context | Path | Notes |
|---|---|---|
| Windows agents | `C:\Users\dguyr\ROS` | Claude/Cowork and Codex operate here. |
| WSL agents | `/home/guyru/ROS` | Symlink to `/mnt/c/Users/dguyr/ROS`; Hermes operates here. |
| Durable repo | `https://github.com/guyrubin/ROS` | Source of truth and audit log. |
| Runtime scratch | `.workspace/`, temp folders, tool caches | Local execution state; do not treat as ROS knowledge unless promoted into Markdown. |

If `/home/guyru/ROS` is not a symlink to `/mnt/c/Users/dguyr/ROS`, repair it
with `/00_System/sync/repair-wsl-ros-path.sh`. Historical WSL-canonical sync
plans under `/ros-sync-setup/` are superseded and must not be used for the
current single-tree setup.

## File roles

| File or folder | Role | Write rule |
|---|---|---|
| `/AGENTS.md` | Cross-agent contract | Universal runtime and collaboration rules only. |
| `/CLAUDE.md` | Root instruction surface | Keep because existing agents load it; write model-neutral rules where possible. |
| `/MEMORY.md` | Root current memory | Active cross-domain facts only. |
| `/00_System/*.md` | Shared policies, routing, registries, runbooks | One concern per file; avoid duplication. |
| `/<domain>/CLAUDE.md` | Domain instruction surface | Domain behavior and command rules. |
| `/<domain>/MEMORY.md` | Domain current memory | Current facts, decisions, and status. |
| `/<domain>/archive.md` | Domain history | Stale, completed, or verbose context. |
| `/<domain>/templates/` | Reusable outputs | Use for repeatable document/email/artifact shapes. |
| `/<domain>/references/` | Source material | Cite provenance and keep interpretation separate. |

## Canonical per-domain skeleton

Every domain folder conforms to one shape so navigation is predictable across runtimes.

| File / folder | Status | Role |
|---|---|---|
| `CLAUDE.md` | Required | Domain instruction surface (routing + behavior). |
| `MEMORY.md` | Required | Domain current memory (active facts/status). |
| `archive.md` | Required | Domain history (stale/completed detail). |
| `mesh/` | Required | The domain's agent mesh (lead + pods + DoD). |
| `voice.md` | Optional (standardized) | Domain voice profile when the domain writes externally. |
| `projects/` | Optional (standardized) | A company/product machine when the domain owns one (e.g. PAI → `projects/parenting-os-plugin/`). |
| `references/` | Optional (standardized) | Source material. |
| `templates/` | Optional (standardized) | Reusable output shapes. |
| `daily/` | Optional (standardized) | Dated working scratch promoted into memory when durable. |

Variants are allowed where a domain documents why (e.g. EA runs a single-lead mesh by design; PAI's machine lives under `projects/` and its root holds only routing + memory). New optional folders should reuse a name from this list before inventing one.

## Runtime boundaries

| Runtime | Allowed assumption | Forbidden assumption |
|---|---|---|
| Claude/Cowork | May read `CLAUDE.md` natively. | Do not make ROS depend on Claude-only memory. |
| Codex | May edit files and inspect code/workspaces. | Do not encode Codex-only tool behavior as universal policy. |
| Hermes | May run WSL automations and connector skills. | Do not make Windows agents rely on hidden Hermes state. |
| Future agents | Can follow `AGENTS.md` and Markdown files. | Do not require vendor-specific prompt memory to understand ROS. |

## Context loading contract

Loading order is defined once in the **canonical boot sequence in `/AGENTS.md`** (eager root files → route → domain files; capabilities, connectors, references, and this contract load lazily). Beyond that:

1. Write durable outputs to the nearest correct folder.
2. Run `/00_System/session-audit.md` after meaningful ROS changes.

## Filesystem hygiene

| Concern | Rule |
|---|---|
| Duplication | One rule lives in one file; other files link to it. |
| Naming | Use stable, descriptive names; prefer existing domain numbering patterns. |
| Scratch output | Keep transient generated work out of Git unless it becomes a deliverable. |
| Sensitive data | Keep personal binaries, contracts, identity documents, secrets, and credentials out of Git unless explicitly approved. |
| Cross-platform edits | Avoid path separators or scripts that only work in one runtime unless the file is runtime-specific. |
| Encoding | Prefer UTF-8 Markdown. |

## Promotion rule

When an agent creates useful runtime state, decide where it belongs:

| State type | Promote to |
|---|---|
| New durable fact | nearest `MEMORY.md` |
| New behavior rule | `/AGENTS.md`, `/CLAUDE.md`, domain `CLAUDE.md`, or `/00_System/*.md` |
| Repeatable process | runbook, skill, or template |
| Finished historical detail | nearest `archive.md` |
| Current operational task | Notion, or a Markdown import pack if Notion is unavailable |
| Temporary build/test data | leave in scratch; do not promote |
