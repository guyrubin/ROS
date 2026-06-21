# Rubin OS (ROS) — Product Requirements Document

**Version:** 1.1
**Created:** 2026-06-21
**Reviewed:** 2026-06-21
**Owner:** ROS CoS (portfolio)
**Status:** Active — the operating contract for what ROS is becoming; no-gate foundation in execution
**Author:** ROS product lead

> **Amendment — 2026-06-21 (agnostic runtimes + execution kickoff).**
> **Model/runtime-agnostic (per Guy):** ROS is not tied to one AI vendor. It runs across **Claude Code** (interactive + MCP), **Codex** (bulk code/file edits), **Gemini** (generation, multimodal, large-context — Guy's *and* Joseph's subscriptions), and **Hermes** (WSL automation + scheduled loops). Use the best tool per job; the filesystem + `state.json` are the shared contract so any runtime can pick up another's work. Principle: **get the most out of every connected subscription, across both principals.** Codified in [`/AGENTS.md`](../AGENTS.md) (Design principle + runtime registry) and [`/00_System/principals.md`](../00_System/principals.md).
> **Execution kicked off:** the no-gate foundation is applied this session — git-derived freshness (A1), loop write-back rule (B1), the principal layer (C1), LEARN→DoD gate (A2), EA CONTEXT gate (D1), `Reviewed:` heartbeat (A3). Status + remainder in [`ROS-BACKLOG.md`](ROS-BACKLOG.md).

> ROS is an AI-run company that is an extension of **Guy Rubin and Joseph Rubin**. This PRD is the single, opinionated definition of that company: its org, its operating model across two runtimes, what it does autonomously, how it stays fresh, and how Guy and Joseph see it run. It is grounded in the assets that already exist — it does not invent parallel systems. Where it asks for new work, it names the existing asset being extended.

---

## 1. Vision & the "company" metaphor

ROS runs like a small, high-trust company of AI teams that work for Guy and Joseph the way a great chief of staff plus a bench of specialists would — except always-on, never-forgetting, and answerable to one operating picture.

- **The conductor (CoS)** sets cross-domain priority, runs the weekly review, and reports up to the principals. It is `ros-conductor` ([`/.claude/agents/ros/`](../.claude/agents/ros/), [`CoS/mesh/MESH.md`](mesh/MESH.md)).
- **The domains are teams.** Each is a mesh — a lead + optional specialist pods — with one charter, one Definition-of-Done gate, owned scope, and its own memory ([`00_System/agent-framework/FRAMEWORK.md`](../00_System/agent-framework/FRAMEWORK.md) tier model).
- **The filesystem is the company's shared brain.** Markdown memory + `state.json` are the only handoff channel between teams and runtimes ([`AGENTS.md`](../AGENTS.md) "filesystem is the stable context layer").
- **The command center is the lobby/boardroom** — one screen that answers "how is the company running and what needs a decision" ([`CoS/projects/guy-command-center/`](projects/guy-command-center/)).

The metaphor is load-bearing, not decorative: a company has principals it serves, a fixed org, a clear division of labor, things that run without being asked, books that stay current, and a dashboard the owners trust. Today ROS has the org chart drawn but **the teams have not yet completed a single real cycle** — the framework MESH.md files are all v1.0 dated today, and the domains that ran interactively (PAI/MKT) are current while the scheduled-only domains (HV/EA/KK/FIN) are 17–39 days stale. The job of this PRD is to turn the drawn org into a running one.

---

## 2. Principals & who it serves

ROS serves **two principals**, by default, as first-class:

| Principal | Account(s) | Lead domains | Privacy class |
| :-- | :-- | :-- | :-- |
| **Guy Rubin** | `bguy.rubin@gmail.com`, `bhollandvest@gmail.com` (HV) | CoS, HV, KK, PAI, MKT, FIN | HV + personal KK/FIN are Guy-private |
| **Joseph Rubin** | `josephdoronrubin@gmail.com` | EA (primary lead), FIN (consulting admin) | Joseph's own consulting clients are Joseph-private |

