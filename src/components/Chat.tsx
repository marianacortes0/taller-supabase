// src/components/Chat.tsx
import { useState, useRef, useEffect } from 'react'
import { useChat, type ChatMessage } from '../hooks/useChat'

/* ─── Styles ──────────────────────────────────────────── */
const styles = {
    container: {
        background: '#FFFBF7',
        border: '1px solid #E8DDD4',
        borderRadius: '4px',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column' as const,
        height: '480px',
        fontFamily: "'Georgia', 'Times New Roman', serif",
    } as React.CSSProperties,

    header: {
        background: '#1C1917',
        color: '#F7F3EE',
        padding: '0.75rem 1rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '0.75rem',
    } as React.CSSProperties,

    headerTitle: {
        fontSize: '0.85rem',
        fontWeight: 400,
        margin: 0,
        letterSpacing: '-0.01em',
    } as React.CSSProperties,

    headerRight: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
    } as React.CSSProperties,

    statusDot: {
        width: '8px',
        height: '8px',
        borderRadius: '50%',
        flexShrink: 0,
    } as React.CSSProperties,

    onlineBadge: {
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        fontSize: '0.7rem',
        fontFamily: "'Helvetica Neue', Arial, sans-serif",
        color: '#A8A29E',
    } as React.CSSProperties,

    body: {
        display: 'flex',
        flex: 1,
        overflow: 'hidden',
    } as React.CSSProperties,

    sidebar: {
        width: '180px',
        borderRight: '1px solid #E8DDD4',
        display: 'flex',
        flexDirection: 'column' as const,
        background: '#FAF7F4',
    } as React.CSSProperties,

    sidebarHeader: {
        padding: '0.75rem',
        borderBottom: '1px solid #E8DDD4',
        fontSize: '0.65rem',
        fontFamily: "'Helvetica Neue', Arial, sans-serif",
        fontWeight: 700,
        letterSpacing: '0.12em',
        textTransform: 'uppercase' as const,
        color: '#78716C',
    } as React.CSSProperties,

    userList: {
        flex: 1,
        overflowY: 'auto' as const,
        padding: '0.5rem',
    } as React.CSSProperties,

    userItem: {
        padding: '0.5rem 0.65rem',
        borderRadius: '3px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        fontSize: '0.82rem',
        color: '#1C1917',
        transition: 'background 0.15s',
        marginBottom: '2px',
    } as React.CSSProperties,

    userItemActive: {
        background: 'rgba(196,112,58,0.12)',
    } as React.CSSProperties,

    userItemHover: {
        background: 'rgba(28,25,23,0.04)',
    } as React.CSSProperties,

    userOnlineDot: {
        width: '6px',
        height: '6px',
        borderRadius: '50%',
        background: '#10b981',
        flexShrink: 0,
    } as React.CSSProperties,

    globalBtn: {
        margin: '0.5rem',
        padding: '0.6rem 0.75rem',
        background: '#1C1917',
        color: '#F7F3EE',
        border: 'none',
        borderRadius: '3px',
        cursor: 'pointer',
        fontSize: '0.68rem',
        fontFamily: "'Helvetica Neue', Arial, sans-serif",
        fontWeight: 700,
        letterSpacing: '0.1em',
        textTransform: 'uppercase' as const,
        transition: 'background 0.2s',
    } as React.CSSProperties,

    chatArea: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column' as const,
        overflow: 'hidden',
    } as React.CSSProperties,

    chatHeader: {
        padding: '0.65rem 1rem',
        borderBottom: '1px solid #E8DDD4',
        background: '#FFFBF7',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
    } as React.CSSProperties,

    chatTitle: {
        fontSize: '0.78rem',
        fontWeight: 600,
        color: '#1C1917',
        margin: 0,
    } as React.CSSProperties,

    chatBadge: {
        fontSize: '0.6rem',
        fontFamily: "'Helvetica Neue', Arial, sans-serif",
        fontWeight: 700,
        letterSpacing: '0.08em',
        textTransform: 'uppercase' as const,
        padding: '2px 6px',
        borderRadius: '2px',
    } as React.CSSProperties,

    globalBadge: {
        background: 'rgba(196,112,58,0.15)',
        color: '#C4703A',
    } as React.CSSProperties,

    privateBadge: {
        background: 'rgba(16,185,129,0.15)',
        color: '#059669',
    } as React.CSSProperties,

    messagesContainer: {
        flex: 1,
        overflowY: 'auto' as const,
        padding: '1rem',
        display: 'flex',
        flexDirection: 'column' as const,
        gap: '0.75rem',
    } as React.CSSProperties,

    messageWrapper: {
        display: 'flex',
        flexDirection: 'column' as const,
        maxWidth: '75%',
    } as React.CSSProperties,

    messageOwn: {
        alignSelf: 'flex-end',
        alignItems: 'flex-end',
    } as React.CSSProperties,

    messageOther: {
        alignSelf: 'flex-start',
        alignItems: 'flex-start',
    } as React.CSSProperties,

    messageBubble: {
        padding: '0.6rem 0.9rem',
        borderRadius: '12px',
        fontSize: '0.88rem',
        lineHeight: 1.4,
        wordBreak: 'break-word' as const,
    } as React.CSSProperties,

    messageBubbleOwn: {
        background: '#1C1917',
        color: '#F7F3EE',
        borderBottomRightRadius: '4px',
    } as React.CSSProperties,

    messageBubbleOther: {
        background: '#E8DDD4',
        color: '#1C1917',
        borderBottomLeftRadius: '4px',
    } as React.CSSProperties,

    messageMeta: {
        fontSize: '0.65rem',
        fontFamily: "'Helvetica Neue', Arial, sans-serif",
        color: '#A8A29E',
        marginTop: '3px',
        display: 'flex',
        gap: '6px',
        alignItems: 'center',
    } as React.CSSProperties,

    privateIndicator: {
        fontSize: '0.6rem',
        background: 'rgba(16,185,129,0.12)',
        color: '#059669',
        padding: '1px 4px',
        borderRadius: '2px',
    } as React.CSSProperties,

    emptyChat: {
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#A8A29E',
        fontStyle: 'italic',
        fontSize: '0.9rem',
    } as React.CSSProperties,

    inputArea: {
        padding: '0.75rem 1rem',
        borderTop: '1px solid #E8DDD4',
        display: 'flex',
        gap: '0.65rem',
        background: '#FAF7F4',
    } as React.CSSProperties,

    input: {
        flex: 1,
        background: '#FFFBF7',
        border: '1px solid #D6CBBF',
        borderRadius: '4px',
        padding: '0.6rem 0.85rem',
        fontSize: '0.88rem',
        fontFamily: "'Georgia', serif",
        color: '#1C1917',
        outline: 'none',
        transition: 'border-color 0.2s',
    } as React.CSSProperties,

    sendBtn: {
        background: '#C4703A',
        color: '#FFFBF7',
        border: 'none',
        borderRadius: '4px',
        padding: '0.6rem 1.1rem',
        fontSize: '0.7rem',
        fontFamily: "'Helvetica Neue', Arial, sans-serif",
        fontWeight: 700,
        letterSpacing: '0.1em',
        textTransform: 'uppercase' as const,
        cursor: 'pointer',
        transition: 'background 0.2s',
    } as React.CSSProperties,

    typing: {
        fontSize: '0.72rem',
        color: '#A8A29E',
        fontStyle: 'italic',
        padding: '0 1rem 0.5rem',
    } as React.CSSProperties,
}

