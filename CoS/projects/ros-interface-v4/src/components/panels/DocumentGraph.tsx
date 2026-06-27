import { useMemo, useState } from 'react'
import { useStore } from '../../state/store'
import type { RAG } from '../../state/types'

type DocType = 'boot' | 'system' | 'domain' | 'project' | 'runtime'

interface DocNode {
  id: string
  label: string
  path: string
  type: DocType
  domain?: string
  status?: RAG
  weight?: number
  note: string
}

interface DocEdge {
  from: string
  to: string
  label: string
}

const NODE_COLOR: Record<DocType, string> = {
  boot: 'var(--gold)',
  system: 'var(--blue)',
  domain: 'var(--violet)',
  project: 'var(--green)',
  runtime: 'var(--cyan)',
}

const FALLBACK_NODES: DocNode[] = [
  { id: 'agents', label: 'AGENTS', path: '/AGENTS.md', type: 'boot', weight: 5, note: 'Cross-agent contract and canonical boot order.' },
  { id: 'root-claude', label: 'Root CLAUDE', path: '/CLAUDE.md', type: 'boot', weight: 5, note: 'Root constitution, routing pointers, safety levels.' },
  { id: 'root-memory', label: 'Root MEMORY', path: '/MEMORY.md', type: 'boot', weight: 4, note: 'Current cross-domain facts and active focus.' },
  { id: 'routing', label: 'Routing', path: '/00_System/routing.md', type: 'system', weight: 4, note: 'Maps work to CoS, KK, HV, EA, PAI, MKT, FIN.' },
  { id: 'capabilities', label: 'Capabilities', path: '/00_System/agent-capabilities.md', type: 'system', weight: 3, note: 'Shared tool and connector capability gates.' },
  { id: 'cap-opt', label: 'Capability Optimization', path: '/00_System/capability-optimization.md', type: 'system', weight: 3, note: 'Maturity model and SENSE→AUDIT improvement loop.' },
  { id: 'connectors', label: 'Connectors', path: '/00_System/connectors.md', type: 'system', weight: 3, note: 'Gmail, Notion, GitHub and access boundaries.' },
  { id: 'cos-memory', label: 'CoS Memory', path: '/CoS/MEMORY.md', type: 'domain', domain: 'CoS', weight: 2, note: 'CoS operating facts and Hermes optimization pointer.' },
  { id: 'ea-memory', label: 'EA Memory', path: '/EA/MEMORY.md', type: 'domain', domain: 'EA', status: 'amber', weight: 2, note: 'ABN, Coca-Cola, Boortmalt architecture work state.' },
  { id: 'pai-memory', label: 'PAI Memory', path: '/PAI/MEMORY.md', type: 'domain', domain: 'PAI', status: 'amber', weight: 2, note: 'Arbor venture and product state.' },
  { id: 'hv-memory', label: 'HV Memory', path: '/HV/MEMORY.md', type: 'domain', domain: 'HV', status: 'amber', weight: 2, note: 'Real-estate radar and deal state.' },
  { id: 'kk-memory', label: 'KK Memory', path: '/KK/MEMORY.md', type: 'domain', domain: 'KK', status: 'green', weight: 2, note: 'Daily ops, email/calendar/task operating facts.' },
  { id: 'ros-backlog', label: 'ROS Backlog', path: '/CoS/ROS-BACKLOG.md', type: 'project', domain: 'CoS', weight: 3, note: 'Company-level epics and autonomy/harness work.' },
  { id: 'hermes-backlog', label: 'Hermes Runtime Backlog', path: '/CoS/backlogs/hermes-ros-optimization-backlog-2026-06-27.md', type: 'runtime', domain: 'CoS', status: 'amber', weight: 4, note: 'Graphified backlog for Hermes as ROS runtime layer.' },
  { id: 'state-json', label: 'Command Center State', path: '/CoS/projects/guy-command-center/state.json', type: 'runtime', weight: 3, note: 'Operational JSON feeding dashboard surfaces.' },
]

