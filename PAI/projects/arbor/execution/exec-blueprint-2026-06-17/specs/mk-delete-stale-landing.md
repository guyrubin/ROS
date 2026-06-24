## mk-delete-stale-landing — Delete stale no-suffix landing duplicate
**Aspects:** Marketing · **Surfaces/platforms:** landing:he · **Priority:** P0

### Problem / why
`PAI/projects/arbor/html/arbor-marketing-landing-page.html` (no language suffix) is a **stale duplicate of the Hebrew landing page**. Confirmed on disk:

- Both files are ~129.5KB and structurally identical (same RTL design system, same sections). They differ in **exactly two content blocks** — the hero and the closing CTA band — where the no-suffix file carries **older, abandoned hero copy**.
- `md5` no-suffix = `ee23050f4c6813deabf711b9ff8cfc96`; `-he` = `9961dfdfdce260387517accd81fc1790`.
- The stale hero copy in the no-suffix file (line ~1009): `"לגדל ילד עם יותר ביטחון, פחות ניחושים."` / CTA `"להתחיל לבנות את Arbor של הילד"`.
- The **current** approved HE hero (in `-he`, the keeper): `"לדעת מה קורה עם הילד שלכם — ומה לעשות הערב."` / CTA `"להתחיל עכשיו — חינם"` (the "2am calm-read" positioning).

Risk if left in place: a maintainer or a parallel mission (`mk-landing-parity-rebuild`, `mk-p0-1-domain`, `mk-p0-5-attribution-utm`, `mk-p1-4-aeo-seo-he`) opens/edits/serves the no-suffix file by mistake, shipping abandoned copy to production or splitting edits across two near-identical files. This is the "conflict seed" the parity rebuild must not trip over. The file is **git-tracked and committed** (clean working tree), so deletion is a real, reviewable change — not just an untracked-file cleanup.

This is **Marketing reconciliation #2**: collapse to one canonical HE file (`-he`) so there is a single source of truth per language surface, mirroring the canonical-EN intent of `mk-landing-parity-rebuild`.

### Scope across platform domains
- **Landing HE (RTL):** the only surface affected. The canonical HE page is `arbor-marketing-landing-page-he.html` (newer copy) — it stays. The stale no-suffix sibling is deleted. No content/markup change to the keeper file in this item.
- **Web app / iOS / Android / Landing EN:** not touched. (EN canonical work lives in `mk-landing-parity-rebuild`.)

### Marketing detail (build-level)
No copy is authored or rewritten here — this is a **delete + reference hygiene** item. Concrete actions:

1. **Delete the stale file** `PAI/projects/arbor/html/arbor-marketing-landing-page.html` using `git rm` (so the deletion is staged for the tracked file, not just an unlink).
2. **Verify no live link/canonical/hreflang points at the deleted filename.** Confirmed during grounding:
   - `arbor-marketing-landing-page-en.html` and `-he.html` contain **no** `href`/`canonical`/`hreflang` reference to the no-suffix filename (grep returned nothing).
   - The only repo references to `arbor-marketing-landing-page.html` are **prose mentions in docs**, not links:
     - `PAI/projects/arbor/PRODUCT.md:25` — describes "the older `arbor-marketing-landing-page.html` lane" as generic/drifting.
     - `PAI/projects/arbor/execution/arbor-surface-coordination-2026-05-24.md:31,70,77` — flags it as non-canonical and explicitly lists "delete it" as an option.
3. **Update the two doc references so they don't dangle:**
   - In `PRODUCT.md:25`, change the parenthetical to note the lane was **retired/deleted** (e.g. `(the older landing lane, now deleted)`), removing the live filename so future greps don't resurrect it.
   - In `arbor-surface-coordination-2026-05-24.md`, append a one-line resolution note under the existing item ("Resolved 2026-06-17: deleted; HE canonical is `arbor-marketing-landing-page-he.html`."). Do not rewrite the historical record — just mark it closed.
