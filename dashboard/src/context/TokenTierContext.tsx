import { createContext, useContext, type ReactNode } from 'react'
import { useTokenBalance } from '../hooks/useTokenBalance'
import type { TokenTier } from '../lib/types'
import { TIER_CONFIG } from '../lib/constants'

interface TokenTierContextValue {
  balance: number
  tier: TokenTier
  loading: boolean
  connected: boolean
  tierConfig: typeof TIER_CONFIG[string]
  hasAccess: (requiredTier: TokenTier) => boolean
  requiredBalance: (requiredTier: TokenTier) => number
}

const TokenTierContext = createContext<TokenTierContextValue | null>(null)

const TIER_ORDER: TokenTier[] = ['free', 'radar', 'alpha', 'enterprise']

export function TokenTierProvider({ children }: { children: ReactNode }) {
  const { balance, tier, loading, connected } = useTokenBalance()

  const tierConfig = TIER_CONFIG[tier]

  const hasAccess = (requiredTier: TokenTier): boolean => {
    const currentIdx = TIER_ORDER.indexOf(tier)
    const requiredIdx = TIER_ORDER.indexOf(requiredTier)
    return currentIdx >= requiredIdx
  }

  const requiredBalance = (requiredTier: TokenTier): number => {
    return TIER_CONFIG[requiredTier]?.minBalance || 0
  }

  return (
    <TokenTierContext.Provider value={{
      balance,
      tier,
      loading,
      connected,
      tierConfig,
      hasAccess,
      requiredBalance,
    }}>
      {children}
    </TokenTierContext.Provider>
  )
}

export function useTokenTier() {
  const context = useContext(TokenTierContext)
  if (!context) {
    throw new Error('useTokenTier must be used within a TokenTierProvider')
  }
  return context
}
