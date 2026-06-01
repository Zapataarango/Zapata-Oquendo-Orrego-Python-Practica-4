import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'
import Navbar from '../components/Navbar'

export default function Espacios() {
  const [espacios, setEspacios] = useState([])
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const cargarEspacios = async () => {
      try {
        const res = await api.get('/espacios/disponibles')
        setEspacios(res.data)
      } catch (err) {
        setError('Error al cargar los espacios')
      }
    }
    cargarEspacios()
  }, [])

  return (
    <div style={styles.page}>
      <Navbar />
      <div style={styles.content}>
        <div style={styles.header}>
          <div>
            <p style={styles.titulo}>Espacios disponibles</p>
            <p style={styles.subtitulo}>Selecciona un espacio para reservar</p>
          </div>
        </div>

        {error && <div style={styles.errorBox}><i className="ti ti-alert-circle" aria-hidden="true"></i> {error}</div>}

        {espacios.length === 0 && !error && (
          <div style={styles.empty}>
            <i className="ti ti-building-off" style={{ fontSize: '40px', color: '#334155' }} aria-hidden="true"></i>
            <p style={{ color: '#64748b', marginTop: '8px' }}>No hay espacios disponibles</p>
          </div>
        )}

        <div style={styles.grid}>
          {espacios.map((espacio) => (
            <div key={espacio.id_espacio} style={styles.card}>
              <div style={styles.cardHeader}>
                <div style={styles.iconBox}>
                  <i className="ti ti-building-community" style={{ color: '#818cf8', fontSize: '20px' }} aria-hidden="true"></i>
                </div>
                <span style={styles.badge}>{espacio.estado}</span>
              </div>
              <p style={styles.cardTitulo}>{espacio.nombre}</p>
              <div style={styles.cardInfo}>
                <p style={styles.infoItem}>
                  <i className="ti ti-map-pin" aria-hidden="true"></i> {espacio.ubicacion}
                </p>
                <p style={styles.infoItem}>
                  <i className="ti ti-users" aria-hidden="true"></i> Capacidad: {espacio.capacidad} personas
                </p>
              </div>
              <button
                style={styles.boton}
                onClick={() => navigate(`/crear-reserva?espacio=${espacio.id_espacio}`)}
              >
                <i className="ti ti-calendar-plus" aria-hidden="true"></i> Reservar
              </button>
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
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '12px' },
  card: { background: '#1a1d27', border: '0.5px solid #2a2d3a', borderRadius: '12px', padding: '1.25rem' },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' },
  iconBox: { width: '40px', height: '40px', borderRadius: '8px', background: '#2e1f6e', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  badge: { padding: '4px 10px', borderRadius: '999px', fontSize: '11px', background: '#0a2e1a', color: '#34d399' },
  cardTitulo: { fontSize: '15px', fontWeight: '500', color: '#e2e8f0', marginBottom: '10px' },
  cardInfo: { display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '1rem' },
  infoItem: { fontSize: '13px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '6px' },
  boton: { width: '100%', padding: '9px', background: '#4f46e5', color: 'white', border: 'none', borderRadius: '8px', fontSize: '13px', cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' },
  errorBox: { display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 14px', background: '#3a1f1f', border: '0.5px solid #7f1d1d', borderRadius: '8px', color: '#f87171', fontSize: '13px', marginBottom: '1rem' },
  empty: { display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '3rem' },
}