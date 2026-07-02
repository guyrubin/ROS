import { useMemo, useState } from 'react'
import { useStore } from '../../state/store'
import { DOMAIN_COLORS } from '../../design/domain-colors'
import type { BacklogSource, BacklogItem, BacklogItemStatus } from '../../state/types'

const STATUS_COLOR: Record<BacklogItemStatus, string> = {
  open: 'var(--faint)', active: 'var(--amber)', done: 'var(--green)', blocked: 'var(--red)',
}
const STATUS_LABEL: Record<BacklogItemStatus, string> = { open: 'Open', active: 'Active', done: 'Done', blocked: 'Blocked' }

const obsidian = (p: string) => `obsidian://open?vault=ROS&file=${encodeURIComponent(p.replace(/\.md$/, ''))}`

export function BacklogHub() {
  const { state } = useStore()
  const backlogs = state?.backlogs ?? []
  const [domain, setDomain] = useState<string>('all')
  const [open, setOpen] = useState<Record<string, boolean>>({})
  const [statusFilter, setStatusFilter] = useState<BacklogItemStatus | 'all'>('all')

  const domains = useMemo(() => Array.from(new Set(backlogs.map((b) => b.domain))).sort(), [backlogs])
  const shown = domain === 'all' ? backlogs : backlogs.filter((b) => b.domain === domain)

  const roll = useMemo(() => {
    const r = { total: 0, done: 0, active: 0, blocked: 0, open: 0 }
    for (const b of shown) { r.total += b.total; r.done += b.done; r.active += b.active; r.blocked += b.blocked; r.open += b.open }
    return r
  }, [shown])

  if (!backlogs.length) {
    return <div className="card"><div className="head"><span>Backlog Hub</span></div>
      <div className="empty-state"><div className="icon">📋</div><div style={{ color: 'var(--muted)' }}>No backlogs indexed</div>
        <div style={{ color: 'var(--faint)', fontSize: 11 }}>Run <code style={{ fontFamily: 'var(--mono)' }}>npm run gen-state</code></div></div>
    </div>
  }

  const perDomain = domains.map((d) => {
    const bs = backlogs.filter((b) => b.domain === d)
    const open = bs.reduce((n, b) => n + b.open + b.active + b.blocked, 0)
    return { d, count: bs.length, open }
  })

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {/* aggregate rollup */}
      <div className="card" style={{ padding: 16 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--ink)' }}>Backlog Hub</span>
          <span style={{ fontSize: 11, color: 'var(--faint)' }}>{shown.length} backlogs · {roll.total} items · every domain, one place</span>
        </div>
        {/* rollup bar */}
        <div style={{ display: 'flex', height: 8, borderRadius: 5, overflow: 'hidden', marginTop: 12, background: 'var(--panel2)' }}>
          {(['done', 'active', 'blocked', 'open'] as const).map((k) => roll[k] > 0 && (
            <div key={k} title={`${STATUS_LABEL[k]}: ${roll[k]}`} style={{ width: `${(roll[k] / roll.total) * 100}%`, background: STATUS_COLOR[k], opacity: k === 'open' ? 0.35 : 1 }} />
          ))}
        </div>
        <div style={{ display: 'flex', gap: 16, marginTop: 10, flexWrap: 'wrap' }}>
          {(['done', 'active', 'blocked', 'open'] as const).map((k) => (
            <span key={k} style={{ fontSize: 11, color: 'var(--muted)', display: 'inline-flex', alignItems: 'center', gap: 5 }}>
              <span style={{ width: 8, height: 8, borderRadius: 2, background: STATUS_COLOR[k], opacity: k === 'open' ? 0.5 : 1 }} />
              {roll[k]} {STATUS_LABEL[k].toLowerCase()}
            </span>
          ))}
        </div>
      </div>

      {/* domain filter */}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        <FilterChip on={domain === 'all'} onClick={() => setDomain('all')} label={`All (${backlogs.length})`} color="var(--gold)" />
        {perDomain.map((pd) => (
          <FilterChip key={pd.d} on={domain === pd.d} onClick={() => setDomain(pd.d)}
            label={`${pd.d} · ${pd.open} open`} color={DOMAIN_COLORS[pd.d] ?? 'var(--muted)'} />
        ))}
        <div style={{ flex: 1 }} />
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as any)}
          style={{ background: 'var(--panel2)', color: 'var(--ink)', border: '1px solid var(--line)', borderRadius: 6, fontSize: 11, padding: '3px 6px' }}>
          <option value="all">All items</option>
          <option value="active">Active only</option>
          <option value="blocked">Blocked only</option>
          <option value="open">Open only</option>
          <option value="done">Done only</option>
        </select>
      </div>

      {/* backlog cards */}
      {shown.map((b) => (
        <BacklogCard key={b.id} b={b} expanded={!!open[b.id]} onToggle={() => setOpen((o) => ({ ...o, [b.id]: !o[b.id] }))} statusFilter={statusFilter} />
      ))}
    </div>
  )
}

