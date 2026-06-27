# ABN — Workplace Context (EA FRAME dossier)
Last updated: 2026-06-22
Reviewed: 2026-06-22
<!-- Mandatory first read for ABN EA work — the EA Definition-of-Done gate (EA/mesh/MESH.md §Gate). This file alone must satisfy the gate with connectors offline: estate · named stakeholders · in-flight decisions · decision log. -->

> Mirror surface: [[../../../CoS/projects/guy-command-center/Command Center - Obsidian Entry|Command Center]] → EA Client Cockpit (ABN tab); engagement state in `CoS/projects/guy-command-center/state.json`. The Command Center is a convenience mirror — **this file is the source of truth for the FRAME**, by design, so EA deliverables hold with connectors down.

**Engagement at a glance:** ABN · Freelance · Security Enterprise Architect · 🟢 onboarding in progress. Lens: cybersecurity architecture, IAM/ZTA, segmentation, banking compliance, security governance, decision support. Confidentiality gate is hard — never reference Coca-Cola or any prior client in ABN work.

---

## 1. Estate (current state as known)

What an architect can rely on today, and what is explicitly still open. Pre-start engagement: the estate is **not yet disclosed**, so the honest current state is "lens confirmed, specifics pending first access".

| Dimension | Established | Open (capture on access) |
|---|---|---|
| Sector / regulatory frame | Dutch retail/commercial banking → expect DNB supervision, DORA, NIS2, GDPR, EBA guidance, internal ABN security policy | Which of these are in-scope for the engagement, and ABN's own control framework/policy set |
| Architecture lens | Security Enterprise Architecture: cybersecurity, IAM/ZTA, network segmentation, security governance, decision support | The specific programme(s) the role plugs into |
| Cloud / platform | — | Cloud providers (AWS/Azure/GCP/on-prem mix), landing-zone model, platform tooling |
| Identity & access | — | IdP, PAM tooling, current ZTA maturity, joiner/mover/leaver model |
| Network | — | Segmentation model, zoning, secure-access patterns, perimeter vs. ZTNA posture |
| Security operations | — | SIEM/SOC, logging, detection/response model, vulnerability and risk register |
| Governance forums | — | Architecture review board / security design authority and its cadence |

> **Why empty rows are correct, not missing work:** ABN has not yet granted access. The first deliverable (onboarding/access/stakeholder checklist) exists to convert these open rows into established ones; until then, no EA output may assume an estate fact not listed as established above.

## 2. Named stakeholders

No named ABN contacts are confirmed yet. The dossier holds the **roles to identify** so the first interaction populates them deterministically:

- Hiring manager / engagement owner — **unknown**
- Onboarding / access contact — **unknown**
- Agency or intermediary (freelance route) — **unknown**
- Security design authority / architecture review board chair — **unknown**
- CISO / security leadership line the role reports into or advises — **unknown**

Internal ROS side: Guy Rubin (owner, `bguy.rubin@gmail.com`); Joseph Rubin only if explicitly involved. Capture each ABN name with role + email the moment it appears in correspondence.

## 3. In-flight decisions

Decisions that are live for this engagement and where they stand:

- **D-ABN-1 — Engagement entity & contract terms.** Status: open. Formal counterparty (ABN vs. ABN AMRO), rate, contract length, role/title, start date all unconfirmed. Owner: Guy + intermediary.
- **D-ABN-2 — Access & compliance prerequisites.** Status: open. Banking onboarding for a freelance security architect typically gates on screening/clearance, NDA, device/identity provisioning. Capture the actual checklist on first contact. Owner: ABN onboarding contact.
- **D-ABN-3 — First-deliverable scope.** Status: open. Likely a current-state security architecture review once access lands; confirm with engagement owner before producing. Owner: Guy + hiring manager.

No architectural design decisions (IAM/ZTA, segmentation, control mapping) are in flight yet — they cannot be until D-ABN-2 unlocks the estate.

## 4. Decision log

What has actually been settled, so the FRAME is self-contained:

| Date | Decision | Rationale |
|---|---|---|
| 2026-05 | ABN engaged as a **freelance** workplace | Per workplace roster (EA/MEMORY.md) |
| 2026-05 | Role lens fixed to **Security Enterprise Architecture** (not infra-led) | Distinguishes ABN from the Coca-Cola infra+security lens; drives which EA skill cards activate |
| 2026-06 | ABN kept **strictly isolated** from Coca-Cola and all prior clients | Confidentiality gate (EA/CLAUDE.md, MESH.md §Gate) |
| 2026-06-22 | Dossier restructured to the **four-section FRAME shape** (estate/stakeholders/in-flight/log) so the filesystem alone satisfies the EA gate offline | ROS-BACKLOG GA-4: connector-independent gate input |

## Expected EA outputs (demand-aligned)

Onboarding/access/stakeholder checklist → first-deliverable brief → current-state security review → target-state security HLD → security risk/control backlog. Activation per `EA/CLAUDE.md` skill table and `EA/frameworks/ea-skill-process-outcomes.md` — not restated here (DRY).

## Next actions

- [ ] Convert §1 open rows + §2 roles into established facts via the onboarding/access checklist (first deliverable).
- [ ] Capture start date, rate/contract terms, role/title, intermediary, and key contacts (resolves D-ABN-1).
- [ ] Record screening/access/compliance prerequisites as they surface (resolves D-ABN-2).
- [ ] On each update, move resolved items from "open" into the relevant §1–§4 row and refresh the dates above.
