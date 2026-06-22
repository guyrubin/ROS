## mk-p0-3-share-export — 1-tap branded share export x4 artifacts
**Aspects:** Marketing, UI/UX, Copy · **Surfaces/platforms:** cross:hero, web:Today, web:Ask, app:shell · **Priority:** P0

### Problem / why
Arbor's growth loop monetizes word-of-mouth, but today the only shareable asset is the Hero Card, and even that just *downloads* a PNG — no native share sheet, no deep-link/referral baking, and no instrumentation. `lib/loopEvents.ts` already declares the contract (`ShareInitiated`/`ShareCompleted`, `LoopArtifact = "avatar" | "story" | "answer_card" | "growth_card"`) and `lib/heroCard.ts` already proves on-device canvas rendering with a "Made with Arbor" watermark — but nothing wires them together, and three of the four artifacts don't exist.

This item builds the **single share engine** behind all four artifacts: a generalized on-device canvas renderer (beside, not inside, the clinical `buildReport` PDF path), a 1-tap share action that uses the native share sheet on iOS/Android (web `navigator.share` with download fallback), referral-code + deep-link + UTM baking into the image footer/caption, and `trackShareInitiated`/`trackShareCompleted` wiring. It gates two downstream items: **mk-p1-1 avatar challenge** and **mk-p2-6 growth card**.

### Scope across platform domains
- **Web app** — new `lib/shareCard.ts` (generalized canvas renderer for 4 artifacts) + `lib/share.ts` (share-or-download orchestrator with loop events + referral baking). New `<ShareButton>` UI primitive. Wire entry points on Today (`OverviewTab.tsx`), Ask (`CoachTab.tsx`), and Avatar (`AvatarCreator.tsx` result step). The existing `downloadHeroCard` call on `OverviewTab.tsx:299` is upgraded to the new share flow (avatar artifact).
- **iOS (Capacitor)** — share via `@capacitor/share` (`Share.share({ files: [...] })`) writing the PNG to `Filesystem` cache first; this surfaces the native iOS share sheet (Messages, WhatsApp, AirDrop, Photos). Falls back to web path if plugin unavailable. No new native permissions needed (cache dir).
- **Android (Capacitor)** — same `@capacitor/share` path; Android share sheet. Verify FileProvider is satisfied by Capacitor's default (it is, via the plugin's bundled provider).
- **Landing EN / Landing HE** — out of scope for code; the **caption/deep-link** baked into shares points at the canonical landing URL (owned by `mk-p0-1-domain`) with `?ref=<code>&utm_source=share&utm_medium=<artifact>`. Coordinate URL constant only.

### IA / UX / Copy / Marketing detail

#### Marketing — the loop, the asset, the instrumentation
The share is the top of the viral loop: **create → share branded artifact (with referral link baked in) → recipient lands on the canonical site with first-touch attribution → installs → activates**. `lib/attribution.ts` already captures `ref`/`utm_*` first-touch and `lib/analytics.ts` attaches them as global props, so every event downstream is sliceable by which artifact drove the install.

