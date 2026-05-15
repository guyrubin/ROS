# Architecture Review — ROS PRD v1.0
Date: 2026-05-12
Author: Guy Rubin
Status: Draft
Context: Internal — ROS system design, no external client

---

## Executive Summary

The ROS PRD v1.0 architecture is **sound and build-ready**. The platform separation model (Obsidian / Notion / Google Workspace / Claude Cowork) is clean, non-overlapping, and correctly assigns each platform to its natural strength. The one-role-one-plugin principle is the right call for a multi-domain personal operating system. Four issues need resolution before build starts: (1) inter-plugin routing at runtime, (2) connector availability gaps for Dutch property systems and Google Workspace, (3) the FIN plugin is under-specified for MVP, and (4) the KK/COS boundary will create ambiguity without an explicit routing rule in the root CLAUDE.md. Migration from the current Hollandvest structure is correctly deferred.

---

## Context

**Problem being solved**: Collapse a multi-domain professional workload (real estate, EA consulting, product, marketing, admin) into a coordinated AI operating system without role confusion, identity risk, or context leakage.

**Constraints**:
- Platform: Claude Cowork (Sonnet default, plugin-based skill delivery)
- File system: Windows / OneDrive / Obsidian markdown vault
- Connectors available today: Gmail ×2, Notion
- Connectors not yet available: Google Calendar, Google Drive, Funda, Kadaster, Omgevingsloket
- EA multi-client isolation requirement (bpost, KBC, ABN AMRO, European Commission)
- Multiple Gmail identities with strict routing requirements

---

## What's Working

| Strength | Assessment |
|---|---|
| Platform separation model | Excellent — each platform has one job, no overlap |
| One-role-one-plugin principle | Correct — prevents context collapse |
| EA multi-client isolation | Correctly designed — per-client folder, per-client MEMORY.md |
| Safety level model (0-5) | Well-designed — proportionate to action risk |
| Command-first design | Right pattern for repeatable workflows |
| Workbook as first-class model | Correct — separates numeric decisions from prose work |
| Template-first output rule | Enforces execution discipline |
| One-way sync Obsidian→Notion for MVP | Pragmatic — avoids state management complexity |
| Memory hierarchy (global / plugin / client / project / session) | Correctly scoped |
| Phase 1-5 build sequence | Correctly prioritised — foundation first, growth plugins last |

---

## Gaps and Risks

### 🔴 Critical

**1. Inter-plugin routing at runtime**
The PRD describes 7 separate plugins (COS, KK, HV, EA, PAI, MKT, FIN). In Claude Cowork, plugins are separate installable packages. The architectural question: when a user types `/hv.analyze-deal`, how does the HV plugin access shared COS priorities or KK's waiting-for list?

Current answer: the file system is the shared state. All plugins read from the same Obsidian vault mount. This is correct architecture but must be explicitly stated in each plugin's CLAUDE.md as: "Before starting, read `ROS/MEMORY.md` and `ROS/00_SYSTEM/routing.md`." Without this instruction, each plugin acts in isolation.

**Risk**: Medium-high. Plugins will not naturally coordinate without explicit file-read instructions in every CLAUDE.md.

**Fix**: Add a "session start protocol" to every plugin CLAUDE.md:
```
On session start:
1. Read /ROS/MEMORY.md
2. Read /ROS/00_SYSTEM/routing.md
3. Read /plugins/{this-plugin}/MEMORY.md
```

---

**2. KK / COS boundary ambiguity**
"What should I focus on this week?" → COS or KK?
"What's on my plate today?" → KK.
"Am I working on the right things?" → COS.
These are easy in theory. In practice, the user will not always use the `/plugin.command` syntax. Without a root-level routing rule, the wrong plugin will activate.

**Risk**: High UX degradation. The system will feel inconsistent.

**Fix**: The root `ROS/CLAUDE.md` must contain an explicit routing matrix that activates before any plugin is loaded. This is the single most important file in the system.

