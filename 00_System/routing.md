# ROS Routing Matrix
Version: 1.0
Last updated: 2026-05-13

---

## Purpose

This file defines the canonical routing rules for Rubin OS. It is read by the root CLAUDE.md and referenced by every plugin CLAUDE.md. When a user input is ambiguous or does not use explicit `/plugin.command` syntax, Claude applies this matrix to select the correct agent.

**Rule**: Always route to the most specific match. If two agents match, prefer the one with the most concrete keyword match over a general one.

---

## Agent routing matrix

| Trigger keywords | Agent | Plugin |
|---|---|---|
| today, this morning, this afternoon, daily plan, calendar, what's on, schedule, appointments, follow-up, inbox, email triage, urgent | KK (Personal Ops) | ros-core |
| weekly review, OKRs, priorities, what matters most, strategy, blockers, quarterly, are we on track, cross-domain, orchestrate | CoS (Chief of Staff) | ros-core |
| deal, property, asset, BRRRR, rent, tenant, lender, renovation, permit, vergunning, bestemmingsplan, WWS, Funda, Kadaster, Pararius, Dutch RE, Hollandvest | HV (Real Estate) | ros-hv |
| architecture, HLD, ADR, cloud, AWS, Azure, GCP, ZTA, CCoE, CSDM, Coca-Cola, ABN, ABN AMRO, workplace, employment contract, freelance onboarding, security architect, platform design, interview prep | EA (Enterprise Architecture) | ros-ea |
| product, PRD, MVP, roadmap, feature, user story, go-to-market, pricing, venture, startup, parenting app | PAI (Product & AI Ventures) | ros-pai |
| content, post, LinkedIn, blog, article, campaign, brand, copy, social media, newsletter, thought leadership | MKT (Marketing) | ros-mkt |
| invoice, insurance, contract, compliance, admin, bank, tax, subscription, legal, personal finance | FIN (Finance & Admin) | ros-fin |

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
/cos.<command>       → CoS
/hv.<command>        → HV
/ea.<command>        → EA
/pai.<command>       → PAI
/mkt.<command>       → MKT
/fin.<command>       → FIN
```

Commands always take precedence over keyword routing.

---

## Fallback

If no keyword or command matches, route to **CoS** for clarification. CoS is the orchestrator — it can re-route after asking one clarifying question.

---

## Session start protocol

Every plugin CLAUDE.md must include this block:

```
## Session start
1. Read /00_System/routing.md
2. Read /MEMORY.md
3. Read /{plugin}/MEMORY.md
4. Read /{plugin}/CLAUDE.md (already loaded)
```

This ensures shared context is available before any task starts.
