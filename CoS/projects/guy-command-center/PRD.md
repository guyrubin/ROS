# Guy Rubin Command Center — PRD

**Status:** v2 shipped (was Draft v1)  
**Owner:** Guy Rubin  
**Product lead:** CoS / Hermes  
**Created:** 2026-05-31  
**Project path:** `/CoS/projects/guy-command-center/`  
**Artifact:** `index.html`

---

## 1. Executive summary

The Guy Rubin Command Center is a small, visual, local-first cockpit for running Guy's daily operating system across ROS, Claude/Cowork, Hermes, Obsidian, and Google workflows.

It is not a generic productivity dashboard. It is a personal heads-up display that makes the next action obvious, keeps exactly one front-seat mission visible, and routes all other domains into a compact visual map: war/geopolitics, investments, finance/admin, work, ventures, travel, family, fitness, and art/energy.

The product starts as a single self-contained HTML file and Markdown project folder inside ROS, then grows only where the integrations prove daily use: Hermes morning routing, Gmail/action triage, Notion/ROS project state, and approved Google Calendar time blocks.

---

## 2. Problem

Guy already has powerful systems — ROS, Hermes, Claude/Cowork, Gmail, Notion, Obsidian-style Markdown, Google Calendar — but daily attention can still fragment across tools, domains, and contexts.

Current pain points:

- Too many domains compete at once: HV investments, EA work, PAI ventures, finance/admin, travel, family, fitness, marketing/content.
- The most important next action can get buried under email, subscriptions, open projects, and research trails.
- Calendar and health blocks happen only if they are made explicit.
- War/geopolitics and market signals are useful only when translated into actionable impact for Guy/HV/EA/PAI.
- Obsidian/Markdown, Notion, Hermes, and Claude need one visible command surface, not separate mental models.

---

## 3. Goals

### Primary goal

Create a compact daily command center that tells Guy: **what is the one thing in the front seat right now, what is next, what can wait, and what signals require action.**

### Product goals

1. **One-screen clarity:** Show the whole operating picture without forcing navigation across apps.
2. **One active mission:** Make the front-seat task visually dominant.
3. **Domain routing:** Map each task/signal to the correct ROS domain and agent.
4. **Integration-ready:** Work immediately as static HTML/Markdown, while allowing Hermes, Google, Notion, and Obsidian upgrades.
5. **Low overhead:** No heavy app stack unless usage proves the need.
6. **Personal fit:** Reflect Guy's actual domains, family context, travel rules, investment focus, and operating preferences.

---

## 4. Non-goals

- Build a full SaaS app.
- Replace Notion as the operational project/task database.
- Replace ROS Markdown as durable knowledge storage.
- Send emails, create calendar events, share files, or update external systems without explicit approval.
- Show fake metrics or decorative data that does not support a decision.
- Become a complex dashboard that needs maintenance before it creates value.

---

## 5. Users and stakeholders

### Primary user

**Guy Rubin** — uses the dashboard for daily routing, focus, decision support, and cross-domain command.

### Secondary agent users

- **Hermes:** executes routing, automation, cron jobs, connector workflows, Telegram interaction.
- **Claude/Cowork:** reads and edits ROS files; can update the PRD and dashboard via shared filesystem.
- **Obsidian:** provides browse/search/linking over the Markdown project folder.
- **Notion:** optional operational dashboard/database surface for tasks/projects.

---

## 6. Core use cases

### UC1 — Morning routing

Guy opens the command center or asks Hermes for morning routing.

Expected output:

- Top five actionable tasks only.
- One recommended front-seat mission.
- Back-seat queue for next items.
- Trunk for lower-priority carryover.

### UC2 — Front-seat execution

Guy selects one task and starts a focus timer.

Expected behavior:

- Exactly one mission is visually dominant.
- Timer supports 25-minute focus by default.
- The rest of the work is intentionally de-emphasized.

### UC3 — War/investment signal check

Guy asks for a war-room signal brief.

Expected output:

- Geopolitics / war / sanctions / supply-chain signal.
- Markets / rates / finance impact.
- Dutch real-estate / HV relevance.
- EA / PAI relevance only if actionable.
- No generic news recap.

### UC4 — Health and time-blocking

Guy asks Hermes to create or draft daily blocks.

Expected output:

- Deep work block.
- Stretch/movement block before long sitting periods.
- Run/recovery block.
- Explicit approval before writing to Google Calendar.

