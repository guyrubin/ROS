## p2-hero-everywhere — Hero everywhere (cross-domain avatar)
**Aspects:** IA, UI/UX, Copy · **Surfaces/platforms:** cross:hero, web:Today, web:MyChild, web:Grow, web:Care, web:Academy, child:PlayKit, ios, android · **Priority:** Phase1

> EB Phase-1 #2 == PRD 8.2 A6. This mission OWNS the `cross:hero` surface (there is no separate surface item for it) and subsumes UI/UX map item M6. The goal is a single child identity rendered everywhere: the same generated hero appears on Today, in My Child (Development picture + Milestones + Profile), in Grow (Practice/Daily Play/Plans), in Care (Consult/Reports export), in Academy (Hero Comics/Stories), and in the child-facing PlayKit register — never a generic Sprout placeholder where a hero already exists.

### Problem / why
The hero identity primitive **already exists and is partially wired**:
- `app/src/components/ui/HeroAvatar.tsx` — `HeroAvatar` component + `useHeroAvatar()` hook. Reads the active child from `ArborContext`, surfaces `childProfile.photoUrl` inside a comic gradient ring + star badge, and **falls back to `<ArborMascot>` (Sprout) when no avatar exists**. Exposes `{ url, isGenerated, hasHero, name }`.
- `app/src/components/ui/ArborMascot.tsx` — "Sprout" SVG mascot (the fallback, the moods engine).

It is consumed in only **three** places today (verified via grep):
- `app/src/components/tabs/OverviewTab.tsx:280` (Today — Practice launcher).
- `app/src/components/ui/playkit.tsx:77` (`PlayHeader`) and `:253` (`Celebrate`) — child register.
- `app/src/components/tabs/HeroComicsTab.tsx:26` (Academy — via the `useHeroAvatar` hook for `heroUrl`/`hasHero`).

