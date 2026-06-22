# Arbor — Aggressive Viral GTM (2026 H2)

**Owner:** PAI / MKT
**Created:** 2026-06-17
**Budget:** €10,000 over 6 months
**Markets:** 🇮🇱 Israel (ignition) → 🇳🇱 Netherlands (anchor 2) → 🇧🇪 🇮🇪 🇬🇧 (English rollout)
**Posture:** Organic + product-led virality led; ~30% paid as an *amplifier* of proven assets only
**North star:** **WAH families** — Weekly-Active-Habit families that activated (child profile + first plan) **and** return ≥3×/week. Revenue (Free→Plus/Family) is the co-primary.

---

## 1. The strategic truth (read this first)

€10,000 / 6 months / 5 countries = **~€278 per country per month.** That is not a paid-acquisition budget — one decent Meta campaign eats that in days. So we do not buy users. **We engineer a loop where each user brings the next one,** and we spend the cash only to (a) build the loop, (b) seed it with creators, and (c) amplify the assets that are already going viral on their own.

"The Uber for parenting" is a network claim, not a tagline. Uber won because supply + demand compounded locally. Our compounding asset is **the child's living record** plus **shareable artifacts the product already generates** (avatar, personalized story, "is this normal?" answer, monthly growth card). Every one of those is a built-in share moment. Our job is to turn share moments into installs and installs into habit.

**Why Israel first:** you have native Hebrew product + content, the deepest professional/content ecosystem, and the most viral-friendly parenting environment on earth — dense WhatsApp class-groups, hyperactive Facebook parenting groups (Secret Tel Aviv-style, "אמהות" mega-groups), and a large micro-creator scene that will work for product + small fees. It is the cheapest place to get K-factor data before we spend in pricier English markets.

---

## 2. Brand platform (the thing every asset must ladder to)

| Layer | Statement |
|---|---|
| **Category** | The developmental operating system for your family (B2B/strategy register). |
| **Consumer promise** | *"Know what's going on with your kid — and exactly what to do tonight."* |
| **Hebrew hook (IL)** | *"מה קורה עם הילד/ה שלך — ומה לעשות עכשיו."* |
| **Why us, in one line** | Not a chatbot, not a content app — a private record of your child that gets smarter every time you use it. |
| **Personality** | Calm, direct, humane, high-agency. The senior advisor who has seen this before and won't panic. Never fear-selling, never preachy. |
| **Proof, not adjectives** | Expert-reviewed, non-diagnostic, parent-owned data. Show the real product UI (per `PRODUCT.md`), never a generic AI hero. |

**Brand tension to exploit:** the parenting internet is either (a) alarmist fear-content or (b) cutesy rainbow fluff. Arbor's calm, clinical-humanist composure *is* the differentiator and the scroll-stopper. We win attention by being the adult in the room.

---

## 3. The viral engine — 4 share artifacts × 3 loops

The product already mints shareable objects. We make each one a deliberate growth surface.

### 3a. The four share artifacts (fuel)
1. **Arbor Avatar** *(just shipped — `generateImage()` / Avatar Creator)* → a privacy-safe stylized character of your child. **This is the TikTok/Instagram unit.** "Make your kid's Arbor character."
2. **Personalized story** → bedtime story with the child as the hero; parents already screenshot these.
3. **"Is this normal?" answer card** → the Read / Risk / Do-tonight card, beautifully formatted, instantly relatable and screenshot-able.
4. **Monthly Growth Card** → a shareable milestone recap from the child's record (memory moat made visible).

> Build requirement for all four: a one-tap **"Share"** that exports a branded, watermarked image/Reel-ready clip with a deep link + the parent's referral code baked in. (See backlog P0-3.)

