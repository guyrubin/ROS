# Career Job-Search Mesh

**Version:** 0.2 — matured to an autonomous capability
**Created:** 2026-06-21
**Owner:** KK-owned sub-mesh (Career) · lead `career-orchestrator` reports to `kk-ops` (KK lead) → ros-conductor (CoS)
**Loop type:** **autonomous, scheduled-first.** The orchestrator runs the full sense→score→decide→draft→notify→track→follow-up→learn loop on its own; the human approves only what leaves the outbox and offer decisions. See the operating contract in **`career-orchestrator-runbook.md`**.
**Streams:** Guy 🟢 LIVE · Joseph 🔴 gated (pending verified source — `profile-source/joseph-profile-facts.md`).
**Runs:** `/AGENTS.md` boot → reads `/KK/MEMORY.md` → [ROS Agent Framework](../../00_System/agent-framework/FRAMEWORK.md)

## Mission
Autonomously source high-fit Cloud/Security Architect roles (Guy) and CTO/EA-advisory roles (Joseph, once unblocked) in NL/BE — fit-score against `buy-box.md`, tailor CV + cover letters from the verified fact source, draft applications and recruiter outreach, prep interviews, chase follow-ups, and keep the pipeline tracked — **autonomous up to the outbox, manual through it** (never auto-submit, never auto-upload a CV, never cross-use one person's facts).

## Roster

| ID | Role | Owns (scope/paths/topics) | Escalates to |
| :-- | :-- | :-- | :-- |
| `career-orchestrator` | Lead/orchestrator | Frames the search, dispatches/runs sourcing, holds the gate, tailors CV + cover letter from the verified fact source, drafts applications/outreach, tracks the pipeline | `kk-ops` → ros-conductor |
| `career-sourcing` | Sourcing pod (planned/optional) | LinkedIn / Google Jobs scans, buy-box fit-scoring, ranked shortlist with a fit note each — fan-out pays when screening many postings | `career-orchestrator` |

> The lead runs sourcing itself by default; spin up `career-sourcing` only when parallel fan-out across many postings genuinely pays. CV-tailoring and application drafting stay with the lead, grounded in the verified fact source.

## Gate (Definition-of-Done)
Career DoD from [UNIVERSAL-LOOP.md](../../00_System/agent-framework/UNIVERSAL-LOOP.md):
- **Fit-scored** against the specific role (must-have vs nice-to-have, gaps named).
- CV / letter **tailored from the VERIFIED Drive fact source** (folder `1LERQza-mQ2g8Hoyl1Dbi4ZzcloZIvY_m`, post-2026-06-03) — never from old local PDFs or invented facts.
- **Permit/eligibility checked** — Guy needs NL work authorization; cross-reference the work-permit application pack before recommending a submission.
- **Draft-first, NEVER auto-submit** and never auto-upload a CV (Level 3 confirm).
- Universal: safety level respected · correct account (`bguy.rubin@gmail.com`) · no confidential leakage.

## Skills this mesh loads
| Task | Skill |
| :-- | :-- |
| Role / company intel | `research` |
| Recruiter outreach, application email | `email-composer` (Gmail `bguy`, draft-first) |
| Pipeline tracking | `notion-sync` |

## Engine files (scoring + state — load on every run)
| File | Purpose |
| :-- | :-- |
| `career-orchestrator-runbook.md` | **The operating contract** — autonomy tiers, the full loop, state machine + SLAs, failure handling, per-run Definition-of-Done. Read first every run. |
| `buy-box.md` | Dual-stream profiles, must-haves, dealbreakers, 0–100 fit-scoring rubric, saved-search URLs. **Every sourced role is scored against this.** |
| `profile-source/joseph-profile-facts.md` | Joseph stream status (🔴 blocked) + what unblocks it. |
| `pipeline.md` | Live pipeline tracker (Sourced→Offer); mirror to Notion. |
| `interview-prep-playbook.md` | Reusable prep; tailor per role at dispatch. |
| `sourcing-sprint-YYYY-MM-DD.md` | Dated shortlist output of each sprint. |
| `applications/` | Dated CV-variant + cover-letter / outreach drafts (draft-first). |

## Loops it owns

| Loop | Type | Cadence | Posture | In registry |
| :-- | :-- | :-- | :-- | :-- |
| LinkedIn + Google Jobs high-yield sourcing sprint (SENSE→DRAFT→NOTIFY, both streams) | scheduled (LIVE) | Twice weekly | Read/draft; fit-scored shortlist + ready drafts | SCHEDULED-LOOPS.md `4fc75fbfad30` (Telegram DM) |
| Pipeline review + follow-up sweep (TRACK→FOLLOW-UP) | scheduled | Weekly (Mon) | Draft chasers, advance stages, surface stalls | new — wired 2026-06-21 |
| CV-tailor / draft application / interview prep | on-demand | — | acts in-workspace; external send draft-first | — |

## How to invoke
- A role / posting / interview: dispatch `career-orchestrator` (or `career-sourcing` for a scoped scan).
- Command: `/career.*` (e.g. `/career.source`, `/career.tailor`, `/career.apply`, `/career.prep`).
- Deterministic batch (screen N postings): model on `arbor-mesh.workflow.js`.

## Boundaries
- **Never auto-submit applications or auto-upload CVs** — Level 3, draft-first, confirm.
- Use **ONLY** the verified Drive fact source for external CVs; never old local PDFs unless re-verified against the folder after 2026-06-03.
- Daily inbox / recruiter-reply triage → KK morning routing (`333eaf638d76`); this mesh only acts on a specific dispatched task.
- Work-permit / legal pack content stays **factual** — no legal advice; flag eligibility, point to the pack, escalate legal questions to Guy.
