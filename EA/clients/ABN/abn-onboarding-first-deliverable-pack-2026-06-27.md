# ABN — Onboarding + First-Deliverable Pack

Date: 2026-06-27
Workplace: ABN
Engagement: Freelance — Security Enterprise Architect
Owner: Guy EA support
Status: Draft-first internal operating artifact; not sent externally
Source context: `EA/clients/ABN/CONTEXT.md`

---

## 1. Executive mandate brief

### Working mandate

ABN is an active freelance Security Enterprise Architecture workplace. The highest-value first operating stance is **banking-grade security architecture onboarding**: convert an undisclosed estate into a verified fact base, stakeholder map, access checklist, and first-deliverable path before producing any target-state design.

### First-value hypothesis

Recommended first deliverable:

> **Security Architecture Onboarding + Current-State Review Plan** — confirmed scope, access prerequisites, stakeholder/forum map, source-pack request, and a first current-state review outline focused on IAM/ZTA, segmentation, security governance, and control/evidence traceability.

This is preferable to a target-state HLD until ABN grants access and confirms the programme, architecture forum, and security-policy/control framework.

### What must be confirmed before architecture design

- Contracting route, formal counterparty, role/title, rate/term, and start date.
- ABN hiring manager / engagement owner and onboarding/access contact.
- Security design authority / architecture review board chair and decision-log location.
- CISO/security leadership line or delegate.
- Access path for architecture repositories, ServiceNow/Azure DevOps/Jira/Confluence/Archi/security repositories if used.
- In-scope regulatory/control surface: ABN policy framework, DORA/DNB/NIS2/GDPR/EBA relevance, audit/evidence expectations.

---

## 2. First 72-hour onboarding/access checklist

| Category | Item | Why it matters | Owner | Status | Evidence/link | Blocker or next action |
|---|---|---|---|---|---|---|
| Contract/admin | Formal counterparty, rate, term, role/title, start date | Establishes engagement authority and constraints | Guy + intermediary/ABN | Open | ABN context D-ABN-1 | Capture from contract/onboarding thread |
| Screening/compliance | Banking screening, NDA, declarations, mandatory training | Banking access may be gated by compliance checks | ABN onboarding contact | Open | ABN context D-ABN-2 | Request actual onboarding checklist |
| Identity/account | ABN account, MFA, email/Teams, privileged-access request process | Enables evidence collection and meeting cadence | ABN IT/onboarding | Open | — | Confirm account and MFA path |
| Device/VPN/network | Device, VPN/VDI, network access, secure remote rules | Required for repositories and regulated access | ABN IT/onboarding | Open | — | Confirm device/access model |
| Architecture repositories | Confluence/Archi/SharePoint/Git or architecture repository | Source of current and target-state decisions | Architecture forum owner | Open | — | Request read access or exported pack |
| Backlog/work management | ServiceNow/Azure DevOps/Jira boards and filters | Shows active initiatives, findings, and delivery constraints | Engagement owner | Open | — | Identify system of record |
| Risk/control/evidence | Policy set, control framework, risk register, audit findings, exceptions | Anchors recommendations in ABN evidence language | Security governance/risk owner | Open | — | Request minimum control/evidence source pack |
| IAM/ZTA | IdP, PAM/PIM, access review, privileged/admin paths | Core domain for Security EA | IAM/security lead | Open | — | Identify owner and evidence sources |
| Network segmentation | Zone model, secure-access patterns, third-party connectivity | Core domain for Security EA and banking resilience | Network/security architecture lead | Open | — | Request high-level topology and standards |
| Governance forums | Security design authority, architecture board, CAB, risk forum | Converts findings into decisions | Engagement owner + forum chairs | Open | — | Map forum, cadence, chair, decision log |
| Stakeholders | Hiring manager, onboarding, CISO line, architecture board chair, IAM/network/risk owners | Prevents design without decision owners | Guy + engagement owner | Open | ABN context stakeholder roles | Populate stakeholder map below |

---

## 3. Stakeholder and forum map template

