---
type: manifest
title: ROS Generated Artifact Manifest
description: Source-of-truth and cleanup classification for generated/local artifacts discovered during ROS code optimization v3 execution.
---

# ROS Generated Artifact Manifest

**Date:** 2026-06-29  
**Backlog:** `CoS/backlogs/ros-code-optimization-backlog-v3-2026-06-29.md`  
**Purpose:** Execute RCO3-01/RCO3-02/RCO3-08/RCO3-09/RCO3-10 safely while another session is actively working on Arbor.

## Production rule

Do not optimize or delete by browsing manually. Use `00_System/scripts/ros_repo_hygiene.py` for deterministic classification, keep active product clones excluded, and stage only explicit ROS hygiene files.

## Classifications

### Local secrets

- `00_System/secrets/` — **local-only, ignored, never committed**.
- `Arbor/app/.env.local` — **local-only inside Arbor repo, do not read or stage**.
- Policy: secret values stay outside committed ROS Markdown; committed docs may describe secret-handling rules only.

### Active Arbor surface

- `Arbor/` — **active nested Arbor git repo**. Another session is working there; do not clean, delete, refactor, or stage from ROS-level cleanup.
- `PAI/arbor/` and `PPPPtherapy-/` — reserved/legacy clone locations; ignored at ROS level until explicit consolidation.

### Generated/regenerable outputs

- `graphify-out/` — generated graph/cache output; ignored and safe to delete when untracked. Cleaned in this execution with `ros_repo_hygiene.py --clean`.

### Agent worktrees / scratch

- `.claude/worktrees/` and `.workspace/` — agent scratch/worktree surfaces; excluded from hygiene scans and ignored. Delete only after active owner/session is known closed.

## Verification ladder

```bash
python3 00_System/scripts/test_ros_repo_hygiene.py
python3 00_System/scripts/ros_repo_hygiene.py --root .
git status --short --ignored 00_System/secrets graphify-out Arbor .claude/worktrees
```

## Current execution result

- Safe cleaned: `graphify-out/` — 211 untracked ignored generated files, 5,548,785 bytes.
- Not cleaned: `Arbor/` — active nested repo with large dirty working tree in another session.
- Not cleaned: `00_System/secrets/keys.env` — local-only secret file, now covered by explicit ignore rule.
- Not cleaned: `.claude/worktrees/` — agent worktree content requires owner/expiry registry before deletion.
