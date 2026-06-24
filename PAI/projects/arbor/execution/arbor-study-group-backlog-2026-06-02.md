# Arbor — Study-Group Review Backlog (live-app QA)

**Date:** 2026-06-02
**Owner:** PAI
**Source:** Study-group walkthrough of the running app (Google Doc, Hebrew). Empirical, screen-by-screen QA — distinct from the strategic advisory backlogs.
**Canonical code:** `PPPPtherapy-/PPPPtherapy-/app/src` (`App.tsx`, `initialData.ts`).
**Cross-refs:** advisory backlog `arbor-enhancement-backlog-jbp-2026-06-02.md` (A/K/D series) and capability backlog `arbor-capability-backlog-2026-06-02.md` (H/E series).

## What this input is
This is the first **hands-on QA from actually using the app**, screen by screen. The other two backlogs were reasoned from code + strategy; this one is reasoned from a finger on the screen. Where they overlap, that's *confirmation* — ship those first. Where this doc raises something new, it's mostly **UX legibility, naming, and a monetization gap** the advisory passes missed.

## Source notes (translated)
**General:** colour contrast is unreadable; marketing/value headlines missing across every screen; no Account Settings (payment method, invoices).
**Dashboard:** (1) EDIT button font too small; (2) the Risk Level question in EDIT is unclear; (3) allow adding a child photo in EDIT; (4) align text in the three top cards; (5) "Sage-Clay" term is opaque; (6) Reminders look like radio buttons — should default open, just toggle Enable; (7) story buttons overlap.
**Parent Coach:** (1) the "New" button misleads — looks like "add knowledge source," actually jumps to "add question"; (2) card content is unclear, should be a short summary of the theorist; (3) only 6 theorists shown.
**Behavior & Emotion tracker:** (1) allow manual entry of a challenge, then run it through source analysis to produce a sharper "skill of coping effectively"; (2) does auto-recording categorise by criteria via AI?
**Development Milestones checklist:** (1) "Total Mastery" term too opaque; (2) move "add milestone" to top of page; (3) "Blueprint" produced nothing (broken).
**AI Bedtime Stories:** (1) add folk tales + biblical stories (copyright-safe); (2) add challenges for older ages; (3) allow manual challenge entry.
**Scholar Academy:** (1) personalise sources/theorists — same as Parent Coach note.

---

## Backlog (G-series = group review)

Each ticket: **Intent · Build · Files · Effort (S/M/L) · Priority · Cross-ref**.

### Tier 0 — Bugs & blockers (broken in front of a tester)

| ID | Item | Build | Files | Eff | Pri |
|---|---|---|---|---|---|
| G-01 | **"Blueprint" produces nothing** | Reproduce the Milestones → Blueprint action; fix the dead handler / missing endpoint or hide the control until it works. Don't ship a button that does nothing. | `App.tsx` (milestones) | S | **P0** |
| G-02 | **Story buttons overlap** | Fix the z-index/layout collision on the Dashboard story CTA(s). | `App.tsx` | S | **P0** |
| G-03 | **Colour contrast unreadable** | The dark-gold theme is failing legibility. Confirms advisory **D-01/D-06**. Run a contrast pass to WCAG AA; this is the wedge into the larger "pick the aesthetic" decision. | `App.tsx`, tokens | M | **P0** |

### Tier 1 — Legibility & naming (cheap, high-trust, ship next)

