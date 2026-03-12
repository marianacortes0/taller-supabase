// src/components/TaskItem.tsx
import { useState } from 'react'
import type { Tarea } from '../types/database'

interface Props {
    tarea: Tarea
    onActualizar: (id: string, completada: boolean) => Promise<void>
    onEliminar: (id: string) => Promise<void>
}

export function TaskItem({ tarea, onActualizar, onEliminar }: Props) {
    const [eliminando, setEliminando] = useState(false)

    const handleToggle = async () => {
        await onActualizar(tarea.id, !tarea.completada)
    }

    const handleEliminar = async () => {
        if (!confirm('¿Eliminar esta tarea?')) return
        setEliminando(true)
        try {
            await onEliminar(tarea.id)
        } catch (error) {
            console.error(error)
        } finally {
            setEliminando(false)
        }
    }

    return (
        <div style={{ 
            display: 'flex', 
            gap: '1rem', 
            alignItems: 'center',
            opacity: eliminando ? 0.5 : 1,
            padding: '1rem',
            border: '1px solid #ddd',
            borderRadius: '4px',
            marginBottom: '0.5rem'
        }}>
            <input 
                type="checkbox" checked={tarea.completada ?? false}
                onChange={handleToggle}
            />
            <div style={{ flex: 1 }}>
                <h3 style={{ 
                    textDecoration: tarea.completada ? 'line-through' : 'none',
                    margin: '0 0 0.5rem 0'
                }}>
                    {tarea.titulo}
                </h3>
                {tarea.descripcion && (
                    <p style={{ margin: 0, color: '#666' }}>{tarea.descripcion}</p>
                )}
            </div>
            <button 
                onClick={handleEliminar}
                disabled={eliminando}
                style={{
                    padding: '0.5rem 1rem',
                    backgroundColor: '#dc3545',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                }}
            >
                {eliminando ? 'Eliminando...' : 'Eliminar'}
            </button>
        </div>
    )
}