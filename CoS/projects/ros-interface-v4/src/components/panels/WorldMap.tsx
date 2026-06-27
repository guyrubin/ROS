import { useStore } from '../../state/store'
import type { RAG } from '../../state/types'

const SEV_COLOR: Record<RAG, string> = { green: 'var(--rag-green)', amber: 'var(--rag-amber)', red: 'var(--rag-red)' }

export function WorldMap() {
  const { state } = useStore()
  const map = state?.map ?? []

  return (
    <div className="card">
      <div className="head">World Map</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, padding: 12 }}>
        {map.map((item) => (
          <div key={item.c} className="card2" style={{ padding: '8px 10px', borderLeft: `2px solid ${SEV_COLOR[item.sev]}` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
              <span style={{ fontSize: 14 }}>{item.i}</span>
              <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--muted)', letterSpacing: '0.04em' }}>{item.b}</span>
            </div>
            <div style={{ fontSize: 10, color: 'var(--faint)', lineHeight: 1.4 }}>{item.e}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
