---
name: grill-me
description: Align before planning. Use before any non-trivial plan, build, or redesign — interview the human one question at a time, recommend an answer for each, surface the hidden/unstated decisions, and only plan once aligned. Prevents confidently building the wrong thing.
---

# Grill-me — align before you plan

The most expensive mistake is a confident build in the wrong direction. Before planning anything non-trivial, align — don't assume.

## Method
1. **List the decisions the work depends on** — including the ones the human hasn't stated (hidden assumptions, scope edges, the real trade-off).
2. **Ask, recommending.** One decision at a time; for each, give your recommended answer + the one-line why. Don't make them think from a blank page.
3. **Surface the unsaid:** "You didn't mention X — I'm assuming Y because Z. Correct?"
4. **Stop when aligned.** Once the remaining unknowns won't change the plan, stop. Over-grilling is its own failure.
5. **Then plan**, citing the locked decisions.

## When
Any multi-step build, redesign, or ambiguous ask. Skip for trivial, fully-specified tasks.

## In ROS
Use `AskUserQuestion` for the batch (recommended-answer first). Output a short **locked-decisions** list the plan/spec references. This is the front of the Matt-Pocock loop: align → destination-PRD → vertical slices → verify → feedback.
