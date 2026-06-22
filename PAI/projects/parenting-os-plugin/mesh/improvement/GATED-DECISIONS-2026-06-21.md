# Arbor CIL — Decision Surface for Guy (2026-06-21)

The self-improving loop ran its first full cycle: it **evaluated** Arbor across every dimension, **shipped** the safe fixes to a green branch on its own, and **stopped** at everything that needs your call. This is that call surface — one screen.

---

## ✅ Already shipped — ready to merge + deploy (your one click)

**Branch `claude/cil-week`** (in the `.arbor-build` worktree), 2 green commits, full gate passing (tsc · 473 tests · build · safety · framework):

- **`3c5075e`** — Hebrew-leak closure: full i18n on 3 leaking tabs (LanguageLab, Weekly, Behaviors), HE OG tags, tightened AI-stilted copy, HE register fix.
- **`b8dfc76`** — **broken-funnel fix: the landing CTA was a dead `onclick="return false"` no-op on all 5 languages → literally zero conversion. Now live.** Plus HE social previews, hreflang, schema PreOrder→live, moat-in-hero.
- *(in flight — visual wave: type scale + 44px touch targets — will land on the same branch)*

**To ship:** review `claude/cil-week`, merge to main, deploy (the verified Firebase Hosting method). Nothing auto-deploys.

---

## 🔒 Decide — Tier A: Defensive (compliance + cost ship-blockers)
Highest scores on the board. Each ≤3 days, unblocks the loop to build it. Reply with the numbers you approve.

| # | Decision | Why it's urgent | Effort |
|:-:|:--|:--|:-:|
| A1 | **Cap image-gen spend** (per-user/tier quota + circuit breaker on 7 paid routes) | Live unbounded-cost leak; gates every generative feature | 1–2d |
| A2 | **Gate `/vision` behind consent** (processes child photos with none) | COPPA/GDPR exposure on a child's face | 1–2d |
| A3 | **Capture consent at onboarding** (collects child data, no GDPR step) | Makes parent the named data controller — the trust wedge | 2d |
| A4 | **Screen `/voice` output** (streams to TTS bypassing the safety screen) | Can speak a diagnosis/dose aloud | 3d |
| A5 | **Harden `eval:safety`** (a static grep that can't catch a behavioural regression) | The gate protecting every AI change is blind | 3d |

## 🔒 Decide — Tier B: Growth unlock (complete the funnel)
The funnel fixes above point at a `web.app` URL and dead-end the referral. These finish the loop.

| # | Decision | Why | Effort | Gate reason |
|:-:|:--|:--|:-:|:--|
| B1 | **Buy + wire a brand domain** (canonical is `arborprd-westeu.web.app` — unshareable/untrustworthy) | Gates the entire GTM/share loop | 2d | financial (L4) + DNS |
| B2 | **Email/waitlist capture** on the landing pages (interested-but-not-ready visitors are lost) | Recovers demand the fixed CTA now generates | 2d | PII consent (EU) |
| B3 | **Wire the referral loop** (`/join?ref=` resolves to nothing; reward grant unbuilt) | The moat-native second-guardian acquisition loop | 3d | grant writes entitlements |

## 🔒 Decide — Tier C: Capability bets (make it *best-in-market*)
The competitor cycle's verdict: **Arbor wins on depth (the longitudinal parent-owned-memory moat) but loses on delivery.** These ship the delivery layer no rival can replicate. Bigger builds — pick the lead bet.

| # | Capability bet | Beats | Effort |
|:-:|:--|:--|:-:|
| C1 ⭐ | **Proactive "Arbor Noticed" alerts** — weekly card grounded in the child's own record ("regulation difficulty this week; here's an activity backed by Siegel & Bryson") | Good Inside, Huckleberry — *lead moat bet* | 3d |
| C2 | **Background push** (FCM) so the JITAI nudge fires at the predicted moment | Huckleberry SweetSpot, Kinedu | 3d |
| C3 | **Family multi-child glance** powered by each child's DevScore | Lingokids, Khan Kids | 2d |
| C4 | **Growth tracking** (height/weight/percentile as append-only entries) | BabySparks | 2d |
| C5 | *(safe — loop will auto-build)* **Expert-cited activity content** to match every rival's credentialed-trust hook | Kinedu/Lovevery/Khan | 2d |

---

**Fastest path to value:** merge `claude/cil-week` now (shipped, zero-risk) → approve **A1–A3** (stop the leak, get compliant) → **B1** (domain, so the fixed funnel actually converts) → **C1** (the lead capability bet). That sequence turns "polished beta" into "trustworthy, converting, best-in-class." Everything else the loop keeps grinding twice daily.

*Source: [IMPROVEMENT-BACKLOG.md](IMPROVEMENT-BACKLOG.md) cycles 2026-06-21 (a/c) + [visual-findings-2026-06-21.md](visual-findings-2026-06-21.md). Loop runs autonomously 2×/day eval + Mon/Thu build.*
