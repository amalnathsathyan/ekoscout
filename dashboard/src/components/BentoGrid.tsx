import { useMemo } from 'react'
import { Globe, Gift, Briefcase, Layers } from 'lucide-react'
import AnimatedCounter from './ui/AnimatedCounter'
import { formatTVL } from '../lib/formatters'
import type { Chain, Program, Job } from '../lib/types'

/**
 * Props for the BentoGrid component.
 */
interface BentoGridProps {
  /** Array of chain data objects */
  chains: Chain[]
  /** Array of opportunity programs */
  programs: Program[]
  /** Array of job listings */
  jobs: Job[]
  /** When true, renders skeleton placeholders in place of real data */
  loading: boolean
}

// ── Skeleton block helper ────────────────────────────────────────────────────

/** Renders a shimmering skeleton placeholder. */
function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`skeleton ${className}`} />
}

// ── Individual card components ───────────────────────────────────────────────

/**
 * Card A — Chains Scanned
 * Displays how many blockchains are being tracked.
 */
function ChainsCard({ chains, loading }: { chains: Chain[]; loading: boolean }) {
  const count = chains.length || 47

  return (
    <div className="glass-card relative overflow-hidden p-6 group">
      {/* Accent glow circle — violet */}
      <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-violet-500 opacity-10 blur-2xl transition-all duration-500 group-hover:opacity-20" />

      <div className="relative z-10 flex flex-col gap-3">
        {/* Header */}
        <div className="flex items-center gap-2.5">
          <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-violet-500/10">
            <Globe className="w-5 h-5 text-violet-400" />
          </div>
          <span className="text-sm font-medium text-white/50">Chains Scanned</span>
        </div>

        {/* Value */}
        {loading ? (
          <Skeleton className="h-9 w-20" />
        ) : (
          <p className="text-2xl font-bold text-white tracking-tight">
            {count.toLocaleString()}
          </p>
        )}

        {/* Subtitle */}
        {loading ? (
          <Skeleton className="h-4 w-36" />
        ) : (
          <p className="text-xs text-white/40">Top 200 by market cap</p>
        )}
      </div>
    </div>
  )
}

/**
 * Card B — Opportunities Matrix
 * Shows total active programs and a breakdown by type.
 */
function OpportunitiesCard({
  programs,
  loading,
}: {
  programs: Program[]
  loading: boolean
}) {
  const breakdown = useMemo(() => {
    const grants = programs.filter((p) => p.type === 'grant').length
    const hackathons = programs.filter((p) => p.type === 'hackathon').length
    const accelerators = programs.filter((p) => p.type === 'accelerator').length
    return { grants, hackathons, accelerators, total: programs.length }
  }, [programs])

  return (
    <div className="glass-card relative overflow-hidden p-6 group">
      {/* Accent glow circle — blue */}
      <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-blue-500 opacity-10 blur-2xl transition-all duration-500 group-hover:opacity-20" />

      <div className="relative z-10 flex flex-col gap-3">
        {/* Header */}
        <div className="flex items-center gap-2.5">
          <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-blue-500/10">
            <Gift className="w-5 h-5 text-blue-400" />
          </div>
          <span className="text-sm font-medium text-white/50">Opportunities Matrix</span>
        </div>

        {/* Value */}
        {loading ? (
          <Skeleton className="h-9 w-16" />
        ) : (
          <p className="text-2xl font-bold text-white tracking-tight">
            {breakdown.total.toLocaleString()}
          </p>
        )}

        {/* Breakdown pills */}
        {loading ? (
          <div className="flex gap-2">
            <Skeleton className="h-5 w-16" />
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-5 w-20" />
          </div>
        ) : (
          <div className="flex flex-wrap gap-1.5">
            <Pill dotColor="bg-purple-400" label={`${breakdown.grants} grants`} />
            <Pill dotColor="bg-yellow-400" label={`${breakdown.hackathons} hackathons`} />
            <Pill dotColor="bg-green-400" label={`${breakdown.accelerators} accelerators`} />
          </div>
        )}
      </div>
    </div>
  )
}

/** Mini pill used inside the Opportunities card. */
function Pill({ dotColor, label }: { dotColor: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-white/5 px-2.5 py-0.5 text-[11px] font-medium text-white/60">
      <span className={`inline-block w-1.5 h-1.5 rounded-full ${dotColor}`} />
      {label}
    </span>
  )
}

/**
 * Card C — Talent Market
 * Shows total job count and remote vs on-site ratio.
 */