```
Routing:
- "today / daily / inbox / calendar / follow-up" → KK
- "priorities / strategy / review / blockers / what matters most" → COS
- "deal / property / BRRRR / lender / permit / Dutch RE" → HV
- "architecture / HLD / ADR / client / cloud / platform / interview" → EA
- "product / PRD / MVP / roadmap / feature" → PAI
- "content / post / LinkedIn / campaign / brand" → MKT
- "invoice / insurance / contract / compliance / admin / bank" → FIN
```

---

### 🟡 Significant

**3. Connector availability gaps**

| Connector | Status | Impact |
|---|---|---|
| Gmail (bguy.rubin) | Connected ✅ | KK, EA, COS, MKT, FIN |
| Gmail (bhollandvest) | Connected ✅ | HV, FIN(HV) |
| Notion | Connected ✅ | All plugins |
| Google Calendar | Not connected ❌ | KK daily plan blocked |
| Google Drive | Not connected ❌ | EA/HV file storage blocked |
| Funda | No MCP exists | HV deal analysis — manual or Chrome fallback |
| Kadaster | No MCP exists | HV permit pathway — manual or Chrome fallback |
| Omgevingsloket | No MCP exists | HV permit — manual or Chrome fallback |

**Fix for MVP**: Document connector fallbacks in each CLAUDE.md. KK daily plan works from Gmail + Notion task registry. Funda/Kadaster/Omgevingsloket use Claude-in-Chrome as fallback.

---

**4. FIN plugin under-specified**
FIN has commands and acceptance criteria but no workbook list, no connector detail, no template list, and no folder structure in the PRD. For Phase 5, this is acceptable. For MVP scoping, it should be formally noted as incomplete.

**Recommendation**: FIN goes into Phase 5. Do not start FIN until Phase 3 and Phase 4 are stable.

---

**5. KK naming carries identity risk**
"KK" is not a role name that Claude Cowork will naturally recognise as a Personal Assistant context. If a user types anything ambiguous, the routing must be in the root CLAUDE.md. The plugin name matters less than the routing rule.

**Recommendation**: No change needed to the name — just ensure the routing rule is in root CLAUDE.md.

---

### 🟢 Low Severity

**6. Shared layer discovery**
`/03_SHARED/skills/` contains skills like `email-composer.md`, `notion-sync.md`, etc. Individual plugins also have their own `skills/` folders. The question: does each plugin's CLAUDE.md know to look in `/03_SHARED/skills/` before checking its own `/plugins/{plugin}/skills/`?

**Fix**: Add to every plugin CLAUDE.md: "Shared skills available at `/03_SHARED/skills/`."

**7. Notion Phase 4 scope is large**
10 databases + master dashboard + 7 domain dashboards is a significant build. For MVP, prioritise:
1. Plugin Registry
2. Task Registry
3. Command Center Dashboard (COS + KK view)
4. HV Deal Pipeline
5. EA Client Dashboard

Defer the rest to Phase 4b.

