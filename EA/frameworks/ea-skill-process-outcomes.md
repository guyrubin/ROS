# EA Demand-Aligned Skill Model

Last updated: 2026-06-04
Owner: EA

Purpose: define the actual EA skills ROS should activate for Guy's current work demands: ABN AMRO Security Enterprise Architecture onboarding and Coca-Cola Infrastructure & Security Enterprise Architecture. This replaces generic architecture categories with outcome-driven skill cards tied to the work Guy is expected to perform.

This is reusable across workplaces, but workplace facts, stakeholders, decisions, and deliverables remain under `EA/clients/[client]/` and must not be mixed.

---

## Current demand signals

### ABN AMRO — Security Enterprise Architect

Demand profile:
- Onboarding is active; immediate demand is to confirm scope, access, stakeholders, governance forums, and first deliverable.
- Current-state security architecture review and target-state security HLD are explicit milestones.
- Domain focus: Security architecture, IAM / Zero Trust, network segmentation, banking compliance, DORA / DNB / NIS2, and internal architecture decision support.
- Likely tooling to confirm: ServiceNow, Azure DevOps, Confluence, Archi, and client security/governance repositories.

### Coca-Cola — Infrastructure & Security Enterprise Architect

Demand profile:
- Contract/final onboarding is active; immediate demand is contract/admin closure and readiness for infrastructure/security scope discovery.
- Infra & security baseline review and target-state HLD update are explicit milestones.
- Domain focus: infrastructure and security architecture, cloud landing zones, network, identity, security baselines, secure operations, resilience, and enterprise platform governance.
- Likely tooling to confirm: ServiceNow, Jira, Confluence, cloud consoles, architecture repositories, and security/platform dashboards.

## Operating principle

The EA agent should not answer with broad theory. It should select one or more skill cards below and produce the concrete artifact the workplace would expect from a senior security/infrastructure enterprise architect.

Each output must include:
- Workplace: ABN or Coca-Cola.
- Demand being served: onboarding, current-state review, target-state HLD, decision support, roadmap/backlog, compliance evidence, or executive briefing.
- Artifact type and owner.
- Facts vs assumptions.
- Risks, dependencies, decision gates, and next actions.

---

## Core skill cards

### Skill 1 — Engagement scope and onboarding capture

Use when:
- Guy needs to start or stabilize an engagement.
- The scope, stakeholders, systems, tools, accesses, or first deliverable are unclear.
- The work is more about entering the organization correctly than designing the architecture yet.

Inputs to capture:
- Role mandate and success criteria.
- Stakeholders: sponsor, manager, CISO/CTO delegates, platform leads, security leads, architecture board, delivery leads.
- Tooling and repositories: ServiceNow/Jira, Confluence, architecture repository, cloud portals, CMDB, risk register, policy repositories, backlog tools.
- Governance calendar: architecture board, CAB, risk committee, security review, sprint/planning cadence.
- First 30/60/90-day expectations.
- Access blockers and compliance/admin steps.

Expected artifacts:
- Engagement brief.
- Onboarding/access checklist.
- Stakeholder map.
- First-deliverable hypothesis.
- Known-unknowns log.
- 30/60/90-day architecture plan.

Quality bar:
- No assumed client facts.
- Clear separation between onboarding/admin blockers and architecture blockers.
- Every unknown has an owner or discovery action.

### Skill 2 — Current-state security/infrastructure architecture review

Use when:
- The workplace asks for an assessment, baseline, health check, review, or gap analysis.
- Guy needs to understand current risks before proposing a target state.

Inputs to gather:
- Architecture diagrams and inventories.
- Business-critical services and data flows.
- Identity model, network topology, cloud account/subscription structure, platforms, CI/CD, logging, monitoring, backup/DR.
- Existing policies, standards, exceptions, controls, incidents, risks, audit findings, and technical debt.
- NFR expectations: availability, RTO/RPO, security, privacy, latency, scalability, operability, cost.

Analysis dimensions:
- Identity and privileged access.
- Network and segmentation.
- Cloud/platform landing zone and guardrails.
- Secrets, certificates, and key management.
- Logging, detection, response, and evidence.
- Resilience, backup, DR, and operational handover.
- Compliance/control alignment.

Expected artifacts:
- Current-state review.
- Architecture risk register.
- Control/gap matrix.
- Heatmap by domain and severity.
- Remediation backlog grouped by quick wins, structural fixes, and decisions required.
- Executive summary for sponsor/CISO/CTO.

ABN emphasis:
- Banking-grade risk framing, DORA/DNB/NIS2 implications, IAM/ZTA, segmentation, evidence, traceability.

Coca-Cola emphasis:
- Enterprise infrastructure baseline, landing zones, network/identity/security baselines, operability, resilience, and global/local governance fit.

### Skill 3 — Target-state HLD / architecture blueprint

