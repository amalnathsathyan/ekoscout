import { useState, useEffect, useCallback, useRef } from 'react'
import { supabase } from '../lib/supabase'
import type { Chain, FlashState } from '../lib/types'
import { DEMO_CHAINS } from '../lib/constants'

export function useRealtimeChains() {
  const [chains, setChains] = useState<Chain[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [flashIds, setFlashIds] = useState<FlashState[]>([])
  const mountedRef = useRef(true)

  const fetchChains = useCallback(async () => {
    try {
      const { data, error: fetchError } = await supabase
        .from('chains')
        .select('*')
        .order('market_cap_rank', { ascending: true })

      if (!mountedRef.current) return

      if (fetchError) {
        console.warn('[useRealtimeChains] Fetch error, using demo data:', fetchError.message)
        setChains(DEMO_CHAINS)
        setError(null) // Don't show error for expected fallback
      } else if (data && data.length > 0) {
        console.log(`[useRealtimeChains] Loaded ${data.length} chains from Supabase`)
        setChains(data as Chain[])
        setError(null)
      } else {
        console.log('[useRealtimeChains] No chains in DB, using demo data')
        setChains(DEMO_CHAINS)
      }
    } catch (err) {
      console.error('[useRealtimeChains] Unexpected error:', err)
      if (mountedRef.current) {
        setChains(DEMO_CHAINS)
      }
    } finally {
      if (mountedRef.current) {
        setLoading(false)
      }
    }
  }, [])

  // Flash a row briefly on realtime update
  const triggerFlash = useCallback((id: string) => {
    setFlashIds(prev => [...prev, { id, active: true }])
    setTimeout(() => {
      setFlashIds(prev => prev.filter(f => f.id !== id))
    }, 2000)
  }, [])

  useEffect(() => {
    mountedRef.current = true
    fetchChains()

    const channel = supabase
      .channel('realtime-chains')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'chains' },
        (payload) => {
          console.log('[useRealtimeChains] Realtime event:', payload.eventType)
          
          if (payload.eventType === 'INSERT') {
            const newChain = payload.new as Chain
            setChains(prev => [...prev, newChain].sort((a, b) => a.market_cap_rank - b.market_cap_rank))
            triggerFlash(newChain.id)
          } else if (payload.eventType === 'UPDATE') {
            const updatedChain = payload.new as Chain
            setChains(prev => prev.map(c => c.id === updatedChain.id ? updatedChain : c))
            triggerFlash(updatedChain.id)
          } else if (payload.eventType === 'DELETE') {
            const deletedChain = payload.old as Chain
            setChains(prev => prev.filter(c => c.id !== deletedChain.id))
          }
        }
      )
      .subscribe((status) => {
        console.log('[useRealtimeChains] Subscription status:', status)
      })

    return () => {
      mountedRef.current = false
      supabase.removeChannel(channel)
    }
  }, [fetchChains, triggerFlash])

  const isFlashing = useCallback((id: string) => {
    return flashIds.some(f => f.id === id && f.active)
  }, [flashIds])

  return { chains, loading, error, isFlashing, refetch: fetchChains }
}
