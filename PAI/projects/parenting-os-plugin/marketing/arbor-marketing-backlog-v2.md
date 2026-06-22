# Arbor Marketing Backlog v2 — Viral in 30 Days
**Owner:** arbor-marketing-lead
**Created:** 2026-06-21
**Markets:** Israel-first → NL → BE/IE/UK
**Budget:** ~EUR 10k / 6 months (EUR ~4.5k first 30 days; EUR 3k of that is paid spend, Level 4 gate)
**Source slices merged:** Acquisition Engine, Creative/Content Engine, SEO/AEO Engine, Conversion/Retention Engine

---

## Thesis

Arbor's 30-day viral window rests on a single structural truth: **the child is the acquisition angle, the parent is the paying customer.** The Hero Comic — a one-tap registration-gated artifact where a parent's child becomes a comic superhero — is the same magnet class as Remini and EPIK AI Yearbook, but with a structurally higher emotional charge because it is about the parent's kid, not a selfie. That magnet earns the registration. But a registration that receives only a cute comic churns within two weeks. The anti-collapse move is the Double Aha: in the same 90-second first session, the parent must also receive a real win for themselves — a calm Read / Risk / Do-tonight answer that uses their child's actual context, plus a Rhythm peek and a Daily Play card. Acquire through the child; convert and retain through parent value. Every item in this backlog traces back to that spine. The two engineering builds that make registrations compound rather than add — the branded share export with embedded referral deep-link (P0-3) and the referral reward grant (P0-2) — are the non-negotiable gates on the viral K-factor loop. Without them, K stays at zero; with them, one parent sharing a Hero Comic in a WhatsApp class group reaches 30-40 other parents at near-zero CPM. All paid spend is withheld until day-7 K-factor confirms the loop is working.

---

## Phase 1 — Pre-Launch (Days -7 to 0)

### P0 Items

#### P0-1 | Branded Domain + WhatsApp-Optimized Share URL
**Owner:** arbor-acquisition (spec) → arbor-api pod (DNS + OG tags) → Guy (domain purchase, Level 4 ~EUR 100/yr)
**Outcome metric:** registrations
**Effort:** S
**Eng dependency:** DNS + Open Graph tag implementation on arbor-api
**What:** Replace arborprd-westeu.web.app with arbor.app / arbor.family / arbor.co.il. Wire all share artifacts, referral deep-links, and creator tracking links through the branded domain. Ensure Open Graph preview (title, image, description) renders correctly inside WhatsApp — test on iOS and Android before anything ships. A web.app URL kills trust and preview cards in WhatsApp, which is IL's primary viral substrate. This is the single atom every downstream loop depends on.
**Why it gates everything:** 99% IL WhatsApp penetration. A broken or untrustworthy URL cuts click-through ~40-60% before the funnel starts.

#### P0-2 | Referral Reward Grant — Free Plus Month for Both Sides on Activation
**Owner:** arbor-acquisition (spec + event schema) → arbor-billing pod (entitlement grant) → arbor-growth pod (activation event)
**Outcome metric:** registrations
**Effort:** M
**Eng dependency:** arbor-billing entitlement grant; loopEvents.ts event schema (referral_invited, referral_installed, referral_activated); activation event tied to child profile created + first coach interaction
**What:** When a referred user registers via referral deep-link AND completes the activation event (child profile + first coach interaction), both referrer and new registrant receive one free Plus month credited automatically. Reward fires on activation, not registration, to eliminate low-intent installs inflating the reward pool. This is one of the two engineering builds that converts registration addition into compounding.
**Why it gates everything:** Reward-on-activation design self-selects for quality — only users who complete the real aha trigger the reward. The Plus-month reward exposes the parent to Rhythm and Daily Play (highest retention signal features), making the reward itself a retention driver.

#### P0-3 | Branded Share Export with Embedded Referral Deep-Link (K-Engine Build)
**Owner:** arbor-acquisition (spec + attribution schema) → arbor-avatar pod (image export) → arbor-api pod (deep-link resolver)
**Outcome metric:** registrations
**Effort:** M
**Eng dependency:** arbor-avatar image composition layer; arbor-api deep-link resolver at arbor.app/join?ref=PARENTCODE; 1080x1080 (WhatsApp-native) and 9:16 (Reels/TikTok-native) export formats
**What:** Single-tap "Share your kid's comic" button exports a branded sage-paper + emerald-clay image with the child's HeroAvatar as the panel hero, the child's first name, and a referral deep-link baked as text + QR in the bottom margin. On install via the deep-link, both parent and friend receive the P0-2 reward. No share mechanic ships without this. This is the second of the two engineering builds that make registrations compound.
**Why it gates everything:** K = (invites sent per user) x (conversion per invite). Without one-tap branded export carrying the referral token, K stays at 0. With it, every parent who shares becomes a distribution node. One share in a WhatsApp class group of 30-40 parents is structurally equal to one paid impression reaching 30-40 ICPs at near-zero CPM.

#### P0-4 | K-Factor Daily Dashboard — loopEvents Instrumentation Live Before Launch
**Owner:** arbor-acquisition (event schema + dashboard spec) → arbor-api pod (lib/analytics.ts, lib/attribution.ts, lib/loopEvents.ts)
**Outcome metric:** registrations
**Effort:** S
**Eng dependency:** loopEvents.ts writes; Firestore query or lightweight Metabase view
**What:** Before a single creator posts, these events must resolve end-to-end: share_initiated, share_completed, referral_link_clicked, install_attributed, referral_activated. Dashboard: daily K-factor = referral_activated / share_completed; share funnel (initiated → completed → clicked → installed → activated); top referral sources. Day-7 kill gate: if K < 0.3, do not spend paid — fix share friction first.
**Why:** A loop you cannot measure is not a loop. The kill gate prevents burning EUR 3k paid behind a broken loop.

#### P0-5 | Hero Comic Free Magnet Funnel — Registration-Gated, No-Card, 60-Second Aha
**Owner:** arbor-acquisition (funnel spec + conversion targets) → arbor-design pod (landing) → arbor-avatar pod (comic gen) → arbor-content (Hebrew copy)
**Outcome metric:** registrations
**Effort:** M
**Eng dependency:** arbor-avatar comic generation pipeline; Apple/Google one-tap auth; child name + age-band two-field onboarding; referral share button post-comic
**What:** Dedicated landing screen (mobile-first, Hebrew-first). Single CTA above the fold: "Make your child a superhero — free." Apple/Google one-tap auth only — no email form, no card. Post-register: child name + age-band (two fields, 10 seconds) → HeroAvatar generates → comic panel appears → share button fires. Concurrently in the same 90-second session: Arbor prompts "What's one real worry about [child name] right now?" → returns the Read / Risk / Do-tonight response using child context. Both ahas must fire in the same session. Target: landing-to-register ≥ 45%.
**Why:** The Double Aha in one session is the Lensa-collapse antidote. The comic acquires; the parent value retains. Without the parent aha in session 1, comic novelty collapses in 2 weeks.

