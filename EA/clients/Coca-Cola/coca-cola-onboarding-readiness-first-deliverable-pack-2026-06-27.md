# Coca-Cola — Contract/Onboarding Readiness + First-Deliverable Pack

Date: 2026-06-27
Workplace: Coca-Cola
Engagement: Employment — Infrastructure & Security Enterprise Architect
Owner: Guy EA support
Status: Draft-first internal operating artifact; not sent externally
Source context: `EA/clients/Coca-Cola/CONTEXT.md`

---

## 1. Executive mandate brief

### Working mandate

Coca-Cola is an active employment workplace in contract-finalization stage for an Infrastructure & Security Enterprise Architecture role. The highest-value first operating stance is **contract/onboarding readiness plus infrastructure/security baseline preparation**: separate HR/contract gates from architecture readiness, then convert early access into a verified platform/security fact base.

### First-value hypothesis

Recommended first deliverable:

> **Infrastructure & Security Onboarding Readiness + Baseline Review Plan** — contract/onboarding checklist, stakeholder/forum map, source-pack request, and first baseline outline focused on cloud/platform guardrails, network/connectivity, identity, resilience, operability, and security baselines.

This is preferable to a target-state HLD until the employment contract, reporting line, programme scope, and platform/security source repositories are confirmed.

### What must be confirmed before architecture design

- Employment contract terms, role/title, reporting line, compensation, entity/region, start date.
- HR/IT onboarding steps: screening, device, identity, mandatory training, remote/hybrid cadence.
- Hiring manager / reporting line and architecture/platform/security decision owners.
- Whether the first architecture scope is cloud/platform, network, identity/security baselines, resilience/DR, or another programme.
- Architecture/CCoE/platform board, CAB/change governance, security governance, and decision-log location.
- Source repositories for platform, cloud, network, security baselines, resilience, backlog, and control evidence.

---

## 2. Contract/onboarding readiness checklist

| Category | Item | Why it matters | Owner | Status | Evidence/link | Blocker or next action |
|---|---|---|---|---|---|---|
| Contract/admin | Employment contract, entity/region, compensation, role/title, start date | Establishes authority, reporting line, and timing | Guy + Coca-Cola HR | Open | Coca-Cola context D-CC-1 | Review and capture on receipt |
| HR/compliance | Background checks, NDA, policy acknowledgements, mandatory training | Gates enterprise access | Coca-Cola HR/onboarding | Open | D-CC-2 | Request actual onboarding checklist after contract |
| Identity/account | Coca-Cola account, MFA, email/Teams/Slack if used | Enables meetings and access | Coca-Cola IT/onboarding | Open | — | Confirm provisioning path |
| Device/network | Laptop/device, VPN/VDI/ZTNA, remote access rules | Enables secure work and repository access | Coca-Cola IT/onboarding | Open | — | Confirm device and access model |
| Reporting cadence | Hiring manager/reporting line, team ceremonies, first-week meetings | Sets priorities and sponsor path | Hiring manager | Open | — | Book first-week alignment |
| Architecture repositories | Confluence/SharePoint/Git/architecture repository | Source of current-state and decisions | Architecture/platform owner | Open | — | Request read access or exported pack |
| Backlog/work management | ServiceNow/Jira/Azure DevOps boards and filters | Reveals active initiatives and constraints | Platform/delivery leads | Open | — | Identify system of record |
| Cloud/platform | Cloud provider(s), account/subscription structure, landing-zone docs, CCoE operating model | Core infra/security EA domain | CCoE/platform lead | Open | — | Request platform overview |
| Network/connectivity | Topology, SD-WAN/hub-spoke/private connectivity, segmentation standards | Core infrastructure risk and operability domain | Network lead | Open | — | Request high-level topology and standards |
| Identity/security baseline | Enterprise IdP, privileged access, security baseline standards | Core security foundation | Security architecture/IAM owner | Open | — | Request baseline and control evidence |
| Resilience/operations | DR/BCP, monitoring/observability, incident model, backup posture | Enterprise operability and risk | Operations/resilience owners | Open | — | Request overview and evidence sources |
| Governance forums | CCoE/platform board, architecture board, CAB, security/risk forum | Converts findings into decisions | Hiring manager + forum chairs | Open | — | Map forum, cadence, chair, decision log |

---

## 3. Stakeholder and forum map template

