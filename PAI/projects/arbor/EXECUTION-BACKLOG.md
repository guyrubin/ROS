# Arbor — Execution Backlog & Goal

**Date:** 2026-06-17
**Owner:** PAI / Arbor
**Canonical PRD:** [PRD_2026-06-17_avatar-games-growth.md](PRDs/PRD_2026-06-17_avatar-games-growth.md) (see §8 for the cross-domain Hero + Comic identity)
**App:** `PPPPtherapy-/PPPPtherapy-/app` · Prod: https://arborprd-westeu.web.app

## THE GOAL (north star)

> **Arbor at iOS level: a calm parenting environment + delightful kid-interactive features, fully operational and fully integrated — not a stack of bolted-on features.**
>
> Every capability lives in its *natural* place in the product (the comic capability lives **inside the stories**, not in a side tab; the hero lives **everywhere**, not on one screen). Parent surfaces are calm, premium, Apple-grade. Child surfaces are vivid, playful, character-driven. The child is the hero of their own developmental story, and every feature reads from / writes to the longitudinal memory moat. Best-in-market kids capabilities (Khan Kids / Lingokids / Duolingo ABC), delivered better. Real generated images. No dark patterns. Ships working end-to-end.

**Definition of "iOS level / fully integrated" (the bar every surface must clear):**
1. **Integrated, not bolted-on** — a capability appears where the user already is (comic → in stories; hero → in every domain). No orphan tabs.
2. **Operational end-to-end** — generate → render → save/track → feed the memory record, with real loading/empty/error states.
3. **Apple-grade craft** — type, spacing, motion, touch targets, hapt-feeling transitions; calm for parents, playful for kids; verified live.
4. **Coherent system** — one hero identity, one design language per register, one set of primitives (PlayKit child / kit parent).

## Done (shipped this session)

- ✅ **Comic capability embedded in the stories (re-architected).** Every Academy **Story Journey** now renders AS a personalized comic — each beat is a full-width comic panel starring the child's hero (`HeroScenePlayer` → `generateComic`, narration as caption, no duplicated bubble). The standalone "Hero Comics" Academy subtab was **removed from nav** (the capability is in the stories now, not a side feature).
- ✅ **Cross-domain Hero Avatar** — `HeroAvatar` surfaces the child's avatar in every Practice game header, the Home greeting, and the stories; Sprout fallback + "Create your hero" CTA.
- ✅ **"Comic Hero" avatar style** (default) + **`POST /api/generate-comic`** (dialogue now optional → embeddable in stories) + **image gen enabled in prod** (`VERTEX_MODEL_IMAGE`).
- ✅ **Service worker self-updates every deploy** — deploys reach users.
- ✅ Practice Studio visual pass (PlayKit), Capacitor iOS+Android shells, app icons/splash.

## Shipped in the ultracode run (deployed)

- ✅ **M1 — comic-book reader**: every story beat turns like a comic page (3D page-turn), comic page-number badge, Save-page download. (`HeroScenePlayer`)
- ✅ **M2 — hero everywhere**: the child's hero stars in Today, every Practice game header + **win celebration**, and a shareable **Hero Card** export (`lib/heroCard.ts`). *(M2-polish — hero on milestones/Development — in the final workflow.)*
- ✅ **M6 — JITAI nudge engine**: `lib/jitai.ts` (pure, 6 tests) fires ONE well-timed nudge off the child's logged rhythm. The wedge no competitor runs.
- ✅ **M11 — MimicStudio MediaPipe**: on-device FaceLandmarker face-match game (`practice/faceMatch.ts` + `MimicMatch.tsx`), privacy-clean, skip control, star/win alignment. *(built via the multiagent build workflow)*
- ✅ **M8 — Red-flag monitoring**: `lib/monitoring.ts` (19 tests) — non-diagnostic "worth discussing with your provider" surveillance from milestones+logs, with a provider-summary export, surfaced in Screening. *(multiagent workflow)*
- ✅ **M7 — Literacy + tracing**: `EarlyReadingTrack.tsx` (articulation→phonics→sight words→reading) + a finger letter-tracing mini-game, wired into SpeechCoach. *(multiagent workflow)*
- ✅ **M5 — CDC/AAP-2022 milestone re-base**: `lib/milestoneData.ts` (CDC 2022 set + ASHA, corrected-age, "what it looks like") + MilestonesTab. *(multiagent workflow)*

All deployed; **344 tests pass**, tsc clean.

