# MKT Marketing Backlog — Canonical

**The one ranked operating backlog for the [MKT Content Mesh](MESH.md).** Covers **Guy's personal brand + HollandVest only** — this is the company interface a marketing push or release train pulls from. Owner: `mkt-lead`. Reports to ros-conductor (CoS).

> **Model:** mirrors Arbor's `AM-` backlog ([PAI MARKETING-BACKLOG.md](../../PAI/projects/parenting-os-plugin/mesh/marketing/MARKETING-BACKLOG.md)) and the company [BACKLOG-MODEL.md](../../00_System/release-engineering/BACKLOG-MODEL.md). Each item carries a stable **`MKT-NNN`** id, a **lane**, an **owner**, a **status**, and a **gate-tag**, and back-references its source. Items are ranked within each lane. Execution standard + DoD gate are not restated here — they live in [MESH.md](MESH.md) (the gate) and the [ROS Agent Framework](../../00_System/agent-framework/FRAMEWORK.md) (the loop); `/de-slop` is run on every asset before delivery.

## Legend

- **Lane** — `BRAND` (Guy personal) · `HV` (HollandVest) · `OPS` (engine/calendar/voice) · `ARBOR-COORD` (coordination only; the build/asset work lives in the [Arbor marketing backlog](../../PAI/projects/parenting-os-plugin/mesh/marketing/MARKETING-BACKLOG.md), not here).
- **Gate-tag** — `safe` = autonomous draft + ship to owned organic surface · `L3` = draft-only, outbound to people/external publish stops for Guy · `L4` = spend, state amount · `EA` = EA-confidentiality check required before any client-derived content.
- **Status** — `OPEN` · `IN-FLIGHT` · `BLOCKED` (on whom) · `DONE`.

---

## 1. NOW — In-Flight

| ID | Item | Lane | Owner | Gate | Status | Source |
| :-- | :-- | :-- | :-- | :-- | :-- | :-- |
| MKT-001 | **Arbor viral launch / PlayKit visual direction** — Israel-first TikTok/Reels/Shorts/IG + creator seeding. Asset work is **owned by the Arbor marketing mesh**; MKT coordinates timing/cross-post into Guy's personal channels only. Next on the Arbor side: deterministic Hebrew overlays → 9:16 video cuts (HeyGen/CapCut). | ARBOR-COORD | `arbor-marketing-lead` (Arbor) ↔ `mkt-lead` | L3 (publish) | IN-FLIGHT — tracked in Arbor backlog §0; MKT does not duplicate | MKT/MEMORY active campaigns; visual lang `PAI/.../marketing/arbor-playkit-visual-language-2026-06-20.md`; assets `PAI/.../marketing/assets/arbor-playkit-viral-2026-06-20/` |
| MKT-002 | **Arbor copy asset pack (2026-06-21)** — 4 assets written by arbor-content (hero/landing HE+EN, paywall HE+EN, IL creator brief HE, "Sturdy Parenting" manifesto HE+EN). MKT coordination only; awaiting native-HE review + arbor-safety sign-off + real social-proof quotes on the Arbor side. | ARBOR-COORD | `arbor-content` (Arbor) ↔ `mkt-lead` | L3 (publish) | IN-FLIGHT — tracked in Arbor backlog §4 (P0-9, P1-13); MKT does not duplicate | MKT/MEMORY active campaigns; `PAI/.../marketing/assets/` (arbor-hero-landing-copy / arbor-paywall-copy / arbor-creator-brief-he / arbor-manifesto) |

> **Why these are coordination, not MKT-owned build:** per [MESH.md](MESH.md) boundaries and `MKT/CLAUDE.md`, Arbor marketing is owned by the Arbor mesh under PAI. The two campaigns were floating loose in `MKT/MEMORY.md`; they are seeded here with stable ids so the company interface shows them, but the canonical build state lives in the Arbor backlog (no duplicate tracking — DRY).

---

## 2. BRAND — Guy Rubin Personal (Ranked)