4. **Confirm the keeper is intact:** after deletion, `arbor-marketing-landing-page-he.html` must still open, render RTL, and show the current "2am calm-read" hero (`md5 9961dfdfdce260387517accd81fc1790`).

No instrumentation, loop, or asset changes — this item removes a liability, it does not add a surface.

### Files to create / edit (exact repo-relative paths)
- **Delete:** `PAI/projects/arbor/html/arbor-marketing-landing-page.html`
- **Edit:** `PAI/projects/arbor/PRODUCT.md` (line ~25 — drop the live filename, mark lane deleted)
- **Edit:** `PAI/projects/arbor/execution/arbor-surface-coordination-2026-05-24.md` (append resolution note to the existing non-canonical-file item)
- **Keep untouched:** `PAI/projects/arbor/html/arbor-marketing-landing-page-he.html` (canonical HE), `arbor-marketing-landing-page-en.html` (canonical EN), `arbor-landing.html` (separate earlier marketing concept — out of scope, do **not** delete).

### Shared-file conflict notes
- The item's declared `sharedFiles` is the no-suffix file itself, which **no other mission in the conflict map touches** — its deletion is conflict-free by construction (that is the point: removing it eliminates a future accidental-edit hotspot).
- **Adjacent hotspot — `arbor-marketing-landing-page-he.html`** is touched by `p3-ios-grade-audit`, `mk-p0-1-domain`, `mk-p0-5-attribution-utm`, `mk-landing-parity-rebuild`, `mk-p1-4-aeo-seo-he`. This item **does not edit that file** — it only deletes the *sibling*. To avoid any race, **land this delete BEFORE `mk-landing-parity-rebuild`** so the rebuild operates against a single, unambiguous HE reference and cannot accidentally read the stale copy. No serialization needed with the others since they edit the keeper, not the duplicate.
- **PRODUCT.md** is not in the shared-file map; the one-line edit here is isolated. **arbor-surface-coordination-2026-05-24.md** is a historical log, append-only — no clobber risk.

### Dependencies (other item ids that must land first)
- None. This is a leaf delete with no upstream dependency.
- **Ordering recommendation (not a hard dep):** complete this *before* `mk-landing-parity-rebuild` and `mk-p1-4-aeo-seo-he` so they target the single canonical HE file.

### Acceptance criteria (testable)
1. `git status` shows `arbor-marketing-landing-page.html` **staged for deletion** (`D`), and `git ls-files` no longer lists it.
2. `arbor-marketing-landing-page-he.html` still exists with `md5 = 9961dfdfdce260387517accd81fc1790` and is unmodified by this change.
3. Repo-wide `grep -rn 'arbor-marketing-landing-page\.html'` returns **zero live `href`/`canonical`/`hreflang` matches**; remaining matches (if any) are prose that has been updated to say the file is deleted.
4. `PRODUCT.md` line ~25 no longer presents the no-suffix filename as a current lane.
5. `arbor-surface-coordination-2026-05-24.md` carries a dated resolution note closing the "review/delete" action item.
6. **Verified live on dev server:** opening the canonical HE page in a browser (e.g. `python -m http.server` in `html/`, or the project dev server, then load `arbor-marketing-landing-page-he.html`) renders RTL correctly and shows the hero `"לדעת מה קורה עם הילד שלכם — ומה לעשות הערב."` and CTA `"להתחיל עכשיו — חינם"`. The deleted URL `…/arbor-marketing-landing-page.html` returns **404**.

### Operating-rule checks
- **No dark patterns:** N/A (removing a file); net effect is *reducing* the risk of shipping stale/inconsistent claims — improves honesty of the funnel.
- **Privacy/COPPA:** N/A — static marketing HTML, no data handling changed.
- **Moat read/write:** N/A — landing page is acquisition surface, not a longitudinal-memory read/write path. No regression to the moat.
- **Ships-visible:** the user-visible outcome is that there is exactly **one** Hebrew landing page (the current-copy one); the abandoned-copy duplicate can no longer be served or accidentally edited. Verifiable in browser per AC#6.