/* ─── Helpers ─────────────────────────────────────────── */
function formatTime(timestamp: string): string {
    const date = new Date(timestamp)
    return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
}

function getEmailUsername(email: string): string {
    return email.split('@')[0] || 'Usuario'
}

/* ─── Component ───────────────────────────────────────── */
export function Chat() {
    const {
        messages,
        onlineUsers,
        connected,
        sendGlobalMessage,
        sendPrivateMessage,
        currentUserId
    } = useChat('chat-sala-principal')

    const [inputValue, setInputValue] = useState('')
    const [selectedUser, setSelectedUser] = useState<{ id: string; email: string } | null>(null)
    const [hoveredUser, setHoveredUser] = useState<string | null>(null)
    const messagesEndRef = useRef<HTMLDivElement>(null)

    // Auto-scroll al ultimo mensaje
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    // Filtrar mensajes segun el modo (global o privado)
    const filteredMessages = messages.filter(msg => {
        if (!selectedUser) {
            // Modo global: solo mensajes globales
            return msg.type === 'global'
        } else {
            // Modo privado: solo mensajes entre yo y el usuario seleccionado
            return msg.type === 'private' && (
                (msg.senderId === currentUserId && msg.receiverId === selectedUser.id) ||
                (msg.senderId === selectedUser.id && msg.receiverId === currentUserId)
            )
        }
    })

    const handleSend = () => {
        if (!inputValue.trim()) return

        if (selectedUser) {
            sendPrivateMessage(inputValue, selectedUser.id)
        } else {
            sendGlobalMessage(inputValue)
        }
        setInputValue('')
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSend()
        }
    }

    // Usuarios online excepto yo
    const otherUsers = onlineUsers.filter(u => u.oduserId !== currentUserId)

    return (
        <div style={styles.container}>
            {/* Header */}
            <div style={styles.header}>
                <h3 style={styles.headerTitle}>Chat en Vivo</h3>
                <div style={styles.headerRight}>
                    <div style={styles.onlineBadge}>
                        <span style={{
                            ...styles.statusDot,
                            background: connected ? '#10b981' : '#ef4444'
                        }} />
                        {connected ? 'Conectado' : 'Desconectado'}
                    </div>
                    <div style={styles.onlineBadge}>
                        {onlineUsers.length} en linea
                    </div>
                </div>
            </div>

            {/* Body */}
            <div style={styles.body}>
                {/* Sidebar - Usuarios */}
                <div style={styles.sidebar}>
                    <div style={styles.sidebarHeader}>Usuarios Online</div>
                    
                    <button
                        style={{
                            ...styles.globalBtn,
                            background: !selectedUser ? '#C4703A' : '#1C1917',
                        }}
                        onClick={() => setSelectedUser(null)}
                    >
                        Chat Global
                    </button>

                    <div style={styles.userList}>
                        {otherUsers.length === 0 ? (
                            <div style={{ 
                                fontSize: '0.75rem', 
                                color: '#A8A29E', 
                                fontStyle: 'italic',
                                padding: '0.5rem',
                                textAlign: 'center' 
                            }}>
                                Sin otros usuarios
                            </div>
                        ) : (
                            otherUsers.map(u => (
                                <div
                                    key={u.oduserId}
                                    style={{
                                        ...styles.userItem,
                                        ...(selectedUser?.id === u.oduserId ? styles.userItemActive : {}),
                                        ...(hoveredUser === u.oduserId && selectedUser?.id !== u.oduserId ? styles.userItemHover : {}),
                                    }}
                                    onClick={() => setSelectedUser({ id: u.oduserId, email: u.email })}
                                    onMouseEnter={() => setHoveredUser(u.oduserId)}
                                    onMouseLeave={() => setHoveredUser(null)}
                                >
                                    <span style={styles.userOnlineDot} />
                                    <span style={{ 
                                        overflow: 'hidden', 
                                        textOverflow: 'ellipsis', 
                                        whiteSpace: 'nowrap' 
                                    }}>
                                        {getEmailUsername(u.email)}
                                    </span>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Chat Area */}
                <div style={styles.chatArea}>
                    {/* Chat Header */}
                    <div style={styles.chatHeader}>
                        <h4 style={styles.chatTitle}>
                            {selectedUser ? getEmailUsername(selectedUser.email) : 'Todos'}
                        </h4>
                        <span style={{
                            ...styles.chatBadge,
                            ...(selectedUser ? styles.privateBadge : styles.globalBadge)
                        }}>
                            {selectedUser ? 'Privado' : 'Global'}
                        </span>
                    </div>

                    {/* Messages */}
                    <div style={styles.messagesContainer}>
                        {filteredMessages.length === 0 ? (
                            <div style={styles.emptyChat}>
                                {selectedUser 
                                    ? `Inicia una conversacion privada con ${getEmailUsername(selectedUser.email)}`
                                    : 'Sin mensajes aun. Se el primero en escribir.'
                                }
                            </div>
                        ) : (
                            filteredMessages.map(msg => {
                                const isOwn = msg.senderId === currentUserId
                                return (
                                    <div
                                        key={msg.id}
                                        style={{
                                            ...styles.messageWrapper,
                                            ...(isOwn ? styles.messageOwn : styles.messageOther)
                                        }}
                                    >
                                        <div style={{
                                            ...styles.messageBubble,
                                            ...(isOwn ? styles.messageBubbleOwn : styles.messageBubbleOther)
                                        }}>
                                            {msg.content}
                                        </div>
                                        <div style={styles.messageMeta}>
                                            {!isOwn && <span>{getEmailUsername(msg.senderEmail)}</span>}
                                            <span>{formatTime(msg.timestamp)}</span>
                                            {msg.type === 'private' && (
                                                <span style={styles.privateIndicator}>Privado</span>
                                            )}
                                        </div>
                                    </div>
                                )
                            })
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <div style={styles.inputArea}>
                        <input
                            style={styles.input}
                            value={inputValue}
                            onChange={e => setInputValue(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder={selectedUser 
                                ? `Mensaje privado para ${getEmailUsername(selectedUser.email)}...` 
                                : 'Escribe un mensaje para todos...'
                            }
                            onFocus={e => (e.target.style.borderColor = '#C4703A')}
                            onBlur={e => (e.target.style.borderColor = '#D6CBBF')}
                        />
                        <button
                            style={{
                                ...styles.sendBtn,
                                opacity: !inputValue.trim() ? 0.5 : 1,
                                cursor: !inputValue.trim() ? 'not-allowed' : 'pointer',
                            }}
                            onClick={handleSend}
                            disabled={!inputValue.trim()}
                        >
                            Enviar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
