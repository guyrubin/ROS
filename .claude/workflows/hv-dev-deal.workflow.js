export const meta = {
  name: 'hv-dev-deal',
  description: 'HV prime value-add deal engine: source → dual-exit underwrite + permit + architecture → investor/mortgage/finance panel → IC memo. NL + BE.',
  whenToUse: 'Run a full investment-committee pass on a market (NL/BE) or a provided candidate list: source prime development blocks, model both exits, clear permits, mediate the advisor panel, and synthesize ranked IC memos.',
  phases: [
    { title: 'Source', detail: 'find/score prime dev candidates against the buy-box' },
    { title: 'Analyze', detail: 'per candidate: dual-exit underwrite + permit pathway + architecture feasibility' },
    { title: 'Panel', detail: 'investor / mortgage / finance lenses across the shortlist' },
    { title: 'Synthesize', detail: 'ranked IC memo, facts/assumptions/risks separated' },
  ],
}

// args: { market: 'NL'|'BE'|'both', region?: string, band?: string,
//         candidates?: [{id,name,market,price,profile}], datapacks?: {nl, be} }
const a = args || {}
const market = a.market || 'both'
const band = a.band || '€0.75–1.5M purchase'
const region = a.region || (market === 'BE' ? 'Antwerp' : market === 'NL' ? 'Den Haag' : 'Den Haag + Antwerp')

const CAND_SCHEMA = {
  type: 'object', required: ['candidates'], properties: {
    candidates: { type: 'array', items: { type: 'object',
      required: ['id', 'name', 'market', 'price', 'upside', 'source'],
      properties: {
        id: { type: 'string' }, name: { type: 'string' },
        market: { type: 'string' }, price: { type: 'string' },
        sizeM2: { type: 'string' }, upside: { type: 'string' },
        flags: { type: 'string' }, source: { type: 'string' }, devScore: { type: 'number' },
      } } } } }

// ── Phase 1: Source (skip if candidates handed in) ────────────────────────────
phase('Source')
let candidates = a.candidates
if (!candidates || !candidates.length) {
  const sourced = await parallel(
    (market === 'both' ? ['NL', 'BE'] : [market]).map(mk => () =>
      agent(
        `Source 6–10 REAL, currently-listed prime-location HIGH-DEVELOPMENT-POTENTIAL candidates in ${mk === 'BE' ? 'Antwerp (2000 + prime districts)' : 'Den Haag (Statenkwartier/Archipel/Zeeheldenkwartier/Centrum/Duinoord/Scheveningen)'}, ${band}. ` +
        `Whole-building / split / m²-add / conversion / deep-reno upside. Funda.nl is anti-bot walled — use ${mk === 'BE' ? 'Immoweb/Zimmo/Immovlan/Realo + brokers' : 'Pararius + broker sites + Google snippets + broker mandates'}. ` +
        `No invented listings — working source URL or flag unconfirmed. Score each on the HV Development-Potential Score (entry €/m² discount, volume/unit-add, control/vacancy, EPC upside, permit openness, location). Return ranked best-first.`,
        { label: `source:${mk}`, phase: 'Source', agentType: 'research-agent', schema: CAND_SCHEMA },
      ).then(r => (r?.candidates || []).map(c => ({ ...c, market: c.market || mk }))),
    ),
  )
  candidates = sourced.filter(Boolean).flat()
}
log(`Sourcing → ${candidates.length} candidates across ${region}`)
// keep top-N by devScore for the expensive analysis
const shortlist = [...candidates].sort((x, y) => (y.devScore || 0) - (x.devScore || 0)).slice(0, 6)
log(`Shortlisted ${shortlist.length} for full analysis`)

const FIN_SCHEMA = { type: 'object', required: ['bestExit', 'verdict'], properties: {
  bestExit: { type: 'string' }, sellMargin: { type: 'string' }, grossYield: { type: 'string' },
  dscr: { type: 'string' }, breakeven: { type: 'string' }, verdict: { type: 'string' }, notes: { type: 'string' } } }
const PERMIT_SCHEMA = { type: 'object', required: ['verdict'], properties: {
  instrument: { type: 'string' }, leadPermit: { type: 'string' }, timeline: { type: 'string' },
  killSwitch: { type: 'string' }, verdict: { type: 'string' } } }

const dpHint = a.datapacks ? `Datapacks: NL=${a.datapacks.nl || 'n/a'} BE=${a.datapacks.be || 'n/a'} (READ them).` :
  'READ HV market modules /HV/02_Areas/markets/ + any deal datapack for 2026 figures.'

