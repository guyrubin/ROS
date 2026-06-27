import { useStore } from '../../state/store'

const RINGS = [
  { key: 'move'    as const, label: 'Move',    color: '#ff6b6b', icon: '🔥' },
  { key: 'stretch' as const, label: 'Stretch', color: '#55d38a', icon: '🧘' },
  { key: 'run'     as const, label: 'Run',     color: '#67b7ff', icon: '🏃' },
]

function Ring({ pct, color, r = 26 }: { pct: number; color: string; r?: number }) {
  const circ = 2 * Math.PI * r
  const dash = circ * (Math.min(pct, 100) / 100)
  const sz = (r + 8) * 2
  return (
    <svg width={sz} height={sz} viewBox={`0 0 ${sz} ${sz}`} style={{ transform: 'rotate(-90deg)' }}>
      <circle cx={sz / 2} cy={sz / 2} r={r} fill="none" stroke="var(--line)" strokeWidth="5" />
      <circle
        cx={sz / 2} cy={sz / 2} r={r} fill="none"
        stroke={color} strokeWidth="5"
        strokeDasharray={`${dash} ${circ}`}
        strokeLinecap="round"
        style={{ transition: 'stroke-dasharray 0.4s ease' }}
      />
    </svg>
  )
}

export function FitnessRings() {
  const { state } = useStore()
  const fit = state?.fitness ?? { move: 0, stretch: 0, run: 0 }

  return (
    <div className="card">
      <div className="head">Fitness</div>
      <div style={{ padding: 16, display: 'flex', gap: 12, justifyContent: 'space-around' }}>
        {RINGS.map((ring) => {
          const pct = Math.min((fit[ring.key] ?? 0) * 100, 100)
          return (
            <div key={ring.key} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
              <div style={{ position: 'relative' }}>
                <Ring pct={pct} color={ring.color} />
                <div style={{
                  position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 14,
                }}>
                  {ring.icon}
                </div>
              </div>
              <div style={{ fontSize: 10, color: 'var(--muted)', textAlign: 'center' }}>{ring.label}</div>
              <div style={{ fontSize: 11, color: ring.color, fontWeight: 600 }}>{Math.round(pct)}%</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
