# ROS Routing Matrix
Version: 1.4
Last updated: 2026-06-14

---

## Purpose

This file defines the canonical routing rules for Rubin OS. It is read by the root instruction surface and referenced by every domain `CLAUDE.md`. When a user input is ambiguous or does not use explicit command syntax, the active agent applies this matrix to select the correct domain.

**Rule**: Always route to the most specific match. If two agents match, prefer the one with the most concrete keyword match over a general one.

---

## Agent routing matrix

| Trigger keywords | Agent | Plugin |
|---|---|---|
| today, this morning, morning routing, morning briefing, daily briefing, daily plan, inbox routing, route my morning, this afternoon, calendar, what's on, schedule, appointments, follow-up, inbox, email triage, urgent | KK (Personal Ops) | ros-core |
| weekly review, OKRs, priorities, what matters most, strategy, blockers, quarterly, are we on track, cross-domain, orchestrate | CoS (Chief of Staff) | ros-core |
| deal, property, asset, BRRRR, rent, tenant, lender, renovation, permit, vergunning, bestemmingsplan, WWS, Funda, Kadaster, Pararius, Dutch RE, Hollandvest | HV (Real Estate) | ros-hv |
| architecture, HLD, ADR, cloud, AWS, Azure, GCP, ZTA, CCoE, CSDM, Coca-Cola, ABN, ABN AMRO, workplace, employment contract, freelance onboarding, security architect, platform design, interview prep | EA (Enterprise Architecture) | ros-ea |
| product, PRD, MVP, roadmap, feature, user story, go-to-market, pricing, venture, startup, parenting app | PAI (Product & AI Ventures) | ros-pai |
| Arbor mesh, agent mesh, build wave, dispatch orchestrator, improvement loop, hardening sweep, devsecops, domain pod, run the mesh | arbor-orchestrator (Arbor Agent Mesh, under PAI) | ros-pai |
| content, post, LinkedIn, blog, article, campaign, brand, copy, social media, newsletter, thought leadership | MKT (Marketing) | ros-mkt |
| invoice, insurance, contract, compliance, admin, bank, tax, subscription, legal, personal finance | FIN (Finance & Admin) | ros-fin |
| job, jobs, vacancy, vacature, CV, resume, cover letter, job application, recruiter, LinkedIn job, job alert, interview prep, work permit, relocation | Career (job-search, KK-owned mesh) | ros-core |
| research, look into this, find information on, fact-check, due-diligence research, sources on | research-agent (KK-owned shared service) | ros-core |

---

## Disambiguation rules

### KK vs CoS

KK handles **execution** — what you are doing today.
CoS handles **direction** — whether you are doing the right things.

| Input | Routes to |
|---|---|
| "What should I do today?" | KK |
| "What should I focus on this week?" | CoS |
| "What's on my plate?" | KK |
| "Morning routing" | KK |
| "Run my morning briefing" | KK |
| "Route my inbox for today" | KK |
| "Am I working on the right things?" | CoS |
| "Triage my inbox" | KK |
| "Run a weekly review" | CoS |

### EA vs PAI

EA handles **client-facing architecture work** — engagements, HLDs, ADRs, cloud strategy for clients.
PAI handles **product thinking** — Guy's own ventures, PRDs, MVPs, AI product design.

| Input | Routes to |
|---|---|
| "Review this architecture for Coca-Cola" | EA |
| "Track ABN onboarding" | EA |
| "Define the MVP for the parenting app" | PAI |
| "Write a PRD for the AI tutor" | PAI |

### HV vs FIN

HV handles **property operations** — deals, assets, tenants, permits, renovation, BRRRR.
FIN handles **financial administration** — invoices, tax, insurance, subscriptions, compliance.

| Input | Routes to |
|---|---|
| "Analyze this Funda listing" | HV |
| "Calculate BRRRR numbers for Groenewegje" | HV |
| "I got an invoice from the notary" | FIN |
| "Check my insurance renewal" | FIN |

---

## Command syntax (overrides keyword routing)

If the user types an explicit command, route immediately without keyword matching:

```
/kk.<command>        → KK
/cos.<command>       → CoS (portfolio conductor; dispatch ros-conductor for cross-domain work)
/hv.<command>        → HV
/ea.<command>        → EA
/pai.<command>       → PAI
/mkt.<command>       → MKT
/fin.<command>       → FIN
/career.<command>    → Career (job-search) mesh (KK-owned)
/research            → research-agent (returns a sourced, verified brief)
/arbor-mesh          → Arbor Agent Mesh workflow (on-demand orchestrator dispatch)
```

Commands always take precedence over keyword routing.

## Agent meshes (how domains run as agents)

Every domain runs as an agent environment under the **[ROS Agent Framework](agent-framework/FRAMEWORK.md)** — a lead/orchestrator, optional specialist pods, the universal loop, and a domain Definition-of-Done gate. Dispatch a mesh's lead subagent (in `/.claude/agents/ros/`) for that domain's work, or `ros-conductor` for anything cross-domain. Each mesh's spec is its `<DOMAIN>/mesh/MESH.md`; the index is [agent-framework/README.md](agent-framework/README.md).

- **research-agent** is **KK-owned** (KK is Guy's PA) but a shared service — usually dispatched *by* a domain lead (or the conductor) to gather sourced evidence, then the dispatching domain owns the decision. Spec: `KK/research/MESH.md`. Route a bare "research X" to it directly. **Career** (job-search) is likewise a KK-owned sub-mesh — `KK/job-automation/MESH.md`.
- Scheduled/autonomous loops are registered in [agent-framework/SCHEDULED-LOOPS.md](agent-framework/SCHEDULED-LOOPS.md) and are human-gated before go-live.

The Arbor Agent Mesh is a multi-agent sub-system owned by PAI (product) and CoS (portfolio). Its charter, roster, and dev-loop live in `/PAI/projects/parenting-os-plugin/mesh/`; runnable pods are in `/.claude/agents/arbor/`. It runs **on-demand only** — dispatch `arbor-orchestrator` or the `arbor-mesh` workflow; never auto-trigger.

---

## Fallback

If no keyword or command matches, route to **CoS** for clarification. CoS is the orchestrator — it can re-route after asking one clarifying question.

---

## Session start protocol

Context loading follows the **canonical boot sequence in `/AGENTS.md`**. Domain `CLAUDE.md` files must not restate it. Capabilities and connectors are baseline inheritances loaded lazily on first use, not eager-loaded per domain.

Each domain `CLAUDE.md` only needs to state which `MEMORY.md` to read on entry and its domain-specific connector scope.
