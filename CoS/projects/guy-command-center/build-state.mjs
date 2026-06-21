#!/usr/bin/env node
/**
 * build-state.mjs — auto-feed the Command Center.
 *
 * Reads the live ROS domain memory and refreshes state.json's per-domain context
 * + freshness, WITHOUT clobbering the hand-curated structure (clients, map,
 * frontSeat, integrations, actionQueue). The dashboard (index.html) fetches
 * state.json on load, so running this is all it takes to reflect reality.
 *
 * Freshness is GIT-DERIVED (not the gameable "Last updated:" header) — ROS-BACKLOG A1.
 * A domain reads fresh if max(last git commit to its MEMORY.md, its `Reviewed:` heartbeat)
 * is within FRESH_DAYS. So a quiet-but-confirmed domain (Reviewed today) reads green,
 * while a domain with a recent header but no commits reads stale.
 *
 * Run:  node CoS/projects/guy-command-center/build-state.mjs
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, '..', '..', '..');            // -> ROS root
const STATE = join(HERE, 'state.json');
const FRESH_DAYS = 14;

const read = (p) => { try { return readFileSync(join(ROOT, p), 'utf8'); } catch { return ''; } };
const daysSince = (iso) => {
  const t = Date.parse(iso);
  return Number.isNaN(t) ? null : Math.floor((Date.now() - t) / 86400000);
};
const maxDate = (...ds) => ds.filter(Boolean).sort().pop() || null;

// GIT-derived last-touch of a file (committer date, short) — the honest freshness signal.
function gitDate(relPath) {
  try {
    const out = execSync(`git log -1 --format=%cs -- "${relPath}"`, { cwd: ROOT, stdio: ['ignore', 'pipe', 'ignore'] })
      .toString().trim();
    return /^\d{4}-\d{2}-\d{2}$/.test(out) ? out : null;
  } catch { return null; }
}
// `Reviewed: YYYY-MM-DD` heartbeat — a human/agent says "I checked this; still true" (ROS-BACKLOG A3).
function reviewedDate(key) {
  const m = read(`${key}/MEMORY.md`).match(/^\s*Reviewed:\s*([0-9]{4}-[0-9]{2}-[0-9]{2})/im);
  return m ? m[1] : null;
}
// Human label only — NOT used for staleness anymore.
function headerDate(key) {
  const m = read(`${key}/MEMORY.md`).match(/Last updated:\s*([0-9]{4}-[0-9]{2}-[0-9]{2})/i);
  return m ? m[1] : null;
}

// pull the curated per-domain "Next:" line from root MEMORY.md "Active across all agents"
const rootMem = read('MEMORY.md');
function rootNextFor(key) {
  const re = new RegExp(`###\\s+${key}\\b[^\\n]*\\n([\\s\\S]*?)(?=\\n###\\s|\\n##\\s|\\n---)`, 'i');
  const m = rootMem.match(re);
  if (!m) return null;
  const next = m[1].match(/^\s*Next:\s*(.+)$/im);
  const status = m[1].match(/^\s*Status:\s*(.+)$/im);
  const line = next ? next[1] : (status ? status[1] : m[1].split('\n').find((l) => l.trim()));
  return line ? line.trim().replace(/\s+/g, ' ').slice(0, 220) : null;
}

const state = JSON.parse(readFileSync(STATE, 'utf8'));
const report = [];

for (const d of state.domains || []) {
  const ctx = rootNextFor(d.k);
  if (ctx) d.ctx = ctx;

  const git = gitDate(`${d.k}/MEMORY.md`);
  const reviewed = reviewedDate(d.k);
  const fresh = maxDate(git, reviewed) || headerDate(d.k);   // git/reviewed canonical; header = last resort
  if (fresh) {
    d.updated = fresh;
    d.gitDate = git;
    d.reviewed = reviewed;
    const age = daysSince(fresh);
    d.staleDays = age;
    d.stale = age != null && age > FRESH_DAYS;
  }
  report.push(`${d.k}: git=${git || '—'} reviewed=${reviewed || '—'} -> ${fresh || 'no-date'}${d.stale ? ' (STALE)' : ''}`);
}

// Arbor (PAI) pulse from the mesh memory, if present
const mesh = read('PAI/projects/parenting-os-plugin/mesh/MEMORY.md');
if (mesh) {
  const firstUpdate = mesh.match(/##\s+Update[^\n]*\n([\s\S]*?)(?=\n##\s)/);
  if (firstUpdate) state.arborPulse = firstUpdate[0].split('\n').slice(0, 2).join(' ').slice(0, 240);
}

state.meta = {
  ...(state.meta || {}),
  updatedAt: new Date().toISOString(),
  updatedBy: 'generator (build-state.mjs)',
  freshness: 'git-derived (last commit) ∪ Reviewed: heartbeat',
  note: 'Auto-fed from ROS domain MEMORY.md. Freshness is git-derived per ROS-BACKLOG A1/A3. Curated fields preserved.',
};

writeFileSync(STATE, JSON.stringify(state, null, 2) + '\n', 'utf8');
console.log('state.json refreshed (git-derived freshness):\n  ' + report.join('\n  '));
