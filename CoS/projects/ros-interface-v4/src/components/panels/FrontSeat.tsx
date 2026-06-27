import { useState, useEffect, useRef } from 'react'
import { useStore } from '../../state/store'
import { DOMAIN_COLORS } from '../../design/domain-colors'

const MODES = [
  { label: 'Deep', seconds: 1500, key: 'deep' },
  { label: 'Stretch', seconds: 3000, key: 'stretch' },
  { label: 'Run', seconds: 5400, key: 'run' },
] as const

export function FrontSeat() {
  const { state } = useStore()
  const fs = state?.frontSeat
  const [mode, setMode] = useState<number>(0)
  const [remaining, setRemaining] = useState<number>(MODES[0].seconds)
  const [running, setRunning] = useState(false)
  const [sessions, setSessions] = useState(0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const total = MODES[mode].seconds
  const pct = ((total - remaining) / total) * 100
  const mins = Math.floor(remaining / 60)
  const secs = remaining % 60

  useEffect(() => {
    if (running) {
      timerRef.current = setInterval(() => {
        setRemaining((r) => {
          if (r <= 1) {
            setRunning(false)
            setSessions((s) => s + 1)
            return total
          }
          return r - 1
        })
      }, 1000)
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [running, total])

  const domainColor = fs?.domain ? (DOMAIN_COLORS[fs.domain] ?? 'var(--gold)') : 'var(--gold)'

  const r = 52
  const circ = 2 * Math.PI * r
  const dash = circ * (pct / 100)

  return (
    <div className="card" style={{ padding: 20, display: 'flex', gap: 20, alignItems: 'flex-start', borderLeft: `3px solid ${domainColor}` }}>
      {/* Timer ring */}
      <div style={{ flexShrink: 0, position: 'relative', width: 120, height: 120 }}>
        <svg width="120" height="120" viewBox="0 0 120 120" style={{ transform: 'rotate(-90deg)' }}>
          <circle cx="60" cy="60" r={r} fill="none" stroke="var(--line)" strokeWidth="6" />
          <circle
            cx="60" cy="60" r={r} fill="none"
            stroke={domainColor}
            strokeWidth="6"
            strokeDasharray={`${dash} ${circ}`}
            strokeLinecap="round"
            style={{ transition: 'stroke-dasharray 1s linear' }}
          />
        </svg>
        <div style={{
          position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
        }}>
          <span style={{ fontWeight: 700, fontSize: 22, color: 'var(--ink)', fontVariantNumeric: 'tabular-nums' }}>
            {mins}:{secs.toString().padStart(2, '0')}
          </span>
          <span style={{ fontSize: 10, color: 'var(--faint)' }}>{sessions}✦</span>
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 12 }}>
        {/* Mission */}
        <div>
          <div style={{ fontSize: 10, color: 'var(--faint)', marginBottom: 4, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Front Seat</div>
          <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--ink)', lineHeight: 1.4 }}>
            {fs?.mission || <span style={{ color: 'var(--faint)' }}>No mission set</span>}
          </div>
        </div>

        {/* Domain tag */}
        {fs?.domain && (
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '2px 10px', borderRadius: 20,
            background: `${domainColor}18`, border: `1px solid ${domainColor}44`,
            color: domainColor, fontSize: 11, fontWeight: 600,
            width: 'fit-content',
          }}>
            {fs.domain}
          </span>
        )}

        {/* Timer controls */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
          {MODES.map((m, i) => (
            <button
              key={m.key}
              onClick={() => { setMode(i); setRemaining(m.seconds); setRunning(false) }}
              style={{
                padding: '3px 10px', borderRadius: 12, fontSize: 11, fontWeight: 500,
                background: mode === i ? `${domainColor}22` : 'var(--panel2)',
                border: `1px solid ${mode === i ? domainColor : 'var(--line)'}`,
                color: mode === i ? domainColor : 'var(--muted)', cursor: 'pointer',
              }}
            >
              {m.label}
            </button>
          ))}
          <button
            onClick={() => setRunning((r) => !r)}
            style={{
              padding: '4px 14px', borderRadius: 12, fontSize: 12, fontWeight: 600,
              background: running ? 'rgba(255,107,107,0.15)' : `${domainColor}22`,
              border: `1px solid ${running ? 'var(--red)' : domainColor}`,
              color: running ? 'var(--red)' : domainColor, cursor: 'pointer',
            }}
          >
            {running ? '⏸ Pause' : '▶ Start'}
          </button>
        </div>
      </div>
    </div>
  )
}