#### P0-6 | Double Aha Onboarding Flow — 90-Second Parent Win
**Owner:** arbor-acquisition (funnel architecture) + arbor-content (copy/flow script) coordinated with product pod
**Outcome metric:** paid subscriptions
**Effort:** M
**Eng dependency:** Post-registration flow sequencing; coach prompt surfaced inline post-comic; Rhythm peek and Daily Play card in same session; no paywall until sequence completes
**What:** Beat 1 (0-45s): HeroAvatar creation + first Hero Comic panel rendered. Beat 2 (45-90s): immediately after comic appears, a single warm prompt — "One thing you want to understand about [child name] right now?" — returns a calm Read / Risk / Do-tonight answer. Then Rhythm peek ("tomorrow's likely friction window: ~5pm") and Daily Play card for today. Zero navigation required. No paywall until this full sequence completes.
**Why:** The paying parent is the parent who felt "this app actually gets my kid" in session 1. Without this, register-to-paid conversion stays at floor. This is the architectural prerequisite for every conversion item.

#### P0-7 | Founding-Member Paywall — Fired at the Value Peak
**Owner:** arbor-acquisition (paywall logic + A/B test) + arbor-content (offer copy + Hebrew review gate) → arbor-billing pod
**Outcome metric:** paid subscriptions
**Effort:** S
**Eng dependency:** arbor-billing entitlement; paywall trigger event spec (post-coach-answer OR first locked Rhythm/Daily-Play tap); founding-member slot counter (cap 500, live count); RevenueCat A/B test variant
**What:** Time-boxed, scarcity-anchored Plus offer: EUR 89/yr (vs EUR 119/yr standard), first 500 families only, countdown visible, badge for life. Fires at exactly two trigger events: (1) parent's first coach answer lands, or (2) parent taps a locked Rhythm or Daily Play teaser. Never at signup, never without an aha. Default toggle is annual. A/B test variant B: 14-day no-card Plus trial at the same trigger. Hebrew copy native-reviewed before IL ship.
**Why:** Post-aha paywall timing converts ~5x higher than cold-signup paywalls (RevenueCat 2026). Annual default yields 2-3x better 12-month retention vs monthly. EUR 89 upfront compresses CAC payback to near-zero for converted founders.

#### P0-8 | HE AEO Guide Hub — "Is This Normal?" in Hebrew (Answer-Engine Capture)
**Owner:** arbor-seo + arbor-content (native Hebrew review gate non-negotiable)
**Outcome metric:** registrations
**Effort:** M
**Eng dependency:** Public /he/is-this-normal/ route; FAQ JSON-LD schema; hreflang he/en reciprocal tags; arbor-safety clearance on developmental language
**What:** Single densely-authoritative Hebrew guide at /he/is-this-normal/ answering the 15 highest-volume "is this normal?" queries: no words at 2, tantrum at 18 months, night waking at 3, hitting siblings, speech delay signs, selective eating, school refusal, and more. Each question: 150-200 word answer in Arbor's calm voice (Read / Risk / Do-tonight structure), followed by "your child's answer may differ — Arbor remembers the full picture" CTA with registration deep-link. FAQ JSON-LD on every Q/A block for Google AI Overviews and ChatGPT citation. Target: appear as cited source in Hebrew ChatGPT/Gemini/Perplexity within 30 days of indexing. Must ship before BabySparks entrenches Hebrew AEO — competitive window closes in 30-60 days.
**Why:** Gartner projects traditional search down 25% by 2026 as AI Overviews absorb zero-click queries. The parent who fear-Googles at 2am in Hebrew is Arbor's exact buyer. If Arbor's guide is what ChatGPT cites, the parent arrives pre-warmed. BabySparks has Hebrew App Store presence and "Ava" AI positioning — first-mover in Hebrew AEO is a durable competitive moat.

#### P0-9 | EN + HE Landing Page Copy — Full Native Asset Slate
**Owner:** arbor-content (all copy); native HE reviewer gate; arbor-safety (developmental claims review); arbor-marketing-lead (sign-off)
**Outcome metric:** registrations (landing-to-register ≥ 45%)
**Effort:** M
**Eng dependency:** RTL rendering verified; WCAG AA contrast; paywall copy module separate (fires post-aha only, not on landing)
**What:** Full copy deck for both languages, written to native voice — HE written first (Frank Ruhl Libre + Heebo, RTL, Israeli-parent idiom: gan, kupah, tipat chalav), EN is a parallel draft not a translation. Sections: hero block, magnet proof block (comic visible), parent value ladder (Rhythm / Daily Play / 2am answer / the memory — each 1-2 sentences, no adjective stacking), competitive counter-line ("כל אפליקציה נותנת לך תוכן. ארבור מכיר את הילד שלך."), social proof block (3 parent micro-testimonials + 1 professional voice), trust block ("לא אבחנות. לא שיווק פחד. הנתונים שלך, הילד שלך.").
**Why:** A translated-feeling Hebrew page kills trust before the product earns it. The competitive counter-line and trust block must land as native phrases. The landing is the single conversion point for every paid and organic acquisition dollar.

#### P0-10 | Technical SEO — hreflang Audit + Canonical Fix + Hebrew-First Sitemap + Robots.txt
**Owner:** arbor-seo
**Outcome metric:** registrations
**Effort:** S
**Eng dependency:** /sitemap.xml; /robots.txt; canonical URL updates after custom domain live; hreflang reciprocal links between all HE/EN pages
**What:** (1) Audit and fix hreflang alternate tags across EN and HE landings — verify reciprocal links present and matching. (2) Resolve x-default to the correct page (not a 404 directory). (3) Update all canonical and schema URLs from arborprd-westeu.web.app to production domain once live (dependent on P0-1). (4) /sitemap.xml: HE landing and AEO hub at priority 1.0, EN at 0.9, other marketing pages at 0.7, changefreq: weekly for guide hubs. (5) /robots.txt: explicitly allow GPTBot, ClaudeBot, PerplexityBot, anthropic-ai, cohere-ai with Sitemap: directive. Submit to Google Search Console and Bing Webmaster Tools on ship day. (6) Verify no duplicate-content risk between arbor-landing.html, arbor-marketing-landing-page-en.html, and arbor-marketing-landing-page-he.html.
**Why:** Broken hreflang is the single most common reason multilingual pages fail in the correct country/language. AEO is only possible if crawlers can discover and index content. S-effort with outsized impact — directly gates the IL organic channel.

