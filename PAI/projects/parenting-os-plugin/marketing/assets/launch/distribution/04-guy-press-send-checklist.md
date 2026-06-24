# Arbor IL Launch — "Guy Presses Send" Checklist

**Owner:** `arbor-distribution`
**Purpose:** the exact sequence of actions Guy takes to fire the launch engine. Nothing in this file happens autonomously. Every item is a manual action. Items are ordered by dependency.
**Safety levels:** each item is tagged L1–L5 per ROS root CLAUDE.md. L3 = external action (confirm before doing). L4 = financial (confirm + amounts stated). L5 = irreversible (explicit warning).

---

## BLOCK 0 — Must complete before anything else publishes

These are the structural prerequisites. Without them, no Week 0 post should go out, because the CTA (arborparentingapp.com) will either land on the off-brand GoDaddy page or not resolve at all.

### 0-A. Point arborparentingapp.com to the real landing (L3/L4)
**What:** update DNS on GoDaddy to point arborparentingapp.com → Firebase Hosting, so the real IL landing page (html/arbor-il.html or equivalent) serves on the domain.
**Why it blocks:** every post and DM in this launch points to arborparentingapp.com. If it serves the GoDaddy builder page with the "Parenting Made Simple" tagline, the CTA kills conversion and misrepresents the brand.
**Action:**
1. Log in to GoDaddy account.
2. Go to DNS settings for arborparentingapp.com.
3. Add/update the A record and CNAME record to point to Firebase Hosting (the values are in the Firebase Console under your project → Hosting → Custom domains).
4. In Firebase Console, verify the domain (Firebase will prompt for a TXT record — add it in GoDaddy DNS).
5. Once Firebase shows "Connected," the real landing serves.
6. Confirm by visiting arborparentingapp.com from a private browser.
**Reference:** the GoDaddy + Firebase custom domain runbook is documented in ROS memory (Arbor LIVE: brand domain + billing). The login-breaks-on-new-domain fix also applies — confirm arborparentingapp.com is added to Firebase Auth → Authorized domains.
**Cost:** none beyond the existing domain ownership.

### 0-B. Kill the GoDaddy website-builder page (L3)
**What:** after DNS is pointed to Firebase, disable or delete the GoDaddy website builder so it no longer competes with the Firebase-served page.
**Why:** GoDaddy website builder and Firebase Hosting cannot both serve the same domain once DNS is pointed. The GoDaddy page becomes irrelevant, but disable it explicitly to avoid any routing confusion.

### 0-C. Confirm the landing page passes the Arbor Bar (L1)
**What:** load arborparentingapp.com in a browser. Confirm the headline is NOT "Parenting Made Simple." Confirm it carries the Arbor essence ("the steady hand that remembers your child" or equivalent). Confirm it has a visible CTA (free trial / download).
**If it fails:** flag to `arbor-marketing-lead` to update the landing copy before any post goes out.

---

## BLOCK 1 — Social channel creation (L3)

These are one-time account creations. IG is done. Three remain.

### 1-A. Create TikTok account — @arborchilddevelopment (L3)
**What:** create a TikTok Business account with the handle @arborchilddevelopment. If that handle is taken, use @arbor.child.development or @arbor_il as fallback and update CHANNELS.md with the actual handle.
**Actions:**
1. Go to TikTok.com or open the TikTok app.
2. Sign up with bguy.rubin@gmail.com or a dedicated Arbor email.
3. Claim the handle @arborchilddevelopment.
4. Set the bio: "ארבור זוכר את הילד שלך | arborparentingapp.com" (HE/EN).
5. Add arborparentingapp.com as the profile link.
6. Switch to a Business account (TikTok Settings → Manage Account → Switch to Business → Education).
7. Update CHANNELS.md with the confirmed handle.
**Why now:** TikTok posts W1-04 and W2-03 are in the queue; they require a live account.

### 1-B. Create YouTube channel — Arbor (L3)
**What:** create a YouTube channel under the Arbor brand for long-form and manifesto content. Not needed for Week 0–2 posts, but creates the handle before it's taken.
**Actions:**
1. Go to YouTube.com, signed in as bguy.rubin@gmail.com.
2. Create a new channel named "Arbor" (or "Arbor — התפתחות הילד" for HE discoverability).
3. Add the channel handle: @arborchilddevelopment (or closest available).
4. Set channel description and add arborparentingapp.com to the "About" links.
5. Upload a channel banner (sage paper + emerald clay, Arbor wordmark).
**Priority:** lower urgency than TikTok and Facebook. Create before W3 at latest.

