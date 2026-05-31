# Guy Rubin Command Center — v2

A compact, **live and editable** visual cockpit for ROS, Claude/Cowork, Hermes, Obsidian, and Google workflows. Everything you touch persists on the device; ROS Markdown / Obsidian stays the durable source of truth via one-click export.

- **HTML artifact:** `index.html` (single file, zero dependencies)
- **PRD:** `PRD.md`
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