| Role / forum | Name | Email / handle | Decision authority | Needed for | Status | Next action |
|---|---|---|---|---|---|---|
| HR / contracting contact | Unknown | Unknown | Employment contract and onboarding gates | D-CC-1 / D-CC-2 | Open | Capture from contract thread |
| Hiring manager / reporting line | Unknown | Unknown | Role scope, priorities, success criteria | Mandate and first deliverable | Open | Confirm on contract/onboarding |
| CCoE / platform engineering lead | Unknown | Unknown | Platform guardrails and operating model | Landing-zone/platform baseline | Open | Identify after onboarding |
| Security architecture / CISO line | Unknown | Unknown | Security baselines and risk acceptance | Security baseline and decisions | Open | Ask hiring manager |
| Network/connectivity owner | Unknown | Unknown | Network topology and segmentation | Network baseline | Open | Request owner after scope confirmed |
| Identity/IAM owner | Unknown | Unknown | Enterprise identity and privileged access | IAM/security baseline | Open | Request owner after access lands |
| Resilience/operations owner | Unknown | Unknown | DR, monitoring, operations | Resilience/operability baseline | Open | Ask platform/security leads |
| Architecture / CCoE board | Unknown | Unknown | Architecture sign-off | HLD/ADR/guardrail decisions | Open | Identify forum and cadence |
| CAB/change governance | Unknown | Unknown | Implementation/change approvals | Roadmap constraints | Open | Identify decision path |

---

## 4. Minimum source-pack request

### Draft request text

Subject: Coca-Cola Infrastructure & Security EA — onboarding source pack and first-week setup

Hi [Hiring Manager/Onboarding Contact],

To make the first week productive, could you help me identify the right owners and point me to the minimum source pack for the Infrastructure & Security Enterprise Architecture scope?

My aim is to start with a concise infrastructure/security baseline: confirmed scope, current-state evidence, key risks/decisions, governance forums, and a practical 0-30 / 30-90 roadmap. I will keep assumptions separate from confirmed Coca-Cola facts.

Could you please point me to, or arrange access for, the following where available:

1. Role mandate, programme scope, success criteria, reporting line, and immediate priorities.
2. Cloud/platform overview: providers, account/subscription structure, landing-zone/guardrail docs, IaC/policy tooling, CCoE/platform operating model.
3. Network/connectivity overview: high-level topology, segmentation standards, private connectivity, remote-access patterns.
4. Identity/security baseline overview: enterprise IdP, privileged access, federation, baseline standards, security-control evidence.
5. Resilience/operations overview: monitoring/observability, DR/BCP, backup posture, incident model, operational handover.
6. Current platform/security backlog, open initiatives, technical-debt items, and relevant ServiceNow/Jira/Azure DevOps/Confluence/SharePoint locations.
7. Governance forums: CCoE/platform board, architecture board, CAB, security/risk forum, and decision-log location.

It would also help to confirm the hiring manager/reporting line, CCoE/platform lead, security architecture or CISO-line contact, network owner, IAM owner, resilience/operations owner, and architecture/forum chairs.

Thanks,
Guy

### Use rules

- Do not send without explicit confirmation.
- Use `bguy.rubin@gmail.com` only after Guy confirms recipient and send path.
- If recipient identity is unknown, keep this as a file draft.

---

## 5. First-deliverable recommendation

### Recommended artifact

**Infrastructure & Security Baseline Review + 0-30 / 30-90 Roadmap**

### Why this artifact first

- It fits the known role lens: Infrastructure & Security Enterprise Architecture.
- It gives the hiring manager a practical early output without assuming Coca-Cola estate details.
- It creates a fact base for cloud/platform guardrails, network, identity/security baselines, resilience, and operability.
- It can branch into landing-zone/platform guardrail gap analysis, target-state HLD update, ADRs, or platform/security roadmap once scope is confirmed.

### Skeleton

1. **Scope and assumptions** — confirmed role, reporting line, programme, decision forums, explicit unknowns.
2. **Current-state fact base** — cloud/platform, network/connectivity, identity/security baseline, resilience/operations, governance.
3. **Platform/security findings heatmap** — quick wins, structural risks, decision-required risks.
4. **Guardrail/control/evidence map** — standard, owner, evidence source, gap, decision path.
5. **Decision path** — CCoE/platform board, architecture board, CAB, security/risk forums, ADR candidates.
6. **0-30 / 30-90 roadmap** — baseline completion, decisions, backlog shaping, HLD update path.
7. **Hiring-manager/platform leadership brief** — implication, decisions needed, consequence of no decision.

### Initial acceptance criteria

- Coca-Cola-only context; no cross-workplace references.
- Facts vs assumptions labelled.
- No global/regional/platform detail assumed until confirmed.
- Every open item has an owner or discovery action.
- Roadmap ties to decision forums, evidence sources, and operational constraints.

---

## 6. Immediate next actions

1. **Guy** — review contract on receipt and capture entity/region, compensation, role/title, reporting line, and start date.
2. **Guy + HR/onboarding** — obtain onboarding, identity/device/access, and mandatory-training checklist.
3. **Hiring manager** — confirm first deliverable and success criteria.
4. **Hiring manager/forum owners** — identify CCoE/platform board, architecture board, CAB, security/risk forums, and decision log.
5. **Guy** — use the source-pack request draft once recipient and send path are confirmed.