### 3b. The three loops (mechanics)
1. **Referral loop** — give a free **Plus month** for each friend who activates; recipient also gets a perk. Parents move in tight packs (WhatsApp class-groups); one referral often = a whole group. Target invite-rate ≥25% of activated users.
2. **Share-to-unlock** — sharing an avatar/story unlocks an extra avatar style / a second story. Converts vanity into reach.
3. **Creator/UGC seeding** — micro-parenting creators get the app + a small fee to post their *real* "is this normal at 2am" moment and their kid's avatar. Their audiences are exactly our ICP.

**Loop math we're managing:** K = (invites sent per user) × (conversion per invite). Early target K ≥ 0.4; optimize toward ~1.0. We instrument this from day 1 — a loop you can't measure isn't a loop.

---

## 4. Fix the bad URL (do this in week 0 — it gates everything)

Today's public URL is `arborprd-westeu.web.app/marketing/` — unbrandable, untrustworthy in a share, and impossible to say out loud. **No viral asset should ship pointing at a `web.app` URL.**

**Recommendation — one global brand domain + a Hebrew vanity:**
- **Primary (global):** acquire the cleanest available of `joinarbor.com` → `getarbor.com` → `helloarbor.com` → `arbor.family`. (`arbor.com` is near-certainly taken/expensive.)
- **Israel vanity:** `arbor.co.il` (per existing memory), 301-redirecting to the Hebrew path on the primary, or serving the HE landing directly.
- **Structure:** `/` global EN, `/il` (HE), `/nl` later. Keep `web.app` as the **technical origin only**; do not switch canonical/sitemap/`llms.txt` URLs until the domain is verified in Firebase Hosting and serving HTTPS.

> Action: I cannot purchase domains (financial/external action). I've teed up the exact buy + DNS + Firebase-Hosting-custom-domain steps in the backlog (P0-1) for you to execute or approve.

---

## 5. Channel plan by market (organic-led)

### 🇮🇱 Israel — ignition (Weeks 1–8)
- **Instagram + TikTok (HE):** avatar challenge + "2am parenting" Reels; creator-seeded then owned account.
- **WhatsApp & Facebook parenting groups:** the real engine. Seed via creators + organic value posts (not spam) in the big "אמהות"/neighborhood groups; referral loop spreads inside class-groups.
- **Micro-creators (IL):** 15–25 parenting/SLP/kindergarten-teacher micro-creators (5k–80k). Product + small fee + affiliate code.
- **AEO/SEO (HE):** the live guide hubs + `arbor-he.md` so ChatGPT/Gemini/Perplexity recommend Arbor for Hebrew parenting questions. Submit Search Console after domain.

### 🇳🇱 Netherlands — anchor 2 (Weeks 9–16)
- Localize the **top 5 winning assets** to NL (not everything — port winners only).
- Parenting communities (Ouders.nl, Facebook ouder-groups), Dutch micro-creators, consultatiebureau-adjacent angle (institutional path stays warm but consumer-led here).
- NL guide hub + AEO in Dutch.

### 🇧🇪 🇮🇪 🇬🇧 — English rollout (Weeks 17–26)
- "Live & available" in English with the proven creative; concentrate paid amplification here where the loop is already validated.
- UK/IE micro-creator seeding + scaled paid on the single best-performing Reel/hook + PR push (see §7).

---

## 6. Budget allocation (€10,000)

| Bucket | € | What it buys |
|---|---:|---|
| Domain + tooling | 1,000 | Domain(s), branded email, link/UTM + attribution, design (Canva Pro), 1 lean SEO/AEO tool, analytics events |
| Creator seeding | 3,000 | 15–25 IL micro-creators (product + small fees/gifting), then NL + UK/IE waves |
| Paid amplification | 3,000 | Boost **only** proven organic Reels + retargeting; weighted to UK/IE late |
| Content production | 1,500 | UGC editing, Reel templates, avatar-challenge kit, growth-card design |
| Referral incentives | 800 | Reward fulfilment beyond free-Plus (gift cards, App Store credit for milestones) |
| Experiments / contingency | 700 | Kill-or-double test budget |

