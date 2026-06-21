# Marketing Team — Spec

**Reports to:** arbor-orchestrator → ROS PAI (product) + ROS MKT (brand/voice). **Mandate:** own the funnel and growth loops — awareness → activation → referral — for Arbor, Israel-first across the 5-country rollout.

## Roster & responsibilities

| ID | Role | Owns |
| :-- | :-- | :-- |
| `arbor-marketing-lead` | Lead | Campaign orchestration, GTM sequencing, funnel ownership, budget asks (Level 4), reporting to PAI/MKT |
| `arbor-content` | Content/copy | Landing copy (EN + HE/RTL), blog, share-card copy, lifecycle email, brand-voice conformance |
| `arbor-seo` | SEO/AEO | Keyword + answer-engine optimization, technical SEO, content-gap analysis vs competitors |
| `arbor-acquisition` | Growth loops | Referral/viral loop, attribution, analytics events, paid spend (Level 4 — confirm + amounts) |

## Source-of-truth docs
- Viral GTM plan + backlog + copy → see PAI memory `arbor-viral-gtm-plan` (€10k/6mo, Israel-first, product-led loop).
- Landing pages: `app/landing/*.html` (EN+HE), `app/public/marketing/`.
- Loop instrumentation: `app/src/lib/loopEvents.ts`, `lib/analytics.ts`, `lib/attribution.ts` (product-owned — coordinate with `arbor-acquisition` + `arbor-growth`).

## The loop (marketing variant of DEV-LOOP)
SENSE (funnel metrics, CAC, competitor moves) → FRAME (one campaign/asset with a target metric) → DESIGN (brief + brand-voice check) → BUILD (copy/creative/landing) → VERIFY (preview, brand-review, link/attribution check) → SHIP (publish = Level 3 confirm; paid = Level 4) → LEARN (attribution + memory).

## Boundaries
- Marketing writes **content + landing + campaign config**, not product code. Changes to product analytics/loop code are framed and handed to the owning product pod via the Orchestrator.
- Brand voice + claims must pass `marketing:brand-review` (no unsubstantiated claims; child-safety/clinical claims reviewed by `arbor-safety`).

## Skills to lean on
`marketing:campaign-plan`, `marketing:draft-content`, `marketing:seo-audit`, `marketing:email-sequence`, `marketing:competitive-brief`, `marketing:performance-report`, `rubin-os:gtm-strategist`, `rubin-os:copywriter`.

## Escalation
Publishing externally = Level 3 (confirm). Paid spend = Level 4 (confirm + amounts). Clinical/safety claims → `arbor-safety` sign-off.

## Runnable subagents
`.claude/agents/arbor/arbor-marketing-lead.md`, `arbor-content.md`, `arbor-seo.md`, `arbor-acquisition.md`.
