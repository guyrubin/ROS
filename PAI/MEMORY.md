# PAI Memory
Last updated: 2026-05-28

---

## Active ventures

### Parenting App / Arbor
- Status: **Active | Phase: Private Beta Build — Production App Running**
- Positioning: Developmental operating system for modern families
- **Live version:** `guyrubin/PPPPtherapy-` `main` branch, commit `04cc2c7` — this is the only canonical production version
- **Local clone:** `C:\Users\dguyr\ROS\PPPPtherapy-\PPPPtherapy-` on `main`, in sync with remote
- **Running:** `npm run start` from `app/` → `http://localhost:3000` (production build `dist/`)
- **AI status:** Disabled — placeholder `GEMINI_API_KEY` in `app/.env.local`; add real key to enable AI coach
- **PRD:** `PPPPtherapy-/docs/arbor-prd.md` (canonical) — also mirrored at `PAI/projects/parenting-os-plugin/prd-v1.md`
- Next: Add real GEMINI_API_KEY; decide on cloud deployment target (Railway recommended)

## Decisions

- [Decision] Arbor should start as a parent question → child memory → safety triage → practical action plan → professional handoff workflow, not as a generic chatbot or expert marketplace. | Date: 2026-05-15 | Rationale: Trust and longitudinal developmental intelligence are the core moat.

## Open questions

- [Question] Which first wedge should be tested with parents: behavior/routines, speech/language, emotional regulation, school readiness, or autism/ADHD concerns? | Blocking: PRD focus and scenario library prioritization
- [Question] Should the first beta be Netherlands-first, Israel-first, or dual-track with Israel as expert/content engine and Netherlands as institutional pilot market? | Blocking: GTM sequencing


- [Source] Updated PRD PDF found at `CoS/PRD/Claude Cowork Parenting Os Plugin.pdf` and extracted into Claude-workable markdown at `PAI/projects/parenting-os-plugin/source-prds/claude-cowork-parenting-os-plugin.md`. | Date: 2026-05-15


- [Execution] Phase 0 execution started. Created HTML roadmap dashboard plus PRD v1, data model v1, safety policy v1, scenario library v1, Netherlands GTM v1, Phase 0 execution plan, and missing templates/resources under `PAI/projects/parenting-os-plugin/`. | Date: 2026-05-15


