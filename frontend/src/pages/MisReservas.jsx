import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'
import Navbar from '../components/Navbar'

export default function MisReservas() {
  const [reservas, setReservas] = useState([])
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const cargarReservas = async () => {
    try {
      const res = await api.get('/reservas/mis-reservas')
      setReservas(res.data)
    } catch (err) {
      setError('Error al cargar las reservas')
    }
  }

  useEffect(() => {
    cargarReservas()
  }, [])

  const cancelarReserva = async (id) => {
    try {
      await api.patch(`/reservas/${id}/cancelar`)
      cargarReservas()
    } catch (err) {
      setError(err.response?.data?.detail || 'Error al cancelar la reserva')
    }
  }

  const badgeEstado = (estado) => {
    const estilos = {
      aprobada: { background: '#0a2e1a', color: '#34d399' },
      rechazada: { background: '#3a1f1f', color: '#f87171' },
      esperando: { background: '#2a2000', color: '#fbbf24' },
      cancelada: { background: '#1e1e2a', color: '#94a3b8' },
    }
    return estilos[estado] || { background: '#1e1e2a', color: '#94a3b8' }
  }

  return (
    <div style={styles.page}>
      <Navbar />
      <div style={styles.content}>
        <div style={styles.header}>
          <div>
            <p style={styles.titulo}>Mis reservas</p>
            <p style={styles.subtitulo}>Historial y estado de tus reservas</p>
          </div>
          <button style={styles.botonNueva} onClick={() => navigate('/crear-reserva')}>
            <i className="ti ti-plus" aria-hidden="true"></i> Nueva reserva
          </button>
        </div>

        {error && <div style={styles.errorBox}><i className="ti ti-alert-circle" aria-hidden="true"></i> {error}</div>}

        {reservas.length === 0 && !error && (
          <div style={styles.empty}>
            <i className="ti ti-calendar-off" style={{ fontSize: '40px', color: '#334155' }} aria-hidden="true"></i>
            <p style={{ color: '#64748b', marginTop: '8px' }}>No tienes reservas aún</p>
          </div>
        )}

        <div style={styles.grid}>
          {reservas.map((r) => (
            <div key={r.id_reserva} style={styles.card}>
              <div style={styles.cardHeader}>
                <div style={styles.iconBox}>
                  <i className="ti ti-calendar" style={{ color: '#60a5fa', fontSize: '20px' }} aria-hidden="true"></i>
                </div>
                <span style={{ ...styles.badge, ...badgeEstado(r.estado) }}>{r.estado}</span>
              </div>
              <p style={styles.cardTitulo}>{r.nombre_espacio || `Espacio #${r.id_espacio}`}</p>
              <div style={styles.cardInfo}>
                <p style={styles.infoItem}><i className="ti ti-calendar" aria-hidden="true"></i> {r.fecha}</p>
                <p style={styles.infoItem}><i className="ti ti-clock" aria-hidden="true"></i> {r.hora_inicio} — {r.hora_fin}</p>
                <p style={styles.infoItem}><i className="ti ti-users" aria-hidden="true"></i> {r.cantidad_asistentes} asistentes</p>
              </div>
              {(r.estado === 'esperando' || r.estado === 'aprobada') && (
                <button style={styles.botonCancelar} onClick={() => cancelarReserva(r.id_reserva)}>
                  <i className="ti ti-x" aria-hidden="true"></i> Cancelar reserva
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

const styles = {
  page: { background: '#0f1117', minHeight: '100vh', fontFamily: 'sans-serif' },
  content: { padding: '2rem' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' },
  titulo: { fontSize: '20px', fontWeight: '500', color: '#e2e8f0', marginBottom: '4px' },
  subtitulo: { fontSize: '13px', color: '#64748b' },
  botonNueva: { padding: '8px 16px', background: '#4f46e5', color: 'white', border: 'none', borderRadius: '8px', fontSize: '13px', cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: '6px' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '12px' },
  card: { background: '#1a1d27', border: '0.5px solid #2a2d3a', borderRadius: '12px', padding: '1.25rem' },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' },
  iconBox: { width: '40px', height: '40px', borderRadius: '8px', background: '#0c2a4a', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  badge: { padding: '4px 10px', borderRadius: '999px', fontSize: '11px' },
  cardTitulo: { fontSize: '15px', fontWeight: '500', color: '#e2e8f0', marginBottom: '10px' },
  cardInfo: { display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '1rem' },
  infoItem: { fontSize: '13px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '6px' },
  botonCancelar: { width: '100%', padding: '9px', background: 'transparent', color: '#f87171', border: '0.5px solid #3a1f1f', borderRadius: '8px', fontSize: '13px', cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' },
  errorBox: { display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 14px', background: '#3a1f1f', border: '0.5px solid #7f1d1d', borderRadius: '8px', color: '#f87171', fontSize: '13px', marginBottom: '1rem' },
  empty: { display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '3rem' },
}