Everywhere else the child is represented by **no portrait at all** or a generic avatar:
- **My Child › Development** (`DevScoreCard.tsx`) has a score ring and first-name copy but **no hero portrait** — the "Development picture" header is impersonal.
- **My Child › Milestones / Profile** — no hero portrait in the header.
- **Care › Reports PDF export** (`reportExport.ts` `openPrintableReport`) — the clinical/teacher/therapist PDFs render a generic `A` brand dot, **never the child's hero**, so a handoff packet doesn't visually anchor to the child.
- **Grow** (Practice/Daily Play live under PlayKit so they inherit `PlayHeader`'s hero, but **Growth Plans** parent-register surface has no hero).
- **Sidebar profile card** uses `ProfileSwitcher` (generic `Avatar`), and **CoachTab.tsx:376** still renders a raw `<ArborMascot size={30}>` instead of the hero where a hero is available.

Result: the platform's headline promise ("your child is the hero, the same character everywhere") is true on ~3 surfaces and broken on the rest. This mission swaps the Sprout-fallback → hero across Today, Practice celebrations, Milestones portraits, the Development header, Profile, and the Care export, so the hero is genuinely **everywhere** and reads/writes the one identity in the moat.

### Scope across platform domains
- **Web** — primary. Add `<HeroAvatar>` to the Development header (DevScoreCard), Milestones header, Child Profile header, Growth Plans header, and embed the hero image into the Care Reports PDF. Reconcile `useHeroAvatar` to read a future `comicAvatarUrl` cleanly. No nav/IA changes to `navigation.ts` are required (this mission does not add/remove leaves), so it stays OFF the navigation.ts conflict triad.
- **iOS (Capacitor)** — no native code change. The hero image is loaded from `photoUrl` (remote https or `data:` URL). Verify the gradient-ring `conic-gradient` and `box-shadow` render on iOS WKWebView and that the `<img referrerPolicy="no-referrer">` loads behind the native fetch shim. No new permissions.
- **Android (Capacitor)** — same as iOS; verify conic-gradient ring + star badge render in the Android WebView and the report-export print path works (Android print → "Save as PDF").
- **Landing EN / Landing HE** — out of scope (marketing landing hero art is a separate marketing asset, not this child-identity primitive).

### IA / UX / Copy detail (build-level)

#### 1. Single source of truth — harden `useHeroAvatar()` (cross:hero)
File: `app/src/components/ui/HeroAvatar.tsx`.
- Keep the hook as the ONE accessor. Today it reads `childProfile.photoUrl`. Per the avatar PRD, the *generated comic hero* may live separately from an uploaded photo. **Do not break the current contract.** Add a resolution order without changing the return shape:
  ```ts
  // resolution: prefer the generated stylized hero, then any uploaded photo.
  const url = (childProfile as any).comicAvatarUrl || childProfile.photoUrl || null;
  const isGenerated = childProfile.avatar?.source === "descriptor"; // stylized, not a real photo
  ```
  `childProfile.avatar.source` is typed `'descriptor' | 'photo'` (`types.ts:17`). `'descriptor'` = AI-generated stylized hero (privacy-safe); `'photo'` = a real uploaded photo.
- Add an optional `decorative?: boolean` prop. When `true`, render the `<img>` with `alt=""` + `aria-hidden` (used where the name is already adjacent, e.g. the Development header, to avoid double-announcing).
- Add a `title?` prop is NOT needed; keep API minimal.

#### 2. My Child › Development header (web:MyChild) — `DevScoreCard.tsx`
Add the hero portrait to the left of the score block so the "Development picture" is personal.
- Render `<HeroAvatar size={56} mood="proud" ring decorative animate={false} />` in the card header row, before the first-name title. `mood="proud"` is the celebratory closed-eye grin (correct for a progress surface).
- States: HeroAvatar self-handles default (hero) / fallback (Sprout when `!hasHero`). No loading state needed — `childProfile` is already resolved when this card renders. No empty/error state beyond the existing Sprout fallback.
- a11y: pass `decorative` (the firstName + "Development" heading already names the child). Touch target N/A (non-interactive). Honors `prefers-reduced-motion` via `animate={false}` and the existing `.sprout-bob` reduced-motion guard in `index.css`.

#### 3. My Child › Milestones header (web:MyChild) — `MilestonesTab.tsx`
- Add `<HeroAvatar size={48} mood="cheer" ring />` next to the `ProgressRing` / percent header. Copy stays as-is. `mood="cheer"` matches the celebratory milestone register.
- When a milestone is checked, the existing `confetti()` (line 15-22) fires — no change; the hero is the static anchor.

#### 4. My Child › Profile header — `ChildProfile.tsx` (sections)
- Add `<HeroAvatar size={72} mood="wave" ring />` to the profile header. Adjacent to it, when `!useHeroAvatar().hasHero`, render the **create-hero affordance** (mirror the HeroComicsTab pattern): a `PlayButton`/link → `setActiveTab("profile")`'s AvatarCreator section, copy: **"Create {name}'s hero"** sub-line **"One character, everywhere in Arbor."**

#### 5. Grow › Growth Plans header (web:Grow) — `PlansTab`/plans surface
- Add `<HeroAvatar size={56} mood="happy" ring />` to the Growth Plans page header so the plan reads as *this child's* plan. Practice and Daily Play already inherit the hero via `playkit.tsx PlayHeader` — no change there.

#### 6. Care › Reports PDF export (web:Care) — `reportExport.ts`
This is the load-bearing change: put the hero into the **printed clinical/handoff document**.
- Extend `ReportContext` with an optional hero image: `heroImageUrl?: string` (a `data:` URL or https). Extend `ReportDoc` with optional `heroImageUrl?: string`.
- In `buildReport()`, thread `ctx.heroImageUrl` (if present) into the returned `ReportDoc`. Do NOT add it to `sections` — keep it as a top-level doc field so the print template renders it in the brand lockup.
- In `openPrintableReport()`, in the `.brand` block (line 149), when `doc.heroImageUrl` is present render a small round hero next to the wordmark:
  ```html
  <img class="hero" src="${heroImageUrl}" alt="" />  <!-- decorative; child named in subtitle -->
  ```
  with print CSS: `.hero{width:34px;height:34px;border-radius:50%;object-fit:cover;border:2px solid #e4f4ec;}`. Keep the existing `A` dot as fallback when no hero. **Privacy gate:** only embed when `avatar.source === "descriptor"` (the stylized hero) — NEVER embed a real-photo (`source === "photo"`) into a document the parent may forward to a clinician, unless `photoUrl` is the explicit avatar. Default: embed only the stylized hero.
- Caller `Reports.tsx exportReport()` (line 25-35): pass `heroImageUrl` resolved via `useHeroAvatar()` only when `isGenerated` is true. The `useHeroAvatar` hook is a React hook → resolve `{ url, isGenerated }` at the top of the `Reports` component and pass into the closure (do not call the hook inside `exportReport`).
- Because the PDF needs a self-contained image, prefer a `data:` URL. If `url` is a remote https avatar, embedding the raw URL is acceptable for the print path (the browser fetches it before print); document this and leave a TODO for a future fetch→dataURL inline step. Do not block the mission on dataURL conversion.

#### 7. Sidebar / Coach raw-Sprout cleanup (cross:hero)
- `CoachTab.tsx:376` renders `<ArborMascot size={30} />`. Where this represents *the child* (vs. Arbor-the-guide), swap to `<HeroAvatar size={30} mood="happy" />`. **Caution:** Sprout is also legitimately "Arbor's guide" (e.g. coach speech bubbles). Audit the call site: if it's a coach/guide affordance, LEAVE it as `ArborMascot`. Only swap if it is portraying the child. (Read the surrounding JSX first; based on CoachTab it is the Arbor coach persona → likely LEAVE; record the decision in the PR.)
- `Sidebar.tsx` profile card uses `ProfileSwitcher` (generic `Avatar`). Out of scope to rewrite ProfileSwitcher, but **swap the child-profile card's generic Avatar → `<HeroAvatar size={34} ring />`** inside `ProfileSwitcher` IF it shows the child (not the parent account avatar at the bottom, which is correctly the parent's Google photo). Verify in ProfileSwitcher before editing.

