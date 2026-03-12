// src/components/StorageManager.tsx
import { useRef, useState } from 'react'
import { useStorage } from '../hooks/useStorage'
import { useAuthContext } from '../context/AuthContext'

/* ─── Tokens ─────────────────────────────────────────── */
const C = {
  bg: '#F7F3EE', surface: '#FFFBF7', border: '#E8DDD4',
  accent: '#C4703A', ink: '#1C1917', muted: '#78716C',
  subtle: '#A8A29E', line: 'rgba(28,25,23,0.08)',
  red: '#B91C1C', redBg: '#FEF2F2', redBorder: '#FECACA',
  green: '#15803D', greenBg: '#F0FDF4', greenBorder: '#BBF7D0',
}
const sans = "'Helvetica Neue', Arial, sans-serif"
const serif = "'Georgia', 'Times New Roman', serif"

const label: React.CSSProperties = {
  fontFamily: sans, fontSize: '0.65rem', fontWeight: 700,
  letterSpacing: '0.15em', textTransform: 'uppercase', color: C.muted,
}

const card: React.CSSProperties = {
  background: C.surface, border: `1px solid ${C.border}`,
  borderRadius: '2px', padding: '1.75rem 2rem',
  boxShadow: '0 1px 3px rgba(28,25,23,0.04)',
}

const input: React.CSSProperties = {
  background: 'transparent', border: 'none',
  borderBottom: `1.5px solid ${C.border}`,
  padding: '0.4rem 0', fontSize: '0.95rem',
  fontFamily: serif, color: C.ink, outline: 'none', width: '100%',
}

const btn = (variant: 'primary' | 'ghost' | 'danger' = 'primary'): React.CSSProperties => ({
  border: variant === 'ghost' ? `1px solid ${C.border}` : variant === 'danger' ? `1px solid ${C.redBorder}` : 'none',
  background: variant === 'primary' ? C.ink : variant === 'danger' ? C.redBg : 'none',
  color: variant === 'primary' ? C.bg : variant === 'danger' ? C.red : C.muted,
  padding: '0.55rem 1.1rem', borderRadius: '2px',
  fontFamily: sans, fontSize: '0.65rem', fontWeight: 700,
  letterSpacing: '0.12em', textTransform: 'uppercase' as const,
  cursor: 'pointer', whiteSpace: 'nowrap' as const,
})

const toast = (type: 'ok' | 'err'): React.CSSProperties => ({
  background: type === 'ok' ? C.greenBg : C.redBg,
  border: `1px solid ${type === 'ok' ? C.greenBorder : C.redBorder}`,
  color: type === 'ok' ? C.green : C.red,
  borderRadius: '2px', padding: '0.6rem 0.9rem',
  fontFamily: sans, fontSize: '0.78rem', marginBottom: '1.25rem',
})

