// src/pages/ForgotPassword.tsx
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuthContext } from '../context/AuthContext'

export function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const [focusedEmail, setFocusedEmail] = useState(false)
  const { resetPasswordForEmail } = useAuthContext()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess(false)
    setLoading(true)
    try {
      await resetPasswordForEmail(email)
      setSuccess(true)
    } catch (err: any) {
      setError(err.message || 'Error al enviar el correo de recuperación')
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
            Recuperar contraseña
          </p>

          <p style={{
            fontSize: '0.85rem',
            fontFamily: "'Helvetica Neue', Arial, sans-serif",
            color: '#78716C',
            margin: '0 0 1.5rem',
            lineHeight: 1.5,
          }}>
            Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña.
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
              Hemos enviado un enlace de recuperación a tu correo. Revisa tu bandeja de entrada.
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

              {/* Email */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label style={{
                  fontSize: '0.72rem',
                  fontFamily: "'Helvetica Neue', Arial, sans-serif",
                  color: '#A8A29E',
                  letterSpacing: '0.04em',
                }}>
                  Correo electrónico
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  onFocus={() => setFocusedEmail(true)}
                  onBlur={() => setFocusedEmail(false)}
                  required
                  placeholder="tu@email.com"
                  style={{
                    background: 'transparent',
                    border: 'none',
                    borderBottom: `1.5px solid ${focusedEmail ? '#C4703A' : '#D6CBBF'}`,
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
                {loading ? 'Enviando...' : 'Enviar enlace'}
              </button>
            </form>
          )}
        </div>

        {/* Back to login link */}
        <p style={{
          textAlign: 'center',
          marginTop: '1.5rem',
          fontSize: '0.82rem',
          fontFamily: "'Helvetica Neue', Arial, sans-serif",
          color: '#A8A29E',
        }}>
          <Link to="/login" style={{
            color: '#C4703A',
            textDecoration: 'none',
            fontWeight: 700,
            letterSpacing: '0.03em',
          }}>
            Volver al inicio de sesión
          </Link>
        </p>

      </div>
    </div>
  )
}
