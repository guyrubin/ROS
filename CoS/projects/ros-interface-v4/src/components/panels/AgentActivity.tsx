import { useStore } from '../../state/store'
import { timeAgo } from '../../lib/formatters'
import { DOMAIN_COLORS } from '../../design/domain-colors'

export function AgentActivity() {
  const { state } = useStore()
  const agents = state?.agents ?? []
  const running = agents.filter((a) => a.status === 'running')

  return (
    <div className="card">
      <div className="head">
        <span>Agent Activity</span>
        {running.length > 0 ? (
          <span className="badge" style={{ background: 'rgba(85,211,138,0.15)', color: 'var(--green)', border: '1px solid rgba(85,211,138,0.3)', marginLeft: 'auto' }}>
            {running.length} running
          </span>
        ) : (
          <span style={{ marginLeft: 'auto', color: 'var(--faint)', fontSize: 10 }}>idle</span>
        )}
      </div>

      {agents.length === 0 ? (
        <div className="empty-state">
          <div className="icon">🤖</div>
          <div>No active agent jobs</div>
          <div style={{ fontSize: 11, color: 'var(--faint)' }}>Hermes writes to agents[] in state.json</div>
        </div>
      ) : (
        <div style={{ padding: '4px 0' }}>
          {agents.map((a) => {
            const domainColor = DOMAIN_COLORS[a.domain] ?? 'var(--muted)'
            const isRunning = a.status === 'running'
            return (
              <div key={a.id} style={{
                padding: '10px 16px', borderBottom: '1px solid var(--line)',
                display: 'flex', flexDirection: 'column', gap: 4,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  {isRunning ? (
                    <div style={{
                      width: 8, height: 8, borderRadius: '50%', background: 'var(--green)',
                      boxShadow: '0 0 6px var(--green)', animation: 'pulse-red 1.5s ease-in-out infinite',
                      flexShrink: 0,
                    }} />
                  ) : (
                    <div className={`rag-dot rag-${a.status === 'done' ? 'green' : 'red'}`} />
                  )}
                  <span style={{ fontWeight: 600, fontSize: 12, color: 'var(--ink)' }}>{a.name}</span>
                  <span style={{ fontSize: 10, fontWeight: 700, color: domainColor, background: `${domainColor}18`, padding: '1px 7px', borderRadius: 10, border: `1px solid ${domainColor}33` }}>
                    {a.domain}
                  </span>
                  <span style={{ fontSize: 10, color: 'var(--faint)', marginLeft: 'auto' }}>
                    {isRunning ? `heartbeat ${timeAgo(a.lastHeartbeat)}` : a.status}
                  </span>
                </div>
                <div style={{ fontSize: 11, color: 'var(--muted)', paddingLeft: 16 }}>{a.job}</div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
