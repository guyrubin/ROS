<!--
TEMPLATE: a scheduled loop spec. Fill, add a row to SCHEDULED-LOOPS.md, then ask Guy
before creating it on any runtime. Default posture = read-and-report.
-->
# Scheduled Loop: [name]

- **Owner mesh:** [domain]
- **Runtime:** [Hermes cron | scheduled-tasks MCP | /schedule]
- **Cadence:** [e.g. weekdays 08:30 Europe/Amsterdam]
- **Posture:** [read-only (default) | acts — and exactly what action, with the grant]
- **Trigger ID:** [filled once created]
- **Delivery:** [Guy | Telegram | Notion | email-draft]

## What it does (each fire)
1. SENSE: [sources it reads]
2. PRODUCE: [the digest/artifact it builds]
3. DELIVER: [where it posts; read-only unless granted]

## Scope & noise filters
[What to include; what to suppress.]

## Guardrails
- Read-only unless the row in SCHEDULED-LOOPS.md grants an action.
- Never sends external mail or writes ROS state unless explicitly granted.
- Respects identity-policy account scoping.

## Go-live checklist
- [ ] Specced here + row added to SCHEDULED-LOOPS.md
- [ ] Guy confirmed
- [ ] Created on runtime; Trigger ID recorded
