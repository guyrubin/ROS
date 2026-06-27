# Boortmalt — Onboarding + First-Deliverable Pack

Date: 2026-06-27
Workplace: Boortmalt
Engagement: Freelance via ATCON Global — Information Security Architect
Owner: Joseph/Guy EA support
Status: Draft-first internal operating artifact; not sent externally
Source context: `EA/clients/Boortmalt/CONTEXT.md` and `EA/clients/Boortmalt/ea-multi-agent-security-system-plan.md`

---

## 1. Executive mandate brief

### Working mandate

Boortmalt has accepted Joseph/Guy for an Information Security Architect engagement. The highest-value first operating stance is **CISO/CCoE security architecture support**: convert a currently undisclosed estate into a clear baseline, decision path, and risk-ranked roadmap without assuming facts before access lands.

### First-value hypothesis

Recommended first deliverable:

> **CISO/CCoE Security Architecture Baseline** — current-state fact base, top security/platform risks, decision forums, evidence sources, and a 0-30 / 30-90 roadmap.

This is better than jumping directly to target design because the estate, stakeholders, tools, decision forums, and control framework are not yet disclosed.

### What must be confirmed before architecture design

- Contract/start/work-authorization route and whether any professional-card or lawful-work gate affects start.
- Boortmalt sponsor / hiring manager and CISO or security leadership line.
- Whether CCoE/cloud guardrails are truly in scope.
- Whether OT/plant network segmentation is in scope.
- Architecture / CAB / risk / audit forums and where decisions are recorded.
- Systems of record for risk, controls, architecture docs, cloud/platform, identity, logging, and backlog.

### Recommended opening position

Use the first 72 hours to collect the minimum evidence needed for a defensible baseline:

1. Separate legal/admin blockers from architecture blockers.
2. Identify decision owners and forums.
3. Request the source pack.
4. Confirm the first deliverable and success criteria.
5. Start a risk/control/evidence backlog from facts only.

---

## 2. First 72-hour onboarding/access checklist

| Category | Item | Why it matters | Owner | Status | Evidence/link | Blocker or next action |
|---|---|---|---|---|---|---|
| Contract/admin | Signed ATCON/Boortmalt contract or final terms | Determines lawful start, scope, rate, dates, and authority | Joseph/Guy + ATCON | Open | `KK/2026-06-24_boortmalt-atcon-offer.md` | Confirm final signed route and start conditions |
| Contract/admin | Work authorization / professional-card impact | Prevents architecture work from masking legal start risk | Joseph/Guy + ATCON/legal advisor | Open | EA context D-BOOR-1 | Confirm whether any gate affects 2026-07-01 start |
| Contract/admin | Confirmed start date and expected weekly cadence | Shapes first-week plan and stakeholder booking | ATCON + Boortmalt sponsor | Open | Offer context | Confirm date, hours, location/remote pattern |
| Identity/account access | Boortmalt account, MFA, email/Teams | Enables meetings and evidence collection | Boortmalt IT/onboarding | Open | — | Request onboarding checklist |
| Device/VPN/network | Device, VPN, network access, remote access rules | Required for repositories, meetings, and secure channels | Boortmalt IT/onboarding | Open | — | Confirm device model and access prerequisites |
| Repositories/docs | Architecture repository / Confluence / SharePoint | Source of current-state docs and decisions | Boortmalt sponsor + architecture forum owner | Open | — | Request read access or exported source pack |
| Backlog/work management | Jira/ServiceNow/backlog board | Shows active initiatives, incidents, changes, and risk work | Sponsor + delivery/platform leads | Open | — | Identify system of record and board/filter names |
| Risk/compliance | Risk register, audit findings, policy/control set | Anchors baseline in evidence, not opinions | CISO/security governance | Open | — | Ask CISO line for current register/policy pack |
| Cloud/platform | Cloud account/subscription map and landing-zone docs | Required if CCoE guardrails are in scope | CCoE/platform lead | Open | — | Confirm provider(s), account model, IaC/policy tooling |
| IAM/PAM | IdP, MFA/conditional access, PAM/PIM, access review docs | High-value control surface for CISO support | IAM/security lead | Open | — | Request model and evidence process |
| Network/OT | Network topology, remote/vendor access, plant/OT scope | Segmentation and ransomware containment depend on real flows | Network + OT/ops lead | Open | — | Confirm whether OT/plant is in scope before asking for plant detail |
| SecOps/resilience | SIEM/SOC, vulnerability, incident, backup/DR/ransomware docs | Separates paper controls from tested capability | SecOps/resilience owners | Open | — | Request overview, not raw sensitive logs |
| Governance forums | CISO cadence, CCoE/platform board, architecture board, CAB, risk/audit forum | Tells EA where recommendations become decisions | Sponsor + forum owners | Open | — | Map forum, cadence, chair, decision log location |
| Stakeholders | Sponsor/hiring manager, CISO line, CCoE lead, IT ops, OT/ops, architecture board chair | Prevents design without decision owners | Joseph/Guy + sponsor | Open | EA context stakeholder table | Populate stakeholder map below |

---

## 3. Stakeholder and forum map template

