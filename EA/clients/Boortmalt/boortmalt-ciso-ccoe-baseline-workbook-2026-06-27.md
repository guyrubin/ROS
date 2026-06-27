# Boortmalt — CISO/CCoE Security Architecture Baseline Workbook

Date: 2026-06-27
Workplace: Boortmalt
Engagement: Freelance via ATCON Global — Information Security Architect
Owner: Joseph/Guy EA support
Status: Draft-first internal workbook; populate after onboarding/source-pack access
Inputs: `EA/clients/Boortmalt/CONTEXT.md` and `EA/clients/Boortmalt/boortmalt-onboarding-first-deliverable-pack-2026-06-27.md`

---

## 1. Purpose and use

This workbook is the next executable artifact after the onboarding/source-pack request. It gives Joseph/Guy a ready structure for the first Boortmalt baseline review once access lands.

**Working deliverable:** CISO/CCoE Security Architecture Baseline + 0-30 / 30-90 roadmap.

**Important boundary:** Boortmalt estate details are not yet disclosed. Every section below separates confirmed facts, hypotheses, evidence to collect, and decisions needed. Do not convert hypotheses into facts.

---

## 2. Executive baseline one-pager

### Current implication

Boortmalt is entering a CISO/CCoE security architecture discovery phase. The immediate architectural risk is not a known design flaw; it is the lack of confirmed estate facts, decision owners, source repositories, and governance forums. The first baseline should therefore establish the fact base and decision path before recommending target designs.

### Primary ask

Confirm the sponsor/CISO line, scope boundaries, source-pack access, governance forums, and whether cloud/CCoE and OT/plant segmentation are in scope.

### Consequence if not resolved

Without these confirmations, any target-state recommendation risks being either too generic to drive action or too specific for an estate that has not been validated.

### First recommendation

Run a two-track first week:

1. **Admin/access track:** lawful start, account/device/VPN, repositories, meetings, and stakeholder introductions.
2. **Architecture baseline track:** source-pack review, known-unknowns closure, risk/control/evidence matrix, governance map, and 0-30 / 30-90 roadmap.

---

## 3. Facts, hypotheses, and evidence log

| Area | Confirmed facts | Hypotheses to validate | Evidence/source to collect | Owner/forum | Status |
|---|---|---|---|---|---|
| Engagement model | Freelance via ATCON Global; Information Security Architect role; offer accepted context exists in KK source pack | Start depends on contract/work-authorization route | Signed contract/final terms, start confirmation, onboarding checklist | Joseph/Guy + ATCON | Open |
| Sponsor and mandate | End client is Boortmalt, Antwerp | CISO/CCoE support is the first useful mandate | Sponsor intro, role description, first-week priorities, success criteria | Boortmalt sponsor/CISO | Open |
| CCoE/cloud | Not disclosed | Cloud/platform guardrails may be in scope | Cloud providers, account/subscription map, landing-zone docs, CCoE operating model | CCoE/platform lead | Open |
| IAM/PAM/ZTA | Not disclosed | High-value security control surface for CISO support | IdP, MFA/conditional access, PIM/PAM, access review evidence | IAM/security lead | Open |
| Network/OT | Not disclosed | Industrial/OT segmentation may be relevant, but must not be assumed | High-level topology, remote/vendor access, plant/OT scope confirmation | Network + OT/ops lead | Open |
| Controls/evidence | Not disclosed | NIS2/ISO/NIST/CIS/internal policy evidence likely relevant | Policy set, risk register, audit findings, evidence repositories | Risk/compliance owner | Open |
| SecOps/resilience | Not disclosed | Logging, vulnerability, incident, backup/DR and ransomware readiness likely baseline domains | SIEM/SOC overview, vulnerability process, incident/DR docs | SecOps/resilience owners | Open |
| Governance | Not disclosed | Decisions likely flow through CISO cadence, architecture board, CAB, risk/audit forums | Forum names, cadence, chair, decision log location | Sponsor/forum owners | Open |

---

## 4. Baseline review workplan

### Phase 0 — Gate checks before architecture work

- Confirm lawful start/work-authorization path.
- Confirm signed commercial/admin route and actual start date.
- Confirm whether Joseph or Guy is the sender/primary representative for Boortmalt communications.
- Confirm confidentiality constraints, document handling rules, and approved storage locations.

### Phase 1 — Orientation and source-pack intake

- Sponsor/hiring-manager briefing: mandate, priorities, success criteria, deadlines.
- CISO/security leadership briefing: top risks, control obligations, evidence pain points, decision forums.
- CCoE/platform briefing if in scope: cloud estate, guardrails, account/subscription model, IaC/policy tooling.
- Network/OT briefing if in scope: zone model, remote/vendor access, critical flows, operational constraints.
- Repository mapping: Confluence/SharePoint, ServiceNow/Jira, architecture repository, risk register, policy/evidence store.

### Phase 2 — Current-state baseline

