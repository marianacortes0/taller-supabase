// src/pages/Dashboard.tsx
import { useRef, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useDashboard } from '../hooks/useDashboard'
import { TaskChart } from '../components/Dashboard/TaskChart'
import { DonutChart } from '../components/Dashboard/DonutChart'
import { ActivityFeed } from '../components/Dashboard/ActivityFeed'
import { useAuthContext } from '../context/AuthContext'
import { supabase } from '../lib/supabaseClient'

/* ─── Tokens ──────────────────────────────────────────── */
const C = {
  bg: '#F7F3EE',
  surface: '#FFFBF7',
  border: '#E8DDD4',
  accent: '#C4703A',
  ink: '#1C1917',
  muted: '#78716C',
  subtle: '#A8A29E',
  line: 'rgba(28,25,23,0.08)',
  red: '#B91C1C',
  redBg: '#FEF2F2',
  green: '#15803D',
  greenBg: '#F0FDF4',
}

const font = {
  serif: "'Georgia', 'Times New Roman', serif",
  sans: "'Helvetica Neue', Arial, sans-serif",
}

const label: React.CSSProperties = {
  fontFamily: font.sans,
  fontSize: '0.65rem',
  fontWeight: 700,
  letterSpacing: '0.15em',
  textTransform: 'uppercase',
  color: C.muted,
}

const card: React.CSSProperties = {
  background: C.surface,
  border: `1px solid ${C.border}`,
  borderRadius: '2px',
  padding: '1.5rem',
  boxShadow: '0 1px 3px rgba(28,25,23,0.04)',
}

/* ─── Avatar storage key ──────────────────────────────── */
const AVATAR_LS_KEY = 'avatar_url_cache'
const AVATAR_BUCKET = 'avatars'

/* ─── AvatarUploader component ────────────────────────── */
function AvatarUploader({ userId }: { userId: string }) {
  const fileRef = useRef<HTMLInputElement>(null)
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [hovering, setHovering] = useState(false)

  // Load avatar: localStorage cache → fallback Supabase Storage
  useEffect(() => {
    const cached = localStorage.getItem(AVATAR_LS_KEY)
    if (cached) {
      setAvatarUrl(cached)
      return
    }
    loadFromStorage()
  }, [userId])

  const loadFromStorage = async () => {
    try {
      // Check if file exists in storage for this user
      const { data } = await supabase.storage
        .from(AVATAR_BUCKET)
        .getPublicUrl(`${userId}/avatar`)

      if (data?.publicUrl) {
        // Verify the URL actually resolves (not just placeholder)
        const probe = await fetch(data.publicUrl, { method: 'HEAD' })
        if (probe.ok) {
          localStorage.setItem(AVATAR_LS_KEY, data.publicUrl)
          setAvatarUrl(data.publicUrl)
        }
      }
    } catch {
      // No avatar stored yet — silent
    }
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    if (!allowed.includes(file.type)) {
      setUploadError('Solo se permiten imágenes JPG, PNG, WebP o GIF.')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('La imagen no puede superar 5 MB.')
      return
    }

    setUploading(true)
    setUploadError(null)

    try {
      const ext = file.name.split('.').pop()
      const path = `${userId}/avatar.${ext}`

      // Upsert — replaces existing avatar
      const { error: upErr } = await supabase.storage
        .from(AVATAR_BUCKET)
        .upload(path, file, { upsert: true, contentType: file.type })

      if (upErr) throw upErr

      // Get public URL
      const { data } = supabase.storage
        .from(AVATAR_BUCKET)
        .getPublicUrl(path)

      const url = `${data.publicUrl}?t=${Date.now()}` // cache-bust
      localStorage.setItem(AVATAR_LS_KEY, url)
      setAvatarUrl(url)
    } catch (err: any) {
      setUploadError(err?.message ?? 'Error al subir la imagen.')
    } finally {
      setUploading(false)
      // Reset input so same file can be re-uploaded
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  const handleRemove = async () => {
    if (!avatarUrl) return
    setUploading(true)
    try {
      // List files under userId/ prefix to find the exact filename
      const { data: files } = await supabase.storage
        .from(AVATAR_BUCKET)
        .list(userId)

      if (files && files.length > 0) {
        const paths = files.map(f => `${userId}/${f.name}`)
        await supabase.storage.from(AVATAR_BUCKET).remove(paths)
      }
      localStorage.removeItem(AVATAR_LS_KEY)
      setAvatarUrl(null)
    } catch (err: any) {
      setUploadError(err?.message ?? 'Error al eliminar la imagen.')
    } finally {
      setUploading(false)
    }
  }

  const initials = userId.slice(0, 2).toUpperCase()

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>

      {/* ── Avatar circle ── */}
      <div
        style={{
          position: 'relative',
          width: '72px',
          height: '72px',
          borderRadius: '50%',
          overflow: 'hidden',
          border: `2px solid ${hovering ? C.accent : C.border}`,
          cursor: 'pointer',
          flexShrink: 0,
          transition: 'border-color 0.2s',
          background: C.bg,
        }}
        onClick={() => !uploading && fileRef.current?.click()}
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
        title="Cambiar foto de perfil"
      >
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt="Avatar"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <div style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#EDE8E3',
            fontFamily: font.sans,
            fontSize: '1.1rem',
            fontWeight: 700,
            color: C.muted,
            letterSpacing: '0.05em',
          }}>
            {initials}
          </div>
        )}

        {/* Hover overlay */}
        {hovering && !uploading && (
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(28,25,23,0.45)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <span style={{ fontSize: '1.2rem' }}>📷</span>
          </div>
        )}

        {/* Upload spinner */}
        {uploading && (
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(255,251,247,0.75)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <span style={{
              width: '20px',
              height: '20px',
              border: `2px solid ${C.border}`,
              borderTopColor: C.accent,
              borderRadius: '50%',
              display: 'inline-block',
              animation: 'spin 0.7s linear infinite',
            }} />
          </div>
        )}
      </div>

      {/* Hidden file input */}
      <input
        ref={fileRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        style={{ display: 'none' }}
        onChange={handleFileChange}
        disabled={uploading}
      />

      {/* ── Info & controls ── */}
      <div style={{ flex: 1 }}>
        <p style={{ ...label, marginBottom: '0.35rem' }}>Foto de perfil</p>
        <p style={{
          fontFamily: font.sans,
          fontSize: '0.78rem',
          color: C.subtle,
          margin: '0 0 0.6rem',
          lineHeight: 1.5,
        }}>
          JPG, PNG o WebP · máx. 5 MB
        </p>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => !uploading && fileRef.current?.click()}
            disabled={uploading}
            style={{
              background: C.ink,
              color: C.bg,
              border: 'none',
              padding: '0.35rem 0.9rem',
              borderRadius: '2px',
              fontFamily: font.sans,
              fontSize: '0.62rem',
              fontWeight: 700,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              cursor: uploading ? 'not-allowed' : 'pointer',
              opacity: uploading ? 0.5 : 1,
            }}
          >
            {uploading ? 'Subiendo…' : avatarUrl ? 'Cambiar' : 'Subir foto'}
          </button>
          {avatarUrl && !uploading && (
            <button
              onClick={handleRemove}
              style={{
                background: 'none',
                color: C.subtle,
                border: `1px solid ${C.border}`,
                padding: '0.35rem 0.9rem',
                borderRadius: '2px',
                fontFamily: font.sans,
                fontSize: '0.62rem',
                fontWeight: 700,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                cursor: 'pointer',
              }}
              onMouseEnter={e => {
                ;(e.target as HTMLElement).style.color = C.red
                ;(e.target as HTMLElement).style.borderColor = C.red
              }}
              onMouseLeave={e => {
                ;(e.target as HTMLElement).style.color = C.subtle
                ;(e.target as HTMLElement).style.borderColor = C.border
              }}
            >
              Eliminar
            </button>
          )}
        </div>

        {uploadError && (
          <p style={{
            fontFamily: font.sans,
            fontSize: '0.72rem',
            color: C.red,
            marginTop: '0.5rem',
            background: C.redBg,
            padding: '0.4rem 0.6rem',
            borderRadius: '2px',
            border: `1px solid #FECACA`,
          }}>
            {uploadError}
          </p>
        )}
      </div>

      {/* Spinner keyframes injected once */}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}

