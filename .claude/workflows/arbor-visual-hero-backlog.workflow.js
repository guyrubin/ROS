export const meta = {
  name: 'arbor-visual-hero-backlog',
  description: 'Arbor value-led product+visual plan: TWO distinct viral languages (proud-parent + kid-hero, different look/feel), recover defined-but-undelivered capabilities, kid hero-world that drives clinical practice. Value first, plumbing demoted.',
  phases: [
    { title: 'Lenses', detail: '4 value lenses: capability recovery, parent language, kid language, hero-system enabler' },
    { title: 'Synthesize', detail: 'Head-of-Product weaves a value-led, two-language plan with epics→stories' },
    { title: 'Verify', detail: 'Adversarial: value-led not plumbing? two-language respected? code-grounded?' },
  ],
}

const CTX = `
ARBOR — context (you are a fresh agent; read fully). Arbor is a parent-mediated, evidence-grounded developmental OS for raising a kid (0-12). NOT a kid-facing companion. Prod: https://arborprd-westeu.web.app. Markets: Israel (Hebrew/RTL flagship, live) + Netherlands. The moat = an append-only, parent-owned longitudinal child-memory record that every feature reads/writes.
APP + SPECS (read-only): code at C:\\Users\\dguyr\\ROS\\.arbor-build\\app ; product docs/PRDs/backlogs at C:\\Users\\dguyr\\ROS\\PAI\\projects\\parenting-os-plugin (many arbor-*.md, PRDs/, mesh/, EXECUTION-BACKLOG.md, PRODUCT.md, html prototypes).

THE FOUNDER'S BRIEF (read literally — two prior plans were rejected; here is the corrected intent):
- "It needs to be viral for the PARENTS, and viral for the KIDS." Build TWO DISTINCT VIRAL DESIGN LANGUAGES with DIFFERENT look and feel — one for parent surfaces, one for kid surfaces. Both must be premium and independently shareable/viral. Do NOT collapse them into "one richness, tone-only difference" — that was an explicitly rejected mistake. They are two genuinely different aesthetics, both excellent.
- LEAD WITH REAL VALUE, NOT PLUMBING. The rejected plans drifted into file paths, cache byte-budgets, lint gates, "author N prompts". That is NOT the plan. The plan is about the EXPERIENCES and the VALUE they deliver. Engineering mechanics are enabler footnotes, never the headline.
- PARENT VALUE = "all of it, AND MORE — we are MISSING capabilities we already DEFINED and DEVELOPED." This is the #1 signal: Arbor has built or specced more than it surfaces. The proud-growth shareable artifact (milestone hero cards, "The Story of [Child]"), cited/trustworthy guidance made visual, and the development dashboard as something parents are proud to screenshot — AND the buried capabilities that don't currently deliver value.
- KID VALUE = "a hero world that drives practice." A cinematic "you ARE the superhero" world the kid wants to return to and show friends — engineered so the engagement pulls them through speech / emotion / comprehension reps. Virality SERVES the clinical effect.
- The child-as-hero visual system (the child's own avatar composited into rich illustrated scenes — the logic Codex proved in the kid environment) is the CONNECTIVE TISSUE between the two languages, not the headline.
- Stand up CONTINUOUS LOOPS to keep improving capability + design.

GROUND TRUTH (verified — use to stay honest, do not make these the headline):
- The hero-in-scene ENGINE EXISTS but is effectively DEAD on the kid side: HeroScenePlayer composites the avatar into a generated scene server-side (/api/generate-scene, /generate-comic) and caches it (lib/sceneCache, memory-only), BUT heroJourneys.ts beats carry no imagePrompt data, so the gen guard never fires and every beat falls back to geometric SVG / emoji. So "the hero system" is largely a DELIVERY problem, not a build problem.
- The image-gen COST CAP is ALREADY SHIPPED (server/imageQuota.ts: per-user daily cap + global breaker, emits X-Image-Quota-* headers). Do not propose building it.
- EMOJI is the visible default across kid surfaces (HeroJourneyTab STORY_ART, HeroComicsTab STORY_EMOJI, playContent.ts EMOTIONS faces + memory decks, AdventuresTab tiles, MimicStudioTab icons) — but this is a symptom of the dead delivery, not the root problem.
- The MOAT IS COMPUTED BUT NOT DELIVERED (the CIL's own finding): jitai.ts computes the best nudges but only in a render-time useMemo (no FCM push); monitoring.ts computes domain WatchLevel signals but they only show on a Screening nav (no proactive "Arbor Noticed" surface); DevScore + longitudinal record exist but read like a settings list, not a narrated story; coach answers are grounded server-side (sourceCardsUsed) but citations are invisible in the UI; no multi-child/family glance. HeroAvatar IS already wired into Today/Profile/DevScore/Milestones/Plans/Reports PDF.
- Brand tokens (index.css): clay green #34b277, pack colors (courage #e2562d, growth #6f9e6f, wisdom #68b4ff, responsibility #d7aa55, truth #4f6ae6), Fraunces (display) + Nunito/Heebo/Frank Ruhl Libre. A .arbor-play scope is the kid-playful layer.

PRIOR BACKLOGS (cross-reference, don't dup): D3 avatar first-run, D4 auto-gen scene, D5 adventures imagery, D6 branded fallback; V0 second-guardian invite, V1 milestone share card, V3 safe hero artifact; C4 comic studio; T4 narrativized memory moat; PC6 hero in practice, PC7 surface coach citations; the CIL capability items (push, proactive alerts, multi-child). GATES: G2 = cite mechanism, never put a clinical effect-size / "proven/validated" in user copy. Child's real face NEVER in a share payload (stylized avatar only). AADC: no guilt/streak-loss mechanics.

YOUR JOB: deliver your assigned lens as rich, value-led markdown an exec would act on. Name things. Be specific to Arbor's real product. Lead with the experience and the value; mention code only as evidence or enabler, never as the point.
`

