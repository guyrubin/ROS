# ROS — Next-Level Strategy

**Version:** 1.0
**Created:** 2026-06-21
**Reviewed:** 2026-06-21
**Owner:** ROS CoS · **Extends:** [ROS-PRD.md](ROS-PRD.md) · [ROS-CAPITALIZATION.md](ROS-CAPITALIZATION.md) · burns down via [ROS-BACKLOG.md](ROS-BACKLOG.md)

> **The vision, in one line:** make a *family unit* operate with the leverage of a **dedicated 50-employee company** — proactive, best-in-class in every domain, self-improving, aesthetically excellent, and managed — serving Guy, Joseph, and family. The foundation exists; this focuses the strategy on the few things that actually make it *feel* like that company.

---

## 1. The most important strategic questions (answered)

Strategy is choosing what matters. These seven decide everything else.

### Q1 — What is ROS at the next level?
**A "company," not a toolbox.** ~50 "employees" = the agents + the always-on loops, organized into departments (the meshes), run by a COO (the CoS conductor), reporting to the principals. The differentiator isn't more agents — it's that the company **runs itself between check-ins, holds a standard, and gets better every week.** Today it's a strong skeleton that doesn't yet *run*; the job is to make it operate.

### Q2 — Where does work and knowledge live? (the Google-as-filesystem question)
**A 3-layer model, each layer with one job — no more ambiguity:**
- **ROS Markdown (the brain)** — agent-maintained durable knowledge, decisions, memory. Source of truth for *reasoning*.
- **Notion (the cockpit)** — the human second-brain + relational DBs (Tasks/Projects/People/Deals…) + dashboards. Source of truth for *operational state*.
- **Google Workspace (the filesystem)** — **Drive = the document/binary/deliverable store; Docs/Sheets = produced artifacts & models; Gmail/Calendar = comms & time.** Source of truth for *files and outputs*. Hermes already holds Google OAuth — this is wiring, not new infra.
**Decision:** ROS stops treating "the filesystem" as only local Markdown. **Google Drive becomes the canonical file layer** (per-domain folders), Markdown stays the brain, Notion the cockpit. A deliverable lives in Drive; its reasoning + index live in ROS; its status lives in Notion.

### Q3 — How do we guarantee excellence and aesthetic, regardless of which tool made it?
**A tool-agnostic ROS Standard** — one "definition of excellence" every output clears before it ships, no matter the runtime or tool. It has three parts: **substance** (correct, sourced, decision-ending), **house voice** (executive, direct, structured), and **aesthetic** (clean, premium, consistent — for docs, decks, the cockpit, emails, the Arbor UI). This is the [UNIVERSAL-LOOP](../00_System/agent-framework/UNIVERSAL-LOOP.md) DoD raised into a company-wide quality + design bar with a verification gate.

### Q4 — How do we always have the *right* tools and the *most relevant* skills — and keep it current?
**A continuous Tooling & Skills loop** (the CIL pattern applied to capability, not product): a **registry** of the best skill/tool per job per mesh, a scheduled **evaluation** (what's used, what's underused, what's missing, what's new in the ecosystem), and an **acquisition gate**. Capability stops being ad-hoc; it's curated and re-curated. Skills are *selected*, not accumulated — each mesh loads its few most-relevant.

### Q5 — How is it managed? ("things are not managed")
**The CoS conductor is the COO**, running a real management cadence: **daily** (the cockpit + morning brief), **weekly** (cross-domain review, per-principal lanes), **quarterly** (OKRs per department). Every loop writes back; nothing runs unobserved; every project has a next action and an owner. The cockpit is the management surface — open it and you see the whole company at a glance, with what needs a decision surfaced.

### Q6 — How does it self-improve?
**Three nested loops:** the **ROS-CIL** (audits the company weekly, proposes fixes), the **Tooling loop** (Q4 — keeps capability current), and the **Standard gate** (Q3 — ratchets quality). Product self-improvement (Arbor CIL) already exists as the proven template. Self-improvement is the default state, not a project.

### Q7 — Who does it serve, and how should it *feel*?
**Guy + Joseph (+ family), as two first-class principals.** It should feel like a company that **anticipates** (surfaces the deal, the deadline, the reply before you ask), **never drops a ball** (write-back + management cadence), **delivers premium work** (the Standard), and is **unmistakably yours** (your voice, your aesthetic, your priorities). Not a chatbot you prompt — a staff that shows up with the work done.

---

## 2. The org — what "50 employees" actually means

| Layer | "Company role" | Who |
| :-- | :-- | :-- |
| Principals | Owners | Guy · Joseph |
| Conductor | COO / Chief of Staff | `ros-conductor` |
| Department heads | Domain leads | `hv-orchestrator`, `ea-lead`, `kk-ops`, `mkt-lead`, `fin-admin`, `arbor-orchestrator`, `career-orchestrator` |
| Specialists | Pods | hv-sourcing/underwriting/permit/execution, mkt-content, the Arbor pods… |
| Quality dept | Standards + DevSecOps + the critic panel | `arbor-evaluator` + critics, DevSecOps, the ROS Standard gate |
| Shared services | Cross-cutting | `research-agent`, the Tooling loop |
| Always-on staff | The scheduled loops | the Hermes crons + the loops in `SCHEDULED-LOOPS.md` |

The number isn't the point — the *operating model* is: departments with owners, a quality function, shared services, and staff that work while you sleep.

## 3. The five next-level pillars (each builds on what exists)

1. **Skill capitalization** — a per-mesh skill/tool registry; load the *most relevant* few, not everything. (Backlog Theme I)
2. **Google Workspace as filesystem** — Drive as the canonical file layer; the 3-layer model wired. (Theme J)
3. **The ROS Standard** — tool-agnostic excellence + aesthetic gate on every output. (Theme K)
4. **Tooling & Skills loop** — acquire / evaluate / ingest-new-input, continuously. (Theme L)
5. **The management layer** — CoS-as-COO cadence + the cockpit as the management surface + OKRs. (Theme M)

Self-improvement (the ROS-CIL) and the multi-principal model are already in the PRD/backlog — these five make the company *feel like 50 people*.

## 4. Sequencing (gradual, per Guy)
Strategy first (this doc) → then, in waves: **manage what exists** (cockpit + cadence live) → **standard** (so output quality ratchets immediately) → **Google-as-filesystem** (so deliverables have a home) → **skill + tooling loops** (so capability stays sharp). Each wave is a backlog theme; turn them on one at a time and confirm value.

> The strategic bet: **a managed, self-improving operating model on the foundation we built beats any new feature.** Make it *run like a company* before adding more capability.
