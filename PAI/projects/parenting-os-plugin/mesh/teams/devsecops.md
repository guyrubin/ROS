# DevSecOps Team — Spec

**Reports to:** arbor-orchestrator → ROS CoS. **Mandate:** gate every ship; hold veto on quality, security, and release. Cross-cutting — owns no product domain.

## Roster & responsibilities

| ID | Role | Owns | Veto over |
| :-- | :-- | :-- | :-- |
| `arbor-devsecops-lead` | Lead | Composite ship-gate; coordinates the four specialists; sequences hardening sweeps | Any ship |
| `arbor-sec` | Security | SAST, secret scanning, dependency CVEs, threat model, WAF/hardening backlog, payment & auth security | Security-risk changes |
| `arbor-release` | Release/CI-CD | `cloudbuild.yaml`/`cloudbuild.prod.yaml`, Cloud Run, Firebase Hosting, build, deploy, rollback plan | Broken builds, unsafe deploys |
| `arbor-sre` | Reliability | Telemetry, error/latency/cost dashboards, AI usage metrics, performance budgets, alerting | Budget/perf regressions |
| `arbor-qa` | Quality | Test/coverage gate, `eval:safety` regression, `check:framework`, flaky-test triage | Coverage regressions, red tests |

## Composite ship-gate (all must be green)
```bash
cd app
npm run lint            # tsc --noEmit            (arbor-qa)
npm test                # vitest run              (arbor-qa)
npm run check:framework # framework schema        (arbor-qa, if touched)
npm run eval:safety     # safety + arch gates     (arbor-qa + arbor-safety)
```
Plus: `arbor-sec` — no new secrets, no new CVEs, payment/auth paths reviewed. `arbor-release` — build green, deploy + rollback path known. `arbor-sre` — no budget/perf regression beyond threshold.

## Modes
- **Gate mode** (default): validate a pod's delta before the Orchestrator merges.
- **Hardening sweep:** burn down the WAF/security backlog (`arbor-waf-assessment`, `arbor-waf-migration-blueprint`) across the app.
- **Incident mode:** triage → mitigate → postmortem (use `engineering:incident-response`).

## Skills to lean on
`engineering:code-review`, `security-review`, `engineering:deploy-checklist`, `engineering:incident-response`, `engineering:tech-debt`, `engineering:testing-strategy`.

## Escalation
Deploy-to-prod = Level 3 (confirm). Anything touching child data, payments, or store submission routes to the Orchestrator → PAI/CoS with the decision spelled out.

## Runnable subagents
`.claude/agents/arbor/arbor-devsecops-lead.md`, `arbor-sec.md`, `arbor-release.md`, `arbor-sre.md`, `arbor-qa.md`.
