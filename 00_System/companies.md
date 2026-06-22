# Rubin OS — Company Registry

**Version:** 1.0 · **Created:** 2026-06-22 · **Owner:** CoS (group HQ) · **CEO:** Guy
**Model:** [group-operating-model.md](group-operating-model.md) · **Identity:** [identity-policy.md](identity-policy.md) + [principals.md](principals.md)

The canonical list of every entity in the group — companies, group services, company-eligible domains, and personal ops — with its attributes. The keystone of the multi-company OS (parallel to `principals.md`). Boot reads this to know the **active company**; routing is company-aware; isolation is enforced per the `Isolation` column.

## The register

| Entity | Kind | CEO / owner | Org (mesh) | Backlog(s) | Release lane | Identity | Isolation | Status |
| :-- | :-- | :-- | :-- | :-- | :-- | :-- | :-- | :-- |
| **Arbor** | **company** | Guy (CEO) · GM = `arbor-orchestrator` | [PAI/Arbor mesh](../PAI/projects/parenting-os-plugin/mesh/CHARTER.md) | Arbor Product `AP-` · Arbor Marketing `AM-` | `REL-ARBOR-*` | `bguy` (own `arbor@` later) | company-scoped + child-data/clinical firewall | **ACTIVE — company #1** |
| HollandVest | company-eligible domain | Guy | [HV mesh](../HV/mesh/MESH.md) | ROS-BACKLOG Theme D + HV files | `REL-HV-*` (when promoted) | `bhollandvest` | domain-scoped | domain — promote in Phase 2 |
| EA / Advisory | company-eligible domain | Guy + Joseph | [EA mesh](../EA/mesh/MESH.md) | per-client | `REL-EA-*` (when promoted) | `joseph` / `bguy` | **per-client confidential** | domain — promote in Phase 2 |
| **CoS** | group HQ (CEO office) | Guy | [Conductor](../CoS/mesh/MESH.md) + [Delivery](../CoS/delivery/MESH.md) + `ros-evaluator` | ROS `ROS-` | `REL-ROS-*` | `bguy` | sees across all companies | group |
| Delivery / Release | group service | CoS | `ros-release-lead` | — | runs all lanes | — | cross-company | group — built 2026-06-22 |
| Finance / Admin | group service | shared | [FIN mesh](../FIN/mesh/MESH.md) | — | — | per-account | consolidates P&L (later) | group |
| Research | group service | KK-owned | `research-agent` | — | — | — | dispatch-scoped | group |
| Marketing (group) | group service + per-company | Guy | [MKT mesh](../MKT/mesh/MESH.md) | — | — | `bguy` | Guy personal-brand + HV brand | group (Arbor has its **own** marketing org) |
| KK | **personal** | Guy (personal) | [KK mesh](../KK/mesh/MESH.md) | — | — | `bguy` | personal — never a company | personal |

## Rules

1. **Boot declares the active company.** Per [`AGENTS.md`](../AGENTS.md), a session establishes its **active company + active principal** (default: Guy / group). Routing + connectors + memory then scope to that company.
2. **One company is first-class today: Arbor.** Others are company-eligible domains; they keep running as domains until promoted (Phase 2). Promotion = give the entity the four group interfaces (backlog · release ledger · health · P&L) + an isolation class + a `COMPANY.md`.
3. **Isolation is per the `Isolation` column.** A company session never surfaces another company's private context. The group (CoS) is the only tier that sees across. Same non-negotiable as EA client-vs-client and Guy↔Joseph.
4. **Group services are shared, not owned by a company.** Delivery, FIN, Research, the Standard, the cockpit are built once and consumed by all — never duplicated per company.
5. **A company exposes four interfaces** to the group (backlog · release ledger entry · health signal · P&L lane). The group reads these; it does not reach into internals. This is what lets a company separate physically later at no cost now.
6. **No new entity → company without a registry row + a `COMPANY.md`.** No silent companies (same anti-drift rule as the loop registry).

## Promotion path (domain → company)
A company-eligible domain is promoted when it's worth running as a business in its own right. Checklist: own backlog with stable ids · a release lane (or "ships deliverables, not code") · an identity · an isolation class · a `COMPANY.md` referencing its mesh as its org · a registry-row flip to `company`. HollandVest is the likeliest Phase-2 promotion.
