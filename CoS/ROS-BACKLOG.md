# Rubin OS (ROS) — Prioritized Build Backlog

**Version:** 1.0
**Created:** 2026-06-21
**Owner:** ROS CoS (delivery lead)
**Source:** Synthesized from the 6 ROS assessments (Org, Runtime, Autonomy, Memory, Observability, Multi-principal) + [`CoS/ROS-PRD.md`](ROS-PRD.md)
**Status:** Active delivery queue

> **Scoring:** `score = round(impact × 4 / effort)` using each assessment's impact/effort. Higher = do first.
> **Rule:** every item names the existing asset it `buildsOn` (or is flagged **NEW** + justified), an `owner`, and whether it is `humanGated`.
> Items are deduped across all 6 assessments; overlapping recommendations are merged into one (sources noted).

---

## 🎯 Top 10 — do first

| # | Item | Score | Owner | BuildsOn | Gated |
| :-: | :-- | :-: | :-- | :-- | :-: |
| 1 | **Git-derive freshness in `build-state.mjs`** (kill the header-gameable false-green) | **20** | CoS | `guy-command-center/build-state.mjs` (memoryDate) | No |
| 2 | **Mandatory write-back step on every scheduled loop** (ends the "not connected" disconnect) | **10** | CoS | `SCHEDULED-LOOPS.md` Rules + each `<DOMAIN>/MEMORY.md` | No |
| 3 | **Add a principal layer** (`/00_System/principals.md` + boot declares active principal) | **10** | CoS | root `MEMORY.md` People table + `identity-policy.md` + `AGENTS.md` boot | No |
| 4 | **Promote Stage-6 LEARN into the domain Definition-of-Done gate** (stop inter-session rot) | **10** | CoS | `agent-framework/UNIVERSAL-LOOP.md` DoD table | No |
| 5 | **Make EA client-specific by structure** (mandatory per-client `CONTEXT.md` as FRAME input + gate) | **8** | EA | `EA/mesh/MESH.md` + `EA/clients/{ABN,Coca-Cola}/` + `identity-policy.md` | No |
| 6 | **Promote `identity-policy.md` into the principal + confidentiality policy** (Guy↔Joseph boundary) | **8** | CoS | `00_System/identity-policy.md` (extend) | Yes |
| 7 | **Activate the 3 compounding read/write loops** (CC morning refresh, Weekly-Review prep, FIN deadline watch) | **10** | CoS | `SCHEDULED-LOOPS.md` proposed rows + `build-state.mjs` + `ros-conductor`/`fin-admin` | Yes |
| 8 | **Add `Reviewed:` heartbeat field** (distinguish "rotting" from "stable & confirmed") | **8** | CoS | `memory-archive-policy.md` + `build-state.mjs` | No |
| 9 | **Loops & Agents panel + `loops[]` in `state.json`** (answer "are my agents running?") | **7** | CoS | `index.html` drawDomains pattern + `state.json` + `SCHEDULED-LOOPS.md` | No |
| 10 | **Resolve the phantom `sync/` layer** (mark retired, strip dangling refs — anti-clutter) | **6** | CoS | `00_System/sync/` (keep `current-path-contract.md`) + `AGENTS.md` | Yes |

---

## Execution status — 2026-06-21

**Applied this session (no-gate foundation):** **#1 A1** git-derived freshness ✅ (verified — MKT correctly flips to STALE where the gamed header read fresh) · **#2 B1** loop write-back rule ✅ · **#3 C1** principal layer (`/00_System/principals.md` + AGENTS boot step) ✅ · **#4 A2** LEARN→DoD gate ✅ · **#5 D1** EA CONTEXT gate ✅ (per-client `CONTEXT.md` already existed; mesh now mandates them) · **#8 A3** `Reviewed:` heartbeat ✅.
**Applied this session (domain sharpening):** **D1** EA CONTEXT gate ✅ · **D2** HV deal-grade DD research lane ✅ (`HV/mesh/DD-brief-template.md` + `research-agent`) · **D3** HV `hv-execution` PM pod ✅ (Renovate/Rent/Refinance; `project-tracker`) · **KK runtime-aware** ✅ (MCP in Cowork, Hermes for crons) + tighter **top-3** triage.
**Gated — await Guy:** **#6** confidentiality-policy promotion · **#7** loop go-live · **#10** retire `sync/` · **C4** Joseph's send rail (credential).

