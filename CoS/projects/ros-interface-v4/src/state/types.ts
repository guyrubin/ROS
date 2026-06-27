/* ROS state.json v4 TypeScript interfaces */

export type RAG = 'green' | 'amber' | 'red'
export type SafetyLevel = 0 | 1 | 2 | 3 | 4 | 5 | number
export type AgentId = 'claude' | 'hermes' | 'codex' | 'dashboard'
export type ActionStatus = 'pending' | 'done' | 'blocked' | 'rejected'
export type JobStatus = 'running' | 'done' | 'error'

export interface FrontSeat {
  mission: string
  domain: string
  startedAt: string
  timerMode?: 'deep' | 'stretch' | 'run'
  timerSeconds?: number
}

export interface OKR {
  objective: string
  keyResults: { text: string; progress: number }[]
}

export interface Milestone {
  t: string
  d: number  // 0=open 1=done
  due?: string
}

export interface DomainState {
  k: string
  t: string
  s: RAG
  ctx: string
  file: string
  color?: string
  tasks?: Task[]
  signals?: Signal[]
  notes?: string
  okrs?: OKR[]
  milestones?: Milestone[]
}

export interface MapItem {
  c: string
  i: string
  b: string
  e: string
  sev: RAG
}

export interface Task {
  t: string
  d: number
  domain?: string
  due?: string
}

export interface Signal {
  sev: RAG
  t: string
  s: string
}

export interface ClientMilestone {
  t: string
  d: number
}

export interface Client {
  id: string
  agent: string
  name: string
  role: string
  relationship: string
  stack: string
  domainFocus: string
  status: RAG
  phase: string
  nextDecision: string
  owner: string
  identity: string
  stakeholders: { name: string; role: string; contact?: string }[]
  tools: string
  milestones: ClientMilestone[]
  drive: string
  rosFolder: string
  contextFile: string
  notion: string
  active: boolean
}

export interface ActionQueueItem {
  id: string
  ts: string
  source: string
  verb: string
  args: Record<string, unknown>
  domain?: string
  safety: SafetyLevel
  status: ActionStatus
  result?: string
  confirmedAt?: string
  confirmedBy?: string
}

export interface AgentJob {
  id: string
  name: string
  job: string
  domain: string
  startedAt: string
  status: JobStatus
  lastHeartbeat: string
}

export interface GitState {
  ahead: number
  behind: number
  lastCommit: string
  lastAgent: string
}

export interface FileStats {
  totalMd: number
  recentWrites48h: number
  worktreeCount: number
  updatedAt: string
}

export interface MemoryDates {
  CoS?: string
  KK?: string
  HV?: string
  EA?: string
  PAI?: string
  MKT?: string
  FIN?: string
}

export interface LiveGmailAccount {
  unread: number
  fetchedAt: string
}

export interface CalendarEvent {
  id: string
  title: string
  start: string
  end: string
  location?: string
  attendees?: string[]
}

export interface LiveData {
  gmail: {
    bguy: LiveGmailAccount
    hollandvest: LiveGmailAccount
    joseph: LiveGmailAccount
  }
  calendar: {
    eventsToday: CalendarEvent[]
    fetchedAt: string
  }
  notion: {
    openTasks: number
    openDecisions: number
    fetchedAt: string
  }
}

export interface Integration {
  status: 'live' | 'planned' | 'error'
  via: string
}

export interface Fitness {
  move: number
  stretch: number
  run: number
}

export interface RosState {
  v: number
  meta: {
    owner: string
    updatedAt: string
    updatedBy: AgentId
    note?: string
    gitState?: GitState
    fileStats?: FileStats
    memoryDates?: MemoryDates
  }
  frontSeat: FrontSeat
  domains: DomainState[]
  map: MapItem[]
  tasks: { back: Task[]; trunk: Task[] }
  signals: Signal[]
  clients: Client[]
  actionQueue: ActionQueueItem[]
  agents?: AgentJob[]
  liveData?: LiveData
  fitness: Fitness
  sessions: number
  lastDay: string
  integrations: Record<string, Integration>
}
