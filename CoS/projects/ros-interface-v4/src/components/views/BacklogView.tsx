import { BacklogHub } from '../panels/BacklogHub'

export default function BacklogView() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 1200 }}>
      <div>
        <div style={{ fontSize: 11, color: 'var(--faint)', letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: 'var(--mono)' }}>
          Centralized · every domain
        </div>
        <div style={{ fontSize: 17, fontWeight: 700, color: 'var(--ink)', marginTop: 2 }}>Backlog Hub</div>
        <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 3 }}>
          Every scattered domain backlog (CoS · EA · PAI …) parsed from its source markdown into one place. Filter by domain or status; expand a backlog to see its items; open the source in Obsidian.
        </div>
      </div>
      <BacklogHub />
    </div>
  )
}
