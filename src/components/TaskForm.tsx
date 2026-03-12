import { useState } from 'react'

interface Props {
    onCrear: (titulo: string, descripcion: string) => Promise<void>  // ← Promise<void>
}

export function TaskForm({ onCrear }: Props) {
    const [titulo, setTitulo] = useState('')
    const [descripcion, setDescripcion] = useState('')
    const [submitting, setSubmitting] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!titulo.trim()) return
        setSubmitting(true)
        try {
            await onCrear(titulo.trim(), descripcion.trim())  // ← No espera valor de retorno
            setTitulo('')
            setDescripcion('')
        } catch (err) { 
            console.error(err) 
        } finally { 
            setSubmitting(false) 
        }
    }

    return (
        <form onSubmit={handleSubmit} style={{ marginBottom: '2rem' }}>
            <h2>Nueva Tarea</h2>
            <input 
                type="text" 
                placeholder="Título *" 
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)} 
                required 
            />
            <textarea 
                placeholder="Descripción (opcional)"
                value={descripcion} 
                onChange={(e) => setDescripcion(e.target.value)} 
            />
            <button type="submit" disabled={!titulo.trim()}>
                {submitting ? 'Guardando...' : 'Agregar tarea'}
            </button>
        </form>
    )
}