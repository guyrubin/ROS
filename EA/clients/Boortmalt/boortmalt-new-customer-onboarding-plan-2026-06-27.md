# Boortmalt — New Customer Onboarding Plan

Date: 2026-06-27
Customer: Boortmalt
Engagement: Freelance via ATCON Global — Information Security Architect
Owner: Joseph/Guy EA support
Status: Fresh plan after correction; customer-specific; not a reusable knowledge-base artifact
Source context: `EA/clients/Boortmalt/CONTEXT.md`

---

## 0. Correction and scope guard

This plan is for **the new customer: Boortmalt only**.

It does not create onboarding artifacts for ABN, Coca-Cola, or any other active workplace. Those are separate customers/workplaces with separate confidentiality boundaries.

### Customer vs knowledge base separation

| Artifact class | Purpose | Location | Allowed content | Not allowed |
|---|---|---|---|---|
| Customer onboarding | Execute Boortmalt onboarding and first-week architecture readiness | `EA/clients/Boortmalt/` | Boortmalt facts, Boortmalt assumptions, Boortmalt stakeholder map, source-pack request, first-week schedule, decisions, risks | ABN/Coca-Cola facts; generic methodology as the main output |
| Knowledge base / framework | Reusable EA operating knowledge and templates | `EA/frameworks/`, `EA/12_Templates/`, or system docs | Generic checklist patterns, skill cards, method definitions, reusable templates with no customer facts | Boortmalt-specific facts, commercial terms, names, decisions, risks |

**Rule:** customer onboarding produces customer artifacts first. Reusable knowledge-base updates are secondary and only happen if a general pattern is extracted with customer facts removed.

---

## 1. Onboarding objective

Prepare Boortmalt onboarding so Joseph/Guy can start cleanly, legally, and credibly as Information Security Architect support for CISO/CCoE/security architecture work.

The first outcome is not a target architecture. The first outcome is a controlled onboarding path:

1. Contract/start/legal gate separated from architecture work.
2. Sponsor and decision owners identified.
3. Minimum source pack requested.
4. First-week schedule shaped around evidence collection.
5. First deliverable agreed with sponsor/CISO line.
6. Knowledge-base boundaries enforced so customer facts do not leak into reusable frameworks.

---

## 2. Workstreams

### Workstream A — Contract, start, and authorization gate

**Goal:** make sure work does not begin on an unsafe administrative/legal assumption.

| Item | Owner | Evidence needed | Current status | Next action |
|---|---|---|---|---|
| Signed ATCON/Boortmalt contract or final start route | Joseph/Guy + ATCON | Signed contract / written start confirmation | Open | Confirm final route and start conditions |
| Work authorization / professional-card impact | Joseph/Guy + ATCON/legal advisor | Written confirmation of lawful work path | Open | Confirm whether any gate affects July 1 start |
| Start date, hours, cadence, remote/on-site pattern | ATCON + Boortmalt sponsor | Written onboarding/start details | Open | Ask ATCON/onboarding contact |
| Sending identity for external comms | Guy/Joseph | Explicit instruction from Guy | Open | Do not send externally until confirmed |

### Workstream B — Sponsor and stakeholder capture

**Goal:** identify who can define success, assign access, and make/accept decisions.

| Role / forum | Why needed | Current status | First question |
|---|---|---|---|
| Boortmalt sponsor / hiring manager | Owns mandate and first deliverable | Unknown | Who owns the Information Security Architect engagement day to day? |
| CISO / security leadership line | Owns risk priorities and acceptance path | Unknown | Who owns security architecture priorities and risk acceptance? |
| CCoE / platform lead | Owns cloud/platform guardrails if in scope | Unknown | Is CCoE/cloud guardrail work in scope, and who owns it? |
| IAM/PAM owner | Owns identity and privileged-access facts | Unknown | Who owns IdP, MFA, PAM/PIM, and access review evidence? |
| Network / OT / plant counterpart | Owns segmentation and industrial constraints if relevant | Unknown | Is OT/plant segmentation in scope? If yes, who is the safe contact? |
| Risk/compliance/evidence owner | Owns policy/control/risk/audit sources | Unknown | Where are risk register, policy set, audit findings, and control evidence stored? |
| Architecture board / CAB / risk forum owners | Convert findings into decisions | Unknown | What forums approve architecture decisions, exceptions, and changes? |

### Workstream C — Source-pack request

**Goal:** avoid opinion-led architecture by collecting evidence first.

Minimum request, in priority order:

1. Role mandate, sponsor priorities, scope boundaries, success criteria.
2. Security strategy, policy set, control framework, risk register, audit findings, known exceptions.
3. Cloud/platform overview: providers, account/subscription model, landing-zone/guardrail docs, IaC/policy tooling, CCoE/platform operating model.
4. IAM/PAM overview: IdP/SSO/MFA, privileged access model, joiner/mover/leaver, access review evidence.
5. Network overview: topology, remote/vendor access, third-party connectivity, segmentation standards.
6. OT/plant scope statement if relevant: zone model, critical flows, monitoring constraints, operational safety boundaries.
7. SecOps/resilience overview: SIEM/SOC/logging coverage, vulnerability process, incident response, backup/DR/ransomware recovery posture.
8. Current initiatives/backlog and governance forums: Jira/ServiceNow/Confluence/SharePoint/architecture repository, CISO cadence, CCoE/platform board, architecture board, CAB, risk/audit meetings, decision-log location.

Use the draft request already prepared in:

- `EA/clients/Boortmalt/boortmalt-onboarding-first-deliverable-pack-2026-06-27.md`

Do not send it until recipient and sending identity are confirmed.

### Workstream D — First-week schedule

