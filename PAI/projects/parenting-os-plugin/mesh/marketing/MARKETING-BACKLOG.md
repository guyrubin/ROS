# Arbor Marketing Backlog — Canonical

**Single ranked operating backlog for the Arbor Marketing Mesh.** Supersedes the scattered docs listed in §7 (those become inputs/archive). Owner: arbor-marketing-lead. Reports to PAI + ROS MKT.

> **Canonical role (release-engineering, 2026-06-22):** this is the **one canonical Arbor Marketing backlog** a marketing release train pulls from (`REL-MKTG-*`); items take an **`AM-`** id and back-reference their origin (e.g. a CIL `market`-lens finding). CIL market findings are **feeders** — promoted here, not tracked in parallel. Marketing surfaces pass the `regress:mktg` suite + the **firewall lint** (no clinical-claim/clinician-identity string ships unless registered + signed). Model: [BACKLOG-MODEL.md](../../../../00_System/release-engineering/BACKLOG-MODEL.md) · [claim register](../../../../00_System/release-engineering/CLAIM-REGISTER.md).

> **Brand spine:** every item here is executed against [BRAND-STRATEGY.md](BRAND-STRATEGY.md) and must pass the Arbor Bar (`arbor-brand` ECD gate). Arbor = **Longitudinal Child Intelligence**, *the steady hand that remembers your child* — **one child OS, six surfaces on one parent-owned record, each beating a category leader** (Daily Play · Rhythm · Ask Arbor · Practice Studio · Arbor Care · Child Memory=the record — see [CAPABILITY-MAP.md](CAPABILITY-MAP.md)). One-liner: *"Every parenting app gives you content. Arbor actually knows my kid."*

---

## 0. ACTIVE GOAL — 30-Day Viral Ignition Sprint (2026-06-21 → 2026-07-21)

**This is the mesh's top priority until 2026-07-21.** Goal + success criteria: [GOAL-viral-30d.md](GOAL-viral-30d.md). Lane plans: [campaign brief](../../marketing/assets/arbor-israel-viral-campaign-brief.md) (ECD) · [growth engine](../../marketing/assets/arbor-israel-growth-engine-30d.md) (acquisition) · [content calendar](../../marketing/assets/arbor-israel-viral-content-calendar-30d.md) (content) · SEO/AEO (in §0d below).

**Goal (honest, per G1):** light a self-feeding viral loop in the Israel beachhead, *proven with real numbers*. Win = **G-1** loop live + K on a daily dashboard · **G-2** K ≥ 0.5 trending to 1.0 · **G-3** ~5,000 IL installs, ≥40% activated (Double-Aha → WAH) · **G-4** ≥1 breakout creative >100k views + the hero share artifact shipped. (Sustained organic K≥1 is the 60–90 day outcome this sprint earns — we will not claim guaranteed virality on a date.)
**Big idea:** *"הילד שלך — ביד יציבה / Your Child, Steady."* Breakout film: *"שנה שלמה / The Whole Year."* Hero artifact: the monthly **Growth Card** (HeroAvatar, never a real face).