## Theme H — Agnostic / multi-runtime (NEW — Guy, 2026-06-21)

| Item | Score | Owner | BuildsOn | Gated |
| :-- | :-: | :-- | :-- | :-: |
| **H1. Codify agnostic principle + Gemini runtime** — done: `AGENTS.md` design principle + runtime registry (Gemini row), `connectors.md`, `principals.md`. | ✅ | CoS | `AGENTS.md` + `connectors.md` + `principals.md` | No |
| **H2. Agnostic tool-routing guidance** — a one-screen "which runtime/model for which job" rule (Claude=interactive/MCP · Codex=bulk edits · Gemini=gen/multimodal/large-context · Hermes=scheduled) so any session picks the best tool. | 8 | CoS | `AGENTS.md` runtime registry | No |
| **H3. Leverage Joseph's Gemini** — route Joseph-context generation/multimodal to his Gemini subscription. | 6 | EA | `principals.md` + `connectors.md` | Yes |
| **H4. Get-the-most audit** — per connected subscription (Claude/Codex/Gemini/Hermes/MCP), confirm it's used where it's strongest; close gaps. | 5 | CoS | `connectors.md` | No |

---

---

# Next-Level Backlog (from [ROS-STRATEGY.md](ROS-STRATEGY.md)) — make it run like a 50-employee company

> Sequencing (gradual): **manage what exists (M)** → **the Standard (K)** → **Google-as-filesystem (J)** → **skills + tooling loops (I, L)**. Score = `round(impact×4/effort)`.

## Theme M — The management layer (CoS = COO)  *(do first)*
| Item | Score | I/E | Owner | BuildsOn | Gated |
| :-- | :-: | :-: | :-- | :-- | :-: |
| **M1. Wire the management cadence** — daily (cockpit + morning brief), weekly (cross-domain review, per-principal lanes), quarterly (OKRs). Make the conductor actually run it. | **10** | 5/2 | CoS | `ros-conductor` + `weekly-review`/`okr-tracker` skills + `SCHEDULED-LOOPS` | No |
| **M2. Cockpit = the management surface** — finish the Notion Command Center per-domain dashboards + a decisions-needed queue, per-principal (Guy/Joseph) lanes, and a loops/agents status panel. ONE cockpit (retire the local HTML or make it a mirror). | **8** | 4/2 | CoS | Notion Second Brain (`notion-second-brain/`) + `notion_database_registry.md` | Yes |
| **M3. OKRs per department** — quarterly objectives for each mesh; the conductor tracks Green/Amber/Red. | 6 | 3/2 | CoS | `okr-tracker` + `CoS/OKRs/` | No |
| **M4. "Nothing drops"** — every project has an owner + next action; loop write-back enforced (= B1). | 8 | 4/2 | CoS | `UNIVERSAL-LOOP` LEARN gate + Notion Projects DB | No |

## Theme K — The ROS Standard (tool-agnostic excellence + aesthetic)
| Item | Score | I/E | Owner | BuildsOn | Gated |
| :-- | :-: | :-: | :-- | :-- | :-: |
| **K1. Write the ROS Standard** — one doc: substance (correct/sourced/decision-ending) + house voice (executive/direct) + **aesthetic** spec (docs/decks/email/cockpit/Arbor UI). | **8** | 4/2 | CoS | `markdown-instruction-principles.md` + `impeccable`/`design` skills | No |
| **K2. Make the Standard a universal gate** — add "passes the ROS Standard" to every domain DoD; a self-review step before DELIVER. | **8** | 4/2 | CoS | `UNIVERSAL-LOOP` DoD | No |
| **K3. Aesthetic system** — reusable templates + tokens for the human-facing surfaces (Notion dashboards, exported docs, emails, the cockpit, Arbor). | 5 | 4/3 | CoS/MKT | `impeccable` + `theme-factory` + Arbor design system | No |

