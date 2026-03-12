// src/services/authService.ts
import { supabase } from '../lib/supabaseClient'

export const authService = {
    getSession: () => supabase.auth.getSession(),
    getUser: () => supabase.auth.getUser(),
    signUp: (email: string, password: string, nombre: string) =>
        supabase.auth.signUp({
            email,
            password,
            options: {
                data: { full_name: nombre }
            }
        }),
    signIn: (email: string, password: string) =>
        supabase.auth.signInWithPassword({ email, password }),
    // Login con proveedor OAuth: Google, GitHub, Discord...
    signInWithProvider: (provider: 'google' | 'github' | 'discord') =>
        supabase.auth.signInWithOAuth({
            provider,
            options: { redirectTo: window.location.origin }
        }),
    // Magic Link: login sin contraseña, solo con email
    signInWithMagicLink: (email: string) =>
        supabase.auth.signInWithOtp({ email }),
    signOut: () =>
        supabase.auth.signOut(),
    // Recuperación de contraseña: envía email con enlace
    resetPasswordForEmail: (email: string, redirectTo?: string) =>
        supabase.auth.resetPasswordForEmail(email, {
            redirectTo: redirectTo || `${window.location.origin}/reset-password`
        }),
    // Actualizar contraseña (cuando el usuario ya está autenticado via el enlace)
    updatePassword: (newPassword: string) =>
        supabase.auth.updateUser({ password: newPassword }),
    onAuthStateChange: supabase.auth.onAuthStateChange.bind(supabase.auth),
}
