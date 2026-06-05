/**
 * EcosystemDirectory — The centerpiece tabbed directory with three views:
 * Chains (data table), Programs (card list), and Jobs (grouped listing).
 *
 * Features:
 * - Smooth animated tab bar with violet accent underline
 * - Contextual filter dropdowns per active tab
 * - Real-time flash animations for freshly-updated rows/cards
 * - Skeleton loading states with shimmer animation
 * - Health index bars, competition density badges, category pills
 * - Low-hanging-fruit detection for program cards
 * - Responsive layout with glassmorphism effects
 */

import { useState, useMemo, useRef, useLayoutEffect } from 'react'
import {
  Globe,
  Gift,
  Briefcase,
  ArrowUpRight,
  ExternalLink,
  Filter,
} from 'lucide-react'
import {
  formatTVL,
  formatCompact,
  densityLabel,
  densityLevel,
  healthLevel,
  daysUntilLabel,
  timeAgo,
  displayFunding,
  isLowHangingFruit,
} from '../lib/formatters'
import { CHAIN_COLORS, DEFAULT_CHAIN_COLOR } from '../lib/constants'
import type { Chain, Program, Job, DirectoryTab, ProgramFilter } from '../lib/types'

// ── Props ──────────────────────────────────────────────────────────────────────

interface EcosystemDirectoryProps {
  chains: Chain[]
  programs: Program[]
  jobs: Job[]
  chainsLoading: boolean
  programsLoading: boolean
  jobsLoading: boolean
  isChainsFlashing: (id: string) => boolean
  isProgramsFlashing: (id: string) => boolean
  isJobsFlashing: (id: string) => boolean
}

// ── Tab Configuration ──────────────────────────────────────────────────────────

const TABS: { key: DirectoryTab; label: string; emoji: string; icon: typeof Globe }[] = [
  { key: 'chains', label: 'Chains', emoji: '🌐', icon: Globe },
  { key: 'programs', label: 'Programs', emoji: '🎁', icon: Gift },
  { key: 'jobs', label: 'Jobs', emoji: '💼', icon: Briefcase },
]

const PROGRAM_FILTER_OPTIONS: { key: ProgramFilter; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'grant', label: 'Grants' },
  { key: 'hackathon', label: 'Hackathons' },
  { key: 'accelerator', label: 'Accelerators' },
]

const CHAIN_CATEGORIES = ['All', 'L1', 'L2', 'Sidechain', 'Appchain']

// ── Helpers ────────────────────────────────────────────────────────────────────

/** Returns the CSS class for a category badge pill */
function categoryBadgeClass(category: string): string {
  switch (category) {
    case 'L1':
      return 'badge-l1'
    case 'L2':
      return 'badge-l2'
    case 'Sidechain':
      return 'badge-sidechain'
    case 'Appchain':
      return 'badge-appchain'
    default:
      return 'badge-l1'
  }
}

/** Returns the CSS class for a competition density badge */
function densityBadgeClass(value: number): string {
  const level = densityLevel(value)
  switch (level) {
    case 'low':
      return 'badge-low'
    case 'medium':
      return 'badge-mid'
    case 'high':
      return 'badge-high'
    default:
      return 'badge-mid'
  }
}

/** Returns the CSS class for a health index bar */
function healthBarClass(value: number): string {
  const level = healthLevel(value)
  switch (level) {
    case 'high':
      return 'health-high'
    case 'medium':
      return 'health-mid'
    case 'low':
      return 'health-low'
    default:
      return 'health-mid'
  }
}

/** Returns the CSS class for a program type badge */
function programTypeBadgeClass(type: string): string {
  switch (type) {
    case 'grant':
      return 'badge-grant'
    case 'hackathon':
      return 'badge-hackathon'
    case 'accelerator':
      return 'badge-accelerator'
    default:
      return 'badge-grant'
  }
}

/** Get chain color config for the initial-letter box */
function getChainColor(chainName: string) {
  return CHAIN_COLORS[chainName] ?? DEFAULT_CHAIN_COLOR
}

