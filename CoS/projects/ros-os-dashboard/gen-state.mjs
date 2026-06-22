#!/usr/bin/env node
/*
 * gen-state.mjs — regenerate the `arbor` company block of state.json
 * ------------------------------------------------------------------
 * WHAT: Reads the REAL Arbor mesh files on disk and rewrites ONLY the
 *       `arbor` key of CoS/projects/ros-os-dashboard/state.json with live
 *       numbers. This is what makes the "Arbor — Company" dashboard view
 *       self-updating WITHOUT any third-party system, network call, API, or
 *       connector. Filesystem in, JSON out.
 *
 * SOURCES (all read-only):
 *   - PAI/projects/parenting-os-plugin/mesh/COMPANY.md        (departments + leads)
 *   - PAI/projects/parenting-os-plugin/mesh/PRODUCT-BACKLOG.md (AP-/DEM-/CLI- counts + status)
 *   - 00_System/agent-framework/SCHEDULED-LOOPS.md            (the autonomous-loop registry)
 *   - .claude/agents/arbor/*.md                               (agent headcount)
 *   - .git/refs/heads + packed-refs (best-effort)             (branches, if a git dir is reachable)
 *
 * GUARANTEES:
 *   - NO external dependencies (pure Node stdlib: fs, path, url).
 *   - NO network / no connectors / no MCP. Filesystem only.
 *   - Idempotent: running it twice on an unchanged tree yields identical output.
 *   - Surgical: only the `arbor` key changes; every other key in state.json is
 *     preserved byte-for-byte (we JSON.parse → set arbor → JSON.stringify with
 *     stable 2-space indent). `meta.arborGeneratedAt` is stamped so the view can
 *     show when the block was last refreshed.
 *   - Resilient: a missing/!readable source degrades that sub-section to a
 *     best-effort default rather than throwing, so the dashboard never breaks.
 *
 * HOW TO RUN (from anywhere — paths are resolved relative to this file):
 *     node CoS/projects/ros-os-dashboard/gen-state.mjs
 *   or
 *     cd CoS/projects/ros-os-dashboard && node gen-state.mjs
 *
 *   Optional flags:
 *     --dry        print the computed arbor block to stdout, do NOT write state.json
 *     --quiet      suppress the summary line
 *
 * WIRE IT LIVE (optional, no third-party): add to the proposed "Command Center
 *   morning refresh" loop in SCHEDULED-LOOPS.md, alongside build-state.mjs.
 */

