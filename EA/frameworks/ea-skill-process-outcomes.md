# EA Skill Process Outcomes

Last updated: 2026-06-04
Owner: EA

Purpose: define the repeatable processes and expected outputs the EA domain should use for Guy's current workplace/consulting work across cybersecurity, architecture, enterprise architecture, infrastructure, and security.

This is a reusable framework. Client/workplace-specific facts still belong under `EA/clients/[client]/` and must not be mixed across workplaces.

---

## How to use this framework

Before producing an EA deliverable, identify the active workstream and select the matching process below. Every output should include:

1. Client/workplace context and scope boundaries.
2. Current state, target state, and transition path.
3. Decisions required, with owner and sign-off level.
4. Risks, assumptions, dependencies, and open questions.
5. Deliverable format: HLD, ADR, review, roadmap, controls matrix, operating model, backlog, or executive brief.

## Workstream map

### 1. Cybersecurity architecture

Use when the work concerns cyber risk reduction, threat modelling, controls, compliance, or security-by-design.

Process:
- Establish scope: assets, business services, threat actors, regulatory surface, and risk appetite.
- Identify critical flows: identity, data, network, workload, third-party, and operational dependencies.
- Map current controls and gaps using NIST CSF, CIS Controls, ISO 27001/27002, DORA/NIS2/GDPR where relevant.
- Model threats and abuse cases; prioritize by business impact and exploitability.
- Recommend layered controls, compensating controls, and measurable evidence.
- Convert recommendations into a risk-based backlog with owners, due dates, and decision gates.

Expected outcomes:
- Threat model or risk assessment.
- Control gap analysis and prioritized remediation backlog.
- Security architecture patterns: Zero Trust, IAM, segmentation, secure data flows, supply-chain controls.
- Compliance/evidence mapping for audits or internal assurance.
- Executive risk brief with residual risk and sign-off asks.

### 2. Security architecture / Zero Trust / IAM

Use when the work concerns identity, access, privileged access, segmentation, policy-as-code, and secure access patterns.

Process:
- Define trust boundaries and identity sources of authority.
- Map human, workload, machine, service, and third-party identities.
- Assess authentication, authorization, privileged access, federation, lifecycle, and logging.
- Separate preventive controls from detective and response controls.
- Design target-state access patterns with least privilege, JIT/JEA, RBAC/ABAC, conditional access, and break-glass.
- Define rollout sequence, migration risks, and operational ownership.

Expected outcomes:
- IAM/ZTA current-state assessment.
- Target identity and access architecture.
- Access control model and role catalog.
- Privileged access / break-glass design.
- Logging, monitoring, and evidence requirements.
- ADRs for identity provider, federation, segmentation, or access patterns.

### 3. Infrastructure and security architecture

Use when the work concerns infrastructure platforms, landing zones, networks, cloud foundations, endpoint/server/container platforms, resilience, and baseline security.

Process:
- Inventory platform scope: cloud, network, compute, container, storage, DNS, certificates, secrets, CI/CD, and observability.
- Define non-functional requirements: availability, resilience, RTO/RPO, performance, security, compliance, operability, cost.
- Review current infrastructure patterns against cloud provider and enterprise guardrails.
- Design secure landing zones, network segmentation, baseline policies, logging, backup, disaster recovery, and secrets management.
- Define deployment path: IaC, policy-as-code, GitOps/CI/CD, environment promotion, change control, and runbooks.
- Create phased implementation plan with dependencies and operational handover.

Expected outcomes:
- Infrastructure HLD and transition roadmap.
- Secure landing-zone / platform baseline.
- Network and segmentation model.
- Resilience and disaster recovery design.
- IaC / policy-as-code backlog.
- Operational runbook and support model.

### 4. Solution and system architecture

Use when the work concerns a specific application, service, integration, API, data flow, modernization, or target-state design.

Process:
- Clarify business capability, users, service boundaries, data domains, and integration points.
- Capture functional and non-functional requirements.
- Produce C4-style context/container/component views where useful.
- Compare options: build/buy, managed/self-managed, synchronous/asynchronous, monolith/modular/microservices, event-driven/API.
- Evaluate security, operability, cost, delivery complexity, and exit costs.
- Record decisions in ADRs and convert the target design into implementation milestones.

Expected outcomes:
- HLD or solution design document.
- C4 diagrams or architecture views.
- ADR set for key design choices.
- Interface/API/event/data contracts.
- NFR checklist and validation plan.
- Implementation roadmap and dependency map.

### 5. Enterprise architecture

Use when the work concerns portfolio-level direction, capability mapping, operating model, platform strategy, architecture governance, or cross-domain decisions.

Process:
- Map business capabilities, value streams, systems, stakeholders, and decision forums.
- Identify duplication, fragmentation, regulatory exposure, technical debt, and strategic constraints.
- Define architecture principles and guardrails that are specific enough to guide delivery.
- Establish governance: architecture board, design review flow, ADR lifecycle, exception handling, and escalation path.
- Build target-state roadmap by horizons: now / next / later.
- Connect architecture choices to measurable business outcomes.

Expected outcomes:
- Capability map and heatmap.
- Target-state architecture principles and guardrails.
- Portfolio roadmap and sequencing plan.
- Architecture governance operating model.
- Decision log / ADR process.
- Executive narrative for CTO/CISO/board stakeholders.

### 6. Cloud / CCoE / platform engineering

Use when the work concerns cloud adoption, cloud foundations, CCoE, governance, FinOps, developer platforms, or multi-cloud strategy.

Process:
- Assess cloud maturity across governance, identity, network, security, operations, cost, data, and developer experience.
- Define platform product boundaries and service catalog.
- Design landing zones and shared services with guardrails and self-service paths.
- Establish FinOps, tagging, budgeting, policy, and exception processes.
- Define platform operating model: roles, ceremonies, backlog, SLOs, support, and adoption metrics.
- Sequence rollout across pilots, migration waves, and enterprise adoption.

Expected outcomes:
- Cloud maturity assessment.
- CCoE/platform operating model.
- Landing-zone and shared-services blueprint.
- Guardrails/policy-as-code catalog.
- FinOps and governance model.
- Adoption roadmap and KPI set.

## Current workplace alignment

### ABN AMRO

Primary lens: Security Enterprise Architecture.

Likely process families:
- Cybersecurity architecture.
- Security architecture / Zero Trust / IAM.
- Infrastructure and security architecture where banking platform foundations or network segmentation are in scope.
- Enterprise architecture where DORA, DNB, NIS2, internal governance, or cross-domain risk decisions require portfolio-level alignment.

Expected outputs should be banking-grade: traceable decisions, compliance-aware risk framing, clear stakeholder ownership, and no mixing with Coca-Cola materials.

### Coca-Cola

Primary lens: Infrastructure & Security Enterprise Architecture.

Likely process families:
- Infrastructure and security architecture.
- Cloud / CCoE / platform engineering.
- Security architecture / IAM / baseline controls.
- Enterprise architecture where platform governance, roadmaps, or operating model decisions are needed.

Expected outputs should connect infrastructure/security decisions to enterprise operability, resilience, cost, and global/local governance, and must not reuse ABN-specific context.

## Output quality bar

Every EA output should be workplace-grade:

- Decision-oriented: state what needs to be decided and by whom.
- Evidence-aware: distinguish facts, assumptions, risks, and recommendations.
- Executable: include next actions, owners, and dependencies.
- Safe: flag confidential or cross-client-sensitive content.
- Architecturally rigorous: include trade-offs, NFRs, compliance surface, and exit costs.
- Outcome-led: connect technical architecture to business, risk, delivery, and operating outcomes.
