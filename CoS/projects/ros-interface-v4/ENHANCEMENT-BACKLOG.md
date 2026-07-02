---
type: backlog
title: ROS Consolidated Dashboard — Enhancement Backlog
status: active
canonical_surface: ros-interface-v4
created: 2026-06-29
owner: CoS
---

# ROS Consolidated Dashboard — Enhancement Backlog

Prioritized work to make `ros-interface-v4` the single surface that covers **every** capability the scattered dashboards showed, then improve beyond them. Effort: S (≤1h) · M (½ day) · L (1–2 days).

Tiers follow ROS safety levels — all items here are Tier-2 (write files in workspace), auto-execute, no prod deploy.

---

## EPIC A — Close the coverage gaps (parity: nothing lost)

Goal: a new ROS user opening v4 sees everything the old dashboards showed. Build A1–A2 first (data already in `state.json`).

| ID | Item | Effort | Acceptance criteria |
|----|------|--------|---------------------|
| **A1** | **Signals panel** | M | New `panels/SignalsPanel.tsx` renders `state.signals[]` (sev RAG, title, source) with a refresh affordance; placed on NOW sidebar + OS. No more orphaned data. |
| **A2** | **Compact Life Map panel** | M | New `panels/LifeMap.tsx` renders `state.map[]` as 8 tiles (context/item/because/effect + severity dot); placed on NOW or new HOME. |
| **A3** | **Daily Ritual** | S | `panels/DailyRitual.tsx` — 4-move checklist (Plan→Buckle→Block→Close), state persisted to `lastDay`; resets daily. On NOW. |
| **A4** | **Quick Links** | S | `panels/QuickLinks.tsx` — Obsidian (`obsidian://`) + Google shortcuts, driven by a small config; on OPS sidebar. |
| **A5** | **Command Palette agent presets** | M | Add a "Prompt" category to `CommandPalette.tsx`: Morning sync · Triage EA mail · Draft HLD · Time blocks → copy-to-clipboard for agent + optional Gmail compose deep-link. |
| **A6** | **Full Action Queue view** | M | Extend `ResolveQueue` (or new `ActionQueue.tsx` on OS): show all statuses (pending/done/blocked/rejected), args/domain, clear-done, copy-all. |
| **A7** | **Sync / Push panel** | M | `panels/SyncPanel.tsx` — Pull (re-fetch state.json) + Push (copy queue+edits to clipboard for Hermes/Claude commit); surfaces `meta.updatedAt/updatedBy/gitState`. |
| **A8** | **Density toggle** | S | TopBar control toggles cozy/compact via a CSS var / data-attr on root; persisted to localStorage. |
| **A9** | **Export state.json** | S | TopBar/OS button downloads current `state.json` (reuse `lib/stateIO`). |
| **A10** | **System Map `/map` view** — ✅ **SHIPPED** as an interactive **Graphify** knowledge graph (not a static port) | L | DONE: `MapView` + `SystemGraph.tsx` (hand-rolled force sim, no dep) render `src/data/system-graph.json` (graphify-compatible) — 59 nodes / 69 edges of runtimes · agents · subagents · skills · capabilities · connectors. Drag, zoom/pan, hover-highlight, click-to-detail, type + domain filters. Wired into router/nav/⌘%/palette. |
| **A11** | **HV Deal Radar link-out** | S | DealPipeline/HVSlide deep-links to `Smart_Living_Deal_Radar_Netherlands.md` via Obsidian scheme. No rebuild. |
| **A12** | **Backlog Hub `/backlog` view** — ✅ **SHIPPED** | M | DONE: `gen-backlogs.mjs` auto-discovers every domain backlog (CoS·EA·PAI, skips stale/dated archives), parses tables + checkboxes + ID-headings + bold-bullets → `state.backlogs[]`; `BacklogHub.tsx` renders aggregate rollup + domain/status filters + per-backlog progress cards, expandable to items, Obsidian deep-links. Wired into router/nav/⌘^/palette + the gen-state chain. 9 backlogs · 203 items centralized. |

**Exit:** every union capability from the inventory is reachable in v4 → old surfaces can be retired (see plan §3).

---

## EPIC B — Retire the scatter (one surface, for real)

