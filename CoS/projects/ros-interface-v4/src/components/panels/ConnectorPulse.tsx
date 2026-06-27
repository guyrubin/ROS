import { useStore } from '../../state/store'
import { timeAgo } from '../../lib/formatters'

export function ConnectorPulse() {
  const { state } = useStore()
  const integrations = state?.integrations ?? {}
  const liveData = state?.liveData

  const CONNECTORS = [
    { key: 'gmail',    label: 'Gmail bguy',        detail: liveData?.gmail?.bguy?.unread != null ? `${liveData.gmail.bguy.unread} unread` : '',     fetchedAt: liveData?.gmail?.bguy?.fetchedAt ?? '' },
    { key: 'ghlv',    label: 'Gmail HollandVest',  detail: liveData?.gmail?.hollandvest?.unread != null ? `${liveData.gmail.hollandvest.unread} unread` : '', fetchedAt: liveData?.gmail?.hollandvest?.fetchedAt ?? '' },
    { key: 'gjoseph', label: 'Gmail Joseph',        detail: liveData?.gmail?.joseph?.unread != null ? `${liveData.gmail.joseph.unread} unread` : '',   fetchedAt: liveData?.gmail?.joseph?.fetchedAt ?? '' },
    { key: 'calendar',label: 'Calendar',            detail: liveData?.calendar?.eventsToday?.length != null ? `${liveData.calendar.eventsToday.length} events` : '', fetchedAt: liveData?.calendar?.fetchedAt ?? '' },
    { key: 'notion',  label: 'Notion',             detail: liveData?.notion?.openTasks != null ? `${liveData.notion.openTasks} tasks` : '',             fetchedAt: liveData?.notion?.fetchedAt ?? '' },
    { key: 'drive',   label: 'Google Drive',        detail: '',  fetchedAt: '' },
  ]

  return (
    <div className="card">
      <div className="head">Connector Pulse</div>
      <div style={{ padding: '4px 0' }}>
        {CONNECTORS.map((conn) => {
          const int = integrations[conn.key] ?? integrations[conn.key.replace(/^g/, '')] ?? null
          const isLive = int?.status === 'live' || conn.key.startsWith('g')
          const isStale = conn.fetchedAt && Date.now() - new Date(conn.fetchedAt).getTime() > 15 * 60 * 1000
          const color = !conn.fetchedAt ? 'var(--faint)' : isStale ? 'var(--amber)' : 'var(--green)'

          return (
            <div key={conn.key} style={{ padding: '8px 16px', borderBottom: '1px solid var(--line)', display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 7, height: 7, borderRadius: '50%', background: color, flexShrink: 0 }} />
              <span style={{ fontSize: 12, color: 'var(--ink)', flex: 1 }}>{conn.label}</span>
              {conn.detail && <span style={{ fontSize: 11, color: 'var(--muted)' }}>{conn.detail}</span>}
              {conn.fetchedAt ? (
                <span style={{ fontSize: 10, color: isStale ? 'var(--amber)' : 'var(--faint)' }}>
                  {isStale ? '⚠ stale' : timeAgo(conn.fetchedAt)}
                </span>
              ) : (
                <span style={{ fontSize: 10, color: 'var(--faint)' }}>{isLive ? 'live · not refreshed' : 'planned'}</span>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
