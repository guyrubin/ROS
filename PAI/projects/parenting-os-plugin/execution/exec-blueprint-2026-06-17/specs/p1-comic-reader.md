## p1-comic-reader — Comic-book story reader
**Aspects:** IA, UI/UX, Copy · **Surfaces/platforms:** web:Academy, web:Grow, child:PlayKit, ios, android · **Priority:** Phase1

> EB Phase-1 #1 == PRD 8.3 A3b. The `/api/generate-comic` backend and single-panel generation are DONE. This item builds the **reader/book UX** on top of it: multi-panel page-turn, a cover, robust save/share, and a durable per-avatar+story cache so a child's comic survives a reload and re-opens instantly. It owns the comics surface (`comics` tab) and the comic rendering shared by Story Journeys.

---

### Problem / why

Two comic experiences exist today and both stop short of a "book":

1. **`HeroComicsTab.tsx`** (`comics` tab, Academy) generates **one** panel per adventure, holds it only in component `useState`, and "saves" via a raw `document.createElement("a")` anchor download (`HeroComicsTab.tsx:57-63`). Nothing persists — reload loses the comic. No page-turn, no cover, no share, no cache. The picker shows 6 hardcoded `ADVENTURES` with no concept of a multi-page story.
2. **`HeroScenePlayer.tsx`** already renders Story-Journey beats *as comic panels* and has the right instincts: a per-session in-memory cache keyed by `comic|seed|hash(avatar)` plus an in-flight dedupe map (`HeroScenePlayer.tsx:14-15, 65-91`) and a page-turn (`rotateY`) motion (`HeroScenePlayer.tsx:142-165`). But that cache is **module-memory only** (lost on reload), keyed per-beat (no whole-book object), and its save is again a bare anchor (`HeroScenePlayer.tsx:93-99`).

Result: a child cannot build, keep, re-open, or share a multi-page comic book. This is the #1 Phase-1 gap. We need a real **Comic Reader**: a generated multi-panel book with a cover, swipe/tap/keyboard page-turn, durable per-avatar+story caching (Firestore-backed via `useChildCollection`), and a single first-class Save/Share path that feeds the growth loop. The hero is always the child's saved stylized avatar (privacy-first; never a photo).

---

### Scope across platform domains

- **Web (Academy › `comics`):** Replace single-panel `HeroComicsTab` with the multi-page **ComicReader**. Adventure picker → generates an N-page book (default 4 pages: cover + 3 beats) → page-turn reader with cover, Save, Share, Make-another. Books persist per child via a new `heroComics` collection.
- **Web (Grow):** No new tab. Add a single **entry affordance** from Grow → Practice/Daily-Play context that deep-links to `#comics` ("Turn today's practice into a comic"). The reader itself lives in Academy; Grow only links in. (Keeps IA single-home; avoids a second comics surface.)
- **child:PlayKit:** The reader is a child-register surface — built entirely from `ui/playkit.tsx` primitives (`PlayShell`, `PlayHeader`, `PlayPanel`, `PlayButton`, `ProgressPips`, `Celebrate`). Add **one** new primitive, `ComicPage`, to `playkit.tsx` (the framed page-turn panel, extracted/generalized from `HeroScenePlayer`'s panel) so both the reader and `HeroScenePlayer` consume the same component.
- **iOS (Capacitor):** No native code change. Verify: swipe page-turn coexists with the WebView's horizontal-swipe-back gesture (use vertical-tolerant horizontal swipe + explicit tap zones so it isn't hijacked); Save writes to Photos via the existing share/download path (data-URL → blob); safe-area: reader chrome respects `env(safe-area-inset-*)` already handled by Shell — do not add fixed overlays that ignore it.
- **Android (Capacitor):** Hardware **Back** button must turn a page back, and close the reader from the cover (not exit the app). Wire via the existing nav/back handling; Save uses the Web Share API / download fallback.
- **Landing EN / Landing HE:** Out of scope (no marketing-page change in this item).

---

### IA / UX / Copy detail (build-level)

