---
type: reference
title: ROS Dashboard Consolidation Plan
status: approved-base / pending-build
canonical_surface: ros-interface-v4
decided: 2026-06-29
owner: CoS
---

# ROS Dashboard Consolidation Plan

**Decision (2026-06-29):** `ros-interface-v4` (React/Vite/TS, port 4600) is the **single canonical ROS surface**. All other dashboards are absorbed into it or demoted to a data/reference layer. This closes the long-open "canonical surface UNDECIDED" note in `CoS/MEMORY.md`.

## 1. What existed (the scatter)

| # | Surface | Path | Type | Disposition |
|---|---------|------|------|-------------|
| 1 | **ROS Interface v4** | `CoS/projects/ros-interface-v4/` | React/Vite/TS, :4600, 5 views / 28 panels | **CANONICAL** — absorbs the rest |
| 2 | **Guy Command Center v3** | `CoS/projects/guy-command-center/` | Vanilla HTML/JS + `state.json` | **DEMOTE → data layer** (keep `state.json` + `gen-state.mjs`; retire `index.html` UI after gaps land) |
| 3 | **ROS Multi-Agent Map** | `00_System/ros-multi-agent-map.html` | Static HTML (system map) | **ABSORB** → new in-app `/map` view |
| 4 | **Smart Living Deal Radar** | `HV/00_Dashboards/Smart_Living_Deal_Radar_Netherlands.md` | Obsidian markdown (HV) | **KEEP as reference**; link from DealPipeline/HVSlide — not a competing app |
| 5 | **ros-os-dashboard (:4700)** | — | (gone from disk) | **CLOSED** — formally retired |
| 6 | **notion-command-center-update** | `CoS/projects/` (per CoS memory) | Notion prototype | **RETIRE** — confirm dead, archive |

## 2. Capability coverage — v4 vs. the union

v4 already reproduces ~80% of the scattered capabilities. Verified by reading the source (not inferred):

**Already covered in v4 (no work):**
- Front Seat / Mission **+ Focus Timer** (Deep/Stretch/Run = 25/50/90 min, progress ring, session counter) — `FrontSeat.tsx`
- Day progress bar + World clocks (AMS/BRU/TLV) — `TopBar.tsx`
- Domain Pulse (6 domains, RAG) · DayStrip · Open Decisions · Resolve/Action Queue (safety-gated, copy, confirm/reject)
- OKR Resolution · Project Milestones · EA Delivery Track · Deal Pipeline · Arbor Track · Arbor Command
- EA Client Cockpit (full) · Active Deliverables · Inbox Triage · Tasks Panel (back/trunk) · Fitness Rings · Quick Capture · Brain Dump (+ voice)
- Agent Activity · Memory Freshness · Connector Pulse · File Stats · Capability Backlog · Document Graph · World Map
- 7 domain slides (CoS/EA/FIN/HV/KK/MKT/PAI) · Command Palette (nav + domain open + drain queue) · Safety Gate

**EA cockpit — already consolidated (not a separate surface):** The "EA gen-state cockpit" is **two first-class v4 panels**, not a competing dashboard: `EAClientCockpit.tsx` (renders client `terms / roadmap / deliverables / backlog / structure / milestones / phase / status / nextDecision`, selector across ABN · Coca-Cola · Boortmalt) on **WORK**, and `EADeliveryTrack.tsx` on **MOMENTUM**. The data flywheel is live: `gen-state.mjs` reads each client's `DELIVERABLES-BACKLOG.md` + `BACKLOG.md` from its `rosFolder` and writes status back into `state.json` → cockpit. Per the EA backlog: *"No dashboard rebuild — the EA cockpit + delivery track already render structure/roadmap/backlog."* The only open EA item is a **data feed**, owned by the EA backlog as **E3 (gen-state phase 2 — auto-derive roadmap phase/milestone done-state from `ROADMAP.md`)**, the last hand-set cockpit field. Tracked there, cross-linked here — not duplicated.

**Gaps to close (full list → `ENHANCEMENT-BACKLOG.md`):**

| ID | Gap | Why it matters | Note |
|----|-----|----------------|------|
| G1 | **Signals panel** | geopolitical/market watches w/ severity | `state.signals[]` exists but **nothing renders it** |
| G2 | **Compact Life Map panel** | 8-tile life domains w/ severity dots | `state.map[]` exists but **nothing renders it** |
| G3 | **Daily Ritual** | 4-move Plan→Buckle→Block→Close | from Command Center v3 |
| G4 | **Quick Links** | Obsidian + Google shortcuts | from v3 |
| G5 | **Command Palette agent presets** | Morning sync / Triage EA mail / Draft HLD → copy-for-agent + Gmail compose | v4 palette is nav-only |
| G6 | **Full Action Queue view** | verb/args/domain/safety + clear-done + blocked/rejected | extend ResolveQueue (today: pending + last 3 only) |
| G7 | **Sync / Push panel** | explicit Pull state.json / Push-to-agents (clipboard for Hermes/Claude commit) | v4 has only the sync LED |
| G8 | **Density toggle** | cozy/compact | v3 had it; v4 doesn't |
| G9 | **Export state.json** | one-click download | — |
| G10 | **System Map `/map` view** — ✅ SHIPPED as interactive Graphify graph | runtime strip, boot seq, domain agents, capability stack, governance, feedback loop | absorbed `ros-multi-agent-map.html` → `MapView`/`SystemGraph` reading `src/data/system-graph.json`. Static HTML now retire-able (B2). |
| G11 | **HV Deal Radar link-out** | surface the Obsidian radar | link, don't rebuild |

## 3. Retirement / migration sequence

1. **Build G1–G2 first** (highest value, lowest cost — data already in `state.json`, just needs panels).
2. Build G3–G11 per backlog priority.
3. Once G1–G9 land, replace `guy-command-center/index.html` with a one-line redirect banner → v4. Keep `state.json` + `gen-state.mjs` (v4's data layer).
4. After G10 reaches parity, delete/redirect `00_System/ros-multi-agent-map.html` (keep a static export if a no-build fallback is wanted).
5. Archive `notion-command-center-update`; confirm `ros-os-dashboard` is closed.
6. Update `CoS/MEMORY.md`: canonical surface = `ros-interface-v4` (no longer UNDECIDED).

## 4. Non-goals / guardrails

- **No new data source.** v4 stays filesystem-only (`state.json` via `gen-state.mjs`); live connectors remain Guy-gated.
- **No rebuild of the HV radar** — it stays Obsidian markdown.
- Single source of truth for state schema = `src/state/types.ts` (already models `signals`, `map`, `actionQueue`).
- Prototype → no prod deploy in-session; build to a green branch and stop (per release-engineering rule).
