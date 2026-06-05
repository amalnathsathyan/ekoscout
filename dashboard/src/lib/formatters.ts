// ── Number Formatting ──

export function formatTVL(value: number): string {
  if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`
  if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`
  if (value >= 1e6) return `$${(value / 1e6).toFixed(1)}M`
  if (value >= 1e3) return `$${(value / 1e3).toFixed(0)}K`
  return `$${value.toFixed(0)}`
}

export function formatCompact(value: number): string {
  if (value >= 1e6) return `${(value / 1e6).toFixed(1)}M`
  if (value >= 1e3) return `${(value / 1e3).toFixed(1)}K`
  return String(value)
}

export function formatTokenBalance(balance: number): string {
  if (balance >= 1e6) return `${(balance / 1e6).toFixed(2)}M`
  if (balance >= 1e3) return `${(balance / 1e3).toFixed(1)}K`
  return balance.toLocaleString()
}

// ── Date Formatting ──

export function daysUntil(dateStr: string | null): number {
  if (!dateStr) return Infinity
  const diff = new Date(dateStr).getTime() - Date.now()
  return Math.ceil(diff / 86_400_000)
}

export function daysUntilLabel(dateStr: string | null): string {
  const d = daysUntil(dateStr)
  if (d === Infinity) return 'No deadline'
  if (d <= 0) return 'Closed'
  if (d === 1) return '1 day left'
  if (d <= 7) return `${d}d left`
  if (d <= 30) return `${Math.ceil(d / 7)}w left`
  return `${Math.ceil(d / 30)}mo left`
}

export function timeAgo(dateStr: string | null): string {
  if (!dateStr) return 'Unknown'
  const diff = Date.now() - new Date(dateStr).getTime()
  const days = Math.floor(diff / 86_400_000)
  if (days === 0) return 'Today'
  if (days === 1) return 'Yesterday'
  if (days < 7) return `${days}d ago`
  if (days < 30) return `${Math.ceil(days / 7)}w ago`
  return `${Math.ceil(days / 30)}mo ago`
}

// ── Competition Density ──

export function densityLabel(value: number): string {
  if (value < 1.0) return 'Low'
  if (value < 2.0) return 'Medium'
  return 'High'
}

export type DensityLevel = 'low' | 'medium' | 'high'

export function densityLevel(value: number): DensityLevel {
  if (value < 1.0) return 'low'
  if (value < 2.0) return 'medium'
  return 'high'
}

// ── Health Index ──

export type HealthLevel = 'high' | 'medium' | 'low'

export function healthLevel(value: number): HealthLevel {
  if (value >= 80) return 'high'
  if (value >= 60) return 'medium'
  return 'low'
}

// ── Category ──

export function categoryLabel(cat: string): string {
  const map: Record<string, string> = {
    L1: 'Layer 1',
    L2: 'Layer 2',
    Sidechain: 'Sidechain',
    Appchain: 'Appchain',
  }
  return map[cat] || cat
}

// ── Funding display ──

export function displayFunding(program: { funding_amount: string | null; prize_pool: string | null }): string {
  if (program.prize_pool) return program.prize_pool
  if (program.funding_amount) return program.funding_amount
  return 'TBD'
}

// ── Low-hanging fruit detection ──

export function isLowHangingFruit(program: { chain_competition_density?: number; funding_amount: string | null; prize_pool: string | null }): boolean {
  const density = program.chain_competition_density ?? 2
  const hasFunding = !!(program.funding_amount || program.prize_pool)
  return density < 1.0 && hasFunding
}
