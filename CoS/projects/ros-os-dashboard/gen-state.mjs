#!/usr/bin/env node
/*
 * gen-state.mjs — regenerate state.json for the Operations Room cockpit
 * ---------------------------------------------------------------------
 * WHAT: Reads the REAL ROS markdown files on disk and rewrites state.json
 *       with live, truthful numbers. Filesystem in, JSON out. No network,
 *       no MCP, no connector. This is what makes the cockpit self-updating
 *       with zero third-party dependency.
 *
 * THE TRUTH LAYER (why this file is strict):
 *   - readBacklog() EXCLUDES any AP- id whose source line is struck
 *     (`~~`), RETRACTED, or DROPPED. AP-006 was retracted 2026-06-22 — it
 *     MUST NOT appear in buildReady. Re-run and buildReady is 8, not 9.
 *   - Every write stamps meta.updated = today AND meta.sections.<k>.updatedAt
 *     read from each source file's "Last updated" line (fallback: mtime), so
 *     the UI can show an amber freshness pill when a section goes stale.
 *
 * SOURCES (all read-only):
 *   - PAI/.../mesh/COMPANY.md             departments + leads
 *   - PAI/.../mesh/PRODUCT-BACKLOG.md     AP-/DEM-/CLI- counts + status
 *   - 00_System/agent-framework/SCHEDULED-LOOPS.md  loop registry (live vs proposed)
 *   - 00_System/connectors.md             connector registry + capitalization table
 *   - 00_System/release-engineering/RELEASE-LEDGER.md  active trains
 *   - 00_System/companies.md              company registry (kind: company / domain / HQ)
 *   - .claude/agents/arbor/*.md           agent headcount
 *
 * HOW TO RUN:
 *     node CoS/projects/ros-os-dashboard/gen-state.mjs
 *   Flags: --dry (print, do not write) · --quiet (suppress summary)
 */

