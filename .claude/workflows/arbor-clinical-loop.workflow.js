export const meta = {
  name: 'arbor-clinical-loop',
  description: 'Arbor Clinical Excellence loop (L2 — owns the "clinically the best in market" north star). The Clinical Board benchmarks Arbor\'s developmental coverage + soundness vs CDC-2022/AAP/ASHA and the competitors\' clinical bar, proactively files the gaps that would make Arbor the clinically-best offer, AND substantiates held claims so they can ship. Writes clinical requirements + a substantiation packet to the backlog for the Product Council. Propose-only: never builds, merges, or deploys. Hang-proof: no live preview.',
  phases: [
    { title: 'Benchmark', detail: 'peds/slp/psych benchmark Arbor vs CDC/AAP/ASHA + competitors → clinical authority gaps' },
    { title: 'Synthesize', detail: 'lead scores the clinical-authority gaps + substantiation packet, writes the backlog + memory' },
  ],
}

const FINDING = {
  type: 'object',
  required: ['id', 'lens', 'title', 'surface', 'gap', 'evidence', 'severity', 'impact', 'confidence', 'effort', 'riskClass'],
  properties: {
    id: { type: 'string' }, lens: { type: 'string', enum: ['peds', 'slp', 'psych'] },
    title: { type: 'string' }, surface: { type: 'string' },
    gap: { type: 'string' },                 // what Arbor lacks vs the clinical bar
    citedBar: { type: 'string' },            // the CDC/AAP/ASHA standard or competitor claim it's measured against
    evidence: { type: 'string' },            // the cited source
    severity: { type: 'integer', minimum: 1, maximum: 5 },
    impact: { type: 'integer', minimum: 1, maximum: 5 },     // impact on clinical authority (N2)
    confidence: { type: 'number', minimum: 0, maximum: 1 },
    effort: { type: 'integer', minimum: 1, maximum: 5 },
    ownerPod: { type: 'string' }, requiredFix: { type: 'string' },
    riskClass: { type: 'string', enum: ['safe', 'gated'] },  // gated if it carries/needs a claim or touches child-data
  },
}
const FINDINGS_SCHEMA = { type: 'object', required: ['findings'], properties: { findings: { type: 'array', items: FINDING } } }

const APP = 'Arbor — a longitudinal, parent-owned child-development OS (ages 0–12); source at PPPPtherapy-/PPPPtherapy-/app. Dev surfaces: lib/milestoneData.ts, lib/monitoring.ts, growth/, practice/, consult/, rhythm/, safety/escalation.ts.'
const NORTH = 'NORTH STAR N2: make Arbor the CLINICALLY BEST offer in the market — deepest, soundest developmental intelligence, beating Kinedu/Lovevery/Khan Kids/BabySparks on clinical AUTHORITY, not features.'
const FIREWALL = 'FIREWALL: Arbor is "developmentally informed, grounded in CDC/AAP/ASHA" — NEVER "clinically validated"/"clinician-endorsed". Reviewers are not licensed clinicians. Any developmental/medical/effect-size claim is riskClass:"gated". Never surface the philosophy-adviser identity.'

// ── BENCHMARK ────────────────────────────────────────────────────────────────
phase('Benchmark')
log('Clinical Excellence loop (L2) — benchmarking Arbor clinical authority vs the market bar')

const LENSES = [
  { id: 'arbor-clinical-peds', lens: 'peds', bar: 'CDC-2022 "Learn the Signs. Act Early." milestones + AAP Bright Futures + AAP developmental-surveillance guidance. Check milestone coverage/placement, red-flag thresholds, dev-score validity, preterm correction, escalation timing.' },
  { id: 'arbor-clinical-slp', lens: 'slp', bar: 'ASHA developmental norms + current intelligibility evidence (e.g. Hustad 2021). Check speech/literacy targets, phoneme order, age-appropriateness, referral timing.' },
  { id: 'arbor-clinical-psych', lens: 'psych', bar: 'Developmental-psychology + AAP mental-health guidance. Check behavior/emotion coaching soundness, attachment-safe + non-pathologizing framing, parent-mediated (not kid-companion) design.' },
]

const panels = await parallel(LENSES.map(c => () =>
  agent(
    `You are the ${c.lens} lens of Arbor's Clinical Advisory Board running the weekly Clinical Excellence benchmark. ${APP} ${NORTH} ${FIREWALL} ` +
    `Benchmark Arbor's CURRENT developmental content against your clinical bar: ${c.bar} ` +
    `Read the real source (milestoneData/monitoring/practice/growth/escalation) AND verify the current standard via web where unsure — do NOT assert norms from memory. ` +
    `Return the GAPS that, if closed, would make Arbor the clinically-best offer in the market: each with the cited bar it fails, the surface, the required fix, and riskClass ("gated" if it carries/needs a developmental/medical claim or touches child-data). Be rigorous; if a gap is genuinely contested or you can't substantiate the bar, say so and lower confidence.`,
    { agentType: c.id, label: `benchmark:${c.lens}`, phase: 'Benchmark', effort: 'high', schema: FINDINGS_SCHEMA }
  ).catch(() => ({ findings: [] }))
))
const findings = panels.filter(Boolean).flatMap(p => (p.findings || []))
log(`clinical benchmark: ${findings.length} authority gaps across peds/slp/psych`)

// ── SYNTHESIZE + WRITE ───────────────────────────────────────────────────────
phase('Synthesize')
await agent(
  `You are arbor-clinical-lead, scribe of the weekly Clinical Excellence loop (L2, owns north star N2 — clinically the best in market). ${FIREWALL} ` +
  `INPUT: these benchmarked clinical-authority gaps from your three lenses.\n${JSON.stringify(findings)}\n\n` +
  `DO: (1) dedupe + score each priority = (severity×impact×confidence)÷effort, weighting impact = how much it raises Arbor's clinical AUTHORITY vs competitors. ` +
  `(2) Split into TWO lists: clinical REQUIREMENTS ("what we should build to be the clinically-best offer") and CLAIM SUBSTANTIATION (held claims you can now substantiate from cited guidance, with the exact substantiated wording + the verdict-flip-to-build-ready). ` +
  `(3) WRITE: APPEND a dated "## Clinical Excellence — <date>" section to PAI/projects/arbor/mesh/improvement/IMPROVEMENT-BACKLOG.md with a scored table (ID|Gap|Lens|Cited bar|riskClass|Priority|Owner pod|Required fix), then a short "Clinical authority vs market" thesis: where Arbor already leads, the 2-3 gaps that would make it best-in-market, and the one moat-native clinical bet to lead with. PRESERVE the existing file — append only. ` +
  `(4) These feed the Sunday Product Council (gaps become candidates, substantiations lift the claim gate). Append a one-line cycle entry to mesh/MEMORY.md. Correct the date if the real date differs. Propose-only — never build/merge/deploy.`,
  { agentType: 'arbor-clinical-lead', label: 'clinical:score+write', phase: 'Synthesize', effort: 'high' }
)

return { lenses: ['peds', 'slp', 'psych'], gaps: findings.length }
