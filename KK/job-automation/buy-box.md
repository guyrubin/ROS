# Career Buy-Box & Fit-Scoring Engine

**Version:** 1.0
**Created:** 2026-06-21
**Owner:** KK-owned Career mesh · used by `career-orchestrator` + the twice-weekly sourcing sprint (`4fc75fbfad30`)
**Purpose:** The single rubric every sourced role is scored against. Replaces ad-hoc judgement with a repeatable 0–100 fit score so sourcing is consistent, the shortlist is defensible, and low-fit noise is auto-suppressed.

---

## 0. Dual-stream (Guy + Joseph)

This engine runs **two independent streams**. §2 (buy-box), §4 (rubric), §5 (searches) and §6 (guardrails) are person-agnostic and shared. §1 (target profile) and §3 channel emphasis are per-person.

| Stream | Status | Fact source |
| :-- | :-- | :-- |
| **Guy Rubin** | 🟢 LIVE — sourced, scored, drafted | Drive `1LERQza-mQ2g8Hoyl1Dbi4ZzcloZIvY_m` (2026-06-03) |
| **Joseph Rubin** | 🔴 BLOCKED — pending verified source | none yet — see `profile-source/joseph-profile-facts.md` |

Never use Guy's facts for Joseph, or vice-versa. Joseph stays at "Sourced — pending source" until his CV/LinkedIn source and target buy-box are provided; do not fit-score or draft for him before then.

## 1. Target profile — Stream A: Guy Rubin

Guy Rubin — 20+ yrs. Two positioning tracks, pick by role emphasis:
- **Cloud/Enterprise:** `Senior Cloud & Enterprise Architect | Azure & AWS | CCoE | NIS2/DORA`
- **Security:** `Principal Cloud Security Architect | Zero Trust | NIS2/DORA/ISO 27001 | CISSP`

Anchor proof: IBM Consulting CCoE lead (8+ clients), Deloitte transformation programs, €30M+ presales, full Azure+AWS+CISSP/CCSP/TOGAF cert stack, IDF Intelligence pedigree.

## 1b. Target profile — Stream B: Joseph Rubin

🔴 **PENDING.** Joseph is an EA / CTO consultant — likely a distinct track from Guy's architect emphasis (fractional/interim CTO or EA advisory). Profile, positioning, comp floor and permit path are **not yet defined**. Populate this section only from Joseph's verified source per `profile-source/joseph-profile-facts.md`. Until then, his stream sources by keyword but is not scored or drafted.

---

## 2. The buy-box (acceptance criteria — shared rubric, per-stream profile)

### Must-haves (a role failing any one is auto-skipped unless flagged "stretch")
- **Seniority:** Senior / Principal / Lead / Manager / Director architect, or interim equivalent. No mid-level engineer roles.
- **Domain:** Cloud architecture, enterprise/solution architecture, cloud security, or CCoE/platform. Azure and/or AWS central.
- **Geography:** Netherlands (Amsterdam/Randstad) or Belgium (Brussels/Antwerp), or remote-EU anchored to NL/BE.
- **Comp floor:**
  - Permanent NL: ≥ €5,942 gross/month fixed (IND HSM 30+ threshold — non-negotiable for permit eligibility; see work-permit pack).
  - Permanent BE: ≥ €90k base equivalent.
  - Contract: ≥ €750/day NL/BE (architect benchmark; Striive reference ~€100/hr for solution architects, target the upper band).
- **Work authorization compatible:** Permanent NL roles must be at an **IND-recognised sponsor** (or via umbrella that is). Contract NL via ZZP/own-BV or umbrella. Flag every role's permit path.

### Nice-to-haves (each adds score — see §4)
- Regulated sector (financial services, healthcare, critical infra, public) — Guy's strongest references.
- NIS2 / DORA / ISO 27001 / regulatory-compliance angle.
- CCoE / landing-zone / policy-as-code / FinOps mandate.
- AI/ML platform or AI-governance (EU AI Act) scope.
- Advisory / presales / board-facing element.
- English-working environment (Guy: English fluent, Hebrew native; Dutch not required).
- Hybrid ≤3 days office, or genuinely remote.

### Dealbreakers (auto-skip, no score)
- Requires fluent **Dutch** or **French** as hard filter.
- Pure hands-on-keyboard engineer / SRE / DevOps IC with no architecture authority.
- On-site relocation outside NL/BE.
- Salary clearly below the comp floor / "competitive" with no band and a junior JD.
- Security clearance Guy cannot obtain (e.g. EU/NATO national-only clearances).
- Staffing-mill spam / duplicate reposts / "build your CV" funnels.

---

## 3. Sourcing channels (where the sprint looks)