**Decision (opinionated): make principal a first-class concept, not a footnote.** Today Joseph exists only as a Gmail account and a CC target — the system is structurally Guy-centric. We fix this with the cheapest high-leverage change:

- **New `/00_System/principals.md`** — the registry: each principal's accounts, default domains, privacy class, and what they own. It is referenced by [`CoS/mesh/MESH.md`](mesh/MESH.md) and [`FIN/mesh/MESH.md`](../FIN/mesh/MESH.md), and ties together the existing [root `MEMORY.md` People table](../MEMORY.md) and [`00_System/identity-policy.md`](../00_System/identity-policy.md).
- **Boot declares the active principal.** Add one line to the [`AGENTS.md`](../AGENTS.md) canonical boot: declare/confirm the active principal before routing.
- **Confidentiality boundary.** [`identity-policy.md`](../00_System/identity-policy.md) is promoted from an email-routing rule into the **principal + confidentiality policy**: which domains are Guy-private, Joseph-private, or shared (EA workplaces, ROS infra), and the non-negotiable rule *never surface one principal's private domain in the other principal's session*. This reuses the file already designed to be non-negotiable, and extends the EA client-vs-client gate ([`EA/mesh/MESH.md`](../EA/mesh/MESH.md)) up to the principal axis.
- **Domains are tagged.** Each [`routing.md`](../00_System/routing.md) entry and each `<DOMAIN>/mesh/MESH.md` header carries an owner-principal / shared attribute so routing can pick the default identity and a mesh can refuse to expose itself in the wrong principal context.
- **Joseph must be able to transact.** Resolve the contradiction between [`identity-policy.md`](../00_System/identity-policy.md) ("`josephdoronrubin` blocked until App Password") and [`connectors.md`](../00_System/connectors.md) ("Active") — populate the Himalaya app password, confirm MCP Gmail access, set one source-of-truth status. *(Human-gated: needs Joseph's credential.)*

This is the single change-set that moves ROS from "Guy's assistant" to "Guy + Joseph's company."

---

## 3. The org — teams/meshes + the conductor

The lineup is close to right for the work that exists; it is fixed here, with two mis-scoped teams corrected.

```
Tier 0  GOVERNANCE   /AGENTS.md · /CLAUDE.md · /MEMORY.md · /00_System/{routing,identity-policy,principals}.md · safety levels
Tier 1  CONDUCTOR    ros-conductor (CoS) — portfolio priority, weekly review, dispatch; reports to BOTH principals
Tier 2  DOMAINS      HV · EA · KK (owns Career + Research) · MKT · FIN · PAI/Arbor
Tier 3  PODS         fan-out where it pays (hv-sourcing, hv-underwriting, mkt-content, …)
CROSS   SHARED       research-agent (KK-owned) · Arbor DevSecOps (code) · Safety/confidentiality gate
```

**Conductor.** `ros-conductor` reports a **Guy-lane and a Joseph-lane** in the weekly review and tracks priority per principal — not just "Guy's goals / Guy's time."

**Two corrections (these are Guy's exact complaints):**

- **EA is "too generic" because the agent is client-agnostic.** Fix without breaking confidentiality: keep one `ea-lead` (no cross-client pods), but require it to **inhabit** a rich per-client [`EA/clients/[client]/CONTEXT.md`](../EA/clients/) (architecture estate, stakeholders, in-flight decisions, constraints, decision log) as a mandatory FRAME-step input and the gate's first check. The agent becomes Coca-Cola-specific or ABN-specific by the context it loads, not a new agent. Additionally, **allow within-client fan-out** (parallel current-state review per practice area, control-matrix population, evidence gathering) modeled on the `hv-sourcing` batch pattern — the "no pods" rule rightly forbids cross-client leakage but has been over-applied to forbid valuable same-client parallelism.
- **HV is "weak in project management + research."** HV's mesh stops at the buy decision; BRRRR is Buy-Renovate-Rent-Refinance-Repeat. Add **`hv-execution`** owning the post-acquisition lifecycle — renovation milestones, vendor/contractor follow-through, permit-application status, refinance coordination — writing to the existing-but-orphaned `HV/06_Renovation`, `07_Financing`, `08_Vendors` folders, using the [`project-tracker`](../.claude/) skill as its engine. And give HV a **deal-grade due-diligence research lane**: HV dispatches the shared `research-agent` with an HV-specific DD brief template (comps, area trajectory, vendor vetting, WWS/regulation change) and owns synthesis into the IC memo — the muscle becomes HV's while keeping research a KK-owned shared service. *(Housekeeping: HV's folder schema has competing numbering — `02_Areas`/`02_Sourcing`, `03_Analysis`/`03_Deals`/`deals/` — reconcile to the [`HV/CLAUDE.md`](../HV/CLAUDE.md) file map.)*

**Reference implementation:** the [Arbor Agent Mesh](../PAI/projects/parenting-os-plugin/mesh/) is the proven pattern every domain generalizes.

---

## 4. Operating model — two runtimes, one system

The felt "mess between two AI solutions" is real but the cause is narrow and fixable: the two runtimes are well-documented but the **scheduled runtime never writes back into shared state**, so the interactive runtime and the dashboard never learn what the autonomous runtime did. That is the root of "not updated, not connected."

**Decision: one division of labor, the filesystem is the only handoff channel.** Codify it as a one-screen table in [`AGENTS.md`](../AGENTS.md):

| Runtime | Owns | Handoff |
| :-- | :-- | :-- |
| **Hermes** (WSL cron) | Scheduled read-and-**write-back** loops + Telegram I/O | writes `MEMORY.md` + `state.json` |
| **Claude Code / Cowork** | Interactive work, MCP connector actions, heavy multi-agent meshes | reads/writes the same tree |
| **Codex** | Bulk code edits | same tree |

**The single fix that ends the disconnect — mandatory write-back.** Amend the [`SCHEDULED-LOOPS.md`](../00_System/agent-framework/SCHEDULED-LOOPS.md) contract so **every loop, after delivering its digest, appends a dated one-liner to its owning domain's `MEMORY.md`** (and loop findings to `state.json` where relevant). This is workspace-write (Level 2) — no new external grant. KK's 08:30 triage writing "last triage: N actionable, top item X" instantly makes the autonomous runtime visible to the interactive one and unsticks the 37–39-day stale domains. This is the precedent already set by [`build-state.mjs`](projects/guy-command-center/build-state.mjs).

**One verifiable schedule registry.** Today [`SCHEDULED-LOOPS.md`](../00_System/agent-framework/SCHEDULED-LOOPS.md) is hand-asserted and `scheduled-tasks` MCP returns empty — no one can prove what runs. Add a reconciliation routine that lists tasks from both schedulers (Claude `list_scheduled_tasks` + Hermes `crontab -l`) into the registry with a last-verified date, and a **loop run-ledger** (last-run / next-run / found / shipped) so the registry reflects reality and the kill-switch rule is enforceable.

**Resolve the phantom `sync/` layer.** [`MERGE-CLAUDE-WORK-INTO-HERMES-PUSH.md`](../00_System/sync/) advertises an HLD/ADRs/scripts/hermes-plugin that **does not exist on disk** (only path-repair files remain). Mark it explicitly retired and strip dangling references — coordination is now git + the runtime-aware [`connectors.md`](../00_System/connectors.md) + write-back loops. **Do not rebuild the plugin** — that would be the parallel-system clutter the constitution forbids. The AGENT-SYNC actionQueue is **descoped to future-scope** until a real voice input exists; do not instrument a drainer for a queue nothing fills.

---

## 5. Autonomy model — what runs autonomously vs gated

ROS is **under-automated, not over-automated.** The loop muscle and gates are built; only 4 narrow read-only digests run live. The autonomy posture is decisive:

**Default posture (inherited, non-negotiable — [FRAMEWORK §4](../00_System/agent-framework/FRAMEWORK.md)):**

| Level | Action | Posture |
| :-: | :-- | :-- |
| 0–2 | analyze / draft / **write workspace (incl. memory write-back, dashboard refresh)** | **Auto** |
| 3 | external send / post / API / deploy / **any scheduled automation that acts** | **Confirm** |
| 4 | financial | **Confirm + amounts** |
| 5 | irreversible / store submission | **Confirm + warning** |

**Activate now (the compounding loops already specced, all read + workspace-write only):**

1. **Command Center morning refresh** — `node build-state.mjs` weekday mornings; kills "the dashboard existed but wasn't fed."
2. **CoS Weekly Review prep** (Fri) — makes the review a decision, not a gather.
3. **HV Deal Radar** + **FIN Deadline watch** — feed the pipeline / catch deadlines.
4. **Upgrade the 08:30 morning routing** from inbox-only into a synthesized daily operating brief (read calendar + Notion tasks + per-domain `MEMORY.md` "Next:" lines — the same sources `build-state.mjs` already parses).
5. **Multi-principal loops** — a parallel read-only morning brief over `josephdoronrubin@gmail.com` (EA) + his FIN slice.

**The sanctioned autonomous mode (gated, never merges/deploys):** confirm the **Arbor CIL** nightly-eval + weekly-build crons ([CIL.md](../PAI/projects/parenting-os-plugin/mesh/improvement/CIL.md), [`arbor-improve.workflow.js`](../.claude/workflows/)) — critic panel → score → adversarial verify → build-to-green on a branch → human ships. It never auto-merges and never auto-builds `gated` (safety/consent/billing/cost) classes.

**The biggest structural move — a ROS-wide self-improvement loop ("ROS-CIL").** Generalize the Arbor CIL over the OS itself: a critic→backlog→fix loop on ROS's own stale memory, broken routing, doc drift, and dead skills. Reuse the deterministic shape of [`arbor-improve.workflow.js`](../.claude/workflows/) and re-scope the live read-only Monday hygiene cron (`bc55de81f9f1`) as its **evaluate** stage, then add the **build** half so it proposes fixes on a branch instead of only reporting. Nightly cheap eval + weekly build, same gates: never auto-merge, never auto-send. This is the on-vision cure for "not updated, a mess."

---

## 6. Memory & freshness — how ROS stays updated

The memory **doctrine** is sound ([`memory-archive-policy.md`](../00_System/memory-archive-policy.md), [`session-audit.md`](../00_System/session-audit.md), Universal-Loop Stage-6 LEARN). **Enforcement is absent** — every mechanism is advisory, and the freshness signal is gameable because [`build-state.mjs`](projects/guy-command-center/build-state.mjs) trusts a hand-editable "Last updated:" header (MKT shows green while its only committed memory is the initial import).

**Decisions:**

1. **Freshness is git-derived, not header-derived.** Replace the header read in `build-state.mjs` with the git commit date of each `MEMORY.md` (`git log -1 --format=%cs`). ~15 lines; makes the dashboard honest immediately and closes the gaming hole.
2. **Add a `Reviewed: YYYY-MM-DD` heartbeat** to [`memory-archive-policy.md`](../00_System/memory-archive-policy.md); `staleDays = today − max(last-commit, Reviewed)`. Distinguishes "rotting" from "stable and confirmed" so a quiet FIN reads green after review while HV with uncommitted work reads red.
3. **Stage-6 LEARN becomes a gate.** Promote "memory write/heartbeat recorded" into every domain's Definition-of-Done in [`UNIVERSAL-LOOP.md`](../00_System/agent-framework/UNIVERSAL-LOOP.md) — a lead cannot report a frame done to the Conductor without it. Root-cause fix for inter-session rot.
4. **Every scheduled loop writes back** (§4) — the autonomous runtime stops being a memory black hole.
5. **The Monday hygiene cron becomes a remediation loop** (not just a report): run `build-state.mjs`, then for each git-stale domain dispatch that domain's lead to do a SENSE→LEARN refresh and open a **draft commit** for Guy. Workspace-write only.
6. **Session-audit fires automatically** via a Stop-hook in [`settings.json`](../.claude/) after meaningful ROS file changes, so learnings get written before context is lost.

---

## 7. Observability — the command center

The [`guy-command-center`](projects/guy-command-center/) is a real, zero-dep, single-source-of-truth cockpit. It renders Guy's **personal** layer well but is blind to the **company** layer and is hardcoded single-principal.

**Decisions (extend the one cockpit — never fork a second dashboard):**

1. **Loops & Agents panel** — a `loops[]` array in `state.json` (id, owner, cadence, lastRun, nextRun, status, lastResult) rendered green/amber/red, seeded from [`SCHEDULED-LOOPS.md`](../00_System/agent-framework/SCHEDULED-LOOPS.md). The direct cure for "are my autonomous agents running?" — the single biggest cause of the felt disconnect.
2. **Render the orphaned `arborPulse`** — `build-state.mjs` already writes it; `index.html` never draws it. Show it on the PAI card.
3. **Decisions-Needed queue** — scrape "Needs Guy", "BLOCKER", "blocked-on", "gated" lines from domain + mesh memory into a `decisions[]` array (text, domain, **owner: guy/joseph/shared**, age, safety level) and render it as the top card. This is what a CEO cockpit must show.
4. **Make it multi-principal** — add a principal field to domains/clients/tasks/decisions/loops + a Guy/Joseph/All topbar toggle; re-title to **"Rubin OS Command Center."**
5. **Runtime heartbeat strip** — track `meta.updatedBy` (claude/hermes/dashboard) as last-seen per writer: "Hermes ✓ 2h ago · Claude ✓ now." Makes the dual-runtime architecture observable instead of a felt mess.
6. **Make the morning refresh live** (§5) so the cockpit is auto-fed, not manually run.

---

## 8. Principles & non-goals

**Principles** (the eight from [FRAMEWORK §6](../00_System/agent-framework/FRAMEWORK.md), plus):

- **BUILD ON, NEVER CLUTTER.** Every change names the existing asset it extends or justifies why genuinely new. No parallel systems, no second dashboard, no resurrected `sync/` plugin, no divergent ROS tree.
- **One source of truth per fact** (DRY) — a rule or fact lives in exactly one file.
- **The filesystem is the only cross-runtime handoff** — `MEMORY.md` + `state.json`.
- **Two principals by default** — confidentiality between Guy and Joseph is non-negotiable.
- **Every loop ends in memory; gate or no deliver; safety overrides velocity.**

**Non-goals:**

- Not a chatbot — ROS is an operating company with durable memory and scheduled work.
- No autonomous external action without an explicit registered grant (no auto-send, auto-spend, auto-merge, auto-deploy).
- No second/parallel dashboard, scheduler, or sync framework.
- Not Guy-only — but also not a generic multi-tenant SaaS; it serves exactly two named principals.
- The AGENT-SYNC voice/actionQueue drainer is out of scope until a real voice input exists.

---

## 9. Success metrics

| Metric | Today | Target |
| :-- | :-- | :-- |
| Domains git-fresh (≤14d or reviewed) | 2 / 8 (PAI, MKT) | **8 / 8** within 2 weeks of write-back + remediation loop |
| Scheduled loops that write back to ROS state | 0 / 4 | **100%** of live loops |
| Live compounding loops (review prep, dashboard refresh, deal radar, deadline watch) | 0 | **4 live**, verifiable in the run-ledger |
| Dashboard freshness signal honest (git-derived) | No (header-gameable) | **Yes** |
| Joseph served as a principal (own brief, own send rail, own cockpit lane) | No | **Yes** |
| "Are my agents running?" answerable at a glance | No | **Yes** (Loops panel + heartbeat strip) |
| Decisions-needed rolled up cross-domain with owner + age | No | **Yes** |
| Phantom/clutter references (`sync/` plugin, false-green memory) | Present | **Zero** |
| ROS-CIL: a self-improvement loop that proposes fixes on a branch | None | **Live**, nightly eval + weekly build, human ships |

**The headline outcome:** by honest git dates every domain is current, the autonomous runtime is visible to the interactive one, both Guy and Joseph open one coherent operating picture each morning, and ROS improves itself on a clock — the literal inverse of "not updated, not connected, a mess between two AI solutions."

---

*Built on existing ROS infrastructure. Sequencing: principal layer + EA/HV scope fixes → write-back + git-freshness → activate read/write loops → cockpit company-layer + multi-principal → ROS-CIL. Each step feeds a correct structure rather than a broken one.*
