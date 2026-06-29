---
type: backlog
title: ROS Code Optimization Backlog v3
description: Centralized code-efficiency backlog for the ROS repository and embedded Arbor/ROS interface code surfaces.
---

# ROS Code Optimization Backlog v3

**Date:** 2026-06-29  
**Owner:** CoS + Hermes/Codex execution lanes  
**Source:** Efficient repo-wide scan of `/home/guyru/ROS` using ponytail/full constraints: deterministic collector, generated/dependency folders excluded, one synthesis pass.  
**Scope:** ROS repository code and code-like artifacts, including `Arbor/app`, `CoS/projects/ros-interface-v4`, `.claude` automation/hooks, Notion scripts, graph output, and duplicated/generated app mirrors.

## Scan evidence

- Scan completed in ~34s over **2,489 files / 408 dirs**.
- Excluded heavy/generated/dependency dirs: `.git`, `node_modules`, `.venv`, `venv`, `dist`, `build`, `.next`, `.cache`, `__pycache__`, `.turbo`, `coverage`, `.workspace`, `ios`, `android`.
- `pygount` was not installed, so line metrics came from a deterministic Python collector.
- Git state during scan: `main...origin/main` with many unrelated dirty Claude/Codex changes; this backlog must not assume a clean worktree.
- Last committed baseline before this file: `6a7eaa1 [hermes] add ponytail efficiency constraint to ROS backlog`.

## Size / complexity hotspots

- `Arbor/app` — ~110 MB, 844 scanned files.
- `Arbor/.arbor-build-i18n` — ~105 MB, 649 scanned files; appears to duplicate generated/build app content.
- `KK/personal` — ~12.4 MB, mostly document packs rather than code.
- `.claude/worktrees` — ~6.2 MB duplicated agent worktree content.
- `graphify-out/graph.json` + `graphify-out/graph.html` — ~3.8 MB generated graph output.
- Code-like volume: ~74k `.ts`, ~64k `.tsx`, ~66k `.js`, ~46k `.html`, ~2.6k `.py`, ~75k `.md` lines.

## Central backlog lanes

### RCO3-01 — Generated/build artifact separation
**Priority:** P0  
**Tier:** A for audit; C before deletion  
**Evidence:** `Arbor/.arbor-build-i18n` (~105 MB), `graphify-out/*`, duplicated `dist`/public marketing copies, generated React/vendor bundles under `Arbor/app/ds-bundle/`.  
**Problem:** Generated/build artifacts are mixed into the ROS working tree and scans, creating slow inspections, noisy diffs, and false optimization targets.  
**Next action:** Create a generated-artifact manifest: keep/source vs generated/cache vs safe-to-ignore; update `.gitignore` only after confirming what is intentionally versioned.  
**Acceptance:** `git status` and repo scans stop surfacing generated mirrors as primary work; no source artifact is lost.

### RCO3-02 — Arbor source-of-truth deduplication
**Priority:** P0  
**Tier:** C before destructive cleanup  
**Evidence:** Repeated hotspots in both `Arbor/app/src/...` and `Arbor/.arbor-build-i18n/app/src/...`; earlier backlog also flags stale `.workspace` clone retirement.  
**Problem:** Multiple app mirrors make code review and optimization ambiguous; agents can edit the wrong tree.  
**Next action:** Declare the authoritative Arbor source tree in ROS docs and add a guardrail note for agents; only then remove/ignore stale generated mirrors.  
**Acceptance:** One authoritative app path is named; duplicate mirrors are either ignored, generated, or deleted with git-safe evidence.

### RCO3-03 — TypeScript hotspot decomposition
**Priority:** P1  
**Tier:** B  
**Evidence:** Large files: `Arbor/app/src/lib/i18n.ts` (~2,905 lines), `routes/api.ts` (~2,032), `playbank/content.ts` (~1,392), `context/ArborContext.tsx` (~1,124), `CoachTab.tsx` (~831), `OnboardingFlow.tsx` (~787).  
**Problem:** Oversized modules slow agent comprehension and increase regression risk.  
**Next action:** Split only by stable seams: i18n data vs loader, API route groups, context provider vs reducers/selectors, content packs vs selectors.  
**Acceptance:** Each split keeps tests/build green and reduces the largest source files below ~700 lines without broad rewrites.

### RCO3-04 — Type-safety tightening without rewrite
**Priority:** P1  
**Tier:** A/B by file  
**Evidence:** Hotspot scan flags broad `any` use across `i18n.ts`, `routes/api.ts`, `ArborContext.tsx`, `CoachTab.tsx`, `OnboardingFlow.tsx`, `practice/signals.ts`, `modelRouter.ts`, `billing.ts`, and related files.  
**Problem:** `any` weakens safety in exactly the large modules where agents are likely to make mistakes.  
**Next action:** Add narrow boundary types and Zod-derived DTOs only at API/AI/billing/storage boundaries; avoid cosmetic mass typing.  
**Acceptance:** TypeScript `npm run lint` remains green and high-risk boundary files lose the highest-value `any` usage first.

