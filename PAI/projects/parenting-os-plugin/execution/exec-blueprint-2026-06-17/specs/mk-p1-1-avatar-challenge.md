## mk-p1-1-avatar-challenge — #ArborAvatar challenge launch (HE)
**Aspects:** Marketing, Copy · **Surfaces/platforms:** landing:he, cross:hero · **Priority:** P1

> Discipline applied: `marketing:campaign-plan` (loop + calendar + instrumentation) layered with `rubin-os:copywriter` (HE-first launch strings). Grounded against the shipped loop primitives in `lib/loopEvents.ts`, `lib/attribution.ts`, `lib/heroCard.ts`, the share-export build (P0-3) it depends on, and the HE landing page.

---

### Problem / why

The GTM (`marketing/arbor-viral-gtm-2026-H2.md` §3a) names the **Arbor Avatar** as *the* TikTok/Instagram unit and the cheapest path to early K-factor data in Israel. The avatar generator shipped (`generateImage()` / Avatar Creator / `lib/heroCard.ts` on-device render with "Made with Arbor" watermark) and the funnel is instrumented (`lib/loopEvents.ts`, first-touch `lib/attribution.ts`, commit `e09537a`). What is missing is the **ignition content campaign**: the HE-localized #ArborAvatar challenge that turns the share artifact into installs.

This is a **Marketing + Copy mission, not an engineering build** — it produces the launch asset kit, the HE copy, the creator brief, the landing-page campaign entry point, and the instrumentation plan that proves the loop. It is Marketing P1-1 on the critical path: `P0-3 share-export + P0-8 copy-pack → P1-1` (per `marketing/arbor-marketing-backlog.md` line 30 and the dependency chain line 58). No paid euro spends until this proves K ≥ 0.4 organically (GTM §6 spending rule, §9 Phase-1 exit gate).

The job: ship a coherent, on-brand, privacy-safe HE avatar challenge that (1) is screenshot/Reel-native, (2) carries a referral-coded deep link in every share, (3) routes to a real campaign landing entry, and (4) is measured end-to-end on the existing event contract.

---

### Scope across platform domains

| Domain | In scope? | What specifically changes |
|---|---|---|
| **Web app** | Indirect | No app code is authored by this mission. It **consumes** the P0-3 share button (avatar → 9:16 + 1:1 branded export, referral code baked into the deep link) and the `trackShareInitiated/Completed("avatar", …)` events already defined in `lib/loopEvents.ts`. This spec lists the *exact caption strings* and *deep-link/UTM contract* the P0-3 export must pre-fill. |
| **iOS (Capacitor)** | Indirect | Same share path via native share-sheet (P0-3 / `lib/native.ts`); challenge caption + hashtag must pre-fill on iOS share. No code here — acceptance note only. |
| **Android (Capacitor)** | Indirect | Same as iOS. |
| **Landing EN** | No | Out of scope (this is the HE ignition; EN launch is `mk-p2-4`). |
| **Landing HE (RTL)** | **Yes** | Add a campaign entry: a `#ArborAvatar` challenge section + a UTM/ref-tagged primary CTA on `html/arbor-marketing-landing-page-he.html`, so "link in bio" lands on a page that explains the challenge and starts the avatar flow. (Patch-only — see shared-file note; do not rewrite.) |
| **cross:hero** | **Yes (copy/brand)** | The challenge is the public face of the cross-domain Hero identity. This mission defines the hero/avatar **brand voice + visual rules** the challenge kit and creator brief must follow (privacy-safe stylized character, never photo-real, "Made with Arbor" watermark, Sprout fallback never shown in challenge assets). No `HeroAvatar.tsx` edits. |

---

### IA / UX / Copy / Marketing detail

#### A. The loop (mechanic — must match the shipped contract)

```
See avatar in app / on a creator post
   → Create your child's Arbor avatar (Avatar Creator, shipped)
   → Tap Share (P0-3): branded 9:16 + 1:1 PNG, "Made with Arbor" watermark,
       caption pre-filled from this spec, deep link with ?ref=CODE&utm_*
   → share_initiated("avatar") → share_completed("avatar", channel)   [lib/loopEvents.ts]
   → Share-to-unlock: completing a share unlocks a 2nd avatar style (P0-3 hook)
   → Friend taps link → first-touch attribution captured (?ref + utm_*)  [lib/attribution.ts]
   → Friend installs → profile_created → first_plan = activation
   → invite_activated credits inviter a Plus month (P0-2, server-side)
```