### UC5 — Brain dump and promotion

Guy records a quick thought.

Expected behavior:

- Temporary thought saves locally.
- Durable facts are later promoted into the correct ROS Markdown file.
- The dashboard does not become an unstructured memory graveyard.

---

## 7. Functional requirements

### FR1 — Visual front seat

- Display one editable mission field.
- Display visual metaphor of seat/seatbelt or equivalent focus marker.
- Display a focus timer with start/reset.
- Support close-day logging locally.

### FR2 — Domain status board

Show at least these domains:

- HV — Investments / Real Estate
- EA — Work / Architecture
- PAI — Ventures
- KK — Personal Ops
- FIN — Finance/Admin
- MKT — Content / Brand

Each domain card should include:

- Status color: Green / Amber / Red.
- One-line current context.
- Owner/agent implied by ROS domain.

### FR3 — Compact life map

Show the broader map:

- War / geopolitics
- Investments
- Finance
- Travel
- Fitness
- Family
- Work
- Art / energy

Each tile must describe the decision/output it supports.

### FR4 — Back seat and trunk

- Back seat shows next tasks.
- Trunk shows deferred tasks.
- The design should reinforce that deferred work is allowed and not urgent.

### FR5 — Command palette

Provide copy-ready prompts for:

- Morning routing.
- War/investment signal brief.
- Fitness/calendar block.

### FR6 — Connector status

Show current connector reality:

- Hermes available.
- Claude/Cowork can use ROS filesystem.
- Obsidian can index Markdown project files.
- Gmail is active through Himalaya.
- Google Calendar/Drive/Docs need OAuth before direct API actions.
- Notion integration is available for future promotion.

### FR7 — Obsidian/Markdown entry

Maintain an Obsidian-friendly Markdown entry note that includes:

- Link to dashboard path.
- Daily operating loop.
- Prompt shortcuts.
- Connector reality.

### FR8 — Local-first implementation

- The initial dashboard must run as a static file.
- No build step required.
- No external JavaScript dependency required.
- LocalStorage may be used only for temporary notes/state.

---

## 8. Non-functional requirements

### NFR1 — Small and efficient

- Single HTML file for v1.
- No package manager or server required.
- Fast open time from local filesystem.

### NFR2 — Visual but not noisy

- High-density layout is acceptable.
- No fake analytics.
- No generic SaaS card clutter.
- Visual metaphor supports behavior, not decoration.

### NFR3 — Mobile-tolerant

- Layout must collapse to one column on narrow screens.
- Buttons and inputs should remain usable on mobile.

### NFR4 — Agent-readable

- Product files must be plain Markdown/HTML.
- Exact paths should be documented.
- Agents should be able to update the project without hidden app state.

### NFR5 — Safety

- External writes require explicit confirmation.
- Email sends, calendar event creation, Drive sharing/deletes, Notion writes, and financial actions are gated.

---

## 9. Data and source-of-truth model

### Current v1

- Dashboard UI: `index.html`
- Project documentation: `README.md`
- Obsidian entry: `Command Center - Obsidian Entry.md`
- Temporary browser state: localStorage only

### Intended source of truth by data type

- Durable knowledge: ROS Markdown.
- Operational project/task state: Notion if connected; Markdown fallback if unavailable.
- Inbox signals: Gmail through Himalaya.
- Calendar blocks: Google Calendar only after OAuth + approval.
- Agent procedures: Hermes skills/cron jobs if promoted.
- Sensitive documents: outside Git unless explicitly approved.

---

## 10. Integration requirements

### Hermes

- Provide Telegram-accessible prompts.
- Future: cron job for morning routing.
- Future: script/tool to draft calendar blocks.
- Future: live signal card generation with source citations.

### Claude/Cowork

- Must be able to read/edit project files from Windows ROS path.
- Should use the PRD and README as product context.

### Obsidian

- Project folder must be Markdown-indexable.
- Entry note should use wikilinks where useful.

### Google

- Gmail: use Himalaya for inbox/action triage.
- Calendar/Drive/Docs: use Google Workspace OAuth only after setup.
- No Google writes without approval.

### Notion

- Optional next step: sync front-seat/back-seat/trunk state into existing Command Center databases.
- Avoid disconnected duplicate pages.

---

## 11. MVP scope

MVP is complete when:

