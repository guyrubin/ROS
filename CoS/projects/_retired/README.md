# Retired CEO-dashboard surfaces

**Retired 2026-06-30** as part of the dashboard consolidation. The single canonical surface is now **`CoS/projects/ros-interface-v4`** (React/Vite, :4600). See `../ros-interface-v4/CONSOLIDATION-PLAN.md`.

These are kept here (not deleted) so nothing is lost and any panel/idea can be mined later. Restore with `git mv` or by moving the folder back.

| Archived item | Was | Replaced by |
|---|---|---|
| `guy-command-center-index.html` | The v3 vanilla-HTML CEO cockpit UI (served on :4500) | v4 panels. **NOTE:** its data files (`state.json` + `gen-state.mjs`) were NOT retired — they stayed in `CoS/projects/guy-command-center/` and remain v4's data layer. |
| `ros-multi-agent-map.html` | Static system map | v4 `/map` view (interactive Graphify graph) |
| `notion-command-center-update/` | Python Notion upsert script + CSVs | — (Notion sync, not a UI) |
| `notion-second-brain/` | Notion KM prototype | — |
| `notion_import/` | Notion import artifacts | — |
| `WALLS_Roadmap_Dashboard.md` | Notion roadmap dashboard doc | — |

Also removed: the `command-center` (:4500) entry in `.claude/launch.json`.
