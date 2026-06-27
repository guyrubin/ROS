# Boortmalt CISO/CCoE Security EA Multi-Agent + Skill System Plan

> **For Hermes / Claude / Codex:** this is a planning and operating artifact, not a client deliverable yet. Before producing any Boortmalt architecture output, load `EA/clients/Boortmalt/CONTEXT.md` and keep all assumptions labelled.

**Goal:** Give Joseph/Guy the fastest safe operating system for the Boortmalt Information Security Architect engagement: CISO-adjacent security architecture + CCoE/cloud guardrails + industrial/OT-aware risk roadmap, without overbuilding or leaking other client context.

**Architecture:** Use one isolated `ea-lead` context for Boortmalt and activate specialist skill lanes as needed. Do not run broad parallel agents by default; run scoped specialist reviews only after Boortmalt source material is present. The system optimizes for speed-to-first-value: first 72 hours = access/stakeholders/source pack; first 30 days = baseline + risk backlog; 30-90 days = target-state decisions, CCoE guardrails, and roadmap execution.

**Active principal / identity:** Joseph/Guy account boundary applies; external communication remains draft-first and uses `josephdoronrubin@gmail.com` only when explicitly confirmed.

---

## 1. Design verdict

The best system is **not** a generic EA taxonomy and not a many-agent swarm. It is a **single-client security architecture cell**:

1. **One accountable lead:** `ea-lead` owns Boortmalt context, confidentiality, final voice, decision framing, and artifact quality.
2. **Specialist skill lanes:** reusable cards for CISO governance, CCoE guardrails, IAM/ZTA/PAM, network/OT segmentation, controls/evidence, SecOps/logging, resilience, and executive communication.
3. **Smallest useful activation:** only activate lanes needed for the current artifact.
4. **Discovery-first:** no target design until Boortmalt estate facts exist.
5. **Artifact-first:** every run produces or updates one useful artifact: checklist, stakeholder map, source-pack request, current-state review, risk backlog, HLD, ADR, or CISO brief.

Why this is most efficient/effective:
- Avoids cross-client leakage by keeping one Boortmalt context.
- Avoids over-analysis by forcing artifacts and owners.
- Covers CISO and CCoE scope without pretending the estate is known.
- Fits the engagement cadence: 3 days/week ramping upward means high-leverage prioritization matters more than exhaustive documentation.

---

## 2. Operating model

| Layer | Role | What it does | Output |
|---|---|---|---|
| Accountable lead | `ea-lead` | Confirms Boortmalt context, selects skill lanes, owns recommendation, preserves confidentiality | Final artifact + next actions |
| Security governance lane | CISO operating model skill | Maps decision forums, policy/control ownership, risk acceptance, security architecture authority | CISO governance map, decision path |
| CCoE/platform lane | Cloud guardrails skill | Reviews cloud operating model, landing zones, policy-as-code, platform service catalog, FinOps/tagging | CCoE baseline/gap analysis, guardrail backlog |
| Identity lane | IAM/ZTA/PAM skill | Reviews identity, privileged access, access lifecycle, workload identity, evidence | IAM/ZTA assessment, access evidence plan |
| Network/OT lane | Segmentation skill | Reviews enterprise + plant/OT zones, remote access, third-party connectivity, critical flows | Zone model, flow inventory, segmentation backlog |
| Control/evidence lane | Compliance-to-control skill | Maps NIS2/ISO/NIST/CIS/internal policy to controls and evidence | Requirement-control-evidence matrix |
| SecOps/resilience lane | Detection + resilience skill | Reviews logging/SOC/vulnerability/backup/DR/ransomware recovery | Detection/evidence gaps, resilience risk register |
| Roadmap lane | Risk backlog skill | Sequences work into quick wins, structural fixes, governance decisions | 0-30 / 30-90 / 90+ roadmap |
| Exec lane | CISO/CTO communication skill | Turns architecture work into leadership-ready asks | Sponsor/CISO brief, decision memo |

Execution rule: lanes are **skills**, not independent client-memory owners. If subagents are used, each gets only Boortmalt context and a narrow task; `ea-lead` integrates and checks quality.

---

## 3. Top relevant skill stack for Boortmalt

### Skill A — Engagement mandate and onboarding capture
Use when: starting/stabilizing the engagement.

Inputs:
- Signed contract/start route, sponsor, reporting line, Boortmalt onboarding checklist.
- Accesses: device, email/Teams, VPN, repositories, ticketing, risk register, architecture docs, cloud/security consoles.
- Governance calendar: CISO cadence, CCoE/platform board, architecture board, CAB, risk/audit meetings.

Artifacts:
- First 72-hour checklist.
- Stakeholder map.
- First-deliverable hypothesis.
- Source-pack request.