- `index.html` opens locally and renders the full cockpit.
- One editable front-seat mission exists.
- Timer works.
- Domain board exists.
- Compact map exists.
- Command palette buttons update prompts.
- Brain dump saves locally.
- README and Obsidian entry exist.
- Browser console has no JavaScript errors.

Current status: **MVP implemented and verified.**

---

## 12. V1.1 backlog

1. **Morning-routing cron**
   - Create Hermes cron job that delivers daily top five tasks to Telegram.
   - Include one recommended front-seat mission.

2. **Google Calendar OAuth**
   - Complete Google Workspace setup for Calendar scope.
   - Add approved time-block creation workflow.

3. **Notion operational sync**
   - Map Front Seat / Back Seat / Trunk to existing Notion Command Center tasks.
   - Upsert by stable title or ID; avoid duplicates.

4. **Live signal cards**
   - Add source-grounded war/geopolitics/investment brief generation.
   - Keep only actionable implications.

5. **Markdown task fallback**
   - Add a small `state.md` or `tasks.md` only if Notion is unavailable or too slow.

6. **Dashboard polish**
   - Add density/theme toggle only if useful.
   - Keep visual scope compact.

---

## 13. Acceptance criteria

### Product acceptance

- Guy can open one file and understand the day at a glance.
- Guy can identify one front-seat mission within 10 seconds.
- The dashboard reflects Guy's actual domains, not generic categories.
- The command palette produces usable prompts for Hermes/Claude.
- The project is discoverable in Obsidian/ROS.

### Technical acceptance

- HTML opens directly from local filesystem.
- No runtime install required.
- No JavaScript console errors.
- Markdown files are readable and linked.
- Git tracks only safe project files.

### Safety acceptance

- Any external action remains approval-gated.
- Temporary localStorage notes are not mistaken for durable memory.
- Durable facts are promoted to ROS Markdown deliberately.

---

## 14. Open decisions

1. **Notion vs Markdown state:** Should live task state be synced to Notion first, or should the dashboard get a local Markdown state file first?
2. **Calendar automation:** Should Hermes complete Google OAuth for Calendar now, or keep calendar workflows as draft prompts until the dashboard proves daily use?
3. **Signal sources:** Which sources should feed war/investment cards — official feeds, RSS/news, market data, curated sources, or manual Hermes research?
4. **Daily delivery:** Should the morning command center briefing arrive automatically in Telegram every weekday, every day, or only on request?

---

## 15. Success metrics

Because this is a personal operating artifact, success is behavioral rather than vanity analytics.

- Guy uses the dashboard at least once per day for planning or closing.
- The front-seat mission is selected before reactive inbox work begins.
- At least one health/deep-work time block is scheduled on workdays.
- Fewer important tasks are buried in email or subscriptions.
- War/investment updates are consumed only when they change a decision.

---

## 16. Implementation plan

### Task 1 — Link PRD from project README

**Objective:** Make the PRD discoverable from the project homepage.

**File:** `CoS/projects/guy-command-center/README.md`

Add a bullet near the top:

```markdown
- **PRD:** `PRD.md`
```

**Verification:** `read_file` confirms the link appears.

### Task 2 — Link PRD from Obsidian entry

**Objective:** Make the PRD visible in Obsidian navigation.

**File:** `CoS/projects/guy-command-center/Command Center - Obsidian Entry.md`

Update the top link line to include:

```markdown
[[PRD|PRD]]
```

**Verification:** `read_file` confirms the wikilink appears.

### Task 3 — Decide next integration

**Objective:** Pick the next functional upgrade.

Recommended order:

1. Morning-routing cron.
2. Google Calendar OAuth/time blocks.
3. Notion task sync.
4. War/investment live signal cards.

**Verification:** Chosen decision is recorded in this PRD under Open Decisions or in project README.

---

## 17. Changelog — v2 (2026-05-31)

Enhancement pass over the v1 static dashboard. All v1 acceptance criteria still hold; v2 adds:

**Live + editable state (FR1–FR6 extended)**
- Front-seat mission, mission domain, domain statuses, domain context lines, back-seat/trunk tasks, signals, fitness rings, focus sessions, and brain-dump all persist to `localStorage` (`cc2`, versioned).
- Domain cards click-cycle 🟢→🟡→🔴; context/task/signal text is inline-editable; tasks can be added/checked/deleted.
- Daily rollover resets fitness rings + session count on date change.