This mission owns **everything left of `share_completed`'s caption** plus the landing entry; the eng pieces (export, unlock, credit) are the P0-2/P0-3 dependencies.

#### B. Copy — HE-first launch strings (canonical; append to copy-pack §2)

These extend (do not replace) `marketing/arbor-launch-copy-pack.md` §2. Hebrew is launch-draft and **carries the existing native-review flag** (copy-pack line 5) — do not publish HE without a native pass.

**Challenge name / hashtag:** `#ArborAvatar` (Latin hashtag, used in both HE + EN posts for cross-tagging).

**Share caption (HE) — pre-fill for the P0-3 avatar export share-sheet:**
> תכירו את ה־avatar של הילד/ה שלי 🌳 יצרתי אותו ב־Arbor — האפליקציה שעוזרת לי להבין מה קורה עם הילד/ה ומה לעשות עכשיו. תיצרו אחד שלכם, שתפו, ותתייגו אותי 👇 #ArborAvatar
> (קישור בביו / בתגובה)

**Share caption (EN) — same export, EN locale:**
> Meet my kid's Arbor character 🌳 Made it in Arbor — the app that helps me understand what's going on with my child and what to do tonight. Make yours, share, and tag me 👇 #ArborAvatar

**Share-to-unlock confirmation microcopy (HE)** — shown after `share_completed`, supplied to P0-3 for the unlock toast:
> שותף! 🎉 פתחתם סגנון avatar חדש. תרצו ליצור עוד אחד?  → `צרו סגנון חדש`

**Landing campaign section (HE, RTL)** — new block on `arbor-marketing-landing-page-he.html`:
- Eyebrow: `אתגר #ArborAvatar`
- H: `הפכו את הילד/ה שלכם לדמות — בפרטיות מלאה`
- Body: `יוצרים דמות מצוירת (לא תמונה אמיתית) של הילד/ה, משתפים, ותתייגו אותנו. כל שיתוף פותח סגנון נוסף. הנתונים נשארים שלכם.`
- Primary CTA: `צרו את ה־avatar שלכם` → app deep link (see §D)
- Privacy reassurance line (anti-backlash, GTM §10): `דמות מצוירת בלבד · לא נשמרת תמונת פנים · באישור הורה`

**Three IL short-form hooks (Reels/TikTok, append to copy-pack §6)** — hook #4 in the pack is the avatar hook; add three challenge-specific lines:
1. "הפכתי את הבת שלי לדמות קטנה ב־30 שניות — והאפליקציה גם אמרה לי מה קורה איתה. תיצרו אחד ותתייגו אותי 👇 #ArborAvatar"
2. "האתגר החדש של ההורים: דמות Arbor לילד/ה שלכם. פרטי, מצויר, ולא תמונה אמיתית. מי הבא? #ArborAvatar"
3. "שיתפתי את ה־avatar וקיבלתי סגנון נוסף חינם. עכשיו תורכם 👇 #ArborAvatar"

**Creator brief (rides copy-pack §3 DM):** post = *your real "is this normal at 2am" moment* + your kid's avatar; authenticity > polish; affiliate `ref` code per creator; required on-screen: the avatar + the "link in bio" + `#ArborAvatar`; required disclosure: paid-partnership tag where a fee was paid (no dark patterns). Tracker: `marketing/arbor-il-creator-tracker.md`.

#### C. Asset kit (Marketing — produced by this mission)

Delivered as a spec doc + a `marketing/assets/avatar-challenge/` brief (Canva-built per P0-7, brand: pine green, Heebo/Noto Sans Hebrew for HE per landing `:111`):
1. **Challenge frame / template** — 9:16 + 1:1, RTL-safe, leaves room for the user's avatar; "Made with Arbor" + `#ArborAvatar` lockup. (The *runtime* watermark/export is P0-3; this is the creator-facing reference template.)
2. **Creator one-pager** (HE) — brief + affiliate code field + do/don't (privacy line mandatory).
3. **"How to join" 6-sec Reel storyboard** — open app → create avatar → share → unlock.
4. **WhatsApp/FB group seed post (HE)** — value-first, non-spam (hands off to `mk-p1-3`).

#### D. Instrumentation & deep-link contract (Marketing owns the scheme; reuses shipped capture)

