export const meta = {
  name: 'arbor-marketing-loop',
  description: 'Arbor Marketing Mesh autonomous viral loop — INTEL (arbor-insights trend + competitor radar) → SENSE (market + capability critics) → FRAME the one MARKETING-BACKLOG against BRAND-STRATEGY → BUILD top safe materials (content/creative/seo/acquisition) to the brand spine → VERIFY (arbor-brand ECD essence+craft gate, then arbor-safety) → DISTRIBUTE (publish to owned queue / draft creator+group seeding, gated) → LEARN. Full-autonomy-with-publish: paid spend, clinical claims, child-data, domain/store, and outbound to people (DMs/email/external-community seeding) stay gated; the ECD vetoes anything generic.',
  phases: [
    { title: 'Intel', detail: 'arbor-insights trend radar + competitor scan → viral opportunities + feature-requests' },
    { title: 'Sense', detail: 'market + capability critics audit the live funnel and benchmark competitors' },
    { title: 'Frame', detail: 'lead dedupes + scores into MARKETING-BACKLOG, splits marketing vs feature-requests' },
    { title: 'Build', detail: 'pods (content/creative/seo/acquisition) produce the top safe materials, each green + previewable' },
    { title: 'Verify+Ship', detail: 'brand-review + arbor-safety gate; publish safe / hold gated' },
    { title: 'Distribute', detail: 'arbor-distribution drafts owned-queue posts + creator/group seeding (gated); write backlog + memory' },
  ],
}

const BACKLOG = 'PAI/projects/arbor/mesh/marketing/MARKETING-BACKLOG.md'
const MESH = 'PAI/projects/arbor/mesh/marketing/MESH.md'
const OPMODEL = 'PAI/projects/arbor/mesh/marketing/OPERATING-MODEL.md'
const BRAND = 'PAI/projects/arbor/mesh/marketing/BRAND-STRATEGY.md'

// ---- schemas -------------------------------------------------------------
const FINDING = {
  type: 'object',
  required: ['id', 'lens', 'title', 'surface', 'evidence', 'severity', 'userImpact', 'confidence', 'effort', 'ownerPod', 'suggestedFix', 'riskClass'],
  properties: {
    id: { type: 'string' }, lens: { type: 'string' }, title: { type: 'string' }, surface: { type: 'string' },
    evidence: { type: 'string' }, severity: { type: 'integer', minimum: 1, maximum: 5 },
    userImpact: { type: 'integer', minimum: 1, maximum: 5 }, confidence: { type: 'number', minimum: 0, maximum: 1 },
    effort: { type: 'integer', minimum: 1, maximum: 5 }, ownerPod: { type: 'string' },
    suggestedFix: { type: 'string' }, riskClass: { type: 'string', enum: ['safe', 'gated'] },
    kind: { type: 'string', enum: ['marketing', 'feature-request'] },
    competitor: { type: 'string' }, competitorCapability: { type: 'string' }, arborGap: { type: 'string' },
  },
}
const FINDINGS_SCHEMA = { type: 'object', required: ['findings'], properties: { findings: { type: 'array', items: FINDING } } }
const FRAME_SCHEMA = {
  type: 'object',
  required: ['buildTasks', 'featureRequests', 'gated'],
  properties: {
    buildTasks: { type: 'array', items: { type: 'object', required: ['id', 'ownerPod', 'brief'], properties: {
      id: { type: 'string' }, ownerPod: { type: 'string', enum: ['arbor-content', 'arbor-creative', 'arbor-seo', 'arbor-acquisition'] }, brief: { type: 'string' } } } },
    featureRequests: { type: 'array', items: { type: 'string' } },
    gated: { type: 'array', items: { type: 'string' } },
  },
}
const GATE_SCHEMA = {
  type: 'object', required: ['id', 'passed', 'reason', 'publishable'],
  properties: { id: { type: 'string' }, passed: { type: 'boolean' }, reason: { type: 'string' },
    publishable: { type: 'boolean' }, surface: { type: 'string' } },
}

