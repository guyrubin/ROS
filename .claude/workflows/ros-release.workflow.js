export const meta = {
  name: 'ros-release',
  description: 'ROS release train — plan a train from READY items in one canonical backlog, build it on a branch off current main through the product DevSecOps team, run the FULL green-gate, deploy a no-traffic canary + smoke it, then STOP and surface the prod-promotion (canary→100%) decision to CoS/Guy. Never auto-promotes, never deploys by hand, never flips a claim. args: { product: "arbor"|"mktg"|"ros", release?: "REL-ARBOR-001" }',
  phases: [
    { title: 'Plan', detail: 'bundle READY items, claim the merge lane, define the train' },
    { title: 'Build+Gate', detail: 'product team builds on rel branch off current main; full green-gate' },
    { title: 'Canary+Smoke', detail: 'no-traffic tagged revision + post-deploy smoke' },
    { title: 'Promote-Prep', detail: 'assemble evidence; surface the prod-promote gate to Guy — STOP' },
  ],
}

const PRODUCT = (args && args.product) || 'arbor'
const RELEASE = (args && args.release) || null
// Each product's DevSecOps team + canonical backlog. The train borrows the team — it adds no release agents.
const TEAM = {
  arbor: { lead: 'arbor-devsecops-lead', backlog: 'PAI/projects/parenting-os-plugin/mesh/PRODUCT-BACKLOG.md', relPrefix: 'REL-ARBOR' },
  mktg:  { lead: 'arbor-marketing-lead', backlog: 'PAI/projects/parenting-os-plugin/mesh/marketing/MARKETING-BACKLOG.md', relPrefix: 'REL-MKTG' },
  ros:   { lead: 'ros-evaluator',        backlog: 'CoS/ROS-BACKLOG.md', relPrefix: 'REL-ROS' },
}[PRODUCT]

const GATE_SCHEMA = {
  type: 'object', required: ['branch', 'branchCurrentWithMain', 'gate', 'ready'],
  properties: {
    branch: { type: 'string' },
    branchCurrentWithMain: { type: 'boolean' },
    gate: { type: 'object', required: ['tsc','tests','framework','safety','regression','build','firewallLint'],
      properties: { tsc:{type:'boolean'}, tests:{type:'boolean'}, framework:{type:'boolean'},
        safety:{type:'boolean'}, regression:{type:'boolean'}, build:{type:'boolean'}, firewallLint:{type:'boolean'} } },
    ready: { type: 'boolean' }, notes: { type: 'string' },
  },
}
const SMOKE_SCHEMA = {
  type: 'object', required: ['candidateRevision','healthz','payloadNot413','authedRender','smokeGreen'],
  properties: { candidateRevision:{type:'string'}, healthz:{type:'boolean'}, payloadNot413:{type:'boolean'},
    authedRender:{type:'boolean'}, smokeGreen:{type:'boolean'}, rolledBack:{type:'boolean'}, notes:{type:'string'} },
}

phase('Plan')
log(`Release train · product=${PRODUCT} · release=${RELEASE || '(next)'}`)
const plan = await agent(
  `Plan a release train for product "${PRODUCT}". Read /00_System/release-engineering/{README,BACKLOG-MODEL,RELEASE-PIPELINE,RELEASE-LEDGER,CLAIM-REGISTER}.md and the canonical backlog ${TEAM.backlog}.
${RELEASE ? `Use the seeded train ${RELEASE} from the ledger.` : `Select only READY items (BACKLOG-MODEL §ready): each has an id, outcome, owner pod, riskClass, score, and any claim registered.`}
Bundle them into ${TEAM.relPrefix}-NNN, sequenced by the conflict map (the net before what lands in it). CLAIM THE MERGE LANE in RELEASE-LEDGER.md (only the lock-holder merges/promotes). Return the train: id, ordered items with riskClass, the rel/ branch name, and which items carry a claim (must ship dark, flag OFF).`,
  { agentType: 'ros-release-lead', label: `plan:${PRODUCT}`, phase: 'Plan', effort: 'high' }
)

phase('Build+Gate')
const gate = await agent(
  `Execute the BUILD + full GREEN-GATE for this train as the product DevSecOps lead:
${typeof plan === 'string' ? plan : JSON.stringify(plan)}

Rules (RELEASE-PIPELINE + GREEN-GATE): cut the rel/ branch off CURRENT origin/main (not a stale local main). Build the items; claim-bearing ones behind a flag default OFF (CLAIM-REGISTER). Run the FULL gate — tsc(lint) · tests · check:framework · eval:safety · the per-product regression suite · build · the firewall lint (fail on any unregistered/forbidden claim string). Enforce branch-current-with-main (rebase + re-gate if behind). Do NOT merge to main yet, do NOT deploy. Return the gate result.`,
  { agentType: TEAM.lead, label: `build+gate:${PRODUCT}`, phase: 'Build+Gate', effort: 'high', schema: GATE_SCHEMA, isolation: 'worktree' }
)
if (!gate || !gate.ready || !gate.branchCurrentWithMain || Object.values(gate.gate || {}).some(v => v === false)) {
  log('Gate RED or branch behind main — train halts before merge. No canary.')
  return { product: PRODUCT, stoppedAt: 'green-gate', gate }
}

phase('Canary+Smoke')
const smoke = await agent(
  `Gate is green and branch is current. Merge the rel/ branch to main (you hold the lane), let CI build, then deploy a CANARY: a Cloud Run revision with --no-traffic --tag candidate (0% live). Run the post-deploy smoke against the candidate tag: /healthz returns version==SHA, a 1.5MB payload is NOT 413, one authed render path returns >0. If smoke fails → AUTO-ROLLBACK (do not touch live traffic) and report. Do NOT update-traffic to 100% — that is Guy's gate. Return the smoke result.`,
  { agentType: TEAM.lead, label: `canary+smoke:${PRODUCT}`, phase: 'Canary+Smoke', effort: 'high', schema: SMOKE_SCHEMA }
)
if (!smoke || !smoke.smokeGreen) {
  log('Smoke RED — auto-rolled-back. Train halts. (2 consecutive rollbacks ⇒ kill-switch + page Guy.)')
  return { product: PRODUCT, stoppedAt: 'smoke', gate, smoke }
}

phase('Promote-Prep')
const decision = await agent(
  `Canary is green at 0% traffic. Prepare the PROD-PROMOTION decision for CoS/Guy (Level 3) — do NOT promote. Assemble: the train + items, the gate results, the candidate revision + smoke evidence, any claim-bearing items shipped dark (and which claim rows are pending), and the one-line ask: "Promote ${smoke.candidateRevision} to 100%? y/n". Update RELEASE-LEDGER.md (stage 6→awaiting-promote) and write back to the product MEMORY. Return the decision packet.`,
  { agentType: 'ros-release-lead', label: `promote-prep:${PRODUCT}`, phase: 'Promote-Prep', effort: 'medium' }
)
log('Train is at the prod-promote gate. Awaiting Guy sign-off — nothing promoted.')
return { product: PRODUCT, stoppedAt: 'awaiting-promote', gate, smoke, decision }
