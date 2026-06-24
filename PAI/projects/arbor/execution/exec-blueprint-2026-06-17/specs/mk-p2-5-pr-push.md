## mk-p2-5-pr-push — PR / launch push
**Aspects:** Marketing · **Surfaces/platforms:** landing:en, landing:he · **Priority:** P2

### Problem / why
The €10k/6-month GTM plan (`marketing/arbor-viral-gtm-2026-H2.md`) treats earned media as the cheapest, highest-leverage channel (§7 lines 105-110): "An Israeli-built calm AI that tells parents what's *actually* going on with their kid — and refuses to fear-sell." Calm + privacy-first + non-diagnostic is a counter-narrative the press likes, and the avatar + memory moat are visual, demo-able hooks for journalists. PR is the **last** marketing motion in the plan: it lands in **Phase 3 — EN rollout (Weeks 17-26)** as part of the launch push, *after* the loop is proven in Israel (GTM §9 line 141; phasing exit gate "5 countries live; CAC < €4; Free→Paid ≥ 3%").

This is backlog item **P2-5** (`marketing/arbor-marketing-backlog.md` line 50): "PR / launch push — IL press + Product-Hunt-style EN launch + 2 podcast spots + parenting newsletters. Calm-AI / privacy-first / avatar angle." Owner Me/MKT, effort M, content-only (✍ — no app code, no spend bucket of its own beyond founder time).

The raw materials already exist: the **PR one-liner is locked** in `marketing/arbor-launch-copy-pack.md` §7 line 94, and the founder/journalist angles are in GTM §7. What does **not** exist is the executable press kit: the pitch-able assets, the outreach lists, the embargo/launch-day runbook, and the attribution so we can actually read what PR drove. This spec is the **press-kit + outreach + launch-day runbook** that turns the locked one-liner and angle into a run-ready operation a founder can execute the moment the EN rollout opens — the missing piece between "we have a one-liner" and "we have pitched 20 outlets, run a Product-Hunt-style launch, and can read referral/UTM-attributed installs per placement."

### Scope across platform domains
- **Landing EN** — the **destination** of every EN press placement, Product-Hunt link, podcast show-note link, and newsletter link. This item **does not rewrite** `html/arbor-marketing-landing-page-en.html` (that is `mk-landing-parity-rebuild`); it **consumes** the rebuilt EN landing and the canonical origin set by `mk-p0-1-domain`, and produces the press-tagged URLs (`utm_medium=pr`). A small, additive, conflict-safe edit is in scope: a `<link>`/meta verification of Open Graph + Twitter-card tags so shared press links unfurl correctly (journalists and PH embeds rely on OG). Verify-and-fill only — do **not** restructure the page.
- **Landing HE (RTL)** — the **destination** of every IL press placement and podcast link. Same treatment: consumes the canonical HE path, produces HE press-tagged URLs (`utm_campaign=launch_il`), and the same additive OG/Twitter-card verification pass for the HE file. No structural edits.
- **Web / iOS / Android:** out of scope — no native or web-app source edits. Installs from press placements attribute through the already-shipped `lib/attribution.ts` (commit `e09537a`) + `lib/loopEvents.ts` event layer; PR reuses the existing instrumentation, adding **zero** new events.

Primary deliverable is a Markdown press-kit + runbook under `marketing/`. The only HTML touches are additive OG/meta verifications on the two landing files (conflict-safe; see conflict notes).

### IA / UX / Copy / Marketing detail (Marketing)

The build is a **press kit + outreach playbook + launch-day runbook**. Write it to `marketing/arbor-pr-launch-push.md`. Six components:

#### A. Press kit (the pitch-able asset bundle)
A single-page press kit (in the doc, plus a linked asset folder) containing:
- **Boilerplate / one-liner — verbatim from copy-pack §7 line 94** (do not rewrite, the line is locked):
  > *Arbor is the calm AI that tells parents what's actually going on with their kid — and refuses to fear-sell. Privacy-first, non-diagnostic, parent-owned. Built to be the developmental operating system for the modern family.*
- **Three pitch angles** (from GTM §7):
  1. **Counter-narrative** — "The calm AI that refuses to fear-sell parents." (the press hook; positions against alarmist parenting content).
  2. **Founder narrative** — Israeli-built, privacy-first, for IL tech/parenting press.
  3. **Visual demo** — the **Arbor Avatar** (privacy-safe stylized child character, just shipped) + the **memory moat** ("it gives you *your kid's* answer, not a generic one") — the demo-able, screenshot-able hooks (GTM §7 line 110; copy-pack §6 hook 6).