const LENSES = [
  {
    key: 'cap-recovery',
    label: 'L1 capability-recovery',
    brief: `LENS 1 — CAPABILITY RECOVERY (the founder's #1 signal: "we are missing capabilities we already defined and developed").
Inventory what Arbor has BUILT or SPECCED but does NOT currently deliver as value to the user. Read the code AND the many product docs/PRDs/backlogs under the project dir. For each recovered capability return:
- WHAT it is (the user-facing value, in one line).
- EVIDENCE it was defined/developed (cite the doc or the code — e.g. monitoring.ts computes WatchLevels; jitai.ts computes nudges; the narrativized-moat T4 spec; coach sourceCardsUsed; the hero engine; PlayKit; Academy masterclasses; avatar/cosmetics/comic studio; multi-child).
- WHY it's not delivering today (buried on a nav-only tab? computed in a useMemo with no delivery channel? built but no data feeding it? invisible in the UI?).
- THE VALUE when surfaced, and whether it belongs to the PARENT language, the KID language, or both.
- A rough value×virality weight (high/med/low) and effort (S/M/L).
Prioritize the highest-value recoveries. This is the spine of the parent side. Be honest and concrete; this is an audit, not a wish-list.`,
  },
  {
    key: 'parent-language',
    label: 'L2 parent-viral-language',
    brief: `LENS 2 — THE PARENT VIRAL LANGUAGE (its OWN distinct aesthetic — NOT the kid look, NOT "calm/flat").
Define the parent-facing design language as a real, named identity that is sophisticated, emotionally resonant, and built to be SHARED by a proud parent. Cover:
- NAME + look/feel: palette, type, imagery treatment, motion, composition — a distinct language from the kid world (think: the proud, beautiful, grown-up artifact of a child's growth a parent posts to WhatsApp/Instagram). Ground it in Arbor's brand tokens but make it its own thing.
- THE VALUE EXPERIENCES it powers: the proud-growth shareable artifact (milestone hero cards, "The Story of [Child]" narrativized moat), cited/trustworthy guidance made visual (surface the coach citations), the development dashboard (My Child / DevScore / milestones) as a proud-to-screenshot surface, the proactive "Arbor Noticed" moment.
- THE VIRAL LOOP: what exactly the parent shares + the second-guardian/co-parent invite as a beautiful artifact (V0/V1). Child's real face never in the payload — stylized hero only.
- How this language stays clinically trustworthy (G2) while being beautiful and shareable.
Make it concrete enough that a designer + PM could build it. Distinct from the kid language.`,
  },
  {
    key: 'kid-language',
    label: 'L3 kid-hero-world',
    brief: `LENS 3 — THE KID VIRAL HERO-WORLD (its OWN distinct aesthetic — a cinematic "you are the superhero" world).
Define the kid-facing design language + experience whose virality SERVES the clinical effect ("a hero world that drives practice"). Cover:
- NAME + look/feel: the kid world's distinct aesthetic — cinematic, animated, playful, the child rendered as the hero of their own comic/adventure. Different look and feel from the parent language. Use the .arbor-play layer + brand tokens as a base but elevate to a multimillion-dollar bar.
- THE COME-BACK + SHOW-FRIENDS LOOP: what makes the kid want to return tomorrow and show friends (be the hero, progression, hero customization/cosmetics, create-and-show-off their own comic) — AADC-clean (no guilt/streak-loss).
- HOW ENGAGEMENT DRIVES CLINICAL REPS: tie the hero world to the actual developmental practice — speech/phoneme (Mimic, Practice), emotion recognition (Feelings), comprehension/sequencing (Adventures, Hero Journey). The kid plays in the hero world; the play IS the therapeutic dose. Name the mechanism (ASHA/Meltzoff/Mayer style — mechanism only, G2, no effect-size in copy).
- The honest enabler note: the hero-scene engine exists but is dead (no imagePrompt data) — turning it on is the unlock, but frame it as the means to the hero-world value, not the headline.
Make it vivid and buildable. Distinct from the parent language.`,
  },
  {
    key: 'hero-system',
    label: 'L4 hero-system-connective',
    brief: `LENS 4 — THE CHILD-AS-HERO SYSTEM AS CONNECTIVE TISSUE (the enabler that threads both languages; keep it lean, NOT the headline).
Specify the shared visual system that lets the child appear as the hero across BOTH languages while each keeps its own look:
- The reusable hero primitive (a <HeroScene>-style contract) that renders the child's avatar composited into a scene, but PARAMETERIZED so the parent language and the kid language each apply their own aesthetic to it — one engine, two languages.
- The honest state: engine built (HeroScenePlayer, generate-scene/comic, sceneCache memory-only) but dead because heroJourneys.ts has no imagePrompt data; the cost cap is already shipped (imageQuota.ts). So the work is delivery + art-direction, not new infra.
- The premium model strategy in ONE short paragraph: Gemini 2.5 Flash Image (wired) for avatars/backgrounds, Flux Kontext for character-into-scene compositing consistency, Imagen for premium share covers — keep concise, behind flags, paid-spend gated.
- The branded fallback that replaces the geometric SVG so a surface is never abstract shapes or bare emoji.
- The continuous visual-quality loop in 3-4 lines: a CI check that flags emoji-as-primary regression + an art-direction critic in the existing CIL, so quality keeps rising and never regresses.
Keep this lens tight — it serves the two languages above; it is not the product vision itself.`,
  },
]

