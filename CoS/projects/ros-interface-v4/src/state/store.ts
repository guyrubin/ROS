import { create } from 'zustand'
import type { RosState, ActionQueueItem, SafetyLevel } from './types'

const DEFAULT_LIVE_DATA: RosState['liveData'] = {
  gmail: {
    bguy:        { unread: 0, fetchedAt: '' },
    hollandvest: { unread: 0, fetchedAt: '' },
    joseph:      { unread: 0, fetchedAt: '' },
  },
  calendar: { eventsToday: [], fetchedAt: '' },
  notion:   { openTasks: 0, openDecisions: 0, fetchedAt: '' },
}

function applyV3Defaults(raw: Partial<RosState>): RosState {
  return {
    v: raw.v ?? 3,
    meta: {
      owner: 'Guy Rubin',
      updatedAt: '',
      updatedBy: 'claude',
      ...(raw.meta ?? {}),
    },
    frontSeat:    raw.frontSeat    ?? { mission: '', domain: '', startedAt: '' },
    domains:      raw.domains      ?? [],
    map:          raw.map          ?? [],
    tasks:        raw.tasks        ?? { back: [], trunk: [] },
    signals:      raw.signals      ?? [],
    clients:      raw.clients      ?? [],
    actionQueue:  raw.actionQueue  ?? [],
    agents:       raw.agents       ?? [],
    liveData:     raw.liveData     ?? DEFAULT_LIVE_DATA,
    fitness:      raw.fitness      ?? { move: 0, stretch: 0, run: 0 },
    sessions:     raw.sessions     ?? 0,
    lastDay:      raw.lastDay      ?? '',
    integrations: raw.integrations ?? {},
  } as RosState
}

interface Store {
  state: RosState | null
  loading: boolean
  error: string | null
  slideOver: string | null          // domain key for open slide-over

  setRosState: (raw: Partial<RosState>) => void
  setLoading: (v: boolean) => void
  setError: (e: string | null) => void
  openSlideOver: (domain: string) => void
  closeSlideOver: () => void
  enqueueAction: (item: Omit<ActionQueueItem, 'id' | 'ts' | 'status'>) => void
  confirmAction: (id: string) => void
  rejectAction: (id: string) => void
}

export const useStore = create<Store>((set, get) => ({
  state:     null,
  loading:   true,
  error:     null,
  slideOver: null,

  setRosState: (raw) => set({ state: applyV3Defaults(raw), loading: false, error: null }),
  setLoading:  (v)   => set({ loading: v }),
  setError:    (e)   => set({ error: e, loading: false }),

  openSlideOver:  (domain) => set({ slideOver: domain }),
  closeSlideOver: ()       => set({ slideOver: null }),

  enqueueAction: (item) => {
    const s = get().state
    if (!s) return
    const newItem: ActionQueueItem = {
      ...item,
      id:     crypto.randomUUID(),
      ts:     new Date().toISOString(),
      status: 'pending',
      safety: item.safety as SafetyLevel,
    }
    set({
      state: {
        ...s,
        actionQueue: [...s.actionQueue, newItem],
      },
    })
  },

  confirmAction: (id) => {
    const s = get().state
    if (!s) return
    set({
      state: {
        ...s,
        actionQueue: s.actionQueue.map((a) =>
          a.id === id
            ? { ...a, status: 'done', confirmedAt: new Date().toISOString(), confirmedBy: 'guy' }
            : a
        ),
      },
    })
  },

  rejectAction: (id) => {
    const s = get().state
    if (!s) return
    set({
      state: {
        ...s,
        actionQueue: s.actionQueue.map((a) =>
          a.id === id ? { ...a, status: 'rejected' } : a
        ),
      },
    })
  },
}))