### RCO3-05 — Test/build command normalization
**Priority:** P1  
**Tier:** A  
**Evidence:** `Arbor/app/package.json` has `lint`, `test`, `build`, `check:framework`, `check:floors`; `CoS/projects/ros-interface-v4/package.json` has build only and no test/lint script.  
**Problem:** Agents do not have one predictable verification ladder for code changes across ROS app surfaces.  
**Next action:** Document the minimal verification ladder per code surface; add missing `lint`/`test` scripts only where they are real and fast.  
**Acceptance:** Each code lane has a known command: quick typecheck, targeted test, full build.

### RCO3-06 — TODO/noise triage
**Priority:** P2  
**Tier:** A  
**Evidence:** TODOs in vendor/generated bundles dominate counts (`_vendor/react.js`, `_ds_bundle.js`); real app TODOs appear in `HeroComicsTab.tsx`, `PlanKanban.tsx`, `ArborContext.tsx`, `types.ts`, and tests.  
**Problem:** Vendor/generated TODOs hide actionable source TODOs.  
**Next action:** Exclude generated/vendor bundles from TODO scans and promote real source TODOs into domain backlog items only when tied to a failing user flow or quality gate.  
**Acceptance:** TODO reports separate generated noise from source TODOs.

### RCO3-07 — Python utility hardening
**Priority:** P2  
**Tier:** A  
**Evidence:** Python code is small (~12 files / ~2.6k lines); `CoS/projects/notion_import/deploy_walls_roadmap_to_notion.py` is the main flagged script with TODO markers.  
**Problem:** Operational scripts are useful but not consistently packaged, typed, or tested.  
**Next action:** Add lightweight `--dry-run`, input validation, and output summary conventions to Notion/import scripts before adding more scripts.  
**Acceptance:** Scripts can run read-only first and report intended writes.

### RCO3-08 — Secret and local-env hygiene
**Priority:** P0  
**Tier:** C  
**Evidence:** Scan saw `00_System/secrets/keys.env` and `Arbor/app/.env.local` in the working tree; prior backlog also flags plaintext z.ai key rotation.  
**Problem:** Secret-like files in the repo tree create accidental commit and agent-ingestion risk.  
**Next action:** Verify tracked/untracked status, rotate exposed keys if needed, move durable secret handling guidance into the secrets policy, and ensure ignore rules cover local env files.  
**Acceptance:** `git status --short` never shows secret files as candidates for commit; any exposed key is rotated.

### RCO3-09 — Agent worktree hygiene
**Priority:** P1  
**Tier:** C before deletion  
**Evidence:** `.claude/worktrees` contributes duplicated files and stale scan results; existing backlog flags `.workspace/PPPPtherapy-` retirement.  
**Problem:** Agent worktrees pollute whole-repo optimization scans and can mislead agents into editing stale copies.  
**Next action:** Create a tiny active-worktree registry or cleanup rule: active owner, source branch, expiry, safe delete condition.  
**Acceptance:** Repo scans can exclude stale agent worktrees without losing active work.

### RCO3-10 — Graph/output regeneration boundary
**Priority:** P2  
**Tier:** A  
**Evidence:** `graphify-out/graph.json`, `graph.html`, and cache files are large generated outputs.  
**Problem:** Generated graph artifacts are valuable for visualization but expensive/noisy as normal source context.  
**Next action:** Document regeneration command and decide which outputs are committed vs local cache.  
**Acceptance:** Graph files are reproducible from source or explicitly retained as release artifacts.

## Execution order

1. **Safety first:** RCO3-08 secret/env hygiene.
2. **Source-of-truth first:** RCO3-01 + RCO3-02 generated/build separation and Arbor path authority.
3. **Verification ladder:** RCO3-05 so later code changes have cheap checks.
4. **Targeted refactors:** RCO3-03 + RCO3-04 on the largest Arbor files, one seam at a time.
5. **Noise reduction:** RCO3-06, RCO3-09, RCO3-10.
6. **Operational script quality:** RCO3-07.

## Ponytail constraints for execution

- Do not create a second backlog for the same problem; append deltas here or link domain-specific work back to this file.
- Prefer scan scripts and diffs over manual browsing.
- No broad rewrites: one seam, one verification command, one commit.
- Do not delete generated/stale files until their source-of-truth and tracked/untracked status are proven.
- Keep validation floors: typecheck/test/build for app code, dry-run for operational scripts, git status before commit.