| ID | Item | Effort | Status |
|----|------|--------|---------------------|
| **B1** | Demote Command Center v3 UI | S | ✅ **DONE 2026-06-30** — `guy-command-center/index.html` → `CoS/projects/_retired/`; kept `state.json` + `gen-state.mjs` as v4's data layer. |
| **B2** | Retire Multi-Agent Map HTML | S | ✅ **DONE** — archived to `_retired/`; absorbed into `/map`. Reference in `capability-optimization.md` + audit memory updated. |
| **B3** | Archive dead prototypes | S | ✅ **DONE** — `notion-command-center-update`, `notion-second-brain`, `notion_import`, `WALLS_Roadmap_Dashboard.md` → `_retired/` (+ README). `ros-os-dashboard` :4700 formally closed. Dropped `:4500` launch entry. `CoS/projects/` = just `_retired` + `guy-command-center` (data) + `ros-interface-v4`. |
| **B4** | Update canonical-surface memory | S | ✅ **DONE** — `CoS/MEMORY.md` + auto-memory: surface = `ros-interface-v4`, "UNDECIDED" removed. |

## EPIC D — Deploy (login-gated, Firebase) — Guy-gated Tier-C

| ID | Item | Effort | Status |
|----|------|--------|--------|
| **D1** | Static-deployable build | S | ✅ DONE — `npm run build` → clean `dist/` (544 KB, **no `state.json`**); `firebase.json` + `.firebaserc` + `.gitignore` + `DEPLOY.md` scaffolded; `build:local`/`stage-data` for local preview. |
| **D2** | Auth gate + auth-gated data source | M | ☐ **NEXT** — Firebase Auth (Google) + allow-list; serve `state.json` via Firestore-rule or Cloud Function (NOT a public static file). Make `useStateSync` env-aware (dev → middleware, prod → token-gated). |
| **D3** | Live deploy | S | ☐ **GATED** — `firebase deploy`; verify login wall + `state.json` 404s public. Needs Firebase project id + Guy authorization. |

---

## EPIC C — Make it better than the sum (enhancements)

| ID | Item | Effort | Value |
|----|------|--------|-------|
| **C1** | Real Pomodoro persistence | S | FrontSeat sessions persist to `state.json` (`frontSeat.timerSeconds`), survive reload; daily session count. |
| **C2** | Live connector status (read-only) | M | ConnectorPulse reflects real `liveData` fetch timestamps; stale > N min → amber. Guy-gated for any live fetch. |
| **C3** | Keyboard nav parity | S | Wire the documented `⌘1–8` domain shortcuts + `⌘\`/@/#/$` view jumps in `App.tsx` (some are stubs today). |
| **C4** | Command Palette → real workflow triggers | M | `weekly-review`/`okr` presets emit an action-queue item (not just navigate), draining to agents. |
| **C5** | Mobile / narrow layout | M | Views collapse 2-col → 1-col < 900px; NavRail → bottom bar. |
| **C6** | Theme tokens unification | M | Replace inline hex with the CSS-var palette everywhere; single theme source (aligns with ROS de-slop). |
| **C7** | "What changed" diff strip | M | On load, show what moved since last `meta.updatedAt` (new pending actions, RAG flips, new signals). |
| **C8** | State schema validation | S | Validate `state.json` against `types.ts` at fetch; surface schema drift in OS view instead of silent breakage. |
| **C9** | Graphify live-enrich the system graph — ✅ **SHIPPED** | M | DONE: real `/graphify` run over `00_System` + `.claude/agents` + `.claude/skills` (30 docs) → `graphify-out/{graph.json,graph.html,GRAPH_REPORT.md}` (119 nodes, 144 edges, 12 communities). Transformed → `src/data/knowledge-graph.json`; SystemGraph is now **dual-mode** ("Agents & Skills" curated ↔ "Knowledge Graph" graphify, colored by community, sized by degree). |
| **C10** | Generate graph from state, not hardcode | M | Have `gen-state.mjs` (or a sibling) emit `system-graph.json` from routing.md + skill frontmatter so the map never drifts from the real agent/skill set. |

---

## Cross-domain dependencies (owned elsewhere — do not duplicate)

| Ref | Item | Owner | Effect on the dashboard |
|-----|------|-------|-------------------------|
| **EA-E3** | gen-state phase 2 — auto-derive roadmap **phase/milestone done-state** from `ROADMAP.md` | `EA/frameworks/ea-system-enhancements-backlog.md` | Finishes the EA cockpit flywheel — removes the last hand-set field in `EAClientCockpit`. The EA panels are already canonical in v4; this only improves their feed. |

## Suggested sequence

1. **A1, A2** (orphaned-data panels — fastest visible win).
2. **A3–A9** (Command Center ergonomics parity).
3. **A10** (System Map — the biggest single absorb).
4. **B1–B4** (retire the scatter; lock the decision in memory).
5. **C** items as capacity allows.

All build to a green branch; no prod deploy in-session (release-engineering rule). CI is the test gate.
