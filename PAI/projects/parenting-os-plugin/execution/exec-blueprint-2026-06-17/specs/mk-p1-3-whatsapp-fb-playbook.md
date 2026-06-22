## mk-p1-3-whatsapp-fb-playbook — WhatsApp/FB parenting-group playbook
**Aspects:** Marketing · **Surfaces/platforms:** landing:he · **Priority:** P1

### Problem / why
The GTM plan names WhatsApp class-groups and Facebook parenting mega-groups ("אמהות"-style, neighborhood/gan groups) as **the real IL acquisition engine** (`arbor-viral-gtm-2026-H2.md:18`, `:75`, `:139`). Parents move in tight packs; one warm referral inside a class-group can convert a whole cohort. But this channel is also the easiest place to get banned, muted, or branded a spammer — group admins are gatekeepers and any whiff of corporate self-promo kills the account and the brand in that community.

There is no playbook today. We have the referral primitive being built (`mk-p0-2-referral-loop`) and a copy pack (`arbor-launch-copy-pack.md`), but nothing that tells a human (Guy, MKT, or a seeded creator) **exactly how to enter a group, what to post, what never to post, how the referral link spreads inside the group without spam, and how admin partnerships work.** This item is that operating manual: a content-only, build-ready playbook written to the marketing folder, plus the one technical artifact it needs — a HE-landing referral/UTM entry point so group traffic is attributable.

This is a **mission (content/ops asset), not an app-code build.** No files under `PPPPtherapy-/PPPPtherapy-/app/src` are edited. The only product-surface touch is the HE landing page link wiring (shared with the referral/UTM missions — see conflict notes).

### Scope across platform domains
- **Web app:** Out of scope. The in-app invite affordance and the referral grant are owned by `mk-p0-2-referral-loop`; this playbook *consumes* the referral link that loop produces and tells humans how to spread it. No app edits.
- **iOS / Android (Capacitor):** Out of scope. Group members open the referral link in mobile browsers; the link resolves to the canonical HE landing, which deep-links into the app/stores (owned by `mk-p0-1-domain`).
- **Landing EN:** Out of scope.
- **Landing HE (RTL) — the only product-surface touch:** the playbook drives Hebrew-speaking parents from WhatsApp/FB groups to the HE landing (`PAI/projects/parenting-os-plugin/html/arbor-marketing-landing-page-he.html`). This item requires that the HE landing's primary CTAs carry a group-channel UTM (`utm_source=whatsapp|facebook`, `utm_medium=group`, `utm_campaign=il_groups`) and pass-through of any inbound `?ref=` — but it does **not** rewrite or restyle the landing. The actual CTA/UTM wiring belongs to `mk-p0-5-attribution-utm`; this item only specifies the parameter contract and verifies it. If `mk-p0-5` has not landed, add only the `utm_*` query params to the existing CTA `href`s (lines ~1084–1538) as a minimal append — no layout, copy, or structural change to the HE landing.

### Marketing detail — the playbook (concrete, build-level)

The deliverable is one markdown asset: `arbor-whatsapp-fb-group-playbook.md`. It MUST contain the following sections, fully written (not placeholders). Discipline applied: `marketing:campaign-plan` for the channel sequencing + `rubin-os:copywriter` for the HE/EN scripts.

#### 1. Channel map & rules of engagement (the "never get banned" doctrine)
- **Group types & play:** (a) WhatsApp class/gan groups → spread via *member* referral, never cold-post; (b) WhatsApp neighborhood/topic groups → value-post only with admin OK; (c) Facebook parenting mega-groups ("אמהות", Secret Tel Aviv-style) → admin partnership or organic value contribution, never link-drop.
- **The 3 hard rules (stated as bright lines):** (1) Never post a bare app link cold. (2) Never DM members unsolicited. (3) Never post without the admin's explicit yes in admin-gated groups. Violations = brand-damage, not just a mute.
- **Value-first ratio:** for every 1 mention of Arbor, contribute ≥5 genuinely useful, non-promotional answers in the community first. Earn the right to share.

#### 2. Admin-outreach script (HE primary + EN reference)
Actual ready-to-send copy, warm and non-corporate, matching the launch copy-pack voice (calm, direct, humane, no fear-sell). HE first because IL is the target market. Example HE admin DM (final, not a sketch):
> היי [שם] 🙂 אני [שם], הורה ל[גיל] וגם עומד/ת מאחורי Arbor — אפליקציה רגועה שעוזרת להורים להבין מה קורה עם הילד/ה ומה לעשות עכשיו, בלי דרמות ובלי אבחנות. לא באתי לפרסם — אשמח לתרום לקבוצה: לענות על שאלות "זה נורמלי?" בלי תמורה, ואם בא לך, לתת לחברי הקבוצה גישה חינם. רוצה שנעשה את זה בצורה שמתאימה לכללים שלך?