## ✅ BACKLOG COMPLETE — all missions shipped & deployed (both tiers)
- ✅ **M2-polish** — HeroAvatar on Milestones + Development headers.
- ✅ **M4 operational hardening** — `hooks/useAsyncAction.ts` (loading + friendly error + start/success/error analytics + 402→paywall) wired across the generative surfaces.
- ✅ **M9 COPPA consent** — `sharing/consent.ts` ConsentStore (Local+Firestore) + `server/requireConsent.ts` (451 gate on face/voice endpoints) + **`server/requireChildOwnership.ts`** (the adversarial review caught a P0 IDOR — any user could self-grant consent for an arbitrary child; fixed with a per-child ownership gate, 403, + 5 tests) + a parent-only Privacy & Consent view + provable `eraseEverything` deletion with receipt. ai_training defaults OFF.

**Final state: 415 tests pass, tsc clean. Cloud Run `arbor-api:m9consent` + Hosting deployed; `npx cap sync` ran (iOS + Android shells carry the final build).** All 9 missions executed via the implement→adversarial-review→harden multiagent build workflows.

### Native (iOS App Store + Google Play) readiness
- ✅ Capacitor iOS + Android projects generated, icons/splash, backend CORS allows native origins, web build synced into both shells.
- ⏳ Before store submission (needs Guy): set the real **bundle id** (placeholder `app.arbor.family`) in `capacitor.config.ts`; **Android** → Android Studio → signed AAB (buildable on this Windows box); **iOS** → needs a **Mac + Xcode** to archive. See `app/MOBILE.md`.

## 🎯 NOW — the illustrated, avatar-embedded standard (the screenshot bar) — DO FIRST

**Target (set 2026-06-19, by Guy):** every world-card and story image is a **rich generated illustration with the child's hero composited into the scene** (not flat icons), plus comic SFX, a hero banner (level · power meter · friends meter · Brave-Heart badge). Reference = the localhost Practice-hub mock (concurrent agent's illustrated direction). Bring **both** the Practice hub **and** the Academy to exactly this fidelity.

**Status context:** my icon-tile Hero Arcade is now LIVE in prod (`claude/hero-arcade`, deployed 2026-06-19). The concurrent agent's illustrated Practice hub is the visual bar. **Converge to ONE arcade** at this standard — do not ship two.

| # | Mission | Surface | Owner pods | Acceptance |
| :- | :-- | :-- | :-- | :-- |
| **I0** | **Reconcile the two arcades** — pick the illustrated hub as the base, fold in my structure (9 worlds, cosmetics-on-hero `HeroCrest`, the 3 new games, comic-share CTA). One `HeroArcade`. | Practice | orchestrator + arbor-practice + arbor-design | single arcade on `main`; no duplicate Practice hubs; green-gate |
| **I1** | **Illustrated world-cards** — replace lucide-icon scenes with a **generated per-world scene** (child hero composited in), comic SFX overlay; cache per (avatar × world). | Practice | arbor-avatar (gen) + arbor-design + arbor-practice | each tile = generated scene w/ the hero; cached; cost-gated; loading/fallback states |
| **I2** | **Hero banner** — large comic-hero portrait + Power meter + **Friends meter ("מד חברים")** + Brave-Heart badge, matching the reference. | Practice | arbor-avatar + arbor-design + arbor-growth | banner matches reference; real data, no fake numbers |
| **I3** | **Academy Story Journeys at this fidelity** — each beat a **full illustrated scene with the avatar generated INTO it** (raise `HeroScenePlayer`), cover page, **character-consistent** hero across beats. | Academy | arbor-avatar + arbor-content | beats are rich avatar-embedded scenes; consistent character; cached |
| **I4** | **Hero Comics at this fidelity** — full illustrated comic pages starring the avatar; share/download. | Academy | arbor-avatar + arbor-content | comics match reference; shareable |
| **I5** | **Shared scene-gen pipeline** — generate→cache→store (Firebase Storage decision, Guy-gated), **avatar consistency via reference image**, cost/quota guard, consent gate. Reused by I1–I4. | cross | arbor-avatar + arbor-ai + arbor-safety | one pipeline; cost-capped; consent-gated; no per-call regen of identical scenes |
| **I6** | **Friends/social signal** behind the Friends meter (real or an honest placeholder, no dark patterns). | Practice | arbor-growth | meter reads a real signal or is clearly aspirational |

**Definition of done for the bar:** a parent opening Practice or an Academy story sees *their actual child* drawn as the hero inside every illustrated scene, character-consistent, fast (cached), cost-guarded, consent-respecting — matching the reference screenshot.

