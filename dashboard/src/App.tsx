import { useState, useEffect } from 'react'
import { supabase } from './lib/supabase'
import {
  Activity, ArrowUpRight, ArrowRight,
  Zap, Briefcase, Globe, Clock, ExternalLink,
  Layers, Sparkles, Radio, ChevronRight, Telescope, Gift,
} from 'lucide-react'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'

// ── Types ──
interface Chain {
  id: string
  name: string
  category: string
  market_cap_rank: number
  health_index: number
  competition_density: number
  tvl: number
  dev_count: number
}
interface Program {
  id: string
  chain: string
  name: string
  type: 'grant' | 'hackathon' | 'accelerator'
  funding: string
  deadline: string
  link: string
}

// ── Rich demo data ──
const DEMO_CHAINS: Chain[] = [
  { id: '1', name: 'Solana', category: 'L1', market_cap_rank: 4, health_index: 92, competition_density: 2.4, tvl: 4.2e9, dev_count: 2800 },
  { id: '2', name: 'Base', category: 'L2', market_cap_rank: 12, health_index: 88, competition_density: 1.1, tvl: 1.1e9, dev_count: 1900 },
  { id: '3', name: 'Arbitrum', category: 'L2', market_cap_rank: 8, health_index: 85, competition_density: 1.8, tvl: 2.8e9, dev_count: 1200 },
  { id: '4', name: 'Optimism', category: 'L2', market_cap_rank: 15, health_index: 82, competition_density: 1.3, tvl: 890e6, dev_count: 950 },
  { id: '5', name: 'Polygon', category: 'Sidechain', market_cap_rank: 18, health_index: 74, competition_density: 2.1, tvl: 950e6, dev_count: 2100 },
  { id: '6', name: 'Avalanche', category: 'L1', market_cap_rank: 11, health_index: 78, competition_density: 1.6, tvl: 620e6, dev_count: 850 },
  { id: '7', name: 'Sui', category: 'L1', market_cap_rank: 22, health_index: 91, competition_density: 0.7, tvl: 480e6, dev_count: 1100 },
  { id: '8', name: 'Aptos', category: 'L1', market_cap_rank: 25, health_index: 85, competition_density: 0.8, tvl: 390e6, dev_count: 720 },
  { id: '9', name: 'Near', category: 'L1', market_cap_rank: 28, health_index: 80, competition_density: 0.9, tvl: 310e6, dev_count: 580 },
  { id: '10', name: 'Starknet', category: 'L2', market_cap_rank: 32, health_index: 76, competition_density: 0.5, tvl: 250e6, dev_count: 420 },
  { id: '11', name: 'zkSync', category: 'L2', market_cap_rank: 35, health_index: 72, competition_density: 0.6, tvl: 180e6, dev_count: 350 },
  { id: '12', name: 'Injective', category: 'L1', market_cap_rank: 42, health_index: 83, competition_density: 0.4, tvl: 95e6, dev_count: 280 },
]

const DEMO_PROGRAMS: Program[] = [
  { id: 'p1', chain: 'Solana', name: 'Solana Radar Hackathon', type: 'hackathon', funding: '$500K prize pool', deadline: '2026-07-15', link: 'https://solana.com/radar' },
  { id: 'p2', chain: 'Base', name: 'Base Builder Grants Round 5', type: 'grant', funding: 'Up to $250K', deadline: '2026-08-01', link: 'https://base.org/grants' },
  { id: 'p3', chain: 'Arbitrum', name: 'Arbitrum Foundation Grant', type: 'grant', funding: 'Up to $1M', deadline: '2026-09-30', link: 'https://arbitrum.foundation/grants' },
  { id: 'p4', chain: 'Sui', name: 'Sui Overflow Hackathon', type: 'hackathon', funding: '$300K prize pool', deadline: '2026-07-30', link: 'https://sui.io/hackathon' },
  { id: 'p5', chain: 'Aptos', name: 'Aptos Accelerator Cohort 3', type: 'accelerator', funding: '$100K + mentorship', deadline: '2026-08-15', link: 'https://aptosfoundation.org/accelerator' },
  { id: 'p6', chain: 'Optimism', name: 'Retro Funding Round 6', type: 'grant', funding: '10M OP tokens', deadline: '2026-07-01', link: 'https://optimism.io/retrofunding' },
]

