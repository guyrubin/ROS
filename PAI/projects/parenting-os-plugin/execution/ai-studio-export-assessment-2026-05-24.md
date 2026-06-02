# AI Studio Export Assessment - Arbor - 2026-05-24

## Source

- AI Studio app: `https://ai.studio/apps/9a612c18-1a07-4d4f-a13d-57d630330982`
- Local export inspected: `C:\Users\dguyr\Downloads\arbor.zip`
- Export timestamp observed: 2026-05-24 07:12 local

## What The Export Contains

The export is a runnable Vite/React/Express app, not a static mockup.

Files of note:

- `metadata.json` - app name/description and `MAJOR_CAPABILITY_SERVER_SIDE_GEMINI_API`
- `package.json` - React 19, Vite, Express, `@google/genai`, lucide, motion
- `src/App.tsx` - full interactive parent app
- `src/initialData.ts` - Dylan child profile, behavior logs, milestones, action plan, story, scholar metadata
- `src/types.ts` - typed child profile, behavior logs, milestones, action plans, story, behavior analysis, school brief
- `server.ts` - Express server with Gemini-backed endpoints

Server endpoints observed:

- `POST /api/chat`
- `POST /api/generate-plan`
- `POST /api/generate-story`
- `POST /api/analyze-behavior`
- `POST /api/generate-handoff`

Product screens/features observed:

- Overview dashboard
- AI parent coach with scholar lens
- Behavior logging and analysis
- Milestone tracker and scaffolding analysis
- Action-plan generation
- Therapeutic story generation
- Scholar/theory layer
- Professional/school handoff generation
- Safety screen

## Value

This is the closest thing to a real app foundation among the current surfaces. Compared with the GitHub static prototype, it already contains:

- Componentized app structure
- Typed domain model
- Live AI endpoint architecture
- Multiple MVP modules beyond the private-beta loop
- Richer behavior/milestone/story/handoff workflows

## Risks Before Importing To GitHub

1. **Safety language is too clinical.** The app calls itself a "clinical counselor" and "pediatric cognitive-behavioral co-therapy partner." Arbor should remain non-diagnostic parent support until professional governance exists.
2. **Some copy implies diagnosis.** Phrases like "Diagnosis Error" and "diagnostic-level" should be removed or reframed.
3. **Model configuration needs verification.** The hardcoded Gemini model string should be checked against current supported models before production use.
4. **Design mismatch.** The export appears to use a dark gold prototype aesthetic in places, while the chosen Arbor design system is the `Arbor-standalone.html` Scandinavian x Amsterdam / daily field notebook system.
5. **API-key handling is early-stage.** `.env.example` exists, but import should include clear local setup, no secrets, and safe error states.
6. **No child-data governance layer yet.** The app has profile/log data but not full consent, retention, deletion, export, or audit posture.
7. **No eval suite in code.** The operating model defines eval needs; the export does not yet appear to implement test/eval gates.

## Recommendation

Do not overwrite GitHub `main` directly with the AI Studio export.

Instead, create a new engineering branch/PR that imports the app under a clear app root, then hardens it:

1. Import AI Studio export as `app/` or repository root after deciding repo structure.
2. Re-skin the React app to the `Arbor-standalone.html` design system.
3. Replace clinical/diagnostic copy with non-diagnostic parent-support language.
4. Add a structured AI response contract aligned to `docs/developmental-ai-operating-model.md`.
5. Add safety classifiers/gates before generation endpoints return parent-facing output.
6. Add memory approval, deletion, retention, and export controls.
7. Add a minimal eval harness for safety, age-fit, no-diagnosis behavior, practicality, memory hygiene, and handoff quality.

## Decision Needed

Choose whether the next GitHub step is:

- **Option A - Keep GitHub lightweight:** Keep current static prototype and docs as canonical for now.
- **Option B - Import AI Studio app:** Promote `arbor.zip` into GitHub as the actual app foundation after safety/design hardening.
- **Option C - Hybrid:** Keep the GitHub prototype as product spec and create a separate repo or branch for the AI Studio app.

Recommended: **Option B**, but only through a hardening PR rather than a direct overwrite.
