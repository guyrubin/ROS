import { FrontSeat } from '../panels/FrontSeat'
import { ResolveQueue } from '../panels/ResolveQueue'
import { DomainPulse } from '../panels/DomainPulse'
import { DayStrip } from '../panels/DayStrip'
import { OpenDecisions } from '../panels/OpenDecisions'

export default function NowView() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 16, maxWidth: 1400 }}>
      {/* Left column */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <FrontSeat />
        <DomainPulse />
        <DayStrip />
        <OpenDecisions />
      </div>
      {/* Right column */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <ResolveQueue />
      </div>
    </div>
  )
}
