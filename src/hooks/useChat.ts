// src/hooks/useChat.ts
import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useAuthContext } from '../context/AuthContext'
import type { RealtimeChannel } from '@supabase/supabase-js'

export interface ChatMessage {
    id: string
    content: string
    senderId: string
    senderEmail: string
    receiverId: string | null // null = mensaje global
    timestamp: string
    type: 'global' | 'private'
}

interface UserPresence {
    oduserId: string
    email: string
    oddonline_at: string
}

export function useChat(sala: string = 'chat-global') {
    const { user } = useAuthContext()
    const [messages, setMessages] = useState<ChatMessage[]>([])
    const [onlineUsers, setOnlineUsers] = useState<UserPresence[]>([])
    const [connected, setConnected] = useState(false)
    const [channel, setChannel] = useState<RealtimeChannel | null>(null)

    useEffect(() => {
        if (!user) return

        const chatChannel = supabase.channel(sala, {
            config: { presence: { key: user.id } }
        })

        chatChannel
            .on('broadcast', { event: 'message' }, ({ payload }) => {
                const msg = payload as ChatMessage
                if (msg.type === 'global' || msg.receiverId === user.id || msg.senderId === user.id) {
                    setMessages(prev => [...prev, msg])
                }
            })
            .on('presence', { event: 'sync' }, () => {
                const state = chatChannel.presenceState<UserPresence>()
                const users = Object.values(state).flat()
                setOnlineUsers(users)
            })
            .subscribe(async (status) => {
                if (status === 'SUBSCRIBED') {
                    setConnected(true)
                    await chatChannel.track({
                        oduserId: user.id,
                        email: user.email,
                        oddonline_at: new Date().toISOString()
                    })
                }
            })

        setChannel(chatChannel)

        return () => {
            supabase.removeChannel(chatChannel)
            setConnected(false)
        }
    }, [user, sala])

    const sendMessage = useCallback(async (content: string, receiverId: string | null = null) => {
        if (!channel || !user || !content.trim()) return

        const message: ChatMessage = {
            id: crypto.randomUUID(),
            content: content.trim(),
            senderId: user.id,
            senderEmail: user.email || 'Usuario',
            receiverId,
            timestamp: new Date().toISOString(),
            type: receiverId ? 'private' : 'global'
        }

        await channel.send({
            type: 'broadcast',
            event: 'message',
            payload: message
        })

        setMessages(prev => [...prev, message])
    }, [channel, user])

    const sendPrivateMessage = useCallback((content: string, receiverId: string) => {
        return sendMessage(content, receiverId)
    }, [sendMessage])

    const sendGlobalMessage = useCallback((content: string) => {
        return sendMessage(content, null)
    }, [sendMessage])

    return {
        messages,
        onlineUsers,
        connected,
        sendMessage,
        sendPrivateMessage,
        sendGlobalMessage,
        currentUserId: user?.id
    }
}