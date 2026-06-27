import { EAClientCockpit } from '../panels/EAClientCockpit'
import { ArborCommand } from '../panels/ArborCommand'
import { ActiveDeliverables } from '../panels/ActiveDeliverables'

export default function WorkView() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 1200 }}>
      <EAClientCockpit fullWidth />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <ArborCommand />
        <ActiveDeliverables />
      </div>
    </div>
  )
}
