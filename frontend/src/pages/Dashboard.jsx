import Navbar from '../components/Navbar'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import api from '../api/axios'

export default function Dashboard() {
  const { usuario } = useAuth()
  const navigate = useNavigate()
  const [stats, setStats] = useState({ espacios: 0, misReservas: 0, pendientes: 0 })

  useEffect(() => {
    const cargarStats = async () => {
      try {
        const [espaciosRes, reservasRes] = await Promise.all([
          api.get('/espacios/disponibles'),
          api.get('/reservas/mis-reservas'),
        ])
        const pendientes = reservasRes.data.filter(r => r.estado === 'esperando').length
        setStats({
          espacios: espaciosRes.data.length,
          misReservas: reservasRes.data.length,
          pendientes,
        })
      } catch (err) {}
    }
    cargarStats()
  }, [])

  const cards = [
    { path: '/espacios', icon: 'ti-building-community', color: '#2e1f6e', iconColor: '#818cf8', title: 'Espacios disponibles', desc: 'Consulta los espacios que puedes reservar' },
    { path: '/mis-reservas', icon: 'ti-calendar', color: '#0c2a4a', iconColor: '#60a5fa', title: 'Mis reservas', desc: 'Consulta y gestiona tus reservas activas' },
    { path: '/crear-reserva', icon: 'ti-plus', color: '#0a2e1a', iconColor: '#34d399', title: 'Nueva reserva', desc: 'Crea una nueva reserva de espacio' },
  ]

  return (
    <div style={styles.page}>
      <Navbar />
      <div style={styles.content}>
        <p style={styles.welcome}>Bienvenido, {usuario?.nombre}</p>
        <p style={styles.subtitle}>Panel de gestión de Reservas Institucionales</p>

        <div style={styles.stats}>
          <div style={styles.stat}>
            <p style={styles.statLabel}>Espacios disponibles</p>
            <p style={{ ...styles.statValue, color: '#818cf8' }}>{stats.espacios}</p>
          </div>
          <div style={styles.stat}>
            <p style={styles.statLabel}>Mis reservas activas</p>
            <p style={{ ...styles.statValue, color: '#34d399' }}>{stats.misReservas}</p>
          </div>
          <div style={styles.stat}>
            <p style={styles.statLabel}>Pendientes de aprobación</p>
            <p style={{ ...styles.statValue, color: '#fbbf24' }}>{stats.pendientes}</p>
          </div>
        </div>

        <div style={styles.grid}>
          {cards.map((card) => (
            <div key={card.path} style={styles.card} onClick={() => navigate(card.path)}>
              <div style={{ ...styles.cardIcon, background: card.color }}>
                <i className={`ti ${card.icon}`} style={{ color: card.iconColor, fontSize: '20px' }} aria-hidden="true"></i>
              </div>
              <p style={styles.cardTitle}>{card.title}</p>
              <p style={styles.cardDesc}>{card.desc}</p>
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
  welcome: { fontSize: '20px', fontWeight: '500', color: '#e2e8f0', marginBottom: '4px' },
  subtitle: { fontSize: '13px', color: '#64748b', marginBottom: '1.5rem' },
  stats: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '1.5rem' },
  stat: { background: '#1a1d27', border: '0.5px solid #2a2d3a', borderRadius: '8px', padding: '1rem' },
  statLabel: { fontSize: '12px', color: '#64748b', marginBottom: '4px' },
  statValue: { fontSize: '24px', fontWeight: '500' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' },
  card: { background: '#1a1d27', border: '0.5px solid #2a2d3a', borderRadius: '12px', padding: '1.25rem', cursor: 'pointer' },
  cardIcon: { width: '40px', height: '40px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' },
  cardTitle: { fontSize: '14px', fontWeight: '500', color: '#e2e8f0', marginBottom: '4px' },
  cardDesc: { fontSize: '12px', color: '#64748b', lineHeight: '1.5' },
}