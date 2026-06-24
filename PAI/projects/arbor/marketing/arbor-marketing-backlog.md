# Arbor — Marketing Execution Backlog

**Created:** 2026-06-17 · **Source plan:** `arbor-viral-gtm-2026-H2.md`
**Legend:** P0 = unblocks the loop (do now) · P1 = ignition · P2 = scale
**Effort:** S ≤ ½ day · M ≤ 2 days · L > 2 days · ⚙ = needs app code · 💳 = needs spend/approval · ✍ = content only

---

## P0 — Foundation (Weeks 0–2) — the loop must be live & measurable

| # | Task | Effort | Owner | Notes |
|---|---|---|---|---|
| P0-1 | **Buy global domain + IL vanity**; verify in Firebase Hosting (HTTPS), keep `web.app` as origin | M 💳 | Guy approves / I prep | `joinarbor.com`→`getarbor.com`→`helloarbor.com`→`arbor.family`; `arbor.co.il`. DNS + custom-domain steps prepped. Do **not** switch canonical/sitemap/`llms.txt` until verified. |
| P0-2 | **Referral loop**: invite code per user, "free Plus month on activation" for sender + perk for recipient | L ⚙ | Eng | 🟡 **Capture half DONE** (`?ref=` first-touch persisted + attributed on every event, commit `e09537a`). **Remaining:** generate code per user, grant Plus-month on invitee activation via entitlements, emit `invite_activated` server-side, abuse cap. |
| P0-3 | **1-tap branded Share export** for all 4 artifacts (avatar, story, answer card, growth card): watermarked image + deep link + referral code | L ⚙ | Eng | The single highest-leverage build. Reel-ready aspect ratios. `trackShareInitiated/Completed` helpers already exist in `lib/loopEvents.ts` — just wire them. |
| P0-4 | **Analytics events** wired: install, profile_created, first_plan, share_initiated/completed, invite_sent/activated, trial_start, paid (+ UTM + source) | M ⚙ | Eng | ✅ **DONE** — `lib/loopEvents.ts` + `lib/attribution.ts` + global-props on `lib/analytics.ts`; install/app_open/profile_created/first_plan wired; first-party Firestore (no third-party scripts). Commit `e09537a`, tsc+235 tests+build green. |
| P0-5 | **Attribution + UTM scheme** + short-link/tracking tool; one dashboard for the funnel | S | Me/MKT | Per-market, per-source. |
| P0-6 | **IL creator list** — 15–25 parenting/SLP/kindergarten micro-creators (5k–80k), contact + rate notes | M ✍ | Me/MKT | Sheet with handle, reach, angle, status. |
| P0-7 | **Content template kit**: avatar-challenge frame, 2am-Reel template, answer-card style, growth-card design | M ✍ | Me/MKT | Canva + on-brand (pine green, Inter/Fraunces). |
| P0-8 | **Launch copy pack** finalized (hero, challenge, creator DM HE+EN, referral, app-store, 10 hooks) | S ✍ | **Done** → `arbor-launch-copy-pack.md` | Review/approve. |

**P0 exit gate:** loop is measurable end-to-end and ≥1 artifact has branded 1-tap export.

---

## P1 — Israel ignition (Weeks 3–8)

| # | Task | Effort | Owner | Notes |
|---|---|---|---|---|
| P1-1 | **#ArborAvatar challenge** launch (HE) across IG/TikTok + creators | M ✍💳 | MKT | Share-to-unlock extra style; ride the just-shipped avatar gen. |
| P1-2 | **Creator seeding wave 1** — product + small fees + affiliate codes; brief = real "is this normal at 2am" moment | M 💳✍ | MKT | ~€1.5k of the €3k creator bucket. |
| P1-3 | **WhatsApp / FB parenting-group** playbook — value posts + referral spread inside class-groups (no spam) | M ✍ | MKT | The real IL engine; provide group-admin outreach script. |
| P1-4 | **AEO/SEO HE** — submit Search Console for new domain; verify guide hubs + `arbor-he.md` cited by ChatGPT/Gemini/Perplexity; fill top 10 HE intent gaps | M ✍ | Me | Build on the live SEO/AEO foundation. |
| P1-5 | **Owned IG/TikTok account (HE)** — 3–4 posts/wk from the template kit | M ✍ | MKT | Repurpose creator UGC. |
| P1-6 | **Daily loop optimization** — read funnel, cut/double, log winning creatives | S (ongoing) | Me/MKT | Weekly K-factor + activation report. |
| P1-7 | **YouTube Shorts channel** (HE-first) — cross-post every vertical asset; €0 net-new | S ✍ | MKT | Repurpose hooks + challenge + UGC. See `arbor-youtube-strategy.md`. |

**P1 exit gate:** K ≥ 0.4 · activation ≥ 35% · ≥3 proven winning creatives.

---

## P2 — NL anchor + EN rollout + scale (Weeks 9–26)

| # | Task | Effort | Owner | Notes |
|---|---|---|---|---|
| P2-1 | **Localize top 5 winners → NL** (assets + landing `/nl` + HE/EN answer content native review) | M ✍ | MKT | Winners only, not everything. |
| P2-2 | **NL communities + micro-creators** (Ouders.nl, FB ouder-groups) + consultatiebureau-adjacent angle | M ✍💳 | MKT | |
| P2-3 | **Paid amplifier ON** — boost only assets past the organic bar; retargeting | M 💳 | MKT | €3k bucket, weighted late + to UK/IE. |
| P2-4 | **BE/IE/UK English launch** — proven creative, creator seeding, app-store localization | M ✍💳 | MKT | |
| P2-5 | **PR / launch push** — IL press + Product-Hunt-style EN launch + 2 podcast spots + parenting newsletters | M ✍ | Me/MKT | Calm-AI / privacy-first / avatar angle. |
| P2-6 | **Monthly Growth Card** as a recurring re-engagement + share moment (email + in-app) | M ⚙✍ | Eng+MKT | Turns the memory moat into a monthly viral beat. |
| P2-7 | **Pricing/paywall experiments** — Free→Plus trigger placement, trial length A/B | M ⚙ | Eng | Co-primary revenue goal; don't starve the free-tier loop. |
| P2-8 | **YouTube evergreen long-form** — repurpose top guide-hub articles → 3–6min explainers for long-tail search/AEO | M ✍ | MKT | Lean, batch-recorded, winners only. Repurpose, never bespoke-produce. |

---

## Dependency chain (critical path)
**P0-1 (domain)** → all public assets · **P0-2/3/4 (loop + share + events)** → P1 everything · **P1 proof (K≥0.4)** → P2-3 paid + P2-4 EN rollout.

> Eng items (⚙) — P0-2, P0-3, P0-4 — are the gating builds. Everything marketing can start in parallel, but **no paid euro spends until the loop is instrumented and one artifact has branded share export.**
