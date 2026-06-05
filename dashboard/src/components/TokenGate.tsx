import type { ReactNode } from 'react'
import { Lock, Wallet } from 'lucide-react'
import { useTokenTier } from '../context/TokenTierContext'
import { TIER_CONFIG } from '../lib/constants'
import { formatTokenBalance } from '../lib/formatters'
import type { TokenTier } from '../lib/types'

/**
 * Props for the TokenGate wrapper component.
 *
 * @property requiredTier  - Minimum token tier needed to view this content
 * @property children      - The gated content to render (blurred if locked)
 * @property featureName   - Optional label for the locked feature (e.g. "Export CSV")
 */
interface TokenGateProps {
  requiredTier: TokenTier
  children: ReactNode
  featureName?: string
}

/**
 * TokenGate — Tier-based access control wrapper.
 *
 * If the user holds enough $EKO tokens they see children normally.
 * Otherwise the content renders with a blur overlay and a
 * glassmorphic upgrade prompt anchored to the center.
 *
 * The locked content is intentionally kept *visible* behind the blur
 * so the user can see what they're missing — creating desire to upgrade.
 */
export default function TokenGate({
  requiredTier,
  children,
  featureName,
}: TokenGateProps) {
  const { hasAccess, requiredBalance, connected } = useTokenTier()

  const unlocked = hasAccess(requiredTier)
  const config = TIER_CONFIG[requiredTier]
  const minTokens = requiredBalance(requiredTier)

  // ── Unlocked: render children directly ──
  if (unlocked) {
    return <>{children}</>
  }

  // ── Locked: blurred content + overlay card ──
  return (
    <div className="relative">
      {/* Blurred gated content — still visible but non-interactive */}
      <div
        className="pointer-events-none select-none"
        style={{ filter: 'blur(6px)' }}
        aria-hidden="true"
      >
        {children}
      </div>

      {/* Overlay scrim */}
      <div className="absolute inset-0 flex items-center justify-center backdrop-blur-sm bg-black/20">
        {/* Glassmorphic upgrade card */}
        <div
          className="glass-card relative mx-4 max-w-sm overflow-hidden rounded-2xl p-[1px]"
          style={{
            background: `linear-gradient(135deg, ${config.color}40, ${config.glowColor}, ${config.color}40)`,
          }}
        >
          {/* Inner card body */}
          <div className="rounded-2xl bg-[#0c0e14]/90 px-8 py-7 text-center backdrop-blur-md">
            {/* Lock icon with tier glow */}
            <div
              className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full"
              style={{
                backgroundColor: `${config.color}15`,
                boxShadow: `0 0 24px ${config.glowColor}`,
              }}
            >
              <Lock
                className="h-5 w-5"
                style={{ color: config.color }}
              />
            </div>

            {/* Heading */}
            <h3 className="text-sm font-semibold text-white/90">
              {featureName
                ? `"${featureName}" requires `
                : 'This module requires '}
              <span style={{ color: config.color }}>
                {config.displayName}
              </span>
            </h3>

            {/* Token requirement */}
            <p className="mt-1.5 text-xs text-white/40">
              Hold{' '}
              <span className="font-semibold text-white/60">
                {formatTokenBalance(minTokens)} $EKO
              </span>{' '}
              to instantly access.
            </p>

            {/* Wallet-not-connected nudge */}
            {!connected && (
              <div className="mt-4 flex items-center justify-center gap-1.5 text-[11px] text-white/30">
                <Wallet className="h-3.5 w-3.5" />
                <span>Connect your wallet to check access</span>
                <span className="animate-pulse">→</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
