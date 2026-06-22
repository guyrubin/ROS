# Career Orchestrator — Autonomous Operating Runbook

**Version:** 1.0
**Created:** 2026-06-21
**Owner:** `career-orchestrator` (KK-owned Career mesh) → `kk-ops` → ros-conductor
**Purpose:** This is the capability, not a document. It defines how the orchestrator runs the whole job search **autonomously** — what it does on its own, what it must stop and confirm, and how it recovers when something breaks. Both streams (Guy live, Joseph gated).

---

## 1. Operating principle

The orchestrator runs the full loop **end-to-end without being asked**, and only pauses at money/identity gates. Maturity = it does the thinking, scoring, drafting, tracking and chasing autonomously; Guy only makes go/no-go calls on external actions. Everything is grounded in the verified fact source and the `buy-box.md` rubric — never invented.

---

## 2. Autonomy tiers (the heart of it)

| Tier | Actions | Behaviour |
| :-- | :-- | :-- |
| **🟢 AUTO — do it, no ask** (Safety 0–2) | Source & dedupe postings · fit-score vs buy-box · build/refresh shortlist · pick CV variant (geo+emphasis) · draft cover letters & recruiter outreach · update `pipeline.md` · tailor interview prep · draft follow-up chasers · weekly digest · refine buy-box weights from outcomes | Runs silently each cycle; results land in workspace + digest. |
| **🟡 CONFIRM — draft then ask** (Safety 3) | Send any external email · submit any application · upload any CV · send recruiter outreach | Draft is ready; orchestrator presents a one-line approval list. Sends only on Guy's explicit "yes". |
| **🟠 CONFIRM W/ AMOUNTS** (Safety 4) | Accept an offer · commit to a day-rate or salary · sign anything | State the exact numbers; Guy confirms. |
| **🔴 HARD GATE — never auto** | Anything for **Joseph** beyond keyword-flagging (until his source lands) · NL permanent below €5,942 fixed · any IND permit submission · using one person's facts for the other | Stop, flag, escalate to Guy. No exceptions. |

> Rule of thumb: **autonomous up to the outbox; manual through it.** Nothing leaves to a third party, and no money/identity commitment is made, without Guy.

---

## 3. The loop (runs every cycle)

```
SENSE → SCORE → DECIDE → DRAFT → NOTIFY → [GATE] ACT → TRACK → FOLLOW-UP → LEARN
```

1. **SENSE** — pull new postings from the saved-search URLs (`buy-box.md` §5) for both streams. If a board is JS-rendered/blocked, escalate that source to the Chrome tools rather than skipping it (see §6).
2. **SCORE** — fit-score each role 0–100 vs the rubric; dedupe against `pipeline.md` (no re-surfacing).
3. **DECIDE** — bucket APPLY-NOW / APPLY / WATCH / SKIP; select CV variant; check permit path; SKIP-noise suppressed.
4. **DRAFT** — for every APPLY-NOW/APPLY: write the CV-variant recommendation + tailored cover letter / outreach into `applications/` (dated). Grounded only in the verified source.
5. **NOTIFY** — push a digest to Guy (Telegram DM / `bguy` email) with: new shortlist, fit notes, and a numbered **approval list** of ready-to-send drafts.
6. **[GATE] ACT** — on Guy's confirm, send via `email-composer` (`bguy` account, draft-first honoured) and/or attach the CV. Mark Applied.
7. **TRACK** — advance pipeline stage; set an SLA timer (see §4).
8. **FOLLOW-UP** — when an SLA expires with no reply, draft a chaser (🟢 auto-draft, 🟡 send-on-confirm). When a stage flips to Interview, auto-trigger tailored prep from `interview-prep-playbook.md`.
9. **LEARN** — log outcomes (reply rate, screen rate per archetype); nudge buy-box weights; refresh Guy's application voice from what actually got sent.

---

## 4. Pipeline state machine + SLAs

`Sourced → Tailored → Applied → Screen → Interview → Offer → Closed`

| Transition | Trigger | Orchestrator SLA / action |
| :-- | :-- | :-- |
| Sourced → Tailored | Fit ≥ 60 | Auto-draft within same cycle |
| Tailored → Applied | Guy confirms send (🟡) | Send, timestamp, start reply clock |
| Applied → (no reply) | +7 days | Auto-draft follow-up chaser |
| Screen → Interview | Interview booked | Auto-trigger tailored prep pack |
| Interview → Offer | Offer received | Surface comp vs floor (🟠), prep negotiation |
| any → Closed | Reject / withdraw / accept | Log outcome, feed LEARN |

---

## 5. Dual-stream handling

- **Stream A — Guy:** 🟢 fully autonomous through the gate. Live now.
- **Stream B — Joseph:** 🔴 keyword-flag only. The loop SENSE-stage tags CTO/EA-advisory roles into a Joseph holding list, but **SCORE/DRAFT/ACT are hard-gated** until his verified source + target buy-box exist (`profile-source/joseph-profile-facts.md`). The orchestrator must never borrow Guy's facts to fill the gap — it flags the block in each digest until unblocked.

---

## 6. Failure handling & escalation

| Failure | Response |
| :-- | :-- |
| Board is JS-rendered / WebFetch returns a shell | Escalate that source to Claude-in-Chrome (`navigate` + `get_page_text`); do not fabricate postings. |
| Saved search returns 0 / errors | Retry next cycle; flag in digest if 2 cycles dry. |
| Fact gap (role asks for something not in verified source) | Mark the gap, ask Guy — never invent the fact. |
| Permit ambiguity on an NL role | Flag, point to work-permit pack, hold the apply gate. |
| Conflicting CV variants | Default to JD emphasis (cloud vs security) + geography; if unclear, ask. |
| Connector down (Gmail/Notion) | Fall back to in-workspace drafts; note the blocker. |

---

## 7. Per-run Definition-of-Done (gate before posting the digest)
- [ ] Every shortlisted role **fit-scored** vs the rubric with a one-line fit note.
- [ ] CV/letter drafted **only from verified source**; correct variant (geo+emphasis).
- [ ] **Permit/eligibility** checked on every NL role.
- [ ] **No auto-submit / no auto-upload** — external actions are queued for confirm.
- [ ] Joseph stream respected the hard gate.
- [ ] Pipeline updated; SLAs set; outcomes from last cycle logged.
- [ ] Correct account (`bguy.rubin@gmail.com`); no cross-person fact leakage.

---

## 8. Schedules that drive it
| Loop | Cadence | Tier | Registry |
| :-- | :-- | :-- | :-- |
| Sourcing sprint (SENSE→DRAFT→NOTIFY) | Twice weekly | 🟢 read/draft | Hermes `4fc75fbfad30` (Telegram) |
| Pipeline review + follow-up sweep (TRACK→FOLLOW-UP) | Weekly | 🟢 draft | new — see MESH.md |
| Daily recruiter-reply triage | Daily | 🟢 read | KK morning routing `333eaf638d76` |

The human stays in exactly one place: approving what goes out, and deciding on offers. Everything upstream of that runs itself.
