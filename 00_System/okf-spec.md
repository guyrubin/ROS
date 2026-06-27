---
type: policy
title: ROS-OKF Format Spec
description: One-page spec for the ROS adoption of the Open Knowledge Format — YAML frontmatter with a single required `type` field.
---

# ROS-OKF Format Spec

**Version:** 1.0 · **Last updated:** 2026-06-27 · **Owner:** CoS (group HQ)

> ROS adopts Google's **Open Knowledge Format** (OKF v0.1): *"Just markdown. Just files. Just YAML frontmatter."* This is the keystone — every canonical concept file declares one `type`, so any of the three engines (Claude, Codex, Hermes) can query the vault as a typed knowledge graph for free. See `/00_System/ROS-KNOWLEDGE-ARCHITECTURE.md` for the full five-layer rationale.

## 1. The rule

Every canonical ROS markdown file opens with a **YAML frontmatter block**, delimited by `---` lines, before any other content:

```markdown
---
type: <required>
title: <optional>
description: <optional>
---

# Heading...
```

- The opening `---` must be the **first line** of the file (no blank line, no BOM, nothing before it).
- The block is closed by a matching `---` line.
- Between the delimiters is valid YAML: `key: value` pairs.
- All file content after the closing `---` is preserved exactly.

## 2. Fields

| Field | Required? | Purpose |
|---|---|---|
| `type` | **REQUIRED** | The single mandatory field. One value from the vocabulary below. The graph key. |
| `title` | optional | Human/agent-readable name. Add where cheap. |
| `description` | optional | One-line summary of what the file is for. Add where cheap. |
| `tags` | optional | YAML list of free-form labels for cross-cutting retrieval. |
| `timestamp` | optional | ISO date the concept was last authoritative (`2026-06-27`). |
| `resource` | optional | Canonical URI/path this note is the authoritative record of. |

No other fields are standard. Keep frontmatter minimal — a fact belongs in the body or a memory line, not a custom key.

## 3. The `type` vocabulary

One of:

| `type` | Use for |
|---|---|
| `constitution` | Root governance / standing-rule files. |
| `domain-guide` | A domain's `CLAUDE.md` operating instructions. |
| `memory` | Facts-only state files (`MEMORY.md`, memory notes). |
| `reference` | Lookup tables / registries (contacts, templates, capabilities). |
| `runbook` | Step-by-step operational procedures. |
| `policy` | Prescriptive rules / standards / contracts. |
| `routing` | The routing matrix. |
| `dashboard` | Status / cockpit surfaces. |
| `deal` | A real-estate or investment deal note. |
| `adr` | Architecture Decision Record. |
| `contact` | A single contact / principal record. |
| `project` | A project or venture definition. |

Extend the vocabulary by editing this file — never invent a `type` ad hoc.

## 4. The eager-boot exception

The four **eager-loaded boot files** are read on *every* session, so they pay a per-token tax. To protect the eager-load budget they carry **only a single `type:` line** — no `title`, `description`, or other optional fields:

- root `CLAUDE.md` → `type: constitution`
- `AGENTS.md` → `type: constitution`
- root `MEMORY.md` → `type: memory`
- `00_System/routing.md` → `type: routing`

Every other file should add `title` + `description` where cheap.

## 5. Invariants (linter-enforced, not honour system)

- File is UTF-8, no BOM.
- Frontmatter is the first thing in the file, delimited by `---`.
- `type` is present and drawn from the vocabulary above.
- `memory` files hold facts only; `domain-guide` / `constitution` files hold rules only.
- DRY: one concern per file; no rule restated across files.