**Goal:** turn onboarding into a repeatable sequence of meetings and artifacts.

#### Day 0 / pre-start

- Confirm legal/admin start path.
- Confirm recipient and sender for source-pack request.
- Prepare meeting notes template and facts/assumptions log.
- Reconfirm no external send without approval.

#### Day 1

- Sponsor/hiring-manager intro: mandate, immediate risks, success criteria, first deliverable.
- Onboarding/access check: account, device, VPN, repositories, meeting tools.
- Send or hand over source-pack request after confirmation.

#### Day 2

- CISO/security leadership or delegate briefing.
- Identify risk/control framework, current initiatives, evidence repositories.
- Confirm governance forums and decision path.

#### Day 3

- CCoE/platform briefing if in scope.
- IAM/PAM briefing if available.
- Start current-state facts/unknowns log.

#### Days 4–5

- Network/OT/resilience/SecOps briefings as scope permits.
- Build initial findings heatmap.
- Draft sponsor/CISO readout outline.
- Confirm first deliverable: baseline, IAM/ZTA review, CCoE guardrails review, network/OT segmentation assessment, or target-state HLD path.

---

## 3. First deliverable path

### Recommended first deliverable

**Boortmalt CISO/CCoE Security Architecture Baseline + 0-30 / 30-90 Roadmap**

### Why this first

- Boortmalt estate facts are not yet disclosed.
- Security architecture work depends on sponsor, CISO line, CCoE/platform, IAM, network/OT, evidence, and governance facts.
- A baseline creates the decision path and evidence base before design.

### Deliverable sequence

1. **Onboarding/source-pack completion** — access, stakeholders, source repositories, decision forums.
2. **Current-state baseline workbook population** — use `boortmalt-ciso-ccoe-baseline-workbook-2026-06-27.md`.
3. **Risk/control/evidence backlog** — owner, severity hypothesis, evidence source, decision gate.
4. **Sponsor/CISO readout** — implication, top risks, decisions needed, consequence of no decision.
5. **Next artifact decision** — IAM/ZTA assessment, CCoE guardrail review, network/OT segmentation assessment, control/evidence matrix, or target-state HLD.

---

## 4. Operating cadence

| Cadence | Purpose | Output |
|---|---|---|
| Daily first-week checkpoint | Separate admin blockers from architecture blockers | Updated blocker list and next-day asks |
| Stakeholder discovery sessions | Convert unknown roles into named owners | Stakeholder/forum map |
| Source-pack review blocks | Convert documents into facts/evidence | Facts/assumptions log and evidence map |
| End-of-week sponsor readout | Align on first deliverable and next decisions | Sponsor/CISO brief and 0-30 / 30-90 plan |

---

## 5. Decision and risk controls

### Decisions to close first

| Decision | Options | Recommendation | Owner | Status |
|---|---|---|---|---|
| Lawful start route | Start as planned / delayed / restricted work only | Do not treat July 1 as safe until confirmed | Joseph/Guy + ATCON | Open |
| First deliverable | Baseline / targeted IAM review / CCoE guardrail review / target HLD | Baseline first | Sponsor/CISO | Open |
| CCoE/cloud scope | In scope / advisory / out of scope first month | Confirm before collecting deep cloud evidence | Sponsor + CCoE lead | Open |
| OT/plant scope | In scope / interface only / out of scope | Treat as hypothesis until confirmed | Sponsor + OT/ops lead | Open |
| Decision forum | CISO cadence / architecture board / CAB / risk forum / mixed path | Map before recommendations | Sponsor/forum owners | Open |

### Risks to manage

| Risk | Control |
|---|---|
| Architecture work hides legal/admin start risk | Keep contract/work-authorization as Workstream A and report separately |
| Customer-specific facts leak into knowledge base | Store Boortmalt facts only under `EA/clients/Boortmalt/`; extract generic templates only after anonymizing |
| New-customer onboarding gets fanned out to other workplaces | EA guardrail now states Boortmalt-only default for "new customer onboarding" |
| Target design starts before facts | Use baseline workbook before HLD |
| OT assumptions become unsafe design | Treat OT/plant scope as hypothesis until confirmed by sponsor/OT owner |

---

## 6. Files and ownership

### Customer-specific Boortmalt files

- `EA/clients/Boortmalt/CONTEXT.md`
- `EA/clients/Boortmalt/ea-multi-agent-security-system-plan.md`
- `EA/clients/Boortmalt/boortmalt-onboarding-first-deliverable-pack-2026-06-27.md`
- `EA/clients/Boortmalt/boortmalt-ciso-ccoe-baseline-workbook-2026-06-27.md`
- `EA/clients/Boortmalt/boortmalt-new-customer-onboarding-plan-2026-06-27.md` (this file)

### Knowledge-base files

- `EA/CLAUDE.md` — durable operating rule: new-customer onboarding vs knowledge-base separation.
- `EA/frameworks/ea-skill-process-outcomes.md` — reusable EA skill model only; should not accumulate Boortmalt facts beyond generic demand alignment.
- `EA/12_Templates/` — future generic onboarding templates, if needed.

---

## 7. Definition of done for Boortmalt onboarding plan

- Boortmalt is the only customer in scope.
- Contract/start/legal gate is visible and not mixed with architecture work.
- Sponsor, CISO/security line, CCoE/platform, IAM, network/OT, risk/evidence, and governance owners are captured or explicitly open.
- Source-pack request is ready but not sent without confirmation.
- First-week schedule is mapped to evidence collection and decisions.
- First deliverable is baseline-first, not target-design-first.
- Customer facts remain in `EA/clients/Boortmalt/`; reusable knowledge-base updates contain only generic patterns.
