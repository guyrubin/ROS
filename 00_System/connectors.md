# Connectors
Last updated: 2026-06-21

The shared connector registry for Rubin OS. Domain agents inherit this through root `CLAUDE.md` and `/00_System/agent-capabilities.md`.

## Runtime reality — read this first

ROS runs across **two runtimes**, and they reach connectors *differently*. A task that "can't connect" in one is usually available via the other path — use whichever runtime you're in:

- **Hermes** (WSL automation, scheduled/cron, Telegram) → reaches connectors through **skills**: `himalaya` (Gmail), `productivity/notion` (Notion). This is the path the domain `CLAUDE.md` files name.
- **Claude Code / Cowork** (interactive, this runtime) → reaches connectors through **MCP servers** (load schemas via ToolSearch on first use). Gmail, Notion, Calendar, and Drive are **live now via MCP** — you do NOT need a Hermes skill here. **The connected MCP Gmail/Drive/Calendar are on `bguy.rubin@gmail.com`** (verified 2026-06-21); `bhollandvest` + `joseph` mail are reachable **only via Hermes `himalaya`**, not this MCP.
- **The connector layer is a fleet-wide grant** (not a main-loop privilege): every dispatched ROS agent carries it. ROS agent files that do real-world I/O declare `tools: "*"` (see `/00_System/agent-capabilities.md` → "Connector access is a fleet-wide grant"). Verified MCP IDs + the Notion create-by-ID pattern: [`HV/mesh/INTEGRATIONS.md`](../HV/mesh/INTEGRATIONS.md).
- **Codex** (bulk code/file edits) and **Gemini** (generation, multimodal, large-context — both Guy's and **Joseph's** subscriptions) are additional runtimes. ROS is **model/runtime-agnostic** (`/AGENTS.md`): pick the best tool per job and get the most from every connected subscription across both principals.

> **All principal email accounts are connected** (Guy ×2, Joseph ×1 — see the table). Per-principal scoping is governed by `/00_System/principals.md` + `/00_System/identity-policy.md`.

> The old version of this file documented only the Hermes path, which is why Claude Code felt "disconnected." It isn't — it just uses MCP. Below, every connector lists **both** paths.

## Registry

| Connector | Hermes path | Claude Code (MCP) path | Live status | Notes |
|---|---|---|---|---|
| Gmail — `bguy.rubin@gmail.com` | `himalaya` account `bguy` | **Gmail MCP — the connected account** (search/read/draft/label; verified 2026-06-21) | Active | Draft first; never send without explicit confirmation. CoS/KK/EA/PAI/MKT/FIN-by-context. |
| Gmail — `bhollandvest@gmail.com` | `himalaya` account `hollandvest` | **Hermes only — NOT the connected MCP account** | Active (Hermes) | HV + FIN-by-context. HV third-party outbound originates here via Hermes. Draft first. |
| Gmail — `josephdoronrubin@gmail.com` | `himalaya` account `joseph` | **Hermes only — NOT the connected MCP account** | Active (Hermes) | EA when Joseph is sender/primary. Draft first. |
| Notion | skill `productivity/notion` | Notion MCP — **`fetch`+`create`+`update` by ID work; `query-data-sources` is Enterprise-gated** (read rows via Hermes / a view) | Active | Command Centers verified. **Live data-source IDs + the create-by-ID pattern: [`HV/mesh/INTEGRATIONS.md`](../HV/mesh/INTEGRATIONS.md)** (supersede the stale `notion_database_registry.md` IDs). Inspect before writes; no duplicates. |
| Google Calendar | (Hermes: not wired) | Calendar MCP (list/create/update/suggest-time) — account `bguy.rubin` | Active via MCP | Event creation is Level 3 — draft/confirm. KK owns. |
| Google Drive | (Hermes: not wired) | Drive MCP (search/read/create) — account `bguy.rubin` | Active via MCP | Career CV fact-source `1LERQza-…`; **HV "HollandVest — Deals & Projects" `1LkTfpnokI4y_VpjBrLj3fCCrvPecIw1D`**. |
| GitHub | `git`/`gh` where configured | `git` + GitHub MCP (plugin, needs `authenticate`) | Active (git) | ROS repo `https://github.com/guyrubin/ROS`; Arbor `guyrubin/PPPPtherapy-`. |
| Gemini (Google AI) | Gemini CLI / API | Gemini API / Vertex / AI-Studio | Active | Agnostic model choice for generation/multimodal/large-context; Arbor's image+coach path. **Guy + Joseph** both have subscriptions — leverage Joseph's for Joseph-context work. |
| Web search + fetch | Hermes browse | `WebSearch` / `WebFetch` (+ `research-agent`) | Active | Baseline capability; see `agent-capabilities.md`. |
| Browser / computer use | — | Chrome MCP + computer-use (request access) | Available | For web apps without a dedicated MCP, and native apps. |
| Canva / Figma / HeyGen | — | MCP (design/video) | Available | MKT/PAI creative. |
| Product analytics (Amplitude / Pendo) | — | plugin MCP (needs `authenticate`) | **Needs auth** | Feeds Arbor CIL `arbor-critic-feedback`. |
| Slack / Linear / Asana / Atlassian / HubSpot | — | plugin MCP (needs `authenticate`) | **Needs auth** | Wire on demand per domain need. |
| Funda scraper | TBD | TBD | Phase 3 | HV new-listing alerts. |