import { readFileSync, writeFileSync, existsSync, readdirSync, statSync } from "node:fs";
import { join, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..", "..", "..");
const MESH = join(ROOT, "PAI", "projects", "parenting-os-plugin", "mesh");
const SYS = join(ROOT, "00_System");
const STATE_PATH = join(__dirname, "state.json");

const args = process.argv.slice(2);
const DRY = args.includes("--dry");
const QUIET = args.includes("--quiet");

const TODAY = new Date().toISOString().slice(0, 10);

function readText(path) {
  try { return existsSync(path) ? readFileSync(path, "utf8") : ""; }
  catch { return ""; }
}

/** Read the "Last updated:" stamp from a file, falling back to its mtime date. */
function sectionStamp(path) {
  const txt = readText(path);
  const m = txt.match(/Last updated:?\s*\**\s*(\d{4}-\d{2}-\d{2})/i)
    || txt.match(/\*\*Last updated:\*\*\s*(\d{4}-\d{2}-\d{2})/i)
    || txt.match(/Created:?\**\s*(\d{4}-\d{2}-\d{2})/i);
  if (m) return m[1];
  try { return statSync(path).mtime.toISOString().slice(0, 10); }
  catch { return null; }
}

/* ── 1. DEPARTMENTS — leads from COMPANY.md, pinned topology ──────────── */
function readDepartments() {
  const company = readText(join(MESH, "COMPANY.md"));
  const leadFromTable = (teamLabel) => {
    const re = new RegExp("\\|\\s*\\*\\*" + teamLabel + "[^|]*\\|\\s*`([^`]+)`", "i");
    const m = company.match(re);
    return m ? m[1] : null;
  };
  return [
    { k: "Governance", tier: "T0", role: "ROS CoS (portfolio) + ROS PAI (product owner)", lead: "ROS CoS · ROS PAI" },
    { k: "Advisory & Clinical", tier: "T1", role: "Worth-building rubric + clinical soundness/claims — holds veto", lead: leadFromTable("Clinical") || "arbor-clinical-lead" },
    { k: "Head of Product", tier: "T1", role: "Discovery · PRD · metric · voice-of-parent", lead: "arbor-product" },
    { k: "Product Council", tier: "intake", role: "Fuses 5 streams into one scored PRODUCT-BACKLOG", lead: "/arbor-product-council" },
    { k: "Orchestrator", tier: "conductor", role: "Backlog into conflict-free build waves", lead: "arbor-orchestrator" },
    { k: "Product (dept)", tier: "T2", role: "Head of Product + PM + UX + UI + 10 eng pods", lead: leadFromTable("Product") || "arbor-product" },
    { k: "DevSecOps", tier: "T2", role: "Gates every ship — veto on quality/security/release", lead: "arbor-devsecops-lead" },
    { k: "Marketing", tier: "T2", role: "Brand/ECD · content EN+HE · SEO · growth loops", lead: leadFromTable("Marketing") || "arbor-marketing-lead" },
    { k: "DevOps (CoS Delivery)", tier: "group", role: "Incremental promotion · release train · claim gating", lead: "ros-release-lead" },
    { k: "CIL", tier: "loop", role: "Critic panel into scored IMPROVEMENT-BACKLOG", lead: "arbor-evaluator" },
    { k: "Research", tier: "shared", role: "Sourced, fact-checked, cited briefs", lead: "research-agent" },
  ];
}

/* ── 2. PRODUCT BACKLOG — the live counts, with strikethrough exclusion ─ */
const STRUCK = /~~|retract|dropped/i;

function readBacklog() {
  const txt = readText(join(MESH, "PRODUCT-BACKLOG.md"));
  const lines = txt.split(/\r?\n/);

  // Collect AP- ids, but EXCLUDE any id whose line is struck/retracted/dropped.
  const apIds = new Set();
  const droppedIds = new Set();
  for (const line of lines) {
    const struck = STRUCK.test(line);
    for (const m of line.matchAll(/\b(AP-\d{3})\b/g)) {
      const id = m[1].toUpperCase();
      if (struck) droppedIds.add(id);
      else apIds.add(id);
    }
  }
  // An id that ever appears struck is retired everywhere (AP-006).
  for (const d of droppedIds) apIds.delete(d);

  const distinct = (re) => {
    const set = new Set();
    let m;
    while ((m = re.exec(txt)) !== null) set.add(m[1].toUpperCase());
    return set;
  };
  const demIds = distinct(/\b(DEM-\d{3})\b/g);
  const cliIds = distinct(/\b(CLI-\d{2})\b/g);
  const phiIds = distinct(/\b(PHI-\d{2})\b/g);

  const sliceBetween = (startRe, endRe) => {
    const s = txt.search(startRe);
    if (s < 0) return "";
    const rest = txt.slice(s);
    const e = endRe ? rest.search(endRe) : -1;
    return e < 0 ? rest : rest.slice(0, e);
  };

  // Build-ready = AP- ids in the "Next wave" table, struck rows excluded line-by-line.
  const nextWave = sliceBetween(/###\s*Next wave/i, /###\s*Gated/i);
  const buildReady = new Set();
  for (const line of nextWave.split(/\r?\n/)) {
    if (STRUCK.test(line)) continue;
    for (const m of line.matchAll(/\b(AP-\d{3})\b/g)) buildReady.add(m[1].toUpperCase());
  }
  for (const d of droppedIds) buildReady.delete(d);

  const gatedSection = sliceBetween(/###\s*Gated\s*—\s*surfaced for Guy/i, /###\s*Clinical gate tally/i);
  const gatedForGuy = new Set();
  for (const line of gatedSection.split(/\r?\n/)) {
    if (STRUCK.test(line)) continue;
    for (const m of line.matchAll(/\b(AP-\d{3})\b/g)) gatedForGuy.add(m[1].toUpperCase());
  }
  for (const d of droppedIds) gatedForGuy.delete(d);

  const heldMatch = txt.match(/\*\*(\d+)\s+items?\s+are\s+HELD\s+by\s+the\s+clinical\s+gate/i);
  const heldByClinical = heldMatch ? Number(heldMatch[1]) : null;
  const waveMatch = txt.match(/Wave\s+(PM-\d{2}-\d{4}-\d{2}-\d{2})/i);

  // Build-ready ticket details (id → title) for the drawer, from the Next wave table.
  const readyTickets = [];
  for (const line of nextWave.split(/\r?\n/)) {
    if (STRUCK.test(line) || !line.startsWith("|")) continue;
    const cells = line.replace(/^\|/, "").replace(/\|\s*$/, "").split("|").map((c) => c.trim());
    const id = (cells.find((c) => /^AP-\d{3}$/.test(c)) || "");
    if (!id || droppedIds.has(id)) continue;
    const title = cells.length >= 3 ? cells[2] : "";
    readyTickets.push({ id, title });
  }

  return {
    candidates: demIds.size + cliIds.size + phiIds.size,
    candidatesBreakdown: { DEM: demIds.size, CLI: cliIds.size, PHI: phiIds.size },
    promoted: apIds.size,
    buildReady: buildReady.size,
    buildReadyIds: [...buildReady].sort(),
    buildReadyTickets: readyTickets,
    gatedForGuy: gatedForGuy.size,
    gatedForGuyIds: [...gatedForGuy].sort(),
    heldByClinicalGate: heldByClinical,
    droppedIds: [...droppedIds].sort(),
    building: 0,
    buildingWave: waveMatch ? waveMatch[1] : null,
    shipped: 0,
  };
}

/* ── 3. LOOPS — honest live-vs-proposed from the registry's own split ──── */
function readLoops() {
  const txt = readText(join(SYS, "agent-framework", "SCHEDULED-LOOPS.md"));
  const loops = [];
  const seen = new Set();
  const clean = (s) => (s || "").replace(/`/g, "").replace(/\*\*/g, "").trim();

  // The doc has two tables: a "Live loops" table and a "Proposed loops" table.
  // We track which section we're in so status is read from the doc, never hardcoded.
  let section = null; // "live" | "proposed"
  for (const raw of txt.split(/\r?\n/)) {
    const line = raw.trim();
    if (/^##\s+Live loops/i.test(line)) { section = "live"; continue; }
    if (/^##\s+Proposed loops/i.test(line)) { section = "proposed"; continue; }
    if (/^##\s+Rules/i.test(line)) { section = null; continue; }
    if (!section || !line.startsWith("|")) continue;

    const cells = line.replace(/^\|/, "").replace(/\|\s*$/, "").split("|").map((c) => c.trim());
    if (cells.length < 4) continue;

    if (section === "live") {
      const idMatch = cells[0].match(/^`([^`]+)`$/);
      if (!idMatch) continue; // header/separator/prose rows
      const id = idMatch[1].trim();
      if (seen.has(id)) continue;
      seen.add(id);
      const delivery = clean(cells[5] || "");
      // A live-table row can still be "active"/"enabled"/"verified" — that IS live.
      const live = /✅|enabled|active|verified|live/i.test(delivery);
      loops.push({
        id,
        owner: clean(cells[1]),
        cad: clean(cells[2]),
        does: clean(cells[3]).slice(0, 120),
        posture: clean(cells[4]),
        last: delivery.slice(0, 80),
        status: live ? "live" : "proposed",
      });
    } else {
      // Proposed table: | Proposed | Owner | Cadence | Would do | Why |
      const name = clean(cells[0]);
      if (!name || /^proposed$/i.test(name) || /^:?-/.test(name)) continue;
      const id = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
      if (seen.has(id)) continue;
      seen.add(id);
      loops.push({
        id,
        owner: clean(cells[1]),
        cad: clean(cells[2]),
        does: clean(cells[3] || "").slice(0, 120),
        posture: "read-report",
        last: "not live — awaiting Guy",
        status: "proposed",
      });
    }
  }
  return loops;
}

/* ── 4. CONNECTORS — registry + capitalization stacks ─────────────────── */
// The connectors model is too nuanced (per-connector feeds + the exact Guy-gated
// step + the capitalization-stack hierarchy) to scrape reliably from the table.
// It is authored here as the canonical, file-derived snapshot — kept in lockstep
// with 00_System/connectors.md. (gen-state owns the structured form; the .md is prose.)
function buildConnectors() {
  return [
    { name: "Gmail — bguy.rubin@gmail.com", cat: "Google Workspace (comms)", owner: "CoS, KK, EA, PAI, MKT", status: "connected",
      feeds: "Inbox triage, executive follow-ups, cross-domain signals; KK morning routing loop; all drafted-not-sent outbound",
      action: "—", note: "THE connected MCP mail account (verified 2026-06-21) + Hermes himalaya. Draft first." },
    { name: "Gmail — bhollandvest@gmail.com", cat: "Google Workspace (comms)", owner: "HV, FIN-by-context", status: "connected",
      feeds: "HollandVest correspondence + third-party deal outbound",
      action: "—", note: "Hermes himalaya ONLY — not the MCP account. Needs a separate MCP grant for Cowork-side access." },
    { name: "Gmail — josephdoronrubin@gmail.com", cat: "Google Workspace (comms)", owner: "EA (Joseph as sender)", status: "connected",
      feeds: "EA/advisory correspondence when Joseph is primary",
      action: "—", note: "Hermes himalaya ONLY — not the MCP account. Needs a separate MCP grant." },
    { name: "Notion", cat: "Knowledge base", owner: "All domains (CoS canonical)", status: "connected",
      feeds: "Command Centers, Projects/Areas/Resources, HV deal DBs, PRD/task registry — the canonical second brain",
      action: "—", note: "fetch/create/update-by-ID work; query-data-sources is Enterprise-gated (read rows via Hermes or a saved view)." },
    { name: "Google Calendar", cat: "Google Workspace (scheduling)", owner: "KK", status: "connected",
      feeds: "Day planning, KK brief, event drafts (event creation is Level 3 — confirm)",
      action: "—", note: "Live via MCP on bguy.rubin. Hermes-side not wired (only if a scheduled loop needs it)." },
    { name: "Google Drive", cat: "Google Workspace (docs)", owner: "KK, HV, Career", status: "connected",
      feeds: "CV fact-source, HV 'Deals & Projects' folder, document intelligence",
      action: "—", note: "Live via MCP on bguy.rubin. Shares/deletes are workspace writes — confirm first." },
    { name: "GitHub", cat: "Engineering", owner: "PAI/Arbor, CoS Delivery", status: "needs-auth",
      feeds: "ROS repo + Arbor repo (guyrubin/PPPPtherapy-); release train, build waves, PRs",
      action: "Run authenticate (OAuth) — Guy completes the login to enable MCP-side issue/PR ops.", note: "git/gh work where configured already." },
    { name: "Gemini (Google AI)", cat: "AI runtime", owner: "PAI/Arbor (image+coach), any domain", status: "connected",
      feeds: "Generation, multimodal, large-context; Arbor's image-gen + coach path (AI-Studio key in Secret Manager)",
      action: "—", note: "Active. Both Guy and Joseph have subscriptions — capitalize Joseph's for Joseph-context work." },
    { name: "Web search + fetch", cat: "Research", owner: "KK research-agent, all", status: "connected",
      feeds: "CIL market/capability lenses, deep-research, due-diligence briefs",
      action: "—", note: "Baseline capability via WebSearch/WebFetch." },
    { name: "Slack", cat: "Comms hub", owner: "CoS, KK", status: "connected", stack: "lead",
      feeds: "Status + decisions-needed + the command/notify surface for the CEO cockpit",
      action: "—", note: "LEAD of the comms stack. Connected 2026-06-21, workspace 'ROS' (ros-5pu8645), user U0BCVJB86TS." },
    { name: "Ahrefs", cat: "Marketing/SEO", owner: "MKT, PAI/Arbor", status: "consent-pending", stack: "lead",
      feeds: "Keyword/competitor intel → Arbor market + capability critics; MKT SEO",
      action: "Finish the 2-click Allow, or paste the localhost:43667/callback URL to complete the OAuth.", note: "LEAD of the marketing/SEO stack. Guy logged in (free plan)." },
    { name: "Similarweb", cat: "Marketing/SEO", owner: "MKT, PAI/Arbor", status: "available", stack: "sibling", lead: "Ahrefs",
      feeds: "Traffic/competitor benchmarking — alternative if Ahrefs free plan doesn't fit",
      action: "Wire only if the lead doesn't fit — avoid clutter.", note: "Ahrefs sibling." },
    { name: "HubSpot", cat: "Marketing/SEO", owner: "MKT", status: "available", stack: "sibling", lead: "Ahrefs",
      feeds: "CRM / contact + campaign data",
      action: "Wire only if the lead doesn't fit — avoid clutter.", note: "Ahrefs-stack sibling (CRM)." },
    { name: "Amplitude", cat: "Product analytics", owner: "PAI/Arbor", status: "needs-workspace", stack: "lead",
      feeds: "Usage telemetry → Arbor CIL arbor-critic-feedback",
      action: "Decide: stand up an Amplitude org — Firestore sink (lib/analytics.ts) works today.", note: "LEAD of the analytics stack. Not signed in / may not be set up." },
    { name: "Pendo", cat: "Product analytics", owner: "PAI/Arbor", status: "available", stack: "sibling", lead: "Amplitude",
      feeds: "Product-usage analytics alternative",
      action: "Wire only if the lead doesn't fit — avoid clutter.", note: "Amplitude sibling." },
    { name: "Linear", cat: "Project management", owner: "KK, HV (deal exec), PAI, CoS", status: "needs-workspace", stack: "lead",
      feeds: "Task/issue backend beyond Notion",
      action: "Create a Linear workspace under bguy (name + region), then authenticate.", note: "LEAD of the PM stack. No workspace exists yet — use Notion until then." },
    { name: "Asana / ClickUp", cat: "Project management", owner: "KK, HV, PAI, CoS", status: "available", stack: "sibling", lead: "Linear",
      feeds: "Task/issue backend alternatives",
      action: "Wire only if the lead doesn't fit — avoid clutter.", note: "Linear siblings." },
    { name: "Canva", cat: "Creative", owner: "MKT, PAI/Arbor Marketing", status: "available",
      feeds: "Marketing creative, brand assets, viral-format design",
      action: "Authenticate when the marketing org starts producing — Guy completes login.", note: "MCP available; capitalize on first real creative need." },
    { name: "Figma", cat: "Creative", owner: "PAI/Arbor (UI/design system), MKT", status: "available",
      feeds: "Arbor UI specs, design-system tokens, dev handoff",
      action: "Wire when arbor-design/UI work needs file access; Guy completes OAuth on first use.", note: "MCP available." },
    { name: "HeyGen", cat: "Creative", owner: "MKT, PAI/Arbor Marketing", status: "available",
      feeds: "Short-form video / avatar video for viral marketing formats",
      action: "Wire only when the marketing video format (animated child-as-hero, AM-2) is in production.", note: "MCP available." },
    { name: "Browser / computer use", cat: "Automation", owner: "All", status: "available",
      feeds: "Web apps without a dedicated MCP, native apps (e.g. Funda bot-wall)",
      action: "Chrome MCP + computer-use require per-session request_access.", note: "No persistent setup." },
    { name: "Funda scraper", cat: "Real-estate", owner: "HV", status: "phase-later",
      feeds: "HV new-listing alerts / deal radar",
      action: "Phase 3 — not built; Funda has a bot-wall. Decision pending: revive the HV deal radar (stalled 06-05).", note: "Pick a sourcing path." },
  ];
}

/* ── 5. RELEASES — active trains from RELEASE-LEDGER.md ────────────────── */
function readReleases() {
  const txt = readText(join(SYS, "release-engineering", "RELEASE-LEDGER.md"));
  const releases = [];
  // Active trains table rows: | **REL-...** | Product | Stage | Items | ... |
  for (const raw of txt.split(/\r?\n/)) {
    const line = raw.trim();
    if (!line.startsWith("|") || !/REL-[A-Z]+-\d+/.test(line)) continue;
    const cells = line.replace(/^\|/, "").replace(/\|\s*$/, "").split("|").map((c) => c.trim());
    const clean = (s) => (s || "").replace(/\*\*/g, "").replace(/`/g, "").trim();
    const id = (clean(cells[0]).match(/REL-[A-Z]+-\d+/) || [])[0];
    if (!id || releases.some((r) => r.id === id)) continue;
    const stage = clean(cells[2] || "");
    releases.push({
      id,
      product: clean(cells[1] || ""),
      stage,
      shipped: /shipped|prod 100%|✅/i.test(stage),
      items: clean(cells[3] || ""),
      branch: clean(cells[4] || ""),
      nextGate: clean(cells[6] || ""),
    });
  }
  // Merge-lane lock state.
  const laneMatch = txt.match(/\*\*merge-lane\*\*\s*\|\s*([^|]+)/i);
  const lane = laneMatch ? laneMatch[1].replace(/[🟢🔴🟡]/g, "").trim() : "unknown";
  return { trains: releases, lane };
}

/* ── 6. COMPANIES — from companies.md, kind-aware (do not hardcode 4) ──── */
function readCompanies() {
  const txt = readText(join(SYS, "companies.md"));
  const companies = [];
  const clean = (s) => (s || "").replace(/\*\*/g, "").replace(/`/g, "").trim();
  for (const raw of txt.split(/\r?\n/)) {
    const line = raw.trim();
    if (!line.startsWith("|")) continue;
    const cells = line.replace(/^\|/, "").replace(/\|\s*$/, "").split("|").map((c) => c.trim());
    if (cells.length < 8) continue;
    const entity = clean(cells[0]);
    if (!entity || /^entity$/i.test(entity) || /^:?-+$/.test(entity)) continue;
    const kind = clean(cells[1]);
    if (!kind) continue;
    companies.push({
      entity,
      kind,
      owner: clean(cells[2]),
      backlog: clean(cells[4]),
      releaseLane: clean(cells[5]),
      isolation: clean(cells[7]),
      status: clean(cells[8] || ""),
    });
  }
  return companies;
}

function readAgentCount() {
  try {
    return readdirSync(join(ROOT, ".claude", "agents", "arbor")).filter((f) => f.endsWith(".md")).length;
  } catch { return null; }
}

function buildArbor() {
  return {
    name: "Arbor",
    tagline: "Longitudinal Child Intelligence — the steady hand that remembers your child",
    status: "live",
    role: "Group company #1 — parenting intelligence, ages 0–12",
    owners: "PAI (product) · CoS (portfolio)",
    agentCount: readAgentCount(),
    departments: readDepartments(),
    pipeline: [
      { stage: "Feeders", who: "Advisory · Clinical · Marketing · CIL · Head of Product", note: "5 demand streams" },
      { stage: "PM", who: "arbor-pm", note: "triage into scored AP- tickets" },
      { stage: "Council", who: "/arbor-product-council", note: "fuse + clinical gate" },
      { stage: "Orchestrator", who: "arbor-orchestrator", note: "backlog into conflict-free waves" },
      { stage: "DevSecOps", who: "arbor-devsecops-lead", note: "green-gate every ship" },
      { stage: "Release train", who: "ros-release-lead", note: "canary, then stop at prod-promote" },
    ],
    loops: readLoops().filter((l) => /arbor|pai/i.test(l.owner)),
    backlog: readBacklog(),
    firewall: "Back-end inspiration only — never branded/clinician-claimed. Clinical soundness + any developmental/medical/effect-size claim is a binding veto.",
  };
}

function main() {
  const sections = {
    companies: { file: "00_System/companies.md", updatedAt: sectionStamp(join(SYS, "companies.md")), staleAfter: 2 },
    backlog: { file: "PAI/.../mesh/PRODUCT-BACKLOG.md", updatedAt: sectionStamp(join(MESH, "PRODUCT-BACKLOG.md")), staleAfter: 2 },
    loops: { file: "00_System/agent-framework/SCHEDULED-LOOPS.md", updatedAt: sectionStamp(join(SYS, "agent-framework", "SCHEDULED-LOOPS.md")), staleAfter: 7 },
    connectors: { file: "00_System/connectors.md", updatedAt: sectionStamp(join(SYS, "connectors.md")), staleAfter: 7 },
    releases: { file: "00_System/release-engineering/RELEASE-LEDGER.md", updatedAt: sectionStamp(join(SYS, "release-engineering", "RELEASE-LEDGER.md")), staleAfter: 7 },
  };

  const arbor = buildArbor();
  const connectors = buildConnectors();
  const releases = readReleases();
  const companies = readCompanies();
  const loops = readLoops();

  if (DRY) {
    process.stdout.write(JSON.stringify({ arbor, connectors, releases, companies, loops, sections }, null, 2) + "\n");
    return;
  }

  let state;
  try { state = JSON.parse(readText(STATE_PATH) || "{}"); }
  catch (e) { console.error("gen-state: state.json is not valid JSON — aborting.", e.message); process.exit(1); }

  state.arbor = arbor;
  state.connectors = connectors;
  state.releaseLedger = releases;
  state.companyRegistry = companies;
  state.loops = loops;
  state.meta = state.meta || {};
  state.meta.updated = TODAY;
  state.meta.arborGeneratedAt = TODAY;
  state.meta.by = "gen-state.mjs (filesystem-derived)";
  state.meta.sections = sections;

  writeFileSync(STATE_PATH, JSON.stringify(state, null, 2) + "\n", "utf8");

  if (!QUIET) {
    const b = arbor.backlog;
    const liveLoops = loops.filter((l) => l.status === "live").length;
    console.log(
      `gen-state: state.json written → ${STATE_PATH}\n` +
      `  meta.updated=${TODAY}\n` +
      `  backlog: promoted=${b.promoted} buildReady=${b.buildReady} (${b.buildReadyIds.join(",")}) gatedForGuy=${b.gatedForGuy} held=${b.heldByClinicalGate}\n` +
      `  dropped (excluded): ${b.droppedIds.join(",") || "none"}\n` +
      `  loops: ${liveLoops} live / ${loops.length - liveLoops} proposed · connectors=${connectors.length} · releases=${releases.trains.length} · companies=${companies.length}`
    );
    if (b.buildReadyIds.includes("AP-006")) console.error("  ⚠️  AP-006 leaked into buildReady — the strikethrough exclusion failed.");
  }
}

main();