### 1-C. Create Facebook page — Arbor (L3)
**What:** a Facebook Business page is required for (a) the IL parent mega-group seeding playbook and (b) Meta paid ads when the organic gate clears (~Day 12–14).
**Actions:**
1. Go to Facebook.com/pages/create (use bguy.rubin@gmail.com or create a dedicated Arbor account).
2. Page name: "Arbor — פיתוח הילד שלך" (HE/EN hybrid for discoverability in both).
3. Category: "Software" or "App" — not "Health/Medical."
4. Page username: @arborchilddevelopment.
5. Bio: "ארבור זוכר את הילד שלך | arborparentingapp.com" — link in About.
6. Upload profile picture (Arbor mark, emerald on sage) and cover image.
7. Update CHANNELS.md.
**Why now:** the ambassador seeding playbook uses FB groups. Having a Page allows boosting posts when the organic gate clears. Without a Page, no Meta ads are possible.

---

## BLOCK 2 — Product prerequisites (L4, routes to arbor-orchestrator)

These are product-pod builds, not marketing actions. Guy's role is to authorize them. Marketing cannot unblock these.

### 2-A. Authorize P0-2: referral grant + /join?ref= resolver (L4)
**What:** approve the build of the referral grant mechanism (bilateral: one free Plus month to inviter + invitee on invite_activated) and the URL resolver at arborparentingapp.com/join?ref=[CODE].
**Why it blocks:** without this, there is no affiliate code to give creators, no referral loop, no measurable K-factor. The link in every share card is dead.
**Decision:** yes/no to build. No financial spend is triggered by the authorization itself; the financial exposure is the reward grants (one free Plus month per activated invite = €0 direct cost in a freemium model, but a billing-logic build that arbor-billing owns).
**Route:** tell `arbor-orchestrator` to prioritize P0-2.

### 2-B. Authorize P0-3: one-tap branded share export (L4)
**What:** approve the build of the share mechanic that exports a branded Growth Card / avatar / answer card as a shareable image/Reel-ready clip with the referral code baked into the deep link.
**Why it blocks:** without this, the viral loop has no share artifact with a trackable referral code. Creators and ambassadors can share the URL, but the compounding share-from-within mechanic (Loop B) does not fire.
**Route:** tell `arbor-orchestrator` to prioritize P0-3 alongside P0-2.

---

## BLOCK 3 — Publishing the owned-channel queue (autonomous after gate, but you click publish)

Publishing to Arbor's owned channels (IG, TikTok, YouTube, Facebook) is autonomous after brand-review + arbor-safety + preview gate. In practice, Guy clicks publish on each slot from the queue in Document 1.

### 3-A. Publish W0-01 (IG manifesto card) — 2026-06-23, 20:00 IST
**Precondition:** Block 0 complete (arborparentingapp.com serves real landing).
**Action:** go to @arborchilddevelopment on IG (desktop or Creator Studio), create new post, upload `creative/arbor-manifesto-card-he.png`, paste the caption from Document 1 Slot W0-01, add hashtags, set location to Israel (optional), publish at 20:00 IST. Stay in comments for 15 minutes.

### 3-B. Publish W0-02 (IG Reel, 2am hook) — 2026-06-24, 19:30 IST
**Precondition:** asset `creative/arbor-hook-2am-reel-he-v1.mp4` produced by arbor-creative.
**Action:** same flow as above for Reels.

### 3-C. Publish W0-03 (WA Status) — 2026-06-25, 08:00 IST
**Action:** save `creative/arbor-wa-status-card-he-v1.png` to phone. Post as WhatsApp Status from personal WhatsApp. Duration: 24 hours.

**Continue through all 13 queue slots per Document 1.** TikTok slots (W1-04, W2-03) require Block 1-A complete first.

---

## BLOCK 4 — Creator outreach (L3 — confirm each batch before sending)

### 4-A. Confirm the outreach batch (L3)
**Precondition:** P0-2 must be live before issuing affiliate codes. Do not issue codes in any DM until P0-2 is confirmed.
**What:** review Document 2 DM templates. Personalize each DM for the target creator (per the usage notes in each template). Send as a batch only after explicit confirmation.
**Recommended first wave (5 DMs):**
1. @galtamari1 (Tier A) — Template A-1, personalized
2. Noa Barak SLP (Tier B) — Template B-1, personalized for SLP angle
3. Merav Nanus SLP (Tier B) — Template B-1
4. Shiri Marcus Lax SLP (Tier B) — Template B-1
5. One Tier C nano-creator sourced from Modash/infludata — Template C-1

