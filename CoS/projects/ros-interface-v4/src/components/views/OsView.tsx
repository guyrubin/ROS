import { AgentActivity } from '../panels/AgentActivity'
import { MemoryFreshness } from '../panels/MemoryFreshness'
import { ConnectorPulse } from '../panels/ConnectorPulse'
import { FileStats } from '../panels/FileStats'
import { CapabilityBacklog } from '../panels/CapabilityBacklog'
import { WorldMap } from '../panels/WorldMap'
import { DocumentGraph } from '../panels/DocumentGraph'

export default function OsView() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 1440 }}>
      <DocumentGraph />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
        <AgentActivity />
        <MemoryFreshness />
        <ConnectorPulse />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <CapabilityBacklog />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <FileStats />
          <WorldMap />
        </div>
      </div>
    </div>
  )
}
