# Arbor Agent Mesh — Memory

**Active facts only.** Stale detail → `archive.md` when this grows.

## Update [2026-06-21] — Marketing Registration-Engine wave PLANNED, BLOCKED on Bash/git sandbox
- **Target:** P0 wave of `marketing/arbor-marketing-backlog-v2.md` on the live app (`PPPPtherapy-/PPPPtherapy-/app`): P0-2 referral reward grant (activation-triggered), P0-3 branded share export + `/join?ref=` deep-link, no-card double-aha onboarding (re-sequenced per adversarial fix #2), P0-7 founding-member paywall (€89/500-slot/trial A/B, value-peak trigger, 50-review price gate), K-factor instrumentation, day -3 loop smoke test.
- **Recon DONE (read-only):** substrate is far more complete than greenfield. Confirmed present & ready to EXTEND (not duplicate): `lib/loopEvents.ts` (frozen event names; comments already name mk-p0-2/mk-p0-3 as owners), `lib/attribution.ts` (`?ref=`/`?referral=` first-touch capture, no `/join` route yet), `lib/analytics.ts` (Firestore sink). Entitlements seam billing-agnostic (`server/entitlements.ts` — write `{plan}` to `entitlements/{uid}`); RevenueCat webhook the sole writer (`server/billing.ts`). Comic gen LIVE (`api.generateComic`→`/api/generate-comic`, Gemini). `heroCard.ts` renders 1080×1350 canvas PNG but OFF-spec colors + NO referral deep-link + no 1080×1080/9:16. Paywall generic (`PaywallModal`, fires on 402 only; no founding/counter/trial-AB/value-peak). Onboarding Google-only (no Apple one-tap), two-field capture exists (`OnboardingFlow`). Coach Read/Risk/Do-tonight LIVE (`CoachAnswerCards`). Rhythm cold-start "still learning" state EXISTS (`RhythmStrip`). DailyPlay works on age band (`DailyPlayCard`). 52 test files, vitest. **Gaps to build:** referral-code generation, `/join?ref=` resolver route, activation-event reward grant, branded share export w/ deep-link + copy-link fallback, Apple one-tap, re-sequenced funnel, founding paywall.
- **App is a NESTED git repo** (`PPPPtherapy-/PPPPtherapy-/.git`), separate from ROS root. A stale `.arbor-build` dir points into `…/.git/worktrees/-arbor-build` but is NOT a registered worktree.
- **BLOCKER (hard):** Bash/git execution is **sandbox-denied** this session — for me AND for pods (probed `arbor-release`: all git denied; even `node --version` denied). Cannot: create the isolated worktree, commit, run the green-gate (`npm run lint`/`test`/`check:framework`/`eval:safety`), or `npm run build`. Per charter §3.2 (green-gate or no ship) + orchestrator hard rule (never ship past an unverified gate), I did NOT dispatch blind code writes into the shared working tree (would also race concurrent agents + skip mandated worktree isolation). **Wave fully planned, not executed.** Needs Guy to grant Bash/git on the app repo (or run the gate manually) before the build can proceed.

## Update [2026-06-21] — Continuous Improvement Loop (CIL) added (autonomous eval half)
- Built the **evaluation half** of the mesh so Arbor self-improves: a critic panel (`arbor-critic-ia/-language/-bugs/-capability/-market` + DevSecOps audit) → `arbor-evaluator` dedupes/scores/**adversarially verifies** → writes `improvement/IMPROVEMENT-BACKLOG.md` → `arbor-orchestrator` builds top `safe` items **to green on a branch** → critics **re-confirm** the fix.
- **Autonomy (Guy, 2026-06-21):** find + fix-to-green-on-branch autonomously; **merge + deploy stay human**. Safety/consent/billing/image-gen-cost/child-data findings are filed `gated` and never auto-built.
- **Cadence:** nightly `mode:"eval"` (refresh scored backlog, catch regressions) + weekly `mode:"build"` (build wave). Driver: workflow `.claude/workflows/arbor-improve.workflow.js` (skill `/arbor-improve`). Scheduled crons are **specced but not live** until Guy confirms (SCHEDULED-LOOPS.md).
- Docs: `mesh/improvement/` (CIL.md, CRITICS.md, IMPROVEMENT-BACKLOG.md). CHARTER §3.6 updated — CIL is the sanctioned autonomous opt-in. **No live run yet.**
- **v1.1 smartness+efficiency upgrade:** panel is now **7 lenses** — added `arbor-critic-ux` (visual/interaction design, looks at rendered pixels via impeccable/design-critique/a11y) and `arbor-critic-feedback` (reviews/support/Amplitude-Pendo analytics → findings + usage weight map); gave `arbor-critic-ia`+`-ux` the **preview tools so they SEE the app**, not infer from source; capability lens now does **SMART feature analysis fused with cited market evidence**. Added CRITICS §0 smartness bar + §6 evaluator **synthesis** (themes not nits, capability×market×feedback theses, "State of the app", cap queue). Efficiency: **diff-aware nightly + 1 rotating deep lens** (`args.focus`) / full deep weekly, per-agent effort tiers, stop-early-when-clean.
- ⚠️ **Running the loop is currently sandbox-blocked** (see the marketing-wave note: Bash/git/npm denied for pods this session). `eval` mode needs preview/npm; `build` mode needs git/npm — both need the sandbox/permission fix before a live run.

## Update [2026-06-19] — Hero Arcade SHIPPED TO PROD + new north star
- **Hero Arcade deployed to production** (https://arborprd-westeu.web.app). Built from `claude/hero-arcade` (= exec-blueprint-wave0 + 5 arcade commits), prod Firebase web config pulled via authed CLI (`firebase apps:sdkconfig WEB --project arborprd-westeu`), `firebase deploy --only hosting`. Branch pushed to `origin/claude/hero-arcade` (GitHub guyrubin/PPPPtherapy-). Guy authorized "deploy all" (no customers yet).
- **NEW NORTH STAR (Guy, the screenshot bar):** the **illustrated, avatar-embedded standard** — rich generated scenes with the child's hero composited into every world-card AND Academy story image (character-consistent, cached, cost+consent-gated), comic SFX, hero banner (level/power/friends meter). Captured as backlog "🎯 NOW" items I0–I6. Lead pod = **arbor-avatar** (scope expanded: scene-gen pipeline + HeroScenePlayer + Academy imagery); Academy co-owned avatar+content+design.
- **Reconcile note:** my shipped arcade uses lucide-icon tiles; the concurrent agent's Practice hub is the illustrated bar. I0 = converge to ONE arcade. Don't ship two.

## Update [2026-06-19] — Accuracy pass (ROSTER v1.1)
- Verified every owned path against the live tree. Fixes: memory component is `components/sections/ChildMemory.tsx` (not MemoryCards); all other asserted paths confirmed to exist.
- Closed ownership gaps so **every top-level `src/` dir has exactly one owner**: `knowledge`+`services`→ai, `rhythm`+`consult`→growth, `families`→memory, `contracts`→safety, `playbank`→practice, `routes`+`config`→api. Shared dirs (components/lib/hooks/context/sharing) owned by sub-path; hotspots by the conflict map.
- No pods added/removed — kept the requested shape (orchestrator + 10 domains + DevSecOps team + Marketing team).

## State [2026-06-19] — Mesh scaffolded

- The Arbor Agent Mesh was designed and scaffolded: 1 Orchestrator + 10 domain pods + 5-role DevSecOps team + 4-role Marketing team.
- Substrate built **both layers**: governance/persona docs under `PAI/projects/parenting-os-plugin/mesh/` + runnable Claude Code subagents under `.claude/agents/arbor/` + a workflow harness at `.claude/workflows/arbor-mesh.workflow.js`.
- Drive mode: **on-demand, orchestrator-dispatched** (no autonomous or scheduled runs yet — opt-in gated by CHARTER §3.6).
- Wired into ROS: routing entry added; PAI = product owner, CoS = portfolio/green-gate sign-off.
- **No live run has occurred yet.** Awaiting human go to dispatch the first wave/loop.

## App facts the Mesh relies on
- Live app: `PPPPtherapy-/PPPPtherapy-/app` (React 19 + Vite + Express + Capacitor; Firestore/Vertex; Vitest 345+ tests).
- Green-gate: `npm run lint && npm test && npm run check:framework && npm run eval:safety`.
- Hotspot lock — `index.css` serial chain: `m4 → m2 → m1 → m5 → m7 → p3`. Other serial files: `OverviewTab.tsx`, `api.ts`, `navigation.ts`, `reportExport.ts`.
- Isolated-build pattern: worktree `.arbor-build`, branch `claude/exec-build`; coexists with concurrent codex agent.

## Open / blocked
- First-wave target not yet chosen (PAI to set priority).
- Child-ASR vendor + Firebase Storage decisions remain Guy-gated (see PAI/MEMORY arbor-avatar-image-gen, arbor-native-and-playkit).

## Pointers
- Charter: [CHARTER.md](CHARTER.md) · Loop: [DEV-LOOP.md](DEV-LOOP.md) · Roster: [ROSTER.md](ROSTER.md) · Orchestrator: [ORCHESTRATOR.md](ORCHESTRATOR.md)
- Teams: [teams/devsecops.md](teams/devsecops.md) · [teams/marketing.md](teams/marketing.md)
