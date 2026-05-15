# Notion Second Brain for Rubin OS
Last updated: 2026-05-14
Owner: CoS
Status: Build pack ready — Notion deployment blocked until NOTION_API_KEY + parent page are available

---

## Executive intent

Build one Notion operating layer for Rubin OS that acts as:

1. **Personal assistant cockpit** — today, inbox, follow-ups, waiting-for, calendar decisions.
2. **Workspace dashboards** — one dashboard per ROS domain: CoS, KK, HV, EA, PAI, MKT, FIN.
3. **Relational second brain** — tasks, projects, people, notes, decisions, assets, emails, meetings, documents, and knowledge are connected.
4. **ROS control surface** — Notion is the human dashboard; `/home/guyru/ROS` remains the agent-maintained Markdown source of durable knowledge.

Use the existing HV Notion environment as design inspiration: domain dashboard first, practical database views, deal/project pipeline, actionable next steps, and lightweight status controls.

---

## Design principles

- **One source of action truth:** tasks live in Notion; durable reasoning and compiled knowledge live in ROS Markdown.
- **Every item has a domain:** CoS, KK, HV, EA, PAI, MKT, FIN.
- **Every project has next action:** no project exists without an immediate next action or blocked/waiting status.
- **Dashboards are views, not duplicated data:** shared master databases feed filtered dashboards.
- **Fast capture beats perfect tagging:** minimum viable fields first; enrichment can happen later by agent.
- **Client/workplace isolation:** EA/ABN/Coca-Cola views must never mix confidential details unless explicitly intended.
- **HV pattern:** replicate the useful HV workspace style: pipeline, status, contacts, assets, notes, documents, next actions.

---

## Top-level Notion structure

### Page: 🧠 Rubin OS — Command Center

Sections:

1. **Today cockpit**
   - Tasks due today
   - Waiting-for requiring nudge
   - Upcoming meetings
   - Open decisions due this week
   - Inbox items needing triage

2. **Domain dashboards**
   - CoS — Strategy & Review
   - KK — Personal Ops
   - HV — Real Estate / Hollandvest
   - EA — Workplaces / Architecture
   - PAI — Product & AI Ventures
   - MKT — Marketing
   - FIN — Finance & Admin

3. **Master databases**
   - Tasks
   - Projects
   - Areas / Domains
   - People & Organizations
   - Notes & Knowledge
   - Meetings
   - Decisions
   - Assets / Properties / Workplaces
   - Documents
   - Inbox / Raw Capture

4. **System control**
   - ROS sync log
   - Templates
   - Operating rules
   - Archive

---

## Master databases

### 1. Tasks

Purpose: single action registry for KK/CoS and all domains.

Core properties:
- Name — title
- Status — Inbox, Next, Scheduled, Waiting, Blocked, Done, Cancelled
- Priority — P0, P1, P2, P3
- Domain — relation to Areas
- Project — relation to Projects
- Due — date
- Owner — relation to People
- Context — Email, Call, Desk, Errand, Deep Work, Review
- Energy — Low, Medium, High
- Source — Manual, Email, Meeting, ROS, Notion, Telegram
- Waiting For — relation to People
- ROS Path — url/text
- Notes — rich text

Key views:
- Today
- Next Actions
- Waiting For
- By Domain
- Overdue
- This Week
- Done Recently

### 2. Projects

Purpose: outcomes with multiple tasks or milestones.

Properties:
- Name — title
- Status — Active, Waiting, At Risk, Blocked, Done, Archived
- Domain — relation to Areas
- Owner — relation to People
- Start — date
- Target Date — date
- Current Milestone — rich text
- Next Action — relation to Tasks
- Stakeholders — relation to People
- Related Assets — relation to Assets
- Decisions — relation to Decisions
- Health — Green, Amber, Red
- ROS Path — url/text

Initial projects:
- Coca-Cola employment contract
- ABN freelance onboarding
- HV deal sourcing — Den Haag / Rotterdam
- Parenting app / Parenting OS plugin

### 3. Areas / Domains

Purpose: stable responsibility areas matching ROS agents.

Records:
- CoS — Chief of Staff
- KK — Personal Ops
- HV — Real Estate / Hollandvest
- EA — Workplaces / Architecture
- PAI — Product & AI Ventures
- MKT — Marketing
- FIN — Finance & Admin

Properties:
- Name — title
- Agent — select
- Status — Active, Dormant, Archived
- Review Cadence — Daily, Weekly, Monthly, Quarterly
- ROS Folder — text/url
- Dashboard — relation/page reference

### 4. People & Organizations

Purpose: contacts, companies, stakeholders, vendors, recruiters, clients.

Properties:
- Name — title
- Type — Person, Company, Vendor, Client, Workplace, Family, Government
- Domain — relation to Areas
- Organization — relation to People & Organizations
- Email — email
- Phone — phone
- Role — text
- Relationship — text
- Last Contact — date
- Next Follow-up — date
- Status — Active, Waiting, Dormant, Archived
- Notes — rich text

Initial organizations:
- Coca-Cola
- ABN
- Hollandvest

### 5. Notes & Knowledge