## Tool capitalization (decided 2026-06-21 — see [`CoS/ROS-CAPITALIZATION.md`](../CoS/ROS-CAPITALIZATION.md))
Four stacks chosen to wire; each needs a one-time `authenticate` (OAuth) — auth the **lead** tool per category first, add siblings only if it doesn't fit. Map to owning team:

| Stack | Lead tool (siblings) | Owning team(s) | Use | Status |
|---|---|---|---|---|
| Comms hub | **Slack** | CoS, KK | status + decisions-needed + command surface | ✅ **Connected** 2026-06-21 — workspace "ROS" (`ros-5pu8645`), user `U0BCVJB86TS`. MCP tools live (send/read/search/schedule). |
| Marketing/SEO | **Ahrefs** (Similarweb/HubSpot) | MKT, PAI/Arbor | keyword/competitor → market+capability critics | ⏳ consent pending — Guy logged in (Guy Rubin's workspace, free plan); finish the 2-click Allow (or paste the `localhost:43667/callback?...` URL to complete). |
| Product analytics | **Amplitude** (Pendo) | PAI/Arbor | usage → CIL `arbor-critic-feedback` | ⚠️ needs org login (not signed in / maybe not set up). Arbor today logs to its own Firestore sink (`lib/analytics.ts`) — Amplitude optional. |
| Project management | **Linear** (Asana/ClickUp) | KK, HV (deal exec), PAI, CoS | task/issue backend beyond Notion | ⚠️ **no Linear workspace exists** under `bguy.rubin@gmail.com` — needs one created (name/region) before connect, or use Notion as the PM backend for now. |

> Capitalize, don't accumulate — wire a tool when a team will use it; an unused connector is clutter (EA client tools stay per-engagement, not global).

## Needs your action to go fully live
- **Authorize the four stacks above** (`authenticate` OAuth) — I'll initiate; you complete the sign-in. Gradual: start with the one or two that unlock the most.
- **Hermes-side** Calendar/Drive are reached via Claude Code MCP today; only wire Hermes equivalents if a *scheduled* loop needs them.

## Required skills by connector (Hermes runtime)
- Gmail/email → `himalaya`. Notion → `productivity/notion`. Hermes config/cron/MCP changes → `hermes-agent`.
- In **Claude Code**, skip these skills — load the MCP tool schemas via ToolSearch instead.

## Safety rules
- Email sends, calendar/event creation, Drive sharing/deletes, Notion writes, and financial actions are **external/workspace writes**: draft first, confirm before executing (per `/CLAUDE.md` Levels 3–5).
- Notion: inspect/validate the target before writing; avoid duplicates; don't create disconnected pages.
- If a connector is blocked in your runtime, try the other runtime's path before falling back to a Markdown build-pack; never fabricate live status.
