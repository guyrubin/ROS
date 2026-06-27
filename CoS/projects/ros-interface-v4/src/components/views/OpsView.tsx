import { DayStrip } from '../panels/DayStrip'
import { InboxTriage } from '../panels/InboxTriage'
import { TasksPanel } from '../panels/TasksPanel'
import { FitnessRings } from '../panels/FitnessRings'
import { QuickCapture } from '../panels/QuickCapture'
import { BrainDump } from '../panels/BrainDump'

export default function OpsView() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 16, maxWidth: 1200 }}>
      {/* Main */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <DayStrip full />
        <InboxTriage />
        <TasksPanel />
      </div>
      {/* Sidebar */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <FitnessRings />
        <QuickCapture />
        <BrainDump />
      </div>
    </div>
  )
}
