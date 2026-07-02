import { NavLink, useNavigate } from 'react-router-dom'
import { useStore } from '../../state/store'
import { useClocks } from '../../hooks/useClocks'
import { useDayProgress } from '../../hooks/useDayProgress'
import { useState } from 'react'

const VIEWS = [
  { to: '/',         label: 'NOW',      end: true },
  { to: '/momentum', label: 'MOMENTUM', end: false },
  { to: '/work',     label: 'WORK',     end: false },
  { to: '/ops',      label: 'OPS',      end: false },
  { to: '/os',       label: 'OS',       end: false },
  { to: '/backlog',  label: 'BACKLOG',  end: false },
  { to: '/map',      label: 'MAP',      end: false },
]

export function TopBar() {
  const { state } = useStore()
  const clocks = useClocks()
  const dayPct = useDayProgress()
  const navigate = useNavigate()
  const [paletteOpen, setPaletteOpen] = useState(false)

  const pendingCount = state?.actionQueue?.filter(
    (a) => a.status === 'pending' && a.safety >= 3
  ).length ?? 0

  return (
    <header style={{
      height: 'var(--topbar-h)',
      background: 'var(--panel)',
      borderBottom: '1px solid var(--line)',
      display: 'flex',
      alignItems: 'center',
      padding: '0 16px',
      gap: 24,
      flexShrink: 0,
      position: 'relative',
      zIndex: 50,
    }}>
      {/* Brand */}
      <span style={{ fontWeight: 700, fontSize: 13, letterSpacing: '0.12em', color: 'var(--gold)', userSelect: 'none' }}>
        ROS
      </span>

      {/* Day progress bar */}
      <div style={{ width: 80, height: 3, background: 'var(--line)', borderRadius: 2, flexShrink: 0 }}>
        <div style={{ width: `${dayPct}%`, height: '100%', background: 'var(--gold)', borderRadius: 2, transition: 'width 60s linear' }} />
      </div>

      {/* Nav */}
      <nav style={{ display: 'flex', gap: 2 }}>
        {VIEWS.map((v) => (
          <NavLink
            key={v.to}
            to={v.to}
            end={v.end}
            style={({ isActive }) => ({
              padding: '4px 12px',
              borderRadius: 6,
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: '0.08em',
              textDecoration: 'none',
              transition: 'background 0.15s, color 0.15s',
              background: isActive ? 'var(--panel3)' : 'transparent',
              color: isActive ? 'var(--ink)' : 'var(--muted)',
              border: isActive ? '1px solid var(--line2)' : '1px solid transparent',
            })}
          >
            {v.label}
          </NavLink>
        ))}
      </nav>

      {/* Spacer */}
      <div style={{ flex: 1 }} />

      {/* Clocks */}
      <div style={{ display: 'flex', gap: 16 }}>
        {clocks.map((c) => (
          <span key={c.label} style={{ fontSize: 11, color: 'var(--muted)' }}>
            <span style={{ color: 'var(--faint)', marginRight: 4 }}>{c.label}</span>
            {c.time}
          </span>
        ))}
      </div>

      {/* Pending badge */}
      {pendingCount > 0 && (
        <button
          onClick={() => navigate('/')}
          style={{
            background: 'rgba(255,107,107,0.15)',
            border: '1px solid var(--red)',
            borderRadius: 12,
            padding: '2px 10px',
            color: 'var(--red)',
            fontSize: 11,
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 5,
          }}
        >
          ⚡ {pendingCount} need{pendingCount === 1 ? 's' : ''} confirm
        </button>
      )}

      {/* ⌘K */}
      <button
        className="btn"
        onClick={() => setPaletteOpen(true)}
        style={{ fontSize: 11, padding: '4px 10px' }}
        data-cmd-palette-trigger
      >
        ⌘K
      </button>

      {/* Sync LED */}
      <SyncLed />
    </header>
  )
}

function SyncLed() {
  const { loading, error } = useStore()
  const color = error ? 'var(--red)' : loading ? 'var(--amber)' : 'var(--green)'
  const title = error ? `Error: ${error}` : loading ? 'Syncing…' : 'Live'
  return (
    <div title={title} style={{
      width: 8, height: 8, borderRadius: '50%',
      background: color,
      boxShadow: `0 0 6px ${color}`,
      flexShrink: 0,
    }} />
  )
}
