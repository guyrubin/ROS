# Arbor — Deployment Waves (ship-ready now)

**Date:** 2026-06-23 · **Owner:** ros-release-lead / CoS · **For:** Guy to merge. Each wave = a branch I prep to **rebased-onto-`70a9b17` + green-gated + PR-ready**; you merge (merge-to-main = prod-promote). The deploy gate stays with you.

**Baseline:** `origin/main = 70a9b17` — all 4 redesign waves (AP-043…060) already merged. The branches below carry **unmerged value but are behind current main**, so none is a clean fast-forward — each needs a rebase + re-gate before it can ship. That prep is the work; the merge is your click.

---

## 🟢 Wave A — Safe polish + regression fixes (ship FIRST; highest value, lowest risk)
Pure improvements, bug fixes, and share surfaces. No claims, no child-data surface, no deploy-config.
- **`claude/elevation-wave-1`** (11 commits): Hebrew-default for IL parents · `dir=auto` RTL caret on free-text · Speech-Coach child-switch bug fix · optional exact DOB + optional gender in onboarding · log-a-moment CTA right-size · Story tab ordering · `--gradient-cta` token consistency (18 files) · **shareable Story-of-[Child] + milestone pride cards** (growth-loop surfaces) · framer-motion dep fix.
- **`claude/d2-comic-css`** (1 commit): restore comic-book CSS dropped from main (a real visual regression — comic cards rendering flat).
- **Gate:** safe. Prep = rebase onto `70a9b17` → resolve conflicts (likely touches redesign files: gradient-cta token, share cards, onboarding) → green-gate incl. F1–F18 floors → arbor-qa RTL/visual pass.
- **Why first:** biggest immediate UX win, lowest risk, independent of hosting config.

## 🟡 Wave B — Revenue durability
- **`claude/billing-durability`** (1 commit): make the RevenueCat webhook durable + route `/webhooks` via hosting (a real revenue-reliability fix).
- **Gate:** arbor-billing + arbor-sec sign-off (payment/webhook path) + green-gate. Rebase onto main first.

## 🟠 Wave C — Store readiness (coordinate — another session's lane)
- **`claude/mobile-store-safe-fixes`** (1 commit): policy URLs (`/privacy`,`/terms`,`/support` rewrites), Android signing, unique build numbers, iOS compliance flags.
- **Owner:** the mobile-store session — **coordinate, don't commandeer.** This is the branch that must sequence on the hosting lane (it changes `firebase.json` rewrites). Behind 25 — needs their rebase + re-gate.
- **Note:** gated behind the store-launch lock; it's the on-ramp *to* the stores.

## 🔵 Wave D — IL marketing brand elevation (gated on native review)
- **`claude/marketing-arbor-il-he`** (2 commits): disciplined palette, 2am deep hero, growth-ring motif, monoline icons, bolder type/copy.
- **Gate:** arbor-brand ECD + **native-HE reviewer publish gate** (marketing-mesh rule — transcreate, never publish un-reviewed HE). Rebase + gate.

---

## ⛔ Not shipping (stale / WIP / superseded)
`claude/hero-arcade` (dirty marketing WIP, 105 behind) · `claude/auto-wave-1/2/*`, `claude/wave0`, `exec-blueprint-wave0` (0-ahead / superseded) · `codex/arbor-v2-architecture-foundation` (278 behind, ancient) · `rel/arbor/001`, `review/rel-arbor-001-council` (already shipped) · `claude/arbor-design-sync` (claude.ai/design upload, not a prod ship).

## Merge order + lane
1. **Wave A** — independent, app-source only; prep + ship anytime.
2. **Wave C** (mobile-store) before any *other* hosting-config wave (it owns the `firebase.json` rewrites); coordinate timing with that session — never deploy two hosting waves in the same window.
3. **Wave B** — after sign-off.
4. **Wave D** — after native-HE review.

**Invariant:** never merge two waves into the same 5-min hosting-deploy window (clobber risk); each wave green-gated behind F1–F18 before its PR.

## Separately: the CI-20…42 next-level backlog
Not in these waves — it's not built yet (your build session + the Claude Design system enhancement feed it). The **NEXT-LEVEL-PLAN.md** (from the running ultra workflow) sequences that forward stream. These four waves are the *already-built* value sitting on branches.
