# Guy Rubin Command Center — v3

> **⚠️ Canonical cockpit = the Notion Command Center** (`🧠 Rubin OS — Command Center`, `2b4f37e2-31fe-801c-8495-dea36d0efd4d`) — the human second-brain + management surface (10 master DBs + per-domain dashboards), per [ROS-STRATEGY.md](../../ROS-STRATEGY.md) Theme M. **This local HTML is a fast offline MIRROR/dev view, not a competing cockpit.** Don't duplicate Notion data here; `build-state.mjs` feeds it read-only from ROS memory.

A compact, **voice-agentic** visual cockpit for ROS, Claude/Cowork, Hermes, Obsidian, and Google. v3 turns it from a personal dashboard into a **shared file system that agents act on**.

- **HTML artifact:** `index.html` (single file, zero dependencies)
- **Shared state (source of truth):** `state.json`
- **Sync contract (Hermes ⇄ Claude):** `AGENT-SYNC.md`
- **PRD:** `PRD.md`

## v3 — the agentic file system (read this first)

The dashboard is a static file; it can't call Google/Notion APIs itself. So the architecture is **agent-actuated**:

```
voice / ⌘K / dashboard edit
        │ writes an intent
        ▼
state.json.actionQueue[]  →  Hermes (WSL) or Claude (MCP) executes it
        │                        (Gmail, Calendar, Drive, Notion, ROS)
        └──────── writes result back → dashboard re-renders
```

- **`state.json`** is the single source of truth. The dashboard **Pulls** it on load and renders it; your edits are **proposals** until you **Push** (copies state + queue) and an agent commits them. Both Hermes and Claude read/write the same file — that's the Hermes↔Claude sync you asked for.
- **Voice** (🎙 topbar, or Telegram→Hermes): natural commands route per `AGENT-SYNC.md` §4 — *"front seat: …", "task: …", "client amber because …", "block deep work", "draft email to …", "remember … "* — each becomes a state change + a queued intent.
- **Agent Queue** card shows pending intents with safety gates (3+ = external action, draft-first / confirm).
- **EA Client Cockpit** (new): the active engagement — name, stack, RAG, phase, next decision, stakeholders, milestones — with one-click **Scaffold** (queues Drive folder + ROS folder + Notion row) and **HLD / ADR / Review / Kickoff / Meeting** actions wired to the EA skills and the EA sending identity.
- **Connectors** now show real status from `state.json.integrations` (Gmail / Calendar / Drive / Notion = live via MCP; Tasks / Contacts / Slack = planned).

## v3.1 — auto-fed from ROS memory (no more stale dashboard)

`state.json` is no longer hand-maintained. **`build-state.mjs`** reads the live ROS domain memory and refreshes the cockpit:

```
node CoS/projects/guy-command-center/build-state.mjs
```

It pulls each domain's current **`Next:`** line from root `MEMORY.md`, stamps each domain with its `MEMORY.md` **freshness** (`updated` / `staleDays` / `stale` — a domain whose memory has gone quiet >14 days lights up as stale), adds an Arbor pulse from the mesh memory, and updates `meta`. It **preserves** the curated fields (clients, map, frontSeat, integrations, actionQueue). Re-run any time; make it a Hermes **morning cron** for a truly auto-fed dashboard (registered as a proposed loop in `/00_System/agent-framework/SCHEDULED-LOOPS.md`).

## Earlier (v2) capabilities, still here
- **Primary model:** one front-seat mission, back-seat queue, trunk backlog
- **Domains covered:** war/geopolitics signal, investments/HV, finance/admin, EA work, PAI ventures, travel, family, fitness, art/energy
- **Design source:** adapted from the YouTube command-center pattern — front seat, focus timer, Google time blocks, Obsidian-backed Markdown, daily close.

## What's new in v2

- **Everything is editable and saved** — mission, domain statuses (click to cycle 🟢→🟡→🔴), context lines, tasks, signals, fitness, and brain-dump all persist to `localStorage`.
- **⌘K / Ctrl+K command palette** — fuzzy-search 19 actions: copy agent prompts, open Obsidian notes, open prefilled Google Calendar blocks, bump fitness rings, export, close day.
- **Real Google Calendar integration, no OAuth** — Quick Links and the palette open `calendar.google.com/render` links **pre-filled** with deep-work / stretch / run blocks for today. One click → confirm in Google.
- **Obsidian deep links** — connectors and quick links use `obsidian://open?vault=ROS&file=…` to jump straight into the real notes (HV Radar, routing, PRD, domain memories).
- **Gmail compose deep link** — send the current agent prompt to yourself/an agent in one click.
- **Focus ring timer** — 25 / 50 / 90 modes, animated SVG ring, session dots, auto-logged on completion.
- **Fitness rings** — Move / Stretch / Run; tap +25%, right-click to reset; auto-resets each new day.
- **World clocks** — AMS · BRU · TLV (travel + family), plus a workday-progress bar (07:00–19:00).
- **Export your data** (JSON) and **Copy today as an Obsidian daily note** (`# Daily Note — YYYY-MM-DD` with domains, tasks, signals, fitness, dump).
- **Density toggle** (cozy / compact).

## How to use

1. Open `index.html` in a browser.
2. Put exactly one task in **Front Seat**; pick its domain; start the focus ring.
3. Press **⌘K** for any action, or use the **Command Palette** card to copy a Hermes/Claude prompt.
4. Click domain cards to set status; edit any context line, task, or signal inline.
5. Use **Quick Links** / ⌘K to drop today's deep-work, stretch, and run blocks into Google Calendar.
6. **Brain Dump** for quick capture (⌘/Ctrl+Enter). Promote durable notes into the right ROS Markdown file.
7. At day end, **Close day** (logs the mission), then **⧉ MD** to paste a daily note into Obsidian.

## Integration map

- **ROS / Obsidian:** plain Markdown + HTML inside `/CoS/projects/guy-command-center/`; deep links use vault `ROS`.
- **Claude/Cowork:** reads/edits this file from `C:\Users\dguyr\ROS\CoS\projects\guy-command-center`.
- **Hermes:** runs the command-palette prompts from Telegram; can later promote them to cron jobs / native tool buttons.
- **Google:** Gmail active via Himalaya + compose deep link; **Calendar works now via prefilled template links** (no OAuth) — full API writes still need OAuth and stay approval-gated.

## Small/efficient choices

- Single HTML file, no package install, no external libraries, no build step.
- `localStorage` for all personal state; JSON export + Markdown copy keep ROS as the durable record.
- No fake live metrics; signal/status text is yours to edit.
- High visual density, but hit targets and responsive layout collapse cleanly to one column on mobile.

## Run a local preview

`.claude/launch.json` defines a `command-center` server (`npx http-server … -p 4500`). Opening `index.html` directly with `file://` also works; calendar/Gmail/Obsidian deep links behave the same either way.

## Next upgrade options

- Hermes cron job that posts the front-seat candidate + top-5 to Telegram each morning.
- Google Calendar OAuth + a small `timeblock` action for direct (approved) event creation instead of prefilled links.
- Notion operational sync: map Front Seat / Back Seat / Trunk to the existing Command Center DBs (upsert by stable ID).
- Live war/investment signal cards from verified RSS/news/market sources via Hermes.
