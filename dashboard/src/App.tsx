import { useState, useEffect } from 'react'
import { supabase } from './lib/supabase'
import { Activity, ShieldAlert, Cpu, Network, ArrowUpRight } from 'lucide-react'

// Mock Data for initial visual wow-factor
const MOCK_CHAINS = [
  { id: 1, name: 'Solana', rank: 4, health: 92, density: 2.4, tvl: '$4.2B' },
  { id: 2, name: 'Base', rank: 12, health: 88, density: 1.1, tvl: '$1.1B' },
  { id: 3, name: 'Aptos', rank: 25, health: 85, density: 0.8, tvl: '$400M' },
]

export default function App() {
  const [chains, setChains] = useState(MOCK_CHAINS)

  useEffect(() => {
    // Realtime Supabase Subscription example
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'chains' },
        (payload) => {
          console.log('Change received!', payload)
          // setChains(...) update state
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-white selection:bg-primary/30 relative overflow-hidden">
      {/* Dynamic Background Gradients */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[40%] h-[60%] bg-blue-500/10 blur-[150px] rounded-full pointer-events-none" />

      {/* Navbar */}
      <nav className="glass border-b border-white/5 sticky top-0 z-50 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-primary to-purple-500 flex items-center justify-center">
            <Network className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-semibold tracking-tight">EkoScout</span>
        </div>
        <div className="flex items-center gap-4">
          <button className="px-4 py-2 rounded-full text-sm font-medium bg-white/5 hover:bg-white/10 transition-colors border border-white/10">
            Connect Wallet
          </button>
        </div>
      </nav>

      {/* Main Dashboard Content */}
      <main className="max-w-7xl mx-auto px-6 py-12 relative z-10">
        <header className="mb-12">
          <h1 className="text-4xl font-bold tracking-tighter mb-4 text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60">
            Ecosystem Radar
          </h1>
          <p className="text-white/50 text-lg max-w-2xl">
            Real-time signals on builder opportunities across 200+ blockchains. Discover high-funding, low-competition environments.
          </p>
        </header>

        {/* Top Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {[
            { label: 'Active Scrapers', value: '15/15', icon: Activity, color: 'text-green-400' },
            { label: 'Low-Hanging Fruit', value: '42', icon: ShieldAlert, color: 'text-primary' },
            { label: 'Total TVL Tracked', value: '$84.2B', icon: Cpu, color: 'text-blue-400' },
          ].map((stat, i) => (
            <div key={i} className="glass p-6 rounded-2xl border border-white/5 hover:border-white/10 transition-all duration-300 group hover:-translate-y-1">
              <div className="flex items-center justify-between mb-4">
                <span className="text-white/50 font-medium">{stat.label}</span>
                <stat.icon className={`w-5 h-5 ${stat.color} group-hover:scale-110 transition-transform`} />
              </div>
              <div className="text-3xl font-bold tracking-tight">{stat.value}</div>
            </div>
          ))}
        </div>

        {/* Master Universe Table Skeleton */}
        <div className="glass rounded-2xl border border-white/5 overflow-hidden backdrop-blur-xl">
          <div className="p-6 border-b border-white/5 flex items-center justify-between">
            <h2 className="text-xl font-semibold">Live Ecosystems</h2>
            <button className="text-sm text-primary hover:text-primary/80 flex items-center gap-1 transition-colors">
              View All <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 text-white/40 text-sm">
                  <th className="p-4 font-medium">Chain</th>
                  <th className="p-4 font-medium">Rank</th>
                  <th className="p-4 font-medium">TVL</th>
                  <th className="p-4 font-medium">Health Index</th>
                  <th className="p-4 font-medium">Competition Density</th>
                  <th className="p-4 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {chains.map((chain) => (
                  <tr key={chain.id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="p-4 font-medium">{chain.name}</td>
                    <td className="p-4 text-white/60">#{chain.rank}</td>
                    <td className="p-4 text-white/60">{chain.tvl}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div className="w-full max-w-[100px] h-2 bg-white/10 rounded-full overflow-hidden">
                          <div className="h-full bg-green-500 rounded-full" style={{ width: \`\${chain.health}%\` }} />
                        </div>
                        <span className="text-sm">{chain.health}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={\`px-2 py-1 rounded-md text-xs font-medium \${chain.density < 1.5 ? 'bg-green-500/10 text-green-400' : 'bg-orange-500/10 text-orange-400'}\`}>
                        {chain.density}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button className="opacity-0 group-hover:opacity-100 transition-opacity px-3 py-1 bg-white/10 hover:bg-white/20 rounded-md text-sm font-medium">
                        Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  )
}
