import { useStore } from '../../state/store'
import { DOMAIN_COLORS } from '../../design/domain-colors'

export function BottomBar() {
  const { state } = useStore()

  const domain = state?.frontSeat?.domain ?? ''
  const accentColor = domain ? (DOMAIN_COLORS[domain] ?? 'var(--muted)') : 'var(--muted)'

  const pendingQ = state?.actionQueue?.filter((a) => a.status === 'pending').length ?? 0
  const liveData = state?.liveData
  const lastFetch = liveData?.gmail?.bguy?.fetchedAt
  const stale = lastFetch
    ? Date.now() - new Date(lastFetch).getTime() > 15 * 60 * 1000
    : true

  return (
    <footer style={{
      height: 'var(--bottombar-h)',
      background: 'var(--panel)',
      borderTop: '1px solid var(--line)',
      display: 'flex',
      alignItems: 'center',
      padding: '0 16px',
      gap: 20,
      flexShrink: 0,
      fontSize: 11,
      color: 'var(--muted)',
    }}>
      {/* Front seat domain */}
      {domain && (
        <span style={{ color: accentColor, fontWeight: 600 }}>
          ▶ {domain}
        </span>
      )}
      {state?.frontSeat?.mission && (
        <span style={{ color: 'var(--faint)', maxWidth: 320, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {state.frontSeat.mission}
        </span>
      )}

      <div style={{ flex: 1 }} />

      {/* Queue count */}
      {pendingQ > 0 && (
        <span style={{ color: 'var(--amber)' }}>
          {pendingQ} queued
        </span>
      )}

      {/* Connector freshness */}
      <span style={{ color: stale ? 'var(--amber)' : 'var(--faint)' }}>
        {stale ? '⚠ connectors stale' : '● connectors live'}
      </span>

      <span style={{ color: 'var(--faint)' }}>ROS v4</span>
    </footer>
  )
}