Every challenge surface uses **one UTM + ref scheme** so the funnel dashboard (P0-4) slices it. `lib/attribution.ts` already parses `?ref` / `?referral` and all five `utm_*` params first-touch — this mission only defines the values:

| Surface | Link template |
|---|---|
| In-app avatar share (P0-3 export) | `https://<domain>/il?ref=<CODE>&utm_source=share&utm_medium=avatar&utm_campaign=arboravatar` |
| Creator bio/post | `https://<domain>/il?ref=<CREATORCODE>&utm_source=creator&utm_medium=reel&utm_campaign=arboravatar&utm_content=<handle>` |
| Paid amplification (later, winners only) | `…&utm_source=meta&utm_medium=paid&utm_campaign=arboravatar` |
| Landing HE challenge CTA → app | app deep link + `utm_source=landing_he&utm_medium=challenge&utm_campaign=arboravatar` |

- `<domain>` = the P0-1 branded domain once live; **do not hardcode `web.app`** in any published challenge asset (GTM §4). Until P0-1 verifies, the landing CTA stays as-is and challenge links are held.
- Events consumed (no new events): `share_initiated`/`share_completed` with `artifact:"avatar"` (`lib/loopEvents.ts:56-60`); `invite_activated` (P0-2). Dashboard slice: `utm_campaign=arboravatar` by `market=il` and `source`.
- **K-factor read:** `invite_activated` ÷ activated users for `utm_campaign=arboravatar`; Phase-1 gate K ≥ 0.4 (GTM §8).

#### E. Landing HE (RTL) UX detail

- Insert the challenge block (§B) **after** the comparison section, **before** the final CTA (`.cta-final`, `:470`). Reuse existing tokens/classes (`.cbox`, `.tick`, brand greens) — no new CSS system.
- RTL: section inherits the page `dir="rtl"`; CTA arrow/icon mirrors; no LTR-only assumptions.
- States: static marketing section — no loading/empty/error. The CTA is a plain link.
- a11y (AA): CTA is a real `<a>` with discernible text; contrast ≥4.5:1 (green-700 on light, per existing `.cta-final` palette); focus-visible ring inherited; respects `prefers-reduced-motion` (no autoplay/looping video in the section — static frame + still).
- Touch target: CTA ≥44px tall (matches existing `.btn` sizing).
- No dark patterns: no countdown timer, no fake scarcity, no "X parents joined" fabricated counter.

---

### Files to create / edit (exact repo-relative paths)

**Create:**
- `PAI/projects/parenting-os-plugin/marketing/arbor-avatar-challenge-playbook.md` — this mission's deliverable: loop diagram, calendar (Phase-1 wk 3-8), creator brief, asset list, UTM/ref scheme, KPI gates. (Primary artifact.)
- `PAI/projects/parenting-os-plugin/marketing/assets/avatar-challenge/README.md` — asset kit index + Canva build notes (P0-7 brand).

**Edit:**
- `PAI/projects/parenting-os-plugin/marketing/arbor-launch-copy-pack.md` — **append** the share-to-unlock toast string, the 3 challenge hooks (§6), and the landing-section HE copy to the existing §2/§6. Append-only; preserve the line-5 native-review flag.
- `PAI/projects/parenting-os-plugin/html/arbor-marketing-landing-page-he.html` — add the challenge section (§E) before `.cta-final`; UTM-tag the challenge CTA only.

**Consumes (do NOT edit here):** `PPPPtherapy-/PPPPtherapy-/app/src/components/profile/AvatarCreator.tsx`, `lib/heroCard.ts`, `lib/loopEvents.ts`, `lib/attribution.ts` — all owned by `mk-p0-3-share-export` / `mk-p0-2-referral-loop`.

---

### Shared-file conflict notes