Use when:
- The workplace expects a high-level design, target-state architecture, or modernization/secure-by-design blueprint.
- A current-state review has found enough facts to propose direction.

Inputs to define:
- Business capability or platform scope.
- Architecture principles and constraints.
- Options considered and rejected.
- Target components, trust boundaries, integrations, data flows, and operational model.
- NFRs, controls, compliance obligations, and exit costs.

Expected artifacts:
- HLD / target-state blueprint.
- C4-style context/container views where useful.
- Security architecture view: identity, network, data, workload, logging, and control planes.
- Transition roadmap: now / next / later.
- Decision list and ADR candidates.
- Validation plan: reviews, tests, evidence, sign-offs.

ABN emphasis:
- Security HLD: IAM/ZTA, segmentation, secure access, auditability, policy alignment, risk acceptance paths.

Coca-Cola emphasis:
- Infrastructure & Security HLD: landing zone, hybrid/multi-cloud connectivity, network/security baselines, monitoring, resilience/DR, platform operations.

### Skill 4 — IAM / Zero Trust / privileged access design

Use when:
- The issue involves identity, authentication, authorization, privileged access, federation, service accounts, workload identity, conditional access, or access review.

Inputs to gather:
- Identity providers and federation model.
- Human, admin, service, workload, machine, vendor, and break-glass identities.
- Role model: RBAC/ABAC, entitlements, groups, lifecycle, SoD constraints.
- Current privileged access, JIT/JEA, PIM/PAM, MFA, conditional access, and logging.
- Joiner/mover/leaver and access review processes.

Expected artifacts:
- IAM/ZTA assessment.
- Target identity architecture.
- Privileged access model.
- Role and entitlement catalog outline.
- Access lifecycle and evidence process.
- Break-glass and emergency access design.
- ADRs for federation, IdP, PAM/PIM, workload identity, or conditional access.

ABN emphasis:
- Segregation of duties, audit evidence, privileged access traceability, banking compliance.

Coca-Cola emphasis:
- Enterprise-scale identity integration, platform access, operational support, baseline consistency across regions/platforms.

### Skill 5 — Network segmentation and secure connectivity

Use when:
- The work concerns network zones, micro-segmentation, private endpoints, hybrid connectivity, traffic inspection, service mesh, mTLS, ingress/egress, or third-party connectivity.

Inputs to gather:
- Network topology, zones, trust boundaries, routing, firewall policy, DNS, certificates, ingress/egress, private connectivity, and external dependencies.
- Critical application flows and data classifications.
- Existing segmentation standards and exceptions.

Expected artifacts:
- Network/security zone model.
- Segmentation policy matrix.
- Traffic-flow inventory and risk hotspots.
- Secure connectivity pattern catalog.
- Migration plan that avoids breaking business-critical flows.
- Monitoring and evidence requirements.

ABN emphasis:
- Banking network segmentation, regulated data flows, privileged/admin paths, third-party risk.

Coca-Cola emphasis:
- Global/local network patterns, cloud connectivity, plant/office/platform segmentation where applicable, operational resilience.

### Skill 6 — Cloud landing zone and platform guardrails

Use when:
- The work involves Azure/AWS foundations, subscriptions/accounts, policy, IaC, CI/CD, GitOps, platform services, developer self-service, or CCoE/platform engineering.

Inputs to gather:
- Cloud operating model, account/subscription structure, management groups/OUs, identity, network, logging, secrets, shared services, deployment pipelines, policy exceptions.
- Existing Azure Policy/AWS SCPs, Terraform/Bicep/CloudFormation, GitHub Actions/Azure DevOps/ArgoCD/Flux, OPA/Sentinel.
- Platform consumers and service catalog.

Expected artifacts:
- Landing-zone baseline review.
- Guardrail catalog: preventive, detective, corrective.
- Policy-as-code backlog.
- Platform service catalog outline.
- Environment promotion and change model.
- FinOps/tagging/cost governance model.
- Adoption roadmap and KPIs.

ABN emphasis:
- Cloud guardrails only where confirmed in scope; tie to DORA/NIS2, evidence, risk acceptance, and bank governance.

Coca-Cola emphasis:
- Core demand area: secure cloud/platform foundations, multi-cloud/hybrid integration, baseline consistency, developer enablement, and operability.

### Skill 7 — Compliance-to-control translation

Use when:
- The work mentions DORA, NIS2, DNB, GDPR, ISO 27001/27002, PCI-DSS, SOC 2, NIST CSF, CIS Controls, audit, evidence, policy, or control testing.

Inputs to gather:
- Relevant regulation/policy clauses.
- Existing controls and evidence sources.
- System/service scope.
- Risk ownership and control ownership.
- Audit findings, exceptions, and remediation plans.

Expected artifacts:
- Requirement-to-control map.
- Evidence matrix.
- Control gap analysis.
- Risk acceptance/escalation path.
- Remediation backlog.
- Executive compliance/risk narrative.

