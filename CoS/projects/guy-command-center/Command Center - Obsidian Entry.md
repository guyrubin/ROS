# Command Center — Obsidian Entry

[[README|Project README]] · [[../../../MEMORY|Root Memory]] · [[../../MEMORY|CoS Memory]] · [[../../../HV/00_Dashboards/Smart_Living_Deal_Radar_Netherlands|HV Radar]]

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

1. **Plan** — Ask Hermes: “run my morning routing; top five actionable tasks only.”
2. **Buckle** — Pick one front-seat mission.
3. **Block** — Put deep work + health blocks into Google Calendar.
4. **Execute** — Everything else stays in back seat/trunk.
5. **Close** — Log result; promote durable facts into the correct ROS note.

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