EN reference version included verbatim in the asset. Both must: lead with parent identity, name the no-promo intent, offer value (free Q&A / free access to members), and hand control to the admin.

#### 3. Value-post templates (the 5:1 "earn it" content)
3–4 ready HE posts that contribute without selling — e.g. a "is this normal at 2am" framing, a one-line developmental reassurance, an answer-card-style reply. Each ends with a soft, opt-in mention only when contextually invited ("יש לי משאב חינם אם זה רלוונטי — תגידו"). Reuse hooks #1, #2, #4, #8 (HE) from `arbor-launch-copy-pack.md:84`.

#### 4. The referral-spread mechanic inside a group (this is why it depends on the loop)
- A seeded parent/creator activates in-app, gets their **stable referral link** from the invite affordance built by `mk-p0-2-referral-loop` (`ARBOR-XXXX`, `https://<canonical>/?ref=ARBOR-XXXX`).
- They share *their own* link in their *own* class-group as a member ("this actually helped me with [child] — first month's on me"), never as a marketer. Symmetric offer: both sides get a free Plus month on the invitee's first plan.
- The link lands on the HE landing with `?ref=` + group UTM; attribution persists first-touch (already works per `mk-p0-2-referral-loop` and `mk-p0-5-attribution-utm`).
- **K-factor read:** group-sourced installs are tagged `utm_source=whatsapp|facebook, utm_medium=group` so `mk-p1-6-loop-optimization` can isolate group K vs creator K.

#### 5. Link/UTM contract (the verifiable artifact)
The playbook documents the exact link format group operators paste, so traffic is attributable end-to-end:
```
https://<canonical-he>/?ref=ARBOR-XXXX&utm_source=whatsapp&utm_medium=group&utm_campaign=il_groups
https://<canonical-he>/?ref=ARBOR-XXXX&utm_source=facebook&utm_medium=group&utm_campaign=il_groups
```
- `<canonical-he>` resolves once `mk-p0-1-domain` lands; until then use the `web.app` origin and a note to swap.
- `ref` is the operator's own code from `mk-p0-2`. `utm_*` lower-case, fixed vocabulary above.
- The HE landing must preserve both `ref` and `utm_*` through to the app install (verified, not assumed).

#### 6. Operating cadence & guardrails for the human running it
- Weekly: 2–3 new admin relationships, not blasts. Track in a small table (group name, type, admin status, value-posts contributed, members reached, installs attributed).
- Hard stop conditions (when to back off a group entirely).
- Hand the install/K numbers to `mk-p1-6-loop-optimization` weekly.

#### 7. Tracker stub
A markdown table operators fill in: `Group | Type | Admin contact | Status (cold/contacted/approved/active/declined) | Value posts | Referral link used | Installs (UTM) | Notes`. Mirror the format of `arbor-il-creator-tracker.md` so the two trackers are consistent.

### Files to create / edit (exact repo-relative paths)
**Create:**
- `PAI/projects/parenting-os-plugin/marketing/arbor-whatsapp-fb-group-playbook.md` — the full playbook (sections 1–7 above), HE-primary scripts with EN reference.

**Edit:**
- `PAI/projects/parenting-os-plugin/marketing/arbor-marketing-backlog.md` — mark P1-3 status (in-progress/done) and link the new playbook file in the P1-3 Notes cell (line 32). Append-only edit to that one cell.
- `PAI/projects/parenting-os-plugin/html/arbor-marketing-landing-page-he.html` — **only if `mk-p0-5-attribution-utm` has not yet wired UTM/ref pass-through.** In that case, append the `il_groups` UTM params to the existing primary-CTA `href`s (the `class="cta…"` anchors at lines ~1084, 1088, 1094, 1098, 1104, 1108, 1538) and ensure inbound `?ref=` is preserved. No copy, layout, RTL, or structural change. If `mk-p0-5` already owns CTA/UTM wiring, make **zero** edits to this file and instead record the required param contract in the playbook for `mk-p0-5` to honor.

