// src/components/RealtimeIndicator.tsx
export function RealtimeIndicator({ conectado }: { conectado: boolean }) {
    return (
        <div style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '6px', 
            padding: '4px 12px', 
            borderRadius: '20px', 
            fontSize: '0.8rem', 
            backgroundColor: conectado ? '#d1fae5' : '#fee2e2', 
            color: conectado ? '#065f46' : '#991b1b' 
        }}>
            <span style={{ 
                width: '8px', 
                height: '8px', 
                borderRadius: '50%', 
                backgroundColor: conectado ? '#10b981' : '#ef4444' 
            }} />
            {conectado ? 'Realtime activo' : 'Sin conexión'}
        </div>
    )
}