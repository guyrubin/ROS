---
name: ai-trends-watch
description: Scan AI / agent / LLM trends and new tools, skills, and methods, then propose concrete ROS optimizations. Use weekly (or when Guy asks "what's new / are we current"). Keeps the LLM-agnostic OS current and feeds the ROS OS Dashboard AI-trends panel.
---

# AI-trends watch — keep ROS current, get the most from everything

ROS sits on 3 persistent LLMs (Claude · Codex · Gemini) + Google + Hermes. They improve weekly. This skill makes sure ROS *uses* the improvements instead of drifting behind.

## Method
1. **Scan** (dispatch `research-agent` / web): new agent frameworks, Claude/Codex/Gemini features, skill patterns (e.g. de-slop, agentic workflows), MCP connectors, prompting/method advances. Cite every source.
2. **Filter to ROS** — only what changes how ROS should work for Guy/Joseph. Drop hype.
3. **Map to a concrete change** — each kept trend → a specific ROS optimization: a new/updated skill, a tool to wire, a method tweak, a loop. Score it (impact ÷ effort).
4. **Propose, don't apply** — write the optimizations to `CoS/ROS-BACKLOG.md` (Theme L / tooling) + the dashboard AI-trends panel. Adoption (OAuth, skill install, method change) is Guy-gated.
5. **De-slop** the output — sharp, cited, decision-ending.

## Output
A short "what's new + what we should do" list: trend → source → ROS change → score. The top item becomes a backlog candidate.

## Boundaries
Read-and-report. No installs, no external action, no spend without Guy. This is the "ongoing checking for AI trends and optimizing" loop (`SCHEDULED-LOOPS.md` → AI-trends watch).