## Theme J — Google Workspace as the filesystem
| Item | Score | I/E | Owner | BuildsOn | Gated |
| :-- | :-: | :-: | :-- | :-- | :-: |
| **J1. Codify the 3-layer model** — Markdown=brain · Notion=cockpit · **Google Drive=files/deliverables** · Docs/Sheets=artifacts · Gmail/Calendar=comms/time. Into AGENTS.md + the filesystem contract. | **8** | 4/2 | CoS | `AGENTS.md` write-model + `agent-filesystem-contract.md` | No |
| **J2. Per-domain Drive structure** — canonical Drive folders per mesh (HV deals, EA clients, PAI, FIN docs); the file home for deliverables. | 6 | 4/3 | CoS | Drive MCP + Hermes Google OAuth | Yes |
| **J3. Deliverables as Google Docs/Sheets** — HV IC memos, EA HLDs, FIN models produced into Drive (premium-formatted), indexed in ROS + status in Notion. | 6 | 3/2 | each mesh | Drive/Docs MCP + the ROS Standard | Yes |
| **J4. Wire Drive MCP into the meshes** — KK/HV/EA/FIN/PAI read/write their Drive folders (not just local). | 6 | 3/2 | CoS | `connectors.md` Drive (live MCP) | No |

## Theme I — Skill capitalization (most-relevant, not all)
| Item | Score | I/E | Owner | BuildsOn | Gated |
| :-- | :-: | :-: | :-- | :-- | :-: |
| **I1. Per-mesh skill registry** — the few best skills/tools per agent (Claude skills + Hermes skill catalog + MCP), in each `MESH.md`. Select, don't accumulate. | **8** | 4/2 | CoS | each `MESH.md` "Skills" table + Hermes skills catalog | No |
| **I2. Map the Hermes skill catalog → meshes** — research/workspace-agents/workspace-dispatch/note-taking/social-media/etc. to the right domain. | 5 | 3/2 | CoS | `/home/guyru/.hermes/skills` + `connectors.md` | No |

## Theme L — Tooling & Skills continuous-evaluation loop
| Item | Score | I/E | Owner | BuildsOn | Gated |
| :-- | :-: | :-: | :-- | :-- | :-: |
| **L1. Tooling-eval loop** — scheduled read+report: what's used / underused / missing / new in the ecosystem; proposes adopt/drop. (CIL pattern for capability.) | 6 | 4/3 | CoS | the CIL pattern + `SCHEDULED-LOOPS` + `research-agent` | Yes |
| **L2. Acquisition + new-input ingestion** — discover→evaluate→adopt the right tools/skills; `research-agent` feeds new relevant market/tool inputs. OAuth/skill-install stays human-gated. | 5 | 3/2 | CoS | `research-agent` + `connectors.md` | Yes |

## Theme N — Self-improvement engine (ROS-CIL) ✅ built
| Item | Score | Owner | BuildsOn | Gated |
| :-- | :-: | :-- | :-- | :-: |
| **N1. ROS-CIL built** — company-wide self-improving loop: `/00_System/agent-framework/ROS-CIL.md` + lead `ros-evaluator` + workflow `/ros-improve` (light/deep). Audits freshness/management/reality/domains/standard/tooling → scores+verifies → ROS-BACKLOG + State of the Company → safe fixes; human ships gated. | ✅ | CoS | the Arbor CIL pattern + the agent framework | No |
| **N2. Turn the ROS-CIL crons live** — weekly-light + monthly-deep on Hermes. | 8 | CoS | `SCHEDULED-LOOPS.md` | Yes |
| **N3. First deep run** — produce the first real "State of the Company" + fix wave. | 8 | CoS | `/ros-improve mode:"deep"` | No |

---

## Theme A — Stop the memory rot