| Role / forum | Name | Email / handle | Decision authority | Needed for | Status | Next action |
|---|---|---|---|---|---|---|
| ATCON admin contact | Ankit Tanna | Unknown | Engagement/admin coordination | Contract/start route | Confirmed role, contact details pending | Capture contact details from offer/admin thread |
| Boortmalt sponsor / hiring manager | Unknown | Unknown | Role scope, first deliverable, priorities | Mandate and success criteria | Open | Identify in onboarding call |
| CISO / security leadership line | Unknown | Unknown | Security priorities, risk acceptance, control ownership | CISO operating model and baseline | Open | Ask sponsor who owns security architecture decisions |
| CCoE / platform lead | Unknown | Unknown | Cloud/platform guardrails and service catalog | CCoE baseline if in scope | Open | Confirm if CCoE is in engagement scope |
| IAM / PAM owner | Unknown | Unknown | Identity, privileged access, evidence | IAM/ZTA/PAM assessment | Open | Request owner after access lands |
| Network / connectivity owner | Unknown | Unknown | Network zones, remote access, third-party connectivity | Segmentation baseline | Open | Request owner after scope confirmed |
| OT / plant operations lead | Unknown | Unknown | Plant/OT constraints and production safety | OT segmentation only if in scope | Open | Treat as hypothesis until sponsor confirms |
| SecOps / SOC owner | Unknown | Unknown | Logging, detection, incident, vulnerability evidence | SecOps/evidence baseline | Open | Request overview owner |
| Risk/compliance/audit owner | Unknown | Unknown | Policy/control mapping and evidence | Control matrix and risk backlog | Open | Ask where policy/control evidence lives |
| Architecture board / design authority | Unknown | Unknown | Architecture approvals / ADRs | Decision path and target-state sign-off | Open | Identify forum, cadence, chair, decision log |
| CAB / change governance | Unknown | Unknown | Implementation/change approval | Roadmap execution constraints | Open | Identify change gate and freeze windows |

---

## 4. Minimum source-pack request

### Draft request text

Subject: Boortmalt Information Security Architecture — first-week source pack and stakeholder setup

Hi [Sponsor/Onboarding Contact],

To make the first week productive, could you help me identify the right owners and share the minimum source pack for the Information Security Architecture scope?

My aim is to produce a short CISO/CCoE security architecture baseline: current-state facts, top risks/decisions, evidence sources, and a practical 0-30 / 30-90 roadmap. I will keep assumptions separate from confirmed facts.

Could you please point me to, or arrange access for, the following where available:

1. Security strategy, policy set, current risk register, audit findings, and known exceptions.
2. Cloud/platform overview: providers, account/subscription model, landing-zone/guardrail docs, IaC/policy tooling, CCoE/platform operating model.
3. IAM/PAM overview: IdP/SSO/MFA, privileged access model, joiner/mover/leaver, access review evidence.
4. Network overview: high-level topology, remote/vendor access, third-party connectivity, segmentation standards.
5. OT/plant scope, if this is part of the role: zone model, remote access, critical flows, monitoring constraints.
6. SecOps/resilience overview: SIEM/SOC/logging coverage, vulnerability process, incident response, backup/DR/ransomware recovery posture.
7. Current architecture/security backlog, open initiatives, and relevant ServiceNow/Jira/Confluence/SharePoint locations.
8. Governance forums: CISO cadence, CCoE/platform board, architecture board/design authority, CAB, risk/audit meetings, and where decisions are recorded.

It would also help to confirm the sponsor/hiring manager, CISO or security leadership line, CCoE/platform lead, IT operations lead, network/OT counterpart if relevant, risk/compliance owner, and architecture forum owner.

Thanks,
[Joseph/Guy]

### Use rules

- Do not send without explicit confirmation.
- If sent from Joseph's identity, use `josephdoronrubin@gmail.com` only after Guy confirms Joseph is the sender.
- If sponsor identity is unknown, keep this as a file draft until the onboarding contact is known.

---

## 5. First-deliverable recommendation

### Recommended artifact

**CISO/CCoE Security Architecture Baseline + 0-30 / 30-90 Roadmap**

### Why this artifact first

- It fits the known mandate: Information Security Architect with likely CISO/CCoE support.
- It is useful before full target design because it produces a fact base, risk view, and decision path.
- It avoids over-claiming Boortmalt estate details before access.
- It can branch into IAM/ZTA, CCoE guardrails, network/OT segmentation, controls/evidence, SecOps, or resilience once facts identify the highest-risk lane.

### Skeleton

1. **Scope and assumptions**
   - Confirmed role, sponsor, dates, decision forums, systems in scope.
   - Explicit unknowns.
2. **Current-state fact base**
   - Identity/access, cloud/platform, network/OT, controls/evidence, SecOps/resilience, governance.
3. **Findings heatmap**
   - Quick wins, structural risks, decision-required risks.
4. **Requirement/control/evidence matrix**
   - Control/policy/regulatory source, evidence owner, evidence freshness, gap.
5. **Decision path**
   - CISO/CCoE/architecture/CAB/risk forums and ADR candidates.
6. **0-30 / 30-90 roadmap**
   - Immediate blockers, baseline completion, target-state decisions, backlog execution.
7. **Sponsor/CISO brief**
   - One-paragraph implication, top risks, decisions needed, consequence of no decision.

### Initial acceptance criteria

- Boortmalt-only context; no cross-client references.
- Facts vs assumptions labelled.
- Every open item has an owner or discovery action.
- No OT/plant or cloud details assumed until confirmed.
- Roadmap ties to decision forums and evidence sources.

---

## 6. Immediate next actions

1. **Joseph/Guy** — confirm the contract/start/work-authorization route with ATCON before treating 2026-07-01 as operationally safe.
2. **Joseph/Guy + onboarding contact** — identify sponsor/hiring manager and CISO/security leadership line.
3. **Sponsor** — confirm whether CCoE/cloud guardrails and OT/plant segmentation are in scope.
4. **Sponsor / forum owners** — identify architecture board, CAB, risk/audit forums, and decision log location.
5. **Joseph/Guy** — use the source-pack request draft once the recipient and sending identity are confirmed.
