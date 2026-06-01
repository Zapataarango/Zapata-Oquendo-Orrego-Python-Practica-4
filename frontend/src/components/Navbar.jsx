import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { usuario, logout, esAdmin } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const isActive = (path) => location.pathname === path

  const linksUsuario = [
    { path: '/dashboard', icon: 'ti-home', label: 'Inicio' },
    { path: '/espacios', icon: 'ti-building-community', label: 'Espacios' },
    { path: '/mis-reservas', icon: 'ti-calendar', label: 'Mis reservas' },
    { path: '/crear-reserva', icon: 'ti-plus', label: 'Nueva reserva' },
  ]

  const linksAdmin = [
    { path: '/admin', icon: 'ti-home', label: 'Inicio' },
    { path: '/gestionar-espacios', icon: 'ti-building-community', label: 'Espacios' },
    { path: '/todas-reservas', icon: 'ti-calendar-stats', label: 'Reservas' },
    { path: '/gestionar-usuarios', icon: 'ti-users', label: 'Usuarios' },
  ]

  const links = esAdmin ? linksAdmin : linksUsuario
  const iniciales = usuario?.nombre?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()

  return (
    <nav style={styles.navbar}>
      <div style={styles.brand}>
        <i className="ti ti-building" style={styles.brandIcon} aria-hidden="true"></i>
        <span>ReservaITM</span>
      </div>

      <div style={styles.links}>
        {links.map((link) => (
          <button
            key={link.path}
            style={{
              ...styles.navLink,
              ...(isActive(link.path) ? styles.navLinkActive : {}),
            }}
            onClick={() => navigate(link.path)}
          >
            <i className={`ti ${link.icon}`} aria-hidden="true"></i>
            {link.label}
          </button>
        ))}
      </div>

      <div style={styles.userArea}>
        <div style={styles.avatar}>{iniciales}</div>
        <span style={styles.username}>{usuario?.nombre}</span>
        <button style={styles.logoutBtn} onClick={handleLogout}>
          <i className="ti ti-logout" aria-hidden="true"></i> Salir
        </button>
      </div>
    </nav>
  )
}

const styles = {
  navbar: {
    background: '#1a1d27',
    borderBottom: '0.5px solid #2a2d3a',
    padding: '0 1.5rem',
    height: '56px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'sticky',
    top: 0,
    zIndex: 100,
  },
  brand: {
    fontSize: '16px',
    fontWeight: '500',
    color: '#e2e8f0',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  brandIcon: {
    color: '#818cf8',
    fontSize: '20px',
  },
  links: {
    display: 'flex',
    gap: '4px',
  },
  navLink: {
    padding: '6px 14px',
    borderRadius: '8px',
    fontSize: '13px',
    color: '#94a3b8',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    border: 'none',
    background: 'transparent',
    fontFamily: 'inherit',
  },
  navLinkActive: {
    background: '#2a2d3a',
    color: '#818cf8',
  },
  userArea: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  avatar: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    background: '#3730a3',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '12px',
    fontWeight: '500',
    color: '#c7d2fe',
  },
  username: {
    fontSize: '13px',
    color: '#94a3b8',
  },
  logoutBtn: {
    padding: '5px 12px',
    borderRadius: '8px',
    fontSize: '12px',
    color: '#f87171',
    border: '0.5px solid #3a1f1f',
    background: 'transparent',
    cursor: 'pointer',
    fontFamily: 'inherit',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
}