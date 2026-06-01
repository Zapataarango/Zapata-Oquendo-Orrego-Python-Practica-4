import { useEffect, useState } from 'react'
import api from '../api/axios'
import Navbar from '../components/Navbar'

export default function GestionarUsuarios() {
  const [usuarios, setUsuarios] = useState([])
  const [form, setForm] = useState({ nombre: '', correo: '', password: '', rol: 'usuario' })
  const [error, setError] = useState('')
  const [exito, setExito] = useState('')

  const cargarUsuarios = async () => {
    try {
      const res = await api.get('/usuarios/')
      setUsuarios(res.data)
    } catch (err) {
      setError('Error al cargar usuarios')
    }
  }

  useEffect(() => { cargarUsuarios() }, [])

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleCrear = async (e) => {
    e.preventDefault()
    setError('')
    setExito('')
    try {
      await api.post('/usuarios/', form)
      setExito('✅ Usuario creado exitosamente')
      setForm({ nombre: '', correo: '', password: '', rol: 'usuario' })
      cargarUsuarios()
    } catch (err) {
      setError(err.response?.data?.detail || 'Error al crear el usuario')
    }
  }

  const handleEliminar = async (id) => {
    try {
      await api.delete(`/usuarios/${id}`)
      cargarUsuarios()
    } catch (err) {
      setError(err.response?.data?.detail || 'Error al eliminar el usuario')
    }
  }

  const iniciales = (nombre) =>
    nombre?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()

  const colorRol = (rol) =>
    rol === 'admin'
      ? { background: '#2e1f6e', color: '#818cf8' }
      : { background: '#0c2a4a', color: '#60a5fa' }

  return (
    <div style={styles.page}>
      <Navbar />
      <div style={styles.content}>
        <div style={styles.header}>
          <div>
            <p style={styles.titulo}>Gestionar usuarios</p>
            <p style={styles.subtitulo}>Crea y administra los usuarios del sistema</p>
          </div>
        </div>

        <div style={styles.layout}>
          <div style={styles.formCard}>
            <p style={styles.formTitulo}>
              <i className="ti ti-user-plus" aria-hidden="true"></i> Nuevo usuario
            </p>
            <form onSubmit={handleCrear} style={styles.form}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Nombre</label>
                <div style={styles.inputWrapper}>
                  <i className="ti ti-user" style={styles.inputIcon} aria-hidden="true"></i>
                  <input style={styles.input} type="text" name="nombre" placeholder="Nombre completo" value={form.nombre} onChange={handleChange} required />
                </div>
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Correo</label>
                <div style={styles.inputWrapper}>
                  <i className="ti ti-mail" style={styles.inputIcon} aria-hidden="true"></i>
                  <input style={styles.input} type="email" name="correo" placeholder="correo@itm.edu.co" value={form.correo} onChange={handleChange} required />
                </div>
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Contraseña</label>
                <div style={styles.inputWrapper}>
                  <i className="ti ti-lock" style={styles.inputIcon} aria-hidden="true"></i>
                  <input style={styles.input} type="password" name="password" placeholder="••••••••" value={form.password} onChange={handleChange} required />
                </div>
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Rol</label>
                <div style={styles.inputWrapper}>
                  <i className="ti ti-shield" style={styles.inputIcon} aria-hidden="true"></i>
                  <select name="rol" value={form.rol} onChange={handleChange} style={styles.select}>
                    <option value="usuario">Usuario</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              </div>

              {error && <div style={styles.errorBox}><i className="ti ti-alert-circle" aria-hidden="true"></i> {error}</div>}
              {exito && <div style={styles.exitoBox}><i className="ti ti-circle-check" aria-hidden="true"></i> {exito}</div>}

              <button style={styles.boton} type="submit">
                <i className="ti ti-user-plus" aria-hidden="true"></i> Crear usuario
              </button>
            </form>
          </div>

          <div style={styles.lista}>
            <p style={styles.listaTitulo}>Usuarios registrados ({usuarios.length})</p>
            <div style={styles.grid}>
              {usuarios.length === 0 && (
                <div style={styles.empty}>
                  <i className="ti ti-users-off" style={{ fontSize: '36px', color: '#334155' }} aria-hidden="true"></i>
                  <p style={{ color: '#64748b', marginTop: '8px', fontSize: '13px' }}>No hay usuarios aún</p>
                </div>
              )}
              {usuarios.map((u) => (
                <div key={u.id_usuario} style={styles.card}>
                  <div style={styles.cardHeader}>
                    <div style={styles.avatar}>{iniciales(u.nombre)}</div>
                    <span style={{ ...styles.badge, ...colorRol(u.rol) }}>
                      <i className={`ti ${u.rol === 'admin' ? 'ti-shield' : 'ti-user'}`} aria-hidden="true"></i> {u.rol}
                    </span>
                  </div>
                  <p style={styles.cardTitulo}>{u.nombre}</p>
                  <p style={styles.infoItem}><i className="ti ti-mail" aria-hidden="true"></i> {u.correo}</p>
                  <button style={styles.botonEliminar} onClick={() => handleEliminar(u.id_usuario)}>
                    <i className="ti ti-trash" aria-hidden="true"></i> Eliminar
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const styles = {
  page: { background: '#0f1117', minHeight: '100vh', fontFamily: 'sans-serif' },
  content: { padding: '2rem' },
  header: { marginBottom: '1.5rem' },
  titulo: { fontSize: '20px', fontWeight: '500', color: '#e2e8f0', marginBottom: '4px' },
  subtitulo: { fontSize: '13px', color: '#64748b' },
  layout: { display: 'grid', gridTemplateColumns: '360px 1fr', gap: '1.5rem', alignItems: 'start' },
  formCard: { background: '#1a1d27', border: '0.5px solid #2a2d3a', borderRadius: '12px', padding: '1.5rem' },
  formTitulo: { fontSize: '15px', fontWeight: '500', color: '#e2e8f0', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' },
  form: { display: 'flex', flexDirection: 'column', gap: '1rem' },
  inputGroup: { display: 'flex', flexDirection: 'column', gap: '6px' },
  label: { fontSize: '13px', color: '#94a3b8', fontWeight: '500' },
  inputWrapper: { position: 'relative', display: 'flex', alignItems: 'center' },
  inputIcon: { position: 'absolute', left: '12px', color: '#64748b', fontSize: '16px', zIndex: 1 },
  input: { width: '100%', padding: '10px 12px 10px 38px', background: '#0f1117', border: '0.5px solid #2a2d3a', borderRadius: '8px', color: '#e2e8f0', fontSize: '14px', fontFamily: 'inherit', outline: 'none' },
  select: { width: '100%', padding: '10px 12px 10px 38px', background: '#0f1117', border: '0.5px solid #2a2d3a', borderRadius: '8px', color: '#e2e8f0', fontSize: '14px', fontFamily: 'inherit', outline: 'none' },
  boton: { padding: '11px', background: '#4f46e5', color: 'white', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '500', cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '0.5rem' },
  botonEliminar: { marginTop: '10px', width: '100%', padding: '8px', background: 'transparent', color: '#f87171', border: '0.5px solid #3a1f1f', borderRadius: '8px', fontSize: '13px', cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' },
  errorBox: { display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 14px', background: '#3a1f1f', border: '0.5px solid #7f1d1d', borderRadius: '8px', color: '#f87171', fontSize: '13px' },
  exitoBox: { display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 14px', background: '#0a2e1a', border: '0.5px solid #065f46', borderRadius: '8px', color: '#34d399', fontSize: '13px' },
  lista: {},
  listaTitulo: { fontSize: '15px', fontWeight: '500', color: '#e2e8f0', marginBottom: '1rem' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' },
  card: { background: '#1a1d27', border: '0.5px solid #2a2d3a', borderRadius: '12px', padding: '1.25rem' },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' },
  avatar: { width: '36px', height: '36px', borderRadius: '50%', background: '#3730a3', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: '500', color: '#c7d2fe' },
  badge: { padding: '3px 10px', borderRadius: '999px', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px' },
  cardTitulo: { fontSize: '14px', fontWeight: '500', color: '#e2e8f0', marginBottom: '6px' },
  infoItem: { fontSize: '12px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' },
  empty: { display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '2rem' },
}