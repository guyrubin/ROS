import { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useStore } from './store'
import type { RosState } from './types'

declare global { interface Window { __ROS_STATE__?: Partial<RosState> } }

async function fetchState(): Promise<Partial<RosState>> {
  // Self-contained artifact build: state is inlined on window — no server to fetch from.
  if (typeof window !== 'undefined' && window.__ROS_STATE__) return window.__ROS_STATE__
  const res = await fetch('/state.json', { cache: 'no-store' })
  if (!res.ok) throw new Error(`state.json ${res.status}`)
  return res.json()
}

export function useStateSync() {
  const { setRosState, setLoading, setError } = useStore()

  const query = useQuery<Partial<RosState>, Error>({
    queryKey: ['ros-state'],
    queryFn:  fetchState,
    refetchInterval: 5000,
    staleTime: 4000,
  })

  useEffect(() => {
    if (query.isLoading) { setLoading(true); return }
    if (query.error)     { setError(query.error.message); return }
    if (query.data)      { setRosState(query.data) }
  }, [query.data, query.isLoading, query.error, setRosState, setLoading, setError])

  return query
}
