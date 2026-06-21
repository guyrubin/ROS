---
name: de-slop
description: The ROS output standard. Run before delivering ANY written output (memo, plan, email, doc, status, backlog, dashboard copy, PR text). Strips AI-slop and enforces accuracy, density, and Guy's executive voice at generation time. Invoke when writing or reviewing anything a human will read.
---

# De-Slop — the ROS output standard

Slop is generic AI mush: padded, hedged, structurally clichéd, decision-free. It is the reason an output feels "not accurate, not effective, not enough value." This skill removes it. Apply it as the VERIFY gate on every ROS deliverable — a finding/memo/email isn't done until it passes.

Inspired by the stop-slop / anti-ai-slop skills (hardikpandya, jalaalrd) and the principle that quality is enforced at generation, not in post-edit.

## The bar (what good looks like)
Accurate · dense · specific · decision-ending · in voice. Every sentence earns its place or is cut. Lead with the point. Numbers and sources over adjectives.

## Banned patterns — cut or rewrite on sight

**Openers / throat-clearing** — "In today's fast-evolving landscape…", "It's worth noting that…", "Let's dive in." → Delete. Start at the point.

**Empty emphasis** — "crucial", "vital", "powerful", "robust", "seamless", "game-changer", "significantly". → Delete the adjective or replace with the concrete fact (a number, a name).

**The not-just-X construction** — "Not just a tool, it's a system." "This isn't about X — it's about Y." → State the claim directly with evidence.

**Rule-of-three reflex** — everything in triples ("fast, simple, and reliable"). → Use the count the idea needs; one sharp item beats three vague ones.

**Hedging** — "might", "could potentially", "in some cases", "generally", "arguably", stacked qualifiers. → Commit. If uncertain, give the confidence + why, once.

**Meta-commentary** — "Great question.", "Here's a summary of…", "As an AI…", narrating what you're about to do. → Just do it.

**Structural clichés** — dramatic one-line fragments for effect; rhetorical questions as setups; "The result?" / "The kicker?"; negative-space listing ("This isn't about speed. It's not about scale either."). → Plain declaratives.

**Passive / narrator-from-a-distance** — "It can be observed that…", "Improvements were made." → Active, owned: who did what.

**False balance / both-sides padding** — "On one hand… on the other…" when there's a clear call. → Make the call; note the one real trade-off.

## The rubric — score before you ship (each must pass)
1. **Directness** — first sentence carries the point; no warm-up.
2. **Density** — could 30% be cut with no loss? If yes, cut it.
3. **Accuracy** — every claim is true + checkable (file, number, source); no invented specifics; uncertainty flagged once, honestly.
4. **Voice** — executive, calm, structured, high-agency (the ROS root directive). Not breezy, not academic, not salesy.
5. **Decision** — ends with a decision, a next action, or a clear ask. Never trails off.

A deliverable that fails any line gets rewritten, not shipped.

## Before → after
- ❌ "Arbor is a powerful, comprehensive platform that seamlessly empowers parents in today's complex world." → ✅ "Arbor is live in prod: AI coach + Academy + avatar gen, EN/HE. Next: app-store submission."
- ❌ "It's worth noting that the HV scan may potentially have stopped at some point recently." → ✅ "The HV scan stopped June 5 — last radar entry. It was never a registered cron."
- ❌ "This isn't just a dashboard — it's a command center that brings everything together." → ✅ "One cockpit: the Notion Command Center. The local HTML is a mirror."

## How it runs in ROS
- **Every mesh** applies this at the VERIFY stage of the [universal loop](../../../00_System/agent-framework/UNIVERSAL-LOOP.md) — it's the real "ROS Standard" (backlog Theme K), made specific.
- **The CILs** use it as the quality/language lens (Arbor `arbor-critic-language`; ROS-CIL Standard lens).
- **Self-applied:** when in doubt, paste a draft and ask "de-slop this against the rubric." The pass is the deliverable.