function FilterChip({ on, onClick, label, color }: { on: boolean; onClick: () => void; label: string; color: string }) {
  return (
    <button onClick={onClick} style={{
      fontSize: 11, fontWeight: 600, padding: '4px 11px', borderRadius: 999, cursor: 'pointer',
      background: on ? `${color}22` : 'var(--panel2)', border: `1px solid ${on ? color : 'var(--line)'}`,
      color: on ? color : 'var(--muted)',
    }}>{label}</button>
  )
}

function BacklogCard({ b, expanded, onToggle, statusFilter }: {
  b: BacklogSource; expanded: boolean; onToggle: () => void; statusFilter: BacklogItemStatus | 'all'
}) {
  const c = DOMAIN_COLORS[b.domain] ?? 'var(--muted)'
  const pct = b.total ? Math.round((b.done / b.total) * 100) : 0
  const items = statusFilter === 'all' ? b.items : b.items.filter((i) => i.status === statusFilter)

  // group items by section
  const sections = useMemo(() => {
    const m = new Map<string, BacklogItem[]>()
    for (const it of items) { const s = it.section || '—'; if (!m.has(s)) m.set(s, []); m.get(s)!.push(it) }
    return Array.from(m.entries())
  }, [items])

  return (
    <div className="card" style={{ padding: 0, borderLeft: `3px solid ${c}`, overflow: 'hidden' }}>
      <div style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }} onClick={onToggle}>
        <span style={{ fontSize: 10, fontWeight: 700, color: c, minWidth: 34 }}>{b.domain}</span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{b.title}</div>
          <div style={{ fontSize: 10, color: 'var(--faint)', fontFamily: 'var(--mono)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{b.path}</div>
        </div>
        {/* mini status counts */}
        <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
          {b.blocked > 0 && <Count n={b.blocked} c="var(--red)" />}
          {b.active > 0 && <Count n={b.active} c="var(--amber)" />}
          <Count n={b.open} c="var(--faint)" />
          <Count n={b.done} c="var(--green)" />
        </div>
        {/* progress ring-ish */}
        <div style={{ width: 120, flexShrink: 0 }}>
          <div style={{ height: 6, borderRadius: 4, background: 'var(--panel2)', overflow: 'hidden' }}>
            <div style={{ width: `${pct}%`, height: '100%', background: c }} />
          </div>
          <div style={{ fontSize: 9, color: 'var(--faint)', textAlign: 'right', marginTop: 2 }}>{b.done}/{b.total} · {pct}%</div>
        </div>
        <span style={{ color: 'var(--faint)', fontSize: 12, flexShrink: 0 }}>{expanded ? '▾' : '▸'}</span>
      </div>

      {expanded && (
        <div style={{ borderTop: '1px solid var(--line)', padding: '8px 16px 12px', maxHeight: 320, overflow: 'auto' }}>
          <a href={obsidian(b.path)} style={{ fontSize: 10, color: c, textDecoration: 'none' }}>↗ open source in Obsidian</a>
          {sections.map(([s, its]) => (
            <div key={s} style={{ marginTop: 10 }}>
              {s !== '—' && <div style={{ fontSize: 9.5, color: 'var(--faint)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 5 }}>{s}</div>}
              {its.map((it, i) => (
                <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start', padding: '3px 0', fontSize: 12 }}>
                  <span style={{ width: 7, height: 7, borderRadius: '50%', background: STATUS_COLOR[it.status], marginTop: 5, flexShrink: 0, opacity: it.status === 'open' ? 0.5 : 1 }} />
                  {it.id && <span style={{ fontFamily: 'var(--mono)', fontSize: 10, color: c, flexShrink: 0 }}>{it.id}</span>}
                  <span style={{ color: it.status === 'done' ? 'var(--faint)' : 'var(--muted)', textDecoration: it.status === 'done' ? 'line-through' : 'none' }}>{it.title}</span>
                </div>
              ))}
            </div>
          ))}
          {items.length === 0 && <div style={{ fontSize: 11, color: 'var(--faint)', marginTop: 8 }}>No items match the filter.</div>}
        </div>
      )}
    </div>
  )
}

function Count({ n, c }: { n: number; c: string }) {
  return <span style={{ fontSize: 11, fontWeight: 600, color: c, minWidth: 18, textAlign: 'right' }}>{n}</span>
}
