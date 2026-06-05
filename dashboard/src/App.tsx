import { useRealtimeChains } from './hooks/useRealtimeChains'
import { useRealtimePrograms } from './hooks/useRealtimePrograms'
import { useRealtimeJobs } from './hooks/useRealtimeJobs'
import { useTokenTier } from './context/TokenTierContext'

import Navbar from './components/Navbar'
import BentoGrid from './components/BentoGrid'
import HorizontalFeed from './components/HorizontalFeed'
import EcosystemDirectory from './components/EcosystemDirectory'
import TokenGate from './components/TokenGate'

import {
  Sparkles, Radio, ArrowRight, ExternalLink,
} from 'lucide-react'

export default function App() {
  // ── Realtime data hooks ──
  const {
    chains,
    loading: chainsLoading,
    isFlashing: isChainsFlashing,
  } = useRealtimeChains()

  const {
    programs,
    loading: programsLoading,
    isFlashing: isProgramsFlashing,
  } = useRealtimePrograms()

  const {
    jobs,
    loading: jobsLoading,
    isFlashing: isJobsFlashing,
  } = useRealtimeJobs()

  const { tier, connected } = useTokenTier()

  return (
    <div className="min-h-screen bg-[#050508] text-white selection:bg-violet-500/30 relative overflow-hidden">
      {/* ── Ambient Background Gradients ── */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-35%] left-[-20%] w-[65%] h-[65%] bg-violet-600/[0.07] blur-[200px] rounded-full" />
        <div className="absolute bottom-[-35%] right-[-20%] w-[55%] h-[70%] bg-blue-600/[0.05] blur-[180px] rounded-full" />
        <div className="absolute top-[35%] left-[25%] w-[35%] h-[35%] bg-emerald-500/[0.03] blur-[140px] rounded-full" />
        <div className="absolute top-[10%] right-[10%] w-[20%] h-[20%] bg-purple-500/[0.04] blur-[100px] rounded-full" />
      </div>

      <div className="relative z-10">
        {/* ── Navigation ── */}
        <Navbar />

        {/* ── Free Tier Data Delay Banner ── */}
        {tier === 'free' && (
          <div className="bg-gradient-to-r from-amber-600/[0.08] via-orange-600/[0.06] to-amber-600/[0.04] border-b border-amber-500/10 px-6 py-2">
            <p className="text-center text-sm text-amber-300/80 flex items-center justify-center gap-2">
              <Sparkles className="w-3.5 h-3.5" />
              Showing 24h delayed data. Hold 1,000 $EKO to unlock realtime alpha.
              {!connected && (
                <span className="text-amber-400/60 ml-1">
                  Connect your wallet to check access →
                </span>
              )}
            </p>
          </div>
        )}

        {/* ── Premium Feature Banner ── */}
        {tier !== 'free' && (
          <div className="bg-gradient-to-r from-violet-600/[0.08] via-purple-600/[0.06] to-violet-600/[0.04] border-b border-violet-500/10 px-6 py-2">
            <p className="text-center text-sm font-medium text-violet-300 flex items-center justify-center gap-2">
              <Sparkles className="w-3.5 h-3.5" />
              {tier === 'radar' && '📡 Radar Tier Active — Realtime data unlocked'}
              {tier === 'alpha' && '⚡ Alpha Tier Active — Full research tools unlocked'}
              {tier === 'enterprise' && '👑 Enterprise Tier — All features + white-label access'}
            </p>
          </div>
        )}

        {/* ── Main Content ── */}
        <main className="max-w-7xl mx-auto px-6 py-10">
          {/* ── Hero Section ── */}
          <header className="mb-12 animate-fade-in">
            <div className="flex items-center gap-2 mb-4">
              <span className="px-2.5 py-1 rounded-md bg-violet-500/10 border border-violet-500/20 text-[10px] font-semibold uppercase tracking-widest text-violet-300">
                Beta v1.0
              </span>
              <span className="text-white/20 text-xs">
                Last scan: ~2 hours ago
              </span>
            </div>
            <h1 className="text-5xl sm:text-6xl font-black tracking-tighter mb-5 leading-[1.05]">
              <span className="text-gradient">EkoScout</span>
            </h1>
            <p className="text-white/40 text-lg max-w-2xl leading-relaxed">
              Autonomous AI agent scanning grants, hackathons, and jobs across{' '}
              <strong className="text-white/70">top ecosystems</strong> — ranked by builder opportunity and competition density.{' '}
              <span className="text-violet-400/70">Find high-funding, low-competition ecosystems before the crowd.</span>
            </p>
          </header>

          {/* ── Bento Grid Stats ── */}
          <section className="mb-12 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <BentoGrid
              chains={chains}
              programs={programs}
              jobs={jobs}
              loading={chainsLoading || programsLoading || jobsLoading}
            />
          </section>

          {/* ── Featured Hotspots Feed ── */}
          <section className="mb-12 animate-fade-in" style={{ animationDelay: '0.15s' }}>
            <HorizontalFeed
              programs={programs}
              loading={programsLoading}
              isFlashing={isProgramsFlashing}
            />
          </section>

          {/* ── Ecosystem Directory (Tabbed) ── */}
          <section className="mb-12 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <EcosystemDirectory
              chains={chains}
              programs={programs}
              jobs={jobs}
              chainsLoading={chainsLoading}
              programsLoading={programsLoading}
              jobsLoading={jobsLoading}
              isChainsFlashing={isChainsFlashing}
              isProgramsFlashing={isProgramsFlashing}
              isJobsFlashing={isJobsFlashing}
            />
          </section>

          {/* ── Token-Gated: CSV Export (Radar Tier) ── */}
          <section className="mb-12 animate-fade-in" style={{ animationDelay: '0.25s' }}>
            <TokenGate requiredTier="radar" featureName="CSV Export">
              <div className="glass-strong rounded-2xl border border-white/5 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold mb-1">📊 Export Data</h3>
                    <p className="text-white/40 text-sm">
                      Download chains, programs, and jobs as CSV files for your own analysis.
                    </p>
                  </div>
                  <button className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 transition-all text-white font-semibold text-sm shadow-lg shadow-violet-600/20">
                    Export CSV
                  </button>
                </div>
              </div>
            </TokenGate>
          </section>

          {/* ── Token-Gated: Historical Trends (Alpha Tier) ── */}
          <section className="mb-12 animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <TokenGate requiredTier="alpha" featureName="Historical Macro Trends">
              <div className="glass-strong rounded-2xl border border-white/5 p-8">
                <h3 className="text-xl font-bold mb-3">📈 Historical Macro Trends</h3>
                <p className="text-white/40 text-sm mb-6">
                  Advanced multi-chain comparative analysis with historical data overlays and custom query tools.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {['TVL Growth (30d)', 'Dev Activity Correlation', 'Grant → Success Pipeline'].map((title) => (
                    <div key={title} className="glass-card-static p-5 rounded-xl">
                      <h4 className="text-sm font-semibold text-white/70 mb-2">{title}</h4>
                      <div className="h-24 rounded-lg bg-white/[0.02] flex items-center justify-center">
                        <span className="text-white/20 text-xs">Chart placeholder</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TokenGate>
          </section>

          {/* ── Token-Gated: Enterprise Control Panel ── */}
          <section className="mb-12 animate-fade-in" style={{ animationDelay: '0.35s' }}>
            <TokenGate requiredTier="enterprise" featureName="Enterprise Control Panel">
              <div className="glass-strong rounded-2xl border border-white/5 p-8">
                <h3 className="text-xl font-bold mb-3">👑 Enterprise Control Panel</h3>
                <p className="text-white/40 text-sm mb-6">
                  White-label embed templates, custom scraper configuration, and governance voting.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="glass-card-static p-5 rounded-xl">
                    <h4 className="text-sm font-semibold text-white/70 mb-2">Embed Code Template</h4>
                    <pre className="text-xs text-violet-300/60 bg-black/30 p-3 rounded-lg font-mono overflow-x-auto">
{`<iframe
  src="https://ekoscout.io/embed/matrix"
  width="100%" height="600"
  frameborder="0"
/>`}
                    </pre>
                  </div>
                  <div className="glass-card-static p-5 rounded-xl">
                    <h4 className="text-sm font-semibold text-white/70 mb-2">Custom Scraper Config</h4>
                    <pre className="text-xs text-emerald-300/60 bg-black/30 p-3 rounded-lg font-mono overflow-x-auto">
{`{
  "sources": ["custom-api.xyz"],
  "interval": "2h",
  "filters": { "chain": "solana" }
}`}
                    </pre>
                  </div>
                </div>
              </div>
            </TokenGate>
          </section>

          {/* ── Telegram Community CTA ── */}
          <section className="mb-8 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <div className="glass-strong rounded-2xl border border-white/5 p-10 text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-violet-600/[0.04] via-transparent to-blue-600/[0.04] pointer-events-none" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-violet-600/[0.06] blur-[100px] rounded-full pointer-events-none" />
              <div className="relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center mx-auto mb-5 shadow-lg shadow-violet-500/20 animate-float">
                  <Radio className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold mb-3">
                  Stay ahead of the curve
                </h3>
                <p className="text-white/40 max-w-lg mx-auto mb-7 leading-relaxed">
                  Join our Telegram channel for real-time opportunity alerts.
                  New grants, hackathons, and accelerator programs delivered straight to your feed.
                </p>
                <a
                  href="https://t.me/ecoskout"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 transition-all text-white font-semibold text-sm shadow-lg shadow-violet-600/25 hover:shadow-violet-500/35 hover:scale-[1.02] active:scale-[0.98]"
                >
                  <ExternalLink className="w-4 h-4" />
                  Join @ekoscout on Telegram
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          </section>

          {/* ── Footer ── */}
          <footer className="text-center text-white/15 text-xs py-10 border-t border-white/5">
            <p className="mb-1">
              EkoScout · Autonomous Blockchain Opportunity Research Agent
            </p>
            <p>
              Powered by Gemini Flash · Deployed on Render · Built with ♥ for builders
            </p>
          </footer>
        </main>
      </div>
    </div>
  )
}