/* ─── Component ─────────────────────────────────────── */
export function StorageManager() {
  const { user } = useAuthContext()
  const { avatar, archivos } = useStorage()

  /* Avatar state */
  const avatarInputRef = useRef<HTMLInputElement>(null)
  const [avatarUrl, setAvatarUrl] = useState<string | null>(
    user ? avatar.getUrl(user.id) : null
  )
  const [avatarMsg, setAvatarMsg] = useState<{ type: 'ok' | 'err'; text: string } | null>(null)

  /* Archivos state */
  const archivoInputRef = useRef<HTMLInputElement>(null)
  const [tareaId, setTareaId] = useState('')
  const [archivoMsg, setArchivoMsg] = useState<{ type: 'ok' | 'err'; text: string } | null>(null)

  if (!user) return null

  /* ── Handlers avatar ─────────────────────────────── */
  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setAvatarMsg(null)

    const url = await avatar.subir(user.id, file)
    if (url) {
      setAvatarUrl(`${url}?t=${Date.now()}`) // cache-bust
      setAvatarMsg({ type: 'ok', text: 'Avatar actualizado correctamente.' })
    } else {
      setAvatarMsg({ type: 'err', text: avatar.error ?? 'Error al subir el avatar.' })
    }
  }

  const handleAvatarDelete = async () => {
    const ext = avatarUrl?.split('.').pop()?.split('?')[0] ?? 'jpg'
    const ok = await avatar.eliminar(user.id, ext)
    if (ok) {
      setAvatarUrl(null)
      setAvatarMsg({ type: 'ok', text: 'Avatar eliminado.' })
    } else {
      setAvatarMsg({ type: 'err', text: 'No se pudo eliminar el avatar.' })
    }
  }

  /* ── Handlers archivos ───────────────────────────── */
  const handleArchivoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !tareaId.trim()) return
    setArchivoMsg(null)

    const path = await archivos.subir(tareaId.trim(), file)
    if (path) {
      setArchivoMsg({ type: 'ok', text: `Archivo subido: ${file.name}` })
      await archivos.listar(tareaId.trim())
    } else {
      setArchivoMsg({ type: 'err', text: archivos.error ?? 'Error al subir el archivo.' })
    }
  }

  const handleListar = async () => {
    if (!tareaId.trim()) return
    setArchivoMsg(null)
    await archivos.listar(tareaId.trim())
  }

  const handleEliminarArchivo = async (path: string) => {
    const ok = await archivos.eliminar(path)
    setArchivoMsg(
      ok
        ? { type: 'ok', text: 'Archivo eliminado.' }
        : { type: 'err', text: 'No se pudo eliminar el archivo.' }
    )
  }

  /* ── Render ──────────────────────────────────────── */
  return (
    <div style={{ fontFamily: serif, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

      {/* ── Avatar ────────────────────────────────── */}
      <div style={card}>
        <p style={{ ...label, marginBottom: '1.25rem' }}>Avatar de perfil</p>

        {avatarMsg && <div style={toast(avatarMsg.type)}>{avatarMsg.text}</div>}

        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          {/* Preview */}
          <div style={{
            width: '72px', height: '72px', borderRadius: '50%',
            border: `1.5px solid ${C.border}`, overflow: 'hidden',
            background: C.bg, flexShrink: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt="Avatar"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onError={() => setAvatarUrl(null)}
              />
            ) : (
              <span style={{ fontFamily: sans, fontSize: '1.5rem', color: C.subtle }}>
                {user.email?.[0]?.toUpperCase() ?? '?'}
              </span>
            )}
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            <p style={{ fontFamily: sans, fontSize: '0.8rem', color: C.subtle, margin: 0 }}>
              {user.email}
            </p>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <button
                style={btn('ghost')}
                onClick={() => avatarInputRef.current?.click()}
                disabled={avatar.loading}
              >
                {avatar.loading ? 'Subiendo…' : avatarUrl ? 'Cambiar foto' : 'Subir foto'}
              </button>
              {avatarUrl && (
                <button style={btn('danger')} onClick={handleAvatarDelete}>
                  Eliminar
                </button>
              )}
            </div>
            <p style={{ fontFamily: sans, fontSize: '0.68rem', color: C.subtle, margin: 0 }}>
              JPG, PNG o WebP · máx. 2 MB
            </p>
          </div>
        </div>

        <input
          ref={avatarInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          style={{ display: 'none' }}
          onChange={handleAvatarChange}
        />
      </div>

      {/* ── Archivos de tarea ─────────────────────── */}
      <div style={card}>
        <p style={{ ...label, marginBottom: '1.25rem' }}>Archivos adjuntos por tarea</p>

        {archivoMsg && <div style={toast(archivoMsg.type)}>{archivoMsg.text}</div>}

        {/* ID tarea + acciones */}
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-end', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '180px', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            <label style={{ fontFamily: sans, fontSize: '0.7rem', color: C.subtle }}>ID de la tarea</label>
            <input
              style={input}
              value={tareaId}
              onChange={e => setTareaId(e.target.value)}
              placeholder="ej. 3f8a2b..."
              onFocus={e => (e.target.style.borderBottomColor = C.accent)}
              onBlur={e => (e.target.style.borderBottomColor = C.border)}
            />
          </div>
          <button style={btn('ghost')} onClick={handleListar} disabled={!tareaId.trim()}>
            Ver archivos
          </button>
          <button
            style={{ ...btn('primary'), opacity: !tareaId.trim() ? 0.45 : 1 }}
            onClick={() => archivoInputRef.current?.click()}
            disabled={!tareaId.trim() || archivos.loading}
          >
            {archivos.loading ? 'Subiendo…' : 'Adjuntar archivo'}
          </button>
        </div>

        <input
          ref={archivoInputRef}
          type="file"
          style={{ display: 'none' }}
          onChange={handleArchivoUpload}
        />

        {/* Lista de archivos */}
        {archivos.lista.length > 0 ? (
          <div>
            <div style={{ borderTop: `1px solid ${C.line}` }}>
              {archivos.lista.map((a) => (
                <div
                  key={a.path}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '1rem',
                    padding: '0.85rem 0', borderBottom: `1px solid ${C.line}`,
                  }}
                >
                  {/* Icono por extensión */}
                  <span style={{ fontFamily: sans, fontSize: '1rem', flexShrink: 0, color: C.subtle }}>
                    {getFileIcon(a.name)}
                  </span>

                  {/* Nombre */}
                  <span style={{ flex: 1, fontFamily: sans, fontSize: '0.82rem', color: C.ink, wordBreak: 'break-all' }}>
                    {a.name}
                  </span>

                  {/* Acciones */}
                  <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
                    {a.signedUrl && (
                      <a
                        href={a.signedUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          ...btn('ghost'),
                          textDecoration: 'none',
                          display: 'inline-block',
                        }}
                      >
                        Descargar
                      </a>
                    )}
                    <button
                      style={btn('danger')}
                      onClick={() => handleEliminarArchivo(a.path)}
                    >
                      ×
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <p style={{ fontFamily: sans, fontSize: '0.7rem', color: C.subtle, marginTop: '0.75rem', textAlign: 'right' }}>
              {archivos.lista.length} archivo{archivos.lista.length !== 1 ? 's' : ''} · URLs firmadas (1h)
            </p>
          </div>
        ) : (
          <div style={{
            border: `1.5px dashed ${C.border}`, borderRadius: '2px',
            padding: '2rem', textAlign: 'center',
            color: C.subtle, fontStyle: 'italic', fontSize: '0.9rem',
          }}>
            Introduce un ID de tarea y haz clic en "Ver archivos"
          </div>
        )}
      </div>

    </div>
  )
}

/* ─── Helper ─────────────────────────────────────────── */
function getFileIcon(name: string): string {
  const ext = name.split('.').pop()?.toLowerCase() ?? ''
  if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(ext)) return '🖼'
  if (['pdf'].includes(ext)) return '📄'
  if (['doc', 'docx'].includes(ext)) return '📝'
  if (['xls', 'xlsx', 'csv'].includes(ext)) return '📊'
  if (['zip', 'rar', '7z'].includes(ext)) return '🗜'
  if (['mp4', 'mov', 'avi'].includes(ext)) return '🎬'
  if (['mp3', 'wav', 'ogg'].includes(ext)) return '🎵'
  return '📎'
}