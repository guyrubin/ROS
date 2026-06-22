# Arbor CIL — Visual/UX findings (DOM-based, hang-resistant method) 2026-06-21

> Captured by the main session via computed-style inspection (preview_eval), because full-page screenshots time out at 30s on this app (it holds an open network request → render-complete never fires). **This is the method the IA/UX critics must use** until that network-request hang is fixed: DOM snapshot + computed styles, NOT screenshots. To be merged into IMPROVEMENT-BACKLOG.md and folded into the visual lens of the loop.

Evidence captured on the live sandbox app (Overview, viewport 1280×720, demo child "Dylan").

## Verified findings

| Score~ | ID | Lens | Title | Evidence | Owner | Effort | Risk |
|:-:|:--|:--|:--|:--|:--|:-:|:--|
| 40 | VIS-1-no-type-scale | ux | **No enforced type scale** — 18 distinct font-sizes on ONE view | Computed sizes include non-scale fractional values: 10.5/11.5/13.8/15.2/21.6/25.6/29.6/37.6px alongside 10/11/12/13/14/15/16/18/20/24px. A polished product uses a deliberate ~6–8-step scale. Root cause = ad-hoc `text-[..rem]` utilities + a non-16px root, app-wide. This is the single biggest "looks like a beta" tell. | arbor-design | 3 | safe |
| 28 | VIS-2-touch-targets-sub44 | ux | **21 interactive elements <44px** touch target (desktop; worse on mobile) | e.g. 28×28px icon button (also unlabeled), 25px EN/עב language switcher, 20px "How to play", 36px "Today"/profile chip, 38px Search. WCAG 2.5.5 (AA) + Apple HIG want ≥44px. Memory says this was "partially fixed 2026-06-14" — many remain. | arbor-design | 2 | safe |
| 16 | VIS-3-unlabeled-icon-btn | ux/a11y | Unlabeled 28×28 icon button (empty accessible name) | Snapshot/DOM: a `<button>` with no text and no aria-label in the Overview header cluster. Screen-reader users get "button". | arbor-design | 1 | safe |

## Themes
- **T-VIS — "Design-system discipline not enforced."** The tokens/fonts exist (good — Fraunces+Nunito, green token system from the 2026-06-13 redesign) but sizing + touch-targets are applied ad-hoc per component rather than from an enforced scale. One root-cause fix (define a 7-step type scale + a min-44 touch-target rule in the kit primitives) clears VIS-1+VIS-2+VIS-3 and a long tail of nits. This is the cheapest, highest-leverage "stop looking like a beta" move.

## Method note for the loop (IMPORTANT — fixes the hang)
The arbor-deep-eval workflow stalled 2026-06-21 because arbor-critic-ia/ux retried full-page screenshots that time out at 30s. **Fix:** instruct those critics to (1) start preview, (2) read `preview_snapshot` (a11y tree) + `preview_eval` computed styles + `preview_console_logs` — NEVER block on `preview_screenshot` for this app; Overview is the only reliably-screenshottable view. Bake this into the critics' prompts before re-enabling the visual lens in the automated loop.
