export const meta = {
  name: 'arbor-cap-market',
  description: 'Arbor CIL — the COMPETITOR CAPABILITY + MARKET pass. Runs the two web-research lenses (capability-vs-competitors, market/funnel) — these need no live preview so they cannot hang like the visual lenses. Produces the scored "Capability Backlog vs Competitors" the product has been missing, merged into IMPROVEMENT-BACKLOG.md. No build wave.',
  phases: [
    { title: 'Evaluate', detail: 'capability + market critics benchmark Arbor vs competitors via web research' },
    { title: 'Verify+Merge', detail: 'adversarially verify each claim against a real source, then write the capability backlog' },
  ],
}

const LENSES = [
  { id: 'arbor-critic-capability', lens: 'capability', effort: 'high' },
  { id: 'arbor-critic-market',     lens: 'market',     effort: 'high' },
]

const FINDING = {
  type: 'object',
  required: ['id', 'lens', 'title', 'surface', 'evidence', 'severity', 'userImpact', 'confidence', 'effort', 'ownerPod', 'suggestedFix', 'riskClass'],
  properties: {
    id: { type: 'string' }, lens: { type: 'string' }, title: { type: 'string' }, surface: { type: 'string' },
    evidence: { type: 'string' }, severity: { type: 'integer', minimum: 1, maximum: 5 },
    userImpact: { type: 'integer', minimum: 1, maximum: 5 }, confidence: { type: 'number', minimum: 0, maximum: 1 },
    effort: { type: 'integer', minimum: 1, maximum: 5 }, ownerPod: { type: 'string' },
    suggestedFix: { type: 'string' }, riskClass: { type: 'string', enum: ['safe', 'gated'] },
    competitor: { type: 'string' }, competitorCapability: { type: 'string' }, arborGap: { type: 'string' },
  },
}
const FINDINGS_SCHEMA = { type: 'object', required: ['findings'], properties: { findings: { type: 'array', items: FINDING } } }
const VERDICT_SCHEMA = {
  type: 'object', required: ['id', 'verified', 'reason'],
  properties: { id: { type: 'string' }, verified: { type: 'boolean' }, reason: { type: 'string' }, riskClass: { type: 'string', enum: ['safe', 'gated'] } },
}

phase('Evaluate')
log('Capability + market pass — competitor capability backlog (no preview, hang-proof)')
const panels = await parallel(LENSES.map(c => () =>
  agent(
    `Run your DEEP ${c.lens} lens for Arbor (a longitudinal, parent-owned child-development "OS", live at arborprd-westeu.web.app; source at PPPPtherapy-/PPPPtherapy-/app). Do NOT start a preview — work from web research + reading the source/routes. ` +
    `Benchmark Arbor against its real competitors with CURRENT cited facts: Khan Academy Kids, Lingokids, Lovevery, Kinedu, BabySparks, Duolingo ABC, Good Inside, Nanit, Huckleberry. ` +
    `The user's explicit ask: "we are supposed to have a CLEAR BACKLOG OF CAPABILITIES vs my old competitors, and Arbor must be the BEST tool in the market for a children-development OS." ` +
    `For EACH finding fill competitor + competitorCapability + arborGap, and frame the SMART buildable bet on Arbor's defensible moat (the append-only parent-owned longitudinal child-memory record — the thing no incumbent can copy). Reject any gap that is NOT grounded in a real, current competitor source. Every finding cites its source in evidence. ` +
    `Mark anything touching child-safety, consent, billing, image-gen/model cost, or child-data as riskClass:"gated".`,
    { agentType: c.id, label: `eval:${c.lens}`, phase: 'Evaluate', effort: c.effort, schema: FINDINGS_SCHEMA }
  ).catch(() => ({ findings: [] }))
))
const allFindings = panels.filter(Boolean).flatMap(p => (p.findings || []))
log(`capability+market panel returned ${allFindings.length} raw findings`)

phase('Verify+Merge')
const verified = await pipeline(
  allFindings,
  (f) => agent(
    `Adversarially verify this Arbor capability/market finding — try to DISPROVE it: confirm the competitor actually ships that capability TODAY (open a current source), and confirm Arbor actually lacks it (check the routes/source). Reject vague or stale claims. ` +
    `Force riskClass:"gated" if it touches safety/consent/billing/cost/child-data. Finding:\n${JSON.stringify(f)}`,
    { agentType: 'arbor-evaluator', label: `verify:${f.id || f.lens}`, phase: 'Verify+Merge', schema: VERDICT_SCHEMA }
  ).then(v => ({ ...f, riskClass: (v && v.riskClass) || f.riskClass, verdict: v }))
)
const real = verified.filter(Boolean).filter(f => f.verdict && f.verdict.verified)
log(`${real.length}/${allFindings.length} capability/market findings verified`)

await agent(
  `Editor pass + MERGE into the existing backlog (CRITICS.md §6). READ PAI/projects/parenting-os-plugin/mesh/improvement/IMPROVEMENT-BACKLOG.md and PRESERVE every existing finding. Integrate these newly-verified capability+market findings. ` +
  `Then ADD A NEW TOP-LEVEL SECTION titled "## Capability Backlog vs Competitors (cycle 2026-06-21c)" containing a SCORED TABLE with columns: Score | Capability bet | Competitor(s) who have it | What Arbor lacks today | The SMART bet on the moat | Owner | Effort | Risk. Sort by score desc. Above the table, write a 4-6 line thesis: where Arbor already WINS vs each rival, the 2-3 capabilities that would make it best-in-market, and the one moat-native bet to lead with. ` +
  `Also re-score the combined Open/Gated queues and update the cycle log. WRITE the file + append a one-line cycle entry to mesh/MEMORY.md. Newly-verified findings:\n${JSON.stringify(real)}`,
  { agentType: 'arbor-evaluator', label: 'synthesize+write-capability-backlog', phase: 'Verify+Merge', effort: 'high' }
)

return { lenses: ['capability', 'market'], raw: allFindings.length, verified: real.length }
