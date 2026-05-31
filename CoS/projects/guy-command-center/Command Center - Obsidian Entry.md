# Command Center — Obsidian Entry

[[README|Project README]] · [[PRD|PRD]] · [[AGENT-SYNC|Agent Sync Contract]] · [[../../../MEMORY|Root Memory]] · [[../../MEMORY|CoS Memory]] · [[../../../HV/00_Dashboards/Smart_Living_Deal_Radar_Netherlands|HV Radar]]

> **v3 — voice-agentic file system.** `state.json` is the shared truth that Hermes (WSL) and Claude (MCP) both read/write; the dashboard renders it and proposes intents into an action queue agents execute. See [[AGENT-SYNC]]. New: 🎙 voice commands, EA Client Cockpit, live Gmail/Calendar/Drive/Notion via MCP.

## Open the visual dashboard

Open this file in a browser:

```text
C:\Users\dguyr\ROS\CoS\projects\guy-command-center\index.html
```

WSL path:

```text
/home/guyru/ROS/CoS/projects/guy-command-center/index.html
```

## Daily operating loop

1. **Plan** — `⌘K → Morning routing` (copies the prompt for Hermes/Claude): “top five actionable tasks only.”
2. **Buckle** — Pick one front-seat mission, set its domain, start the focus ring.
3. **Block** — `⌘K → Open Deep-work / Stretch / Run calendar block` → confirm prefilled events in Google.
4. **Execute** — Everything else stays in back seat / trunk; click domain cards to keep statuses honest.
5. **Close** — Click **Close day**, then **⧉ MD** to paste a daily note here; promote durable facts into the correct ROS note.

## v2 shortcuts

- **⌘K / Ctrl+K** — command palette (prompts, Obsidian notes, calendar blocks, fitness, export).
- **Click a domain card** — cycle 🟢→🟡→🔴. **Shift-click** — open that domain's note in Obsidian.
- **Tap a fitness ring** — +25%; right-click — reset. Rings + focus sessions reset each new day.
- **⧉ MD** (topbar) — copy today as an Obsidian daily note. **⬇︎** — export all your data as JSON.

## Prompt shortcuts

### Morning routing

```text
Hermes: run my morning routing. Use ROS, Gmail triage, calendar context if available, and return the top 5 actionable tasks only.
```

### War/investment signal

```text
Claude/Hermes: produce a war-room signal brief for today: geopolitics, markets, Dutch real estate, finance/admin risks. Only actionable effects on Guy/HV/EA/PAI.
```

### Fitness/calendar block

```text
Hermes: draft Google Calendar time blocks for today: one deep-work block, one stretch block before 60 minutes sitting, one run/recovery block. Ask before creating events.
```

## Connector reality

- Gmail: active through Himalaya.
- Google Calendar/Drive/Docs: not yet authenticated through the Google Workspace OAuth skill in this Hermes profile.
- Obsidian: use ROS as the vault/workspace; all files are Markdown-first and inspectable.
- Notion: existing ROS Command Center integration is available if you want this promoted into Notion dashboards later.