**Deeper integrations (§10)**
- **Google Calendar (no OAuth):** prefilled `calendar.google.com/render` template links for today's deep-work (09:00, 90m), stretch (12:00, 15m), and run (18:00, 45m) blocks, exposed in Quick Links and ⌘K. Direct API writes remain a gated V1.1 item.
- **Obsidian:** `obsidian://open?vault=ROS&file=…` deep links from connectors, quick links, ⌘K, and shift-click on domain cards.
- **Gmail:** compose deep link that carries the current agent prompt.
- **Export/interop:** JSON export of all state; "Copy today as Obsidian daily note" generates a `# Daily Note — YYYY-MM-DD` with domains, tasks, signals, fitness, and dump — keeping ROS Markdown as durable source of truth.

**Visual + UX**
- ⌘K/Ctrl+K command palette (19 fuzzy-searchable actions, keyboard-driven).
- Focus **ring** timer with 25/50/90 modes, session dots, completion auto-log + toast.
- Fitness rings (Move/Stretch/Run), world clocks (AMS/BRU/TLV), workday-progress bar, density toggle, toasts.

**Non-functional:** still a single dependency-free HTML file; `.claude/launch.json` adds a `command-center` static-server entry for local preview. Verified: 0 console errors; all dynamic sections render (6 domains, 8 map tiles, 6 tasks, 3 rings, 3 signals, 6 connectors, 9 links, 3 clocks); palette/cycle/add/persist/prompt/export interactions tested green.

### Updated open decisions
- §14.2 (Calendar automation) is partially resolved: prefilled template links ship now; OAuth-based direct creation deferred to V1.1.

---

## 18. Changelog — v3 (2026-05-31): voice-agentic file system

Re-architected from "live dashboard" to a **shared agentic file system** so Hermes and Claude operate on the same truth and the cockpit drives real work.

**Architecture**
- **`state.json`** is now the canonical source of truth (front seat, domains, map, tasks, signals, fitness, **clients**, **actionQueue**, integrations). The dashboard fetches it on load (when served), renders it, and treats local edits as *proposals* (Pull / Push). `localStorage (cc3)` is only an edit buffer.
- **`AGENT-SYNC.md`** — the Hermes⇄Claude contract: source-of-truth, write protocol (last-write-wins + `meta.updatedBy/updatedAt`), the **action queue** verb registry, safety gates (per `/CLAUDE.md` 0–5), voice grammar, and the EA-client scaffold protocol.
- **Agentic loop:** voice / ⌘K / edits append intents to `actionQueue`; agents drain it via the right connector and write results back.

**Voice (FR new)**
- In-dashboard mic (Web Speech API) + documented Telegram→Hermes path. Natural-language routing: front seat, task, signal (+severity), client status, calendar block, draft email, remember/promote. Graceful fallback when speech isn't supported.

**EA client support (this engagement)**
- **EA Client Cockpit** card driven by `state.json.clients[]`: name, stack, RAG (click-cycle), phase, next decision, stakeholders, milestones (checkable), Drive/Notion/ROS deep links.
- One-click **Scaffold** queues `drive.folder` + ROS folder + `notion.upsert` (gated). **HLD / ADR / Review / Kickoff / Meeting** buttons enqueue intents *and* load a ready agent prompt, wired to skills (`hld-writer`, `adr-writer`, `architecture-review`) and the EA sending identity (`josephdoronrubin@gmail.com`).

**Integrations made real (§10 corrected)**
- Gmail, Calendar, Drive, Notion are **live now via Claude MCP** (not "needs OAuth"). Connectors render real status from `state.json.integrations`. Direct external writes remain safety-gated (draft/confirm).
- Tailored, connector-aware prompts replace the generic ones (morning sync, EA mail triage, HLD, signal refresh, time blocks, close day).

**Verified:** served via `command-center` launch config; dashboard fetched `state.json` (confirmed `meta.updatedBy:"claude"`, not the embedded fallback); 0 console errors; EA scaffold → 3 queued intents (2 gated); voice routing for task/client/signal all green; 8 connectors, 27 palette actions, sync dirty-flag working.

### Updated open decisions (v3)
- §14.1 (state model): **resolved** → `state.json` canonical, optional Notion mirror later.
- §14.2 (voice): in-dashboard mic shipped; Telegram→Hermes voice loop is the next Hermes skill.
- **New — needs Guy:** the EA client's **name** and **cloud/stack** (Azure/AWS/GCP) + tools (Slack/Jira/Confluence/DevOps) to finish-tailor the cockpit and scope client-side connectors.
