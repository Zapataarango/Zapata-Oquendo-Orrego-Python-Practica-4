import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'

export default function Login() {
  const [correo, setCorreo] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await api.post('/auth/token', {
        correo,
        password
      })
      const token = res.data.access_token

      const perfil = await api.get('/usuarios/perfil/me', {
        headers: { Authorization: `Bearer ${token}` },
      })

      login(token, perfil.data)

      if (perfil.data.rol === 'admin') {
        navigate('/admin')
      } else {
        navigate('/dashboard')
      }
    } catch (err) {
      setError('Correo o contraseña incorrectos')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.logoArea}>
          <div style={styles.logoIcon}>
            <i className="ti ti-building" style={{ color: '#818cf8', fontSize: '28px' }} aria-hidden="true"></i>
          </div>
          <h1 style={styles.titulo}>Reserva ITM</h1>
          <p style={styles.subtitulo}>Sistema de Gestión de Espacios Institucionales</p>
        </div>

        <form onSubmit={handleLogin} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Correo institucional</label>
            <div style={styles.inputWrapper}>
              <i className="ti ti-mail" style={styles.inputIcon} aria-hidden="true"></i>
              <input
                style={styles.input}
                type="email"
                placeholder="correo@itm.edu.co"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                required
              />
            </div>
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Contraseña</label>
            <div style={styles.inputWrapper}>
              <i className="ti ti-lock" style={styles.inputIcon} aria-hidden="true"></i>
              <input
                style={styles.input}
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          {error && (
            <div style={styles.errorBox}>
              <i className="ti ti-alert-circle" aria-hidden="true"></i>
              {error}
            </div>
          )}

          <button style={styles.boton} type="submit" disabled={loading}>
            {loading ? (
              <><i className="ti ti-loader-2" aria-hidden="true"></i> Ingresando...</>
            ) : (
              <><i className="ti ti-login" aria-hidden="true"></i> Iniciar sesión</>
            )}
          </button>
        </form>
      </div>
    </div>
  )
}

const styles = {
  page: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    background: '#0f1117',
    fontFamily: 'sans-serif',
  },
  card: {
    background: '#1a1d27',
    border: '0.5px solid #2a2d3a',
    borderRadius: '16px',
    padding: '2.5rem',
    width: '100%',
    maxWidth: '420px',
  },
  logoArea: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: '2rem',
  },
  logoIcon: {
    width: '60px',
    height: '60px',
    borderRadius: '16px',
    background: '#2e1f6e',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '1rem',
  },
  titulo: {
    fontSize: '22px',
    fontWeight: '500',
    color: '#e2e8f0',
    marginBottom: '4px',
  },
  subtitulo: {
    fontSize: '13px',
    color: '#64748b',
    textAlign: 'center',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  label: {
    fontSize: '13px',
    color: '#94a3b8',
    fontWeight: '500',
  },
  inputWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  inputIcon: {
    position: 'absolute',
    left: '12px',
    color: '#64748b',
    fontSize: '16px',
  },
  input: {
    width: '100%',
    padding: '10px 12px 10px 38px',
    background: '#0f1117',
    border: '0.5px solid #2a2d3a',
    borderRadius: '8px',
    color: '#e2e8f0',
    fontSize: '14px',
    fontFamily: 'inherit',
    outline: 'none',
  },
  errorBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 14px',
    background: '#3a1f1f',
    border: '0.5px solid #7f1d1d',
    borderRadius: '8px',
    color: '#f87171',
    fontSize: '13px',
  },
  boton: {
    padding: '11px',
    background: '#4f46e5',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    fontFamily: 'inherit',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    marginTop: '0.5rem',
  },
}