// ── Skeleton Sub-Components ────────────────────────────────────────────────────

/** Skeleton row for the chains table loading state */
function ChainSkeletonRow() {
  return (
    <tr className="border-b border-white/[0.03]">
      <td className="p-4 pl-5">
        <div className="flex items-center gap-2.5">
          <div className="skeleton w-7 h-7 rounded-lg" />
          <div className="skeleton h-4 w-24" />
        </div>
      </td>
      <td className="p-4"><div className="skeleton h-4 w-14 rounded-full" /></td>
      <td className="p-4"><div className="skeleton h-4 w-10" /></td>
      <td className="p-4"><div className="skeleton h-4 w-16" /></td>
      <td className="p-4"><div className="skeleton h-4 w-12" /></td>
      <td className="p-4">
        <div className="flex items-center gap-2">
          <div className="skeleton h-1.5 w-[80px] rounded-full" />
          <div className="skeleton h-4 w-8" />
        </div>
      </td>
      <td className="p-4"><div className="skeleton h-4 w-20 rounded-full" /></td>
    </tr>
  )
}

/** Skeleton card for programs/jobs loading state */
function CardSkeleton() {
  return (
    <div className="glass-card p-4">
      <div className="flex items-center gap-2 mb-3">
        <div className="skeleton h-5 w-16 rounded-full" />
        <div className="skeleton h-5 w-14 rounded-full" />
      </div>
      <div className="skeleton h-5 w-3/4 mb-2" />
      <div className="skeleton h-4 w-1/2 mb-3" />
      <div className="flex items-center justify-between">
        <div className="skeleton h-4 w-20" />
        <div className="skeleton h-8 w-24 rounded-lg" />
      </div>
    </div>
  )
}

// ── Chains View ────────────────────────────────────────────────────────────────

interface ChainsViewProps {
  chains: Chain[]
  loading: boolean
  isFlashing: (id: string) => boolean
  categoryFilter: string
}