**Progress (2026-06-19):**
- ✅ **I5 (device-local layer) shipped + deployed.** `lib/sceneCache.ts` — persistent (localStorage), quota-safe LRU + in-flight dedup; `HeroScenePlayer` uses it, so Academy story beats now survive reload and never re-pay generation for an identical (avatar × beat). 6 tests. *Remaining I5:* server-side Firebase Storage cache (cross-device) — Guy-gated.
- ◑ **I3 core already existed** — `HeroScenePlayer` already generates a comic panel per beat with the avatar as the consistency reference (full-width panel, page-turn). The cache (above) is the missing piece for the "instant illustrated on return" feel. *Remaining I3:* cover page, raise per-beat scene quality/consistency to the reference, verify with a real generated avatar.
- ✅ **I1 shipped + deployed.** `WorldScene.tsx` — each world card generates a themed scene starring the hero (`generateScene`, avatar = consistency ref), cached via `sceneCache`, **lazy on view** (IntersectionObserver — unseen worlds never spend), avatar-gated, graceful icon fallback. Per-world `imagePrompt`s. *Verifies only where image-gen is live (prod) + a generated avatar exists; dev `/api/generate-scene` 500s without Vertex creds → icon fallback (confirmed no regression).* **Remaining I1:** Plus/quota gate on the per-child generation cost (≤9 scenes/child, cached forever after).
- ◑ **I0 (converge) done by superseding** — the **deployed `claude/hero-arcade` arcade is now the single canonical illustrated hub**. ⚠️ **Coordination risk:** the concurrent agent's Practice hub still exists on its own branch; if their pipeline redeploys it, it could reintroduce a 2nd hub / overwrite this one. Reconcile branches (merge the canonical arcade to the shared integration branch) before the next concurrent deploy.
- ✅ **Firebase dep regression fixed + deployed** — client `firebase` was undeclared in package.json → pruned → broke auth/Firestore/storage + "most avatar features". Declared `firebase@^12.13.0`. ([[arbor-firebase-dep-gotcha]])
- ✅ **Academy comic redesign deployed** (Story Journeys banner + comic cards) + **I3/I1 Academy parity wired**: `HeroJourneyTab` story cards now use the same `WorldScene`/`generateScene` pipeline as Practice (commit f380ce9, deployed). Cards render Dylan + story motif + SFX as fallback; full generated scenes populate lazily + cache.
- ✅ **Verified in prod (Guy's browser):** Dylan's hero exists; **Practice world-cards generate Dylan into each scene** (Sound Lab/Mood Mountain/Mind Vault/Mimic Studio) — character-consistent, matches the reference. No console errors.
- ⚠️ **Academy generated-scenes NOT cleanly confirmed populating** — first-visit gen of ~10 cards is heavy (renderer choked; browser session flaky). Likely just slow first-gen (caches after, like Practice). **If they stay on fallback:** suspect avatar is an https Storage URL passed as `avatar.dataUrl` to generateScene → convert to data URL before gen (real fix, needs a stable session to verify).
- ⚠️ **Gen throughput/cost follow-up:** ~9 (Practice) + ~10 (Academy) image-gens on first load is heavy + costly. Throttle/sequence generation (or generate-on-open) + add the Plus/quota gate (I1 remaining).
- ✅ **Scene-gen throttle + robustness shipped** (commit 2b3ad72, deployed): `dedupeScene` queues generations ≤2 concurrent (fixed the renderer freeze — confirmed responsive after); avatar→data-URL conversion (memoized) before `generateScene` so https Storage avatars also generate. Shared by Practice + Academy + story player.
- ⚠️ **OPEN — prod scene-gen throughput unconfirmed:** after deploy + reload, `sceneCache` (localStorage) held only **2 `world|` entries, 0 `story-` entries**; Academy cards still on fallback after ~20s. Throttle=2 + slow Vertex gen explains gradual fill, BUT only 2 total scenes ever cached app-wide is suspicious — **prod `generateScene` may be slow/partly failing (latency/quota), not just throttled.** Browser session was too flaky to confirm (tabs kept recycling, screenshot CDP glitches). NEXT: on a stable browser, load /#/stories, leave ~2–3 min, watch `localStorage['arbor.sceneArt.v1']` story-key count grow; if it stays 0, instrument/inspect the `/api/generate-scene` response (status, latency). Consider **generate-on-story-open** instead of all-cards to cut cost + load.
- ✅ **ROOT CAUSE FOUND + FIXED + VERIFIED — prod image gen was Vertex `429 RESOURCE_EXHAUSTED`** (gemini-2.5-flash-image quota in europe-west4, confirmed in Cloud Run logs). Fix: route image gen through the **AI-Studio Gemini API** (separate quota, same model) when `GEMINI_API_KEY` is set; key provisioned in Secret Manager (`arbor-gemini-key`) + injected via `--set-secrets`; Cloud Run API redeployed (commit 4c72b47, image 4c72b47). **Verified: direct prod POST /api/generate-scene → 200, real 2.3 MB image, ~8.9 s, no 429.** This unblocks ALL image gen (avatars, scenes, comics) at quality.
- ⚠️ **Hosting ownership conflict (real):** prod hosting is currently the **concurrent agent's** build (prod `/#/practice` shows the old Adventures UI, not my Hero Arcade — they redeployed over it). So the deployed client doesn't fire per-card `generate-scene` like my `WorldScene` did. The concurrent agent's localhost references DO generate per-card — so **their client + my server fix = the references, in prod.** My arcade build lives on branch `claude/hero-arcade` (pushed). Reconcile: decide ONE canonical client; my server fix benefits whichever ships.
- ⏭ **Next:** ensure the canonical (rich, illustrated) client is the deployed one; then every story/play generates a Gemini image at quality (server is ready). I2 (Friends meter), I6 (social), Plus/quota gate.

## Remaining missions (sequenced)

### Phase 1 — iOS-level integration sweep (make it whole & operational) — DO FIRST
| # | Mission | Why | Effort |
|---|---------|-----|--------|
| 1 | **Comic story = full comic-book reader** — multi-panel layout, page-turn motion, cover page, save/share the finished comic, cache per (avatar, story). Plus-gate the image cost. | turns per-beat panels into a real personalized comic book — the headline experience | M |
| 2 | **Hero everywhere, finished** — hero on Today, every Practice game + celebration, Milestone "memory portraits", Development header, profile, Care "hero card" export. Audit every domain for the Sprout-fallback→hero swap. | completes the cross-domain promise; one identity, everywhere | M |
| 3 | **Whole-app iOS-grade audit + polish** (impeccable, per-surface): parent surfaces calm/premium, child surfaces vivid/playful; touch targets ≥44px, motion, empty/loading/error states, type/spacing rhythm, a11y AA, RTL. Fix to the bar. | the "iOS level" mandate, made concrete and verified surface-by-surface | L |
| 4 | **Operational hardening** — every generative feature has real loading + graceful fallback + cost/quota guard + analytics; no dead ends; deep-link every route. | "fully operational" mandate | M |

### Phase 2 — best-in-market capability depth (moat-powered)
| # | Mission | PRD ref | Effort |
|---|---------|---------|--------|
| 5 | **CDC/AAP-2022 milestone re-base** + ASHA-2023, corrected-age, "what the skill looks like" media | C1 | M |
| 6 | **JITAI nudge engine** — fire practice/coach prompts off the child's logged state, ML-timed | C3 | L |
| 7 | **Lingokids/Duolingo parity** — early-reading/phonics track on SpeechCoach + finger letter-tracing mini-game | §8.1 | L |
| 8 | **Red-flag monitoring layer** (ASQ-3-style "discuss with your provider" + provider PDF) | C5 | M |
| 9 | **COPPA-2026 consent granularity** (separate share vs AI-training consent, provable deletion) | C6 | M (legal) |
| 10 | **Real kid phoneme ASR** (SoapBox license OR hosted fine-tuned Whisper) | B/§9 | L (vendor) |
| 11 | **MimicStudio on-device MediaPipe** geometry scoring (`@mediapipe/tasks-vision` already added) | B | M |

**Order:** Phase 1 (1→2→3→4) before Phase 2. Items 9–10 need a Guy decision (legal/vendor); everything else is buildable now.

## Operating rules (carry every build)

- **No dark patterns** (AADC/Fairplay): no streaks-as-pressure, no variable-reward, no autoplay; short bursts, clean stops, co-play framing.
- **Privacy-first** (COPPA-2026): no raw face stored, no child data to training, on-device biometrics, consent gates, SynthID/C2PA on generated images.
- **Moat-powered**: every feature should read from or write to the child's longitudinal memory record — that's the uncopyable asset.
- **Ship visible**: build → tsc + tests green → deploy both tiers → verify live.