const FALLBACK_EDGES: DocEdge[] = [
  { from: 'agents', to: 'root-claude', label: 'boots' },
  { from: 'root-claude', to: 'root-memory', label: 'loads' },
  { from: 'root-memory', to: 'routing', label: 'routes' },
  { from: 'routing', to: 'cos-memory', label: 'CoS' },
  { from: 'routing', to: 'ea-memory', label: 'EA' },
  { from: 'routing', to: 'pai-memory', label: 'PAI' },
  { from: 'routing', to: 'hv-memory', label: 'HV' },
  { from: 'routing', to: 'kk-memory', label: 'KK' },
  { from: 'root-claude', to: 'capabilities', label: 'lazy' },
  { from: 'capabilities', to: 'cap-opt', label: 'improve' },
  { from: 'capabilities', to: 'connectors', label: 'external' },
  { from: 'cos-memory', to: 'ros-backlog', label: 'tracks' },
  { from: 'ros-backlog', to: 'hermes-backlog', label: 'optimizes' },
  { from: 'state-json', to: 'root-memory', label: 'reflects' },
  { from: 'state-json', to: 'ea-memory', label: 'reflects' },
  { from: 'state-json', to: 'pai-memory', label: 'reflects' },
]

function nodePosition(index: number, total: number, radiusX: number, radiusY: number) {
  const angle = (Math.PI * 2 * index) / total - Math.PI / 2
  return { x: 320 + Math.cos(angle) * radiusX, y: 190 + Math.sin(angle) * radiusY }
}

