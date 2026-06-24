# DEVSECOPS-COORDINATION — Mobile Wave 1 vs Concurrent Redesign

**Date:** 2026-06-23 · **Owner:** arbor-devsecops-lead · **Repo:** `PPPPtherapy-/PPPPtherapy-` (nested git; remote `guyrubin/PPPPtherapy-`)
**Scope:** Land `claude/mobile-store-safe-fixes` safely while the redesign session holds a dirty `claude/hero-arcade` checkout. Read-only inspection only — nothing pushed/merged/deployed in producing this plan.
**Companion docs:** `arbor-mobile-store-publishing-goal-2026-06-23.md` · `SUBMISSION-READINESS.md` · `M3-listing-metadata.md`

---

## 0. DEPLOY MODEL (the load-bearing fact)

`merge to main = a prod deploy.` CI (`.github/workflows/arbor-deploy.yml`) auto-deploys on push/merge to `main` → API Cloud Run + **Firebase Hosting** (whole-client republish) + Firestore rules. Rollback = `git revert` on `main` (re-triggers a clean deploy). Hand-deploy is forbidden. Therefore every merge below is a **Level-3 Guy "deploy clear" gate**, not a routine merge.

---

## 1. MERGE-READINESS — `claude/mobile-store-safe-fixes`

**VERDICT: GREEN / MERGE-READY (gated on Guy "deploy clear" + a deploy-window lock with the redesign session).**

Evidence (read-only, 2026-06-23):

| Check | Result | Evidence |
| :-- | :-- | :-- |
| Rebases clean on current `origin/main` | ✅ **Fast-forward, zero divergence** | `merge-base(origin/main, branch)` = `253da27` = **current `origin/main` HEAD**. No commits on `origin/main` since the branch base; no rebase actually needed. |
| Branch HEAD pushed | ✅ | `origin/claude/mobile-store-safe-fixes` = `3f9a1dd`. |
| Touches only config/CI/hosting | ✅ | 6 files, +121/−4: `.github/workflows/android.yml`, `.github/workflows/ios.yml`, `app/android/app/build.gradle`, `app/ios/App/App/Info.plist`, `app/public/support.html` (new), `firebase.json`. **Zero `app/src/**` web-UI source.** |
| No overlap with redesign dirty set | ✅ **Empty intersection** | `comm -12` of the 6 branch files vs the redesign's 100 dirty paths = empty. |
| `firebase.json` collision (the one shared hosting-config file) | ✅ **No collision** | Redesign session does **not** touch `firebase.json` / `.firebaserc`. Branch's only `firebase.json` change = 3 added lines (rewrites `/privacy`→`/privacy.html`, `/terms`, `/support` above the SPA catch-all). |
| AP-061..064 hot files clean | ✅ | `billing/PaywallModal.tsx`, `layout/SettingsModal.tsx`, `hooks/useCheckout.ts` are **not** in the redesign dirty set right now. |

**The one residual risk is NOT a file conflict — it is a hosting-deploy-ordering race.** Both `claude/mobile-store-safe-fixes` (on merge) and the redesign (on its eventual merge) republish the **same Firebase Hosting target** with the **whole `dist/` build**. A prior incident already proved concurrent hosting deploys clobber each other. Disjoint source files do not prevent this — the clobber is at the *deploy artifact* level, not the *git merge* level. So the gate is a **serialized deploy window**, not a conflict resolution.

---

## 2. MERGE / DEPLOY COORDINATION PLAN (safe landing sequence)

### Deploy-clear conditions (ALL must hold before Guy gives "deploy clear")
1. The redesign session is **not mid-deploy** and has **no hosting deploy in flight** (no open `arbor-deploy.yml` run on `main`).
2. The redesign session has **acknowledged the lock** (see §4) — i.e. it agrees not to merge to `main` during the mobile deploy window.
3. `origin/main` is still at `253da27` (or, if it advanced, re-run the readiness check in §1 — the branch must still fast-forward / rebase clean).

