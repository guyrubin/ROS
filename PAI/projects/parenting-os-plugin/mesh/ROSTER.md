# Arbor Agent Mesh — Roster

**Version:** 1.1 (paths verified against the live tree 2026-06-19)
Single source of truth for ownership. Runnable defs: `.claude/agents/arbor/<id>.md`. App root: `PPPPtherapy-/PPPPtherapy-/app`.

## Conductor

| ID | Role | Owns | Escalates to |
| :-- | :-- | :-- | :-- |
| `arbor-orchestrator` | Conductor | Backlog→wave mapping, dispatch, conflict-map enforcement, green-gating, roll-up | PAI, CoS |

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
- **Escalation:** Pod → `arbor-orchestrator` → PAI (product) / CoS (portfolio). DevSecOps vetoes and Marketing budget asks route through the Orchestrator.
