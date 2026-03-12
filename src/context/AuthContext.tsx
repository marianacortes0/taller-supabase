// src/context/AuthContext.tsx
import { createContext, useContext, type ReactNode } from 'react'
import { useAuth } from '../hooks/UseAuth'
import type { User } from '@supabase/supabase-js'

interface AuthContextType {
    user: User | null
    loading: boolean
    signUp: (email: string, password: string, nombre: string) => Promise<any>
    signIn: (email: string, password: string) => Promise<any>
    signOut: () => Promise<void>
    resetPasswordForEmail: (email: string) => Promise<any>
    updatePassword: (newPassword: string) => Promise<any>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
    const auth = useAuth()
    return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>
}

export function useAuthContext() {
    const ctx = useContext(AuthContext)
    if (!ctx) throw new Error('useAuthContext debe usarse dentro de <AuthProvider>')
    return ctx
}