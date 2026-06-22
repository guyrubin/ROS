# Arbor Marketing Mesh

**Version:** 1.0
**Created:** 2026-06-21
**Owner:** Arbor Marketing · reports to `arbor-orchestrator` → ROS PAI (product) + ROS MKT (brand/voice)
**Loop type:** **autonomous, scheduled-first** — the marketing loop runs sense→file→build→publish→learn on its own; the human approves only money, claims, child-data, and irreversible actions.
**Runs:** `/AGENTS.md` boot → reads `/PAI/MEMORY.md` + this mesh's [OPERATING-MODEL.md](OPERATING-MODEL.md) + [MARKETING-BACKLOG.md](MARKETING-BACKLOG.md) → [ROS Agent Framework](../../../../00_System/agent-framework/FRAMEWORK.md)

## Mission
Operate like a billion-dollar branding company for the best product in its market. Own Arbor's whole demand engine end-to-end — strategy first: a sharp brand spine ([BRAND-STRATEGY.md](BRAND-STRATEGY.md)), then materials and campaigns that are unmistakably Arbor, shipped to its owned organic surfaces autonomously, with competitor-driven feature requests fed to the product mesh — Israel-first across the 5-country rollout. The marketing team PAI's `arbor-orchestrator` coordinates with, not a one-off.

**The standard:** every output is essence-true and category-defining, or it doesn't ship. Arbor is **Longitudinal Child Intelligence** — *the steady hand that remembers your child*; **one child OS, six surfaces on one parent-owned record, each beating a category leader** (Daily Play vs Lovevery/Kinedu · Rhythm vs Huckleberry · Ask Arbor vs Good Inside/Cleo/Cooper/Maven · Practice Studio vs Speech Blubs/Lingokids · Arbor Care vs cold-start experts · Child Memory = the record). The moat is the record. The unforgivable sin is generic. The full spine lives in [BRAND-STRATEGY.md](BRAND-STRATEGY.md); read it first, every cycle.

## Roster

