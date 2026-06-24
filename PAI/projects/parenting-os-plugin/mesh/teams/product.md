# Product Department

**Tier:** 1 (direction in, build-ready tickets out) · **Head:** `arbor-product` (Head of Product) · **Reports to:** ROS PAI
**Created:** 2026-06-22 · **Restructured:** 2026-06-22 (added PM + UX/Research + UI roles — the product org was a Head-of-Product sitting directly on engineering pods with no PM, no UX, no product designer).

The forward product-thinking department. It decides *what to build and why*, makes it *usable*, turns it into *ready, scored tickets*, and feeds the Product Council. It does not build (engineering pods do), score the final backlog alone (the Council does), or own the visual system (`arbor-design` does).

## Roles (the org)

| Role | Agent | Owns | Standard of work (DoD) |
| :-- | :-- | :-- | :-- |
| **Head of Product** | `arbor-product` | Vision, strategy, *what & why*, success metrics, the `product` stream into the Council | Persona+age-band+job+evidence · smallest valuable slice · one metric+instrumentation · clinical angle routed |
| **Product Manager** | `arbor-pm` | The backlog engine: triages every feature-request/enhancement/bug into `AP-` tickets, ready-bar, scoring, wave coordination with the Orchestrator | Every item triaged + de-duped · `AP-` id + origin + acceptance criteria + metric + riskClass · queue re-scored · gated items surfaced |
| **UX Research + Product Design** | `arbor-ux` | Voice-of-parent (interviews/usability/analytics synthesis); flow + interaction design with all states (empty/loading/error/success) | Grounded in parent evidence · full flow incl. states · register correct (parent-calm / child-playful) · mobile+RTL+a11y · build-ready handoff |
| **UI / Design System** | `arbor-design` | The visual system: tokens, `index.css` (merge-lock), PlayKit + UI kit, Tailwind, theming, a11y/touch-targets | Token-first · WCAG AA · visual proof in preview · serial `index.css` edit order |
| **Engineering** | 10 domain pods | Build each slice of `app/src/` within boundary (see [ROSTER.md](../ROSTER.md)) | Green-gate (lint/test/check:framework/eval:safety) · conflict-map · memory entry |

## Capabilities
Product discovery · PRDs/specs · success-metric definition · backlog triage + grooming (bug/enhancement/feature) · UX research (voice-of-parent) · flow/interaction design + state coverage · UI/design-system · build.

## Operation (how the department runs)
1. **Head of Product** sets direction + the metric for a problem (discovery brief → PRD).
2. **UX** researches the parent, designs the usable flow + states; **Design** specs the UI.
3. **PM** triages it (plus every inbound request/bug/enhancement) into a ready, scored `AP-` ticket on `PRODUCT-BACKLOG.md`, de-duped and gated.
4. The **Product Council** scores it against the other four streams + applies the clinical gate.
5. The **Orchestrator** builds the wave; **engineering pods** ship within boundary; **DevSecOps** gates; the **release train** promotes.
6. PM closes the ticket on the metric move; UX watches the in-app signal → next iteration.

## Tools
`rubin-os:prd-generator`, `rubin-os:write-spec`, `product-management:*` (brainstorm/synthesize-research/metrics-review/roadmap-update/sprint-planning), `design:*` (user-research/design-critique/ux-copy/accessibility-review), `impeccable`; dispatches `research-agent` (market) + `arbor-critic-feedback` (in-app signal); backlog tooling per [BACKLOG-MODEL.md](../../../../00_System/release-engineering/BACKLOG-MODEL.md).

## Voice-of-parent (research function)
`arbor-ux` owns the standing research function. Signal inventory, intake sources, the 5-parent first-sprint, and the weekly Council input format are in [`voice-of-parent.md`](voice-of-parent.md). **Current status (2026-06-22): zero real parent signals in the system.** The in-app feedback prompt and 5 interviews are the minimum first step; Guy must approve the interview budget (Level 4) and any outbound recruit message before outreach begins.

## Position in the company
Co-equal with the **Advisory Board** as an input to the **Product Council** (Advisory rules *worth + sound*; Product rules *right problem + right slice + usable + measurable*). Full org: [`../COMPANY.md`](../COMPANY.md).
