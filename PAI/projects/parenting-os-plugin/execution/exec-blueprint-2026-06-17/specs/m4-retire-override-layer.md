## m4-retire-override-layer — Retire the dead dark-theme override layer
**Aspects:** UI/UX · **Surfaces/platforms:** app:shell · **Priority:** Phase2

### Problem / why
`app/src/index.css` is a single 489-line file that is the **#1 merge-conflict magnet** in the repo (touched by `p3-ios-grade-audit`, `m1-ios-safe-area`, `m2-token-extraction`, `m4`). Roughly 200 of those lines (≈ lines 153–247, 334–340) are an **"override layer"**: `.arbor-app [class*="..."]` selectors that catch leftover **dark-theme Tailwind classes** (e.g. `bg-[#141821]`, `text-[#a8a093]`, `bg-amber-500`, `text-gray-400`, the pastel `bg-purple-500/`/`text-pink-` family, status `text-green-400`/`text-red-`) and remap them onto the light "Soft Daylight" tokens with `!important`.

This remapping only existed to rescue legacy views authored in the retired dark palette. A grep across `app/src` confirms the remapped classes now appear in **only two TSX files**:

- `app/src/App.tsx` — three loading/error spinners use `text-[#a8a093]` + `text-[#d7aa55]` (App.tsx:25–27, 66–68), plus a `var(--arbor-bg)` token that **does not exist** in `:root` (App.tsx:37 — latent bug; the canvas token is `--arbor-paper`).
- `app/src/context/ToastContext.tsx` — toast cards use `bg-[#141821]`, `text-white`, `text-[#a8a093]`, and `border-emerald-500/40` / `text-emerald-400` / `border-blue-500/40` / `text-blue-400` / `text-[#e2562d]` (ToastContext.tsx:15–17, 45, 49).

Migrate these two files to the existing token system, then delete the dead remap rules. This shrinks the conflict-magnet file ~40% and removes the last consumers of the dark palette so future missions edit a smaller, single-meaning stylesheet.

> **Critical scoping caveat (verified by grep):** Not every `[class*=...]` rule in index.css is dead.
> - **DEAD → delete:** dark hex bg remaps (lines 153–160, 261–266), text-color remaps (162–178), amber/clay→green remaps (180–195), pastel-accent remaps (197–226), white-overlay border remaps (228–241), and status-color remaps (334–340). Confirmed: the only files referencing these classes are index.css itself + the two TSX files being migrated.
> - **KEEP → do NOT touch:** the radius remaps (147–151) and **shadow remaps (244–247)** serve `rounded-*`/`shadow-*` Tailwind utilities still used live across 15+ components (68 occurrences). The `aside` sidebar block (252–266 chrome), `nav button` pills (269–281), `button[class*="bg-white/5"]` (295–300), and form-control block (302–322) are structural and bound to live DOM (Sidebar/AiRail/MobileNav/inputs). Leave them. Only the dark-theme **color/bg/border** catch-alls go.

### Scope across platform domains
- **Web (app:shell):** the only surface. Edits to App.tsx (auth/profile gates + config-error screen), ToastContext.tsx (global toast portal), and index.css (delete dead remaps). All three render inside `.arbor-app` and are shared by web + both native shells.
- **iOS (Capacitor) / Android (Capacitor):** no native-specific code, but both load the same `index.css` + App shell via the Vite bundle. Net effect is identical rendering with fewer bytes. No `capacitor.config.ts` or `lib/native.ts` change.
- **Landing EN / Landing HE:** out of scope (separate static html, not this stylesheet).

### IA / UX / Copy / Marketing detail (UI/UX)
Pure UI/UX refactor — **zero visible pixel change is the success bar.** Every migrated element must render byte-for-byte the same as today (the override layer was already painting these light). Concrete per-file work:

**A. `App.tsx` — migrate 2 spinners + 1 error screen to tokens**
- Both loading gates (AuthGate, ProfileGate) currently: `className="arbor-app min-h-screen flex items-center justify-center text-[#a8a093]"` with `<RefreshCw className="w-5 h-5 animate-spin text-[#d7aa55]" />`.
  - Replace `text-[#a8a093]` → inline `style={{ color: "var(--arbor-muted)" }}` (the override mapped `#a8a093`→`--arbor-muted`; keep identical result).
  - Replace `text-[#d7aa55]` on the icon → `style={{ color: "var(--arbor-clay)" }}` (override mapped amber→`--arbor-clay` brand green; keep identical).