### Exact sequence (serialized, single deploy in the window)
```
1. Acquire merge-lane lock (§4): post in MERGE-LANE; redesign acks "hold".
2. Re-fetch + re-verify (read-only):
   git fetch origin
   git merge-base origin/main origin/claude/mobile-store-safe-fixes   # must == origin/main HEAD
   # if origin/main advanced and no longer fast-forwards:
   #   rebase the branch:  git checkout claude/mobile-store-safe-fixes
   #                       git rebase origin/main   (expect zero conflicts — files are config-only & disjoint)
   #                       git push --force-with-lease
   #   then re-run the §1 intersection check against the redesign dirty set.
3. >>> GUY "DEPLOY CLEAR" GATE (Level 3) <<<  — explicit confirm to merge = deploy.
4. Open PR by URL (gh not installed):
   https://github.com/guyrubin/PPPPtherapy-/pull/new/claude/mobile-store-safe-fixes
   Merge to main (squash). This triggers arbor-deploy.yml.
5. Watch the single deploy run to green. No other merge to main until it completes.
6. POST-DEPLOY SMOKE TEST (see below) — must pass before releasing the lock.
7. Release the merge-lane lock; redesign session may resume its merge lane.
```

### Post-deploy smoke test (the whole point of this branch)
Verify the declared store URLs now resolve to the policy pages, **not** the SPA shell (incognito / curl, follow redirects):
- `https://arborparentingapp.com/privacy`  → serves `privacy.html` (policy text, not the app)
- `https://arborparentingapp.com/terms`    → serves `terms.html`
- `https://arborparentingapp.com/support`  → serves the new `support.html`
- Regression: app root `/` still loads the SPA; deep links still work (rewrites are ABOVE the catch-all but must not shadow real routes).
- CI sanity: confirm `android.yml` / `ios.yml` still build green (signing steps are no-op without G-B secrets, so green compile is preserved).

If any URL still serves `index.html` → the rewrite ordering regressed → **do not enter these URLs in the store consoles**; fix and re-deploy.

### Rollback
- Hosting/config regression → `git revert <merge-commit>` on `main` → push → `arbor-deploy.yml` republishes the prior good build. (Same gated window discipline applies to the revert deploy.)
- The branch is additive/config-only, so blast radius is low: worst case is the 3 rewrites or the support page; revert restores the exact prior hosting state.

### What needs Guy's confirmation (explicit)
- **The merge itself** (= the prod deploy). Level 3. Nothing in this branch ships without it.
- That confirmation should be given **only inside a coordinated deploy window** where the redesign session is holding (§4).

---

## 3. SEQUENCING PLAN — AP-061..064 (shared-code reject-blockers)

These four live in the web-app codebase the **redesign session owns**. They are the true critical path to first submission (R3/R4/R5/R6 in SUBMISSION-READINESS).

| id | maps to | hot files (verified paths) | sev |
| :-- | :-- | :-- | :-- |
| **AP-061** in-app privacy link | R3 | `layout/SettingsModal.tsx` (+ consent/account-creation surface) | reject |
| **AP-062** native IAP (RevenueCat) | R4 | `billing/PaywallModal.tsx`, `hooks/useCheckout.ts`, deps, `runtime.isNativePlatform` branch | **reject (highest sev)** |
| **AP-063** parental gate | R5 | `billing/PaywallModal.tsx`, `BehaviorsTab.tsx`, `reportExport.ts` (+ new gate component) | reject |
| **AP-064** account deletion | R6 | `layout/SettingsModal.tsx`, `childData.ts`, server delete path, web deletion route | reject |

### Recommendation: build them IN the redesign/product session's own lane (do NOT open a parallel mobile-track branch on these files)
Rationale: the redesign session is actively editing `app/src/**` (100 dirty files). A second session editing `PaywallModal.tsx` / `SettingsModal.tsx` in parallel guarantees merge conflicts and clobber risk. The mobile track owns the **store-readiness verification + green-gate**, not the web-app edits. So: **arbor-native + arbor-release pair with the redesign/product session; the redesign session's files, the redesign session's commits.** The mobile track supplies the spec (RevenueCat wiring per R4, gate component per R5, deletion loop per R6) and runs the ship-gate.

### File-conflict serialization (the two collision pairs — arbor-pm's note, confirmed)
Two files are each touched by two tickets. **Serialize within each pair — never build the pair concurrently:**
- **`billing/PaywallModal.tsx`:** AP-062 (IAP) **then** AP-063 (parental gate). Build IAP first; the parental gate wraps `startCheckout` which AP-062 reshapes — gate-after-IAP avoids a re-wrap.
- **`layout/SettingsModal.tsx`:** AP-061 (privacy link) **then** AP-064 (account deletion). Privacy link is a small additive row; deletion adds a larger destructive flow — small-first reduces rebase pain on the bigger change.

