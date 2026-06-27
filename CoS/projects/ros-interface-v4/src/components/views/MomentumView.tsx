import { OkrResolution } from '../panels/OkrResolution'
import { ProjectMilestones } from '../panels/ProjectMilestones'
import { DealPipeline } from '../panels/DealPipeline'
import { EADeliveryTrack } from '../panels/EADeliveryTrack'
import { ArborTrack } from '../panels/ArborTrack'

export default function MomentumView() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 1200 }}>
      <OkrResolution />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <ProjectMilestones />
        <EADeliveryTrack />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <DealPipeline />
        <ArborTrack />
      </div>
    </div>
  )
}
