---
type: runbook
title: ROS Dashboard — Deployment Runbook
status: scaffold (deploy is Tier-C, Guy-gated)
target: Firebase Hosting, login-gated
---

# Deploying the ROS Dashboard (login-gated, real data)

The canonical dashboard (`ros-interface-v4`) is a React/Vite SPA. The blocker for "online" is **confidentiality**: `state.json` holds NDA client data (Boortmalt), ABN/Coca-Cola engagements, contacts, financials, and the personal life-map. **Firebase Hosting serves every file under `dist/` publicly** — so the data must NOT ship as a static file.

## Option A — Claude Cowork artifact ✅ (shipped, simplest, private)

`npm run build:artifact` → **`dist-artifact/ros-cockpit.html`** — one self-contained file (~524 KB): all JS/CSS inlined, `state.json` embedded as a JSON data block on `window.__ROS_STATE__`, no server, no fetch. Opens in any browser; drop it into a Claude Cowork session as an artifact. Confidential data lives only in *your* session (not public hosting), so the gating problem below doesn't apply. `dist-artifact/` is gitignored. Rebuild any time to refresh the data.

## Option B — Firebase Hosting (login-gated, online) — ⛔ The one rule

**Never deploy a build that contains `public/state.json` (or a baked-in `state.json`) to public hosting.** `npm run build:local` copies it in for *local* preview only; it is gitignored. A naïve `firebase deploy` of that `dist/` would expose everything.

## Architecture — two safe stages

```
Browser ──(Google sign-in)──▶ Firebase Auth ──┐
   │                                           │ verifies email == allow-listed
   ▼                                           ▼
Firebase Hosting (app shell: JS/CSS/HTML)   Auth-gated data source
   = NOT sensitive, OK to host                = state.json, NEVER a public file
```

The app shell (compiled JS/CSS) carries no secrets — safe to host. The **data** is fetched at runtime only after auth, from one of:
- **Option A — Firestore doc** (recommended, no Functions): `gen-state.mjs` pushes `state.json` into a Firestore document; security rule `allow read: if request.auth.token.email == "<guy>"`. SPA reads it after sign-in.
- **Option B — Cloud Function** `getState`: verifies the Firebase ID token + allow-list, returns `state.json`. Hosting rewrite `/api/state → getState`.

`src/state/useStateSync.ts` must become environment-aware: dev → `/state.json` (Vite middleware, unchanged); prod → Firestore read / `/api/state` with the auth token. This is the remaining build step (needs the Firebase project to wire + test).

## Steps (Guy-gated — Tier-C)

1. **Pick/confirm the Firebase project** (reuse Arbor's or a new `ros-cockpit`). Put its id in `.firebaserc`.
2. **Enable Firebase Auth** (Google provider); add Guy's email(s) to an allow-list (Firestore rule or Function check).
3. **Wire the auth gate + data source** (Option A or B above) — the one piece of app code still to write.
4. `npm run build` → produces `dist/` (app shell only; no `state.json`).
5. `firebase deploy --only hosting` (+ `firestore:rules` or `functions` for the data path).
6. Verify: signed-out → login wall; signed-in non-allow-listed → denied; signed-in Guy → full cockpit. Confirm `https://<site>/state.json` 404s.

## What's scaffolded already
- `firebase.json` (hosting → `dist/`, SPA rewrite, no-store headers)
- `.firebaserc` (project id placeholder)
- `.gitignore` (excludes `dist/`, `public/state.json`)
- `npm run build:local` (stages real data → builds → for **local `npm run preview` only**)
- `npm run build` (clean shell build for deploy)

## Stop point
The dev-ring is green and the shell builds. **Do not run `firebase deploy` until the auth gate + auth-gated data source (step 3) are wired and the `state.json`-404 check passes.** That step + the live deploy are Guy-gated.