- Build current-state fact base by domain: identity, cloud/platform, network/OT, controls/evidence, SecOps/resilience, governance.
- Identify evidence freshness and owner for each claim.
- Separate quick wins, structural risks, and decision-required risks.
- Start architecture decision log and risk/control backlog.

### Phase 3 — Sponsor/CISO readout

- Present the current-state baseline summary.
- Confirm top risks and decision gates.
- Agree the 0-30 / 30-90 roadmap.
- Decide whether the next artifact is IAM/ZTA assessment, CCoE guardrail review, network/OT segmentation assessment, control/evidence matrix, or target-state HLD.

---

## 5. Domain review sections

### 5.1 Identity, Zero Trust, and privileged access

**Questions to answer**

- What is the primary IdP/federation model?
- How are MFA, conditional access, and admin access enforced?
- What PAM/PIM capability exists and where is evidence stored?
- How are service/workload/vendor identities governed?
- How often are access reviews performed and by whom?

**Evidence to collect**

- IdP architecture overview.
- MFA/conditional-access policy summary.
- PAM/PIM process and privileged role inventory.
- Joiner/mover/leaver process and access-review evidence.
- Break-glass account procedure.

**Initial risks to test, not assume**

- Excessive privileged access.
- Incomplete MFA/conditional-access coverage.
- Weak service/workload identity ownership.
- Access review evidence not mapped to control requirements.

### 5.2 CCoE, cloud, and platform guardrails

**Questions to answer**

- Which cloud providers/platforms are in scope?
- How are accounts/subscriptions/projects structured?
- What guardrails are preventive, detective, and corrective?
- What IaC/policy-as-code tooling is used?
- What is the service catalog and exception path?

**Evidence to collect**

- Cloud/account/subscription map.
- Landing-zone or platform foundation docs.
- Guardrail/policy catalog.
- IaC/pipeline overview.
- Exception and waiver process.

**Initial risks to test, not assume**

- Guardrail drift across environments.
- Manual exceptions without expiry/evidence.
- Weak logging/tagging/network defaults.
- Unclear ownership between CCoE, application teams, and security.

### 5.3 Network, remote access, and possible OT/plant segmentation

**Questions to answer**

- What network zones and trust boundaries exist?
- Is OT/plant scope part of the engagement?
- How are vendor/remote access and third-party connections controlled?
- Which flows are business-critical and cannot be disrupted?
- Where are firewall/segmentation exceptions tracked?

**Evidence to collect**

- High-level topology and zone model.
- Remote access and vendor access overview.
- Segmentation standards and exception register.
- Critical flow inventory.
- OT scope statement if relevant.

**Initial risks to test, not assume**

- Flat or inconsistently enforced segmentation.
- Third-party/vendor access outside central control.
- OT monitoring constraints not visible to enterprise security.
- Missing evidence for segmentation exceptions.

### 5.4 Controls, evidence, compliance, and audit

**Questions to answer**

- Which control frameworks and policies govern the scope?
- Who owns evidence for each control domain?
- How current are audit findings, exceptions, and remediation plans?
- What is the risk acceptance path?
- Does NIS2 or other regulatory scope apply, and where is that documented?

**Evidence to collect**

- Policy/control set.
- Risk register and audit findings.
- Evidence repository map.
- Exception/waiver process.
- Regulatory applicability statement.

**Initial risks to test, not assume**

- Controls exist on paper but evidence is stale or ownerless.
- Findings are not mapped to remediation backlog.
- Risk acceptance is informal or forum ownership is unclear.
- Regulatory scope is assumed rather than documented.

### 5.5 SecOps, resilience, and ransomware readiness

**Questions to answer**

- What SIEM/SOC/logging coverage exists for critical systems?
- How are vulnerabilities prioritized and remediated?
- What incident response process is current and tested?
- What are backup/DR/RTO/RPO expectations?
- How is ransomware recovery validated?

**Evidence to collect**

- SIEM/SOC overview.
- Vulnerability-management process and dashboard summary.
- Incident response playbook and last exercise summary.
- Backup/DR policy and recovery test evidence.
- Critical service inventory.

**Initial risks to test, not assume**

- Logging coverage gaps for privileged/admin paths.
- Vulnerability backlog lacks risk-based prioritization.
- Backup/DR evidence does not match business-critical service expectations.
- Incident playbooks exist but are not exercised.

---

## 6. Risk/control/evidence backlog

