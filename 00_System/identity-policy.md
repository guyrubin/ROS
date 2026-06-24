# ROS Identity Policy
Version: 1.2
Last updated: 2026-06-22

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
| support@jgrubin.com | Guy — **second primary comms mailbox** (Google Workspace, `jgrubin.com`) | Workspace mailbox (Guy-managed); not yet Himalaya/MCP-wired ⏳ | CoS, PAI/Arbor, MKT — branded (non-gmail) outbound comms |
| support@arborparentingapp.com | **Arbor (product company #1)** — support · user replies · press · waitlist; **send-as alias of support@jgrubin.com** via the `arborparentingapp.com` domain alias | Workspace alias (domain-alias set up by Guy 2026-06-22); not yet Himalaya/MCP-wired ⏳ | PAI/Arbor + arbor-marketing |

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

### support@arborparentingapp.com (Arbor support/comms — the company's public mailbox)

The Arbor product company's communication address. Backed by **support@jgrubin.com** (a Google Workspace mailbox on the `jgrubin.com` domain); `arborparentingapp.com` is a **domain alias** of `jgrubin.com`, so mail to `support@arborparentingapp.com` lands in `support@jgrubin.com`, and that mailbox can **send-as** the Arbor address. Use when:
- replying to Arbor user support / inbound from the app, the landing page, or the App/Play stores
- press / partner / waitlist communication for Arbor
- any email where the sender should be **"Arbor"** / **"Arbor Support"**, not "Guy Rubin"

**Scope = the Arbor company only.** Never use it for personal, HV, or EA mail (and never use a personal/HV/EA account for Arbor support). Draft-first + Level-3-confirm-to-send applies exactly as for every account. Deliverability: **SET UP 2026-06-22.** MX → `smtp.google.com`, SPF, DMARC (`p=none`) published via GoDaddy API (verified live). **Send-as added** in `support@jgrubin.com` Gmail (Guy, 2026-06-22) → the alias sends + receives. **DKIM = N/A for the alias** (a Workspace domain *alias* can't hold its own DKIM key; alias mail is signed by the Workspace *primary* domain — verified: no `google._domainkey.arborparentingapp.com` record, by design). Keep DMARC at `p=none` (alias From won't strictly align with the primary's signing domain — tightening would spam-filter legit mail). Optional future hardening: DKIM on the Workspace **primary** domain (separate domain/DNS).

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

Live account/connector status lives in `/00_System/connectors.md`. This file owns identity *routing*, not connector state.
