// ── Database Schema Types (mirrors Supabase tables) ──

export interface Chain {
  id: string
  name: string
  category: string
  market_cap_rank: number
  health_index: number
  competition_density: number
  tvl: number
  dev_count: number
  created_at?: string
}

export interface Program {
  id: string
  chain_id: string
  name: string
  type: 'grant' | 'hackathon' | 'accelerator'
  funding_amount: string | null
  prize_pool: string | null
  status: string
  deadline: string | null
  link: string | null
  // Joined field (optional, from chains table)
  chain_name?: string
  chain_competition_density?: number
}

export interface Job {
  id: string
  chain_id: string | null
  title: string
  company: string | null
  role_type: string | null
  salary_range: string | null
  is_remote: boolean
  link: string | null
  posted_at: string | null
  // Joined field
  chain_name?: string
}

// ── Token Tier System ──

export type TokenTier = 'free' | 'radar' | 'alpha' | 'enterprise'

export interface TierConfig {
  name: string
  displayName: string
  minBalance: number
  color: string
  glowColor: string
  icon: string
}

// ── Realtime Event Types ──

export type RealtimeEvent = 'INSERT' | 'UPDATE' | 'DELETE'

export interface RealtimePayload<T> {
  eventType: RealtimeEvent
  new: T
  old: T | null
}

// ── UI State Types ──

export type DirectoryTab = 'chains' | 'programs' | 'jobs'

export type ProgramFilter = 'all' | 'grant' | 'hackathon' | 'accelerator'

export type RoleFilter = 'all' | string

export interface FlashState {
  id: string
  active: boolean
}
