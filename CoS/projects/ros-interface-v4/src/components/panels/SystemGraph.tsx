import { useEffect, useMemo, useRef, useState, useCallback } from 'react'
import systemGraph from '../../data/system-graph.json'
import knowledgeGraph from '../../data/knowledge-graph.json'
import { DOMAIN_COLORS } from '../../design/domain-colors'

/* ──────────────────────────────────────────────────────────────────────────
   SystemGraph — interactive force-directed map of the ROS multi-agent system.
   Two datasets, one engine (hand-rolled velocity-Verlet sim, no external lib):
     • "Agents & Skills"  — curated graph (src/data/system-graph.json)
     • "Knowledge Graph"  — real /graphify extraction over 00_System + .claude
                            (src/data/knowledge-graph.json, 12 communities)
   ────────────────────────────────────────────────────────────────────────── */

type Mode = 'system' | 'knowledge'

const RUNTIME_COLORS: Record<string, string> = { claude: '#d97757', codex: '#46c08a', hermes: '#5b8cff' }
const COMMUNITY_COLORS = ['#5b8cff', '#46c08a', '#d97757', '#b891ff', '#e8b54a', '#ff6b9d', '#4fd6c8', '#9bd14a', '#ff8a5b', '#8aa0b8', '#c79a5b', '#67b7ff']

const SYS_TYPES = ['runtime', 'agent', 'subagent', 'skill', 'shared', 'capability', 'connector'] as const
const SYS_TYPE_LABELS: Record<string, string> = {
  runtime: 'Runtime', agent: 'Domain agent', subagent: 'Subagent',
  skill: 'Skill', shared: 'Shared skill', capability: 'Capability', connector: 'Connector',
}
const SYS_RADIUS: Record<string, number> = { runtime: 22, agent: 17, subagent: 12, skill: 8, shared: 8, capability: 10, connector: 10 }
const DOMAINS = ['CoS', 'KK', 'HV', 'EA', 'PAI', 'MKT', 'FIN']

/* unified node the engine renders */
interface UNode {
  id: string; label: string; color: string; r: number; always: boolean
  kindLabel: string; sub?: string; desc?: string; meta: [string, string][]
  filterKey: string  // type (system) or community id (knowledge)
}
interface UEdge { source: string; target: string; rel?: string }
interface Built { nodes: UNode[]; edges: UEdge[]; filters: { key: string; label: string; color: string }[]; legend: [string, string][] }

interface SimNode extends UNode { x: number; y: number; vx: number; vy: number; fx: number | null; fy: number | null }