#### P0-11 | 2am Emotional Hook Landing Variant — "Stop Fear-Googling Your Kid"
**Owner:** arbor-content (Hebrew + EN copy) → arbor-design pod (landing variant) → arbor-acquisition (A/B attribution)
**Outcome metric:** registrations
**Effort:** S
**Eng dependency:** A/B variant routing; same no-card one-tap register flow; UTM attribution split by variant
**What:** A second landing variant targeting the worried-parent segment. Hebrew headline option A: "מפסיקים לגגל בלילה." English: "Stop fear-Googling your kid at 2am." Below: a single parent story — 2am, the child did X, the parent opened Arbor, got a Read / Risk / Do-tonight answer that knew their child's history, felt calm for the first time in weeks. CTA: "Get a calm answer — free." Same no-card one-tap register flow but the aha sequence leads with coach answer first, comic second. A/B test both variants from day 1; let data determine which converts higher before scaling paid behind the winner.
**Why:** Some parents register for the superhero comic; others for the calm answer. Two emotional doors targeting distinct segments maximizes total addressable register-rate. 48% of parents describe stress as "completely overwhelming" (US Surgeon General 2024); 81% have used AI for parenting tasks (Lurie Children's 2026).

#### P0-12 | SoftwareApplication + FAQPage Schema Upgrade on Landing Pages
**Owner:** arbor-seo
**Outcome metric:** registrations
**Effort:** S
**Eng dependency:** JSON-LD additions only; no layout changes; coordinate with arbor-content for FAQ copy before merge
**What:** Four structured-data upgrades in one PR: (1) Add MobileApplication type alongside SoftwareApplication with operatingSystem: [iOS, Android, Web] and correct store URLs once live. (2) Add aggregateRating stub (even a single honest review count unlocks star display in AI summaries). (3) Add FAQPage schema on each landing with 5 Q/A pairs answering top conversion objections (Is it safe? Does it replace a doctor? What does the AI remember? Is my child's data private? Does it work in Hebrew?). (4) Update dateModified to current date and set datePublished correctly. Validate with Google Rich Results Test before merge.
**Why:** AI answer engines use structured data as a primary trust signal when recommending apps. MobileApplication schema with store URLs makes Arbor directly citable in "best parenting app for Israel" queries. S-effort JSON-LD additions on already-indexed pages with outsized AEO impact.

---

### P1 Items

#### P1-1 | 40-50 IL Hebrew Micro-Creator Saturation Wave — Coordinated Launch Day Drop
**Owner:** arbor-acquisition (creator roster spec + affiliate tracking) → arbor-marketing-lead (outreach + contracts, Level 4 for spend) → arbor-content (Hebrew creator brief)
**Outcome metric:** registrations
**Effort:** L
**Eng dependency:** Affiliate link tracking; P0-3 share export live before creator briefing
**Budget:** EUR 800-1,500 creator fees (Level 4 confirm before spend)
**What:** Recruit 40-50 Israeli Hebrew parenting micro-creators (IG, TikTok, YouTube Shorts; 5k-80k followers). Segments: parenting lifestyle parents, SLP accounts, kindergarten teachers, family photographers, "ima shel..." accounts. Deliverable per creator: one 15-30s Reel/TikTok of their real child's Hero Comic being generated with genuine parent reaction, ending with affiliate referral link. Small fee (EUR 20-50 per creator) + affiliate code earning 20% of subscriptions from referrals for 3 months. All 15+ launch-day creators post within a 4-hour window — the simultaneous saturation mechanic makes the product feel ubiquitous, not advertised.
**Why:** IL Meta CPMs ~EUR 8 vs EUR 20 global. 40+ trusted micro-voices near-simultaneously reads as social proof of ubiquity, not a paid campaign. SLP and kindergarten-teacher segment carries institutional trust. Affiliate codes make creators economically motivated to drive activations, not impressions.

#### P1-2 | Creator Seed Kit — 50 IL Micro-Creator Brief Package (HE)
**Owner:** arbor-content (all copy: brand note, captions, do/don't pairs, response guide); arbor-marketing-lead (creator roster, onboarding, code setup); native HE reviewer gate
**Outcome metric:** registrations
**Effort:** M
**Eng dependency:** Affiliate code generation; P0-3 branded export live
**What:** Complete ready-to-share brief for the 40-50 Hebrew creators. Contents: (1) One-page brand-voice note in Hebrew — what Arbor is in one line, three things to show, three things to never say (no diagnostic claims, no fear language, no "replaced the kupat-cholim nurse"). (2) 90-second "how to film" guide — exact 4-shot sequence for Hero Comic reveal. (3) Five HE caption options per video type ready to paste. (4) Affiliate-code setup instruction. (5) Three sample "do this, not that" caption pairs. (6) Response guide: how to reply to comments asking "what if my child has a delay?" — redirect warmly to professional care, not Arbor as a diagnostic tool.
**Why:** A bad creator post — one that makes a clinical implication or uses fear language — can generate WhatsApp backlash that kills the launch day in hours. The brief prevents that. Five ready-to-paste caption options means creators post within 10 minutes of receiving the kit.

#### P1-3 | WhatsApp Class/Gan Group Seeding — Value-First via Parent Ambassadors
**Owner:** arbor-acquisition (ambassador program spec + seeding playbook) → arbor-marketing-lead (ambassador outreach)
**Outcome metric:** registrations
**Effort:** M
**Eng dependency:** P0-1 branded domain live; P0-3 share cards WhatsApp-optimized
**What:** Recruit 2-3 parent ambassadors per major IL city (Tel Aviv, Jerusalem, Haifa, Beer Sheva, Rishon LeZion) — parents who are trusted admins or active members of WhatsApp class/gan groups. Their role: share their genuine child's Hero Comic in their parent group as a real parent moment. Script the intro in Hebrew — a personal note, never a marketing message. Target: 30 WhatsApp groups seeded in the first 7 days. Hard rules: no bulk adds, no self-promotional language, no affiliate codes visible in the WhatsApp message — referral code lives in the deep-link baked into the shared image.
**Why:** WhatsApp class/gan groups are IL's highest-trust, highest-density parent network. 99% penetration means every IL parent of a school-age child is in at least 2-3 active class groups. One share from a trusted group member to 30-40 parents has the conversion economics of a highly targeted ad placement at EUR 0 CPM.

#### P1-4 | Hero Comic Launch Reel (HE + EN) — The Magnet Creative
**Owner:** arbor-content (script + caption); arbor-avatar pod (render pipeline sanity check); arbor-marketing-lead (shoot logistics + creator brief)
**Outcome metric:** registrations
**Effort:** M
**Eng dependency:** arbor-avatar render pipeline; P0-3 branded export for final frame QR
**What:** A 12-15 second vertical video (Reel/TikTok/Short) showing a real parent uploading their child's photo, watching the HeroAvatar animate, and the comic panel appear. Zero voiceover; text overlay only. HE caption: "הילד שלך כגיבור-על. בחינם." EN: "Your kid as a superhero. Free." Final frame: QR + referral link. Three variants: baby (0-2), toddler (3-5), school-age (6-10). Produced in the sage-paper + emerald-clay palette with ink-outline halftone comic frame visible. This is the single creative asset the entire 30-day acquisition engine rides on.
**Why:** Same magnet class as Remini AI headshots and EPIK AI Yearbook but with higher emotional charge — the artifact is about the parent's CHILD, not a selfie. WhatsApp preview card renders the comic thumbnail natively — one share in a class group reaches 30-40 parents at near-zero CPM.

#### P1-5 | "הגיבור שלי" / "My Hero" UGC Challenge — Hashtag + 7-Day Window
**Owner:** arbor-marketing-lead (challenge orchestration) → arbor-content (Hebrew hashtag copy + rules) → arbor-acquisition (engagement tracking + winner attribution)
**Outcome metric:** registrations (K-factor)
**Effort:** M
**Eng dependency:** P0-3 share export with referral code; engagement tracking
**What:** 7-day UGC campaign launching on Day 1 alongside the creator wave. Hashtag: #הגיבורשלי (HE) + #MyArborHero (EN). Challenge prompt: post your child's Hero Comic, tag three parent friends, include your referral link. Arbor reshares the best submissions daily. Day-3 escalation: "screenshot the meltdown you called it" Rhythm sub-challenge. Top 10 parent-generated posts (by engagement, not follower count) earn a free Family plan for 6 months — announced on day 7. Moderation: no child faces reshared without explicit parent opt-in (consent form in seed kit).
**Why:** UGC challenge mechanics provide near-zero-CPM reach extension. Every parent who posts reaches their own follower graph with a warm first-person testimonial, which converts at 4-8x the rate of a branded ad. The 7-day window creates time urgency. IL TikTok daily active rate 55%, IG 67%.

#### P1-6 | Rhythm Daily Habit Card — The Check-It-Every-Morning Loop
**Owner:** arbor-content (card copy + push notification strings + Hebrew) coordinated with product pod (Rhythm feature, push permission flow)
**Outcome metric:** paid subscriptions + retention
**Effort:** M
**Eng dependency:** Rhythm feature live; push notification opt-in flow; free-user blur/teaser state for Rhythm day-bar; daily Rhythm open rate as leading KPI
**What:** Rhythm surfaces as a persistent card on the Overview screen — a horizontal day-bar with predicted friction/calm/focus windows in the semantic ramp (amber=friction, green=calm, blue=focus). Morning push notification (opt-in): "[Child name]'s rhythm for today — calm window opens at 9am, friction likely ~5pm." For free users: day-bar blurred with one preview window visible — "Rhythm predicts [child name]'s full day. Plus unlocks it." This teaser is the second paywall trigger. Target: ≥35% daily Rhythm open rate among Plus users as the primary leading retention KPI.
**Why:** Rhythm is the check-it-daily habit engine — the parenting equivalent of a weather app. Once a parent builds the habit of checking "[child name]'s rhythm this morning," Arbor becomes infrastructure, not a tool. The share artifact ("Arbor predicted my kid's 5pm meltdown — and it was right") is a referral without a referral button.

#### P1-7 | Rhythm "Prediction Was Right" Share Card — Organic Viral Unit
**Owner:** arbor-content (share card design in brand DNA, Hebrew + English caption copy) coordinated with product pod (prediction-match detection, badge logic, share export)
**Outcome metric:** registrations (K-factor) + retention
**Effort:** S
**Eng dependency:** Rhythm prediction-match detection (±90 min tolerance); badge surfacing; share export using P0-3 pattern; loopEvents.ts artifact_type: "rhythm_card"
**What:** When Rhythm's predicted friction window matches a logged behavior event within ±90 minutes, the app surfaces a subtle badge: "Rhythm called it." Parent can tap → see prediction vs actual overlay on the day-bar → one-tap "Share the proof." The exported card: sage-paper branded image showing "[Child name]'s 5pm friction window — Arbor called it 18 hours ago." Hebrew pre-written caption: "ארבור ניבא את ההתפרצות השעה 17:00 של [שם הילד] — ובדיוק זה קרה." Target: ≥15% of Rhythm users share at least one prediction card in month 1.
**Why:** The "uncanny prediction" share moment reaches a different parent segment than the comic delight — the analytical, skeptical parent who wants evidence. Two distinct share artifacts doubling total addressable share surface without cannibalization. Huckleberry structurally cannot produce this because its predictions are sleep-only.

#### P1-8 | Founding-Member Plus Offer — EUR 89/yr Scarcity Close, First 500 Families
**Owner:** arbor-billing pod (entitlement + counter) → arbor-design pod (paywall screen) → arbor-content (Hebrew copy) → arbor-acquisition (paywall trigger event spec)
**Outcome metric:** paid subscriptions
**Effort:** S
**Eng dependency:** Already covered by P0-7; this item is the marketing copy and positioning layer for the same paywall mechanic
**What:** Positioned as "founding-member status" — a badge in the app, listed as a founding family, locked-in pricing forever. Paywall copy in Hebrew: "הצטרפי/הצטרף כמשפחה מייסדת — 500 מקומות בלבד." EUR 89/yr is structurally chosen: above Huckleberry Plus EUR ~68.88/yr (positioning Arbor as the premium OS), below EUR 119/yr standard (meaningful scarcity saving). Counter on the paywall shows remaining founding slots live.
**Why:** Post-aha paywall timing converts ~5x higher than cold-signup (RevenueCat 2026). Annual is 2.4x more profitable and 2-3x better retained than monthly. Real scarcity (500 slots enforced by billing layer) converts at higher rates than perpetual discounts.

#### P1-9 | Hebrew-Native Landing Copy — Full HE/RTL Asset Slate
**Owner:** arbor-content (all copy); native HE reviewer (non-negotiable gate); arbor-marketing-lead (sign-off); arbor-safety (developmental claims review)
**Outcome metric:** registrations
**Effort:** M
**Eng dependency:** RTL rendering; Frank Ruhl Libre + Heebo font loading; WCAG AA contrast
**Note:** This item executes the Hebrew execution of P0-9 scope. Covered under P0-9; tracked separately here as a delivery gate to ensure native HE review does not block the EN landing from shipping independently.

#### P1-10 | EUR 3k Paid Amplification — Days 8-21, Behind Proven Organic Creatives Only
**Owner:** arbor-acquisition (paid strategy + channel spec) — Level 4 confirmation required from Guy/CoS before activation
**Outcome metric:** registrations (paid-attributed; CAC target < EUR 40)
**Effort:** M
**Eng dependency:** K-factor dashboard live (P0-4); UTM attribution per channel; organic creatives cleared day-7 gate
**Budget:** EUR 3,000 total — EUR 2,200 Meta IL + EUR 500 TikTok IL + EUR 300 retargeting (Level 4: confirm + state amounts before any spend)
**What:** On day 7, read the K-factor dashboard and organic creative performance. If K ≥ 0.3 AND at least 2 organic creatives demonstrate >3% click-to-register rate: allocate EUR 3,000 paid behind those specific creatives only. Meta campaign structure: Advantage+ audience (broad) + one narrow retargeting set (engaged with creator content prior 7 days). IL CPMs at EUR 8 mean EUR 2,200 buys ~275,000 IL impressions. Kill gate: if K < 0.3 by day 7, hold all paid — fix share friction first. Kill any ad set at EUR 60 spend with zero registrations.
**Why:** Paid behind proven organics is amplification of a working signal, not speculation. IL CPM advantage makes EUR 3k equivalent to EUR 7k+ buying power in NL or UK. The day-7 gate prevents burning budget behind a broken loop.

#### P1-11 | Per-Capability Child Demo Videos — Hero World Series (6 Shorts)
**Owner:** arbor-content (scripts + caption copy for all six + brand-voice review); arbor-avatar pod (render assets); arbor-marketing-lead (production logistics + creator brief templates)
**Outcome metric:** registrations
**Effort:** L
**Eng dependency:** arbor-avatar render pipeline; real app UI on screen (not mockups)
**What:** Six 20-30s vertical demos, each showing one Arbor capability through the real PlayKit world. Series: (1) Hero Comic Creator, (2) Rhythm Card — "Arbor predicted the 5pm meltdown", (3) Daily Play — household-item activity with "what this builds" frame, (4) Practice Studio / Speech Coach, (5) Feelings Lab, (6) Growth Card reveal. Each ends: "הילד שלך. הסיפור שלו." / "Your kid. Their story." Ships as Reel, TikTok, and YouTube Short. HE and EN caption variants for each.
**Why:** The Hero Comic magnet acquires; this series retains attention across the first seven days. Different capabilities reach different parent segments. Each video is also a creator brief in miniature — a micro-creator can replicate the concept with their own child in under 5 minutes, generating authentic UGC.

#### P1-12 | Lifecycle Email + Push Sequence — 7-Email Onboarding Arc (HE Primary, EN Secondary)
**Owner:** arbor-content (all 7 emails, both languages, 3 subject variants each); native HE reviewer gate; arbor-safety (email 3/5 behavioral language review); arbor-acquisition pod (sequence automation setup)
**Outcome metric:** paid subscriptions (target: 4-8% of registrants who open ≥3 emails convert to Plus)
**Effort:** M
**Eng dependency:** Email automation tooling; segmentation: if parent has NOT opened app since day 1, day-2 email pivots to 2am hook; arbor-billing entitlement for founding-member offer in email 6
**What:** Seven emails in the first 14 days post-registration. Arc: Day 0 (immediate): welcome + what to do in the next 5 minutes. Day 1: what Arbor learned from the first session + Rhythm preview. Day 3: Rhythm prediction follow-through, social proof. Day 5: Daily Play introduction for their child's age. Day 7: a real coach answer to a common worry, normalized and warm. Day 10: founding-member Plus offer EUR 89/yr, time-boxed to 72 hours, no pressure language. Day 14: final value recap + "what you've built in two weeks" (the memory summary), gentle second offer if not converted. Subject line: 3 variants per email for A/B split.
**Why:** The paid conversion window is tightest in the first 14 days — after day 14, free-to-paid rates decay sharply. Emails 1-5 are entirely value delivery, no selling. The founding-member offer in email 10 fires at a modeled value peak (after Rhythm has been experienced and the parent has a 7-day coach history).

#### P1-13 | The Sturdy Parenting Manifesto — Long-Form Content Anchor (HE + EN)
**Owner:** arbor-content (full draft, both languages); native HE reviewer; arbor-safety (clinical/developmental claims review); arbor-marketing-lead (distribution to IL tech press + parenting newsletters, Level 3 for publish)
**Outcome metric:** registrations (brand-trust funnel) + email list building
**Effort:** M
**Eng dependency:** None — editorial and distribution item
**What:** 600-800 word brand philosophical declaration. Title options: HE: "גידול ילדים אמיץ" / "לא פחות — הורות שמחזיקה." EN: "Raise Them Sturdy: The Case Against Fear-Based Parenting." Argument: (1) gentle-parenting wave is fracturing — burnout rising, not falling; (2) the answer is warmth with structure; (3) 48% overwhelming stress is documented — a public health moment; (4) what your child needs is a parent who is calm and competent; (5) Arbor is built for that parent. Voice: the Peterson DNA translated to parenting language — direct, warm, non-preachy, high-agency. Ends: "That's why we built Arbor." Distributed as IL parenting blog post (Hebrew), LinkedIn thought leadership (EN), email #1 of lifecycle sequence (abridged).
**Why:** No major app in the IL market owns the "warmth-with-structure" position. A manifesto that says "we think about parenting the same way you do" earns trust that an ad cannot buy. IL parenting press will pick it up as a story. The gentle-parenting wave fracture is a verified cultural moment (PLoS ONE 2024).

#### P1-14 | IL-First AEO Guide: "שעות שינה לפי גיל" — Capture Huckleberry's Core Intent in Hebrew
**Owner:** arbor-seo + arbor-content (native Hebrew copy review gate)
**Outcome metric:** registrations
**Effort:** M
**Eng dependency:** Public /he/sleep-by-age/ route; Article or HowTo schema with age-band sections; internal links to HE landing and "is this normal?" hub; arbor-safety clearance (non-diagnostic framing, AAP/WHO sources cited)
**What:** Standalone Hebrew guide targeting "כמה שעות שינה לילד בן X". Covers ages 0-12 in band format, each with medically-sourced range (AAP/WHO), "signs your child is not getting enough" checklist, and Rhythm-anchored CTA: "Arbor's Rhythm predicts YOUR child's actual sleep window from your logs — not this table." Target: rank above Huckleberry's EN pages in HE Google within 3 weeks of indexing — HE SERP is uncontested for this query.
**Why:** Sleep is the #1 retention driver in the competitive map. Huckleberry owns this in English but is invisible in Hebrew — a direct structural gap. The Rhythm CTA is the natural conversion: "the table tells you the range; Arbor tells you YOUR child." This also serves AEO — Gemini and Perplexity regularly cite sleep guides.

#### P1-15 | WhatsApp Parent-Group Seeding Playbook + Copy Templates
**Owner:** arbor-content (seeding templates HE, value-first content library, hard-rules doc); arbor-marketing-lead (ambassador recruitment ops, group targeting, daily log); native HE reviewer gate
**Outcome metric:** registrations
**Effort:** S
**Eng dependency:** P0-1 branded domain; P0-3 WhatsApp-optimized share cards
**What:** Operations playbook and copy library for seeding Arbor in 30 IL WhatsApp and Facebook parent groups pre-launch. Sections: (1) Ambassador recruitment brief — how to identify trusted parent admins per city. (2) "Value-first" seeding rule: first message provides real value before mentioning the product. Copy template A (value-first: warm specific answer to a developmental question). Copy template B (soft introduce: personal note with affiliate code). (3) Hard rules: no broadcast messages, no self-promotional intros, no group-post before ambassador has 2+ weeks non-promotional presence. (4) WhatsApp card spec: correct image dimensions for preview, text legibility at thumbnail size, referral link in first line of caption. (5) Daily seeding log template.
**Why:** WhatsApp class/gan groups are the single most trusted distribution surface in Israel. The "value-first, never self-promotional" rule separates successful IL community seeding from the backlash pattern that kills products.

#### P1-16 | Competitive Content-Gap Brief — Kinedu/BabySparks Hebrew AEO Blind Spots
**Owner:** arbor-seo
**Outcome metric:** registrations
**Effort:** S
**Eng dependency:** None — research deliverable
**What:** Structured brief identifying the 10 most valuable queries where Kinedu, Lovevery, and BabySparks have zero Hebrew-language content and Arbor can own first-mover position. Method: extract top-50 Hebrew parenting query variants from AEO guide research; spot-check each against Hebrew Google and AI assistants; score by search volume, conversion intent, and Arbor product match. Deliver as prioritized table: query, gap verdict, Arbor feature match, recommended content type. Unblocks the weeks 2-4 content sprint.
**Why:** The market map warns explicitly: BabySparks has Hebrew App Store presence and "Ava" AI positioning — Arbor's AEO hubs must land before BabySparks entrenches. This brief makes that warning actionable. Research-first is the operating model — retrieve before generating.

#### P1-17 | Monthly Growth Card — Shareable Field-Notebook Artifact (Template + Copy)
**Owner:** arbor-content (card body language, in-app prompt, sharing caption templates HE+EN); arbor-design pod (card layout spec); arbor-avatar pod (generation pipeline); arbor-safety (developmental-highlight copy review — non-diagnostic framing mandatory)
**Outcome metric:** K-factor (recurring viral artifact) + retention
**Effort:** M
**Eng dependency:** arbor-memory pod (record aggregation for card generation); arbor-avatar (card export pipeline); push notification at generation; P0-3 share export pattern; arbor-safety clearance on developmental highlight generation prompts
**What:** On the first of each month, every Plus subscriber receives an auto-generated Growth Card: sage-paper A4-proportion card with the child's HeroAvatar, 3-4 developmental highlights from the month, one notable milestone, a Rhythm accuracy bar, and a "your child at [age]" caption. Exports as: WhatsApp-optimized 1:1 JPEG with referral code embedded, IG Story 9:16, and PDF for parent's own archive. In-app prompt: "החודש של [שם] מוכן. שתף עם מי שאוהב אותו." Free users see a blurred preview panel ("Your child's full monthly story. Plus unlocks it.").
**Why:** The Growth Card converts the longitudinal memory moat from an abstract product promise into a beautiful, emotional, shareable artifact. It solves the cold-start problem for referrals from retained users: a parent in month 2 has a richer, more emotional artifact than a first-session comic. Recurring viral pulse — one new cohort of Growth Cards ships every month, sustaining referral flow after the launch-week spike fades.

---

## Phase 2 — Launch Week (Days 1-7)

### P0 Items
All P0 items from Phase 1 must be live before Day 0. No new P0 items are added in Launch Week — Phase 1 P0s are the launch infrastructure.

### P1 Items (Execution)
P1 items defined above execute in this window: creator wave (P1-1), UGC challenge (P1-5), WhatsApp seeding (P1-3), lifecycle email sequence triggered (P1-12), Rhythm share card live (P1-7), daily K-factor read every morning.

---

## Phase 3 — Scale (Days 8-30)

### P2 Items

#### P2-1 | EN AEO Guide: "Is This Normal" Sleep/Tantrum/Speech Intent Cluster
**Owner:** arbor-seo + arbor-content
**Outcome metric:** registrations
**Effort:** M
**Eng dependency:** Public /en/is-this-normal/ route; FAQ JSON-LD; hreflang en/he crosslinked; arbor-safety clearance
**What:** Mirror of the Hebrew hub in English at /en/is-this-normal/. Same 15 behavior/development intent clusters tuned for English-speaking parents in IL (Anglo community) plus NL/BE/IE as a foundation for weeks 9-16 rollout. English answers 250 words each to compete against established EN content from Huckleberry, BabySparks, What to Expect. Target queries: "is it normal for a 2 year old not to talk," "toddler tantrum every day," "3 year old waking at night," "speech delay signs 18 months." Each answer ends with: "Generic advice treats every child the same. Arbor remembers YOUR child's history."
**Why:** The EN hub is the NL market's search-language bridge (Dutch parents with English-language intent are a real segment; NL has 91% English proficiency). Shipping EN and HE simultaneously satisfies the hreflang reciprocal-link requirement — they do not work correctly without each other.

#### P2-2 | EN AEO Guide: "Speech Delay Signs by Age" — Own Highest-Conversion Speech Intent
**Owner:** arbor-seo + arbor-content
**Outcome metric:** registrations
**Effort:** M
**Eng dependency:** Public /en/speech-delay-signs/ route; Article schema; internal links to Practice Studio; arbor-safety clearance (ASHA/AAP sources, "consult your professional" at every red-flag section)
**What:** Standalone EN guide targeting: "speech delay signs 18 months," "when to worry about speech delay," "2 year old not talking," "toddler speech milestones," "late talker vs speech delay." Age-banded: 12mo, 18mo, 24mo, 36mo, 4-5yr. Each band: expected milestone range, red-flag list, "what to do if you see this," green-flag (normal variation). Arbor differentiator woven in: "If your child's speech history is already in Arbor, tap Practice Studio — it gives you targeted speech drills for YOUR child's stage." Target: top-5 organic for at least 2 of the above queries within 30 days; appear as Perplexity/ChatGPT citation within 45 days.
**Why:** Speech delay queries carry the highest purchase intent in the parenting app category — a parent searching "my 2 year old is not talking" will register immediately if the answer is calm, credible, and gives them something actionable. Arbor's Practice Studio is a direct product match. No competitor has a standalone speech-delay guide tied to a live practice engine.

#### P2-3 | HE AEO Guide: "התפרצויות זעם" (Tantrums) — Own Highest-Volume Toddler Query
**Owner:** arbor-seo + arbor-content (native Hebrew review gate)
**Outcome metric:** registrations
**Effort:** M
**Eng dependency:** Public /he/tantrums/ route; Article schema; Rhythm CTA; arbor-safety clearance (non-diagnostic framing)
**What:** Standalone Hebrew guide at /he/tantrums/ targeting: "התפרצויות זעם גיל 2," "ילד מתפרץ על הכל," "איך להרגיע ילד שמתפרץ." Structure: what is a tantrum and what age is it normal, what causes them (non-alarmist), 4 concrete de-escalation scripts for tonight (the "Do-tonight" product voice), warning signs that warrant professional input, and Rhythm CTA: "Arbor predicts your child's likely 5pm friction window — so you're ready before the tantrum starts, not after." Internal links to "is this normal?" hub and HE landing.
**Why:** Tantrum content is the most-shared category of parenting content in Israeli Facebook parenting groups. The Rhythm CTA ("Arbor predicted my kid's 5pm meltdown") is also the #1 viral share artifact — the guide page serves as both SEO asset and AEO citation that feeds the Rhythm share-moment.

#### P2-4 | WhatsApp-Optimized Open Graph Cards for HE Guide Hub Pages
**Owner:** arbor-seo + arbor-content
**Outcome metric:** registrations
**Effort:** S
**Eng dependency:** OG tags on each guide page; Hebrew-language OG image 1200x630px; WhatsApp Business link preview tool test before ship
**What:** Hebrew-language OG image for each guide page: 1200x630px, sage-paper background #eef2ef, emerald clay headline in Frank Ruhl Libre, Arbor mark top-right. Set og:image, og:image:width, og:image:height, og:image:alt on each guide page. Set og:type: article and article:published_time. Test WhatsApp preview card rendering before ship.
**Why:** The market map names WhatsApp class/gan groups as the highest-leverage IL distribution channel. A Hebrew headline on sage paper reading "Is this normal? Arbor knows your child" is a scroll-stopper in a WhatsApp feed of text messages. A blank or logo-only card loses the click.

#### P2-5 | Core Web Vitals + LCP Fix on HE Landing
**Owner:** arbor-seo
**Outcome metric:** registrations
**Effort:** S
**Eng dependency:** Font loading optimization; inline above-fold CSS; deferred below-fold CSS and non-critical JS; loading=lazy on below-fold images; coordinate with arbor-content before HTML structure changes
**What:** Convert Google Fonts links to font-display: swap and add preload hints for Hebrew woff2 files. Inline above-fold CSS in a style tag in head. Defer all below-fold CSS and non-critical JS. Add loading=lazy to all below-fold images. Verify LCP < 2.5s on simulated Moto G (Android, slow 4G) using PageSpeed Insights before merge.
**Why:** Google uses Core Web Vitals as a ranking factor. Every 100ms of load-time improvement on mobile reduces bounce rate ~1% (Google/Deloitte). For a campaign built on WhatsApp shares hitting a mobile landing page, slow LCP is a direct conversion tax.

#### P2-6 | Scarcity Close + Second PR Beat — Days 22-30
**Owner:** arbor-content (scarcity close copy, PR pitch narrative, NL teaser social copy) + arbor-acquisition (push notification spec + NL waitlist tracking) + arbor-marketing-lead (PR outreach, Level 3 for publishing)
**Outcome metric:** paid subscriptions (founding-member conversion from remaining unconverted ahas) + registrations (NL waitlist target 200+)
**Effort:** M (Level 3 for publishing, Level 4 if any spend attached)
**Eng dependency:** Push notification to non-paying registered users; arbor-billing founding-member slot count enforcement; NL waitlist landing
**What:** Three coordinated moves: (1) Founding-Member Scarcity Close — in-app banner, email, social: "Founding-member Plus closes Sunday — [N] spots left." Email sequence: day 22 (spots going fast), day 25 (here's what Plus parents said this week), day 29 (tonight is the last night). (2) Second PR Beat: pitch IL tech press (Calcalist, Geektime, Start-Up Nation Central) and parenting newsletters with actual registration numbers + parent-voice testimonials. Story: calm AI in a fear-selling category, built by Israeli parents, for Israeli parents. (3) NL/English Teaser: brief EN-language social drop with top-performing IL comic subtitled in English + waitlist CTA for NL launch.
**Why:** Real scarcity converts. The parent who hit the aha but delayed is the highest-intent unconverted segment — the scarcity close is the last nudge they need, not the first. The NL waitlist seeds the next market at zero incremental cost.

#### P2-7 | Post-Activation Referral Prompts — Fire at the Right Moment (3 Prompt Variants)
**Owner:** arbor-acquisition (prompt engineering, K attribution, WhatsApp deep-link) + arbor-content (Hebrew + English prompt copy, one-tap share card text)
**Outcome metric:** registrations (K-factor, target combined aha→share 25%+)
**Effort:** S
**Eng dependency:** 3 in-product prompt triggers (post-comic, post-Rhythm-hit, post-coach-win); per-prompt K contribution instrumentation; P0-3 share export
**What:** Three in-product referral prompts fired at documented delight peaks, not a generic "invite friends" button. Prompt 1 (post-comic): "Show [child name]'s hero to another parent — they get a free Plus week when they join." Prompt 2 (post-Rhythm-hit): "Send this to a parent who'd appreciate knowing what's coming at 5pm." Prompt 3 (post-coach-win): "Know a parent who fear-Googles their kid? Send them this." Each: one-tap WhatsApp share (IL primary) + copy-link fallback. Share text pre-written in Hebrew and English with referral code embedded. No generic "share app" prompt anywhere.
**Why:** Most referral programs fail because the prompt fires when there is no delight. Prompting at a documented emotional peak is the difference between a 5% and a 25% share rate. In IL, WhatsApp one-tap means a share in a class group immediately lands in front of 30-40 parents.

#### P2-8 | IL Paid Amplification — EUR 3k Behind Proven Winners (Days 8-21)
**Owner:** arbor-acquisition (campaign management, creative upload, daily CAC read) — Level 4 confirmation from Guy/CoS required before activation
**Outcome metric:** registrations (paid CAC < EUR 40; landing→register ≥35% on paid traffic)
**Effort:** L (Level 4: EUR 3,000 spend — confirm + state amounts)
**Eng dependency:** K-factor dashboard live; day-7 kill gate cleared; UTM attribution per channel
**Note:** This item duplicates P1-10 in execution but is listed here as the Scale phase execution gate to ensure the day-7 human-review checkpoint is surfaced explicitly. Level 4 confirmation required — budget: EUR 2,200 Meta IL + EUR 500 TikTok IL + EUR 300 retargeting.

---

## Engineering Dependencies Summary (Gates on the Viral Loop)

The following eng builds are the critical path. Marketing cannot deliver compound registrations without them.

| Build | Pod | Gates |
|---|---|---|
| P0-2: Referral reward grant (activation-triggered) | arbor-billing + arbor-growth | K-factor, referral quality |
| P0-3: Branded share export + referral deep-link | arbor-avatar + arbor-api | K-factor engine entirely |
| P0-1: Branded domain + OG tags | arbor-api + Guy (domain purchase) | WhatsApp preview cards, all share loops |
| P0-4: loopEvents.ts instrumentation | arbor-api | Day-7 kill gate, paid spend decision |
| P0-5: Free comic magnet funnel + no-card auth | arbor-design + arbor-avatar | Landing-to-register conversion |
| P0-6: Double Aha onboarding flow | Product pod (coord. with arbor-design) | Register-to-paid conversion |
| P0-7: Founding-member paywall trigger | arbor-billing | Paid subscription conversion |

**Marketing does not edit product code.** All eng dependency items are framed as specs and handed to the owning product pod via the orchestrator.

---

## Funnel KPIs and Kill Gates

| Metric | Floor | Target | Stretch | Kill Gate |
|---|---|---|---|---|
| Landing→register | 35% | 45% | 55% | < 25%: pause all paid, rewrite CTA |
| Register→parent aha | 45% | 60% | 70% | < 40%: fix onboarding flow before paid |
| Aha→share | 15% | 25% | 35% | < 10%: fix share friction (P0-3) |
| Daily K-factor | 0.2 | 0.3 | 0.5+ | < 0.3 by day 7: hold all paid spend |
| Aha→trial | 5% | 8% | 12% | — |
| Trial→paid | 50% | 60% | 70% | — |
| Free→paid (blended 30d) | 3% | 5% | 7% | — |
| Paid CAC | — | < EUR 40 | < EUR 25 | > EUR 80: pause channel |

**Day-7 paid kill gate is non-negotiable.** If K < 0.3, paid spend is halted and the orchestrator surfaces the share-friction diagnosis to PAI.

---

## Budget Allocation (EUR 10k / 6 months)

| Line | Amount | Safety Level |
|---|---|---|
| Domain purchase (~1 yr) | EUR 100 | Level 4 |
| Creator fees (40-50 creators, EUR 20-50 each) | EUR 800-1,500 | Level 4 |
| Paid amplification — Meta IL | EUR 2,200 | Level 4 |
| Paid amplification — TikTok IL | EUR 500 | Level 4 |
| Paid amplification — retargeting | EUR 300 | Level 4 |
| Creator wave 2 + production support | EUR 300 | Level 4 |
| NL creator wave seed (weeks 5-8) | EUR 1,000 | Level 4 |
| AEO content production (native HE review) | EUR 500 | Level 4 |
| Reserve (scale winners, NL paid) | EUR 3,600 | Level 4 |
| **Total 6-month allocation** | **~EUR 10,000** | |

All spend items are Level 4. No paid spend executes without explicit confirmation from Guy/CoS routed through the orchestrator, with amounts stated.

---

## Memory Entry
This backlog supersedes `arbor-marketing-backlog.md`. Source slices: Arbor 30-Day Viral Acquisition Engine Backlog (Acquisition), Creative/Content Engine 30-Day Backlog, SEO/AEO 30-Day Organic Backlog, Parent Conversion + Retention Engine 30-Day Backlog. De-duplicated across all four slices. Spine: child = acquisition angle, parent = paying customer.

---

## Adversarial Review (and Fixes)

**Stress-tested 2026-06-21 by arbor-marketing-lead. Five sharpest structural gaps in the plan as written.**

---

### Gap 1 — The K-engine has zero build slack and will be absent on launch day

**The problem.** P0-2 (referral reward grant) and P0-3 (branded share export with deep-link) are both M-effort engineering builds assigned to multiple pods. The pre-launch window is 7 days. If either build slips by even 3 days — a normal occurrence across billing, avatar, and API pods coordinating — the viral loop is not live when creators post on launch day. The plan's entire "compound not add" thesis depends on K > 0 from day 1. Without the referral deep-link embedded in the share artifact, every Hero Comic that gets shared on a WhatsApp class group is attribution-dead and K stays at 0. The 30-day registration model's base-case of 12,000 registrants requires a K of 0.5 — that number is a flat 3,400 without the loop.

**The fix.** Add a mandatory "loop smoke test" checkpoint at pre-launch day -3 (not day 0). The smoke test must confirm: a test user can complete the full share → install → activate → reward grant flow end-to-end, with the referral code resolving correctly in WhatsApp on both iOS and Android. If the smoke test fails at day -3, the launch date shifts by one week — the loop is more important than the date. Additionally, add a fallback K-floor mechanism: if P0-3 is not ready, ship a manual "copy referral link" fallback with a visible referral code the parent can paste into WhatsApp manually. This keeps K above 0 even if the one-tap branded export is not ready.

---

### Gap 2 — The Double Aha collapses on cold-start for every new registrant

**The problem.** The plan positions Rhythm and Daily Play as core in-session conversion drivers in the 90-second onboarding flow. Rhythm explicitly predicts the child's friction/calm/focus windows "from the family's own logged history" — but a new registrant has zero logs. The backlog acknowledges the cold-start risk in the competitive analysis ("needs N more days"), but the 30-day blitz plan treats Rhythm and Daily Play as delivering real, personalized value in session 1. In practice, session 1 Rhythm will show a generic age-band prior with a prominent "needs more data" empty state. The "uncanny prediction" share moment — which is the second viral artifact and the analytical-parent conversion hook — cannot fire in the first session or even the first week. The Double Aha as described requires the parent's *second or third session*, not the first.

**The fix.** Redesign the onboarding aha sequence to make cold-start Rhythm feel like a *promise delivered over time*, not a broken feature. Concretely: (a) In session 1, the Rhythm peek should show a beautifully-designed "Arbor is learning [child name]'s rhythm — check back tomorrow" card with the age-band prior as a starting point, explicitly framed as "your first data point." The paywall teaser for Rhythm should fire on this card, not on a working prediction. (b) The primary session-1 parent aha that converts must be the coach answer — the "calm Read / Risk / Do-tonight" response to the parent's real worry. This is deliverable at zero logs. (c) Daily Play, unlike Rhythm, can deliver real value in session 1 (it needs only age band, which is captured in onboarding). Make Daily Play the session-1 feature win. Re-sequence the 90-second flow: comic (delight) → coach answer to real worry (parent aha) → Daily Play card for today → Rhythm promise. The paywall fires after the coach answer, not after the Rhythm peek, which is where the true value peak is in session 1.

---

### Gap 3 — The WhatsApp seeding hard rules are structurally impossible on the 30-day timeline

**The problem.** P1-15 states the hard rule: ambassadors must have "2+ weeks non-promotional presence" in each WhatsApp group before mentioning Arbor. The pre-launch window is 7 days. There is no mathematical path to 2+ weeks of non-promotional group presence before a launch on day 0. Every ambassador seeding on launch day will be doing a cold product drop regardless of intent. In Israeli WhatsApp gan/class groups, cold promotional posts from non-established members are reliably flagged, removed by group admins, and can generate backlash that spreads faster than the original post. The plan names this exact pattern as "the backlash that kills products" — then builds a timeline that makes it inevitable.

**The fix.** Separate the WhatsApp strategy into two tiers. Tier 1 (launch week): use only ambassadors who are *already* active, trusted members of their target groups — parents who have been in those specific groups for months or years, not recruited for this campaign. These are recruited at day -21 (three weeks before launch), not day -7. Their only action in week 1 is to share their *own child's genuine Hero Comic* as a personal parent moment, not as a promotion. The referral code lives silently in the deep-link; there is no promotional caption. Tier 2 (weeks 2-4): new ambassadors begin value-first seeding in groups they join at launch, but the "seed Arbor" moment does not happen until they have been active for at least 10 days. Adjust the seeding target from "30 WhatsApp groups seeded in the first 7 days" to "30 groups with a genuine organic share in 30 days." The slower target is more achievable and will not trigger group backlash.

---

### Gap 4 — EUR 89/yr founding price is priced above the IL market's social proof floor

**The problem.** The founding-member Plus offer at EUR 89/yr (~NIS 355/yr, ~NIS 30/month) is positioned as a scarcity-anchored premium. But Arbor at launch in Israel has: zero App Store reviews, no press coverage, no professional endorsements, no peer testimonials visible at the time of the paywall. The social proof block on the landing references "3 parent micro-testimonials" — these are sourced from the brand itself, not verified external users. Huckleberry, the closest price-comparable at EUR ~68/yr, has 100,000+ App Store ratings and years of press coverage. Kinedu is EUR ~9/month with a free trial. Israeli parents in a kupat-cholim culture where much child-development support is subsidized will experience EUR 89/yr as a steep ask from an unknown app with no external validation. The EUR 89/yr price point and the "500 slots" scarcity mechanic may convert well for an established brand but will convert poorly for a zero-review launch.

**The fix.** Add a price anchor gate: the EUR 89/yr founding offer does not go live until Arbor has at least 50 organic reviews in the Israeli App Store and Google Play, or until press coverage has appeared (whichever comes first, target day 14). Before that gate clears, the default paywall conversion path is the 14-day no-card Plus trial (already listed as A/B variant B in P0-7). The trial converts the parent by letting them experience Rhythm over 7+ days of logs, which is when the product's actual value materializes. After 14 days of real use, the EUR 89/yr annual offer is credible. Additionally, add a "trusted by [N] families" live counter on the paywall that increments publicly — even 200 registered families is social proof that makes the founding offer feel less like a cold ask.

---

### Gap 5 — AEO/SEO is treated as a 30-day acquisition source but domain authority and indexing lag make this a 60-90 day channel

**The problem.** The backlog includes AEO guides at P0-8, P1-14, P1-16, P2-1, P2-2, and P2-3 as registration drivers within the 30-day window. The plan states targets like "appear as cited source in Hebrew ChatGPT/Gemini/Perplexity within 30 days of indexing" and "rank above Huckleberry's EN pages in HE Google within 3 weeks of indexing." These targets assume that a new custom domain (replacing arborprd-westeu.web.app) with freshly-published content will (a) be indexed rapidly, (b) accumulate enough crawl trust to surface in AI citation engines, and (c) outrank established competitors — all within the 30-day window. In practice, a new branded domain with no external backlinks will take 6-12 weeks to begin accumulating meaningful organic traffic. AI answer engines (ChatGPT, Perplexity, Gemini) draw on training data and trusted source signals that take months of consistent publishing to build. The claim that AEO can be a 30-day registration driver for a new domain is not grounded in realistic indexing timelines and risks diverting content effort away from channels that actually fire in 30 days.

**The fix.** Re-bucket AEO/SEO in the backlog as a 60-day channel, not a 30-day one. In the 30-day window, the content effort that AEO guides consume should instead be redirected to: (a) getting the AEO guides published and indexed as fast as possible (that work stands), but without attribution as a 30-day source in the registration model; (b) distributing those same guide answers as native WhatsApp-optimized shareable images in parent groups (the content is useful at zero domain authority when delivered directly), and (c) building one high-authority backlink by getting a single IL parenting journalist or SLP professional to publish an article about Arbor that links to the guides — one credible external link is worth more for new-domain trust than ten self-published pages. Revise the 30-day registration model to source 100% of the registration count from creator/WhatsApp/paid channels, and treat the first organic registration from AEO as a day-60 metric.
