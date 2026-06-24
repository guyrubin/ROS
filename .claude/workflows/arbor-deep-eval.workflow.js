export const meta = {
  name: 'arbor-deep-eval',
  description: 'Arbor CIL — the DEEP-lens completion pass. Runs the four high-effort critics that the nightly cheap panel skips (IA, visual/UX, capability-vs-competitors, market/funnel) against the live RENDERED app, adversarially verifies each finding, and MERGES them into the existing IMPROVEMENT-BACKLOG so the cycle is a true full-panel. No build wave — produces the complete scored backlog + an honest full-panel State of the App.',
  phases: [
    { title: 'Evaluate', detail: 'IA + UX + capability + market critics inspect the live rendered app in parallel' },
    { title: 'Verify+Merge', detail: 'adversarially verify each finding, then merge into the existing backlog' },
  ],
}

// ── lenses (the DEEP four the cheap nightly panel omits) ─────────────────────
const DEEP = [
  { id: 'arbor-critic-ia',         lens: 'ia',         effort: 'high' }, // runs the app: nav coherence, orphans, dead-ends, missing states, "not teleconnected"
  { id: 'arbor-critic-ux',         lens: 'ux',         effort: 'high' }, // rendered pixels: hierarchy, type/spacing/color, motion, a11y, "looks like a beta"
  { id: 'arbor-critic-capability', lens: 'capability', effort: 'high' }, // gaps vs Khan Kids/Lingokids/Lovevery/Kinedu, fused with market evidence into SMART bets
  { id: 'arbor-critic-market',     lens: 'market',     effort: 'high' }, // landing/activation/SEO/AEO/growth-loop/positioning vs GTM
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
  },
}
const FINDINGS_SCHEMA = { type: 'object', required: ['findings'], properties: { findings: { type: 'array', items: FINDING } } }
const VERDICT_SCHEMA = {
  type: 'object', required: ['id', 'verified', 'reason'],
  properties: { id: { type: 'string' }, verified: { type: 'boolean' }, reason: { type: 'string' }, riskClass: { type: 'string', enum: ['safe', 'gated'] } },
}

// ── EVALUATE ─────────────────────────────────────────────────────────────────
phase('Evaluate')
log('Deep-lens completion pass — IA · UX · capability · market on the live rendered app')
const panels = await parallel(DEEP.map(c => () =>
  agent(
    `Run your DEEP evaluation lens against the live Arbor app (PPPPtherapy-/PPPPtherapy-/app) — full deep pass, NOT diff-scoped. ` +
    `Visual/structural lenses (ia, ux): START THE PREVIEW (npm --prefix PPPPtherapy-/PPPPtherapy-/app run dev, port 3000) and judge the RENDERED screen — screenshots at mobile AND desktop, EN AND Hebrew/RTL. Do NOT infer UI quality from source code. ` +
    `capability + market: research CURRENT competitor facts (Khan Academy Kids, Lingokids, Lovevery, Kinedu, Duolingo ABC, Good Inside, Nanit) via web and frame every gap on Arbor's longitudinal parent-owned-memory moat with a cited source. ` +
    `The user's stated pain: "the app looks like a BETA, features are not precise, the system is not teleconnected (interconnected), and we lack a clear capability backlog vs competitors." Hunt root causes against that bar — benchmark vs world-class, not nits. ` +
    `Every finding carries concrete evidence (screenshot observation, file:line, quoted route, or cited competitor source). ` +
    `Mark anything touching child-safety, consent, billing, image-gen/model cost, or child-data as riskClass:"gated".`,
    { agentType: c.id, label: `eval:${c.lens}`, phase: 'Evaluate', effort: c.effort, schema: FINDINGS_SCHEMA }
  ).catch(() => ({ findings: [] }))
))
const allFindings = panels.filter(Boolean).flatMap(p => (p.findings || []))
log(`deep panel returned ${allFindings.length} raw findings`)

// ── VERIFY + MERGE ───────────────────────────────────────────────────────────
phase('Verify+Merge')
const verified = await pipeline(
  allFindings,
  (f) => agent(
    `Adversarially verify this Arbor deep-lens finding is REAL and correctly scored — try to DISPROVE it: open the route/file, re-check the rendered screen, or confirm the competitor claim against a real current source. Reject vague taste-only claims with no concrete evidence. ` +
    `Force riskClass:"gated" if it touches safety/consent/billing/cost/child-data. Finding:\n${JSON.stringify(f)}`,
    { agentType: 'arbor-evaluator', label: `verify:${f.id || f.lens}`, phase: 'Verify+Merge', schema: VERDICT_SCHEMA }
  ).then(v => ({ ...f, riskClass: (v && v.riskClass) || f.riskClass, verdict: v }))
)
const real = verified.filter(Boolean).filter(f => f.verdict && f.verdict.verified)
log(`${real.length}/${allFindings.length} deep findings verified`)

await agent(
  `Editor pass + MERGE into the existing backlog (CRITICS.md §6). The cheap lenses (bugs/language/feedback/safety) already ran this cycle and their findings are in PAI/projects/arbor/mesh/improvement/IMPROVEMENT-BACKLOG.md — READ it first and PRESERVE every existing finding. ` +
  `Now integrate these newly-verified DEEP findings (IA/UX/capability/market): (1) dedupe vs existing + each other (merge same surface+fix, keep highest score). (2) Re-score and re-rank the WHOLE combined queue with (severity×userImpact×confidence)÷effort×4. (3) SYNTHESIZE across the FULL panel now: update the "State of the app" to be an HONEST full-panel narrative (it currently wrongly says "full panel" while only covering bugs/language/safety — fix that), roll the visual/IA nits into root-cause THEMES (e.g. "no type scale", "orphaned surfaces"), and fuse capability×market into 1-2 SMART feature theses framed as a CAPABILITY BACKLOG VS COMPETITORS (name the competitor and the gap). (4) Keep the top ~12 safe items + top themes + feature theses; cap noise. (5) REWRITE IMPROVEMENT-BACKLOG.md as a clean true-full-panel cycle (mark this CYCLE 2026-06-21b — deep-lens completion), add a cycle-log row, and record the cycle in mesh/MEMORY.md. ` +
  `Newly-verified deep findings:\n${JSON.stringify(real)}`,
  { agentType: 'arbor-evaluator', label: 'synthesize+merge+write', phase: 'Verify+Merge', effort: 'high' }
)

return { lenses: DEEP.map(d => d.lens), raw: allFindings.length, verified: real.length }