### Build order (overall)
```
AP-062 (native IAP, highest sev)  ─┐  PaywallModal lane: 062 → 063
AP-063 (parental gate)            ─┘
AP-061 (privacy link)             ─┐  SettingsModal lane: 061 → 064
AP-064 (account deletion)         ─┘
```
The two lanes (Paywall vs Settings) are file-disjoint and may run in parallel **with each other**; the serialization is strictly *within* each lane. AP-062 first overall per arbor-pm (highest rejection risk).

### Green-gate each must pass (composite ship-gate)
```bash
cd app && npm run lint && npm test && npm run check:framework && npm run eval:safety
```
Plus specialist sign-off, ticket-specific:
- **AP-062 (IAP):** **arbor-sec** (payment/auth review — RevenueCat keys, no secret in client bundle, entitlement webhook integrity) + **arbor-billing** (entitlement parity web↔native) + **arbor-safety** (no child-facing purchase path). arbor-sec veto blocks.
- **AP-063 (parental gate):** **arbor-safety** (Kids/Families gate soundness — gate is not trivially bypassable by a child) — veto holder.
- **AP-061 (privacy link):** **arbor-safety** (link resolves to the live policy from §2 deploy; consent-surface coverage).
- **AP-064 (account deletion):** **arbor-safety** (GDPR/COPPA full-erase incl. Auth user + entitlements + receipt path) + **arbor-sec** (auth-user deletion can't be triggered cross-account). arbor-safety veto blocks.
Each lands on its own branch off current `origin/main`, gated to merge = deploy (same §2 window discipline).

---

## 4. MERGE-LANE LOCK / HOT-FILE OWNERSHIP

**One deploy at a time to `main`.** Whoever holds the lock owns the next hosting deploy; the other session holds. Record holder + window in this section (or a shared MERGE-LANE note) before any merge.

| Surface / hot files | Owner this cycle | Notes |
| :-- | :-- | :-- |
| `firebase.json`, `.github/workflows/*.yml`, `app/android/**`, `app/ios/**`, `app/public/support.html`, `app/MOBILE.md` | **mobile track (this session)** | The 6 safe-fix files. Redesign must not touch these. |
| `app/src/**` (all UI), `app/public/marketing/**`, `app/src/index.css`, `cloudbuild.prod.yaml`, `app/public/sw.js` | **redesign session** | 100 dirty files. Mobile track must not touch these. |
| `billing/PaywallModal.tsx`, `layout/SettingsModal.tsx`, `hooks/useCheckout.ts`, `childData.ts`, `BehaviorsTab.tsx`, `reportExport.ts` | **redesign/product session** (AP-061..064 built here) | Currently clean. Serialize per §3 pairs. |
| **Firebase Hosting deploy target** (shared, whole-client republish) | **lock-holder only** | The actual clobber surface. Disjoint files do NOT make concurrent deploys safe. |

**`cloudbuild.prod.yaml` flag:** it is **dirty in the redesign session** and is the file the **M8 prod API redeploy** touches. Do **not** schedule the M8 Cloud Run redeploy until the redesign session's `cloudbuild.prod.yaml` state is reconciled — otherwise the M8 deploy ships the redesign's uncommitted build config or stomps it. M8 is Level-3 gated regardless; this just adds a sequencing dependency: **M8 redeploy waits on the redesign session committing/landing its `cloudbuild.prod.yaml`.**

---

## MEMORY ENTRY

**Gate:** `claude/mobile-store-safe-fixes` merge-readiness — **PASS (conditional).** Branch fast-forwards on `origin/main` (`253da27`, zero divergence), 6 config/CI/hosting files (+121/−4), zero web-UI source, **zero overlap** with the redesign session's 100-file dirty set, no `firebase.json` collision. Not a git-conflict risk. **Residual risk = Firebase Hosting deploy-ordering race** (shared deploy target, prior clobber incident) → mitigation = serialized deploy window + merge-lane lock + Guy "deploy clear" (merge = prod deploy, Level 3). AP-061..064 sequenced into the redesign session's own lane (062→063 on PaywallModal; 061→064 on SettingsModal; 062 first overall). `cloudbuild.prod.yaml` dirty in redesign → M8 redeploy gated on its reconciliation. No veto.
