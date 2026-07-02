/* gen-backlogs — centralizes every scattered domain backlog into state.json.
   Auto-discovers *backlog*.md across domain roots, parses items + status from
   markdown tables and checkbox lists, and writes state.backlogs[]. The dashboard
   BacklogHub renders it. Markdown stays the source of truth; this only reads. */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const here = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(here, '../../..')          // …/ROS
const STATE = path.resolve(here, 'state.json')

const DOMAIN_ROOTS = ['CoS', 'EA', 'PAI', 'MKT', 'HV', 'FIN']
const EXCLUDE = /[\\/](node_modules|_retired|dist|dist-artifact|\.git|worktrees|\.workspace)[\\/]/i
const IS_BACKLOG = /backlog/i
const DATED = /-20\d\d-\d\d-\d\d/           // archived dated snapshots → skip
const SKIP_DIR = /[\\/]execution[\\/]/i     // dated execution archives → skip

/** recursively list *.md files under a dir */
function walk(dir, out = []) {
  let ents
  try { ents = fs.readdirSync(dir, { withFileTypes: true }) } catch { return out }
  for (const e of ents) {
    const p = path.join(dir, e.name)
    if (EXCLUDE.test(p + path.sep)) continue
    if (e.isDirectory()) walk(p, out)
    else if (e.isFile() && e.name.toLowerCase().endsWith('.md')) out.push(p)
  }
  return out
}

const clean = (s) => (s || '')
  .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')  // links → text
  .replace(/[*_`]/g, '')                     // md emphasis / code
  .replace(/\s+/g, ' ')
  .trim()

/** classify a status cell / checkbox */
function statusOf(text) {
  const t = (text || '').toLowerCase()
  if (/[☑✅]|\bdone\b|shipped|complete|✔/.test(text) || /\bdone\b/.test(t)) return 'done'
  if (/⛔|blocked|gated|🔒/.test(text) || /\bblocked\b|\bgated\b/.test(t)) return 'blocked'
  if (/◐|🚧|in progress|\bactive\b|\bnext\b|wip|▶/.test(text) || /in progress|\bactive\b|\bnext\b/.test(t)) return 'active'
  return 'open'
}

const HEADERCELL = /^(#|id|item|deliverable|priority|task|why.*|effort|owner|status|gate|value.*|next.*|current.*|target.*|pr|verdict|theme)$/i

function parse(md) {
  const lines = md.split(/\r?\n/)
  let section = ''
  const items = []
  const ID = /^[A-Z]{1,6}-?\s?\d[\w.-]*/   // K-1, D3, E1, RCO3-01, HR-1, AP-043
  for (const raw of lines) {
    const line = raw.trim()
    // headings — level ≥3 with an ID prefix are ITEMS (e.g. "### RCO3-01 — …");
    // everything else (incl. level-2 "## D1 —") is a section header.
    const hm = line.match(/^(#{1,6})\s+(.+)$/)
    if (hm) {
      const text = clean(hm[2])
      const m = text.match(/^([A-Z]{1,6}-?\s?\d[\w.-]*)\s*[—:.-]?\s*(.*)$/)
      if (hm[1].length >= 3 && m) {
        items.push({ id: m[1].replace(/\s/g, ''), title: (m[2] ? clean(m[2]) : text).slice(0, 160), status: statusOf(text), section })
      } else section = text
      continue
    }
    // checkbox list
    const cb = line.match(/^[-*]\s*\[([ xX])\]\s+(.+)$/)
    if (cb) {
      const title = clean(cb[2])
      if (title) items.push({ title: title.slice(0, 160), status: cb[1].trim() ? 'done' : 'open', section })
      continue
    }
    // ID-prefixed bold bullet (e.g. "- **K-1 · title** — …  *(C, M)*")
    const bb = line.match(/^[-*]\s+\*\*([^*]+)\*\*(.*)$/)
    if (bb && ID.test(clean(bb[1]))) {
      const head = clean(bb[1])
      items.push({ id: head.split(/[ ·:—-]/)[0], title: clean(head + ' ' + bb[2]).slice(0, 160), status: statusOf(line), section })
      continue
    }
    // table row
    if (line.startsWith('|') && line.endsWith('|')) {
      const cells = line.slice(1, -1).split('|').map((c) => c.trim())
      if (!cells.length) continue
      if (cells.every((c) => /^:?-+:?$/.test(c) || c === '')) continue      // separator
      const cleaned = cells.map(clean)
      if (cleaned.some((c) => HEADERCELL.test(c)) && cleaned.filter(Boolean).length >= 2) continue // header
      // status = last non-empty cell that reads as a status, else scan
      const statusCell = [...cells].reverse().find((c) => /[☑✅◐⛔☐🚧🔒▶✔]|\b(done|blocked|gated|active|next|open|todo|wip|shipped)\b/i.test(c)) || cells[cells.length - 1]
      // title = first bolded cell, else the longest content cell that isn't the status/id
      const idCell = cleaned[0] && cleaned[0].length <= 6 ? cleaned[0] : ''
      let title = ''
      const bold = cells.find((c) => /\*\*.+\*\*/.test(c))
      if (bold) title = clean(bold)
      else {
        const cand = cleaned.filter((c) => c && c !== idCell && !HEADERCELL.test(c) && c.length > 3).sort((a, b) => b.length - a.length)
        title = cand[0] || cleaned[1] || cleaned[0] || ''
      }
      if (!title) continue
      items.push({ id: idCell || undefined, title: title.slice(0, 160), status: statusOf(statusCell), section })
    }
  }
  return items
}

function titleOf(md, file) {
  const h = md.split(/\r?\n/).find((l) => /^#\s+/.test(l))
  return h ? clean(h.replace(/^#\s+/, '')) : path.basename(file, '.md')
}

const files = []
for (const d of DOMAIN_ROOTS) {
  for (const f of walk(path.join(ROOT, d))) {
    const base = path.basename(f)
    if (!IS_BACKLOG.test(base)) continue
    if (DATED.test(base) || SKIP_DIR.test(f)) continue
    files.push(f)
  }
}

const backlogs = files.map((f) => {
  const md = fs.readFileSync(f, 'utf8')
  const items = parse(md)
  const done = items.filter((i) => i.status === 'done').length
  const active = items.filter((i) => i.status === 'active').length
  const blocked = items.filter((i) => i.status === 'blocked').length
  const rel = path.relative(ROOT, f).replace(/\\/g, '/')
  const domain = rel.split('/')[0]
  const mtime = fs.statSync(f).mtime.toISOString().slice(0, 10)
  return {
    id: rel.replace(/[^a-z0-9]+/gi, '_').toLowerCase(),
    domain, title: titleOf(md, f), path: rel,
    total: items.length, done, active, blocked,
    open: items.length - done - active - blocked,
    updated: mtime,
    items: items.slice(0, 80),   // cap payload; counts above are full
  }
}).filter((b) => b.total > 0)
  .sort((a, b) => a.domain.localeCompare(b.domain) || (b.total - b.done) - (a.total - a.done))

const state = JSON.parse(fs.readFileSync(STATE, 'utf8'))
state.backlogs = backlogs
fs.writeFileSync(STATE, JSON.stringify(state, null, 2))

const tot = backlogs.reduce((n, b) => n + b.total, 0)
const openTot = backlogs.reduce((n, b) => n + (b.total - b.done), 0)
console.log(`[gen-backlogs] ${backlogs.length} backlogs · ${tot} items · ${openTot} open`)
for (const b of backlogs) console.log(`  ${b.domain.padEnd(4)} ${String(b.done).padStart(3)}/${String(b.total).padEnd(3)} ${b.title}`)
