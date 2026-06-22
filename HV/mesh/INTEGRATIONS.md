# HV Integrations & Routines — verified contract

**Version:** 1.0 · **Created:** 2026-06-21 · **Owner:** HV mesh · **Verified live this session**
**Purpose:** The single source of truth for how HV reads/writes its real systems (Notion · Gmail · Google Drive) and the scheduled routines that keep them fed. Every ID below was confirmed working on 2026-06-21 — don't rediscover.

---

## 1. Notion — HollandVest Command Center

**Reachability (important):** the Notion MCP on this runtime can **`fetch` + `create-pages` + `update-page`** by ID, but **`query-data-sources` is Enterprise-gated** (400 "requires Enterprise plan with Notion AI"). `get-teams` returns empty — ignore it, the workspace is reachable by ID. **Pattern: `fetch` the Deals database to get the live collection IDs, then `create-pages` into the right data source.** To *read rows*, use Hermes (`productivity/notion`) or fetch a specific view/page — not the MCP query tool.

**The structure** — one container database ("Deals", id `fe6a7f22-24f4-45ae-9a52-24dbf46083cb`) holds 5 data sources. Use the **collection IDs** as `data_source_id` when creating:

| Data source | collection:// id | Title prop | Key fields |
| :-- | :-- | :-- | :-- |
| 💼 Deals | `8e4fa407-021f-41f8-af78-4b8ced35df43` | Deal Name | Status(Pipeline/Active/On Hold/Completed/Killed), Stage (BRRRR)(Buy/Rehab/Rent/Refi/Repeat/Exit), Sub-Stage, Priority(P0–2), Deal Type, All-in Cost (€), Equity Invested (€), Target ARV/CoC/DSCR, Loan Amount, dates, relations: Property/Area/Main Counterparty |
| ✅ Tasks | `055bdc94-e63c-46f9-a417-8cef8ff2fdc1` | Task | Status(Inbox/Next/In Progress/Waiting/Done), Priority, Category(Legal/Finance/Construction/Design/Leasing/Admin/Other), `date:Due Date:start`, relations: Deal/Property/Area/External Party |
| 📂 Documents & Models | `fad2b7c9-5325-482d-a35f-c6a8fe634170` | Document | Type, Source, File/Link, Version, Valid From/To, relations |
| 🤝 Vendors & Partners | `c3086a7c-e818-4982-835f-51e289349b02` | Name | Type, Region, Fee Model, Performance Rating, Email/Phone, relations |
| 📝 Notes | `0846a3ba-b812-41c0-8513-c0d37b5c7470` | Title | Type(Meeting/Idea/Risk/Opportunity/Decision/Research), Category, Priority/Relevance, Notes (Body), relations |

Also referenced by relations: **Properties** `d4c5b11f-476a-407c-b10d-23e77c6144dc` · **Areas** `c5bc3c4c-e4d2-4481-ba0c-752d06a64f6a`. Command Center page: `20401545ece243e397e18534e701d207`.
> ⚠️ These verified collection IDs supersede the stale database IDs in `/00_System/notion_database_registry.md` (which listed Properties/Tasks/Documents/Vendors/Capital/AREAS as separate DBs). Reconcile the registry to these.

**Write conventions:** select props → option name string; relation props → JSON-array-of-page-URLs **as a string** (e.g. `"[\"https://app.notion.com/p/<id>\"]"`); dates → `"date:<Col>:start"`. Create deals into `8e4fa407…`, link tasks/notes/docs back via the `Deal` relation.

**Written this session:** Zuidpark deal (`386f37e231fe81d4aa3ed8a399b70fd0`, P0), Dries 20 deal (`386f37e231fe81aebfecf6bc57cd0b35`, P1), 5 tasks, 1 research note.

## 2. Gmail

**The MCP Gmail is connected to `bguy.rubin@gmail.com` (Guy's personal), NOT `bhollandvest@gmail.com`.** (Hebrew labels + `[Notion]` integration confirm it.) Therefore:
- **Internal reports to Guy** → draft here (fine; it lands in his inbox).
- **HV outbound to third parties** (brokers, notary, lenders) → **must originate from `bhollandvest@gmail.com` via Hermes `himalaya`**, never from this account (HV identity policy). Draft-first, Level 3 confirm.
- Tool creates **drafts only** here (`create_draft`) — we never auto-send.

## 3. Google Drive

Connected to `bguy.rubin@gmail.com`. Shared-drive root `0AMV-yJyuyYw3Uk9PVA`. **HV working folder: "HollandVest — Deals & Projects" = `1LkTfpnokI4y_VpjBrLj3fCCrvPecIw1D`** (created this session; sibling of "HollandVest IND Submission Pack" `1G7Q_8Y41wN80hk4WXRBj2JxzKCSwVaiQ`). Reports/models go here; link the Drive file into the Notion deal's Documents & Models row. `text/plain` content converts to a Google Doc; pass `disableConversionToGoogleType` to keep markdown.

## 4. Routines (registered in `/00_System/agent-framework/SCHEDULED-LOOPS.md`)

| Routine | Cadence | Does | Posture / gate |
| :-- | :-- | :-- | :-- |
| **HV Weekly Digest** | Mon 08:00 Eu/Amsterdam | Compile best assets + PM RAG from Notion + ROS → Drive doc + **Gmail draft to Guy** | Safe — draft only, no send |
| **HV Project Control** | Fri 16:00 | For each live project (≥G3): `/hv-project-control` → update Notion Tasks + status; draft exceptions | In-workspace + draft |
| **HV Deal Radar (revive)** | Daily 07:00 | Sourcing scan (Pararius/Immoweb + snippets) → write new candidates to Deals/Properties + radar | **Guy-gated** (writes Notion; HV's top infra fix — Hermes) |

**Engine:** Hermes runs the scheduled loops (filesystem + Notion are the baton); Claude Code runs them on-demand via the workflows. The Digest is the only one safe to auto-run unattended (draft-only); Radar stays Guy-gated until the Hermes loop + write-back is confirmed.