#### IA
- The `comics` tab stays the **single home** for the reader (already registered: `ArborContext.tsx:79`, `VALID_TABS` `ArborContext.tsx:98`, Shell lazy import + registry `Shell.tsx:44,85`, nav item `navigation.ts:90` lives under `stories` — keep `comics` reachable; see Copy note below on labeling). Do **not** add a second comics leaf. Grow links in via hash deep-link `#comics`.
- A generated comic is a first-class saved artifact (`HeroComic`), listed in a **Bookshelf** at the top of the reader's catalog view (mirrors the "Journey library" pattern in `HeroJourneyTab.tsx:349-380`). Re-opening a saved book reads from cache → instant, no regeneration.

#### Reader model (states)
The `comics` tab renders one of three views (mirror `HeroJourneyTab`'s catalog/player split):

1. **No-hero gate** — keep the existing pattern (`HeroComicsTab.tsx:66-83`): `PlayHeader` + invite to `setActiveTab("profile")`. Copy unchanged.
2. **Catalog** — `PlayHeader` ("Comic Studio") + adventure picker grid (reuse the 6 `ADVENTURES`, kept in a shared `lib/heroComics.ts`) + **Bookshelf** of saved books (cover thumbnails).
3. **Reader** — the page-turn book.

**Reader view — per-page states:**
- **default:** Cover page (title + hero avatar large + "{name}'s Comic" + START button) → swipe/tap to page 1..N.
- **loading (book generation):** progressive — render the cover immediately (from avatar, no AI needed), then stream pages: each page shows the "Drawing the next page…" placeholder (`HeroScenePlayer.tsx:154-158`) until its panel resolves. Pages generate sequentially through the in-flight dedupe map so the child can start reading the cover while page art arrives. A `ProgressPips` strip shows pages loaded.
- **empty:** (catalog, no saved books) `PlayPanel` with `BookOpen` icon + "Pick an adventure to make your first comic." (reuse copy at `HeroComicsTab.tsx:129-135`).
- **error (per page):** if a page's `generateComic` rejects, that page shows a friendly retry tile ("This page got smudged — tap to redraw") with a `PlayButton`. Other pages remain readable. Never block the whole book on one failed page. Error string: see Copy. Existing single-error pattern at `HeroComicsTab.tsx:50-54,137`.
- **error (whole book, e.g. offline):** `PlayPanel` with mascot + "We couldn't draw this comic right now. Check your connection and try again." + Retry.

**Page-turn interaction:**
- Reuse the `rotateY` page-flip from `HeroScenePlayer.tsx:142-165` (`perspective:1600`, `transformOrigin:"left center"`, cubic-bezier `[0.22,1,0.36,1]`, ~0.42s). Move it into the new `ComicPage` playkit primitive.
- **Inputs:** (a) tap right third → next, tap left third → prev (large invisible tap zones, full panel height); (b) horizontal swipe (drag threshold ~60px, ignore if vertical delta dominates → preserves iOS edge-back); (c) on-screen prev/next `PlayButton`s (always present for a11y/desktop); (d) keyboard ArrowLeft/ArrowRight + Home/End.
- **RTL:** when `aiLang === "he"` (or `dir==="rtl"`), invert page direction — swipe-left = previous, page-flip mirrors (`transformOrigin:"right center"`, inverted `rotateY` sign). Tap zones swap. Pull `dir` from `LanguageContext` (read-only; do not add keys there in this item — see conflict notes).

**Cover:**
- Page 0 is a generated **cover panel** (call `generateComic` with `theme: "<adventure> — dramatic comic-book COVER with the title, no panels"` and `dialogue` omitted). Large hero avatar via `HeroAvatar`. Title in `var(--font-display)`. A subtle "ARBOR COMICS" issue-banner.

**Completion:**
- Last page → `Celebrate` (`playkit.tsx:233-270`) "The End!" with the child's hero taking a bow, then Save / Share / Make-another actions.

**Motion / reduced-motion:** all flips and confetti go through the existing reduced-motion guards (`celebrateBurst` checks `prefers-reduced-motion` at `playkit.tsx:20-21`; motion variants must collapse flip → cross-fade when reduced). Add an explicit `prefers-reduced-motion: reduce` branch in `ComicPage` that swaps `rotateY` for an opacity fade.

**Touch targets:** every control ≥ 48px — `PlayButton` already enforces `min-h-[54px]`/`46px` (`playkit.tsx:141`); tap-zones are full-height; prev/next buttons ≥ 54px.

**A11y (AA):**
- `<img>` panels: `alt` = page narration/title (e.g. `alt={`Page ${n}: ${title}`}`) — already partially done (`HeroScenePlayer.tsx:153`).
- Reader is a labelled region: `role="region" aria-roledescription="comic book" aria-label="{name}'s comic"`. Page count via `ProgressPips` `role="progressbar"` (already `playkit.tsx:205`).
- Keyboard: arrows turn pages; Save/Share are real `<button>`s; focus moves to the new page heading on turn (`aria-live="polite"` announces "Page 2 of 4").
- Contrast: page-number badge is white on `var(--arbor-ink)` (AA ok); all body text uses `--arbor-ink`/`--arbor-ink-soft` on white/paper (existing tokens, AA-compliant).

#### Copy (actual strings — UX-copy discipline, no dark patterns)
- Catalog header title: **"Comic Studio"** · `say`: **"Pick an adventure — {name} stars in their own comic book!"**
- Picker tile labels: keep existing 6 (`HeroComicsTab.tsx:16-21`).
- Cover START button: **"Read {name}'s comic"**
- Generating: **"Drawing {name}'s comic book…"** / sub: **"A few seconds — making each page!"**
- Per-page redraw error: **"This page got a bit smudged."** + button **"Redraw page"**
- Whole-book error: **"We couldn't draw this comic right now. Check your connection and try again."** + **"Try again"**
- Completion (`Celebrate` title): **"The End!"** · subtitle: **"{name} saved the day. Keep it forever or share it."**
- Actions: **"Save comic"** (icon `Download`), **"Share comic"** (icon `Share2`), **"Make another"** (icon `RefreshCw`) — match existing verbs (`HeroComicsTab.tsx:119-124`).
- Bookshelf section label: **"{name}'s bookshelf ({count})"**
- Safety strip (keep verbatim from `HeroComicsTab.tsx:140-143`): "Safe & private — Comics use {name}'s saved cartoon hero — never a real photo. Images are AI-made and provenance-watermarked."
- Grow entry affordance: **"Turn today's practice into a comic →"**
- Hebrew: all strings must pass through the existing AI-language path the way `HeroJourneyTab` does (`aiLang === "he" ? story.titleHe : story.title`, `HeroJourneyTab.tsx:323`). Adventure titles need an `he` field added in `lib/heroComics.ts`; UI chrome strings localized via the existing i18n surface used elsewhere in playkit tabs (do not invent a new mechanism).

#### Marketing / loop instrumentation
- On Save: `trackShareInitiated("story", "comic-reader")` is NOT correct — Save is local. Use existing `track("hero_comic_generated", { adventure })` on each generation (already at `HeroComicsTab.tsx:49`) and add `track("hero_comic_saved", { adventure, pages })`.
- On Share: call `trackShareInitiated("story", "comic-reader")` then `trackShareCompleted("story", channel)` on success — these are the canonical loop helpers (`loopEvents.ts:56-60`). **Do not add or rename events in `loopEvents.ts`** (see conflict notes) — only *call* the existing `share_initiated` / `share_completed` with `artifact:"story"`.
- Share payload = the rendered cover PNG (data-URL → blob → Web Share API `navigator.share({ files })`; fallback to download). This is the viral artifact (child-made book) feeding the GTM loop.

---

### Files to create / edit (exact repo-relative paths)

**Create:**
- `PPPPtherapy-/PPPPtherapy-/app/src/lib/heroComics.ts` — shared `ADVENTURES` (moved from `HeroComicsTab`), `HeroComic`/`ComicPage` types, the build-a-book orchestration (sequential `api.generateComic` per page through the in-flight dedupe map), and a durable cache key helper `comicKey(avatarHash, adventureId, lang)`.
- `PPPPtherapy-/PPPPtherapy-/app/src/components/stories/ComicReader.tsx` — the page-turn reader (cover, pages, completion, Save/Share, keyboard/swipe/back handling, RTL).
- `PPPPtherapy-/PPPPtherapy-/app/src/components/stories/ComicReader.test.tsx` — page-turn order, RTL inversion, per-page error isolation, save/share event firing (mocked).

**Edit:**
- `PPPPtherapy-/PPPPtherapy-/app/src/components/tabs/HeroComicsTab.tsx` — becomes the catalog host: no-hero gate + picker + Bookshelf (via `useChildCollection<HeroComic>(childProfile.id, "heroComics")`) + mounts `ComicReader` for the active book. Remove inline single-panel logic; import `ADVENTURES` from `lib/heroComics.ts`.
- `PPPPtherapy-/PPPPtherapy-/app/src/components/stories/HeroScenePlayer.tsx` — swap its inline framed panel (`HeroScenePlayer.tsx:138-166`) to consume the new `ComicPage` playkit primitive; keep its per-session cache but promote the key format to match `comicKey` so Story-Journey panels and Reader pages share cache hits.
- `PPPPtherapy-/PPPPtherapy-/app/src/components/ui/playkit.tsx` — add `ComicPage` primitive (framed, page-flip, reduced-motion fade, page-number badge, loading + per-page-error states). **Append only** (see conflict notes).
- `PPPPtherapy-/PPPPtherapy-/app/src/lib/api.ts` — extend `generateComic` payload with optional `pageIndex?: number` and `cover?: boolean` (additive only; backend already accepts the existing fields). **Append to the type, do not reorder** (see conflict notes).
- Grow entry affordance: add a one-line deep-link button in the Practice/Daily-Play surface (`DailyPlayTab.tsx` or `practice/SpeechCoachTab.tsx` completion) → `setActiveTab("comics")`. (Place in whichever is least contended; coordinate with `b4`/`c2` — keep it a 5-line additive block.)

---

### Shared-file conflict notes

Per the conflict hotspot list:
- **`app/src/components/ui/playkit.tsx`** — touched by `p1-comic-reader, p3-ios-grade-audit, p2-7-phonics-tracing, p2-11-mimic-mediapipe, m2-token-extraction, m7-playkit-completeness`. Hotspot rule: **m2 (token extraction) + m7 (completeness) settle the API first; feature missions then consume stable primitives.** → Add `ComicPage` by **appending a new exported function** at the end of the file; do not refactor existing primitives or touch `TONE_INK`/`TONE_SOFT`. If m2/m7 land first, rebase `ComicPage` onto their tokenized helpers. p3 polish runs after.
- **`app/src/lib/api.ts`** — touched by `p1-comic-reader, p4-operational-hardening, c3-ask-specialist`. `p4` depends-on lands first (it hardens `post`/retry/telemetry which the reader's N sequential calls rely on). Make my change **purely additive** to the `generateComic` payload object literal — append `pageIndex?`/`cover?` to the type; do not touch the shared `post`/`get` helpers c3 and p4 modify.
- **`app/src/components/tabs/HeroComicsTab.tsx`** — touched by `p1-comic-reader, p2-hero-everywhere`. `p2-hero-everywhere` injects the `HeroAvatar` widget broadly. I own the file's structural rewrite; coordinate so p2's avatar insertion targets the *reader's cover* (I expose the cover's `HeroAvatar` mount). Land p1 first (structural), then p2 places the avatar.
- **`app/src/components/tabs/HeroJourneyTab.tsx`** — touched by `p1-comic-reader, m3-hex-sweep, surf-academy`. I only touch it transitively via `HeroScenePlayer`. m3 sweeps hex literals (e.g. `PACK_COLORS` `HeroJourneyTab.tsx:45-58`) — I add **no** new hex; everything via `var(--arbor-*)` tokens, so no collision.
- **`app/src/components/stories/HeroScenePlayer.tsx`** — listed in this item's `sharedFiles`; not in the cross-item hotspot map, so I am the sole editor. Safe to refactor its panel onto `ComicPage`.
- **`LanguageContext.tsx`** — I **read** `dir`/`aiLang` only; I add **no** keys here (b5/ia-b6/surf-ask own appends). RTL strings live in `lib/heroComics.ts`.
- **`loopEvents.ts`** — I **call** existing `trackShareInitiated/Completed` only; **no** new event names (mk-p0-4 owns the contract).

---

### Dependencies (other item ids that must land first)
- **`p4-operational-hardening`** (declared `dependsOn`) — the reader fires N sequential `generateComic` calls; it relies on p4's retry/backoff/timeout + token-usage telemetry around the AI path so page generation degrades gracefully (per-page error tiles) instead of hanging. Land p4 first.
- Soft-ordering (not hard blockers): `m2-token-extraction` / `m7-playkit-completeness` should ideally settle `playkit.tsx` before `ComicPage` lands; if not, append and rebase.

---

### Acceptance criteria (testable)
1. **Multi-page book:** picking an adventure generates a book of ≥4 pages (cover + ≥3 beats); the cover renders immediately and beat pages stream in. Verified live on dev server (`npm run dev`, navigate `#comics`, with a saved hero avatar).
2. **Page-turn:** swipe, tap-zones, on-screen buttons, and ArrowLeft/Right all change pages with the flip animation; reduced-motion swaps flip → fade (verified by toggling OS reduced-motion / `prefers-reduced-motion`).
3. **RTL:** with `aiLang==="he"`, page order and flip direction invert; Hebrew adventure titles render. Verified live.
4. **Durable cache:** generate a book, reload the page, re-open from Bookshelf → opens instantly from cache with **zero** new `/api/generate-comic` network calls (verify in Network panel). Books persist via `useChildCollection("heroComics")` (Firestore when signed in, localStorage in sandbox).
5. **Per-page error isolation:** forcing one page's `generateComic` to reject shows the "smudged / Redraw page" tile on that page only; other pages remain readable; Redraw refetches just that page. Covered by `ComicReader.test.tsx`.
6. **Save & Share:** Save writes a PNG; Share invokes Web Share (or download fallback) with the cover image and fires `share_initiated`→`share_completed` (`artifact:"story"`) — asserted in test with mocked `track`.
7. **Android back:** hardware Back turns a page back, and closes the reader at the cover (does not exit app). Verified on Android Capacitor build (or documented manual check).
8. **A11y:** keyboard-only user can read the whole book and Save/Share; each panel has a meaningful `alt`; page changes announce via `aria-live`. `npm run build` + `tsc` clean; existing test suite stays green.
9. **No regression:** Story Journeys (`HeroJourneyTab`) still render comic panels correctly via the shared `ComicPage` primitive.

---

### Operating-rule checks
- **No dark patterns:** Save/Share are opt-in, plainly labeled; "Make another" never auto-charges or auto-shares; no fake scarcity. Share is a genuine child-made artifact, not a growth nag.
- **Privacy / COPPA-2026:** hero is always the saved **stylized avatar** (data-URL), never a face photo — enforced exactly as `HeroJourneyTab.tsx:70` (`photoUrl?.startsWith("data:")`) and `HeroComicsTab.tsx:41`. Generated images are provenance-watermarked (safety strip copy retained). No child PII leaves the device beyond the avatar data-URL the backend already receives.
- **Moat read/write:** **reads** the child's saved `avatar`/`name` and adventure history; **writes** each finished book to the child-scoped `heroComics` collection (longitudinal artifact) — the bookshelf grows over time, feeding the memory moat and the "tracking since" narrative.
- **Ships-visible:** the comics tab visibly changes from a one-shot panel to a real, re-openable comic book with a bookshelf — demonstrable end-to-end on the dev server with a single hero avatar set up.