phase('Lenses')
const lensOut = (await parallel(
  LENSES.map((l) => () =>
    agent(`${CTX}\n\n=== YOUR ASSIGNED LENS ===\n${l.brief}\n\nReturn rich, value-led markdown. Name things. Be specific to Arbor's real product. This feeds a founder-facing plan.`,
      { label: l.label, phase: 'Lenses', model: 'sonnet' })
      .then((md) => (md ? { key: l.key, label: l.label, md } : null))
  )
)).filter(Boolean)

phase('Synthesize')
const lensBlock = lensOut.map((l) => `\n\n========== LENS: ${l.label} ==========\n${l.md}`).join('')
const plan = await agent(
  `${CTX}

=== YOUR ROLE ===
You are Arbor's Head of Product. Weave the four lens outputs below into ONE founder-facing plan that is VALUE-LED and built on TWO DISTINCT VIRAL LANGUAGES. The prior two attempts were rejected for (a) collapsing the parent/kid looks into "one richness" and (b) leading with plumbing. Do not repeat either mistake.

=== THE FOUR LENSES ===${lensBlock}

=== THE PLAN TO WRITE (a single Markdown doc) ===
1. "## 0. The bet" — one dense paragraph: Arbor already built more than it shows; the play is to recover that value and deliver it through two distinct viral languages — a proud-parent language and a kid-hero world — each independently shareable, with the child-as-hero system as connective tissue. Viral for parents, viral for kids, clinically effective. Value first; no file paths here.
2. "## 1. The two languages" — the heart. TWO subsections, each a real named design language with its own look/feel, its viral loop, and the value it delivers: §1A Parent language, §1B Kid hero-world. Make the difference between them vivid and intentional. State explicitly they are two aesthetics, not one.
3. "## 2. Recover the value we already built" — the capability-recovery inventory as a prioritized table: capability · evidence it exists · why it's not delivering today · the value when surfaced · which language · weight · effort. This is the founder's #1 ask — lead the epics from here.
4. "## 3. Epics & stories" — group epics under PARENT LANGUAGE / KID HERO-WORLD / CONNECTIVE HERO SYSTEM. Each story leads with the user value and the experience; put any engineering mechanic in a terse "enabler:" clause at the end, never as the headline. Table: ID · value/experience · enabler (brief) · effort · parent/kid · viral×value · relates-to-prior-ID.
5. "## 4. Ranking" — rank by (value × virality ÷ effort), present a "first to build" shortlist. Favor high-value recoveries and the two-language wins over mechanics.
6. "## 5. 30/60/90" — sequence so the live app delivers visible parent-value AND kid-value fast; gated items (child-data/consent/cost/billing/paid-spend) flagged to Guy, never auto-shipped.
7. "## 6. Continuous loop" — 6-8 lines: how the visual + capability quality keeps improving via the existing CIL. Brief.
8. "## 7. Decisions for Guy" — the few real calls (premium model+budget, the two language names, which recoveries lead, rollout posture).

RULES: Value and experience lead every section; engineering is a footnote. Honor the two-distinct-languages model. G2 (mechanism cited, no effect-size in user copy). Child's-face-never-shared. De-slop: dense, accurate, executive, each section ends actionable. Output ONLY the markdown.`,
  { label: 'synthesis:head-of-product', phase: 'Synthesize', model: 'opus', effort: 'high' }
)

