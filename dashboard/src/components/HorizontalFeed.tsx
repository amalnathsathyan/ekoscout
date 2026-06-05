import { useMemo } from 'react'
import { Zap, Clock, ArrowRight, Radio } from 'lucide-react'
import type { Program } from '../lib/types'
import {
  daysUntilLabel,
  daysUntil,
  displayFunding,
  isLowHangingFruit,
} from '../lib/formatters'

// ── Props ──

interface HorizontalFeedProps {
  /** Full list of programs — the component filters to active ones internally */
  programs: Program[]
  /** Whether data is still loading (shows skeleton cards) */
  loading: boolean
  /** Returns true when a program card should flash (e.g. after a realtime update) */
  isFlashing: (id: string) => boolean
}

// ── Badge colour map by program type ──

const TYPE_STYLES: Record<Program['type'], string> = {
  grant: 'bg-violet-500/15 text-violet-300',
  hackathon: 'bg-amber-500/15 text-amber-300',
  accelerator: 'bg-emerald-500/15 text-emerald-300',
}

// ── Deadline urgency helpers ──

function deadlineColorClass(deadline: string | null): string {
  const d = daysUntil(deadline)
  if (d <= 3) return 'text-red-400'
  if (d <= 7) return 'text-amber-400'
  return 'text-white/40'
}

function deadlinePrefix(deadline: string | null): string {
  const d = daysUntil(deadline)
  if (d <= 3) return '⏰ '
  return ''
}

// ── Skeleton Card ──

function SkeletonCard() {
  return (
    <div className="glass-card p-5 min-w-[280px] flex-shrink-0 space-y-3 animate-pulse">
      {/* Type badge + chain */}
      <div className="flex items-center gap-2">
        <div className="skeleton h-4 w-16 rounded-full" />
        <div className="skeleton h-3 w-12 rounded" />
      </div>
      {/* Title */}
      <div className="skeleton h-4 w-3/4 rounded" />
      {/* Bottom row */}
      <div className="flex items-center justify-between">
        <div className="skeleton h-3 w-20 rounded" />
        <div className="skeleton h-3 w-14 rounded" />
      </div>
    </div>
  )
}

// ── Program Card ──

function ProgramCard({
  program,
  flashing,
}: {
  program: Program
  flashing: boolean
}) {
  const lowHanging = isLowHangingFruit(program)
  const funding = displayFunding(program)
  const days = daysUntil(program.deadline)

  return (
    <a
      href={program.link ?? '#'}
      target="_blank"
      rel="noreferrer"
      className={[
        'glass-card p-5 min-w-[280px] flex-shrink-0 group cursor-pointer no-underline text-inherit',
        'transition-all duration-300 relative',
        // Flashing state: green border glow on realtime insert
        flashing && 'border-green-400/50 shadow-[0_0_18px_rgba(74,222,128,0.15)]',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {/* ── Low-hanging fruit gradient border overlay ── */}
      {lowHanging && (
        <div className="absolute inset-0 rounded-[inherit] pointer-events-none border border-transparent bg-gradient-to-br from-green-500/30 to-emerald-500/20 [mask:linear-gradient(#fff_0_0)_content-box,linear-gradient(#fff_0_0)] [mask-composite:exclude] p-[1px]" />
      )}

      {/* ── Low-hanging fruit badge ── */}
      {lowHanging && (
        <div className="mb-2">
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-green-500/10 text-green-300 border border-green-500/20">
            🎯 Low-Hanging Fruit
          </span>
        </div>
      )}

      {/* ── Type badge + chain name ── */}
      <div className="flex items-center gap-2 mb-3">
        <span
          className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full ${TYPE_STYLES[program.type]}`}
        >
          {program.type}
        </span>
        <span className="text-white/30 text-xs">{program.chain_name}</span>
      </div>

      {/* ── Program name ── */}
      <h4 className="font-semibold text-sm mb-3 group-hover:text-violet-300 transition-colors leading-snug">
        {program.name}
      </h4>

      {/* ── Funding + deadline ── */}
      <div className="flex items-center justify-between text-xs">
        <span className="font-mono text-violet-400">{funding}</span>
        <span
          className={`flex items-center gap-1 ${deadlineColorClass(program.deadline)}`}
        >
          {deadlinePrefix(program.deadline)}
          <Clock className="w-3 h-3" />
          {days <= 0 ? 'Closed' : daysUntilLabel(program.deadline)}
        </span>
      </div>
    </a>
  )
}

// ── Trailing "more" card ──

function MoreCard({ count }: { count: number }) {
  return (
    <div className="glass-card p-5 min-w-[200px] flex-shrink-0 flex flex-col items-center justify-center text-center border-dashed border-white/10 gap-2">
      <Radio className="w-5 h-5 text-white/20" />
      <span className="text-white/25 text-xs font-medium leading-relaxed">
        +{count} more
        <br />
        programs tracked
      </span>
    </div>
  )
}

// ── Main Component ──

/**
 * HorizontalFeed — a fluid, horizontally-scrollable feed showcasing
 * active programs sorted by deadline urgency. Highlights low-hanging
 * fruit opportunities and supports realtime flash animations.
 */
export default function HorizontalFeed({
  programs,
  loading,
  isFlashing,
}: HorizontalFeedProps) {
  // Filter active → sort by deadline ascending (most urgent first)
  const activePrograms = useMemo(() => {
    return programs
      .filter((p) => p.status === 'active')
      .sort((a, b) => daysUntil(a.deadline) - daysUntil(b.deadline))
  }, [programs])

  // Count of remaining programs not shown in the feed
  const totalTracked = programs.length
  const remainingCount = Math.max(0, totalTracked - activePrograms.length)

  return (
    <section className="mb-10 animate-fade-in" style={{ animationDelay: '0.1s' }}>
      {/* ── Section header ── */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-yellow-400" />
          <h2 className="text-lg font-semibold">Featured Hotspots</h2>
          <span className="text-white/20 text-xs bg-white/5 px-2 py-0.5 rounded-full border border-white/5">
            Updated live
          </span>
        </div>

        <a
          href="https://t.me/ecoskout"
          target="_blank"
          rel="noreferrer"
          className="text-xs text-violet-400 hover:text-violet-300 flex items-center gap-1 transition-colors"
        >
          Get alerts on Telegram <ArrowRight className="w-3 h-3" />
        </a>
      </div>

      {/* ── Horizontally-scrollable feed ── */}
      <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-none -mx-2 px-2">
        {loading
          ? // Skeleton state: 4 shimmer cards
            Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
          : activePrograms.map((program) => (
              <ProgramCard
                key={program.id}
                program={program}
                flashing={isFlashing(program.id)}
              />
            ))}

        {/* Trailing "more" card — shown after loading completes */}
        {!loading && <MoreCard count={remainingCount > 0 ? remainingCount : 115} />}
      </div>
    </section>
  )
}
