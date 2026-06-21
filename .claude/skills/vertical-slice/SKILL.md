---
name: vertical-slice
description: Break work into independently-shippable vertical slices that each cross all layers and emit a real, judgeable artifact. Use when planning any multi-step build so each step ships value and the feedback loop tightens — the antidote to generating everything and verifying nothing.
---

# Vertical slice — ship value, get feedback, repeat

A vertical slice crosses every layer (data → logic → surface) and produces one real artifact you can judge. Horizontal work — all the docs, then all the wiring, then all the polish — emits no feedback until the end. That is how sprawl and slop happen.

## Method
1. **Name the destination** briefly (the outcome / mini-PRD).
2. **Cut into slices** that are each independently shippable and emit feedback. Order by value × learning.
3. **Build ONE slice end-to-end.** Verify it: run [de-slop](../de-slop/SKILL.md) + the domain Definition-of-Done. Show the artifact.
4. **Feed the learning forward.** Re-cut the remaining slices if the signal says so.
5. **Feedback-loop quality is the ceiling** on output — make each slice emit a clear, fast signal.

## When
Any build with more than one step. Especially after a "go" — resist generating the whole thing; ship slice one, get judged, continue.

## In ROS
A slice = a real deliverable (an IC memo, a working loop, a shipped fix), never "a set of docs." The CILs and meshes plan in slices; the human judges each.
