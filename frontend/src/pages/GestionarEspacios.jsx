import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'
import Navbar from '../components/Navbar'

export default function GestionarEspacios() {
  const [espacios, setEspacios] = useState([])
  const [form, setForm] = useState({ nombre: '', ubicacion: '', capacidad: '', estado: 'disponible' })
  const [error, setError] = useState('')
  const [exito, setExito] = useState('')
  const navigate = useNavigate()

  const cargarEspacios = async () => {
    try {
      const res = await api.get('/espacios/')
      setEspacios(res.data)
    } catch (err) {
      setError('Error al cargar espacios')
    }
  }

  useEffect(() => { cargarEspacios() }, [])

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleCrear = async (e) => {
    e.preventDefault()
    setError('')
    setExito('')
    try {
      await api.post('/espacios/', { ...form, capacidad: parseInt(form.capacidad) })
      setExito('✅ Espacio creado exitosamente')
      setForm({ nombre: '', ubicacion: '', capacidad: '', estado: 'disponible' })
      cargarEspacios()
    } catch (err) {
      setError(err.response?.data?.detail || 'Error al crear el espacio')
    }
  }

  const handleEliminar = async (id) => {
    try {
      await api.delete(`/espacios/${id}`)
      cargarEspacios()
    } catch (err) {
      setError(err.response?.data?.detail || 'Error al eliminar el espacio, espacio cuenta con reservas activas')
    }
  }

  const badgeEstado = (estado) => {
    const estilos = {
      disponible: { background: '#0a2e1a', color: '#34d399' },
      inactivo: { background: '#3a1f1f', color: '#f87171' },
      'en mantenimiento': { background: '#2a2000', color: '#fbbf24' },
    }
    return estilos[estado] || { background: '#1e1e2a', color: '#94a3b8' }
  }

  return (
    <div style={styles.page}>
      <Navbar />
      <div style={styles.content}>
        <div style={styles.header}>
          <div>
            <p style={styles.titulo}>Gestionar espacios</p>
            <p style={styles.subtitulo}>Crea y administra los espacios institucionales</p>
          </div>
        </div>

        <div style={styles.layout}>
          <div style={styles.formCard}>
            <p style={styles.formTitulo}>
              <i className="ti ti-plus" aria-hidden="true"></i> Nuevo espacio
            </p>
            <form onSubmit={handleCrear} style={styles.form}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Nombre</label>
                <div style={styles.inputWrapper}>
                  <i className="ti ti-building-community" style={styles.inputIcon} aria-hidden="true"></i>
                  <input style={styles.input} type="text" name="nombre" placeholder="Ej: Sala de reuniones A" value={form.nombre} onChange={handleChange} required />
                </div>
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Ubicación</label>
                <div style={styles.inputWrapper}>
                  <i className="ti ti-map-pin" style={styles.inputIcon} aria-hidden="true"></i>
                  <input style={styles.input} type="text" name="ubicacion" placeholder="Ej: Bloque 2, piso 3" value={form.ubicacion} onChange={handleChange} required />
                </div>
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Capacidad</label>
                <div style={styles.inputWrapper}>
                  <i className="ti ti-users" style={styles.inputIcon} aria-hidden="true"></i>
                  <input style={styles.input} type="number" name="capacidad" placeholder="Número de personas" value={form.capacidad} onChange={handleChange} min="1" required />
                </div>
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Estado</label>
                <div style={styles.inputWrapper}>
                  <i className="ti ti-toggle-right" style={styles.inputIcon} aria-hidden="true"></i>
                  <select name="estado" value={form.estado} onChange={handleChange} style={styles.select}>
                    <option value="disponible">Disponible</option>
                    <option value="inactivo">Inactivo</option>
                    <option value="en mantenimiento">En mantenimiento</option>
                  </select>
                </div>
              </div>

              {error && <div style={styles.errorBox}><i className="ti ti-alert-circle" aria-hidden="true"></i> {error}</div>}
              {exito && <div style={styles.exitoBox}><i className="ti ti-circle-check" aria-hidden="true"></i> {exito}</div>}

              <button style={styles.boton} type="submit">
                <i className="ti ti-plus" aria-hidden="true"></i> Crear espacio
              </button>
            </form>
          </div>

          <div style={styles.lista}>
            <p style={styles.listaTitulo}>Espacios registrados ({espacios.length})</p>
            <div style={styles.grid}>
              {espacios.length === 0 && (
                <div style={styles.empty}>
                  <i className="ti ti-building-off" style={{ fontSize: '36px', color: '#334155' }} aria-hidden="true"></i>
                  <p style={{ color: '#64748b', marginTop: '8px', fontSize: '13px' }}>No hay espacios aún</p>
                </div>
              )}
              {espacios.map((e) => (
                <div key={e.id_espacio} style={styles.card}>
                  <div style={styles.cardHeader}>
                    <div style={styles.iconBox}>
                      <i className="ti ti-building-community" style={{ color: '#818cf8', fontSize: '18px' }} aria-hidden="true"></i>
                    </div>
                    <span style={{ ...styles.badge, ...badgeEstado(e.estado) }}>{e.estado}</span>
                  </div>
                  <p style={styles.cardTitulo}>{e.nombre}</p>
                  <p style={styles.infoItem}><i className="ti ti-map-pin" aria-hidden="true"></i> {e.ubicacion}</p>
                  <p style={styles.infoItem}><i className="ti ti-users" aria-hidden="true"></i> {e.capacidad} personas</p>
                  <button style={styles.botonEliminar} onClick={() => handleEliminar(e.id_espacio)}>
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
  iconBox: { width: '36px', height: '36px', borderRadius: '8px', background: '#2e1f6e', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  badge: { padding: '3px 8px', borderRadius: '999px', fontSize: '11px' },
  cardTitulo: { fontSize: '14px', fontWeight: '500', color: '#e2e8f0', marginBottom: '8px' },
  infoItem: { fontSize: '12px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' },
  empty: { display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '2rem' },
}