# Current ROS Path Contract

Last updated: 2026-05-26

## Current Decision

ROS has one canonical working tree:

| Runtime | Path used | Must resolve to |
|---|---|---|
| Claude/Cowork | `C:\Users\dguyr\ROS` | `C:\Users\dguyr\ROS` |
| Codex | `C:\Users\dguyr\ROS` | `C:\Users\dguyr\ROS` |
| Hermes | `/home/guyru/ROS` | `/mnt/c/Users/dguyr/ROS` |

`/home/guyru/ROS` must be a symlink to `/mnt/c/Users/dguyr/ROS`. Hermes must
not use a separate WSL checkout as its durable workspace.

## Why

The Windows ROS directory is the shared Obsidian/Codex/Claude workspace. Hermes
runs in WSL, so it gets a POSIX path for the same files through the WSL mount.
This keeps all agents on the same Markdown tree and avoids Git-mediated
split-brain state on one laptop.

## Detect Drift

Run this inside WSL:

```bash
ls -ld /home/guyru/ROS /mnt/c/Users/dguyr/ROS
readlink -f /home/guyru/ROS
git -C /home/guyru/ROS rev-parse --show-toplevel
git -C /mnt/c/Users/dguyr/ROS rev-parse --show-toplevel
```

Healthy output:

- `readlink -f /home/guyru/ROS` prints `/mnt/c/Users/dguyr/ROS`.
- Both `git rev-parse --show-toplevel` commands point at the same tree.
- A file created through one path is visible through the other immediately.

## Repair Drift

Run this inside WSL:

```bash
bash /mnt/c/Users/dguyr/ROS/00_System/sync/repair-wsl-ros-path.sh
```

The script refuses to overwrite a non-symlink `/home/guyru/ROS` unless it can
move it to a timestamped backup first.

## Deprecated Material

Older files under `/ros-sync-setup/` and the historical
`/00_System/sync/WSL-EXECUTION-PLAN.sh` describe a WSL-canonical sync daemon.
They are retained as history only and should not be used for the current single
tree setup.
