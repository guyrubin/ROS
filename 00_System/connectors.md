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
| Gmail — `bguy.rubin@gmail.com` | `himalaya` account `bguy` | **Gmail MCP — the connected account** (search/read/draft/label; verified 2026-06-21). ⚠ MCP **cannot download attachments** — use himalaya for those. | Active | Draft first; never send without explicit confirmation. CoS/KK/EA/PAI/MKT/FIN-by-context. |
| Gmail — `bhollandvest@gmail.com` | `himalaya` account `hollandvest` | **himalaya CLI via WSL** (`wsl.exe -e bash -lc 'himalaya … -a hollandvest'`) — NOT the MCP account. See [`himalaya-mail-runbook.md`](himalaya-mail-runbook.md). | Active | HV + FIN-by-context. Draft first. |
| Gmail — `josephdoronrubin@gmail.com` | `himalaya` account `joseph` | **himalaya CLI via WSL** (`wsl.exe -e bash -lc 'himalaya … -a joseph'`) — NOT the MCP account; read/download-attachment/draft/send all work. See [`himalaya-mail-runbook.md`](himalaya-mail-runbook.md). | Active | EA / Joseph-as-sender. Draft first. |
| Workspace — `support@arborparentingapp.com` (→ `support@jgrubin.com`) | not wired ⏳ | not wired ⏳ | **Mailbox live (Workspace); NOT yet agent-connected** | **Arbor company** support/press/user comms; send-as alias of `support@jgrubin.com` (`arborparentingapp.com` = domain alias of `jgrubin.com`). To agent-enable: add a `himalaya` account or MCP for `support@jgrubin.com` (Workspace app-password / OAuth) — **Guy-gated** (credential). Until then, Arbor support is drafted here, sent by Guy. Identity rules: [identity-policy.md](identity-policy.md). |
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

## Tool capitalization — LEAN stack (revised 2026-06-22; supersedes the 4-stack OAuth plan)
Sourced cost/fit research: [`CoS/ROS-CAPITALIZATION.md`](../CoS/ROS-CAPITALIZATION.md). Rule: **capitalize, don't accumulate** — run the cheapest tool that does the job *now* (free tier), and buy the upgrade only when a named **trigger** fires (a Level-4 cost decision, surfaced in the cockpit). For a pre-launch, bootstrapped, child-data product, the all-incumbent stack (~**$625–775/mo**) would eat ~18% of the €10k budget on tooling not yet needed. The lean stack is ~**€0/mo** today; first justified spend ≈ **€36/mo** (Canva Pro + HeyGen Creator) once viral cadence demands it. Prices are vendor list (verified ~2026-06; re-confirm at purchase).

| Job | Pick now (free) | Owner | Upgrade · trigger | Status |
|---|---|---|---|---|
| Comms | **Slack Free** (90-day history) | CoS, KK | Slack Pro ~$8.75/u · >90-day history hurts | ✅ Connected (`ros-5pu8645`) |
| SEO / competitor | **Search Console + Google Trends + Ahrefs Webmaster Tools** (free) + `research-agent` | MKT, PAI | Ahrefs Lite $129 · content/SEO vs named rivals. SimilarWeb $149 → defer indefinitely | Free — use now |
| Product analytics | **PostHog EU Cloud** (Frankfurt · 1M events/mo free · IP-off) | PAI/Arbor | PostHog paid past 1M events. Amplitude only on the **EU** instance if mandated | Free tier — wire (was "Amplitude needs-auth") |
| PM / tasks | **Notion + markdown backlog** (owned) | all | Linear Basic $10/u · volume outgrows markdown / a human joins | Owned — no new tool |
| Creative | **Canva Free + HeyGen Free** | MKT/Arbor creative | Canva Pro $15 + HeyGen Creator $29 · caps block a real campaign cadence | First justified spend (~€36/mo) |
| Email / lifecycle | **Brevo Free** (300/day) + **Resend Free** (3k/mo transactional) | MKT/Arbor | Brevo Starter ~$9 · send >300/day. **NOT Klaviyo** (e-com priced) | Free — wire behind the consent gate |
| CRM | **none** | — | HubSpot Free CRM (1k contacts) · partner/creator relationships worth tracking | Skip |
| Ad-data | **none** | — | Supermetrics ~€29 · paid spend across 2+ ad platforms | Skip |

> **Two child-data compliance escalations (Guy-gated, before wiring):** (1) **Analytics = PostHog EU** (Frankfurt, DPA, IP-capture off by default) is both cheaper AND the right COPPA/GDPR posture; if Amplitude is ever used it must be the EU/Frankfurt instance, never the US one (CLOUD Act). (2) **Lifecycle email** goes only to the **parent's** address with logged verifiable parental consent — the consent gate lives in the Arbor app, not the ESP. 2025 free tiers shrank (Klaviyo/MailerLite/Slack-90d); build on the durable ones (PostHog 1M · Brevo 300/day · Resend 3k) and keep durable records in ROS markdown so a cap can't trap data.

## Needs your action
- **Drop the speculative OAuths.** Ahrefs (consent-pending), Amplitude (needs-auth), Linear (needs-workspace) are **not needed now** — wire each only when its trigger fires. This removes the pending-OAuth backlog.
- **One near-term setup** (both free, both behind the Arbor parental-consent gate): a **PostHog EU** project (analytics) and a **Brevo** account (lifecycle). I initiate; you approve.
- **Hermes-side** Calendar/Drive are reached via Claude Code MCP today; only wire Hermes equivalents if a *scheduled* loop needs them.

## Required skills by connector (Hermes runtime)
- Gmail/email → `himalaya`. Notion → `productivity/notion`. Hermes config/cron/MCP changes → `hermes-agent`.
- In **Claude Code**, skip these skills — load the MCP tool schemas via ToolSearch instead.

## Credential store (semi-sensitive, non-money)
API keys/tokens for DNS/tooling/connectors live in the **gitignored** store **[`/00_System/secrets/`](secrets/README.md)** (`keys.env`; load `set -a; source 00_System/secrets/keys.env; set +a`). First key: `GODADDY_API_KEY`/`_SECRET` (DNS). **Money/financial + prod app secrets NEVER go here → GCP Secret Manager.** Policy + non-secret registry: `secrets/README.md`.

## Safety rules
- Email sends, calendar/event creation, Drive sharing/deletes, Notion writes, and financial actions are **external/workspace writes**: draft first, confirm before executing (per `/CLAUDE.md` Levels 3–5).
- Notion: inspect/validate the target before writing; avoid duplicates; don't create disconnected pages.
- If a connector is blocked in your runtime, try the other runtime's path before falling back to a Markdown build-pack; never fabricate live status.