| Role / forum | Name | Email / handle | Decision authority | Needed for | Status | Next action |
|---|---|---|---|---|---|---|
| Hiring manager / engagement owner | Unknown | Unknown | Scope, priorities, first deliverable | Mandate and success criteria | Open | Identify from onboarding/contact thread |
| Onboarding/access contact | Unknown | Unknown | Access and compliance checklist | Account/device/repository access | Open | Capture first |
| Intermediary / contract contact | Unknown | Unknown | Contract/admin route | D-ABN-1 | Open | Capture counterparty and contact |
| CISO/security leadership line | Unknown | Unknown | Risk priorities and acceptance path | Security current-state review | Open | Ask engagement owner |
| Security design authority / architecture board chair | Unknown | Unknown | Architecture sign-off | ADRs/HLD/review decisions | Open | Identify forum and cadence |
| IAM/ZTA owner | Unknown | Unknown | Identity and privileged-access facts | IAM/ZTA assessment | Open | Request after access lands |
| Network/security architecture owner | Unknown | Unknown | Segmentation/connectivity facts | Segmentation review | Open | Request after scope confirmed |
| Risk/compliance/evidence owner | Unknown | Unknown | Control framework and evidence | Control matrix and risk backlog | Open | Ask where control evidence lives |
| CAB/change governance | Unknown | Unknown | Implementation/change approvals | Roadmap execution constraints | Open | Identify decision path |

---

## 4. Minimum source-pack request

### Draft request text

Subject: ABN Security Enterprise Architecture — onboarding source pack and stakeholder setup

Hi [Engagement Owner/Onboarding Contact],

To make the first week productive, could you help me identify the right owners and point me to the minimum source pack for the Security Enterprise Architecture scope?

My aim is to start with a concise current-state security architecture review plan: confirmed scope, evidence sources, decision forums, priority risks, and a practical path toward any required HLD or architecture-board decision. I will keep assumptions separate from confirmed ABN facts.

Could you please point me to, or arrange access for, the following where available:

1. Role mandate, programme scope, success criteria, and immediate priorities.
2. Security architecture policies, standards, current exceptions, and control/evidence framework.
3. Risk register, audit findings, DORA/DNB/NIS2/GDPR/EBA applicability guidance where relevant.
4. IAM/ZTA overview: IdP, MFA/conditional access, PAM/PIM, joiner/mover/leaver, access review evidence.
5. Network/security overview: zoning/segmentation standards, third-party connectivity, secure access patterns.
6. Security operations overview: logging/SIEM/SOC, vulnerability process, incident response, resilience evidence where relevant.
7. Current architecture/security backlog, open initiatives, and relevant ServiceNow/Azure DevOps/Jira/Confluence/Archi locations.
8. Governance forums: security design authority, architecture review board, CAB, risk/audit forums, and decision-log location.

It would also help to confirm the hiring manager/engagement owner, onboarding/access contact, CISO/security leadership line, architecture-board chair, IAM owner, network/security owner, and risk/compliance owner.

Thanks,
Guy

### Use rules

- Do not send without explicit confirmation.
- Use `bguy.rubin@gmail.com` only after Guy confirms recipient and send path.
- If recipient identity is unknown, keep this as a file draft.

---

## 5. First-deliverable recommendation

### Recommended artifact

**Security Architecture Onboarding + Current-State Review Plan**

### Why this artifact first

- It fits the known mandate: Security Enterprise Architect in a banking context.
- It creates a reliable fact base before any target-state HLD.
- It makes decision forums and control/evidence language visible early.
- It can branch into IAM/ZTA, segmentation, control/evidence mapping, security governance, or target-state HLD once ABN facts identify the highest-risk lane.

### Skeleton

1. **Scope and assumptions** — confirmed role, sponsor, programme, decision forums, explicit unknowns.
2. **Current-state fact base** — IAM/ZTA, segmentation, controls/evidence, SecOps/resilience, governance.
3. **Regulatory/control frame** — ABN policy/control set and DORA/DNB/NIS2/GDPR/EBA relevance where confirmed.
4. **Findings heatmap** — quick wins, structural risks, decision-required risks.
5. **Decision path** — security design authority, architecture board, CAB/risk forums, ADR candidates.
6. **0-30 / 30-90 roadmap** — baseline completion, decisions, backlog shaping.
7. **Sponsor/security leadership brief** — implication, top risks, decisions needed, consequence of no decision.

### Initial acceptance criteria

- ABN-only context; no cross-workplace references.
- Facts vs assumptions labelled.
- No banking-control claim without ABN source or explicit hypothesis label.
- Every open item has an owner or discovery action.
- Roadmap ties to decision forums and evidence sources.

---

## 6. Immediate next actions

1. **Guy** — capture formal counterparty, start date, role/title, rate/term, and intermediary/contact details when available.
2. **Guy + onboarding contact** — obtain screening/access checklist and identity/device/repository path.
3. **Engagement owner** — confirm first deliverable and success criteria.
4. **Engagement owner/forum owners** — identify security design authority, architecture board, CAB, risk/audit forums, and decision log.
5. **Guy** — use the source-pack request draft once recipient and send path are confirmed.