// ── Phase 2: per-candidate analysis (pipeline — no barrier) ───────────────────
phase('Analyze')
const analyzed = await pipeline(
  shortlist,
  c => agent(
    `Dual-exit underwrite (develop-to-sell AND BRRRR-hold, per /HV/mesh/DEV-MODEL.md) for: ${c.name} (${c.market}, ${c.price}, ${c.sizeM2 || 'm² TBC'}). Upside: ${c.upside}. ${dpHint} ` +
    `Compute sell margin (GDV − total cost), BRRRR yield/DSCR, the breakeven that flips the verdict, and the numeric verdict. Flag assumptions.`,
    { label: `underwrite:${c.id}`, phase: 'Analyze', agentType: 'hv-underwriting', schema: FIN_SCHEMA },
  ).then(async fin => {
    const [permit, arch] = await parallel([
      () => agent(
        `Permit/zoning pathway for ${c.name} (${c.market}). ${dpHint} Governing instrument, lead permit(s), timeline, the single kill-switch, and a Green/Conditional/Red verdict. ` +
        `NL: omgevingsvergunning + woningsplitsing status (Den Haag gated to 1-Apr-2026) + monument/welstand. BE: omgevingsvergunning + opdeling + monument + renovatieverplichting.`,
        { label: `permit:${c.id}`, phase: 'Analyze', agentType: 'hv-permit', schema: PERMIT_SCHEMA }),
      () => agent(
        `Architecture feasibility for ${c.name}: best buildable scheme (units/m² mix/added-m² source), buildability constraints, the two fragile concept assumptions, reno grade + contingency %.`,
        { label: `arch:${c.id}`, phase: 'Analyze', agentType: 'hv-architecture' }),
    ])
    return { candidate: c, fin, permit, arch }
  }),
)
const live = analyzed.filter(Boolean)

// ── Phase 3: advisor panel across the shortlist (barrier — needs all analysis) ─
phase('Panel')
const dossier = live.map(x =>
  `${x.candidate.name} (${x.candidate.market}, ${x.candidate.price}): bestExit=${x.fin?.bestExit}, sellMargin=${x.fin?.sellMargin}, yield=${x.fin?.grossYield}, DSCR=${x.fin?.dscr}, permit=${x.permit?.verdict}`,
).join('\n')
const [investor, mortgage, finance] = await parallel([
  () => agent(`Investor/IC-skeptic lens across this analyzed shortlist. Rank by risk-adjusted return; margin of safety under reno+20% AND exit−10%; one deal-killer + one proceed-condition each; pursue-first/walk; portfolio call.\n\n${dossier}`,
    { label: 'panel:investor', phase: 'Panel', agentType: 'hv-investor' }),
  () => agent(`Mortgage/finance lens across the shortlist. Per deal: structure, day-1 cash, refinance pull-out, DSCR test, red flags. Most-financeable vs hardest-to-fund.\n\n${dossier}`,
    { label: 'panel:mortgage', phase: 'Panel', agentType: 'hv-mortgage' }),
  () => agent(`Fiscal/structuring lens across the shortlist. Per deal: acquisition tax, the VAT-vs-transfer-tax exit fork, entity (BV/vennootschap), cross-border flags, what needs a notary/fiscalist ruling.\n\n${dossier}`,
    { label: 'panel:finance', phase: 'Panel', agentType: 'hv-finance' }),
])

// ── Phase 4: synthesize the IC memo ───────────────────────────────────────────
phase('Synthesize')
const memo = await agent(
  `Synthesize the HV IC memo for ${region} (${band}). Honor the HV Definition-of-Done: exec takeaway → facts → labeled assumptions → risks → financial impact (dual-exit table) → recommendation (Proceed/Proceed-if/Hold/Do-not per asset) → next actions. Separate facts/assumptions/risks. Reconcile the underwriting ranking (leveraged pro-forma) vs the investor ranking (margin of safety) explicitly. Make the portfolio call.\n\n` +
  `ANALYSIS:\n${live.map(x => `### ${x.candidate.name}\nfin: ${JSON.stringify(x.fin)}\npermit: ${JSON.stringify(x.permit)}\narch: ${x.arch}`).join('\n\n')}\n\n` +
  `PANEL:\nINVESTOR:\n${investor}\n\nMORTGAGE:\n${mortgage}\n\nFINANCE:\n${finance}`,
  { label: 'synthesize:ic-memo', phase: 'Synthesize', agentType: 'hv-orchestrator' },
)

return { region, band, candidates: candidates.length, shortlisted: live.length, memo,
  analysis: live.map(x => ({ name: x.candidate.name, market: x.candidate.market, price: x.candidate.price,
    bestExit: x.fin?.bestExit, verdict: x.fin?.verdict, permit: x.permit?.verdict })) }