#### Copy strings (UX copy)
- Create-hero CTA (Profile / any `!hasHero` surface): **"Create {name}'s hero"** / sub: **"One character — everywhere in Arbor."**
- Development header (no new copy; hero is decorative).
- Report brand lockup: unchanged wordmark "Arbor — Development Fieldbook"; hero is visual only.
- Reuse existing i18n keys where present (`ov.hero.title`/`ov.hero.desc` already exist for Today). Add new keys to `LanguageContext` ONLY if a string is shown in the app shell; for in-tab strings, append keys consistent with existing `t(...)` usage. RTL: HeroAvatar is symmetric (round); the star badge sits bottom-right — acceptable in RTL (it's a decorative badge, not directional). No mirroring needed.

#### Motion / a11y (applies to all placements)
- Default `animate` only on warm/welcome surfaces (Today, PlayKit, Profile). On dense data surfaces (Development, Milestones, Reports) pass `animate={false}`.
- All `.sprout-bob`/`.sprout-sparkle` animations already gate on `prefers-reduced-motion` in `index.css` — do not add new un-gated keyframes.
- Contrast: the star badge is white on `--arbor-clay`; verify ≥ 3:1 for the non-text graphic (AA). The hero `<img>` has a white backing (`background:#fff`) so a transparent-PNG hero never sits on a low-contrast field.
- Keyboard: HeroAvatar is non-interactive everywhere it's placed in this mission (the create-hero CTA is a real `<button>`/`PlayButton` and is already focusable).

### Files to create / edit (exact repo-relative paths)
Edit:
- `PPPPtherapy-/PPPPtherapy-/app/src/components/ui/HeroAvatar.tsx` — resolution order (`comicAvatarUrl` → `photoUrl`), `decorative` prop, `isGenerated` semantics.
- `PPPPtherapy-/PPPPtherapy-/app/src/components/sections/DevScoreCard.tsx` — hero in Development header.
- `PPPPtherapy-/PPPPtherapy-/app/src/components/tabs/MilestonesTab.tsx` — hero in Milestones header.
- `PPPPtherapy-/PPPPtherapy-/app/src/components/sections/ChildProfile.tsx` — hero + create-hero CTA in Profile header.
- `PPPPtherapy-/PPPPtherapy-/app/src/lib/reportExport.ts` — `heroImageUrl` on `ReportContext`/`ReportDoc`; render in `openPrintableReport` brand lockup (stylized-hero only).
- `PPPPtherapy-/PPPPtherapy-/app/src/components/sections/Reports.tsx` — resolve hero via `useHeroAvatar()` and pass `heroImageUrl` when `isGenerated`.
- (Conditional, after reading the call site) `PPPPtherapy-/PPPPtherapy-/app/src/components/profile/ProfileSwitcher.tsx` — child card → `HeroAvatar`.
- (Conditional, likely LEAVE) `PPPPtherapy-/PPPPtherapy-/app/src/components/tabs/CoachTab.tsx`.
- Plans surface header (`PPPPtherapy-/PPPPtherapy-/app/src/components/tabs/PlansTab.tsx` or the actual Growth Plans component under `grow`) — hero in header.

No files to create.

### Shared-file conflict notes
From the hotspot list:
- **`HeroAvatar.tsx`** — `touchedBy: ["p2-hero-everywhere"]` only. **This mission is the sole owner.** Safe to evolve the component API freely; downstream consumers (`OverviewTab`, `playkit`, `HeroComicsTab`) already use it and must keep compiling — keep the existing props/return shape additive (new props optional, return keys unchanged).
- **`reportExport.ts`** — shared with `c3-ask-specialist`, `p2-8-red-flag-monitoring`, `mk-p0-3-share-export`, `mk-p2-6-growth-card`. Hotspot rule: the **clinical PDF path (`buildReport` + `openPrintableReport`) is ONE exporter** shared by c3/b3/p2-8; the branded-image share renderer (mk-p0-3/mk-p2-6) is built *beside* it, not inside. **This mission only adds an optional `heroImageUrl` field + a brand-lockup `<img>` to the clinical path** — purely additive, no signature break for `buildReport(type, ctx)` (the new ctx field is optional). Coordinate: land BEFORE or merge cleanly with c3-ask-specialist (which restructures `buildReport` content); since both touch the same function, **sequence after c3 if c3 is in flight**, otherwise keep the diff to the brand lockup + the two type additions to minimize conflict surface.
- **`Reports.tsx`** — shared with `b3-care-consult`, `c3-ask-specialist`. Only add the `useHeroAvatar()` call + `heroImageUrl` arg to the existing `exportReport` closure; do not touch the Consult/Handoff reorg that b3/c3 own. Append-only edits to the component body.
- **`Sidebar.tsx`** — shared with `surf-app-shell`. This mission only conditionally edits `ProfileSwitcher` (a child of Sidebar), not Sidebar's nav/chrome that surf-app-shell owns. If `ProfileSwitcher` edit lands, keep it self-contained.
- **`HeroComicsTab.tsx`** — shared with `p1-comic-reader`. p1 owns the comic-reader build; this mission only depends on `useHeroAvatar` already consumed there (no edit to HeroComicsTab needed). Do not edit it.
- `DevScoreCard.tsx`/`MilestonesTab.tsx` are also touched by `c4-dev-score` / `p2-5-milestone-rebase`. Keep edits to a single header row insertion; coordinate so the score/milestone logic those missions own is untouched.

### Dependencies (other item ids that must land first)
- **`p4-operational-hardening`** (declared `dependsOn`) — hero loads behind the API/native fetch shim and analytics wiring; land p4 first so avatar fetch + telemetry are stable.
- Soft-sequence: if **`c3-ask-specialist`** is in flight, land its `buildReport` restructure before this mission's `reportExport.ts` additions (same function).

### Acceptance criteria (testable)
1. `useHeroAvatar()` resolves `comicAvatarUrl → photoUrl → null` and returns unchanged keys `{ url, isGenerated, hasHero, name }`; all three existing consumers still compile (`tsc` clean).
2. With a generated hero on the active child, the SAME hero image renders on: Today launcher, PlayKit `PlayHeader`+`Celebrate`, Development header, Milestones header, Profile header, Growth Plans header, and the Care Reports PDF — verified live on the dev server.
3. With NO hero, every one of those surfaces shows Sprout (the fallback) and any create-hero CTA routes to the AvatarCreator (`setActiveTab("profile")`) — verified live.
4. Exporting any Care report opens a printable doc whose brand lockup shows the child's **stylized** hero (when `source==="descriptor"`); a report for a child with only a real `photo` avatar shows the `A` dot, not the photo — verified live.
5. `prefers-reduced-motion: reduce` → no bobbing/sparkle on any hero placement; data surfaces (Development/Milestones/Reports) never animate.
6. iOS + Android Capacitor builds: hero ring + star badge render, `<img referrerPolicy="no-referrer">` loads, and print/export works — verified in the iOS simulator (or device) and Android emulator.
7. `npm run typecheck` + existing test suite green (the project's tsc + 241 tests baseline).

### Operating-rule checks
- **No dark patterns** — the create-hero CTA is opt-in, never blocks any surface (Sprout always keeps the surface usable); no fake urgency.
- **Privacy / COPPA-2026** — default and report-embedded hero is the **stylized `descriptor` avatar**, not a real child photo; real photos are never auto-embedded into shareable/clinical PDFs. Hero `<img>` uses `referrerPolicy="no-referrer"`. No new data collection.
- **Moat read/write** — the hero is read FROM the longitudinal child identity (`childProfile.avatar`/`photoUrl`) — the one canonical identity object — and is now reflected across every domain (Today, My Child, Grow, Care, Academy, PlayKit), reinforcing the single-source-of-truth memory moat. No new write needed; this mission is a consistent READ of the moat's identity field.
- **Ships-visible** — every change is a visible portrait on a real surface (no behind-the-scenes-only work); the headline "your child, the hero, everywhere" promise becomes literally true and demoable.