export function DocumentGraph() {
  const { state } = useStore()
  const [selected, setSelected] = useState('hermes-backlog')
  const [filter, setFilter] = useState<DocType | 'all'>('all')

  const graph = useMemo(() => {
    const domains = state?.domains ?? []
    const dynamicDomainNodes = domains.map((d) => ({
      id: `${d.k.toLowerCase()}-state`,
      label: `${d.k} State`,
      path: d.file,
      type: 'domain' as const,
      domain: d.k,
      status: d.s,
      weight: 2,
      note: d.ctx,
    }))

    const dynamicEdges = dynamicDomainNodes.map((n) => ({ from: 'routing', to: n.id, label: n.domain ?? '' }))
    const seen = new Set(dynamicDomainNodes.map((n) => n.path))
    const nodes = [...FALLBACK_NODES.filter((n) => !seen.has(n.path)), ...dynamicDomainNodes]
    const edges = [...FALLBACK_EDGES.filter((e) => nodes.some((n) => n.id === e.from) && nodes.some((n) => n.id === e.to)), ...dynamicEdges]
    return { nodes, edges }
  }, [state?.domains])

  const visibleNodes = filter === 'all' ? graph.nodes : graph.nodes.filter((n) => n.type === filter)
  const visibleIds = new Set(visibleNodes.map((n) => n.id))
  const visibleEdges = graph.edges.filter((e) => visibleIds.has(e.from) && visibleIds.has(e.to))
  const selectedNode = graph.nodes.find((n) => n.id === selected) ?? visibleNodes[0]
  const positions = new Map(visibleNodes.map((n, i) => [n.id, nodePosition(i, visibleNodes.length, 245, 130)]))

  const stats = [
    { label: 'Docs', value: visibleNodes.length },
    { label: 'Edges', value: visibleEdges.length },
    { label: 'Hot path', value: graph.nodes.filter((n) => n.type === 'boot').length },
    { label: 'Runtime', value: graph.nodes.filter((n) => n.type === 'runtime').length },
  ]

  return (
    <div className="card" style={{ overflow: 'hidden' }}>
      <div className="head">
        <span>Document-Level Graph</span>
        <span style={{ marginLeft: 'auto', color: 'var(--faint)', fontSize: 10 }}>ROS knowledge wiring</span>
      </div>

      <div style={{ padding: 16, display: 'grid', gridTemplateColumns: '1.35fr 0.85fr', gap: 16 }}>
        <div className="card2" style={{ position: 'relative', minHeight: 400, overflow: 'hidden', background: 'linear-gradient(180deg, rgba(103,183,255,0.05), rgba(214,168,75,0.035))' }}>
          <div style={{ display: 'flex', gap: 8, padding: 12, position: 'relative', zIndex: 2, flexWrap: 'wrap' }}>
            {(['all', 'boot', 'system', 'domain', 'project', 'runtime'] as const).map((f) => (
              <button
                key={f}
                className="btn"
                onClick={() => setFilter(f)}
                style={{
                  padding: '4px 8px',
                  fontSize: 10,
                  borderColor: filter === f ? 'var(--gold)' : 'var(--line2)',
                  color: filter === f ? 'var(--gold)' : 'var(--muted)',
                }}
              >
                {f}
              </button>
            ))}
          </div>

          <svg viewBox="0 0 640 380" style={{ width: '100%', height: 340, display: 'block' }} role="img" aria-label="ROS document graph">
            <defs>
              <radialGradient id="docGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="rgba(214,168,75,0.28)" />
                <stop offset="100%" stopColor="rgba(214,168,75,0)" />
              </radialGradient>
            </defs>
            <circle cx="320" cy="190" r="152" fill="none" stroke="rgba(255,255,255,0.04)" />
            <circle cx="320" cy="190" r="86" fill="url(#docGlow)" />
            {visibleEdges.map((edge) => {
              const a = positions.get(edge.from)
              const b = positions.get(edge.to)
              if (!a || !b) return null
              return (
                <g key={`${edge.from}-${edge.to}`}>
                  <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="rgba(148,161,176,0.34)" strokeWidth="1" />
                  <text x={(a.x + b.x) / 2} y={(a.y + b.y) / 2 - 3} fill="rgba(148,161,176,0.56)" fontSize="9" textAnchor="middle">{edge.label}</text>
                </g>
              )
            })}
            {visibleNodes.map((node) => {
              const p = positions.get(node.id)!
              const active = selectedNode?.id === node.id
              const r = 10 + (node.weight ?? 2) * 2
              return (
                <g key={node.id} onClick={() => setSelected(node.id)} style={{ cursor: 'pointer' }}>
                  <circle cx={p.x} cy={p.y} r={r + 7} fill={active ? 'rgba(214,168,75,0.16)' : 'rgba(255,255,255,0.03)'} />
                  <circle cx={p.x} cy={p.y} r={r} fill={NODE_COLOR[node.type]} opacity={active ? 1 : 0.78} />
                  {node.status && <circle cx={p.x + r - 2} cy={p.y - r + 2} r="4" fill={`var(--rag-${node.status})`} />}
                  <text x={p.x} y={p.y + r + 16} fill="var(--ink)" fontSize="10" textAnchor="middle" fontWeight={active ? 700 : 500}>{node.label}</text>
                </g>
              )
            })}
          </svg>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
            {stats.map((s) => (
              <div key={s.label} className="card2" style={{ padding: '8px 6px', textAlign: 'center' }}>
                <div style={{ fontSize: 19, fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>{s.value}</div>
                <div style={{ fontSize: 9, color: 'var(--faint)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{s.label}</div>
              </div>
            ))}
          </div>

          {selectedNode && (
            <div className="card2" style={{ padding: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ width: 10, height: 10, borderRadius: 99, background: NODE_COLOR[selectedNode.type] }} />
                <div style={{ fontWeight: 700 }}>{selectedNode.label}</div>
                <span className="badge" style={{ marginLeft: 'auto', color: NODE_COLOR[selectedNode.type], background: 'rgba(255,255,255,0.04)' }}>{selectedNode.type}</span>
              </div>
              <div style={{ marginTop: 10, fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--blue)', wordBreak: 'break-word' }}>{selectedNode.path}</div>
              <div style={{ marginTop: 10, color: 'var(--muted)', fontSize: 12 }}>{selectedNode.note}</div>
            </div>
          )}

          <div className="card2" style={{ padding: 14 }}>
            <div style={{ fontSize: 11, color: 'var(--faint)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>Operating read</div>
            <div style={{ fontSize: 13, color: 'var(--ink)' }}>
              The graph makes document dependencies explicit: boot files route the session, system files gate capabilities, domain memories carry live context, and runtime docs/state show what Hermes should automate or verify next.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