/* build the unified model for a dataset */
function buildModel(mode: Mode): Built {
  if (mode === 'system') {
    const raw = systemGraph as any
    const nodes: UNode[] = raw.nodes.map((n: any): UNode => {
      const color = n.type === 'runtime' ? (RUNTIME_COLORS[n.id] ?? '#5b8cff')
        : n.type === 'capability' ? '#8aa0b8'
        : n.type === 'connector' ? '#c79a5b'
        : (DOMAIN_COLORS[n.group] ?? '#94a1b0')
      const meta: [string, string][] = []
      if (n.role) meta.push(['Role', n.role])
      if (n.triggers) meta.push(['Triggers', n.triggers])
      if (n.cmd) meta.push(['Command', n.cmd])
      if (n.identity) meta.push(['Identity', n.identity])
      if (n.path) meta.push(['Path', n.path])
      const showGroup = n.group && !['runtime', 'capability', 'connector'].includes(n.type)
      return {
        id: n.id, label: n.full ?? n.label, color, r: SYS_RADIUS[n.type] ?? 9,
        always: n.type === 'runtime' || n.type === 'agent',
        kindLabel: SYS_TYPE_LABELS[n.type] + (showGroup ? ` · ${n.group}` : ''),
        sub: n.type === 'agent' ? n.label : n.type === 'runtime' ? (n.id === 'codex' ? '{ }' : n.label[0]) : undefined,
        desc: n.desc, meta, filterKey: n.type,
      }
    })
    const edges: UEdge[] = raw.edges.map((e: any) => ({ source: e.source, target: e.target, rel: e.rel }))
    const filters = SYS_TYPES.map((t) => ({
      key: t, label: SYS_TYPE_LABELS[t],
      color: t === 'runtime' ? '#5b8cff' : t === 'capability' ? '#8aa0b8' : t === 'connector' ? '#c79a5b' : 'var(--gold)',
    }))
    const legend: [string, string][] = [['Runtime', '#5b8cff'], ['Agent', 'var(--gold)'], ['Skill', 'var(--green)'], ['Capability', '#8aa0b8'], ['Connector', '#c79a5b']]
    return { nodes, edges, filters, legend }
  }
  // knowledge mode — graphify extraction
  const raw = knowledgeGraph as any
  const cl: Record<string, string> = raw.meta?.communityLabels ?? {}
  const nodes: UNode[] = raw.nodes.map((n: any): UNode => {
    const color = COMMUNITY_COLORS[n.community % COMMUNITY_COLORS.length]
    return {
      id: n.id, label: n.label, color,
      r: Math.min(20, 6 + (n.degree ?? 0) * 1.05),
      always: (n.degree ?? 0) >= 7,
      kindLabel: cl[String(n.community)] ?? `Community ${n.community}`,
      desc: undefined,
      meta: [['Type', n.file_type], ['Source', n.source], ['Degree', String(n.degree)]],
      filterKey: String(n.community),
    }
  })
  const edges: UEdge[] = raw.edges.map((e: any) => ({ source: e.source, target: e.target, rel: e.rel }))
  const filters = Object.keys(cl).sort((a, b) => +a - +b).map((c) => ({
    key: c, label: cl[c], color: COMMUNITY_COLORS[+c % COMMUNITY_COLORS.length],
  }))
  const legend: [string, string][] = filters.slice(0, 6).map((f) => [f.label, f.color] as [string, string])
  return { nodes, edges, filters, legend }
}