| Channel | Type | Notes |
| :-- | :-- | :-- |
| LinkedIn Jobs (NL+BE) | Perm + contract | Primary. Use saved searches in §5. |
| Glassdoor / Indeed BE/NL | Perm | Volume aggregators, dedupe against LinkedIn. |
| **Consultancy career sites direct** | Perm | Deloitte, IBM, Accenture, EY, Capgemini, KPMG, PwC, Sopra Steria, Devoteam, Xebia, Rubicon, Intercept, Wortell. |
| **End-client career sites** | Perm | Banks/insurers/health: ING, Rabobank, ABN AMRO, ASML, Philips, KPN, Ahold, NN Group, Aegon; BE: KBC, Belfius, Proximus, Euroclear, SWIFT. |
| Striive | Contract NL | Largest ZZP architect marketplace; benchmark tool for rates. |
| it-contracts.nl | Contract NL | Aggregates ZZP/freelance/detachering opdrachten. |
| Harvey Nash / YACHT / Myler / Bureau Ad Interim | Contract NL | Broker-mediated interim. |
| Cybersecurity Jobsite / securitytalent.nl | Security perm+contract | Security-specialised boards. |

---

## 4. Fit-scoring rubric (0–100)

Score each role, then bucket. Total = weighted sum.

| Dimension | Weight | How to score |
| :-- | :-- | :-- |
| **Seniority match** | 20 | 20 = Principal/Lead/Director architect · 14 = Senior architect · 8 = Manager w/ architecture · 0 = below |
| **Domain match** | 20 | 20 = cloud security + CCoE + Azure/AWS bullseye · 14 = cloud/enterprise architect · 8 = adjacent (platform/solution) · 0 = off |
| **Comp vs floor** | 15 | 15 = clearly above floor w/ band · 9 = at/near floor · 4 = unstated but senior JD · 0 = below floor |
| **Permit/eligibility** | 15 | 15 = recognised sponsor / clean ZZP path · 8 = umbrella likely · 3 = unclear · 0 = blocked |
| **Sector fit** | 10 | 10 = regulated FS/health/critical infra/public · 6 = enterprise · 3 = SMB · 0 = irrelevant |
| **Regulatory/CCoE/AI angle** | 10 | 10 = NIS2/DORA/CCoE/AI-gov explicit · 5 = some · 0 = none |
| **Logistics (location/hybrid/language)** | 10 | 10 = Amsterdam/Brussels hybrid, English · 6 = commutable · 0 = bad fit (no auto-skip if Dutch is "plus" not "must") |

### Buckets
- **80–100 — APPLY NOW.** Tailor CV + draft cover letter same session.
- **60–79 — APPLY (tailor).** Worth a tailored application; queue this week.
- **45–59 — WATCH.** Track; apply if a referral or warmer angle appears.
- **< 45 — SKIP.** Suppressed from the shortlist (counts as noise).

Every shortlisted role gets a one-line **fit note**: top 1 reason for + top 1 gap/risk.

---

## 5. Saved-search URLs (live, re-runnable)

> The sprint opens these, scrapes the top results, dedupes, and scores. Kept here so the rubric and the queries live together.

**LinkedIn — NL permanent:**
`https://www.linkedin.com/jobs/search/?keywords=cloud%20architect%20OR%20security%20architect&location=Netherlands&f_E=4,5&f_TPR=r604800`

**LinkedIn — BE permanent:**
`https://be.linkedin.com/jobs/search/?keywords=cloud%20architect%20OR%20security%20architect&location=Belgium&f_E=4,5&f_TPR=r604800`

**Striive — IT architecture (contract NL):**
`https://striive.com/nl/zzp/opdrachten/ict/architectuur/architect`

**it-contracts.nl — Azure/Solution architect (contract):**
`https://www.it-contracts.nl/nieuwste-freelance-ict-opdrachten/search/Azure+Cloud+Architect/from/`

**Glassdoor — cloud architect Amsterdam:**
`https://www.glassdoor.com/Job/amsterdam-cloud-architect-azure-jobs-SRCH_IL.0,9_IC3064478_KO10,31.htm`

**securitytalent.nl — employers/security NL:**
`https://securitytalent.nl/`

---

## 6. Guardrails (inherited from MESH.md)
- **Draft-first, NEVER auto-submit; never auto-upload a CV.** External submission = Level 3, explicit confirm.
- CV/letter tailored **only** from the verified Drive fact source (`1LERQza-mQ2g8Hoyl1Dbi4ZzcloZIvY_m`, post-2026-06-03) — never invented facts or stale local PDFs.
- Correct account: `bguy.rubin@gmail.com`.
- Permit path checked on every NL role before recommending submission.
