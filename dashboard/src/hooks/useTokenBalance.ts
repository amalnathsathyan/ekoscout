import { useState, useEffect, useRef } from 'react'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { PublicKey } from '@solana/web3.js'
import { EKO_TOKEN_MINT } from '../lib/constants'
import type { TokenTier } from '../lib/types'

/**
 * Queries the connected wallet's SPL token balance for $EKO.
 * Maps balance to a tier: free / radar / alpha / enterprise.
 * Falls back gracefully when wallet not connected or RPC errors.
 */
export function useTokenBalance() {
  const { connection } = useConnection()
  const { publicKey, connected } = useWallet()
  const [balance, setBalance] = useState<number>(0)
  const [tier, setTier] = useState<TokenTier>('free')
  const [loading, setLoading] = useState(false)
  const mountedRef = useRef(true)

  useEffect(() => {
    mountedRef.current = true

    async function checkBalance() {
      if (!connected || !publicKey) {
        setBalance(0)
        setTier('free')
        return
      }

      setLoading(true)

      try {
        // Try to find the token account for $EKO in the user's wallet
        const mintPubkey = new PublicKey(EKO_TOKEN_MINT)
        const tokenAccounts = await connection.getParsedTokenAccountsByOwner(
          publicKey,
          { mint: mintPubkey }
        )

        if (!mountedRef.current) return

        if (tokenAccounts.value.length > 0) {
          const accountData = tokenAccounts.value[0].account.data.parsed.info
          const rawBalance = Number(accountData.tokenAmount.uiAmount || 0)
          setBalance(rawBalance)

          // Map to tier
          if (rawBalance >= 100_000) {
            setTier('enterprise')
          } else if (rawBalance >= 10_000) {
            setTier('alpha')
          } else if (rawBalance >= 1_000) {
            setTier('radar')
          } else {
            setTier('free')
          }

          console.log(`[useTokenBalance] Balance: ${rawBalance} $EKO → Tier: ${tier}`)
        } else {
          console.log('[useTokenBalance] No $EKO token account found')
          setBalance(0)
          setTier('free')
        }
      } catch (err) {
        // Expected error when token mint doesn't exist yet
        console.log('[useTokenBalance] Token check skipped (token not yet launched):', (err as Error).message)
        if (mountedRef.current) {
          setBalance(0)
          setTier('free')
        }
      } finally {
        if (mountedRef.current) {
          setLoading(false)
        }
      }
    }

    checkBalance()

    return () => {
      mountedRef.current = false
    }
  }, [connection, publicKey, connected])

  return { balance, tier, loading, connected }
}
