// src/services/taskService.ts
import { supabase } from '../lib/supabaseClient'
import type { TareaInsert, TareaUpdate } from '../types/database'

export const taskService = {
    // --- READ ---
    getAll: () => 
        supabase
            .from('Tareas')
            .select('*')
            .order('created_at', { ascending: false }),

    getById: (id: string) => 
        supabase
            .from('Tareas')
            .select('*')
            .eq('id', id)
            .single(),

    getByStatus: (completada: boolean) => 
        supabase
            .from('Tareas')
            .select('*')
            .eq('completada', completada)
            .order('created_at', { ascending: false }),

    search: (texto: string) => 
        supabase
            .from('Tareas')
            .select('*')
            .ilike('titulo', `%${texto}%`)
            .order('created_at', { ascending: false }),

    // --- CREATE ---
    create: async (tarea: TareaInsert) => {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) throw new Error('No hay sesión activa')

        return supabase.from('Tareas')
            .insert({ ...tarea, user_id: user.id })
            .select()
            .single()
    },

    // --- UPDATE ---
    update: (id: string, cambios: TareaUpdate) => 
        supabase
            .from('Tareas')
            .update(cambios)
            .eq('id', id)
            .select()
            .single(),

    toggleCompletada: (id: string, estadoActual: boolean) => 
        supabase
            .from('Tareas')
            .update({ completada: !estadoActual })
            .eq('id', id)
            .select()
            .single(),

    // --- DELETE ---
    delete: (id: string) => 
        supabase
            .from('Tareas')
            .delete()
            .eq('id', id)
}