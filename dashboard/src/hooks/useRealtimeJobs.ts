import { useState, useEffect, useCallback, useRef } from 'react'
import { supabase } from '../lib/supabase'
import type { Job, FlashState } from '../lib/types'
import { DEMO_JOBS } from '../lib/constants'

export function useRealtimeJobs() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [flashIds, setFlashIds] = useState<FlashState[]>([])
  const mountedRef = useRef(true)

  const fetchJobs = useCallback(async () => {
    try {
      const { data, error: fetchError } = await supabase
        .from('jobs')
        .select(`
          *,
          chains ( name )
        `)
        .order('posted_at', { ascending: false })

      if (!mountedRef.current) return

      if (fetchError) {
        console.warn('[useRealtimeJobs] Fetch error, using demo data:', fetchError.message)
        setJobs(DEMO_JOBS)
      } else if (data && data.length > 0) {
        console.log(`[useRealtimeJobs] Loaded ${data.length} jobs from Supabase`)
        const mapped = data.map((j: any) => ({
          ...j,
          chain_name: j.chains?.name || 'Unknown',
        }))
        setJobs(mapped)
        setError(null)
      } else {
        console.log('[useRealtimeJobs] No jobs in DB, using demo data')
        setJobs(DEMO_JOBS)
      }
    } catch (err) {
      console.error('[useRealtimeJobs] Unexpected error:', err)
      if (mountedRef.current) {
        setJobs(DEMO_JOBS)
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
    fetchJobs()

    const channel = supabase
      .channel('realtime-jobs')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'jobs' },
        (payload) => {
          console.log('[useRealtimeJobs] Realtime event:', payload.eventType)

          if (payload.eventType === 'INSERT') {
            const newJob = payload.new as Job
            setJobs(prev => [newJob, ...prev])
            triggerFlash(newJob.id)
          } else if (payload.eventType === 'UPDATE') {
            const updated = payload.new as Job
            setJobs(prev => prev.map(j => j.id === updated.id ? updated : j))
            triggerFlash(updated.id)
          } else if (payload.eventType === 'DELETE') {
            const deleted = payload.old as Job
            setJobs(prev => prev.filter(j => j.id !== deleted.id))
          }
        }
      )
      .subscribe((status) => {
        console.log('[useRealtimeJobs] Subscription status:', status)
      })

    return () => {
      mountedRef.current = false
      supabase.removeChannel(channel)
    }
  }, [fetchJobs, triggerFlash])

  const isFlashing = useCallback((id: string) => {
    return flashIds.some(f => f.id === id && f.active)
  }, [flashIds])

  return { jobs, loading, error, isFlashing, refetch: fetchJobs }
}
