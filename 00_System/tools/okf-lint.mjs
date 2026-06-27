#!/usr/bin/env node
// okf-lint.mjs — OKF (Open Knowledge Format) linter for the ROS markdown vault.
// Dependency-free Node ESM. Walks the vault, verifies UTF-8 + frontmatter shape.
//
// Rules enforced (per 00_System/ROS-KNOWLEDGE-ARCHITECTURE.md):
//   - every .md file is valid UTF-8
//   - if frontmatter is present, the `---` delimiters are well-formed
//     and a `type:` field exists inside it
//   - files lacking frontmatter are collected (WARNING only, not a hard fail)
//
// Exit code: non-zero on any malformed-frontmatter HARD violation.
//            missing-frontmatter alone never fails the build.

import { readdirSync, statSync, readFileSync } from 'node:fs';
import { join, relative, resolve, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

// Vault root = repo root = parent of 00_System/tools/
const ROOT = resolve(fileURLToPath(import.meta.url), '..', '..', '..');

// Directories never to descend into (Arbor repos, vendor, tooling state).
const EXCLUDED_DIRS = new Set([
  'node_modules',
  '.git',
  '.obsidian',
  '.claude',
  '.workspace',
  'PPPPtherapy-',
  'arbor-clean-main',
]);

// Prefix excludes (any dir name starting with these is skipped).
const EXCLUDED_PREFIXES = ['.arbor-'];

function isExcludedDir(name) {
  if (EXCLUDED_DIRS.has(name)) return true;
  for (const p of EXCLUDED_PREFIXES) if (name.startsWith(p)) return true;
  return false;
}

// Recursively collect .md files, honouring the exclusion rules.
function walk(dir, out) {
  let entries;
  try {
    entries = readdirSync(dir, { withFileTypes: true });
  } catch {
    return out;
  }
  for (const ent of entries) {
    const full = join(dir, ent.name);
    if (ent.isDirectory()) {
      if (isExcludedDir(ent.name)) continue;
      walk(full, out);
    } else if (ent.isFile() && ent.name.toLowerCase().endsWith('.md')) {
      out.push(full);
    }
  }
  return out;
}

// Decode a buffer as strict UTF-8. Returns { ok, text }.
function decodeUtf8(buf) {
  try {
    const dec = new TextDecoder('utf-8', { fatal: true });
    return { ok: true, text: dec.decode(buf) };
  } catch {
    return { ok: false, text: null };
  }
}

// Inspect frontmatter. Returns one of:
//   { state: 'none' }                       — no frontmatter block
//   { state: 'ok' }                         — well-formed, has type:
//   { state: 'malformed', reason: string }  — broken delimiters or no type:
function checkFrontmatter(text) {
  // Strip a leading UTF-8 BOM if present.
  let body = text.charCodeAt(0) === 0xfeff ? text.slice(1) : text;

  // Frontmatter must be the very first line: `---` (allow trailing CR).
  const lines = body.split(/\r?\n/);
  if (lines.length === 0 || lines[0].trim() !== '---') {
    return { state: 'none' };
  }

  // Find the closing `---` delimiter.
  let closeIdx = -1;
  for (let i = 1; i < lines.length; i++) {
    if (lines[i].trim() === '---') {
      closeIdx = i;
      break;
    }
  }
  if (closeIdx === -1) {
    return { state: 'malformed', reason: 'opening `---` has no closing `---` delimiter' };
  }

  // Collect the frontmatter body lines.
  const fm = lines.slice(1, closeIdx);

  // Require a top-level `type:` key (not indented, has a value or not).
  const hasType = fm.some((l) => /^type\s*:/.test(l));
  if (!hasType) {
    return { state: 'malformed', reason: 'frontmatter present but no `type:` field' };
  }

  return { state: 'ok' };
}

function main() {
  const files = walk(ROOT, []);
  files.sort();

  let checked = 0;
  let withFm = 0;
  const missing = [];
  const malformed = [];

  for (const file of files) {
    checked++;
    const rel = relative(ROOT, file).replace(/\\/g, '/');
    const buf = readFileSync(file);

    const dec = decodeUtf8(buf);
    if (!dec.ok) {
      malformed.push({ rel, reason: 'not valid UTF-8' });
      continue;
    }

    const fm = checkFrontmatter(dec.text);
    if (fm.state === 'ok') {
      withFm++;
    } else if (fm.state === 'none') {
      missing.push(rel);
    } else {
      malformed.push({ rel, reason: fm.reason });
    }
  }

  // ---- Report ----
  const log = (s) => process.stdout.write(s + '\n');

  log('OKF lint — ROS knowledge vault');
  log('==============================');
  log(`checked:          ${checked}`);
  log(`with-frontmatter: ${withFm}`);
  log(`missing:          ${missing.length} (warning only)`);
  log(`malformed:        ${malformed.length} (hard violation)`);

  if (missing.length) {
    log('');
    log('WARN — missing frontmatter (no `type:` block):');
    for (const rel of missing) log(`  - ${rel}`);
  }

  if (malformed.length) {
    log('');
    log('FAIL — malformed frontmatter / encoding:');
    for (const m of malformed) log(`  - ${m.rel}: ${m.reason}`);
  }

  log('');
  if (malformed.length) {
    log(`okf-lint: FAILED (${malformed.length} hard violation${malformed.length === 1 ? '' : 's'})`);
    process.exit(1);
  }
  log('okf-lint: OK (no hard violations)');
  process.exit(0);
}

main();
