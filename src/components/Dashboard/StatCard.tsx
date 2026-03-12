// src/components/Dashboard/StatCard.tsx
interface Props {
    titulo: string;
    valor: number | string;
    icono: string;
    color: string;
    subtitulo?: string;
}

export function StatCard({ titulo, valor, icono, color, subtitulo }: Props) {
    return (
        <div style={{ 
            backgroundColor: 'white', 
            borderLeft: `5px solid ${color}`, 
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
            padding: '1rem'
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: '600' }}>
                    {titulo}
                </span>
                <span style={{ fontSize: '1.5rem' }}>{icono}</span>
            </div>
            <div style={{ fontSize: '2.5rem', fontWeight: '800', color, lineHeight: '1.2', margin: '0.4rem 0' }}>
                {valor}
            </div>
            <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                {subtitulo}
            </div>
        </div>
    )
}