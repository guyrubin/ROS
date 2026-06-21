# Principals
Version: 1.0
Last updated: 2026-06-21
Reviewed: 2026-06-21

ROS serves **two first-class principals** — Guy Rubin and Joseph Rubin. This registry makes that structural (ROS-BACKLOG C1): it sets, per principal, the accounts, default domains, privacy class, and subscriptions. Referenced by the `/AGENTS.md` boot, `/00_System/identity-policy.md` (confidentiality), `/00_System/routing.md`, and the domain `MESH.md` headers.

## Principals

| Principal | Accounts | Lead / default domains | Privacy class | Subscriptions / runtimes |
|---|---|---|---|---|
| **Guy Rubin** | `bguy.rubin@gmail.com` · `bhollandvest@gmail.com` (HV) | CoS, HV, KK (+Career/Research), PAI, MKT, FIN | HV + personal KK/FIN are **Guy-private** | Claude Code, Codex, Gemini, Hermes |
| **Joseph Rubin** | `josephdoronrubin@gmail.com` | EA (primary lead), FIN (consulting admin) | Joseph's own consulting clients are **Joseph-private** | Gemini, (Claude/Codex as shared ROS runtimes) |

**Shared (both principals):** EA workplace engagements where they collaborate, and all ROS infrastructure (framework, meshes, dashboard, connectors).

## Active-principal declaration (boot)
At session start, after routing context loads, **declare/confirm the active principal**. The active principal sets:
- the **default sending identity** (`/00_System/identity-policy.md`),
- the **domain scope** in view (a Joseph session leads with EA/FIN; a Guy session sees the full portfolio),
- the **confidentiality boundary** (below).

If unstated, infer from the domain/account in play; when ambiguous, ask which principal.

## Confidentiality boundary (non-negotiable)
**Never surface one principal's private domain in the other principal's session.** Guy-private (HV, personal KK/FIN) is not exposed in a Joseph-led session; Joseph-private consulting clients are not exposed in a Guy-led session. This extends the EA client-vs-client gate (`EA/mesh/MESH.md`) up to the principal axis. Shared domains are visible to both. Full rules: `/00_System/identity-policy.md`.

## Agnostic / get-the-most-from-every-subscription
ROS is **model- and runtime-agnostic** (`/AGENTS.md` Design principle). Use the best tool for each job and **leverage every connected subscription across both principals** — including **Joseph's Gemini** for Joseph-context generation/multimodal work, and Guy's Claude/Codex/Gemini/Hermes. No capability is locked to one vendor; the filesystem + `state.json` are the shared contract so any runtime can pick up work.