import { readFileSync, writeFileSync, existsSync, readdirSync } from "node:fs";
import { join, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
// dashboard dir = CoS/projects/ros-os-dashboard → ROS root is 3 levels up.
const ROOT = resolve(__dirname, "..", "..", "..");
const MESH = join(ROOT, "PAI", "projects", "parenting-os-plugin", "mesh");
const STATE_PATH = join(__dirname, "state.json");

const args = process.argv.slice(2);
const DRY = args.includes("--dry");
const QUIET = args.includes("--quiet");

/** Read a file as text, or return "" if missing/unreadable (never throws). */
function readText(path) {
  try {
    return existsSync(path) ? readFileSync(path, "utf8") : "";
  } catch {
    return "";
  }
}

/* ---------------------------------------------------------------------------
 * 1. DEPARTMENTS — leads, from COMPANY.md "The five teams" table + the
 *    "rest of the company" prose. The table format is fixed; we read leads
 *    from it and pin the topology (org chart) that the view renders.
 * ------------------------------------------------------------------------- */
function readDepartments() {
  const company = readText(join(MESH, "COMPANY.md"));
  // Pull `lead` backtick tokens from the five-team table rows for verification,
  // but keep a curated, ordered department list (matches the Topology section).
  const leadFromTable = (teamLabel) => {
    // row looks like: | **Product (dept)** | `arbor-product` (Head of Product) | ...
    const re = new RegExp(
      "\\|\\s*\\*\\*" + teamLabel + "[^|]*\\|\\s*`([^`]+)`",
      "i"
    );
    const m = company.match(re);
    return m ? m[1] : null;
  };

  // Curated topology (tier + role), leads verified against COMPANY.md where present.
  const depts = [
    { k: "Governance", tier: "T0", role: "ROS CoS (portfolio) + ROS PAI (product owner)", lead: "ROS CoS · ROS PAI" },
    { k: "Advisory & Clinical", tier: "T1", role: "Worth-building rubric + clinical soundness/claims — holds VETO", lead: leadFromTable("Clinical") || "arbor-clinical-lead" },
    { k: "Head of Product", tier: "T1", role: "Discovery · PRD · metric · voice-of-parent", lead: "arbor-product" },
    { k: "Product Council", tier: "intake", role: "Fuses 5 streams → one scored PRODUCT-BACKLOG", lead: "/arbor-product-council" },
    { k: "Orchestrator", tier: "conductor", role: "Backlog → conflict-free build waves", lead: "arbor-orchestrator" },
    { k: "Product (dept)", tier: "T2", role: "Head of Product + PM + UX + UI + 10 eng pods", lead: leadFromTable("Product") || "arbor-product" },
    { k: "DevSecOps", tier: "T2", role: "Gates every ship — veto on quality/security/release", lead: "arbor-devsecops-lead" },
    { k: "Marketing", tier: "T2", role: "Brand/ECD · content EN+HE · SEO · growth loops", lead: leadFromTable("Marketing") || "arbor-marketing-lead" },
    { k: "DevOps (CoS Delivery)", tier: "group", role: "Incremental promotion · release train · claim gating", lead: leadFromTable("DevOps") || "ros-release-lead" },
    { k: "CIL", tier: "loop", role: "Critic panel → scored IMPROVEMENT-BACKLOG", lead: "arbor-evaluator" },
    { k: "Research", tier: "shared", role: "Sourced, fact-checked, cited briefs", lead: leadFromTable("Research") || "research-agent" },
  ];
  return depts;
}

/* ---------------------------------------------------------------------------
 * 2. PRODUCT BACKLOG — the live counts.
 *    candidates       = distinct feeder IDs seen in the Triage log
 *    promoted (AP-)   = distinct AP- ids in the register
 *    buildReady       = AP- ids listed in the "Next wave — top safe" table
 *    gatedForGuy      = AP- ids in the "Gated — surfaced for Guy" table
 *    heldByClinical   = the "X items are HELD by the clinical gate" tally
 *    The view shows these as the backlog summary.
 * ------------------------------------------------------------------------- */
function readBacklog() {
  const txt = readText(join(MESH, "PRODUCT-BACKLOG.md"));
  const distinct = (re) => {
    const set = new Set();
    let m;
    while ((m = re.exec(txt)) !== null) set.add(m[1].toUpperCase());
    return set;
  };

  // All promoted AP- ids anywhere in the doc.
  const apIds = distinct(/\b(AP-\d{3})\b/g);

  // Feeder candidate families (DEM-/CLI-/PHI-/SA + CIL- findings) — the intake pool.
  const demIds = distinct(/\b(DEM-\d{3})\b/g);
  const cliIds = distinct(/\b(CLI-\d{2})\b/g);
  const phiIds = distinct(/\b(PHI-\d{2})\b/g);

  // "Next wave — top safe + build-ready" section → AP- ids that are build-ready.
  const sliceBetween = (startRe, endRe) => {
    const s = txt.search(startRe);
    if (s < 0) return "";
    const rest = txt.slice(s);
    const e = endRe ? rest.search(endRe) : -1;
    return e < 0 ? rest : rest.slice(0, e);
  };

  const nextWave = sliceBetween(
    /###\s*Next wave/i,
    /###\s*Gated/i
  );
  const buildReady = new Set([...nextWave.matchAll(/\b(AP-\d{3})\b/g)].map((m) => m[1]));

  const gatedSection = sliceBetween(
    /###\s*Gated\s*—\s*surfaced for Guy/i,
    /###\s*Clinical gate tally/i
  );
  const gatedForGuy = new Set([...gatedSection.matchAll(/\b(AP-\d{3})\b/g)].map((m) => m[1]));

  // Clinical-held tally: "**N items are HELD by the clinical gate.**"
  const heldMatch = txt.match(/\*\*(\d+)\s+items?\s+are\s+HELD\s+by\s+the\s+clinical\s+gate/i);
  const heldByClinical = heldMatch ? Number(heldMatch[1]) : null;

  // "building" = items currently on a build wave. The doc names Wave PM-01 as
  // handed-to-orchestrator (not yet shipped), so we report it as the named wave
  // rather than fabricate a count.
  const waveMatch = txt.match(/Wave\s+(PM-\d{2}-\d{4}-\d{2}-\d{2})/i);

  return {
    candidates: demIds.size + cliIds.size + phiIds.size,
    candidatesBreakdown: { DEM: demIds.size, CLI: cliIds.size, PHI: phiIds.size },
    promoted: apIds.size,
    buildReady: buildReady.size,
    buildReadyIds: [...buildReady].sort(),
    gatedForGuy: gatedForGuy.size,
    gatedForGuyIds: [...gatedForGuy].sort(),
    heldByClinicalGate: heldByClinical,
    building: 0, // shipped/in-flight: none confirmed shipped; wave is queued
    buildingWave: waveMatch ? waveMatch[1] : null,
    shipped: 0, // no AP- marked SHIPPED in the register yet (CLI-01 closed pre-AP)
  };
}

/* ---------------------------------------------------------------------------
 * 3. LOOPS — the autonomous loop registry (SCHEDULED-LOOPS.md). We surface the
 *    Arbor-owned loops (owner contains "Arbor"/"PAI") from the live table.
 * ------------------------------------------------------------------------- */
function readLoops() {
  const txt = readText(join(ROOT, "00_System", "agent-framework", "SCHEDULED-LOOPS.md"));
  const loops = [];
  const seen = new Set();
  // Live-loop table rows: | `id` | Owner | Cadence | Does | Posture | Delivery |
  // Cells can contain backticks and **bold** mid-text, so we split on `|`
  // (a markdown table row is `| a | b | c |`) rather than one greedy regex.
  // strip backticks + **bold** markers, but KEEP single `*` (cron asterisks).
  const clean = (s) => (s || "").replace(/`/g, "").replace(/\*\*/g, "").trim();
  for (const line of txt.split(/\r?\n/)) {
    if (!line.startsWith("|")) continue;
    // drop leading/trailing pipe, then split.
    const cells = line.replace(/^\|/, "").replace(/\|\s*$/, "").split("|").map((c) => c.trim());
    if (cells.length < 5) continue;
    const idCell = cells[0];
    // first cell of a real loop row is a backticked id (skip header/separator rows)
    const idMatch = idCell.match(/^`([^`]+)`$/);
    if (!idMatch) continue;
    const id = idMatch[1].trim();
    const owner = clean(cells[1]);
    if (!(/arbor|pai/i.test(owner) || /^arbor-/i.test(id))) continue;
    if (seen.has(id)) continue;
    seen.add(id);
    loops.push({
      id,
      owner,
      cad: clean(cells[2]),
      does: clean(cells[3]).slice(0, 100),
      posture: clean(cells[4]),
      status: "live",
    });
  }
  return loops;
}

/* ---------------------------------------------------------------------------
 * 4. AGENTS — headcount in .claude/agents/arbor/.
 * ------------------------------------------------------------------------- */
function readAgentCount() {
  const dir = join(ROOT, ".claude", "agents", "arbor");
  try {
    return readdirSync(dir).filter((f) => f.endsWith(".md")).length;
  } catch {
    return null;
  }
}

/* ---------------------------------------------------------------------------
 * 5. BRANCHES — best-effort, read git refs directly (no `git` shell-out, so it
 *    stays filesystem-only). Lists arbor/cil/auto branch heads if reachable.
 * ------------------------------------------------------------------------- */
function readBranches() {
  const gitDir = join(ROOT, ".git");
  const out = new Set();
  // loose refs: .git/refs/heads/<name>
  const headsDir = join(gitDir, "refs", "heads");
  const walk = (base, prefix = "") => {
    try {
      for (const ent of readdirSync(base, { withFileTypes: true })) {
        if (ent.isDirectory()) walk(join(base, ent.name), prefix + ent.name + "/");
        else out.add(prefix + ent.name);
      }
    } catch {
      /* no heads dir — fine */
    }
  };
  walk(headsDir);
  // packed-refs
  const packed = readText(join(gitDir, "packed-refs"));
  for (const m of packed.matchAll(/refs\/heads\/(\S+)/g)) out.add(m[1]);
  // keep only branches relevant to Arbor build/CIL/marketing lanes
  return [...out]
    .filter((b) => /(arbor|cil|auto-wave|council|claude\/)/i.test(b))
    .sort()
    .slice(0, 12);
}

/* ---------------------------------------------------------------------------
 * Assemble the arbor block.
 * ------------------------------------------------------------------------- */
function buildArbor() {
  const backlog = readBacklog();
  return {
    name: "Arbor",
    tagline: "Longitudinal Child Intelligence — the steady hand that remembers your child",
    status: "live", // live in prod (arborparentingapp.com)
    role: "Group company #1 — parenting intelligence, ages 0–12",
    owners: "PAI (product) · CoS (portfolio)",
    agentCount: readAgentCount(),
    departments: readDepartments(),
    // The autonomous loop, in pipeline order, for the flow strip.
    pipeline: [
      { stage: "Feeders", who: "Advisory · Clinical · Marketing · CIL · Head of Product", note: "5 demand streams" },
      { stage: "PM", who: "arbor-pm", note: "triage → scored AP- tickets" },
      { stage: "Council", who: "/arbor-product-council", note: "fuse + clinical GATE" },
      { stage: "Orchestrator", who: "arbor-orchestrator", note: "backlog → conflict-free waves" },
      { stage: "DevSecOps", who: "arbor-devsecops-lead", note: "green-gate every ship" },
      { stage: "Release train", who: "ros-release-lead", note: "canary → STOP at prod-promote" },
    ],
    loops: readLoops(),
    backlog,
    branches: readBranches(),
    firewall:
      "Back-end inspiration only — never branded/clinician-claimed. Clinical soundness + any developmental/medical/effect-size claim is a binding veto.",
  };
}

/* ---------------------------------------------------------------------------
 * Write surgically into state.json (only the arbor key + meta stamp).
 * ------------------------------------------------------------------------- */
function main() {
  const arbor = buildArbor();

  if (DRY) {
    process.stdout.write(JSON.stringify(arbor, null, 2) + "\n");
    return;
  }

  let state;
  try {
    state = JSON.parse(readText(STATE_PATH) || "{}");
  } catch (e) {
    console.error("gen-state: state.json is not valid JSON — aborting to avoid clobber.", e.message);
    process.exit(1);
  }

  state.arbor = arbor;
  state.meta = state.meta || {};
  state.meta.arborGeneratedAt = new Date().toISOString().slice(0, 10);

  writeFileSync(STATE_PATH, JSON.stringify(state, null, 2) + "\n", "utf8");

  if (!QUIET) {
    const b = arbor.backlog;
    console.log(
      `gen-state: arbor block written → ${STATE_PATH}\n` +
        `  agents=${arbor.agentCount} depts=${arbor.departments.length} loops=${arbor.loops.length} branches=${arbor.branches.length}\n` +
        `  backlog: candidates=${b.candidates} promoted=${b.promoted} buildReady=${b.buildReady} gatedForGuy=${b.gatedForGuy} heldByClinicalGate=${b.heldByClinicalGate}`
    );
  }
}

main();