Four artifacts (one renderer, four templates):
1. **avatar** — the hero portrait card (today's Hero Card; generalize `renderHeroCard`).
2. **story** — a comic/story beat card (single hero panel + story title); consumed later by p1-comic-reader.
3. **answer_card** — an "Ask Arbor" answer quote card: the parent's question + a 1–2 sentence non-diagnostic takeaway, hero in corner. Source: `CoachTab.tsx` answer.
4. **growth_card** — milestone/progress card (built fully by **mk-p2-6**; this item ships the template stub + renderer hook so p2-6 only supplies data).

**Baked into every image** (bottom band): "Made with Arbor" wordmark + a short URL `arbor.app` (canonical, owned by mk-p0-1). **Baked into the share caption/text** (not pixels, so it's tappable): the deep link `https://<canonical>/?ref=<referralCode>&utm_source=share&utm_medium=<artifact>&utm_campaign=organic_share`. Referral code comes from the user's profile (the field mk-p0-2-referral-loop adds); if absent, omit `ref` and still bake UTM. **Do not** render the referral code as text in the image (privacy + it's not tappable).

Instrumentation contract (use existing names from `lib/loopEvents.ts`, do not rename):
- On tap of any share button → `trackShareInitiated(artifact, surface)` where `surface ∈ "today" | "ask" | "avatar" | "story" | "growth"`.
- On a resolved share (native `Share.share` resolves, or `navigator.share` resolves, or download fired as fallback) → `trackShareCompleted(artifact, channel)` where `channel ∈ "native" | "web_share" | "download"`. (Web/native share APIs don't reveal the chosen app, so `channel` = transport, not destination — acceptable.)
- User-cancel of the OS sheet → no `ShareCompleted` (it rejects with `AbortError`; swallow, no event).

#### UI/UX — `<ShareButton>` + render states
New primitive `components/ui/ShareButton.tsx` (parent-register, calm/premium — NOT playkit). Props: `{ artifact: LoopArtifact; surface: string; getCardOpts: () => ShareCardOpts; label?: string; variant?: "solid" | "ghost"; }`. Internally calls `lib/share.ts`.

- **default** — pill button, min-height 44px (web) / honors safe-area on native via existing shell tokens; icon `Share2` (lucide) + label. Touch target ≥ 44×44 (AA / Apple HIG). On Today this replaces the current "Save hero card" ghost button at `OverviewTab.tsx:298-304`.
- **loading** — while canvas renders + (native) file writes: button disabled, label → "Preparing…", inline spinner; `aria-busy="true"`. Typically <300ms; show spinner only after 150ms to avoid flicker.
- **empty** — for `answer_card` with no answer yet, or `avatar` with no `photoUrl`: button hidden (not disabled) so the surface doesn't dangle a dead action. (`useHeroAvatar().hasHero` already gates avatar.)
- **error** — render/share failure (canvas unavailable, image load fail): non-blocking inline toast/text "Couldn't prepare that — try again." in `--arbor-pink-ink` (matches AvatarCreator error style, `AvatarCreator.tsx:190`). No event on error.
- **motion** — `active:scale-[0.97]` on press (matches existing buttons); respect `prefers-reduced-motion` by gating the scale + any spinner pulse (use existing index.css reduced-motion guard pattern). Spinner uses CSS, paused under reduced-motion.
- **a11y** — `<button>` element, keyboard-activatable, `aria-label` includes child name + artifact ("Share Maya's hero card"); focus-visible ring via existing token. Result toast announced via `aria-live="polite"`.
- **RTL** — button is icon+label flex; under `dir="rtl"` (HE) the icon/label order flips automatically via flexbox + logical properties. The **canvas image itself stays LTR** (brand wordmark is latin "Made with Arbor"); the share **caption** is localized — provide HE caption string. The card's name text: render child name as-is (Hebrew names render fine in canvas with a system font stack; set `ctx.direction = "rtl"` when the name contains RTL chars, else default).

#### Copy — actual strings (add to `lib/i18n.ts`, EN block ~line 511 + HE block ~line 1002; append only)
- `share.cta.avatar`: EN "Share hero card" / HE "שתפו כרטיס גיבור"
- `share.cta.story`: EN "Share this story" / HE "שתפו את הסיפור"
- `share.cta.answer`: EN "Share this answer" / HE "שתפו את התשובה"
- `share.cta.growth`: EN "Share progress" / HE "שתפו התקדמות"
- `share.preparing`: EN "Preparing…" / HE "מכינים…"
- `share.error`: EN "Couldn't prepare that — try again." / HE "לא הצלחנו להכין — נסו שוב."
- `share.caption.avatar`: EN "Meet {name}, an Arbor hero. {url}" / HE "הכירו את {name}, גיבור/ת Arbor. {url}"
- `share.caption.answer`: EN "What Arbor told me about {name}: {url}" / HE "מה ש‑Arbor אמרה לי על {name}: {url}"
- `share.caption.story`: EN "{name}'s story, made with Arbor. {url}" / HE "הסיפור של {name}, נוצר עם Arbor. {url}"
- `share.caption.growth`: EN "{name}'s progress this month — Arbor. {url}" / HE "ההתקדמות של {name} החודש — Arbor. {url}"
- Note: `share.cta.avatar` supersedes the old `ov.hero.card` ("Save hero card", `i18n.ts:490/981`). Keep `ov.hero.card` key in place (referenced elsewhere) but OverviewTab switches to `share.cta.avatar`.

The on-image latin "Made with Arbor" is a **brand wordmark**, not UI copy — it stays English in all locales (consistent with the logo). This is the only non-localized string and it is intentional.

### Files to create / edit (exact repo-relative paths)
Create:
- `PPPPtherapy-/PPPPtherapy-/app/src/lib/shareCard.ts` — generalized canvas renderer. Export `renderShareCard(opts: ShareCardOpts): Promise<{ dataUrl: string; blob: Blob }>` and per-artifact template fns. Extract the shared canvas helpers (`loadImage`, `roundRect`, `drawCover`, watermark band) from `heroCard.ts` into here; re-export `renderHeroCard` from `shareCard.ts` to keep `heroCard.ts` callers working OR migrate `heroCard.ts` to delegate (prefer: move logic to `shareCard.ts`, keep `heroCard.ts` as a thin compat shim re-exporting `renderHeroCard`/`downloadHeroCard`).
- `PPPPtherapy-/PPPPtherapy-/app/src/lib/share.ts` — `shareCard({ artifact, surface, opts, captionKey, refCode, market })`: renders → builds caption (referral/UTM baked) → tries native `@capacitor/share` (dynamic import, native-only) → `navigator.share({ files })` → download fallback; fires loop events; returns resolved channel.
- `PPPPtherapy-/PPPPtherapy-/app/src/components/ui/ShareButton.tsx` — the primitive described above.
- `PPPPtherapy-/PPPPtherapy-/app/src/lib/share.test.ts` — unit tests for caption/URL building (pure fn `buildShareCaption(...)` + `buildShareUrl(...)` extracted so they're testable without canvas), mirroring `attribution.test.ts`.

Edit:
- `PPPPtherapy-/PPPPtherapy-/app/src/lib/loopEvents.ts` — **no edits**; consume existing exports. (Listed as shared only because we import from it.)
- `PPPPtherapy-/PPPPtherapy-/app/src/lib/reportExport.ts` — **no functional edit to `buildReport`/`openPrintableReport`**. Optionally add a one-line top comment pointing to `shareCard.ts` as the image/branded sibling of this clinical/text path. The image renderer lives in `shareCard.ts`, NOT here (see conflict notes).
- `PPPPtherapy-/PPPPtherapy-/app/src/components/profile/AvatarCreator.tsx` — in the result block (`AvatarCreator.tsx:183-188`), add a `<ShareButton artifact="avatar" surface="avatar" ...>` next to "Use this avatar". Source image = `result` dataUrl, name = `childName`.
- `PPPPtherapy-/PPPPtherapy-/app/src/components/tabs/OverviewTab.tsx` — replace the `downloadHeroCard` button (`:298-304`) with `<ShareButton artifact="avatar" surface="today" getCardOpts={() => ({ imageUrl: childProfile.photoUrl!, name: firstName, age: childProfile.age })} label={t("share.cta.avatar")} />`. Drop the now-unused `downloadHeroCard` import if no other use.
- `PPPPtherapy-/PPPPtherapy-/app/src/components/tabs/CoachTab.tsx` — add `<ShareButton artifact="answer_card" surface="ask" ...>` on a settled answer; `getCardOpts` supplies `{ question, takeaway, imageUrl: heroUrl, name }`.
- `PPPPtherapy-/PPPPtherapy-/app/src/lib/i18n.ts` — append the `share.*` keys to EN and HE blocks (append-only, no reordering).
- `PPPPtherapy-/PPPPtherapy-/app/package.json` + native config — add `@capacitor/share` dependency (already common; verify present, add if not). Run `npx cap sync` is a build step, not a code edit here.

### Shared-file conflict notes
- **`lib/reportExport.ts`** (hotspot: p2-hero-everywhere, c3-ask-specialist, p2-8-red-flag-monitoring, mk-p0-3, mk-p2-6): per the hotspot rule, **build the image renderer in a NEW file `lib/shareCard.ts`, NOT inside `buildReport`.** The clinical PDF path (c3/b3/p2-8 share ONE exporter) must stay single. This spec touches `reportExport.ts` at most for a one-line pointer comment — coordinate so the clinical signature is untouched. mk-p2-6 then *reuses* `shareCard.ts`, not `reportExport.ts`.
- **`lib/loopEvents.ts`** (hotspot: p4 + all mk items): mk-p0-4-analytics-wiring wires the dead exports FIRST and owns event names. This item only *imports* `trackShareInitiated`/`trackShareCompleted`/`LoopArtifact`. **Do not rename or re-add events.** Land after mk-p0-4. The `LoopArtifact` union already includes all four artifact names — no edit needed.
- **`AvatarCreator.tsx`** (shared with p2-9-coppa-consent): p2-9 edits the consent/photo block; this item only adds a button in the *result* block. Append the ShareButton inside the existing `{result && (...)}` JSX; do not touch the consent checkbox or `generate()`. Merge-safe if p2-9 lands first.
- **`lib/i18n.ts`** (shared with mk-p0-8-copy-pack, mk-p2-1-localize-nl, mk-p2-7): append-only at the end of each language block; reconcile any `share.*` key collision with mk-p0-8 by deferring to the copy-pack's wording if it defines the same key (copy-pack is the source of truth for marketing strings).
- **`lib/attribution.ts`** — read-only consumer (`loadAttribution()` for market + referral context); no edits. mk-p0-2/mk-p0-5 own that file.

### Dependencies
- **mk-p0-4-analytics-wiring** (declared `dependsOn`) — must land first so `trackShareInitiated/Completed` route through `track()` with attribution global props live.
- **mk-p0-2-referral-loop** — soft dep: supplies the user's `referralCode` on the profile. If it hasn't landed, ship with `ref` omitted (UTM-only caption) and add `ref` baking once the field exists. Not a hard blocker.
- **mk-p0-1-domain** — soft dep: supplies the canonical URL constant for the caption/watermark. Until then, use the prod hosting origin already in `lib/runtime.ts` (`PROD_API_ORIGIN`) as the URL constant placeholder, centralized in one `SHARE_URL` const so mk-p0-1 swaps it in one place.

### Acceptance criteria (testable, incl. "verified live on dev server")
1. `npm run build` + `tsc` pass; `npm test` green incl. new `share.test.ts` (caption/URL builders: ref present → URL has `ref=`; ref absent → no `ref` param but UTM present; market reflected).
2. **Verified live on dev server**: on Today, tapping "Share hero card" renders a 1080×1350 PNG with hero, name, "Made with Arbor" + URL band; web `navigator.share` sheet opens (or download fires in browsers without it).
3. Avatar Creator result step shows a working ShareButton that shares the just-generated avatar.
4. Ask (CoachTab) shows ShareButton only when an answer is present; shared answer_card image contains the question + non-diagnostic takeaway + hero.
5. DevTools console shows `[track] share_initiated {artifact, surface}` on tap and `[track] share_completed {artifact, channel}` on resolve (in DEV); cancel → no completed event.
6. Caption deep link contains `utm_source=share&utm_medium=<artifact>&utm_campaign=organic_share` and, when a referral code exists, `ref=<code>`.
7. Native (verified on Android emulator or device via `npx cap run android`): tapping Share opens the OS share sheet with the PNG attached (iOS requires a Mac to verify — mark iOS as "code-complete, verify on Mac").
8. a11y: button reachable + activatable by keyboard, has descriptive `aria-label`; under `prefers-reduced-motion` no scale/spinner animation; under `dir="rtl"` HE labels render and button mirrors.
9. growth_card template renders a placeholder card (real data wired by mk-p2-6) without crashing.

### Operating-rule checks
- **No dark patterns** — sharing is explicit, opt-in, 1-tap; nothing auto-posts; no pre-checked share consent; cancel is honored silently. The referral link is disclosed (visible URL on the card) — recipients see where it goes.
- **Privacy / COPPA-2026** — shares the **stylized avatar only** (never a raw face; `AvatarCreator` already discards reference photos). Referral code is baked into the tappable caption, **not** rendered as readable text on the image. Canvas render is 100% on-device (no upload), consistent with `heroCard.ts` and `lib/analytics.ts` privacy stance. No child PII beyond first name + age on the artifact, matching the existing Hero Card.
- **Moat read/write** — answer_card and growth_card **read** the longitudinal memory (Ask answer, milestone progress); `share_initiated/completed` events **write** to the per-user `users/{uid}/events` collection (via `track()`), feeding the loop dashboards. Sharing is itself a moat-reinforcing signal (engaged families).
- **Ships-visible** — every artifact is a user-facing button on Today, Ask, and Avatar Creator; the loop event stream is observable in the analytics collection. Integrated (one renderer, one share orchestrator), not bolted-on.