**Spending rule:** no euro to paid until an asset clears an **organic** engagement/share bar. We buy amplification of winners, never discovery of unknowns.

---

## 7. Earned media / PR (cheap, high-leverage)

- **Angle:** "An Israeli-built calm AI that tells parents what's *actually* going on with their kid — and refuses to fear-sell." Calm + privacy-first + non-diagnostic is a counter-narrative the press likes.
- **Founder narrative** for IL tech/parenting press; product-hunt-style launch for the English wave; pitch parenting newsletters and 1–2 podcast guest spots (near-zero cost).
- **Hook for journalists:** the memory moat + the avatar (visual, demo-able).

---

## 8. Funnel & instrumentation (so we can manage the loop)

Install → **Activation** (child profile + first plan) → **Habit** (≥3 returns/wk) → **Refer** (invite sent) → **Pay** (Plus/Family).

Track per stage, per market, per source (UTM + referral code). Minimum event set: `install`, `profile_created`, `first_plan`, `share_initiated`, `share_completed`, `invite_sent`, `invite_activated`, `trial_start`, `paid`.

### KPIs / gates (6-month)
| Metric | Floor | Target |
|---|---|---|
| WAH families (north star) | — | 1,500 |
| Activation rate (install→profile+plan) | 35% | 55% |
| Week-1 habit (≥3 returns) | 20% | 35% |
| K-factor | 0.4 | ~1.0 |
| Invite rate (of activated) | 15% | 25% |
| Free→Paid (Plus/Family) | 3% | 6% |
| CAC (blended) | — | < €4 (organic-led) |

**Kill/double rule (monthly):** any channel under its floor for 30 days gets cut; budget moves to whatever's beating target. Per the retention hypotheses already in the PRDs (H1: <20% families at 3 missions/wk by day 30 = kill the habit mechanic), retention gates the spend — we do **not** pour paid into a leaky funnel.

---

## 9. Phasing (26 weeks)

| Phase | Weeks | Focus | Exit gate |
|---|---|---|---|
| **0 — Foundation** | 0–2 | Domain live; share/referral mechanics built + instrumented; IL creator list; content templates; analytics | Loop is measurable; ≥1 share artifact has 1-tap branded export |
| **1 — IL ignition** | 3–8 | Avatar challenge; creator seeding; WhatsApp/FB groups; AEO HE; daily optimization | K ≥ 0.4; activation ≥ 35%; ≥3 winning creatives identified |
| **2 — NL anchor** | 9–16 | Localize winners to NL; NL creators + communities; amplify IL winners with paid | NL activation ≥ 30%; blended K holding |
| **3 — EN rollout** | 17–26 | BE/IE/UK live; scale paid on proven creative; PR/launch push | 5 countries live; CAC < €4; Free→Paid ≥ 3% |

---

## 10. Risks & mitigations

| Risk | Mitigation |
|---|---|
| Loop never fires (K < 0.2) | Stay in IL, fix activation + share friction before spending elsewhere; don't buy growth to mask a broken loop |
| Avatar/image gen = privacy backlash | Privacy-first stylized (not photo-real), parent-owned data stated plainly; lead with the non-diagnostic, AVG/GDPR posture |
| Budget spread too thin | Israel-first concentration; secondary markets get winners only, not full localization |
| Looks like a chatbot wrapper | Always show real product UI + the memory moat (per `PRODUCT.md` anti-references) |
| App can't take scale installs | Co-primary on habit, not vanity signups; retention gate before paid |

---

## 11. Decision

Build the loop in Israel, prove K ≥ 0.4 and activation ≥ 35% on near-zero spend, then pour the paid amplifier onto proven creatives as we roll NL → BE/IE/UK. Backlog in `arbor-marketing-backlog.md`; ready-to-ship copy in `arbor-launch-copy-pack.md`.

**Next artifact:** approve the domain buy (P0-1) and the share/referral build (P0-2/P0-3) — those two unblock everything else.
