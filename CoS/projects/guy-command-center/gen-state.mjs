#!/usr/bin/env node
/**
 * gen-state.mjs — regenerate live counts in state.json from the markdown source of truth.
 *
 * For every client in state.json that has a `rosFolder`, this reads:
 *   <rosFolder>/BACKLOG.md              → backlog wave done/total counts (rows `| N.x | … | <status> |`)
 *   <rosFolder>/DELIVERABLES-BACKLOG.md → deliverable status (checkbox `- [ ]` / `- [x]` per `## D# —` section)
 * and writes the results back into clients[].backlog[] and clients[].deliverables[].
 *
 * Markdown stays the source of truth; the cockpit just renders. Re-run after editing any backlog:
 *   node CoS/projects/guy-command-center/gen-state.mjs
 * or from the interface project:  npm run gen-state
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROS_ROOT = path.resolve(__dirname, '../../..') // CoS/projects/guy-command-center → repo root
const STATE = path.join(__dirname, 'state.json')

const DONE = (s) => s.includes('☑') || s.includes('✅') || /\[x\]/i.test(s)

/** Parse BACKLOG.md → { [waveNum]: {done,total} } using the item-id prefix (e.g. "3.2" → wave 3). */
function parseWaves(md) {
  const waves = {}
  for (const line of md.split('\n')) {
    const m = line.match(/^\|\s*(\d+)\.\d+\s*\|/)
    if (!m) continue
    const w = Number(m[1])
    const cells = line.split('|').slice(1, -1).map((c) => c.trim())
    const status = cells[cells.length - 1] ?? ''
    waves[w] = waves[w] || { done: 0, total: 0 }
    waves[w].total++
    if (DONE(status)) waves[w].done++
  }
  return waves
}

/** Parse DELIVERABLES-BACKLOG.md → { [Did]: 'open'|'active'|'done' } from checkbox ratios per "## D# —" section. */
function parseDeliverables(md) {
  const out = {}
  let cur = null
  for (const line of md.split('\n')) {
    const h = line.match(/^##\s+(D\d+)\b/)
    if (h) { cur = h[1]; out[cur] = { done: 0, total: 0 }; continue }
    if (!cur) continue
    const cb = line.match(/^\s*-\s*\[( |x|X)\]/)
    if (cb) { out[cur].total++; if (cb[1].toLowerCase() === 'x') out[cur].done++ }
  }
  const status = {}
  for (const [id, { done, total }] of Object.entries(out)) {
    status[id] = total === 0 ? 'open' : done === total ? 'done' : done > 0 ? 'active' : 'open'
  }
  return status
}

function readIf(p) { return fs.existsSync(p) ? fs.readFileSync(p, 'utf8') : null }

const state = JSON.parse(fs.readFileSync(STATE, 'utf8'))
let touched = 0
const report = []

for (const client of state.clients ?? []) {
  if (!client.rosFolder) continue
  const folder = path.join(ROS_ROOT, client.rosFolder)

  // Backlog waves
  const backlogMd = readIf(path.join(folder, 'BACKLOG.md'))
  if (backlogMd && Array.isArray(client.backlog)) {
    const waves = parseWaves(backlogMd)
    for (const entry of client.backlog) {
      const w = Number(String(entry.id).replace(/\D/g, ''))
      if (waves[w]) {
        if (entry.done !== waves[w].done || entry.total !== waves[w].total) touched++
        entry.done = waves[w].done
        entry.total = waves[w].total
      }
    }
    const td = client.backlog.reduce((a, w) => a + w.done, 0)
    const tt = client.backlog.reduce((a, w) => a + w.total, 0)
    report.push(`${client.name}: backlog ${td}/${tt}`)
  }

  // Deliverable statuses
  const delivMd = readIf(path.join(folder, 'DELIVERABLES-BACKLOG.md'))
  if (delivMd && Array.isArray(client.deliverables)) {
    const st = parseDeliverables(delivMd)
    for (const d of client.deliverables) {
      if (st[d.id] && d.status !== st[d.id]) { d.status = st[d.id]; touched++ }
    }
    const dn = client.deliverables.filter((d) => d.status === 'done').length
    report.push(`${client.name}: deliverables ${dn}/${client.deliverables.length} done`)
  }
}

state.meta = state.meta || {}
state.meta.updatedAt = state.meta.updatedAt // preserve; gen-state is data-only
state.meta.generatedAt = new Date().toISOString().slice(0, 10)
fs.writeFileSync(STATE, JSON.stringify(state, null, 2) + '\n')
console.log(`gen-state: ${touched} field(s) updated\n  ${report.join('\n  ')}`)
