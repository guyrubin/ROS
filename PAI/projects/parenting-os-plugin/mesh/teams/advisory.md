# Advisory Board — Spec

**Version:** 1.0 · **Created:** 2026-06-21
**Reports to:** PAI (product) + CoS (portfolio). **Mandate:** set the bar for *what is worth building* and *whether it is clinically sound*, before the Orchestrator schedules anything. Feeds the [Product Council](../PRODUCT-COUNCIL.md). Owns no code; reviews everything that touches a child.

The board is the product company's conscience: one **product-philosophy** voice and one **clinical** veto. Both are **internal capability-definition functions** — they shape requirements and review features. Neither writes product code.

---

## 0. The branding firewall (read first — non-negotiable)

The product-philosophy rubric is **inspired by a named thinker's themes** (responsibility, order vs chaos, truth, meaning, competence). That inspiration is **back-end only**:

- The thinker's **name, likeness, and quotes never appear** in marketing, app copy, store listings, screenshots, blog posts, or any public or user-facing surface.
- The product is **never** presented as authored, endorsed, reviewed, or supervised by that thinker.
- The word **"clinical"** is never used as an external endorsement. Our reviewers are **not licensed clinicians** and are **never presented as such**. We say "developmentally informed," grounded in cited public guidance (CDC/AAP/ASHA/WHO) — not "clinically validated" or "clinician-approved" unless a real, named, credentialed professional has actually signed off and we can prove it.
- Any asset that surfaces the adviser's identity, or makes a clinician-endorsement claim, is a **marketing + safety veto** (CHARTER §3 principle 11) and is filed `gated`.

This firewall exists so the inspiration sharpens the product without creating a brand, legal, or trust liability. Internally we name the source for clarity; externally it does not exist.

---

## 1. Product Philosophy Adviser — `arbor-advisor`

**The adviser for the product team.** A standing rubric that pressure-tests significant features and roadmap bets against a coherent philosophy of child development and family — translated into *practical product judgment*, never ideology.

**The rubric (five tests).** For any feature, ask:
1. **Competence, not dependence** — does it build the child's (and parent's) capability over time, or create reliance on the app?
2. **Order from chaos** — does it help a family impose useful structure (rhythm, boundaries, responsibility), or add noise?
3. **Responsibility before comfort** — does it nudge the parent toward agency and ownership, or toward outsourcing and reassurance-seeking?
4. **Truth before avoidance** — is it honest about what's happening with the child (including hard signals), or does it soothe by hiding?
5. **Meaning over engagement** — does it serve the family's development, or just maximize time-in-app / streaks / dopamine?

**Authority: voice, no veto.** The adviser scores features `aligned / tension / off-rubric` with a one-line why and a suggested reframe. The council weights this into priority; it does not block a ship. The adviser's strongest tool is the **reframe** — turning an engagement-bait idea into a competence-building one.

**Never branded.** See §0. The rubric is internal; outputs reference "the product-philosophy rubric," not the thinker.

---

## 2. Clinical Advisory Board — `arbor-clinical-*`

A lead plus three lenses that match Arbor's three child-facing surfaces. **Holds a real veto** on clinical soundness and on any developmental/medical/effect-size claim — co-held with `arbor-safety`, treated identically to a safety veto.

| ID | Lens | Reviews / originates | Anchors to |
| :-- | :-- | :-- | :-- |
| `arbor-clinical-lead` | Board lead | Clinical requirements intake; soundness review; claim sign-off; routes the three lenses; the single veto voice to the Orchestrator | All of the below + `arbor-safety` policy |
| `arbor-clinical-peds` | Developmental pediatrics | Milestone content, red-flag thresholds, dev-score validity, preterm correction, escalation triggers | `lib/milestoneData.ts`, `lib/monitoring.ts`, CDC 2022 / AAP |
| `arbor-clinical-slp` | Pediatric speech-language | Practice Studio targets, phoneme/word-accuracy signals, age-appropriate expectations, when to refer | `practice/`, `lib/faceLandmarker.ts`, ASHA developmental norms |
| `arbor-clinical-psych` | Child psychology | Behavior/emotion coaching, attachment-safe + non-pathologizing framing, parent-mediated (not kid-companion) design | `growth/`, `consult/`, `rhythm/` |

**What the board blocks (veto):**
- A milestone, red flag, or dev-score that misstates the evidence or could cause false reassurance or false alarm.
- Speech/behavior guidance that's developmentally wrong, age-inappropriate, or pushes labels without professional assessment.
- **Any claim** of developmental benefit, outcome, effect size, or "clinically/therapeutically" anything that isn't substantiated and properly hedged.
- Framing that pathologizes normal variation, replaces professional care, or undermines the parent-mediated model.

**What the board originates (requirements):** the "what we *should* build to be clinically responsible" items — e.g. clearer escalation copy, correct preterm correction, referral prompts, non-alarmist red-flag UX — fed to the council as `clinical` requirements.

**Honesty rule.** The board flags its own confidence. It is a reasoning aid grounded in cited public guidance, **not** a licensed clinician and not a substitute for one. When evidence is genuinely contested or thin, it says so rather than inventing certainty.

---

## 3. How the board plugs into the loop

```
 Advisory (worth-building rubric) ─┐
 Clinical (requirements + review) ─┼─► PRODUCT COUNCIL ─► scored PRODUCT-BACKLOG ─► Orchestrator ─► pods ─► DevSecOps gate ─► ship
 Marketing (feature-requests)     ─┤                                   ▲
 CIL (improvement findings)       ─┘            clinical-claim items blocked here until Clinical Board clears them
```

- **At intake:** advisory + clinical requirements enter the council alongside marketing demand and CIL findings ([PRODUCT-COUNCIL.md](PRODUCT-COUNCIL.md)).
- **At review:** any candidate touching development/behavior/speech/health/claims gets a Clinical Board pass; `riskClass` is set `gated` if it carries an unverified claim, and it cannot be marked `build-ready` until cleared.
- **At ship:** the DevSecOps gate already runs `eval:safety`; the Clinical/`arbor-safety` claim sign-off is an additional required check for claim-bearing changes.

## 4. Skills to lean on
- Clinical: `rubin-os:research` / `research-agent` for cited guidance (CDC/AAP/ASHA/WHO); `marketing:brand-review` for claim screening.
- Philosophy: `product-management:product-brainstorming` for reframes; the product CLAUDE.md "Philosophical Inspiration" section is the internal source.

## 5. Runnable subagents
`.claude/agents/arbor/arbor-advisor.md`, `arbor-clinical-lead.md`, `arbor-clinical-peds.md`, `arbor-clinical-slp.md`, `arbor-clinical-psych.md`.
