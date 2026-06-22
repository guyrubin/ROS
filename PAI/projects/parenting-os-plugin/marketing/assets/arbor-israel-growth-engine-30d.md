# Arbor Israel — 30-Day Growth Engine

**By:** `arbor-acquisition` · 2026-06-21 · Anchors: [GOAL-viral-30d.md](../../mesh/marketing/GOAL-viral-30d.md) · [BRAND-STRATEGY.md](../../mesh/marketing/BRAND-STRATEGY.md). Budget: ~€4,500 (all paid spend GATED Level 4).

## Infra state (read first)
The event skeleton is **live** (`loopEvents.ts` commit `e09537a`): `install → app_open → profile_created → first_plan → share_initiated → share_completed → invite_sent → invite_activated → trial_start → paid`, with first-touch attribution (`referralCode`, `source`, `utm_*`, `market`). **Not live, blocks the loop:** `/join?ref=` resolver + reward grant (P0-2 → blocks G-1/G-2), one-tap branded share export with code in the deep link (P0-3 → blocks G-2/G-4), brand domain (blocks G-1 — WhatsApp OG broken on `web.app`), social channels (blocks G-4). All four are Week-0 critical path, all need Guy.

## The loops
- **Loop A — Referral (free Plus month, bilateral):** fires from a delight peak (post-Growth-Card / post-Rhythm-hit / post-Specialist), not a generic "invite" button. Activated parent (profile + first_plan, the abuse-resistant trigger) shares a branded card → recipient registers + runs one plan = activation → `trackInviteActivated` grants both sides. *Payload says "Arbor actually knows my kid" — the moat, not a discount.* Product-pod work: resolver + grant + confirm card. Marketing-owned: placement, copy, trigger timing. Target invite rate ≥20%, conversion/invite ≥0.15→0.25.
- **Loop B — Share-to-unlock:** share any artifact → unlock a second (alt avatar style / second story). One-tap export = `share_completed`. The export renderer (code in deep link) is **P0-3, the single highest-ROI product build of the sprint**.
- **Loop C — Creator/UGC seeding:** the ignition charge before the loop self-sustains (below).

## K-factor — honest (G1)
`K = i × c` where `i = invite_sent / activated_parents` (invite rate) and `c = invite_activated / invite_sent` (conversion per invite). **No blended-K; creator-seeded installs tagged `utm_campaign=creator-seed-*` and excluded from organic K.** The two missing call sites — `invite_sent` + `invite_activated` — are P0-2 and the reason K is currently unmeasurable.
**Daily dashboard** (Firestore-native, no BI tool): funnel (installs / activated% / WAH% / paid%), loop health (invite rate / conversion / K vs 0.5 target), by-source, top-artifact-by-share, creator cohort (separate), alerts (K<0.3 → hold paid; activation<25% → fix onboarding; invite<10% → fix share prompt). Smoke-test the full chain in staging before any seeding.

## Channel engine — IL-first
The real engine is **WhatsApp class-groups + FB parent mega-groups**, not paid ads. Enter them without spamming via **ambassador-first seeding**: recruit 5–10 trusted parents already active in those groups (free Family plan, no post requirement) who share their own real experience + their child's avatar (referral code in the card's deep link, *not* a link-drop in text); first comment carries the link, never the first post (admins remove link-first posts). IG/TikTok HE amplify by generating screenshots that circulate back into WhatsApp.

## Creator program (15–25 micro-creators)
- **Tier A** (30–80k, 5): €40–60 + free Family/yr → 1 hero post + 2 Stories + 1 group seed.
- **Tier B** (8–30k, 10): €20–35 + free Plus/6mo → 1 Reel + 1 Story.
- **Tier C** (2–8k, 10): product only (free Plus/3mo) → 1 honest post.
Wave-1 cash fees ≈ **€525** (Level 4). Product-first, fee-second; affiliate code = the referral code (€5/activated family). **No fee outreach until P0-2 is live.** Brief hand-off to `arbor-content` by D3.

## Paid plan (GATED Level 4 — amounts stated)
**Iron rule: no euro to paid until an organic asset clears ≥3% click-to-register on ≥10k impressions (≈Day 12–14).** Sprint slice ≈ **€3,500**: creator €525 + wave-2 reserve €300 + Meta IL Reels €1,500 + TikTok Spark €400 + retargeting €200 + contingency €575. **Kill:** Day-7 organic K <0.2 → pause ALL paid, diagnose (it's activation/share, not reach). **Scale:** any creative >100k views at ≥3% → move €500 contingency behind it immediately. No Google UAC this sprint (save for EN rollout).

## Activation / retention bridge (G-3)
**Double-Aha:** Aha-1 = child's avatar generated in <5 min (`app_open→profile_created`); Aha-2 = a cited answer about *this* child in the first session (`profile_created→first_plan`). **WAH = return ≥3×/week.** Two highest-leverage moves: (1) shorten Aha-1→Aha-2 to <60s (the Double-Aha onboarding, P0-6 — the single product build that most moves activation%); (2) the Rhythm "I was right" push as the WAH habit hook (copy now, infra gated). **Don't email pre-Aha cohorts** — lifecycle email only fires after `first_plan`.

## Guy-gated critical path (Week 0, or the loop doesn't exist by Week 1)
domain (~€10–100/yr, L4) · social channels (L3) · P0-2 referral grant authorization (L4 billing) · P0-3 share export authorization (L4) · creator wave-1 €525 (L4) · paid amplification €2,100 (L4, only post-proof).
