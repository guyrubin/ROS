# Arbor — Verified Reality Check (2026-06-22)

**Owner:** CoS (group HQ) · **Method:** 4 parallel specialist agents (product · UX/design · devops · marketing), each required to return **evidence or nothing**, adversarially self-checked against the real code/live surfaces.
**Why this exists:** a parallel session kept reporting "everything is okay"; the CEO (Guy) didn't see it. This is the unvarnished, evidence-backed state behind that gap.

## The root cause (one line)
**Agents grade code-correctness + finished docs (genuinely okay); Guy sees the live product + funnel — where the good work is either stuck on un-merged branches or never deployed, on top of a roadmap with zero real parent validation.** Both "okay" and "I don't see it" are true; they measure different things.

The through-line across all four lenses: **there is no live release pipeline, so built work piles up pre-prod and never reaches users.** The CIL improves Arbor every night — into branches nobody ships. Fixing *flow* (shipping), not *effort*, is the unlock. (This is exactly ROS-BACKLOG Theme O / `REL-ARBOR-001`.)

## The four lenses (verified)

### Product — real core, undelivered rim
- **Paywall shows no price.** `app/src/components/billing/PaywallModal.tsx:45-52`; no `pw.*Price` keys in `i18n.ts`. The only conversion surface on a live monetized app shows no offer.
- **Onboarding stores age in whole years.** `OnboardingFlow.tsx:102` (min0/max18 integer); `monitoring.ts:181` uses raw `ageYears` and never calls the `correctedAge()` that exists in `milestoneData.ts:316`. The moat's first read is wrong for every 0–2yo (the highest-stakes cohort).
- **3 sections live-but-empty:** `Appointments.tsx:102`, `Masterclasses.tsx:34`, `FamilyFormation.tsx:64` all render `<ComingSoon/>`.
- **Zero parent validation.** No App Store reviews, interviews, NPS, or usage analytics drive the roadmap — every backlog item is agent-generated. This is the deepest "okay" illusion.
- **#1 fix:** prices on the paywall (2 i18n keys, no clinical gate). *Verified via grep/read; could not verify live conversion numbers (no analytics).*

### UI/UX + design — tokens exist, execution reads "free-tier"
- **304 hardcoded hex** across 74 files fighting a `!important` CSS-override hack (`index.css`) — the root of the "unfinished" inconsistency; the override layer can't touch inline styles.
- **No imagery** on any parent surface (icon + text + pastel blobs); child photo placeholder is an initial letter. Calm/Headspace/Kinedu lead with photography.
- **Type scale defined but unused** — JSX uses arbitrary `text-[10px]`…`text-[1.85rem]`; 10–11px text everywhere reads as a tool dashboard.
- **Mobile landing hero = 62.8px**, fills 71% of the viewport, **both CTAs below the fold** (the IL mobile-first conversion surface). No dark mode. App palette (slate-green/emerald) ≠ landing palette (navy/teal) — brand incoherence at the click-through.
- **#1 fix:** the mobile-hero clamp (one CSS rule). *Verified by rendering the static landing EN at 375px + source reads. Could NOT render the authed React app — it hangs headlessly (OPS-B2); all app-interior findings are from source, not pixels.*

### DevOps — not ungated, but ships blind
- Deploy runs `lint`+`test` but **skips `check:framework`+`eval:safety`** (`arbor-deploy.yml`) — the deploy gate is weaker than the CI gate (OPS-B3).
- **Blind 100% promote**, no canary/smoke (`cloudbuild.prod.yaml:34-44`, no `--no-traffic`/`--tag`). `healthz.ts` + `post-deploy-smoke.mjs` **exist in the repo but are wired to nothing**.
- **Local `main` is 94 commits behind `origin/main`**; 26 local branches 6–97 behind; building off this workspace's main builds on a 3-week-old base.
- **REL-ARBOR-001 is 0% landed.** The release standard is doc-only so far.
- **#1 fix:** land OPS-A3 (canary) + OPS-A2 (wire the existing smoke) + OPS-B3 (full gate in deploy), as one slice, through a branch off `origin/main`. *Could not verify which auth path (WIF vs SA key) is live — GitHub vars not readable from disk.*

### Marketing — strong strategy, broken funnel
- ~~**`arborparentingapp.com` serves a GoDaddy placeholder**~~ — **CORRECTED 2026-06-22 (re-verified live):** the domain now serves the **real Firebase/Vite app** (raw HTML: `<div id="root">`, `/assets/index-*.js`, `firebase`, meta *"your child's development, thoughtfully guided"*; zero GoDaddy markers). A concurrent session pointed DNS → Firebase. The placeholder finding was a stale/JS-blind read. (Title is still "Parent Development Support" — a small copy item, not the banned "Parenting Made Simple".) **Epic C done.**
- **Viral loop K=0** — no `/join?ref=` resolver in app source, no reward grant, no share export.
- Dead privacy/safety footer links (`onclick="return false"`); OG image is a square logo not a 1200×630 card; schema says `PreOrder` on a live paid app. The dead-CTA fix, OG cards, schema fix, hreflang **all sit unmerged on `claude/cil-week`**.
- **#1 fix:** point the brand domain to Firebase Hosting (unblocks shares, the referral target, the AEO canonical, and the stuck branch fixes). *Verified by live WebFetch of the domain + sitemap + landing; could not confirm whether `claude/cil-week` partially deployed.*

## The decision — 3 gated calls that convert all of this into visible results
These are yours (Level 3–4); I will not improvise them:
1. ~~Point `arborparentingapp.com` → Firebase~~ — **DONE (verified live 2026-06-22).**
2. **Set the GitHub `production` env Required Reviewer (= Guy) + OPS-C1 WIF** — so the pipeline's promote job actually gates and the long-lived key is retired.
3. **One prod-promote sign-off** — merges + promotes `REL-ARBOR-001` (OPS pipeline + the green-gated council slice `review/rel-arbor-001-council`) and the stuck visible fixes, through the canary. Paywall price (pricing = Tier-C) surfaces with that item.

## Disposition (saved into ROS)
- The deployment-cycle slice is being **staged to a green branch** (`rel/arbor/001` off `origin/main`) by `arbor-devsecops-lead` — see [RELEASE-LEDGER.md](../../00_System/release-engineering/RELEASE-LEDGER.md) `REL-ARBOR-001`.
- These findings should be **promoted into the canonical backlogs** per [BACKLOG-MODEL.md](../../00_System/release-engineering/BACKLOG-MODEL.md): product/UX → `AP-` (Arbor Product), marketing → `AM-` (Arbor Marketing), each back-referencing its origin. The paywall-price, onboarding-age, post-checkout, and several marketing items already exist as CIL findings in `IMPROVEMENT-BACKLOG.md`.
- **Deepest open item (not a quick fix):** there is no real parent-validation signal. Until `arbor-ux` / `arbor-critic-feedback` bring real parent data in, the roadmap is the system grading itself.
