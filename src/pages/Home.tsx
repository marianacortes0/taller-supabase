// src/pages/Home.tsx
import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useTasks } from '../hooks/useTasks'
import { useRealtimeTasks } from '../hooks/useRealtimeTasks'
import { usePresence } from '../hooks/usePresence'
import { RealtimeIndicator } from '../components/RealtimeIndicator'
import { Chat } from '../components/Chat'
import { useAuthContext } from '../context/AuthContext'

/* ─── Styles ──────────────────────────────────────────── */
const styles = {
  page: {
    minHeight: '100vh',
    background: '#F7F3EE',
    fontFamily: "'Georgia', 'Times New Roman', serif",
  } as React.CSSProperties,

  nav: {
    background: '#FFFBF7',
    borderBottom: '1px solid #E8DDD4',
    padding: '0 2rem',
    height: '52px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'sticky' as const,
    top: 0,
    zIndex: 10,
  } as React.CSSProperties,

  navLeft: {
    display: 'flex',
    gap: '1.5rem',
    alignItems: 'center',
  } as React.CSSProperties,

  navBrand: {
    fontSize: '0.85rem',
    fontWeight: 400,
    color: '#1C1917',
    textDecoration: 'none',
    letterSpacing: '-0.01em',
    fontFamily: "'Georgia', serif",
  } as React.CSSProperties,

  navLink: {
    fontSize: '0.68rem',
    fontFamily: "'Helvetica Neue', Arial, sans-serif",
    fontWeight: 700,
    letterSpacing: '0.12em',
    textTransform: 'uppercase' as const,
    color: '#78716C',
    textDecoration: 'none',
    paddingBottom: '2px',
    borderBottom: '1.5px solid transparent',
    transition: 'color 0.2s, border-color 0.2s',
  } as React.CSSProperties,

  navRight: {
    display: 'flex',
    gap: '1rem',
    alignItems: 'center',
  } as React.CSSProperties,

  onlineText: {
    fontSize: '0.72rem',
    fontFamily: "'Helvetica Neue', Arial, sans-serif",
    color: '#A8A29E',
    letterSpacing: '0.04em',
  } as React.CSSProperties,

  signOutBtn: {
    background: 'none',
    border: '1px solid #D6CBBF',
    padding: '0.3rem 0.85rem',
    fontSize: '0.65rem',
    fontFamily: "'Helvetica Neue', Arial, sans-serif",
    fontWeight: 700,
    letterSpacing: '0.12em',
    textTransform: 'uppercase' as const,
    color: '#78716C',
    cursor: 'pointer',
    borderRadius: '2px',
    transition: 'background 0.2s, color 0.2s',
  } as React.CSSProperties,

  inner: {
    maxWidth: '1100px',
    margin: '0 auto',
    padding: '2.5rem 1rem 4rem',
  } as React.CSSProperties,

  mainGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 380px',
    gap: '2rem',
    alignItems: 'start',
  } as React.CSSProperties,

  tasksColumn: {
    minWidth: 0,
  } as React.CSSProperties,

  chatColumn: {
    position: 'sticky' as const,
    top: '70px',
  } as React.CSSProperties,

  header: {
    marginBottom: '2rem',
  } as React.CSSProperties,

  eyebrow: {
    fontSize: '0.7rem',
    fontFamily: "'Helvetica Neue', Arial, sans-serif",
    fontWeight: 700,
    letterSpacing: '0.18em',
    textTransform: 'uppercase' as const,
    color: '#C4703A',
    marginBottom: '0.5rem',
  } as React.CSSProperties,

  title: {
    fontSize: '2.4rem',
    fontWeight: 400,
    color: '#1C1917',
    margin: 0,
    lineHeight: 1.1,
    letterSpacing: '-0.02em',
  } as React.CSSProperties,

  formCard: {
    background: '#FFFBF7',
    border: '1px solid #E8DDD4',
    borderRadius: '2px',
    padding: '1.5rem 1.75rem',
    marginBottom: '1.5rem',
    boxShadow: '0 1px 3px rgba(28,25,23,0.05)',
  } as React.CSSProperties,

  formLabel: {
    display: 'block',
    fontSize: '0.68rem',
    fontFamily: "'Helvetica Neue', Arial, sans-serif",
    fontWeight: 700,
    letterSpacing: '0.14em',
    textTransform: 'uppercase' as const,
    color: '#78716C',
    marginBottom: '1rem',
  } as React.CSSProperties,

  formRow: {
    display: 'flex',
    gap: '0.75rem',
    alignItems: 'flex-end',
    flexWrap: 'wrap' as const,
  } as React.CSSProperties,

  inputGroup: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '0.5rem',
    flex: 1,
    minWidth: '140px',
  } as React.CSSProperties,

  inputLabel: {
    fontSize: '0.72rem',
    fontFamily: "'Helvetica Neue', Arial, sans-serif",
    color: '#A8A29E',
    letterSpacing: '0.04em',
  } as React.CSSProperties,

  input: {
    background: 'transparent',
    border: 'none',
    borderBottom: '1.5px solid #D6CBBF',
    padding: '0.4rem 0',
    fontSize: '0.95rem',
    fontFamily: "'Georgia', serif",
    color: '#1C1917',
    outline: 'none',
    transition: 'border-color 0.2s',
    width: '100%',
  } as React.CSSProperties,

  button: {
    background: '#1C1917',
    color: '#F7F3EE',
    border: 'none',
    padding: '0.65rem 1.25rem',
    fontSize: '0.7rem',
    fontFamily: "'Helvetica Neue', Arial, sans-serif",
    fontWeight: 700,
    letterSpacing: '0.12em',
    textTransform: 'uppercase' as const,
    cursor: 'pointer',
    borderRadius: '2px',
    transition: 'background 0.2s',
    whiteSpace: 'nowrap' as const,
    flexShrink: 0,
  } as React.CSSProperties,

  searchWrapper: {
    background: '#FFFBF7',
    border: '1px solid #E8DDD4',
    borderRadius: '2px',
    padding: '0.75rem 1rem',
    marginBottom: '1.5rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  } as React.CSSProperties,

  searchIcon: {
    fontSize: '0.9rem',
    color: '#A8A29E',
    flexShrink: 0,
    lineHeight: 1,
  } as React.CSSProperties,

  searchInput: {
    background: 'transparent',
    border: 'none',
    outline: 'none',
    fontSize: '0.92rem',
    fontFamily: "'Georgia', serif",
    color: '#1C1917',
    width: '100%',
  } as React.CSSProperties,

  searchClear: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: '#A8A29E',
    fontSize: '1rem',
    padding: '0',
    lineHeight: 1,
    flexShrink: 0,
    transition: 'color 0.2s',
  } as React.CSSProperties,

  searchResultsBadge: {
    fontSize: '0.68rem',
    fontFamily: "'Helvetica Neue', Arial, sans-serif",
    fontWeight: 700,
    letterSpacing: '0.1em',
    textTransform: 'uppercase' as const,
    color: '#C4703A',
    background: 'rgba(196,112,58,0.08)',
    padding: '0.2rem 0.55rem',
    borderRadius: '2px',
    flexShrink: 0,
  } as React.CSSProperties,

  divider: {
    border: 'none',
    borderTop: '1.5px solid #1C1917',
    margin: '1.5rem 0',
    opacity: 0.12,
  } as React.CSSProperties,

  taskItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '1rem',
    padding: '1rem 0',
    borderBottom: '1px solid rgba(28,25,23,0.08)',
    transition: 'opacity 0.2s',
  } as React.CSSProperties,

  taskCheckbox: {
    width: '18px',
    height: '18px',
    marginTop: '2px',
    accentColor: '#C4703A',
    cursor: 'pointer',
    flexShrink: 0,
  } as React.CSSProperties,

  taskTitle: {
    fontSize: '1rem',
    color: '#1C1917',
    margin: 0,
    fontWeight: 400,
    lineHeight: 1.4,
  } as React.CSSProperties,

  taskTitleDone: {
    textDecoration: 'line-through',
    color: '#A8A29E',
  } as React.CSSProperties,

  taskDesc: {
    fontSize: '0.82rem',
    color: '#A8A29E',
    marginTop: '0.2rem',
    fontFamily: "'Helvetica Neue', Arial, sans-serif",
    lineHeight: 1.5,
  } as React.CSSProperties,

  editInput: {
    background: 'transparent',
    border: 'none',
    borderBottom: '1.5px solid #C4703A',
    padding: '0.2rem 0',
    fontSize: '1rem',
    fontFamily: "'Georgia', serif",
    color: '#1C1917',
    outline: 'none',
    width: '100%',
  } as React.CSSProperties,

  editDescInput: {
    background: 'transparent',
    border: 'none',
    borderBottom: '1.5px solid #E8DDD4',
    padding: '0.2rem 0',
    fontSize: '0.82rem',
    fontFamily: "'Helvetica Neue', Arial, sans-serif",
    color: '#78716C',
    outline: 'none',
    width: '100%',
    marginTop: '0.3rem',
  } as React.CSSProperties,

  editActions: {
    display: 'flex',
    gap: '0.5rem',
    marginTop: '0.5rem',
  } as React.CSSProperties,

  editSaveBtn: {
    background: '#1C1917',
    color: '#F7F3EE',
    border: 'none',
    padding: '0.3rem 0.85rem',
    fontSize: '0.62rem',
    fontFamily: "'Helvetica Neue', Arial, sans-serif",
    fontWeight: 700,
    letterSpacing: '0.12em',
    textTransform: 'uppercase' as const,
    cursor: 'pointer',
    borderRadius: '2px',
  } as React.CSSProperties,

  editCancelBtn: {
    background: 'none',
    color: '#A8A29E',
    border: '1px solid #D6CBBF',
    padding: '0.3rem 0.85rem',
    fontSize: '0.62rem',
    fontFamily: "'Helvetica Neue', Arial, sans-serif",
    fontWeight: 700,
    letterSpacing: '0.12em',
    textTransform: 'uppercase' as const,
    cursor: 'pointer',
    borderRadius: '2px',
  } as React.CSSProperties,

  taskActions: {
    display: 'flex',
    gap: '0.25rem',
    flexShrink: 0,
    opacity: 0,
    transition: 'opacity 0.15s',
  } as React.CSSProperties,

  iconBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: '#D6CBBF',
    fontSize: '0.9rem',
    padding: '0.2rem 0.3rem',
    lineHeight: 1,
    transition: 'color 0.2s',
    borderRadius: '2px',
  } as React.CSSProperties,

  deleteBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: '#D6CBBF',
    fontSize: '1.2rem',
    padding: '0 0.25rem',
    lineHeight: 1,
    transition: 'color 0.2s',
    flexShrink: 0,
  } as React.CSSProperties,

  empty: {
    textAlign: 'center' as const,
    padding: '2.5rem 0',
    color: '#A8A29E',
    fontStyle: 'italic',
    fontSize: '1rem',
  } as React.CSSProperties,

  footer: {
    marginTop: '1.5rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  } as React.CSSProperties,

  footerText: {
    fontSize: '0.72rem',
    fontFamily: "'Helvetica Neue', Arial, sans-serif",
    color: '#A8A29E',
    letterSpacing: '0.06em',
  } as React.CSSProperties,

  progressBar: {
    height: '2px',
    background: '#E8DDD4',
    borderRadius: '2px',
    overflow: 'hidden',
    flex: '0 0 120px',
  } as React.CSSProperties,

  progressFill: {
    height: '100%',
    background: '#C4703A',
    transition: 'width 0.4s ease',
    borderRadius: '2px',
  } as React.CSSProperties,

  stateMsg: {
    fontFamily: "'Helvetica Neue', Arial, sans-serif",
    fontSize: '0.9rem',
    borderRadius: '2px',
  } as React.CSSProperties,

  loadingMsg: {
    color: '#78716C',
  } as React.CSSProperties,

  errorMsg: {
    color: '#B91C1C',
    background: '#FEF2F2',
    border: '1px solid #FECACA',
    padding: '0.75rem 1rem',
  } as React.CSSProperties,

  highlightMatch: {
    background: 'rgba(196,112,58,0.18)',
    borderRadius: '2px',
    padding: '0 1px',
    color: '#C4703A',
    fontWeight: 600,
  } as React.CSSProperties,

  // Responsive
  '@media (max-width: 900px)': {
    mainGrid: {
      gridTemplateColumns: '1fr',
    },
  },
}

