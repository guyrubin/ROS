# Boortmalt — Workplace Context (EA FRAME dossier)
Last updated: 2026-06-27
Reviewed: 2026-06-27
<!-- Mandatory first read for Boortmalt EA work — the EA Definition-of-Done gate (EA/mesh/MESH.md §Gate). This file alone must satisfy the gate with connectors offline: estate · named stakeholders · in-flight decisions · decision log. -->

**Engagement at a glance:** Boortmalt · Freelance via ATCON Global · Information Security Architect · 🟡 offer accepted / onboarding and permit gate open. Lens: CISO-adjacent information security architecture, CCoE/cloud guardrails, enterprise security governance, IAM/ZTA, network and OT/plant segmentation, evidence, resilience, and risk-based roadmap. Confidentiality gate is hard — never reference ABN, Coca-Cola, or prior clients in Boortmalt work.

---

## 1. Estate (current state as known)

What an architect can rely on today, and what is explicitly still open. Pre-start engagement: the estate is **not yet disclosed**, so the honest current state is "role, commercial outline, and industrial/security lens confirmed; specifics pending onboarding/access".

| Dimension | Established | Open (capture on onboarding) |
|---|---|---|
| Sector / regulatory frame | Boortmalt is the named end client in Antwerp; role is Information Security Architect; EU/Belgian context. Treat likely industrial/manufacturing and supply-chain resilience concerns as hypotheses until confirmed. | Actual legal entity, country scope, criticality classification, relevant internal policies, NIS2 applicability, GDPR/data scope, audit commitments, customer/supplier requirements. |
| Engagement model | Freelance via ATCON Global; offer terms captured in `KK/2026-06-24_boortmalt-atcon-offer.md`; start target 2026-07-01 through 2027-02-28, extendable. | Signed contract, confirmed start date, work authorization path, final onboarding checklist, Boortmalt sponsor. |
| Architecture lens | Information Security Architect with CISO/CCoE security support: governance, cloud/platform guardrails, identity, network/OT segmentation, control evidence, security roadmap. | Specific programme(s), scope boundaries, reporting line, decision forums, authority level. |
| Cloud / platform / CCoE | — | Cloud providers, landing-zone model, account/subscription structure, IaC/policy tooling, CCoE/platform-engineering maturity, service catalog. |
| Identity & access | — | IdP, SSO/MFA, PAM/PIM, privileged/admin model, service/workload identities, joiner/mover/leaver and access review evidence. |
| Network / OT / plants | — | Enterprise network topology, plant/OT zones, remote access, third-party connectivity, segmentation standards, critical flows, monitoring constraints. |
| Security operations / evidence | — | SIEM/SOC, vulnerability management, incident process, logging coverage, control evidence repositories, risk register. |
| Resilience / supplier risk | — | BCP/DR, backup posture, ransomware recovery, supplier/third-party security process, operational freeze windows. |
| Governance forums | — | CISO cadence, CCoE/platform board, architecture review board, CAB, risk committee, audit/evidence forums. |

> **Why empty rows are correct, not missing work:** Boortmalt has not yet granted access. The first deliverable exists to convert these open rows into established facts. Until then, no EA output may assume an estate fact not listed as established above.

## 2. Named stakeholders

Confirmed external stakeholders from current ROS evidence:

| Role | Name / party | Status | Notes |
|---|---|---|---|
| Agency / intermediary | ATCON Global | Confirmed | Offer and admin channel. |
| Recruiter/contact | Ankit Tanna | Confirmed | Captured in `KK/2026-06-24_boortmalt-atcon-offer.md`; use only for engagement/admin context. |
| End client | Boortmalt, Antwerp | Confirmed | Named end client. |
| Boortmalt sponsor / hiring manager | Unknown | Open | Identify on onboarding. |
| CISO / security leadership | Unknown | Open | Critical for operating model and decision gates. |
| CCoE / platform lead | Unknown | Open | Needed if cloud/platform guardrails are in scope. |
| OT / plant operations lead | Unknown | Open | Needed if plant/industrial network segmentation is in scope. |
| Architecture/governance forum owner | Unknown | Open | Needed for ADR/board pathway. |

Internal ROS side: Joseph/Guy account boundary applies; current reply identity for the engagement is `josephdoronrubin@gmail.com` per `KK/2026-06-24_boortmalt-atcon-offer.md` and `/00_System/principals.md`.

## 3. In-flight decisions

