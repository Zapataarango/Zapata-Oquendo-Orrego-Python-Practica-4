import { useEffect, useState } from 'react'
import api from '../api/axios'
import Navbar from '../components/Navbar'

export default function TodasReservas() {
  const [reservas, setReservas] = useState([])
  const [error, setError] = useState('')
  const [filtro, setFiltro] = useState('todas')

  const cargarReservas = async () => {
    try {
      const res = await api.get('/reservas/')
      setReservas(res.data)
    } catch (err) {
      setError('Error al cargar las reservas')
    }
  }

  useEffect(() => {
    cargarReservas()
  }, [])

  const cambiarEstado = async (id, estado) => {
    try {
      await api.patch(`/reservas/${id}/estado`, { estado })
      cargarReservas()
    } catch (err) {
      setError(err.response?.data?.detail || 'Error al cambiar estado')
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

  const reservasFiltradas = filtro === 'todas'
    ? reservas
    : reservas.filter(r => r.estado === filtro)

  const filtros = ['todas', 'esperando', 'aprobada', 'rechazada', 'cancelada']

  return (
    <div style={styles.page}>
      <Navbar />
      <div style={styles.content}>
        <div style={styles.header}>
          <div>
            <p style={styles.titulo}>Todas las reservas</p>
            <p style={styles.subtitulo}>{reservas.length} reservas en total</p>
          </div>
        </div>

        <div style={styles.filtros}>
          {filtros.map(f => (
            <button
              key={f}
              style={{ ...styles.filtroBton, ...(filtro === f ? styles.filtroActivo : {}) }}
              onClick={() => setFiltro(f)}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {error && (
          <div style={styles.errorBox}>
            <i className="ti ti-alert-circle" aria-hidden="true"></i> {error}
          </div>
        )}

        {reservasFiltradas.length === 0 && !error && (
          <div style={styles.empty}>
            <i className="ti ti-calendar-off" style={{ fontSize: '40px', color: '#334155' }} aria-hidden="true"></i>
            <p style={{ color: '#64748b', marginTop: '8px' }}>No hay reservas con este filtro</p>
          </div>
        )}

        <div style={styles.grid}>
          {reservasFiltradas.map((r) => (
            <div key={r.id_reserva} style={styles.card}>
              <div style={styles.cardHeader}>
                <div style={styles.iconBox}>
                  <i className="ti ti-calendar-stats" style={{ color: '#60a5fa', fontSize: '20px' }} aria-hidden="true"></i>
                </div>
                <span style={{ ...styles.badge, ...badgeEstado(r.estado) }}>{r.estado}</span>
              </div>
              <p style={styles.cardTitulo}>{r.nombre_espacio || `Espacio #${r.id_espacio}`}</p>
              <div style={styles.cardInfo}>
                <p style={styles.infoItem}><i className="ti ti-user" aria-hidden="true"></i> {r.nombre_usuario || `Usuario #${r.id_usuario}`}</p>
                <p style={styles.infoItem}><i className="ti ti-calendar" aria-hidden="true"></i> {r.fecha}</p>
                <p style={styles.infoItem}><i className="ti ti-clock" aria-hidden="true"></i> {r.hora_inicio} — {r.hora_fin}</p>
                <p style={styles.infoItem}><i className="ti ti-users" aria-hidden="true"></i> {r.cantidad_asistentes} asistentes</p>
              </div>
              {r.estado === 'esperando' && (
                <div style={styles.botones}>
                  <button style={styles.botonAprobar} onClick={() => cambiarEstado(r.id_reserva, 'aprobada')}>
                    <i className="ti ti-check" aria-hidden="true"></i> Aprobar
                  </button>
                  <button style={styles.botonRechazar} onClick={() => cambiarEstado(r.id_reserva, 'rechazada')}>
                    <i className="ti ti-x" aria-hidden="true"></i> Rechazar
                  </button>
                </div>
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
  filtros: { display: 'flex', gap: '8px', marginBottom: '1.5rem', flexWrap: 'wrap' },
  filtroBton: { padding: '6px 14px', background: 'transparent', border: '0.5px solid #2a2d3a', borderRadius: '999px', color: '#64748b', fontSize: '13px', cursor: 'pointer', fontFamily: 'inherit' },
  filtroActivo: { background: '#2e1f6e', border: '0.5px solid #4f46e5', color: '#818cf8' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px' },
  card: { background: '#1a1d27', border: '0.5px solid #2a2d3a', borderRadius: '12px', padding: '1.25rem' },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' },
  iconBox: { width: '40px', height: '40px', borderRadius: '8px', background: '#0c2a4a', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  badge: { padding: '4px 10px', borderRadius: '999px', fontSize: '11px' },
  cardTitulo: { fontSize: '15px', fontWeight: '500', color: '#e2e8f0', marginBottom: '10px' },
  cardInfo: { display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '1rem' },
  infoItem: { fontSize: '13px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '6px' },
  botones: { display: 'flex', gap: '8px' },
  botonAprobar: { flex: 1, padding: '8px', background: '#0a2e1a', color: '#34d399', border: '0.5px solid #065f46', borderRadius: '8px', fontSize: '13px', cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' },
  botonRechazar: { flex: 1, padding: '8px', background: '#3a1f1f', color: '#f87171', border: '0.5px solid #7f1d1d', borderRadius: '8px', fontSize: '13px', cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' },
  errorBox: { display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 14px', background: '#3a1f1f', border: '0.5px solid #7f1d1d', borderRadius: '8px', color: '#f87171', fontSize: '13px', marginBottom: '1rem' },
  empty: { display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '3rem' },
}