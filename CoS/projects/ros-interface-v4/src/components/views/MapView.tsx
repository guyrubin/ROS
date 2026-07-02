import { SystemGraph } from '../panels/SystemGraph'

export default function MapView() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, height: 'calc(100vh - var(--topbar-h) - 64px)', maxWidth: 1440 }}>
      <div>
        <div style={{ fontSize: 11, color: 'var(--faint)', letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: 'var(--mono)' }}>
          Knowledge graph · Graphify
        </div>
        <div style={{ fontSize: 17, fontWeight: 700, color: 'var(--ink)', marginTop: 2 }}>
          Multi-Agent &amp; Skills Map
        </div>
        <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 3 }}>
          Toggle <b>Agents &amp; Skills</b> (curated: runtimes · agents · subagents · skills · capabilities · connectors) vs the live <b>Knowledge Graph</b> (real Graphify extraction over <code style={{ fontFamily: 'var(--mono)', fontSize: 11 }}>00_System</code> + <code style={{ fontFamily: 'var(--mono)', fontSize: 11 }}>.claude</code>, 12 communities). Drag, scroll to zoom, click for detail.
        </div>
      </div>
      <div style={{ flex: 1, minHeight: 0 }}>
        <SystemGraph />
      </div>
    </div>
  )
}
