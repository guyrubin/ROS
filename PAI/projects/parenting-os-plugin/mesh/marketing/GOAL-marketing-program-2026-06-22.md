# GOAL — Arbor Marketing Program: Execute & Verify (2026-06-22)

**Owner:** `arbor-marketing-lead` · **Verifier:** multi-agent audit (this doc records the result) · **Reports to:** PAI + Guy.
**What this is:** the single execute-and-verify goal for the seven marketing assignments built this session. Each objective has a verification verdict; the open items name the owner + the gate. Verification ran as a 5-agent workflow (3 transcreations + deploy-pipeline map + 7-objective audit) on 2026-06-22.

> **Audit verdict: STRONG PASS on all 7 objectives** — the work is real, coherent, and honest; deployment-gates are held (no over-claims). The only debt found was cosmetic stale-frame strings (now fixed) + a date back-reference inconsistency. Below: status + what remains.

---

## The seven objectives — status & verification
| # | Objective | Verdict | Status | What remains · gate |
| :-- | :-- | :-- | :-- | :-- |
| **O1** | Viral marketing **org** (3 pods + VIRAL-ENGINE + wired loop) | ✅ pass | **Done** — `arbor-{creative,distribution,insights}` + `VIRAL-ENGINE.md`; loop has Intel + Distribute phases; registered cron `0 5 ** 2,5` | — |
| **O2** | **Six-surface** positioning (kill "four") | ✅ pass | **Done** — `CAPABILITY-MAP.md` (6 pillars, 14 FRs); `BRAND-STRATEGY` §3/§5/§10; "four" swept in mesh/marketing + CLAUDE | stale-frame leftovers in loop workflow + `arbor-brand.md` **fixed 2026-06-22** |
| **O3** | **Academy two-sided / kids' Academy = viral** | ✅ pass | **Done** — CAPABILITY-MAP Pillar 6 (6a kids / 6b parent); FR-13/14; AM-NEW-9; two viral languages in VIRAL-ENGINE | — |
| **O4** | **Feature-requests → PRODUCT backlog** (execution-ready) | ✅ pass | **Done** — `mesh/PRODUCT-BACKLOG.md` "Council Intake 2026-06-22 (FR-1…FR-14)" with build/acceptance/owner/gate, P0/P1/P2 | Council/PM to promote to `AP-` ids (date back-refs say 06-21 in places — cosmetic) |
| **O5** | **Two-backlog rule** (marketing owns its own; only FRs to product; owns landing pages) | ✅ pass | **Done** — explicit rule in MARKETING-BACKLOG header + MESH boundaries | — |
| **O6** | **Localization** (fix translated HE + matrix + transcreation capability) | ✅ pass | **Capability done; copy drafted** — `arbor-localization` + `LOCALIZATION.md` native-voice gate; matrix **HE/EN/NL/DE/FR locked**; HE re-transcreated (AM-L1) + NL/DE/FR drafted (AM-L4) | **Native-human review per market = the publish gate** (HE has 6 flags; NL/DE/FR flagged). HE QA/pricing fixes applied by a concurrent session |
| **O7** | **Deploy** the new positioning live | ⚠️ **not deployed (by design)** | **Pipeline mapped (Path A); content not yet built into served files** | See deploy plan below — stops at a PR for Guy; needs AM-NEW-0 built + native sign-off |

---

## The real deploy path (Path A — mapped 2026-06-22)
**Key correction:** the Arbor app is a **nested, separate git repo** (`PPPPtherapy-/PPPPtherapy-/`) — that's why the ROS-root view showed "gitignored / not on main." Inside the app repo the landing pages **are committed source-of-truth**.

- **Edit:** `app/public/marketing/arbor-marketing-landing-page-{en,he,nl,de,fr}.html` (hand-maintained, committed; the `.md` files + `enrich-marketing-seo.mjs` are *not* the source and *not* in the build chain).
- **Build/serve:** `firebase.json` → `public: "app/dist"`; `vite build` copies `public/marketing/**` to `dist/` byte-for-byte; Firebase Hosting serves them (5-min cache).
- **Deploy mechanism:** `.github/workflows/arbor-deploy.yml` triggers on **push to the app repo's `main`** (lint+test gates only — **no canary**; this is the blind-100%-to-main path) → `firebase deploy --only hosting`. Project `arborprd-westeu`; `arborparentingapp.com` is wired to it.
- **⚠️ Pre-ship fix:** canonical/OG URLs in the served files still point at `arborprd-westeu.web.app` (the brand-domain switch, commit `2335111`, is behind main) — align before/with the content change or split SEO signal.

**The go-live route, the safe way (matches Guy's no-blind-deploy rule):**
1. Build **AM-NEW-0** (six-surface landing EN + the native HE) into the served `app/public/marketing/*.html` — *not done yet* (the earlier EN one-liner edit was to the ROS prototype, not the served app file).
2. Native-human sign-off on HE (and NL/DE/FR when those ship).
3. Commit on a branch in the app repo, open a **PR** → **STOP**. **Merging the PR = Guy's prod-promote** (because main auto-deploys). Never push to the app repo's `main` by hand.

---

## What remains (owner · gate)
| Item | Owner | Gate |
| :-- | :-- | :-- |
| **AM-NEW-0** — build six-surface landing EN + HE into the **served** app files | `arbor-content`/`arbor-creative`/`arbor-seo` | L3 publish; align canonical URLs first |
| **Native-human review** — HE (6 flags), NL/DE/FR | Guy / native reviewers per market | publish gate (final) |
| **Per-locale landing builds** (NL/DE/FR) | marketing pods | after native sign-off |
| **Promote FR-1…FR-14 to `AP-` ids** | Product Council / `arbor-pm` | product process |
| **The actual prod-promote** (merge the deploy PR) | **Guy** | the merge IS the deploy |

## Definition of Done (the whole program)
- [x] All 7 objectives' artifacts exist, coherent, honest (audited — strong pass).
- [x] Stale "four-products" frame removed from the live loop + brand profile.
- [x] HE re-transcreated to native + verified; NL/DE/FR drafted + flagged.
- [ ] AM-NEW-0 built into the served landing files (EN+HE).
- [ ] Native-human sign-off per shipping locale.
- [ ] Deploy PR opened on the app repo → **Guy merges = prod**.

**Honest line:** everything that is *content, strategy, structure, and capability* is done and verified. What's left is **execution into the served files + human sign-offs + the prod-promote** — all correctly human-gated. No part of this has shipped to prod, and no doc claims it has.