- `ProductionAuthConfigError` (line 37): fix the **broken token** `var(--arbor-bg)` → `var(--arbor-paper)` (the defined canvas token). This is currently a no-op/transparent fallback; `--arbor-paper` is the correct app-canvas value (`#eef2ef`).
- **States:** loading (spinner, `animate-spin` honored by reduced-motion guard at index.css:401), error (config screen). No empty/default change. Keep `role` semantics as-is.
- **a11y:** add `role="status"` + `aria-label="Loading"` to each loading `<div>` (currently a bare spinner with no SR text — small free win while touching the lines). Spinner color contrast unchanged. Keyboard: no interactive elements added.

**B. `ToastContext.tsx` — migrate toast card to tokens (this is what unlocks the pastel/status deletions)**
- Card wrapper (line 45) currently: `bg-[#141821] border ${ring} ... shadow-2xl ... text-white`.
  - `bg-[#141821]` → inline `style={{ background: "var(--arbor-paper-elevated)" }}` (override mapped this dark hex → elevated white). Keep `shadow-2xl` class (still live, mapped to `--shadow-lg`). Keep `rounded-2xl`.
  - `text-white` → keep as `text-white` is **intentionally not remapped** (index.css:163–165) — BUT the card bg is now light, so white body text would be invisible. Change to `style={{ color: "var(--arbor-ink)" }}` for the wrapper and `flex-1` span.
