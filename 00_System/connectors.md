# Connectors
Last updated: 2026-05-19

This is the shared connector registry for Rubin OS. Domain agents inherit this file through root `CLAUDE.md` and `/00_System/agent-capabilities.md`.

| Connector | Live status | Used by | Access method | Notes / blockers |
|---|---|---|---|---|
| Gmail — `bguy.rubin@gmail.com` | Active / verified | CoS, KK, EA, PAI, MKT, FIN-by-context | Himalaya CLI account `bguy` | IMAP inbox access verified 2026-05-17. Draft first; never send externally without explicit confirmation. |
| Gmail — `bhollandvest@gmail.com` | Active / verified | HV, KK, FIN-by-context | Himalaya CLI account `hollandvest` | IMAP inbox access verified 2026-05-19. Draft first; never send externally without explicit confirmation. |
| Gmail — `josephdoronrubin@gmail.com` | Active / verified | EA when Joseph is sender/primary, KK, FIN-by-context | Himalaya CLI account `joseph` | IMAP inbox access verified 2026-05-19. Draft first; never send externally without explicit confirmation. |
| Notion | Active / verified | All agents | Notion API via `NOTION_API_KEY`; skill `productivity/notion` | Integration `ROS KK Con` has verified API access to `Rubin OS Command Center` (`2b4f37e231fe801c8495dea36d0efd4d`) and `HollandVest Command Center` (`20401545ece243e397e18534e701d207`) as of 2026-05-19. |
| GitHub | Active | CoS, PAI, EA | git / gh where configured | ROS repo exists at `https://github.com/guyrubin/ROS`. |
| Funda scraper | Phase 3 | HV | TBD | New listings, price alerts. |

## Required skills by connector

- Gmail / email: load Hermes skill `himalaya` before inbox triage, email search, message read, drafting, reply, forward, or send workflows.
- Notion: load Hermes skill `productivity/notion` before reading, querying, creating, or updating Notion pages/databases.
- Hermes setup/tooling: load Hermes skill `hermes-agent` before changing Hermes config, env, tools, profiles, gateway, skills, cron, or MCP setup.

## Safety rules

- Email sends are external actions: draft first and require explicit confirmation before sending.
- Notion writes are workspace writes: inspect/validate the target page/database first; avoid duplicates; do not create disconnected pages when API search returns zero accessible objects.
- If a connector is blocked, create/update ROS Markdown build packs or task files instead of fabricating live status.