| ID | Role | Owns (scope) | Escalates to |
| :-- | :-- | :-- | :-- |
| `arbor-marketing-lead` | Lead / orchestrator | Runs the [operating model](OPERATING-MODEL.md), holds the **one** [marketing backlog](MARKETING-BACKLOG.md), frames campaigns, owns the funnel, dispatches the pods, decides what publishes autonomously vs escalates | `arbor-orchestrator` |
| `arbor-brand` | Brand strategist + creative director (ECD) | The [brand strategy/bible](BRAND-STRATEGY.md) — essence, category design, the convergence positioning, verbal+visual identity; writes flagship craft; **holds the essence+craft veto** (the Arbor Bar) on every asset | `arbor-marketing-lead` |
| `arbor-insights` | Viral & market intelligence (research) | The **outside-in** signal: trend/format radar (rising IL-parent sounds/hooks, scored by growth-stage + rule-of-three within the 48h window), creator radar (high-velocity micro-creators 10–25K), community listening (public IL FB mega-groups), the 5-dimension competitor scan, and **sourced product feature-requests**. Orchestrates ROS `research-agent`, borrows `arbor-critic-capability`. Observe-only — writes briefs, never ships | `arbor-marketing-lead` |
| `arbor-content` | Content / copy | Landing copy (EN + HE/RTL), blog/guide-hub, share-card copy, lifecycle-email drafts, brand-voice conformance; **writes the caption/hook line first** (copy leads, creative serves) | `arbor-marketing-lead` |
| `arbor-creative` | Viral creative producer | Turns concepts/scripts into shippable short-form **video/motion/design** (Reels/TikTok/Shorts via HeyGen, edits via CapCut, graphics via Canva); hook-variant batches; the generic animated child-as-hero format; the [hook bank](hook-bank.md). Owns *watchability*, not strategy/copy. **Never** renders the hero from a real child's face/biometric | `arbor-marketing-lead` |
| `arbor-seo` | SEO / AEO | Keyword + answer-engine optimization, technical SEO (metadata/OG/hreflang/sitemap/schema), content-gap analysis vs competitors | `arbor-marketing-lead` |
| `arbor-acquisition` | Growth loops (inside-out) | Referral/viral loop spec, attribution, analytics events, K-factor read, paid-acquisition planning (paid = Level 4, gated) | `arbor-marketing-lead` |
| `arbor-distribution` | Distribution & Community | Creator/influencer ops (sourcing, outreach drafts, retainer roster, seed kits), ambassador program, WhatsApp class-group + IL Facebook mega-group seeding playbook, UGC challenges (#הגיבורשלי/#ArborHero), owned-channel publishing calendar/queue. Drafts all outbound — L3-gated for DMs/external posts; own-channel queue is autonomous after gate. Does NOT own loop math/attribution (arbor-acquisition) | `arbor-marketing-lead` |
| `arbor-critic-market` | Eval lens (observe-only) | Audits landing/funnel/SEO/positioning, returns scored findings to the backlog — the loop's SENSE lens. Never edits product code | `arbor-marketing-lead` |

**The org flow (a full viral growth org, not a copy team):** `arbor-insights` (what's working now) → `arbor-brand` + `arbor-content` (strategy + the hook/message) → `arbor-creative` (the watchable asset) → `arbor-distribution` (creators + community seeding + the queue) → `arbor-acquisition` (the loop + the read) → `arbor-critic-market` (eval) → back to `arbor-insights`. The method, cadence, and thresholds live in [VIRAL-ENGINE.md](VIRAL-ENGINE.md).

> `arbor-critic-capability` (the CIL competitor-capability critic) is **borrowed** each cycle as a SENSE lens — it sources competitor *feature* gaps that marketing hands to the product backlog. ROS `research-agent` is **dispatched** by `arbor-insights` for deep multi-source verification. Both are owned outside this mesh.

## Gate (Definition-of-Done)
Every marketing frame must clear **[the Arbor Bar](BRAND-STRATEGY.md) (§10)** — `arbor-brand`'s 8 category + craft tests — before it ships. The headline checks:
- **Essence-true & category-defining** — traces to [BRAND-STRATEGY.md](BRAND-STRATEGY.md); survives the one-word-swap test (couldn't run on a competitor's page); names the enemy; makes the "one record, six surfaces" convergence undeniable; wins on calm. `arbor-brand` holds the **veto on anything generic or off-essence**.
- **On-brand craft** — calm clinician-mentor voice; banned-word list is law; sage-paper + emerald clay; Fraunces/Nunito (EN), Frank Ruhl Libre/Heebo (HE), native not translated; HE/RTL first-class. Passes the 11pm + clinician + decision tests.
- **Claims substantiated, mechanism-cited** — no unbacked numbers/superlatives; clinical/effect-size claims **never** transferred until Arbor's own data exists (governance gate G2). Anything clinical → `arbor-safety` sign-off (hard veto).
- **Loop-math honest** — growth claims measure installs-per-sharing-parent/month, no blended-K guarantees (gate G1).
- **Channel-fit + one clear CTA** per asset; links + attribution verified; preview renders (EN + HE).
- **Backlog updated** — the item is moved/scored in [MARKETING-BACKLOG.md](MARKETING-BACKLOG.md); competitor feature-requests handed to the product backlog.
- Universal: safety level honored · correct account (`bguy.rubin@gmail.com`) · no child face/voice/data as payload · memory write-back to `/PAI/MEMORY.md`.

## Autonomy envelope (full-autonomy-with-publish, confirmed 2026-06-21)
This mesh publishes to **owned organic surfaces without per-item confirmation**, because every item still passes the in-loop gate above (brand-review + `arbor-safety` + preview). It does **not** spend money or take irreversible/legal actions unattended.

| ✅ Auto-publish (no per-item confirm) | ⛔ Hard-gated — always confirm |
| :-- | :-- |
| Organic social posts (IL-first HE/EN) to the scheduled queue | **Paid spend of any kind** (ads, creator fees) — Level 4, state amounts |
| Landing / SEO / OG / hreflang / schema fixes to the owned web surface | Clinical / diagnostic / effect-size claims (arbor-safety veto) |
| Blog / AEO guide-hub content | Real child face / voice / data as a marketing payload |
| Marketing asset production (images, video cuts) to the asset library | Brand-domain purchase, DNS, custom-domain wiring — Level 4/5 |
| Backlog writes + competitor feature-requests handed to product | App-store listing submission — Level 5 |
| | Outbound email/DM to acquired user lists (consent/anti-spam) |
| | Product-code changes (framed + handed to product pods) |
| | Any critic finding marked `riskClass:"gated"` |

> The kill-switch is the loop's scheduled-task row in [SCHEDULED-LOOPS.md](../../../../00_System/agent-framework/SCHEDULED-LOOPS.md) — pause it there to halt all autonomous publishing.

## Skills this mesh loads
| Task | Skill |
| :-- | :-- |
| Plan a campaign / content calendar | `marketing:campaign-plan`, `rubin-os:campaign-planner` |
| Draft content / posts / articles | `marketing:draft-content`, `rubin-os:content-creator` |
| Conversion copy (landing, CTA, email) | `rubin-os:copywriter`, `marketing:email-sequence` |
| SEO / AEO audit | `marketing:seo-audit` |
| Competitor brief | `marketing:competitive-brief` |
| Brand-voice review (gate) | `marketing:brand-review` |
| Funnel / performance report | `marketing:performance-report` |
| Launch / positioning / ICP | `rubin-os:gtm-strategist` |
| Market/audience research | `research-agent`, `deep-research` |
| Trend radar / social-listening | `arbor-insights` (orchestrates `research-agent` + borrows `arbor-critic-capability`) |
| Viral creative production (video/motion/design) | HeyGen MCP (talking-avatar + translation) · Canva MCP (graphics/brand-kit) · `mcp__visualize` · `anthropic-skills:canvas-design` |

## Loops it owns
| Loop | Type | Cadence | Posture | Registry |
| :-- | :-- | :-- | :-- | :-- |
| **Arbor Marketing loop** | scheduled (autonomous) | 2×/week (Tue + Fri 05:00) | Sense → file backlog → build safe materials → **publish to owned organic surfaces** → learn. Paid/claims/child-data/irreversible gated | [SCHEDULED-LOOPS.md](../../../../00_System/agent-framework/SCHEDULED-LOOPS.md) |
| Campaign / content push | on-demand | — | acts in-workspace; same autonomy envelope | — |

Workflow: [`.claude/workflows/arbor-marketing-loop.workflow.js`](../../../../.claude/workflows/arbor-marketing-loop.workflow.js) (`/arbor-marketing-loop`).

## How to invoke
- **Task:** dispatch `arbor-marketing-lead` with a goal (or a pod for a scoped piece).
- **Autonomous cycle / wave:** run the `arbor-marketing-loop` workflow.
- **Inside a product wave:** `arbor-orchestrator` dispatches `arbor-marketing-lead` as its Marketing team — this mesh is that team, now first-class.

## Boundaries
- **Marketing writes content + landing + campaign config + organic publishing — never product code.** Competitor feature-requests and loop/analytics code changes are framed and handed to the owning product pod via `arbor-orchestrator`.
- **Coordinates with, does not duplicate, ROS MKT** (`mkt-lead`): MKT owns Guy's personal brand + HollandVest; this mesh owns Arbor. Brand voice is shared up to MKT.
- Saves under `PAI/projects/parenting-os-plugin/mesh/marketing/` and `marketing/`. Landing/web surface lives in the app at `app/landing/*.html` + `app/public/marketing/`.
- Supersedes the old sub-team note `mesh/teams/marketing.md` (now a pointer).