const COMPETITORS = 'Kinedu, Lovevery, Huckleberry, Khan Academy Kids, Lingokids, Good Inside, Nanit, BabySparks, Duolingo ABC'
const APP = 'Arbor — a longitudinal, parent-owned child-development OS, live at arborprd-westeu.web.app; source at PPPPtherapy-/PPPPtherapy-/app; marketing surface at app/landing/*.html + app/public/marketing/'

// ---- INTEL ---------------------------------------------------------------
phase('Intel')
log('Arbor Marketing loop — outside-in viral + competitor radar (arbor-insights)')
const intel = await agent(
  `You are arbor-insights, the Arbor Marketing Mesh's outside-in intelligence pod. Run a trend + competitor radar for ${APP}. No live preview — work from web research + reading the source/landing files. ` +
  `Produce VIRAL OPPORTUNITY findings (kind:"marketing"): rising IL-parent sounds/hooks/formats scored by growth-stage (not raw volume) within the ~48h window, high-velocity micro-creators (10-25K) to seed, and FB-group pain-clusters to turn into hooks — each a concrete, buildable creative/distribution brief with the owning pod (arbor-creative / arbor-content / arbor-distribution) named in suggestedFix. ` +
  `ALSO produce competitor feature-gap findings (kind:"feature-request") vs ${COMPETITORS}: fill competitor + competitorCapability + arborGap, framed on Arbor's append-only parent-owned longitudinal child-memory moat. ` +
  `Every finding cites its source in evidence; mark child-safety/consent/billing/child-data/paid-spend/domain/store as riskClass:"gated". Be honest about thin/under-sourced signal (IL WhatsApp/FB seeding + HE-RTL listening is under-sourced — flag inferred items).`,
  { agentType: 'arbor-insights', label: 'intel:trend+competitor', phase: 'Intel', effort: 'high', schema: FINDINGS_SCHEMA }
).catch(() => ({ findings: [] }))
log(`intel returned ${(intel.findings || []).length} viral/competitor findings`)

// ---- SENSE ---------------------------------------------------------------
phase('Sense')
log('Arbor Marketing loop — sensing the funnel + competitors (hang-proof: no live preview required)')
const LENSES = [
  { id: 'arbor-critic-market', lens: 'market', effort: 'high' },
  { id: 'arbor-critic-capability', lens: 'capability', effort: 'high' },
]
const panels = await parallel(LENSES.map(c => () =>
  agent(
    `Run your DEEP ${c.lens} lens for ${APP}. Do NOT start a preview — work from web research + reading the source/routes/landing files. ` +
    `Benchmark against real competitors with CURRENT cited facts: ${COMPETITORS}. ` +
    (c.lens === 'market'
      ? `Audit the owned marketing surface EN+HE: landing/OG/hreflang/schema/sitemap, conversion friction, activation drop-off, SEO/AEO gaps, viral-loop wiring, positioning vs the GTM plan. Set kind:"marketing" on every finding. `
      : `Find capabilities a competitor ships TODAY that Arbor lacks; fill competitor + competitorCapability + arborGap; frame the SMART bet on Arbor's moat (append-only parent-owned longitudinal child-memory record). Set kind:"feature-request" on every finding. `) +
    `Every finding cites its source in evidence. Mark anything touching child-safety, consent, billing, image/model cost, child-data, paid spend, brand-domain, or store as riskClass:"gated".`,
    { agentType: c.id, label: `sense:${c.lens}`, phase: 'Sense', effort: c.effort, schema: FINDINGS_SCHEMA }
  ).catch(() => ({ findings: [] }))
))
const findings = [...(intel.findings || []), ...panels.filter(Boolean).flatMap(p => (p.findings || []))]
log(`intel + sense returned ${findings.length} raw findings total`)