Quality bar:
- Separates admin/legal blockers from architecture blockers.
- Every unknown has owner + next action.

### Skill B — CISO operating model and security governance
Use when: role needs to support CISO/security leadership.

Inputs:
- Security strategy, policy set, risk appetite, exception process, architecture approval path.
- Ownership model: CISO, CIO/IT, CCoE, operations, OT/plant, data/privacy, audit.

Artifacts:
- CISO governance map.
- Security architecture decision path.
- Risk acceptance and exception workflow.
- Decision log template.

Quality bar:
- Makes it clear who decides, who owns risk, and where evidence lives.

### Skill C — CCoE / cloud platform guardrails
Use when: cloud/platform foundations, landing zones, or CCoE are in scope.

Inputs:
- Cloud providers; account/subscription structure; landing zones; IAM; network; logging; IaC; CI/CD; policy tooling; exceptions.
- Platform service catalog and consumers.

Artifacts:
- Landing-zone and CCoE baseline review.
- Guardrail catalog: preventive, detective, corrective.
- Policy-as-code backlog.
- CCoE KPI set: coverage, exceptions, deployment compliance, cost/tagging, evidence freshness.

Quality bar:
- Links guardrails to operational ownership and developer/platform adoption, not only security theory.

### Skill D — IAM / Zero Trust / PAM
Use when: identity, privileged access, federation, workload identity, or access review appears.

Inputs:
- IdP/SSO/MFA/conditional access, PAM/PIM, admin roles, service accounts, vendor access, break-glass, JML/access review.

Artifacts:
- IAM/ZTA maturity assessment.
- Privileged access model.
- Role/entitlement catalog outline.
- Access evidence process.
- ADR candidates for IdP/PAM/workload identity/conditional access.

Quality bar:
- Prioritizes privileged access traceability and evidence.

### Skill E — Network + OT/plant segmentation
Use when: enterprise network, plant/OT, remote access, third-party connectivity, or ransomware containment is in scope.

Inputs:
- Topology, zones, trust boundaries, plant/OT network maps, critical flows, remote/vendor access, firewall policy, DNS/certificates, monitoring constraints.

Artifacts:
- Enterprise/OT zone model.
- Critical-flow inventory.
- Segmentation policy matrix.
- Remote/vendor access pattern review.
- Migration backlog that avoids breaking production.

Quality bar:
- Treats OT/plant scope as a hypothesis until confirmed; if confirmed, uses IEC 62443-style zoning/conduits thinking and operational safety constraints.

### Skill F — Compliance-to-control and evidence
Use when: NIS2, ISO 27001, CIS Controls, NIST CSF, GDPR, audit, policy, or customer requirements are involved.

Inputs:
- Applicable policy/regulatory clauses, control owners, evidence sources, risk register, audit findings, exceptions.

Artifacts:
- Requirement-control-evidence matrix.
- Control gap analysis.
- Risk acceptance/escalation path.
- Remediation backlog.

Quality bar:
- Evidence is explicit: source, owner, frequency, freshness, and system of record.

### Skill G — SecOps, resilience, and ransomware readiness
Use when: logging, SOC/SIEM, vulnerability management, backup/DR, incident response, or resilience is in scope.

Inputs:
- SIEM/SOC model, logging coverage, vulnerability process, endpoint/network detection, backup/restore, DR tests, incident runbooks, crisis comms.

Artifacts:
- Detection/evidence coverage map.
- Vulnerability-to-risk workflow.
- Ransomware recovery gap list.
- Resilience/DR risk register.

Quality bar:
- Separates paper controls from tested operational capability.

### Skill H — Roadmap, ADR, and executive communication
Use when: findings need sequencing, decisions, funding, or leadership action.

Inputs:
- Findings, severity, dependencies, owners, cost/delivery impact, governance dates.

Artifacts:
- 0-30 / 30-90 / 90+ roadmap.
- ADRs / architecture board one-pagers.
- CISO/sponsor update.
- Escalation list.

Quality bar:
- Every executive output has a clear ask and consequence of no decision.

---

## 4. Activation matrix

| Demand | Activate | Produce |
|---|---|---|
| Start/onboard Boortmalt | A + H | First 72-hour checklist, stakeholder map, source-pack request, first-deliverable brief |
| Clarify CISO expectations | A + B + H | CISO mandate brief, governance map, decision-path one-pager |
| Clarify CCoE/platform scope | A + C + F + H | CCoE baseline checklist, guardrail inventory request, platform governance questions |
| Review current state | B + C + D + E + F + G | Current-state security/CCoE baseline, findings heatmap, control/evidence matrix |
| Identity / privileged access | D + F + H | IAM/ZTA/PAM assessment, access evidence plan, ADR candidates |
| Network / OT / third-party access | E + G + F | Zone model, critical-flow inventory, segmentation backlog, monitoring/evidence needs |
| Prepare CISO update | H + the active technical lane | One-page implication/ask, risks, decision needed, next owner |
| Turn findings into plan | H + all lanes with findings | 0-30 / 30-90 / 90+ roadmap, backlog, escalation list |
| Target-state HLD | B + C + D + E + F + G + H | Security/CCoE target-state HLD, transition roadmap, ADR list |