- Per-type `ring` + `icon` (STYLES, lines 14–18) — replace Tailwind color utilities with token-driven inline styles so the rules at index.css:335–340 (green/red) and 207–223 (blue/purple/pink) can be deleted:
  - `success`: `ring` → `border` color `var(--arbor-clay)` at ~40% (use `rgba(52,178,119,0.40)` or `color-mix`); icon color `var(--arbor-clay-deep)`.
  - `error`: keep brand danger — `border` `rgba(214,86,111,0.40)`; icon color `var(--arbor-danger)`. (Replaces both `border-[#e2562d]/40` and `text-[#e2562d]`.)
  - `info`: `border` `rgba(63,140,201,0.40)` (`--arbor-sky` @40%); icon color `var(--arbor-sky)`.
  - Refactor `ring: string` field → `border: string` (CSS color) and apply via `style={{ borderColor: ... }}`; keep the literal `border` class for width. Dismiss button `text-[#a8a093] hover:text-white` → token: base `var(--arbor-muted)`, hover `var(--arbor-ink)` (use a tiny `onMouseEnter`/`onMouseLeave` or a scoped `.arbor-toast-dismiss` class added near the keep-list, since Tailwind hover on inline style isn't possible — preferred: add one 3-line CSS rule `.arbor-app .arbor-toast-dismiss { color: var(--arbor-muted); } .arbor-app .arbor-toast-dismiss:hover { color: var(--arbor-ink); }` and give the button that class).
- **States:** toast already has enter/exit motion via `motion/react` (initial/animate/exit x-slide). Keep. The portal has `role="status" aria-live="polite"` (line 37) — keep. Auto-dismiss 4s (line 29) — keep.
- **Motion / reduced-motion:** the `motion.div` spring is JS-driven (Framer/motion), not covered by the CSS `prefers-reduced-motion` guard. Out of scope for M4 (belongs to `m5-touch-error-states` / `p3`); do not add here to avoid scope creep, but leave a `// TODO(m5): gate toast motion on prefers-reduced-motion` comment.
- **Touch targets:** dismiss button is `w-3.5 h-3.5` icon — already small; do NOT resize here (that is m5/p3 territory). Refactor color only.
- **RTL:** toast portal is `top-4 right-4`. Under `dir="rtl"` this stays top-right (acceptable; no change in scope — `surf-app-shell`/m1 own positioning). Leave.

**C. `index.css` — delete the dead remap blocks (~200 lines)**
Delete exactly these rule groups (verified dead after A+B land):
- 153–160 — dark hex card-bg remaps.
- 162–178 — gray/`#f7f1e7`/`#a8a093` text-color remaps.
- 180–195 — amber/clay/yellow → green text + bg remaps.
- 197–226 — pastel-accent remaps (amber-soft, blue/sky, purple/violet/indigo, pink/rose, orange).
- 228–241 — `border-white/*` + `border-[#d7aa55]` remaps.
- 261–266 — `aside [class*="bg-[#...]"]` dark-card-in-sidebar remaps.
- 334–340 — status-colour remaps (green/red text+bg).
- 365 — `.bg-[#d7aa55][style*="width"]` progress-bar remap (dead; no consumers).
- Also update the **doc comment block (lines 4–13)** to drop the "(1) older views in dark Tailwind classes that the override layer below remaps" clause, since that path no longer exists. New comment: token-first system only.

**Keep** (do not delete): radius (147–151), shadows (244–247), `aside` chrome bg/border (252–259), nav pills (269–281), button hover (283–300), form controls (302–322), all `.arbor-*` semantic + display + play-layer + a11y + reduced-motion rules.

### Files to create / edit (exact repo-relative paths)
- **Edit** `PPPPtherapy-/PPPPtherapy-/app/src/App.tsx` — migrate 2 spinners to tokens; fix `--arbor-bg`→`--arbor-paper`; add `role="status"`/`aria-label` to loaders.
- **Edit** `PPPPtherapy-/PPPPtherapy-/app/src/context/ToastContext.tsx` — migrate card bg/text + STYLES border/icon to tokens; add `.arbor-toast-dismiss` class usage.
- **Edit** `PPPPtherapy-/PPPPtherapy-/app/src/index.css` — delete ~200 lines of dead dark-theme color/bg/border remaps; add 3-line `.arbor-toast-dismiss` hover rule near the keep-list; refresh the lead doc comment.
- No new files.

### Shared-file conflict notes
All three files are on the shared-file map; `index.css` is the named **#1 conflict hotspot**.
- **`index.css` hotspot** (items: `p3-ios-grade-audit`, `m1-ios-safe-area`, `m2-token-extraction`, `m4`): hotspot ordering is explicit — **"m4 (delete override layer ~200 lines) THEN m2 (token extraction) THEN m1 (safe-area additions); p3 polish last. Never parallelize."** → **M4 must run FIRST among the four and land before any other index.css mission starts.** Delete by rule-group (above), not by line range, so a stale line offset can't silently clobber a kept block. After M4, communicate the new line map to m2/m1.
- **`App.tsx`** — not on the multi-touch hotspot list; low contention. Edits are localized to 3 className strings + 1 token fix. Safe in parallel with non-App work.
- **`ToastContext.tsx`** — not a listed hotspot; sole edit here. `m5-touch-error-states` may later add error-toast affordances — leave the `// TODO(m5)` marker and keep the STYLES shape extensible (typed `border`/`icon` record) so m5 appends without refactor.

### Dependencies (other item ids that must land first)
- **None.** `dependsOn: []`. M4 is the gating *first* edit of `index.css`; `m2-token-extraction` and `m1-ios-safe-area` depend on M4 landing first (reverse dependency), not the other way around.

### Acceptance criteria (testable, including "verified live on dev server")
1. `grep -rE "text-\[#a8a093\]|text-\[#d7aa55\]|bg-\[#141821\]|border-emerald-500|text-emerald-400|--arbor-bg" app/src` returns **zero** matches outside index.css's own (now-deleted) context — i.e. no TSX consumer remains.
2. `app/src/index.css` is **≤ ~290 lines** (down from 489; ~200 deleted), and contains none of the deleted rule groups; the kept blocks (radius, shadows, aside, nav, buttons, forms, semantic, play, a11y) are intact.
3. `npm run build` (tsc + vite) passes with no new type errors; `npm test` (`vitest run --config scripts/vitest.config.mjs`) stays green.
4. **Verified live on dev server** (`npm run dev`, https://arborprd-westeu.web.app local equivalent / localhost): (a) trigger a toast of each type (success/error/info) — card renders on light elevated surface, ink-colored text, correct border tint, dismiss button hover darkens; (b) force the loading gate — spinner shows muted text + green icon, identical to before; (c) force `firebaseClientMisconfigured` — config-error screen now shows the `#eef2ef` canvas (was transparent). Capture before/after screenshots; pixels must match for the toast + loaders.
5. Reduced-motion: with `prefers-reduced-motion: reduce`, the loader spinner animation is suppressed (existing guard) — unchanged behavior verified.
6. No regression in Sidebar/AiRail/MobileNav/forms (the kept structural blocks) — visual spot-check of nav pills, an input focus ring, and a card shadow.

### Operating-rule checks
- **No dark patterns:** none introduced — toasts auto-dismiss and have an explicit dismiss control; no deceptive UI. Pure refactor.
- **Privacy / COPPA-2026:** no data, telemetry, network, or child-facing surface touched. Toast text is caller-supplied and unchanged.
- **Moat read/write:** N/A — this item touches no longitudinal-memory read/write path; it is presentation-only and does not alter any moat instrumentation.
- **Ships-visible:** the win is invisible-by-design (no pixel change) but ships real value — a ~40% smaller conflict-magnet stylesheet and removal of the last dark-palette consumers, unblocking m2/m1/p3. The one user-visible fix is the previously-broken `--arbor-bg` config-error background now rendering correctly.
