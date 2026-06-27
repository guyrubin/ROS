---
type: reference
title: ROS Knowledge Architecture
description: The five-layer OKF/Git/Obsidian/MCP/graph architecture for the ROS shared knowledge base.
---

# ROS Knowledge Architecture
**Version:** 1.0 · **Last updated:** 2026-06-27 · **Owner:** CoS (group HQ)

> The canonical answer to "the AIs must share a knowledge base, but each keeps its own life." The shared layer is **OKF**; each engine keeps its own context. Not three silos, not one merged brain — **one canonical graph, N independent contexts, git as the bus.**

## 1. Thesis

ROS already *is* what Google's **Open Knowledge Format** (OKF v0.1, June 2026) standardises: an AI-maintained, markdown-first, git-versioned wiki. Adopting OKF makes that bet **market-standard instead of bespoke** — it formalises the existing vault (35+ canonical files, 90 commits, 3 agent identities) as one OKF **Knowledge Bundle** that is the single shared canonical layer. The three engines do not merge and do not silo: **Claude Code** (primary cockpit), **Codex** (bulk coding), and **Hermes** (scheduled/always-on) each load only the slices they need into their **own** context, reason privately, then write back through git. *"AI is only as smart as the context we give it"* — OKF makes that context portable across all three.

**Sources:** [OKF blog](https://cloud.google.com/blog/products/data-analytics/how-the-open-knowledge-format-can-improve-data-sharing) · [OKF spec](https://github.com/GoogleCloudPlatform/knowledge-catalog/blob/main/okf/SPEC.md) — *"Just markdown. Just files. Just YAML frontmatter."* One required field per concept: `type`.

## 2. The five layers

| Layer | Role | ROS asset today | The move |
|---|---|---|---|
| **OKF** | Canonical knowledge format | 35+ UTF-8 markdown files (root + 7 domain pairs + 14 system files), 100% version-controlled | **Adopt** — YAML frontmatter w/ required `type` + `index.md` per dir; one-page spec + linter |
| **Git** | Versioning + multi-agent concurrency | Local + GitHub remote, 90 commits, 3 agent identities, `[agent]` prefix, `rel/*` branches | **Keep** — already OKF's distribution + conflict layer; add only a thin commit-policy note |
| **Obsidian** | Human authoring experience | `.obsidian/` vault initialised; graph configured but empty; zero plugins | **Wire** — keep `[[wikilinks]]`, turn the graph on; do **not** plugin-sprawl |
| **MCP** | Runtime access to external tools | `connectors.md` registry (3 Gmail, Notion, GitHub) + 88 tool grants in `settings.local.json` | **Wire** — one shared `.mcp.json` manifest all 3 engines read; today it's per-agent + uncentralised |
| **Knowledge graph** | Explicit concept relationships | 61 `[[wikilinks]]` (one-directional); Obsidian graph empty; no edge typing | **Wire lightly** — frontmatter `type` + relative-link export = an agent-queryable graph for free |

## 3. The alignment contract — how the 3 engines read/write OKF

**One bundle, three consumers, git as the bus.**

- **Canonical store:** the ROS vault root = the OKF Knowledge Bundle. Every concept has exactly one authoritative file (one `type`, optional `resource` canonical URI). The *only* shared surface — no per-engine copy.
- **Read (private context):** each engine loads only the slices its task needs into its **own** window. Claude routes via `/00_System/routing.md`; Codex pulls the code/architecture notes for the repo it edits; Hermes loads the scheduled task's domain pair. None forks or mutates the base on read.
- **Write (back through git):** any engine may be a producer — author/cross-link notes in one pass, commit with its `[claude]`/`[codex]`/`[hermes]` prefix. Every other engine sees the new canonical state on next read. No live shared session, no handoff protocol.
- **Conflict + history:** git, not a proprietary multi-agent layer.
- **Invariants (enforced by linter, not honour system):** every file UTF-8; frontmatter delimited by `---`; `type` present on every concept; memory = facts-only, CLAUDE.md = rules-only, DRY = one concern per file.

This is the literal expression of the standing rule: **align to a degree — shared canonical layer + independent contexts.**

## 4. Ponytail skill → ADAPT (do not install)

Ponytail's YAGNI-first decision ladder + `lite/full/ultra` intensity dial + explicit "floors you never cut" match ROS's doctrine (`/de-slop`, token-efficiency, DRY). But ROS is a markdown+git PKM, not a coding repo — ponytail's code-shaped middle rungs ("stdlib does it?", "installed deps before new") misfire on prose/memory/routing, and installing it standalone would create **two competing minimalism doctrines** (DRY violation). **Fold its sharpest bits — the ordered ladder, the intensity dial, the floors — into the existing `/de-slop` standard, recast for PKM** (reuse a note/skill/route before new; one memory line before a paragraph; reference a file before restating it). Extend, don't duplicate.

## 5. Adoption plan (sequenced)

**Wire first — highest leverage, lowest cost:**
1. **OKF frontmatter + spec (the keystone).** One-page ROS-OKF spec (require `type`; standardise optional `title`/`description`/`tags`/`timestamp`/`resource`). Add frontmatter to the boot + system set first. Obsidian renders frontmatter as Properties — non-breaking.
2. **The linter (as a hook).** One validator enforcing the invariants (UTF-8, `---` delimiters, `type` present, facts-vs-rules, DRY duplication). Wire as a git pre-commit / `settings.json` hook — converts the archive policy from honour-system to enforced.
3. **Shared `.mcp.json` manifest.** The one real cross-engine gap: MCP setup is per-agent + uncentralised. One committed manifest = all three engines share the same external-tool surface.

**Turn on — cheap, already 90% built:**
4. **Obsidian graph + `index.md` landing pages.** Flip the empty graph on; add `index.md` per dir. Keep `[[wikilinks]]`; emit relative markdown links on export for agent-portability.

**Already have — do NOT rebuild:** git distribution/concurrency/history; the AI-maintained-wiki model (Karpathy-PKM, already in CLAUDE.md); the minimalism doctrine (`/de-slop` — ponytail folds in, no new skill).

**Overkill — explicitly skip:**
- ⛔ A knowledge-graph **engine** / triple-store / typed-edge ontology. OKF's graph is just relative markdown links — `type` + export gives a queryable graph with zero infra. Backlinks/edge-typing are post-traction.
- ⛔ Obsidian community-plugin stack. Plugin state is gitignored + per-agent — it can't be the shared layer. Agents read markdown directly; the vault is for human authoring only.
- ⛔ Any per-engine parallel knowledge structure. One bundle or it isn't a shared canonical layer.
- ⛔ OKF reference enrichment-agent / static visualiser as a build item. On-demand nice-to-have, not the critical path.

**Net:** three things genuinely move ROS toward one shared, market-standard, self-evolving knowledge base — the **OKF frontmatter+spec**, the **linter-as-hook**, and the **shared `.mcp.json`**. Everything else is already built or overkill.