### 0a. CRITICAL PATH — Week-0 unlocks ([CHANNELS.md](CHANNELS.md) for identity)
| # | Unlock | Blocks | Status |
| :-- | :-- | :-- | :-- |
| U1 | **Brand domain** | G-1 — WhatsApp OG previews + deep-link authority | arborparentingapp.com acquired 2026-06-21, **yours + Arbor-branded** (verified 2026-06-21 — NOT a squatter; the loop's "squatter" read was wrong). BUT it serves a generic GoDaddy website-builder page headed *"Arbor — Parenting Made Simple"* + an email form — **the tagline is off-brand (the exact "parenting app" framing the spine bans).** Left: (a) point DNS A/CNAME to Firebase so the domain serves the real essence-true landing; (b) kill the "Parenting Made Simple" tagline; (c) decide where the GoDaddy form's signups go (disconnect or wire to the real waitlist). L3/4 (DNS + deploy). |
| U4 | **Social channels** | G-4 — distribution | IG @arborchilddevelopment created. Left: TikTok/YouTube/FB |
| U2 | **Referral grant + `/join?ref=`** (P0-2) | G-1, G-2 — measurable loop payload (`invite_sent`/`invite_activated`) | product-pod build; resolves at `arborparentingapp.com/join?ref=` (L4 billing) |
| U3 | **One-tap branded share export** (P0-3) | G-2, G-4 — the share mechanic | product-pod build (L4) |
| U5 | **Double-Aha onboarding** (P0-6, <60s) | G-3 — activation% | product-pod build. Evidence: activation path currently drops to unknown onboarding state; first-value not guaranteed in <60s (clinical gate DEM-009 HELD — arbor-clinical-lead sign-off on coach answer copy required before ship) |
| U6 | **Paid spend** (~€525 creators wk1 + ~€2,100 amplification) | G-3, G-4 | L4 — confirm amounts; only behind proven creative |

### 0b. Sprint plan — week by week (all lanes; owner · risk · goal-target)
| Wk | Item | Owner | Risk | Goal |
| :-- | :-- | :-- | :-- | :-- |
| **W0 (D1–3) Unblock** | Clear U1–U6 critical path | arbor-marketing-lead → Guy | gated | all |
| W0 | 1200×630 HE OG card (sage-paper, synthetic name, one-liner) + replace square-logo `og:image`; per-artifact OG templates | arbor-seo + arbor-content | safe | G-2 |
| W0 | `?utm_campaign=2am` → 2am-hook landing variant; `landing_viewed`+`register_cta_clicked` events; lock UTM taxonomy | arbor-seo | safe | G-1, G-3 |
| W0 | K-factor daily dashboard spec + staging smoke-test of the full event chain | arbor-acquisition | safe | G-1 |
| W0 | Ambassador recruitment (5–10 trusted IL group parents, free Family, no post requirement) | arbor-acquisition | safe | G-2 |
| **W1 (D4–10) Wire+Seed** | Ship the hero share artifact (Growth Card) + share captions HE/EN | arbor-content + product pod | safe/gated | G-2 |
| W1 | #הגיבורשלי / #ArborHero avatar challenge launch (IG+TikTok HE) | arbor-content | safe(L3 publish) | G-4 |
| W1 | Creator wave 1 (Tier A, 5) outreach + onboard + coordinated post drop | arbor-acquisition | gated (fees L4) | G-2, G-3 |
| W1 | WhatsApp/FB seeding via ambassadors (avatar + answer-card, value-first, link in 1st comment) | arbor-acquisition | safe(L3) | G-2, G-3 |
| W1 | AEO guide pages `/he/speech-delay/`, `/he/sleep-by-age/` (FAQPage JSON-LD, arbor-safety gate) — 60-day payoff seeded now | arbor-seo + arbor-content | safe(L3 publish) | AEO |
| **W2 (D11–17) Ignite** | Ship "שנה שלמה / The Whole Year" breakout film (arbor-safety on Rhythm framing) | arbor-content + creator | gated (safety) | G-4 |
| W2 | Read Day-7 K: ≥0.3 proceed; <0.3 fix activation before any paid | arbor-acquisition | safe | G-2 |
| W2 | Rhythm "I was right" share card + WAH push copy | arbor-content | safe | G-2, G-3 |
| W2 | Second WhatsApp seeding wave (15 groups) + AEO `/he/tantrums/`, `/he/picky-eater/` | arbor-acquisition + arbor-seo | safe | G-2, AEO |
| **W3 (D18–24) Amplify** | Paid amplification **only behind proven creative** (Meta €1.5k + TikTok Spark €400 + retgt €200) | arbor-acquisition | gated L4 | G-3, G-4 |
| W3 | Creator wave 2 (5–8 who asked to continue) + IL press (Calcalist/Geektime — memory+privacy angle, €0) | arbor-acquisition + arbor-content | gated(L4)/L3 | G-4 |
| W3 | Concept B "המומחה שכבר מכיר / The Expert Who Already Knows" (trust proof) | arbor-content | safe(L3) | G-3 |
| **W4 (D25–30) Compound+Read** | Second Growth-Card cycle auto-generates (compounding proof) | arbor-content + product pod | safe/gated | G-2, G-3 |
| W4 | Honest 30-day K read + activation%/WAH% + creator cohort separate; publish + 60-day plan | arbor-acquisition | safe | G-1 |

### 0c. Ownership split (do not blur)
- **Marketing-owned (this mesh):** all creative/copy/assets, the channel + creator engine, OG/landing/AEO, the dashboard spec, the honest read.
- **Product-pod work (hand to `arbor-orchestrator`):** P0-2 referral grant + `/join?ref=`, P0-3 share export, P0-6 Double-Aha onboarding, the dashboard query, push infra. These are the loop's plumbing — marketing specs, product builds.

### 0d. SEO/AEO honesty note
Net-new organic search needs 6–12 weeks of crawl trust — the 30-day SEO job is **the OG/share layer that makes WhatsApp shares convert + landing conversion**, not traffic. AEO answer-cards (HE-first, no IL competitor has zero HE content) are seeded now for a Week 5–6 payoff via AI answer engines (faster to index than Google). Don't deploy the AEO hub until the domain resolves (its canonical points at the brand domain — publishing at `web.app` splits the signal). llms.txt, sitemap.xml, and robots.txt Sitemap line must all be updated in one pass (via enrich-marketing-seo.mjs) the moment arborparentingapp.com is confirmed live in Firebase Hosting.

---

### 1. North Stars & the One-Line Moat

**Moat:** Arbor is the only parent-mediated, longitudinal child-memory record in the category. Every rival captures one slice (sleep, activities, hardware data, expert chat). Arbor compounds all of them in a single parent-owned record.

**VIRAL** — moat-native growth loops measured honestly: installs-per-sharing-parent-per-month; second-guardian invite; WhatsApp-first; safe stylized hero artifact. Child's real face/data is never the viral payload.
**CAPABLE** — best-in-market depth: cited parent coach, child-as-hero story/comic studio, zero-effort longitudinal tracking.
**TRANSFORMING** — evidence-based retention: narrativized memory moat, tiny-habits, fresh-start re-engagement. Never transfer clinical effect-size to copy until Arbor has its own measured data (G2).
**TRUST** — image-gen cost cap, C2PA+SynthID provenance, Family Trust Center, no-open-companion guardrail. Trust-as-GTM in a 2026 regulatory climate no incumbent can match.

**G1 — Loop-math honesty:** measure installs-per-sharing-parent-per-month with the full factor chain; no blended-K guarantees.
**G2 — Copy governance:** cite the mechanism only; never transfer clinical effect-size to user-facing copy until Arbor's own cohort data (T6) exists; outcome verbs banned until then. All developmental claims cleared by arbor-safety before any publish.

---

### 2. NOW — In-Flight (This Cycle)

| ID | Item | Owner Pod | Risk | Status | Source |
| :-- | :-- | :-- | :-- | :-- | :-- |
| NOW-1 | PlayKit viral asset pack — 4 plates + HE overlays (2am cover, avatar challenge, calm-answer carousel, video end-card) | arbor-content | safe | DONE — plates + HE publish drafts in `assets/arbor-playkit-viral-2026-06-20/` | production-pack |
| NOW-2 | HE + EN hero/landing copy slate (5 headline options per lang, CTA, sub) | arbor-content | safe | DONE — in launch-copy-pack | launch-copy-pack |
| NOW-3 | IL creator shortlist (Tier A/B/C HE parenting, SLP, kindergarten) | arbor-acquisition | safe | DONE — `arbor-il-creator-tracker.md`; verify follower counts before outreach | il-creator-tracker |
| NOW-4 | GTM plan + budget allocation (€10k / 6mo) | arbor-marketing-lead | safe | DONE — IL ignition → NL anchor → EN rollout | viral-gtm |
| NOW-5 | Campaign "The 2am Test" — concept + scripts + 4 video scripts | arbor-content | safe | DONE — production-kit + heygen-script; manifesto film rough exists, needs final render | production-kit |
| NOW-6 | Brand channel assets: "Arvo" avatar + YouTube banner | arbor-content | safe | DONE — `assets/arvo-avatar-1080.png`, `assets/arbor-youtube-banner.png` | execution-tracker |
| NOW-7 | Analytics events (`loopEvents.ts`) — install, profile_created, share_*, invite_*, paid | arbor-acquisition | safe | SHIPPED — commit `e09537a` | loop-eng-spec |
| NOW-8 | HE OG tags, dead hero CTA fix, hreflang, schema PreOrder→live, moat-in-hero, no-hardware counter-position (CIL-market batch) | arbor-content / arbor-seo | safe | SHIPPED ON BRANCH `claude/cil-week` commit `b8dfc76` — **awaiting Guy merge+deploy. Verify in prod: HE og:title in Hebrew, schema availability=OnlineOnly, H1 moat copy, no-hardware counter. Do not close until prod fetch confirms.** | IMPROVEMENT-BACKLOG |
| NOW-9 | Lifecycle email sequence spec (7-email arc, HE primary) — P1-12 | arbor-content | safe | Specced in backlog-v2; copy not written | marketing-backlog-v2 |
| NOW-10 | Landing page native HE reviewer pass | arbor-content → Guy gate | gated (Level 3 publish) | **BLOCKED ON GUY** | execution-tracker |
| NOW-11 | Domain purchase (`arborparentingapp.com` acquired) + Firebase HTTPS + canonical switch | arbor-acquisition → Guy | gated (Level 4/5 — see §3 CIL-market-no-brand-domain; domain resolves to GoDaddy squatter page, ESCALATED) | **BLOCKED ON GUY — Level 5 brand-risk** | viral-gtm + execution-tracker |
| NOW-12 | Social channels (IG/TikTok/YouTube) create + Metricool connect | arbor-marketing-lead → Guy | gated (Level 3, phone/email verification) | **BLOCKED ON GUY** | execution-tracker |

---

### 3. Funnel & Market Findings (Marketing-Owned)

CIL-verified findings on the marketing surface. Shipped items are done — do not re-queue. Open items are ranked by CIL score (severity × userImpact × confidence ÷ effort).

| Score | ID | Issue | Owner | Risk | Status |
| :-: | :-- | :-- | :-- | :-- | :-- |
| 100 | CIL-market-dead-hero-cta | Final landing CTA was a dead JS no-op on all 5 langs — zero conversion | arbor-marketing-lead | safe | SHIPPED — commit `b8dfc76` |
| **10.2** | **CIL-market-hero-h1-generic-not-moat** | EN landing H1 "Know what's going on with your kid" is generic benefit copy — could run on Kinedu with one word swapped. Fails Arbor Bar memory test + first-line test. The one-liner ("Every parenting app gives you content. Arbor actually knows my kid.") must be in the H1, not buried. | arbor-content | safe | **OPEN (NEW) — build this cycle; arbor-brand ECD gate before deploy** |
| **7.84** | **CIL-market-og-image-square-logo** | All 22+ marketing pages use 520×525 square logo as og:image → WhatsApp/FB previews near-invisible. WhatsApp requires 1200×630 landscape card. Primary IL GTM distribution channel. | arbor-content + arbor-seo | safe | **OPEN — build this cycle** |
| **7.65** | **CIL-market-llms-txt-wrong-host** | llms.txt, sitemap.xml, robots.txt Sitemap line all carry arborprd-westeu.web.app — AEO citations point at uncitable Firebase host. 27 refs in llms.txt, 23 in sitemap. | arbor-seo | safe | **OPEN — blocked by domain gate (U1). Prep: run enrich-marketing-seo.mjs with new origin const the moment arborparentingapp.com is live in Firebase Hosting.** |
| 64 | CIL-market-og-title-he-english | HE landing og:title/description served in English → wrong-language WhatsApp/FB previews | arbor-marketing-lead | safe | SHIPPED ON BRANCH `b8dfc76` — verify in prod before closing (see NOW-8) |
| 36 | CIL-language-he-og-tags-english | HE marketing page OG tags English-only (language layer) | arbor-content | safe | SHIPPED — commit `3c5075e` |
| 34 | CIL-market-sitemap-missing-guide-hreflang | 6/7 HE guide pages + 6/7 EN pages lack hreflang alternates | arbor-seo | safe | SHIPPED — commit `b8dfc76` — verify in prod |
| 24 | CIL-market-no-ai-longitudinal-differentiator-on-page | Moat buried in section 4; hero was generic | arbor-marketing-lead | safe | SHIPPED ON BRANCH `b8dfc76` — verify H1 moat copy landed in prod (superseded by CIL-market-hero-h1-generic-not-moat if H1 still reads generically in deployed build) |
| 23 | CIL-market-schema-preorder-vs-live | Schema said PreOrder on a live app → blocked Google "Try free" rich result | arbor-seo | safe | SHIPPED ON BRANCH `b8dfc76` — **verify in prod: fetch landing JSON-LD, confirm availability=OnlineOnly or InStock. Run Google Rich Results Test after Guy merge+deploy.** |
| **[40→escalated]** | **CIL-market-no-brand-domain** | Canonical is `arborprd-westeu.web.app` — unshareable; gates entire GTM loop. **NEW EVIDENCE (2026-06-21):** arborparentingapp.com currently resolves to a GoDaddy "Parenting Made Simple" placeholder/squatter page — NOT Arbor. Any shared link pointing at this domain lands a parent on a competitor site. Level 5 brand-risk. | arbor-marketing-lead → Guy | **gated — Level 5 brand-risk** | **OPEN — ESCALATED. No marketing asset should point at arborparentingapp.com until it resolves to the Arbor app. See §6 for DNS action steps.** |
| **4.28** | **CIL-market-no-social-proof** | Zero social proof on landing — no user count, testimonials, expert endorsements. 4-cell proof strip shows text labels only. Competitors (Good Inside, Kinedu, Lovevery) show credentials, community size, academic partnerships above fold. Pre-launch proxy claims available: CDC/AAP/ASHA grounding, Amsterdam+Tel Aviv origin, founding-member count. | arbor-content | safe | **OPEN (NEW) — build this cycle** |
| **4.28** | **CIL-market-he-pricing-eur-not-ils** | HE landing shows EUR pricing (€12.99/mo, €19.99/mo) — wrong currency for Israel (GTM priority market). Kinedu + BabySparks localize to local currency. ILS price points need Guy confirm ("₪ pricing is an estimate pending confirm" per arbor-memory). | arbor-content | **gated** (ILS price points unconfirmed — Guy must approve ₪ anchors before ship) | **OPEN (NEW)** |
| **3.8** | **CIL-market-he-landing-missing-frank-ruhl-font** | HE landing imports Noto Sans Hebrew + Heebo only. Frank Ruhl Libre absent. BRAND-STRATEGY.md §8: "Frank Ruhl Libre carries gravitas (the register of a good book)." Missing display font undercuts the HE brand register. | arbor-content | safe | **SHIPPED (2026-06-21) — Frank Ruhl Libre import added (line 111), --serif token wired (lines 168-169, 693-694, 816-817), h1-h4 font-family:var(--serif) weight:700 (line 824) in arbor-marketing-landing-page-he.html. arbor-brand ECD gate: PASS all 8 Arbor Bar tests. arbor-safety gate: PASS (typography-only; no clinical/effect-size claims introduced; no child data). AWAITING Firebase push confirmation (Level 3 deploy gate — Guy or orchestrator must authorize prod push). Pre-deploy: confirm prod font-load renders Frank Ruhl Libre on HE headings.** |
| **3.2** | **CIL-market-seo-guide-pages-dead-links** | Footer EN landing links to 7 deep guide pages at `/marketing/en/*.html` paths — no files found at those paths in the repo. Crawlable 404 cluster = hard negative SEO signal; AEO strategy depends on these pages being indexed. | arbor-seo | safe | **OPEN (NEW) — build this cycle: verify which guide files exist in deployed Firebase Hosting; either generate+deploy 7 EN guide HTML files or remove footer links until files exist** |
| **3.2** | **CIL-market-positioning-drift-category** | Hero tag reads "An operating system for child development" — BRAND-STRATEGY.md §2 locks category name as "Longitudinal Child Intelligence." Inconsistency prevents owning the coined category term. og:title also reads generic. | arbor-content | safe | **OPEN (NEW) — arbor-brand ECD must approve final phrasing** |
| **2.85** | **CIL-market-good-inside-community-landing-gap** | No peer-connection mention on landing. Safe landing copy fix (no community product required): add one line in "Who it helps" referencing shareable artifacts as the social proof layer. Do not claim a community exists. | arbor-content | safe | **OPEN (NEW) — safe copy fix; product community layer remains gated in §5** |
| 23 | CIL-market-no-activation-email-capture | No email/waitlist capture → interested-but-not-ready visitors lost. Note: parent email only (no child data) — consent UX is the only gate, not child-data. GDPR/COPPA explicit opt-in checkbox required. Could be downgraded from gated to safe with proper consent copy reviewed by arbor-safety. | arbor-marketing-lead | **gated** (PII/consent on EU product — arbor-safety consent-UX review required) | **OPEN** |
| 21 | CIL-market-viral-loop-unwired | `/join?ref=` resolver, reward grant, deep-linked share export unbuilt (= P0-2/P0-3) — K-factor = 0 without this | arbor-acquisition | **gated** (billing + child-activation) | **OPEN** |
| 14 | CIL-market-nanit-biosignal-moat-threat | No "no-hardware / parent-owned record" counter vs Nanit sensor-AI moat | arbor-marketing-lead | safe | SHIPPED ON BRANCH `b8dfc76` — verify in prod |
| 10 | CIL-market-no-duolingo-abc-phonics-angle | No differentiated literacy proposition vs free Duolingo ABC / Khan Kids (3–8 cohort). **Safe split:** landing counter-narrative copy ("Arbor adapts to how Maya responded last week — memory Duolingo can't match") is safe. Product EarlyReadingTrack marketing page gated. | arbor-marketing-lead (copy) | copy=safe; AEO page=**gated** (links reading practice to child profile) | **OPEN — safe counter-narrative copy can ship; AEO literacy page gated pending arbor-safety** |
| 5 | CIL-market-no-community-layer | No peer community layer (Good Inside/Cooper make coached community the retention engine). Safe copy fix in §3 above (CIL-market-good-inside-community-landing-gap). Product community build gated. | arbor-marketing-lead | **gated** (child-data + consent + moderation absent for product) | **OPEN — copy fix split out as safe item above** |

---

### 4. Campaigns & Materials Backlog (Ranked)

IL-first → NL anchor → EN rollout sequencing is explicit throughout.

**Phase 0 — Foundation (Days -7 to 0, IL pre-launch)**

| Priority | Item | Owner | Risk | Source |
| :-- | :-- | :-- | :-- | :-- |
| P0 | Referral reward grant: Plus month for both sides on activation (P0-2) | arbor-billing + arbor-growth | gated (billing/entitlement) | loop-eng-spec |
| P0 | Branded one-tap share export + referral deep-link in all 4 artifacts (P0-3) | arbor-avatar + arbor-api | gated (billing/child-data via entitlement grant) | loop-eng-spec |
| P0 | K-factor daily dashboard: loopEvents end-to-end smoke test (P0-4) | arbor-acquisition | safe | marketing-backlog-v2 |
| P0 | Hero Comic free magnet funnel — registration-gated, no-card, 60-second Aha (P0-5) | arbor-design + arbor-avatar | safe | marketing-backlog-v2 |
| P0 | Double Aha onboarding: comic → coach answer → Daily Play → Rhythm promise (P0-6) | product pod + arbor-content | safe | marketing-backlog-v2 |
| P0 | Founding-member paywall trigger: €89/yr, fired post-Aha, 500-slot cap, A/B vs 14-day trial (P0-7) | arbor-billing + arbor-content | gated (billing) | marketing-backlog-v2 |
| P0 | EN + HE landing copy — native HE written first, EN parallel (not translated); 6 sections per layout (P0-9) | arbor-content; native HE review gate; arbor-safety on claims | gated (Level 3 publish) | marketing-backlog-v2 |
| P0 | Technical SEO: hreflang audit, canonical fix, HE-first sitemap, robots.txt with AI-bot allows (P0-10) | arbor-seo | safe | marketing-backlog-v2 |
| P0 | HE AEO guide hub: /he/is-this-normal/ — 15 top queries, FAQ JSON-LD, arbor-safety clearance (P0-8) | arbor-seo + arbor-content | safe (publish = Level 3) | marketing-backlog-v2 |
| P0 | 2am emotional hook landing variant — A/B vs comic variant (P0-11) | arbor-content + arbor-acquisition | safe | marketing-backlog-v2 |
| P0 | SoftwareApplication + FAQPage schema upgrade (P0-12) | arbor-seo | safe | marketing-backlog-v2 |

**Phase 1 — IL Ignition (Days 1–8)**

| Priority | Item | Owner | Risk | Source |
| :-- | :-- | :-- | :-- | :-- |
| P1 | 40–50 IL HE micro-creator saturation wave — coordinated launch-day drop; €800–1,500 creator fees (P1-1) | arbor-acquisition + arbor-marketing-lead | **Level 4** (spend confirm before outreach) | marketing-backlog-v2 |
| P1 | Creator seed kit — HE brand-voice note, 4-shot film guide, 5 caption options, response guide (P1-2) | arbor-content; native HE reviewer | safe (Level 3 for distribute) | marketing-backlog-v2 |
| P1 | WhatsApp class/gan group seeding — Tier 1 ambassadors (already active members, recruited at D-21); 30 groups in 30 days (P1-3) | arbor-acquisition + arbor-marketing-lead | safe (Level 3 for seeding) | marketing-backlog-v2 |
| P1 | Hero Comic launch Reel (HE + EN) — 12–15s, 3 age variants, no voiceover (P1-4) | arbor-content + arbor-avatar | safe | marketing-backlog-v2 |
| P1 | "הגיבור שלי" / #MyArborHero UGC challenge — 7-day window, top-10 win Family plan (P1-5) | arbor-marketing-lead + arbor-content | safe (Level 3 for run) | marketing-backlog-v2 |
| P1 | Rhythm daily habit card + morning push notification copy (opt-in) (P1-6) | arbor-content + product pod | safe (push spec only; push infra = gated) | marketing-backlog-v2 |
| P1 | Rhythm "Prediction Was Right" share card — ±90min match, branded export, HE caption (P1-7) | arbor-content + product pod | safe | marketing-backlog-v2 |
| P1 | Lifecycle email + push sequence — 7-email arc, 14-day, HE primary, EN secondary; 3 subject variants each (P1-12) | arbor-content; native HE reviewer; arbor-safety on emails 3 & 5 | safe (automation setup safe; arbor-safety gate on behavioural language) | marketing-backlog-v2 |
| P1 | The Sturdy Parenting Manifesto — 600–800 words HE + EN; "warmth with structure" brand anchor (P1-13) | arbor-content; native HE reviewer; arbor-safety; arbor-marketing-lead | Level 3 for external publish | marketing-backlog-v2 |
| P1 | IL AEO guide: /he/sleep-by-age/ — capture Huckleberry's #1 intent in Hebrew (P1-14) | arbor-seo + arbor-content | safe (arbor-safety on non-diagnostic framing) | marketing-backlog-v2 |
| P1 | IL competitive AEO gap brief — 10 queries Kinedu/BabySparks have zero HE content on (P1-16) | arbor-seo | safe | marketing-backlog-v2 |
| P1 | Monthly Growth Card — auto-generated Plus artifact, referral embedded, free-user teaser (P1-17) | arbor-content + arbor-avatar; arbor-safety on developmental highlights | safe (card design + copy); gated (generation pipeline) | marketing-backlog-v2 |
| P1 | Per-capability child demo video series — 6 Shorts, real PlayKit world, HE + EN captions (P1-11) | arbor-content + arbor-avatar | safe | marketing-backlog-v2 |
| P1 | Founding-member Plus offer positioning copy — €89/yr, "500 families" badge, HE native (P1-8) | arbor-content; native HE reviewer | safe (content); gated (paywall fires = billing) | marketing-backlog-v2 |
| P1 | WhatsApp seeding playbook + copy templates (P1-15) | arbor-content + arbor-marketing-lead | safe | marketing-backlog-v2 |
| P1 | YouTube Shorts channel launch — cross-post all vertical assets at €0 new production cost | arbor-content | safe | youtube-strategy |

**Phase 2 — Scale (Days 8–30 IL / then NL)**

| Priority | Item | Owner | Risk | Source |
| :-- | :-- | :-- | :-- | :-- |
| P2 | €3k paid amplification — Meta IL €2,200 + TikTok IL €500 + retargeting €300; day-7 K≥0.3 kill gate (P1-10 / P2-8) | arbor-acquisition | **Level 4** (state amounts, Guy confirm before activation) | marketing-backlog-v2 |
| P2 | EN AEO guide: /en/is-this-normal/ — mirror of HE hub (P2-1) | arbor-seo + arbor-content | safe (Level 3 publish) | marketing-backlog-v2 |
| P2 | EN AEO guide: /en/speech-delay-signs/ — highest-conversion speech intent (P2-2) | arbor-seo + arbor-content | safe (arbor-safety for ASHA/AAP sources + "consult your professional" at every red-flag section) | marketing-backlog-v2 |
| P2 | HE AEO guide: /he/tantrums/ — highest-volume toddler query in IL FB groups (P2-3) | arbor-seo + arbor-content | safe (arbor-safety; Level 3 publish) | marketing-backlog-v2 |
| P2 | WhatsApp-optimised OG cards for HE guide hub pages — 1200×630px sage-paper (P2-4) | arbor-seo + arbor-content | safe | marketing-backlog-v2 |
| P2 | Core Web Vitals + LCP fix on HE landing — target LCP < 2.5s on Moto G slow 4G (P2-5) | arbor-seo | safe | marketing-backlog-v2 |
| P2 | Scarcity close + second PR beat — IL tech press (Calcalist, Geektime); NL waitlist teaser (P2-6) | arbor-content + arbor-marketing-lead | Level 3 (publishing) + Level 4 if spend attached | marketing-backlog-v2 |
| P2 | Post-activation referral prompts — 3 in-product variants at delight peaks, not generic "invite friends" (P2-7) | arbor-acquisition + arbor-content | safe (prompt copy); gated (fires after P0-3 share export live) | marketing-backlog-v2 |
| P2 | NL market: localise top-5 IL winning assets (port winners only); NL AEO guide hub; Dutch micro-creators | arbor-content + arbor-acquisition | Level 3 + Level 4 for spend | viral-gtm |
| P2 | YouTube long-form evergreen: repurpose guide articles as 3–6 min explainers (Phase 2+, not ignition) | arbor-content | safe | youtube-strategy |

**Funnel Kill Gates (non-negotiable)**

| Metric | Floor | Kill Action |
| :-- | :-- | :-- |
| Landing → register | 25% | Pause paid; rewrite CTA |
| Aha → share | 10% | Fix P0-3 share friction before any paid |
| Day-7 K-factor | 0.3 | Hold all paid spend; surface diagnosis to PAI |
| Paid CAC | €80 | Pause channel |
| AEO as 30-day source | — | Re-bucket to 60-day channel; new domains need 6–12 weeks to accumulate crawl trust |

---

### 5. Competitor Feature-Requests — Handed to PRODUCT

**Ownership rule:** marketing sources these from competitor scans and hands them to PRODUCT-BACKLOG.md and mesh/improvement/IMPROVEMENT-BACKLOG.md. Marketing owns the positioning and counter-narrative; it does not own the build.

| Score | Feature | Competitor It Counters | Moat Play | Status |
| :-: | :-- | :-- | :-- | :-- |
| 20 | Background FCM push for JITAI predictive nudges (CIL-capability-fcm-background-push) | Huckleberry (SweetSpot push), Kinedu (live-class push) | JITAI nudge fires at the predicted hour from child's own rhythm — not a generic age-table alert | gated — child-data + consent; Guy roll-up. **HANDED TO PRODUCT-BACKLOG.md + IMPROVEMENT-BACKLOG.md (2026-06-21).** |
| 18 | Proactive "Arbor Noticed" weekly alert — child's own monitoring signal surfaced without tab visit (CIL-capability-proactive-monitoring-alerts) | Good Inside (Gigi cross-session), Huckleberry (proactive tips) | Lead moat bet: longitudinal nudge no single-vertical competitor can generate | gated — child-data + non-diagnostic guarantee. **HANDED TO PRODUCT-BACKLOG.md + IMPROVEMENT-BACKLOG.md (2026-06-21).** |
| 17 | Physical growth tracking (height/weight/WHO percentile) (CIL-capability-physical-growth-tracking) | BabySparks + baby-tracker category | Append-only timestamped entries → true longitudinal trajectory vs single-reading competitors | gated — child health data (COPPA/GDPR). **HANDED TO PRODUCT-BACKLOG.md + IMPROVEMENT-BACKLOG.md (2026-06-21).** |
| 16 | Expert-cited activity content (citation fields, CDC/AAP/named-researcher sources per child concern) | Kinedu (Harvard partnership), Lovevery, BabySparks (PhD-designed) | Personalized citation a generic app can't generate — only safe capability bet | SHIPPED (build) — branch `claude/cil-week`, commit `15a0f7c`; human editorial URL spot-check required before prod deploy |
| **5.07** | **Infant age in months (dob-based) — ChildProfile.age is integer years, breaking milestone + monitoring engines for 0–24mo cohort (CIL-capability-infant-age-months-input)** | Kinedu, BabySparks, Huckleberry, Lovevery (all month-granular) | A 6-month-old entered as "0" gets zero milestones and no monitoring signal. Critical correctness bug — baby cohort is a primary growth market. | gated (schema change, requires Guy confirm on data migration). **HANDED TO PRODUCT-BACKLOG.md + IMPROVEMENT-BACKLOG.md (2026-06-21) as a correctness bug / gated keystone.** |
| 11 | Live expert session BOOKING + calendar + video + payment (CIL-capability-live-expert-booking) | Kinedu (live expert classes), BabySparks (private coaching), Good Inside | Expert opens with full Arbor memory packet — sessions richer than cold telehealth | gated — billing (Stripe) + child-memory-packet share; consult-REQUEST already ships (MON-3). **HANDED TO PRODUCT-BACKLOG.md + IMPROVEMENT-BACKLOG.md (2026-06-21).** |
| 10 | Differentiated literacy marketing positioning vs free Duolingo ABC / Khan Kids (3–8 cohort) (CIL-capability-literacy-marketing-positioning) | Duolingo ABC, Khan Academy Kids | "Arbor tracks whether Maya is ready and adapts to how she responded last week" — memory Duolingo can't match. EarlyReadingTrack.tsx exists in product but absent from all marketing surfaces. | gated (child-data product link) — safe landing counter-narrative copy handed to §3 above; dedicated EN+HE AEO literacy page gated pending arbor-safety. **HANDED TO PRODUCT-BACKLOG.md + IMPROVEMENT-BACKLOG.md (2026-06-21) for product surface; marketing counter-narrative in §3 open.** |
| 10 | Family-level cross-child dashboard (CIL-capability-multi-child-family-dashboard) | Lingokids (≤4 profiles), Khan Kids (per-child mastery) | Cross-child DevScore glance no competitor can generate | gated — aggregated child-data + multi-child billing. **HANDED TO PRODUCT-BACKLOG.md + IMPROVEMENT-BACKLOG.md (2026-06-21).** |
| **3.96** | **Screen-time controls for child-facing practice sessions (CIL-capability-screen-time-controls)** | Lingokids (premium screen-time limit, parent dashboard control) | Counter-position as "intentional practice, not infinite engagement" — marketing angle is safe; product build is also safe (settings-only, no child-data exposure) | Safe product build. **HANDED TO PRODUCT-BACKLOG.md + IMPROVEMENT-BACKLOG.md (2026-06-21) for arbor-practice pod. Marketing counter-narrative: "intentional practice, not infinite engagement" — safe to draft this cycle.** |
| **1.35** | **iOS/Android home-screen + lock-screen widgets for JITAI nudges + weekly digest (CIL-capability-ios-android-widgets)** | Huckleberry (SweetSpot Live Activities, Berry widget), Nanit (NextNap lock screen) | Widget surfaces the longitudinal nudge at the moment it matters — lock-screen. Depends on FCM push gap closing first. | gated (WidgetKit extension + FCM dep). **HANDED TO PRODUCT-BACKLOG.md + IMPROVEMENT-BACKLOG.md (2026-06-21) for arbor-native pod.** |
| 8 | In-product parent-coach community layer (CIL-capability-parent-coach-community) | Good Inside, Cooper | Existing second-guardian digest button is the near-term safe step. Safe landing copy fix: reference shareable artifacts as social proof layer (see §3 CIL-market-good-inside-community-landing-gap). | gated — child-data + consent + moderation. **HANDED TO PRODUCT-BACKLOG.md + IMPROVEMENT-BACKLOG.md (2026-06-21); safe copy fix split into §3.** |

**Positioning the build waits for:** Rhythm (already shipped product-side), Ask a Specialist / expert handoff (consult-REQUEST live; booking gated). Marketing writes the counter-narrative now; does not block on the gated builds.

---

### 6. Gated Decisions (Need Guy / Paid / Level 4–5)

These never auto-execute. Amounts stated; Level 4 gate on all spend.

| Item | Amount | Level | Gate Condition |
| :-- | :-- | :-- | :-- |
| **arborparentingapp.com DNS fix** — currently resolves to GoDaddy squatter. Verify registrar ownership; if owned: point DNS A+CNAME to Firebase Hosting, confirm HTTPS, prod deploy. If NOT owned: do not use this domain in any asset; pivot to arbor.family or joinarbor.com per GTM plan §4. | ~€0 (if owned; registrar transfer may cost €10–40) | **L5 brand-risk — immediate** | No viral or marketing asset ships pointing at arborparentingapp.com until it resolves to the Arbor app |
| ILS pricing for HE landing (₪ price points must be Guy-confirmed) | €0 copy change; pricing confirmation from Guy | L3 (Guy confirm ₪ anchors: suggested Free / ₪49/mo Plus / ₪75/mo Family, annual ₪449/₪690) | Guy approves ₪ price points; then copy change is safe to ship |
| IL creator wave 1 fees (40–50 creators × €20–50) | €800–1,500 | L4 | P0-3 share export live + loop smoke test passed at D-3 |
| Meta IL paid amplification | €2,200 | L4 | Day-7 K ≥ 0.3 confirmed; organic creative ≥ 3% click-to-register |
| TikTok IL paid amplification | €500 | L4 | Same day-7 gate |
| Retargeting (engaged-creator audience) | €300 | L4 | Same day-7 gate |
| NL creator wave (weeks 5–8) | €1,000 | L4 | NL activation ≥ 30% confirmed |
| AEO content production (native HE review fees) | €500 | L4 | Per guide, before publish |
| Reserve / scale winners + NL paid | €3,600 | L4 | Conditional on IL metrics hitting floor |
| Social channel creation (IG/TikTok/YouTube) | €0 but requires Guy phone/email verification | L3 | Guy action only |
| Any external publish (blog, PR, manifesto) | — | L3 | arbor-marketing-lead sign-off + arbor-safety clearance on developmental claims |
| Founding-member paywall at €89/yr | €0 launch cost | L4 guard | Do not go live until ≥50 organic App Store reviews OR press coverage appears (target day 14); default paywall path = 14-day no-card trial until that gate clears |
| Email capture / waitlist (parent email only) | €0 | L3 | arbor-safety consent-UX review of opt-in copy + explicit GDPR checkbox; then downgrade to safe |
| Referral grant activation (P0-2: free Plus month for referrer + new activate) | touches billing/entitlements | L4 | Confirm with Guy before reward activates in prod |

---

### 7. Source Docs Consolidated (Now Inputs/Archive)

- `PAI/projects/parenting-os-plugin/mesh/improvement/IMPROVEMENT-BACKLOG.md` → folded into this backlog (CIL-market-* funnel findings §3; capability bets §5; shipped commits recorded)
- `PAI/projects/parenting-os-plugin/marketing/arbor-viral-gtm-2026-H2.md` → folded into this backlog (€10k budget allocation §6; market sequencing §4; brand platform §1)
- `PAI/projects/parenting-os-plugin/marketing/arbor-marketing-backlog-v2.md` → folded into this backlog (P0–P2 items §4; kill gates §4; adversarial stress-test gaps incorporated)
- `PAI/projects/parenting-os-plugin/marketing/arbor-essence-and-viral-brief.md` → folded into this backlog (moat one-liner §1; viral artifact table §5; brand DNA anti-references inform §4 copy gates)
- `PAI/projects/parenting-os-plugin/marketing/arbor-playkit-viral-production-pack-2026-06-20.md` → folded into this backlog (produced assets §2 NOW-1; HE headline options and video scripts in NOW-5; creator brief rules inform §4 P1-2)
- `PAI/projects/parenting-os-plugin/arbor-competitive-analysis-and-feature-defs-2026-06-14.md` → folded into this backlog (8-competitor map informs §5 feature table; Rhythm/Ask a Specialist/Daily Play feature defs handed to product)
- `PAI/projects/parenting-os-plugin/PRDs/PRD_2026-06-21_arbor-viral-capable-transforming.md` → folded into this backlog (VIRAL/CAPABLE/TRANSFORMING/TRUST north stars §1; G1/G2 governance gates §1; success metrics inform kill gates §4)
- `PAI/projects/parenting-os-plugin/marketing/arbor-30-day-subscription-blitz.md` → folded into this backlog (registration model math; "child is the angle, parent is the customer" spine; pricing ladder)
- `PAI/projects/parenting-os-plugin/marketing/arbor-loop-eng-spec.md` → folded into this backlog (P0-2/P0-3/P0-4 eng specs; analytics event schema §2 NOW-7)
- `PAI/projects/parenting-os-plugin/marketing/arbor-youtube-strategy.md` → folded into this backlog (Shorts now, long-form Phase 2+; zero new production cost in ignition §4)
- `PAI/projects/parenting-os-plugin/marketing/arbor-il-creator-tracker.md` → folded into this backlog (sourcing method + Tier A/B candidate list; verify before outreach §2 NOW-3)
- `PAI/projects/parenting-os-plugin/marketing/EXECUTION-TRACKER.md` → folded into this backlog (milestone status; blocked-on-Guy items §2 NOW-10/11/12)
- `PAI/projects/parenting-os-plugin/marketing/arbor-launch-copy-pack.md` → folded into this backlog (HE + EN hero headline options; #ArborAvatar challenge; DM outreach copy)
- `PAI/projects/parenting-os-plugin/marketing/arbor-marketing-backlog.md` → superseded by backlog-v2, which is superseded by this file

---

### 8. Viral Production & Distribution Engine (the 3 new pods — working backlog)

**Standing work for the viral org pods** (`arbor-insights` · `arbor-creative` · `arbor-distribution`), the people/asset/intelligence engine behind §0's 30-day breakout. Method, cadence, and thresholds: [VIRAL-ENGINE.md](VIRAL-ENGINE.md). These execute the §0 sprint — they are not a parallel plan. Risk markers follow the mesh envelope: `safe` = autonomous to owned-organic; `L3` = draft-only, outbound to people/external communities stops for approval; `L4` = spend, state amounts.

**arbor-insights — outside-in intelligence (research)**
| ID | Item | Risk | Status |
| :-- | :-- | :-- | :-- |
| AM-I1 | **Daily trend pulse live** — TikTok Creative Center IL "fastest-growing" 7-day scan + rule-of-three on the niche feed → a 3–5 line "what's emerging · runway · suggested hook" drop to creative/distribution | safe | OPEN — stand up this cycle |
| AM-I2 | **Weekly trend + creator brief (Fri)** — rising sounds (growth-stage scored), refreshed micro-creator shortlist (10–25K, high-velocity), top public IL-FB pain-clusters, last-week post-mortem | safe | OPEN |
| AM-I3 | **IL distribution primary-research field test** — interview 2–3 IL parenting micro-creators + audit live IL FB parent mega-groups to close the under-sourced WhatsApp/FB-seeding + HE-RTL gap **before** any distribution budget commits | research safe; creator contact L3 | OPEN — blocks confident spend |
| AM-I4 | **Monthly 5-dimension competitor brief** (perception · narrative · product/feature signals · cultural fit · vulnerability) + feature-requests handed to PRODUCT-BACKLOG | safe (handoff only) | OPEN |

**arbor-creative — viral creative production**
| ID | Item | Risk | Status |
| :-- | :-- | :-- | :-- |
| AM-C1 | **Stand up the hook bank** (`mesh/marketing/hook-bank.md`) — seed ≥20 native-HE hooks across the 4 families (recognized-scenario / contrarian-correction / authority-stat / curiosity-gap), tagged by format | safe | OPEN |
| AM-C2 | **Breakout-hunt batch** — 5–7 short-form cuts/wk for the 30-day sprint (≈50% UGC/scenario · 25% clinician HeyGen · 25% animated hero), >70% intro-retention target, <40% kill; re-cut winners into 3–5 variants | safe (own-queue T2); creator seeding L3 | OPEN — primary G-4 engine |
| AM-C3 | **Animated child-as-hero format template** — reusable, RTL-correct, **generic hero only (never a real child's face/biometric)**; HeyGen + CapCut + Canva template kit | safe | OPEN |
| AM-C4 | **"שנה שלמה / The Whole Year" breakout film** — final render of the rough cut (NOW-5); Rhythm framing → `arbor-safety` | safe (publish L3; clinical framing → safety) | OPEN |

**arbor-distribution — people-side growth engine**
| ID | Item | Risk | Status |
| :-- | :-- | :-- | :-- |
| AM-D1 | **Creator CRM + outreach roster** — operationalize the IL creator shortlist (NOW-3) into a tracked roster; draft volume outreach DMs (~500→~50→~10 funnel) | drafts safe; **send = L3**; fees = L4 | OPEN |
| AM-D2 | **WhatsApp + IL-FB group seeding playbook** — native-HE seed templates per group type (class-group vs mega-group register), value-first, link-in-first-comment | playbook safe; **seeding into external communities = L3** | OPEN |
| AM-D3 | **Ambassador program** — recruit 5–10 trusted IL group parents (free Family, no post requirement); draft onboarding + briefing | drafts safe; **outreach = L3**; Family grant = L4 | OPEN |
| AM-D4 | **Owned-channel publishing calendar live** — 5–7 days queued at all times across IG/TikTok/YouTube/FB at platform-native times; comment-ladder mining | safe (own channels = T2) | OPEN |
| AM-D5 | **#הגיבורשלי / #ArborHero UGC challenge activation** — draft challenge brief + seeding script + community activation copy (top-N win Family plan) | drafts safe; **launch publish = L3**; prize grant = L4 | OPEN |

> **Dependency:** AM-D1/D2/D3/D5 outbound and AM-C2 creator seeding all wait on the §0a critical-path unlocks (brand domain live, social channels, `/join?ref=` loop) before the gated send/seed fires — the *drafts and the playbook are built now*, autonomously, so the moment Guy clears the gates the engine runs.

---

### 9. Capability-map repositioning — "four → six surfaces" (2026-06-22)

**Trigger (Guy):** the marketing surface undersold Arbor as "four products in one," omitting **Grow/Practice Studio, Care, and Academy.** Fix = the full per-surface competitive benchmark in [CAPABILITY-MAP.md](CAPABILITY-MAP.md) → an honest **one child OS, six surfaces** spine (BRAND-STRATEGY §3/§5 updated) → a six-pillar viral engine + the feature-gaps it exposes. **Strategic call:** one product, six surfaces — *not* sub-brands; the wedge still leads, breadth proves the moat.

**9a. Feature-requests handed to PRODUCT** (from the capability×competitor map; full detail + scores in [CAPABILITY-MAP.md](CAPABILITY-MAP.md) §FR). Marketing owns the counter-narrative; product owns the build. Route to `PRODUCT-BACKLOG.md` / `mesh/improvement/IMPROVEMENT-BACKLOG.md` via `arbor-orchestrator`.

| FR | Pillar | Gap → why it gates marketing | Risk | Pri |
| :-- | :-- | :-- | :-- | :-- |
| **FR-7** | My Child | Infant age stored in YEARS → 0–24mo cohort broken; can't market baby-coverage vs Kinedu/BabySparks/Huckleberry (correctness bug, also tracked in §5 infant-age item) | gated | **P0** |
| **FR-3** | Today | Ambient capture (voice/widget, ≤3 taps) — log volume is the moat's fuel; thins every personalization claim if hard | safe | **P0** |
| **FR-5** | Ask/Care | Specialist booking+payment+video — the Care/Specialist viral angle is deployment-gated until live | gated | P1 |
| **FR-10** | Grow | Practice Studio feedback-loop verify + parent dashboard/session limits — the "writes to the record" hook gates on this | safe | P1 |
| **FR-1** | Today | Push/widget at the predicted Rhythm window — the "I was right" share mechanic needs ambient delivery | gated | P1 |
| **FR-12** | Care | Web/PDF export the parent's *own* pediatrician can open without the app — makes Trusted Sharing real | safe | P1 |
| **FR-6** | My Child | Data portability (export + GDPR erasure UI) — the parent-owned counter to Nanit's coming longitudinal moat | gated | P1 |
| FR-2 / FR-8 / FR-9 / FR-4 / FR-11 | Today/My Child/Grow/Academy/Ask | library depth · surface Language tracking · 20+ named-expert Masterclasses · community layer · Growth-Plan completion mechanics | mixed | P2 |

**9b. Six-pillar viral content engine** (each surface = its own competitor-kill + content angle; one record narrative runs through all). Per [VIRAL-ENGINE.md](VIRAL-ENGINE.md) formats. ECD + safety gate each.

| ID | Pillar | Hook (kills on camera) | Format | Gate · Pri |
| :-- | :-- | :-- | :-- | :-- |
| **AM-NEW-0** | **Convergence (landing)** | **Rebuild the landing "four → six surfaces" section + add Practice Studio & Arbor Care cards, EN+HE native parity** (EN one-liner already corrected in `arbor-marketing-landing-page-en.html`; HE + full section pending) | landing copy + cards | safe draft; **L3 publish/deploy** · **P0** |
| **AM-NEW-1** | Convergence | *"The whole stack you're paying for — in one bill."* six incumbents + prices → "one record none of them can become" | Canva carousel / HeyGen | safe · **P0 (highest-leverage — ship before surface-specific content)** |
| AM-NEW-2 | Rhythm | *"Huckleberry predicts your next nap. Arbor predicts your whole evening."* "I was right" share card | static + caption (HE+EN) | safe · P0 (W2 sprint) |
| AM-NEW-3 | Memory | Monthly Growth Card auto-gen (HeroAvatar, never a real face) — the viral payload | product+mktg | product-gated (share export P0-3) · P0 |
| AM-NEW-4 | Daily Play | *"The activity Kinedu can't suggest — it hasn't read this week's logs."* why-Arbor-picked-this reveal | UGC | safe · P1 |
| AM-NEW-5 | Ask Arbor | *"Good Inside has Dr. Becky. Arbor has your child's actual record."* cited-answer card | static + caption | safe · P1 |
| AM-NEW-8 | Arbor Care | *"Instead of re-explaining your child at every appointment — send the brief first."* (warm-handoff framing only) | HeyGen talking-head | safe **if no live-marketplace claim** · P1 |
| AM-NEW-6 | Baby 0–2 | baby-track launch content | landing+social | **HELD — gated on FR-7 fix** |
| AM-NEW-7 | Practice Studio | *"Speech Blubs shows a streak. Arbor tells the coach what your kid practiced."* | UGC | **HELD — gated on FR-10 loop verified** |

> **Deployment gates (from CAPABILITY-MAP):** Practice Studio + Arbor Care + Development-Check carry product-state limits — the positioning is honest, but AM-NEW-7/8 and any "speak to a specialist" / "screens for" claim wait on FR-5/FR-10 + clinical sign-off. The highest-leverage move this week is **AM-NEW-1 (the convergence carousel)** — it establishes the organism so every surface-specific piece reads as proof, not a feature claim.
