import { useState, useEffect, useCallback, useRef } from 'react'
import { supabase } from '../lib/supabase'
import type { Program, FlashState } from '../lib/types'
import { DEMO_PROGRAMS } from '../lib/constants'

export function useRealtimePrograms() {
  const [programs, setPrograms] = useState<Program[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [flashIds, setFlashIds] = useState<FlashState[]>([])
  const mountedRef = useRef(true)

  const fetchPrograms = useCallback(async () => {
    try {
      const { data, error: fetchError } = await supabase
        .from('programs')
        .select(`
          *,
          chains ( name, competition_density )
        `)
        .order('deadline', { ascending: true })

      if (!mountedRef.current) return

      if (fetchError) {
        console.warn('[useRealtimePrograms] Fetch error, using demo data:', fetchError.message)
        setPrograms(DEMO_PROGRAMS)
      } else if (data && data.length > 0) {
        console.log(`[useRealtimePrograms] Loaded ${data.length} programs from Supabase`)
        const mapped = data.map((p: any) => ({
          ...p,
          chain_name: p.chains?.name || 'Unknown',
          chain_competition_density: p.chains?.competition_density || 1,
        }))
        setPrograms(mapped)
        setError(null)
      } else {
        console.log('[useRealtimePrograms] No programs in DB, using demo data')
        setPrograms(DEMO_PROGRAMS)
      }
    } catch (err) {
      console.error('[useRealtimePrograms] Unexpected error:', err)
      if (mountedRef.current) {
        setPrograms(DEMO_PROGRAMS)
      }
    } finally {
      if (mountedRef.current) {
        setLoading(false)
      }
    }
  }, [])

  const triggerFlash = useCallback((id: string) => {
    setFlashIds(prev => [...prev, { id, active: true }])
    setTimeout(() => {
      setFlashIds(prev => prev.filter(f => f.id !== id))
    }, 2000)
  }, [])

  useEffect(() => {
    mountedRef.current = true
    fetchPrograms()

    const channel = supabase
      .channel('realtime-programs')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'programs' },
        (payload) => {
          console.log('[useRealtimePrograms] Realtime event:', payload.eventType)

          if (payload.eventType === 'INSERT') {
            const newProgram = payload.new as Program
            setPrograms(prev => [newProgram, ...prev])
            triggerFlash(newProgram.id)
          } else if (payload.eventType === 'UPDATE') {
            const updated = payload.new as Program
            setPrograms(prev => prev.map(p => p.id === updated.id ? updated : p))
            triggerFlash(updated.id)
          } else if (payload.eventType === 'DELETE') {
            const deleted = payload.old as Program
            setPrograms(prev => prev.filter(p => p.id !== deleted.id))
          }
        }
      )
      .subscribe((status) => {
        console.log('[useRealtimePrograms] Subscription status:', status)
      })

    return () => {
      mountedRef.current = false
      supabase.removeChannel(channel)
    }
  }, [fetchPrograms, triggerFlash])

  const isFlashing = useCallback((id: string) => {
    return flashIds.some(f => f.id === id && f.active)
  }, [flashIds])

  return { programs, loading, error, isFlashing, refetch: fetchPrograms }
}
