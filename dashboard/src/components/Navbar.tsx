import { Telescope, ExternalLink } from 'lucide-react'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { useTokenTier } from '../context/TokenTierContext'

/**
 * Navbar — Glassmorphic top navigation bar for the EkoScout dashboard.
 *
 * Layout:
 *  LEFT  → Brand logo + "EkoScout" title + live-agent beacon
 *  RIGHT → Telegram link · Token tier pill · Wallet connect button
 *
 * Integrations:
 *  - useTokenTier() for tier display & color
 *  - WalletMultiButton for Solana wallet connection
 */
export default function Navbar() {
  const { tier, tierConfig, connected } = useTokenTier()

  return (
    <nav className="glass-strong sticky top-0 z-50 border-b border-white/5">
      <div className="mx-auto flex h-14 max-w-[1440px] items-center justify-between px-4 sm:px-6">
        {/* ── Left: Brand + Live Indicator ─────────────────────── */}
        <div className="flex items-center gap-3">
          {/* Brand logo */}
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 shadow-lg shadow-violet-500/20">
            <Telescope className="h-[18px] w-[18px] text-white" />
          </div>

          {/* Brand text */}
          <div className="flex flex-col -space-y-0.5">
            <span className="text-lg font-bold tracking-tight text-white">
              EkoScout
            </span>
            <span className="text-xs text-white/20">Autonomous Research Agent</span>
          </div>

          {/* Live agent indicator */}
          <div className="ml-2 flex items-center gap-1.5">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
            </span>
            <span className="text-[11px] font-medium text-green-400">
              Agent Live
            </span>
          </div>
        </div>

        {/* ── Right: Links + Tier + Wallet ─────────────────────── */}
        <div className="flex items-center gap-2.5">
          {/* Telegram link */}
          <a
            href="https://t.me/ecoskout"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-white/60 transition-colors hover:bg-white/10 hover:text-white/80"
          >
            <ExternalLink className="h-3 w-3" />
            Telegram
          </a>

          {/* Token tier pill */}
          {connected ? (
            <div
              className="flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors"
              style={{
                borderColor: tierConfig.color,
                color: tierConfig.color,
                backgroundColor: `${tierConfig.color}10`,
              }}
            >
              <span className="text-sm leading-none">{tierConfig.icon}</span>
              <span>{tierConfig.displayName}</span>
            </div>
          ) : (
            <div className="flex items-center rounded-full border border-white/5 bg-white/[0.02] px-3 py-1.5 text-xs text-white/25">
              Connect Wallet
            </div>
          )}

          {/* Solana Wallet Button */}
          <WalletMultiButton className="!bg-white/5 !border !border-white/10 hover:!bg-white/10 !transition-colors !rounded-full !h-9 !px-4 !text-sm" />
        </div>
      </div>
    </nav>
  )
}
