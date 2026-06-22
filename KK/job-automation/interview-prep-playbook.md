# Interview Prep Playbook — Cloud/Security Architect (NL+BE)

**Version:** 1.0 · **Created:** 2026-06-21 · **Owner:** Career mesh
**Use:** Reusable prep for any shortlisted role. On dispatch, `career-orchestrator` tailors §5 to the specific JD.

---

## 1. The three role archetypes (prep differs per track)

| Archetype | Interview centre of gravity | Guy's edge |
| :-- | :-- | :-- |
| **Consultancy CCoE/Cloud** | Client-impact stories, presales, structured frameworks | IBM CCoE for 8+ clients, €30M+ presales |
| **Cyber Advisory (Sr Mgr/Principal)** | NIS2/DORA translation, board comms, risk economics | Deloitte cyber, IDF pedigree, audit-readiness |
| **In-house architect (regulated)** | Deep architecture, operating within constraints, stakeholder mgmt | Landing zones, Zero Trust, continuous control monitoring |

---

## 2. Likely interview stages
1. **Recruiter screen** — motivation, availability, comp expectation, permit status.
2. **Hiring-manager / technical deep-dive** — architecture, trade-offs, war stories.
3. **System-design / case** — design a secure landing zone or Zero-Trust architecture live.
4. **Stakeholder / board panel** — communicate risk and value to non-technical execs.
5. **Comp / offer.**

---

## 3. STAR story bank (build from verified facts)
Prepare 6 stories, each in Situation-Task-Action-Result form. Seed material:
- **CCoE at scale:** stood up CCoE + secure landing zones across 8+ enterprise clients → provisioning weeks → hours, audit-ready. *(Result metric to quantify with Guy.)*
- **Regulatory-to-code:** translated NIS2/DORA/ISO 27001 into policy-as-code and continuous control monitoring for 10+ regulated clients.
- **Zero Trust:** identity federation, micro-segmentation, mTLS, PIM/JIT for a regulated FS/health client.
- **Presales win:** influenced €30M+ pipeline / portfolio references up to €50M+ — pick one deal, tell the arc.
- **Team leadership:** led teams up to 12 cloud engineers through a transformation.
- **Pressure/clearance:** IDF Intelligence Corps — mission-critical classified environment, HA/DR, TOP SECRET accreditation (signals trust + stakes).

> Action item with Guy: attach one hard number to each story (cost saved, time cut, % risk reduced).

---

## 4. Technical drill — be fluent, out loud
- **Landing-zone design:** hub-spoke, management groups, Azure Policy / AWS SCPs, identity (Entra ID / IAM Identity Center), connectivity (ExpressRoute/Direct Connect), guardrails vs. blockers.
- **Zero Trust:** identity-centric perimeter, micro-segmentation, continuous verification, least privilege, PIM/JIT — and how you *phase* it without breaking delivery.
- **NIS2 vs DORA:** who they bind, the resilience/incident/third-party-risk obligations, and how each maps to concrete cloud controls. (DORA = financial-entity operational resilience + ICT third-party risk; NIS2 = broader essential/important entities, governance + incident reporting.)
- **FinOps:** showback/chargeback, commitment-based discounts, anomaly detection, architecture choices that move the bill.
- **AI governance:** EU AI Act readiness, Azure OpenAI / Copilot security-governance patterns, MLOps controls.
- **Trade-off framing:** always answer "it depends on X" — name the constraint (regulation, cost, time-to-market, team maturity) then decide.

---

## 5. Per-role tailoring (fill at dispatch)
- [ ] 3 things this specific company/JD cares about most → map to a Guy story each.
- [ ] Their cloud estate (Azure-heavy? AWS? multi?) → lead with the matching cert/experience.
- [ ] Their regulatory exposure (bank→DORA, health/utility→NIS2) → pre-load the relevant mapping.
- [ ] 5 smart questions for them (signals seniority — see §7).

---

## 6. Comp & negotiation (NL/BE)
- **NL permanent floor (and permit gate):** €5,942 gross/month fixed = IND HSM 30+ threshold. Below this, the permit route fails — treat as a hard ask, not a preference. Holiday allowance does **not** count toward the IND criterion.
- **NL senior architect market:** €6–10k gross/month is the open senior band — anchor in the upper half given 20+ yrs + cert stack.
- **BE:** security-architect avg ~€5.2k/month; seniors above — anchor on principal-level scope.
- **Contract NL:** solution-architect reference ~€100/hr; push to €110–135/hr for security+CCoE depth.
- **Tactic:** let them name a band first; anchor to scope and regulated-sector scarcity; bundle (base + bonus + training/cert budget + hybrid days).

---

## 7. Smart questions to ask them
- How mature is your CCoE / cloud operating model today, and where does this role take it?
- How are NIS2/DORA obligations currently owned — security, architecture, or risk?
- What does "good" look like for this role in 12 months?
- How much of the role is hands-on architecture vs. advisory/stakeholder vs. delivery?
- (Perm NL) Are you an IND-recognised sponsor, and how do you handle the HSM process?

---

## 8. Logistics
- Confirm language of interview (English — confirm it's not a Dutch/French screen).
- Permit talking point ready: HSM route via recognised sponsor; documents prepared (passport, CV, contract) per the work-permit pack.
- Have both CV variants (cloud + security) open during the call to mirror their framing.