function ChainsView({ chains, loading, isFlashing, categoryFilter }: ChainsViewProps) {
  const filteredChains = useMemo(() => {
    if (categoryFilter === 'All') return chains
    return chains.filter((c) => c.category === categoryFilter)
  }, [chains, categoryFilter])

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/5 text-white/30 text-[11px] font-semibold uppercase tracking-wider">
              <th className="p-4 pl-5">Chain</th>
              <th className="p-4">Category</th>
              <th className="p-4">Rank</th>
              <th className="p-4">TVL</th>
              <th className="p-4">Dev Count</th>
              <th className="p-4">Health Index</th>
              <th className="p-4 pr-5">Competition</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.03]">
            {loading
              ? Array.from({ length: 6 }).map((_, i) => <ChainSkeletonRow key={i} />)
              : filteredChains.map((chain) => {
                  const color = getChainColor(chain.name)
                  const flashing = isFlashing(chain.id)

                  return (
                    <tr
                      key={chain.id}
                      className={`
                        hover:bg-white/[0.02] transition-all duration-500
                        ${flashing ? 'border-l-2 border-green-400/40 bg-green-500/5 shadow-[inset_0_0_20px_rgba(74,222,128,0.05)]' : 'border-l-2 border-transparent'}
                      `}
                    >
                      {/* Chain name with colored initial */}
                      <td className="p-4 pl-5">
                        <div className="flex items-center gap-2.5">
                          <div
                            className="w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-bold shrink-0"
                            style={{ background: color.bg, color: color.text }}
                          >
                            {chain.name.charAt(0)}
                          </div>
                          <span className="font-semibold text-sm whitespace-nowrap">{chain.name}</span>
                        </div>
                      </td>

                      {/* Category pill */}
                      <td className="p-4">
                        <span
                          className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full ${categoryBadgeClass(chain.category)}`}
                        >
                          {chain.category}
                        </span>
                      </td>

                      {/* Rank */}
                      <td className="p-4 text-white/50 text-sm font-mono">#{chain.market_cap_rank}</td>

                      {/* TVL */}
                      <td className="p-4 text-white/70 text-sm font-mono">{formatTVL(chain.tvl)}</td>

                      {/* Dev Count */}
                      <td className="p-4 text-white/60 text-sm font-mono">{formatCompact(chain.dev_count)}</td>

                      {/* Health Index bar */}
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <div className="w-full max-w-[80px] h-1.5 bg-white/5 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-700 ${healthBarClass(chain.health_index)}`}
                              style={{ width: `${chain.health_index}%` }}
                            />
                          </div>
                          <span className="text-xs font-mono text-white/60">{chain.health_index}</span>
                        </div>
                      </td>

                      {/* Competition density badge */}
                      <td className="p-4 pr-5">
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${densityBadgeClass(chain.competition_density)}`}
                        >
                          {densityLabel(chain.competition_density)} · {chain.competition_density.toFixed(1)}
                        </span>
                      </td>
                    </tr>
                  )
                })}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      {!loading && (
        <div className="p-4 border-t border-white/5 text-xs text-white/30">
          Showing {filteredChains.length} of {chains.length} ecosystems
        </div>
      )}
    </div>
  )
}

// ── Programs View ──────────────────────────────────────────────────────────────

interface ProgramsViewProps {
  programs: Program[]
  loading: boolean
  isFlashing: (id: string) => boolean
  typeFilter: ProgramFilter
}

function ProgramsView({ programs, loading, isFlashing, typeFilter }: ProgramsViewProps) {
  const filteredPrograms = useMemo(() => {
    if (typeFilter === 'all') return programs
    return programs.filter((p) => p.type === typeFilter)
  }, [programs, typeFilter])

  if (loading) {
    return (
      <div className="p-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    )
  }

  if (filteredPrograms.length === 0) {
    return (
      <div className="p-12 text-center">
        <Gift className="w-10 h-10 text-white/10 mx-auto mb-3" />
        <p className="text-white/30 text-sm font-medium">No programs found</p>
        <p className="text-white/15 text-xs mt-1">Try adjusting your filters</p>
      </div>
    )
  }

  return (
    <div className="p-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {filteredPrograms.map((program) => {
        const flashing = isFlashing(program.id)
        const lowHanging = isLowHangingFruit(program)

        return (
          <div
            key={program.id}
            className={`
              glass-card p-4 relative overflow-hidden transition-all duration-500
              ${flashing ? 'border-green-400/40 shadow-[0_0_20px_rgba(74,222,128,0.1)]' : ''}
              ${lowHanging ? 'border-l-[3px] border-l-green-400/60' : ''}
            `}
          >
            {/* Low-hanging-fruit gradient overlay */}
            {lowHanging && (
              <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 to-transparent pointer-events-none" />
            )}

            <div className="relative z-10">
              {/* Top row: type badge + chain name */}
              <div className="flex items-center gap-2 mb-3">
                <span
                  className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full ${programTypeBadgeClass(program.type)}`}
                >
                  {program.type}
                </span>
                {program.chain_name && (
                  <span className="text-white/30 text-[10px] font-medium px-1.5 py-0.5 rounded bg-white/5">
                    {program.chain_name}
                  </span>
                )}
                {lowHanging && (
                  <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded-full bg-green-500/15 text-green-400 ml-auto">
                    🎯 Opportunity
                  </span>
                )}
              </div>

              {/* Program name */}
              <h4 className="font-semibold text-sm mb-2 text-white/90">{program.name}</h4>

              {/* Funding */}
              <div className="text-sm font-mono text-violet-300 mb-3">
                {displayFunding(program)}
              </div>

              {/* Bottom row: deadline + link */}
              <div className="flex items-center justify-between">
                <span className="text-xs text-white/30">
                  {daysUntilLabel(program.deadline)}
                </span>
                {program.link && (
                  <a
                    href={program.link}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-white/60 hover:text-white/90 transition-colors"
                  >
                    <ExternalLink className="w-3 h-3" />
                    Apply
                  </a>
                )}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ── Jobs View ──────────────────────────────────────────────────────────────────

interface JobsViewProps {
  jobs: Job[]
  loading: boolean
  isFlashing: (id: string) => boolean
  roleFilter: string
}

function JobsView({ jobs, loading, isFlashing, roleFilter }: JobsViewProps) {
  const filteredJobs = useMemo(() => {
    if (roleFilter === 'All') return jobs
    return jobs.filter((j) => j.role_type === roleFilter)
  }, [jobs, roleFilter])

  if (loading) {
    return (
      <div className="p-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    )
  }

  if (filteredJobs.length === 0) {
    return (
      <div className="p-12 text-center">
        <Briefcase className="w-10 h-10 text-white/10 mx-auto mb-3" />
        <p className="text-white/30 text-sm font-medium">No jobs found</p>
        <p className="text-white/15 text-xs mt-1">Try adjusting your role filter</p>
      </div>
    )
  }

  return (
    <div className="p-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {filteredJobs.map((job) => {
        const flashing = isFlashing(job.id)

        return (
          <div
            key={job.id}
            className={`
              glass-card p-4 transition-all duration-500
              ${flashing ? 'border-green-400/40 shadow-[0_0_20px_rgba(74,222,128,0.1)]' : ''}
            `}
          >
            {/* Title + Company */}
            <h4 className="font-semibold text-sm text-white/90 mb-1">{job.title}</h4>
            {job.company && (
              <p className="text-xs text-white/40 mb-3">{job.company}</p>
            )}

            {/* Salary range */}
            {job.salary_range && (
              <div className="text-sm font-mono text-green-400 mb-3">
                {job.salary_range}
              </div>
            )}

            {/* Tags row: remote + chain + role */}
            <div className="flex items-center gap-2 flex-wrap mb-3">
              <span
                className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                  job.is_remote
                    ? 'bg-green-500/12 text-green-400'
                    : 'bg-white/5 text-white/30'
                }`}
              >
                {job.is_remote ? '🌍 Remote' : '🏢 On-site'}
              </span>
              {job.chain_name && (
                <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-white/5 text-white/30">
                  {job.chain_name}
                </span>
              )}
              {job.role_type && (
                <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-violet-500/10 text-violet-300">
                  {job.role_type}
                </span>
              )}
            </div>

            {/* Bottom row: posted date + apply button */}
            <div className="flex items-center justify-between">
              <span className="text-xs text-white/25">
                {timeAgo(job.posted_at)}
              </span>
              {job.link && (
                <a
                  href={job.link}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-xs font-semibold text-white transition-all shadow-lg shadow-violet-600/20 hover:shadow-violet-500/25"
                >
                  Quick Apply
                  <ArrowUpRight className="w-3 h-3" />
                </a>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ── Main Component ─────────────────────────────────────────────────────────────

export default function EcosystemDirectory({
  chains,
  programs,
  jobs,
  chainsLoading,
  programsLoading,
  jobsLoading,
  isChainsFlashing,
  isProgramsFlashing,
  isJobsFlashing,
}: EcosystemDirectoryProps) {
  const [activeTab, setActiveTab] = useState<DirectoryTab>('chains')
  const [categoryFilter, setCategoryFilter] = useState('All')
  const [programTypeFilter, setProgramTypeFilter] = useState<ProgramFilter>('all')
  const [roleFilter, setRoleFilter] = useState('All')

  // ── Animated underline tracking ──────────────────────────────────────────
  const tabsRef = useRef<HTMLDivElement>(null)
  const [underline, setUnderline] = useState({ left: 0, width: 0 })

  useLayoutEffect(() => {
    const container = tabsRef.current
    if (!container) return
    const activeEl = container.querySelector<HTMLButtonElement>(`[data-tab="${activeTab}"]`)
    if (!activeEl) return
    setUnderline({
      left: activeEl.offsetLeft,
      width: activeEl.offsetWidth,
    })
  }, [activeTab])

  // ── Unique role types for job filter pills ───────────────────────────────
  const uniqueRoleTypes = useMemo(() => {
    const types = new Set<string>()
    jobs.forEach((j) => {
      if (j.role_type) types.add(j.role_type)
    })
    return ['All', ...Array.from(types).sort()]
  }, [jobs])

  return (
    <div className="glass-strong rounded-2xl border border-white/5 overflow-hidden">
      {/* ── Header: Tabs + Contextual Filters ───────────────────────────── */}
      <div className="p-5 border-b border-white/5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          {/* Tab bar */}
          <div className="relative" ref={tabsRef}>
            <div className="flex items-center gap-1">
              {TABS.map((tab) => {
                const isActive = activeTab === tab.key
                return (
                  <button
                    key={tab.key}
                    data-tab={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`
                      relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300
                      ${isActive
                        ? 'bg-white/10 text-white font-semibold'
                        : 'text-white/40 hover:text-white/60 hover:bg-white/[0.03]'
                      }
                    `}
                  >
                    <span className="mr-1.5">{tab.emoji}</span>
                    {tab.label}
                  </button>
                )
              })}
            </div>

            {/* Animated violet underline */}
            <div
              className="absolute bottom-0 h-[2px] bg-gradient-to-r from-violet-500 to-purple-500 rounded-full transition-all duration-300 ease-out"
              style={{
                left: underline.left,
                width: underline.width,
              }}
            />
          </div>

          {/* Contextual filters */}
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-white/20" />

            {/* Chains: Category dropdown */}
            {activeTab === 'chains' && (
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white/60 focus:outline-none focus:border-violet-500/50 transition-colors cursor-pointer"
              >
                {CHAIN_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat === 'All' ? 'All Categories' : cat}
                  </option>
                ))}
              </select>
            )}

            {/* Programs: Type filter pills */}
            {activeTab === 'programs' && (
              <div className="flex items-center gap-1">
                {PROGRAM_FILTER_OPTIONS.map((opt) => (
                  <button
                    key={opt.key}
                    onClick={() => setProgramTypeFilter(opt.key)}
                    className={`
                      px-3 py-1 rounded-full text-[11px] font-semibold transition-all duration-200
                      ${programTypeFilter === opt.key
                        ? 'bg-violet-500/20 text-violet-300 border border-violet-500/30'
                        : 'bg-white/5 text-white/40 border border-white/5 hover:bg-white/10 hover:text-white/60'
                      }
                    `}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}

            {/* Jobs: Role type filter pills */}
            {activeTab === 'jobs' && (
              <div className="flex items-center gap-1 flex-wrap">
                {uniqueRoleTypes.map((role) => (
                  <button
                    key={role}
                    onClick={() => setRoleFilter(role)}
                    className={`
                      px-3 py-1 rounded-full text-[11px] font-semibold transition-all duration-200
                      ${roleFilter === role
                        ? 'bg-violet-500/20 text-violet-300 border border-violet-500/30'
                        : 'bg-white/5 text-white/40 border border-white/5 hover:bg-white/10 hover:text-white/60'
                      }
                    `}
                  >
                    {role}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Tab Content ─────────────────────────────────────────────────── */}
      <div className="animate-fade-in" key={activeTab}>
        {activeTab === 'chains' && (
          <ChainsView
            chains={chains}
            loading={chainsLoading}
            isFlashing={isChainsFlashing}
            categoryFilter={categoryFilter}
          />
        )}

        {activeTab === 'programs' && (
          <ProgramsView
            programs={programs}
            loading={programsLoading}
            isFlashing={isProgramsFlashing}
            typeFilter={programTypeFilter}
          />
        )}

        {activeTab === 'jobs' && (
          <JobsView
            jobs={jobs}
            loading={jobsLoading}
            isFlashing={isJobsFlashing}
            roleFilter={roleFilter}
          />
        )}
      </div>
    </div>
  )
}