ABN emphasis:
- DORA, DNB expectations, NIS2, banking control traceability, and operational resilience evidence.

Coca-Cola emphasis:
- Global enterprise policy alignment, ISO/NIS2/GDPR where relevant, operational evidence and platform guardrails.

### Skill 8 — Architecture decision record and governance

Use when:
- There is a design decision, architecture board submission, exception, standard, or cross-team trade-off.

Inputs to capture:
- Decision context and business driver.
- Options and trade-offs.
- Security/compliance implications.
- Cost, operability, delivery, and exit implications.
- Stakeholders and sign-off forum.

Expected artifacts:
- ADR.
- Architecture board one-pager.
- Exception request with compensating controls.
- Decision log entry.
- Follow-up action list.

Quality bar:
- Explicit recommendation, not neutral analysis only.
- Decision owner and date/forum identified.
- Consequences and residual risks stated.

### Skill 9 — Risk-based roadmap and backlog shaping

Use when:
- The work needs sequencing, remediation planning, dependency mapping, or backlog items from a review/HLD.

Inputs to gather:
- Findings and design gaps.
- Severity/impact, urgency, dependencies, owners, budget/resource constraints.
- Quick wins vs strategic fixes.
- Compliance deadlines and operational freeze windows.

Expected artifacts:
- Prioritized roadmap: 0–30 / 30–90 / 90+ days.
- Risk-ranked backlog with acceptance criteria.
- Dependency map.
- Decision and escalation list.
- Milestone plan tied to governance forums.

ABN emphasis:
- First roadmap should likely support onboarding → current-state review → target-state security HLD.

Coca-Cola emphasis:
- First roadmap should likely support contract/onboarding → infra/security baseline review → target-state HLD update.

### Skill 10 — Executive / CISO / CTO communication

Use when:
- The output is for leadership, sponsors, governance boards, architecture boards, recruiters, onboarding stakeholders, or client executives.

Inputs to gather:
- Audience and decision needed.
- Business impact, risk impact, delivery impact, and cost/operability impact.
- Options and recommended path.
- Ask: approve, fund, prioritize, accept risk, unblock access, or assign owner.

Expected artifacts:
- Executive brief.
- Architecture board summary.
- Decision memo.
- Sponsor update.
- Follow-up email draft.
- Interview/onboarding positioning narrative.

Quality bar:
- Lead with the implication and the ask.
- Keep technical depth available but not dominant.
- State what happens if no decision is made.

---

## Workplace-specific activation matrix

### ABN AMRO default skill stack

1. Engagement scope and onboarding capture.
2. Current-state security/infrastructure architecture review.
3. IAM / Zero Trust / privileged access design.
4. Network segmentation and secure connectivity.
5. Compliance-to-control translation.
6. Target-state HLD / architecture blueprint.
7. ADR and governance.
8. Risk-based roadmap/backlog.
9. Executive/CISO communication.

Near-term expected outputs:
- ABN onboarding/access/stakeholder checklist.
- ABN first-deliverable brief.
- ABN current-state security architecture review.
- ABN target-state security HLD.
- ABN security risk/control backlog.

### Coca-Cola default skill stack

1. Engagement scope and onboarding capture.
2. Current-state security/infrastructure architecture review.
3. Cloud landing zone and platform guardrails.
4. Network segmentation and secure connectivity.
5. IAM / Zero Trust / privileged access design.
6. Target-state HLD / architecture blueprint.
7. Risk-based roadmap/backlog.
8. ADR and governance.
9. Executive/platform leadership communication.

Near-term expected outputs:
- Coca-Cola contract/onboarding readiness checklist.
- Coca-Cola infra & security baseline review.
- Coca-Cola landing-zone/platform/security baseline gap analysis.
- Coca-Cola target-state HLD update.
- Coca-Cola platform/security roadmap and decision log.

---

## What “good” looks like

For ABN:
- Security-first, banking-grade, evidence-aware, governance-ready.
- Strong on IAM/ZTA, segmentation, DORA/DNB/NIS2, risk/control mapping, and traceable decisions.
- First deliverables should help Guy become effective during onboarding fast: scope, access, stakeholder map, current-state review plan, first HLD outline.

For Coca-Cola:
- Infrastructure-and-security-first, enterprise-operability-aware, platform-governance-ready.
- Strong on landing zones, network, identity, baselines, resilience/DR, cloud/platform guardrails, and operating model.
- First deliverables should help Guy move from contract/onboarding into a credible infra/security baseline review and target-state HLD update.

Across both:
- Keep workplaces separate.
- Do not invent architecture facts.
- Convert ambiguity into discovery questions and checklists.
- Convert findings into decisions, backlog, and executive-ready summaries.
- Prefer practical artifacts over abstract frameworks.
