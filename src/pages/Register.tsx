// src/pages/Register.tsx
// src/pages/Register.tsx
import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuthContext } from '../context/AuthContext'

export function Register() {
  const navigate = useNavigate()
  const { signUp } = useAuthContext()

  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  const [focused, setFocused] = useState<string | null>(null)

  const inputStyle = (field: string) => ({
    background: 'transparent',
    border: 'none',
    borderBottom: `1.5px solid ${focused === field ? '#C4703A' : '#D6CBBF'}`,
    padding: '0.4rem 0',
    fontSize: '0.95rem',
    fontFamily: "'Georgia', serif",
    color: '#1C1917',
    outline: 'none',
    width: '100%',
    transition: 'border-color 0.2s',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.')
      return
    }
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.')
      return
    }

    setLoading(true)
    try {
      await signUp(email, password, nombre)
      setSuccess('¡Cuenta creada! Revisa tu correo para confirmar tu cuenta.')
      setTimeout(() => navigate('/login'), 3000)
    } catch (err: any) {
      setError(err.message || 'Error al crear la cuenta.')
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

        {/* Brand */}
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
            margin: '0 0 1.75rem',
          }}>
            Crear cuenta
          </p>

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

          {/* Success */}
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
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

            {/* Nombre */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label style={{ fontSize: '0.72rem', fontFamily: "'Helvetica Neue', Arial, sans-serif", color: '#A8A29E', letterSpacing: '0.04em' }}>
                Nombre completo
              </label>
              <input
                type="text"
                value={nombre}
                onChange={e => setNombre(e.target.value)}
                onFocus={() => setFocused('nombre')}
                onBlur={() => setFocused(null)}
                required
                placeholder="Juan García"
                style={inputStyle('nombre')}
              />
            </div>

            {/* Email */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label style={{ fontSize: '0.72rem', fontFamily: "'Helvetica Neue', Arial, sans-serif", color: '#A8A29E', letterSpacing: '0.04em' }}>
                Correo electrónico
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                onFocus={() => setFocused('email')}
                onBlur={() => setFocused(null)}
                required
                placeholder="tu@email.com"
                style={inputStyle('email')}
              />
            </div>

            {/* Password */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label style={{ fontSize: '0.72rem', fontFamily: "'Helvetica Neue', Arial, sans-serif", color: '#A8A29E', letterSpacing: '0.04em' }}>
                Contraseña
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                onFocus={() => setFocused('password')}
                onBlur={() => setFocused(null)}
                required
                placeholder="Mínimo 6 caracteres"
                style={inputStyle('password')}
              />
            </div>

            {/* Confirm Password */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label style={{ fontSize: '0.72rem', fontFamily: "'Helvetica Neue', Arial, sans-serif", color: '#A8A29E', letterSpacing: '0.04em' }}>
                Confirmar contraseña
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                onFocus={() => setFocused('confirm')}
                onBlur={() => setFocused(null)}
                required
                placeholder="Repite tu contraseña"
                style={{
                  ...inputStyle('confirm'),
                  borderBottomColor:
                    confirmPassword && confirmPassword !== password
                      ? '#B91C1C'
                      : focused === 'confirm'
                      ? '#C4703A'
                      : '#D6CBBF',
                }}
              />
              {confirmPassword && confirmPassword !== password && (
                <span style={{ fontSize: '0.72rem', fontFamily: "'Helvetica Neue', Arial, sans-serif", color: '#B91C1C' }}>
                  Las contraseñas no coinciden
                </span>
              )}
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
              {loading ? 'Creando cuenta…' : 'Registrarse'}
            </button>
          </form>
        </div>

        {/* Login link */}
        <p style={{
          textAlign: 'center',
          marginTop: '1.5rem',
          fontSize: '0.82rem',
          fontFamily: "'Helvetica Neue', Arial, sans-serif",
          color: '#A8A29E',
        }}>
          ¿Ya tienes cuenta?{' '}
          <Link to="/login" style={{ color: '#C4703A', textDecoration: 'none', fontWeight: 700, letterSpacing: '0.03em' }}>
            Inicia sesión
          </Link>
        </p>

      </div>
    </div>
  )
}