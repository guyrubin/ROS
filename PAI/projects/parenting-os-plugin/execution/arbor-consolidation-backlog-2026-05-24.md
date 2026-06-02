# Arbor Consolidation Backlog - 2026-05-24

## Goal

Move Arbor from scattered prototype surfaces into one coherent product system:

- GitHub = canonical engineering implementation
- ROS = product strategy, governance, memory, and decision log
- Claude Design / standalone HTML = visual design reference
- AI Studio export = candidate implementation foundation
- Marketing HTML = positioning reference
- FORMATION = separate until found and explicitly reconciled

## Track 1 - GitHub Main Hygiene

| Priority | Task | Outcome |
|---|---|---|
| P0 | Verify GitHub `main` after PR #1, #2, #3 | Confirm README/docs/mockups/prototype are merged and accessible |
| P0 | Update README source-of-truth section | Make clear which files are product docs, prototypes, and design references |
| P1 | Add repo structure section | Explain `docs/`, `mockups/`, `prototype/`, and future `app/` |
| P1 | Add local run instructions for static prototype | Make `prototype/arbor-private-beta-app.html` easy to open and review |

## Track 2 - AI Studio App Import

| Priority | Task | Outcome |
|---|---|---|
| P0 | Decide whether `arbor.zip` becomes the app foundation | Avoid parallel app builds |
| P0 | If yes, import on new branch under `app/` | Keep static prototype and React app distinct |
| P0 | Remove diagnostic/clinical overclaiming copy | Product remains non-diagnostic parent support |
| P0 | Re-skin to Arbor standalone design system | Unified visual identity |
| P1 | Add structured AI response contract | Align code with developmental AI operating model |
| P1 | Add safety gate before parent-facing AI output | No unsafe reassurance or diagnosis claims |
| P1 | Add memory approval/retention/delete flow | Child data governance becomes real UI |
| P2 | Add eval harness | Test no-diagnosis, safety triage, age fit, practicality, memory hygiene, handoff quality |

## Track 3 - Design Consolidation

| Priority | Task | Outcome |
|---|---|---|
| P0 | Treat `Arbor-standalone.html` as visual reference | Prevent visual drift |
| P1 | Extract design tokens into documented system | Paper, ink, clay, blue, sage, rules, radii, typography |
| P1 | Apply tokens to GitHub prototype and future React app | One Arbor look |
| P2 | Create screenshot/design QA checklist | Prevent regressions across mobile/desktop |

## Track 4 - Product Governance

| Priority | Task | Outcome |
|---|---|---|
| P0 | Preserve private-beta scope | Intake -> routing -> triage -> plan -> memory -> log -> handoff |
| P0 | Keep no-diagnosis boundary visible | Trust and safety remain first-class |
| P1 | Map Six Frames to beta interactions | Framework becomes product behavior |
| P1 | Define expert review queue | High-risk outputs have human review path |
| P2 | Add Netherlands/Israel market decision | Resolve GTM sequencing |

## Track 5 - Loose Surface Cleanup

| Priority | Task | Outcome |
|---|---|---|
| P0 | Locate FORMATION / `pernenting platform/` | Decide archive, alternate brand, or rebrand candidate |
| P1 | Review local marketing landing page | Commit as marketing reference or archive |
| P1 | Decide what to do with downloaded standalone files | Keep as local reference; avoid committing bundled artifacts |
| P2 | Create a surface registry in README or ROS | Make future drift obvious |

## Current Engineering PR

**PR #4:** `Import hardened Arbor React app`

URL: `https://github.com/guyrubin/PPPPtherapy-/pull/4`

Status observed 2026-05-25: merged into `main` with merge commit `fb1e11e` after Claude feedback follow-up commit `85e214a`.

Scope completed:

1. Imported AI Studio export under `app/`.
2. Replaced over-clinical copy with Arbor private-beta language.
3. Added structured coach output and safety contract.
4. Applied Arbor standalone-inspired field-notebook design tokens.
5. Documented local setup with `GEMINI_API_KEY`.
6. Added `npm run eval:safety`.
7. Added Six Frames `frameRouting` to the coach schema and rendered output.
8. Added append-only local memory review ledger plus parent approval queue.

## Recommended Next PR After #4

Create a new GitHub PR:

**Title:** `Import AI Studio React prototype with safety/design hardening`

Scope:

1. Add AI Studio export under `app/`.
2. Replace over-clinical copy with Arbor private-beta language.
3. Add structured response/safety contract stubs.
4. Apply Arbor standalone visual system tokens.
5. Document local setup with `GEMINI_API_KEY`.

Do not merge until:

- App starts locally.
- No secrets are committed.
- No diagnosis/treatment claims remain in user-facing copy.
- Static prototype remains available as reference.