| ID | Finding / unknown | Risk statement | Severity hypothesis | Evidence needed | Owner | Decision gate | Due window | Acceptance criteria | Status |
|---|---|---|---|---|---|---|---|---|---|
| BOOR-RISK-001 | Lawful start and contract route not closed in EA context | Architecture work could be planned before the engagement is legally/admin ready | High until confirmed | Signed route/start confirmation | Joseph/Guy + ATCON | Contract/start decision | 0-30 | Start route confirmed or explicit blocker recorded | Open |
| BOOR-RISK-002 | Sponsor/CISO line unknown | Baseline may lack decision owner and escalation path | High until confirmed | Sponsor/CISO intro and mandate | Boortmalt sponsor | Mandate confirmation | 0-30 | Named sponsor and CISO/security lead captured | Open |
| BOOR-RISK-003 | Source repositories unknown | Baseline could rely on meetings rather than evidence | Medium | Repository/source-pack map | Sponsor/forum owners | Source-pack approval | 0-30 | Key repositories and evidence owners mapped | Open |
| BOOR-RISK-004 | CCoE/cloud scope unconfirmed | Cloud guardrail work could be over- or under-scoped | Medium | Scope statement and platform owner | Sponsor + CCoE lead | Scope confirmation | 0-30 | Cloud/CCoE scope confirmed or parked | Open |
| BOOR-RISK-005 | OT/plant segmentation scope unconfirmed | Plant assumptions could create inaccurate or unsafe recommendations | Medium | OT scope statement and owner | Sponsor + OT/ops lead | Scope confirmation | 0-30 | OT/plant in-scope/out-of-scope decision captured | Open |
| BOOR-RISK-006 | Control/evidence framework unknown | Findings may not map to accepted risk/control language | Medium | Policy/control set, risk register, audit findings | Risk/compliance owner | CISO/risk forum | 0-30 | Control/evidence map started | Open |

---

## 7. Decision log candidates

| Decision | Context | Options | Recommendation | Owner/forum | Status | Consequence if delayed |
|---|---|---|---|---|---|---|
| Confirm first deliverable | Baseline vs target design sequencing | A: Start with CISO/CCoE baseline; B: jump to target HLD; C: wait for full access before producing anything | A — baseline first, because estate facts and forums are unknown | Sponsor/CISO | Open | Target design may be generic or unvalidated |
| Confirm CCoE/cloud scope | Role likely touches CCoE/cloud guardrails, but estate not disclosed | A: In scope; B: advisory only; C: out of scope for first month | Confirm with sponsor before collecting deep cloud evidence | Sponsor + CCoE lead | Open | Guardrail review may be mis-scoped |
| Confirm OT/plant scope | Industrial context creates plausible OT relevance, but no facts yet | A: In scope; B: interface only; C: out of scope | Treat as hypothesis until sponsor confirms | Sponsor + OT/ops lead | Open | Plant/security recommendations could be unsafe or irrelevant |
| Confirm governance path | Recommendations need decision forum | A: CISO cadence; B: architecture board; C: CAB/risk forum; D: mixed path | Map forums and decision log before issuing recommendations | Sponsor/forum owners | Open | Findings may not convert into decisions/backlog |

---

## 8. 0-30 / 30-90 roadmap draft

### 0-30 days — Stabilize mandate and baseline

- Close contract/start/work-authorization gate.
- Confirm sponsor, CISO/security line, CCoE/platform lead, architecture/CAB/risk forums, and OT/ops counterpart if relevant.
- Obtain source-pack access and map repositories/evidence owners.
- Produce current-state fact base and known-unknowns log.
- Build initial risk/control/evidence backlog.
- Agree the first readout format with sponsor/CISO.

### 30-90 days — Convert baseline into decisions and backlog

- Complete CISO/CCoE baseline and sponsor/CISO readout.
- Prioritize IAM/PAM/ZTA, cloud guardrails, network/OT segmentation, controls/evidence, and SecOps/resilience findings based on evidence.
- Draft ADRs or architecture-board one-pagers for decision-required items.
- Shape remediation backlog with owners, dependencies, and acceptance criteria.
- Agree whether to proceed into target-state security/CCoE HLD.

### 90+ days — Target-state and operating model

- Produce target-state security/CCoE HLD once facts support it.
- Institutionalize guardrail/control evidence ownership.
- Tie roadmap to governance cadence, budget/resource constraints, and risk acceptance path.
- Track implementation evidence and exceptions through the agreed forum.

---

## 9. Sponsor/CISO readout skeleton

1. **Implication:** what the baseline says about current security/platform risk.
2. **Confirmed facts:** evidence-backed current state only.
3. **Material unknowns:** what blocks confident recommendation.
4. **Top 5 risks/decisions:** owner, forum, consequence of no decision.
5. **Quick wins:** actions with low dependency and clear evidence.
6. **Structural decisions:** items needing sponsor/CISO/architecture/CAB approval.
7. **Roadmap:** 0-30 / 30-90 / 90+.
8. **Ask:** access, owner assignment, decision, or risk acceptance.

---

## 10. Definition of done for the first baseline

- Boortmalt-only context; no references to other workplaces.
- Facts, hypotheses, and open questions are visibly separated.
- Every finding links to an evidence source or is labelled as unknown.
- Sponsor/CISO, CCoE/platform, network/OT, risk/compliance, SecOps/resilience ownership is mapped or explicitly open.
- Risks include owner, decision gate, acceptance criteria, and evidence needed.
- Roadmap separates 0-30, 30-90, and 90+ work.
- The next artifact is chosen based on facts: IAM/ZTA assessment, CCoE guardrail review, network/OT segmentation assessment, control/evidence matrix, or target-state HLD.
