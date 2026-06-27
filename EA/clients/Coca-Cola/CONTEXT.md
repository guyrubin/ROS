# Coca-Cola — Workplace Context (EA FRAME dossier)
Last updated: 2026-06-27
Reviewed: 2026-06-27
<!-- Mandatory first read for Coca-Cola EA work — the EA Definition-of-Done gate (EA/mesh/MESH.md §Gate). This file alone must satisfy the gate with connectors offline: estate · named stakeholders · in-flight decisions · decision log. -->

> Mirror surface: [[../../../CoS/projects/guy-command-center/Command Center - Obsidian Entry|Command Center]] → EA Client Cockpit (Coca-Cola tab); engagement state in `CoS/projects/guy-command-center/state.json`. The Command Center is a convenience mirror — **this file is the source of truth for the FRAME**, by design, so EA deliverables hold with connectors down.

**Engagement at a glance:** Coca-Cola · Employment · Infrastructure & Security Enterprise Architect · 🟡 contract final stages. Lens: secure infrastructure foundations, cloud/platform guardrails, network, identity, resilience, security baselines, enterprise operability. Confidentiality gate is hard — never reference ABN or any prior client in Coca-Cola work.

---

## 1. Estate (current state as known)

What an architect can rely on today, and what is explicitly still open. Pre-start engagement: the estate is **not yet disclosed**, so the honest current state is "lens confirmed, specifics pending onboarding".

| Dimension | Established | Open (capture on onboarding) |
|---|---|---|
| Sector / regulatory frame | Global consumer-goods enterprise → expect GDPR + multi-jurisdiction data, SOX-adjacent IT controls, enterprise security policy; **not** a regulated-bank regime | Which entity/region, and Coca-Cola's own control/policy framework |
| Architecture lens | Infrastructure & Security Enterprise Architecture: secure foundations, platform guardrails, network, identity, resilience, operability | The specific platform/programme the role owns or advises |
| Cloud / platform | — | Cloud providers + landing-zone model, CCoE/platform operating model, IaC and guardrail tooling |
| Identity & access | — | Enterprise IdP, access model, privileged access, federation |
| Network | — | Topology, segmentation, connectivity (SD-WAN/hub-spoke), secure-access patterns |
| Resilience / operations | — | DR posture, logging/observability, security baseline standards, incident model |
| Governance forums | — | Architecture/CCoE board, decision cadence, sign-off authority |

> **Why empty rows are correct, not missing work:** the employment contract is still finalizing and onboarding has not started. The first deliverable (contract/onboarding readiness checklist → infra & security baseline review) exists to convert these open rows into established ones; until then, no EA output may assume an estate fact not listed as established above.

## 2. Named stakeholders

No named Coca-Cola contacts are confirmed yet. The dossier holds the **roles to identify** so the first interaction populates them deterministically:

- Hiring manager / reporting line — **unknown**
- HR / contracting contact — **unknown**
- CCoE / platform engineering lead — **unknown**
- Security architecture / CISO line the role reports into or advises — **unknown**
- Architecture governance forum owner — **unknown**

Internal ROS side: Guy Rubin (owner, `bguy.rubin@gmail.com`); Joseph Rubin only if explicitly involved. Capture each Coca-Cola name with role + email the moment it appears in correspondence.

## 3. In-flight decisions

Decisions that are live for this engagement and where they stand:

- **D-CC-1 — Employment contract.** Status: final stages, pending signature. Terms, compensation, role/title, reporting line, start date to be confirmed on receipt. Owner: Guy + Coca-Cola HR.
- **D-CC-2 — Onboarding & access provisioning.** Status: open (gated behind D-CC-1). Enterprise device/identity provisioning, security/background checks, joiner steps. Capture the actual checklist once contract lands. Owner: Coca-Cola HR/IT onboarding.
- **D-CC-3 — First-deliverable scope.** Status: open. Likely an infra & security baseline review / landing-zone gap analysis once access lands; confirm with reporting line before producing. Owner: Guy + hiring manager.

No architectural design decisions (landing zone, network, identity, DR) are in flight yet — they cannot be until D-CC-2 unlocks the estate.

## 4. Decision log

What has actually been settled, so the FRAME is self-contained:

| Date | Decision | Rationale |
|---|---|---|
| 2026-05 | Coca-Cola engaged as an **employment** workplace (not freelance) | Per workplace roster (EA/MEMORY.md); shapes contracting + onboarding path |
| 2026-05 | Role lens fixed to **Infrastructure & Security Enterprise Architecture** | Distinguishes Coca-Cola from ABN's security-led lens; drives which EA skill cards activate |
| 2026-06 | Coca-Cola kept **strictly isolated** from ABN and all prior clients | Confidentiality gate (EA/CLAUDE.md, MESH.md §Gate) |
| 2026-06-22 | Dossier restructured to the **four-section FRAME shape** (estate/stakeholders/in-flight/log) so the filesystem alone satisfies the EA gate offline | ROS-BACKLOG GA-4: connector-independent gate input |
| 2026-06-27 | Coca-Cola onboarding readiness + first-deliverable pack created | Operating artifact now exists at `EA/clients/Coca-Cola/coca-cola-onboarding-readiness-first-deliverable-pack-2026-06-27.md`; use it as the contract/onboarding checklist, stakeholder/forum map, source-pack request draft, and infrastructure/security baseline review plan. |

## Expected EA outputs (demand-aligned)

Contract/onboarding readiness checklist → infra & security baseline review → landing-zone/platform/security gap analysis → target-state HLD update → platform/security roadmap and decision log. Activation per `EA/CLAUDE.md` skill table and `EA/frameworks/ea-skill-process-outcomes.md` — not restated here (DRY).

## Next actions

- [x] Convert §1 open rows + §2 roles into a contract/onboarding readiness checklist and first-deliverable pack — created `EA/clients/Coca-Cola/coca-cola-onboarding-readiness-first-deliverable-pack-2026-06-27.md`.
- [ ] Review contract terms on receipt; capture start date, role/title, reporting line, compensation (resolves D-CC-1).
- [ ] Record onboarding/access/provisioning steps as they surface (resolves D-CC-2).
- [ ] On each update, move resolved items from "open" into the relevant §1–§4 row and refresh the dates above.