| Item | Score | Impact/Effort | Owner | BuildsOn | Gated |
| :-- | :-: | :-: | :-- | :-- | :-: |
| **A1. Git-derive freshness in `build-state.mjs`** — replace header read with `git log -1 --format=%cs`; header stays a human label. ~15 lines. *(Top 10 #1)* | **20** | 5/1 | CoS | `build-state.mjs` (memoryDate, ~L42-46) | No |
| **A2. Promote Stage-6 LEARN into the DoD gate** — add "memory write/heartbeat recorded" as a mandatory line in every domain DoD; a lead can't report a frame done without it. *(Top 10 #4)* | **10** | 5/2 | CoS | `UNIVERSAL-LOOP.md` DoD-by-domain table | No |
| **A3. Add a `Reviewed: YYYY-MM-DD` heartbeat** — `staleDays = today − max(last-commit, Reviewed)`; quiet FIN reads green after review, HV with uncommitted work reads red. *(Top 10 #8)* | **8** | 4/2 | CoS | `memory-archive-policy.md` (Append format) + `build-state.mjs` | No |
| **A4. Turn the Monday hygiene cron into a remediation loop** — run `build-state.mjs`, then dispatch each git-stale domain's lead to a SENSE→LEARN refresh and open a **draft commit**. Workspace-write only. | **7** | 5/3 | CoS | live cron `bc55de81f9f1` + `build-state.mjs` + `/.claude/agents/ros/` leads | Yes |
| **A5. Wire `session-audit` to fire automatically** — Stop-hook in `settings.json` after meaningful ROS file changes, so learnings get written before context is lost. | **5** | 4/3 | CoS | `session-audit.md` + `.claude/settings.json` hooks | Yes |

---

## Theme B — Unify the two runtimes

| Item | Score | Impact/Effort | Owner | BuildsOn | Gated |
| :-- | :-: | :-: | :-- | :-- | :-: |
| **B1. Mandatory write-back on every scheduled loop** — each loop appends a dated one-liner to its owning `MEMORY.md` (+ `state.json` findings). Level-2 workspace-write, no new grant. The single fix that ends the disconnect. *(Top 10 #2)* | **10** | 5/2 | CoS | `SCHEDULED-LOOPS.md` Rules + each `<DOMAIN>/MEMORY.md` + `build-state.mjs` precedent | No |
| **B2. Define runtime division-of-labor as a one-screen table in `AGENTS.md`** — Hermes = scheduled write-back loops + Telegram; Claude = interactive + MCP + meshes; Codex = bulk edits; filesystem is the only handoff. | **8** | 4/1 | CoS | `AGENTS.md` runtime registry + `connectors.md` "Runtime reality" | No |
| **B3. One verifiable schedule registry + loop run-ledger** — reconcile `list_scheduled_tasks` (Claude) + Hermes `crontab -l` into `SCHEDULED-LOOPS.md` with last-verified date; append-only ledger (last-run/next-run/found/shipped) so the kill-switch rule is enforceable. *(merges Runtime + Autonomy recs)* | **6** | 4/2+3/2 | CoS | `SCHEDULED-LOOPS.md` + `scheduled-tasks` MCP + Hermes cron + `state.json` | No |
| **B4. Resolve the phantom `sync/` layer** — mark `MERGE-...PUSH.md` plan retired, strip dangling refs; keep `current-path-contract.md` as the core. Do NOT rebuild the plugin. *(Top 10 #10)* | **6** | 3/2 | CoS | `00_System/sync/` + `AGENTS.md` write-model | Yes |
| **B5. Descope the AGENT-SYNC actionQueue drainer** — mark voice/queue parts explicitly future-scope (nothing fills the queue). Anti-over-promise; revisit only when a real voice input exists. | **3** | 2/3 | CoS | `AGENT-SYNC.md` actionQueue + verb registry | Yes |

---

## Theme C — Serve Joseph (multi-principal)

| Item | Score | Impact/Effort | Owner | BuildsOn | Gated |
| :-- | :-: | :-: | :-- | :-- | :-: |
| **C1. Add a principal registry + active-principal boot** — `/00_System/principals.md` (accounts, default domains, privacy class, ownership) + one line in `AGENTS.md` boot to declare/confirm active principal. Keystone for everything else. *(merges Org + Multi-principal recs; Top 10 #3)* | **10** | 5/2 | CoS | root `MEMORY.md` People table + `identity-policy.md` + `AGENTS.md` boot | No |
| **C2. Promote `identity-policy.md` into principal + confidentiality policy** — which domains are Guy-private / Joseph-private / shared; non-negotiable "never surface one principal's private domain in the other's session." Extends EA client-vs-client gate to the principal axis. *(Top 10 #6)* | **8** | 5/2 | CoS | `identity-policy.md` (extend) | Yes |
| **C3. Tag every domain mesh + routing entry with an owner-principal** — add owner/shared attribute to `routing.md` matrix + each `MESH.md` header so routing picks default identity and a mesh refuses wrong-principal exposure. | **8** | 4/2 | CoS | `routing.md` matrix + each `<DOMAIN>/mesh/MESH.md` Owner header | No |
| **C4. Unblock Joseph's outbound identity + reconcile the status contradiction** — populate Himalaya app password for `josephdoronrubin`, confirm MCP Gmail, set one source-of-truth status (resolves `identity-policy.md` "blocked" vs `connectors.md` "Active"). | **8** | 4/2 | FIN | `connectors.md` + `identity-policy.md` Gmail registry | Yes |
| **C5. Give Joseph an entry surface in EA + FIN meshes** — add a short "Principals" note to each (requesting principal, default sending account, pointer to confidentiality policy) so a Joseph-led session behaves correctly without a new mesh. | **6** | 3/2 | EA | `EA/mesh/MESH.md` + `EA/CLAUDE.md` + `FIN/mesh/MESH.md` + `FIN/CLAUDE.md` | No |
| **C6. Multi-principal loops** — parallel read-only morning brief over `josephdoronrubin@gmail.com` (EA) + his FIN slice; reuses existing triage machinery, second delivery target. | **6** | 3/2 | EA | live loop `333eaf638d76` + `identity-policy.md` + FIN deadline-watch loop | No |

---

## Theme D — Sharpen weak teams: EA / HV / KK

| Item | Score | Impact/Effort | Owner | BuildsOn | Gated |
| :-- | :-: | :-: | :-- | :-- | :-: |
| **D1. Make EA client-specific by structure** — mandatory per-client `EA/clients/[client]/CONTEXT.md` (estate, stakeholders, in-flight decisions, decision log) as FRAME-step input + the gate's first check. Agent becomes client-specific by context, not a new agent. *(Top 10 #5)* | **8** | 4/2 | EA | `EA/mesh/MESH.md` + `EA/clients/{ABN,Coca-Cola}/` + `EA/MEMORY.md` | No |
| **D2. Give HV a deal-grade DD research lane** — HV dispatches shared `research-agent` with an HV DD-brief template (comps, area trajectory, vendor vetting, WWS/regulation) and owns synthesis into the IC memo. Muscle becomes HV's, research stays KK-owned. | **6** | 3/2 | HV | `HV/mesh/MESH.md` + `KK/research/MESH.md` (research-agent) + **NEW** DD-brief template | No |
| **D3. Add an HV deal-execution (PM) pod `hv-execution`** — owns Renovate/Rent/Refinance: renovation milestones, vendor follow-through, permit status, refinance coordination; writes to orphaned `HV/06_Renovation`, `07_Financing`, `08_Vendors`; uses `project-tracker` skill as engine. | **5** | 4/3 | HV | `HV/mesh/MESH.md` (add pod) + `project-tracker` skill + `HV/06,07,08` | No |
| **D4. Upgrade 08:30 morning routing into a synthesized daily operating brief** — widen the inbox-only triage to also read calendar + Notion tasks + per-domain `MEMORY.md` "Next:" lines (same sources `build-state.mjs` parses). Read-only, no grant. | **4** | 4/2 | KK | live loop `333eaf638d76` + `build-state.mjs` parsers + Calendar/Notion MCP | No |
| **D5. Allow within-client EA fan-out** — permit `ea-lead` to fan out same-client sub-tasks (parallel current-state review per practice area, control-matrix population, evidence gathering), modeled on `hv-sourcing` batch pattern; cross-client leakage still forbidden. | **4** | 3/3 | EA | `EA/mesh/MESH.md` (roster guidance) + `arbor-mesh` fan-out pattern | No |
| **D6. Reconcile HV folder schema** — collapse competing numbering (`02_Areas`/`02_Sourcing`, `03_Analysis`/`03_Deals`/`deals/`) to the `HV/CLAUDE.md` file map. Foundation housekeeping. | **4** | 2/2 | HV | `HV/CLAUDE.md` file map + `HV/` tree | No |

---

## Theme E — Autonomy loops

| Item | Score | Impact/Effort | Owner | BuildsOn | Gated |
| :-- | :-: | :-: | :-- | :-- | :-: |
| **E1. Activate the 3 compounding read/write loops** — CC morning refresh (`node build-state.mjs`), Weekly-Review prep (Fri), FIN deadline watch. Refresh gets Level-2 workspace-write; review/watch stay read-and-report. Kills "dashboard wasn't fed." *(merges Autonomy + Memory + Observability recs; Top 10 #7)* | **10** | 5/2 | CoS | `SCHEDULED-LOOPS.md` proposed rows + `build-state.mjs` + `ros-conductor`/`fin-admin` | Yes |
| **E2. Confirm Arbor CIL nightly-eval + weekly-build crons** — activate the sanctioned autonomous mode (critic→score→verify→build-to-green→human ships); never auto-merges, never auto-builds gated classes. | **8** | 4/2 | PAI | `CIL.md` cadence + `arbor-improve.workflow.js` + `SCHEDULED-LOOPS.md` Arbor rows | Yes |
| **E3. Activate HV Deal Radar loop** — feed the pipeline (read-and-report; pairs with B1 write-back). | **8** | 4/2 | HV | `SCHEDULED-LOOPS.md` HV Deal Radar (proposed) + `build-state.mjs` | Yes |
| **E4. Build the ROS-wide self-improvement loop ("ROS-CIL")** — generalize the Arbor CIL over the OS: critic→backlog→fix on stale memory, broken routing, doc drift, dead skills. Reuse `arbor-improve.workflow.js` shape; re-scope `bc55de81f9f1` as the eval stage, add the build half (fixes on a branch). Nightly eval + weekly build, same gates. The biggest structural move. | **5** | 5/4 | CoS | `CIL.md` + `arbor-improve.workflow.js` + cron `bc55de81f9f1` + `ros-hygiene-runbook.md` | Yes |

---

## Theme F — Cockpit (observability)

| Item | Score | Impact/Effort | Owner | BuildsOn | Gated |
| :-- | :-: | :-: | :-- | :-- | :-: |
| **F1. Loops & Agents panel + `loops[]` in `state.json`** — id/owner/cadence/lastRun/nextRun/status/lastResult rendered green/amber/red, seeded from `SCHEDULED-LOOPS.md`. Direct cure for "are my agents running?" *(Top 10 #9)* | **7** | 5/3 | CoS | `index.html` drawDomains pattern + `state.json` + `SCHEDULED-LOOPS.md` | No |
| **F2. Decisions-Needed queue** — scrape "Needs Guy / BLOCKER / blocked-on / gated" from domain + mesh memory into `decisions[]` (text, domain, **owner: guy/joseph/shared**, age, safety level); render as top card. What a CEO cockpit must show. | **7** | 5/3 | CoS | `state.json` actionQueue concept + `build-state.mjs` (rootNextFor) + CoS "Decisions needed" mandate | No |
| **F3. Extend `build-state.mjs` to stamp loop run/status + render orphaned `arborPulse`** — populate `loops[].lastRun/status`; draw `arborPulse` on the PAI card (currently written, never rendered). | **8** | 4/2 | CoS | `build-state.mjs` (writes arborPulse + freshness) + `index.html` | No |
| **F4. Make the cockpit multi-principal** — principal field on domains/clients/tasks/decisions/loops + Guy/Joseph/All topbar toggle; re-title to **"Rubin OS Command Center."** One dashboard, filtered — never fork. | **5** | 4/3 | CoS | `index.html` + `state.json` clients[].owner + `identity-policy.md` | No |
| **F5. Make CC morning refresh live** — schedule `build-state.mjs` weekday mornings (read+workspace-write). *(Implemented by E1; tracked here for the cockpit-freshness outcome.)* | **6** | 3/2 | CoS | `SCHEDULED-LOOPS.md` CC morning refresh + `build-state.mjs` | Yes |
| **F6. Runtime heartbeat strip** — track `meta.updatedBy` (claude/hermes/dashboard) as last-seen per writer: "Hermes ✓ 2h ago · Claude ✓ now." Makes the dual-runtime architecture observable. | **6** | 3/2 | CoS | `AGENT-SYNC.md` write protocol + `state.json` meta + `index.html` drawSync | No |

---

## Theme G — Prove the org

| Item | Score | Impact/Effort | Owner | BuildsOn | Gated |
| :-- | :-: | :-: | :-- | :-- | :-: |
| **G1. Activate one domain loop per mesh + freshen memory** — turn on lowest-risk read-only loops (HV Deal Radar, FIN deadline watch, CC refresh), each ending by writing its `MEMORY.md` (Principle 7). Converts paper meshes into a running org. *(overlaps E1/E3 + B1; sequence behind principal + EA/HV fixes)* | **8** | 4/2 | CoS | `SCHEDULED-LOOPS.md` proposed loops + `build-state.mjs` | Yes |
| **G2. Add Conductor Guy-lane / Joseph-lane** — `ros-conductor` reports priority per principal in the weekly review, not just "Guy's goals / Guy's time." *(depends on C1)* | **6** | 3/2 | CoS | `CoS/mesh/MESH.md` + `principals.md` | No |

---

## Prune / consolidate (remove clutter)

| Clutter | Action | Why |
| :-- | :-- | :-- |
| **Phantom `sync/` implementation** (`MERGE-CLAUDE-WORK-INTO-HERMES-PUSH.md` advertises HLD/ADRs/scripts/hermes-plugin that don't exist on disk) | Mark plan **SUPERSEDED/retired**, strip dangling references; keep only `current-path-contract.md`. *(B4)* | Map doesn't match territory — itself a source of the "mess" feeling. Do NOT resurrect the plugin (constitution forbids parallel systems). |
| **AGENT-SYNC voice→actionQueue drainer** | Explicitly mark **future-scope**; do not instrument. *(B5)* | Nothing fills the queue; instrumenting a drainer for an empty queue is over-promise clutter. |
| **Header-derived freshness** (`Last updated:` line) | Demote to a human label; git becomes the source of truth. *(A1)* | Gameable false-green (MKT shows 0d while only committed memory is the initial import). |
| **Empty/duplicate HV folders** (`02_Sourcing`, `03_Analysis`, bare `deals/`, `04_Assets` empty; competing numbering) | Reconcile to `HV/CLAUDE.md` map; delete dead empties. *(D6)* | Filesystem contradicts the team's own filesystem contract. |
| **Second dashboard / second scheduler / rebuilt sync framework** | **Never build.** Extend the one cockpit (filtered), one schedule registry, git + connectors for coordination. | Explicit PRD non-goal; the anti-clutter constraint. |

---

## Sequencing (per PRD §closing)

1. **Foundations (no-gate, highest score):** A1 → A2 → A3 (honest freshness + gate) ‖ C1 → C2 → C3 (principal layer) ‖ D1 (EA fix)
2. **Connect the runtimes:** B1 (write-back) → B2 → B3 → B4/B5 (prune)
3. **Activate loops:** E1/E3 + G1 (read/write loops feed the now-correct structure) → E2 (Arbor CIL) → D4
4. **Cockpit company-layer:** F1 → F2 → F3 → F6 → F4 (multi-principal) → A4 (remediation loop) → A5
5. **The big move:** E4 (ROS-CIL) last — it improves a structure that the earlier steps made correct.

*Built entirely on existing ROS assets. No item invents a parallel system; the only NEW files are `/00_System/principals.md` (C1) and an HV DD-brief template (D2), both justified above.*
