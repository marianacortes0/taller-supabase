// src/hooks/useRealtimeTasks.ts
import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabaseClient'
import { taskService } from '../services/taskService'
import type { Tarea, TareaInsert, TareaUpdate } from '../types/database'
import type { RealtimePostgresChangesPayload } from '@supabase/supabase-js'

export function useRealtimeTasks() {
    const [tareas, setTareas] = useState<Tarea[]>([])
    const [loading, setLoading] = useState(true)
    const [conectado, setConectado] = useState(false)

    const fetchTareas = useCallback(async () => {
        setLoading(true)
        const { data } = await taskService.getAll()
        setTareas(data ?? [])
        setLoading(false)
    }, [])

    useEffect(() => {
        fetchTareas()

        const channel = supabase
            .channel('tareas-realtime')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'tareas' },
                (payload: RealtimePostgresChangesPayload<Tarea>) => {
                    if (payload.eventType === 'INSERT') {
                        setTareas(prev => [payload.new as Tarea, ...prev])
                    }
                    if (payload.eventType === 'UPDATE') {
                        setTareas(prev => prev.map(t => 
                            t.id === (payload.new as Tarea).id ? payload.new as Tarea : t
                        ))
                    }
                    if (payload.eventType === 'DELETE') {
                        setTareas(prev => prev.filter(t => 
                            t.id !== (payload.old as Tarea).id
                        ))
                    }
                }
            )
            .subscribe((status) => setConectado(status === 'SUBSCRIBED'))

        return () => { supabase.removeChannel(channel) }
    }, [fetchTareas])

    const crearTarea = async (t: TareaInsert) => {
        const { error } = await taskService.create(t)
        if (error) throw error
    }

    const actualizarTarea = async (id: string, c: TareaUpdate) => {
        const { error } = await taskService.update(id, c)
        if (error) throw error
    }

    const eliminarTarea = async (id: string) => {
        const { error } = await taskService.delete(id)
        if (error) throw error
    }

    return {
        tareas,
        loading,
        conectado,
        crearTarea,
        actualizarTarea,
        eliminarTarea
    }
}