- **Fact sheet:** non-diagnostic, expert-reviewed, parent-owned data, COPPA-2026 / GDPR-AVG posture, ages 0-12, markets IL→NL→EN. All claims must be substantiated (no "clinically proven," no diagnosis claims — see operating-rule checks).
- **Press assets:** product screenshots from `PRODUCT.md` (real UI, never a generic AI hero — GTM §2 line 31), the avatar visual, logo/wordmark, founder headshot + bio. List the asset paths; flag any not-yet-produced as a content gap for `mk-p0-7-template-kit`.
- **Approved quotes:** 2-3 founder quotes laddering to the brand platform (calm, high-agency, never fear-selling — GTM §2). Draft them; mark for founder approval (Safety Level 1 draft).

#### B. EN outreach — Product-Hunt-style launch + press + newsletters
- **Product-Hunt-style launch** (GTM §7 line 108): launch-day asset set — tagline (use copy-pack §1 EN headline, test variants), gallery (avatar + answer card + real UI), first comment (founder narrative), maker reply templates. Schedule for an EN-rollout day (Phase 3). All links `utm_source=producthunt&utm_medium=pr&utm_campaign=en_launch`.
- **Parenting newsletters + tech press** (GTM §7): build a target list (10-15 EN outlets/newsletters — parenting, family-tech, AI). Pitch email drafted from the press kit; personalize per outlet. The deliverable is the *method + template + seed list*, not fabricated contacts (carry the verification discipline from `arbor-il-creator-tracker.md` line 6 — do not invent journalist names/emails; provide the sourcing method and a template, flag for a live research pass before send).
- **Podcast spots** (GTM §7 line 108 — "1-2 podcast guest spots"): target 2 parenting/tech podcasts; pitch = founder narrative + demo-able avatar; provide show-note link with `utm_source=<podcast-slug>&utm_medium=pr`.

#### C. IL press (the ignition-market earned media)
- **IL tech + parenting press** (GTM §7 line 108 "Founder narrative for IL tech/parenting press"): HE-language pitch using copy-pack §7 angle, Israeli-built framing. Target list method (same no-fabrication discipline). Links point at the **HE landing path** with `utm_campaign=launch_il`.
- Time IL press to ride the IL ignition wave (Phase 1-2), distinct from the EN Product-Hunt launch (Phase 3) — do not blow the EN launch beat early.

#### D. Attribution & instrumentation (so PR is readable, not faith-based)
PR reuses the shipped funnel — **zero new events, zero app code**:
- **Canonical UTM set (from `mk-p0-5-attribution-utm`, lowercase snake_case — do not deviate):** `utm_medium=pr` (the channel marker for ALL earned media), `utm_source=<outlet-slug>` (e.g. `producthunt`, `techcrunch`, `<podcast-slug>`, `<newsletter-slug>`), `utm_campaign=en_launch` (EN press) or `launch_il` (IL press).
- **Canonical press link (recorded per placement):**
  `https://<canonical-origin>/?utm_source=producthunt&utm_medium=pr&utm_campaign=en_launch`
  where `<canonical-origin>` = the `mk-p0-1-domain` value once verified (e.g. `joinarbor.com`), HE links use the `/il` path. **Do not bake links until `mk-p0-1` resolves the origin** — no `web.app` URL in any press placement (GTM §4 line 60 "No viral asset should ship pointing at a `web.app` URL"). Note this in the runbook so links aren't shipped stale.
- This rides the first-touch, unit-tested `attribution.ts` capture (commit `e09537a`) → global props on every `loopEvents.ts` event → installs/activation per placement readable in the `mk-p0-5` funnel dashboard, sliced by `utm_source` + `utm_medium=pr`. **No new event names** — do not touch `loopEvents.ts` (see conflict notes).
- **OG/Twitter-card verification** (the only HTML touch): confirm both landing files emit `og:title`, `og:description`, `og:image`, `twitter:card=summary_large_image` so press/PH/podcast share-cards unfurl. Fill any missing tag with copy-pack §1 headline + §5 promo + the avatar image. Additive only.

#### E. Launch-day runbook (the operational sequence)
A deterministic checklist: T-7 (assets final, list verified, links baked once `mk-p0-1` resolves), T-1 (founder quotes approved, PH draft staged, embargo confirmed), T-0 (PH live at optimal hour, pitch emails send, founder available for replies), T+1..7 (monitor dashboard by `utm_medium=pr`, respond to coverage, log placements as winning channels). Define the **success read**: installs + activations attributed to `utm_medium=pr` in the `mk-p0-5` dashboard.

#### F. Backlog status update
Flip the P2-5 row note in `marketing/arbor-marketing-backlog.md` to reference the new press-kit doc (append-only; see conflict notes).

