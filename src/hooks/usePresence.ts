// src/hooks/usePresence.ts
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useAuthContext } from '../context/AuthContext'

interface UserPresence { 
    userId: string; 
    email: string; 
    online_at: string 
}

export function usePresence(sala: string) {
    const { user } = useAuthContext()
    const [onlineUsers, setOnlineUsers] = useState<UserPresence[]>([])

    useEffect(() => {
        if (!user) return

        const channel = supabase.channel(sala)

        channel
            .on('presence', { event: 'sync' }, () => {
                const state = channel.presenceState<UserPresence>()
                setOnlineUsers(Object.values(state).flat())
            })
            .subscribe(async (status) => {
                if (status === 'SUBSCRIBED') {
                    await channel.track({ 
                        userId: user.id, 
                        email: user.email, 
                        online_at: new Date().toISOString() 
                    })
                }
            })

        return () => { supabase.removeChannel(channel) }
    }, [user, sala])

    return { onlineUsers }
}