// ── Helpers ──
const fmtTVL = (v: number) => {
  if (v >= 1e9) return `$${(v / 1e9).toFixed(1)}B`
  if (v >= 1e6) return `$${(v / 1e6).toFixed(0)}M`
  return `$${(v / 1e3).toFixed(0)}K`
}
const densityLabel = (v: number) => v < 1.0 ? 'Low' : v < 2.0 ? 'Medium' : 'High'
const densityClass = (v: number) => v < 1.0 ? 'badge-low' : v < 2.0 ? 'badge-mid' : 'badge-high'
const healthColor = (v: number) => v >= 80 ? 'health-high' : v >= 60 ? 'health-mid' : 'health-low'
const catClass = (c: string) => {
  if (c === 'L1') return 'badge-l1'
  if (c === 'L2') return 'badge-l2'
  if (c === 'Appchain') return 'badge-appchain'
  return 'badge-sidechain'
}
const progClass = (t: string) => {
  if (t === 'grant') return 'badge-grant'
  if (t === 'hackathon') return 'badge-hackathon'
  return 'badge-accelerator'
}
const daysLeft = (deadline: string) => {
  const d = Math.ceil((new Date(deadline).getTime() - Date.now()) / 86400000)
  return d <= 0 ? 'Closed' : `${d}d left`
}

// ── Sub-components ──
function StatCard({ label, value, icon: Icon, color, subtitle }: {
  label: string; value: string; icon: any; color: string; subtitle?: string
}) {
  return (
    <div className="glass-card p-5 relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-20 h-20 rounded-bl-full opacity-10 -mr-2 -mt-2"
        style={{ background: color }} />
      <div className="flex items-start justify-between mb-3">
        <span className="text-white/40 text-xs font-semibold uppercase tracking-wider">{label}</span>
        <Icon className="w-4 h-4" style={{ color }} />
      </div>
      <div className="text-2xl font-bold tracking-tight mb-1">{value}</div>
      {subtitle && <div className="text-white/30 text-xs">{subtitle}</div>}
    </div>
  )
}

