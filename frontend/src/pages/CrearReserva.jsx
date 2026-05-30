import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import api from '../api/axios'
import Navbar from '../components/Navbar'

export default function CrearReserva() {
  const [espacios, setEspacios] = useState([])
  const [form, setForm] = useState({
    id_espacio: '',
    fecha: '',
    hora_inicio: '',
    hora_fin: '',
    cantidad_asistentes: '',
  })
  const [error, setError] = useState('')
  const [exito, setExito] = useState('')
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  useEffect(() => {
    const cargarEspacios = async () => {
      try {
        const res = await api.get('/espacios/disponibles')
        setEspacios(res.data)
        const espacioParam = searchParams.get('espacio')
        if (espacioParam) {
          setForm((f) => ({ ...f, id_espacio: espacioParam }))
        }
      } catch (err) {
        setError('Error al cargar espacios')
      }
    }
    cargarEspacios()
  }, [])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setExito('')
    try {
      await api.post('/reservas/', {
        id_espacio: parseInt(form.id_espacio),
        fecha: form.fecha,
        hora_inicio: form.hora_inicio,
        hora_fin: form.hora_fin,
        cantidad_asistentes: parseInt(form.cantidad_asistentes),
      })
      setExito('✅ Reserva creada exitosamente, queda en estado esperando.')
      setTimeout(() => navigate('/mis-reservas'), 2000)
    } catch (err) {
      setError(err.response?.data?.detail || 'Error al crear la reserva')
    }
  }

  return (
    <div style={styles.page}>
      <Navbar />
      <div style={styles.content}>
        <div style={styles.header}>
          <div>
            <p style={styles.titulo}>Nueva reserva</p>
            <p style={styles.subtitulo}>Completa el formulario para crear una reserva</p>
          </div>
        </div>

        <div style={styles.card}>
          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Espacio</label>
              <div style={styles.selectWrapper}>
                <i className="ti ti-building-community" style={styles.inputIcon} aria-hidden="true"></i>
                <select
                  name="id_espacio"
                  value={form.id_espacio}
                  onChange={handleChange}
                  style={styles.select}
                  required
                >
                  <option value="">Selecciona un espacio</option>
                  {espacios.map((e) => (
                    <option key={e.id_espacio} value={e.id_espacio}>
                      {e.nombre} — {e.ubicacion} (cap. {e.capacidad})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Fecha</label>
              <div style={styles.inputWrapper}>
                <i className="ti ti-calendar" style={styles.inputIcon} aria-hidden="true"></i>
                <input
                  style={styles.input}
                  type="date"
                  name="fecha"
                  value={form.fecha}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div style={styles.row}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Hora inicio</label>
                <div style={styles.inputWrapper}>
                  <i className="ti ti-clock" style={styles.inputIcon} aria-hidden="true"></i>
                  <input
                    style={styles.input}
                    type="time"
                    name="hora_inicio"
                    value={form.hora_inicio}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Hora fin</label>
                <div style={styles.inputWrapper}>
                  <i className="ti ti-clock" style={styles.inputIcon} aria-hidden="true"></i>
                  <input
                    style={styles.input}
                    type="time"
                    name="hora_fin"
                    value={form.hora_fin}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Cantidad de asistentes</label>
              <div style={styles.inputWrapper}>
                <i className="ti ti-users" style={styles.inputIcon} aria-hidden="true"></i>
                <input
                  style={styles.input}
                  type="number"
                  name="cantidad_asistentes"
                  value={form.cantidad_asistentes}
                  onChange={handleChange}
                  min="1"
                  placeholder="Número de asistentes"
                  required
                />
              </div>
            </div>

            {error && (
              <div style={styles.errorBox}>
                <i className="ti ti-alert-circle" aria-hidden="true"></i> {error}
              </div>
            )}
            {exito && (
              <div style={styles.exitoBox}>
                <i className="ti ti-circle-check" aria-hidden="true"></i> {exito}
              </div>
            )}

            <button style={styles.boton} type="submit">
              <i className="ti ti-calendar-plus" aria-hidden="true"></i> Crear reserva
            </button>
          </form>
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
  card: { background: '#1a1d27', border: '0.5px solid #2a2d3a', borderRadius: '12px', padding: '2rem', maxWidth: '560px' },
  form: { display: 'flex', flexDirection: 'column', gap: '1rem' },
  row: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' },
  inputGroup: { display: 'flex', flexDirection: 'column', gap: '6px' },
  label: { fontSize: '13px', color: '#94a3b8', fontWeight: '500' },
  inputWrapper: { position: 'relative', display: 'flex', alignItems: 'center' },
  selectWrapper: { position: 'relative', display: 'flex', alignItems: 'center' },
  inputIcon: { position: 'absolute', left: '12px', color: '#64748b', fontSize: '16px', zIndex: 1 },
  input: { width: '100%', padding: '10px 12px 10px 38px', background: '#0f1117', border: '0.5px solid #2a2d3a', borderRadius: '8px', color: '#e2e8f0', fontSize: '14px', fontFamily: 'inherit', outline: 'none' },
  select: { width: '100%', padding: '10px 12px 10px 38px', background: '#0f1117', border: '0.5px solid #2a2d3a', borderRadius: '8px', color: '#e2e8f0', fontSize: '14px', fontFamily: 'inherit', outline: 'none' },
  boton: { padding: '11px', background: '#4f46e5', color: 'white', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '500', cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '0.5rem' },
  errorBox: { display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 14px', background: '#3a1f1f', border: '0.5px solid #7f1d1d', borderRadius: '8px', color: '#f87171', fontSize: '13px' },
  exitoBox: { display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 14px', background: '#0a2e1a', border: '0.5px solid #065f46', borderRadius: '8px', color: '#34d399', fontSize: '13px' },
}