### Files to create / edit (exact repo-relative paths)
- **Create:** `PAI/projects/arbor/marketing/arbor-pr-launch-push.md` — the press kit + outreach playbook + launch-day runbook (boilerplate, angles, fact sheet, asset list, quotes, EN/IL outreach method + templates, PH launch kit, UTM convention, runbook). Primary deliverable; avoids touching shared code.
- **Edit (shared, additive/verify-only):** `PAI/projects/arbor/html/arbor-marketing-landing-page-en.html` — verify/fill OG + Twitter-card meta tags only (so press links unfurl). No structural/layout edits.
- **Edit (shared, additive/verify-only):** `PAI/projects/arbor/html/arbor-marketing-landing-page-he.html` — same OG/Twitter-card verify/fill (RTL; HE strings from copy-pack §1/§5). No structural edits.
- **Edit (shared, append-only):** `PAI/projects/arbor/marketing/arbor-marketing-backlog.md` — append a doc link to the P2-5 row's Notes cell only.
- **Edit (this item's declared `sharedFile`, read-not-write):** `PAI/projects/arbor/marketing/arbor-launch-copy-pack.md` — **consume** §7 (PR one-liner), §1 (headlines), §5 (app-store/promo) verbatim; **do not edit** the copy pack (it is owned by `mk-p0-8-copy-pack`; this item only reads it).
- **No app code, no `lib/` edits.**

### Shared-file conflict notes
- **`marketing/arbor-launch-copy-pack.md`** (this item's declared `sharedFile`; touched by `mk-p0-8-copy-pack`, `mk-p1-1-avatar-challenge`, `mk-p2-4-en-launch-appstore`, `mk-p2-5-pr-push`): per the hotspot list, all four are copy missions. **This item READS the copy pack and does not write to it** — the PR one-liner (§7), headlines (§1), and promo (§5) are consumed verbatim into the press kit doc. Zero clobber risk because we never edit the file. If `mk-p0-8` or `mk-p2-4` revise §1/§5/§7 wording, the press kit re-quotes the updated strings — treat the copy pack as source of truth, never fork its strings into the press doc as a divergent copy.
- **`html/arbor-marketing-landing-page-en.html`** (hotspot — touched by `mk-landing-parity-rebuild`, `mk-p0-1-domain`, `mk-p0-5-attribution-utm`, `mk-p2-1-localize-nl`, `p3-ios-grade-audit`): the hotspot note says `mk-landing-parity-rebuild` **REWRITES this file wholesale FIRST**, then `mk-p0-1`/`mk-p0-5`/`mk-p2-1` patch it. This PR item must land **after** the parity rebuild and after `mk-p0-1`/`mk-p0-5` so the OG verification runs against the settled file. Our edit is **additive head-of-document meta only** (OG/Twitter tags) — never body/layout — to minimize merge surface; if the rebuild already added correct OG tags, this item is verify-only and edits nothing.
- **`html/arbor-marketing-landing-page-he.html`** (hotspot — touched by `mk-landing-parity-rebuild`, `mk-p0-1-domain`, `mk-p0-5-attribution-utm`, `mk-p1-4-aeo-seo-he`, `p3-ios-grade-audit`): HE is the reference build for the parity rebuild. Same rule — land after the rebuild + `mk-p0-1`; additive OG/meta only, RTL-safe (meta tags are not direction-sensitive). Coordinate with `mk-p1-4-aeo-seo-he` which also touches head metadata (SEO/AEO) — append OG tags, do not reorder or collide with its canonical/structured-data additions; if both touch `<head>`, merge by section (AEO owns canonical/JSON-LD, PR owns OG/Twitter-card).
- **`marketing/arbor-marketing-backlog.md`**: many marketing missions append status here. **Edit only the P2-5 row's Notes cell** (append doc link); never reorder rows or touch other rows. Merge by appending only.
- **`lib/loopEvents.ts`** (hotspot, canonical event-name contract): **NOT edited here** — PR reads the resulting funnel only, adds zero events. Do not rename or add events; the hotspot note is explicit that event names stay stable once wired by `mk-p0-4`.
- **`lib/attribution.ts`** / **`lib/analytics.ts`**: not edited — consumed as shipped. The `utm_medium=pr` convention must stay byte-identical to `mk-p0-5`'s canonical set.

### Dependencies (other item ids that must land first)
- `mk-p0-1-domain` — canonical brandable origin must be verified before baking any press link (no `web.app` in a press placement; GTM §4). Hard gate.
- `mk-landing-parity-rebuild` — rewrites the EN landing wholesale; OG verification must run against the settled file, not the pre-rebuild one. Hard gate for the EN HTML edit.
- `mk-p0-5-attribution-utm` — the canonical UTM scheme + funnel dashboard the press links plug into and the success read depends on. Hard gate.
- `mk-p0-2-referral-loop` — soft: not required to pitch, but the press push lands best once the activation/reward loop is live so PR-driven installs convert and pay. Sequence after, not blocking the doc.
- **Plan-level gate (not an item id):** GTM §9 phasing places the EN launch push in Phase 3 (Weeks 17-26) **after** the IL loop is proven (K ≥ 0.4, activation ≥ 35%). The IL press sub-track may run earlier (Phase 1-2); the EN Product-Hunt launch waits for the proof gate. Note this sequencing in the runbook.
- Soft prerequisites (already written, not blocking): `mk-p0-7-template-kit` (press visual assets), `mk-p0-8-copy-pack` (the §7 one-liner, ✅ exists).

### Acceptance criteria (testable)
1. `marketing/arbor-pr-launch-push.md` exists with: the **verbatim** copy-pack §7 boilerplate, three pitch angles (counter-narrative / founder / visual-demo per GTM §7), a substantiated fact sheet (non-diagnostic, COPPA/GDPR, ages 0-12), a press-asset list (real-UI screenshots per `PRODUCT.md` + avatar + logo, with gaps flagged), and 2-3 founder quotes marked for approval.
2. The doc contains an **EN outreach kit** (Product-Hunt launch assets + a 10-15-outlet target-list *method* and pitch template — no fabricated contacts), an **IL press kit** (HE angle, IL-press method), and a **2-podcast** pitch + show-note link plan.
3. Every press link uses the canonical UTM set: `utm_medium=pr`, `utm_source=<outlet-slug>`, `utm_campaign∈{en_launch,launch_il}`; and every link's origin is a placeholder/note tied to `mk-p0-1` (no stale `web.app` baked when the domain is pending).
4. A **launch-day runbook** (T-7→T+7) and an explicit success read are defined: installs + activations attributed to `utm_medium=pr` readable in the `mk-p0-5` dashboard, sliced by `utm_source`.
5. Both landing files (`-en`, `-he`) emit valid `og:title`, `og:description`, `og:image`, `twitter:card=summary_large_image` (verified or filled additively, no structural change), so press/PH/podcast share-cards unfurl with the avatar image + copy-pack §1 headline.
6. The backlog P2-5 row links the new press-kit doc (append-only; no other rows touched).
7. **Verified live on dev server:** (a) the OG tags render correctly — load each landing file and confirm the meta tags are present and resolve a valid `og:image`; (b) the PR attribution chain is real — load a running-app URL with a representative press query string `?utm_source=producthunt&utm_medium=pr&utm_campaign=en_launch` and confirm `attribution.ts` `parseAttribution` persists `source=producthunt`, `medium=pr`, `campaign=en_launch` to the `arbor.attribution` localStorage entry (e.g. via the existing `attribution.test.ts` or a dev-server load), proving press installs slice in the funnel. No new app code → no new failing tests.

### Operating-rule checks
- **No dark patterns:** PR pitches the product honestly — no manufactured urgency, no fake scarcity, no incentivized-review schemes on Product Hunt (which violates PH rules and our standards). Newsletter/outlet outreach is opt-in pitching, not list-buying or spam. Founder quotes ladder to "calm, high-agency, never fear-selling" (GTM §2) — the entire angle is *anti*-fear-sell, the opposite of a dark pattern.
- **Privacy / COPPA:** every press asset uses the **privacy-safe stylized avatar** (non-photoreal) and real product UI per `PRODUCT.md`; no child PII, no real child photos in press materials. Fact sheet states the non-diagnostic, parent-owned-data, COPPA-2026/GDPR-AVG posture plainly (GTM risk table line 150). Reject any journalist framing that implies diagnosis or medical claims — substantiation rule: no "clinically proven," no diagnosis language (project CLAUDE.md safety rules).
- **Moat read/write:** the visual-demo angle *is* the memory moat made press-visible — "it gives you *your kid's* answer, not a generic one" (copy-pack §6 hook 6; GTM §7 line 110). PR drives installs that each start a child's longitudinal record (write happens in-product on activation); the PR doc itself reads the loop's funnel (`utm_medium=pr` slice) to measure leverage. No moat data is exposed in any press asset.
- **Ships-visible:** the deliverable is a run-ready press kit + launch-day runbook a founder executes the moment the EN-rollout proof gate clears; success is visible as PR-attributed installs/activations in the live `mk-p0-5` funnel dashboard (sliced `utm_medium=pr`), and as unfurling share-cards on real press/PH/podcast placements — not a buried doc.
