# Repo Boundaries — ROS vs the nested Arbor app

**Version:** 1.0
**Last updated:** 2026-06-24
**Why this exists:** ROS root contains a *second, unrelated* git repo (the live Arbor app) plus its worktrees. Running `git add .` or `git status` at ROS root has repeatedly caused cross-repo confusion. This file is the single source of truth on the boundary.

## The two repos

| Repo | Path | Remote | Tracks |
| :--- | :--- | :--- | :--- |
| **ROS** (this knowledge base) | `c:\Users\dguyr\ROS` | ROS remote | Markdown knowledge, agent defs, dashboards, runbooks. **Never** app source. |
| **Arbor app** (the live React app) | `PPPPtherapy-/` (nested) | `github.com/guyrubin/PPPPtherapy-` | The shipping Arbor product code. Own CI/CD → Firebase. Current branch: `feat/six-frames`. |

`PPPPtherapy-` **is** Arbor — same product, it's just the code repo's legacy name. It is **gitignored from ROS** (`/PPPPtherapy-/`) so it never gets swept into a ROS commit.

## The three Arbor locations (and what each is)

| Location | What it is | Repo it belongs to | Status |
| :--- | :--- | :--- | :--- |
| `PAI/projects/arbor/` | Arbor's **product workspace** — PRDs, backlogs, mesh, marketing, funding, execution docs | ROS (tracked knowledge) | ✅ canonical, renamed from `parenting-os-plugin` 2026-06-24 |
| `PPPPtherapy-/` | The **live app source** | Arbor repo (nested) | active dev on `feat/six-frames` |
| `.arbor-*/` (17 dirs at ROS root) | Git **worktrees** of the Arbor repo (build, council, rel-001/002, redesign-w1..4, w5/w6, mobile, promote, etc.) | Arbor repo | active sessions; gitignored via `/.arbor-*/` |

## Reserved: `PAI/arbor/` (the future single code home)

`PAI/arbor/` is **reserved and gitignored** as the eventual single canonical clone of the Arbor app repo. The plan (deferred — see below) is to move `PPPPtherapy-/` → `PAI/arbor/` so the app code also lives under PAI. Do **not** put product-workspace docs there — those go in `PAI/projects/arbor/`.

- `PAI/projects/arbor/` = ROS knowledge about Arbor (tracked here).
- `PAI/arbor/` = the Arbor app code clone (separate repo, gitignored).

## The deferred physical move (do NOT do casually)

Moving `PPPPtherapy-/` → `PAI/arbor/` is **blocked while the 17 `.arbor-*` worktrees are live** — worktrees store absolute gitdir paths and break if the main repo moves. Sequence when ready:
1. Confirm all `.arbor-*` worktree sessions are closed / merged (`git -C PPPPtherapy- worktree list`).
2. `git -C PPPPtherapy- worktree prune` + remove stale worktrees.
3. Move the repo dir, then `git -C PAI/arbor worktree repair`.
4. Re-create any needed worktrees at the new location.
5. Update `.gitignore` (`/PPPPtherapy-/` → already covered by `/PAI/arbor/`) and this doc.

## Hard rules

- **Never** `git add` an Arbor app path (`PPPPtherapy-/`, `.arbor-*/`, `PAI/arbor/`) into a ROS commit. They are gitignored — keep it that way.
- Arbor **product/strategy/knowledge** edits → `PAI/projects/arbor/` (ROS, tracked).
- Arbor **code** edits → inside the Arbor repo (`PPPPtherapy-/` or the relevant worktree), committed to *its* remote.
- A ROS `git status` showing `PPPPtherapy-/` or `.arbor-*/` as untracked = expected noise; do not commit it.