- **`PAI/projects/parenting-os-plugin/marketing/arbor-launch-copy-pack.md`** — listed shared file; hotspot `touchedBy: [mk-p0-8-copy-pack, mk-p1-1-avatar-challenge, mk-p2-4-en-launch-appstore, mk-p2-5-pr-push]`. **`mk-p0-8` owns the canonical structure and lands first (it is a dependency).** This mission **appends only** (new strings under existing §2/§6 headings); never reorder or rewrite existing sections, so p2-4/p2-5 can append their App-Store/PR strings without collision. Coordinate by section: p1-1 = challenge captions/hooks, p2-4 = store listing, p2-5 = PR.
- **`PAI/projects/parenting-os-plugin/html/arbor-marketing-landing-page-he.html`** — hotspot `touchedBy: [p3-ios-grade-audit, mk-p0-1-domain, mk-p0-5-attribution-utm, mk-landing-parity-rebuild, mk-p1-4-aeo-seo-he]`. Per the hotspot note, **`mk-landing-parity-rebuild` may rewrite this file wholesale**, and `mk-p0-1`/`mk-p0-5` patch the canonical URL + UTM wiring. To avoid clobber: this mission adds ONE self-contained section (using existing classes, no new CSS, no `<head>`/canonical/URL edits) so it re-applies cleanly after a rebuild; **leave canonical/sitemap URLs to mk-p0-1** and **leave the global CTA UTM wiring to mk-p0-5** — only tag the new challenge-section CTA. Sequence after the parity rebuild if both are in flight.
- No `PPPPtherapy-/app/src` shared files are written by this mission (it consumes P0-2/P0-3 outputs), so it does not enter the `loopEvents.ts` / `reportExport.ts` / `attribution.ts` eng hotspots.

---

### Dependencies (must land first)

- **`mk-p0-3-share-export`** — the 1-tap branded avatar export (9:16 + 1:1, watermark, deep link with `ref` + caption pre-fill, share-to-unlock hook). The challenge is non-functional without it. *(Status: P0-3 not yet built; `trackShareInitiated/Completed` helpers exist, export does not.)*
- **`mk-p0-8-copy-pack`** — owns the copy-pack file this mission appends to. *(Status: done — copy-pack exists.)*
- **Soft / publishing-gate, not build-gate:** `mk-p0-1-domain` (no published asset may point at `web.app`); `mk-p0-2-referral-loop` (the inviter Plus-month credit is what makes share-to-unlock + referral pay off). The playbook + copy can be authored now; **publishing the live links waits on P0-1 + P0-3.**

---

### Acceptance criteria (testable)

1. `arbor-avatar-challenge-playbook.md` exists with: loop diagram, Phase-1 (wk 3-8) calendar, UTM/ref scheme table, creator brief, asset list, and the K ≥ 0.4 / activation ≥ 35% gate (GTM §8/§9).
2. Copy-pack contains the HE + EN share captions, the share-to-unlock toast, and the 3 challenge hooks — appended under existing headings, line-5 native-review flag intact.
3. The HE landing page renders a `#ArborAvatar` challenge section (RTL, existing tokens) with a UTM-tagged CTA, placed before `.cta-final`; **verified live on dev server** (page loads, section visible RTL, CTA focusable, AA contrast, no console errors, no layout break at 375px + desktop).
4. Every published challenge link matches the §D template (carries `?ref=` + `utm_campaign=arboravatar`) and **contains no `web.app` URL** (grep the asset kit + landing CTA = 0 hits).
5. The in-app avatar share caption the P0-3 export pre-fills is the exact HE string in §B (cross-checked against copy-pack).
6. A dry-run of the deep link through `lib/attribution.ts` `parseAttribution` yields `market:"il"`, `source:"share"|"creator"`, `utm_campaign:"arboravatar"`, and the `referralCode` (verifiable via `attribution.test.ts` fixture).

### Operating-rule checks

- **No dark patterns** (AADC/Fairplay, BACKLOG operating rules): share-to-unlock rewards a *creative* style, not a streak/variable-reward; no fabricated join-counters, no countdown, no autoplay on the landing section; paid creator posts must carry a disclosure tag.
- **Privacy / COPPA-2026:** challenge assets show the **stylized, non-photo-real** avatar only (never a raw face); generated images already carry SynthID/C2PA + "Made with Arbor" (`lib/heroCard.ts`); the HE landing section states "דמות מצוירת בלבד · לא נשמרת תמונת פנים · באישור הורה". Share is parent-initiated; no child PII in any link or caption. Mitigates the GTM §10 privacy-backlash risk explicitly.
- **Moat read/write:** the challenge drives `profile_created` → `first_plan` (activation = a child record + first plan), seeding the longitudinal memory moat; the avatar artifact is itself a moat-derived object (the child's hero). Read: it surfaces the hero identity; write: each activation creates the record.
- **Ships visible:** landing change deploys to the marketing surface and is verified live; the playbook + copy are committed Markdown; the campaign is measurable end-to-end on the existing P0-4 funnel (no event left unwired) before any paid spend.