// ---- FRAME ---------------------------------------------------------------
phase('Frame')
const frame = await agent(
  `You are arbor-marketing-lead. READ ${BRAND} (the brand spine — frame everything against the essence, the category, and the six-surfaces-on-one-record convergence), ${MESH}, ${OPMODEL}, and ${BACKLOG}. ` +
  `Dedupe these raw findings against the existing backlog, score each (severity × userImpact × confidence ÷ effort), and triage:\n` +
  `- buildTasks: the top SAFE (riskClass:"safe", kind:"marketing") items to build THIS cycle — assign each to arbor-content (copy/HE) / arbor-creative (short-form video/motion/design + hook batches) / arbor-seo (technical/AEO) / arbor-acquisition (loop/attribution spec) with a tight brief. Cap at 5.\n` +
  `- featureRequests: ids of kind:"feature-request" items — these are HANDED to the product backlog, not built here.\n` +
  `- gated: ids of riskClass:"gated" items — surfaced for human approval, never auto-built.\n` +
  `Then WRITE the merged, re-scored backlog to ${BACKLOG} (preserve every existing item; mark shipped ones; add new ones). Raw findings:\n${JSON.stringify(findings)}`,
  { agentType: 'arbor-marketing-lead', label: 'frame+write-backlog', phase: 'Frame', effort: 'high', schema: FRAME_SCHEMA }
).catch(() => ({ buildTasks: [], featureRequests: [], gated: [] }))
log(`frame: ${frame.buildTasks.length} build tasks · ${frame.featureRequests.length} feature-requests → product · ${frame.gated.length} gated`)

// ---- BUILD → VERIFY+SHIP (pipeline: each task builds then gates as soon as it's ready) ----
phase('Build')
const shipped = await pipeline(
  frame.buildTasks.slice(0, 5),
  // 1. BUILD — pod produces the material against the brand spine
  (t) => agent(
    `You are ${t.ownerPod} in the Arbor Marketing Mesh. READ ${BRAND} first. Produce this marketing material to a green, previewable state that is unmistakably Arbor (EN+HE where copy): essence-true (the steady hand that remembers your child), category-defining (Longitudinal Child Intelligence, not "a parenting app"), names the enemy, makes the six-surfaces-on-one-record convergence land. Calm clinician-mentor voice, banned-word list is law, one clear CTA, claims mechanism-cited, no clinical/effect-size claim, no child-data payload. Brief: ${t.brief}. Return what you produced + the file/surface path.`,
    { agentType: t.ownerPod, label: `build:${t.id}`, phase: 'Build' }
  ).then(work => ({ task: t, work })),
  // 2. ECD CRAFT GATE — arbor-brand judges against the Arbor Bar (veto on generic)
  (built) => agent(
    `You are arbor-brand (ECD). READ ${BRAND}. Judge this asset against the Arbor Bar (§10) — all 8 category + craft tests. VETO anything generic, off-essence, fear-selling, or category-following (set passed=false with the specific rewrite that would pass). passed=true only if it survives the one-word-swap test and is unmistakably Arbor. Material:\n${JSON.stringify(built.work).slice(0, 4000)}\nTask: ${JSON.stringify(built.task)}`,
    { agentType: 'arbor-brand', label: `ecd-gate:${built.task.id}`, phase: 'Verify+Ship', effort: 'medium', schema: GATE_SCHEMA }
  ).then(brand => ({ ...built, brand })),
  // 3. SAFETY/COMPLIANCE GATE — arbor-safety holds the clinical + publish-surface veto
  (g) => agent(
    `You are arbor-safety. Adversarially check this asset: NO clinical/diagnostic/effect-size claim (G2), claims mechanism-cited, loop-math honest (G1), NO real child face/voice/data, NO paid-spend or domain/store action. ` +
    `Set passed=true only if it clears AND the ECD already passed it (ecdPassed=${g.brand && g.brand.passed}). Set publishable=true only if it targets an OWNED ORGANIC SURFACE (landing/SEO/blog/organic-social/asset library) — false if it implies paid spend, user-list email, product code, or anything gated. Material:\n${JSON.stringify(g.work).slice(0, 3000)}\nTask: ${JSON.stringify(g.task)}`,
    { agentType: 'arbor-safety', label: `safety-gate:${g.task.id}`, phase: 'Verify+Ship', schema: GATE_SCHEMA }
  ).then(v => ({ id: g.task.id, ownerPod: g.task.ownerPod, brand: g.brand, gate: v }))
)
const passed = shipped.filter(Boolean).filter(s => s.brand && s.brand.passed && s.gate && s.gate.passed)
const published = passed.filter(s => s.gate.publishable)
const held = passed.filter(s => !s.gate.publishable)
const vetoed = shipped.filter(Boolean).filter(s => !(s.brand && s.brand.passed))
log(`gate: ${passed.length}/${frame.buildTasks.length} passed both gates · ${published.length} publishable (auto-ship) · ${held.length} held · ${vetoed.length} ECD-vetoed (generic/off-essence)`)

