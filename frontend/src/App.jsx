import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'

import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Admin from './pages/Admin'
import Espacios from './pages/Espacios'
import CrearReserva from './pages/CrearReserva'
import MisReservas from './pages/MisReservas'
import TodasReservas from './pages/TodasReservas'
import GestionarEspacios from './pages/GestionarEspacios'
import GestionarUsuarios from './pages/GestionarUsuarios'

function RutaProtegida({ children }) {
  const { token } = useAuth()
  return token ? children : <Navigate to="/" />
}

function RutaAdmin({ children }) {
  const { token, esAdmin } = useAuth()
  if (!token) return <Navigate to="/" />
  if (!esAdmin) return <Navigate to="/dashboard" />
  return children
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/dashboard" element={<RutaProtegida><Dashboard /></RutaProtegida>} />
      <Route path="/espacios" element={<RutaProtegida><Espacios /></RutaProtegida>} />
      <Route path="/crear-reserva" element={<RutaProtegida><CrearReserva /></RutaProtegida>} />
      <Route path="/mis-reservas" element={<RutaProtegida><MisReservas /></RutaProtegida>} />
      <Route path="/admin" element={<RutaAdmin><Admin /></RutaAdmin>} />
      <Route path="/todas-reservas" element={<RutaAdmin><TodasReservas /></RutaAdmin>} />
      <Route path="/gestionar-espacios" element={<RutaAdmin><GestionarEspacios /></RutaAdmin>} />
      <Route path="/gestionar-usuarios" element={<RutaAdmin><GestionarUsuarios /></RutaAdmin>} />
    </Routes>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  )
}