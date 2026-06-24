# Arbor Surface Coordination
Last updated: 2026-05-28 (supersedes 2026-05-24 version)

## Canonical Version — Single Source of Truth

As of 2026-05-28, Arbor has one canonical version:

> **`guyrubin/PPPPtherapy-` `main` branch, commit `04cc2c7`**

All other surfaces (AI Studio export, standalone HTML prototypes, older branches) are archived references. Do not treat any other surface as the live product.

**Local working copy:** `C:\Users\dguyr\ROS\PPPPtherapy-\PPPPtherapy-` — on `main`, in sync with remote.

**To run:** `cd app && npm run start` → `http://localhost:3000`

**To develop:** `cd app && npm run dev` → `http://localhost:3000` (Vite HMR active)

---

## Confirmed Surfaces

| Surface | Role | Current Status | Policy |
|---|---|---|---|
| GitHub `guyrubin/PPPPtherapy-` `main` @ `04cc2c7` | **Canonical engineering surface — only live version** | Production build confirmed. Contains README, docs, mockups, prototype, and full React/Express app under `app/`. 10 developmental routine action plans shipped. | **This is the product. All changes go here.** |
| `C:\Users\dguyr\ROS\PPPPtherapy-\PPPPtherapy-` | Local working copy | On `main`, synced to remote | Pull before editing; push commits after verifying lint + build |
| `app/dist/` | Production build artifacts | Built 2026-05-28 via `npm run build`. Served by `node dist/server.cjs` on port 3000 | Rebuild after any `app/src/` or `server.ts` change |
| `app/.env.local` | Local secrets (not committed) | Placeholder `GEMINI_API_KEY` — AI features disabled until real key added | Add real Gemini key to activate AI coach endpoints |
| ROS `PAI/projects/arbor/` | Product strategy and durable memory | PRD, safety policy, roadmap, scenario library, execution notes | Coordination layer; PRD in `app/docs/arbor-prd.md` is the living engineering PRD |
| `prototype/arbor-private-beta-app.html` | Static HTML prototype (reference only) | In repo under `prototype/` | Read-only reference; not the product |
| `C:\Users\dguyr\Downloads\Arbor-standalone.html` | Visual design reference | Local standalone; Scandinavian field-notebook design system | Design token reference only; do not deploy |
| `PAI/.../html/arbor-marketing-landing-page.html` | Marketing/positioning concept | Untracked ROS file | Non-canonical until explicitly reviewed and committed |
| Local FORMATION / `pernenting platform/` | Separate brand/aesthetic track | Mentioned in handoff but not found/verified in current local scan | Keep separate from Arbor until explicitly chosen as a rebrand or alternate concept |

## Current Canonical Product Direction

Arbor should remain the private-beta parent-support product:

1. Parent concern intake
2. Child-development routing by age band and domain
3. Safety triage with no-diagnosis boundary
4. Practical same-day parent plan
5. Parent-approved child memory
6. Follow-up log
7. Audience-specific handoff
8. AI safety and quality eval gates

## Design Direction

Use the `Arbor-standalone.html` visual system for Arbor:

- Scandinavian x Amsterdam
- Warm paper background
- True ink typography
- Signal-orange clay accent
- Delft blue and moss/sage secondary colors
- Hairline grids and editorial rules
- Rectilinear 2-6px radii
- Mono section labels and numbered navigation
- Serif editorial accents
- "Daily field notebook" product feel

Do not mix in the dark gold / oxblood FORMATION aesthetic unless Arbor is deliberately rebranded.

## Verification Notes

- GitHub state was re-verified through the public GitHub API after a stale connector read. Current observed state: PR #1, PR #2, and PR #3 are merged. `main` contains `README.md`, `docs/`, `mockups/`, and `prototype/`.
- `C:\Users\dguyr\Downloads\arbor.zip` was inspected and confirmed as an AI Studio export. It includes `metadata.json`, Vite/React source, Express `server.ts`, Gemini API integration, and PRD/mockup files.
- GitHub PR #4 (`https://github.com/guyrubin/PPPPtherapy-/pull/4`) imported the AI Studio app under `app/` with structured coach output, non-diagnostic safety contract, Arbor field-notebook design tokens, setup/eval docs, Six Frames `frameRouting`, and a local memory review ledger. Observed status on 2026-05-25: merged into `main` at `fb1e11e`.
- The local `pernenting platform/` path was not found under `C:\Users\dguyr` in the current scan. It may be elsewhere, misspelled differently, or inaccessible.
- `PAI/projects/arbor/html/arbor-marketing-landing-page.html` was inspected. It is Arbor-branded and directionally aligned with private-beta positioning, but remains untracked/non-canonical until reviewed and committed.

## Next Actions

1. Add production-grade child-memory consent/retention/delete/export controls beyond the current local ledger prototype.
2. Reconcile domain taxonomy into a single source-of-truth framework artifact consumed by prompts, docs, types, and milestones.
3. Locate and review the FORMATION local folder before deciding whether it is archive, alternate brand, or rebrand candidate.
4. Review the untracked ROS `arbor-marketing-landing-page.html` and either archive it, delete it, or explicitly mark it as non-canonical.
5. Keep the consolidation backlog current as GitHub, ROS docs, AI Studio, and static design references converge.