### Shared-file conflict notes
- **`PAI/projects/parenting-os-plugin/marketing/arbor-marketing-backlog.md`** — this is the item's declared `sharedFiles` entry. It is the marketing index that many MK missions touch (status cells). **Avoid clobber:** edit only the single P1-3 row's Notes/status cell; do not reflow the table or renumber rows. Append the playbook link inline. Other MK items edit *their own* rows — keep edits row-local.
- **`PAI/projects/parenting-os-plugin/html/arbor-marketing-landing-page-he.html`** — per the conflict hotspot list this file is touched by `p3-ios-grade-audit`, `mk-p0-1-domain`, `mk-p0-5-attribution-utm`, `mk-landing-parity-rebuild`, `mk-p1-4-aeo-seo-he`. The hotspot note says `mk-landing-parity-rebuild` is the **reference build** and the parity rebuild plus `mk-p0-1`/`mk-p0-5` own structural and CTA/URL changes. **This item must defer to them:** do NOT touch the HE landing if `mk-p0-5-attribution-utm` is wiring UTM pass-through (it is — that is its job). Only as a last-resort fallback (mk-p0-5 not landed) append `utm_*` params to existing CTA hrefs, and even then keep it to query-string additions on existing anchors so it cannot collide with the parity rebuild's structural rewrite. Coordinate sequencing: land `mk-landing-parity-rebuild` → `mk-p0-1` → `mk-p0-5` first; this item ideally makes zero HTML edits and just specifies the contract.

### Dependencies (other item ids that must land first)
- **`mk-p0-2-referral-loop`** (declared `dependsOn`, hard) — the playbook's core mechanic is sharing the per-user stable referral link with the symmetric free-month payoff. Without a working invite affordance + activation grant, the group spread has no product loop to ride.
- **`mk-p0-1-domain`** (soft) — the canonical HE URL the link points to. Until it lands, use the `web.app` origin with a swap note.
- **`mk-p0-5-attribution-utm`** (soft, recommended-before) — owns `?ref=`/`utm_*` pass-through on the HE landing. If landed, this item makes zero HTML edits. If not, this item adds the minimal UTM append described above.

### Acceptance criteria (testable, including "verified live on dev server")
1. `arbor-whatsapp-fb-group-playbook.md` exists at the path above and contains all 7 sections fully written, with HE-primary admin script + value-post templates (no placeholders, no "[TBD]").
2. The playbook's link/UTM contract (section 5) is exact and copy-pasteable: `?ref=ARBOR-XXXX&utm_source={whatsapp|facebook}&utm_medium=group&utm_campaign=il_groups`.
3. **Verified live on dev server:** open the HE landing via a constructed group link `…/?ref=ARBOR-TEST&utm_source=whatsapp&utm_medium=group&utm_campaign=il_groups`, complete the install/profile path, and confirm in the analytics dev console (per `mk-p0-4-analytics-wiring`) that the resulting events carry `referral_code=ARBOR-TEST` and `utm_source=whatsapp`/`utm_medium=group`. (This verifies the channel is attributable end-to-end — the playbook's whole point.)
4. The HE landing renders identically before/after this item (no visual/RTL regression) — diff shows at most query-string additions on existing CTA hrefs, or zero changes if `mk-p0-5` owns it.
5. `arbor-marketing-backlog.md` P1-3 row links the new playbook and the rest of the table is byte-identical outside that row.
6. The playbook's admin-outreach and value-post copy passes a HE native-review flag note (matching the copy-pack's `⚠ launch-draft` convention) — Hebrew marked as needs-native-review before live use.

### Operating-rule checks
- **No dark patterns:** the playbook's central doctrine is value-first, admin-consented, no cold link-drops, no unsolicited DMs (section 1). The referral offer it spreads is symmetric and honestly stated ("both get a free month," auto-lapses to Free — inherited from `mk-p0-2`). No fake scarcity, no astroturfing: operators share as genuine members of their own groups, disclosing they're behind Arbor in the admin script.
- **Privacy / COPPA-2026:** the referral link is an HMAC-derived parent-account code (per `mk-p0-2`) — **no child data, name, or photo** in any link, post, or script. Value-post templates speak in general developmental terms, never about a specific named child. UTM params are channel metadata only, no PII.
- **Moat read/write:** the loop's payoff is earned by genuine product activation (the invitee's *first generated plan* = first write into the longitudinal memory moat, per `mk-p0-2`), so group spread converts into real moat-building families, not hollow signups. The playbook writes no child/product data — it is an ops asset; the only writes are account-level entitlement grants handled by the dependency.
- **Ships-visible:** the deliverable is a real, reusable markdown asset linked from the marketing backlog; the channel is operational and measurable end-to-end via the live `?ref=`+UTM contract verified on the dev server — not a deck, but an executable playbook a human can run today.
