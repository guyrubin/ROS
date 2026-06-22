# Arbor Agent Mesh — Roster

**Version:** 2.0 (Advisory Board + Product Council added 2026-06-21; pod paths verified against the live tree 2026-06-19)
Single source of truth for ownership. Runnable defs: `.claude/agents/arbor/<id>.md`. App root: `PPPPtherapy-/PPPPtherapy-/app`.

## Advisory Board (Tier 1 — advisory in, review out)

Sets the "worth building" + "clinically sound" bar; feeds the Product Council. Internal capability-definition function. See [teams/advisory.md](teams/advisory.md).

| ID | Role | Owns | Authority |
| :-- | :-- | :-- | :-- |
| `arbor-advisor` | Product Philosophy Adviser | The worth-building rubric (competence/order/responsibility/truth/meaning); reviews significant features | **Voice, no veto.** Back-end inspiration only — never branded/user-facing |
| `arbor-clinical-lead` | Clinical Board lead | Clinical requirements intake, soundness review, claim sign-off; coordinates the three lenses | **Veto** on clinical soundness + any developmental/medical/effect-size claim (co-held with `arbor-safety`) |
| `arbor-clinical-peds` | Developmental-pediatrics lens | Milestones, red flags, dev-score validity, escalation thresholds | Advises lead; veto routes through lead |
| `arbor-clinical-slp` | Pediatric speech-language lens | Practice Studio targets, phoneme/word accuracy, age-appropriateness | Advises lead; veto routes through lead |
| `arbor-clinical-psych` | Child-psychology lens | Behavior/emotion coaching, attachment-safe framing, parent-mediated design | Advises lead; veto routes through lead |

## Product (Tier 1 — direction in, PRDs out)

The forward product-thinking function: owns *what to build and why* + the voice-of-parent. A co-equal input to the Product Council alongside the Advisory Board. See [teams/product.md](teams/product.md).

| ID | Role | Owns | Authority |
| :-- | :-- | :-- | :-- |
| `arbor-product` | Head of Product | Discovery, PRDs, success metrics, voice-of-parent (forward user research); the `product` stream into the Council | Advisory (no veto); routes clinical-claim items to the Clinical Board |

## Conductor (Tier 1)

| ID | Role | Owns | Escalates to |
| :-- | :-- | :-- | :-- |
| `arbor-orchestrator` | Conductor | Backlog→wave mapping, dispatch, conflict-map enforcement, green-gating, roll-up | PAI, CoS |

> **Intake:** the Orchestrator builds **only** from `PRODUCT-BACKLOG.md`, which the **Product Council** ([PRODUCT-COUNCIL.md](PRODUCT-COUNCIL.md)) maintains by fusing Product + Advisory + Clinical + Marketing + CIL streams. Full company map: [COMPANY.md](COMPANY.md).

## Domain pods (Tier 2) — verified core paths under `app/src/`

| ID | Core dirs | Key files |
| :-- | :-- | :-- |
| `arbor-ai` | `ai/`, `knowledge/`, `services/` | `server/aiQuota.ts`, chat path in `lib/api.ts` |
| `arbor-avatar` | — | `components/profile/AvatarCreator.tsx`, `lib/heroCard.ts`, `lib/image.ts`, `HeroScenePlayer` + the **scene-generation pipeline** (avatar-embedded world-cards & story images, cache per avatar×scene) |
| `arbor-practice` | `practice/`, `playbank/`, `components/practice/` | `lib/faceLandmarker.ts` |
| `arbor-growth` | `growth/`, `rhythm/`, `consult/` | `lib/jitai.ts`, `lib/milestoneData.ts`, `lib/monitoring.ts`, `components/tabs/DevelopmentTab.tsx`, `components/sections/DevScoreCard.tsx`, `components/sections/Reports.tsx`, `lib/reportExport.ts`, `sharing/shares.ts` |
| `arbor-memory` | `memory/`, `families/` | `components/sections/ChildMemory.tsx` |
| `arbor-billing` | `components/billing/` | `server/billing.ts`, `server/entitlements.ts`, `hooks/useCheckout.ts`, `lib/billingTransition.ts` |
| `arbor-safety` | `safety/`, `contracts/` | `sharing/consent.ts`, `server/requireConsent.ts`, `server/redaction.ts` |
| `arbor-native` | `ios/`, `android/` | `capacitor.config.ts`, `lib/native.ts` |
| `arbor-api` | `routes/`, `config/`, `server/` (rest) | `server/createApp.ts`, middleware |
| `arbor-design` | — | `index.css`, `components/ui/kit.tsx`, `components/ui/playkit.tsx`, `tailwind.config.ts` |