phase('Verify')
const VERIFY_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  properties: {
    issues: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        properties: {
          severity: { type: 'string', enum: ['high', 'medium', 'low'] },
          where: { type: 'string' },
          problem: { type: 'string' },
          fix: { type: 'string' },
        },
        required: ['severity', 'where', 'problem', 'fix'],
      },
    },
    verdict: { type: 'string' },
  },
  required: ['issues', 'verdict'],
}
const verify = await agent(
  `${CTX}

=== YOUR ROLE ===
Adversarial reviewer of the plan below. Check FOUR things hard:
1. TWO-LANGUAGE INTEGRITY: does it genuinely define two DISTINCT viral aesthetics (parent vs kid), or does it secretly collapse them into one look? The founder rejected "one richness." Flag any collapse.
2. VALUE-LED, NOT PLUMBING: does every section lead with user value/experience, with engineering demoted to enabler clauses? Flag anything where file paths / cache mechanics / lint gates are the headline.
3. CAPABILITY-RECOVERY ACCURACY: spot-check the "already built" claims against the real code/docs under .arbor-build/app + the project dir. Is anything claimed as built-but-buried actually NOT built (so it's net-new, not a recovery)? Is anything claimed net-new actually already shipped (e.g. the cost cap in imageQuota.ts; HeroAvatar already in Today/Profile/Reports)?
4. GATES: any user-facing clinical effect-size claim (G2)? Any story putting the child's real face in a share payload? Any AADC guilt/streak mechanic?
Return a terse punch-list of concrete issues + fixes and a one-line verdict.

=== THE PLAN ===
${plan}`,
  { label: 'verify:adversarial', phase: 'Verify', model: 'opus', effort: 'high', schema: VERIFY_SCHEMA }
)

return { plan, verify, lensCount: lensOut.length }
