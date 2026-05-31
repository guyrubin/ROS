# Guy Rubin Command Center

A compact visual cockpit for ROS, Claude/Cowork, Hermes, Obsidian, and Google workflows.

- **HTML artifact:** `index.html`
- **Primary model:** one front-seat mission, back-seat queue, trunk backlog
- **Domains covered:** war/geopolitics signal, investments/HV, finance/admin, EA work, PAI ventures, travel, family, fitness, art/energy
- **Design source:** adapted from the YouTube command-center pattern: front seat, hourglass focus timer, Google time blocks, Obsidian-backed Markdown, bookmark revival, daily close.

## How to use

1. Open `index.html` in a browser.
2. Put exactly one task in **Front Seat**.
3. Use the **Command Palette** to copy a Hermes/Claude prompt.
4. Use **Brain Dump** for temporary local notes. Promote durable notes into the right ROS Markdown file.
5. At day end, click **Close day**, then move unfinished work to Back Seat or Trunk.

## Integration map

- **ROS / Obsidian:** This folder is plain Markdown + HTML inside `/CoS/projects/guy-command-center/`, so Obsidian can index and link it.
- **Claude/Cowork:** Claude can read/edit this file from `C:\Users\dguyr\ROS\CoS\projects\guy-command-center`.
- **Hermes:** Hermes can run the command-palette prompts from Telegram and can later turn the prompts into cron jobs or native tool buttons.
- **Google:** Gmail access is active through Himalaya. Calendar/Drive/Docs need Google OAuth setup before direct API writes; until then, the dashboard links to Google Calendar/Gmail and prompts Hermes to ask before event creation.

## Small/efficient choices

- Single HTML file, no package install, no external libraries.
- LocalStorage only for temporary brain-dump notes.
- No fake live metrics; status text comes from current ROS memory.
- Visual density is high, but hit targets and responsive layout remain usable on mobile.

## Next upgrade options

- Add a Hermes cron job for morning routing that posts the front-seat candidate to Telegram.
- Add Google Calendar OAuth and a tiny `timeblock.py` script to create stretch/deep-work/run blocks after approval.
- Add a Markdown-backed tasks file if Notion is unavailable, or connect directly to the existing Notion Command Center if you want operational state there.
- Add live war/investment signal cards from verified RSS/news/market sources.