function TalentCard({ jobs, loading }: { jobs: Job[]; loading: boolean }) {
  const stats = useMemo(() => {
    const total = jobs.length
    const remote = jobs.filter((j) => j.is_remote).length
    const remotePercent = total > 0 ? Math.round((remote / total) * 100) : 0
    return { total, remotePercent }
  }, [jobs])

  return (
    <div className="glass-card relative overflow-hidden p-6 group">
      {/* Accent glow circle — pink */}
      <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-pink-500 opacity-10 blur-2xl transition-all duration-500 group-hover:opacity-20" />

      <div className="relative z-10 flex flex-col gap-3">
        {/* Header */}
        <div className="flex items-center gap-2.5">
          <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-pink-500/10">
            <Briefcase className="w-5 h-5 text-pink-400" />
          </div>
          <span className="text-sm font-medium text-white/50">Talent Market</span>
        </div>

        {/* Value */}
        {loading ? (
          <Skeleton className="h-9 w-14" />
        ) : (
          <p className="text-2xl font-bold text-white tracking-tight">
            {stats.total.toLocaleString()}
          </p>
        )}

        {/* Subtitle + bar */}
        {loading ? (
          <>
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-1.5 w-full" />
          </>
        ) : (
          <>
            <p className="text-xs text-white/40">{stats.remotePercent}% remote</p>
            {/* Remote vs onsite ratio bar */}
            <div className="w-full h-1.5 rounded-full bg-white/5 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-pink-500 to-pink-400 transition-all duration-700"
                style={{ width: `${stats.remotePercent}%` }}
              />
            </div>
          </>
        )}
      </div>
    </div>
  )
}

/**
 * Card D — Economic Force (spans 2 columns on large screens)
 * Shows aggregate TVL across all tracked chains with an animated counter.
 */
function EconomicCard({ chains, loading }: { chains: Chain[]; loading: boolean }) {
  const totalTvl = useMemo(
    () => chains.reduce((sum, c) => sum + (c.tvl ?? 0), 0),
    [chains],
  )

  return (
    <div className="glass-card relative overflow-hidden p-6 lg:col-span-2 group">
      {/* Accent glow circle — emerald */}
      <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-emerald-500 opacity-10 blur-2xl transition-all duration-500 group-hover:opacity-20" />

      {/* Subtle gradient background */}
      <div className="absolute inset-0 rounded-[inherit] bg-gradient-to-br from-emerald-500/5 to-transparent pointer-events-none" />

      <div className="relative z-10 flex flex-col gap-3">
        {/* Header */}
        <div className="flex items-center gap-2.5">
          <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-emerald-500/10">
            <Layers className="w-5 h-5 text-emerald-400" />
          </div>
          <span className="text-sm font-medium text-white/50">Economic Force</span>
        </div>

        {/* Value — animated counter */}
        {loading ? (
          <Skeleton className="h-11 w-44" />
        ) : (
          <div className="text-3xl font-bold text-white tracking-tight">
            <AnimatedCounter
              value={totalTvl}
              prefix="$"
              duration={2400}
              decimals={0}
            />
          </div>
        )}

        {/* Formatted subtitle */}
        {loading ? (
          <Skeleton className="h-4 w-52" />
        ) : (
          <p className="text-xs text-white/40">
            <span className="text-emerald-400/80 font-medium">{formatTVL(totalTvl)}</span>
            {' · '}Aggregate ecosystem TVL tracked
          </p>
        )}
      </div>
    </div>
  )
}

// ── Main BentoGrid ───────────────────────────────────────────────────────────

/**
 * BentoGrid — an asymmetric 4-card stats layout for the EkoScout dashboard.
 *
 * Responsive breakpoints:
 * - **Mobile**: single column
 * - **md**: 2 columns
 * - **lg**: 4 columns with Card D spanning 2
 *
 * Each card uses the `glass-card` class and includes a colored accent glow
 * circle, hover lift animation, and skeleton loading states.
 *
 * @example
 * ```tsx
 * <BentoGrid chains={chains} programs={programs} jobs={jobs} loading={false} />
 * ```
 */
export default function BentoGrid({ chains, programs, jobs, loading }: BentoGridProps) {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <ChainsCard chains={chains} loading={loading} />
      <OpportunitiesCard programs={programs} loading={loading} />
      <TalentCard jobs={jobs} loading={loading} />
      <EconomicCard chains={chains} loading={loading} />
    </section>
  )
}