---

## 5. First 72 hours: minimum viable effectiveness

### Task 1 — Confirm the non-architecture gate
Objective: stop legal/admin uncertainty from contaminating architecture planning.

Capture:
- Signed contract / final ATCON terms.
- Confirmed start date and allowed work route.
- Boortmalt onboarding checklist.
- Whether the professional-card appeal gate affects the start.

Artifact:
- Update `EA/clients/Boortmalt/CONTEXT.md` §3 D-BOOR-1 and §2 stakeholder table.

### Task 2 — Identify the decision system
Objective: know who can decide before designing.

Capture roles:
- Sponsor / hiring manager.
- CISO or security leadership line.
- CCoE/platform lead.
- IT operations / infrastructure lead.
- OT/plant operations lead if relevant.
- Architecture board/CAB/risk forum owner.

Artifact:
- Stakeholder map + governance cadence.

### Task 3 — Request source pack
Objective: get enough evidence for a baseline without boiling the ocean.

Ask for:
- Security strategy / policy set / risk register.
- Cloud/account/subscription and landing-zone docs.
- IAM/PAM/access review docs.
- Network topology + remote access + third-party access docs.
- Plant/OT segmentation docs if in scope.
- SIEM/SOC/logging/vulnerability process overview.
- BCP/DR/ransomware recovery docs.
- Current architecture backlog / audit findings / known risks.

Artifact:
- Source-pack request note or email draft.

### Task 4 — Confirm first deliverable
Objective: align expectations before producing a heavy artifact.

Recommended first deliverable:
- “CISO/CCoE Security Architecture Baseline: current state, top risks, decision path, and 0-30/30-90 roadmap.”

Alternative deliverables:
- CCoE guardrail baseline if platform is the core need.
- IAM/PAM quick assessment if access control is the urgent pain.
- Network/OT segmentation quick scan if production/plant risk is dominant.

Artifact:
- First-deliverable brief for sponsor/CISO.

---

## 6. 30/60/90 operating cadence

### Days 0-30 — Baseline and trust
Outputs:
- Onboarding/access tracker.
- Stakeholder/governance map.
- Current-state security + CCoE baseline.
- Top 10 risk findings with evidence status.
- Quick-win backlog.

Decision gates:
- Confirm scope and authority.
- Confirm whether OT/plant security is in scope.
- Confirm control framework and evidence system of record.

### Days 30-60 — Target direction and guardrails
Outputs:
- CCoE/platform guardrail catalog.
- IAM/ZTA/PAM target principles.
- Network/OT segmentation principles if in scope.
- Compliance-to-control evidence matrix.
- ADR candidates for major design choices.

Decision gates:
- Approve guardrail standards.
- Approve risk acceptance path and exception workflow.
- Prioritize structural fixes vs quick wins.

### Days 60-90 — Roadmap execution and governance embed
Outputs:
- Target-state security/CCoE HLD.
- 0-30 / 30-90 / 90+ roadmap refreshed from facts.
- Architecture board/CISO decision pack.
- Metrics dashboard concept: risk burn-down, guardrail adoption, evidence freshness, privileged access coverage.

Decision gates:
- Sponsor/CISO signs off target-state direction.
- Owners assigned to roadmap items.
- Evidence and reporting cadence embedded.

---

## 7. Definition of done

Any Boortmalt EA artifact is done only when:

- `EA/clients/Boortmalt/CONTEXT.md` was loaded first.
- Workplace is named as Boortmalt and no other client context appears.
- Facts vs assumptions are explicit.
- Current state, target state, and transition path are separated.
- CISO/CCoE decision owner is named or listed as unknown with next action.
- Risks have owner, severity, decision gate, or discovery action.
- Evidence source/system of record is stated where controls are discussed.
- Output ends with the next 3-5 actions and owners.

---

## 8. Immediate next artifact to produce

Produce a Boortmalt onboarding + first-deliverable pack:

1. One-page CISO/CCoE mandate brief.
2. First 72-hour onboarding/access checklist.
3. Stakeholder and forum map template.
4. Source-pack request.
5. First-deliverable recommendation: current-state security/CCoE baseline + 0-30/30-90 roadmap.