/* ─── Highlight helper ────────────────────────────────── */
function highlightText(text: string, query: string): React.ReactNode {
  if (!query.trim()) return text
  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi')
  const parts = text.split(regex)
  return parts.map((part, i) =>
    regex.test(part)
      ? <mark key={i} style={styles.highlightMatch}>{part}</mark>
      : part
  )
}

/* ─── Edit state type ─────────────────────────────────── */
interface EditState {
  id: string
  titulo: string
  descripcion: string
}

/* ─── Component ───────────────────────────────────────── */
export function Home() {
  const { tareas, loading, error, crearTarea, actualizarTarea, eliminarTarea } = useTasks()
  const { conectado } = useRealtimeTasks()
  const { onlineUsers } = usePresence('home')
  const { signOut } = useAuthContext()

  const [titulo, setTitulo] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [submitting, setSubmitting] = useState(false)

  // Search
  const [searchQuery, setSearchQuery] = useState('')

  // Edit
  const [editing, setEditing] = useState<EditState | null>(null)
  const [saving, setSaving] = useState(false)

  // Hover tracking
  const [hoveredTask, setHoveredTask] = useState<string | null>(null)

  const handleSubmit = async () => {
    if (!titulo.trim()) return
    setSubmitting(true)
    await crearTarea({ titulo: titulo.trim(), descripcion: descripcion.trim() })
    setTitulo('')
    setDescripcion('')
    setSubmitting(false)
  }

  const handleSaveEdit = async () => {
    if (!editing || !editing.titulo.trim()) return
    setSaving(true)
    await actualizarTarea(editing.id, {
      titulo: editing.titulo.trim(),
      descripcion: editing.descripcion.trim(),
    })
    setEditing(null)
    setSaving(false)
  }

  const handleCancelEdit = () => setEditing(null)

  // Filtered tasks
  const filteredTareas = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    if (!q) return tareas
    return tareas.filter(t =>
      t.titulo.toLowerCase().includes(q) ||
      (t.descripcion ?? '').toLowerCase().includes(q)
    )
  }, [tareas, searchQuery])

  const completadas = tareas.filter(t => t.completada).length
  const progreso = tareas.length > 0 ? (completadas / tareas.length) * 100 : 0
  const isSearching = searchQuery.trim().length > 0

  return (
    <div style={styles.page}>

      {/* Navbar */}
      <nav style={styles.nav}>
        <div style={styles.navLeft}>
          <Link to="/" style={styles.navBrand}>Mis Tareas</Link>
          <Link
            to="/dashboard"
            style={styles.navLink}
            onMouseEnter={e => {
              ;(e.target as HTMLElement).style.color = '#1C1917'
              ;(e.target as HTMLElement).style.borderBottomColor = '#C4703A'
            }}
            onMouseLeave={e => {
              ;(e.target as HTMLElement).style.color = '#78716C'
              ;(e.target as HTMLElement).style.borderBottomColor = 'transparent'
            }}
          >
            Dashboard
          </Link>
        </div>

        <div style={styles.navRight}>
          <RealtimeIndicator conectado={conectado} />
          <span style={styles.onlineText}>{onlineUsers.length} en linea</span>
          <button
            style={styles.signOutBtn}
            onClick={signOut}
            onMouseEnter={e => {
              ;(e.target as HTMLElement).style.background = '#1C1917'
              ;(e.target as HTMLElement).style.color = '#F7F3EE'
            }}
            onMouseLeave={e => {
              ;(e.target as HTMLElement).style.background = 'none'
              ;(e.target as HTMLElement).style.color = '#78716C'
            }}
          >
            Salir
          </button>
        </div>
      </nav>

      {/* Content */}
      <div style={styles.inner}>
        <div style={styles.mainGrid}>

          {/* Tasks Column */}
          <div style={styles.tasksColumn}>
            {/* Header */}
            <header style={styles.header}>
              <p style={styles.eyebrow}>Panel personal</p>
              <h1 style={styles.title}>Mis Tareas</h1>
            </header>

            {/* New task form */}
            <div style={styles.formCard}>
              <span style={styles.formLabel}>Nueva tarea</span>
              <div style={styles.formRow}>
                <div style={styles.inputGroup}>
                  <label style={styles.inputLabel}>Titulo *</label>
                  <input
                    style={styles.input}
                    value={titulo}
                    onChange={e => setTitulo(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                    placeholder="Que hay que hacer?"
                    disabled={submitting}
                    onFocus={e => (e.target.style.borderBottomColor = '#C4703A')}
                    onBlur={e => (e.target.style.borderBottomColor = '#D6CBBF')}
                  />
                </div>
                <div style={styles.inputGroup}>
                  <label style={styles.inputLabel}>Descripcion (opcional)</label>
                  <input
                    style={styles.input}
                    value={descripcion}
                    onChange={e => setDescripcion(e.target.value)}
                    placeholder="Detalles..."
                    disabled={submitting}
                    onFocus={e => (e.target.style.borderBottomColor = '#C4703A')}
                    onBlur={e => (e.target.style.borderBottomColor = '#D6CBBF')}
                  />
                </div>
                <button
                  style={{
                    ...styles.button,
                    opacity: submitting || !titulo.trim() ? 0.45 : 1,
                    cursor: submitting || !titulo.trim() ? 'not-allowed' : 'pointer',
                  }}
                  onClick={handleSubmit}
                  disabled={submitting || !titulo.trim()}
                >
                  {submitting ? 'Guardando...' : 'Agregar'}
                </button>
              </div>
            </div>

            {/* Search bar */}
            <div style={styles.searchWrapper}>
              <span style={styles.searchIcon} aria-hidden>&#128269;</span>
              <input
                style={styles.searchInput}
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Buscar tareas por palabra clave..."
                aria-label="Buscar tareas"
              />
              {isSearching && (
                <span style={styles.searchResultsBadge}>
                  {filteredTareas.length} resultado{filteredTareas.length !== 1 ? 's' : ''}
                </span>
              )}
              {isSearching && (
                <button
                  style={styles.searchClear}
                  onClick={() => setSearchQuery('')}
                  title="Limpiar busqueda"
                  onMouseEnter={e => ((e.target as HTMLElement).style.color = '#1C1917')}
                  onMouseLeave={e => ((e.target as HTMLElement).style.color = '#A8A29E')}
                >
                  x
                </button>
              )}
            </div>

            <hr style={styles.divider} />

            {/* States */}
            {loading && (
              <p style={{ ...styles.stateMsg, ...styles.loadingMsg }}>Cargando tareas...</p>
            )}
            {error && (
              <p style={{ ...styles.stateMsg, ...styles.errorMsg }}>Error: {error}</p>
            )}

            {/* Task list */}
            {!loading && !error && (
              <>
                {filteredTareas.length === 0 ? (
                  <div style={styles.empty}>
                    {isSearching ? (
                      <>
                        <p>Sin resultados para "<strong>{searchQuery}</strong>".</p>
                        <p style={{ fontSize: '0.85rem', marginTop: '0.25rem' }}>
                          Intenta con otra palabra clave.
                        </p>
                      </>
                    ) : (
                      <>
                        <p>No tienes tareas aun.</p>
                        <p style={{ fontSize: '0.85rem', marginTop: '0.25rem' }}>Crea una para empezar.</p>
                      </>
                    )}
                  </div>
                ) : (
                  <div>
                    {filteredTareas.map(t => {
                      const isEditing = editing?.id === t.id

                      return (
                        <div
                          key={t.id}
                          style={{
                            ...styles.taskItem,
                            opacity: t.completada && !isEditing ? 0.55 : 1,
                          }}
                          onMouseEnter={() => setHoveredTask(t.id)}
                          onMouseLeave={() => setHoveredTask(null)}
                        >
                          {/* Checkbox */}
                          <input
                            type="checkbox"
                            style={styles.taskCheckbox}
                            checked={t.completada ?? false}
                            onChange={() => !isEditing && actualizarTarea(t.id, { completada: !t.completada })}
                            disabled={isEditing}
                          />

                          {/* Content */}
                          <div style={{ flex: 1 }}>
                            {isEditing ? (
                              <>
                                <input
                                  style={styles.editInput}
                                  value={editing.titulo}
                                  onChange={e => setEditing({ ...editing, titulo: e.target.value })}
                                  placeholder="Titulo"
                                  autoFocus
                                />
                                <input
                                  style={styles.editDescInput}
                                  value={editing.descripcion}
                                  onChange={e => setEditing({ ...editing, descripcion: e.target.value })}
                                  placeholder="Descripcion"
                                />
                                <div style={styles.editActions}>
                                  <button
                                    style={styles.editSaveBtn}
                                    onClick={handleSaveEdit}
                                    disabled={saving}
                                  >
                                    {saving ? 'Guardando...' : 'Guardar'}
                                  </button>
                                  <button
                                    style={styles.editCancelBtn}
                                    onClick={handleCancelEdit}
                                    disabled={saving}
                                  >
                                    Cancelar
                                  </button>
                                </div>
                              </>
                            ) : (
                              <>
                                <p style={{
                                  ...styles.taskTitle,
                                  ...(t.completada ? styles.taskTitleDone : {}),
                                }}>
                                  {highlightText(t.titulo, searchQuery)}
                                </p>
                                {t.descripcion && (
                                  <p style={styles.taskDesc}>
                                    {highlightText(t.descripcion, searchQuery)}
                                  </p>
                                )}
                              </>
                            )}
                          </div>

                          {/* Actions */}
                          {!isEditing && (
                            <div style={{
                              ...styles.taskActions,
                              opacity: hoveredTask === t.id ? 1 : 0,
                            }}>
                              <button
                                style={styles.iconBtn}
                                onClick={() => setEditing({
                                  id: t.id,
                                  titulo: t.titulo,
                                  descripcion: t.descripcion || '',
                                })}
                                title="Editar"
                                onMouseEnter={e => ((e.target as HTMLElement).style.color = '#C4703A')}
                                onMouseLeave={e => ((e.target as HTMLElement).style.color = '#D6CBBF')}
                              >
                                &#9998;
                              </button>
                              <button
                                style={styles.deleteBtn}
                                onClick={() => eliminarTarea(t.id)}
                                title="Eliminar"
                                onMouseEnter={e => ((e.target as HTMLElement).style.color = '#B91C1C')}
                                onMouseLeave={e => ((e.target as HTMLElement).style.color = '#D6CBBF')}
                              >
                                x
                              </button>
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                )}

                {/* Footer */}
                {tareas.length > 0 && (
                  <div style={styles.footer}>
                    <span style={styles.footerText}>
                      {completadas} de {tareas.length} completadas
                    </span>
                    <div style={styles.progressBar}>
                      <div style={{ ...styles.progressFill, width: `${progreso}%` }} />
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Chat Column */}
          <div style={styles.chatColumn}>
            <Chat />
          </div>

        </div>
      </div>
    </div>
  )
}
