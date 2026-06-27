---
type: runbook
title: ROS Hygiene Runbook
description: Periodic vault hygiene procedure — gaps, consistency, and cleanup.
---

# ROS Hygiene Runbook

Version: 1.1
Last updated: 2026-05-24

**Created:** 2026-05-20
**Owner:** CoS

Use this for weekly or biweekly ROS optimization.

## Goals

- Keep root context lean.
- Keep memory factual and current.
- Prevent context rot, duplication, and broken links.
- Preserve historical context in archives.
- Keep GitHub synced without committing sensitive local files.

## Checklist

### 1. Git and workspace health

Use the runtime's canonical path:

| Runtime | Command |
|---|---|
| Windows agents | `cd C:\Users\dguyr\ROS` |
| WSL/Hermes | `cd /home/guyru/ROS` |

```bash
git fetch origin
git status --short --branch
git rev-list --left-right --count HEAD...origin/main
```

Expected: no unexpected divergence. Investigate before editing if behind/ahead unexpectedly.

### 2. Size checks

```bash
wc -l CLAUDE.md MEMORY.md */CLAUDE.md */MEMORY.md 2>/dev/null | sort -n
```

Flag any file over its ceiling in `/00_System/markdown-instruction-principles.md` §2.

### 3. Instruction vs memory audit

Search memory files for prescriptive words:

```bash
grep -RInE '\b(always|never|must|before doing|do not)\b' MEMORY.md */MEMORY.md
```

Move behavior rules to `CLAUDE.md`, system docs, or skills. Keep facts in memory.

### 4. Archive pass

For each active memory file:

- Keep active facts and decisions.
- Compress old status notes.
- Move completed/stale history to the nearest `archive.md`.
- Leave a short pointer in memory if the archive may be needed later.

### 5. Link and structure check

- Confirm each domain has `CLAUDE.md`, `MEMORY.md`, and `archive.md`.
- Confirm project folders have README or MEMORY where useful.
- Fix broken relative links when encountered.

### 6. Sensitive-file check

Before staging:

```bash
git ls-files --others --exclude-standard
```

Do not stage `KK/personal/`, identity documents, passports, insurance PDFs, contracts, or raw personal records unless Guy explicitly approves.

### 7. Commit and push

Only after reviewing the staged diff:

```bash
git diff --cached --stat
git diff --cached --name-status
git commit -m "[hermes] CoS: maintain ROS hygiene"
git push origin main
git status --short --branch
```

## Report format

End with:

- What changed
- What was archived
- What remains risky/stale
- Whether GitHub is synced
- Recommended next action
