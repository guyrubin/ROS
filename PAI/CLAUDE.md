# PAI -- Product & AI Ventures
Version: 0.1 (stub -- build Phase 5)
Last updated: 2026-05-17

## Role

PAI handles Guy's own product ventures -- PRDs, MVPs, go-to-market, pricing, and
AI product design. Not for client architecture work (that is EA).

## On session start

Follow the canonical boot sequence in `/AGENTS.md`. On entry to this domain, read `/PAI/MEMORY.md`. Capabilities and connectors load lazily on first use — do not eager-load them.

## Commands

| Command | Description | Safety |
|---|---|---|
| /pai.write-prd | Write a Product Requirements Document | 1 |
| /pai.gtm-plan | Create go-to-market plan | 1 |
| /pai.scope-mvp | Define MVP scope and milestones | 1 |

## Connectors and required skills

Source of truth: `/00_System/connectors.md`.

| Connector | Purpose | Required Hermes skill | Current status | Fallback |
|---|---|---|---|---|
| Gmail `bguy` | Venture communications, partner outreach drafts | `himalaya` | Active / verified | Manual review |
| Notion | Product/project registry, roadmap, PRD/task tracking | `productivity/notion` | Active / verified | Use verified Command Center page; inspect before writes |

## Arbor Agent Mesh

Arbor is now the group's **product company #1**, with its own company charter at `projects/parenting-os-plugin/COMPANY.md` (PAI remains its product owner; CoS/group is portfolio owner). See `/00_System/companies.md`.

PAI is the **product owner** of the Arbor Agent Mesh — a multi-agent **product organization** that decides/builds/hardens/grows the Arbor app via green-gated loops. Topology: a standing **Advisory Board** (`arbor-advisor` product-philosophy + `arbor-clinical-*` board) → a **Product Council** intake (→ one scored `PRODUCT-BACKLOG.md`) → `arbor-orchestrator` (conductor) → 10 domain pods + a DevSecOps team + a first-class **Marketing mesh**, reporting up to PAI (product) and CoS (portfolio). The build mesh runs on-demand; **four autonomous loops run live on a cadence** (`scheduled-tasks` MCP) — CIL eval (2×/day) + CIL build (2×/wk) + **Product Council** (weekly) + **Marketing loop** (2×/wk). Merge/deploy stay human-gated.

- **Advisory Board** (`mesh/teams/advisory.md`): `arbor-advisor` = internal product-philosophy rubric (competence/order/responsibility/truth/meaning) — **advisory voice, never branded/user-facing** (back-end inspiration only). `arbor-clinical-lead` + peds/SLP/psych = clinical board holding a **veto on clinical soundness + any developmental/medical/effect-size claim** (co-held with `arbor-safety`). Internal reviewers, **never** presented as licensed clinicians.
- **Product Council** (`mesh/PRODUCT-COUNCIL.md`, loop `/arbor-product-council`): fuses Advisory + Clinical + Marketing feature-requests + CIL findings into the one scored `PRODUCT-BACKLOG.md` the Orchestrator executes. Clinical-claim items can't be build-ready until the Clinical Board clears them; gated items surface for Guy.
- Charter / dev-loop / roster: `/PAI/projects/parenting-os-plugin/mesh/` (`CHARTER.md`, `DEV-LOOP.md`, `ROSTER.md`, `ORCHESTRATOR.md`, `MEMORY.md`, `PRODUCT-COUNCIL.md`, `teams/`)
- **Marketing mesh** (a full viral growth org, operating like a billion-dollar branding company): `/PAI/projects/parenting-os-plugin/mesh/marketing/` — strategy spine **`BRAND-STRATEGY.md`** (Arbor = *Longitudinal Child Intelligence*, the steady hand that remembers your child; **one child OS — six surfaces on one parent-owned record, each beating a category leader**; full benchmark in `CAPABILITY-MAP.md`), `MESH.md`, `OPERATING-MODEL.md`, `VIRAL-ENGINE.md` (the production/cadence/threshold playbook), `MARKETING-BACKLOG.md`. Org flow: `arbor-insights` (outside-in trend + competitor radar) → `arbor-brand` ECD (owns the bible, vetoes anything generic) + `arbor-content` (hook/copy) → `arbor-creative` (short-form video/motion/design; generic child-as-hero, never a real face) → `arbor-distribution` (creators + WhatsApp/IL-FB group seeding + owned-channel queue) → `arbor-acquisition` (loop/K-factor) → `arbor-seo` / `arbor-critic-market` (eval), all led by `arbor-marketing-lead`. Autonomous loop `/arbor-marketing-loop` (INTEL→…→DISTRIBUTE→LEARN) builds to the brand spine, gates each asset through the ECD then `arbor-safety`, and publishes safe materials to owned organic surfaces; money/claims/child-data and **outbound to people (creator DMs, external-community seeding)** stay gated. Owns the one marketing backlog; hands competitor feature-requests to the product backlog.
- Runnable pods: `/.claude/agents/arbor/` (incl. `arbor-advisor`, `arbor-clinical-lead/-peds/-slp/-psych`) · Workflows: `arbor-mesh` (build), `arbor-product-council` (intake), `arbor-improve` (CIL), `arbor-marketing-loop` (demand)
- To run: dispatch `arbor-orchestrator` (a wave), the Product Council `/arbor-product-council` (decide what to build), `arbor-clinical-lead` / `arbor-advisor` (review a feature), or `arbor-marketing-lead` (a campaign). Deploy-to-prod, paid spend, store submission, and **any clinical/developmental claim or the philosophy-adviser identity** stay human-gated (Level 3–5).

## Memory

/PAI/MEMORY.md -- active ventures, milestones, decisions, partners

## Shared skills

- Load Hermes skill `himalaya` before Gmail/email triage, search, read, draft, reply, forward, or send workflows.
- Load Hermes skill `productivity/notion` before Notion task/project/page/database operations.
- `/00_System/agent-capabilities.md` for baseline web search, browser/computer use, video and multimodal analytics, document intelligence, data automation, and Markdown knowledge-base maintenance.
- `/00_System/connectors.md` for live connector status and blockers.

## Boundaries

- Client architecture -> EA
- Content and promotion of ventures -> MKT
- Financial modeling of ventures -> FIN
