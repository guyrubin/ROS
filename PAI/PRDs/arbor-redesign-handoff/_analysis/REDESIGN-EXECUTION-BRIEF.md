# Arbor Redesign — Execution Brief (epic decision)

**Date:** 2026-06-23 · **Owner:** CoS (synthesis) · **Source:** Claude Design handoff `Arbor Web App.dc.html` (+ mobile prototype, Capability Blueprint) · **Meshes:** PAI · MKT · DevOps · CoS

---

## 1. The one-line truth
The prototype is an **IA / visual / design-system upgrade on a richer live app** — not a feature expansion. The live app already ships 34 tabs, 14 practice worlds, scholar-lens coaching, the append-only memory ledger, 10 hero journeys, corrected-age milestones, Family tier, role-scoped sharing. The prototype shows 6 nav surfaces, 6 games, 4 stories, no Family tier. **The entire job is harvesting the redesign's real value (the cleaner shell, design system, Kid Mode, multi-kid chrome, Day Windows) at ZERO regression.** Naively "implementing the prototype" would delete ~60% of the shipped product.

## 2. What we'll build — Bucket A, 4 waves (AP-043 → AP-060, 18 tickets)
- **Wave 1 — foundation (pure frontend):** AP-043 design-token layer (kill 344 hardcoded hex), AP-044 sidebar+topbar shell. Zero backend touch. *Hard prerequisite for everything.*
- **Wave 2 — chrome:** AP-045 global search (content-catalog only), AP-046 notification bell (verbatim copy), AP-047 multi-kid switcher+add-child, AP-052 accent theme.
- **Wave 3 — surfaces:** AP-048 Kid Mode overlay, AP-049 5-step onboarding *(gated)*, AP-050 avatar fan-out.
- **Wave 4 — features:** AP-051 Day Windows *(gated)*, AP-053 Dev Copilot *(gated-light)*, AP-054 Language Lab *(gated)*, AP-055 Scholar Hub, AP-059 kid weekly-missions.
- **Post-clearance:** AP-056 School Handoff *(gated)*, AP-057 Bedtime Stories *(gated)*, AP-058 Smart Reminders settings *(gated)*, AP-060 "The Science" page *(gated)*.

Every Bucket-A ticket **reskins/rewires an existing rich backend** — no rebuild-from-scratch.

## 3. No-regression guarantee — now an enforced ship-gate
**18 floors (F1–F18).** F1–F11 = content-count floors (routes ≥34, worlds ≥14, journeys ≥10, domains =7, milestones ≥133, Family tier, scholars ≥6, ledger append-only, consent purposes, RTL/HE, activities ≥250) — 10 already assertable in code today; F2 needs a 1-line `WORLDS` export in Wave 1.

The audit found the count-floors were **blind to behavioral capabilities** — so we added **F12–F18**: safety screening wired *(CRITICAL)*, consent-enforcement middleware *(CRITICAL)*, sharing access model *(CRITICAL)*, voice I/O, image-gen + C2PA provenance, handoff export, clinical-content shape. F12/F13/F14 are an **automatic veto** — any red blocks ship before a human even looks.

New gate commands: `check:floors` + `smoke:routes`, appended to the existing green-gate (tsc/test/check:framework/eval:safety). Pipeline stays **branch → green-gate → canary → prod; never blind-to-main, never hand-deployed.**

**Floors a script CANNOT judge → named human reviewers:** F8 in-place-erase (arbor-sec), F9 consent UX (arbor-sec + arbor-safety), F10 RTL visual (arbor-qa HE), F4/F5 clinical framing (arbor-clinical-psych/-slp), AP-043 token parity (arbor-design).

## 4. Audit results — folded in
- **6 missed net-new features** recovered → AP-055 Scholar Hub, AP-056 School Handoff, AP-057 Bedtime Stories, AP-058 Smart Reminders settings, AP-059 kid weekly-missions, AP-060 "The Science" page. ✅ ticketed.
- **7 regression holes** → closed by floors F12–F18. ✅ closed.
- **3 mis-gated items** → AP-053 re-gated, AP-046 binding verbatim-copy condition, AM-R4 re-gated. ✅ corrected.
- **Firewall violation:** prototype's "The Science" card says *"Expert-Reviewed by our clinical board"* — banned language. AP-060 carries an explicit "strip clinician-reviewed language" instruction; clears via arbor-clinical-lead.

## 5. Gated decisions for Guy (Tier-C — individual sign-off)
- **AP-049** onboarding (focus-domain copy + avatar COPPA consent) · **AP-051** Day Windows (predictive framing) · **AP-054** Language Lab (SLP framing) · **AP-053** Dev Copilot (light copy pass) · **AP-056/057/058/060** (post-clearance gated).
- **Marketing:** AM-R1 pricing (₪ anchors), AM-R3/R4/R5 "Science"/CDC-grounded claims.
- **Positioning conflict:** Capability Blueprint says "4 competitors / 4 domains"; BRAND-STRATEGY says "six surfaces / 7 domains" (matches the live app). Blueprint is the older sketch. **Decision: update the Blueprint to the six-surface/7-domain spine before any external use?**

## 6. THE ASK — one batched epic approval
> **Approve Wave 1 — the pure-frontend design-system + shell (AP-043 tokens, AP-044 sidebar/topbar) — to build green-to-branch behind the F1–F18 gate?**

Wave 1 touches zero backend, regresses nothing, and unblocks every later wave. Waves 2–4 proceed under the standing epic rhythm; the 8 gated tickets above come to you individually as they reach build-ready.