Purpose: human-facing notes linked to ROS Markdown when compiled.

Properties:
- Name — title
- Type — Note, Summary, Research, Meeting Note, Reference, Idea, SOP
- Domain — relation to Areas
- Project — relation to Projects
- People — relation to People
- Status — Raw, Processed, Linked, Archived
- Source — Manual, Email, Web, Telegram, Meeting, ROS
- ROS Path — url/text
- Created — date
- Review Date — date

### 6. Meetings

Purpose: meetings, agendas, notes, follow-ups.

Properties:
- Name — title
- Date — date
- Domain — relation to Areas
- Project — relation to Projects
- Attendees — relation to People
- Status — Scheduled, Done, Cancelled
- Agenda — rich text
- Decisions — relation to Decisions
- Follow-up Tasks — relation to Tasks
- Notes — relation to Notes

### 7. Decisions

Purpose: CoS decision log across all domains.

Properties:
- Name — title
- Status — Proposed, Decided, Reversed, Superseded
- Domain — relation to Areas
- Project — relation to Projects
- Owner — relation to People
- Decision Date — date
- Due — date
- Options — rich text
- Decision — rich text
- Rationale — rich text
- Consequences — rich text
- ROS Path — url/text

### 8. Assets / Workplaces

Purpose: domain-specific physical/business assets and work contexts.

Properties:
- Name — title
- Type — Property, Workplace, Product, Account, System, Legal Entity
- Domain — relation to Areas
- Status — Active, Pipeline, Onboarding, Contracting, Dormant, Archived
- Owner — relation to People
- Related Projects — relation to Projects
- Related Documents — relation to Documents
- Key Dates — date
- ROS Path — url/text

Initial assets:
- Coca-Cola — Workplace — Contracting
- ABN — Workplace — Onboarding
- Hollandvest — Legal/real estate operating entity

### 9. Documents

Purpose: contracts, invoices, deliverables, PDFs, official docs.

Properties:
- Name — title
- Type — Contract, Invoice, Proposal, HLD, ADR, Insurance, Tax, ID, Other
- Status — Draft, Review, Signed, Sent, Archived
- Domain — relation to Areas
- Project — relation to Projects
- Asset — relation to Assets
- Counterparty — relation to People
- Date — date
- Due — date
- Storage Link — url
- ROS Path — url/text
- Sensitive — checkbox

### 10. Inbox / Raw Capture

Purpose: dump zone for Telegram/email/manual captures before processing.

Properties:
- Name — title
- Status — New, Triaged, Converted, Archived
- Source — Telegram, Email, Web, Meeting, Manual, File
- Domain Guess — select
- Captured At — date
- Convert To — Task, Project, Note, Decision, Contact, Document
- Related Item — relation fields as needed
- Raw Text — rich text

---

## Dashboard design

### CoS dashboard

- Status at a glance by domain
- Active projects by health
- Decisions due this week
- Blockers and risks
- Weekly review button/template
- Cross-domain dependencies

### KK dashboard

- Today view
- Inbox capture
- Waiting for
- Follow-ups due
- Email triage queue
- Calendar/admin checklist

### HV dashboard

Inspired by existing HV Notion environment:
- Deal/property pipeline
- Properties/assets view
- Tasks by asset
- Documents by property/deal
- Contacts: brokers, notaries, lenders, tenants, contractors
- Investment memo template

### EA dashboard

Current contexts only:
- Coca-Cola employment contract tracker
- ABN freelance onboarding tracker
- Workplace documents
- Stakeholders/contact log
- Architecture deliverables only when relevant

### PAI dashboard

- Product roadmap
- Parenting OS plugin tasks
- PRDs
- Research notes
- Feature backlog
- GTM/pricing experiments

### MKT dashboard

- Content calendar
- Campaigns
- Ideas inbox
- Drafts / scheduled / published
- Channels: LinkedIn, blog, newsletter

### FIN dashboard

- Invoices
- Contracts
- Insurance
- Tax/admin deadlines
- Subscriptions
- Sensitive documents

---

## Initial seed records

### Areas
- CoS, KK, HV, EA, PAI, MKT, FIN

### Projects
- Coca-Cola employment contract — EA/KK — Amber
- ABN freelance onboarding — EA/KK — Green
- HV deal sourcing — HV — Active
- Parenting app / Parenting OS plugin — PAI — Active

### Tasks
- Review Coca-Cola employment contract when received
- Complete ABN onboarding checklist
- Capture ABN start date, role, rate, contacts, and access steps
- Capture Coca-Cola role/title, start date, compensation, HR contact, and onboarding checklist

### Assets / Workplaces
- Coca-Cola — Workplace — Contracting
- ABN — Workplace — Onboarding
- Hollandvest — Real estate operating entity — Active

---

## Deployment dependency

Live Notion build requires:

1. `NOTION_API_KEY` in `/home/guyru/.hermes/.env`
2. A shared parent Notion page ID where the integration has access
3. Optional: ID/name of the existing HV Notion environment to inspect or manually mirror

Until those exist, this build pack is the source of truth and can be deployed by the script in `scripts/create_notion_second_brain.py`.