export function SystemGraph() {
  const wrapRef = useRef<HTMLDivElement>(null)
  const [size, setSize] = useState({ w: 900, h: 620 })
  const [, setTick] = useState(0)
  const [mode, setMode] = useState<Mode>('system')
  const [selected, setSelected] = useState<string | null>(null)
  const [hover, setHover] = useState<string | null>(null)
  const [activeFilters, setActiveFilters] = useState<Set<string>>(new Set())
  const [activeDomain, setActiveDomain] = useState<string>('all')
  const [view, setView] = useState({ x: 0, y: 0, k: 1 })

  const model = useMemo(() => buildModel(mode), [mode])

  // reset transient state when switching datasets
  useEffect(() => {
    setSelected(null); setHover(null); setActiveDomain('all')
    setActiveFilters(new Set(model.filters.map((f) => f.key)))
    setView({ x: 0, y: 0, k: 1 })
  }, [mode]) // eslint-disable-line react-hooks/exhaustive-deps

  const adj = useMemo(() => {
    const m: Record<string, Set<string>> = {}
    model.nodes.forEach((n) => (m[n.id] = new Set()))
    model.edges.forEach((e) => { m[e.source]?.add(e.target); m[e.target]?.add(e.source) })
    return m
  }, [model])

  // positions persist per-id across mode toggles (ids differ between datasets)
  const posRef = useRef<Record<string, SimNode>>({})
  const sim: SimNode[] = useMemo(() => {
    const groups = Array.from(new Set(model.nodes.map((n) => n.filterKey)))
    return model.nodes.map((n) => {
      const ex = posRef.current[n.id]
      if (ex) { Object.assign(ex, n); return ex }
      const gi = groups.indexOf(n.filterKey)
      const a = (gi / Math.max(1, groups.length)) * Math.PI * 2
      const ring = n.r > 18 ? 90 : 240
      const node: SimNode = {
        ...n,
        x: 450 + Math.cos(a) * ring + (((gi * 31 + n.id.length * 17) % 60) - 30),
        y: 310 + Math.sin(a) * ring + (((gi * 17 + n.id.length * 13) % 60) - 30),
        vx: 0, vy: 0, fx: null, fy: null,
      }
      posRef.current[n.id] = node
      return node
    })
  }, [model])
  const byId = useMemo(() => { const m: Record<string, SimNode> = {}; sim.forEach((n) => (m[n.id] = n)); return m }, [sim])

  const alphaRef = useRef(1)
  useEffect(() => { alphaRef.current = 1 }, [mode])

  useEffect(() => {
    if (!wrapRef.current) return
    const ro = new ResizeObserver((entries) => {
      const r = entries[0].contentRect
      setSize({ w: Math.max(420, r.width), h: Math.max(480, r.height) })
    })
    ro.observe(wrapRef.current)
    return () => ro.disconnect()
  }, [])

  // force loop
  useEffect(() => {
    let raf = 0
    const cx = size.w / 2, cy = size.h / 2
    const step = () => {
      const nodes = sim, edges = model.edges
      const alpha = alphaRef.current
      if (alpha > 0.005) {
        for (let i = 0; i < nodes.length; i++) {
          const a = nodes[i]
          for (let j = i + 1; j < nodes.length; j++) {
            const b = nodes[j]
            let dx = a.x - b.x, dy = a.y - b.y
            let d2 = dx * dx + dy * dy
            if (d2 < 0.01) { dx = (i - j) * 0.5 + 0.1; dy = 0.1; d2 = dx * dx + dy * dy }
            const d = Math.sqrt(d2)
            const rep = 2500 / d2
            const ux = dx / d, uy = dy / d
            a.vx += ux * rep * alpha; a.vy += uy * rep * alpha
            b.vx -= ux * rep * alpha; b.vy -= uy * rep * alpha
          }
        }
        for (const e of edges) {
          const a = byId[e.source], b = byId[e.target]
          if (!a || !b) continue
          const dx = b.x - a.x, dy = b.y - a.y
          const d = Math.sqrt(dx * dx + dy * dy) || 0.01
          const rest = (a.r + b.r) * 2 + 34
          const f = ((d - rest) / d) * 0.05 * alpha
          a.vx += dx * f; a.vy += dy * f
          b.vx -= dx * f; b.vy -= dy * f
        }
        for (const n of nodes) { n.vx += (cx - n.x) * 0.0016 * alpha; n.vy += (cy - n.y) * 0.0016 * alpha }
        for (const n of nodes) {
          if (n.fx != null) { n.x = n.fx; n.vx = 0 } else { n.vx *= 0.82; n.x += n.vx }
          if (n.fy != null) { n.y = n.fy; n.vy = 0 } else { n.vy *= 0.82; n.y += n.vy }
        }
        alphaRef.current = alpha * 0.985
        setTick((t) => (t + 1) % 100000)
      }
      raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [size.w, size.h, byId, sim, model.edges])

  const reheat = useCallback(() => { alphaRef.current = Math.max(alphaRef.current, 0.6) }, [])

  const visibleIds = useMemo(() => {
    const s = new Set<string>()
    model.nodes.forEach((n) => {
      if (!activeFilters.has(n.filterKey)) return
      if (mode === 'system' && activeDomain !== 'all') {
        const raw = (systemGraph as any).nodes.find((x: any) => x.id === n.id)
        const t = raw?.type
        if (!['runtime', 'capability', 'connector'].includes(t) && raw?.group !== activeDomain) return
      }
      s.add(n.id)
    })
    return s
  }, [model, activeFilters, activeDomain, mode])

  // pan / zoom / drag
  const dragState = useRef<{ kind: 'node' | 'pan' | null; id?: string; sx: number; sy: number; ox: number; oy: number }>({ kind: null, sx: 0, sy: 0, ox: 0, oy: 0 })
  const toWorld = (cxp: number, cyp: number) => {
    const rect = wrapRef.current!.getBoundingClientRect()
    return { x: (cxp - rect.left - view.x) / view.k, y: (cyp - rect.top - view.y) / view.k }
  }
  const onWheel = (e: React.WheelEvent) => {
    e.preventDefault()
    const rect = wrapRef.current!.getBoundingClientRect()
    const mx = e.clientX - rect.left, my = e.clientY - rect.top
    const k2 = Math.min(2.6, Math.max(0.35, view.k * (e.deltaY < 0 ? 1.1 : 0.9)))
    const wx = (mx - view.x) / view.k, wy = (my - view.y) / view.k
    setView({ k: k2, x: mx - wx * k2, y: my - wy * k2 })
  }
  const onPointerDownNode = (e: React.PointerEvent, id: string) => {
    e.stopPropagation()
    ;(e.target as Element).setPointerCapture?.(e.pointerId)
    dragState.current = { kind: 'node', id, sx: 0, sy: 0, ox: 0, oy: 0 }
    const n = byId[id]; if (n) { n.fx = n.x; n.fy = n.y }
    reheat()
  }
  const onPointerDownBg = (e: React.PointerEvent) => {
    ;(e.currentTarget as Element).setPointerCapture?.(e.pointerId)
    dragState.current = { kind: 'pan', sx: e.clientX, sy: e.clientY, ox: view.x, oy: view.y }
  }
  const onPointerMove = (e: React.PointerEvent) => {
    const ds = dragState.current
    if (ds.kind === 'node' && ds.id) {
      const w = toWorld(e.clientX, e.clientY); const n = byId[ds.id]; if (n) { n.fx = w.x; n.fy = w.y }; reheat()
    } else if (ds.kind === 'pan') {
      setView((v) => ({ ...v, x: ds.ox + (e.clientX - ds.sx), y: ds.oy + (e.clientY - ds.sy) }))
    }
  }
  const onPointerUp = () => {
    const ds = dragState.current
    if (ds.kind === 'node' && ds.id) { const n = byId[ds.id]; if (n) { n.fx = null; n.fy = null } }
    dragState.current = { kind: null, sx: 0, sy: 0, ox: 0, oy: 0 }
  }
  const resetView = () => { setView({ x: 0, y: 0, k: 1 }); reheat() }

  const focusId = hover ?? selected
  const focusSet = useMemo(() => {
    if (!focusId) return null
    const s = new Set<string>([focusId]); adj[focusId]?.forEach((x) => s.add(x)); return s
  }, [focusId, adj])

  const toggleFilter = (k: string) => {
    setActiveFilters((prev) => {
      const next = new Set(prev); next.has(k) ? next.delete(k) : next.add(k)
      return next.size === 0 ? new Set(model.filters.map((f) => f.key)) : next
    })
    reheat()
  }

  const selNode = selected ? byId[selected] : null

  return (
    <div className="card" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', borderBottom: '1px solid var(--line)', flexWrap: 'wrap' }}>
        {/* mode toggle */}
        <div style={{ display: 'flex', borderRadius: 8, overflow: 'hidden', border: '1px solid var(--line)' }}>
          {(['system', 'knowledge'] as Mode[]).map((m) => (
            <button key={m} onClick={() => setMode(m)} style={{
              fontSize: 11, fontWeight: 600, padding: '4px 11px', cursor: 'pointer', border: 'none',
              background: mode === m ? 'var(--panel3)' : 'transparent', color: mode === m ? 'var(--ink)' : 'var(--faint)',
            }}>{m === 'system' ? 'Agents & Skills' : 'Knowledge Graph'}</button>
          ))}
        </div>
        <span style={{ fontSize: 10, color: 'var(--faint)' }}>{model.nodes.length} nodes · {model.edges.length} edges{mode === 'knowledge' ? ` · ${model.filters.length} communities` : ''}</span>
        <div style={{ flex: 1 }} />
        {mode === 'system' && (
          <select value={activeDomain} onChange={(e) => { setActiveDomain(e.target.value); reheat() }}
            style={{ background: 'var(--panel2)', color: 'var(--ink)', border: '1px solid var(--line)', borderRadius: 6, fontSize: 11, padding: '3px 6px' }}>
            <option value="all">All domains</option>
            {DOMAINS.map((d) => <option key={d} value={d}>{d}</option>)}
          </select>
        )}
        <button className="btn" onClick={resetView} style={{ fontSize: 10, padding: '3px 8px' }}>Reset view</button>
      </div>

      {/* filter chips */}
      <div style={{ display: 'flex', gap: 6, padding: '8px 14px', borderBottom: '1px solid var(--line)', flexWrap: 'wrap', maxHeight: 76, overflow: 'auto' }}>
        {model.filters.map((f) => {
          const on = activeFilters.has(f.key)
          return (
            <button key={f.key} onClick={() => toggleFilter(f.key)} style={{
              fontSize: 10, padding: '3px 9px', borderRadius: 999, cursor: 'pointer',
              background: on ? `${f.color}22` : 'var(--panel2)', border: `1px solid ${on ? f.color : 'var(--line)'}`,
              color: on ? f.color : 'var(--faint)', fontWeight: 600,
            }}>{f.label}</button>
          )
        })}
      </div>

      {/* canvas */}
      <div ref={wrapRef} style={{ position: 'relative', flex: 1, minHeight: 460, cursor: dragState.current.kind === 'pan' ? 'grabbing' : 'grab', background: 'radial-gradient(800px 500px at 70% -10%, rgba(124,92,255,0.06), transparent 60%), radial-gradient(700px 450px at -5% 10%, rgba(91,140,255,0.06), transparent 55%)' }}>
        <svg width={size.w} height={size.h} onWheel={onWheel} onPointerDown={onPointerDownBg} onPointerMove={onPointerMove} onPointerUp={onPointerUp} onPointerLeave={onPointerUp} style={{ display: 'block', touchAction: 'none' }}>
          <g transform={`translate(${view.x},${view.y}) scale(${view.k})`}>
            {model.edges.map((e, i) => {
              const a = byId[e.source], b = byId[e.target]
              if (!a || !b) return null
              if (!visibleIds.has(e.source) || !visibleIds.has(e.target)) return null
              const inFocus = focusSet ? (focusSet.has(e.source) && focusSet.has(e.target)) : true
              return <line key={i} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={inFocus ? 'var(--line2)' : 'var(--line)'} strokeWidth={inFocus && focusSet ? 1.4 : 0.8} strokeOpacity={focusSet ? (inFocus ? 0.85 : 0.1) : 0.4} />
            })}
            {sim.map((n) => {
              if (!visibleIds.has(n.id)) return null
              const dim = focusSet ? !focusSet.has(n.id) : false
              const isSel = selected === n.id
              const showLabel = n.always || isSel || hover === n.id || view.k > 1.4
              return (
                <g key={n.id} transform={`translate(${n.x},${n.y})`} style={{ cursor: 'pointer', opacity: dim ? 0.22 : 1, transition: 'opacity 0.15s' }}
                  onMouseEnter={() => setHover(n.id)} onMouseLeave={() => setHover(null)}
                  onPointerDown={(e) => onPointerDownNode(e, n.id)}
                  onClick={(e) => { e.stopPropagation(); setSelected(n.id === selected ? null : n.id) }}>
                  {isSel && <circle r={n.r + 5} fill="none" stroke={n.color} strokeWidth={1.5} strokeOpacity={0.6} />}
                  <circle r={n.r} fill={`${n.color}26`} stroke={n.color} strokeWidth={n.always ? 2 : 1.4} />
                  {n.sub && <text textAnchor="middle" dy="0.34em" fontSize={n.r > 18 ? 11 : 9} fontWeight={700} fill={n.color} style={{ pointerEvents: 'none', userSelect: 'none' }}>{n.sub}</text>}
                  {showLabel && <text x={0} y={n.r + 11} textAnchor="middle" fontSize={9.5} fill="var(--muted)" style={{ pointerEvents: 'none', userSelect: 'none' }}>{trunc(n.label, mode === 'knowledge' ? 28 : 40)}</text>}
                </g>
              )
            })}
          </g>
        </svg>

        {selNode && (
          <div className="card" style={{ position: 'absolute', top: 12, right: 12, width: 272, padding: 14, background: 'var(--panel)', border: `1px solid ${selNode.color}`, boxShadow: '0 10px 40px -12px rgba(0,0,0,0.6)', maxHeight: 'calc(100% - 24px)', overflow: 'auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <span style={{ width: 10, height: 10, borderRadius: 3, background: selNode.color, flexShrink: 0 }} />
              <span style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--ink)', lineHeight: 1.3 }}>{selNode.label}</span>
              <button className="btn" onClick={() => setSelected(null)} style={{ marginLeft: 'auto', fontSize: 10, padding: '1px 7px', flexShrink: 0 }}>✕</button>
            </div>
            <div style={{ fontSize: 9.5, textTransform: 'uppercase', letterSpacing: '0.07em', color: selNode.color, marginBottom: 8 }}>{selNode.kindLabel}</div>
            {selNode.desc && <div style={{ fontSize: 12, color: 'var(--muted)', lineHeight: 1.5, marginBottom: 8 }}>{selNode.desc}</div>}
            {selNode.meta.map(([k, v]) => (
              <div key={k} style={{ display: 'flex', gap: 8, fontSize: 11, padding: '3px 0', borderTop: '1px dashed var(--line)' }}>
                <span style={{ color: 'var(--faint)', minWidth: 54, flexShrink: 0 }}>{k}</span>
                <span style={{ color: 'var(--muted)', fontFamily: k === 'Command' || k === 'Identity' || k === 'Path' || k === 'Source' ? 'var(--mono)' : 'var(--font)', fontSize: 10.5, wordBreak: 'break-word' }}>{v}</span>
              </div>
            ))}
            <div style={{ marginTop: 10, borderTop: '1px solid var(--line)', paddingTop: 8 }}>
              <div style={{ fontSize: 9.5, color: 'var(--faint)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 5 }}>{adj[selNode.id]?.size ?? 0} connections</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                {Array.from(adj[selNode.id] ?? []).slice(0, 16).map((id) => {
                  const nb = byId[id]; if (!nb) return null
                  return <button key={id} onClick={() => setSelected(id)} style={{ fontSize: 9.5, padding: '2px 6px', borderRadius: 5, cursor: 'pointer', background: 'var(--panel2)', border: `1px solid ${nb.color}55`, color: 'var(--muted)' }}>{trunc(nb.label, 22)}</button>
                })}
              </div>
            </div>
          </div>
        )}

        {/* legend */}
        <div style={{ position: 'absolute', left: 12, bottom: 12, display: 'flex', gap: 10, flexWrap: 'wrap', maxWidth: 'calc(100% - 24px)', background: 'rgba(16,21,31,0.72)', padding: '6px 10px', borderRadius: 8, border: '1px solid var(--line)', backdropFilter: 'blur(6px)' }}>
          {model.legend.map(([l, c]) => (
            <span key={l} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 9.5, color: 'var(--muted)' }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', border: `1.5px solid ${c}`, background: `${c}33`, flexShrink: 0 }} /> {trunc(l, 22)}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

function trunc(s: string, n: number) { return s.length > n ? s.slice(0, n - 1) + '…' : s }