- **D-BOOR-1 — Contract, start, and lawful work route.** Status: open. Offer accepted, but self-employed work is gated by the Belgian professional-card appeal / authorization path recorded in KK memory. Owner: Guy/Joseph + ATCON + immigration/legal advisor where needed.
- **D-BOOR-2 — Onboarding and access prerequisites.** Status: open. Boortmalt/ATCON onboarding docs, device/account, NDA, network/VPN, repositories, and security clearances still to capture. Owner: ATCON + Boortmalt onboarding contact.
- **D-BOOR-3 — Engagement mandate and first deliverable.** Status: open. Hypothesis: CISO/CCoE security architecture onboarding pack followed by current-state security/CCoE baseline and 0-30/30-90 roadmap. Confirm with Boortmalt sponsor. Owner: Joseph/Guy + Boortmalt sponsor/CISO line.
- **D-BOOR-4 — OT/plant security scope.** Status: open. Because Boortmalt is an industrial company, OT/plant segmentation is a high-value hypothesis, not a fact. Confirm whether it is in scope before producing any plant-specific design. Owner: CISO/security architecture + OT/operations lead.

No architectural design decisions are settled yet — IAM/ZTA, CCoE guardrails, segmentation, logging/evidence, and resilience decisions require Boortmalt estate facts first.

## 4. Decision log

| Date | Decision | Rationale |
|---|---|---|
| 2026-06-24 | Boortmalt offer captured under KK operational pack | Offer and admin/permit details originated through job/ops handling. |
| 2026-06-24 | Reply identity set to `josephdoronrubin@gmail.com` for this engagement | The offer/admin pack names Joseph identity; identity remains draft-first for external sends. |
| 2026-06-27 | Boortmalt promoted into EA active workplace context for architecture planning | User asked to define the EA multi-agent/skill system for the new Joseph-onboarded company with CISO/CCoE security focus. |
| 2026-06-27 | First architecture operating model is discovery-first, not design-first | No Boortmalt estate has been disclosed; best system converts ambiguity into onboarding checklist, stakeholder map, baseline review plan, and roadmap. |
| 2026-06-27 | Boortmalt onboarding + first-deliverable pack created | Operating artifact now exists at `EA/clients/Boortmalt/boortmalt-onboarding-first-deliverable-pack-2026-06-27.md`; use it as the first-week checklist, stakeholder/forum map, source-pack request draft, and first-deliverable recommendation. |
| 2026-06-27 | Boortmalt CISO/CCoE baseline workbook created | Execution artifact now exists at `EA/clients/Boortmalt/boortmalt-ciso-ccoe-baseline-workbook-2026-06-27.md`; use it after source-pack access lands to run the current-state baseline, risk/control/evidence backlog, decision log, and 0-30 / 30-90 roadmap. |
| 2026-06-27 | New-customer onboarding separated from reusable knowledge base | Customer-specific onboarding artifacts stay under `EA/clients/Boortmalt/`; reusable frameworks/templates stay under `EA/frameworks/` or `EA/12_Templates/`. Do not fan out Boortmalt onboarding work across ABN or Coca-Cola. |
| 2026-06-27 | Boortmalt new-customer onboarding plan created | Fresh customer-specific plan exists at `EA/clients/Boortmalt/boortmalt-new-customer-onboarding-plan-2026-06-27.md`; use it as the controlling Boortmalt onboarding plan and keep knowledge-base extraction separate. |

## Expected EA outputs (demand-aligned)

Onboarding/access/stakeholder checklist → CISO/CCoE mandate brief → current-state security + cloud/platform baseline → IAM/ZTA and network/OT segmentation assessment → control/evidence matrix → risk-ranked 0-30/30-90/90+ roadmap → target-state security/CCoE HLD → ADRs and executive/CISO briefs.

Activation per `EA/frameworks/ea-skill-process-outcomes.md` and `EA/clients/Boortmalt/ea-multi-agent-security-system-plan.md`.

## Next actions

- [x] Create fresh Boortmalt-only new-customer onboarding plan and customer/knowledge-base separation guard — created `EA/clients/Boortmalt/boortmalt-new-customer-onboarding-plan-2026-06-27.md`.
- [ ] Confirm contract/start/work-authorization route and do not let architecture planning obscure the legal gate.
- [ ] Capture Boortmalt sponsor, CISO line, CCoE/platform lead, architecture board/CAB, and OT/operations counterpart.
- [ ] Request the minimum source pack: org/security mandate, policies, cloud/account map, network/OT topology, identity/PAM model, risk register, logging/SOC overview, BCP/DR posture, current initiatives/backlog.
- [x] Produce the first 72-hour onboarding checklist and first-deliverable hypothesis before attempting target design — created `EA/clients/Boortmalt/boortmalt-onboarding-first-deliverable-pack-2026-06-27.md`.
- [x] Prepare the CISO/CCoE current-state baseline workbook and risk/control/evidence backlog skeleton — created `EA/clients/Boortmalt/boortmalt-ciso-ccoe-baseline-workbook-2026-06-27.md`.
- [ ] Use the source-pack request draft after recipient and sending identity are confirmed.
- [ ] Refresh this dossier whenever a new fact is confirmed; keep assumptions labelled.
