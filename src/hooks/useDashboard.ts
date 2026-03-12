// src/hooks/useDashboard.ts
import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabaseClient'
import { dashboardService } from '../services/dashboardService'

export function useDashboard() {
    const [stats, setStats] = useState<any>(null)
    const [activity, setActivity] = useState<any>([])
    const [distribution, setDistribution] = useState<any>([])
    const [recentFeed, setRecentFeed] = useState<any>([])
    const [loading, setLoading] = useState(true)
    const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

    const refresh = useCallback(async () => {
        try {
            // Promise.all ejecuta las 4 consultas en paralelo → más rápido
            const [s, a, d, f] = await Promise.all([
                dashboardService.getStats(),
                dashboardService.getActivityByDay(),
                dashboardService.getDistribution(),
                dashboardService.getRecentActivity(10).then(r => r.data ?? []),
            ])

            setStats(s)
            setActivity(a)
            setDistribution(d)
            setRecentFeed(f)
            setLastUpdated(new Date())
            setLoading(false)
        } catch (err) { 
            console.error('Dashboard error:', err) 
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        refresh()

        // Suscripción: cualquier cambio en 'tareas' recálcula todas las métricas
        const ch = supabase
            .channel('dashboard-realtime')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'tareas' },
                () => refresh()
            )
            .subscribe()

        return () => { supabase.removeChannel(ch) }
    }, [refresh])

    return { stats, activity, distribution, recentFeed, loading, lastUpdated, refresh }
}