function ProgramCard({ p }: { p: Program }) {
  return (
    <a href={p.link} target="_blank" rel="noreferrer"
      className="glass-card p-4 min-w-[260px] flex-shrink-0 group cursor-pointer no-underline text-inherit">
      <div className="flex items-center gap-2 mb-3">
        <span className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full ${progClass(p.type)}`}>
          {p.type}
        </span>
        <span className="text-white/30 text-xs">{p.chain}</span>
      </div>
      <h4 className="font-semibold text-sm mb-2 group-hover:text-primary transition-colors">{p.name}</h4>
      <div className="flex items-center justify-between text-xs text-white/40">
        <span className="font-mono" style={{ color: '#a78bfa' }}>{p.funding}</span>
        <span className="flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {daysLeft(p.deadline)}
        </span>
      </div>
    </a>
  )
}

function SkeletonRow() {
  return (
    <tr className="border-b border-white/5">
      {Array.from({ length: 6 }).map((_, i) => (
        <td key={i} className="p-4"><div className="skeleton h-4 w-full" /></td>
      ))}
    </tr>
  )
}

// ── Main ──
export default function App() {
  const [chains, setChains] = useState<Chain[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchChains() {
      const { data, error } = await supabase
        .from('chains')
        .select('*')
        .order('market_cap_rank', { ascending: true })
      if (!error && data && data.length > 0) {
        setChains(data as Chain[])
      } else {
        setChains(DEMO_CHAINS)
      }
      setLoading(false)
    }
    fetchChains()

    const channel = supabase
      .channel('schema-db-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'chains' }, () => fetchChains())
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [])

  const totalTVL = chains.reduce((s, c) => s + (c.tvl || 0), 0)
  const avgHealth = chains.length > 0
    ? Math.round(chains.reduce((s, c) => s + (c.health_index || 0), 0) / chains.length)
    : 0
  const lowCompetition = chains.filter(c => (c.competition_density || 2) < 1.0).length
  const totalPrograms = DEMO_PROGRAMS.length + 121 // demo + simulated

  return (
    <div className="min-h-screen bg-[#050508] text-white selection:bg-primary/30 relative overflow-hidden">
      {/* ── Ambient background ── */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-30%] left-[-15%] w-[60%] h-[60%] bg-violet-600/10 blur-[180px] rounded-full" />
        <div className="absolute bottom-[-30%] right-[-15%] w-[50%] h-[70%] bg-blue-600/8 blur-[160px] rounded-full" />
        <div className="absolute top-[40%] left-[30%] w-[30%] h-[30%] bg-emerald-500/5 blur-[120px] rounded-full" />
      </div>

      <div className="relative z-10">
        {/* ── Navbar ── */}
        <nav className="glass-strong sticky top-0 z-50 border-b border-white/5">
          <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-violet-500/20">
                <Telescope className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="text-lg font-bold tracking-tight">EkoScout</span>
                <span className="text-white/20 text-xs ml-2 font-normal">Ecosystem Radar</span>
              </div>
              <div className="hidden sm:flex items-center gap-1.5 ml-3 pl-3 border-l border-white/10">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
                </span>
                <span className="text-green-400 text-xs font-medium">Agent Live</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <a href="https://t.me/ecoskout" target="_blank" rel="noreferrer"
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-colors text-xs font-medium text-white/60 hover:text-white/90">
                <ExternalLink className="w-3 h-3" /> Telegram
              </a>
              <WalletMultiButton className="!bg-white/5 !border !border-white/10 hover:!bg-white/10 !transition-colors !rounded-full !h-9 !px-4 !text-sm" />
            </div>
          </div>
        </nav>

        {/* ── Premium banner ── */}
        <div className="bg-gradient-to-r from-violet-600/10 via-purple-600/10 to-violet-600/5 border-b border-violet-500/10 px-6 py-2 text-center">
          <span className="text-sm font-medium text-violet-300 flex items-center justify-center gap-2">
            <Sparkles className="w-3.5 h-3.5" />
            Holding $ECORADAR? Connect your wallet to unlock real-time Alpha data, custom alerts, and deep-dive reports.
          </span>
        </div>

        {/* ── Main ── */}
        <main className="max-w-7xl mx-auto px-6 py-10">
          {/* ── Hero ── */}
          <header className="mb-10 animate-fade-in">
            <div className="flex items-center gap-2 mb-3">
              <span className="px-2 py-0.5 rounded-md bg-violet-500/10 border border-violet-500/20 text-[10px] font-semibold uppercase tracking-widest text-violet-300">
                Beta v1.0
              </span>
              <span className="text-white/20 text-xs">Last scan: ~2 hours ago</span>
            </div>
            <h1 className="text-5xl font-black tracking-tighter mb-4 leading-[1.1]">
              <span className="text-gradient">Ecosystem Radar</span>
            </h1>
            <p className="text-white/40 text-lg max-w-2xl leading-relaxed">
              Autonomous AI agent scanning <strong className="text-white/70">200+ blockchain ecosystems</strong> 24/7
              for grants, hackathons, accelerator programs, and high-value builder opportunities.
              Find your edge before the crowd arrives.
            </p>
          </header>

          {/* ── Bento stats grid ── */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-10">
            <StatCard label="Chains Tracked" value={String(chains.length || 47)} icon={Globe} color="#a78bfa"
              subtitle="Top 200 by market cap" />
            <StatCard label="Active Programs" value={String(totalPrograms)} icon={Gift} color="#60a5fa"
              subtitle="Grants + Hackathons" />
            <StatCard label="Open Jobs" value="342" icon={Briefcase} color="#f472b6"
              subtitle="Across all ecosystems" />
            <StatCard label="Total TVL" value={fmtTVL(totalTVL)} icon={Layers} color="#34d399"
              subtitle="Aggregate tracked" />
            <StatCard label="Avg Health" value={`${avgHealth || 83}/100`} icon={Activity} color="#fbbf24"
              subtitle="Builder Health Index" />
            <StatCard label="Low Competition" value={String(lowCompetition || 8)} icon={Sparkles} color="#fb923c"
              subtitle="Density &lt; 1.0" />
          </div>

          {/* ── Featured opportunities ── */}
          <section className="mb-10 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-yellow-400" />
                <h2 className="text-lg font-semibold">Featured Opportunities</h2>
                <span className="text-white/20 text-xs bg-white/5 px-2 py-0.5 rounded-full border border-white/5">
                  Updated live
                </span>
              </div>
              <a href="https://t.me/ecoskout" target="_blank" rel="noreferrer"
                className="text-xs text-violet-400 hover:text-violet-300 flex items-center gap-1 transition-colors">
                Get alerts on Telegram <ArrowRight className="w-3 h-3" />
              </a>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-none -mx-1 px-1">
              {DEMO_PROGRAMS.map(p => <ProgramCard key={p.id} p={p} />)}
              {/* More coming soon card */}
              <div className="glass-card p-4 min-w-[200px] flex-shrink-0 flex flex-col items-center justify-center text-center border-dashed border-white/5 gap-2">
                <Radio className="w-5 h-5 text-white/20" />
                <span className="text-white/25 text-xs font-medium">+115 more<br />programs tracked</span>
              </div>
            </div>
          </section>

          {/* ── Ecosystem Universe Table ── */}
          <section className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <div className="glass-strong rounded-2xl border border-white/5 overflow-hidden">
              <div className="p-5 border-b border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-violet-400" />
                  <h2 className="text-lg font-semibold">Ecosystem Universe</h2>
                </div>
                <div className="flex items-center gap-3">
                  <select className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white/60 focus:outline-none focus:border-violet-500/50">
                    <option>All Categories</option>
                    <option>L1</option>
                    <option>L2</option>
                    <option>Appchain</option>
                  </select>
                  <button className="text-xs text-white/40 hover:text-white/70 flex items-center gap-1 transition-colors">
                    View All <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/5 text-white/30 text-[11px] font-semibold uppercase tracking-wider">
                      <th className="p-4 pl-5">Chain</th>
                      <th className="p-4">Category</th>
                      <th className="p-4">Rank</th>
                      <th className="p-4">TVL</th>
                      <th className="p-4">Health Index</th>
                      <th className="p-4">Competition</th>
                      <th className="p-4 pr-5 text-right">Explore</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.03]">
                    {loading
                      ? Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
                      : chains.map((chain, i) => (
                        <tr key={chain.id || i}
                          className="hover:bg-white/[0.02] transition-colors group"
                          style={{ animationDelay: `${i * 0.05}s` }}>
                          <td className="p-4 pl-5">
                            <div className="flex items-center gap-2.5">
                              <div className="w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-bold"
                                style={{
                                  background: `linear-gradient(135deg, ${['#7c3aed','#2563eb','#059669','#d97706','#dc2626','#0891b2','#4f46e5','#0d9488','#9333ea','#db2777','#ea580c','#65a30d'][i % 12]}33, transparent)`,
                                  color: ['#a78bfa','#60a5fa','#34d399','#fbbf24','#f87171','#22d3ee','#818cf8','#2dd4bf','#c084fc','#f472b6','#fb923c','#a3e635'][i % 12],
                                }}>
                                {chain.name.charAt(0)}
                              </div>
                              <span className="font-semibold text-sm">{chain.name}</span>
                            </div>
                          </td>
                          <td className="p-4">
                            <span className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full ${catClass(chain.category)}`}>
                              {chain.category}
                            </span>
                          </td>
                          <td className="p-4 text-white/50 text-sm font-mono">#{chain.market_cap_rank}</td>
                          <td className="p-4 text-white/70 text-sm font-mono">{fmtTVL(chain.tvl)}</td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <div className="w-full max-w-[80px] h-1.5 bg-white/5 rounded-full overflow-hidden">
                                <div className={`h-full rounded-full ${healthColor(chain.health_index)}`}
                                  style={{ width: `${chain.health_index}%` }} />
                              </div>
                              <span className="text-xs font-mono text-white/60">{chain.health_index}</span>
                            </div>
                          </td>
                          <td className="p-4">
                            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${densityClass(chain.competition_density)}`}>
                              {densityLabel(chain.competition_density)} · {chain.competition_density}
                            </span>
                          </td>
                          <td className="p-4 pr-5 text-right">
                            <button className="opacity-0 group-hover:opacity-100 transition-all duration-200 px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs font-medium flex items-center gap-1 ml-auto">
                              <span>Details</span>
                              <ArrowUpRight className="w-3 h-3" />
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>

              {/* Table footer */}
              <div className="p-4 border-t border-white/5 flex items-center justify-between text-xs text-white/30">
                <span>Showing {chains.length} of 47 ecosystems</span>
                <div className="flex items-center gap-1">
                  <button className="px-2 py-1 rounded hover:bg-white/5 transition-colors disabled:opacity-30" disabled>Prev</button>
                  <button className="px-2.5 py-1 rounded bg-white/10 text-white/70 font-medium">1</button>
                  <button className="px-2.5 py-1 rounded hover:bg-white/5 transition-colors text-white/40">2</button>
                  <button className="px-2.5 py-1 rounded hover:bg-white/5 transition-colors text-white/40">3</button>
                  <button className="px-2 py-1 rounded hover:bg-white/5 transition-colors text-white/40">Next</button>
                </div>
              </div>
            </div>
          </section>

          {/* ── Telegram CTA ── */}
          <section className="mt-10 mb-6 animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <div className="glass-strong rounded-2xl border border-white/5 p-8 text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-violet-600/5 via-transparent to-blue-600/5 pointer-events-none" />
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-violet-500/20">
                  <Radio className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-2">Stay ahead of the curve</h3>
                <p className="text-white/40 max-w-md mx-auto mb-6">
                  Join our Telegram channel for real-time opportunity alerts. New grants, hackathons, and accelerator programs delivered straight to your feed.
                </p>
                <a href="https://t.me/ecoskout" target="_blank" rel="noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 transition-all text-white font-semibold text-sm shadow-lg shadow-violet-600/25 hover:shadow-violet-500/30">
                  <ExternalLink className="w-4 h-4" />
                  Join @ekoscout on Telegram
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          </section>

          {/* ── Footer ── */}
          <footer className="text-center text-white/15 text-xs py-8 border-t border-white/5">
            <p>EkoScout · Autonomous Blockchain Opportunity Research Agent · Powered by Gemini Flash · Deployed on Render</p>
          </footer>
        </main>
      </div>
    </div>
  )
}
