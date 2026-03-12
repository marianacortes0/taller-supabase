// src/pages/ResetPassword.tsx
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthContext } from '../context/AuthContext'

export function ResetPassword() {
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const [focusedPassword, setFocusedPassword] = useState(false)
  const [focusedConfirm, setFocusedConfirm] = useState(false)
  const { updatePassword, user } = useAuthContext()

  // Verificar que el usuario llegó desde el enlace de recuperación
  useEffect(() => {
    // Supabase automáticamente autentica al usuario cuando llega desde el enlace
    // Si no hay usuario después de un tiempo, redirigir
    const timer = setTimeout(() => {
      if (!user) {
        setError('El enlace ha expirado o es inválido. Solicita uno nuevo.')
      }
    }, 2000)

    return () => clearTimeout(timer)
  }, [user])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres')
      return
    }

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden')
      return
    }

    setLoading(true)
    try {
      await updatePassword(password)
      setSuccess(true)
      // Redirigir al dashboard después de 2 segundos
      setTimeout(() => navigate('/'), 2000)
    } catch (err: any) {
      setError(err.message || 'Error al actualizar la contraseña')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#F7F3EE',
      fontFamily: "'Georgia', 'Times New Roman', serif",
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem',
    }}>
      <div style={{ width: '100%', maxWidth: '380px' }}>

        {/* Logo / Brand */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <p style={{
            fontSize: '0.7rem',
            fontFamily: "'Helvetica Neue', Arial, sans-serif",
            fontWeight: 700,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: '#C4703A',
            margin: '0 0 0.5rem',
          }}>
            Panel personal
          </p>
          <h1 style={{
            fontSize: '2.4rem',
            fontWeight: 400,
            color: '#1C1917',
            margin: 0,
            lineHeight: 1.1,
            letterSpacing: '-0.02em',
          }}>
            Mis Tareas
          </h1>
        </div>

        {/* Card */}
        <div style={{
          background: '#FFFBF7',
          border: '1px solid #E8DDD4',
          borderRadius: '2px',
          padding: '2rem 2.25rem',
          boxShadow: '0 1px 3px rgba(28,25,23,0.05)',
        }}>
          <p style={{
            fontSize: '0.68rem',
            fontFamily: "'Helvetica Neue', Arial, sans-serif",
            fontWeight: 700,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: '#78716C',
            margin: '0 0 0.5rem',
          }}>
            Nueva contraseña
          </p>

          <p style={{
            fontSize: '0.85rem',
            fontFamily: "'Helvetica Neue', Arial, sans-serif",
            color: '#78716C',
            margin: '0 0 1.5rem',
            lineHeight: 1.5,
          }}>
            Ingresa tu nueva contraseña para completar el proceso de recuperación.
          </p>

          {/* Success Message */}
          {success && (
            <div style={{
              background: '#F0FDF4',
              border: '1px solid #BBF7D0',
              borderRadius: '2px',
              padding: '0.65rem 0.9rem',
              marginBottom: '1.25rem',
              fontSize: '0.82rem',
              fontFamily: "'Helvetica Neue', Arial, sans-serif",
              color: '#15803D',
            }}>
              Contraseña actualizada correctamente. Redirigiendo...
            </div>
          )}

          {/* Error */}
          {error && (
            <div style={{
              background: '#FEF2F2',
              border: '1px solid #FECACA',
              borderRadius: '2px',
              padding: '0.65rem 0.9rem',
              marginBottom: '1.25rem',
              fontSize: '0.82rem',
              fontFamily: "'Helvetica Neue', Arial, sans-serif",
              color: '#B91C1C',
            }}>
              {error}
            </div>
          )}

          {!success && (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

              {/* Password */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label style={{
                  fontSize: '0.72rem',
                  fontFamily: "'Helvetica Neue', Arial, sans-serif",
                  color: '#A8A29E',
                  letterSpacing: '0.04em',
                }}>
                  Nueva contraseña
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  onFocus={() => setFocusedPassword(true)}
                  onBlur={() => setFocusedPassword(false)}
                  required
                  placeholder="Mínimo 6 caracteres"
                  style={{
                    background: 'transparent',
                    border: 'none',
                    borderBottom: `1.5px solid ${focusedPassword ? '#C4703A' : '#D6CBBF'}`,
                    padding: '0.4rem 0',
                    fontSize: '0.95rem',
                    fontFamily: "'Georgia', serif",
                    color: '#1C1917',
                    outline: 'none',
                    width: '100%',
                    transition: 'border-color 0.2s',
                  }}
                />
              </div>

              {/* Confirm Password */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label style={{
                  fontSize: '0.72rem',
                  fontFamily: "'Helvetica Neue', Arial, sans-serif",
                  color: '#A8A29E',
                  letterSpacing: '0.04em',
                }}>
                  Confirmar contraseña
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  onFocus={() => setFocusedConfirm(true)}
                  onBlur={() => setFocusedConfirm(false)}
                  required
                  placeholder="Repite la contraseña"
                  style={{
                    background: 'transparent',
                    border: 'none',
                    borderBottom: `1.5px solid ${focusedConfirm ? '#C4703A' : '#D6CBBF'}`,
                    padding: '0.4rem 0',
                    fontSize: '0.95rem',
                    fontFamily: "'Georgia', serif",
                    color: '#1C1917',
                    outline: 'none',
                    width: '100%',
                    transition: 'border-color 0.2s',
                  }}
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                style={{
                  marginTop: '0.25rem',
                  background: loading ? '#78716C' : '#1C1917',
                  color: '#F7F3EE',
                  border: 'none',
                  padding: '0.8rem',
                  fontSize: '0.7rem',
                  fontFamily: "'Helvetica Neue', Arial, sans-serif",
                  fontWeight: 700,
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  borderRadius: '2px',
                  width: '100%',
                  transition: 'background 0.2s',
                }}
              >
                {loading ? 'Guardando...' : 'Guardar contraseña'}
              </button>
            </form>
          )}
        </div>

      </div>
    </div>
  )
}
