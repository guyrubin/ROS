import { useStore } from '../../state/store'
import { timeAgo } from '../../lib/formatters'

const ACCOUNTS = [
  { key: 'bguy'        as const, label: 'Guy (bguy)',      email: 'bguy.rubin@gmail.com',       color: 'var(--blue)' },
  { key: 'hollandvest' as const, label: 'HollandVest',     email: 'bhollandvest@gmail.com',      color: 'var(--hv)' },
  { key: 'joseph'      as const, label: 'Joseph (EA)',      email: 'josephdoronrubin@gmail.com',  color: 'var(--ea)' },
]

export function InboxTriage() {
  const { state } = useStore()
  const gmail = state?.liveData?.gmail

  return (
    <div className="card">
      <div className="head">Inbox Triage</div>
      <div style={{ padding: '4px 0' }}>
        {ACCOUNTS.map((acc) => {
          const data = gmail?.[acc.key]
          const stale = data?.fetchedAt ? Date.now() - new Date(data.fetchedAt).getTime() > 15 * 60 * 1000 : true
          return (
            <div key={acc.key} style={{
              padding: '10px 16px', borderBottom: '1px solid var(--line)',
              display: 'flex', alignItems: 'center', gap: 12,
            }}>
              <div style={{ width: 7, height: 7, borderRadius: '50%', background: stale ? 'var(--faint)' : 'var(--green)', flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: acc.color }}>{acc.label}</div>
                <div style={{ fontSize: 10, color: 'var(--faint)' }}>{acc.email}</div>
              </div>
              {data ? (
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 18, fontWeight: 700, color: data.unread > 0 ? 'var(--ink)' : 'var(--faint)', fontVariantNumeric: 'tabular-nums' }}>
                    {data.unread}
                  </div>
                  <div style={{ fontSize: 9, color: 'var(--faint)' }}>
                    {stale ? '⚠ stale' : timeAgo(data.fetchedAt)}
                  </div>
                </div>
              ) : (
                <div style={{ fontSize: 11, color: 'var(--faint)' }}>—</div>
              )}
              <a
                href={`https://mail.google.com/mail/u/0/?authuser=${acc.email}#inbox`}
                target="_blank"
                rel="noreferrer"
                className="btn"
                style={{ fontSize: 11, textDecoration: 'none', padding: '3px 10px' }}
              >
                Open
              </a>
            </div>
          )
        })}
      </div>
    </div>
  )
}