/* ─── Dashboard ───────────────────────────────────────── */
export function Dashboard() {
  const { stats, activity, distribution, recentFeed, loading, lastUpdated, refresh } = useDashboard()
  const { signOut, user } = useAuthContext()

  if (loading) return (
    <div style={{ minHeight: '100vh', background: C.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ fontFamily: font.sans, color: C.subtle, fontSize: '0.85rem', letterSpacing: '0.06em' }}>
        Cargando dashboard…
      </p>
    </div>
  )

  const porcentaje = stats?.porcentaje ?? 0

  return (
    <div style={{ minHeight: '100vh', background: C.bg, fontFamily: font.serif }}>

      {/* ── Navbar ─────────────────────────────────────── */}
      <nav style={{
        background: C.surface,
        borderBottom: `1px solid ${C.border}`,
        padding: '0 2rem',
        height: '52px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 10,
      }}>
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          <Link to="/" style={{ fontFamily: font.serif, fontSize: '0.85rem', color: C.ink, textDecoration: 'none' }}>
            Mis Tareas
          </Link>
          <Link
            to="/dashboard"
            style={{ ...label, color: C.accent, borderBottom: `1.5px solid ${C.accent}`, paddingBottom: '1px', textDecoration: 'none' }}
          >
            Dashboard
          </Link>
        </div>
        <button
          onClick={signOut}
          style={{
            background: 'none', border: `1px solid ${C.border}`,
            padding: '0.3rem 0.85rem', borderRadius: '2px',
            fontFamily: font.sans, fontSize: '0.65rem', fontWeight: 700,
            letterSpacing: '0.12em', textTransform: 'uppercase',
            color: C.muted, cursor: 'pointer',
          }}
          onMouseEnter={e => { (e.target as HTMLElement).style.background = C.ink; (e.target as HTMLElement).style.color = C.bg }}
          onMouseLeave={e => { (e.target as HTMLElement).style.background = 'none'; (e.target as HTMLElement).style.color = C.muted }}
        >
          Salir
        </button>
      </nav>

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '3rem 1.5rem 5rem' }}>

        {/* ── Page header ──────────────────────────────── */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.75rem' }}>
          <div>
            <p style={label}>Resumen</p>
            <h1 style={{ fontFamily: font.serif, fontSize: '2.5rem', fontWeight: 400, color: C.ink, margin: 0, letterSpacing: '-0.02em', lineHeight: 1.1 }}>
              Dashboard
            </h1>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            {lastUpdated && (
              <span style={{ fontFamily: font.sans, fontSize: '0.7rem', color: C.subtle, letterSpacing: '0.04em' }}>
                Actualizado {lastUpdated.toLocaleTimeString('es-CO')}
                {' '}·{' '}
                <span style={{ color: C.accent }}>Realtime activo</span>
              </span>
            )}
            <button
              onClick={refresh}
              style={{
                background: C.ink, color: C.bg, border: 'none',
                padding: '0.55rem 1.25rem', borderRadius: '2px',
                fontFamily: font.sans, fontSize: '0.65rem', fontWeight: 700,
                letterSpacing: '0.12em', textTransform: 'uppercase', cursor: 'pointer',
              }}
            >
              Actualizar
            </button>
          </div>
        </div>

        {/* ── Avatar card ──────────────────────────────── */}
        {user?.id && (
          <div style={{ ...card, marginBottom: '2rem' }}>
            <p style={{ ...label, marginBottom: '1.25rem' }}>Perfil</p>
            <AvatarUploader userId={user.id} />
            {user.email && (
              <p style={{
                fontFamily: font.sans,
                fontSize: '0.75rem',
                color: C.subtle,
                marginTop: '1rem',
                paddingTop: '1rem',
                borderTop: `1px solid ${C.border}`,
              }}>
                {user.email}
              </p>
            )}
          </div>
        )}

        {/* ── KPI row ──────────────────────────────────── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '1px', background: C.border, border: `1px solid ${C.border}`, borderRadius: '2px', marginBottom: '2rem', overflow: 'hidden' }}>
          {[
            { titulo: 'Total', valor: stats.total, sub: 'Todas las tareas' },
            { titulo: 'Completadas', valor: stats.completadas, sub: `${porcentaje}% del total`, accent: true },
            { titulo: 'Pendientes', valor: stats.pendientes, sub: 'Por completar' },
            { titulo: 'Progreso', valor: `${porcentaje}%`, sub: 'Completitud' },
            { titulo: 'Hoy', valor: stats.creadasHoy, sub: 'Nuevas hoy' },
          ].map(({ titulo, valor, sub, accent }) => (
            <div key={titulo} style={{ background: C.surface, padding: '1.5rem 1.25rem' }}>
              <p style={{ ...label, marginBottom: '0.6rem' }}>{titulo}</p>
              <p style={{
                fontFamily: font.serif,
                fontSize: '2rem',
                fontWeight: 400,
                color: accent ? C.accent : C.ink,
                margin: '0 0 0.25rem',
                lineHeight: 1,
              }}>
                {valor}
              </p>
              <p style={{ fontFamily: font.sans, fontSize: '0.7rem', color: C.subtle, margin: 0 }}>{sub}</p>
            </div>
          ))}
        </div>

        {/* ── Progress bar ─────────────────────────────── */}
        <div style={{ ...card, marginBottom: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.9rem' }}>
            <span style={label}>Progreso global</span>
            <span style={{ fontFamily: font.serif, fontSize: '1.4rem', color: C.accent, fontWeight: 400 }}>
              {porcentaje}%
            </span>
          </div>
          <div style={{ background: C.border, borderRadius: '1px', height: '3px', overflow: 'hidden' }}>
            <div style={{
              width: `${porcentaje}%`,
              height: '100%',
              background: C.accent,
              borderRadius: '1px',
              transition: 'width 0.8s ease',
            }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.6rem' }}>
            <span style={{ fontFamily: font.sans, fontSize: '0.68rem', color: C.subtle }}>0%</span>
            <span style={{ fontFamily: font.sans, fontSize: '0.68rem', color: C.subtle }}>100%</span>
          </div>
        </div>

        {/* ── Charts ───────────────────────────────────── */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
          <div style={card}>
            <p style={{ ...label, marginBottom: '1.25rem' }}>Actividad últimos 7 días</p>
            <TaskChart data={activity} />
          </div>
          <div style={card}>
            <p style={{ ...label, marginBottom: '1.25rem' }}>Distribución</p>
            <DonutChart data={distribution} />
          </div>
        </div>

        {/* ── Activity feed ────────────────────────────── */}
        <div style={card}>
          <p style={{ ...label, marginBottom: '1.25rem' }}>Actividad reciente</p>
          <ActivityFeed tareas={recentFeed} />
        </div>

      </div>
    </div>
  )
}