## Completeness map — every top-level `src/` dir has exactly one owner

`ai`→ai · `knowledge`→ai · `services`→ai · `growth`→growth · `rhythm`→growth · `consult`→growth · `memory`→memory · `families`→memory · `safety`→safety · `contracts`→safety · `practice`→practice · `playbank`→practice · `routes`→api · `config`→api · `server`→api **except** `billing.ts`/`entitlements.ts`→billing, `aiQuota.ts`→ai, `requireConsent.ts`/`redaction.ts`→safety · `ios`/`android`→native

**Shared surfaces** (`components/`, `lib/`, `hooks/`, `context/`, `sharing/`): ownership is **by sub-path/file**, assigned to the pod whose domain the file serves (per the Key files column). Hotspot files are governed by the conflict map, not single-owned.

**Academy** (`components/tabs/HeroJourneyTab.tsx`, Hero Comics, Masterclasses, Family Formation): co-owned for the illustrated standard — **arbor-avatar** (scene/comic image generation with the avatar embedded), **arbor-content** (story copy/narration), **arbor-design** (layout). Lead = arbor-avatar for the imagery bar.

## Current north-star focus (set 2026-06-19)
The **illustrated, avatar-embedded standard** (backlog `EXECUTION-BACKLOG.md` → "🎯 NOW", items I0–I6): every world-card and story image is a rich generated scene with the child's hero composited in, character-consistent, cached, cost- and consent-gated. Spans Practice hub + Academy. Lead pod **arbor-avatar**, with arbor-design / arbor-practice / arbor-content / arbor-ai / arbor-safety. First step I0: converge the two Practice hubs (my shipped icon-tile arcade + the concurrent illustrated hub) into one.

## DevSecOps team (Tier 2 — cross-cutting, gates every ship)

| ID | Role | Scope |
| :-- | :-- | :-- |
| `arbor-devsecops-lead` | Lead | Composite ship-gate; coordinates the four specialists; veto on any ship |
| `arbor-sec` | Security | SAST, secret scan, dependency CVEs, threat model, WAF backlog, payment/auth review |
| `arbor-release` | Release/CI-CD | `cloudbuild*.yaml`, Cloud Run, Firebase Hosting, build, deploy, rollback |
| `arbor-sre` | Reliability | Telemetry, error/latency/cost, AI usage metrics, perf budgets |
| `arbor-qa` | Quality | `lint`/`test`/`check:framework`/`eval:safety` gate, coverage, flaky triage |

## Marketing team (Tier 2 — reports to PAI + ROS MKT)

| ID | Role | Scope |
| :-- | :-- | :-- |
| `arbor-marketing-lead` | Lead | Campaign orchestration, GTM, funnel ownership, budget asks (L4) |
| `arbor-content` | Content/copy | Landing (EN+HE/RTL), blog, share-card copy, lifecycle email |
| `arbor-seo` | SEO/AEO | Keyword/answer-engine optimization, technical SEO, content gaps |
| `arbor-acquisition` | Growth loops | Referral/viral loop, attribution, analytics events, paid spend (L4) |

## Rules
- **Boundary:** a pod edits only its owned paths. Cross-boundary or hotspot-locked edits (`index.css` chain `m4→m2→m1→m5→m7→p3`; `OverviewTab.tsx`, `routes/api.ts`/`lib/api.ts`, `navigation.ts`, `lib/reportExport.ts`) are sequenced by the Orchestrator per the CONFLICT-MAP.
- **Escalation:** Pod → `arbor-orchestrator` → PAI (product) / CoS (portfolio). DevSecOps vetoes, **Clinical Board soundness/claim vetoes**, and Marketing budget asks route through the Orchestrator.
- **Advisory authority:** `arbor-advisor` recommends (no veto). The Clinical Board **can block** a feature on clinical-soundness grounds or a developmental/medical claim — treated identically to an `arbor-safety` veto. The philosophy adviser's identity is back-end only and never ships (CHARTER §3 principle 11).
