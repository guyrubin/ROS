# ROS Identity Policy
Version: 1.1
Last updated: 2026-05-17

---

## Purpose

This file defines which Gmail identity is used for each ROS agent, how emails are drafted and sent, and what to do when identity assignment is ambiguous. Misrouting an email to the wrong account creates real-world professional or financial risk — this policy is non-negotiable.

---

## Gmail account registry

| Account | Owner identity | Connector status | Assigned agents |
|---|---|---|---|
| bguy.rubin@gmail.com | Guy Rubin (personal/professional) | Himalaya `bguy` active / verified ✅ | CoS, KK, EA, PAI, MKT, FIN-by-context |
| bhollandvest@gmail.com | Hollandvest (real estate entity) | Himalaya `hollandvest` active / verified ✅ | HV, KK, FIN-by-context |
| josephdoronrubin@gmail.com | Joseph Rubin (EA consultant, CTO consultant) | Himalaya `joseph` active / verified ✅ | EA when Joseph is sender/primary, KK, FIN-by-context |

---

## Routing rules

### bguy.rubin@gmail.com

Use for all communications that are personal or professional-identity-based:
- EA/workplace correspondence for current active contexts: Coca-Cola and ABN
- Career, interviews, networking
- Venture and product contacts
- Marketing and content distribution
- CoS and KK personal operations (scheduling, research, admin)
- Any email where the sender should be "Guy Rubin"

### bhollandvest@gmail.com

Use exclusively for Hollandvest real estate operations:
- Sellers, agents, brokers, notaries
- Lenders, mortgage contacts
- Tenants, property managers, contractors
- Permit and municipal contacts
- Any email where the sender should be "Hollandvest" or "Guy Rubin / Hollandvest"

**Never use bhollandvest for EA, career, or personal communications.**

### josephdoronrubin@gmail.com

Joseph Rubin's account. Joseph is an EA consultant and CTO consultant — the main lead on EA engagements. Use this account when:
- Coordinating with Joseph on EA client work
- Sending Joseph copies of EA deliverables
- Any communication where Joseph is the primary contact

josephdoronrubin@gmail.com is configured in Himalaya but blocked until its Gmail App Password is populated. Use it for EA work only where Joseph is the sender or primary contact once credentials are available. Only CC Joseph on specific deliverables when explicitly instructed — never auto-CC on EA client emails. Guy sends from bguy.rubin@gmail.com; Joseph sends from josephdoronrubin@gmail.com.

---

## EA client isolation rules

For EA/workplace emails sent from `bguy.rubin@gmail.com`:
- Current active workplace contexts: Coca-Cola and ABN
- Coca-Cola: employment opportunity, employment contract in final stages
- ABN: freelance engagement, onboarding in progress
- Never mix Coca-Cola and ABN context in the same email unless Guy explicitly instructs it
- Prior EA client roster is scratched/inactive unless Guy explicitly reactivates a client
- If a new workplace/client appears in email context, create/check `EA/clients/[name]/CONTEXT.md` before responding

---

## Email drafting protocol (all agents)

1. **Always draft first** — never send without user review
2. **State the sending account** in the draft header: `From: bguy.rubin@gmail.com` or `From: bhollandvest@gmail.com`
3. **State the recipient** and confirm it matches the correct identity
4. **Flag ambiguity** — if unsure which account to use, ask before drafting

Draft format:
```
From: [account]
To: [recipient]
Subject: [subject]

[body]

---
Ready to send? Confirm or edit above.
```

5. **User must explicitly confirm** before any send action is taken
6. Safety level for send: **Level 3** (requires confirmation)

---

## Connector status

| Account | Access method | Status |
|---|---|---|
| bguy.rubin@gmail.com | Himalaya CLI account `bguy` | Active / verified ✅ |
| bhollandvest@gmail.com | Himalaya CLI account `hollandvest` | Active / verified ✅ |
| josephdoronrubin@gmail.com | Himalaya CLI account `joseph` | Active / verified ✅ |

See `00_System/connectors.md` for full connector registry and Notion status.