| ID | Item | Owner | Gate | Status | Source |
| :-- | :-- | :-- | :-- | :-- | :-- |
| MKT-010 | **Personal-brand voice profile** — calibrate `mkt-lead` to Guy's real voice from sent LinkedIn posts/newsletter (run `/voice-extract`) so every BRAND asset is on-voice, not generic. Prerequisite for autonomous drafting. | `mkt-lead` | safe | OPEN — no voice profile exists in `MKT/MEMORY.md` yet | MESH.md gate (on-brand voice) |
| MKT-011 | **LinkedIn cadence + content calendar** — stand up a 4-week rolling calendar (1–2 posts/wk) on Guy's positioning pillars; draft-only queue, publish gated. | `mkt-lead` → `mkt-content` | L3 (publish) | OPEN | MKT mesh weekly cadence (MESH.md Loops) |
| MKT-012 | **Thought-leadership slate** — draft 3 LinkedIn posts on the LLM-agnostic-OS / multi-agent operating thesis (Guy's distinctive POV); one piece per scoped dispatch of `mkt-content`. | `mkt-content` | L3 (publish) | OPEN | BRAND positioning |

---

## 3. HV — HollandVest Brand (Ranked)

| ID | Item | Owner | Gate | Status | Source |
| :-- | :-- | :-- | :-- | :-- | :-- |
| MKT-020 | **HollandVest positioning + voice profile** — define the HV brand voice (EU dual-exit development engine / "underwrite the discount not the pro-forma" thesis) and seed it into `MKT/MEMORY.md`. HV brand is "Building" per memory — this unblocks all HV assets. | `mkt-lead` (coordinate with HV) | safe | OPEN — HV brand status = Building | MKT/MEMORY brand identities |
| MKT-021 | **HollandVest LinkedIn presence** — draft launch slate (deal-thesis credibility posts, no live deal data; HV sends from `bhollandvest@gmail.com` identity). | `mkt-content` | L3 (publish) | OPEN | HV MEMORY (dev-engine thesis) |

---

## 4. OPS — Engine, Calendar, Voice (Ranked)

| ID | Item | Owner | Gate | Status | Source |
| :-- | :-- | :-- | :-- | :-- | :-- |
| MKT-030 | **Content backlog + audience-notes hygiene** — `MKT/MEMORY.md` §Content backlog and §Audience notes are empty stubs. As BRAND/HV items ship, log what resonates so the backlog gets a real prioritization signal. | `mkt-lead` | safe | OPEN | MKT/MEMORY empty sections |
| MKT-031 | **Weekly MKT cadence loop registration** — the MKT Content cadence loop is *proposed, draft-only* in [SCHEDULED-LOOPS.md](../../00_System/agent-framework/SCHEDULED-LOOPS.md) but not registered on a runtime. Decide go/no-go and (if go) register via `scheduled-tasks`. | `mkt-lead` → Guy | L3 (Guy registers) | OPEN — proposed, not live | MESH.md Loops; SCHEDULED-LOOPS.md |

---

## 5. Source Docs Consolidated (Now Inputs)

- `MKT/MEMORY.md` §Active campaigns → the two Arbor campaigns seeded as `MKT-001`/`MKT-002` (coordination refs; canonical state stays in the Arbor backlog).
- `MKT/MEMORY.md` §Brand identities → seeds the BRAND (`MKT-010`–`012`) and HV (`MKT-020`–`021`) lanes.
- `MKT/MEMORY.md` §Content backlog / §Audience notes → empty; tracked as `MKT-030` to populate.
- [MESH.md](MESH.md) → the roster, the Definition-of-Done gate, the skills table, and the proposed weekly loop (not restated here — DRY).

---

**Decision / next action:** ranked backlog stood up; the first real move is **`MKT-010` + `MKT-020`** — extract Guy's and HollandVest's voice profiles into `MKT/MEMORY.md`, because every other BRAND/HV item is gated on a voice profile that does not exist yet. Arbor work (`MKT-001/002`) stays owned by the Arbor mesh; MKT only coordinates cross-posting.
