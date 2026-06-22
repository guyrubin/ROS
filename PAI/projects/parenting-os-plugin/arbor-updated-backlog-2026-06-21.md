# Arbor — Updated Execution Backlog (post-Codex production review)

**Date:** 2026-06-21
**Owner:** PAI / Arbor
**Prod:** https://arborprd-westeu.web.app · **API:** `arbor-api` Cloud Run (`europe-west4`, project `arborprd-westeu`)
**Production snapshot reviewed:** `origin/main` @ `1e18f86` (deployed image `codex-story-engine-20260621`, hosting released 2026-06-21 02:18)
**Supersedes:** [EXECUTION-BACKLOG.md](EXECUTION-BACKLOG.md) (avatar/games/growth) + [exec-blueprint-2026-06-17/EXECUTION-BLUEPRINT.md](execution/exec-blueprint-2026-06-17/EXECUTION-BLUEPRINT.md) (IA/feature/marketing). Both are now mostly burned down — this doc is the live "what's left + what Codex's changes created."

---

## 1. Where production actually is (verified in code, 2026-06-21)

**Codex shipped a lot, and it's real and integrated — not a pile of stubs.** Waves 0–2 of the exec-blueprint are merged and wired; Codex layered a full Peterson story engine on top.

### Shipped, wired, and working
- **6-pillar IA** (Today / Ask / My Child / Grow / Care / Academy) — fully wired, **no orphan tabs**, deep-link fallbacks preserved (`lib/navigation.ts`). Today is a living, daypart-reordered spine (rhythm → daily-play → memory → missions).
- **All pre-existing child-dev features are surfaced, not orphaned:** JITAI nudge (Today), red-flag monitoring (My Child › Dev), early-reading/phonics + letter-tracing (Practice › Speech), Mimic/MediaPipe (Practice › Mimic), rhythm, daily-play, dev-score, folded missions — all render and read/write the memory moat.
- **Peterson story engine (Codex):** 8-beat fixed story spine (data-authored, never hallucinated), 6 archetypes + bilingual `parentInsight`, virtue scoring (courage/responsibility/resilience/empathy/wisdom/truth), Family Charter → virtue mapping, 4 deep Masterclasses, Family Rituals, AI per-child personalization with `imagePrompt`/`sfx`/`dialogue` per beat.
- **Hero everywhere (p2-hero):** `HeroAvatar` confirmed in Today, Child Profile, DevScore, Milestones, Plans, **and the Reports PDF brand lockup** (`reportExport.ts` `heroImageUrl`).
- **AI layer (strong):** model routing (Claude high-stakes / Gemini creative+structured), automatic multimodal downgrade, retry+backoff, 8192-token cap on every call, full usage telemetry + daily cost rollup, memory windowing (40 facts), Zod-validated output.
- **Monetization (enforced end-to-end):** Free/Plus/Family entitlements, RevenueCat webhook (auth'd, idempotent), checkout URLs, free coach meter (10/day → 402 upsell), Plus gates (reports/plans), referral loop (HMAC code, self-referral blocked, grant cap, never clobbers paid).
- **Safety/consent (strong):** PII redaction on every AI call, output safety screen (lexical always-on + optional semantic), input escalation screen, COPPA consent ledger (451 gate) on voice + face endpoints, `requireChildOwnership` IDOR guard (403), fail-closed prod auth.
- **Growth loop (instrumented):** referral invite→grant, branded on-device PNG share/export (avatar/story/answer/growth cards, "Made with Arbor" + UTM deep links), analytics → Firestore sink, first-touch attribution/UTM capture.
- **Native:** real bundle id `app.arbor.family`, safe-area/status-bar/keyboard/back/haptics polish, Fastlane metadata (iOS+Android), privacy.html + terms.html live. Android CI green.

---

## 2. P0 — Production risks (fix this week, before any growth push)

These came out of the code audit at high confidence. They are live in prod now.

| # | Item | Why it's P0 | Where | Effort |
|---|------|-------------|-------|--------|
| **R1** | **Cap image-gen cost.** `/api/generate-avatar`, `/api/generate-scene`, `/api/generate-comic` have **no quota, no entitlement, no per-child cap**. A free/anon user can loop and spend $1000s on Gemini image gen in minutes. | **CRITICAL cost leak.** Story/Practice scenes regenerate per session (no persistent cache), so even normal use is expensive. | `server/createApp.ts:123-126` (excluded from quota), `routes/api.ts:824,893,944` | S |
| **R2** | **Gate `/api/vision` on `face_processing` consent.** It accepts real photo uploads (observe/document modes) with no `requireConsent` gate — every other face/voice path is gated. | COPPA-2026 exposure: biometric/face data processed without the consent gate the rest of the app enforces. | `routes/api.ts:687-774` | S |
| **R3** | **Fix iOS CI runner.** Workflow falls back to `macos-14` (Xcode 15.4); Capacitor 8 needs Xcode 26 / Swift 6.2 → `@capacitor/status-bar` Swift compile error, archive fails. | Blocks every iOS TestFlight build; store submission can't proceed. | `.github/workflows/ios.yml:28` | S |

**R1 recommended fix:** add the 3 image endpoints to the AI-quota middleware **and** a per-child daily image cap (e.g. ≤ N scenes/comics/day, cached forever after) + record image usage in the telemetry rollup. This also becomes a clean Plus/Family upsell lever.

---

## 3. P1 — Finish the headline experience (the "iOS-level, illustrated" bar)

Hero placement is done. The gap now is **illustrated-scene fidelity, cost, and consistency** — the screenshot bar Guy set on 2026-06-19. These are the difference between "it works" and "it's the demo."

| # | Item | State today | Acceptance | Effort |
|---|------|-------------|-----------|--------|
| **H1** | **Persistent scene/comic cache** (cross-session, ideally cross-device). Story beats + Practice world-cards regenerate every session — large quota burn + slow return. | In-memory `sceneArtCache` (Map) only; `lib/sceneCache.ts` localStorage layer exists for some paths but comic panels in `HeroScenePlayer`/`HeroComicsTab` are session-state only. | Identical (avatar × beat) never re-pays after first gen; survives reload; server-side Firebase Storage cache for cross-device (Guy-gated on Storage decision). Pairs with R1. | M |
| **H2** | **Proactive quota / cost UX.** No "X scene generations left" signal; a child can start an 8-beat story that exhausts quota mid-way. | Paywall 402 is caught reactively; no pre-check, no batching/sequencing of the ~8–10 gens on first open. | Generate-on-open (not all-cards), ≤2 concurrent, honest "generating…" + remaining-count; no dead ends. | M |
| **H3** | **RTL SFX/dialogue bug.** Hebrew stories get English comic SFX ("WHOOSH" not "ואוש"). | Generation prompt hardcodes EN examples regardless of `language` (`routes/api.ts:1304-1306`). | SFX + dialogue generate in the story's language; verified on a HE story. | S |
| **H4** | **Practice world-card illustration parity.** Confirm every world-card renders a generated scene with the hero composited in (not icon fallback), character-consistent, cached. | `WorldScene` pipeline exists; prod fill was historically flaky (Vertex 429 — now fixed via AI-Studio key). Needs a clean live verify after R1/H1. | All 9 world-cards show the child's hero, consistent, cached, cost-gated. | M |
| **H5** | **Family Charter steers the story journey.** Charter is collected and virtue-mapped, and already filters Masterclasses — but stories still show in pack order. | `becoming.ts` maps values→virtues; not applied to story ranking. | Stories matching the family's chosen virtues surface first; "the Aim" actually drives the catalog. | S |
| **H6** | **Avatar field disambiguation.** Avatar stored on `childProfile.avatar` but story path reads `photoUrl`; data-URL vs https-Storage handling is ad hoc. | Works in the happy path; brittle. Convert https-Storage avatars → data URL before gen is partially done. | One documented avatar-resolution path; no "avatar created but not used" case. | S |

**Definition of done (the bar):** a parent opens any Academy story or Practice world and sees *their actual child* drawn as the hero in every illustrated scene — character-consistent, fast (cached), cost-guarded, consent-respecting, language-correct.

---

## 4. P2 — Depth, discoverability, polish

| # | Item | Why | Source | Effort |
|---|------|-----|--------|--------|
| **D1** | **Wave-3 surface conformance + whole-app iOS-grade polish** (`surf-ios`, `surf-android`, `surf-app-shell`, `surf-academy`, `p3-ios-grade-audit`). Touch targets ≥44px, motion, empty/loading/error states, type/spacing rhythm, a11y AA, RTL, per surface. | The only major exec-blueprint wave **not** yet shipped; the "calm-for-parents / vivid-for-kids" mandate, verified surface-by-surface. | exec-blueprint Wave 3 | L |
| **D2** | **Discoverability fixes.** Phonics/early-reading is buried below the Speech articulation scroll; Mimic is nested 3 levels under Grow › Practice. | Best child-dev features are hard to find → underused. | audit (IA) | S |
| **D3** | **Memory-moat narrativization** (`b5` remainder). The moat is browsable (raw facts) but not *marketed* — no "here's what Arbor knows about [child]" summary. | The moat is the uncopyable asset; today it reads like a settings list, not a story. | exec-blueprint `b5` | M |
| **D4** | **`b4-practice-vs-dailyplay`** — sharpen the Practice (skill drills) vs Daily Play (behavior-driven activities) distinction in Grow. | Two adjacent surfaces blur together. | exec-blueprint `b4` | S |
| **D5** | **Story-engine seams** — Charter→archetype linkage in Masterclasses, reflection-beat `parentInsight` surfacing, kill the dead `/api/generate-scene` endpoint or wire it as the cheap fallback. | Codex's story engine is rich but a few seams are loose. | audit (Academy) | S |

---

## 5. P3 — Growth & launch (mostly content or Guy-gated)

| # | Item | State | Gate |
|---|------|-------|------|
| **G1** | **Native store submission** — iOS TestFlight + Play internal track. Engineering done (Fastlane, metadata, privacy/terms). | Blocked on: Apple Dev account + ASC secrets, Google Play account + keystore secrets, **screenshots** (manual, not CI-automatable), and R3 (iOS runner). | **Guy** (accounts/secrets) |
| **G2** | **Custom domain** (`arbor.co.il`) — one-line `share.ts:22` swap + landing rewrite once HTTPS is green. Gates every viral link string. | Ready; blocked on purchase + DNS. | **Guy** (spend) |
| **G3** | **Landing parity + cleanup** (`mk-landing-parity-rebuild` finish, `mk-delete-stale-landing`). 22 marketing HTML files exist (en/he/de/nl/fr + guides + topic pages) with SEO/hreflang/JSON-LD; confirm one design system, delete stale HE duplicate. | Buildable now. | — |
| **G4** | **P0 growth assets** (`mk-p0-6` creator roster ≥15, `mk-p0-7` template kit, `mk-p0-8` HE copy pack + i18n). | Buildable now (paste-ready); gate downstream campaigns. | — |
| **G5** | **Israel campaigns** (`mk-p1-1..7`: avatar-challenge, creator seeding, WhatsApp/FB playbook, AEO/SEO-HE, owned social, YouTube Shorts) + **loop-optimization instrument** (`mk-p1-6`). | Playbooks buildable; **execution** needs social accounts `@arbor.family`. | **Guy** (social accounts) |
| **G6** | **NL/EN + paid** (`mk-p2-*`: NL i18n, communities, paid amplifier, EN App Store launch, PR, paywall A/B). | Gated: **no paid euro until `mk-p1-6` reads GREEN** (K ≥ 0.4, activation ≥ floor). | loop-health verdict |
| **G7** | **Real kid phoneme ASR** (`p2-10`). Gemini-audio scoring shipped as honest interim; real per-phoneme needs SoapBox license. | Interim live; real vendor pending. | **Guy** (vendor) |

---

## 6. Decisions only Guy can make (unblockers)

1. **Domain** purchase + DNS (`arbor.co.il`) — unblocks G2 + all P1 viral links.
2. **Apple Developer** account + App Store Connect API secrets; **Google Play** account + signing keystore — unblocks G1.
3. **Firebase Storage** for the cross-device scene cache (H1 server side) — cost + privacy sign-off.
4. **SoapBox** (or equivalent) kid-ASR vendor license — unblocks G7 real phoneme scoring.
5. **Social accounts** `@arbor.family` (IG/TikTok/YouTube) + connection — unblocks G5 execution.
6. **Paid-spend threshold** confirmation for the `mk-p1-6` GREEN gate — unblocks G6.

---

## 7. Recommended sequence

1. **P0 now** (R1 cost cap, R2 vision consent, R3 iOS runner) — small, urgent, ship together. R1 + H1 are the same cost story; do them adjacent.
2. **P1 illustrated bar** (H1→H4→H2→H3→H5→H6) — finishes the headline demo experience; verify live in prod after R1.
3. **P2 polish** (D1 last, as the append-only whole-app pass; D2/D3/D5 alongside P1).
4. **P3 launch** — G1/G2 the moment Guy clears accounts/domain; G3/G4 buildable in parallel anytime; G5/G6 gated on loop health.

## Operating rules (unchanged, carry every build)
- No dark patterns (AADC/Fairplay): no streak pressure, no variable reward, no autoplay; short bursts, clean stops, co-play framing.
- Privacy-first (COPPA-2026): no raw face stored, no child data to training, on-device biometrics, consent gates, SynthID/C2PA on generated images.
- Moat-powered: every feature reads from / writes to the child's longitudinal memory record.
- Ship visible: build → `npx tsc --noEmit` + `npm test` green → deploy both tiers → verify live.