**Action:** Guy sends each DM from @arborchilddevelopment IG DM (or WhatsApp where the contact is more accessible via WhatsApp).

### 4-B. Confirm creator fees (L4 — amounts stated)
When a Tier A or Tier B creator expresses interest and a collab is agreed:
- **Tier A fee:** €40–60 per creator. 5 creators = €200–300 total. (L4 — confirm before committing)
- **Tier B fee:** €20–35 per creator. 10 creators = €200–350 total. (L4 — confirm before committing)
- **Wave-1 total cash ceiling:** €525 across all tiers. Do not exceed without a new L4 confirm.
- **Payment timing:** after post is live and confirmed, not before.
- **Mechanism:** bank transfer or PayPal to the creator. This is a personal payment, not an in-app transaction. No automated payment system exists yet.

---

## BLOCK 5 — Ambassador outreach and group seeding (L3)

### 5-A. Source 5–10 ambassadors
**Action:** identify candidates from Facebook IL parent mega-groups (review group contributors answering parenting questions — these are the warm-community voices). Add them to Document 3's CRM table.

### 5-B. Send ambassador recruitment DMs (L3 — confirm batch)
**What:** use Document 3 Template A-1 (ambassador recruitment), personalized per person.
**Action:** confirm the batch with `arbor-marketing-lead`, then send from personal WhatsApp or IG DM. These are not sent from the @arborchilddevelopment brand account — they come from Guy personally (more trust, less brand-coldness).

### 5-C. Onboard confirmed ambassadors
**What:** send the onboarding brief (Document 3), provide free Family plan access, and share the group seeding scripts (emphasize: rewrite in their own voice, value first, link in first comment).
**Timing:** W1 — ambassadors begin seeding in their groups during W1 alongside creator drops.

---

## BLOCK 6 — Paid amplification gate (L4 — do not proceed until organic gate clears)

**Iron rule:** no euro to paid until an organic asset clears at least 3% click-to-register on at least 10,000 impressions, approximately Day 12–14 per the growth engine plan. Read Day-7 K before any paid decision.

### 6-A. Day-7 K read
**Action:** on approximately 2026-06-29, read the daily K-factor dashboard (specified by arbor-acquisition). If K < 0.2 → hold all paid, do not proceed to 6-B or 6-C. Fix activation and share friction first.

### 6-B. Authorize Meta IL Reels amplification (L4 — amount: €1,500)
**Precondition:** organic gate cleared (Day 12–14, ≥3% click-to-register on ≥10K impressions).
**What:** boost the single best-performing IG Reel (determined by Day 12 performance read) as a Meta Reels ad targeting IL parents aged 24–42, HE-language content, interest: parenting/child development.
**Amount:** €1,500 (L4 confirm required).
**Action:** set up Meta Ads Manager (business.facebook.com) under the Arbor Facebook page (Block 1-C must be complete). Run as a Reels promotion, not a cold-audience ad.

### 6-C. Authorize TikTok Spark Ads (L4 — amount: €400)
**Precondition:** same organic gate + a creator post with >50K views is available for Spark amplification.
**What:** Spark Ads boost an organic creator post (their existing content, not a new ad) as a paid placement. Requires the creator to authorize the Spark code.
**Amount:** €400 (L4 confirm required).

### 6-D. Authorize creator Wave-1 cash fees (L4 — amount: up to €525)
**Precondition:** creators have confirmed posts are live and tagged correctly.
**Amount:** up to €525 across Tier A (up to €300) + Tier B (up to €225) for Wave 1.
**Action:** pay confirmed creators after post verification. Method: bank transfer or PayPal. Log each payment with the creator handle and post URL for attribution.

---

## Summary: the ordered "press send" sequence