- [Execution] Created clickable Arbor Concierge MVP prototype at `PAI/projects/parenting-os-plugin/html/arbor-concierge-mvp-prototype.html`, plus parent tester recruitment message, professional reviewer checklist, and product demo flow under `execution/`. | Date: 2026-05-15
- [Decision] PPPPtherapy/Arbor GitHub repo pre-go-live review concluded the current repo is a concept/prototype, not production-ready; recommended private beta preparation only, with narrowed non-diagnostic parent-support MVP, child-data privacy architecture, safety escalation, expert governance, and production app foundation before public launch. Report: `PAI/projects/parenting-os-plugin/execution/pppptherapy-golive-review-2026-05-22.md`. | Date: 2026-05-22
- [Execution] Enhanced `guyrubin/PPPPtherapy-` for private beta positioning: PR #2 (`codex/private-beta-product-loop`) adds a README, tightens the PRD MVP scope, replaces the static platform mockup with an intake -> safety triage -> parent plan -> approved memory -> follow-up log -> handoff product loop, adds a source-grounded developmental AI operating model for domains, age-band logic, structured AI outputs, memory rules, safety evals, and human-review gates, and now includes an interactive no-build prototype at `prototype/arbor-private-beta-app.html`. | Date: 2026-05-24
- [Execution] Refit PPPPtherapy PR #2 interactive prototype using local design source `C:\Users\dguyr\Downloads\Arbor-standalone.html`: applied Scandinavian x Amsterdam visual system, daily field notebook framing, black editorial mark, clay accent, mono nav sections, synthesis panel, quick ask block, and field-note metrics while preserving Generate Plan, developmental routing, memory, handoff, and eval interactions. | Date: 2026-05-24
- [Coordination] Created and corrected Arbor surface coordination note at `PAI/projects/parenting-os-plugin/execution/arbor-surface-coordination-2026-05-24.md`. Public GitHub API verification shows PR #1, PR #2, and PR #3 are merged into `guyrubin/PPPPtherapy-` main, which now contains README, docs, mockups, and prototype. AI Studio export `C:\Users\dguyr\Downloads\arbor.zip` was inspected and assessed at `PAI/projects/parenting-os-plugin/execution/ai-studio-export-assessment-2026-05-24.md` as a candidate React/Gemini app foundation requiring safety/design hardening before GitHub import. Local FORMATION/pernenting platform path still not found. | Date: 2026-05-24
- [Execution] Opened PPPPtherapy PR #4 (`codex/import-ai-studio-app`) to import the AI Studio React/Vite/Express/Gemini app under `app/` with non-diagnostic developmental AI contract, structured coach output, escalation screening, Arbor field-notebook design tokens, app setup docs, and safety-copy eval. Verified `npm.cmd run lint`, `npm.cmd run build`, `npm.cmd run eval:safety`, and local DOM render at `http://localhost:3000`. PR URL: `https://github.com/guyrubin/PPPPtherapy-/pull/4`. | Date: 2026-05-24
- [Execution] Addressed Claude feedback on PPPPtherapy PR #4 before merge: added required Six Frames `frameRouting` to the coach schema/rendering, added append-only local memory review ledger with pending/approved/rejected/deleted states, added `GET /api/memory/:childId` and `PATCH /api/memory/:memoryId`, added parent approval queue UI, extended safety eval structural checks, verified lint/build/eval/diff-check plus memory API transition smoke test, pushed commit `85e214a`, and merged PR #4 into `main` with merge commit `fb1e11e`. | Date: 2026-05-25
- [Execution] Opened PPPPtherapy PR #5 (`codex/arbor-hardening-followups`) for Claude's next escalation: unified Arbor framework taxonomy via `app/src/framework.json`, added category-based Hebrew/caregiver safety screening, switched `/api/chat` to Gemini streaming with SSE + client abort, and added Express hardening (`helmet`, CORS allow-listing, `/api` rate limiting, `PORT`). Verified lint, framework check, safety eval, build, and runtime SSE/CORS smoke test. PR URL: `https://github.com/guyrubin/PPPPtherapy-/pull/5`. | Date: 2026-05-25
- [Execution] Started PPPPtherapy issue #6 Arbor v2 architecture execution on branch `codex/arbor-v2-architecture-foundation`: modularized Express backend, added typed production config, Vertex/Gemini model provider router, Firestore/local memory adapters, Zod coach validation, AI Wiki markdown retrieval with source cards, architecture/compliance docs, Firebase/Cloud Run deployment scaffold, Firestore rules/indexes, CI quality gates, and seed Git-backed knowledge cards. Verified `npm.cmd run lint`, `npm.cmd run check:framework`, `npm.cmd run eval:safety`, `npm.cmd run build`, plus built-server `/api/architecture/status` and urgent safety escalation smoke tests. | Date: 2026-05-26
- [Execution] Added F-07 ADR anchor set to PPPPtherapy branch `codex/arbor-v2-architecture-foundation` under `docs/adr/`: Vertex AI on GCP, Firestore app data, Git-backed AI Wiki, and Claude-primary model routing. | Date: 2026-05-26
- [Execution] Addressed Claude PR-V2 follow-ups on PPPPtherapy branch `codex/arbor-v2-architecture-foundation`: wired Claude-on-Vertex as `/api/chat` route default via `claude-3-5-sonnet@anthropic` shorthand and Anthropic Vertex request shape, kept Gemini Vertex routes for story/analysis/handoff, packaged `knowledge/` into the production image, added knowledge card startup logging and `/api/architecture/knowledge`, added Vitest unit tests for router/memory/Zod/safety/knowledge plus emulator-gated Firestore rules tests, added `npm test` to CI, and added Firestore family/member/child onboarding plus child-existence assertion before memory event writes. Verified lint, test, safety eval, framework check, build, and built-server status/knowledge smoke tests. | Date: 2026-05-26
- [Execution] Built and ran Arbor production app locally for the first time. Pulled `main` (PR #4 merged), ran `npm install`, created `app/.env.local` with placeholder GEMINI key, ran `npm run build` (Vite + esbuild production bundle), ran `npm run start` → `http://localhost:3000` serving HTTP 200 with versioned assets. `.claude/launch.json` configured at ROS root for `arbor-dev` and `arbor-prod`. | Date: 2026-05-28
- [Execution] Added 10 scholar-grounded developmental routine action plans to the production app. Committed as `04cc2c7` on `guyrubin/PPPPtherapy-` main. Plans cover: Preschool Transition (Bowlby·Winnicott), Sleep & Bedtime (Bowlby·Winnicott), Morning Breakfast (Montessori·Piaget), Family Mealtime (Bronfenbrenner·Montessori), Emotional Regulation Toolkit (Bowlby·Vygotsky), Screen Time Limits (Piaget·Winnicott), Daily Reading & Language (Vygotsky·Piaget), Physical Play & Movement (Piaget·Bronfenbrenner), Responsibility & Chores (Montessori·Bronfenbrenner), Evening Wind-Down (Bowlby·Winnicott). PRD updated with Developmental Routine Library spec. Each plan has 3 phases, parent scripts with say/avoid, and success indicators. TypeScript lint clean. Production rebuild confirmed. | Date: 2026-05-28