| ID | Item | Build | Files | Eff | Pri |
|---|---|---|---|---|---|
| G-04 | **Rename opaque jargon** | "Sage-Clay" → a plain colour/section name; "Total Mastery" → plain progress label (e.g. "All milestones met"). Sweep for other internal terms leaking to parents. Confirms advisory **A-04/D-02 (de-grandify)**. | `App.tsx`, `initialData.ts` | S | **P0** |
| G-05 | **Theorist cards: show a plain-language summary** | Each scholar card renders a one-line "what this lens is for," not an opaque label. Same fix serves Parent Coach **and** Scholar Academy. Directly = capability **H-09**. | `App.tsx`, `initialData.ts` (`scholarsInfo`) | S | **P1** |
| G-06 | **Fix the "New" button affordance (Parent Coach)** | The label/icon implies "add knowledge source" but it opens "add question." Relabel to match its real action, or split into two clear actions. | `App.tsx` | S | **P0** |
| G-07 | **Reminders: default-open toggles, not hidden radios** | Render reminders as visible Enable/Disable switches in an expanded state; drop the radio-button ambiguity. | `App.tsx` | S | **P1** |
| G-08 | **EDIT panel polish** | Increase EDIT button font; rewrite the Risk Level question to be self-explanatory (tie copy to the coach's `riskLevel` meaning). | `App.tsx` | S | **P1** |
| G-09 | **Align the three top dashboard cards** | Text alignment/baseline fix on the hero cards. | `App.tsx` | S | **P1** |

### Tier 2 — Capability gaps the testers hit

| ID | Item | Build | Files | Eff | Pri |
|---|---|---|---|---|---|
| G-10 | **Child photo in profile/EDIT** | Add an avatar/photo to the child profile editor. Folds into advisory **A-01 (real onboarding/profile)** — do them together. Mind child-image consent/retention (**K-04/K-05**). | `App.tsx`, profile store | M | **P1** |
| G-11 | **Manual challenge entry → AI sharpening (Behavior tracker)** | Let the parent type a raw challenge; run it through source analysis to return a precise, named coping skill + plan. This is `/api/analyze-behavior` + **H-06 (analysis→plan)** wired to a manual entry point. | `App.tsx`, `routes/api.ts` | M | **P1** |
| G-12 | **Clarify / build auto-categorisation of logs** | Answer the tester's question in the product: when a behavior is recorded, does AI tag it by criteria? If yes, show the tags; if no, decide whether to build it. Pairs with capability **K-09 (pattern detection)**. | `App.tsx`, `routes/api.ts` | M | **P2** |
| G-13 | **Personalise theorists/sources** | Beyond the fixed 6: let a parent add/weight a theorist or source the coach reasons from. Extends **H-09**; affects Parent Coach + Scholar Academy. Scope carefully — keep source-grounding honest (**K-06**). | `App.tsx`, `initialData.ts`, knowledge store | M | **P2** |
| G-14 | **Bedtime stories: folk + biblical corpus** | Add public-domain folk tales and biblical stories as a copyright-safe story base. Good instinct — these are public domain and culturally resonant for the IL market. | story route, `App.tsx` | M | **P2** |
| G-15 | **Bedtime stories: older-age challenges + manual entry** | Extend story challenges to older age bands; allow the parent to add a challenge manually. Pairs with **H-05 (discussion questions)**. | story route, `App.tsx` | M | **P2** |

### Tier 3 — Monetization (net-new; no other backlog covers this)

| ID | Item | Build | Files | Eff | Pri |
|---|---|---|---|---|---|
| G-16 | **Account Settings: payment method + invoices** | Add an Account Settings surface: profile/account, billing (payment method, invoice history), subscription tier. This is the **first commercial surface** in the product and isn't in any prior backlog. Likely a billing provider (Stripe) decision behind it. | `App.tsx` (new route), auth/billing service | L | **P1** |

---

## Two strategic flags for the study group

1. **"Marketing headlines missing" vs "de-grandify the copy."** The doc asks for value/marketing headlines on every screen; the advisory pass (C3/A-04/D-02) says strip the grandiose cockpit copy. These aren't actually opposed — the resolution is **warm, benefit-led headlines that orient the parent, not boastful "operating system" copy.** Agree the voice before anyone writes screen headers, or we'll thrash. **Decision needed.**
2. **Account Settings implies a paywall now.** G-16 forces a pricing/billing decision earlier than the private-beta plan assumed. Confirm whether beta is paid or we're just scaffolding the surface. **Decision needed.**

## Recommended order
1. **Tier 0 bugs (G-01–G-03)** — nothing demos well with a dead Blueprint button and unreadable contrast.
2. **Tier 1 legibility (G-04–G-09)** — all small, all trust-building, all confirm advisory P0s.
3. **G-10 + G-11** alongside advisory **A-01/A-02** (real profile + multi-child) — same code, do once.
4. **G-16 (Account Settings)** once the pricing decision lands.
5. **Tier 2 capability bets (G-12–G-15)** after the harvest tickets (H-series) prove the engine delivers.

## Net-new vs already-known
- **Net-new from this review:** G-01 (Blueprint bug), G-02 (story overlap), G-06 (New-button affordance), G-07 (reminders), G-08 (EDIT panel), G-09 (card alignment), G-10 (child photo), G-13/G-14/G-15 (theorist personalisation + story corpus/ages), **G-16 (Account Settings/billing)**.
- **Confirms existing tickets** (raise their priority, they're now empirically validated): G-03→D-01/D-06, G-04→A-04/D-02, G-05→H-09, G-11→H-06, G-12→K-09.