**8. josephdoronrubin@gmail.com still unassigned**
The PRD marks it as "Disabled until confirmed." This is correct. Add it to FIN scope when FIN is built (likely Joseph's personal/admin account).

---

## Recommendations

### R1 — Write root ROS/CLAUDE.md first (not last)
This is the single most important file. It defines:
- System identity
- Routing rules
- Session start protocol
- Safety levels
- Identity mapping

Every plugin CLAUDE.md stacks on top of it. Do not build plugins without this file existing.

### R2 — Two-plugin MVP, not seven
For the first working build, ship two plugins:
1. **ros-core.plugin** = COS + KK (root layer, daily operations, orchestration)
2. **ros-hv.plugin** = HV (highest immediate business value, fully self-contained)

This gets you working quickly, validates the inter-plugin coordination model, and lets you catch routing issues before building 5 more plugins. Add EA, PAI, MKT, FIN in sequence.

### R3 — Validate the Cowork multi-plugin model before committing to 7 plugins
Test: install ros-core.plugin and ros-hv.plugin simultaneously. Type `/hv.analyze-deal`. Verify HV plugin loads and reads from the correct folder. Verify it can reference ROS/MEMORY.md.

If this doesn't work as expected, the fallback is the current architecture: one plugin, 7 agent contexts routed by root CLAUDE.md. The PRD's multi-plugin goal is correct, but the execution platform (Cowork) must be validated against it.

### R4 — Decouple EA client structure from current Hollandvest folder
The PRD's EA client model (`bpost/`, `kbc/`, `abn-amro/`, `european-commission/`, `generic-career/`) is much better specified than the current build. When migration happens, map:
- Current `EA/clients/COBRA/` → probably `generic-career/security-architecture/` or its own client
- Current `EA/clients/NXP/` → `nxp/` client folder
- Current `EA/clients/ServiceNow/` → `servicenow/` client folder

### R5 — `00_SYSTEM/` policy files: build 4 now, defer 10 later
**Build now** (Phase 1):
- `principles.md`
- `routing.md`
- `identity-policy.md`
- `markdown-instruction-principles.md`

**Defer**:
- `plugin-policy.md`, `skill-policy.md`, `command-policy.md`, etc. — these are governance documents useful once the system is running. Writing them before the system exists adds overhead without value.

---

## Trade-offs

| Decision | Upside | Downside |
|---|---|---|
| Multi-plugin vs. one plugin | Clean separation, independent installs, role clarity | Inter-plugin coordination depends on file system; Cowork multi-plugin behavior needs validation |
| Obsidian as knowledge layer | Persistent, local, offline, version-controllable | Not indexed by Claude natively — plugins must explicitly read files |
| Notion as operations layer | Relational databases, dashboards, filtering | Requires Notion MCP for every write; 10-database setup is significant |
| One-way sync Obsidian→Notion | Simple state management | Assets exist in two places; manual sync discipline required |
| Template-first output | Consistency, speed, less hallucination risk | Templates become stale if not maintained |
| Command-first design | Discoverable, repeatable, testable | Users must learn the command vocabulary |
| Session start file-read protocol | Shared context without plugin coupling | Adds latency to every session start; files must stay current |

---

## Next Actions

| Priority | Action | Owner | Phase |
|---|---|---|---|
| 🔴 Now | Write `ROS/CLAUDE.md` — root routing, identity, safety | Build | Phase 1 |
| 🔴 Now | Write `00_SYSTEM/routing.md` — full routing matrix | Build | Phase 1 |
| 🔴 Now | Write `00_SYSTEM/identity-policy.md` | Build | Phase 1 |
| 🔴 Now | Write `00_SYSTEM/markdown-instruction-principles.md` | Build | Phase 1 |
| 🟡 Next | Build COS plugin CLAUDE.md | Build | Phase 2 |
| 🟡 Next | Build KK plugin CLAUDE.md | Build | Phase 2 |
| 🟡 Next | Validate two-plugin coordination in Cowork | Test | Pre-Phase 3 |
| 🟡 Next | Build HV plugin CLAUDE.md + analyze-deal command | Build | Phase 3 |
| 🟡 Next | Build EA plugin CLAUDE.md + write-hld command | Build | Phase 3 |
| 🟢 Later | Set up 5 priority Notion databases | Build | Phase 4 |
| 🟢 Later | Build PAI, MKT, FIN plugins | Build | Phase 5 |
| 🟢 Defer | File system migration from Hollandvest/ to /ROS/ | Ops | Post-Phase 3 |

---

## Verdict

**Build it. The architecture is correct.**

The PRD's core model — platform separation, role isolation, file-system-as-shared-state, command-first, template-first, workbook-first — is a well-designed AI operating system. The risks are execution risks, not design flaws. Mitigate them by starting with the root routing file, validating multi-plugin coordination before committing to 7 plugins, and deferring FIN and the full Notion control plane until the core is stable.
