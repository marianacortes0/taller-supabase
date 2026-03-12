// src/hooks/UseAuth.ts
import { useState, useEffect } from 'react'
import type { User, AuthChangeEvent, Session } from '@supabase/supabase-js'
import { authService } from '../services/authService'

export function useAuth() {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // Obtener sesión inicial
        authService.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null)
            setLoading(false)
        })

        // Escuchar cambios de autenticación
        const { data: { subscription } } = authService.onAuthStateChange(
            (_event: AuthChangeEvent, session: Session | null) => {
                setUser(session?.user ?? null)
                setLoading(false)
            }
        )

        return () => subscription.unsubscribe()
    }, [])

    const signUp = async (email: string, password: string, nombre: string) => {
        const { data, error } = await authService.signUp(email, password, nombre)
        if (error) throw error
        return data
    }

    const signIn = async (email: string, password: string) => {
        const { data, error } = await authService.signIn(email, password)
        if (error) throw error
        return data
    }

    const signOut = async () => {
        const { error } = await authService.signOut()
        if (error) throw error
    }

    const resetPasswordForEmail = async (email: string) => {
        const { data, error } = await authService.resetPasswordForEmail(email)
        if (error) throw error
        return data
    }

    const updatePassword = async (newPassword: string) => {
        const { data, error } = await authService.updatePassword(newPassword)
        if (error) throw error
        return data
    }

    return {
        user,
        loading,
        signUp,
        signIn,
        signOut,
        resetPasswordForEmail,
        updatePassword,
    }
}
