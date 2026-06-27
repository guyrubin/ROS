import { useStore } from '../../state/store'
import { DOMAIN_COLORS } from '../../design/domain-colors'

const ACTIVE_PROJECTS = [
  { name: 'Coca-Cola employment contract', domain: 'EA', stage: 'Final contract', next: 'Receive / review contract', status: 'amber' as const },
  { name: 'ABN freelance onboarding',       domain: 'EA', stage: 'Onboarding',     next: 'Complete onboarding steps/access', status: 'green' as const },
  { name: 'Arbor prod milestone',            domain: 'PAI', stage: 'Active build',  next: 'Merge redesign to main',          status: 'amber' as const },
]

export function ProjectMilestones() {
  const { state } = useStore()
  const domainTasks = state?.tasks?.back ?? []
  const projects = ACTIVE_PROJECTS

  return (
    <div className="card">
      <div className="head">Project Milestones</div>
      <div style={{ padding: '4px 0' }}>
        {projects.map((p, i) => {
          const color = DOMAIN_COLORS[p.domain] ?? 'var(--muted)'
          return (
            <div key={i} style={{ padding: '10px 16px', borderBottom: '1px solid var(--line)', display: 'flex', flexDirection: 'column', gap: 4 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div className={`rag-dot rag-${p.status}`} />
                <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--ink)' }}>{p.name}</span>
                <span style={{ fontSize: 10, fontWeight: 700, color, background: `${color}18`, border: `1px solid ${color}33`, padding: '1px 7px', borderRadius: 10, marginLeft: 'auto' }}>
                  {p.domain}
                </span>
              </div>
              <div style={{ display: 'flex', gap: 12, fontSize: 11, paddingLeft: 16 }}>
                <span style={{ color: 'var(--faint)' }}>{p.stage}</span>
                <span style={{ color: 'var(--muted)' }}>→ {p.next}</span>
              </div>
            </div>
          )
        })}
        {domainTasks.length > 0 && (
          <div style={{ padding: '8px 16px' }}>
            <div style={{ fontSize: 10, color: 'var(--faint)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Task backlog</div>
            {domainTasks.slice(0, 3).map((t, i) => (
              <div key={i} style={{ fontSize: 11, color: 'var(--muted)', padding: '3px 0', display: 'flex', gap: 8 }}>
                <span style={{ color: DOMAIN_COLORS[t.domain ?? ''] ?? 'var(--faint)' }}>◈</span>
                {t.t}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