// ---- DISTRIBUTE ----------------------------------------------------------
phase('Distribute')
let distribution = 'no publishable assets this cycle'
if (published.length) {
  distribution = await agent(
    `You are arbor-distribution. For these gate-passed assets, build the distribution plan: (a) schedule them to Arbor's OWNED-channel queue (IG/TikTok/YouTube/FB) at platform-native times — this is T2, autonomous; and (b) DRAFT (never send) the creator-pack outreach + WhatsApp class-group / IL FB parent-mega-group seed posts (native Hebrew, organic, not copy-pasted) + any UGC-challenge activation copy. ` +
    `Outbound to real people / external communities is T3 — produce them as a ready-to-approve roll-up with the gate level marked, NOT executed. No paid creator fees (L4). No real child face/voice/data. Return: the owned-queue schedule + the drafted (gated) seeding/creator roll-up. Assets: ${JSON.stringify(published).slice(0, 4000)}`,
    { agentType: 'arbor-distribution', label: 'distribute:queue+seed-drafts', phase: 'Distribute', effort: 'medium' }
  ).catch(() => 'distribution step failed; assets remain queued for next cycle')
}
log('distribution plan drafted (owned-queue scheduled; creator/group seeds drafted + gated)')

// ---- LEARN ---------------------------------------------------------------
await agent(
  `You are arbor-marketing-lead closing the cycle. Update ${BACKLOG}: mark the published items shipped, keep held/gated items open with their reason, fold the new viral/intel opportunities into §8 (Viral Production & Distribution Engine), and ensure feature-requests are noted as handed to the product backlog (PRODUCT-BACKLOG.md / mesh/improvement/IMPROVEMENT-BACKLOG.md). ` +
  `Then append ONE dated cycle line to /PAI/MEMORY.md summarizing: findings sensed, items published to owned organic surfaces, the drafted-and-gated creator/community seeding roll-up, feature-requests handed to product, and anything held for Guy's approval (with amounts/risk if T3). Be terse and accurate. ` +
  `Cycle data: published=${JSON.stringify(published)} held=${JSON.stringify(held)} distribution=${JSON.stringify(distribution).slice(0, 2000)} featureRequests=${JSON.stringify(frame.featureRequests)} gated=${JSON.stringify(frame.gated)}`,
  { agentType: 'arbor-marketing-lead', label: 'learn+memory', phase: 'Distribute', effort: 'medium' }
)

return {
  sensed: findings.length,
  intelFindings: (intel.findings || []).length,
  buildTasks: frame.buildTasks.length,
  published: published.map(s => s.id),
  heldForApproval: held.map(s => s.id),
  distributionDrafted: published.length > 0,
  featureRequestsToProduct: frame.featureRequests,
  gated: frame.gated,
}