| Order | Action | Level | Confirmed? |
|---|---|---|---|
| 1 | Point arborparentingapp.com DNS to Firebase + confirm real landing serves | L3/L4 | [ ] |
| 2 | Add arborparentingapp.com to Firebase Auth Authorized domains | L3 | [ ] |
| 3 | Kill GoDaddy website builder page | L3 | [ ] |
| 4 | Confirm landing passes Arbor Bar (no "Parenting Made Simple") | L1 | [ ] |
| 5 | Create TikTok @arborchilddevelopment | L3 | [ ] |
| 6 | Create Facebook Page @arborchilddevelopment | L3 | [ ] |
| 7 | Create YouTube channel | L3 | [ ] |
| 8 | Authorize P0-2 build (referral grant + /join?ref= resolver) | L4 | [ ] |
| 9 | Authorize P0-3 build (one-tap branded share export) | L4 | [ ] |
| 10 | Publish W0-01 (IG manifesto card) — 2026-06-23 20:00 IST | L3 | [ ] |
| 11 | Publish W0-02 (IG Reel, 2am hook) — 2026-06-24 19:30 IST | L3 | [ ] |
| 12 | Publish W0-03 (WA Status) — 2026-06-25 08:00 IST | L3 | [ ] |
| 13 | Publish W1-01 (IG Reel, hero challenge) — 2026-06-26 20:00 IST | L3 | [ ] |
| 14 | Publish W1-02 (IG Carousel, answer card) — 2026-06-27 19:00 IST | L3 (arbor-safety check on sample card copy) | [ ] |
| 15 | Publish W1-03 (IG Reel, Rhythm) — 2026-06-29 20:30 IST | L3 | [ ] |
| 16 | Confirm creator DM batch (5 DMs, Document 2) | L3 | [ ] |
| 17 | Publish W1-04 (TikTok 2am hook) — 2026-06-30 19:00 IST | L3 (requires TikTok account) | [ ] |
| 18 | Publish W1-05 (WA Status, Growth Card teaser) — 2026-07-01 08:30 IST | L3 | [ ] |
| 19 | Publish W1-06 (IG convergence card) — 2026-07-02 20:00 IST | L3 | [ ] |
| 20 | Source + confirm ambassador DM batch (Document 3) | L3 | [ ] |
| 21 | Publish W2-01 (IG Reel, "The Whole Year") — 2026-07-03 19:30 IST | L3 (arbor-safety gate on Rhythm framing in cut) | [ ] |
| 22 | Read Day-7 K — go/no-go on paid | L1 | [ ] |
| 23 | Publish W2-02 (IG share card, Rhythm) — 2026-07-05 20:00 IST | L3 | [ ] |
| 24 | Publish W2-03 (TikTok, #הגיבורשלי) — 2026-07-06 19:00 IST | L3 (requires TikTok account) | [ ] |
| 25 | Publish W2-04 (IG Growth Card reveal) — 2026-07-08 20:00 IST | L3 | [ ] |
| 26 | Confirm creator Wave-1 fees (up to €525 total) | L4 — state amount per creator | [ ] |
| 27 | Authorize Meta IL Reels paid amplification (€1,500) | L4 — only after organic gate | [ ] |
| 28 | Authorize TikTok Spark Ads (€400) | L4 — only after organic gate + qualifying creator post | [ ] |

---

## What needs money — L4 summary

| Item | Amount | Gate condition |
|---|---|---|
| Creator Wave-1 Tier A fees (5 creators) | €200–300 | After posts confirmed live |
| Creator Wave-1 Tier B fees (10 creators) | €200–350 | After posts confirmed live |
| Wave-1 total cash ceiling | €525 | Hard ceiling, confirm per creator |
| Meta IL Reels amplification | €1,500 | Organic gate: ≥3% CTR on ≥10K impressions, ~Day 12–14 |
| TikTok Spark Ads | €400 | Organic gate + qualifying creator post >50K views |
| Meta retargeting reserve | €200 | Same organic gate |
| Wave-2 creator reserve | €300 | After Wave-1 K read confirms ≥0.3 |
| Experiments / contingency | €575 | Kill-or-double test; release only if specific winner identified |
| **Total sprint ceiling** | **€3,500** | All gated; none auto-released |

---

## What does NOT need money right now

- All 13 posts in Document 1 (owned organic queue) — zero cost to publish.
- The 5 initial creator DMs (Document 2) — zero cost to send; product-only offer.
- The ambassador recruitment and onboarding (Document 3) — free Family plans, zero cash.
- The WhatsApp Status posts — zero cost.
- Building the creator CRM (tracking spreadsheet or updating the tracker doc) — zero cost.
- All brand-review, safety-review, and preview gate work — internal.
