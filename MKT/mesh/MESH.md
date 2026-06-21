# MKT Content Mesh

**Version:** 1.0
**Created:** 2026-06-21
**Owner:** MKT (Marketing & Content) · reports to ros-conductor (CoS)
**Loop type:** both (on-demand campaign/content + proposed weekly content cadence, draft-only)
**Runs:** `/AGENTS.md` boot → reads `/MKT/MEMORY.md` → [ROS Agent Framework](../../00_System/agent-framework/FRAMEWORK.md)

## Mission
Turn a marketing goal into on-brand, channel-fit assets that ship: plan the campaign and funnel, hold the brand voice, and produce the posts/copy/articles for Guy's personal brand and the HollandVest brand — substantiated claims, clear CTA, every time.

## Roster

| ID | Role | Owns | Escalates to |
| :-- | :-- | :-- | :-- |
| `mkt-lead` | Lead | Frames the goal, owns the content calendar + funnel, picks channels, holds the brand-voice gate, dispatches `mkt-content` | ros-conductor |
| `mkt-content` | Content/copy | Drafts one piece for one channel (LinkedIn, blog, landing, email), on-brand and channel-fit | `mkt-lead` |

> Fan-out pays here: `mkt-lead` can dispatch `mkt-content` in parallel to draft a whole post slate (one piece per channel) before assembling the calendar. The lead loads SEO/AEO + social-distribution as skills directly — no separate pod.
>
> **Arbor has its own marketing team** (`arbor-marketing-lead` + `arbor-content`/`arbor-seo`/`arbor-acquisition`, under PAI). This mesh covers **Guy's personal brand + HollandVest only**; for Arbor, `mkt-lead` coordinates with `arbor-marketing-lead` rather than duplicating it.

## Gate (Definition-of-Done)
- **On-brand voice** — matches the target brand's voice profile in `/MKT/MEMORY.md`.
- **Channel-fit format** — length, structure, hook conform to the channel.
- **Claims substantiated** — no unbacked numbers/superlatives.
- **Clear CTA** — every asset has one next action.
- **EA-confidentiality checked** before any client-derived content (sanitize; confirm with EA first).
- Universal: safety level respected · correct account · no confidential leakage.

## Skills this mesh loads
| Task | Skill |
| :-- | :-- |
| Plan a campaign, content calendar | `campaign-planner` |
| Write a post / article / thought-leadership piece | `content-creator` |
| Conversion copy (landing, ads, CTA, email) | `copywriter` |
| Launch / positioning / ICP | `gtm-strategist` |
| Background, market/audience scan | `research` |
| SEO/AEO + social distribution | loaded by `mkt-lead` as skills |

## Loops it owns

| Loop | Type | Cadence | Posture | Registry |
| :-- | :-- | :-- | :-- | :-- |
| Campaign / content push | on-demand | — | acts in-workspace | — |
| MKT Content cadence | scheduled (proposed) | Weekly | draft-only | SCHEDULED-LOOPS.md |

## How to invoke
- A campaign or content push: dispatch `mkt-lead` (or `mkt-content` directly for a single scoped piece).
- Command: `/mkt.write-post`, `/mkt.plan-campaign`, `/mkt.content-calendar`.

## Boundaries
- EA client thought-leadership → must be sanitized; confidentiality check with EA **first**.
- Product launches → coordinate with PAI; Arbor marketing → `arbor-marketing-lead`, do not duplicate.
- Sending: draft-first, Gmail `bguy.rubin@gmail.com`, Level 3 confirm.
